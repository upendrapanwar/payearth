import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import Select from 'react-select';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import PageTitle from '../../components/user/common/PageTitle';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import emptyImg from '../../assets/images/user.png';
import UploadAdminProfile from './UploadAdminProfile';


const AdminMyProfile = () => {
    // Global variable
    const authInfo = JSON.parse(localStorage.getItem('authInfo'));

    // State
    const [loading, setLoading] = useState(false);
    const [adminDetails, setAdminDetails] = useState([]);
    const [profileImageUrl, setProfileImageUrl] = useState(emptyImg);
    const [modalVisible, setModalVisible] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const [originalImageModalVisible, setOriginalImageModalVisible] = useState(false);

    // Functions
    useEffect(() => {
        getAdminProfile();
    }, []);

    const getAdminProfile = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`admin/my-profile/${authInfo.id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            });

            if (response.data.status) {
                const adminInfo = response.data.data;
                console.log("adminInfo abcd", adminInfo);
                setAdminDetails(adminInfo);
                console.log("adminDetails abcd", adminDetails);
                setProfileImageUrl(adminInfo.image_url || emptyImg);
            }
        } catch (error) {
            toast.dismiss();
            if (error.response) {
                toast.error(error.response.data.message, { autoClose: 3000 });
            }
        } finally {
            setLoading(false);
        }
    };

    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };

    const toggleOriginalImageModal = () => {
        setOriginalImageModalVisible(!originalImageModalVisible);
    };

    const updateProfileImage = (newOriginalImageUrl, newOriginalImageId, newImageUrl, newImageId) => {
        console.log("newOriginalImageUrl", newOriginalImageUrl);
        console.log("newOriginalImageId", newOriginalImageId);
        console.log("newImageUrl", newImageUrl);
        console.log("newImageId", newImageId);


        setAdminDetails(prevDetails => ({
            ...prevDetails,
            original_image_url: newOriginalImageUrl,
            original_image_id: newOriginalImageId,
            image_url: newImageUrl,
            image_id: newImageId
        }));

        console.log("adminDetails", adminDetails);
        setProfileImageUrl(newImageUrl);
    };

    const handleEdit = () => {
        setEditProfile(!editProfile);
    };

    const handleSubmit = async (values) => {
        // Implement the submit logic for updating admin profile
        console.log(values);
    };

    return (
        <React.Fragment>
            {loading && <SpinnerLoader />}
            <Header />
            <PageTitle title="Admin Profile" />
            <section className="inr_wrap">
                <Helmet><title>{"Admin Profile - Pay Earth"}</title></Helmet>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="comm_profile">
                                <div className="post_by">
                                    <div className="poster_img" style={{ cursor: "pointer" }}>
                                        <img src={profileImageUrl} alt="Profile" />
                                    </div>
                                    <div className="poster_info">
                                        <div className="poster_name">{adminDetails.name}</div>
                                        <button className="btn btn-primary" onClick={toggleModal}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button className="btn btn-success" onClick={toggleOriginalImageModal}>
                                            <i className="bi bi-eye"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Admin Information and Edit */}
                    <div className="col-md-12">
                        <div className="cart">
                            <div className="cart_wrap">
                                <div className="items_incart">
                                    <span>Personal Information</span>
                                </div>
                            </div>
                            <div className="profile_edit_wrap">
                                <div className="row">
                                    <div className="col-md-6 mb-5">
                                        <Formik
                                            initialValues={{
                                                name: adminDetails.name || '',
                                                email: adminDetails.email || '',
                                                admin_type: adminDetails.admin_type || '',
                                            }}
                                            // validationSchema={AdminProfileValidation}
                                            onSubmit={(values, { setSubmitting }) => {
                                                handleSubmit(values);
                                                setSubmitting(false);
                                            }}
                                            enableReinitialize={true}
                                        >
                                            {({
                                                values,
                                                errors,
                                                touched,
                                                handleChange,
                                                handleBlur,
                                                handleSubmit,
                                                isSubmitting
                                            }) => (
                                                <form className="in_form" onSubmit={handleSubmit}>
                                                    <div className="form-group">
                                                        <label>Name <span className="text-danger">*</span></label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            name="name"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.name}
                                                            disabled={!editProfile}
                                                        />
                                                        {touched.name && errors.name && (
                                                            <small className="text-danger">{errors.name}</small>
                                                        )}
                                                    </div>
                                                    <div className="form-group">
                                                        <label>Email <span className="text-danger">*</span></label>
                                                        <input
                                                            type="email"
                                                            className="form-control"
                                                            name="email"
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.email}
                                                            disabled={!editProfile}
                                                        />
                                                        {touched.email && errors.email && (
                                                            <small className="text-danger">{errors.email}</small>
                                                        )}
                                                    </div>
                                                    <div className="form-group">
                                                        <button type="button" className="btn custom_btn btn_yellow_bordered" onClick={handleEdit}>
                                                            {editProfile ? "Cancel" : "Edit Profile"}
                                                        </button>
                                                        {editProfile && (
                                                            <button type="submit" className="btn custom_btn btn_yellow_bordered ms-2" disabled={isSubmitting}>
                                                                Save
                                                            </button>
                                                        )}
                                                    </div>
                                                </form>
                                            )}
                                        </Formik>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
            {/* Bootstrap Modal */}
            <div className={`modal fade ${modalVisible ? 'show' : ''}`} style={{ display: modalVisible ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-hidden={!modalVisible}>
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Upload Profile</h5>
                            <button type="button" className="btn-close" onClick={toggleModal} aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <UploadAdminProfile isModalOpen={modalVisible} image_id={adminDetails.image_id} original_image_id={adminDetails.original_image_id} onProfileUpdate={updateProfileImage} closeModel={toggleModal} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bootstrap Modal for Original Image */}
            <div className={`modal fade ${originalImageModalVisible ? 'show' : ''}`} style={{ display: originalImageModalVisible ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-hidden={!originalImageModalVisible}>
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Original Image</h5>
                            <button type="button" className="btn-close" onClick={toggleOriginalImageModal} aria-label="Close"></button>
                        </div>
                        <div className="modal-body text-center">
                            <img src={adminDetails.original_image_url || emptyImg} alt="Original Profile" />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default AdminMyProfile;
