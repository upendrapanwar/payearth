import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "font-awesome/css/font-awesome.css";
import "react-toastify/dist/ReactToastify.css";
import "./assets/css/style.css";
import "./assets/css/sel_style.css";
import "./assets/css/responsive.css";
import "./assets/css/checkout.css";
import "./assets/css/myStyle.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Elements, StripeProvider } from "react-stripe-elements";
import Home from "./containers/user/Home";
import ProductListing from "./containers/user/ProductListing";
import ProductDetail from "./containers/user/ProductDetail";
import ServicesDisplay from "./containers/user/service/ServicesDisplay";
// import ServiceListing from "./containers/user/service/ServiceListing";
import ServicesListing from "./containers/user/ServicesListing";
import ServiceDetail from "./containers/user/service/ServiceDetails";
import MyOrders from "./containers/user/MyOrders";
import MyCart from "./containers/user/MyCart";
import CheckOut from '../src/containers/user/productCheckout/checkOut';
import CheckOutCompletePage from "./containers/user/productCheckout/checkoutComplete";
import MyWishlist from "./containers/user/MyWishlist";
import SaveLaterlist from "./containers/user/SaveLaterlist";
import MyProfile from "./containers/user/MyProfile";
import OrderDetail from "./containers/user/OrderDetail";
import MyPayments from "./containers/user/MyPayments";
import UserContact from "./containers/user/Contact";
import MyBanner from "./containers/user/MyBanners";
import CreateNewBanner from "./containers/user/CreateBanner";
import MyBannerEdit from "./containers/user/MyBannerEdit";
import ManageDeals from "./containers/seller/CreateDeals";

import Notifications from "./containers/user/Notifications";
import Chat from "./containers/user/Chat";
import MyCoupons from "./containers/user/MyCoupons";
import OrderSummary from "./containers/user/OrderSummary";
import PrivateRoute from "./components/common/PrivateRoute";
import PublicRoute from "./components/common/PublicRoute";
import PageNotFound from "./components/common/PageNotFound";
import Role from "./helpers/role";
import { useSelector } from "react-redux";

import SellerLogin from './containers/seller/login';
import SellerRegister from './containers/seller/Register';
import SellerResetPwd from './containers/seller/ResetPassword';
import SellerForgotPwd from './containers/seller/ForgotPassword';
import ProductStockManagement from './containers/seller/ProductStockManagement';
import SellerChat from './containers/seller/Chat';
import ServiceStockManagement from './containers/seller/ServiceStockManagement';
import AddProduct from './containers/seller/AddProduct';
import AddService from './containers/seller/AddService';
import SellerDashboard from './containers/seller/SellerDashboard';
import ProductOrders from './containers/seller/ProductOrders';
import ServiceOrders from './containers/seller/ServiceOrders';
import ListedProducts from './containers/seller/ListedProducts';
import Contact from './containers/seller/Contact';
import Payments from './containers/seller/Payments';
import ManagePaymentDetails from './containers/admin/ManagePaymentDetails';
import SellerProductDetail from './containers/seller/ProductDetail';
import SellerServiceDetail from './containers/seller/ServiceDetail';
import SellerOrderDetail from './containers/seller/OrderDetail';
import SellerManageBannerAdvertisement from './containers/seller/ManageBannerAdvertisement';
import SellerBannerList from './containers/seller/ManageBannerList';
import SellerBannerEdit from './containers/seller/ManageBannerListEdit';
import AdvertiseShare from "./components/common/AdvertiseShare";
import SellerManageSubscription from "./containers/seller/ManageSubscriptionPlan";
import SellerCommunity from "./containers/community/sellerCommunity";


import AdminLogin from "./containers/admin/Login";
import AdminRegister from "./containers/admin/Register";
import AdminForgotPwd from "./containers/admin/ForgotPassword";
import AdminResetPwd from "./containers/admin/ResetPassword";
import AdminProductOrders from "./containers/admin/AdminProductOrders";
import AdminServiceOrders from "./containers/admin/AdminServiceOrders";
import AdminDashboard from "./containers/admin/Dashboard";
import AdminPayments from "./containers/admin/Payments";
import AdminChat from "./containers/admin/Chat";
import ManageCommunityPost from "./containers/admin/ManageCommunityPost";

