import React, { Component } from 'react';
import Header from '../../components/seller/common/Header';
import Footer from '../../components/common/Footer';
import { Formik } from 'formik';
import { toast } from 'react-toastify';
import { setLoading } from '../../store/reducers/global-reducer';
import { connect } from 'react-redux';
import store from '../../store/index';
import axios from 'axios';
import nicon from './../../assets/images/nicon.png';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import 'react-data-table-component-extensions/dist/index.css';
import CryptoJS from 'crypto-js';
import Modal from "react-bootstrap/Modal";
import SpinnerLoader from '../../components/common/SpinnerLoader';
import noImg from './../../assets/images/noimage.png'
import ModalBody from 'react-bootstrap/esm/ModalBody';
import { Dropdown } from 'bootstrap';
import { DropdownButton } from 'react-bootstrap';
import Iframe from 'react-iframe-click';
import whatsapp from './../../assets/icons/whatsapp.svg'
import linkedinIcon from './../../assets/icons/linkedin.svg';
import twitterIcon from './../../assets/icons/twitter.svg';
import facebook from './../../assets/icons/facebook.svg';
import instagram from './../../assets/icons/instagram.svg'
import { Helmet } from 'react-helmet';



class SellerBannerList extends Component {
  constructor(props) {
    super(props);
    this.cloudName = process.env.REACT_APP_CLOUD_NAME
    this.apiKey = process.env.REACT_APP_CLOUD_API_KEY
    this.apiSecret = process.env.REACT_APP_CLOUD_API_SECRET
    this.authInfo = store.getState().auth.authInfo;
    // console.log("Auth", this.userInfo.name)
    this.state = {
      selectedRows: [],
      banner: [],
      show: false,
      showModal: false,
      selectedRowData: null,
      loading: true,
      error: null,
      show: false,
      isShareOpen: false,
      shareAdvertise: ""
    };
  }

  componentDidMount() {
    this.getBanner();
  }

  handleClose = () => {
    this.setState({ selectedRowData: false });
  };

  handlePreview = (row) => {
    this.setState({ selectedRowData: row });
    this.setState({ showModal: true });
  };

  getBanner = () => {
    let sellerId = this.authInfo.id
    // console.log("sellerId", sellerId)
    axios.get(`/seller/getBannersBySellerId/${sellerId}`, {
      headers: {
        'Authorization': `Bearer ${this.authInfo.token}`
      },
    })
      .then((response) => {
        if (response.data.status === true) {
          this.setState({
            banner: response.data.data,
            loading: false,
            error: null
          })
        } else {
          this.setState({
            banner: [],
            loading: false,
            error: { message: "Status is not true" }
          });
        }

      })
      .catch(error => {
        this.setState({
          banner: [],
          loading: false,
          error: error
        })
      })
  }

  handleRowSelected = (state) => {
    // console.log("selected Row : ", state.selectedRows)
    this.setState({ selectedRows: state.selectedRows });
  };

  //********************************************************

