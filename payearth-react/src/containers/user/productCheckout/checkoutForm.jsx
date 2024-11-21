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

  // const handleSubmit = async (e) => {
  //   remove();
  //   e.preventDefault();
  //   if (!stripe || !elements) {
  //     toast.error("Stripe.js has not loaded yet. Please wait.");
  //     return;
  //   }
  //   setIsLoading(true);
  //   const { error } = await stripe.confirmPayment({
  //     elements,
  //     confirmParams: {
  //       return_url: "https://localhost:3000/checkOutCompletePage",
  //     },
  //   });

  //   if (error.type === "card_error" || error.type === "validation_error") {
  //     toast.error(error.message);
  //     setMessage(error.message);
  //   } else {
  //     setMessage("An unexpected error occurred.");
  //   }
  //   setIsLoading(false);
  // };


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
        return_url: "https://www.pay.earth/checkOutCompletePage",
        // return_url: "https://localhost:3000/checkOutCompletePage",
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

    // Payment successful, log the PaymentIntent
    // console.log("Payment succeeded:", paymentIntent);
    // await createInvoice(paymentIntent.id);
  };

  // const createInvoice = async (paymentIntentId) => {
  //   console.log("paymentIntentId", paymentIntentId)
  // }


  const paymentElementOptions = {
    layout: "tabs"
  }

  return (
    <>
      <div id="payment-element-container">
        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <div class="d-grid gap-2">
          <button className="btn btn-primary" type="button" onClick={handleSubmit} id="pay-button" disabled={isLoading || !stripe || !elements}>
            Pay Now{``}
          </button>
        </div>
        {message && <div id="payment-message">{message}</div>}
      </div>
    </>
  );
}






// import React, { Component } from "react";
// import { PaymentElement } from "@stripe/react-stripe-js";

// class CheckoutForm extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       message: null,
//       isLoading: false,
//     };
//   }

//   handleSubmit = async (e) => {
//     e.preventDefault();
//     const { stripe, elements } = this.props;




//     if (!stripe || !elements) {
//       // Stripe.js hasn't yet loaded.
//       // Make sure to disable form submission until Stripe.js has loaded.
//       return;
//     }

//     this.setState({ isLoading: true });

//     const { error } = await stripe.confirmPayment({
//       elements,
//       confirmParams: {
//         // Make sure to change this to your payment completion page
//         return_url: "https://localhost:3000/",
//       },
//     });

//     if (error) {
//       const message =
//         error.type === "card_error" || error.type === "validation_error"
//           ? error.message
//           : "An unexpected error occurred.";
//       this.setState({ message });
//     }

//     this.setState({ isLoading: false });
//   };

//   render() {
//     const { stripe, elements } = this.props;

//     console.log("elements", elements);
//     console.log("stripe", stripe);
//     const { isLoading, message } = this.state;

//     const paymentElementOptions = {
//       layout: "tabs",
//     };

//     return (
//       <>
//         <form
//           id="payment-form"
//           onSubmit={this.handleSubmit}>
//           <PaymentElement id="payment-element"
//             options={paymentElementOptions}
//           />
//           <button
//             disabled={isLoading || !stripe || !elements}
//             id="submit"
//           >
//             <span id="button-text">
//               {isLoading ? (
//                 <div className="spinner" id="spinner"></div>
//               ) : (
//                 "Pay now"
//               )}
//             </span>
//           </button>
//           {/* Show any error or success messages */}
//           {message && <div id="payment-message">{message}</div>}
//         </form>
//         <div id="dpm-annotation">
//           <p>
//             Payment methods are dynamically displayed based on customer location, order amount, and currency.
//           </p>
//         </div>
//       </>
//     );
//   }
// }

// export default CheckoutForm;

