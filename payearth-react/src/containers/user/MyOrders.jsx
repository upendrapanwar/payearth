import React, { Component } from "react";
import Header from "./../../components/user/common/Header";
import PageTitle from "./../../components/user/common/PageTitle";
import Footer from "./../../components/common/Footer";
import store from "./../../store/index";
import axios from "axios";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import { setLoading } from "./../../store/reducers/global-reducer";
import SpinnerLoader from "./../../components/common/SpinnerLoader";
import DataTable from "react-data-table-component";
import SortIcon from "@material-ui/icons/ArrowDownward";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
// import jsPDF from "jspdf";
import Modal from "react-bootstrap/Modal";

class MyOrders extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    this.dispatch = dispatch;
    this.authInfo = store.getState().auth.authInfo;
    this.state = {
      data: [],
      loading: true,
      error: null,
      show: false,
    };
  }

  addDays = (date, days) => {
    let result = new Date(date);
    result.setDate(result.getDate() + 7);
    return result;
  };

  componentDidMount() {
    this.getOrderDetails();
  }

  getOrderDetails = () => {
    this.dispatch(setLoading({ loading: true }));
    console.log(this.authInfo.id);
    axios
      .get("user/orderdetails/" + this.authInfo.id, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${this.authInfo.token}`,
        },
      })
      .then((response) => {
        console.log("RES", response.data.data);
        // if (response.data.status) {
        const formattedData = response.data.data.map((item) => {
          const date = new Date(item.createdAt).toLocaleString();
          const deliveryDate = this.addDays(
            new Date(item.createdAt),
            7
          ).toLocaleString();

          return {
            _id: item._id,
            quantity: item.quantity[0],
            orderCode: item.orderId[0].orderCode,
            price: item.price,
            productName: item.productId[0].name,
            orderStatus: item.orderId[0].orderStatus.orderStatusId.title,
            createdAt: date,
            deliveryDate: deliveryDate,
            id: item.id,
            billingCompanyName: item.orderId[0].billingCompanyName,
            billingCounty: item.orderId[0].billingCounty,
            billingStreetAddress: item.orderId[0].billingStreetAddress,
            billingStreetAddress1: item.orderId[0].billingStreetAddress1,
            billingCity: item.orderId[0].billingCity,
            billingPostCode: item.orderId[0].billingPhone,
            billingEmail: item.orderId[0].billingEmail,
            deliveryCharge: item.orderId[0].deliveryCharge,
            taxAmount: item.orderId[0].taxAmount,
            discount: item.orderId[0].discount,
          };
        });
        this.setState({
          data: formattedData,
          loading: false,
          error: null,
        });
        console.log("RESPONSE", formattedData);
        // }
      })
      .catch((error) => {
        if (error.response && error.response.data.status === false) {
          toast.error(error.response.data.message);
          this.setState({
            data: [],
            loading: false,
            error: error,
            lgShow: false,
            selectedRowData: null,
          });
        }
      })
      .finally(() => {
        setTimeout(() => {
          this.dispatch(setLoading({ loading: false }));
        }, 300);
        console.log("RESPONSE***********");
      });
  };

  handleDetailsClick = (row) => {
    this.setState({ selectedRowData: row });
    this.setState({ show: true });
  };

  data_column = [
    {
      name: "Order Code",
      selector: (row, i) => row.orderCode,
      sortable: true,
      width: "200px",
    },
    {
      name: "Product Name",
      selector: (row, i) => row.productName,
      sortable: true,
      width: "200px",
    },
    {
      name: "Order Status",
      selector: (row, i) => row.orderStatus,
      sortable: true,
      width: "200px",
    },
    {
      name: "Quantity",
      selector: (row, i) => row.quantity,
      sortable: true,
      width: "200px",
    },
    {
      name: "Price",
      selector: (row, i) => row.price,
      sortable: true,
      width: "200px",
    },
    {
      name: "Seller Company Name",
      selector: (row, i) => row.billingCompanyName,
      sortable: true,
      width: "200px",
    },
    {
      name: "Date & Time",
      selector: (row, i) => row.createdAt,
      sortable: true,

      cell: (row) => {
        const date = row.createdAt;
        return <div>{date}</div>;
      },
    },
    {
      name: "Order Details",
      cell: (row) => (
        <>
          <button
            onClick={() => this.handleDetailsClick(row)}
            className="btn custom_btn custom_btn_order btn_yellow_bordered"
          >
            Details
          </button>
        </>
      ),
    },
  ];


  render() {
    const { data, loading, error, selectedRowData } = this.state;
    console.log("Render RESPONSE", data);
    console.log(data.orderCode);
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
        <PageTitle title="My Orders" />
        <section className="inr_wrap orders_page">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="cart wishlist">
                  <div className="cart_wrap">
                    <div className="items_incart">
                      <span className="text-uppercase">
                        {data.length} ITEMS IN YOUR ORDER
                      </span>
                    </div>
                  </div>
                  <div className="cart_list cart_wrap pb-5">
                    <DataTableExtensions columns={this.data_column} data={data}>
                      <DataTable
                        pagination
                        noHeader
                        highlightOnHover
                        defaultSortField="id"
                        sortIcon={<SortIcon />}
                        defaultSortAsc={true}
                        onSelectedRowsChange={this.handleRowSelected}
                      />
                    </DataTableExtensions>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />

        {/* Modal functionality Added */}
        <Modal
          show={this.state.show}
          onHide={() => this.setState({ show: false })}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Order Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-light">
            {selectedRowData && (
              <div className="container ">
                <div className="row">
                  <div className="col-lg-6">
                    <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
                      <div className="cp_top">
                        <div className="cumm_title">
                          Order Id: {selectedRowData.orderCode}
                        </div>
                        <br />
                        <p>Order placed on</p>
                        <div className="cumm_title">
                          {selectedRowData.createdAt}
                        </div>
                        <br />
                        {/* <p className="fs-4 text-success">Out for Delivery</p> */}
                        {/* <p>Your package is on the way</p> */}
                      </div>
                      <br />
                      <br />
                      <div className="cp_body">
                        <div className="row">
                          <div className="col-lg-6">
                            <p>
                              <b>Shipping Address</b>
                            </p>

                            <p>{selectedRowData.billingCompanyName}</p>
                            <p>
                              {selectedRowData.billingStreetAddress}{" "}
                              {selectedRowData.billingStreetAddress1}
                            </p>
                            <p>{selectedRowData.billingCity}</p>
                            <p>{selectedRowData.billingPostCode}</p>
                            <p>{selectedRowData.billingEmail}</p>
                          </div>
                          <div className="col-lg-6">
                            <p>
                              <b>Delivery Method</b>
                            </p>
                            <p>Standard (5-7 Bussiness Days)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
                      <div className="cp_top">
                        <div className="cumm_title">Order Summery</div>
                      </div>
                      <br />

                      <div className="cp_body">
                        {selectedRowData && (
                          <div className="row bg-danger rounded bg-opacity-10">
                            <div className="col-lg-8 mt-2">
                              <p>
                                <b>{selectedRowData.productName}</b>
                              </p>
                              <p>Quantity: {selectedRowData.quantity}</p>
                            </div>
                            <div className="col-lg-4 mt-4">
                              $ {selectedRowData.price}
                            </div>
                          </div>
                        )}

                        <hr />
                        <div className="row">
                          <div className="col-lg-8">
                            <p>Subtotal</p>
                          </div>
                          <div className="col-lg-4">$ {selectedRowData.price}</div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-lg-8">
                            <p>Shipping Fee</p>
                          </div>
                          <div className="col-lg-4">Free</div>
                        </div>
                        <div className="row">
                          <div className="col-lg-8">
                            <p>Discount</p>
                          </div>
                          <div className="col-lg-4">
                            $ {selectedRowData.discount}
                          </div>
                        </div>
                        <div className="row">
                          <div className="col-lg-8">
                            <p>Taxes</p>
                          </div>
                          <div className="col-lg-4">
                            $ {selectedRowData.taxAmount}
                          </div>
                        </div>
                        <hr />
                        <div className="row">
                          <div className="col-lg-8">
                            <p>
                              <b>Total</b>
                            </p>
                          </div>
                          <div className="col-lg-4">
                            $ <b>{selectedRowData.price}</b>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            ;
          </Modal.Body>
        </Modal>
      </React.Fragment>
    );
  }
}

export default connect(setLoading)(MyOrders);
