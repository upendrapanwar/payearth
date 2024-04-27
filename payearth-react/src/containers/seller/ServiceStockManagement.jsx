import React, { Component } from "react";
import Footer from "../../components/common/Footer";
import Header from "./../../components/seller/common/Header";
import store from "../../store/index";
import { setLoading } from "../../store/reducers/global-reducer";
import SpinnerLoader from "../../components/common/SpinnerLoader";
import NotFound from "../../components/common/NotFound";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { Helmet } from "react-helmet";
import { CalendarAuth } from "./CalendarAuth";
import Calendar from "./Calendar";
import Modal from "react-bootstrap/Modal";
import emptyImg from "./../../assets/images/emptyimage.png";
import { CalendarLogout } from "./CalendarLogout";

class ServiceStockManagement extends Component {
  constructor(props) {
    super(props);
    this.authInfo = store.getState().auth.authInfo;
    // console.log("Auth", this.userInfo.name)
    const accessToken = localStorage.getItem("accessToken");
    this.state = {
      sellerId: this.authInfo.id,
      token: this.authInfo.token,
      selectedRows: [],
      service: [],
      subscriber: [],
      meeting: [],
      loading: true,
      error: null,
      showModal: false,
      editModalOpen: false, // State to manage the edit modal
      editedData: {}, // State to store edited data
      emptyImg: emptyImg,
      isCalendarAuthorized: accessToken ? true : false,
    };
  }

  componentDidMount() {
    this.getAddedServices();
    this.getSubscriberList();
    this.getMeetingHistory();
  }

  getUpdate = () => {
    this.getAddedServices();
    this.getSubscriberList();
    this.getMeetingHistory();
  };

  handleCalendarAuthorization = () => {
    this.setState({ isCalendarAuthorized: true });
  };

  // handleCalendarLogout = () => {
  //   this.setState({ isCalendarAuthorized: false });
  //   localStorage.setItem('isCalendarAuthorized', 'false');
  // }

