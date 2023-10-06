import * as Yup from 'yup';

export default Yup.object().shape({
    name: Yup.string().required("Product name is required."),
    category: Yup.string().required("Category is required."),
    brand: Yup.string().required("Brand is required."),
    description: Yup.string().required("Description is required."),
    specifications: Yup.string().required("Specifications is required."),
    // featuredImg: Yup.string().required("Featured image is required."),
    price: Yup.string().required("Price is required.")
});