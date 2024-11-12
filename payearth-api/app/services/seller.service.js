const config = require("../config/index");
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || config.connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;
const stripe = require("stripe")(
  "sk_test_51OewZgD2za5c5GtO7jqYHLMoDerwvEM69zgVsie3FNLrO0LLSLwFJGzXv4VIIGqScWn6cfBKfGbMChza2fBIQhsv00D9XQRaOk"
);

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const fs = require("fs");

const ffmpeg = require("fluent-ffmpeg");
const ffmpeg_static = require("ffmpeg-static");
const LocationData = require("countrycitystatejson");
const SendEmail = require("../helpers/email")

const {
  User,
  Seller,
  Admin,
  Product,
  Brand,
  Category,
  ServiceVideo,
  CryptoConversion,
  OrderStatus,
  Payment,
  Order,
  OrderTrackingTimeline,
  Color,
  NeedHelp,
  SellerContactUs,
  ProductSales,
  Review,
  Services,
  OrderDetails,
  Servicedetails,
  Calendar,
  bannerAdvertisement,
  subscriptionPlan,
  Chat,
  ChatMessage,
  Notification,
  Post,
  PostLike,
  PostImages,
  PostVideos,
  PostComment,
  ReportPost,
  Support,
  Ticket,
  TicketMessage,
} = require("../helpers/db");

