import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import Footer from '../../components/common/Footer';
import Header from '../../components/seller/common/Header';
import { setLoading } from '../../store/reducers/global-reducer';
import store from '../../store/index';
import axios from 'axios';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import config from '../../config.json';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import NotFound from '../../components/common/NotFound';
import Select from 'react-select';

class ListedProducts extends Component {
    constructor(props) {
        super(props)
        const {dispatch} = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;
        this.state = {
            ListedProducts: [],
            ListedServices: [],
            reqBody: {
                count: {
                    page: 1,
                    skip: 0,
                    limit: 8
                },
                sorting: {
                    sort_type: "date",
                    sort_val: "desc"
                }
            },
            reqBody2: {
                count: {
                    page: 1,
                    skip: 0,
                    limit: 8
                },
                sorting: {
                    sort_type: "date",
                    sort_val: "desc"
                }
            },
            pagination: {},
            servicePagination: {},
            sortingOptions: [
                { label: 'New to Old', value: 'desc' },
                { label: "Old to New ", value: 'asc' },
            ],
            defaultSelectedOptionProduct: { label: 'New to Old', value: 'desc' },
            defaultSelectedOptionService: { label: 'New to Old', value: 'desc' },
            itemIsService: false
        }
    }

    componentDidMount() {
        this.getListedItems(false, null, 'product');
    }

