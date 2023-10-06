import React, { Component } from 'react'
import Header from '../../components/seller/common/Header';
import Footer from '../../components/common/Footer';
import store from '../../store/index';
import axios from 'axios';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { setLoading } from '../../store/reducers/global-reducer';
import config from '../../config.json';
import { Link } from 'react-router-dom';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import NotFound from '../../components/common/NotFound';
import { Formik } from 'formik';
import Select from 'react-select';
import sellerHelpSchema from '../../validation-schemas/sellerHelpSchema';

class Payments extends Component {
    constructor(props) {
        super(props);
        const { dispatch } = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;
        this.state = {
            data: [],
            reqBody: {
                count: {
                    page: 1,
                    skip: 0,
                    limit: 5
                },
                sorting: {
                    sort_type: "date",
                    sort_val: "desc"
                }
            },
            pagination: {},
            sortingOptions: [
                { label: 'New to Old', value: 'desc' },
                { label: "Old to New ", value: 'asc' },
            ],
            defaultSelectedOption: { label: 'New to Old', value: 'desc' },
            reasons: [
                { label: 'Payment listing not displaying properly.', value: 'Payment listing not displaying properly.' },
                { label: 'Product image not visible.', value: 'Product image not visible.' },
                { label: 'Amount is not correct.', value: 'Amount is not correct.' }
            ],
            defaultReason: { label: 'Payment listing not displaying properly.', value: 'Payment listing not displaying properly.' },
            needHelp: false
        };
        toast.configure();
    }

    componentDidMount() {
        this.getPayments(false, null);
    }

