import * as Yup from 'yup';

export default Yup.object().shape({
    product_tax_rate: Yup.string().required("Tax rate is required as a percentage (%)."),
});