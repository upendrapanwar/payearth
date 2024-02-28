import React from 'react';
import { GoogleLogout  } from 'react-google-login';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

export const CalendarLogout = ({ onLogoutSuccess }) => {

  const onSuccess = (res) => {
    console.log('Logout made successfully', res);
    // alert('Logout made successfully ✌');
    onLogoutSuccess();
  };

  return (
    <div style={{ marginTop: "30px", marginBottom: "50px" }}>
       <GoogleLogout
        clientId={CLIENT_ID}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      ></GoogleLogout>
    </div>
  );

};