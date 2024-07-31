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
import ServiceListing from "./containers/user/service/ServiceListing";
import ServiceDetail from "./containers/user/service/ServiceDetails";
import MyOrders from "./containers/user/MyOrders";
import MyCart from "./containers/user/MyCart";
import CheckOut from "./containers/user/CheckOut";
import MyWishlist from "./containers/user/MyWishlist";
import SaveLaterlist from "./containers/user/SaveLaterlist";
import MyProfile from "./containers/user/MyProfile";
import OrderDetail from "./containers/user/OrderDetail";
import MyPayments from "./containers/user/MyPayments";
import UserContact from "./containers/user/Contact";
import MyBanner from "./containers/user/MyBanners";
import CreateNewBanner from "./containers/user/CreateBanner";
import MyBannerEdit from "./containers/user/MyBannerEdit";

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


import AdminLogin from "./containers/admin/Login";
import AdminRegister from "./containers/admin/Register";
import AdminForgotPwd from "./containers/admin/ForgotPassword";
import AdminResetPwd from "./containers/admin/ResetPassword";
import AdminOrders from "./containers/admin/Orders";
import AdminServiceOrders from "./containers/admin/ServiceOrder";
import AdminDashboard from "./containers/admin/Dashboard";
import AdminPayments from "./containers/admin/Payments";
import AdminChat from "./containers/admin/Chat";

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


import AdminManageSubPlan from "./containers/admin/ManageSubscriptionPlan";

import AdminEditService from "./containers/admin/EditService";

import ManageSupport from "./containers/admin/ManageSupport";

// import Services from './containers/seller/Services';
import EditService from "./containers/seller/EditService";
import ServiceCheckoutStripe from "./containers/seller/ServiceCheckoutStripe";
import AddCoupon from "./containers/admin/AddCoupon";
import CouponsListing from "./containers/admin/CouponsListing";
import EditProduct from "./containers/seller/EditProduct";
import ManageVendors from "./containers/admin/ManageVendors";
import Community from "./containers/community/Community";
import CommunityProfile from "./containers/community/CommunityProfile";

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
import ManageCategories from "./containers/admin/ManageCategories";


function App() {
  const userInfo = useSelector((state) => state.auth.userInfo);

  return (
    <div className="App">
      <Router>
        <ScrollToTopButton />
        <Switch>
          <PublicRoute path="/" restricted={false} component={Home} exact />
          <PublicRoute path="/product-listing" restricted={false} component={ProductListing} exact />
          <PublicRoute
            path="/product-detail/:id"
            restricted={false}
            component={ProductDetail}
            exact
          />
          <PublicRoute path="/service-display" restricted={false} component={ServicesDisplay} exact />
          <PublicRoute path="/service-listing" restricted={false} component={ServiceListing} exact />
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
          <PublicRoute
            path="/checkout"
            restricted={false}
            component={CheckOut}
            exact
          />

          <PublicRoute
            path="/notifications"
            restricted={false}
            component={Notifications}
            exact
          />

          <PublicRoute path="/chat" restricted={false} component={Chat} exact />

          <PublicRoute
            path="/user-contact"
            restricted={false}
            component={UserContact}
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

          <PublicRoute
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
          <PublicRoute
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

          <PrivateRoute path="/seller/dashboard" component={SellerDashboard} roles={[Role.seller]} currentUserRole={userInfo.role} exact />

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
          <PublicRoute
            path="/admin/forgot-password"
            restricted={false}
            component={AdminForgotPwd}
            exact
          />
          <PublicRoute
            path="/admin/reset-password"
            restricted={false}
            component={AdminResetPwd}
            exact
          />
          <PublicRoute
            path="/admin/payments"
            restricted={false}
            component={AdminPayments}
            exact
          />

          <PrivateRoute
            path="/admin/post-module"
            restricted={false}
            component={AdminPostModule}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/post-module-add-new"
            restricted={false}
            component={AdminPostModuleAddNew}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/post-module-edit/:id"
            restricted={false}
            component={AdminPostEdit}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/page-module"
            restricted={false}
            component={AdminPageModule}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/page-module-add-new"
            restricted={false}
            component={AdminPageModuleAddNew}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/page-module-edit/:id"
            restricted={false}
            component={AdminPageEdit}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/category-module"
            restricted={false}
            component={AdminCategoryModel}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/category-module-edit/:id"
            restricted={false}
            component={AdminCategoryModelEdit}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-payment-details/:id"
            restricted={false}
            component={ManagePaymentDetails}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/chat"
            restricted={false}
            component={AdminChat}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-order-details/:id"
            restricted={false}
            component={ManageOrderDetails}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-products"
            restricted={false}
            component={ManageProducts}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-product-details"
            restricted={false}
            component={ManageProductDetails}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-services"
            restricted={false}
            component={ManageServices}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-categories"
            restricted={false}
            component={ManageCategories}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-categories-product"
            restricted={false}
            component={ManageProductsCategory}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-categories-services"
            restricted={false}
            component={ManageServiceCategory}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-service-details"
            restricted={false}
            component={ManageServiceDetails}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-community"
            component={ManageCommunity}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />
          <PrivateRoute
            path="/admin/manage-reports"
            component={ManageReports}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />
          <PrivateRoute
            path="/admin/manage-reports-services"
            component={ManageReportsServices}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-notifications"
            restricted={false}
            component={ManageNotifications}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-customers"
            restricted={false}
            component={ManageCustomers}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/orders"
            component={AdminOrders}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/Service-order"
            component={AdminServiceOrders}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/dashboard"
            component={AdminDashboard}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/add-coupon"
            component={AddCoupon}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/coupons"
            component={CouponsListing}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-vendors"
            component={ManageVendors}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute path="/admin/add-service" component={adminAddService} roles={[Role.admin]} currentUserRole={userInfo.role} exact />
          {/* Community Routes */}
          <PrivateRoute
            path="/admin/manage-banner-advertisement"
            component={ManageBannerAdvertisement}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-support"
            component={ManageSupport}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-banner-list"
            component={ManageBannerList}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/manage-banner-list-edit/:id"
            component={ManageBannerListEdit}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />

          <PrivateRoute
            path="/admin/admin-manage-subscriptionplan"
            component={AdminManageSubPlan}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact
          />
          {/* AdminManageSubPlan */}

          <PrivateRoute path="/admin/edit-service/:id"
            component={AdminEditService}
            roles={[Role.admin]}
            currentUserRole={userInfo.role}
            exact />

          <PublicRoute
            path="/community"
            restricted={false}
            component={Community}
            exact
          />
          <PublicRoute
            path="/community-profile"
            restricted={false}
            component={CommunityProfile}
            exact
          />

          {/* Blog */}
          <PublicRoute path="/blog" restricted={false} component={Blog} exact />
          <PublicRoute path="/blog-detail/:slug" restricted={false} component={BlogDetail} exact />

          {/* Advertise Share */}
          <PublicRoute path="/advertisement/:slug" restricted={false} component={AdvertiseShare} exact />

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
          {/* Not found */}
          <Route component={PageNotFound} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
