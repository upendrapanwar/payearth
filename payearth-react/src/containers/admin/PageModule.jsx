import React, { Component } from 'react';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import store from '../../store/index';
import { setLoading } from '../../store/reducers/global-reducer';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import NotFound from '../../components/common/NotFound';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';



class AdminPageModule extends Component {
    constructor(props) {
        super(props);
        this.authInfo = store.getState().auth.authInfo;
        this.state = {

            selectedRows: [],
            publish: [],
            draft: [],
            trash: [],
            loading: true,
            error: null,
        };
    }

    componentDidMount() {
        this.getPublished();
        this.getDraft();
        this.getTrash();
    }

    getPublished = () => {
        let status = "published"
        axios.get(`/admin/cmsPageByStatus/${status}`, {
            headers: {
                'Authorization': `Bearer ${this.authInfo.token}`
            },
        })
            .then(res => {
                this.setState({
                    publish: res.data.data,
                    loading: false,
                    error: null
                })
            })
            .catch(error => {
                this.setState({
                    publish: [],
                    loading: false,
                    error: error
                })
            })
    }

    getDraft = () => {
        let status = "draft"
        axios.get(`/admin/cmsPageByStatus/${status}`, {
            headers: {
                'Authorization': `Bearer ${this.authInfo.token}`
            },
        })
            .then(res => {
                this.setState({
                    draft: res.data.data,
                    loading: false,
                    error: null
                })
            })
            .catch(error => {
                this.setState({
                    draft: [],
                    loading: false,
                    error: error
                })
            })
    }

    getTrash = () => {
        let status = "trash"
        axios.get(`/admin/cmsPageByStatus/${status}`, {
            headers: {
                'Authorization': `Bearer ${this.authInfo.token}`
            },
        })
            .then(res => {
                this.setState({
                    trash: res.data.data,
                    loading: false,
                    error: null
                })
            })
            .catch(error => {
                this.setState({
                    trash: [],
                    loading: false,
                    error: error
                })
            })
    }

    getUpdate = () => {
        this.getPublished();
        this.getDraft();
        this.getTrash();
    }

