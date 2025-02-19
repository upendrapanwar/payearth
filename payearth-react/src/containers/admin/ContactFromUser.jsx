import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { isLogin } from "../../helpers/login";
import linkedinIcon from '../../assets/icons/linkedin.svg';
import twitterIcon from '../../assets/icons/twitter.svg';
import facebookIcon from '../../assets/icons/facebook.svg';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import PageTitle from './../../components/user/common/PageTitle';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import axios from 'axios';
import AdminContactUser from '../../validation-schemas/AdminContactUser'
import SpinnerLoader from '../../components/common/SpinnerLoader';
import { Helmet } from 'react-helmet';


const ContactFromUser = () => {
    const isLoged_In = isLogin();
    const authInfo = JSON.parse(localStorage.getItem('authInfo'));
    const [loading, setLoading] = React.useState(false);
    const [customers, setCustomers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    useEffect(() => {
        getCustomers();
    }, []);

    const getCustomers = async () => {
        setLoading(true);
        try {
            const res = await axios.get('admin/get-all-customers', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`,
                },
            });
            console.log("checking response of customers", res);
            if (res.data.status) {
                const customersData = res.data.data.map(customer => ({
                    id: customer.id,
                    name: customer.name,
                    email: customer.email,
                }));
                setCustomers(customersData);
            } else {
                toast.error(res.data.message || 'Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching vendors:', error);
            toast.error('Failed to fetch vendors');
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
            setSelectedUsers(customers);
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
            ...values,           // Form values
            selectedUsers       // Add selectedUsers to the request data
        };

        setLoading(true);
        const authInfo = JSON.parse(localStorage.getItem('authInfo'));
        axios.post('/admin/contactFromUser', requestData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${authInfo.token}`
            }
        })
            .then(response => {
                toast.dismiss();
                if (response.data.status) {
                    toast.success(response.data.message, { autoClose: 3000 });
                    resetForm();

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
    console.log("selectedUsers", selectedUsers)
    return (
        <React.Fragment>
            {loading && <SpinnerLoader />}
            <div className="seller_body">
                <Header />
                <PageTitle title="Contact" />
                <Helmet><title>{"Contact - Pay Earth"}</title></Helmet>
                <div className="seller_dash_wrap pt-2 pb-5">
                    <div className="container ">
                        <div className="bg-white rounded-3">
                            <div className="dash_inner_wrap contact_form_page">
                                <div className="row">
                                    <div className="col-lg-4 pt-5 pb-5">
                                        <div className="contact_info p-3 border rounded">
                                            <div className=" text-center dash_title mb-3 fw-bold">Select Users</div>
                                            <div className="d-flex align-items-center justify-content-between mb-2 bg-light">
                                                <input
                                                    type="checkbox"
                                                    className="me-2"
                                                    checked={selectAll}
                                                    onChange={handleSelectAll}
                                                />
                                                <label className="mb-0 text-bold">All</label>
                                            </div>
                                            <ul className="list-unstyled">
                                                {customers.map((user) => (
                                                    <li key={user.id} className="d-flex align-items-center justify-content-between mb-2">
                                                        <input
                                                            type="checkbox"
                                                            className="me-2"
                                                            checked={selectedUsers.some((u) => u.id === user.id)}
                                                            onChange={() => handleUserSelection(user)}
                                                        />
                                                        <label className="mb-0 ms-auto">{user.name}</label>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-lg-8">
                                        <div className="contact_form_wrap">
                                            <div className="form_wrapper">
                                                <h4 className="form_title m-4 mb-4">Write us</h4>
                                                <Formik
                                                    initialValues={{
                                                        subject: '',
                                                        message: '',
                                                        selectedUsers: selectedUsers
                                                    }}
                                                    onSubmit={handleSubmit}
                                                    validationSchema={AdminContactUser}
                                                >
                                                    {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isValid }) => (
                                                        <form onSubmit={handleSubmit}>
                                                            <div className="col-md-12">
                                                                <div className="m-4 mb-3">
                                                                    <label htmlFor="subject" className="form-label">Subject <small className="text-danger">*</small></label>
                                                                    <input type="text" className="form-control" id="name" aria-describedby="nameHelp"
                                                                        name="subject"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.subject}
                                                                    />
                                                                    {touched.subject && errors.subject && (
                                                                        <small className="text-danger">{errors.subject}</small>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="col-md-12">
                                                                <div className="m-4 mb-3">
                                                                    <label htmlFor="message" className="form-label">Message <small className="text-danger">*</small></label>
                                                                    <textarea className="form-control h-auto" rows="5"
                                                                        name="message"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.message}
                                                                    />
                                                                    {touched.message && errors.message && (
                                                                        <small className="text-danger">{errors.message}</small>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {selectedUsers.length > 0 ? <div className=" text-center col-md-12 mt-4">
                                                                <button type="submit" className="btn custom_btn btn_yellow text-uppercase" disabled={!isValid}>Send</button>
                                                            </div> :
                                                                <p className="text-center fw-semibold text-danger mt-4">Please select users to send mail...!</p>
                                                            }
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
                </div>
                <Footer />
            </div>
        </React.Fragment>
    );
};

export default ContactFromUser;
