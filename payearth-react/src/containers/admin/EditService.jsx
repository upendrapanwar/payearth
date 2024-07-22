import React, { Component } from 'react';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import { Formik } from 'formik';
import Select from 'react-select';
import store from '../../store';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { setLoading } from '../../store/reducers/global-reducer';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import axios from 'axios';
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import arrow_back from './../../assets/icons/arrow-back.svg';
import CryptoJS from 'crypto-js';

class AdminEditService extends Component {
    constructor(props) {
        super(props);
        const { dispatch } = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;
        const { id } = this.props.match.params;
        this.cloudName = process.env.REACT_APP_CLOUD_NAME;
        this.apiKey = process.env.REACT_APP_CLOUD_API_KEY;
        this.apiSecret = process.env.REACT_APP_CLOUD_API_SECRET;
        this.state = {
            catOptions: [],
            defaultCatOption: { label: 'Choose Category', value: '' },
            serviceId: id,
            serviceName: "",
            serviceCategory: "",
            description: "",
            featuredImage: '',
            imageId: '',
            charges:'',
            newImageUploaded: false, // Flag to indicate a new image has been uploaded
            previousImageId: '', // Store the previous image ID
            selectedFile: null, // To store the selected file
            selectedImageUrl: '', // To display the selected image immediately
        };
    }

    componentDidMount() {
        this.getCategories();
        this.getSelectedService();
    }

    handleDescriptionChange = (description) => {
        this.setState({ description });
    };

