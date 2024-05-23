// import React, { useEffect, useState } from "react";
// import Header from "../../components/user/common/Header";
// import PageTitle from "../../components/user/common/PageTitle";
// import Footer from "../../components/common/Footer";
// import axios from "axios";
// import SpinnerLoader from "../../components/common/SpinnerLoader";

// const Notifications = () => {
//   const [notification, setNotification] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(4);
//   const [read, setRead] = useState(false);
//   const [updatedId, setUpdatedId] = useState(null);

//   const authInfo = JSON.parse(localStorage.getItem("authInfo"));

//   useEffect(() => {
//     fetchNotification(authInfo.id, authInfo.token);
//     if (updatedId !== null) {
//       updateReadStatus(updatedId);
//       setUpdatedId(null);
//     }
//   }, [updatedId]);

//   const fetchNotification = async (userId, token) => {
//     try {
//       await axios
//         .get(`/user/get-notification/${userId}`, {
//           headers: {
//             "content-type": "application/json",
//             "Access-Control-Allow-Origin": "*",
//             Authorization: `Bearer ${token}`,
//           },
//         })
//         .then((response) => {
//           const data = response.data.data;
//           setNotification(data);
//           setRead(data.some((item) => item.read === false));
//         })
//         .catch((error) => {
//           console.log("Error", error);
//         })
//         .finally(() => {
//           setLoading(false);
//         });
//     } catch (error) {
//       console.log("Error", error);
//       setLoading(false);
//     }
//   };

//   const updateReadStatus = async (id) => {
//     if (!id) return;
//     try {
//       const { data } = await axios.patch(
//         `/user/update-notification/${id}`,
//         { read: true },
//         {
//           headers: {
//             "content-type": "application/json",
//             Authorization: `Bearer ${authInfo.token}`,
//           },
//         }
//       );
//       if (!data) {
//         throw new Error("No data received");
//       }
//       setRead(data.read);
//       fetchNotification(authInfo.id, authInfo.token);
//     } catch (error) {
//       console.log("Error updating read status:", error);
//     }
//   };

