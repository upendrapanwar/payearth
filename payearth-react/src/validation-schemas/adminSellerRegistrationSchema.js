import * as Yup from 'yup';

export default Yup.object().shape({
    name: Yup.string().required("Name is required."),
    email: Yup.string().email().required("Email is required."),
    password: Yup.string().when('$isRegister', {
        is: true,
        then: Yup.string().required('Password is required'),
        otherwise: Yup.string()
      }),
      password_confirmation: Yup.string().when('$isRegister', {
        is: true,
        then: Yup.string()
          .required('Confirm Password is required')
          .oneOf([Yup.ref('password')], 'Passwords must match'),
        otherwise: Yup.string().oneOf(
          [Yup.ref('password'), null],
          'Passwords must match'
        )
      }),
    country: Yup.string().required("Country is required."),
    state: Yup.string().required("State is required."),
    address: Yup.string().required("Address is required."),
    seller_type: Yup.string().required("Seller type is required."),
    want_to_sell: Yup.string().required("Sell type is required."),
    terms: Yup.boolean().oneOf([true], 'You must accept the Terms and Conditions.')
});