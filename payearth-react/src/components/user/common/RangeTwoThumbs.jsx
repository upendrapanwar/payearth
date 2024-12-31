import React, { useEffect, useState } from 'react';
import { Range, getTrackBackground } from 'react-range';
import { useSelector, useDispatch } from 'react-redux';
import { setReqBody, setProducts, setTotalProducts } from '../../../store/reducers/product-reducer';
import { setLoading } from '../../../store/reducers/global-reducer';
import config from './../../../config.json';
import axios from 'axios';
import { getBrands, getColors } from './../../../helpers/product-listing';

const MIN = 0;
const RangeTwoThumbs = ({ sendRanges, currencySymbol, MAX }) => {
    const dispatch = useDispatch();
    const [maxValue, setMaxValue] = useState(MAX || 1000);
    const [values, setValues] = useState([MIN, maxValue]);
    const [step, setStep] = useState(10);

    useEffect(() => {
        if (MAX) {
            setMaxValue(MAX);
            setValues([MIN, MAX]);
        }
    }, [MAX]);

    const handleChange = (values) => {
        setValues(values);
    };

    const handlePriceRange = () => {
        sendRanges(values);
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
            }}
        >
            <Range
                allowOverlap={false}
                values={values}
                step={step}
                min={MIN}
                max={maxValue}
                onChange={handleChange}
                renderTrack={({ props, children }) => (
                    <div
                        onMouseUp={handlePriceRange}
                        onMouseDown={props.onMouseDown}
                        onTouchStart={props.onTouchStart}
                        style={{
                            ...props.style,
                            height: '36px',
                            display: 'flex',
                            width: '100%',
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
                                    max: maxValue,
                                }),
                                alignSelf: 'center',
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
                            border: '4px solid #FBB500',
                        }}
                    >
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '-32px',
                                color: '#56575A',
                                fontWeight: '500',
                                fontSize: '14px',
                                fontFamily: 'Montserrat',
                            }}
                        >
                            {currencySymbol}{values[index]}
                        </div>
                    </div>
                )}
            />
        </div>
    );
};

export default RangeTwoThumbs;