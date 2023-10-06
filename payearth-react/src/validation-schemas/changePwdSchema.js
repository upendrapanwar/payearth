import * as Yup from 'yup';

export default Yup.object().shape({
    password: Yup.string().required("Password is required.").min(6, 'Password is too short - should be 6 chars minimum.').max(20, 'Password is too long - should be 20 chars maximum.'),
    password_confirmation: Yup.string().required("Confirm password is required.").oneOf([Yup.ref('password'), null], 'Password must match.')
});