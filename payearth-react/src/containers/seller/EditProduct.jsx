import React, { Component } from 'react'
import axios from 'axios';
import { Formik, Field, FieldArray, ErrorMessage } from 'formik';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import { setLoading } from '../../store/reducers/global-reducer';
import store from '../../store';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import Header from '../../components/seller/common/Header';
import Footer from '../../components/common/Footer';
import { Helmet } from 'react-helmet';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import arrow_back from './../../assets/icons/arrow-back.svg';
import CryptoJS from 'crypto-js';
import addProductSchema from '../../validation-schemas/addProductSchema';
import config from './../../config.json';

class EditProduct extends Component {
    constructor(props) {
        super(props);
        const { dispatch } = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;
        this.cloudName = process.env.REACT_APP_CLOUD_NAME;
        this.apiKey = process.env.REACT_APP_CLOUD_API_KEY;
        this.apiSecret = process.env.REACT_APP_CLOUD_API_SECRET;
        this.state = {
            productDetail: [],
            catOptions: [],
            defaultCatOption: { label: 'Choose Category', value: '' },
            subCatOptions: [],
            defaultSubCatOption: { label: 'Choose Sub Category', value: '' },
            brands: [],
            defaultBrand: { label: 'Brand', value: '' },
            colors: {},
            tierPrices: [
                { qty: '', price: '' }
            ],
            colorSizes: [
                { size: '', color: '' }
            ],
            colorImages: [
                { color: '', images: [], previews: [] }
            ],
            featuredImg: { image: '', preview: '' },
            previousFeatureImg: ""

        }
        toast.configure();
    }

    componentDidMount() {
        this.getCategories(null);
        this.getBrands();
        this.getColors();
        this.getProductDetail();
    }

