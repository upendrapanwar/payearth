var mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    title: { type: String, required: false, default: '' },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: false, default: null },
    subCategoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: false, default: null },
    bannerImage: { type: String, required: false, default: '' },
    isActive: { type: Boolean, required: false, default: true },
}, {
    timestamps: true,
});

schema.set("toJSON", { virtuals: true, versionKey: false });

module.exports = mongoose.model("TodayDeal", schema);