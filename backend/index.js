import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import bookingRoutes from "./routes/booking.routes.js";
import mongoose from "mongoose";
dotenv.config();

const app = express();
app.get("/api/health", (req, res) => {
  res.json({
    message: "API is running",
    mongoStatus:
      mongoose.connection.readyState === 1 ? "connected" : "not connected",
    readyState: mongoose.connection.readyState,
  });
});
connectDB();

app.use(cors(process.env.FRONTEND_URL || "*"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Cleaning booking API is running");
});

app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});