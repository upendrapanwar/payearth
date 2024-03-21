import React, { Component } from 'react';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import slugify from 'slugify';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import store from '../../store/index';
import { setLoading } from '../../store/reducers/global-reducer';
import emptyImg from './../../assets/images/emptyimage.png'

import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import NotFound from '../../components/common/NotFound';
import axios from 'axios';

class AdminPostModuleAddNew extends Component {
    constructor(props) {
        super(props);
        this.cloudName = process.env.REACT_APP_CLOUD_NAME
        const { dispatch } = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;

        this.state = {
            allSlugs: [],
            categoryDate: [],
            image: '',
            seo: '',
            seodescription: '',
            keywords: '',
            title: '',
            description: '',
            shortdescription: '',
            status: '',
            category: '',
        };
    }

    componentDidMount() {
        this.getCategory();
    }

    generateUniqueSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
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

    handleTitleChange = (e) => {
        this.setState({ title: e.target.value });
    }
    handleShortDescription = (e) => {
        this.setState({ shortdescription: e.target.value });
    }
    handleSeoChange = (e) => {
        this.setState({ seo: e.target.value });
    }
    handleSeoDescChange = (e) => {
        this.setState({ seodescription: e.target.value });
    }
    handleKeywordsChange = (e) => {
        this.setState({ keywords: e.target.value });
    }
    handleDescriptionChange = (description) => {
        this.setState({ description });
    }
    // handleImageChange = (e) => {
    //     var reader = new FileReader();
    //     reader.readAsDataURL(e.target.files[0]);
    //     reader.onload = () => { this.setState({ image: reader.result }) };
    //     reader.onerror = error => {
    //         console.log("error", error);
    //     }
    // }

    handleImageChange = (e) => {
        const file = e.target.files[0];
        const data = new FormData()
        data.append("file", file)
        data.append("upload_preset", "pay-earth-images")
        data.append("cloud_name", "pay-earth")
        // https://api.cloudinary.com/v1_1/pay-earth/video/upload   <= video file example
        fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
            method: "post",
            body: data
        }).then((res) => res.json())
            .then((data) => {
                // console.log(data.secure_url);
                this.setState({ image: data.secure_url })
            }).catch((err) => {
                console.log(err)
            })
    };



    handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        // console.log("value", value)
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
        this.props.history.push('/admin/post-module')
    }
    handlePublish = () => {
        toast.success("POST PUBLISHED", { autoClose: 3000 })
        this.savePost("published");
        this.props.history.push('/admin/post-module')
    }

    savePost = (status) => {
        const { image, seo, seodescription, keywords, title, description, shortdescription, category, } = this.state;
        const slug = this.generateUniqueSlug(title);
        const url = 'admin/cmsPost';
        const postData = {
            image,
            seo,
            seodescription,
            keywords,
            title,
            slug,
            description,
            shortdescription,
            status,
            category,
        };
        axios.post(url, postData, {
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
        this.setState({ image: "", title: "", description: "", category: "", seo: "", keywords: "", shortdescription: "", seodescription: "", })
    };


    render() {
        const { image, categoryDate } = this.state;
        return (
            <React.Fragment>
                <Header />
                <div className="container">
                    <Helmet>
                        <title>{"Create new post - Pay Earth"}</title>
                    </Helmet>
                    <div className="row">
                        <div className="col-lg-9">
                            <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
                                <div className="cp_top">
                                    <div className="cumm_title">Add New Post</div>
                                </div>
                                <div className="cp_body">
                                    <div className="crt_bnr_fieldRow">
                                        <div className="crt_bnr_field">
                                            <label htmlFor="">Title</label>
                                            <div className="field_item">
                                                <input className="form-control" type="text" name="title" id="" value={this.state.title}
                                                    onChange={this.handleTitleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="crt_bnr_fieldRow">
                                        <div className="crt_bnr_field">
                                            <label htmlFor="">Short Description</label>
                                            <div className="field_item">
                                                <input className="form-control" type="text" name="shortdescription" id="" value={this.state.shortdescription}
                                                    onChange={this.handleShortDescription}
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
                                            <label htmlFor="">Seo Description</label>
                                            <div className="field_item">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="seo"
                                                    id=""
                                                    value={this.state.seodescription}
                                                    onChange={this.handleSeoDescChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="crt_bnr_fieldRow">
                                        <div className="crt_bnr_field">
                                            <label htmlFor="">keywords</label>
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
                                        {!image ? <img src={emptyImg} alt='...' style={{ maxWidth: "50%" }} /> : <img src={image} style={{ maxWidth: "50%" }} />}
                                    </div>
                                    <div className="form-check mb-3 mt-4">
                                        <input
                                            className='choose_img'
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
                                    <div className="filter_btn_box">
                                        <button
                                            className='btn custom_btn btn_yellow_bordered'
                                            onClick={this.handlePublish}
                                        >
                                            PUBLISH
                                        </button>
                                        <button
                                            className='btn custom_btn btn_yellow_bordered'
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

export default AdminPostModuleAddNew;