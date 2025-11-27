import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

export const connectDB = () =>
  mongoose
    .connect(uri)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((err) => {
      console.log(err);
      process.exit(1);
    });

export default mongoose;
