import React, { useState, useEffect } from "react";
import SectionTitle from "./SectionTitle";
import ProductCard from "./../../common/ProductCard";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const TrendingProducts = () => {
  const [products, setProducts] = useState([]);
  const [randomProducts, setRandomProducts] = useState([]);
  const selectedWishItems = useSelector(
    (state) => state.wishlist.selectedWishItems
  );
  toast.configure();

  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        const response = await axios.get("front/product/trending/50");
        if (response.data.status) {
          const res = response.data.data;
          const formattedProducts = res.map((product) => {
            const totalRatings = product.productDetails.reviews.reduce(
              (sum, review) => sum + review.rating,
              0
            );
            const avgRating = totalRatings / product.productDetails.reviews.length;
            return {
              id: product.productDetails._id,
              image: product.productDetails.featuredImage,
              name: product.productDetails.name,
              price: product.productDetails.price,
              avgRating: avgRating,
              isService: product.productDetails.isService,
              quantity: product.productDetails.quantity.stock_qty,
            };
          });
          setProducts(formattedProducts);
          updateRandomProducts(formattedProducts);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch trending products.");
        console.error(error);
      }
    };

    fetchTrendingProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      updateRandomProducts(products);
    }, 10000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [products]);

  const updateRandomProducts = (productList) => {
    if (productList.length > 0) {
      const shuffled = [...productList].sort(() => 0.5 - Math.random());
      setRandomProducts(shuffled.slice(0, 4));
    }
  };

  return (
    <section className="trending_products_sec">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            {randomProducts.length > 0 ? (
              <SectionTitle
                title="Trending Products"
                viewMore={false}
                route={"#"}
              />
            ) : null}

            <div className="cards_wrapper">
              {randomProducts.length > 0
                ? randomProducts.map((product, index) => (
                  <ProductCard
                    data={product}
                    key={product.id}
                    inWishList={
                      selectedWishItems.length !== 0 &&
                      selectedWishItems.includes(product.id)
                    }
                  />
                ))
                : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
