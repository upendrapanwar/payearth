import React, { useState } from 'react';
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import Calendar from '../seller/Calendar'


export const CalendarAuth = () => {
  //state managment
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const responseGoogle = async (response) => {
    const { code } = response;
    localStorage.setItem("refreshToken", code);

    //use gapi for generate access token for authentication purpose
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      console.log("authInstance", authInstance)
      const currentUser = authInstance.currentUser.get();
      console.log("currentUser", currentUser)

      //generated access token
      const accessToken = currentUser.xc.access_token;
      console.log("accessToken", accessToken)

      //set access token in localStorage
      localStorage.setItem("accessToken", accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error getting access token:", error);
    }
  };


  const responseError = (error) => {
    localStorage.removeItem("accessToken");
    console.error("Google authentication error:", error);
  };



  return (
    <React.Fragment>
      <React.Fragment>
        <div style={{ marginTop: "30px", marginBottom: "50px" }}>
          {/* Render GoogleLogin button only if isAuthenticated is false */}
          {!isAuthenticated && (
            <GoogleLogin
              clientId={process.env.REACT_APP_CLIENT_ID}
              buttonText="Sign in and Authorize Calendar"
              onSuccess={responseGoogle}
              onFailure={responseError}
              cookiePolicy={"single_host_origin"}
              responseType="code"
              accessType="offline"
              scope={process.env.REACT_APP_SCOPES}
            />
          )}
          {/* Render Calendar if isAuthenticated is true */}
          {isAuthenticated && <Calendar />}
        </div>
      </React.Fragment>
    </React.Fragment>
  )
}
