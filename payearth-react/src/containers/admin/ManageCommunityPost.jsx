import React, { useRef, useState, forwardRef } from 'react';
import userImg from '../../assets/images/user.png'
import Modal from "react-bootstrap/Modal";
import closeIcon from '../../assets/icons/close_icon.svg'
import post from '../../assets/images/posts/post_img.jpg'
import { Link } from 'react-router-dom';
import config from '../../config.json'
import videoPlay from '../../assets/icons/video_play_icon.svg'
import redHeartIcon from '../../assets/icons/red-heart-icon-filled.svg'
import heartIconBordered from '../../assets/icons/heart-icon-bordered.svg';
import axios from 'axios';
import ellipsis from './../../assets/images/ellipsis.png';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
// import SpinnerLoader from '../../common/SpinnerLoader';
import { setLoading } from '../../store/reducers/global-reducer';
// import { getPostsData } from '../../../helpers/post-listing';
// import { getSellerPostsData } from '../../helpers/sellerPost-listing';
import SimpleImageSlider from "react-simple-image-slider";
import ReactTimeAgo from 'react-time-ago'
import TimeAgo from 'javascript-time-ago'

import io from "socket.io-client";

import en from 'javascript-time-ago/locale/en.json'
import ru from 'javascript-time-ago/locale/ru.json'

TimeAgo.addDefaultLocale(en)
TimeAgo.addLocale(ru)


