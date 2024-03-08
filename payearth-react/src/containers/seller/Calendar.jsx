import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction"; 
import axios from 'axios';
import * as bootstrap from "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import DatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { observer, useLocalStore } from "mobx-react-lite";
import { Button, ButtonGroup, Dropdown, Form } from "react-bootstrap";

const Calendar = ({authToken}) => {
  const [events, setEvents] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]);
  const [dayCellDates, setDayCellDates] = useState([]);
  const [offDays, setOffDays] = useState([]);
  const [businessHours, setBusinessHours] = useState([
    {
      daysOfWeek: [0,1,2,3,4,5,6], // Sunday - Saturday
      startTime: '09:00', // 9am
      endTime: '17:00', // 5pm
    }
  ]);
  const [calendarKey, setCalendarKey] = useState(0);

  useEffect(() => {
    getCalendarEvents(authToken);
    console.log("calendarKey", calendarKey)
  }, [businessHours, calendarKey]);


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
      console.log("Get Calendar Events response", response.data.data);
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

//   const blockDates = async (dates) => {
//     try {
//         const accessToken = localStorage.getItem("accessToken");

//         const events = dates.map(date => ({
//             'summary': 'Blocked',
//             'start': {
//               'dateTime': `${date}T09:00:00-07:00`,
//             },
//             'end': {
//               'dateTime': `${date}T17:00:00-07:00`,
//             },
//         }));

//         const responses = await Promise.all(events.map(event => 
//             axios.post(
//                 'https://www.googleapis.com/calendar/v3/calendars/primary/events',
//                 event,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${accessToken}`,
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             )
//         ));
//         responses.forEach((response, index) => {
//           console.log(`Event blocked for ${dates[index]}:`, response.data);
//         });
//         // fetchEvents();
//     } catch (error) {
//         console.error('Error creating events:', error);
//         throw error;
//     }
// };


//   const unblockDate = async (eventId) => {
//     try {
//       const accessToken = localStorage.getItem("accessToken");
//       const response = await axios.delete(
//         `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );
//       console.log('Date unblocked');
//       console.log('Event deleted:', response.data);
//     } catch (error) {
//       console.error('Error unblocking date:', error);
//       throw error; // Handle error appropriately
//     }
//   };

  

  const eventDidMountHandler = (info) => {
    // Your logic for the popover
    return new bootstrap.Popover(info.el, {
      title: info.event.title,
      placement: "auto",
      trigger: "hover",
      customClass: "popoverStyle",
      content: `<p><strong>Name: </strong>James Anderson</p><p><strong>Description: </strong>Meeting will be held for ${info.event.title} appointment.</p><p><strong>Scheduled Time: </strong>${events.start}</p><p><strong>Zoom Meeting url: </strong>https://zoom.com/appointment</p>`,
      html: true,
    });
  };

  const eventCellDidMountHandler = (info) => {
    info.el.style.backgroundColor = '#338EF0';
    info.el.style.color = 'white';
  };

  const dayCellDidMountHandler = (info) => {
    const date = info.date;
    const dateString = date.toISOString().slice(0, 10); // Get the date string in 'YYYY-MM-DD' format
    if (dayCellDates.includes(dateString)) {
      info.el.style.backgroundColor = '#EEEFEE'; // Set background color for the specified dates
    }
  };
  
  const handleSaveDate = () => {
    const formattedDates = selectedDates.map(date => date.format('YYYY-MM-DD'));
    setDayCellDates(formattedDates);
    console.log("formattedDates", formattedDates);
    // blockDates(formattedDates);
    setCalendarKey(key => key + 1);
  };

  const handleOffDaysChange = (id, checked) => {
    const updatedOffDays = checked ? [...offDays, id] : offDays.filter(day => day !== id);
    setOffDays(updatedOffDays);
    console.log("Check off days: ", offDays);
  };
  
  const handleOffDays = () => {
    const dayNameToIndex = {
      Sunday: 0,
      Monday: 1,
      Tuesday: 2,
      Wednesday: 3,
      Thursday: 4,
      Friday: 5,
      Saturday: 6
    };
    const indices = offDays.map(day => dayNameToIndex[day]);
    const updatedBusinessHours1 = businessHours.map(hours => ({
      ...hours,
      daysOfWeek: [0,1,2,3,4,5,6].filter(day => !indices.includes(day))
    }));
    setBusinessHours(updatedBusinessHours1);
  };

  const state = useLocalStore(() => ({
    items: [
      { id: "Sunday", label: "Sunday", checked: false },
      { id: "Monday", label: "Monday", checked: false },
      { id: "Tuesday", label: "Tuesday", checked: false },
      { id: "Wednesday", label: "Wednesday", checked: false },
      { id: "Thursday", label: "Thursday", checked: false },
      { id: "Friday", label: "Friday", checked: false },
      { id: "Saturday", label: "Saturday", checked: false }
    ]
  }));



  return (
    <div className="calendar-container">
      {/* <div className='row mb-4'>
      <div className="col-4 d-flex align-items-center">
        <label htmlFor="mySelect">Select off days:</label>
        &nbsp;&nbsp;
        <CheckboxDropdown items={state.items} onChange={handleOffDaysChange}/>
          <button type="button" className="btn custom_btn btn_yellow mx-auto btn-sm" onClick={handleOffDays}>Save Days</button>
      </div>
      <div className="col-2"></div>
    <div className="col-6">
    <label htmlFor="">Select Unavailable Days:  </label>
    &nbsp;&nbsp;
        <DatePicker
          value={selectedDates}
          onChange={setSelectedDates}
          multiple
          sort
          format="YYYY/MM/DD"
          calendarPosition="bottom-center"
          plugins={[<DatePanel />]}
          placeholder={selectedDates.length === 0 ? "Choose Date" : null}
        />
        &nbsp;&nbsp;&nbsp;
      <button type="button" className="btn custom_btn btn_yellow mx-auto btn-sm" onClick={handleSaveDate}>Save Date</button>
      </div>
      </div> */}

      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        initialDate={new Date()}
        events={events}
        eventDidMount={(info) => {
          eventDidMountHandler(info);
          eventCellDidMountHandler(info);
        }}
        dayMaxEventRows={true}
        views={{
          timeGrid: {
            dayMaxEventRows: 3
          }
        }}
        // businessHours={businessHours}
        timeZone="UTC"
        // dayCellDidMount= {(info) => {
        //   dayCellDidMountHandler(info);
        // }}
        // key={calendarKey}
      />
    </div>
  );
};

