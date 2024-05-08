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

            loading: true,
        };
    }

    componentDidMount() {
        // this.fetchStripePlans();
        this.getSubscriptionPlanBySeller();
        // this.fetchProducts();
    }

    fetchProducts = async (data) => {
        console.log("Sub plan already selected: ", data)
        try {
            if (data) {
                const plans = await stripe.plans.list();
                const result = plans.data.filter(item => item.metadata.planType === 'Advertisement')

                const notSelectedPlan = result.filter(obj1 =>
                    !data.some(obj2 => obj2.id === obj1.id)
                );
                this.setState({
                    displaySubPlan: notSelectedPlan,
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


    handleSubscriptionPlan = (card) => {
        console.log("card", card)
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
                        // console.log("data", data[0].usageCount)

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
        const { subscriptionPlan, displaySubPlan, loading } = this.state;
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