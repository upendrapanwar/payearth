import React, { useEffect } from 'react';
import logo from '../../../assets/images/logo.png'
import closeIcon from '../../../assets/icons/close_icon.svg'
import logoutIcon from './../../../assets/icons/logout.svg'
import userImg from '../../../assets/images/user.png'
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setLoginStatus, setUserInfo } from './../../../store/reducers/auth-reducer';
import { authVerification } from '../../../helpers/auth-verification';
import { useSelector } from 'react-redux';
import config from '../../../config.json'
import shoppingBagIcon from '../../../assets/icons/shopping-bag.svg'
import creditCardIcon from '../../../assets/icons/credit-card.svg'
import notificationBellIcon from '../../../assets/icons/notification-bell.svg'
import chatIcon from '../../../assets/icons/chat.svg'
import couponIcon from '../../../assets/icons/coupon.svg'
import heartIcon from '../../../assets/icons/heart.svg'
import dashboardIcon from '../../../assets/icons/home-icon.svg'
import communityIcon from '../../../assets/icons/sm_community.svg'


const Header = () => {
    const userInfo = useSelector(state => state.auth.userInfo);
    const dispatch = useDispatch();
    const history = useHistory();
    const logout = () => {
        localStorage.clear();
        dispatch(setLoginStatus({ isLoggedIn: false }));
        dispatch(setUserInfo({ userInfo: [] }));
        history.push('/');
    }
    const removeBackdrop = () => {
        const elements = document.getElementsByClassName('offcanvas-backdrop');
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
        document.body.style.overflow = 'unset';
        document.body.style.padding = 0;
    }

    useEffect(() => {
        authVerification(dispatch);
    }, [dispatch]);
    return (
        <React.Fragment>
            <div className="offcanvas offcanvas-start side_menu_wrap" tabIndex="-1" id="sideMenu" aria-labelledby="sideMenuLabel">
                <div className="offcanvas-header">
                    <button type="button" className="view_more text-reset" data-bs-dismiss="offcanvas" aria-label="Close"><img src={closeIcon} className="img-fluid" alt="" /> Close</button>
                </div>
                <div className="offcanvas-body">
                    <div className="side_menu_body">
                        {userInfo.role === 'user' &&
                            // <ul className="side_menu_links">
                            //     <li><Link to="/community" onClick={() => removeBackdrop()}><i className="icon"><img src={communityIcon} alt="" /></i> Community</Link></li>
                            //     <li><Link to="#"><i className="icon"><img src={orderIcon} alt="" /></i> Orders</Link></li>
                            //     <li><Link to="#"><i className="icon"><img src={paymentIcon} alt="" /></i> Payments</Link></li>
                            //     <li><Link to="#"><i className="icon"><img src={notification} alt="" /></i> Notifications</Link></li>
                            //     <li><Link to="#"><i className="icon"><img src={chatIcon} alt="" /></i> Chats</Link></li>
                            //     <li><Link to="#"><i className="icon"><img src={couponsIcon} alt="" /></i> My Coupons</Link></li>
                            //     <li><Link to="#"><i className="icon"><img src={wishlistIcon} alt="" /></i> Wishlist</Link></li>
                            //     <li><Link to="#" onClick={() => logout()}><i className="icon" ><img src={logoutIcon} alt="" /></i> Logout</Link></li>
                            // </ul>
                            <ul className="side_menu_links">
                                <li><Link to="/my-orders" onClick={() => removeBackdrop()}><i className="icon"><img src={shoppingBagIcon} alt="" /></i> Orders</Link></li>
                                <li><Link to="/my-payments" onClick={() => removeBackdrop()}><i className="icon"><img src={creditCardIcon} alt="credit-card" /></i> Payments</Link></li>
                                <li><Link to="#"><i className="icon"><img src={notificationBellIcon} alt="notification-bell" /></i> Notifications</Link></li>
                                <li><Link to="#"><i className="icon"><img src={chatIcon} alt="chat" /></i> Chats</Link></li>
                                <li><Link to="/my-coupons" onClick={() => removeBackdrop()}><i className="icon"><img src={couponIcon} alt="coupon" /></i> My Coupons</Link></li>
                                <li><Link to="/my-wishlist" onClick={() => removeBackdrop()}><i className="icon"><img src={heartIcon} alt="heart" /></i> Wish List</Link></li>
                                <li><Link to="#" onClick={() => logout()}><i className="icon"><img src={logoutIcon} alt="logout" /></i> Logout</Link></li>
                            </ul>
                        }
                        {userInfo.role === 'seller' &&
                            <ul className="side_menu_links">
                                <li><Link to="/seller/dashboard" onClick={() => removeBackdrop()} ><i className="icon"><img src={dashboardIcon} alt="" /></i>Dashboard</Link></li>
                                <li><Link to="/seller/listed-items" onClick={() => removeBackdrop()} ><i className="icon"><img src={shoppingBagIcon} alt="" /></i> Listed Products</Link></li>
                                <li><Link to="/seller/product-stock-management" onClick={() => removeBackdrop()}><i className="icon"><img src={shoppingBagIcon} alt="" /></i> Product Management</Link></li>
                                <li><Link to="/seller/service-stock-management" onClick={() => removeBackdrop()}><i className="icon"><img src={shoppingBagIcon} alt="" /></i> Service Management</Link></li>
                                <li><Link to="/seller/product-orders" onClick={() => removeBackdrop()}><i className="icon"><img src={shoppingBagIcon} alt="" /></i> Product Orders</Link></li>
                                <li><Link to="/seller/service-orders" onClick={() => removeBackdrop()}><i className="icon"><img src={shoppingBagIcon} alt="" /></i> Service Orders</Link></li>
                                <li><Link to="/seller/payments" onClick={() => removeBackdrop()}><i className="icon"><img src={creditCardIcon} alt="" /></i> Payments</Link></li>
                                <li><Link to="#" onClick={() => logout()}><i className="icon"><img src={logoutIcon} alt="" /></i> Logout</Link></li>
                            </ul>
                        }
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
                                            <button className="btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#sideMenu" aria-controls="sideMenu">
                                                <span className="menu_btn_icon"></span>
                                            </button>
                                        </div>
                                        <Link className="navbar-brand py-0" to="/"><img src={logo} alt="logo" className="img-fluid h-100" /></Link>
                                        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar"><span className="fa fa-bars"></span></button>
                                        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                                            <div className="offcanvas-header">
                                                <button type="button" className="btn-close text-reset ms-auto" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                            </div>
                                            <div className="offcanvas-body d-block">
                                                <div className="cum_head d-flex align-items-center">
                                                    <div className="search_box ms-auto">
                                                        <div className="input-group pe-2">
                                                            <select className="form-select" aria-label="Default select">
                                                                <option >Product</option>
                                                                <option value="1">One</option>
                                                                <option value="2">Two</option>
                                                                <option value="3">Three</option>
                                                            </select>
                                                            <select className="form-select" aria-label="Default select">
                                                                <option >Filter Posts</option>
                                                                <option value="1">One</option>
                                                                <option value="2">Two</option>
                                                                <option value="3">Three</option>
                                                            </select>
                                                            <input type="text" className="form-control" placeholder="Search" aria-label="Search" aria-describedby="button-addon2" />
                                                            <button className="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
                                                        </div>
                                                    </div>
                                                    <ul className="navbar-nav">
                                                        <li className="nav-item dropdown">
                                                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                <div className="com_user_acc">
                                                                    <div className="com_user_img"><img src={userInfo.imgUrl !== null && userInfo.imgUrl !== '' ? config.apiURI + userInfo.imgUrl : userImg} alt="" /></div>
                                                                    <div className="com_user_name">
                                                                        <div className="cu_name">{userInfo.name}</div>
                                                                        <div>{userInfo.role}</div>
                                                                    </div>
                                                                </div>
                                                            </Link>
                                                            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                                                <li><Link className="dropdown-item" to="/community-profile">Account</Link></li>
                                                                {/* <li><Link className="dropdown-item" to="#">Setting</Link></li> */}
                                                                <li><hr className="dropdown-divider" /></li>
                                                                <li><Link className="dropdown-item" to="#" onClick={() => logout()} >Log Out</Link></li>
                                                            </ul>
                                                        </li>
                                                    </ul>
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
}

export default Header;