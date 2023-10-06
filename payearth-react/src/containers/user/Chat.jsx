import React, { Component } from 'react';
import Header from '../../components/user/common/Header';
import PageTitle from '../../components/user/common/PageTitle';
import Footer from '../../components/common/Footer';
import { Link } from 'react-router-dom';
import addIcon from './../../assets/icons/add.svg';
import chatThumb from './../../assets/images/chat-thumb.jpg';
import { setLoading } from '../../store/reducers/global-reducer'; 
import SpinnerLoader from './../../components/common/SpinnerLoader';
import { toast } from 'react-toastify';
import { connect } from 'react-redux';
import store from '../../store/index';
import NotFound from './../../components/common/NotFound';

class Chat extends Component {
    constructor(props) {
        super(props);
        
        this.authInfo = JSON.parse(localStorage.getItem('authInfo'));
        this.state = {
            data: [],
            reqBody: {
                count: {
                    start: 0,
                    limit: 6
                }
            }
        };
        
        toast.configure();
    }
    
    render() {
        const { dispatch } = this.props;
        
        const { loading } = store.getState().global;
        
        setTimeout(() => {
            dispatch(setLoading({loading: false}));
        }, 300);
        return (
            <React.Fragment>
                { loading === true ? <SpinnerLoader /> : '' }
                <Header />
                <PageTitle title="Chat" />
                <section className="inr_wrap">
                <div class="container">
                    <div class="row">
                        <div class="col-md-12">
                            <div class="chatUser_wrapper">
                                <div class="chatlist_panel">
                                    <div class="chat-lists">

                                        <div class="chat_left-head">
                                            <div class="chat_head_panel">
                                                <div class="chat-heading">
                                                    <h3>Inbox</h3>
                                                </div>
                                                <div class="chat-filter">
                                                    <a href="#">All</a>
                                                    <a href="#">Unread Chat</a>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="chat_user_search">
                                            <div class="msg-search">
                                                <input type="text" class="form-control" id="inlineFormInputGroup" placeholder="Search" aria-label="search"/>
                                                <a class="add" href="#"><img class="img-fluid" src={addIcon} alt="add"/></a>
                                            </div>
                                        </div>
                                        <div class="chat_user_list">

                                            
                                            <div class="chat_user_item">
                                                <a href="#" class="d-flex align-items-center chatUser_info">
                                                    <div class="userInfo-col userThumb">
                                                        <div class="user_thumb">
                                                            <img class="img-fluid" src={chatThumb} alt="user img"/>
                                                        </div>
                                                        <span class="user-inactive user-active"></span>
                                                    </div>
                                                    <div class="userInfo-col userInfo">
                                                        <h3>Edmond Lynch</h3>
                                                        <p>Hello brothere...</p>
                                                    </div>
                                                    <div class="userInfo-col chatTime">
                                                        <div class="chatTime">
                                                            1 mint ago
                                                            <span class="chatNoti-info">3</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            
                                            <div class="chat_user_item">
                                                <a href="#" class="d-flex align-items-center chatUser_info">
                                                    <div class="userInfo-col userThumb">
                                                        <div class="user_thumb">
                                                            <img class="img-fluid" src={chatThumb} alt="user img"/>
                                                        </div>
                                                        <span class="user-inactive user-active"></span>
                                                    </div>
                                                    <div class="userInfo-col userInfo">
                                                        <h3>Edmond Lynch</h3>
                                                        <p>Hello brothere...</p>
                                                    </div>
                                                    <div class="userInfo-col chatTime">
                                                        <div class="chatTime">
                                                            1 mint ago
                                                            <span class="chatNoti-info">3</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            
                                            <div class="chat_user_item">
                                                <a href="#" class="d-flex align-items-center chatUser_info">
                                                    <div class="userInfo-col userThumb">
                                                        <div class="user_thumb">
                                                            <img class="img-fluid" src={chatThumb} alt="user img"/>
                                                        </div>
                                                        <span class="user-inactive"></span>
                                                    </div>
                                                    <div class="userInfo-col userInfo">
                                                        <h3>Edmond Lynch</h3>
                                                        <p>Hello brothere...</p>
                                                    </div>
                                                    <div class="userInfo-col chatTime">
                                                        <div class="chatTime">
                                                            1 mint ago
                                                            <span class="chatNoti-info">3</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            
                                            <div class="chat_user_item">
                                                <a href="#" class="d-flex align-items-center chatUser_info">
                                                    <div class="userInfo-col userThumb">
                                                        <div class="user_thumb">
                                                            <img class="img-fluid" src={chatThumb} alt="user img"/>
                                                        </div>
                                                        <span class="user-inactive"></span>
                                                    </div>
                                                    <div class="userInfo-col userInfo">
                                                        <h3>Edmond Lynch</h3>
                                                        <p>Hello brothere...</p>
                                                    </div>
                                                    <div class="userInfo-col chatTime">
                                                        <div class="chatTime">
                                                            1 mint ago
                                                            <span class="chatNoti-info">3</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            
                                            <div class="chat_user_item">
                                                <a href="#" class="d-flex align-items-center chatUser_info">
                                                    <div class="userInfo-col userThumb">
                                                        <div class="user_thumb">
                                                            <img class="img-fluid" src={chatThumb} alt="user img"/>
                                                        </div>
                                                        <span class="user-inactive"></span>
                                                    </div>
                                                    <div class="userInfo-col userInfo">
                                                        <h3>Edmond Lynch</h3>
                                                        <p>Hello brothere...</p>
                                                    </div>
                                                    <div class="userInfo-col chatTime">
                                                        <div class="chatTime">
                                                            1 mint ago
                                                            <span class="chatNoti-info">3</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            
                                            <div class="chat_user_item">
                                                <a href="#" class="d-flex align-items-center chatUser_info">
                                                    <div class="userInfo-col userThumb">
                                                        <div class="user_thumb">
                                                            <img class="img-fluid" src={chatThumb} alt="user img"/>
                                                        </div>
                                                        <span class="user-inactive"></span>
                                                    </div>
                                                    <div class="userInfo-col userInfo">
                                                        <h3>Edmond Lynch</h3>
                                                        <p>Hello brothere...</p>
                                                    </div>
                                                    <div class="userInfo-col chatTime">
                                                        <div class="chatTime">
                                                            1 mint ago
                                                            <span class="chatNoti-info">3</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    
                                    <div class="chat_board_view">
                                        <div class="d-flex align-items-center message-user-head">
                                            <div class="userInfo-col userThumb">
                                                <div class="user_thumb">
                                                    <img class="img-fluid" src={chatThumb} alt="user img"/>
                                                </div>
                                                <span class="user-inactive user-active"></span>
                                            </div>
                                            <div class="userInfo-col userInfo">
                                                <h3>Edmond Lynch</h3>
                                            </div>
                                        </div>

                                        <div class="msg-body">
                                            <ul>
                                                <li class="sender">
                                                    <div class="userThumb">
                                                        <div class="user_thumb">
                                                            <img class="img-fluid" src={chatThumb} alt="user img"/>
                                                        </div>
                                                        <span class="user-inactive user-active"></span>
                                                    </div>
                                                    <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                    <span class="time">10:06 am</span>
                                                </li>
                                                <li class="repaly">
                                                    <p> Lorem Ipsum is simply dummy text of the printing.</p>
                                                    <span class="time">10:20 am</span>
                                                </li>
                                                <li class="sender">
                                                    <div class="userThumb">
                                                        <div class="user_thumb">
                                                            <img class="img-fluid" src={chatThumb} alt="user img"/>
                                                        </div>
                                                        <span class="user-inactive user-active"></span>
                                                    </div>
                                                    <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
                                                    <span class="time">10:26 am</span>
                                                </li>
                                                <li class="sender">
                                                    <div class="userThumb">
                                                        <div class="user_thumb">
                                                            <img class="img-fluid" src={chatThumb} alt="user img"/>
                                                        </div>
                                                        <span class="user-inactive user-active"></span>
                                                    </div>
                                                    <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                    <span class="time">10:32 am</span>
                                                </li>
                                                <li class="repaly">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                    <span class="time">10:35 am</span>
                                                </li>
                                                <li class="repaly">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                    <span class="time">junt now</span>
                                                </li>

                                            </ul>
                                        </div>

                                        <div class="send-box">
                                            <form action="">
                                                <input type="text" class="form-control" aria-label="message…" placeholder="Write message…"/>

                                                <button type="button"><i class="fa fa-paper-plane" aria-hidden="true"></i> Send</button>
                                            </form>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                </section>
                <Footer />
            </React.Fragment>
        );
    }
}

export default connect(setLoading) (Chat);