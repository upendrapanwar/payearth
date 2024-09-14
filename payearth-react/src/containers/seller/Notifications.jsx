import React, { useEffect, useState } from "react";
import Header from "../../components/seller/common/Header";
import PageTitle from "../../components/user/common/PageTitle";
import Footer from "../../components/common/Footer";
import axios from "axios";
import SpinnerLoader from "../../components/common/SpinnerLoader";
import { setLoading } from '../../store/reducers/global-reducer';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

const SellerNotifications = () => {
  const [notification, setNotification] = useState([]);
  console.log('Allnotification---11', notification)
  // const [itemsPerPage] = useState(4);
  const [read, setRead] = useState(false);
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
      <Header readStatus={read} />
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


export default SellerNotifications;