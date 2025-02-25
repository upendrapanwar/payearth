import React, { Component } from 'react';
import axios from 'axios';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import Header from "../../components/admin/common/Header";
import { Helmet } from 'react-helmet';
import { toast } from 'react-toastify';
import CryptoJS from 'crypto-js';
import store from '../../store';
import arrow_back from './../../assets/icons/arrow-back.svg'
import emptyImg from './../../assets/images/emptyimage.png';
import { Link } from 'react-router-dom/cjs/react-router-dom';
import Switch from 'react-input-switch';

class ManageBrands extends Component {
    constructor(props) {
        super(props);
        this.authInfo = store.getState().auth.authInfo;
        this.cloudName = process.env.REACT_APP_CLOUD_NAME;
        this.apiKey = process.env.REACT_APP_CLOUD_API_KEY;
        this.apiSecret = process.env.REACT_APP_CLOUD_API_SECRET;
        this.state = {
            isEditMode: false,
            brandId: null,
            brandName: "",
            brandDescription: "",
            logoImage: "",
            imageId: "",
            imagePreview: null,
            emptyImg: emptyImg,
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
                        src={row.logoImage}
                        alt="Not selected"
                        style={{ width: "80px", height: "80px" }}
                    />
                ),
                sortable: true
            },
            {
                name: 'Brand Name',
                selector: (row, i) => row.brandName,
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
        this.getBrandPermission();
        this.fetchBrandList();
    }

