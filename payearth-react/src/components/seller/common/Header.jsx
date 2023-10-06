import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import logo from './../../../assets/images/logo.png'
import closeIcon from './../../../assets/icons/close_icon.svg'
import shoppingBagIcon from './../../../assets/icons/shopping-bag.svg'
import creditCardIcon from './../../../assets/icons/credit-card.svg'
import logoutIcon from './../../../assets/icons/logout.svg'
import smChatIcon from './../../../assets/icons/sm_chat.svg'
import communityIcon from './../../../assets/icons/sm_community.svg'
import contactIcon from './../../../assets/icons/sm_contact.svg'
import smLogoutIcon from './../../../assets/icons/sm_logout.svg'
import homeIcon from './../../../assets/icons/home-icon.svg'
import { useDispatch } from 'react-redux';
import { setLoginStatus, setUserInfo } from './../../../store/reducers/auth-reducer';
import { authVerification } from '../../../helpers/auth-verification';

const Header = () => {
    const dispatch = useDispatch();
    const logout = () => {
        localStorage.clear();
        dispatch(setLoginStatus({ isLoggedIn: false }));
        dispatch(setUserInfo({ userInfo: [] }));
        window.location.href = '/seller/login';
    }

    useEffect(() => {
        authVerification(dispatch);
    }, [dispatch]);

    const removeBackdrop = () => {
        const elements = document.getElementsByClassName('offcanvas-backdrop');
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
        document.body.style.overflow = 'unset';
        document.body.style.padding = 0;
    }

    return (
        <React.Fragment>
            <div className="offcanvas offcanvas-start side_menu_wrap" tabIndex="-1" id="sideMenu" aria-labelledby="sideMenuLabel">
                <div className="offcanvas-header">
                    <button type="button" className="view_more text-reset" data-bs-dismiss="offcanvas" aria-label="Close"><img src={closeIcon} className="img-fluid" alt="" /> Close</button>
                </div>
                <div className="offcanvas-body">
                    <div className="side_menu_body">
                        <ul className="side_menu_links">
                            <li><Link to="/seller/dashboard" onClick={() => removeBackdrop()} ><i className="icon"><img src={homeIcon} alt="" /></i>Dashboard</Link></li>
                            <li><Link to="/seller/listed-items" onClick={() => removeBackdrop()} ><i className="icon"><img src={shoppingBagIcon} alt="" /></i> Listed Products</Link></li>
                            <li><Link to="/seller/product-stock-management" onClick={() => removeBackdrop()}><i className="icon"><img src={shoppingBagIcon} alt="" /></i> Product Management</Link></li>
                            <li><Link to="/seller/service-stock-management" onClick={() => removeBackdrop()}><i className="icon"><img src={shoppingBagIcon} alt="" /></i> Service Management</Link></li>
                            <li><Link to="/seller/product-orders" onClick={() => removeBackdrop()}><i className="icon"><img src={shoppingBagIcon} alt="" /></i> Product Orders</Link></li>
                            <li><Link to="/seller/service-orders" onClick={() => removeBackdrop()}><i className="icon"><img src={shoppingBagIcon} alt="" /></i> Service Orders</Link></li>
                            <li><Link to="/seller/payments" onClick={() => removeBackdrop()}><i className="icon"><img src={creditCardIcon} alt="" /></i> Payments</Link></li>
                            <li><Link to="#" onClick={() => logout()}><i className="icon"><img src={logoutIcon} alt="" /></i> Logout</Link></li>
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
                                        <Link className="navbar-brand py-0" to="/"><img src={logo} alt="logo" className="img-fluid h-100" /></Link>
                                        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar"><span className="fa fa-bars"></span></button>
                                        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                                            <div className="offcanvas-header">
                                                <button type="button" className="btn-close text-reset ms-auto" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                            </div>
                                            <div className="offcanvas-body d-block">
                                                <ul className="seller_menu navbar-nav justify-content-end flex-grow-1 pe-0">
                                                    <li className="nav-item"><Link to="/seller/add-product" className="btn custom_btn btn_yellow w-auto text-uppercase">add new product</Link></li>
                                                    <li className="nav-item">
                                                        <Link className="nav-link" to="/seller/chat">
                                                            <div className="sm_icon"><img src={smChatIcon} alt="" /></div>
                                                            <span>Chat</span>
                                                        </Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link className="nav-link" to="/community" >
                                                            <div className="sm_icon"><img src={communityIcon} alt="" /></div>
                                                            <span>Community</span>
                                                        </Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link className="nav-link" to="/seller/contact" >
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