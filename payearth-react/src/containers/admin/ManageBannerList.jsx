import React, { Component } from "react";
import Header from "../../components/admin/common/Header";
import Footer from "../../components/common/Footer";
import { Formik } from "formik";
import { toast } from "react-toastify";
import { setLoading } from "../../store/reducers/global-reducer";
import { connect } from "react-redux";
import store from "../../store/index";
import axios from "axios";
import nicon from "./../../assets/images/nicon.png";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file

import CryptoJS from "crypto-js";
import Modal from "react-bootstrap/Modal";
import { Helmet } from "react-helmet";
import noImg from "./../../assets/images/noimage.png";
import ModalBody from "react-bootstrap/esm/ModalBody";

class ManageBannerList extends Component {
  constructor(props) {
    super(props);
    this.cloudName = process.env.REACT_APP_CLOUD_NAME;
    this.apiKey = process.env.REACT_APP_API_KEY;
    this.apiSecret = process.env.REACT_APP_API_SECRET;
    this.authInfo = store.getState().auth.authInfo;

    this.itemsPerPage = 6;
    this.state = {
      selectedRows: [],
      banner: [],
      show: false,
      showModal: false,
      selectedRowData: null,
      loading: true,
      error: null,

      dateRange: {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
      filteredBanner: [],
    };
  }

  componentDidMount() {
    this.getBanner();
  }

  handleClose = () => {
    this.setState({ selectedRowData: false });
  };

  handlePreview = (row) => {
    console.log("id", row);
    this.setState({ selectedRowData: row });
    this.setState({ showModal: true });
  };

  getBanner = () => {
    axios
      .get("/admin/banner-list", {
        headers: {
          Authorization: `Bearer ${this.authInfo.token}`,
        },
      })
      .then((response) => {
        this.setState({
          banner: response.data.data,
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        this.setState({
          banner: [],
          loading: false,
          error: error,
        });
      });
  };

  handleRowSelected = (state) => {
    console.log("stelectedROW", state.selectedRows);
    this.setState({ selectedRows: state.selectedRows });
  };

  handleDeleteSeletedData = async (id) => {
    // const { timestamp, signature } = this.createSignature();
    const imgDelUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`;
    const vidDelUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/video/destroy`;
    const { selectedRows } = this.state;
    const cloudPublicId = selectedRows.map((item) =>
      item.imageId === "" ? item.videoId : item.imageId
    );
    console.log("cloudPublicId", cloudPublicId);

    if (selectedRows.length === 0) {
      toast.error("Please select row....", { autoClose: 3000 });
    } else {
      try {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = CryptoJS.SHA1(
          `public_id=${cloudPublicId}&timestamp=${timestamp}${this.apiSecret}`
        ).toString(CryptoJS.enc.Hex);
        const cloudinaryUrl = selectedRows.map((item) =>
          item.imageId === "" ? vidDelUrl : imgDelUrl
        );
        const response = await axios.delete(cloudinaryUrl, {
          params: {
            public_id: cloudPublicId,
            api_key: this.apiKey,
            signature: signature,
            timestamp: timestamp,
          },
        });
        if (response.status === 200) {
          console.log("Image deleted successfully");
        } else {
          console.log("Failed to delete image");
        }
      } catch (error) {
        console.log("Error deleting image", error);
      }

      for (let i = 0; i < selectedRows.length; i++) {
        const ids = selectedRows[i].id;
        console.log("selected id for delete", ids);
        axios
          .delete(`/admin/banner/${ids}`, {
            headers: {
              Authorization: `Bearer ${this.authInfo.token}`,
            },
          })
          .then((res) => {
            this.getBanner();
            console.log("Row Data", res.data);
          })
          .catch((error) => {
            console.log("error", error);
          });
      }
      this.setState({ loading: true });
    }
  };

  handleEdit = (id) => {
    this.props.history.push(`/admin/manage-banner-list-edit/${id}`);
  };

  handleStatusUpdate = (id) => {
    {
      id.status === "Unpublish"
        ? axios
            .put(
              "/admin/updateBanner/" + id.id,
              { status: "Publish" },
              {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json;charset=UTF-8",
                  Authorization: `Bearer ${this.authInfo.token}`,
                },
              }
            )
            .then((response) => {
              if (response) {
                this.getBanner();
              }
            })
            .catch((error) => {
              console.log("error", error);
            })
        : axios
            .put(
              "/admin/updateBanner/" + id.id,
              { status: "Unpublish" },
              {
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json;charset=UTF-8",
                  Authorization: `Bearer ${this.authInfo.token}`,
                },
              }
            )
            .then((response) => {
              if (response) {
                this.getBanner();
              }
            })
            .catch((error) => {
              console.log("error", error);
            });
    }
  };

  banner_column = [
    {
      name: "Advertisement Image/Video",
      selector: (row, i) =>
        row.video === "" ? (
          <img
            src={row.image}
            alt="No Image/video select"
            style={{ width: "350px", height: "90px" }}
          />
        ) : (
          <video
            width="350"
            height="90"
            src={row.video}
            autoPlay
            loop
            alt="No Image/video select"
          />
        ),
      sortable: true,
      width: "350px",
    },
    {
      name: "Advertisement Name",
      selector: (row, i) => row.bannerName,
      sortable: true,
      // width: 'auto',
    },
    {
      name: "Category",
      selector: (row, i) => row.category,
      sortable: true,
      width: "auto",
    },
    {
      name: "Created Date",
      selector: (row, i) => new Date(row.createdAt).toLocaleString(),
      sortable: true,
    },
    {
      name: "Author Details",
      selector: (row, i) =>
        row.authorDetails === null ? (
          ""
        ) : (
          <>
            <p>{row.authorDetails.name}</p>
            <p>{row.authorDetails.email}</p>
            {/* <p>{row.authorDetails.role}</p> */}
          </>
        ),
      sortable: true,
      width: "auto",
    },
    {
      name: "Advertisement Status",
      selector: (row, i) =>
        row.status === "Unpublish" ? (
          <p className="p-1 fw-bold text-white bg-danger bg-opacity-4 border-info rounded">
            {row.status}
          </p>
        ) : (
          <p className="p-1 fw-bold text-white bg-success  bg-opacity-4 border-info rounded">
            {row.status}
          </p>
        ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <>
          <button
            type="submit"
            className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
            onClick={() =>
              this.handleStatusUpdate({ id: row.id, status: row.status })
            }
          >
            {row.status === "Unpublish" ? "Publish" : "Block"}
          </button>
          <button
            type="submit"
            className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
            onClick={() => this.handlePreview(row)}
          >
            Preview
          </button>
          <button
            onClick={() => this.handleEdit(row.id)}
            className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
          >
            Edit
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
  ];

  handleIframeClick = () => {
    window.open(this.state.selectedRowData.siteUrl);
  };

  handleDateRangeChange = (ranges) => {
    const { banner } = this.state;
    const filteredBanner = banner.filter((item) => {
      const itemDate = new Date(item.startDate);
      return (
        itemDate >= ranges.selection.startDate &&
        itemDate <= ranges.selection.endDate
      );
    });

    this.setState({
      dateRange: {
        startDate: ranges.selection.startDate,
        endDate: ranges.selection.endDate,
        key: "selection",
      },
      filteredBanner,
    });
  };

  render() {
    const { banner, selectedRows, dateRange, filteredBanner } = this.state;
    console.log("banner Data : ", banner);
    return (
      <React.Fragment>
        <Header />
        <section className="inr_wrap">
          <Helmet>
            <title>{"Manage Advertisement - Pay Earth"}</title>
          </Helmet>

          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="cart adv_banner_wrapper">
                  <div className="dash_inner_wrap">
                    <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center flex_mob_none">
                      <div className="dash_title">Manage Advertisement</div>
                      <div className="search_customer_field">
                        <div className="noti_wrap">
                          <div className="">
                            <span>
                              <Link
                                className="btn custom_btn btn_yellow mx-auto"
                                to="/admin/manage-banner-advertisement"
                              >
                                Create New Advertisement
                              </Link>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="cart_list adv_banner_panel">
                    <div
                      className="tab-pane fade show active"
                      id="nav-draft-post"
                      role="tabpanel"
                      aria-labelledby="nav-draft-post-tab"
                    >
                      <div className="DT_ext_row adv-banner-row ">
                        <div className=" date-wrapper col-md-3">
                          <DateRangePicker
                            ranges={[dateRange]}
                            onChange={this.handleDateRangeChange}
                          />
                        </div>
                        <div className="tablewrapper col-md-9">
                          <div className="cart_wrap">
                            <div className="items_incart">
                              <span className="text-uppercase">
                                (
                                {filteredBanner.length === 0
                                  ? banner.length
                                  : filteredBanner.length}
                                ) ADVERTISEMENT IN YOUR LIST
                              </span>
                            </div>
                          </div>
                          <DataTableExtensions
                            columns={this.banner_column}
                            data={
                              filteredBanner.length === 0
                                ? banner
                                : filteredBanner
                            }
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
                              paginationPerPage={this.itemsPerPage}
                              paginationRowsPerPageOptions={[6, 10, 15, 20]}
                            />
                          </DataTableExtensions>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />

        <Modal
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
          // dialogClassName="modal-90w"
          dialogClassName="modal-fullscreen"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title>Preview</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.selectedRowData && (
              <div className="banner-container">
                <p>{this.state.selectedRowData.siteUrl}</p>
                <a href={this.state.selectedRowData.siteUrl} target="_blank">
                  <iframe
                    src={
                      !this.state.selectedRowData.image
                        ? this.state.selectedRowData.video
                        : this.state.selectedRowData.image
                    }
                    width="1100"
                    height="315"
                    allow="autoplay; encrypted-media"
                  ></iframe>
                </a>

                <button className="close-button" onClick={this.handleClose}>
                  Close
                </button>
              </div>
            )}
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
}

export default ManageBannerList;
