import React, { useEffect, useState } from "react";
import Input from "../../ChildComponents/Input";
import { number } from "../../Frontend/util/Commonservices/number";
import Loading from "../../Frontend/util/Loading";
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useFormik } from "formik";
import { FieldMasterValidation } from "../../ValidationSchema";

import { useTranslation } from "react-i18next";
const CreateFieldBoyMaster = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;

  const { t} = useTranslation();
  const [formData, setFormData] = useState({
    Name: "",
    Age: "",
    Mobile: "",
    isActive: 0,
    HomeCollection: "0",
  });
  const [load, setLoad] = useState(false);

  const handleUpload = (url) => {
    setLoad(true);
    axios
      .post(url, formData)
      .then((res) => {
        setLoad(false);
        toast.success(res?.data?.message);
        setFormData({
          Name: "",
          Age: "",
          Mobile: "",
          isActive: 0,
          HomeCollection: "0",
        });
        navigate("/FieldBoyMaster");
      })
      .catch((err) => {
        setLoad(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went Wrong"
        );
      });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const { errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: formData,
    validationSchema: FieldMasterValidation,
    enableReinitialize: true,
    onSubmit: () => {
      handleUpload(
        state?.url
          ? "/api/v1/FieldBoyMaster/UpdateFieldBoy"
          : "/api/v1/FieldBoyMaster/InsertFieldBoy"
      );
    },
  });

  const handleEditData = () => {
    axios
      .post(state?.url, { FieldBoyID: state?.data })
      .then((res) => {
        setFormData(res?.data?.message[0]);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  useEffect(() => {
    if (state) {
      handleEditData();
    }
  }, []);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">
            {t("Field Boy Master")} / <span className="text-black">{t("Create")}</span>
          </h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Field Boy Name")}:
            </label>
            <div className="col-sm-2">
              <Input
                type="text"
                className="select-input-box form-control input-sm"
                name="Name"
                placeholder={t("Field Boy Name")}
                max={50}
                onChange={handleChange}
                onBlur={handleBlur}
                value={formData?.Name}
              />
              {errors?.Name && touched?.Name && (
                <span className="golbal-Error">{errors?.Name}</span>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Field Boy Age")}:
            </label>
            <div className="col-sm-2">
              <Input
                type="text"
                placeholder={t("Field Boy Age")}
                onInput={(e) => number(e, 3)}
                className="select-input-box form-control input-sm"
                name="Age"
                value={formData?.Age}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors?.Age && touched?.Age && (
                <span className="golbal-Error">{errors?.Age}</span>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Mobile")}:
            </label>
            <div className="col-sm-2">
              <Input
                type="text"
                placeholder={t("Mobile Number")}
                onInput={(e) => number(e, 10)}
                className="select-input-box form-control input-sm"
                name="Mobile"
                value={formData?.Mobile}
                onBlur={handleBlur}
                onChange={handleChange}
              />
              {errors?.Mobile && touched?.Mobile && (
                <span className="golbal-Error">{errors?.Mobile}</span>
              )}
            </div>

            <div className="col-sm-1">
              <Input
                type="checkbox"
                name="isActive"
                checked={formData?.isActive}
                onChange={handleChange}
              />
              <label className="control-label">{t("Active")}</label>
            </div>

            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-success btn-sm btn-block"
                  onClick={() => handleSubmit()}
                >
                  {state?.url ? t("Update") : t("Save")}
                </button>
              )}
            </div>

            <div className="col-sm-1">
              <Link to="/FieldBoyMaster">{t("Back to List")}</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateFieldBoyMaster;
