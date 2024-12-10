import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/admin/common/Header';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import store from '../../store/index';
import axios from 'axios';
import Footer from '../../components/common/Footer';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import DetailComponent from '../../components/admin/common/ProductDetail';

class ManageProductDetails extends Component {
    constructor(props) {
        super(props)
        this.authInfo = store.getState().auth.authInfo;
        this.state = {
            productDetail: {},
            colors: {}
        };
    }

    componentDidMount() {
        this.getColors();
        this.getProductDetail();
    }

    getColors = () => {
        axios.get('admin/colors', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                this.setState({ colors: response.data.data });
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        });
    }

    getProductDetail = () => {
        const { dispatch } = this.props;
        const productId = window.location.pathname.split('/')[3];
        dispatch(setLoading({ loading: true }));
        axios.get(`admin/getProductDetailsById/${productId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                this.setState({ productDetail: response.data.data });
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    render() {
        const { loading } = store.getState().global;
        const { productDetail, colors } = this.state;
        const type = 'product';

        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <div className="seller_body">
                    <Header />
                    <DetailComponent data={productDetail} colors={colors} type={type} />
                    <Footer />
                </div>
            </React.Fragment>
        )
    }
}

export default connect(setLoading)(ManageProductDetails);
