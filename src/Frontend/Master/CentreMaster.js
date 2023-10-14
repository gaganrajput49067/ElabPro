import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  GraceTime,
  LoginAllowed,
  PaymentMode,
} from "../../ChildComponents/Constants";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  PreventNumber,
  PreventSpecialCharacter,
  getTrimmedData,
  guidNumber,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import { number } from "../../Frontend/util/Commonservices/number";
import Loading from "../../Frontend/util/Loading";
import {
  CenterMasterValidationSchema,
  RateMasterValidationSchema,
} from "../../ValidationSchema";
import UploadModal from "../../Frontend/util/UploadModal";
// for i18n by rahul start
import { useTranslation } from "react-i18next";
// for i18n by rahul end

const CentreMaster = () => {
  const { name } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const [Invoice, setInvoice] = useState([]);
  const [load, setLoad] = useState(false);
  const [show, setShow] = useState(false);
  const [ProcessingLab, setProcessingLab] = useState([]);
  const [ReferenceRate, setReferenceRate] = useState([]);
  const [BarCodeLogic, setBarCodeLogic] = useState([]);
  const [VisitType, setVisitType] = useState([]);
  const [BusinessUnit, setBusinessUnit] = useState([]);
  const [CentreType, setCentreType] = useState([]);
      // i18n by rahul start
         
      const { t } = useTranslation();
        
  // Centre RateType ,rate=Processing Lab
  const [formData, setFormData] = useState({
    DataType: state?.data?.DataType ? state?.data?.DataType : "",
    CentreCode: state?.data?.CentreCode ? state?.data?.CentreCode : "",
    Centre: state?.data?.Centre ? state?.data?.Centre : "",
    CentreType: state?.data?.CentreType ? state?.data?.CentreType : "",
    InvoiceTo: state?.data?.InvoiceTo ? state?.data?.InvoiceTo : "",
    BusinessUnit: state?.data?.BusinessUnit ? state?.data?.BusinessUnit : "",
    ProcessingLab: state?.data?.ProcessingLab ? state?.data?.ProcessingLab : "",
    ReferenceRate: state?.data?.ReferenceRate ? state?.data?.ReferenceRate : "",
    Address1: state?.data?.Address1 ? state?.data?.Address1 : "",
    Address2: state?.data?.Address2 ? state?.data?.Address2 : "",
    City: state?.data?.City ? state?.data?.City : "",
    BusinessZone: state?.data?.BusinessZone ? state?.data?.BusinessZone : "",
    State: state?.data?.State ? state?.data?.State : "",
    Country: state?.data?.Country ? state?.data?.Country : "",
    Pincode: state?.data?.Pincode ? state?.data?.Pincode : "",
    Email: state?.data?.Email ? state?.data?.Email : "",
    LandLineNo: state?.data?.LandLineNo ? state?.data?.LandLineNo : "",
    Phone: state?.data?.Phone ? state?.data?.Phone : "",
    StateCode: state?.data?.StateCode ? state?.data?.StateCode : "",
    Fax: state?.data?.Fax ? state?.data?.Fax : "",
    Url: state?.data?.Url ? state?.data?.Url : "",
    PaymentMode: state?.data?.PaymentMode ? state?.data?.PaymentMode : "",
    VisitType: state?.data?.VisitType ? state?.data?.VisitType : "",
    BarcodeLogic: state?.data?.BarcodeLogic ? state?.data?.BarcodeLogic : "",
    SampleCollectandReceive: state?.data?.SampleCollectandReceive
      ? state?.data?.SampleCollectandReceive
      : "",
    CityZone: state?.data?.CityZone ? state?.data?.CityZone : "",
    ReferenceRate1: state?.data?.ReferenceRate1
      ? state?.data?.ReferenceRate1
      : "",
    ReferenceRate2: state?.data?.ReferenceRate2
      ? state?.data?.ReferenceRate2
      : "",
    IsTrfRequired: state?.data?.IsTrfRequired ? state?.data?.IsTrfRequired : "",
    isActive: state?.data?.isActive ? state?.data?.isActive : "1",
    CentreID: state?.data?.CentreID ? state?.data?.CentreID : "0",
    UserName: state?.data?.Username ? state?.data?.Username : "",
    Password: state?.data?.Password ? state?.data?.Password : "",
    isAllowedLogin: state?.data?.IsAllowedLogin
      ? state?.data?.IsAllowedLogin
      : "0",
    userLoginID: state?.data?.userLoginID ? state?.data?.userLoginID : "0",
    centreIDHash: "",
  });

  useEffect(() => {
    if (name === "center") {
      setFormData({
        CentreID: state?.data?.CentreID ? state?.data?.CentreID : "",
        DataType: state?.data?.DataType ? state?.data?.DataType : "Centre",
        CentreCode: state?.data?.CentreCode ? state?.data?.CentreCode : "",
        Centre: state?.data?.Centre ? state?.data?.Centre : "",
        CentreType: state?.data?.CentreType
          ? state?.data?.CentreType
          : "Booking",
        InvoiceTo: state?.data?.InvoiceTo ? state?.data?.InvoiceTo : 0,
        BusinessUnit: state?.data?.BusinessUnit ? state?.data?.BusinessUnit : 0,
        ProcessingLab: state?.data?.ProcessingLab
          ? state?.data?.ProcessingLab
          : 0,
        ReferenceRate: state?.data?.ReferenceRate
          ? state?.data?.ReferenceRate
          : 0,
        Address1: state?.data?.Address1 ? state?.data?.Address1 : "",
        Address2: state?.data?.Address2 ? state?.data?.Address2 : "",
        City: state?.data?.City ? state?.data?.City : "",
        BusinessZone: state?.data?.BusinessZone
          ? state?.data?.BusinessZone
          : "",
        State: state?.data?.State ? state?.data?.State : "",
        Country: state?.data?.Country ? state?.data?.Country : "",
        Pincode: state?.data?.Pincode ? state?.data?.Pincode : "",
        Email: state?.data?.Email ? state?.data?.Email : "",
        LandLineNo: state?.data?.LandLineNo ? state?.data?.LandLineNo : "",
        Phone: state?.data?.Phone ? state?.data?.Phone : "",
        StateCode: state?.data?.StateCode ? state?.data?.StateCode : "",
        Fax: state?.data?.Fax ? state?.data?.Fax : "",
        Url: state?.data?.Url ? state?.data?.Url : "",
        PaymentMode: state?.data?.PaymentMode
          ? state?.data?.PaymentMode
          : "Cash",
        VisitType: state?.data?.VisitType ? state?.data?.VisitType : "1",
        BarcodeLogic: state?.data?.BarcodeLogic ? state?.data?.BarcodeLogic : 1,
        SampleCollectandReceive: state?.data?.SampleCollectandReceive
          ? state?.data?.SampleCollectandReceive
          : "",
        CityZone: state?.data?.CityZone ? state?.data?.CityZone : "",
        ReferenceRate1: state?.data?.ReferenceRate1
          ? state?.data?.ReferenceRate1
          : 0,
        ReferenceRate2: state?.data?.ReferenceRate2
          ? state?.data?.ReferenceRate2
          : 0,
        IsTrfRequired: state?.data?.IsTrfRequired
          ? state?.data?.IsTrfRequired
          : "",
        isActive: state?.data ? state?.data?.isActive : "1",
        CentreID: state?.data?.CentreID ? state?.data?.CentreID : "0",
        UserName: state?.data?.Username ? state?.data?.Username : "",
        Password: state?.data?.Password ? state?.data?.Password : "",
        isAllowedLogin: state?.data?.IsAllowedLogin
          ? state?.data?.IsAllowedLogin
          : "0",
        userLoginID: state?.data?.userLoginID ? state?.data?.userLoginID : "0",
        centreIDHash: state?.data?.centreIDHash
          ? state?.data?.centreIDHash
          : guidNumber(),
      });
    } else if (name === "Rate") {
      setFormData({
        CentreID: state?.data?.CentreID ? state?.data?.CentreID : "",
        DataType: state?.data?.DataType ? state?.data?.DataType : "RateType",
        CentreCode: state?.data?.CentreCode ? state?.data?.CentreCode : "",
        Centre: state?.data?.Centre ? state?.data?.Centre : "",
        CentreType: state?.data?.CentreType ? state?.data?.CentreType : "",
        InvoiceTo: state?.data?.InvoiceTo ? state?.data?.InvoiceTo : 0,
        BusinessUnit: state?.data?.BusinessUnit ? state?.data?.BusinessUnit : 0,
        ProcessingLab: state?.data?.ProcessingLab
          ? state?.data?.ProcessingLab
          : 0,
        ReferenceRate: state?.data?.ReferenceRate
          ? state?.data?.ReferenceRate
          : 0,
        Address1: state?.data?.Address1 ? state?.data?.Address1 : "",
        Address2: state?.data?.Address2 ? state?.data?.Address2 : "",
        City: state?.data?.City ? state?.data?.City : "",
        BusinessZone: state?.data?.BusinessZone
          ? state?.data?.BusinessZone
          : "",
        State: state?.data?.State ? state?.data?.State : "",
        Country: state?.data?.Country ? state?.data?.Country : "",
        Pincode: state?.data?.Pincode ? state?.data?.Pincode : "",
        Email: state?.data?.Email ? state?.data?.Email : "",
        LandLineNo: state?.data?.LandLineNo ? state?.data?.LandLineNo : "",
        Phone: state?.data?.Phone ? state?.data?.Phone : "",
        StateCode: state?.data?.StateCode ? state?.data?.StateCode : "",
        Fax: state?.data?.Fax ? state?.data?.Fax : "",
        Url: state?.data?.Url ? state?.data?.Url : "",
        PaymentMode: state?.data?.PaymentMode
          ? state?.data?.PaymentMode
          : "Cash",
        VisitType: state?.data?.VisitType ? state?.data?.VisitType : "1",
        BarcodeLogic: state?.data?.BarcodeLogic ? state?.data?.BarcodeLogic : 1,
        SampleCollectandReceive: state?.data?.SampleCollectandReceive
          ? state?.data?.SampleCollectandReceive
          : "",
        CityZone: state?.data?.CityZone ? state?.data?.CityZone : "",
        ReferenceRate1: state?.data?.ReferenceRate1
          ? state?.data?.ReferenceRate1
          : 0,
        ReferenceRate2: state?.data?.ReferenceRate2
          ? state?.data?.ReferenceRate2
          : 0,
        IsTrfRequired: state?.data?.IsTrfRequired
          ? state?.data?.IsTrfRequired
          : "",
        isActive: state?.data ? state?.data?.isActive : "1",
        CentreID: state?.data?.CentreID ? state?.data?.CentreID : "0",
        UserName: state?.data?.Username ? state?.data?.Username : "",
        Password: state?.data?.Password ? state?.data?.Password : "",
        isAllowedLogin: state?.data?.IsAllowedLogin
          ? state?.data?.IsAllowedLogin
          : "0",
        userLoginID: state?.data?.userLoginID ? state?.data?.userLoginID : "0",
        centreIDHash: state?.data?.centreIDHash
          ? state?.data?.centreIDHash
          : guidNumber(),

        CreditLimit: state?.data?.CreditLimit ? state?.data?.CreditLimit : "",
        SecurityAmount: state?.data?.SecurityAmount
          ? state?.data?.SecurityAmount
          : "",
        LockRegistration: state?.data?.LockRegistration
          ? state?.data?.LockRegistration
          : 0,
        LockReport: state?.data?.LockReport ? state?.data?.LockReport : 0,
        GraceTime: state?.data?.GraceTime ? state?.data?.GraceTime : "",
      });
    }
  }, [name]);

  const getInvoiceTo = () => {
    axios
      .get("/api/v1/Centre/CentreInvoiceToList")
      .then((res) => {
        let data = res.data.message;
        let InvoiceData = data.map((ele) => {
          return {
            value: ele.InvoiceID,
            label: ele.Invoice,
          };
        });
        InvoiceData.unshift({ label: "Self", value: "0" });
        setInvoice(InvoiceData);
      })
      .catch((err) => console.log(err));
  };
  const getCentreBusinessUnit = () => {
    axios
      .get("/api/v1/Centre/CentreBusinessUnit")
      .then((res) => {
        let data = res.data.message;
        let CentreBusinessUnit = data.map((ele) => {
          return {
            value: ele.BusinessUnitID,
            label: ele.BusinessUnit,
          };
        });
        CentreBusinessUnit.unshift({ label: "Self", value: "0" });
        setBusinessUnit(CentreBusinessUnit);
      })
      .catch((err) => console.log(err));
  };
  const getCentreProcessingLab = () => {
    axios
      .get("/api/v1/Centre/CentreProcessingLab")
      .then((res) => {
        let data = res.data.message;
        let CentreLab = data.map((ele) => {
          return {
            value: ele.ProcessingLabID,
            label: ele.ProcessingLab,
          };
        });
        CentreLab.unshift({ label: "Self", value: "0" });
        setProcessingLab(CentreLab);
      })
      .catch((err) => console.log(err));
  };

  const handleCheckDuplicate = () => {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/v1/Centre/checkDuplicateCentreCode", {
          CentreCode: formData?.CentreCode,
          CentreID: formData?.CentreID != 0 ? formData?.CentreID : "",
        })
        .then((res) => {
          if (res?.data?.message === "Duplicate CentreCode.") {
            toast.error(res?.data?.message);
            setFormData({ ...formData, CentreCode: "" });
          }
          resolve(res?.data?.message);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          reject(err);
        });
    });
  };
  const getReferenceRate = () => {
    axios
      .get("/api/v1/Centre/CentreReferRateList")
      .then((res) => {
        let data = res.data.message;
        let CentreReferRate = data.map((ele) => {
          return {
            value: ele.ReferenceRateID,
            label: ele.ReferenceRate,
          };
        });
        CentreReferRate.unshift({ label: "Self", value: "0" });
        setReferenceRate(CentreReferRate);
      })
      .catch((err) => console.log(err));
  };

  const getVisitTypeList = () => {
    axios
      .get("/api/v1/Centre/visitTypeList")
      .then((res) => {
        let data = res.data.message;
        let VisitTypeList = data.map((ele) => {
          return {
            value: ele.FieldID,
            label: ele.FieldDisplay,
          };
        });
        setVisitType(VisitTypeList);
      })
      .catch((err) => console.log(err));
  };
  const getBarCodeLogic = () => {
    axios
      .get("/api/v1/Centre/BarcodeLogicList")
      .then((res) => {
        let data = res.data.message;
        let Barcode = data.map((ele) => {
          return {
            value: ele.BarcodeID,
            label: ele.BarcodeDisplay,
          };
        });
        setBarCodeLogic(Barcode);
      })
      .catch((err) => console.log(err));
  };

  const getDropDownData = (name) => {
    axios
      .post("/api/v1/Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        switch (name) {
          case "CentreType":
            setCentreType(value);
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  const { errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: formData,
    enableReinitialize: state?.url ? true : true,
    validationSchema:
      name === "center"
        ? CenterMasterValidationSchema
        : RateMasterValidationSchema,
    onSubmit: (values) => {
      if ([1, 2, 3, 4, 5].includes(formData?.Pincode.length)) {
        toast.error("Please Enter Correct Pin Code");
      } else {
        setLoad(true);
        handleCheckDuplicate().then((res) => {
          if (res === "Duplicate CentreCode.") {
          } else {
            axios
              .post(
                state?.url ? state?.url : "/api/v1/Centre/InsertCentre",
                getTrimmedData(values)
              )
              .then((res) => {
                if (res.data.message) {
                  navigate(`/CentreMasterList/${name}`);
                  toast.success(res.data.message);
                  setLoad(false);
                } else {
                  toast.error("Something went wrong");
                  toast.success(res.data.message);
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
          }
        });
      }
    },
  });

  //   handleCheckDuplicate().then((res) => {
  //     if (res === "Duplicate CentreCode.") {
  //     } else {
  //       setLoad(true);
  //       axios
  //         .post(
  //           state?.url ? state?.url : "/api/v1/Centre/InsertCentre",
  //           getTrimmedData(formData)
  //         )
  //         .then((res) => {
  //           if (
  //             res.data.message === "This record Insert Successfully." ||
  //             res.data.message === "This record Updated Successfully."
  //           ) {
  //             navigate(`/CentreMasterList/${name}`);
  //             toast.success(res.data.message);
  //             setLoad(false);
  //           } else {
  //             toast.success(res.data.message);
  //             setLoad(false);
  //           }
  //         })
  //         .catch((err) => {
  //           toast.error(err?.response?.data?.message);
  //           if (err?.response?.status === 504) {
  //             toast.error("Something went wrong");
  //           }
  //           setLoad(false);
  //         });
  //     }
  //   });
  // };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const reg = /^([^0-9$%]*)$/;
    if (name === "CentreCode") {
      setFormData({
        ...formData,
        [name]: ["CentreCode"].includes(name)
          ? PreventSpecialCharacter(value)
            ? value.toUpperCase()
            : formData[name]
          : value.toUpperCase(),
      });
    } else {
      setFormData({
        ...formData,
        [name]:
          type === "checkbox"
            ? checked
              ? 1
              : 0
            : [
                "City",
                "Centre",
                "State",
                "Country",
                "CityZone",
                "BusinessZone",
              ].includes(name)
            ? PreventNumber(value)
              ? value
              : formData[name]
            : [""].includes(name)
            ? PreventSpecialCharacter(value)
              ? value
              : formData[name]
            : value,
      });
    }
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    getInvoiceTo();
    getCentreProcessingLab();
    getReferenceRate();
    getBarCodeLogic();
    getVisitTypeList();
    getCentreBusinessUnit();
    getDropDownData("CentreType");
  }, []);

  return (
    <>
      <div className="box box-success form-horizontal">
        {show && (
          <UploadModal
            show={show}
            handleClose={() => setShow(false)}
            documentId={formData?.centreIDHash}
            pageName={name === t("center") ? t("CentreMaster") : t("RateTypeMaster")}
          />
        )}

        {/* /////////////////////////////////////////////////////// */}

        <div className="box-header with-border">
          <span className="box-title">
            {name === t("center") ? t("CentreMaster") : t("RateTypeMaster")}
          </span>

          <div className="box-body">
            <div className="row">
              {name === "center" && (
                <label className="col-sm-1" htmlFor="inputEmail3">
                 {t("Type")} 
                </label>
              )}
              {name === "center" ? (
                <div className="col-sm-2 col-md-2">
                  <SelectBox
                    options={CentreType}
                    onChange={handleSelectChange}
                    name="CentreType"
                    selectedValue={formData?.CentreType}
                    isDisabled={state?.data?.CentreType ? true : false}
                  />
                </div>
              ) : (
                //   <label className="col-sm-1" htmlFor="inputEmail3">
                //   Type:
                // </label>
                // <div className="col-sm-2 col-md-2">
                //   <SelectBox
                //     options={CentreType}
                //     onChange={handleSelectChange}
                //     name="CentreType"
                //     selectedValue={formData?.CentreType}
                //     isDisabled={state?.data?.CentreType ? true : false}
                //   />
                // </div>
                //
                ""
              )}

              <label className="col-sm-1" htmlFor="inputEmail3">
               {t("Code")} 
              </label>
              <div className="col-sm-2 col-md-2">
                <input
                  className="select-input-box form-control input-sm"
                  max={10}
                  onChange={handleChange}
                  value={formData?.CentreCode}
                  name="CentreCode"
                  onBlur={() => {
                    handleCheckDuplicate();
                  }}
                  onInput={(e) => number(e, 10)}
                />
                {errors?.CentreCode && touched?.CentreCode && (
                  <div className="golbal-Error">{errors?.CentreCode}</div>
                )}
              </div>

              <label className="col-sm-1" htmlFor="inputEmail3">
                {t("Name")}
              </label>
              <div className="col-sm-2 col-md-2">
                <Input
                  className="select-input-box form-control input-sm"
                  onChange={handleChange}
                  max={60}
                  value={formData?.Centre}
                  name="Centre"
                  onBlur={handleBlur}
                  type="text"
                />
                {errors?.Centre && touched?.Centre && (
                  <div className="golbal-Error">{errors?.Centre}</div>
                )}
              </div>

              {name === "Rate" && (
                <>
                  <label className="col-sm-1" htmlFor="inputEmail3">
                   {t("Grace Time")}: 
                  </label>
                  <div className="col-sm-2 col-md-2 ">
                    <SelectBox
                      name="GraceTime"
                      selectedValue={formData?.GraceTime}
                      options={GraceTime}
                      onChange={handleSelectChange}
                    />
                    {errors?.GraceTime && touched?.GraceTime && (
                      <div className="golbal-Error">{errors?.GraceTime}</div>
                    )}
                  </div>
                </>
              )}

              <label className="col-sm-1" htmlFor="inputEmail3">
               {t("Address1")}: 
              </label>
              <div className="col-sm-2 col-md-2">
                <Input
                  className="select-input-box form-control input-sm"
                  onChange={handleChange}
                  value={formData?.Address1}
                  name="Address1"
                  type="text"
                  max={50}
                />
              </div>
            </div>

            <div className="row">
              <label className="col-sm-1" htmlFor="inputEmail3">
               {t("Address2")}:
              </label>
              <div className="col-sm-2 col-md-2">
                <Input
                  className="select-input-box form-control input-sm"
                  onChange={handleChange}
                  value={formData?.Address2}
                  name="Address2"
                  max={50}
                  min={4}
                />
              </div>

              <label className="col-sm-1" htmlFor="inputEmail3">
                {t("PinCode")}
              </label>
              <div className="col-sm-2 col-md-2">
                <Input
                  className="select-input-box form-control input-sm"
                  onInput={(e) => number(e, 6)}
                  type="number"
                  onChange={handleChange}
                  value={formData?.Pincode}
                  name="Pincode"
                />
              </div>
              <label className="col-sm-1" htmlFor="inputEmail3">
                {t("City")}:
              </label>
              <div className="col-sm-2 col-md-2">
                <Input
                  className="select-input-box form-control input-sm"
                  onChange={handleChange}
                  value={formData?.City}
                  name="City"
                  type="text"
                  max={25}
                />
              </div>

              <label className="col-sm-1" htmlFor="inputEmail3">
               {t("State")}:
              </label>
              <div className="col-sm-2 col-md-2">
                <Input
                  className="select-input-box form-control input-sm"
                  onChange={handleChange}
                  value={formData?.State}
                  name="State"
                  type="text"
                  max={25}
                />
              </div>
            </div>

            <div className="row">
              <label className="col-sm-1" htmlFor="inputEmail3">
                {t("Country")}:
              </label>
              <div className="col-sm-2 col-md-2">
                <Input
                  className="select-input-box form-control input-sm"
                  onChange={handleChange}
                  value={formData?.Country}
                  name="Country"
                  type="text"
                  max={25}
                />
              </div>
              <label className="col-sm-1" htmlFor="inputEmail3">
               {t("CityZone")}:
              </label>
              <div className="col-sm-2 col-md-2">
                <Input
                  className="select-input-box form-control input-sm"
                  onChange={handleChange}
                  value={formData?.CityZone}
                  name="CityZone"
                  type="text"
                  max={25}
                />
              </div>
              <label className="col-sm-1" htmlFor="inputEmail3">
               {t("Email")}:
              </label>
              <div className="col-sm-2 col-md-2">
                <Input
                  className="select-input-box form-control input-sm mt-2"
                  onChange={handleChange}
                  value={formData?.Email}
                  name="Email"
                  type="email"
                  max={50}
                />
              </div>
              <label className="col-sm-1" htmlFor="inputEmail3">
                {t("Phone")}:
              </label>
              <div className="col-sm-2 col-md-2 ">
                <Input
                  className="select-input-box form-control input-sm"
                  onInput={(e) => number(e, 15)}
                  type="number"
                  onChange={handleChange}
                  value={formData?.Phone}
                  name="Phone"
                />
              </div>
            </div>

            <div className="row">
              <label className="col-sm-1" htmlFor="inputEmail3">
              {t("LandLineNo")}:
              </label>
              <div className="col-sm-2 col-md-2">
                <Input
                  className="select-input-box form-control input-sm"
                  onInput={(e) => number(e, 20)}
                  type="number"
                  onChange={handleChange}
                  value={formData?.LandLineNo}
                  name="LandLineNo"
                />
              </div>

              <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Website")}:
              </label>
              <div className="col-sm-2 col-md-2">
                <Input
                  className="select-input-box form-control input-sm"
                  onChange={handleChange}
                  name="Url"
                  value={formData?.Url}
                  type="text"
                  max={50}
                />
              </div>

              <label className="col-sm-1" htmlFor="inputEmail3">
                {t("BusinessZone")}:
              </label>
              <div className="col-sm-2 col-md-2">
                <Input
                  className="select-input-box form-control input-sm"
                  onChange={handleChange}
                  value={formData?.BusinessZone}
                  name="BusinessZone"
                  type="text"
                  max={25}
                />
              </div>

              <label className="col-sm-1" htmlFor="inputEmail3">
                {t("StateCode")}:
              </label>
              <div className="col-sm-2 col-md-2 ">
                <Input
                  className="select-input-box form-control input-sm"
                  onChange={handleChange}
                  value={formData?.StateCode}
                  name="StateCode"
                  type="number"
                  onInput={(e) => number(e, 2)}
                />
              </div>
            </div>

            <div className="row">
              <label className="col-sm-1" htmlFor="inputEmail3">
                {t("Fax")}:
              </label>
              <div className="col-sm-2 col-md-2 ">
                <Input
                  className="select-input-box form-control input-sm"
                  onChange={handleChange}
                  value={formData?.Fax}
                  name="Fax"
                  type="text"
                  onInput={(e) => number(e, 20)}
                />
              </div>

              <label className="col-sm-1" htmlFor="inputEmail3">
               {t("PaymentMode")}:
              </label>
              <div className="col-sm-2 col-md-2 ">
                <SelectBox
                  options={PaymentMode}
                  name="PaymentMode"
                  selectedValue={formData?.PaymentMode}
                  onChange={handleSelectChange}
                />
              </div>

              <label className="col-sm-1" htmlFor="inputEmail3">
                {t("VisitType")}:
              </label>
              <div className="col-sm-2 col-md-2 ">
                <SelectBox
                  options={VisitType}
                  name="VisitType"
                  selectedValue={formData?.VisitType}
                  onChange={handleSelectChange}
                />
              </div>

              {name === "Rate" && (
                <>
                  <label className="col-sm-1" htmlFor="inputEmail3">
                   {t("Credit Limit")}:
                  </label>

                  <div className="col-sm-2 col-md-2 ">
                    <Input
                      className="input-sm form-control"
                      type="number"
                      value={formData?.CreditLimit}
                      name="CreditLimit"
                      onChange={handleChange}
                      onInput={(e) => number(e, 30)}
                    />
                  </div>
                </>
              )}
            </div>

            <div className="row">
              {name === "Rate" && (
                <>
                  <label className="col-sm-1" htmlFor="inputEmail3">
                   {t("Security Amount")}:
                  </label>
                  <div className="col-sm-2 col-md-2 ">
                    <Input
                      className="input-sm form-control"
                      type="number"
                      value={formData?.SecurityAmount}
                      name="SecurityAmount"
                      onChange={handleChange}
                      onInput={(e) => number(e, 30)}
                    />
                  </div>
                </>
              )}

              {name === "Rate" && (
                <>
                  <label className="col-sm-1" htmlFor="inputEmail3">
                   {t("Lock Registration")}:
                  </label>
                  <div className="col-sm-2">
                    <Input
                      type="checkbox"
                      name="LockRegistration"
                      checked={formData?.LockRegistration === 0 ? false : true}
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}
              {name === "Rate" && (
                <>
                  <label className="col-sm-1" htmlFor="inputEmail3">
                   {t("Lock Report")}:
                  </label>
                  <div className="col-sm-2">
                    <Input
                      type="checkbox"
                      name="LockReport"
                      checked={formData?.LockReport === 0 ? false : true}
                      onChange={handleChange}
                      onInput={(e) => number(e, 30)}
                    />
                  </div>
                </>
              )}

              {/* <label className="col-sm-1" htmlFor="inputEmail3">
                  VisitType:
                </label>
                <div className="col-sm-2 col-md-2 ">
                  <SelectBox
                    options={VisitType}
                    name="VisitType"
                    selectedValue={formData?.VisitType}
                    onChange={handleSelectChange}
                  />
                </div> */}
            </div>
          </div>
        </div>

        {/* ////////////////////////////////////////////   */}
        <div className="box">
          <div className="box-header with-border">
            <h3 className="box-title">{t("Billing Details")}</h3>
          </div>
          <div className="box-body">
            <div className="row">
              <label className="col-sm-1" htmlFor="inputEmail3">
               {t("InvoiceTo")}:
              </label>
              {name === "center" ? (
                <div className="col-sm-2 col-md-2 ">
                  <SelectBox
                    options={Invoice}
                    name="InvoiceTo"
                    selectedValue={formData?.InvoiceTo}
                    onChange={handleSelectChange}
                  />
                </div>
              ) : (
                <div className="col-sm-2 col-md-2 ">
                  <SelectBox
                    options={Invoice}
                    name="InvoiceTo"
                    selectedValue={formData?.InvoiceTo}
                    onChange={handleSelectChange}
                  />
                </div>
              )}

              <label className="col-sm-1" htmlFor="inputEmail3">
               {t("BusinessUnit")}:
              </label>
              <div className="col-sm-2 col-md-2 ">
                <SelectBox
                  options={BusinessUnit}
                  selectedValue={formData?.BusinessUnit}
                  name="BusinessUnit"
                  onChange={handleSelectChange}
                />
              </div>

              <label className="col-sm-1" htmlFor="inputEmail3">
               {t("TagProcessingLab")}:
              </label>
              <div className="col-sm-2 col-md-2 ">
                <SelectBox
                  options={ProcessingLab}
                  name="ProcessingLab"
                  selectedValue={formData?.ProcessingLab}
                  onChange={handleSelectChange}
                />
              </div>
              <label className="col-sm-1" htmlFor="inputEmail3">
                {t("Rate Type")}:
              </label>
              <div className="col-sm-2 col-md-2 ">
                <SelectBox
                  options={ReferenceRate}
                  name="ReferenceRate"
                  selectedValue={formData?.ReferenceRate}
                  onChange={handleSelectChange}
                />
              </div>
            </div>

            <div className="row">
              <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Rate Type1")}:
              </label>
              <div className="col-sm-2 col-md-2">
                <SelectBox
                  options={ReferenceRate}
                  name="ReferenceRate1"
                  selectedValue={formData?.ReferenceRate1}
                  onChange={handleSelectChange}
                />
              </div>

              <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Rate Type2")}:
              </label>
              <div className="col-sm-2 col-md-2">
                <SelectBox
                  options={ReferenceRate}
                  name="ReferenceRate2"
                  selectedValue={formData?.ReferenceRate2}
                  onChange={handleSelectChange}
                />
              </div>

              {name === "center" && (
                <>
                  <label className="col-sm-1" htmlFor="inputEmail3">
                   {t("BarcodeLogic")}:
                  </label>
                  <div className="col-sm-2 col-md-2">
                    <SelectBox
                      options={BarCodeLogic}
                      name="BarcodeLogic"
                      selectedValue={formData?.BarcodeLogic}
                      onChange={handleSelectChange}
                    />
                  </div>
                </>
              )}

              <div
                className="col-sm-2 col-md-2"
                style={{ alignSelf: "flex-end" }}
              >
                <button
                  className="btn btn-success btn-sm btn-block"
                  onClick={() => {
                    setShow(true);
                  }}
                >
                  {t("Upload Document")}
                </button>
              </div>
            </div>
          </div>

          <div className="box">
            {/* {name === "Rate" ? (
              <div className="box-header with-border">
                <h6 className="box-title">{t("Login Details")}</h6>
                <div className="box-body">
                  <div className="row">
                    <label className="col-sm-1" htmlFor="inputEmail3">
                     {t("LoginAllowed")}:
                    </label>
                    <div className="col-sm-2 col-md-2">
                      <SelectBox
                        options={LoginAllowed}
                        name="isAllowedLogin"
                        selectedValue={selectedValueCheck(
                          LoginAllowed,
                          formData?.isAllowedLogin
                        )}
                        onChange={handleSelectChange}
                      />
                    </div>

                    <label className="col-sm-1" htmlFor="inputEmail3">
                     {t("UserName")}:
                    </label>
                    <div className="col-sm-2 col-md-2">
                      <Input
                        className="select-input-box form-control input-sm"
                        max={20}
                        name="UserName"
                        type="text"
                        placeholder={t("UserName")}
                        onChange={handleChange}
                        value={formData?.UserName}
                        onBlur={handleBlur}
                      />
                      {errors?.UserName && touched?.UserName && (
                        <div className="golbal-Error">{errors?.UserName}</div>
                      )}
                    </div>

                    <label className="col-sm-1" htmlFor="inputEmail3">
                      {t("Password")}:
                    </label>
                    <div className="col-sm-2 col-md-2">
                      <Input
                        className="select-input-box form-control input-sm"
                        name="Password"
                        type="password"
                        max={12}
                        placeholder={t("Password")}
                        onChange={handleChange}
                        value={formData?.Password}
                        onBlur={handleBlur}
                      />
                      {errors?.Password && touched?.Password && (
                        <div className="golbal-Error">{errors?.Password}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : null} */}

            <div className="box">
              <div className="box-header with-border">
                <div className="box-body">
                  <div className="row">
                    <div className="col-sm-1">
                      <Input
                        name="isActive"
                        type="checkbox"
                        onChange={handleChange}
                        checked={formData?.isActive}
                      />
                      <label htmlFor="isActive"  className="control-label">
                        {t("Active")}
                      </label>
                    </div>

                    <div className="row">
                      {name === "center" ? (
                        <>
                          <div className="col-sm-3">
                            <Input
                              name="SampleCollectandReceive"
                              type="checkbox"
                              onChange={handleChange}
                              checked={formData?.SampleCollectandReceive}
                            />
                            <label
                              htmlFor="SampleCollectandReceive"
                              className="control-label"
                            >
                              {t("Sample Collect & Receive")}
                            </label>
                          </div>

                          <div className="col-sm-2">
                            <Input
                              name="IsTrfRequired"
                              type="checkbox"
                              onChange={handleChange}
                              checked={formData?.IsTrfRequired}
                            />
                            <label
                              htmlFor="IsTrfRequired"
                              className="control-label"
                            >
                              {t("IsTrfRequired")}
                            </label>
                          </div>
                        </>
                      ) : null}

                      <div className="col-sm-1">
                        {load ? (
                          <Loading />
                        ) : (
                          <button
                            className="btn btn-success btn-sm btn-block"
                            onClick={handleSubmit}
                          >
                            {state?.other?.button
                              ? state?.other?.button
                              : t("Save")}
                          </button>
                        )}
                      </div>
                      <div className="col-sm-2">
                        <Link
                          to={`/CentreMasterList/${name}`}
                          style={{ fontSize: "13px" }}
                        >
                        {t("Back to List")} 
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CentreMaster;
