const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connect to DB");
  } catch (error) {
    console.log("DataBase connection failed:", error.message);
  }
}

module.exports = connectDB;