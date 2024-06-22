import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import * as bootstrap from "bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { toast } from "react-toastify";
import moment from "moment";
// import io from "socket.io-client";

const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL;

function ServiceCalendar() {
  //get global authInfo for userId
  const authInfo = JSON.parse(localStorage.getItem("authInfo"));
  const user_id = authInfo.id;
  //get accessToken from google calendar auth


  const accessToken = localStorage.getItem("accessToken");

  //myChange>>>>>>>   refreshToken
  // const accessToken = localStorage.getItem("refreshToken");

  //get serviceId with help of useParams
  // Create a socket instance
  const socket = useRef(null);
  const { id } = useParams();
  const service_id = id;

  const [formOpen, setFormOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState([]);
  const [newEvent, setNewEvent] = useState({
    meetingDate: "",
    meetingTime: "",
    description: "",
  });

  // const [notification, setNotification] = useState([]);
  const [zoomAuth, setZoomAuth] = useState([]);

  const calendarRef = useRef(null);

  //fetch meeting data created by user
  const fetchEvents = async () => {
    try {
      const response = await axios.get(`/user/get-meeting/${authInfo.id}`, {
        headers: {
          Authorization: `Bearer ${authInfo.token}`,
        },
      });
      // Format the data received from the API into an array of events
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
      }));
      //formattedEvents set in setEventDetails state
      setEventDetails(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  //useEffect for re-rendering
  useEffect(() => {
    if (!localStorage.getItem("authInfo")) {
      console.log("localStorage is cleared");
    } else {
      fetchEvents();
      fetchGoogleEvents();
      toast.success("New event added!");
    }
  }, [id]);

  //handleDateClick for open form to add new event
  const handleDateClick = (arg) => {

    console.log("arg.dateStr", arg.dateStr)

    setNewEvent((prevEvent) => ({
      ...prevEvent,
      meetingDate: arg.dateStr,
    }));
    // fetchEvents();
    setFormOpen(true);
  };

  //handleInputChange onChange event for form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Calculate start_datetime
    const start_datetime = moment(
      `${newEvent.meetingDate}T${newEvent.meetingTime}`
    ).toISOString(); // Convert to ISO string format

    // Check if the selected date is after the current date
    if (moment(start_datetime).isBefore(moment(), "day")) {
      // If the selected date is before the current date, show an error toast
      toast.error("Please select the current date or a future date.");
      return; // Stop further execution
    }

    // Calculate end_datetime by adding 1 hour to start_datetime
    const end_datetime = moment(start_datetime).add(1, "hour").toISOString(); // Convert to ISO string format

    const eventData = {
      start: {
        dateTime: start_datetime,
        timeZone: "Asia/Kolkata", // Update with your time zone
      },
      end: {
        dateTime: end_datetime,
        timeZone: "Asia/Kolkata", // Update with your time zone
      },
      summary: newEvent.event_title,
      description: newEvent.description,
      location: "https://ZoomMeeting.com", // Update with your meeting URL
    };

    console.log("eventData : ", eventData)

    console.log("accessToken for calnder", accessToken)
    try {
      await axios.post(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
        eventData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json", // Set content type explicitly
          },
        }
      );
      toast.success("Event added succesfully");
      setFormOpen(false);
      // Optionally, you can update state or perform other actions after successful submission
      setNewEvent({ meetingDate: "", meetingTime: "", description: "", event_title: "" });

      fetchGoogleEvents();
    } catch (error) {
      toast.error("Event hasn't added");

      console.error("Error submitting form:", error);
    }
  };

  const fetchGoogleEvents = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      const response = await axios.get(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const eventsData = response.data.items.map((item) => ({
        eventId: item.id,
        title: item.summary,
        start: item.start.dateTime,
        end: item.end.dateTime,
        description: item.description,
        meeting_url: item.location,
      }));

      //get last index data from eventsData
      if (eventsData.length > 0) {
        const lastEvent = eventsData[eventsData.length - 1];
        // Call saveCalendarEvents to save the fetched data
        saveCalendarEvents([lastEvent], service_id, user_id);
      } else {
        console.log("No events fetched.");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  //save calendar data in database
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
      }));

      const response = await axios.post(
        `/user/add-meeting-user/${authInfo.id}`,
        requestData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: `Bearer ${authInfo.token}`,
          },
        }
      );
      fetchEvents();
    } catch (error) {
      console.error("Error saving calendar events:", error);
    }
  };

  //show pop up after add event by user
  const eventDidMountHandler = (info) => {
    const startTime = moment(info.event.start).format("YYYY-MM-DD HH:mm");
    const endTime = moment(info.event.end).format("YYYY-MM-DD HH:mm");

    const popover = new bootstrap.Popover(info.el, {
      title: info.event._def.extendedProps.meetingTitle,
      placement: "auto",
      trigger: "hover",
      customClass: "popoverStyle",
      content: `<p><strong>Name: </strong>${info.event._def.extendedProps.user_name}</p>
                    <p><strong>Description: </strong>Meeting will be held for ${info.event._def.extendedProps.description} appointment.</p>
                    <p><strong>Start Time: </strong>${startTime}</p>
                    <p><strong>End Time: </strong>${endTime}</p>
                    <p><strong>Zoom Meeting url: </strong>${info.event._def.extendedProps.meeting_url}</p>`,
      html: true,
    });

    // Set timeout to hide popover after 3 seconds
    setTimeout(() => {
      popover.hide();
    }, 3000);
    return popover;
  };

  //pop-up style
  const eventCellDidMountHandler = (info) => {
    info.el.style.backgroundColor = "#338EF0";
    info.el.style.color = "white";
  };

  //form close function
  const handleFormClose = () => {
    setFormOpen(false);
  };

  //handleCalendarInit
  const handleCalendarInit = (calendar) => {
    calendarRef.current = calendar;
  };

  // Function to reset the form fields
  const resetForm = () => {
    setNewEvent({
      meetingDate: "",
      meetingTime: "",
      description: "",
    });
  };

  const handleDeleteEvent = async (id, event_id) => {
    try {
      const accessToken = localStorage.getItem("accessToken");

      // Make a DELETE request to Google Calendar API to delete the event
      await axios.delete(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${event_id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error("Error deleting event from google calender:", error);
    }
    try {
      await axios.delete(`/user/delete-meeting/${id}`, {
        headers: {
          Authorization: `Bearer ${authInfo.token}`,
        },
      });

      setEventDetails(eventDetails.filter((event) => event.id !== id));
      // hidePopover();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  return (
    <React.Fragment>
      {formOpen && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Schedule Event</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleFormClose}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleFormSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Title:</label>
                    <input
                      type="text"
                      className="form-control"
                      name="event_title"
                      value={newEvent.event_title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Meeting Date:</label>
                    <input
                      type="date"
                      className="form-control"
                      name="meetingDate"
                      value={newEvent.meetingDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Start Time:</label>
                    <input
                      type="time"
                      className="form-control"
                      name="meetingTime"
                      value={newEvent.meetingTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description:</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={newEvent.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <button
                      type="submit"
                      className="btn custom_btn btn_yellow"
                      disabled={!localStorage.getItem("authInfo")}
                    >
                      Submit
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={handleFormClose}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView={"dayGridMonth"}
        initialDate={new Date()}
        dateClick={handleDateClick}
        events={eventDetails}
        eventDidMount={(info) => {
          eventDidMountHandler(info);
          eventCellDidMountHandler(info);
        }}
        eventContent={(eventInfo) => {
          return (
            <div className="row">
              <div className="col-8">
                &nbsp;<span>{eventInfo.event.extendedProps.description}</span>
              </div>
              <div className="col-2">
                <button
                  className="btn-close btn-close-white ms-auto"
                  aria-label="Close"
                  onClick={() =>
                    handleDeleteEvent(
                      eventInfo.event.id,
                      eventInfo.event._def.extendedProps.event_id
                    )
                  }
                ></button>
              </div>
            </div>
          );
        }}
        ref={handleCalendarInit}
      />
    </React.Fragment>
  );
}

export default ServiceCalendar;
