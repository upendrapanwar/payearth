import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button } from 'react-bootstrap';
import arrow_back from '../../assets/icons/arrow-back.svg'
import { Link } from 'react-router-dom';
import PageTitle from './../../components/user/common/PageTitle';

export const SupportAdminCall = () => {
    const [loading, setLoading] = useState(true);
    const [supportRequests, setSupportRequests] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);

    useEffect(() => {
        fetchSupportRequests();
    }, []);

    const fetchSupportRequests = async () => {
        try {
            const authInfo = JSON.parse(localStorage.getItem('authInfo'));

            const response = await axios.get('/admin/support-call-req', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            });

            if (response.data.status === true && response.data.data.length >= 0) {
                setSupportRequests(response.data.data);
                console.log("data res", response.data.data);
            }

        } catch (error) {
            toast.error('Error fetching support requests!');
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatus = async (id, currentStatus) => {
        // Determine the new status based on the current status
        const newStatus = currentStatus === "Resolved" ? "Pending" : "Resolved";

        try {
            const authInfo = JSON.parse(localStorage.getItem('authInfo'));

            const response = await axios.put(
                `/admin/update/support-call-status/${id}`,
                { call_status: newStatus }, // Send the toggled status
                {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': `Bearer ${authInfo.token}`
                    }
                }
            );

            if (response.data.status) {
                toast.success(`Status updated to ${newStatus}!`);
                fetchSupportRequests();
            } else {
                toast.error('Error updating status!');
            }

        } catch (error) {
            toast.error('Error updating status!');
            console.error('Error updating status:', error);
        }
    };


    const handleDetails = (row) => {
        setSelectedRequest(row);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedRequest(null);
    };

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.email,
            sortable: true,
        },
        {
            name: 'Phone',
            selector: row => row.phone,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => (
                <span className={`badge ${row.call_status === 'Resolved' ? 'bg-success' : 'bg-danger'}`}>
                    {row.call_status}
                </span>
            ),
            sortable: true,
        },
        {
            name: 'Actions',
            cell: (row) => (
                <div className="d-flex gap-2">
                    <button
                        className="check-table custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                        onClick={() => handleDetails(row)}
                    >
                        Details
                    </button>

                    <button
                        className="check-table custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                        onClick={() => handleStatus(row._id, row.call_status)}
                    >
                        {row.call_status === "Resolved" ? "Pending" : "Resolved"}
                    </button>
                </div>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const tableData = {
        columns,
        data: supportRequests,
    };


    return (
        <React.Fragment>
            <Header />

            <div className="seller_dash_wrap pb-5">
                <div className="container">
                    <PageTitle title="Support Call" />
                    <Helmet>
                        <title>{"Admin - Support Call - Pay Earth"}</title>
                    </Helmet>

                    <div className="row mt-4">
                        <div className="col-12">
                            <div className="createpost bg-white rounded-3 addPost_left_container p-3">
                                <div className="cp_top d-flex justify-content-between align-items-center">
                                    <div className="cumm_title">Request for callback-list</div>
                                    <div className="noti_wrap">
                                        <div className='d-flex justify-content-end'><span>
                                            <Link className="btn custom_btn btn_yellow mx-auto" to="/admin/manage-support">
                                                <img src={arrow_back} alt="linked-in" />&nbsp;
                                                Back
                                            </Link>
                                        </span></div>
                                    </div>
                                </div>
                                <div className="cp_body">
                                    {loading ? (
                                        <SpinnerLoader />
                                    ) : (
                                        <DataTableExtensions {...tableData}>
                                            <DataTable
                                                columns={columns}
                                                data={supportRequests}
                                                pagination
                                                highlightOnHover
                                                striped
                                                responsive
                                            />
                                        </DataTableExtensions>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>User Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedRequest && (
                        <div>
                            <p><strong>Name:</strong> {selectedRequest.name}</p>
                            <p><strong>Email:</strong> {selectedRequest.email}</p>
                            <p><strong>Phone:</strong> {selectedRequest.phone}</p>
                            <p><strong>Status:</strong> {selectedRequest.call_status}</p>
                            <p className="modal-scroll-content"><strong>Message:</strong> {selectedRequest.message}</p>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Footer />
        </React.Fragment>
    );
};
