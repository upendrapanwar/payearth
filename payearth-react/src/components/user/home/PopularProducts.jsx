import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SectionTitle from "./SectionTitle";
import ProductCard from "./../../common/ProductCard";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

var productsData = [];
const PopularProducts = () => {
  const [products, setProducts] = useState([]);
  const selectedWishItems = useSelector(
    (state) => state.wishlist.selectedWishItems
  );
  toast.configure();

  useEffect(() => {
    productsData = [];
    axios
      .get("front/product/popular/8")
      .then((response) => {
        if (response.data.status) {
          let res = response.data.data;
          res.forEach((product) => {
            const totalRatings = product.productDetails.reviews.reduce((sum, review) => sum + review.rating, 0);
            const avgRating = totalRatings / product.productDetails.reviews.length;
            productsData.push({
              id: product.productDetails._id,
              image: product.productDetails.featuredImage,
              name: product.productDetails.name,
              price: product.productDetails.price,
              avgRating: avgRating,
              isService: product.productDetails.isService,
              quantity: product.productDetails.quantity.stock_qty,
              // cryptoPrices: product.productDetails.cryptoPrices,
            });
          });
          setProducts(productsData);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  }, []);

  return (
    <section className="popular_products_sec">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            {products && products.length ? (
              <SectionTitle title="Popular Products" viewMore={false} />
            ) : (
              ""
            )}
            <div className="cards_wrapper">
              {products && products.length
                ? products.map((product, index) => {
                  return (
                    <ProductCard
                      data={product}
                      key={index}
                      inWishList={
                        selectedWishItems.length !== 0 &&
                          selectedWishItems.includes(product.id)
                          ? true
                          : false
                      }
                    />
                  );
                })
                : ""}
            </div>
            {products && products.length ? (
              <div className="text-center">
                <Link to="/product-listing" className="view_more float-none">
                  View More
                </Link>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularProducts;
