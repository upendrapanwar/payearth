import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import graph from '../../assets/images/graph.png'
import tcsGraph from '../../assets/images/tcs_graph.png'
import mensJacket from '../../assets/images/mens-jacket.png'
import headphone from '../../assets/images/headphone.png'
import menBrownShoes from '../../assets/images/men-brown-shoes.png'
import Footer from '../../components/common/Footer';
import Header from '../../components/admin/common/Header';

let data=[
    {productImg:mensJacket,productId:'#BeqQ190',price:'$60',sales:693,reviews:118,profit:'$2690 / 09 BTC',revenue:'	$62690 / 8 BTC'},
    {productImg:headphone,productId:'#BeqQ190',price:'$60',sales:693,reviews:118,profit:'$2690 / 09 BTC',revenue:'	$62690 / 8 BTC'},
    {productImg:menBrownShoes,productId:'#BeqQ190',price:'$60',sales:693,reviews:118,profit:'$2690 / 09 BTC',revenue:'	$62690 / 8 BTC'},
    {productImg:mensJacket,productId:'#BeqQ190',price:'$60',sales:693,reviews:118,profit:'$2690 / 09 BTC',revenue:'	$62690 / 8 BTC'},
    {productImg:mensJacket,productId:'#BeqQ190',price:'$60',sales:693,reviews:118,profit:'$2690 / 09 BTC',revenue:'	$62690 / 8 BTC'},
];

