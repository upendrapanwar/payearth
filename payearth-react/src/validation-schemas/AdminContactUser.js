import * as Yup from 'yup';

export default Yup.object().shape({
    subject: Yup.string().required("Subject is required."),
    message: Yup.string().required("Message is required.")
});