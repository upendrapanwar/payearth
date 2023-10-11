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

class AdminCategoryModelEdit extends Component {
    constructor(props) {
        super(props);
        this.authInfo = store.getState().auth.authInfo;
        this.state = {
            names: '',
            slug: '',
            description: '',
            cateData: [],
            loading: true,
            error: null,
        }
    }

    componentDidMount() {
        this.getCategory();
        this.getCategoryById();
    }

    handleTitleChange = (e) => {
        this.setState({ names: e.target.value });
    }

    handleSlugChange = (e) => {
        this.setState({ slug: e.target.value });
    }

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
        {
            name: 'Last Update',
            selector: (row, i) => row.updatedAt,
            sortable: true,
            cell: row => {
                const date = new Date(row.updatedAt).toLocaleString();
                return <div>{date}</div>;
            },
        },
        // {
        //     name: 'Actions',
        //     cell: (row) => (
        //         <>
        //             <button
        //                 // onClick={() => this.handleStatusTrash(row._id)}
        //                 className="custom_btn btn_yellow_bordered w-auto btn"
        //             >
        //                 Delete
        //             </button>
        //         </>
        //     ),
        // },
    ]

    getCategoryById = () => {
        const { id } = this.props.match.params;
        axios.get(`/admin/cmsGetCategoryById/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            // console.log("RESPONSE>DATA : ", response.data.data)
            let result = response.data.data
            for (var i = 0; i < result.length; i++) {
                // console.log(result.length)
                this.setState({
                    names: result[i].names,
                    slug: result[i].slug,
                    description: result[i].description,
                })
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
        this.getCategory();
    }

    updateCategory = (e) => {
        e.preventDefault();
        const { id } = this.props.match.params;
        const { names, slug, description } = this.state;

        const url = `/admin/cmsUpdateCategory/${id}`;
        const categoryData = {
            names,
            slug,
            description,
        };
        axios.put(url, categoryData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        })
            .then((response) => {
                console.log("UPDATE SUCCESS", response.data);
            })
            .catch((error) => {
                console.error('Error saving post:', error);
            });
        this.getCategory();
        this.props.history.push('/admin/category-module');
    };

    render() {
        const { cateData, loading, error } = this.state;
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
                    <form onSubmit={this.updateCategory}>
                        <div className="row">
                            <div className="col-lg-5">
                                <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
                                    <div className="cp_top">
                                        <div className="cumm_title">
                                            EDIT CATEGORY
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
                                                                ['link', 'image'],
                                                                ['clean']
                                                            ]
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="filter_btn_box">
                                            <button
                                                className='btn custom_btn btn_yellow_bordered'
                                                type='submit'
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-7">
                                <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
                                    <div className="cp_top addPost_button_singleRow">
                                        <div className="cumm_title">Category List</div>
                                        <div className="search_customer_field">
                                            <div className="noti_wrap">
                                                <div className="">
                                                    <span>
                                                        <Link className="btn custom_btn btn_yellow mx-auto" to="/admin/category-module"> Create New Category</Link>
                                                    </span>
                                                </div>
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

                                            // selectedRows={selectedRows}
                                            // onSelectedRowsChange={this.handleRowSelected}
                                            />
                                        </DataTableExtensions>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
                <Footer />
            </React.Fragment>
        );
    }
}

export default AdminCategoryModelEdit;