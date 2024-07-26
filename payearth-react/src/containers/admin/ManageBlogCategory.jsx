import React, { Component } from 'react';
import Footer from '../../components/common/Footer';
import SpinnerLoader from '../../components/common/SpinnerLoader';
import ReactQuill from 'react-quill';
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import { Helmet } from 'react-helmet';


class ManageBlogCategory extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }


    render() {
        const { loading } = this.state;


        return (
            <React.Fragment>
                {loading === true ? <SpinnerLoader /> : ''}
                <div className="container">
                    <Helmet>
                        <title>{"Category - Pay Earth"}</title>
                    </Helmet>
                    <div className="row">
                        <div className="col-lg-4">
                            <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
                                <div className="cp_top">
                                    <div className="cumm_title">
                                        ADD NEW BLOG CATEGORY
                                    </div>
                                </div>
                                <div className="cp_body">
                                    <div className="crt_bnr_fieldRow">
                                        <div className="crt_bnr_field">
                                            <label htmlFor="">Category Name</label>
                                            <div className="field_item">
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    name="name"
                                                    id=""
                                                    value={this.state.names}
                                                    onChange={this.handleTitleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="crt_bnr_fieldRow">
                                        <div className="crt_bnr_field">
                                            <label>Description</label>
                                            <div className="field_item">
                                                <ReactQuill
                                                    //style={{ height: '250px' }}
                                                    type="text"
                                                    name="description"
                                                    value={this.state.description}
                                                    onChange={this.handleDescriptionChange}
                                                    modules={{
                                                        toolbar: [
                                                            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                                            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                                            ['bold', 'italic', 'underline', 'strike'],
                                                            // ['link', 'image'],
                                                            // ['clean']
                                                        ]
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="filter_btn_box">
                                        <button
                                            className='btn custom_btn btn_yellow_bordered'
                                            onClick={this.handleSubmit}
                                        >
                                            Add
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-lg-8">
                            <div className="createpost bg-white rounded-3 mt-4 addPost_left_container">
                                <div className="cp_top">
                                    <div className="cumm_title">Blog Category List</div>
                                </div>
                                <div className="cp_body">
                                    {/* <DataTableExtensions
                                        columns={this.category_column}
                                        data={cateData}
                                    >
                                        <DataTable
                                            pagination
                                            noHeader
                                            highlightOnHover
                                            defaultSortField="id"
                                            defaultSortAsc={false}
                                            selectableRows
                                            selectedRows={selectedRows}
                                            onSelectedRowsChange={this.handleRowSelected}
                                        />
                                    </DataTableExtensions> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default ManageBlogCategory;

