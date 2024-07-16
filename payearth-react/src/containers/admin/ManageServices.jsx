import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/admin/common/Header';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/reducers/global-reducer';
import SpinnerLoader from "../../components/common/SpinnerLoader";
import { connect } from 'react-redux';
import store from '../../store/index';
import axios from 'axios';
import Footer from '../../components/common/Footer';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import Modal from "react-bootstrap/Modal";
import CryptoJS from 'crypto-js';
import 'react-quill/dist/quill.snow.css';
class ManageServices extends Component {
    constructor(props) {
        super(props);
        const { dispatch } = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;
        // ***
        this.cloudName = process.env.REACT_APP_CLOUD_NAME
        this.apiKey = process.env.REACT_APP_CLOUD_API_KEY
        this.apiSecret = process.env.REACT_APP_CLOUD_API_SECRET

        // ***
        this.state = {
            check: false, data: [], selectedRows: [], showModal: false,
            loading: true,
            activeTab: localStorage.getItem('activeTab') || 'nav-pending-orders',
        }
    }


    handleRowSelected = (state) => {
        this.setState({ selectedRows: state.selectedRows });
    }

    //$$$$$$$$$$$$$$$$$$$$
    handleTabClick = (tab) => {
        this.setState({ activeTab: tab });
        localStorage.setItem('activeTab', tab);
    };

    handleActiveDetails = (row) => {
        this.setState({ selectedRows: row });
        this.setState({ showModal: true });
    };

    handleChange = (e) => {
        //  console.log(e.target.checked)
        if (e.target.checked) {
            this.setState({ check: 'checked' })
            //  document.getElementsByTagName("input")[0].setAttribute('checked', 'checked')
        } else {
            this.setState({ check: null })
            //document.getElementsByTagName('input')[0].removeAttribute('checked')
        }//else End
    }

    handleEdit = (row) => {
        this.props.history.push(`/admin/edit-service/${row._id}`);
    }

