import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction"; 
import axios from 'axios';
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

const Calendar = ({authToken}) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    console.log("Calendar authToken useEffect:", authToken);
    getCalendarEvents(authToken);
  }, []);

  const getCalendarEvents = async (authToken) => {
    console.log("Calendar authToken:", authToken);
    try {
      const response = await axios.get('seller/service/get-calendar-events', {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log("Calendar Events response", response.data.data);
      const eventsData = response.data.data.map(item => ({
        title: item.event_title,
        start: item.start_datetime,
        end: item.end_datetime,
      }));

      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const businessHours = [
    {
      daysOfWeek: [1,2,3,4,5,6], // Monday - Friday
      startTime: '09:00', // 9am
      endTime: '17:00', // 5pm
    }
  ];
  

  const eventDidMountHandler = (info) => {
    // Your logic for the popover
    return new bootstrap.Popover(info.el, {
      title: info.event.title,
      placement: "auto",
      trigger: "hover",
      customClass: "popoverStyle",
      content: `<p><strong>Start Time: </strong>${events.start} </p><p><strong>End Time: </strong>${events.end} </p>`,
      html: true,
    });
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={new Date()}
        events={events}
        eventDidMount={(info) => {
          eventDidMountHandler(info);
        }}
        dayMaxEventRows={true}
        views={{
          timeGrid: {
            dayMaxEventRows: 3
          }
        }}
        businessHours={businessHours}
      />
    </>
  );
};

export default Calendar;
