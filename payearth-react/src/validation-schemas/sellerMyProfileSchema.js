import * as Yup from 'yup';

export default Yup.object().shape({
    name: Yup.string().required("Name is required.").min(3).max(50),
    email: Yup.string().email().required("Email is required."),
    seller_type: Yup.string().required("Seller Type is required."),
    want_to_sell: Yup.string().required("want to sell is required."),
})