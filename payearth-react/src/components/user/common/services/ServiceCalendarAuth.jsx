import React, { useState } from "react";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";
import ServiceCalendar from "./ServiceCalendar";

function ServiceCalendarAuth(props) {
  const { serviceCreator, serviceName} = props;
  const [refreshTimer, setRefreshTimer] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const responseGoogle = async (response) => {
    const { code } = response;
    localStorage.setItem("refreshToken", code);

    try {
      const authInstance = gapi.auth2.getAuthInstance();
      const currentUser = authInstance.currentUser.get();
      const accessToken = currentUser.xc.access_token;
      localStorage.setItem("accessToken", accessToken);
      setIsAuthenticated(true);
    } catch (error) {
      localStorage.removeItem("accessToken");
      console.error("Error getting access token:", error);
    }
  };
  const responseError = (error) => {
    localStorage.removeItem("accessToken");
    console.error("Google authentication error:", error);
  };

  return (
    <React.Fragment>
      <div style={{ marginTop: "30px", marginBottom: "50px" }}>
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
        {isAuthenticated && <ServiceCalendar serviceCreator={serviceCreator} serviceName={serviceName}/>}
      </div>
    </React.Fragment>
  );
}

export default ServiceCalendarAuth;
