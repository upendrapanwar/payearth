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
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

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
      downloading: false,
    };
  }

  
  componentDidMount() {
    this.getOrderDetails();
  }

  getOrderDetails = () => {
    this.dispatch(setLoading({ loading: true }));
    console.log(this.authInfo.id)
    console.log(this.userInfo.name)
    axios.get("user/orderdetails/" + this.authInfo.id, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          "Authorization": `Bearer ${this.authInfo.token}`,
        },
      })
      .then((response) => {
        console.log("RES",response.data.data.data)
        console.log("ORDER status",response.data.data.data[0].order.orderStatus)
        
        // Check if the response contains data
        if (response.data.data.data) {
          const formattedData = response.data.data.data.map((item) => {
            const date = new Date(item.order.createdAt).toLocaleDateString();
  
            // Create an object to hold the formatted data
            const formattedItem = {
              _id: item.order._id,
              orderDate: date,
              id: item.order.id,
              orderDetails: item.orderDetails
              
            };
            // Check if orderId exists and has valid data
            if (item.order.id) {
              formattedItem.orderCode = item.order.orderCode;
              formattedItem.billingFirstName = item.order.billingFirstName;
              formattedItem.billingLastName = item.order.billingLastName;
              formattedItem.billingCompanyName = item.order.billingCompanyName;
              formattedItem.billingStreetAddress = item.order.billingStreetAddress;
              formattedItem.billingStreetAddress1 = item.order.billingStreetAddress1;
              formattedItem.billingCity = item.order.billingCity;
              formattedItem.billingCountry = item.order.billingCountry;
              formattedItem.billingPostCode = item.order.billingPostCode;
              formattedItem.billingPhone = item.order.billingPhone;
              formattedItem.billingEmail = item.order.billingEmail;
              formattedItem.deliveryCharge = item.order.deliveryCharge.toFixed(2);
              formattedItem.price = item.order.price.toFixed(2);
              formattedItem.taxAmount = item.order.taxAmount.toFixed(2);
              formattedItem.discount = item.order.discount.toFixed(2);
              formattedItem.total = item.order.total.toFixed(2);

              if (item.orderDetails && item.orderDetails.length > 0) {
                const firstOrderDetail = item.orderDetails[0];
                formattedItem.sellerAddress = firstOrderDetail.sellerId.full_address.address;
                formattedItem.sellerState = firstOrderDetail.sellerId.full_address.state;
                formattedItem.sellerCountry = firstOrderDetail.sellerId.full_address.country;
                formattedItem.sellerName = firstOrderDetail.sellerId.name;
                formattedItem.sellerPhone = firstOrderDetail.sellerId.phone;
                formattedItem.sellerEmail = firstOrderDetail.sellerId.email;
              } else {
                // Handle the case where there is no orderDetails or it's an empty array
                formattedItem.sellerAddress = "N/A";
                formattedItem.sellerState = "N/A";
                formattedItem.sellerCountry = "N/A";
                formattedItem.sellerName = "N/A";
                formattedItem.sellerPhone = "N/A";
                formattedItem.sellerEmail = "N/A";
              }

              formattedItem.invoiceNo = item.order.paymentId.invoiceNo;
              formattedItem.paymentAccount = item.order.paymentId.paymentAccount;
              formattedItem.paymentMode = item.order.paymentId.paymentMode;

              if (item.order.orderStatus) {
                formattedItem.orderStatus = item.order.orderStatus.title;
              } else {
                formattedItem.orderStatus = "N/A";
              }

            } else {
              // Handle missing orderId data
              formattedItem.orderCode = "N/A";
              formattedItem.billingFirstName = "N/A";
              formattedItem.billingLastName = "N/A";
              formattedItem.billingCompanyName = "N/A";
              formattedItem.billingStreetAddress = "N/A";
              formattedItem.billingStreetAddress1 = "N/A";
              formattedItem.billingCity = "N/A";
              formattedItem.billingCountry = "N/A";
              formattedItem.billingPostCode = "N/A";
              formattedItem.billingPhone = "N/A";
              formattedItem.billingEmail = "N/A";
              formattedItem.price = "N/A";
              formattedItem.deliveryCharge = "N/A";
              formattedItem.taxAmount = "N/A";
              formattedItem.discount = "N/A";
              formattedItem.total = "N/A";
              formattedItem.invoiceNo = "N/A";
              formattedItem.paymentAccount = "N/A";
              formattedItem.paymentMode = "N/A";
              formattedItem.orderStatus = "N/A";
            }
            return formattedItem;
          });
  
          this.setState({
            data: formattedData,
            loading: false,
            error: null,
          });
        } else {
          // Handle the case where there is no data
          this.setState({
            data: [],
            loading: false,
            error: null,
          });
        };
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
            selectedRowDataPDF: null,
          });
        }
      })
      .finally(() => {
        setTimeout(() => {
          this.dispatch(setLoading({ loading: false }));
        }, 300);
      });
      console.log("RESPONSE", this.state.data)
  };


  handleDetailsClick = (row) => {
    this.setState({ selectedRowData: row });
    this.setState({ showModal: true });
  };


  GenerateInvoice = (row) => {
    const userName = this.userInfo.name
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

    const itemRows = row.orderDetails.length > 0 ?
                     row.orderDetails.map(
      (item, index) => `
      <tr>
        <td style="width: 50px;">${index + 1}</td>
        <td style="width: 70px;">${item.productId[0].name}</td>
        <td style="width: 100px;">${item.quantity[0]}</td>
        <td class="text-end" style="width: 70px;">$ ${item.price.toFixed(2)}</td>
        <td class="text-end" style="width: 70px;">$ ${(item.price * item.quantity[0]).toFixed(2)}</td>
      </tr>`
    ).join('')
    : `<tr>
        <td>Data is not available</td>
      </tr>`

      const htmlData = `<div id="pdfContent"  style="padding:25px 50px;">
      <div class="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
        <div class="w-100">
          <h4 class="fw-bold my-2">${userName}</h4>
          <h6 class="fw-bold text-secondary mb-1">
            Order Id: ${orderCode}
          </h6>
        </div>
      </div>
      <div class="p-4" style="font-size: 18px;">
      <div class="row mb-4">
            <div class="col-4">
                <div class="fw-bold">Billed to:</div>
                <div>${billingFirstName}${' '} ${billingLastName}</div>
                <div>${billingCompanyName}</div>
                <div>${billingStreetAddress}${', '} ${billingStreetAddress1}</div>
                <div>${billingCity}${', '} ${billingPostCode}</div>
                <div>${billingCountry}</div>
                <div>${billingEmail}</div>
              </div>
              <div class="col-4">
                <div class="fw-bold">Billed From:</div>
                <div>${sellerName}</div>
                <div>${sellerAddress}</div>
                <div>${sellerState}${', '} ${sellerCountry}</div>
                <div>${sellerEmail}</div>
              </div>
              <div class="col-4">
                <div class="fw-bold mt-2">Date Of Issue:</div>
                <div>${orderDate}</div>
                <div class="fw-bold mt-2">Invoice:</div>
                <div>${invoiceNo}</div>
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
    </div>`
      const wrapper = document.createElement("div");
      wrapper.innerHTML = htmlData;

      document.body.appendChild(wrapper);

      this.setState({ downloading: true });

      html2canvas(wrapper).then((canvas) => {
        const imgData = canvas.toDataURL('image/png', 1.0);
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: [612, 792]
        });
        pdf.internal.scaleFactor = 1;
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('invoice.pdf');

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
      selector: (row, i) => row.invoiceNo,
      sortable: true,
      width: "200px",
    },
    {
      name: "Payment Account",
      selector: (row, i) => row.paymentAccount,
      sortable: true,
      width: "200px",
    },
    {
      name: "Total Amount",
      selector: (row, i) => row.total,
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
      name: "Order Date",
      selector: (row, i) => row.orderDate,
      sortable: true,

      cell: (row) => {
        const date = row.orderDate;
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
  ];

  
  render() {
    const { data, loading, error, selectedRowData, downloading } = this.state;
    const userName = this.userInfo.name;
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
        {downloading === true ? <SpinnerLoader /> : ""}
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
          <Modal.Body style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            {selectedRowData && (
              <div>
              <div className="d-flex flex-row justify-content-between align-items-start bg-light w-100 p-4">
                <div className="w-100">
                  <h4 className="fw-bold my-2">{userName}</h4>
                  <h6 className="fw-bold text-secondary mb-1">
                    Order Id : {selectedRowData.orderCode || ''}
                  </h6>
                </div>
              </div>
              <div className="p-4 cart-mob-p0">
                <Row className="mb-4">
                  <Col md={4}>
                    <div className="fw-bold">Billed to:</div>
                    <div>{selectedRowData.billingFirstName || ''}{' '}{selectedRowData.billingLastName || ''}</div>
                    <div>{selectedRowData.billingCompanyName || ''}</div>
                    <div>{selectedRowData.billingStreetAddress || ''}{', '}{selectedRowData.billingStreetAddress1 || ''}</div>
                    <div>{selectedRowData.billingCity || ''}{', '}{selectedRowData.billingPostCode || ''}</div>
                    <div>{selectedRowData.billingCountry || ''}</div>
                    <div>{selectedRowData.billingEmail || ''}</div>
                  </Col>
                  <Col md={4}>
                    <div className="fw-bold">Billed From:</div>
                    <div>{selectedRowData.sellerName || ''}</div>
                    <div>{selectedRowData.sellerAddress || ''}</div>
                    <div>{selectedRowData.sellerState || ''}{', '}{selectedRowData.sellerCountry || ''}</div>
                    <div>{selectedRowData.sellerEmail || ''}</div>
                  </Col>
                  <Col md={4}>
                    <div className="fw-bold mt-2">Date Of Issue:</div>
                    <div>{selectedRowData.orderDate || ''}</div>
                    <div className="fw-bold mt-2">Invoice:</div>
                    <div>{selectedRowData.invoiceNo || ''}</div>
                  </Col>
                </Row>
                <Table className="mb-0 table-responsive">
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>S.NO</th>
                      <th style={{ width: '70px' }}>DESCRIPTION</th>
                      <th style={{ width: '100px' }}>QTY</th>
                      <th className="text-end" style={{ width: '70px' }}>PRICE</th>
                      <th className="text-end" style={{ width: '70px' }}>AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRowData.orderDetails.length > 0 ?
                    selectedRowData.orderDetails.map((item, i) => {
                      return (
                        <tr id={i} key={i}>
                          <td style={{ width: '50px' }}>{i+1}</td>
                          <td style={{ width: '70px' }}>
                            {item.productId[0].name}
                          </td>
                          <td style={{ width: '100px' }}>
                            {item.quantity[0]}
                          </td>
                          <td className="text-end" style={{ width: '70px' }}>$ {item.price}</td>
                          <td className="text-end" style={{ width: '70px' }}>$ {item.price * item.quantity[0]}</td>
                        </tr>
                      );
                      })
                      : <tr>
                        <td>Data is not available</td>
                        </tr>
                    }
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
                      <td className="fw-bold" style={{ width: '100px' }}>SUBTOTAL</td>
                      <td className="text-end" style={{ width: '100px' }}>$ {selectedRowData.price}</td>
                    </tr>
                      <tr className="text-end">
                        <td></td>
                        <td  style={{ width: '200px' }}>DELIVERY CHARGE</td>
                        <td className="text-end" style={{ width: '100px' }}>$ {selectedRowData.deliveryCharge}</td>
                      </tr>
                      <tr className="text-end">
                        <td></td>
                        <td  style={{ width: '100px' }}>TAX</td>
                        <td className="text-end" style={{ width: '100px' }}>$ {selectedRowData.taxAmount}</td>
                      </tr>
                      <tr className="text-end">
                        <td></td>
                        <td  style={{ width: '100px' }}>DISCOUNT</td>
                        <td className="text-end" style={{ width: '100px' }}>$ {selectedRowData.discount}</td>
                      </tr>
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{ width: '150px' }}>TOTAL AMOUNT</td>
                      <td className="text-end" style={{ width: '100px' }}>$ {selectedRowData.total}</td>
                    </tr>
                  </tbody>
                </Table>
                  <div className="bg-light py-3 px-4 rounded">
                    Amount is charged as per the terms and conditions.
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
