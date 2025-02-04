// import React, { Component } from "react";
// import { Suspense, lazy } from "react";
// import InfoAlert from "./../../components/user/home/InfoAlert";
// import Banner from "./../../components/user/home/Banner";
// import Deals from "./../../components/user/home/Deals";
// // import PopularProducts from "./../../components/user/home/PopularProducts";
// import SuperRewardsSec from "./../../components/user/home/SuperRewardsSec";
// import TrendingProducts from "./../../components/user/home/TrendingProducts";
// import PopularBrands from "./../../components/user/home/PopularBrands";
// import RecentSearch from "./../../components/user/home/RecentSearch";
// import Footer from "./../../components/common/Footer";
// import ServicesDisplay from "./service/ServicesDisplay";
// import { GetAllBanner } from "../../components/common/BannerFrame";
// // import io from 'socket.io-client'
// import SpinnerLoader from '../../components/common/SpinnerLoader';

// const PopularProducts = lazy(() => import("./../../components/user/home/PopularProducts"));
// const Header = lazy(() => import("./../../components/user/common/Header"));

// class Home extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       isToggle: true,
//       serviceData: '',
//     };

//     // this.socket = io.connect('https://localhost:7700');
//     // this.socket.on('receive_notification', (notification) => {
//     //   console.log("receive_notification", notification)
//     // })
//   }

//   componentDidMount() {
//     // Fetch isToggle value from localStorage
//     const isToggleValue = JSON.parse(localStorage.getItem("isToggle"));
//     if (isToggleValue !== null) {
//       this.setState({ isToggle: isToggleValue });
//     }
//   }

//   componentDidUpdate(prevProps, prevState) {
//     // Check if isToggle value in localStorage has changed
//     const isToggleValue = JSON.parse(localStorage.getItem("isToggle"));
//     if (isToggleValue !== prevState.isToggle) {
//       this.setState({ isToggle: isToggleValue });
//     }
//   }

//   handleIsToggle = (isToggle) => {
//     this.setState({ isToggle });
//   };
//   handleServiceData = (data) => {
//     // console.log("Data after search...", data)
//     this.setState({ serviceData: data })
//   }

//   render() {
//     const { isToggle, serviceData } = this.state;
//     // console.log("serviceData send to service listing page : ", serviceData)

//     return (
//       <React.Fragment>
//         <InfoAlert />
//         <GetAllBanner />
//         <Suspense fallback={<SpinnerLoader />}>
//           <Header handleIsToggle={this.handleIsToggle} sendServiceData={this.handleServiceData} />
//         </Suspense>
//         {!isToggle ? (
//           <React.Fragment>
//             <ServicesDisplay serviceData={serviceData} />
//           </React.Fragment>
//         ) : (
//           <React.Fragment>
//             <Banner />
//             <Deals />
//             <Suspense fallback={<h1>Loading please wait....................</h1>}>
//               <PopularProducts />
//             </Suspense>
//             {/* <PopularProducts /> */}
//             <SuperRewardsSec />
//             <TrendingProducts />
//             <PopularBrands />
//             <RecentSearch />
//           </React.Fragment>
//         )}
//         <Footer />
//       </React.Fragment>
//     );
//   }
// }
// export default Home;


//***********************TEST START**************************//
import React, { Component, Suspense, lazy, createRef } from "react";
import InfoAlert from "./../../components/user/home/InfoAlert";
import Banner from "./../../components/user/home/Banner";
import Deals from "./../../components/user/home/Deals";
import Footer from "./../../components/common/Footer";
// import ServicesDisplay from "./service/ServicesDisplay";
import { GetAllBanner } from "../../components/common/BannerFrame";
import SpinnerLoader from '../../components/common/SpinnerLoader';

// Lazy load components
const Header = lazy(() => import("./../../components/user/common/Header"));
const PopularProducts = lazy(() => import("./../../components/user/home/PopularProducts"));
const SuperRewardsSec = lazy(() => import("./../../components/user/home/SuperRewardsSec"));
const TrendingProducts = lazy(() => import("./../../components/user/home/TrendingProducts"));
const PopularBrands = lazy(() => import("./../../components/user/home/PopularBrands"));
const RecentSearch = lazy(() => import("./../../components/user/home/RecentSearch"));
const ServicesDisplay = lazy(() => import("./service/ServicesDisplay"));


