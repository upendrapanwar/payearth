import React, { Component } from "react";
import { Suspense, lazy } from "react";
import InfoAlert from "./../../components/user/home/InfoAlert";
import Banner from "./../../components/user/home/Banner";
import Deals from "./../../components/user/home/Deals";
import PopularProducts from "./../../components/user/home/PopularProducts";
import SuperRewardsSec from "./../../components/user/home/SuperRewardsSec";
import TrendingProducts from "./../../components/user/home/TrendingProducts";
import PopularBrands from "./../../components/user/home/PopularBrands";
import RecentSearch from "./../../components/user/home/RecentSearch";
import Footer from "./../../components/common/Footer";
import ServicesDisplay from "./service/ServicesDisplay";
import { GetAllBanner } from "../../components/common/BannerFrame";
// import io from 'socket.io-client'

const Header = lazy(() => import("./../../components/user/common/Header"));

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggle: true,
      serviceData: '',
    };

    // this.socket = io.connect('https://localhost:7700');
    // this.socket.on('receive_notification', (notification) => {
    //   console.log("receive_notification", notification)
    // })
  }

  componentDidMount() {
    // Fetch isToggle value from localStorage
    const isToggleValue = JSON.parse(localStorage.getItem("isToggle"));
    if (isToggleValue !== null) {
      this.setState({ isToggle: isToggleValue });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Check if isToggle value in localStorage has changed
    const isToggleValue = JSON.parse(localStorage.getItem("isToggle"));
    if (isToggleValue !== prevState.isToggle) {
      this.setState({ isToggle: isToggleValue });
    }
  }

  handleIsToggle = (isToggle) => {
    this.setState({ isToggle });
  };
  handleServiceData = (data) => {
    // console.log("Data after search...", data)
    this.setState({ serviceData: data })
  }

  render() {
    const { isToggle, serviceData } = this.state;
    // console.log("serviceData send to service listing page : ", serviceData)

    return (
      <React.Fragment>
        <InfoAlert />
        <GetAllBanner />
        {/* Lazy load the Header component */}
        <Suspense fallback={<h1>Loading please wait...</h1>}>
          {/* Pass handleIsToggle function as props to Header */}
          <Header handleIsToggle={this.handleIsToggle} sendServiceData={this.handleServiceData} />
        </Suspense>
        {!isToggle ? (
          <React.Fragment>
            <ServicesDisplay serviceData={serviceData} />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Banner />
            <Deals />
            <PopularProducts />
            <SuperRewardsSec />
            <TrendingProducts />
            <PopularBrands />
            <RecentSearch />
          </React.Fragment>
        )}
        <Footer />
      </React.Fragment>
    );
  }
}

export default Home;
