import React from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import arrow_back from '../../assets/icons/arrow-back.svg';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import { Link } from 'react-router-dom';
import createAdmin from '../../validation-schemas/AddAdminSchema';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { toast } from 'react-toastify';
 



const AddAdmin = () => {
    const history = useHistory();
    const authInfo = JSON.parse(localStorage.getItem("authInfo"))


    const handleSubmit = async (values) => {
        try {
            const res = await axios.post('admin/addAdmin', values,{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            })

            if(res.data.status === true){
                console.log("testing res", res);
                const id = res.data.data.id;           
                accessPermission(id);
            }
          
        } catch (error) {
            toast.error("Data has not saved.",error);
            console.error("Data has not saved.", error)
        }
    };



    const accessPermission = (id) => {
        console.log("Testing ID", id);
        history.push('/admin/access-permission', { id });
    }

    return (
        <React.Fragment>
            <div className="seller_body">
                <Header />
                <div className="seller_dash_wrap pt-5 pb-5">
                    <div className="container">
                        <div className="bg-white rounded-3 pt-3 pb-5">
                            <div className="dash_inner_wrap">
                                <div className="col-lg-12">
                                    <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
                                        <div className="cp_top d-flex justify-content-between align-items-center">
                                            <div className="cumm_title">Add New Admins</div>
                                            <div className="d-flex justify-content-end ml-auto gap-2">
                                                <Link className="btn custom_btn btn_yellow mx-auto" to="/admin/manage-admins">
                                                    <img src={arrow_back} alt="linked-in" />&nbsp;Back
                                                </Link>
                                            </div>
                                        </div>

                                        <div>
                                            <Formik
                                                initialValues={{
                                                    name: '',
                                                    phone: '',
                                                    email: '',
                                                    role: '',
                                                    password: '',
                                                }}
                                                onSubmit={handleSubmit}
                                                validationSchema={createAdmin}
                                            >
                                                {({ values, errors, touched, handleChange, handleBlur, handleSubmit }) => (
                                                    <form onSubmit={handleSubmit}>
                                                        <div className="adminForm">
                                                            <div className="row">
                                                                <div className="col-lg-6 mb-4">
                                                                    <label htmlFor="name" className="form-label">
                                                                        Name <small className="text-danger">*</small>
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="name"
                                                                        placeholder="Name"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.name}
                                                                    />
                                                                    {touched.name && errors.name && (
                                                                        <small className="text-danger">{errors.name}</small>
                                                                    )}
                                                                </div>

                                                                <div className="col-lg-6 mb-4">
                                                                    <label htmlFor="phone" className="form-label">
                                                                        Phone <small className="text-danger">*</small>
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="phone"
                                                                        placeholder="Phone number"
                                                                        maxLength={10}
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.phone}
                                                                    />
                                                                    {touched.phone && errors.phone && (
                                                                        <small className="text-danger">{errors.phone}</small>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="row">
                                                                <div className="col-lg-6 mb-4">
                                                                    <label htmlFor="email" className="form-label">
                                                                        Email <small className="text-danger">*</small>
                                                                    </label>
                                                                    <input
                                                                        type="email"
                                                                        className="form-control"
                                                                        name="email"
                                                                        placeholder="Email address"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.email}
                                                                    />
                                                                    {touched.email && errors.email && (
                                                                        <small className="text-danger">{errors.email}</small>
                                                                    )}
                                                                </div>


                                                                <div className="col-lg-6 mb-4">
                                                                    <label htmlFor="role" className="form-label">
                                                                        Role <small className="text-danger">*</small>
                                                                    </label>
                                                                    <select
                                                                        className="form-control"
                                                                        name="role"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.role}
                                                                    >
                                                                        <option value="" disabled>
                                                                            Select Role
                                                                        </option>
                                                                        <option value="admin">Admin</option>
                                                                        <option value="manager">Manager</option>
                                                                    </select>
                                                                    {touched.role && errors.role && (
                                                                        <small className="text-danger">{errors.role}</small>
                                                                    )}
                                                                </div>
                                                            </div>


                                                            <div className="row">
                                                                <div className="col-lg-6 mb-4">
                                                                    <label htmlFor="password" className="form-label">
                                                                        Password <small className="text-danger">*</small>
                                                                    </label>
                                                                    <input
                                                                        type="password"
                                                                        className="form-control"
                                                                        name="password"
                                                                        placeholder="Password"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.password}
                                                                    />
                                                                    {touched.password && errors.password && (
                                                                        <small className="text-danger">{errors.password}</small>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="mb-4 d-flex justify-content-center my-3">
                                                                <button type="submit" className="btn custom_btn btn_yellow ">
                                                                    Add Admin
                                                                </button>
                                                            </div>
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
        </React.Fragment >
    );
};

export default AddAdmin;
