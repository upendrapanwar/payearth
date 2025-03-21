var mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;
const schema = new Schema({
    name: { type: String, required: false, default: '' },
    email: { type: String, unique: true, required: false, index: true, default: '' },
    password: { type: String, required: false, default: '' },
    phone: { type: String, required: false, default: '' },
    role: { type: String, required: false, default: 'seller' },
    terms: { type: Boolean, required: true, default: false },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zip: Number
    },
    seller_type: { type: String, enum: ['retailer', 'wholesaler'], required: false, default: 'retailer' },
    want_to_sell: { type: String, enum: ['retailer', 'wholesaler'], required: false, default: 'wholesaler' },
    social_accounts: {
        google: {
            google_id: { type: String, required: false, default: null, index: true },
            google_data: {},
        },
        facebook: {
            facebook_id: { type: String, required: false, default: null, index: true },
            facebook_data: {},
        },
        twitter: {
            twitter_id: { type: String, required: false, default: null, index: true },
            twitter_data: {},
        },
    },
    community: {
        followerData: [{ type: Schema.Types.ObjectId }],
        followingData: [{ type: Schema.Types.ObjectId }],
        blockedUsers: [{ type: Schema.Types.ObjectId }],
        followers: { type: Number, required: false, default: 0 },
        following: { type: Number, required: false, default: 0 },
    },
    full_address: {
        address: { type: String, required: false, default: '' },
        state: { type: String, required: false, default: '' },
        country: { type: String, required: false, default: '' },
    },
    original_image_url: { type: String, required: false, default: null },
    original_image_id: { type: String, required: false, default: null },
    image_url: { type: String, required: false, default: null },
    image_id: { type: String, required: false, default: null },
    pdf_url: { type: String, required: false, default: '' },
    reset_password: {
        verif_code: { type: String, required: false, default: null },
        code_valid_at: { type: Date, required: false, default: null },
        is_pass_req: { type: Boolean, required: false, default: false },
    },
    isActive: { type: Boolean, required: false, default: true },
    stripeAccountId: { type: String, required: false, default: null },

}, {
    timestamps: true
});

schema.set('toJSON', { virtuals: true, versionKey: false });

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('Seller', schema);