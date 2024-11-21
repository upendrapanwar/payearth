import React, { useEffect, useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CompletePage from "./completePage";
const stripePromise = loadStripe(`${process.env.REACT_APP_PUBLISHABLE_KEY}`);

export default function CheckOutCompletePage() {
    const [status, setStatus] = useState("default");
    const [intentId, setIntentId] = useState(null);

    useEffect(() => {
        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }
        // setStatus(paymentIntent.status);
        setIntentId(clientSecret);
    }, []);

    return (
        <div id="payment-status">
            <Elements stripe={stripePromise} >
                <CompletePage clientSecret={intentId} />
            </Elements>
            {/* <h2 id="status-text">{intentId}</h2> */}


            {/* <a id="retry-button" href="/checkout">Test another</a> */}
        </div>
    );
}