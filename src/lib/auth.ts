import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

// Reuse one client across hot reloads and serverless invocations
const globalForMongo = global as unknown as { _authMongo?: MongoClient };
const client = (globalForMongo._authMongo ??= new MongoClient(process.env.MONGODB_URI!));
const db = client.db(process.env.DB_NAME || "fixora");

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