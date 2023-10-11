import React, { Component } from 'react';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import store from '../../store/index';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import NotFound from '../../components/common/NotFound';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';

class AdminCategoryModel extends Component {
    constructor(props) {
        super(props);
        this.authInfo = store.getState().auth.authInfo;
        this.state = {
            names: '',
            slug: '',
            description: '',
            cateData: null,
            selectedRows: [],
            loading: true,
            error: null,
        }
    }

    componentDidMount() {
        this.getCategory();
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

    handleDeleteSeletedData = () => {
        const { selectedRows } = this.state;
        // console.log("selected data", selectedRows)
        for (let i = 0; i < selectedRows.length; i++) {
            const ids = selectedRows[i].id
            axios.delete(`/admin/categoryDelete/${ids}`, {
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            }).then((res) => { console.log('Row Data', res.data) })
                .catch((error) => {
                    console.log("error", error)
                })
            this.setState({ loading: true })
        }
        this.getCategory();
    }

    handleTitleChange = (e) => {
        this.setState({ names: e.target.value });
    };

    handleSlugChange = (e) => {
        this.setState({ slug: e.target.value });
    };

    handleDescriptionChange = (description) => {
        this.setState({ description });
    };

    handleSubmit = () => {
        toast.success("Category Add Succesfully", { autoClose: 3000 })
        const { names, slug, description } = this.state;
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
                console.log("POST SUCCESS", response.data);
            })
            .catch((error) => {
                console.error('Error saving post:', error);
            });

        this.setState({ names: "", slug: "", description: "" })

        this.getCategory();
    }

    category_column = [
        {
            name: 'Name',
            selector: (row, i) => row.names,
            sortable: true,
        },
        {
            name: "Slug",
            selector: (row, i) => row.slug,
            sortable: true
        },
        // {
        //     name: ' Date & Time',
        //     selector: (row, i) => row.updatedAt,
        //     sortable: true,
        //     cell: row => {
        //         const date = new Date(row.updatedAt).toLocaleString();
        //         return <div>{date}</div>;
        //     },
        // },
        {
            name: 'Actions',
            cell: (row) => (
                <>
                    <button
                        onClick={() => this.handleEdit(row.id)}
                        className="custom_btn btn_yellow_bordered w-auto btn"
                    >
                        Edit
                    </button>

                    <button
                        // onClick={() => this.handleStatusTrash(row._id)}
                        className="custom_btn btn_yellow_bordered w-auto btn"
                        onClick={this.handleDeleteSeletedData}
                    >
                        Delete
                    </button>
                </>
            ),
        },
    ]

    handleEdit = (id) => {
        this.props.history.push(`/admin/category-module-edit/${id}`)
    }

    render() {
        const { cateData, loading, error, selectedRows } = this.state;
        // console.log("cateData :", cateData)
        if (loading) {
            return <SpinnerLoader />
        }
        if (error) {
            return <div>Error: {error}</div>;
        }

        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <Header />
                <div className="container">
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
                                            <label htmlFor="">Name</label>
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
                                            <label htmlFor="">Slug</label>
                                            <div className="field_item">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="slug"
                                                    id=""
                                                    value={this.state.slug}
                                                    onChange={this.handleSlugChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="crt_bnr_fieldRow">
                                        <div className="crt_bnr_field">
                                            <label>Description</label>
                                            <div className="field_item">
                                                <ReactQuill
                                                    //style={{ height: '250px' }}
                                                    type="text"
                                                    name="description"
                                                    value={this.state.description}
                                                    onChange={this.handleDescriptionChange}
                                                    modules={{
                                                        toolbar: [
                                                            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                            ['bold', 'italic', 'underline'],
                                                            // ['link', 'image'],
                                                            // ['clean']
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
                                    <div className="cumm_title">Category List</div>
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

export default AdminCategoryModel;