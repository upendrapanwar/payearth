import React, { Component } from 'react'
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
import addServiceSchema from './../../validation-schemas/addServiceSchema';
import ReactQuill from 'react-quill';
import { Link } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
// import { Editor } from 'react-draft-wysiwyg';
// import { EditorState, convertToRaw  } from 'draft-js';
import emptyImg from './../../assets/images/emptyimage.png'
import arrow_back from './../../assets/icons/arrow-back.svg'
import { bottom } from '@popperjs/core';
import { Helmet } from 'react-helmet';

class adminAddService extends Component {
    constructor(props) {
        super(props);
        const { dispatch } = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;
        this.cloudName = process.env.REACT_APP_CLOUD_NAME;
        this.apiKey = process.env.REACT_APP_CLOUD_API_KEY;
        this.apiSecret = process.env.REACT_APP_CLOUD_API_SECRET;
        this.state = {
            catOptions: [],
            defaultCatOption: { label: 'Choose Category', value: '' },
            featuredImg: '',
            imageId: '',
            description: '',
            // editorState: EditorState.createEmpty(),
            serviceName: "",
            serviceCategory: "",
            image: "",
            imagePreview: null,
            emptyImg: emptyImg,
        };
    }

    generateUniqueSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    componentDidMount() {
        this.getCategories(null);
        // this.focusEditor();
    }

    handleDescriptionChange = (description) => {
        this.setState({ description });
    };

