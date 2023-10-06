import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import GoToTop from './../../helpers/GoToTop';
import Header from './../../components/user/common/Header';
import PageTitle from './../../components/user/common/PageTitle';
import Footer from './../../components/common/Footer';
import ProductView from './../../components/user/product-detail/ProductView';
import axios from 'axios';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect,useSelector, useDispatch } from 'react-redux';
import Rating from '../../components/common/Rating';
import twitterIcon from './../../assets/icons/twitter.svg';
import linkedinIcon from './../../assets/icons/linkedin.svg';
import fbIcon from './../../assets/icons/facebook.svg';
import whatsappIcon from './../../assets/icons/whatsapp.svg';
import DetailTabbing from '../../components/user/common/DetailTabbing';
import SimilarProducts from '../../components/user/common/SimilarProducts';
import config from './../../config.json';
import parse from 'html-react-parser';
import { addToCart } from '../../store/reducers/cart-slice-reducer';
import { incrementQuantity, decrementQuantity,removeItem} from "../../store/reducers/cart-slice-reducer"; 
import CartItem from '../../components/user/common/CartItem';   

class ProductDetail extends Component {
    
    constructor(props) {
        super(props);
        this.myRef = React.createRef()
        this.state = {
            id: window.location.pathname.split('/')[2],
            productDetail: {},
            colors: [],
            featuredImg: '',
            thumbnails: [],
            similarProducts:[],
            productId: '',
            sizes: [],
            sizeControlls: []
        };
    }

