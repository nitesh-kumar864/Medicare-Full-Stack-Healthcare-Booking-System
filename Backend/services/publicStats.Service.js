import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

export const getPublicStatsService = async () => {
    const doctorCount = await doctorModel.countDocuments();
    const appointmentCount = await appointmentModel.countDocuments();
    const patientCount = await userModel.countDocuments();

    return {
        success: true,
        stats: {
            doctors: doctorCount,
            appointments: appointmentCount,
            patients: patientCount,
        }
    }
};