    getCategories = () => {
        let url = '/admin/getcategories';
        axios.get(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                let catOptions = [];
                response.data.data.forEach(value => {
                    catOptions.push({ label: value.categoryName, value: value.id })
                });
                this.setState({ catOptions });
            }
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    getSelectedService = () => {
        axios
            .get(`admin/service/items/${this.state.serviceId}`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: `Bearer ${this.authInfo.token}`,
                },
            })
            .then((res) => {
                const serviceData = res.data.data[0];
                const defaultCatOption = { label: serviceData.category.categoryName, value: '' };
                const description = serviceData.description;
                const serviceName = serviceData.name;
                const featuredImage = serviceData.featuredImage;
                const imageId = serviceData.imageId;
                const charges = serviceData.charges;

                this.setState({
                    defaultCatOption: defaultCatOption,
                    description: description,
                    serviceName: serviceName,
                    featuredImage: featuredImage,
                    imageId: imageId,
                    charges: charges,
                    previousImageId: imageId, // Set the previous image ID
                    serviceCategory: serviceData.category.id,
                });
            })
            .catch((error) => {
                console.log("Error of catch!")
            });
    };

    handleImageChange = (event) => {
        const file = event.target.files[0];
        this.setState({
            selectedFile: file,
            selectedImageUrl: URL.createObjectURL(file) // Set the URL for previewing the selected image
        });
    };

    handleSubmit = () => {
        const { selectedFile, newImageUploaded, previousImageId } = this.state;

        // Only attempt to upload if a file is selected
        if (selectedFile) {
            const fileSize = selectedFile.size;
            const maxSize = 5242880; // 5MB

            if (fileSize <= maxSize) {
                const data = new FormData();
                data.append("file", selectedFile);
                data.append("upload_preset", "pay-earth-images");
                data.append("cloud_name", this.cloudName);

                // Upload new image
                fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
                    method: "post",
                    body: data
                }).then(response => response.json())
                    .then(data => {
                        this.setState({
                            featuredImage: data.secure_url,
                            imageId: data.public_id,
                            newImageUploaded: true, // Flag to indicate a new image has been uploaded
                            selectedImageUrl: '', // Clear the selected image URL after upload
                        });
                        toast.success("New image uploaded successfully");
                        this.saveService(); // Call save service after image upload
                    }).catch(error => {
                        console.error("Error uploading new image:", error);
                        toast.error("Error uploading new image");
                    });
            } else {
                toast.error("Image size must be less than 5 MB", { autoClose: 3000 });
            }
        } else {
            this.saveService(); // Call save service without uploading a new image
        }
    };

    saveService = () => {
        const { newImageUploaded, previousImageId } = this.state;

        const formData = {
            seller_id: this.authInfo.id,
            name: this.state.serviceName,
            charges: this.state.charges,
            category: this.state.serviceCategory,
            description: this.state.description,
            featuredImage: this.state.featuredImage,
            imageId: this.state.imageId,
        };
        console.log("FormData", formData);

        this.dispatch(setLoading({ loading: true }));

        const deleteImagePromise = newImageUploaded && previousImageId
            ? (() => {
                const timestamp = Math.floor(Date.now() / 1000);
                const stringToSign = `public_id=${previousImageId}&timestamp=${timestamp}${this.apiSecret}`;
                const signature = CryptoJS.SHA1(stringToSign).toString(CryptoJS.enc.Hex);

                const cloudinaryDeleteUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`;
                return fetch(cloudinaryDeleteUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        public_id: previousImageId,
                        api_key: this.apiKey,
                        timestamp,
                        signature
                    })
                }).then(response => response.json())
                    .then(data => {
                        console.log("Image deleted successfully:", data);
                        toast.success("Existing image deleted successfully");
                    }).catch(error => {
                        console.error("Error deleting image:", error);
                        toast.error("Error deleting existing image");
                    });
            })()
            : Promise.resolve();

        deleteImagePromise
            .then(() => {
                // Save the service
                return axios.put(`admin/service/edit/${this.state.serviceId}`, formData, {
                    headers: {
                        'Accept': 'application/form-data',
                        'Content-Type': 'application/json; charset=UTF-8',
                        'Authorization': `Bearer ${this.authInfo.token}`
                    }
                });
            })
            .then((response) => {
                if (response.data.status) {
                    toast.success(response.data.message);
                    this.props.history.goBack();
                }
            })
            .catch(error => {
                console.log('error =>', error);
                if (error.response) {
                    toast.error(error.response.data.message);
                }
            })
            .finally(() => {
                console.log('inside the finally block');
                setTimeout(() => {
                    this.dispatch(setLoading({ loading: false }));
                }, 300);
            });
    };

    render() {
        const { loading } = store.getState().global;
        const {
            catOptions,
            defaultCatOption,
            serviceName,
            charges,
            description,
            selectedImageUrl, // Use selectedImageUrl to display the selected image
        } = this.state;

        const styles = {
            editor: {
                height: '18em'
            }
        };

        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <div className="seller_body">
                    <Header />
                    <div className="seller_dash_wrap pt-5 pb-5">
                        <div className="container ">
                            <div className="bg-white rounded-3 pt-3 pb-5">
                                <div className="dash_inner_wrap">
                                    <Formik
                                        initialValues={{
                                            name: '',
                                            charges:'',
                                            category: defaultCatOption?.value,
                                            description: '',
                                            featuredImg: ''
                                        }}
                                        onSubmit={values => this.handleSubmit(values)}
                                    >
                                        {({ values,
                                            errors,
                                            touched,
                                            handleChange,
                                            handleBlur,
                                            handleSubmit,
                                            isValid,
                                        }) => (
                                            <form onSubmit={handleSubmit} encType="multipart/form-data" >
                                                <div className="row">
                                                    <div className="col-md-12 pt-4 pb-4 d-flex justify-content-between align-items-center">
                                                        <div className="dash_title">Edit Service</div>
                                                        <div className="">
                                                            <Link className="btn custom_btn btn_yellow mx-auto " to="/admin/manage-services">
                                                                <img src={arrow_back} alt="linked-in" />&nbsp;
                                                                Go back</Link>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-7">
                                                        <div className="mb-4">
                                                            <label htmlFor="name" className="form-label">Service Name <small className="text-danger">*</small></label>
                                                            <input
                                                                type="text"
                                                                name="name"
                                                                id="name"
                                                                className="form-control"
                                                                placeholder="Service name"
                                                                value={serviceName}
                                                                // onChange={handleChange}
                                                                onChange={event => {
                                                                    this.setState({ serviceName: event.target.value });
                                                                }}
                                                                onBlur={handleBlur}
                                                            />
                                                            {touched.name && errors.name ? (
                                                                <small className="text-danger">{errors.name}</small>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2">
                                                        <div className="mb-4">
                                                            <label htmlFor="charges" className="form-label"> Charges <small className="text-danger">*</small></label>
                                                            <input type="text" className="form-control" id="charges" aria-describedby="chargesHelp"
                                                                name="charges"
                                                                onBlur={handleBlur}
                                                                value={charges}
                                                                onChange={event => {
                                                                    this.setState({ charges: event.target.value });
                                                                }}
                                                            />
                                                            {touched.charges && errors.charges ? (
                                                                <small className="text-danger">{errors.charges}</small>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-3">
                                                        <div className="mb-4">
                                                            <label htmlFor="category" className="form-label"> Category <small className="text-danger">*</small></label>
                                                            <Select
                                                                className="form-select category_select"
                                                                name="category"
                                                                options={catOptions}
                                                                value={defaultCatOption}
                                                                onChange={(selectedOption) => {
                                                                    this.setState({ serviceCategory: selectedOption.value, defaultCatOption: selectedOption });
                                                                }}
                                                                onBlur={handleBlur}
                                                            />
                                                            {touched.category && errors.category ? (
                                                                <small className="text-danger">{errors.category}</small>
                                                            ) : null}
                                                        </div>
                                                    </div>

                                                    <div className="col-md-7">
                                                        <div className="mb-4">
                                                            <label className="form-label">Description <small className="text-danger">*</small></label>
                                                            <div>
                                                                <ReactQuill
                                                                    className='discr_reactquill'
                                                                    style={styles.editor}
                                                                    type="text"
                                                                    name="description"
                                                                    value={description}
                                                                    onChange={this.handleDescriptionChange}
                                                                    modules={{
                                                                        toolbar: [
                                                                            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                                            ['bold', 'italic', 'underline'],
                                                                            ['link', 'image'],
                                                                            ['clean']
                                                                        ]
                                                                    }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <div className='formImage-wrapper'>
                                                            <label className="form-label">Featured Image</label>
                                                            <div className='text-center formImage-pannel'>
                                                                <div className='formImage'><img src={selectedImageUrl || this.state.featuredImage} alt='...' />
                                                                    <p className='text-danger'> Size must be less than 5 MB</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='formImageInput'>
                                                            <input
                                                                className="form-control mb-2"
                                                                style={{ height: "60px" }}
                                                                type="file"
                                                                name="featuredImg"
                                                                accept="image/*"
                                                                onChange={(event) => {
                                                                    handleChange("featuredImg")(event);
                                                                    this.handleImageChange(event);
                                                                }}
                                                                onBlur={handleBlur}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="cre_ser_pay col-md-4 pt-4 pb-4">
                                                        <button type="submit" className="btn custom_btn btn_yellow w-auto" disabled={!isValid}>Save Service</button>
                                                    </div>
                                                </div>
                                            </form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </React.Fragment>
        );
    }
}

export default connect(setLoading)(AdminEditService);
