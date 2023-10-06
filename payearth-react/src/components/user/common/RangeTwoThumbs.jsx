import React, { useEffect } from 'react';
import { Range, getTrackBackground } from 'react-range';
import { useSelector, useDispatch } from 'react-redux';
import { setReqBody, setProducts, setTotalProducts } from '../../../store/reducers/product-reducer';
import { setLoading } from '../../../store/reducers/global-reducer';
import config from './../../../config.json';
import axios from 'axios';
import { getBrands, getColors } from './../../../helpers/product-listing';

const MIN = 0;
var MAX = 100;
const RangeTwoThumbs = (mainProps) => {
    const dispatch = useDispatch();
    var productReqBody = useSelector(state => state.product.reqBody);
    var maxPrice = useSelector(state => state.product.maxPrice);
    const [values, setValues] = React.useState([MIN, MAX]);
    const [setp, setStep] = React.useState(10);

    const handlePriceRange = () => {
        let productsData = [];
        let reqBody = JSON.parse(JSON.stringify({...productReqBody}));
        reqBody.price_filter.min_val = values[0];
        reqBody.price_filter.max_val = values[1];
        setStep(Math.ceil(values[1]/10));

        dispatch(setLoading({loading: true}));
        axios.post('front/product/listing', reqBody).then((response) => {
            if (response.data.status) {
                let res = response.data.data.products;
                res.forEach(product => {
                    productsData.push({
                        id: product.id,
                        image: config.apiURI + product.featuredImage,
                        name: product.name,
                        price: product.price,
                        avgRating: product.avgRating,
                        isService: product.isService,
                        quantity: product.quantity,
                        cryptoPrices:product.cryptoPrices
                    });
                });
            }
            dispatch(setReqBody({reqBody}));
            dispatch(setProducts({products: productsData}));
            dispatch(setTotalProducts({totalProducts: response.data.data.totalProducts}));
            getBrands(dispatch);
            getColors(dispatch);
        }).catch(error => {
            if(error.response && error.response.data.status === false) {
                dispatch(setProducts({products: productsData}));
            }
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    const handleChange = (values) => {
        setValues(values);
    }

    useEffect(() => {
        MAX = maxPrice;
        setValues([0, maxPrice]);
    }, [maxPrice]);

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap'
            }}
        >
            <Range
                allowOverlap={false}
                values={values}
                step={setp}
                min={MIN}
                max={MAX}
                onChange={(values) => handleChange(values)}
                renderTrack={({ props, children }) => (
                    <div
                        onMouseUp={() => handlePriceRange()}
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                            ...props.style,
                            height: '36px',
                            display: 'flex',
                            width: '100%'
                        }}
                    >
                        <div
                            ref={props.ref}
                            style={{
                                    height: '8px',
                                    width: '100%',
                                    borderRadius: '4px',
                                    background: getTrackBackground({
                                    values,
                                    colors: ['#E8E8E8', '#FBB500', '#E8E8E8'],
                                    min: MIN,
                                    max: MAX,
                                }),
                                alignSelf: 'center'
                            }}
                        >
                            {children}
                        </div>
                    </div>
                )}
                renderThumb={({ index, props, isDragged }) => (
                    <div
                        {...props}
                        style={{
                            ...props.style,
                            height: '18px',
                            width: '18px',
                            borderRadius: '50%',
                            backgroundColor: '#FFF',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0px 2px 6px #AAA',
                            border: '4px solid #FBB500'
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '-32px',
                                color: '#56575A',
                                fontWeight: '500',
                                fontSize: '14px',
                                fontFamily: 'Montserrat'

                            }}
                        >
                            {mainProps.currencySymbol}{values[index]}
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default RangeTwoThumbs;