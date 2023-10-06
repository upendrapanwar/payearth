import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { setLoading } from '../../../store/reducers/global-reducer';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useSelector } from 'react-redux';
import StarRatingComponent from 'react-rating-stars-component';
import StarRatingComponent2 from 'react-rating-stars-component';
import config from './../../../config.json';
import { setOrderInfo, setTimelines, setReviews, setComlaint, setReturnReq, setCancelReq } from '../../../store/reducers/order-reducer';
import { Link } from 'react-router-dom';

const FormForOrderDetailTabs = (props) => {
    const {titlePlaceholder, desPlaceholder, orderId, productId, formType, reviewData} = props;
    const dispatch = useDispatch();
    const authInfo = useSelector(state => state.auth.authInfo);
    const [images, setImages] = useState([]);
    const [rating, setRating] = useState(0);
    const [flag, setFlag] = useState(false);
    const [previews, setPreviews] = useState([]);
    var bodyFormData = new FormData();

    const formik = useFormik({
        initialValues: {
            title: reviewData !== undefined && reviewData !== null ? reviewData.review.title : '',
            description: reviewData !== undefined && reviewData !== null ? reviewData.review.description : '',
            images: ''
        },
        enableReinitialize: true,
        validationSchema: Yup.object().shape({
            title: Yup.string().required("Title is required."),
            description: Yup.string().required("Description is required."),
            images: Yup.string().max(6, 'Should be 6 images maximum.')
        }),
        onSubmit: (values, {resetForm}) => {
            if (formType === 'reviews') {
                if (rating <= 1) {
                    toast.error('"Rating" must be larger than or equal to 1.', {autoClose:3000});
                    return false;
                }
            }

            dispatch(setLoading({loading: true}));
            bodyFormData.append('user_id', authInfo.id);
            bodyFormData.append('product_id', productId);
            bodyFormData.append('title', values.title);
            bodyFormData.append('description', values.description);

            if (formType !== 'reviews') {
                bodyFormData.append('order_id', orderId);
            } else {
                bodyFormData.append('rating', rating);
            }

            for (let index = 0; index < images.length; index++) {
                const file = images[index];
                bodyFormData.append('images', file);
            }

            axios.post(`user/order/${formType}`, bodyFormData, {
                headers: {
                    'Accept': 'application/form-data',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            }).then(response => {
                dispatch(setLoading({loading: false}));
                toast.dismiss();
                if (response.data.status) {
                    toast.success(response.data.message, {autoClose:3000});
                    resetForm();
                    setRating(1);
                } else {
                    toast.error(response.data.message, {autoClose:3000});
                }
            }).catch(error => {
                toast.dismiss();
                if (error.response) {
                    toast.error(error.response.data.message, {autoClose:3000});
                }
            }).finally(() => {
                getOrderDetail();
            });
        }
    });

    useEffect(() => {
        let currentRating = reviewData !== undefined && reviewData !== null ? reviewData.rating : 0;
        if (currentRating > 0) {
            setRating(currentRating);
            setFlag(true);
        }
    }, [reviewData, rating]);

    const getOrderDetail = () => {
        let orderId = window.location.pathname.split('/')[2];
        dispatch(setLoading({loading: false}));
        axios.get('user/orders/' + orderId, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                let timelines = [];
                if (response.data.data.orderTimeline.length > 0) {
                    response.data.data.orderTimeline.forEach(item => {
                        timelines.push(item.orderStatusId.lname)
                    });
                }

                dispatch(setOrderInfo({orderInfo: response.data.data}));
                dispatch(setTimelines({timelines: timelines}));

                if (this.state.reviews === null && timelines.includes('delivered') === true) this.dispatch(setReviews({reviews: true}))
                if (timelines.includes('complaint') === false && timelines.includes('delivered') === true) this.dispatch(setComlaint({comlaint: true}))
                if (timelines.includes('return_request') === false && timelines.includes('delivered') === true) this.dispatch(setReturnReq({returnReq: true}))
                if (timelines.includes('cancel_request') === false && timelines.includes('delivered') === false) this.dispatch(setCancelReq({cancelReq: true}))
            }
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    const chooseFiles = event => {
        const files = event.target.files;
        let images = [];
        let previews = [];
        for (let index = 0; index < files.length; index++) {
            images.push(files[index]);
            previews.push(URL.createObjectURL(event.target.files[index]));
        }
        setImages(images);
        setPreviews(previews);
    }

    const removeImg = index => {
        previews.splice(index, 1);
        images.splice(index, 1);
    }

    const ratingChanged = newRating => setRating(newRating);

    return(
        <React.Fragment>
            <form className="in_form order_review_form" onSubmit={formik.handleSubmit} encType="multipart/form-data">
                {formType === 'reviews' &&
                    <div className="form-group">
                        <label htmlFor="">Rate this product</label>
                        <div className="order_review_rating_wrapper">
                            {flag ?
                                <div className="order_review_rating_wrapper">
                                    <StarRatingComponent
                                        count={5}
                                        onChange={ratingChanged}
                                        activeColor="#fbb500"
                                        value={rating}
                                    />
                                </div> :
                                <StarRatingComponent2
                                    count={5}
                                    onChange={ratingChanged}
                                    activeColor="#fbb500"
                                    value={rating}
                                />
                            }
                        </div>
                    </div>
                }
                <div className="form-group">
                    <label htmlFor="">Title <span className="text-danger">*</span></label>
                    <div className="order_field_width_100">
                        <input type="text" className="form-control" name="title" id="title"
                            placeholder={titlePlaceholder}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.title}
                        />
                        {formik.touched.title && formik.errors.title ? (
                            <small className="text-danger">{formik.errors.title}</small>
                        ) : null}
                    </div>
                </div>
                <div className="form-group align-items-start">
                    <label htmlFor="">Description <span className="text-danger">*</span></label>
                    <div className="order_field_width_100">
                        <textarea className="form-control" name="description" id="description" rows="5"
                            placeholder={desPlaceholder}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.description}
                        ></textarea>
                        {formik.touched.description && formik.errors.description ? (
                            <small className="text-danger">{formik.errors.description}</small>
                        ) : null}
                    </div>
                </div>
                <div className="form-group ">
                    <label htmlFor="">Images</label>
                    <div className="order_field_width_100">
                        <input className="form-control" type="file" name="images" id="images"
                            onChange={chooseFiles}
                            onBlur={formik.handleBlur}
                            value={formik.values.images}
                            multiple={true}
                            accept="image/*"
                        />
                        {previews.length > 0 &&
                            <ul className="load_imgs mt-3">
                                {previews.map((imgUrl, index) => {
                                    return  <li key={index}>
                                                <Link to="#" className="delete_icon_btn" onClick={() => removeImg(index)}><i className="fa fa-trash"></i></Link>
                                                <img src={imgUrl} alt="..." />
                                            </li>
                                })}
                            </ul>
                        }
                        <div className="review_img_preview_wrapper">
                            {reviewData !== undefined && reviewData ?
                                reviewData.reviewImages.map((value, index) => {
                                    return <img src={config.apiURI + value} alt="..." key={index} />
                                })
                            : ''}
                        </div>
                        {formik.touched.images && formik.errors.images ? (
                            <small className="text-danger">{formik.errors.images}</small>
                        ) : null}
                    </div>
                </div>
                <div className="form-group">
                    <label htmlFor="" className="invisible">btn</label>
                    <div className="order_field_width_100">
                        <button type="submit" className="btn custom_btn btn_yellow" disabled={!formik.isValid}>Submit</button>
                    </div>
                </div>
            </form>
        </React.Fragment>
    )
}

export default FormForOrderDetailTabs;