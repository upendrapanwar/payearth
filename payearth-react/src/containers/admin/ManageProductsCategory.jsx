import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import ReactQuill from 'react-quill';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Link } from "react-router-dom";
import arrow_back from '../../assets/icons/arrow-back.svg';
import AddProductSubCategory from './AddProductSubCategory';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer'

const ManageProductsCategory = () => {
    // Global variables
    const authInfo = JSON.parse(localStorage.getItem("authInfo"));

    //states
    const [loading, setLoading] = useState(false);
    const [description, setDescription] = useState('');
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showSubCategory, setShowSubCategory] = useState(false);
    const [selectedCateData, setSelectedCateData] = useState(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [indiCate, setIndiCate] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editCateData, setEditCateData] = useState([]);
    const [permission, setPermission] = useState({});



    //functions
    useEffect(() => {
        getProductCatePermission();
        getAllCateData();
    }, []);


    const getProductCatePermission = async () => {
        const admin_Id = authInfo.id;
        try {
            const res = await axios.get(`admin/getProductcatePermission/${admin_Id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            })

            if (res.data.status === true && res.data.data) {
                console.log("res.data.data", res.data.data)

                const permissionss = res.data.data;
                setPermission(permissionss)
                console.log("permissionspermissions", permissionss)
            }

        } catch (error) {
            toast.error(error.response.data.message);
            console.error("Error fetching data: ", error);
        }
    }

    //handle categories for add categories
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        setLoading(true);
        try {
            const token = authInfo.token;
            const admin_id = authInfo.id;

            const productCateData = {
                ...values,
                parent_id: null,
                is_service: false,
                add_to_menu: true,
                admin_id: admin_id
            };

            const response = await axios.post("/admin/create-product-categories", productCateData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.data.status === true) {
                toast.success(response.data.message);
                getAllCateData();
                setIsModalOpen(false);
                resetForm();
                setDescription('');
            } else if (response.data.status === false) {
                toast.error(response.data.message);
                getAllCateData();
                setIsModalOpen(false);
                resetForm();
                setDescription('');
            }
        } catch (error) {
            console.error("Categories add failed.", error);
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    //get all categories and display in the list
    const getAllCateData = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/admin/get-product-categories", {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            });

            if (response.data.status === true) {
                setCategories(response.data.data);
                setLoading(false);
            } else if (response.data.status === false) {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.error("categories data fetch failed", error);
        }
    };

    const updateStatus = async (row, newStatus) => {
        try {
            const response = await axios.put(`/admin/update-category-status/${row._id}`, {
                isActive: newStatus
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            });

            if (response.data.status === true) {
                toast.success(response.data.message);
                getAllCateData();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Status update failed", error);
            toast.error("An error occurred while updating the status");
        }
    };

    const getIndivisualCate = async (id) => {
        setIsViewModalOpen(true)
        try {
            const response = await axios.get(`/admin/get-indivisual-categories/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            })
            if (response.data.status === true && response.data.data.length > 0) {
                setIndiCate(response.data.data[0])
            }
        } catch (error) {
            console.error("Data has not fatched.", error);
        }
    }

    //edit functionality
    const handleEdit = async (id, categoryName, description) => {
        setEditCateData({
            id: id,
            categoryName: categoryName,
            description: description,
            isActive: true
        });
        setIsEditModalOpen(true);
    };


    const handleUpdateSubmit = async (values) => {
        try {
            const admin_id = authInfo.id;
            const updatedData = {
                ...values,
                isActive: editCateData.isActive,
                admin_id: admin_id,
            };

            const response = await axios.put(`/admin/update-product-categories/${values.id}`, updatedData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            })

            if (response.data.status === true) {
                setIsEditModalOpen(false);
                getAllCateData();
            }

        } catch (error) {
            console.error('failed data update.', error);
        }
    }

    const handleAddSubCate = (row) => {
        setSelectedCateData({ id: row._id, categoryName: row.categoryName });
        setShowSubCategory(true);
    };

    //data table column 
    const columns = [
        {
            name: 'Category Name',
            selector: row => row.categoryName,
            sortable: true
        },
        {
            name: 'Status',
            selector: (row, i) => (
                <span className={`badge ${row.isActive ? 'bg-success' : 'bg-danger'}`}>
                    {row.isActive === true ? 'Active' : 'In-Active'}
                </span>
            ),
            sortable: true
        },
        {
            name: 'Created Date',
            selector: row => new Date(row.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            sortable: true
        },
        {
            name: 'Actions',
            cell: (row) => {
                return (
                    <>
                        <button
                            className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                            onClick={() => getIndivisualCate(row.id)}>
                            <i className="bi bi-eye"></i>
                        </button>


                        <button
                            className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                            onClick={() => handleEdit(row.id, row.categoryName, row.description)}
                            disabled={!permission.edit}
                        >
                            <i className="bi bi-pen"></i>
                        </button>

                        {row.isActive ? (
                            <button
                                className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new action_btn_textView"
                                onClick={() => updateStatus(row, false)}
                            >
                                In-Active
                            </button>
                        ) : (
                            <button
                                className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new action_btn_textView"
                                onClick={() => updateStatus(row, true)}
                            >
                                Active
                            </button>
                        )}

                        <button
                            className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new action_btn_textView"
                            onClick={() => handleAddSubCate(row)}
                        >
                            View Sub-Cat
                        </button>

                    </>
                )
            }
        }
    ];

    //data of table
    const tableData = {
        columns,
        data: categories
    };


    const toggleShowSubCategory = () => {
        setShowSubCategory(false);
    };


    return (
        <React.Fragment>
            {loading && <SpinnerLoader />}
            <div className="container">
                <Header />
                <Helmet>
                    <title>{"Product category - Pay Earth"}</title>
                </Helmet>
                <div className="row">
                    {showSubCategory ? (
                        <AddProductSubCategory cateData={selectedCateData} toggleShowSubCategory={toggleShowSubCategory} />
                    ) : (
                        <div className="col-lg-12">
                            <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
                                <div className="cp_top d-flex justify-content-between align-items-center">
                                    <div className="cumm_title">Products Category List</div>
                                    <div className="d-flex justify-content-end ml-auto gap-2">
                                        {/* <Link className="btn custom_btn btn_yellow ml-auto " to='#' disabled={!permission.add} onClick={() => setIsModalOpen(true)}>Add-Cate</Link> */}
                                        <Link
                                            className={`btn custom_btn mx-auto ${permission.add ? 'btn_yellow' : 'btn_disabled'}`}
                                            to={permission.add ? "#" : "#"}
                                            onClick={(e) => {
                                                if (!permission.add) {
                                                    e.preventDefault(); // Prevent navigation
                                                } else {
                                                    setIsModalOpen(true);
                                                }
                                            }}
                                        >
                                            Add-Cate
                                        </Link>
                                       
                                        <Link className="btn custom_btn btn_yellow mx-auto " to="/admin/dashboard"><img src={arrow_back} alt="linked-in" />&nbsp;Back</Link>
                                    </div>
                                </div>

                                <div className="cp_body">
                                    <div>
                                        <DataTableExtensions {...tableData}>
                                            <DataTable
                                                columns={columns}
                                                data={categories}
                                                noHeader
                                                defaultSortField="name"
                                                pagination
                                                highlightOnHover
                                            />
                                        </DataTableExtensions>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {isModalOpen && (
                        <div className="modal fade show " style={{ display: 'block' }} tabIndex="-1" aria-modal="true">
                            <div className="modal-dialog  modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Add New Category</h5>
                                        <button type="button" className="btn-close" onClick={() => setIsModalOpen(false)} aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <Formik
                                            initialValues={{
                                                name: '',
                                                description: '',
                                            }}
                                            validationSchema={Yup.object({
                                                name: Yup.string().required('Category name is required'),
                                            })}
                                            onSubmit={handleSubmit}
                                        >
                                            {({ isSubmitting, errors, touched, setFieldValue }) => (
                                                <Form>
                                                    <div className="mb-3">
                                                        <label htmlFor="name" className="form-label">Category Name</label>
                                                        <Field
                                                            className="form-control"
                                                            type="text"
                                                            name="name"
                                                        />
                                                        {touched.name && errors.name && (
                                                            <small className="text-danger">{errors.name}</small>
                                                        )}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label htmlFor="description" className="form-label">Description</label>
                                                        <ReactQuill
                                                            name="description"
                                                            value={description}
                                                            onChange={(value) => {
                                                                setDescription(value);
                                                                setFieldValue('description', value);
                                                            }}
                                                            modules={{
                                                                toolbar: [
                                                                    [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                                                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                                    ['bold', 'italic', 'underline', 'strike'],
                                                                ]
                                                            }}
                                                        />
                                                    </div>

                                                    <button
                                                        type="submit"
                                                        className="btn custom_btn btn_yellow"
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? 'Adding...' : 'Add Cate'}
                                                    </button>
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    {isEditModalOpen && editCateData && (
                        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-modal="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Edit Category</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => {
                                                setIsEditModalOpen(false);
                                                setEditCateData([]);
                                            }}
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <Formik
                                            initialValues={{
                                                id: editCateData.id,
                                                name: editCateData.categoryName,
                                                description: editCateData.description,
                                            }}
                                            validationSchema={Yup.object({
                                                name: Yup.string().required('Category name is required'),
                                            })}
                                            onSubmit={(values, { setSubmitting }) => {
                                                handleUpdateSubmit(values, setSubmitting);
                                            }}
                                        >
                                            {({ isSubmitting, errors, touched, setFieldValue }) => (
                                                <Form>
                                                    <div className="mb-3">
                                                        <label htmlFor="name" className="form-label">Category Name</label>
                                                        <Field
                                                            className="form-control"
                                                            type="text"
                                                            name="name"
                                                        />
                                                        {touched.name && errors.name && (
                                                            <small className="text-danger">{errors.name}</small>
                                                        )}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label htmlFor="description" className="form-label">Description</label>
                                                        <Field name="description">
                                                            {({ field, form }) => (
                                                                <ReactQuill
                                                                    value={field.value}
                                                                    onChange={(value) => form.setFieldValue('description', value)}
                                                                    modules={{
                                                                        toolbar: [
                                                                            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                                            ['bold', 'italic', 'underline', 'strike'],
                                                                        ],
                                                                    }}
                                                                />
                                                            )}
                                                        </Field>
                                                    </div>


                                                    <button
                                                        type="submit"
                                                        className="btn custom_btn btn_yellow"
                                                        disabled={isSubmitting}
                                                    >
                                                        {isSubmitting ? 'Updating...' : 'save'}
                                                    </button>
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}


                    {/* New modal for viewing category details */}
                    {isViewModalOpen && (
                        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-modal="true">
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title">Category Details</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => { setIsViewModalOpen(false); setIndiCate([]); }}
                                            aria-label="Close"
                                        ></button>
                                    </div>
                                    <div className="modal-body">
                                        <p><strong>Category Name:</strong> {indiCate?.categoryName}</p>
                                        <p><strong>Description:</strong> {indiCate?.description || ''}</p>
                                        <p>
                                            <strong>Status:</strong>
                                            <span className={`badge ${indiCate?.isActive ? 'bg-success' : 'bg-danger'}`}>
                                                {indiCate?.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </p>
                                        <p><strong>Creator Name:</strong> {indiCate?.createdBy?.name || ''}</p>
                                        <p><strong>Created Date:</strong> {new Date(indiCate?.createdAt).toLocaleDateString()}</p>
                                        <p><strong>Last Updated:</strong> {new Date(indiCate?.updatedAt).toLocaleDateString()}</p>  </div>
                                    <div className="modal-footer">
                                        <button
                                            type="button"
                                            className="btn custom_btn btn_yellow"
                                            onClick={() => { setIsViewModalOpen(false); setIndiCate([]); }}
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <Footer />
                </div>
            </div>
        </React.Fragment>
    );
};

export default ManageProductsCategory;