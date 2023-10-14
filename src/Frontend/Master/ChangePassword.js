import React, { useEffect, useState } from "react";
import Input from "../../ChildComponents/Input";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useFormik } from "formik";
import { ChangePasswordSchema } from "../../ValidationSchema";
import Loading from "../../Frontend/util/Loading";
import { useTranslation } from "react-i18next";

const ChangePassword = () => {
  const [state, setState] = useState({
    UserType: "",
    UserName: "",
    OldPassword: "",
    NewPassword: "",
    ConfirmPassword: "",
  });

  const [load, setLoad] = useState(false);

  // i18n start 
  const { t } = useTranslation();
  // i18n end 

  const navigate = useNavigate();
  const handleLogout = () => {
    axios
      .get("/api/v1/Users/logout")
      .then((res) => {
        window.sessionStorage.clear();
        navigate("/login");
        toast.success("Logout Successfully");
      })
      .catch((err) => {
        toast.error(err?.data?.message ? err?.data?.message : "Error Occured");
      });
  };

  const { values, errors, handleChange, handleBlur, touched, handleSubmit } =
    useFormik({
      initialValues: state,
      validationSchema: ChangePasswordSchema,
      onSubmit: (values, { resetForm }) => {
        setLoad(true);
        axios
          .post("/api/v1/changePassword/changeUserPassword", {
            UserType: state?.UserType,
            UserName: state?.UserName,
            OldPassword: values?.OldPassword,
            NewPassword: values?.NewPassword,
            ConfirmPassword: values?.ConfirmPassword,
          })
          .then((res) => {
            if (res?.data?.message === "Password  Update Successfully") {
              toast.success(res?.data?.message);
              handleLogout();
              setLoad(false);
              resetForm();
            } else {
              setLoad(false);
              toast.error(res?.data?.message);
            }
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "error Occured"
            );
            setLoad(false);
            resetForm();
          });
      },
    });

  const fetchDetail = () => {
    axios
      .get("/api/v1/changePassword/getUserDetail")
      .then((res) => {
        const data = res?.data?.message[0];
        setState({
          ...state,
          UserType: data?.UserType,
          UserName: data?.Username,
          UserTypeName: data?.UserTypeName,
        });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "error Occured"
        );
      });
  };

  useEffect(() => {
    fetchDetail();
  }, []);
  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Change Password")}
        </h3>
        </div>
        <div className="box-body">
          <form onSubmit={handleSubmit}>
            <div className="row">
              <label className="col-sm-1">{t("User Type")}:
             </label>
              <div className="col-sm-2 ">
                <Input
                  className="form-control ui-autocomplete-input input-sm"
                  placeholder={t("User Type")}
                  disabled={true}
                  value={state?.UserTypeName}
                />
              </div>
              <label className="col-sm-1">
              {t("User Name")}:
             </label>
              <div className="col-sm-2 ">
                <Input
                  className="form-control ui-autocomplete-input input-sm"
                  placeholder={t("User Name")}
                  disabled={true}
                  max={30}
                  value={state?.UserName}
                />
              </div>
              <label className="col-sm-1"> {t("Old Password")}:
              </label>
              <div className="col-sm-2 ">
                <Input
                  className="form-control ui-autocomplete-input input-sm"
                  placeholder={t("Old Password")}
                  type="password"
                  max={30}
                  name="OldPassword"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values?.OldPassword}
                />
              </div>
              <label className="col-sm-1">            
              {t("New Password")}:
             </label>
              <div className="col-sm-2 ">
                <Input
                  className="form-control ui-autocomplete-input input-sm "
                  placeholder={t("New Password")}
                  type="password"
                  max={30}
                  onChange={handleChange}
                  name="NewPassword"
                  onBlur={handleBlur}
                  value={values?.NewPassword}
                />
                {errors?.NewPassword && touched?.NewPassword && (
                  <span className="golbal-Error">{errors?.NewPassword}</span>
                )}
              </div>
            </div>
            <div className="row">
              <label className="col-sm-1">
              {t("Confirm Password")}:
           </label>
              <div className="col-sm-2 ">
                <Input
                  className="form-control ui-autocomplete-input input-sm "
                  placeholder={t("Confirm Password")}
                  type="password"
                  max={30}
                  onChange={handleChange}
                  name="ConfirmPassword"
                  onBlur={handleBlur}
                  value={values?.ConfirmPassword}
                />
                {errors?.ConfirmPassword && touched?.ConfirmPassword && (
                  <span className="golbal-Error">
                    {errors?.ConfirmPassword}
                  </span>
                )}
              </div>
              <div className="col-sm-1">
                {load ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-block btn-success btn-sm"
                    type="submit"
                  >
                    {t("Save")}
                  
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
