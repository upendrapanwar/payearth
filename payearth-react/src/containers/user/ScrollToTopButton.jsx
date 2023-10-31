import React, { Component } from 'react';

class ScrollToTopButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
        };
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleScroll = () => {
        if (window.scrollY > 100) { // Adjust the threshold as needed
            this.setState({ isVisible: true });
        } else {
            this.setState({ isVisible: false });
        }
    }

    scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    render() {
        return this.state.isVisible ? (
            <div className="scroll-to-top-button" onClick={this.scrollToTop}>
                Back to Top
            </div>
        ) : null;
    }
}

export default ScrollToTopButton;
