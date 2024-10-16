import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Iframe from 'react-iframe-click';
import { isLogin } from '../../helpers/login';
import ReactGA from "react-ga4";
import { toast } from 'react-toastify';

export const BannerTopIframe = ({ width, height, keywords }) => {
    const [advertisements, setAdvertisements] = useState([]);
    const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
    const [length, setLength] = useState();
    const [urlData, setUrlData] = useState([]);
    const [iframeOpen, setIframeOpen] = useState(false);
    const authInfo = JSON.parse(localStorage.getItem("authInfo"));
    const [ipAddress, setIpAddress] = useState('');
    const isloginUser = isLogin();


    useEffect(() => {
        ReactGA.initialize(process.env.REACT_APP_MEASUREMENT_ID);
    })

    useEffect(() => {
        fetchData();
    }, [keywords]);

    const fetchData = () => {
        if (keywords !== "") {
            axios.get(`/front/advBanner-list/${keywords}`)
                .then((response) => {
                    // console.log("response.data.data", response.data.data)
                    const data = response.data.data;
                    // console.log("data", data)
                    const withoutBlockData = data.filter(item => !item.blockByUser.includes(isloginUser === true ? authInfo.id : ''))
                    // console.log("withoutBlockData", withoutBlockData)
                    // console.log("data $$", data)
                    setAdvertisements(isloginUser === true ? withoutBlockData : data)
                    const urls = isloginUser === true ? withoutBlockData : data.map(item => !item.video ? item.image : item.video);
                    setUrlData(urls)
                    setLength(urls.length)
                    // console.log("urls length", urls.length)
                    if (urls.length > 0) {
                        const timeoutId = setTimeout(() => {
                            setIframeOpen(true);
                            // frameloaded();
                        }, 5000);
                        return () => clearTimeout(timeoutId);
                    }
                })
                .catch(error => {
                    console.log("error", error)
                })
        }
    };

    useEffect(() => {
        fetchIpAddress();
    }, []);

    const fetchIpAddress = async () => {
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            // console.log("Ip address", response.data.ip)
            setIpAddress(response.data.ip);
        } catch (error) {
            console.error('Error fetching IP address:', error);
        }
    };


    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentUrlIndex((prevIndex) => (prevIndex + 1) % advertisements.length);
        }, 7000);
        return () => clearInterval(intervalId);
    }, [length]);


    const onWebsiteMove = (url) => {
        window.open(url, '_blank');
        const urlWithUserId = `IframePath:${url} ,userId: ${isLogin === true ? authInfo.id : ipAddress}`;
        // const urlWithUserId = [
        //     { iframePath: `${iframePath}`, user_id: `611bab8fed84c042781aec35` },
        // ]
        ReactGA.event({
            category: 'Iframe Visit',
            action: 'Click',
            label: `${urlWithUserId}`,
        });

        closeIframe();
    };

    const block = (advertisementId) => {
        const user = isLogin();
        if (user === true) {
            const url = `https://localhost:7700/user/blockBanner/${advertisementId}`
            const blockId = {
                blockByUser: authInfo.id
            }
            // console.log("block ID user", blockId)
            axios.put(url, blockId, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            }).then((response) => {
                closeIframe();
                toast.success("Advertise Blocked successfully....", { autoClose: 2000 })
                // console.log("response", response)
                setTimeout(() => {
                    fetchData();
                }, 3000);
            }).catch((error) => {
                console.log("error", error)
            })
        }
    }

    const openIframe = () => {
        setIframeOpen(true);
    };

    const closeIframe = () => {
        setIframeOpen(false);
    };

    // const renderBannerTopIframe = () => <>
    //     {iframeOpen === true ? (<div className='iframe-container' key="iframeContainer">
    //         <div className='iFrame-wrapper'>
    //             <button onClick={closeIframe} type="button" className="btn-close banner-close" aria-label="Close"></button>
    //             <Iframe
    //                 id='portfoliosrc'
    //                 // onLoad={frameloaded}
    //                 src={advertisements.map(item => !item.video ? item.image : item.video)[currentUrlIndex]}
    //                 // width="100%"
    //                 // height="150px"
    //                 scrolling="no"
    //                 style={iframeStyles}
    //                 allow="autoplay; encrypted-media"
    //                 allowFullScreen
    //                 className="centeredIframe"
    //                 onInferredClick={() => onWebsiteMove(advertisements[currentUrlIndex].siteUrl)}
    //             ></Iframe>
    //             <button className="block_button" onClick={() => block(advertisements[currentUrlIndex].id)}>Click to Block this advertise..!</button>
    //         </div>
    //     </div>) : ""}
    // </>

    const renderBannerTopIframe = () => {
        if (iframeOpen === true) {
            const advertiseData = advertisements[currentUrlIndex];
            // console.log("advertiseData", advertiseData)
            const videoKey = `${advertiseData.video}-${Date.now()}`;
            return (
                <div className="iframe-container">
                    <div className='iFrame-wrapper'>
                        <button onClick={closeIframe} type="button" className="btn-close banner-close" aria-label="Close"></button>
                        {advertiseData.video ? (
                            <video key={videoKey} autoPlay loop onClick={() => onWebsiteMove(advertisements[currentUrlIndex].siteUrl)} className='advertisement-media'>
                                <source
                                    src={advertiseData.video}
                                    type="video/mp4"
                                // onClick={() => onWebsiteMove(advertisements[currentUrlIndex].siteUrl)}
                                />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img
                                src={advertiseData.image}
                                alt="advertisement"
                                className='advertisement-media'
                                onClick={() => onWebsiteMove(advertisements[currentUrlIndex].siteUrl)}
                            />
                        )}
                        <button className="block_button" onClick={() => block(advertisements[currentUrlIndex].id)}>Click to Block this advertise..!</button>
                    </div>
                </div>
            );
        }
    }

    return <>
        <div>
            {renderBannerTopIframe()}
        </div>
    </>
}

