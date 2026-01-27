import express from "express";
import authUser from "../middlewares/authUser.js";
import authAdmin from "../middlewares/authAdmin.js";

import {
  createSupportTicket,
  getMySupportTickets,
  getAllSupportTickets,
  replySupportTicket,
} from "../controllers/supportController.js";

const router = express.Router();

router.get("/test", (req, res) => {
  res.send("Support route working");
});


router.post("/create", authUser, createSupportTicket);
router.get("/my-tickets", authUser, getMySupportTickets);

router.get("/admin/all", authAdmin, getAllSupportTickets);
router.post("/admin/reply", authAdmin, replySupportTicket);

export default router;
