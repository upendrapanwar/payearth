import React, { Component } from 'react';
import store from '../../store/index';
import { Elements, CardElement, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import BannerCheckOut from './BannerCheckOut';

// Publishable key
// const stripePromise = loadStripe('pk_test_51OewZgD2za5c5GtOHJm8ZHqCC7p6rjI0SrGzM7rNI53THFqT42SrFMppExvWmx2l6Stdn8XTxtiEX0vFwNBMJceR00GTV6MKAX');

const stripePromise = loadStripe(`${process.env.REACT_APP_PUBLISHABLE_KEY}`);

class StripePaymentForm extends Component {
    render() {
        return (
            <Elements stripe={stripePromise}>
                <ElementsConsumer>
                    {({ elements, stripe }) => (
                        <BannerCheckOut elements={elements} stripe={stripe} />
                    )}
                </ElementsConsumer>
            </Elements>
        );
    }
}

export default StripePaymentForm;

