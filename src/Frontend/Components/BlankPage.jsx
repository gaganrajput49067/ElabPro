import React from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Link, useNavigate } from "react-router-dom";
import errorpage from "../../img/errorpage.png";
import Footer from "./Footer";

function BlankPage() {
  const navigate = useNavigate();
  return (
    <div className="warpper">
      <Header />
      <Sidebar />
      <div className="content-wrapper">
        <div
          className="box-body"
          style={{
            height: "100%",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div className="row">
            <div className="col-sm-12">
              <div className="errorContainer">
                <img src={errorpage} style={{ width: "40%" }}></img>
                <p className="error_content">404!</p>
                <p className="error_content">
                  Uh Ohh ..Page Not Found!
                </p>
                <p className="errorParacontent">
                  Sorry, the page you are looking for does not exist or has been
                  moved
                </p>
                <Link onClick={() => navigate(-1)}>Back To Last Page</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BlankPage;