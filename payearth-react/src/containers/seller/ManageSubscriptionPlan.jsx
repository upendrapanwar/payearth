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
import Stripe from 'stripe';
import SpinnerLoader from '../../components/common/SpinnerLoader';

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
            customerId: "",
            subscriptionId: "",
            sellerSubscriptionPlan: "",
            previousPlan: "",
            paymentMethodId: null,
            loading: true,
        };
    }

    componentDidMount() {
        // this.fetchStripePlans();
        this.fetchProducts();
        this.getSubscriptionPlanBySeller();
    }

    fetchProducts = async () => {
        try {
            // const productList = await stripe.products.list();
            const plans = await stripe.plans.list();
            // console.log("plan Data", plans.data)
            const AdvertisePlan = plans.data.filter(item => item.metadata.planType === 'Advertisement')
            // console.log("planes", plans.data.filter(item => item.metadata.planType === 'Advertisement'))
            this.setState({
                displaySubPlan: AdvertisePlan,
                loading: false,
            })
            //   setProducts(plans.data);
        } catch (error) {
            console.error('Error fetching products: ', error);
        }
    };



    handleSave = () => {
        const { subscriptionPlan } = this.state;
        // console.log("subscription plan ", subscriptionPlan)
        this.props.history.push({
            pathname: '/seller/service-checkout',
            state: { subscriptionPlan: subscriptionPlan },
        });
    }


    handleSubscriptionPlan = (card) => {
        // console.log("card", card)
        this.setState({ subscriptionPlan: card });
        this.setState({ isSelectplan: true })
        sessionStorage.setItem('selectPlan', JSON.stringify(card));
    };

    getSubscriptionPlanBySeller = async () => {
        try {
            const url = `/seller/getSubscriptionPlanBySeller/${this.authInfo.id}`;
            axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`
                },
            })
                .then(response => {
                    // console.log("res>>>>.", response.data.data)
                    if (Array.isArray(response.data.data) && response.data.data.length > 0) {
                        const latest = response.data.data;
                        const previousPlan = response.data.data[1]
                        // console.log("latest", latest)
                        // console.log("previousPlan", previousPlan)
                        if (previousPlan !== "") {
                            const { usageCount } = previousPlan;
                            for (const usage of usageCount) {
                                if (usage.authorId === this.authInfo.id && usage.isActive === true) {
                                    // console.log("sub_id with author", usage.sub_id)
                                    // console.log("previous data", usage._id)
                                }
                            }
                        }
                        this.setState({
                            sellerSubscriptionPlan: latest,
                            previousPlan: previousPlan,
                            loading: false,
                        });

                    } else {
                        this.setState({
                            sellerSubscriptionPlan: "",
                            previousPlan: "",
                            loading: false,
                        });
                    }
                    // this.setState({
                    //     sellerSubscriptionPlan: res.data.data[0],
                    // })
                })
                .catch(error => {
                    console.log("Error in fetching plan", error)
                    // this.setState({
                    //     sellerSubscriptionPlan: "",
                    // })
                })

        } catch (error) {
            console.error('No plan Selected', error);
        }
    }


    render() {
        const { subscriptionPlan, displaySubPlan, loading, sellerSubscriptionPlan } = this.state;
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
                {sellerSubscriptionPlan === "" ?
                    "" :
                    <div className="text-center alert alert-success" >
                        Plan is selected
                    </div>
                }

                <section className="inr_wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 bg-body-tertiary plan-cart">
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
                                                            <ul className="features">
                                                                <p><span className="fontawesome-cog"></span>
                                                                    Advertisements displayed in rotation with other Basic Plan advertisers
                                                                    Access to basic analytics (number of views, clicks, etc.)
                                                                    Support available during business hours</p>
                                                            </ul>
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