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


const AddProductSubCategory = (props) => {

    // Global variables
    const authInfo = JSON.parse(localStorage.getItem("authInfo"));
    const parent_Id = props.cateData.id;

    //states
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [defaultCateName, setDefaultCateName] = useState({ categoryName: props.cateData.categoryName, CateId: props.cateData.id });
    const [description, setDescription] = useState('');
    const [subCategories, setSubCategories] = useState([]);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [indiCate, setIndiCate] = useState([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editCateData, setEditCateData] = useState([]);
    const [activeCategory, setActiveCategory] = useState('publish');
    const [trashSubCategories, setTrashSubCategories] = useState([]);
    const [permission, setPermission] = useState({});


    //functions
    useEffect(() => {
        getProductCatePermission();
        if (activeCategory === 'trash') {
            getTrashSubCate();
        };

        getSubCatedata();
    }, [activeCategory])


    const getProductCatePermission = async () => {
        const admin_Id = authInfo.id;
        try {
            const res = await axios.get(`admin/getProductSubCatePermission/${admin_Id}`, {
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

    //get sub-cate data
    const getSubCatedata = async () => {
        try {
            const response = await axios.get(`/admin/get-product-sub-categories/${parent_Id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            })

            if (response.data.status === true) {
                setSubCategories(response.data.data)
            }

        } catch (error) {
            console.error("Sub-category data has not fetch", error);
        }
    }

    //get trash sub-cate data
    const getTrashSubCate = async () => {
        try {
            const response = await axios.get(`/admin/get-trash-sub-categories/${parent_Id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            })

            if (response.data.status === true) {
                setTrashSubCategories(response.data.data);
            }

        } catch (error) {
            console.error("Sub-category data has not fetch", error);
        }
    }

    //add sub-cate
    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        try {
            const updatedValues = {
                name: values.subCategoryName,
                parent_id: values.categoryId,
                description: values.description,
                isService: false,
                add_to_menu: true,
                admin_id: authInfo.id,
            }

            const response = await axios.post("/admin/add-product-sub-categories", updatedValues, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            });

            if (response.data.status === true) {
                toast.success(response.data.message);
                getSubCatedata();
                setIsModalOpen(false);
                resetForm();
                setDescription('');
            } else if (response.data.status === false) {
                toast.error(response.data.message);
                getSubCatedata();
                setIsModalOpen(false);
                resetForm();
                setDescription('');
            }
        } catch (error) {
            console.error("Sub-category has not saved", error);
        }
    }

    //update sub-cate status
    const updateStatus = async (row, newStatus) => {
        try {
            const response = await axios.put(`/admin/update-subcategory-status/${row._id}`, {
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
                getSubCatedata();
                getTrashSubCate();
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Status update failed", error);
            toast.error("An error occurred while updating the status");
        }

    }

    const getIndivisualSubCate = async (id) => {
        setIsViewModalOpen(true)
        try {
            const response = await axios.get(`/admin/get-indivisual-sub-categories/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            })
            if (response.data.status === true && response.data.data.length > 0) {
                setIndiCate(response.data.data[0]);
                getSubCatedata();
            }
        } catch (error) {
            console.error("Data has not fatched.", error);
        }
    }

    const handleEdit = (id, categoryName, description) => {
        setEditCateData({
            id: id,
            categoryName: props.cateData.categoryName,
            subCategoryName: categoryName,
            description: description,
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateSubmit = async (values) => {
        const updatedData = {
            name: values.subCategoryName,
            description: values.description,
            admin_id: authInfo.id,
        }

        const response = await axios.put(`/admin/update-product-sub-categories/${values.id}`, updatedData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${authInfo.token}`
            }
        })

        if (response.data.status === true) {
            setIsEditModalOpen(false);
            getSubCatedata();
        }

    }

    const handleCategoryChange = (category) => {
        setActiveCategory(category);
    };


    const columns = [
        {
            name: 'Sub-cate Name',
            selector: row => row.categoryName,
            sortable: true
        },
        {
            name: 'Status',
            selector: (row) => (
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
            cell: (row) => (
                <>
                    <button
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                        onClick={() => getIndivisualSubCate(row.id)}>
                        View
                    </button>


                    <button
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                        onClick={() => handleEdit(row.id, row.categoryName, row.description)}
                        disabled={!permission?.edit}
                    >
                        Edit
                    </button>


                    <button
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                        onClick={() => updateStatus(row, false)}
                    >
                        Trash
                    </button>
                </>
            )
        }
    ];

    //data of table
    const tableData = { columns, data: subCategories };

    const columnsTrash = [
        { name: 'Category Name', selector: row => row.categoryName, sortable: true },

        {
            name: 'Status',
            selector: (row) => (
                <span className={`badge ${row.isActive ? 'bg-success' : 'bg-danger'}`}>
                    {row.isActive === true ? 'Active' : 'In-Active'}
                </span>
            ),
            sortable: true
        },

        {
            name: 'Created Date', selector: row => new Date(row.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            sortable: true
        },

        {
            name: 'Actions',
            cell: (row) => (
                <>
                    <button
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                        onClick={() => getIndivisualSubCate(row.id)}>
                        View
                    </button>

                    <button
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                        onClick={() => updateStatus(row, true)}
                    >
                        Remove Trash
                    </button>
                </>
            )
        }
    ];

    const tableDataTrash = { columns: columnsTrash, data: trashSubCategories };
    const handleClick = (e) => {
        e.preventDefault();
        props.toggleShowSubCategory();
    };

    return (
        <React.Fragment>
            {loading && <SpinnerLoader />}
            <div className="container">
                <Helmet>
                    <title>{"Add Sub-Category - Pay Earth"}</title>
                </Helmet>
                <div className="row">
                    <div className="col-lg-12">
                        <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
                            <div className="cp_top d-flex justify-content-between align-items-center">
                                <div className="cumm_title">Sub-Category List</div>
                                <div className="cumm_title">{props.cateData.categoryName}</div>
                                <div className="d-flex justify-content-end ml-auto gap-2">
                                    {/* <Link className="btn custom_btn btn_yellow ml-auto action_btn_textView" to='#' onClick={() => setIsModalOpen(true)}>Add-SubCate</Link> */}
                                    <Link
                                        className={`btn custom_btn mx-auto ${permission?.add ? 'btn_yellow ml-auto action_btn_textView' : 'btn_disabled ml-auto action_btn_textView'}`}
                                        to="#"
                                        onClick={(e) => {
                                            if (!permission?.add) {
                                                e.preventDefault();
                                            } else {
                                                setIsModalOpen(true);
                                            }
                                        }}
                                    >
                                        Add-SubCate
                                    </Link>

                                    <Link className="btn custom_btn btn_yellow mx-auto action_btn_textView" onClick={handleClick} to=""><img src={arrow_back} alt="linked-in" />&nbsp;Back</Link>
                                </div>
                            </div>

                            {/* Filter Navigation (ul and li elements) */}
                            <div className="report_tabing_nav">
                                <div className="report_tab_link">
                                    <ul>
                                        <li className={activeCategory === 'publish' ? 'activeNav' : ''}>
                                            <Link to="#" onClick={() => handleCategoryChange('publish')}>
                                                Publish
                                            </Link>
                                        </li>
                                        <li className={activeCategory === 'trash' ? 'activeNav' : ''}>
                                            <Link to="#" onClick={() => handleCategoryChange('trash')}>
                                                Trash
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div>
                                {activeCategory === 'publish' && (
                                    <div className="cp_body">
                                        <div>
                                            <DataTableExtensions {...tableData}>
                                                <DataTable
                                                    columns={columns}
                                                    data={subCategories}
                                                    noHeader
                                                    defaultSortField="name"
                                                    pagination
                                                    highlightOnHover
                                                />
                                            </DataTableExtensions>
                                        </div>
                                    </div>
                                )}
                                {activeCategory === 'trash' && (
                                    <div className="cp_body">
                                        <div>

                                            <DataTableExtensions {...tableDataTrash}>
                                                <DataTable
                                                    columns={columnsTrash}
                                                    data={trashSubCategories}
                                                    noHeader
                                                    defaultSortField="name"
                                                    pagination
                                                    highlightOnHover
                                                />
                                            </DataTableExtensions>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>


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
                                                categoryName: defaultCateName.categoryName,
                                                categoryId: defaultCateName.CateId,
                                                subCategoryName: '',
                                                description: '',
                                            }}
                                            validationSchema={Yup.object({
                                                categoryName: Yup.string().required('Category name is required'),
                                                subCategoryName: Yup.string().required('Sub-category name is required'),
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
                                                            name="categoryName"
                                                            value={defaultCateName.categoryName}
                                                            readOnly
                                                        />
                                                        {touched.categoryName && errors.categoryName && (
                                                            <small className="text-danger">{errors.categoryName}</small>
                                                        )}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label htmlFor="name" className="form-label">Sub-Category Name</label>
                                                        <Field
                                                            className="form-control"
                                                            type="text"
                                                            name="subCategoryName"
                                                        />
                                                        {touched.subCategoryName && errors.subCategoryName && (
                                                            <small className="text-danger">{errors.subCategoryName}</small>
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
                                                        className='btn custom_btn btn_yellow_bordered'
                                                        type="submit"
                                                    >
                                                        Add
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
                                                categoryName: editCateData.categoryName,
                                                subCategoryName: editCateData.subCategoryName,
                                                description: editCateData.description,
                                            }}
                                            validationSchema={Yup.object({
                                                categoryName: Yup.string().required('Category name is required'),
                                                subCategoryName: Yup.string().required('Sub-category name is required'),
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
                                                            name="categoryName"
                                                            readOnly
                                                        />
                                                        {touched.name && errors.name && (
                                                            <small className="text-danger">{errors.name}</small>
                                                        )}
                                                    </div>

                                                    <div className="mb-3">
                                                        <label htmlFor="name" className="form-label">Sub-Category Name</label>
                                                        <Field
                                                            className="form-control"
                                                            type="text"
                                                            name="subCategoryName"
                                                        />
                                                        {touched.subCategoryName && errors.subCategoryName && (
                                                            <small className="text-danger">{errors.subCategoryName}</small>
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
                                        <p><strong>Subcategory Name:</strong> {indiCate?.categoryName}</p>
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

                </div>
            </div>
        </React.Fragment >
    )
}

export default AddProductSubCategory