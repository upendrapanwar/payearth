import React from "react";
import axios from "axios";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const SCOPES = process.env.REACT_APP_SCOPES;

function ServiceCalendarAuth({ sellerId, authToken, onAuthSuccess }) {
  const responseGoogle = async (response) => {
    console.log("Response Google:", response);
    const { code } = response;

    console.log("Google Response", response);
    console.log("Refresh Token", code);

    try {
      const authInstance = gapi.auth2.getAuthInstance();
      const currentUser = authInstance.currentUser.get();
      const accessToken = currentUser.getAuthResponse().access_token;
      console.log("Access Token", accessToken);
      localStorage.setItem("accessToken", accessToken);
      fetchEvents();
    } catch (error) {
      localStorage.removeItem("accessToken");
      console.error("Error getting access token:", error);
    }
  };
  const responseError = (error) => {
    localStorage.removeItem("accessToken");
    console.error("Google authentication error:", error);
  };

  const fetchEvents = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      console.log("Access token in fetchEvents", accessToken);
      const response = await axios.get(
        "https://www.googleapis.com/calendar/v3/calendars/primary/events",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Calendar Events response:", response.data.items);
      console.log("Calendar response:", response.data);
      console.log("Response:", response.data);
      const eventsData = response.data.items.map((item) => ({
        eventId: item.id,
        title: item.summary,
        start: item.start.dateTime,
        end: item.end.dateTime,
      }));
      console.log("Events data:", eventsData);
      saveCalendarEvents(eventsData, sellerId, authToken);
      onAuthSuccess();
    } catch (error) {
      // localStorage.removeItem("accessToken");
      console.error("Error fetching events:", error);
    }
  };

  const saveCalendarEvents = async (eventsData, sellerId, authToken) => {
    try {
      const requestData = eventsData.map((event) => ({
        // sellerId: sellerId,
        eventId: event.eventId,
        eventTitle: event.title,
        startAt: event.start,
        endAt: event.end,
      }));

      const response = await axios.post(
        `seller/service/save-calendar-events`,
        requestData,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      console.log("Response of save calendar events request", response.data);
    } catch (error) {
      console.error("Error saving calendar events:", error);
    }
  };

  return (
    <React.Fragment>
      <div style={{ marginTop: "30px", marginBottom: "50px" }}>
        <GoogleLogin
          clientId={CLIENT_ID}
          buttonText="Sign in and Authorize Calendar"
          onSuccess={responseGoogle}
          onFailure={responseError}
          cookiePolicy={"single_host_origin"}
          responseType="code"
          accessType="offline"
          scope={SCOPES}
        />
      </div>
    </React.Fragment>
  );
}

export default ServiceCalendarAuth;
