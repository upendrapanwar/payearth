import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";


export default class Calendar extends React.Component {
    handleDateClick = (arg) => { // bind with an arrow function
        alert(arg.dateStr);
    }
  render() {
    return (
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={new Date()}
        headerToolbar={{
          left: 'today prev,next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        dateClick={this.handleDateClick}
        // weekends={false}
        events={[
            { title: 'event 1', date: '2024-02-15' },
            { title: 'event 2', date: '2024-02-12' }
          ]}
      />
    )
  }
    
}
