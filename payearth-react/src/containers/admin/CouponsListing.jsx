import React, { useState, useEffect } from 'react';
import { useHistory, Link} from 'react-router-dom';
import Footer from '../../components/common/Footer';
import Header from '../../components/admin/common/Header';
import { toast } from 'react-toastify';
import { useDispatch, connect } from 'react-redux';
import store from '../../store/index';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import Select from 'react-select';
import { NotFound } from '../../components/common/NotFound';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import { setLoading } from '../../store/reducers/global-reducer';
import arrow_back from '../../assets/icons/arrow-back.svg';
import Switch from 'react-input-switch';

const CouponsListing = (props) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const authInfo = store.getState().auth.authInfo;

    const [data, setData] = useState([]);
    const [expiredData, setExpiredData] = useState([]);
    const [cuponType, setCuponType] = useState('new');
    const [permissions, setPermissions] = useState({
        add: false,
        edit: false,
        delete: false,
    });
    const [loading, setLoading] = useState(false);
    const [sortingOptions] = useState([
        { label: 'New to Old', value: 'desc' },
        { label: 'Old to New', value: 'asc' },
    ]);
    const [selectedSortingOption, setSelectedSortingOption] = useState({ label: 'New to Old', value: 'desc' });

    useEffect(() => {
        getDiscountPermission();
        getCoupons('new', 'desc');
    }, []);

    const getDiscountPermission = async () => {
        const admin_Id = authInfo.id;
        try {
            const res = await axios.get(`admin/getDiscountPermission/${admin_Id}`, {
                headers: {
                    Accept: 'application/json',
                    Authorization: `Bearer ${authInfo.token}`,
                },
            });

            if (res.data.status && res.data.data) {
                setPermissions(res.data.data);
            }
        } catch (error) {
            toast.error(error.response.data.message);
            console.error('Error fetching permissions:', error);
        }
    };

    const getCoupons = async (type, sort_val) => {
        const url = `admin/coupons/${type}`;
        setLoading(true);
        try {
            const res = await axios.post(
                url,
                { sorting: { sort_type: 'date', sort_val } },
                {
                    headers: {
                        Accept: 'application/json',
                        Authorization: `Bearer ${authInfo.token}`,
                    },
                }
            );
            if (type === 'new') {
                setData(res.data.data.coupons);
            } else {
                setExpiredData(res.data.data.coupons);
            }
        } catch (error) {
            toast.error('Failed to fetch coupons');
            console.error("Failed to fetch coupons", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatus = async (id, isActive) => {
        try {
            setLoading(true);
            const status = !isActive;
            console.log("status", status);
            const updateStatusUrl = `/admin/couponStatus/${id}`;
            const res = await axios.patch(updateStatusUrl, { isActive: status }, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            });
            if (res.status === 200) {
                setLoading(false);
                toast.success("Status updated successfully!");

                if (cuponType === 'new') {
                    setData((prevData) =>
                        prevData.map((coupon) =>
                            coupon.id === id ? { ...coupon, isActive: status } : coupon
                        )
                    );
                } else {
                    setExpiredData((prevData) =>
                        prevData.map((coupon) =>
                            coupon.id === id ? { ...coupon, isActive: status } : coupon
                        )
                    );
                }
            }
        } catch (error) {
            toast.error("Failed to update status");
            console.error("There was an error changing the status", error);
        }finally{
            setLoading(false);
        }
    }

    const handleDelete = async (id) => {
        console.log("id",id);
        try{
            const res = await axios.delete(`/admin/delete-coupon/${id}`, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            })

            if(res.data.status===true){
                console.log("res",res); 
                getCoupons(cuponType, selectedSortingOption.value);
                toast.success("Coupon deleted successfully");       
            }
        }catch(error){
            toast.error("Failed to delete coupon");
            console.error("There was an error deleting the coupon", error);
        }finally{
            setLoading(false);
        }
    }

    const handleTabChange = (type) => {
        setCuponType(type);
        getCoupons(type, selectedSortingOption.value);
    };

    const handleSortingChange = (selectedOption) => {
        setSelectedSortingOption(selectedOption);
        getCoupons(cuponType, selectedOption.value);
    };

    const handleEdit = (id) => {
        history.push({
            pathname: '/admin/edit-coupon',
            state: { id },
        });
    };

    const columns = [
        {
            name: 'Coupon Code',
            selector: (row) => row.code,
            sortable: true,
        },
        {
            name: 'Start Date',
            selector: (row) => {
                const start = new Date(row.start);
                return start.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });
            },
            sortable: true,
        },
        {
            name: 'Expiry Date',
            selector: (row) => {
                const endDate = new Date(row.end);
                return endDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                });
            },
            sortable: true,
        },
        {
            name: 'Discount Percentage',
            selector: (row) => row.discount_per,
            sortable: true,
        },
        {
            name: 'STATUS',
            cell: (row, i) => {
                return <>
                    <Switch
                        on={true}
                        off={false}
                        value={row.isActive}
                        onChange={() => handleStatus(row.id, row.isActive)}
                    />
                </>
            },
            sortable: true
        },
        {
            name: 'Manage',
            cell: (row) => (
                <div className="d-flex gap-2">
                    <button
                        className="btn custom_btn btn_yellow mx-auto"
                        onClick={() => handleEdit(row.id)}
                    >
                        Edit
                    </button>
                    <button
                        className="btn custom_btn btn_yellow mx-auto"
                        onClick={() => handleDelete(row.id)}
                    >
                        Delete
                    </button>
                </div>
            ),
        },
    ];

    const currentData = cuponType === 'new' ? data : expiredData;

    return (
        <React.Fragment>
            {loading && <SpinnerLoader />}
            <div className="seller_body">
                <Header />
                <div className="seller_dash_wrap pt-5 pb-5">
                    <div className="container">
                        <div className="bg-white rounded-3 p-3 p-5">
                            <div className="dash_inner_wrap">
                                <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center">
                                    <div className="dash_title">Coupons</div>
                                    <span className="d-flex justify-content-between align-items-center">
                                        <Link
                                            className={`btn custom_btn ${permissions.add ? 'btn_yellow' : 'btn_disabled'}`}
                                            to={permissions.add ? '/admin/add-coupon' : '#'}
                                        >
                                            Add Coupon
                                        </Link>
                                        &nbsp;
                                        <Link className="btn custom_btn btn_yellow mx-auto" to="/admin/dashboard"><img src={arrow_back} alt="linked-in" />&nbsp;Back</Link>
                                    </span>
                                </div>
                            </div>

                            <div className="orders_tabs p-3 d-flex justify-content-between align-items-center">
                                <div>
                                    <button
                                        className={`btn custom_btn ${cuponType === 'new' ? 'btn_yellow' : 'btn-light'}`}
                                        onClick={() => handleTabChange('new')}
                                    >
                                        New Coupons
                                    </button>
                                    <button
                                        className={`btn ms-2 ${cuponType === 'expired' ? 'btn_yellow' : 'btn-light'}`}
                                        onClick={() => handleTabChange('expired')}
                                    >
                                        Expired Coupons
                                    </button>
                                </div>
                                <div className="col-3">
                                    <Select
                                        options={sortingOptions}
                                        value={selectedSortingOption}
                                        onChange={handleSortingChange}
                                        className="w-100"
                                    />
                                </div>
                            </div>

                            {currentData.length > 0 ? (
                                <DataTable
                                    columns={columns}
                                    data={currentData}
                                    pagination
                                    highlightOnHover
                                />
                            ) : (
                                <NotFound msg="Data not found." />
                            )}
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </React.Fragment>
    );
};

export default connect(setLoading)(CouponsListing);
