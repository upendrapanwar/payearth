import React from 'react';
import Header from '../../components/user/common/Header';
import Footer from '../../components/common/Footer';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import arrow_back from '../../assets/icons/arrow-back.svg'

const SupportUser = () => {

    const history = useHistory();

    const handleSupportChat = async () => {
        const authInfo = JSON.parse(localStorage.getItem('authInfo'));
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        const user_id = authInfo.id


        try {
            const url = '/user/accessChat';
            axios.post(url, {
                receiverId: {
                    id: process.env.REACT_APP_SUPPORT_ADMIN_ID,
                    name: "Support Admin",
                    image_url: "",
                    // isSupport: false,
                },
                authorId: {
                    id: user_id,
                    name: userInfo.name,
                    image_url: userInfo.imgUrl,
                }
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            }).then((response) => {
                console.log("response", response)


                if (response.data.status === true) {
                    history.push({
                        pathname: '/chat',
                        state: { supportAdminId: process.env.REACT_APP_SUPPORT_ADMIN_ID }
                    });
                }
            }).catch((error) => {
                console.log("error", error);
            });
        } catch (error) {
            console.log("error", error)
        }
    }



    return (
        <React.Fragment>
            <Header />
            <div className="inr_top_page_title">
                <h2>Support</h2>
            </div>
            <section className="admin-dashboard-wrapper">
                <div className="inr_wrap dash_inner_wrap support_manager_wrapper">

                    <div className="col-md-12">
                        <div className="seller_dash_wrap pt-5 pb-5">
                            <div className="container ">
                                <div className="bg-white rounded-3 pt-3 pb-5">
                                    <div className="noti_wrap">
                                        <div className='d-flex justify-content-end'><span>
                                            <Link className="btn custom_btn btn_yellow mx-auto mt-2" to="/">
                                                <img src={arrow_back} alt="linked-in" />&nbsp;
                                                Back
                                            </Link>
                                        </span></div>
                                    </div>
                                    <div className="dash_inner_wrap">
                                        <div className="col-md-12">
                                            <div className="support_head_panel">

                                                <h2>Quick Customer Support</h2>
                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry lorem Ipsum has been the industrys standard dummy text ever since.</p>

                                                <div className="support_button">
                                                    <Link className="btn custom_btn btn_yellow mx-auto" to="/user-support-email" id="email" >Email on your Question</Link>
                                                    <Link className="btn custom_btn btn_yellow mx-auto" to='/user/support-call' id="call" >Request a call</Link>
                                                    <Link className="btn custom_btn btn_yellow mx-auto" to="#" onClick={() => handleSupportChat()}>Chat</Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            <Footer />
        </React.Fragment>
    )
}

export default SupportUser