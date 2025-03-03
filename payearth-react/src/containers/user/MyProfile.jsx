import React, { Component } from 'react';
import Header from '../../components/user/common/Header';
import PageTitle from '../../components/user/common/PageTitle';
import Footer from '../../components/common/Footer';
import axios from 'axios';
import { setLoading } from './../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import { Formik } from 'formik';
import Select from 'react-select';
import { toast } from 'react-toastify';
import SpinnerLoader from './../../components/common/SpinnerLoader';
import store from '../../store/index';
import userImg from '../../assets/images/user.png'
import * as Yup from 'yup';
import emptyImg from '../../assets/images/emptyimage.png'
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal } from 'react-bootstrap';
import UploadMyprofile from './UploadMyprofile';
import { Helmet } from 'react-helmet';
import arrow_back from '../../assets/icons/arrow-back.svg'

class MyProfile extends Component {
    constructor(props) {
        super(props);
        this.authInfo = JSON.parse(localStorage.getItem('authInfo'));
        this.cloudName = process.env.REACT_APP_CLOUD_NAME;
        this.apiKey = process.env.REACT_APP_CLOUD_API_KEY;
        this.apiSecret = process.env.REACT_APP_CLOUD_API_SECRET;
        this.fileInputRef = React.createRef();
        var editProfile;

        if (localStorage.getItem('editProfile') !== null) {
            if (localStorage.getItem('editProfile') === 'false') {
                editProfile = false;
            } else {
                editProfile = true;
            }
        } else {
            editProfile = true;
        }

        this.state = {
            emptyImg: emptyImg,
            userDetails: [],
            accountTypeOptions: [
                { label: 'Buyer', value: 'user' },
            ],
            purchaseTypeOptions: [
                { label: 'Retailer', value: 'retail' },
                { label: 'Wholesale', value: 'wholesale' }
            ],
            selectedAccountType: { label: 'Buyer', value: 'user' },
            selectedPurchaseType: { label: 'Retailer', value: 'retail' },
            editProfile: editProfile,
            showModal: false,
            showImageModal: false,
            imageToView: '',
        };
        this.imageRef = null;

        if (localStorage.getItem('editProfile') === null) {
            localStorage.setItem('editProfile', false);
        }
        toast.configure();
    }

