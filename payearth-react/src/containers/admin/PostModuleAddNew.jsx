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

import SpinnerLoader from '../../components/common/SpinnerLoader';
import NotFound from '../../components/common/NotFound';
import axios from 'axios';

class AdminPostModuleAddNew extends Component {
    constructor(props) {
        super(props);
        const { dispatch } = props;
        this.dispatch = dispatch;
        this.authInfo = store.getState().auth.authInfo;

        this.state = {
<<<<<<< HEAD
            allSlugs: [],
            categoryDate: [],
            image: '',
            seo: '',
            seodescription: '',
=======
            categoryDate: [],
            image: '',
            seo: '',
>>>>>>> 2037050c91b1fe7ad972e42de68244346d65e721
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

<<<<<<< HEAD
    // generateUniqueSlug = (title) => {
    //     const { allSlugs } = this.state;
    //     console.log("allSlug", allSlugs)
    //     const data = title
    //         .toLowerCase()
    //         .replace(/[^a-z0-9 -]/g, '')
    //         .replace(/\s+/g, '-')
    //         .replace(/-+/g, '-')
    //         .trim();

    //     const slug = allSlugs.filter(item => item.slug == data);
    //     if (slug.length == 0) {

    //         return title
    //             .toLowerCase()
    //             .replace(/[^a-z0-9 -]/g, '')
    //             .replace(/\s+/g, '-')
    //             .replace(/-+/g, '-')
    //             .trim();
    //     } else {
    //         const originalTitle = title + "-" + allSlugs.length;

    //         return originalTitle
    //             .toLowerCase()
    //             .replace(/[^a-z0-9 -]/g, '')
    //             .replace(/\s+/g, '-')
    //             .replace(/-+/g, '-')
    //             .trim();
    //     }
    // }

    generateUniqueSlug = (title) => {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

=======
>>>>>>> 2037050c91b1fe7ad972e42de68244346d65e721
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
<<<<<<< HEAD
    handleSeoDescChange = (e) => {
        this.setState({ seodescription: e.target.value });
    }
=======
>>>>>>> 2037050c91b1fe7ad972e42de68244346d65e721
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
<<<<<<< HEAD
        const { image, seo, seodescription, keywords, title, description, shortdescription, category, } = this.state;

        const slug = this.generateUniqueSlug(title);
        // console.log("uniqueSlug", uniqueSlug)

=======
        const { image, seo, keywords, title, description, shortdescription, category, } = this.state;
>>>>>>> 2037050c91b1fe7ad972e42de68244346d65e721
        const url = 'admin/cmsPost';

        const postData = {
            image,
            seo,
<<<<<<< HEAD
            seodescription,
=======
>>>>>>> 2037050c91b1fe7ad972e42de68244346d65e721
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

<<<<<<< HEAD
        this.setState({ image: "", title: "", description: "", category: "", seo: "", keywords: "", shortdescription: "", seodescription: "", })
=======
        this.setState({ image: "", title: "", description: "", category: "", seo: "", keywords: "", shortdescription: "" })

>>>>>>> 2037050c91b1fe7ad972e42de68244346d65e721
    };


    render() {
        const { image, categoryDate } = this.state;
<<<<<<< HEAD
        // console.log("category data all", categoryDate)

=======
        console.log("category data all", categoryDate)
>>>>>>> 2037050c91b1fe7ad972e42de68244346d65e721
        return (
            <React.Fragment>
                <Header />
                <div className="container">
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
<<<<<<< HEAD
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
=======
>>>>>>> 2037050c91b1fe7ad972e42de68244346d65e721
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
                                        {!image ? <img src={emptyImg} alt='...' style={{ maxWidth: "50%" }} /> : <img src={image} style={{ maxWidth: "70%" }} />}
                                        {/* {image && (
                                            <img src={image} style={{ maxWidth: "70%" }} />
                                        )} */}
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
                                        <label className="form-check-label" htmlFor="latestPost">Nature</label>
                                    </div>
                                    <div className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value="Sports"
                                            onChange={this.handleCheckboxChange}
                                            checked={this.state.category.includes("Sports")}
                                        />
                                        <label className="form-check-label" htmlFor="popularPost">Sports</label>
                                    </div>
                                    <div className="form-check mb-3">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value="Education"
                                            onChange={this.handleCheckboxChange}
                                            checked={this.state.category.includes("Education")}
                                        />
                                        <label className="form-check-label" htmlFor="CommentedPost">Education</label>
                                    </div> */}
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