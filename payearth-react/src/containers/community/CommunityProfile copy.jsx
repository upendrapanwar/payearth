import React from 'react';
import Footer from '../../components/common/Footer';
import Header from '../../components/community/common/Header';
import post2 from '../../assets/images/posts/post_img2.jpg'
import userImg from '../../assets/images/user_img.png'
import { Link } from 'react-router-dom';
import post from '../../assets/images/posts/post_img.jpg'
// import PostListing from '../../components/community/common/PostListing';
import Post from '../../components/community/common/Post';
import { useState } from 'react';
import { setLoading } from '../../store/reducers/global-reducer';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import axios from 'axios';

const CommunityProfile = () => {
    const userInfo = useSelector(state => state.auth.userInfo);
    const posts = useSelector(state => state.post.postsData);
    const dispatch = useDispatch();
    const getPosts = () => {
        dispatch(setLoading({ loading: true }))
        axios.get('community/front/posts').then(response => {
            if (response.data.status) {
                let res = response.data.data;
                console.log(res)
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
        //   console.log(posts)
        getPosts()
    }, [])

    return (
        <React.Fragment>
            <div className='seller_body'>
                <Header />
                <div className="cumm_page_wrap pt-5 pb-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="comm_profile">
                                    <div className="post_by">
                                        <div className="poster_img"><img src={userImg} alt="" /></div>
                                        <div className="poster_info">
                                            <div className="poster_name">{userInfo.name}</div>
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
                                </div>
                            </div>

                            <div className="col-lg-9">
                                {posts.map((value, index) => {
                                    return (
                                        <Post key={index} posts={value} />
                                    )
                                })}

                                {/* 
                                    <div className="post">
                                        <div className="post_head">
                                            <div className="post_by">
                                                <div className="poster_img"><img src={userImg} alt=""/></div>
                                                <div className="poster_info">
                                                    <div className="poster_name">Sushant Gandhi</div>
                                                    <Link className="post_follow" data-bs-toggle="collapse" to="#collapseFollow" role="button" aria-expanded="false" aria-controls="collapseFollow">
                                                        Follow
                                                    </Link>
                                                </div>
                                            </div>

                                            <div className="collapse post_follow_pop" id="collapseFollow">
                                                <div className="follow_box">
                                                    <div className="post_by">
                                                        <div className="poster_img"><img src={userImg} alt=""/></div>
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
                                            <div className="post_img"><img src={post} alt=""/></div>
                                        </div>
                                        <div className="post_foot">
                                            <div className="post_actions">
                                                <ul className="ps_links">
                                                    <li><Link to="#"><i className="post_icon ps_like"></i> 185</Link><Link to="#"><i className="post_icon ps_comment"></i> 18 Comments</Link></li>
                                                    <li className="ms-auto">
                                                        <Link className="post_follow" data-bs-toggle="collapse" to="#collapseShareTo" role="button" aria-expanded="false" aria-controls="collapseShareTo">
                                                            <i className="post_icon ps_share"></i> Share
                                                        </Link>
                                                    </li>

                                                </ul>
                                                <div className="collapse collapse_pop" id="collapseShareTo">
                                                    <ul className="shareto">
                                                        <li><i className="post_icon ps_share"></i> Share</li>
                                                        <li><Link to="#">Facebook</Link></li>
                                                        <li><Link to="#">Twitter</Link></li>
                                                        <li><Link to="#">Linkedin</Link></li>
                                                        <li><Link to="#">Reddit</Link></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                {/* <div className="post">
                                        <div className="post_head">
                                            <div className="post_by">
                                                <div className="poster_img"><img src={userImg} alt=""/></div>
                                                <div className="poster_info">
                                                    <div className="poster_name">Sushant Gandhi</div>
                                                    <Link to="#">Follow</Link>
                                                </div>
                                            </div>
                                            <div className="post_on">Date : 12th March 2021 <span>|</span> Category : Clothing & Accessories</div>
                                        </div>
                                        <div className="post_body">
                                            <div className="post_text">
                                                <h4>Nullam pellentesque turpis quis dolor gravida, at mollis lorem sollicitudin commodo tempor eget sagittis justo</h4>
                                                <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the an unknown...</p>
                                            </div>
                                            <div className="post_img"><img src={post2} alt=""/></div>
                                        </div>
                                        <div className="post_foot">
                                            <div className="post_actions">
                                                <ul className="ps_links">
                                                    <li>
                                                        <Link to="#"><i className="post_icon ps_like"></i> 185</Link>
                                                        <Link data-bs-toggle="collapse" to="#collapseComments" role="button" aria-expanded="false" aria-controls="collapseComments"><i className="post_icon ps_comment"></i> 18 Comments</Link>
                                                    </li>
                                                    <li className="ms-auto"><Link to="#"><i className="post_icon ps_share"></i> Share</Link></li>
                                                </ul>
                                            </div>
                                            <div className="collapse post_comments" id="collapseComments">
                                                <ul className="comnt_list">
                                                    <li>
                                                        <div className="add_commnt">
                                                            <div className="avtar_img"><img className="img-fluid" src={userImg} alt=""/></div>
                                                            <div className="add_comnt">
                                                                <div className="ac_box">
                                                                    <textarea className="form-control" placeholder="Add Comment" name="" id="" rows="3"></textarea>
                                                                    <button type="submit" className="btn btn_yellow custom_btn">Add Comment</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <div className="commnt_box">
                                                            <div className="avtar_img"><img className="img-fluid" src={userImg} alt=""/></div>
                                                            <div className="commnt_text">
                                                                <div className="commnt_body">
                                                                    <div className="commnt_by">
                                                                        <div className="cb_name">mathew John</div>
                                                                        <div className="cb_date">7-9-2021</div>
                                                                    </div>
                                                                    <p>Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc</p>
                                                                </div>
                                                                <Link to="#" className="reply_link">Reply</Link>
                                                            </div>
                                                        </div>
                                                        <Link to="#" className="btn load_more_post">view more comment</Link>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div> */}
                            </div>
                            <div className="col-lg-3">
                                <div className="cumm_sidebar_box bg-white p-3 rounded-3">
                                    <div className="cumm_title">My Post <br />advanced filter</div>
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

export default CommunityProfile;