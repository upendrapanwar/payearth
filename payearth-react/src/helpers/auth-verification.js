import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
import { setLoginStatus, setUserInfo } from './../store/reducers/auth-reducer';

function authVerification(dispatch) {
    let authInfo = JSON.parse(localStorage.getItem('authInfo'));
    let userInfo = JSON.parse(localStorage.getItem('userInfo'));

    if (authInfo !== null) {
        let token = authInfo.token;
        let decoded = jwt_decode(token);
        let currentDate = new Date();
        let redirectUrl = '/';

        if (decoded.exp * 1000 < currentDate.getTime()) {
            localStorage.clear();
            dispatch(setLoginStatus({ isLoggedIn: false }));
            dispatch(setUserInfo({ userInfo: [] }));
            toast.configure();
            toast.error('Session time out. Please login again!');
            setTimeout(() => {
                if (userInfo.role === 'seller') {
                    redirectUrl = '/seller/login';
                }
                window.location.href = redirectUrl;
            }, 3000);
        }
    }
}

export { authVerification };