  getAddedServices = () => {
    axios
      .get(`seller/service/items/${this.authInfo.id}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${this.authInfo.token}`,
        },
      })
      .then((res) => {
        console.log("Data", res);
        this.setState({
          service: res.data.data,
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        this.setState({
          service: [],
          loading: false,
          error: error,
        });
      });
  };

  getSubscriberList = () => {
    axios
      .get(`seller/service/getServiceData`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${this.authInfo.token}`,
        },
      })
      .then((res) => {
        this.setState({
          subscriber: res.data.data,
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        this.setState({
          subscriber: [],
          loading: false,
          error: error,
        });
      });
  };

  getMeetingHistory = () => {
    let status = "Completed";

    axios
      .get(`seller/service/getServiceStatus/${status}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${this.authInfo.token}`,
        },
      })
      .then((res) => {
        this.setState({
          meeting: res.data.data,
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        this.setState({
          meeting: [],
          loading: false,
          error: error,
        });
      });
  };

  handleDetails = (row) => {
    this.setState({ selectedRows: row });
    this.setState({ showModal: true });
  };

  handleUpdateStatus = (id) => {
    axios
      .put(
        `seller/service/items/status-update/${id}`,
        { isActive: false },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: `Bearer ${this.authInfo.token}`,
          },
        }
      )
      .then((res) => {
        this.getUpdate();
        console.log("Response of Status request", res);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  handleEdit = (row) => {
    this.props.history.push(`/seller/edit-service/${row._id}`);
  };

  clearSessionStorage = () => {
    sessionStorage.clear();
  }

  service_column = [
    {
      name: "Image",
      selector: (row, i) => (
        <img
          src={row.featuredImage}
          alt="Not selected"
          style={{ width: "150px", height: "100px" }}
        />
      ),
      sortable: true,
    },
    {
      name: "Service ID",
      selector: (row, i) => row.serviceCode,
      sortable: true,
    },
    {
      name: "Service Name",
      selector: (row, i) => row.name,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row, i) => row.category.categoryName,
      sortable: true,
    },
    // author
    {
      name: "Service Start Date & Time",
      selector: (row, i) => row.createdAt,
      sortable: true,
      width: "200px",

      cell: (row) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const date = new Date(row.createdAt).toLocaleDateString(
          "en-US",
          options
        );
        return <div>{date}</div>;
      },
    },
    {
      name: "Status",
      selector: (row, i) =>
        row.isActive === true ? (
          <p className="p-1 text-white bg-success  bg-opacity-6 border-info rounded">
            Active
          </p>
        ) : (
          <p className="p-1 text-white bg-danger  bg-opacity-6 border-info rounded">
            In-Active
          </p>
        ),
      sortable: true,
    },
    {
      name: "Actions",
      // width: "350px",
      cell: (row) => (
        <>
          <button
            onClick={() => this.handleDetails(row)}
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
            onClick={() => this.handleUpdateStatus(row._id)}
            className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
          >
            Cancel
          </button>
        </>
      ),
    },
  ];

  subscriber_column = [
    // {
    //   name: "Image",
    //   selector: (row, i) => (
    //     <img
    //       src={row.featuredImage}
    //       alt="Not selected"
    //       style={{ width: "150px", height: "100px" }}
    //     />
    //   ),
    //   sortable: true,
    // },
    {
      name: "Subscriber_Name",
      selector: (row, i) => row.userId.name,
      sortable: true,
    },
    {
      name: "Subscriber_Email",
      selector: (row, i) => row.userId.email,
      sortable: true,
    },
    {
      name: "Service ID",
      selector: (row, i) => row.serviceId.serviceCode,
      sortable: true,
    },
    {
      name: "Service Name",
      selector: (row, i) => row.serviceId.name,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row, i) => row.serviceId.category.categoryName,
      sortable: true,
    },
    // author
    {
      name: "Meeting Date & Time",
      selector: (row, i) => row.createdAt,
      sortable: true,
      width: "200px",

      cell: (row) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const date = new Date(row.meetingDate).toLocaleDateString(
          "en-US",
          options
        );
        return <div>{date}</div>;
      },
    },
    // {
    //   name: "Status",
    //   selector: (row, i) =>
    //     row.meetingStatus === "Complited" ? (
    //       <p className="p-1 text-white bg-success  bg-opacity-6 border-info rounded">
    //         Complited
    //       </p>
    //     ) : (
    //       <p className="p-1 text-white bg-danger  bg-opacity-6 border-info rounded">
    //         In-Active
    //       </p>
    //     ),
    //   sortable: true,
    // },
    // {
    //   name: "Actions",
    //   // width: "350px",
    //   cell: (row) => (
    //     <>
    //       <button
    //         onClick={() => this.handleDetails(row)}
    //         className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
    //       >
    //         Details
    //       </button>
    //       <button
    //         onClick={() => this.handleEdit(row)}
    //         className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
    //       >
    //         Edit
    //       </button>
    //       <button
    //         onClick={() => this.handleUpdateStatus(row._id)}
    //         className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
    //       >
    //         Cancel
    //       </button>
    //     </>
    //   ),
    // },
  ];

  meeting_column = [
    // {
    //   name: "Image",
    //   selector: (row, i) => (
    //     <img
    //       src={row.featuredImage}
    //       alt="Not selected"
    //       style={{ width: "150px", height: "100px" }}
    //     />
    //   ),
    //   sortable: true,
    // },
    {
      name: "Subscriber_Name",
      selector: (row, i) => row.userId.name,
      sortable: true,
    },
    {
      name: "Subscriber_Email",
      selector: (row, i) => row.userId.email,
      sortable: true,
    },
    {
      name: "Service ID",
      selector: (row, i) => row.serviceId.serviceCode,
      sortable: true,
    },
    {
      name: "Service Name",
      selector: (row, i) => row.serviceId.name,
      sortable: true,
    },
    {
      name: "Category",
      selector: (row, i) => row.serviceId.category.categoryName,
      sortable: true,
    },
    // author
    {
      name: "Service Start Date & Time",
      selector: (row, i) => row.createdAt,
      sortable: true,
      width: "200px",

      cell: (row) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        const date = new Date(row.meetingDate).toLocaleDateString(
          "en-US",
          options
        );
        return <div>{date}</div>;
      },
    },
    {
      name: "Status",
      selector: (row, i) => (
        <p className="p-1 text-white bg-success  bg-opacity-6 border-info rounded">
          {row.meetingStatus}
        </p>
      ),
      sortable: true,
    },
    // {
    //   name: "Actions",
    //   // width: "350px",
    //   cell: (row) => (
    //     <>
    //       <button
    //         onClick={() => this.handleDetails(row)}
    //         className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
    //       >
    //         Details
    //       </button>
    //       <button
    //         onClick={() => this.handleEdit(row)}
    //         className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
    //       >
    //         Edit
    //       </button>
    //       <button
    //         onClick={() => this.handleUpdateStatus(row._id)}
    //         className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
    //       >
    //         Cancel
    //       </button>
    //     </>
    //   ),
    // },
  ];

  render() {
    const {
      sellerId,
      token,
      service,
      subscriber,
      meeting,
      loading,
      error,
      selectedRows,
      editModalOpen,
      editedData,
      emptyImg,
      isCalendarAuthorized,
    } = this.state;

    console.log("selected Rows", selectedRows);
    console.log("meeting :->", meeting);

    if (loading) {
      return <SpinnerLoader />;
    }
    if (error) {
      return <div>Error: {error}</div>;
    }

    return (
      <React.Fragment>
        {loading === true ? <SpinnerLoader /> : ""}
        <Header />
        <div className="seller_body">
          <div className="seller_dash_wrap pt-5 pb-5">
            <div className="container ">
              <div className="bg-white rounded-3 pt-3 pb-5">
                <div className="dash_inner_wrap">
                  <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center flex_mob_none">
                    <div className="dash_title">Service Stock Management</div>
                    <div className="search_customer_field">
                      <div className="noti_wrap">
                        <div className="">
                          <span>
                            <Link
                              className="btn custom_btn btn_yellow mx-auto"
                              to="/seller/add-service"
                              onClick={this.clearSessionStorage}
                            >
                              Add New Service
                            </Link>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <nav className="orders_tabs">
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                      <button
                        className="nav-link active"
                        id="nav-appointment-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-appointment"
                        type="button"
                        role="tab"
                        aria-controls="nav-appointment"
                        aria-selected="true"
                      >
                        Appointments
                      </button>
                      <button
                        className="nav-link"
                        id="nav-service-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-service"
                        type="button"
                        role="tab"
                        aria-controls="nav-service"
                        aria-selected="false"
                      >
                        My Services
                      </button>
                      <button
                        className="nav-link"
                        id="nav-subscriber-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-subscriber"
                        type="button"
                        role="tab"
                        aria-controls="nav-subscriber"
                        aria-selected="false"
                      >
                        Subscribers List
                      </button>
                      <button
                        className="nav-link"
                        id="nav-meeting-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-meeting"
                        type="button"
                        role="tab"
                        aria-controls="nav-meeting"
                        aria-selected="false"
                      >
                        Meeting History
                      </button>
                      {/* <button className="nav-link" id="nav-cancelled-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-cancelled-orders" type="button" role="tab" aria-controls="nav-cancelled-orders" aria-selected="true"  onClick={() => this.getAddedProducts(false, null, 'reject')}>Rejected Services</button> */}
                    </div>
                  </nav>
                </div>

                <div
                  className="orders_table tab-content pt-0 pb-0 addPost_table_extention"
                  id="nav-tabContent"
                >
                  {/* Appointments */}
                  <div
                    className="tab-pane fade show active"
                    id="nav-appointment"
                    role="tabpanel"
                    aria-labelledby="nav-appointment-tab"
                  >
                    {/* <div className="text-center mt-5">
                      <CalendarAuth sellerId={sellerId} authToken={token}/>
                    </div>
                        <div style={{ width: "1000px", marginLeft: "150px" }}>
                      <Calendar authToken={token}/>
                    </div> */}

                    {!isCalendarAuthorized ? (
                      <div className="text-center mt-5">
                        <CalendarAuth
                          onAuthSuccess={() => {
                            this.handleCalendarAuthorization();
                          }}
                          sellerId={sellerId}
                          authToken={token}
                        />
                      </div>
                    ) : (
                      <>
                        {/* <div className="text-center mt-5">
                        <CalendarLogout onLogoutSuccess={this.handleCalendarLogout()}/>
                        </div> */}

                        <div
                          style={{
                            width: "1000px",
                            marginLeft: "150px",
                            marginTop: "50px",
                          }}
                        >
                          <Calendar authToken={token} />
                        </div>
                      </>
                    )}
                  </div>

                  {/* My Services */}
                  <div
                    className="tab-pane fade"
                    id="nav-service"
                    role="tabpanel"
                    aria-labelledby="nav-service-tab"
                  >
                    <DataTableExtensions
                      columns={this.service_column}
                      data={service}
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
                    {/* <button
                                                    className="custom_btn btn_yellow_bordered w-auto btn margin_right"
                                                    hidden={!selectedRows.length}
                                                >
                                                    {selectedRows.length === 1 ? 'TRASH' : `TRASH ALL  (${selectedRows.length})`}
                                                </button> */}
                  </div>

                  {/* Subscribers List */}
                  <div
                    className="tab-pane fade"
                    id="nav-subscriber"
                    role="tabpanel"
                    aria-labelledby="nav-subscriber-tab"
                  >
                    {/* <div className="DT_ext_row"> */}
                    <DataTableExtensions
                      columns={this.subscriber_column}
                      data={subscriber}
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
                    {/* </div> */}
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

                  {/* Meeting History */}
                  <div
                    className="tab-pane fade"
                    id="nav-meeting"
                    role="tabpanel"
                    aria-labelledby="nav-meeting-tab"
                  >
                    {/* <div className="DT_ext_row"> */}
                    <DataTableExtensions
                      columns={this.meeting_column}
                      data={meeting}
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
                    {/* </div> */}
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
        <Footer />

        {/* Details Modal */}
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
                        Service Name : {selectedRows.name || ""}
                      </h6>
                      <br />
                      <h6 className="fw-bold text-secondary mb-1">
                        Service Category : {selectedRows.categoryName || ""}
                      </h6>
                      <br />
                      <h6 className="fw-bold text-secondary mb-1">
                        Service Price : {selectedRows.price || ""}
                      </h6>
                      <br />
                      <h6 className="fw-bold text-secondary mb-1">
                        Created At : {selectedRows.createdAt || ""}
                      </h6>
                      <br />
                      <h6 className="fw-bold text-secondary mb-1">
                        Service Description :
                        <div
                          dangerouslySetInnerHTML={{
                            __html: selectedRows.description || "",
                          }}
                        />
                      </h6>
                    </div>
                    <div className="col-6">
                      <img
                        src={selectedRows.featuredImage || ""}
                        alt="Not found!"
                        style={{ maxWidth: "350px" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
}
export default ServiceStockManagement;
