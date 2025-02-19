const config = require("../config/index");
const mongoose = require("mongoose");
const axios = require("axios");
const { Base64 } = require("js-base64");
const request = require("request");
mongoose.connect(process.env.MONGODB_URI || config.connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;
const Schema = mongoose.Types;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const msg = require("../helpers/messages.json");
const Webhook = require("coinbase-commerce-node").Webhook;
var ApiContracts = require("authorizenet").APIContracts;
var ApiControllers = require("authorizenet").APIControllers;
var SDKConstants = require("authorizenet").Constants;
const fs = require("fs");
const stripe = require("stripe")(config.stripe_secret_key);
const SendEmail = require("../helpers/email");

const {
  User,
  Seller,
  Admin,
  Coupon,
  Product,
  Wishlist,
  UserCoupon,
  ProductReview,
  ProductComplaint,
  Order,
  OrderStatus,
  OrderTrackingTimeline,
  OrderCancel,
  OrderReturn,
  Payment,
  CryptoConversion,
  Savelater,
  Cart,
  OrderDetails,
  bannerAdvertisement,
  Services,
  Category,
  ServiceReview,
  Servicedetails,
  Calendar,
  Chat,
  ChatMessage,
  Notification,
  Support,
  UsedCoupons,
} = require("../helpers/db");

module.exports = {
  authenticate,
  getById,
  getUserByRole,
  userRegister,
  changePass,
  forgotPass,
  resetPass,
  getProducts,
  getProfileById,
  editProfile,
  getWishList,
  deleteWishlist,
  getSaveLaterList,
  removeProductFromWishlist,
  removeProductFromSavelater,

  applyMyCouponCode,

  getMyCoupons,
  getNewCoupons,
  checkPayment,
  checkCoupon,
  couponStatus,
  addReview,
  addToWishlist,
  addToSaveLater,
  saveOrder,
  addToCart,
  updateToCart,
  deleteFromCart,
  clearFromCart,
  productReduceStock,

  // updateToCartDiscountId,


  //
  // checkoutSession,




  socialLogin,
  getOrders,
  getOrderStatus,
  getOrderTrackingTime,
  getOrderById,
  //getUserOrderById,
  getOrderDataById,
  getOrderDetails,
  addComplaint,
  addCancel,
  addReturn,
  getPayments,
  getPaymentsById,
  getSellerByProductId,
  savepaymentdata,
  saveOrdertrackingTime,
  updateOrderStatus,
  saveorderdetails,
  createUserBanner,
  getBannersByUserId,
  deleteBanner,
  getBannerById,
  updateBanner,

  blockBanner,
  bannerPayment,
  customerAuthorizePayment,
  createSubscription,
  serviceCharges,
  createPaymentIntent,
  createInvoice,
  getCommonService,
  CommonServiceById,
  addServiceReview,
  addProductReview,
  getServiceReviews,
  addGoogleEvent,
  getGoogleEvent,
  deleteGoogleEvent,
  findSellerAvailable,
  updateServiceOrders,
  fetchDisableTimes,
  getServiceOrder,
  deleteReviews,
  deleteProductReview,
  zoomRefreshToken,
  zoomAccessToken,
  createZoomMeeting,
  //Test 
  zoomCreateUserToken,
  createZoomUser,

  getAllUser,
  accessChat,
  fetchChat,
  fetchBlockChat,
  createGroupChat,
  sendMessage,
  allMessages,
  userChatBlock,
  userUnblockChat,
  chatMessageDelete,
  removeFromGroup,
  addGroupMember,
  updateGroupName,


  addNotification,
  getNotification,
  updateNotification,
  removeNotification,
  userContactUs,
  userSupportEmail,
  supportReqCall,
  saveMyProfile,


  getProductOrder,
  getCartData,
  updateCartData

};

// function sendMail(mailOptions) {
//   // create reusable transporter object using the default SMTP transport
//   const transporter = nodemailer.createTransport({
//     port: config.mail_port, // true for 465, false for other ports
//     host: config.mail_host,
//     auth: {
//       user: config.mail_auth_user,
//       pass: config.mail_auth_pass,
//     },
//     tls: {
//       rejectUnauthorized: false,
//     },
//     secure: config.mail_is_secure,
//   });

//   transporter.sendMail(mailOptions, function (err, info) {
//     if (err) {
//       console.log("*** Error", err);
//     } else {
//       console.log("*** Success", info);
//     }
//   });
//   return true;
// }

async function userRegister(param) {
  if (await User.findOne({ email: param.email })) {
    throw 'email "' + param.email + '" is already taken';
  }
  const user = new User({
    name: param.name,
    email: param.email,
    password: bcrypt.hashSync(param.password, 10),
    role: "user",
    isActive: true,
    terms: param.terms,
  });

  //Email send functionality.
  const mailOptions = {
    from: `"Payearth Support" <${config.mail_from_email}>`, // sender address
    replyTo: `${config.mail_from_email}`,
    to: user.email,
    subject: `Welcome to Payearth, ${user.name}!`,
    text: "",
    html: `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #555;">
      <!-- Header -->
      <div style="background-color: #6772E5; padding: 20px; text-align: center;">
        <img src="https://pay.earth:7700/uploads/logo.png" alt="Payearth" style="height: 40px;" />
      </div>
  
      <!-- Body -->
      <div style="padding: 20px; background-color: #f9f9f9;">
        <h2 style="color: #333;">Welcome to Payearth, ${user.name}!</h2>
  
        <p>Dear <b>${user.name}</b>,</p>
  
        <p>You have successfully registered with Payearth. We are excited to have you onboard!</p>
  
        <p>Feel free to explore our services and reach out if you have any questions.</p>
  
        <p style="font-style: italic;">— The Payearth Team</p>
      </div>
  
      <!-- Footer -->
      <div style="padding: 10px; background-color: #6772E5; text-align: center; font-size: 12px; color: #aaa;">
        <p>Payearth, 1234 Street Name, City, State, 12345</p>
        <p>&copy; ${new Date().getFullYear()} Payearth. All rights reserved.</p>
      </div>
    </div>
    `
  };
  SendEmail(mailOptions);


  const data = await user.save();
  if (data) {
    let res = await User.findById(data.id).select(
      "-password -community -social_accounts -reset_password -image_url -phone"
    );

    if (res) {
      return res;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

async function authenticate({ email, password }) {
  const user = await User.findOne({ email });
  if (user && bcrypt.compareSync(password, user.password)) {
    const {
      password,
      reset_password,
      __v,
      createdAt,
      updatedAt,
      social_accounts,
      ...userWithoutHash
    } = user.toObject();
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: "2h",
    });
    var expTime = new Date();
    expTime.setHours(expTime.getHours() + 2); //2 hours token expiration time
    //expTime.setMinutes(expTime.getMinutes() + 2);
    expTime = expTime.getTime();
    return {
      ...userWithoutHash,
      token,
      expTime,
    };
  }
}

async function socialLogin(req) {
  var param = req.body;

  var input = {
    role: "user",
    purchase_type: "retail",
    isActive: true,
  };
  var andConditon = [{ isActive: true }];
  var orCondition = [];

  if (param.provider_data.email) {
    orCondition.push({ email: param.provider_data.email });
  }

  if (param.provider_type == "google") {
    orCondition.push({ "social_accounts.google.google_id": param.provider_id });

    input.name = param.provider_data.name;

    if (param.provider_data.email) {
      input.email = param.provider_data.email;
    }

    input.image_url = param.provider_data.imageUrl;
    input.social_accounts = {
      google: {
        google_id: param.provider_data.googleId,
        google_data: param.provider_data,
      },
    };
  } else if (param.provider_type == "facebook") {
    orCondition.push({
      "social_accounts.facebook.facebook_id": param.provider_id,
    });
    input.name = param.provider_data.name;
    input.email = param.provider_data.email;
    input.image_url = param.provider_data.picture.data.url;
    input.social_accounts = {
      facebook: {
        facebook_id: param.provider_data.id,
        facebook_data: param.provider_data,
      },
    };
  } else if (param.provider_type == "twitter") {
    orCondition.push({
      "social_accounts.twitter.twitter_id": param.provider_id,
    });
    input.name = param.provider_data.name;
    input.social_accounts = {
      twitter: {
        twitter_id: param.provider_data.id,
        twitter_data: param.provider_data,
      },
    };
  }

  //check for existing user

  var whereCondition = {};

  whereCondition["$and"] = andConditon;

  if (orCondition && orCondition.length > 0) {
    whereCondition["$or"] = orCondition;
  }

  var user = await User.findOne(whereCondition);

  if (user) {
    //check for existing social login data
    var flag = 0;

    if (
      param.provider_type == "google" &&
      user.social_accounts.google.google_id == null
    ) {
      flag = 1;
    } else if (
      param.provider_type == "facebook" &&
      user.social_accounts.facebook.facebook_id == null
    ) {
      flag = 1;
    } else if (
      param.provider_type == "twitter" &&
      user.social_accounts.twitter.twitter_id == null
    ) {
      flag = 1;
    }

    if (flag === 1) {
      Object.assign(user, input);
      await user.save();
    }

    const {
      password,
      reset_password,
      __v,
      createdAt,
      updatedAt,
      social_accounts,
      ...userWithoutHash
    } = user.toObject();
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: "2h",
    });
    var expTime = new Date();
    expTime.setHours(expTime.getHours() + 2); //2 hours token expiration time
    //expTime.setMinutes(expTime.getMinutes() + 2);
    expTime = expTime.getTime();
    return {
      ...userWithoutHash,
      token,
      expTime,
    };
  } else {
    const userData = new User(input);

    const data = await userData.save();

    if (data) {
      const user = await User.findById(data.id);
      const url = "https://pay.earth:7700/uploads/logo.png"
      if (user) {
        //Email send functionality.
        const mailOptions = {
          from: `"Payearth Support" <${config.mail_from_email}>`,
          replyTo: `${config.mail_from_email}`,
          to: user.email,
          subject: `Welcome to Payearth, ${user.name}!`,
          text: "",
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #555;">
              <!-- Header -->
              <div style="background-color: #6772E5; padding: 20px; text-align: center;">
                <img src= ${url} alt="Payearth" style="height: 40px;" />
              </div>
          
              <!-- Body -->
              <div style="padding: 20px; background-color: #f9f9f9;">
                <h2 style="color: #333;">Welcome to Payearth, ${user.name}!</h2>
          
                <p>Dear <b>${user.name}</b>,</p>
          
                <p>You have successfully registered with Payearth. We are excited to have you onboard!</p>
          
                <p>Feel free to explore our services and reach out if you have any questions.</p>
          
                <p style="font-style: italic;">— The Payearth Team</p>
              </div>
          
              <!-- Footer -->
              <div style="padding: 10px; background-color: #6772E5; text-align: center; font-size: 12px; color: #aaa;">
                <p>Payearth, 1234 Street Name, City, State, 12345</p>
                <p>&copy; ${new Date().getFullYear()} Payearth. All rights reserved.</p>
              </div>
            </div>
            `
        };
        // sendMail(mailOptions);
        SendEmail(mailOptions);


        const {
          password,
          reset_password,
          __v,
          createdAt,
          updatedAt,
          social_accounts,
          ...userWithoutHash
        } = user.toObject();
        const token = jwt.sign({ id: user.id }, config.secret, {
          expiresIn: "2h",
        });
        var expTime = new Date();
        expTime.setHours(expTime.getHours() + 2); //2 hours token expiration time
        //expTime.setMinutes(expTime.getMinutes() + 2);
        expTime = expTime.getTime();
        return {
          ...userWithoutHash,
          token,
          expTime,
        };
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}

async function forgotPass(param) {
  const email = param.email;
  const user = await User.findOne({ email });
  if (user) {
    var verif_code =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    var verifExpTime = new Date();
    verifExpTime.setMinutes(
      verifExpTime.getMinutes() + parseInt(config.verif_min)
    );
    var code_valid_at = verifExpTime;
    var is_pass_req = true;

    const input = {
      reset_password: {
        code_valid_at: code_valid_at,
        verif_code: verif_code,
        is_pass_req: is_pass_req,
      },
    };

    Object.assign(user, input);

    // Email send functionality.
    let app_url = config.app_env === "local" ? config.react_local_url : config.react_dev_url;

    const url = `${app_url}/?t=resetpass&u=${user.id}&hash=${verif_code}`;

    const mailOptions = {
      from: `"Payearth Support" <${config.mail_from_email}>`,
      replyTo: `${config.mail_from_email}`,
      to: user.email,
      subject: "Verification link generated for reset password.",
      text: "",
      html:
        `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #555;">
          <div style="background-color: #6772E5; padding: 20px; text-align: center;">
            <img src="https://yourwebsite.com/logo.png" alt="Payearth" style="height: 40px;" />
          </div>

          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2 style="color: #333;">Reset Your Password</h2>

            <p>Hello ${user.name},</p>

            <p>You requested a password reset. Please click the button below to reset your password:</p>

            <div style="text-align: center; margin: 20px 0;">
              <a href="${url}" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #6772E5; text-decoration: none; border-radius: 5px;">
                Reset Password
              </a>
            </div>

            <p>This link is valid for 7 days. It will expire in 7 days.</p>

            <p>If you didn't request a password reset, please ignore this email.</p>

            <p style="font-style: italic;">— The Payearth Team</p>
          </div>

          <div style="padding: 10px; background-color: #6772E5; text-align: center; font-size: 12px; color: #aaa;">
            <p>Payearth, 1234 Street Name, City, State, 12345</p>

             <p>&copy; ${new Date().getFullYear()} Payearth. All rights reserved.</p>
          </div>
        </div>
        `
    };
    SendEmail(mailOptions);

    const data = await user.save();

    if (data) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
async function resetPass(param) {
  const id = param.id;
  const user = await User.findById(id);
  const now = new Date();

  if (
    user &&
    user.reset_password.verif_code == param.code &&
    user.reset_password.code_valid_at >= now
  ) {
    var verif_code = "";
    var code_valid_at = null;
    var is_pass_req = false;

    if (param.password === param.password_confirmation) {
      var password = bcrypt.hashSync(param.password, 10);
    } else {
      throw msg.user.password.confirm_pass_err;
    }

    const input = {
      reset_password: {
        code_valid_at: code_valid_at,
        verif_code: verif_code,
        is_pass_req: is_pass_req,
      },
      password: password,
    };

    Object.assign(user, input);

    const data = await user.save();

    if (data) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

async function getById(id) {
  const user = await User.findById(id).select("-password");
  if (!user) return false;
  return user;
}

async function getUserByRole(param) {
  //console.log(param.id.payload.id)

  //const user = await User.findOne({ _id: param.id, role: param.role });
  const user = await User.findOne({
    _id: param.id.payload.id,
    role: param.role,
  });
  if (!user) return false;
  return user;
}

async function changePass(id, param) {
  if (!param) throw msg.common.invalid;

  const user = await User.findById(id);

  if (!user) {
    return false;
  } else {
    //check old password
    // if (bcrypt.compareSync(param.old_password, user.password)) {
    if (param.password === param.password_confirmation) {
      param.password = bcrypt.hashSync(param.password, 10);
    } else {
      throw msg.user.password.confirm_pass_err;
    }
    Object.assign(user, { password: param.password });
    await user.save();
    return user;
    // } else {
    //     throw msg.user.password.old_pass_err;
    // }
  }
}

async function getProducts() {
  const result = await Product.find({ isActive: true })
    .select("id name price images avgRating isService quantity")
    .populate([
      {
        path: "cryptoPrices",
        model: CryptoConversion,
        select: "name code cryptoPriceUSD",
        match: { isActive: true, asCurrency: true },
      },
    ])
    .sort({ createdAt: "desc" });
  if (result && result.length > 0) return result;
  return false;
}

async function getProfileById(id) {
  const user = await User.findById(id).select(
    "id name email phone address role original_image_url original_image_id image_url image_id purchase_type community"
  );
  if (!user) return false;
  return user;
}

async function editProfile(id, param) {
  if (!param) throw msg.common.invalid;

  const user = await User.findById(id);

  if (!user) {
    return false;
  } else {
    if (
      user.email !== param.email &&
      (await User.findOne({ email: param.email }))
    ) {
      throw 'Email "' + param.email + '" already exists.';
    }

    const input = {
      name: param.name,
      email: param.email,
      role: param.role,
      phone: param.phone,
      address: {
        street: param.address?.street,
        city: param.address?.city,
        state: param.address?.state,
        country: param.address?.country,
        zip: param.address?.zip,
      }
    };

    Object.assign(user, input);

    if (await user.save()) {
      return await User.findById(id).select(
        "id name phone email role address community"
      );
    } else {
      return false;
    }
  }
}

async function getWishList(req) {
  try {
    var param = req.body;
    var id = req.params.id;
    var sortOption = { createdAt: "desc" }; //default
    var limit = "";
    var skip = "";
    var whereCondition = { userId: id, isActive: true };

    if (param.count) {
      limit = parseInt(param.count.limit);
      skip = parseInt(param.count.start);
    }

    const wishlist = await Wishlist.find(whereCondition)
      .select("id productId userId isActive")
      .limit(limit)
      .skip(skip)
      .sort(sortOption)
      .populate([
        {
          path: "productId",
          model: Product,
          select:
            "id name price featuredImage avgRating isService isActive quantity",
          populate: {
            path: "cryptoPrices",
            model: CryptoConversion,
            select: "name code cryptoPriceUSD",
            match: { isActive: true, asCurrency: true },
          },
        },
      ]);

    if (wishlist && wishlist.length > 0) {
      //to get count of total wishlists
      const totalWishlists = await Wishlist.find(
        whereCondition
      ).countDocuments();

      const result = {
        totalWishlists: totalWishlists,
        wishlist: wishlist,
      };
      return result;
    }
    return false;
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

async function getSaveLaterList(req) {
  try {
    var param = req.body;
    var id = req.params.id;
    var sortOption = { createdAt: "desc" }; //default
    var limit = "";
    var skip = "";
    var whereCondition = { userId: id, isActive: true };

    if (param.count) {
      limit = parseInt(param.count.limit);
      skip = parseInt(param.count.start);
    }

    const savelater = await Savelater.find(whereCondition)
      .select("id productId userId isActive")
      .limit(limit)
      .skip(skip)
      .sort(sortOption)
      .populate([
        {
          path: "productId",
          model: Product,
          select:
            "id name price featuredImage avgRating isService isActive quantity",
          populate: {
            path: "cryptoPrices",
            model: CryptoConversion,
            select: "name code cryptoPriceUSD",
            match: { isActive: true, asCurrency: true },
          },
        },
      ]);

    if (savelater && savelater.length > 0) {
      //to get count of total savelater
      const totalSaveLaterlists = await Savelater.find(
        whereCondition
      ).countDocuments();

      const result = {
        totalSaveLaterlists: totalSaveLaterlists,
        savelater: savelater,
      };
      return result;
    }
    return false;
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

async function deleteWishlist(id) {
  const wishlist = await Wishlist.findById(id);

  if (!wishlist) return false;

  return await Wishlist.findByIdAndRemove(id);
}

async function removeProductFromWishlist(req) {
  const param = req.body;

  const wishlist = await Wishlist.findOne({
    productId: param.product_id,
    userId: param.user_id,
  }).exec();

  if (!wishlist) return false;

  return await Wishlist.findByIdAndRemove(wishlist._id);
}

async function removeProductFromSavelater(req) {
  const param = req.body;

  const savelater = await Savelater.findOne({
    productId: param.product_id,
    userId: param.user_id,
  }).exec();

  if (!savelater) return false;

  return await Savelater.findByIdAndRemove(savelater._id);
}

async function applyMyCouponCode(req) {
  try {
    const { couponCode } = req.params;
    const { userId } = req.query;

    if (!userId) {
      return false;
    }

    const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
    if (!coupon) {
      return false;
    }

    const isCouponUsed = await UsedCoupons.findOne({ userId, couponId: coupon._id });
    if (isCouponUsed) {
      return false;
    }

    const usedCoupon = new UsedCoupons({
      userId,
      couponId: coupon._id,
      code: coupon.code,
      discount_per: coupon.discount_per,
      start: coupon.start,
      end: coupon.end,
      isActive: coupon.isActive,
      usedAt: new Date(),
    });

    await usedCoupon.save();
    return coupon;
  } catch (error) {
    console.error(error);
    return false;
  }
}

async function getMyCoupons(req) {
  try {
    var param = req.body;
    console.log("param in getMy coupon", param)
    var id = req.params.id;
    var sortOption = { createdAt: "desc", isActive: "desc" };
    var limit = "";
    var skip = "";
    var whereCondition = { userId: id, isActive: true };

    if (param.count) {
      limit = parseInt(param.count.limit);
      skip = parseInt(param.count.start);
    }
    var now = new Date();
    const coupons = await UserCoupon.find(whereCondition)
      .select("id couponId userId isActive")
      .limit(limit)
      .skip(skip)
      .sort(sortOption)
      .populate("couponId", "code discount_per start end", { isActive: true });

    if (coupons && coupons.length > 0) {
      //to get count of available coupons
      const availableCoupons = await UserCoupon.find({
        isActive: true,
        userId: id,
      })
        .limit(limit)
        .skip(skip)
        .sort(sortOption)
        .countDocuments(); //not expired

      //to get count of total coupons
      const totalCoupons = await UserCoupon.find(
        whereCondition
      ).countDocuments(); // all coupons

      const result = {
        totalCoupons: totalCoupons,
        availableCoupons: availableCoupons,
        coupons: coupons,
      };

      console.log("result get my coupons", result)
      return result;
    }
    return false;
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}



async function getNewCoupons(req) {
  try {
    let now = new Date();
    var param = req.body;
    var whereCondition = { end: { $gte: now } }; //default
    const result = await Coupon.paginate(whereCondition).then((data) => {
      console.log('getNewCoupons', data)
      let res = {
        coupons: data.docs,
      };
      return res;
    });
    if (result.coupons && result.coupons.length > 0) {
      return result;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    console.log("Cpouon is Expired or Code is not match");
    return false;
  }
} //end getNewCoupon

function rawBody(req, res, next) {
  req.setEncoding("utf8");

  var data = "";

  req.on("data", function (chunk) {
    data += chunk;
  });

  req.on("end", function () {
    req.rawBody = data;

    next();
  });
}
// start checkPayment
async function checkPayment(request, response) {
  var event;
  const webhookSecret = "35b12217-47b7-4b0d-aa4d-d48f0c56fc2e";

  rawBody();
  try {
    event = Webhook.verifyEventBody(
      request.rawBody,
      request.headers["x-cc-webhook-signature"],
      webhookSecret
    );
  } catch (err) {
    console.log("Error", err);
    console.log("Cpouon is Expired or Code is not match");
    return false;
  }
} //end checkPayment

//check Coupon
async function checkCoupon(req) {
  let now = new Date();
  var param = req.body;
  var couponCode = param.data;
  let use_id = param.user_id;
  var whereCondition = { end: { $gte: now }, isActive: true, code: couponCode }; //default

  try {
    var res = "";
    var result = "";
    if (await Coupon.findOne(whereCondition)) {
      result = await Coupon.updateOne(
        { code: couponCode },
        { $set: { isActive: false, user_id: use_id } }
      );

      if (await Coupon.findOne({ end: { $gte: now }, code: couponCode })) {
        result = await Coupon.paginate({ code: couponCode }).then((data) => {
          res = {
            coupons: data.docs,
          };
          return res;
        });
      }

      if (result.coupons && result.coupons.length > 0) {
        return result;
      } else {
        return false;
      }
    } else {
      console.log("this coupon has already used by user");
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

//coupon status
async function couponStatus(req) {
  let now = new Date();
  var param = req.body;
  var couponCode = param.data;
  let use_id = param.user_id;

  //update table
  if (await Coupon.findOne({ end: { $gte: now }, code: couponCode })) {
    await Coupon.updateOne(
      { code: couponCode },
      { $set: { isActive: false, user_id: use_id } }
    );
  } //update table
  try {
    const result = await Coupon.paginate({
      end: { $gte: now },
      code: couponCode,
      isActive: false,
    }).then((data) => {
      let res = {
        coupon: data.docs,
      };
      return res;
    });
    if (result.coupon && result.coupon.length > 0) {
      return result;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    console.log("couponStatus is not responding");
  }
}

async function addToWishlist(req) {
  const param = req.body;

  if (
    await Wishlist.findOne({
      productId: param.product_id,
      userId: param.user_id,
    })
  ) {
    throw "This item is already added in wishlist.";
  }

  let input = {
    productId: param.product_id,
    userId: param.user_id,
    isActive: true,
  };

  const wishlist = new Wishlist(input);

  const data = await wishlist.save();

  if (data) {
    let result = await Wishlist.findById(data.id).select();
    if (result) {
      return result;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

async function addToSaveLater(req) {
  const param = req.body;

  if (
    await Savelater.findOne({
      productId: param.product_id,
      userId: param.user_id,
    })
  ) {
    throw "This item is already added in savelater.";
  }

  let input = {
    productId: param.product_id,
    userId: param.user_id,
    isActive: true,
  };

  const savelater = new Savelater(input);

  const data = await savelater.save();

  if (data) {
    let result = await Savelater.findById(data.id).select();
    if (result) {
      return result;
    } else {
      return false;
    }
  } else {
    return false;
  }
}
async function saveOrder(req) {
  try {
    const param = req.body;

    let input = {
      userId: param.userId,
      productId: param.productId,
      paymentId: param.paymentId,
      sellerId: param.sellerId,
      price: param.price,
      product_sku: param.product_sku,
      billingFirstName: param.billingFirstName,
      billingLastName: param.billingLastName,
      billingCompanyName: param.billingCompanyName,
      billingCounty: param.billingCounty,
      billingStreetAddress: param.billingStreetAddress,
      billingStreetAddress1: param.billingStreetAddress1,
      billingCity: param.billingCity,
      billingCountry: param.billingCountry,
      billingPostCode: param.billingPostCode,
      billingPhone: param.billingPhone,
      billingEmail: param.billingEmail,
      billingNote: param.billingNote,
      deliveryCharge: param.deliveryCharge,
      taxPercent: param.taxPercent,
      taxAmount: param.taxAmount,
      discount: param.discount,
      total: param.total,
      orderStatus: param.orderStatus,
      isActive: param.isActive,
      isService: param.isService,
    };

    const orderItem = new Order(input);

    const data = await orderItem.save();

    if (data) {
      //console.log(data);
      return data._id;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}
// async function addToCart(req) {

//   console.log('addtocart ---api--run--', req)
//   try {
//     const param = req.body;

//     let input = {
//       userId: param.user_id,
//       products: [
//         {
//           productId: param.productId,
//           qty: param.qty,
//           price: param.price,
//           discountId: param.discountId
//         },
//       ],
//     };

//     const cartItem = new Cart(input);

//     const data = await cartItem.save();

//     if (data) {
//       return true;
//     } else {
//       return false;
//     }
//   } catch (err) {
//     console.log("Error", err);
//     return false;
//   }
// }

async function addToCart(req) {
  // console.log('addtocart ---api--run--', req.body);

  try {
    const param = req.body;


    if (!param.user_id || !param.productId || !param.qty || !param.price || !param.coins) {
      console.error('Missing required fields in request body');
      return false;
    }


    const existingCart = await Cart.findOne({
      userId: param.user_id,
      'products.productId': param.productId,
    });

    if (existingCart) {

      const update = {
        $set: {
          'products.$.qty': param.qty,
          'products.$.price': param.price,
          'products.$.discountId': param.discountId,
          'products.$.coins': param.coins,
        },
      };

      const updatedCart = await Cart.findOneAndUpdate(
        { userId: param.user_id, 'products.productId': param.productId },
        update,
        { new: true }
      );

      if (updatedCart) {
        // console.log('Cart updated successfully:', updatedCart);
        return true;
      } else {
        console.log('Error updating the cart.');
        return false;
      }
    } else {

      const newCart = new Cart({
        userId: param.user_id,
        products: [
          {
            productId: param.productId,
            qty: param.qty,
            price: param.price,
            discountId: param.discountId,
            coins: param.coins,
          },
        ],
      });

      const savedCart = await newCart.save();

      if (savedCart) {
        // console.log('New cart created successfully:', savedCart);
        return true;
      } else {
        console.log('Failed to create a new cart.');
        return false;
      }
    }
  } catch (err) {
    console.error('Error adding/updating cart:', err);
    return false;
  }
}




// async function updateToCart(req) {
//   try {
//     var param = req.body;
//     let input = {
//       userId: param.user_id,
//       products: [
//         {
//           productId: param.productId,
//           qty: param.qty,
//           price: param.price,
//          // discountId: param.discountId
//         },
//       ],
//     };

//     await Cart.findOneAndDelete({
//       userId: param.user_id,
//       productId: param.productId,
//       //discountId: param.productId
//     });
//     const cartItem = new Cart(input);

//     const data = await cartItem.save();
//     if (data) {
//       return true;
//     } else {
//       return false;
//     }
//   } catch (err) {
//     console.log("Error", err);
//     return false;
//   }
// }
async function updateToCart(req) {
  try {
    const param = req.body;

    const update = {
      $set: {
        'products.$.qty': param.qty,
        'products.$.price': param.price,
        // 'products.$[elem].discountId': param.discountId, 
      },
    };


    const data = await Cart.findOneAndUpdate(
      { userId: param.user_id, 'products.productId': param.productId },
      update,
    );

    if (data) {
      // console.log('Cart updated successfully:', data);
      return true;
    } else {
      console.log('No matching cart or product found for update.');
      return false;
    }
  } catch (err) {
    console.error('Error updating cart:', err);
    return false;
  }
}


async function deleteFromCart(req) {
  try {
    // console.log('deleteFromCart---', req.body)
    var param = req.body;
    // console.log('deleteFromCart---', param)
    const data = await Cart.findOneAndDelete({
      userId: param.user_id,
      'products.productId': param.productId,
    });
    if (data) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

async function clearFromCart(req) {
  try {
    console.log('clearFromCart---', req.body)
    var param = req.body;
    // console.log('deleteFromCart---', param)
    const data = await Cart.deleteMany({
      userId: param.userId,
    });
    if (data) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

async function productReduceStock(req) {
  try {
    const { productId, reduceQty } = req.body;
    if (!reduceQty || reduceQty <= 0) {
      return {
        status: false,
        message: "Invalid quantity to reduce.",
      };
    }

    const product = await Product.findById(productId);
    if (!product) {
      return {
        status: false,
        message: "Product not found.",
      };
    }

    if (product.quantity.stock_qty < reduceQty) {
      return {
        status: false,
        message: "Insufficient stock.",
      };
    }

    const updatedProduct = await Product.findByIdAndUpdate(productId,
      {
        $inc: {
          'quantity.stock_qty': -reduceQty,
          'quantity.selling_qty': reduceQty
        }
      },
      { new: true }
    );

    return {
      status: true,
      message: "Stock reduced successfully.",
      data: updatedProduct.quantity.stock_qty,
    };

  } catch (error) {
    console.error(error);
    return {
      status: false,
      message: "Internal server error.",
    };
  }
}

// async function updateToCartDiscountId(req) {
//   try {
//     const param = req.body;

//     const update = {
//       $set: {
//         'products.$[elem].qty': param.qty,
//         'products.$[elem].price': param.price,
//         'products.$[elem].discountId': param.discountId, 
//       },
//     };

//     const options = {
//       arrayFilters: [{ 'elem.productId': param.productId }], 
//       new: true, 
//     };

//     const data = await Cart.findOneAndUpdate(
//       { userId: param.user_id, 'products.productId': param.productId },
//       update,
//       options
//     );

//     if (data) {
//       console.log('Cart updated successfully:', data);
//       return true;
//     } else {
//       console.log('No matching cart or product found for update.');
//       return false;
//     }
//   } catch (err) {
//     console.error('Error updating cart:', err);
//     return false;
//   }
// }

// Stripe Checkout session

// async function checkoutSession(req) {
//   try {
//     // console.log("backend run")
//     const { cart } = req.body;
//     // console.log("cart backend ", cart)
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ["card"],
//       line_items: cart.map(product => ({
//         price_data: {
//           currency: 'usd',
//           product_data: {
//             name: product.name,
//           },
//           unit_amount: product.price * product.quantity
//         },
//         quantity: product.quantity,
//       })),
//       mode: "payment",
//       success_url: 'https://localhost:3000/checkout',
//       // success_url: `https://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
//       cancel_url: `http://localhost:3000/cancel`,
//     });
//     return session;

//   } catch (err) {

//   }
// }

async function getOrders(req) {
  try {
    var param = req.body;
    var id = req.params.id; //user id
    var sortOption = { createdAt: "desc" }; //default
    var page = 0;
    var limit = 10;
    var skip = 0;
    var whereCondition = { userId: id, isActive: true };

    if (param.count) {
      page = parseInt(param.count.page);
      limit = parseInt(param.count.limit);
      skip = parseInt(param.count.skip);
    }

    if (param.sorting) {
      sortOption = {};
      let sort_type = param.sorting.sort_type;
      let sort_val = param.sorting.sort_val;
      if (sort_type == "date") {
        sortOption["createdAt"] = sort_val;
      }
    }

    var options = {
      select:
        "id orderCode productId userId isActive orderStatus paymentId product_sku",
      sort: sortOption,
      populate: [
        {
          path: "productId",
          model: Product,
          select: "id name price featuredImage isService isActive",
          populate: {
            path: "cryptoPrices",
            model: CryptoConversion,
            select: "name code cryptoPriceUSD",
            match: { isActive: true, asCurrency: true },
          },
        },
        {
          path: "orderStatus",
          model: OrderTrackingTimeline,
          select: "updatedAt",
          populate: {
            path: "orderStatusId",
            model: OrderStatus,
            select: "lname title",
          },
        },
        {
          path: "paymentId",
          model: Payment,
          select: "paymentMode amountPaid invoiceNo paymentAccount invoiceUrl",
        },
      ],
      lean: true,
      page: page,
      offset: skip,
      limit: limit,
    };

    const result = await Order.paginate(whereCondition, options).then(
      (data) => {
        let res = {
          orders: data.docs,
          paginationData: {
            totalOrders: data.totalDocs,
            totalPages: data.totalPages,
            currentPage: data.page,
            limit: data.limit,
            skip: data.offset,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            prevPage: data.prevPage,
            nextPage: data.nextPage,
          },
        };
        return res;
      }
    );
    if (result.orders && result.orders.length > 0) {
      return result;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

async function getOrderStatus() {
  try {
    const result = await OrderStatus.find({ isActive: true }).sort({
      createdAt: "desc",
    });
    if (result && result.length > 0) return result;
    return false;
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

async function getOrderTrackingTime() {
  try {
    const result = await OrderTrackingTimeline.find({ isActive: true }).sort({
      createdAt: "desc",
    });
    if (result && result.length > 0) return result;
    return false;
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

async function getOrderById(id) {
  const order = await Order.findById(id)
    .select(
      "id orderCode productId userId amount quantity isActive orderStatus createdAt"
    )
    .populate([
      {
        path: "productId",
        model: Product,
        select: "id name price featuredImage avgRating isService",
        populate: {
          path: "cryptoPrices",
          model: CryptoConversion,
          select: "name code cryptoPriceUSD",
          match: { isActive: true, asCurrency: true },
        },
      },
      {
        path: "orderStatus",
        model: OrderTrackingTimeline,
        select: "updatedAt",
        populate: {
          path: "orderStatusId",
          model: OrderStatus,
          select: "lname title",
        },
      },
      {
        path: "userId",
        model: User,
        select: "id name",
      },
    ]);

  if (!order) {
    return false;
  } else {
    //get order tracking timeline data
    let orderTimeline = await OrderTrackingTimeline.find({ orderId: order.id })
      .select("orderId orderStatusId updatedAt")
      .sort({ createdAt: "asc" })
      .populate("orderStatusId", "id lname title", { isActive: true });

    //get payment data
    let payment = await Payment.findOne({
      orderId: order.id,
      userId: order.userId._id,
    })
      .select("invoiceNo invoiceUrl")
      .exec();

    //get review data
    let reviewData = await ProductReview.findOne({
      productId: order.productId._id,
      userId: order.userId._id,
    })
      .select("rating review reviewImages isActive")
      .exec();

    //get complaint data
    let complaintData = await ProductComplaint.findOne({
      orderId: order.id,
      productId: order.productId._id,
      userId: order.userId._id,
    })
      .select("rating complaint complaintImages isActive")
      .exec();

    let result = {
      order: order,
      orderTimeline: orderTimeline,
      invoice: payment,
      reviewData: reviewData,
      complaintData: complaintData,
    };
    return result;
  }
}

async function getOrderDataById(req) {
  try {
    let result = await Order.findById(req)
      .select("orderCode product_sku price paymentId sellerId billingFirstName billingLastName billingCompanyName billingCounty billingStreetAddress billingStreetAddress1 billingCity billingCountry billingPostCode billingPhone billingEmail billingNote deliveryCharge taxPercent taxAmount discount orderStatus productId userId createdId")
      .populate({
        path: "productId.productId",
        model: Product,
        select: "productId name",
      })
      .populate({
        path: "orderStatus",
        Model: OrderTrackingTimeline,
        populate: {
          path: "orderStatusId",
          model: OrderStatus,
          select: "lname",
        },
      });
    if (result) {
      return result;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}


async function getOrderDetails(req) {
  try {
    const { authorId, status } = req.query;
    const orders = await Order.find({ userId: authorId, isService: status })
      .select("orderCode price paymentId billingFirstName billingLastName billingCompanyName billingCounty billingStreetAddress billingStreetAddress1 billingCity billingCountry billingPostCode billingPhone billingEmail billingNote deliveryCharge taxPercent taxAmount discount orderStatus total createdAt")
      .sort({ createdAt: "desc" })
      .populate([
        {
          path: "orderStatus",
          model: OrderStatus,
          select: "title product service",
          populate: [
            {
              path: "product.productId",
              model: Product,
              select: "name",
            },
            {
              path: "service.serviceId",
              model: Services,
              select: "name charges isActive",
            },
          ],
        },
        {
          path: "paymentId",
          model: Payment,
          select:
            "invoiceNo amountPaid paymentMode paymentAccount createdAt paymentStatus",
        },
      ]);
    if (!orders || orders.length === 0) {
      return {
        status: false,
        message: "No orders found for this user.",
        data: [],
      };
    }

    return {
      status: true,
      message: "Orders retrieved successfully.",
      data: orders,
    };
  } catch (err) {
    console.error("Error fetching orders:", err);
    return {
      status: false,
      message: "An error occurred while fetching orders.",
      error: err.message,
    };
  }
}


/**************************************************************************/
/**************************************************************************/

async function addReview(req) {
  try {
    const files = req.files;

    const param = req.body;
    var imagesArr = [];

    if (files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        let url = files[i].destination + "/" + files[i].filename;
        imagesArr.push(url);
      }
    }

    var rating = parseInt(param.rating);

    var input = {
      productId: param.product_id,
      userId: param.user_id,
      review: {
        title: param.title,
        description: param.description,
      },
      reviewImages: imagesArr,
      rating: rating,
    };

    //get product detail
    var product = await Product.findById(param.product_id).select().exec();

    var totalRatingScore;
    var NewReviewCount;
    var avgRating;
    var updateData;
    var review;
    var data;

    //check for existing entry
    const reviewData = await ProductReview.findOne({
      productId: param.product_id,
      userId: param.user_id,
    }).exec();

    if (reviewData) {
      //existing review
      review = reviewData;

      input["updatedAt"] = new Date().toISOString();

      if (files.length === 0) {
        //if no image is selected then old images will stay remain.
        input["reviewImages"] = review.reviewImages;
      }

      //product data
      totalRatingScore =
        parseFloat(product.totalRatingScore) - parseInt(review.rating) + rating; //subtract old rating and add new rating
      NewReviewCount = parseInt(product.reviewCount); //reviewCount will be same for edit
      avgRating = totalRatingScore / NewReviewCount;
      updateData = { totalRatingScore: totalRatingScore, avgRating: avgRating }; //only new totalRatingScore and Average rating updated value.

      Object.assign(review, input);

      //save review data
      data = await review.save();
    } else {
      //product data
      totalRatingScore = parseFloat(product.totalRatingScore) + rating; //add only new rating
      NewReviewCount = parseInt(product.reviewCount) + 1; //add +1 count
      avgRating = totalRatingScore / NewReviewCount;

      //new review
      review = new ProductReview(input);
      //save review data
      data = await review.save();

      updateData = {
        $push: { reviews: data.id },
        $inc: { reviewCount: 1, totalRatingScore: rating },
        avgRating: avgRating,
      }; //push new entry in reviews, reviewCount increment, totalRatingScore icrement, Average rating updated value.
    }

    if (data) {
      //update in product reviews
      const filter = { _id: param.product_id };
      await Product.findOneAndUpdate(filter, updateData, { new: true });

      let result = await ProductReview.findById(data.id).select();

      if (result) {
        return result;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

async function addComplaint(req) {
  const files = req.files;
  const param = req.body;
  var imagesArr = [];

  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      let url = files[i].destination + "/" + files[i].filename;
      imagesArr.push(url);
    }
  }

  let input = {
    orderId: param.order_id,
    productId: param.product_id,
    userId: param.user_id,
    complaint: {
      title: param.title,
      description: param.description,
    },
    complaintImages: imagesArr,
    //isActive: false
  };

  const complaint = new ProductComplaint(input);

  const data = await complaint.save();

  if (data) {
    return await ProductComplaint.findById(data.id).select();
  } else {
    return false;
  }
}

async function addCancel(req) {
  const files = req.files;
  const param = req.body;
  var imagesArr = [];

  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      let url = files[i].destination + "/" + files[i].filename;
      imagesArr.push(url);
    }
  }

  let input = {
    orderId: param.order_id,
    productId: param.product_id,
    userId: param.user_id,
    cancel: {
      title: param.title,
      description: param.description,
    },
    cancelImages: imagesArr,
    isActive: false,
  };

  const cancel = new OrderCancel(input);

  const data = await cancel.save();

  if (data) {
    //get id of order status
    const orderStatus = await OrderStatus.findOne({ lname: "cancel_request" })
      .select("id")
      .exec();

    //add new entry in order tracking timeline

    const timeline = new OrderTrackingTimeline({
      orderId: param.order_id,
      orderStatusId: orderStatus._id,
    });

    const timelineData = await timeline.save();

    //update in order
    await Order.findOneAndUpdate(
      { _id: param.order_id },
      { orderStatus: timelineData._id },
      { new: true }
    );

    return await OrderCancel.findById(data.id).select();
  } else {
    return false;
  }
}

async function addReturn(req) {
  const files = req.files;
  const param = req.body;
  var imagesArr = [];

  if (files.length > 0) {
    for (let i = 0; i < files.length; i++) {
      let url = files[i].destination + "/" + files[i].filename;
      imagesArr.push(url);
    }
  }

  let input = {
    orderId: param.order_id,
    productId: param.product_id,
    userId: param.user_id,
    return: {
      title: param.title,
      description: param.description,
    },
    returnImages: imagesArr,
    isActive: false,
  };

  const returnOrder = new OrderReturn(input);

  const data = await returnOrder.save();

  if (data) {
    //get id of order status
    const orderStatus = await OrderStatus.findOne({ lname: "return_request" })
      .select("id")
      .exec();

    //add new entry in order tracking timeline

    const timeline = new OrderTrackingTimeline({
      orderId: param.order_id,
      orderStatusId: orderStatus._id,
    });

    const timelineData = await timeline.save();

    //update in order
    await Order.findOneAndUpdate(
      { _id: param.order_id },
      { orderStatus: timelineData._id },
      { new: true }
    );

    return await OrderReturn.findById(data.id).select();
  } else {
    return false;
  }
}

async function getPaymentsById(id) {
  try {
    const payments = await Payment.find({ userId: id })
      .select(
        "invoiceNo orderId userId amountPaid paymentMode paymentAccount createdAt"
      )
      .populate({
        path: "orderId",
        modal: Order,
        select: "billingCompanyName deliveryCharge taxAmount discount price",
      })
      .populate([
        {
          path: "userId",
          model: User,
          select: "name email",
        },
      ]);

    if (!payments) {
      console.log("User not found");
      return false;
    }

    return payments;
  } catch (error) {
    console.error("Error fetching user payments:", error);
    return false;
  }
}

async function getPayments(req) {
  try {
    var param = req.body;
    var id = req.params.id; //user id
    var sortOption = { createdAt: "desc" }; //default
    var page = 0;
    var limit = 5;
    var skip = 0;
    var whereCondition = { userId: id, isActive: true };

    if (param.count) {
      page = parseInt(param.count.page);
      limit = parseInt(param.count.limit);
      skip = parseInt(param.count.skip);
    }

    if (param.sorting) {
      sortOption = {};
      let sort_type = param.sorting.sort_type;
      let sort_val = param.sorting.sort_val;
      if (sort_type == "date") {
        sortOption["createdAt"] = sort_val;
      }
    }

    var options = {
      select:
        "id invoiceNo orderId userId amountPaid paymentMode invoiceUrl isActive",
      sort: sortOption,
      populate: [
        {
          path: "orderId",
          model: Order,
          select: "id productId",
          populate: {
            path: "productId",
            model: Product,
            select: "id name isService",
            populate: {
              path: "cryptoPrices",
              model: CryptoConversion,
              select: "name code cryptoPriceUSD",
              match: { isActive: true, asCurrency: true },
            },
          },
        },
      ],
      lean: true,
      page: page,
      offset: skip,
      limit: limit,
    };

    const result = await Payment.paginate(whereCondition, options).then(
      (data) => {
        let res = {
          payments: data.docs,
          paginationData: {
            totalPayments: data.totalDocs,
            totalPages: data.totalPages,
            currentPage: data.page,
            limit: data.limit,
            skip: data.offset,
            hasPrevPage: data.hasPrevPage,
            hasNextPage: data.hasNextPage,
            prevPage: data.prevPage,
            nextPage: data.nextPage,
          },
        };
        return res;
      }
    );
    if (result.payments && result.payments.length > 0) {
      return result;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

/**
 * Get seller by product id
 *
 * @param id
 * @returns sellerid|null
 */
async function getSellerByProductId(id) {
  try {
    const result = await Product.findOne({ _id: id })
      .select("createdBy")
      .exec();
    var createBy = result.createdBy;
    if (typeof result.createdBy != "undefined") {
      return createBy.valueOf();
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}
/************************************************************************************/
/************************************************************************************/

async function savepaymentdata(req) {
  try {
    var param = req.body;

    let input;
    param.map((result) => {
      input = {
        userId: result.userId,
        sellerId: result.sellerId,
        amountPaid: result.amountPaid,
        paymentMode: result.paymentMode,
        paymentAccount: result.paymentAccount,
        invoiceUrl: result.invoiceUrl,
        paymentStatus: result.paymentStatus,
        isActive: true,
      };
    });
    const payment = new Payment(input);

    const data = await payment.save();
    if (data) {
      // console.log(data._id);
      return data._id;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}
/************************************************************************************/
/************************************************************************************/
async function saveOrdertrackingTime(req) {
  try {
    var param = req.body;

    let input;
    //console.log(param);
    input = {
      orderId: param.orderId,
      orderStatusId: param.orderStatusId,
      isActive: true,
    };

    const orderTrackTimeLine = new OrderTrackingTimeline(input);

    const data = await orderTrackTimeLine.save();
    if (data) {
      //console.log(data._id);
      return data._id;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}
/************************************************************************************/
/************************************************************************************/
async function saveorderdetails(req) {
  try {
    var param = req.body;
    const options = { ordered: true };
    let input;

    input = {
      orderId: param.orderId,
      productId: param.productId,
      isActive: true,
    };

    //const OrderDetails = new OrderDetails();
    //const data = await OrderDetails.save();
    const data = await OrderDetails.insertMany(param, options);
    if (data) {
      console.log("id=", data);
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}
/************************************************************************************/
/************************************************************************************/

async function updateOrderStatus(req) {
  try {
    const data = req.body;
    let input;
    input = {
      title: data.status,
      product: data.product,
      isActive: true,
      userId: data.userId,
      paymentId: data.paymentId,
      service: data.service,
      subscriptionPlan: data.subscriptionPlan,
      serviceCreateCharge: data.serviceCreateCharge
    }
    const newOrderStatus = new OrderStatus(input);
    const savedOrderStatus = await newOrderStatus.save();

    const populatedsavedOrderStatus = await savedOrderStatus.populate('userId');

    if (data.status === 'Order placed') {
      await User.findByIdAndUpdate(
        data.userId,
        {
          $inc: { my_wallet_coins: data.coins }
        },
        { new: true }
      );
    }

    return populatedsavedOrderStatus;
  } catch (error) {
    console.error(error);
  }
}
/************************************************************************************/
/************************************************************************************/

// POST API CREATE NEW BANNER....................................

async function createUserBanner(req, res) {
  try {
    var param = req.body;
    let input = {
      image: param.image,
      imageId: param.imageId,
      video: param.video,
      videoId: param.videoId,
      bannerText: param.bannerText,
      bannerType: param.bannerType,
      bannerName: param.bannerName,
      siteUrl: param.siteUrl,
      category: param.category,
      startDate: param.startDate,
      endDate: param.endDate,
      subscriptionPlan: param.subscriptionPlan,
      bannerPlacement: param.bannerPlacement,
      status: param.status,
      tag: param.tag,
      keyword: param.keyword,
      author: param.author,
    };
    const banner = new bannerAdvertisement(input);
    const data = await banner.save();
    // console.log("RES data", data)
    if (data) {
      // console.log(data._id);
      return data;
    }
    return false;
  } catch (error) {
    console.log("Error", error);
  }
}

// GET BANNER DATA BY USER id..........................

async function getBannersByUserId(req) {
  const userId = req.params.id;
  // console.log("userID Author", userId)
  try {
    const result = await bannerAdvertisement
      .find({ author: userId })
      .select()
      .sort({ createdAt: "desc" });
    return result;
  } catch (error) {
    console.log(error);
  }
}

// DELETE BANNER

async function deleteBanner(req) {
  const bannerId = req.params.id;
  // console.log("delete banner", bannerId)
  try {
    const result = await bannerAdvertisement.deleteOne({ _id: bannerId });
    return result;
  } catch (error) {
    console.log(error);
  }
}

// ByID
async function getBannerById(req) {
  const bannerId = req.params.id;
  try {
    const result = await bannerAdvertisement.find({ _id: bannerId });
    return result;
  } catch (error) {
    console.log(error);
  }
}

// Update banner
async function updateBanner(req) {
  const bannerId = req.params.id;
  const {
    image,
    video,
    bannerText,
    bannerName,
    bannerType,
    siteUrl,
    category,
    bannerPlacement,
    startDate,
  } = req.body;
  try {
    const banner = await bannerAdvertisement.findByIdAndUpdate(
      bannerId,
      {
        image,
        video,
        bannerText,
        bannerName,
        bannerType,
        siteUrl,
        category,
        startDate,
        bannerPlacement,
      },
      { new: true }
    );
    //  console.log("update banner", banner)
    return banner;
  } catch (error) {
    console.log(error);
  }
}

// Block banner by id

async function blockBanner(req) {
  const bannerId = req.params.id;
  const { blockByUser } = req.body;
  try {
    const data = await bannerAdvertisement
      .findById(bannerId)
      .select("blockByUser");
    const user = data.blockByUser;
    user.push(blockByUser);
    const banner = await bannerAdvertisement.findByIdAndUpdate(
      bannerId,
      {
        blockByUser: user,
      },
      { new: true }
    );
    return banner;
  } catch (error) {
    console.log(error);
  }
}

// Authorize.net paymenet getway intrigation example........................

const API_LOGIN_ID = "7e44GKHmR3b";
const TRANSACTION_KEY = "9d3H2z8X27PeD6Sh";

async function bannerPayment(req) {
  const amount = req.body.amount;
  const planName = req.body.planName;
  const cardNumber = req.body.cardNumber;
  const expiryDate = req.body.expiryDate;

  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + 30);
  const startDate = futureDate.toISOString().substring(0, 10);
  console.log("start Date 30 days after", startDate);
  console.log("amount CHECK", amount);
  console.log("cardNumber", cardNumber);

  const randomString = Math.floor(Math.random() * 100000 + 1);

  // fs.readFile(filePath, 'utf8', (err, data) => {
  //     if (err) {
  //         console.error('Error reading from file:', err);
  //     } else {
  //         // Parse JSON data
  //         const retrievedData = JSON.parse(data);
  //         console.log('Retrieved data:', retrievedData);
  //     }
  // });

  try {
    var merchantAuthenticationType =
      new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(API_LOGIN_ID);
    merchantAuthenticationType.setTransactionKey(TRANSACTION_KEY);

    var interval = new ApiContracts.PaymentScheduleType.Interval();
    interval.setLength(1);
    interval.setUnit(ApiContracts.ARBSubscriptionUnitEnum.MONTHS);

    var paymentScheduleType = new ApiContracts.PaymentScheduleType();
    paymentScheduleType.setInterval(interval);
    paymentScheduleType.setStartDate(startDate);
    paymentScheduleType.setTotalOccurrences(5);
    paymentScheduleType.setTrialOccurrences(0);

    var creditCard = new ApiContracts.CreditCardType();
    creditCard.setExpirationDate(expiryDate);
    creditCard.setCardNumber(cardNumber);

    var payment = new ApiContracts.PaymentType();
    payment.setCreditCard(creditCard);

    var orderType = new ApiContracts.OrderType();
    orderType.setInvoiceNumber("");
    orderType.setDescription("");

    var customer = new ApiContracts.CustomerType();
    customer.setType(ApiContracts.CustomerTypeEnum.INDIVIDUAL);
    customer.setId(randomString);
    customer.setEmail("");
    customer.setPhoneNumber("1232122122");
    customer.setFaxNumber("1232122122");
    customer.setTaxId("911011011");

    var nameAndAddressType = new ApiContracts.NameAndAddressType();
    nameAndAddressType.setFirstName("");
    nameAndAddressType.setLastName("LName");
    nameAndAddressType.setCompany("Company");
    nameAndAddressType.setAddress("Address");
    nameAndAddressType.setCity("City");
    nameAndAddressType.setState("State");
    nameAndAddressType.setZip("98004");
    nameAndAddressType.setCountry("USA");

    var arbSubscription = new ApiContracts.ARBSubscriptionType();
    arbSubscription.setName(planName);
    arbSubscription.setPaymentSchedule(paymentScheduleType);
    arbSubscription.setAmount(amount);
    arbSubscription.setTrialAmount(0.0);
    arbSubscription.setPayment(payment);
    arbSubscription.setOrder(orderType);
    arbSubscription.setCustomer(customer);
    arbSubscription.setBillTo(nameAndAddressType);
    arbSubscription.setShipTo(nameAndAddressType);

    console.log("arbSubscription", arbSubscription);

    var createRequest = new ApiContracts.ARBCreateSubscriptionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setSubscription(arbSubscription);
    // createRequest.setValidationMode(ApiContracts.ValidationModeEnum.TESTMODE);
    // console.log("createRequest Check :", JSON.stringify(createRequest.getJSON(), null, 2));

    var ctrl = new ApiControllers.ARBCreateSubscriptionController(
      createRequest.getJSON()
    );
    console.log("ctrl", ctrl);
    ctrl.execute(function () {
      var apiResponse = ctrl.getResponse();
      console.log("api Response", apiResponse);
      var response = new ApiContracts.ARBCreateSubscriptionResponse(
        apiResponse
      );
      console.log("response ::::::", JSON.stringify(response, null, 2));

      if (response != null) {
        if (
          response.getMessages().getResultCode() ==
          ApiContracts.MessageTypeEnum.OK
        ) {
          console.log("Subscription Id : " + response.getSubscriptionId());
          console.log(
            "Message Code : " + response.getMessages().getMessage()[0].getCode()
          );
          console.log(
            "Message Text : " + response.getMessages().getMessage()[0].getText()
          );
        } else {
          console.log("Result Code: " + response.getMessages().getResultCode());
          console.log(
            "Error Code: " + response.getMessages().getMessage()[0].getCode()
          );
          console.log(
            "Error message: " + response.getMessages().getMessage()[0].getText()
          );
        }
      } else {
        console.log("Null Response.");
      }
      // callback(response);
      console.log("response", response);
      return response;
    });
  } catch (error) {
    console.log("error :");
    conole.log("error : ", error);
    //res.status(500).json({ success: false, error: error.message });
  }
}

// *******************************************************************************
// *******************************************************************************
// *******************************************************************************

// To generate customer ID.....

async function customerAuthorizePayment(req) {
  const amount = req.body.amount;
  const planName = req.body.planName;
  const cardNumber = req.body.cardNumber;
  const expiryDate = req.body.expiryDate;

  const today = new Date();
  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + 30);
  const startDate = futureDate.toISOString().substring(0, 10);
  console.log("start Date 30 days after", startDate);

  try {
    var merchantAuthenticationType =
      new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(API_LOGIN_ID);
    merchantAuthenticationType.setTransactionKey(TRANSACTION_KEY);

    var creditCard = new ApiContracts.CreditCardType();
    creditCard.setCardNumber("4242424242424242");
    creditCard.setExpirationDate("1226");

    var paymentType = new ApiContracts.PaymentType();
    paymentType.setCreditCard(creditCard);

    var customerPaymentProfileType =
      new ApiContracts.CustomerPaymentProfileType();
    customerPaymentProfileType.setCustomerType(
      ApiContracts.CustomerTypeEnum.INDIVIDUAL
    );
    customerPaymentProfileType.setPayment(paymentType);

    var paymentProfilesList = [];
    paymentProfilesList.push(customerPaymentProfileType);

    var customerProfileType = new ApiContracts.CustomerProfileType();
    customerProfileType.setMerchantCustomerId(
      "M_" + Math.floor(Math.random() * 100000 + 1)
    );
    customerProfileType.setDescription("Profile description here");
    customerProfileType.setEmail("@anet.net");
    customerProfileType.setPaymentProfiles(paymentProfilesList);

    var createRequest = new ApiContracts.CreateCustomerProfileRequest();
    createRequest.setProfile(customerProfileType);
    createRequest.setValidationMode(ApiContracts.ValidationModeEnum.TESTMODE);
    createRequest.setMerchantAuthentication(merchantAuthenticationType);

    var ctrl = new ApiControllers.ARBCreateSubscriptionController(
      createRequest.getJSON()
    );
    console.log("ctrl", ctrl);
    ctrl.execute(function () {
      var apiResponse = ctrl.getResponse();
      console.log("api Response", apiResponse);
      console.log("customerProfileId", apiResponse.customerProfileId);
      console.log(
        "customerPaymentProfileIdList",
        apiResponse.customerPaymentProfileIdList
      );

      // const localStorage = new LocalStorage('./scratch');
      // localStorage.setItem('customerProfileId', apiResponse.customerProfileId);

      const dataToStore = {
        key: "customerProfileId",
        anotherKey: apiResponse.customerProfileId,
      };
      const jsonData = JSON.stringify(dataToStore);
      const filePath = "localData.json";

      fs.writeFile(filePath, jsonData, (err) => {
        if (err) {
          console.error("Error writing to file:", err);
        } else {
          console.log("Data successfully stored in local file.", jsonData);
        }
      });

      //   fs.readFile(filePath, 'utf8', (err, data) => {
      //     if (err) {
      //       console.error('Error reading from file:', err);
      //     } else {
      //       // Parse JSON data
      //       const retrievedData = JSON.parse(data);
      //       console.log('Retrieved data:', retrievedData);
      //     }
      //   });

      var response = new ApiContracts.ARBCreateSubscriptionResponse(
        apiResponse
      );
      console.log("response ::::::;", JSON.stringify(response, null, 2));

      if (response != null) {
        if (
          response.getMessages().getResultCode() ==
          ApiContracts.MessageTypeEnum.OK
        ) {
          console.log("Subscription Id : " + response.getSubscriptionId());
          console.log(
            "Message Code : " + response.getMessages().getMessage()[0].getCode()
          );
          console.log(
            "Message Text : " + response.getMessages().getMessage()[0].getText()
          );
        } else {
          console.log("Result Code: " + response.getMessages().getResultCode());
          console.log(
            "Error Code: " + response.getMessages().getMessage()[0].getCode()
          );
          console.log(
            "Error message: " + response.getMessages().getMessage()[0].getText()
          );
        }
      } else {
        console.log("Null Response.");
      }
      // callback(response);
      console.log("response", response);
      return response;
    });
  } catch (error) {
    console.log("error :");
    conole.log("error : ", error);
    //res.status(500).json({ success: false, error: error.message });
  }
}

/**STRIPE>>>>>>>>>>>>>>>>>>>>>>> */

async function createSubscription(req, res) {
  const { paymentMethodId, email, plan_Id, authName } = req.body;
  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        token: paymentMethodId,
      },
    });
    // console.log("paymentMethod", paymentMethod.id)

    const customer = await stripe.customers.create({
      email: email,
      payment_method: paymentMethod.id,
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
      name: authName,
    });

    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });

    // Set the payment method as the default for invoices
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: plan_Id }],
      expand: ["latest_invoice.payment_intent"],
    });

    return subscription;
  } catch (error) {
    console.error("Error creating subscription:", error);
  }
}

// STRIPE Service.............
async function serviceCharges(req, res) {
  const { paymentMethodId, email, amount, authName } = req.body;
  // const email = "test@gmail.com";
  // console.log("email", email);
  // console.log("authName", authName);


  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        token: paymentMethodId,
      },
    });

    const customer = await stripe.customers.create({
      email: email,
      payment_method: paymentMethod.id,
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
      name: authName,
    });

    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });

    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });

    await stripe.invoiceItems.create({
      customer: customer.id,
      amount: amount,
      currency: 'usd',
      description: 'Service charge',
    });

    const invoice = await stripe.invoices.create({
      customer: customer.id,
      // collection_method: 'charge_automatically',
      auto_advance: true,
      collection_method: 'charge_automatically',
    });
    // console.log("invoice", invoice)

    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

    // console.log("finalizedInvoice :", finalizedInvoice);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      customer: customer.id,
      payment_method: paymentMethod.id,
      // confirmation_method: 'manual',
      automatic_payment_methods: {
        enabled: true,  // Enable automatic payment methods
        // allow_redirects: 'always',  // Always allow redirects for payment methods that require it
      },
      confirm: true,
      return_url: 'https://pay.earth/',
    });
    const response = {
      paymentIntent: paymentIntent,
      invoice: finalizedInvoice,
    };
    return response
  } catch (error) {
    console.log("Error", error)

  }
}


// product *******************************STRIPE***************************************
async function createPaymentIntent(req, res) {
  const { amount, name, email, cart, additionalData } = req.body;

  const trimmedCart = cart.map(item => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    coins: item.coins
  }));
  try {
    const stringifiedCart = JSON.stringify(trimmedCart);
    const customer = await stripe.customers.create({
      email: email,
      name: name,
    });

    // console.log("customer", customer)
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'usd',
      customer: customer.id,
      payment_method_types: ['card'],
      metadata: {
        cart: stringifiedCart,
        finalAmount: additionalData.finalAmount,
        discount: additionalData.discount,
        deliveryCharge: additionalData.deliveryCharge,
        taxAmount: additionalData.taxAmount,
      },
    });

    return paymentIntent
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
}

