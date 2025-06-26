const mongoose = require("mongoose");
const colors = require("colors");
const dotenv = require("dotenv");
dotenv.config();

const connectDB = async () => {
  try {
    console.log(`Attempting to connect to MongoDB...`.yellow);
    
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      family: 4, // Force IPv4
      maxPoolSize: 10, // Maintain up to 10 socket connections
    });

    console.log(
      `MongoDB Connected: ${conn.connection.host}`.cyan.underline.bold
    );
  } catch (err) {
    console.log(`MongoDB Connection Error: ${err.message}`.red);
    console.log(`Error details: ${err}`.red);
    process.exit(1);
  }
};

module.exports = connectDB;
