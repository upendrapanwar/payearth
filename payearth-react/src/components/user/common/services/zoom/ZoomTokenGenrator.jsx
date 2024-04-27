// import React, { useState, forwardRef } from "react";
// import { configure } from "mobx";
// import { ZoomMtg } from "@zoomus/websdk";

// // Configure MobX
// configure({ isolateGlobalState: true });

// // Initialize Zoom SDK
// ZoomMtg.setZoomJSLib("https://source.zoom.us/1.9.1/lib", "/av");

// const ZoomTokenGenerator = forwardRef((props, ref) => {
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   const authEndpoint = ""; // Your authentication endpoint URL
//   const sdkKey = process.env.REACT_APP_ZOOM_CLIENT_ID;
//   const meetingNumber = "123456789";
//   const passWord = "";
//   const role = 0;
//   const userName = "React";
//   const userEmail = "eynokoushal@gmail.com";
//   const registrantToken = "";
//   const zakToken = "";
//   const leaveUrl = "http://localhost:3000";

//   const getSignature = () => {
//     setLoading(true);

//     fetch(authEndpoint, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         meetingNumber: meetingNumber,
//         role: role,
//       }),
//     })
//       .then((res) => res.json())
//       .then((response) => {
//         startMeeting(response.signature);
//       })
//       .catch((error) => {
//         setLoading(false);
//         setErrorMessage("Failed to fetch signature. Please try again.");
//         console.error(error);
//       });
//   };

//   const startMeeting = (signature) => {
//     ZoomMtg.init({
//       leaveUrl: leaveUrl,
//       success: (success) => {
//         ZoomMtg.join({
//           signature: signature,
//           sdkKey: sdkKey,
//           meetingNumber: meetingNumber,
//           passWord: passWord,
//           userName: userName,
//           userEmail: userEmail,
//           tk: registrantToken,
//           zak: zakToken,
//           success: (success) => {
//             console.log(success);
//           },
//           error: (error) => {
//             setErrorMessage("Failed to join meeting. Please try again.");
//             console.error(error);
//           },
//         });
//       },
//       error: (error) => {
//         setErrorMessage("Failed to initialize Zoom SDK. Please try again.");
//         console.error(error);
//       },
//     });
//   };

//   return (
//     <div className="zoom" ref={ref}>
//       <h1>Zoom Meeting SDK Sample React</h1>
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <button onClick={getSignature}>Join Meeting</button>
//       )}
//       {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
//     </div>
//   );
// });

// export default ZoomTokenGenerator;

//***************************************************** */
import React, { useState } from "react";
import axios from "axios";

const ZoomTokenGenerator = () => {
  const [accessToken, setAccessToken] = useState("");
  const [error, setError] = useState(null);

  const generateToken = async () => {
    //const clientId = process.env.REACT_APP_ZOOM_CLIENT_ID;
    //const clientSecret = process.env.REACT_APP_ZOOM_CLIENT_SECRET;
    const accountId = process.env.REACT_APP_ZOOM_ACCOUNT_ID;

    //const base64EncodedCredentials = btoa(`${clientId}:${clientSecret}`);
    const base64EncodedCredentials =
      "ZUxyemFwbWRSd3FET3ZmOUxRd3JTZzpkTlR0djdmRDdPUnBWWDhNVnNmbzNyV3dvS0pCOWExSg==";
    const requestBody = new URLSearchParams();
    requestBody.append("grant_type", "account_credentials");
    requestBody.append("account_id", accountId);

    try {
      const response = await axios.post(
        "https://zoom.us/oauth/token",
        requestBody,
        {
          //mode: "no-cors",
          headers: {
            //"Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${base64EncodedCredentials}`,
            //"Access-Control-Allow-Origin": "*",
          },
        }
      );

      const data = response.data;
      setAccessToken(data.access_token);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <button className="btn btn-danger" onClick={generateToken}>
        Generate Token
      </button>
      {error && <p>Error: {error}</p>}
      {accessToken && (
        <div>
          <p>Access Token: {accessToken}</p>
        </div>
      )}
    </div>
  );
};

export default ZoomTokenGenerator;
