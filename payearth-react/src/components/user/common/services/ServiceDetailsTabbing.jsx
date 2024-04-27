import React, { useEffect, useState } from "react";
import axios from "axios";
import parse from "html-react-parser";
import { FaTrash } from "react-icons/fa"; // Import the trash icon
import ServiceModal from "../services/ServiceModel";
import ServiceCalendar from "./ServiceCalendar";
import { isLogin } from "./../../../../helpers/login";
import ServiceCalendarAuth from "./ServiceCalendarAuth";

function ServiceDetailsTabbing(props) {
  const accessToken = localStorage.getItem("accessToken");
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [isCalendarAuthorized, setIsCalendarAuthorized] = useState(
    accessToken ? true : false
  );

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3); // Change the number of items per page here

  useEffect(() => {
    fetchApi();
  }, []);

  //called get api for user service review
  const authInfo = JSON.parse(localStorage.getItem("authInfo"));
  const serviceId = props.serviceId;

  //called get api for user service review
  const fetchApi = async () => {
    try {
      const response = await axios.get(`/user/get-service-review/${serviceId}`);
      const result = response.data.data;
      setReviews(result);

      // Calculate average rating
      if (result.length > 0) {
        const totalRating = result.reduce((acc, curr) => acc + curr.rating, 0);
        const average = totalRating / result.length;
        setAverageRating(average);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  // Handle opening the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Handle Closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Delete a review
  const deleteReview = async (reviewId) => {
    try {
      await axios.delete(`/user/delete-review/${reviewId}`);
      // After deleting the review, fetch updated reviews
      fetchApi();
    } catch (error) {
      console.log("Error deleting review:", error);
    }
  };

  //Converted rating value into stars
  const renderStarRating = (ratingValue) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      if (i < Math.floor(ratingValue)) {
        // Full star
        stars.push(<li className="star rated" key={i}></li>);
      } else {
        // Half star
        if (i - ratingValue === -0.5) {
          stars.push(<li className="star half-star" key={i}></li>);
        } else {
          // Empty star
          stars.push(<li className="star" key={i}></li>);
        }
      }
    }
    return <ul className="rating">{stars}</ul>;
  };

  // Function to format the date
  const formatDate = (date) => {
    return `${new Date(date).getDate()}-${
      new Date(date).getMonth() + 1
    }-${new Date(date).getFullYear()}`;
  };

  const currentUser = isLogin();

  // Function to handle calendar authorization
  const handleCalendarAuthorization = () => {
    setIsCalendarAuthorized(true);
  };

  // Pagination controls
  const nextPage = () => {
    const totalPages = Math.ceil(reviews.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // Calculate current reviews to display based on pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = reviews.slice(indexOfFirstItem, indexOfLastItem);

  // Generate page numbers
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(reviews.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <React.Fragment>
      <section className="service_details_sec" ref={props.ref}>
        <div className="container">
          <div className="row">
            <div className="com-sm-12">
              <div className="detail_tab">
                <ul className="nav nav-tabs border-0" id="myTab" role="tablist">
                  {/* Meeting Tab */}
                  {!currentUser ? (
                    ""
                  ) : (
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="meeting-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#meeting"
                        type="button"
                        role="tab"
                        aria-controls="meeting"
                        aria-selected="false"
                      >
                        Meeting
                      </button>
                    </li>
                  )}

                  {/* Description Tab */}
                  {!currentUser ? (
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="description-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#description"
                        type="button"
                        role="tab"
                        aria-controls="description"
                        aria-selected="false"
                      >
                        Description
                      </button>
                    </li>
                  ) : (
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="description-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#description"
                        type="button"
                        role="tab"
                        aria-controls="description"
                        aria-selected="false"
                      >
                        Description
                      </button>
                    </li>
                  )}

                  {/* Reviews Tab */}
                  <li className="nav-item" role="presentation">
                    <button
                      className="nav-link"
                      id="reviews-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#reviews"
                      type="button"
                      role="tab"
                      aria-controls="reviews"
                      aria-selected="true"
                    >
                      Reviews
                    </button>
                  </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                  {/* Meeting Content */}
                  {!currentUser ? (
                    ""
                  ) : !isCalendarAuthorized ? (
                    <div
                      className="tab-pane fade show active"
                      id="meeting"
                      role="tabpanel"
                      aria-labelledby="meeting-tab"
                    >
                      <ServiceCalendarAuth
                        onAuthSuccess={() => {
                          handleCalendarAuthorization();
                        }}
                        userId={authInfo.id}
                        authToken={authInfo.token}
                      />
                    </div>
                  ) : (
                    <div
                      className="tab-pane fade show active"
                      id="meeting"
                      role="tabpanel"
                      aria-labelledby="meeting-tab"
                    >
                      <p className="mb-0">
                        <ServiceCalendar authToken={authInfo.token} />
                      </p>
                    </div>
                  )}
                  {!currentUser ? (
                    props.description ? (
                      <div
                        className="tab-pane fade show active"
                        id="description"
                        role="tabpanel"
                        aria-labelledby="description-tab"
                      >
                        <p className="mb-0">{parse(props.description)}</p>
                      </div>
                    ) : (
                      ""
                    )
                  ) : (
                    <div
                      className="tab-pane fade"
                      id="description"
                      role="tabpanel"
                      aria-labelledby="description-tab"
                    >
                      <p className="mb-0">{parse(props.description)}</p>
                    </div>
                  )}
                  {/* Reviews Content */}
                  <div
                    className="tab-pane review"
                    id="reviews"
                    role="tabpanel"
                    aria-labelledby="reviews-tab"
                  >
                    <div className="row">
                      {/* Ratings and Reviews */}
                      <div className="r_col col-sm-12 col-md-3">
                        <div className="box_wrapper">
                          <div className="reviews_box">
                            <p className="review_count">
                              {/* Display average rating */}
                              Average Rating: {averageRating.toFixed(1)}
                            </p>
                            {/* Render star rating for averageRating */}
                            <p className="rating_point d-inline-flex align-items-center">
                              {renderStarRating(averageRating)}
                            </p>
                            {/* You can keep the rating distribution as it is */}
                          </div>
                        </div>
                      </div>
                      {/* User Reviews */}
                      <div className="col-sm-12 col-md-9">
                        <div className="reviews_comments_box">
                          {/* Display Reviews */}
                          {currentReviews.length > 0
                            ? currentReviews.map((review, index) => (
                                <div className="user_comment_box" key={index}>
                                  <div className="d-flex align-items-center">
                                    <p className="title mr-auto">
                                      {review.review.title}
                                    </p>
                                    {/* Add delete icon here */}
                                    <button
                                      className="btn btn-link text-danger" // Set text color to red
                                      onClick={() =>
                                        deleteReview(review.review._id)
                                      }
                                    >
                                      <FaTrash />
                                    </button>
                                  </div>
                                  <p className="rating">
                                    {renderStarRating(review.rating)}
                                  </p>
                                  <p className="feedback">
                                    {review.review.description}
                                  </p>
                                  <p className="date mb-0">
                                    {review.userId.name} |{" "}
                                    {formatDate(review.createdAt)}
                                  </p>
                                </div>
                              ))
                            : ""}

                          {/* Pagination buttons */}
                          {reviews.length > itemsPerPage && (
                            <div className="text-center mt-4">
                              <button
                                className="btn"
                                onClick={prevPage}
                                disabled={currentPage === 1}
                              >
                                Prev
                              </button>
                              {pageNumbers.map((number) => (
                                <button
                                  key={number}
                                  className={`btn ${
                                    number === currentPage ? "btn " : "btn"
                                  }`}
                                  onClick={() => setCurrentPage(number)}
                                >
                                  {number}
                                </button>
                              ))}
                              <button
                                className="btn "
                                onClick={nextPage}
                                disabled={
                                  currentPage ===
                                  Math.ceil(reviews.length / itemsPerPage)
                                }
                              >
                                Next
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Modal */}
        <ServiceModal
          isOpen={isModalOpen}
          onClose={closeModal}
          serviceId={props.serviceId}
          authInfo={authInfo}
          fetchApi={fetchApi}
        />
        {/* End Modal */}
      </section>
    </React.Fragment>
  );
}

export default ServiceDetailsTabbing;
