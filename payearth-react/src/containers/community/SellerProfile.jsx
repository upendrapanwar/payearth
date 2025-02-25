import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import Footer from '../../components/common/Footer';
import Header from '../../components/seller/common/Header';
import userImg from '../../assets/images/user.png';
import imageEditIcon from '../../assets/icons/pencil-square-outline-icon.svg';
import { Link, useLocation } from 'react-router-dom';
import InputEmoji from 'react-input-emoji'
import Post from '../../components/community/common/Post';
import SellerPost from '../../components/community/common/SellerPost';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import { setLoading } from '../../store/reducers/global-reducer';
import { setPostCategories, setPostProducts } from '../../store/reducers/post-reducer';
import axios from 'axios';
import { useSelector } from 'react-redux';
import config from '../../config.json'
import { useDispatch } from 'react-redux';
import { NotFound } from '../../components/common/NotFound';
import { getSellerPostsData } from '../../helpers/sellerPost-listing';
import Select from 'react-select';
import Picker from 'emoji-picker-react';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import PageTitle from './../../components/user/common/PageTitle';
import { BannerIframe2 } from '../../components/common/BannerFrame';
import { Modal } from 'react-bootstrap';
import arrow_back from './../../assets/icons/arrow-back.svg'


const SellerProfile = () => {
    const userInfo = useSelector(state => state.auth.userInfo);
    const authInfo = useSelector(state => state.auth.authInfo);
    const loading = useSelector(state => state.global.loading);
    const AllSellerPostsData = useSelector(state => state.post.SellerPostsData);
    const SellerPostsData = AllSellerPostsData.filter(post => post.sellerId && post.sellerId._id === authInfo.id);
    const cloudName = process.env.REACT_APP_CLOUD_NAME;
    // console.log("Posts Seller-----====-", AllSellerPostsData)
    // console.log("Posts Seller-----====-", SellerPostsData)
    const postCategories = useSelector(state => state.post.postCategories);
    const postProducts = useSelector(state => state.post.postProducts);
    const dispatch = useDispatch();
    const location = useLocation();
    const postRefs = useRef({});
    const searchParams = new URLSearchParams(location.search);
    const postId = searchParams.get("postId");

    const [text, setText] = useState('');
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [preview, setPreview] = useState([]);
    const [videoPreview, setVideoPreview] = useState([]);
    const [productId, setProductId] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [postStatus, setPostStatus] = useState('Followers');
    const [categoryOption, setCategoryOption] = useState([]);
    const [defaultCategoryOption, setDefaultCategoryOption] = useState({ label: 'All Category', value: '' })
    const [productOption, setProductOption] = useState([]);
    const [defaultProductOption, setDefaultProductOption] = useState({ label: 'Choose Product', value: '' })
    const [posts, setPosts] = useState([]);
    const [addMore, setAddMore] = useState(false);
    const [inputStr, setInputStr] = useState('');
    const [showPicker, setShowPicker] = useState(false);
    const [isUpdate, setIsUpdate] = useState(false);
    const [postUpdateId, setPostUpdateId] = useState(null)
    const [selectFilterCategory, setSelectFilterCategory] = useState(null);
    const [showMostLiked, setShowMostLiked] = useState(false);
    const [showMostCommented, setShowMostCommented] = useState(false);
    const [filteredData, setFilteredData] = useState(SellerPostsData);
    const [showModal, setShowModal] = useState(false);
    const [AccountshowModal, setAccountShowModal] = useState(false);
    // const [profileImage, setProfileImage] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [image, setImage] = useState('');
    const [userType, setUserType] = useState(null);
    const [modalContent, setModalContent] = useState([]);
    const [blockedUser, setBlockedUser] = useState([]);
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);


    useEffect(() => {
        getSellerPostsData(dispatch);
        getCategories();
    }, []);

    useEffect(() => {
        //console.log("Post ID from URL:", postId);
        if (postId) {
            setTimeout(() => {
                if (postRefs.current[postId]) {
                    //console.log("Post not found in postRefs:", postRefs);
                    // console.log("Scrolling to post:", postId);
                    postRefs.current[postId].scrollIntoView({ behavior: "smooth" });
                } else {
                    console.log("Post not found in postRefs:", postRefs);
                }
            }, 300);
        }
    }, [postId]);

    const handleShow = () => setShowModal(true);
    const handleClose = () => setShowModal(false);

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
        const token = authInfo.token;
        setAddMore(false);
        let reqBody = {
            content: inputStr,
            category_id: categoryId,
            product_id: productId,
            post_status: postStatus,
            user_id: null,
            seller_id: authInfo.id,
            admin_id: null,
            is_seller: true,
            is_admin: false,
            parent_id: null,
            postImages: images,
            postVideos: videos,
        };


        setInputStr('');
        try {
            dispatch(setLoading({ loading: true }));
            const postResponse = await axios.post('/seller/posts', reqBody, {
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
                        axios.post(`seller/postImages/${postId}`, { images: imageUrls }, {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json; charset=UTF-8',
                                'Authorization': `Bearer ${authInfo.token}`
                            }
                        }),
                        axios.post(`seller/postVideos/${postId}`, { videos: videoUrls }, {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json; charset=UTF-8',
                                'Authorization': `Bearer ${authInfo.token}`
                            }
                        })
                    ]);
                } else {
                    if (imageUrls.length > 0) {
                        await axios.post(`seller/postImages/${postId}`, { images: imageUrls }, {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json; charset=UTF-8',
                                'Authorization': `Bearer ${authInfo.token}`
                            }
                        });
                    }
                    if (videoUrls.length > 0) {
                        await axios.post(`seller/postVideos/${postId}`, { videos: videoUrls }, {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json; charset=UTF-8',
                                'Authorization': `Bearer ${authInfo.token}`
                            }
                        });
                    }
                }
                getSellerPostsData(dispatch);
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
                setDefaultCategoryOption({ label: 'All Category', value: '' });
            }, 300);
        }
    };

    const getCategories = () => {
        dispatch(setLoading({ loading: true }))
        axios.get('community/front/categories').then(response => {
            if (response.data.status) {
                let res = response.data.data;
                dispatch(setPostCategories({ postCategories: res }));
                let catOptions = [{ label: 'All Category', value: '' }]
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
    const handleCategories = (selectedOption) => {
        // console.log("HandleCategory select option", selectedOption)
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
    const handleProducts = (selectedOption) => {
        // console.log("selectedProdOption", selectedOption)
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


    const handleEdit = (data) => {
        //console.log("Data for edit test ###$$#$$#$#$#", data)
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

        axios.put(`seller/updatePost`, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                toast.success(response.data.message);
                getSellerPostsData(dispatch);
            }
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setTimeout(() => {
                // dispatch(setLoading({ loading: false }));
                // setPreview([]);
                // setVideoPreview([]);
                // setImages([]);
                // setVideos([]);
                setIsUpdate(false);
                setPostStatus('');
                setInputStr('');
                setCategoryId(null);
                setProductId(null);
                setDefaultProductOption({ label: 'Choose Product', value: '' });
                setDefaultCategoryOption({ label: 'All Category', value: '' });
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
        setDefaultCategoryOption({ label: 'All Category', value: '' });
    };

    const handleFilterCategory = () => {
        setShowMostLiked(false);
        setShowMostCommented(false);
        const filtered = SellerPostsData.filter(item => item.categoryId && item.categoryId.id === selectFilterCategory || categoryId === null);
        const dataToShow = filtered.length === 0 ? SellerPostsData : filtered;
        setFilteredData(dataToShow);
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file.size <= 5242880) { // 5MB limit
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImageFile(null);
            setImage('');
            toast.error("Image size must be less than 5 MB", { autoClose: 3000 });
        }
    };

    const handleSave = async () => {
        if (!imageFile) {
            toast.error("Please select an image to upload", { autoClose: 3000 });
            return;
        }
        setLoading(true);

        const uploadImage = async () => {
            const formData = new FormData();
            formData.append("file", imageFile);
            formData.append("upload_preset", "pay-earth-images");
            formData.append("cloud_name", cloudName);
            // Upload new image
            try {
                const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
                    method: "POST",
                    body: formData
                });
                const data = await response.json();
                // console.log("Cloudinary response:", data);
                if (!data.secure_url || !data.public_id) {
                    throw new Error('Invalid response from Cloudinary');
                }
                return data;
            } catch (error) {
                console.error('Error uploading image:', error);
                throw new Error('Error uploading image');
            }
        };

        try {
            const imageData = await uploadImage();
            const formData = {
                image: imageData.secure_url,
                imageId: imageData.public_id,
            };

            // Save the image data to your database
            await axios.put(`seller/editProfileImage/${authInfo.id}`, formData, {
                headers: {
                    'Accept': 'application/form-data',
                    'Content-Type': 'application/json; charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            });
            toast.success("Image uploaded successfully", { autoClose: 3000 });
            setImage('');
            setImageFile(null);
        } catch (error) {
            toast.error("Image upload failed at database . Please try again.", { autoClose: 3000 });
        } finally {
            setLoading(false);
        }
        handleClose();
    };

    useEffect(() => {
        let isMounted = true;
        const getUserorSellerData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/seller/getUserorSellerData/${authInfo.id}`, {
                    headers: {
                        "content-type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                        'Authorization': `Bearer ${authInfo.token}`
                    },
                });

                if (isMounted && response.data.status === true) {
                    const data = response.data.data;
                    setBlockedUser(data.blocked);
                    setFollowers(data.followers);
                    setFollowing(data.following);
                }
            } catch (error) {
                if (isMounted) {
                    console.log("Error", error);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };
        getUserorSellerData();

        return () => {
            isMounted = false;
        };

    }, [SellerPostsData, modalContent])

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
        setModalContent(data.data);
        setUserType(data.type)
        setAccountShowModal(true);
    };

    const handleUnblockUser = async (data) => {
        const selectedUserId = data.id
        try {
            const authorId = authInfo.id
            const url = "seller/communityUserUnblock";
            axios.put(url, { authorId, selectedUserId }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            }).then((response) => {
                if (response.data.status === true) {
                    getSellerPostsData(dispatch);
                    toast.success("user unblocked..");
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
                <Header />
                <PageTitle title="Account" />
                <Helmet><title>{"Seller - Account - Pay Earth"}</title></Helmet>
                <div className="cumm_page_wrap pt-2 pb-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className='comm_profile'>
                                    <div className="post_by">
                                        <div className="poster_img position-relative d-inline-block">
                                            {/* User profile image */}
                                            <img
                                                src={userInfo.imgUrl && userInfo.imgUrl.trim() !== "" ? userInfo.imgUrl : userImg}
                                                alt=""
                                                className="img-fluid"
                                            />
                                        </div>
                                        <div className="poster_info">
                                            <div className="poster_name">{userInfo.name}</div>
                                            <small>{userInfo.role}</small>
                                        </div>
                                    </div>
                                    <ul className='text-center'>
                                        <li className="w-25" onClick={() => handleClick('followers')}>
                                            <div className="fp_fc">{followers !== null ? followers.length : "0"}</div>
                                            <small>Followers</small>
                                        </li>
                                        <li className="w-25" onClick={() => handleClick('following')}>
                                            <div className="fp_fc">{following !== null ? following.length : "0"}</div>
                                            <small>Following</small>
                                        </li>
                                        <li className="w-25" onClick={() => handleClick('blockedUser')}>
                                            <div className="fp_fc">{blockedUser !== null ? blockedUser.length : "0"}</div>
                                            <small>Blocked</small>
                                        </li>
                                        <li className="w-25" >
                                            <div className="fp_fc">{SellerPostsData.length}</div>
                                            <small>Posts</small>
                                        </li>
                                    </ul>

                                    <Modal
                                        show={AccountshowModal}
                                        onHide={() => setAccountShowModal(false)}
                                        size="md"
                                        aria-labelledby="contained-modal-title-vcenter"
                                        className='modal-dialog-scrollable'
                                    >
                                        {/* <Modal.Body> */}
                                        {modalContent.length > 0 ? (
                                            <ul>
                                                {modalContent.map((item, index) => <>
                                                    <div className="chat_user_item" key={item.id || index}>
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

                                    <div className=''>
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

                            {/* Filter */}
                            <div className="col-lg-12 mb-3">
                                <div className="cumm_sidebar_box bg-white p-3 rounded-3">
                                    <div className="cumm_title">advanced filter</div>
                                    <div className="filter_box">
                                        <div className='d-flex flex-row'>
                                            <select
                                                className="form-select mb-3 me-4 w-auto"
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

                                            <div className="form-check mt-3 me-4">
                                                <input
                                                    className="form-check-input border-warning"
                                                    type="radio"
                                                    value=""
                                                    id="popularPost"
                                                    checked={showMostLiked}
                                                    onChange={(e) => {
                                                        setShowMostLiked(e.target.checked);
                                                        setShowMostCommented(false);
                                                    }}
                                                />
                                                <label className="form-check-label mt-1" htmlFor="popularPost">
                                                    Most Popular Post
                                                </label>
                                            </div>
                                            <div className="form-check mt-3 me-4">
                                                <input
                                                    className="form-check-input border-warning"
                                                    type="radio"
                                                    value=""
                                                    id="CommentedPost"
                                                    checked={showMostCommented}
                                                    onChange={(e) => {
                                                        setShowMostCommented(e.target.checked);
                                                        setShowMostLiked(false);
                                                    }}
                                                />
                                                <label className="form-check-label mt-1" htmlFor="CommentedPost">
                                                    Most Commented Post
                                                </label>
                                            </div>

                                            <div className="filter_btn_box ms-4">
                                                <Link
                                                    to="#"
                                                    className="btn custum_back_btn btn_yellow"
                                                    onClick={handleFilterCategory}
                                                >
                                                    Filter
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-12">
                                {isUpdate && (
                                    <div className="createpost bg-white rounded-3">
                                        <div className="cp_top  d-flex justify-content-between align-items-center">
                                            <div className="cumm_title">Create your post</div>
                                            {isUpdate && (
                                                <div className="close-icon" onClick={resetForm}>
                                                    <button type="button" className="btn-close" aria-label="Close"></button>
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
                                                {isUpdate === true && <button className="btn custom_btn btn_yellow mx-auto" onClick={updatPost}> Update</button>}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {
                                    filteredData === null ? (
                                        SellerPostsData.length > 0 ? (
                                            <div>
                                                {[...SellerPostsData]
                                                    .sort((a, b) => {
                                                        if (showMostLiked && showMostCommented) {
                                                            return b.likeCount - a.likeCount || b.comments.length - a.comments.length;
                                                        } else if (showMostLiked) {
                                                            return b.likeCount - a.likeCount;
                                                        } else if (showMostCommented) {
                                                            return b.comments.length - a.comments.length;
                                                        } else {
                                                            return 0; // No sorting
                                                        }
                                                    })
                                                    .map((value, index) => (
                                                        <SellerPost key={index} posts={value} sendEditData={handleEdit} />
                                                    ))}
                                            </div>
                                        ) : (
                                            <NotFound msg="Data not found." />
                                        )
                                    ) : (
                                        filteredData.length > 0 ? (
                                            <div>
                                                {[...filteredData]
                                                    .sort((a, b) => {
                                                        if (showMostLiked && showMostCommented) {
                                                            return b.likeCount - a.likeCount || b.comments.length - a.comments.length;
                                                        } else if (showMostLiked) {
                                                            return b.likeCount - a.likeCount;
                                                        } else if (showMostCommented) {
                                                            return b.comments.length - a.comments.length;
                                                        } else {
                                                            return 0; // No sorting
                                                        }
                                                    })
                                                    // .map((value, index) => (
                                                    //     <SellerPost key={index} posts={value} sendEditData={handleEdit} />
                                                    // ))}

                                                    .map((value, index) => {
                                                        // console.log('value------%^&%$%&', value);
                                                        return (
                                                            <SellerPost key={value._id} posts={value} sendEditData={handleEdit} ref={(el) => {
                                                                postRefs.current[value._id] = el;
                                                                //console.log(`Assigned ref for post ID: ${value._id}`, el);
                                                            }} />
                                                        );
                                                    })
                                                }
                                            </div>
                                        ) : (
                                            <NotFound msg="Data not found." />
                                        )
                                    )
                                }

                            </div>

                        </div>
                    </div>
                </div>

                {/* Modal */}
                <div className={`modal fade ${showModal ? 'show d-block' : ''}`} tabIndex="-1" aria-labelledby="editImageModalLabel" aria-hidden={!showModal}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="editImageModalLabel">Edit Image</h5>
                                <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="mb-3">
                                        <label htmlFor="imageUpload" className="form-label">Upload New Image</label>
                                        {/* <input className="form-control" type="file" id="imageUpload" /> */}
                                        <div className='text-center formImage-pannel'>
                                            {image ? <img src={image} alt='Preview' className="img-fluid" /> : <p>No image selected</p>}
                                        </div>
                                        <div className='formImageInput'>
                                            <input
                                                className="form-control mb-2"
                                                style={{ height: "60px" }}
                                                type="file"
                                                name="featuredImg"
                                                accept="image/*"
                                                // value={values.featuredImg}
                                                // value={this.state.featuredImg}
                                                // onChange={(event) => {
                                                //     handleChange("featuredImg")(event);
                                                //     this.handleImageChange(event);
                                                // }}
                                                onChange={handleImageChange}
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={handleSave}>Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        </React.Fragment >
    );
}

export default SellerProfile;