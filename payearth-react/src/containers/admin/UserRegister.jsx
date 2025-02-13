// import React, { useEffect, Fragment, useState } from 'react';
// import ReactDom from 'react-dom';
// import { Link } from 'react-router-dom';
// import invisibleIcon from '../../assets/icons/invisible-icon.svg';
// import visibleIcon from '../../assets/icons/eye-icon.svg';
// import PeModal from '../../../src/components/common/modals/PeModal';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useFormik } from 'formik';
// import * as Yup from 'yup';

// const userRegistrationSchema = Yup.object().shape({
//     name: Yup.string().required('Name is required'),
//     email: Yup.string().email('Invalid email').required('Email is required'),
//     password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
//     terms: Yup.boolean().oneOf([true], 'You must accept the Terms and Conditions.')
// });

// const Modal = (props) => {
//     toast.configure();
//     const authInfo = JSON.parse(localStorage.getItem('authInfo'));
//     const [seePassword, setSeePassword] = useState(false);
//     const [selectedId, setSelectedId] = useState(props.selectedId);
//     const [userData, setUserData] = useState(false);
//     console.log('userData', userData)


//     useEffect(() => {
//         setSelectedId(props.selectedId);
//         getUserdata(props.selectedId)
//     }, [props.selectedId]);

//     const formik = useFormik({
//         initialValues: {
//             name: userData.name || '',
//             email: userData.email ||'',
//             password: '',
//             terms: false
//         },
//         validationSchema: userRegistrationSchema,
//         onSubmit: (values, { resetForm }) => {
//             axios.post('user/signup', values).then(response => {
//                 toast.dismiss();
//                 if (response.data.status) {
//                     toast.success(response.data.message, { autoClose: 3000 });
//                     resetForm();
//                     props.onClick();
//                     props.onShow();
//                 } else {
//                     toast.error(response.data.message, { autoClose: 3000 });
//                 }
//             }).catch(error => {
//                 toast.dismiss();
//                 if (error.response) {
//                     toast.error(error.response.data.message, { autoClose: 3000 });
//                 }
//             });
//         }
//     });

//     const handlePassword = () => {
//         setSeePassword(prevState => !prevState);
//     };

//     const getUserdata = (id) => {
//         axios.get(`admin/users/${id}`, {
//             headers: {
//               'Accept': 'application/json',
//               'Content-Type': 'application/json;charset=UTF-8',
//               'Authorization': `Bearer ${authInfo.token}`,
//             }}
//         ).then(response => {
//             toast.dismiss();
//             console.log('response----',response)
//             if (response.data.status) {
//                setUserData(response.data.data)
//             } else {
//                 toast.error(response.data.message, { autoClose: 3000 });
//             }
//         }).catch(error => {
//             toast.dismiss();
//             if (error.response) {
//                 toast.error(error.response.data.message, { autoClose: 3000 });
//             }
//         });
//     }

//     return (
//         <Fragment>
//             <PeModal onClose={props.onClick} onShow={props.onregisterShow}>
//                 <div className="regiter_form">
//                     <h4 className="h4">Buyer Register11</h4>
//                     <form onSubmit={formik.handleSubmit}>
//                         <div className="mb-3">
//                             <label htmlFor="name" className="form-label">Name <small className="text-danger">*</small></label>
//                             <input type="text" className="form-control" id="name" name="name"
//                                 onChange={formik.handleChange}
//                                 onBlur={formik.handleBlur}
//                                 value={formik.values.name}
//                             />
//                             {formik.touched.name && formik.errors.name ? (
//                                 <small className="text-danger">{formik.errors.name}</small>
//                             ) : null}
//                         </div>
//                         <div className="mb-3">
//                             <label htmlFor="email" className="form-label">Email ID <small className="text-danger">*</small></label>
//                             <input type="email" className="form-control" id="email" name="email"
//                                 onChange={formik.handleChange}
//                                 onBlur={formik.handleBlur}
//                                 value={formik.values.email}
//                             />
//                             {formik.touched.email && formik.errors.email ? (
//                                 <small className="text-danger">{formik.errors.email}</small>
//                             ) : null}
//                         </div>
//                         <div className="pwd_wrapper mb-3">
//                             <label htmlFor="password" className="form-label">Password <small className="text-danger">*</small></label>
//                             <div className="input-group">
//                                 <input type={seePassword ? "text" : "password"} className="form-control" id="password" name="password"
//                                     onChange={formik.handleChange}
//                                     onBlur={formik.handleBlur}
//                                     value={formik.values.password}
//                                 />
//                                 <span className="input-group-text" onClick={handlePassword} style={{ cursor: "pointer" }}>
//                                     <img src={seePassword ? visibleIcon : invisibleIcon} alt="toggle password visibility" />
//                                 </span>
//                             </div>
//                             {formik.touched.password && formik.errors.password ? (
//                                 <small className="text-danger">{formik.errors.password}</small>
//                             ) : null}
//                         </div>

