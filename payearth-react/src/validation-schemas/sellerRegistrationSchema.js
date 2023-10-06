import * as Yup from 'yup';

export default Yup.object().shape({
    name: Yup.string().required("Name is required."),
    email: Yup.string().email().required("Email is required."),
    password: Yup.string().required("Password is required.").min(6, 'Password is too short - should be 6 chars minimum.').max(20, 'Password is too long - should be 20 chars maximum.'),
    password_confirmation: Yup.string().required("Confirm password is required.").oneOf([Yup.ref('password'), null], 'Password must match.'),
    country: Yup.string().required("Country is required."),
    state: Yup.string().required("State is required."),
    address: Yup.string().required("Address is required."),
    seller_type: Yup.string().required("Seller type is required."),
    want_to_sell: Yup.string().required("Sell type is required.")
});