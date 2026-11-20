import { MongoClient } from "mongodb";

const doDelete = process.argv.includes("--delete");
const force = process.argv.includes("--force");

const client = new MongoClient(process.env.MONGODB_URI);
await client.connect();
const db = client.db(process.env.DB_NAME || "fixora");

const users = await db.collection("users").find({}, { projection: { _id: 1 } }).toArray();
const userIds = new Set(users.map((u) => String(u._id))); // String() so ObjectId vs string ids still match

const accounts = await db.collection("account").find({}).toArray();
const orphans = accounts.filter((a) => !userIds.has(String(a.userId)));
const orphanUserIds = [...new Set(orphans.map((a) => a.userId))];

const sessions = await db.collection("session").find({ userId: { $in: orphanUserIds } }).toArray();
const verifications = await db
  .collection("verification")
  .find({ userId: { $in: orphanUserIds } })
  .toArray();

console.log(
  `users: ${users.length}, accounts: ${accounts.length}, orphaned accounts: ${orphans.length}, orphaned sessions: ${sessions.length}, orphaned verifications: ${verifications.length}`
);
for (const a of orphans) {
  console.log({
    _id: String(a._id),
    providerId: a.providerId,
    accountId: a.accountId,
    userId: String(a.userId),
    userIdType: a.userId?.constructor?.name,
  });
}

if (!orphans.length) {
  console.log("Nothing to repair.");
} else if (orphans.length === accounts.length && !force) {
  console.log("\nEVERY account looks orphaned. That usually means the users live in a different collection or DB, not that they are all stale. Not deleting. Send me this output.");
} else if (!doDelete) {
  console.log("\nDry run. Re-run with --delete to remove the orphaned accounts.");
} else {
  const deletedAccounts = await db.collection("account").deleteMany({ _id: { $in: orphans.map((o) => o._id) } });
  const deletedSessions = await db.collection("session").deleteMany({ _id: { $in: sessions.map((s) => s._id) } });
  const deletedVerifications = await db.collection("verification").deleteMany({ _id: { $in: verifications.map((v) => v._id) } });

  console.log(
    `Deleted ${deletedAccounts.deletedCount} orphaned account(s), ${deletedSessions.deletedCount} session(s) and ${deletedVerifications.deletedCount} verification(s).`
  );
}

await client.close();