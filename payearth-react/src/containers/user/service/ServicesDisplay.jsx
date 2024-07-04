import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import SpinnerLoader from "../../../components/common/SpinnerLoader";
import Banner from "../../../components/user/home/Banner";
import SuperRewardsSec from "../../../components/user/home/SuperRewardsSec";
import PopularBrands from "../../../components/user/home/PopularBrands";
import SectionTitle from "../../../components/user/home/SectionTitle";

const Services = (props) => {
  const [userServiceData, setUserServiceData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  useEffect(() => {
    fetchData();
  }, [props.serviceData]);

  const fetchData = async () => {
    // console.log("props.data form service searching filteing...", props.serviceData)
    try {
      const res = await axios.get("user/get-common-service");
      if (!props.serviceData) {
        // console.log("NO search data found...")
        setUserServiceData(res.data.data);
      } else {
        // console.log("Data is found....TRUEE")
        setUserServiceData(props.serviceData);
      }
      // setUserServiceData(res.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data: ", error);
      setLoading(false);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    const totalPages = Math.ceil(userServiceData.length / itemsPerPage);
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServiceData = userServiceData.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  return (
    <React.Fragment>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            background: "rgba(255, 255, 255, 0.8)",
            zIndex: "9999",
          }}
        >
          <SpinnerLoader />
        </div>
      ) : (
        <React.Fragment>
          <Banner />
          <section className="popular_products_sec">
            <SectionTitle title="Our Services" />
            <div className="container">
              <div className="row">
                <div className="col-sm-12 m-auto">
                  <div className="cards_wrapper">
                    {currentServiceData.map((service) => (
                      <Link
                        key={service._id}
                        className="card"
                        to={`/service-detail/${service._id}`}
                      >
                        <div className="serviceListing-Image">
                          <img src={service.featuredImage} alt={service.name} />
                        </div>
                        <div className="serviceListing-content text-center">
                          <h3 className="m-auto">{service.name}</h3>
                          <div
                            className="service-desc m-auto p-2"
                            dangerouslySetInnerHTML={{
                              __html: service.description,
                            }}
                          ></div>
                          <div className="text-center">
                            <button
                              type="button"
                              className="btn custom_btn btn_yellow"
                            >
                              View More
                            </button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                  {/* Pagination controls */}
                  <div className="cart-pagination">
                    {userServiceData.length > itemsPerPage && (
                      <ul className="pagination-wrapper">
                        <li>
                          <button onClick={prevPage}>Prev</button>
                        </li>
                        {Array(Math.ceil(userServiceData.length / itemsPerPage))
                          .fill()
                          .map((_, index) => (
                            <li key={index}>
                              <button
                                onClick={() => handlePageChange(index + 1)}
                                className={
                                  currentPage === index + 1 ? "active" : ""
                                }
                              >
                                {index + 1}
                              </button>
                            </li>
                          ))}
                        <li>
                          <button onClick={nextPage}>Next</button>
                        </li>
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>
          <SuperRewardsSec />
          <PopularBrands />
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Services;
