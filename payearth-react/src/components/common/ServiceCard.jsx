import React from "react";
import { Link } from "react-router-dom";
import heartIconBordered from "./../../assets/icons/heart-icon-bordered.svg";
import redHeartIcon from "./../../assets/icons/red-heart-icon-filled.svg";
import Rating from "./Rating";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { addToCart } from "../../store/reducers/cart-slice-reducer";
import { toast } from "react-toastify";
import {
    setLoading,
    setIsLoginModalOpen,
} from "../../store/reducers/global-reducer";
import { setSelectedWishItems } from "../../store/reducers/wishlist-reducer";

const ServiceCard = ({ data, inWishList }) => {
    const dispatch = useDispatch();
    const authInfo = useSelector((state) => state.auth.authInfo);
    const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
    //   const addToWishlist = (productId) => {
    //     if (isLoggedIn) {
    //       let reqBody = {
    //         user_id: authInfo.id,
    //         product_id: productId,
    //       };
    //       let selectedWishItemsCopy = JSON.parse(
    //         localStorage.getItem("selectedWishItems")
    //       );
    //       axios
    //         .post("user/wishlist/", reqBody, {
    //           headers: {
    //             Accept: "application/json",
    //             "Content-Type": "application/json;charset=UTF-8",
    //             Authorization: `Bearer ${authInfo.token}`,
    //           },
    //         })
    //         .then((response) => {
    //           if (response.data.status) {
    //             selectedWishItemsCopy.push(response.data.data.productId);
    //             localStorage.setItem(
    //               "selectedWishItems",
    //               JSON.stringify(selectedWishItemsCopy)
    //             );
    //             dispatch(
    //               setSelectedWishItems({ selectedWishItems: selectedWishItemsCopy })
    //             );
    //             toast.dismiss();
    //             toast.success(response.data.message);
    //           }
    //         })
    //         .catch((error) => {
    //           if (error.response && error.response.data.status === false) {
    //             toast.error(error.response.data.message);
    //           }
    //         })
    //         .finally(() => {
    //           setTimeout(() => {
    //             dispatch(setLoading({ loading: false }));
    //           }, 300);
    //         });
    //     } else {
    //       dispatch(setIsLoginModalOpen({ isLoginModalOpen: true }));
    //     }
    //   };



    //   const openmodalHandler = () => {
    //     toast.error("Buyer login failed....");
    //     setTimeout(() => {
    //       dispatch(setIsLoginModalOpen({ isLoginModalOpen: true }));
    //       document.body.style.overflow = "hidden";
    //     }, 2000);
    //   };

    //   const removeToWishlist = (productId) => {
    //     let reqBody = {
    //       user_id: authInfo.id,
    //       product_id: productId,
    //     };

    //     let selectedWishItemsCopy = JSON.parse(
    //       localStorage.getItem("selectedWishItems")
    //     );
    //     axios.post("user/remove-from-wishlist/", reqBody, {
    //       headers: {
    //         Accept: "application/json",
    //         "Content-Type": "application/json;charset=UTF-8",
    //         Authorization: `Bearer ${authInfo.token}`,
    //       },
    //     })
    //       .then((response) => {
    //         if (response.data.status) {
    //           let filteredArray = selectedWishItemsCopy.filter((item) => item !== productId);
    //           localStorage.setItem("selectedWishItems", JSON.stringify(filteredArray));
    //           dispatch(setSelectedWishItems({ selectedWishItems: filteredArray }));
    //           toast.success(response.data.message);
    //         }
    //       })
    //       .catch((error) => {
    //         if (error.response && error.response.data.status === false) {
    //           toast.error(error.response.data.message);
    //         }
    //       })
    //       .finally(() => {
    //         setTimeout(() => {
    //           dispatch(setLoading({ loading: false }));
    //         }, 300);
    //       });
    //   };

    // console.log("data", data)

    return (
        <div className="prod_card">
            <div className="img_wrapper">
                {data.isService === true ? (
                    <div className="ep_tag shadow">
                        <span>EP: {data.videoCount}</span>
                    </div>
                ) : (
                    ""
                )}
                <Link
                    to={data.isService === false ? `/product-detail/${data.id}` : `/service-detail/${data.id}`}
                >
                    <img src={data.image} className="img-fluid" alt="..." />
                </Link>
            </div>
            <div className="text_wrapper">
                <div className="prod_info_head">
                    <div className="prod_info">
                        <Rating avgRating={data.avgRating} />
                        <p className="product_name">
                            <Link
                                to={data.isService === false ? `/product-detail/${data.id}` : `/service-detail/${data.id}`}
                            >
                                {data.name}
                            </Link>
                        </p>
                    </div>
                    <div className="priceData">
                        {data.cryptoPrices && data.cryptoPrices.length > 0
                            ? data.cryptoPrices.map((val, index) => {
                                let crypPrice = data.price / val.cryptoPriceUSD;
                                crypPrice = crypPrice.toFixed(5);
                                return (
                                    <p className="price crypto" key={index}>
                                        {" "}
                                        {crypPrice} {val.code}
                                    </p>
                                );
                            })
                            : ""}
                        <p className="price">{data.price} USD</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;
