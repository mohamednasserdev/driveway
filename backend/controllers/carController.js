const Car = require('../models/Car');

/**
 * @desc    Get all cars (with optional availability filter)
 * @route   GET /api/cars
 * @access  Public
 */
const getAllCars = async (req, res, next) => {
  try {
    const filter = {};

    // Allow filtering by availability
    if (req.query.available !== undefined) {
      filter.available = req.query.available === 'true';
    }

    // Allow filtering by category
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const cars = await Car.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: cars.length,
      cars,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single car by ID
 * @route   GET /api/cars/:id
 * @access  Public
 */
const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }

    res.status(200).json({ success: true, car });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new car
 * @route   POST /api/cars
 * @access  Admin only
 */
const createCar = async (req, res, next) => {
  try {
    const car = await Car.create(req.body);
    res.status(201).json({ success: true, message: 'Car created successfully.', car });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a car
 * @route   PUT /api/cars/:id
 * @access  Admin only
 */
const updateCar = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndUpdate(req.params.id, req.body, {
      new: true,         // Return the updated document
      runValidators: true, // Run model validators on update
    });

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }

    res.status(200).json({ success: true, message: 'Car updated successfully.', car });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a car
 * @route   DELETE /api/cars/:id
 * @access  Admin only
 */
const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);

    if (!car) {
      return res.status(404).json({ success: false, message: 'Car not found.' });
    }

    res.status(200).json({ success: true, message: 'Car deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllCars, getCarById, createCar, updateCar, deleteCar };