    getProductDetail = () => {
        const productId = window.location.pathname.split('/')[3];
        axios.get(`seller/products/${productId}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                let data = response.data.data;
                console.log("productDetail : ", data)
                // this.setState({ productDetail: data })
                let category = { label: data.product.category.categoryName, value: data.product.category.id };
                console.log("category", category)
                let subCategory = {
                    label: data.product.sub_category !== null ? data.product.sub_category.categoryName : 'Choose Sub Category',
                    value: data.product.sub_category !== null ? data.product.sub_category.id : ''
                };
                console.log("subCategory", subCategory)
                let brand = { label: data.product.brand.brandName, value: data.product.brand.id };
                console.log("brand", brand)
                // let colorSizes = {};
                let featuredImg = {};
                let colorImages = data.product.images.length > 0 ? data.product.images : this.state.colorImages;
                console.log("colorImages", colorImages);
                console.log("tier_price", data.product.tier_price);

                // if (data.product.color_size.length > 0) {
                //     data.product.color_size.forEach(value => {
                //         colorSizes[value.size] = value.color
                //     });
                // }

                // console.log("colorSizes", colorSizes)
                // if (data.product.images.length > 0) {
                //     data.product.images.forEach(value => {
                //         let previews = [];
                //         for (let index = 0; index < value.paths.length; index++) {
                //             previews.push(config.apiURI + value.paths[index]);
                //         }
                //         colorImages.push({
                //             color: value.color,
                //             images: value.paths,
                //             previews
                //         });
                //     });
                // }

                featuredImg.image = data.product.featuredImage;
                featuredImg.preview = data.product.featuredImage;


                this.setState({
                    productDetail: data,
                    defaultCatOption: category,
                    defaultSubCatOption: subCategory,
                    defaultBrand: brand,
                    tierPrices: data.product.tier_price,
                    colorSizes: data.product.color_size,
                    featuredImg,
                    colorImages,
                    previousFeatureImg: data.product.featuredImage
                });
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    getCategories = param => {
        let reqBody = {
            is_service: false,
            parent: param
        };

        axios.post('seller/categories/', reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                if (param === null) {
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
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    getBrands = () => {
        this.dispatch(setLoading({ loading: true }));
        axios.get('seller/brands/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                let brands = [];
                response.data.data.forEach(value => {
                    brands.push({ label: value.brandName, value: value.id })
                });
                this.setState({ brands });
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    getColors = () => {
        this.dispatch(setLoading({ loading: true }));
        axios.get('seller/colors/', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                this.setState({ colors: response.data.data });
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }


    handleColorSize = (value, size) => {
        let colorSize = { ...this.state.colorSize };
        this.setState({ colorSize });
        if (colorSize[size].includes(value)) {
            let index = colorSize[size].indexOf(value);
            if (index !== -1) colorSize[size].splice(index, 1);
        } else {
            colorSize[size].push(value);
        }
    }

    addMoreTierPrice = () => this.setState({ tierPrices: [...this.state.tierPrices, { qty: '', price: '' }] });

    addMoreColorSize = () => this.setState({ colorSizes: [...this.state.colorSizes, { size: '', color: '' }] });

    removeTierPrice = i => {
        let tierPrices = this.state.tierPrices;
        tierPrices.splice(i, 1);
        this.setState({ tierPrices });
    }

    removeColorSize = i => {
        let colorSizes = this.state.colorSizes;
        colorSizes.splice(i, 1);
        this.setState({ colorSizes });
    }

    handleQtyPrice = (event, index, fieldName) => {
        let tierPrices = [...this.state.tierPrices];
        if (fieldName === 'qty') {
            tierPrices[index].qty = event.target.value;
        } else {
            tierPrices[index].price = event.target.value;
        }
        this.setState({ tierPrices });
    }

    addMoreColorImg = () => this.setState({ colorImages: [...this.state.colorImages, { color: '', images: [], previews: [] }] });

    removeColorImg = i => {
        let colorImages = this.state.colorImages;
        colorImages.splice(i, 1);
        this.setState({ colorImages });
    }

    handleColorImg = async (event, index, fieldName) => {
        let colorImages = [...this.state.colorImages];
        if (fieldName === 'color') {
            colorImages[index].color = event.target.value;
        } else {
            for (let i = 0; i < event.target.files.length; i++) {
                // console.log("event image ::::", event.target.files[i])
                let imageData = await this.uploadImage(event.target.files[i])
                // console.log("handleColorImage::::", imageData.secure_url)
                colorImages[index].images.push(imageData.secure_url);
                colorImages[index].previews.push(imageData.secure_url);
                //  colorImages[index].previews.push(URL.createObjectURL(event.target.files[i]));
            }
        }
        this.setState({ colorImages });
    }

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

    removeImg = (mainIndex, imgIndex, imgUrl) => {
        // console.log("imgUrl", imgUrl)
        const match = imgUrl.match(/\/v\d+\/(.*?)(\.|$)/);
        const id = match ? match[1] : null;

        this.deleteImage(id);
        let colorImages = [...this.state.colorImages];
        colorImages[mainIndex].images.splice(imgIndex, 1);
        colorImages[mainIndex].previews.splice(imgIndex, 1);
        this.setState({ colorImages });
    }

    removePreviousImage = () => {
        const { previousFeatureImg } = this.state;
        const match = previousFeatureImg.match(/\/v\d+\/(.*?)(\.|$)/);
        const id = match ? match[1] : null;
        this.deleteImage(id);
    }

    handleFeaturedImg = event => {
        console.log("event", event)
        if (event.target.files.length > 0) {
            let featuredImg = {
                image: event.target.files[0],
                preview: URL.createObjectURL(event.target.files[0])
            };
            console.log("featuredImg", featuredImg.image)
            this.setState({ featuredImg });
        } else {
            let featuredImg = {
                image: '',
                preview: ''
            };
            this.setState({ featuredImg });
        }
    }

    uploadImage = (imageFile) => {
        // console.log("imageFile", imageFile)
        return new Promise((resolve, reject) => {
            const data = new FormData();
            data.append("file", imageFile);
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

    saveFeaturedImg = async (productId, successMsg) => {
        console.log("featuredImg", this.state.featuredImg)
        let imageData = await this.uploadImage(this.state.featuredImg.image);
        console.log("imageData", imageData)
        let formData = new FormData();
        formData.append('id', productId);
        formData.append('file', imageData.secure_url);

        // console.log("image Data", imageData);

        await axios.post('seller/products/featured-image', formData, {
            headers: {
                'Accept': 'application/form-data',
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                toast.dismiss();
                toast.success(successMsg, { autoClose: 3000 });
                this.dispatch(setLoading({ loading: true }));
                this.props.history.push('/seller/product-management');
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }


    handleSubmit = values => {

        console.log("values", values)
        let formData = new FormData();
        let tierPrices = this.state.tierPrices;
        let colorSizes = this.state.colorSizes;
        const productId = window.location.pathname.split('/')[3];
        formData.append('seller_id', this.authInfo.id);
        formData.append('name', values.name);
        formData.append('category', values.category); // set ternary condition and select category 
        formData.append('sub_category', values.subCategory);
        formData.append('brand', values.brand);
        formData.append('description', values.description);
        formData.append('specifications', values.specifications);
        formData.append('price', values.price);
        formData.append('vat', values.vat);
        formData.append('images', JSON.stringify(this.state.colorImages));

        for (let index = 0; index < colorSizes.length; index++) {
            formData.append('color_size[' + index + '][size]', colorSizes[index].size);
            formData.append('color_size[' + index + '][color]', colorSizes[index].color);
        }

        // Bind tier prices
        for (let index = 0; index < tierPrices.length; index++) {
            formData.append('tier_price[' + index + '][qty]', tierPrices[index].qty);
            formData.append('tier_price[' + index + '][price]', tierPrices[index].price);
        }

        this.dispatch(setLoading({ loading: true }));
        axios.put(`seller/products/${productId}`, formData, {
            headers: {
                'Accept': 'application/form-data',
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                if (typeof this.state.featuredImg.image === 'string') {
                    toast.dismiss();
                    this.dispatch(setLoading({ loading: true }));
                    toast.success(response.data.message, { autoClose: 3000 });
                    this.props.history.push('/seller/product-management');
                    console.log("run if Condition")
                } else {
                    console.log("run else condition")
                    this.saveFeaturedImg(response.data.data.id, response.data.message);
                    this.removePreviousImage();
                }
            }
        }).catch(error => {
            if (error.response && error.response.data.status === false) {
                toast.error(error.response.data.message);
            }
        }).finally(() => {
            setTimeout(() => {
                this.dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    render() {
        const { loading } = store.getState().global;
        const {
            productDetail,
            catOptions,
            defaultCatOption,
            subCatOptions,
            defaultSubCatOption,
            brands,
            defaultBrand,
            tierPrices,
            colorSizes,
            colorImages,
            featuredImg,
            colors
        } = this.state;

        // console.log("productDetail:::::", productDetail)
        // console.log('colorImages', colorImages)
        console.log("productDetail", productDetail)
        // console.log('defaultCatOption', defaultCatOption);
        // console.log("defaultSubCatOption", defaultSubCatOption);

        return (
            <React.Fragment >
                {loading === true ? <SpinnerLoader /> : ''}
                <div className="seller_body">
                    <Header />
                    <div className="inr_top_page_title">
                        <h2>Edit Product</h2>
                    </div>
                    <Helmet>
                        <title>{"Seller - Edit Product - Pay Earth"}</title>
                    </Helmet>
                    <div className="seller_dash_wrap pt-2 pb-5">
                        <div className="container ">
                            <div className="bg-white rounded-3 pt-3 pb-5">
                                <div className="dash_inner_wrap">
                                    <Formik
                                        initialValues={{
                                            name: productDetail.product ? productDetail.product.name : '',
                                            category: defaultCatOption.value,
                                            subCategory: defaultSubCatOption.value,
                                            brand: productDetail.product ? productDetail.product.brand.id : defaultBrand.value,
                                            description: productDetail.product ? productDetail.product.description : '',
                                            specifications: productDetail.product ? productDetail.product.specifications : '',
                                            price: productDetail.product ? productDetail.product.price : '',
                                            vat: productDetail.product ? productDetail.product.vat : '',
                                            featuredImg: productDetail.featuredImage,
                                            colorSizes,
                                            colorImages,
                                        }}
                                        onSubmit={values => this.handleSubmit(values)}
                                        validationSchema={addProductSchema}
                                        enableReinitialize={true}
                                    >
                                        {({ values,
                                            errors,
                                            touched,
                                            handleChange,
                                            handleBlur,
                                            handleSubmit,
                                            isValid,
                                        }) => (
                                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                                <div className="row">
                                                    <div className="col-md-12 pt-4 pb-5  d-flex justify-content-between align-items-center">
                                                        <div className="dash_title">Edit Product</div>
                                                        <div className=""><span>
                                                            {/* <Link className="btn custom_btn btn_yellow mx-auto " to="/seller/product-management"> */}
                                                            <button
                                                                type="button"
                                                                className="btn custum_back_btn btn_yellow mx-auto"
                                                                onClick={() => window.history.back()}
                                                            >
                                                                <img src={arrow_back} alt="back" />&nbsp;
                                                                Back
                                                            </button>
                                                        </span></div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="mb-4">
                                                            <label htmlFor="name" className="form-label">Name of product <small className="text-danger">*</small></label>
                                                            <input type="text" className="form-control"
                                                                name="name"
                                                                placeholder="Name of product"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.name}
                                                            />
                                                            {touched.name && errors.name ? (
                                                                <small className="text-danger">{errors.name}</small>
                                                            ) : null}
                                                        </div>

                                                        <div className="mb-4">
                                                            <div className="controls_grp">
                                                                <label htmlFor="name" className="form-label">Tier Price <small className="text-danger">*</small></label>
                                                                {tierPrices.map((value, index) => {
                                                                    return <div className="input-group mb-2" key={index}>
                                                                        <input
                                                                            type="number"
                                                                            className="form-control"
                                                                            placeholder="Quantity"
                                                                            min="1"
                                                                            value={value.qty}
                                                                            onChange={(e) => this.handleQtyPrice(e, index, 'qty')}
                                                                            onBlur={handleBlur}
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Regular Price"
                                                                            value={value.price}
                                                                            onChange={(e) => this.handleQtyPrice(e, index, 'price')}
                                                                        />
                                                                        {/* <button type="button" className="btn btn-danger" disabled={tierPrices.length === 1 ? true : false}
                                                                            onClick={() => this.removeTierPrice(index)}
                                                                        >X</button> */}
                                                                    </div>


                                                                })}
                                                                {/* <button type="button" className="icon_btn" onClick={this.addMoreTierPrice}><i className="fa fa-plus"></i></button> */}
                                                            </div>
                                                        </div>

                                                        <div className="mb-4">
                                                            <div className="controls_grp">
                                                                <label htmlFor="name" className="form-label">Selling Price <small className="text-danger">*</small></label>
                                                                <div className="input-group mb-2">
                                                                    <span className="input-group-text" id="basic-addon1">USD</span>
                                                                    <input type="text" className="form-control"
                                                                        name="price"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.price}
                                                                    />
                                                                </div>
                                                                {touched.price && errors.price ? (
                                                                    <small className="text-danger">{errors.price}</small>
                                                                ) : null}
                                                            </div>
                                                        </div>

                                                        <div className="mb-4">
                                                            <div className="controls_grp">
                                                                <label htmlFor="name" className="form-label">Vat in (%) <small className="text-danger">*</small></label>
                                                                <div className="input-group mb-2">
                                                                    <span className="input-group-text" id="basic-addon1">%</span>
                                                                    <input type="number" className="form-control"
                                                                        name="vat"
                                                                        onChange={handleChange}
                                                                        onBlur={handleBlur}
                                                                        value={values.vat}
                                                                    />
                                                                </div>
                                                                {touched.vat && errors.vat ? (
                                                                    <small className="text-danger">{errors.vat}</small>
                                                                ) : null}
                                                            </div>
                                                        </div>

                                                        <div className="mb-4">
                                                            <div className="controls_grp">
                                                                <label htmlFor="name" className="form-label">Color & Size <small className="text-danger">*</small></label>
                                                                {colorSizes.map((value, index) => {
                                                                    return <div className="input-group" key={index}>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Size"
                                                                            min="1"
                                                                            value={value.size}
                                                                            onChange={(e) => this.handleSize(e, index, 'size')}
                                                                        />
                                                                        <div style={{ marginBottom: '10px' }}>
                                                                            <Field
                                                                                as="select"
                                                                                name={`colorSizes[${index}].color`}
                                                                                // value={values.color}
                                                                                onChange={(e) => this.handleSize(e, index, 'color')}
                                                                                style={{ padding: '5px' }}
                                                                            >
                                                                                <option value="" label="Color" />
                                                                                {Object.entries(colors).map(([colorName, colorCode]) => (
                                                                                    <option
                                                                                        key={colorCode}
                                                                                        value={colorCode}
                                                                                    >
                                                                                        {colorName}
                                                                                    </option>
                                                                                ))}
                                                                            </Field>
                                                                            <ErrorMessage name={`colorSizes[${index}].color`} component="div" style={{ color: 'red' }} />
                                                                        </div>
                                                                        <button type="button" className="btn btn-danger" disabled={colorSizes.length === 1 ? true : false}
                                                                            onClick={() => this.removeColorSize(index)}
                                                                        >X</button>
                                                                    </div>
                                                                })}
                                                                <button type="button" className="icon_btn" onClick={this.addMoreColorSize}><i className="fa fa-plus"></i></button>
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="mb-4">
                                                            <div className="controls_grp">
                                                                <div className="label_hh_grp">
                                                                    <label htmlFor="name" className="form-label">Category <small className="text-danger">*</small></label>
                                                                    <label htmlFor="name" className="form-label">Sub category</label>
                                                                </div>
                                                                <div className="input-group full">
                                                                    <div className="form-group w-50">
                                                                        <Select
                                                                            className="form-select category_select"
                                                                            name="category"
                                                                            options={catOptions}
                                                                            value={defaultCatOption}
                                                                            onChange={selectedOption => {
                                                                                values.category = selectedOption.value;
                                                                                this.setState({ defaultCatOption: selectedOption });

                                                                                console.log("selected option:", selectedOption.value);
                                                                                this.getCategories(selectedOption.value);
                                                                                this.setState({ defaultSubCatOption: { label: 'Choose Sub Category', value: '' } })
                                                                            }}
                                                                            onBlur={handleBlur}
                                                                        />
                                                                        {touched.category && errors.category ? (
                                                                            <small className="text-danger">{errors.category}</small>
                                                                        ) : null}
                                                                    </div>
                                                                    <div className="form-group w-50">
                                                                        <Select
                                                                            className="form-select category_select"
                                                                            options={subCatOptions}
                                                                            value={defaultSubCatOption}
                                                                            onChange={selectedOption => {
                                                                                values.subCategory = selectedOption.value;
                                                                                console.log("selected option : ", selectedOption)
                                                                                this.setState({ defaultSubCatOption: selectedOption });
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="mb-4">
                                                            <label className="form-label" htmlFor="">Description <small className="text-danger">*</small></label>
                                                            <textarea className="form-control h-100" rows="8"
                                                                name="description"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.description}
                                                            ></textarea>
                                                            {touched.description && errors.description ? (
                                                                <small className="text-danger">{errors.description}</small>
                                                            ) : null}
                                                        </div>
                                                        <div className="mb-4">
                                                            <div className="controls_grp upload_img">
                                                                <label htmlFor="name" className="form-label">Upload image</label>
                                                                {colorImages.map((value, index) => {
                                                                    return <div className="load_img_box" key={index}>
                                                                        <div className="input-group mb-2">
                                                                            <div style={{ marginBottom: '10px', marginTop: '25px' }}>
                                                                                <Field
                                                                                    as="select"
                                                                                    name={`colorImages[${index}].color`}
                                                                                    onChange={(event) => {
                                                                                        console.log("event color select", event.target.value)
                                                                                        colorImages[index].color = event.target.value;
                                                                                    }}
                                                                                    style={{ padding: '5px' }}
                                                                                >
                                                                                    <option value="" label="Color" />
                                                                                    {Object.entries(colors).map(([colorName, colorCode]) => (
                                                                                        <option
                                                                                            key={colorCode}
                                                                                            value={colorCode}
                                                                                        >
                                                                                            {colorName}
                                                                                        </option>
                                                                                    ))}

                                                                                </Field>

                                                                                <ErrorMessage name={`colorImages[${index}].color`} component="div" style={{ color: 'red' }} />
                                                                            </div>
                                                                            <input
                                                                                className="form-control"
                                                                                type="file"
                                                                                multiple={true}
                                                                                name="file"
                                                                                onChange={(e) => this.handleColorImg(e, index, 'image')}
                                                                                accept="image/*"
                                                                            />
                                                                            <button type="button" className="btn btn-danger" disabled={colorImages.length === 1 ? true : false}
                                                                                onClick={() => this.removeColorImg(index)}
                                                                            >X</button>
                                                                        </div>
                                                                        {
                                                                            value.previews.length > 0 &&
                                                                            <ul className="load_imgs">
                                                                                {value.previews.map((imgUrl, index2) => {
                                                                                    return <li key={index2}>
                                                                                        <Link to="#" className="delete_icon_btn" onClick={() => this.removeImg(index, index2, imgUrl)}><i className="fa fa-trash"></i></Link>
                                                                                        <img src={imgUrl} alt="..." />
                                                                                    </li>
                                                                                })}
                                                                            </ul>
                                                                        }
                                                                    </div>
                                                                })}
                                                                <button type="button" className="icon_btn" onClick={this.addMoreColorImg}><i className="fa fa-plus"></i></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="mb-4">
                                                            <label htmlFor="Subcategory" className="form-label">Brand <small className="text-danger">*</small></label>
                                                            <Select
                                                                className="form-select category_select"
                                                                name="brand"
                                                                options={brands}
                                                                value={defaultBrand}
                                                                onChange={selectedOption => {
                                                                    values.brand = selectedOption.value;
                                                                    this.setState({ defaultBrand: selectedOption });
                                                                }}
                                                                onBlur={handleBlur}
                                                            />
                                                            {touched.brand && errors.brand ? (
                                                                <small className="text-danger">{errors.brand}</small>
                                                            ) : null}
                                                        </div>
                                                        <div className="mb-4">
                                                            <label className="form-label">Specifications <small className="text-danger">*</small></label>
                                                            <textarea className="form-control h-100" rows="8"
                                                                name="specifications"
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.specifications}
                                                            ></textarea>
                                                            {touched.specifications && errors.specifications ? (
                                                                <small className="text-danger">{errors.specifications}</small>
                                                            ) : null}
                                                        </div>
                                                        <div className="mb-4">
                                                            <label className="form-label">Featured Image <small className="text-danger">*</small></label>
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
                                                            {/* {featuredImg.preview !== '' &&
                                                                <ul className="load_imgs">
                                                                    <li>
                                                                        <img src={featuredImg.preview} alt="..." />
                                                                    </li>
                                                                </ul>
                                                            } */}
                                                            {featuredImg.preview !== '' && <div className='text-center'>
                                                                <img src={featuredImg.preview} alt="..." />
                                                            </div>}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12 pt-4 pb-4 text-center">
                                                        <button type="submit" className="btn  custom_btn btn_yellow w-auto" disabled={!isValid}>UPDATE</button>
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

export default connect(setLoading)(EditProduct);