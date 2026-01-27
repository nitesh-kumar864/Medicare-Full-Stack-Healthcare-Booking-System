import mongoose from "mongoose";

const connectDB = async () => {
    
    mongoose.connection.on('connected', () => 
    console.log("Datbase connected"));
    await mongoose.connect(`${process.env.MONGODB_URL}/Medicare`)
}

export default connectDB;