    getPayments = (pagination, param) => {
        let reqBody = {};

        if (pagination === true) {
            reqBody = {
                count: {
                    page: param,
                    skip: (param - 1) * 5,
                    limit: 5
                },
                sorting: {
                    sort_type: "date",
                    sort_val: this.state.defaultSelectedOption.value
                }
            };
        } else {
            reqBody = this.state.reqBody;
        }

        this.dispatch(setLoading({ loading: true }));
        axios.post(`seller/payments/${this.authInfo.id}`, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                this.setState({
                    data: response.data.data.payments,
                    pagination: response.data.data.paginationData
                });
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    handleSubmit = (values, { resetForm }) => {
        values['seller_id'] = this.authInfo.id
        this.dispatch(setLoading({ loading: true }));
        axios.post('seller/need-help/', values, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            toast.dismiss();
            if (response.data.status) {
                toast.success(response.data.message, { autoClose: 3000 });
                resetForm();
                this.setState({ needHelp: false })
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    pagination = () => {
        let html = [];
        for (let index = 0; index < this.state.pagination.totalPages; index++) {
            let pageNumber = index + 1;
            html.push(<li key={index}><Link to="#" className={`link ${this.state.pagination.currentPage === pageNumber ? 'active' : ''}`} onClick={() => this.getPayments(true, pageNumber)}>{pageNumber}</Link></li>);
        }
        return html;
    }

    handleChange = selectedOption => {
        let reqBody = this.state.reqBody;
        reqBody.sorting.sort_val = selectedOption.value;
        reqBody.count.page = this.state.pagination.currentPage;
        reqBody.count.skip = (this.state.pagination.currentPage - 1) * 5;
        this.setState({ defaultSelectedOption: selectedOption, reqBody });
        this.getPayments(false, this.state.pagination.currentPage);
    }

    handleModal = () => this.state.needHelp === true ? this.setState({ needHelp: false }) : this.setState({ needHelp: true });

    render() {
        const { loading } = store.getState().global;
        const {
            data,
            pagination,
            sortingOptions,
            defaultSelectedOption,
            reasons,
            defaultReason,
            needHelp
        } = this.state;

        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <div className="seller_body">
                    <Header />
                    <div className="seller_dash_wrap pt-5 pb-5">
                        <div className="container ">
                            <div className="row mt-4">
                                <div className="col-md-12">
                                    <div className="my_pro_cart bg-white">
                                        <div className="mpc_header">
                                            <div className="dash_title">Payments</div>
                                            <Select
                                                className="sort_select text-normal"
                                                options={sortingOptions}
                                                value={defaultSelectedOption}
                                                onChange={this.handleChange}
                                            />
                                        </div>
                                        {data.length > 0 ?
                                            <table className="table table-responsive table-hover pe_table mpc_table">
                                                <thead>
                                                    <tr>
                                                        <th scope="col">Product</th>
                                                        <th scope="col">Amount Received</th>
                                                        <th scope="col">Date</th>
                                                        <th scope="col">Order ID</th>
                                                        <th scope="col">Transfered in Account</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.length && data.map((value, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>
                                                                    <div className="odr_item_img"><img src={config.apiURI + value.orderId.productId.featuredImage} className="img-fluid" alt={value.orderId.productId.name} /></div>
                                                                    <span>{value.orderId.productId._id}</span>
                                                                </td>
                                                                <td>${value.amountPaid}</td>
                                                                <td>{value.createdAt}</td>
                                                                <td>{value.orderId.orderCode}</td>
                                                                <td>${value.paymentAccount} Account</td>
                                                            </tr>
                                                        )
                                                    })}
                                                </tbody>
                                            </table>
                                            : <NotFound msg="Data not found." />
                                        }
                                        {data.length > 0 &&
                                            <div className="pagination">
                                                <ul>
                                                    <li><Link to="#" className={`link ${pagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getPayments(true, pagination.prevPage)}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                    {this.pagination()}
                                                    <li><Link to="#" className={`link ${pagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getPayments(true, pagination.nextPage)}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
                                                </ul>
                                            </div>
                                        }
                                        <div className="mpc_footer">
                                            <div className="dash_inner_wrap">
                                                <button className="btn custom_btn btn_yellow w-auto" type="button" onClick={() => this.handleModal()}>Need Help ?</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />

                    {/*Modal*/}
                    {needHelp === true &&
                        <React.Fragment>
                            <div className="modal fade show d-block" id="needHelp" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                <div className="modal-dialog  modal-dialog-centered">
                                    <div className="modal-content">
                                        <div className="modal-header border-0 pb-0">
                                            <button type="button" className="btn-close" onClick={() => { this.setState({ needHelp: false }) }}></button>
                                        </div>
                                        <div className="modal-body p-4">
                                            <div className="help_form pt-3 pb-3">
                                                <Formik
                                                    initialValues={{
                                                        reason: defaultReason.value,
                                                        comment: ''
                                                    }}
                                                    onSubmit={(values, { resetForm }) => {
                                                        this.handleSubmit(values, { resetForm });
                                                    }}
                                                    validationSchema={sellerHelpSchema}
                                                >
                                                    {({ values,
                                                        errors,
                                                        touched,
                                                        handleChange,
                                                        handleBlur,
                                                        handleSubmit,
                                                        isValid
                                                    }) => (
                                                        <form onSubmit={handleSubmit}>
                                                            <h4 className="mb-3 text-uppercase">Need Help?</h4>
                                                            <div className="form-group mb-3 text-start">
                                                                <Select
                                                                    name="reason"
                                                                    id="reason"
                                                                    className="text-normal text-start"
                                                                    options={reasons}
                                                                    value={defaultReason}
                                                                    onChange={(selectedOption) => {
                                                                        values.reason = selectedOption.value;
                                                                        this.setState({ defaultReason: selectedOption });
                                                                    }}
                                                                />
                                                                {touched.reason && errors.reason ? (
                                                                    <small className="text-danger">{errors.reason}</small>
                                                                ) : null}
                                                            </div>

                                                            <div className="form-group mb-3 text-start">
                                                                <textarea id="comment" className="form-control" placeholder="Reason Not listed/Elaborate" rows="5"
                                                                    name="comment"
                                                                    onChange={handleChange}
                                                                    onBlur={handleBlur}
                                                                    value={values.comment}
                                                                ></textarea>
                                                                {touched.comment && errors.comment ? (
                                                                    <small className="text-danger">{errors.comment}</small>
                                                                ) : null}
                                                            </div>
                                                            <button className="btn custom_btn btn_yellow w-auto" type="submit" disabled={!isValid}>Send</button>
                                                        </form>
                                                    )}
                                                </Formik>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-backdrop fade show"></div>
                        </React.Fragment>
                    }
                </div>
            </React.Fragment>
        )
    }
}

export default connect(setLoading)(Payments);