import * as Yup from 'yup';

export default Yup.object().shape({
    name: Yup.string().required("Name is required."),
    email: Yup.string().email().required("Email is required."),
    message: Yup.string().required("Message is required.")
});