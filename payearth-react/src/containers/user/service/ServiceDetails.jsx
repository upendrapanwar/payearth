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

const ServiceDetails = () => {
  const { id } = useParams();
  const [commonServiceData, setCommonServiceData] = useState([]);
  const [description, setDescription] = useState("");
  const [reviews, setReviews] = useState([]);
  const myRef = useRef(null);

  useEffect(() => {
    fetchData();
    scrollToMyRef();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get(`/user/get-common-service/${id}`);
      const dataArray = Array.isArray(res.data.data)
        ? res.data.data
        : [res.data.data];
      setCommonServiceData(dataArray);
      setDescription(dataArray[0].description); // Set description
      setReviews(dataArray[0].reviews); // Set reviews
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  const scrollToMyRef = () => {
    if (myRef.current) {
      myRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Function to receive data from ServiceDetailTabbing
  const handleDataFromTabbing = (data) => {
    // Process the data received from ServiceDetailTabbing
    console.log("Data received from ServiceDetailTabbing:", data);
  };

  return (
    <React.Fragment>
      <Header />
      <PageTitle title={"Service-Details"} />
      <section className="inr_wrap">
        <div className="container">
          {commonServiceData.length > 0 &&
            commonServiceData.map((data, index) => (
              <div className="row g-0 bg-white rounded" key={index}>
                <div className="col-md-6">
                  <div className="ser_thumb_div">
                    <img src={data.featuredImage} alt="Service Details Image" />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="prod_dtl_info">
                    <div className="prod_dtl_body">
                      <h2>{data.name}</h2>
                      <div className="pdi_avblty">
                        <p>Service Code : {data.serviceCode}</p>
                      </div>
                      <div className="pdi_desc"></div>
                      <p>{data.category.categoryName}</p>
                      <p>{data.description ? parse(data.description) : ""}</p>
                      <div className="pdi_fea">
                        <Link className="btn custom_btn btn_yellow" to="/">
                          Buy Now
                        </Link>
                        <br />
                      </div>
                      <div className="pdi_share">
                        <p>
                          Created :{" "}
                          {new Date(data.createdAt).toLocaleDateString()} Time :{" "}
                          {new Date(data.createdAt).toLocaleTimeString()}
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
      <div>
        <ServiceDetailsTabbing serviceId={id} description={description} />
      </div>
      <Footer />
      <GoToTop />
    </React.Fragment>
  );
};

export default ServiceDetails;
