import React from 'react';
import { Link } from 'react-router-dom';
import config from './../../../config.json';
import getDate from '../../../helpers/get-formated-date';
import parse from 'html-react-parser';

const ProductDetail = (props) => {
    const {data, colors, type} = props;
    var itemDetail = '';
    let url = '';

    if (type === 'product') {
        itemDetail = data.product;
        url = `/seller/edit-product/`;
    } else {
        itemDetail = data.service;
        url = `/seller/edit-service/`;
    }

    return(
        <div className="seller_dash_wrap pt-5 pb-5">
            <div className="container ">
                <div className="bg-white rounded-3 pt-3 pb-5">
                    <div className="dash_inner_wrap row">
                        <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center border-bottom">
                            <div className="dash_title">{itemDetail && itemDetail.name}</div>
                            <Link to={itemDetail ? `${url}${itemDetail.id}` : '#'} className="custom_btn btn_yellow_bordered w-auto btn">Edit Details</Link>
                        </div>
                        <div className="col-md-12">
                            <div className="pro_summary">
                                <div className="pro_summ_row">
                                    <div className="psr_label">{itemDetail && itemDetail.isService ? 'Service' : 'Product'} Name</div>
                                    <div className="psr_item">{itemDetail && itemDetail.name}</div>
                                </div>
                                {type === 'product' &&
                                    <div className="pro_summ_row">
                                        <div className="psr_label">Brand</div>
                                        <div className="psr_item">{itemDetail && itemDetail.brand.brandName}</div>
                                    </div>
                                }
                                <div className="pro_summ_row">
                                    <div className="psr_label">Total sales of {itemDetail && itemDetail.isService ? 'service' : 'product'}</div>
                                    <div className="psr_item">{Object.keys(data).length && data.sales !== null ? data.sales.totalSalesCount : 0}</div>
                                </div>
                                {type === 'product' &&
                                    <div className="pro_summ_row">
                                        <div className="psr_label">Tier pricing (Wholesale Vendor)</div>
                                        <div className="psr_item">
                                            {itemDetail && itemDetail.tier_price.length > 0 ?
                                                itemDetail.tier_price.map((value, index) => {
                                                    return value.qty + ' Quantity - $' + value.price + ' | '
                                                })
                                            : ''}
                                        </div>
                                    </div>
                                }
                                <div className="pro_summ_row">
                                    <div className="psr_label">Date of addition</div>
                                    <div className="psr_item">{itemDetail && getDate(itemDetail.createdAt)}</div>
                                </div>
                                <div className="pro_summ_row">
                                    <div className="psr_label">Category</div>
                                    <div className="psr_item">{itemDetail && itemDetail.category.categoryName}</div>
                                </div>
                                {itemDetail && itemDetail.sub_category !== null ?
                                    <div className="pro_summ_row">
                                        <div className="psr_label">Sub category</div>
                                        <div className="psr_item">{itemDetail.sub_category.categoryName}</div>
                                    </div>
                                : ''}
                                <div className="pro_summ_row">
                                    <div className="psr_label">Descriptions</div>
                                    <div className="psr_item"><p>{itemDetail && parse(itemDetail.description)}</p></div>
                                </div>
                                {type === 'product' &&
                                    <React.Fragment>
                                        <div className="pro_summ_row">
                                            <div className="psr_label">Specifications</div>
                                            <div className="psr_item"><p>{itemDetail && parse(itemDetail.specifications)}</p></div>
                                        </div>
                                        {itemDetail && itemDetail.color_size.length > 0 ?
                                            <div className="pro_summ_row">
                                                <div className="psr_label">Color & Size</div>
                                                <div className="psr_item">
                                                    <ul className="colors_pick ps-0 bg-white">
                                                        {itemDetail.color_size.map((value, index) => {
                                                            return <li className="mb-2 d-flex" key={index}><span className="d-inline-block" style={{width: '50px'}}>{(value.size).toUpperCase()} :</span> &nbsp;
                                                                {value.color.map((value2, index2) => {
                                                                    return <span style={{backgroundColor: colors[value2]}} className="color_box me-2 d-inline-block" key={index2}></span>;
                                                                })}
                                                            </li>
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>
                                        : ''}
                                    </React.Fragment>
                                }
                                {type === 'product' &&
                                    <div className="pro_summ_row">
                                        <div className="psr_label">Color & Image</div>
                                        <div className="psr_item">
                                            <div className="psr_color_images">
                                                <ul className="colors_pick ps-0 bg-white">
                                                    {itemDetail && itemDetail.images.length > 0 ?
                                                        itemDetail.images.map((value, index) => {
                                                            return <li className="mb-2 me-1" key={index}><span style={{backgroundColor: colors[value.color]}} className="color_box"></span></li>
                                                        })
                                                    : ''}
                                                </ul>
                                                <ul className="pro_img_listing detail ms-0 w-100 mt-2">
                                                    {itemDetail && itemDetail.images.length > 0 ?
                                                        itemDetail.images.map((value, index) => {
                                                            return value.paths.map((value2, index2) => {
                                                                return <li className="mb-0 me-2" key={index2}><img src={config.apiURI + value2} alt="..." /></li>
                                                            })
                                                        })
                                                    : ''}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                }
                                {type === 'service' &&
                                    <div className="pro_summ_row">
                                        <div className="psr_label">Videos</div>
                                        <div className="psr_item">
                                            <div className="psr_color_images">
                                                <ul className="pro_img_listing detail ms-0">
                                                    {itemDetail && itemDetail.videos.length > 0 ?
                                                        itemDetail.videos.map((value, index) => {
                                                            return <li className="mb-0 me-2" key={index}><img src={config.apiURI + value.video.thumb} alt="..." /></li>
                                                        })
                                                    : ''}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                }
                                <div className="pro_summ_row">
                                    <div className="psr_label">Price</div>
                                    <div className="psr_item">${itemDetail && itemDetail.price}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductDetail;