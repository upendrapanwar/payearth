import React, { Component } from 'react';
import axios from 'axios';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import Header from '../../components/seller/common/Header';
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import CryptoJS from 'crypto-js';
import store from '../../store';
import Select from 'react-select';
import arrow_back from './../../assets/icons/arrow-back.svg'
import emptyImg from './../../assets/images/emptyimage.png';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import Switch from 'react-input-switch';

class ManageDeals extends Component {
    constructor(props) {
        super(props);
        this.authInfo = store.getState().auth.authInfo;
        this.cloudName = process.env.REACT_APP_CLOUD_NAME;
        this.apiKey = process.env.REACT_APP_CLOUD_API_KEY;
        this.apiSecret = process.env.REACT_APP_CLOUD_API_SECRET;
        this.state = {
            loading: true,
            isEditMode: false,
            brandId: null,
            dealName: "",
            discount: "",
            dealImage: "",
            catOptions: [],
            selectedCategory: "",
            productId: [],
            listedProducts: "",
            createdDeals: "",
            sellerId: "",
            imageId: "",
            imagePreview: null,
            emptyImg: emptyImg,
            openIndex: null,
            data: "",
            permissions: {
                add: false,
                edit: false,
                delete: false
            }
        };

        this.brand_column = [
            {
                name: 'Brand Logo',
                selector: (row, i) => (
                    <img
                        src={row.dealImage}
                        alt="Not selected"
                        style={{ width: "80px", height: "80px" }}
                    />
                ),
                sortable: true
            },
            {
                name: 'Brand Name',
                selector: (row, i) => row.dealName,
                sortable: true
            },
            {
                name: 'isPopular',
                cell: (row, i) => {
                    return <>
                        <Switch
                            on={true}
                            off={false}
                            value={row.isPopular}
                            onChange={() => this.handlePopular(row.id, row.isPopular)}
                        />
                    </>
                },
            },
            {
                name: "Action",
                cell: (row, i) => {
                    return (
                        <>
                            <button
                                className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                                data-bs-whatever="@mdo"
                                onClick={() => this.handleEdit(row)}
                                disabled={!this.state.permissions.edit}
                            >
                                Edit
                            </button>
                            {row.isActive ? (
                                <button
                                    className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                                    onClick={() => this.handleChangeStatus(row, false)}
                                >
                                    Deactivate
                                </button>
                            ) : (
                                <button
                                    className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
                                    onClick={() => this.handleChangeStatus(row, true)}
                                >
                                    Activate
                                </button>
                            )}
                        </>
                    );
                },
            }

        ];
    }

