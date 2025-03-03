import React, { useState, useEffect } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import config from "./../../../config.json";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
// import { Helmet } from 'react-helmet';
import { setLoginStatus, setUserInfo } from "../../../store/reducers/auth-reducer";
import { setProducts, setReqBody, setTotalProducts, setCategories, setMaxPrice, } from "../../../store/reducers/product-reducer";
import { setServices, setServiceReqBody, setTotalServices, setServiceCategories, setServiceMaxPrice, } from "../../../store/reducers/service-reducer";
import { setCatSearchValue, setIsService, } from "../../../store/reducers/cat-search-reducer";
import { setLoading, setIsLoginModalOpen, } from "../../../store/reducers/global-reducer";
import Select from "react-select";
import readUrl from "../../../helpers/read-product-listing-url";
import { getBrands, getColors } from "../../../helpers/product-listing";
import LoginModal from "../../common/modals/LoginModal";
import RegisterModal from "../../common/modals/RegisterModal";
import ForgotPwdModal from "../../common/modals/ForgotPwdModal";
import ResetPwdModal from "../../common/modals/ResetPwdModal";
import logo from "./../../../assets/images/logo.png";
import closeIcon from "./../../../assets/icons/close_icon.svg";
import shoppingBagIcon from "./../../../assets/icons/shopping-bag.svg";
import payearth_qr_code from "./../../../assets/icons/payearth-qr-code.svg";
import creditCardIcon from "./../../../assets/icons/credit-card.svg";
import notificationBellIcon from "./../../../assets/icons/notification-bell.svg";
import notificationBellWhiteIcon from "./../../../assets/icons/notification-bell-white.svg";
import chatIcon from "./../../../assets/icons/chat.svg";
import couponIcon from "./../../../assets/icons/coupon.svg";
import heartIcon from "./../../../assets/icons/heart.svg";
import logoutIcon from "./../../../assets/icons/logout.svg";
import serviceIcon from "./../../../assets/icons/services_icon.svg";
import { authVerification } from "../../../helpers/auth-verification";
import io from 'socket.io-client';
import { clearCart } from '../../../store/reducers/cart-slice-reducer';
import BarcodeScannerComponent from "react-qr-barcode-scanner";


