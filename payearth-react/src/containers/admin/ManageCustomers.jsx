import React, { Component } from 'react';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import store from '../../store/index';
import axios from 'axios';
import SpinnerLoader from '../../components/common/SpinnerLoader';

import { Link } from 'react-router-dom';

class ManageCustomers extends Component {
  constructor(props) {
    super(props);
    this.authInfo = store.getState().auth.authInfo;
    toast.configure();
    const {dispatch} = this.props;
    setTimeout(() => {
      dispatch(setLoading({loading: false}));
    }, 300);
  }
  componentDidMount(){
    document.body.style.overflow = "unset"// Set the style
  }
  render() {
    const {loading} = store.getState().global;
    return (
      <React.Fragment>
        {loading === true ? <SpinnerLoader /> : ''}
        <Header />
        <section className="admin-dashboard-wrapper">
          <div className="inr_wrap dash_inner_wrap admin_manage_customer">

            <div className="col-md-12">
              <div className="seller_dash_wrap pt-5 pb-5">
                <div className="container ">
                  <div className="bg-white rounded-3 pt-3 pb-5">
                    <div className="dash_inner_wrap">
                      <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center flex_mob_none">
                        <div className="dash_title">Manage Customers</div>
                        <div className="search_customer_field">
                          <form className="d-lg-flex">
                            <input className="form-control border-start height-auto" type="search" placeholder="Search" value="" />
                            <button className="btn btn_dark" type="button">Search</button>
                          </form>
                        </div>
                      </div>
                    </div>

                    <div className="orders_table tab-content pt-0 pb-0" id="nav-tabContent">
                      <div className="tab-pane fade show active" id="nav-pending-orders" role="tabpanel" aria-labelledby="nav-pending-orders-tab">
                        <table className="table table-responsive table-bordered">
                          <thead>
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th className="type-purchase">Type of Purchase</th>
                              <th className="manage">Manage</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Alexendra</td>
                              <td>helloAlexa@gmail.com</td>
                              <td>Wholesale</td>
                              <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">Edit</a></td>
                            </tr>
                            <tr>
                              <td>Alexendra</td>
                              <td>helloAlexa@gmail.com</td>
                              <td>Wholesale</td>
                              <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">Edit</a></td>
                            </tr>
                            <tr>
                              <td>Alexendra</td>
                              <td>helloAlexa@gmail.com</td>
                              <td>Wholesale</td>
                              <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">Edit</a></td>
                            </tr>
                            <tr>
                              <td>Alexendra</td>
                              <td>helloAlexa@gmail.com</td>
                              <td>Wholesale</td>
                              <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">Edit</a></td>
                            </tr>
                            <tr>
                              <td>Alexendra</td>
                              <td>helloAlexa@gmail.com</td>
                              <td>Wholesale</td>
                              <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">Edit</a></td>
                            </tr>
                            <tr>
                              <td>Alexendra</td>
                              <td>helloAlexa@gmail.com</td>
                              <td>Wholesale</td>
                              <td><a className="custom_btn btn_yellow_bordered w-auto btn" href="#">Edit</a></td>
                            </tr>
                          </tbody>
                        </table>
                        <div className="pagination">
                          <ul>
                            <li><a className="link disabled" href="#"><span className="fa fa-angle-left me-2"></span> Prev</a></li>
                            <li><a className="link active" href="#">1</a></li>
                            <li><a className="link disabled" href="#">Next <span className="fa fa-angle-right ms-2"></span></a></li>
                          </ul>
                        </div>
                      </div>
                      <div className="tab-pane fade" id="nav-ongoing-orders" role="tabpanel" aria-labelledby="nav-ongoing-orders-tab">
                        <div className="no_data_found">Data not found.</div>
                      </div>
                      <div className="tab-pane fade" id="nav-cancelled-orders" role="tabpanel" aria-labelledby="nav-cancelled-orders-tab">
                        <div className="no_data_found">Data not found.</div>
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

export default connect(setLoading)(ManageCustomers);