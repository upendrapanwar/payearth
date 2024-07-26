import * as Yup from 'yup';
export default Yup.object().shape({
     name: Yup.string().required('Service name is required'),
     charges: Yup.number().typeError('Charges must be a number').required('Charges are required'),
    // category: Yup.string().required('Category is required'),
});