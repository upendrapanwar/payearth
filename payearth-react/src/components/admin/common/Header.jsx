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
      console.log("offlineNotifications", offlineNotifications)
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
            <img src={clostBtn} className="img-fluid" alt="" loading="lazy" decoding="async" /> Close
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="side_menu_body">
            <ul className="side_menu_links">
              <li>
                <Link to="/admin/dashboard" onClick={() => removeBackdrop()}>
                  <i className="icon">
                    <img src={homeIcon} alt="" loading="lazy" decoding="async" />
                  </i>{" "}
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/manage-posts" onClick={() => removeBackdrop()}>
                  <i className="icon">
                    <img src={shoppingBagIcon} alt="" loading="lazy" decoding="async" />
                  </i>{" "}
                  Manage Posts
                </Link>
              </li>

              <li>
                <Link to="/admin/product-orders" onClick={() => removeBackdrop()}>
                  <i className="icon">
                    <img src={shoppingBagIcon} alt="" loading="lazy" decoding="async" />
                  </i>{" "}
                  Product Orders
                </Link>
              </li>
              <li>
                <Link to="/admin/service-orders" onClick={() => removeBackdrop()}>
                  <i className="icon">
                    <img src={shoppingBagIcon} alt="" loading="lazy" decoding="async" />
                  </i>{" "}
                  Service Orders
                </Link>
              </li>

              <li className="nav-item dropdown">
                <Link
                  to="#"
                  className="nav-link dropdown-toggle"
                  id="categoryDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="icon">
                    <img src={shoppingBagIcon} alt="" loading="lazy" decoding="async" />
                  </i>{" "}
                  Manage Categories
                </Link>

                <ul className="dropdown-menu" aria-labelledby="categoryDropdown">
                  {/* Products Category */}
                  <li>
                    <Link to="/admin/manage-product-categories" className="dropdown-item">
                      Products Category
                    </Link>
                  </li>

                  {/* Service Category */}
                  <li>
                    <Link to="/admin/manage-service-categories" className="dropdown-item">
                      Service Category
                    </Link>
                  </li>

                  <li>
                    <Link to="/admin/manage-blog-Categories" className="dropdown-item">
                      Blog Category
                    </Link>
                  </li>

                </ul>
              </li>


              {/* <li>
                <Link to="/admin/payments" onClick={() => removeBackdrop()}>
                  <i className="icon">
                    <img src={creditCardIcon} alt="" />
                  </i>{" "}
                  Manage Payments
                </Link>
              </li> */}
              <li>
                <Link to="/admin/chat" onClick={() => removeBackdrop()}>
                  <i className="icon">
                    <img src={chatIcon} alt="" loading="lazy" decoding="async" />
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
                    <img src={productIcon} alt="" loading="lazy" decoding="async" />
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
                    <img src={serviceIcon} alt="" loading="lazy" decoding="async" />
                  </i>
                  Manage Services
                </Link>
              </li>
              <li>
                <Link to="/admin/manage-deals" onClick={() => removeBackdrop()}>
                  <i className="icon">
                    <img src={discountIcon} alt="" loading="lazy" decoding="async" />
                  </i>{" "}
                  Manage Deals
                </Link>
              </li>
              <li>
                <Link to="/admin/manage-coupons" onClick={() => removeBackdrop()}>
                  <i className="icon">
                    <img src={discountIcon} alt="" loading="lazy" decoding="async" />
                  </i>{" "}
                  Manage Coupons
                </Link>
              </li>
              <li>
                <Link to="/admin/manage-brands" onClick={() => removeBackdrop()}>
                  <i className="icon">
                    <img src={discountIcon} alt="" loading="lazy" decoding="async" />
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
                    <img src={customersIcon} alt="" loading="lazy" decoding="async" />
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
                    <img src={vendorIcon} alt="" loading="lazy" decoding="async" />
                  </i>{" "}
                  Manage Vendors
                </Link>
              </li>

              {userInfo.role === 'super_admin' && (
                <li>
                  <Link
                    to="/admin/manage-admins"
                    onClick={() => removeBackdrop()}
                  >
                    <i className="icon">
                      <img src={vendorIcon} alt="" loading="lazy" decoding="async" />
                    </i>{" "}
                    Manage Admins
                  </Link>
                </li>
              )}

              <li>
                <Link
                  to="/admin/product-reports"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={reportIcon} alt="" loading="lazy" decoding="async" />
                  </i>{" "}
                  Reports
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/community"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={communityIcon} alt="" loading="lazy" decoding="async" />
                  </i>{" "}
                  Community
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-advertisement"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={bannerIcon} alt="" loading="lazy" decoding="async" />
                  </i>{" "}
                  Manage Advertisements
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-subscription"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={productIcon} alt="" loading="lazy" decoding="async" />
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
                    <img src={supportIcon} alt="" loading="lazy" decoding="async" />
                  </i>
                  Manage Support
                </Link>
              </li>
              {/* /admin/contact_form_users */}
              <li>
                <Link
                  to="/admin/buyers-contact"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={notificationBellIcon} alt="" loading="lazy" decoding="async" />
                  </i>{" "}
                  Contact Buyers
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/notifications"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={notificationBellIcon} alt="" loading="lazy" decoding="async" />
                  </i>{" "}
                  Notifications
                </Link>
              </li>
              <li>
                <Link to="#" onClick={() => logout()}>
                  <i className="icon">
                    <img src={logoutIcon} alt="" loading="lazy" decoding="async" />
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
                      <img src={logo} alt="logo" className="img-fluid h-100" loading="lazy" decoding="async" />
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
                            <Link className="nav-link" to="/admin/notifications" onClick={handleNotificationClick}>
                              <div className="sm_icon">
                                <img src={blackBellIcon} alt="" loading="lazy" decoding="async" />
                                {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>}
                              </div>
                              <span>Notifications</span>
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link className="nav-link" to="/admin/chat">
                              <div className="sm_icon">
                                <img src={smChatIcon} alt="" loading="lazy" decoding="async" />
                              </div>
                              <span>Chat</span>
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link
                              className="nav-link"
                              to="/admin/community"
                            >
                              <div className="sm_icon">
                                <img src={smcommunityIcon} alt="" loading="lazy" decoding="async" />
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
                                <img src={supports_Icon} alt="" loading="lazy" decoding="async" />
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
                                <img src={smLogoutIcon} alt="" loading="lazy" decoding="async" />
                              </div>
                              <span>Logout</span>
                            </Link>
                          </li>
                          {/* Add admin acount */}
                          <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                              <div className="com_user_acc">
                                <div className="com_user_img"><img src={userInfo.imgUrl && userInfo.imgUrl.trim() !== '' ? userInfo.imgUrl : userImg} alt="" loading="lazy" decoding="async" /></div>
                                <div className="com_user_name">
                                  <div className="cu_name">{userInfo.name}</div>
                                  <div>{userInfo.role}</div>
                                </div>
                              </div>
                            </Link>
                            <ul className="dropdown-menu dropdown-menu-end mt-5" aria-labelledby="navbarDropdown">
                              <li><Link className="dropdown-item" to="/admin/my-profile">My Profile</Link></li>
                              <li><hr className="dropdown-divider" /></li>
                              <li><Link className="dropdown-item" to="/admin/account">Account</Link></li>
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
