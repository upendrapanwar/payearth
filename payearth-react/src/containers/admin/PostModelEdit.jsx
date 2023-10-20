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

class AdminPostEdit extends Component {
    constructor(props) {
        super(props);
        const { dispatch } = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;
        this.state = {
            categoryDate: [],
            image: '',
            seo: '',
            keywords: '',
            title: '',
            shortdescription: '',
            description: '',
            category: '',
        };
    }

    componentDidMount() {
        this.getPostById();
        this.getCategory();
    }
    getCategory = () => {
        axios.get('/admin/getCmsAllCategory', {
            headers: {
                'Authorization': `Bearer ${this.authInfo.token}`
            },
        })
            .then(res => {
                this.setState({
                    categoryDate: res.data.data,
                    loading: false,
                    error: null
                })
            })
            .catch(error => {
                this.setState({
                    categoryDate: [],
                    loading: false,
                    error: error
                })
            })
    }

    getPostById = () => {
        const { id } = this.props.match.params;
        axios.get(`/admin/cmsGetPostById/${id}`, {
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
                    title: result[i].title,
                    shortdescription: result[i].shortdescription,
                    description: result[i].description,
                    category: result[i].category,
                    image: result[i].image,
                    seo: result[i].seo,
                    keywords : result[i].keywords
                })
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
    }

    handleTitleChange = (e) => {
        this.setState({ title: e.target.value });
    }
    handleShortDescription = (e) => {
        this.setState({ shortdescription: e.target.value });
    }
    handleSeoChange = (e) => {
        this.setState({ seo: e.target.value })
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
        reader.onload = () => { this.setState({ image: reader.result }) };
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

    updatePost = () => {
        const { id } = this.props.match.params;
        const { image, seo, keywords, title, shortdescription, description, category } = this.state;

        const url = `/admin/cmsUpdatePost/${id}`;
        const postData = {
            image,
            seo,
            keywords,
            title,
            shortdescription,
            description,
            category
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

        this.setState({ image: "", seo: "", keywords: "", title: "", shortdescription: "", description: "", category: "" })
        toast.success("Update succesfully...", { autoClose: 3000 })
    };

    render() {
        const { categoryDate } = this.state;
        return (
            <React.Fragment>
                <Header />
                <div className="container">
                    <form onSubmit={this.updatePost} >
                        <div className="row">
                            <div className="col-lg-9">

                                <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
                                    <div className="cp_top addPost_button_singleRow">
                                        <div className="cumm_title">Edit Post</div>
                                        <div className="search_customer_field">
                                            <div className="noti_wrap">
                                                <div className="">
                                                    <span>
                                                        <Link className="btn custom_btn btn_yellow mx-auto" to="/admin/post-module-add-new"> Create New Post</Link>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="cp_body">
                                        <div className="crt_bnr_fieldRow">
                                            <div className="crt_bnr_field">
                                                <label htmlFor="">Title</label>
                                                <div className="field_item">
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        name="title"
                                                        id=""
                                                        value={this.state.title}
                                                        onChange={this.handleTitleChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="crt_bnr_fieldRow">
                                            <div className="crt_bnr_field">
                                                <label htmlFor="">Short Description</label>
                                                <div className="field_item">
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        name="shortdescription"
                                                        id=""
                                                        value={this.state.shortdescription}
                                                        onChange={this.handleShortDescription}
                                                    />
                                                </div>
                                            </div>
                                        </div>


                                        <div className="crt_bnr_fieldRow">
                                            <div className="crt_bnr_field">
                                                <label htmlFor="">Description</label>
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
                                                <label htmlFor="">Seo Title</label>
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
                                                <label htmlFor="">Keywords</label>
                                                <div className="field_item">
                                                    <input
                                                        className="form-control"
                                                        type="text"
                                                        name="keywords"
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
                                    <div className="cumm_title">Category</div>
                                    <div className="filter_box">
                                        {categoryDate.map(item => <div className="form-check mb-3 mt-4">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={item.names}
                                                onChange={this.handleCheckboxChange}
                                                checked={this.state.category.includes(item.names)}
                                            />
                                            <label className="form-check-label" htmlFor="latestPost">{item.names}</label>
                                        </div>)}

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

export default AdminPostEdit;