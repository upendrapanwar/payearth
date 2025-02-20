import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "../../components/seller/common/Header";
import PageTitle from "../../components/user/common/PageTitle";
import Footer from "../../components/common/Footer";
import axios from "axios";
import SpinnerLoader from "../../components/common/SpinnerLoader";
import { setLoading } from '../../store/reducers/global-reducer';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
// import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";

const SellerNotifications = () => {
  const [notification, setNotification] = useState([]);
  const [read, setRead] = useState(false);
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
        .get(`front/notifications/${userId}`)
        .then((response) => {
          const data = response.data.data;
          setNotification(data);
          dispatch(setLoading({ loading: false }));
        })
        .catch((error) => {
          console.log("Error", error);
        })
      // .finally(() => {
      //   dispatch(setLoading({ loading: false }));
      // });
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

  const removeNotification = async (id) => {
    try {
      const url = `/seller/removeNotification/${id}`;
      await axios.delete(url, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${authInfo.token}`
        }
      });
      fetchNotification(authInfo.id)
    } catch (error) {
      console.error("Somthing went wrong..", error);
    }
  }

  const notification_column = [
    {
      selector: (row, i) => <>
        {/* <Link
          to={row.notification.type === 'comment' || row.notification.type === 'like'
            ? `/seller-profile?postId=${row.notification.postId}`
            : '#'
          }
          onClick={() => updateReadStatus(row.notification._id)}
        > */}
        <Link
          to={
            {
              comment: `/seller-profile?postId=${row.notification.postId}`,
              like: `/seller-profile?postId=${row.notification.postId}`,
              chat: `/chat?userId=${row.notification.userId}`,
              order: `/order-details?orderId=${row.notification.orderId}`,
            }[row.notification.type] || '#'
          }
          onClick={() => updateReadStatus(row.notification._id)}
        >
          <div className={`card border border-2 border-info-subtle mb-2 mt-2 ${!row.notification.isSeen ? 'bg-info-subtle' : 'bg-light'}`} >
            <div className="card-header d-flex justify-content-between align-items-center text-primary">
              <span>{row.notification.type || "not available"}</span>
            </div>
            <div className="card-body">
              {/* <h5 className="card-title">{notifications.sender.id?.name || "Special title not define"}</h5> */}
              <div className="d-flex justify-content-between">
                <h5 className="card-title mb-0">
                  {row.senderDetails.name || "Special title not defined"}
                </h5>
                <small className="text-muted">{new Date(row.notification.createdAt).toLocaleString() || "Just now"}</small>
              </div>
              <p className="card-text">
                {row.notification.message || " No message."}
              </p>
            </div>
          </div>
        </Link>
        {!row.notification.isSeen ? "" : <i className="bi bi-trash fs-3 text-danger"
          onClick={() => removeNotification(row.notification._id)}
        ></i>}
      </>,
      sortable: true,
    },
  ]
  console.log('notification----', notification)
  return (
    <>
      {loading === true ? <SpinnerLoader /> : ''}
      <Header readStatus={read} />
      <PageTitle title="Notifications" />
      <Helmet><title>{"Notification - Pay Earth"}</title></Helmet>
      <section className="inr_wrap">
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              {/* {Array.isArray(notification) && notification.length > 0 ? (
                notification.map((notifications, index) => (
                  <Link
                    key={index}
                    to={notifications.notification.type === 'comment' || notifications.notification.type === 'like'
                      ? `/seller-profile?postId=${notifications.notification.postId}`
                      : '#' 
                    }
                    onClick={() => updateReadStatus(notifications.notification._id)}
                  >
                    <div className={`card border border-2 border-info-subtle mb-1 mt-1 ${!notifications.notification.isSeen ? 'bg-info-subtle' : 'bg-light'}`} >
                      <div className="card-header d-flex justify-content-between align-items-center text-primary">
                        <span>{notifications.notification.type || "not available"}</span>
                        
                      </div>
                      <div className="card-body">
                        <div className="d-flex justify-content-between">
                          <h5 className="card-title mb-0">
                            {notifications.senderDetails.name || "Special title not defined"}
                          </h5>
                          <small className="text-muted">{new Date(notifications.notification.createdAt).toLocaleString() || "Just now"}</small>
                        </div>
                        <p className="card-text">
                          {notifications.notification.message || " No message."}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="alert alert-info" role="alert">
                  Notification not available
                </div>
              )} */}

              <div className="notification_wapper col-md-12">
                <div className="d-flex justify-content-between align-items-center m-2">
                  <div></div>
                  <button
                    type="button"
                    className="btn custom_btn btn_yellow"
                    onClick={() => window.history.back()}
                  >
                    Back
                  </button>
                </div>
                {/* <DataTableExtensions
                  columns={notification_column}
                  data={notification}
                > */}
                <DataTable
                  columns={notification_column}
                  data={notification}
                  pagination
                  highlightOnHover
                  noHeader
                  defaultSortField="id"
                  defaultSortAsc={false}
                  paginationRowsPerPageOptions={[6, 10, 15, 20]}
                />
                {/* </DataTableExtensions> */}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};


export default SellerNotifications;