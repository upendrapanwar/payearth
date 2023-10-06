const joi = require("@hapi/joi");
joi.objectId = require('joi-objectid')(joi);

const schema = {
    register: joi.object({
        name: joi.string().min(3).max(50).label("Name").required().messages({
            "string.empty": "{{#label}} is required.",
            "any.required": "{{#label}} is required.",
            "string.min": "{{#label}} should not be less than 3 characters.",
            "string.max": "{{#label}} should not be greater than 50 characters.",
        }),
        email: joi.string().max(50).label("Email").email().message("{{#label}} address must be valid.").required().messages({
            "string.empty": "{{#label}} is required.",
            "any.required": "{{#label}} is required."
        }),
        purchase_type: joi.string().label('Purchase Type').required(),
        password: joi.string().min(6).max(20).label("Password").required().messages({
            "string.empty": "{{#label}} is required.",
            "any.required": "{{#label}} is required.",
            "string.min": "{{#label}} should not be less than 6 characters.",
            "string.max": "{{#label}} should not be greater than 50 characters."
        }),
    }),

    login: joi.object({
        email: joi.string().label("Email").email().message("Email address must be valid.").required().messages({
            "string.empty": "{{#label}} is required.",
            "any.required": "{{#label}} is required."
        }),
        password: joi.string().label("Password").required().messages({
            "string.empty": "{{#label}} is required.",
            "any.required": "{{#label}} is required."
        })
    }),

    changepass: joi.object({
        // old_password: joi.string().required(),
        password: joi.string().min(6).max(20).required().label('Password').messages({
            "string.empty": "{{#label}} is required.",
            "any.required": "{{#label}} is required.",
            "string.max": "{{#label}} should not be greater than 20 characters.",
            "string.min": "{{#label}} should not be less than 6 characters."
        }),
        password_confirmation: joi.any().equal(joi.ref('password')).required().label('Confirm password').messages({ 'any.only': '{{#label}} does not match.' })
    }),

    forgotpass: joi.object({
        email: joi.string().label("Email").email().message("Email is not valid.").required().messages({
            "string.empty": "{{#label}} is required.",
            "any.required": "{{#label}} is required."
        }),
    }),

    resetpass: joi.object({
        id: joi.objectId().message('User is invalid').required().messages({
            "string.empty": "Id is required.",
            "any.required": "Id is required."
        }),
        code: joi.string().required().messages({
            "string.empty": "Code is required.",
            "any.required": "Code is required."
        }),
        password: joi.string().min(6).max(20).required().label('Password').messages({
            "string.empty": "{{#label}} is required.",
            "any.required": "{{#label}} is required.",
            "string.min": "{{#label}} should not be less than 6 characters.",
            "string.max": "{{#label}} should not be greater than 20 characters."
        }),
        password_confirmation: joi.any().equal(joi.ref('password')).required().label('Confirm password').messages({ 'any.only': '{{#label}} does not match.' })
    }),

    editprofile: joi.object({
        name: joi.string().min(3).max(50).label("Name").required().messages({
            "string.empty": "{{#label}} is required.",
            "any.required": "{{#label}} is required.",
            "string.min": "{{#label}} should not be less than 3 characters.",
            "string.max": "{{#label}} should not be greater than 50 characters."
        }),
        email: joi.string().max(50).label("Email").email().message('{{#label}} address must be valid.').required().messages({
            "string.empty": "{{#label}} is required.",
            "any.required": "{{#label}} is required.",
            "string.max": "{{#label}} should not be greater than 50 characters.",
        }),
        role: joi.string().label('Account Type').required().messages({
            "string.empty": "{{#label}} is required.",
            "any.required": "{{#label}} is required."
        }),
        purchase_type: joi.string().label('Purchase Type').required().messages({
            "string.empty": "{{#label}} is required.",
            "any.required": "{{#label}} is required."
        }),
    }),

    addreview: joi.object({
        rating: joi.number().min(1).max(5).label('Rating').required().messages({
            "string.empty": "{{#label}} is required.",
            "any.required": "{{#label}} is required."
        }),
        title: joi.string().max(100).label('Title').required().messages({
            "string.empty": "{{#label}} is required.",
            "any.required": "{{#label}} is required.",
            "string.max": "{{#label}} should not be greater than 100 characters."
        }),
        description: joi.string().max(1000).label('Description').required().messages({
            "string.empty": "{{#label}} is required.",
            "any.required": "{{#label}} is required.",
            "string.max": "{{#label}} should not be greater than 1000 characters."
        }),
        user_id: joi.objectId().message('User is invalid').required(),
        product_id: joi.objectId().message('Product is invalid').required(),
    }).unknown(),

    addcomplaint: joi.object({
        title: joi.string().max(100).label('Title').required().messages({
            "string.empty": "{{#label}} is required.",
            "any.required": "{{#label}} is required.",
            "string.max": "{{#label}} should not be greater than 100 characters."
        }),
        description: joi.string().max(1000).label('Description').required().messages({
            "string.empty": "{{#label}} is required.",
            "any.required": "{{#label}} is required.",
            "string.max": "{{#label}} should not be greater than 1000 characters."
        }),
        user_id: joi.objectId().message('User is invalid').required(),
        product_id: joi.objectId().message('Product is invalid').required(),
        order_id: joi.objectId().message('Order is invalid').required(),
    }).unknown(),

    addcancel: joi.object({
        title: joi.string().max(100).label('Title').required().messages({
            "string.empty": "{{#label}} is required.",
            "any.required": "{{#label}} is required.",
            "string.max": "{{#label}} should not be greater than 100 characters."
        }),
        description: joi.string().max(1000).label('Description').required().messages({
            "string.empty": "{{#label}} is required.",
            "any.required": "{{#label}} is required.",
            "string.max": "{{#label}} should not be greater than 1000 characters."
        }),
        user_id: joi.objectId().message('User is invalid').required(),
        product_id: joi.objectId().message('Product is invalid').required(),
        order_id: joi.objectId().message('Order is invalid').required(),
    }).unknown(),

    addreturn: joi.object({
        title: joi.string().max(100).label('Title').required().messages({
            "string.empty": "{{#label}} is required.",
            "any.required": "{{#label}} is required.",
            "string.max": "{{#label}} should not be greater than 100 characters."
        }),
        description: joi.string().max(1000).label('Description').required().messages({
            "string.empty": "{{#label}} is required.",
            "any.required": "{{#label}} is required.",
            "string.max": "{{#label}} should not be greater than 1000 characters."
        }),
        user_id: joi.objectId().message('User is invalid').required(),
        product_id: joi.objectId().message('Product is invalid').required(),
        order_id: joi.objectId().message('Order is invalid').required(),
    }).unknown(),

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

    editProfileValidation: async(req, res, next) => {
        const value = await schema.editprofile.validate(req.body);
        getMessage(value, res, next);
    },

    addReviewValidation: async(req, res, next) => {
        const value = await schema.addreview.validate(req.body);
        getMessage(value, res, next);
    },

    addComplaintValidation: async(req, res, next) => {
        const value = await schema.addcomplaint.validate(req.body);
        getMessage(value, res, next);
    },

    addCancelValidation: async(req, res, next) => {
        const value = await schema.addcancel.validate(req.body);
        getMessage(value, res, next);
    },

    addReturnValidation: async(req, res, next) => {
        const value = await schema.addreturn.validate(req.body);
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