
import {
    blockDoctorSlotService,
    unblockDoctorSlotService,
    blockDoctorDateService,
    unblockDoctorDateService,
} from "../../services/doctor/doctorAvailability.Service.js";


// BLOCK ONE SLOT
export const blockDoctorSlot = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { date, time } = req.body;

        const result = await blockDoctorSlotService({
            doctorId,
            date,
            time,
        });

        return res.status(result.status || (result.success ? 200 : 400)).json(result);
    } catch (error) {
        console.error("Block doctor slot error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error while blocking the slot",
        });
    }
};

// UNBLOCK ONE SLOT
export const unblockDoctorSlot = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { date, time } = req.body;

        const result = await unblockDoctorSlotService({
            doctorId,
            date,
            time,
        });

        return res.status(result.status || (result.success ? 200 : 400)).json(result);
    } catch (error) {
        console.error("Unblock doctor slot error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error while unblocking the slot",
        });
    }
};

// BLOCK AN ENTIRE DATE
export const blockDoctorDate = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { date } = req.body;

        const result = await blockDoctorDateService({
            doctorId,
            date,
        });

        return res.status(result.status || (result.success ? 200 : 400)).json(result);
    } catch (error) {
        console.error("Block doctor date error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error while blocking the date",
        });
    }
};

// UNBLOCK AN ENTIRE DATE
export const unblockDoctorDate = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { date } = req.body;

        const result = await unblockDoctorDateService({
            doctorId,
            date,
        });

        return res.status(result.status || (result.success ? 200 : 400)).json(result);
    } catch (error) {
        console.error("Unblock doctor date error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error while unblocking the date",
        });
    }

}