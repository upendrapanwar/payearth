import React, { useState, useEffect } from 'react';
import { Formik } from 'formik';
import Select from 'react-select';
import Header from '../../components/seller/common/Header';
import Footer from '../../components/common/Footer';
import PageTitle from '../../components/user/common/PageTitle';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import axios from 'axios';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import emptyImg from '../../assets/images/user.png';
import UploadSellerProfile from './UploadSellerProfile';
import MyProfileValidation from '../../validation-schemas/sellerMyProfileSchema'

export const SellerMyProfile = () => {
    // Global variable
    const authInfo = JSON.parse(localStorage.getItem('authInfo'));

    // State
    const [loading, setLoading] = useState(false);
    const [sellerDetails, setSellerDetails] = useState([]);
    const [profileImageUrl, setProfileImageUrl] = useState(emptyImg);
    const [modalVisible, setModalVisible] = useState(false);
    const [editProfile, setEditProfile] = useState(false);
    const sellerTypeOptions = [{ value: 'retailer', label: 'Retailer' }, { value: 'wholesaler', label: 'Wholesaler' }];
    const wantToSellOptions = [{ value: 'retail', label: 'Retail' }, { value: 'wholesale', label: 'Wholesale' }];
    const [originalImageModalVisible, setOriginalImageModalVisible] = useState(false);


    // Functions
    useEffect(() => {
        getSellerProfile();
    }, []);

    const getSellerProfile = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`seller/my-profile/${authInfo.id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            });

            if (response.data.status) {
                const sellerinfo = response.data.data;
                setSellerDetails(sellerinfo);
                setProfileImageUrl(sellerinfo.image_url || emptyImg);
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
        setOriginalImageModalVisible(!originalImageModalVisible); // Toggle original image modal visibility
    };


    const updateProfileImage = (newOriginalImageUrl, newOriginalImageId, newImageUrl, newImageId) => {
        setSellerDetails(prevDetails => ({
            ...prevDetails,
            original_image_url: newOriginalImageUrl,
            original_image_id: newOriginalImageId,
            image_url: newImageUrl,
            image_id: newImageId
        }));

        setProfileImageUrl(newImageUrl);
    }


    const handleEdit = () => {
        setEditProfile(!editProfile);
    };

    const handleSubmit = async (values) => {
        // Implement the submit logic for updating user profile
        console.log(values);
    };

    return (
        <React.Fragment>
            {loading && <SpinnerLoader />}
            <Header />
            <PageTitle title="My Profile" />
            <section className="inr_wrap">
                <Helmet><title>{"My Profile - Pay Earth"}</title></Helmet>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="comm_profile">
                                <div className="post_by">
                                    <div className="poster_img" style={{ cursor: "pointer" }}>
                                        <img src={profileImageUrl} alt="Profile" />
                                    </div>
                                    <div className="poster_info">
                                        <div className="poster_name">{sellerDetails.name}</div>
                                        <button className="btn btn-primary" onClick={toggleModal}>
                                            <i className="bi bi-pencil"></i>
                                        </button>
                                        <button className="btn btn-success" onClick={toggleOriginalImageModal}>
                                            <i className="bi bi-eye"></i>
                                        </button>
                                    </div>
                                </div>
                                <ul>
                                    <li>
                                        <div className="fp_fc">{sellerDetails?.community?.followers || 0}</div>
                                        <small>Followers</small>
                                    </li>
                                    <li>
                                        <div className="fp_fc">{sellerDetails?.community?.following || 0}</div>
                                        <small>Following</small>
                                    </li>
                                    <li>
                                        <div className="fp_fc">{sellerDetails?.community?.blockedUsers.length || 0}</div>
                                        <small>Blocked</small>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Seller Information and Edit */}
                    <div className="col-md-12">
                        <div className="cart">
                            <div className="cart_wrap">
                                <div className="items_incart">
                                    <span>Personal Information</span>
                                </div>
                            </div>
                            <div className="profile_edit_wrap">
                                <div className="row">
                                    <div className="col-md-12 mb-5">
                                        <Formik
                                            initialValues={{
                                                name: sellerDetails.name || '',
                                                email: sellerDetails.email || '',
                                                seller_type: sellerDetails.seller_type || '',
                                                want_to_sell: sellerDetails.want_to_sell || '',
                                            }}
                                            validationSchema={MyProfileValidation}
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
                                                    <div className="form-row row">
                                                        <div className="form-group col-md-6">
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
                                                        <div className="form-group col-md-6">
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
                                                    </div>

                                                    <div className="form-row row">
                                                        <div className="form-group col-md-6">
                                                            <label>Seller Type <span className="text-danger">*</span></label>
                                                            <Select className="form-control p-0 h-100 border-0"
                                                                options={sellerTypeOptions}
                                                                name="seller_type"
                                                                onChange={(selected) => handleChange({ target: { name: 'seller_type', value: selected.value } })}
                                                                onBlur={handleBlur}
                                                                isDisabled={!editProfile}
                                                            />
                                                            {touched.seller_type && errors.seller_type && (
                                                                <small className="text-danger">{errors.seller_type}</small>
                                                            )}
                                                        </div>
                                                        <div className="form-group col-md-6">
                                                            <label>want to sell? <span className="text-danger">*</span></label>
                                                            <Select className="form-control p-0 h-100 border-0"
                                                                options={wantToSellOptions}
                                                                name="want_to_sell"
                                                                onChange={(selected) => handleChange({ target: { name: 'want_to_sell', value: selected.value } })}
                                                                onBlur={handleBlur}
                                                                isDisabled={!editProfile}
                                                            />
                                                            {touched.want_to_sell && errors.want_to_sell && (
                                                                <small className="text-danger">{errors.want_to_sell}</small>
                                                            )}
                                                        </div>
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
                            <UploadSellerProfile isModalOpen={modalVisible} image_id={sellerDetails.image_id} original_image_id={sellerDetails.original_image_id} onProfileUpdate={updateProfileImage} closeModel={toggleModal} />
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
                        <div className="modal-body">
                            <img src={sellerDetails.original_image_url} alt="Original" className="img-fluid" />
                        </div>
                    </div>
                </div>
            </div>

        </React.Fragment>
    );
};