async function createInvoice(req, res) {
  const { paymentIntentId } = req.body;

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  // Create an Invoice Item with the payment amount
  const invoiceItem = await stripe.invoiceItems.create({
    customer: paymentIntent.customer,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    description: "Payment for products",
    metadata: {
      ...paymentIntent.metadata, // Include the PaymentIntent's metadata
    },
  });
  // console.log("invoiceItem", invoiceItem);

  const invoice = await stripe.invoices.create({
    customer: paymentIntent.customer,
    collection_method: "send_invoice",
    days_until_due: 30,
    auto_advance: true,
    description: "Invoice for payment",
  });

  // console.log("invoice", invoice)
  // await stripe.invoices.finalizeInvoice(invoice.id);

  const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);

  // console.log("finalizedInvoice", finalizedInvoice)
  return { finalizedInvoice, invoiceItem };

}




// TEST**************
// async function serviceCharges(req, res) {
//   // const { amount } = req.body;
//   const amount = 1000
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       // amount: amount * 100, // amount in cents
//       amount: amount,
//       currency: 'usd',
//     });
//     const clientSecret = paymentIntent.client_secret;
//     return clientSecret;
//     // res.json({ clientSecret: paymentIntent.client_secret });
//   } catch (error) {
//     // res.status(500).json({ error: error.message });
//     console.log("error", error)
//   }
// }


