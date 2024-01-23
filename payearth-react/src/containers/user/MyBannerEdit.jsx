import React, { Component } from 'react';
import Header from "./../../components/user/common/Header";
import Footer from '../../components/common/Footer';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import emptyImg from './../../assets/images/emptyimage.png'
import emptyVid from './../../assets/images/emptyVid.png'
import store from '../../store/index';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { date } from 'yup';


class MyBannerEdit extends Component {

    constructor(props) {
        super(props);
        const { dispatch } = props;
        this.dispatch = dispatch;
        this.cloudName = "pay-earth"
        this.apiKey = "172845922361144";
        this.apiSecret = "3rvc9PNRXy2YOeB9kuFNjrxI8FU";
        //      this.signature = "f878911eba6bc4737f78009826d5fb0683a7e538"
        this.authInfo = store.getState().auth.authInfo;

        this.state = {
            image: "",
            imageId: "",
            video: "",
            videoId: "",
            videoSize: "",
            bannerText: "",
            bannerType: "",
            bannerName: "",
            siteUrl: "",
            category: "",
            tag: "",
            keyword: "",
            startDate: "",
            endDate: "",
            subscriptionPlan: "",
            bannerPlacement: "",
            status: "",
            author: this.authInfo.id,
            card: "",
            selectValueType: "",
        };
    }


    componentDidMount() {
        this.getBannerById();

    }

