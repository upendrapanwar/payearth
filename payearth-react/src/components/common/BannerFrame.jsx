import React from 'react'
import { useState, useEffect } from 'react';
import axios from 'axios';
import Iframe from 'react-iframe-click';
import { isLogin } from '../../helpers/login';
import ReactGA from "react-ga4";
import { toast } from 'react-toastify';


// All details page
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
                    const data = response.data.data;
                    const withoutBlockData = data.filter(item => !item.blockByUser.includes(isloginUser === true ? authInfo.id : ''));
                    setAdvertisements(isloginUser === true ? withoutBlockData : data)
                    const urls = isloginUser === true ? withoutBlockData : data.map(item => !item.video ? item.image : item.video);
                    setUrlData(urls)
                    setLength(urls.length)
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
        }
    };

    useEffect(() => {
        fetchIpAddress();
    }, []);

    const fetchIpAddress = async () => {
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
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
            axios.put(url, blockId, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            }).then((response) => {
                closeIframe();
                toast.success("Advertise Blocked successfully....", { autoClose: 2000 })
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

    const renderBannerTopIframe = () => {
        if (iframeOpen === true) {
            // console.log("advertiseData in home page", advertiseData)
            const advertiseData = advertisements[currentUrlIndex];
            const videoKey = `${advertiseData.video}-${Date.now()}`;
            return (
                <div className="iframe-container">
                    <div className='iFrame-wrapper'>
                        <button onClick={closeIframe} type="button" className="btn-close banner-close" aria-label="Close"></button>
                        {advertiseData.video ? (
                            <video key={videoKey} autoPlay muted loop onClick={() => onWebsiteMove(advertisements[currentUrlIndex].siteUrl)} className='advertisement-media'>
                                <source
                                    src={advertiseData.video}
                                    type="video/mp4"
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

// Home 
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
                const data = response.data.data;
                const withoutBlockData = data.filter(item => !item.blockByUser.includes(isloginUser === true ? authInfo.id : ''));
                setAdvertisements(isloginUser === true ? withoutBlockData : data);
                const urls = isloginUser === true ? withoutBlockData : data.map(item => !item.video ? item.image : item.video);
                setUrlData(urls)
                setLength(urls.length)
                if (urls.length > 0 && advertisements !== null) {
                    console.log("url", urls)
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

        ReactGA.event({
            category: 'Iframe Visit',
            action: 'Click',
            label: `${urlWithUserId}`,
        });
        closeIframe();
    };

    const closeIframe = () => {
        setIframeOpen(false);
    };

    // const renderAllBannerTopIframe = () => {
    //     const advertiseData = advertisements[currentUrlIndex];
    //     if (iframeOpen === true && advertiseData !== null) {
    //         const videoKey = `${advertiseData.video}-${Date.now()}`;
    //         console.log("advertiseData : ", advertiseData)
    //         // const videoKey = advertiseData !== null ? `${advertiseData.video}-${Date.now()}` : '';
    //         return (
    //             <div className="iframe-container">
    //                 <div className='iFrame-wrapper'>
    //                     <button onClick={closeIframe} type="button" className="btn-close banner-close" aria-label="Close"></button>
    //                     {advertiseData.video ? (
    //                         <video key={videoKey} autoPlay loop playsInline muted onClick={() => onWebsiteMove(advertisements[currentUrlIndex].siteUrl)} className='advertisement-media'>
    //                             <source
    //                                 src={advertiseData.video}
    //                                 type="video/mp4"
    //                             />
    //                             Your browser does not support the video tag.
    //                         </video>
    //                     ) : (
    //                         <img
    //                             className='advertisement-media'
    //                             src={advertiseData.image}
    //                             alt="advertisement"
    //                             onClick={() => onWebsiteMove(advertisements[currentUrlIndex].siteUrl)}
    //                         />
    //                     )}
    //                 </div>
    //             </div>
    //         );
    //     }
    // }

    const renderAllBannerTopIframe = () => {
        const advertiseData = advertisements[currentUrlIndex];

        if (iframeOpen === true && advertiseData) {
            const videoKey = `${advertiseData.video}-${Date.now()}`;
            console.log("advertiseData : ", advertiseData);

            return (
                <div className="iframe-container">
                    <div className="iFrame-wrapper">
                        <button onClick={closeIframe} type="button" className="btn-close banner-close" aria-label="Close"></button>
                        {advertiseData.video ? (
                            <video
                                key={videoKey}
                                autoPlay
                                loop
                                playsInline
                                muted
                                onClick={() => onWebsiteMove(advertiseData.siteUrl)}
                                className="advertisement-media"
                            >
                                <source src={advertiseData.video} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : advertiseData.image ? (
                            <img
                                className="advertisement-media"
                                src={advertiseData.image}
                                alt="advertisement"
                                onClick={() => onWebsiteMove(advertiseData.siteUrl)}
                            />
                        ) : null}
                    </div>
                </div>
            );
        }
        return null; // Return null if iframe is closed or advertiseData is undefined
    };

    return <>
        {renderAllBannerTopIframe()}
    </>
}


// Community
export const CommunityAdvertise = ({ width, height, keywords }) => {
    const [iframeOpen, setIframeOpen] = useState(false);
    const [advertise, setAdvertise] = useState([]);
    const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
    const [length, setLength] = useState();
    const [urlData, setUrlData] = useState([]);
    const [ipAddress, setIpAddress] = useState('');
    const isloginUser = isLogin();
    const [prevKeyword, setPrevKeyword] = useState("");
    const authInfo = JSON.parse(localStorage.getItem("authInfo"));


    useEffect(() => {
        fetchAdvertise();
        fetchIpAddress();
    }, []);

    const fetchAdvertise = async () => {
        if (keywords !== "" && keywords !== prevKeyword) {
            try {
                setPrevKeyword(keywords);
                const response = await axios.get(`/front/advBanner-list/${keywords}`);
                const data = response.data.data;
                const withoutBlockData = data.filter(item => !item.blockByUser.includes(isloginUser === true ? authInfo.id : ''))
                const url = isloginUser === true ? withoutBlockData : data.map(item => !item.video ? item.image : item.video);
                setAdvertise(isloginUser === true ? withoutBlockData : data);
                setUrlData(url)
                setLength(data.length)
                if (url.length > 0) {
                    const timeoutId = setTimeout(() => {
                        setIframeOpen(true);
                    }, 5000);
                    return () => clearTimeout(timeoutId);
                }
            } catch (err) {
                console.error("err");
            }
        }
    }

    useEffect(() => {
        if (advertise.length > 0) {
            const intervalId = setInterval(() => {
                setCurrentUrlIndex((prevIndex) => (prevIndex + 1) % advertise.length);
            }, 7000);
            return () => clearInterval(intervalId);
        }
    }, [length]);



    const iframeStyles = {
        // border: '1px solid red',
        borderRadius: '5px',
        // boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
        // width: -webkit-fill-available
    };

    const fetchIpAddress = async () => {
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            setIpAddress(response.data.ip);
        } catch (error) {
            console.error('Error fetching IP address:', error);
        }
    };

    const block = async (advertisementId) => {
        const user = isLogin();
        if (user === true) {
            const url = `https://localhost:7700/user/blockBanner/${advertisementId}`
            const blockId = { blockByUser: authInfo.id }
            await axios.put(url, blockId, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            }).then((response) => {
                closeIframe();
                toast.success("Advertise Blocked successfully....", { autoClose: 2000 })
                setTimeout(() => {
                    fetchAdvertise();
                }, 2000);
            }).catch((error) => {
                console.log("error", error)
            })
        }
    }

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
    };


    const closeIframe = () => {
        setIframeOpen(false);
    };

    const communitySideAdvertise = () => {
        if (iframeOpen === true) {
            const advertiseData = advertise[currentUrlIndex];
            const videoKey = `${advertiseData.video}-${Date.now()}`;
            return (
                <div className="row my-3">
                    <div className="col text-center position-relative">
                        <aside className="advertisement-banner position-relative">
                            <span className="small-advertise-tag position-absolute top-0 start-0 bg-dark text-white px-2 py-1 rounded">
                                Advertisement
                            </span>
                            <div className='iFrame-wrapper'>
                                <button onClick={closeIframe} type="button" className="btn-close banner-close" aria-label="Close"></button>
                                {advertiseData.video ? (
                                    <video key={videoKey} autoPlay loop muted
                                        onClick={() => onWebsiteMove(advertise[currentUrlIndex].siteUrl)}
                                        className='advertisement-media'>
                                        <source src={advertiseData.video} type="video/mp4" className='advertisement-media' />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <img
                                        src={advertiseData.image}
                                        alt="advertisement"
                                        className='advertisement-media'
                                        onClick={() => onWebsiteMove(advertise[currentUrlIndex].siteUrl)}
                                    />
                                )}
                                <button className="block_button"
                                    onClick={() => block(advertise[currentUrlIndex].id)}
                                >Click to Block this advertise..!</button>
                            </div>
                        </aside>
                    </div>
                </div>
            );
        } else {
            return ''
        }
    }

    return <>
        <div className='BannerSide'>
            {communitySideAdvertise()}
        </div>

    </>
}
