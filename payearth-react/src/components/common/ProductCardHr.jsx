import React from 'react';
import { Link } from 'react-router-dom';
import Rating from './Rating';

const ProductCardHr = (props) => {
    return(
        <div className="card">
            <div className="img_wrapper"><img src={props.data.image} alt="ladies-bag" className="img-fluid" /></div>
            <div className="text_wrapper">
                <div>
                    <div>
                        <Rating />
                        <p className="product_name">{props.data.name}</p>
                    </div>
                    <p className="price">{props.data.price} USD</p>
                </div>
                <Link className="btn custom_btn btn_yellow" to="#">Buy Now</Link>
                <Link className="btn custom_btn btn_yellow_bordered" to="#">Add to cart</Link>
            </div>
        </div>
    )
}

export default ProductCardHr;