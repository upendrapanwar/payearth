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
        }
    }

    componentDidMount() {
        this.getSubData();
    }

    // generateUniqueSlug = (names) => {
    //     return names
    //         .toLowerCase()
    //         .replace(/[^a-z0-9 -]/g, '')
    //         .replace(/\s+/g, '-')
    //         .replace(/-+/g, '-')
    //         .trim();
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

    // handleSaveInDatabase = (data) => {
    //     console.log("data>>>>>>>>>>>>>>>>>", data)
    // }


    // handleRowSelected = (state) => {
    //     this.setState({ selectedRows: state.selectedRows });
    // };

    // handleDeleteSeletedData = () => {
    //     const { selectedRows } = this.state;
    //     // console.log("selected data", selectedRows)
    //     for (let i = 0; i < selectedRows.length; i++) {
    //         const ids = selectedRows[i].id
    //         axios.delete(`/admin/categoryDelete/${ids}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${this.authInfo.token}`
    //             }
    //         }).then((res) => { console.log('Row Data', res.data) })
    //             .catch((error) => {
    //                 console.log("error", error)
    //             })
    //         this.setState({ loading: true })
    //     }
    //     this.getCategory();
    // }

    // handleDeleteSeletedData = (id) => {
    //     const { selectedRows } = this.state;
    //     if (selectedRows == false) {
    //         axios.delete(`/admin/categoryDelete/${id}`, {
    //             headers: {
    //                 'Authorization': `Bearer ${this.authInfo.token}`
    //             }
    //         }).then((res) => {
    //             this.getCategory();
    //             console.log(res.data)
    //         })
    //             .catch((error) => {
    //                 console.log("error", error)
    //             })
    //         // this.setState({ loading: true })

    //     } else {
    //         for (let i = 0; i < selectedRows.length; i++) {
    //             const ids = selectedRows[i].id
    //             axios.delete(`/admin/categoryDelete/${ids}`, {
    //                 headers: {
    //                     'Authorization': `Bearer ${this.authInfo.token}`
    //                 }
    //             }).then((res) => {
    //                 this.getCategory();
    //                 console.log('Row Data', res.data)
    //             })
    //                 .catch((error) => {
    //                     console.log("error", error)
    //                 })
    //         }
    //         // window.location.reload(); 
    //         // this.setState({ loading: true })
    //         this.setState({ selectedRows: "" })
    //     }
    // }

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

    // handleDescription = (e) => {
    //     console.log("Description", e.target.value)
    //     this.setState({ description: e.target.value });
    // };

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
        // {
        //     name: "ADVERTISE ALLOWED",
        //     selector: (row, i) => row.metadata.advertiseAllowed,
        //     sortable: true
        // },
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
        // {
        //     name: ' Date & Time',
        //     selector: (row, i) => row.updatedAt,
        //     sortable: true,
        //     cell: row => {
        //         const options = { year: 'numeric', month: 'long', day: 'numeric' };
        //         const date = new Date(row.updatedAt).toLocaleDateString('en-US', options);
        //         return <div>{date}</div>;
        //     },
        // },
        {
            name: 'Actions',
            cell: (row) => (
                <>
                    <button

                        className="custom_btn btn_yellow_bordered w-auto btn btn-width"
                        onClick={() => this.handleDeletePlan(row.id)}
                    >
                        Delete
                    </button>
                </>
            ),
        },
    ]

    // handleEdit = (id) => {
    //     this.props.history.push(`/admin/category-module-edit/${id}`)
    // }

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
                <div className="container">
                    <Helmet>
                        <title>{"Manage Subscription - Pay Earth"}</title>
                    </Helmet>
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
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


                                    {/* <div className="crt_bnr_fieldRow">
                                        <div className="crt_bnr_field">
                                            <label htmlFor="">Description</label>
                                            <div className="field_item">
                                                <textarea
                                                    type="text"
                                                    name="bannerText"
                                                    // value={this.state.bannerText}
                                                    onChange={this.handleDescription}
                                                    cols="30"
                                                    rows="10"
                                                    className="form-control"
                                                ></textarea>
                                            </div>
                                        </div>
                                    </div> */}

                                    <div className="crt_bnr_fieldRow">
                                        <div className="crt_bnr_field">
                                            <label>Description</label>
                                            <div className="field_item">
                                                <ReactQuill
                                                    //style={{ height: '250px' }}
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
                                        >
                                            Create
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
                                <div className="cp_top">
                                    <div className="cumm_title">Plan List</div>
                                </div>
                                <div
                                // className="cp_body"
                                >
                                    <DataTableExtensions
                                        columns={this.category_column}
                                        data={allPlanData}
                                    >
                                        <DataTable
                                            pagination
                                            noHeader
                                            highlightOnHover
                                            defaultSortField="id"
                                            defaultSortAsc={false}
                                            // selectableRows
                                            selectedRows={selectedRows}
                                        // onSelectedRowsChange={this.handleRowSelected}
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