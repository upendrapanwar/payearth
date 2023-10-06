var mongoose = require('mongoose');
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;
const schema = new Schema({
    name: { type: String, required: false, default: '' },
    email: { type: String, unique: true, required: false, index: true, default: '' },
    password: { type: String, required: false, default: '' },
    phone: { type: String, required: false, default: '' },
    role: { type: String, required: false, default: 'user' },
    purchase_type: { type: String, enum: ['retail', 'wholesale'], required: false, default: 'retail' },
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
        followers: { type: Number, required: false, default: 0 },
        following: { type: Number, required: false, default: 0 },
    },
    address: {
        street: String,
        city: String,
        state: String,
        country: String,
        zip: Number
    },
    image_url: { type: String, required: false, default: null },
    isActive: { type: Boolean, required: false, default: true },
    reset_password: {
        verif_code: { type: String, required: false, default: null },
        code_valid_at: { type: Date, required: false, default: null },
        is_pass_req: { type: Boolean, required: false, default: false },
    }
}, {
    timestamps: true
});

schema.set('toJSON', { virtuals: true, versionKey: false });

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('User', schema);