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
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Helmet } from 'react-helmet';

const ManageAdmins = () => {
    const authInfo = JSON.parse(localStorage.getItem('authInfo'));
    const history = useHistory();

    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);
    // const [adminModalOpen, setAdminModalOpen] = useState(false);
    const [seePassword, setSeePassword] = useState(false);


    useEffect(() => {
        getAllAdmins();
    }, [])


    const getAllAdmins = async () => {
        try {
            const response = await axios.get("admin/getAllAdmins", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            });
            console.log("response", response);

            if (response.data.status === true && response.data.data.length > 0) {
                setAdmins(response.data.data);
            }
            setLoading(false);
        } catch (error) {
            console.error("Admin fetch failed.", error);
        } finally {
            setLoading(false);
        }
    };



    const ManageCapability = (row) => {
        const id = row;
        history.push(`/admin/manage-Capabilities`, { id });
    }


    const addNewAdmin = async () => {
        history.push("/admin/add-admin");
    }

    const handlePasswordVisibility = () => {
        setSeePassword((prev) => !prev);
    };

    const handleSubmit = async (values) => {
        console.log("values", values);
        const response = await axios.post(`admin/signup`, values);
        console.log("response", response);
        if (response.data.status === true && response.data.data.length > 0) {

        }
    }


    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Role',
            selector: row => row.role,
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
            {loading ? (
                <SpinnerLoader />
            ) : (
                <div className="seller_body">
                    <Header />
                    <div className="inr_top_page_title">
                        <h2>Manage Admins</h2>
                    </div>
                    <Helmet>
                        <title>{"Admin - Manage Admins - Pay Earth"}</title>
                    </Helmet>
                    <div className="seller_dash_wrap pb-5">
                        <div className="container">
                            <div className="bg-white rounded-3  pb-5">
                                <div className="dash_inner_wrap">
                                    <div className="col-lg-12">
                                        <div className="createpost bg-white rounded-3  addPost_left_container">
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
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            )}
        </React.Fragment>

    )
}

export default ManageAdmins
