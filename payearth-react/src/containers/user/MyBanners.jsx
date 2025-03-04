import React, { Component } from 'react';
import Header from "./../../components/user/common/Header";
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
import noImg from './../../assets/images/noimage.png'
import ModalBody from 'react-bootstrap/esm/ModalBody';


class MyBanner extends Component {

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

    };
  }

  componentDidMount() {
    this.getBanner();
  }

  handleClose = () => {
    this.setState({ selectedRowData: false });
  };


  handlePreview = (row) => {
    console.log("id", row)
    this.setState({ selectedRowData: row });
    this.setState({ showModal: true });
  };

  getBanner = () => {
    let userId = this.authInfo.id
    console.log("userId", userId)
    axios.get(`/user/getBannersByUserId/${userId}`, {
      headers: {
        'Authorization': `Bearer ${this.authInfo.token}`
      },
    })
      .then(res => {
        this.setState({
          banner: res.data.data,
          loading: false,
          error: null
        })
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
    console.log("stelectedROW", state.selectedRows)
    this.setState({ selectedRows: state.selectedRows });
  };

  // createSignature = () => {
  //   const { selectedRows } = this.state
  //   const cloudPublicId = selectedRows.map(item => item.imageId === "" ? item.videoId : item.imageId);
  //   console.log("cloudPublicId", cloudPublicId)

  //   const timestamp = Math.round(new Date().getTime() / 1000);
  //   const signature = CryptoJS.SHA1(`public_id=${cloudPublicId}&timestamp=${timestamp}${this.apiSecret}`).toString(CryptoJS.enc.Hex);

  //   return { timestamp, signature };
  // };

  // handleDeleteCloud = async () => {
  //   this.setState({ image: "" })
  //   const { cloudImageId } = this.state
  //   const { timestamp, signature } = this.createSignature();

  //   try {
  //       const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/destroy`;
  //       const response = await axios.delete(cloudinaryUrl, {
  //           params: {
  //               public_id: cloudImageId,
  //               api_key: this.apiKey,
  //               signature: signature,
  //               timestamp: timestamp,
  //           },
  //       });
  //       if (response.status === 200) {
  //           console.log('Image deleted successfully');
  //       } else {
  //           console.error('Failed to delete image');
  //       }
  //   } catch (error) {
  //       console.error('Error deleting image', error);
  //   }
  // }


  // ********************************************************

  handleDeleteSeletedData = async (id) => {
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
        axios.delete(`/user/deleteBanner/${ids}`, {
          headers: {
            'Authorization': `Bearer ${this.authInfo.token}`
          }
        }).then((res) => {
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
    this.props.history.push(`/user/edit-Advertisement/${id}`);
  }


  banner_column = [
    {
      name: " Banner Image/Video",
      selector: (row, i) => row.video === '' ? <img className='advBanner-Thumb' src={row.image} alt="No Image/video select" style={{ width: '150px', height: '120px' }} /> : <video width="150" height="120" src={row.video} autoPlay loop alt="No Image/video select" />,
      sortable: true,
    },
    {
      name: "Banner Name",
      selector: (row, i) => row.bannerName,
      sortable: true,
    },
    {
      name: "Banner Text",
      selector: (row, i) => row.bannerText,
      sortable: true,

    },
    {
      name: "Category",
      selector: (row, i) => row.category,
      sortable: true,
    },
    // {
    //   name: 'Subscription Plan',
    //   selector: (row, i) => row.subscriptionPlan,
    //   sortable: true,
    //   // cell: row => {
    //   //     const date = new Date(row.createdAt).toLocaleString();
    //   //     return <div>{date}</div>;
    //   // },
    // },
    // {
    //   name: "Banner Placement",
    //   selector: (row, i) => row.bannerPlacement,
    //   sortable: true,

    // },
    {
      name: "Status",
      selector: (row, i) => row.status,
      sortable: true,

    },
    {
      name: 'Actions',
      cell: (row) => (
        <>
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

    const { banner, selectedRows } = this.state

    console.log("selected Row status", selectedRows)

    console.log("banner Data", banner)

    return (
      <React.Fragment>
        <Header />
        <div className="inr_top_page_title">
          <h2>My Banner</h2>
        </div>
        <section className="inr_wrap">
          <div className="container">
            <div className="row">
              <div className="col-md-12">
                <div className="cart adv_banner_wrapper">
                  <div className="noti_wrap">
                    <div className="">
                      <span>
                        <Link className="btn custom_btn btn_yellow mx-auto" to="/create-banner">Banner Manager</Link>
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
          // dialogClassName="modal-90w"
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
              <div
                className="banner-container"
              >
                <p>{this.state.selectedRowData.siteUrl}</p>
                {/* <a href={this.state.selectedRowData.siteUrl} target="_blank" rel="noopener noreferrer">

                  <img
                    src={this.state.selectedRowData.image}
                    alt="Banner"
                    className="banner-image"
                    // onClick={this.handleIframeClick}
                  />
                </a>  */}

                <a
                  href={this.state.selectedRowData.siteUrl}
                  target="_blank">
                  <iframe
                    src={!this.state.selectedRowData.image ? this.state.selectedRowData.video : this.state.selectedRowData.image}
                    width='1100'
                    height="315"
                    // frameborder="0"
                    allow="autoplay; encrypted-media"
                  // allowfullscreen
                  // onClick={this.handleIframeClick}
                  ></iframe>
                </a>

                <button
                  className="close-button"
                  onClick={this.handleClose}
                >
                  Close
                </button>
              </div>
            )}
          </Modal.Body>
        </Modal>

      </React.Fragment>
    );
  }
}

export default MyBanner;