import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { MongoClient, type Db } from "mongodb";

const DB_NAME = process.env.DB_NAME || "fixora";

type MongoState = { client: MongoClient; db: Db; closed: boolean };

// Reuse one client across hot reloads and serverless invocations
const globalForMongo = global as unknown as { _authMongo?: MongoState };

function createMongoState(): MongoState {
  // Fail fast (default is 30s) so a connectivity problem shows up as a quick, clear error
  // instead of a hanging request, and keep the pool small for serverless.
  const client = new MongoClient(process.env.MONGODB_URI!, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
    maxPoolSize: 5,
  });
  const state: MongoState = { client, db: client.db(DB_NAME), closed: false };

  // The driver closes a client's topology for good when its *first* connect attempt
  // fails, and every later operation on that client throws MongoTopologyClosedError.
  // Cached in `global`, such a client would stay broken until the instance is
  // recycled, so remember it and build a fresh client instead of reusing it.
  client.on("topologyClosed", () => {
    state.closed = true;
  });

  return state;
}

function getDb(): Db {
  const cached = globalForMongo._authMongo;
  if (cached && !cached.closed) return cached.db;
  return (globalForMongo._authMongo = createMongoState()).db;
}

// Better Auth captures the Db once at startup, so give it a facade that always
// resolves to the current healthy client.
const db = new Proxy({} as Db, {
  get(_target, prop) {
    const current = getDb();
    const value = Reflect.get(current, prop, current);
    return typeof value === "function" ? value.bind(current) : value;
  },
});

const trustedOrigins = (process.env.TRUSTED_ORIGINS || process.env.BETTER_AUTH_URL || "")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db),
  trustedOrigins,

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6, // BetterAuth default is 8, the brief says 6
    autoSignIn: true,
  },
    socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },

  account: {
    // If someone signed up with email first and later uses Google with the same
    // address, link both logins to one account instead of creating a duplicate.
    accountLinking: {
      enabled: true,
      trustedProviders: ["google"],
      updateUserInfoOnLink: true,
    },
  },

  user: {
    modelName: "users", // BetterAuth's user collection IS our users collection
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      phone: { type: "string", required: false },
      area: { type: "string", required: false },
      bio: { type: "string", required: false },
    },
  },

  databaseHooks: {
    user: {
      create: {
        // Server-side rule: anything except 'technician' becomes 'customer'.
        // Covers email sign-up, a hand-crafted API call and Google sign-in.
        before: async (user) => {
          const requested = (user as { role?: string }).role;
          return { data: { ...user, role: requested === "technician" ? "technician" : "customer" } };
        },
      },
    },
  },

  hooks: {
    // Stop users promoting themselves through BetterAuth's update-user endpoint.
    // Roles are changed only by the admin API on the Express server (Step 10).
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/update-user") {
        const body = (ctx.body ?? {}) as Record<string, unknown>;
        if ("role" in body) {
          throw new APIError("FORBIDDEN", { message: "Role cannot be changed from here." });
        }
      }
    }),
  },

  plugins: [
    jwt({
      jwt: {
        expirationTime: "15m",
        // Keep the token small. Express reads the role from the database, never from here.
        definePayload: ({ user }) => ({ email: user.email, name: user.name }),
      },
    }),
    nextCookies(), // must be last
  ],
});