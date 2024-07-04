import React, { Component } from 'react'
import Header from '../../components/seller/common/Header';
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
//import addServiceSchema from './../../validation-schemas/addServiceSchema';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import arrow_back from './../../assets/icons/arrow-back.svg'
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
        };
    }

    componentDidMount() {
        this.getCategories(null);
        this.getSelectedService();
    }

    handleDescriptionChange = (description) => {
        this.setState({ description });
    };


    getCategories = () => {
        let url = '/admin/categories';
        // this.dispatch(setLoading({ loading: true }));
        axios.get(url, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            // console.log('categery:', response)
            if (response.data.status) {
                let catOptions = [];
                response.data.data.forEach(value => {
                    catOptions.push({ label: value.categoryName, value: value.id })
                });
                this.setState({ catOptions });
            } else {
                let subCatOptions = [];
                response.data.data.forEach(value => {
                    subCatOptions.push({ label: value.categoryName, value: value.id })
                });
                this.setState({ subCatOptions });
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
        // console.log("ServiceId:", this.state.serviceId);
        axios
            .get(`admin/service/items/${this.state.serviceId}`, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: `Bearer ${this.authInfo.token}`,
                },
            })
            .then((res) => {
                // console.log("Data", res.data.data);
                const serviceData = res.data.data[0];
                const defaultCatOption = { label: serviceData.category.categoryName, value: '' };
                const description = serviceData.description;
                const serviceName = serviceData.name;
                const featuredImage = serviceData.featuredImage;
                const imageId = serviceData.imageId;

                this.setState({
                    defaultCatOption: defaultCatOption,
                    description: description,
                    serviceName: serviceName,
                    featuredImage: featuredImage,
                    imageId: imageId,
                    serviceCategory: serviceData.category.id,
                });
            })
            .catch((error) => {
                console.log("Error of catch!")
            });
    };

    handleImageEdit = (e) => {
        const file = e.target.files[0];
        const fileSize = file.size;
        const maxSize = 5242880; // 5MB

        if (fileSize <= maxSize) {
            const data = new FormData();
            data.append("file", file);
            data.append("upload_preset", "pay-earth-images");
            data.append("cloud_name", this.cloudName);

            // console.log("ImageID", this.state.imageId);
            // console.log("ImageID", this.cloudName);


            //  Delete existing image if it exists
            if (this.state.imageId) {
                fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy/${this.state.imageId}`, {
                    method: "post",
                    body: {
                        "public_id": this.state.imageId,
                        "api_key": this.apiKey,
                        "api_secret": this.apiSecret,
                    }
                }).then(response => response.json())
                    .then(data => {
                        console.log("Image deleted successfully:", data);
                    }).catch(error => {
                        console.error("Error deleting image:", error);
                    });
            }
            if (this.state.imageId) {
                console.log('cloud id', this.state.imageId)
                const timestamp = Math.floor(Date.now() / 1000); // Current timestamp in seconds
                const stringToSign = `public_id=${this.state.imageId}&timestamp=${timestamp}${this.apiSecret}`;
                const signature = CryptoJS.SHA1(stringToSign).toString(CryptoJS.enc.Hex);

                const cloudinaryDeleteUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`;
                fetch(cloudinaryDeleteUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        public_id: this.state.imageId,
                        api_key: this.apiKey,
                        timestamp,
                        signature
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Image deleted successfully:", data);
                    }).catch(error => {
                        console.error("Error deleting image:", error);
                    });
            }

            // Upload new image
            fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
                method: "post",
                body: data
            }).then(response => response.json())
                .then(data => {
                    // console.log("New image uploaded:", data);
                    this.setState({
                        featuredImage: data.secure_url,
                        imageId: data.public_id
                    });
                }).catch(error => {
                    console.error("Error uploading new image:", error);
                });
        } else {
            toast.error("Image size must be less than 5 MB", { autoClose: 3000 });
        }
    };

    handleSubmit = () => {
        const formData = {
            seller_id: this.authInfo.id,
            name: this.state.serviceName,
            category: this.state.serviceCategory,
            description: this.state.description,
            featuredImage: this.state.featuredImage,
            imageId: this.state.imageId,
        }
        console.log("FormDataaaaa", formData)

        this.dispatch(setLoading({ loading: true }));
        axios.put(`admin/service/edit/${this.state.serviceId}`, formData, {
            headers: {
                'Accept': 'application/form-data',
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                toast.success(response.data.message);
                this.props.history.goBack();
            }

        }).catch(error => {
            console.log('error =>', error)
            if (error.response) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            console.log('inside the finally block')
            setTimeout(() => {
                this.dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    render() {
        const { loading } = store.getState().global;
        const {
            catOptions,
            defaultCatOption,
            serviceName,
            description,
            featuredImage,
        } = this.state;

        const styles = {
            editor: {
                // border: '1px solid gray',
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
                                            category: defaultCatOption?.value,
                                            description: '',
                                            featuredImg: ''
                                        }}
                                        onSubmit={values => this.handleSubmit(values)}
                                    // validationSchema={addServiceSchema}
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
                                                        <div className=""><span>
                                                            <Link className="btn custom_btn btn_yellow mx-auto " to="/admin/manage-services">
                                                                <img src={arrow_back} alt="linked-in" />&nbsp;
                                                                Back
                                                            </Link>
                                                        </span></div>

                                                    </div>
                                                    <div className="col-md-7">
                                                        <div className="mb-4">
                                                            <label htmlFor="name" className="form-label"> Name of Service <small className="text-danger">*</small></label>
                                                            <input type="text" className="form-control" id="name" aria-describedby="nameHelp"
                                                                name="name"
                                                                onBlur={handleBlur}
                                                                value={serviceName}
                                                                onChange={event => {
                                                                    this.setState({ serviceName: event.target.value });
                                                                }}
                                                            />
                                                            {touched.name && errors.name ? (
                                                                <small className="text-danger">{errors.name}</small>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-5">
                                                        <div className="mb-4">
                                                            <label htmlFor="category" className="form-label"> Category <small className="text-danger">*</small></label>
                                                            <Select
                                                                className="form-select category_select"
                                                                name="category"
                                                                options={catOptions}
                                                                value={defaultCatOption}
                                                                onChange={(selectedOption) => {
                                                                    // console.log("SelectedOption", selectedOption)
                                                                    // console.log("SelectedOption in state", this.state.defaultCatOption)
                                                                    this.setState({ serviceCategory: selectedOption.value, defaultCatOption: selectedOption });
                                                                    // this.getCategories(selectedOption.value);
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
                                                                    style={styles.editor} onClick={this.focusEditor}
                                                                    //style={{ height: '250px' }}
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
                                                                <div className='formImage'><img src={featuredImage} alt='...' />
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
                                                                // value={featuredImage}
                                                                onChange={(event) => {
                                                                    handleChange("featuredImg")(event);
                                                                    this.handleImageEdit(event);
                                                                }}
                                                                onBlur={handleBlur}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-2"></div>
                                                    <div className="col-md-6">

                                                    </div>
                                                    <div>
                                                    </div>
                                                    <div className="cre_ser_pay col-md-4 pt-4 pb-4">
                                                        <button type="submit" className="btn  custom_btn btn_yellow w-auto" disabled={!isValid}>Save Service</button>
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
        )
    }
}

export default connect(setLoading)(AdminEditService);