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
           console.log("deals card data : ", response.data.data);
          const data = response.data.data;
          for (var i = 0; i < data.length; i++) {
            deals.push({
              image: data[i].dealImage,
              id: data[i].id,
              // clickEvent: "sliderClick"
              clickEvent: ((id) => () => handleDealClick(id))(data[i].id),
            })
          }
         // console.log("deals check......", deals)
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
  /***************************************************************************/


    const handleDealClick = (deal) => {
     // toast.info(`Clicked on: ${deal}`);
     // console.log("Clicked deal details: ", deal);
     history.push(`/deal-ofthe-day?id=${deal}`); 
    };

  /***************************************************************************/
  /***************************************************************************/

  return (
    <section className="deals_sec">
      <div className="container">
        <div className="row">
          <div className="col-sm-12">
            {data && data.length ? (
              <>
                <SectionTitle
                  title="Deals Of the day"
                  viewMore={true}
                  route={"#"}
                />
                <ReactCardSlider slides={data} />
              </>
            ) : (
              ""
            )}
            {/* <div className="cards_wrapper">
              {data && data.length
                ? data.map((value, index) => {
                  return (
                    <div key={index}>
                      <Link to="#" className="d-inline-block">
                        <img
                          src={value.dealImage}
                          alt="..."
                          className="img-fluid"
                        />
                      </Link>
                    </div>
                  );
                })
                : ""}
            </div> */}

          </div>
        </div>
      </div>
    </section >
  );
};

export default Deals;