const Header = ({ props, handleIsToggle, readStatus, sendServiceData, sendProductsData }) => {
  toast.configure();
  const loginStatus = useSelector((state) => state.auth.isLoggedIn);
  const userInfo = useSelector((state) => state.auth.userInfo);
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const productReqBody = useSelector((state) => state.product.reqBody);
  const serviceReqBody = useSelector((state) => state.service.reqBody);
  const productCategories = useSelector((state) => state.product.categories);
  const loginModal = useSelector((state) => state.global.isLoginModalOpen);
  const readUrlResult = readUrl(dispatch, { ...productReqBody }, location, setReqBody, "header");
  const [data, setData] = useState([]);
  const [registerModal, setRegister] = useState(false);
  const [forgotModal, setForgot] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [isToggle, setIsToggle] = useState(false);
  const [notifiLength, setNotifiLength] = useState(null);
  const [showNotifi, setShowNotifi] = useState([]);
  const selectedCategory = useSelector((state) => state.catSearch.selectedCategory);
  const searchInput = useSelector((state) => state.catSearch.searchInput);
  const isService = useSelector((state) => state.catSearch.isService);
  const [catSelectedOption, setCatSelectedOption] = useState(selectedCategory === "" ? [] : selectedCategory);
  const [searchOption, setSearchOption] = useState(searchInput !== "" ? searchInput : readUrlResult.searchInput);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [flag, setFlag] = useState(false);
  const url = location.search;
  var param = false;
  if (url !== null && url !== "") {
    if (/t=([^&]+)/.exec(url) !== null) {
      param = /t=([^&]+)/.exec(url)[1] === "resetpass" ? true : false;
    }
  }
  const [navbarExpanded, setNavbarExpanded] = useState(false);
  const [resetModal, setReset] = useState(param);
  const [unreadCount, setUnreadCount] = useState(0);
  const authInfo = JSON.parse(localStorage.getItem("authInfo"));

  const handleMouseEnter = (index) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  const openmodalHandler = () => {
    setRegister(false);
    setForgot(false);
    setReset(false);
    dispatch(setIsLoginModalOpen({ isLoginModalOpen: true }));
    document.body.style.overflow = "hidden";
  };

  const closemodalHandler = () => {
    dispatch(setIsLoginModalOpen({ isLoginModalOpen: false }));
    document.body.style.overflow = "unset";
  };

  const showregisterHandler = () => {
    dispatch(setIsLoginModalOpen({ isLoginModalOpen: false }));
    setForgot(false);
    setReset(false);
    setRegister(true);
    document.body.style.overflow = "hidden";
  };

  const hideregisterHandler = () => {
    setRegister(false);
    document.body.style.overflow = "unset";
  };

  const showForgotHandler = () => {
    dispatch(setIsLoginModalOpen({ isLoginModalOpen: false }));
    setRegister(false);
    setReset(false);
    setForgot(true);
    document.body.style.overflow = "hidden";
  };

  const hideForgotHandler = () => {
    setForgot(false);
    document.body.style.overflow = "unset";
  };

  const showRestPwdHandler = () => {
    dispatch(setIsLoginModalOpen({ isLoginModalOpen: false }));
    setRegister(false);
    setForgot(false);
    setReset(true);
    document.body.style.overflow = "hidden";
  };

  const hideRestPwdHandler = () => {
    setReset(false);
    document.body.style.overflow = "unset";
  };

  const logout = () => {
    localStorage.clear();
    dispatch(setLoginStatus({ isLoggedIn: false }));
    dispatch(setUserInfo({ userInfo: [] }));
    dispatch(setIsService({ isService: 0 }));
    dispatch(clearCart());
    setIsToggle(false);
    history.push('/');
  };

  const removeBackdrop = () => {
    const elements = document.getElementsByClassName("offcanvas-backdrop");
    while (elements.length > 0) {
      elements[0].parentNode.removeChild(elements[0]);
    }
    document.body.style.overflow = "unset";
    document.body.style.padding = 0;
  };

  const handleCatChange = (selectedOption) => setCatSelectedOption(selectedOption);

  // const handleSearchInput = (event) => setSearchOption(event.target.value);


  const handleSearchInput = (event) => {
    const value = event.target.value;
    setSearchOption(value);
    if (isService === 0 && value === "") {
      handleSearchProductFilter();
    } else if (isService === 1 && value === "") {
      handleSearchServiceFilter();
    }
  };

  const handleIsService = (event) => {
    const isServiceValue = parseInt(event.target.value);
    console.log("isServiceValue", isServiceValue)
    dispatch(setIsService({ isService: isServiceValue }));
    //dispatch(setIsService({ isService: parseInt(event.target.value) }));
    // Set isToggle value based on isService
    const isToggleValue = isServiceValue === 0 ? true : false;
    console.log("isToggleValue", isToggleValue)
    setIsToggle(isToggleValue);
    // handleIsToggle(isToggleValue);
    if (window.location.pathname === "/") {
      handleIsToggle(isToggleValue);
    }
    localStorage.setItem("isToggle", JSON.stringify(isToggleValue));
  };

  const getCategories = (catId) => {
    let categories = [];
    let url = "";
    if (catId !== "") {
      url = "front/product/listing/categories/" + catId;
      dispatch(setCatSearchValue({ selectedCategory: { label: "", value: catId }, }));
    } else {
      url = "front/product/categories/search";
    }
    let requestBody = isService === 0 ? { is_service: false } : { is_service: true };
    axios.post(url, requestBody)
      .then((response) => {
        if (response.data.status) {
          let res = response.data.data;
          res.forEach((category) => {
            categories.push({
              label: category.categoryName,
              value: category.id,
            });
          });
        }
        if (isService === 0) {
          dispatch(setCategories({ categories }));
        } else {
          dispatch(setServiceCategories({ categories }));
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.status === false) {
          if (isService === 0) {
            dispatch(setCategories({ categories }));
          } else {
            dispatch(setServiceCategories({ categories }));
          }
        }
      });
  };
  const handleSearch = () => {
    if (isService === 0) {
      let reqBody = { ...productReqBody };
      if (selectedCategory.value !== catSelectedOption.value) {
        reqBody.sub_category_filter = [];
      }
      dispatch(
        setCatSearchValue({
          selectedCategory: catSelectedOption,
          searchInput: searchOption,
        })
      );
      if (props.pageName === "product-listing") {
        reqBody.search_value = searchOption;
        if (catSelectedOption.value !== "") {
          reqBody.category_filter = catSelectedOption.value;
        } else {
          reqBody.category_filter = [];
        }
        reqBody.sub_category_filter = [];
        reqBody.color_filter = [];
        reqBody.brand_filter = [];
        reqBody.price_filter = { min_val: "", max_val: "" };
        dispatch(setMaxPrice({ maxPrice: "" }));
        dispatch(setReqBody({ reqBody: reqBody }));
        dispatch(setLoading({ loading: true }));
        let productsData = [];
        let ids = [];
        axios
          .post("front/product/listing", reqBody)
          .then((response) => {
            if (response.data.status) {
              let res = response.data.data.products;
              res.forEach((product) => {
                productsData.push({
                  id: product.id,
                  image: config.apiURI + product.featuredImage,
                  name: product.name,
                  price: product.price,
                  avgRating: product.avgRating,
                  isService: product.isService,
                  quantity: product.quantity,
                  cryptoPrices: product.cryptoPrices,
                });
                ids.push(product.id);
              });
              dispatch(setProducts({ products: productsData }));
              dispatch(
                setTotalProducts({
                  totalProducts: response.data.data.totalProducts,
                })
              );
              dispatch(setMaxPrice({ maxPrice: response.data.data.maxPrice }));
              getBrands(dispatch);
              getColors(dispatch);
            }
          })
          .catch((error) => {
            if (error.response && error.response.data.status === false) {
              dispatch(setProducts({ products: productsData }));
            }
          })
          .finally(() => {
            setTimeout(() => {
              dispatch(setLoading({ loading: false }));
            }, 300);
          });
      } else {
        let selectedCat =
          catSelectedOption.value === "" ? [] : [catSelectedOption.value];
        reqBody.category_filter = selectedCat;
        reqBody.sorting = { sort_type: "popular", sort_val: "" };
        reqBody.count = { start: 0, limit: 9 };
        dispatch(setServiceReqBody({ reqBody: reqBody }));
      }
      getCategories(catSelectedOption.value);
      let url =
        "/product-listing?cat=" +
        catSelectedOption.value +
        "&search=" +
        searchOption;
      history.push(url);
    } else {
      let reqBody = { ...serviceReqBody };
      if (selectedCategory.value !== catSelectedOption.value) {
        reqBody.sub_category_filter = [];
      }
      dispatch(
        setCatSearchValue({
          selectedCategory: catSelectedOption,
          searchInput: searchOption,
        })
      );
      if (props.pageName === "service-listing") {
        console.log("Service listing page");
        reqBody.search_value = searchOption;
        if (catSelectedOption.value !== "") {
          reqBody.category_filter = catSelectedOption.value;
        } else {
          reqBody.category_filter = [];
        }
        reqBody.sub_category_filter = [];
        reqBody.rating_filter = [];
        reqBody.episode_filter = [];
        reqBody.price_filter = { min_val: "", max_val: "" };
        dispatch(setServiceMaxPrice({ serviceMaxPrice: "" }));
        dispatch(setServiceReqBody({ reqBody: reqBody }));
        dispatch(setLoading({ loading: true }));
        let servicesData = [];
        let ids = [];
        axios
          .post("front/service/listing", reqBody)
          .then((response) => {
            if (response.data.status) {
              let res = response.data.data.services;
              res.forEach((service) => {
                servicesData.push({
                  id: service.id,
                  image: config.apiURI + service.featuredImage,
                  name: service.name,
                  price: service.price,
                  avgRating: service.avgRating,
                  videoCount: service.videoCount,
                  isService: service.isService,
                  quantity: service.quantity,
                  cryptoPrices: service.cryptoPrices,
                });
                ids.push(service.id);
              });
              dispatch(setServices({ services: servicesData }));
              dispatch(
                setTotalServices({
                  totalServices: response.data.data.totalServices,
                })
              );
              dispatch(
                setServiceMaxPrice({ maxPrice: response.data.data.maxPrice })
              );
              getBrands(dispatch);
              getColors(dispatch);
            }
          })
          .catch((error) => {
            if (error.response && error.response.data.status === false) {
              dispatch(setServices({ services: servicesData }));
            }
          })
          .finally(() => {
            setTimeout(() => {
              dispatch(setLoading({ loading: false }));
            }, 300);
          });
      } else {
        let selectedCat =
          catSelectedOption.value === "" ? [] : [catSelectedOption.value];
        reqBody.category_filter = selectedCat;
        reqBody.sorting = { sort_type: "popular", sort_val: "" };
        reqBody.count = { start: 0, limit: 9 };
        dispatch(setServiceReqBody({ reqBody: reqBody }));
      }
    }
  };

  useEffect(() => {
    authVerification(dispatch);
    if (flag === false) {
      let catId =
        /cat=([^&]+)/.exec(location.search) !== null
          ? /cat=([^&]+)/.exec(location.search)[1]
          : "";
      getCategories(catId);
      setFlag(true);
    }

    let requestBody = isService === 0 ? { is_service: false } : { is_service: true };
    axios.post("front/product/categories/menu", requestBody)
      .then((response) => {
        if (response.data.status) {
          setData(response.data.data);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
    // Get categories
    axios.post("front/product/categories/search", requestBody)
      .then((response) => {
        if (response.data.status) {
          let options = [];
          options.push({ label: "All", value: "" });
          response.data.data.forEach((category) => {
            options.push({
              label: category.categoryName,
              value: category.id,
            });
          });
          setCategoryOptions(options);
          options.forEach((item) => {
            if (item.value === readUrlResult.catId) {
              setCatSelectedOption(item);
            }
          });
          if (!productCategories.length) {
            if (isService === 0) {
              dispatch(setCategories({ categories: options }));
            } else {
              dispatch(setServiceCategories({ categories: options }));
            }
          }
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [
    dispatch,
    productCategories,
    readUrlResult.catId,
    isService,
    location,
    isToggle,
    flag,
    loginStatus,
    userInfo.role,
    readStatus,
  ]);

  useEffect(() => {
    const socket = io.connect(process.env.REACT_APP_SOCKET_SERVER_URL);
    if (authInfo) {
      socket.emit('allNotifications', { userID: authInfo.id });
      // console.log(`User with ID ${authInfo.id} joined their room.`);
      fetchNotification(authInfo.id);
    }

    socket.on('receive_notification', (notification) => {
      if (!notification || !notification.message) {
        console.error('Received invalid notification data:', notification);
        return;
      }

      setUnreadCount((prevCount) => prevCount + 1);
      console.log('New Notification:', notification.message);
    });

    return () => {
      socket.off('receive_notification');
      socket.disconnect();
    };
  }, []);

  const cart = useSelector((state) => state.cart);
  // console.log("cart", cart.cart.length);
  localStorage.setItem("cart", cart);
  const getTotalQuantity = () => {
    let total = 0;
    if (!loginStatus) {
      // console.log("loginStatus", !loginStatus)
      // console.log("total", total)
      return total = cart.cart.length;
    }
    // console.log('loginStatus=', loginStatus);
    Object.keys(cart).forEach((item) => {
      let cartItems = cart[item];
      for (const key in cartItems) {
        total += cartItems[key].quantity;
      }
      //total += item.quantity
    });
    localStorage.setItem("totalQuantity", total);
    // console.log("total cart quantity check", total)
    return total;
  };

  const fetchNotification = async (userId) => {
    try {
      axios.get(`front/notifications/${userId}`).then(response => {
        console.log('response-- of notification', response)
        const responseData = response.data.data
        if (Array.isArray(responseData) && responseData.length > 0) {
          const offlineNotifications = response.data.data.filter(notification => !notification.notification.isRead);
          if (offlineNotifications && offlineNotifications.length > 0) {
            offlineNotifications.forEach(notification => {
              setUnreadCount((prevCount) => prevCount + 1);
              console.log('Offline Notification:', notification.message);
            });
          }
        } else {
          console.log('No notifications found.');
        }
      });
    } catch (error) {
      console.log("Error", error);
    }
  };

  const truncateMessage = (message, maxLength = 1) => {
    if (message.length <= maxLength) {
      return message;
    } else {
      const truncatedMessage = message.split("").slice(0, maxLength).join(" ");
      return `${truncatedMessage} ...`;
    }
  };

  const handleSearchServiceFilter = async () => {
    try {
      const query = new URLSearchParams();
      if (catSelectedOption.label !== 'All') query.append('category', catSelectedOption.label);
      if (searchOption) query.append('name', searchOption);
      // const response = await axios.get(`/front/searchFilterServices?${query.toString()}}`, {
      //   headers: {
      //     'Accept': 'application/json',
      //     'Content-Type': 'application/json;charset=UTF-8',
      //   },
      // });
      history.push(`/service-listing?cat=${catSelectedOption.value}&searchText=${searchOption || ''}`)
    } catch (error) {
      toast.error("Data Not Found", { autoClose: 3000 })
      console.error('Error fetching users:', error);
    }

  }

  const handleSearchProductFilter = async () => {
    try {
      const query = new URLSearchParams();
      if (catSelectedOption.label !== 'All') query.append('category', catSelectedOption.label);
      if (searchOption) query.append('name', searchOption);
      const response = await axios.get(`/front/searchFilterProducts?${query.toString()}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
        },
      });
      console.log("response form search product >>>>.", response.data.data)
      history.push(`/product-listing?cat=${catSelectedOption.value}&searchText=${searchOption || ''}`)
    } catch (error) {
      toast.error("Data Not Found", { autoClose: 3000 })
      console.error('Error fetching users:', error);
    }
  }

  const renderItems = (items) => {
    return items.map((item, index) => (
      <li
        className="nav-item"
        key={index}
        onMouseEnter={() => handleMouseEnter(index)}
        onMouseLeave={handleMouseLeave}
      >
        <Link className="nav-link" to={isService === 0 ? `product-listing?cat=${item._id}` : `/service-listing?cat=${item._id}`}>
          {item.name}
        </Link>
        {item.subCategories.length > 0 && hoveredItem === index && (
          <div
            className="position-absolute bg-white border p-2 shadow-sm"
            style={{ zIndex: 10 }}
          >
            {item.subCategories.map((value) => {
              let url = `/product-listing?cat=${item._id}&subcat=${value._id}`;
              return (
                <li key={value["_id"]}>
                  <Link to={url} className="dropdown-item m-2">
                    {value.categoryName}
                  </Link>
                </li>
              );
            })}
          </div>
        )}
      </li>
    ));
  };

  const handleNotificationClick = () => {
    if (loginStatus && userInfo.role === "user") {
      const authInfo = JSON.parse(localStorage.getItem("authInfo"));
      axios.put(`front/updateNotifications/${authInfo.id}`).then(response => {
        //console.log('Offline Notification data---:', response);
        const offlineNotifications = response.data.data;
        console.log('offlineNotifications--', offlineNotifications)
      });
      setUnreadCount(0);
    }
  }




  return (
    <React.Fragment>
      {/* <Helmet><title>{"Home - Pay Earth"}</title></Helmet> */}
      {loginModal && (
        <LoginModal
          onloginHide={closemodalHandler}
          onregisterShow={showregisterHandler}
          onForgotShow={showForgotHandler}
        />
      )}
      {registerModal && (
        <RegisterModal
          onregisterHide={hideregisterHandler}
          onloginShow={openmodalHandler}
        />
      )}
      {forgotModal && (
        <ForgotPwdModal
          onForgotHide={hideForgotHandler}
          onForgotShow={showForgotHandler}
        />
      )}
      {resetModal && (
        <ResetPwdModal
          onResetPwdHide={hideRestPwdHandler}
          onRestPwdShow={showRestPwdHandler}
          onloginShow={openmodalHandler}
          onForgotShow={showForgotHandler}
        />
      )}
      {loginStatus && (
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
              <img src={closeIcon} className="img-fluid" alt="close_icon" />{" "}
              Close
            </button>
          </div>
          <div className="offcanvas-body">
            <div className="side_menu_body">
              <ul className="side_menu_links">
                <li>
                  <Link to="/" onClick={() => removeBackdrop()}>
                    <i className="icon">
                      <img src={serviceIcon} alt="heart" />
                    </i>{" "}
                    Home
                  </Link>
                </li>

                <li>
                  <Link to="/product-listing" onClick={() => removeBackdrop()}>
                    <i className="icon">
                      <img src={serviceIcon} alt="heart" />
                    </i>{" "}
                    Products
                  </Link>
                </li>
                <li>
                  <Link to="/service-listing" onClick={() => removeBackdrop()}>
                    <i className="icon">
                      <img src={serviceIcon} alt="heart" />
                    </i>{" "}
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/my-orders" onClick={() => removeBackdrop()}>
                    <i className="icon">
                      <img src={shoppingBagIcon} alt="" />
                    </i>{" "}
                    Product Orders
                  </Link>
                </li>
                <li>
                  <Link to="/service-order" onClick={() => removeBackdrop()}>
                    <i className="icon">
                      <img src={serviceIcon} alt="heart" />
                    </i>{" "}
                    Service Orders
                  </Link>
                </li>
                <li>
                  <Link to="/blog" onClick={() => removeBackdrop()}>
                    <i className="icon">
                      <img src={serviceIcon} alt="heart" />
                    </i>{" "}
                    Blog
                  </Link>
                </li>
                {/* <li>
                  <Link to="/my-payments" onClick={() => removeBackdrop()}>
                    <i className="icon">
                      <img src={creditCardIcon} alt="credit-card" />
                    </i>{" "}
                    Payments
                  </Link>
                </li> */}
                <li>
                  <Link to="/notifications">
                    <i className="icon">
                      <img src={notificationBellIcon} alt="notification-bell" />
                    </i>{" "}
                    Notifications
                  </Link>
                </li>
                <li>
                  <Link to="/chat">
                    <i className="icon">
                      <img src={chatIcon} alt="chat" />
                    </i>{" "}
                    Chats
                  </Link>
                </li>
                <li>
                  <Link to="/my-coupons" onClick={() => removeBackdrop()}>
                    <i className="icon">
                      <img src={couponIcon} alt="coupon" />
                    </i>{" "}
                    My Coupons
                  </Link>
                </li>
                <li>
                  <Link to="/my-wishlist" onClick={() => removeBackdrop()}>
                    <i className="icon">
                      <img src={heartIcon} alt="heart" />
                    </i>{" "}
                    Wish List
                  </Link>
                </li>
                <li>
                  <Link to="/savelater" onClick={() => removeBackdrop()}>
                    <i className="icon">
                      <img src={heartIcon} alt="heart" />
                    </i>{" "}
                    Savelater List
                  </Link>
                </li>
                <li>
                  <Link to="/community" onClick={() => removeBackdrop()}>
                    <i className="icon">
                      <img src={serviceIcon} alt="heart" />
                    </i>{" "}
                    Community
                  </Link>
                </li>
                <li>
                  <Link to="/user-contact" onClick={() => removeBackdrop()}>
                    <i className="icon">
                      <img src={serviceIcon} alt="heart" />
                    </i>{" "}
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/user-support" onClick={() => removeBackdrop()}>
                    <i className="icon">
                      <img src={serviceIcon} alt="heart" />
                    </i>{" "}
                    Support
                  </Link>
                </li>
                <li>
                  <Link to="#" onClick={() => logout()}>
                    <i className="icon">
                      <img src={logoutIcon} alt="logout" />
                    </i>{" "}
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      <header className="header">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="top_bar">
                {loginStatus && userInfo.role === "user" ? (
                  <button
                    className="btn btn-primary rounded-0 h-100"
                    type="button"
                    data-bs-toggle="offcanvas"
                    data-bs-target="#sideMenu"
                    aria-controls="sideMenu"
                  >
                    <span className="fa fa-bars"></span>
                  </button>
                ) : (
                  ""
                )}
                <div className="nav_wrapper">
                  <ul className="mob-hide">
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    {JSON.parse(localStorage.getItem("isLoggedIn")) && (
                      <li>
                        <Link to="/community">Community</Link>
                      </li>
                    )}
                    <li>
                      <Link to="/user-contact">Contact</Link>
                    </li>
                    <li>
                      <Link to="/blog">Blog</Link>
                    </li>
                    <li>
                      <Link to="/product-listing">Products</Link>
                      {/* <Link to={`/product-detail/${'66db3efeb660f1cef86e1048'}`}>All-Products</Link> */}
                    </li>
                    <li>
                      <Link to="/service-listing">Services</Link>
                    </li>
                  </ul>
                  <ul className="d-flex align-items-center">
                    <li className="login_links_wrapper me-3">
                      {loginStatus && userInfo.role === "user" ? (
                        <Link className="nav-link" to="/notifications" onClick={handleNotificationClick}>
                          <div className="sm_icon">
                            <img src={notificationBellWhiteIcon} alt="" />
                            {unreadCount > 0 && <span className="notification-count text-warning">{unreadCount}</span>}
                          </div>
                        </Link>
                      ) : (
                        ""
                      )}
                    </li>
                    <li className="login_links_wrapper me-3">
                      {loginStatus && userInfo.role === "user" ? (
                        <>
                          <Link to="#" className="login_link position-relative">
                            {userInfo !== undefined ? userInfo.name : ""}
                          </Link>
                        </>
                      ) : (
                        <Link to="#" className="login_link position-relative">
                          Login/Register
                        </Link>
                      )}
                      <div className="login_options">
                        {loginStatus && userInfo.role === "user" ? (
                          <ul className="shadow">
                            <li>
                              <Link to="/my-profile">My Profile</Link>
                            </li>
                            <li>
                              <Link to="#" onClick={logout}>
                                Logout
                              </Link>
                            </li>
                          </ul>
                        ) : (
                          <ul className="shadow">
                            <li>
                              <Link to="#" onClick={openmodalHandler}>
                                Login As Buyer
                              </Link>
                            </li>
                            <li>
                              <Link to="/seller/login">Login As Seller</Link>
                            </li>
                          </ul>
                        )}
                      </div>
                    </li>
                    <li className="head_cart_mini">
                      <Link
                        to="#"
                        className="cart_link position-relative d-flex"
                        onClick={() => {
                          if (loginStatus) {
                            history.push("/my-cart");
                          } else {
                            // return false;
                            history.push("/my-cart");
                          }
                        }}
                      >
                        {/* {getTotalQuantity() || 0} Cart */}
                        {getTotalQuantity()} Cart
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="main_nav">
          <div className="container">
            <div className="row">
              <div className="col-sm-12">
                <nav className="navbar navbar-expand-lg py-0">
                  <div className="container-fluid p-0">
                    <Link className="navbar-brand py-0" to="/">
                      <img src={logo} alt="logo" className="img-fluid" />
                    </Link>
                    <Link className="navbar-brand py-0" to="#">
                      <img src={payearth_qr_code} alt="qr-code" className="img-fluid" width={100} height={100} />
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
                        <div className="nav_wrapper w-100 mt-2">
                          <form className="drop d-lg-flex justify-content-end">
                            <Select
                              className="custom_select w-50"
                              options={categoryOptions}
                              value={catSelectedOption}
                              onChange={handleCatChange}
                            />
                            <input
                              className="form-control border-start height-auto "
                              type="search"
                              placeholder={
                                isService === 0
                                  ? "Search Product..."
                                  : "Search Service..."
                              }
                              value={searchOption}
                              onChange={handleSearchInput}
                            />
                            {isService === 0 ?
                              <button
                                className="btn btn_dark"
                                type="button"
                                onClick={handleSearchProductFilter}
                                disabled={
                                  !(
                                    catSelectedOption?.label === 'All' ||
                                    (catSelectedOption?.label !== 'All' && (searchOption || '').trim() !== '')
                                  )
                                }
                              >
                                Search
                              </button>
                              :
                              <button
                                className="btn btn_dark"
                                type="button"
                                onClick={handleSearchServiceFilter}
                              >
                                Search
                              </button>
                            }
                          </form>
                          <div
                            className="btn-group"
                            role="group"
                            aria-label="Basic example"
                          >
                            <button
                              type="button"
                              value="0"
                              className={
                                isService === 0
                                  ? "btn custom_btn active"
                                  : "btn custom_btn"
                              }
                              onClick={handleIsService}
                            // onClick={handleChange('product')}
                            >
                              Products
                            </button>
                            <button
                              type="button"
                              value="1"
                              className={
                                isService === 1
                                  ? "btn custom_btn active"
                                  : "btn custom_btn"
                              }
                              onClick={handleIsService}
                            // onClick={handleChange('service')}
                            >
                              Services
                            </button>
                          </div>
                        </div>
                        <div className="container-fluid mt-3">
                          {data && data.length > 4 && (
                            <button
                              className="navbar-toggler px-2"
                              type="button"
                              aria-controls="navbarExampleOnHover"
                              aria-expanded={navbarExpanded}
                              aria-label="Toggle navigation"
                              onClick={() => setNavbarExpanded(!navbarExpanded)}
                            >
                              <span className="fa fa-bars"></span>
                            </button>
                          )}

                          <div className={`collapse navbar-collapse ${navbarExpanded ? 'show' : ''}`} id="navbarExampleOnHover">
                            <ul className="navbar-nav justify-content-end flex-grow-1 pe-0">
                              {data && data.length ? renderItems(data.slice(0, 4)) : ""}
                              {data && data.length > 4 && (
                                <li className="nav-item dropdown dropdown-hover position-static">
                                  <a
                                    className="nav-link dropdown-toggle view_more"
                                    href="#"
                                    id="viewMoreDropdown"
                                    role="button"
                                    aria-expanded="false"
                                    onClick={(e) => e.preventDefault()}
                                  >
                                    View More
                                  </a>
                                  <div className="dropdown-menu  w-75 mt-0 end-0" aria-labelledby="viewMoreDropdown" style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
                                    <div className="container">
                                      <div className="row my-3">
                                        {data.slice(4).map((item, index) => (
                                          <div
                                            className="col-md-6 col-lg-4 mb-3 mb-lg-0"
                                            key={index}
                                            onMouseEnter={() => handleMouseEnter(index)}
                                            onMouseLeave={handleMouseLeave}
                                          >
                                            <div className="list-group list-group-flush">
                                              <Link
                                                className="list-group-item list-group-item-action"
                                                to={isService === 0 ? `product-listing?cat=${item._id}` : `/service-listing?cat=${item._id}`}
                                              >
                                                {item.name}
                                              </Link>
                                              {item.subCategories.length > 0 && hoveredItem === index && (
                                                <div
                                                  className="position-absolute bg-white border p-2 shadow-sm mt-2"
                                                  style={{ zIndex: 10, }}
                                                >
                                                  {item.subCategories.map((value) => {
                                                    let url = `/product-listing?cat=${item._id}&subcat=${value._id}`;
                                                    return (
                                                      <li key={value["_id"]}>
                                                        <Link to={url} className="dropdown-item">
                                                          {value.categoryName}
                                                        </Link>
                                                      </li>
                                                    );
                                                  })}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
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