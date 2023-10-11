import React, { Component } from 'react';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import store from '../../store/index';
import { setLoading } from '../../store/reducers/global-reducer';


import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

import SpinnerLoader from '../../components/common/SpinnerLoader';
import NotFound from '../../components/common/NotFound';
import axios from 'axios';

class AdminPageModuleAddNew extends Component {
    constructor(props) {
        super(props);
        const { dispatch } = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;

        this.state = {
            image: '',
            pageTitle: '',
            description: '',
            status: '',
        };
    }

    handleTitleChange = (e) => {
        this.setState({ pageTitle: e.target.value });
    }
    // handleSeoChange = (e) => {
    //     this.setState({ seo: e.target.value });
    // }
    handleDescriptionChange = (description) => {
        this.setState({ description });
    };

    handleImageChange = (e) => {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = () => { this.setState({ image: reader.result }) };
        reader.onerror = error => {
            console.log("error", error);
        }
    };

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

    handleSaveDraft = () => {
        toast.success("POST SAVE IN DRAFT", { autoClose: 3000 })
        this.savePost("draft");
    };

    handlePublish = () => {
        toast.success("POST PUBLISHED", { autoClose: 3000 })
        this.savePost("published");
    };

    savePost = (status) => {
        const { image, pageTitle, description } = this.state;
        const url = 'admin/cmsPage';

        const pageData = {
            image,
            pageTitle,
            description,
            status,

        };
        axios.post(url, pageData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        })
            .then((response) => {
                console.log("POST SUCCESS", response.data);
            })
            .catch((error) => {
                console.error('Error saving post:', error);
            });

        this.setState({ image: "", pageTitle: "", description: "" })
    };


    render() {
        const { image } = this.state;
        return (
            <React.Fragment>
                <Header />
                <div className="container">
                    <div className="row">
                        <div className="col-lg-9">
                            <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
                                <div className="cp_top">
                                    <div className="cumm_title">Add New Page</div>
                                </div>
                                <div className="cp_body">
                                    <div className="crt_bnr_fieldRow">
                                        <div className="crt_bnr_field">
                                            <label for="">Page Title</label>
                                            <div className="field_item">
                                                <input className="form-control" type="text" name="title" id="" value={this.state.pageTitle}
                                                    onChange={this.handleTitleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="crt_bnr_fieldRow">
                                        <div className="crt_bnr_field">
                                            <label for="">Seo Title</label>
                                            <div className="field_item">
                                                <input className="form-control" type="text" name="seo" id="" value={this.state.seo}
                                                    onChange={this.handleSeoChange}
                                                />
                                            </div>
                                        </div>
                                    </div> */}
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
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="cumm_sidebar_box bg-white p-3 rounded-3 mt-4">
                                <div className="cumm_title">Featured Image</div>
                                <div className="filter_box">
                                    <div align="center">
                                        {image && (
                                            <img src={image} style={{ maxWidth: "70%" }} />
                                        )}
                                    </div>
                                    <div className="form-check mb-3 mt-4">
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
                                        <button className='btn custom_btn btn_yellow_bordered'
                                            onClick={this.handlePublish}
                                        >
                                            PUBLISH
                                        </button>
                                        <button className='btn custom_btn btn_yellow_bordered'
                                            onClick={this.handleSaveDraft}
                                        >
                                            DRAFT
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <Footer />
            </React.Fragment>

        );
    }
}

export default AdminPageModuleAddNew;