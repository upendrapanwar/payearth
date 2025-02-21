import React, { useState, useEffect } from 'react';
import DataTable from 'react-data-table-component';
import Header from '../../components/seller/common/Header';
import Footer from '../../components/common/Footer';
import { Modal, Button } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import SupportTicketValidation from '../../validation-schemas/supportTicketSchema';
import { Helmet } from 'react-helmet';
import arrow_back from '../../assets/icons/arrow-back.svg'

const SupportTicketSeller = () => {
    // Global variables
    const authInfo = JSON.parse(localStorage.getItem('authInfo'));
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    // State for storing tickets
    const [tickets, setTickets] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);


    const history = useHistory();

    useEffect(() => {
        getAllTicket();
    }, []);

    // Function to fetch all tickets
    const getAllTicket = async () => {
        try {
            const sellerId = authInfo.id;
            const response = await axios.get(`/seller/getAllOpenTicket/${sellerId}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            });

            if (response.data.status === true && response.data.data.length > 0) {
                // Set the fetched ticket data to state
                setTickets(response.data.data);
            }
        } catch (error) {
            console.error("Error", error);
        }
    };


    // Function to generate a unique ticket ID
    const generateTicketId = () => {
        return uuidv4().replace(/-/g, '').substr(0, 8);
    };

    // Function to handle form submission
    const handleSubmit = async (values) => {
        try {
            const ticketId = generateTicketId();
            const sellerId = authInfo.id;
            const role = userInfo.role;

            const ticketData = {
                ticketId: ticketId,
                category: values.category,
                subject: values.subject,
                priority: values.priority,
                message: values.message,
                createdBy: sellerId,
                createdByType: role,
                status: "in-progress"
            };

            const response = await axios.post('/seller/openTicket', ticketData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            });
            console.log("response", response);
            closeModal();
            getAllTicket();
        } catch (error) {
            console.error("Error", error);
        }
    };

    // Functions to open and close the modal
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleRowClick = (row) => {
        history.push('/seller/support_ticket_message', { ticket: row })
    };


    // Columns for DataTable
    const columns = [
        {
            name: 'Ticket ID',
            selector: row => row.ticketId,
            sortable: true,
        },
        {
            name: 'Category',
            selector: row => row.category,
            sortable: true,
        },
        {
            name: 'Subject',
            selector: row => row.subject,
            sortable: true,
        },
        {
            name: 'Priority',
            selector: row => row.priority,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
        },
        {
            name: 'Created Date',
            selector: row => new Date(row.createdAt).toLocaleDateString(),
            sortable: true,
        },
    ];

    return (
        <React.Fragment>
            <Header />
            <div className="inr_top_page_title">
                <h2>Support Tickets</h2>
            </div>
            <Helmet>
                <title>{"Seller - Support Tickets - Pay Earth"}</title>
            </Helmet>
            <section className="admin-dashboard-wrapper">
                <div className='d-flex justify-content-between align-items-center pt-3 pb-3 me-4 '>
                    <div className=""></div>
                    <button
                        type="button"
                        className="btn custom_btn btn_yellow rounded-pill px-4 py-1 ms-4"
                        onClick={() => window.history.back()}
                        style={{ height: "40px" }}
                    >
                        <img src={arrow_back} alt="back" />&nbsp;
                        Back
                    </button>
                </div>
                <div className="inr_wrap dash_inner_wrap support_manager_wrapper">
                    <div className="col-md-12">
                        <div className="seller_dash_wrap pb-5">
                            <div className="container ">
                                <div className="bg-white rounded-3 pt-3 pb-5">
                                    <div className="d-flex justify-content-between align-items-center mx-3">
                                        <h3>Support Tickets</h3>
                                        <Link className="btn custom_btn btn_yellow ml-auto" to='#' onClick={openModal}>+ Open Ticket</Link>
                                    </div>

                                    <div className='mx-3'>
                                        <DataTable
                                            columns={columns}
                                            data={tickets}
                                            pagination
                                            highlightOnHover
                                            responsive
                                            defaultSortField="date"
                                            onRowClicked={handleRowClick}
                                            customStyles={{
                                                rows: {
                                                    style: {
                                                        cursor: 'pointer',
                                                    },
                                                },
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal for opening ticket */}
            <Modal show={isModalOpen} onHide={closeModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Open Support Ticket</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Formik
                        initialValues={{ category: '', subject: '', priority: '', message: '' }}
                        validationSchema={SupportTicketValidation}
                        onSubmit={handleSubmit}>
                        {({ isSubmitting, touched, errors }) => (
                            <Form>
                                <div className="form-group">
                                    <label>Category</label>
                                    <Field as="select" name="category" className={`form-control ${touched.category && errors.category ? 'is-invalid' : ''}`}>
                                        <option value="">Select Category</option>
                                        <option value="general support">General Support</option>
                                        <option value="account cancellation">Account Cancellation</option>
                                        <option value="billing questions">Billing Questions</option>
                                    </Field>
                                    {touched.category && errors.category && <div className="invalid-feedback">{errors.category}</div>}
                                </div>

                                <div className="form-group">
                                    <label>Subject</label>
                                    <Field type="text" name="subject" className={`form-control ${touched.subject && errors.subject ? 'is-invalid' : ''}`} />
                                    {touched.subject && errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
                                </div>

                                <div className="form-group">
                                    <label>Priority</label>
                                    <Field as="select" name="priority" className={`form-control ${touched.priority && errors.priority ? 'is-invalid' : ''}`}>
                                        <option value="">Select Priority</option>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </Field>
                                    {touched.priority && errors.priority && <div className="invalid-feedback">{errors.priority}</div>}
                                </div>

                                <div className="form-group">
                                    <label>Message</label>
                                    <Field as="textarea" name="message" className={`form-control ${touched.message && errors.message ? 'is-invalid' : ''}`} />
                                    {touched.message && errors.message && <div className="invalid-feedback">{errors.message}</div>}
                                </div>

                                <Button className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new action_btn_textView" type="submit" disabled={isSubmitting}>
                                    Open Ticket
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </Modal.Body>
            </Modal>
            <Footer />
        </React.Fragment>
    );
};

export default SupportTicketSeller;