    getCategories = () => {
        let url = '/admin/getcategories';
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


    //Cloudinary code for upload image
    handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file.size <= 5242880) {
            this.setState({ imageFile: file });
            const reader = new FileReader();
            reader.onloadend = () => {
                this.setState({ imagePreview: reader.result });
            };
            reader.readAsDataURL(file);
        } else {
            this.setState({ imageFile: null, image: emptyImg });
            toast.error("Image size must be less than 5 MB", { autoClose: 3000 });
        }
    };

    handleSubmit = async (values) => {
        this.dispatch(setLoading({ loading: true }));

        // const checkServiceExists = async (name) => {
        //     try {
        //         const response = await axios.get('admin/services', {
        //             headers: {
        //                 'Authorization': `Bearer ${this.authInfo.token}`
        //             }
        //         });
        //         console.log('sercice exist response',response);
        //         const exists=response.data.data.name==name;
        //       //  return response.data.exists;
        //       console.log('exist',exists)
        //       return exists;
        //     } catch (error) {
        //         console.error("Error checking service name:", error);
        //         return false;
        //     }
        // };

        const uploadImage = () => {
            return new Promise((resolve, reject) => {
                const data = new FormData();
                data.append("file", this.state.imageFile);
                data.append("upload_preset", "pay-earth-images");
                data.append("cloud_name", this.cloudName);

                fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
                    method: "post",
                    body: data
                })
                    .then((res) => res.json())
                    .then((data) => resolve(data))
                    .catch((err) => reject(err));
            });
        };

        try {
            // const serviceExists = await checkServiceExists(values.name);
            // if (serviceExists) {
            //     toast.error("A service with this name already exists. Please choose a different name.", { autoClose: 3000 });
            //     this.dispatch(setLoading({ loading: false }));
            //     return;
            // }

            let imageData;
            if (this.state.imageFile) {
                imageData = await uploadImage();
            } else {
                imageData = { secure_url: emptyImg, public_id: '' };
            }
            // const imageData = await uploadImage();
            const slug = this.generateUniqueSlug(values.name);

            const formData = {
                admin_id: this.authInfo.id,
                name: values.name,
                charges: values.charges,
                category: values.category,
                description: this.state.description,
                image: imageData.secure_url,
                imageId: imageData.public_id,
                slug: slug,
            };

            this.setState({ serviceName: values.name, serviceCategory: values.category });

            axios.post('admin/services', formData, {
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
                if (error.response) {
                    toast.error(error.response.data.message);
                }
            }).finally(() => {
                setTimeout(() => {
                    this.dispatch(setLoading({ loading: false }));
                }, 300);
            });
        } catch (err) {
            toast.error("Image upload failed. Please try again.", { autoClose: 3000 });
            this.dispatch(setLoading({ loading: false }));
        }
    }



    render() {
        const { loading } = store.getState().global;
        const {
            catOptions,
            defaultCatOption,
            image,
            imagePreview,
            emptyImg
        } = this.state;

        const styles = {
            editor: {
                // border: '1px solid grey',
                height: '18em',
                // marginBottom:'5em',
            },
        };

        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <div className="seller_body">
                    <Header />
                    <div className="inr_top_page_title">
                        <h2>Add Service</h2>
                    </div>
                    <Helmet>
                        <title>{"Admin - Add Services - Pay Earth"}</title>
                    </Helmet>
                    <div className="seller_dash_wrap pb-5">
                        <div className="container ">
                            <div className="bg-white rounded-3 pt-3 pb-5">
                                <div className="dash_inner_wrap">
                                    <Formik
                                        initialValues={{
                                            name: '',
                                            charges: '',
                                            category: defaultCatOption?.value,
                                            description: '',
                                            // price: '',
                                            // files: '',
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
                                                    <div className="col-md-12 pt-4 pb-4  d-flex justify-content-between align-items-center">
                                                        <div className="dash_title">Add Service</div>


                                                        {/* <div className=""><span>
                                                            <Link className="btn custom_btn btn_yellow mx-auto " to="/admin/manage-services">
                                                                <img src={arrow_back} alt="linked-in" />&nbsp;
                                                                Back
                                                            </Link>
                                                        </span></div> */}
                                                        <div>
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
                                                    <div className="col-md-7">
                                                        <div className="mb-4">
                                                            <label htmlFor="name" className="form-label"> Name of Service <small className="text-danger">*</small></label>
                                                            <input type="text" className="form-control" id="name" aria-describedby="nameHelp"
                                                                name="name"
                                                                onBlur={handleBlur}
                                                                value={values.name}
                                                                onChange={handleChange}
                                                                placeholder={"Service Name"}
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
                                                                value={values.charges}
                                                                onChange={handleChange}
                                                                placeholder={"$ USD"}
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
                                                                onChange={selectedOption => {
                                                                    values.category = selectedOption.value;
                                                                    this.setState({ defaultCatOption: selectedOption });
                                                                    this.setState({ serviceCategory: selectedOption.value });
                                                                    // this.getCategories(selectedOption.value);
                                                                }}
                                                                onBlur={handleBlur}
                                                            />
                                                            {touched.category && errors.category ? (
                                                                <small className="text-danger">{errors.category}</small>
                                                            ) : null}
                                                        </div>
                                                    </div>
                                                    {/* <div className="col-md-4">
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
                                                            </div> */}
                                                    <div className="col-md-7">
                                                        <div className="mb-4">
                                                            <label className="form-label">Description <small className="text-danger">*</small></label>
                                                            <div className="field_item" onClick={this.focusEditor}>
                                                                <ReactQuill
                                                                    className='discr_reactquill'
                                                                    // style={{height:"18em"}}
                                                                    style={styles.editor}
                                                                    type="text"
                                                                    name="description"
                                                                    value={this.state.description}
                                                                    onChange={this.handleDescriptionChange}
                                                                    modules={{
                                                                        toolbar: [
                                                                            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                                            ['bold', 'italic', 'underline'],
                                                                            [{ 'align': [] }],
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
                                                                {!imagePreview ?
                                                                    <div className='formImage'><img src={emptyImg} alt='...' /><p className='text-danger'> Size must be less than 5 MB</p></div>
                                                                    : <div className='formImage'> <img src={imagePreview} alt='...' /></div>}
                                                            </div>
                                                        </div>
                                                        <div className='formImageInput'>
                                                            <input
                                                                className="form-control mb-2"
                                                                style={{ height: "60px" }}
                                                                type="file"
                                                                name="featuredImg"
                                                                accept="image/*"
                                                                value={values.featuredImg}
                                                                // value={this.state.featuredImg}
                                                                onChange={(event) => {
                                                                    handleChange("featuredImg")(event);
                                                                    this.handleImageChange(event);
                                                                }}
                                                                // onChange={this.handleImageChange}
                                                                onBlur={handleBlur}
                                                            />
                                                        </div>

                                                    </div>
                                                    <div className="col-md-2"></div>
                                                    <div className="col-md-6">

                                                    </div>
                                                    <div>
                                                    </div>
                                                    <div className="cre_ser_pay col-md-12 pt-4 pb-4">
                                                        <button type="submit" className="btn  custom_btn btn_yellow w-auto" disabled={!isValid}>Create Service</button>
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

export default connect(setLoading)(adminAddService);