export default Calendar;


const CheckboxMenu = React.forwardRef(
  (
    {
      children,
      style,
      className,
      "aria-labelledby": labeledBy,
      onSelectAll,
      onSelectNone
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        style={style}
        className={`${className} CheckboxMenu`}
        aria-labelledby={labeledBy}
      >
        <div
          className="d-flex flex-column"
          style={{ maxHeight: "calc(100vh)", overflow: "none" }}
        >
          <ul
            className="list-unstyled flex-shrink mb-0"
            style={{ overflow: "auto" }}
          >
            {children}
          </ul>
          <div className="dropdown-item border-top pt-2 pb-0">
            <ButtonGroup size="sm">
              <Button variant="link" onClick={onSelectNone}>
                Reset
              </Button>
            </ButtonGroup>
          </div>
        </div>
      </div>
    );
  }
);

const CheckDropdownItem = React.forwardRef(
  ({ children, id, checked, onChange }, ref) => {
    return (
      <Form.Group ref={ref} className="dropdown-item mb-0" controlId={id}>
        <Form.Check
          type="checkbox"
          label={children}
          checked={checked}
          onChange={onChange && onChange.bind(onChange, id)}
        />
      </Form.Group>
    );
  }
);

export const CheckboxDropdown = observer(({ items, onChange }) => {
  const handleChecked = (key, event) => {
    const checked = event.target.checked;
    items.find(i => i.id === key).checked = checked;
    onChange(key, checked);
  };

  const handleSelectNone = () => {
    items.forEach(i => (i.checked = false));
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="light" id="dropdown-basic">
        days
      </Dropdown.Toggle>

      <Dropdown.Menu
        as={CheckboxMenu}
        onSelectNone={handleSelectNone}
      >
        {items.map(i => (
          <Dropdown.Item
            key={i.id}
            as={CheckDropdownItem}
            id={i.id}
            checked={i.checked}
            onChange={handleChecked}
          >
            {i.label}
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
});