import React, { Component } from 'react';
import InfoAlert from './../../components/user/home/InfoAlert';
import Header from './../../components/user/common/Header';
import Banner from './../../components/user/home/Banner';
import Deals from './../../components/user/home/Deals';
import PopularProducts from './../../components/user/home/PopularProducts';
import SuperRewardsSec from './../../components/user/home/SuperRewardsSec';
import TrendingProducts from './../../components/user/home/TrendingProducts';
import PopularBrands from './../../components/user/home/PopularBrands';
import RecentSearch from './../../components/user/home/RecentSearch';
import Footer from './../../components/common/Footer';


class Home extends Component {
    render() {
        return (
            <React.Fragment>
                <InfoAlert />
				<Header />
				<Banner />
				<Deals />
				<PopularProducts />
				<SuperRewardsSec />
				<TrendingProducts />
				<PopularBrands />
				<RecentSearch />
                <Footer />
            </React.Fragment>
        );
    }
}

export default Home;