class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isToggle: true,
      serviceData: '',
      isComponentVisible: {
        popularProducts: false,
        superRewardsSec: false,
        trendingProducts: false,
        popularBrands: false,
        recentSearch: false,
      },
    };

    // Create refs for each lazy-loaded component
    this.componentRefs = {
      popularProducts: createRef(),
      superRewardsSec: createRef(),
      trendingProducts: createRef(),
      popularBrands: createRef(),
      recentSearch: createRef(),
    };
  }

  componentDidMount() {
    const isToggleValue = JSON.parse(localStorage.getItem("isToggle"));
    if (isToggleValue !== null) {
      this.setState({ isToggle: isToggleValue });
    }

    // Set up IntersectionObservers for each component
    this.setupObservers();
  }

  setupObservers = () => {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const componentName = Object.keys(this.componentRefs).find(refName => this.componentRefs[refName].current === entry.target);
          if (componentName) {
            this.setState(prevState => ({
              isComponentVisible: {
                ...prevState.isComponentVisible,
                [componentName]: true,
              }
            }));
            this.observer.unobserve(entry.target); // Stop observing once loaded
          }
        }
      });
    });

    // Observe each component ref
    Object.values(this.componentRefs).forEach(ref => {
      if (ref.current) this.observer.observe(ref.current);
    });
  };

  componentWillUnmount() {
    if (this.observer) {
      // Clean up observers
      this.observer.disconnect();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const isToggleValue = JSON.parse(localStorage.getItem("isToggle"));
    if (isToggleValue !== prevState.isToggle) {
      this.setState({ isToggle: isToggleValue });
    }
  }

  handleIsToggle = (isToggle) => {
    console.log("Home page", isToggle)
    this.setState({ isToggle });
  };

  handleServiceData = (data) => {
    this.setState({ serviceData: data });
  };

  render() {
    const { isToggle, serviceData, isComponentVisible } = this.state;

    return (
      <React.Fragment>
        <InfoAlert />
        <GetAllBanner />
        <Suspense fallback={<SpinnerLoader />}>
          <Header handleIsToggle={this.handleIsToggle} sendServiceData={this.handleServiceData} />
        </Suspense>
        {!isToggle ? (
          <Suspense fallback={<SpinnerLoader />}>
            <ServicesDisplay serviceData={serviceData} />
          </Suspense>
        ) : (
          <React.Fragment>
            <Banner />
            <Deals />
            {/* PopularProducts Section */}
            {/* <div ref={this.componentRefs.popularProducts}>
              {isComponentVisible.popularProducts ? (
                <Suspense fallback={<SpinnerLoader />}>
                  <PopularProducts />
                </Suspense>
              ) : ("")}
            </div> */}

            <Suspense fallback={<SpinnerLoader />}>
              <PopularProducts />
            </Suspense>

            {/* SuperRewardsSec Section */}
            {/* <div ref={this.componentRefs.superRewardsSec}>
              {isComponentVisible.superRewardsSec ? (
                <Suspense fallback={<SpinnerLoader />}>
                  <SuperRewardsSec />
                </Suspense>
              ) : ("")}
            </div> */}

            <Suspense fallback={<SpinnerLoader />}>
              <SuperRewardsSec />
            </Suspense>

            {/* TrendingProducts Section */}
            {/* <div ref={this.componentRefs.trendingProducts}>
              {isComponentVisible.trendingProducts ? (
                <Suspense fallback={<SpinnerLoader />}>
                  <TrendingProducts />
                </Suspense>
              ) : ("")}
            </div> */}

            <Suspense fallback={<SpinnerLoader />}>
              <TrendingProducts />
            </Suspense>

            {/* PopularBrands Section */}
            {/* <div ref={this.componentRefs.popularBrands}>
              {isComponentVisible.popularBrands ? (
                <Suspense fallback={<SpinnerLoader />}>
                  <PopularBrands />
                </Suspense>
              ) : ("")}
            </div> */}

            <Suspense fallback={<SpinnerLoader />}>
              <PopularBrands />
            </Suspense>

            {/* RecentSearch Section */}
            {/* <div ref={this.componentRefs.recentSearch}>
              {isComponentVisible.recentSearch ? (
                <Suspense fallback={<SpinnerLoader />}>
                  <RecentSearch />
                </Suspense>
              ) : ("")}
            </div> */}
          </React.Fragment>
        )}
        <Footer />
      </React.Fragment>
    );
  }
}

export default Home;


//***********************TEST END****************************//


