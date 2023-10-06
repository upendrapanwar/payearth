import React, { useState, useEffect } from 'react';
import SectionTitle from './SectionTitle';
import ProductCardHr from './../../common/ProductCardHr';
import config from './../../../config.json';
import axios from 'axios';
import { toast } from 'react-toastify';

var productsData = [];
const RecentSearch = () => {
    const [products, setProducts] = useState([]);
    toast.configure();

    useEffect(() => {
        productsData = [];
        axios.get('front/product/recent-search/8').then(response => {
            if (response.data.status) {
                let res = response.data.data;
                res.forEach(product => {
                    productsData.push({
                        id: product.productId.id,
                        image: config.apiURI + product.productId.featuredImage,
                        name: product.productId.name,
                        price: product.productId.price,
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
        <section className="recent_search_sec">
            <div className="container">
                <div className="row gy-4">
                    <div className="col-sm-12">
                        { products && products.length ? <SectionTitle title="Recent Search" viewMore={true} route="#" /> : '' }
                    </div>
                    {
                        products && products.length ? products.map((product, index) => {
                            return <div className="col-xs-12 col-md-6 col-lg-4" key={index}>
                                        <ProductCardHr data={product} />
                                    </div>
                        }) : ''
                    }
                </div>
            </div>
        </section>
    )
}

export default RecentSearch;