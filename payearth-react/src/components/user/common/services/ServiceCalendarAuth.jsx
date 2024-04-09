import React from "react";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const SCOPES = process.env.REACT_APP_SCOPES;

function ServiceCalendarAuth({ userId, authToken, onAuthSuccess }) {
  const responseGoogle = async (response) => {
    console.log("Response Google:", response);
    const { code } = response;
    localStorage.setItem("refreshToken", code);

    console.log("Google Response", response);
    console.log("Refresh Token", code);

    try {
      const authInstance = gapi.auth2.getAuthInstance();
      const currentUser = authInstance.currentUser.get();
      const accessToken = currentUser.getAuthResponse().access_token;
      console.log("Access Token", accessToken);
      localStorage.setItem("accessToken", accessToken);
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
//***************************Today Morning Code ******************************** */

// import React, { useEffect } from "react";
// import { GoogleLogin } from "react-google-login";
// import { gapi } from "gapi-script";

// const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
// const SCOPES = process.env.REACT_APP_SCOPES;

// function ServiceCalendarAuth({ userId, authToken, onAuthSuccess }) {
//   useEffect(() => {
//     const refreshToken = localStorage.getItem("refreshToken");
//     if (refreshToken) {
//       exchangeRefreshTokenForAccessToken(refreshToken);
//     }
//   }, []);

//   const exchangeRefreshTokenForAccessToken = async (refreshToken) => {
//     try {
//       const response = await fetch(
//         `https://www.googleapis.com/oauth2/v4/token`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//           },
//           body: new URLSearchParams({
//             client_id: CLIENT_ID,
//             grant_type: "refresh_token",
//             refresh_token: refreshToken,
//           }),
//         }
//       );
//       const data = await response.json();
//       if (data && data.access_token) {
//         localStorage.setItem("accessToken", data.access_token);
//         console.log("New Access Token:", data.access_token);
//       } else {
//         console.error("Unable to get access token from refresh token:", data);
//       }
//     } catch (error) {
//       console.error("Error exchanging refresh token for access token:", error);
//     }
//   };

//   const responseGoogle = async (response) => {
// console.log("Response Google:", response);
// const { code } = response;
// localStorage.setItem("refreshToken", code);

// console.log("Google Response", response);
// console.log("Refresh Token", code);

// try {
//   const authInstance = gapi.auth2.getAuthInstance();
//   const currentUser = authInstance.currentUser.get();
//   const accessToken = currentUser.getAuthResponse().access_token;
//   console.log("Access Token", accessToken);
//   localStorage.setItem("accessToken", accessToken);
// } catch (error) {
//   localStorage.removeItem("accessToken");
//   console.error("Error getting access token:", error);
// }
//   };

//   const responseError = (error) => {
// localStorage.removeItem("accessToken");
// console.error("Google authentication error:", error);
//   };

//   return (
//     <React.Fragment>
//       <div style={{ marginTop: "30px", marginBottom: "50px" }}>
//         <GoogleLogin
//           clientId={CLIENT_ID}
//           buttonText="Sign in and Authorize Calendar"
//           onSuccess={responseGoogle}
//           onFailure={responseError}
//           cookiePolicy={"single_host_origin"}
//           responseType="code"
//           accessType="offline"
//           scope={SCOPES}
//         />
//       </div>
//     </React.Fragment>
//   );
// }

// export default ServiceCalendarAuth;

//****************************without using RefreshToken*************************************************** */
// import React from "react";
// import { GoogleLogin } from "react-google-login";
// import { gapi } from "gapi-script";

// const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
// const SCOPES = process.env.REACT_APP_SCOPES;

// function ServiceCalendarAuth({ userId, authToken, onAuthSuccess }) {
//   const responseGoogle = async (response) => {
//     console.log("Response Google:", response);
//     const { code } = response;
//     localStorage.setItem("refreshToken", code);

//     console.log("Google Response", response);
//     console.log("Refresh Token", code);

//     try {
//       const authInstance = gapi.auth2.getAuthInstance();
//       const currentUser = authInstance.currentUser.get();
//       const accessToken = currentUser.getAuthResponse().access_token;
//       console.log("Access Token", accessToken);
//       localStorage.setItem("accessToken", accessToken);
//     } catch (error) {
//       localStorage.removeItem("accessToken");
//       console.error("Error getting access token:", error);
//     }
//   };
//   const responseError = (error) => {
//     localStorage.removeItem("accessToken");
//     console.error("Google authentication error:", error);
//   };

//   return (
//     <React.Fragment>
//       <div style={{ marginTop: "30px", marginBottom: "50px" }}>
//         <GoogleLogin
//           clientId={CLIENT_ID}
//           buttonText="Sign in and Authorize Calendar"
//           onSuccess={responseGoogle}
//           onFailure={responseError}
//           cookiePolicy={"single_host_origin"}
//           responseType="code"
//           accessType="offline"
//           scope={SCOPES}
//         />
//       </div>
//     </React.Fragment>
//   );
// }

// export default ServiceCalendarAuth;

// ******************************************************************************

// import React, { useEffect } from "react";
// import axios from "axios";
// import { GoogleLogin } from "react-google-login";
// import { gapi } from "gapi-script";

// const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
// const SCOPES = process.env.REACT_APP_SCOPES;

// function ServiceCalendarAuth({ userId, authToken, onAuthSuccess }) {
//   const responseGoogle = async (response) => {
//     console.log("Response Google:", response);
//     const { code } = response;

//     console.log("Google Response", response);
//     console.log("Authorization Code", code);

//     try {
//       const authInstance = gapi.auth2.getAuthInstance();
//       const currentUser = authInstance.currentUser.get();
//       const accessToken = currentUser.getAuthResponse().access_token;
//       const refreshToken = currentUser.getAuthResponse().refresh_token;
//       console.log("Access Token", accessToken);
//       console.log("Refresh Token", refreshToken);

//       // Store the tokens in local storage
//       localStorage.setItem("accessToken", accessToken);
//       localStorage.setItem("refreshToken", refreshToken);

//       // Call the function to handle successful authentication
//       onAuthSuccess();
//     } catch (error) {
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       console.error("Error getting tokens:", error);
//     }
//   };

//   const responseError = (error) => {
//     localStorage.removeItem("accessToken");
//     localStorage.removeItem("refreshToken");
//     console.error("Google authentication error:", error);
//   };

//   useEffect(() => {
//     // Check if refresh token exists in local storage
//     const refreshToken = localStorage.getItem("refreshToken");
//     if (refreshToken) {
//       // Call a function to refresh the access token
//       refreshAccessToken(refreshToken);
//     }
//   }, []);

//   const refreshAccessToken = async (refreshToken) => {
//     try {
//       const response = await axios.post(
//         "https://oauth2.googleapis.com/token",
//         {
//           client_id: CLIENT_ID,
//           client_secret: process.env.REACT_APP_CLIENT_SECRET,
//           refresh_token: refreshToken,
//           grant_type: "refresh_token",
//         }
//       );

//       const { access_token } = response.data;
//       console.log("New Access Token", access_token);
//       // Store the new access token in local storage
//       localStorage.setItem("accessToken", access_token);
//     } catch (error) {
//       localStorage.removeItem("accessToken");
//       localStorage.removeItem("refreshToken");
//       console.error("Error refreshing access token:", error);
//     }
//   };

//   return (
//     <React.Fragment>
//       <div style={{ marginTop: "30px", marginBottom: "50px" }}>
//         <GoogleLogin
//           clientId={CLIENT_ID}
//           buttonText="Sign in and Authorize Calendar"
//           onSuccess={responseGoogle}
//           onFailure={responseError}
//           cookiePolicy={"single_host_origin"}
//           responseType="code"
//           accessType="offline"
//           scope={SCOPES}
//         />
//       </div>
//     </React.Fragment>
//   );
// }

// export default ServiceCalendarAuth;
