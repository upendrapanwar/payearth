import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setLoginStatus, setUserInfo, setAuthInfo } from '../../../store/reducers/auth-reducer';
import config from './../../../config.json';
import fbLogo from './../../../assets/images/fb-logo.png';
const appId = config.facebookAppId;

const FBLogin = (props) => {
	const history = useHistory();
	const dispatch = useDispatch();

	const onSuccess = res => {
		if(res.status !== 'unknown'){
			let values = {
				"provider_id": res.id,
				"provider_type": "facebook",
				"provider_data": res
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
						token: response.data.data.token
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
		}
	};

	return (
		<FacebookLogin
			appId={appId}
			autoLoad={false}
			fields="name,email,picture"
			scope="public_profile,email"
			callback={onSuccess}
			render={renderProps => (
				<Link to="#" onClick={renderProps.onClick} disabled={renderProps.disabled} className="d-inline-block me-2"><img src={fbLogo} alt="facebook-logo" /></Link>
			)}
		/>
	);
}

export default FBLogin;