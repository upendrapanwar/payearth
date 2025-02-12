// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import Header from '../../components/admin/common/Header';
// import Footer from '../../components/common/Footer';
// import DataTable from 'react-data-table-component';
// import DataTableExtensions from 'react-data-table-component-extensions';
// import SpinnerLoader from '../../components/common/SpinnerLoader';
// import 'react-data-table-component-extensions/dist/index.css';
// import { NotFound } from '../../components/common/NotFound';
// import arrow_back from '../../assets/icons/arrow-back.svg';
// import Switch from 'react-input-switch';
// import { Helmet } from 'react-helmet';
// import UserRegister from '../../containers/admin/UserRegister';

// const ManageCustomers = () => {
//   const authInfo = JSON.parse(localStorage.getItem('authInfo'));



//   const [loading, setLoading] = useState(false);
//   const [permissions, setPermissions] = useState({ add: false, edit: false, delete: false, });
//   const [customers, setCustomers] = useState([]);
//   const [tableData, setTableData] = useState({ columns: [], data: [] });
//   const [showModal, setShowModal] = useState(false);
//   const [selectedId, setSelectedId] = useState(false);

//   useEffect(() => {
//     getCustomers();
//     getcustomerPermission();
//   }, []);

//   const getCustomers = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get('admin/get-all-customers', {
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json;charset=UTF-8',
//           'Authorization': `Bearer ${authInfo.token}`,
//         },
//       });

//       console.log("checking response of customers", res);

//       if (res.data.status) {
//         setCustomers(res.data.data);

//         // Prepare table data
//         setTableData(prevState => ({
//           ...prevState,
//           data: res.data.data
//         }));
//       } else {
//         toast.error(res.data.message || 'Failed to fetch data');
//       }
//     } catch (error) {
//       console.error('Error fetching vendors:', error);
//       toast.error('Failed to fetch vendors');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getcustomerPermission = async () => {
//     const admin_Id = authInfo.id;
//     try {
//       const res = await axios.get(`admin/getcustomerPermission/${admin_Id}`, {
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json;charset=UTF-8',
//           'Authorization': `Bearer ${authInfo.token}`,
//         },
//       });

//       if (res.data.status && res.data.data) {
//         setPermissions(res.data.data);
//       }
//     } catch (error) {
//       toast.error(error.response.data.message);
//       console.error('Error fetching permissions:', error);
//     }
//   };


//   const handleStatus = async (id, isActive) => {
//     try {
//       const status = !isActive;
//       console.log('handleStatus ------', status)
//       const res = await axios.put(`admin/update-customer-status/${id}`, { isActive: status }, {
//         headers: {
//           'Accept': 'application/json',
//           'Content-Type': 'application/json;charset=UTF-8',
//           'Authorization': `Bearer ${authInfo.token}`,
//         },
//       });

//       if (res.data.status === true) {
//         setCustomers((prevCustomers) =>
//           prevCustomers.map((customer) =>
//             customer.id === id ? { ...customer, isActive: status } : customer
//           )
//         );
//       }

//     } catch (error) {
//       console.error("Error updating status:", error);
//       toast.error('Failed to update status');
//     }
//   }


//   // Define columns separately
//   const columns = [
//     {
//       name: 'Customers Name',
//       selector: row => row.name,
//       sortable: true,
//     },
//     {
//       name: 'Email',
//       selector: row => row.email,
//       sortable: true,
//     },
//     {
//       name: 'Phone',
//       selector: row => row.phone,
//       sortable: true,
//     },
//     {
//       name: 'STATUS',
//       cell: (row, i) => {
//         return <>
//           <Switch
//             on={true}
//             off={false}
//             value={row.isActive}
//             onChange={() => handleStatus(row.id, row.isActive)}
//           />
//         </>
//       },
//       sortable: true
//     },
//     {
//       name: 'Actions',
//       cell: row => (
//         <div>
//           <button className="btn custom_btn btn_yellow mx-auto ms-2" onClick={openModal(row.id)}>Edit</button>
//         </div>
//       ),
//     },
//   ];


//   const openModal = (e) => {
//     e.preventDefault();
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     getCustomers();
//   };

//   return (
//     <React.Fragment>
//       {loading && <SpinnerLoader />}
//       <div className="seller_body">
//         <Header />
//         <div className="inr_top_page_title">
//           <h2>Manage Customers</h2>
//         </div>
//         <Helmet>
//           <title>{"Manage Customers - Pay Earth"}</title>
//         </Helmet>
//         <div className="seller_dash_wrap pt-2 pb-5">
//           <div className="container">
//             <div className="bg-white rounded-3 pt-3 pb-5">
//               <div className="dash_inner_wrap">
//                 <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center">
//                   <div className="dash_title">Manage Customers</div>
//                   <span className="d-flex justify-content-between align-items-center">
//                     {/* <Link
//                       className={`btn custom_btn ${permissions.add ? 'btn_yellow' : 'btn_disabled'}`}
//                       to={permissions.add ? '/admin/user_register' : '#'}
//                     >
//                       Add Customers
//                     </Link> */}
//                     <Link
//                       className={`btn custom_btn btn_yellow`}
//                       to="#"
//                       onClick={openModal}
//                     >
//                       Add Customers
//                     </Link>
//                     {/* <Link to="#" className="view_more text-capitalize" data-bs-toggle="modal" data-bs-target="#buyerRegisterModal">Add Customers</Link> */}
//                     &nbsp;
//                     <Link className="btn custom_btn btn_yellow mx-auto" to="/admin/dashboard">
//                       <img src={arrow_back} alt="linked-in" />&nbsp;Back
//                     </Link>
//                   </span>
//                 </div>
//               </div>
//               <div className="orders_table pt-0 pb-0 p-5">
//                 {customers.length > 0 ? (
//                   <DataTableExtensions {...{ columns, data: customers }}>
//                     <DataTable
//                       columns={columns}
//                       data={customers}
//                       pagination
//                       highlightOnHover
//                     />
//                   </DataTableExtensions>
//                 ) : (
//                   <NotFound msg="Data not found." />
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </div>
//       {showModal && (
//         <UserRegister
//           onregisterHide={closeModal}
//           selectedId={selectedId}
//           extraProp="some value"
//         />
//       )}
//     </React.Fragment>
//   )
// }