// *******************************************************************************
// *******************************************************************************

//GET Common All Services
async function getCommonService(req) {
  try {
    let result = await Services.find({ isActive: true })
      .select(
        "serviceCode name featuredImage imageId description isActive createdAt"
      )
      .sort({ createdAt: "desc" })
      .populate({
        path: "category",
        model: Category,
        select: "categoryName",
      })
      .exec();
    return result;
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
}

// *******************************************************************************
// *******************************************************************************
// GET Common Services By Id

async function CommonServiceById(req) {
  const id = req.params.id;
  const authorId = req.query.authorId;
  try {
    const chargePay = await OrderStatus.findOne({
      "service.serviceId": id,
      userId: authorId,

    }).select("title service")

    // if (!chargePay) {
    //   console.log("chargePay not pay")
    // }

    let result = await Services.findById({ _id: id })
      .select("serviceCode name charges featuredImage imageId description isActive createdBy createdAt")
      .populate({
        path: "category",
        model: Category,
        select: "categoryName",
      })
      .populate({
        path: "createdBy",
        model: Seller,
        select: "email",
      })
      .exec();
    return { result, chargePay: chargePay || null };
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
}

// *******************************************************************************
// *******************************************************************************
// AddService Review
async function addServiceReview(req) {
  const param = req.body;
  console.log('add rating param', param)
  try {
    // Parse rating as float to handle fractional values
    const rating = parseFloat(param.rating);

    var input = {
      serviceId: param.serviceId,
      userId: param.userId,
      review: {
        title: param.title,
        description: param.description,
      },
      rating: rating,
    };

    var totalRatingScore;
    var NewReviewCount;
    var avgRating;
    var updateData;
    var review;
    var data;

    // Check for existing entry
    const reviewData = await ServiceReview.find({
      serviceId: param.serviceId,
      userId: param.userId,
      input: input,
    }).exec();

    if (reviewData && reviewData.length > 0) {
      // Existing review
      // review = reviewData;
      review = reviewData[0];

      input["updatedAt"] = new Date().toISOString();

      // Service data
      totalRatingScore =
        parseFloat(Services.totalRatingScore) -
        parseFloat(review.rating) +
        rating; // Update totalRatingScore with float values
      NewReviewCount = parseInt(Services.reviewCount);
      avgRating = totalRatingScore / NewReviewCount;
      updateData = { totalRatingScore: totalRatingScore, avgRating: avgRating };

      Object.assign(review, input);

      data = await review.save();
    } else {
      // Service data
      totalRatingScore = parseFloat(Services.totalRatingScore) + rating;
      NewReviewCount = parseInt(Services.reviewCount) + 1;
      avgRating = totalRatingScore / NewReviewCount;

      // New review
      review = new ServiceReview(input);
      data = await review.save();

      updateData = {
        $push: { reviews: data.id },
        $inc: { reviewCount: 1, totalRatingScore: rating },
        avgRating: avgRating,
      };
    }

    if (data) {
      // console.log('data-----11', data)
      const filter = { _id: param._id };
      await ServiceReview.findOneAndUpdate(filter, updateData, { new: true });
      // Service reviews update
      if (!reviewData || reviewData.length === 0) {
        const serviceFilter = { _id: param.serviceId };
        await Services.findOneAndUpdate(
          serviceFilter,
          {
            $push: { reviews: data._id },
          },
          { new: true }
        );
      }

      let result = await ServiceReview.findById(data.id).select();

      if (result) {
        return result;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } catch (err) {
    console.error("Error", err);
    return false;
  }
}

// async function addProductReview(req) {
//   const param = req.body;
//   console.log('add addProductReview rating param',param)
//   try {
//     // Parse rating as float to handle fractional values
//     const rating = parseFloat(param.rating);

//     var input = {
//       productId: param.productId,
//       userId: param.userId,
//       review: {
//         title: param.title,
//         description: param.description,
//       },
//       rating: rating,
//     };

//     // var totalRatingScore;
//     // var NewReviewCount;
//     // var avgRating;
//     var updateData;
//     var review;
//     var data;

//     // Check for existing entry
//     const reviewData = await ProductReview.find({
//       productId: param.productId,
//       userId: param.userId,
//       input: input,
//     }).exec();

//     if (reviewData && reviewData.length > 0) {
//       // Existing review
//       // review = reviewData;
//       review = reviewData[0];

//       input["updatedAt"] = new Date().toISOString();

//       // Service data
//       totalRatingScore =
//         parseFloat(Product.totalRatingScore) -
//         parseFloat(review.rating) +
//         rating; // Update totalRatingScore with float values
//       NewReviewCount = parseInt(Product.reviewCount);
//       avgRating = totalRatingScore / NewReviewCount;
//       updateData = { totalRatingScore: totalRatingScore, avgRating: avgRating };

//       Object.assign(review, input);

//       data = await review.save();
//     } else {
//       // Service data
//       totalRatingScore = parseFloat(Product.totalRatingScore) + rating;
//       NewReviewCount = parseInt(Product.reviewCount) + 1;
//       avgRating = totalRatingScore / NewReviewCount;

//       // New review
//       review = new ProductReview(input);
//       data = await review.save();

//       updateData = {
//         $push: { reviews: data.id },
//         $inc: { reviewCount: 1, totalRatingScore: rating },
//         avgRating: avgRating,
//       };
//     }

//     if (data) {
//       // console.log('data-----11', data)
//       const filter = { _id: param._id };
//       await ProductReview.findOneAndUpdate(filter, updateData, { new: true });
//       // Service reviews update
//       if (!reviewData || reviewData.length === 0) {
//         const serviceFilter = { _id: param.serviceId };
//         await Product.findOneAndUpdate(
//           serviceFilter,
//           {
//             $push: { reviews: data._id },
//           },
//           { new: true }
//         );
//       }

//       let result = await ProductReview.findById(data.id).select();

//       if (result) {
//         return result;
//       } else {
//         return false;
//       }
//     } else {
//       return false;
//     }
//   } catch (err) {
//     console.error("Error", err);
//     return false;
//   }
// }

async function addProductReview(req) {
  const param = req.body;
  console.log('addProductReview request params:', param);

  try {
    // Parse the rating as a float to handle fractional values
    const rating = parseFloat(param.rating);

    const input = {
      productId: param.productId,
      userId: param.userId,
      review: {
        title: param.title,
        description: param.description,
      },
      rating: rating,
    };

    let data;
    let updateData;
    let review;

    // Check if the user has already reviewed this product
    const existingReview = await ProductReview.findOne({
      productId: param.productId,
      userId: param.userId,
    });

    if (existingReview) {
      // Update the existing review
      existingReview.review.title = param.title;
      existingReview.review.description = param.description;
      existingReview.rating = rating;
      existingReview.updatedAt = new Date().toISOString();

      data = await existingReview.save();

      // Update product's average rating and totalRatingScore
      const product = await Product.findById(param.productId);
      // const totalRatingScore =
      //   parseFloat(product.totalRatingScore) -
      //   parseFloat(existingReview.rating) +
      //   rating;
      // const avgRating = totalRatingScore / product.reviewCount;

      // updateData = {
      //   totalRatingScore: totalRatingScore,
      //   avgRating: avgRating,
      // };

      // await Product.findByIdAndUpdate(param.productId, updateData, {
      //   new: true,
      // });
    } else {
      // Create a new review
      const newReview = new ProductReview(input);
      data = await newReview.save();

      // Update product with the new review ID and calculate new average rating
      const product = await Product.findById(param.productId);

      updateData = {
        $push: { reviews: data._id },
      };

      await Product.findByIdAndUpdate(param.productId, updateData, {
        new: true,
      });
    }

    // Return the saved/updated review
    return data || false;
  } catch (err) {
    console.error("Error in addProductReview:", err);
    return false;
  }
}


// *******************************************************************************
// *******************************************************************************

// Get Service review
async function getServiceReviews(serviceId) {
  try {
    let result = await ServiceReview.find({ serviceId })
      .populate("userId", "name")
      .select()
      .sort({ createdAt: -1 })
      .exec();
    return result;
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
}

// *******************************************************************************
// *******************************************************************************
//Delete review

async function deleteReviews(req) {
  const _id = req.params.id;
  try {
    const result = await ServiceReview.findByIdAndDelete(_id);
    return result;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

async function deleteProductReview(req) {
  const _id = req.params.id; // Review ID to delete
  console.log("Review ID to delete:", _id);

  try {
    // Find the review to get the associated product ID
    const review = await ProductReview.findById(_id);

    if (!review) {
      return { success: false, message: "Review not found" };
    }

    // Delete the review
    const result = await ProductReview.findByIdAndDelete(_id);

    // Remove the review ID from the product's reviews array
    const updatedProduct = await Product.findByIdAndUpdate(
      review.productId, // Use the productId from the review
      { $pull: { reviews: _id } }, // Remove the review ID from the array
      { new: true } // Return the updated document
    );

    if (!updatedProduct) {
      return { success: false, message: "Product not found" };
    }

    console.log("Review deleted and product updated successfully");
    return {
      success: true,
      message: "Review deleted and product updated",
      updatedProduct
    };
  } catch (err) {
    console.error("Error deleting review:", err);
    throw err;
  }
}

//Add (save) Google Event in data base
// async function addGoogleEvent(req) {
//   try {
//     const reqData = req.body;
//     let data = "";
//     for (const event of reqData) {
//       const existingEvent = await Calendar.findOne({
//         event_id: event.event_id,
//       });

//       if (!existingEvent) {
//         const eventData = {
//           event_id: event.event_id,
//           event_title: event.event_title,
//           event_description: event.event_description,
//           user_id: event.user_id,
//           service_id: event.service_id,
//           start_datetime: event.start_datetime,
//           end_datetime: event.end_datetime,
//           meeting_url: event.meeting_url,
//         };

//         data = await Calendar.create(eventData);
//         console.log("calendar data", data)

//         const serviceData = await Services.find({
//           _id: data.service_id
//         });
//         console.log("serviceData", serviceData)

//         resultData = {
//           createdBy:serviceData[0].createdBy,
//           data:data
//         }
//         console.log("resultData", resultData)

//       } else {
//         resultData = [];
//       }
//     }
//     return resultData;
//   } catch (err) {
//     console.error("Error saving calendar events:", err);
//     return false;
//   }
// }

async function addGoogleEvent(req) {
  try {
    const reqData = req.body;
    let data = "";
    for (const event of reqData) {
      const existingEvent = await Calendar.findOne({
        event_id: event.event_id,
      });

      if (!existingEvent) {
        const eventData = {
          event_id: event.event_id,
          event_title: event.event_title,
          event_description: event.event_description,
          user_id: event.user_id,
          service_id: event.service_id,
          start_datetime: event.start_datetime,
          end_datetime: event.end_datetime,
          meeting_url: event.meeting_url,
          status: event.status,
          sellerId: event.sellerId
        };

        data = await Calendar.create(eventData);

        const serviceData = await Services.find({
          _id: data.service_id
        });

        resultData = {
          createdBy: serviceData[0].createdBy,
          data: data
        }

      } else {
        resultData = [];
      }
    }
    return resultData;
  } catch (err) {
    console.error("Error saving calendar events:", err);
    return false;
  }
}

//get google calendar events from data base.
async function getGoogleEvent(req) {
  const user_id = req.params.id;

  try {
    let result = await Calendar.find({ user_id }).exec();

    if (!result || result.length === 0) {
      // console.log("No events found for this user:", user_id);
      return [];
    }

    result = await Calendar.find({ user_id, status: true })
      .populate({
        path: "service_id",
        model: Services,
        select: "name createdBy",
        populate: {
          path: 'createdBy',
          model: Seller,
          select: "name email"
        }
      })
      .populate({ path: "user_id", model: User, select: "name" })
      .sort({ createdAt: "desc" })
      .exec();
    return result;
  } catch (err) {
    console.error("Error:", err);
    return false;
  }
}

//Delete google calendar events from data base.
async function deleteGoogleEvent(req) {
  const id = req.params.id;
  try {
    const updatedEvent = await Calendar.findOneAndUpdate(
      { _id: id }, // Find event by ID
      { status: false }, // Set the status to false
      { new: true } // Return the updated document
    );

    if (!updatedEvent) {
      return { message: "Event not found" };
    }

    return updatedEvent;
  } catch (error) {
    console.log(error);
  }
}

async function findSellerAvailable(req) {
  const { selectedDate, sellerId } = req.query;

  // console.log("Received selectedDate:", selectedDate);
  // console.log("Received sellerId:", sellerId);

  if (!selectedDate || isNaN(Date.parse(selectedDate))) {
    console.error("Invalid selectedDate provided:", selectedDate);
    return false;
  }

  try {
    const startOfDay = new Date(selectedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(selectedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // console.log("Searching for slots between:", startOfDay, "and", endOfDay);

    let result = await Calendar.find(
      {
        sellerId,
        status: true,
        start_datetime: { $gte: startOfDay, $lte: endOfDay },
      },
      {
        _id: 0,
        start_datetime: 1,
        end_datetime: 1
      }
    ).sort({ start_datetime: 1 }).exec();

    // console.log("Available time slots:", result);

    if (!result || result.length === 0) {
      return [];
    }

    return result

  } catch (err) {
    console.error("Error fetching available slots:", err);
    return false;
  }
}

async function updateServiceOrders(req) {
  try {
    const { pastEventIDs } = req.body;
    console.log("blockByUser", pastEventIDs);
    const matchingEvents = await Calendar.find({
      event_id: { $in: pastEventIDs }
    });

    if (matchingEvents.length === 0) {
      console.log('No matching events found');
      return;
    }

    // Step 2: Extract the service IDs from the matching events
    const serviceIds = matchingEvents.map(event => event.service_id);

    // // Step 3: Update order status for matching service IDs
    const updateResult = await OrderStatus.updateMany(
      {
        'service.serviceId': { $in: serviceIds },
        title: 'charges_paid' // Ensure we only update specific statuses
      },
      {
        $set: {
          title: 'service_completed',
          updatedAt: new Date()
        }
      }
    );
    return updateResult
  } catch (error) {
    console.error('Error updating order status:', error);
  }
}

// fetchDisableTimes

async function fetchDisableTimes(req) {
  try {
    // const { serviceId } = req.body;
    const serviceId = '67989d5bb0841e2c6829566d'
    const disableTimes = await Calendar.find({
      service_id: { $in: serviceId }
    });

    conbsole.log("disableTimes", disableTimes)

    // if (matchingEvents.length === 0) {
    //   console.log('No matching events found');
    //   return;
    // }

    // Step 2: Extract the service IDs from the matching events
    // const serviceIds = matchingEvents.map(event => event.service_id);

    // // Step 3: Update order status for matching service IDs
    // const updateResult = await OrderStatus.updateMany(
    //   {
    //     'service.serviceId': { $in: serviceIds },
    //     title: 'charges_paid' // Ensure we only update specific statuses
    //   },
    //   {
    //     $set: {
    //       title: 'service_completed',
    //       updatedAt: new Date()
    //     }
    //   }
    // );
    // return updateResult
  } catch (error) {
    console.error('Error updating order status:', error);
  }
}


// *******************************************************************************
// *******************************************************************************
//service order completed order list & Failed list

async function getServiceOrder(req) {
  const userId = req.params.id;
  try {
    const serviceOrder = await Payment.find({ userId })
      .select()
      .sort({ createdAt: "desc" })
      .populate({
        path: "userId",
        model: User,
        select: "name",
      });
    if (serviceOrder && serviceOrder.length > 0) return serviceOrder;
  } catch (error) {
    console.log(error);
  }
}

// *******************************************************************************
// *******************************************************************************
//getAllUser
async function getAllUser(req) {
  const keyword = req.query.search
    ? {
      $or: [
        { name: { $regex: req.query.search, $options: "i" } },
        { email: { $regex: req.query.search, $options: "i" } },
      ],
    }
    : {};

  const [users, sellers, admins] = await Promise.all([
    User.find(keyword).select("name email role image_url"),
    Seller.find(keyword).select("name email role image_url"),
    Admin.find(keyword).select("name email role image_url"),
  ]);

  let result = [];
  // users.forEach((user) => {
  //   const correspondingSeller = sellers.find(
  //     (seller) => seller.email === user.email
  //   );
  //   result.push({
  //     user: user,
  //     seller: correspondingSeller || null,
  //   });
  // });

  users.forEach((user) => {
    const correspondingSeller = sellers.find(
      (seller) => seller.email === user.email
    );
    const correspondingAdmin = admins.find(
      (admin) => admin.email === user.email
    );
    result.push({
      user: user,
      seller: correspondingSeller || null,
      admin: correspondingAdmin || null,
    });
  });

  // sellers.forEach((seller) => {
  //   if (!users.find((user) => user.email === seller.email)) {
  //     result.push({
  //       user: null,
  //       seller: seller,
  //     });
  //   }
  // });

  sellers.forEach((seller) => {
    if (!users.find((user) => user.email === seller.email)) {
      const correspondingAdmin = admins.find(
        (admin) => admin.email === seller.email
      );
      result.push({
        user: null,
        seller: seller,
        admin: correspondingAdmin || null,
      });
    }
  });

  admins.forEach((admin) => {
    if (!users.find((user) => user.email === admin.email) &&
      !sellers.find((seller) => seller.email === admin.email)) {
      result.push({
        user: null,
        seller: null,
        admin: admin,
      });
    }
  });

  return result;
}
// *******************************************************************************
// *******************************************************************************
//create zoom access token
// async function zoomAccessToken(req) {
//   const code = req.params.id;
//   try {
//     if (code) {
//       const redirectURL = "https://localhost:3000/zoom-authentication";
//       const b = Buffer.from(
//         process.env.ZOOM_API_KEY + ":" + process.env.ZOOM_API_SECRET
//       );
//       const url = `https://zoom.us/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirectURL}`;
//       const response = await axios.post(url, null, {
//         headers: {
//           Authorization: `Basic ${b.toString("base64")}`,
//         },
//       });
//       const data = response.data;
//       return data;
//     }
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

//*********************************************
//*********************************************
async function accessChat(req) {
  const { receiverId, authorId } = req.body;
  if (!receiverId) {
    console.log("receiverId not send in request")
  }
  // const finalChatdata = await Chat.findOne({ authorId: authorId.name, receiverId: receiverId.name });
  var isChat = await Chat.find({
    isGroupChat: false,
    $or: [
      {
        $and: [
          { 'chatUsers.id': authorId.id },
          { 'chatUsers.id': receiverId.id }
        ]
      },
      {
        $and: [
          { 'chatUsers.id': receiverId.id },
          { 'chatUsers.id': authorId.id }
        ]
      }
    ]
  }).sort({ createdAt: "desc" }).populate("latestMessage");
  // console.log("isChat", isChat.length)

  if (isChat.length > 0) {
    return isChat[0];
  } else {
    const newReceiverIds = [authorId, receiverId];
    // console.log("newReceiverIds", newReceiverIds)
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      chatUsers: newReceiverIds,
    };
    try {
      // console.log("chatData :  ", chatData)
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id })
      // console.log("fullChatData", fullChat)
      return fullChat;
    } catch (error) {
      console.log("error", error)
    }
  }
}


async function createGroupChat(req) {

  const { authorId, receiverId, groupName } = req.body;

  // console.log("receiverId", receiverId)
  // console.log("authorId", authorId)
  // console.log("receivers", receiverId)
  // console.log("groupName", groupName)

  if (!receiverId || !Array.isArray(receiverId) || receiverId.length === 0) {
    console.log("Please field add details....")
  }


  // const finalChatdata = await Chat.findOne({ authorId: authorId.name, receiverId: receiverId.name });

  var isChat = await Chat.find({
    isGroupChat: true,
    chatName: groupName,
  }).sort({ createdAt: "desc" });

  // console.log("isChat", isChat.length)

  if (isChat.length > 0) {
    return isChat[0];
  } else {

    const receiverData = receiverId.map(receiver => ({
      id: receiver.id,
      name: receiver.name,
      image_url: receiver.image_url
    }));

    receiverData.push(authorId)



    // console.log("receiverData", receiverData);

    var chatData = {
      chatName: groupName,
      isGroupChat: true,
      chatUsers: receiverData,

      // usersAll: [{
      //   authorId: authorId,
      //   users: receiverData
      // }],
    };
    try {
      // console.log("chatData :  ", chatData)
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id })
      // console.log("fullChatData", fullChat)
      return fullChat;
    } catch (error) {
      console.log("error", error)
    }
  }
}


//***************************** */

async function fetchChat(req) {
  const authorId = req.params.id;
  try {
    const query = {
      isBlock: false,
      'chatUsers.id': authorId
    };

    const fieldsToSelect = "id chatName isGroupChat isBlock chatUsers latestMessage";
    let result = await Chat.find(query).sort({ createdAt: "desc" }).select(fieldsToSelect)
      // .populate("latestMessage");
      .populate({
        path: 'latestMessage',
        match: { isVisible: true },
        select: 'messageContent mediaContent timestamp isVisible'
      });

    result = result.sort((a, b) => {
      if (a.latestMessage && b.latestMessage) {
        return new Date(b.latestMessage.timestamp) - new Date(a.latestMessage.timestamp);
      } else if (a.latestMessage) {
        return -1;
      } else if (b.latestMessage) {
        return 1;
      } else {
        return 0;
      }
    });

    return result;
  } catch (error) {
    console.log(error);
  }
}

// fetch block chats

async function fetchBlockChat(req) {
  const authorId = req.params.id;
  try {
    const query = {
      isBlock: true,
      'chatUsers.id': authorId
    };

    const fieldsToSelect = "id chatName isGroupChat isBlock blockByUser chatUsers latestMessage";
    const result = await Chat.find(query).sort({ createdAt: "desc" }).select(fieldsToSelect);
    // console.log("result", result)
    return result;
  } catch (error) {
    console.log(error);
  }
}


//**********************Send Message */

async function sendMessage(req) {
  const { authorId, messageContent, chatId, mediaContent } = req.body;

  // const chatId = '6645cdaf9ef46fb594be747c';
  // const messageContent = "hii Robert"

  if (!chatId || !authorId) {
    console.log("Invalid Data pass")
  }

  var newMessage = {
    sender: authorId,
    messageContent: messageContent,
    mediaContent: mediaContent,
    chat: chatId,
    isVisible: true
  }

  try {
    var message = await ChatMessage.create(newMessage);
    message = await message.populate({
      path: "chat",
      model: Chat,
    })
    // .populate({
    //   path: "latestMessage",
    //   model: ChatMessage,
    // })

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });
    // console.log("message", message)
    return message

  } catch (error) {
    console.log(error)
  }
}

async function allMessages(req) {
  const chatId = req.params.id;

  try {
    const message = await ChatMessage.find({ chat: chatId, isVisible: true })
      .populate({
        path: "chat",
        model: Chat,
      })
    // console.log("All message", message)
    return message

  } catch (error) {
    console.log(error)
  }
}

// User Block chat..
async function userChatBlock(req) {
  const chatId = req.params.id;
  const { isBlock, blockByUser } = req.body;
  try {
    const chat = await Chat.findByIdAndUpdate(chatId, { isBlock, blockByUser }, { new: true });
    //  console.log("update banner", banner)
    return chat;
  } catch (error) {
    console.log(error)
  }
}

// User Unblock chat..

async function userUnblockChat(req) {
  const chatId = req.params.id;
  const { isBlock, blockByUser } = req.body;
  try {
    const chat = await Chat.findByIdAndUpdate(chatId, { isBlock, blockByUser }, { new: true });
    //  console.log("update banner", banner)
    return chat;
  } catch (error) {
    console.log(error)
  }
}

// delete chat status

// User Block chat..
async function chatMessageDelete(req) {
  const id = req.params.id;
  const { isVisible } = req.body;
  try {
    const chatMessage = await ChatMessage.findByIdAndUpdate(id, { isVisible }, { new: true });
    //  console.log("update banner", banner)
    return chatMessage;
  } catch (error) {
    console.log(error)
  }
}

// remove from group
async function removeFromGroup(req) {
  const { chatId, userId } = req.body;
  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { chatUsers: { id: userId } } },
      { new: true }
    );
    return updatedChat;
  } catch (error) {
    console.log(error)
  }
}