    getListedItems = (pagination, param, type) => {
        let reqBody = {};
        let url = '';

        if (pagination === true) {
            reqBody = {
                count: {
                    page: param,
                    skip: (param - 1) * 8,
                    limit: 8
                },
                sorting: {
                    sort_type: "date",
                    sort_val: type === 'product' ? this.state.defaultSelectedOptionProduct.value : this.state.defaultSelectedOptionService.value
                }
            };
        } else {
            if (type === 'product') {
                reqBody = this.state.reqBody;
            } else {
                reqBody = this.state.reqBody2;
            }
        }

        if (type === 'product') {
            url = 'seller/products/list/';
            this.setState({reqBody});
        } else if (type === 'service') {
            url = 'seller/services/list/';
            this.setState({reqBody2: reqBody});
        }

        this.dispatch(setLoading({loading: true}));
        axios.post(url + this.authInfo.id, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            if (response.data.status && type === 'product') {
                this.setState({
                    ListedProducts: response.data.data.products,
                    pagination: response.data.data.paginationData
                });
            } else if (response.data.status && type === 'service') {
                this.setState({
                    ListedServices: response.data.data.services,
                    servicePagination: response.data.data.paginationData
                })
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    pagination = type => {
        let html = [];
        let itemLength = 0;
        let currentPage = 0;
        if (type === 'product') {
            itemLength = this.state.pagination.totalPages;
            currentPage = this.state.pagination.currentPage;
        } else if (type === 'service') {
            itemLength = this.state.servicePagination.totalPages;
            currentPage = this.state.servicePagination.currentPage;
        }

        for (let index = 0; index < itemLength; index++) {
            let pageNumber = index + 1;
            html.push(<li key={index}><Link to="#" className={`link ${currentPage === pageNumber ? 'active' : ''}`} onClick={() => this.getListedItems(true, pageNumber, type)}>{pageNumber}</Link></li>);
        }
        return html;
    }

    handleChangeProducts = selectedOption => {
        let reqBody = this.state.reqBody;
        reqBody.sorting.sort_val = selectedOption.value;
        reqBody.count.page = this.state.pagination.currentPage;
        reqBody.count.skip = (this.state.pagination.currentPage - 1) * 3;
        this.setState({ defaultSelectedOptionProduct: selectedOption, reqBody });
        this.getListedItems(false, this.state.pagination.currentPage, 'product');
    }

    handleChangeServices = selectedOption => {
        let reqBody2 = this.state.reqBody2;
        reqBody2.sorting.sort_val = selectedOption.value;
        reqBody2.count.page = this.state.servicePagination.currentPage;
        reqBody2.count.skip = (this.state.servicePagination.currentPage - 1) * 3;
        this.setState({ defaultSelectedOptionService: selectedOption, reqBody2 });
        this.getListedItems(false, this.state.servicePagination.currentPage, 'service');
    }

    handleItemType = param => {
        let flag = param === 'service' ? true : false;
        this.setState({itemIsService: flag});
    }

    render() {
        const {loading} = store.getState().global;
        const {
            ListedProducts,
            ListedServices,
            pagination,
            servicePagination,
            sortingOptions,
            defaultSelectedOptionProduct,
            defaultSelectedOptionService,
            itemIsService
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
                                    <nav className="seller_tabs">
                                        <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                            <button className="nav-link active" id="nav-listed-product-tab" data-bs-toggle="tab" data-bs-target="#nav-listed-product" type="button" role="tab" aria-controls="nav-listed-product" aria-selected="true"
                                                onClick={() => {
                                                    this.handleItemType('product')
                                                    this.getListedItems(false, null, 'product')
                                                }} >listed-product
                                            </button>
                                            <button className="nav-link" id="nav-listed-service-tab" data-bs-toggle="tab" data-bs-target="#nav-listed-service" type="button" role="tab" aria-controls="nav-listed-service" aria-selected="false"
                                                onClick={() => {
                                                    this.handleItemType('service')
                                                    this.getListedItems(false, null, 'service')
                                                }}>listed-service
                                            </button>
                                            {itemIsService ?
                                                <Select
                                                    className="sort_select text-normal ms-auto"
                                                    options={sortingOptions}
                                                    value={defaultSelectedOptionService}
                                                    onChange={this.handleChangeServices}
                                                /> :
                                                <Select
                                                    className="sort_select text-normal ms-auto"
                                                    options={sortingOptions}
                                                    value={defaultSelectedOptionProduct}
                                                    onChange={this.handleChangeProducts}
                                                />
                                            }
                                        </div>
                                    </nav>
                                    <div className="tab-content" id="nav-tabContent">
                                        <div className="tab-pane fade show active" id="nav-listed-product" role="tabpanel" aria-labelledby="nav-listed-product-tab">
                                            {ListedProducts.length > 0 ?
                                                <div className="row">
                                                    {ListedProducts.length && ListedProducts.map((value, index) => {
                                                        return <div className="col-md-3" key={index}>
                                                            <div className="card seller_pro_card">
                                                                <div className="lst_pro_img">
                                                                    <Link to={`/seller/product-detail/${value.id}`}>
                                                                        <img src={config.apiURI + value.featuredImage} className="card-img-top" alt={value.name} />
                                                                    </Link>
                                                                </div>
                                                                <div className="card-body">
                                                                    <Link to={`/seller/product-detail/${value.id}`} className="pro_name">{value.name}</Link>
                                                                    <div className="pro_price"><span>{value.price} USD</span>
                                                                        {value.cryptoPrices && value.cryptoPrices.map((val, index) => {
                                                                            let crypPrice =  value.price / val.cryptoPriceUSD;
                                                                            crypPrice = crypPrice.toFixed(5);
                                                                            return <React.Fragment key={index}> | <span>{crypPrice} {val.code}</span></React.Fragment>
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    })}
                                                </div>
                                                : <NotFound msg="Data not found." />
                                            }
                                            {ListedProducts.length > 0 &&
                                                <div className="pagination">
                                                    <ul>
                                                        <li><Link to="#" className={`link ${pagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getListedItems(true, pagination.prevPage, 'product')}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                        {this.pagination('product')}
                                                        <li><Link to="#" className={`link ${pagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getListedItems(true, pagination.nextPage, 'product')}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
                                                    </ul>
                                                </div>
                                            }
                                        </div>

                                        <div className="tab-pane fade" id="nav-listed-service" role="tabpanel" aria-labelledby="nav-listed-service-tab">
                                            {ListedServices.length > 0 ?
                                                <div className="row">
                                                    {ListedServices.length && ListedServices.map((value, index) => {
                                                        return <div className="col-md-3" key={index}>
                                                            <div className="card seller_pro_card">
                                                                <div className="lst_pro_img">
                                                                    <Link to={`/seller/service-detail/${value.id}`} className="pro_name">
                                                                        <img src={config.apiURI + value.featuredImage} className="card-img-top" alt={value.name} />
                                                                    </Link>
                                                                </div>
                                                                <div className="card-body">
                                                                <Link to={`/seller/service-detail/${value.id}`} className="pro_name">{value.name}</Link>
                                                                    <div className="pro_price"><span>{value.price} USD </span>
                                                                        {value.cryptoPrices.map((val, index) => {
                                                                            let crypPrice =  value.price / val.cryptoPriceUSD;
                                                                            crypPrice = crypPrice.toFixed(5);
                                                                            return <React.Fragment key={index}>| <span>{crypPrice} {val.code}</span></React.Fragment>
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    })}
                                                </div>
                                                : <NotFound msg="Data not found." />
                                            }
                                            {ListedServices.length > 0 &&
                                                <div className="pagination">
                                                    <ul>
                                                        <li><Link to="#" className={`link ${servicePagination.hasPrevPage ? '' : 'disabled'}`} onClick={() => this.getListedItems(true, servicePagination.prevPage, 'service')}><span className="fa fa-angle-left me-2"></span> Prev</Link></li>
                                                        {this.pagination('service')}
                                                        <li><Link to="#" className={`link ${servicePagination.hasNextPage ? '' : 'disabled'}`} onClick={() => this.getListedItems(true, servicePagination.nextPage, 'service')}>Next <span className="fa fa-angle-right ms-2"></span></Link></li>
                                                    </ul>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </React.Fragment>
        )
    }
}

export default connect(setLoading)(ListedProducts);