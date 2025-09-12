import dotenv from "dotenv";
dotenv.config();

import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    console.log("✅ Connected to MongoDB Atlas!");

    // 1. Choose database + collection
    const db = client.db("donaldDB");            // Database name
    const users = db.collection("users");        // Collection name

    // 2. CREATE (Insert)
    const newUser = { name: "Donald", role: "Software Engineer", createdAt: new Date() };
    const insertResult = await users.insertOne(newUser);
    console.log("📥 Inserted user with ID:", insertResult.insertedId);

    // 3. READ (Find)
    const allUsers = await users.find().toArray();
    console.log("📖 All users:", allUsers);

    // 4. UPDATE
    const updateResult = await users.updateOne(
      { name: "Donald" },               // filter
      { $set: { role: "Fullstack Dev" } } // update
    );
    console.log("✏️ Updated users:", updateResult.modifiedCount);

    // 5. DELETE
    const deleteResult = await users.deleteOne({ name: "Donald" });
    console.log("🗑️ Deleted users:", deleteResult.deletedCount);

  } catch (err) {
    console.error("❌ Error:", err);
  } finally {
    await client.close();
    console.log("🔒 Connection closed");
  }
}

run();
