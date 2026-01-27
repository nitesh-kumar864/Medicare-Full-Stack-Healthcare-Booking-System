import express from "express";
import {
  addReview,
  getDoctorReviews,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import authUser from "../middlewares/authUser.js";

const router = express.Router();

//  User routes
router.post("/add", authUser, addReview);
router.get("/doctor/:doctorId", getDoctorReviews);
router.put("/:reviewId", authUser, updateReview);
router.delete("/delete/:reviewId", authUser, deleteReview);
router.put("/update/:reviewId", authUser, updateReview);

export default router;
