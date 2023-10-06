import * as Yup from 'yup';

export default Yup.object().shape({
    coupon_code: Yup.string().required("Coupon is required."),
    start_date: Yup.string().required("Start date is required."),
    end_date: Yup.string().required("End date is required."),
    discount_percentage: Yup.string().required("Discount percentage is required.")
});