import AdminPostModule from "./containers/admin/PostModule";
import AdminPostModuleAddNew from "./containers/admin/PostModuleAddNew";
import AdminPostEdit from "./containers/admin/PostModelEdit";

import AdminPageModule from "./containers/admin/PageModule";
import AdminPageModuleAddNew from "./containers/admin/PageModuleAddNew";
import AdminPageEdit from "./containers/admin/PageModelEdit";

import AdminCategoryModel from "./containers/admin/CategoryModule";
import AdminCategoryModelEdit from "./containers/admin/CategoryModuleEdit";

import ManageOrderDetails from "./containers/admin/ManageOrderDetails";
import ManageProducts from "./containers/admin/ManageProducts";
import ManageProductDetails from "./containers/admin/ManageProductDetails";
import ManageServices from "./containers/admin/ManageServices";
import ManageServiceDetails from "./containers/admin/ManageServiceDetails";
import ManageNotifications from "./containers/admin/ManageNotifications";
import ManageCustomers from "./containers/admin/ManageCustomers";
import ManageCommunity from "./containers/admin/ManageCommunity";
import ManageReports from "./containers/admin/ManageReports";
import ManageReportsServices from "./containers/admin/ManageReportsServices";
import ManageBannerAdvertisement from "./containers/admin/ManageBannerAdvertisement";
import ManageBannerList from "./containers/admin/ManageBannerList";
import ManageBannerListEdit from "./containers/admin/ManageBannerListEdit";

import ManageProductsCategory from "../src/containers/admin/ManageProductsCategory";
import ManageServiceCategory from "../src/containers/admin/ManageServiceCategory";
import ManageBrands from "./containers/admin/ManageBrands";

import AdminManageSubPlan from "./containers/admin/ManageSubscriptionPlan";

import AdminEditService from "./containers/admin/EditService";

import Support from "./containers/admin/SupportAdmin";

// import Services from './containers/seller/Services';
import EditService from "./containers/seller/EditService";
import ServiceCheckoutStripe from "./containers/seller/ServiceCheckoutStripe";
import AddCoupon from "./containers/admin/AddCoupon";
import CouponsListing from "./containers/admin/CouponsListing";
import EditProduct from "./containers/seller/EditProduct";
import ManageVendors from "./containers/admin/ManageVendors";
import SellerNotifications from "./containers/seller/Notifications";
import Community from "./containers/community/Community";
import CommunityProfile from "./containers/community/CommunityProfile";
import SellerProfile from "./containers/community/SellerProfile";
import SharePostData from "./components/community/common/SharePostData";
import SellerSharePostData from "./components/community/common/SellerSharePostData";
import AdminSharePostData from "./components/community/common/AdminSharePostData";

import Blog from "./components/common/BlogModel";
import BlogDetail from "./components/common/BlogDetails";
import PageModel from "./components/common/PageModel";
import PageDetail from "./components/common/PageDetails";

import Zoom from "./components/user/common/services/zoom/Zoom";
import ScrollToTopButton from "./containers/user/ScrollToTopButton";
// import BannerCheckOut from './containers/user/BannerCheckOut';
import StripePaymentForms from "./containers/user/paymentCheckoutStripe";
import StripePaymentForm from "./containers/user/paymentCheckoutStripe";
import ServiceOrder from "./containers/user/service/ServiceOrder";
import adminAddService from './containers/admin/AddService';
import AdminProfile from "./containers/community/AdminProfile";
import SupportUser from "./containers/user/SupportUser";
import SupportSeller from "./containers/seller/SupportSeller";
import SupportUserEmail from "./containers/user/SupportUserEmail";
import { SupportSellerEmail } from "./containers/seller/SupportSellerEmail";
import { SupportUserCall } from "./containers/user/SupportUserCall";
import { SupportSellerCall } from "./containers/seller/SupportSellerCall";
import { SupportAdminCall } from "./containers/admin/SupportAdminCall";
import SupportAdmin from "./containers/admin/SupportAdmin";
import { SellerMyProfile } from "./containers/seller/SellerMyProfile";
import AdminMyProfile from "./containers/admin/AdminMyProfile";
import SupportTicketSeller from "./containers/seller/SupportTicketSeller";
import SupportTicketChat from "./containers/seller/SupportTicketChat";
import ManageAdmins from "./containers/admin/ManageAdmins";
import AddAdmin from "./containers/admin/AddAdmin"
import AccessPermission from "./containers/admin/AccessPermission";
import ManageCapability from "./containers/admin/ManageCapability";
import EditCoupon from "./containers/admin/EditCoupon";



