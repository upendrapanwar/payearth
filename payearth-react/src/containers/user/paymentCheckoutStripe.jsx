import React, { Component } from 'react';
import store from '../../store/index';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import BannerCheckOut from './BannerCheckOut';
import ServiceCheckOut from './ServiceChargeCheckout';


const stripePromise = loadStripe(`${process.env.REACT_APP_PUBLISHABLE_KEY}`);

class StripePaymentForm extends Component {
    render() {
        return (
            <Elements stripe={stripePromise}>
                <ElementsConsumer>
                    {({ elements, stripe }) => (
                        // <BannerCheckOut elements={elements} stripe={stripe} />,
                        <ServiceCheckOut elements={elements} stripe={stripe} />
                    )}
                </ElementsConsumer>
            </Elements>
        );
    }
}

export default StripePaymentForm;

