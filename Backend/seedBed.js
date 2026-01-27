import mongoose from "mongoose";
import Bed from "./models/bedModel.js";
import dotenv from "dotenv";

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(`${process.env.MONGODB_URL}/Medicare`);
    console.log("Database Connected");

    await Bed.deleteMany();
    console.log("Old bed data removed");

    // Insert new record
    await Bed.create({
      totalBeds: 55,
      occupiedBeds: 0,
      bedTypes: {
        general: { total: 40, occupied: 0 },
        icu: { total: 10, occupied: 0 },
        emergency: { total: 5, occupied: 0 },
      },
    });

    console.log("Initial Bed Data Inserted");
    process.exit();
  } catch (err) {
    console.error("SEED ERROR:", err);
    process.exit(1);
  }
};

seed();
