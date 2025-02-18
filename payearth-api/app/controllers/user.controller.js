const config = require("../config/index");
const { array } = require("@hapi/joi");
const express = require("express");
const router = express.Router();
const userService = require("../services/user.service");
const {
  registerValidation,
  loginValidation,
  changePassValidation,
  forgotPassValidation,
  resetPassValidation,
  editProfileValidation,
  addReviewValidation,
  addComplaintValidation,
  addCancelValidation,
  addReturnValidation,
} = require("../validations/user.validation");
const msg = require("../helpers/messages.json");
var utils = require("../helpers/utils.js");
const multer = require("multer");

var ApiContracts = require("authorizenet").APIContracts;
var ApiControllers = require("authorizenet").APIControllers;
var SDKConstants = require("authorizenet").Constants;

//Review Files Upload
var storageReview = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.uploadDir + "/reviews");
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    let newName =
      "IMG-" +
      Math.floor(Math.random() * 1000000) +
      "-" +
      Date.now() +
      "." +
      extension;
    cb(null, newName);
  },
});

const fileFilterReview = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

var uploadReview = multer({
  storage: storageReview,
  fileFilter: fileFilterReview,
  limits: { fileSize: 1024 * 1024 * 5 },
});

//Complaint Files Upload
var storageComplaint = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.uploadDir + "/complaints");
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    let newName =
      "IMG-" +
      Math.floor(Math.random() * 1000000) +
      "-" +
      Date.now() +
      "." +
      extension;
    cb(null, newName);
  },
});

const fileFilterComplaint = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

var uploadComplaint = multer({
  storage: storageComplaint,
  fileFilter: fileFilterComplaint,
  limits: { fileSize: 1024 * 1024 * 5 },
});

//Cancel Files Upload
var storageCancel = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.uploadDir + "/cancels");
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    let newName =
      "IMG-" +
      Math.floor(Math.random() * 1000000) +
      "-" +
      Date.now() +
      "." +
      extension;
    cb(null, newName);
  },
});

const fileFilterCancel = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

var uploadCancel = multer({
  storage: storageCancel,
  fileFilter: fileFilterCancel,
  limits: { fileSize: 1024 * 1024 * 5 },
});

//Return Files Upload
var storageReturn = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, config.uploadDir + "/returns");
  },
  filename: function (req, file, cb) {
    let extArray = file.mimetype.split("/");
    let extension = extArray[extArray.length - 1];
    let newName =
      "IMG-" +
      Math.floor(Math.random() * 1000000) +
      "-" +
      Date.now() +
      "." +
      extension;
    cb(null, newName);
  },
});