export const GetAllBanner = () => {
    const [advertisements, setAdvertisements] = useState([]);
    const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
    const [length, setLength] = useState();
    const [urlData, setUrlData] = useState([]);
    const [iframeOpen, setIframeOpen] = useState(false);
    const authInfo = JSON.parse(localStorage.getItem("authInfo"));
    const [ipAddress, setIpAddress] = useState('');
    const isloginUser = isLogin();

    useEffect(() => {
        ReactGA.initialize(process.env.REACT_APP_MEASUREMENT_ID);
    })
    useEffect(() => {
        fetchData();
        fetchIpAddress();
    }, [])

    const fetchData = () => {
        axios.get(`/front/getAllAdvBanner-list`)
            .then((response) => {
                // console.log("response.data.data", response.data.data)
                const data = response.data.data;
                // console.log("data", data)
                const withoutBlockData = data.filter(item => !item.blockByUser.includes(isloginUser === true ? authInfo.id : ''))
                // console.log("withoutBlockData", withoutBlockData)
                // console.log("data $$", data)
                setAdvertisements(isloginUser === true ? withoutBlockData : data)
                const urls = isloginUser === true ? withoutBlockData : data.map(item => !item.video ? item.image : item.video);
                setUrlData(urls)
                setLength(urls.length)
                // console.log("urls length", urls.length)
                if (urls.length > 0) {
                    const timeoutId = setTimeout(() => {
                        setIframeOpen(true);
                    }, 1000);
                    return () => clearTimeout(timeoutId);
                }
            })
            .catch(error => {
                console.log("error", error)
            })
    };

    const fetchIpAddress = async () => {
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            // console.log("Ip address", response.data.ip)
            setIpAddress(response.data.ip);
        } catch (error) {
            console.error('Error fetching IP address:', error);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentUrlIndex((prevIndex) => (prevIndex + 1) % advertisements.length);
        }, 7000);
        return () => clearInterval(intervalId);
    }, [length]);

    const onWebsiteMove = (url) => {
        window.open(url, '_blank');
        const urlWithUserId = `IframePath:${url} ,userId: ${isLogin === true ? authInfo.id : ipAddress}`;
        // const urlWithUserId = [
        //     { iframePath: `${iframePath}`, user_id: `611bab8fed84c042781aec35` },
        // ]

        ReactGA.event({
            category: 'Iframe Visit',
            action: 'Click',
            label: `${urlWithUserId}`,
        });

        closeIframe();
    };

    const block = (advertisementId) => {
        const user = isLogin();
        if (user === true) {
            const url = `https://localhost:7700/user/blockBanner/${advertisementId}`
            const blockId = {
                blockByUser: authInfo.id
            }
            // console.log("block ID user", blockId)
            axios.put(url, blockId, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            }).then((response) => {
                closeIframe();
                toast.success("Advertise Blocked successfully....", { autoClose: 2000 })
                // console.log("response", response)
                setTimeout(() => {
                    fetchData();
                }, 2000);
            }).catch((error) => {
                console.log("error", error)
            })
        }
    }


    const openIframe = () => {
        setIframeOpen(true);
    };

    const closeIframe = () => {
        setIframeOpen(false);
    };


    // const renderAllBannerTopIframe = () => <>
    //     {iframeOpen === true ? (<div className='iframe-container' key="iframeContainer">
    //         <div className='iFrame-wrapper'>
    //             <button onClick={closeIframe} type="button" className="btn-close banner-close" aria-label="Close"></button>

    //             <Iframe
    //                 id='portfoliosrc'

    //                 src={advertisements.map(item => !item.video ? item.image : item.video)[currentUrlIndex]}

    //                 cursor="pointer"
    //                 scrolling="no"
    //                 allow="autoplay; encrypted-media"
    //                 allowFullScreen
    //                 className="centeredIframe"
    //                 onClick={() => onWebsiteMove(advertisements[currentUrlIndex].siteUrl)}
    //             // onInferredClick={() => onWebsiteMove(advertisements[currentUrlIndex].siteUrl)}
    //             ></Iframe>
    //         </div>
    //     </div>) : ""}
    // </>

    const renderAllBannerTopIframe = () => {
        if (iframeOpen === true) {
            const advertiseData = advertisements[currentUrlIndex];
            // console.log("advertiseData", advertiseData)
            const videoKey = `${advertiseData.video}-${Date.now()}`;
            return (
                <div className="iframe-container">
                    <div className='iFrame-wrapper'>
                        <button onClick={closeIframe} type="button" className="btn-close banner-close" aria-label="Close"></button>
                        {advertiseData.video ? (
                            <video
                                key={videoKey}
                                autoPlay
                                loop
                                playsInline
                                muted
                                onClick={() => onWebsiteMove(advertisements[currentUrlIndex].siteUrl)}
                                className='advertisement-media'
                            >
                                <source
                                    src={advertiseData.video}
                                    type="video/mp4"
                                // onClick={() => onWebsiteMove(advertisements[currentUrlIndex].siteUrl)}
                                />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <img
                                className='advertisement-media'
                                src={advertiseData.image}
                                alt="advertisement"
                                onClick={() => onWebsiteMove(advertisements[currentUrlIndex].siteUrl)}
                            />
                        )}
                        {/* <button className="block_button" onClick={() => block(advertisements[currentUrlIndex].id)}>Click to Block this advertise..!</button> */}
                    </div>
                </div>
            );
        }
    }

    return <>

        {renderAllBannerTopIframe()}

    </>


}

