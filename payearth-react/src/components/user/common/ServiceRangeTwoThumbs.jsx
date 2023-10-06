import React, { useEffect } from 'react';
import { Range, getTrackBackground } from 'react-range';
import { useSelector, useDispatch } from 'react-redux';
import { setServiceReqBody, setServices, setTotalServices } from '../../../store/reducers/service-reducer';
import { setLoading } from '../../../store/reducers/global-reducer';
import config from '../../../config.json';
import axios from 'axios';

const MIN = 0;
var MAX = 100;
const ServiceRangeTwoThumbs = (mainProps) => {
    const dispatch = useDispatch();
    var serviceReqBody = useSelector(state => state.service.reqBody);
    var maxPrice = useSelector(state => state.service.maxPrice);
    const [values, setValues] = React.useState([MIN, MAX]);
    const [setp, setSetp] = React.useState(10);

    const handlePriceRange = () => {
        let servicesData = [];
        let reqBody = JSON.parse(JSON.stringify({...serviceReqBody}));
        reqBody.price_filter.min_val = values[0];
        reqBody.price_filter.max_val = values[1];
        setSetp(Math.ceil(values[1]/10));

        dispatch(setLoading({loading: true}));
        axios.post('front/service/listing', reqBody).then((response) => {
            if (response.data.status) {
                let res = response.data.data.services;
                res.forEach(service => {
                    servicesData.push({
                        id: service.id,
                        image: config.apiURI + service.featuredImage,
                        name: service.name,
                        price: service.price,
                        avgRating: service.avgRating,
                        videoCount: service.videoCount,
                        isService: service.isService,
                        quantity: service.quantity
                    });
                });
            }
            dispatch(setServiceReqBody({reqBody}));
            dispatch(setServices({services: servicesData}));
            dispatch(setTotalServices({totalServices: response.data.data.totalServices}));

        }).catch(error => {
            if(error.response && error.response.data.status === false) {
                dispatch(setServices({services: servicesData}));
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

export default ServiceRangeTwoThumbs;