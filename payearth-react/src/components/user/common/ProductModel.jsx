import React, { useState } from "react";
import { Rating } from "react-simple-star-rating";
import axios from "axios";

function ProductModel({ isOpen, onClose, productId, authInfo, fetchApi, fetchRating }) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState({ title: "", description: "" });

  //Submit form by HandleSubmit Function
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const reviewData = {
        title: review.title,
        description: review.description,
        rating: rating,
        productId: productId,
        userId: authInfo.id,
      };

      console.log("reviewData", reviewData);

      // const response = await axios.post(`/user/product-review`, reviewData,
      //   headers: {
      //   Authorization: `Bearer ${token}`, // Include the token
      // },
      // );
      const response = await axios.post('/user/product-review', reviewData,{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${authInfo.token}`
      }});
      console.log("Review submitted successfully!", response);
      //called get api for show updated data
      fetchApi(productId);
      fetchRating(productId);
      // Clear the form fields after successful submission
      setRating(0);
      setReview({ title: "", description: "" });
    } catch (error) {
      console.error("Error submitting review:", error);
    }
    onClose();
  };

  //Handle OnChange
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReview({ ...review, [name]: value });
  };

  return (
    <React.Fragment>
      <div
        className={`modal ${isOpen ? "show" : ""}`}
        style={{ display: isOpen ? "block" : "none" }}
      >
        {/* Modal content */}
        <div className="modal-xl modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Write a Review</h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="reviewTitle" className="form-label">
                    Add a headline
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="reviewTitle"
                    name="title"
                    value={review.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="reviewDescription" className="form-label">
                    Add a written review
                  </label>
                  <textarea
                    className="form-control"
                    id="reviewDescription"
                    name="description"
                    rows="3"
                    value={review.description}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="rating">Rating</label>
                  <br />
                  <Rating
                    allowFraction
                    onClick={(value) => setRating(value)}
                    ratingValue={rating}
                  />
                </div>
                <button type="submit" className="btn custom_btn btn_yellow">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default ProductModel;
