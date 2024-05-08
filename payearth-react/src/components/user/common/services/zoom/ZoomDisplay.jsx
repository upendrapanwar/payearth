// // import React, { useEffect, useState } from "react";
// // // import { ZoomMtg } from "@zoom/meetingsdk";
// // import axios from "axios";

// // ZoomMtg.preLoadWasm();
// // ZoomMtg.prepareWebSDK();

// // function ZoomDisplay() {
// //   var sdkKey = "q9IX4wOwTtGoLzA3YhJ0iQ";
// //   var meetingNumber = "81716243917";
// //   var passWord = "mm6k0m";
// //   var userName = "Ashish";
// //   var userEmail = "eynoashish@gmail.com";
// //   var registrantToken = "";
// //   var zakToken = "";
// //   var leaveUrl = "http://localhost:3000";

// //   const getSignature = async () => {
// //     try {
// //       const response = await axios.post("/getSignature");
// //       startMeeting(response.data.signature);
// //     } catch (error) {
// //       console.error(error);
// //     }
// //   };

// //   function startMeeting(signature) {
// //     document.getElementById("zmmtg-root").style.display = "block";

// //     ZoomMtg.init({
// //       leaveUrl: leaveUrl,
// //       patchJsMedia: true,
// //       success: (success) => {
// //         console.log(success);

// //         ZoomMtg.join({
// //           signature: signature,
// //           sdkKey: sdkKey,
// //           meetingNumber: meetingNumber,
// //           passWord: passWord,
// //           userName: userName,
// //           userEmail: userEmail,
// //           tk: registrantToken,
// //           zak: zakToken,
// //           success: (success) => {
// //             console.log(success);
// //           },
// //           error: (error) => {
// //             console.log(error);
// //           },
// //         });
// //       },
// //       error: (error) => {
// //         console.log(error);
// //       },
// //     });
// //   }

// //   return (
// //     <div>
// //       <main>
// //         <h1>Zoom Meeting</h1>
// //         <button onClick={getSignature}>Join Meeting</button>
// //       </main>
// //     </div>
// //   );
// // }

// // export default ZoomDisplay;

// import React from "react";
// import { ZoomMtg } from "@zoom/meetingsdk";
// import { Helmet } from "react-helmet";
// import { axios } from "axios";

// ZoomMtg.preLoadWasm();
// ZoomMtg.prepareWebSDK();

// function ZoomDisplay() {
//   var sdkKey = process.env.REACT_APP_ZOOM_SDKKEY;
//   var meetingNumber = "88587573306";
//   var passWord = "mm6k0m";
//   var userName = "Ashish";
//   var userEmail = "eynoashish@gmail.com";
//   var registrantToken = "";
//   var zakToken = "";
//   var leaveUrl = "http://localhost:3000";

//   const getSignature = async () => {
//     try {
//       await axios
//         .post("/user/getSignature")
//         .then((response) => {
//           const data = response.data;
//           const signature = data.signature;

//           console.log("signature", signature);
//           // startMeeting(signature);
//         })
//         .catch((error) => {
//           console.log("Error", error);
//         });
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   function startMeeting(signature) {
//     document.getElementById("zmmtg-root").style.display = "block";

//     ZoomMtg.init({
//       leaveUrl: leaveUrl,
//       patchJsMedia: true,
//       success: (success) => {
//         console.log(success);

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
//             console.log(error);
//           },
//         });
//       },
//       error: (error) => {
//         console.log(error);
//       },
//     });
//   }

//   return (
//     <React.Fragment>
//       <Helmet>
//         {/* Helmet ka istemaal karein */}
//         <link type="text/css" rel="stylesheet" href="/zoom-bootstrap.css" />
//         <link type="text/css" rel="stylesheet" href="/zoom-react-select.css" />
//       </Helmet>
//       <div>
//         <h1>ZoomDisplay</h1>
//         <main>
//           <button onClick={getSignature}>Join Meeting</button>
//         </main>
//       </div>
//     </React.Fragment>
//   );
// }

// export default ZoomDisplay;
