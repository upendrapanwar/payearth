import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Iframe from 'react-iframe-click';

export const BannerTopIframe = ({ width, height, keywords }) => {
    const [advertisements, setAdvertisements] = useState([]);
    const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
    const [length, setLength] = useState();
    const [urlData, setUrlData] = useState([]);
    const [iframeOpen, setIframeOpen] = useState(false);

    // const urls = [
    //     'https://res.cloudinary.com/pay-earth/image/upload/v1709725194/i5rvjqqrnrm2eayud2bc.webp',
    //     'https://res.cloudinary.com/pay-earth/image/upload/v1709703903/js03dmpw2xuj6jaf2hmo.webp',
    //     'https://res.cloudinary.com/pay-earth/image/upload/v1708689694/x91tiqgzrgrqwccs6j2n.jpg',
    //     'https://res.cloudinary.com/pay-earth/video/upload/v1708603407/s1bqdavozmfyoa1jenjt.mp4',
    // ];

    useEffect(() => {
        axios.get(`/front/advBanner-list/${keywords}`)
            .then((response) => {
                // console.log("response.data.data", response.data.data)
                const data = response.data.data;
                console.log("data $$", data)
                setAdvertisements(data)
                const urls = data.map(item => !item.video ? item.image : item.video);
                setUrlData(urls)
                setLength(urls.length)
                // console.log("urls length", urls.length)
                if (urls.length > 0) {
                    const timeoutId = setTimeout(() => {
                        setIframeOpen(true);
                    }, 5000);
                    return () => clearTimeout(timeoutId);
                }
            })
            .catch(error => {
                console.log("error", error)
            })
    }, [keywords]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentUrlIndex((prevIndex) => (prevIndex + 1) % advertisements.length);
        }, 7000);

        return () => clearInterval(intervalId);
    }, [length]);

    const onWebsiteMove = (url) => {
        window.open(url, '_blank');
        closeIframe();
    };

    const iframeStyles = {
        // border: '1px solid red',
        borderRadius: '5px',
        objectFit: 'fill',
        width: '100%',

        // boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        // width: -webkit-fill-available
    };

    const openIframe = () => {
        setIframeOpen(true);
    };

    const closeIframe = () => {
        setIframeOpen(false);
    };

    const renderBannerTopIframe = () => <>
        {iframeOpen === true ? (<div className='iframe-container' key="iframeContainer">
            <button onClick={closeIframe} type="button" className="btn-close banner-close" aria-label="Close"></button>
            <Iframe
                src={advertisements.map(item => !item.video ? item.image : item.video)[currentUrlIndex]}
                width="100%"
                height="150px"
                scrolling="no"
                style={iframeStyles}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="centeredIframe"
                onInferredClick={() => onWebsiteMove(advertisements[currentUrlIndex].siteUrl)}
                // onLoad={handleIframeLoad}
            />
        </div>) : ""}
    </>

    return <>
        <div>
            {renderBannerTopIframe()}
        </div>
    </>
}

export const BannerIframe2 = ({ width, height }) => {
    const iframeStyles = {
        border: '1px solid red',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        // width: -webkit-fill-available
    };

    const renderIframe2 = () => <>
        <iframe
            // src={urlData[currentUrlIndex]}
            src={"https://res.cloudinary.com/pay-earth/video/upload/v1709885889/bcy8rm5qgmgbouubfbwn.mp4"}
            width="100%"
            height="500px"
            scrolling="no"
            style={iframeStyles}
            className='Video'
        ></iframe>
    </>

    return <>
        <div>
            {renderIframe2()}
            {renderIframe2()}
        </div>

    </>
}
