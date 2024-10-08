import { useState } from 'react';
import "./RateTheRestroom.css"; 

function RateTheRestroom() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [location, setLocation] = useState(""); 
  const [submittedReviews, setSubmittedReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0 || review.trim() === "" || location.trim() === "") {
      alert("Please provide a rating, review, and location.");
      return;
    }

    if (isEditing) {
      const updatedReviews = submittedReviews.map((item, index) =>
        index === editIndex ? { rating, review, location } : item
      );
      setSubmittedReviews(updatedReviews);
      setIsEditing(false);
      setEditIndex(null);
    } else {
      setSubmittedReviews([...submittedReviews, { rating, review, location }]);
    }
   
    setRating(0);
    setReview("");
    setLocation(""); 
  };

  const handleEdit = (index) => {
    const reviewToEdit = submittedReviews[index];
    setRating(reviewToEdit.rating);
    setReview(reviewToEdit.review);
    setLocation(reviewToEdit.location);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    const updatedReviews = submittedReviews.filter((_, i) => i !== index);
    setSubmittedReviews(updatedReviews);
  };

  return (
    <div className="rate-the-restroom">
      <form onSubmit={handleSubmit} className="review-form">
        <h3>{isEditing ? "Edit Your Review" : "Rate the Restroom You Have Used"}</h3>
        <input
          type="text"
          placeholder="Enter restroom location..."
          className="location-input"
          value={location}
          onChange={(e) => setLocation(e.target.value)} 
        />
        <div className="rating">
          <span>Rating: </span>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`star ${rating >= star ? 'filled' : ''}`}
              onClick={() => setRating(star)}
            >
              ★
            </span>
          ))}
        </div>
        <textarea
          placeholder="Leave your review here..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          className="review-textarea"
        />
        <button type="submit" className="submit-button">
          {isEditing ? "Update Review" : "Submit"}
        </button>
      </form>

      {/* Display submitted reviews */}
      <div className="submitted-reviews">
        <h3>Submitted Reviews:</h3>
        {submittedReviews.length === 0 ? (
          <p>No reviews submitted yet.</p>
        ) : (
          submittedReviews.map((item, index) => (
            <div key={index} className="review-item">
              <p><strong>Location:</strong> {item.location}</p>
              <p><strong>Rating:</strong> {item.rating} ★</p>
              <p>{item.review}</p>
              <button
                className="edit-button"
                onClick={() => handleEdit(index)}
              >
                Edit
              </button>
              <button
                className="delete-button"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default RateTheRestroom;
