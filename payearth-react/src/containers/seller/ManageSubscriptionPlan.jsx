import React, { Component } from 'react';
import Header from '../../components/seller/common/Header';
import Footer from '../../components/common/Footer';
import { toast } from 'react-toastify';
import emptyImg from './../../assets/images/emptyimage.png'
import emptyVid from './../../assets/images/emptyVid.png'
import store from '../../store/index';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import Stripe from 'stripe';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import { Helmet } from 'react-helmet';

const stripe = new Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY);

class SellerManageSubscription extends Component {

    constructor(props) {
        super(props);
        this.authInfo = store.getState().auth.authInfo;
        this.userInfo = store.getState().auth.userInfo;

        this.state = {
            displaySubPlan: "",
            subscriptionPlan: "",
            bannerPlacement: "",
            getAllSubscriptionPlan: "",
            status: "",
            author: this.authInfo.id,
            authorDetails: {
                email: this.userInfo.email,
                name: this.userInfo.name,
                role: this.userInfo.role,
            },
            card: "",
            selectImageOrVideo: "",
            isSelectplan: false,
            notSelectedPlan: "",
            loading: true,
        };
    }

    componentDidMount() {
        // this.fetchStripePlans();
        this.getSubscriptionPlanBySeller();
        this.getAllSubscriptionPlan();
        // this.fetchProducts();
    }

