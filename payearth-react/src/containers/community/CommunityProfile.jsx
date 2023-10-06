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
import SpinnerLoader from '../../components/common/SpinnerLoader';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import NotFound from '../../components/common/NotFound';
import axios from 'axios';

const CommunityProfile = () => {
    const userInfo = useSelector(state => state.auth.userInfo);
    const authInfo = useSelector(state => state.auth.authInfo);
    const postsData = useSelector(state => state.post.postsData);
    const loading = useSelector(state => state.global.loading);
    const [posts, setPosts] = useState([]);
    const dispatch = useDispatch();
    const getPosts = () => {
        dispatch(setLoading({ loading: true }))
        axios.get('community/front/posts').then(response => {
            if (response.data.status) {
                let res = response.data.data;
                if (userInfo.role === 'user') {
                   let post= res.filter((value) => value.isSeller === false && value.userId.id === authInfo.id);
                   setPosts(post);
                }
                else {
                    let post= res.filter((value) => value.isSeller === true && value.sellerId.id === authInfo.id);
                    setPosts(post);
                }
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
        getPosts()
    }, [])

    return (
        <React.Fragment>
            {loading === true ? <SpinnerLoader /> : ''}
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
                                            <small>{userInfo.role}</small>
                                        </div>
                                    </div>
                                    <ul>
                                        <li>
                                            <div className="fp_fc">{userInfo.community.followers}</div>
                                            <small>Followers</small>
                                        </li>
                                        <li>
                                            <div className="fp_fc">{userInfo.community.following}</div>
                                            <small>Following</small>
                                        </li>
                                        <li>
                                            <div className="fp_fc">{posts.length}</div>
                                            <small>Posts</small>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className="col-lg-9">
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