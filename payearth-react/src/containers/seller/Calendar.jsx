import React, { useEffect, useState } from 'react';
import axios from "axios";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import moment from "moment";

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);


  useEffect(() => {
    getCalendarEvents();
  }, []);

  const getCalendarEvents = async () => {
    const authInfo = JSON.parse(localStorage.getItem("authInfo"));

    if (!authInfo) {
      console.error("No authInfo found in localStorage");
      return;
    }

    const token = authInfo.token;
    const sellerId = authInfo.id;

    if (!token || !sellerId) {
      console.error("Token or sellerId is missing");
      return;
    }

    try {
      const response = await axios.get("seller/service/get-seller-calendar-events", {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          "Authorization": `Bearer ${token}`,
        },
        params: {
          sellerId,
        },
      });

      console.log("response.data.data", response.data.data)
      if (response.data.status === true) {
        const eventsData = response.data.data.map((item) => ({
          id: item._id,
          title: item.service_id.name,
          start: item.start_datetime,
          end: item.end_datetime,
          description: item.event_description,
          meeting_url: item.meeting_url,
          user_name: item.user_id.name,
          phone: item.user_id.phone,
          email: item.user_id.email,
          service_name: item.service_id.name,
        }));
        console.log("eventsData", eventsData)
        setEvents(eventsData);
      }

    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };


  const handleDeleteEvent = async () => {
    if (!currentEvent || !currentEvent.id) {
      console.error("No event ID found for deletion");
      return;
    }

    console.log("checking currentEvent.id", currentEvent.id);

    try {
      if (window.confirm("Do you really want to delete this event?")) {
        const authInfo = JSON.parse(localStorage.getItem("authInfo"));
        const token = authInfo.token;

        const response = await axios.delete(`seller/service/delete-calendar-event/${currentEvent.id}`, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            "Authorization": `Bearer ${token}`,
          },
        })

        if (response.data.status === true) {
          // Remove the deleted event from the events state
          setEvents((prevEvents) =>
            prevEvents.filter((event) => event.id !== currentEvent.id)
          );

          // Close the modal after deletion
          handleCloseModal();
        }
        else {
          console.error("Error deleting event:", response.data.message || "Unknown error");
        }
      }
    } catch (error) {
      console.error("Error deleting event:", error.message || error);
    }
  };


  const handleEventClick = (info) => {
    const selectedEvent = {
      ...info.event.extendedProps,
      id: info.event.id,
      title: info.event.title,
      start: info.event.start.toISOString(),
      end: info.event.end ? info.event.end.toISOString() : null,
    };
    setCurrentEvent(selectedEvent);
    setModalOpen(true);
  };


  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentEvent(null);
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


  return (
    <React.Fragment>
      <FullCalendar
        height="125vh"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: '',
          center: 'title',
          right: 'prev,next today'
        }}

        eventClassNames="fc-daygrid-event"
        events={events}
        eventClick={handleEventClick}
        eventContent={renderEventContent}
      />

      {modalOpen && currentEvent && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{ background: "rgb(255 252 118)" }}>
                <h5 className="modal-title">{currentEvent.service_name}</h5>
                <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <p><strong>Title:</strong> {currentEvent.title}</p>
                <p><strong>Service Name:</strong> {currentEvent.service_name} &nbsp;&nbsp;&nbsp;<strong>User Name:</strong> {currentEvent.user_name}</p>
                <p><strong>Email:</strong> {currentEvent.email} &nbsp;&nbsp;&nbsp;&nbsp; <strong>Phone:</strong> {currentEvent.phone}</p>
                <p><strong>Start Time:</strong>{moment(currentEvent.start).format("YYYY-MM-DD hh:mm A")}</p>
                <p><strong>End Time:</strong> {currentEvent.end ? moment(currentEvent.end).format("YYYY-MM-DD hh:mm A") : "N/A"}</p>
                <p className="modal-description" style={{ maxHeight: '100px', overflowY: 'auto', marginBottom: '0', padding: '5px' }}><strong>Description:</strong> {currentEvent.description}</p>
                <br />
                <p><strong>Meeting URL:</strong> <a href={currentEvent.meeting_url} target="_blank" rel="noopener noreferrer">{currentEvent.meeting_url}</a></p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Close
                </button>
                <button
                  className="btn custom_btn btn_yellow"
                  onClick={() => handleDeleteEvent()}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}

export default Calendar;

