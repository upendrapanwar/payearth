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
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

class MyOrders extends Component {
  constructor(props) {
    super(props);
    const { dispatch } = props;
    this.dispatch = dispatch;
    this.authInfo = store.getState().auth.authInfo;
    this.userInfo = store.getState().auth.userInfo;
    this.state = {
      data: [],
      loading: true,
      error: null,
      show: false,
      showModal: false,
      showTrackingModal: false,
      downloading: false,
    };
  }

  componentDidMount() {
    this.getOrderDetails();
  }

  getOrderDetails = () => {
    axios.get("user/orderdetails", {
      params: {
        authorId: this.authInfo.id,
        status: false,
      },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization: `Bearer ${this.authInfo.token}`,
      },
    })
      .then((response) => {
        const data = response.data.data.data;
        this.setState({ data: data, loading: false });
      })
      .catch((error) => {
        if (error.response && error.response.data.status === false) {
          toast.error(error.response.data.message);
        }
      })
      .finally(() => {
        setTimeout(() => {
          this.setState({ loading: false });
        }, 300);
      });
  };

  handleDetailsClick = (row) => {
    this.setState({ selectedRowData: row });
    this.setState({ showModal: true });
  };

  viewTrackingDetails = (row) => {
    this.setState({ selectedRowData: row });
    this.setState({ showTrackingModal: true })
  }

  GenerateInvoice = (row) => {
    const userName = this.userInfo.name;
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const {
      orderCode,
      billingFirstName,
      billingLastName,
      billingCompanyName,
      billingStreetAddress,
      billingStreetAddress1,
      billingCity,
      billingCountry,
      billingPostCode,
      billingEmail,
      deliveryCharge,
      price,
      taxAmount,
      discount,
      total,
      sellerName,
      sellerAddress,
      sellerState,
      sellerCountry,
      sellerEmail,
      invoiceNo,
      orderDate,
    } = row;

    const itemRows = row.orderStatus.length > 0 ? row.orderStatus.map((item, index) =>
      `<tr>
        <td style="width: 50px;">${index + 1}</td>
        <td style="width: 70px;">${item.product.productId[0]?.name || 'No product name'}</td>
        <td style="width: 100px;">${item.product.quantity}</td>
        <td class="text-end" style="width: 70px;">$ ${item.product.price}</td>
        <td class="text-end" style="width: 70px;">$ ${item.product.price * item.product.quantity}</td>
      </tr>`
    )
      .join("")
      : `<tr>
        <td>Data is not available</td>
      </tr>`;

    const htmlData = `<div id="pdfContent"  style="padding:25px 50px;">
      <div class="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
        <div class="w-100">
          <h4 class="fw-bold my-2 text-dark">${userName}</h4>
          <h6 class="fw-bold text-secondary mb-1">
            Order Id: ${orderCode}
          </h6>
        </div>
      </div>
      <div class="p-4" style="font-size: 18px;">
      <div class="row mb-4">
            <div class="col-4">
                <div class="fw-bold">Billed to:</div>
                <div>${billingFirstName}${" "} ${billingLastName}</div>
                <div>${billingCompanyName}</div>
                <div>${billingStreetAddress}${", "} ${billingStreetAddress1}</div>
                <div>${billingCity}${", "} ${billingPostCode}</div>
                <div>${billingCountry}</div>
                <div>${billingEmail}</div>
              </div>
              <div class="col-4">
                <div class="fw-bold">Billed From:</div>
                <div>${"Pay Earth"}</div>
              </div>
              <div class="col-4">
                <div class="fw-bold mt-2">Date Of Issue:</div>
              <div>${new Date(row.paymentId.createdAt).toLocaleDateString('en-US', options)}</div>
                <div class="fw-bold mt-2">Invoice:</div>
                 <div>${row.paymentId.invoiceNo}</div>
              </div>
        </div>
      <table class="mb-0 table-responsive table">
        <thead>
          <tr>
            <th style="width: 50px;">S.NO</th>
            <th style="width: 70px;">DESCRIPTION</th>
            <th style="width: 100px;">QTY</th>
            <th class="text-end" style="width: 70px;">PRICE</th>
            <th class="text-end" style="width: 70px;">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
         ${itemRows}
        </tbody>
      </table>
      <table class="table">
        <tbody>
          <tr>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
            <td>&nbsp;</td>
          </tr>
          <tr class="text-end">
            <td></td>
            <td class="fw-bold" style="width: 100px;">SUBTOTAL</td>
            <td class="text-end" style="width: 100px;">$ ${price}</td>
          </tr>
          <tr class="text-end">
            <td></td>
            <td style="width: 200px">DELIVERY CHARGE</td>
            <td class="text-end" style="width: 100px;">$ ${deliveryCharge}</td>
          </tr>
          <tr class="text-end">
            <td></td>
            <td style="width: 100px">TAX</td>
            <td class="text-end" style="width: 100px;">$ ${taxAmount}</td>
          </tr>
          <tr class="text-end">
            <td></td>
            <td style="width: 100px">DISCOUNT</td>
            <td class="text-end" style="width: 100px;">$ ${discount}</td>
          </tr>
          <tr class="text-end">
            <td></td>
            <td class="fw-bold" style="width: 150px">TOTAL AMOUNT</td>
            <td class="text-end" style="width: 100px">$ ${total}</td>
          </tr>
        </tbody>
      </table>
      </div>
      <div class="bg-light py-3 px-4 rounded">
        Amount is charged as per the terms and conditions.
      </div>
    </div>`;
    const wrapper = document.createElement("div");
    wrapper.innerHTML = htmlData;

    document.body.appendChild(wrapper);

    this.setState({ downloading: true });

    html2canvas(wrapper).then((canvas) => {
      const imgData = canvas.toDataURL("image/png", 1.0);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "pt",
        format: [612, 792],
      });
      pdf.internal.scaleFactor = 1;
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("invoice.pdf");

      if (wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }

      this.setState({ downloading: false });
    });
  };

  data_column = [
    {
      name: "Order ID",
      selector: (row, i) => row.orderCode,
      sortable: true,
      width: "200px",
    },
    {
      name: "Invoice Number",
      selector: (row, i) => row.paymentId.invoiceNo,
      sortable: true,
      width: "200px",
    },
    // {
    //   name: "Payment Account",
    //   // selector: (row, i) => row.paymentAccount,
    //   sortable: true,
    //   width: "200px",
    // },
    {
      name: "Total Amount",
      selector: (row, i) => `$${row.price}`,
      sortable: true,
      width: "150px",
    },
    // {
    //   name: "Order Status",
    //   selector: (row, i) => row.paymentId.paymentStatus === "paid" ? "processing" : "",
    //   sortable: true,
    //   width: "200px",
    // },
    {
      name: "Order Date",
      // selector: (row, i) => row.createdAt,
      sortable: true,

      cell: (row) => {
        const date = new Date(row.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        return <div>{date}</div>;
      },
    },
    {
      name: "Order Details",
      cell: (row) => (
        <>
          <button
            onClick={() => this.handleDetailsClick(row)}
            className="btn custom_btn btn_yellow_bordered"
          >
            Details
          </button>
        </>
      ),
    },
    {
      name: "Download Invoice",
      cell: (row) => (
        <>
          <button
            onClick={() => this.GenerateInvoice(row)}
            className="btn custom_btn btn_yellow_bordered"
          >
            Download
          </button>
        </>
      ),
    },
    {
      cell: (row) => (
        <>
          <button
            onClick={() => this.viewTrackingDetails(row)}
            className="btn custom_btn btn_yellow_bordered"
          >
            View Tracking
          </button>
        </>
      ),
    },
  ];

  render() {
    const { data, loading, error, selectedRowData, downloading } = this.state;

    const userName = this.userInfo.name;
    const steps = [
      'Order Placed',
      'Processing',
      'Delivered',
    ];
    return (
      <React.Fragment>
        {loading === true ? <SpinnerLoader /> : ""}
        {downloading === true ? <SpinnerLoader /> : ""}
        <Header />
        <PageTitle title="My Orders" />
        <section className="inr_wrap orders_page">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="cart wishlist">
                  <div className="cart_wrap">
                    {/* <div className="items_incart">
                      <span className="text-uppercase">
                        {data.length} ORDER FOUND
                      </span>
                    </div> */}
                    <div className="items_incart d-flex justify-content-between align-items-center">
                      <span className="text-uppercase">
                        {data.length} ORDER FOUND
                      </span>
                      <button
                        type="button"
                        className="btn custom_btn btn_yellow"
                        onClick={() => window.history.back()}
                      >
                        Back
                      </button>
                    </div>
                  </div>
                  <div className="cart_list cart_wrap pb-5">
                    <DataTableExtensions
                      columns={this.data_column}
                      data={data}
                    >
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
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Order Details
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}
          >
            {selectedRowData && (
              <div>
                <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
                  <div className="w-100">
                    <h4 className="fw-bold my-2 text-dark">{userName}</h4>
                    <h6 className="fw-bold text-secondary mb-1">
                      Order Id : {selectedRowData.orderCode || ""}
                    </h6>
                  </div>
                </div>
                <div className="p-4 cart-mob-p0">
                  <Row className="mb-4">
                    <Col md={4}>
                      <div className="fw-bold">Billed to:</div>
                      <div>
                        {selectedRowData.billingFirstName || ""}{" "}
                        {selectedRowData.billingLastName || ""}
                      </div>
                      <div>{selectedRowData.billingCompanyName || ""}</div>
                      <div>
                        {selectedRowData.billingStreetAddress || ""}
                        {", "}
                        {selectedRowData.billingStreetAddress1 || ""}
                      </div>
                      <div>
                        {selectedRowData.billingCity || ""}
                        {", "}
                        {selectedRowData.billingPostCode || ""}
                      </div>
                      <div>{selectedRowData.billingCountry || ""}</div>
                      <div>{selectedRowData.billingEmail || ""}</div>
                    </Col>
                    <Col md={4}>
                      <div className="fw-bold">Billed From:</div>
                      <div>{'Pay Earth'}</div>
                    </Col>
                    <Col md={4}>
                      <div className="fw-bold mt-2">Date Of Issue:</div>
                      <div>{new Date(selectedRowData.paymentId.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) || ""}</div>
                      <div className="fw-bold mt-2">Invoice:</div>
                      <div>{selectedRowData.paymentId.invoiceNo || ""}</div>
                    </Col>
                  </Row>
                  <Table className="mb-0 table-responsive">
                    <thead>
                      <tr>
                        <th style={{ width: "50px" }}>S.NO</th>
                        <th style={{ width: "70px" }}>DESCRIPTION</th>
                        <th style={{ width: "100px" }}>QTY</th>
                        <th className="text-end" style={{ width: "70px" }}>
                          PRICE
                        </th>
                        <th className="text-end" style={{ width: "70px" }}>
                          AMOUNT
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedRowData.orderStatus.length > 0 ? (
                        selectedRowData.orderStatus.map((item, i) => {
                          return (
                            <tr id={i} key={i}>
                              <td style={{ width: "50px" }}>{i + 1}</td>
                              <td style={{ width: "70px" }}>
                                {item.product.productId[0]?.name || 'No product name'}
                              </td>
                              <td style={{ width: "100px" }}>
                                {item.product.quantity}
                              </td>
                              <td className="text-end" style={{ width: "70px" }}>
                                $ {item.product.price}
                              </td>
                              <td
                                className="text-end"
                                style={{ width: "70px" }}
                              >
                                $ {item.product.price * item.product.quantity}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td>Data is not available</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                  <Table>
                    <tbody>
                      <tr>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                        <td>&nbsp;</td>
                      </tr>
                      <tr className="text-end">
                        <td></td>
                        <td className="fw-bold" style={{ width: "100px" }}>
                          SUBTOTAL
                        </td>
                        <td className="text-end" style={{ width: "100px" }}>
                          $ {selectedRowData.price}
                        </td>
                      </tr>
                      <tr className="text-end">
                        <td></td>
                        <td style={{ width: "200px" }}>DELIVERY CHARGE</td>
                        <td className="text-end" style={{ width: "100px" }}>
                          $ {selectedRowData.deliveryCharge}
                        </td>
                      </tr>
                      <tr className="text-end">
                        <td></td>
                        <td style={{ width: "100px" }}>TAX</td>
                        <td className="text-end" style={{ width: "100px" }}>
                          $ {selectedRowData.taxAmount}
                        </td>
                      </tr>
                      <tr className="text-end">
                        <td></td>
                        <td style={{ width: "100px" }}>DISCOUNT</td>
                        <td className="text-end" style={{ width: "100px" }}>
                          $ {selectedRowData.discount}
                        </td>
                      </tr>
                      <tr className="text-end">
                        <td></td>
                        <td className="fw-bold" style={{ width: "150px" }}>
                          TOTAL AMOUNT
                        </td>
                        <td className="text-end" style={{ width: "100px" }}>
                          $ {selectedRowData.total}
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                  <div className="bg-light py-3 px-4 rounded text-center">
                    Amount is charged as per the terms and conditions.
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>

        {/* Tracking */}
        <Modal
          show={this.state.showTrackingModal}
          onHide={() => this.setState({ showTrackingModal: false })}
          dialogClassName="modal-90w"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title id="example-custom-modal-styling-title">
              Order Tracking
            </Modal.Title>
          </Modal.Header>
          <Modal.Body
            style={{ maxHeight: "calc(100vh - 100px)", overflowY: "auto" }}
          >
            {selectedRowData && (
              <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
                <div className="w-100">
                  <h3 className="fw-bold my-2 text-bold text-center">{`Thank you for your order #${selectedRowData.orderCode}`}</h3>
                  <div className="p-4 cart-mob-p0">
                    <Row className="mb-4">
                      <Col md={6}>
                        <div className="fw-bold">Billed to:</div>
                        <div>
                          {selectedRowData.billingFirstName || ""}{" "}
                          {selectedRowData.billingLastName || ""}
                        </div>
                        <div>{selectedRowData.billingCompanyName || ""}</div>
                        <div>
                          {selectedRowData.billingStreetAddress || ""}
                          {", "}
                          {selectedRowData.billingStreetAddress1 || ""}
                        </div>
                        <div>
                          {selectedRowData.billingCity || ""}
                          {", "}
                          {selectedRowData.billingPostCode || ""}
                        </div>
                        <div>{selectedRowData.billingCountry || ""}</div>
                        <div>{selectedRowData.billingEmail || ""}</div>
                      </Col>
                      <Col md={6}>
                        <div className="fw-bold">Billed From:</div>
                        <div>{'Pay Earth'}</div>
                      </Col>
                    </Row>
                    <Table className="mb-0 table-responsive">
                      <thead>
                        <tr>
                          <th style={{ width: "70px" }}>Items</th>
                          <th className="text-center" style={{ width: "100px" }}>Qty</th>
                          <th className="text-center" style={{ width: "50px" }}>
                            {/* Status */}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedRowData.orderStatus.length > 0 ? (
                          selectedRowData.orderStatus.map((item, i) => {
                            return (
                              <tr id={i} key={i} className="m-5">
                                <td style={{ width: "70px" }}>
                                  ➢ {item.product.productId[0]?.name || 'No product name'}
                                </td>
                                <td className="text-center" style={{ width: "100px" }}>
                                  {item.product.quantity}
                                </td>
                                {/* <td className="text-center" style={{ width: "70px" }} >
                                  <span className="badge rounded-pill text-bg-success">{item.title}</span>
                                </td> */}
                                <Box sx={{ width: '100%' }}>
                                  <Stepper activeStep={item.title === "Order placed" ? 0 :
                                    item.title === "Processing" ? 1 :
                                      item.title === "Delivered" ? 4 :
                                        2} alternativeLabel>
                                    {steps.map((label) => (
                                      <Step key={label}>
                                        <StepLabel>{label}</StepLabel>
                                      </Step>
                                    ))}
                                  </Stepper>
                                </Box>

                              </tr>
                            );
                          })
                        ) : (
                          <tr>
                            <td>Data is not available</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                    <div className="bg-light py-3 px-4 mt-5 rounded text-center">
                      Amount is charged as per the terms and conditions.
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

export default connect(setLoading)(MyOrders);
