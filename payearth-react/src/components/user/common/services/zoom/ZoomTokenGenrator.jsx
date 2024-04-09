import React, { useState } from "react";
import axios from "axios";

const ZoomTokenGenerator = () => {
  const [accessToken, setAccessToken] = useState("");
  const [error, setError] = useState(null);

  const generateToken = async () => {
    //const clientId = process.env.REACT_APP_ZOOM_CLIENT_ID;
    //const clientSecret = process.env.REACT_APP_ZOOM_CLIENT_SECRET;
    const accountId = process.env.REACT_APP_ZOOM_ACCOUNT_ID;

    //const base64EncodedCredentials = btoa(`${clientId}:${clientSecret}`);
    const base64EncodedCredentials =
      "ZUxyemFwbWRSd3FET3ZmOUxRd3JTZzpkTlR0djdmRDdPUnBWWDhNVnNmbzNyV3dvS0pCOWExSg==";
    const requestBody = new URLSearchParams();
    requestBody.append("grant_type", "account_credentials");
    requestBody.append("account_id", accountId);

    try {
      const response = await axios.post(
        "https://zoom.us/oauth/token",
        requestBody,
        {
          //mode: "no-cors",
          headers: {
            //"Content-Type": "application/x-www-form-urlencoded",
            Authorization: `Basic ${base64EncodedCredentials}`,
            //"Access-Control-Allow-Origin": "*",
          },
        }
      );

      const data = response.data;
      setAccessToken(data.access_token);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div>
      <button className="btn btn-danger" onClick={generateToken}>
        Generate Token
      </button>
      {error && <p>Error: {error}</p>}
      {accessToken && (
        <div>
          <p>Access Token: {accessToken}</p>
        </div>
      )}
    </div>
  );
};

export default ZoomTokenGenerator;
