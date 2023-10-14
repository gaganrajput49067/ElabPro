import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Footer from "../Components/Footer";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import { toast } from "react-toastify";
export const ProtectedRoute = () => {
  const location = useLocation();
  const isLoggedIn = window.sessionStorage.getItem("user_Token");
  // const FetchData = () => {
  //   isLoggedIn &&
  //     axios
  //       .get("/api/v1/Menu/MainMenuPageData")
  //       .then((res) => {
  //         const data = res?.data?.message;
  //         const val = data?.pageData?.map((ele) => {
  //           return ele?.PageUrl;
  //         });
  //         if (val.includes(window?.location?.pathname)) {
  //         } else {
  //           window.location.replace("/patientregister");
  //         }
  //       })
  //       .catch((err) => {
  //         toast.error(
  //           err?.response?.data?.message
  //             ? err?.response?.data?.message
  //             : "Something Went Wrong"
  //         );
  //       });
  // };


  

  useEffect(() => {
    if (isLoggedIn && window.location.pathname === "/") {
      window.location.replace("/Home");
    }
    // FetchData();
  }, []);


  useEffect(()=>{
    window.scrollTo(0, 0);
  },[location?.pathname])

  return (
    <React.Fragment>
      {isLoggedIn ? (
        <div
          className="wrapper"
          style={{ height: "auto", minHeight: "100%" }}
          data-select2-id="19"
        >
          <Header />
          <Sidebar />
          <Outlet />
          <Footer />
        </div>
      ) : (
        <Navigate to="/login" />
      )}
    </React.Fragment>
  );
};

export const HomeRouter = () => {
  const isLoggedIn = window.sessionStorage.getItem("user_Token");
  useEffect(() => {
    if (!isLoggedIn && window.location.pathname === "/") {
      window.location.replace("/login");
    }
  }, []);

  return (
    <React.Fragment>
      {!isLoggedIn ? <Outlet /> : <Navigate to="/Home" />}
    </React.Fragment>
  );
};
