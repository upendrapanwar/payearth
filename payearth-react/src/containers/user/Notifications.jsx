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
import { Helmet } from 'react-helmet';
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
// import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import arrow_back from '../../assets/icons/arrow-back.svg'

const Notifications = () => {
  const [notification, setNotification] = useState([]);
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
          notification.notification._id === notificationId
            ? { ...notification, isSeen: true }
            : notification
        )
      );
    });
    fetchNotification(authInfo.id)
  }

  const removeNotification = async (id) => {
    try {
      const url = `/user/removeNotification/${id}`;
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
        <Link
          // to={
          //   row.notification.type === 'comment' || row.notification.type === 'like'
          //     ? '#'
          //     : '#'
          // }
          to={
            {
              comment: `/community?postId=${row.notification.postId}`,
              // like: `/seller/account?postId=${row.notification.postId}`,
              like: `/community?postId=${row.notification.postId}`,
              chat: `/chat`,
              follow: '#',
            }[row.notification.type] || '#'
          }
          // onClick={() => updateReadStatus(row.notification._id)}
          // onClick={(e) => {
          //   if (row.notification.preventNavigation) {
          //     e.preventDefault();
          //   }
          //   updateReadStatus(row.notification._id);
          // }}
          onClick={(e) => {
            if (row.notification.type === 'follow') {
              e.preventDefault();
              updateReadStatus(row.notification._id);
            } else {
              updateReadStatus(row.notification._id);
            }
          }}
        >
          <div className={`card border border-2 border-info-subtle mb-2 mt-2 ${!row.notification.isSeen ? 'bg-info-subtle' : 'bg-light'}`} >
            <div className="card-header d-flex justify-content-between align-items-center text-primary">
              <span>{row.notification.type || "not available"}</span>
              {!row.notification.isSeen ? "" : <i className="bi bi-trash fs-3 text-danger"
                // onClick={() => removeNotification(row.notification._id)}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeNotification(row.notification._id);
                }}
              ></i>}
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
        {/* {!row.notification.isSeen ? "" : <i className="bi bi-trash fs-3 text-danger"
          onClick={() => removeNotification(row.notification._id)}
        ></i>} */}
      </>,
      sortable: true,
    },
  ]

  return (
    <>
      {loading === true ? <SpinnerLoader /> : ''}
      <Header />
      <PageTitle title="Notifications" />
      <Helmet><title>{"Notification - Pay Earth"}</title></Helmet>
      <section className="inr_wrap">
        <div className="container">
          <div className="row">
            <div className="col-md-12 d-flex justify-content-between align-items-center">
              <div>
                <span className="text-uppercase">All notifications : {notification.length}</span>
              </div>
              <div className=' m-3'>
                <button
                  type="button"
                  className="btn custum_back_btn btn_yellow mx-auto"
                  onClick={() => window.history.back()}
                >
                  <img src={arrow_back} alt="back" />&nbsp;
                  Back
                </button>
              </div>
            </div>
            <div className="col-md-12">
              {notification.length > 0 ? (
                <div className="notification_wapper col-md-12">
                  {/* <button>Filter</button> */}
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
                    // selectedRows={selectedRows}
                    // onSelectedRowsChange={this.handleRowSelected}
                    // paginationPerPage={this.itemsPerPage}
                    paginationRowsPerPageOptions={[6, 10, 15, 20]}
                  />
                  {/* </DataTableExtensions> */}
                </div>
              ) : (
                <div className=" text-center m-5 p-5 ">
                  <span className="text-uppercase">No notifications available</span>
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
