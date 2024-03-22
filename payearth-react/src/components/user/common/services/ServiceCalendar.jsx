import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import * as bootstrap from "bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";

function ServiceCalendar() {
  //get global authInfo for userId
  const authInfo = JSON.parse(localStorage.getItem("authInfo"));
  //get serviceId with help of useParams
  const { id } = useParams();

  const [formOpen, setFormOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState([]);
  const [newEvent, setNewEvent] = useState({
    meetingDate: "",
    meetingTime: "",
    description: "",
  });

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
        id: event.id,
        user_name: event.userId.name,
        service_name: event.serviceId.name,
        description: event.MeetingDescription,
        title: event.serviceId.name,
        start: event.meetingTime,
        end: event.meetingDate,
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
    }
  }, [id]);

  //handleDateClick for open form to add new event
  const handleDateClick = () => {
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

  //handleFormSubmit for subumit form
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    //Date & Time formate For Calendar
    const formattedMeetingDate = moment(newEvent.meetingDate).format(
      "YYYY-MM-DD"
    );
    const formattedMeetingTime = moment(
      `${newEvent.meetingDate}T${newEvent.meetingTime}`
    ).format("YYYY-MM-DDTHH:mm:ss");

    //Collected all data for form submit
    const eventData = {
      serviceId: id,
      userId: authInfo.id,
      meetingDate: formattedMeetingDate,
      meetingTime: formattedMeetingTime,
      description: newEvent.description,
      meetingStatus: "Active",
    };
    console.log("eventData", eventData);
    try {
      //called Post Api to create meeting by user
      await axios.post(`/user/add-meeting-user/${authInfo.id}`, eventData, {
        headers: {
          Authorization: `Bearer ${authInfo.token}`,
        },
      });
      console.log("Form submitted:", eventData);
      setFormOpen(false); //form close
      setEventDetails([...eventDetails, eventData]); // Add the new event to eventDetails
      fetchEvents(); //called fetch api
      resetForm(); // Reset the form fields
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  //show pop up after add event by user
  const eventDidMountHandler = (info) => {
    console.log("info", info);
    const scheduledTime = moment(info.event.start).format("YYYY-MM-DD HH:mm");
    return new bootstrap.Popover(info.el, {
      title: info.event._def.extendedProps.service_name,
      placement: "auto",
      trigger: "click",
      customClass: "popoverStyle",
      content: `<p><strong>Name: </strong>${info.event._def.extendedProps.user_name}</p>
                <p><strong>Description: </strong>Meeting will be held for ${info.event._def.extendedProps.description} appointment.</p>
                <p><strong>Scheduled Time: </strong>${scheduledTime}</p>
                <p><strong>Zoom Meeting url: </strong>https://zoom.com/appointment</p>`,
      html: true,
    });
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

  const handleDeleteEvent = async (eventId) => {
    try {
      await axios.delete(`/user/delete-meeting/${eventId}`, {
        headers: {
          Authorization: `Bearer ${authInfo.token}`,
        },
      });

      setEventDetails(eventDetails.filter((event) => event.id !== eventId));
      hidePopover();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  //show and hide pop up
  const hidePopover = () => {
    const popoverInstance = new bootstrap.Popover(
      document.querySelector(".fc-event-container"),
      {}
    );
    popoverInstance.destroy();
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
                    <label className="form-label">Meeting Time:</label>
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
                    <label className="form-label">Meeting Description:</label>
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
            <div>
              <span>{eventInfo.timeText}</span>
              <span>{eventInfo.event.title}</span>
              <button onClick={() => handleDeleteEvent(eventInfo.event.id)}>
                Delete
              </button>
            </div>
          );
        }}
        ref={handleCalendarInit}
      />
    </React.Fragment>
  );
}

export default ServiceCalendar;
