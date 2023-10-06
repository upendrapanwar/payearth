import React, { Component } from 'react';
import Header from '../../components/admin/common/Header';
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
        const {dispatch} = props;
        this.dispatch = dispatch;
        this.dispatch(setLoading({loading: true}));
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
    componentDidMount() {
        setTimeout(() => {
            this.dispatch(setLoading({ loading: false })); 
            document.getElementsByTagName("BODY")[0].removeAttribute("data-bs-overflow");
    
        }, 5000);
        
        var element = document.getElementsByTagName("BODY")[0];    
        element.style.overflow = 'unset';
    }
    render() {
        const { dispatch } = this.props;
        
        const { loading } = store.getState().global;
        
        
        return (
            <React.Fragment>
                { loading ? <SpinnerLoader /> : '' }
                <Header />
                
                <section className="inr_wrap">
                <div className="container">
                
                    <div className="row">
                        <div className="col-md-12">
                            <div className="chatUser_wrapper">
                                <div className="chatlist_panel">
                                
                                    <div className="chat-lists">

                                        <div className="chat_left-head">
                                            <div className="chat_head_panel">
                                            
                                                <div className="chat-heading">
                                                    <h3>Inbox</h3>
                                                </div>
                                                <div className="chat-filter">
                                                    <a href="#">All</a>
                                                    <a href="#">Unread Chat</a>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="chat_user_search">
                                            <div className="msg-search">
                                                <input type="text" className="form-control" id="inlineFormInputGroup" placeholder="Search" aria-label="search"/>
                                                <a className="add" href="#"><img className="img-fluid" src={addIcon} alt="add"/></a>
                                            </div>
                                        </div>
                                        <div className="chat_user_list">

                                            
                                            <div className="chat_user_item">
                                                <a href="#" className="d-flex align-items-center chatUser_info">
                                                    <div className="userInfo-col userThumb">
                                                        <div className="user_thumb">
                                                            <img className="img-fluid" src={chatThumb} alt="user img"/>
                                                        </div>
                                                        <span className="user-inactive user-active"></span>
                                                    </div>
                                                    <div className="userInfo-col userInfo">
                                                        <h3>Edmond Lynch</h3>
                                                        <p>Hello brothere...</p>
                                                    </div>
                                                    <div className="userInfo-col chatTime">
                                                        <div className="chatTime">
                                                            1 mint ago
                                                            <span className="chatNoti-info">3</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            
                                            <div className="chat_user_item">
                                                <a href="#" className="d-flex align-items-center chatUser_info">
                                                    <div className="userInfo-col userThumb">
                                                        <div className="user_thumb">
                                                            <img className="img-fluid" src={chatThumb} alt="user img"/>
                                                        </div>
                                                        <span className="user-inactive user-active"></span>
                                                    </div>
                                                    <div className="userInfo-col userInfo">
                                                        <h3>Edmond Lynch</h3>
                                                        <p>Hello brothere...</p>
                                                    </div>
                                                    <div className="userInfo-col chatTime">
                                                        <div className="chatTime">
                                                            1 mint ago
                                                            <span className="chatNoti-info">3</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            
                                            <div className="chat_user_item">
                                                <a href="#" className="d-flex align-items-center chatUser_info">
                                                    <div className="userInfo-col userThumb">
                                                        <div className="user_thumb">
                                                            <img className="img-fluid" src={chatThumb} alt="user img"/>
                                                        </div>
                                                        <span className="user-inactive"></span>
                                                    </div>
                                                    <div className="userInfo-col userInfo">
                                                        <h3>Edmond Lynch</h3>
                                                        <p>Hello brothere...</p>
                                                    </div>
                                                    <div className="userInfo-col chatTime">
                                                        <div className="chatTime">
                                                            1 mint ago
                                                            <span className="chatNoti-info">3</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            
                                            <div className="chat_user_item">
                                                <a href="#" className="d-flex align-items-center chatUser_info">
                                                    <div className="userInfo-col userThumb">
                                                        <div className="user_thumb">
                                                            <img className="img-fluid" src={chatThumb} alt="user img"/>
                                                        </div>
                                                        <span className="user-inactive"></span>
                                                    </div>
                                                    <div className="userInfo-col userInfo">
                                                        <h3>Edmond Lynch</h3>
                                                        <p>Hello brothere...</p>
                                                    </div>
                                                    <div className="userInfo-col chatTime">
                                                        <div className="chatTime">
                                                            1 mint ago
                                                            <span className="chatNoti-info">3</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            
                                            <div className="chat_user_item">
                                                <a href="#" className="d-flex align-items-center chatUser_info">
                                                    <div className="userInfo-col userThumb">
                                                        <div className="user_thumb">
                                                            <img className="img-fluid" src={chatThumb} alt="user img"/>
                                                        </div>
                                                        <span className="user-inactive"></span>
                                                    </div>
                                                    <div className="userInfo-col userInfo">
                                                        <h3>Edmond Lynch</h3>
                                                        <p>Hello brothere...</p>
                                                    </div>
                                                    <div className="userInfo-col chatTime">
                                                        <div className="chatTime">
                                                            1 mint ago
                                                            <span className="chatNoti-info">3</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                            
                                            <div className="chat_user_item">
                                                <a href="#" className="d-flex align-items-center chatUser_info">
                                                    <div className="userInfo-col userThumb">
                                                        <div className="user_thumb">
                                                            <img className="img-fluid" src={chatThumb} alt="user img"/>
                                                        </div>
                                                        <span className="user-inactive"></span>
                                                    </div>
                                                    <div className="userInfo-col userInfo">
                                                        <h3>Edmond Lynch</h3>
                                                        <p>Hello brothere...</p>
                                                    </div>
                                                    <div className="userInfo-col chatTime">
                                                        <div className="chatTime">
                                                            1 mint ago
                                                            <span className="chatNoti-info">3</span>
                                                        </div>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    
                                    <div className="chat_board_view">
                                        <div className="d-flex align-items-center message-user-head">
                                            <div className="userInfo-col userThumb">
                                                <div className="user_thumb">
                                                    <img className="img-fluid" src={chatThumb} alt="user img"/>
                                                </div>
                                                <span className="user-inactive user-active"></span>
                                            </div>
                                            <div className="userInfo-col userInfo">
                                                <h3>Edmond Lynch</h3>
                                            </div>
                                        </div>

                                        <div className="msg-body">
                                            <ul>
                                                <li className="sender">
                                                    <div className="userThumb">
                                                        <div className="user_thumb">
                                                            <img className="img-fluid" src={chatThumb} alt="user img"/>
                                                        </div>
                                                        <span className="user-inactive user-active"></span>
                                                    </div>
                                                    <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                    <span className="time">10:06 am</span>
                                                </li>
                                                <li className="repaly">
                                                    <p> Lorem Ipsum is simply dummy text of the printing.</p>
                                                    <span className="time">10:20 am</span>
                                                </li>
                                                <li className="sender">
                                                    <div className="userThumb">
                                                        <div className="user_thumb">
                                                            <img className="img-fluid" src={chatThumb} alt="user img"/>
                                                        </div>
                                                        <span className="user-inactive user-active"></span>
                                                    </div>
                                                    <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry. </p>
                                                    <span className="time">10:26 am</span>
                                                </li>
                                                <li className="sender">
                                                    <div className="userThumb">
                                                        <div className="user_thumb">
                                                            <img className="img-fluid" src={chatThumb} alt="user img"/>
                                                        </div>
                                                        <span className="user-inactive user-active"></span>
                                                    </div>
                                                    <p> Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                    <span className="time">10:32 am</span>
                                                </li>
                                                <li className="repaly">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                    <span className="time">10:35 am</span>
                                                </li>
                                                <li className="repaly">
                                                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry.</p>
                                                    <span className="time">junt now</span>
                                                </li>

                                            </ul>
                                        </div>

                                        <div className="send-box">
                                            <form action="">
                                                <input type="text" className="form-control" aria-label="message…" placeholder="Write message…"/>

                                                <button type="button"><i className="fa fa-paper-plane" aria-hidden="true"></i> Send</button>
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