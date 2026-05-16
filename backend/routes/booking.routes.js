import express from "express";
import {
  createBooking,
  getBookings,
  getSingleBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/booking.controller.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, getBookings);
router.get("/:id", protect, getSingleBooking);
router.post("/", protect, adminOnly, createBooking);
router.put("/:id", protect, adminOnly, updateBooking);
router.delete("/:id", protect, adminOnly, deleteBooking);

export default router;
