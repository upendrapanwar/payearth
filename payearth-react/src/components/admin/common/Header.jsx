import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import logo from "./../../../assets/images/logo.png";
import smChatIcon from "./../../../assets/icons/sm_chat.svg";
import smcommunityIcon from "./../../../assets/icons/sm_community.svg";
import supports_Icon from "./../../../assets/icons/supports.svg";
import smLogoutIcon from "./../../../assets/icons/sm_logout.svg";
import homeIcon from "./../../../assets/icons/sm_home.svg";
import userImg from './../../../assets/images/user.png'
import shoppingBagIcon from "./../../../assets/icons/shopping-bag.svg";
import creditCardIcon from "./../../../assets/icons/credit-card.svg";
import notificationBellIcon from "./../../../assets/icons/notification-bell.svg";
import chatIcon from "./../../../assets/icons/chat.svg";
import logoutIcon from "./../../../assets/icons/logout.svg";
import productIcon from "./../../../assets/icons/products_icon.svg";
import serviceIcon from "./../../../assets/icons/services_icon.svg";
import discountIcon from "./../../../assets/icons/discounts_icon.svg";
import customersIcon from "./../../../assets/icons/customers_icon.svg";
import vendorIcon from "./../../../assets/icons/vendors_icon.svg";
import reportIcon from "./../../../assets/icons/reports_icon.svg";
import communityIcon from "./../../../assets/icons/community_icon.svg";
import bannerIcon from "./../../../assets/icons/banners_icon.svg";
import supportIcon from "./../../../assets/icons/support_icon.svg";
import clostBtn from "./../../../assets/icons/close_icon.svg";
import blackBellIcon from "../../../assets/icons/notification-black-bell-icon.svg";
import { useSelector, useDispatch } from "react-redux";
import { setLoginStatus, setUserInfo } from "./../../../store/reducers/auth-reducer";
import io from 'socket.io-client';
import axios from 'axios';

