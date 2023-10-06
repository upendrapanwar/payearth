import React, { Component, useState } from 'react';
import { ReactDOM } from 'react';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import redHeartIcon from './../../assets/icons/red-heart-icon-filled.svg';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/reducers/global-reducer';
import SpinnerLoader from './../../components/common/SpinnerLoader';
import oneImage from './../../assets/images/1.jpg';
import ellipsis from './../../assets/images/ellipsis.png';
import smileicon from './../../assets/images/smile.png'; 
import { connect } from 'react-redux';
import store from '../../store/index';
import axios from 'axios';
import { Link } from 'react-router-dom';
import EmojiPicker from 'emoji-picker-react';

class ManageCommunity extends Component {
    constructor(props) {
        super(props);
        //this.box = React.createRef();
        this.state = {selectedMenu:null,postComment: '',showEmoji: false};
        
    }
    /*
    componentDidMount() {
        // Adding a click event listener
        document.addEventListener('click', this.handleOutsideClick);
    }
    handleOutsideClick = (event) => {
        if (this.box && !this.box.current.contains(event.target)) {
        alert('you just clicked outside of box!');
        }
    }*/
    onClickMenu = (e) => {
        e.preventDefault();
        this.setState({
            selectedMenu : e.target.alt
            },()=>console.log(this.state.selectedMenu));
        //this.state.selectedMenu = e.target.alt;
        //console.log(typeof(this.state.selectedMenu));
        
        
    };
    onClickEmoji = (e) => {
        e.preventDefault();
        this.setState({
            showEmoji : !this.state.showEmoji
            },()=>console.log(this.state.showEmoji));
    }
    onEmojiClick = (e,emojiObject) => {
        var currentEmoji = ''
        this.setState({
            postComment : this.state.postComment + emojiObject.emoji,
            
            },()=>console.log(this.state.postComment));
        
    }
    setCommentText = (e) => {
        this.setState({
            postComment : e.target.value
            },()=>console.log(this.state.postComment));
    }
    render() {
        
        const { dispatch } = this.props;

        const { loading } = store.getState().global;

        setTimeout(() => {
            
            dispatch(setLoading({ loading: false }));
        }, 300);

        
        return (
            <React.Fragment>

                <Header />
                <div className="cumm_page_wrap pt-5 pb-1 cummunity_page_wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-9">
                            <div className="createpost bg-white rounded-3">
                                <div className="cp_top">
                                    <div className="cumm_title">Create your post</div>
                                </div>
                                <div className="cp_body">
                                    <div className="com_user_acc">
                                        <a href="/community-profile">
                                            <div className="com_user_img"><img src={oneImage} alt=""/></div>
                                        </a>
                                        <div className="com_user_name">
                                            <div className="cu_name">Robert Evans </div><select className="form-select" aria-label="Default select example"><option>Followers</option><option value="1">Public</option><option value="2">Only Me</option></select></div>
                                    </div>
                                    <div className="create_post_input">
                                        <grammarly-extension data-grammarly-shadow-root="true" style={{position: "absolute", top: "0px", left: "0px", pointerEvents: "none"}} className="cGcvT"></grammarly-extension>
                                        <grammarly-extension data-grammarly-shadow-root="true" style={{mixBlendMode: "darken", position: "absolute", top: "0px", left: "0px", pointerEvents: "none"}} className="cGcvT"></grammarly-extension><textarea className="postcomment input-style" placeholder="What's on your mind?" rows="6" cols="50" spellcheck="false" value={this.state.postComment} onChange={this.setCommentText}/><img class="emoji-icon"  src={smileicon} onClick={this.onClickEmoji}/>
                                        {(this.state.showEmoji) ? 
                                        <div className="picker-container"><EmojiPicker onEmojiClick={this.onEmojiClick} disableAutoFocus={true} previewConfig={{
           showPreview: false
           
         }}/></div> : null}
                                        
                                        
                                    </div>
                                </div>
                                <div className="cp_box">
                                    <div className="cp_preview_box">
                                        <div className="mb-2 mt-2 video_preview">
                                            <ul className="load_imgs"></ul>
                                        </div>
                                        <div className="mb-2 mt-2 img_preview">
                                            <ul className="load_imgs "></ul>
                                        </div>
                                    </div>
                                    <div className="cp_foot">
                                        <div className="cp_action_grp ">
                                            <div className="cp_upload_btn cp_upload_img"><input type="file" id="post_img" accept="image/*" multiple=""/></div>
                                            <div className="cp_upload_btn cp_upload_video"><input type="file" id="post_video" accept="video/*" multiple=""/></div>
                                            <div className="sort_select text-normal css-2b097c-container"><span aria-live="polite" aria-atomic="false" aria-relevant="additions text" className="css-7pg0cj-a11yText"></span>
                                                <div className=" css-yk16xz-control">
                                                    <div className=" css-1hwfws3">
                                                        <div className=" css-1uccc91-singleValue">Choose Category</div>
                                                        <div className="css-1g6gooi">
                                                            <div className="" style={{display: "inline-block"}}><input autocapitalize="none" autocomplete="off" autocorrect="off" id="react-select-3-input" spellcheck="false" tabindex="0" type="text" aria-autocomplete="list" value="" style={{boxSizing: "content-box", width: "2px", background: "0px center", border: "0px", fontSize: "inherit", opacity: "1", outline: "0px", padding: "0px", color: "inherit"}}/>
                                                                <div style={{position: "absolute", top: "0px", left: "0px", visibility: "hidden", height: "0px", overflow: "scroll", whiteSpace: "pre",fontSize: "15px", fontFamily: "Montserrat, sans-serif", fontWeight: "400", fontStyle: "normal", letterSpacing: "normal", textTransform: "none"}}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className=" css-1wy0on6"><span className=" css-1okebmr-indicatorSeparator"></span>
                                                        <div className=" css-tlfecz-indicatorContainer" aria-hidden="true"><svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="css-8mmkcg"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="sort_select text-normal css-2b097c-container"><span aria-live="polite" aria-atomic="false" aria-relevant="additions text" className="css-7pg0cj-a11yText"></span>
                                                <div className=" css-yk16xz-control">
                                                    <div className=" css-1hwfws3">
                                                        <div className=" css-1uccc91-singleValue">Choose Product</div>
                                                        <div className="css-1g6gooi">
                                                            <div className="" style={{display: "inline-block"}}><input autocapitalize="none" autocomplete="off" autocorrect="off" id="react-select-4-input" spellcheck="false" tabindex="0" type="text" aria-autocomplete="list" value="" style={{boxSizing: "content-box", width: "2px", background: "0px center", border: "0px", fontSize: "inherit", opacity: "1", outline: "0px", padding: "0px", color: "inherit"}}/>
                                                                <div style={{position: "absolute", top: "0px", left: "0px", visibility: "hidden", height: "0px", overflow: "scroll", whiteSpace: "pre", fontSize: "15px", fontFamily: "Montserrat, sans-serif", fontWeight: "400", fontStyle: "normal", letterSpacing: "normal", textTransform: "none"}}></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className=" css-1wy0on6"><span className=" css-1okebmr-indicatorSeparator"></span>
                                                        <div className=" css-tlfecz-indicatorContainer" aria-hidden="true"><svg height="20" width="20" viewBox="0 0 20 20" aria-hidden="true" focusable="false" className="css-8mmkcg"><path d="M4.516 7.548c0.436-0.446 1.043-0.481 1.576 0l3.908 3.747 3.908-3.747c0.533-0.481 1.141-0.446 1.574 0 0.436 0.445 0.408 1.197 0 1.615-0.406 0.418-4.695 4.502-4.695 4.502-0.217 0.223-0.502 0.335-0.787 0.335s-0.57-0.112-0.789-0.335c0 0-4.287-4.084-4.695-4.502s-0.436-1.17 0-1.615z"></path></svg></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div><button className="btn custom_btn btn_yellow mx-auto">Post</button></div>
                                </div>
                            </div>

                            <div className="community_listing_wrap">

                                <div className="cumm_title">All Listing</div>
                                
                                <div className="post">
                                    <div className="post_head">
                                        <div className="post_by">
                                            <div className="poster_img "><img src="https://143.244.158.217:7700/uploads/users/2.jpg" alt=""/></div>
                                            <div className="poster_info">
                                                <div className="poster_name">Ryan Smith</div><time datetime="2022-05-06T10:51:29.988Z" title="Friday, May 6, 2022 at 4:21:29 PM">6 months ago</time></div>
                                        </div>
                                        <div className="post_on">Category : <a href="#">Milk &amp; Honey Book</a></div>
                                        <div className="post_action">
                                            <div className="post-opts">
                                                <a href="#" title="" className="ed-opts-open" ><img src={ellipsis} alt="1" onClick={this.onClickMenu}/></a>
                                                
                                                <ul className={(this.state.selectedMenu === "1") ? 'ed-options showEmoji' : 'ed-options hideEmoji'}>
                                                    <li><a href="#" title={this.state.selectedMenu}>Block user</a></li>
                                                    <li><a href="#" title="test">Ban user</a></li>
                                                    <li><a href="#" title="">Hide Post</a></li>
                                                    <li><a href="#" title="">Report Abuse</a></li>
                                                    <li><a href="#" title="">Unfollow User</a></li>
                                                </ul>
                                                
                                            </div>
                                        </div>

                                    </div>
                                    <div className="post_body">
                                        <div className="post_text">
                                            <h3>Introduction your self!</h3>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tincidunt porta lectus a mollis. Curabitur ut convallis tortor. Aliquam erat volutpat. Nullam dictum enim ac urna suscipit, nec laoreet dolor pellentesque.😁</p>
                                        </div>

                                    </div>
                                    <div className="post_foot">
                                        <div className="post_actions">
                                            <ul className="ps_links">
                                                <li>
                                                    <a href="#"><img src="static/media/heart-icon-bordered.9c5d0551.svg"/> 81</a>

                                                    <a data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="collapseComment6274fdb144f43d2aa8a416fa" href="#"><i className="post_icon ps_comment"></i> 1 Comments</a>
                                                </li>

                                                <li className="cumm_action_button">
                                                    <a className="btn custom_btn btn_yellow edit_cumm" href="#">Edit</a>
                                                    <a className="btn custom_btn btn_yellow_bordered edit_cumm" href="#">Delete</a>
                                                </li>


                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                
                                <div className="post">
                                    <div className="post_head">
                                        <div className="post_by">
                                            <div className="poster_img "><img src="https://143.244.158.217:7700/uploads/users/2.jpg" alt=""/></div>
                                            <div className="poster_info">
                                                <div className="poster_name">Ryan Smith</div><time datetime="2022-05-06T10:51:29.988Z" title="Friday, May 6, 2022 at 4:21:29 PM">6 months ago</time></div>
                                        </div>
                                        <div className="post_on">Category : <a href="#">Milk &amp; Honey Book</a></div>
                                        <div className="post_action">
                                            <div className="post-opts">
                                                <a href="#" title="" className="ed-opts-open"><img src={ellipsis} alt="2" onClick={this.onClickMenu}/></a>
                                                <ul className={(this.state.selectedMenu === "2") ? 'ed-options showEmoji' : 'ed-options hideEmoji'}>
                                                    <li><a href="#" title="">Block user</a></li>
                                                    <li><a href="#" title="">Ban user</a></li>
                                                    <li><a href="#" title="">Hide Post</a></li>
                                                    <li><a href="#" title="">Report Abuse</a></li>
                                                    <li><a href="#" title="">Unfollow User</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="post_body">
                                        <div className="post_text">
                                            <h3>Introduction your self!</h3>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tincidunt porta lectus a mollis. Curabitur ut convallis tortor. Aliquam erat volutpat. Nullam dictum enim ac urna suscipit, nec laoreet dolor pellentesque.😁</p>
                                        </div>

                                    </div>
                                    <div className="post_foot">
                                        <div className="post_actions">
                                            <ul className="ps_links">
                                                <li>
                                                    <a href="#"><img src="static/media/heart-icon-bordered.9c5d0551.svg"/> 81</a>

                                                    <a data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="collapseComment6274fdb144f43d2aa8a416fa" href="#"><i className="post_icon ps_comment"></i> 1 Comments</a>
                                                </li>

                                                <li className="cumm_action_button">
                                                    <a className="btn custom_btn btn_yellow edit_cumm" href="#">Edit</a>
                                                    <a className="btn custom_btn btn_yellow_bordered edit_cumm" href="#">Delete</a>
                                                </li>


                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                
                                <div className="post">
                                    <div className="post_head">
                                        <div className="post_by">
                                            <div className="poster_img "><img src="https://143.244.158.217:7700/uploads/users/2.jpg" alt=""/></div>
                                            <div className="poster_info">
                                                <div className="poster_name">Ryan Smith</div><time datetime="2022-05-06T10:51:29.988Z" title="Friday, May 6, 2022 at 4:21:29 PM">6 months ago</time></div>
                                        </div>
                                        <div className="post_on">Category : <a href="#">Milk &amp; Honey Book</a></div>
                                        <div className="post_action">
                                            <div className="post-opts">
                                                <a href="#" title="" className="ed-opts-open"><img src={ellipsis} alt="3" onClick={this.onClickMenu}/></a>
                                                <ul className={(this.state.selectedMenu === "3") ? 'ed-options showEmoji' : 'ed-options hideEmoji'}>
                                                    <li><a href="#" title="">Block user</a></li>
                                                    <li><a href="#" title="">Ban user</a></li>
                                                    <li><a href="#" title="">Hide Post</a></li>
                                                    <li><a href="#" title="">Report Abuse</a></li>
                                                    <li><a href="#" title="">Unfollow User</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="post_body">
                                        <div className="post_text">
                                            <h3>Introduction your self!</h3>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tincidunt porta lectus a mollis. Curabitur ut convallis tortor. Aliquam erat volutpat. Nullam dictum enim ac urna suscipit, nec laoreet dolor pellentesque.😁</p>
                                        </div>

                                    </div>
                                    <div className="post_foot">
                                        <div className="post_actions">
                                            <ul className="ps_links">
                                                <li>
                                                    <a href="#"><img src="static/media/heart-icon-bordered.9c5d0551.svg"/> 81</a>

                                                    <a data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="collapseComment6274fdb144f43d2aa8a416fa" href="#"><i className="post_icon ps_comment"></i> 1 Comments</a>
                                                </li>

                                                <li className="cumm_action_button">
                                                    <a className="btn custom_btn btn_yellow edit_cumm" href="#">Edit</a>
                                                    <a className="btn custom_btn btn_yellow_bordered edit_cumm" href="#">Delete</a>
                                                </li>


                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                
                                <div className="post">
                                    <div className="post_head">
                                        <div className="post_by">
                                            <div className="poster_img "><img src="https://143.244.158.217:7700/uploads/users/2.jpg" alt=""/></div>
                                            <div className="poster_info">
                                                <div className="poster_name">Ryan Smith</div><time datetime="2022-05-06T10:51:29.988Z" title="Friday, May 6, 2022 at 4:21:29 PM">6 months ago</time></div>
                                        </div>
                                        <div className="post_on">Category : <a href="#">Milk &amp; Honey Book</a></div>
                                        <div className="post_action">
                                            <div className="post-opts">
                                                <a href="#" title="" className="ed-opts-open"><img src={ellipsis} alt="4" onClick={this.onClickMenu}/></a>
                                                <ul className={(this.state.selectedMenu === "4") ? 'ed-options showEmoji' : 'ed-options hideEmoji'}>
                                                    <li><a href="#" title="">Block user</a></li>
                                                    <li><a href="#" title="">Ban user</a></li>
                                                    <li><a href="#" title="">Hide Post</a></li>
                                                    <li><a href="#" title="">Report Abuse</a></li>
                                                    <li><a href="#" title="">Unfollow User</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="post_body">
                                        <div className="post_text">
                                            <h3>Introduction your self!</h3>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tincidunt porta lectus a mollis. Curabitur ut convallis tortor. Aliquam erat volutpat. Nullam dictum enim ac urna suscipit, nec laoreet dolor pellentesque.😁</p>
                                        </div>

                                    </div>
                                    <div className="post_foot">
                                        <div className="post_actions">
                                            <ul className="ps_links">
                                                <li>
                                                    <a href="#"><img src="static/media/heart-icon-bordered.9c5d0551.svg"/> 81</a>

                                                    <a data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="collapseComment6274fdb144f43d2aa8a416fa" href="#"><i className="post_icon ps_comment"></i> 1 Comments</a>
                                                </li>

                                                <li className="cumm_action_button">
                                                    <a className="btn custom_btn btn_yellow edit_cumm" href="#">Edit</a>
                                                    <a className="btn custom_btn btn_yellow_bordered edit_cumm" href="#">Delete</a>
                                                </li>


                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="post">
                                    <div className="post_head">
                                        <div className="post_by">
                                            <div className="poster_img "><img src="https://143.244.158.217:7700/uploads/users/2.jpg" alt=""/></div>
                                            <div className="poster_info">
                                                <div className="poster_name">Ryan Smith</div><time datetime="2022-05-06T10:51:29.988Z" title="Friday, May 6, 2022 at 4:21:29 PM">6 months ago</time></div>
                                        </div>
                                        <div className="post_on">Category : <a href="#">Milk &amp; Honey Book</a></div>
                                        <div className="post_action">
                                            <div className="post-opts">
                                                <a href="#" title="" className="ed-opts-open"><img src={ellipsis} alt="5" onClick={this.onClickMenu}/></a>
                                                <ul className={(this.state.selectedMenu === "5") ? 'ed-options showEmoji' : 'ed-options hideEmoji'}>
                                                    <li><a href="#" title="">Block user</a></li>
                                                    <li><a href="#" title="">Ban user</a></li>
                                                    <li><a href="#" title="">Hide Post</a></li>
                                                    <li><a href="#" title="">Report Abuse</a></li>
                                                    <li><a href="#" title="">Unfollow User</a></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="post_body">
                                        <div className="post_text">
                                            <h3>Introduction your self!</h3>
                                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc tincidunt porta lectus a mollis. Curabitur ut convallis tortor. Aliquam erat volutpat. Nullam dictum enim ac urna suscipit, nec laoreet dolor pellentesque.😁</p>
                                        </div>

                                    </div>
                                    <div className="post_foot">
                                        <div className="post_actions">
                                            <ul className="ps_links">
                                                <li>
                                                    <a href="#"><img src="static/media/heart-icon-bordered.9c5d0551.svg"/> 81</a>

                                                    <a data-bs-toggle="collapse" role="button" aria-expanded="false" aria-controls="collapseComment6274fdb144f43d2aa8a416fa" href="#"><i className="post_icon ps_comment"></i> 1 Comments</a>
                                                </li>

                                                <li className="cumm_action_button">
                                                    <a className="btn custom_btn btn_yellow edit_cumm" href="#">Edit</a>
                                                    <a className="btn custom_btn btn_yellow_bordered edit_cumm" href="#">Delete</a>
                                                </li>

                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className="pagination">
                                    <ul>
                                        <li><a className="link disabled" href="#"><span className="fa fa-angle-left me-2"></span> Prev</a></li>
                                        <li><a className="link active" href="#">1</a></li>
                                        <li><a className="link" href="#">2</a></li>
                                        <li><a className="link" href="#">3</a></li>
                                        <li><a className="link" href="#">4</a></li>
                                        <li><a className="link disabled" href="#">Next <span className="fa fa-angle-right ms-2"></span></a></li>
                                    </ul>
                                </div>


                            </div>

                        </div>
                        <div className="col-lg-3">
                            <div className="cumm_sidebar_box bg-white p-3 rounded-3">
                                <div className="cumm_title">advanced filter</div>
                                <div className="filter_box"><select className="form-select mb-3" aria-label="Default select example"><option>Category</option><option value="1">One</option><option value="2">Two</option><option value="3">Three</option></select><select className="form-select mb-3"
                                        aria-label="Default select example"><option>Product</option><option value="1">One</option><option value="2">Two</option><option value="3">Three</option></select>
                                    <div className="form-check mb-3 mt-4"><input className="form-check-input" type="checkbox" id="latestPost" value=""/><label className="form-check-label" for="latestPost">Latest Post</label></div>
                                    <div className="form-check mb-3"><input className="form-check-input" type="checkbox" id="popularPost" value=""/><label className="form-check-label" for="popularPost">Most Popular Post</label></div>
                                    <div className="form-check mb-3"><input className="form-check-input" type="checkbox" id="CommentedPost" value=""/><label className="form-check-label" for="CommentedPost">Most Commented Post</label></div>
                                    <div className="filter_btn_box"><a className="btn custom_btn btn_yellow_bordered" href="#">Filter</a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
                
                <Footer />

            </React.Fragment>
        );
    }
}

export default connect(setLoading)(ManageCommunity);
