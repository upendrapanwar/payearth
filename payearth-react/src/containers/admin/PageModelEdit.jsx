import React, { Component } from 'react';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Formik, Form, Field } from 'formik';
import store from '../../store/index';
import { setLoading } from '../../store/reducers/global-reducer';


import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import SpinnerLoader from '../../components/common/SpinnerLoader';
import NotFound from '../../components/common/NotFound';
import axios from 'axios';

class AdminPageEdit extends Component {
    constructor(props) {
        super(props);
        const { dispatch } = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;
        this.state = {
            seo: '',
            keywords: '',
            image: '',
            pageTitle: '',
            description: '',
        };
    }

    componentDidMount() {
        this.getPostById();
    }

    getPostById = () => {
        const { id } = this.props.match.params;
        axios.get(`/admin/cmsGetPageById/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            console.log("RESPONSE>DATA : ", response.data.data)
            let result = response.data.data
            for (var i = 0; i < result.length; i++) {
                console.log(result.length)
                this.setState({
                    keywords: result[i].keywords,
                    seo: result[i].seo,
                    pageTitle: result[i].pageTitle,
                    description: result[i].description,
                    image: result[i].image
                })
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    handleTitleChange = (e) => {
        this.setState({ pageTitle: e.target.value });
    }
    handleSeoChange = (e) => {
        this.setState({ seo: e.target.value });
    }
    handleKeywordsChange = (e) => {
        this.setState({ keywords: e.target.value });
    }
    handleDescriptionChange = (description) => {
        this.setState({ description });
    }

    handleImageChange = (e) => {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => {
            this.setState({ image: reader.result })
        };
        reader.onerror = error => {
            console.log("error", error);
        }
    }

    handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        console.log("value", value)
        if (checked) {
            this.setState((prevState) => ({
                category: [...prevState.category, value],
            }));
        } else {
            this.setState((prevState) => ({
                category: prevState.category.filter((category) => category !== value),
            }));
        }
    };

    updatePost = (e) => {
        e.preventDefault();
        const { id } = this.props.match.params;
        const { image, pageTitle, description, keywords, seo } = this.state;

        const url = `/admin/cmsUpdatePage/${id}`;
        const postData = {
            keywords,
            seo,
            image,
            pageTitle,
            description,
        };
        axios.put(url, postData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        })
            .then((response) => {
                console.log("UPDATE SUCCESS", response.data);
            })
            .catch((error) => {
                console.error('Error saving post:', error);
            });

        this.props.history.push('/admin/page-module')
        // toast.success("Update Succesfully", { autoClose: 3000 })
        // window.location.reload("");
    };


    render() {

        return (
            <React.Fragment>
                <Header />
                <div className="container">
                    <form onSubmit={this.updatePost} >
                        <div className="row">
                            <div className="col-lg-9">
                                <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
                                    <div className="cp_top addPost_button_singleRow">
                                        <div className="cumm_title">Edit Page</div>
                                        <div className="search_customer_field">
                                            <div className="noti_wrap">
                                                <div className="">
                                                    <span>
                                                        <Link className="btn custom_btn btn_yellow mx-auto" to="/admin/page-module-add-new"> Create New Page</Link>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="cp_body">
                                        <div className="crt_bnr_fieldRow">
                                            <div className="crt_bnr_field">
                                                <label htmlFor="">Page Title</label>
                                                <div className="field_item">
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        name="title"
                                                        id=""
                                                        value={this.state.pageTitle}
                                                        onChange={this.handleTitleChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="crt_bnr_fieldRow">
                                            <div className="crt_bnr_field">
                                                <label>Description</label>
                                                <div className="field_item">
                                                    <ReactQuill
                                                        //style={{ height: '250px' }}
                                                        type="text"
                                                        name="description"
                                                        value={this.state.description}
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
                                        <div className="crt_bnr_fieldRow">
                                            <div className="crt_bnr_field">
                                                <label for="">Seo Title</label>
                                                <div className="field_item">
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        name="seo"
                                                        id=""
                                                        value={this.state.seo}
                                                        onChange={this.handleSeoChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="crt_bnr_fieldRow">
                                            <div className="crt_bnr_field">
                                                <label for="">Keywords</label>
                                                <div className="field_item">
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        name="seo"
                                                        id=""
                                                        value={this.state.keywords}
                                                        onChange={this.handleKeywordsChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-3">
                                <div className="cumm_sidebar_box bg-white p-3 rounded-3 mt-4">
                                    <div className="cumm_title">Featured Image</div>
                                    <div className="filter_box">
                                        <div align="center">
                                            {this.state.image && (
                                                <img src={this.state.image} style={{ maxWidth: "70%" }} />
                                            )}
                                        </div>
                                        <div className="form-check mb-3 mt-4 border">
                                            <input
                                                type="file"
                                                accept="image/"
                                                onChange={this.handleImageChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="cumm_sidebar_box bg-white p-3 rounded-3">
                                    {/* <div className="cumm_title">Category</div> */}
                                    <div className="filter_box">
                                        {/* <div className="form-check mb-3 mt-4">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value="Nature"
                                                onChange={this.handleCheckboxChange}
                                                checked={this.state.category.includes("Nature")}
                                            />
                                            <label className="form-check-label" for="latestPost">Nature</label>
                                        </div> */}
                                        {/* <div className="form-check mb-3">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value="Sports"
                                                onChange={this.handleCheckboxChange}
                                                checked={this.state.category.includes("Sports")}
                                            />
                                            <label className="form-check-label" for="popularPost">Sports</label>
                                        </div> */}
                                        {/* <div className="form-check mb-3">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value="Education"
                                                onChange={this.handleCheckboxChange}
                                                checked={this.state.category.includes("Education")}
                                            />
                                            <label className="form-check-label" for="CommentedPost">Education</label>
                                        </div> */}
                                        <div className="filter_btn_box">
                                            <button
                                                className='btn custom_btn btn_yellow_bordered'
                                                type="submit"
                                            >
                                                Update
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>

                </div>
                <Footer />
            </React.Fragment>

        );
    }
}

export default AdminPageEdit;