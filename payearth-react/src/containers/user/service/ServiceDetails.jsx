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
import googleMeet from "../../../assets/icons/google-meet-logo.svg";
import { useHistory } from "react-router-dom";
import { Helmet } from 'react-helmet';
import { toast } from "react-toastify";
import { isLogin } from "./../../../helpers/login";

const ServiceDetails = () => {
  const history = useHistory();
  const currentUser = isLogin();
  const { id } = useParams();
  const [commonServiceData, setCommonServiceData] = useState([]);
  const [serviceCreator, setServiceCreator] = useState([]);
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [reviews, setReviews] = useState([]);
  const [chargesPayStatus, setChargesPayStatus] = useState(null);
  const myRef = useRef(null);
  const reportRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [TotalReview, setTotalReview] = useState(0);
  const [scrollToReviews, setScrollToReviews] = useState(false);
  const [scheduledMeeting, setScheduledMeeting] = useState(false);
  const serviceId = id;
  const authInfo = JSON.parse(localStorage.getItem("authInfo"));
  sessionStorage.setItem("serviceId", serviceId);

  useEffect(() => {
    fetchApi();
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      if (authInfo) {
        const authorId = authInfo.id || null;
        const res = await axios.get(`/user/get-common-service/${id}`,
          {
            params: {
              authorId: authorId
            },
          }
        );
        const data = res.data.data;
        sessionStorage.setItem("serviceDetails", JSON.stringify(data));
        const dataArray = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
        setCommonServiceData(dataArray);
        setDescription(dataArray[0].result.description);
        setCategory(dataArray[0].result.category.categoryName);
        setReviews(dataArray[0].result.reviews);
        setServiceCreator(dataArray[0].result.createdBy.email);
        setChargesPayStatus(dataArray[0].chargePay)
        setLoading(false);
      } else {
        const res = await axios.get(`/user/get-common-service/${id}`);
        const data = res.data.data;
        sessionStorage.setItem("serviceDetails", JSON.stringify(data));
        const dataArray = Array.isArray(res.data.data) ? res.data.data : [res.data.data];
        setCommonServiceData(dataArray);
        setDescription(dataArray[0].result.description);
        setCategory(dataArray[0].result.category.categoryName);
        setReviews(dataArray[0].result.reviews);
        setServiceCreator(dataArray[0].result.createdBy.email);
        setLoading(false);
      }
    } catch (error) {
      console.log(error)
    }
  };

  const scrollToMyRef = (event) => {
    event.preventDefault();
    myRef.current.scrollIntoView({ behavior: "smooth" });
    setScrollToReviews(true);
    setScheduledMeeting(false);
  };

  const setMeeting = (event) => {
    event.preventDefault();
    myRef.current.scrollIntoView({ behavior: "smooth" });
    setScheduledMeeting(true);
    setScrollToReviews(false);
  };

  // const handleCheckout = () => {
  //   if (!currentUser) {
  //     toast.error("Please Login", { autoClose: 3000 });
  //   } else {
  //     history.push("/service_Charge_Checkout");
  //   }
  // };

  const fetchApi = async () => {
    try {
      const response = await axios.get(`/user/get-service-review/${serviceId}`);
      const result = response.data.data;
      setReviews(result);
      if (result.length > 0) {
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
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue - fullStars >= 0.5;
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<li className="star rated" key={i}></li>);
      } else if (hasHalfStar && i === fullStars) {
        stars.push(<li className="star half-star" key={i}></li>);
      } else {
        stars.push(<li className="star" key={i}></li>);
      }
    }
    return <ul className="rating">{stars}</ul>;
  };


  console.log("commonServiceData", commonServiceData)

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
                <Helmet><title>{`Service-detail/${data.result.serviceCode} - Pay Earth`}</title></Helmet>
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
                      src={data.result.featuredImage}
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
                      <h2>{data.result.name}</h2>
                      <div className="pdi_avblty">
                        <p>Service Code : {data.result.serviceCode}</p>
                        <p>Category : {data.result.category.categoryName}</p>
                      </div>
                      <div className="pdi_desc">
                        <p>Description :</p>
                        <div className="ql-editor ql-discription">
                          {" "}
                          {data.result.description ? parse(data.result.description) : ""}
                        </div>
                      </div>
                      {/* {currentUser === true ? (
                        data.chargePay && data.chargePay.title === "charges_paid" ? (
                          <div className="card-body bg-primary-subtle text-primary-emphasis d-flex align-items-center justify-content-center gap-4 m-3" onClick={setMeeting}>
                            <h6 className="card-title font-monospace">CLICK HERE TO SCHEDULE A MEETING</h6>
                            <img src={googleMeet} alt="Meeting" style={{ width: '50px', height: '50px', cursor: 'pointer' }} onClick={setMeeting} />
                          </div>
                        ) : (
                          <div className="pdi_fea prod_foot">
                            <button
                              className="btn custom_btn btn_yellow mx-4"
                              onClick={handleCheckout}
                            >
                              <b>{`$${data.result.charges}`}</b>&nbsp; Pay Now
                            </button>
                            <br />
                          </div>
                        )
                      ) : (
                        <div className="pdi_fea prod_foot">
                          <button className="btn custom_btn btn_yellow mx-4" onClick={handleCheckout}>
                            <b>{`$${data.result.charges}`}</b>&nbsp; Pay Now
                          </button>
                          <br />
                        </div>
                      )} */}
                      <div className="pdi_share">
                        <p>
                          Created :{" "}
                          {new Date(data.result.createdAt).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
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
          scheduledMeeting={scheduledMeeting}
          serviceCreator={serviceCreator}
          chargesPayStatus={chargesPayStatus}
        />
      </div>
      <Footer />
      <GoToTop />
    </React.Fragment>
  );
};

export default ServiceDetails;