  handleDeleteSeletedData = async () => {
    // const { timestamp, signature } = this.createSignature();
    const imgDelUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`;
    const vidDelUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/video/destroy`;
    const { selectedRows } = this.state;

    const cloudPublicId = selectedRows.map(item => item.imageId === "" ? item.videoId : item.imageId);
    console.log("cloudPublicId", cloudPublicId)

    if (selectedRows.length === 0) {
      toast.error("Please select row....", { autoClose: 3000 })
    } else {
      try {
        // const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`;
        const timestamp = Math.round(new Date().getTime() / 1000);
        const signature = CryptoJS.SHA1(`public_id=${cloudPublicId}&timestamp=${timestamp}${this.apiSecret}`).toString(CryptoJS.enc.Hex);
        const cloudinaryUrl = selectedRows.map(item => item.imageId === "" ? vidDelUrl : imgDelUrl)
        const response = await axios.delete(cloudinaryUrl, {
          params: {
            public_id: cloudPublicId,
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

      for (let i = 0; i < selectedRows.length; i++) {
        const ids = selectedRows[i].id
        console.log("selected id for delete", ids)
        axios.delete(`/seller/deleteBanner/${ids}`, {
          headers: {
            'Authorization': `Bearer ${this.authInfo.token}`
          }
        }).then((res) => {
          if (res.data.status === true) {
            const subPlanId = selectedRows[i].subPlanId;
            try {
              const url = `/seller/sellerReduceCount/${subPlanId}`
              const data = {
                usageCount: {
                  authorId: this.authInfo.id
                },
              }
              console.log("Count reduse...", data)
              axios.put(url, data, {
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json;charset=UTF-8',
                  'Authorization': `Bearer ${this.authInfo.token}`
                }
              }).then((response) => {
                console.log("response", response)
                toast.success("Your Subscription count is update ..", { autoClose: 3000 })
                // this.setState({ subscriptionChecked: response.data.status })
              }).catch((error) => {
                console.log("Error", error)
              })
            } catch (error) {
              console.log("error", error)
            }
          }
          this.getBanner()
          console.log('Row Data', res.data)
        })
          .catch((error) => {
            console.log("error", error)
          })
      }
      // window.location.reload(); 
      this.setState({ loading: true })
    }
  }

  handleEdit = (id) => {
    this.props.history.push(`/seller/banner-edit/${id}`);
  }

  onWebsiteMove = (url) => {
    window.open(url, '_blank');
  };

  shareDropdown = (row) => {
    this.setState({ shareAdvertise: row.slug })
    this.setState({ isShareOpen: true });
    // this.props.history.push(`/advertisement/${row.slug}`);
  };

  handleFacebookShare = () => {
    const { shareAdvertise } = this.state;
    const url = `https://pay.earth/advertisement/${shareAdvertise}`
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookShareUrl, '_blank');
  };

  handleTwitterShare = () => {
    const { shareAdvertise } = this.state;
    const url = `https://pay.earth/advertisement/${shareAdvertise}`
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
    window.open(twitterShareUrl, '_blank');
  };

  handleInstagramShare = () => {
    const { shareAdvertise } = this.state;
    const url = `https://pay.earth/advertisement/${shareAdvertise}`
    const instagramShareUrl = `https://www.instagram.com/?url=${url}`
    window.open(instagramShareUrl, '_blank');
  };

  handleWhatsappShareUrl = () => {
    const { shareAdvertise } = this.state;
    const caption = encodeURIComponent(`https://pay.earth/advertisement/${shareAdvertise}`);
    const whatsappShareUrl = `https://api.whatsapp.com/send?text=${caption}`;
    window.open(whatsappShareUrl, '_blank');
  }


  banner_column = [
    {
      name: " Advertisement Image/Video",
      selector: (row, i) => row.video === '' ? <img className='advBanner-Thumb' src={row.image} alt="No Image/video select" style={{ width: '350px', height: '100px' }} /> : <video width="350" height="100" src={row.video} autoPlay loop alt="No Image/video select" />,
      sortable: true,
      width: "350px"
    },
    {
      name: "Advertisement Name",
      selector: (row, i) => row.bannerName,
      sortable: true,
    },
    {
      name: "Advertisement Text",
      selector: (row, i) => row.bannerText,
      sortable: true,

    },
    {
      name: "Category",
      selector: (row, i) => row.category,
      sortable: true,
    },
    {
      name: "Status",
      // selector: (row, i) => row.status,
      selector: (row, i) => row.status === "Unpublish" ? <p className='p-1 fw-bold text-white bg-danger bg-opacity-4 border-info rounded'>{row.status}</p> : <p className='p-1 fw-bold text-white bg-success  bg-opacity-4 border-info rounded'>{row.status}</p>,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <>
          <button
            type='submit'
            className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
            onClick={() => this.shareDropdown(row)}
            disabled={row.status === "Unpublish" ? true : false}
          >
            Share
          </button>
          <button
            type='submit'
            className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
            onClick={() => this.handlePreview(row)}
          >
            Preview
          </button>
          <button
            onClick={() => this.handleEdit(row.id)}
            className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
          >
            Edit
          </button>
          <button
            className="custom_btn btn_yellow_bordered w-auto btn btn-width action_btn_new"
            onClick={() => this.handleDeleteSeletedData(row._id)}
          >
            Delete
          </button>
        </>
      ),
    },
  ]

  handleIframeClick = () => {
    // alert("handle selected")
    window.open(this.state.selectedRowData.siteUrl)
  }


  render() {
    const { banner, selectedRows, loading } = this.state;


    if (loading) {
      return <SpinnerLoader />
    }

    return (
      <React.Fragment>
        {loading === true ? <SpinnerLoader /> : ""}
        <Header />
        <div className="inr_top_page_title">
          <h2>Manage Advertisement</h2>
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
                    <div className="">
                      <span>
                        <Link className="btn custom_btn btn_yellow mx-auto" to="/seller/manage-banner-advertisement">Create New Advertisement</Link>
                      </span>
                    </div>
                  </div>
                  <div className="cart_list adv_banner_panel">
                    <div className="tab-pane fade show active" id="nav-draft-post" role="tabpanel" aria-labelledby="nav-draft-post-tab">
                      <div className="DT_ext_row">
                        <DataTableExtensions
                          columns={this.banner_column}
                          data={banner}
                        >
                          <DataTable
                            pagination
                            highlightOnHover
                            noHeader
                            defaultSortField="id"
                            defaultSortAsc={false}
                            selectableRows
                            selectedRows={selectedRows}
                            onSelectedRowsChange={this.handleRowSelected}
                          />
                        </DataTableExtensions>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <Footer />

        <Modal
          show={this.state.showModal}
          onHide={() => this.setState({ showModal: false })}
          dialogClassName="modal-fullscreen"
          aria-labelledby="example-custom-modal-styling-title"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Preview
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>

            {this.state.selectedRowData && (
              <div className='iframe-container'>
                <div className='iFrame-wrapper'>
                  <Iframe
                    src={!this.state.selectedRowData.image ? this.state.selectedRowData.video : this.state.selectedRowData.image}
                    allow="autoplay; encrypted-media"
                    scrolling="no"
                    onInferredClick={() => this.onWebsiteMove(this.state.selectedRowData.siteUrl)}
                  >
                  </Iframe>
                </div>
              </div>
            )}
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.isShareOpen}
          onHide={() => this.setState({ isShareOpen: false })}
          size="md"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Share
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="share alert text-center" role="alert">
              <div className="social_links">
                <Link to="#" target="_blank" onClick={this.handleWhatsappShareUrl}><img src={whatsapp} alt="linked-in" /></Link>
                <Link to="#" target="_blank" onClick={this.handleInstagramShare}><img src={instagram} alt="twitter" /></Link>
                <Link to="#" target="_blank" onClick={this.handleTwitterShare}><img src={twitterIcon} alt="twitter" /></Link>
                <Link to="#" target="_blank" onClick={this.handleFacebookShare}><img src={facebook} alt="facebook" /></Link>
              </div>
            </div>
          </Modal.Body>

        </Modal>

      </React.Fragment>
    );
  }
}

export default SellerBannerList;