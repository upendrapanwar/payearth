import React, { Component } from 'react';
import Header from '../../components/seller/common/Header';
import Footer from '../../components/common/Footer';
import { toast } from 'react-toastify';
import emptyImg from './../../assets/images/emptyimage.png'
import emptyVid from './../../assets/images/emptyVid.png'
import store from '../../store/index';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CryptoJS from 'crypto-js';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import { Helmet } from 'react-helmet';

class SellerManageBannerAdvertisement extends Component {

    constructor(props) {
        super(props);
        this.cloudName = process.env.REACT_APP_CLOUD_NAME
        this.apiKey = process.env.REACT_APP_API_KEY
        this.apiSecret = process.env.REACT_APP_API_SECRET
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
            isChecked: false,
            selectedPlan: '',
            subPlanId: "",
            advertiseAllowed: "",
            sellerSubscriptionPlan: "",
            previousSubscription: "",
            loading: true,
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

    componentDidMount() {
        // this.fetchStripePlans();
        this.getSubscriptionPlanBySeller();
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
            data.append("cloud_name", "pay-earth")

            // console.log("dataIMAge", data)
            // https://api.cloudinary.com/v1_1/${this.cloudName}/video/upload   <= video file example

            fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
                method: "post",
                body: data
            }).then((res) => res.json())
                .then((data) => {
                    // console.log(data.secure_url);
                    // console.log("data.............................................", data)
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
        // console.log("Video File Size", this.formatBytes(file.size))
        const fileSize = file.size;
        // console.log("fileSize", file.size)
        // 11534336 = 11MB 
        const maxSize = 11534336;
        if (fileSize <= maxSize) {
            const data = new FormData()
            data.append("file", file)
            data.append("upload_preset", "pay-earth-images")
            data.append("cloud_name", "pay-earth")

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
        console.log("keyword", e.target.value)
        this.setState({ keyword: e.target.value });
    }

    handleStartDate = (e) => {

        //  const startDate = new Date(e.target.value);

        // this.setState({ startDate: startDate })

        // this.setState({ startDate }, () => {
        //     this.calculateDate();
        // })
        this.setState({ startDate: new Date(e.target.value) });
        // this.calculateDate();
    }


    clickCheckBox = async () => {
        const { bannerName, category, keyword, subPlanId } = this.state;
        // console.log("Unchecked or Checked : ", subPlanId)
        if (bannerName && keyword && category && subPlanId === "") {
            toast.error("Fields are required.....", { autoClose: 3000 })
        }
        else {
            try {
                const url = `/seller/sellerAddPlan/${subPlanId}`
                const data = {
                    usageCount: {
                        authorId: this.authInfo.id
                    }
                }
                await axios.put(url, data, {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': `Bearer ${this.authInfo.token}`
                    }
                }).then((response) => {
                    console.log("Response", response.data.status)
                    // this.setState({ subscriptionChecked: response.data.status })
                }).catch((error) => {
                    console.log("Error", error)
                })
            } catch (error) {
                console.log("error", error)
            }
        }

        // if (bannerName && category && keyword && subPlanId !== "") {
        //     try {
        //         const url = `/seller/sellerAddPlan/${subPlanId}`
        //         const data = {
        //             usageCount: {
        //                 authorId: this.authInfo.id
        //             }
        //         }
        //         await axios.put(url, data, {
        //             headers: {
        //                 'Accept': 'application/json',
        //                 'Content-Type': 'application/json;charset=UTF-8',
        //                 'Authorization': `Bearer ${this.authInfo.token}`
        //             }
        //         }).then((response) => {
        //             console.log("Response", response.data.status)
        //             // this.setState({ subscriptionChecked: response.data.status })
        //         }).catch((error) => {
        //             console.log("Error", error)
        //         })
        //     } catch (error) {
        //         console.log("error", error)
        //     }
        // } else {
        //     alert("Please select checkbox...for continue")
        // }
    };


    handleCheckboxChange = () => {
        const { sellerSubscriptionPlan, subPlanId } = this.state;
        this.setState(prevState => ({
            isChecked: !prevState.isChecked
        }), () => {
            // Perform additional actions based on the checkbox state
            if (this.state.isChecked) {
                // console.log("sellerSubscriptionPlan : ", sellerSubscriptionPlan)
                // console.log("sellerSubscriptionPlan _id : ", sellerSubscriptionPlan._id)
                // console.log('Checkbox is checked', sellerSubscriptionPlan._id);
                this.setState({ subPlanId: sellerSubscriptionPlan._id })
                this.setState({ advertiseAllowed: sellerSubscriptionPlan.metadata.advertiseAllowed })
                // Add your logic to add data here
            } else {
                this.setState({ subPlanId: "" })
                console.log('Checkbox is unchecked ', subPlanId);

                // Add your logic to remove data here
            }
        });
    }

    handleBannerPlacement = (e) => {
        const selectedText = e.target.options[e.target.selectedIndex].text;
        console.log("selected PLACEMENT", selectedText)
        this.setState({ bannerPlacement: selectedText })
    }
    handleSave = () => {
        const { bannerName, category, keyword, image, video, siteUrl, advertiseAllowed, sellerSubscriptionPlan } = this.state;
        let isError = false;
        if (bannerName === "") {
            toast.error("Advertise name is required.....", { autoClose: 3000 })
            isError = true;
        }
        if (keyword === "") {
            toast.error("keyword is required.....", { autoClose: 3000 })
            isError = true;
        }
        if (category === "") {
            toast.error("Category is required.....", { autoClose: 3000 })
            isError = true;
        }
        if (siteUrl === "") {
            toast.error("SiteUrl is required.....", { autoClose: 3000 })
            isError = true;
        }
        if (image === "" && video === "") {
            toast.error("Media image or video is required", { autoClose: 3000 })
            isError = true;
        }
        if (!isError) {
            this.saveBanner("Publish")
        }

    }
    saveBanner = (status) => {
        const { image, imageId, video, videoId, bannerText, bannerType, bannerName, siteUrl, category, startDate, endDate, bannerPlacement, signaturess, author, authorDetails, tag, keyword, subPlanId, advertiseAllowed } = this.state;
        const slug = this.generateUniqueSlug(bannerName);
        console.log("subPlanId check : ", subPlanId)

        if (subPlanId === "") {
            alert("Validation failed")
        } else {
            const url = '/seller/createSellerBanners';
            const bannerData = { image, imageId, video, videoId, bannerText, bannerType, bannerName, slug, siteUrl, category, startDate, endDate, bannerPlacement, status, signaturess, author, authorDetails, tag, keyword, subPlanId };
            axios.post(url, bannerData, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${this.authInfo.token}`
                }
            }).then((response) => {
                // console.log("RESPONSE STATUS", response.data.status)
                if (response.data.status === true) {
                    // this.clickCheckBox();
                    try {
                        const url = `/seller/sellerAddPlan/${subPlanId}`
                        const data = {
                            usageCount: {
                                authorId: this.authInfo.id
                            },
                            metadata: {
                                advertiseAllowed: advertiseAllowed
                            }
                        }
                        console.log("Allowed Data for advertisment", data)
                        axios.put(url, data, {
                            headers: {
                                'Accept': 'application/json',
                                'Content-Type': 'application/json;charset=UTF-8',
                                'Authorization': `Bearer ${this.authInfo.token}`
                            }
                        }).then((response) => {
                            console.log("Response", response.data.status)
                            toast.success("Your subscription count ..", { autoClose: 3000 })
                            // this.setState({ subscriptionChecked: response.data.status })
                        }).catch((error) => {
                            console.log("Error", error)
                        })
                    } catch (error) {
                        console.log("error", error)
                    }
                    toast.success("Advertise Create Succesfully..", { autoClose: 3000 })
                    this.props.history.push('/seller/manage-banner-list');
                } else {
                    toast.error("Somthing went wrong....", { autoClose: 3000 })
                }
            }).catch((error) => {
                console.log("error in save banner date", error);
            });
            // this.props.history.push('/seller/manage-banner-list');
            this.setState({ image: "", video: "", bannerText: "", bannerType: "", bannerName: "", siteUrl: "", category: "", startDate: "", endDate: "", bannerPlacement: "", status: "", author: "", tag: "", keyword: "" })
        }
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
                        <div className="media field_item">
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
                        <div className="media field_item">
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

    // fetchStripePlans = async () => {
    //     console.log("fetchStrip plan function is run")
    //     try {
    //         const stripeSecretKey = process.env.REACT_APP_SECRET_KEY;
    //         const response = await axios.get(`https://api.stripe.com/v1/plans`, {
    //             headers: {
    //                 Authorization: `Bearer ${stripeSecretKey}`,
    //             },
    //         });

    //         console.log("response.data", response.data.data)
    //         console.log("response.data", response.data)
    //         // setPlans(fetchedPlans);
    //     } catch (error) {
    //         console.error('Error fetching Stripe plans:', error);
    //     }
    // };

    getSubscriptionPlanBySeller = async () => {
        try {
            const url = `/seller/getSubscriptionPlanBySeller/${this.authInfo.id}`;
            axios.get(url, {
                headers: {
                    'Authorization': `Bearer ${this.authInfo.token}`
                },
            })
                .then(response => {
                    // console.log("res>>>>.", response.data.data)
                    if (Array.isArray(response.data.data) && response.data.data.length > 0) {
                        const latest = response.data.data[0];
                        // const previousPlan = response.data.data[1]
                        // console.log("latest", latest)
                        // console.log("previousPlan", previousPlan)
                        // if (previousPlan !== undefined) {
                        //     const { usageCount } = previousPlan;
                        //     for (const usage of usageCount) {
                        //         if (usage.authorId === this.authInfo.id) {
                        //             // console.log("sub_id with author", usage.sub_id)
                        //             // console.log("previous data", usage._id)
                        //             try {
                        //                 const response = axios.delete(`https://api.stripe.com/v1/subscriptions/${usage.sub_id}`, {
                        //                     headers: {
                        //                         Authorization: `Bearer ${process.env.REACT_APP_STRIPE_SECRET_KEY}`, // Replace with your actual Stripe secret key
                        //                         'Content-Type': 'application/x-www-form-urlencoded',
                        //                     },
                        //                 });
                        //                 console.log("response", response.data)
                        //             } catch (error) {
                        //                 if (error.response && error.response.status === 404) {
                        //                     // Subscription not found in Stripe, handle accordingly
                        //                     console.log("Subscription not found in Stripe:", error.response.data);
                        //                 } else {
                        //                     // Handle other errors
                        //                     console.error("Error deleting subscription:", error);
                        //                 }
                        //             }

                        //         }
                        //     }
                        // }
                        this.setState({
                            sellerSubscriptionPlan: latest,
                            loading: false,
                        });

                    } else {
                        this.setState({
                            sellerSubscriptionPlan: "",
                            loading: false,
                        });
                    }
                    // this.setState({
                    //     sellerSubscriptionPlan: res.data.data[0],
                    // })
                })
                .catch(error => {
                    console.log("Error in fetching plan", error)
                    // this.setState({
                    //     sellerSubscriptionPlan: "",
                    // })
                })

        } catch (error) {
            console.error('No plan Selected', error);
        }
    }



    getCountForAuthor = (sellerSubscriptionPlan) => {
        const authorId = this.authInfo.id;

        if (!sellerSubscriptionPlan || !sellerSubscriptionPlan.usageCount) {
            return 0; // Return 0 if sellerSubscriptionPlan or usageCount is undefined
        }
        const usageCount = sellerSubscriptionPlan.usageCount.find((item) => item.authorId === authorId);
        return usageCount ? usageCount.count : 0; // Return count if found, otherwise return 0
    }

    render() {
        const { sellerSubscriptionPlan, advertiseAllowed, previousSubscription, loading } = this.state;

        if (loading) {
            return <SpinnerLoader />
        }
 
        const count = this.getCountForAuthor(sellerSubscriptionPlan)
        // console.log("count", count)

        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ""}
                <Header />
                <div className="inr_top_page_title">
                    <h2>Create New Advertisement</h2>
                </div>
                <Helmet>
                    <title>{"Manage Advertisement - Pay Earth"}</title>
                </Helmet>
                <section className="inr_wrap">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <div className="cart adv_banner_wrapper">
                                    <div className="noti_wrap">
                                        <div className=""><span>
                                            <Link className="btn custom_btn btn_yellow mx-auto" to="/seller/manage-banner-list">My Advertisement</Link>
                                        </span></div>
                                    </div>
                                    <div className="cart_list adv_banner_panel">
                                        <div className="create_banner_form">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="crt_bnr_fieldRow">
                                                        <div className="crt_bnr_field">
                                                            <label htmlFor="">Advertisement Name *</label>
                                                            <div className="field_item">
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="bannerName"
                                                                    value={this.state.bannerName}
                                                                    placeholder="Enter Advertisement Name"
                                                                    onChange={this.handleBannerName}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="crt_bnr_fieldRow">
                                                        <div className="crt_bnr_field">
                                                            <label htmlFor="">Site Url *</label>
                                                            <div className="field_item">
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    name="siteUrl"
                                                                    value={this.state.siteUrl}
                                                                    placeholder="Enter Site Url"
                                                                    onChange={this.handleSiteUrl}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="crt_bnr_fieldRow">
                                                        <div className="crt_bnr_field">
                                                            <label htmlFor="">Category *</label>
                                                            <div className="field_item">
                                                                <select
                                                                    onChange={this.handleCategorySelect}
                                                                    className="form-control" name="" id="">
                                                                    <option value="default">Select Category</option>
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
                                                    </div> */}

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
                                                                    placeholder="Enter Keyword"
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
                                                                    placeholder="Enter Meta Information"
                                                                    cols="30"
                                                                    rows="10"
                                                                    className="form-control"
                                                                ></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
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

                                                <div className="col-md-12 bg-body-tertiary advBannerEditWrap">
                                                    <div className="row">
                                                        {sellerSubscriptionPlan !== "" ? <>
                                                            <div className="col-md-12" key={sellerSubscriptionPlan.id}>
                                                                <h3 className="text-center selectPlanHeading text-bg-success p-3">Your Subscription Plan Is Active With Remaining {sellerSubscriptionPlan.metadata.advertiseAllowed - count} Advertise Allowed....! </h3>
                                                                {advertiseAllowed === count ? <p className="text-center text-danger">Advertisement Limit is Completed...!</p> : ''}
                                                                <div className="wrapper">
                                                                    <div className="pricing-table group">
                                                                        <div className="block personal f2" >
                                                                            <h2 className="title" > {sellerSubscriptionPlan.nickname}</h2>
                                                                            <div className="content">
                                                                                <p className="price">
                                                                                    <sup>$</sup>
                                                                                    <span>{sellerSubscriptionPlan.amount}</span>
                                                                                </p>
                                                                                <p className="hint">Payment Interval Per <b>{sellerSubscriptionPlan.interval_count} {sellerSubscriptionPlan.interval}</b></p>
                                                                                {/* <p> Count is {this.getCountForAuthor(sellerSubscriptionPlan)}</p> */}
                                                                                <p className="hint"> Total advertisements allowed <b>{sellerSubscriptionPlan.metadata.advertiseAllowed}</b></p>
                                                                            </div>
                                                                            <ul className="features">
                                                                                {/* <p><span className="fontawesome-cog"></span>Maximum number of advertisements allowed {sellerSubscriptionPlan.metadata.advertiseAllowed}
                                                                                    Advertisements displayed in rotation with other Basic Plan advertisers
                                                                                    Access to basic analytics (number of views, clicks, etc.)
                                                                                    Support available during business hours
                                                                                </p>
                                                                                <p>Maximum number of advertisements allowed <b>{sellerSubscriptionPlan.metadata.advertiseAllowed}</b>.</p>
                                                                                <p>Payment Interval Per <b>{sellerSubscriptionPlan.interval_count} {sellerSubscriptionPlan.interval}</b>.</p> */}
                                                                                <div className='features' dangerouslySetInnerHTML={{ __html: sellerSubscriptionPlan.metadata.descriptions }}></div>

                                                                                <div className="custom-control custom-checkbox">
                                                                                    <div class="row align-items-center">
                                                                                        <div class="col-auto">
                                                                                            <input
                                                                                                type="checkbox"
                                                                                                className="custom-control-input"
                                                                                                id="checkboxNoLabel"
                                                                                                checked={this.state.isChecked}
                                                                                                onChange={this.handleCheckboxChange}
                                                                                            />
                                                                                        </div>
                                                                                        <div class="col-auto">
                                                                                            <label className="custom-control-label right-align">
                                                                                                {this.state.isChecked === false ? "Checkbox is not checked" : "Checkbox is checked"}
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </ul>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </> : <>
                                                            <h2 class="text-center text-bg-danger p-3 position-relative">No Any Subscription Plan Is Active
                                                                <Link to="/seller/manage-subscription-plan" class="position-absolute top-1 end-0">
                                                                    <span class="text-bg-primary">Buy Subscription....</span>
                                                                </Link>
                                                            </h2>
                                                        </>
                                                        }
                                                    </div>
                                                    {/* {previousSubscription === "" ? "" : <>
                                                        <div class=" text-center alert alert-dark" >
                                                            Your Previous Subscription Plan {previousSubscription.nickname} Is Deactivated
                                                        </div>
                                                    </>} */}
                                                    <div className="crt_bnr_fieldRow">
                                                        <div className="crt_bnr_field">
                                                            <div className="field_item text-center">
                                                                <button
                                                                    disabled={advertiseAllowed === count}
                                                                    className="btn custom_btn btn_yellow mx-auto createbtn"
                                                                    onClick={this.handleSave}
                                                                // onClick={this.handleCheck}
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

export default SellerManageBannerAdvertisement;