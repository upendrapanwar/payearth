import React, {useState, useEffect } from 'react';
import Header from '../../components/seller/common/Header';
import Footer from '../../components/common/Footer';
import { useLocation } from "react-router-dom";
import axios from "axios";



const SupportTicketChat = () => {

    const location = useLocation();
    const { ticket } = location.state;

    const authInfo = JSON.parse(localStorage.getItem('authInfo'));

    const [messages, setMessages] = useState([]);



    useEffect(() => {
        getMessage();
    }, [])

    const getMessage = async () => {
        const ticketId = ticket.ticketId;

        const response = await axios.get(`/seller/get-indivisual-opened-tickect-message/${ticketId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${authInfo.token}`
            }
        })

        if(response.data.status===true && response.data.data.length > 0){

        }

        console.log("Response of the ticket message", response);
    }


    return (
        <React.Fragment>
            <Header />
            <div className="inr_top_page_title">
                <h2>Support Tickets Chat</h2>
            </div>
            <section className="admin-dashboard-wrapper">
                <div className="inr_wrap dash_inner_wrap support_manager_wrapper">
                    <div className="col-md-12">
                        <div className="seller_dash_wrap pt-5 pb-5">
                            <div className="container ">
                                <div className="bg-white rounded-3 pt-3 pb-5">
                                    <div className="d-flex justify-content-between align-items-center mx-3">
                                        <h3>Support Ticket Chat</h3>
                                    </div>

                                    {/* Display Ticket Messages */}
                                    <div className='mx-3 mb-4'>
                                        {messages.map((ticket) => (
                                            <div key={ticket.id} className="card mb-2">
                                                <div className="card-body">
                                                    <h5 className="card-title">{ticket.sender}</h5>
                                                    <p className="card-text">{ticket.message}</p>
                                                </div>
                                            </div>
                                        ))}
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

export default SupportTicketChat