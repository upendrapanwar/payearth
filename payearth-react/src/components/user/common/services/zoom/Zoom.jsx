// import React, { useEffect, useState } from "react";
// import { useLocation, useHistory } from "react-router-dom";
// import { configure } from "mobx";
// import axios from "axios";
// configure({ isolateGlobalState: true });

// //get global authInfo for userId
// const authInfo = JSON.parse(localStorage.getItem("authInfo"));
// const serviceId = sessionStorage.getItem("serviceId");

// function Zoom() {
//   const [zoomCode, setZoomCode] = useState("");
//   const [zoomAccessToken, setZoomAccessToken] = useState("");
//   const [zoomRefreshToken, setZoomRefreshToken] = useState("");
//   const [createMeeting, setCreateMeeting] = useState({
//     topic: "meeting",
//     start_time: "",
//     agenda: "meeting",
//   });
//   const location = useLocation();
//   const history = useHistory();

//   useEffect(() => {
//     const urlParams = new URLSearchParams(location.search);
//     const code = urlParams.get("code");
//     if (code) {
//       setZoomCode(code);
//       genrateZoomToken(code);
//     }

//     const token = localStorage.getItem("zoomaccesstoken");
//     if (token) {
//       setCreateMeeting((prevState) => ({
//         ...prevState,
//         zoomaccesstoken: token,
//       }));
//     }
//   }, [location.search]);

//   //generate zoom access token
//   async function genrateZoomToken(data) {
//     const code = data;
//     try {
//       await axios
//         .get(`/user/zoomAccessToken/${code}`, {
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json;charset=UTF-8",
//             Authorization: `Bearer ${authInfo.token}`,
//           },
//         })
//         .then((response) => {
//           const data = response.data;
//           const zoomrefreshtoken = response.data.data.refresh_token;
//           const zoomaccesstoken = response.data.data.access_token;
//           setZoomAccessToken(zoomaccesstoken);
//           setZoomRefreshToken(zoomrefreshtoken);
//           zooomRefreshToken(zoomrefreshtoken);
//         })
//         .catch((error) => {
//           console.log("error", error);
//         });
//     } catch (error) {
//       console.log("error", error);
//     }
//   }

//   //Get Refresh token
//   const zooomRefreshToken = async (refreshToken) => {
//     const refresh_token = refreshToken;
//     try {
//       await axios
//         .get("/user/zoomRefreshToken", {
//           params: {
//             refresh_token: refresh_token,
//           },
//         })
//         .then((response) => {
//           const zoomaccesstoken = response.data.data.access_token;
//           const zoomrefreshtoken = response.data.data.refresh_token;

//           setZoomAccessToken(zoomaccesstoken);
//           setZoomRefreshToken(zoomrefreshtoken);
//           createZoomMeeting(zoomaccesstoken);
//         })
//         .catch((error) => {
//           console.log("Error", error);
//         });
//     } catch (error) {
//       console.log("Error", error);
//     }
//   };

//   //Create Zoom Meeting
//   async function createZoomMeeting(accessToken) {
//     // e.preventDefault();
//     const currentDateTime = new Date();
//     // Current Date
//     const currentDate = currentDateTime.toISOString().split("T")[0];
//     // Current Time
//     let currentHours = currentDateTime.getHours();
//     let currentMinutes = currentDateTime.getMinutes();
//     // Pad single digit hours and minutes with leading zeros
//     currentHours = currentHours < 10 ? "0" + currentHours : currentHours;
//     currentMinutes =
//       currentMinutes < 10 ? "0" + currentMinutes : currentMinutes;
//     const currentTime = `${currentHours}:${currentMinutes}`;

//     const requestData = {
//       ...createMeeting,
//       start_time: combineDateTime(currentDate, currentTime),
//       zoomaccesstoken: accessToken,
//     };

//     const headers = {
//       Accept: "application/json",
//       "Content-Type": "application/json;charset=UTF-8",
//       Authorization: `Bearer ${authInfo.token}`,
//     };

//     try {
//       await axios
//         .post("/user/createZoomMeeting", requestData, { headers })
//         .then((response) => {
//           const meetingData = response.data.data;
//           const join_url = meetingData.join_url;
//           localStorage.setItem("ZoomMeetingUrl", join_url);
//           saveNotification(join_url);
//           getNotification();
//           window.open(meetingData.join_url, "_blank");
//           history.push("/");
//         })
//         .catch((error) => {
//           console.log("Error", error);
//         });
//     } catch (error) {
//       console.log("Error", error);
//     }
//   }

//   const combineDateTime = (date, time) => {
//     return `${date}T${time}:00`;
//   };

//   //save Notification
//   const saveNotification = async (join_url) => {
//     try {
//       const requestData = {
//         userId: authInfo.id,
//         serviceId: serviceId,
//         message: `${join_url}`,
//       };
//       await axios
//         .post(`/user/add-notification`, requestData, {
//           headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json;charset=UTF-8",
//             Authorization: `Bearer ${authInfo.token}`,
//           },
//         })
//         .then((response) => {
//           const data = response.data.data;
//         })
//         .catch((error) => {
//           console.log("Error", error);
//         });
//     } catch (error) {
//       console.log("Error", error);
//     }
//   };

