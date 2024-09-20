import React, { useEffect, useState, useRef } from 'react';
import Footer from '../../components/common/Footer';
import Header from '../../components/community/common/Header';
import UserHeader from '../../components/user/common/Header';
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
import { NotFound } from '../../components/common/NotFound';
import { getPostsData } from '../../helpers/post-listing';
import Select from 'react-select';
import Picker from 'emoji-picker-react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { BannerIframe2 } from '../../components/common/BannerFrame';

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
    const [postStatus, setPostStatus] = useState('Followers');
    const [categoryOption, setCategoryOption] = useState([]);
    const [defaultCategoryOption, setDefaultCategoryOption] = useState({ label: 'All', value: '' })
    const [productOption, setProductOption] = useState([]);
    const [defaultProductOption, setDefaultProductOption] = useState({ label: 'Choose Product', value: '' })
    const [posts, setPosts] = useState([]);
    const [addMore, setAddMore] = useState(false);
    const [inputStr, setInputStr] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [postUpdateId, setPostUpdateId] = useState(null)
    const [selectFilterCategory, setSelectFilterCategory] = useState("");
    const [showMostLiked, setShowMostLiked] = useState(false);
    const [showMostCommented, setShowMostCommented] = useState(false);
    const [filteredData, setFilteredData] = useState(null);
    const [userType, setUserType] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState([]);
    const [blockedUser, setBlockedUser] = useState(null);
    const [followers, setFollowers] = useState(null);
    const [following, setFollowing] = useState(null);


    useEffect(() => {
        getUserorSellerData();
    }, [postsData, modalContent])

    const getUserorSellerData = async () => {
        setLoading(true);
        try {
            await axios
                .get(`/community/getUserorSellerData/${authInfo.id}`, {
                    headers: {
                        "content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        'Authorization': `Bearer ${authInfo.token}`
                    },
                })
                .then((response) => {
                    // console.log("response", response.data)
                    const data = response.data.data;
                    // console.log("blocked", data.blocked)

                    if (response.data.status === true) {
                        // setUserData(data);
                        setBlockedUser(data.blocked);
                        setFollowers(data.followers);
                        setFollowing(data.following);
                    }
                    // setUserData(data);
                })
                .catch((error) => {
                    console.log("Error", error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } catch (error) {
            console.log("Error", error);
            setLoading(false);
        }
    }

    const handleClick = (type) => {
        let data = [];
        switch (type) {
            case 'followers':
                data = followers !== null ? { type: 'followers', data: followers } : [];
                break;
            case 'following':
                data = following !== null ? { type: 'following', data: following } : [];
                break;
            case 'blockedUser':
                data = blockedUser !== null ? { type: 'blockedUser', data: blockedUser } : [];
                break;
            default:
                break;
        }
        console.log("under model data", data)
        setModalContent(data.data);
        setUserType(data.type)
        setShowModal(true);
    };

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
        // console.log("Image community : ", images)
        // console.log("Image community preview: ", previews)
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
    const createPost = async () => {
        setSelectFilterCategory("");
        setShowMostLiked(false);
        setShowMostCommented(false);
        // loadMoreItems();
        // console.log("authInfo Seller or User", authInfo.token);
        // console.log("postStatus", postStatus)
        const token = authInfo.token;
        setAddMore(false);
        let reqBody = {
            content: inputStr,
            category_id: categoryId,
            product_id: productId,
            post_status: postStatus,
            user_id: authInfo.id,
            seller_id: null,
            admin_id: null,
            is_seller: false,
            is_admin: false,
            parent_id: null
        };

        setInputStr('');

        try {
            dispatch(setLoading({ loading: true }));
            const postResponse = await axios.post('community/posts', reqBody, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (postResponse.data.status) {
                const postId = postResponse.data.data.id;
                const imageUploadPromises = images.map(async (image) => {
                    const formData = new FormData();
                    formData.append('file', image);
                    formData.append("upload_preset", "pay-earth-images");
                    formData.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);

                    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/image/upload`, {
                        method: "post",
                        body: formData
                    });

                    const data = await response.json();
                    if (data.secure_url) {
                        // console.log("image upload", data.secure_url);
                        return { url: data.secure_url };
                    } else {
                        throw new Error("Image upload failed");
                    }
                });

                const videoUploadPromises = videos.map(async (video) => {
                    const formData = new FormData();
                    formData.append('file', video);
                    formData.append("upload_preset", "pay-earth-images");
                    formData.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);

                    const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/video/upload`, {
                        method: "post",
                        body: formData
                    });

                    const data = await response.json();
                    if (data.secure_url) {
                        // console.log("video upload", data.secure_url);
                        return { url: data.secure_url };
                    } else {
                        throw new Error("Video upload failed");
                    }
                });

                const [imageUrls, videoUrls] = await Promise.all([
                    Promise.all(imageUploadPromises),
                    Promise.all(videoUploadPromises)
                ]);

                if (imageUrls.length > 0 && videoUrls.length > 0) {
                    await Promise.all([
                        axios.post(`community/postImages/${postId}`, { images: imageUrls }, {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json; charset=UTF-8',
                                'Authorization': `Bearer ${authInfo.token}`
                            }
                        }),
                        axios.post(`community/postVideos/${postId}`, { videos: videoUrls }, {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json; charset=UTF-8',
                                'Authorization': `Bearer ${authInfo.token}`
                            }
                        })
                    ]);
                } else {
                    if (imageUrls.length > 0) {
                        await axios.post(`community/postImages/${postId}`, { images: imageUrls }, {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json; charset=UTF-8',
                                'Authorization': `Bearer ${authInfo.token}`
                            }
                        });
                    }
                    if (videoUrls.length > 0) {
                        await axios.post(`community/postVideos/${postId}`, { videos: videoUrls }, {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json; charset=UTF-8',
                                'Authorization': `Bearer ${authInfo.token}`
                            }
                        });
                    }
                }
                getPostsData(dispatch);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setTimeout(() => {
                dispatch(setLoading({ loading: false }));
                setPreview([]);
                setVideoPreview([]);
                setImages([]);
                setVideos([]);
                setCategoryId(null);
                setProductId(null);
                setDefaultProductOption({ label: 'Choose Product', value: '' });
                setDefaultCategoryOption({ label: 'All', value: '' });
            }, 300);
        }
    };

    const getCategories = () => {
        dispatch(setLoading({ loading: true }))
        axios.get('community/front/categories').then(response => {
            if (response.data.status) {
                let res = response.data.data;
                dispatch(setPostCategories({ postCategories: res }));
                let catOptions = [{ label: 'All', value: '' }]
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
    const handleCategories = (selectedOption) => {
        console.log("HandleCategory select option", selectedOption)
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
    const handleProducts = (selectedOption) => {
        console.log("selectedProdOption", selectedOption)
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

    // const fetchNotification = async (userId, token) => {
    //     try {
    //         await axios
    //             .get(`/user/get-notification/${userId}`, {
    //                 headers: {
    //                     "content-type": "application/json",
    //                     "Access-Control-Allow-Origin": "*",
    //                     Authorization: `Bearer ${token}`,
    //                 },
    //             })
    //             .then((response) => {
    //                 const data = response.data.data;
    //                 setNotification(data);
    //                 setRead(data.some((item) => item.read === false));
    //             })
    //             .catch((error) => {
    //                 console.log("Error", error);
    //             })
    //             .finally(() => {
    //                 setLoading(false);
    //             });
    //     } catch (error) {
    //         console.log("Error", error);
    //         setLoading(false);
    //     }
    // };

    const handleEdit = (data) => {
        // console.log("Data for edit test ###$$#$$#$#$#", data)
        setIsUpdate(true);
        const selectedCatOption = {
            label: data.categoryId === null ? null : data.categoryId.categoryName,
            value: data.categoryId === null ? null : data.categoryId.id,
        }
        const selectedProOption = {
            label: data.productId === null ? null : data.productId.name,
            value: data.productId === null ? null : data.productId.id
        }
        handleCategories(selectedCatOption)
        handleProducts(selectedProOption)
        setInputStr(data.postContent)
        setPostStatus(data.postStatus)
        setPostUpdateId(data.id)
    }

    const updatPost = () => {
        var reqBody = {
            postId: postUpdateId,
            content: inputStr,
            category_id: categoryId,
            product_id: productId,
            post_status: postStatus,
        }

        axios.put(`community/updatePost`, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                toast.success(response.data.message);
                getPostsData(dispatch);
            }
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setTimeout(() => {
                setIsUpdate(false);
                setPostStatus('');
                setInputStr('');
                setCategoryId(null);
                setProductId(null);
                setDefaultProductOption({ label: 'Choose Product', value: '' });
                setDefaultCategoryOption({ label: 'All', value: '' });
            }, 300);
        });
    }

    const resetForm = () => {
        setInputStr('');
        setImages([]);
        setVideos([]);
        setPostStatus('Followers');
        // setShowPicker(false);
        setIsUpdate(false);
        setCategoryId(null);
        setProductId(null);
        setDefaultProductOption({ label: 'Choose Product', value: '' });
        setDefaultCategoryOption({ label: 'All', value: '' });
    };

    const handleFilterCategory = () => {
        setShowMostLiked(false);
        setShowMostCommented(false);
        const filtered = postsData.filter(item => item.categoryId && item.categoryId.id === selectFilterCategory || categoryId === null);
        const dataToShow = filtered.length === 0 ? postsData : filtered;
        setFilteredData(dataToShow);
    }

    const handleUnblockUser = async (data) => {
        console.log("data", data)
        const selectedUserId = data.id

        try {
            const authorId = authInfo.id
            const url = "community/communityUserUnblock";
            axios.put(url, { authorId, selectedUserId }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            }).then((response) => {
                if (response.data.status === true) {

                    getPostsData(dispatch);
                    toast.success("user unblocked..");
                    // getUserorSellerData();
                }
            }).catch((error) => {
                console.log("error", error)
            })

        } catch (error) {
            console.error('Error', error);
        }
    }




    return (
        <React.Fragment>
            {loading === true ? <SpinnerLoader /> : ''}

            <div className='seller_body'>
                <UserHeader />
                {/* <Header /> */}
                <div className="cumm_page_wrap pt-5 pb-5">
                    <div className="container" >
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="comm_profile">
                                    <div className="post_by">
                                        <Link to="/my-profile" className="pointer poster_img"><img src={userInfo.imgUrl} alt="" /></Link>
                                        <div className="poster_info">
                                            <div className="poster_name">{userInfo.name}</div>
                                        </div>
                                    </div>
                                    <ul>
                                        <li onClick={() => handleClick('followers')}>
                                            <div className="fp_fc">{followers !== null ? followers.length : "0"}</div>
                                            <small>Followers</small>
                                        </li>
                                        <li onClick={() => handleClick('following')}>
                                            <div className="fp_fc">{following !== null ? following.length : "0"}</div>
                                            <small>Following</small>
                                        </li>
                                        <li onClick={() => handleClick('blockedUser')}>
                                            <div className="fp_fc">{blockedUser !== null ? blockedUser.length : "0"}</div>
                                            <small>Blocked</small>
                                        </li>
                                    </ul>

                                    <Modal
                                        show={showModal}
                                        onHide={() => setShowModal(false)}
                                        size="md"
                                        aria-labelledby="contained-modal-title-vcenter"
                                        className='modal-dialog-scrollable'
                                    >
                                        {/* <Modal.Body> */}
                                        {modalContent.length > 0 ? (
                                            <ul>
                                                {modalContent.map((item, index) => <>
                                                    <div className="chat_user_item" key={index}>
                                                        <a href="#" className="d-flex align-items-center chatUser_info">
                                                            <div className="userInfo-col userThumb">
                                                                <div className="user_thumb">
                                                                    <img className="img-fluid" src={item.image_url} alt="user img" />
                                                                </div>

                                                            </div>
                                                            <div className="userInfo-col userInfo">
                                                                <h3>{item.name}</h3>
                                                            </div>

                                                            {userType === "blockedUser" ?
                                                                <button
                                                                    onClick={() => { handleUnblockUser(item) }}
                                                                >
                                                                    Unblock
                                                                </button> : ""}
                                                            {/* <button onClick={() => this.clickToAddUser(item)}>ADD</button> */}
                                                        </a>
                                                    </div>
                                                </>
                                                )}
                                            </ul>
                                        ) : (
                                            <p>No users found</p>
                                        )}

                                    </Modal>
                                </div>
                            </div>
                            <div className="col-lg-9">
                                <div className="createpost bg-white rounded-3">
                                    <div className="cp_top d-flex justify-content-between align-items-center">
                                        <div className="cumm_title">Create your post</div>
                                        {isUpdate && (
                                            <div className="close-icon" onClick={resetForm}>
                                                <button type="button" class="btn-close" aria-label="Close"></button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="cp_body">
                                        <div className="com_user_acc">
                                            <Link to='/community-profile'>
                                                <div className="com_user_img"><img src={userInfo.imgUrl !== null && userInfo.imgUrl !== '' ? config.apiURI + userInfo.imgUrl : userImg} alt="" /></div>
                                            </Link>
                                            <div className="com_user_name">
                                                <div className="cu_name">{userInfo.name}</div>
                                                <select
                                                    value={postStatus}
                                                    onChange={e => setPostStatus(e.target.value)}
                                                    className="form-select" name="" id="">
                                                    <option value="Followers">Followers</option>
                                                    <option value="Public">Public</option>
                                                    {/* <option value="2">Only Me</option> */}
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
                                                {!isUpdate && (
                                                    <>
                                                        <div className="cp_upload_btn cp_upload_img">
                                                            <input type="file" id="post_img" accept="image/*" multiple={true} onChange={(event) => handlePreview(event)} />
                                                        </div>
                                                        <div className="cp_upload_btn cp_upload_video">
                                                            <input type="file" id='post_video' accept="video/*" multiple onChange={(event) => handleVideoPreview(event)} />
                                                        </div>
                                                    </>
                                                )}
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
                                                    className="sort_select text-normal"
                                                    options={productOption}
                                                    value={defaultProductOption}
                                                    onChange={selectedOption => {
                                                        handleProducts(selectedOption)
                                                    }}
                                                />
                                            </div>
                                            {isUpdate === true ? <button className="btn custom_btn btn_yellow mx-auto" onClick={updatPost}> Update</button> : <button className="btn custom_btn btn_yellow mx-auto" onClick={() => createPost()} disabled={!inputStr.trim() && images.length === 0 && videos.length === 0 ? true : false} >Post</button>}
                                            {/* <button className="btn custom_btn btn_yellow mx-auto" onClick={() => createPost()} disabled={!inputStr.trim() && images.length === 0 && videos.length === 0 ? true : false} >Post</button> */}
                                        </div>
                                    </div>
                                </div>

                                {
                                    filteredData === null ? (
                                        postsData.length > 0 ? (
                                            <div>
                                                {[...postsData]
                                                    .sort((a, b) => {
                                                        if (showMostLiked && showMostCommented) {
                                                            return b.likeCount - a.likeCount || b.commentCount - a.commentCount;
                                                        } else if (showMostLiked) {
                                                            return b.likeCount - a.likeCount;
                                                        } else if (showMostCommented) {
                                                            return b.commentCount - a.commentCount;
                                                        } else {
                                                            return 0; // No sorting
                                                        }
                                                    })
                                                    .map((value, index) => (
                                                        <Post key={index} posts={value} sendEditData={handleEdit} />
                                                    ))}
                                            </div>
                                        )
                                            : (
                                                <NotFound msg="Data not found." />
                                            )
                                    ) : (
                                        filteredData.length > 0 ? (
                                            <div>
                                                {[...filteredData]
                                                    .sort((a, b) => {
                                                        if (showMostLiked && showMostCommented) {
                                                            return b.likeCount - a.likeCount || b.commentCount - a.commentCount;
                                                        } else if (showMostLiked) {
                                                            return b.likeCount - a.likeCount;
                                                        } else if (showMostCommented) {
                                                            return b.commentCount - a.commentCount;
                                                        } else {
                                                            return 0; // No sorting
                                                        }
                                                    })
                                                    .map((value, index) => (
                                                        <Post key={index} posts={value} sendEditData={handleEdit} />
                                                    ))}
                                            </div>
                                        ) : (
                                            <NotFound msg="Data not found." />
                                        )
                                    )
                                }
                            </div >

                            {/* Filter */}
                            <div className="col-lg-3">
                                <div className="cumm_sidebar_box bg-white p-3 rounded-3">
                                    <div className="cumm_title">advanced filter</div>
                                    <div className="filter_box">
                                        <select
                                            className="form-select mb-3"
                                            aria-label="Default select example"
                                            onChange={(e) => setSelectFilterCategory(e.target.value)}
                                            value={selectFilterCategory}
                                        >
                                            {categoryOption.map(category => (
                                                <option key={category.value} value={category.value} >
                                                    {category.label}
                                                </option>
                                            ))}
                                        </select>

                                        <div className="form-check mb-3">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                value=""
                                                id="popularPost"
                                                checked={showMostLiked}
                                                onChange={(e) => {
                                                    setShowMostLiked(e.target.checked);
                                                    setShowMostCommented(false);
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor="popularPost">
                                                Most Popular Post
                                            </label>
                                        </div>
                                        <div className="form-check mb-3">
                                            <input
                                                className="form-check-input"
                                                type="radio"
                                                value=""
                                                id="CommentedPost"
                                                checked={showMostCommented}
                                                onChange={(e) => {
                                                    setShowMostCommented(e.target.checked)
                                                    setShowMostLiked(false);
                                                }}
                                            />
                                            <label className="form-check-label" htmlFor="CommentedPost">
                                                Most Commented Post
                                            </label>
                                        </div>

                                        <div className="filter_btn_box">
                                            <Link
                                                to="#"
                                                className="btn custom_btn btn_yellow_bordered"
                                                onClick={handleFilterCategory}
                                            >
                                                Filter
                                            </Link>
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