const ManageCommunityPost = forwardRef(({ posts, sendEditData, getPosts }, ref) => {
   // const SellerPost = forwardRef(({ posts, sendEditData, onFollowStatusChange }, ref) => {

    // console.log("all posts of this page----------", posts)

    const authInfo = useSelector(state => state.auth.authInfo);
    const userInfo = useSelector(state => state.auth.userInfo);
    const loading = useSelector(state => state.global.loading);
    const dispatch = useDispatch();

    const [comments, setComments] = useState('');
    const [selectedMenu, setSelectedMenu] = useState([]);
    const [commentsArr, setCommentsArr] = useState(posts.comments);
    const [newCommentsArr, setNewCommentsArr] = useState([]);
    const [commentsCount, setCommentsCount] = useState(posts.commentCount);
    const [commentsToShow, setCommentsToShow] = useState(2);
    const [isReadMore, setIsReadMore] = useState(true);
    const [likes, setLikes] = useState(posts.likeCount);
    const [filteredLikes, setFilteredLikes] = useState([]);
    const [likesArr, setLikesArr] = useState(posts.likes);
    const [openModal, setOpenModel] = useState(false);
    const [openShare, setOpenShare] = useState(false);
    const [showSingleImg, setShowSingleImg] = useState(false);
    const [tempImg, setTempImg] = useState('');
    const [sliderImages, setSliderImages] = useState([]);
    const [sliderVideos, setSliderVideos] = useState([]);
    const [ShowSlider, setShowSlider] = useState(false);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isReportOpen, setIsReportOpen] = useState(false);
    const [reportedPost, setReportedPost] = useState(null);
    const [reportNote, setReportNote] = useState(null);
    const [reportOption, setReportOption] = useState(null);

    const currentUserId = authInfo.id;
    const userIdToSend = posts.adminId ? posts.adminId.id : posts.userId ? posts.userId.id : posts.sellerId.id;
    //const role = posts.userId === null ? posts.sellerId.role : posts.userId.role;
    const receiverRole = posts.adminId ? posts.adminId.role : posts.userId ? posts.userId.role : posts.sellerId ? posts.sellerId.role : null;

    const date = new Date(posts.createdAt);
    var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

    const handleComments = (e) => {
        setComments(e.target.value);
    }
    const addNewComment = (postId) => {
        let reqBody = {};
        if (userInfo.role === 'seller') {
            reqBody = {
                content: comments,
                isSeller: true,
                isAdmin: false,
                user_id: null,
                seller_id: authInfo.id,
                admin_id: null,
                user: 'seller',
            };
        }
        else if (userInfo.role === 'user') {
            reqBody = {
                content: comments,
                isSeller: false,
                isAdmin: false,
                user_id: authInfo.id,
                seller_id: null,
                admin_id: null,
                user: 'user',
            };
        }
        else if (userInfo.role === 'admin') {
            reqBody = {
                content: comments,
                isSeller: false,
                isAdmin: true,
                user_id: null,
                seller_id: null,
                admin_id: authInfo.id,
                user: 'admin',
            };
        }
        setComments('');
        dispatch(setLoading({ loading: true }))
        axios.post(`admin/postComments/${postId}`, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                setCommentsCount(commentsCount + 1);
                let res = response.data.data
                getPosts();
                // getSellerPostsData(dispatch);

                //***************** */
                const socket = io.connect(process.env.REACT_APP_SOCKET_SERVER_URL);
                console.log('comments------', comments)
                const notification = {
                    message: `${userInfo.name} comment on your post: "${comments}"`,
                    postId: postId,
                    sender: { id: currentUserId, name: userInfo.name },
                    receiver: { id: userIdToSend, name: posts.adminId ? posts.adminId.name : posts.userId ? posts.userId.name : posts.sellerId.name },
                    type: 'comment'
                };

                socket.emit('comment', {
                    notification
                });

                const notificationReqBody = {
                    type: 'comment',
                    sender: {
                        id: currentUserId,
                        type: 'admin'

                    },
                    receiver: {
                        id: userIdToSend,
                        type: receiverRole
                    },
                    postId: postId,
                    message: `${userInfo.name} comment on your post: "${comments}"`,
                    isRead: 'false',
                    createdAt: new Date(),
                };

                // axios.post('community/notifications', notificationReqBody, {
                axios.post('front/notifications', notificationReqBody).then(response => {
                    console.log("Notification saved:", response.data.message);
                }).catch(error => {
                    console.log("Error saving notification:", error);
                });
                //***************** */

            }
        }).catch(error => {
            console.log(error);
        }).finally(() => {
            setTimeout(() => {
                dispatch(setLoading({ loading: false }));
            }, 300);
        });
    }

    const removeFromLiked = (postId) => {
        let updatedLikes = filteredLikes;
        let index = updatedLikes.indexOf(authInfo.id);
        updatedLikes.splice(index, 1);
        setFilteredLikes(updatedLikes);
        let reqBody = {};
        if (userInfo.role === 'user') {
            reqBody = {
                isLike: filteredLikes.includes(authInfo.id),
                isSeller: false,
                user_id: authInfo.id,
                seller_id: null
            }
        }
        else {
            reqBody = {
                isLike: filteredLikes.includes(authInfo.id),
                isSeller: true,
                user_id: null,
                seller_id: authInfo.id
            }
        }
        axios.post(`seller/postLikes/${postId}`, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                // getSellerPostsData(dispatch);
                getPosts();
            }
        }).catch(error => {
            console.log(error);
        });

    }

    const onClickMenu = (e) => {
        e.preventDefault();
        setSelectedMenu(e.target.alt)
        // this.setState({
        //     selectedMenu: e.target.alt
        // }, () => console.log(this.state.selectedMenu));
        //this.state.selectedMenu = e.target.alt;
        //console.log(typeof(this.state.selectedMenu));
    };
    const addToLiked = (postId) => {
        let liked = filteredLikes
        liked.push(authInfo.id);
        setFilteredLikes(liked);
        let reqBody = {};
        if (userInfo.role === 'seller') {
            reqBody = {
                isLike: filteredLikes.includes(authInfo.id),
                isSeller: true,
                user_id: null,
                seller_id: authInfo.id
            }
        }
        else {
            reqBody = {
                isLike: filteredLikes.includes(authInfo.id),
                isSeller: false,
                user_id: authInfo.id,
                seller_id: null
            }
        }
        axios.post(`seller/postLikes/${postId}`, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                // getSellerPostsData(dispatch);
                getPosts();
            }
        }).catch(error => {
            console.log(error);
        });
    }

    const viewMoreComments = (id) => {
        let initialCommentToShow = commentsToShow;
        if (posts.id === id) {
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
        if (posts.postImages.length > 0) {
            let sliderImages = [{ url: item.url }];
            posts.postImages.filter((val) => val.url !== item.url).forEach((value) => {
                sliderImages.push({ url: value.url });
            });
            setSliderImages(sliderImages);
        }
        if (posts.postVideos.length > 0) {
            let sliderVideos = [{ url: item.url }];
            posts.postVideos.forEach((value) => {
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
    useEffect(() => {
        // for likes
        const getLikes = () => {
            let likes = posts.likes;
            let filteredLikes = [];
            likes.forEach((value) => {
                if (value.isSeller === true && value.sellerId?.id) {
                    filteredLikes.push(value.sellerId.id);
                } else if (value.userId?.id) {
                    filteredLikes.push(value.userId.id);
                }
            });
            setFilteredLikes(filteredLikes);
        }
        getLikes();
    }, [posts]);

    // useEffect(() => {
    //     if (posts.postImages.length > 0) {
    //         let sliderImages = [];
    //         posts.postImages.forEach((value) => {
    //             sliderImages.push({ url: config.apiURI + value.url })
    //         });          
    //         setSliderImages(sliderImages);
    //     }
    // }, []);

    useEffect(() => {
        let followHandler = (event) => {
            if (!followRef.current.contains(event.target)) {
                setOpenModel(false);
            }
        }
        document.addEventListener("mousedown", followHandler)
        return () => {
            document.removeEventListener("mousedown", followHandler)
        }
    });
    useEffect(() => {
        let shareHandler = (event) => {
            if (!shareRef.current.contains(event.target)) {
                setOpenShare(false);
            }
        }
        document.addEventListener("mousedown", shareHandler)
        return () => {
            document.removeEventListener("mousedown", shareHandler)
        }
    });


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

    const handleFollow = (posts) => {
        const currentUserId = authInfo.id;
        const userIdToFollow = posts.userId === null ? posts.sellerId.id : posts.userId.id;
        const role = posts.userId === null ? posts.sellerId.role : posts.userId.role;
        var reqBody = {
            role: role,
            currentUserId: currentUserId,
            userIdToFollow: userIdToFollow,
        }
        axios.post(`seller/follow-user`, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                // getSellerPostsData(dispatch);
                getPosts();
                setIsFollowing(true);
                // console.log("response", response.data.message);
                toast.success(response.data.message);

            }
        }).catch(error => {
            console.log(error);
        });
    }

    const handleUnfollow = (posts) => {
        const currentUserId = authInfo.id;
        // const userIdToUnfollow = posts.userId.id;
        const userIdToUnfollow = posts.userId === null ? posts.sellerId.id : posts.userId.id;
        const role = posts.userId === null ? posts.sellerId.role : posts.userId.role;
        var reqBody = {
            role: role,
            currentUserId: currentUserId,
            userIdToUnfollow: userIdToUnfollow,
        }
        axios.post(`seller/unfollowUser`, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                // console.log("response", response.data.message);
                toast.success(response.data.message);
                setIsFollowing(false);
                getPosts();
                // getSellerPostsData(dispatch);
            }
        }).catch(error => {
            console.log(error);
        });
    }

    const handleRemove = (postId) => {
        var reqBody = {
            postId: postId,
        }
        axios.put(`admin/postRemoved`, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                toast.success(response.data.message);
                // getSellerPostsData(dispatch);
                getPosts();
            }
        }).catch(error => {
            console.log(error);
        });
    }

    const handleEdit = (postEditData) => {
        // console.log("postEditData", postEditData)
        sendEditData(postEditData);
    }

    // const isFollowing = posts.userId !== null ? posts.userId.community.followerData.includes(authInfo.id) : false;

    // const isFollowing = posts.userId.community.followerData.includes(authInfo.id);
    // console.log("isFollowing", isFollowing);

    useEffect(() => {
        // Function to fetch data
        const fetchData = () => {
            let response = false;

            if (posts.userId?.community?.followerData) {
                response = posts.userId.community.followerData.includes(authInfo.id);
            } else if (posts.sellerId?.community?.followerData) {
                response = posts.sellerId.community.followerData.includes(authInfo.id);
            } else if (posts.adminId?.community?.followerData) {
                response = posts.adminId.community.followerData.includes(authInfo.id);
            }

            // console.log("response", response);
            setIsFollowing(response);

        };
        fetchData();
        // getSellerPostsData(dispatch);
    }, []);

    const handleShare = () => {
        setOpenShare(true)
    }

    const handleFacebookShare = (postId) => {
        // const url = `https://pay.earth/share_community/${postId}`
        const url = `https://localhost:3000/share_community/${postId}`
        const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        // window.open(facebookShareUrl, '_blank');
        window.open(facebookShareUrl, '_blank');
    };

    const handleTwitterShare = (postId) => {
        // const { shareAdvertise } = this.state;
        const url = `https://pay.earth/share_community/${postId}`
        // const url = `https://localhost:3000/share_community/${postId}`
        const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
        window.open(twitterShareUrl, '_blank');
    };

    const handleInstagramShare = (postId) => {
        // const { shareAdvertise } = this.state;
        const url = `https://pay.earth/share_community/${postId}`
        // const url = `https://localhost:3000/share_community/${postId}`
        const instagramShareUrl = `https://www.instagram.com/?url=${url}`
        window.open(instagramShareUrl, '_blank');
    };

    const handleWhatsappShare = (postId) => {
        // const { shareAdvertise } = this.state;
        const caption = encodeURIComponent(`https://pay.earth/admin_share_community/${postId}`);
        // const caption = encodeURIComponent(`https://localhost:3000/share_community/${postId}`);
        const whatsappShareUrl = `https://api.whatsapp.com/send?text=${caption}`;
        window.open(whatsappShareUrl, '_blank');
    }

    const handleReportPopup = (post) => {
        // alert(`Repost this post id : ${postId}`)
        setIsReportOpen(true);
        setReportedPost(post)
    }

    const reportPopupClose = () => {
        setIsReportOpen(false);
        setReportedPost(null);
    }

    const handleReportPost = async () => {
        try {
            const data = reportedPost;
            //console.log("reportedPost send to admin", data)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authInfo.token}` // Replace authInfo.token with your actual token variable
            };
            const response = await axios.post('seller/createPostReport', {
                reportType: reportOption,
                notes: reportNote,
                reportData: {
                    postId: data.id,
                    postCreatedBy: data.userId === null ? data.sellerId.id : data.userId.id,
                },
                reportBy: authInfo.id
            }, { headers });
            // console.log("response", response.data)

            toast.success("Report Succesfully");
            setIsReportOpen(false);
            // alert(response.data.message);
        } catch (error) {
            console.error('Error reporting post:', error);
        }
    }

    const handleNoteChange = (e) => {
        setReportNote(e.target.value);
    };

    const handleOptionChange = (e) => {
        setReportOption(e.target.value);
    };

    return (
        <React.Fragment>
            {/* {loading === true ? <SpinnerLoader /> : ''} */}
            <div className="post" ref={ref}>
                <div className="post_head">
                    <div className="post_by">
                        <div className="poster_img">
                            <img
                                src={
                                    posts.isAdmin && posts.adminId?.image_url ? posts.adminId.image_url :
                                        posts.userId === null || posts.userId === undefined ?
                                            (posts.sellerId?.image_url ? posts.sellerId.image_url : userImg) :
                                            (posts.userId?.image_url ? posts.userId.image_url : userImg)
                                }
                                alt=""
                            />
                        </div>
                        <div className="poster_info">
                            <div className="poster_name">
                                {posts.isAdmin ? posts.adminId.name : posts.isSeller ? posts.sellerId.name : posts.userId.name}
                            </div>
                            <ReactTimeAgo date={date} locale="en-US" timeStyle="round-minute" />
                            {/* <Link className="post_follow" data-bs-toggle="collapse" to={`#collapseFollow${posts.id}`} role="button" aria-expanded="false" aria-controls={`collapseFollow${posts.id}`}>
                                Follow
                            </Link> */}
                            {
                                userInfo.role === 'seller' &&
                                <Link to="#" className="post_follow" onClick={() => handleModel()}>
                                    {posts.isSeller === true && posts.sellerId.id === authInfo.id
                                        ? "" : isFollowing ? 'Unfollow' : 'Follow'}
                                    {/* {posts.isSeller === false && posts.userId.id === authInfo.id ? "" : 'Follow'} */}
                                </Link>
                            }
                            {
                                userInfo.role === 'user' &&
                                <Link to="#" className="post_follow" onClick={() => handleModel()}>
                                    {posts.isSeller === false && posts.userId.id === authInfo.id ? "" : isFollowing ? 'Unfollow' : 'Follow'}
                                </Link>
                            }
                        </div>
                        {/* <div className="post_action">
                            <div className="post-opts">
                                <a href="#" title="" className="ed-opts-open">
                                    <img
                                        src={ellipsis}
                                        alt="1"
                                        onClick={onClickMenu}
                                    />
                                </a>
                                <ul className={(selectedMenu === "1") ? 'ed-options showEmoji' : 'ed-options hideEmoji'}>
                                    <li><a href="#" title={selectedMenu}>Block user</a></li>
                                    <li><a href="#" title="test">Ban user</a></li>
                                    <li><a href="#" title="">Hide Post</a></li>
                                    <li><a href="#" title="">Report Abuse</a></li>
                                    <li><a href="#" title="">Unfollow User</a></li>
                                </ul>
                            </div>
                        </div> */}
                    </div>
                    {/* <div className={`${openModal ? '' : 'collapse'} post_follow_pop collapse`} id={`collapseFollow${posts.id}`}> */}
                    <div ref={followRef}>
                        {
                            openModal ?
                                <div className={`post_follow_pop`}>
                                    <div className="follow_box">
                                        <div className="post_by">
                                            <div className="poster_img" ><img src={posts.isSeller ? config.apiURI + posts.sellerId.image_url : posts.userId.image_url !== null ? config.apiURI + posts.userId.image_url : userImg} alt="" /></div>
                                            <div className="poster_info">
                                                <div className="poster_name">{posts.isSeller ? posts.sellerId.name : posts.userId.name}</div>
                                                <small>{posts.isSeller ? 'Seller' : 'User'}</small>
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
                                                <div className="fp_fc">00</div>
                                                <small>Posts</small>
                                            </li>

                                        </ul>
                                        {isFollowing ?
                                            <Link to="#" className="btn custom_btn btn_yellow" onClick={() => handleUnfollow(posts)}>Unfollow</Link>
                                            :
                                            <Link to="#" className="btn custom_btn btn_yellow" onClick={() => handleFollow(posts)}>Follow</Link>
                                        }


                                    </div>
                                </div>
                                : ''
                        }
                    </div>
                    <div className="post_on">
                        {/* Date : {`${date.getDate() < 10 ? `0${date.getDate()}` : `${date.getDate()}`} - ${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : `${date.getMonth() + 1}`} - ${date.getFullYear()}`} */}
                        {/* {date.toLocaleDateString("en-US", options)} */}
                        {/* <ReactTimeAgo date={date} locale="en-US" timeStyle="twitter"/> */}
                        {/* <span>{posts.productId !== null || posts.categoryId !== null ? '|' : ''}</span> */}
                        {
                            posts.productId !== null || posts.categoryId !== null ?
                                // <span>{Object.keys(posts.productId).length ? 'Product' : 'Category'} : {Object.keys(posts.productId).length ? `${posts.productId.name}` : `${posts.categoryId.name}`}</span>
                                <>{posts.productId !== null ? 'Product' : 'Category'} : {posts.productId !== null ? <Link to={`product-detail/${posts.productId.id}`}>{posts.productId.name}</Link> : <Link to={`product-listing?cat=${posts.categoryId.id}&search=`}>{posts.categoryId.categoryName}</Link>}</>
                                : ''
                        }
                    </div>
                </div>
                <div className="post_body">
                    <div className="post_text">
                        <p>{isReadMore ? posts.postContent.slice(0, 150) : posts.postContent}
                            {
                                posts.postContent.length > 150 ?
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
                            {posts.postImages.slice(0, 2).map((image, index) => {
                                return (
                                    <>
                                        <div className={`post_child_div ${posts.postImages.length === 1 ? 'col-12' : 'col-md-6'}`} key={`image-${index}`} onClick={() => handleSliderShow(image)}>
                                            <div className="post_img mb-3 "><img src={image.url} alt="" /></div>
                                        </div>
                                    </>
                                )
                            })}
                            {posts.postImages.slice(2, 4).map((image, index) => {
                                return (
                                    <>
                                        <div className={`post_child_div ${posts.postImages.length === 1 ? 'col-12' : 'col-md-4'}`} key={`image-${index + 2}`} onClick={() => handleSliderShow(image)}>
                                            <div className="post_img mb-3 "><img src={image.url} alt="" /></div>
                                        </div>
                                    </>
                                )
                            })}
                            {posts.postImages.slice(4, 5).map((image, index) => {
                                return (
                                    <>
                                        <div className={`post_child_div ${posts.postImages.length === 1 ? 'col-12' : 'col-md-4'}`} key={`image-${index + 4}`} onClick={() => handleSliderShow(image)}>
                                            {
                                                posts.postImages.length > 5 &&
                                                <span>{`${posts.postImages.length - 5}+`}</span>
                                            }
                                            <div className="post_img mb-3 " ><img src={image.url} alt="" /></div>
                                        </div>
                                    </>
                                )
                            })}

                            {posts.postVideos.map((video, index) => {
                                return (
                                    <div className={`post_main_div ${posts.postVideos.length === 1 ? 'col-12' : 'col-md-4'}`} key={`video-${index}`} onClick={() => handleSliderShow(video)} >
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

                        </div>
                    </div>
                    {/* post videos */}
                    {/* <div className='post_img_box container'>
                        <div className='row'>
                            {posts.postVideos.map((video, ind) => {
                                return (
                                    <div className={`post_main_div ${posts.postVideos.length === 1 ? 'col-12' : 'col-md-4 '}`} key={ind}>
                                        <Link to="#" className='cp_video_play' >
                                            <img src={videoPlay} />
                                        </Link>
                                        <div className="post_img mb-3 ">
                                            <video controls>
                                                <source src={config.apiURI + video.url} type="video/mp4" />
                                            </video>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div> */}
                </div>
                <div className="post_foot">
                    <div className="post_actions">
                        <ul className="ps_links">
                            <li>
                                {/* <Link to="#" onClick={() => filteredLikes.length !== 0 && filteredLikes.includes(authInfo.id) ? removeFromLiked(posts.id) : addToLiked(posts.id)}>
                                    <img src={filteredLikes.length !== 0 && filteredLikes.includes(authInfo.id) ? redHeartIcon : heartIconBordered} /> {posts.likeCount}
                                </Link> */}
                                <Link to="#">
                                    <img src={ redHeartIcon } /> {posts.likeCount}
                                </Link>
                                <Link data-bs-toggle="collapse" to={`#collapseComment${posts.id}`} role="button" aria-expanded="false" aria-controls={`collapseComment${posts.id}`}><i className="post_icon ps_comment"></i> {posts.commentCount} Comments</Link>
                                {/* <Link
                                    //data-bs-toggle="collapse"
                                    to={`#collapseComment${posts.id}`}
                                    role="button"
                                    //aria-expanded="false"
                                    aria-expanded={isCommentOpen[posts.id] ? "true" : "false"}
                                    aria-controls={`collapseComment${posts.id}`}
                                    //onClick={() => toggleCommentCollapse(posts.id)}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleCommentCollapse(posts.id);
                                    }}
                                >
                                    <i className="post_icon ps_comment"></i> {posts.commentCount} Comments
                                </Link> */}
                            </li>

                            <li className="ms-auto">
                                {(posts.userId?.id === authInfo.id || posts.sellerId?.id === authInfo.id || posts.adminId?.id === authInfo.id) ? (
                                    <>
                                        <button className="btn custom_btn btn_yellow_bordered edit_cumm" onClick={() => { handleEdit(posts); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>Edit</button>
                                        <button className="btn custom_btn btn_yellow_bordered edit_cumm" onClick={() => handleRemove(posts.id)}>Delete</button>
                                    </>
                                ) :
                                    <Link
                                        to="#"
                                        // onClick={() => handleShare(posts)}
                                        onClick={() => handleReportPopup(posts)}
                                        className="post_follow">
                                        Report
                                    </Link>
                                }
                                {/* {posts.userId.id === authInfo.id ? <>
                                    <button className="btn custom_btn btn_yellow_bordered edit_cumm" onClick={() => handleEdit(posts)}>Edit</button>
                                    <button className="btn custom_btn btn_yellow_bordered edit_cumm" onClick={() => handleRemove(posts.id)}>Delete</button>
                                </>
                                    : ""
                                } */}

                                {/* <Link className="post_follow" data-bs-toggle="collapse" to={`#collapseShareTo${posts.id}`} role="button" aria-expanded="false" aria-controls={`collapseShareTo${posts.id}`}>
                                    <i className="post_icon ps_share"></i> Share
                                </Link> */}
                                <Link to="#"
                                    // onClick={() => setOpenShare(true)}
                                    onClick={() => handleShare(posts)}
                                    className="post_follow">
                                    <i className="post_icon ps_share"></i> Share
                                </Link>
                            </li>

                        </ul>
                        {/* <div className="collapse collapse_pop" id={`collapseShareTo${posts.id}`}> */}
                        <div ref={shareRef}>
                            {
                                openShare ?
                                    <div className="collapse_pop">
                                        <ul className="shareto">
                                            <li><i className="post_icon ps_share"></i> Share</li>
                                            <li><Link to="#" onClick={() => handleFacebookShare(posts.id)}>Facebook</Link></li>
                                            <li><Link to="#" onClick={() => handleTwitterShare(posts.id)}>Twitter</Link></li>
                                            <li><Link to="#" onClick={() => handleInstagramShare(posts.id)}>Instagram</Link></li>
                                            <li><Link to="#" onClick={() => handleWhatsappShare(posts.id)}>Whatsapp</Link></li>
                                        </ul>
                                    </div>
                                    : ''
                            }
                        </div>
                        <div className="collapse post_comments" id={`collapseComment${posts.id}`}>
                            <ul className="comnt_list">                             
                                <li>
                                    {posts.comments.slice(0, commentsToShow).map((val, id) => {
                                        return (
                                            <div className={`commnt_box d-flex mb-3 ${val.userId && val.userId.id === authInfo.id
                                                ? 'justify-content-end'
                                                : val.sellerId && val.sellerId.id === authInfo.id
                                                    ? 'justify-content-end'
                                                    : val.adminId && val.adminId.id === authInfo.id
                                                        ? 'justify-content-end'
                                                        : 'justify-content-start'
                                                }`} key={id}>
                                                <div className="avtar_img"><img className="img-fluid" src={userImg} alt="" /></div>
                                                <div className="commnt_text">
                                                    <div className="commnt_body">
                                                        <div className="commnt_by">
                                                            {/* <div className="cb_name">{val.isSeller===true ? val.sellerId.name : val.userId.name}</div> */}
                                                            <div className="cb_name">
                                                                {val.isSeller
                                                                    ? (val.sellerId && val.sellerId.name ? val.sellerId.name : 'N/A')
                                                                    : val.isAdmin
                                                                        ? (val.adminId && val.adminId.name ? val.adminId.name : 'N/A')
                                                                        : (val.userId && val.userId.name ? val.userId.name : 'N/A')
                                                                }
                                                                {/* {val.isSeller ? (val.sellerId && val.sellerId.name ? val.sellerId.name : 'N/A') : (val.userId && val.userId.name ? val.userId.name : 'N/A')} */}
                                                            </div>
                                                            {/* <div className="cb_date">{`${new Date(val.createdAt).getDate() < 10 ? `0${new Date(val.createdAt).getDate()}` : `${new Date(val.createdAt).getDate()}`} - ${new Date(val.createdAt).getMonth() + 1 < 10 ? `0${new Date(val.createdAt).getMonth() + 1}` : `${new Date(val.createdAt).getMonth() + 1}`} - ${new Date(val.createdAt).getFullYear()}`}</div> */}
                                                            <div className="cb_date"> <ReactTimeAgo date={new Date(val.createdAt)} locale="en-US" timeStyle="round-minute" /></div>
                                                        </div>
                                                        <p>{val.content}</p>
                                                    </div>
                                                    {/* <Link to="#" className="reply_link">Reply</Link> */}
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {posts.commentCount == 0 ? '' :
                                        <button className={`btn load_more_post ${posts.comments.length === commentsToShow || posts.comments.length === commentsToShow - 1 ? 'd-none' : ''}`} onClick={() => viewMoreComments(posts.id)} >view more comments</button>
                                    }
                                </li>

                                <li>
                                    <div className="add_commnt">
                                        <div className="avtar_img">
                                            {/* <img className="img-fluid" src={userImg} alt="" /> */}
                                            <img
                                                src={userInfo.imgUrl && userInfo.imgUrl.trim() !== "" ? userInfo.imgUrl : userImg}
                                                alt=""
                                                className="img-fluid"
                                            />
                                        </div>
                                        <div className="add_comnt">
                                            <div className="ac_box">
                                                <textarea className="form-control" placeholder="Add Comment" name="" id="" rows="3" value={comments} onChange={(e) => handleComments(e)}></textarea>
                                                <button type="submit" className="btn btn_yellow custom_btn" onClick={() => addNewComment(posts.id)} disabled={!comments.trim()}>
                                                    {/* <Link data-bs-toggle="collapse" to={`#collapseComment${posts.id}`} role="button" aria-expanded="false" aria-controls={`collapseComment${posts.id}`}>
                                                        Add Comment
                                                    </Link> */}
                                                    Add Comment
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                show={isReportOpen}
                // onHide={() => this.setState({ isShareOpen: false })}
                onHide={() => setIsReportOpen(false)}
                size="md"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body>
                    <div>
                        <p class="text-center fw-bold">Are you sure you want to report ?</p>
                    </div>
                    <div className="">
                        <div className="form-check d-inline-block me-3">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="option1"
                                name="options"
                                value="Please delete this post"
                                checked={reportOption === "Please delete this post"}
                                onChange={handleOptionChange}
                            />
                            <label className="form-check-label" htmlFor="option1">
                                Please delete this post
                            </label>
                        </div> <br />
                        <div className="form-check d-inline-block me-3">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="option1"
                                name="options"
                                value="This post contains inappropriate language"
                                checked={reportOption === "This post contains inappropriate language"}
                                onChange={handleOptionChange}
                            />
                            <label className="form-check-label" htmlFor="option1">
                                This post contains inappropriate language
                            </label>
                        </div> <br />
                        <div className="form-check d-inline-block me-3">
                            <input
                                className="form-check-input"
                                type="radio"
                                id="option2"
                                name="options"
                                value="This post voilates our Terms & Condition"
                                checked={reportOption === "This post voilates our Terms & Condition"}
                                onChange={handleOptionChange}
                            />
                            <label className="form-check-label" htmlFor="option2">
                                This post voilates our Terms & Condition
                            </label>
                        </div> <br />
                    </div>
                    <br />
                    <div className="input-section">
                        <label htmlFor="">Note</label>
                        <div className="field_item text-left mt-2">
                            <textarea
                                type="text"
                                name="note"
                                value={reportNote}
                                onChange={handleNoteChange}
                                cols="30"
                                rows="10"
                                className="form-control"
                            ></textarea>
                        </div>
                    </div>
                    <div class="d-flex justify-content-center mt-2">
                        <div className="d-grid gap-2 d-md-block">
                            <button className="btn btn-warning btn-sm" type="button" onClick={handleReportPost}>Send Report</button>
                            <button className="btn btn-secondary btn-sm" type="button" onClick={reportPopupClose}>Cancle</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
});

export default ManageCommunityPost;
