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
import googleMeet from "./../../../../assets/icons/google-meet-logo.svg";
import { useHistory } from "react-router-dom";
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import { useLocation } from "react-router-dom";

function ServiceDetailsTabbing(props) {
  const history = useHistory();
  const location = useLocation();
  const accessToken = localStorage.getItem("accessToken");
  const [zoomAccessToken, setZoomAccessToken] = useState(null);
  const [zoom_userId, setZoom_userId] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [eventList, setEventList] = useState([]);
  const [isCalendarAuthorized, setIsCalendarAuthorized] = useState(accessToken ? true : false);
  const { scrollToReviews, scheduledMeeting, serviceCreator, chargesPayStatus } = props;

  const [activeTab, setActiveTab] = useState("description");

  // useEffect(() => {
  //   setChargesPayStatus(paymentStatus);
  // }, [paymentStatus]);


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

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentStatus = queryParams.get('paymentResponse');
    if (paymentStatus === 'true') {
      setActiveTab("appointment");
    }
  })

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(3);

  useEffect(() => {
    fetchApi();
    eventMeeting();
    if (accessToken) {
      console.log("if token then run....")
      fetchPastEvents();
    }
    // updateServiceOrders();
  }, []);

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

  const formatDate = (date) => {
    return `${new Date(date).getDate()}-${new Date(date).getMonth() + 1
      }-${new Date(date).getFullYear()}`;
  };

  const currentUser = isLogin();
  const handleCalendarAuthorization = () => {
    setIsCalendarAuthorized(true);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReviews = reviews.slice(indexOfFirstItem, indexOfLastItem);

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

  const fetchPastEvents = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const now = new Date(); // Current timestamp in ISO format
      const past30Minutes = new Date(now.getTime() - 30 * 60 * 1000).toISOString(); // 30 minutes ago
      const nowISO = now.toISOString();
      const response = await axios.get(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            timeMax: past30Minutes, // @@@@@@ Important line event start time to fetch after 30min , 10min ....
            singleEvents: true,
            orderBy: "startTime",
          },
        }
      );

      console.log("response fetchPastEvents", response)
      // Filter for Google Meet events
      const eventsWithMeetLinks = response.data.items.filter(
        (event) =>
          event.conferenceData &&
          event.conferenceData.entryPoints &&
          event.conferenceData.entryPoints.some(
            (entry) => entry.entryPointType === "video"
          )
      );

      // Extract event IDs
      const pastEventIDs = eventsWithMeetLinks.map((event) => event.id);

      console.log("pastEvents", pastEventIDs)
      // if (pastEventIDs.length > 0) {
      //   console.log("event not null....", pastEventIDs)
      //   const url = "/user/updateServiceOrders"
      //   const eventId = {
      //     pastEventIDs: pastEventIDs
      //   }
      //   axios.put(url, eventId, {
      //     headers: {
      //       'Accept': 'application/json',
      //       'Content-Type': 'application/json;charset=UTF-8',
      //       'Authorization': `Bearer ${authInfo.token}`
      //     }
      //   }).then((response) => {
      //     console.log("response", response);
      //     // closeIframe();
      //     // toast.success("Advertise Blocked successfully....", { autoClose: 2000 })
      //     setTimeout(() => {
      //       // fetchData();
      //     }, 3000);
      //   }).catch((error) => {
      //     console.log("error", error)
      //   })
      // } else {
      //   console.log("no any event found..")
      // }
      // return pastEventIDs;
    } catch (error) {
      console.error("Error fetching past events:", error);
      throw error;
    }
  };

  //

  // const block = (advertisementId) => {
  //   const user = isLogin();
  //   if (user === true) {
  //     const url = `https://localhost:7700/user/blockBanner/${advertisementId}`
  //     const blockId = {
  //       blockByUser: authInfo.id
  //     }
  //     axios.put(url, blockId, {
  //       headers: {
  //         'Accept': 'application/json',
  //         'Content-Type': 'application/json;charset=UTF-8',
  //         'Authorization': `Bearer ${authInfo.token}`
  //       }
  //     }).then((response) => {
  //       closeIframe();
  //       toast.success("Advertise Blocked successfully....", { autoClose: 2000 })
  //       setTimeout(() => {
  //         fetchData();
  //       }, 3000);
  //     }).catch((error) => {
  //       console.log("error", error)
  //     })
  //   }
  // }


  // console.log("chargesPayStatus:", chargesPayStatus)
  // const isButtonDisabled = chargesPayStatus.chargePay === null;

  return (
    <React.Fragment>
      <section className="service_details_sec" ref={props.ref}>
        <div className="container">
          <div className="row">
            <div className="com-sm-12" style={{ marginTop: "50px", }}>
              <div className="detail_tab">
                <ul className="nav nav-tabs border-0" id="myTab" role="tablist">
                  {!currentUser ? (
                    <li className="nav-item" role="presentation">
                      <button className={`nav-link ${activeTab === "description" ? "active" : ""}`}
                        id="description-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#description"
                        type="button"
                        role="tab"
                        aria-controls="description"
                        aria-selected={activeTab === "description"}
                        onClick={() => setActiveTab("description")}
                      >
                        Description
                      </button>
                    </li>
                  ) : (
                    <li className="nav-item" role="presentation">
                      <button className={`nav-link ${activeTab === "description" ? "active" : ""}`}
                        id="description-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#description"
                        type="button"
                        role="tab"
                        aria-controls="description"
                        aria-selected={activeTab === "description"}
                        onClick={() => setActiveTab("description")}
                      >
                        Description
                      </button>
                    </li>
                  )}

                  {/* Reviews Tab */}
                  <li className="nav-item" role="presentation">
                    <button className={`nav-link ${activeTab === "reviews" ? "active" : ""}`}
                      id="reviews-tab"
                      data-bs-toggle="tab"
                      data-bs-target="#reviews"
                      type="button"
                      role="tab"
                      aria-controls="reviews"
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
                        className={`nav-link ${activeTab === "appointment" ? "active" : ""}`}
                        id="appointment-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#appointment"
                        type="button"
                        role="tab"
                        aria-controls="appointment"
                        aria-selected={activeTab === "appointment"}
                        onClick={() => setActiveTab("appointment")}
                      // disabled={chargesPayStatus === null ? true : false}

                      >
                        Appointment
                      </button>
                    </li>
                  )}

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
                        aria-selected={activeTab === "meeting"}
                        onClick={() => setActiveTab("meeting")}
                      >
                        Meeting
                      </button>
                    </li>
                  )}

                </ul>
                <div className="tab-content" id="myTabContent">
                  {!currentUser ? (
                    ""
                  ) : !isCalendarAuthorized ? (
                    <div className={`text-center tab-pane fade ${activeTab === "appointment" ? "show active" : ""}`}
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
                        <ServiceCalendar authToken={authInfo.token} serviceCreator={serviceCreator} chargesPayStatus={chargesPayStatus} />
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
                      <div className={`tab-pane fade ${activeTab === "description" ? "show active" : ""}`}
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
                    <div className={`tab-pane fade ${activeTab === "description" ? "show active" : ""}`}
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
                  <div className={`tab-pane fade ${activeTab === "reviews" ? "show active" : ""}`}
                    id="reviews"
                    role="tabpanel"
                    aria-labelledby="reviews-tab"
                  >
                    <div className="row">
                      <div className="r_col col-sm-12 col-md-3">
                        <div className="box_wrapper">
                          <div className="reviews_box">
                            <p className="review_count">
                              Average Rating: {averageRating.toFixed(1)}
                            </p>
                            <p className="rating_point d-inline-flex align-items-center">
                              {renderStarRating(averageRating)}
                            </p>
                            <button
                              className={`btn custom_btn btn_yellow_bordered w-auto d-inline-block ${!authInfo || authInfo.id === undefined ? "disabled" : ""}`}
                              onClick={() => authInfo && authInfo.id !== undefined && openModal()}
                            >
                              Write a review
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="col-sm-12 col-md-9">
                        <div className="reviews_comments_box overflow-auto" style={{ maxHeight: "350px" }} >
                          {currentReviews.length > 0
                            ? currentReviews.map((review, index) => (
                              <div className="user_comment_box" key={index}>
                                <div className="d-flex align-items-center">
                                  <p className="title mr-auto">
                                    {review.review.title}
                                  </p>
                                  {currentUser &&
                                    review.userId._id === authInfo.id && (
                                      <button
                                        style={{ marginTop: "-14px", float: "right", }}
                                        className="btn btn-link text-danger"
                                        onClick={() => deleteReview(review._id)} >
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
