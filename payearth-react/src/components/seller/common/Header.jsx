import React, { useState, useEffect } from "react";
import { Link, useHistory} from "react-router-dom";
import logo from "./../../../assets/images/logo.png";
import closeIcon from "./../../../assets/icons/close_icon.svg";
import shoppingBagIcon from "./../../../assets/icons/shopping-bag.svg";
import creditCardIcon from "./../../../assets/icons/credit-card.svg";
import logoutIcon from "./../../../assets/icons/logout.svg";
import smChatIcon from "./../../../assets/icons/sm_chat.svg";
import userImg from '../../../assets/images/user.png'
import communityIcon from "./../../../assets/icons/sm_community.svg";
import contactIcon from "./../../../assets/icons/sm_contact.svg";
import smLogoutIcon from "./../../../assets/icons/sm_logout.svg";
import smhomeIcon from "./../../../assets/icons/sm_home.svg";
import bannerIcon from "./../../../assets/icons/banners_icon.svg";
import blcakbellIcon from "../../../assets/icons/notification-black-bell-icon.svg";
import bellIcon from "../../../assets/icons/notification-bell.svg";
import { useSelector, useDispatch } from "react-redux";
import {
  setLoginStatus,
  setUserInfo,
} from "./../../../store/reducers/auth-reducer";
import { authVerification } from "../../../helpers/auth-verification";
import Notifications from "./../../../containers/user/Notifications";
import {
  setCatSearchValue,
  setIsService,
} from "../../../store/reducers/cat-search-reducer";
// import io from 'socket.io-client'
// import axios from 'axios';

const Header = () => {
  // const socket = io.connect(process.env.REACT_APP_SOCKET_SERVER_URL);
  const userInfo = useSelector(state => state.auth.userInfo);
  const authInfo = useSelector(state => state.auth.authInfo);
  const [isToggle, setIsToggle] = useState(false);
  const isService = useSelector((state) => state.catSearch.isService);
  const history = useHistory();
  const dispatch = useDispatch();
  // // const { notifications } = useContext(NotificationContext);
  // const [unreadCount, setUnreadCount] = useState(0);
  const logout = () => {
    localStorage.clear();
    dispatch(setLoginStatus({ isLoggedIn: false }));
    dispatch(setUserInfo({ userInfo: [] }));

    dispatch(setIsService({ isService: 0 }));
    setIsToggle(false);

    //window.location.href = "/seller/login";
    history.push('/seller/login');
  };

  useEffect(() => {
    authVerification(dispatch);
  }, [dispatch]);

  // useEffect(() => {
  //   // Join the specific user room
  //   socket.emit('join_room', authInfo.id);

  //   // Fetch initial unread count
  //   const fetchUnreadCount = async () => {
  //     try {
  //       const response = await axios.get(`/api/notifications/unread/${authInfo.id}`);
  //       setUnreadCount(response.data.unreadCount);
  //     } catch (error) {
  //       console.error('Error fetching unread notifications:', error);
  //     }
  //   };

  //   fetchUnreadCount();

  //   // Listen for new notifications in real-time
  //   socket.on('new_notification', (notification) => {
  //     setUnreadCount((prevCount) => prevCount + 1);
  //     // Optionally display a toast or alert for the new notification
  //     console.log('New Notification:', notification.message);
  //   });

  //   // Cleanup the socket when the component unmounts
  //   return () => {
  //     socket.off('new_notification');
  //   };
  // }, [authInfo.id]);

  const removeBackdrop = () => {
    const elements = document.getElementsByClassName("offcanvas-backdrop");
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
    document.body.style.overflow = "unset";
    document.body.style.padding = 0;
  };

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
            <img src={closeIcon} className="img-fluid" alt="" /> Close
          </button>
        </div>
        <div className="offcanvas-body">
          <div className="side_menu_body">
            <ul className="side_menu_links">
              <li>
                <Link to="/seller/dashboard" onClick={() => removeBackdrop()}>
                  <i className="icon">
                    <img src={smhomeIcon} alt="" />
                  </i>
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/seller/notifications" onClick={() => removeBackdrop()}>
                  <i className="icon">
                    <img src={bellIcon} alt="" />
                  </i>
                  Notifications
                </Link>
              </li>
              <li>
                <Link
                  to="/seller/manage-banner-list"
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
                  to="/seller/listed-items"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={shoppingBagIcon} alt="" />
                  </i>{" "}
                  Listed Products
                </Link>
              </li>
              <li>
                <Link
                  to="/seller/product-stock-management"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={shoppingBagIcon} alt="" />
                  </i>{" "}
                  Product Management
                </Link>
              </li>
              <li>
                <Link
                  to="/seller/service-stock-management"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={shoppingBagIcon} alt="" />
                  </i>{" "}
                  Service Management
                </Link>
              </li>
              <li>
                <Link
                  to="/seller/product-orders"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={shoppingBagIcon} alt="" />
                  </i>{" "}
                  Product Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/seller/service-orders"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={shoppingBagIcon} alt="" />
                  </i>{" "}
                  Service Orders
                </Link>
              </li>
              <li>
                <Link
                  to="/seller/manage-subscription-plan"
                  onClick={() => removeBackdrop()}
                >
                  <i className="icon">
                    <img src={shoppingBagIcon} alt="" />
                  </i>{" "}
                  Subscription Plans
                </Link>
              </li>
              <li>
                <Link to="/seller/payments" onClick={() => removeBackdrop()}>
                  <i className="icon">
                    <img src={creditCardIcon} alt="" />
                  </i>{" "}
                  Payments
                </Link>
              </li>
              <li>
                <Link to="#" onClick={() => logout()}>
                  <i className="icon">
                    <img src={logoutIcon} alt="" />
                  </i>{" "}
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
                    <Link className="navbar-brand py-0" to="/">
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
                          {/* <li className="nav-item"><Link to="/seller/add-product" className="btn custom_btn btn_yellow w-auto text-uppercase">add new product</Link></li> */}
                          {/* seller notification bell icon */}
                          <li className="nav-item">
                            <Link className="nav-link" to="/seller/notifications">
                              <div className="sm_icon">
                                <img src={blcakbellIcon} alt="" />
                                {/* {unreadCount > 0 && <span className="notification-count">{unreadCount}</span>} */}
                              </div>
                              <span>Notification</span>
                            </Link>
                          </li>
                          {/*seller notification bell icon */}
                          <li className="nav-item">
                            <Link className="nav-link" to="/seller/chat">
                              <div className="sm_icon">
                                <img src={smChatIcon} alt="" />
                              </div>
                              <span>Chat</span>
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link className="nav-link" to="/seller_community">
                              <div className="sm_icon">
                                <img src={communityIcon} alt="" />
                              </div>
                              <span>Community</span>
                            </Link>
                          </li>
                          <li className="nav-item">
                            <Link className="nav-link" to="/seller/contact">
                              <div className="sm_icon">
                                <img src={contactIcon} alt="" />
                              </div>
                              <span>Contact</span>
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
                          {/* Add user profile */}
                          <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                              <div className="com_user_acc">
                                <div className="com_user_img"><img src={userInfo.imgUrl !== null && userInfo.imgUrl !== '' ? userInfo.imgUrl : userImg} alt="" /></div>
                                <div className="com_user_name">
                                  <div className="cu_name">{userInfo.name}</div>
                                  <div>{userInfo.role}</div>
                                </div>
                              </div>
                            </Link>
                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                              <li><Link className="dropdown-item" to="/Seller-profile">Account</Link></li>
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
};

export default Header;
