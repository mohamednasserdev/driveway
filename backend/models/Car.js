const mongoose = require('mongoose');

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Car name is required'],
      trim: true,
    },
    brand: {
      type: String,
      required: [true, 'Brand is required'],
      trim: true,
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required'],
      min: [0, 'Price cannot be negative'],
    },
    image: {
      type: String,
      required: [true, 'Car image URL is required'],
    },
    features: {
      type: [String],
      default: [],
    },
    available: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      enum: ['economy', 'standard', 'luxury', 'suv', 'van'],
      default: 'standard',
    },
    seats: {
      type: Number,
      default: 5,
    },
    transmission: {
      type: String,
      enum: ['automatic', 'manual'],
      default: 'automatic',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Car', carSchema);
