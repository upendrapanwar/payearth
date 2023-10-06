import React, { Fragment } from 'react';
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min';
import '../../../../node_modules/font-awesome/css/font-awesome.css';
import '../../../assets/css/style.css';
import buyerLogin from './../../../assets/images/buyer-login.jpg';

function PeModal(props) {
    return(
        <Fragment>
        <div className="modal-backdrop fade show"></div>
        <div className="modal fade show d-block"  id="buyerLoginModal" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="form_wrapper">
                        {props.children}
                    </div>
                    <div className="img_wrapper">
                        <button type="button" className="btn-close mo_btn" data-bs-dismiss="modal" aria-label="Close" onClick={props.onClose}></button>
                        <img src={buyerLogin} alt="buyer-login" className="h-100" />
                    </div>
                </div>
            </div>
        </div>
        </Fragment>
    )
}

export default PeModal;