const fileFilterReturn = function (req, file, cb) {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
    req.fileValidationError = "Only image files are allowed!";
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

var uploadReturn = multer({
  storage: storageReturn,
  fileFilter: fileFilterReturn,
  limits: { fileSize: 1024 * 1024 * 5 },
});

// Routes
router.post("/login", loginValidation, authenticate);
router.post("/social-login", socialLogin);
router.post("/signup", registerValidation, userRegister);
router.post("/forgot-password", forgotPassValidation, forgotPass);
router.put("/reset-password", resetPassValidation, resetPass);
router.put("/change-password/:id", changePassValidation, changePass);
router.get("/my-profile/:id", getProfileById);
router.put("/edit-profile/:id", editProfile);
router.get("/products", getProducts);
router.post("/wishlist/:id", getWishList);
router.delete("/wishlist/:id", deleteWishlist);
router.post("/remove-from-wishlist", removeProductFromWishlist);
router.post("/wishlist", addToWishlist);
router.post("/savelater", addToSaveLater);
router.post("/addtocart", addToCart);
router.post("/updatetocart", updateToCart);
router.post("/deletefromcart", deleteFromCart);
router.delete("/clearfromcart", clearFromCart);
router.put("/productReduceStock", productReduceStock);
// router.post("/updateToCartDiscountId", updateToCartDiscountId);




router.post("/savelaterlist/:id", getSaveLaterList);
router.post("/remove-from-savelater", removeProductFromSavelater);

router.get("/coupon/:couponCode", applyMyCouponCode);

router.post("/my-coupons/:id", getMyCoupons);
router.post("/coupons/new", getNewCoupons);
router.post("/coupons/checkpayment", checkPayment);
router.post("/coupons/check", checkCoupon);
router.post("/coupons/status", couponStatus);
router.post("/orders/:id", getOrders);

router.post("/saveorder", saveOrder);
router.post("/payments/:id", getPayments);
router.get("/paymentsbyid/:id", getPaymentsById);
router.get("/orders/:id", getOrderById);
router.get("/orderbyid/:id", getOrderDataById);
router.get("/orderdetails", getOrderDetails);
router.get("/orderstatus", getOrderStatus);
router.get("/ordertrackingtime", getOrderTrackingTime);
router.post("/saveordertracking", saveOrdertrackingTime);
router.post("/saveorderdetails", saveorderdetails);
router.post("/updateorderstatus", updateOrderStatus);
router.get("/sellerid/:id", getSellerByProductId);
router.post("/savepayment", savepaymentdata);

router.post("/order/reviews", uploadReview.array("images", 6), addReviewValidation, addReview);
router.post(
  "/order/complaints",
  uploadComplaint.array("images", 6),
  addComplaintValidation,
  addComplaint
);
router.post(
  "/order/cancel",
  uploadCancel.array("images", 6),
  addCancelValidation,
  addCancel
);
router.post(
  "/order/return",
  uploadReturn.array("images", 6),
  addReturnValidation,
  addReturn
);

router.post("/createUserbanners", createUserBanner);
router.get("/getBannersByUserId/:id", getBannersByUserId);
router.delete("/deleteBanner/:id", deleteBannerAdv);
router.get("/getBannerById/:id", getBannerById);
router.put("/updateBanner/:id", updateBanner);
router.put("/blockBanner/:id", blockBanner);

router.post("/createAuthorizeCustomer/payment", customerAuthorizePayment);
router.post("/schedule/payment", bannerPayment);
router.post("/create-subscription", createSubscription);
router.post("/serviceCharge", serviceCharges);
router.post("/createPaymentIntent", createPaymentIntent);
router.post("/createInvoice", createInvoice);

// Strip
router.post("/checkoutSession", checkoutSession);

router.get("/get-common-service", getAllCommonService);
router.get("/get-common-service/:id", getCommonServiceById);
router.post("/service-review", addServiceReview);
router.get("/get-service-review/:id", getServiceReviews);
router.delete("/delete-review/:id", deleteReviews);
router.post("/product-review", addProductReview);
router.delete("/delete-product-review/:id", deleteProductReview);
// router.post("/add-meeting-user/:id", addMeetByUser);
router.post("/add-calendar-event/:id", addGoogleEvent);

// router.get("/get-meeting/:id", getMeeting);
router.get("/get-calendar-event/:id", getGoogleEvent);

// router.delete("/delete-meeting/:id", delMeetingByUser);
router.put("/del-calendar-event/:id", deleteGoogleEvent);
router.get("/find-seller-available", findSellerAvailable);

router.put("/updateServiceOrders", updateServiceOrders);


router.get("/service-orders/:id", getServiceOrder);
router.get("/zoomAccessToken/:id", zoomAccessToken);
router.get("/zoomRefreshToken", zoomRefreshToken);

router.post("/createZoomMeeting", createZoomMeeting);


// TEST 
router.post("/zoomCreateUserToken", zoomCreateUserToken);

router.post("/createZoomUser", createZoomUser)

router.get("/getData", getData);

router.get("/getAllUser", getAllUser);
router.post("/accessChat", accessChat);
router.post("/createGroupChat", createGroupChat);
router.get("/fetchChat/:id", fetchChat);
router.get("/fetchBlockChat/:id", fetchBlockChat);
router.post("/sendMessage", sendMessage)
router.get("/allMessages/:id", allMessages);
router.put("/userChatBlock/:id", userChatBlock);
router.put("/userUnblockChat/:id", userUnblockChat);
router.put("/messageDelete/:id", chatMessageDelete);
router.put("/removeFromGroup", removeFromGroup);
router.put("/addGroupMember/:id", addGroupMember);
router.put("/updateGroupName", updateGroupName);

router.post("/add-notification", addNotification);
router.get("/get-notification/:id", getNotification);
router.patch("/update-notification/:id", updateNotification);
router.delete("/removeNotification/:id", removeNotification);
router.post("/user-contact-us", userContactUs);
router.post("/user-support-email", userSupportEmail);
router.post("/support/request-call", supportReqCall);
router.put("/save-user-myprofile/:id", saveMyProfile);
router.get("/getProductOrder/:id", getProductOrder);


router.get("/getCartData/:id", getCartData);
router.post("/updateCartData", updateCartData);

module.exports = router;

function userRegister(req, res, next) {
  userService
    .userRegister(req.body)
    .then((user) =>
      user
        ? res.status(201).json({
          status: true,
          message: msg.user.signup.success,
          data: user,
        })
        : res
          .status(400)
          .json({ status: false, message: msg.user.signup.error })
    )
    .catch((err) =>
      next(res.status(400).json({ status: false, message: err }))
    );
}

function authenticate(req, res, next) {
  userService
    .authenticate(req.body)
    .then((user) =>
      user
        ? user && user.isActive == true
          ? res.json({
            status: true,
            message: msg.user.login.success,
            data: user,
          })
          : res
            .status(400)
            .json({ status: false, message: msg.user.login.active })
        : res.status(400).json({ status: false, message: msg.user.login.error })
    )
    .catch((err) => next(err));
}

function socialLogin(req, res, next) {
  userService
    .socialLogin(req)
    .then((user) =>
      user
        ? user && user.isActive == true
          ? res.json({
            status: true,
            message: msg.user.login.success,
            data: user,
          })
          : res
            .status(400)
            .json({ status: false, message: msg.user.login.active })
        : res.status(400).json({ status: false, message: msg.user.login.error })
    )
    .catch((err) => next(err));
}

function forgotPass(req, res, next) {
  userService
    .forgotPass(req.body)
    .then((user) =>
      user
        ? res
          .status(200)
          .json({ status: true, message: msg.user.password.verif_link })
        : res
          .status(400)
          .json({ status: false, message: msg.user.password.email_exist })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function resetPass(req, res, next) {
  userService
    .resetPass(req.body)
    .then((user) =>
      user
        ? res
          .status(200)
          .json({ status: true, message: msg.user.password.reset_success })
        : res
          .status(400)
          .json({ status: false, message: msg.user.password.verif_link_err })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function changePass(req, res, next) {
  userService
    .changePass(req.params.id, req.body)
    .then((user) =>
      user
        ? res.json({ status: true, message: msg.user.password.update_success })
        : res
          .status(404)
          .json({ status: false, message: msg.common.no_user_err })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function getProducts(req, res, next) {
  userService
    .getProducts()
    .then((products) =>
      products
        ? res.status(200).json({ status: true, data: products })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function getProfileById(req, res, next) {
  userService
    .getProfileById(req.params.id)
    .then((user) =>
      user
        ? res.status(200).json({ status: true, data: user })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function editProfile(req, res, next) {
  userService
    .editProfile(req.params.id, req.body)
    .then((user) =>
      user
        ? res.status(200).json({
          status: true,
          data: user,
          message: msg.user.profile.update_success,
        })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_user_err })
    )
    .catch((err) =>
      next(res.status(400).json({ status: false, message: err }))
    );
}

function getOrders(req, res, next) {
  userService
    .getOrders(req)
    .then((orders) =>
      orders
        ? res.status(200).json({ status: true, data: orders })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function getWishList(req, res, next) {
  userService
    .getWishList(req)
    .then((wishlist) =>
      wishlist
        ? res.status(200).json({ status: true, data: wishlist })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function getSaveLaterList(req, res, next) {
  userService
    .getSaveLaterList(req)
    .then((savelater) =>
      savelater
        ? res.status(200).json({ status: true, data: savelater })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function deleteWishlist(req, res, next) {
  userService
    .deleteWishlist(req.params.id)
    .then((wishlist) =>
      wishlist
        ? res.json({ status: true, message: msg.user.wishlist.delete })
        : res.json({ status: false, message: msg.common.no_data_err })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function removeProductFromWishlist(req, res, next) {
  userService
    .removeProductFromWishlist(req)
    .then((wishlist) =>
      wishlist
        ? res.json({ status: true, message: msg.user.wishlist.delete })
        : res.json({ status: false, message: msg.common.no_data_err })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function removeProductFromSavelater(req, res, next) {
  userService
    .removeProductFromSavelater(req)
    .then((savelater) =>
      savelater
        ? res.json({ status: true, message: msg.user.savelater.delete })
        : res.json({ status: false, message: msg.common.no_data_err })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function applyMyCouponCode(req, res, next) {
  userService.applyMyCouponCode(req)
    .then((couponData) => {
      if (couponData) {
        return res.status(200).json({ status: true, message: "Coupon applied successfully.", data: couponData });
      } else {
        return res.status(200).json({ status: false, message: "Coupon is already used or invalid.", data: [] });
      }
    })
    .catch((err) => {
      console.error("Error in applyMyCouponCode:", err);
      return res.status(500).json({ status: false, message: "An unexpected error occurred." });
    });
}

function getMyCoupons(req, res, next) {
  userService
    .getMyCoupons(req)
    .then((coupons) => coupons ? res.status(200).json({ status: true, data: coupons }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
    .catch((err) => next(res.json({ status: false, message: err })));
}

function getNewCoupons(req, res, next) {
  userService
    .getNewCoupons(req)
    .then((coupons) =>
      coupons
        ? res.status(200).json({ status: true, data: coupons })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function checkPayment(req, res, next) {
  userService
    .checkPayment(req)
    .then((coupons) =>
      coupons
        ? res.status(200).json({ status: true, data: coupons })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function checkCoupon(req, res, next) {
  userService
    .checkCoupon(req)
    .then((coupons) =>
      coupons
        ? res.status(200).json({ status: true, data: coupons })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function couponStatus(req, res, next) {
  userService
    .couponStatus(req)
    .then((coupons) =>
      coupons
        ? res.status(200).json({ status: true, data: coupons })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function addReview(req, res, next) {
  if (req.files && req.files.fileValidationError) {
    return res
      .status(400)
      .json({ status: false, message: req.files.fileValidationError });
  }

  userService
    .addReview(req)
    .then((review) =>
      review
        ? res.status(201).json({
          status: true,
          message: msg.user.review.add.success,
          data: review,
        })
        : res
          .status(400)
          .json({ status: false, message: msg.user.review.add.error })
    )
    .catch((err) =>
      next(res.status(400).json({ status: false, message: err }))
    );
}

function addToWishlist(req, res, next) {
  userService
    .addToWishlist(req)
    .then((wishlist) =>
      wishlist
        ? res.status(201).json({
          status: true,
          message: msg.user.wishlist.add.success,
          data: wishlist,
        })
        : res
          .status(400)
          .json({ status: false, message: msg.user.wishlist.add.error })
    )
    .catch((err) =>
      next(res.status(400).json({ status: false, message: err }))
    );
}

function addToSaveLater(req, res, next) {
  userService
    .addToSaveLater(req)
    .then((savelater) =>
      savelater
        ? res.status(201).json({
          status: true,
          message: msg.user.savelater.add.success,
          data: savelater,
        })
        : res
          .status(400)
          .json({ status: false, message: msg.user.savelater.add.error })
    )
    .catch((err) =>
      next(res.status(400).json({ status: false, message: err }))
    );
}

function saveOrder(req, res, next) {
  userService
    .saveOrder(req)
    .then((order) =>
      order
        ? res.status(201).json({
          status: true,
          message: msg.user.order.add.success,
          data: order,
        })
        : res
          .status(400)
          .json({ status: false, message: msg.user.order.add.error })
    )
    .catch((err) =>
      next(res.status(400).json({ status: false, message: err }))
    );
}

function addToCart(req, res, next) {
  userService
    .addToCart(req)
    .then((cart) =>
      cart
        ? res.status(201).json({ status: true, data: cart })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: {} })
    )
    .catch((err) =>
      next(res.status(400).json({ status: false, message: err }))
    );
}
function updateToCart(req, res, next) {
  userService
    .updateToCart(req)
    .then((cart) =>
      cart
        ? res.status(201).json({ status: true, data: cart })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: {} })
    )
    .catch((err) =>
      next(res.status(400).json({ status: false, message: err }))
    );
}
function deleteFromCart(req, res, next) {
  userService
    .deleteFromCart(req)
    .then((cart) =>
      cart
        ? res.status(201).json({ status: true, data: cart })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: {} })
    )
    .catch((err) =>
      next(res.status(400).json({ status: false, message: err }))
    );
}

function clearFromCart(req, res, next) {
  userService
    .clearFromCart(req)
    .then((cart) =>
      cart
        ? res.status(201).json({ status: true, data: cart })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: {} })
    )
    .catch((err) =>
      next(res.status(400).json({ status: false, message: err }))
    );
}

function productReduceStock(req, res, next) {
  userService.productReduceStock(req)
    .then((data) => data ? res.json({ status: true, data: data }) : res.json({ status: false, message: "ERROR" }))
    .catch((err) => next(res.json({ status: false, message: err })));
}


//  function updateToCartDiscountId(req, res, next) {
//   userService
//     .updateToCartDiscountId(req)
//     .then((cart) =>
//       cart
//         ? res.status(201).json({ status: true, data: cart })
//         : res
//           .status(400)
//           .json({ status: false, message: msg.common.no_data_err, data: {} })
//     )
//     .catch((err) =>
//       next(res.status(400).json({ status: false, message: err }))
//     );
// }


// stripe
function checkoutSession(req, res, next) {
  userService.checkoutSession(req)
    .then((data) => data ? res.status(201).json({ status: true, data: data }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: {} }))
    .catch((err) => next(res.status(400).json({ status: false, message: err })));
}



function getOrderById(req, res, next) {
  userService
    .getOrderById(req.params.id)
    .then((order) =>
      order
        ? res.status(200).json({ status: true, data: order })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: {} })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}
function getOrderDataById(req, res, next) {
  userService
    .getOrderDataById(req.params.id)
    .then((order) =>
      order
        ? res.status(200).json({ status: true, data: order })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: {} })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}
function getOrderDetails(req, res, next) {
  userService.getOrderDetails(req)
    .then((order) => order ? res.status(200).json({ status: true, data: order }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: {} }))
    .catch((err) => next(res.json({ status: false, message: err })));
}

function addComplaint(req, res, next) {
  if (req.files && req.files.fileValidationError) {
    return res
      .status(400)
      .json({ status: false, message: req.files.fileValidationError });
  }

  userService
    .addComplaint(req)
    .then((complaint) =>
      complaint
        ? res.status(201).json({
          status: true,
          message: msg.user.complaint.add.success,
          data: complaint,
        })
        : res
          .status(400)
          .json({ status: false, message: msg.user.complaint.add.error })
    )
    .catch((err) =>
      next(res.status(400).json({ status: false, message: err }))
    );
}

function addCancel(req, res, next) {
  if (req.files && req.files.fileValidationError) {
    return res
      .status(400)
      .json({ status: false, message: req.files.fileValidationError });
  }

  userService
    .addCancel(req)
    .then((cancel) =>
      cancel
        ? res.status(201).json({
          status: true,
          message: msg.user.cancel.add.success,
          data: cancel,
        })
        : res
          .status(400)
          .json({ status: false, message: msg.user.cancel.add.error })
    )
    .catch((err) =>
      next(res.status(400).json({ status: false, message: err }))
    );
}

function addReturn(req, res, next) {
  if (req.files && req.files.fileValidationError) {
    return res
      .status(400)
      .json({ status: false, message: req.files.fileValidationError });
  }

  userService
    .addReturn(req)
    .then((returnOrder) =>
      returnOrder
        ? res.status(201).json({
          status: true,
          message: msg.user.returnOrder.add.success,
          data: returnOrder,
        })
        : res
          .status(400)
          .json({ status: false, message: msg.user.returnOrder.add.error })
    )
    .catch((err) =>
      next(res.status(400).json({ status: false, message: err }))
    );
}

function getPayments(req, res, next) {
  userService
    .getPayments(reqBody)
    .then((payments) =>
      payments
        ? res.status(200).json({ status: true, data: payments })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}
function getPaymentsById(req, res, next) {
  userService
    .getPaymentsById(req.params.id)
    .then((payments) =>
      payments
        ? res.status(200).json({ status: true, data: payments })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns JSON|null
 *
 * function to get the order status
 */
function getOrderStatus(req, res, next) {
  userService
    .getOrderStatus()
    .then((orderstatus) =>
      orderstatus
        ? res.status(200).json({ status: true, data: orderstatus })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}
/*****************************************************************************************/
/*****************************************************************************************/
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns JSON|null
 *
 * function to get the order tracking timelines
 */
function getOrderTrackingTime(req, res, next) {
  userService
    .getOrderTrackingTime()
    .then((ordertrackingtime) =>
      ordertrackingtime
        ? res.status(200).json({ status: true, data: ordertrackingtime })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}
/*****************************************************************************************/
/*****************************************************************************************/
/**
 * Get the seller id by product id
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * @returns sellerid|null
 */
function getSellerByProductId(req, res, next) {
  //console.log('req='+req)
  userService
    .getSellerByProductId(req.params.id)
    .then((data) =>
      data
        ? res.status(200).json({ status: true, data: data })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}
/*****************************************************************************************/
/*****************************************************************************************/
/**
 * Saves the payment data in the collection
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns JSON|null
 */
function savepaymentdata(req, res, next) {
  userService
    .savepaymentdata(req)
    .then((data) =>
      data
        ? res.status(200).json({ status: true, data: data })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}
/*****************************************************************************************/
/*****************************************************************************************/
/**
 * Saves the order tracking data in the collection
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns JSON|null
 */

function saveOrdertrackingTime(req, res, next) {
  userService
    .saveOrdertrackingTime(req)
    .then((data) =>
      data
        ? res.status(200).json({ status: true, data: data })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}
/*****************************************************************************************/
/*****************************************************************************************/
/**
 * Saves the order details data in the collection
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns JSON|null
 */

function saveorderdetails(req, res, next) {
  userService
    .saveorderdetails(req)
    .then((data) =>
      data
        ? res.status(200).json({ status: true, data: data })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}
/*****************************************************************************************/
/*****************************************************************************************/

/**
 * Update order status in orders collection
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @returns JSON|null
 */
function updateOrderStatus(req, res, next) {
  userService.updateOrderStatus(req)
    .then((data) => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
    .catch((err) => next(res.json({ status: false, message: err })));
}

/*****************************************************************************************/
/*****************************************************************************************/
/********BANNER**********************/
function createUserBanner(req, res, next) {
  userService
    .createUserBanner(req)
    .then((banner) =>
      banner
        ? res.status(200).json({ status: true, data: banner })
        : res.status(400).json({ status: false, message: "ERROR ", data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function getBannersByUserId(req, res, next) {
  userService
    .getBannersByUserId(req)
    .then((banner) =>
      banner
        ? res.status(200).json({ status: true, data: banner })
        : res.status(400).json({ status: false, message: "ERROR ", data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function deleteBannerAdv(req, res, next) {
  userService
    .deleteBanner(req)
    .then((banner) =>
      banner
        ? res.json({ status: true, message: "Successfull Delete" })
        : res.json({ status: false, message: "ERROR" })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function getBannerById(req, res, next) {
  userService
    .getBannerById(req)
    .then((banner) =>
      banner
        ? res.status(200).json({ status: true, data: banner })
        : res.status(400).json({ status: false, message: "ERROR ", data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function updateBanner(req, res, next) {
  userService
    .updateBanner(req)
    .then((banner) =>
      banner
        ? res.json({ status: true, message: "Banner Update Successfully...." })
        : res.json({ status: false, message: "ERROR" })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

// blockBanner
function blockBanner(req, res, next) {
  userService
    .blockBanner(req)
    .then((banner) =>
      banner
        ? res.json({ status: true, message: "Banner blocked Successfully...." })
        : res.json({ status: false, message: "ERROR" })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function customerAuthorizePayment(req, res, next) {
  console.log("banner payments");
  userService
    .customerAuthorizePayment(req)
    //.then(payment => payment ? res.status(200).json({ status: true, data: payment }) : res.json({ status: false, message: "ERROR" }))
    .then((data) => {
      if (data) {
        return res.status(200).json({ status: true, data: data });
      } else {
        return res.json({ status: false, message: "ERROR" });
      }
    })
    .catch((err) => next(res.json({ status: false, message: err })));
}

function bannerPayment(req, res, next) {
  console.log("banner payments");
  userService
    .bannerPayment(req)
    //.then(payment => payment ? res.status(200).json({ status: true, data: payment }) : res.json({ status: false, message: "ERROR" }))
    .then((payment) => {
      if (payment) {
        return res.status(200).json({ status: true, data: payment });
      } else {
        return res.json({ status: false, message: "ERROR" });
      }
    })
    .catch((err) => next(res.json({ status: false, message: err })));
}

// stripePayment

function createSubscription(req, res, next) {
  userService
    .createSubscription(req)
    .then((data) => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
    .catch((err) => next(res.json({ status: false, message: err })));
}

function serviceCharges(req, res, next) {
  userService.serviceCharges(req)
    .then((data) => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
    .catch((err) => next(res.json({ status: false, message: err })));
}

function createPaymentIntent(req, res, next) {
  userService.createPaymentIntent(req)
    .then((data) => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
    .catch((err) => next(res.json({ status: false, message: err })));
}

function createInvoice(req, res, next) {
  userService.createInvoice(req)
    .then((data) => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
    .catch((err) => next(res.json({ status: false, message: err })));
}

/*****************************************************************************************/
/*****************************************************************************************/

//Get common All Service listing
function getAllCommonService(req, res, next) {
  userService
    .getCommonService(req)
    .then((service) =>
      service
        ? res.status(200).json({ status: true, data: service })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

/*****************************************************************************************/
/*****************************************************************************************/

//Get common Service By Id
function getCommonServiceById(req, res, next) {
  //console.log('iniside');
  userService
    .CommonServiceById(req)
    .then((service) => service ? res.status(200).json({ status: true, data: service }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: [] }))
    .catch((err) => next(res.json({ status: false, message: err })));
}

/*****************************************************************************************/
/*****************************************************************************************/

//Add Service Reivew by User
async function addServiceReview(req, res, next) {
  const param = req.body;
  console.log("data2", param);
  try {
    if (req.files && req.files.fileValidationError) {
      return res
        .status(400)
        .json({ status: false, message: req.files.fileValidationError });
    }

    const review = await userService.addServiceReview(req);
    if (review) {
      res.status(201).json({
        status: true,
        message: "Service review added successfully",
        data: review,
      });
      // console.log('review-------', review)
    } else {
      res
        .status(400)
        .json({ status: false, message: "Failed to add service review" });
    }
  } catch (err) {
    console.error("Error adding service review:", err);
    next(res.status(400).json({ status: false, message: err.message }));
  }
}

//Get Service Review

function getServiceReviews(req, res, next) {
  userService
    .getServiceReviews(req.params.id)
    .then((reviews) =>
      reviews
        ? res.status(200).json({ status: true, data: reviews })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

//deleteReviews

function deleteReviews(req, res, next) {
  userService
    .deleteReviews(req)
    .then((review) =>
      review
        ? res.json({ status: true, message: "Successfull Delete" })
        : res.json({ status: false, message: "ERROR" })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

 function deleteProductReview(req, res, next) {
  userService
    .deleteProductReview(req)
    .then((review) =>
      review
        ? res.json({ status: true, message: "Successfull Delete" })
        : res.json({ status: false, message: "ERROR" })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

async function addProductReview(req, res, next) {
  const param = req.body;
  console.log("addProductReview param", param);
  try {
    // if (req.files && req.files.fileValidationError) {
    //   return res
    //     .status(400)
    //     .json({ status: false, message: req.files.fileValidationError });
    // }

    const review = await userService.addProductReview(req);
    if (review) {
      res.status(201).json({
        status: true,
        message: "Product review added successfully",
        data: review,
      });
      // console.log('review-------', review)
    } else {
      res
        .status(400)
        .json({ status: false, message: "Failed to add service review" });
    }
  } catch (err) {
    console.error("Error adding service review:", err);
    next(res.status(400).json({ status: false, message: err.message }));
  }
}

//*****************************************************************************************/
//*****************************************************************************************/
//Add meeting by user for service with seller
function addGoogleEvent(req, res, next) {
  userService
    .addGoogleEvent(req)
    .then((meeting) =>
      meeting
        ? res.status(200).json({ status: true, data: meeting })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}


//*****************************************************************************************/
//*****************************************************************************************/
//get meeting data and show into the calendar
// function getGoogleEvent(req, res, next) {
//   userService
//     .getGoogleEvent(req)
//     .then((meetings) => {
//       if (meetings && meetings.length > 0) {
//         res.status(200).json({ status: true, data: meetings });
//       } else {
//         res.status(400).json({
//           status: false,
//           message: msg.common.no_data_err,
//           data: [],
//         });
//       }
//     })
//     .catch((err) => {
//       console.error(err); // Log the error for debugging purposes
//       res.status(500).json({ status: false, message: err.message });
//     });
// }

// Get meeting data and show in the calendar
//***** */
// function getGoogleEvent(req, res, next) {
//   userService
//     .getGoogleEvent(req)
//     .then((result) => {
//       if (result && result.length > 0) {
//         res.status(200).json({ status: true, data: result });
//       } else {
//         res.status(404).json({
//           status: false,
//           message: msg.common.no_data_err,
//           data: [],
//         });
//       }
//     })
//     .catch((err) => {
//       console.error("Error fetching events:", err); // Log the error for debugging purposes
//       res.status(500).json({ status: false, message: err.message });
//     });
// }

function getGoogleEvent(req, res, next) {
  userService
    .getGoogleEvent(req)
    .then((result) =>
      result
        ? res.status(200).json({ status: true, data: result })
        : res.status(400).json({ status: false, message: "ERROR ", data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

//*****************************************************************************************/
//*****************************************************************************************/
//delete meeting By user

// function delMeetingByUser(req, res, next) {
//   userService
//     .delMeetingByUser(req)
//     .then((meeting) =>
//       meeting
//         ? res.json({ status: true, message: "Successfull Delete" })
//         : res.json({ status: false, message: "ERROR" })
//     )
//     .catch((err) => next(res.json({ status: false, message: err })));
// }

function deleteGoogleEvent(req, res, next) {
  userService
    .deleteGoogleEvent(req)
    .then((meeting) =>
      meeting
        ? res.json({ status: true, message: "Successfull Delete" })
        : res.json({ status: false, message: "ERROR" })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

 function findSellerAvailable(req, res, next) {
  userService
    .findSellerAvailable(req)
    .then((SellerAvailable) =>
      SellerAvailable
    ? res.status(200).json({ status: true, data: SellerAvailable })
    : res.status(400).json({ status: false, message: "ERROR ", data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function updateServiceOrders(req, res, next) {
  userService.updateServiceOrders(req)
    .then((result) => result ? res.status(200).json({ status: true, data: result }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
    .catch((err) => next(res.json({ status: false, message: err })));
}

// fetchDisableTimes
function fetchDisableTimes(req, res, next) {
  userService.fetchDisableTimes(req)
    .then((result) => result ? res.status(200).json({ status: true, data: result }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
    .catch((err) => next(res.json({ status: false, message: err })));
}


//*****************************************************************************************/
//*****************************************************************************************/

function getServiceOrder(req, res, next) {
  userService
    .getServiceOrder(req)
    .then((data) =>
      data
        ? res.status(200).json({ status: true, data: data })
        : res.status(400).json({ status: false, message: "ERROR ", data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}
//*****************************************************************************************/
//*****************************************************************************************/
//Genrate Zoom Access Token
function zoomAccessToken(req, res, next) {
  userService
    .zoomAccessToken(req)
    .then((data1) =>
      data1
        ? res.status(200).json({ status: true, data: data1 })
        : res.status(400).json({ status: false, message: "ERROR ", data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

// *******************************************************************************
// *******************************************************************************
//zoomRefreshToken
function zoomRefreshToken(req, res, next) {
  userService
    .zoomRefreshToken(req)
    .then((result) => {
      if (result) {
        res.json({
          status: true,
          message: "Zoom new Refresh token generated successfully",
          data: result,
        });
      } else {
        res.json({ status: false, message: "ERROR" });
      }
    })
    .catch((err) => {
      next(res.status(500).json({ status: false, message: err }));
    });
}


// zoomCreateUserToken  test @@@@@@

function zoomCreateUserToken(req, res, next) {
  userService.zoomCreateUserToken(req).then((data) => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
    .catch((err) => next(res.json({ status: false, message: err })));
}

function createZoomUser(req, res, next) {
  userService.createZoomUser(req).then((data) => data ? res.status(200).json({ status: true, data: data }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
    .catch((err) => next(res.json({ status: false, message: err })));
}



// *******************************************************************************
// *******************************************************************************
// chat getAllUser
function getAllUser(req, res, next) {
  userService
    .getAllUser(req)
    .then((user) =>
      user
        ? res.status(200).json({ status: true, data: user })
        : res
          .status(400)
          .json({ status: false, message: msg.common.no_data_err, data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}

//***************************************************** */

function accessChat(req, res, next) {
  userService.accessChat(req)
    .then((chat) => chat ? res.status(201).json({ status: true, data: chat }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: {} }))
    .catch((err) =>
      next(res.status(400).json({ status: false, message: err }))
    );
}

function createGroupChat(req, res, next) {
  userService.createGroupChat(req)
    .then((chat) => chat ? res.status(201).json({ status: true, data: chat }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: {} }))
    .catch((err) =>
      next(res.status(400).json({ status: false, message: err }))
    );
}

function fetchChat(req, res, next) {
  userService.fetchChat(req).then((chat) => chat ? res.status(200).json({ status: true, data: chat })
    : res.status(400).json({ status: false, message: "ERROR ", data: [] })
  )
    .catch((err) => next(res.json({ status: false, message: err })));
}

function fetchBlockChat(req, res, next) {
  userService.fetchBlockChat(req)
    .then((chat) => chat ? res.status(200).json({ status: true, data: chat }) : res.status(400).json({ status: false, message: "ERROR ", data: [] }))
    .catch((err) => next(res.json({ status: false, message: err })));
}

function sendMessage(req, res, next) {
  userService.sendMessage(req)
    .then((sendChat) => sendChat ? res.status(201).json({ status: true, data: sendChat }) : res.status(400).json({ status: false, message: msg.common.no_data_err, data: {} }))
    .catch((err) =>
      next(res.status(400).json({ status: false, message: err }))
    );
}

function allMessages(req, res, next) {
  userService.allMessages(req)
    .then((allChat) => allChat ? res.status(200).json({ status: true, data: allChat }) : res.status(400).json({ status: false, message: "ERROR ", data: [] })).catch((err) => next(res.json({ status: false, message: err })));
}

function userChatBlock(req, res, next) {
  userService.userChatBlock(req)
    .then((chatBlock) => chatBlock ? res.json({ status: true, message: "User Block Successfully...." }) : res.json({ status: false, message: "ERROR" }))
    .catch((err) => next(res.json({ status: false, message: err })));
}

function userUnblockChat(req, res, next) {
  userService.userUnblockChat(req)
    .then((chatUnblock) => chatUnblock ? res.json({ status: true, message: "User Unblock Successfully...." }) : res.json({ status: false, message: "ERROR" }))
    .catch((err) => next(res.json({ status: false, message: err })));
}

function chatMessageDelete(req, res, next) {
  userService.chatMessageDelete(req)
    .then((chatMessage) => chatMessage ? res.json({ status: true, message: "Status Change Successfully...." }) : res.json({ status: false, message: "ERROR" }))
    .catch((err) => next(res.json({ status: false, message: err })));
}

function removeFromGroup(req, res, next) {
  userService.removeFromGroup(req)
    .then((removeMember) => removeMember ? res.json({ status: true, message: removeMember }) : res.json({ status: false, message: "ERROR" }))
    .catch((err) => next(res.json({ status: false, message: err })));
}

function addGroupMember(req, res, next) {
  userService.addGroupMember(req)
    .then((addMember) => addMember ? res.json({ status: true, message: addMember }) : res.json({ status: false, message: "ERROR" }))
    .catch((err) => next(res.json({ status: false, message: err })));
}

function updateGroupName(req, res, next) {
  userService.updateGroupName(req)
    .then((name) => name ? res.json({ status: true, data: name }) : res.json({ status: false, message: "ERROR" }))
    .catch((err) => next(res.json({ status: false, message: err })));
}

// *******************************************************************************
// *******************************************************************************
//create zoom meeting
function createZoomMeeting(req, res, next) {
  userService
    .createZoomMeeting(req)
    .then((result) => {
      if (result) {
        res.json({
          status: true,
          message: "Zoom Meeting Created successfully",
          data: result,
        });
      } else {
        res.json({ status: false, message: "ERROR" });
      }
    })
    .catch((err) => {
      next(res.status(500).json({ status: false, message: err }));
    });
}

//*****************************************************************************************/
//*****************************************************************************************/
function getData(req, res, next) {
  userService
    .getData(req)
    .then((banner) =>
      banner
        ? res.status(200).json({ status: true, data: banner })
        : res.status(400).json({ status: false, message: "ERROR ", data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}
//*****************************************************************************************/
//*****************************************************************************************/
function addNotification(req, res, next) {
  userService
    .addNotification(req)
    .then((result) =>
      result
        ? res.status(200).json({
          status: true,
          data: result,
          message: "Notification Created successfully",
        })
        : res.status(400).json({ status: false, message: "ERROR ", data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}
//*****************************************************************************************/
//*****************************************************************************************/
//get Notification
function getNotification(req, res, next) {
  userService
    .getNotification(req)
    .then((result) =>
      result
        ? res.status(200).json({
          status: true,
          data: result,
          message: "Get Notification Successfully",
        })
        : res.status(400).json({ status: false, message: "ERROR ", data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}
//*****************************************************************************************/
//*****************************************************************************************/
//updated Notification
function updateNotification(req, res, next) {
  userService
    .updateNotification(req)
    .then((result) =>
      result
        ? res.status(200).json({
          status: true,
          data: result,
          message: "Notification updated Successfully",
        })
        : res.status(400).json({ status: false, message: "ERROR ", data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}
//*****************************************************************************************/
//*****************************************************************************************/
//deleteNotification
function removeNotification(req, res, next) {
  userService
    .removeNotification(req)
    .then((result) =>
      result
        ? res.status(200).json({
          status: true,
          data: result,
          message: "Notification Remove Successfully",
        })
        : res.status(400).json({ status: false, message: "ERROR ", data: [] })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}
//*****************************************************************************************/
//*****************************************************************************************/
//User Contact-Us

function userContactUs(req, res, next) {
  userService
    .userContactUs(req.body)
    .then((user) =>
      user
        ? res
          .status(200)
          .json({ status: true, message: "Email sent successfully." })
        : res
          .status(400)
          .json({ status: false, message: "Email has not sent. Please, try again." })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}


function userSupportEmail(req, res, next) {
  userService
    .userSupportEmail(req.body)
    .then((user) =>
      user
        ? res
          .status(200)
          .json({ status: true, message: "Email sent successfully." })
        : res
          .status(400)
          .json({ status: false, message: "Email has not sent. Please, try again." })
    )
    .catch((err) => next(res.json({ status: false, message: err })));
}


function supportReqCall(req, res, next) {
  userService.supportReqCall(req)
    .then((result) => result ? res.json({ status: true, message: "Support request created successfully." }) : res.json({ status: false, message: "Error creating support request." }))
    .catch((err) => next(res.json({ status: false, message: err.message })));
}


//saveMyProfile
function saveMyProfile(req, res, next) {
  userService.saveMyProfile(req)
    .then((data) => data ? res.json({ status: true, data: data, message: "Profile saved successfully." }) : res.json({ status: false, data: {}, message: "Error saving Profile request." }))
    .catch((err) => next(res.json({ status: false, message: err.message })));
}

function getProductOrder(req, res, next) {
  userService.getProductOrder(req)
    .then((data) => data ? res.json({ status: true, data: data }) : res.json({ status: false, data: {}, message: "Error saving Profile request." }))
    .catch((err) => next(res.json({ status: false, message: err.message })));
}


function getCartData(req, res, next) {
  userService.getCartData(req)
    .then((data) => data ? res.json({ status: true, data: data }) : res.json({ status: false, data: {}, message: "Error getCartData request." }))
    .catch((err) => next(res.json({ status: false, message: err.message })));
}

function updateCartData(req, res, next) {
  userService.updateCartData(req)
    .then((data) => data ? res.json({ status: true, data: data }) : res.json({ status: false, data: {}, message: "Error getCartData request." }))
    .catch((err) => next(res.json({ status: false, message: err.message })));
}