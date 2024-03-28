// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import SpinnerLoader from "../../../components/common/SpinnerLoader";

// function Services() {
//   const [userServiceData, setUserServiceData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const res = await axios.get("user/get-common-service");
//       setUserServiceData(res.data.data);
//     } catch (error) {
//       console.error("Error fetching data: ", error);
//     }
//   };

//   return (
//     {loading === true ? <SpinnerLoader /> : ""}
//     <section className="popular_products_sec">
//       <div className="container">
//         <div className="row">
//           <div className="col-sm-10 m-auto">
//             <div className="cards_wrapper">
//               {userServiceData && userServiceData.length > 0 ? (
//                 userServiceData.map((service) => (
//                   <div key={service._id} className="card">
//                     <img src={service.featuredImage} alt={service.name} />
//                     <h2 className="m-auto">{service.name}</h2>
//                     <p
//                       className="m-auto p-2"
//                       dangerouslySetInnerHTML={{ __html: service.description }}
//                     ></p>
//                     {userServiceData && userServiceData.length ? (
//                       <div className="text-center">
//                         <Link
//                           type="button"
//                           className="btn custom_btn btn_yellow"
//                           to={`/service-detail/${service._id}`}
//                         >
//                           View More
//                         </Link>
//                       </div>
//                     )
//                     </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Services;

//****************************************************************************
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Link } from "react-router-dom";
// import SpinnerLoader from "../../../components/common/SpinnerLoader";
// import Banner from "../../../components/user/home/Banner";
// // ./../../components/user/home/Banner

// function Services() {
//   const [userServiceData, setUserServiceData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const fetchData = async () => {
//     try {
//       const res = await axios.get("user/get-common-service");
//       setUserServiceData(res.data.data);
//       setLoading(false); // Set loading to false when data is fetched
//     } catch (error) {
//       console.error("Error fetching data: ", error);
//       setLoading(false); // Set loading to false even if there's an error
//     }
//   };

//   return (
//     <React.Fragment>
//       {loading ? (
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "100vh",
//             position: "fixed",
//             top: "0",
//             left: "0",
//             width: "100%",
//             background: "rgba(255, 255, 255, 0.8)", // semi-transparent background
//             zIndex: "9999", // higher z-index to appear on top
//           }}
//           key="spinner"
//         >
//           <SpinnerLoader />
//         </div>
//       ) : (
//         <section className="popular_products_sec">

//           <div className="container">
//             <div className="row">
//               <div className="col-sm-10 m-auto">
//                 <div className="cards_wrapper">
//                   {userServiceData.length > 0 &&
//                     userServiceData.map((service) => (
//                       <div key={service._id} className="card">
//                         <img src={service.featuredImage} alt={service.name} />
//                         <h2 className="m-auto">{service.name}</h2>
//                         <p
//                           className="m-auto p-2"
//                           dangerouslySetInnerHTML={{
//                             __html: service.description,
//                           }}
//                         ></p>
//                         <div className="text-center">
//                           <Link
//                             type="button"
//                             className="btn custom_btn btn_yellow"
//                             to={`/service-detail/${service._id}`}
//                           >
//                             View More
//                           </Link>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>
//       )}
//     </React.Fragment>
//   );
// }

// export default Services;

//**********************************************************

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SpinnerLoader from "../../../components/common/SpinnerLoader";
import Banner from "../../../components/user/home/Banner";
import SuperRewardsSec from "../../../components/user/home/SuperRewardsSec";
import PopularBrands from "../../../components/user/home/PopularBrands";

function Services() {
  const [userServiceData, setUserServiceData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("user/get-common-service");
      setUserServiceData(res.data.data);
      setLoading(false); // Set loading to false when data is fetched
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false); // Set loading to false even if there's an error
    }
  };

  return (
    <React.Fragment>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            background: "rgba(255, 255, 255, 0.8)", // semi-transparent background
            zIndex: "9999", // higher z-index to appear on top
          }}
          key="spinner"
        >
          <SpinnerLoader />
        </div>
      ) : (
        <React.Fragment>
          <Banner />
          <section className="popular_products_sec">
            <div className="container">
              <div className="row">
                <div className="col-sm-10 m-auto">
                  <div className="cards_wrapper">
                    {userServiceData.length > 0 &&
                      userServiceData.map((service) => (
                        <div key={service._id} className="card">
                          <img src={service.featuredImage} alt={service.name} />
                          <h2 className="m-auto">{service.name}</h2>
                          <p
                            className="m-auto p-2"
                            dangerouslySetInnerHTML={{
                              __html: service.description,
                            }}
                          ></p>
                          <div className="text-center">
                            <Link
                              type="button"
                              className="btn custom_btn btn_yellow"
                              to={`/service-detail/${service._id}`}
                            >
                              View More
                            </Link>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <SuperRewardsSec />
          <PopularBrands />
        </React.Fragment>
      )}
    </React.Fragment>
  );
}

export default Services;
