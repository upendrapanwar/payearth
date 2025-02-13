import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import 'react-data-table-component-extensions/dist/index.css';
import { NotFound } from '../../components/common/NotFound';
import arrow_back from '../../assets/icons/arrow-back.svg';
import Switch from 'react-input-switch';
import { Helmet } from 'react-helmet';

const ManageVendors = () => {
    const authInfo = JSON.parse(localStorage.getItem('authInfo'));
    const [loading, setLoading] = useState(false);
    const [vendors, setVendors] = useState([]);
    const [tableData, setTableData] = useState({ columns: [], data: [] });
    const [permissions, setPermissions] = useState({ add: false, edit: false, delete: false, });

    useEffect(() => {
        getVendors();
        getVendorsPermission();
    }, []);

    const getVendors = async () => {
        setLoading(true);
        try {
            const res = await axios.get('admin/get-all-vendors', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`,
                },
            });

            if (res.data.status) {
                setVendors(res.data.data);

                // Prepare table data
                setTableData(prevState => ({
                    ...prevState,
                    data: res.data.data
                }));
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

    const getVendorsPermission = async () => {
        const admin_Id = authInfo.id;
        try {
            const res = await axios.get(`admin/getVendorsPermission/${admin_Id}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${authInfo.token}`,
                },
            });

            if (res.data.status && res.data.data) {
                setPermissions(res.data.data);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.error('Error fetching permissions:', error);
        }
    };

    const handleStatus = async (id, isActive) => {
        try {
            const status = !isActive;

            const res = await axios.put(`admin/update-vendors-status/${id}`, { isActive: status }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`,
                },
            });

            if (res.data.status === true) {
                setVendors((prevVendors) =>
                    prevVendors.map((vendor) =>
                        vendor.id === id ? { ...vendor, isActive: status } : vendor
                    )
                );
            }

        } catch (error) {
            console.error("Error updating status:", error);
            toast.error('Failed to update status');
        }
    }


    // Define columns separately
    const columns = [
        {
            name: 'Vendor Name',
            selector: row => row.name,
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
            name: 'Type',
            selector: row => row.seller_type,
            sortable: true,
        },
        {
            name: 'STATUS',
            cell: (row, i) => {
                return <>
                    <Switch
                        on={true}
                        off={false}
                        value={row.isActive}
                        onChange={() => handleStatus(row.id, row.isActive)}
                    />
                </>
            },
            sortable: true
        },
        {
            name: 'Actions',
            cell: row => (
                <div>
                    <Link className="btn custom_btn btn_yellow mx-auto ms-2" to={`/admin/vandor_register?vendorId=${row.id}`}>Edit</Link>
                    {/* <button className="btn custom_btn btn_yellow mx-auto ms-2">Delete</button> */}
                </div>
            ),
        },
    ];

    return (
        <React.Fragment>
            {loading && <SpinnerLoader />}
            <div className="seller_body">
                <Header />
                <div className="inr_top_page_title">
                    <h2>Manage Vendors</h2>
                </div>
                <Helmet>
                    <title>{"Manage Vendors - Pay Earth"}</title>
                </Helmet>
                <div className="seller_dash_wrap pt-2 pb-5">
                    <div className="container">
                        <div className="bg-white rounded-3 pt-3 pb-5">
                            <div className="dash_inner_wrap">
                                <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center">
                                    <div className="dash_title">Manage Vendors</div>
                                    <span className="d-flex justify-content-between align-items-center">
                                        <Link
                                            className= 'btn custom_btn btn_yellow'
                                            to= '/admin/vandor_register'
                                        >
                                            Add Vendors
                                        </Link>
                                        &nbsp;
                                        <Link className="btn custom_btn btn_yellow mx-auto" to="/admin/dashboard">
                                            <img src={arrow_back} alt="linked-in" />&nbsp;Back
                                        </Link>
                                    </span>
                                </div>
                            </div>
                            <div className="orders_table pt-0 pb-0 p-5">
                                {vendors.length > 0 ? (
                                    <DataTableExtensions {...{ columns, data: vendors }}>
                                        <DataTable
                                            columns={columns}
                                            data={vendors}
                                            pagination
                                            highlightOnHover
                                        />
                                    </DataTableExtensions>
                                ) : (
                                    <NotFound msg="Data not found." />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </React.Fragment>
    );
};

export default ManageVendors;