module.exports = {
  authenticate,
  getCountries,
  getStatesByCountry,
  getById,
  getUserByRole,
  signup,
  socialLogin,
  changePass,
  forgotPass,
  resetPass,
  getListedProducts,
  getProductById,
  addProduct,
  getProductStock,
  productStatus,
  editProduct,
  addFeaturedImage,
  getStockItems,
  getOrders,
  getPayments,
  getOrderById,
  productStatusUpdate,
  getColors,
  getCategories,
  getBrands,
  needHelp,
  contactUs,
  getDashboardCounters,
  getProductSales,
  getSalesLineChartData,
  getTopSellingCategoryChartData,
  createSubscription,
  savepaymentdata,
  saveOrder,
  saveOrdertrackingTime,
  updateOrderStatus,
  saveorderdetails,
  getOrderStatus,
  getNewCoupons,
  addService,
  editService,
  getListedServices,
  getServiceById,
  addServicesFeaturedImage,
  serviceStatusUpdate,
  getServiceItems,
  getServiceStatus,
  getServiceData,
  saveCalendarEvents,
  getSellerCalendarEvents,
  delSellerCalendarEvents,
  sellerServiceOrders,
  seller_contactUs,
  createSellerBanner,
  getBannersBySellerId,
  deleteBanner,
  getBannerById,
  updateBanner,
  createSellerSubscriptionPlan,
  sellerAddPlan,
  getSubscriptionPlanBySeller,
  reduseCount,
  sellerReduceCount,
  updateSubscriptionStatus,
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
  removeNotification,
  addPost,
  getPosts,
  addPostImages,
  addPostVideos,
  addPostLike,
  getPostComments,
  addPostComment,
  followUser,
  unfollowUser,
  postDelete,
  updatePost,
  getCategories,
  getPostById,
  createPostReport,
  getUserorSellerData,
  communityUserBlock,
  communityUserUnblock,
  editProfileImage,
  sellerSupportEmail,
  supportReqCall,
  getProfileById,
  saveMyProfile,
  editProfile,
  supportOpenTicket,
  getAllOpenTicket,
  getOpenedTicketMessage,
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

async function signup(req) {
  // const file = req.file;
  const param = req.body;

  // var fullUrl = '';

  if (await Seller.findOne({ email: param.email })) {
    throw 'email "' + param.email + '" is already taken';
  }

  // if (typeof file != "undefined") {
  //     fullUrl = file.destination + "/" + file.filename;
  // }

  const address_data = {
    address: param.address,
    country: param.country,
    state: param.state,
  };
  const seller = new Seller({
    name: param.name,
    email: param.email,
    password: bcrypt.hashSync(param.password, 10),
    seller_type: param.seller_type,
    want_to_sell: param.want_to_sell,
    //pdf_url: fullUrl,
    full_address: address_data,
    isActive: true,
  });

  //Email send functionality.
  const mailOptions = {
    from: `"Payearth Support" <${config.mail_from_email}>`,
    replyTo: `${config.mail_from_email}`,
    to: seller.email,
    subject: `Welcome to Payearth, ${seller.name}!`,
    text: "",
    html:
      `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #555;">
  <!-- Header -->
  <div style="background-color: #6772E5; padding: 20px; text-align: center;">
    <img src="https://pay.earth:7700/uploads/logo.png" alt="Payearth" style="height: 40px;" />
  </div>

  <!-- Body -->
  <div style="padding: 20px; background-color: #f9f9f9;">
    <h2 style="color: #333;">Seller Registration Successful!</h2>

    <p>Dear <b>${seller.name}</b>,</p>

    <p>You are successfully registered as a seller on Payearth. We are thrilled to have you join our marketplace!</p>

    <p>Start adding your products and services to reach customers worldwide. If you have any questions or need assistance, feel free to contact us anytime.</p>

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

  const data = await seller.save();
  if (data) {
    let res = await Seller.findById(data.id).select(
      "-password -community -social_accounts -reset_password -pdf_url -phone"
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
  const seller = await Seller.findOne({ email });
  if (seller && bcrypt.compareSync(password, seller.password)) {
    const {
      password,
      reset_password,
      __v,
      createdAt,
      updatedAt,
      social_accounts,
      ...userrWithoutHash
    } = seller.toObject();
    const token = jwt.sign({ id: seller.id }, config.secret, {
      expiresIn: "2h",
    });
    var expTime = new Date();
    expTime.setHours(expTime.getHours() + 2); //2 hours token expiration time
    //expTime.setMinutes(expTime.getMinutes() + 2);
    expTime = expTime.getTime();
    return {
      ...userrWithoutHash,
      token,
      expTime,
    };
  }
}

async function socialLogin(req) {
  var param = req.body;

  var input = {
    role: "seller",
    seller_type: "retailer",
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

  //check for existing seller

  var whereCondition = {};

  whereCondition["$and"] = andConditon;

  if (orCondition && orCondition.length > 0) {
    whereCondition["$or"] = orCondition;
  }

  var seller = await Seller.findOne(whereCondition);

  if (seller) {
    //check for existing social login data
    var flag = 0;

    if (
      param.provider_type == "google" &&
      seller.social_accounts.google.google_id == null
    ) {
      flag = 1;
    } else if (
      param.provider_type == "facebook" &&
      seller.social_accounts.facebook.facebook_id == null
    ) {
      flag = 1;
    } else if (
      param.provider_type == "twitter" &&
      seller.social_accounts.twitter.twitter_id == null
    ) {
      flag = 1;
    }

    if (flag === 1) {
      Object.assign(seller, input);
      await seller.save();
    }

    const {
      password,
      reset_password,
      __v,
      createdAt,
      updatedAt,
      social_accounts,
      ...userWithoutHash
    } = seller.toObject();
    const token = jwt.sign({ id: seller.id }, config.secret, {
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
    const sellerData = new Seller(input);

    const data = await sellerData.save();

    if (data) {
      const seller = await Seller.findById(data.id);

      if (seller) {
        //Email send functionality.
        const mailOptions = {
          from: `"Payearth Support" <${config.mail_from_email}>`,
          replyTo: `${config.mail_from_email}`,
          to: seller.email,
          subject: `Welcome to Payearth, ${seller.name}!`,
          text: "",
          html:
            ` <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #555;">
              <!-- Header -->
              <div style="background-color: #6772E5; padding: 20px; text-align: center;">
                <img src="https://pay.earth:7700/uploads/logo.png" alt="Payearth" style="height: 40px;" />
              </div>
          
              <!-- Body -->
              <div style="padding: 20px; background-color: #f9f9f9;">
                <h2 style="color: #333;">Welcome to Payearth, ${seller.name}!</h2>
          
                <p>Dear <b>${seller.name}</b>,</p>
          
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
        const {
          password,
          reset_password,
          __v,
          createdAt,
          updatedAt,
          social_accounts,
          ...userWithoutHash
        } = seller.toObject();
        const token = jwt.sign({ id: seller.id }, config.secret, {
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

async function getCountries() {
  try {
    const countries = LocationData.getCountries();

    if (countries) {
      const result = [];
      for (let i = 0; i < countries.length; i++) {
        result.push({
          code: countries[i].shortName,
          country: countries[i].name,
        });
      }
      return result;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

async function getStatesByCountry(req) {
  let country = req.body.country_code;
  const states = LocationData.getStatesByShort(country);

  if (states) {
    return states;
  } else {
    return false;
  }
}

async function forgotPass(param) {
  const email = param.email;
  const seller = await Seller.findOne({ email });

  if (seller) {
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

    Object.assign(seller, input);

    // Email send functionality.
    let app_url =
      config.app_env === "local"
        ? config.react_local_url
        : config.react_dev_url;
    let url =
      app_url +
      "/seller/reset-password?t=resetpass&u=" +
      seller.id +
      "&hash=" +
      verif_code;

    const mailOptions = {
      from: `"Payearth Support" <${config.mail_from_email}>`,
      replyTo: `${config.mail_from_email}`,
      to: seller.email,
      subject: "Verification link generated for reset password.",
      text: "",
      html:
        `<div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #555;">
  <!-- Header -->
  <div style="background-color: #6772E5; padding: 20px; text-align: center;">
    <img src="https://yourwebsite.com/logo.png" alt="Payearth" style="height: 40px;" />
  </div>

  <!-- Body -->
  <div style="padding: 20px; background-color: #f9f9f9;">
    <h2 style="color: #333;">Password Reset Verification</h2>

    <p>Dear <b>${seller.name}</b>,</p>

    <p>You requested a password reset. Please click the link below to reset your password:</p>

    <div style="text-align: center; margin: 20px 0;">
      <a href="${url}" target="_blank" style="display: inline-block; padding: 10px 20px; font-size: 16px; color: #fff; background-color: #6772E5; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
    </div>

    <p>This link will expire in 7 days.</p>

    <p>If you didn't request a password reset, please ignore this email.</p>

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

    const data = await seller.save();

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
  const seller = await Seller.findById(id);
  const now = new Date();

  if (
    seller &&
    seller.reset_password.verif_code == param.code &&
    seller.reset_password.code_valid_at >= now
  ) {
    var verif_code = "";
    var code_valid_at = null;
    var is_pass_req = false;

    if (param.password === param.password_confirmation) {
      var password = bcrypt.hashSync(param.password, 10);
    } else {
      throw msg.seller.password.confirm_pass_err;
    }

    const input = {
      reset_password: {
        code_valid_at: code_valid_at,
        verif_code: verif_code,
        is_pass_req: is_pass_req,
      },
      password: password,
    };

    Object.assign(seller, input);

    const data = await seller.save();

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
  const seller = await Seller.findById(id).select("-password");
  if (!seller) return false;
  return seller;
}

async function getUserByRole(param) {
  const seller = await Seller.findOne({ _id: param.id, role: param.role });
  if (!seller) return false;
  return seller;
}

async function changePass(id, param) {
  if (!param) throw msg.common.invalid;

  const seller = await Seller.findById(id);

  if (!seller) {
    return false;
  } else {
    //check old password
    if (bcrypt.compareSync(param.old_password, seller.password)) {
      if (param.password === param.password_confirmation) {
        param.password = bcrypt.hashSync(param.password, 10);
      } else {
        throw msg.seller.password.confirm_pass_err;
      }
      Object.assign(seller, { password: param.password });
      await seller.save();
      return seller;
    } else {
      throw msg.seller.password.old_pass_err;
    }
  }
}

async function getListedProducts(req) {
  try {
    var param = req.body;
    var id = req.params.id; //seller id
    var sortOption = { createdAt: "desc" }; //default
    var page = 0;
    var limit = 5;
    var skip = 0;
    var whereCondition = { createdBy: id, isService: false };

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
      select: "id name price featuredImage isService isActive cryptoPrices",
      sort: sortOption,
      populate: [
        {
          path: "cryptoPrices",
          model: CryptoConversion,
          select: "name code cryptoPriceUSD",
          match: { isActive: true, asCurrency: true },
        },
      ],
      lean: true,
      page: page,
      offset: skip,
      limit: limit,
    };

    const result = await Product.paginate(whereCondition, options).then(
      (data) => {
        let res = {
          products: data.docs,
          paginationData: {
            totalProducts: data.totalDocs,
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
    if (result.products && result.products.length > 0) {
      return result;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

async function getProductById(id) {
  const product = await Product.findById(id)
    .select(
      "name category sub_category brand description specifications color_size tier_price price images quantity isService isActive createdAt featuredImage"
    )
    .populate([
      {
        path: "cryptoPrices",
        model: CryptoConversion,
        select: "name code cryptoPriceUSD",
        match: { isActive: true, asCurrency: true },
      },
      {
        path: "brand",
        model: Brand,
        select: "id brandName",
      },
      {
        path: "category",
        model: Category,
        select: "id categoryName",
      },
      {
        path: "sub_category",
        model: Category,
        select: "id categoryName",
      },
    ]);

  if (!product) {
    return false;
  } else {
    //get product sales data
    const sales = await ProductSales.findOne({ productId: product.id })
      .select("totalSalesCount")
      .exec();

    let result = {
      product: product,
      sales: sales,
    };
    return result;
  }
}

async function addProduct(req) {
  try {
    const { body: param } = req;

    let images = typeof param.images === 'string' ? JSON.parse(param.images) : param.images;
    const lName = param.name.toLowerCase();
    let colorSizeArr = [];
    let tierPriceArr = [];
    let stockQty = 0;

    // Check if the name is already taken
    if (await Product.findOne({ lname: lName })) {
      throw new Error(`Name "${param.name}" is already taken`);
    }

    // Process color_size array
    if (Array.isArray(param.color_size)) {
      for (let item of param.color_size) {
        if (item.size && item.color) {
          colorSizeArr.push({ size: item.size, color: item.color });
        } else {
          throw new Error("Each color_size entry must include both 'size' and 'color' properties.");
        }
      }
    }

    // Process tier_price array and calculate stock quantity
    if (param.tier_price) {
      for (let tp of param.tier_price) {
        const qty = Number(tp.qty);
        stockQty += qty;
        tierPriceArr.push({ qty, price: Number(tp.price) });
      }
    }

    const qtyObj = { selling_qty: 0, stock_qty: stockQty };

    let input = {
      name: param.name,
      lname: lName,
      category: param.category,
      sub_category: param.sub_category || null,
      brand: param.brand,
      description: param.description,
      specifications: param.specifications,
      price: Number(param.price),
      color_size: colorSizeArr,
      tier_price: tierPriceArr,
      images,
      quantity: qtyObj,
      createdBy: param.seller_id,
      updatedBy: param.seller_id,
      isActive: true
    };

    const product = new Product(input);
    const data = await product.save();

    if (data) {
      const res = await Product.findById(data.id).select(
        "name category sub_category brand description specifications color_size tier_price price images quantity isService isActive"
      );
      return res || false;
    }
    return false;
  } catch (error) {
    console.error("Error adding product:", error.message);
    throw error; // Re-throw the error for upstream handling
  }
}

async function getProductStock(req) {

  const { authId, status } = req.query;

  try {
    const query = {
      isActive: status,
      createdBy: authId
    };
    const fieldsToSelect = "id productCode name category sub_category brand featuredImage quantity isActive";
    let result = await Product.find(query).sort({ createdAt: "desc" }).select(fieldsToSelect)
      .populate({
        path: 'category',
        match: { isVisible: true },
        select: 'categoryName isActive'
      })
      .populate({
        path: 'brand',
        match: { isVisible: true },
        select: 'brandName'
      })

    return result;
  } catch (error) {
    console.log(error);
  }
}

async function productStatus(req) {
  const id = req.params.id;
  const param = req.body;
  const product = await Product.findById(id);
  if (!product) {
    return false;
  } else {
    const input = {
      "isActive": param.isActive
    };
    Object.assign(product, input);
    if (await product.save()) {
      return await Product.findById(id).select();
    }
  }
}





async function editProduct(req) {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) return false;
    const param = req.body;
    let images = typeof param.images === 'string' ? JSON.parse(param.images) : param.images;
    var lName = param.name.toLowerCase();
    var colorSizeArr = [];
    var tierPriceArr = [];
    var stockQty = 0;

    if (
      product.lname !== lName &&
      (await Product.findOne({ lname: lName, isService: false }))
    ) {
      throw 'Product Name "' + param.name + '" already exists.';
    }

    if (param.old_images) {
      for (var oi in param.old_images) {
        old_images.push(oi);
      }
    }

    // Process color_size array
    if (Array.isArray(param.color_size)) {
      for (let item of param.color_size) {
        if (item.size && item.color) {
          colorSizeArr.push({ size: item.size, color: item.color });
        } else {
          throw new Error("Each color_size entry must include both 'size' and 'color' properties.");
        }
      }
    }

    if (param.tier_price) {
      for (var tp in param.tier_price) {
        let tpArr = param.tier_price[tp];
        let qty = Number(tpArr.qty);
        stockQty += qty;
        tierPriceArr.push({ qty: qty, price: Number(tpArr.price) });
      }
    }

    let qtyObj = { selling_qty: 0, stock_qty: stockQty };

    let input = {
      name: param.name,
      lname: lName,
      category: param.category,
      sub_category: param.sub_category || null,
      brand: param.brand,
      description: param.description,
      specifications: param.specifications,
      price: Number(param.price),
      color_size: colorSizeArr,
      tier_price: tierPriceArr,
      price: param.price,
      images,
      quantity: qtyObj,
      updatedBy: param.seller_id,
    };

    if (param.sub_category !== "") {
      input["sub_category"] = param.sub_category;
    }

    Object.assign(product, input);

    const data = await product.save();

    if (data) {
      let res = await Product.findById(data.id).select(
        "name category sub_category brand description specifications color_size tier_price price images"
      );

      if (res) {
        return res;
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

function checkForColor(obj, key) {
  var result = false;
  result = key in obj;
  return result;
}

async function addFeaturedImage(req) {
  var file = req.file;
  var param = req.body;
  console.log("params fetaure image", param);
  const id = param.id;
  const imgUrl = param.file;

  const data = await Product.findById(id);

  if (!data) return false;

  // if (typeof file != "undefined") {
  //   if (fs.existsSync(data.featuredImage)) {
  //     fs.unlinkSync(data.featuredImage);
  //   }

  //   imgUrl = file.destination + "/" + file.filename;
  // } else {
  //   imgUrl = data.featuredImage;
  // }

  const input = {
    featuredImage: imgUrl,
    updatedAt: new Date().toISOString(),
  };

  Object.assign(data, input);

  const result = await data.save();

  if (result) {
    return await Product.findById(id).select("id featuredImage isService");
  } else {
    return false;
  }
}

async function getStockItems(req) {
  //Product or  Service : added / pending / reject
  try {
    var param = req.body;
    var id = req.params.id; //seller id
    var selectColumn =
      "id productCode name brand quantity category isActive approveStatus isService";
    var sortOption = { createdAt: "desc" }; //default
    var statusType = param.filter.type ? param.filter.type : "none";
    var isService = param.filter.is_service ? param.filter.is_service : false;
    var page = 0;
    var limit = 5;
    var skip = 0;
    var whereCondition = {
      createdBy: id,
      isService: isService,
      approveStatus: statusType,
    };

    if (statusType == "none") {
      selectColumn =
        "id productCode name brand quantity category isActive approveStatus isService";
    } else if (statusType == "pending") {
      selectColumn =
        "id productCode name brand quantity.stock_qty category isActive approveStatus isService";
    } else if (statusType == "reject") {
      selectColumn =
        "id productCode name brand category isActive approveStatus isService";
    }

    if (param.count) {
      page = parseInt(param.count.page);
      limit = parseInt(param.count.limit);
      skip = parseInt(param.count.skip);
    }

    var options = {
      select: selectColumn,
      sort: sortOption,
      populate: [
        {
          path: "brand",
          model: Brand,
          select: "brandName",
        },
        {
          path: "category",
          model: Category,
          select: "categoryName",
        },
      ],
      lean: true,
      page: page,
      offset: skip,
      limit: limit,
    };

    const result = await Product.paginate(whereCondition, options).then(
      (data) => {
        let res = {
          items: data.docs,
          paginationData: {
            totalItems: data.totalDocs,
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
    if (result.items && result.items.length > 0) {
      return result;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

async function productStatusUpdate(req) {
  try {
    const param = req.body;
    const id = param.product_id;
    const product = await Product.findById(id);

    if (!product) {
      return false;
    } else {
      const input = {
        isActive: param.is_active,
        updatedBy: param.seller_id,
        updatedAt: new Date().toISOString(),
      };

      Object.assign(product, input);

      if (await product.save()) {
        return true;
      }
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

async function getOrders(req) {
  //pending, ongoing, cancel and refund, complete orders of product/service
  try {
    var param = req.body;
    var id = req.params.id; //user id
    var sortOption = { createdAt: "desc" }; //default
    var page = 0;
    var limit = 5;
    var skip = 0;
    var orArr = [{ lname: "pending" }]; //default
    var statusOrArray = [];
    var timelineOrArray = [];
    var isService = param.filter.is_service ? param.filter.is_service : false;
    var whereCondition = {};

    //get id of order status
    if (param.filter.type == "pending") {
      orArr = [{ lname: "pending" }];
    } else if (param.filter.type == "ongoing") {
      orArr = [
        { lname: "processing" },
        { lname: "packed" },
        { lname: "shipped" },
        { lname: "delivered" },
      ];
    } else if (param.filter.type == "cancel_refund") {
      orArr = [
        { lname: "cancelled" },
        { lname: "refunded" },
        { lname: "declined" },
        { lname: "disputed" },
        { lname: "failed" },
        { lname: "returned" },
        { lname: "return_request" },
        { lname: "cancel_request" },
      ];
    } else if (param.filter.type == "complete") {
      orArr = [{ lname: "completed" }];
    }

    var statuses = await OrderStatus.find({ $or: orArr })
      .select("id lname")
      .exec();

    if (statuses && statuses.length > 0) {
      for (var i = 0; i < statuses.length; i++) {
        let id = statuses[i]._id;
        let el = { orderStatusId: id };
        statusOrArray.push(el);
      }

      var timelines = await OrderTrackingTimeline.find({ $or: statusOrArray })
        .select("id")
        .exec();

      if (timelines && timelines.length > 0) {
        for (var j = 0; j < timelines.length; j++) {
          let x = timelines[j]._id;
          timelineOrArray.push(x);
        }
      }
    }

    if (timelineOrArray.length > 0) {
      whereCondition = {
        $and: [
          { sellerId: id },
          { isActive: true },
          { isService: isService },
          { orderStatus: { $in: timelineOrArray } },
        ],
      };
    } else {
      return false;
    }

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
          select: "id productCode name isService isActive",
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
          select: "id orderStatusId",
          populate: {
            path: "orderStatusId",
            model: OrderStatus,
            select: "lname title",
          },
        },
        {
          path: "paymentId",
          model: Payment,
          select: "paymentMode amountPaid",
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

async function getPayments(req) {
  try {
    var param = req.body;
    var id = req.params.id; //seller id
    var sortOption = { createdAt: "desc" }; //default
    var page = 0;
    var limit = 5;
    var skip = 0;
    var whereCondition = { sellerId: id, isActive: true };

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
        "id orderId userId amountPaid paymentMode paymentAccount isActive createdAt",
      sort: sortOption,
      populate: [
        {
          path: "orderId",
          model: Order,
          select: "id orderCode productId",
          populate: {
            path: "productId",
            model: Product,
            select: "id name featuredImage isService",
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

async function getOrderById(id) {
  try {
    const order = await Order.findById(id)
      .select(
        "id orderCode productId userId amount product_sku isActive orderStatus createdAt"
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
      let orderTimeline = await OrderTrackingTimeline.find({
        orderId: order.id,
      })
        .select("orderId orderStatusId updatedAt")
        .populate("orderStatusId", "id lname title", { isActive: true });

      //get payment data
      let payment = await Payment.findOne({
        orderId: order.id,
        userId: order.userId._id,
      })
        .select("invoiceNo invoiceUrl amountPaid paymentMode paymentAccount")
        .exec();

      let result = {
        order: order,
        orderTimeline: orderTimeline,
        payment: payment,
      };
      return result;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

async function getColors() {
  try {
    const result = await Color.find({ isActive: true })
      .select("colorName lname code")
      .sort({ createdAt: "desc" });
    var colors = {};
    if (result && result.length > 0) {
      for (var i = 0; i < result.length; i++) {
        colors[result[i].lname] = result[i].code;
      }
      return colors;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

async function getCategories(req) {
  var param = req.body;
  var parent = param.parent ? param.parent : null;

  const result = await Category.find({
    isActive: true,
    isService: param.is_service,
    parent: parent,
  })
    .select("id categoryName isService")
    .sort({ createdAt: "desc" });

  if (result && result.length > 0) return result;
  return false;
}

async function getBrands() {
  const result = await Brand.find({ isActive: true })
    .select("id brandName")
    .sort({ createdAt: "desc" });

  if (result && result.length > 0) return result;

  return false;
}

async function needHelp(req) {
  const param = req.body;

  const needhelp = new NeedHelp({
    reason: param.reason,
    comment: param.comment,
    sellerId: param.seller_id,
    isActive: true,
  });

  const data = await needhelp.save();

  if (data) {
    let res = await NeedHelp.findById(data.id).select(
      "id reason comment isActive"
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

async function contactUs(req) {
  const param = req.body;

  const result = new SellerContactUs({
    name: param.name,
    email: param.email,
    message: param.message,
    sellerId: param.seller_id,
    isActive: true,
  });

  const data = await result.save();

  if (data) {
    let res = await SellerContactUs.findById(data.id).select(
      "id name email message isActive"
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

async function getDashboardCounters(id) {
  try {
    //to get count of total products of seller
    const totalProducts = await Product.find({
      isActive: true,
      isService: false,
      createdBy: id,
    }).countDocuments();

    //to get count of total services of seller
    const totalServices = await Product.find({
      isActive: true,
      isService: true,
      createdBy: id,
    }).countDocuments();

    //to get count of total orders of seller
    const totalOrders = await Order.find({
      isActive: true,
      sellerId: id,
    }).countDocuments();

    //to get sum of payments amount of seller
    const sellerId = mongoose.Types.ObjectId(id);
    const totalPaymentAmount = await Payment.aggregate([
      {
        $match: {
          sellerId: sellerId,
          isActive: true,
        },
      },
      {
        $group: {
          _id: "$id",
          total: {
            $sum: "$amountPaid",
          },
        },
      },
    ]);

    let result = {
      totalOrders: totalOrders,
      totalPaymentAmount:
        totalPaymentAmount && totalPaymentAmount[0]
          ? totalPaymentAmount[0].total
          : 0,
      totalProducts: totalProducts,
      totalServices: totalServices,
    };
    return result;
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

async function getProductSales(req) {
  try {
    var param = req.body;
    var id = req.params.id; //seller id
    var sortOption = { createdAt: "desc" }; //default
    var page = 0;
    var limit = 5;
    var skip = 0;
    var whereCondition = { sellerId: id, isActive: true };

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
      select: "id productId profitAmount revenueAmount totalSalesCount",
      sort: sortOption,
      populate: [
        {
          path: "productId",
          model: Product,
          select:
            "id name featuredImage isService reviewCount price cryptoPrices",
          populate: {
            path: "cryptoPrices",
            model: CryptoConversion,
            select: "name code cryptoPriceUSD",
            match: { isActive: true, asCurrency: true },
          },
        },
      ],
      lean: true,
      page: page,
      offset: skip,
      limit: limit,
    };

    const result = await ProductSales.paginate(whereCondition, options).then(
      (data) => {
        let res = {
          sales: data.docs,
          paginationData: {
            totalSales: data.totalDocs,
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
    if (result.sales && result.sales.length > 0) {
      return result;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

async function getSalesLineChartData(req) {
  try {
    var conditionData = getConditionData(req);

    var res = await ProductSales.aggregate(conditionData);

    if (res && res.length > 0) {
      if (req.body.filter_type == "month") {
        let obj = res[0].sales;
        res = Object.keys(obj).map((key) => [key, obj[key]]);
      }
      const result = {
        result: res,
        filter_type: req.body.filter_type,
      };
      return result;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

function getConditionData(req) {
  var param = req.body;
  var sellerId = mongoose.Types.ObjectId(req.params.id);
  var filter_type = param.filter_type; //month, year, week
  var dateVal =
    param.date_value && param.date_value !== ""
      ? new Date(param.date_value)
      : new Date();

  if (filter_type === "month") {
    const firstMonth = 1;
    const lastMonth = 12;
    const monthsArray = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    let today = new Date();
    let year = today.getFullYear();
    let yearVal = new Date(year, 0, 2); //first date of startYear

    return [
      {
        $match: {
          sellerId: sellerId,
          createdAt: { $gte: yearVal, $lte: today },
        },
      },
      {
        $group: {
          _id: { year_month: { $substrCP: ["$createdAt", 0, 7] } },
          count: { $sum: "$totalSalesCount" },
        },
      },
      {
        $sort: { "_id.year_month": 1 },
      },
      {
        $project: {
          _id: 0,
          count: 1,
          month_year: {
            $concat: [
              {
                $arrayElemAt: [
                  monthsArray,
                  {
                    $subtract: [
                      { $toInt: { $substrCP: ["$_id.year_month", 5, 2] } },
                      1,
                    ],
                  },
                ],
              },
              "-",
              { $substrCP: ["$_id.year_month", 0, 4] },
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          data: { $push: { k: "$month_year", v: "$count" } },
        },
      },
      {
        $addFields: {
          start_year: { $substrCP: [yearVal, 0, 4] },
          end_year: { $substrCP: [today, 0, 4] },
          months1: {
            $range: [
              { $toInt: { $substrCP: [yearVal, 5, 2] } },
              { $add: [lastMonth, 1] },
            ],
          },
          months2: {
            $range: [
              firstMonth,
              { $add: [{ $toInt: { $substrCP: [today, 5, 2] } }, 1] },
            ],
          },
        },
      },
      {
        $addFields: {
          template_data: {
            $concatArrays: [
              {
                $map: {
                  input: "$months1",
                  as: "m1",
                  in: {
                    count: 0,
                    month_year: {
                      $concat: [
                        {
                          $arrayElemAt: [
                            monthsArray,
                            { $subtract: ["$$m1", 1] },
                          ],
                        },
                        "-",
                        "$start_year",
                      ],
                    },
                  },
                },
              },
              {
                $map: {
                  input: "$months2",
                  as: "m2",
                  in: {
                    count: 0,
                    month_year: {
                      $concat: [
                        {
                          $arrayElemAt: [
                            monthsArray,
                            { $subtract: ["$$m2", 1] },
                          ],
                        },
                        "-",
                        "$end_year",
                      ],
                    },
                  },
                },
              },
            ],
          },
        },
      },
      {
        $addFields: {
          data: {
            $map: {
              input: "$template_data",
              as: "t",
              in: {
                k: "$$t.month_year",
                v: {
                  $reduce: {
                    input: "$data",
                    initialValue: 0,
                    in: {
                      $cond: [
                        { $eq: ["$$t.month_year", "$$this.k"] },
                        { $add: ["$$this.v", "$$value"] },
                        { $add: [0, "$$value"] },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          sales: { $arrayToObject: "$data" },
          _id: 0,
        },
      },
    ];
  } else if (filter_type === "year") {
    let today = new Date();
    let year = today.getFullYear();
    let yearBefore = new Date(year - 9, 0, 2); //first date of yearBefore

    //var yearsArray = ["2021", "2020", "2019", "2018", "2017", "2016", "2015", "2014", "2013", "2012"];

    return [
      {
        $match: {
          sellerId: sellerId,
          createdAt: { $gte: yearBefore, $lte: today },
        },
      },
      {
        $group: {
          _id: { $substrCP: ["$createdAt", 0, 4] },
          count: { $sum: "$totalSalesCount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ];
  } else if (filter_type === "week") {
    let end = dateVal;
    let start = getMonday(end); //first date of week

    const weeksArray = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    return [
      {
        $match: {
          sellerId: sellerId,
          createdAt: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: {
            $concat: [
              {
                $arrayElemAt: [
                  weeksArray,
                  { $subtract: [{ $toInt: { $dayOfWeek: "$createdAt" } }, 1] },
                ],
              },
            ],
          },
          count: { $sum: "$totalSalesCount" },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ];
  }
}

async function getTopSellingCategoryChartData(req) {
  try {
    var id = req.params.id;
    var sales = await ProductSales.find({ sellerId: id, isActive: true })
      .select("productId")
      .populate([
        {
          path: "productId",
          model: Product,
          select: "category",
        },
      ])
      .exec();
    const totalSales = sales.length;

    if (sales && sales.length > 0) {
      var categoryArr = [];

      for (var i = 0; i < sales.length; i++) {
        let id = sales[i].productId.category;
        categoryArr.push(id);
      }

      const counts = {};
      categoryArr.forEach(function (x) {
        counts[x] = (counts[x] || 0) + 1;
      });

      var sortable = [];
      var cats = [];
      for (var count in counts) {
        sortable.push([count, counts[count]]);
      }

      sortable.sort(function (a, b) {
        return b[1] - a[1];
      });

      let mylength = sortable.length;
      for (x = 0; x < mylength; x++) {
        let id = sortable[x][0];
        let category = await Category.findById(id)
          .select("categoryName")
          .exec();

        //console.log('category' + x, category);
        let count = sortable[x][1];
        // let per = (count / totalSales) * 100;
        // per = per.toFixed(2);
        cats.push({ id: id, name: category.categoryName, count: count });
      }

      return cats;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

//Services

async function getListedServices(req) {
  try {
    var param = req.body;
    var id = req.params.id; //seller id
    var sortOption = { createdAt: "desc" }; //default
    var page = 0;
    var limit = 5;
    var skip = 0;
    var whereCondition = { createdBy: id, isService: true };

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
        "id name charges featuredImage isActive",
      sort: sortOption,
      // populate: [
      //   {
      //     path: "cryptoPrices",
      //     model: CryptoConversion,
      //     select: "name code cryptoPriceUSD",
      //     match: { isActive: true, asCurrency: true },
      //   },
      // ],
      lean: true,
      page: page,
      offset: skip,
      limit: limit,
    };

    const result = await Services.paginate(whereCondition, options).then(
      (data) => {
        let res = {
          services: data.docs,
          paginationData: {
            totalServices: data.totalDocs,
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
    if (result.services && result.services.length > 0) {
      return result;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

async function getServiceById(id) {
  const service = await Services.findById(id)
    .select(
      "name category description charges isActive isService createdAt featuredImage"
    )
    .populate([
      // {
      //   path: "cryptoPrices",
      //   model: CryptoConversion,
      //   select: "name code cryptoPriceUSD",
      //   match: { isActive: true, asCurrency: true },
      // },
      {
        path: "category",
        model: Category,
        select: "id categoryName",
      },
      // {
      //   path: "sub_category",
      //   model: Category,
      //   select: "id categoryName",
      // },
      // {
      //   path: "videos",
      //   model: ServiceVideo,
      //   select: "video.title video.no video.thumb video.description",
      // },
    ]);

  if (!service) {
    return false;
  } else {
    //get service sales data
    const sales = await ProductSales.findOne({ productId: service.id })
      .select("totalSalesCount")
      .exec();

    let result = {
      service: service,
      sales: sales,
    };
    return result;
  }
}

async function addService(req) {
  // console.log('Param', req.body);
  // const files = req.files;
  const param = req.body;
  // var imagesArr = [];

  var lName = param.name.toLowerCase();

  // if (await Services.findOne({ lname: lName })) {
  //   throw 'Service Name "' + param.name + '" already exists.';
  // }

  // if (files.length > 0) {

  //     var fieldnames = {};
  //     for (var i = 0; i < files.length; i++) {
  //         var field = files[i].fieldname;
  //         var url = files[i].destination + "/" + files[i].filename;
  //         if (!fieldnames[field]) {
  //             fieldnames[field] = [];
  //         }
  //         fieldnames[field].push(url);
  //     }

  //     for (var field in fieldnames) {
  //         imagesArr.push({ color: field, paths: fieldnames[field] });
  //     }
  // }

  let input = {
    seller_id: param.seller_id,
    name: param.name,
    lname: lName,
    slug: param.slug,
    charges: param.charges,
    category: param.category,
    description: param.description,
    featuredImage: param.image,
    imageId: param.imageId,
    isActive: true,
    isService: true,
    createdBy: param.seller_id,
    updatedBy: param.seller_id,
  };



  // if (param.sub_category !== "") {
  //     input['sub_category'] = param.sub_category;
  // }

  const serviceData = new Services(input);

  const data = await serviceData.save();


  if (data) {
    // console.log("data id", data._id);
    // const files = req.files;
    // var videosArr = [];
    // var videoCount = 0;

    // if (files.length > 0) {

    //     for (var i = 0; i < files.length; i++) {

    //         //for thumb file
    //         let upload_folder = 'uploads/video_thumbs';
    //         let path = files[i].path;
    //         let thumb_file_name = files[i].filename + '-' + Date.now() + '-thumb.png';
    //         let thumb_full = upload_folder + '/' + thumb_file_name;

    //         try {
    //             //create thumb file
    //             ffmpeg(path)
    //                 .setFfmpegPath(ffmpeg_static)
    //                 .screenshots({
    //                     timestamps: [0.0],
    //                     filename: thumb_file_name,
    //                     folder: upload_folder
    //                 }).on('end', function() {
    //                     //
    //                 });
    //         } catch (err) {
    //             console.log('Error', err);
    //         }

    //         let url = files[i].destination + "/" + files[i].filename;
    //         let no = i + 1;
    //         let vid_data = {
    //             serviceId: data.id,
    //             video: {
    //                 no: no,
    //                 title: "Ep-" + no,
    //                 description: "Episode-" + no + " of " + param.name,
    //                 url: url,
    //                 thumb: thumb_full
    //             },
    //             isActive: true
    //         };
    //         videosArr.push(vid_data);
    //         videoCount++;
    //     }
    // }

    // if (videosArr && videosArr.length > 0) {
    //     //insert multiple videos data at once
    //     await ServiceVideo.insertMany(videosArr, async function(error, videos) {
    //         if (error == null && videos.length > 0) {
    //             videoIds = [];
    //             for (var j = 0; j < videos.length; j++) {
    //                 let videoId = mongoose.Types.ObjectId(videos[j]._id);
    //                 videoIds.push(videoId);
    //             }

    //             if (videoIds.length > 0) {
    //                 let update = { videoCount: videoCount, videos: videoIds };
    //                 //update video data into service
    //                 await Product.findByIdAndUpdate(data.id, update);
    //             }
    //         }
    //     });
    // }

    let res = await Services.findById({ _id: data._id }).select();
    //  console.log("REsponse", res);
    if (res) {
      return res;
    } else {
      return false;
    }
  } else {
    return false;
  }

  // } catch (err) {
  //     console.log('Error', err);
  //     return false;
  // }
}

async function addServicesFeaturedImage(req) {
  var file = req.file;
  var param = req.body;
  const id = param.id;
  var imgUrl = "";

  const data = await Services.findById(id);

  if (!data) return false;

  if (typeof file != "undefined") {
    if (fs.existsSync(data.featuredImage)) {
      fs.unlinkSync(data.featuredImage);
    }

    imgUrl = file.destination + "/" + file.filename;
  } else {
    imgUrl = data.featuredImage;
  }

  const input = {
    featuredImage: imgUrl,
    updatedAt: new Date().toISOString(),
  };

  Object.assign(data, input);

  const result = await data.save();

  if (result) {
    return await Services.findById(id).select("id featuredImage isService");
  } else {
    return false;
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
    console.log("paymentMethod", paymentMethod.id);

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
      items: [{ price: plan_Id }], // Replace with your plan ID
      expand: ["latest_invoice.payment_intent"],
    });

    return subscription;
    // return session;
    // res.status(200).json({ subscription });
  } catch (error) {
    console.error("Error creating subscription:", error);
    // res.status(500).send({ error: 'Subscription creation failed' });
  }
}

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
      console.log(data._id);
      return data._id;
    } else {
      return false;
    }
  } catch (err) {
    console.log("Error", err);
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

async function updateOrderStatus(req) {
  try {
    var param = req.body;
    console.log("_id=" + param.orderId);
    console.log("order_status=" + param.orderStatus);
    //update in order
    await Order.findOneAndUpdate(
      { _id: param.orderId },
      { orderStatus: param.orderStatus },
      { new: true }
    );
    return true;
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

async function getNewCoupons(req) {
  try {
    let now = new Date();
    var param = req.body;
    var whereCondition = { end: { $gte: now } }; //default
    const result = await Coupon.paginate(whereCondition).then((data) => {
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
    console.log("its checking");
  } catch (err) {
    console.log("Error", err);
    console.log("Cpouon is Expired or Code is not match");
    return false;
  }
}

async function serviceStatusUpdate(req) {
  try {
    const id = req.params.id;
    const statusData = req.body;
    const newStatus = statusData.isActive;
    const updatedOrder = await Services.findOneAndUpdate(
      { _id: id },
      { isActive: newStatus },
      { new: true }
    );
    if (!updatedOrder) {
      console.log("Service not found.");
      return null;
    }
    return updatedOrder;
  } catch (err) {
    console.log("Error:", err);
    throw err;
  }
}

async function getServiceItems(req) {
  try {
    let id = req.params.id;
    let result = await Services.find({ $or: [{ createdBy: id }, { _id: id }], isAvailable: true })
      // let result = await Services.find({ $or: [
      //   { 'createdBy.userId': id },
      //   { _id: id }
      // ]  })
      .select(
        "serviceCode name charges featuredImage imageId description isActive createdAt"
      )
      .sort({ createdAt: "desc" })
      .populate({
        path: "category",
        model: Category,
        select: "categoryName",
      })
      .exec(); // Added exec() to execute the query

    if (result.length > 0) {
      return result;
    } else {
      return [];
    }
  } catch (err) {
    console.log("Error", err);
    throw err;
  }
}

async function editService(req) {
  try {
    const id = req.params.id;
    const param = req.body;
    const statusData = {
      name: param.name,
      charges: param.charges,
      category: param.category,
      description: param.description,
      featuredImage: param.featuredImage,
      imageId: param.imageId,
      updatedBy: param.seller_id,
    };

    const updatedOrder = await Services.findOneAndUpdate(
      { _id: id },
      statusData,
      { new: true }
    );
    if (!updatedOrder) {
      console.log("Service not found.");
      return null;
    }

    console.log("Service updated successfully:", updatedOrder);
    return updatedOrder;
  } catch (err) {
    console.log("Error:", err);
    throw err;
  }
}

// SELLER SERVICE
async function getServiceData() {
  //  const _id = req.params.id
  try {
    const allService = await Servicedetails.find()
      .select()
      .sort({ createdAt: "desc" })
      .populate({
        path: "userId",
        model: User,
        select: "name email",
      })
      .populate({
        path: "serviceId",
        model: Services,
        select: "name serviceCode",
        populate: {
          path: "category",
          model: Category,
          select: "categoryName",
        },
      });
    if (allService && allService.length > 0) return allService;
  } catch (error) {
    console.log(error);
  }
}

// Get data by status;
async function getServiceStatus(req) {
  const status = req.params.meetingStatus;
  console.log("status", meetingStatus);
  try {
    const allPost = await Servicedetails.find({})
      .select()
      .sort({ createdAt: "desc" })
      .populate({
        path: "userId",
        model: User,
        select: "name email",
      })
      .populate({
        path: "service",
        model: Services,
        select: "name serviceCode",
        populate: {
          path: "category",
          model: Category,
          select: "categoryName",
        },
      });

    const filteredStatus = allPost.filter(
      (item) => item.meetingStatus === status
    );
    // console.log("filteredStatus", filteredStatus)
    return filteredStatus;
  } catch (error) {
    console.log(error);
  }
}

async function saveCalendarEvents(req) {
  try {
    const reqData = req.body;
    let data = "";
    for (const event of reqData) {
      const existingEvent = await Calendar.findOne({
        event_id: event.eventId,
      });

      if (!existingEvent) {
        const eventData = {
          event_id: event.eventId,
          event_title: event.eventTitle,
          event_description: "",
          user_id: "",
          // seller_id: event.sellerId,
          service_id: "",
          start_datetime: event.startAt,
          end_datetime: event.endAt,
          meeting_url: "",
        };

        data = await Calendar.create(eventData);
      } else {
        data = [];
      }
    }
    console.log("Response of saved calendar:", data);
    return data;
  } catch (err) {
    console.error("Error saving calendar events:", err);
    return false; // Indicate failure
  }
}


// fetch google calendar event from data base
async function getSellerCalendarEvents(req) {
  const { sellerId } = req.query;

  try {
    const services = await Services.find({ createdBy: sellerId }).select('_id');
    if (services.length === 0) {
      return [];
    }

    const serviceIds = services.map(service => service._id);

    const data = await Calendar.find({
      service_id: { $in: serviceIds },
      user_id: { $ne: null },
    })
      .populate({
        path: 'service_id',
        select: 'name'
      })
      .populate({
        path: 'user_id',
        select: 'name phone email'
      })
      .select("event_id user_id service_id event_title event_description start_datetime end_datetime meeting_url");
    return data;
  } catch (err) {
    console.log("Error", err);
    return false;
  }
}

//delete google calendar events from database
async function delSellerCalendarEvents(req) {
  try {
    const _id = req.params.id;

    if (!_id) {
      console.error("No event ID provided.", error);
      return false;
    }

    const data = await Calendar.findByIdAndDelete(_id)

    return data;
  } catch (error) {
    console.log("Error in delSellerCalendarEvents:", error);
    return false;
  }
}

//seller contact-us email function
async function seller_contactUs(param) {
  console.log("param", param);
  const email = param.email;
  console.log("param", email);

  const seller = await Seller.findOne({ email });
  console.log("user", seller)

  if (!seller) {
    console.log("email address not found. Please try again.");
    return false;
  }

  const mailOptions = {

    from: `"Payearth Support" <${param.email}>`,
    replyTo: `${param.email}`,
    to: config.mail_from_email,
    subject: `"Contact Us Message from seller" ${param.name}`,
    text: "You have received a message from " + seller.name,
    html: `
  <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #555;">
  <!-- Header -->
  <div style="background-color: #6772E5; padding: 20px; text-align: center;">
    <img src="https://pay.earth:7700/uploads/logo.png" alt="Payearth" style="height: 40px;" />
  </div>

  <!-- Body -->
  <div style="padding: 20px; background-color: #f9f9f9;">
    <h2 style="color: #333;">New Contact Us Message from seller ${seller.name}</h2>

    <p>Hello Payearth Admin,</p>

    <p>You have received a new message from the contact us form on your website. Here are the details:</p>

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


async function sellerServiceOrders(req) {
  const { id } = req.body;
  //  console.log('sellerId', id)
  try {
    const filteredResult = await OrderDetails.find({ isService: true, })
      .sort({ createdAt: 'desc' })
      .populate({
        path: "serviceId",
        model: Services,
        match: { 'createdBy': id },
        select: "",
        populate: [
          {
            path: "createdBy",
            model: Seller,
            select: ""
          },
          {
            path: "createdByAdmin",
            model: Admin,
            select: ""
          }
        ]
      },
      )
      .populate({
        path: "userId",
        model: User,
        select: ""
      },)

    const result = filteredResult.filter(doc => doc.serviceId !== null);
    //  .populate('category', 'categoryName');
    if (result && result.length > 0) {
      //  console.log("service-list ", result)
      return result
    }
  } catch (error) {
    console.log(error);
  }
}


// POST API CREATE NEW BANNER....................................
async function createSellerBanner(req, res) {
  try {
    var param = req.body;
    const titleCount = await bannerAdvertisement
      .find({ bannerName: param.bannerName })
      .count();
    let slug = "";
    if (titleCount > 0) {
      slug = param.slug + titleCount;
    } else {
      slug = param.slug;
    }

    console.log("slug", slug);
    let input = {
      image: param.image,
      imageId: param.imageId,
      video: param.video,
      videoId: param.videoId,
      bannerText: param.bannerText,
      bannerType: param.bannerType,
      bannerName: param.bannerName,
      slug: slug,
      siteUrl: param.siteUrl,
      category: param.category,
      subPlanId: param.subPlanId,
      pay_sub_id: param.pay_sub_id,
      startDate: param.startDate,
      endDate: param.endDate,
      bannerPlacement: param.bannerPlacement,
      status: param.status,
      tag: param.tag,
      keyword: param.keyword,
      author: param.author,
      authorDetails: param.authorDetails,
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
async function getBannersBySellerId(req) {
  const sellerId = req.params.id;
  // console.log("userID Author", userId)
  try {
    const result = await bannerAdvertisement
      .find({ author: sellerId })
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

// Update Page
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
    keyword,
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
        keyword,
      },
      { new: true }
    );
    //  console.log("update banner", banner)
    return banner;
  } catch (error) {
    console.log(error);
  }
}

//get meeting data in seller calendar
// async function getMeeting(createdBy) {
//   try {
//     let result = await Servicedetails.find({ createdBy })
//       .populate({
//         path: "serviceId",
//         model: Services,
//         select: "name createdBy", //createdBy is sellerId
//       })
//       .populate({ path: "userId", model: User, select: "name" })
//       .select()
//       .sort({ createdAt: -1 })
//       .exec();
//     console.log("result", result);
//     return result;
//   } catch (err) {
//     console.log("Error", err);
//     throw err;
//   }
// }

// Create seller subscription

async function createSellerSubscriptionPlan(req, res) {
  var param = req.body;
  // console.log("param:::;", param)
  var authorId = param.usageCount[0].authorId;
  var subscription_Id = param.usageCount[0].sub_id;
  // console.log("author ID :::", authorId)

  try {
    let existingPlan = await subscriptionPlan.findOne({ id: param.id });
    // console.log("existingPlan", existingPlan)

    if (existingPlan) {
      existingPlan.usageCount.push({
        authorId: authorId,
        sub_id: subscription_Id,
        count: 0,
        isActive: true,
      });

      const updatedPlan = await existingPlan.save();
      // console.log("Updated plan", updatedPlan);
      return updatedPlan;
    } else {
      let input = {
        id: param.id,
        nickname: param.nickname,
        amount: param.amount,
        interval: param.interval,
        interval_count: param.interval_count,
        metadata: param.metadata,
        active: param.active,
        usageCount: param.usageCount,
      };

      // console.log("input", input)
      const plan = new subscriptionPlan(input);
      // console.log("plan", plan)
      const data = await plan.save();

      // console.log("RES data", data)
      if (data) {
        // console.log(data._id);
        return data;
      }
    }
  } catch (error) {
    console.log("Error", error);
  }
}

// Purchase plan by seller...

async function sellerAddPlan(req) {
  const data = req.params;
  // console.log("data check", data)
  const dbPlanId = req.params.id;
  // console.log("planID in backend", dbPlanId)
  const { usageCount, metadata } = req.body;
  // console.log("metadata advertiseAllowed:::::>>>>>>>>>>>>>", metadata.advertiseAllowed)
  // console.log("usageCount : ", usageCount.authorId)
  const authorId = usageCount.authorId;
  const MAX_COUNT = metadata.advertiseAllowed;
  try {
    const plan = await subscriptionPlan.findById(dbPlanId);
    // console.log("plan", plan);

    const usageCountIndex = plan.usageCount.findIndex(
      (item) => item.authorId === authorId
    );
    if (usageCountIndex !== -1) {
      if (plan.usageCount[usageCountIndex].count < MAX_COUNT) {
        plan.usageCount[usageCountIndex].count++;
      } else {
        console.log("Count exceeds maximum limit.");
        // Handle the case where the count exceeds the maximum limit
      }
      // plan.usageCount[usageCountIndex].count++;
    } else {
      // If authorId is not found, add a new entry
      plan.usageCount.push({
        authorId: authorId,
        count: 1,
      });
    }
    const subPlan = await subscriptionPlan.findByIdAndUpdate(
      dbPlanId,
      { usageCount: plan.usageCount },
      { new: true }
    );
    // console.log("subPlan", subPlan);
    return subPlan;
  } catch (error) {
    console.log(error);
  }
}

// SELECTED PLAN SHOW IN SELLER DISPLAY

async function getSubscriptionPlanBySeller(req) {
  const authorId = req.params.id;
  // const authorId = '611cb36649c1a73eAuthortest'
  try {
    // const result = await bannerAdvertisement.find({}).select().sort({ createdAt: 'desc' })
    // const matchedBannerData = result.filter(item => item.keyword.toLowerCase().includes(keywordsData.toLowerCase()))

    const query = {
      usageCount: {
        $elemMatch: {
          authorId: authorId,
          isActive: true,
        },
      },
    };

    // const query = {
    //   keyword: { $regex: keywordsData, $options: "i" },
    //   status: "Publish",
    // };

    const fieldsToSelect =
      "id _id nickname amount interval interval_count active usageCount metadata";
    const result = await subscriptionPlan
      .find(query)
      .sort({ createdAt: "desc" })
      .select(fieldsToSelect);

    if (result && result.length > 0) {
      return result;
    } else {
      return [];
    }
  } catch (error) {
    console.log(error);
  }
}

// Reduse Count by delete

async function reduseCount(req) {
  console.log("Function is run reduseCount.<<<<<>>><<>><>><><><><><>");
  const subId = req.params.id; // subscription plan id select in list..
  console.log("subscription plan id", subId);
  const { usageCount, metadata } = req.body;
  console.log(
    "metadata advertiseAllowed:::::>>>>>>>>>>>>>",
    metadata.advertiseAllowed
  );
  console.log("usageCount : ", usageCount.authorId);
  const authorId = usageCount.authorId;
  const MAX_COUNT = metadata.advertiseAllowed;
  try {
    const plan = await subscriptionPlan.findById(subId);
    console.log("plan", plan);

    const usageCountIndex = plan.usageCount.findIndex(
      (item) => item.authorId === authorId
    );

    // plan.usageCount[usageCountIndex].count--;

    if (usageCountIndex !== -1) {
      plan.usageCount[usageCountIndex].count--;
      // if (plan.usageCount[usageCountIndex].count < MAX_COUNT) {
      //   plan.usageCount[usageCountIndex].count--;
      // } else {
      //   console.log("Count exceeds maximum limit.");
      //   // Handle the case where the count exceeds the maximum limit
      // }
    } else {
      // If authorId is not found, add a new entry
      plan.usageCount.push({
        authorId: authorId,
        count: 1,
      });
    }
    const subPlan = await subscriptionPlan.findByIdAndUpdate(
      dbPlanId,
      { usageCount: plan.usageCount },
      { new: true }
    );

    return subPlan;
  } catch (error) {
    console.log(error);
  }
}

// Reduse Count.
async function sellerReduceCount(req) {
  const subPlanId = req.params.id;
  const { usageCount } = req.body;
  const authorId = usageCount.authorId;

  try {
    const plan = await subscriptionPlan.findById(subPlanId);
    const usageCountIndex = plan.usageCount.findIndex(
      (item) => item.authorId === authorId
    );

    // plan.usageCount[usageCountIndex].count--;

    if (usageCountIndex !== -1) {
      plan.usageCount[usageCountIndex].count--;
      // if (plan.usageCount[usageCountIndex].count < MAX_COUNT) {
      //   plan.usageCount[usageCountIndex].count--;
      // } else {
      //   console.log("Count exceeds maximum limit.");
      //   // Handle the case where the count exceeds the maximum limit
      // }
    } else {
      // If authorId is not found, add a new entry
      plan.usageCount.push({
        authorId: authorId,
        count: 1,
      });
    }
    const subPlan = await subscriptionPlan.findByIdAndUpdate(
      subPlanId,
      { usageCount: plan.usageCount },
      { new: true }
    );
    return subPlan;
  } catch (error) {
    console.log(error);
  }
}

// activeStatusChange
async function updateSubscriptionStatus(req) {
  const subPlan_id = req.params.id;
  const { usageCount } = req.body;
  const sub_id = usageCount.sub_id;

  try {
    const plan = await subscriptionPlan.findById(subPlan_id);

    const matchingUsageCount = plan.usageCount.find(
      (item) => item.sub_id === sub_id
    );
    // console.log("matchingUsageCount", matchingUsageCount)
    if (matchingUsageCount) {
      // Update the status of the matching usageCount to false
      matchingUsageCount.isActive = false;

      // Save the changes
      const subPlan = await plan.save();
      // console.log("Updated subscription plan:", subPlan);
      return subPlan;
    } else {
      console.log("Subscription plan_id not found in subscription plan");
      // Handle the case where authorId is not found
    }
  } catch (error) {
    console.log(error);
  }
}


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

async function accessChat(req) {
  const { receiverId, authorId } = req.body;
  if (!receiverId) {
    console.log("receiverId not send in request")
  }
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

  if (isChat.length > 0) {
    return isChat[0];
  } else {
    const newReceiverIds = [authorId, receiverId];
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      chatUsers: newReceiverIds,
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id })
      return fullChat;
    } catch (error) {
      console.log("error", error)
    }
  }
}


async function createGroupChat(req) {
  const { authorId, receiverId, groupName } = req.body;

  if (!receiverId || !Array.isArray(receiverId) || receiverId.length === 0) {
    console.log("Please field add details....")
  }

  var isChat = await Chat.find({
    isGroupChat: true,
    chatName: groupName,
  }).sort({ createdAt: "desc" });

  if (isChat.length > 0) {
    return isChat[0];
  } else {

    const receiverData = receiverId.map(receiver => ({
      id: receiver.id,
      name: receiver.name,
      image_url: receiver.image_url
    }));

    receiverData.push(authorId)

    var chatData = {
      chatName: groupName,
      isGroupChat: true,
      chatUsers: receiverData,
    };
    try {
      const createdChat = await Chat.create(chatData);
      const fullChat = await Chat.findOne({ _id: createdChat._id })
      return fullChat;
    } catch (error) {
      console.log("error", error)
    }
  }
}


async function fetchChat(req) {
  const authorId = req.params.id;
  try {
    const query = {
      isBlock: false,
      'chatUsers.id': authorId
    };

    const fieldsToSelect = "id chatName isGroupChat isBlock chatUsers latestMessage";
    let result = await Chat.find(query).sort({ createdAt: "desc" }).select(fieldsToSelect)
      .populate({
        path: 'latestMessage',
        match: { isVisible: true },
        select: 'messageContent mediaContent timestamp'
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

async function fetchBlockChat(req) {
  const authorId = req.params.id;
  try {
    const query = {
      isBlock: true,
      'chatUsers.id': authorId
    };

    const fieldsToSelect = "id chatName isGroupChat isBlock blockByUser chatUsers";
    const result = await Chat.find(query).sort({ createdAt: "desc" }).select(fieldsToSelect);
    return result;
  } catch (error) {
    console.log(error);
  }
}


async function sendMessage(req) {
  const { authorId, messageContent, chatId, mediaContent } = req.body;

  if (!chatId || !authorId) {
    console.log("Invalid Data pass")
  }

  var newMessage = {
    sender: authorId,
    messageContent: messageContent,
    mediaContent: mediaContent,
    chat: chatId
  }

  try {
    var message = await ChatMessage.create(newMessage);
    message = await message.populate({
      path: "chat",
      model: Chat,
    })

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

    return message

  } catch (error) {
    console.log(error)
  }
}

async function userChatBlock(req) {
  const chatId = req.params.id;
  const { isBlock, blockByUser } = req.body;
  try {
    const chat = await Chat.findByIdAndUpdate(chatId, { isBlock, blockByUser }, { new: true });

    return chat;
  } catch (error) {
    console.log(error)
  }
}

async function userUnblockChat(req) {
  const chatId = req.params.id;
  const { isBlock, blockByUser } = req.body;
  try {
    const chat = await Chat.findByIdAndUpdate(chatId, { isBlock, blockByUser }, { new: true });

    return chat;
  } catch (error) {
    console.log(error)
  }
}


async function chatMessageDelete(req) {
  const id = req.params.id;
  const { isVisible } = req.body;
  try {
    const chatMessage = await ChatMessage.findByIdAndUpdate(id, { isVisible }, { new: true });

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

async function addGroupMember(req) {
  const chatId = req.params.id;
  const { id, name, image_url, isGroupAdmin } = req.body;
  try {
    const addUser = await Chat.findByIdAndUpdate(
      chatId,
      { $push: { chatUsers: { id, name, image_url, isGroupAdmin } } },
      { new: true });

    return addUser;
  } catch (error) {
    console.log(error)
  }
}


// Edit group name
async function updateGroupName(req) {
  const { chatId, groupName } = req.body;

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


// *******************************************************************************
// *******************************************************************************
//add notification
async function addNotification(req) {
  try {
    const result = response.data;
    return result;
  } catch (error) {
    console.error("Error:", error);
  }
  addNotification;
}
// *******************************************************************************
// *******************************************************************************
//get notification
async function getNotification(req) {
  const sellerId = req.params.sellerId;
  try {
    const result = await Notification.find()
      .populate({
        path: "serviceId",
        model: Services,
        select: "name createdBy",
        match: { createdBy: sellerId },
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
// *******************************************************************************


// community
async function addPost(req) {
  const param = req.body;

  let input = {
    postContent: param.content,
    categoryId: param.category_id ? param.category_id : null,
    productId: param.product_id ? param.product_id : null,
    userId: param.user_id ? param.user_id : null,
    sellerId: param.seller_id ? param.seller_id : null,
    isSeller: param.is_seller,
    isAdmin: param.is_admin,
    postStatus: param.post_status,
    postImages: [],
    postVideos: [],
    likeCount: 0,
    likes: [],
    commentCount: 0,
    comments: [],
    parentId: param.parent_id ? param.parent_id : null,
    isActive: true
  };

  const post = new Post(input);
  const data = await post.save();

  if (data) {
    let res = await Post.findById(data.id).select();
    if (res) {
      return res;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

async function getPosts(req) {
  const authorId = req.params.id;
  const seller = await Seller.findById(authorId).populate('community.followingData');
  if (!seller) {
    return { success: false, message: "seller not found..." };
  }
  const followerIds = seller.community.followingData.map(follower => follower._id);
  const blockedId = seller.community.blockedUsers.map(blockedUser => blockedUser._id);

  const posts = await Post.find({
    // $or: [
    //   { postStatus: "Public" },
    //   {
    //     postStatus: "Followers",
    //     $or: [
    //       { sellerId: { $in: followerIds } },
    //       { userId: { $in: followerIds } }
    //     ]
    //   },
    //   { sellerId: authorId }
    // ],
    // isActive: true,

    $and: [
      { isActive: true },
      {
        $or: [
          { postStatus: "Public" },
          {
            postStatus: "Followers",
            $or: [
              { sellerId: { $in: followerIds } },
              { userId: { $in: followerIds } }
            ]
          },
          { sellerId: authorId }
        ]
      },
      {
        $or: [
          {
            $and: [
              { userId: { $nin: blockedId } },
              { userId: { $ne: null } }
            ]
          },
          {
            $and: [
              { sellerId: { $nin: blockedId } },
              { userId: null }
            ]
          }
        ]
      }
    ]
  })
    .sort({ createdAt: 'desc' })
    .populate([
      {
        path: "sellerId",
        model: Seller,
        select: "name image_url community role",
        match: { isActive: true },
      },
      {
        path: "userId",
        model: User,
        select: "name image_url community role",
        match: { isActive: true },
      },
      {
        path: "adminId",
        model: Admin,
        select: "name image_url community role",
        match: { isActive: true },
      },
      {
        path: "postImages",
        model: PostImages,
        select: "url",
        // match: { isActive: true }
      },
      {
        path: "postVideos",
        model: PostVideos,
        select: "url",
        match: { isActive: true }
      },
      {
        path: "categoryId",
        model: Category,
        select: "categoryName isService"

      },
      {
        path: "productId",
        model: Product,
        select: "name isService"

      },
      {
        path: "likes",
        model: PostLike,
        select: "isActive isSeller postId sellerId userId",

        populate: [
          {
            path: "sellerId",
            model: Seller,
            select: "name image_url",

          },
          {
            path: "userId",
            model: User,
            select: "name image_url",

          },
        ]
      },
      {
        path: "comments",
        model: PostComment,
        select: "-isActive -postId",
        match: { isActive: true },
        populate: [{
          path: "sellerId",
          model: Seller,
          select: "name image_url",
          match: { isActive: true },
        },
        {
          path: "userId",
          model: User,
          select: "name image_url",
          match: { isActive: true },
        },
        {
          path: "adminId",
          model: Admin,
          select: "name image_url",
          match: { isActive: true },
        },
        ]
      },
      {
        path: "parentId",
        model: Post,
        match: { isActive: true },
        populate: [{
          path: "postImages",
          model: PostImages,
          select: "url",
          match: { isActive: true }
        },
        {
          path: "postVideos",
          model: PostVideos,
          select: "url",
          match: { isActive: true }
        },
        {
          path: "categoryId",
          model: Category,
          select: "categoryName isService"

        },
        {
          path: "productId",
          model: Product,
          select: "name isService"

        },
        {
          path: "sellerId",
          model: Seller,
          select: "name image_url",
          match: { isActive: true },
        },
        {
          path: "userId",
          model: User,
          select: "name image_url",
          match: { isActive: true },
        },
        {
          path: "likes",
          model: PostLike,
          select: "-isActive -postId",
          match: { isActive: true },
          populate: [{
            path: "sellerId",
            model: Seller,
            select: "name image_url",
            match: { isActive: true },
          },
          {
            path: "userId",
            model: User,
            select: "name image_url",
            match: { isActive: true },
          },
          ]
        }
        ]
      }
    ]);

  if (posts && posts.length > 0) {
    return posts;
  }
  return false;
}

async function addPostImages(req) {
  const { images } = req.body;
  const postId = req.params.id;
  console.log('function save image run')
  if (!Array.isArray(images) || images.length === 0) {
    return res.status(400).json({ success: false, message: "No videos provided" });
  }

  try {
    var postImages = [];
    var allImagesSaved = true;
    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      let input = {
        postId: postId,
        url: image.url,
        isActive: true
      };
      let postImage = new PostImages(input);
      let data = await postImage.save();
      if (data) {
        postImages.push(data.id);
      } else {
        allImagesSaved = false;
        break;
      }
    }
    if (allImagesSaved) {
      const filter = { _id: postId };
      const updateData = { $push: { postImages: { $each: postImages } } };
      await Post.findOneAndUpdate(filter, updateData, { new: true });
      return postImages
    } else {
      return { success: false, message: "Failed to save" };
    }
  } catch (error) {
    console.log("error", error)
  }

}

async function addPostLike(req) {
  const param = req.body;
  const postId = req.params.id;
  const isSeller = param.isSeller;
  const isLike = param.isLike;
  var where = { postId: postId };
  var input = { postId: postId, isActive: true, isSeller: isSeller };

  if (isSeller == true) {
    where['sellerId'] = param.seller_id;
    input['sellerId'] = param.seller_id;
    input['userId'] = null;
  } else {
    where['userId'] = param.user_id;
    input['userId'] = param.user_id;
    input['sellerId'] = null;
  }

  var postLikeData = await PostLike.findOne(where);

  if (postLikeData && isLike == true) {
    throw 'This post is already liked.';
  }

  if (isLike == true) {

    const postlike = new PostLike(input);

    const data = await postlike.save();

    if (data) {

      //update in post
      const filter = { _id: postId };
      const updateData = { $push: { likes: data.id }, $inc: { likeCount: 1 } };

      await Post.findOneAndUpdate(filter, updateData, { new: true });

      let result = await PostLike.findById(data.id).select();
      if (result) {
        return result;
      } else {
        return false;
      }
    } else {
      return false;
    }
  } else {

    //update in post
    const filter = { _id: postId };
    const updateData = { $pull: { likes: postLikeData._id }, $inc: { likeCount: -1 } };

    await Post.findOneAndUpdate(filter, updateData, { new: true });

    //delete row from collection
    await PostLike.findByIdAndRemove(postLikeData._id);

    return true;

  }
}

async function postDelete(req) {
  try {
    const param = req.body;
    const postId = param.postId;

    const result = await Post.updateOne(
      { _id: postId },
      { $set: { isActive: false } }
    );
    return result;

  } catch (err) {
    console.log('Error', err);
    return false;
  }
}

async function updatePost(req) {
  try {
    const param = req.body;
    const result = await Post.updateOne(
      { _id: param.postId },
      {
        $set: {
          postContent: param.content,
          productId: param.product_id,
          categoryId: param.category_id,
          postStatus: param.post_status
        }
      }
    );
    return result;

  } catch (err) {
    console.log('Error', err);
    return false;
  }
}


async function addPostComment(req) {
  const param = req.body;
  const postId = req.params.id;
  const isSeller = param.isSeller;
  const content = param.content;

  var input = {
    postId: postId,
    isActive: true,
    isSeller: isSeller,
    content: content
  };

  if (isSeller == true) {
    input['sellerId'] = param.seller_id;
    input['userId'] = null;
  } else {
    input['userId'] = param.user_id;
    input['sellerId'] = null;
  }

  //add row into collection
  const postcomment = new PostComment(input);

  const data = await postcomment.save();

  if (data) {

    //update in post
    const filter = { _id: postId };
    const updateData = { $push: { comments: data.id }, $inc: { commentCount: 1 } };

    await Post.findOneAndUpdate(filter, updateData, { new: true });

    let result = await PostComment.findById(data.id).select();
    if (result) {
      return result;
    } else {
      return false;
    }
  } else {
    return false;
  }

}


async function getPostComments(req) {
  const postId = req.params.id;
  const comments = await PostComment.find({ postId: postId, isActive: true })
    .sort({ createdAt: 'desc' });
  if (comments && comments.length > 0) {
    return comments;
  }
  return false;
}

async function addPostVideos(req, res) {
  const { videos } = req.body;
  const postId = req.params.id;

  if (!Array.isArray(videos) || videos.length === 0) {
    return res.status(400).json({ success: false, message: "No videos provided" });
  }
  try {
    var postVideos = [];
    var allVideosSaved = true;
    for (let i = 0; i < videos.length; i++) {
      const video = videos[i];
      let input = {
        postId: postId,
        url: video.url,
        isActive: true
      };
      let postVideo = new PostVideos(input);
      let data = await postVideo.save();
      if (data) {
        postVideos.push(data.id);
      } else {
        allVideosSaved = false;
        break; // Exit loop if save fails
      }
    }
    if (allVideosSaved) {
      const filter = { _id: postId };
      const updateData = { $push: { postVideos: { $each: postVideos } } };
      await Post.findOneAndUpdate(filter, updateData, { new: true });
      return postVideos
    } else {
      return { success: false, message: "Failed to save" };
    }
  } catch (error) {
    console.log("error", error)
  }
}

async function followUser(req) {
  try {
    const param = req.body;
    const currentUserId = param.currentUserId;
    const userIdToFollow = param.userIdToFollow;
    const role = param.role;


    if (role === "seller") {
      // If a seller is following someone (another seller or a user)
      await Seller.updateOne(
        { _id: currentUserId },
        {
          $addToSet: { 'community.followingData': userIdToFollow },
          $inc: { 'community.following': 1 }
        }
      );

      const isFollowingSeller = await Seller.exists({ _id: userIdToFollow });
      if (isFollowingSeller) {
        await Seller.updateOne(
          { _id: userIdToFollow },
          {
            $addToSet: { 'community.followerData': currentUserId },
            $inc: { 'community.followers': 1 }
          }
        );
      } else {
        await User.updateOne(
          { _id: userIdToFollow },
          {
            $addToSet: { 'community.followerData': currentUserId },
            $inc: { 'community.followers': 1 }
          }
        );
      }

      return { success: true, message: 'Followed successfully....!' };

    } else if (role === "user") {
      // Buyer follow to another Buyer...
      await Seller.updateOne(
        { _id: currentUserId },
        {
          $addToSet: { 'community.followingData': userIdToFollow },
          $inc: { 'community.following': 1 }
        }
      );

      const isFollowingSeller = await User.exists({ _id: userIdToFollow });
      if (isFollowingSeller) {
        await User.updateOne(
          { _id: userIdToFollow },
          {
            $addToSet: { 'community.followerData': currentUserId },
            $inc: { 'community.followers': 1 }
          }
        );
      } else {
        await Seller.updateOne(
          { _id: userIdToFollow },
          {
            $addToSet: { 'community.followerData': currentUserId },
            $inc: { 'community.followers': 1 }
          }
        );
      }

      return { success: true, message: 'Followed successfully....!' };
    }

    // ****************Below buyer to buyer follow req sent functionality....**********************//
    // await User.updateOne(
    //     { _id: currentUserId },
    //     {
    //         $addToSet: { 'community.followingData': userIdToFollow },
    //         $inc: { 'community.following': 1 }
    //     }
    // );

    // await User.updateOne(
    //     { _id: userIdToFollow },
    //     {
    //         $addToSet: { 'community.followerData': currentUserId },
    //         $inc: { 'community.followers': 1 }
    //     }
    // );

  } catch (err) {
    console.log('Error', err);
    return false;
  }
}


async function unfollowUser(req) {
  try {
    const param = req.body;
    const currentUserId = param.currentUserId;
    const userIdToUnfollow = param.userIdToUnfollow;
    const role = param.role;

    if (role === "seller") {
      await Seller.updateOne(
        { _id: currentUserId },
        {
          $pull: { 'community.followingData': userIdToUnfollow },
          $inc: { 'community.following': -1 }
        }
      );

      const isFollowingSeller = await Seller.exists({ _id: userIdToUnfollow });
      if (isFollowingSeller) {
        await Seller.updateOne(
          { _id: userIdToUnfollow },
          {
            $pull: { 'community.followerData': currentUserId },
            $inc: { 'community.followers': -1 }
          }
        );
      } else {
        await User.updateOne(
          { _id: userIdToUnfollow },
          {
            $pull: { 'community.followerData': currentUserId },
            $inc: { 'community.followers': -1 }
          }
        );
      }

      return { success: true, message: 'Unfollowed successfully....!' };

    } else if (role === "user") {
      await Seller.updateOne(
        { _id: currentUserId },
        {
          $pull: { 'community.followingData': userIdToUnfollow },
          $inc: { 'community.following': -1 }
        }
      );

      const isFollowingSeller = await Seller.exists({ _id: userIdToUnfollow });
      if (isFollowingSeller) {
        await Seller.updateOne(
          { _id: userIdToUnfollow },
          {
            $pull: { 'community.followerData': currentUserId },
            $inc: { 'community.followers': -1 }
          }
        );
      } else {
        await User.updateOne(
          { _id: userIdToUnfollow },
          {
            $pull: { 'community.followerData': currentUserId },
            $inc: { 'community.followers': -1 }
          }
        );
      }

      return { success: true, message: 'Unfollowed successfully....!' };
    }
    // ****************Below buyer to buyer unfollowing req functionality....**********************//
    // await User.updateOne(
    //     { _id: currentUserId },
    //     {
    //         $pull: { 'community.followingData': userIdToUnfollow },
    //         $inc: { 'community.following': -1 }
    //     }
    // );
    // await User.updateOne(
    //     { _id: userIdToUnfollow },
    //     {
    //         $pull: { 'community.followerData': currentUserId },
    //         $inc: { 'community.followers': -1 }
    //     }
    // );
    // return { success: true, message: 'Unfollowed successfully....!' };

  } catch (err) {
    console.log('Error', err);
    return false;
  }
}

async function getPostById(req) {
  const postId = req.params.id;
  console.log("postId", postId)

  const post = await Post.findOne({
    _id: postId,
    isActive: true
  })
    .sort({ createdAt: 'desc' })
    .populate([
      {
        path: "sellerId",
        model: Seller,
        select: "name image_url community role",
        match: { isActive: true },
      },
      {
        path: "userId",
        model: User,
        select: "name image_url community role",
        match: { isActive: true },
      },
      {
        path: "adminId",
        model: Admin,
        select: "name image_url community role",
        match: { isActive: true },
      },
      {
        path: "postImages",
        model: PostImages,
        select: "url",
        // match: { isActive: true }
      },
      {
        path: "postVideos",
        model: PostVideos,
        select: "url",
        match: { isActive: true }
      },
      {
        path: "likes",
        model: PostLike,
        select: "isActive isSeller postId sellerId userId",
        match: { isActive: true }
      },
      {
        path: "comments",
        model: PostComment,
        select: "isActive isSeller isAdmin postId sellerId userId adminId content createdAt",
        // match: { isActive: true },
        populate: [{
          path: "sellerId",
          model: Seller,
          select: "name image_url",
          // match: { isActive: true },
        },
        {
          path: "userId",
          model: User,
          select: "name image_url",
          // match: { isActive: true },
        },
        {
          path: "adminId",
          model: Admin,
          select: "name image_url",
          // match: { isActive: true },
        },
        ]
      }
    ])
  // console.log("Shared post", post)

  if (post) {
    // console.log("posts test ", post)
    return post;
  }
  return false;
}

async function getUserorSellerData(req, res) {
  try {
    const authorId = req.params.id;
    const user = await Seller.findById(authorId).populate('community.followingData');

    if (!user) {
      return { error: 'User not found' };
    }

    const separateUsersAndSellers = async (ids) => {
      const users = await User.find({ _id: { $in: ids } }).select('name image_url id');
      const sellers = await Seller.find({ _id: { $in: ids } }).select('name image_url id');
      return { users, sellers };
    };

    const [followerData, followingData, blockedData] = await Promise.all([
      separateUsersAndSellers(user.community.followerData),
      separateUsersAndSellers(user.community.followingData),
      separateUsersAndSellers(user.community.blockedUsers),
    ]);

    const result = {
      followers: [...followerData.users.concat(followerData.sellers)],

      following: [...followingData.users.concat(followingData.sellers)],

      blocked: [...blockedData.users.concat(blockedData.sellers)],
    };
    return result

  } catch (error) {
    console.log('Error', error);
  }
}


async function createPostReport(req, res) {
  try {
    var param = req.body;
    let input = {
      reportData: param.reportData,
      reportType: param.reportType,
      notes: param.notes,
      reportBy: param.reportBy,
    };
    const reportData = new ReportPost(input);
    const data = await reportData.save();
    if (data) {
      return data;
    }
    return false;
  } catch (error) {
    console.log('Error', error);
  }
}

async function communityUserBlock(req) {
  const { authorId, selectedUserId } = req.body;
  try {
    const updated = await Seller.findByIdAndUpdate(
      authorId,
      { $addToSet: { "community.blockedUsers": selectedUserId } },
      { new: true }
    );
    return updated;
  } catch (error) {
    console.log(error)
  }
}

async function communityUserUnblock(req) {
  const { authorId, selectedUserId } = req.body;
  try {
    const updated = await Seller.findByIdAndUpdate(
      authorId,
      { $pull: { "community.blockedUsers": selectedUserId } },
      { new: true }
    );
    return updated;
  } catch (error) {
    console.log(error);
  }
}

async function editProfileImage(req) {
  try {
    const id = req.params.id;
    const param = req.body;
    const statusData = {
      image_url: param.image,
    };

    const updatedOrder = await Seller.findOneAndUpdate(
      { _id: id },
      statusData,
      { new: true }
    );
    if (!updatedOrder) {
      console.log("Seller not found.");
      return null;
    }

    console.log("Profile Image updated successfully:", updatedOrder);
    return updatedOrder;
  } catch (err) {
    console.log("Error:", err);
    throw err;
  }
}

//support-Email
async function sellerSupportEmail(param) {
  const email = param.email;
  const name = param.name;
  const message = param.message;

  const mailOptions = {
    from: `"Payearth Support" <${email}>`,
    replyTo: `${email}`,
    to: config.mail_from_email,
    subject: `"Support Message from Seller " ${name}`,
    text: `"You have received a message from " + ${name}`,
    html: `
  <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #555;">
  <!-- Header -->
  <div style="background-color: #6772E5; padding: 20px; text-align: center;">
    <img src="https://pay.earth:7700/uploads/logo.png" alt="Payearth" style="height: 40px;" />
  </div>

  <!-- Body -->
  <div style="padding: 20px; background-color: #f9f9f9;">
    <h2 style="color: #333;">New Support Message from Seller ${name}</h2>

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



    const mailOptions = {
      from: `"Payearth Support" <${email}>`,
      replyTo: `${email}`,
      to: config.mail_from_email,
      subject: `Support call request from seller ${name}`,
      text: "",
      html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; color: #555;">
        <!-- Header -->
        <div style="background-color: #6772E5; padding: 20px; text-align: center;">
          <img src="https://pay.earth:7700/uploads/logo.png" alt="Payearth" style="height: 40px;" />
        </div>

        <!-- Body -->
        <div style="padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #333;">New Support call request from seller ${name}</h2>
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

    const result = await data.save();

    return result;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}


//get Seller Profile
async function getProfileById(id) {
  const seller = await Seller.findById(id).select(
    "id name email phone address role seller_type want_to_sell original_image_url original_image_id image_url image_id purchase_type community"
  );
  if (!seller) return false;
  return seller;
}


async function saveMyProfile(req) {
  const _id = req.params.id;
  const { original_image_url, original_image_id, image_url, image_id } = req.body;

  try {
    if (!original_image_url && !original_image_id && !image_url && !image_id) {
      console.error("Image not found.");
      return false;
    }

    const seller = await Seller.findById(_id);
    if (!seller) {
      console.error("seller not found.");
      return false;
    }

    const updateData = {};
    if (original_image_url) updateData.original_image_url = original_image_url;
    if (original_image_id) updateData.original_image_id = original_image_id;
    if (image_url) updateData.image_url = image_url;
    if (image_id) updateData.image_id = image_id;

    const updatedSeller = await Seller.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true }
    );

    if (!updatedSeller) {
      console.error("Failed to update seller.");
      return false;
    }

    return updatedSeller;
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Error updating profile data.");
  }
}


async function editProfile(req) {

  try {
    const _id = req.params.id;
    const { name, email, phone, seller_type, want_to_sell, role, address } = req.body;

    const seller = await Seller.findById({ _id });

    if (!seller) {
      return false;
    }

    const input = {
      name, email, phone, seller_type, want_to_sell, role,
      address: {
        street: address?.street,
        city: address?.city,
        state: address?.state,
        country: address?.country,
        zip: address?.zip,
      },
    };

    Object.assign(seller, input);
    await seller.save();

    const data = {
      name: seller.name,
      email: seller.email,
      phone: seller.phone,
      seller_type: seller.seller_type,
      want_to_sell: seller.want_to_sell,
      role: seller.role,
      address: seller.address,
    }

    return data;
  } catch (error) {
    console.error("Error:", error)
  }
}

//support Ticket created & initial ticket message
async function supportOpenTicket(req) {
  try {
    const { ticketId, category, subject, priority, message, createdBy, createdByType, status } = req.body;

    const existingTicket = await Ticket.findOne({ ticketId });
    if (existingTicket) {
      return { status: false, message: "Ticket already exists." };
    }

    const ticket = new Ticket({
      ticketId,
      category,
      subject,
      priority,
      createdBy,
      createdByType,
      status
    });

    const newTicket = await ticket.save();

    const ticketMessage = new TicketMessage({
      ticketId: newTicket.ticketId,
      sender: createdBy,
      senderType: createdByType,
      message: message
    });

    const savedMessage = await ticketMessage.save();

    newTicket.messages.push(savedMessage._id);
    await newTicket.save();

    return { status: true, message: "Ticket opened successfully.", data: newTicket };
  } catch (error) {
    console.error(error);
    return { status: false, message: error.message };
  }
}


async function getAllOpenTicket(req) {
  const createdBy = req.params.id;
  try {
    const findData = await Ticket.find({ createdBy })
    if (!findData) {
      return { status: false, message: "No tickets found for this seller." };
    }

    return { status: true, message: "Tickets retrieved successfully.", data: findData };
  } catch (error) {
    console.error(error);
    return { status: false, message: error.message };
  }
}

async function getOpenedTicketMessage(req) {

  const ticketId = req.params.id;
  try {

    const data = await TicketMessage.find({ ticketId })
    if (!data) {
      return { status: false, message: "Ticket message not found." };
    }

    return { status: true, message: "Tickets retrieved successfully.", data: data };
  } catch (error) {
    console.error(error);
    return { status: false, message: error.message };
  }
}
