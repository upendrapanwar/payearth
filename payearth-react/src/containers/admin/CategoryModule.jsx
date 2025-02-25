import React, { Component } from 'react';
import store from '../../store/index';
import { withRouter, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import NotFound from '../../components/common/NotFound';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import arrow_back from '../../assets/icons/arrow-back.svg';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import { Helmet } from 'react-helmet';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';

class AdminCategoryModel extends Component {
    constructor(props) {
        super(props);
        this.authInfo = store.getState().auth.authInfo;
        this.authInfoLocal = JSON.parse(localStorage.getItem("authInfo"))
        this.state = {
            names: '',
            slug: '',
            description: '',
            cateData: null,
            selectedRows: [],
            loading: true,
            error: null,
            permissions: {
                add: false,
                edit: false,
                delete: false
            },
        }
    }

    componentDidMount() {
        this.getBlogCatePermission();
        this.getCategory();
    }

    getBlogCatePermission = async () => {
        const admin_Id = this.authInfoLocal.id;
        try {
            const res = await axios.get(`admin/getBlogCatePermission/${admin_Id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfoLocal.token}`
                }
            })

            if (res.data.status === true && res.data.data) {
                this.setState({ permissions: res.data.data });
                console.log("permissions", this.state.permissions);

            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.error("Error fetching data: ", error);
        }
    }

    generateUniqueSlug = (names) => {
        return names
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    getCategory = () => {
        axios.get('/admin/getCmsAllCategory', {
            headers: {
                'Authorization': `Bearer ${this.authInfo.token}`
            },
        })
            .then(res => {
                this.setState({
                    cateData: res.data.data,
                    loading: false,
                    error: null
                })
            })
            .catch(error => {
                this.setState({
                    cateData: [],
                    loading: false,
                    error: error
                })
            })
    }

    handleRowSelected = (state) => {
        this.setState({ selectedRows: state.selectedRows });
    };

    handleDeleteSeletedData = (id) => {
        const { selectedRows } = this.state;
        if (selectedRows == false) {
            axios.delete(`/admin/categoryDelete/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            }).then((res) => {
                this.getCategory();
                console.log(res.data)
            })
                .catch((error) => {
                    console.log("error", error)
                })

        } else {
            for (let i = 0; i < selectedRows.length; i++) {
                const ids = selectedRows[i].id
                axios.delete(`/admin/categoryDelete/${ids}`, {
                    headers: {
                        'Authorization': `Bearer ${this.authInfo.token}`
                    }
                }).then((res) => {
                    this.getCategory();
                    console.log('Row Data', res.data)
                })
                    .catch((error) => {
                        console.log("error", error)
                    })
            }
            this.setState({ selectedRows: "" })
        }
    }

    handleTitleChange = (e) => {
        this.setState({ names: e.target.value });
    };

    handleDescriptionChange = (description) => {
        this.setState({ description });
    };

    handleSubmit = () => {
        toast.success("Category Add Succesfully", { autoClose: 3000 })
        const { names, description } = this.state;
        const slug = this.generateUniqueSlug(names);
        const url = 'admin/cmsCategory';
        const categoryData = {
            names,
            slug,
            description,
        }
        axios.post(url, categoryData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        })
            .then((response) => {
                this.getCategory();
                console.log("Add Succesfully", response.data);
            })
            .catch((error) => {
                console.error('Error in saving category:', error);
            });

        this.setState({ names: "", description: "" })
    }

    category_column = [
        {
            name: 'Name',
            selector: (row, i) => row.names,
            sortable: true,
        },
        {
            name: ' Date & Time',
            selector: (row, i) => row.updatedAt,
            sortable: true,
            cell: row => {
                const options = { year: 'numeric', month: 'long', day: 'numeric' };
                const date = new Date(row.updatedAt).toLocaleDateString('en-US', options);
                return <div>{date}</div>;
            },
        },
        {
            name: 'Actions',
            cell: (row) => (
                <>
                    <button
                        onClick={() => this.handleEdit(row.id)}
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width"
                        disabled={!this.state.permissions.edit}
                    >
                        Edit
                    </button>

                    <button

                        className="custom_btn btn_yellow_bordered w-auto btn btn-width"
                        onClick={() => this.handleDeleteSeletedData(row._id)}
                        disabled={!this.state.permissions.delete}
                    >
                        Delete
                    </button>
                </>
            ),
        },
    ]

    handleEdit = (id) => {
        this.props.history.push(`/admin/edit-blog-category/${id}`)
    }

    render() {
        const { cateData, loading, error, selectedRows } = this.state;
        if (loading) {
            return <SpinnerLoader />
        }
        if (error) {
            return <div>Error: {error}</div>;
        }

        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <div className="container">
                    <Header />
                    <Helmet>
                        <title>{"Admin - Manage Blog Categories - Pay Earth"}</title>
                    </Helmet>
                    <div className="inr_top_page_title">
                        <h2>Manage Blog Categories</h2>
                    </div>
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
                                <div className="cp_top">
                                    <div className="cumm_title">
                                        ADD NEW CATEGORY
                                    </div>
                                </div>
                                <div className="cp_body">
                                    <div className="crt_bnr_fieldRow">
                                        <div className="crt_bnr_field">
                                            <label htmlFor="">Category Name</label>
                                            <div className="field_item">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="name"
                                                    id=""
                                                    value={this.state.names}
                                                    onChange={this.handleTitleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="crt_bnr_fieldRow">
                                        <div className="crt_bnr_field">
                                            <label>Description</label>
                                            <div className="field_item">
                                                <ReactQuill
                                                    type="text"
                                                    name="description"
                                                    value={this.state.description}
                                                    onChange={this.handleDescriptionChange}
                                                    modules={{
                                                        toolbar: [
                                                            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                            ['bold', 'italic', 'underline', 'strike'],
                                                        ]
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="filter_btn_box">
                                        <button
                                            className='btn custom_btn btn_yellow_bordered'
                                            onClick={this.handleSubmit}
                                            disabled={!this.state.permissions.add}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
                                <div className="cp_top">
                                    <div className="d-flex justify-content-between align-items-center gap-2">
                                        <div className="cumm_title">Category List</div>
                                        {/* <Link className="btn custom_btn btn_yellow ms-auto" to="/admin/dashboard">
                                            <img src={arrow_back} alt="linked-in" />&nbsp;Back
                                        </Link> */}
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
                                <div className="cp_body">
                                    <DataTableExtensions
                                        columns={this.category_column}
                                        data={cateData}
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
                <Footer />
            </React.Fragment>
        );
    }
}

export default withRouter(AdminCategoryModel);