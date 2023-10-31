import React, { useState, useEffect } from 'react';
import { Link, useLocation, useHistory } from 'react-router-dom';
import config from './../../../config.json';
import axios from 'axios';
import { ShoppingCart } from '@mui/icons-material';

import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import { setLoginStatus, setUserInfo } from '../../../store/reducers/auth-reducer';
import { setProducts, setReqBody, setTotalProducts, setCategories, setMaxPrice } from '../../../store/reducers/product-reducer';
import { setServices, setServiceReqBody, setTotalServices, setServiceCategories, setServiceMaxPrice } from '../../../store/reducers/service-reducer';
import { setCatSearchValue, setIsService } from '../../../store/reducers/cat-search-reducer';
import { setLoading, setIsLoginModalOpen } from '../../../store/reducers/global-reducer';
import Select from 'react-select';
import readUrl from '../../../helpers/read-product-listing-url';
import { getBrands, getColors } from '../../../helpers/product-listing';
import LoginModal from '../../common/modals/LoginModal';
import RegisterModal from '../../common/modals/RegisterModal';
import ForgotPwdModal from '../../common/modals/ForgotPwdModal';
import ResetPwdModal from '../../common/modals/ResetPwdModal';
import logo from './../../../assets/images/logo.png';
import closeIcon from './../../../assets/icons/close_icon.svg';
import shoppingBagIcon from './../../../assets/icons/shopping-bag.svg';
import creditCardIcon from './../../../assets/icons/credit-card.svg';
import notificationBellIcon from './../../../assets/icons/notification-bell.svg';
import chatIcon from './../../../assets/icons/chat.svg';
import couponIcon from './../../../assets/icons/coupon.svg';
import heartIcon from './../../../assets/icons/heart.svg';
import logoutIcon from './../../../assets/icons/logout.svg';
import { authVerification } from '../../../helpers/auth-verification';
// import { setReqBody } from '../../../store/reducers/product-reducer';
// import { setReqBody } from './../../../store/reducers/product-reducer';

const subCategories = (catId, data) => {
    if (data && data.length) {
        return (
            <ul className="dropdown-menu" aria-labelledby="offcanvasNavbarDropdown">
                {data.map(value => {
                    let url = `/product-listing?cat=${catId}&subcat=${value._id}`;
                    return <li key={value['_id']}><Link to={url} className="dropdown-item">{value.categoryName}</Link></li>
                })}
            </ul>
        );
    }
}

