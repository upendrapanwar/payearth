import React from 'react';
import axios from 'axios';
import { Formik, Form, Field } from 'formik';
import DataTableExtensions from 'react-data-table-component-extensions';
import DataTable from 'react-data-table-component';
import 'react-data-table-component-extensions/dist/index.css';
import Header from '../../components/admin/common/Header';
import Footer from '../../components/common/Footer';
import { useLocation } from "react-router-dom";
import { toast } from 'react-toastify';


const AccessControl = () => {
    const location = useLocation();
    const { id } = location.state || {};
    const authInfo = JSON.parse(localStorage.getItem("authInfo"))

    console.log('Received ID:', id);



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

    const columns = [
        {
            name: 'Component',
            selector: row => row.component,
            sortable: true,
        },
        {
            name: 'Add',
            cell: row => (
                <Field
                    type="checkbox"
                    name={`permissions.${row.component}.add`}
                    checked={row.add}
                />
            ),
        },
        {
            name: 'Delete',
            cell: row => (
                <Field
                    type="checkbox"
                    name={`permissions.${row.component}.delete`}
                    checked={row.delete}
                />
            ),
        },
        {
            name: 'Edit',
            cell: row => (
                <Field
                    type="checkbox"
                    name={`permissions.${row.component}.edit`}
                    checked={row.edit}
                />
            ),
        },
    ];


    const handleSubmit = async (values) => {
        try {
            const res = await axios.post(`admin/permission/${id}`, values, {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json;charset=UTF-8',
                    'Authorization': `Bearer ${authInfo.token}`
                }
            })

            if(res.data.status === true){
                console.log("testing res", res);
            }

        } catch (error) {
            toast.error("Data has not saved.", error);
            console.error("Data has not saved.", error)
        }
    }

    return (
        <React.Fragment>
            <Header />
            <div className="container">
                <div className="bg-white rounded-3 pt-3 pb-5 mt-4">
                    <div className="dash_inner_wrap">
                        <div className="col-lg-12">
                            <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
                                <div className="cp_top d-flex justify-content-between align-items-center">
                                    <div className="cumm_title">Access Permission</div>
                                </div>

                                <Formik
                                    initialValues={{
                                        permissions: initialData.reduce((acc, item) => {
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
                                            <DataTableExtensions
                                                columns={columns}
                                                data={initialData.map(item => ({
                                                    ...item,
                                                    add: values.permissions[item.component]?.add || false,
                                                    edit: values.permissions[item.component]?.edit || false,
                                                    delete: values.permissions[item.component]?.delete || false,
                                                }))}
                                            >
                                                <DataTable
                                                    columns={columns}
                                                    data={initialData}
                                                    pagination={false}
                                                    filter={false}
                                                    highlightOnHover
                                                />
                                            </DataTableExtensions>

                                            <div className="mb-4 d-flex justify-content-center my-3">
                                                <button type="submit" className="btn custom_btn btn_yellow">
                                                    Add
                                                </button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </React.Fragment>
    );
};

export default AccessControl;
