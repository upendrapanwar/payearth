import React, { useEffect } from 'react';
import Header from '../../components/seller/common/Header';
import Footer from '../../components/common/Footer';
import { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import arrow_back from '../../assets/icons/arrow-back.svg'
import { Helmet } from 'react-helmet';
import SpinnerLoader from '../../components/common/SpinnerLoader';

const PaymentGateway = () => {
    const authInfo = JSON.parse(localStorage.getItem('authInfo'));
    const [loading, setLoading] = useState(false);
    const [stripeAccount, setStripeAccount] = useState(null);
    const [onBoardingButtonActive, setOnBoardingButtonActive] = useState(false);
    const [accountDetails, setAccountDetails] = useState(null);

    useEffect(() => {
        getCheckSellerStripeAccountId();
    }, []);

    const getCheckSellerStripeAccountId = async () => {
        const authId = authInfo.id;
        console.log("authId", authId)
        setLoading(true);
        try {
            const response = await axios.get(
                "/seller/getSellerStripeAccountId",
                {
                    params: { authId },
                    headers: {
                        Authorization: `Bearer ${authInfo.token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data.status === true) {
                const stripeAccountId = response.data.data.stripeAccountId;
                setStripeAccount(stripeAccountId);
            } else {
                setStripeAccount(null);
            }
        } catch (error) {
            console.error("Error fetching account:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStripAccountId = async (data) => {
        try {
            const accountId = data.accountId
            const reqBody = {
                "authId": authInfo.id,
                "stripeAccountId": accountId
            }
            const response = await axios.put("/seller/update-stripe-accountId",
                { reqBody },
                {
                    headers: {
                        Authorization: `Bearer ${authInfo.token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data.data.status === true) {
                toast.success(response.data.data.message);
                window.location.href = data.url;
            } else {
                toast.error(response.data.data.message);
            }
        } catch (error) {
            console.error("Error fetching account:", error);
        }
    }

    const handleDisconnectStripeAccount = async () => {
        try {
            const reqBody = {
                "authId": authInfo.id,
                "stripeAccountId": stripeAccount
            }
            const response = await axios.put("/seller/disconnect-stripe-account",
                { reqBody },
                {
                    headers: {
                        Authorization: `Bearer ${authInfo.token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            if (response.data.status === true) {
                getCheckSellerStripeAccountId();
                toast.success(response.data.data.message);
            } else {
                toast.error(response.data.data.message);
            }
        } catch (error) {
            console.error("Error fetching account:", error);
        }




    }

    const handleStripeConnect = async () => {
        setLoading(true);
        try {
            const response = await axios.post("/seller/create-stripe-account", { email: authInfo.email },
                {
                    headers: {
                        Authorization: `Bearer ${authInfo.token}`
                    }
                }
            );
            if (response.data.status === true) {
                handleUpdateStripAccountId(response.data.data);

            } else {
                toast.error("something went wrong");
            }
        } catch (error) {
            console.error("Stripe connection error:", error);
        }
        setLoading(false);
    };

    const completeOnbording = async () => {
        try {
            const response = await axios.post("/seller/complete-onboarding", { stripeAccount },
                {
                    headers: {
                        Authorization: `Bearer ${authInfo.token}`
                    }
                }
            );
            if (response.data.status === true) {
                window.location.href = response.data.data.url;
            } else {
                toast.error("something went wrong");
            }
        } catch (error) {
            console.error("Stripe connection error:", error);
        }
    }

    const fetchStripeAccount = async () => {
        if (!stripeAccount) return;
        try {
            const response = await axios.post(
                "/seller/get-stripe-account",
                { stripeAccount },
                {
                    headers: {
                        Authorization: `Bearer ${authInfo.token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("fetchStripeAccount test login", response);
            // setAccountDetails(response.data);
        } catch (error) {
            console.error("Error fetching account:", error);
        }
    };

    const loginLink = async () => {
        if (!stripeAccount) return;

        try {
            const response = await axios.post(
                "/seller/createLoginLink",
                { stripeAccount },
                {
                    headers: {
                        Authorization: `Bearer ${authInfo.token}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("response after login", response)
            if (response.data.data.error === 'Cannot create a login link for an account that has not completed onboarding.') {
                toast.error(response.data.data.error)
                setOnBoardingButtonActive(true)
            } else {
                window.open(response.data.data.url, "_blank");
            }


        } catch (error) {
            console.error("Error fetching account:", error);
        }
    };

    console.log("stripeAccount", stripeAccount);

    return (
        <React.Fragment>
            {loading === true ? <SpinnerLoader /> : ''}
            <div className="seller_body">
                <Header />
                <div className="inr_top_page_title">
                    <h2>Payment Gateway</h2>
                </div>
                <Helmet>
                    <title>{"Seller - Payment Gateway - Pay Earth"}</title>
                </Helmet>
                <div className="seller_dash_wrap pt-2 pb-5">
                    <div className="container ">
                        <div className="bg-white rounded-3 pt-3 pb-5">
                            <div className="dash_inner_wrap pb-2">
                                <div className="col-md-12 pt-2 pb-3 d-flex justify-content-end align-items-center flex-wrap">
                                    <div className='d-flex justify-content-between align-items-end'>
                                        <div className="ms-4">
                                            <span>
                                                <button
                                                    type="button"
                                                    className="btn custum_back_btn btn_yellow mx-auto"
                                                    onClick={() => window.history.back()}
                                                >
                                                    <img src={arrow_back} alt="back" />&nbsp;
                                                    Back
                                                </button>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {!stripeAccount ? <div className="dash_inner_wrap mt-5 mb-5 mr-3">
                                <div className="col-md-12">
                                    <div className="support_head_panel">
                                        <h2>Connect Your Stripe Account</h2>
                                        <p>We use Stripe to handle payments. Connect your Stripe account to start receiving payments.</p>
                                    </div>
                                    <button type="button" class="btn btn-success" onClick={handleStripeConnect} disabled={loading}>Connect to stripe</button>
                                </div>
                            </div>
                                :
                                <div className="dash_inner_wrap mt-5 mb-5 mr-3">
                                    <div className="col-md-12">
                                        <div className="support_head_panel">
                                            <h2>Stripe Account Connected</h2>
                                            <p>Your Stripe account is successfully connected.</p>
                                            <p><strong>Stripe Account ID:</strong> {stripeAccount}</p>
                                        </div>
                                        {/* <button type="button" className="btn btn-primary" onClick={fetchStripeAccount}>View</button> */}
                                        <button type="button" className="btn btn-primary" onClick={loginLink}>Login</button>
                                        {onBoardingButtonActive === true ?
                                            <button type="button" className="btn btn-warning" onClick={completeOnbording}>Complete Onboarding</button> : ''}

                                        <button type="button" className="btn btn-danger" onClick={handleDisconnectStripeAccount}>Dissconnect Account</button>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Footer />

        </React.Fragment>
    )
}

export default PaymentGateway;