    getBannerById = () => {
        const { id } = this.props.match.params;
        axios.get(`/user/getBannerById/${id}`, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            console.log("Banner Edit response : ", response.data.data)
            let result = response.data.data
            for (var i = 0; i < result.length; i++) {
                console.log("result", result)
                this.setState({
                    image: result[i].image,
                    imageId: result[i].imageId,
                    video: result[i].video,
                    videoId: result[i].videoId,
                    bannerText: result[i].bannerText,
                    bannerName: result[i].bannerName,
                    bannerType: result[i].bannerType,
                    category: result[i].category,
                    siteUrl: result[i].siteUrl,
                    startDate: result[i].startDate,
                    bannerPlacement: result[i].bannerPlacement,
                    subscriptionPlan: result[i].subscriptionPlan,
                    startDate: result[i].startDate,
                    endDate: result[i].endDate,
                    keyword: result[i].keyword,
                    tag: result[i].tag
                })
            }
        }).catch((error) => {
            console.error('Error:', error);
        });
    }


    handleImageChange = (e) => {
        const file = e.target.files[0];
        const data = new FormData()
        data.append("file", file)
        data.append("upload_preset", "pay-earth-images")
        data.append("cloud_name", "pay-earth")

        console.log("dataIMAge", data)
        // https://api.cloudinary.com/v1_1/pay-earth/video/upload   <= video file example

        fetch("https://api.cloudinary.com/v1_1/pay-earth/image/upload", {
            method: "post",
            body: data
        }).then((res) => res.json())
            .then((data) => {
                // console.log(data.secure_url);
                console.log("data.............................................", data)
                this.setState({ image: data.secure_url })
                this.setState({ imageId: data.public_id })



            }).catch((err) => {
                console.log(err)
            })
    };

    handleVideoChange = (e) => {
        const file = e.target.files[0];
        console.log("Video File Size", file.size)
        const data = new FormData()
        data.append("file", file)
        data.append("upload_preset", "pay-earth-images")
        data.append("cloud_name", "pay-earth")

        fetch("https://api.cloudinary.com/v1_1/pay-earth/video/upload", {
            method: "post",
            body: data
        }).then((res) => res.json())
            .then((data) => {
                // console.log(data.secure_url);
                console.log("dataIMAge", data)
                this.setState({ video: data.secure_url })
                this.setState({ videoSize: this.formatBytes(file.size) });
                this.setState({ videoId: data.public_id })

            }).catch((err) => {
                console.log(err)
            })
    }
    // Function to format file size in a human-readable format
    formatBytes = (bytes) => {
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Byte';
        const i = parseInt(Math.floor(Math.log(bytes) / Math.log(k)));
        return Math.round(100 * (bytes / Math.pow(k, i))) / 100 + ' ' + sizes[i];
    };

    handleBannerText = (e) => {
        // console.log("target value", e.target.value)
        this.setState({ bannerText: e.target.value });
    }
    handleBannerType = (e) => {
        // const selectedText = e.target.options[e.target.selectedIndex].text;
        // console.log("select TYPE", selectedText)
        console.log("bannerType : ", e.target.value)
        this.setState({ bannerType: e.target.value });
    }
    handleBannerName = (e) => {
        this.setState({ bannerName: e.target.value })
    }
    handleSiteUrl = (e) => {
        this.setState({ siteUrl: e.target.value });
    }
    handleCategorySelect = (e) => {
        const selectedText = e.target.options[e.target.selectedIndex].text;
        console.log("select Category", selectedText)
        this.setState({ category: selectedText });
    }
    handleTagChange = (e) => {
        this.setState({ tag: e.target.value });
    }
    handleKeywordChange = (e) => {
        this.setState({ keyword: e.target.value });
    }


    handleStartDate = (e) => {
        this.setState({ startDate: new Date(e.target.value) });
    }
    // handleEndDate = () => {

    // }

    handleSubscriptionPlan = (e) => {
        //  const selectedText = e.target.options[e.target.selectedIndex].text;
        //  console.log("selected TEXT", selectedText)
        this.setState({ subscriptionPlan: e.target.value });
        //  this.setState({ card: e.target.value });
    };
    handleBannerPlacement = (e) => {
        //const selectedText = e.target.options[e.target.selectedIndex].text;
        // console.log("selected PLACEMENT", selectedText)
        this.setState({ bannerPlacement: e.target.value })
    }

    updateSave = () => {
        toast.success("Banner Update succesfully..", { autoClose: 3000 })
        // this.saveBanner("pending");
        this.updateBanner();
        this.props.history.push('/my-banners')
    }
    updateBanner = (status) => {
        const { id } = this.props.match.params;

        const { image, imageId, video, videoId, bannerText, bannerType, bannerName, siteUrl, category, startDate, endDate, subscriptionPlan, bannerPlacement, signaturess, author, tag, keyword } = this.state;
        const url = `/user/updateBanner/${id}`;
        const bannerData = {
            image,
            imageId,
            video,
            videoId,
            bannerText,
            bannerType,
            bannerName,
            siteUrl,
            category,
            startDate,
            endDate,
            subscriptionPlan,
            bannerPlacement,
            status,
            signaturess,
            author,
            keyword,
            tag
        };

        axios.put(url, bannerData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            console.log("BANNER UPDATE SUCCESFULLY", response.date);
        }).catch((error) => {
            console.log("error in update banner data", error);
        });

        this.setState({ image: "", video: "", bannerText: "", bannerType: "", bannerName: "", siteUrl: "", category: "", startDate: "", subscriptionPlan: "", bannerPlacement: "", status: "", author: "", keyword: "", tag: "" })

    }
    renderCardText = () => {
        switch (this.state.subscriptionPlan) {
            case '1 Month':
                return < div className="card">
                    <div className="card-header">
                        PLAN A
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Special title treatment</h5>
                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
                    </div>
                </div>
            // case 'value2':
            //     return 'Card Text for Value 2';
            case '2 Month':
                return <div className="card">
                    <div className="card-header">
                        PLAN B
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Special title treatment</h5>
                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
                    </div>
                </div>
            // Add more cases as needed
            default:
                return <div className="card">
                    <div className="card-header">
                        NO SUBSCRIPTION SELECTED
                    </div>
                    <div className="card-body">
                        <h5 className="card-title">Special title treatment</h5>
                        <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                        {/* <a href="#" className="btn btn-primary">Go somewhere</a> */}
                    </div>
                </div>
        }
    };

    handleSelectImageOrVideo = (e) => {
        const { image, video } = this.state;
        console.log("select type", e.target.value)
        this.setState({ selectValueType: e.target.value });

        if (image) {
            toast.error("Delete selected image", { autoClose: 3000 })
        }
        else if (video) {
            toast.error("Delete Selected video....", { autoClose: 3000 })
        }

    }
    // selectImageOrVideo = () => {
    //     const { image, video, videoSize } = this.state;

    //     switch (this.state.selectImageOrVideo) {

    //         case 'image':
    //             return <div className="crt_bnr_fieldRow">
    //                 <div className="crt_bnr_field">
    //                     <label htmlFor="">Upload Banner Image</label>
    //                     <div className="adv_preview_thumb">
    //                         <div className="thumbPic">
    //                             {!image ? <img src={emptyImg} alt='...' style={{ maxWidth: "50%" }} /> : <img src={image} style={{ maxWidth: "50%" }} />}
    //                             {/* <img src={nicon} alt="" /> */}
    //                         </div>
    //                     </div>
    //                     {!image ? "" :
    //                         <button
    //                             onClick={this.handleDeleteCloudImage}
    //                         >
    //                             CLEAR
    //                         </button>
    //                     }

    //                     <div className="field_item">
    //                         <input
    //                             className="choose_img"
    //                             type="file"
    //                             accept="image/"
    //                             onChange={this.handleImageChange}
    //                         // value={this.state.image}
    //                         />
    //                     </div>
    //                 </div>
    //             </div>
    //         // case 'value2':
    //         //     return 'Card Text for Value 2';
    //         case 'video':
    //             return <div className="crt_bnr_fieldRow">
    //                 <div className="crt_bnr_field">
    //                     <label htmlFor="">Upload Banner Video</label>
    //                     <div className="adv_preview_thumb">
    //                         <div className="thumbPic">
    //                             {!video ? <img src={emptyVid} alt='...' style={{ maxWidth: "50%" }} /> : <div><video src={video} autoPlay loop alt="" /> <p>Size: {videoSize}</p> </div>}
    //                         </div>
    //                     </div>

    //                     {!video ? "" :
    //                         <button
    //                             onClick={this.handleDeleteCloudVideo}
    //                         >
    //                             CLEAR
    //                         </button>
    //                     }
    //                     <div className="field_item">
    //                         <input
    //                             className="choose_video"
    //                             type="file"
    //                             accept="video/*"
    //                             onChange={this.handleVideoChange}
    //                         />
    //                     </div>
    //                 </div>
    //             </div>
    //     }
    // }

    createSignature = () => {
        const { imageId } = this.state
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = CryptoJS.SHA1(`public_id=${imageId}&timestamp=${timestamp}${this.apiSecret}`).toString(CryptoJS.enc.Hex);
        return { timestamp, signature };
    };

    handleDeleteCloudImage = async () => {
        this.setState({ image: "" })
        const { imageId } = this.state
        const { timestamp, signature } = this.createSignature();

        try {
            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`;
            const response = await axios.delete(cloudinaryUrl, {
                params: {
                    public_id: imageId,
                    api_key: this.apiKey,
                    signature: signature,
                    timestamp: timestamp,
                },
            });
            if (response.status === 200) {
                console.log('Image deleted successfully');
            } else {
                console.error('Failed to delete image');
            }
        } catch (error) {
            console.error('Error deleting image', error);
        }
    }

    createSignatureVideo = () => {
        const { videoId } = this.state

        console.log("videoPUBLICK ID", videoId)
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = CryptoJS.SHA1(`public_id=${videoId}&timestamp=${timestamp}${this.apiSecret}`).toString(CryptoJS.enc.Hex);
        return { timestamp, signature };
    };
    handleDeleteCloudVideo = async () => {
        this.setState({ video: "" })
        const { videoId } = this.state;


        const { timestamp, signature } = this.createSignatureVideo();

        try {
            const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/video/destroy`;
            const response = await axios.delete(cloudinaryUrl, {
                params: {
                    public_id: videoId,
                    api_key: this.apiKey,
                    signature: signature,
                    timestamp: timestamp,
                },
            });

            if (response.status === 200) {
                console.log('Video deleted successfully');
            } else {
                console.error('Failed to delete Video');
            }
        } catch (error) {
            console.error('Error deleting Video', error);
        }
    }



    render() {

        const { image, video, selectValueType, siteUrl, subscriptionPlan } = this.state;

        console.log("subscriptionPlan : ", subscriptionPlan)

        console.log("siteURL", siteUrl)
        return (
            <React.Fragment>
                <Header />
                <div className="inr_top_page_title">
                    <h2>Edit Banner</h2>

                </div>
                <section className="inr_wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="cart adv_banner_wrapper">
                                    <div className="noti_wrap">
                                        <div className=""><span>
                                            <Link className="btn custom_btn btn_yellow mx-auto" to="/my-banners">My Banner</Link>
                                        </span></div>
                                    </div>
                                    <div className="cart_list adv_banner_panel">
                                        <div className="create_banner_form">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="crt_bnr_fieldRow">
                                                        {/* <div className="crt_bnr_field">
                                                            <label htmlFor="">Type of Banner</label>
                                                            <div className="field_item">
                                                                <select
                                                                    value={this.state.bannerType}
                                                                    onChange={this.handleBannerType}
                                                                    className="form-control"
                                                                >
                                                                    <option value="default">Select an option</option>
                                                                    <option value="Graphic Banner">Graphic Banner</option>
                                                                    <option value="Text Banner">Text Banner</option>
                                                                </select>
                                                            </div>
                                                        </div> */}
                                                    </div>

                                                    <div className="crt_bnr_fieldRow">
                                                        <div className="crt_bnr_field">
                                                            <label htmlFor="">Banner Name</label>
                                                            <div className="field_item">
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="bannerName"
                                                                    value={this.state.bannerName}
                                                                    onChange={this.handleBannerName}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="crt_bnr_fieldRow">
                                                        <div className="crt_bnr_field">
                                                            <label htmlFor="">Site Url</label>
                                                            <div className="field_item">
                                                                <input
                                                                    type="text"
                                                                    name="siteUrl"
                                                                    value={this.state.siteUrl}
                                                                    className="form-control"
                                                                    onChange={this.handleSiteUrl}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="crt_bnr_fieldRow">
                                                        <div className="crt_bnr_field">
                                                            <label htmlFor="">Category</label>
                                                            <div className="field_item">
                                                                <select
                                                                    value={this.state.category}
                                                                    onChange={this.handleCategorySelect}
                                                                    className="form-control" name="" id="">
                                                                    <option value="default">Select an option</option>
                                                                    <option value="Branding">Branding</option>
                                                                    <option value="Advertising">Advertising</option>
                                                                    <option value="Marketing">Marketing</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* <div className="crt_bnr_fieldRow">
                                                        <div className="crt_bnr_field">
                                                            <label htmlFor="">Start Date</label>
                                                            <div className="field_item">
                                                                <input
                                                                    value={this.state.startDate}
                                                                    type="date"
                                                                    name=""
                                                                    id=""
                                                                    className="form-control"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div> */}

                                                    {/* <div className="crt_bnr_fieldRow">
                                                        <div className="crt_bnr_field">
                                                            <label htmlFor="">Plan Valid Upto</label>
                                                            <div className="field_item">
                                                                <input
                                                                    class="form-control"
                                                                    type="text"
                                                                    value={`Plan is valid till ${this.state.endDate}`}
                                                                    //  value="Disabled readonly input"
                                                                    aria-label="Disabled input example"
                                                                    disabled readonly
                                                                />
                                                            </div>
                                                        </div>
                                                    </div> */}

                                                    <div className="crt_bnr_fieldRow">
                                                        <div className="crt_bnr_field">
                                                            <label htmlFor="">Tag</label>
                                                            <div className="field_item">
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="tag"
                                                                    id=""
                                                                    value={this.state.tag}
                                                                    onChange={this.handleTagChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="crt_bnr_fieldRow">
                                                        <div className="crt_bnr_field">
                                                            <label htmlFor="">Keywords</label>
                                                            <div className="field_item">
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="keyword"
                                                                    id=""
                                                                    value={this.state.keyword}
                                                                    onChange={this.handleKeywordChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>


                                                    <div className="crt_bnr_fieldRow">
                                                        <div className="crt_bnr_field">
                                                            <label htmlFor="">Meta information</label>
                                                            <div className="field_item">
                                                                <textarea
                                                                    type="text"
                                                                    name="bannerText"
                                                                    value={this.state.bannerText}
                                                                    onChange={this.handleBannerText}
                                                                    cols="30"
                                                                    rows="10"
                                                                    className="form-control"
                                                                ></textarea>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* <div className="crt_bnr_fieldRow">
                                                        <div className="crt_bnr_field">
                                                            <div className="field_item">
                                                                <button
                                                                    className="btn custom_btn btn_yellow mx-auto"
                                                                    onClick={this.updateSave}
                                                                >
                                                                    Update Banner
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </div>


                                                <div className="col-md-6">
                                                    <div className="crt_bnr_fieldRow">
                                                        <label htmlFor="">Set Banner</label>
                                                        <div className="input-group mb-3">
                                                            {/* <label className="input-group-text" htmlFor="inputGroupSelect01">Set <br /> Banner</label> */}
                                                            <select onChange={this.handleSelectImageOrVideo} className="form-select" id="inputGroupSelect01">
                                                                {!image && !video ? <>
                                                                    <option value="image"> Image </option>
                                                                    <option value="video"> Video </option>
                                                                </> : image ? <> <option value="image"> Image </option> </>
                                                                    : <> <option value="video"> Video </option></>
                                                                }

                                                                {/* <option value="image"> Image </option>
                                                                 <option value="video"> Video </option> */}
                                                            </select>
                                                            {/* <div className="crt_bnr_fieldRow">
                                                                <div className="input-group mb-3">
                                                                    <label className="input-group-text" htmlFor="inputGroupSelect01">Banner <br /> Placement</label>
                                                                    <select
                                                                        value={this.state.bannerPlacement}
                                                                        onChange={this.handleBannerPlacement}
                                                                        className="form-select" id="inputGroupSelect01">
                                                                        <option value="Top-side">Top-side</option>
                                                                        <option value="Right-side">Right-side</option>
                                                                        <option value="Bottom-side">Bottom-side</option>
                                                                        <option value="Left-side">Left-side</option>
                                                                    </select>
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {selectValueType === "video" || video ?
                                                            <div className="crt_bnr_fieldRow">
                                                                <div className="crt_bnr_field">
                                                                    <label htmlFor=""> Upload Banner Video &nbsp; {!video ? "" :
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-secondary btn-sm"
                                                                            onClick={this.handleDeleteCloudVideo}
                                                                        >
                                                                            CLEAR
                                                                        </button>
                                                                    } </label>
                                                                    <div className="adv_preview_thumb">
                                                                        <div className="thumbPic">
                                                                            {!video ? <img src={emptyVid} alt='...' style={{ maxWidth: "30%" }} /> : <div> <video src={video} autoPlay loop alt="" style={{ maxWidth: "60%" }} />  </div>}
                                                                        </div>
                                                                    </div>

                                                                    {/* {!video ? "" :
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-secondary btn-sm"
                                                                            onClick={this.handleDeleteCloudVideo}
                                                                        >
                                                                            CLEAR
                                                                        </button>
                                                                    } */}
                                                                    <div className="field_item">
                                                                        <input
                                                                            className="form-control"
                                                                            type="file"
                                                                            accept="video/*"
                                                                            onChange={this.handleVideoChange}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            :
                                                            <div className="crt_bnr_fieldRow">
                                                                <div className="crt_bnr_field">
                                                                    <label htmlFor="">Upload Banner Image &nbsp; {!image ? "" :
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-secondary btn-sm"
                                                                            onClick={this.handleDeleteCloudImage}
                                                                        >
                                                                            CLEAR
                                                                        </button>
                                                                    }</label>
                                                                    <div className="adv_preview_thumb">
                                                                        <div className="thumbPic">
                                                                            {!image ? <img src={emptyImg} alt='...' style={{ maxWidth: "50%" }} /> : <img src={image} style={{ maxWidth: "50%" }} />}
                                                                            {/* <img src={nicon} alt="" /> */}
                                                                        </div>
                                                                    </div>
                                                                    {/* {!image ? "" :
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-secondary btn-sm"
                                                                            onClick={this.handleDeleteCloudImage}
                                                                        >
                                                                            CLEAR
                                                                        </button>
                                                                    } */}
                                                                    <div className="field_item">
                                                                        <input
                                                                            className="form-control"
                                                                            type="file"
                                                                            accept="image/"
                                                                            onChange={this.handleImageChange}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>}
                                                    </div>
                                                </div>


                                                <div className="col-md-12 bg-body-tertiary">
                                                    <div className="row">
                                                        <div className="col-md-2">

                                                        </div>
                                                        <div className="col-md-10">
                                                            <h3>Your Selected plan : </h3>
                                                            <div className="wrapper">
                                                                <div className="pricing-table group">
                                                                    <div className="block personal f2" >
                                                                        <h2 className="title" > {subscriptionPlan.planType}</h2>
                                                                        <div className="content">
                                                                            <p className="price">
                                                                                <sup>$</sup>
                                                                                <span>{subscriptionPlan.planPrice}</span>
                                                                                <sub>/mo.</sub>
                                                                            </p>
                                                                            <p className="hint">Perfect for freelancers</p>
                                                                        </div>
                                                                        <ul className="features">
                                                                            <li><span className="fontawesome-cog"></span>1 WordPress Install</li>
                                                                            <li><span className="fontawesome-star"></span>25,000 visits/mo.</li>
                                                                            <li><span className="fontawesome-dashboard"></span>Unlimited Data Transfer</li>
                                                                            <li><span className="fontawesome-cloud"></span>10GB Local Storage</li>
                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>

                                                    <div className="crt_bnr_fieldRow">
                                                        <div className="crt_bnr_field">
                                                            <div className="field_item">
                                                                <button
                                                                    className="btn custom_btn btn_yellow mx-auto"
                                                                    onClick={this.updateSave}
                                                                >
                                                                    Update Banner
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
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

export default MyBannerEdit;