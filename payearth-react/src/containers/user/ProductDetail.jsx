import React, { Component } from "react";
import { Link } from "react-router-dom";
import GoToTop from "./../../helpers/GoToTop";
import Header from "./../../components/user/common/Header";
import PageTitle from "./../../components/user/common/PageTitle";
import Footer from "./../../components/common/Footer";
import axios from "axios";
import { setLoading } from "../../store/reducers/global-reducer";
import SpinnerLoader from '../../components/common/SpinnerLoader';
import store from '../../store/index';
import { connect, useSelector, useDispatch } from "react-redux";
import Rating from "../../components/common/Rating";
import coins from "./../../assets/icons/coin.svg";
import DetailTabbing from "../../components/user/common/DetailTabbing";
import SimilarProducts from "../../components/user/common/SimilarProducts";
import { Helmet } from 'react-helmet';
import arrow_back from '../../assets/icons/arrow-back.svg';
import parse from "html-react-parser";
import { addToCart } from "../../store/reducers/cart-slice-reducer";
import {
  incrementQuantity,
  decrementQuantity,
  removeItem,
} from "../../store/reducers/cart-slice-reducer";
import { BannerTopIframe } from "../../components/common/BannerFrame";
import CartItem from "../../components/user/common/CartItem";

class ProductDetail extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      id: window.location.pathname.split("/")[2],
      productDetail: {},
      colors: [],
      featuredImg: "",
      thumbnails: [],
      similarProducts: [],
      productId: "",
      sizes: [],
      sizeControlls: [],
      category: "",
      mainImage: null,
      selectColorImage: null,
      selectColor: null,
      averageRating: '',
      reviewCount: ''
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(setLoading({ loading: true }));

    let productId = window.location.pathname.split("/")[2];
    axios.get("front/product/detail/" + productId)
      .then((response) => {
        let resData = response.data.data;
        this.setState({ category: resData.category.categoryName })
        this.handleColorClick(resData.images[0] ? resData.images[0] : "")
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

          const reviews = response.data.data.reviews;
          const reviewCount = response.data.data.reviews?.length;

          // Calculate the average rating
          const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
          const averageRating = totalRatings / reviewCount;

          console.log("Average Rating:", averageRating);


          this.setState({
            id: productId,
            productDetail: resData,
            colors,
            sizes,
            sizeControlls,
            featuredImg: resData.featuredImage,
            thumbnails: resData.images.length ? resData.images[0] : [],
            averageRating: averageRating.toFixed(1),
            reviewCount: reviewCount
          });
        }
      })

      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setTimeout(() => {
          dispatch(setLoading({ loading: false }));
        }, 300);
      });

    // axios.get("front/product/similar-products/" + productId)
    //   .then((response) => {
    //     let productsData = [];
    //     if (response.data.status) {
    //       let res = response.data.data;
    //       res.forEach((product) => {
    //         productsData.push({
    //           id: product.id,
    //           image: product.featuredImage,
    //           name: product.name,
    //           isService: product.isService,
    //           price: product.price,
    //           avgRating: product.avgRating,
    //           quantity: product.quantity,
    //         });
    //       });
    //     }
    //     this.setState({ similarProducts: productsData });
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   })
    //   .finally(() => {
    //     setTimeout(() => {
    //       dispatch(setLoading({ loading: false }));
    //     }, 300);
    //   });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.history.location.pathname !== prevProps.location.pathname)
      this.componentDidMount();
  }

  scrollToMyRef = () => window.scrollTo(0, this.myRef.current.offsetTop);

  handleColor = (param) => {
    this.state.productDetail.images.forEach((value) => {
      if (value.color === param) this.setState({ thumbnails: value.paths });
    });
  };

  handleSize = (param, size) => {
    let sizeControlls = [];

    // For size button activation
    for (let index = 0; index < this.state.sizeControlls.length; index++) {
      sizeControlls.push(param === index ? true : false);
    }
    this.setState({ sizeControlls });

    // For change colors according to size
    this.state.productDetail.color_size.forEach((value) => {
      if (value.size === size) {
        this.setState({ colors: value.color });
        this.state.productDetail.images.forEach((value2) => {
          if (value2.color === value.color[0])
            this.setState({ thumbnails: value2.paths });
        });
      }
    });
  };

  handleThumbnailClick = (url) => {
    this.setState({ mainImage: url });
  };

  handleColorClick = (colorCode) => {
    if (colorCode !== '') {
      this.setState({ mainImage: colorCode.images[0] })
      this.setState({ selectColorImage: colorCode.images });
      this.setState({ selectColor: colorCode.color });
    }
  }

  render() {
    const { loading } = store.getState().global;
    const { sizeControlls, productDetail, featuredImage, mainImage, selectColor, selectColorImage, id, averageRating, reviewCount } = this.state;

    console.log("productDetail-------11", productDetail)
    var proQuantity = 0;
    const productID = this.state.id;
    //const dispatch = useDispatch();
    const cart = this.props.payload.cart.cart;
    //const cart = useSelector((state) => state.cart)
    if (this.props.payload.cart) {
      Object.keys(cart).forEach(function (key) {
        //console.log(cart[key]['id']);
        console.log(cart[key].id);
        if (cart[key].id == productID) {
          proQuantity = cart[key].quantity;
        }
      });
    }

    const { dispatch } = this.props;
    return (
      <React.Fragment>
        {loading === true ? <SpinnerLoader /> : ''}
        <Helmet><title>{`Product-detail/${productDetail.productCode} - Pay Earth`}</title></Helmet>
        <BannerTopIframe keywords={this.state.category} />
        <Header />
        <PageTitle title={'Product Detail'} />
        <section className="inr_wrap">
          <div className="container">
            <div className="bg-white rounded-3 pt-3 pb-5">
              <div className="d-flex justify-content-end">
                {/* <Link className="btn custom_btn btn_yellow  mt-3 mx-3" to="/product-listing">
                  <img src={arrow_back} alt="Back" />
                  &nbsp;Back
                </Link> */}
                <div className=''>
                  <button
                    type="button"
                    className="btn custum_back_btn btn_yellow mx-3"
                    onClick={() => window.history.back()}
                  >
                    <img src={arrow_back} alt="back" />&nbsp;
                    Back
                  </button>
                </div>
              </div>
              <div className="dash_inner_wrap row">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-lg-6 d-flex flex-column">
                      <div className="d-flex justify-content-center align-items-center">
                        {mainImage !== null ? (
                          <img
                            src={mainImage}
                            alt="Featured"
                            className="img-fluid"
                            style={{ width: '400px', height: 'auto', margin: '5px' }}
                          />
                        ) : (
                          productDetail?.featuredImage && (
                            <img
                              src={productDetail.featuredImage}
                              alt="Featured"
                              className="img-fluid"
                              style={{ width: '400px', height: 'auto', margin: '5px' }}
                            />
                          )
                        )}
                      </div>
                      {productDetail?.images && (
                        <div className="d-flex justify-content-center mt-4">
                          <ul className="colors_pick list-unstyled d-flex gap-2 bg-white">
                            {productDetail?.images.map((colorCode, index) => (
                              <li
                                key={index}
                                style={{
                                  background: colorCode.color,
                                  width: '24px',
                                  height: '24px',
                                  borderRadius: '50%',
                                  cursor: 'pointer',
                                  border: selectColor === colorCode.color ? '2px solid #fff' : 'none',
                                  boxShadow: selectColor === colorCode.color ? '0 0 10px rgba(0, 0, 0, 0.2)' : 'none',
                                }}
                                className="color_box"
                                onClick={() => this.handleColorClick(colorCode)}
                              ></li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="d-flex justify-content-center align-items-center mt-3">
                        {selectColorImage !== null ? (
                          <div className="d-flex justify-content-center align-items-center flex-wrap">
                            {selectColorImage.map((url, imageIndex) => (
                              <img
                                key={`thumbnail-${imageIndex}`}
                                src={url}
                                alt={`Thumbnail ${imageIndex + 1}`}
                                onClick={() => this.handleThumbnailClick(url)}
                                className={`img-thumbnail ${mainImage === url ? 'border border-primary' : ''}`}
                                style={{ width: '80px', height: 'auto', margin: '5px', cursor: 'pointer' }}
                              />
                            ))}
                          </div>
                        ) : (
                          productDetail?.images && productDetail.images.length > 0 && (
                            <div key={`colorGroup-0`} className="d-flex justify-content-center align-items-center flex-wrap">
                              {productDetail.images[0].images.map((url, imageIndex) => (
                                <img
                                  key={`thumbnail-0-${imageIndex}`}
                                  src={url}
                                  alt={`Thumbnail ${imageIndex + 1}`}
                                  onClick={() => this.handleThumbnailClick(url)}
                                  className={`img-thumbnail ${mainImage === url ? 'border border-primary' : ''}`}
                                  style={{ width: '80px', height: 'auto', margin: '5px', cursor: 'pointer' }}
                                />
                              ))}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="prod_dtl_info">
                        <div className="prod_dtl_body">
                          {productDetail.super_rewards === true ? <div className="d-flex align-items-center">
                            <img
                              src={coins}
                              alt="coin-icon"
                              width={40}
                              height={40}
                              className="me-2"
                            />
                            <p className="mb-0" style={{ fontFamily: 'Arial, sans-serif', fontSize: '16px', fontWeight: 'bold' }}>
                              You will earn 2 coins for purchasing this product.
                            </p>
                          </div> : ''}
                          <h2>{productDetail.name}</h2>
                          <div className="pdi_ratings">
                            <Rating avgRating={averageRating} />
                            <Link
                              to="#"
                              className="reviews_count"
                              onClick={this.scrollToMyRef}
                            >
                              ( {reviewCount} Reviews )
                            </Link>
                          </div>
                          <div className="pdi_price">
                            {/* <b>{this.state.productDetail.price} USD</b> OR <b>0.5 BTC</b> */}
                            <b>${productDetail.price} </b>
                          </div>
                          <div className="pdi_avblty">
                            Availability:{" "}
                            {productDetail.quantity &&
                              parseInt(productDetail.quantity.stock_qty) >
                              0 ? (
                              <span>In stock</span>
                            ) : (
                              <span className="text-danger">Out of stock</span>
                            )}{" "}
                            | Product Code :{" "}
                            <span>{productDetail.productCode}</span>
                          </div>
                          <div className="pdi_desc">
                            <p>
                              {productDetail.description
                                ? parse(productDetail.description)
                                : ""}
                            </p>
                          </div>
                          <div className="pdi_desc">
                            <div className="heading">Category : </div><p>{this.state.category}</p>
                          </div>
                          <div className="pdi_fea">
                            {this.state.colors.length ? (
                              <div className="pdi_fea_box">
                                <div className="heading">Color</div>
                                <div className="colors_grid">
                                  {productDetail?.images && (
                                    <div>
                                      <ul className="colors_pick ps-0 bg-white">
                                        {productDetail?.images.map((colorCode, index) => (
                                          <li
                                            key={index}
                                            style={{
                                              background: colorCode.color,
                                              width: '24px',
                                              height: '24px',
                                              borderRadius: '4px',
                                              display: 'inline-block',
                                              marginRight: '8px'
                                            }}
                                            className="color_box"
                                          ></li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                            {this.state.sizes.length &&
                              this.state.sizes[0] !== "none" ? (
                              <div className="pdi_fea_box">
                                <div className="heading">Size</div>
                                <div className="size_grid">
                                  {this.state.sizes
                                    ? this.state.sizes.map((value, index) => {
                                      return (
                                        <span
                                          key={index}
                                          className={`size_box text-uppercase ${sizeControlls[index] ? "selected" : ""
                                            }`}
                                          onClick={() =>
                                            this.handleSize(index, value)
                                          }
                                        >
                                          {value}
                                        </span>
                                      );
                                    })
                                    : ""}
                                </div>
                              </div>
                            ) : (
                              ""
                            )}
                          </div>
                          {/* <div className="pdi_fea">
                            <div className="pdi_fea_box ">
                              <div className="heading">Delivery</div>
                              <div className="pin_select">
                                <div className="input-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Pin code"
                                    aria-label=""
                                    aria-describedby="pin-code"
                                  />
                                  <button
                                    className="btn btn-outline-secondary"
                                    type="button"
                                    id="pin-code"
                                  >
                                    Check
                                  </button>
                                </div>
                                <small className="ms-2">
                                  Delivery by <br />
                                  16 Aug Wed
                                </small>
                              </div>
                            </div>
                          </div> */}
                          {productDetail.quantity &&
                            productDetail.quantity.stock_qty > 0 ? (
                            <div className="d-flex prod_foot">
                              <Link className="btn custom_btn btn_yellow_bordered" to="#"
                                onClick={() => dispatch(
                                  addToCart({
                                    id: productDetail.id,
                                    name: productDetail.name,
                                    image: productDetail.featuredImage,
                                    price: productDetail.price,
                                  })
                                )}
                              >
                                Add to cart
                              </Link>
                              <Link
                                className="btn custom_btn btn_yellow"
                                to={'/my-cart'}
                                onClick={() => dispatch(
                                  addToCart({
                                    id: productDetail.id,
                                    name: productDetail.name,
                                    image: productDetail.featuredImage,
                                    price: productDetail.price,
                                  })
                                )}
                              >
                                Buy Now
                              </Link>
                            </div>
                          ) : ("")}
                        </div>

                        <div className="pdi_share">
                          <div className="pdi_seller">
                            Seller :{" "}
                            <b>
                              {productDetail.createdBy ? productDetail.createdBy.name : ""}
                            </b>{" "}
                            <span className="rate_sts">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M16 6.18179L10.1863 5.79957L7.99681 0.299072L5.80734 5.79957L0 6.18179L4.45419 9.96385L2.99256 15.701L7.99681 12.5379L13.0011 15.701L11.5395 9.96385L16 6.18179Z"
                                  fill="#ffffff"
                                />
                              </svg>{" "}
                              4.5
                            </span>
                          </div>
                          {/* <div className="pdi_share_links">
                            Share :
                            <Link to="#">
                              <img src={twitterIcon} alt="twitter" className="img-fluid ms-2" />
                            </Link>
                            <Link to="#">
                              <img src={linkedinIcon} alt="linkedin" className="img-fluid ms-2" />
                            </Link>
                            <Link to="#">
                              <img src={fbIcon} alt="facebook" className="img-fluid ms-2" />
                            </Link>
                            <Link to="#">
                              <img src={whatsappIcon} alt="Watsapp" className="img-fluid ms-2" />
                            </Link>
                          </div> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div ref={this.myRef}>
          <DetailTabbing
            id={id}
            specifications={productDetail.specifications}
            description={productDetail.description}
          // reviews={productDetail.reviews}
          // avgRating={productDetail.avgRating}
          // reviewsCount={productDetail.reviewCount}
          />
        </div>

        {
          this.state.similarProducts && this.state.similarProducts.length > 0 ?
            (
              <SimilarProducts products={this.state.similarProducts} isService={false} />
            ) :
            ("")
        }
        <Footer />
        <GoToTop />
      </React.Fragment >
    );
  }
}

export default connect(setLoading)(ProductDetail);
