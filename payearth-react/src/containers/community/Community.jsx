import React, { useEffect, useState } from 'react';
import Footer from '../../components/common/Footer';
import Header from '../../components/community/common/Header';
import userImg from '../../assets/images/user.png'
import { Link } from 'react-router-dom';
import InputEmoji from 'react-input-emoji'
import Post from '../../components/community/common/Post';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import { setLoading } from '../../store/reducers/global-reducer';
import { setPostCategories, setPostProducts } from '../../store/reducers/post-reducer';
import axios from 'axios';
import { useSelector } from 'react-redux';
import config from '../.././config.json'
import { useDispatch } from 'react-redux';
import NotFound from '../../components/common/NotFound';
import { getPostsData } from '../../helpers/post-listing';
import Select from 'react-select';
import Picker from 'emoji-picker-react';

const Community = () => {
    const userInfo = useSelector(state => state.auth.userInfo);
    const authInfo = useSelector(state => state.auth.authInfo);
    const loading = useSelector(state => state.global.loading);
    const postsData = useSelector(state => state.post.postsData);
    const postCategories = useSelector(state => state.post.postCategories);
    const postProducts = useSelector(state => state.post.postProducts);
    const dispatch = useDispatch();

    const [text, setText] = useState('');
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [preview, setPreview] = useState([]);
    const [videoPreview, setVideoPreview] = useState([]);
    const [productId, setProductId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [categoryOption, setCategoryOption] = useState([]);
    const [defaultCategoryOption, setDefaultCategoryOption] = useState({ label: 'Choose Category', value: '' })
    const [productOption, setProductOption] = useState([]);
    const [defaultProductOption, setDefaultProductOption] = useState({ label: 'Choose Product', value: '' })
    const [posts, setPosts] = useState([]);
    const [addMore, setAddMore] = useState(false);
    const [inputStr, setInputStr] = useState('');
    const [showPicker, setShowPicker] = useState(false);

    const onEmojiClick = (event, emojiObject) => {
        setInputStr(prevInput => prevInput + emojiObject.emoji);
        setShowPicker(false);
    };


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
    const deleteImgPreview = (img) => {
        let index = preview.indexOf(img)
        preview.splice(index, 1);
        images.splice(index, 1);
    };
    const handleVideoPreview = (event) => {
        let videoPreviews = [];
        let video = [];
        for (let i = 0; i < event.target.files.length; i++) {
            videoPreviews.push(URL.createObjectURL(event.target.files[i]));
            video.push(event.target.files[i]);
        }
        setVideoPreview(videoPreviews);
        setVideos(video);
        // console.log(video);

    };
    const deleteVideoPreview = (vid) => {
        let videoPreviews = [...videoPreview];
        let video = [...videos];
        let index = videoPreview.indexOf(vid)
        videoPreviews.splice(index, 1);
        video.splice(index, 1);
        setVideoPreview([]);
        setVideos([]);
        setTimeout(() => {
            setVideoPreview(videoPreviews);
            setVideos(video);

        }, 0.001);
    }
    const createPost = () => {
        setAddMore(false);
        let reqBody = {};
        if (userInfo.role === 'user') {
            reqBody = {
                content: inputStr,
                category_id: categoryId,
                product_id: productId,
                user_id: authInfo.id,
                seller_id: null,
                is_seller: false,
                parent_id: null
            }
        }
        else {
            reqBody = {
                content: inputStr,
                category_id: categoryId,
                product_id: productId,
                user_id: null,
                seller_id: authInfo.id,
                is_seller: true,
                parent_id: null
            }
        }
        setInputStr('');
        let imagesFormData = new FormData();
        images.forEach((value) => {
            imagesFormData.append('images', value);
        });
        let videoFormData = new FormData();
        videos.forEach((val) => {
            videoFormData.append('videos', val);
        })
        // console.log(videos);
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
                            getPostsData(dispatch);
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
                            getPostsData(dispatch);
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                }
                if (images.length === 0 || videos.length === 0) {
                    getPostsData(dispatch);
                }
            }
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({ loading: false }));
                setPreview([])
                setVideoPreview([]);
                setImages([]);
                setVideos([]);
                setCategoryId(null);
                setProductId(null);
                setDefaultProductOption({ label: 'Choose Product', value: '' });
                setDefaultCategoryOption({ label: 'Choose Category', value: '' });
                dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }
    const getCategories = () => {
        dispatch(setLoading({ loading: true }))
        axios.get('community/front/categories').then(response => {
            if (response.data.status) {
                let res = response.data.data;
                dispatch(setPostCategories({ postCategories: res }));
                let catOptions = [{ label: 'Choose Category', value: '' }]
                res.forEach((value) => {
                    catOptions.push({ label: value.categoryName, value: value.id });
                });
                setCategoryOption(catOptions);
            }
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }
    // const handleCategories = (event) => {
    //     getPostProducts(event.target.value);
    //     setCategoryId(event.target.value);
    // };
    const handleCategories = selectedOption => {
        setDefaultCategoryOption(selectedOption);
        setDefaultProductOption({ label: 'Choose Product', value: '' });
        setCategoryId(selectedOption.value);
        if (selectedOption.value !== '') {
            getPostProducts(selectedOption.value);
        }
        else {
            setProductOption([]);
        }
    }
    // const handleProducts = (event) => {
    //     setProductId(event.target.value);
    //     console.log(event.target.value);
    // }
    const handleProducts = selectedOption => {
        setDefaultProductOption(selectedOption);
        setProductId(selectedOption.value);
    }
    const getPostProducts = (catId) => {
        dispatch(setLoading({ loading: true }))
        axios.get(`community/front/products/${catId}`).then(response => {
            if (response.data.status) {
                let res = response.data.data;
                dispatch(setPostProducts({ postProducts: res }));
                let proOption = [{ label: 'Choose Product', value: '' }];
                res.forEach((value) => {
                    proOption.push({ label: value.name, value: value.id });
                });
                setProductOption(proOption);
            }
        }).catch(error => {
            console.log(error);
            dispatch(setPostProducts({ postProducts: [] }));
            setProductOption([]);
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    useEffect(() => {
        getPostsData(dispatch);
        getCategories();
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
                                            {/* <InputEmoji
                                                value={text}
                                                onChange={setText}
                                                placeholder="What is on your mind ?"
                                            /> */}
                                            <textarea
                                                className="input-style"
                                                value={inputStr}
                                                onChange={e => setInputStr(e.target.value)}
                                                placeholder="What's on your mind?"
                                                rows="4" cols="50"
                                            />
                                            <img
                                                className="emoji-icon"
                                                src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
                                                onClick={() => setShowPicker(val => !val)} />
                                            <div className='picker-container'>
                                                {showPicker && <Picker
                                                    pickerStyle={{ width: '100%' }}
                                                    onEmojiClick={onEmojiClick} />}
                                            </div>
                                        </div>
                                    </div>
                                    <div className='cp_box'>
                                        {/* <div className='d-flex justify-content-center'>
                                            <button className="btn  add_more_post" onClick={() => setAddMore(!addMore)}>{addMore ? 'Hide' : 'Add more to post'}</button>
                                        </div> */}
                                        <div className="cp_preview_box">
                                            <div className='mb-2 mt-2 video_preview'>
                                                <ul className="load_imgs">
                                                    {videoPreview.map((value, index) => {
                                                        return <li key={index}>
                                                            <Link to="#" className="delete_icon_btn" onClick={() => deleteVideoPreview(value)}><i className="fa fa-trash"></i></Link>
                                                            <video controls>
                                                                <source src={value} type="video/mp4" />
                                                            </video>
                                                        </li>
                                                    })}
                                                </ul>
                                            </div>

                                            <div className='mb-2 mt-2 img_preview'>
                                                <ul className="load_imgs ">
                                                    {preview.map((value, index) => {
                                                        return <li key={index}>
                                                            <Link to="#" className="delete_icon_btn" onClick={() => deleteImgPreview(value)}><i className="fa fa-trash"></i></Link>
                                                            <img className='me-2' src={value} alt='..' />
                                                        </li>
                                                    })}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className='cp_foot'>
                                            <div className={`cp_action_grp `}>
                                                <div className="cp_upload_btn cp_upload_img">
                                                    <input type="file" id="post_img" accept="image/*" multiple={true} onChange={(event) => handlePreview(event)} />
                                                </div>
                                                <div className="cp_upload_btn cp_upload_video">
                                                    <input type="file" id='post_video' accept="video/*" multiple onChange={(event) => handleVideoPreview(event)} />
                                                </div>
                                                {/* <select className="form-select form-select-lg cp_select mb-3" aria-label=".form-select category"  onChange={(event) => handleCategories(event)}>
                                                    {
                                                        postCategories.map((value, index) => {
                                                            return (
                                                                <option value={value.id} key={index}>{value.categoryName}</option>
                                                            )
                                                        })
                                                    }
                                                </select>
                                                <select  className="form-select form-select-lg cp_select mb-3" aria-label=".form-select Product" onChange={(event) => handleProducts(event)}>
                                                    {
                                                     postProducts.length>0?
                                                     postProducts.map((value,index)=>{
                                                        return(
                                                            <option value={value.id} >{value.name}</option>
                                                        )
                                                    })
                                                    :<option value='' >Products</option>  
                                                    }
                                                </select> */}
                                                <Select
                                                    className="sort_select text-normal "
                                                    options={categoryOption}
                                                    value={defaultCategoryOption}
                                                    onChange={selectedOption => {
                                                        handleCategories(selectedOption)
                                                    }}

                                                />
                                                <Select
                                                    className="sort_select text-normal "
                                                    options={productOption}
                                                    value={defaultProductOption}
                                                    onChange={selectedOption => {
                                                        handleProducts(selectedOption)
                                                    }}
                                                />
                                            </div>
                                            <button className="btn custom_btn btn_yellow mx-auto" onClick={() => createPost()} disabled={!inputStr.trim() && images.length === 0 && videos.length === 0 ? true : false} >Post</button>
                                        </div>
                                    </div>
                                </div>
                                {
                                    postsData.length > 0 ?
                                        <div>
                                            {postsData.map((value, index) => {
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
                                            <option >Category</option>
                                            <option value="1">One</option>
                                            <option value="2">Two</option>
                                            <option value="3">Three</option>
                                        </select>
                                        <select className="form-select mb-3" aria-label="Default select example">
                                            <option >Product</option>
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