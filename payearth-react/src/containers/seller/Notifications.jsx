import React, { useEffect, useState } from "react";
import Header from "../../components/seller/common/Header";
import PageTitle from "../../components/user/common/PageTitle";
import Footer from "../../components/common/Footer";
import axios from "axios";
import SpinnerLoader from "../../components/common/SpinnerLoader";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";

const SellerNotifications = () => {
    const [notification, setNotification] = useState([]);
    // const [loading, setLoading] = useState(true);
    const [itemsPerPage] = useState(4);
    const [read, setRead] = useState(false);
    const [updatedId, setUpdatedId] = useState(null);

    const authInfo = JSON.parse(localStorage.getItem("authInfo"));

    // useEffect(() => {
    //     fetchNotification(authInfo.id, authInfo.token);
    //     if (updatedId !== null) {
    //         updateReadStatus(updatedId);
    //         setUpdatedId(null);
    //     }
    // }, [updatedId]);

    // const fetchNotification = async (userId, token) => {
    //     try {
    //         await axios
    //             .get(`/user/get-notification/${userId}`, {
    //                 headers: {
    //                     "content-type": "application/json",
    //                     "Access-Control-Allow-Origin": "*",
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             })
    //             .then((response) => {
    //                 const data = response.data.data;
    //                 setNotification(data);
    //                 setRead(data.some((item) => item.read === false));
    //             })
    //             .catch((error) => {
    //                 console.log("Error", error);
    //             })
    //             .finally(() => {
    //                 setLoading(false);
    //             });
    //     } catch (error) {
    //         console.log("Error", error);
    //         setLoading(false);
    //     }
    // };

    // const updateReadStatus = async (id) => {
    //     if (!id) return;
    //     try {
    //         const { data } = await axios.patch(
    //             `/user/update-notification/${id}`,
    //             { read: true },
    //             {
    //                 headers: {
    //                     "content-type": "application/json",
    //                     Authorization: `Bearer ${authInfo.token}`,
    //                 },
    //             }
    //         );
    //         if (!data) {
    //             throw new Error("No data received");
    //         }
    //         setRead(data.read);
    //         fetchNotification(authInfo.id, authInfo.token);
    //     } catch (error) {
    //         console.log("Error updating read status:", error);
    //     }
    // };

    // const handleRowClick = async (id) => {
    //     setUpdatedId(id);
    //     await updateReadStatus(updatedId);
    // };

    // const columns = [
    //     {
    //         name: "Notifications",
    //         selector: (row) => row.message,
    //         sortable: true,
    //     },
    //     {
    //         name: "Date",
    //         selector: (row) => new Date(row.createdAt).toLocaleDateString("en-IN"),
    //         sortable: true,
    //     },
    //     {
    //         name: "Time",
    //         selector: (row) => new Date(row.createdAt).toLocaleTimeString("en-IN"),
    //         sortable: true,
    //     },
    // ];

    return (
        <>
            <Header readStatus={read} />
            <PageTitle title=" Seller Notifications" />
            {/* {loading ? (  */}
                {/* <div
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
             </div>*/}
            {/* //  ) : ( 
            //     <> */}
                    <section className="inr_wrap">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="cart wishlist">
                                        <div className="cart_wrap">
                                            <div className="items_incart"></div>
                                        </div>
                                        <div className="cart_list cart_wrap pb-5">
                                            {/* <DataTableExtensions
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
                                            </DataTableExtensions> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                {/* </>
            )}  */}
            <Footer />
        </>
    );
};

export default SellerNotifications;