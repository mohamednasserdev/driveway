const Booking = require('../models/Booking');
const Car = require('../models/Car');

/**
 * Checks if a car has an overlapping active booking for the given date range.
 *
 * Overlap occurs when two date ranges [A, B] and [C, D] satisfy: A < D && C < B
 * (i.e., they are NOT disjoint: A >= D or C >= B)
 *
 * We exclude 'cancelled' bookings from the overlap check so that cancelled
 * bookings free up the car for re-booking.
 *
 * @param {string} carId - The car's MongoDB ObjectId
 * @param {Date} startDate - Start of the desired booking
 * @param {Date} endDate - End of the desired booking
 * @param {string} [excludeBookingId] - Optional booking ID to exclude (for updates)
 * @returns {Promise<boolean>} - True if there is an overlap
 */
const hasBookingOverlap = async (carId, startDate, endDate, excludeBookingId = null) => {
  const query = {
    car: carId,
    status: { $nin: ['cancelled'] }, // Active bookings only
    // Overlap condition: existing.startDate < newEndDate AND existing.endDate > newStartDate
    startDate: { $lt: endDate },
    endDate: { $gt: startDate },
  };

  if (excludeBookingId) {
    query._id = { $ne: excludeBookingId };
  }

  const conflicting = await Booking.findOne(query);
  return !!conflicting;
};

/**
 * @desc    Create a new booking
 * @route   POST /api/bookings
 * @access  Private (authenticated users)
 */
const createBooking = async (req, res, next) => {
  try {
    const { carId, startDate, endDate, notes } = req.body;

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Validate date logic
    if (end <= start) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date.',
      });
    }

    if (start < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be in the past.',
      });
    }

    // Verify car exists and is available
    const car = await Car.findById(carId);
    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }

    if (!car.available) {
      return res.status(400).json({
        success: false,
        message: 'This car is currently not available for booking.',
      });
    }

    // Check for overlapping bookings (core booking conflict detection)
    const overlap = await hasBookingOverlap(carId, start, end);
    if (overlap) {
      return res.status(409).json({
        success: false,
        message: 'This car is already booked for the selected dates. Please choose different dates.',
      });
    }

    // Calculate total price: number of days × price per day
    const msPerDay = 1000 * 60 * 60 * 24;
    const days = Math.ceil((end - start) / msPerDay);
    const totalPrice = days * car.pricePerDay;

    const booking = await Booking.create({
      user: req.user._id,
      car: carId,
      startDate: start,
      endDate: end,
      totalPrice,
      notes,
    });

    // Populate car and user details for the response
    await booking.populate(['car', { path: 'user', select: 'name email' }]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully.',
      booking,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get bookings for the currently logged-in user
 * @route   GET /api/bookings/my
 * @access  Private
 */
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('car', 'name brand image pricePerDay')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all bookings (admin view)
 * @route   GET /api/bookings
 * @access  Admin only
 */
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('car', 'name brand image pricePerDay')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, bookings });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single booking by ID
 * @route   GET /api/bookings/:id
 * @access  Private (owner or admin)
 */
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('car')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Only the booking owner or an admin can view it
    if (
      booking.user._id.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this booking.' });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update booking status (admin) or cancel own booking (user)
 * @route   PATCH /api/bookings/:id/status
 * @access  Private
 */
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Users can only cancel their own bookings; admins can set any status
    if (req.user.role !== 'admin') {
      if (booking.user.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized.' });
      }
      if (status !== 'cancelled') {
        return res.status(403).json({
          success: false,
          message: 'Users can only cancel their bookings.',
        });
      }
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ success: true, message: 'Booking status updated.', booking });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get system statistics
 * @route   GET /api/bookings/stats
 * @access  Admin only
 */
const getStats = async (req, res, next) => {
  try {
    const Car = require('../models/Car');
    const User = require('../models/User');

    const [totalCars, totalBookings, totalUsers, revenueData] = await Promise.all([
      Car.countDocuments(),
      Booking.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Booking.aggregate([
        { $match: { status: { $in: ['confirmed', 'completed'] } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),
    ]);

    const totalRevenue = revenueData[0]?.total || 0;

    // Bookings by status breakdown
    const statusBreakdown = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalCars,
        totalBookings,
        totalUsers,
        totalRevenue,
        statusBreakdown,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getStats,
};
