import React from 'react';
import axios from 'axios';
import { GoogleLogin, GoogleLogout  } from 'react-google-login';
import { gapi } from 'gapi-script';
import { useEffect } from 'react';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
const API_KEY = process.env.REACT_APP_API_KEY;
const DISCOVERY_DOC = process.env.REACT_APP_DISCOVERY_DOC;
const SCOPES = process.env.REACT_APP_SCOPES;

export const CalendarAuth = () => {

  const responseGoogle = async (response) => {
    console.log("Response Google:", response);
    const { code } = response;
  
    console.log("Google Response", response);
    console.log("Refresh Token", code);
  
    try {
      const authInstance = gapi.auth2.getAuthInstance();
      const currentUser = authInstance.currentUser.get();
      const accessToken = currentUser.getAuthResponse().access_token;
      console.log("Access Token", accessToken);
    } catch (error) {
      console.error("Error getting access token:", error);
    }
  };
  

  const responseError = (error) => {
    console.log(error);
  };

  const onSuccess = (res) => {
    console.log('Logout made successfully', res);
    alert('Logout made successfully ✌');
  };

  return (
    <div style={{ marginTop: "30px", marginBottom: "50px" }}>
      <GoogleLogin
        clientId={CLIENT_ID}
        buttonText='Sign in and Authorize Calendar'
        onSuccess={responseGoogle}
        onFailure={responseError}
        cookiePolicy={'single_host_origin'}
        responseType='code'
        accessType='offline'
        scope={SCOPES}
      />
       <GoogleLogout
        clientId={CLIENT_ID}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      ></GoogleLogout>
    </div>
  );

};