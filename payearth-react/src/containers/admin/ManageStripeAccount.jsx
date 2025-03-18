import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { isLogin } from "../../helpers/login";
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import PageTitle from './../../components/user/common/PageTitle';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaEye, FaEyeSlash, FaCopy } from "react-icons/fa";
import StripeKeysValidation from '../../validation-schemas/StripeKeysValidation';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import { Helmet } from 'react-helmet';
import arrow_back from '../../assets/icons/arrow-back.svg'

const ManageStripeAccount = () => {
    const isLoged_In = isLogin();
    const authInfo = JSON.parse(localStorage.getItem('authInfo'));
    const [loading, setLoading] = React.useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [stripe_publishable, setStripe_publishable_key] = useState('');
    const [stripe_secret, setStripe_secret_key] = useState('');

    const [showKeys, setShowKeys] = useState({
        stripe_publishable_key: false,
        stripe_secret_key: false,
    });

    const toggleVisibility = (key) => {
        setShowKeys((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        toast.info('key copied..');
    };

    useEffect(() => {
        getDisplayedStripeKey();
    }, []);

    const getDisplayedStripeKey = async () => {
        setLoading(true);
        try {
            const res = await axios.get('admin/getDisplayedStripeKeys', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`,
                },
            });
            if (res.data.status === true) {
                console.log("res.data.data.stripe_publishable_key", res.data.data.stripe_publishable_key)
                setStripe_publishable_key(res.data.data.stripe_publishable_key);
                setStripe_secret_key(res.data.data.stripe_secret_key);
            }
        } catch (error) {
            console.error('Error fetching vendors:', error);
            // toast.error('Failed to fetch vendors');
        } finally {
            setLoading(false);
        }
    };

    const handleUserSelection = (user) => {
        const isSelected = selectedUsers.some((u) => u.id === user.id);
        if (isSelected) {
            setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    // Handle select all users
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers([]);
        } else {
            // setSelectedUsers(customers);
        }
        setSelectAll(!selectAll);
    };

    const handleSubmit = (values, { resetForm }) => {
        console.log("selectedUsers.............test", selectedUsers)
        if (!isLoged_In) {
            toast.error("Please log in your account.", { autoClose: 3000 });
            return;
        }
        const requestData = {
            ...values,
        };

        setLoading(true);
        const authInfo = JSON.parse(localStorage.getItem('authInfo'));
        axios.post('/admin/updateStripeKey', requestData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${authInfo.token}`
            }
        })
            .then(response => {
                toast.dismiss();
                if (response.data.status) {
                    toast.success("Update keys", { autoClose: 3000 });
                    // resetForm();

                } else {
                    toast.error(response.data.message, { autoClose: 3000 });
                }
            })
            .catch(error => {
                toast.dismiss();
                if (error.response) {
                    toast.error(error.response.data.message, { autoClose: 3000 });
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };


    // console.log("customers", customers)
    // console.log("selectedUsers", selectedUsers)
    return (
        <React.Fragment>
            {loading && <SpinnerLoader />}
            <div className="seller_body">
                <Header />
                <PageTitle title="Manage Stripe Account" />
                <Helmet><title>{"Admin - Stripe Account - Pay Earth"}</title></Helmet>
                <div className="seller_dash_wrap pt-2 pb-5">
                    <div className="container cnt_mob_lr0">
                        <div className="bg-white rounded-3 pt-3 pb-5">
                            <div className="dash_inner_wrap">
                                <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center flex_mob_none">
                                    <div className="dash_title">Manage Stripe Account</div>
                                    <div className="search_customer_field">
                                        <div className="d-flex gap-2">
                                            <div className=''>
                                                <button
                                                    type="button"
                                                    className="btn custum_back_btn btn_yellow mx-auto"
                                                    onClick={() => window.history.back()}
                                                >
                                                    <img src={arrow_back} alt="back" />&nbsp;
                                                    Back
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <nav className="orders_tabs">
                                    <div className="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                        <button
                                            className="nav-link active "
                                            id="nav-connected-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#nav-connected"
                                            type="button"
                                            role="tab"
                                            aria-controls="nav-connected"
                                        >
                                            Connected Account
                                        </button>
                                        <button
                                            className="nav-link"
                                            id="nav-stripekey-tab"
                                            data-bs-toggle="tab"
                                            data-bs-target="#nav-stripekey"
                                            type="button"
                                            role="tab"
                                            aria-controls="nav-stripekey"
                                        >
                                            Stripe Keys
                                        </button>
                                    </div>
                                </nav>
                            </div>

                            <div className="orders_table tab-content pt-0 pb-0 addPost_table_extention" id="nav-tabContent">
                                {/* Publish */}
                                <div className="tab-pane fade show active" id="nav-connected" role="tabpanel" aria-labelledby="nav-connected-tab">
                                    <DataTableExtensions
                                    // columns={this.published_column}
                                    // data={publish}
                                    >
                                        <DataTable
                                            pagination
                                            noHeader
                                            highlightOnHover
                                            defaultSortField="id"
                                            defaultSortAsc={false}
                                            selectableRows
                                        // selectedRows={selectedRows}
                                        // onSelectedRowsChange={this.handleRowSelected}
                                        />
                                    </DataTableExtensions>
                                </div>

                                <div className="tab-pane fade" id="nav-stripekey" role="tabpanel" aria-labelledby="nav-stripekey-tab">
                                    <div className="stripekey_form_wrap">
                                        <div className="form_wrapper pt-3">
                                            <h4 className="form_title m-4 mt-4 mb-4">For developers</h4>
                                            <Formik
                                                initialValues={{
                                                    stripe_publishable_key: stripe_publishable,
                                                    stripe_secret_key: stripe_secret,
                                                }}
                                                enableReinitialize={true}
                                                onSubmit={handleSubmit}
                                                validationSchema={StripeKeysValidation}
                                            >
                                                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isValid }) => (
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="col-md-12">
                                                            <div className="m-4 mb-3 position-relative">
                                                                <label htmlFor="stripe_publishable_key" className="form-label">
                                                                    Publishable Key <small className="text-danger">*</small>
                                                                </label>
                                                                <div className="input-group">
                                                                    <input
                                                                        type={showKeys.stripe_publishable_key ? "text" : "password"}
                                                                        className="form-control"
                                                                        name="stripe_publishable_key"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.stripe_publishable_key}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-secondary"
                                                                        onClick={() => toggleVisibility("stripe_publishable_key")}
                                                                    >
                                                                        {showKeys.stripe_publishable_key ? <FaEyeSlash /> : <FaEye />}
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-secondary"
                                                                        onClick={() => copyToClipboard(values.stripe_publishable_key)}
                                                                    >
                                                                        <FaCopy />
                                                                    </button>
                                                                </div>
                                                                {touched.stripe_publishable_key && errors.stripe_publishable_key && (
                                                                    <small className="text-danger">{errors.stripe_publishable_key}</small>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="col-md-12">
                                                            <div className="m-4 mb-3 position-relative">
                                                                <label htmlFor="stripe_secret_key" className="form-label">
                                                                    Secret Key <small className="text-danger">*</small>
                                                                </label>
                                                                <div className="input-group">
                                                                    <input
                                                                        type={showKeys.stripe_secret_key ? "text" : "password"}
                                                                        className="form-control"
                                                                        name="stripe_secret_key"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.stripe_secret_key}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-secondary"
                                                                        onClick={() => toggleVisibility("stripe_secret_key")}
                                                                    >
                                                                        {showKeys.stripe_secret_key ? <FaEyeSlash /> : <FaEye />}
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-outline-secondary"
                                                                        onClick={() => copyToClipboard(values.stripe_secret_key)}
                                                                    >
                                                                        <FaCopy />
                                                                    </button>
                                                                </div>
                                                                {touched.stripe_secret_key && errors.stripe_secret_key && (
                                                                    <small className="text-danger">{errors.stripe_secret_key}</small>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="d-flex justify-content-center">
                                                            <button type="submit" className="btn custom_btn btn_yellow text-uppercase text-center" disabled={!isValid}>
                                                                Update
                                                            </button>
                                                        </div>
                                                    </form>
                                                )}
                                            </Formik>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </React.Fragment>
    );
};

export default ManageStripeAccount;
