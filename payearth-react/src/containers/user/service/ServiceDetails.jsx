import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Header from "../../../components/user/common/Header";
import PageTitle from "../../../components/user/common/PageTitle";
import { useParams } from "react-router-dom";
import GoToTop from "../../../helpers/GoToTop";
import Footer from "../../../components/common/Footer";
import parse from "html-react-parser";
import { Link } from "react-router-dom/cjs/react-router-dom";
import ServiceDetailsTabbing from "../../../components/user/common/services/ServiceDetailsTabbing";
import SpinnerLoader from "../../../components/common/SpinnerLoader";
import { BannerTopIframe } from "../../../components/common/BannerFrame";
import arrow_back from "../../../assets/icons/arrow-back.svg";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { isLogin } from "./../../../helpers/login";

const ServiceDetails = () => {
  const history = useHistory();
  const currentUser = isLogin();
  const { id } = useParams();
  const [commonServiceData, setCommonServiceData] = useState([]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  // const [charges, setCharges] = useState("");
  const [reviews, setReviews] = useState([]);
  const myRef = useRef(null);
  const reportRef = useRef(null);
  const [loading, setLoading] = useState(true);

  //Service Id save in session For zoom Notification
  const serviceId = id;
  sessionStorage.setItem("serviceId", serviceId);
  const [averageRating, setAverageRating] = useState(0);
  const [TotalReview, setTotalReview] = useState(0);
  useEffect(() => {
    fetchApi();
    fetchData();
    //scrollToMyRef();
  }, []);

  const [scrollToReviews, setScrollToReviews] = useState(false);

  const fetchData = async () => {
    try {
      const res = await axios.get(`/user/get-common-service/${id}`);
      const data = res.data.data;
      sessionStorage.setItem("serviceDetails", JSON.stringify(data));
      const dataArray = Array.isArray(res.data.data)
        ? res.data.data
        : [res.data.data];
      setCommonServiceData(dataArray);

      setDescription(dataArray[0].description); // Set description
      setCategory(dataArray[0].category.categoryName); //Set category
      // setCharges(dataArray[0].charges)

      setReviews(dataArray[0].reviews); // Set reviews
      setLoading(false); // Set loading to false after fetching data
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false); // Set loading to false even if there's an error
    }
  };

  const scrollToMyRef = (event) => {
    event.preventDefault();
    myRef.current.scrollIntoView({ behavior: "smooth" });
    setScrollToReviews(true);
    // setTimeout(() => setScrollToReviews(false), 5000); // Reset the scrollToReviews state
  };

  // Function to receive data from ServiceDetailTabbing
  const handleDataFromTabbing = (data) => {
    // Process the data received from ServiceDetailTabbing
    console.log("Data received from ServiceDetailTabbing:", data);
  };

  const handleCheckout = () => {
    if (!currentUser) {
      toast.error("Please Login", { autoClose: 3000 });
    } else {
      history.push("/service_Charge_Checkout");
    }
  };

  const fetchApi = async () => {
    try {
      const response = await axios.get(`/user/get-service-review/${serviceId}`);
      const result = response.data.data;
      setReviews(result);
      // console.log("review data", result);

      // Calculate average rating
      if (result.length > 0) {
        //console.log("rating----", result);
        const totalRating = result.reduce((acc, curr) => acc + curr.rating, 0);
        const average = totalRating / result.length;
        setAverageRating(average);
        setTotalReview(result.length);
      }
    } catch (error) {
      console.log("Error fetching data:", error);
    }
  };

  const renderStarRating = (ratingValue) => {
    const stars = [];
    // Calculate full stars
    const fullStars = Math.floor(ratingValue);
    // Check if there's a half star
    const hasHalfStar = ratingValue - fullStars >= 0.5;
    // Iterate through 5 stars
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        // Full star
        stars.push(<li className="star rated" key={i}></li>);
      } else if (hasHalfStar && i === fullStars) {
        // Half star
        stars.push(<li className="star half-star" key={i}></li>);
      } else {
        // Empty star
        stars.push(<li className="star" key={i}></li>);
      }
    }
    return <ul className="rating">{stars}</ul>;
  };

  const scrollToReport = () => {
    if (reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <React.Fragment>
      {loading === true ? <SpinnerLoader /> : ""}
      <BannerTopIframe keywords={category} />
      <Header />
      <PageTitle title={"Service-Details"} />
      <section className="inr_wrap">
        <div className="container">
          {commonServiceData.length > 0 &&
            commonServiceData.map((data, index) => (
              <div className="row g-0 bg-white rounded" key={index}>
                <div className="d-flex justify-content-end">
                  <Link className="btn custom_btn btn_yellow  mt-3 mx-3" to="/">
                    <img src={arrow_back} alt="Back" />
                    &nbsp;Back
                  </Link>
                </div>
                <div className="col-md-6">
                  <div className="ser_thumb_div">
                    <img
                      className="img_srv_details"
                      src={data.featuredImage}
                      alt="Service Details Image"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="prod_dtl_info">
                    <div className="prod_dtl_body">
                      <div className="pdi_ratings">
                        <div className="rating">
                          <p className="review_count">
                            Average Rating: {averageRating.toFixed(1)}
                            <Link
                              to="myRef"
                              className="reviews_count"
                              onClick={scrollToMyRef}
                            >
                              ( {TotalReview} Reviews )
                            </Link>
                          </p>
                          <p className="rating_point ">
                            {renderStarRating(averageRating)}
                          </p>
                        </div>
                      </div>
                      <h2>{data.name}</h2>
                      <div className="pdi_avblty">
                        <p>Service Code : {data.serviceCode}</p>
                        <p>Category : {data.category.categoryName}</p>
                      </div>
                      <div className="pdi_desc">
                      <p>Description :</p>
                      <div className="ql-editor ql-discription">
                        {" "}
                        {data.description ? parse(data.description) : ""}
                      </div>
                      </div>
                      <div className="pdi_fea prod_foot">
                        <button
                          className="btn custom_btn btn_yellow mx-4"
                          onClick={handleCheckout}
                        >
                          <b>{`$${data.charges}`}</b>&nbsp; Pay Now
                        </button>
                        {/* <button className="btn custom_btn btn_yellow" onClick={() => { this.props.history.push('/user/service_Charge_Checkout') }}>{<b>{`$${data.charges}`}</b>}&nbsp; Pay Now</button> */}
                        {/* <Link className="btn custom_btn btn_yellow" to="#">
                          {<b>{`$${data.charges}`}</b>}&nbsp; Pay Now
                        </Link> */}
                        <br />
                      </div>
                      <div className="pdi_share">
                        <p>
                          Created :{" "}
                          {new Date(data.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                          {/* {"  "}Time :{" "}
                          {new Date(data.createdAt).toLocaleTimeString()} */}
                        </p>
                      </div>
                      <div className="pdi_share_links"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </section>
      <div name="myRef" ref={myRef}>
        <ServiceDetailsTabbing
          serviceId={id}
          description={description}
          scrollToReviews={scrollToReviews}
        />
      </div>
      <Footer />
      <GoToTop />
    </React.Fragment>
  );
};

export default ServiceDetails;
