import express from "express";
import authUser from "../middlewares/authUser.js";
import { downloadPrescription } from "../controllers/prescriptionController.js";

const router = express.Router();

router.get("/download/:id", authUser, downloadPrescription);

export default router;