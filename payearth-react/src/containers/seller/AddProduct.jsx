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
import Select from 'react-select';
import { Link } from 'react-router-dom';
import addProductSchema from '../../validation-schemas/addProductSchema';

class AddProduct extends Component {
    constructor(props) {
        super(props);
        const { dispatch } = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;
        this.state = {
            catOptions: [],
            defaultCatOption: { label: 'Choose Category', value: '' },
            subCatOptions: [],
            defaultSubCatOption: { label: 'Choose Sub Category', value: '' },
            brands: [],
            defaultBrand: { label: 'Brand', value: '' },
            colors: [],
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
        }
        toast.configure();
    }

    componentDidMount() {
        this.getCategories(null);
        this.getBrands();
        this.getColors();
    }

    getCategories = param => {
        // console.log("param", param)
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
        }).then(response => {
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
                    // console.log("subCatOptions : ", subCatOptions)
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
        }).then(response => {
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
        }).then(response => {
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

    handleSize = (event, index, fieldName) => {
        let colorSizes = [...this.state.colorSizes];
        if (fieldName === 'size') {
            colorSizes[index].size = event.target.value;
        } else {
            colorSizes[index].color = event.target.value;
        }
        this.setState({ colorSizes });
    }

    addMoreColorImg = () => this.setState({ colorImages: [...this.state.colorImages, { color: '', images: [], previews: [] }] });

    removeColorImg = i => {
        let colorImages = this.state.colorImages;
        colorImages.splice(i, 1);
        this.setState({ colorImages });
    }

    handleColorImg = (event, index, fieldName) => {
        let colorImages = [...this.state.colorImages];
        if (fieldName === 'color') {
            colorImages[index].color = event.target.value;
        } else {
            for (let i = 0; i < event.target.files.length; i++) {
                colorImages[index].images.push(event.target.files[i]);
                colorImages[index].previews.push(URL.createObjectURL(event.target.files[i]));
            }
        }
        this.setState({ colorImages });
    }

    removeImg = (mainIndex, imgIndex) => {
        let colorImages = [...this.state.colorImages];
        colorImages[mainIndex].images.splice(imgIndex, 1);
        colorImages[mainIndex].previews.splice(imgIndex, 1);
        this.setState({ colorImages });
    }

    handleFeaturedImg = event => {
        if (event.target.files.length > 0) {
            let featuredImg = {
                image: event.target.files[0],
                preview: URL.createObjectURL(event.target.files[0])
            };
            this.setState({ featuredImg });
        } else {
            let featuredImg = {
                image: '',
                preview: ''
            };
            this.setState({ featuredImg });
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
            if (response.data.status) {
                toast.dismiss();
                toast.success(successMsg, { autoClose: 3000 });
                this.dispatch(setLoading({ loading: true }));
                // this.props.history.push('/seller/product-stock-management');
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
        console.log("values::::", values)
        let formData = new FormData();
        let tierPrices = this.state.tierPrices;
        let colorSizes = this.state.colorSizes;
        formData.append('seller_id', this.authInfo.id);
        formData.append('name', values.name);
        formData.append('category', values.category);
        formData.append('sub_category', values.subCategory);
        formData.append('brand', values.brand);
        formData.append('description', values.description);
        formData.append('specifications', values.specifications);
        formData.append('price', values.price);

        //   Bind colors with size
        // for (const [key, value] of Object.entries(this.state.colorSizes)) {
        //     if (this.state.colorSizes[key].length > 0) {
        //         for (let index = 0; index < value.length; index++) {
        //             if (value[index] !== undefined && value[index] !== '') {
        //                 formData.append('color_size[' + key + '][]', value[index]);
        //             }
        //         }
        //     }
        // }

        for (let index = 0; index < colorSizes.length; index++) {
            formData.append('color_size[' + index + '][size]', colorSizes[index].size);
            formData.append('color_size[' + index + '][color]', colorSizes[index].color);
        }

        // Bind tier prices
        for (let index = 0; index < tierPrices.length; index++) {
            formData.append('tier_price[' + index + '][qty]', tierPrices[index].qty);
            formData.append('tier_price[' + index + '][price]', tierPrices[index].price);
        }

        // Bind images with color
        // for (let index = 0; index < this.state.colorImages.length; index++) {
        //     const element = this.state.colorImages[index];
        //     if (element.images.length > 0) {
        //         element.images.forEach(value => {
        //             formData.append(element.color, value);
        //         })
        //     }
        // }


        console.log("formData", formData)
        this.dispatch(setLoading({ loading: true }));

        axios.post('seller/products', formData, {
            headers: {
                'Accept': 'application/form-data',
                'Content-Type': 'application/json; charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status) {
                console.log("Add Product response true:::;", response.data)
                this.saveFeaturedImg(response.data.data.id, response.data.message);
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

    handleColorChange = (size, color) => {
        this.setState(prevState => ({
            selectedColors: {
                ...prevState.selectedColors,
                [size]: color,
            },
        }));
    };

    render() {
        const { loading } = store.getState().global;
        const { selectedColors } = this.state;
        const {
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
            colors,
        } = this.state;

        console.log("colorImages", colorImages)
        console.log("colors", colors)
        console.log("colorSizes", colorSizes)

        return (
            <React.Fragment >
                {loading === true ? <SpinnerLoader /> : ''}
                <div className="seller_body">
                    <Header />
                    <div className="seller_dash_wrap pt-5 pb-5">
                        <div className="container ">
                            <div className="bg-white rounded-3 pt-3 pb-5">
                                <div className="dash_inner_wrap">
                                    <Formik
                                        initialValues={{ name: '', category: defaultCatOption.value, subCategory: defaultSubCatOption.value, brand: defaultBrand.value, description: '', specifications: '', price: '', featuredImg: '' }}
                                        onSubmit={values => this.handleSubmit(values)}
                                        validationSchema={addProductSchema}>
                                        {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isValid, }) => (
                                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                                                <div className="row">
                                                    <div className="col-md-12 pt-4 pb-4">
                                                        <div className="dash_title">Add Product</div>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <div className="mb-4">
                                                            <label htmlFor="name" className="form-label">Name of product <small className="text-danger">*</small></label>
                                                            <input type="text" className="form-control"
                                                                name="name"
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
                                                                <label htmlFor="name" className="form-label">Tier Price</label>
                                                                {tierPrices.map((value, index) => {
                                                                    return <div className="input-group mb-2" key={index}>
                                                                        <input
                                                                            type="number"
                                                                            className="form-control"
                                                                            placeholder="Quantity"
                                                                            min="1"
                                                                            value={value.qty}
                                                                            onChange={(e) => this.handleQtyPrice(e, index, 'qty')}
                                                                        />
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            placeholder="Price"
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


                                                        {/* <div className="mb-4">
                                                            <div className="controls_grp">
                                                                <label htmlFor="name" className="form-label">Color & Size</label>
                                                                <div className="input-group mb-2">
                                                                    <input type="text" className="form-control" aria-label="Text input" placeholder="S" value="S" />
                                                                    <button className="btn btn-outline-secondary" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        <ul className="colors_pick" style={{ 'display': 'none' }}>
                                                                            <li><span style={{ backgroundColor: '#0EB4B3' }} className="color_box"></span></li>
                                                                            <li><span style={{ backgroundColor: '#7C80BC' }} className="color_box"></span></li>
                                                                        </ul>
                                                                        <span>Color</span>
                                                                    </button>
                                                                    <ul className="dropdown-menu dropdown-menu-end colors_pick ps-3 pe-2 pb-4">
                                                                        {() => { this.colorPalette('s', 'colorSize') }}
                                                                    </ul>
                                                                </div>


                                                                <div className="input-group mb-2">
                                                                    <input type="text" readOnly className="form-control" placeholder="M" value="M" />
                                                                    <button className="btn btn-outline-secondary" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        <ul className="colors_pick" style={{ 'display': 'none' }}>
                                                                            <li><span style={{ backgroundColor: '#0EB4B3' }} className="color_box"></span></li>
                                                                            <li><span style={{ backgroundColor: '#7C80BC' }} className="color_box"></span></li>
                                                                        </ul>
                                                                        <span>Color</span>
                                                                    </button>
                                                                    <ul className="dropdown-menu dropdown-menu-end colors_pick ps-3 pe-2 pb-4">
                                                                        {() => { this.colorPalette('m', 'colorSize') }}
                                                                    </ul>
                                                                </div>
                                                                <div className="input-group mb-2">
                                                                    <input type="text" readOnly className="form-control" aria-label="Text input" placeholder="L" value="L" />
                                                                    <button className="btn btn-outline-secondary" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        <ul className="colors_pick" style={{ 'display': 'none' }}>
                                                                            <li><span style={{ backgroundColor: '#0EB4B3' }} className="color_box"></span></li>
                                                                            <li><span style={{ backgroundColor: '#7C80BC' }} className="color_box"></span></li>
                                                                        </ul>
                                                                        <span>Color</span>
                                                                    </button>
                                                                    <ul className="dropdown-menu dropdown-menu-end colors_pick ps-3 pe-2 pb-4">
                                                                        {() => { this.colorPalette('l', 'colorSize') }}
                                                                    </ul>
                                                                </div>
                                                                <div className="input-group mb-2">
                                                                    <input type="text" readOnly className="form-control" aria-label="Text input" placeholder="XL" value="XL" />
                                                                    <button className="btn btn-outline-secondary" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        <ul className="colors_pick" style={{ 'display': 'none' }}>
                                                                            <li><span style={{ backgroundColor: '#0EB4B3' }} className="color_box"></span></li>
                                                                            <li><span style={{ backgroundColor: '#7C80BC' }} className="color_box"></span></li>
                                                                        </ul>
                                                                        <span>Color</span>
                                                                    </button>
                                                                    <ul className="dropdown-menu dropdown-menu-end colors_pick ps-3 pe-2 pb-4">
                                                                        {() => { this.colorPalette('xl', 'colorSize') }}
                                                                    </ul>
                                                                </div>
                                                                <div className="input-group mb-2">
                                                                    <input type="text" readOnly className="form-control" aria-label="Text input" placeholder="XXL" value="XXL" />
                                                                    <button className="btn btn-outline-secondary" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                                        <ul className="colors_pick" style={{ 'display': 'none' }}>
                                                                            <li><span style={{ backgroundColor: '#0EB4B3' }} className="color_box"></span></li>
                                                                            <li><span style={{ backgroundColor: '#7C80BC' }} className="color_box"></span></li>
                                                                        </ul>
                                                                        <span>Color</span>
                                                                    </button>
                                                                    <ul className="dropdown-menu dropdown-menu-end colors_pick ps-3 pe-2 pb-4">
                                                                        {() => { this.colorPalette('xxl', 'colorSize') }}
                                                                    </ul>
                                                                </div>
                                                            </div>
                                                        </div> */}

                                                        {/* Test */}

                                                        <div className="mb-4">
                                                            <div className="controls_grp">
                                                                <label htmlFor="name" className="form-label">Color & Size</label>
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
                                                                                name="color"
                                                                                value={values.color}
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
                                                                            <ErrorMessage name="color" component="div" style={{ color: 'red' }} />
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
                                                                                console.log("selected option:", selectedOption.value)
                                                                                this.getCategories(selectedOption.value);
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
                                                                                    name="color"
                                                                                    value={values.color}
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

                                                                                <ErrorMessage name="color" component="div" style={{ color: 'red' }} />
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
                                                                                        <Link to="#" className="delete_icon_btn" onClick={() => this.removeImg(index, index2)}><i className="fa fa-trash"></i></Link>
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
                                                        <button type="submit" className="btn  custom_btn btn_yellow w-auto" disabled={!isValid}>Save Product</button>
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
            </React.Fragment >
        )
    }
}

export default connect(setLoading)(AddProduct);