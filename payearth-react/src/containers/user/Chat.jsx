import React, { Component } from 'react';
import Header from '../../components/user/common/Header';
import PageTitle from '../../components/user/common/PageTitle';
import Footer from '../../components/common/Footer';
import { Link } from 'react-router-dom';
import chat_icon from './../../assets/icons/chat_icon.svg';
import defaultPdf_icon from './../../assets/icons/document_icon.svg'
import delete_icone from './../../assets/icons/delete_icone.svg'
import msg_deleted from './../../assets/icons/msg_deleted.svg'
import chatThumb from './../../assets/images/chat-thumb.jpg';
import { setLoading } from '../../store/reducers/global-reducer';
import SpinnerLoader from './../../components/common/SpinnerLoader';
import { toast } from 'react-toastify';
import { Badge } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { connect } from 'react-redux';
import store from '../../store/index';
import axios from 'axios';
import group_icon from './../../assets/icons/group_icon.svg';
// import searchIcon from './../../assets/icons/search.svg'
import Modal from "react-bootstrap/Modal";
import io from 'socket.io-client'
import { NotFound } from './../../components/common/NotFound';
import { iteratee } from 'lodash';
import moment from 'moment';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';


class Chat extends Component {
    constructor(props) {
        super(props);
        this.cloudName = process.env.REACT_APP_CLOUD_NAME
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
            selectedFile: null,
            onlineUsers: [],
            showEmojiPicker: false,
        };

        this.socket = io.connect(process.env.REACT_APP_SOCKET_SERVER_URL);
        this.handleMessageContent = this.handleMessageContent.bind(this)
        // this.accessChat = this.accessChat.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
        this.onEmojiClick = this.onEmojiClick.bind(this);


        this.socket.on('receive_notification', (notification) => {
            // console.log("receive_notification", notification)

            if (notification.id === this.authInfo.id) {
                this.setState({
                    notification: notification
                })
            }
        });




        this.socket.on('user_online', (userID) => {
            // console.log("userId", userID)
            this.setState(prevState => ({
                onlineUsers: [...prevState.onlineUsers, userID]
            }));
            // setOnlineUsers(prevUsers => ({ ...prevUsers, [userID]: true }));
        });

        // this.socket.on('user_offline', (userID) => {
        //     this.setState(prevState => {
        //       const updatedUsers = { ...prevState.onlineUsers };
        //       delete updatedUsers[userID];
        //       return { onlineUsers: updatedUsers };
        //     });
        //   });

