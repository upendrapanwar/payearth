import * as Yup from 'yup';

export default Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    phone: Yup.string()
        .matches(/^\d{10}$/, 'Phone number must be 10 digits')
        .required('Phone is required'),
    address: Yup.object().shape({
        country: Yup.string().required('Country is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        street: Yup.string().required('Street is required'),
        zip: Yup.string()
            .matches(/^\d{6}$/, 'Zip code must be 6 digits')
            .required('Zip code is required'),
    })
})