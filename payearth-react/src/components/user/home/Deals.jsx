import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import SectionTitle from "./SectionTitle";
import config from "./../../../config.json";
import axios from "axios";
import ReactCardSlider from 'react-card-slider-component';
import { toast } from "react-toastify";


const Deals = () => {
  const history = useHistory();
  const [data, setData] = useState([]);
  toast.configure();

  useEffect(() => {
    var deals = [];
    axios.get("front/product/today-deals")
      .then((response) => {
        if (response.data.status) {
          const data = response.data.data;
          for (var i = 0; i < data.length; i++) {
            deals.push({
              image: data[i].dealImage,
              id: data[i].id,         
              clickEvent: ((id) => () => handleDealClick(id))(data[i].id),
            })
          }        
          setData(deals);
        } else {
          toast.error(response.data.message);
        }
      })
      .catch((error) => {
        toast.error(error);
        console.log(error);
      });
  }, []);

  const handleDealClick = (deal) => {
    history.push(`/deal-ofthe-day?id=${deal}`);
  };

  return (
    <section className="deals_sec">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            {data && data.length ? (
              <>
                <SectionTitle
                  title="Deals Of the day"
                  viewMore={false}
                  route={"#"}
                />
                <ReactCardSlider slides={data} />
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </section >
  );
};

export default Deals;
