import React from 'react';
import OwlCarousel from 'react-owl-carousel';
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import ProductCard from './../../common/ProductCard';
import { useSelector } from 'react-redux';

const SimilarProducts = (props) => {
    const selectedWishItems = useSelector(state => state.wishlist.selectedWishItems);
    return(
        <section className="similar_products">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <h4 className="h4 heading">Similar {props.isService === false ? "Products" : "Services" } </h4>
                        <OwlCarousel  items={4} className="owl-theme" loop={false} nav margin={8} >
                            {props.products.length > 0 ? props.products.map((value, index) => {
                                return <div className="item" key={index}>
                                            <ProductCard data={value} inWishList={selectedWishItems.length !== 0 && selectedWishItems.includes(value.id) ? true : false}/>
                                        </div>
                            }) : ''}
                        </OwlCarousel>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default SimilarProducts;