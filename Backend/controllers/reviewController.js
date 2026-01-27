import Review from "../models/reviewModel.js";
import Appointment from "../models/appointmentModel.js";
import Doctor from "../models/doctorModel.js";

//  Add Review
export const addReview = async (req, res) => {
  try {
    const { doctorId, appointmentId, rating, comment } = req.body;
    const userId = req.userId;

    // Check valid completed appointment
    const appointment = await Appointment.findOne({
      _id: appointmentId,
      userId,
      payment: true,
      status: "booked",
    });

    if (!appointment) {
      return res.json({
        success: false,
        message: "You can submit a review only after booking & paying for the appointment.",
      });
    }

    // PREVENT MULTIPLE REVIEWS FOR SAME APPOINTMENT
    const existingReview = await Review.findOne({ appointmentId, userId });
    if (existingReview) {
      return res.json({
        success: false,
        message: "You have already reviewed this appointment.",
      });
    }

    const review = await Review.create({
      userId,
      doctorId,
      appointmentId,
      rating,
      comment,
    });

    // Recalculate doctor rating
    const reviews = await Review.find({ doctorId });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Doctor.findByIdAndUpdate(doctorId, {
      averageRating: avgRating,
      totalReviews: reviews.length,
    });

    res.json({ success: true, message: "Review added", review });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};



//  Get All Reviews of a Doctor
export const getDoctorReviews = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const reviews = await Review.find({ doctorId })
      .populate({
        path: "userId",
        select: "_id username email image"
      });
    res.json({ success: true, reviews });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//  Edit Review
export const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.userId;

    // Find review by user
    const review = await Review.findOne({ _id: reviewId, userId });

    if (!review) {
      return res.json({
        success: false,
        message: "Unauthorized or review not found",
      });
    }

    // Update only fields provided
    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    // Recalculate doctor rating
    const reviews = await Review.find({ doctorId: review.doctorId });

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Doctor.findByIdAndUpdate(review.doctorId, {
      averageRating: avgRating,
      totalReviews: reviews.length,
    });

    res.json({ success: true, message: "Review updated successfully!" });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//  Delete Review
export const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.userId;

    const review = await Review.findOne({ _id: reviewId, userId });
    if (!review)
      return res.json({ success: false, message: "Unauthorized or not found" });

    const doctorId = review.doctorId;
    await review.deleteOne();

    // Recalculate doctor rating
    const reviews = await Review.find({ doctorId });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    await Doctor.findByIdAndUpdate(doctorId, {
      averageRating: avgRating,
      totalReviews: reviews.length,
    });

    res.json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
