import React from "react";
import { Link } from "react-router-dom";

import Input from "../../ChildComponents/Input";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../util/Loading";
import { number } from "../util/Commonservices/number";
import { useFormik } from "formik";
import { EnterOTP, ForgetPasswordSchema } from "../../ValidationSchema";
import { useTranslation } from "react-i18next";

const ForgetPassword = () => {
  const { t, i18n } = useTranslation();
  const [otpScreen, setOtpScreen] = useState(true);
  const [load, setLoad] = useState({
    sendOtpLoading: false,
    ChangePasswordLoading: false,
  });

  const [payload, setPayload] = useState({
    UserName: "",
    Mobile: "",
    OTP: "",
    Password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const { errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: payload,
    enableReinitialize: true,
    validationSchema: otpScreen ? ForgetPasswordSchema : EnterOTP,
    onSubmit: (values) => {
      if (otpScreen) {
        setLoad({ ...load, sendOtpLoading: true });
        axios
          .post("/api/v1/ForgetPasswordController/ForgetPassword", {
            UserName: values?.UserName,
            Mobile: values?.Mobile,
          })
          .then((res) => {
            toast.success(res.data?.message);
            setOtpScreen(false);
            setLoad({ ...load, sendOtpLoading: false });
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Something Went Wrong"
            );
            setLoad({ ...load, sendOtpLoading: false });
          });
      } else {
        setLoad({ ...load, ChangePasswordLoading: true });
        axios
          .post("/api/v1/ForgetPasswordController/ResetPassword", {
            UserName: values?.UserName,
            Mobile: values?.Mobile,
            OTP: values?.OTP,
            Password: values?.Password,
          })
          .then((res) => {
            toast.success(res.data?.message);
            setOtpScreen(true);
            setLoad({ ...load, ChangePasswordLoading: false });
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Something Went Wrong"
            );
            setLoad({ ...load, ChangePasswordLoading: false });
          });
      }
    },
  });

  return (
    <div className="login-box">
      <div className="login-logo">
        <Link to="/login">
     <b>eLabPro.</b>IN
        </Link>
      </div>

      <div className="login-box-body">
        <p className="login-box-msg">{t("Forgot Password")}</p>
        {otpScreen ? (
          <div>
            <div className="form-group has-feedback">
              <Input
                type="text"
                className="form-control"
                placeholder={t("UserName")}
                name="UserName"
                value={payload?.UserName}
                onChange={handleChange}
                onBlur={handleBlur}
                max={20}
                min={3}
              />

              <i
                className="fa fa-user form-control-feedback"
                aria-hidden="true"
              ></i>
              {errors?.UserName && touched?.UserName && (
                <span className="golbal-Error">{errors?.UserName}</span>
              )}
            </div>

            <div className="form-group has-feedback">
              <Input
                type="number"
                className="form-control"
                placeholder={t("Enter Register Number")}
                name="Mobile"
                value={payload?.Mobile}
                onInput={(e) => {
                  number(e, 10);
                }}
                onChange={handleChange}
              />

              <i
                className="fa fa-phone form-control-feedback"
                aria-hidden="true"
              ></i>
              {errors?.Mobile && touched?.Mobile && (
                <span className="golbal-Error">{errors?.Mobile}</span>
              )}
            </div>

            <div className="row">
              <div className="col-xs-8"></div>

              <div className="col-xs-4">
                {load?.sendOtpLoading ? (
                  <Loading />
                ) : (
                  <button
                    type="submit"
                    className="btn btn-custom-01 btn-block btn-flat"
                    onClick={() => handleSubmit()}
                  >
                   {t("Send OTP")} 
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="form-group has-feedback">
              <Input
                type="number"
                className="form-control"
                placeholder={t("Enter OTP")}
                name="OTP"
                onInput={(e) => {
                  number(e, 8);
                }}
                value={payload?.OTP}
                onChange={handleChange}
              />

              <i
                className="fa fa-key form-control-feedback"
                aria-hidden="true"
              ></i>
              {errors?.OTP && touched?.OTP && (
                <span className="golbal-Error">{errors?.OTP}</span>
              )}
            </div>

            <div className="form-group has-feedback">
              <Input
                className="form-control"
                placeholder={t("Enter Password")}
                name="Password"
                type="password"
                autoComplete={"off"}
                value={payload?.Password}
                onChange={handleChange}
              />

              <i
                className="fa  fa-lock form-control-feedback"
                aria-hidden="true"
              ></i>
              {errors?.Password && touched?.Password && (
                <span className="golbal-Error">{errors?.Password}</span>
              )}
            </div>

            {/* <div className="form-group has-feedback">
              <Input
                className="form-control"
                placeholder="Confirm Password"
                name="Phone"
                type="password"
              />

              <i
                className="fa  fa-lock form-control-feedback"
                aria-hidden="true"
              ></i>
            </div> */}

            <div className="row">
              <div className="col-xs-8">
                {/* <p className="text-info" style={{ cursor: "pointer" }}>
                  Resend Otp
                </p> */}
              </div>

              <div className="col-xs-4">
                {load?.ChangePasswordLoading ? (
                  <Loading />
                ) : (
                  <button
                    type="submit"
                    className="btn btn-custom-01 btn-block btn-flat"
                    onClick={() => handleSubmit()}
                  >
                  {t("Change Password")}  
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
        {/* <div className="social-auth-links text-center">
          <p>- OR -</p>
          <a
            href="#"
            className="btn btn-block btn-social btn-facebook btn-flat"
          >
            <i className="fa fa-facebook"></i> Sign in using Facebook
          </a>
          <a href="#" className="btn btn-block btn-social btn-google btn-flat">
            <i className="fa fa-google-plus"></i> Sign in using Google+
          </a>
        </div> */}

        <Link to="/Login">{t("Back To Login")}</Link>
        <br />
        {/* <a href="register.html" className="text-center">
          Register a new membership
        </a> */}
      </div>
    </div>
  );
};

export default ForgetPassword;
