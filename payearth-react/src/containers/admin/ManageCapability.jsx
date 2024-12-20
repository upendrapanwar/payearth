import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import DataTable from "react-data-table-component";
import Header from "../../components/admin/common/Header";
import Footer from "../../components/common/Footer";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ManageCapability = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const authInfo = JSON.parse(localStorage.getItem("authInfo"));
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch permissions on component mount
  useEffect(() => {
    getAllPermissions();
  }, []);

  const getAllPermissions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`admin/getAllpermission/${id}`, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${authInfo.token}`,
        },
      });

      if (res.data.status) {
        const backendPermissions = res.data.data;

        // Map backend data to UI-friendly format
        const updatedPermissions = initialData.map((item) => {
          const formattedComponent = item.component
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());

          const apiPermission = backendPermissions[formattedComponent];
          return {
            ...item,
            add: apiPermission?.add || false,
            edit: apiPermission?.edit || false,
            delete: apiPermission?.delete || false,
          };
        });

        setPermissions(updatedPermissions);
      }
    } catch (error) {
      toast.error("Failed to fetch permissions.");
      console.error("Error fetching permissions", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    const formattedPermissions = Object.entries(values.permissions).reduce(
      (acc, [key, value]) => {
        const backendKey = key.toLowerCase().replace(/ /g, "_");
        acc[backendKey] = value;
        return acc;
      },
      {}
    );

    try {
      const res = await axios.put(`admin/updatePermission/${id}`, formattedPermissions, {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json;charset=UTF-8",
          Authorization: `Bearer ${authInfo.token}`,
        },
      });

      if (res.data.status) {
        toast.success("Permissions updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update permissions.");
      console.error("Error saving permissions", error);
    }
  };

  const columns = [
    {
      name: "Component",
      selector: (row) => row.component.replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase()),
      sortable: true,
    },
    ...["Add", "Edit", "Delete"].map((action) => ({
      name: action,
      cell: (row) => (
        <Field
          type="checkbox"
          name={`permissions.${row.component}.${action.toLowerCase()}`}
          checked={row[action.toLowerCase()] || false}
          onChange={(e) => {
            row[action.toLowerCase()] = e.target.checked;
          }}
        />
      ),
    })),
  ];

  const initialData = [
    { component: 'dashboard', add: false, edit: false, delete: false },
    { component: 'post', add: false, edit: false, delete: false },
    { component: 'create_post', add: false, edit: false, delete: false },
    { component: 'manage_orders', add: false, edit: false, delete: false },
    { component: 'manage_services_orders', add: false, edit: false, delete: false },
    { component: 'products_categories', add: false, edit: false, delete: false },
    { component: 'products_sub_categories', add: false, edit: false, delete: false },
    { component: 'services_categories', add: false, edit: false, delete: false },
    { component: 'blogs_categories', add: false, edit: false, delete: false },
    { component: 'manage_service', add: false, edit: false, delete: false },
    { component: 'manage_discount', add: false, edit: false, delete: false },
    { component: 'manage_brand', add: false, edit: false, delete: false },
    { component: 'manage_customers', add: false, edit: false, delete: false },
    { component: 'manage_vendors', add: false, edit: false, delete: false },
    { component: 'manage_advertisement', add: false, edit: false, delete: false },
    { component: 'manage_subcription', add: false, edit: false, delete: false },
  ];

  return (
    <>
      <Header />
      <div className="container">
        <div className="bg-white rounded-3 pt-3 pb-5 mt-4">
          <div className="dash_inner_wrap">
            <div className="col-lg-12">
              <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
                <div className="cp_top d-flex justify-content-between align-items-center">
                  <div className="cumm_title">Update Capability</div>
                </div>

                {loading ? (
                  <p>Loading...</p>
                ) : (
                  <Formik
                    enableReinitialize
                    initialValues={{
                      permissions: permissions.reduce((acc, item) => {
                        acc[item.component] = {
                          add: item.add,
                          edit: item.edit,
                          delete: item.delete,
                        };
                        return acc;
                      }, {}),
                    }}
                    onSubmit={handleSubmit}
                  >
                    {({ values }) => (
                      <Form>
                        <DataTable
                          columns={columns}
                          data={permissions.map((item) => ({
                            ...item,
                            ...values.permissions[item.component],
                          }))}
                          pagination
                          highlightOnHover
                        />
                        <div className="d-flex justify-content-center my-3">
                          <button type="submit" className="btn custom_btn btn_yellow">
                            Save
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ManageCapability;




//******************************Checked & unchecked functionality Code************************ */
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { Formik, Form, Field } from 'formik';
// import DataTableExtensions from 'react-data-table-component-extensions';
// import DataTable from 'react-data-table-component';
// import 'react-data-table-component-extensions/dist/index.css';
// import Header from '../../components/admin/common/Header';
// import Footer from '../../components/common/Footer';
// import { useLocation } from "react-router-dom";
// import { toast } from 'react-toastify';

// const ManageCapability = () => {
//     const location = useLocation();
//     const { id } = location.state || {};
//     const authInfo = JSON.parse(localStorage.getItem("authInfo"));
//     console.log("Checkibng Id",id);

//     const [permissions, setPermissions] = useState([]);

//     useEffect(() => {
//         getAllPermissions();
//     }, []);

//     const getAllPermissions = async () => {
//         const admin_Id = id;
//         let updatedPermissions = [];
//         try {
//             const res = await axios.get(`admin/getAllpermission/${admin_Id}`, {
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json;charset=UTF-8',
//                     'Authorization': `Bearer ${authInfo.token}`,
//                 },
//             });

//             if (res.data.status === true) {
//                 updatedPermissions = initialData.map(item => {
//                     const apiPermission = res.data.data[item.component];
//                     return {
//                         ...item,
//                         add: apiPermission?.add || false,
//                         edit: apiPermission?.edit || false,
//                         delete: apiPermission?.delete || false,
//                     };
//                 });
//             }

//             console.log("updatedPermissions", updatedPermissions);
//             setPermissions(updatedPermissions);
//         } catch (error) {
//             toast.error("Data has not fetched.");
//             console.error("Error fetching permissions", error);
//         }
//     };

//     const initialData = [
//         { component: 'Dashboard', add: false, edit: false, delete: false },
//         { component: 'Post', add: false, edit: false, delete: false },
//         { component: 'Create Post', add: false, edit: false, delete: false },
//         { component: 'Manage Orders', add: false, edit: false, delete: false },
//         { component: 'Manage Services Orders', add: false, edit: false, delete: false },
//         { component: 'Products Categories', add: false, edit: false, delete: false },
//         { component: 'Products Sub Categories', add: false, edit: false, delete: false },
//         { component: 'Services Categories', add: false, edit: false, delete: false },
//         { component: 'Blogs Categories', add: false, edit: false, delete: false },
//         { component: 'Manage Service', add: false, edit: false, delete: false },
//         { component: 'Manage Discount', add: false, edit: false, delete: false },
//         { component: 'Manage Brand', add: false, edit: false, delete: false },
//         { component: 'Manage Customers', add: false, edit: false, delete: false },
//         { component: 'Manage Vendors', add: false, edit: false, delete: false },
//         { component: 'Manage Advertisement', add: false, edit: false, delete: false },
//         { component: 'Manage Subcription', add: false, edit: false, delete: false },
//     ];

//     const columns = [
//         {
//             name: 'Component',
//             selector: row => row.component,
//             sortable: true,
//         },
//         {
//             name: 'Add',
//             cell: (row, { setFieldValue }) => (
//                 <Field
//                     type="checkbox"
//                     name={`permissions.${row.component}.add`}
//                     checked={row.add}
//                     onChange={() => {
//                         setFieldValue(`permissions.${row.component}.add`, !row.add);
//                     }}
//                 />
//             ),
//         },
//         {
//             name: 'Delete',
//             cell: (row, { setFieldValue }) => (
//                 <Field
//                     type="checkbox"
//                     name={`permissions.${row.component}.delete`}
//                     checked={row.delete}
//                     onChange={() => {
//                         setFieldValue(`permissions.${row.component}.delete`, !row.delete);
//                     }}
//                 />
//             ),
//         },
//         {
//             name: 'Edit',
//             cell: (row, { setFieldValue }) => (
//                 <Field
//                     type="checkbox"
//                     name={`permissions.${row.component}.edit`}
//                     checked={row.edit}
//                     onChange={() => {
//                         setFieldValue(`permissions.${row.component}.edit`, !row.edit);
//                     }}
//                 />
//             ),
//         },
//     ];

//     const handleSubmit = async (values) => {
//         console.log("Testing handle submit values", values);
//         const admin_Id = id;
//         console.log("Testingadmin_Id", admin_Id);

//         try {
//             const res = await axios.put(`admin/updatePermission/${admin_Id}`,values.permissions, {
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json;charset=UTF-8',
//                     'Authorization': `Bearer ${authInfo.token}`,
//                 },
//             });

//             if (res.data.status === true) {
//                 toast.success("Permissions updated successfully!");
//             }
//         } catch (error) {
//             toast.error("Data has not saved.");
//             console.error("Error saving permissions", error);
//         }
//     };

//     return (
//         <>
//             <Header />
//             <div className="container">
//                 <div className="bg-white rounded-3 pt-3 pb-5 mt-4">
//                     <div className="dash_inner_wrap">
//                         <div className="col-lg-12">
//                             <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
//                                 <div className="cp_top d-flex justify-content-between align-items-center">
//                                     <div className="cumm_title">Update Capability</div>
//                                 </div>

//                                 <Formik
//                                     enableReinitialize
//                                     initialValues={{
//                                         permissions: permissions.reduce((acc, item) => {
//                                             acc[item.component] = {
//                                                 add: item.add,
//                                                 edit: item.edit,
//                                                 delete: item.delete,
//                                             };
//                                             return acc;
//                                         }, {}),
//                                     }}
//                                     onSubmit={handleSubmit}
//                                 >
//                                     {({ values, setFieldValue }) => (
//                                         <Form>
//                                             <DataTableExtensions
//                                                 columns={columns.map(col => {
//                                                     if (col.name === 'Add' || col.name === 'Delete' || col.name === 'Edit') {
//                                                         return {
//                                                             ...col,
//                                                             cell: row => (
//                                                                 <Field
//                                                                     type="checkbox"
//                                                                     name={`permissions.${row.component}.${col.name.toLowerCase()}`}
//                                                                     checked={values.permissions[row.component]?.[col.name.toLowerCase()] || false}
//                                                                     onChange={() => {
//                                                                         setFieldValue(
//                                                                             `permissions.${row.component}.${col.name.toLowerCase()}`,
//                                                                             !values.permissions[row.component]?.[col.name.toLowerCase()]
//                                                                         );
//                                                                     }}
//                                                                 />
//                                                             ),
//                                                         };
//                                                     }
//                                                     return col;
//                                                 })}
//                                                 data={permissions.map(item => ({
//                                                     ...item,
//                                                     add: values.permissions[item.component]?.add || false,
//                                                     edit: values.permissions[item.component]?.edit || false,
//                                                     delete: values.permissions[item.component]?.delete || false,
//                                                 }))}
//                                                 filter={false}
//                                             >
//                                                 <DataTable
//                                                     columns={columns}
//                                                     data={permissions}
//                                                     pagination={false}
//                                                     filter={false}
//                                                     highlightOnHover
//                                                 />
//                                             </DataTableExtensions>

//                                             <div className="mb-4 d-flex justify-content-center my-3">
//                                                 <button type="submit" className="btn custom_btn btn_yellow">
//                                                     Save
//                                                 </button>
//                                             </div>
//                                         </Form>
//                                     )}
//                                 </Formik>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//         </>
//     );
// };

// export default ManageCapability;




// *******************Original Code*******************

// import React, {useEffect, useState} from 'react';
// import axios from 'axios';
// import { Formik, Form, Field } from 'formik';
// import DataTableExtensions from 'react-data-table-component-extensions';
// import DataTable from 'react-data-table-component';
// import 'react-data-table-component-extensions/dist/index.css';
// import Header from '../../components/admin/common/Header';
// import Footer from '../../components/common/Footer';
// import { useLocation } from "react-router-dom";
// import { toast } from 'react-toastify';


// const ManageCapability = () => {

//     const location = useLocation();
//     const { id } = location.state || {};
//     const authInfo = JSON.parse(localStorage.getItem("authInfo"));

//     const [permissions, setPermissions] = useState([]);

//     useEffect(() => {
//         getAllPermissions();
//     }, [])

//     const getAllPermissions = async () => {
//         const admin_Id = id
//         try{
//             const res = await axios.get(`admin/getAllpermission/${admin_Id}`, {
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json;charset=UTF-8',
//                     'Authorization': `Bearer ${authInfo.token}`
//                 }
//             })
//             console.log("Testing response get all permission", res);
//             if(res.data.status === true){
//                 setPermissions(res.data.data)
//             }
//         }catch(error){
//             toast.error("Data has not fetched.", error);
//             console.error("Data has not fetched.", error);
//         }
//     }


//     const initialData = [
//         { component: 'dashboard', add: false, edit: false, delete: false },
//         { component: 'post', add: false, edit: false, delete: false },
//         { component: 'create_post', add: false, edit: false, delete: false },
//         { component: 'manage_orders', add: false, edit: false, delete: false },
//         { component: 'manage_services_orders', add: false, edit: false, delete: false },
//         { component: 'products_categories', add: false, edit: false, delete: false },
//         { component: 'products_sub_categories', add: false, edit: false, delete: false },
//         { component: 'services_categories', add: false, edit: false, delete: false },
//         { component: 'blogs_categories', add: false, edit: false, delete: false },
//         { component: 'manage_service', add: false, edit: false, delete: false },
//         { component: 'manage_discount', add: false, edit: false, delete: false },
//         { component: 'manage_brand', add: false, edit: false, delete: false },
//         { component: 'manage_customers', add: false, edit: false, delete: false },
//         { component: 'manage_vendors', add: false, edit: false, delete: false },
//         { component: 'manage_advertisement', add: false, edit: false, delete: false },
//         { component: 'manage_subcription', add: false, edit: false, delete: false },

//     ];

//     const columns = [
//         {
//             name: 'Component',
//             selector: row => row.component,
//             sortable: true,
//         },
//         {
//             name: 'Add',
//             cell: row => (
//                 <Field
//                     type="checkbox"
//                     name={`permissions.${row.component}.add`}
//                     checked={row.add}
//                 />
//             ),
//         },
//         {
//             name: 'Delete',
//             cell: row => (
//                 <Field
//                     type="checkbox"
//                     name={`permissions.${row.component}.delete`}
//                     checked={row.delete}
//                 />
//             ),
//         },
//         {
//             name: 'Edit',
//             cell: row => (
//                 <Field
//                     type="checkbox"
//                     name={`permissions.${row.component}.edit`}
//                     checked={row.edit}
//                 />
//             ),
//         },
//     ];


//     const handleSubmit = async (values) => {
//         try {
//             const res = await axios.post(`admin/permission/${id}`, values, {
//                 headers: {
//                     'Accept': 'application/json',
//                     'Content-Type': 'application/json;charset=UTF-8',
//                     'Authorization': `Bearer ${authInfo.token}`
//                 }
//             })

//             if(res.data.status === true){
//                 console.log("testing res", res);
//             }

//         } catch (error) {
//             toast.error("Data has not saved.", error);
//             console.error("Data has not saved.", error)
//         }
//     }


//   return (
//     <>
//     <Header />
//             <div className="container">
//                 <div className="bg-white rounded-3 pt-3 pb-5 mt-4">
//                     <div className="dash_inner_wrap">
//                         <div className="col-lg-12">
//                             <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
//                                 <div className="cp_top d-flex justify-content-between align-items-center">
//                                     <div className="cumm_title">Update Capability</div>
//                                 </div>

//                                 <Formik
//                                     initialValues={{
//                                         permissions: initialData.reduce((acc, item) => {
//                                             acc[item.component] = {
//                                                 add: item.add,
//                                                 edit: item.edit,
//                                                 delete: item.delete,
//                                             };
//                                             return acc;
//                                         }, {}),
//                                     }}
//                                     onSubmit={handleSubmit}
//                                 >
//                                     {({ values }) => (
//                                         <Form>
//                                             <DataTableExtensions
//                                                 columns={columns}
//                                                 data={initialData.map(item => ({
//                                                     ...item,
//                                                     add: values.permissions[item.component]?.add || false,
//                                                     edit: values.permissions[item.component]?.edit || false,
//                                                     delete: values.permissions[item.component]?.delete || false,
//                                                 }))}
//                                                 filter={false}
//                                             >
//                                                 <DataTable
//                                                     columns={columns}
//                                                     data={initialData}
//                                                     pagination={false}
//                                                     filter={false}
//                                                     highlightOnHover
//                                                 />
//                                             </DataTableExtensions>

//                                             <div className="mb-4 d-flex justify-content-center my-3">
//                                                 <button type="submit" className="btn custom_btn btn_yellow">
//                                                     Add
//                                                 </button>
//                                             </div>
//                                         </Form>
//                                     )}
//                                 </Formik>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//             <Footer />
//     </>
//   )
// }

// export default ManageCapability