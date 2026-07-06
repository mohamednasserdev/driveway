const express = require('express');
const { body } = require('express-validator');
const {
  getAllCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} = require('../controllers/carController');
const { protect, restrictTo } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

const carValidation = [
  body('name').trim().notEmpty().withMessage('Car name is required'),
  body('brand').trim().notEmpty().withMessage('Brand is required'),
  body('pricePerDay')
    .isNumeric()
    .withMessage('Price per day must be a number')
    .isFloat({ min: 0 })
    .withMessage('Price cannot be negative'),
  body('image').notEmpty().withMessage('Image URL is required'),
];

// Public routes
router.get('/', getAllCars);
router.get('/:id', getCarById);

// Admin-only routes
router.post('/', protect, restrictTo('admin'), carValidation, validate, createCar);
router.put('/:id', protect, restrictTo('admin'), updateCar);
router.delete('/:id', protect, restrictTo('admin'), deleteCar);

module.exports = router;