        this.socket.on('message_recieved', (data) => {

            // console.log("chat select id ", this.state.sendChatData.chatId);
            // console.log(" msg reciving chat id", data.chat._id);

            if (data.chat._id === this.state.sendChatData.chatId) {
                this.fetchAllUserData();

                this.setState(prevState => ({
                    userChat: [...prevState.userChat, data]
                }));
            }
            this.fetchAllUserData();

            // if (data) { data.chat._id !== this.state.allChatUsers._id ? <> No NOTIFICATION </> : <> YES NOTIFICATION</> }



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

            // this.setState(prevState => ({
            //     userChat: [...prevState.userChat, data]
            // }));
        })
    }


    componentDidMount() {
        this.fetchAllUserData();
        this.socket.emit("active", this.authInfo.id);
    }

    onEmojiClick(event, emojiObject) {
        this.setState({
            chosenEmoji: emojiObject,
        });
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
                const users = response.data.data;

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

    handleMessageContent = (e) => {
        this.setState({ messageContent: e.target.value })
    }

    handleFileChange = async (event) => {
        // const files = Array.from(event.target.files);
        const files = event.target.files;
        // console.log("files", files)
        this.setState({ selectedFile: files })
    };

    onEmojiClick = (emoji) => {
        this.setState({ messageContent: this.state.messageContent + emoji.native });
    };

    toggleEmojiPicker = () => {
        this.setState((prevState) => ({ showEmojiPicker: !prevState.showEmojiPicker }));
    };


    sendMessage = async () => {
        const { sendChatData, messageContent, selectedFile } = this.state;
        if (selectedFile !== null) {
            const formData = new FormData();
            for (let i = 0; i < selectedFile.length; i++) {
                const file = selectedFile[i];
                formData.append('file', file);
                formData.append("upload_preset", "pay-earth-images")
                formData.append("cloud_name", "pay-earth")
                const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/upload`, {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    const data = await response.json();
                    const sendData = {
                        authorId: {
                            id: this.authInfo.id,
                            name: this.userInfo.name,
                            image_url: this.userInfo.imgUrl,
                        },
                        chatId: sendChatData.chatId,
                        messageContent: !messageContent ? null : messageContent,
                        mediaContent: !data.secure_url ? null : data.secure_url,
                    };

                    try {
                        const url = '/user/sendMessage';
                        // const data = { receiverId, authorId }
                        axios.post(url, sendData, {
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
                                this.fetchAllUserData();
                            }
                        }).catch((error) => {
                            console.log("error", error);
                        });
                    } catch (error) {
                        console.log("error", error)
                    }
                } else {
                    console.error('Failed to upload to Cloudinary');
                }
            }
            this.setState({ messageContent: "" })
            this.setState({ selectedFile: null })
            this.setState({ mediaContent: null })
        } else {
            try {
                const sendData = {
                    authorId: {
                        id: this.authInfo.id,
                        name: this.userInfo.name,
                        image_url: this.userInfo.imgUrl,
                    },
                    chatId: sendChatData.chatId,
                    messageContent: !messageContent ? null : messageContent,
                    mediaContent: null,
                };
                const url = '/user/sendMessage';
                axios.post(url, sendData, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': `Bearer ${this.authInfo.token}`
                    }
                }).then((response) => {
                    const data = response.data.data;

                    if (response.data.status === true) {
                        this.socket.emit("new message", data)
                        // console.log("SendChatData under send msg>>>", sendChatData)
                        this.getAllMessage(sendChatData.chatId)
                        this.fetchAllUserData();
                    }
                }).catch((error) => {
                    console.log("error", error);
                });

            } catch (error) {
                console.log("error", error)
            }
            this.setState({ messageContent: "" })
        }
        this.setState({ showEmojiPicker: false })
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
            if (selectedUsers.length < 20) {
                const result = [...selectedUsers, itemId]
                this.setState({
                    selectedUsers: result
                });
            } else {
                alert("Not Select more then 20 users")
            }
        } else {
            const result = selectedUsers.filter(item => item !== itemId);
            this.setState({
                selectedUsers: result
            });
        }
    };

    notAddedUsers = async (data) => {
        this.setState({ showAddUserModal: true });
        const groupData = data.groupData;
        try {
            const response = await axios.get('/user/getAllUser', {
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`
                },
            });
            const allUsers = response.data.data;
            const data = allUsers.map(item => item.seller === null ? item.user : item.seller);
            const notAddedUser = data.filter(obj1 => !groupData.some(obj2 => obj2.id === obj1.id));

            this.setState({ notAddedUser: notAddedUser })

        } catch (error) {
            console.log("error", error)
        }
    }

    clickToAddUser = async (data) => {
        console.log("click to add function run ")
        const { sendChatData } = this.state;
        try {
            const url = `user/addGroupMember/${sendChatData.chatId}`;
            await axios.put(url, data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            }).then((response) => {
                this.getAllMessage(sendChatData.chatId);
                this.fetchAllUserData();
                toast.success("New User Added", { autoClose: 3000 })
                toast.error(response.data.message, { autoClose: 3000 })
                // this.setState({ subscriptionChecked: response.data.status })
            }).catch((error) => {
                console.log("Error", error)
            })
        } catch (error) {
            console.log("error", error)
        }
    }

    handleMessageDelete = (id) => {
        const { sendChatData } = this.state;
        console.log("selected chat message id", id)
        axios.put(`/user/messageDelete/${id}`, { isVisible: false }, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            if (response.data.status === true) {
                toast.success(`Chat Delete Successfully`, { autoClose: 1000 })
                this.getAllMessage(sendChatData.chatId);
                this.fetchAllUserData();
            }
        }).catch((error) => {
            console.log("error", error);
        })
    }

    handleChatBlock = (data) => {
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
                    toast.success(`Chat Unblock Successfully`, { autoClose: 3000 });
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

    media = (url) => {
        const extension = url.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            return 'image';
        } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
            return 'video';
        } else if (['pdf', 'docx'].includes(extension)) {
            return 'document';
        } else {
            return 'unknown';
        }
    }

    renderMedia = (url) => {
        const fileType = this.media(url);
        switch (fileType) {
            case 'image':
                return <img src={url} alt="Media content" width={"auto"} height={"300px"} />;
            case 'video':
                return (
                    <video width="300" controls>
                        <source src={url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                );
            case 'document':
                return (
                    <embed
                        src={url} type="application/pdf"
                        width="300px"
                        height="300px"
                        // alt={defaultPdf_icon}

                        onError={(e) => {
                            e.target.style.display = 'none';
                            <img src={defaultPdf_icon} alt="Failed to load PDF" />
                        }}
                    />
                );
            default:
                return <p>Unsupported media type</p>;
        }
    }

    notify = () => toast.error("Only Admin can add new users", {
        position: "bottom-center",
        theme: "colored",
    });

    handleRemoveFromGroup = (chatId, userId) => {
        console.log("chatId", chatId);
        console.log("userId", userId)

        try {
            const url = "/user/removeFromGroup/";
            axios.put(url, { chatId, userId }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            }).then((response) => {
                console.log("response remove from group..", response)
                this.fetchAllUserData();
                this.setState({ sendChatData: "" });
            }).catch((error) => {
                console.log("error", error)
            })

        } catch (error) {
            console.log("error", error)
        }
    }


    render() {
        const { showChatUsers, users, allChatUsers, sendChatData, userChat, notAddedUser, selectedUsers, selectedFile, onlineUsers, showEmojiPicker } = this.state;
        const { loading } = store.getState().global;
        // console.log("allChatUsers in render() :-", allChatUsers)
        console.log(" sendChatData", sendChatData)
        // console.log("notAddedUser : ", notAddedUser)
        // console.log("userChat :", userChat);
        // console.log("onlineUsers Active :>>>>", onlineUsers)

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
                                            {showChatUsers === true ? <>
                                                <div className="chat_left-head">
                                                    <div className="chat_head_panel">
                                                        <div className="chat-heading">
                                                            <h3>Inbox</h3>
                                                        </div>
                                                        <div className="chat-filter">
                                                            <a href="#" onClick={this.fetchAllUserData}>All</a>
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
                                                        <button type="button" className="btn" onClick={this.handleCreateGroup}>Create Group</button>
                                                    </div>
                                                </div>
                                            </> : <></>}
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
                                                                    {/* <span className="user-inactive user-active"></span> */}
                                                                </div>
                                                                <div className="userInfo-col userInfo">
                                                                    {item.seller === null ? <h3>{item.user.name} <span className="badge text-bg-success">{item.user.id === this.authInfo.id ? "YOU" : ""}</span></h3> : <h3>{item.seller.name}  <span className="badge text-bg-primary">{item.seller.role}</span></h3>}
                                                                </div>
                                                            </a>
                                                        </div>
                                                    )}
                                                </>
                                                    :
                                                    <>
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
                                                                                {/* <p>{onlineUsers.includes(item.chatUsers[0].id !== this.authInfo.id ? item.chatUsers[0].id : item.chatUsers[1].id) ? "true" : "false"}</p> */}
                                                                                {onlineUsers.includes(item.chatUsers[1].id) ? <span className="user-inactive user-active"></span> : <span className="user-inactive"></span>}
                                                                            </div>
                                                                            <div className="userInfo-col userInfo">
                                                                                {item.chatName !== 'sender' ? <h3>{item.chatName} <span className="badge text-bg-info">Group</span></h3> : item.chatUsers[0].id !== this.authInfo.id ? <h3>{item.chatUsers[0].name}</h3> : <h3>{item.chatUsers[1].name}</h3>}
                                                                                {item.isBlock === true && item.latestMessage.isVisible === false ? <></> : (item.latestMessage === null ? <></> : (item.latestMessage.mediaContent === null ? <p>{item.latestMessage.messageContent}</p> : <p><i><b>Media File</b></i></p>))}
                                                                                {/* {item.latestMessage === null ? <></> : (item.latestMessage.mediaContent === null ? <p>{item.latestMessage.messageContent}</p> : <p><i><b>Media File</b></i></p>)} */}

                                                                            </div>
                                                                            {item.isBlock === false ? (
                                                                                <div className="userInfo-col chatTime">
                                                                                    <div className="chatTime">
                                                                                        {item.latestMessage === null ? <></> : (moment(item.latestMessage.timestamp).fromNow())}
                                                                                        {/* {moment(item.latestMessage.timestamp).fromNow()} */}
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
                                                            <>
                                                                <div className="chat_left-head">
                                                                    <div className="chat_head_panel">
                                                                        <div className="chat-heading">
                                                                            <h3>All Group Members</h3>
                                                                        </div>
                                                                        <a className="add" href="#"><img src={group_icon} alt="add" width={"30px"} height={"30px"} /><small>{sendChatData.groupData.length}</small></a>
                                                                        {sendChatData.groupData.filter(item => item.isGroupAdmin === true && item.id === this.authInfo.id).map(item => <div className="chat-filter" key={item.id}>
                                                                            <a href="#"
                                                                                onClick={() => { this.notAddedUsers(sendChatData) }}
                                                                            >
                                                                                Add Users
                                                                            </a>
                                                                        </div>)}
                                                                    </div>
                                                                </div>
                                                                {sendChatData.groupData.map(item => <>
                                                                    <div className="chat_user_item">
                                                                        <a href="#" className="d-flex align-items-center chatUser_info">
                                                                            <div className="userInfo-col userThumb">
                                                                                <div className="user_thumb">
                                                                                    <img className="img-fluid" src={chatThumb} alt="user img" />
                                                                                </div>
                                                                                {/* <span className="user-inactive user-active"></span> */}
                                                                            </div>
                                                                            <div className="userInfo-col userInfo">
                                                                                {item.id === this.authInfo.id ? <h3>{item.name} <span className="badge text-bg-success">You</span></h3> : <h3>{item.name}</h3>}
                                                                                {item.isGroupAdmin === false ? <></> : <p>Admin</p>}
                                                                            </div>
                                                                            <div className="userInfo-col chatTime">
                                                                                {item.id === this.authInfo.id ? <button onClick={() => { this.handleRemoveFromGroup(sendChatData.chatId, item.id) }}> Exit group </button> :
                                                                                    //  (item.isGroupAdmin === true ? <></> : 
                                                                                    // <button onClick={() => { this.handleRemoveFromGroup(sendChatData.chatId, item.id) }}>Remove</button>)
                                                                                    <></>
                                                                                }
                                                                            </div>
                                                                        </a>
                                                                    </div>
                                                                </>)}
                                                            </>
                                                        }
                                                    </>
                                                }
                                            </div>
                                        </div>
                                        {sendChatData !== '' ? <>
                                            <div className="chat_board_view">
                                                <div className="d-flex align-items-center message-user-head">
                                                    <div className="userInfo-col userThumb">
                                                        <div className="user_thumb">
                                                            <img className="img-fluid" src={sendChatData.image_url} alt="user img" />
                                                        </div>
                                                        {/* <span className="user-inactive user-active"></span> */}
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
                                                            {showChatUsers === false ?
                                                                <div className="justify-content-md-end">
                                                                    <button className="btn btn-warning me-md-2 btn-sm" type="button" onClick={this.toggleChatGroupUsers}>Back</button>
                                                                </div>
                                                                // <button onClick={this.toggleChatGroupUsers}>Back</button>
                                                                :
                                                                (sendChatData.isGroup === true ? <a className="add" href="#"><img src={group_icon} alt="add" onClick={this.toggleChatGroupUsers} width={"40px"} height={"40px"} /><small>{sendChatData.groupData.length}</small></a> : <></>)
                                                            }
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
                                                                                {item.isVisible === true ? <>
                                                                                    <div className="userThumb">
                                                                                        <div className="user_thumb">
                                                                                            <img className="img-fluid" src={item.sender.image_url} alt="user img" />
                                                                                        </div>
                                                                                        <span className="user-inactive user-active"></span>
                                                                                    </div>
                                                                                    {item.mediaContent === null ? (item.messageContent === null ? <></> : <p>{item.messageContent}</p>) :
                                                                                        this.renderMedia(item.mediaContent)
                                                                                    }
                                                                                    <a href="#"><img src={delete_icone} alt="add" width={"20px"} height={"20px"} onClick={() => { this.handleMessageDelete(item._id) }} /></a>
                                                                                    <br />
                                                                                    <span className='time'>{moment(item.timestamp).format('hh:mm A')}</span>
                                                                                </> : <p className="bg-light text-danger">
                                                                                    <i>This message was deleted..!</i>
                                                                                </p>}
                                                                            </li>
                                                                        </ul>
                                                                    ) : (
                                                                        <ul>
                                                                            <li className="repaly">
                                                                                {item.isVisible === true ? <>
                                                                                    <a href="#"><img src={delete_icone} alt="add" width={"20px"} height={"20px"} onClick={() => { this.handleMessageDelete(item._id) }} /></a>
                                                                                    {item.mediaContent === null ? <p>{item.messageContent}</p> : this.renderMedia(item.mediaContent)}
                                                                                    <span className='time'>{moment(item.timestamp).fromNow()}</span>
                                                                                </> :
                                                                                    <p className="bg-light text-danger">
                                                                                        <i>This message was deleted..!</i>
                                                                                    </p>}
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
                                                        {/* <p>SELECTED FILE</p> */}
                                                        {selectedFile !== null ? `Total Selected File is ${selectedFile.length}` : <></>}
                                                        <form action="">
                                                            <div className="field_item">
                                                                <input
                                                                    className='form-media'
                                                                    type="file"
                                                                    accept="image/*,video/*,.pdf,.doc,.docx,.xlsx,.xls,.txt"
                                                                    multiple
                                                                    onChange={this.handleFileChange}
                                                                />
                                                            </div>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                aria-label="message…"
                                                                placeholder="Write message…"
                                                                value={this.state.messageContent}
                                                                onChange={this.handleMessageContent}
                                                            />
                                                            <div className="emoji" onClick={this.toggleEmojiPicker}>😊</div>
                                                            {/* <button type="button" className="emoji btn btn-light" onClick={this.toggleEmojiPicker}>
                                                                😊
                                                            </button> */}
                                                            {showEmojiPicker && <Picker data={data} onEmojiSelect={this.onEmojiClick} />}

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


                {/* Add group users */}

                <Modal
                    show={this.state.showAddUserModal}
                    onHide={() => this.setState({ showAddUserModal: false })}
                    size="md"
                    // dialogClassName="modal-90h"
                    aria-labelledby="contained-modal-title-vcenter"
                    className='modal-dialog-scrollable'
                >

                    <div className="chat_fieldRow">
                        <h3>Add Users</h3>

                        {notAddedUser.length > 0 ? <>
                            {notAddedUser.map((item, index) => (
                                <div className="chat_user_item" key={index}>
                                    <a href="#" className="d-flex align-items-center chatUser_info">
                                        <div className="userInfo-col userThumb">
                                            <div className="user_thumb">
                                                <img className="img-fluid" src={chatThumb} alt="user img" />
                                            </div>
                                            <span className="user-inactive user-active"></span>
                                        </div>
                                        <div className="userInfo-col userInfo">
                                            <h3>{item.name}</h3>
                                            {/* {item.seller === null ? <h3>{item.user.name} <span className="badge text-bg-success">{item.user.id === this.authInfo.id ? "YOU" : ""}</span></h3> : <h3>{item.seller.name}  <span className="badge text-bg-primary">{item.seller.role}</span></h3>} */}
                                        </div>
                                        <button onClick={() => this.clickToAddUser(item)}>ADD</button>
                                    </a>
                                </div>
                            ))}
                        </> :
                            <></>
                        }
                    </div>
                </Modal>

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
                        {selectedUsers.length < 20 && selectedUsers.length > 1 ?
                            <div className="d-grid gap-2 col-6 mx-auto">
                                <button className="btn btn-primary" type="button" onClick={this.createGroupChat}>Create Group</button>
                            </div> : <><p className="text-center">Min 3 & Max 20 members allowed to join this group</p></>
                        }
                        {users.length === 0 ? (
                            <div className="chatGrpSelect d-grid gap-2 col-6 mx-auto">
                                <button className="btn btn-primary" type="button" onClick={this.selectAllUsers}>Add Users</button>
                            </div>
                        ) :
                            (users.map((item, index) => (
                                <div className="chat_user_item" key={index}>
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