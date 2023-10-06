const joi = require("@hapi/joi");

const schema = {
    register: joi.object({
        name: joi.string().max(50).required(),
        email: joi.string().email().message('Email address must be valid.').required(),
        phone: joi.string().pattern(new RegExp("^[0-9]{10,20}$")).message('Phone no. should be in 10 digits.').required(),
        password: joi.string().min(6).max(20).required().messages({
            "string.empty": "Password is required.",
            "any.required": "Password is required."
        }),
    }),

    login: joi.object({
        email: joi.string().email().message('Email address must be valid.').required(),
        password: joi.string().required()
    }),
};

module.exports = {
    registerValidation: async(req, res, next) => {
        const value = await schema.register.validate(req.body);
        getMessage(value, res, next);
    },

    loginValidation: async(req, res, next) => {
        const value = await schema.login.validate(req.body);
        getMessage(value, res, next);
    }
};

function getMessage(value, res, next) {
    if (value.error) {
        res.status(400).json({ status: false, message: value.error.details[0].message });
    } else {
        if (typeof next === "undefined") {
            return true;
        } else {
            next();
        }

    }
}