// export default ManageCustomers





import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import DataTable from 'react-data-table-component';
import DataTableExtensions from 'react-data-table-component-extensions';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import 'react-data-table-component-extensions/dist/index.css';
import { NotFound } from '../../components/common/NotFound';
import arrow_back from '../../assets/icons/arrow-back.svg';
import Switch from 'react-input-switch';
import { Helmet } from 'react-helmet';
import UserRegister from '../../containers/admin/UserRegister';

const ManageCustomers = () => {
  const authInfo = JSON.parse(localStorage.getItem('authInfo'));

  const [loading, setLoading] = useState(false);
  const [permissions, setPermissions] = useState({ add: false, edit: false, delete: false });
  const [customers, setCustomers] = useState([]);
  const [tableData, setTableData] = useState({ columns: [], data: [] });
  const [showModal, setShowModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    getCustomers();
    getcustomerPermission();
  }, []);

  const getCustomers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('admin/get-all-customers', {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${authInfo.token}`,
        },
      });
      console.log("checking response of customers", res);
      if (res.data.status) {
        setCustomers(res.data.data);
        setTableData(prevState => ({
          ...prevState,
          data: res.data.data
        }));
      } else {
        toast.error(res.data.message || 'Failed to fetch data');
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to fetch vendors');
    } finally {
      setLoading(false);
    }
  };

  const getcustomerPermission = async () => {
    const admin_Id = authInfo.id;
    try {
      const res = await axios.get(`admin/getcustomerPermission/${admin_Id}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${authInfo.token}`,
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

  const handleStatus = async (id, isActive) => {
    try {
      const status = !isActive;
      console.log('handleStatus ------', status)
      const res = await axios.put(`admin/update-customer-status/${id}`, { isActive: status }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${authInfo.token}`,
        },
      });
      if (res.data.status === true) {
        setCustomers(prevCustomers =>
          prevCustomers.map(customer =>
            customer.id === id ? { ...customer, isActive: status } : customer
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error('Failed to update status');
    }
  };

  // Updated openModal function to accept an id parameter
  const openModal = (id) => {
    setSelectedId(id);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    getCustomers(); // Refresh the customer list after closing the modal
    setSelectedId(null)
  };

  // Define columns, wrapping the openModal call in an arrow function
  const columns = [
    {
      name: 'Customers Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'Email',
      selector: row => row.email,
      sortable: true,
    },
    {
      name: 'Phone',
      selector: row => row.phone,
      sortable: true,
    },
    {
      name: 'STATUS',
      cell: row => (
        <Switch
          on={true}
          off={false}
          value={row.isActive}
          onChange={() => handleStatus(row.id, row.isActive)}
        />
      ),
      sortable: true
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <button
            className="btn custom_btn btn_yellow mx-auto ms-2"
            onClick={() => openModal(row.id)}
          >
            Edit
          </button>
          {/* <button className="btn custom_btn btn_yellow mx-auto ms-2">Delete</button> */}
        </div>
      ),
    },
  ];

  return (
    <React.Fragment>
      {loading && <SpinnerLoader />}
      <div className="seller_body">
        <Header />
        <div className="inr_top_page_title">
          <h2>Manage Customers</h2>
        </div>
        <Helmet>
          <title>Manage Customers - Pay Earth</title>
        </Helmet>
        <div className="seller_dash_wrap pt-2 pb-5">
          <div className="container">
            <div className="bg-white rounded-3 pt-3 pb-5">
              <div className="dash_inner_wrap">
                <div className="col-md-12 pt-2 pb-3 d-flex justify-content-between align-items-center">
                  <div className="dash_title">Manage Customers</div>
                  <span className="d-flex justify-content-between align-items-center">
                    <Link
                      className={`btn custom_btn btn_yellow`}
                      to="#"
                      onClick={(e) => { e.preventDefault(); setShowModal(true); }}
                    >
                      Add Customers
                    </Link>
                    &nbsp;
                    <Link className="btn custom_btn btn_yellow mx-auto" to="/admin/dashboard">
                      <img src={arrow_back} alt="linked-in" />&nbsp;Back
                    </Link>
                  </span>
                </div>
              </div>
              <div className="orders_table pt-0 pb-0 p-5">
                {customers.length > 0 ? (
                  <DataTableExtensions {...{ columns, data: customers }}>
                    <DataTable
                      columns={columns}
                      data={customers}
                      pagination
                      highlightOnHover
                    />
                  </DataTableExtensions>
                ) : (
                  <NotFound msg="Data not found." />
                )}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {showModal && (
        <UserRegister
          onregisterHide={closeModal}
          selectedId={selectedId}
          extraProp="some value"
        />
      )}
    </React.Fragment>
  );
};

export default ManageCustomers;