//                         {/* Terms & Conditions Checkbox */}
//                         <div className="mb-3 form-check">
//                             <input type="checkbox" className="form-check-input" id="terms" name="terms"
//                                 onChange={formik.handleChange}
//                                 onBlur={formik.handleBlur}
//                                 checked={formik.values.terms}
//                             />
//                             <label className="form-check-label" htmlFor="terms">
//                                 I agree to the <Link to="/terms">Terms and Conditions</Link>
//                             </label>
//                             {formik.touched.terms && formik.errors.terms ? (
//                                 <small className="text-danger d-block">{formik.errors.terms}</small>
//                             ) : null}
//                         </div>
//                         {selectedId === null ?
//                             <button type="submit" className="btn custom_btn btn_yellow text-uppercase" disabled={!formik.isValid}>Register</button>
//                             : <button type="submit" className="btn custom_btn btn_yellow text-uppercase" disabled={!formik.isValid}>Update</button>}
//                     </form>
//                 </div>
//             </PeModal>
//         </Fragment>
//     );
// };

// function UserRegister(props) {
//     return (
//         <Fragment>
//             {ReactDom.createPortal(<Modal onClick={props.onregisterHide} selectedId={props.selectedId} />, document.getElementById('overlays'))}
//         </Fragment>
//     );
// }

// export default UserRegister;


import React, { useEffect, Fragment, useState } from 'react';
import ReactDom from 'react-dom';
import { Link } from 'react-router-dom';
import invisibleIcon from '../../assets/icons/invisible-icon.svg';
import visibleIcon from '../../assets/icons/eye-icon.svg';
import PeModal from '../../../src/components/common/modals/PeModal';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import * as Yup from 'yup';

// Define a validation schema with conditional validation using context.
// In registration mode (context.isRegister true), password fields are required.
// In update mode (context.isRegister false), password fields are not required.
const userRegistrationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().when('$isRegister', {
    is: true,
    then: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
    otherwise: Yup.string().notRequired()
  }),
  terms: Yup.boolean().oneOf([true], 'You must accept the Terms and Conditions.')
});

