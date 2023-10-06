import * as Yup from 'yup';
export default Yup.object().shape({
    name: Yup.string().required("Service name is required."),
    category: Yup.string().required("Category is required."),
    description: Yup.string().required("Description is required."),
    price: Yup.number().required("Price is required."),
    validity: Yup.string().required("Validity is required.")
});