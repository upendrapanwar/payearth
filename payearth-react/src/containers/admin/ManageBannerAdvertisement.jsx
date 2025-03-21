import React, { Component } from 'react';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import { toast } from 'react-toastify';
import emptyImg from './../../assets/images/emptyimage.png'
import emptyVid from './../../assets/images/emptyVid.png'
import store from '../../store/index';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import { Helmet } from 'react-helmet';
import arrow_back from '../../assets/icons/arrow-back.svg'

class ManageBannerAdvertisement extends Component {

    constructor(props) {
        super(props);
        this.cloudName = process.env.REACT_APP_CLOUD_NAME
        this.apiKey = process.env.REACT_APP_CLOUD_API_KEY
        this.apiSecret = process.env.REACT_APP_CLOUD_API_SECRET
        this.authInfo = store.getState().auth.authInfo;
        this.userInfo = store.getState().auth.userInfo;

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
            startDate: new Date(),
            endDate: "",
            subscriptionPlan: null,
            bannerPlacement: "",
            status: "",
            author: this.authInfo.id,
            authorDetails: {
                email: this.userInfo.email,
                name: this.userInfo.name,
                role: this.userInfo.role,
            },
            card: "",
            selectImageOrVideo: "",
            isSelectplan: false,
            customerId: "",
            subscriptionId: "",
            paymentMethodId: null,
        };
    }

    generateUniqueSlug = (bannerName) => {
        return bannerName
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim();
    }

    handleImageChange = (e) => {
        const file = e.target.files[0];
        // console.log(" image file size", file.size)
        const fileSize = file.size
        // 5242880 = 5mb
        const maxSize = 5242880;
        if (fileSize <= maxSize) {
            const data = new FormData()
            data.append("file", file)
            data.append("upload_preset", "pay-earth-images")
            data.append("cloud_name", `${this.cloudName}`)

            console.log("dataIMAge", data)
            // https://api.cloudinary.com/v1_1/${this.cloudName}/video/upload   <= video file example

            fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
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
        } else {
            toast.error("Banner size must be less than 5 MB", { autoClose: 3000 })
        }
    };

    handleVideoChange = (e) => {
        const file = e.target.files[0];
        console.log("Video File Size", this.formatBytes(file.size))
        const fileSize = file.size;
        console.log("fileSize", file.size)
        // 11534336 = 11MB 
        const maxSize = 11534336;
        if (fileSize <= maxSize) {
            const data = new FormData()
            data.append("file", file)
            data.append("upload_preset", "pay-earth-images")
            data.append("cloud_name", `${this.cloudName}`)

            fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/video/upload`, {
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
        } else {
            toast.error("Banner size must be less than 11 MB", { autoClose: 3000 })
        }

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
        //  const selectedText = e.target.options[e.target.selectedIndex].text;
        // console.log("select TYPE", selectedText)
        this.setState({ bannerType: e.target.value });
    }
    handleBannerName = (e) => {
        this.setState({ bannerName: e.target.value })
    }
    handleSiteUrl = (e) => {
        console.log("siteURL ::::::", e.target.value)
        this.setState({ siteUrl: e.target.value });
    }
    handleCategorySelect = (e) => {
        //  const selectedText = e.target.options[e.target.selectedIndex].text;
        //  console.log("select Category", selectedText)
        this.setState({ category: e.target.value });
    }

    handleTagChange = (e) => {
        this.setState({ tag: e.target.value });
    }
    handleKeywordChange = (e) => {
        this.setState({ keyword: e.target.value });
    }

    handleStartDate = (e) => {
        this.setState({ startDate: new Date(e.target.value) });
        // this.calculateDate();
    }

    handleBannerPlacement = (e) => {
        const selectedText = e.target.options[e.target.selectedIndex].text;
        console.log("selected PLACEMENT", selectedText)
        this.setState({ bannerPlacement: selectedText })
    }
    handleSave = () => {
        const { bannerName, category } = this.state;

        // if (subscriptionPlan === "") {
        //     toast.error("Select Subscription plan.....", { autoClose: 3000 })
        // }
        if (bannerName === "") {
            toast.error("Enter Banner Name.....", { autoClose: 3000 })
        }
        if (category === "") {
            toast.error("Select Category.....", { autoClose: 3000 })
        } else {
            this.saveBanner("Publish")

            // this.handlePayment();
            toast.success("Banner Create succesfully..", { autoClose: 3000 })


        }
    }
    saveBanner = (status) => {
        const { image, imageId, video, videoId, bannerText, bannerType, bannerName, siteUrl, category, startDate, endDate, subscriptionPlan, bannerPlacement, signaturess, author, authorDetails, tag, keyword } = this.state;
        const slug = this.generateUniqueSlug(bannerName);
        const url = '/admin/createNewBanner';
        const bannerData = {
            image, imageId, video, videoId, bannerText, bannerType, bannerName, slug, siteUrl, category, startDate, endDate, subscriptionPlan, bannerPlacement, status, signaturess, author, authorDetails, tag, keyword,
        };

        axios.post(url, bannerData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json;charset=UTF-8',
                'Authorization': `Bearer ${this.authInfo.token}`
            }
        }).then((response) => {
            console.log("SUCCESS BANNER POST", response.date);
            this.props.history.push('/admin/manage-advertisement')
        }).catch((error) => {
            console.log("error in save banner date", error);
        });

        this.setState({ image: "", video: "", bannerText: "", bannerType: "", bannerName: "", siteUrl: "", category: "", startDate: "", endDate: "", subscriptionPlan: "", bannerPlacement: "", status: "", author: "", tag: "", keyword: "" })

    }

    handleSelectImageOrVideo = (e) => {
        console.log("select IMAGE OR VIDEO", e.target.value)
        this.setState({ selectImageOrVideo: e.target.value });
    }

    selectImageOrVideo = () => {
        const { image, video } = this.state;

        switch (this.state.selectImageOrVideo) {
            case 'video':
                return <div className="crt_bnr_fieldRow">
                    <div className="crt_bnr_field">
                        <label htmlFor="">Upload Advertisement Video &nbsp;  {!video ? "" :
                            <button
                                type="button"
                                className="btn btn-secondary btn-sm"
                                onClick={this.handleDeleteCloudVideo}
                            >
                                CLEAR
                            </button>
                        }</label>
                        <div className="adv_preview_thumb">
                            <div className="thumbPic">
                                {!video ? <div><img src={emptyVid} alt='...' style={{ maxWidth: "40%" }} /> <p className='text-danger'> Size must be less than 11 MB</p></div> : <div><video src={video} autoPlay loop alt="" /></div>}
                            </div>
                        </div>
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
            default:
                return <div className="crt_bnr_fieldRow">
                    <div className="crt_bnr_field">
                        <label htmlFor="">Upload Advertisement Image &nbsp; {!image ? "" :
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
                                {!image ? <div><img src={emptyImg} alt='...' style={{ maxWidth: "40%" }} /><p className='text-danger'> Size must be less than 5 MB</p></div> : <img src={image} alt='...' style={{ height: '50%', width: '100%' }} />}
                                {/* <img src={nicon} alt="" /> */}
                            </div>
                        </div>
                        <div className="field_item">
                            <input
                                className="form-control"
                                type="file"
                                accept="image/"
                                onChange={this.handleImageChange}
                            />
                        </div>
                    </div>
                </div>
        }
    }

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
        return (
            <React.Fragment>
                <Header />
                <div className="inr_top_page_title">
                    <h2>Create Advertisement</h2>
                </div>
                <section className="inr_wrap">
                    <Helmet><title>{"Admin - Create Advertisement - Pay Earth"}</title></Helmet>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="cart adv_banner_wrapper">
                                    <div className="noti_wrap">
                                        <div className=""><span>
                                            <Link className="btn custom_btn btn_yellow mx-auto" to="/admin/manage-advertisement">
                                                <img src={arrow_back} alt="back" />&nbsp;
                                                Back
                                            </Link>
                                        </span></div>
                                    </div>
                                    <div className="cart_list adv_banner_panel">
                                        <div className="create_banner_form">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="crt_bnr_fieldRow">
                                                        <div className="crt_bnr_field">
                                                            <label htmlFor="">Advertisement Name</label>
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
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="siteUrl"
                                                                    value={this.state.siteUrl}
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
                                                                    type="date"
                                                                    className="form-control"
                                                                    value={this.state.startDate.toISOString().substr(0, 10)}
                                                                    onChange={this.handleStartDate}
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

                                                    {/* <div className="crt_bnr_fieldRow">
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
                                                    </div>  */}

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
                                                            <div className="text-area field_item">
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
                                                                    onClick={this.handleSave}
                                                                >
                                                                    Create Banner
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div> */}
                                                </div>


                                                <div className="col-md-6">
                                                    <div className="crt_bnr_fieldRow">
                                                        <label htmlFor="">Select</label>
                                                        <div className="input-group mb-3">
                                                            {/* <label className="input-group-text" htmlFor="inputGroupSelect01">Set <br /> Banner</label> */}
                                                            <select onChange={this.handleSelectImageOrVideo} className="form-select" id="inputGroupSelect01">
                                                                <option value="image"> IMAGE </option>
                                                                <option value="video"> VIDEO</option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div>
                                                        {this.selectImageOrVideo()}
                                                    </div>
                                                </div>
                                                {/* background-color: aliceblue */}

                                                <div className="col-md-12 plan-cart mt-4">
                                                    <div className="crt_bnr_fieldRow">
                                                        <div className="crt_bnr_field">
                                                            <div className="field_item text-center">
                                                                <button
                                                                    className="btn custom_btn btn_yellow mx-auto createbtn"
                                                                    onClick={this.handleSave}
                                                                >
                                                                    Create Advertisement
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

export default ManageBannerAdvertisement;