//   const handleRowClick = (id) => {
//     setUpdatedId(id);
//     updateReadStatus(updatedId);
//   };

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentNotifications = notification.slice(
//     indexOfFirstItem,
//     indexOfLastItem
//   );

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const nextPage = () => {
//     setCurrentPage((prevPage) => prevPage + 1);
//   };

//   const prevPage = () => {
//     setCurrentPage((prevPage) => prevPage - 1);
//   };

//   return (
//     <>
//       <Header readStatus={read} />
//       <PageTitle title="Notifications" />
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
//             background: "rgba(255, 255, 255, 0.8)",
//             zIndex: "9999",
//           }}
//         >
//           <SpinnerLoader />
//         </div>
//       ) : (
//         <>
//           <section className="inr_wrap">
//             <div className="container">
//               <div className="row">
//                 <div className="col-md-12">
//                   <div className="cart wishlist">
//                     <div className="cart_wrap">
//                       <div className="items_incart">
//                         {/* <span>8 Payments done</span> */}
//                       </div>
//                     </div>
//                     <div className="cart_list cart_wrap pb-5">
//                       <table className="table table-responsive table-hover pe_table">
//                         <thead>
//                           <tr>
//                             <th scope="col">Posted By</th>
//                             <th scope="col">Date</th>
//                             <th scope="col">Time</th>
//                             {/* <th scope="col" className="invisible">
//                               Action
//                             </th> */}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {Array.isArray(currentNotifications) &&
//                           currentNotifications.length > 0 ? (
//                             currentNotifications.map((notifi, index) => (
//                               <tr
//                                 key={index}
//                                 onClick={() => handleRowClick(notifi.id)}
//                                 className={notifi.read ? "" : "active"}
//                               >
//                                 <td>
//                                   {/* <div className="noti active"> */}
//                                   <div
//                                     className={`noti ${
//                                       notifi.read ? "" : "active"
//                                     }`}
//                                   >
//                                     Zoom Meeting Link : <p>{notifi.message}</p>
//                                   </div>
//                                 </td>
//                                 <td>
//                                   {new Date(
//                                     notifi.createdAt
//                                   ).toLocaleDateString("en-IN")}
//                                 </td>
//                                 <td>
//                                   {new Date(
//                                     notifi.createdAt
//                                   ).toLocaleTimeString("en-IN")}
//                                 </td>
//                                 {/* <td className="text-end">
//                                   <Link
//                                     to="#"
//                                     className="btn custom_btn btn_yellow_bordered"
//                                   >
//                                     View Details
//                                   </Link>
//                                 </td> */}
//                               </tr>
//                             ))
//                           ) : (
//                             <tr>
//                               <td colSpan="3">{""}</td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Pagination controls */}
//           <div className="cart-pagination">
//             {notification.length > itemsPerPage && (
//               <ul className="pagination-wrapper">
//                 <li>
//                   <button onClick={prevPage} disabled={currentPage === 1}>
//                     Prev
//                   </button>
//                 </li>
//                 {Array(Math.ceil(notification.length / itemsPerPage))
//                   .fill()
//                   .map((_, index) => (
//                     <li key={index}>
//                       <button
//                         onClick={() => handlePageChange(index + 1)}
//                         className={currentPage === index + 1 ? "active" : ""}
//                       >
//                         {index + 1}
//                       </button>
//                     </li>
//                   ))}
//                 <li>
//                   <button
//                     onClick={nextPage}
//                     disabled={
//                       currentPage ===
//                       Math.ceil(notification.length / itemsPerPage)
//                     }
//                   >
//                     Next
//                   </button>
//                 </li>
//               </ul>
//             )}
//           </div>
//         </>
//       )}
//       <Footer />
//     </>
//   );
// };

// export default Notifications;

//*************************************************************************** */

// import React, { useEffect, useState } from "react";
// import Header from "../../components/user/common/Header";
// import PageTitle from "../../components/user/common/PageTitle";
// import Footer from "../../components/common/Footer";
// import axios from "axios";
// import SpinnerLoader from "../../components/common/SpinnerLoader";

// const Notifications = () => {
//   const [notification, setNotification] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage] = useState(4);
//   const [read, setRead] = useState(false);
//   const [updatedId, setUpdatedId] = useState(null);
//   const [searchDate, setSearchDate] = useState("");

//   const authInfo = JSON.parse(localStorage.getItem("authInfo"));

//   useEffect(() => {
//     fetchNotification(authInfo.id, authInfo.token);
//     if (updatedId !== null) {
//       updateReadStatus(updatedId);
//       setUpdatedId(null);
//     }
//   }, [updatedId]);

//   const fetchNotification = async (userId, token) => {
//     try {
//       const response = await axios.get(`/user/get-notification/${userId}`, {
//         headers: {
//           "content-type": "application/json",
//           "Access-Control-Allow-Origin": "*",
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       const data = response.data.data;
//       console.log("Fetched notifications:", data);
//       setNotification(data);
//       setRead(data.some((item) => item.read === false));
//       setLoading(false);
//     } catch (error) {
//       console.log("Error fetching notifications:", error);
//       setLoading(false);
//     }
//   };

//   const updateReadStatus = async (id) => {
//     if (!id) return;
//     try {
//       const { data } = await axios.patch(
//         `/user/update-notification/${id}`,
//         { read: true },
//         {
//           headers: {
//             "content-type": "application/json",
//             Authorization: `Bearer ${authInfo.token}`,
//           },
//         }
//       );
//       if (!data) {
//         throw new Error("No data received");
//       }
//       setRead(data.read);
//       fetchNotification(authInfo.id, authInfo.token);
//     } catch (error) {
//       console.log("Error updating read status:", error);
//     }
//   };

//   const handleRowClick = (id) => {
//     setUpdatedId(id);
//     updateReadStatus(id);
//   };

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentNotifications = notification
//     .filter((notifi) =>
//       searchDate
//         ? new Date(notifi.createdAt).toLocaleDateString("en-IN") ===
//           new Date(searchDate).toLocaleDateString("en-IN")
//         : true
//     )
//     .slice(indexOfFirstItem, indexOfLastItem);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   const nextPage = () => {
//     setCurrentPage((prevPage) => prevPage + 1);
//   };

//   const prevPage = () => {
//     setCurrentPage((prevPage) => prevPage - 1);
//   };

//   const handleSearchDateChange = (event) => {
//     setSearchDate(event.target.value);
//     setCurrentPage(1);
//   };

//   return (
//     <>
//       <Header readStatus={read} />
//       <PageTitle title="Notifications" />

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
//             background: "rgba(255, 255, 255, 0.8)",
//             zIndex: "9999",
//           }}
//         >
//           <SpinnerLoader />
//         </div>
//       ) : (
//         <>
//           <section className="inr_wrap">
//             <div className="container">
//               <div className="row"></div>
//               <div className="col-md-12">
//                 <div className="cart wishlist">
//                   <div className="cart_wrap">
//                     <div className="items_incart">
//                       <div className="col-md-4 offset-md-8">
//                         <input
//                           className="form-control"
//                           type="date"
//                           placeholder="Choose Date"
//                           value={searchDate}
//                           onChange={handleSearchDateChange}
//                         />
//                       </div>
//                     </div>
//                     <div className="cart_list cart_wrap pb-5">
//                       <table className="table table-responsive table-hover pe_table">
//                         <thead>
//                           <tr>
//                             <th scope="col">Posted By</th>
//                             <th scope="col">Date</th>
//                             <th scope="col">Time</th>
//                             {/* <th scope="col" className="invisible">
//                               Action
//                             </th> */}
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {Array.isArray(currentNotifications) &&
//                           currentNotifications.length > 0 ? (
//                             currentNotifications.map((notifi, index) => (
//                               <tr
//                                 key={index}
//                                 onClick={() => handleRowClick(notifi.id)}
//                                 className={notifi.read ? "" : "active"}
//                               >
//                                 <td>
//                                   {/* <div className="noti active"> */}
//                                   <div
//                                     className={`noti ${
//                                       notifi.read ? "" : "active"
//                                     }`}
//                                   >
//                                     Zoom Meeting Link : <p>{notifi.message}</p>
//                                   </div>
//                                 </td>
//                                 <td>
//                                   {new Date(
//                                     notifi.createdAt
//                                   ).toLocaleDateString("en-IN")}
//                                 </td>
//                                 <td>
//                                   {new Date(
//                                     notifi.createdAt
//                                   ).toLocaleTimeString("en-IN")}
//                                 </td>
//                                 {/* <td className="text-end">
//                                   <Link
//                                     to="#"
//                                     className="btn custom_btn btn_yellow_bordered"
//                                   >
//                                     View Details
//                                   </Link>
//                                 </td> */}
//                               </tr>
//                             ))
//                           ) : (
//                             <tr>
//                               <td colSpan="3">{""}</td>
//                             </tr>
//                           )}
//                         </tbody>
//                       </table>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>

//           {/* Pagination controls */}
//           <div className="cart-pagination">
//             {notification.length > itemsPerPage && (
//               <ul className="pagination-wrapper">
//                 <li>
//                   <button onClick={prevPage} disabled={currentPage === 1}>
//                     Prev
//                   </button>
//                 </li>
//                 {Array(Math.ceil(notification.length / itemsPerPage))
//                   .fill()
//                   .map((_, index) => (
//                     <li key={index}>
//                       <button
//                         onClick={() => handlePageChange(index + 1)}
//                         className={currentPage === index + 1 ? "active" : ""}
//                       >
//                         {index + 1}
//                       </button>
//                     </li>
//                   ))}
//                 <li>
//                   <button
//                     onClick={nextPage}
//                     disabled={
//                       currentPage ===
//                       Math.ceil(notification.length / itemsPerPage)
//                     }
//                   >
//                     Next
//                   </button>
//                 </li>
//               </ul>
//             )}
//           </div>
//         </>
//       )}
//       <Footer />
//     </>
//   );
// };

// export default Notifications;

//********************************************************************* */
import React, { useEffect, useState } from "react";
import Header from "../../components/user/common/Header";
import PageTitle from "../../components/user/common/PageTitle";
import Footer from "../../components/common/Footer";
import axios from "axios";
import SpinnerLoader from "../../components/common/SpinnerLoader";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";

const Notifications = () => {
  const [notification, setNotification] = useState([]);
  const [loading, setLoading] = useState(true);
  const [itemsPerPage] = useState(4);
  const [read, setRead] = useState(false);
  const [updatedId, setUpdatedId] = useState(null);

  const authInfo = JSON.parse(localStorage.getItem("authInfo"));

  useEffect(() => {
    fetchNotification(authInfo.id, authInfo.token);
    if (updatedId !== null) {
      updateReadStatus(updatedId);
      setUpdatedId(null);
    }
  }, [updatedId]);

  const fetchNotification = async (userId, token) => {
    try {
      await axios
        .get(`/user/get-notification/${userId}`, {
          headers: {
            "content-type": "application/json",
            "Access-Control-Allow-Origin": "*",
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const data = response.data.data;
          setNotification(data);
          setRead(data.some((item) => item.read === false));
        })
        .catch((error) => {
          console.log("Error", error);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.log("Error", error);
      setLoading(false);
    }
  };

  const updateReadStatus = async (id) => {
    if (!id) return;
    try {
      const { data } = await axios.patch(
        `/user/update-notification/${id}`,
        { read: true },
        {
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${authInfo.token}`,
          },
        }
      );
      if (!data) {
        throw new Error("No data received");
      }
      setRead(data.read);
      fetchNotification(authInfo.id, authInfo.token);
    } catch (error) {
      console.log("Error updating read status:", error);
    }
  };

  const handleRowClick = async (id) => {
    setUpdatedId(id);
    await updateReadStatus(updatedId);
  };

  const columns = [
    {
      name: "Notifications",
      selector: (row) => row.message,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => new Date(row.createdAt).toLocaleDateString("en-IN"),
      sortable: true,
    },
    {
      name: "Time",
      selector: (row) => new Date(row.createdAt).toLocaleTimeString("en-IN"),
      sortable: true,
    },
  ];

  return (
    <>
      <Header readStatus={read} />
      <PageTitle title="Notifications" />
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
            background: "rgba(255, 255, 255, 0.8)",
            zIndex: "9999",
          }}
        >
          <SpinnerLoader />
        </div>
      ) : (
        <>
          <section className="inr_wrap">
            <div className="container">
              <div className="row">
                <div className="col-md-12">
                  <div className="cart wishlist">
                    <div className="cart_wrap">
                      <div className="items_incart"></div>
                    </div>
                    <div className="cart_list cart_wrap pb-5">
                      <DataTableExtensions
                        columns={columns}
                        data={notification}
                        export={false}
                        print={false}
                      >
                        <DataTable
                          pagination
                          highlightOnHover
                          noHeader
                          defaultSortField="createdAt"
                          defaultSortAsc={false}
                          paginationPerPage={itemsPerPage}
                          paginationRowsPerPageOptions={[4, 8, 12, 16]}
                        />
                      </DataTableExtensions>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      )}
      <Footer />
    </>
  );
};

export default Notifications;
