import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../../../components/common/Footer";
import Header from "../../../components/user/common/Header";
import axios from "axios";
import { toast } from "react-toastify";
import { connect } from "react-redux";
import SpinnerLoader from "../../../components/common/SpinnerLoader";
import DataTable from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import Select from "react-select";
import NotFound from "../../../components/common/NotFound";

function ServiceOrder() {
  const authInfo = localStorage.getItem("authInfo");

  const [completedOrder, setCompletedOrder] = useState([]);
  const [failedOrder, setFailedOrder] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServiceOrders("completed");
    fetchServiceOrders("failed");
  }, []);

  const fetchServiceOrders = (orderType) => {
    if (!authInfo) {
      toast.error("Authentication information not found");
      return;
    }

    const { id, token } = JSON.parse(authInfo);

    let url = `https://localhost:7700/user/service-orders/${id}`;
    if (orderType === "completed") {
      url += "?type=complete";
    } else if (orderType === "failed") {
      url += "?type=failed";
    }

    axios
      .get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(`check ${orderType} order data`, response.data.data);
        if (response.data.status) {
          if (orderType === "completed") {
            const completedOrders = response.data.data.filter(
              (order) => order.isActive === true
            );
            setCompletedOrder(completedOrders);
          } else if (orderType === "failed") {
            const failedOrders = response.data.data.filter(
              (order) => order.isActive === false
            );
            setFailedOrder(failedOrders);
          }
        }
      })
      .catch((error) => {
        if (error.response && error.response.data.status === false) {
          toast.error(error.response.data.message);
        } else {
          console.error(`Error fetching ${orderType} order data:`, error);
          toast.error(`Error fetching ${orderType} order data`);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const columns = [
    {
      name: "Name",
      // selector: (row) => row.userId.name,
      selector: (row) => ` ${row.userId.name}`,
      sortable: true,
    },
    {
      name: "Invoice No",
      // selector: "invoiceNo",
      selector: (row) => ` ${row.invoiceNo}`,
      sortable: true,
    },
    {
      name: "Amount",
      // selector: "amountPaid",
      selector: (row) => ` ${row.amountPaid} $`,

      sortable: true,
    },
    {
      name: "Payment Account",
      // selector: "paymentAccount",
      selector: (row) => ` ${row.paymentAccount}`,
      sortable: true,
    },
    {
      name: "Payment Mode",
      // selector: "paymentMode",
      selector: (row) => ` ${row.paymentMode}`,
      sortable: true,
    },
    {
      name: "Payment Status",
      // selector: "paymentStatus",
      selector: (row) => ` ${row.paymentStatus}`,
      sortable: true,
    },
    {
      name: "Date",
      selector: "createdAt",
      sortable: true,
      cell: (row) => new Date(row.createdAt).toDateString(),
    },
    {
      name: "Details",
      cell: (row) => (
        <Link to={`/seller/order-details/${row._id}`}>View Details</Link>
      ),
    },
  ];

  const handleChangeCompleted = (selectedOption) => {
    // Handle sorting change here if needed
  };

  const pagination = () => {
    // Implement pagination logic here if needed
  };

  return (
    <>
      {loading && <SpinnerLoader />}
      <div className="seller_body">
        <Header />
        <div className="seller_dash_wrap pt-5 pb-5">
          <div className="container ">
            <div className="bg-white rounded-3 pt-3 pb-5">
              <div className="dash_inner_wrap">
                <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center">
                  <div className="dash_title">Service Orders</div>
                  <Select
                    className="sort_select text-normal ms-auto"
                    options={[]}
                    value={""}
                    onChange={handleChangeCompleted}
                  />
                </div>
              </div>
              <nav className="orders_tabs">
                <div
                  className="nav nav-tabs nav-fill"
                  id="nav-tab"
                  role="tablist"
                >
                  <button
                    className="nav-link active"
                    id="nav-completed-orders-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-completed-orders"
                    type="button"
                    role="tab"
                    aria-controls="nav-completed-orders"
                    aria-selected="true"
                  >
                    Completed Orders
                  </button>
                  <button
                    className="nav-link"
                    id="nav-failed-orders-tab"
                    data-bs-toggle="tab"
                    data-bs-target="#nav-failed-orders"
                    type="button"
                    role="tab"
                    aria-controls="nav-failed-orders"
                    aria-selected="false"
                  >
                    Failed Orders
                  </button>
                </div>
              </nav>
              <div className="tab-content" id="nav-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="nav-completed-orders"
                  role="tabpanel"
                  aria-labelledby="nav-completed-orders-tab"
                >
                  <div className="row">
                    {completedOrder.length > 0 ? (
                      <div className="col">
                        <DataTableExtensions
                          columns={columns}
                          data={completedOrder}
                        >
                          <DataTable
                            noHeader
                            pagination
                            highlightOnHover
                            defaultSortField="createdAt"
                            defaultSortAsc={false}
                          />
                        </DataTableExtensions>
                      </div>
                    ) : (
                      <NotFound />
                    )}
                  </div>
                  <div className="order_pagination">
                    <nav aria-label="Page navigation example">
                      <ul className="pagination">{pagination()}</ul>
                    </nav>
                  </div>
                </div>
                <div
                  className="tab-pane fade"
                  id="nav-failed-orders"
                  role="tabpanel"
                  aria-labelledby="nav-failed-orders-tab"
                >
                  <div className="row">
                    {failedOrder.length > 0 ? (
                      <div className="col">
                        <DataTableExtensions
                          columns={columns}
                          data={failedOrder}
                        >
                          <DataTable
                            noHeader
                            pagination
                            highlightOnHover
                            defaultSortField="createdAt"
                            defaultSortAsc={false}
                          />
                        </DataTableExtensions>
                      </div>
                    ) : (
                      <NotFound />
                    )}
                  </div>
                  <div className="order_pagination">
                    <nav aria-label="Page navigation example">
                      <ul className="pagination">{pagination()}</ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

const mapStateToProps = (state) => ({
  loading: state.global.loading,
});

export default connect(mapStateToProps)(ServiceOrder);