//   //get Notification
//   const getNotification = async () => {
//     const userId = authInfo.id;
//     try {
//       const response = await axios.get(`/user/get-notification/${userId}`, {
//         headers: {
//           Authorization: `Bearer ${authInfo.token}`,
//         },
//       });
//       const data = response.data.length;
//       console.log("get Notification response.data.data", response.data.data);
//       console.log("get Notification response.data", response.data);
//       console.log("get Notification response", response);
//     } catch (error) {
//       console.log("Error", error);
//     }
//   };

//   return <React.Fragment></React.Fragment>;
// }

// export default Zoom;

//****************************back-up main code*************************************** */

import React, { useEffect, useState } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { configure } from "mobx";
import axios from "axios";
configure({ isolateGlobalState: true });

//get global authInfo for userId
const authInfo = JSON.parse(localStorage.getItem("authInfo"));
const serviceId = sessionStorage.getItem("serviceId");

function Zoom() {
  const [zoomCode, setZoomCode] = useState("");
  const [zoomAccessToken, setZoomAccessToken] = useState("");
  const [zoomRefreshToken, setZoomRefreshToken] = useState("");
  const [createMeeting, setCreateMeeting] = useState({
    topic: "meeting",
    start_time: "",
    agenda: "meeting",
  });
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const code = urlParams.get("code");
    if (code) {
      setZoomCode(code);
      genrateZoomToken(code);
    }

    const token = localStorage.getItem("zoomaccesstoken");
    if (token) {
      setCreateMeeting((prevState) => ({
        ...prevState,
        zoomaccesstoken: token,
      }));
    }
  }, [location.search]);

  //generate zoom access token
  async function genrateZoomToken(data) {
    const code = data;
    try {
      await axios
        .get(`/user/zoomAccessToken/${code}`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: `Bearer ${authInfo.token}`,
          },
        })
        .then((response) => {
          const data = response.data;
          const zoomrefreshtoken = response.data.data.refresh_token;
          const zoomaccesstoken = response.data.data.access_token;
          setZoomAccessToken(zoomaccesstoken);
          setZoomRefreshToken(zoomrefreshtoken);
          zooomRefreshToken(zoomrefreshtoken);
        })
        .catch((error) => {
          console.log("error", error);
        });
    } catch (error) {
      console.log("error", error);
    }
  }

  //Get Refresh token
  const zooomRefreshToken = async (refreshToken) => {
    const refresh_token = refreshToken;
    try {
      await axios
        .get("/user/zoomRefreshToken", {
          params: {
            refresh_token: refresh_token,
          },
        })
        .then((response) => {
          const zoomaccesstoken = response.data.data.access_token;
          const zoomrefreshtoken = response.data.data.refresh_token;

          setZoomAccessToken(zoomaccesstoken);
          setZoomRefreshToken(zoomrefreshtoken);
          createZoomMeeting(zoomaccesstoken);
        })
        .catch((error) => {
          console.log("Error", error);
        });
    } catch (error) {
      console.log("Error", error);
    }
  };

  //Create Zoom Meeting
  async function createZoomMeeting(accessToken) {
    // e.preventDefault();
    const currentDateTime = new Date();
    // Current Date
    const currentDate = currentDateTime.toISOString().split("T")[0];
    // Current Time
    let currentHours = currentDateTime.getHours();
    let currentMinutes = currentDateTime.getMinutes();
    // Pad single digit hours and minutes with leading zeros
    currentHours = currentHours < 10 ? "0" + currentHours : currentHours;
    currentMinutes =
      currentMinutes < 10 ? "0" + currentMinutes : currentMinutes;
    const currentTime = `${currentHours}:${currentMinutes}`;

    const requestData = {
      ...createMeeting,
      start_time: combineDateTime(currentDate, currentTime),
      zoomaccesstoken: accessToken,
    };

    const headers = {
      Accept: "application/json",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: `Bearer ${authInfo.token}`,
    };

    try {
      await axios
        .post("/user/createZoomMeeting", requestData, { headers })
        .then((response) => {
          const meetingData = response.data.data;
          const join_url = meetingData.join_url;
          localStorage.setItem("ZoomMeetingUrl", join_url);
          saveNotification(join_url);
          getNotification();
          window.open(meetingData.join_url, "_blank");
          history.push("/");
        })
        .catch((error) => {
          console.log("Error", error);
        });
    } catch (error) {
      console.log("Error", error);
    }
  }

  const combineDateTime = (date, time) => {
    return `${date}T${time}:00`;
  };

  //save Notification
  const saveNotification = async (join_url) => {
    try {
      const requestData = {
        userId: authInfo.id,
        serviceId: serviceId,
        message: `${join_url}`,
      };
      await axios
        .post(`/user/add-notification`, requestData, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: `Bearer ${authInfo.token}`,
          },
        })
        .then((response) => {
          const data = response.data.data;
        })
        .catch((error) => {
          console.log("Error", error);
        });
    } catch (error) {
      console.log("Error", error);
    }
  };

  //get Notification
  const getNotification = async () => {
    const userId = authInfo.id;
    try {
      const response = await axios.get(`/user/get-notification/${userId}`, {
        headers: {
          Authorization: `Bearer ${authInfo.token}`,
        },
      });
      const data = response.data.length;
      console.log("get Notification response.data.data", response.data.data);
      console.log("get Notification response.data", response.data);
      console.log("get Notification response", response);
    } catch (error) {
      console.log("Error", error);
    }
  };

  return <React.Fragment></React.Fragment>;
}

export default Zoom;
