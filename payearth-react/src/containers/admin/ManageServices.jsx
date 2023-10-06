import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/admin/common/Header';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import store from '../../store/index';
import axios from 'axios';
import Footer from '../../components/common/Footer';

class ManageServices extends Component {
    constructor(props){
        super(props);
        const {dispatch} = props;
        this.dispatch = dispatch;        
        this.authInfo = store.getState().auth.authInfo;
        this.state={check:'', data:[],
        }
    }
    handleChange=(e)=>{        
        console.log(e.target.checked)        
        if(e.target.checked){
            this.setState({check:'checked'})
            //document.getElementsByTagName("input")[0].setAttribute('checked', 'checked')
        }else{      
            this.setState({check:null})     
            //document.getElementsByTagName('input')[0].removeAttribute('checked')
        }//else End
    }
    getProducts=()=>{
        let reqBody = {
            count: {
                page: 1,
                skip: 0,
                limit: 2
            },
            sorting: {
                sort_type: "date",
                sort_val: "desc"
            }
        };
        let url = 'admin/products';
        this.dispatch(setLoading({ loading: true }));
        axios.post(url, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                // this.setState({

                //     data: response.data.data.coupons,
                //     pagination: response.data.data.paginationData
                // });
                console.log(response);
            }
           
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }
    componentDidMount() {
        //this.getProducts();
    }
    
    render() {
        return (
            <React.Fragment>
                <Header />
                <div className="seller_dash_wrap pt-5 pb-5">
                    <div className="container ">
                        <div className="bg-white rounded-3 pt-3 pb-5">
                            <div className="dash_inner_wrap">
                                <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center">
                                    <div className="dash_title">Manage Service</div>
                                    <a className="custom_btn btn_yellow w-auto btn" href='https://www.google.com/'>Add Service</a>
                                </div>
                            </div>
                            <nav className="orders_tabs">
                                <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                    <button className="nav-link active" id="nav-pending-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-pending-orders" type="button" role="tab" aria-controls="nav-pending-orders" aria-selected="true">Added Services</button>
                                    <button className="nav-link" id="nav-ongoing-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-ongoing-orders" type="button" role="tab" aria-controls="nav-ongoing-orders" aria-selected="false">Pending for approval</button>
                                    <button className="nav-link" id="nav-cancelled-orders-tab" data-bs-toggle="tab" data-bs-target="#nav-cancelled-orders" type="button" role="tab" aria-controls="nav-cancelled-orders" aria-selected="true">Rejected Services</button>
                                </div>
                            </nav>
                            <div className="orders_table tab-content pt-0 pb-0" id="nav-tabContent">
                                <div className="tab-pane fade show active" id="nav-pending-orders" role="tabpanel" aria-labelledby="nav-pending-orders-tab">
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
                                                  /></div></td>
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
                                <div className="tab-pane fade" id="nav-ongoing-orders" role="tabpanel" aria-labelledby="nav-ongoing-orders-tab">
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
                                <div className="tab-pane fade" id="nav-cancelled-orders" role="tabpanel" aria-labelledby="nav-cancelled-orders-tab">
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
                            </div>
                        </div>
                    </div>
                </div>
                <Footer/>
            </React.Fragment >

        );
    }
}

export default connect(setLoading)(ManageServices);