// add Group User
async function addGroupMember(req) {
  const chatId = req.params.id;
  const { id, name, image_url, isGroupAdmin } = req.body;
  try {
    const chat = await Chat.findById(chatId);

    if (chat.chatUsers.length >= 20) {
      return "Cannot add more then 20 members to the chat.."
    }

    const addUser = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { chatUsers: { id, name, image_url, isGroupAdmin } } },
      { new: true });
    //  console.log("update banner", banner)
    return addUser
  } catch (error) {
    console.log(error)
  }
}

// Edit group name

async function updateGroupName(req) {
  // const chatId = req.params.id;
  const { chatId, groupName } = req.body;

  // console.log("chatId", chatId);
  // console.log("groupName", groupName);
  try {
    const chatData = await Chat.findByIdAndUpdate(chatId,
      { $set: { chatName: groupName } },
      { new: true }
    );
    return chatData;
  } catch (error) {
    console.log(error);
  }
}

// Create user token test..SATRT @@@@
async function zoomCreateUserToken(req) {
  const { clientId, clientSecret, account_id } = req.body
  const zoom_clientId = clientId.replace(/^"(.*)"[,]*$/, '$1');
  const zoom_clientSecret = clientSecret.replace(/^"(.*)"[,]*$/, '$1');

  var zoomCreateTokenUrl = `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${account_id}`;
  const authHeader = Buffer.from(`${zoom_clientId}:${zoom_clientSecret}`).toString('base64');
  console.log('authHeader=', authHeader);
  try {
    const response = await axios.post(zoomCreateTokenUrl, null, {
      headers: {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    // console.log("response", response.data)
    return response.data.access_token;
  } catch (err) {
    console.log("Error", err);
    return false;
    //if (!res.headersSent) {
    //  res.status(500).send(error.response ? error.response.data : error.message);
    //}
  }
}




// Create user token test..END @@@@

async function zoomAccessToken(req) {
  const code = req.params.id;
  try {
    if (code) {
      const redirectURL = "https://localhost:3000/zoom-authentication";
      const b = Buffer.from(
        process.env.ZOOM_API_KEY + ":" + process.env.ZOOM_API_SECRET
      );
      const url = `https://zoom.us/oauth/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirectURL}`;
      const response = await axios.post(url, null, {
        headers: {
          Authorization: `Basic ${b.toString("base64")}`,
        },
      });
      const data = response.data;
      return data;
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// *******************************************************************************
// *******************************************************************************
//Zoom Refresh Token
async function zoomRefreshToken(req) {
  const refresh_token = req.query.refresh_token;
  try {
    const response = await axios.post("https://zoom.us/oauth/token", null, {
      params: {
        grant_type: "refresh_token",
        refresh_token,
      },
      headers: {
        Authorization: `Basic ${Buffer.from(
          `${process.env.ZOOM_API_KEY}:${process.env.ZOOM_API_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const result = response.data;
    return result;
  } catch (err) {
    console.log("Err", err);
  }
}

// Create zoom user

async function createZoomUser(req) {

  console.log("createZoomUser function run")
  const { zoomAccessToken, email, first_name, last_name, display_name, password } = req.body;

  console.log("password", password)

  try {
    const url = 'https://api.zoom.us/v2/users';
    const config = {
      action: "custCreate", // "create" "autoCreate", "custCreate", and "ssoCreate".
      user_info: {
        email: email,
        type: 1,
        first_name: first_name,
        last_name: last_name,
        display_name: display_name,
        password: password,
        // feature: {
        //   zoom_phone: true,
        //   zoom_one_type: 16
        // },
        // plan_united_type: "1"
      }
    };

    const response = await axios.post(url, config, {
      headers: {
        Authorization: `Bearer ${zoomAccessToken}`,
      },
    });
    console.log('Zoom User created successfully:', response.data);


    if (response) {
      try {
        const responseUser = await axios.get('https://api.zoom.us/v2/users', {
          headers: {
            'Authorization': `Bearer ${zoomAccessToken}`,
            'Content-Type': 'application/json',
          },
        });
        console.log("List of users", responseUser.data.users)

      } catch (error) {
        console.log("error", error)
      }
    }

    // if (response) {

    //   // const url = `https://api.zoom.us/v2/users/${response.data.id}/meetings`

    //   // Lists of users is run....&&&&&
    //   try {
    //     const response = await axios.get('https://api.zoom.us/v2/users', {
    //       headers: {
    //         'Authorization': `Bearer ${zoomAccessToken}`,
    //         'Content-Type': 'application/json',
    //       },
    //     });

    //     const users = response.data.users;
    //     const id =  users.map(item => item.id);
    //     console.log('List of users:', users.map(item => item.id));

    //     // if (id) {
    //     //   try {
    //     //     const url = `https://api.zoom.us/v2/users/${id}/meetings`
    //     //     const meetingConfig = {
    //     //       topic: 'Test meeting',
    //     //       type: 1,
    //     //       // start_time: '2024-06-11T12:00:00Z',
    //     //       start_time: new Date().toISOString(),
    //     //       duration: 30,
    //     //       timezone: 'UTC',
    //     //       settings: {
    //     //         host_video: true,
    //     //         participant_video: true,
    //     //         join_before_host: true,
    //     //       }
    //     //     }
    //     //     const response = axios.post(url,
    //     //       meetingConfig,
    //     //       {
    //     //         headers: {
    //     //           Authorization: `Bearer ${zoomAccessToken}`,
    //     //         },
    //     //       }
    //     //     );
    //     //     // const result = response.data.data;
    //     //     console.log("result", response);
    //     //   } catch (error) {
    //     //     console.log("Error");
    //     //   }
    //     // }
    //   } catch (error) {
    //     console.error('Error listing users:', error.response.data);
    //   }


    //   // create meeting......

    //   // try {
    //   //   const meetingConfig = {
    //   //     topic: 'Test meeting',
    //   //     type: 1,
    //   //     // start_time: '2024-06-11T12:00:00Z',
    //   //     start_time: new Date().toISOString(),
    //   //     duration: 30,
    //   //     timezone: 'UTC',
    //   //     settings: {
    //   //       host_video: true,
    //   //       participant_video: true,
    //   //       join_before_host: true,
    //   //     }
    //   //   }
    //   //   const response = axios.post(url,
    //   //     meetingConfig,
    //   //     {
    //   //       headers: {
    //   //         Authorization: `Bearer ${zoomAccessToken}`,
    //   //       },
    //   //     }
    //   //   );
    //   //   // const result = response.data.data;
    //   //   console.log("result", response);

    //   // } catch (error) {
    //   //   console.log("Error");
    //   // }


    // }

    // return response

  } catch (error) {
    console.error('Error creating Zoom user:', error);
  }


}
// *******************************************************************************
// *******************************************************************************
//create zoom meeting

async function createZoomMeeting(req) {
  const { zoom_userId, zoomAccessToken } = req.body;

  console.log("zoomAccessToken", zoomAccessToken)
  console.log("zoom_userId", zoom_userId)
  const url = `https://api.zoom.us/v2/users/${zoom_userId}/meetings`;

  try {
    const meetingConfig = {
      topic: 'Test meeting',
      type: 1,
      // start_time: '2024-06-11T12:00:00Z',
      start_time: new Date().toISOString(),
      duration: 30,
      timezone: 'UTC',
      settings: {
        host_video: true,
        participant_video: true,
        join_before_host: true,
      }
    }
    const response = axios.post(url,
      meetingConfig,
      {
        headers: {
          Authorization: `Bearer ${zoomAccessToken}`,
        },
      }
    );
    const result = response.data.data;
    console.log("result", result);

  } catch (error) {
    console.log("Error", error);
  }

  // try {
  //   const meetingConfig = {
  //     topic: 'Test meeting',
  //     type: 1,  // Scheduled meeting
  //     start_time: '2024-06-11T12:00:00Z',
  //     // duration: 30,
  //     // timezone: 'UTC',
  //     settings: {
  //       host_video: true,
  //       participant_video: true,
  //       join_before_host: true,
  //       // host_key: '714884',
  //       // 714884
  //       // alternative_hosts: 'eynoashish@gmail.com',
  //       // host_email: "eynoapoorv@gmail.com"
  //     }
  //   };

  //   // const url = `https://api.zoom.us/v2/users/${zoom_userId}/meetings`;
  //   const url = 'https://api.zoom.us/v2/users/me/meetings';
  //   const response = await axios.post(url,
  //     meetingConfig,
  //     {
  //       headers: {
  //         Authorization: `Bearer ${zoomAccessToken}`,
  //       },
  //     }
  //   );
  //   const result = response.data;
  //   const meetingId = response.data.id


  //   console.log("meetingId", meetingId)

  //   const startMeetingResponse = await axios.post(`https://api.zoom.us/v2/meetings/${meetingId}/start`, null, {
  //     headers: {
  //       'Authorization': `Bearer ${zoomAccessToken}`,
  //       'Content-Type': 'application/json',
  //     },
  //   });

  //   console.log("startMeetingResponse", startMeetingResponse)
  //   console.log("result : ", result)
  //   return result;
  // } catch (err) {
  //   console.log("Err", err);
  // }
}

// *******************************************************************************
// *******************************************************************************
//add notification
async function addNotification(req) {
  const requestData = req.body;
  try {
    const notificationData = {
      userId: requestData.userId,
      serviceId: requestData.serviceId,
      message: requestData.message,
    };
    const data = await Notification.create(notificationData);
    const result = data;
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}
// *******************************************************************************
// *******************************************************************************
//get notification
async function getNotification(req) {
  const userId = req.params.userId;
  try {
    const result = await Notification.find(userId)
      .populate({
        path: "serviceId",
        model: Services,
        select: "name createdBy ",
      })
      .populate({ path: "userId", model: User, select: "name" })
      .sort({ createdAt: "desc" })
      .exec();
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}
// *******************************************************************************
// *******************************************************************************
//update Notification
async function updateNotification(req) {
  const _id = req.params.id;
  try {
    const result = await Notification.findOneAndUpdate(
      { _id },
      { read: true },
      { new: true }
    );
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
}

// *******************************************************************************
// *******************************************************************************
//deleteNotification
async function removeNotification(req) {
  try {
    const id = req.params.id;
    const result = await Notification.deleteOne({ _id: id });
    return result;
  } catch (error) {
    console.log(error);
  }
}


//User Contact-Us
async function userContactUs(param) {
  const email = param.email;

  const user = await User.findOne({ email });
  console.log("user", user)

  if (!user) {
    console.log("email address not found. Please try again.");
    return false;
  }

  const mailOptions = {

    from: `"Payearth Support" <${param.email}>`,
    replyTo: `${param.email}`,
    to: config.mail_from_email,
    subject: `"Contact Us Message from user" ${param.name}`,
    text: "You have received a message from " + user.name,
    html: `
  <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #555;">
  <!-- Header -->
  <div style="background-color: #6772E5; padding: 20px; text-align: center;">
    <img src="https://pay.earth:7700/uploads/logo.png" alt="Payearth" style="height: 40px;" />
  </div>

  <!-- Body -->
  <div style="padding: 20px; background-color: #f9f9f9;">
    <h2 style="color: #333;">New Contact Us Message from User ${user.name}</h2>

    <p>Hello Payearth Admin,</p>

    <p>You have received a new message from the contact us on payearth. Here are the details:</p>

    <div style="margin-bottom: 20px;">
      <p><strong>Name:</strong> ${param.name}</p>
      <p><strong>Email:</strong> ${param.email}</p>
    </div>

    <div style="padding: 10px; background-color: #fff; border: 1px solid #ddd; border-radius: 4px;">
      <p><strong>Message:</strong></p>
      <p>${param.message}</p>
    </div>

    <p>Please review the message and respond as needed.</p>

    <p style="font-style: italic;">— The Payearth Team</p>
  </div>

  <!-- Footer -->
  <div style="padding: 10px; background-color: #6772E5; text-align: center; font-size: 12px; color: #aaa;">
    <p>Payearth, 1234 Street Name, City, State, 12345</p>

    <p>&copy; ${new Date().getFullYear()} Payearth. All rights reserved.</p>
  </div>
  </div>
   `
  };


  try {
    await SendEmail(mailOptions);
    return mailOptions;
  } catch (error) {
    console.error("Error sending email:", error);
    return false
  }
}

//Support Email
async function userSupportEmail(param) {
  const email = param.email;
  const name = param.name;
  const message = param.message;

  const mailOptions = {

    from: `"Payearth Support" <${email}>`,
    replyTo: `${email}`,
    to: config.mail_from_email,
    subject: `"Support Message from user" ${name}`,
    text: `"You have received a message from " + ${name}`,
    html: `
  <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #555;">
  <!-- Header -->
  <div style="background-color: #6772E5; padding: 20px; text-align: center;">
    <img src="https://pay.earth:7700/uploads/logo.png" alt="Payearth" style="height: 40px;" />
  </div>

  <!-- Body -->
  <div style="padding: 20px; background-color: #f9f9f9;">
    <h2 style="color: #333;">New Support Message from User ${name}</h2>

    <p>Hello Payearth Admin,</p>

    <p>You have received a new message from the support on payearth. Here are the details:</p>

    <div style="margin-bottom: 20px;">
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
    </div>

    <div style="padding: 10px; background-color: #fff; border: 1px solid #ddd; border-radius: 4px;">
      <p><strong>Message:</strong></p>
      <p>${message}</p>
    </div>

    <p>Please review the message and respond as needed.</p>

    <p style="font-style: italic;">— The Payearth Team</p>
  </div>

  <!-- Footer -->
  <div style="padding: 10px; background-color: #6772E5; text-align: center; font-size: 12px; color: #aaa;">
    <p>Payearth, 1234 Street Name, City, State, 12345</p>

    <p>&copy; ${new Date().getFullYear()} Payearth. All rights reserved.</p>
  </div>
  </div>
   `
  };


  try {
    await SendEmail(mailOptions);
    return mailOptions;
  } catch (error) {
    console.error("Error sending email:", error);
    return false
  }
}

//Support-call-request
async function supportReqCall(req) {
  try {
    const { user_id, seller_id, name, email, phone, message, call_status } = req.body;

    const data = new Support({
      user_id,
      seller_id,
      name,
      email,
      phone,
      message,
      call_status
    });

    const result = await data.save();


    const mailOptions = {
      from: `"Payearth Support" <${email}>`,
      replyTo: `${email}`,
      to: config.mail_from_email,
      subject: `Support call request from user ${name}`,
      text: "",
      html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #555;">
        <!-- Header -->
        <div style="background-color: #6772E5; padding: 20px; text-align: center;">
          <img src="https://pay.earth:7700/uploads/logo.png" alt="Payearth" style="height: 40px;" />
        </div>

        <!-- Body -->
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333;">New Support call request from User ${name}</h2>
          <p>Hello Payearth Admin,</p>
          <p>You have received a new message from the support call request on Payearth. Here are the details:</p>

          <div style="margin-bottom: 20px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Call Status:</strong> ${call_status}</p>
          </div>

          <div style="padding: 10px; background-color: #fff; border: 1px solid #ddd; border-radius: 4px;">
            <p><strong>Message:</strong></p>
            <p>${message}</p>
          </div>

          <p>Please review the message and respond as needed.</p>
          <p style="font-style: italic;">— The Payearth Team</p>
        </div>

        <!-- Footer -->
        <div style="padding: 10px; background-color: #6772E5; text-align: center; font-size: 12px; color: #aaa;">
          <p>Payearth, 1234 Street Name, City, State, 12345</p>
          <p>&copy; ${new Date().getFullYear()} Payearth. All rights reserved.</p>
        </div>
      </div>
      `
    };

    await SendEmail(mailOptions);

    return result;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}


//Save My Profile
async function saveMyProfile(req) {
  const _id = req.params.id;
  const { original_image_url, original_image_id, image_url, image_id } = req.body;

  try {
    if (!original_image_url && !original_image_id && !image_url && !image_id) {
      console.error("Image not found.");
      return false;
    }

    const user = await User.findById(_id);
    if (!user) {
      console.error("User not found.");
      return false;
    }

    const updateData = {};
    if (original_image_url) updateData.original_image_url = original_image_url;
    if (original_image_id) updateData.original_image_id = original_image_id;
    if (image_url) updateData.image_url = image_url;
    if (image_id) updateData.image_id = image_id;

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedUser) {
      console.error("Failed to update user.");
      return false;
    }

    return updatedUser;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error updating profile data.");
  }
}


// getOrder

async function getProductOrder() {
  const result = await Order.find({ isActive: true, userId: authorId })
    .sort();
  if (result && result.length > 0) return result;
  return false;
}


async function getCartData(req) {
  const userId = req.params.id
  // console.log('getCartData-----', userId)
  try {
    const result = await Cart.find({ isActive: true, userId: userId })
      .sort()
      .populate('products.productId')
      .populate('products.discountId');

    if (result && result.length > 0) return result;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error getCart data.");
  }
}

async function updateCartData(req) {
  const { userId, cartFromRedux } = req.body
  // console.log('cartFromRedux-----', cartFromRedux)
  try {

    for (const product of cartFromRedux) {
      // Loop through all products in cartFromRedux
      const { id, quantity, price, discountId } = product;

      // Ensure `id` is mapped to `productId`
      const productId = id;

      // Check if the product already exists in the user's cart
      // Check if the product already exists in the cart
      let cart = await Cart.findOne({
        isActive: true,
        userId: userId,
        "products.productId": productId,
      });
      // console.log('cart data  --', cart)

      if (cart) {
        // Update the matching product in the cart
        // console.log('cart data  if--', cart)
        // await Cart.updateOne(
        //   { isActive: true, userId: userId, "products.productId": productId },
        //   {
        //     $set: {
        //       "products.$.quantity": product.quantity,
        //       "products.$.price": product.price,
        //       "products.$.discountId": product.discountId || null,
        //     },
        //   }
        // );
      } else {
        // Add the product to the cart if not found
        // console.log('cart data  else--', cart)
        cart = new Cart({
          userId: userId,
          isActive: true,
          products: [{
            productId: product.id,
            quantity: product.quantity,
            price: product.price,
            discountId: product.discountId || null,
          }],
        });

        await cart.save();
      }
    }

    return { message: "Cart updated successfully" };
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error updating cart data.");
  }
}