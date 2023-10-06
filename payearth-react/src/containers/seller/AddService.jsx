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
import addServiceSchema from './../../validation-schemas/addServiceSchema';
import { Link } from 'react-router-dom';

class AddService extends Component {
    constructor(props) {
        super(props);
        const {dispatch} = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;
        this.state = {
            catOptions: [],
            defaultCatOption: {label: 'Choose Category', value: ''},
            subCatOptions: [],
            defaultSubCatOption: {label: 'Choose Sub Category', value: ''},
            files: {
                videos: [],
                previews: []
            },
            featuredImg: {image: '', preview: ''}
        };
        toast.configure();
    }

    componentDidMount() {
        this.getCategories(null);
    }

    getCategories = param => {
        let reqBody = {
            is_service: true,
            parent: param
        };

        axios.post('seller/categories/', reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                if (param === null) {
                    let catOptions = [];
                    response.data.data.forEach(value => {
                        catOptions.push({label: value.categoryName, value: value.id})
                    });
                    this.setState({catOptions});
                } else {
                    let subCatOptions = [];
                    response.data.data.forEach(value => {
                        subCatOptions.push({label: value.categoryName, value: value.id})
                    });
                    this.setState({subCatOptions});
                }
            }
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    handleImages = event => {
        let files = {...this.state.files};
        for (let i = 0; i < event.target.files.length; i++) {
            files.videos.push(event.target.files[i]);
            files.previews.push(URL.createObjectURL(event.target.files[i]));
        }
        this.setState({files});
    }

    removeImg = index => {
        let files = {...this.state.files};
        files.videos.splice(index, 1);
        files.previews.splice(index, 1);
        this.setState({files: {previews: [], videos: []}});
        setTimeout(() => {
            this.setState({files});
        }, 10);
    }

    handleFeaturedImg = event => {
        if (event.target.files.length > 0) {
            let featuredImg = {
                image: event.target.files[0],
                preview: URL.createObjectURL(event.target.files[0])
            };
            this.setState({featuredImg});
        } else {
            let featuredImg = {
                image: '',
                preview: ''
            };
            this.setState({featuredImg});
        }
    }

    saveFeaturedImg = (productId, successMsg) => {
        let formData = new FormData();
        formData.append('id', productId);
        formData.append('file', this.state.featuredImg.image);

        axios.post('seller/products/featured-image', formData, {
            headers: {
                'Accept': 'application/form-data',
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            if(response.data.status) {
                toast.dismiss();
                toast.success(successMsg, {autoClose: 3000});
                this.dispatch(setLoading({loading: true}));
                this.props.history.push('/seller/service-stock-management');
            }
        }).catch(error => {
            if(error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    handleSubmit = values => {
        let formData = new FormData();
        formData.append('seller_id', this.authInfo.id);
        formData.append('name', values.name);
        formData.append('category', values.category);
        formData.append('sub_category', values.subCategory);
        formData.append('description', values.description);
        formData.append('price', values.price);
        formData.append('validity', values.validity);

        // Bind images with color
        this.state.files.videos.forEach(value => {
            formData.append('videos', value);
        });

        this.dispatch(setLoading({loading: true}));
        axios.post('seller/services', formData, {
            headers: {
                'Accept': 'application/form-data',
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                this.saveFeaturedImg(response.data.data.id, response.data.message);
            }
        }).catch(error => {
            if (error.response) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({loading: false}));
            }, 300);
        });
    }

    render() {
        const {loading} = store.getState().global;
        const {
            catOptions,
            defaultCatOption,
            subCatOptions,
            defaultSubCatOption,
            files,
            featuredImg
        } = this.state;

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
                                            category: defaultCatOption.value,
                                            subCategory: defaultSubCatOption.value,
                                            description: '',
                                            price: '',
                                            validity: '',
                                            files: '',
                                            featuredImg: ''
                                        }}
                                        onSubmit={values => this.handleSubmit(values)}
                                        validationSchema={addServiceSchema}
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
                                                    <div className="col-md-12 pt-4 pb-4">
                                                        <div className="dash_title">Add Service</div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="mb-4">
                                                            <label htmlFor="name" className="form-label"> Name of Services <small className="text-danger">*</small></label>
                                                            <input type="text" className="form-control" id="name" aria-describedby="nameHelp"
                                                                name="name"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.name}
                                                            />
                                                            {touched.name && errors.name ? (
                                                                <small className="text-danger">{errors.name}</small>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="mb-4">
                                                            <label htmlFor="name" className="form-label"> Category <small className="text-danger">*</small></label>
                                                            <Select
                                                                className="form-select category_select"
                                                                name="category"
                                                                options={catOptions}
                                                                value={defaultCatOption}
                                                                onChange={selectedOption => {
                                                                    values.category = selectedOption.value;
                                                                    this.setState({ defaultCatOption: selectedOption });
                                                                    this.getCategories(selectedOption.value);
                                                                }}
                                                                onBlur={handleBlur}
                                                            />
                                                            {touched.category && errors.category ? (
                                                                <small className="text-danger">{errors.category}</small>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="mb-4">
                                                            <label className="form-label">Subcategory</label>
                                                            <Select
                                                                name=" subCategory"
                                                                className="form-select category_select"
                                                                options={subCatOptions}
                                                                value={values.subCategory}
                                                                onChange={selectedOption => {
                                                                    values.subCategory = selectedOption.value;
                                                                    this.setState({ defaultSubCatOption: selectedOption });
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-8">
                                                        <div className="mb-4">
                                                            <label className="form-label">Description <small className="text-danger">*</small></label>
                                                            <textarea className="form-control h-100" rows="5"
                                                                name="description"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.description}
                                                            ></textarea>
                                                            {touched.description && errors.description ? (
                                                                <small className="text-danger">{errors.description}</small>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="mb-4">
                                                            <label className="form-label">Price <small className="text-danger">*</small></label>
                                                            <input type="text" className="form-control" id="" aria-describedby="nameHelp"
                                                                name="price"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.price}
                                                            />
                                                            {touched.price && errors.price ? (
                                                                <small className="text-danger">{errors.price}</small>
                                                            ) : null}
                                                        </div>
                                                        <div className="mb-4">
                                                            <label className="form-label"> Validity <small className="text-danger">*</small></label>
                                                            <input type="text" className="form-control" aria-describedby="nameHelp"
                                                                name="validity"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.validity}
                                                            />
                                                            {touched.validity && errors.validity ? (
                                                                <small className="text-danger">{errors.validity}</small>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label">Upload videos</label>
                                                        <ul className="load_services service">
                                                            <li>
                                                                <input type="file" className="form-control"  id="files"
                                                                    name="files"
                                                                    onChange={event => {
                                                                        handleChange("files")(event);
                                                                        this.handleImages(event);
                                                                    }}
                                                                    multiple={true}
                                                                    onBlur={handleBlur}
                                                                    // value={values.files}
                                                                />
                                                            </li>
                                                        </ul>
                                                        {files.previews.length > 0 &&
                                                            <ul className="load_imgs">
                                                                {files.previews.map((url, index) => {
                                                                    return  <li key={index}>
                                                                                <Link to="#" className="delete_icon_btn" onClick={() => this.removeImg(index)}><i className="fa fa-trash"></i></Link>
                                                                                <video width="400" controls>
                                                                                    <source src={url} />
                                                                                </video>
                                                                            </li>
                                                                })}
                                                            </ul>
                                                        }

                                                        {touched.files && errors.files ? (
                                                            <small className="text-danger">{errors.files}</small>
                                                        ) : null}
                                                    </div>
                                                    <div className="col-md-4">
                                                            <label className="form-label">Featured Image</label>
                                                            <input
                                                                className="form-control mb-2"
                                                                type="file"
                                                                name="featuredImg"
                                                                accept="image/*"
                                                                value={values.featuredImg}
                                                                onChange={(event) => {
                                                                    handleChange("featuredImg")(event);
                                                                    this.handleFeaturedImg(event);
                                                                }}
                                                                onBlur={handleBlur}
                                                            />
                                                            {touched.featuredImg && errors.featuredImg ? (
                                                                <small className="text-danger">{errors.featuredImg}</small>
                                                            ) : null}
                                                            {featuredImg.preview !== '' &&
                                                                <div>
                                                                    <img src={featuredImg.preview} alt="..." style={{maxWidth: '100%', maxHeight: '300px'}} />
                                                                </div>
                                                            }
                                                        </div>
                                                    <div className="col-md-12 pt-4 pb-4">
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

export default connect(setLoading)(AddService);