import DealListedItems from "./components/user/home/DealListedItems";
import AdminManageDeals from "./containers/admin/ManageDeals"
     

function App() {
  const userInfo = useSelector((state) => state.auth.userInfo);

  return (
    <div className="App">
      <Router>
        <ScrollToTopButton />
        <Switch>
          <PublicRoute
            path="/"
            restricted={false}
            component={Home}
            exact
          />

          <PublicRoute
            path="/product-listing"
            restricted={false}
            component={ProductListing}
            exact
          />

          <PublicRoute
            path="/product-detail/:id"
            restricted={false}
            component={ProductDetail}
            exact
          />


          <PublicRoute
            path="/service-display"
            restricted={false}
            component={ServicesDisplay}
            exact
          />

          {/* <PublicRoute
            path="/service-listing"
            restricted={false}
            component={ServiceListing}
            exact
          /> */}

          <PublicRoute
            path="/service-listing"
            restricted={false}
            component={ServicesListing}
            exact
          />

          <PublicRoute
            path="/service-detail/:id"
            restricted={false}
            component={ServiceDetail}
            exact
          />

          <PublicRoute
            path="/my-cart"
            restricted={false}
            component={MyCart}
            exact
          />

          {/* Product orderCheckout */}
          <PrivateRoute
            path="/orderCheckout"
            restricted={false}
            component={CheckOut}
            exact
          />

          <PrivateRoute
            path="/checkOutCompletePage"
            restricted={false}
            component={CheckOutCompletePage}
            exact
          />

          <PrivateRoute
            path="/notifications"
            restricted={false}
            component={Notifications}
            exact
          />

          <PrivateRoute
            path="/chat"
            restricted={false}
            component={Chat}
            exact
          />

          <PublicRoute
            path="/user-contact"
            restricted={false}
            component={UserContact}
            exact
          />

          <PrivateRoute
            path="/user-support"
            restricted={false}
            component={SupportUser}
            exact
          />

          <PrivateRoute
            path="/user-support-email"
            restricted={false}
            component={SupportUserEmail}
            exact
          />

          <PrivateRoute
            path="/my-profile"
            component={MyProfile}
            roles={[Role.user]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/my-coupons"
            component={MyCoupons}
            roles={[Role.user]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/my-wishlist"
            component={MyWishlist}
            roles={[Role.user]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/savelater"
            component={SaveLaterlist}
            roles={[Role.user]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/service-order"
            component={ServiceOrder}
            roles={[Role.user]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/my-orders"
            component={MyOrders}
            roles={[Role.user]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/my-banners"
            component={MyBanner}
            roles={[Role.user]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/create-banner"
            component={CreateNewBanner}
            roles={[Role.user]}
            currentUserRole={userInfo.role}
            exact
          />

          {/* <PublicRoute path="/bannerCheckout" restricted={false} component={BannerCheckOut} exact /> */}
          {/* <PublicRoute
            path="/bannerCheckout"
            restricted={false}
            component={StripePaymentForms}
            exact
          /> */}

          <PrivateRoute
            path="/service_Charge_Checkout"
            restricted={false}
            component={StripePaymentForm}
            exact
          />

          <PrivateRoute
            path="/user/banner-edit/:id"
            component={MyBannerEdit}
            roles={[Role.user]}
            currentUserRole={userInfo.role}
            exact />

          <PrivateRoute
            path="/user/support-call"
            component={SupportUserCall}
            roles={[Role.user]}
            currentUserRole={userInfo.role}
            exact />

          <PrivateRoute
            path="/order-detail/:id"
            component={OrderDetail}
            roles={[Role.user]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/my-payments"
            component={MyPayments}
            roles={[Role.user]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/order-summary/:id"
            component={OrderSummary}
            roles={[Role.user]}
            currentUserRole={userInfo.role}
            exact
          />

          {/* ManageDeals */}

          <PrivateRoute
            path="/seller/manage_deals"
            component={ManageDeals}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          {/* Seller routes */}
          <PublicRoute
            path="/seller/login"
            restricted={false}
            component={SellerLogin}
            exact
          />

          <PublicRoute
            path="/seller/register"
            restricted={false}
            component={SellerRegister}
            exact
          />

          <PrivateRoute
            path="/seller/reset-password"
            restricted={false}
            component={SellerResetPwd}
            exact
          />

          <PublicRoute
            path="/seller/forgot-password"
            restricted={false}
            component={SellerForgotPwd}
            exact
          />

          <PrivateRoute
            path="/seller/dashboard"
            component={SellerDashboard}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          {/* SellerManageSubscription */}
          <PrivateRoute
            path="/seller/manage-subscription-plan"
            component={SellerManageSubscription}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/manage-banner-advertisement"
            component={SellerManageBannerAdvertisement}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/manage-banner-list"
            component={SellerBannerList}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/banner-edit/:id"
            component={SellerBannerEdit}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/product-stock-management"
            component={ProductStockManagement}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/Notifications"
            component={SellerNotifications}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/chat"
            component={SellerChat}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/service-stock-management"
            component={ServiceStockManagement}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/add-product"
            component={AddProduct}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/edit-product/:id"
            component={EditProduct}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/product-orders"
            component={ProductOrders}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/service-orders"
            component={ServiceOrders}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/listed-items"
            component={ListedProducts}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/contact"
            component={Contact}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/payments"
            component={Payments}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/product-detail/:id"
            component={SellerProductDetail}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/service-detail/:id"
            component={SellerServiceDetail}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/order-detail/:id"
            component={SellerOrderDetail}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/add-service"
            component={AddService}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/service-checkout"
            component={ServiceCheckoutStripe}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/edit-service/:id"
            component={EditService}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/support"
            component={SupportSeller}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/seller-support-email"
            component={SupportSellerEmail}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/seller/support-call"
            component={SupportSellerCall}
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            exact
          />


          {/* Admin routes */}
          <PublicRoute
            path="/admin/login"
            restricted={false}
            component={AdminLogin}
            exact
          />

          <PublicRoute
            path="/admin/register"
            restricted={false}
            component={AdminRegister}
            exact
          />

          <PrivateRoute
            path="/admin/forgot-password"
            restricted={false}
            component={AdminForgotPwd}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/reset-password"
            restricted={false}
            component={AdminResetPwd}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/add-admin"
            restricted={false}
            component={AddAdmin}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/access-permission"
            restricted={false}
            component={AccessPermission}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/payments"
            restricted={false}
            component={AdminPayments}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-community-post"
            restricted={false}
            component={ManageCommunityPost}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/post-module"
            restricted={false}
            component={AdminPostModule}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/post-module-add-new"
            restricted={false}
            component={AdminPostModuleAddNew}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/post-module-edit/:id"
            restricted={false}
            component={AdminPostEdit}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/page-module"
            restricted={false}
            component={AdminPageModule}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/page-module-add-new"
            restricted={false}
            component={AdminPageModuleAddNew}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/page-module-edit/:id"
            restricted={false}
            component={AdminPageEdit}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/category-module"
            restricted={false}
            component={AdminCategoryModel}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/category-module-edit/:id"
            restricted={false}
            component={AdminCategoryModelEdit}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-payment-details/:id"
            restricted={false}
            component={ManagePaymentDetails}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/chat"
            restricted={false}
            component={AdminChat}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-order-details/:id"
            restricted={false}
            component={ManageOrderDetails}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-products"
            restricted={false}
            component={ManageProducts}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-product-details/:id"
            restricted={false}
            component={ManageProductDetails}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-services"
            restricted={false}
            component={ManageServices}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-categories-product"
            restricted={false}
            component={ManageProductsCategory}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-brands"
            restricted={false}
            component={ManageBrands}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-categories-services"
            restricted={false}
            component={ManageServiceCategory}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-service-details"
            restricted={false}
            component={ManageServiceDetails}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-community"
            component={ManageCommunity}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-admins"
            component={ManageAdmins}
            roles={[Role.super_admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-reports"
            component={ManageReports}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-reports-services"
            component={ManageReportsServices}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-notifications"
            restricted={false}
            component={ManageNotifications}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-customers"
            restricted={false}
            component={ManageCustomers}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/productOrders"
            component={AdminProductOrders}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/Service-order"
            component={AdminServiceOrders}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/dashboard"
            component={AdminDashboard}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/add-coupon"
            component={AddCoupon}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/edit-coupon"
            component={EditCoupon}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/coupons"
            component={CouponsListing}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-vendors"
            component={ManageVendors}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          {/* <PrivateRoute
            path="/admin/manage-community-post"
            component={ManageCommunityPost}
             roles={[Role.super_admin, Role.admin]}
            currentUserRole={userInfo.role}
            exact
          /> */}

          <PrivateRoute
            path="/admin/add-service"
            component={adminAddService}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />
          {/* Community Routes */}
          <PrivateRoute
            path="/admin/manage-banner-advertisement"
            component={ManageBannerAdvertisement}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-support"
            component={SupportAdmin}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/support-call"
            component={SupportAdminCall}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-banner-list"
            component={ManageBannerList}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-banner-list-edit/:id"
            component={ManageBannerListEdit}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/admin-manage-subscriptionplan"
            component={AdminManageSubPlan}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/admin-manage-Capabilities"
            component={ManageCapability}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />
          {/* AdminManageSubPlan */}

          <PrivateRoute path="/admin/edit-service/:id"
            component={AdminEditService}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/community"
            restricted={false}
            component={Community}
            exact
          />

          <PrivateRoute
            path="/seller_community"
            restricted={false}
            component={SellerCommunity}
            exact
          />

          <PrivateRoute
            path="/community-profile"
            restricted={false}
            component={CommunityProfile}
            exact
          />

          <PrivateRoute
            path="/seller-profile"
            restricted={false}
            component={SellerProfile}
            exact
          />
          {/* SharePostDatd */}

          {/* <PublicRoute
            path="/share_community/:id"
            restricted={false}
            component={SharePostDatd}
            exact
          /> */}

          <PublicRoute
            path="/share_community/:id"
            restricted={false}
            component={SharePostData}
            exact
          />

          <PublicRoute
            path="/seller_share_community/:id"
            restricted={false}
            component={SellerSharePostData}
            exact
          />

          <PrivateRoute
            path="/seller/support_ticket_seller"
            restricted={false}
            component={SupportTicketSeller}
            exact
          />

          <PublicRoute
            path="/seller/support_ticket_message"
            restricted={false}
            component={SupportTicketChat}
            exact
          />

          <PublicRoute
            path="/admin_share_community/:id"
            restricted={false}
            component={AdminSharePostData}
            exact
          />

          <PrivateRoute
            path="/Seller-MyProfile"
            roles={[Role.seller]}
            currentUserRole={userInfo.role}
            component={SellerMyProfile}
            exact
          />

          <PublicRoute
            path="/admin-profile"
            restricted={false}
            component={AdminProfile}
            exact
          />


          <PublicRoute
            path="/admin-MyProfile"
            restricted={false}
            component={AdminMyProfile}
            exact
          />

          {/* Blog */}
          <PublicRoute
            path="/blog"
            restricted={false}
            component={Blog}
            exact
          />

          <PublicRoute
            path="/blog-detail/:slug"
            restricted={false}
            component={BlogDetail}
            exact
          />

          {/* Advertise Share */}
          <PublicRoute
            path="/advertisement/:slug"
            restricted={false}
            component={AdvertiseShare}
            exact
          />

          {/* PageDetail */}
          <PublicRoute
            path="/page"
            restricted={false}
            component={PageModel}
            exact
          />

          <PublicRoute
            path="/page/:slug"
            restricted={false}
            component={PageDetail}
            exact
          />

          <PrivateRoute
            path="/zoom-authentication"
            component={Zoom}
            roles={[Role.user]}
            currentUserRole={userInfo.role}
            exact
          />

          <PublicRoute
            path="/deal-ofthe-day"
            restricted={false}
            component={DealListedItems}
            exact
          />

          <PrivateRoute
            path="/admin/manage_deals"
            component={AdminManageDeals}
            roles={[Role.super_admin, Role.admin, Role.manager]}
            currentUserRole={userInfo.role}
            exact
          />

          {/* Not found */}
          <Route component={PageNotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
