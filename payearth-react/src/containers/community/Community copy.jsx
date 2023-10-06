import React, { useEffect, useState } from 'react';
import Footer from '../../components/common/Footer';
import Header from '../../components/community/common/Header';
import userImg from '../../assets/images/user_img.png'
import { Link } from 'react-router-dom';
import InputEmoji from 'react-input-emoji'
import PostListing from '../../components/community/common/PostListing';
import Post from '../../components/community/common/Post';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import { setLoading } from '../../store/reducers/global-reducer';
import { setPostsData } from '../../store/reducers/post-reducer';
import axios from 'axios';
import { useSelector } from 'react-redux';
import config from '../.././config.json'
import { useDispatch } from 'react-redux';
import NotFound from '../../components/common/NotFound';


// var postData=[];
const Community = () => {
    const userInfo = useSelector(state => state.auth.userInfo);
    const authInfo = useSelector(state => state.auth.authInfo);
    const loading = useSelector(state => state.global.loading);
    const dispatch = useDispatch();

    const [text, setText] = useState('');
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [preview, setPreview] = useState([]);
    const [videoPreview, setVideoPreview] = useState([]);
    const [posts, setPosts] = useState([]);
    const [addMore, setAddMore] = useState(false);
    // const [post, setPost] = useState('');

    const handlePreview = (event) => {
        let previews = [];
        let images = [];
        for (let i = 0; i < event.target.files.length; i++) {
            previews.push(URL.createObjectURL(event.target.files[i]));
            images.push(event.target.files[i]);
        }
        setPreview(previews);
        setImages(images);
    };
    const handleVideoPreview = (event) => {
        let videoPreviews = [];
        let videos = [];
        for (let i = 0; i < event.target.files.length; i++) {
            videoPreviews.push(URL.createObjectURL(event.target.files[i]));
            videos.push(event.target.files[i]);
        }
        setVideoPreview(videoPreviews);
        setVideos(videos);

    };
    const createPost = () => {
        setAddMore(false);
        let reqBody = {};
        if (userInfo.role === 'user') {
            reqBody = {
                content: text,
                category_id: null,
                product_id: null,
                user_id: authInfo.id,
                seller_id: null,
                is_seller: false,
                parent_id: null
            }
        }
        else {
            reqBody = {
                content: text,
                category_id: null,
                product_id: null,
                user_id: null,
                seller_id: authInfo.id,
                is_seller: true,
                parent_id: null
            }
        }
        setText('');
        let imagesFormData = new FormData();
        images.forEach((value) => {
            imagesFormData.append('images', value);
        });
        let videoFormData = new FormData();
        videos.forEach((val) => {
            videoFormData.append('videos', val);
        })
        dispatch(setLoading({ loading: true }))
        axios.post('community/posts', reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                let res = response.data.data;
                // for post images
                if (images.length !== 0) {
                    axios.post(`community/postImages/${res.id}`, imagesFormData, {
                        headers: {
                            'Accept': 'application/form-data',
                            'Content-Type': 'application/json; charset=UTF-8',
                            'Authorization': `Bearer ${authInfo.token}`
                        }
                    }).then(response => {
                        if (response.data.status) {
                            getPosts();
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                }
                // for post videos
                if (videos.length !== 0) {
                    axios.post(`community/postVideos/${res.id}`, videoFormData, {
                        headers: {
                            'Accept': 'application/form-data',
                            'Content-Type': 'application/json; charset=UTF-8',
                            'Authorization': `Bearer ${authInfo.token}`
                        }
                    }).then(response => {
                        if (response.data.status) {
                            getPosts();
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                }
                if (images.length === 0 || videos.length === 0) {
                    getPosts();
                }
            }
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({ loading: false }));
                setPreview([])
                setVideoPreview([]);
            }, 300);
        });
    }
    const getPosts = () => {
        // postData=[];
        dispatch(setLoading({ loading: true }))
        axios.get('community/front/posts').then(response => {
            if (response.data.status) {
                let res = response.data.data;
                // res.forEach(post => {
                //     postData.push({
                //         commentCount:post.commentCount
                //     });
                // });
                setPosts(res);
                // dispatch(setPostsData({postsData:res}));
            }
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }
    useEffect(() => {
        getPosts();
        return () =>{
            getPosts();
        }
    }, []);
    return (
        <React.Fragment>
            {loading === true ? <SpinnerLoader /> : ''}
            <div className='seller_body'>
                <Header />
                <div className="cumm_page_wrap pt-5 pb-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-9">
                                <div className="createpost bg-white rounded-3">
                                    <div className="cp_top">
                                        <div className="cumm_title">Create your post</div>
                                    </div>
                                    <div className="cp_body">
                                        <div className="com_user_acc">
                                            <Link to='/community-profile'>
                                                <div className="com_user_img"><img src={userInfo.imgUrl !== null && userInfo.imgUrl !== '' ? config.apiURI + userInfo.imgUrl : userImg} alt="" /></div>
                                            </Link>
                                            <div className="com_user_name">
                                                <div className="cu_name">{userInfo.name}</div>
                                                <select className="form-select" aria-label="Default select example">
                                                    <option >Followers</option>
                                                    <option value="1">Public</option>
                                                    <option value="2">Only Me</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="create_post_input">
                                            {/* <div>
                                                <input type="text" className='form-control post_title' placeholder='Enter title' />
                                            </div> */}
                                            <InputEmoji
                                                value={text}
                                                onChange={setText}
                                                placeholder="What is on your mind ?"
                                            />
                                        </div>
                                    </div>
                                    <div className='cp_box'>
                                        <div className='d-flex justify-content-center'>
                                            <button className="btn  add_more_post" onClick={() => setAddMore(!addMore)}>{addMore ? 'Hide' : 'Add more to post'}</button>
                                        </div>
                                        <div className={`cp_foot ${addMore ? '' : 'd-none'}`}>
                                            <div>
                                                <div className="cp_upload_btn cp_upload_img">
                                                    <input type="file" id="post_img" accept="image/*" multiple={true} onChange={(event) => handlePreview(event)} />
                                                </div>
                                                <div className='mb-2 mt-2 img_preview'>
                                                    <ul className="load_imgs ">
                                                        {preview.map((value, index) => {
                                                            return <li key={index}>
                                                                <img className='me-2' src={value} alt='..' />
                                                            </li>
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="cp_upload_btn cp_upload_video">
                                                    <input type="file" id='post_video' accept="video/*" multiple onChange={(event) => handleVideoPreview(event)} />
                                                </div>
                                                <div className='mb-2 mt-2 video_preview'>
                                                    <ul className="load_imgs">
                                                        {videoPreview.map((value, index) => {
                                                            return <li key={index}>
                                                                <video controls>
                                                                    <source src={value} type="video/mp4" />
                                                                </video>
                                                            </li>
                                                        })}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div>
                                                {/* <label htmlFor="" className="form-label">Select Category</label> */}
                                                <select className="form-select form-select-lg cp_select mb-3" aria-label=".form-select-lg example">
                                                    <option >Select Category</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </div>
                                            <div>
                                                {/* <label htmlFor="" className="form-label">Select Product</label> */}
                                                <select className="form-select form-select-lg cp_select mb-3" aria-label=".form-select-lg example">
                                                    <option >Select Product</option>
                                                    <option value="1">One</option>
                                                    <option value="2">Two</option>
                                                    <option value="3">Three</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className='cp_post mx-auto'>
                                            <button className="btn custom_btn btn_yellow" onClick={() => createPost()} disabled={!text.trim() && images.length === 0 && videos.length === 0 ? true : false} >Post</button>
                                        </div>
                                    </div>
                                </div>
                                {
                                    posts.length > 0 ?
                                        <div>
                                            {posts.map((value, index) => {
                                                return (
                                                    <Post key={index} posts={value} />
                                                )
                                            })}
                                        </div>
                                        : <NotFound msg="Data not found." />
                                }
                                {/* <PostListing/> */}
                            </div>
                            <div className="col-lg-3">
                                <div className="cumm_sidebar_box bg-white p-3 rounded-3">
                                    <div className="cumm_title">advanced filter</div>
                                    <div className="filter_box">
                                        <select className="form-select mb-3" aria-label="Default select example">
                                            <option >Product</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </select>
                                        <select className="form-select mb-3" aria-label="Default select example">
                                            <option >Category</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </select>
                                        <div className="form-check mb-3 mt-4">
                                            <input className="form-check-input" type="checkbox" value="" id="latestPost" />
                                            <label className="form-check-label" htmlFor="latestPost">
                                                Latest Post
                                            </label>
                                        </div>
                                        <div className="form-check mb-3">
                                            <input className="form-check-input" type="checkbox" value="" id="popularPost" />
                                            <label className="form-check-label" htmlFor="popularPost">
                                                Most Popular Post
                                            </label>
                                        </div>
                                        <div className="form-check mb-3">
                                            <input className="form-check-input" type="checkbox" value="" id="CommentedPost" />
                                            <label className="form-check-label" htmlFor="CommentedPost">
                                                Most Commented Post
                                            </label>
                                        </div>

                                        <div className="filter_btn_box">
                                            <Link to="#" className="btn custom_btn btn_yellow_bordered">Filter</Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </React.Fragment>
    );
}

export default Community;