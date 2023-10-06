import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { GoogleLogin } from 'react-google-login';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setLoginStatus, setUserInfo, setAuthInfo } from '../../../store/reducers/auth-reducer';
import config from '../../../config.json';
import googleLogo from './../../../assets/images/google-logo.png';

const clientId = config.googleClientId;
const GLogin = (props) => {
	const history = useHistory();
	const dispatch = useDispatch();

	const onSuccess = res => {
		let values = {
			"provider_id": res.profileObj.googleId,
			"provider_type": "google",
			"provider_data": res.profileObj
		};
		let url = '';

		if (props.role === 'user') {
			url = 'user/social-login';
		} else if(props.role === 'seller') {
			url = 'seller/social-login';
		}

		axios.post(url, values).then(response => {
			toast.dismiss();
			if (response.data.status) {
			toast.success(response.data.message, {autoClose:3000});
			let authInfo = {
				expTime: response.data.data.expTime,
				id: response.data.data['_id'],
				token: response.data.data.token,
			};
			let userInfo = {
				name: response.data.data.name,
				email: response.data.data.email,
				purchase_type: response.data.data.purchase_type,
				role: response.data.data.role
			};
			localStorage.setItem('userInfo', JSON.stringify(userInfo));
			localStorage.setItem('authInfo', JSON.stringify(authInfo));
			localStorage.setItem('isLoggedIn', 1);
			dispatch(setLoginStatus({isLoggedIn: true}));
			dispatch(setUserInfo({userInfo}));
			dispatch(setAuthInfo({authInfo}));

			if (props.role === 'user') {
				props.closeModal();
				history.push('/');
			} else if(props.role === 'seller') {
				history.push('/seller/dashboard');
			}
		} else {
			toast.error(response.data.message, {autoClose:3000});
		}

		}).catch(error => {
			toast.dismiss();
			if (error.response) {
				toast.error(error.response.data.message, {autoClose:3000});
			}
		});
	};

  	return (
		<GoogleLogin
			clientId={clientId}
			render={renderProps => (
			<Link to="#" onClick={renderProps.onClick} disabled={renderProps.disabled} className="d-inline-block me-2"><img src={googleLogo} alt="google-logo" /></Link>
			)}
			buttonText="Login"
			autoLoad={false}
			onSuccess={onSuccess}
			cookiePolicy={'single_host_origin'}
		/>
  	);
}

export default GLogin;