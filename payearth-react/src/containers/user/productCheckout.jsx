// // CheckoutForm.js
// import React, { Component } from 'react';
// // import { CardElement } from '@stripe/react-stripe-js';
// import { ElementsConsumer, PaymentElement } from '@stripe/react-stripe-js';

// class CheckoutForm extends Component {
//     handleSubmit = async (event) => {
//         event.preventDefault();
//         const { stripe, elements } = this.props;

//         console.log("elements", elements)

//         if (!stripe || !elements) {
//             return;
//         }

//         const result = await stripe.confirmPayment({
//             //`Elements` instance that was used to create the Payment Element
//             elements,
//             confirmParams: {
//                 return_url: "https://localhost:3000/",
//             },
//         });

//         if (result.error) {
//             // Show error to your customer (for example, payment details incomplete)
//             console.log(result.error.message);
//         } else {
//             // Your customer will be redirected to your `return_url`. For some payment
//             // methods like iDEAL, your customer will be redirected to an intermediate
//             // site first to authorize the payment, then redirected to the `return_url`.
//         }

//         // const cardElement = elements.getElement(CardElement);
//         // console.log("cardElement", cardElement)

//         // const { error, paymentMethod } = await stripe.createPaymentMethod({
//         //     type: 'card',
//         //     card: cardElement,
//         // });

//         // if (error) {
//         //     console.log('[error]', error);
//         // } else {
//         //     console.log('[PaymentMethod]', paymentMethod);
//         // }
//     };

//     render() {
//         return (
//             <form onSubmit={this.handleSubmit}>
//                 {/* <CardElement options={{ style: { base: { fontSize: '16px', color: '#30313d' } } }} /> */}
//                 <PaymentElement />
//                 <button type="submit" disabled={!this.props.stripe} className="btn btn-primary mt-3">
//                     Pay
//                 </button>
//             </form>
//         );
//     }
// }

// export default CheckoutForm;

import React from 'react';
import { ElementsConsumer, PaymentElement } from '@stripe/react-stripe-js';

class CheckoutForm extends React.Component {
    handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();

        const { stripe, elements } = this.props;

        if (!stripe || !elements) {
            // Stripe.js hasn't yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            return;
        }

        const result = await stripe.confirmPayment({
            //`Elements` instance that was used to create the Payment Element
            elements,
            confirmParams: {
                return_url: "https://example.com/order/123/complete",
            },
        });

        if (result.error) {
            // Show error to your customer (for example, payment details incomplete)
            console.log(result.error.message);
        } else {
            // Your customer will be redirected to your `return_url`. For some payment
            // methods like iDEAL, your customer will be redirected to an intermediate
            // site first to authorize the payment, then redirected to the `return_url`.
        }
    };

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <PaymentElement />
                <button disabled={!this.props.stripe}>Submit</button>
            </form>
        );
    }
}

export default function InjectedCheckoutForm() {
    return (
        <ElementsConsumer>
            {({ stripe, elements }) => (
                <CheckoutForm stripe={stripe} elements={elements} />
            )}
        </ElementsConsumer>
    )
}
