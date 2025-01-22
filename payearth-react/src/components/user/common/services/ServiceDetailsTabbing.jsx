import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import parse from "html-react-parser";
import { FaTrash } from "react-icons/fa";
import ServiceModal from "../services/ServiceModel";
import ServiceCalendar from "./ServiceCalendar";
import { isLogin } from "./../../../../helpers/login";
import { toast } from "react-toastify";
import ServiceCalendarAuth from "./ServiceCalendarAuth";
import googleMeet from "./../../../../assets/icons/google-meet-logo.svg"
import { useHistory } from "react-router-dom";
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';

function ServiceDetailsTabbing(props) {
  const history = useHistory();
  const accessToken = localStorage.getItem("accessToken");
  const [zoomAccessToken, setZoomAccessToken] = useState(null);
  const [zoom_userId, setZoom_userId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [eventList, setEventList] = useState([]);
  const [isCalendarAuthorized, setIsCalendarAuthorized] = useState(accessToken ? true : false);
  const { scrollToReviews, scheduledMeeting, serviceCreator } = props;
  const [activeTab, setActiveTab] = useState("description");

  useEffect(() => {
    if (scrollToReviews) {
      setActiveTab("reviews");

    }
  }, [scrollToReviews]);

  useEffect(() => {
    if (scheduledMeeting) {
      setActiveTab("appointment");
      eventMeeting();
    }
  }, [scheduledMeeting]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  useEffect(() => {
    fetchApi();
    eventMeeting();
  }, []);

  //called get api for user service review
  const authInfo = JSON.parse(localStorage.getItem("authInfo"));
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const serviceId = props.serviceId;

  const fetchApi = async () => {
    try {
      const response = await axios.get(`/user/get-service-review/${serviceId}`);
      const result = response.data.data;
      setReviews(result);
      if (result.length > 0) {
        const totalRating = result.reduce((acc, curr) => acc + curr.rating, 0);
        const average = totalRating / result.length;
        setAverageRating(average);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const deleteReview = async (reviewId) => {
    try {
      const headers = {
        Authorization: `Bearer ${authInfo.token}`,
      };
      await axios.delete(`/user/delete-review/${reviewId}`, { headers });
      fetchApi();
      toast.success("Review Deleted Successfully");
    } catch (error) {
      toast.error("Review hasn't been deleted");
      console.log("Error deleting review:", error);
    }
  };

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
    return `${new Date(date).getDate()}-${new Date(date).getMonth() + 1
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

  const eventList_column = [
    {
      name: "SERVICE NAME",
      selector: (row, i) => row.service_name,
      sortable: true,
    },
    {
      name: "SERVICE TITLE",
      selector: (row, i) => row.title,
      sortable: true,
    },
    {
      name: "START DATE",
      selector: (row, i) => {
        const date = new Date(row.start);
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
      },
      sortable: true,
    },
    {
      name: "",
      selector: (row, i) => {
        const date = new Date();
        const startDate = new Date(row.start);
        const endDate = new Date(row.end);
        const isActive = startDate <= date && endDate >= date;
        return (
          <div>
            <a
              href={isActive ? row.meeting_url : '#'}
              target={isActive ? "_blank" : undefined}
              rel={isActive ? "noopener noreferrer" : undefined}
              style={{ pointerEvents: isActive ? "auto" : "none" }}
            >
              <img
                src={googleMeet}
                alt="Meeting Link"
                style={{
                  width: '30px',
                  height: '30px',
                  opacity: isActive ? 1 : 0.5,
                  cursor: isActive ? "pointer" : "not-allowed"
                }}
              />
            </a>
          </div>
        );
      },
      sortable: true,
    }
  ]

  const eventMeeting = async () => {
    try {
      const response = await axios.get(`/user/get-calendar-event/${authInfo.id}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          "Authorization": `Bearer ${authInfo.token}`,
        },
      });
      if (response.data.data.length === 0) {
        toast.error("Event's not found.")
      }
      const formattedEvents = response.data.data.map((event) => ({
        event_id: event.event_id,
        id: event._id,
        user_name: event.user_id.name,
        service_name: event.service_id.name,
        description: event.event_description,
        meeting_url: event.meeting_url,
        meetingTitle: event.event_title,
        start: event.start_datetime,
        end: event.end_datetime,
        title: event.event_title,
        serviceCreator: event.service_id.createdBy.email,
      }));
      const sortedEvents = formattedEvents.sort(
        (a, b) => new Date(a.start) - new Date(b.start)
      );
      setEventList(sortedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  console.log("eventList::", eventList)

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
                  {/* Description Tab */}
                  {!currentUser ? (
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === "description" ? "active" : ""
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
                        className={`nav-link ${activeTab === "description" ? "active" : ""
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
                      className={`nav-link ${activeTab === "reviews" ? "active" : ""
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

                  {/* Appointment Tab */}
                  {!currentUser ? (
                    ""
                  ) : (
                    <li className="nav-item" role="presentation">
                      <button
                        //className="nav-link active"
                        className={`nav-link ${activeTab === "appointment" ? "active" : ""
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
                        className={`nav-link ${activeTab === "meeting" ? "active" : ""}`}
                        id="meeting-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#meeting"
                        type="button"
                        role="tab"
                        aria-controls="meeting"
                        // aria-selected="false"
                        aria-selected={activeTab === "meeting"}
                        onClick={() => setActiveTab("meeting")}
                      >
                        Meeting
                      </button>
                    </li>
                  )}
                  {/* ****************zoom meeting************* */}
                </ul>
                <div className="tab-content" id="myTabContent">
                  {!currentUser ? (
                    ""
                  ) : !isCalendarAuthorized ? (
                    <div className={`tab-pane fade ${activeTab === "appointment" ? "show active" : ""}`}
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
                        serviceCreator={serviceCreator}
                      />
                    </div>
                  ) : (
                    <div className={`tab-pane fade ${activeTab === "appointment" ? "show active" : ""}`}
                      id="appointment"
                      role="tabpanel"
                      aria-labelledby="appointment-tab"
                    >
                      <p className="mb-0">
                        <ServiceCalendar authToken={authInfo.token} serviceCreator={serviceCreator} />
                      </p>
                    </div>
                  )}
                  {!currentUser ? (
                    ""
                  ) : (
                    <div className={`tab-pane fade ${activeTab === "meeting" ? "show active" : ""}`} id="meeting" role="tabpanel" aria-labelledby="meeting-tab">

                      <DataTableExtensions
                        columns={eventList_column}
                        data={eventList}
                      >
                        <DataTable
                          pagination
                          highlightOnHover
                          noHeader
                          defaultSortField="id"
                          defaultSortAsc={false}
                        />
                      </DataTableExtensions>
                    </div>
                  )}

                  {!currentUser ? (
                    props.description ? (
                      <div
                        // className="tab-pane fade show active"
                        className={`tab-pane fade ${activeTab === "description" ? "show active" : ""
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
                      className={`tab-pane fade ${activeTab === "description" ? "show active" : ""
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
                    className={`tab-pane fade ${activeTab === "reviews" ? "show active" : ""
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
                              className={`btn custom_btn btn_yellow_bordered w-auto d-inline-block ${!authInfo || authInfo.id === undefined
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
