import React, { Component } from "react";
import axios from "axios";
import SpinnerLoader from "../../components/common/SpinnerLoader";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import Header from "../../components/admin/common/Header";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import store from "../../store";
import arrow_back from "./../../assets/icons/arrow-back.svg";
import emptyImg from "./../../assets/images/emptyimage.png";
import { Link } from "react-router-dom/cjs/react-router-dom";
import Switch from "react-input-switch";
//import { Switch } from 'react-switch';
// import { Modal } from "react-bootstrap";
import { Modal, Button } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";

class ManageDeals extends Component {
  constructor(props) {
    super(props);
    this.authInfo = store.getState().auth.authInfo;
    this.cloudName = process.env.REACT_APP_CLOUD_NAME;
    this.apiKey = process.env.REACT_APP_CLOUD_API_KEY;
    this.apiSecret = process.env.REACT_APP_CLOUD_API_SECRET;
    this.state = {
      emptyImg: emptyImg,
      data: "",
      selectedBrand: null,
      showModal: false,
      selectedDeal: null,
      dealDetailsData: "",

      permissions: {
        add: false,
        edit: false,
        delete: false,
      },
    };

    this.deals_column = [
      {
        name: "Deal Logo",
        selector: (row, i) => (
          <img
            src={row.dealImage}
            alt="Not selected"
            style={{ width: "80px", height: "80px" }}
          />
        ),
        sortable: true,
      },
      {
        name: "Deal Name",
        selector: (row, i) => row.dealName,
        sortable: true,
      },

      {
        name: "Deal Discount (%)",
        selector: (row, i) => `${row.discount} %`,
        sortable: true,
      },

      {
        name: "Seller Details",
        selector: (row, i) => (
          <>
            <p>{row.sellerId.name}</p>
            <p>{row.sellerId.email}</p>
          </>
        ),
        sortable: true,
      },
      {
        name: "Status",
        cell: (row, i) => {
          return (
            <>
              {row.isActive ? (
                <button
                  className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                  onClick={() => this.handleChangeStatus(row, false)}
                >
                  Deactivate
                </button>
              ) : (
                <button
                  className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                  onClick={() => this.handleChangeStatus(row, true)}
                >
                  Activate
                </button>
              )}
            </>
          );
        },
      },

      {
        name: "Action",
        cell: (row, i) => {
          return (
            <button
              className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
              onClick={() => this.handleShowModal(row)}
            >
              Details
            </button>
          );
        },
      },
    ];
  }

  componentDidMount() {
    console.log("Component has mounted");
    this.getAllDealsDisplayed();
  }

  handleShowModal = async (deal) => {
    console.log("handleShowModal", deal);
    const dealId = deal.id;
    // console.log("dealId", dealId);
    await this.getDealsById(dealId);

    this.setState({
      showModal: true,
      selectedDeal: deal,
    });
  };

