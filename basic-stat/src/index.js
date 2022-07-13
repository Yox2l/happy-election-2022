import React from "react";
import ReactDOM from "react-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap-css-only/css/bootstrap.min.css";
import "mdbreact/dist/css/mdb.css";
import "./index.css";
import App from "./App";

import registerServiceWorker from './registerServiceWorker';

import { AwsRum } from 'aws-rum-web';

try {
  const config = {
    sessionSampleRate: 1,
    guestRoleArn: "arn:aws:iam::944156395127:role/RUM-Monitor-eu-west-1-944156395127-7111683477561-Unauth",
    identityPoolId: "eu-west-1:2a92d353-7617-4bef-9811-2d0f2defff92",
    endpoint: "https://dataplane.rum.eu-west-1.amazonaws.com",
    telemetries: ["performance","errors","http"],
    allowCookies: false,
    enableXRay: false
  };

  const APPLICATION_ID = 'e4b7fa9d-b8d9-4200-a610-72a56f30233f';
  const APPLICATION_VERSION = '1.0.0';
  const APPLICATION_REGION = 'eu-west-1';

  const awsRum = new AwsRum(
    APPLICATION_ID,
    APPLICATION_VERSION,
    APPLICATION_REGION,
    config
  );
} catch (error) {
  // Ignore errors thrown during CloudWatch RUM web client initialization
}

ReactDOM.render( <App /> , document.getElementById('root'));

registerServiceWorker();