import React, { useEffect, useState } from 'react'
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import { Formik, Form, Field } from 'formik';
import axios from 'axios';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import arrow_back from '../../assets/icons/arrow-back.svg';
import { Link } from "react-router-dom";
import adminRegistrationSchema from '../../validation-schemas/adminRegistrationSchema';
import invisibleIcon from '../../assets/icons/invisible-icon.svg';
import visibleIcon from '../../assets/icons/eye-icon.svg';

const ManageAdmins = () => {
    const authInfo = JSON.parse(localStorage.getItem('authInfo'));


    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [adminModalOpen, setAdminModalOpen] = useState(false);
    const [seePassword, setSeePassword] = useState(false);


    useEffect(() => {
        getAllAdmins();
    }, [])


    const getAllAdmins = async () => {

        try {
            const response = await axios.get("/admin/getAllAdmins", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            })
            console.log("response", response);
            if (response.data.status === true && response.data.data.length > 0) {
                setAdmins(response.data.data);
                setLoading(false)
            }
        } catch (error) {

        }
    }


    const ManageCapability = (row) => {
        console.log('row', row);
    }


    const addNewAdmin = async () => {
        setAdminModalOpen(true);
    }

    const handlePasswordVisibility = () => {
        setSeePassword((prev) => !prev); 
    };

    const handleSubmit = async(values) => {
        console.log("values",values);
        const response = await axios.post(`admin/signup`,values);
        console.log("response",response);
        if(response.data.status === true && response.data.data.length > 0){
            
        }
    }


    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Admins Id',
            selector: row => row.id,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Phone',
            selector: row => row.phone,
            sortable: true,
        },
        {
            name: 'Created Date',
            selector: row => new Date(row.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }),
            sortable: true,
        },

        {
            name: 'Actions',
            cell: (row) => {
                return (
                    <>
                        <button
                            className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new action_btn_textView"
                            onClick={() => ManageCapability(row.id)}>
                            Manage Capability
                        </button>
                    </>
                )
            }
        }

    ];

    const tableData = {
        columns,
        data: admins,
    };


    return (
        <React.Fragment>
            <div className="seller_body">
                <Header />
                <div className="seller_dash_wrap pt-5 pb-5">
                    <div className="container">
                        <div className="bg-white rounded-3 pt-3 pb-5">
                            <div className="dash_inner_wrap">
                                {loading ? (
                                    <SpinnerLoader />
                                ) : (
                                    <div className="col-lg-12">
                                        <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
                                            <div className="cp_top d-flex justify-content-between align-items-center">
                                                <div className="cumm_title">Admins List</div>
                                                <div className="d-flex justify-content-end ml-auto gap-2">
                                                    <Link className="btn custom_btn btn_yellow ml-auto" to="#" onClick={addNewAdmin}>Add admin</Link>
                                                    <Link className="btn custom_btn btn_yellow mx-auto" to="/admin/dashboard">
                                                        <img src={arrow_back} alt="linked-in" />&nbsp;Back
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="cp_body">
                                                <DataTableExtensions
                                                    {...tableData}>
                                                    <DataTable
                                                        columns={columns}
                                                        data={admins}
                                                        pagination
                                                        striped
                                                        highlightOnHover
                                                    />
                                                </DataTableExtensions>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {adminModalOpen && (
                    <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-modal="true">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Edit Category</h5>
                                    <button
                                        type="button"
                                        className="btn-close"
                                        onClick={() => {
                                            setAdminModalOpen(false);
                                            // setEditCateData([]);
                                        }}
                                        aria-label="Close"
                                    ></button>
                                </div>
                                <div className="modal-body">
                                <Formik
                                        initialValues={{
                                            name: '',
                                            phone: '',
                                            email: '',
                                            password: '',
                                        }}
                                        onSubmit={handleSubmit}
                                        validationSchema={adminRegistrationSchema}
                                    >
                                        {({ values,
                                            errors,
                                            touched,
                                            handleChange,
                                            handleBlur,
                                            isValid
                                        }) => (
                                            <Form className="seller_register">
                                                <div className="row ">
                                                    <div className="col-md-12 ">
                                                        <div className="mb-3">
                                                            <label htmlFor="name" className="form-label">Business Name <small className="text-danger">*</small></label>
                                                            <Field type="text" className="form-control" id="name" name="name" />
                                                            {touched.name && errors.name ? (
                                                                <small className="text-danger">{errors.name}</small>
                                                            ) : null}
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="phone" className="form-label">Phone Number <small className="text-danger">*</small></label>
                                                            <Field type="text" className="form-control" id="phone" name="phone" />
                                                            {touched.phone && errors.phone ? (
                                                                <small className="text-danger">{errors.phone}</small>
                                                            ) : null}
                                                        </div>
                                                        <div className="mb-3">
                                                            <label htmlFor="email" className="form-label">Business Email ID <small className="text-danger">*</small></label>
                                                            <Field type="email" className="form-control" id="email" name="email" />
                                                            {touched.email && errors.email ? (
                                                                <small className="text-danger">{errors.email}</small>
                                                            ) : null}
                                                        </div>
                                                        <div className="pwd_wrapper sel_pwd mb-3">
                                                            <label htmlFor="password" className="form-label">Password <small className="text-danger">*</small></label>
                                                            <Field type={seePassword ? "text" : "password"} className="form-control" id="password" name="password" />
                                                            <img 
                                                                src={seePassword ? visibleIcon : invisibleIcon} 
                                                                alt="toggle password visibility" 
                                                                onClick={handlePasswordVisibility} 
                                                                style={{ cursor: 'pointer' }} 
                                                            />
                                                            {touched.password && errors.password ? (
                                                                <small className="text-danger">{errors.password}</small>
                                                            ) : null}
                                                        </div>
                                                        <button type="submit" className="btn custom_btn btn_yellow text-uppercase w-100 p-3" disabled={!isValid}>Save</button>
                                                    </div>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <Footer />
            </div>
        </React.Fragment>
    )
}

export default ManageAdmins