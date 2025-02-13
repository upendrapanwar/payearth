import React, { Component } from 'react';
import Header from './../../components/user/common/Header';
import PageTitle from './../../components/user/common/PageTitle';
import Footer from './../../components/common/Footer';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import Total from '../../components/user/common/Total';
import CartItem from '../../components/user/common/CartItem';
import { connect } from 'react-redux';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../store/reducers/cart-slice-reducer';
import { updateCart } from "../../store/reducers/cart-slice-reducer";
import emptyCart from './../../assets/images/empty-cart.png';
import { Helmet } from 'react-helmet';
class MyCart extends Component {
    constructor(props) {
        super(props);
        this.authInfo = JSON.parse(localStorage.getItem('authInfo'));
        this.state = {
            data: [],
            couponCode: null,
            couponData: null,
            reqBody: {
                count: {
                    start: 0,
                    limit: 5
                }
            },
        };
        toast.configure();
    }


    async componentDidMount() {
        const authInfo = this.authInfo;
        const cart = this.props.cart;
        //  console.log('cart data first time ------',cart)
        if (!authInfo) {
            return;
        }

        const { id, token } = authInfo;
        const cartFromRedux = this.props.cart;
        console.log('cartFromRedux', cartFromRedux)
        const updateCartData = {
            cartFromRedux: cartFromRedux,
            userId: id
        }

        try {
            //  console.log('Update cart data on login...');
            const response = await axios.post('user/updateCartData', updateCartData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${token}`,
                }
            });

            const dbCart = response?.data?.data || [];
            //   console.log('Cart data fetched from DB:', response);

            // if (dbCart.length > 0) {
            //     const mergedCart = this.mergeCartData(cartFromRedux, dbCart);
            //     this.updateCartInRedux(mergedCart); 
            //     this.setState({ data: mergedCart });
            // } else {
            //     console.log('No cart data found in the database.');
            // }
        } catch (err) {
            toast.error('Error while updating cart data on login:', err);
        }


        try {
            //   console.log('Fetching cart data...');
            const response = await axios.get(`user/getCartData/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${token}`,
                }
            });

            const dbCart = response?.data?.data || [];
            //  console.log('Cart data fetched from DB:', dbCart);

            if (dbCart.length > 0) {
                const mergedCart = this.mergeCartData(cartFromRedux, dbCart);
                this.updateCartInRedux(mergedCart);
                this.setState({ data: mergedCart });
            } else {
                console.log('No cart data found in the database.');
            }
        } catch (err) {
            console.error('Error while fetching cart data:', err);

            if (err.response) {
                const message = err.response?.data?.data?.message || 'An unexpected error occurred.';
                toast.error(message, { autoClose: 3000 });
            } else {
                toast.error('Network error or server unreachable.', { autoClose: 3000 });
            }
        }
    }


    mergeCartData = (reduxCart, dbCart) => {
        //  console.log('Redux Cart:', reduxCart);
        //  console.log('Database Cart:', dbCart);

        const validDbCart = dbCart.filter(dbProduct => {
            if (!Array.isArray(dbProduct?.products) || dbProduct.products.length === 0) {
                console.error('Invalid products array in DB cart:', dbProduct);
                return false;
            }

            const hasValidProduct = dbProduct.products.some(product => product?.productId?.id);
            if (!hasValidProduct) {
                console.error('No valid product in DB cart item:', dbProduct);
            }

            return hasValidProduct;
        });

        const mergedCart = [...reduxCart];

        validDbCart.forEach(dbProduct => {
            dbProduct.products.forEach(product => {
                const dbProductId = product?.productId?.id;

                if (!dbProductId) {
                    console.warn('Skipping product with missing ID:', product);
                    return;
                }

                const existingProductIndex = mergedCart.findIndex(item => item.id === dbProductId);

                if (existingProductIndex !== -1) {
                    //   console.log('Updating existing product in Redux cart:', mergedCart[existingProductIndex]);
                    mergedCart[existingProductIndex] = {
                        ...mergedCart[existingProductIndex],
                        quantity: product?.qty,
                        discountId: product?.discountId?.id || null,
                        discountPercent: product?.discountId?.discount || 0
                    };
                } else {
                    //  console.log('Adding new product from DB to cart:', product);
                    mergedCart.push({
                        id: dbProductId || 'Unknown ID',
                        image: product?.productId?.featuredImage || 'default-image-url.jpg',
                        name: product?.productId?.name || 'Unknown Name',
                        price: product?.price || 0,
                        quantity: product?.qty || 1,
                        discountId: product?.discountId?.id || null,
                        discountPercent: product?.discountId?.discount || 0
                    });
                }
            });
        });

        console.log('Merged Cart data:', mergedCart);
        return mergedCart;
    };



    updateCartInRedux = (mergedCart) => {
        const { dispatch } = this.props;

        if (typeof dispatch !== 'function') {
            console.error('dispatch is not a function');
            return;
        }

        //  console.log('Updating Redux cart with merged data:', mergedCart);
        dispatch(updateCart(mergedCart));

        //toast.success('Cart data successfully updated!', { autoClose: 3000 });
    };


    handleApplyCoupon = async () => {
        const { couponCode } = this.state;
        const { token, id } = this.authInfo;
        try {
            const response = await axios.get(`user/coupon/${couponCode}?userId=${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.data.status === true) {
                let data = response.data.data;
                this.setState({ couponData: data });
                toast.success(response.data.message, { autoClose: 3000 });
            }
            if (response.data.status === false) {
                console.log("Error message", response.data.message);
                toast.error(response.data.message, { autoClose: 3000 });
            }
        } catch (err) {
            console.error("Error caught:", err);
            if (err.response) {
                const status = err.response.status;
                const message = err.response.data?.data?.message || "An unexpected error occurred.";
                console.log("Error status:", status, "Message:", message);
                if (status === 404) {
                    toast.error(message, { autoClose: 3000 });
                } else if (status === 400) {
                    toast.error("Invalid request: " + message, { autoClose: 3000 });
                } else {
                    toast.error(message, { autoClose: 3000 });
                }
            } else {
                toast.error("Network error or server unreachable.", { autoClose: 3000 });
            }
        }
    };



    render() {
        const cart = this.props.cart;
        console.log('final updated cart data of redux cart----', cart)
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
                <Helmet><title>{"My Cart - Pay Earth"}</title></Helmet>
                <Header />
                <PageTitle title="My Cart" />
                <section className="inr_wrap">
                    <div className="container">
                        <div className="bg-white rounded-3">
                            <div className='row'>
                                <div className={cart.length === 0 ? "col-md-12" : "col-md-8"}>
                                    <div className="cart my_cart m-2">
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
                                                        {/* {this.props.cart.map((item) => {
                                                           // console.log('item----',item)
                                                            // return <CartItem key={item.id} id={item.id} image={item.image} title={item.name} price={item.price} quantity={item.quantity} discountId={item.discountId} discountPercent={item.discountPercent} />
                                                        })} */}
                                                        {cart.map((item) => {
                                                            // console.log('item---for cartItem--', item)
                                                            return (
                                                                <CartItem key={item.id} id={item.id} image={item.image} title={item.name} price={item.price} quantity={item.quantity} discountId={item.discountId} discountPercent={item.discountPercent} coins={item.coins} />
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        }
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    {cart.length === 0 ? "" :
                                        <div className="cart_wrap mb-5">
                                            <div className="items_incart d-flex justify-content-center align-items-center">
                                                <span>have a coupons <Link to="/my-coupons">Click here to have</Link> </span>
                                            </div>
                                            <div className="cart_wrap">
                                                <div className="checkout_cart_wrap">
                                                    <p>IF YOU HAVE A COUPON CODE,PLEASE APPLY IT BELOW </p>
                                                    <div className="input-group d-flex">
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Enter your coupons code"
                                                            aria-label="Example text with button addon"
                                                            value={this.state.couponCode}
                                                            onChange={(e) => this.setState({ couponCode: e.target.value })}
                                                            id="myCoupon"
                                                        />
                                                        <button
                                                            className="btn custom_btn btn_yellow"
                                                            type="button"
                                                            onClick={this.handleApplyCoupon}
                                                        >
                                                            {" "}
                                                            Apply coupns code
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                    {cart.length === 0 ? "" : <Total couponData={this.state.couponData} />}
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
