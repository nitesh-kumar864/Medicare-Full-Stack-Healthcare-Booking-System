import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/Medicare`);

    console.log("Database connected");

    // Keep Alive Ping
    setInterval(async () => {
      try {
        await mongoose.connection.db.admin().ping();
        console.log("MongoDB kept alive");
      } catch (err) {
        console.log("Ping failed");
      }
    }, 5 * 60 * 1000);

  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export default connectDB;