    handlePremanentDelete = async (id) => {
        await axios.delete(`/admin/deletePage/${id}`, {
            headers: {
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((res) => { console.log(res) })
            .catch((error) => {
                console.log("error", error)
            })
    }

    handleEdit = (id) => {
        this.props.history.push(`/admin/page-module-edit/${id}`);
    }
    handleDetails = (slug) => {
        this.props.history.push(`/page-detail/${slug}`)
    }

    handleRowSelected = (state) => {
        this.setState({ selectedRows: state.selectedRows });
    };

    handleDeleteSeletedData = (id) => {
        const { selectedRows } = this.state;
        if (selectedRows == false) {
            axios.delete(`/admin/deletePage/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            }).then((res) => {
                console.log(res.data)
                this.getUpdate()
            })
                .catch((error) => {
                    console.log("error", error)
                })
            this.setState({ loading: true })

        } else {
            for (let i = 0; i < selectedRows.length; i++) {
                const ids = selectedRows[i].id
                axios.delete(`/admin/deletePage/${ids}`, {
                    headers: {
                        'Authorization': `Bearer ${this.authInfo.token}`
                    }
                }).then((res) => {
                    this.getUpdate()
                    console.log('Row Data', res.data)
                })
                    .catch((error) => {
                        console.log("error", error)
                    })
            }
            // window.location.reload(); 
            this.setState({ loading: true })
        }
    }

    handleStatusPublish = (id) => {
        const { selectedRows } = this.state;
        console.log("selected Row", selectedRows)
        if (selectedRows == false) {
            axios.put("/admin/cmsUpdatePage/" + id, { status: 'published' }, {
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            })
                .then((res) => {
                    this.getUpdate()
                    console.log(res.data)
                }).catch(err => console.log("errorr message is : ", err.message))
            this.setState({ loading: true })
        } else {
            for (let i = 0; i < selectedRows.length; i++) {
                const ids = selectedRows[i].id
                axios.put("/admin/cmsUpdatePage/" + ids, { status: 'published' }, {
                    headers: {
                        'Authorization': `Bearer ${this.authInfo.token}`
                    }
                })
                    .then((res) => {
                        this.getUpdate()
                        console.log(res.data)
                    })
                    .catch(err => console.log("errorr message is : ", err.message))
            }
            this.setState({ selectedRows: "" })
            this.setState({ loading: true })

        }
    }




    handleStatusTrash = (id) => {
        const { selectedRows } = this.state;
        console.log("selected Row", selectedRows)
        if (selectedRows == false) {
            axios.put("/admin/cmsUpdatePage/" + id, { status: 'trash' }, {
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            }).then((res) => {
                this.getUpdate()
                console.log(res.data)
            }).catch(err => console.log("errorr message is : ", err.message))
            this.setState({ loading: true })
        } else {
            for (let i = 0; i < selectedRows.length; i++) {
                const ids = selectedRows[i].id
                axios.put("/admin/cmsUpdatePage/" + ids, { status: 'trash' }, {
                    headers: {
                        'Authorization': `Bearer ${this.authInfo.token}`
                    }
                })
                    .then(res => console.log(res.data))
                    .catch(err => console.log("errorr message is : ", err.message))
            }
            this.setState({ selectedRows: "" })
            this.setState({ loading: true })
            this.getPublished();
            this.getDraft();
        }
    }

    handleStateRestore = (id) => {
        const { selectedRows } = this.state;
        console.log("selected Row", selectedRows)
        if (selectedRows == false) {
            axios.put("/admin/cmsUpdatePage/" + id, { status: 'published' }, {
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            })
                .then((res) => {
                    this.getUpdate()
                    console.log(res.data)
                }).catch(err => console.log("errorr message is : ", err.message))
            this.setState({ loading: true })

        } else {
            for (let i = 0; i < selectedRows.length; i++) {
                const ids = selectedRows[i].id
                axios.put("/admin/cmsUpdatePage/" + ids, { status: 'published' }, {
                    headers: {
                        'Authorization': `Bearer ${this.authInfo.token}`
                    }
                })
                    .then((res) => {
                        this.getUpdate()
                        console.log(res.data)
                    })
                    .catch(err => console.log("errorr message is : ", err.message))
            }
            this.setState({ selectedRows: "" })
            this.setState({ loading: true })

        }
    }

    published_column = [
        {
            name: "Page Title",
            selector: (row, i) => row.pageTitle,
            sortable: true
        },
        {
            name: 'Publish Date & Time',
            selector: (row, i) => row.updatedAt,
            sortable: true,
            cell: row => {
                const date = new Date(row.updatedAt).toLocaleString();
                return <div>{date}</div>;
            },
        },
        {
            name: "Status",
            selector: (row, i) => row.status,
            sortable: true
        },
        {
            name: 'Actions',
            cell: (row) => (
                <>
                    <button
                        onClick={() => this.handleDetails(row.slug)}
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                    >
                        View
                    </button>
                    <button
                        onClick={() => this.handleEdit(row.id)}
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => this.handleStatusTrash(row._id)}
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                    >
                        Trash
                    </button>
                </>
            ),
        },
    ]

    draft_column = [
        {
            name: "Page Title",
            selector: (row, i) => row.pageTitle,
            sortable: true
        },
        {
            name: 'Created Date & Time',
            selector: (row, i) => row.createdAt,
            sortable: true,
            cell: row => {
                const date = new Date(row.createdAt).toLocaleString();
                return <div>{date}</div>;
            },
        },
        {
            name: "Status",
            selector: (row, i) => row.status,
            sortable: true
        },
        {
            name: 'Actions',
            cell: (row) => (
                <>
                    <button
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                        onClick={() => this.handleStatusPublish(row._id)}
                    >
                        Publish
                    </button>
                    <button
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                        onClick={() => this.handleDeleteSeletedData(row._id)}
                    >
                        Delete
                    </button>
                </>
            ),
        },
    ]

    trash_column = [
        {
            name: "Page Title",
            selector: (row, i) => row.pageTitle,
            sortable: true
        },
        {
            name: 'Created Date & Time',
            selector: (row, i) => row.createdAt,
            sortable: true,
            cell: row => {
                const date = new Date(row.createdAt).toLocaleString();
                return <div>{date}</div>;
            },
        },
        {
            name: "Status",
            selector: (row, i) => row.status,
            sortable: true
        },
        {
            name: 'Actions',
            cell: (row) => (
                <>
                    <button
                        type='submit'
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                        onClick={() => this.handleStateRestore(row._id)}
                    >
                        Restore
                    </button>
                    <button
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                        onClick={() => this.handleDeleteSeletedData(row._id)}
                    >
                        Delete
                    </button>
                </>
            ),
        },
    ]


    render() {
        const {
            publish,
            draft,
            trash,
            loading,
            error,
            selectedRows
        } = this.state;



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
                <section className="admin-dashboard-wrapper post-module">
                    <div className="inr_wrap dash_inner_wrap admin_manage_banner">
                        <div className="col-md-12">
                            <div className="seller_dash_wrap pt-5 pb-5">
                                <div className="container cnt_mob_lr0">
                                    <div className="bg-white rounded-3 pt-3 pb-5">
                                        <div className="dash_inner_wrap">
                                            <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center flex_mob_none">
                                                <div className="dash_title">Page</div>
                                                <div className="search_customer_field">
                                                    <div className="noti_wrap">
                                                        <div className="">
                                                            <span>
                                                                <Link className="btn custom_btn btn_yellow mx-auto" to="/admin/page-module-add-new"> Create New Page</Link>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <nav className="orders_tabs">
                                                <div className="nav nav-tabs nav-fill" id="nav-tab" role="tablist">
                                                    <button
                                                        className="nav-link active "
                                                        id="nav-publish-post-tab"
                                                        data-bs-toggle="tab"
                                                        data-bs-target="#nav-publish-post"
                                                        type="button"
                                                        role="tab"
                                                        aria-controls="nav-publish-post"
                                                    >
                                                        Published  <small>({publish.length})</small>
                                                    </button>
                                                    <button
                                                        className="nav-link"
                                                        id="nav-draft-post-tab"
                                                        data-bs-toggle="tab"
                                                        data-bs-target="#nav-draft-post"
                                                        type="button"
                                                        role="tab"
                                                        aria-controls="nav-draft-post"
                                                    >
                                                        Draft <small>({draft.length})</small>
                                                    </button>
                                                    <button
                                                        className="nav-link"
                                                        id="nav-trash-post-tab"
                                                        data-bs-toggle="tab"
                                                        data-bs-target="#nav-trash-post"
                                                        type="button"
                                                        role="tab"
                                                        aria-controls="nav-trash-post"
                                                    >
                                                        Trash <small>({trash.length})</small>
                                                    </button>
                                                </div>
                                            </nav>
                                        </div>

                                        <div className="orders_table tab-content pt-0 pb-0 addPost_table_extention" id="nav-tabContent">
                                            {/* Publish */}
                                            <div className="tab-pane fade show active" id="nav-publish-post" role="tabpanel" aria-labelledby="nav-publish-post-tab">
                                                <DataTableExtensions
                                                    columns={this.published_column}
                                                    data={publish}
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
                                                {/* <button
                                                    className="custom_btn btn_yellow_bordered w-auto btn margin_right"
                                                    onClick={this.handleDeleteSeletedData}
                                                    hidden={!selectedRows.length}
                                                >
                                                    {selectedRows.length === 1 ? 'PERMANENT DELETE' : `PERMANENT DELETE (${selectedRows.length})`}
                                                </button> */}

                                            </div>
                                            {/* Draft */}
                                            <div className="tab-pane fade" id="nav-draft-post" role="tabpanel" aria-labelledby="nav-draft-post-tab">
                                                <div className="DT_ext_row">
                                                    <DataTableExtensions
                                                        columns={this.draft_column}
                                                        data={draft}
                                                    >
                                                        <DataTable
                                                            pagination
                                                            highlightOnHover
                                                            noHeader
                                                            defaultSortField="id"
                                                            defaultSortAsc={false}
                                                            selectableRows
                                                            selectedRows={selectedRows}
                                                            onSelectedRowsChange={this.handleRowSelected}
                                                        />
                                                    </DataTableExtensions>
                                                </div>
                                                {/* <button
                                                    className="custom_btn btn_yellow_bordered w-auto btn margin_right"
                                                    onClick={this.handleDeleteSeletedData}
                                                    hidden={!selectedRows.length}
                                                >
                                                    {selectedRows.length === 1 ? 'DELETE' : `DELETE ALL  (${selectedRows.length})`}
                                                </button> */}
                                                {/* <button
                                                    className="custom_btn btn_yellow_bordered w-auto btn margin_right"
                                                    hidden={!selectedRows.length}
                                                >
                                                    {selectedRows.length === 1 ? 'PUBLISH' : `PUBLISH ALL  (${selectedRows.length})`}
                                                </button> */}
                                            </div>

                                            {/* Trash */}
                                            <div className="tab-pane fade" id="nav-trash-post" role="tabpanel" aria-labelledby="nav-trash-post-tab">
                                                <div className="DT_ext_row">
                                                    <DataTableExtensions
                                                        columns={this.trash_column}
                                                        data={trash}
                                                    >
                                                        <DataTable
                                                            pagination
                                                            highlightOnHover
                                                            noHeader
                                                            defaultSortField="id"
                                                            defaultSortAsc={false}
                                                            selectableRows
                                                            selectedRows={selectedRows}
                                                            onSelectedRowsChange={this.handleRowSelected}
                                                        />
                                                    </DataTableExtensions>
                                                </div>
                                                {/* <button
                                                    className="custom_btn btn_yellow_bordered w-auto btn margin_right"
                                                    onClick={this.handleDeleteSeletedData}
                                                    hidden={!selectedRows.length}
                                                >
                                                    {selectedRows.length === 1 ? 'DELETE' : `DELETE ALL  (${selectedRows.length})`}
                                                </button> */}
                                                {/* <button
                                                    className="custom_btn btn_yellow_bordered w-auto btn margin_right"
                                                    hidden={!selectedRows.length}
                                                >
                                                    {selectedRows.length === 1 ? 'RESTORE' : `RESTORE ALL  (${selectedRows.length})`}
                                                </button> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </React.Fragment>

        );
    }
}

export default AdminPageModule;