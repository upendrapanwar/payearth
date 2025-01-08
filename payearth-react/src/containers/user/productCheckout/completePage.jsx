import React, { useEffect, useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { Link } from "react-router-dom/cjs/react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import SpinnerLoader from "../../../components/common/SpinnerLoader";

const SuccessIcon =
    <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M15.4695 0.232963C15.8241 0.561287 15.8454 1.1149 15.5171 1.46949L6.14206 11.5945C5.97228 11.7778 5.73221 11.8799 5.48237 11.8748C5.23253 11.8698 4.99677 11.7582 4.83452 11.5681L0.459523 6.44311C0.145767 6.07557 0.18937 5.52327 0.556912 5.20951C0.924454 4.89575 1.47676 4.93936 1.79051 5.3069L5.52658 9.68343L14.233 0.280522C14.5613 -0.0740672 15.1149 -0.0953599 15.4695 0.232963Z" fill="white" />
    </svg>;

const ErrorIcon =
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M1.25628 1.25628C1.59799 0.914573 2.15201 0.914573 2.49372 1.25628L8 6.76256L13.5063 1.25628C13.848 0.914573 14.402 0.914573 14.7437 1.25628C15.0854 1.59799 15.0854 2.15201 14.7437 2.49372L9.23744 8L14.7437 13.5063C15.0854 13.848 15.0854 14.402 14.7437 14.7437C14.402 15.0854 13.848 15.0854 13.5063 14.7437L8 9.23744L2.49372 14.7437C2.15201 15.0854 1.59799 15.0854 1.25628 14.7437C0.914573 14.402 0.914573 13.848 1.25628 13.5063L6.76256 8L1.25628 2.49372C0.914573 2.15201 0.914573 1.59799 1.25628 1.25628Z" fill="white" />
    </svg>;

const InfoIcon =
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M10 1.5H4C2.61929 1.5 1.5 2.61929 1.5 4V10C1.5 11.3807 2.61929 12.5 4 12.5H10C11.3807 12.5 12.5 11.3807 12.5 10V4C12.5 2.61929 11.3807 1.5 10 1.5ZM4 0C1.79086 0 0 1.79086 0 4V10C0 12.2091 1.79086 14 4 14H10C12.2091 14 14 12.2091 14 10V4C14 1.79086 12.2091 0 10 0H4Z" fill="white" />
        <path fillRule="evenodd" clipRule="evenodd" d="M5.25 7C5.25 6.58579 5.58579 6.25 6 6.25H7.25C7.66421 6.25 8 6.58579 8 7V10.5C8 10.9142 7.66421 11.25 7.25 11.25C6.83579 11.25 6.5 10.9142 6.5 10.5V7.75H6C5.58579 7.75 5.25 7.41421 5.25 7Z" fill="white" />
        <path d="M5.75 4C5.75 3.31075 6.31075 2.75 7 2.75C7.68925 2.75 8.25 3.31075 8.25 4C8.25 4.68925 7.68925 5.25 7 5.25C6.31075 5.25 5.75 4.68925 5.75 4Z" fill="white" />
    </svg>;

const STATUS_CONTENT_MAP = {
    succeeded: {
        text: "Payment succeeded",
        iconColor: "#30B130",
        icon: SuccessIcon,
    },
    processing: {
        text: "Your payment is processing.",
        iconColor: "#6D6E78",
        icon: InfoIcon,
    },
    requires_payment_method: {
        text: "Your payment was not successful, please try again.",
        iconColor: "#DF1B41",
        icon: ErrorIcon,
    },
    default: {
        text: "Please wait...",
        iconColor: "#DF1B41",
        icon: ErrorIcon,
    }
};

export default function CompletePage() {
    const stripe = useStripe();
    const authInfo = JSON.parse(localStorage.getItem("authInfo"));
    const [status, setStatus] = useState("default");
    const [intentId, setIntentId] = useState(null);
    const [paymentId, setPaymentId] = useState(null);
    const [invoiceData, setInvoiceData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!stripe) return;

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) return;

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            if (!paymentIntent) return;

            setStatus(paymentIntent.status);
            setIntentId(paymentIntent.id);
            handleInvoiceCreation(paymentIntent.id);
        });
    }, [stripe]);

    const handleInvoiceCreation = async (intentId) => {
        setLoading(true);
        try {
            const invoiceData = await createInvoice(intentId);
            console.log("invoiceData", invoiceData);
            if (invoiceData) {
                const paymentData = formatPaymentData(invoiceData);
                const paymentId = await managePaymentData(paymentData);
                const userData = await getProfileById(authInfo.id)
                if (paymentId) {
                    setPaymentId(paymentId);
                    await manageOrderStatus(invoiceData, paymentId, userData);

                }
            }
        } catch (error) {
            console.error("Error during invoice creation:", error);
        } finally {
            setLoading(false);
        }
    };

    const createInvoice = async (intentId) => {
        try {
            const reqBody = { paymentIntentId: intentId };
            const response = await axios.post("user/createInvoice/", reqBody, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: `Bearer ${authInfo.token}`,
                },
            });

            if (response.data.status) {
                const data = response.data.data;
                setInvoiceData(data);
                return data;
            } else {
                throw new Error(response.data.message || "Failed to create invoice.");
            }
        } catch (error) {
            console.error("Error in createInvoice:", error);
            toast.error("Failed to create invoice.");
            return null;
        }
    };

    const formatPaymentData = (invoiceData) => {
        return [
            {
                userId: authInfo.id,
                sellerId: null,
                amountPaid: invoiceData.invoiceItem.amount / 100,
                paymentAccount: "Stripe",
                invoiceUrl: invoiceData.finalizedInvoice.invoice_pdf,
                paymentStatus: invoiceData.finalizedInvoice.status,
            },
        ];
    };

    const managePaymentData = async (paymentData) => {
        try {
            const response = await axios.post("user/savepayment", paymentData, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: `Bearer ${authInfo.token}`,
                },
            });

            if (response.data.status) {
                return response.data.data;
            } else {
                throw new Error(response.data.message || "Failed to save payment data.");
            }
        } catch (error) {
            console.error("Error saving payment data:", error);
            toast.error("Failed to save payment data.");
            return null;
        }
    };

    const getProfileById = async (userId) => {
        try {
            // console.log("Profile Data:");
            const response = await axios.get(`user/my-profile/${userId}`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: `Bearer ${authInfo.token}`,
                },
            });

            //console.log("Profile Data response:", response);
            if (response && response.data) {
                // console.log("Profile Data:", response.data);
                // setUser(response.data.data);
                // const name = response.data.data.name;

                // const [first, last] = name.split(" ");
                // setFirstName(first);
                // setLastName(last);
                return response.data.data;
            }
        } catch (error) {
            console.error("Error fetching profile data:", error);
            throw error; // Handle error if API call fails
        }
    };

    const manageOrderStatus = async (data, paymentId, userData) => {
        try {
            const productData = JSON.parse(data.invoiceItem.metadata.cart);
            console.log("productData", productData)
            const orderResId = [];

            for (let product of productData) {
                if (!product.id || !product.name) {
                    alert("Product ID and Title are required for all products.");
                    return;
                }

                const payload = {
                    ...product,
                    status: "Order placed", // Processing // Shipped // Delivered
                    userId: authInfo.id,
                    paymentId: paymentId,
                    product: {
                        productId: product.id,
                        quantity: product.quantity || 0,
                        price: product.price || 0,
                        color: product.color || "",
                        size: product.size || ""
                    },
                    service: null,
                    serviceCreateCharge: null,
                    subscriptionPlan: null
                };

                const response = await axios.post("user/updateorderstatus", payload, {
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json;charset=UTF-8",
                        Authorization: `Bearer ${authInfo.token}`,
                    },
                });

                console.log("Update Order Response:", response.data);
                orderResId.push(response.data.data.id);
            }


            onSubmitHandler(orderResId, data, paymentId, userData);
        } catch (error) {
            alert("Failed to create some order statuses.");
            console.error("Error updating order status:", error);
        }
    };

    const onSubmitHandler = (orderResId, data, paymentId, userData) => {
        // console.log("Final orderResId:", orderResId);
        console.log("userData in onSubmitHANDLER .....", userData);
        const fullname = userData.name;
        const [first, last] = fullname.split(" ");
        const url = 'user/saveorder';
        // const productData = data.invoiceItem.metadata.cart;
        if (data.finalizedInvoice.status === "paid") {
            let reqBody = {}
            reqBody = {
                data: {
                    userId: authInfo.id,
                    paymentId: paymentId,
                    sellerId: null,
                    billingFirstName: first,
                    billingLastName: last,
                    billingCity: "billingCity",
                    billingCompanyName: "billingCompanyName",
                    billingCounty: "billingCounty",
                    billingPhone: "billingPhone",
                    billingPostCode: "billingPostCode",
                    billingStreetAddress: "billingStreetAddress",
                    billingStreetAddress1: "billingStreetAddress1",
                    billingEmail: "billingEmail",
                    deliveryCharge: data.invoiceItem.metadata.deliveryCharge,
                    taxPercent: 0,
                    taxAmount: data.invoiceItem.metadata.taxAmount,
                    discount: data.invoiceItem.metadata.discount,
                    price: data.invoiceItem.amount / 100,
                    total: data.invoiceItem.amount / 100,
                    orderStatus: orderResId,
                    isActive: true,
                    isService: false,
                    isSubscription: false,
                },
                user_id: authInfo.id
            }

            axios.post(url, reqBody.data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`,
                }
            }).then((response) => {
                toast.success('Order Placed Successfull', { autoClose: 3000 });
                console.log(" Order Placed response++++ : ", response);
                // console.log("response++++ : ", response.data.status);
                if (response.data.status === true) {
                    // this.addOrderTimeLine(response.data.data, orderStatus);
                    // console.log("response userSave order : ", response);
                    // this.saveOrderDetails(response.data.data, product_sku, orderStatus);
                }
            }).catch(error => {
                console.log(error)
                toast.error(error);
            });
        } else {
            toast.dismiss();
            toast.error('Order is not placed.Please try again.');
        }

    };

    return (
        <div id="payment-status">
            {loading ? (
                <SpinnerLoader />
            ) : (
                <>
                    <div
                        id="status-icon"
                        style={{ backgroundColor: STATUS_CONTENT_MAP[status].iconColor }}
                    >
                        {STATUS_CONTENT_MAP[status].icon}
                    </div>
                    <h2 id="status-text">{STATUS_CONTENT_MAP[status].text}</h2>
                    {intentId && (
                        <div id="details-table">
                            <table>
                                <tbody>
                                    <tr>
                                        <td className="TableLabel">id</td>
                                        <td id="intent-id" className="TableContent">
                                            {intentId}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="TableLabel">status</td>
                                        <td id="intent-status" className="TableContent">
                                            {status}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                    {intentId && (
                        <a
                            href={`https://dashboard.stripe.com/payments/${intentId}`}
                            id="view-details"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            View details
                        </a>
                    )}
                    <div className="ctn_btn">
                        <Link to="/product-listing" className="view_more">
                            Continue shopping
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

