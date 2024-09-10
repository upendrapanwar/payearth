import * as Yup from 'yup';

const SupportCallSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required'),
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    phone: Yup.string()
        .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
        .min(10, 'Phone number must be at least 10 digits')
        .max(10, 'Phone number must be at most 10 digits')
        .required('Contact number is required'),
    message: Yup.string()
        .required('Message is required'),
});

export default SupportCallSchema;
