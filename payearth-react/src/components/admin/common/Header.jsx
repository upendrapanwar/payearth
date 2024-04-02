import React from 'react'
import { Link } from 'react-router-dom'
import logo from './../../../assets/images/logo.png'
import smChatIcon from './../../../assets/icons/sm_chat.svg'
import smcommunityIcon from './../../../assets/icons/sm_community.svg'
import contactIcon from './../../../assets/icons/sm_contact.svg'
import smLogoutIcon from './../../../assets/icons/sm_logout.svg'
import shoppingBagIcon from './../../../assets/icons/shopping-bag.svg'
import creditCardIcon from './../../../assets/icons/credit-card.svg'
import notificationBellIcon from './../../../assets/icons/notification-bell.svg'
import chatIcon from './../../../assets/icons/chat.svg'
import logoutIcon from './../../../assets/icons/logout.svg'
import productIcon from './../../../assets/icons/products_icon.svg'
import serviceIcon from './../../../assets/icons/services_icon.svg'
import discountIcon from './../../../assets/icons/discounts_icon.svg'
import customersIcon from './../../../assets/icons/customers_icon.svg'
import vendorIcon from './../../../assets/icons/vendors_icon.svg'
import reportIcon from './../../../assets/icons/reports_icon.svg'
import communityIcon from './../../../assets/icons/community_icon.svg'
import bannerIcon from './../../../assets/icons/banners_icon.svg'
import supportIcon from './../../../assets/icons/support_icon.svg'
import clostBtn from './../../../assets/icons/close_icon.svg';
import { useDispatch } from 'react-redux';
import { setLoginStatus, setUserInfo } from './../../../store/reducers/auth-reducer';

function Header() {
    const dispatch = useDispatch();
    const logout = () => {
        localStorage.clear();
        dispatch(setLoginStatus({ isLoggedIn: false }));
        dispatch(setUserInfo({ userInfo: [] }));
        window.location.href = '/admin/login';
    }
    //**************** */

    const removeBackdrop = () => {
        const elements = document.getElementsByClassName('offcanvas-backdrop');
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
        document.body.style.overflow = 'unset';
        document.body.style.padding = 0;
    }

    //*************** */
    return (
        <React.Fragment>
            <div className="offcanvas offcanvas-start side_menu_wrap" tabIndex="-1" id="sideMenu" aria-labelledby="sideMenuLabel">
                <div className="offcanvas-header">
                    <button type="button" className="view_more text-reset" data-bs-dismiss="offcanvas" aria-label="Close"><img src={clostBtn} className="img-fluid" alt="" /> Close</button>
                </div>
                <div className="offcanvas-body">
                    <div className="side_menu_body">
                        <ul className="side_menu_links">
                            <li><Link to="/admin/post-module" onClick={() => removeBackdrop()}><i className="icon"><img src={shoppingBagIcon} alt="" /></i> Posts</Link></li>
                            <li><Link to="/admin/post-module-add-new" onClick={() => removeBackdrop()}><i className="icon"><img src={bannerIcon} alt="" /></i> Create Post</Link></li>

                            {/* <li><Link to="/admin/page-module" onClick={() => removeBackdrop()}><i className="icon"><img src={shoppingBagIcon} alt="" /></i> Pages </Link></li>
                            <li><Link to="/admin/page-module-add-new" onClick={() => removeBackdrop()}><i className="icon"><img src={bannerIcon} alt="" /></i> Create Page </Link></li> */}
                            
                            <li><Link to="/admin/category-module" onClick={() => removeBackdrop()}><i className="icon"><img src={shoppingBagIcon} alt="" /></i> Create Category </Link></li>

                            <li><Link to="/admin/orders" onClick={() => removeBackdrop()}><i className="icon"><img src={shoppingBagIcon} alt="" /></i> Manage Orders</Link></li>
                            <li><Link to="/admin/payments" onClick={() => removeBackdrop()}><i className="icon"><img src={creditCardIcon} alt="" /></i> Payments</Link></li>
                            <li><Link to="/admin/chat" onClick={() => removeBackdrop()}><i className="icon"><img src={chatIcon} alt="" /></i> Chats</Link></li>
                            <li><Link to="/admin/manage-products" onClick={() => removeBackdrop()}><i className="icon"><img src={productIcon} alt="" /></i> Manage Products</Link></li>

                            <li><Link to="/admin/manage-services" onClick={() => removeBackdrop()}><i className="icon"><img src={serviceIcon} alt="" /></i>Manage Services</Link></li>
                            <li><Link to="/admin/coupons" onClick={() => removeBackdrop()}><i className="icon"><img src={discountIcon} alt="" /></i> Manage Discounts</Link></li>
                            <li><Link to="/admin/manage-customers" onClick={() => removeBackdrop()}><i className="icon"><img src={customersIcon} alt="" /></i> Manage Customers</Link></li>
                            <li><Link to="/admin/manage-vendors" onClick={() => removeBackdrop()}><i className="icon"><img src={vendorIcon} alt="" /></i> Manage Vendors</Link></li>
                            <li><Link to="/admin/manage-reports" onClick={() => removeBackdrop()}><i className="icon"><img src={reportIcon} alt="" /></i> Reports</Link></li>
                            <li><Link to="/admin/manage-community" onClick={() => removeBackdrop()}><i className="icon"><img src={communityIcon} alt="" /></i> Manage Community</Link></li>
                            <li><Link to="/admin/manage-banner-list" onClick={() => removeBackdrop()}><i className="icon"><img src={bannerIcon} alt="" /></i> Manage Advertising</Link></li>
                            <li><Link to="/admin/manage-support" onClick={() => removeBackdrop()}><i className="icon"><img src={supportIcon} alt="" /></i>Support</Link></li>
                            <li><Link to="/admin/manage-notifications" onClick={() => removeBackdrop()}><i className="icon"><img src={notificationBellIcon} alt="" /></i> Notifications</Link></li>
                            <li><Link to="#" onClick={() => logout()}><i className="icon"><img src={logoutIcon} alt="" /></i>Logout</Link></li>
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
                                            <button className="btn" type="button" data-bs-toggle="offcanvas" data-bs-target="#sideMenu" aria-controls="sideMenu">
                                                <span className="menu_btn_icon"></span>
                                            </button>
                                        </div>
                                        <Link className="navbar-brand py-0" to="#"><img src={logo} alt="logo" className="img-fluid h-100" /></Link>
                                        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar"><span className="fa fa-bars"></span></button>
                                        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                                            <div className="offcanvas-header">
                                                <button type="button" className="btn-close text-reset ms-auto" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                            </div>
                                            <div className="offcanvas-body d-block">
                                                <ul className="seller_menu navbar-nav justify-content-end flex-grow-1 pe-0">
                                                    <li className="nav-item">
                                                        <Link className="nav-link" to="/admin/chat" >
                                                            <div className="sm_icon"><img src={smChatIcon} alt="" /></div>
                                                            <span>Chat</span>
                                                        </Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link className="nav-link" to="/admin/manage-community" >
                                                            <div className="sm_icon"><img src={smcommunityIcon} alt="" /></div>
                                                            <span>Community</span>
                                                        </Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link className="nav-link" to="/admin/manage-support" >
                                                            <div className="sm_icon"><img src={contactIcon} alt="" /></div>
                                                            <span>Contact</span>
                                                        </Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link className="nav-link" to="#" onClick={() => logout()}>
                                                            <div className="sm_icon"><img src={smLogoutIcon} alt="" /></div>
                                                            <span>Logout</span>
                                                        </Link>
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
    )
}

export default Header;