class Dashboard extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="seller_body">
                    <Header/>
                    <div className="seller_dash_wrap pt-5 pb-5">
                        <div className="container">
                            <div className="row">
                                <div className="col-md-3 col-sm-6 col-12">
                                    <div className="count_box">
                                        <div className="cb_count">360</div>
                                        <div className="cb_name">No. of products</div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12">
                                    <div className="count_box">
                                        <div className="cb_count">$980000</div>
                                        <div className="cb_name">Payments</div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12">
                                    <div className="count_box">
                                        <div className="cb_count">63690</div>
                                        <div className="cb_name">Total Orders</div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12">
                                    <div className="count_box">
                                        <div className="cb_count">69</div>
                                        <div className="cb_name">Stock low by Units</div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12 offset-lg-1">
                                    <div className="count_box">
                                        <div className="cb_count">98</div>
                                        <div className="cb_name">No. of Vendors</div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12">
                                    <div className="count_box">
                                        <div className="cb_count">1689529</div>
                                        <div className="cb_name">No. of Customers</div>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6 col-12">
                                    <div className="count_box">
                                        <div className="cb_count">360</div>
                                        <div className="cb_name">Total no of services</div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-md-9">
                                    <div className="dash_graph bg-white">
                                        <div className="dash_graph_head">
                                            <div className="dash_title">Total Sales Graph</div>
                                        </div>
                                        <div className="dash_graph_body p-3">
                                            <img src={graph} className="img-fluid" alt="" />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="tsc_box bg-white p-3">
                                        <div className="dash_title">top selling categories</div>
                                        <div className="tsc_img mt-4 mb-4">
                                            <img src={tcsGraph} className="img-fluid" alt="" />
                                        </div>
                                        <ul className="tcs_indicators_list">
                                            <li><i style={{ color: "#4358ff" }} className="fa fa-circle"></i> Footwear</li>
                                            <li><i style={{ color: "#43d2ff" }} className="fa fa-circle"></i> Mens wear</li>
                                            <li><i style={{ color: "#fbff43" }} className="fa fa-circle"></i> Electronics</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-md-12">
                                    <div className="my_pro_cart bg-white">
                                        <div className="mpc_header">
                                            <div className="dash_title">Newly Listed Products</div>
                                            <div className="mpc_btns search_box">
                                                <div className="input-group">
                                                    <input type="text" className="form-control" placeholder="Search products" aria-label="Search products" aria-describedby="button-addon2" />
                                                    <button className="btn btn-outline-secondary" type="button" id="button-addon2">Search</button>
                                                </div>
                                            </div>
                                        </div>
                                        <table className="table table-responsive table-hover pe_table mpc_table">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Product / Service</th>
                                                    <th scope="col">Price</th>
                                                    <th scope="col">Sales</th>
                                                    <th scope="col">Reviews</th>
                                                    <th scope="col">Profit</th>
                                                    <th scope="col">Revenue</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.map((value,index)=>{
                                                    return(
                                                        <tr key={index}>
                                                        <td>
                                                            <div className="odr_item_img"><img src={value.productImg} className="img-fluid" alt="" /></div>
                                                            <span>{value.productId}</span>
                                                        </td>
                                                        <td>{value.price}</td>
                                                        <td>{value.sales}</td>
                                                        <td>{value.reviews}</td>
                                                        <td>{value.profit}</td>
                                                        <td>{value.revenue}</td>
                                                    </tr>
                                                    )
                                                })}
                                                {/* <tr>
                                                    <td>
                                                        <div className="odr_item_img"><img src={mensJacket} className="img-fluid" alt="" /></div>
                                                        <span>#BeqQ190</span>
                                                    </td>
                                                    <td>$60</td>
                                                    <td>693</td>
                                                    <td>118</td>
                                                    <td>$2690 / 09 BTC</td>
                                                    <td>$62690 / 8 BTC</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="odr_item_img"><img src={headphone} className="img-fluid" alt="" /></div>
                                                        <span>#BeqQ190</span>
                                                    </td>
                                                    <td>$60</td>
                                                    <td>693</td>
                                                    <td>118</td>
                                                    <td>$2690 / 09 BTC</td>
                                                    <td>$62690 / 8 BTC</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="odr_item_img"><img src={menBrownShoes} className="img-fluid" alt="" /></div>
                                                        <span>#BeqQ190</span>
                                                    </td>
                                                    <td>$60</td>
                                                    <td>693</td>
                                                    <td>118</td>
                                                    <td>$2690 / 09 BTC</td>
                                                    <td>$62690 / 8 BTC</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="odr_item_img"><img src={mensJacket} className="img-fluid" alt="" /></div>
                                                        <span>#BeqQ190</span>
                                                    </td>
                                                    <td>$60</td>
                                                    <td>693</td>
                                                    <td>118</td>
                                                    <td>$2690 / 09 BTC</td>
                                                    <td>$62690 / 8 BTC</td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="odr_item_img"><img src={mensJacket} className="img-fluid" alt="" /></div>
                                                        <span>#BeqQ190</span>
                                                    </td>
                                                    <td>$60</td>
                                                    <td>693</td>
                                                    <td>118</td>
                                                    <td>$2690 / 09 BTC</td>
                                                    <td>$62690 / 8 BTC</td>
                                                </tr> */}
                                            </tbody>
                                        </table>
                                        <div className="mpc_footer">
                                            <div className="dash_inner_wrap">
                                                <nav aria-label="Page navigation">
                                                    <ul className="pagination">
                                                        <li className="page-item">
                                                            <Link className="page-link" to="#" aria-label="Previous">
                                                                <i className="fa fa-chevron-left"></i>
                                                            </Link>
                                                        </li>
                                                        <li className="page-item"><Link className="page-link" to="#">1</Link></li>
                                                        <li className="page-item"><Link className="page-link" to="#">2</Link></li>
                                                        <li className="page-item"><Link className="page-link" to="#">3</Link></li>
                                                        <li className="page-item"><Link className="page-link" to="#">4</Link></li>
                                                        <li className="page-item"><Link className="page-link" to="#">....</Link></li>
                                                        <li className="page-item"><Link className="page-link" to="#">8</Link></li>
                                                        <li className="page-item">
                                                            <Link className="page-link" to="#" aria-label="Next">
                                                                <i className="fa fa-chevron-right"></i>
                                                            </Link>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer/>
                </div>

            </React.Fragment>
        )
    }
}

export default Dashboard;
