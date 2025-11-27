import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI || "mongodb+srv://Finesse:8331097721@cluster0.lwtbmel.mongodb.net/";

const testConnection = async () => {
  try {
    console.log("Testing MongoDB connection\n");
    const conn = await mongoose.connect(uri);
    console.log("Connected to MongoDB cluster");
    const collections = await conn.connection.db.listCollections().toArray();
    if (collections.length === 0) {
      console.log("No collections found");
    } else {
      console.log("Collections:");
      collections.forEach(({ name }) => console.log(`- ${name}`));
    }
    await mongoose.disconnect();
    console.log("\nConnection successful");
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err.message);
    process.exit(1);
  }
};

testConnection();
