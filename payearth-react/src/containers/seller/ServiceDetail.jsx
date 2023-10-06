import React, { Component } from 'react'
import Header from '../../components/seller/common/Header';
import Footer from '../../components/common/Footer';
import store from '../../store/index';
import axios from 'axios';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { setLoading } from '../../store/reducers/global-reducer';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import DetailComponent from '../../components/seller/common/ProductDetail';

class ServiceDetail extends Component {
    constructor(props) {
        super(props)
        this.authInfo = store.getState().auth.authInfo;
        this.state = {
            serviceDetail: {},
            colors: {}
        };
    }

    componentDidMount() {
        this.getColors();
        this.getServiceDetail();
    }

    getColors = () => {
        axios.get('seller/colors', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                this.setState({colors: response.data.data});
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        });
    }

    getServiceDetail = () => {
        const {dispatch} = this.props;
        const orderId = window.location.pathname.split('/')[3];

        dispatch(setLoading({loading: true}));
        axios.get(`seller/services/${orderId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                this.setState({serviceDetail: response.data.data});
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    render() {
        const {loading} = store.getState().global;
        const {serviceDetail, colors} = this.state;

        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <div className="seller_body">
                    <Header />
                    <DetailComponent data={serviceDetail} colors={colors} type="service" />
                    <Footer />
                </div>
            </React.Fragment>
        )
    }
}

export default connect(setLoading)(ServiceDetail);