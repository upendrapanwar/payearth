
import React, { useState, useEffect } from 'react';
import Header from './../../components/user/common/Header';
import PageTitle from './../../components/user/common/PageTitle';
import ServiceSidebar from './../../components/user/common/ServiceSidebar';
import Footer from './../../components/common/Footer';
import ListingHead from './../../components/user/common/ListingHead';
import ServiceCard from './../../components/common/ServiceCard';
import { NotFound } from './../../components/common/NotFound';
import SpinnerLoader from './../../components/common/SpinnerLoader';
import config from './../../config.json';
import axios from 'axios';
import { Link, useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setProducts, setReqBody, setTotalProducts, setMaxPrice } from './../../store/reducers/product-reducer';
import { setLoading } from './../../store/reducers/global-reducer';
import readUrl from './../../helpers/read-product-listing-url';
import { getBrands, getColors } from './../../helpers/product-listing';
import { Helmet } from 'react-helmet';
import GoToTop from './../../helpers/GoToTop';

const ServicesListing = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const category = queryParams.get("cat");
    const searchQuery = queryParams.get("searchText");
    const subCat = queryParams.get("subcat");
    const reqBodyFromStore = useSelector(state => state.product.reqBody);
    // const { loading } = useSelector(state => state.global);

    const { totalProducts } = useSelector(state => state.product);
    const { selectedWishItems } = useSelector(state => state.wishlist);
    const [reqBody, setReqBodyState] = useState(JSON.parse(JSON.stringify(reqBodyFromStore)));
    const [services, setServicesState] = useState([]);
    const [loading, setLoading] = useState(true);
    const [priceRange, setPriceRange] = useState();
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [categories, setCategories] = useState('')
    const [sideBarToggle, setSideBarToggle] = useState(false);

    useEffect(() => {
        if (!category) {
            setSelectedCategories([]);
        } else {
            handleCategoryChange([`${category}`]);
        }
    }, [category]);

    // useEffect(() => {
    //     if (!subCat) {
    //         setSelectedSubCategories([]);
    //     } else {
    //         handleSubCategoryChange([`${subCat}`]);
    //     }
    // }, [subCat]);

    useEffect(() => {
        axios.get("front/getServiceCategory")
            .then((response) => {
                if (response.data.status) {
                    console.log("response.data.data", response.data.data)
                    setCategories(response.data.data);
                } else {
                    console.log("Error")
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        let reqBodyUpdated = { ...reqBody };
        reqBodyUpdated = readUrl(reqBodyUpdated, window.location, setReqBody, 'product-listing');
        setReqBodyState(reqBodyUpdated);
        getServices('didMount');
    }, []);

    useEffect(() => {
        getServices()
    }, [priceRange, selectedCategories, searchQuery, category])

    const handlePriceRangeChange = (range) => {
        setPriceRange(range);
    };

    const handleCategoryChange = (categories) => {
        setSelectedCategories(categories);
    };

    const handleSubCategoryChange = (categories) => {
        // setSelectedSubCategories(categories);
    };

    const handleBrandChange = (brands) => {
        // setSelectedBrands(brands);
    };

    const getServices = () => {
        console.log("function run getServices")
        // let productsData = [];
        let servicesData = [];
        let reqBodyUpdated = {
            "priceRange": priceRange,
            "selectedCategories": selectedCategories,
            "searchQuery": searchQuery,
        };

        axios.post('front/service/listing', reqBodyUpdated).then((response) => {
            if (response.data.status) {
                let res = response.data.data;
                console.log("res", res)
                res.forEach(service => {
                    servicesData.push({
                        id: service.id,
                        image: service.featuredImage,
                        name: service.name,
                        isService: service.isService,
                        price: service.charges,
                        avgRating: service.avgRating,
                    });
                });
            }
            console.log("servicesData", servicesData)
            setServicesState(servicesData);
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                // dispatch(setProducts({ products: [] }));
            }
        }).finally(() => {
            setTimeout(() => {
                setLoading(false);
            }, 300);
        });
    }

    return (
        <React.Fragment>
            <Helmet><title>{"Services - Pay Earth"}</title></Helmet>
            {loading === true ? <SpinnerLoader /> : ''}
            <Header
                pageName="service-listing"
                reqBody={reqBody}
            // sendProductsData={handleProductData}
            />
            <PageTitle title={"Services"} />
            <section className="inr_wrap">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-end mt-2">
                            <button
                                type="button"
                                className="btn custom_btn btn_yellow"
                                onClick={() => window.history.back()}
                            >
                                Back
                            </button>
                        </div>
                        <div className="col-md-3 mt-3" style={{ overflowY: 'auto', maxHeight: '120vh', border: '1px solid #ddd', scrollbarWidth: 'thin', }}>
                            <div className='mob-show'>
                                <button class="filter-mob-catShow px-2" type="button" aria-controls="navbarExampleOnHover" aria-expanded="false" aria-label="Toggle navigation" onClick={() => setSideBarToggle(prevState => !prevState)}><span class="fa fa-bars"></span> Filter</button>
                            </div>
                            <ServiceSidebar pageName="service-listing"
                                sideBarToggle={sideBarToggle}
                                categories={categories}
                                onPriceRangeChange={handlePriceRangeChange}
                                onCategoryChange={handleCategoryChange}
                            // onSubCategoryChange={handleSubCategoryChange}
                            // onBrandChange={handleBrandChange}
                            />
                        </div>
                        <div className="col-md-9 my-3" style={{ overflowY: 'auto', maxHeight: '120vh', border: '1px solid #ddd', scrollbarWidth: 'thin', }}>
                            <div className="row">
                                <div className="col-sm-12">
                                    {services.length === 0 ? <NotFound msg="Product not found." /> : ''}
                                    <div className="cards_wrapper">
                                        {
                                            services.map((service, index) => (
                                                <ServiceCard
                                                    data={service}
                                                    key={index}
                                                // inWishList={selectedWishItems.length !== 0 && selectedWishItems.includes(service.id)}
                                                />
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            <GoToTop />
        </React.Fragment>
    );
}

export default ServicesListing;