    componentDidMount() {
        this.getCategories();
        this.getListedProducts();
        this.getCreatedDeals();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.selectedCategory !== this.state.selectedCategory) {
            this.getListedProducts();
        }
    }

    toggleAccordion = (index) => {
        this.setState((prevState) => ({
            openIndex: prevState.openIndex === index ? null : index,
        }));
    };

    handleSelectCat = (event) => {
        console.log("selected evenet", event.target.value)
        this.setState({ selectedCategory: event.target.value });
    };

    getListedProducts = async () => {
        this.setState({ loading: true })
        console.log("getListed product run......")
        try {
            const url = 'seller/getDealSelectedProduct';
            const response = await axios.get(url, {
                params: {
                    categoryId: this.state.selectedCategory,
                    authorId: this.authInfo.id
                },
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`,
                    'Content-Type': 'application/json',
                }
            });
            if (response.data.status === true) {
                this.setState({ listedProducts: response.data.data, loading: false })
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setTimeout(() => {
                this.setState({ loading: false });
            }, 300);
        }
    };

    getCategories = () => {
        axios.get('seller/getCategoryForDeals/', {
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
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                // this.dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

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

    uploadImage = () => {
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

    deleteImage = async (id) => {
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = CryptoJS.SHA1(`public_id=${id}&timestamp=${timestamp}${this.apiSecret}`).toString(CryptoJS.enc.Hex);
        try {
            const formData = new FormData();
            formData.append('public_id', id);
            formData.append('api_key', this.apiKey);
            formData.append('timestamp', timestamp);
            formData.append('signature', signature);

            const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`, {
                method: 'POST',
                body: formData,
            });
            if (response.ok) {
                console.log("Image deleted successfully");
            }
        } catch (err) {
            console.error('Error in image deletion process:', err);
        }
    };

    handleSubmit = async (values, { resetForm }) => {
        try {
            const brandData = {
                dealName: values.dealName,
                discount: values.discount,
                dealImage: emptyImg,
                productId: this.state.productId,
                isActive: true,
                sellerId: this.authInfo.id
            };
            resetForm();
            const response = await axios.post('/seller/createDeals', brandData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            });
            if (!response.data.status) {
                toast.error(response.data.message);
                resetForm();
                this.setState({ imagePreview: null, imageFile: null });
            } else {
                if (this.state.imageFile) {
                    let imageData = await this.uploadImage();
                    // console.log("imageData", imageData)
                    await axios.put(`/seller/updateDeals/${response.data.data.id}`, {
                        dealImage: imageData.secure_url
                    }, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json;charset=UTF-8',
                            'Authorization': `Bearer ${this.authInfo.token}`
                        }
                    });
                }
                // toast.success(response.data.message);
                this.getCreatedDeals();
                resetForm();
                this.setState({ imagePreview: null, imageFile: null, productId: "" });
            }
        } catch (error) {
            console.error("There was an error saving the brand", error);
        }
    };

    handleUpdate = async (values) => {
        try {
            let editBrandData
            if (values.dealImage === "") {
                editBrandData = {
                    dealName: values.dealName,
                    discount: values.discount,
                    dealImage: this.state.imagePreview,
                    // isPopular: true,
                    // isActive: true,
                    updatedBy: this.authInfo.id,
                };
            } else {
                this.deleteImage(this.state.imageId);
                let imageData = await this.uploadImage();
                editBrandData = {
                    dealName: values.dealName,
                    discount: values.discount,
                    dealImage: imageData.secure_url,
                    updatedBy: this.authInfo.id,
                };
            }
            const response = await axios.put(`/admin/updateBrand/${this.state.brandId}`, editBrandData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`,
                },
            });
            if (response.data.status === false) {
                toast.error(response.data.message);
                this.handleClear();
            } else {
                toast.success(response.data.message);
                this.fetchBrandList();
                this.handleClear();
            }

        } catch (error) {
            console.error("There was an error saving the brand", error);
        }
    }

    handleRowSelected = (state) => {
        this.setState({ selectedRows: state.selectedRows });
    };

    getPublicIdFromUrl = (url) => {
        const match = url.match(/\/v\d+\/(.*?)(\.|$)/);
        return match ? match[1] : null;
    }

    handleEdit = (row) => {
        const id = this.getPublicIdFromUrl(row.dealImage);
        this.setState({
            isEditMode: true,
            brandId: row.id,
            imagePreview: row.dealImage,
            imageId: id,
            dealName: row.dealName,
            discount: row.discount
        });
    }

    handleChangeStatus = async (row, isActive) => {
        try {
            const updateStatusUrl = `/admin/brands/status/${row.id}`;
            await axios.put(updateStatusUrl, { isActive }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            });
            this.fetchBrandList();
        } catch (error) {
            console.error("There was an error changing the status", error);
        }
    }

    handlePopular = async (id, isPopular) => {
        try {
            const status = !isPopular;
            const updateStatusUrl = `/admin/brands/popularStatus/${id}`;
            await axios.put(updateStatusUrl, { isPopular: status }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            });
            this.fetchBrandList();
        } catch (error) {
            console.error("There was an error changing the status", error);
        }
    }

    handleClear = () => {
        this.setState({ imagePreview: null, imageFile: null, dealName: "", discount: "", isEditMode: false });
    }


    handleCheckboxChange = (id, isChecked) => {
        this.setState((prevState) => {
            const { productId } = prevState;
            if (isChecked) {
                return { productId: [...productId, id] };
            } else {
                return { productId: productId.filter((productId) => productId !== id) };
            }
        });
    };

    getCreatedDeals = async () => {
        this.setState({ loading: true })
        try {
            const url = 'seller/getCreatedDeals';
            const response = await axios.get(url, {
                params: {
                    authorId: this.authInfo.id
                },
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`,
                    'Content-Type': 'application/json',
                }
            });
            if (response.data.status === true) {
                this.setState({ createdDeals: response.data.data, loading: false })
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setTimeout(() => {
                this.setState({ loading: false });
            }, 300);
        }
    }



    render() {
        const { data, isEditMode, dealName, discount, catOptions, selectedCategory, listedProducts, createdDeals, productId, loading, openIndex } = this.state;
        console.log("selectedCategory", selectedCategory)
        console.log("listedProducts", listedProducts)
        console.log("createdDeals", createdDeals)
        const validationSchema = Yup.object({
            dealName: Yup.string().required('Deal name is required'),
            discount: Yup.string().required('Deal discount is required'),
            dealImage: Yup.mixed()
                .required('Logo image is required')
                .test('fileSize', 'File size is too large', value => value && value.size <= 350 * 350)
                .test('fileFormat', 'Unsupported Format', value => value && ['image/jpeg', 'image/png'].includes(value.type))
        });

        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ""}
                <div className="seller_dash_wrap pb-5">
                    <div className="container">
                        <Header />
                        <div className="inr_top_page_title">
                            <h2>Manage Deals</h2>
                        </div>
                        <Helmet>
                            <title>{"Manage Deals - Pay Earth"}</title>
                        </Helmet>
                        <div className="row">
                            <div className="col-lg-4">
                                <div className="createpost bg-white rounded-3 mt-2 addPost_left_container">
                                    <div className="cp_top">
                                        {isEditMode ? <>
                                            <div className="row">
                                                <div className="col-md-8">
                                                    <div className="cumm_title">
                                                        EDIT BRAND
                                                    </div>
                                                </div>
                                                <div className="col-md-4 text-right">
                                                    <button onClick={this.handleClear} className="btn btn-danger btn-sm">
                                                        <small>CLEAR</small>
                                                    </button>
                                                </div>
                                            </div>
                                        </> : <>
                                            <div className="cumm_title">
                                                ADD NEW DEALS
                                            </div>
                                        </>}

                                    </div>
                                    {this.state.isEditMode === true ?
                                        <div className="cp_body">
                                            <Formik
                                                initialValues={{
                                                    dealName: dealName,
                                                    dealImage: "",
                                                    discount: discount
                                                }}
                                                enableReinitialize={true}
                                                validationSchema={validationSchema}
                                                onSubmit={(values, actions) => {
                                                    this.handleUpdate(values, actions);
                                                    actions.resetForm();
                                                }}
                                            >
                                                {({ values, errors, touched, handleChange, handleBlur, handleUpdate, setFieldValue, resetForm }) => (
                                                    <form onSubmit={(e) => {
                                                        e.preventDefault();
                                                        this.handleUpdate(values);
                                                    }} encType="multipart/form-data">
                                                        <div className="mb-4">
                                                            <label htmlFor="dealName" className="form-label">
                                                                Deals <small className="text-danger">*</small>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="dealName"
                                                                name="dealName"
                                                                onBlur={handleBlur}
                                                                // value={values.brandName}
                                                                // onChange={handleChange}
                                                                placeholder="Deals"
                                                            />
                                                            {touched.dealName && errors.dealName ? (
                                                                <small className="text-danger">{"errors.dealName"}</small>
                                                            ) : null}
                                                        </div>

                                                        <div className="formImage-wrapper">
                                                            <label className="form-label">Logo Image</label>
                                                            <div className="text-center formImage-pannel">
                                                                {!this.state.imagePreview ? (
                                                                    <>
                                                                        <img src={this.state.emptyImg} alt="..." className="img-fluid w-75 h-75" />
                                                                        <p className="text-danger"> Size must be less than 5 MB</p>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <img src={this.state.imagePreview} alt="..." className="img-fluid w-75 h-75" />
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="formImageInput">
                                                            <input
                                                                className="form-control"
                                                                type="file"
                                                                name="dealImage"
                                                                accept="image/*"
                                                                onChange={(event) => {
                                                                    setFieldValue("dealImage", event.currentTarget.files[0]);
                                                                    this.handleImageChange(event);
                                                                }}
                                                                onBlur={handleBlur}
                                                            />
                                                        </div>

                                                        <div className="cre_ser_pay col-md-12 pt-4 pb-4 text-center">
                                                            <button type="submit" className="btn custom_btn btn_yellow w-auto">
                                                                Update Brand
                                                            </button>
                                                        </div>
                                                    </form>
                                                )}
                                            </Formik>
                                        </div>
                                        :
                                        <div className="cp_body">
                                            <Formik
                                                initialValues={{
                                                    dealName: "",
                                                    discount: "",
                                                    productId: "",
                                                    dealImage: "",
                                                    sellerId: "",
                                                }}
                                                enableReinitialize={true}
                                                validationSchema={validationSchema}
                                                onSubmit={this.handleSubmit}
                                            >
                                                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm }) => (
                                                    <form onSubmit={handleSubmit} encType="multipart/form-data">

                                                        <div className="formImage-wrapper">
                                                            <label className="form-label"> Deal Image <small className="text-danger">*</small></label>
                                                            {this.state.imagePreview && (
                                                                <div className="text-center formImage-pannel">
                                                                    <img
                                                                        src={this.state.imagePreview}
                                                                        alt="..."
                                                                        className="img-fluid w-50 h-50"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className="formImageInput">
                                                            <input
                                                                className="form-control"
                                                                type="file"
                                                                name="dealImage"
                                                                accept="image/*"
                                                                onChange={(event) => {
                                                                    setFieldValue("dealImage", event.currentTarget.files[0]);
                                                                    this.handleImageChange(event);
                                                                }}
                                                                onBlur={handleBlur}
                                                            />
                                                        </div>

                                                        <div className="mb-4 mt-4">
                                                            <label htmlFor="dealName" className="form-label">
                                                                Deal Name <small className="text-danger">*</small>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="dealName"
                                                                name="dealName"
                                                                onBlur={handleBlur}
                                                                value={values.dealName}
                                                                onChange={handleChange}
                                                                placeholder="Deal Name"
                                                            />
                                                            {touched.dealName && errors.dealName ? (
                                                                <small className="text-danger">{errors.dealName}</small>
                                                            ) : null}
                                                        </div>

                                                        <div className="mb-4">
                                                            <label htmlFor="dealName" className="form-label">
                                                                Discount <small className="text-danger">*</small>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="discount"
                                                                name="discount"
                                                                onBlur={handleBlur}
                                                                value={values.discount}
                                                                onChange={handleChange}
                                                                placeholder="Discount"
                                                            />
                                                            {touched.discount && errors.discount ? (
                                                                <small className="text-danger">{errors.discount}</small>
                                                            ) : null}
                                                        </div>

                                                        <div className="formImage-wrapper mt-4">
                                                            <label className="form-label">Add Product</label>
                                                            <select
                                                                className="form-select"
                                                                aria-label="Select Category"
                                                                value={selectedCategory}
                                                                onChange={this.handleSelectCat}
                                                            >
                                                                <option value="">All</option>
                                                                {catOptions.map((category) => (
                                                                    <option key={category.value} value={category.value}>
                                                                        {category.label}
                                                                    </option>
                                                                ))}
                                                            </select>

                                                            <div
                                                                style={{ overflowY: 'auto', maxHeight: '120vh', border: '1px solid #ddd', scrollbarWidth: 'thin', }}
                                                                className='mt-2'
                                                            >
                                                                {listedProducts && listedProducts.length > 0 ? (
                                                                    listedProducts.map((product) => (
                                                                        <div className="card m-2" key={product.id}>
                                                                            <div className="row">
                                                                                <div className="col-md-4">
                                                                                    <img
                                                                                        src={product.featuredImage}
                                                                                        alt={product.name}
                                                                                        className="img-fluid rounded-start m-2"
                                                                                        style={{ height: '80px', objectFit: 'cover' }}
                                                                                    />
                                                                                </div>
                                                                                <div className="col-md-8">
                                                                                    <div className="card-body">
                                                                                        <div className="row align-items-center">
                                                                                            <div className="col-10">
                                                                                                {/* <h6 className="card-title">{product.name}</h6> */}
                                                                                                <h6 className='card-title'>{product.name.length > 20 ? `${product.name.substring(0, 35)}...` : product.name}</h6>
                                                                                                <details>
                                                                                                    <summary><b>View Details</b></summary>
                                                                                                    <p className="card-text">{product.description}</p>
                                                                                                </details>
                                                                                            </div>
                                                                                            <div className="col-2">
                                                                                                <div className="form-check">
                                                                                                    <input
                                                                                                        className="form-check-input"
                                                                                                        type="checkbox"
                                                                                                        id={`selectProductCheckbox-${product.id}`}
                                                                                                        onChange={(e) =>
                                                                                                            this.handleCheckboxChange(product.id, e.target.checked)
                                                                                                        }
                                                                                                        checked={productId.includes(product.id)}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className="text-center mt-4">
                                                                        <p>No products found.</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div className="cre_ser_pay col-md-12 pt-4 pb-4 text-center">
                                                            <button type="submit" className="btn custom_btn btn_yellow w-auto"
                                                            >
                                                                MAKE A DEAL
                                                            </button>
                                                        </div>
                                                    </form>
                                                )}
                                            </Formik>
                                        </div>
                                    }
                                </div>
                            </div>

                            <div className="col-lg-8">
                                <div className="createpost bg-white rounded-3 mt-2 addPost_left_container">
                                    <div className="dash_inner_wrap pb-2">
                                        <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center">
                                            <div className="dash_title">All Deals</div>
                                            <Link to="/seller/dashboard" className="custom_btn btn_yellow w-auto btn">Back</Link>
                                        </div>
                                    </div>
                                    <div className="row">
                                        {createdDeals && createdDeals.map((deal, index) => (
                                            <div className="col-md-6" key={deal._id}>
                                                <div className="accordion accordion-flush" id={`accordionFlushExample${index}`}>
                                                    <div className="accordion-item">
                                                        <h2 className="accordion-header">
                                                            <button
                                                                className={`accordion-button ${openIndex === index ? "" : "collapsed"}`}
                                                                type="button"
                                                                onClick={() => this.toggleAccordion(index)} // Handle toggle
                                                            >
                                                                <img
                                                                    src={deal.dealImage}
                                                                    alt={deal.dealName}
                                                                    className="img-fluid ms-2"
                                                                    style={{ width: "250px", height: "250px", objectFit: "cover" }}
                                                                />
                                                                <div className="ms-3">
                                                                    <h5 className="mb-0">{deal.dealName}</h5>
                                                                    <p className="mb-0 text-muted">Up to {deal.discount}% Off</p>
                                                                </div>
                                                            </button>
                                                        </h2>
                                                        <div
                                                            id={`flush-collapse${index}`}
                                                            className={`accordion-collapse collapse ${openIndex === index ? "show" : ""}`}
                                                        >
                                                            <div className="mt-2">
                                                                {deal.productId && deal.productId.length > 0 ? (
                                                                    deal.productId.map((product) => (
                                                                        <div className="card m-2" key={product.id}>
                                                                            <div className="row g-0">
                                                                                <div className="col-md-2">
                                                                                    <img
                                                                                        src={product.featuredImage}
                                                                                        alt={product.name}
                                                                                        className="img-fluid rounded-start m-2"
                                                                                    // style={{ height: "150px", objectFit: "cover" }}
                                                                                    />
                                                                                </div>
                                                                                <div className="col-md-10">
                                                                                    <div className="m-2">
                                                                                        <div className='d-flex'>
                                                                                            <b>{product.brand.brandName}</b>
                                                                                        </div>
                                                                                        <div className="row align-items-center">
                                                                                            <div className="col-12 d-flex">
                                                                                                <h6 className="card-title">
                                                                                                    {product.name.length > 20 ? `${product.name.substring(0, 35)}...` : product.name}
                                                                                                </h6>
                                                                                            </div>
                                                                                            <div className='d-flex'>
                                                                                                <h6 className="card-text m-2"><del>${product.price}</del></h6>
                                                                                                <h5 className="card-text text-success">${product.price - product.price * deal.discount / 100}</h5>
                                                                                                {/* <h6 className='card-text mr-4'>{deal.discount}% Off</h6> */}
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    ))
                                                                ) : (
                                                                    <div className="text-center mt-4">
                                                                        <p>No products found.</p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment >
        );
    }
}

export default ManageDeals;
