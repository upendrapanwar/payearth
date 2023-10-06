import React, { useRef, useState } from 'react';
import userImg from '../../../assets/images/user_img.png'
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
import SpinnerLoader from '../../../components/common/SpinnerLoader';
import { setLoading } from '../../../store/reducers/global-reducer';


const Post = ({ posts }) => {

    const authInfo = useSelector(state => state.auth.authInfo);
    const userInfo = useSelector(state => state.auth.userInfo);
    const loading = useSelector(state => state.global.loading);
    const dispatch = useDispatch();

    const [comments, setComments] = useState('');
    const [commentsArr, setCommentsArr] = useState(posts.comments);
    const [newCommentsArr, setNewCommentsArr] = useState([]);
    const [commentsCount, setCommentsCount] = useState(posts.commentCount);
    const [commentsToShow, setCommentsToShow] = useState(2);
    const [isReadMore, setIsReadMore] = useState(true);
    const [likes, setLikes] = useState(posts.likeCount);
    const [filteredLikes, setFilteredLikes] = useState([]);
    const [likesArr] = useState(posts.likes);
    const [openModal, setOpenModel] = useState(false);
    const [openShare, setOpenShare] = useState(false);
    const [showSingleImg, setShowSingleImg] = useState(false);
    const [tempImg, setTempImg] = useState('')
    const date = new Date(posts.createdAt);

    const handleComments = (e) => {
        setComments(e.target.value);
    }
    const addNewComment = (postId) => {
        let reqBody = {};
        if (userInfo.role === 'user') {
            reqBody = {
                content: comments,
                isSeller: false,
                user_id: authInfo.id,
                seller_id: null
            }
        }
        else {
            reqBody = {
                content: comments,
                isSeller: true,
                user_id: null,
                seller_id: authInfo.id
            }
        }
        setComments('');
        dispatch(setLoading({ loading: true }))
        axios.post(`community/postComments/${postId}`, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {
                setCommentsCount(commentsCount + 1);
                let res = response.data.data
                let newComment = {}
                if (res.isSeller) {
                    newComment = {
                        content: res.content,
                        createdAt: res.createdAt,
                        id: res.id,
                        isSeller: res.isSeller,
                        sellerId: { name: userInfo.name, image_url: userInfo.imgUrl, _id: authInfo.id, id: authInfo.id },
                        updatedAt: res.updatedAt,
                        userId: null
                    }
                }
                else {
                    newComment = {
                        content: res.content,
                        createdAt: res.createdAt,
                        id: res.id,
                        isSeller: res.isSeller,
                        sellerId: null,
                        updatedAt: res.updatedAt,
                        userId: { name: userInfo.name, image_url: userInfo.imgUrl, _id: authInfo.id, id: authInfo.id }
                    }
                }
                let newComments = [...newCommentsArr];
                newComments.push(newComment);
                setNewCommentsArr(newComments);
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
        setLikes(likes - 1);

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
        axios.post(`community/postLikes/${postId}`, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {

            }
        }).catch(error => {
            console.log(error);
        });

    }
    const addToLiked = (postId) => {
        let liked = filteredLikes
        liked.push(authInfo.id);
        setFilteredLikes(liked);
        setLikes(likes + 1);
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
        axios.post(`community/postLikes/${postId}`, reqBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${authInfo.token}`
            }
        }).then(response => {
            if (response.data.status) {

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
    const handleModel = () => {
        setOpenModel(true);
    }
    let followRef = useRef();
    let shareRef = useRef();
    useEffect(() => {
        // for likes
        let likes = likesArr;
        let filteredLikes = [];
        likes.forEach((value) => {
            if (value.isSeller) {
                filteredLikes.push(value.sellerId.id);
            }
            else {
                filteredLikes.push(value.userId.id);
            }
        });
        setFilteredLikes(filteredLikes);
        // for comments
        let comments = commentsArr
        let filteredComments = [];
        comments.forEach((value) => {
            filteredComments.push(value);
        });
        setNewCommentsArr(filteredComments);

        document.addEventListener("mousedown", (event) => {
            if (!followRef.current.contains(event.target)) {
                setOpenModel(false);
            }
        });
        document.addEventListener("mousedown", (event) => {
            if (!shareRef.current.contains(event.target)) {
                setOpenShare(false);
            }
        });
    }, [])

    return (
        <React.Fragment>
            {/* {loading === true ? <SpinnerLoader /> : ''} */}
            <div className="post" >
                <div className="post_head">
                    <div className="post_by">
                        <div className="poster_img "><img src={userImg} alt="" /></div>
                        <div className="poster_info">
                            <div className="poster_name">{posts.isSeller ? posts.sellerId.name : posts.userId.name}</div>
                            {/* <Link className="post_follow" data-bs-toggle="collapse" to={`#collapseFollow${posts.id}`} role="button" aria-expanded="false" aria-controls={`collapseFollow${posts.id}`}>
                                Follow
                            </Link> */}
                            <Link to="#" className="post_follow" onClick={() => handleModel()}>
                                Follow
                            </Link>
                        </div>
                    </div>
                    {/* <div className={`${openModal ? '' : 'collapse'} post_follow_pop collapse`} id={`collapseFollow${posts.id}`}> */}
                    <div ref={followRef}>
                        {
                            openModal ?
                                <div className={`post_follow_pop`}>
                                    <div className="follow_box">
                                        <div className="post_by">
                                            <div className="poster_img" ><img src={userImg} alt="" /></div>
                                            <div className="poster_info">
                                                <div className="poster_name">{posts.isSeller ? posts.sellerId.name : posts.userId.name}</div>
                                                <small>{posts.isSeller ? 'Seller' : 'User'}</small>
                                            </div>
                                        </div>
                                        <ul>
                                            <li>
                                                <div className="fp_fc">18</div>
                                                <small>Followes</small>
                                            </li>
                                            <li>
                                                <div className="fp_fc">06</div>
                                                <small>Following</small>
                                            </li>
                                            <li>
                                                <div className="fp_fc">02</div>
                                                <small>Posts</small>
                                            </li>
                                        </ul>
                                        <Link to="#" className="btn custom_btn btn_yellow">Follow</Link>
                                    </div>
                                </div>
                                : ''
                        }
                    </div>
                    <div className="post_on">
                        Date : {`${date.getDate()} - ${date.getDay()} - ${date.getFullYear()}`}
                        <span>{posts.productId !== null && posts.categoryId !== null && '|'}</span>
                        {
                            posts.productId !== null && posts.categoryId !== null &&
                            <span>{Object.keys(posts.productId).length ? 'Product' : 'Category'} : {Object.keys(posts.productId).length ? `${posts.productId.name}` : `${posts.categoryId.name}`}</span>
                        }
                    </div>
                </div>
                <div className="post_body">
                    <div className="post_text">
                        {/* <h4>{posts.postTitle}</h4> */}
                        {/* <p>{posts.postContent}</p> */}
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
                        <img className='single_img' src={config.apiURI + tempImg} alt="" />
                        <i className='icon' onClick={() => setShowSingleImg(false)}><img src={closeIcon} alt="" /></i>
                    </div>
                    <div className='post_img_box container'>
                        <div className='row post_img_internal_box'>
                            {posts.postImages.slice(0, 2).map((image, ind) => {
                                return (
                                    <>
                                        <div className={`post_child_div ${posts.postImages.length === 1 ? 'col-12' : 'col-md-6'}`} key={ind} onClick={() => handleImgShow(image.url)}>
                                            <div className="post_img mb-3 "><img src={config.apiURI + image.url} alt="" /></div>
                                        </div>
                                    </>
                                )
                            })}
                            {posts.postImages.slice(2, 4).map((image, ind) => {
                                return (
                                    <>
                                        <div className={`post_child_div ${posts.postImages.length === 1 ? 'col-12' : 'col-md-4'}`} key={ind} onClick={() => handleImgShow(image.url)}>
                                            <div className="post_img mb-3 "><img src={config.apiURI + image.url} alt="" /></div>
                                        </div>
                                    </>
                                )
                            })}
                            {posts.postImages.slice(4, 5).map((image, ind) => {
                                return (
                                    <>
                                        <div className={`post_child_div ${posts.postImages.length === 1 ? 'col-12' : 'col-md-4'}`} key={ind} >
                                            {
                                                posts.postImages.length > 5 &&
                                                <span>{`${posts.postImages.length - 5}+`}</span>
                                            }
                                            <div className="post_img mb-3 " ><img src={config.apiURI + image.url} alt="" /></div>
                                        </div>
                                    </>
                                )
                            })}
                        </div>
                    </div>
                    {/* post videos */}
                    <div className='post_img_box container'>
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
                    </div>
                </div>
                <div className="post_foot">
                    <div className="post_actions">
                        <ul className="ps_links">
                            <li>
                                <Link to="#" onClick={() => filteredLikes.length !== 0 && filteredLikes.includes(authInfo.id) ? removeFromLiked(posts.id) : addToLiked(posts.id)}>
                                    <img src={filteredLikes.length !== 0 && filteredLikes.includes(authInfo.id) ? redHeartIcon : heartIconBordered} /> {likes}
                                </Link>
                                <Link data-bs-toggle="collapse" to={`#collapseComment${posts.id}`} role="button" aria-expanded="false" aria-controls={`collapseComment${posts.id}`}><i className="post_icon ps_comment"></i> {commentsCount} Comments</Link>
                            </li>
                            <li className="ms-auto">
                                {/* <Link className="post_follow" data-bs-toggle="collapse" to={`#collapseShareTo${posts.id}`} role="button" aria-expanded="false" aria-controls={`collapseShareTo${posts.id}`}>
                                    <i className="post_icon ps_share"></i> Share
                                </Link> */}
                                <Link to="#" onClick={() => setOpenShare(true)} className="post_follow">
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
                                            <li><Link to="#">Internal</Link></li>
                                            <li><Link to="#">Facebook</Link></li>
                                            <li><Link to="#">Twitter</Link></li>
                                            <li><Link to="#">Linkedin</Link></li>
                                        </ul>
                                    </div>
                                    : ''
                            }
                        </div>
                        <div className="collapse post_comments" id={`collapseComment${posts.id}`}>
                            <ul className="comnt_list">
                                <li>
                                    <div className="add_commnt">
                                        <div className="avtar_img"><img className="img-fluid" src={userImg} alt="" /></div>
                                        <div className="add_comnt">
                                            <div className="ac_box">
                                                <textarea className="form-control" placeholder="Add Comment" name="" id="" rows="3" value={comments} onChange={(e) => handleComments(e)}></textarea>
                                                <button type="submit" className="btn btn_yellow custom_btn" onClick={() => addNewComment(posts.id)} disabled={!comments.trim()}>
                                                    <Link data-bs-toggle="collapse" to={`#collapseComment${posts.id}`} role="button" aria-expanded="false" aria-controls={`collapseComment${posts.id}`}>
                                                        Add Comment
                                                    </Link>
                                                </button>

                                            </div>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    {newCommentsArr.slice(0, commentsToShow).map((val, id) => {
                                        return (
                                            <div className="commnt_box" key={id}>
                                                <div className="avtar_img"><img className="img-fluid" src={userImg} alt="" /></div>
                                                <div className="commnt_text">
                                                    <div className="commnt_body">
                                                        <div className="commnt_by">
                                                            <div className="cb_name">{val.isSeller ? val.sellerId.name : val.userId.name}</div>
                                                            <div className="cb_date">{`${new Date(val.createdAt).getDate()} - ${new Date(val.createdAt).getDay()} - ${new Date(val.createdAt).getFullYear()}`}</div>
                                                        </div>
                                                        <p>{val.content}</p>
                                                    </div>
                                                    {/* <Link to="#" className="reply_link">Reply</Link> */}
                                                </div>
                                            </div>
                                        )
                                    })}
                                    {posts.commentCount == 0 ? '' :
                                        <button className={`btn load_more_post ${newCommentsArr.length === commentsToShow || newCommentsArr.length === commentsToShow - 1 ? 'd-none' : ''}`} onClick={() => viewMoreComments(posts.id)} >view more comments</button>
                                    }
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Post;
