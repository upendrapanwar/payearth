import React, { Component } from 'react';
import Header from '../../components/user/common/Header';
import PageTitle from '../../components/user/common/PageTitle';
import Footer from '../../components/common/Footer';
import axios from 'axios';
import { setLoading } from './../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { setUserInfo } from './../../store/reducers/auth-reducer';
import SpinnerLoader from './../../components/common/SpinnerLoader';
import store from '../../store/index';
import * as Yup from 'yup';

class MyProfile extends Component {
    constructor(props) {
        super(props);
        this.authInfo = JSON.parse(localStorage.getItem('authInfo'));
        var editProfile;

        if (localStorage.getItem('editProfile') !== null) {
            if (localStorage.getItem('editProfile') === 'false') {
                editProfile = false;
            } else {
                editProfile = true;
            }
        } else {
            editProfile = true;
        }

        this.state = {
            userDetails: [],
            accountTypeOptions: [
                {label: 'Buyer', value: 'user'},
                // {label: 'Seller', value: 'seller'}
            ],
            purchaseTypeOptions: [
                {label: 'Retailer', value: 'retail'},
                {label: 'Wholesale', value: 'wholesale'}
            ],
            selectedAccountType: {label: 'Buyer', value: 'user'},
            selectedPurchaseType: {label: 'Retailer', value: 'retail'},
            editProfile: editProfile
        };

        if (localStorage.getItem('editProfile') === null) {
            localStorage.setItem('editProfile', false);
        }

        toast.configure();
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(setLoading({loading: true}));
        axios.get('user/my-profile/' + this.authInfo.id, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                let resData = response.data.data;
                let selectedAccountType = '';
                let selectedPurchaseType = '';

                if (resData.role === 'user') {
                    selectedAccountType = {label: 'Buyer', value: 'user'};
                } else {
                    selectedAccountType = {label: 'Seller', value: 'seller'};
                }

                if (resData.purchase_type === 'retail') {
                    selectedPurchaseType = {label: 'Retailer', value: 'retail'};
                } else {
                    selectedPurchaseType = {label: 'Wholesale', value: 'wholesale'};
                }

                this.setState({
                    userDetails: resData,
                    selectedAccountType,
                    selectedPurchaseType
                });
            }
        }).catch(error => {
            console.log(error)
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    handleChangeAccount = selectedOption => this.setState({selectedAccountType: selectedOption});
    handlePurchaseType = selectedOption => this.setState({selectedPurchaseType: selectedOption});

    handleSubmit = (values) => {
        const { dispatch } = this.props;
        dispatch(setLoading({loading: true}));
        axios.put(`user/edit-profile/${this.authInfo.id}`, values, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                "Authorization" : `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            toast.dismiss();
            if (response.data.status) {
                toast.success(response.data.message, {autoClose:3000});
                let userInfo = {
                    name: response.data.data.name,
                    email: response.data.data.email,
                    purchase_type: response.data.data.purchase_type,
                    role: response.data.data.role
                };
                localStorage.setItem('userInfo', JSON.stringify(userInfo));
                dispatch(setUserInfo({userInfo}));
            }
        }).catch(error => {
            toast.dismiss();
            if(error.response && error.response.data.status === false) {
                toast.error(error.response.data.message, {autoClose:3000});
            }
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    handleEdit = () => {
        // console.log(this.state.userDetails)
        this.setState({userDetails: this.state.userDetails})
        let editProfile = localStorage.getItem('editProfile');
        if (editProfile !== null && editProfile === 'false') {
            localStorage.setItem('editProfile', true);
            this.setState({editProfile: true});
        } else {
            localStorage.setItem('editProfile', false);
            this.setState({editProfile: false});
        }
    }

    render() {
        const { loading } = store.getState().global;
        const { editProfile } = this.state;

        return (
            <React.Fragment>
                { loading === true ? <SpinnerLoader /> : '' }
                <Header />
                <PageTitle title="My Profile" />
                <section className="inr_wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="cart">
                                    <div className="cart_wrap">
                                        <div className="items_incart">
                                            <span>Personal Information</span>
                                        </div>
                                    </div>
                                    <div className="profile_edit_wrap">
                                        <div className="row">
                                            <div className="col-md-6 mb-5">
                                                <Formik
                                                    initialValues={{
                                                        name: this.state.userDetails.name ? this.state.userDetails.name : '',
                                                        email: this.state.userDetails.email ? this.state.userDetails.email : '',
                                                        role: this.state.selectedAccountType.value,
                                                        purchase_type: this.state.selectedPurchaseType.value
                                                    }}
                                                    validationSchema={
                                                        Yup.object().shape({
                                                            name: Yup.string().required("Name is required.").min(3, 'Name is too short - should be 3 chars minimum.').max(50, 'Name is too long - should be 50 chars maximum.'),
                                                            email: Yup.string().email().required("Email is required.")
                                                        })
                                                    }
                                                    onSubmit={(values, { setSubmitting }) => {
                                                        this.handleSubmit(values);
                                                        setTimeout(() => {
                                                            setSubmitting(false);
                                                        }, 400);
                                                    }}
                                                    enableReinitialize={true}
                                                >
                                                    {({
                                                        values,
                                                        errors,
                                                        touched,
                                                        handleChange,
                                                        handleBlur,
                                                        handleSubmit,
                                                        isSubmitting
                                                    }) => (
                                                        <form className="in_form" onSubmit={handleSubmit}>
                                                            <div className="form-group">
                                                                <label htmlFor="">Name <span className="text-danger">*</span></label>
                                                                <div>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="name"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.name}
                                                                        disabled={editProfile === true ? false : true}
                                                                    />
                                                                    {touched.name && errors.name ? (
                                                                        <small className="text-danger">{errors.name}</small>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="">Email <span className="text-danger">*</span></label>
                                                                <div>
                                                                    <input
                                                                        type="email"
                                                                        className="form-control"
                                                                        name="email"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.email}
                                                                        disabled={editProfile === true ? false : true}
                                                                        maxLength="50"
                                                                    />
                                                                    {touched.email && errors.email ? (
                                                                            <small className="text-danger">{errors.email}</small>
                                                                    ) : null}
                                                                </div>
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="">Account Type <span className="text-danger">*</span></label>
                                                                <Select
                                                                    className="form-control p-0 h-100 border-0"
                                                                    options={this.state.accountTypeOptions}
                                                                    value={this.state.selectedAccountType}
                                                                    onChange={this.handleChangeAccount}
                                                                    isDisabled={editProfile === true ? false : true}
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="">Purchase <span className="text-danger">*</span></label>
                                                                <Select
                                                                    className="form-control p-0 h-100 border-0"
                                                                    options={this.state.purchaseTypeOptions}
                                                                    value={this.state.selectedPurchaseType}
                                                                    onChange={this.handlePurchaseType}
                                                                    isDisabled={editProfile === true ? false : true}
                                                                />
                                                            </div>
                                                            <div className="form-group">
                                                                <label htmlFor="" className="invisible">btn</label>
                                                                {editProfile ?
                                                                    <div>
                                                                        <button type="submit" className="btn custom_btn btn_yellow_bordered">Save</button>
                                                                        <button type="button" className="btn custom_btn btn_yellow_bordered ms-2" onClick={this.handleEdit}>Cancel</button>
                                                                    </div>
                                                                : <button type="button" className="btn custom_btn btn_yellow_bordered" onClick={this.handleEdit}>Edit Profile</button>}
                                                            </div>
                                                        </form>
                                                    )}
                                                </Formik>
                                            </div>
                                            <div className="col-md-5">
                                                <div className="my_flw">
                                                    <label htmlFor="">Followers</label><span>{this.state.userDetails.community ? this.state.userDetails.community.followers : 0}</span>
                                                </div>
                                                <div className="my_flw">
                                                    <label htmlFor="">Following</label><span>{this.state.userDetails.community ? this.state.userDetails.community.following : 0}</span>
                                                </div>
                                            </div>
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

export default connect(setLoading) (MyProfile);