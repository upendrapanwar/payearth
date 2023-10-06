import React, { Component } from 'react';
import Header from '../../components/user/common/Header';
import PageTitle from '../../components/user/common/PageTitle';
import Footer from '../../components/common/Footer';
import axios from 'axios';
import { setLoading } from '../../store/reducers/global-reducer';
import odrPlcedIcon from './../../assets/icons/odr_plced_icon.svg';
import deliveredIcon from './../../assets/icons/otw_icon.svg';
import { connect } from 'react-redux';
import config from './../../config.json';
import Rating from '../../components/common/Rating';
import getDate from '../../helpers/get-formated-date';
import processingIcon from './../../assets/icons/processing-icon.svg';
import packedIcon from './../../assets/icons/packed-icon.svg';
import shippedIcon from './../../assets/icons/shipped-icon.svg';
import cancelIcon from './../../assets/icons/cancelled-icon.svg';
import store from '../../store';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import FormForOrderInfoTabs from './../../components/user/order-detail/FormForOrderDetailTabs';
import { setCancelReq, setComlaint, setOrderInfo, setReturnReq, setReviews, setTimelines } from './../../store/reducers/order-reducer';

class OrderDetail extends Component {
    constructor(props) {
        super(props);
        const {dispatch} = props;
        this.dispatch = dispatch;
        this.authInfo = JSON.parse(localStorage.getItem('authInfo'));
        this.state = {};
    }

