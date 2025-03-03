import React, { Component, createRef } from 'react';
import Header from '../../components/admin/common/Header';
import PageTitle from '../../components/user/common/PageTitle';
import Footer from '../../components/common/Footer';
import { Link } from 'react-router-dom';
import docx from './../../assets/icons/docx.svg';
import defaultPdf_icon from './../../assets/icons/document_icon.svg';
import excel from "./../../assets/icons/excel.svg";
import delete_icone from './../../assets/icons/delete_icone.svg';
import edit_icon from './../../assets/icons/edit_icon.svg';
import block_icon from './../../assets/icons/block_icon.svg';
import group_profile from './../../assets/icons/grp_icone.svg';
import lets_chats from './../../assets/icons/Chats.svg';
import chat_not_found from './../../assets/icons/lets_chats.svg';
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
import Modal from "react-bootstrap/Modal";
import io from 'socket.io-client'
import { NotFound } from './../../components/common/NotFound';
import moment from 'moment';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { Helmet } from 'react-helmet';
import arrow_back from './../../assets/icons/arrow-back.svg';

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
            showEdit: false,
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
            showChatBoard: false,
            loading: true
        };
        this.dropdownRef = createRef();
        this.toggleDropdown = this.toggleDropdown.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
        this.isComponentMounted = false;
        this.socket = io.connect(process.env.REACT_APP_SOCKET_SERVER_URL);
        this.handleMessageContent = this.handleMessageContent.bind(this)
        // this.accessChat = this.accessChat.bind(this)
        this.sendMessage = this.sendMessage.bind(this)
        this.chatBoardRef = React.createRef();



        //     this.socket.on('receive_notification', (notification) => {
        //         // console.log("receive_notification", notification)

        //         if (notification.id === this.authInfo.id) {
        //             this.setState({
        //                 notification: notification
        //             })
        //         }
        //     })


        //     this.socket.on('user_online', (userID) => {
        //         // console.log("userId", userID)
        //         this.setState(prevState => ({
        //             onlineUsers: [...prevState.onlineUsers, userID]
        //         }));
        //         // setOnlineUsers(prevUsers => ({ ...prevUsers, [userID]: true }));
        //     });

        //     // Main code...
        //     // this.setState(prevState => ({
        //     //     userChat: [...prevState.userChat, data]
        //     // }));


        //     this.socket.on('message_recieved', (data) => {

        //         // console.log("chat select id ", this.state.sendChatData.chatId);
        //         // console.log(" msg reciving chat id", data.chat._id);


        //         if (data.chat._id === this.state.sendChatData.chatId) {
        //             this.fetchAllUserData();

        //             this.setState(prevState => ({
        //                 userChat: [...prevState.userChat, data]
        //             }));
        //         }
        //         this.fetchAllUserData();
        //     })
        // }


        // componentDidMount() {
        //     this.fetchAllUserData();
        //     this.socket.emit("active", this.authInfo.id);
        //     document.addEventListener('mousedown', this.handleClickOutside);
        // }

        // componentWillUnmount() {
        //     document.removeEventListener('mousedown', this.handleClickOutside);
        // }

    };

    componentDidMount() {
        this.fetchAllUserData();
        this.socket.emit("active", this.authInfo.id);
        this.socket.on('receive_notification', (notification) => {
            if (notification.id === this.authInfo.id) {
                this.setState({ notification });
            }
        });
        // this.socket.on('user_online', (userID) => {
        //     this.setState(prevState => ({
        //         onlineUsers: [...prevState.onlineUsers, userID]
        //     }));
        // });


        this.socket.on('user_online', (userID) => {
            this.setState(prevState => ({
                onlineUsers: [...prevState.onlineUsers, userID]
            }));
            // setOnlineUsers(prevUsers => ({ ...prevUsers, [userID]: true }));
        });

        this.socket.on('message_recieved', (data) => {
            if (data.chat._id === this.state.sendChatData.chatId) {
                this.fetchAllUserData();
                this.setState(prevState => ({
                    userChat: [...prevState.userChat, data]
                }));
            }
        });

        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        // Proper cleanup
        this.socket.off('receive_notification');
        this.socket.off('user_online');
        this.socket.off('message_recieved');

        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    toggleDropdown() {
        this.setState((prevState) => ({
            isOpen: !prevState.isOpen,
        }));
    }

    handleClickOutside(event) {
        if (this.dropdownRef.current && !this.dropdownRef.current.contains(event.target)) {
            this.setState({ isOpen: false });
        }
    }

    // componentDidMount() {
    //     this.isComponentMounted = true;
    //     this.socket.on('message_received', (data) => {
    //         if (this.isComponentMounted) {
    //             if (data.chat._id === this.state.sendChatData.chatId) {
    //                 this.fetchAllUserData();
    //                 this.setState(prevState => ({
    //                     userChat: [...prevState.userChat, data]
    //                 }));
    //             }
    //         }
    //         this.fetchAllUserData();
    //     });
    // }


    componentDidUpdate(prevProps, prevState) {
        // Scroll to the bottom of the chat board whenever new messages are added
        if (prevState.userChat !== this.state.userChat && this.chatBoardRef.current) {
            this.chatBoardRef.current.scrollTop = this.chatBoardRef.current.scrollHeight;
        }
    }

    fetchAllUserData = () => {
        this.setState({ users: "" })
        this.setState({ search: "" })
        this.setState({ showChatUsers: true })
        try {
            const authorId = this.authInfo.id
            const url = `/admin/fetchChat/${authorId}`
            axios.get(url, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            }).then((response) => {
                const users = response.data.data;
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
            const url = `/admin/fetchBlockChat/${authorId}`
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
                const response = await axios.get(`/admin/getAllUser?search=${this.state.search}`, {
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
            const response = await axios.get(`/admin/getAllUser`, {
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

        const formatRole = (role) => {
            if (role === 'user' || role === 'seller') {
                return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
            } else {
                return 'Admin';
            }
        };

        if (selectedUsers.length > 1) {
            try {
                const url = '/admin/createGroupChat';
                const receiverData = selectedUsers.map(receiver => ({
                    id: receiver._id,
                    name: receiver.name,
                    image_url: receiver.image_url,
                    role: formatRole(receiver.role),
                }));
                // console.log("receiverData", receiverData)
                // const data = { receiverId, authorId }
                axios.post(url, {
                    receiverId: receiverData,
                    authorId: {
                        id: this.authInfo.id,
                        name: this.userInfo.name,
                        image_url: this.userInfo.imgUrl,
                        isGroupAdmin: true,
                        role: formatRole(this.userInfo.role),
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
        this.setState({ groupName: "" });
        this.setState({ selectedUsers: "" });
    }

    accessChat = (data) => {
        // console.log("User selected data", data);
        try {
            const url = '/admin/accessChat';
            // const data = { receiverId, authorId }
            const formatRole = (role) => {
                if (role === 'user' || role === 'seller') {
                    return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
                } else {
                    return 'Admin';
                }
            };

            axios.post(url, {
                receiverId: {
                    id: data.id,
                    name: data.name,
                    role: formatRole(data.role),
                    image_url: data.image_url
                },
                authorId: {
                    id: this.authInfo.id,
                    name: this.userInfo.name,
                    role: formatRole(this.userInfo.role),
                    image_url: this.userInfo.imgUrl,
                }
            }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            }).then((response) => {
                this.setState({ showChatBoard: true });
                const datas = response.data.data
                // console.log("accessChat function ", data.id);
                // console.log("Join room ", datas._id)
                this.socket.emit('join chat', datas._id);
                // this.socket.emit("setup", data.id);

                // this.socket.emit("send_notification", data)

                // this.socket.emit("notification_send", data);

                // this.sendNotification(data.id, datas)
                if (response.data.status === true) {
                    // toast.success("New Chat Created.....", { autoClose: 3000 })
                    this.fetchAllMessage(datas)
                    this.fetchAllUserData();

                    //***************** */
                    const notification = {
                        message: `${this.userInfo.name} start chat with you `,
                        // postId: postId,
                        sender: { id: this.authInfo.id, name: this.userInfo.name, type: 'admin' },
                        receiver: { id: data.id, type: data.role, name: data.name },
                        type: 'chat',
                        isRead: 'false',
                        createdAt: new Date(),
                    };
                    //console.log('chat notification---', notification)
                    this.socket.emit('chatNotification', { notification });

                    axios.post('front/notifications', notification).then(response => {
                        //  console.log("Notification saved:", response.data.message);
                    }).catch(error => {
                        console.log("Error saving notification:", error);
                    });
                    //***************** */

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
        this.setState({ showChatBoard: true, loading: true });
        if (data.isGroupChat === false) {
            const userID = data.chatUsers[0].id.id !== this.authInfo.id ? data.chatUsers[0].id.id : data.chatUsers[1].id.id;
            this.setState({ selectUserId: userID });
            this.socket.emit("setup", userID);
            this.getAllMessage(data._id)
            const result = {
                chatId: data._id,
                id: data.chatUsers[0].id.id !== this.authInfo.id ? data.chatUsers[0].id.id : data.chatUsers[1].id.id,
                name: data.chatUsers[0].id.id !== this.authInfo.id ? data.chatUsers[0].id.name : data.chatUsers[1].id.name,
                image_url: data.chatUsers[0].id.id !== this.authInfo.id ? data.chatUsers[0].id.image_url : data.chatUsers[1].id.image_url,
                isGroupAdmin: data.chatUsers[0].id !== this.authInfo.id ? data.chatUsers[0].isGroupAdmin : data.chatUsers[1].isGroupAdmin,
                isBlock: data.isBlock,
                blockByUser: data.blockByUser
            }
            this.setState({ sendChatData: result })

        } else {
            const groupData = data.chatUsers
            const groupUsers = groupData.map(item => item.id);
            this.socket.emit("setup", groupUsers);
            const isGroupAdmin = groupData.filter(item => item.isGroupAdmin === true)
            this.getAllMessage(data._id)
            const result = {
                chatId: data._id,
                name: data.chatName,
                isBlock: data.isBlock,
                groupData: groupData,
                isGroupAdmin: isGroupAdmin,
                isGroup: true
            }
            this.setState({ sendChatData: result, loading: false })
        }
    }

    // getAllMessage = (chatId) => {
    //     axios.get(`admin/allMessages/${chatId}`, {
    //         headers: {
    //             'Authorization': `Bearer ${this.authInfo.token}`
    //         },
    //     }).then((response) => {
    //         if (response.data.status === true) {
    //             const data = response.data.data;
    //             // console.log("getAllMessage function ", data)
    //             this.setState({
    //                 userChat: data
    //             })
    //         } else {
    //             this.setState({
    //                 userChat: ""
    //             })
    //         }
    //         this.socket.emit('join chat', chatId);
    //     }).catch((error) => {
    //         console.log("Error", error)
    //     })
    // }

    getAllMessage = (chatId) => {
        this.setState({ loading: true }); // Start loading

        axios.get(`admin/allMessages/${chatId}`, {
            headers: {
                'Authorization': `Bearer ${this.authInfo.token}`
            },
        }).then((response) => {
            if (response.data.status === true) {
                const data = response.data.data;
                this.setState({
                    userChat: data,
                    loading: false // Stop loading
                });
            } else {
                this.setState({
                    userChat: "",
                    loading: false // Stop loading
                });
            }
            this.socket.emit('join chat', chatId);
        }).catch((error) => {
            console.log("Error", error);
            this.setState({ loading: false }); // Stop loading on error
        });
    };

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
        const formatRole = (role) => {
            if (role === 'user' || role === 'seller') {
                return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
            } else {
                return 'Admin';
            }
        };
      
        if (selectedFile !== null) {
            const formData = new FormData();
            for (let i = 0; i < selectedFile.length; i++) {
                const file = selectedFile[i];
                if (file.size <= 5 * 1024 * 1024) { // Check if file size is less than or equal to 5MB
                    formData.append('file', file);
                    formData.append("upload_preset", "pay-earth-images");
                    formData.append("cloud_name", "pay-earth");

                    const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/upload`, {
                        method: 'POST',
                        body: formData
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const sendData = {
                            authorId: {
                                id: this.authInfo.id,
                                name: "",
                                image_url: "",
                                role: formatRole(this.userInfo.role),
                            },
                            chatId: sendChatData.chatId,
                            messageContent: messageContent || null,
                            mediaContent: data.secure_url || null,
                        };

                        try {
                            const url = '/admin/sendMessage';
                            axios.post(url, sendData, {
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json;charset=UTF-8',
                                    'Authorization': `Bearer ${this.authInfo.token}`
                                }
                            }).then((response) => {
                                const data = response.data.data;
                                if (response.data.status === true) {
                                    this.socket.emit("new message", data);
                                    this.getAllMessage(sendChatData.chatId);
                                    this.fetchAllUserData();
                                }
                            }).catch((error) => {
                                console.log("error", error);
                            });
                        } catch (error) {
                            console.log("error", error);
                        }
                    } else {
                        console.error('Failed to upload to Cloudinary');
                    }
                } else {
                    // console.error(`File ${file.name} exceeds the 5MB size limit.`);
                    toast.error(`File ${file.name} exceeds the 5MB size limit.`, { autoClose: 3000 })
                }
            }
            this.setState({ messageContent: "" });
            this.setState({ selectedFile: null });
            this.setState({ mediaContent: null });
        } else {
            try {
                const sendData = {
                    authorId: {
                        id: this.authInfo.id,
                        name: "",
                        image_url: "",
                        role: formatRole(this.userInfo.role),
                    },
                    chatId: sendChatData.chatId,
                    messageContent: !messageContent ? null : messageContent,
                    mediaContent: null,
                };
                const url = '/admin/sendMessage';
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
            const response = await axios.get(`/admin/getAllUser?search=${search}`, {
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`
                },
            });
            // console.log("All users : ", response.data.data)
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

    handleEditGroupName = (data) => {
        this.setState({ showEdit: true });
        this.setState({ groupEditData: data });
        this.setState({ groupName: data.name });
    };

    handleUpdateGroupName = () => {
        const { groupEditData, groupName } = this.state;
        // console.log("groupName", groupName);
        // console.log("groupEditData", groupEditData.chatId);

        try {
            const url = "/admin/updateGroupName/";
            const chatId = groupEditData.chatId
            axios.put(url, { chatId, groupName }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            }).then((response) => {
                this.fetchAllUserData();
                this.setState({ sendChatData: "" });
                this.setState({ groupName: "" });
                this.setState({ showEdit: false });
                // this.setState({ sendChatData: "" });
            }).catch((error) => {
                console.log("error", error)
            })

        } catch (error) {
            console.log("error", error)
        }
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
            // If item found, remove from selectedItems
            const result = selectedUsers.filter(item => item !== itemId);
            this.setState({
                selectedUsers: result
            });
        };
    };

    notAddedUsers = async (data) => {
        this.setState({ showAddUserModal: true });
        const groupData = data.groupData;
        try {
            const response = await axios.get('/admin/getAllUser', {
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`
                },
            });
            const allUsers = response.data.data;
            const data = allUsers.map(item => item.admin || item.seller || item.user);
            const notAddedUser = data.filter(obj1 => !groupData.some(obj2 => obj2.id === obj1.id));
            this.setState({ notAddedUser: notAddedUser });

        } catch (error) {
            console.log("error", error)
        }
    };

    clickToAddUser = async (data) => {
        const { sendChatData } = this.state;
        try {
            const url = `admin/addGroupMember/${sendChatData.chatId}`;
            await axios.put(url, data, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            }).then((response) => {
                toast.success(response.data.message, { autoClose: 3000 });
                this.getAllMessage(sendChatData.chatId);
                this.fetchAllUserData();
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
        axios.put(`/admin/messageDelete/${id}`, { isVisible: false }, {
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
                axios.put(`/admin/userChatBlock/${data.chatId}`, { isBlock: true, blockByUser: this.authInfo.id }, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': `Bearer ${this.authInfo.token}`
                    }
                }).then((response) => {
                    if (response.data.status === true) {
                        this.setState({ sendChatData: "" });
                        this.fetchAllUserData();
                        toast.success(`You Block ${data.name} Successfully`, { autoClose: 3000 });
                    }
                }).catch((error) => {
                    console.log("error", error);
                })
                :
                axios.put(`/admin/userChatBlock/${data.chatId}`, { isBlock: false, blockByUser: null }, {
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
            axios.put(`/admin/userChatBlock/${chatId}`, { isBlock: false, blockByUser: null }, {
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
                }
            }).catch((error) => {
                console.log("error", error);
            })
        } catch (error) {
            console.log("error", error)
        }
    }

    toggleChatGroupUsers = () => {
        this.setState({ showChatBoard: false });
        this.setState((prevState) => ({ showChatUsers: !prevState.showChatUsers }));
    }

    handleBack = () => {
        this.setState({ showChatBoard: false });
    }

    media = (url) => {
        const extension = url.split('.').pop().toLowerCase();
        if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
            return 'image';
        } else if (['mp4', 'webm', 'ogg'].includes(extension)) {
            return 'video';
        } else if (['pdf', 'docx', 'xlsx'].includes(extension)) {
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
                if (url.endsWith(".docx") || url.endsWith(".doc")) {
                    return (
                        <div>
                            <a href={url} download target="_blank" rel="noopener noreferrer">
                                <img src={docx} alt="Document" width={120} height={120} />
                            </a>
                        </div>
                    );
                } else if (url.endsWith(".pdf")) {
                    return (
                        <div>
                            <a href={url} download target="_blank" rel="noopener noreferrer">
                                <img src={defaultPdf_icon} alt="PDF Document" width={120} height={120} />
                            </a>
                        </div>
                    );
                } else if (url.endsWith(".txt")) {
                    return (
                        <div>
                            <a href={url} download target="_blank" rel="noopener noreferrer">
                                <img src={''} alt="Text Document" width={120} height={120} />
                            </a>
                        </div>
                    );
                } else if (url.endsWith(".xlsx") || url.endsWith(".xls")) {
                    return (
                        <div>
                            <a href={url} download target="_blank" rel="noopener noreferrer">
                                <img src={excel} alt="Excel Document" width={120} height={120} />
                            </a>
                        </div>
                    );
                }
                return <p>Unsupported document type</p>;
        }
    }

    handleRemoveFromGroup = (chatId, userId) => {
        // console.log("chatId", chatId);
        // console.log("userId", userId)

        try {
            const url = "/admin/removeFromGroup/";
            axios.put(url, { chatId, userId }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            }).then((response) => {
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
        const { showChatUsers, users, allChatUsers, sendChatData, userChat, notAddedUser, selectedUsers, selectedFile, onlineUsers, showEmojiPicker, showChatBoard } = this.state;
        const { loading } = store.getState().global;
        // console.log("allChatUsers in render() :-", allChatUsers)
        console.log(" userChat", userChat)


        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <Header />
                <PageTitle title="Chat" />
                <Helmet><title>{"Admin - Chat - Pay Earth"}</title></Helmet>
                <section className="inr_wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="chatUser_wrapper">
                                    <div className="chatlist_panel">
                                        <div className={`chat-lists ${showChatBoard === true ? 'hide' : ''}`}>
                                            {showChatUsers === true ? <>
                                                <div className="chat_left-head">
                                                    <div className="chat_head_panel d-flex align-items-center justify-content-between">
                                                        <div className="chat-heading">
                                                            <h3>Inbox</h3>
                                                        </div>
                                                        <div className="chat-filter d-flex gap-2">
                                                            <a href="#" data-bs-toggle="tooltip" title="All Users" onClick={this.fetchAllUserData}>All</a>
                                                            <a href="#" data-bs-toggle="tooltip" title="Blocked Users" onClick={() => { this.fetchAllBlockChat() }}>Blocked Users</a>
                                                        </div>
                                                        <div className='desktop-hide'>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm custum_back_btn btn_yellow d-flex align-items-center"
                                                                onClick={() => window.history.back()}
                                                            >
                                                                <img src={arrow_back} alt="back" />&nbsp;Back
                                                            </button>
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
                                                        <button type="button" className="btn" data-bs-toggle="tooltip" title="Create a Group" onClick={this.handleCreateGroup}>Create Group</button>
                                                    </div>
                                                </div>
                                            </> : <></>}
                                            <div className="chat_user_list">
                                                {users.length > 0 ? <>
                                                    All Search result
                                                    {users.map((item, index) =>
                                                        <div className="chat_user_item"
                                                            onClick={() => this.accessChat(item.admin || item.seller || item.user)}
                                                            key={item.id || index}
                                                        >
                                                            <a href="#" className="d-flex align-items-center chatUser_info">
                                                                <div className="userInfo-col userThumb">
                                                                    <div className="user_thumb">
                                                                        <img
                                                                            className="img-fluid"
                                                                            src={
                                                                                item.admin !== null
                                                                                    ? item.admin.image_url
                                                                                    : item.seller === null
                                                                                        ? item.user.image_url
                                                                                        : item.seller.image_url
                                                                            }
                                                                            alt="user img"
                                                                        />
                                                                    </div>

                                                                </div>
                                                                <div className="userInfo-col userInfo">
                                                                    {item.seller !== null ? (
                                                                        <h3>
                                                                            {item.seller.name} <span className="badge text-bg-warning">{item.seller.role}</span>
                                                                        </h3>
                                                                    ) : item.seller === null && item.user !== null ? (
                                                                        <h3>
                                                                            {item.user.name} <span className="badge text-bg-primary">{item.user.role}</span>
                                                                        </h3>
                                                                    ) : (
                                                                        <h3>
                                                                            {item.admin.name} <span className="badge text-bg-success">{item.admin.id === this.authInfo.id ? "YOU" : ""}</span>
                                                                        </h3>
                                                                    )}
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
                                                                        }}
                                                                        key={item.id || index}
                                                                    >
                                                                        <a href="#" className="d-flex align-items-center chatUser_info">
                                                                            <div className="userInfo-col userThumb">
                                                                                {item.isGroupChat === true ?
                                                                                    <div className="user_thumb">
                                                                                        <img className="img-fluid" src={group_profile} alt="Group_icon" />
                                                                                    </div>
                                                                                    :
                                                                                    <div className="user_thumb">
                                                                                        <img className="img-fluid" src={item.chatUsers[0].id.id !== this.authInfo.id ? item.chatUsers[0].id.image_url : item.chatUsers[1].id.image_url} alt="user img" />
                                                                                    </div>
                                                                                }
                                                                                {item.isGroupChat === true ? <></> : <>
                                                                                    {onlineUsers.includes(item.chatUsers[1].id) ? <span className="user-inactive user-active"></span> : <span className="user-inactive"></span>}
                                                                                </>}
                                                                            </div>
                                                                            <div className="userInfo-col userInfo">
                                                                                {item.chatName !== 'sender' ? <h3>{item.chatName} <span className="badge text-bg-info">Group</span></h3> : item.chatUsers[0].id.id !== this.authInfo.id ? <h3>{item.chatUsers[0].id.name}</h3> : <h3>{item.chatUsers[1].id.name}</h3>}
                                                                                {item.isBlock === true ? <></> : (item.latestMessage === null ? <></> : (item.latestMessage.mediaContent === null ? <p>{item.latestMessage.messageContent}</p> : <p><i><b>Media File</b></i></p>))}
                                                                            </div>
                                                                            {item.isBlock === false ? (
                                                                                <div className="userInfo-col chatTime">
                                                                                    <div className="chatTime">
                                                                                        {item.latestMessage === null ? <></> : (moment(item.latestMessage.timestamp).fromNow())}
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
                                                                    <div className="chat_head_panel d-flex align-items-center justify-content-between">
                                                                        <div className="chat-heading">
                                                                            <h3>All Group Members</h3>
                                                                        </div>
                                                                        <div className="d-flex align-items-center">
                                                                            <a className="add d-flex align-items-center me-3" href="#">
                                                                                <img src={group_icon} alt="add" width="30px" height="30px" />
                                                                                <small className="ms-1">{sendChatData.groupData.length}</small>
                                                                            </a>
                                                                            {sendChatData.groupData.filter(item => item.isGroupAdmin === true && item.id.id === this.authInfo.id)
                                                                                .map(item => (
                                                                                    <div className="chat-filter" key={item.id.id}>
                                                                                        <a href="#" onClick={() => { this.notAddedUsers(sendChatData) }}>
                                                                                            Add Users
                                                                                        </a>
                                                                                    </div>
                                                                                ))}
                                                                        </div>
                                                                        <div className='desktop-hide'>
                                                                            <Link className="btn btn-sm custom_btn btn_yellow" to="#" onClick={this.toggleChatGroupUsers} >
                                                                                <img src={arrow_back} alt="Back" width="15px" height="15px" />
                                                                                &nbsp;Back
                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {sendChatData.groupData.map(item => <>
                                                                    <div className="chat_user_item">
                                                                        <a href="#" className="d-flex align-items-center chatUser_info">
                                                                            <div className="userInfo-col userThumb">
                                                                                <div className="user_thumb">
                                                                                    <img className="img-fluid" src={item.id.image_url} alt="user img" />
                                                                                </div>
                                                                                {/* <span className="user-inactive user-active"></span> */}
                                                                            </div>
                                                                            <div className="userInfo-col userInfo">
                                                                                {item.id.id === this.authInfo.id ? <h3>{item.id.name} <span className="badge text-bg-success">You</span></h3> : <h3>{item.id.name}</h3>}
                                                                                {item.isGroupAdmin === false ? <></> : <p>Admin</p>}
                                                                            </div>
                                                                            <div className="userInfo-col chatTime">
                                                                                {item.id.id === this.authInfo.id ? <button onClick={() => { this.handleRemoveFromGroup(sendChatData.chatId, item.id.id) }}>Exit group</button>
                                                                                    :
                                                                                    <button onClick={() => { this.handleRemoveFromGroup(sendChatData.chatId, item.id.id) }}>Remove</button>
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
                                            <div className={`chat_board_view ${showChatBoard === true ? 'show' : ''}`} >
                                                <div className="d-flex align-items-center message-user-head w-100">
                                                    <div className="userInfo-col userThumb">
                                                        {sendChatData.isGroup === true ?
                                                            <div className="user_thumb">
                                                                <img className="img-fluid" src={group_profile} alt="user img" />
                                                            </div>
                                                            :
                                                            <div className="user_thumb">
                                                                <img className="img-fluid" src={sendChatData.image_url} alt="user img" />
                                                            </div>
                                                        }
                                                    </div>
                                                    <div className="userInfo-col userInfo">
                                                        <h3>{sendChatData.name}</h3>
                                                    </div>

                                                    {sendChatData.isGroup === true ?
                                                        <div>
                                                            <a href="#"><img src={edit_icon} alt="add" width={"15px"} height={"15px"} onClick={() => this.handleEditGroupName(sendChatData)} /></a>
                                                        </div>
                                                        :
                                                        <>
                                                        </>
                                                    }

                                                    {sendChatData.isBlock === false && sendChatData.isGroup !== true ? <>
                                                        <div className="mr-auto">
                                                            <a href="#" data-toggle="tooltip" title="Block"><img src={block_icon} alt="add" width={"20px"} height={"20px"} onClick={() => this.handleChatBlock(sendChatData)} /></a>
                                                        </div>
                                                    </> :
                                                        <>
                                                            {showChatUsers === false ?
                                                                <div className="ms-auto">
                                                                    <Link className="btn btn-sm custom_btn btn_yellow" to="#" onClick={this.toggleChatGroupUsers}>
                                                                        <img src={arrow_back} alt="Back" />
                                                                        &nbsp;Back
                                                                    </Link>
                                                                </div>
                                                                :
                                                                (sendChatData.isGroup === true ? <a class="add" href="#"><img src={group_icon} alt="add" onClick={this.toggleChatGroupUsers} width={"25px"} height={"25px"} /><small>{sendChatData.groupData.length}</small></a> : <></>)
                                                            }
                                                        </>}
                                                    <div className="desktop-hide ms-auto">
                                                        <Link className="btn btn-sm custom_btn btn_yellow" to="#" onClick={this.handleBack}>
                                                            <img src={arrow_back} alt="Back" />
                                                            &nbsp;Back
                                                        </Link>
                                                    </div>

                                                    <div className="desktop-show ms-auto">
                                                        <Link className="btn btn-sm custom_btn btn_yellow" to="#" onClick={this.handleBack}>
                                                            <img src={arrow_back} alt="Back" />
                                                            &nbsp;Back
                                                        </Link>
                                                    </div>

                                                    {showChatUsers === false ? null :
                                                        <div className="desktop-dashboard ms-auto">
                                                            <Link
                                                                type="button"
                                                                className="btn custum_back_btn btn_yellow mx-auto"
                                                                to="/admin/dashboard"
                                                            >
                                                                <img src={arrow_back} alt="back" />&nbsp;
                                                                Back
                                                            </Link>
                                                        </div>
                                                    }
                                                </div>

                                                <div className="msg-body" ref={this.chatBoardRef}>
                                                    {userChat.length !== 0 ? (
                                                        <>
                                                            {userChat.map((item, index) => (
                                                                <div key={index}>
                                                                    {item.sender.id.id !== this.authInfo.id ? (
                                                                        <ul>
                                                                            <li className="sender">
                                                                                <div className="userThumb">
                                                                                    <div className="user_thumb">
                                                                                        <img className="img-fluid" src={item.sender.id.image_url} alt="user img" />
                                                                                    </div>
                                                                                    <span className="user-inactive user-active"></span>
                                                                                </div>
                                                                                {item.mediaContent === null ? (item.messageContent === null ? <></> : <p>{item.messageContent}</p>) : this.renderMedia(item.mediaContent)}

                                                                                <br />
                                                                                {item.mediaContent !== null && item.messageContent !== null ? <p>{item.messageContent}</p> : <></>}
                                                                                <span className='time'>{moment(item.timestamp).format('hh:mm A')}</span>
                                                                            </li>
                                                                        </ul>
                                                                    ) : (
                                                                        <ul>
                                                                            <li className="repaly">
                                                                                <a href="#"><img src={delete_icone} alt="add" width={"20px"} height={"20px"} onClick={() => { this.handleMessageDelete(item._id) }} /></a>
                                                                                {item.mediaContent === null ? <p>{item.messageContent}</p> : this.renderMedia(item.mediaContent)}
                                                                                <br />
                                                                                {item.mediaContent !== null && item.messageContent !== null ? <p>{item.messageContent}</p> : <></>}
                                                                                <span className='time'>{moment(item.timestamp).fromNow()}</span>
                                                                            </li>
                                                                        </ul>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className="chat_board_view d-flex flex-column align-items-center justify-content-center">
                                                                <div className="text-center chat_notfound">
                                                                    <img src={chat_not_found} alt='...' width="200px" height="200px" />
                                                                    &nbsp;
                                                                    <h1 className="text-center">Chat not found..!</h1>
                                                                </div>
                                                            </div>
                                                            <div className="chat-not-found d-flex flex-column align-items-center justify-content-center">
                                                                <div className="text-center chat_notfound">
                                                                    <img src={chat_not_found} alt='...' width="200px" height="200px" />
                                                                    &nbsp;
                                                                    <h1 className="text-center">Chat not found..!</h1>
                                                                </div>
                                                            </div>
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
                                                                disabled={selectedFile !== null && selectedFile.length > 1 ? true : false}
                                                            />
                                                            <div className="emoji" onClick={this.toggleEmojiPicker}>😊</div>

                                                            {showEmojiPicker && <Picker data={data} onEmojiSelect={this.onEmojiClick} />}

                                                            <button
                                                                type="button"
                                                                onClick={this.sendMessage}
                                                                disabled={!this.state.messageContent && (!this.state.selectedFile || this.state.selectedFile.length === 0) && !this.state.showEmojiPicker}
                                                            >
                                                                <i className="fa fa-paper-plane" aria-hidden="true"></i>
                                                                Send
                                                            </button>
                                                        </form>
                                                    </div>
                                                </> : <>
                                                    <div class="alert alert-danger text-center" role="alert">
                                                        Chat was blocked..!
                                                    </div>
                                                </>}
                                            </div>
                                        </> : <>
                                            <div className="chat_board_view d-flex flex-column align-items-center justify-content-center">
                                                <div className="text-center chat_letstalk">
                                                    <img src={lets_chats} alt='...' width="200px" height="200px" />
                                                    &nbsp;
                                                    <h1 className="text-center">Let's Talk..!</h1>
                                                </div>
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


                {/* Edit */}
                <Modal
                    show={this.state.showEdit}
                    onHide={() => this.setState({ showEdit: false })}
                    size="md"
                    // dialogClassName="modal-90h"
                    aria-labelledby="contained-modal-title-vcenter"
                    className='modal-dialog-scrollable'
                >

                    <div className="chat_fieldRow">
                        <h3>Edit Group Name</h3>
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
                        <div className='user-list-container'>
                            <div className="d-grid gap-2 col-6 mx-auto mt-4">
                                <button className="btn btn-primary" type="button" onClick={this.handleUpdateGroupName}>Update</button>
                            </div>
                        </div>
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
                            </div> : <><p class="text-center">Min 3 & Max 20 members allowed to join this group</p></>
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
                                            {/* old    {item.seller === null ? <h3>{item.user.name} <span className="badge text-bg-primary">{item.user.role}</span></h3> : <h3>{item.seller.name} <span className="badge text-bg-success">{item.seller.id === this.authInfo.id ? "YOU" : ""}</span>  </h3>} */}
                                            {item.admin !== null ? (
                                                <h3>
                                                    {item.admin.name} <span className="badge text-bg-warning">{item.admin.role}</span>
                                                </h3>
                                            ) : item.seller === null ? (
                                                <h3>
                                                    {item.user.name} <span className="badge text-bg-primary">{item.user.role}</span>
                                                </h3>
                                            ) : (
                                                <h3>
                                                    {item.seller.name} <span className="badge text-bg-success">{item.seller.id === this.authInfo.id ? "YOU" : ""}</span>
                                                </h3>
                                            )}
                                        </div>
                                        {/* <div className="userInfo-col chatTime">
                                            <div className="chatTime">
                                                1 mint ago
                                                {item.id}
                                                <span className="chatNoti-info">3</span>
                                            </div>
                                        </div> */}

                                        <div className="input-group-text">
                                            <input
                                                className="form-check-input mt-0"
                                                type="checkbox"
                                                value=""
                                                aria-label="Checkbox for following text input"
                                                // onClick={() => this.handleCheckboxClick(item.seller === null ? item.user._id : item.seller._id)}
                                                onClick={() => this.handleCheckboxClick(item.admin || item.seller || item.user)}
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