import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import config from './../../../config.json';
import getDate from '../../../helpers/get-formated-date';
import parse from 'html-react-parser';
import SpinnerLoader from '../../../components/common/SpinnerLoader';
import PageTitle from '../../user/common/PageTitle';
import arrow_back from '../../../assets/icons/arrow-back.svg';

const ProductDetail = ({ data, colors, type }) => {
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState(null);
    const [selectColorImage, setSelectColorImage] = useState(null);
    const [selectColor, setSelectColor] = useState(null);


    useEffect(() => {
        if (data) setLoading(false);
    }, [data]);

    const handleThumbnailClick = (url) => {
        setMainImage(url);
    };

    const handleColorClick = (colorCode) => {
        setMainImage(colorCode.images[0])
        setSelectColorImage(colorCode.images);
        setSelectColor(colorCode.color)
    };

    const itemDetail = type === 'product' ? data?.product : data?.service;

    useEffect(() => {
        if (itemDetail?.images?.length > 0) {
            handleColorClick(itemDetail.images[0]);
        }
    }, [itemDetail]);

    const url = `/seller/edit-${type}/`;
    return (
        <>
            {loading === true ? <SpinnerLoader /> : ''}
            <PageTitle title={`${type} Detail`} />
            <div className="seller_dash_wrap pt-2 pb-5">
                <div className="container">
                    <div className="bg-white rounded-3 pt-3 pb-5">
                        <div className="dash_inner_wrap row">
                            <div className="cp_top d-flex justify-content-between align-items-center">
                                <div className="dash_title">{itemDetail?.name}</div>
                                <div className="d-flex justify-content-end ml-auto gap-2">
                                    <Link to={itemDetail ? `${url}${itemDetail.id}` : '#'} className="custom_btn btn_yellow_bordered w-auto btn">Edit Details</Link>
                                    {/* <Link className="btn custom_btn btn_yellow mx-auto " to="/seller/product-management"><img src={arrow_back} alt="linked-in" />&nbsp;Back</Link> */}
                                    <div className="">
                                        <span>
                                            <button
                                                type="button"
                                                className="btn custum_back_btn btn_yellow mx-auto"
                                                onClick={() => window.history.back()}
                                            >
                                                <img src={arrow_back} alt="back" />&nbsp;
                                                Back 
                                            </button>
                                        </span>
                                    </div>
                                </div>
                            </div>
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
                                                itemDetail?.featuredImage && (
                                                    <img
                                                        src={itemDetail.featuredImage}
                                                        alt="Featured"
                                                        className="img-fluid"
                                                        style={{ width: '400px', height: 'auto', margin: '5px' }}
                                                    />
                                                )
                                            )}
                                        </div>

                                        {itemDetail?.images && (
                                            <div className="d-flex justify-content-center mt-4">
                                                <ul className="colors_pick list-unstyled d-flex gap-2 bg-white">
                                                    {itemDetail?.images.map((colorCode, index) => (
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
                                                            onClick={() => handleColorClick(colorCode)}
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
                                                            onClick={() => handleThumbnailClick(url)}
                                                            className={`img-thumbnail ${mainImage === url ? 'border border-primary' : ''}`}
                                                            style={{ width: '80px', height: 'auto', margin: '5px', cursor: 'pointer' }}
                                                        />
                                                    ))}
                                                </div>
                                            ) : (
                                                itemDetail?.images && itemDetail.images.length > 0 && (
                                                    <div key={`colorGroup-0`} className="d-flex justify-content-center align-items-center flex-wrap">
                                                        {itemDetail.images[0].images.map((url, imageIndex) => (
                                                            <img
                                                                key={`thumbnail-0-${imageIndex}`}
                                                                src={url}
                                                                alt={`Thumbnail ${imageIndex + 1}`}
                                                                onClick={() => handleThumbnailClick(url)}
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
                                        <div className="pro_summary">
                                            <div className="pro_summ_row">
                                                <div className="psr_label">{itemDetail?.isService ? 'Service' : 'Product'} Name</div>
                                                <div className="psr_item">{itemDetail?.name}</div>
                                            </div>
                                            {type === 'product' && (
                                                <div className="pro_summ_row">
                                                    <div className="psr_label">Brand</div>
                                                    <div className="psr_item">{itemDetail?.brand?.brandName}</div>
                                                </div>
                                            )}
                                            <div className="pro_summ_row">
                                                <div className="psr_label">Total Sales</div>
                                                <div className="psr_item">{data?.sales?.totalSalesCount || 0}</div>
                                            </div>
                                            {type === 'product' && itemDetail?.tier_price?.length > 0 && (
                                                <div className="pro_summ_row">
                                                    <div className="psr_label">Tier Pricing (Wholesale Vendor)</div>
                                                    <div className="psr_item">
                                                        {itemDetail.tier_price.map((tier, index) => (
                                                            <span key={index}>{tier.qty} Quantity - ${tier.price} | </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            <div className="pro_summ_row">
                                                <div className="psr_label">Date of Addition</div>
                                                <div className="psr_item">{getDate(itemDetail?.createdAt)}</div>
                                            </div>
                                            <div className="pro_summ_row">
                                                <div className="psr_label">Category</div>
                                                <div className="psr_item">{itemDetail?.category?.categoryName}</div>
                                            </div>
                                            {itemDetail?.sub_category && (
                                                <div className="pro_summ_row">
                                                    <div className="psr_label">Sub Category</div>
                                                    <div className="psr_item">{itemDetail.sub_category.categoryName}</div>
                                                </div>
                                            )}

                                            <div className="pro_summ_row">
                                                <div className="psr_label">Price</div>
                                                <div className="psr_item">${itemDetail?.price}</div>
                                            </div>

                                            <div className="pro_summ_row">
                                                <div className="psr_label">Colors</div>
                                                <div className="psr_item">
                                                    {itemDetail?.images && (
                                                        <div>
                                                            <ul className="colors_pick ps-0 bg-white">
                                                                {itemDetail?.images.map((colorCode, index) => (
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
                                        </div>
                                    </div>
                                </div>
                                <div className="pro_summary pt-3">
                                    <div className="pro_summ_row">
                                        <div className="psr_label">Description</div>
                                        <div className="psr_item">{parse(itemDetail?.description || '')}</div>
                                    </div>
                                    {type === 'product' && (
                                        <>
                                            <div className="pro_summ_row">
                                                <div className="psr_label">Specifications</div>
                                                <div className="psr_item">{parse(itemDetail?.specifications || '')}</div>
                                            </div>

                                        </>
                                    )}
                                    {type === 'service' && (
                                        <div className="pro_summ_row">
                                            <div className="psr_label">Videos</div>
                                            <div className="psr_item">
                                                <ul className="pro_img_listing detail ms-0">
                                                    {itemDetail?.videos?.map((video, index) => (
                                                        <li key={index} className="mb-0 me-2">
                                                            <img src={`${config.apiURI}${video.video.thumb}`} alt="..." />
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetail;
