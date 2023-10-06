const joi = require("@hapi/joi");
joi.objectId = require('joi-objectid')(joi);

const schema = {
    register: joi.object({
        name: joi.string().max(50).required(),
        email: joi.string().email().message('Email address must be valid.').required(),
        seller_type: joi.string().required(),
        address: joi.string().max(100).required(),
        state: joi.string().max(50).required(),
        country: joi.string().max(50).required(),
        want_to_sell: joi.string().required(),
        password: joi.string().min(6).max(20).required().messages({
            "string.empty": "Password is required",
            "any.required": "Password is required"
        }),
        password_confirmation: joi.any().equal(joi.ref('password')).required().label('Confirm password').messages({ 'any.only': '{{#label}} does not match.' })
    }),

    login: joi.object({
        email: joi.string().email().message('Email address must be valid.').required(),
        password: joi.string().required()
    }),

    changepass: joi.object({
        old_password: joi.string().required(),
        password: joi.string().min(6).max(20).required().messages({
            "string.empty": "Password is required.",
            "any.required": "Password is required."
        }),
        password_confirmation: joi.any().equal(joi.ref('password')).required().label('Confirm password').messages({ 'any.only': '{{#label}} does not match.' })
    }),

    forgotpass: joi.object({
        email: joi.string().email().message("Email is not valid.").required().messages({
            "string.empty": "Email is required.",
            "any.required": "Email is required."
        }),
    }),

    resetpass: joi.object({
        id: joi.objectId().message('Seller is invalid').required().messages({
            "string.empty": "Id is required.",
            "any.required": "Id is required."
        }),
        code: joi.string().required().messages({
            "string.empty": "Code is required.",
            "any.required": "Code is required."
        }),
        password: joi.string().min(6).max(20).required().messages({
            "string.empty": "Password is required.",
            "any.required": "Password is required."
        }),
        password_confirmation: joi.any().equal(joi.ref('password')).required().label('Confirm password').messages({ 'any.only': '{{#label}} does not match.' })
    }),

    addproduct: joi.object({
        name: joi.string().max(50).required(),
        seller_id: joi.objectId().message('Seller is invalid').required(),
        category: joi.objectId().message('Category is invalid').required(),
        brand: joi.objectId().message('Brand is invalid').required(),
        description: joi.string().required(),
        specifications: joi.string().required(),
        price: joi.number().label('Price').required(),
    }).unknown(),

    editproduct: joi.object({
        name: joi.string().max(50).required(),
        seller_id: joi.objectId().message('Seller is invalid').required(),
        category: joi.objectId().message('Category is invalid').required(),
        brand: joi.objectId().message('Brand is invalid').required(),
        description: joi.string().required(),
        specifications: joi.string().required(),
        price: joi.number().label('Price').required(),
    }).unknown(),

    addservice: joi.object({
        name: joi.string().max(50).required(),
        seller_id: joi.objectId().message('Seller is invalid').required(),
        category: joi.objectId().message('Category is invalid').required(),
        description: joi.string().required(),
        validity: joi.string().required(),
        price: joi.number().label('Price').required(),
    }).unknown(),

    editservice: joi.object({
        name: joi.string().max(50).required(),
        seller_id: joi.objectId().message('Seller is invalid').required(),
        category: joi.objectId().message('Category is invalid').required(),
        description: joi.string().required(),
        validity: joi.string().required(),
        price: joi.number().label('Price').required(),
    }).unknown(),

    needhelp: joi.object({
        seller_id: joi.objectId().message('Seller is invalid').required().messages({
            "string.empty": "Id is required.",
            "any.required": "Id is required."
        }),
        reason: joi.string().required().messages({
            "string.empty": "Reason is required.",
            "any.required": "Reason is required."
        }),
        comment: joi.string()
    }),

    contactus: joi.object({
        seller_id: joi.objectId().message('Seller is invalid').required().messages({
            "string.empty": "Id is required.",
            "any.required": "Id is required."
        }),
        name: joi.string().required().messages({
            "string.empty": "Name is required.",
            "any.required": "Name is required."
        }),
        email: joi.string().email().message("Email is not valid.").required().messages({
            "string.empty": "Email is required.",
            "any.required": "Email is required."
        }),
        message: joi.string().required().messages({
            "string.empty": "Message is required.",
            "any.required": "Message is required."
        }),
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
    },

    changePassValidation: async(req, res, next) => {
        const value = await schema.changepass.validate(req.body);
        getMessage(value, res, next);
    },

    forgotPassValidation: async(req, res, next) => {
        const value = await schema.forgotpass.validate(req.body);
        getMessage(value, res, next);
    },

    resetPassValidation: async(req, res, next) => {
        const value = await schema.resetpass.validate(req.body);
        getMessage(value, res, next);
    },

    addProductValidation: async(req, res, next) => {
        const value = await schema.addproduct.validate(req.body);
        getMessage(value, res, next);
    },

    editProductValidation: async(req, res, next) => {
        const value = await schema.editproduct.validate(req.body);
        getMessage(value, res, next);
    },

    addServiceValidation: async(req, res, next) => {
        const value = await schema.addservice.validate(req.body);
        getMessage(value, res, next);
    },

    editServiceValidation: async(req, res, next) => {
        const value = await schema.editservice.validate(req.body);
        getMessage(value, res, next);
    },

    needHelpValidation: async(req, res, next) => {
        const value = await schema.needhelp.validate(req.body);
        getMessage(value, res, next);
    },

    contactUsValidation: async(req, res, next) => {
        const value = await schema.contactus.validate(req.body);
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