import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "./models/user.js";
import connectDB from "./config/db.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  const existingAdmin = await User.findOne({ username: "admin" });
  const existingCleaner = await User.findOne({ username: "cleaner" });

  if (!existingAdmin) {
    await User.create({ name: "Admin User", username: "admin", password: "admin123", role: "admin" });
    console.log("Created admin — username: admin, password: admin123");
  } else {
    console.log("Admin already exists, skipping.");
  }

  if (!existingCleaner) {
    await User.create({ name: "Cleaner User", username: "cleaner", password: "cleaner123", role: "cleaner" });
    console.log("Created cleaner — username: cleaner, password: cleaner123");
  } else {
    console.log("Cleaner already exists, skipping.");
  }

  await mongoose.disconnect();
  console.log("Seed complete.");
  process.exit(0);
};

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
