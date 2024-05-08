import React, { Component } from 'react';
import Footer from './Footer';
import Header from '../user/common/Header';
import axios from 'axios';
import store from '../../store/index';
import Iframe from 'react-iframe-click';
import ReactGA from "react-ga4";
import { isLogin } from '../../helpers/login';
import DOMPurify from 'dompurify';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import { Helmet } from 'react-helmet';


class AdvertiseShare extends Component {
    constructor(props) {
        super(props);
        this.userInfo = store.getState().auth.userInfo;
        const { dispatch } = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;
        this.state = {
            advertise: [],
            loading: true,
            error: null,
            ipAddress: ''
        };
    }

    componentDidMount() {
        ReactGA.initialize(process.env.REACT_APP_MEASUREMENT_ID);
        this.getAdvertise();
    }

    getAdvertise = async () => {
        try {
            const { slug } = this.props.match.params;
            const url = `/front/advertisement/${slug}`;
            axios.get(url).then((response) => {
                let result = response.data.data;

                var advData = [];
                for (var i = 0; i < result.length; i++) {
                    advData.push({
                        image: result[0].image,
                        video: result[0].video,
                        siteUrl: result[0].siteUrl,
                    })
                    this.setState({ "advertise": advData, loading: false, error: null })
                }
            })

        } catch (error) {
            console.log("error", error)
        }
    }

    onWebsiteMove = (url) => {
        window.open(url, '_blank');
        const urlWithUserId = `IframePath:${url} ,userId: ${isLogin === true ? this.authInfo.id : this.ipAddress}`;
        // const urlWithUserId = [
        //     { iframePath: `${iframePath}`, user_id: `611bab8fed84c042781aec35` },
        // ]

        ReactGA.event({ 
            category: 'Iframe Visit',
            action: 'Click',
            label: `${urlWithUserId}`,
        });
    };

    fetchIpAddress = async () => {
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            // console.log("Ip address", response.data.ip)
            this.setState({ ipAddress: response.data.ip })
            // setIpAddress(response.data.ip);
        } catch (error) {
            console.error('Error fetching IP address:', error);
        }
    };
    
    render() {
        const { advertise, loading, error } = this.state;

        if (loading) {
            return <SpinnerLoader />
        }
        if (error) {
            return <div>Error: {error}</div>;
        }
        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <Header />
                {this.linkIsExpire}
                <div className='iframe-container'
                //  key="iframeContainer"
                >
                    {advertise.map(item => <>
                        <div className='iFrame-wrapper'>
                            <Iframe
                                src={!item.video ? item.image : item.video}
                                allow="autoplay; encrypted-media"
                                scrolling="no"
                                onInferredClick={() => this.onWebsiteMove(item.siteUrl)}
                            >
                            </Iframe>
                        </div>

                    </>)}
                </div>
            </React.Fragment >

        );
    }
}

export default AdvertiseShare;