import React, { Component } from 'react';
import Header from '../../components/user/common/Header';
import PageTitle from '../../components/user/common/PageTitle';
import Footer from '../../components/common/Footer';
import { Link } from 'react-router-dom';

class Notifications extends Component {
    render() {
        return (
            <React.Fragment>
                <Header />
                <PageTitle title="Notifications" />
                <section className="inr_wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="cart wishlist">
                                    <div className="cart_wrap">
                                        <div className="items_incart">
                                            <span>8 Payments done</span>
                                        </div>
                                    </div>
                                    <div className="cart_list cart_wrap pb-5">
                                        <table className="table table-responsive table-hover pe_table">
                                            <thead>
                                            <tr>
                                                <th scope="col">Posted By</th>
                                                <th scope="col">Date</th>
                                                <th scope="col" className="invisible">Action</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="noti active">Steven posted a minute ago check what he has posted</div>
                                                    </td>
                                                    <td>06-01-2021</td>
                                                    <td className="text-end"><Link to="#" className="btn custom_btn btn_yellow_bordered">View Details</Link></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="noti active">Emma posted a 30 minute ago check what he has posted</div>
                                                    </td>
                                                    <td>06-01-2021</td>
                                                    <td className="text-end"><Link to="#" className="btn custom_btn btn_yellow_bordered">Download</Link></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="noti">Steven posted one days ago check what he has posted</div>
                                                    </td>
                                                    <td>06-01-2021</td>
                                                    <td className="text-end"><Link to="#" className="btn custom_btn btn_yellow_bordered">Download</Link></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="noti">Steven posted one days ago check what he has posted</div>
                                                    </td>
                                                    <td>06-01-2021</td>
                                                    <td className="text-end"><Link to="#" className="btn custom_btn btn_yellow_bordered">Download</Link></td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <div className="noti">Steven posted one days ago check what he has posted</div>
                                                    </td>
                                                    <td>06-01-2021</td>
                                                    <td className="text-end"><Link to="#" className="btn custom_btn btn_yellow_bordered">Download</Link></td>
                                                </tr>
                                            </tbody>
                                        </table>
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

export default Notifications;