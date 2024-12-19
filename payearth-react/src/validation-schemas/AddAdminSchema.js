import * as Yup from 'yup';

export default Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phone: Yup.string().required('Phone number is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    role:  Yup.string().required('Role is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});