const Header = (props) => {
    toast.configure();
    const loginStatus = useSelector(state => state.auth.isLoggedIn);
    const userInfo = useSelector(state => state.auth.userInfo);
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory();

    const productReqBody = useSelector(state => state.product.reqBody);
    const serviceReqBody = useSelector(state => state.service.reqBody);
    const productCategories = useSelector(state => state.product.categories);
    const loginModal = useSelector(state => state.global.isLoginModalOpen);
    const readUrlResult = readUrl(dispatch, { ...productReqBody }, location, setReqBody, 'header');

    const [data, setData] = useState([]);
    const [registerModal, setRegister] = useState(false);
    const [forgotModal, setForgot] = useState(false);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [isToggle, setIsToggle] = useState(false);

    const selectedCategory = useSelector(state => state.catSearch.selectedCategory);
    const searchInput = useSelector(state => state.catSearch.searchInput);
    const isService = useSelector(state => state.catSearch.isService);
    const [catSelectedOption, setCatSelectedOption] = useState(selectedCategory === '' ? [] : selectedCategory);
    const [searchOption, setSearchOption] = useState(searchInput !== '' ? searchInput : readUrlResult.searchInput);
    const [flag, setFlag] = useState(false);

    const url = location.search;
    var param = false;

    if (url !== null && url !== '') {
        if (/t=([^&]+)/.exec(url) !== null) {
            param = /t=([^&]+)/.exec(url)[1] === 'resetpass' ? true : false;
        }
    }

    const [resetModal, setReset] = useState(param);

    const openmodalHandler = () => {
        setRegister(false);
        setForgot(false);
        setReset(false);
        dispatch(setIsLoginModalOpen({ isLoginModalOpen: true }));
        document.body.style.overflow = 'hidden';
    }
    const closemodalHandler = () => {
        dispatch(setIsLoginModalOpen({ isLoginModalOpen: false }));
        document.body.style.overflow = 'unset';
    }

    const showregisterHandler = () => {
        dispatch(setIsLoginModalOpen({ isLoginModalOpen: false }));
        setForgot(false);
        setReset(false);
        setRegister(true);
        document.body.style.overflow = 'hidden';
    }
    const hideregisterHandler = () => {
        setRegister(false);
        document.body.style.overflow = 'unset';
    }

    const showForgotHandler = () => {
        dispatch(setIsLoginModalOpen({ isLoginModalOpen: false }));
        setRegister(false);
        setReset(false);
        setForgot(true);
        document.body.style.overflow = 'hidden';
    }
    const hideForgotHandler = () => {
        setForgot(false);
        document.body.style.overflow = 'unset';
    }

    const showRestPwdHandler = () => {
        dispatch(setIsLoginModalOpen({ isLoginModalOpen: false }));
        setRegister(false);
        setForgot(false);
        setReset(true);
        document.body.style.overflow = 'hidden';
    }
    const hideRestPwdHandler = () => {
        setReset(false);
        document.body.style.overflow = 'unset';
    }

    const logout = () => {
        localStorage.clear();
        dispatch(setLoginStatus({ isLoggedIn: false }));
        dispatch(setUserInfo({ userInfo: [] }));
        window.location.href = '/';
    }

    const removeBackdrop = () => {
        const elements = document.getElementsByClassName('offcanvas-backdrop');
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
        document.body.style.overflow = 'unset';
        document.body.style.padding = 0;
    }

    const handleCatChange = selectedOption => setCatSelectedOption(selectedOption);
    const handleSearchInput = event => setSearchOption(event.target.value);
    const handleIsService = event => {
        dispatch(setIsService({ isService: parseInt(event.target.value) }));
        if (isToggle === false) {
            setIsToggle(true);
        }

        // if (location.pathname === '/product-listing' && parseInt(event.target.value) === 1) {
        //     history.push('/service-listing');
        // } else if(location.pathname === '/service-listing' && parseInt(event.target.value) === 0) {
        //     history.push('/product-listing');
        // } else {
        //     dispatch(setIsService({isService: parseInt(event.target.value)}));
        // }
    };

    const getCategories = catId => {
        let categories = [];
        let url = '';
        if (catId !== '') {
            url = 'front/product/listing/categories/' + catId;
            dispatch(setCatSearchValue({
                selectedCategory: { label: '', value: catId },
            }));
        } else {
            url = 'front/product/categories/search';
        }
        let requestBody = isService === 0 ? { is_service: false } : { is_service: true };

        axios.post(url, requestBody).then(response => {
            if (response.data.status) {
                let res = response.data.data;
                res.forEach(category => {
                    categories.push({
                        label: category.categoryName,
                        value: category.id
                    });
                });
            }

            if (isService === 0) {
                dispatch(setCategories({ categories }));
            } else {
                dispatch(setServiceCategories({ categories }));
            }

        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                if (isService === 0) {
                    dispatch(setCategories({ categories }));
                } else {
                    dispatch(setServiceCategories({ categories }));
                }
            }
        });
    }

    const handleSearch = () => {
        if (isService === 0) {
            let reqBody = { ...productReqBody };
            if (selectedCategory.value !== catSelectedOption.value) {
                reqBody.sub_category_filter = [];
            }

            dispatch(setCatSearchValue({
                selectedCategory: catSelectedOption,
                searchInput: searchOption
            }));

            if (props.pageName === 'product-listing') {
                reqBody.search_value = searchOption;
                if (catSelectedOption.value !== '') {
                    reqBody.category_filter = catSelectedOption.value;
                } else {
                    reqBody.category_filter = [];
                }

                reqBody.sub_category_filter = [];
                reqBody.color_filter = [];
                reqBody.brand_filter = [];
                reqBody.price_filter = { min_val: '', max_val: '' };
                dispatch(setMaxPrice({ maxPrice: '' }));
                dispatch(setReqBody({ reqBody: reqBody }));
                dispatch(setLoading({ loading: true }));
                let productsData = [];
                let ids = [];
                axios.post('front/product/listing', reqBody).then((response) => {
                    if (response.data.status) {
                        let res = response.data.data.products;
                        res.forEach(product => {
                            productsData.push({
                                id: product.id,
                                image: config.apiURI + product.featuredImage,
                                name: product.name,
                                price: product.price,
                                avgRating: product.avgRating,
                                isService: product.isService,
                                quantity: product.quantity,
                                cryptoPrices: product.cryptoPrices
                            });
                            ids.push(product.id);
                        });
                        dispatch(setProducts({ products: productsData }));
                        dispatch(setTotalProducts({ totalProducts: response.data.data.totalProducts }));
                        dispatch(setMaxPrice({ maxPrice: response.data.data.maxPrice }));
                        getBrands(dispatch);
                        getColors(dispatch);
                    }
                }).catch(error => {
                    if (error.response && error.response.data.status === false) {
                        dispatch(setProducts({ products: productsData }));
                    }
                }).finally(() => {
                    setTimeout(() => {
                        dispatch(setLoading({ loading: false }));
                    }, 300);
                });
            } else {
                let selectedCat = catSelectedOption.value === '' ? [] : [catSelectedOption.value];
                reqBody.category_filter = selectedCat;
                reqBody.sorting = { sort_type: 'popular', sort_val: '' };
                reqBody.count = { start: 0, limit: 9 };
                dispatch(setServiceReqBody({ reqBody: reqBody }));
            }

            getCategories(catSelectedOption.value);
            let url = '/product-listing?cat=' + catSelectedOption.value + '&search=' + searchOption
            history.push(url);
        } else {
            let reqBody = { ...serviceReqBody };
            if (selectedCategory.value !== catSelectedOption.value) {
                reqBody.sub_category_filter = [];
            }

            dispatch(setCatSearchValue({
                selectedCategory: catSelectedOption,
                searchInput: searchOption
            }));

            if (props.pageName === 'service-listing') {
                reqBody.search_value = searchOption;
                if (catSelectedOption.value !== '') {
                    reqBody.category_filter = catSelectedOption.value;
                } else {
                    reqBody.category_filter = [];
                }

                reqBody.sub_category_filter = [];
                reqBody.rating_filter = [];
                reqBody.episode_filter = [];
                reqBody.price_filter = { min_val: '', max_val: '' };
                dispatch(setServiceMaxPrice({ serviceMaxPrice: '' }));
                dispatch(setServiceReqBody({ reqBody: reqBody }));
                dispatch(setLoading({ loading: true }));
                let servicesData = [];
                let ids = [];
                axios.post('front/service/listing', reqBody).then((response) => {
                    if (response.data.status) {
                        let res = response.data.data.services;
                        res.forEach(service => {
                            servicesData.push({
                                id: service.id,
                                image: config.apiURI + service.featuredImage,
                                name: service.name,
                                price: service.price,
                                avgRating: service.avgRating,
                                videoCount: service.videoCount,
                                isService: service.isService,
                                quantity: service.quantity,
                                cryptoPrices: service.cryptoPrices
                            });
                            ids.push(service.id);
                        });
                        dispatch(setServices({ services: servicesData }));
                        dispatch(setTotalServices({ totalServices: response.data.data.totalServices }));
                        dispatch(setServiceMaxPrice({ maxPrice: response.data.data.maxPrice }));

                        getBrands(dispatch);
                        getColors(dispatch);
                    }
                }).catch(error => {
                    if (error.response && error.response.data.status === false) {
                        dispatch(setServices({ services: servicesData }));
                    }
                }).finally(() => {
                    setTimeout(() => {
                        dispatch(setLoading({ loading: false }));
                    }, 300);
                });
            } else {
                let selectedCat = catSelectedOption.value === '' ? [] : [catSelectedOption.value];
                reqBody.category_filter = selectedCat;
                reqBody.sorting = { sort_type: 'popular', sort_val: '' };
                reqBody.count = { start: 0, limit: 9 };
                dispatch(setServiceReqBody({ reqBody: reqBody }));
            }

            getCategories(catSelectedOption.value);
            let url = '/service-listing?cat=' + catSelectedOption.value + '&search=' + searchOption
            history.push(url);
        }
    }

    useEffect(() => {
        authVerification(dispatch);
        if (flag === false) {
            let catId = /cat=([^&]+)/.exec(location.search) !== null ? /cat=([^&]+)/.exec(location.search)[1] : '';
            // let subCatId = /subcat=([^&]+)/.exec(location.search) !== null ? /subcat=([^&]+)/.exec(location.search)[1] : '';
            // let prodReqBody = JSON.parse(JSON.stringify({...productReqBody}));
            // if (subCatId !== '') {
            //     prodReqBody.sub_category_filter = [subCatId];
            // } else {
            //     prodReqBody.sub_category_filter = [];
            // }

            // dispatch(setReqBody({reqBody: prodReqBody}));
            getCategories(catId);
            setFlag(true);
        }

        if (isToggle === false) {
            if (location.pathname === '/service-listing') {
                dispatch(setIsService({ isService: 1 }))
            } else if (location.pathname === '/product-listing') {
                dispatch(setIsService({ isService: 0 }))
            }
        }

        let requestBody = isService === 0 ? { is_service: false } : { is_service: true };

        axios.post('front/product/categories/menu', requestBody).then(response => {
            if (response.data.status) {
                setData(response.data.data);
            } else {
                toast.error(response.data.message);
            }
        }).catch(error => {
            console.log(error);
        });

        // Get categories
        axios.post('front/product/categories/search', requestBody).then(response => {
            if (response.data.status) {
                let options = [];
                options.push({ label: 'All', value: '' });
                response.data.data.forEach(category => {
                    options.push({
                        label: category.categoryName,
                        value: category.id
                    })
                });

                setCategoryOptions(options);
                options.forEach(item => {
                    if (item.value === readUrlResult.catId) {
                        setCatSelectedOption(item);
                    }
                });

                if (!productCategories.length) {
                    if (isService === 0) {
                        // dispatch(setCategories({categories: options}));
                    } else {
                        dispatch(setServiceCategories({ categories: options }));
                    }
                }
            } else {
                toast.error(response.data.message);
            }
        }).catch(error => {
            console.log(error);
        });
    }, [dispatch, productCategories, readUrlResult.catId, isService, location, isToggle, flag]);

    const cart = useSelector((state) => state.cart)
    localStorage.setItem('cart', cart);
    const getTotalQuantity = () => {
        let total = 0
        if (!loginStatus) {
            return total;
        }
        //console.log('loginStatus='+loginStatus);

        Object.keys(cart).forEach(item => {
            let cartItems = cart[item];
            for (const key in cartItems) {
                total += cartItems[key].quantity
            }

            //total += item.quantity
        })
        localStorage.setItem('totalQuantity', total);
        return total
    }
    return (
        <React.Fragment>
            {loginModal && <LoginModal onloginHide={closemodalHandler} onregisterShow={showregisterHandler} onForgotShow={showForgotHandler} />}
            {registerModal && <RegisterModal onregisterHide={hideregisterHandler} onloginShow={openmodalHandler} />}
            {forgotModal && <ForgotPwdModal onForgotHide={hideForgotHandler} onForgotShow={showForgotHandler} />}
            {resetModal && <ResetPwdModal onResetPwdHide={hideRestPwdHandler} onRestPwdShow={showRestPwdHandler} onloginShow={openmodalHandler} onForgotShow={showForgotHandler} />}

            {loginStatus &&
                <div className="offcanvas offcanvas-start side_menu_wrap" tabIndex="-1" id="sideMenu" aria-labelledby="sideMenuLabel">
                    <div className="offcanvas-header">
                        <button type="button" className="view_more text-reset" data-bs-dismiss="offcanvas" aria-label="Close"><img src={closeIcon} className="img-fluid" alt="close_icon" /> Close</button>
                    </div>
                    <div className="offcanvas-body">
                        <div className="side_menu_body">
                            <ul className="side_menu_links">
                                <li><Link to="/my-orders" onClick={() => removeBackdrop()}><i className="icon"><img src={shoppingBagIcon} alt="" /></i> Orders</Link></li>
                                <li><Link to="/my-payments" onClick={() => removeBackdrop()}><i className="icon"><img src={creditCardIcon} alt="credit-card" /></i> Payments</Link></li>
                                <li><Link to="/notifications"><i className="icon"><img src={notificationBellIcon} alt="notification-bell" /></i> Notifications</Link></li>
                                <li><Link to="/chat"><i className="icon"><img src={chatIcon} alt="chat" /></i> Chats</Link></li>
                                <li><Link to="/my-coupons" onClick={() => removeBackdrop()}><i className="icon"><img src={couponIcon} alt="coupon" /></i> My Coupons</Link></li>
                                <li><Link to="/my-wishlist" onClick={() => removeBackdrop()}><i className="icon"><img src={heartIcon} alt="heart" /></i> Wish List</Link></li>
                                <li><Link to="/savelater" onClick={() => removeBackdrop()}><i className="icon"><img src={heartIcon} alt="heart" /></i> Savelater List</Link></li>
                                <li><Link to="#" onClick={() => logout()}><i className="icon"><img src={logoutIcon} alt="logout" /></i> Logout</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            }

            <header className="header">
                <div className="container">
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="top_bar">
                                {loginStatus && userInfo.role === 'user' ? <button className="btn btn-primary rounded-0 h-100" type="button" data-bs-toggle="offcanvas" data-bs-target="#sideMenu" aria-controls="sideMenu"><span className="fa fa-bars"></span></button> : ''}
                                <div className="nav_wrapper">
                                    <ul>
                                        {
                                            JSON.parse(localStorage.getItem('isLoggedIn')) &&
                                            <li><Link to="/community">Community</Link></li>
                                        }
                                        <li><Link to="/user-contact">Contact</Link></li>
                                        <li><Link to="/blog-model">Blog</Link></li>
                                        <li><Link to="/page-model">Page</Link></li>
                                    </ul>
                                    <ul>
                                        <li className="login_links_wrapper me-3">
                                            {loginStatus && userInfo.role === 'user' ?
                                                <Link to="#" className="login_link position-relative">{userInfo !== undefined ? userInfo.name : ''}</Link> :
                                                <Link to="#" className="login_link position-relative">Login/Register</Link>
                                            }
                                            <div className="login_options">
                                                {loginStatus && userInfo.role === 'user' ?
                                                    <ul className="shadow">
                                                        <li><Link to="/my-profile">My Profile</Link></li>
                                                        <li><Link to="#" onClick={logout}>Logout</Link></li>
                                                    </ul> :
                                                    <ul className="shadow">
                                                        <li><Link to="#" onClick={openmodalHandler}>Login As Buyer</Link></li>
                                                        <li><Link to="/seller/login">Login As Seller</Link></li>
                                                        {/* <li><Link to="/admin/login">Login As Admin</Link></li> */}
                                                    </ul>
                                                }
                                            </div>
                                        </li>
                                        <li>
                                            <Link to="#" className="cart_link position-relative" onClick={() => { if (loginStatus) { history.push('/my-cart') } else { return false } }}>{getTotalQuantity() || 0} Cart</Link>
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
                                        <Link className="navbar-brand py-0" to="/"><img src={logo} alt="logo" className="img-fluid" /></Link>
                                        <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar"><span className="fa fa-bars"></span></button>
                                        <div className="offcanvas offcanvas-end" tabIndex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
                                            <div className="offcanvas-header">
                                                <button type="button" className="btn-close text-reset ms-auto" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                                            </div>
                                            <div className="offcanvas-body d-block">
                                                <div className="nav_wrapper w-100 mt-2">
                                                    <form className="d-lg-flex">
                                                        <Select
                                                            className="custom_select w-50"
                                                            options={categoryOptions}
                                                            value={catSelectedOption}
                                                            onChange={handleCatChange}
                                                            placeholder={<div>Select</div>}
                                                        />

                                                        <input className="form-control border-start height-auto" type="search" placeholder={isService === 0 ? "Search Product..." : "Search Service..."} value={searchOption} onChange={handleSearchInput} />
                                                        <button className="btn btn_dark" type="button" onClick={handleSearch}>Search</button>
                                                    </form>
<<<<<<< HEAD
                                                    
                                                    

=======
                                                    <Link className="btn btn_yellow mx-2" to="/blog-model"> Blog</Link>
                                                    <Link className="btn btn_yellow mx-2" to="/page-model"> Page</Link>
>>>>>>> 2037050c91b1fe7ad972e42de68244346d65e721
                                                    <div className="btn-group" role="group" aria-label="Basic example">
                                                        <button type="button" value="0" className={isService === 0 ? "btn custom_btn active" : "btn custom_btn"} onClick={handleIsService} >Products</button>
                                                        <button type="button" value="1" className={isService === 1 ? "btn custom_btn active" : "btn custom_btn"} onClick={handleIsService} >Services</button>
                                                    </div>
                                                </div>

                                                <ul className="navbar-nav justify-content-end flex-grow-1 pe-0">
                                                    {data && data.length ?
                                                        data.map((value, index) => {
                                                            let url = `product-listing?cat=${value._id}`;
                                                            return <li className="nav-item dropdown" key={index}>
                                                                <Link className="nav-link dropdown-toggle" to={url} id="offcanvasNavbarDropdown" aria-expanded="false">{value.name}</Link>
                                                                {subCategories(value['_id'], value.subCategories)}
                                                            </li>
                                                        }) : ''
                                                    }
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