  getDealsById = async (id) => {
    console.log("getDealsById-----", id);
    this.setState({ loading: true });
    try {
      const url = `admin/getDealsById/${id}`;
      const response = await axios.get(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${this.authInfo.token}`,
        },
      });
      console.log("responsTEST", response);
      this.setState({ dealDetailsData: response.data.data, loading: false });
    } catch (error) {
      console.error(
        "There was an error fetching service list category data",
        error
      );
      this.setState({ loading: false });
    }
  };
  handleCloseModal = () => {
    this.setState({
      showModal: false,
    });
  };
  //********************************************************* */
  // getAllDeals
  getAllDealsDisplayed = async () => {
    console.log("display");
    this.setState({ loading: true });
    try {
      const url = "/admin/deals";
      const response = await axios.get(url, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${this.authInfo.token}`,
        },
      });
      console.log("respons----", response);
      this.setState({ data: response.data.data, loading: false });
    } catch (error) {
      console.error(
        "There was an error fetching service list category data",
        error
      );
      this.setState({ loading: false });
    }
  };

  getBrandPermission = async () => {
    const admin_Id = this.authInfo.id;
    try {
      const res = await axios.get(`admin/getBrandPermission/${admin_Id}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${this.authInfo.token}`,
        },
      });
      if (res.data.status === true && res.data.data) {
        this.setState({ permissions: res.data.data }, () => {
          console.log("Checking Response permission", this.state.permissions);
        });
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.error("Error fetching data: ", error);
    }
  };

  handleChangeStatus = async (row, isActive) => {
    try {
      const updateStatusUrl = `/admin/deals/status/${row.id}`;
      await axios.put(
        updateStatusUrl,
        { isActive },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
            Authorization: `Bearer ${this.authInfo.token}`,
          },
        }
      );
    } catch (error) {
      console.error("There was an error changing the status", error);
    }
  };

  render() {
    const { data, dealDetailsData } = this.state;
    return (
      <React.Fragment>
        <div className="seller_dash_wrap pb-5">
          <div className="container">
            <Header />
            <div className="inr_top_page_title">
              <h2>Manage Deals</h2>
            </div>
            <Helmet>
              <title>{"Manage Deals - Pay Earth"}</title>
            </Helmet>
            <div className="row">
              <div className="col-lg-12">
                <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
                  <div className="cp_top">
                    <div className="cumm_title">Manage Deals</div>
                  </div>
                  <div className="cp_body">
                    <DataTableExtensions
                      columns={this.deals_column}
                      data={data}
                    >
                      <DataTable
                        pagination
                        noHeader
                        highlightOnHover
                        defaultSortField="id"
                        defaultSortAsc={false}
                        paginationPerPage={7}
                        paginationRowsPerPageOptions={[7, 14, 21, 60]}
                      />
                    </DataTableExtensions>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Modal */}

        <Modal
          show={this.state.showModal}
          onHide={this.handleCloseModal}
          dialogClassName="modal-90w"
        >
          <Modal.Header closeButton>
            <Modal.Title>Deal Details</Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{
              // maxWidth: "80%",
              // width: "80%",
              maxHeight: "calc(100vh - 100px)",
              overflowY: "auto",
            }}
          >
            {/* ***************************** image logo ************************** */}
            <img
              src={dealDetailsData.dealImage}
              alt="Deal Logo"
              style={{ width: "20%", height: "auto" }}
            />

            {dealDetailsData && (
              <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
                <div className="w-100">
                  {/* <h3 className="fw-bold my-2 text-bold text-center">{`Thank you for your order #${dealDetailsData.orderCode}`}</h3> */}
                  <div className="p-4 cart-mob-p0">
                    <Row className="mb-4">
                      <Col md={12}>
                        <div>
                          <h5>{dealDetailsData.dealName}</h5>
                          <p>
                            <strong>Seller ID:</strong>{" "}
                            {dealDetailsData.sellerId}
                          </p>
                          {/* <img
                            src={dealDetailsData.dealImage}
                            alt="Deal Logo"
                            style={{ width: "100%", height: "auto" }}
                          /> */}
                        </div>
                      </Col>
                      <Row>
                        <Col md={12} style={{ width: "100%", height: "500px" }}>
                          <Table
                            className="mb-6 table-responsive"
                            style={{
                              width: "110%",
                              height: "100%",
                              tableLayout: "fixed",
                            }}
                          >
                            <thead>
                              <tr>
                                <th style={{ width: "120px" }}>Image</th>
                                <th>Product Name</th>
                                <th>Quantity</th>
                                <th>Price</th>
                              </tr>
                            </thead>
                            <tbody>
                              {dealDetailsData.productId.length > 0 ? (
                                dealDetailsData.productId.map((item, i) => {
                                  console.log("item", item);
                                  return (
                                    <tr key={i}>
                                      <td>
                                        <img
                                          src={
                                            item.featuredImage ||
                                            "default-image.png"
                                          }
                                          alt="Product"
                                          style={{
                                            width: "80px",
                                            height: "auto",
                                          }}
                                        />
                                      </td>
                                      <td>
                                        ➢ {item.name || "No product name"}
                                      </td>

                                      <td>
                                        ➢{" "}
                                        {item.sellingQuantity ||
                                          "No selling quantity available"}
                                      </td>
                                      <td>
                                        $ {item.price || "No price available"}
                                      </td>
                                    </tr>
                                  );
                                })
                              ) : (
                                <tr>
                                  <td colSpan="4" className="text-center">
                                    Data is not available
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </Table>
                          <div className="text-muted mt-3">
                            Amount is charged as per the terms and conditions.
                          </div>
                        </Col>
                      </Row>
                    </Row>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );

    //);
  }
}
export default ManageDeals;