    stripeCanclePayment = async (row) => {
        try {
            const data = row.usageCount;
            const matching = data.find(item => item.authorId === this.authInfo.id && item.isActive === true)
            // console.log("matching", matching.sub_id)
            const sub_id = matching.sub_id
            const response = await axios.delete(`https://api.stripe.com/v1/subscriptions/${sub_id}`, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_STRIPE_SECRET_KEY}`, // Replace with your actual Stripe secret key
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            if (response.status === 200) {
                try {
                    const url = `/seller/updateSubscriptionStatus/${row._id}`
                    const data = {
                        usageCount: {
                            sub_id: sub_id
                        },
                    }
                    axios.put(url, data, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json;charset=UTF-8',
                            'Authorization': `Bearer ${this.authInfo.token}`
                        }
                    }).then((response) => {
                        this.getAllSubscriptionPlan();
                        toast.success("Your Subscription Cancled Successfully.....", { autoClose: 3000 })
                    }).catch((error) => {
                        console.log("error", error)
                    })

                } catch (error) {
                    console.log("error")
                }
            }
        } catch (error) {
            alert("Error canceling subscription")
            console.log("Error", error)
        }
    }

    subPlan_column = [
        // {
        //     name: "Plan Id",
        //     selector: (row, i) => row.id,
        //     sortable: true,
        //     width: "350px"
        // },
        {
            name: "Subscription Plan Name",
            selector: (row, i) => row.nickname,
            sortable: true,
        },
        {
            name: "Billing period",
            selector: (row, i) => {
                const result = `Every  ${row.interval_count}-${row.interval}`
                return result
            },
            sortable: true,
        },
        {
            name: "Remaining Advertise Allowed",
            // selector: (row, i) => row.metadata.advertiseAllowed,
            selector: (row, i) => {
                const data = row.usageCount;
                const matching = data.find(item => item.authorId === this.authInfo.id)
                const result = `${row.metadata.advertiseAllowed - matching.count}  in this plan.`
                return result;
            },
            sortable: true,
        },
        {
            name: "Amount",
            selector: (row, i) => {
                const amount = `$ ${row.amount}`
                return amount;
            },
            sortable: true,

        },
        // {
        //     name: "Status",
        //     selector: (row, i) => row.status === "Unpublish" ? <p className='p-1 fw-bold text-white bg-danger bg-opacity-4 border-info rounded'>{row.status}</p> : <p className='p-1 fw-bold text-white bg-success  bg-opacity-4 border-info rounded'>{row.status}</p>,
        //     sortable: true,
        // },
        {
            name: 'Actions',
            cell: (row) => (
                <>
                    <button
                        className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                        onClick={() => this.stripeCanclePayment(row)}
                    >
                        Cancel plan
                    </button>
                </>
            ),
        },
        // {
        //     name: '',
        //     cell: (row) => (
        //         <>
        //             <input
        //                 type="radio"
        //                 name="selectedRow"
        //                 value={row._id}
        //                 onChange={() => this.handleCheckboxChange(row)}
        //             />
        //         </>
        //     ),
        // },
    ]

    getAllSubscriptionPlan = async () => {
        try {
            const url = `/seller/getSubscriptionPlanBySeller/${this.authInfo.id}`;
            axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`
                },
            })
                .then((response) => {
                    if (Array.isArray(response.data.data) && response.data.data.length > 0) {
                        this.setState({
                            getAllSubscriptionPlan: response.data.data,
                            loading: false,
                        })
                    } else {
                        this.setState({
                            getAllSubscriptionPlan: "",
                            loading: false,
                        })
                    }
                })
                .catch(error => {
                    console.log("Error in fetching plan", error)
                    this.setState({
                        getAllSubscriptionPlan: "",

                    })
                })
        } catch (error) {
            console.error('No plan Selected', error);
        }
    }

    fetchProducts = async (data) => {
        console.log("Sub plan already selected: ", data)

        try {
            if (data) {
                const plans = await stripe.plans.list();
                const displaySubPlan = plans.data.filter(item => item.metadata.planType === 'Advertisement')

                // console.log("result :", displaySubPlan)

                const notSelectedPlan = displaySubPlan.filter(obj1 =>
                    !data.some(obj2 => obj2.id === obj1.id)
                );

                // console.log("notSelectedPlan :", notSelectedPlan);

                this.setState({
                    displaySubPlan: displaySubPlan,
                    notSelectedPlan: notSelectedPlan,
                    loading: false,
                })
            } else {
                const plans = await stripe.plans.list();
                const result = plans.data.filter(item => item.metadata.planType === 'Advertisement')
                this.setState({
                    displaySubPlan: result,
                    loading: false,
                })
            }
        } catch (error) {
            console.error('Error fetching products: ', error);
        }
    };


    handleSave = () => {
        // console.log("subscription plan ", subscriptionPlan)
        this.props.history.push({
            pathname: '/seller/service-checkout',
            // state: { subscriptionPlan: subscriptionPlan },
        });
    }

    notify = () => toast.error("Currently this plan is Active..", {
        position: "bottom-center",
        theme: "colored",
    });

    handleSubscriptionPlan = (card) => {
        const { getAllSubscriptionPlan } = this.state;
        if (getAllSubscriptionPlan !== '') {
            const result = getAllSubscriptionPlan.map(item => item.id)
            const data = result.includes(card.id) ? true : false;
            if (data === true) {
                this.notify()
            } else {
                this.setState({ subscriptionPlan: card });
                this.setState({ isSelectplan: true })
                sessionStorage.setItem('selectPlan', JSON.stringify(card));
            }
        } else {
            this.setState({ subscriptionPlan: card });
            this.setState({ isSelectplan: true })
            sessionStorage.setItem('selectPlan', JSON.stringify(card));
        }
    };

    getSubscriptionPlanBySeller = async () => {
        try {
            const url = `/seller/getSubscriptionPlanBySeller/${this.authInfo.id}`;
            axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`
                },
            })
                .then((response) => {
                    // console.log("res>>>>.", response.data)
                    if (response.data.status === true) {
                        const data = response.data.data;
                        console.log("data", data)
                        if (data.length === 0) {
                            this.fetchProducts();
                        } else {
                            // const res = data[0].usageCount
                            // const res = data.map(item => item.usageCount)
                            // console.log("res else:  ", res)
                            // const sub = res.filter(item => item.authorId === this.authInfo.id)
                            // console.log("result filteredddd>>>.", sub.sub_id)

                            this.fetchProducts(data);
                        }
                    }
                })
                .catch(error => {
                    console.log("Error in fetching plan", error)
                    this.setState({
                        loading: false,
                    })
                })
        } catch (error) {
            console.error('No plan Selected', error);
        }
    }


    render() {
        const { subscriptionPlan, displaySubPlan, loading, getAllSubscriptionPlan } = this.state;

        console.log("getAllSubscriptionPlan", getAllSubscriptionPlan)
        console.log("displaySubPlan", displaySubPlan)
        if (loading) {
            return <SpinnerLoader />
        }
        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ""}
                <Header />
                <div className="inr_top_page_title">
                    <h2>Subscription Plan</h2>
                </div>
                <Helmet>
                    <title>{"Manage Subscription - Pay Earth"}</title>
                </Helmet>
                <section className="inr_wrap">
                    <div className="container">
                        <div className="row">
                            {/* <div>
                                <h1>My Subscription</h1>
                            </div> */}
                            <div className="col-md-12 bg-body-tertiary plan-cart">
                                <div className="row mt-3">
                                    {getAllSubscriptionPlan !== "" ? <>
                                        <div className='subPlan'>
                                            <div className="dash_title">My Active Subscriptions</div>
                                            <DataTableExtensions
                                                columns={this.subPlan_column}
                                                data={getAllSubscriptionPlan}
                                                noHeader
                                            >
                                                <DataTable
                                                    pagination
                                                    highlightOnHover
                                                />
                                            </DataTableExtensions>
                                        </div>
                                    </> : <> </>
                                    }
                                </div>
                                <div className="wrapper">
                                    <div className="pricing-table group">
                                        {displaySubPlan !== "" ? <>
                                            {displaySubPlan.map((card) => <>
                                                <li key={card.id} onClick={() => this.handleSubscriptionPlan(card)}>
                                                    <div className={subscriptionPlan.id === card.id ? "block personal fl active" : "block personal fl"}>
                                                        <a className='inner-block'>
                                                            <h2 className="title" >{card.nickname}</h2>
                                                            <div className="content">
                                                                <p className="price">
                                                                    <sup>$</sup>
                                                                    <span>{card.amount / 100}</span>

                                                                </p>
                                                                <p className="hint">Payment Interval Per {card.interval_count} {card.interval}</p>
                                                                <p className="hint">Advertisements Allowed {card.metadata.advertiseAllowed}</p>
                                                            </div>
                                                            <div className='features' dangerouslySetInnerHTML={{ __html: card.metadata.descriptions }}></div>
                                                        </a>
                                                    </div>
                                                </li>
                                            </>)}
                                        </> : <>
                                            <h1>NO PLAN FOUND</h1>
                                        </>}
                                    </div>
                                </div>
                                <div className="crt_bnr_fieldRow">
                                    <div className="crt_bnr_field">
                                        <div className="field_item text-center">
                                            <button
                                                disabled={this.state.isSelectplan === false}
                                                className="btn custom_btn btn_yellow mx-auto createbtn"
                                                onClick={this.handleSave}
                                            >
                                                PURCHASE PLAN
                                            </button>
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

export default SellerManageSubscription;