const Modal = (props) => {
  toast.configure();
  // Retrieve auth info from localStorage
  const authInfo = JSON.parse(localStorage.getItem('authInfo'));

  // Local state for toggling password visibility and storing user data.
  const [seePassword, setSeePassword] = useState(false);
  // Use selectedId passed from props. (If provided, we're in update mode.)
  const [selectedId, setSelectedId] = useState(props.selectedId);
  const [userData, setUserData] = useState({});

  // When the selectedId prop changes, update state and, if updating, fetch user data.
  useEffect(() => {
    setSelectedId(props.selectedId);
    if (props.selectedId) {
      getUserdata(props.selectedId);
    }
  }, [props.selectedId]);

  // Function to fetch user data for update mode.
  const getUserdata = (id) => {
    axios
      .get(`admin/users/${id}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json;charset=UTF-8',
          'Authorization': `Bearer ${authInfo.token}`,
        }
      })
      .then(response => {
        toast.dismiss();
        if (response.data.status) {
          setUserData(response.data.data);
        } else {
          toast.error(response.data.message, { autoClose: 3000 });
        }
      })
      .catch(error => {
        toast.dismiss();
        if (error.response) {
          toast.error(error.response.data.message, { autoClose: 3000 });
        }
      });
  };

  // Determine registration mode from selectedId:
  // If selectedId is falsy, we're in registration mode.
  const isRegister = !selectedId;

  // Setup Formik. enableReinitialize ensures that when userData updates (in update mode),
  // the form is updated accordingly.
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: userData.name || '',
      email: userData.email || '',
      password: '',
      terms: isRegister ? false : true
    },
    validationSchema: userRegistrationSchema,
    context: { isRegister },

    onSubmit: (values, { resetForm }) => {
      if (selectedId) {
        console.log('values--111',values)
        const data = {
            id:selectedId,
            name:values.name,
            email:values.email
        }
        axios
          .put(`admin/update-customer/`, data, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json;charset=UTF-8',
              'Authorization': `Bearer ${authInfo.token}`,
            }
          })
          .then(response => {
            toast.dismiss();
            if (response.data.status) {
              toast.success(response.data.message, { autoClose: 3000 });
              resetForm();
              props.onClick(); 
            } else {
              toast.error(response.data.message, { autoClose: 3000 });
            }
          })
          .catch(error => {
            toast.dismiss();
            if (error.response) {
              toast.error(error.response.data.message, { autoClose: 3000 });
            }
          });
      } else {
        axios
          .post('user/signup', values)
          .then(response => {
            toast.dismiss();
            if (response.data.status) {
              toast.success(response.data.message, { autoClose: 3000 });
              resetForm();
              props.onClick(); 
              props.onShow();
            } else {
              toast.error(response.data.message, { autoClose: 3000 });
            }
          })
          .catch(error => {
            toast.dismiss();
            if (error.response) {
              toast.error(error.response.data.message, { autoClose: 3000 });
            }
          });
      }
    }
  });

  const handlePassword = () => {
    setSeePassword(prev => !prev);
  };

  return (
    <Fragment>
      <PeModal onClose={props.onClick} onShow={props.onregisterShow}>
        <div className="regiter_form">
          <h4 className="h4">{isRegister ? "Buyer Register" : "Update User"}</h4>
          <form onSubmit={formik.handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Name <small className="text-danger">*</small>
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
              />
              {formik.touched.name && formik.errors.name && (
                <small className="text-danger">{formik.errors.name}</small>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email ID <small className="text-danger">*</small>
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email && (
                <small className="text-danger">{formik.errors.email}</small>
              )}
            </div>
            <div className="pwd_wrapper mb-3">
              <label htmlFor="password" className="form-label">
                Password {isRegister ? (<small className="text-danger">*</small>) : ''}
              </label>
              <div className="input-group">
                <input
                  type={seePassword ? "text" : "password"}
                  className="form-control"
                  id="password"
                  name="password"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  placeholder={isRegister ? "" : "****************"}
                  disabled={!isRegister}
                />
                {/* Show toggle icon only in registration mode */}
                {isRegister && (
                  <span className="input-group-text" onClick={handlePassword} style={{ cursor: "pointer" }}>
                    <img src={seePassword ? visibleIcon : invisibleIcon} alt="toggle password visibility" />
                  </span>
                )}
              </div>
              {formik.touched.password && formik.errors.password && (
                <small className="text-danger">{formik.errors.password}</small>
              )}
            </div>
            {/* Terms & Conditions Checkbox (if registration mode) */}
            {/* {isRegister && ( */}
              <div className="mb-3 form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="terms"
                  name="terms"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  checked={formik.values.terms}
                  disabled={!isRegister}
                />
                <label className="form-check-label" htmlFor="terms">
                  I agree to the <Link to="/terms">Terms and Conditions</Link>
                </label>
                {formik.touched.terms && formik.errors.terms && (
                  <small className="text-danger d-block">{formik.errors.terms}</small>
                )}
              </div>
            {/* )} */}
            <button type="submit" className="btn custom_btn btn_yellow text-uppercase" disabled={!formik.isValid}>
              {isRegister ? "Register" : "Update"}
            </button>
          </form>
        </div>
      </PeModal>
    </Fragment>
  );
};

function UserRegister(props) {
  return (
    <Fragment>
      {ReactDom.createPortal(
        <Modal
          onClick={props.onregisterHide}
          onregisterShow={props.onregisterShow}
          selectedId={props.selectedId}
        />,
        document.getElementById('overlays')
      )}
    </Fragment>
  );
}

export default UserRegister;

