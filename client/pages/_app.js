import TopNav from "../component/TopNav";

import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "../public/css/style.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Provider } from "../context";

import React from "react";

function _app({ Component, pageProps }) {
  return (
    <Provider>
      <ToastContainer position="top-center" />
      <TopNav />
      <Component {...pageProps} />;
    </Provider>
  );
}

export default _app;
