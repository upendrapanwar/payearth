import React, { Component } from 'react';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import store from '../../store/index';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import NotFound from '../../components/common/NotFound';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import { Helmet } from 'react-helmet';

import Stripe from 'stripe';

const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY);

class AdminManageSubPlan extends Component {
    constructor(props) {
        super(props);
        this.authInfo = store.getState().auth.authInfo;
        this.authInfoString = JSON.parse(localStorage.getItem("authInfo"));

        this.state = {
            planName: '',
            interval: '',
            interval_count: null,
            planPrice: '',
            planType: '',
            advertiseAllowed: null,
            description: '',

            allPlanData: [],

            selectedRows: [],
            loading: true,
            error: null,
            permissions: {
                add: '',
                edit: '',
                delete: ''
            }
        }
    }

    componentDidMount() {
        this.getSubscriptionPermission();
        this.getSubData();
    }


    getSubscriptionPermission = () => {
        const admin_Id = this.authInfoString.id;
        this.setState({ loading: true })
        // Axios API call without async/await
        axios
            .get(`admin/getSubscriptionPermission/${admin_Id}`, {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    Authorization: `Bearer ${this.authInfoString.token}`,
                },
            })
            .then((res) => {
                if (res.data.status === true && res.data.data) {
                    this.setState({ permissions: res.data.data }, () => {
                        console.log("Checking Response permission", this.state.permissions);
                        this.setState({ loading: false })
                    });
                }
            })
            .catch((error) => {
                this.setState({ loading: false })
                toast.error(error.response.data.message);
                console.error("Error fetching data: ", error);
            });
    };

    // getSubscriptionPermission = async () => {
    //     const admin_Id = this.authInfo.id;
    //     try {
    //         const res = await axios.get(`admin/getSubscriptionPermission/${admin_Id}`, {
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json;charset=UTF-8',
    //                 'Authorization': `Bearer ${this.authInfo.token}`
    //             }
    //         })

    //         if (res.data.status === true && res.data.data) {
    //             this.setState({ permissions: res.data.data }, () => {
    //                 console.log("Checking Response permission", this.state.permissions);
    //             });
    //         }

    //     } catch (error) {
    //         toast.error(error.response.data.message);
    //         console.error("Error fetching data: ", error);
    //     }
    // }

    getSubData = async () => {
        try {
            // const productList = await stripe.products.list();
            const plans = await stripe.plans.list();
            const AdvertisePlan = plans.data.filter(item => item.nickname !== "");
            // console.log("AdvertisePlan>>", AdvertisePlan)
            this.setState({ allPlanData: AdvertisePlan })
            // this.handleSaveInDatabase(plans.data)
            this.setState({ loading: false })
        } catch (error) {
            console.error('Error fetching products: ', error);
        }
    }

    handlePlanType = (e) => {
        console.log("plan Type : ", e.target.value)
        this.setState({ planType: e.target.value });
    };

    handleSelectInterval = (e) => {
        console.log("interval", e.target.value)
        this.setState({ interval: e.target.value });
    };

    handleInterval_count = (e) => {
        console.log('interval_count', e.target.value)
        this.setState({ interval_count: e.target.value });
    };

    handlePlanName = (e) => {
        console.log("planName", e.target.value)
        this.setState({ planName: e.target.value });
    };
    handlePlanPrice = (e) => {
        console.log("planPrice", e.target.value)
        this.setState({ planPrice: e.target.value });
    };

    handleAdvAllowed = (e) => {
        console.log("advertiseAllowed", e.target.value)
        this.setState({ advertiseAllowed: e.target.value });
    };

    handleDescription = (description) => {
        console.log("Description", description)
        this.setState({ description });
    };


    handleCreatePlan = async () => {
        const { planType, interval, interval_count, planName, planPrice, advertiseAllowed, description } = this.state;
        // console.log("price : ", price)
        try {
            const product = await stripe.products.create({
                name: planName,
                metadata: { price: planPrice * 100 } // price is in cents
            });
            // console.log("product>>>>>.", product)

            await stripe.plans.create({
                amount: planPrice * 100,
                currency: 'usd',
                interval: interval,
                interval_count: interval_count,
                product: product.id,
                nickname: `${planName}`,
                metadata: {
                    planType: planType,
                    descriptions: description,
                    advertiseAllowed: advertiseAllowed
                }
            });
            // console.log("product : ", product)
            this.getSubData();
            toast.success("Plan created successfully!", { autoClose: 3000 })
        } catch (error) {
            console.error('Error creating plan: ', error);
        }
    };

    handleDeletePlan = async (id) => {
        try {
            await stripe.plans.del(id);
            toast.success("Plan Deleted successfully!", { autoClose: 3000 })
            this.getSubData();
        } catch (error) {
            console.error('Error deleting plan: ', error);
        }
    };

    category_column = [
        {
            name: 'PLAN NAME',
            selector: (row, i) => row.nickname,
            sortable: true,
        },
        {
            name: "PLAN PRICE",
            selector: (row, i) => `${row.amount / 100} $`,
            sortable: true
        },
        {
            name: "PLAN TYPE FOR",
            selector: (row, i) => row.metadata.planType,
            sortable: true
        },
        {
            name: "ACTIVE",
            selector: (row, i) => row.active === true ? 'True' : 'False',
            sortable: true
        },
        {
            name: 'Actions',
            cell: (row) => (
                <>
                    <button

                        className="custom_btn btn_yellow_bordered w-auto btn btn-width"
                        onClick={() => this.handleDeletePlan(row.id)}
                        disabled={!this.state.permissions.delete}
                    // disabled={true}
                    >
                        Delete
                    </button>
                </>
            ),
        },
    ]

    render() {
        const { allPlanData, loading, error, selectedRows } = this.state;
        if (loading) {
            return <SpinnerLoader />
        }
        if (error) {
            return <div>Error: {error}</div>;
        }

        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ""}
                <Header />
                <div className="inr_top_page_title">
                    <h2>Manage Subscription</h2>
                </div>
                <Helmet>
                    <title>{"Manage Subscription - Pay Earth"}</title>
                </Helmet>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="createpost bg-white rounded-3 mt-2 addPost_left_container">
                                <div className="cp_top">
                                    <div className="cumm_title">
                                        Create New Plan
                                    </div>
                                </div>

                                <div className="cp_body">
                                    <div className="crt_bnr_fieldRow">
                                        <div className="crt_bnr_field">
                                            <label htmlFor="">Plan Type</label>
                                            <div className="field_item">
                                                <select
                                                    onChange={this.handlePlanType}
                                                    className="form-control" name="" id="">
                                                    <option value="default">Select Type</option>
                                                    <option value="Service">Service</option>
                                                    <option value="Advertisement">Advertisement</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className="col-lg-12">
                                            <div className="crt_bnr_fieldRow">
                                                <div className="crt_bnr_field">
                                                    <label htmlFor="">Select Interval</label>
                                                    <div className="field_item">
                                                        <select
                                                            onChange={this.handleSelectInterval}
                                                            className="form-control" name="" id="">
                                                            <option value="month">Select</option>
                                                            <option value="month">Month</option>
                                                            <option value="year">Year</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="crt_bnr_fieldRow">
                                                <div className="crt_bnr_field">
                                                    <label htmlFor="">Select Interval Count</label>
                                                    <div className="field_item">
                                                        <select
                                                            // disabled={this.state.interval !== "month"}
                                                            onChange={this.handleInterval_count}
                                                            className="form-control" name="" id="">
                                                            <option value={1}>Select</option>
                                                            <option value={1}>One</option>
                                                            <option value={3}>Three</option>
                                                            <option value={6}>Six</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="crt_bnr_fieldRow">
                                        <div className="crt_bnr_field">
                                            <label htmlFor="">Plan Name</label>
                                            <div className="field_item">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="name"
                                                    id=""
                                                    // value={this.state.names}
                                                    onChange={this.handlePlanName}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="crt_bnr_fieldRow">
                                        <div className="crt_bnr_field">
                                            <label htmlFor="">Price (USD)</label>
                                            <div className="field_item">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="slug"
                                                    id=""
                                                    // value={this.state.slug}
                                                    onChange={this.handlePlanPrice}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className={`crt_bnr_fieldRow`} >
                                        <div className="crt_bnr_field">
                                            <label htmlFor="">Advertisement Allowed</label>
                                            <div className="field_item">
                                                <select
                                                    onChange={this.handleAdvAllowed}
                                                    className="form-control" name="" id="" disabled={this.state.planType !== "Advertisement"}>
                                                    <option>Select</option>
                                                    <option value={5}>5</option>
                                                    <option value={10}>10</option>
                                                    <option value={50}>50</option>
                                                    <option value={100}>100</option>
                                                    <option value={200}>200</option>
                                                    <option value={500}>500</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="crt_bnr_fieldRow">
                                        <div className="crt_bnr_field">
                                            <label>Description</label>
                                            <div className="field_item">
                                                <ReactQuill
                                                    type="text"
                                                    name="description"
                                                    value={this.state.description}
                                                    onChange={this.handleDescription}
                                                    modules={{
                                                        toolbar: [
                                                            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                            ['bold', 'italic', 'underline'],
                                                            ['link', 'image'],
                                                            ['clean']
                                                        ]
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>


                                    <div className="filter_btn_box">
                                        <button
                                            className='btn custom_btn btn_yellow_bordered'
                                            onClick={this.handleCreatePlan}
                                            disabled={!this.state.permissions.add}
                                        >
                                            Create
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="createpost bg-white rounded-3 mt-2 addPost_left_container">                        
                                <div className="dash_inner_wrap pb-2">
                                        <div className="col-md-12 pb-3 d-flex justify-content-between align-items-center">
                                            <div className="dash_title">Plan lists</div>
                                            <Link to="/admin/dashboard" className="custom_btn btn_yellow w-auto btn">Back</Link>
                                        </div>
                                    </div>
                                <div>
                                    <DataTableExtensions
                                        columns={this.category_column}
                                        data={allPlanData}>
                                        <DataTable
                                            pagination
                                            noHeader
                                            highlightOnHover
                                            defaultSortField="id"
                                            defaultSortAsc={false}
                                            selectedRows={selectedRows}
                                        />
                                    </DataTableExtensions>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </React.Fragment>
        );
    }
}

export default AdminManageSubPlan;