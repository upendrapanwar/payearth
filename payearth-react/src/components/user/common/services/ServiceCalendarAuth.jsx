import React, { useEffect, useState } from "react";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import ServiceCalendar from "./ServiceCalendar";

//Google calendar client secret from .env
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const SCOPES = process.env.REACT_APP_SCOPES;

function ServiceCalendarAuth() {
  const [refreshTimer, setRefreshTimer] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    refreshAccessToken();
  }, []);

  // Google Auth 2.0 authentication for generate refresh token
  const responseGoogle = async (response) => {
    console.log("checking google response", response);
    //generated refresh token
    const { code } = response;
    console.log("checking code", code)
    //set refresh token in localStorage
    localStorage.setItem("refreshToken", code);

    //use gapi for generate access token for authentication purpose
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      console.log("checking authInstance", authInstance)

      const currentUser = authInstance.currentUser.get();
      console.log("checking currentUser", currentUser)

      //generated access token
      const accessToken = currentUser.getAuthResponse().access_token;
      console.log("checking accessToken for google calendar", accessToken)

      //set access token in localStorage
      localStorage.setItem("accessToken", accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem("accessToken");
      console.error("Error getting access token:", error);
    }
  };
  //responseError if access token remove from localStorage
  const responseError = (error) => {
    localStorage.removeItem("accessToken");
    console.error("Google authentication error:", error);
  };
  // Function for generate new access token after expired old access token
  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("Refresh token not found in local storage");
      }
      const authInstance = gapi.auth2.getAuthInstance();
      const currentUser = authInstance.currentUser.get();
      await currentUser.reloadAuthResponse();
      const newAccessToken = currentUser.getAuthResponse().access_token;
      console.log("New Access Token", newAccessToken);
      // Check if the access token is different from the previous one
      const oldAccessToken = localStorage.getItem("accessToken");
      if (newAccessToken !== oldAccessToken) {
        console.log("Access token replaced successfully");
      }
      localStorage.setItem("accessToken", newAccessToken);
      // Calculate the remaining time until token expiration (in milliseconds)
      const expiresIn = currentUser.getAuthResponse().expires_in * 1000;
      const refreshTime = expiresIn - 2 * 60 * 1000; // Refresh 2 minutes before expiration
      // Set up a timer to refresh the token just before it expires
      const timer = setTimeout(refreshAccessToken, refreshTime);
      console.log(timer);
      setRefreshTimer(timer);
    } catch (error) {
      localStorage.removeItem("accessToken");
      console.error("Error refreshing access token:", error);
    }
  };
  return (
    <React.Fragment>
      <div style={{ marginTop: "30px", marginBottom: "50px" }}>
        {/* Render GoogleLogin button only if isAuthenticated is false */}
        {!isAuthenticated && (
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
        )}
        {/* Render ServiceCalendar if isAuthenticated is true */}
        {isAuthenticated && <ServiceCalendar />}
      </div>
    </React.Fragment>
  );
}

export default ServiceCalendarAuth;
