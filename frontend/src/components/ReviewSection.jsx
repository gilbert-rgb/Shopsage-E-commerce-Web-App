import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { toast } from "react-toastify";
import config from "../config.json";

const api_url = config.api_url;

const ReviewSection = () => {
  const { id: productId } = useParams();
  const { auth_token, currentUser } = useContext(UserContext);

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [editingReviewId, setEditingReviewId] = useState(null);

  useEffect(() => {
    fetch(`${api_url}/reviews/product/${productId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed");
        return res.json();
      })
      .then((data) => {
        setReviews(Array.isArray(data) ? data : []);
      })
      .catch(() => toast.error("Failed to fetch reviews"));
  }, [productId]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!currentUser) {
      toast.error("Please login to post a review");
      return;
    }

    const payload = {
      product_id: parseInt(productId),
      rating,
      comment,
    };

    fetch(`${api_url}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.review) {
          toast.success(data.success);
          setReviews((prev) => [
            ...prev,
            {
              ...data.review,
              username: currentUser.username,
            },
          ]);
          setRating(5);
          setComment("");
        } else {
          toast.error(data.error || "Failed to submit review");
        }
      })
      .catch(() => toast.error("Network error submitting review"));
  };

  const handleEdit = (reviewId) => {
    const review = reviews.find((r) => r.id === reviewId);
    if (!review) return;
    setEditingReviewId(reviewId);
    setRating(review.rating);
    setComment(review.comment);
  };

  const handleUpdate = (e) => {
    e.preventDefault();

    fetch(`${api_url}/reviews/${editingReviewId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth_token}`,
      },
      body: JSON.stringify({ rating, comment }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Review updated");
          setReviews((prev) =>
            prev.map((r) =>
              r.id === editingReviewId ? { ...r, rating, comment } : r
            )
          );
          setEditingReviewId(null);
          setRating(5);
          setComment("");
        } else {
          toast.error(data.error || "Failed to update review");
        }
      })
      .catch(() => toast.error("Network error updating review"));
  };

  const handleDelete = (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;

    fetch(`${api_url}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${auth_token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Review deleted");
          setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        } else {
          toast.error(data.error || "Failed to delete review");
        }
      })
      .catch(() => toast.error("Network error deleting review"));
  };

  return (
    <div className="mt-10 border-t pt-6">
      <h2 className="text-xl font-bold mb-4">Customer Reviews</h2>

      {reviews.length > 0 ? (
        reviews.map((review) => (
          <div key={review.id} className="mb-4 p-4 border rounded bg-gray-50">
            <p className="text-sm text-gray-700">
              <strong>{review.username}</strong> •{" "}
              <span className="text-yellow-600">★ {review.rating}</span>
            </p>
            <p className="text-gray-800">{review.comment}</p>
            {currentUser && currentUser.id === review.user_id && (
              <div className="space-x-2 mt-2">
                <button
                  className="text-blue-500 underline"
                  onClick={() => handleEdit(review.id)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 underline"
                  onClick={() => handleDelete(review.id)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      ) : (
        <p className="text-gray-500">No reviews yet.</p>
      )}

      {currentUser && (
        <form
          onSubmit={editingReviewId ? handleUpdate : handleSubmit}
          className="mt-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">Rating:</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="border px-2 py-1 rounded"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border rounded p-2"
            rows={4}
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            {editingReviewId ? "Update Review" : "Submit Review"}
          </button>
        </form>
      )}
    </div>
  );
};

export default ReviewSection;
