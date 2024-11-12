import React, { Component } from 'react';
import Header from './../../components/user/common/Header';
import PageTitle from './../../components/user/common/PageTitle';
import Footer from './../../components/common/Footer';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
// import mensJacket from './../../assets/images/mens-jacket.png';
// import headphone from './../../assets/images/headphone.png';
// import menBrownShoes from './../../assets/images/men-brown-shoes.png';
// import addToCart from '../../store/reducers/cart-slice-reducer';
// import { useSelector } from 'react-redux';
import Total from '../../components/user/common/Total';
import CartItem from '../../components/user/common/CartItem';
import { connect } from 'react-redux';
//import { CardTravel } from '@mui/icons-material';
import emptyCart from './../../assets/images/empty-cart.png';
class MyCart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            reqBody: {
                count: {
                    start: 0,
                    limit: 5
                }
            },
        };
        toast.configure();
    }

    render() {
        const cart = this.props.cart;
        console.log(cart);
        const getTotal = () => {
            let totalQuantity = 0
            let totalPrice = 0
            cart.forEach(items => {
                totalQuantity += items.quantity
                totalPrice += items.price * items.quantity
            })
            return { totalPrice, totalQuantity }
        }
        return (
            <React.Fragment>
                <Header />
                <PageTitle title="My Cart" />
                <section className="inr_wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="cart my_cart">
                                    {getTotal().totalQuantity === 0 ?
                                        <div align="center">
                                            <img src={emptyCart} alt='...' width="300px" height="300px" />
                                            <h1>Your Cart Is Empty......!</h1>
                                            <div className="ctn_btn"><Link to="/product-listing" className="view_more">Continue shopping</Link></div>
                                            &nbsp;
                                        </div>
                                        :
                                        <div>
                                            <div className="cart_wrap">
                                                <div className="items_incart">
                                                    <span>{getTotal().totalQuantity} Items in your cart</span>
                                                </div>
                                            </div>
                                            <div className="cl_head">
                                                <div className="cart_wrap">
                                                    <div>Product</div>
                                                    <div>Quantity</div>
                                                    <div>Total</div>
                                                    <div className="invisible">Actions</div>
                                                </div>
                                            </div>
                                            <div className="cart_list cart_wrap">
                                                <div className="custom-card">
                                                    {this.props.cart.map((item) => {
                                                        return <CartItem key={item.id} id={item.id} image={item.image} title={item.title} price={item.price} quantity={item.quantity} />
                                                    })}
                                                </div>
                                            </div>
                                            <Total />
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <Footer />
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        cart: state.cart.cart
    }
}

export default connect(mapStateToProps)(MyCart);