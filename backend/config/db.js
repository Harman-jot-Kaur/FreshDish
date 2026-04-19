const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 seconds
      socketTimeoutMS: 45000, // 45 seconds
      connectTimeoutMS: 10000, // 10 seconds
      retryWrites: true,
      w: "majority",
    });
    console.log("MongoDB connected:", mongoose.connection.host);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    // Retry after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

// Listen for disconnected event and try to reconnect
mongoose.connection.on("disconnected", () => {
  console.error("MongoDB disconnected! Attempting to reconnect...");
  connectDB();
});

module.exports = connectDB;
