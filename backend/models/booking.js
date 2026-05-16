import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    cleaningType: {
      type: String,
      required: true,
      trim: true,
    },

    area: {
      type: String,
      required: true,
      enum: [
        "NE Calgary",
        "SE Calgary",
        "NW Calgary",
        "SW Calgary",
        "Downtown",
        "Other area in Calgary",
      ],
    },

    focusDetails: {
      type: String,
      trim: true,
    },

    date: {
      type: String,
      required: true,
    },

    time: {
      type: String,
      required: true,
    },

    fullAddress: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    addedBy: {
      type: String,
      trim: true,
    },
    scopeOfWork: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);