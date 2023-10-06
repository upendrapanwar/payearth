import React, { useState } from 'react';
import userImg from '../../../assets/images/user_img.png'
import post2 from '../../../assets/images/posts/post_img2.jpg'
import Post from '../../../assets/images/posts/post_img.jpg'
import { Link } from 'react-router-dom';
import redHeartIcon from '../../../assets/icons/red-heart-icon-filled.svg'
import heartIconBordered from '../../../assets/icons/heart-icon-bordered.svg';
import videoPlay from '../../../assets/icons/video_play_icon.svg'
import { useEffect } from 'react';


const PostListing = () => {
    const data = [
        { id: 1, userImg: userImg, post: Post, postImg: [{ img: Post }, { img: post2 }, { img: Post }], postVideo: [{ video: post2 }, { video: Post }, { video: Post }], post_text_heading: '', post_text: '', likes: 26, comments: [{ comment: 'Hi dear friend ' }, { comment: 'How are you' }, { comment: 'Hi dear friend ' }, { comment: 'Hi dear friend ' }, { comment: 'Hi dear friend ' }, { comment: 'Hi dear friend ' },] },
        { id: 2, userImg: userImg, post: post2, postImg: [{ img: Post }], postVideo: [{ video: Post }], post_text_heading: '', post_text: '', likes: 21, comments: [{ comment: 'Hi dear friend' }] },
    ]

    const [isLiked, setIsLiked] = useState([]);
    const [comments, setComments] = useState([]);
    const [commentsToShow, setCommentsToShow] = useState(2)
    const [postData, setPostData] = useState([]);

    const removeFromLiked = (id) => {
        let filteredPost = isLiked;
        let index = filteredPost.indexOf(id);
        filteredPost.splice(index, 1);
        setIsLiked(filteredPost);

    }
    const addToLiked = (id) => {
        let liked = isLiked
        liked.push(id);
        setIsLiked(liked);
    }
    const handleComments = (e) => {
        let newComments = [...comments];
        newComments.push(e.target.value);
        setComments(newComments);
    }
    const addNewComment = () => {
        console.log(comments);
    }
    const getPosts = () => {
        setPostData(data);
    }
    useEffect(() => {
        getPosts();
    }, [])
    return (
        <React.Fragment>
            {postData.map((value, index) => {
                return (
                    <div className="post" key={index}>
                        <div className="post_head">
                            <div className="post_by">
                                <div className="poster_img"><img src={userImg} alt="" /></div>
                                <div className="poster_info">
                                    <div className="poster_name">Sushant Gandhi</div>
                                    <Link className="post_follow" data-bs-toggle="collapse" to={`#collapseFollow${index}`} role="button" aria-expanded="false" aria-controls={`collapseFollow${index}`}>
                                        Follow
                                    </Link>
                                </div>
                            </div>

                            <div className="collapse post_follow_pop" id={`collapseFollow${index}`}>
                                <div className="follow_box">
                                    <div className="post_by">
                                        <div className="poster_img"><img src={userImg} alt="" /></div>
                                        <div className="poster_info">
                                            <div className="poster_name">Sushant Gandhi</div>
                                            <small>Seller</small>
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
                            <div className="post_on">Date : 12th March 2021 <span>|</span> Category : Clothing & Accessories</div>
                        </div>
                        <div className="post_body">
                            <div className="post_text">
                                <h4>eBook: Top Benefits of Headless Commerce.</h4>
                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the an unknown...</p>
                            </div>
                            {/* <div className='post_img_box'>
                                {value.postImg.map((post) => {
                                    return (
                                        <div className="post_img mb-2 mx-2"><img src={post.img} alt="" /></div>
                                    )
                                })}
                            </div> */}
                            <div className='post_img_box container'>
                                <div className='row'>
                                    {value.postImg.map((post, ind) => {
                                        return (
                                            <div className={`${value.postImg.length === 1 ? 'col-12' : 'col-md-4 '}`} key={ind}>
                                                <div className="post_img mb-3 "><img src={post.img} alt="" /></div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className='post_img_box container'>
                                <div className='row'>
                                    {value.postVideo.map((post, ind) => {
                                        return (
                                            <div className={`post_main_div ${value.postVideo.length === 1 ? 'col-12' : 'col-md-4 '}`} key={ind}>
                                                <Link to="#" className='cp_video_play'>
                                                    <img src={videoPlay} />
                                                </Link>
                                                <div className="post_img mb-3 ">
                                                    <img src={post.video} alt="..." />
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
                                    <li><Link to="#" onClick={() => isLiked.length !== 0 && isLiked.includes(index) ? removeFromLiked(index) : addToLiked(index)}><img src={isLiked.length !== 0 && isLiked.includes(index) ? redHeartIcon : heartIconBordered} /> {isLiked.length !== 0 && isLiked.includes(index) ? value.likes : value.likes - 1}</Link><Link data-bs-toggle="collapse" to={`#collapseComment${index}`} role="button" aria-expanded="false" aria-controls={`collapseComment${index}`}><i className="post_icon ps_comment"></i> 18 Comments</Link></li>
                                    <li className="ms-auto">
                                        <Link className="post_follow" data-bs-toggle="collapse" to={`#collapseShareTo${index}`} role="button" aria-expanded="false" aria-controls={`collapseShareTo${index}`}>
                                            <i className="post_icon ps_share"></i> Share
                                        </Link>
                                    </li>

                                </ul>
                                <div className="collapse collapse_pop" id={`collapseShareTo${index}`}>
                                    <ul className="shareto">
                                        <li ><i className="post_icon ps_share"></i> Share</li>
                                        <li><Link to="#">Internal</Link></li>
                                        <li><Link to="#">Facebook</Link></li>
                                        <li><Link to="#">Twitter</Link></li>
                                        <li><Link to="#">Linkedin</Link></li>
                                    </ul>
                                </div>
                                <div className="collapse post_comments" id={`collapseComment${index}`}>
                                    <ul className="comnt_list">
                                        <li>
                                            <div className="add_commnt">
                                                <div className="avtar_img"><img className="img-fluid" src={userImg} alt="" /></div>
                                                <div className="add_comnt">
                                                    <div className="ac_box">
                                                        <textarea className="form-control" placeholder="Add Comment" name="" id="" rows="3" onChange={(e) => handleComments(e)}></textarea>
                                                        <button type="submit" className="btn btn_yellow custom_btn" onClick={() => addNewComment()}>Add Comment</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                        <li>
                                            {value.comments.slice(0, commentsToShow).map((val, id) => {
                                                return (
                                                    <div className="commnt_box" key={id}>
                                                        <div className="avtar_img"><img className="img-fluid" src={userImg} alt="" /></div>
                                                        <div className="commnt_text">
                                                            <div className="commnt_body">
                                                                <div className="commnt_by">
                                                                    <div className="cb_name">mathew John</div>
                                                                    <div className="cb_date">7-9-2021</div>
                                                                </div>
                                                                {/* <p>Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc</p> */}
                                                                <p>{val.comment}</p>
                                                            </div>
                                                            <Link to="#" className="reply_link">Reply</Link>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                            <button className={`btn load_more_post ${commentsToShow === value.comments.length || value.comments.length <= 2 ? 'd-none' : ''} `} onClick={() => setCommentsToShow(commentsToShow + 2)}>view more comments</button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}
        </React.Fragment>
    );
};
export default PostListing;
