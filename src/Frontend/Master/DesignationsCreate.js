import React from "react";
import { validationForDesignations } from "../../ChildComponents/validations";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { number } from "../../Frontend/util/Commonservices/number";
import { useLocation } from "react-router-dom";
import { getTrimmedData } from "../../Frontend/util/Commonservices";
import Input from "../../ChildComponents/Input";
import Loading from "../../Frontend/util/Loading";

import { useTranslation } from "react-i18next";
const DesignationsCreate = () => {
  const [err, setErr] = useState({});
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const [formData, setFormData] = useState({
    Name: state?.data?.DesignationName ? state?.data?.DesignationName : "",
    SequenceNo: state?.data?.SequenceNo ? state?.data?.SequenceNo : "",
    IsDirectApprove: state?.data?.DirectApprove
      ? state?.data?.DirectApprove === "True"
        ? "1"
        : "0"
      : "",
    IsNewTestApprove: state?.data?.NewTestApproves
      ? state?.data?.NewTestApproves === "True"
        ? "1"
        : "0"
      : "",
    IsSales: state?.data?.IsSales
      ? state?.data?.IsSalesStatus === "True"
        ? "1"
        : "0"
      : "",
    IsShowSpecialRate: state?.data?.ShowSpecialRate
      ? state?.data?.ShowSpecialRate === "True"
        ? "1"
        : "0"
      : "",
    isActive: state?.data?.ActiveStatus
      ? state?.data?.ActiveStatus === "True"
        ? "1"
        : "0"
      : "",
    DesignationID: state?.data?.DesignationID ? state?.data?.DesignationID : "",
  });

  console.log(formData);

  const { t } = useTranslation();

  const postData = () => {
    let generatedError = validationForDesignations(formData);
    if (generatedError === "") {
      setLoad(true);
      axios
        .post(state?.url, getTrimmedData(formData))
        .then((res) => {
          if (res.data.message) {
            navigate("/Designations");
            setLoad(false);
            toast.success(res.data.message);
          } else {
            toast.error("Something went wrong");
            setLoad(false);
          }
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoad(false);
        });
    } else {
      setErr(generatedError);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // console.log(type);
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };
  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("DesignationsCreate")}</h3>
        </div>

        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("Name")}:</label>
            <div className="col-sm-2">
              <Input
                className="select-input-box form-control input-sm"
                name="Name"
                placeholder={t("Name")}
                type="text"
                max={50}
                onChange={handleChange}
                value={formData?.Name}
              />
              <span
                className="golbal-Error"
                data-valmsg-for="DepartmentCode"
                data-valmsg-replace="true"
              >
                {err?.Name}
              </span>
            </div>
            <label className="col-sm-1">{t("Sequence No")}:</label>
            <div className="col-sm-2">
              <Input
                className="select-input-box form-control input-sm"
                id="SequenceNo"
                placeholder={t("Sequence No")}
                name="SequenceNo"
                max={11}
                type="number"
                onChange={handleChange}
                value={formData?.SequenceNo}
                onInput={(e) => number(e, 11)}
              />
              <span
                className="golbal-Error"
                data-valmsg-for="DepartmentCode"
                data-valmsg-replace="true"
              >
                {err?.SequenceNo}
              </span>
            </div>

            <div className="col-sm-1">
              <Input
                className="control-label mr-4"
                name="IsSales"
                type="checkbox"
                onChange={handleChange}
                checked={formData?.IsSales === "1" ? true : false}
              />
              <label className="control-label" htmlFor="IsSales">
                {t("Sales")}
              </label>
            </div>
            <div className="col-sm-2">
              <Input
                className="control-label mr-4"
                name="IsNewTestApprove"
                type="checkbox"
                onChange={handleChange}
                checked={formData?.IsNewTestApprove === "1" ? true : false}
              />
              <label className="control-label" htmlFor="IsNewTestApprove">
                {t("New Test Approve")}
              </label>
            </div>
            <div className="col-sm-2">
              <Input
                className="control-label mr-4"
                name="IsDirectApprove"
                type="checkbox"
                onChange={handleChange}
                checked={formData?.IsDirectApprove === "1" ? true : false}
              />
              <label className="control-label" htmlFor="IsDirectApprove">
                {t("Direct Approve")}
              </label>
            </div>
          </div>
          {/* Row End */}
          <div className="row">
            <div className="col-sm-2">
              <Input
                className="control-label mr-4"
                name="IsShowSpecialRate"
                type="checkbox"
                onChange={handleChange}
                checked={formData?.IsShowSpecialRate === "1" ? true : false}
              />
              <label className="control-label" htmlFor="IsShowSpecialRate">
                {t("Show Special Rate")}
              </label>
            </div>
            <div className="col-sm-1">
              <Input
                className="control-label"
                name="isActive"
                type="checkbox"
                checked={formData?.isActive === "1" ? true : false}
                onChange={handleChange}
              />
              <label className="control-label" htmlFor="isActive">
                {t("Active")}
              </label>
            </div>
            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button
                  type="submit"
                  className="btn btn-block btn-success btn-sm"
                  title="Create"
                  onClick={postData}
                >
                  {state?.other?.button ? state?.other?.button : t("Save")}
                </button>
              )}
            </div>
            <div className="col-sm-2">
              <Link to="/Designations" style={{ fontSize: "13px" }}>
                {t("Back to List")}
              </Link>
            </div>
          </div>
        </div>
        {/* Box End */}
      </div>
    </>
  );
};
export default DesignationsCreate;
