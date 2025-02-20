import React from 'react';
import FacebookLogin from 'react-facebook-login';
import axios from 'axios';


const FacebookLoginComponent = () => {

    const responseFacebook = (response) => {
        console.log("response from facebook", response);

        // const user = {
        //     name: response.name,
        //     email: response.email,
        //     userId: response.userID,
        //     accessToken: response.accessToken
        // };

        // // Save the user data to your backend
        // axios.post('http://localhost:5000/api/users/facebook-login', user)
        //     .then(res => {
        //         console.log('User saved successfully', res.data);
        //     })
        //     .catch(err => {
        //         console.error('Error saving user', err);
        //     });
    }

    return (
        <div>
            <FacebookLogin
                appId={process.env.REACT_APP_FACEBOOK_APP_ID}
                autoLoad={false}
                fields="name,email,picture"
                callback={responseFacebook}
            />
        </div>
    );
};

export default FacebookLoginComponent;