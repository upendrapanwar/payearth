import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';



export const BannerIframe = ({ width, height, keywords }) => {

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
                // console.log("response.data.data", response.data.data.length)
                const data = response.data.data;
                // console.log("data", data)
                setAdvertisements(data)
                const urls = data.map(item => !item.video ? item.image : item.video);
                // console.log("urls", urls)
                setUrlData(urls)
                setLength(urls.length)
                // setAdvertisements(response.data.data)
            })
            .catch(error => {
                console.log("error", error)
            })
    }, [keywords]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            // Update the current URL index to the next one in the array
            setCurrentUrlIndex((prevIndex) => (prevIndex + 1) % advertisements.length);
        }, 10000);

        // Clear the interval when the component is unmounted
        return () => clearInterval(intervalId);
    }, [length]); // Empty dependency array ensures the effect runs only once on mount

    const onWebsiteMove = (url) => {
        window.open(url, '_blank');
    };

    const iframeStyles = {
        // border: '1px solid red',
        borderRadius: '5px',

        // boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        // width: -webkit-fill-available
    };

    const openIframe = () => {
        setIframeOpen(true);
    };

    const closeIframe = () => {
        setIframeOpen(false);
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setIframeOpen(true);
        }, 5000);
        return () => clearTimeout(timeoutId);
    }, []);


    // WORKING DONE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const renderIframe2 = () => <>
        {iframeOpen === false ? "" : <button onClick={closeIframe}>CLOSE</button>}
        {iframeOpen === true ? <iframe
            // src={urlData[currentUrlIndex]}
            src={""}
            width="10%"
            height="500px"
            scrolling="no"
            style={iframeStyles}
        ></iframe> : ""}
    </>

    // WORKING DONE>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    const renderCheckIframe = () => <>
        {iframeOpen === false ? "" : <button onClick={closeIframe}>CLOSE</button>}
        {iframeOpen === true ? (<div><iframe
            src={advertisements.map(item => !item.video ? item.image : item.video)[currentUrlIndex]}
            width="100%"
            height="150px"
            scrolling="no"
            style={iframeStyles}
            className="centeredIframe"
        ></iframe>
            <button onClick={() => onWebsiteMove(advertisements[currentUrlIndex].siteUrl)}>
                Open Website
            </button>
        </div>) : ""}
    </>

    // return <>
    //     {iframeOpen === false ? "" : <button onClick={closeIframe}>CLOSE</button>}
    //     { iframeOpen && advertisements.map((item, index) => <div key={index}>
    //         <iframe
    //             title={`iframe-${index}`}
    //             src={!item.image ? item.video : item.image}
    //             width="100%"
    //             height="150px"
    //             scrolling="no"
    //             style={iframeStyles}
    //         />
    //     </div>
    //     )}
    // </>

    return <>
        {/* <div>
            {renderIframe()}
        </div> */}
        <div>
            {renderCheckIframe()}
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
            { renderIframe2()}
            { renderIframe2()}
        </div>

    </>
}


{/* <iframe
        src={src}
        width="10%"
        height="500px"
        scrolling="no"
        style={iframeStyles}
    />; */}