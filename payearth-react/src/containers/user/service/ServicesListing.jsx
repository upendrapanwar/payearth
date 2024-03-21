import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Services() {
  const [userServiceData, setUserServiceData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await axios.get("user/get-common-service");
      setUserServiceData(res.data.data);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  return (
    <section className="popular_products_sec">
      <div className="container">
        <div className="row">
          <div className="col-sm-10 m-auto">
            <div className="cards_wrapper">
              {userServiceData && userServiceData.length > 0 ? (
                userServiceData.map((service) => (
                  <div key={service._id} className="card">
                    <img src={service.featuredImage} alt={service.name} />
                    <h2 className="m-auto">{service.name}</h2>
                    <p
                      className="m-auto p-2"
                      dangerouslySetInnerHTML={{ __html: service.description }}
                    ></p>
                    {userServiceData && userServiceData.length ? (
                      <div className="text-center">
                        <Link
                          type="button"
                          className="btn custom_btn btn_yellow"
                          to={`/service-detail/${service._id}`}
                        >
                          View More
                        </Link>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ))
              ) : (
                <p>No services found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