export const BannerIframe2 = ({ width, height, }) => {

    const [iframeOpen, setIframeOpen] = useState(true);

    const iframeStyles = {
        // border: '1px solid red',
        borderRadius: '5px',
        // boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        // width: -webkit-fill-available
    };


    const closeIframe = () => {
        setIframeOpen(false);
    };

    const renderBannerSideBarIframe = () => <>
        {/* <iframe
            // src={urlData[currentUrlIndex]}
            src={"https://res.cloudinary.com/pay-earth/image/upload/v1711954185/obyrtbvcfbiktvcvtylv.png"}
            width="95%"
            height="600"
            scrolling="no"
            style={iframeStyles}
            className='Video'
        ></iframe> */}

        {iframeOpen === true ? (<div className='iframe-containerSide' key="iframeContainer">
            <button className="btn btn-light btn-sm" >Block Now...!</button>
            <button onClick={closeIframe} type="button" className="btn-close banner-close" aria-label="Close"></button>
            <iframe
                // src={advertisements.map(item => !item.video ? item.image : item.video)[currentUrlIndex]}
                src={"https://res.cloudinary.com/pay-earth/image/upload/v1705641713/cug9hizrzlpjjx9fbxi1.jpg"}
                width="95%"
                height="600px"
                scrolling="no"
                style={iframeStyles}
                allow="autoplay; encrypted-media"
                allowFullScreen
                className="centeredIframe"
            // onInferredClick={() => onWebsiteMove(advertisements[currentUrlIndex].siteUrl)}
            />

        </div>) : ""}
    </>

    return <>
        <div className='BannerSide'>
            {renderBannerSideBarIframe()}
            {/* {renderIframe2()} */}
        </div>

    </>
}
