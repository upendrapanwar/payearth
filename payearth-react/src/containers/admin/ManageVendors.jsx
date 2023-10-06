import React, { Component } from 'react';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import store from '../../store/index';
import axios from 'axios';
import { Link } from 'react-router-dom';
import NotFound from '../../components/common/NotFound';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import Select from 'react-select';

class ManageVendors extends Component {
    constructor(props) {
        super(props);
        const { dispatch } = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;
        this.state = {
            data: [],
            reqBody: {
                count: {
                    page: 1,
                    skip: 0,
                    limit: 5
                },
                sorting: {
                    sort_type: "date",
                    sort_val: "desc"
                },
                search_value: ""
            },
            pagination: {},
            sortingOptions: [
                { label: 'New to Old', value: 'desc' },
                { label: "Old to New ", value: 'asc' },
            ],
            defaultSelectedOption: { label: 'New to Old', value: 'desc' },
        }
    }

    componentDidMount() {
        this.getVendors(false, null);
    }
    getVendors = (pagination, param) => {
        let reqBody = {};
        if (pagination === true) {
            reqBody = {
                count: {
                    page: param,
                    skip: (param - 1) * 5,
                    limit: 5
                },
                sorting: {
                    sort_type: "date",
                    sort_val: "desc"
                },
                search_value: ""
            };
        }
         else {
            reqBody = this.state.reqBody;
        }

        let url = 'admin/sellers';
        this.dispatch(setLoading({ loading: true }));
        axios.post(url, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                this.setState({
                    data: response.data.data.sellers,
                    pagination: response.data.data.paginationData
                });
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
    pagination = () => {
        let html = [];
        for (let index = 0; index < this.state.pagination.totalPages; index++) {
            let pageNumber = index + 1;
            html.push(<li key={index}><Link to="#" className={`link ${this.state.pagination.currentPage === pageNumber ? 'active' : ''}`} onClick={() => this.getVendors(true, pageNumber)}>{pageNumber}</Link></li>);
        }
        return html;
    }
    handleSearch = (event) => {
        let reqBody = this.state.reqBody;
        reqBody.search_value = event.target.value;
        this.setState({reqBody });
    }
    search=()=>{
        this.getVendors(false, null);
    }
    handleChange = selectedOption => {
        let reqBody = this.state.reqBody;
        reqBody.sorting.sort_val = selectedOption.value;
        reqBody.count.page = this.state.pagination.currentPage;
        reqBody.count.skip = (this.state.pagination.currentPage - 1) * 5;
        this.setState({ defaultSelectedOption: selectedOption, reqBody });
        this.getVendors(false, this.state.pagination.currentPage);
    }
    render() {
        const { loading } = store.getState().global;
        const {
            data,
            pagination,
            sortingOptions,
            defaultSelectedOption,
        } = this.state;
        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <div className="seller_body">
                    <Header />
                    <div className="seller_dash_wrap pt-5 pb-5">
                        <div className="container ">
                            <div className="bg-white rounded-3 pt-3 pb-5">
                                <div className="dash_inner_wrap">
                                    <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center">
                                        <div className="dash_title">Manage Vendors</div>
                                        <Select
                                            className="sort_select text-normal"
                                            options={sortingOptions}
                                            value={defaultSelectedOption}
                                            onChange={this.handleChange}
                                        />
                                        <div className="mpc_btns search_box d-flex align-items-center">
                                            <form onSubmit={(e) => { e.preventDefault() }}>
                                                <div className="input-group me-2">
                                                    <input type="text" className="form-control" placeholder="Search products" aria-label="Search products" aria-describedby="button-addon2"  onChange={(event) => { this.handleSearch(event) }} />
                                                    <button className="btn btn-outline-secondary" type="button" id="button-addon2" onClick={()=>{this.search()}}>Search</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div className="orders_table pt-0 pb-0">
                                    {data.length > 0 ?
                                        <table className="table table-responsive table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>type of purchase</th>
                                                    <th>Manage</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {data.length && data.map((value, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{value.name}</td>
                                                            <td>{value.email}</td>
                                                            <td>{value.seller_type}</td>
                                                            <td><Link to="#" className="custom_btn btn_yellow_bordered w-auto btn">Edit</Link></td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                        : <NotFound msg="Data not found." />
                                    }
                                    {data.length > 0 &&
                                        <div className="pagination">
                                            <ul>
                                                <li><Link to="#" className={`link ${pagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getVendors(true, pagination.prevPage)}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                {this.pagination()}
                                                <li><Link to="#" className={`link ${pagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getVendors(true, pagination.nextPage)}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
                                            </ul>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </React.Fragment>
        );
    }
}

export default connect(setLoading)(ManageVendors);
