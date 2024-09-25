import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/user/common/Header";
import PageTitle from "../../components/user/common/PageTitle";
import Footer from "../../components/common/Footer";
import axios from "axios";
import SpinnerLoader from "../../components/common/SpinnerLoader";
import { setLoading } from '../../store/reducers/global-reducer';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';


const Notifications = () => {
  const [notification, setNotification] = useState([]);
  console.log('Allnotification---11', notification)
  //const [read, setRead] = useState(false);
  const authInfo = JSON.parse(localStorage.getItem("authInfo"));
  const loading = useSelector(state => state.global.loading);
  const dispatch = useDispatch();

  // const { loading } = store.getState().global;

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

  const updateReadStatus = (notificationId) => {
    axios.put('front/setNotificationSeen', { notificationId }).then(response => {
      const updatedReadStatus = response.data.data;
      //console.log('updatedReadStatus--', updatedReadStatus)
      setNotification(prevState =>
        prevState.map(notification =>
          notification._id === notificationId
            ? { ...notification, isSeen: true }
            : notification
        )
      );
    });
  }

  return (
    <>
      {loading === true ? <SpinnerLoader /> : ''}
      <Header />
      <PageTitle title="Notifications" />

      <section className="inr_wrap">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {Array.isArray(notification) && notification.length > 0 ? (
                notification.map((notifications, index) => (
                  <Link
                    key={index}
                    to={
                      notifications.type === 'comment' || notifications.type === 'like'
                        ? '#'
                        : '#' // for follow or  other types of notifications
                      }
                    onClick={() => updateReadStatus(notifications._id)}
                  > 
                    <div
                      className={`card border border-2 border-info-subtle mb-1 mt-1 ${!notifications.isSeen ? 'bg-info-subtle' : 'bg-light'
                        }`}
                    >
                      <div className="card-header  text-primary">
                        {notifications.type || "not available"}
                      </div>
                      <div className="card-body">
                        {/* <h5 className="card-title">{notifications.sender.id?.name || "Special title not define"}</h5> */}
                        <div className="d-flex justify-content-between">
                          <h5 className="card-title mb-0">
                            {notifications.sender.id?.name || "Special title not defined"}
                          </h5>
                          <small className="text-muted">{new Date(notifications.createdAt).toLocaleString() || "Just now"}</small>
                        </div>
                        <p className="card-text">
                          {notifications.message || " No message."}
                        </p>
                      </div>
                    </div>
                  </Link>
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

export default Notifications;
