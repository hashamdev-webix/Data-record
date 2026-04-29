import express from "express";

import {
  createBooking,
  getBookings,
  getSingleBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/booking.controller.js";

const router = express.Router();

router.post("/", createBooking);
router.get("/", getBookings);
router.get("/:id", getSingleBooking);
router.put("/:id", updateBooking);
router.delete("/:id", deleteBooking);

export default router;