function Header() {
  const userInfo = useSelector(state => state.auth.userInfo);
  const authInfo = useSelector(state => state.auth.authInfo);
  const history = useHistory();
  const dispatch = useDispatch();
  const [unreadCount, setUnreadCount] = useState(0);

  const logout = () => {
    dispatch(setLoginStatus({ isLoggedIn: false }));
    localStorage.clear();
    dispatch(setUserInfo({ userInfo: [] }));
    window.location.href = "/admin/login";
  };

  const getAdminProfile = async () => {
    try {
      const response = await axios.get(`admin/my-profile/${authInfo.id}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${authInfo.token}`
        }
      });

      if (response.data.status === true) {
        const adminInfo = response.data.data;

        if (adminInfo.image_url && adminInfo.image_url !== '') {
          const userInfo = {
            name: adminInfo.name,
            email: adminInfo.email,
            role: adminInfo.role,
            imgUrl: adminInfo.image_url,
          }
          dispatch(setUserInfo({ userInfo }));
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
        }
      }
    } catch (error) {
      console.error()
    }
  };


  useEffect(() => {
    getAdminProfile();
    const socket = io.connect(process.env.REACT_APP_SOCKET_SERVER_URL);

    if (authInfo && authInfo.id) {
      socket.emit('allNotifications', { userID: authInfo.id });

      axios.get(`front/notifications/${authInfo.id}`).then(response => {
        const responseData = response.data.data
        if (responseData > 0) {
          const offlineNotifications = responseData.filter(notification => !notification.notification.isRead);
          if (offlineNotifications && offlineNotifications.length > 0) {
            offlineNotifications.forEach(notification => {
              setUnreadCount((prevCount) => prevCount + 1);
            });
          }
        }
      });
    }

    socket.on('receive_notification', (notification) => {
      if (!notification || !notification.message) {
        console.error('Received invalid notification data:', notification);
        return;
      }

      setUnreadCount((prevCount) => prevCount + 1);
    });

    return () => {
      socket.off('receive_notification');
      socket.disconnect();
    };
  }, [authInfo.id]);

  const removeBackdrop = () => {
    const elements = document.getElementsByClassName("offcanvas-backdrop");
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
    document.body.style.overflow = "unset";
    document.body.style.padding = 0;
  };

  const handleNotificationClick = () => {
    axios.put(`front/updateNotifications/${authInfo.id}`).then(response => {
      const offlineNotifications = response.data.data;
    });
    setUnreadCount(0);
  }

  return (
    <React.Fragment>
      <div
        className="offcanvas offcanvas-start side_menu_wrap"
        tabIndex="-1"
        id="sideMenu"
        aria-labelledby="sideMenuLabel"
      >
        <div className="offcanvas-header">
          <button
            type="button"
            className="view_more text-reset"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          >
            <img src={clostBtn} className="img-fluid" alt="" /> Close
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="side_menu_body">
            <ul className="side_menu_links">
              <li>
                <Link to="/admin/dashboard" onClick={() => removeBackdrop()}>
                  <i className="icon">
                    <img src={homeIcon} alt="" />
                  </i>{" "}
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/post-module" onClick={() => removeBackdrop()}>
                  <i className="icon">
                    <img src={shoppingBagIcon} alt="" />
                  </i>{" "}
                  Posts
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/post-module-add-new"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={bannerIcon} alt="" />
                  </i>{" "}
                  Create Post
                </Link>
              </li>

              {/* <li><Link to="/admin/page-module" onClick={() => removeBackdrop()}><i className="icon"><img src={shoppingBagIcon} alt="" /></i> Pages </Link></li>
                            <li><Link to="/admin/page-module-add-new" onClick={() => removeBackdrop()}><i className="icon"><img src={bannerIcon} alt="" /></i> Create Page </Link></li> */}

              <li>
                <Link to="/admin/orders" onClick={() => removeBackdrop()}>
                  <i className="icon">
                    <img src={shoppingBagIcon} alt="" />
                  </i>{" "}
                  Manage Orders
                </Link>
              </li>
              <li>
                <Link to="/admin/manage-categories" onClick={() => removeBackdrop()}>
                  <i className="icon">
                    <img src={shoppingBagIcon} alt="" />
                  </i>{" "}
                  Manage Categories
                </Link>
              </li>
              <li>
                <Link to="/admin/service-order" onClick={() => removeBackdrop()}>
                  <i className="icon">
                    <img src={shoppingBagIcon} alt="" />
                  </i>{" "}
                  Manage Service Orders
                </Link>
              </li>

              <li>
                <Link to="/admin/payments" onClick={() => removeBackdrop()}>
                  <i className="icon">
                    <img src={creditCardIcon} alt="" />
                  </i>{" "}
                  Payments
                </Link>
              </li>
              <li>
                <Link to="/admin/chat" onClick={() => removeBackdrop()}>
                  <i className="icon">
                    <img src={chatIcon} alt="" />
                  </i>{" "}
                  Chats
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-products"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={productIcon} alt="" />
                  </i>{" "}
                  Manage Products
                </Link>
              </li>

              <li>
                <Link
                  to="/admin/manage-services"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={serviceIcon} alt="" />
                  </i>
                  Manage Services
                </Link>
              </li>
              <li>
                <Link to="/admin/coupons" onClick={() => removeBackdrop()}>
                  <i className="icon">
                    <img src={discountIcon} alt="" />
                  </i>{" "}
                  Manage Discounts
                </Link>
              </li>
              <li>
                <Link to="/admin/manage-brands" onClick={() => removeBackdrop()}>
                  <i className="icon">
                    <img src={discountIcon} alt="" />
                  </i>{" "}
                  Manage Brands
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-customers"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={customersIcon} alt="" />
                  </i>{" "}
                  Manage Customers
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-vendors"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={vendorIcon} alt="" />
                  </i>{" "}
                  Manage Vendors
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-reports"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={reportIcon} alt="" />
                  </i>{" "}
                  Reports
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-community"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={communityIcon} alt="" />
                  </i>{" "}
                  Manage Community
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-banner-list"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={bannerIcon} alt="" />
                  </i>{" "}
                  Manage Advertisement
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/admin-manage-subscriptionplan"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={productIcon} alt="" />
                  </i>{" "}
                  Manage Subscription
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-support"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={supportIcon} alt="" />
                  </i>
                  Support
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-notifications"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={notificationBellIcon} alt="" />
                  </i>{" "}
                  Notifications
                </Link>
              </li>
              <li>
                <Link to="#" onClick={() => logout()}>
                  <i className="icon">
                    <img src={logoutIcon} alt="" />
                  </i>
                  Logout
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <header className="header">
        <div className="main_nav seller_dash_nav">
          <div className="container">
            <div className="row">
              <div className="col-sm-12">
                <nav className="navbar navbar-expand-lg py-0">
                  <div className="container-fluid p-0">
                    <div className="side_menu_btn">
                      <button
                        className="btn"
                        type="button"
                        data-bs-toggle="offcanvas"
                        data-bs-target="#sideMenu"
                        aria-controls="sideMenu"
                      >
                        <span className="menu_btn_icon"></span>
                      </button>
                    </div>
                    <Link className="navbar-brand py-0" to="#">
                      <img src={logo} alt="logo" className="img-fluid h-100" />
                    </Link>
                    <button
                      className="navbar-toggler"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#offcanvasNavbar"
                      aria-controls="offcanvasNavbar"
                    >
                      <span className="fa fa-bars"></span>
                    </button>
                    <div
                      className="offcanvas offcanvas-end"
                      tabIndex="-1"
                      id="offcanvasNavbar"
                      aria-labelledby="offcanvasNavbarLabel"
                    >
                      <div className="offcanvas-header">
                        <button
                          type="button"
                          className="btn-close text-reset ms-auto"
                          data-bs-dismiss="offcanvas"
                          aria-label="Close"
                        ></button>
                      </div>
                      <div className="offcanvas-body d-block">
                        <ul className="seller_menu navbar-nav justify-content-end flex-grow-1 pe-0">
                          <li className="nav-item">
                            <Link className="nav-link" to="/admin/manage-notifications" onClick={handleNotificationClick}>
                              <div className="sm_icon">
                                <img src={blackBellIcon} alt="" />
                                {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
                              </div>
                              <span>Notifications</span>
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link className="nav-link" to="/admin/chat">
                              <div className="sm_icon">
                                <img src={smChatIcon} alt="" />
                              </div>
                              <span>Chat</span>
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link
                              className="nav-link"
                              to="/admin/manage-community"
                            >
                              <div className="sm_icon">
                                <img src={smcommunityIcon} alt="" />
                              </div>
                              <span>Community</span>
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link
                              className="nav-link"
                              to="/admin/manage-support"
                            >
                              <div className="sm_icon">
                                <img src={supports_Icon} alt="" />
                              </div>
                              <span>Support</span>
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link
                              className="nav-link"
                              to="#"
                              onClick={() => logout()}
                            >
                              <div className="sm_icon">
                                <img src={smLogoutIcon} alt="" />
                              </div>
                              <span>Logout</span>
                            </Link>
                          </li>
                          {/* Add admin acount */}
                          <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                              <div className="com_user_acc">
                                <div className="com_user_img"><img src={userInfo.imgUrl && userInfo.imgUrl.trim() !== '' ? userInfo.imgUrl : userImg} alt="" /></div>
                                <div className="com_user_name">
                                  <div className="cu_name">{userInfo.name}</div>
                                  <div>{userInfo.role}</div>
                                </div>
                              </div>
                            </Link>
                            <ul className="dropdown-menu dropdown-menu-end mt-5" aria-labelledby="navbarDropdown">
                              <li><Link className="dropdown-item" to="/admin-MyProfile">My Profile</Link></li>
                              <li><hr className="dropdown-divider" /></li>
                              <li><Link className="dropdown-item" to="/admin-profile">Account</Link></li>
                              {/* <li><Link className="dropdown-item" to="#">Setting</Link></li> */}
                              <li><hr className="dropdown-divider" /></li>
                              <li><Link className="dropdown-item" to="#" onClick={() => logout()} >Log Out</Link></li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </header>
    </React.Fragment>
  );
}

export default Header;
