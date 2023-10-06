import React, { useState, useEffect } from 'react';
import SectionTitle from './SectionTitle';
import ProductCard from './../../common/ProductCard';
import config from './../../../config.json';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

var productsData = [];
const TrendingProducts = () => {
    const [products, setProducts] = useState([]);
    const selectedWishItems = useSelector(state => state.wishlist.selectedWishItems);
    toast.configure();

    useEffect(() => {
        productsData = [];
        
        axios.get('front/product/trending/4').then(response => {
            if (response.data.status) {
                let res = response.data.data;
                res.forEach(product => {
                    productsData.push({
                        id: product.productId.id,
                        image: config.apiURI + product.productId.featuredImage,
                        name: product.productId.name,
                        price: product.productId.price,
                        avgRating: product.productId.avgRating,
                        isService: product.productId.isService,
                        quantity: product.productId.quantity,
                        cryptoPrices:product.productId.cryptoPrices
                    });
                });
                setProducts(productsData);
            } else {
                toast.error(response.data.message);
            }
        }).catch(error => {
            toast.error(error);
            console.log(error);
        });
    }, []);

    return(
        <section className="trending_products_sec">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        { products && productsData.length ? <SectionTitle title="Trending Products" viewMore={true} route={'#'} /> : '' }

                        <div className="cards_wrapper">
                            {products && productsData.length ?
                                productsData.map((product, index) => {
                                    return <ProductCard
                                                data={product}
                                                key={index}
                                                inWishList={selectedWishItems.length !== 0 && selectedWishItems.includes(product.id) ? true : false}
                                            />
                                })
                            : ''}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TrendingProducts;