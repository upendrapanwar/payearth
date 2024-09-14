import React, { Component, useEffect, useState } from 'react';
import Header from '../../components/admin/common/Header';
import PageTitle from "../../components/user/common/PageTitle";
import Footer from '../../components/common/Footer';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import store from '../../store/index';
import axios from 'axios';
import addCouponSchema from '../../validation-schemas/addCouponSchema';
import { Link } from 'react-router-dom';
import SpinnerLoader from "../../components/common/SpinnerLoader";
import { useSelector, useDispatch } from 'react-redux';

// class ManageNotifications extends Component {
//     componentDidMount(){
//         document.body.style.overflow = "unset"// Set the style
//     }
//     render() {
//         return (
//             <React.Fragment>
//                 <Header />
//                 <div className="seller_dash_wrap pt-5 pb-5">
//                     <div className="container ">
//                         <div className="bg-white rounded-3 pt-3 pb-5">
//                             <div className="dash_inner_wrap">
//                                 <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center">
//                                     <div className="dash_title">Manage Notifications</div>

//                                 </div>
//                             </div>

//                             <div className="orders_table tab-content pt-0 pb-0" id="nav-tabContent">
//                                 <div className="tab-pane fade show active" id="nav-pending-orders" role="tabpanel" aria-labelledby="nav-pending-orders-tab">
//                                 <table className="table table-responsive table-hover pe_table">
//                                             <thead>
//                                             <tr>
//                                                 <th scope="col">Posted By</th>
//                                                 <th scope="col">Date</th>
//                                                 <th scope="col" className="invisible">Action</th>
//                                             </tr>
//                                             </thead>
//                                             <tbody>
//                                                 <tr>
//                                                     <td>
//                                                         <div className="noti active">Steven posted a minute ago check what he has posted</div>
//                                                     </td>
//                                                     <td>06-01-2021</td>
//                                                     <td className="text-end"><Link to="#" className="btn custom_btn btn_yellow_bordered">View Details</Link></td>
//                                                 </tr>
//                                                 <tr>
//                                                     <td>
//                                                         <div className="noti active">Emma posted a 30 minute ago check what he has posted</div>
//                                                     </td>
//                                                     <td>06-01-2021</td>
//                                                     <td className="text-end"><Link to="#" className="btn custom_btn btn_yellow_bordered">Download</Link></td>
//                                                 </tr>
//                                                 <tr>
//                                                     <td>
//                                                         <div className="noti">Steven posted one days ago check what he has posted</div>
//                                                     </td>
//                                                     <td>06-01-2021</td>
//                                                     <td className="text-end"><Link to="#" className="btn custom_btn btn_yellow_bordered">Download</Link></td>
//                                                 </tr>
//                                                 <tr>
//                                                     <td>
//                                                         <div className="noti">Steven posted one days ago check what he has posted</div>
//                                                     </td>
//                                                     <td>06-01-2021</td>
//                                                     <td className="text-end"><Link to="#" className="btn custom_btn btn_yellow_bordered">Download</Link></td>
//                                                 </tr>
//                                                 <tr>
//                                                     <td>
//                                                         <div className="noti">Steven posted one days ago check what he has posted</div>
//                                                     </td>
//                                                     <td>06-01-2021</td>
//                                                     <td className="text-end"><Link to="#" className="btn custom_btn btn_yellow_bordered">Download</Link></td>
//                                                 </tr>
//                                             </tbody>
//                                         </table>
//                                 </div>


//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <Footer />
//             </React.Fragment>
//         );
//     }
// }

// export default ManageNotifications;


const ManageNotifications = () => {
    const [notification, setNotification] = useState([]);
    console.log('Allnotification---11', notification)
    // const [itemsPerPage] = useState(4);
    //const [read, setRead] = useState(false);
    // const [updatedId, setUpdatedId] = useState(null);
    const authInfo = JSON.parse(localStorage.getItem("authInfo"));
    const loading = useSelector(state => state.global.loading);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchNotification(authInfo.id);
    }, []
    );

    const fetchNotification = async (userId) => {
        try {
            dispatch(setLoading({ loading: true }));
            await axios
                // .get(`/user/get-notification/${userId}`)
                .get(`front/notifications/${userId}`)
                .then((response) => {
                    const data = response.data.data;
                    setNotification(data);
                })
                .catch((error) => {
                    console.log("Error", error);
                })
                .finally(() => {
                    dispatch(setLoading({ loading: false }));
                });
        } catch (error) {
            console.log("Error", error);
            dispatch(setLoading({ loading: false }));
        }
    };

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

    // const { loading } = store.getState().global;
    return (
        <>
            {loading === true ? <SpinnerLoader /> : ''}
            {/* <Header readStatus={read} /> */}
            <Header />
            <PageTitle title=" Seller Notifications" />
            <section className="inr_wrap">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            {Array.isArray(notification) && notification.length > 0 ? (
                                notification.map((notifications, index) => (
                                    <div key={index} className="card border border-2 border-info-subtle mb-1 mt-1">
                                        <div className="card-header  text-primary">
                                            {notifications.type || "not available"}
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title">{notifications.sender.id?.name || "Special title not define"}</h5>
                                            <p className="card-text">
                                                {notifications.message || " No message."}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="alert alert-info" role="alert">
                                    Notification not available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};


export default ManageNotifications;