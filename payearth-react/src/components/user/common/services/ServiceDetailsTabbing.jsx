// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import parse from "html-react-parser";
// import { FaTrash } from "react-icons/fa"; // Import the trash icon
// import ServiceModal from "../services/ServiceModel";
// import ServiceCalendar from "./ServiceCalendar";
// import { isLogin } from "./../../../../helpers/login";
// import { toast } from "react-toastify";
// import ServiceCalendarAuth from "./ServiceCalendarAuth";

// function ServiceDetailsTabbing(props) {
//   const accessToken = localStorage.getItem("accessToken");
//   const [reviews, setReviews] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [averageRating, setAverageRating] = useState(0);
//   const [isCalendarAuthorized, setIsCalendarAuthorized] = useState(
//     accessToken ? true : false
//   );

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(3); // Change the number of items per page here

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
//       console.log("review data", result);

//       // Calculate average rating
//       if (result.length > 0) {
//         const totalRating = result.reduce((acc, curr) => acc + curr.rating, 0);
//         const average = totalRating / result.length;
//         setAverageRating(average);
//       }
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

//   const deleteReview = async (reviewId) => {
//     try {
//       const headers = {
//         Authorization: `Bearer ${authInfo.token}`,
//       };

//       await axios.delete(`/user/delete-review/${reviewId}`, { headers });
//       // After deleting the review, fetch updated reviews
//       fetchApi();
//       toast.success("Review Deleted Successfully");
//     } catch (error) {
//       toast.error("Review hasn't been deleted");
//       console.log("Error deleting review:", error);
//     }
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

//   const currentUser = isLogin();

//   // Function to handle calendar authorization
//   const handleCalendarAuthorization = () => {
//     setIsCalendarAuthorized(true);
//   };

//   // Pagination controls
//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   //handle pagination next page
//   const nextPage = () => {
//     const totalPages = Math.ceil(reviews.length / itemsPerPage);
//     if (currentPage < totalPages) {
//       setCurrentPage((prevPage) => prevPage + 1);
//     }
//   };

//   //handle pagination next prevPage
//   const prevPage = () => {
//     if (currentPage > 1) {
//       setCurrentPage((prevPage) => prevPage - 1);
//     }
//   };

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentReviews = reviews.slice(indexOfFirstItem, indexOfLastItem);

