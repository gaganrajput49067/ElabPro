import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { LoginSchema } from "../../ValidationSchema";
import Loading from "../util/Loading";
import { useTranslation } from "react-i18next";
import i18n from "i18next";
import "../../login.css";
const initialValues = {
  username: "",
  password: "",
};

const LoginForm = () => {
  const { t } = useTranslation();
  const [load, setLoad] = useState(false);
  const { values, errors, handleChange, touched, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: LoginSchema,
    onSubmit: (values, { resetForm }) => {
      setLoad(true);
      axios
        .post("/api/v1/Users/login", values)
        .then((res) => {
          if (res.data.success) {
            window.sessionStorage.setItem("user_Token", res.data.token);
            window.sessionStorage.setItem("Username", res.data.user.Username);
            window.sessionStorage.setItem(
              "CompanyCode",
              res.data.user.CompanyCode
            );
            window.sessionStorage.setItem(
              "DefaultCentre",
              res.data.user.DefaultCentreID
            );
            window.location.replace("/home");
            toast.success("Login Successfully");
            setLoad(false);
            resetForm();
          }
        })
        .catch((err) => {
          toast.error(
            err.response.data.message
              ? err.response.data.message
              : "error occured"
          );
          setLoad(false);
          resetForm();
        });
    },
  });

  const handleChangeDropDown = (e) => {
    const { value } = e.target;
    window.localStorage.setItem("language", value);
    i18n.changeLanguage(value);
  };

  return (
<div className="div_login">


    <div className="login-box">
      <select
        onChange={handleChangeDropDown}
        style={{ position: "absolute", top: "0px", right: "10px" }}
      >
        <option value="en">English</option>
        <option value="hi">Hindi</option>
      </select>
      
      <div className="login-logo">
        <br/>
      <h4>
        Welcome to 
      </h4>
        <img src='https://s3.ap-south-1.amazonaws.com/frontend.elabpro.in/logo.jpg'/>
      </div>

      <div className="login-box-body">
        <p className="login-box-msg">{t("Sign in to start your session")}</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group has-feedback">
            <Input
              type="text"
              className="form-control"
              placeholder={t("UserName")}
              name="username"
              value={values.username}
              onChange={handleChange}
              text=""
            />

            <i
              className="fa fa-user form-control-feedback"
              aria-hidden="true"
            ></i>
            {errors?.username && touched?.username && (
              <span className="golbal-Error">{errors?.username}</span>
            )}
          </div>
          <div className="form-group has-feedback">
            <Input
              type="password"
              className="form-control"
              placeholder={t("Password")}
              name="password"
              value={values.password}
              onChange={handleChange}
            />
            <i
              className="fa fa-key form-control-feedback"
              aria-hidden="true"
            ></i>

            {errors?.password && touched?.password && (
              <span className="golbal-Error">{errors?.password}</span>
            )}
          </div>
          <div className="row">
            <div className="col-xs-12">
              {load ? (
                <Loading />
              ) : (
                <button
                  type="submit"
                  className="btn btn-custom-01 btn-block btn-flat btn-success"
                >
                  {t("Sign In")}
                </button>
              )}
            </div>
          </div>
        </form>

        <Link to="/forgotPassword">{t("I forgot my password")}</Link>
        <br />
        {/* <a href="register.html" className="text-center">
          {t("Register a new membership")}
        </a> */}
      </div>
    </div>
    </div>
  );
};

export default LoginForm;
