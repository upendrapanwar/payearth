import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from './SectionTitle';
import ProductCard from './../../common/ProductCard';
import config from './../../../config.json';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

var productsData = [];
const PopularProducts = () => {
    const [products, setProducts] = useState([]);
    const selectedWishItems = useSelector(state => state.wishlist.selectedWishItems);
    toast.configure();

    useEffect(() => {
        productsData = [];
        axios.get('front/product/popular/8').then(response => {
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
        });
    }, []);

    return(
        <section className="popular_products_sec">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        {products && products.length ? <SectionTitle title="Popular Products" viewMore={false} /> : '' }
                        <div className="cards_wrapper">
                            {products && products.length ?
                                products.map((product, index) => {
                                    return <ProductCard
                                                data={product}
                                                key={index}
                                                inWishList={selectedWishItems.length !== 0 && selectedWishItems.includes(product.id) ? true : false}
                                            />
                                })
                            : ''}
                        </div>
                        {products && products.length ?
                            <div className="text-center">
                                <Link to="#" className="view_more float-none">View More</Link>
                            </div>
                        : ''}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PopularProducts;