//   const authZoom = async () => {
//     try {
//       const clientId = process.env.REACT_APP_ZOOM_API_KEY;
//       const encodedRedirectUri = encodeURIComponent(
//         process.env.REACT_APP_REDIRECT_URI
//       );
//       const redirect_uri = decodeURIComponent(encodedRedirectUri);
//       const responseType = "code";
//       const authorizationUrl = `https://zoom.us/oauth/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirect_uri}`;
//       window.location.href = authorizationUrl;
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   const handleNo = async () => {
//     const appointmentTab = document.getElementById("appointment-tab");
//     appointmentTab.click();
//   };

//   return (
//     <React.Fragment>
//       <section className="service_details_sec" ref={props.ref}>
//         <div className="container">
//           <div className="row">
//             <div
//               className="com-sm-12"
//               style={{
//                 marginTop: "50px",
//               }}
//             >
//               <div className="detail_tab">
//                 <ul className="nav nav-tabs border-0" id="myTab" role="tablist">
//                   {/* Appointment Tab */}
//                   {!currentUser ? (
//                     ""
//                   ) : (
//                     <li className="nav-item" role="presentation">
//                       <button
//                         className="nav-link active"
//                         id="appointment-tab"
//                         data-bs-toggle="tab"
//                         data-bs-target="#appointment"
//                         type="button"
//                         role="tab"
//                         aria-controls="appointment"
//                         aria-selected="false"
//                       >
//                         Appointment
//                       </button>
//                     </li>
//                   )}
//                   {/* ****************zoom meeting************* */}
//                   {/* Zoom Meeting Tab */}
//                   {!currentUser ? (
//                     ""
//                   ) : (
//                     <li className="nav-item" role="presentation">
//                       <button
//                         className="nav-link"
//                         id="zoommeeting-tab"
//                         data-bs-toggle="tab"
//                         data-bs-target="#zoommeeting"
//                         type="button"
//                         role="tab"
//                         aria-controls="zoommeeting"
//                         aria-selected="false"
//                         // onClick={authZoom}
//                       >
//                         Meeting
//                       </button>
//                     </li>
//                   )}
//                   {/* ****************zoom meeting************* */}

//                   {/* Description Tab */}
//                   {!currentUser ? (
//                     <li className="nav-item" role="presentation">
//                       <button
//                         className="nav-link active"
//                         id="description-tab"
//                         data-bs-toggle="tab"
//                         data-bs-target="#description"
//                         type="button"
//                         role="tab"
//                         aria-controls="description"
//                         aria-selected="false"
//                       >
//                         Description
//                       </button>
//                     </li>
//                   ) : (
//                     <li className="nav-item" role="presentation">
//                       <button
//                         className="nav-link"
//                         id="description-tab"
//                         data-bs-toggle="tab"
//                         data-bs-target="#description"
//                         type="button"
//                         role="tab"
//                         aria-controls="description"
//                         aria-selected="false"
//                       >
//                         Description
//                       </button>
//                     </li>
//                   )}

//                   {/* Reviews Tab */}
//                   <li className="nav-item" role="presentation">
//                     <button
//                       className="nav-link"
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
//                   {!currentUser ? (
//                     ""
//                   ) : !isCalendarAuthorized ? (
//                     <div
//                       className="tab-pane fade show active"
//                       id="appointment"
//                       role="tabpanel"
//                       aria-labelledby="appointment-tab"
//                     >
//                       <ServiceCalendarAuth
//                         onAuthSuccess={() => {
//                           handleCalendarAuthorization();
//                         }}
//                         userId={authInfo.id}
//                         authToken={authInfo.token}
//                       />
//                     </div>
//                   ) : (
//                     <div
//                       className="tab-pane fade show active"
//                       id="appointment"
//                       role="tabpanel"
//                       aria-labelledby="appointment-tab"
//                     >
//                       <p className="mb-0">
//                         <ServiceCalendar authToken={authInfo.token} />
//                       </p>
//                     </div>
//                   )}

//                   {!currentUser ? (
//                     ""
//                   ) : (
//                     <div
//                       className="tab-pane fade"
//                       id="zoommeeting"
//                       role="tabpanel"
//                       aria-labelledby="zoommeeting-tab"
//                     >
//                       <h1>Do you want to create a Zoom meeting?</h1>
//                       <button
//                         className="btn custom_btn btn_yellow"
//                         onClick={authZoom}
//                       >
//                         Yes
//                       </button>
//                       <button
//                         className="btn custom_btn btn_dark"
//                         onClick={handleNo}
//                       >
//                         No
//                       </button>
//                     </div>
//                   )}

//                   {!currentUser ? (
//                     props.description ? (
//                       <div
//                         className="tab-pane fade show active"
//                         id="description"
//                         role="tabpanel"
//                         aria-labelledby="description-tab"
//                       >
//                         <p className="mb-0">{parse(props.description)}</p>
//                       </div>
//                     ) : (
//                       ""
//                     )
//                   ) : (
//                     <div
//                       className="tab-pane fade"
//                       id="description"
//                       role="tabpanel"
//                       aria-labelledby="description-tab"
//                     >
//                       <p className="mb-0">{parse(props.description)}</p>
//                     </div>
//                   )}
//                   {/* Reviews Content */}
//                   <div
//                     className="tab-pane review"
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
//                               {/* Display average rating */}
//                               Average Rating: {averageRating.toFixed(1)}
//                             </p>
//                             {/* Render star rating for averageRating */}
//                             <p className="rating_point d-inline-flex align-items-center">
//                               {renderStarRating(averageRating)}
//                             </p>
//                             {/* You can keep the rating distribution as it is */}
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
//                           {/* Display Reviews */}
//                           {currentReviews.length > 0
//                             ? currentReviews.map((review, index) => (
//                                 <div className="user_comment_box" key={index}>
//                                   <div className="d-flex align-items-center">
//                                     <p className="title mr-auto">
//                                       {review.review.title}
//                                     </p>
//                                     {/* Add delete icon here */}
//                                     {currentUser &&
//                                       review.userId._id === authInfo.id && (
//                                         <button
//                                           style={{
//                                             marginTop: "-14px",
//                                             float: "right",
//                                           }}
//                                           className="btn btn-link text-danger"
//                                           onClick={() =>
//                                             deleteReview(review._id)
//                                           }
//                                         >
//                                           <FaTrash />
//                                         </button>
//                                       )}
//                                   </div>

//                                   <p className="feedback">
//                                     {review.review.description}
//                                   </p>
//                                   <p className="rating">
//                                     {renderStarRating(review.rating)}
//                                   </p>
//                                   <p className="date mb-0">
//                                     {review.userId.name} |{" "}
//                                     {formatDate(review.createdAt)}
//                                   </p>
//                                 </div>
//                               ))
//                             : ""}

//                           {/* Pagination buttons */}
//                           <div className="cart-pagination">
//                             {reviews.length > itemsPerPage && (
//                               <ul className="pagination-wrapper">
//                                 <li>
//                                   <button onClick={prevPage}>Prev</button>
//                                 </li>
//                                 {Array(Math.ceil(reviews.length / itemsPerPage))
//                                   .fill()
//                                   .map((_, index) => (
//                                     <li key={index}>
//                                       <button
//                                         onClick={() =>
//                                           handlePageChange(index + 1)
//                                         }
//                                         className={
//                                           currentPage === index + 1
//                                             ? "active"
//                                             : ""
//                                         }
//                                       >
//                                         {index + 1}
//                                       </button>
//                                     </li>
//                                   ))}
//                                 <li>
//                                   <button onClick={nextPage}>Next</button>
//                                 </li>
//                               </ul>
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

//*************************main backup code********************************** */

import React, { useEffect, useState } from "react";
import axios from "axios";
import parse from "html-react-parser";
import { FaTrash } from "react-icons/fa";
import ServiceModal from "../services/ServiceModel";
import ServiceCalendar from "./ServiceCalendar";
import { isLogin } from "./../../../../helpers/login";
import { toast } from "react-toastify";
import ServiceCalendarAuth from "./ServiceCalendarAuth";
import { useHistory } from "react-router-dom";

function ServiceDetailsTabbing(props) {
  const history = useHistory();
  const accessToken = localStorage.getItem("accessToken");
  const [zoomAccessToken, setZoomAccessToken] = useState(null);
  const [zoom_userId, setZoom_userId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [isCalendarAuthorized, setIsCalendarAuthorized] = useState(
    accessToken ? true : false
  );
  const { scrollToReviews } = props;
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (scrollToReviews) {
      setActiveTab("reviews");
    }
  }, [scrollToReviews]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  useEffect(() => {
    fetchApi();
    fetchAcces_token();
    // listUsers();
  }, []);

  //called get api for user service review
  const authInfo = JSON.parse(localStorage.getItem("authInfo"));
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const serviceId = props.serviceId;

  //Zoom Token fetch

  const fetchAcces_token = () => {
    const clientId = process.env.REACT_APP_ZOOM_CLIENT_ID;
    const clientSecret = process.env.REACT_APP_ZOOM_CLIENT_SECRET;
    const account_id = process.env.REACT_APP_ZOOM_ACCOUNT_ID;
    try {
      const url = "/user/zoomCreateUserToken";
      axios
        .post(
          url,
          { clientId, clientSecret, account_id },
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json;charset=UTF-8",
              Authorization: `Bearer ${authInfo.token}`,
            },
          }
        )
        .then((response) => {
          // console.log("response", response)
          console.log("access_token", response.data.data);
          setZoomAccessToken(response.data.data);
        })
        .catch((error) => {
          console.log("error", error);
        });
    } catch (error) {
      console.log("error", error);
    }
  };

  //called get api for user service review
  const fetchApi = async () => {
    try {
      const response = await axios.get(`/user/get-service-review/${serviceId}`);
      const result = response.data.data;
      setReviews(result);
      console.log("review data", result);

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

  const deleteReview = async (reviewId) => {
    try {
      const headers = {
        Authorization: `Bearer ${authInfo.token}`,
      };

      await axios.delete(`/user/delete-review/${reviewId}`, { headers });
      // After deleting the review, fetch updated reviews
      fetchApi();
      toast.success("Review Deleted Successfully");
    } catch (error) {
      toast.error("Review hasn't been deleted");
      console.log("Error deleting review:", error);
    }
  };

  //Converted rating value into stars
  // const renderStarRating = (ratingValue) => {
  //   const stars = [];
  //   for (let i = 0; i < 5; i++) {
  //     if (i < Math.floor(ratingValue)) {
  //       // Full star
  //       stars.push(<li className="star rated" key={i}></li>);
  //     } else {
  //       // Half star
  //       if (i - ratingValue === -0.5) {
  //         stars.push(<li className="star half-star" key={i}></li>);
  //       } else {
  //         // Empty star
  //         stars.push(<li className="star" key={i}></li>);
  //       }
  //     }
  //   }
  //   return <ul className="rating">{stars}</ul>;
  // };
  const renderStarRating = (ratingValue) => {
    const stars = [];
    // Calculate full stars
    const fullStars = Math.floor(ratingValue);
    // Check if there's a half star
    const hasHalfStar = ratingValue - fullStars >= 0.5;
    // Iterate through 5 stars
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        // Full star
        stars.push(<li className="star rated" key={i}></li>);
      } else if (hasHalfStar && i === fullStars) {
        // Half star
        stars.push(<li className="star half-star" key={i}></li>);
      } else {
        // Empty star
        stars.push(<li className="star" key={i}></li>);
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
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  //handle pagination next page
  const nextPage = () => {
    const totalPages = Math.ceil(reviews.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  //handle pagination next prevPage
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = reviews.slice(indexOfFirstItem, indexOfLastItem);

  const authZoom = async () => {
    try {
      const clientId = process.env.REACT_APP_ZOOM_API_KEY;
      const encodedRedirectUri = encodeURIComponent(
        process.env.REACT_APP_REDIRECT_URI
      );
      const redirect_uri = decodeURIComponent(encodedRedirectUri);
      const responseType = "code";
      const authorizationUrl = `https://zoom.us/oauth/authorize?response_type=${responseType}&client_id=${clientId}&redirect_uri=${redirect_uri}`;
      window.location.href = authorizationUrl;
    } catch (err) {
      console.log(err);
    }
  };

  const handleNo = async () => {
    const appointmentTab = document.getElementById("appointment-tab");
    appointmentTab.click();
  };

  // const zoomCreateUserToken = () => {
  //   history.push('/zoom-authentication');
  // }

  // test @@@

  // Zoom user exist

  const listUsers = async () => {
    try {
      const response = await axios.get("https://api.zoom.us/v2/users", {
        headers: {
          Authorization: `Bearer ${zoomAccessToken}`,
          "Content-Type": "application/json",
        },
      });

      const users = response.data.users;
      console.log("List of users:", users);

      // const userExists = users.some(user => user.email === 'User@gmail.com');
      // if (userExists) {
      //     console.log('User exists');
      // } else {
      //     console.log('User does not exist');
      // }
    } catch (error) {
      console.error("Error listing users:", error.response.data);
    }
  };

  //Create Zoom Meeting
  const combineDateTime = (date, time) => {
    return `${date}T${time}:00`;
  };

  const createZoomUser = async () => {
    const requestData = {
      zoomAccessToken: zoomAccessToken,
      email: "test1eyno@gmail.com",
      first_name: userInfo.email,
      last_name: userInfo.name,
      display_name: userInfo.name,
      password: "Eynosoft1",
    };

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${authInfo.token}`,
    };

    try {
      await axios
        .post("/user/createZoomUser", requestData, { headers })
        .then((response) => {
          console.log("response foom zooom pending ", response);
          // setZoom_userId(response.data.data.id);
        })
        .catch((error) => {
          console.log("Error :>", error);
        });
    } catch (error) {
      console.log("Error", error);
    }
  };

  async function createZoomMeeting() {
    console.log("zoomAccessToken", zoomAccessToken);
    // // e.preventDefault();
    // const currentDateTime = new Date();
    // // Current Date
    // const currentDate = currentDateTime.toISOString().split("T")[0];
    // // Current Time
    // let currentHours = currentDateTime.getHours();
    // let currentMinutes = currentDateTime.getMinutes();
    // // Pad single digit hours and minutes with leading zeros
    // currentHours = currentHours < 10 ? "0" + currentHours : currentHours;
    // currentMinutes =
    //   currentMinutes < 10 ? "0" + currentMinutes : currentMinutes;
    // const currentTime = `${currentHours}:${currentMinutes}`;

    const requestData = {
      // start_time: combineDateTime(currentDate, currentTime),
      zoomAccessToken: zoomAccessToken,
      zoom_userId: zoom_userId,
    };

    console.log("requestData", requestData);

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${authInfo.token}`,
    };

    try {
      console.log("run under create Zoom Meeting");
      await axios
        .post("/user/createZoomMeeting", requestData, { headers })
        .then((response) => {
          console.log("response", response);
          // const meetingData = response.data.data;
          // const join_url = meetingData.join_url;
          // console.log("join_url", join_url)
          // localStorage.setItem("ZoomMeetingUrl", join_url);
          // saveNotification(join_url);
          // getNotification();
          // window.open(join_url, "_blank");
          // history.push("/");
        })
        .catch((error) => {
          console.log("Error :>", error);
        });
    } catch (error) {
      console.log("Error", error);
    }
  }

  return (
    <React.Fragment>
      <section className="service_details_sec" ref={props.ref}>
        <div className="container">
          <div className="row">
            <div
              className="com-sm-12"
              style={{
                marginTop: "50px",
              }}
            >
              <div className="detail_tab">
                <ul className="nav nav-tabs border-0" id="myTab" role="tablist">
                  {/* Appointment Tab */}
                  {!currentUser ? (
                    ""
                  ) : (
                    <li className="nav-item" role="presentation">
                      <button
                        //className="nav-link active"
                        className={`nav-link ${
                          activeTab === "appointment" ? "active" : ""
                        }`}
                        id="appointment-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#appointment"
                        type="button"
                        role="tab"
                        aria-controls="appointment"
                        // aria-selected="false"
                        aria-selected={activeTab === "appointment"}
                        onClick={() => setActiveTab("appointment")}
                      >
                        Appointment
                      </button>
                    </li>
                  )}
                  {/* ****************zoom meeting************* */}
                  {/* Zoom Meeting Tab */}
                  {!currentUser ? (
                    ""
                  ) : (
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "zoommeeting" ? "active" : ""
                        }`}
                        id="zoommeeting-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#zoommeeting"
                        type="button"
                        role="tab"
                        aria-controls="zoommeeting"
                        // aria-selected="false"
                        aria-selected={activeTab === "zoommeeting"}
                        onClick={() => setActiveTab("zoommeeting")}
                      >
                        Meeting
                      </button>
                    </li>
                  )}
                  {/* ****************zoom meeting************* */}

                  {/* Description Tab */}
                  {!currentUser ? (
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "description" ? "active" : ""
                        }`}
                        id="description-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#description"
                        type="button"
                        role="tab"
                        aria-controls="description"
                        //aria-selected="false"
                        aria-selected={activeTab === "description"}
                        onClick={() => setActiveTab("description")}
                      >
                        Description
                      </button>
                    </li>
                  ) : (
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${
                          activeTab === "description" ? "active" : ""
                        }`}
                        id="description-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#description"
                        type="button"
                        role="tab"
                        aria-controls="description"
                        //aria-selected="false"
                        aria-selected={activeTab === "description"}
                        onClick={() => setActiveTab("description")}
                      >
                        Description
                      </button>
                    </li>
                  )}

                  {/* Reviews Tab */}
                  <li className="nav-item" role="presentation">
                    <button
                      className={`nav-link ${
                        activeTab === "reviews" ? "active" : ""
                      }`}
                      id="reviews-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#reviews"
                      type="button"
                      role="tab"
                      aria-controls="reviews"
                      //aria-selected="true"
                      aria-selected={activeTab === "reviews"}
                      onClick={() => setActiveTab("reviews")}
                    >
                      Reviews
                    </button>
                  </li>
                </ul>
                <div className="tab-content" id="myTabContent">
                  {!currentUser ? (
                    ""
                  ) : !isCalendarAuthorized ? (
                    <div
                      //className="tab-pane fade show active"
                      className={`tab-pane fade ${
                        activeTab === "appointment" ? "show active" : ""
                      }`}
                      id="appointment"
                      role="tabpanel"
                      aria-labelledby="appointment-tab"
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
                      // className="tab-pane fade show active"
                      className={`tab-pane fade ${
                        activeTab === "appointment" ? "show active" : ""
                      }`}
                      id="appointment"
                      role="tabpanel"
                      aria-labelledby="appointment-tab"
                    >
                      <p className="mb-0">
                        <ServiceCalendar authToken={authInfo.token} />
                      </p>
                    </div>
                  )}

                  {!currentUser ? (
                    ""
                  ) : (
                    <div
                      // className="tab-pane fade"
                      className={`tab-pane fade ${
                        activeTab === "zoommeeting" ? "show active" : ""
                      }`}
                      id="zoommeeting"
                      role="tabpanel"
                      aria-labelledby="zoommeeting-tab"
                    >
                      <h1>Do you want to create a Zoom meeting?</h1>
                      <button
                        className="btn custom_btn btn_yellow"
                        // onClick={authZoom}
                        //test
                        // onClick={createZoomMeeting}
                        onClick={createZoomUser}
                      >
                        Yes
                      </button>
                      <button
                        className="btn custom_btn btn_dark"
                        onClick={handleNo}
                      >
                        No
                      </button>

                      <button onClick={createZoomMeeting}>
                        create meeting
                      </button>
                    </div>
                  )}

                  {!currentUser ? (
                    props.description ? (
                      <div
                        // className="tab-pane fade show active"
                        className={`tab-pane fade ${
                          activeTab === "description" ? "show active" : ""
                        }`}
                        id="description"
                        role="tabpanel"
                        aria-labelledby="description-tab"
                      >
                        <p className="ql-editor ql-discription mb-0">
                          {parse(props.description)}
                        </p>
                      </div>
                    ) : (
                      ""
                    )
                  ) : (
                    <div
                      // className="tab-pane fade"
                      className={`tab-pane fade ${
                        activeTab === "description" ? "show active" : ""
                      }`}
                      id="description"
                      role="tabpanel"
                      aria-labelledby="description-tab"
                    >
                      <p className="ql-editor ql-discription mb-0">
                        {parse(props.description)}
                      </p>
                    </div>
                  )}
                  {/* Reviews Content */}
                  <div
                    // className="tab-pane review"
                    className={`tab-pane fade ${
                      activeTab === "reviews" ? "show active" : ""
                    }`}
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
                        <div
                          className="reviews_comments_box overflow-auto"
                          style={{ maxHeight: "350px" }}
                        >
                          {/* Display Reviews */}
                          {currentReviews.length > 0
                            ? currentReviews.map((review, index) => (
                                <div className="user_comment_box" key={index}>
                                  <div className="d-flex align-items-center">
                                    <p className="title mr-auto">
                                      {review.review.title}
                                    </p>
                                    {/* Add delete icon here */}
                                    {currentUser &&
                                      review.userId._id === authInfo.id && (
                                        <button
                                          style={{
                                            marginTop: "-14px",
                                            float: "right",
                                          }}
                                          className="btn btn-link text-danger"
                                          onClick={() =>
                                            deleteReview(review._id)
                                          }
                                        >
                                          <FaTrash />
                                        </button>
                                      )}
                                  </div>

                                  <p className="feedback">
                                    {review.review.description}
                                  </p>
                                  <p className="rating">
                                    {renderStarRating(review.rating)}
                                  </p>
                                  <p className="date mb-0">
                                    {review.userId.name} |{" "}
                                    {formatDate(review.createdAt)}
                                  </p>
                                </div>
                              ))
                            : ""}

                          {/* Pagination buttons */}
                          <div className="cart-pagination">
                            {reviews.length > itemsPerPage && (
                              <ul className="pagination-wrapper">
                                <li>
                                  <button onClick={prevPage}>Prev</button>
                                </li>
                                {Array(Math.ceil(reviews.length / itemsPerPage))
                                  .fill()
                                  .map((_, index) => (
                                    <li key={index}>
                                      <button
                                        onClick={() =>
                                          handlePageChange(index + 1)
                                        }
                                        className={
                                          currentPage === index + 1
                                            ? "active"
                                            : ""
                                        }
                                      >
                                        {index + 1}
                                      </button>
                                    </li>
                                  ))}
                                <li>
                                  <button onClick={nextPage}>Next</button>
                                </li>
                              </ul>
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
