import React from "react";
import Input from "../ChildComponents/Input";
import { SelectBox } from "../ChildComponents/SelectBox";
import { SelectType } from "../ChildComponents/Constants";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { number } from "../Frontend/util/Commonservices/number";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";
import Loading from "../Frontend/util/Loading";
import {
  PreventSpecialCharacter,
  getTrimmedData,
  guidNumber,
} from "../Frontend/util/Commonservices";
import { useTranslation } from "react-i18next";
import { useFormik } from "formik";
import { CompanyMasterValidation } from "../ValidationSchema";
import UploadModal from "../Frontend/util/UploadModal";

const CompanyMaster = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [BillingType, setBillingType] = useState([]);
  const [GraceType, setGraceType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    CompanyId: "",
    CompanyCode: "",
    CompanyName: "",
    Country: "",
    State: "",
    City: "",
    Email: "",
    PhoneNo: "",
    Address1: "",
    Address2: "",
    Address3: "",
    isPrefixRequired: 0,
    companyGUID: guidNumber(),
    SelectType: "",
    GraceDays: 0,
    Mobile1: "",
    Mobile2: "",
    BillingType: "",
    IsShareRequired:0
  });

  const [showMobile2, setShowMobile2] = useState(false);
  const [show, setShow] = useState(false);

  const handleMobileFun = (type) => {
    if (type === "ADD") {
      setShowMobile2(true);
    } else {
      setShowMobile2(false);
    }
  };



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (["CompanyCode", "CompanyName"].includes(name)) {
      setPayload({
        ...payload,
        [name]: PreventSpecialCharacter(value)
          ? value.trim().toUpperCase()
          : payload[name],
      });
    } else if (name === "State" || name === "Country" || name === "City") {
      setPayload({
        ...payload,
        [name]: PreventSpecialCharacter(value) ? value.trim() : payload[name],
      });
    } else {
      setPayload({
        ...payload,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
      });
    }
  };

  const BindBillingDropDown = (value) => {
    if (value === "PostPaid") {
      getGlobalData("BillingType");
    } else if (value === "PrePaid") {
      setBillingType([]);
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
    BindBillingDropDown(value);
  };

  const getGlobalData = (name) => {
    axios
      .post("/api/v1/Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res?.data?.message;
        console.log(data);
        let value = data?.map((ele) => {
          return {
            value: ele?.FieldDisplay,
            label: ele?.FieldDisplay,
          };
        });
        switch (name) {
          case "BillingType":
            setBillingType(value);
            break;
          case "GraceType":
            setGraceType(value);
            break;
          default:
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  const fetch = (id) => {
    axios
      .post(state?.url, {
        CompanyId: id,
      })
      .then((res) => {
        const data = res?.data?.message[0];
        BindBillingDropDown(data?.SelectType);
        setPayload(data);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  useEffect(() => {
    if (state?.data) {
      fetch(state?.data);
    }
  }, []);

  const { values, errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: { ...payload },
    enableReinitialize: true,
    validationSchema: CompanyMasterValidation,
    onSubmit: (values) => {
      setLoading(true);
      axios
        .post(
          state?.url
            ? "/api/v1/CompanyMaster/UpdateCompanyMaster"
            : "/api/v1/CompanyMaster/SaveCompanyMaster",
          getTrimmedData(payload)
        )
        .then((res) => {
          if (res?.data?.message) {
            navigate(`/CompanyMasterList`);
            toast.success(res?.data?.message);
          }
          setLoading(false);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Wents Wrong."
          );
          setLoading(false);
        });
    },
  });

  const handleUpload = () => {
    setShow(true);
  };

  useEffect(() => {
    getGlobalData("GraceType");
  }, []);

  return (
    <>
      <div className="box box-success form-horizontal">
        <>
          {show && (
            <UploadModal
              show={show}
              handleClose={() => setShow(false)}
              documentId={payload?.companyGUID}
              pageName="CompanyMaster"
            />
          )}
        </>
        <div className="box-header with-border">
          <h3 className="box-title">{t("Company Master")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("Company Code")}:</label>
            <div className="col-sm-2 col-md-2">
              <Input
                className="select-input-box form-control input-sm"
                type="text"
                name="CompanyCode"
                value={payload?.CompanyCode}
                onChange={handleChange}
                onBlur={handleBlur}
                max={10}
                onInput={(e) => number(e, 10)}
              />
              {errors?.CompanyCode && touched?.CompanyCode && (
                <span className="golbal-Error">{errors?.CompanyCode}</span>
              )}
            </div>
            <label className="col-sm-1">{t("Company Name")}:</label>
            <div className="col-sm-2 col-md-2">
              <Input
                className="select-input-box form-control input-sm"
                type="text"
                name="CompanyName"
                value={payload?.CompanyName}
                onBlur={handleBlur}
                onChange={handleChange}
                max={60}
              />
              {errors?.CompanyName && touched?.CompanyName && (
                <span className="golbal-Error">{errors?.CompanyName}</span>
              )}
            </div>
            <label className="col-sm-1">{t("Country")}:</label>
            <div className="col-sm-2 col-md-2">
              <Input
                className="select-input-box form-control input-sm"
                onChange={handleChange}
                value={payload?.Country}
                name="Country"
                type="text"
                max={25}
              />
            </div>
            <label className="col-sm-1">{t("State")}:</label>
            <div className="col-sm-2 col-md-2">
              <Input
                className="select-input-box form-control input-sm"
                onChange={handleChange}
                value={payload?.State}
                name="State"
                type="text"
                max={25}
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1">{t("City")}:</label>
            <div className="col-sm-2 col-md-2">
              <Input
                className="select-input-box form-control input-sm"
                onChange={handleChange}
                value={payload?.City}
                name="City"
                type="text"
                max={25}
              />
            </div>
            <label className="col-sm-1">{t("Email")}:</label>
            <div className="col-sm-2 col-md-2">
              <Input
                className="select-input-box form-control input-sm"
                onChange={handleChange}
                value={payload?.Email}
                name="Email"
                type="email"
                max={50}
                onBlur={handleBlur}
                required
              />
              {errors?.Email && touched?.Email && (
                <span className="golbal-Error">{errors?.Email}</span>
              )}
            </div>
            <label className="col-sm-1">{t("Phone No")}:</label>
            <div className="col-sm-2 col-md-2">
              <Input
                className="select-input-box form-control input-sm"
                onInput={(e) => number(e, 10)}
                type="number"
                name="PhoneNo"
                value={payload?.PhoneNo}
                onChange={handleChange}
              />
            </div>
            <label className="col-sm-1">{t("Mobile No")}:</label>
            <div className="col-sm-2 col-md-2">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Input
                  onInput={(e) => number(e, 10)}
                  className="select-input-box form-control input-sm"
                  type="number"
                  name="Mobile1"
                  value={payload?.Mobile1}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <div className="input-group-append">
                  <button
                    className="btn-primary btn-sm"
                    type="button"
                    onClick={() => handleMobileFun("ADD")}
                  >
                    <i className={`fa fa-plus-circle fa-sm`}></i>
                  </button>
                </div>
              </div>
              {errors?.Mobile1 && touched?.Mobile1 && (
                <span className="golbal-Error">{errors?.Mobile1}</span>
              )}
              {showMobile2 && (
                <div
                  style={{
                    marginTop: "1px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Input
                    onInput={(e) => number(e, 10)}
                    className="select-input-box form-control input-sm"
                    type="number"
                    name="Mobile2"
                    value={payload?.Mobile2}
                    onChange={handleChange}
                  />
                  <div className="input-group-append">
                    <button
                      className="btn-primary btn-sm"
                      type="button"
                      onClick={() => handleMobileFun("DELETE")}
                    >
                      <i className={`fa fa-minus-circle fa-sm`}></i>
                    </button>
                  </div>
                </div>
              )}
              <div>
                {errors?.Mobile2 && touched?.Mobile2 && (
                  <span className="golbal-Error">{errors?.Mobile2}</span>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1">{t("Address1")}:</label>
            <div className="col-sm-2 col-md-2">
              <Input
                className="select-input-box form-control input-sm"
                onChange={handleChange}
                value={payload?.Address1}
                name="Address1"
                type="text"
                max={50}
              />
            </div>
            <label className="col-sm-1">{t("Address2")}:</label>
            <div className="col-sm-2 col-md-2">
              <Input
                className="select-input-box form-control input-sm"
                onChange={handleChange}
                value={payload?.Address2}
                name="Address2"
                type="text"
                max={50}
              />
            </div>
            <label className="col-sm-1">{t("Address3")}:</label>
            <div className="col-sm-2 col-md-2">
              <Input
                className="select-input-box form-control input-sm"
                onChange={handleChange}
                value={payload?.Address3}
                name="Address3"
                type="text"
                max={50}
              />
            </div>
            <label className="col-sm-1">{t("SelectType")}:</label>
            <div className="col-sm-2">
              <SelectBox
                options={SelectType}
                name="SelectType"
                selectedValue={payload?.SelectType}
                onChange={handleSelectChange}
              />
            </div>
          </div>

          <div className="row">
            <label className="col-sm-1">{t("Grace Days")}:</label>
            <div className="col-sm-2">
              <SelectBox
                options={GraceType}
                name="GraceDays"
                selectedValue={payload?.GraceDays}
                onChange={handleSelectChange}
              />
            </div>
            {BillingType.length > 0 && (
              <>
                <label className="col-sm-1">{t("BillingType")}:</label>
                <div className="col-sm-2">
                  <SelectBox
                    name="BillingType"
                    options={BillingType}
                    selectedValue={payload?.BillingType}
                    onChange={handleSelectChange}
                  />
                </div>
              </>
            )}

            <label className="col-sm-1">{t("Upload image")}:</label>
            <div className="col-sm-2">
              <button
                className="btn btn-sm btn-success"
                onClick={() => handleUpload()}
              >
                Upload
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2">
              <Input
                type="checkbox"
                name="isPrefixRequired"
                onChange={handleChange}
                checked={payload?.isPrefixRequired}
              />
              <label className="control-label">{t("isPrefixRequired")}</label>
            </div>

            <div className="col-sm-2">
              <Input
                type="checkbox"
                name="IsShareRequired"
                onChange={handleChange}
                checked={payload?.IsShareRequired}
              />
              <label className="control-label">{t("IsShareRequired")}</label>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-1">
              {loading ? (
                <Loading />
              ) : (
                <>
                  <button
                    className="btn btn-block btn-sm btn-success"
                    onClick={handleSubmit}
                    type="submit"
                  >
                    {state?.other?.button ? state?.other?.button : t("Save")}
                  </button>
                </>
              )}
            </div>
            <div className="col-sm-2">
              <Link to={`/CompanyMasterList`} style={{ fontSize: "13px" }}>
                {t("Back to List")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyMaster;
