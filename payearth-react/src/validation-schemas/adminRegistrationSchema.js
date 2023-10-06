import * as Yup from 'yup';
const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
export default Yup.object().shape({
    name: Yup.string().required("Name is required."),
    phone: Yup.string().required("A phone number is required").matches(phoneRegExp, 'Phone number is not valid').min(10, "to short").max(10, "to long"),
    email: Yup.string().email().required("Email is required."),
    password: Yup.string().required("Password is required").min(6, 'Password is too short - should be 6 chars minimum.').max(20, 'Password is too long - should be 20 chars maximum.')
});