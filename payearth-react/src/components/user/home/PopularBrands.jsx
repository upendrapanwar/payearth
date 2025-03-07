import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PopularBrands = () => {
  const [brands, setBrands] = useState([]);
  toast.configure();

  useEffect(() => {
    axios
      .get("front/popular-brands")
      .then((response) => {
        if (response.data.status) {
          setBrands(response.data.data);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error);
        console.log(error);
      });
  }, []);

  return (
    <section className="popular_brands_sec">
      <div className="container-fluid px-5">
        <div className="row">
          <div className="col-sm-12">
            <div className="main_wrapper">
              <div className="container">
                <div className="row">
                  <div className="col-sm-12 p-0">
                    <h4 className="h4 heading text-white">Popular Brands</h4>
                    <div className="brands_wrapper">
                      {brands && brands.length
                        ? brands.map((brand, index) => {
                          return (
                            <div className="brand" key={brand.id || index}>
                              <img
                                src={brand.logoImage}
                                alt="Brand logo"
                                className="img-fluid"
                                loading="lazy"
                                decoding="async"
                                width={95}
                                height={95}
                              />
                            </div>
                          );
                        })
                        : ""}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularBrands;
