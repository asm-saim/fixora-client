import { MongoClient } from "mongodb";

const email = process.argv[2]?.toLowerCase();
if (!email) {
  console.error("Usage: node --env-file=.env.local scripts/verify-email.mjs saim777m@gmail.com");
  process.exit(1);
}

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const result = await client
  .db(process.env.DB_NAME || "fixora")
  .collection("users")
  .updateOne({ email }, { $set: { emailVerified: true } });
await client.close();

console.log(result.matchedCount ? `Marked ${email} as verified` : `No user found with email ${email}`);