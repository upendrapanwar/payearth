import * as Yup from 'yup';

export default Yup.object().shape({
    reason: Yup.string().required("Reason is required."),
    comment: Yup.string().required("Comment is required.")
});