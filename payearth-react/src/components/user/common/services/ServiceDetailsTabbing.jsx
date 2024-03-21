import React, { useEffect, useState } from "react";
import axios from "axios";
import parse from "html-react-parser";
import ServiceModal from "../services/ServiceModel";
import ServiceCalendar from "./ServiceCalendar";
import { isLogin } from "./../../../../helpers/login";

function ServiceDetailsTabbing(props) {
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

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
                  ) : <ServiceCalendar /> ? (
                    <div
                      className="tab-pane fade show active"
                      id="meeting"
                      role="tabpanel"
                      aria-labelledby="meeting-tab"
                    >
                      <p className="mb-0">
                        <ServiceCalendar />
                      </p>
                    </div>
                  ) : (
                    ""
                  )}

                  {/* Description Content */}
                  {props.description ? (
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
                  )}
                  {/* Reviews Content */}
                  <div
                    className="tab-pane review "
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

                            <button
                              className={`btn custom_btn btn_yellow_bordered w-auto d-inline-block ${
                                !authInfo || authInfo.id === undefined
                                  ? "disabled"
                                  : ""
                              }`}
                              onClick={() =>
                                authInfo &&
                                authInfo.id !== undefined &&
                                openModal()
                              }
                            >
                              Write a review
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* User Reviews */}
                      <div className="col-sm-12 col-md-9">
                        <div className="reviews_comments_box">
                          <div className="reviews_comments_box">
                            {/* Display Reviews */}
                            {reviews.length > 0 ? (
                              reviews.map((review, index) => (
                                <div className="user_comment_box" key={index}>
                                  <p className="title">{review.review.title}</p>
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
                            ) : (
                              <p>No reviews available</p>
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

////////////////////////////////////
////////////////////////////////////

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import parse from "html-react-parser";
// import ServiceModal from "../services/ServiceModel";

// function ServiceDetailsTabbing(props) {
//   const [reviews, setReviews] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     fetchApi();
//   }, []);

//   //called get api for user service review
//   const authInfo = JSON.parse(localStorage.getItem("authInfo"));
//   const serviceId = props.serviceId;

//   //called get api for user service review
//   const fetchApi = async () => {
//     try {
//       const response = await axios.get(`/user/get-service-review/${serviceId}`);
//       const result = response.data.data;
//       setReviews(result);
//     } catch (error) {
//       console.log("Error fetching data:", error);
//     }
//   };

//   // Handle opening the modal
//   const openModal = () => {
//     setIsModalOpen(true);
//   };

//   // Handle Closing the modal
//   const closeModal = () => {
//     setIsModalOpen(false);
//   };

//   //Converted rating value into stars
//   const renderStarRating = (ratingValue) => {
//     const stars = [];
//     for (let i = 0; i < 5; i++) {
//       if (i < Math.floor(ratingValue)) {
//         // Full star
//         stars.push(<li className="star rated" key={i}></li>);
//       } else {
//         // Half star
//         if (i - ratingValue === -0.5) {
//           stars.push(<li className="star half-star" key={i}></li>);
//         } else {
//           // Empty star
//           stars.push(<li className="star" key={i}></li>);
//         }
//       }
//     }
//     return <ul className="rating">{stars}</ul>;
//   };

//   // Function to format the date
//   const formatDate = (date) => {
//     return `${new Date(date).getDate()}-${
//       new Date(date).getMonth() + 1
//     }-${new Date(date).getFullYear()}`;
//   };

//   return (
//     <React.Fragment>
//       <section className="service_details_sec" ref={props.ref}>
//         <div className="container">
//           <div className="row">
//             <div className="com-sm-12">
//               <div className="detail_tab">
//                 <ul className="nav nav-tabs border-0" id="myTab" role="tablist">
//                   {/* Description Tab */}
//                   <li className="nav-item" role="presentation">
//                     <button
//                       className="nav-link"
//                       id="description-tab"
//                       data-bs-toggle="tab"
//                       data-bs-target="#description"
//                       type="button"
//                       role="tab"
//                       aria-controls="description"
//                       aria-selected="false"
//                     >
//                       Description
//                     </button>
//                   </li>

//                   {/* Reviews Tab */}
//                   <li className="nav-item" role="presentation">
//                     <button
//                       className="nav-link active"
//                       id="reviews-tab"
//                       data-bs-toggle="tab"
//                       data-bs-target="#reviews"
//                       type="button"
//                       role="tab"
//                       aria-controls="reviews"
//                       aria-selected="true"
//                     >
//                       Reviews
//                     </button>
//                   </li>
//                 </ul>
//                 <div className="tab-content" id="myTabContent">
//                   {/* Description Content */}
//                   {props.description ? (
//                     <div
//                       className="tab-pane fade"
//                       id="description"
//                       role="tabpanel"
//                       aria-labelledby="description-tab"
//                     >
//                       <p className="mb-0">{parse(props.description)}</p>
//                     </div>
//                   ) : (
//                     ""
//                   )}
//                   {/* Reviews Content */}
//                   <div
//                     className="tab-pane review fade show active"
//                     id="reviews"
//                     role="tabpanel"
//                     aria-labelledby="reviews-tab"
//                   >
//                     <div className="row">
//                       {/* Ratings and Reviews */}
//                       <div className="r_col col-sm-12 col-md-3">
//                         <div className="box_wrapper">
//                           <div className="reviews_box">
//                             <p className="review_count">
//                               {/* {props.reviewsCount} Reviews */}
//                             </p>
//                             <p className="rating_point d-inline-flex align-items-center">
//                               {renderStarRating(reviews.rating)}
//                             </p>
//                             <ul className="review_status">
//                               Rating Distribution
//                               <li>
//                                 <span className="s_no"></span>
//                                 <span className="progress_bar">
//                                   <i className="progress"></i>
//                                 </span>
//                                 <span className="count"></span>
//                               </li>
//                             </ul>
//                             <button
//                               className={`btn custom_btn btn_yellow_bordered w-auto d-inline-block ${
//                                 !authInfo || authInfo.id === undefined
//                                   ? "disabled"
//                                   : ""
//                               }`}
//                               onClick={() =>
//                                 authInfo &&
//                                 authInfo.id !== undefined &&
//                                 openModal()
//                               }
//                             >
//                               Write a review
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                       {/* User Reviews */}
//                       <div className="col-sm-12 col-md-9">
//                         <div className="reviews_comments_box">
//                           <div className="reviews_comments_box">
//                             {/* Display Reviews */}
//                             {reviews.length > 0 ? (
//                               reviews.map((review, index) => (
//                                 <div className="user_comment_box" key={index}>
//                                   <p className="title">{review.review.title}</p>
//                                   <p className="rating">
//                                     {renderStarRating(review.rating)}
//                                   </p>
//                                   <p className="feedback">
//                                     {review.review.description}
//                                   </p>
//                                   <p className="date mb-0">
//                                     {review.userId.name} |{" "}
//                                     {formatDate(review.createdAt)}
//                                   </p>
//                                 </div>
//                               ))
//                             ) : (
//                               <p>No reviews available</p>
//                             )}
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* Modal */}
//         <ServiceModal
//           isOpen={isModalOpen}
//           onClose={closeModal}
//           serviceId={props.serviceId}
//           authInfo={authInfo}
//           fetchApi={fetchApi}
//         />
//         {/* End Modal */}
//       </section>
//     </React.Fragment>
//   );
// }

// export default ServiceDetailsTabbing;
