var mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
    name: { type: String, required: false, default: '' },
    email: { type: String, unique: true, required: true, index: true },
    password: { type: String, required: false, default: '' },
    phone: { type: String, required: false, default: null },
    reset_password: {
        verif_code: { type: String, required: false, default: null },
        code_valid_at: { type: Date, required: false, default: null },
        is_pass_req: { type: Boolean, required: false, default: false },
    },
    role: { type: String, required: false, default: 'admin' },
    isAdmin: { type: Boolean, required: false, default: false },
    isActive: { type: Boolean, required: false, default: false },
    original_image_url: { type: String, required: false, default: null },
    original_image_id: { type: String, required: false, default: null },
    image_url: { type: String, required: false, default: null },
    image_id: { type: String, required: false, default: null },
}, {
    timestamps: true
});

schema.set('toJSON', { virtuals: true, versionKey: false });

module.exports = mongoose.model('Admin', schema);