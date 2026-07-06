require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Car = require('../models/Car');

const cars = [
  {
    name: 'Camry XSE',
    brand: 'Toyota',
    pricePerDay: 65,
    image: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800',
    features: ['Bluetooth', 'Backup Camera', 'Lane Assist', 'Apple CarPlay'],
    available: true,
    category: 'standard',
    seats: 5,
    transmission: 'automatic',
  },
  {
    name: 'Civic Sport',
    brand: 'Honda',
    pricePerDay: 55,
    image: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
    features: ['Sunroof', 'Honda Sensing', 'Android Auto', 'Heated Seats'],
    available: true,
    category: 'economy',
    seats: 5,
    transmission: 'manual',
  },
  {
    name: 'Model 3',
    brand: 'Tesla',
    pricePerDay: 120,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800',
    features: ['Autopilot', '15" Touchscreen', 'Full Self-Driving', 'Over-the-Air Updates'],
    available: true,
    category: 'luxury',
    seats: 5,
    transmission: 'automatic',
  },
  {
    name: 'Escalade ESV',
    brand: 'Cadillac',
    pricePerDay: 175,
    image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
    features: ['Third Row Seating', 'Night Vision', 'Magnetic Ride Control', 'AKG Audio'],
    available: true,
    category: 'suv',
    seats: 8,
    transmission: 'automatic',
  },
  {
    name: 'Mustang GT',
    brand: 'Ford',
    pricePerDay: 95,
    image: 'https://images.unsplash.com/photo-1584345604476-8ec5f82d718d?w=800',
    features: ['V8 Engine', 'Launch Control', 'Track Apps', 'SYNC 4'],
    available: true,
    category: 'luxury',
    seats: 4,
    transmission: 'manual',
  },
  {
    name: 'RAV4 Adventure',
    brand: 'Toyota',
    pricePerDay: 80,
    image: 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=800',
    features: ['AWD', 'Toyota Safety Sense', 'Roof Rails', 'Multi-terrain Select'],
    available: true,
    category: 'suv',
    seats: 5,
    transmission: 'automatic',
  },
];

const seed = async () => {
  await connectDB();

  try {
    // Clear existing data
    await Car.deleteMany({});
    await User.deleteMany({});

    // Create admin user
    await User.create({
      name: 'Admin User',
      email: 'admin@carrental.com',
      password: 'admin123',
      role: 'admin',
    });

    // Create regular user
    await User.create({
      name: 'John Doe',
      email: 'user@carrental.com',
      password: 'user1234',
      role: 'user',
    });

    // Seed cars
    await Car.insertMany(cars);

    console.log('✅ Database seeded successfully!');
    console.log('👤 Admin: admin@carrental.com / admin123');
    console.log('👤 User:  user@carrental.com / user1234');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    mongoose.connection.close();
  }
};

seed();