    componentDidMount() {
        const { dispatch } = this.props;
        
        let productId = window.location.pathname.split('/')[2];
        axios.get('front/product/detail/' + productId).then((response) => {
            let resData = response.data.data;
            if (response.data.status) {
                let colors = [];
                let sizes = [];
                let sizeControlls = [];
                if (resData.color_size && resData.color_size.length > 0) {
                    colors = resData.color_size[0].color;
                } else {
                    colors = [];
                }

                if (resData.color_size && resData.color_size.length > 0) {
                    for (const [key, value] of Object.entries(resData.color_size)) {
                        sizes.push(value.size);
                        sizeControlls.push(parseInt(key) === 0 ? true : false);
                    }
                } else {
                    sizes = [];
                }

                this.setState({
                    id: productId,
                    productDetail: resData,
                    colors,
                    sizes,
                    sizeControlls,
                    featuredImg: resData.featuredImage,
                    thumbnails: resData.images.length ? resData.images[0].paths : []
                });
                console.log(this.state.sizeControlls)
            }
        }).catch(error => {
            console.log(error)
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({loading: false}));
            }, 300);
        });

        axios.get('front/product/similar-products/' + productId).then((response) => {
            let productsData = [];

            if (response.data.status) {
                let res = response.data.data;
                res.forEach(product => {
                    productsData.push({
                        id: product.id,
                        image: config.apiURI + product.featuredImage,
                        name: product.name,
                        isService: product.isService,
                        price: product.price,
                        avgRating: product.avgRating,
                        quantity: product.quantity
                    });
                });
            }
            this.setState({similarProducts: productsData});

        }).catch(error => {
            console.log(error)
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({loading: false}));
            }, 300);
        });
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(prevProps.history.location.pathname !== prevProps.location.pathname) this.componentDidMount();
    }

    scrollToMyRef = () => window.scrollTo(0, this.myRef.current.offsetTop)

    handleColor = param => {
        this.state.productDetail.images.forEach(value => {
            if(value.color === param) this.setState({thumbnails: value.paths});
        });
    }

    handleSize = (param, size) =>{
        let sizeControlls = [];

        // For size button activation
        for (let index = 0; index < this.state.sizeControlls.length; index++) {
            sizeControlls.push(param === index ? true : false);
        }
        this.setState({sizeControlls});

        // For change colors according to size
        this.state.productDetail.color_size.forEach(value => {
            if(value.size === size) {
                this.setState({colors: value.color});
                this.state.productDetail.images.forEach(value2 => {
                    if(value2.color === value.color[0]) this.setState({thumbnails: value2.paths});
                });
            }
        });
    }

    render() {
        const {sizeControlls} = this.state;
        var proQuantity = 0;
        const productID = this.state.id;
        //const dispatch = useDispatch();
        const cart = this.props.payload.cart.cart;
        //const cart = useSelector((state) => state.cart)
        if(this.props.payload.cart) {
            
            Object.keys(cart).forEach(function (key){
                //console.log(cart[key]['id']);
                console.log(cart[key].id);
                if(cart[key].id == productID) {
                    proQuantity = cart[key].quantity;
                }
            });
           
        }
        
        const { dispatch } = this.props;
        return (
            <React.Fragment>
                <Header />
                <PageTitle title={this.state.productDetail.name} />
                <section className="inr_wrap">
                    <div className="container">
                        <div className="row g-0 bg-white rounded">
                            <div className="col-md-7">
                                <ProductView featuredImg={this.state.thumbnails[0]} thumbnails={this.state.thumbnails}/>
                            </div>
                            <div className="col-md-5">
                                <div className="prod_dtl_info">
                                    <div className="prod_dtl_body">
                                        <div className="pdi_ratings">
                                            <Rating avgRating={this.state.productDetail.avgRating} />
                                            <Link to="#" className="reviews_count" onClick={this.scrollToMyRef}>( {this.state.productDetail.reviewCount} Reviews )</Link>
                                        </div>
                                        <div className="pdi_price">
                                            {/* <b>{this.state.productDetail.price} USD</b> OR <b>0.5 BTC</b> */}
                                            <b>{this.state.productDetail.price} USD</b>
                                        </div>
                                        <div className="pdi_avblty">
                                            Availability: {this.state.productDetail.quantity && parseInt(this.state.productDetail.quantity.stock_qty) > 0 ? <span>In stock</span> : <span className="text-danger">Out of stock</span>} | Product Code : <span>{this.state.productDetail.productCode}</span>
                                        </div>
                                        <div className="pdi_desc">
                                            <p>{this.state.productDetail.description ? parse(this.state.productDetail.description) : ''}</p>
                                        </div>
                                        <div className="pdi_fea">
                                            {this.state.colors.length ? <div className="pdi_fea_box">
                                                <div className="heading">Color</div>
                                                <div className="colors_grid">
                                                    {this.state.colors ? this.state.colors.map((value, index) => {
                                                        return <span
                                                                className="color_box"
                                                                style={{backgroundColor: value}}
                                                                key={index}
                                                                onClick={() => this.handleColor(value)}
                                                            ></span>
                                                    }) : ''}
                                                </div>
                                            </div> : ''}
                                            {this.state.sizes.length && this.state.sizes[0] !== 'none' ? <div className="pdi_fea_box">
                                                <div className="heading">Size</div>
                                                <div className="size_grid">
                                                    {this.state.sizes ? this.state.sizes.map((value, index) => {
                                                        return <span
                                                                    key={index}
                                                                    className={`size_box text-uppercase ${sizeControlls[index] ? 'selected' : ''}`}
                                                                    onClick={() => this.handleSize(index, value)}
                                                                >{value}</span>
                                                    }) : ''}
                                                </div>
                                            </div> : ''}
                                        </div>
                                        <div className="pdi_fea">
                                            <div className="pdi_fea_box">
                                                <div className="heading">Quantity</div>
                                                <div className="qnty_select">
                                                    <div className="input-group">
                                                        <button onClick={() => dispatch(incrementQuantity(this.state.id))} className="btn btn-outline-secondary" type="button" id="button-addon1">
                                                            <svg width="13" height="14" viewBox="0 0 13 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <g clipPath="url(#clip0)"><path d="M7.31107 5.81393V0.125H5.68893V5.81393H0V7.43607H5.68893V13.125H7.31107V7.43607H13V5.81393H7.31107Z" fill="black"/></g>
                                                                <defs><clipPath id="clip0"><rect width="13" height="13" fill="white" transform="translate(0 0.125)"/></clipPath></defs>
                                                            </svg>
                                                        </button>
                                                        <input type="text" className="form-control" placeholder="3" aria-label="Example text with button addon" aria-describedby="button-addon1" value={proQuantity}/>
                                                        <button onClick={() => dispatch(decrementQuantity(this.state.id))} className="btn btn-outline-secondary" type="button" id="button-addon2">
                                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                <g clipPath="url(#clip0)"><path d="M7.81107 5.814L6.18893 5.81396L0.5 5.814V7.43615H6.18893H7.81107H13.5V5.814H7.81107Z" fill="black"/></g>
                                                                <defs><clipPath id="clip0"><rect width="13" height="13" fill="white" transform="translate(0.5 0.125)"/></clipPath></defs>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pdi_fea_box ">
                                                <div className="heading">Delivery</div>
                                                <div className="pin_select">
                                                    <div className="input-group">
                                                        <input type="text" className="form-control" placeholder="Pin code" aria-label="" aria-describedby="pin-code" />
                                                        <button className="btn btn-outline-secondary" type="button" id="pin-code">Check</button>
                                                    </div>
                                                    <small className="ms-2">Delivery by <br/>16 Aug Wed</small>
                                                </div>
                                            </div>
                                        </div>
                                        {this.state.productDetail.quantity && this.state.productDetail.quantity.stock_qty > 0 ?
                                            <div className="prod_foot">
                                                <Link className="btn custom_btn btn_yellow_bordered" to="#" onClick={() => 
          dispatch(addToCart({
            id: this.state.productDetail.id, name:this.state.productDetail.name, image: this.state.thumbnails[0], price:this.state.productDetail.price
          }))
        }>Add to cart</Link>
                                                <Link className="btn custom_btn btn_yellow" to="#">Buy Now</Link>
                                            </div>
                                        : ''}
                                    </div>

                                    <div className="pdi_share">
                                        <div className="pdi_seller">
                                            Seller : <b>{this.state.productDetail.createdBy ? this.state.productDetail.createdBy.name : ''}</b> <span className="rate_sts"><svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M16 6.18179L10.1863 5.79957L7.99681 0.299072L5.80734 5.79957L0 6.18179L4.45419 9.96385L2.99256 15.701L7.99681 12.5379L13.0011 15.701L11.5395 9.96385L16 6.18179Z" fill="#ffffff"/>
                                                </svg> 4.5</span>
                                        </div>
                                        <div className="pdi_share_links">Share :
                                            <Link to="#"><img src={twitterIcon} alt="twitter" className="img-fluid ms-2" /></Link>
                                            <Link to="#"><img src={linkedinIcon} alt="linkedin" className="img-fluid ms-2" /></Link>
                                            <Link to="#"><img src={fbIcon} alt="facebook" className="img-fluid ms-2" /></Link>
                                            <Link to="#"><img src={whatsappIcon} alt="Watsapp" className="img-fluid ms-2" /></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <div ref={this.myRef}>
                    <DetailTabbing
                        id={this.state.productDetail.id}
                        specifications={this.state.productDetail.specifications}
                        description={this.state.productDetail.description}
                        reviews={this.state.productDetail.reviews}
                        avgRating={this.state.productDetail.avgRating}
                        reviewsCount={this.state.productDetail.reviewCount}
                    />
                </div>

                {this.state.similarProducts && this.state.similarProducts.length > 0  ?
                  <SimilarProducts products={this.state.similarProducts} isService={false} />
                : "" }

                <Footer />
                <GoToTop/>
            </React.Fragment>
        );
    }
}

export default connect(setLoading) (ProductDetail);