import React, { useState } from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import StarRating from "../StarRating";
import { Pencil, Trash2 } from "lucide-react";

const ReviewSection = ({
  rating,
  setRating,
  comment,
  setComment,
  submitReview,
  reviewList,
  handleEditReview,
  handleDeleteReview,
  userData,
}) => {
  const [editModal, setEditModal] = useState(false);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [editReviewId, setEditReviewId] = useState(null);

  // ---------- Open Edit Modal ----------
  const openEditModal = (rev) => {
    setEditReviewId(rev._id);
    setEditRating(rev.rating);
    setEditComment(rev.comment);
    setEditModal(true);
  };

  // ---------- Validation for Submit ----------
  const validateSubmit = () => {
    if (rating === 0) {
      alert("Please give a rating before submitting.");
      return false;
    }
    if (!comment.trim() || comment.trim().length < 3) {
      alert("Please write at least 3 characters in your review.");
      return false;
    }
    return true;
  };

  const handleSubmitClick = () => {
    if (!validateSubmit()) return;
    submitReview();
  };

  // ---------- Save Edit ----------
  const saveEdit = () => {
    if (editRating === 0) {
      alert("Please select a rating.");
      return;
    }
    if (!editComment.trim() || editComment.trim().length < 3) {
      alert("Review must be at least 3 characters.");
      return;
    }

    handleEditReview(editReviewId, editRating, editComment);
    setEditModal(false);
  };

  return (
    <div className="mt-12">

      {/* ---------------- Write Review Form ---------------- */}
      <div className="border border-gray-200 shadow-sm p-6 rounded-2xl bg-white">
        <h2 className="text-xl font-semibold text-gray-800">Write a Review</h2>

        <div className="mt-3">
          <StarRating rating={rating} setRating={setRating} />
        </div>

        <textarea
          className="w-full border border-gray-300 p-3 rounded-xl mt-3 text-sm"
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button
          onClick={handleSubmitClick}
          className="bg-primary text-white px-6 py-2 rounded-full text-sm mt-4"
        >
          Submit Review
        </button>
      </div>

      {/* ---------------- Review List ---------------- */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-800">Patient Reviews</h2>

        {reviewList.length === 0 ? (
          <p className="text-gray-500 mt-2 text-sm">No reviews yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-4">

            {reviewList.map((rev) => (
              <div
                key={rev._id}
                className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5"
              >
                {/* Rating */}
                <div className="flex gap-1 text-yellow-500 text-lg">
                  {[...Array(5)].map((_, i) =>
                    i < rev.rating ? <FaStar key={i} /> : <FaRegStar key={i} />
                  )}
                </div>

                <p className="text-gray-700 text-sm mt-3">{rev.comment}</p>

                <div className="flex items-center gap-2 mt-3">
                  <img
                    src={rev.userId?.image || "/default-user.png"}
                    alt="profile"
                    className="w-8 h-8 rounded-full border object-cover"
                  />
                  <p className="text-xs text-gray-600 font-medium">
                    @{rev.userId?.username || "Unknown User"}
                  </p>
                </div>


                {/* Edit/Delete only for user */}
                {String(rev?.userId?._id) === String(userData?._id) && (
                  <div className="flex gap-3 mt-4">

                    <button
                      onClick={() => openEditModal(rev)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm 
                                 text-blue-600 border border-blue-400 
                                 rounded-full hover:bg-blue-50 hover:shadow-sm 
                                 transition-all"
                    >
                      <Pencil size={16} /> Edit
                    </button>

                    <button
                      onClick={() => handleDeleteReview(rev._id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm 
                                 text-red-600 border border-red-400 
                                 rounded-full hover:bg-red-50 hover:shadow-sm 
                                 transition-all"
                    >
                      <Trash2 size={16} /> Delete
                    </button>

                  </div>
                )}
              </div>
            ))}

          </div>
        )}
      </div>

      {/* ---------- EDIT MODAL ---------- */}
      {editModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">

            <h3 className="text-lg font-semibold mb-3">Edit Review</h3>

            <StarRating rating={editRating} setRating={setEditRating} />

            <textarea
              className="w-full border p-3 rounded-lg mt-3"
              value={editComment}
              onChange={(e) => setEditComment(e.target.value)}
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                className="px-4 py-2 bg-primary text-white rounded-md"
              >
                Save
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default ReviewSection;
