import * as Yup from 'yup';

export default Yup.object().shape({
    stripe_publishable_key: Yup.string().required("publishable key is required."),
    stripe_secret_key: Yup.string().required("secret key is required.")
});