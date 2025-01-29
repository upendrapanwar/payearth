import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import userCalendarAddEventSchema from '../../../../validation-schemas/userCalendarAddEventSchema'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { toast } from "react-toastify";
import moment from "moment";
import { gapi } from "gapi-script";
import { Formik, Form, Field, ErrorMessage } from "formik";
import io from "socket.io-client";
import { isLogin } from "../../../../helpers/login";
import { useHistory } from "react-router-dom";
import { useLocation } from "react-router-dom";

function ServiceCalendar(props) {
  const { serviceCreator } = props;
  const location = useLocation();
  const history = useHistory();
  const currentUser = isLogin();
  const calendarRef = useRef(null);
  const authInfo = JSON.parse(localStorage.getItem("authInfo"));
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const accessToken = localStorage.getItem("accessToken");
  const user_id = authInfo.id;
  const { id } = useParams();
  const service_id = id;
  const [formOpen, setFormOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [chargesPayModel, setChargesPayModel] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [id]);

  useEffect(() => {
    const date = localStorage.getItem("selectedDate")
    const queryParams = new URLSearchParams(location.search);
    const paymentStatus = queryParams.get('paymentResponse');
    if (paymentStatus === 'true') {
      setSelectedDate(date)
      setFormOpen(true);
    } else {
      setFormOpen(false);
    }
  }, [location]);

  useEffect(() => {
    if (accessToken) {
      fetchGoogleEvents();
    }
  }, [])

  const fetchDisableTimes = () => {
    // Selected service currently disable time get.



  }

  const handleDateClick = (arg) => {
    setChargesPayModel(true)
    const selectDate = moment(arg.date).format("YYYY-MM-DD")
    localStorage.setItem("selectedDate", selectDate);
  };

  const handleFormSubmit = async (values) => {
    const start_datetime = moment(`${values.meetingDate}T${values.meetingTime}`).toISOString();
    if (moment(start_datetime).isBefore(moment(), "minute")) {
      toast.error("Please select the current time or a future time.");
      return;
    }

    const end_datetime = moment(start_datetime).add(1, "hour").toISOString();
    const eventData = {
      summary: values.event_title,
      description: values.description,
      location: "Online Meeting",
      start: {
        dateTime: start_datetime,
        timeZone: "Asia/Kolkata"
      },
      end: {
        dateTime: end_datetime,
        timeZone: "Asia/Kolkata"
      },
      conferenceData: {
        createRequest: {
          requestId: `meeting-${Date.now()}`,
          conferenceSolutionKey: { type: "hangoutsMeet" }
        }
      },
      attendees: [
        { email: serviceCreator },
      ],
      reminders: {
        useDefault: true,
      },
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      console.log("accessToken", accessToken)
      const addEvent = await axios.post(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1`,
        eventData,
        {
          headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        })

      if (addEvent.data.status === "confirmed") {
        console.log("addEvent", addEvent)
        const meetLink = addEvent.data.conferenceData.entryPoints?.find(
          (entryPoint) => entryPoint.entryPointType === "video"
        )?.uri;
        toast.success("Event added successfully");
        history.push(`/service-detail/${service_id}`);
        sessionStorage.setItem("paymentResponse", false);
        localStorage.removeItem("selectedDate");
        // setEventStatus(false)
        await fetchGoogleEvents();
      }
    } catch (error) {
      if (error.response && error.response.data.error === 'Request had insufficient authentication scopes.') {
        toast.error("Insufficient scope. Please reauthenticate and grant the necessary permissions.");
      } else {
        toast.error("Event hasn't added");
      }
      console.error("Error submitting form:", error);
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await axios.get(`/user/get-calendar-event/${authInfo.id}`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          "Authorization": `Bearer ${authInfo.token}`,
        },
      });

      // console.log("fetch event response", response)

      // if (response.data.data.length === 0) {
      //   toast.error("Event's not found.")
      // }
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

      setEventDetails(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchGoogleEvents = async () => {
    try {
      // const url = "https://www.googleapis.com/calendar/v3/calendars/primary/events";
      const accessToken = localStorage.getItem("accessToken");
      console.log("accessToken", accessToken)
      const response = await axios.get("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (response.status === 200) {
        const eventsData = response.data.items.map((item) => ({
          eventId: item.id,
          title: item.summary,
          start: item.start.dateTime,
          end: item.end.dateTime,
          description: item.description,
          meeting_url: item.hangoutLink,
        }));
        // setEvent(eventsData)
        if (eventsData.length > 0) {
          const lastEvent = eventsData[eventsData.length - 1];
          await saveCalendarEvents([lastEvent], service_id, user_id,);
        } else {
          console.log("No events fetched.");
        }
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };


  const saveCalendarEvents = async (eventsData, service_id, user_id) => {
    try {
      const requestData = eventsData.map((event) => ({
        user_id,
        service_id,
        event_id: event.eventId,
        event_title: event.title,
        start_datetime: event.start,
        end_datetime: event.end,
        event_description: event.description,
        meeting_url: event.meeting_url,
        status: true
      }));

      const response = await axios.post(`/user/add-calendar-event/${authInfo.id}`, requestData, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          "Authorization": `Bearer ${authInfo.token}`,
        },
      })
      if (response.data.status === true) {
        const socket = io.connect(process.env.REACT_APP_SOCKET_SERVER_URL);
        const notification = {
          message: `${userInfo.name} Added google event for meeting`,
          sender: { id: user_id, type: 'user', name: userInfo.name },
          receiver: { id: response.data.data.createdBy, type: 'seller' },
          type: 'Meeting_Request'
        };
        socket.emit('Meeting_Request', {
          notification
        });
        axios.post('front/notifications', notification).then(response => {
        }).catch(error => {
          console.log("Error saving notification:", error);
        });
        await fetchEvents();
      }
    } catch (error) {
      console.error("Error saving calendar events:", error);
    }
  };

  const handleDeleteEvent = async (id, event_id) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const googleCalendarResponse = await axios.delete(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${event_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      if (googleCalendarResponse) {
        handleCloseModal();
        await deleteFromDatabase(id)
      } else {
        toast.error("Failed to delete event from Google Calendar");
      }
    } catch (error) {
      console.error("Error deleting event from google calendar:", error);
    }
  };

  const deleteFromDatabase = async (id) => {
    try {
      const dataBaseResponse = await axios.put(`/user/del-calendar-event/${id}`, {}, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          "Authorization": `Bearer ${authInfo.token}`,
        },
      })
      if (dataBaseResponse.data.status === true) {
        setEventDetails(eventDetails.filter((event) => event.id !== id));
        toast.success("Event Deleted successfully");
      } else {
        toast.error("Database deletion failed");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  }

  const handleEventClick = (info) => {
    setSelectedEvent({
      ...info.event.extendedProps,
      id: info.event.id,
      event_id: info.event.extendedProps.event_id
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedEvent(null);
  };
  const renderEventContent = (eventInfo) => {
    const time = moment(eventInfo.event.start).format("hh:mm A");
    return (
      <div style={{ textAlign: "center", fontSize: "12px", backgroundColor: "#fbf500" }}>
        <div style={{ fontSize: "10px", fontWeight: "bold", color: "black" }}>{time}</div>
        <div style={{ fontSize: "8px", color: "gray" }}>{eventInfo.event.title}</div>
      </div>
    );
  };

  const handleCheckout = () => {
    if (!currentUser) {
      toast.error("Please Login", { autoClose: 3000 });
    } else {
      history.push("/service_Charge_Checkout");
    }
  };

  return (
    <React.Fragment>
      {formOpen && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ background: "rgb(255 252 118)" }}>
                <h5 className="modal-title">Schedule Event</h5>
                <button type="button" className="btn-close" onClick={() => setFormOpen(false)} aria-label="Close"></button>
              </div>

              <div className="modal-body">
                <Formik
                  initialValues={{
                    event_title: "",
                    meetingDate: selectedDate,
                    meetingTime: "",
                    description: "",
                  }}
                  validationSchema={userCalendarAddEventSchema}
                  onSubmit={handleFormSubmit}
                >
                  {({ errors, touched, setFieldValue }) => (
                    <Form>
                      <div className="mb-3">
                        <label className="form-label">Title:</label>
                        <Field
                          type="text"
                          className="form-control"
                          name="event_title"
                        />
                        <ErrorMessage name="event_title" component="div" className="text-danger" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Meeting Date:</label>
                        <Field
                          type="date"
                          className="form-control"
                          name="meetingDate"
                          value={selectedDate} // Ensure the selectedDate is shown
                          onChange={(e) => setFieldValue("meetingDate", e.target.value)}
                        />
                        <ErrorMessage name="meetingDate" component="div" className="text-danger" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Start Time:</label>
                        <Field
                          type="time"
                          className="form-control"
                          name="meetingTime"
                        />
                        <ErrorMessage name="meetingTime" component="div" className="text-danger" />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description:</label>
                        <Field
                          as="textarea"
                          className="form-control"
                          name="description"
                        />
                        <ErrorMessage name="description" component="div" className="text-danger" />
                      </div>
                      <div className="mb-3">
                        <button type="submit" className="btn custom_btn btn_yellow">
                          Submit
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => setFormOpen(false)}>
                          Cancel
                        </button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      )}

      {modalOpen && selectedEvent && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ background: "rgb(255 252 118)" }}>
                <h5 className="modal-title">{selectedEvent.meetingTitle}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p><strong>Name :</strong> &nbsp; <b>{selectedEvent.user_name}</b></p>
                <p className="modal-description" style={{ maxHeight: '100px', overflowY: 'auto', marginBottom: '0', padding: '5px' }}><strong>Description :</strong> {selectedEvent.description}</p>
                <p><strong>Start Time :</strong> &nbsp; {moment(selectedEvent.start).format("YYYY-MM-DD hh:mm A")}</p>
                <p><strong>End Time :</strong> &nbsp; {moment(selectedEvent.end).format("YYYY-MM-DD hh:mm A")}</p>
                <p><strong>Zoom Meeting URL :</strong> &nbsp; {selectedEvent.meeting_url}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Close
                </button>
                <button
                  className="btn custom_btn btn_yellow"
                  onClick={() => handleDeleteEvent(selectedEvent.id, selectedEvent.event_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {chargesPayModel && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body text-center">
                <p className="mb-0 text-dark fw-bold">
                  Are you sure you want to confirm this service?
                </p>
              </div>
              <div className="modal-footer">
                <div className="w-100 d-flex justify-content-center">
                  <button type="button" className="btn btn-primary mx-2" onClick={handleCheckout}>
                    Confirm
                  </button>
                  <button type="button" className="btn btn-secondary mx-2" onClick={() => setChargesPayModel(false)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <FullCalendar
        height="125vh"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: '',
          center: 'title',
          right: 'prev,next today'
        }}
        dateClick={handleDateClick}
        events={eventDetails}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
        ref={calendarRef}
        eventClassNames="fc-daygrid-event"
        validRange={{
          start: new Date().toISOString().split('T')[0] // Disables dates before today
        }}
      />
    </React.Fragment>
  );
}

export default ServiceCalendar;