    componentDidMount() {
        const { dispatch } = this.props;
        dispatch(setLoading({ loading: true }));
        axios.get('user/my-profile/' + this.authInfo.id, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                let resData = response.data.data;
                let selectedAccountType = '';
                let selectedPurchaseType = '';

                if (resData.role === 'user') {
                    selectedAccountType = { label: 'Buyer', value: 'user' };
                } else {
                    selectedAccountType = { label: 'Seller', value: 'seller' };
                }

                if (resData.purchase_type === 'retail') {
                    selectedPurchaseType = { label: 'Retailer', value: 'retail' };
                } else {
                    selectedPurchaseType = { label: 'Wholesale', value: 'wholesale' };
                }

                this.setState({
                    userDetails: resData,
                    selectedAccountType,
                    selectedPurchaseType
                });
                console.log("Response data from backend", resData)
            }
        }).catch(error => {
            console.log(error)
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    handleChangeAccount = selectedOption => this.setState({ selectedAccountType: selectedOption });
    handlePurchaseType = selectedOption => this.setState({ selectedPurchaseType: selectedOption });

    handleSubmit = (values) => {
        const { dispatch } = this.props;
        dispatch(setLoading({ loading: true }));

        axios.put(`user/edit-profile/${this.authInfo.id}`, values, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                "Authorization": `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                console.log("response", response);
                toast.success(response.data.message, { autoClose: 3000 });
                this.handleEdit();
            }
        }).catch(error => {
            toast.dismiss();
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message, { autoClose: 3000 });
                console.log("My profile error message: ", error.response)
            }
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }


    handleEdit = () => {
        this.setState({ userDetails: this.state.userDetails })
        let editProfile = localStorage.getItem('editProfile');
        if (editProfile !== null && editProfile === 'false') {
            localStorage.setItem('editProfile', true);
            this.setState({ editProfile: true });
        } else {
            localStorage.setItem('editProfile', false);
            this.setState({ editProfile: false });
        }
    }

    // Function to toggle modal visibility
    handleModalToggle = () => {
        this.setState(prevState => ({
            showModal: !prevState.showModal,
        }));
    };


    handleImageModalToggle = (original_image_url) => {
        this.setState(prevState => ({
            showImageModal: !prevState.showImageModal,
            imageToView: original_image_url || prevState.imageToView
        }));
    };


    // Method to update the user's profile image URL and image_id
    updateProfileImage = (original_image_url, original_image_id, image_url, image_id) => {
        this.setState(prevState => ({
            userDetails: {
                ...prevState.userDetails,
                original_image_url: original_image_url,
                original_image_id: original_image_id,
                image_url: image_url,
                image_id: image_id,
            }
        }));
    };


    render() {
        const { loading } = store.getState().global;
        const { editProfile, userDetails, showImageModal, imageToView } = this.state;
        const profileImageUrl = userDetails.image_url || userImg;

        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <Header />
                <PageTitle title="My Profile" />
                <section className="inr_wrap">
                    <Helmet><title>{"Profile - Pay Earth"}</title></Helmet>
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="comm_profile">
                                    <div className="post_by">
                                        <div className="poster_img" style={{ cursor: "pointer" }} onClick={() => this.handleImageModalToggle(profileImageUrl)}>
                                            <img src={profileImageUrl} alt="Profile" />
                                        </div>
                                        <input
                                            type="file"
                                            ref={this.fileInputRef}
                                            style={{ display: 'none' }}
                                            onChange={this.uploadProfileOnClodinary}
                                        />
                                        <div className="poster_info">
                                            <div className="poster_name">{this.state.userDetails.name}</div>
                                            <button className="btn btn-primary" onClick={this.handleModalToggle}>
                                                <i className="bi bi-pencil"></i>
                                            </button>
                                            <button className="btn btn-success" onClick={() => this.handleImageModalToggle(userDetails.original_image_url)}>
                                                <i className="bi bi-eye"></i>
                                            </button>
                                        </div>
                                    </div>
                                    <ul>
                                        <li>
                                            <div className="fp_fc">{this.state.userDetails?.community?.followerData.length || 0}</div>
                                            <small>Followers</small>
                                        </li>
                                        <li>
                                            <div className="fp_fc">{this.state.userDetails?.community?.followingData.length || 0}</div>
                                            <small>Following</small>
                                        </li>
                                        <li>
                                            <div className="fp_fc">{this.state.userDetails?.community?.blockedUsers.length || 0}</div>
                                            <small>Blocked</small>
                                        </li>
                                    </ul>
                                    <div className=''>
                                        <button
                                            type="button"
                                            className="btn custum_back_btn btn_yellow mx-auto"
                                            onClick={() => window.history.back()}
                                        >
                                            <img src={arrow_back} alt="back" />&nbsp;
                                            Back
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <div className="cart">
                                    <div className="cart_wrap">
                                        <div className="items_incart d-flex justify-content-between align-items-center">
                                            <span className="text-uppercase">
                                                Personal Information
                                            </span>
                                            {/* <button
                                                type="button"
                                                className="btn custom_btn btn_yellow"
                                                onClick={() => window.history.back()}
                                            >
                                                Back
                                            </button> */}
                                        </div>
                                    </div>
                                    <div className="profile_edit_wrap">
                                        <div className="row">
                                            <div className="col-md-12 mb-5">
                                                <Formik
                                                    initialValues={{
                                                        name: this.state.userDetails.name,
                                                        email: this.state.userDetails.email,
                                                        role: this.state.selectedAccountType.value,
                                                        purchase_type: this.state.selectedPurchaseType.value,
                                                        phone: this.state.userDetails.phone || '',
                                                        address: {
                                                            street: this.state.userDetails?.address?.street || '',
                                                            city: this.state.userDetails?.address?.city || '',
                                                            state: this.state.userDetails?.address?.state || '',
                                                            country: this.state.userDetails?.address?.country || '',
                                                            zip: this.state.userDetails?.address?.zip || '',
                                                        }
                                                    }}
                                                    validationSchema={Yup.object().shape({
                                                        name: Yup.string().required("Name is required.").min(3, 'Name is too short - should be 3 chars minimum.').max(50, 'Name is too long - should be 50 chars maximum.'),
                                                        email: Yup.string().email().required("Email is required."),
                                                        phone: Yup.string().matches(/^[0-9]+$/, "Phone number is not valid").min(10, 'Phone number is too short').max(15, 'Phone number is too long').required("Phone is required."),
                                                        address: Yup.object().shape({
                                                            street: Yup.string().required("Street is required."),
                                                            city: Yup.string().required("City is required."),
                                                            state: Yup.string().required("State is required."),
                                                            country: Yup.string().required("Country is required."),
                                                            zip: Yup.number().required("Zip code is required.").positive().integer(),
                                                        })
                                                    })}
                                                    onSubmit={(values, { setSubmitting }) => {
                                                        this.handleSubmit(values);
                                                        setTimeout(() => {
                                                            setSubmitting(false);
                                                        }, 400);
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
                                                                    <label htmlFor="">Name <span className="text-danger">*</span></label>
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
                                                                    <label htmlFor="">Email <span className="text-danger">*</span></label>
                                                                    <input
                                                                        type="email"
                                                                        className="form-control"
                                                                        name="email"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.email}
                                                                        disabled={!editProfile}
                                                                        maxLength="50"
                                                                    />
                                                                    {touched.email && errors.email && (
                                                                        <small className="text-danger">{errors.email}</small>
                                                                    )}
                                                                </div>
                                                            </div>


                                                            <div className="form-row row">
                                                                <div className="form-group col-md-6">
                                                                    <label htmlFor="phone">Phone <span className="text-danger">*</span></label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="phone"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.phone}
                                                                        disabled={!editProfile}
                                                                    />
                                                                    {touched.phone && errors.phone && (
                                                                        <small className="text-danger">{errors.phone}</small>
                                                                    )}
                                                                </div>


                                                                <div className="form-group col-md-6">
                                                                    <label htmlFor="country">Country <span className="text-danger">*</span></label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="address.country"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.address.country}
                                                                        disabled={!editProfile}
                                                                    />
                                                                    {touched.address?.country && errors.address?.country && (
                                                                        <small className="text-danger">{errors.address.country}</small>
                                                                    )}
                                                                </div>
                                                            </div>


                                                            <div className="form-row row">
                                                                <div className="form-group col-md-6">
                                                                    <label htmlFor="city">City <span className="text-danger">*</span></label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="address.city"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.address.city}
                                                                        disabled={!editProfile}
                                                                    />
                                                                    {touched.address?.city && errors.address?.city && (
                                                                        <small className="text-danger">{errors.address.city}</small>
                                                                    )}
                                                                </div>
                                                                <div className="form-group col-md-6">
                                                                    <label htmlFor="state">State <span className="text-danger">*</span></label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="address.state"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.address.state}
                                                                        disabled={!editProfile}
                                                                    />
                                                                    {touched.address?.state && errors.address?.state && (
                                                                        <small className="text-danger">{errors.address.state}</small>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="form-row row">

                                                                <div className="form-group col-md-6">
                                                                    <label htmlFor="street">Street <span className="text-danger">*</span></label>
                                                                    <input
                                                                        type="text"
                                                                        className="form-control"
                                                                        name="address.street"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.address.street}
                                                                        disabled={!editProfile}
                                                                    />
                                                                    {touched.address?.street && errors.address?.street && (
                                                                        <small className="text-danger">{errors.address.street}</small>
                                                                    )}
                                                                </div>

                                                                <div className="form-group col-md-6">
                                                                    <label htmlFor="zip">Zip Code <span className="text-danger">*</span></label>
                                                                    <input
                                                                        type="number"
                                                                        className="form-control"
                                                                        name="address.zip"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.address.zip}
                                                                        disabled={!editProfile}
                                                                    />
                                                                    {touched.address?.zip && errors.address?.zip && (
                                                                        <small className="text-danger">{errors.address.zip}</small>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            <div className="form-row row">
                                                                <div className="form-group">
                                                                    <label htmlFor="">Account Type <span className="text-danger">*</span></label>
                                                                    <Select
                                                                        className="form-control p-0 h-100 border-0"
                                                                        options={this.state.accountTypeOptions}
                                                                        value={this.state.selectedAccountType}
                                                                        onChange={this.handleChangeAccount}
                                                                        isDisabled={editProfile === true ? false : true}
                                                                    />
                                                                </div>
                                                            </div>



                                                            <div className="form-group">
                                                                <label htmlFor="" className="invisible">btn</label>
                                                                {editProfile ? (
                                                                    <div>
                                                                        <button type="submit" className="btn custom_btn btn_yellow_bordered">Save</button>
                                                                        <button type="button" className="btn custom_btn btn_yellow_bordered ms-2" onClick={this.handleEdit}>Cancel</button>
                                                                    </div>
                                                                ) : (
                                                                    <button type="button" className="btn custom_btn btn_yellow_bordered" onClick={this.handleEdit}>Edit Profile</button>
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
                    </div>
                </section>
                <Footer />

                <Modal show={this.state.showModal} onHide={this.handleModalToggle} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Upload Profile</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <UploadMyprofile image_id={this.state.userDetails.image_id} original_image_id={this.state.userDetails.original_image_id} onProfileUpdate={this.updateProfileImage} onSaveComplete={this.handleModalToggle} />
                    </Modal.Body>
                </Modal>

                {/* Modal for viewing profile image */}
                <Modal show={showImageModal} onHide={() => this.handleImageModalToggle('')} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Profile Image</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='text-center'>
                            <img src={imageToView} alt="Profile" className="img-fluid" />
                        </div>

                    </Modal.Body>
                </Modal>

            </React.Fragment >
        );
    }
}

export default connect(setLoading)(MyProfile);
