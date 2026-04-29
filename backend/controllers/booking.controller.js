import Booking from "../models/booking.js";

// Create booking
export const createBooking = async (req, res) => {
  try {
    const {
  fullName,
  email,
  phone,
  cleaningType,
  area,
  focusDetails,
  date,
  time,
  fullAddress,
  price,
} = req.body;

    if (
      !fullName ||
      !email ||
      !phone ||
      !cleaningType ||
      !area ||
      !date ||
      !time ||
      !fullAddress ||
      price === undefined
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

   const booking = await Booking.create({
  fullName,
  email,
  phone,
  cleaningType,
  area,
  focusDetails,
  date,
  time,
  fullAddress,
  price,
});

    res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

// Get all bookings with filters
export const getBookings = async (req, res) => {
  try {
    const { search, area, cleaningType, date, minPrice, maxPrice } = req.query;

    let filter = {};

    if (search) {
      filter.fullName = { $regex: search, $options: "i" };
    }

    if (area) {
      filter.area = area;
    }

    if (cleaningType) {
      filter.cleaningType = { $regex: cleaningType, $options: "i" };
    }

    if (date) {
      filter.date = date;
    }

    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice) {
        filter.price.$gte = Number(minPrice);
      }

      if (maxPrice) {
        filter.price.$lte = Number(maxPrice);
      }
    }

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch bookings",
      error: error.message,
    });
  }
};

// Get single booking
export const getSingleBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch booking",
      error: error.message,
    });
  }
};

// Update booking
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json({
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update booking",
      error: error.message,
    });
  }
};

// Delete booking
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json({
      message: "Booking deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete booking",
      error: error.message,
    });
  }
};