    handleInActive = (row) => {
        axios.put(`/admin/service/status/${row._id}`, {}, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            // console.log('response of delete:', response)
            if (response.data.status) {
                toast.success(response.data.message);
                this.getServices();  // Refresh the list after deletion
            } else {
                toast.error(response.data.message);
            }
        }).catch((error) => {
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            } else {
                toast.error("An error occurred while deleting the service.");
            }
        });
    }


    handleDeleteSelectedData = () => {
        const { selectedRows } = this.state;

        if (selectedRows.length === 0) {
            toast.warning("No services selected. Please select services to delete.");
            return;
        }

        const confirmDelete = window.confirm("Are you sure you want to delete the selected services? This action cannot be undone.");

        if (!confirmDelete) {
            toast.info("Deletion cancelled. No services were deleted.");
            return;
        }

        const headers = {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8',
            'Authorization': `Bearer ${this.authInfo.token}`
        };

        const deletePromises = selectedRows.map(row => {
            let deleteImageRequest;

            if (row.imageId) {
                // If the service has an image, delete it from Cloudinary
                const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
                const stringToSign = `public_id=${row.imageId}&timestamp=${timestamp}${this.apiSecret}`;
                const signature = CryptoJS.SHA1(stringToSign).toString(CryptoJS.enc.Hex);

                const cloudinaryDeleteUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`;
                deleteImageRequest = fetch(cloudinaryDeleteUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        public_id: row.imageId,
                        api_key: this.apiKey,
                        timestamp,
                        signature
                    })
                }).then(response => response.json())
                    .then(data => {
                        //    console.log("Cloudinary response data:", data);
                        if (data.result === 'ok') {
                            //    toast.success("Image deleted successfully");
                        } else {
                            throw new Error("Failed to delete image from Cloudinary");
                        }
                    }).catch(error => {
                        toast.error("Error deleting image from Cloudinary");
                        console.error("Cloudinary deletion error:", error);
                        throw error; // Rethrow error to propagate it further
                    });
            } else {
                // If no image to delete, resolve immediately
                deleteImageRequest = Promise.resolve();
            }

            // Delete the service from your backend
            const deleteServiceRequest = axios.delete(`/admin/services/delete/${row._id}`, { headers })
                .then(response => {
                    if (response.data.status) {
                        toast.success(response.data.message); // Show success toast for each successful deletion
                    } else {
                        toast.error(response.data.message); // Show error toast for unsuccessful deletion
                    }
                })
                .catch(error => {
                    console.error("Error during service deletion", error);
                    if (error.response && error.response.data.status === false) {
                        toast.error(error.response.data.message); // Show error toast for server error response
                    } else {
                        toast.error("An error occurred while deleting the service."); // Show generic error toast for other errors
                    }
                    throw error; // Rethrow error to propagate it further
                });

            // Return a promise that resolves when both deletion actions are complete
            return deleteImageRequest.then(() => deleteServiceRequest);
        });

        Promise.all(deletePromises)
            .then(() => {
                this.getServices(); // Refresh the list after deletion
            })
            .catch(error => {
                console.error("Error during deletion process:", error);
                toast.error("An unexpected error occurred. Please try again.");
            });
    };


    getServices = () => {
        let url = '/admin/services';
        this.dispatch(setLoading({ loading: true }));
        // this.dispatch(SpinnerLoader({ loading: true }));
        axios.get(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            //  console.log("all servicess", response);

            const activeServices = response.data.data.filter(item => item.isActive === true);
            const inactiveServices = response.data.data.filter(item => item.isActive === false);

            this.setState({
                // activeServiceData: activeServices,
                activeServiceData: "",
                loading: false,
                error: null
                //   pagination: response.data.data.paginationData
            });

            this.setState({
                // inactiveServiceData: inactiveServices,
                inactiveServiceData: "",
                loading: false,
                error: null
                //   pagination: response.data.data.paginationData
            });
        })
            .catch(error => {
                if (error.response && error.response.data.status === false) {
                    toast.error(error.response.data.message);
                }
            }).finally(() => {
                setTimeout(() => {
                    this.dispatch(setLoading({ loading: false }));
                    //  this.dispatch(SpinnerLoader({ loading: false }));
                }, 300);
            });
    }


    componentDidMount() {
        this.getServices();
    };


    activeService_column = [
        {
            name: 'SERVICE-IMAGE',
            selector: (row, i) => (<img
                src={row.featuredImage}
                alt="Not selected"
                style={{ width: "150px", height: "100px" }}
            />),
            sortable: true,
        },
        {
            name: "SERVICE-PROVIDER",
            selector: (row, i) => row.createdBy?.name || row.createdByAdmin?.name || 'N/A',
            sortable: true
        },
        {
            name: "SERVICE NAME",
            selector: (row, i) => row.name,
            sortable: true
        },
        {
            name: "CATEGORY",
            selector: (row, i) => row.category.categoryName,
            sortable: true
        },
        // {
        //     name: "DESCRIPTION",
        //     selector: (row, i) => (
        //         <div
        //             dangerouslySetInnerHTML={{
        //                 __html: (row.description),
        //             }}
        //         />
        //     ),
        //     sortable: true
        // },
        {
            name: "STATUS",
            selector: (row, i) =>// row.isActive === true ? (
                <p className="p-1 text-white bg-success  bg-opacity-6 border-info rounded">
                    Active
                </p>
            //  ) : (
            //  <p className="p-1 text-white bg-danger  bg-opacity-6 border-info rounded">
            //   In-Active
            //   </p>
            //    ),
            ,
            sortable: true
        },
        {
            name: 'ACTIONS',
            width: "350px",
            cell: (row) => (
                <>
                    <button
                        onClick={() => this.handleActiveDetails(row)}
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                    >
                        Details
                    </button>
                    <button
                        onClick={() => this.handleEdit(row)}
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => this.handleInActive(row)}
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                    >
                        In-active
                    </button>
                    <button
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                        //onClick={() => this.handleDeleteSeletedData(row._id)}
                        onClick={() => this.handleDeleteSelectedData(row)}
                    >
                        Delete
                    </button>

                </>
            ),
        },
    ]


    inactiveService_column = [
        {
            name: 'SERVICE-IMAGE',
            selector: (row, i) => (<img
                src={row.featuredImage}
                alt="Not selected"
                style={{ width: "150px", height: "100px" }}
            />),
            sortable: true,
        },
        {
            name: "SERVICE-PROVIDER",
            selector: (row, i) => row.createdBy?.name || row.createdByAdmin?.name || 'N/A',
            sortable: true
        },
        {
            name: "SERVICE NAME",
            selector: (row, i) => row.name,
            sortable: true
        },
        {
            name: "CATEGORY",
            selector: (row, i) => row.category.categoryName,
            sortable: true
        },
        // {
        //     name: "DESCRIPTION",
        //     selector: (row, i) => (
        //         <div
        //             dangerouslySetInnerHTML={{
        //                 __html: (row.description),
        //             }}
        //         />
        //     ),
        //     sortable: true
        // },
        {
            name: "STATUS",
            selector: (row, i) =>// row.isActive === true ? (
                // <p className="p-1 text-white bg-success  bg-opacity-6 border-info rounded">
                //   Active
                //  </p>
                //  ) : (
                <p className="p-1 text-white bg-danger  bg-opacity-6 border-info rounded">
                    In-Active
                </p>
            //    ),
            ,
            sortable: true
        },
        {
            name: 'ACTIONS',
            width: "350px",
            cell: (row) => (
                <>
                    <button
                        onClick={() => this.handleActiveDetails(row)}
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                    >
                        Details
                    </button>
                    <button
                        onClick={() => this.handleEdit(row)}
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => this.handleInActive(row)}
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                    >
                        Active
                    </button>

                    <button
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                        // onClick={() => this.handleDeleteSeletedData(row._id)}
                        onClick={() => this.handleDeleteSelectedData(row)}
                    >
                        Delete
                    </button>
                </>
            ),
        },
    ]


    render() {
        const { activeServiceData } = this.state;
        const { inactiveServiceData } = this.state;
        //  console.log(ServiceData)
        const { selectedRows, loading, } = this.state;
        const { activeTab } = this.state;
        //   if (loading) {
        //     return <SpinnerLoader />;
        //   }

        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ""}
                <Header />
                <div className="seller_dash_wrap pt-5 pb-5">
                    <div className="container ">
                        <div className="bg-white rounded-3 pt-3 pb-5">
                            <div className="dash_inner_wrap">
                                <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center">
                                    <div className="dash_title">Manage Service</div>
                                    {/* <a className="custom_btn btn_yellow w-auto btn" href='#'>Add Service</a> */}
                                    <div className="">
                                        <span>
                                            <Link
                                                className="btn custom_btn btn_yellow mx-auto"
                                                to="#"
                                                onClick={this.clearSessionStorage}
                                            >
                                                Add New Service
                                            </Link>
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <nav className="orders_tabs">
                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                    <button
                                        // className="nav-link active"
                                        className={`nav-link ${activeTab === 'nav-pending-orders' ? 'active' : ''}`}
                                        id="nav-pending-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-pending-orders" type="button" role="tab" aria-controls="nav-pending-orders" aria-selected="true" onClick={() => this.handleTabClick('nav-pending-orders')}>Added Services</button>
                                    <button
                                        //  className="nav-link" 
                                        className={`nav-link ${activeTab === 'nav-ongoing-orders' ? 'active' : ''}`}
                                        id="nav-ongoing-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-ongoing-orders" type="button" role="tab" aria-controls="nav-ongoing-orders" aria-selected="false" onClick={() => this.handleTabClick('nav-ongoing-orders')}>Pending for approval</button>
                                    <button
                                        // className="nav-link" 
                                        className={`nav-link ${activeTab === 'nav-cancelled-orders' ? 'active' : ''}`}
                                        id="nav-cancelled-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-cancelled-orders" type="button" role="tab" aria-controls="nav-cancelled-orders" aria-selected="true" onClick={() => this.handleTabClick('nav-cancelled-orders')}>Rejected Services</button>
                                </div>
                            </nav>
                            <div className="orders_table tab-content pt-0 pb-0" id="nav-tabContent">
                                <div
                                    // className="tab-pane fade show active" 
                                    className={`tab-pane fade ${activeTab === 'nav-pending-orders' ? 'show active' : ''}`}
                                    id="nav-pending-orders" role="tabpanel" aria-labelledby="nav-pending-orders-tab">
                                    <DataTableExtensions
                                        columns={this.activeService_column}
                                        data={activeServiceData}
                                    >
                                        <DataTable
                                            pagination
                                            noHeader
                                            highlightOnHover
                                            defaultSortField="id"
                                            defaultSortAsc={false}
                                            selectableRows
                                            onSelectedRowsChange={this.handleRowSelected}
                                            selectedRows={selectedRows}
                                            paginationRowsPerPageOptions={[5, 8, 12, 16]}
                                            // paginationPerPage={paginationPerPage}
                                            paginationPerPage={5}
                                        />
                                    </DataTableExtensions>
                                </div>
                                <div
                                    //  className="tab-pane fade" 
                                    className={`tab-pane fade ${activeTab === 'nav-ongoing-orders' ? 'show active' : ''}`}
                                    id="nav-ongoing-orders" role="tabpanel" aria-labelledby="nav-ongoing-orders-tab">
                                    <table className="table table-responsive table-bordered">
                                        <thead>
                                            <tr>
                                                <th>Service ID</th>
                                                <th>Service Name</th>
                                                <th>Selling Quantity</th>
                                                <th>Category</th>
                                                <th>Total Stock Quantity</th>
                                                <th>Status</th>
                                                <th className="invisible">action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1JSLYUCW</td>
                                                <td>Testing11</td>
                                                <td>10</td>
                                                <td>Books and CDs</td>
                                                <td>10</td>
                                                <td><div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input" type="checkbox"
                                                        value=""
                                                        checked={this.setState.check}
                                                        onChange={this.handleChange}
                                                    />
                                                </div></td>
                                                <td><Link to="/admin/manage-service-details" className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                            </tr>
                                            <tr>
                                                <td>1JSLYUCW</td>
                                                <td>Testing11</td>
                                                <td>10</td>
                                                <td>Books and CDs</td>
                                                <td>10</td>
                                                <td><div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input" type="checkbox"
                                                        value=""
                                                        checked={this.setState.check}
                                                        onChange={this.handleChange}
                                                    />
                                                </div></td>
                                                <td><Link to="/admin/manage-service-details" className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                            </tr>
                                            <tr>
                                                <td>1JSLYUCW</td>
                                                <td>Testing11</td>
                                                <td>10</td>
                                                <td>Books and CDs</td>
                                                <td>10</td>
                                                <td><div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input" type="checkbox"
                                                        value=""
                                                        checked={this.setState.check}
                                                        onChange={this.handleChange}
                                                    />
                                                </div></td>
                                                <td><Link to="/admin/manage-service-details" className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                            </tr>
                                            <tr>
                                                <td>1JSLYUCW</td>
                                                <td>Testing11</td>
                                                <td>10</td>
                                                <td>Books and CDs</td>
                                                <td>10</td>
                                                <td><div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input" type="checkbox"
                                                        value=""
                                                        checked={this.setState.check}
                                                        onChange={this.handleChange}
                                                    />
                                                </div></td>
                                                <td><Link to="/admin/manage-service-details" className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                            </tr>
                                            <tr>
                                                <td>1JSLYUCW</td>
                                                <td>Testing11</td>
                                                <td>10</td>
                                                <td>Books and CDs</td>
                                                <td>10</td>
                                                <td><div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input" type="checkbox"
                                                        value=""
                                                        checked={this.setState.check}
                                                        onChange={this.handleChange}
                                                    />
                                                </div></td>
                                                <td><Link to="/admin/manage-service-details" className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                            </tr>
                                            <tr>
                                                <td>1JSLYUCW</td>
                                                <td>Testing11</td>
                                                <td>10</td>
                                                <td>Books and CDs</td>
                                                <td>10</td>
                                                <td><div className="form-check form-switch">
                                                    <input
                                                        className="form-check-input" type="checkbox"
                                                        value=""
                                                        checked={this.setState.check}
                                                        onChange={this.handleChange}
                                                    />
                                                </div></td>
                                                <td><Link to="/admin/manage-service-details" className="custom_btn btn_yellow_bordered w-auto btn">Details</Link></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div
                                    // className="tab-pane fade"
                                    className={`tab-pane fade ${activeTab === 'nav-cancelled-orders' ? 'show active' : ''}`}
                                    id="nav-cancelled-orders" role="tabpanel" aria-labelledby="nav-cancelled-orders-tab">
                                    {/* <div className="tab-pane fade show active" id="nav-pending-orders" role="tabpanel" aria-labelledby="nav-pending-orders-tab"> */}
                                    <DataTableExtensions
                                        columns={this.inactiveService_column}
                                        data={inactiveServiceData}
                                    >
                                        <DataTable
                                            pagination
                                            paginationRowsPerPageOptions={[5, 8, 12, 16]}
                                            paginationPerPage={5}
                                            noHeader
                                            highlightOnHover
                                            //defaultSortField="id"
                                            // defaultSortAsc={false}
                                            selectableRows
                                            onSelectedRowsChange={this.handleRowSelected}
                                            selectedRows={selectedRows}
                                        />
                                    </DataTableExtensions>
                                    {/* </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />

                <Modal
                    show={this.state.showModal}
                    onHide={() => this.setState({ showModal: false })}
                    dialogClassName="modal-lg"
                    aria-labelledby="example-custom-modal-styling-title"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-custom-modal-styling-title">
                            Service Details
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body
                        style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
                    >
                        {selectedRows && (
                            <div>
                                <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
                                    <div className="row">
                                        <div className="col-6">
                                            <h6 className="fw-bold text-secondary mb-1">
                                                Service Code : {selectedRows.serviceCode || ""}
                                            </h6>
                                            <br />
                                            <h6 className="fw-bold text-secondary mb-1">
                                                Service Name : {selectedRows.lname || ""}
                                            </h6>
                                            <br />
                                            <h6 className="fw-bold text-secondary mb-1">
                                                {/* Category : {selectedRows.category && selectedRows.category.categoryName || ""} */}
                                                Category : {selectedRows.category?.categoryName || ''}
                                            </h6>
                                            <br />
                                            <h6 className="fw-bold text-secondary mb-1">
                                                Service Price : {selectedRows.charges || ""}
                                            </h6>
                                            <br />
                                            <h6 className="fw-bold text-secondary mb-1">
                                                Name : {selectedRows.createdBy?.name || selectedRows.createdByAdmin?.name || ''}
                                            </h6>
                                            <br />
                                            <br />
                                            <h6 className="fw-bold text-secondary mb-1">
                                                Created At : {selectedRows.createdAt || ""}
                                            </h6>
                                            <br />
                                            {/* <h6 className="fw-bold text-secondary mb-1">
                                                Service Description :
                                                <div
                                                    dangerouslySetInnerHTML={{
                                                        __html: selectedRows.description || "",
                                                    }}
                                                />
                                            </h6> */}
                                        </div>
                                        <div className="col-6">
                                            <img
                                                src={selectedRows.featuredImage || ""}
                                                alt="Not found!"
                                                style={{ maxWidth: "350px" }}
                                            />
                                        </div>
                                        <div className="col-12">
                                            <h6 className="fw-bold text-secondary mb-1">
                                                Service Description :
                                                <div
                                                    className="ql-editor"
                                                    dangerouslySetInnerHTML={{
                                                        __html: selectedRows.description || "",
                                                    }}
                                                />
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Modal.Body>
                </Modal>
            </React.Fragment >
        );
    }

}




export default connect(setLoading)(ManageServices);