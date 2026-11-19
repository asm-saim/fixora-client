import { MongoClient } from "mongodb";

const {
  BETTER_AUTH_URL, MONGODB_URI, DB_NAME = "fixora",
  ADMIN_NAME = "Fixora Admin", ADMIN_EMAIL, ADMIN_PASSWORD,
} = process.env;

if (!BETTER_AUTH_URL || !MONGODB_URI || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Set BETTER_AUTH_URL, MONGODB_URI, ADMIN_EMAIL and ADMIN_PASSWORD in .env.local");
  process.exit(1);
}

// 1. Create the account through BetterAuth (password hashing done properly)
const res = await fetch(`${BETTER_AUTH_URL}/api/auth/sign-up/email`, {
  method: "POST",
  headers: { "Content-Type": "application/json", Origin: BETTER_AUTH_URL },
  body: JSON.stringify({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
});
const body = await res.json().catch(() => ({}));
if (!res.ok && body?.code !== "USER_ALREADY_EXISTS") {
  console.error("Sign-up failed:", res.status, body);
  process.exit(1);
}

// 2. Promote to admin directly in the database (the only way to get this role)
const client = new MongoClient(MONGODB_URI);
await client.connect();
const result = await client
  .db(DB_NAME)
  .collection("users")
  .updateOne({ email: ADMIN_EMAIL.toLowerCase() }, { $set: { role: "admin" } });
await client.close();

console.log(result.matchedCount ? `Admin ready: ${ADMIN_EMAIL}` : "User not found, check DB_NAME matches");