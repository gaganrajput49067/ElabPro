import React from "react";
import { useNavigate } from "react-router-dom";

const ComingSoon = () => {
    const navigate = useNavigate();
  return (
    <>
      <div
        className="box-body"
        style={{
          height: "100%",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          className="row"
          style={{
            height: "100%",
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            marginTop: "10%",
          }}
        >
          <div className="col-sm-8">
            <div className="errorContainer">
            <h2 className="title">SomeThing Big is Coming Soon</h2>
              {/* <CountdownTimer /> */}
              <p
                style={{
                  fontSize: "15px",
                //   fontWeight: "bold",
                  color: "gray",
                  marginTop: "15px",
                }}
              >
                Our Project is Under Construction, We are working hard to give
                you the best Experience with this one.
              </p>
              <button className="btn  btn-sm" style={{background:"#605ca8",color:"white"}} onClick={() => navigate("/")}>Login/SignUp</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComingSoon;
