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
import { Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { connect } from 'react-redux';
import store from '../../store/index';
import axios from 'axios';
import searchIcon from './../../assets/icons/search.svg'
import Modal from "react-bootstrap/Modal";
import io from 'socket.io-client'
import { NotFound } from './../../components/common/NotFound';


class Chat extends Component {
    constructor(props) {
        super(props);
        this.userInfo = store.getState().auth.userInfo;
        this.authInfo = JSON.parse(localStorage.getItem('authInfo'));
        this.state = {

            search: "",
            users: "",
            allChatUsers: "",
            show: false,
            showModal: false,
            showAddUser: false,
            showAddUserModal: false,
            groupName: "",
            selectedUsers: [],
            sendChatData: '',
            userChat: '',
            socketConnected: false,
            selectUserId: "",
            notAddedUser: "",
            notification: [],
            showChatUsers: true,
        };

        this.socket = io.connect(process.env.REACT_APP_SOCKET_SERVER_URL);
        this.handleMessageContent = this.handleMessageContent.bind(this)
        // this.accessChat = this.accessChat.bind(this)
        this.sendMessage = this.sendMessage.bind(this)

        const userId = this.authInfo.id



        this.socket.on('receive_notification', (notification) => {
            // console.log("receive_notification", notification)

            if (notification.id === this.authInfo.id) {
                this.setState({
                    notification: notification
                })
            }
        })

        this.socket.on('message_recieved', (data) => {
            // console.log("message_recieved from server..", data)

            // { data.chat._id !== this.allChatUsers._id ? <> No NOTIFICATION </> : <> YES NOTIFICATION</> }



            // if (this.allChatUsers.id !== data.chat.id) {
            //     if (!this.notification.includes(data)) {
            //         this.setState({
            //             notification: [data, ...this.notification]
            //         })
            //         // update list of chat
            //     }
            // } else {
            //     this.setState(prevState => ({
            //         userChat: [...prevState.userChat, data]
            //     }));

            // }

            // if (this.allChatUsers._id === data.chat._id) {
            //     console.log(`chatID is match ${this.allChatUsers._id} or ${data.chat._id}`)
            // }

            this.setState(prevState => ({
                userChat: [...prevState.userChat, data]
            }));
        })
    }
    // this will run

    componentDidMount() {
        this.fetchAllUserData();
    }
    // componentDidUpdate() {

    //     const {allChatUsers} = this.setState;
    //     console.log("allChatUsers in component did mount...", allChatUsers)
    //     this.socket.on('message_recieved', (data) => {
    //         console.log("message_recieved in componentDidUpdate.....", data)
    //         // if (data.chat._id !== this.allChatUsers._id) {
    //         //     console.log("no NOTIFICATION")
    //         // } else {
    //         //     console.log("yes NOTIFICATION")
    //         // }
    //     })
    // }


    // componentWillUnmount() {
    //     this.socket.close();
    // }

    // connectSocket = () => {
    //     const { selectUserId } = this.state;
    //     console.log("connectSocket : : ", selectUserId)
    //     this.socket = io("https://localhost:7700");
    //     this.socket.emit("setup", selectUserId);
    //     this.socket.on('connection', () => {
    //         console.log("hdgfshfgshgsdhgshdgh")
    //         this.setState({ socketConnected: true })
    //     })
    // }

    fetchAllUserData = () => {
        this.setState({ users: "" })
        this.setState({ search: "" })
        this.setState({ showChatUsers: true })
        try {
            const authorId = this.authInfo.id
            const url = `/user/fetchChat/${authorId}`
            axios.get(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            }).then((response) => {
                const users = response.data.data
                // console.log("users from reciving notification.....", users)
                // const isGroupchat = users.filter(item => item.isGroupChat === true && item.chatUsers.length > 2)


                // const isOneChat = users.filter(item => item.isGroupChat === false)
                // const data = res.map(item => item.usersAll[0].users)
                // // const data = users.map(item => item.usersAll[0].users)
                // console.log("chatName", res.map(item => item.chatName))
                this.setState({ allChatUsers: users })

            }).catch((error) => {
                console.log("error", error)
            });
        } catch (error) {
            console.log("error")
        }

    }

    fetchAllBlockChat = () => {
        try {
            const authorId = this.authInfo.id
            const url = `/user/fetchBlockChat/${authorId}`
            axios.get(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            }).then((response) => {
                const blockChat = response.data.data;
                // console.log("blockChat", blockChat)

                const userBlockData = blockChat.filter(item => item.blockByUser === this.authInfo.id)
                // console.log("userBlockData", userBlockData);
                this.setState({ allChatUsers: userBlockData })

            }).catch((error) => {
                console.log("error", error)
            });
        } catch (error) {
            console.log("error")
        }
    }

    handleSearch = async () => {
        if (!this.state.search) {
            toast.error("Please enter somthing in search", { autoClose: 3000 })
        } else {
            try {
                const response = await axios.get(`/user/getAllUser?search=${this.state.search}`, {
                    headers: {
                        'Authorization': `Bearer ${this.authInfo.token}`
                    },
                });
                // this.setState({ allChatUsers: response.data.data });
                this.setState({ users: response.data.data });
                this.setState({ search: "" });
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        }
    };

    selectAllUsers = async () => {
        try {
            const response = await axios.get(`/user/getAllUser`, {
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`
                },
            });
            // this.setState({ allChatUsers: response.data.data });
            this.setState({ users: response.data.data });
            this.setState({ search: "" });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }


    // createGroupChat
    createGroupChat = () => {
        // const selectedUsers = this.convertArrayToObject();
        const { groupName, selectedUsers } = this.state;
        // console.log("User selected data", selectedUsers)
        // console.log("groupName", groupName)

        if (selectedUsers.length > 1) {
            try {
                const url = '/user/createGroupChat';
                const receiverData = selectedUsers.map(receiver => ({
                    id: receiver._id,
                    name: receiver.name,
                    image_url: receiver.image_url
                }));
                // console.log("receiverData", receiverData)
                // const data = { receiverId, authorId }
                axios.post(url, {
                    receiverId: receiverData,
                    authorId: {
                        id: this.authInfo.id,
                        name: this.userInfo.name,
                        image_url: this.userInfo.imgUrl,
                        isGroupAdmin: true
                    },
                    groupName: groupName,
                }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': `Bearer ${this.authInfo.token}`
                    }
                }).then((response) => {
                    // console.log("response data form group", response.data.data)
                    const data = response.data.data
                    this.setState({ showModal: false });
                    this.fetchAllUserData();
                    this.getAllMessage(data._id)

                }).catch((error) => {
                    console.log("error", error);
                });
            } catch (error) {
                console.log("error", error)
            }
        }
    }

    accessChat = (data) => {
        // console.log("User selected data", data)
        try {
            const url = '/user/accessChat';
            // const data = { receiverId, authorId }
            axios.post(url, {
                receiverId: {
                    id: data.id,
                    name: data.name,
                    image_url: data.image_url
                },
                authorId: {
                    id: this.authInfo.id,
                    name: this.userInfo.name,
                    image_url: this.userInfo.imgUrl,
                }
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            }).then((response) => {
                const datas = response.data.data
                // console.log("accessChat function ", data.id);
                // console.log("Join room ", datas._id)
                this.socket.emit('join chat', datas._id);
                // this.socket.emit("setup", data.id);

                // this.socket.emit("send_notification", data)

                // this.socket.emit("notification_send", data);

                this.sendNotification(data.id, datas)
                if (response.data.status === true) {
                    // toast.success("New Chat Created.....", { autoClose: 3000 })
                    this.fetchAllMessage(datas)
                    this.fetchAllUserData();
                }
            }).catch((error) => {
                console.log("error", error);
            });
        } catch (error) {
            console.log("error", error)
        }
    }


    sendNotification = (id, datas) => {
        this.socket.emit('send_notification', { id, message: datas });
    };
    // // send test notification 

    // sendTestNotification = () => {
    //     console.log("<<<<<<<,Notification Function is run>>>>>>>>>>>>")
    //     const userId = '611cae612d448037f018266d'
    //     this.socket.emit('sendNotification', { userId, message: 'Hello, this is a test notification!' });
    // };

    fetchAllMessage = (data) => {
        // console.log("fetchAllMessage function ", data)
        if (data.isGroupChat === false) {
            const userID = data.chatUsers[0].id !== this.authInfo.id ? data.chatUsers[0].id : data.chatUsers[1].id;
            this.setState({ selectUserId: userID });
            this.socket.emit("setup", userID);
            this.getAllMessage(data._id)
            const result = {
                chatId: data._id,
                id: data.chatUsers[0].id !== this.authInfo.id ? data.chatUsers[0].id : data.chatUsers[1].id,
                name: data.chatUsers[0].id !== this.authInfo.id ? data.chatUsers[0].name : data.chatUsers[1].name,
                image_url: data.chatUsers[0].id !== this.authInfo.id ? data.chatUsers[0].image_url : data.chatUsers[1].image_url,
                isGroupAdmin: data.chatUsers[0].id !== this.authInfo.id ? data.chatUsers[0].isGroupAdmin : data.chatUsers[1].isGroupAdmin,
                isBlock: data.isBlock,
                blockByUser: data.blockByUser
            }
            this.setState({ sendChatData: result })

        } else {
            // console.log(" group data", data);
            const groupData = data.chatUsers
            const groupUsers = groupData.map(item => item.id);
            this.socket.emit("setup", groupUsers);
            const isGroupAdmin = groupData.filter(item => item.isGroupAdmin === true)
            this.getAllMessage(data._id)
            // console.log('Its a group chat...');
            const result = {
                chatId: data._id,
                name: data.chatName,
                isBlock: data.isBlock,
                groupData: groupData,
                isGroupAdmin: isGroupAdmin,
                isGroup: true
            }
            // console.log("Group data result", result)
            // this.setState({ allChatUsers: result.groupData });
            this.setState({ sendChatData: result })
        }
    }

    getAllMessage = (chatId) => {
        axios.get(`user/allMessages/${chatId}`, {
            headers: {
                'Authorization': `Bearer ${this.authInfo.token}`
            },
        }).then((response) => {
            if (response.data.status === true) {
                const data = response.data.data;
                // console.log("getAllMessage function ", data)
                this.setState({
                    userChat: data
                })
            } else {
                this.setState({
                    userChat: ""
                })
            }
            this.socket.emit('join chat', chatId);
        }).catch((error) => {
            console.log("Error", error)
        })

    }

    sendMessage = () => {
        const { sendChatData, messageContent } = this.state;
        try {
            const url = '/user/sendMessage';
            // const data = { receiverId, authorId }
            axios.post(url, {
                authorId: {
                    id: this.authInfo.id,
                    name: this.userInfo.name,
                    image_url: this.userInfo.imgUrl,
                },
                chatId: sendChatData.chatId,
                messageContent: messageContent

            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            }).then((response) => {
                // console.log("send Message", response.data.data)
                const data = response.data.data;
                // console.log("data", data)
                if (response.data.status === true) {
                    this.socket.emit("new message", data)
                    // console.log("SendChatData under send msg>>>", sendChatData)
                    this.getAllMessage(sendChatData.chatId)

                }
            }).catch((error) => {
                console.log("error", error);
            });
            this.setState({ messageContent: "" })
        } catch (error) {
            console.log("error", error)
        }
    }

    handleMessageContent = (e) => {
        this.setState({ messageContent: e.target.value })
    }

    handleSearchText = async (e) => {
        this.setState({ search: e.target.value })

        try {
            const search = e.target.value;
            const response = await axios.get(`/user/getAllUser?search=${search}`, {
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`
                },
            });
            // this.setState({ allChatUsers: response.data.data });
            this.setState({ users: response.data.data });
            // this.setState({ search: "" });
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    }
    handleCreateGroup = () => {
        this.setState({ showModal: true });
    };
    handleGroupName = (e) => {
        this.setState({ groupName: e.target.value });
    }

    handleCheckboxClick = (itemId) => {

        const { selectedUsers } = this.state;
        const index = selectedUsers.indexOf(itemId);

        if (index === -1) {
            // If item not found, add to selectedItems
            const result = [...selectedUsers, itemId]
            // console.log("result:>", result)
            this.setState({
                selectedUsers: result
            });
        } else {
            // If item found, remove from selectedItems
            const result = selectedUsers.filter(item => item !== itemId);
            // console.log("result:>", result)
            this.setState({
                selectedUsers: result
            });
        }
    };

    addGroupUsers = async (data) => {
        // console.log("Add Group Users", data)
        const groupData = data.groupData;
        // console.log("groupData", groupData)
        try {
            const response = await axios.get('/user/getAllUser', {
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`
                },
            });
            const allUsers = response.data.data;
            const data = allUsers.map(item => item.seller === null ? item.user : item.seller)
            // console.log("All user without filter", data)
            const notAddedUser = data.filter(obj1 => !groupData.some(obj2 => obj2.id === obj1.id));
            this.setState({ notAddedUser: notAddedUser })
            this.setState({ showAddUserModal: true });
        } catch (error) {
            console.log("error", error)
        }
    }

    handleChatBlock = (data) => {
        // console.log("USER BLOCK DATA", data)
        {
            data.isBlock === false ?
                axios.put(`/user/userChatBlock/${data.chatId}`, { isBlock: true, blockByUser: this.authInfo.id }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': `Bearer ${this.authInfo.token}`
                    }
                }).then((response) => {
                    if (response.data.status === true) {
                        this.setState({ sendChatData: "" });
                        this.fetchAllUserData();
                        toast.success(`You Block ${data.name} Successfully`, { autoClose: 3000 })
                        // this.props.history.push('/chat')
                    }

                }).catch((error) => {
                    console.log("error", error);
                })
                :
                axios.put(`/user/userChatBlock/${data.chatId}`, { isBlock: false, blockByUser: null }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': `Bearer ${this.authInfo.token}`
                    }
                }).then((response) => {
                    if (response.data.status === true) {
                        this.setState({ sendChatData: "" });
                        this.fetchAllUserData();
                        toast.success(`You Unblock ${data.name} Successfully`, { autoClose: 3000 })

                        // this.props.history.push('/chat')
                    }

                }).catch((error) => {
                    console.log("error", error);
                })
        }
    }

    handleUnblockChat = (chatId) => {
        // console.log("handle Unblock Chat", chatId)
        try {
            axios.put(`/user/userChatBlock/${chatId}`, { isBlock: false, blockByUser: null }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            }).then((response) => {
                if (response.data.status === true) {
                    this.setState({ sendChatData: "" });
                    this.fetchAllUserData();
                    toast.success(`Chat Unblock Successfully`, { autoClose: 3000 })

                    // this.props.history.push('/chat')
                }

            }).catch((error) => {
                console.log("error", error);
            })

        } catch (error) {
            console.log("error", error)
        }
    }

    toggleChatGroupUsers = () => {
        this.setState((prevState) => ({ showChatUsers: !prevState.showChatUsers }));
    }

    render() {
        const { showChatUsers, users, allChatUsers, sendChatData, userChat, notification, selectedUsers } = this.state
        // console.log("notification", notification)
        // console.log("allChatUsers in render() :-", allChatUsers)
        // console.log(" Searching users", users)
        // console.log("sendChatData group data : ", sendChatData)
        // console.log("userChat : ", userChat)


        const { loading } = store.getState().global;


        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <Header />
                <PageTitle title="Chat" />
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
                                                        <a href="#" onClick={this.fetchAllUserData}>All</a>

                                                        {/* <a href="#">Unread Chats</a> */}
                                                        <a href="#" onClick={() => { this.fetchAllBlockChat() }}>Blocked Users </a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="chat_user_search">
                                                <div className="msg-search">
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="inlineFormInputGroup"
                                                        placeholder="Search"
                                                        value={this.state.search}
                                                        onChange={this.handleSearchText}
                                                    />
                                                    {/* <Link to="#" onClick={this.handleSearch}><img src={searchIcon} alt="linked-in" /></Link> */}
                                                    {/* <button type='button' className='btn btn-info btn-sm' onClick={this.handleSearch}>Search</button> */}
                                                    {/* <button type='button' className='btn btn-info btn-sm'>Search</button> */}

                                                    {/* <img src={addIcon} alt="linked-in" /> */}
                                                    <button type="button" className="btn" onClick={this.handleCreateGroup}>Create Group</button>

                                                    {/* <a className="add" href="#"><img className="img-fluid" src={addIcon} alt="add" /></a> */}
                                                </div>
                                            </div>

                                            <div className="chat_user_list">
                                                {users.length > 0 ? <>
                                                    All Search result
                                                    {users.map((item, index) =>
                                                        <div className="chat_user_item"
                                                            onClick={() => this.accessChat(item.seller === null ? item.user : item.seller)}
                                                            key={item.id || index}
                                                        >
                                                            <a href="#" className="d-flex align-items-center chatUser_info">
                                                                <div className="userInfo-col userThumb">
                                                                    <div className="user_thumb">
                                                                        <img className="img-fluid" src={item.seller === null ? item.user.image_url : item.seller.image_url} alt="user img" />
                                                                    </div>
                                                                    <span className="user-inactive user-active"></span>
                                                                </div>
                                                                <div className="userInfo-col userInfo">
                                                                    {item.seller === null ? <h3>{item.user.name} <span className="badge text-bg-success">{item.user.id === this.authInfo.id ? "YOU" : ""}</span></h3> : <h3>{item.seller.name}  <span className="badge text-bg-primary">{item.seller.role}</span></h3>}
                                                                </div>
                                                                <div className="userInfo-col chatTime">
                                                                    <div className="chatTime">
                                                                        1 mint ago
                                                                        <span className="chatNoti-info">3</span>
                                                                    </div>
                                                                </div>
                                                            </a>
                                                        </div>
                                                    )}
                                                </> : <>
                                                    {showChatUsers ? (
                                                        allChatUsers.length > 0 ? (
                                                            allChatUsers.map((item, index) => (
                                                                <div className="chat_user_item"
                                                                    onClick={() => {
                                                                        this.fetchAllMessage(item);
                                                                        // this.setState({ showChatUsers: false }); // Hide the component on click
                                                                    }}
                                                                    key={item.id || index}
                                                                >
                                                                    <a href="#" className="d-flex align-items-center chatUser_info">
                                                                        <div className="userInfo-col userThumb">
                                                                            <div className="user_thumb">
                                                                                <img className="img-fluid" src={item.chatUsers[0].id !== this.authInfo.id ? item.chatUsers[0].image_url : item.chatUsers[1].image_url} alt="user img" />
                                                                            </div>
                                                                            <span className="user-inactive user-active"></span>
                                                                        </div>
                                                                        <div className="userInfo-col userInfo">
                                                                            {item.chatName !== 'sender' ? <h3>{item.chatName} <span className="badge text-bg-info">Group</span></h3> : item.chatUsers[0].id !== this.authInfo.id ? <h3>{item.chatUsers[0].name}</h3> : <h3>{item.chatUsers[1].name}</h3>}
                                                                        </div>
                                                                        {item.isBlock === false ? (
                                                                            <div className="userInfo-col chatTime">
                                                                                <div className="chatTime">
                                                                                    1 min ago
                                                                                    <span className="chatNoti-info">3</span>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <button onClick={(e) => { e.stopPropagation(); this.handleUnblockChat(item.id); }}>Unblock</button>
                                                                        )}
                                                                    </a>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <NotFound msg="No user found" />
                                                        )
                                                    ) :
                                                        <div className="chat_user_list">
                                                            <h3>All Group Members</h3>
                                                            {sendChatData.groupData.map(item => <>
                                                                <div className="chat_user_item">
                                                                    <a href="#" className="d-flex align-items-center chatUser_info">
                                                                        <div className="userInfo-col userThumb">
                                                                            <div className="user_thumb">
                                                                                <img className="img-fluid" src={chatThumb} alt="user img" />
                                                                            </div>
                                                                            <span className="user-inactive user-active"></span>
                                                                        </div>
                                                                        <div className="userInfo-col userInfo">
                                                                            {item.id === this.authInfo.id ? <h3>{item.name} <span className="badge text-bg-success">You</span></h3> : <h3>{item.name}</h3>}
                                                                            {item.isGroupAdmin === false ? <></> : <p>Admin</p>}
                                                                        </div>
                                                                    </a>
                                                                </div>
                                                            </>)}
                                                        </div>
                                                    }
                                                </>}
                                            </div>
                                        </div>
                                        {sendChatData !== '' ? <>
                                            <div className="chat_board_view">
                                                <div className="d-flex align-items-center message-user-head">
                                                    <div className="userInfo-col userThumb">
                                                        <div className="user_thumb">
                                                            <img className="img-fluid" src={sendChatData.image_url} alt="user img" />
                                                        </div>
                                                        <span className="user-inactive user-active"></span>

                                                    </div>

                                                    <div className="userInfo-col userInfo">
                                                        <h3>{sendChatData.name}</h3>
                                                    </div>
                                                    {sendChatData.isBlock === false && sendChatData.isGroup !== true ? <>
                                                        <div className="mr-auto">
                                                            <button className="mr-20" onClick={() => { this.handleChatBlock(sendChatData) }}>Block</button>
                                                        </div>
                                                    </> :
                                                        <>
                                                            {showChatUsers === false ? <button onClick={this.toggleChatGroupUsers}>Back</button> : <button onClick={this.toggleChatGroupUsers}>Group Members</button>}
                                                        </>}
                                                </div>

                                                <div className="msg-body">
                                                    {userChat.length !== 0 ? (
                                                        <>
                                                            {userChat.map((item, index) => (
                                                                <div key={index}>
                                                                    {item.sender.id !== this.authInfo.id ? (
                                                                        <ul>
                                                                            <li className="sender">
                                                                                <div class="userThumb">
                                                                                    <div class="user_thumb">
                                                                                        <img class="img-fluid" src={item.sender.image_url} alt="user img" />
                                                                                    </div>
                                                                                    <span class="user-inactive user-active"></span>
                                                                                </div>
                                                                                <p>{item.messageContent}</p>

                                                                                <span className="time">10:32 am</span>
                                                                            </li>
                                                                        </ul>
                                                                    ) : (
                                                                        <ul>
                                                                            <li className="repaly">
                                                                                <p>{item.messageContent}</p>
                                                                                <span className="time">just now</span>
                                                                            </li>
                                                                        </ul>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <NotFound msg="No chat found" />
                                                        </>
                                                    )}
                                                </div>
                                                {sendChatData.isBlock === false ? <>
                                                    <div className="send-box">
                                                        <form action="">
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                aria-label="message…"
                                                                placeholder="Write message…"
                                                                value={this.state.messageContent}
                                                                onChange={this.handleMessageContent}
                                                            />

                                                            <button type="button" onClick={this.sendMessage}>
                                                                <i className="fa fa-paper-plane" aria-hidden="true"></i>
                                                                Send
                                                            </button>
                                                        </form>
                                                    </div>
                                                </> : <>
                                                    <NotFound msg="Chat blocked" />
                                                </>}
                                            </div>
                                        </> : <>
                                            <div className="chat_board_view">
                                                <NotFound msg="Chat not selected" />
                                            </div>

                                        </>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* search modal */}

                <Modal
                    show={this.state.showModal}
                    onHide={() => this.setState({ showModal: false })}
                    size="md"
                    // dialogClassName="modal-90h"
                    aria-labelledby="contained-modal-title-vcenter"
                    className='modal-dialog-scrollable'
                >
                    <div className="chat_fieldRow">
                        <h3>New Group</h3>
                        <div className="chat_field">
                            <label htmlFor="">Group name</label>
                            <div className="field_item">
                                <input
                                    className="form-control"
                                    type="text"
                                    name="siteUrl"
                                    value={this.state.groupName}
                                    placeholder="Enter Group Name"
                                    onChange={this.handleGroupName}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='user-list-container'>
                        {selectedUsers.length > 1 ? <>
                            <div className="d-grid gap-2 col-6 mx-auto">
                                <button className="btn btn-primary" type="button" onClick={this.createGroupChat}>Create Group</button>
                            </div>

                        </> : <>

                        </>}

                        {users.length === 0 ? (
                            <div className="chatGrpSelect d-grid gap-2 col-6 mx-auto">
                                <button className="btn btn-primary" type="button" onClick={this.selectAllUsers}>Add Users</button>
                            </div>
                        ) :
                            (users.map((item) => (
                                <div className="chat_user_item" key={item.id}>
                                    <a href="#" className="d-flex align-items-center chatUser_info">
                                        <div className="userInfo-col userThumb">
                                            <div className="user_thumb">
                                                <img className="img-fluid" src={chatThumb} alt="user img" />
                                            </div>
                                            <span className="user-inactive user-active"></span>
                                        </div>
                                        <div className="userInfo-col userInfo">
                                            {item.seller === null ? <h3>{item.user.name} <span className="badge text-bg-success">{item.user.id === this.authInfo.id ? "YOU" : ""}</span></h3> : <h3>{item.seller.name}  <span className="badge text-bg-primary">{item.seller.role}</span></h3>}
                                        </div>
                                        <div className="userInfo-col chatTime">
                                            <div className="chatTime">
                                                1 mint ago
                                                {item.id}
                                                <span className="chatNoti-info">3</span>
                                            </div>
                                        </div>

                                        <div className="input-group-text">
                                            <input
                                                className="form-check-input mt-0"
                                                type="checkbox"
                                                value=""
                                                aria-label="Checkbox for following text input"
                                                // onClick={() => this.handleCheckboxClick(item.seller === null ? item.user._id : item.seller._id)}
                                                onClick={() => this.handleCheckboxClick(item.seller === null ? item.user : item.seller)}
                                            />
                                        </div>

                                    </a>
                                </div>
                            )))}
                    </div>
                </Modal>
                <Footer />
            </React.Fragment>
        );
    }
}

export default connect(setLoading)(Chat);