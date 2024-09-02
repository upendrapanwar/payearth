import React, { useRef, useState } from 'react';
import userImg from '../../../assets/images/user.png'
import closeIcon from '../../../assets/icons/close_icon.svg'
import post from '../../../assets/images/posts/post_img.jpg'
import { Link } from 'react-router-dom';
import config from '../../../config.json'
import videoPlay from '../../../assets/icons/video_play_icon.svg'
import redHeartIcon from '../../../assets/icons/red-heart-icon-filled.svg'
import heartIconBordered from '../../../assets/icons/heart-icon-bordered.svg';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import SpinnerLoader from '../../../components/common/SpinnerLoader';
import SimpleImageSlider from "react-simple-image-slider";
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'
import { useLocation } from 'react-router-dom';

import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'

// TimeAgo.addDefaultLocale(en)
// TimeAgo.addLocale(ru)


const SellerSharePostData = () => {
    const location = useLocation();
    const urlPath = location.pathname;
    const parts = urlPath.split('/');
    const postId = parts[parts.length - 1];
    const authInfo = useSelector(state => state.auth.authInfo);
    const userInfo = useSelector(state => state.auth.userInfo);
    const [loading, setLoading] = useState(true);
    const [posts, setSharePost] = useState();

    // const [commentsArr, setCommentsArr] = useState(posts.comments);
    const [commentsArr, setCommentsArr] = useState();
    const [newCommentsArr, setNewCommentsArr] = useState([]);
    // const [commentsCount, setCommentsCount] = useState(posts.commentCount);
    const [commentsCount, setCommentsCount] = useState();
    const [commentsToShow, setCommentsToShow] = useState(2);
    const [isReadMore, setIsReadMore] = useState(true);
    // const [likes, setLikes] = useState(posts.likeCount);
    const [filteredLikes, setFilteredLikes] = useState([]);
    // const [likesArr, setLikesArr] = useState(posts.likes);
    const [openModal, setOpenModel] = useState(false);
    const [openShare, setOpenShare] = useState(false);
    const [showSingleImg, setShowSingleImg] = useState(false);
    const [tempImg, setTempImg] = useState('');
    const [sliderImages, setSliderImages] = useState([]);
    const [sliderVideos, setSliderVideos] = useState([]);
    const [ShowSlider, setShowSlider] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    // const date = new Date(posts.createdAt);

    //********************************************
    const [postContent, setPostContent] = useState("");
    const [postImages, setPostImages] = useState("");
    const [postVideos, setPostVideos] = useState("");
    const [userId, setUserId] = useState("");
    const [sellerId, setSellerId] = useState("");
    const [adminId, setAdminId] = useState("");
    const [isActive, setIsActive] = useState("");
    const [isSeller, setIsSeller] = useState("");
    const [likes, setLikes] = useState("");
    const [likeCount, setLikeCount] = useState("");
    const [postStatus, setPostStatus] = useState("");
    const [comments, setComments] = useState("");
    const [commentCount, setCommentCount] = useState("");
    const [isCollapsed, setIsCollapsed] = useState(false);

    //********************************************/
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    useEffect(() => {
        const getPostData = async () => {
            const url = `seller/getPostById/${postId}`;
            try {
                const response = await axios.get(url, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': `Bearer ${authInfo.token}`
                    }
                });

                if (response.data.status) {
                    console.log("response.data.data", response.data.data);

                    const data = response.data.data
                    setSharePost(response.data.data);
                    setPostContent(data.postContent);
                    setPostImages(data.postImages || []);
                    setPostVideos(data.postVideos || []);
                    setUserId(data.userId);
                    setSellerId(data.sellerId);
                    setAdminId(data.adminId)
                    setIsActive(data.isActive);
                    setIsSeller(data.isSeller);
                    setLikes(data.likes);
                    setLikeCount(data.likeCount);
                    setPostStatus(data.postStatus);
                    setComments(data.comments);
                    setCommentCount(data.commentCount);
                    setLoading(false)
                }
            } catch (error) {
                if (error.response && error.response.data.status === false) {
                    toast.error(error.response.data.message);
                } else {
                    console.error("An unexpected error occurred", error);
                    toast.error("An unexpected error occurred. Please try again later.");
                }
            }
        };

        // Call the function when the component mounts
        getPostData();
    }, [postId, authInfo, setSharePost]);



    // useEffect(() => {
    //     const getPostData = async () => {
    //         const url = `community/getPostById/${postId}`;
    //         try {
    //             const response = await axios.get(url, {
    //                 headers: {
    //                     'Accept': 'application/json',
    //                     'Content-Type': 'application/json;charset=UTF-8',
    //                     'Authorization': `Bearer ${authInfo.token}`
    //                 }
    //             });

    //             if (response.data.status) {
    //                 console.log("response.data.data", response.data.data);
    //                 setSharePost(response.data.data);
    //             }
    //         } catch (error) {
    //             if (error.response && error.response.data.status === false) {
    //                 toast.error(error.response.data.message);
    //             } else {
    //                 console.error("An unexpected error occurred", error);
    //                 toast.error("An unexpected error occurred. Please try again later.");
    //             }
    //         }
    //     };
    // }, [])

    // const getPostData = async () => {
    //     const url = `community/getPostById/${postId}`;
    //     try {
    //         const response = await axios.get(url, {
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json;charset=UTF-8',
    //                 'Authorization': `Bearer ${authInfo.token}`
    //             }
    //         });

    //         if (response.data.status) {
    //             console.log("response.data.data", response.data.data);
    //             setSharePost(response.data.data);
    //         }
    //     } catch (error) {
    //         if (error.response && error.response.data.status === false) {
    //             toast.error(error.response.data.message);
    //         } else {
    //             console.error("An unexpected error occurred", error);
    //             toast.error("An unexpected error occurred. Please try again later.");
    //         }
    //     }
    // };


    const handleComments = (e) => {
        setComments(e.target.value);
    }

    // const addNewComment = (postId) => {
    //     let reqBody = {};
    //     if (userInfo.role === 'user') {
    //         reqBody = {
    //             content: comments,
    //             isSeller: false,
    //             user_id: authInfo.id,
    //             seller_id: null
    //         }
    //     }
    //     else {
    //         reqBody = {
    //             content: comments,
    //             isSeller: true,
    //             user_id: null,
    //             seller_id: authInfo.id
    //         }
    //     }
    //     setComments('');
    //     // dispatch(setLoading({ loading: true }))
    //     axios.post(`community/postComments/${postId}`, reqBody, {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json;charset=UTF-8',
    //             'Authorization': `Bearer ${authInfo.token}`
    //         }
    //     }).then(response => {
    //         if (response.data.status) {
    //             setCommentsCount(commentsCount + 1);
    //             let res = response.data.data
    //             // getPostsData(dispatch);
    //         }
    //     }).catch(error => {
    //         console.log(error);
    //     }).finally(() => {
    //         setTimeout(() => {
    //             // dispatch(setLoading({ loading: false }));
    //         }, 300);
    //     });
    // }

    // const removeFromLiked = (postId) => {
    //     let updatedLikes = filteredLikes;
    //     let index = updatedLikes.indexOf(authInfo.id);
    //     updatedLikes.splice(index, 1);
    //     setFilteredLikes(updatedLikes);
    //     let reqBody = {};
    //     if (userInfo.role === 'user') {
    //         reqBody = {
    //             isLike: filteredLikes.includes(authInfo.id),
    //             isSeller: false,
    //             user_id: authInfo.id,
    //             seller_id: null
    //         }
    //     }
    //     else {
    //         reqBody = {
    //             isLike: filteredLikes.includes(authInfo.id),
    //             isSeller: true,
    //             user_id: null,
    //             seller_id: authInfo.id
    //         }
    //     }
    //     axios.post(`community/postLikes/${postId}`, reqBody, {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json;charset=UTF-8',
    //             'Authorization': `Bearer ${authInfo.token}`
    //         }
    //     }).then(response => {
    //         if (response.data.status) {
    //             // getPostsData(dispatch);
    //         }
    //     }).catch(error => {
    //         console.log(error);
    //     });

    // }


    // const addToLiked = (postId) => {
    //     let liked = filteredLikes
    //     liked.push(authInfo.id);
    //     setFilteredLikes(liked);
    //     let reqBody = {};
    //     if (userInfo.role === 'user') {
    //         reqBody = {
    //             isLike: filteredLikes.includes(authInfo.id),
    //             isSeller: false,
    //             user_id: authInfo.id,
    //             seller_id: null
    //         }
    //     }
    //     else {
    //         reqBody = {
    //             isLike: filteredLikes.includes(authInfo.id),
    //             isSeller: true,
    //             user_id: null,
    //             seller_id: authInfo.id
    //         }
    //     }
    //     axios.post(`community/postLikes/${postId}`, reqBody, {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json;charset=UTF-8',
    //             'Authorization': `Bearer ${authInfo.token}`
    //         }
    //     }).then(response => {
    //         if (response.data.status) {
    //             // getPostsData(dispatch);
    //         }
    //     }).catch(error => {
    //         console.log(error);
    //     });
    // }

    const viewMoreComments = (id) => {
        let initialCommentToShow = commentsToShow;
        if (postId === id) {
            initialCommentToShow = initialCommentToShow + 2;
        }
        setCommentsToShow(initialCommentToShow);
    }

    const handleImgShow = (img) => {
        setTempImg(img);
        setShowSingleImg(true);
    }
    const handleSliderShow = (item) => {
        setTempImg(item.url);
        if (postImages.length > 0) {

            let sliderImages = [{ url: item.url }];
            postImages.filter((val) => val.url !== item.url).forEach((value) => {
                sliderImages.push({ url: value.url });
            });
            setSliderImages(sliderImages);
        }
        if (postVideos.length > 0) {
            let sliderVideos = [{ url: item.url }];
            postVideos.forEach((value) => {
                sliderVideos.push({ url: value.url });
            });
            // console.log("sliderVideos", sliderVideos)
            setSliderVideos(sliderVideos);
        }
        setShowSlider(true)
    }
    const hideSlider = () => {
        setShowSlider(false)
        setSliderImages([]);
        setSliderVideos([]);
    }
    const handleModel = () => {
        setOpenModel(true);
    }
    let followRef = useRef();
    let shareRef = useRef();
    // useEffect(() => {
    //     // for likes
    //     const getLikes = () => {
    //         let likes = posts.likes;
    //         let filteredLikes = [];
    //         likes.forEach((value) => {
    //             if (value.isSeller) {
    //                 filteredLikes.push(value.sellerId.id);
    //             }
    //             else {
    //                 filteredLikes.push(value.userId.id);
    //             }
    //         });
    //         setFilteredLikes(filteredLikes);
    //     }
    //     getLikes();
    // }, [posts]);

    // useEffect(() => {
    //     if (posts.postImages.length > 0) {
    //         let sliderImages = [];
    //         posts.postImages.forEach((value) => {
    //             sliderImages.push({ url: config.apiURI + value.url })
    //         });
    //         setSliderImages(sliderImages);
    //     }
    // }, []);

    // useEffect(() => {
    //     let followHandler = (event) => {
    //         if (!followRef.current.contains(event.target)) {
    //             setOpenModel(false);
    //         }
    //     }
    //     document.addEventListener("mousedown", followHandler)
    //     return () => {
    //         document.removeEventListener("mousedown", followHandler)
    //     }
    // });
    // useEffect(() => {
    //     let shareHandler = (event) => {
    //         if (!shareRef.current.contains(event.target)) {
    //             setOpenShare(false);
    //         }
    //     }
    //     document.addEventListener("mousedown", shareHandler)
    //     return () => {
    //         document.removeEventListener("mousedown", shareHandler)
    //     }
    // });


    // const handleFollow = (posts) => {
    //     const userId = posts.userId.id;
    //     console.log("userId", userId)


    //     // const response = await axios.post(url, {
    //     //     headers: {
    //     //         'Accept': 'application/json',
    //     //         'Content-Type': 'application/json;charset=UTF-8',
    //     //         'Authorization': `Bearer ${authInfo.token}`
    //     //     }
    //     // });
    //     // console.log("response", response)

    //     const url = "community/follow-user";
    //     // const categoryData = {
    //     //     names,
    //     //     slug,
    //     //     description,
    //     // }
    //     axios.post(url, {
    //         headers: {
    //             'Accept': 'application/json',
    //             "access-control-allow-origin": "https://localhost:3000",
    //             'Content-Type': 'application/json;charset=UTF-8',
    //             'Authorization': `Bearer ${authInfo.token}`
    //         }
    //     })
    //         .then((response) => {
    //             // this.getCategory();
    //             console.log("Follow Succesfully", response);
    //         })
    //         .catch((error) => {
    //             console.error('Error in saving category:', error);
    //         });
    // }

    // const handleFollow = (posts) => {
    //     const currentUserId = authInfo.id;
    //     const userIdToFollow = posts.userId === null ? posts.sellerId.id : posts.userId.id;
    //     const role = posts.userId === null ? posts.sellerId.role : posts.userId.role;
    //     var reqBody = {
    //         role: role,
    //         currentUserId: currentUserId,
    //         userIdToFollow: userIdToFollow,
    //     }
    //     axios.post(`community/follow-user`, reqBody, {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json;charset=UTF-8',
    //             'Authorization': `Bearer ${authInfo.token}`
    //         }
    //     }).then(response => {
    //         if (response.data.status) {
    //             // getPostsData(dispatch);
    //             // console.log("response", response.data.message);
    //             toast.success(response.data.message);

    //         }
    //     }).catch(error => {
    //         console.log(error);
    //     });
    // }

    // const handleUnfollow = (posts) => {
    //     const currentUserId = authInfo.id;
    //     // const userIdToUnfollow = posts.userId.id;
    //     const userIdToUnfollow = posts.userId === null ? posts.sellerId.id : posts.userId.id;
    //     const role = posts.userId === null ? posts.sellerId.role : posts.userId.role;
    //     var reqBody = {
    //         role: role,
    //         currentUserId: currentUserId,
    //         userIdToUnfollow: userIdToUnfollow,
    //     }
    //     axios.post(`community/unfollowUser`, reqBody, {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json;charset=UTF-8',
    //             'Authorization': `Bearer ${authInfo.token}`
    //         }
    //     }).then(response => {
    //         if (response.data.status) {
    //             // console.log("response", response.data.message);
    //             toast.success(response.data.message);
    //             // getPostsData(dispatch);
    //         }
    //     }).catch(error => {
    //         console.log(error);
    //     });
    // }

    // const handleRemove = (postId) => {
    //     var reqBody = {
    //         postId: postId,
    //     }
    //     axios.put(`community/postRemoved`, reqBody, {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json;charset=UTF-8',
    //             'Authorization': `Bearer ${authInfo.token}`
    //         }
    //     }).then(response => {
    //         if (response.data.status) {
    //             toast.success(response.data.message);
    //             // getPostsData(dispatch);
    //         }
    //     }).catch(error => {
    //         console.log(error);
    //     });
    // }

    // const handleEdit = (postEditData) => {
    //     // console.log("postEditData", postEditData)
    //     sendEditData(postEditData);
    // }

    // const isFollowing = posts.userId !== null ? posts.userId.community.followerData.includes(authInfo.id) : false;

    // const isFollowing = posts.userId.community.followerData.includes(authInfo.id);
    // console.log("isFollowing", isFollowing);

    // useEffect(() => {
    //     // Function to fetch data
    //     const fetchData = () => {
    //         let response = false;

    //         if (posts.userId?.community?.followerData) {
    //             response = posts.userId.community.followerData.includes(authInfo.id);
    //         } else if (posts.sellerId?.community?.followerData) {
    //             response = posts.sellerId.community.followerData.includes(authInfo.id);
    //         } else if (posts.adminId?.community?.followerData) {
    //             response = posts.adminId.community.followerData.includes(authInfo.id);
    //         }

    //         console.log("response", response);
    //         setIsFollowing(response);

    //     };
    //     fetchData();
    //     // getPostsData(dispatch);
    // }, []);

    const toggleCollapse = () => {
        setIsCollapsed(prevState => !prevState);
    };

    const handleShare = (postId) => {
        console.log("Selected postID", postId)
        setOpenShare(true)
    }
    console.log("postImages", postImages)

    return (
        <React.Fragment>
            {loading === true ? <SpinnerLoader /> : ''}
            <div className="post">
                <div className="post_head">
                    <div className="post_by">
                        <div className="poster_img "><img src={userId === null ? sellerId.image_url : userId.image_url} alt="" /></div>
                        {/* <div className="poster_img "><img src={posts.isSeller ? config.apiURI + posts.sellerId.image_url : posts.userId.image_url !== null ? config.apiURI + posts.userId.image_url : userImg} alt="" /></div> */}
                        <div className="poster_info">
                            {/* <div className="poster_name">{isSeller ? sellerId.name : userId.name}</div> */}
                            <div className="poster_name">{isSeller ? sellerId && sellerId.name : userId && userId.name}</div>
                            {/* <ReactTimeAgo date={date} locale="en-US" timeStyle="round-minute" /> */}
                            {/* <Link className="post_follow" data-bs-toggle="collapse" to={`#collapseFollow${posts.id}`} role="button" aria-expanded="false" aria-controls={`collapseFollow${posts.id}`}>
                            Follow
                        </Link> */}
                            {
                                userInfo.role === 'user' &&
                                <Link to="#" className="post_follow" onClick={() => handleModel()}>
                                    {isSeller === false && userId.id === authInfo.id
                                        ? "" : isFollowing ? 'Unfollow' : 'Follow'}
                                    {/* {posts.isSeller === false && posts.userId.id === authInfo.id ? "" : 'Follow'} */}
                                </Link>
                            }
                            {
                                userInfo.role === 'seller' &&
                                <Link to="#" className="post_follow" onClick={() => handleModel()}>
                                    {isSeller === true && sellerId.id === authInfo.id ? "" : 'Follow'}
                                </Link>
                            }
                        </div>
                    </div>
                    {/* <div className={`${openModal ? '' : 'collapse'} post_follow_pop collapse`} id={`collapseFollow${posts.id}`}> */}
                    <div ref={followRef}>
                        {
                            openModal ?
                                <div className={`post_follow_pop`}>
                                    <div className="follow_box">
                                        <div className="post_by">
                                            <div className="poster_img" ><img src={isSeller ? sellerId.image_url : userId.image_url !== null ? userId.image_url : userImg} alt="" /></div>
                                            <div className="poster_info">
                                                <div className="poster_name">{posts.isSeller ? posts.sellerId.name : posts.userId.name}</div>
                                                <small>{isSeller ? 'Seller' : 'User'}</small>
                                            </div>
                                        </div>
                                        <ul>
                                            <li>
                                                {/* <div className="fp_fc">{posts.userId.community.followers}</div> */}
                                                <div className="fp_fc">{posts.userId === null ? posts.sellerId.community.followers : posts.userId.community.followers}</div>
                                                <small>Followes</small>
                                            </li>
                                            <li>
                                                {/* <div className="fp_fc">{posts.userId.community.following}</div> */}
                                                <div className="fp_fc">{posts.userId === null ? posts.sellerId.community.following : posts.userId.community.following}</div>
                                                <small>Following</small>
                                            </li>
                                            <li>
                                                <div className="fp_fc">02</div>
                                                <small>Posts</small>
                                            </li>

                                        </ul>
                                        {isFollowing ?
                                            <Link to="#" className="btn custom_btn btn_yellow"
                                            // onClick={() => handleUnfollow(posts)}
                                            >Unfollow</Link>
                                            :
                                            <Link to="#" className="btn custom_btn btn_yellow"
                                            // onClick={() => handleFollow(posts)}
                                            >Follow</Link>
                                        }
                                    </div>
                                </div>
                                : ''
                        }
                    </div>

                    {/* Product show... */}
                    {/* <div className="post_on">
                
                    {
                        posts.productId !== null || posts.categoryId !== null ?
                            <>{posts.productId !== null ? 'Product' : 'Category'} : {posts.productId !== null ? <Link to={`product-detail/${posts.productId.id}`}>{posts.productId.name}</Link> : <Link to={`product-listing?cat=${posts.categoryId.id}&search=`}>{posts.categoryId.categoryName}</Link>}</>
                            : ''
                    }
                       </div> */}

                </div>
                <div className="post_body">
                    <div className="post_text">
                        <p>{isReadMore ? postContent.slice(0, 150) : postContent}
                            {
                                postContent.length > 150 ?
                                    <span onClick={() => setIsReadMore(!isReadMore)} className="read-or-hide">
                                        {isReadMore ? "...read more" : " show less"}
                                    </span>
                                    : ''
                            }
                        </p>
                    </div>


                    {/* post images */}
                    <div className={`post_single_img ${showSingleImg ? 'open' : ''}`}>
                        <img className='single_img' src={tempImg} alt="" />
                        <i className='icon' onClick={() => setShowSingleImg(false)}><img src={closeIcon} alt="" /></i>
                        {/* <button type="button" className="view_more text-reset"><img src={closeIcon} className="img-fluid" alt="close_icon" /> Close</button> */}
                    </div>
                    {/* slider begin */}
                    {sliderImages.length > 0 &&
                        <div className={`post_single_img ${ShowSlider ? 'open' : ''}`} >
                            {/* <i className='icon' onClick={() => hideSlider()} ><img src={closeIcon} alt="" /></i> */}
                            <button type="button" className="btn-close" onClick={() => hideSlider()}></button>
                            <SimpleImageSlider
                                width={1000}
                                height={800}
                                images={sliderImages}
                                // showBullets={true}
                                showNavs={true}
                                style={{ backgroundRepeat: 'no-repeat', backgroundSize: 'contain' }}
                            />
                        </div>
                    }

                    {/* slider end */}
                    <div className='post_img_box container'>
                        <div className='row post_img_internal_box'>
                        {(postImages && postImages.length >= 0) || (postVideos && postVideos.length >= 0) ? (
                            <>
                                {postImages && postImages.length > 0 && (
                                    <>
                                        {postImages.slice(0, 2).map((image, ind) => {
                                            return(
                                                <>
                                                    <div className={`post_child_div ${postImages.length === 1 ? 'col-12' : 'col-md-6'}`} key={image.url ||ind} onClick={() => handleSliderShow(image)}>
                                                    <div className="post_img mb-3 "><img src={image.url} alt="" /></div>
                                                    </div>
                                                </>
                                            )
                                        })}


                            {/* // <div className="post_child_div'col-12">
                            //     <div className="post_img mb-3 ">
                            //         <img src={postImages.url} alt="" />
                            //     </div>
                            // </div>, */}


                            {/* {postImages.slice(0, 2).map((image, ind) => { 
                            //     return (
                            //         <>
                            //             <div className={`post_child_div ${postImages.length === 1 ? 'col-12' : 'col-md-6'}`} key={ind} onClick={() => handleSliderShow(image)}>
                            //                 <div className="post_img mb-3 "><img src={image.url} alt="" /></div>
                            //             </div>
                            //         </>
                            //     )
                            // })} */}
                                        { postImages.slice(2, 4).map((image, ind) => {
                                            return (
                                                <>
                                                    <div className={`post_child_div ${postImages.length === 1 ? 'col-12' : 'col-md-4'}`} key={image.url || ind} onClick={() => handleSliderShow(image)}>
                                                    <div className="post_img mb-3 "><img src={image.url} alt="" /></div>
                                                    </div>
                                                </>
                                            )
                                        })}
                                        { postImages.slice(4, 5).map((image, ind) => {
                                            return (
                                                <>
                                                    <div className={`post_child_div ${postImages.length === 1 ? 'col-12' : 'col-md-4'}`} key={ind} onClick={() => handleSliderShow(image)}>
                                                    {
                                                        postImages.length > 5 &&
                                                        <span>{`${postImages.length - 5}+`}</span>
                                                    }
                                                    <div className="post_img mb-3 " ><img src={image.url} alt="" /></div>
                                                    </div>
                                                </>
                                            )
                                        })}
                                    </>
                                )}
                                {postVideos && postVideos.length > 0 && (
                                    <>
                                        { postVideos.map((video, ind) => {
                                            return (
                                                <div className={`post_main_div ${postVideos.length === 1 ? 'col-12' : 'col-md-4'}`} key={video.url || ind} onClick={() => handleSliderShow(video)} >
                                                    <Link to="#" className='cp_video_play' >
                                                    <img src={videoPlay} />
                                                    </Link>
                                                    <div className="post_img mb-3 ">
                                                        <video controls>
                                                            <source src={video.url} type="video/mp4" />
                                                        </video>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </>
                                )}
                            </>
                            ) : (
                            <p>Loading...</p>
                        )} 

                        </div>
                    </div>
                </div>
                <div className="post_foot">
                    <div className="post_actions">
                        <ul className="ps_links">
                            <li>
                                {(likeCount.length === 0) || (commentCount.length===0) ? (
                                    <>
                                        <img src={redHeartIcon} /> {likeCount} 
                                    </>
                                    ) : (
                                    <>
                                {/* <Link to="#" onClick={() => filteredLikes.length !== 0 && filteredLikes.includes(authInfo.id) ? removeFromLiked(posts.id) : addToLiked(posts.id)}> */}
                                    {/* <img src={likeCount.length !== 0 && filteredLikes.includes(authInfo.id) ? redHeartIcon : heartIconBordered} /> {posts.likeCount} */}
                                <img src={redHeartIcon} /> {likeCount}
                                {/* </Link> */}
                                <Link onClick={toggleCollapse} to={`#collapseComment${posts.id}`} role="button" aria-expanded="isCollapsed" aria-controls={`collapseComment${posts.id}`}><i className="post_icon ps_comment"></i> {commentCount} Comments</Link>
                                </>
                                )}
                            </li>

                            <li className="ms-auto">
                                {/* {(userId?.id === authInfo.id || sellerId?.id === authInfo.id || adminId?.id === authInfo.id) ? (
                                    <>
                                        <button className="btn custom_btn btn_yellow_bordered edit_cumm" onClick={() => handleEdit(posts)}>Edit</button>
                                        <button className="btn custom_btn btn_yellow_bordered edit_cumm" onClick={() => handleRemove(posts.id)}>Delete</button>
                                    </>
                                ) : null}
                                {posts.userId.id === authInfo.id ? <>
                                <button className="btn custom_btn btn_yellow_bordered edit_cumm" onClick={() => handleEdit(posts)}>Edit</button>
                                <button className="btn custom_btn btn_yellow_bordered edit_cumm" onClick={() => handleRemove(posts.id)}>Delete</button>
                            </>
                                : ""
                            } */}

                                {/* <Link className="post_follow" data-bs-toggle="collapse" to={`#collapseShareTo${posts.id}`} role="button" aria-expanded="false" aria-controls={`collapseShareTo${posts.id}`}>
                                <i className="post_icon ps_share"></i> Share
                            </Link> */}
                                {/* <Link
                                    to="#"
                                    // onClick={() => setOpenShare(true)}
                                    onClick={() => handleShare(posts)}
                                    className="post_follow">
                                    <i className="post_icon ps_share"></i> Share
                                </Link> */}
                            </li>

                        </ul>
                        {/* <div className="collapse collapse_pop" id={`collapseShareTo${posts.id}`}> */}
                        {/* <div ref={shareRef}>
                            {
                                openShare ?
                                    <div className="collapse_pop">
                                        <ul className="shareto">
                                            <li>
                                                <i className="post_icon ps_share"></i>
                                                Share
                                            </li>
                                            <li><Link to="#" onClick={() => handleFacebookShare(posts.id)}>Facebook</Link></li>
                                            <li><Link to="#" onClick={() => handleTwitterShare(posts.id)}>Twitter</Link></li>
                                            <li><Link to="#" onClick={() => handleInstagramShare(posts.id)}>Instagram</Link></li>
                                            <li><Link to="#" onClick={() => handleWhatsappShare(posts.id)}>Whatsapp</Link></li>
                                        </ul>
                                    </div>
                                    : ''
                            }
                        </div> */}


                        <div className={`collapse post_comments ${isCollapsed ? 'show' : ''}`} id={`collapseComment${postId}`}>
                            <ul className="comnt_list">
                                <li>
                                    {/* <div className="add_commnt">
                                        <div className="avtar_img"><img className="img-fluid" src={userImg} alt="" /></div>
                                        <div className="add_comnt">
                                            <div className="ac_box">
                                                <textarea className="form-control" placeholder="Add Comment" name="" id="" rows="3" value={comments} onChange={(e) => handleComments(e)}></textarea>
                                                <button type="submit" className="btn btn_yellow custom_btn" 
                                                //onClick={() => addNewComment(postId)} disabled={!comments.trim()}
                                                >                
                                                    Add Comment
                                                </button>
                                            </div>
                                        </div>
                                    </div> */}
                                </li>
                                <li>
                                {(comments && comments.length > 0) ? (
                                        <>
                                        {comments.map((val, id) => {
                                            return (
                                                <div className="commnt_box"  key={id}> 
                                                    <div className="avtar_img"><img className="img-fluid" src={userImg} alt="" /></div> 
                                                    <div className="commnt_text">
                                                        <div className="commnt_body">
                                                            <div className="commnt_by">
                                                                <div className="cb_name">{val.isSeller===true ? val.sellerId.name ||"" : val.userId.name ||""}</div>
                                                                <div className="cb_date"> <ReactTimeAgo date={new Date(val.createdAt)} locale="en-US" timeStyle="round-minute" /></div>
                                                            </div>
                                                            <p>{val.content}</p> 
                                                        </div>
                                                        
                                                    </div>
                                                </div>
                                            )
                                            })}  
                                        {/* {comments.length > commentsToShow && (
                                        // {commentCount == 0 ? '' :
                                            <button className={`btn load_more_post ${comments.length === commentsToShow || comments.length === commentsToShow - 1 ? 'd-none' : ''}`}
                                                onClick={() => viewMoreComments(postId)} >view more comments</button>
                                        )} 
                                        <p>{val.content}</p> */}
                                        </>
                                    ):(
                                    <p>loading.....</p>
                                )}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default SellerSharePostData;
