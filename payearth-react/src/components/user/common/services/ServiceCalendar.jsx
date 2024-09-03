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
import { Formik, Form, Field, ErrorMessage } from "formik";



function ServiceCalendar() {
  const calendarRef = useRef(null);
  const authInfo = JSON.parse(localStorage.getItem("authInfo"));
  const user_id = authInfo.id;
  const { id } = useParams();
  const service_id = id;
  const [formOpen, setFormOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");


  useEffect(() => {
    fetchEvents();
  }, [id]);



  const handleDateClick = (arg) => {
    setSelectedDate(moment(arg.date).format("YYYY-MM-DD")); // Set the selected date
    setFormOpen(true); // Open the form
  };

  const handleFormSubmit = async (values) => {
    console.log("check formik values", values)
    // Combine date and time into a single ISO string
    const start_datetime = moment(`${values.meetingDate}T${values.meetingTime}`).toISOString();
    console.log("Start datetime:", start_datetime);

    // Validate the start datetime
    if (moment(start_datetime).isBefore(moment(), "minute")) {
      toast.error("Please select the current time or a future time.");
      return;
    }

    // Set the end datetime (for this example, we're assuming the event lasts for 1 hour)
    const end_datetime = moment(start_datetime).add(1, "hour").toISOString();
    console.log("End datetime:", end_datetime);

    const eventData = {
      start: { dateTime: start_datetime, timeZone: "Asia/Kolkata" },
      end: { dateTime: end_datetime, timeZone: "Asia/Kolkata" },
      summary: values.event_title,
      description: values.description,
      location: "https://ZoomMeeting.com",
    };

    try {
      const accessToken = localStorage.getItem("accessToken");

      const addEvent = await axios.post(`https://www.googleapis.com/calendar/v3/calendars/primary/events`, eventData, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      })
      console.log("checking google calendar posted data response", addEvent)
      if (addEvent.data.status === "confirmed") {
        toast.success("Event added successfully");
        setFormOpen(false);
        await saveCalendarEvents()
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
      }));
      setEventDetails(formattedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };


  const fetchGoogleEvents = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");


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
          meeting_url: item.location,
        }));

        if (eventsData.length > 0) {
          const lastEvent = eventsData[eventsData.length - 1];
          await saveCalendarEvents([lastEvent], service_id, user_id);
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
      }));
      const response = await axios.post(`/user/add-calendar-event/${authInfo.id}`, requestData, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          "Authorization": `Bearer ${authInfo.token}`,
        },
      })
      if (response.data.status === true) {
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
      const dataBaseResponse = await axios.delete(`/user/del-calendar-event/${id}`, {
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
      />
    </React.Fragment>
  );
}

export default ServiceCalendar;






//*************************Without useing refresh new access token*********************************** */
// import React, { useState, useRef, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import userCalendarAddEventSchema from '../../../../validation-schemas/userCalendarAddEventSchema'
// import FullCalendar from "@fullcalendar/react";
// import dayGridPlugin from "@fullcalendar/daygrid";
// import timeGridPlugin from "@fullcalendar/timegrid";
// import interactionPlugin from "@fullcalendar/interaction";
// import { toast } from "react-toastify";
// import moment from "moment";
// import { Formik, Form, Field, ErrorMessage } from "formik";

// function ServiceCalendar() {
//   const calendarRef = useRef(null);
//   const authInfo = JSON.parse(localStorage.getItem("authInfo"));
//   const user_id = authInfo.id;
//   const accessToken = localStorage.getItem("accessToken");
//   const { id } = useParams();
//   const service_id = id;
//   const [formOpen, setFormOpen] = useState(false);
//   const [eventDetails, setEventDetails] = useState([]);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedDate, setSelectedDate] = useState("");


//   useEffect(() => {
//     if (!localStorage.getItem("authInfo")) {
//       console.log("localStorage is cleared");
//     } else {
//       fetchEvents();
//       // fetchGoogleEvents();
//     }
//   }, [id]);

//   const handleDateClick = (arg) => {
//     setSelectedDate(moment(arg.date).format("YYYY-MM-DD")); // Set the selected date
//     setFormOpen(true); // Open the form
//   };

//   //************************Code write for React Js****************************
//   const handleFormSubmit = async (values) => {
//     console.log("check formik values", values)
//     // Combine date and time into a single ISO string
//     const start_datetime = moment(`${values.meetingDate}T${values.meetingTime}`).toISOString();
//     console.log("Start datetime:", start_datetime);

//     // Validate the start datetime
//     if (moment(start_datetime).isBefore(moment(), "minute")) {
//       toast.error("Please select the current time or a future time.");
//       return;
//     }

//     // Set the end datetime (for this example, we're assuming the event lasts for 1 hour)
//     const end_datetime = moment(start_datetime).add(1, "hour").toISOString();
//     console.log("End datetime:", end_datetime);

//     const eventData = {
//       start: { dateTime: start_datetime, timeZone: "Asia/Kolkata" },
//       end: { dateTime: end_datetime, timeZone: "Asia/Kolkata" },
//       summary: values.event_title,
//       description: values.description,
//       location: "https://ZoomMeeting.com",
//     };

//     console.log("checking eventData", eventData)

//     try {
//       const addEvent = await axios.post(`https://www.googleapis.com/calendar/v3/calendars/primary/events`, eventData, {
//         headers: {
//           "Authorization": `Bearer ${accessToken}`,
//         },
//       })
//       console.log("checking google calendar posted data response", addEvent)
//       if (addEvent.data.status === "confirmed") {
//         toast.success("Event added successfully");
//         setFormOpen(false);
//         await saveCalendarEvents()
//         await fetchGoogleEvents();
//       }
//     } catch (error) {
//       if (error.response && error.response.data.error === 'Request had insufficient authentication scopes.') {
//         toast.error("Insufficient scope. Please reauthenticate and grant the necessary permissions.");
//       } else {
//         toast.error("Event hasn't added");
//       }
//       console.error("Error submitting form:", error);
//     }
//   }


//   //*****************Code write for Node js***********************************
//   // const handleFormSubmit = async (values) => {
//   //   console.log("check formik values", values)
//   //   // Combine date and time into a single ISO string
//   //   const start_datetime = moment(`${values.meetingDate}T${values.meetingTime}`).toISOString();
//   //   console.log("Start datetime:", start_datetime);

//   //   // Validate the start datetime
//   //   if (moment(start_datetime).isBefore(moment(), "minute")) {
//   //     toast.error("Please select the current time or a future time.");
//   //     return;
//   //   }

//   //   // Set the end datetime (for this example, we're assuming the event lasts for 1 hour)
//   //   const end_datetime = moment(start_datetime).add(1, "hour").toISOString();
//   //   console.log("End datetime:", end_datetime);

//   //   const eventData = {
//   //     service_id: service_id,
//   //     user_id: user_id,
//   //     start: { dateTime: start_datetime, timeZone: "Asia/Kolkata" },
//   //     end: { dateTime: end_datetime, timeZone: "Asia/Kolkata" },
//   //     summary: values.event_title,
//   //     description: values.description,
//   //     location: "https://ZoomMeeting.com",
//   //   };

//   //   console.log("checking eventData", eventData)

//   //   try {
//   //     const access_token = localStorage.getItem("accessToken");
//   //     const addEvent = await axios.post(`/user/add-google-calendar-event/${authInfo.id}`,
//   //       { eventData, access_token },
//   //       {
//   //         headers: {
//   //           "Accept": "application/json",
//   //           "Content-Type": "application/json;charset=UTF-8",
//   //           "Authorization": `Bearer ${authInfo.token}`,
//   //         }
//   //       }
//   //     )

//   //     if (addEvent) {
//   //       toast.success("Event added successfully");
//   //       setFormOpen(false);
//   //       await fetchGoogleEvents();
//   //       // await fetchGoogleCalendarEvents();
//   //     }
//   //   } catch (error) {
//   //     if (error.response && error.response.data.error === 'insufficient_scope') {
//   //       toast.error("Insufficient scope. Please reauthenticate and grant the necessary permissions.");
//   //     } else {
//   //       toast.error("Event hasn't added");
//   //     }
//   //     console.error("Error submitting form:", error);
//   //   }
//   // }

//   //*****************Code write for Node js***********************************
//   // const fetchGoogleCalendarEvents = async () => {
//   //   const access_token = localStorage.getItem("accessToken");
//   //   try {
//   //     const response = await axios.get(`/user/fetch-google-calendar-event/${authInfo.id}`, { access_token }, {
//   //       headers: {
//   //         "Accept": "application/json",
//   //         "Content-Type": "application/json;charset=UTF-8",
//   //         "Authorization": `Bearer ${authInfo.token}`,
//   //       },
//   //     })
//   //     console.log("response", response)
//   //     // const formattedEvents = response.data.data.map((event) => ({
//   //     //   event_id: event.event_id,
//   //     //   id: event._id,
//   //     //   user_name: event.user_id.name,
//   //     //   service_name: event.service_id.name,
//   //     //   description: event.event_description,
//   //     //   meeting_url: event.meeting_url,
//   //     //   meetingTitle: event.event_title,
//   //     //   start: event.start_datetime,
//   //     //   end: event.end_datetime,
//   //     //   title: event.event_title,
//   //     // }));
//   //     // setEventDetails(formattedEvents);
//   //   } catch (error) {
//   //     console.error("Error fetching events:", error);
//   //   }
//   // };


//   //************************Code write for React Js****************************

//   const fetchEvents = async () => {
//     try {
//       const response = await axios.get(`/user/get-calendar-event/${authInfo.id}`, {
//         headers: {
//           Authorization: `Bearer ${authInfo.token}`,
//         },
//       });
//       const formattedEvents = response.data.data.map((event) => ({
//         event_id: event.event_id,
//         id: event._id,
//         user_name: event.user_id.name,
//         service_name: event.service_id.name,
//         description: event.event_description,
//         meeting_url: event.meeting_url,
//         meetingTitle: event.event_title,
//         start: event.start_datetime,
//         end: event.end_datetime,
//         title: event.event_title,
//       }));
//       setEventDetails(formattedEvents);
//     } catch (error) {
//       console.error("Error fetching events:", error);
//     }
//   };




//   const fetchGoogleEvents = async () => {
//     try {
//       const response = await axios.get("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       })

//       if (response.status === 200) {
//         const eventsData = response.data.items.map((item) => ({
//           eventId: item.id,
//           title: item.summary,
//           start: item.start.dateTime,
//           end: item.end.dateTime,
//           description: item.description,
//           meeting_url: item.location,
//         }));

//         if (eventsData.length > 0) {
//           const lastEvent = eventsData[eventsData.length - 1];
//           await saveCalendarEvents([lastEvent], service_id, user_id);
//         } else {
//           console.log("No events fetched.");
//         }
//       }
//     } catch (error) {
//       console.error("Error fetching events:", error);
//     }
//   };

//   const saveCalendarEvents = async (eventsData, service_id, user_id) => {
//     try {
//       const requestData = eventsData.map((event) => ({
//         user_id,
//         service_id,
//         event_id: event.eventId,
//         event_title: event.title,
//         start_datetime: event.start,
//         end_datetime: event.end,
//         event_description: event.description,
//         meeting_url: event.meeting_url,
//       }));
//       const response = await axios.post(`/user/add-calendar-event/${authInfo.id}`, requestData, {
//         headers: {
//           "Accept": "application/json",
//           "Content-Type": "application/json;charset=UTF-8",
//           "Authorization": `Bearer ${authInfo.token}`,
//         },
//       })
//       if (response.data.status === true) {
//         await fetchEvents();
//       }
//     } catch (error) {
//       console.error("Error saving calendar events:", error);
//     }
//   };

//   const handleDeleteEvent = async (id, event_id) => {
//     try {
//       const googleCalendarResponse = await axios.delete(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${event_id}`, {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//         },
//       })
//       if (googleCalendarResponse) {
//         handleCloseModal();
//         await deleteFromDatabase(id)
//       } else {
//         toast.error("Failed to delete event from Google Calendar");
//       }
//     } catch (error) {
//       console.error("Error deleting event from google calendar:", error);
//     }
//   };

//   const deleteFromDatabase = async (id) => {
//     try {
//       const dataBaseResponse = await axios.delete(`/user/del-calendar-event/${id}`, {
//         headers: {
//           "Accept": "application/json",
//           "Content-Type": "application/json;charset=UTF-8",
//           "Authorization": `Bearer ${authInfo.token}`,
//         },
//       })
//       if (dataBaseResponse.data.status === true) {
//         setEventDetails(eventDetails.filter((event) => event.id !== id));
//         toast.success("Event Deleted successfully");
//       } else {
//         toast.error("Database deletion failed");
//       }
//     } catch (error) {
//       console.error("Error deleting event:", error);
//     }
//   }

//   const handleEventClick = (info) => {
//     setSelectedEvent({
//       ...info.event.extendedProps,
//       id: info.event.id,
//       event_id: info.event.extendedProps.event_id
//     });
//     setModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setModalOpen(false);
//     setSelectedEvent(null);
//   };

//   const renderEventContent = (eventInfo) => {
//     const { start, title } = eventInfo.event;
//     const startTime = moment(start).format("h:mm A");
//     return (
//       <div className="fc-daygrid-event-content">
//         <div className="fc-daygrid-event-time">{startTime}</div>
//         <div className="fc-daygrid-event-title">{title}</div>
//       </div>
//     );
//   };

//   return (
//     <React.Fragment>
//       {formOpen && (
//         <div className="modal fade show" style={{ display: "block" }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header" style={{ background: "rgb(255 252 118)" }}>
//                 <h5 className="modal-title">Schedule Event</h5>
//                 <button type="button" className="btn-close" onClick={() => setFormOpen(false)} aria-label="Close"></button>
//               </div>

//               <div className="modal-body">
//                 <Formik
//                   initialValues={{
//                     event_title: "",
//                     meetingDate: selectedDate,
//                     meetingTime: "",
//                     description: "",
//                   }}
//                   validationSchema={userCalendarAddEventSchema}
//                   onSubmit={handleFormSubmit}
//                 >
//                   {({ errors, touched, setFieldValue }) => (
//                     <Form>
//                       <div className="mb-3">
//                         <label className="form-label">Title:</label>
//                         <Field
//                           type="text"
//                           className="form-control"
//                           name="event_title"
//                         />
//                         <ErrorMessage name="event_title" component="div" className="text-danger" />
//                       </div>
//                       <div className="mb-3">
//                         <label className="form-label">Meeting Date:</label>
//                         <Field
//                           type="date"
//                           className="form-control"
//                           name="meetingDate"
//                           value={selectedDate} // Ensure the selectedDate is shown
//                           onChange={(e) => setFieldValue("meetingDate", e.target.value)}
//                         />
//                         <ErrorMessage name="meetingDate" component="div" className="text-danger" />
//                       </div>
//                       <div className="mb-3">
//                         <label className="form-label">Start Time:</label>
//                         <Field
//                           type="time"
//                           className="form-control"
//                           name="meetingTime"
//                         />
//                         <ErrorMessage name="meetingTime" component="div" className="text-danger" />
//                       </div>
//                       <div className="mb-3">
//                         <label className="form-label">Description:</label>
//                         <Field
//                           as="textarea"
//                           className="form-control"
//                           name="description"
//                         />
//                         <ErrorMessage name="description" component="div" className="text-danger" />
//                       </div>
//                       <div className="mb-3">
//                         <button type="submit" className="btn custom_btn btn_yellow">
//                           Submit
//                         </button>
//                         <button type="button" className="btn btn-secondary" onClick={() => setFormOpen(false)}>
//                           Cancel
//                         </button>
//                       </div>
//                     </Form>
//                   )}
//                 </Formik>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       {modalOpen && selectedEvent && (
//         <div className="modal fade show" style={{ display: "block" }}>
//           <div className="modal-dialog modal-dialog-centered">
//             <div className="modal-content">
//               <div className="modal-header" style={{ background: "rgb(255 252 118)" }}>
//                 <h5 className="modal-title">{selectedEvent.meetingTitle}</h5>
//                 <button type="button" className="btn-close" onClick={handleCloseModal} aria-label="Close"></button>
//               </div>
//               <div className="modal-body">
//                 <p><strong>Name :</strong> &nbsp; <b>{selectedEvent.user_name}</b></p>
//                 <p className="modal-description"><strong>Description :</strong> &nbsp; {selectedEvent.description}</p>
//                 <p><strong>Start Time :</strong> &nbsp; {moment(selectedEvent.start).format("YYYY-MM-DD hh:mm A")}</p>
//                 <p><strong>End Time :</strong> &nbsp; {moment(selectedEvent.end).format("YYYY-MM-DD hh:mm A")}</p>
//                 <p><strong>Zoom Meeting URL :</strong> &nbsp; {selectedEvent.meeting_url}</p>
//               </div>
//               <div className="modal-footer">
//                 <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
//                   Close
//                 </button>
//                 <button
//                   className="btn custom_btn btn_yellow"
//                   onClick={() => handleDeleteEvent(selectedEvent.id, selectedEvent.event_id)}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <FullCalendar
//         height="125vh"
//         plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
//         initialView="dayGridMonth"
//         headerToolbar={{
//           left: '',
//           center: 'title',
//           right: 'prev,next today'
//         }}
//         dateClick={handleDateClick}
//         events={eventDetails}
//         eventClick={handleEventClick}
//         eventContent={renderEventContent}
//         ref={calendarRef}
//         eventClassNames="fc-daygrid-event"
//       />
//     </React.Fragment>
//   );
// }

// export default ServiceCalendar;

