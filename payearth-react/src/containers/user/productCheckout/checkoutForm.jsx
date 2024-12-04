import React, { useState } from "react";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { useDispatch } from 'react-redux';
import { clearCart } from "../../../store/reducers/cart-slice-reducer";
import { toast } from "react-toastify";

export default function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  console.log("stripe data in checkout form", stripe);
  console.log("elements data in checkout form", elements);

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const remove = () => {
    dispatch(clearCart());
  };

  const handleSubmit = async (e) => {
    remove();
    e.preventDefault();
    if (!stripe || !elements) {
      toast.error("Stripe.js has not loaded yet. Please wait.");
      return;
    }
    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // return_url: "https://www.pay.earth/checkOutCompletePage",
        return_url: "https://localhost:3000/checkOutCompletePage",
      },
    });

    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        toast.error(error.message);
        setMessage(error.message);
      } else {
        toast.error("An unexpected error occurred.");
        setMessage("An unexpected error occurred.");
      }
      setIsLoading(false);
      return;
    }
  };

  const paymentElementOptions = {
    layout: "tabs"
  }

  return (
    <>
      <div id="payment-element-container">
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <div class="d-grid gap-2 col-6 mx-auto mt-4">
          <button className="btn btn-primary" type="button" onClick={handleSubmit} id="pay-button" disabled={isLoading || !stripe || !elements}>
            Pay Now{``}
          </button>
        </div>
        {message && <div id="payment-message">{message}</div>}
      </div>
    </>
  );
}