    getBrandPermission = async () => {
        const admin_Id = this.authInfo.id;
        try {
            const res = await axios.get(`admin/getBrandPermission/${admin_Id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            })

            if (res.data.status === true && res.data.data) {
                this.setState({ permissions: res.data.data }, () => {
                    console.log("Checking Response permission", this.state.permissions);
                });
            }

        } catch (error) {
            toast.error(error.response.data.message);
            console.error("Error fetching data: ", error);
        }
    }

    fetchBrandList = async () => {
        this.setState({ loading: true });
        try {
            const url = "/admin/brands";
            const response = await axios.get(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            });
            this.setState({ data: response.data.data, loading: false });
        } catch (error) {
            console.error("There was an error fetching service list category data", error);
            this.setState({ loading: false });
        }
    };

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
                brandName: values.brandName,
                brandDescription: values.brandDescription,
                logoImage: emptyImg,
                isPopular: false,
                isActive: true,
                createdBy: this.authInfo.id
            };
            resetForm();
            const response = await axios.post('/admin/brands', brandData, {
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
                    await axios.put(`/admin/updateBrand/${response.data.data.id}`, {
                        logoImage: imageData.secure_url
                    }, {
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json;charset=UTF-8',
                            'Authorization': `Bearer ${this.authInfo.token}`
                        }
                    });
                }
                toast.success(response.data.message);
                this.fetchBrandList();
                resetForm();
                this.setState({ imagePreview: null, imageFile: null });
            }
        } catch (error) {
            console.error("There was an error saving the brand", error);
        }
    };


    handleUpdate = async (values) => {
        try {
            let editBrandData
            if (values.logoImage === "") {
                editBrandData = {
                    brandName: values.brandName,
                    brandDescription: values.brandDescription,
                    logoImage: this.state.imagePreview,
                    // isPopular: true,
                    // isActive: true,
                    updatedBy: this.authInfo.id,
                };
            } else {
                this.deleteImage(this.state.imageId);
                let imageData = await this.uploadImage();
                editBrandData = {
                    brandName: values.brandName,
                    brandDescription: values.brandDescription,
                    logoImage: imageData.secure_url,
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
        const id = this.getPublicIdFromUrl(row.logoImage);
        this.setState({
            isEditMode: true,
            brandId: row.id,
            imagePreview: row.logoImage,
            imageId: id,
            brandName: row.brandName,
            brandDescription: row.brandDescription
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
        this.setState({ imagePreview: null, imageFile: null, brandName: "", brandDescription: "", isEditMode: false });
    }

    render() {
        const { data, isEditMode, brandName, brandDescription } = this.state;
        const validationSchema = Yup.object({
            brandName: Yup.string().required('Brand name is required'),
            brandDescription: Yup.string().required('Brand description is required'),
            logoImage: Yup.mixed()
                .required('Logo image is required')
                .test('fileSize', 'File size is too large', value => value && value.size <= 350 * 350)
                .test('fileFormat', 'Unsupported Format', value => value && ['image/jpeg', 'image/png'].includes(value.type))
        });

        return (
            <React.Fragment>
                <div className="seller_dash_wrap pb-5">
                    <div className="container">
                        <Header />
                        <div className="inr_top_page_title">
                            <h2>Manage Brands</h2>
                        </div>
                        <Helmet>
                            <title>{"Admin - Manage Brands - Pay Earth"}</title>
                        </Helmet>
                        <div className="row">
                            <div className="col-lg-3">
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
                                                ADD NEW BRANDS
                                            </div>
                                        </>}

                                    </div>
                                    {this.state.isEditMode === true ?
                                        <div className="cp_body">
                                            <Formik
                                                initialValues={{
                                                    brandName: brandName,
                                                    logoImage: "",
                                                    brandDescription: brandDescription
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
                                                            <label htmlFor="brandName" className="form-label">
                                                                Enter Brand Name <small className="text-danger">*</small>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="brandName"
                                                                name="brandName"
                                                                onBlur={handleBlur}
                                                                value={values.brandName}
                                                                onChange={handleChange}
                                                                placeholder="Brand Name"
                                                            />
                                                            {touched.brandName && errors.brandName ? (
                                                                <small className="text-danger">{errors.brandName}</small>
                                                            ) : null}
                                                        </div>

                                                        <div className="mb-4">
                                                            <label htmlFor="brandName" className="form-label">
                                                                Descriptions <small className="text-danger">*</small>
                                                            </label>

                                                            <textarea
                                                                type="text"
                                                                className="form-control h-150 overflow-auto"
                                                                id="brandDescription"
                                                                name="brandDescription"
                                                                onBlur={handleBlur}
                                                                value={values.brandDescription}
                                                                onChange={handleChange}
                                                                placeholder="Brand Name"
                                                            >
                                                            </textarea>
                                                            {touched.brandDescription && errors.brandDescription ? (
                                                                <small className="text-danger">{errors.brandDescription}</small>
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
                                                                name="logoImage"
                                                                accept="image/*"
                                                                onChange={(event) => {
                                                                    setFieldValue("logoImage", event.currentTarget.files[0]);
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
                                                    brandName: "",
                                                    brandDescription: "",
                                                    logoImage: "",
                                                }}
                                                enableReinitialize={true}
                                                validationSchema={validationSchema}
                                                onSubmit={this.handleSubmit}
                                            >
                                                {({ values, errors, touched, handleChange, handleBlur, handleSubmit, setFieldValue, resetForm }) => (
                                                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                                                        <div className="mb-4">
                                                            <label htmlFor="brandName" className="form-label">
                                                                Enter Brand Name <small className="text-danger">*</small>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                id="brandName"
                                                                name="brandName"
                                                                onBlur={handleBlur}
                                                                value={values.brandName}
                                                                onChange={handleChange}
                                                                placeholder="Brand Name"
                                                            />
                                                            {touched.brandName && errors.brandName ? (
                                                                <small className="text-danger">{errors.brandName}</small>
                                                            ) : null}
                                                        </div>

                                                        <div className="mb-4">
                                                            <label htmlFor="brandName" className="form-label">
                                                                Descriptions <small className="text-danger">*</small>
                                                            </label>

                                                            <div className="text-area field_item">
                                                                <textarea
                                                                    type="text"
                                                                    className="form-control h-150 overflow-auto"
                                                                    id="brandDescription"
                                                                    name="brandDescription"
                                                                    onBlur={handleBlur}
                                                                    value={values.brandDescription}
                                                                    onChange={handleChange}
                                                                    placeholder="Descriptions"
                                                                ></textarea>
                                                            </div>

                                                            {touched.brandDescription && errors.brandDescription ? (
                                                                <small className="text-danger">{errors.brandDescription}</small>
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
                                                                name="logoImage"
                                                                accept="image/*"
                                                                onChange={(event) => {
                                                                    setFieldValue("logoImage", event.currentTarget.files[0]);
                                                                    this.handleImageChange(event);
                                                                }}
                                                                onBlur={handleBlur}
                                                            />
                                                        </div>

                                                        <div className="cre_ser_pay col-md-12 pt-4 pb-4 text-center">
                                                            <button type="submit" className="btn custom_btn btn_yellow w-auto"
                                                                disabled={!this.state.permissions.add}>
                                                                Create Brand
                                                            </button>
                                                        </div>
                                                    </form>
                                                )}
                                            </Formik>
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="col-lg-9">
                                <div className="createpost bg-white rounded-3 mt-2 addPost_left_container">
                                    <div className="dash_inner_wrap pb-2">
                                        <div className="col-md-12 pb-3 d-flex justify-content-between align-items-center">
                                            <div className="dash_title">All Brands</div>
                                            {/* <Link to="/admin/dashboard" className="custom_btn btn_yellow w-auto btn">Back</Link> */}
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
                                    </div>
                                    <div className="cp_body">
                                        <DataTableExtensions
                                            columns={this.brand_column}
                                            data={data}
                                        >
                                            <DataTable
                                                pagination
                                                noHeader
                                                highlightOnHover
                                                defaultSortField="id"
                                                defaultSortAsc={false}
                                                paginationPerPage={7}
                                                paginationRowsPerPageOptions={[7, 14, 21, 60]}
                                            // selectableRows           
                                            />
                                        </DataTableExtensions>
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

export default ManageBrands;
