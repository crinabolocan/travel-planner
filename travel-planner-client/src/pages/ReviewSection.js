import React, { useState, useEffect } from "react";
import tripApi from "../api/tripPlannerApi";
import { jwtDecode } from "jwt-decode";

const ReviewSection = ({ tripId }) => {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(5);

  const token = localStorage.getItem("token");
  const decoded = token ? jwtDecode(token) : null;
  const currentUser = decoded?.["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"];

  const loadReviews = async () => {
    try {
      const res = await tripApi.get(`/trip/${tripId}/reviews`);
      setReviews(res.data);
    } catch (err) {
      console.error("Eroare la încărcarea review-urilor:", err);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [tripId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await tripApi.post("/review", { tripId, comment, rating });
      setComment("");
      setRating(5);
      await loadReviews();
    } catch (err) {
      console.error("Eroare la trimiterea review-ului:", err);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      await tripApi.delete(`/review/${reviewId}`);
      await loadReviews();
    } catch (err) {
      console.error("Eroare la ștergerea review-ului:", err);
    }
  };

  return (
    <div className="review-section">
      <h3>Recenzii</h3>

      <form onSubmit={handleSubmit} className="review-form">
        <textarea
          placeholder="Scrie un comentariu..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <label>
          Rating:
          <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </label>
        <button type="submit">Trimite recenzie</button>
      </form>

      <ul className="review-list">
        {reviews.map((rev) => (
          <li key={rev.id}>
            <strong>{rev.username}</strong> ({rev.rating}/10)
            <p>{rev.comment}</p>
            {rev.username === currentUser && (
              <button onClick={() => handleDelete(rev.id)} className="button">
                Șterge
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReviewSection;
