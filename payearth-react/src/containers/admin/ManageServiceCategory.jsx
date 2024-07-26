import React, { Component } from 'react';
import axios from 'axios';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import { Helmet } from 'react-helmet';

class ManageServiceCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            ServiceCategoryList: [],
            selectedRows: [],
            currentCategory: null,
        };

        // Define columns
        this.category_column = [
            {
                name: 'Creater Name',
                selector: row => row.createdBy ? row.createdBy.name : 'N/A',
                sortable: true
            },
            {
                name: 'Category Name',
                selector: row => row.categoryName,
                sortable: true
            },
            {
                name: 'Created Date',
                selector: row => new Date(row.createdAt).toLocaleDateString(),
                sortable: true
            },
            {
                name: 'Status',
                selector: row => (
                    <span className={`badge ${row.isActive ? 'bg-success' : 'bg-danger'}`}>
                        {row.isActive === true ? 'Active' : 'In-Active'}
                    </span>
                ),
                sortable: true
            },
            {
                name: "Action",
                cell: row => {
                    return (
                        <>
                            <button
                                className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                                data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo"
                                onClick={() => this.handleEdit(row)}
                            >
                                Edit
                            </button>
                            {row.isActive ? (
                                <button
                                    className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                                    onClick={() => this.handleChangeStatus(row, false)}
                                >
                                    In-Active
                                </button>
                            ) : (
                                <button
                                    className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                                    onClick={() => this.handleChangeStatus(row, true)}
                                >
                                    Active
                                </button>
                            )}
                            <button
                                className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                                onClick={() => this.handleDelete(row)}
                            >
                                Delete
                            </button>
                        </>
                    );
                },
            }

        ];
    }

    componentDidMount() {
        this.fetchServiceCategoryList();
    }

    fetchServiceCategoryList = async () => {
        this.setState({ loading: true });
        try {
            const serviceCatListUrl = "/admin/service-categories-list";
            const authInfo = JSON.parse(localStorage.getItem("authInfo"));
            const token = authInfo ? authInfo.token : "";

            const response = await axios.get(serviceCatListUrl, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${token}`
                }
            });
            this.setState({ ServiceCategoryList: response.data.data, loading: false });
        } catch (error) {
            console.error("There was an error fetching service list category data", error);
            this.setState({ loading: false });
        }
    };

    saveServiceCategories = async (values, { setSubmitting, resetForm }) => {
        try {
            const addCategoryUrl = "/admin/categories";
            const authInfo = JSON.parse(localStorage.getItem("authInfo"));
            const token = authInfo ? authInfo.token : "";
            const admin_id = authInfo ? authInfo.id : "";

            const categoryData = {
                ...values,
                parent_id: null,
                is_service: true,
                add_to_menu: true,
                admin_id: admin_id
            };

            await axios.post(addCategoryUrl, categoryData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${token}`
                }
            });

            // Re-fetch the list to include the new category
            this.fetchServiceCategoryList();
            resetForm();
        } catch (error) {
            console.error("There was an error saving the service category", error);
        } finally {
            setSubmitting(false);
        }
    }

    handleRowSelected = (state) => {
        this.setState({ selectedRows: state.selectedRows });
    };


    handleEdit = (row) => {
        // Implement edit logic here
        console.log('Edit:', row);
    }

    updateServiceCategory = async (values, { setSubmitting }) => {
        try {
            const updateCategoryUrl = `/admin/categories/${values.id}`;
            const authInfo = JSON.parse(localStorage.getItem('authInfo'));
            const token = authInfo ? authInfo.token : '';

            await axios.put(updateCategoryUrl, values, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${token}`
                }
            });

            // Re-fetch the list to include the updated category
            this.fetchServiceCategoryList();
            this.setState({ currentCategory: null });
        } catch (error) {
            console.error('There was an error updating the service category', error);
        } finally {
            setSubmitting(false);
        }
    };


    handleDelete = async (row) => {
        try {
            const deleteCategoryUrl = `/admin/categories/${row.id}`;
            const authInfo = JSON.parse(localStorage.getItem("authInfo"));
            const token = authInfo ? authInfo.token : "";

            await axios.delete(deleteCategoryUrl, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${token}`
                }
            });

            // Re-fetch the list to reflect changes
            this.fetchServiceCategoryList();
        } catch (error) {
            console.error("There was an error deleting the service category", error);
        }
    }

    //On working
    handleChangeStatus = async (row, isActive) => {
        console.log("Check isActiveisActive value", isActive)
        try {
            const updateStatusUrl = `/admin/categories/status/${row.id}`;
            const authInfo = JSON.parse(localStorage.getItem("authInfo"));
            const token = authInfo ? authInfo.token : "";

            await axios.put(updateStatusUrl, { isActive }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${token}`
                }
            });

            // Re-fetch the list to reflect changes
            this.fetchServiceCategoryList();
        } catch (error) {
            console.error("There was an error changing the status", error);
        }
    }

    render() {
        const { loading, ServiceCategoryList, selectedRows, currentCategory } = this.state;

        const initialValues = {
            name: '',
        };

        // Yup validation for Formik form
        const validationSchema = Yup.object({
            name: Yup.string()
                .required('Category Name is required')
        });

        return (
            <React.Fragment>
                <div class="seller_dash_wrap pb-5">
                    <div className="container">
                        <Helmet>
                            <title>{"Category - Pay Earth"}</title>
                        </Helmet>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="createpost bg-white rounded-3 addPost_left_container">
                                    <div className="cp_top">
                                        <div className="cumm_title">
                                            ADD NEW SERVICE CATEGORY
                                        </div>
                                    </div>
                                    <div className="cp_body">
                                        <Formik
                                            initialValues={initialValues}
                                            validationSchema={validationSchema}
                                            onSubmit={this.saveServiceCategories}
                                        >
                                            {({ isSubmitting }) => (
                                                <Form>
                                                    <div className="crt_bnr_fieldRow">
                                                        <div className="crt_bnr_field">
                                                            <label htmlFor="categoryName">Category Name</label>
                                                            <div className="field_item">
                                                                <Field
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="name"
                                                                />
                                                                <ErrorMessage name="name" component="div" className="text-danger" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="filter_btn_box text-center">
                                                        <button
                                                            className='btn custom_btn btn_yellow_bordered'
                                                            type="submit"
                                                            disabled={isSubmitting}
                                                        >
                                                            {isSubmitting ? "Adding..." : "Add"}
                                                        </button>
                                                    </div>
                                                </Form>
                                            )}
                                        </Formik>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row mt-4">
                            <div className="col-12">
                                <div className="createpost bg-white rounded-3 addPost_left_container">
                                    <div className="cp_top">
                                        <div className="cumm_title">Service Category List</div>
                                    </div>
                                    <div className="cp_body">
                                        {loading && <SpinnerLoader />}
                                        <DataTableExtensions
                                            columns={this.category_column}
                                            data={ServiceCategoryList}
                                        >
                                            <DataTable
                                                pagination
                                                noHeader
                                                highlightOnHover
                                                defaultSortField="id"
                                                defaultSortAsc={false}
                                                selectableRows
                                                selectedRows={selectedRows}
                                                onSelectedRowsChange={this.handleRowSelected}
                                            />
                                        </DataTableExtensions>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal */}
                <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Edit Service Category</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                {currentCategory && (
                                    <Formik
                                        initialValues={currentCategory}
                                        validationSchema={validationSchema}
                                        onSubmit={this.updateServiceCategory}
                                    >
                                        {({ isSubmitting }) => (
                                            <Form>
                                                <div className='mb-3'>
                                                    <label htmlFor='editCategoryName' className='col-form-label'>
                                                        Category Name
                                                    </label>
                                                    <Field
                                                        className='form-control'
                                                        type='text'
                                                        name='editCategoryName'
                                                    />
                                                    <ErrorMessage name='editCategoryName' component='div' className='text-danger' />
                                                </div>
                                                <div className='modal-footer'>
                                                    <button type='button' className='custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new' data-bs-dismiss='modal'>
                                                        Close
                                                    </button>
                                                    <button type='submit' className='custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new' disabled={isSubmitting}>
                                                        {isSubmitting ? 'Updating...' : 'Update'}
                                                    </button>
                                                </div>
                                            </Form>
                                        )}
                                    </Formik>
                                )}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new">Update</button>
                            </div>
                        </div>

                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ManageServiceCategory;
