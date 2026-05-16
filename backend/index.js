import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./config/db.js";
import bookingRoutes from "./routes/booking.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.FRONTEND_URL || "*" }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    message: "API is running",
    mongoStatus: mongoose.connection.readyState === 1 ? "connected" : "not connected",
    readyState: mongoose.connection.readyState,
  });
});

connectDB();

app.get("/", (req, res) => {
  res.send("Cleaning booking API is running");
});

app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