    componentDidMount() {
        let orderId = window.location.pathname.split('/')[2];
        this.dispatch(setLoading({loading: false}));
        axios.get(`user/orders/${orderId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                let timelines = [];
                if (response.data.data.orderTimeline.length > 0) {
                    response.data.data.orderTimeline.forEach(item => {
                        timelines.push(item.orderStatusId.lname)
                    });
                }

                this.dispatch(setOrderInfo({orderInfo: response.data.data}));
                this.dispatch(setTimelines({timelines: timelines}));

                if (this.state.reviews === null && timelines.includes('delivered') === true) this.dispatch(setReviews({reviews: true}))
                if (timelines.includes('complaint') === false && timelines.includes('delivered') === true) this.dispatch(setComlaint({comlaint: true}))
                if (timelines.includes('return_request') === false && timelines.includes('delivered') === true) this.dispatch(setReturnReq({returnReq: true}))
                if (timelines.includes('cancel_request') === false && timelines.includes('delivered') === false) this.dispatch(setCancelReq({cancelReq: true}))
            }
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    getTimelineIcon = param => {
        switch (param) {
            case 'pending': return deliveredIcon;
            case 'processing': return processingIcon;
            case 'packed': return packedIcon;
            case 'shipped': return shippedIcon;
            case 'delivered': return deliveredIcon;
            case 'completed': return deliveredIcon;
            case 'cancelled': return deliveredIcon;
            case 'declined': return deliveredIcon;
            case 'refunded': return deliveredIcon;
            case 'disputed': return deliveredIcon;
            case 'failed': return deliveredIcon;
            case 'returned': return deliveredIcon;
            case 'cancel_request': return cancelIcon;
            case 'return_request': return deliveredIcon;
            case 'complaint': return deliveredIcon;
            default:
                break;
        }
    }

    handleDownloadFile = fileName => window.open(fileName, 'Download');

    render() {
        const {loading} = store.getState().global;
        const {orderInfo, timelines} = store.getState().order;

        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <Header />
                <PageTitle title="Order Details" />
                <section className="inr_wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="odr_dtls_wrap bg-white rounded-3 mb-4">
                                    <div className="odr_dtls_pro_info">
                                        <div className="items_incart">
                                            <span>Order id : {orderInfo.order && orderInfo.order.orderCode}</span>
                                        </div>
                                        <div className="clp_item">
                                            <div className="clp_item_img"><img src={orderInfo.order && config.apiURI + orderInfo.order.productId.featuredImage} alt="..." /></div>
                                            <div className="clp_item_info">
                                                <Rating avgRating={orderInfo.order && orderInfo.order.productId.avgRating} />
                                                <div className="cl_pro_name">{orderInfo.order && orderInfo.order.productId.name}</div>
                                                <div className="cl_pro_price"><span>$ {orderInfo.order && orderInfo.order.productId.price}</span></div>
                                                <div className="cl_pro_sts">{orderInfo.order && orderInfo.order.orderStatus.orderStatusId.title} on {getDate(orderInfo.order && orderInfo.order.orderStatus.updatedAt)}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="odr_dtls_pro_deliver_sts">
                                        {orderInfo.invoice && orderInfo.invoice !== null ?
                                            <div className="d-flex justify-content-end">
                                                <button className="btn custom_btn btn_yellow_bordered" onClick={() => this.handleDownloadFile(config.apiURI + orderInfo.invoice.invoiceUrl)}>Download Invoice</button>
                                            </div>
                                        : ''}

                                        <div className="odr_track_steps">
                                            <div className="odr_trk_step">
                                                <div className="odr_trk_icon"><img src={odrPlcedIcon} alt="odr_plced_icon" /></div>
                                                <div className="odr_sts_name">Order Placed</div>
                                                <div className="odr_sts_date">{orderInfo.order && getDate(orderInfo.order.createdAt)}</div>
                                            </div>
                                            {orderInfo.orderTimeline && orderInfo.orderTimeline.length > 0 ?
                                                <React.Fragment>
                                                    {orderInfo.orderTimeline.map((value, index) => {
                                                        return <div className="odr_trk_step" key={index}>
                                                            <div className="odr_trk_icon">
                                                                <img src={this.getTimelineIcon(value.orderStatusId.lname)} alt={value.orderStatusId.title} />
                                                            </div>
                                                            <div className="odr_sts_name">{value.orderStatusId.title}</div>
                                                            <div className="odr_sts_date">{getDate(value.updatedAt)}</div>
                                                        </div>
                                                    })}
                                                </React.Fragment>
                                            : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="odr_dtls_wrap bg-white rounded-3 mb-4">
                                    <div className="odr_dtls_tabs">
                                        <div className="odt_tabs">
                                            <div className="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                                <button className="tab_link active" id="v-pills-rate-tab" data-bs-toggle="pill" data-bs-target="#v-pills-rate" type="button" role="tab" aria-controls="v-pills-rate" aria-selected="true">Rate & Review</button>

                                                {timelines.includes('complaint') === false && timelines.includes('delivered') === true ?
                                                    <button className="tab_link" id="v-pills-complaint-tab" data-bs-toggle="pill" data-bs-target="#v-pills-complaint" type="button" role="tab" aria-controls="v-pills-complaint" aria-selected="false">Complaint</button>
                                                : ''}

                                                {timelines.includes('return_request') === false && timelines.includes('delivered') === true ?
                                                    <button className="tab_link" id="v-pills-return-tab" data-bs-toggle="pill" data-bs-target="#v-pills-return" type="button" role="tab" aria-controls="v-pills-return" aria-selected="false">Return</button>
                                                : ''}

                                                {timelines.includes('cancel_request') === false && timelines.includes('delivered') === false ?
                                                    <button className="tab_link" id="v-pills-cancel-tab" data-bs-toggle="pill" data-bs-target="#v-pills-cancel" type="button" role="tab" aria-controls="v-pills-cancel" aria-selected="false">Cancel</button>
                                                : '' }
                                            </div>
                                        </div>
                                        <div className="tab-content" id="v-pills-tabContent">
                                            <div className="tab-pane fade show active" id="v-pills-rate" role="tabpanel" aria-labelledby="v-pills-rate-tab">
                                                <div className="tab_title">Rate & review of your purchase</div>
                                                <div className="rating_form mb-5">
                                                    <FormForOrderInfoTabs
                                                        formType="reviews"
                                                        titlePlaceholder="Title"
                                                        desPlaceholder="Product Details"
                                                        orderId={orderInfo.order && orderInfo.order.id}
                                                        productId={orderInfo.order && orderInfo.order.productId.id}
                                                        reviewData={orderInfo.reviewData}
                                                    />
                                                </div>
                                            </div>

                                            {timelines.includes('complaint') === false && timelines.includes('delivered') === true ?
                                                <div className="tab-pane fade" id="v-pills-complaint" role="tabpanel" aria-labelledby="v-pills-complaint-tab">
                                                    <div className="tab_title">write your complaint of product</div>
                                                    <div className="rating_form mb-5">
                                                        <FormForOrderInfoTabs
                                                            formType="complaints"
                                                            titlePlaceholder="Title"
                                                            desPlaceholder="Complaint"
                                                            orderId={orderInfo.order && orderInfo.order.id}
                                                            productId={orderInfo.order && orderInfo.order.productId.id}
                                                        />
                                                    </div>
                                                </div>
                                            : ''}

                                            {timelines.includes('return_request') === false && timelines.includes('delivered') === true ?
                                                <div className="tab-pane fade" id="v-pills-return" role="tabpanel" aria-labelledby="v-pills-return-tab">
                                                    <div className="tab_title">Return your product</div>
                                                    <div className="rating_form mb-5">
                                                        <FormForOrderInfoTabs
                                                            formType="return"
                                                            titlePlaceholder="Title"
                                                            desPlaceholder="Return Reason"
                                                            orderId={orderInfo.order && orderInfo.order.id}
                                                            productId={orderInfo.order && orderInfo.order.productId.id}
                                                        />
                                                    </div>
                                                </div>
                                            : ''}

                                            {timelines.includes('cancel_request') === false && timelines.includes('delivered') === false ?
                                                <div className="tab-pane fade" id="v-pills-cancel" role="tabpanel" aria-labelledby="v-pills-cancel-tab">
                                                    <div className="tab_title">Cancel your product</div>
                                                    <div className="rating_form mb-5">
                                                        <FormForOrderInfoTabs
                                                            formType="cancel"
                                                            titlePlaceholder="Why you are canceling"
                                                            desPlaceholder="Cancel Reason"
                                                            orderId={orderInfo.order && orderInfo.order.id}
                                                            productId={orderInfo.order && orderInfo.order.productId.id}
                                                        />
                                                    </div>
                                                </div>
                                            : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </React.Fragment>
        );
    }
}

export default connect(setLoading)(OrderDetail);