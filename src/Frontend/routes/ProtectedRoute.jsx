import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import Utils from "../../Utils/Util";

export const ProtectedRoute = () => {
  const location = useLocation();
  const isLoggedIn = Utils.isLoggedIn();
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
        
         
          <Outlet />
          
        
      ) : (
        <Navigate to="/login" />
      )}
    </React.Fragment>
  );
};

export const HomeRouter = () => {
  const isLoggedIn = Utils.isLoggedIn();
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
