import React, { Component } from 'react';
import { Elements, ElementsConsumer } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import ServiceCheckout from './ServiceCheckout';

// Publishable key
const stripePromise = loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY);

class ServiceCheckoutStripe extends Component {
    render() {
        return (
            <Elements stripe={stripePromise}>
                <ElementsConsumer>
                    {({ elements, stripe }) => (
                        <ServiceCheckout elements={elements} stripe={stripe} />
                        
                    )}
                </ElementsConsumer>
            </Elements>
        );
    }
}

export default ServiceCheckoutStripe;

