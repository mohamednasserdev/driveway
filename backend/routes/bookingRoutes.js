const express = require('express');
const { body } = require('express-validator');
const {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  getStats,
} = require('../controllers/bookingController');
const { protect, restrictTo } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

// All booking routes require authentication
router.use(protect);

// User routes
router.post(
  '/',
  [
    body('carId').notEmpty().withMessage('Car ID is required'),
    body('startDate').isISO8601().withMessage('Valid start date is required'),
    body('endDate').isISO8601().withMessage('Valid end date is required'),
  ],
  validate,
  createBooking
);

router.get('/my', getMyBookings);
router.get('/:id', getBookingById);
router.patch(
  '/:id/status',
  [body('status').isIn(['pending', 'confirmed', 'cancelled', 'completed']).withMessage('Invalid status')],
  validate,
  updateBookingStatus
);

// Admin-only routes
router.get('/', restrictTo('admin'), getAllBookings);
router.get('/admin/stats', restrictTo('admin'), getStats);

module.exports = router;
