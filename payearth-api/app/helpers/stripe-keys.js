const config = require("../config/index");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_URI || config.connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

const Stripe = require("stripe");
const { Stripekeys } = require("../helpers/db");

let stripeInstance = null;

// Function to update the Stripe secret key
async function updateStripeKey() {
    try {
        console.log("🔄 Updating Stripe Key...");
        const stripeData = await Stripekeys.findOne().sort({ createdAt: -1 }); // Get latest key
        if (stripeData && stripeData.stripe_secret_key) {
            stripeInstance = new Stripe(stripeData.stripe_secret_key);
            console.log("✅ Stripe secret key initialized.");
        } else {
            console.log("⚠️ No valid Stripe key found in the database.");
        }
    } catch (error) {
        console.error("❌ Error initializing Stripe:", error);
    }
}

// Automatically initialize Stripe on first use
async function getStripeInstance() {
    if (!stripeInstance) {
        console.log("⚠️ Stripe instance is not initialized. Initializing now...");
        await updateStripeKey();
    }
    if (!stripeInstance) {
        throw new Error("❌ Stripe initialization failed.");
    }
    return stripeInstance;
}

// Export functions
module.exports = {
    getStripeInstance
};
