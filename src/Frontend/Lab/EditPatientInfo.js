import React from "react";
import Input from "../../ChildComponents/Input";
import {
  getDoctorSuggestion,
  getAccessCentres,
  getAccessDataRate,
  getBindReportDeliveryMethod,
  getPaymentModes,
  getTrimmedData,
  getVisitType,
  selectedValueCheck,
  autocompleteOnBlur,
} from "../util/Commonservices";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { number } from "../util/Commonservices/number";
import { useEffect } from "react";
import { useState } from "react";
import moment from "moment";
import axios from "axios";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { PatientRegisterSchema } from "../../ValidationSchema";
import PatientRegisterModal from "../util/PatientRegisterModal";
import DatePicker from "../Components/DatePicker";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  checkSpecialCharAndNumber,
  hanlderSpecialCharacter,
} from "../util/Commonservices/Pattern";
const EditPatientInfo = () => {
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [VisitType, setVisitType] = useState([]);
  const [Identity, setIdentity] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [state, setState] = useState({});
  const [PatientSource, setPatientSource] = useState([]);
  const [PatientType, setPatientType] = useState([]);
  const [BindReportDeliveryMethod, setBindReportDeliveryMethod] = useState([]);
  const [visibleFields, setVisibleFields] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [dropFalse, setDropFalse] = useState(true);
  const [throughMobileData, setThroughMobileData] = useState(false);
  const [LabNo, setLabNo] = useState("");
  const [indexMatch, setIndexMatch] = useState(0);
  const [RateType, setRateType] = useState([]);
  const [Gender, setGender] = useState([]);
  const [Title, setTitle] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    DoctorName: "",
  });
  const [DateData, setDateData] = useState({
    AgeYear: "",
    AgeMonth: "",
    AgeMonth: "",
  });
  const { t } = useTranslation();
  const [searchForm, setSearchForm] = useState({
    TestName: "",
    CentreID: "",
    InvestigationID: "",
  });

  const handleShow = () => setShow(true);

  useEffect(() => {
    getAccessDataRate(setRateType, state?.CentreID);
  }, [state?.CentreID]);

  const handleSelectNew = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  const handleListSearch = (data, name) => {
    switch (name) {
      case "TestName":
        setSearchForm({
          ...searchForm,
          TestName: "",
          InvestigationID: data.InvestigationID,
        });
        setIndexMatch(0);
        setSuggestion([]);
        break;
      case "DoctorName":
        setFormData({ ...formData, [name]: data.Name });
        setState({
          ...state,
          [name]: data.Name,
          DoctorID: data.DoctorReferalID,
          ReferLabId: data.DoctorReferalID,
          ReferLabName: data.Name,
        });
        setIndexMatch(0);
        setDoctorSuggestion([]);
        setDropFalse(false);
        break;
      default:
        break;
    }
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;

    if (name === "PatientIDProof") {
      setState({ ...state, [name]: value });
    }

    if (name === "VisitType") {
      setState({ ...state, [name]: value });
      fetchFields(event.value);
    }

    if (name === "ReportDeliveryMethodId") {
      setState({ ...state, [name]: value });
    }

    if (name === "DiscountApprovedBy") {
      setState({ ...state, [name]: value });
    }

    if (name === "DiscountReason") {
      setState({ ...state, [name]: value });
    }

    if (name === "CollectionBoyId") {
      setState({ ...state, [name]: value });
    }
  };

  const findGender = () => {
    const male = ["Mr.", "Baba", "Dr.(Mrs)"];
    const female = ["Miss.", "Mrs.", "Baby", "Dr.(Miss)"];

    if (male.includes(state?.Title)) {
      setState({ ...state, Gender: "Male" });
    }

    if (female.includes(state?.Title)) {
      setState({ ...state, Gender: "Female" });
    }
  };

  useEffect(() => {
    findGender();
  }, [state?.Title]);

  const fetchFields = (visitType) => {
    axios
      .post("/api/v1/ManageFieldMaster/getAllManageFieldMasterData", {
        VisitTypeID: visitType,
      })
      .then((res) => {
        let data = res?.data?.message;
        data.map((ele) => {
          return {
            ...ele,
            isError: false,
            message: "",
          };
        });

        setVisibleFields(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const handlePName = (data) => {
    const { FirstName, MiddleName, LastName } = data;
    return `${FirstName} ${MiddleName} ${LastName}`;
  };

  const { errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: state,
    enableReinitialize: true,
    validationSchema: PatientRegisterSchema,
    onSubmit: (values) => {
      const data = DynamicFieldValidations();
      setVisibleFields(data);
      const flag = data.filter((ele) => ele?.isError === true);
      if (flag.length === 0) {
        axios
          .post("/api/v1/Demographic/RegistrationEditData", {
            PatientData: getTrimmedData({
              ...values,
              PName: handlePName(values),
            }),
          })

          .then((res) => {
            toast.success(res?.data?.message);
          })
          .catch((err) => {
            toast.error("Something Went Wrong");
          });
      }
    },
  });

  const getSubtractType = (name) => {
    return name === "AgeYear"
      ? "years"
      : name === "AgeMonth"
      ? "months"
      : "days";
  };

  const handleDOBCalculation = (e) => {
    const { name, value } = e.target;
    let diff = {};
    let subtractType = getSubtractType(name);

    if (name === "AgeYear") {
      diff = moment().subtract(value, subtractType);
      setDateData({
        ...DateData,
        AgeYear: diff?._d,
      });
    }

    if (name === "AgeMonth") {
      diff = moment(DateData?.AgeYear || new Date().now).subtract(
        value,
        subtractType
      );
      setDateData({
        ...DateData,
        AgeMonth: diff?._d,
      });
    }

    if (name === "AgeDays") {
      diff = moment(DateData?.AgeMonth || new Date().now).subtract(
        value,
        subtractType
      );
      setDateData({
        ...DateData,
        AgeDays: diff?._d,
      });
    }

    var Newdiff = moment(moment(), "milliseconds").diff(
      moment(diff?._d).format("YYYY-MM-DD")
    );

    var duration = moment.duration(Newdiff);

    setState({
      ...state,
      [name]: value,
      DOB: diff?._d,
      TotalAgeInDays: moment(moment().format("YYYY-MM-DD")).diff(
        diff?._d,
        "days"
      ),
      Age: `${duration?._data?.years} Y ${duration._data?.months} M ${duration?._data?.days} D`,
    });
  };

  const handleMainChange = (e) => {
    const { name, value, type, checked } = e.target;

    setState({
      ...state,
      [name]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : ["FirstName", "MiddleName", "LastName"].includes(name)
          ? value.toUpperCase()
          : value,
    });
  };

  const DynamicFieldValidations = () => {
    const data = visibleFields.map((ele) => {
      if (
        ele["IsMandatory"] == 1 &&
        ele["IsVisible"] == 1 &&
        state[ele["FieldType"]] === ""
      ) {
        return {
          ...ele,
          isError: true,
          message: `${ele["FieldType"]} is Required Field`,
        };
      } else {
        return {
          ...ele,
          isError: false,
          message: "",
        };
      }
    });

    return data;
  };

  const handleLTData = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const calculateDOB = (value) => {
    var TodayDate = moment(new Date().now).format("YYYY,MM,DD");
    var DOBDate = moment(value).format("YYYY,MM,DD");
    var a = moment(TodayDate);
    var b = moment(DOBDate);
    var years = a.diff(b, "year");
    b.add(years, "years");
    var months = a.diff(b, "months");
    b.add(months, "months");
    var days = a.diff(b, "days");
    return { years, months, days };
  };

  const handleDateFunction = (value) => {
    const { year, month, days } = value;
    const yearDiff = moment().subtract(year, "years")?._d;
    const monthDiff = moment(yearDiff).subtract(month, "months")?._d;
    const daysDiff = moment(monthDiff).subtract(days, days)?._d;

    return {
      AgeYear: yearDiff,
      AgeMonth: monthDiff,
      AgeDays: daysDiff,
    };
  };

  const calculateTotalNumberOfDays = (value) => {
    return moment(moment().format("YYYY-MM-DD")).diff(value, "days");
  };

  const dateSelect = (value, name) => {
    const { years, months, days } = calculateDOB(value);
    setState({
      ...state,
      [name]: value,
      AgeYear: years,
      AgeMonth: months,
      AgeDays: days,
      TotalAgeInDays: calculateTotalNumberOfDays(value),
      Age: `${years} Y ${months} M ${days} D`,
    });

    const dateForFields = handleDateFunction({
      year: years,
      month: months,
      days: days,
    });

    setDateData({
      AgeYear: dateForFields?.AgeYear,
      AgeMonth: dateForFields?.AgeMonth,
      AgeDays: dateForFields?.AgeDays,
    });
  };

  // const handleDoctorSplit = () =>{
  //   const
  // }

  const EditPatientDetail = (LabNo) => {
    axios
      .post("/api/v1/Demographic/getDataEditByLabNo", {
        LabNo: LabNo,
      })
      .then((res) => {
        if (res?.data?.message?.patientDetail.length > 0) {
          setState({
            ...res?.data?.message?.patientDetail[0],
            DOB: new Date(res?.data?.message?.patientDetail[0]?.DOB),
          });

          setFormData({
            DoctorName: res?.data?.message?.patientDetail[0].DoctorName,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDropDownData = (name) => {
    const match = ["Title", "Gender", "BankName"];
    axios
      .post("/api/v1/Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: match.includes(name) ? ele.FieldDisplay : ele.FieldID,
            label: ele.FieldDisplay,
          };
        });

        switch (name) {
          case "Gender":
            setGender(value);
            break;
          case "Title":
            setTitle(value);
            break;
          case "Identity":
            setIdentity(value);
            break;
          default:
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAccessCentres(setCentreData);
    getDropDownData("Gender");
    getDropDownData("Title");
    getDropDownData("Identity");
    getDropDownData("PaymentMode");
    getDropDownData("BankName");
    getVisitType(setVisitType);
    getBindReportDeliveryMethod(setBindReportDeliveryMethod);
    getPaymentModes("Source", setPatientSource);
    getPaymentModes("PatientType", setPatientType);
  }, []);

  const handleClose = () => setShow(false);

  useEffect(() => {
    getDoctorSuggestion(formData, setDoctorSuggestion, setFormData);
  }, [formData?.DoctorName]);

  const handleIndex = (e) => {
    const { name } = e.target;
    switch (name) {
      case "TestName":
        switch (e.which) {
          case 38:
            if (indexMatch !== 0) {
              setIndexMatch(indexMatch - 1);
            } else {
              setIndexMatch(suggestion.length - 1);
            }
            break;
          case 40:
            if (suggestion.length - 1 === indexMatch) {
              setIndexMatch(0);
            } else {
              setIndexMatch(indexMatch + 1);
            }
            break;
          case 13:
            handleListSearch(suggestion[indexMatch], name);
            setIndexMatch(0);
            break;
          default:
            break;
        }
        break;
      case "DoctorName":
        switch (e.which) {
          case 38:
            if (indexMatch !== 0) {
              setIndexMatch(indexMatch - 1);
            } else {
              setIndexMatch(doctorSuggestion.length - 1);
            }
            break;
          case 40:
            if (doctorSuggestion.length - 1 === indexMatch) {
              setIndexMatch(0);
            } else {
              setIndexMatch(indexMatch + 1);
            }
            break;
          case 13:
            handleListSearch(doctorSuggestion[indexMatch], name);
            setIndexMatch(0);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (location?.state?.data) {
      setLabNo(location?.state?.data);
      EditPatientDetail(location?.state?.data);
    }
  }, []);

  return (
    <div className="box box-success form-horizontal">
      {show && <PatientRegisterModal show={show} handleClose={handleClose} />}
      <div className="box-header with-border">
        <h3 className="box-title">{t("Demographic Details")}</h3>
      </div>
      <div className="box-body">
        <div className="row">
          <div className="col-sm-2">
            <Input
              className="form-control input-sm select-input-box"
              disabled={state?.Mobile && true}
              //   name="LabNo"
              placeholder={t("Patient Details")}
              type="text"
              value={LabNo}
              onChange={(e) => setLabNo(e.target.value)}
            />
          </div>
          <div className="col-sm-1">
            <button
              className="btn btn-info btn-block btn-sm"
              onClick={() => EditPatientDetail(LabNo)}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </div>
      {state?.Mobile && (
        <div className="box">
          <div className="box-body">
            <div
              className="box-header with-header"
              style={{ display: "block" }}
            >
              <h3 className="box-title">{t("Patient Registration")}</h3>

              {/* <div>
              <p>{searchParams.get("LabNo")}</p>
            </div> */}
            </div>
            <div
              className="box-body"
              style={{ paddingTop: "3px", paddingBottom: "3px" }}
            >
              <div className="row">
                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Centre")}:
                </label>
                <div className="col-sm-2">
                  <SelectBox
                    options={CentreData}
                    name="CentreID"
                    selectedValue={state?.CentreID}
                    onChange={handleSelectChange}
                    isDisabled
                  />
                </div>

                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Rate Type")}:
                </label>
                <div className="col-sm-2">
                  <SelectBox
                    options={RateType}
                    selectedValue={selectedValueCheck(RateType, state?.RateID)}
                    name="RateID"
                    onChange={handleSelectChange}
                    isDisabled
                  />
                </div>

                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Mobile No")}:
                </label>
                <div className="col-sm-2">
                  <Input
                    className="select-input-box form-control input-sm required"
                    name="Mobile"
                    type="number"
                    required
                    onInput={(e) => number(e, 10)}
                    value={state.Mobile}
                    // disabled={throughMobileData}
                    onBlur={handleBlur}
                    onChange={handleMainChange}
                    min={10}
                    disabled
                  />
                  {errors?.Mobile && touched?.Mobile && (
                    <div className="golbal-Error">{errors?.Mobile}</div>
                  )}
                </div>

                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("First Name")}:
                </label>

                <div className="col-sm-2">
                  <div className="d-flex">
                    <div style={{ width: "50%" }}>
                      <SelectBox
                        options={Title}
                        name="Title"
                        isDisabled={throughMobileData}
                        selectedValue={state?.Title}
                        onChange={handleSelectNew}
                      />
                    </div>
                    <div style={{ width: "50%" }}>
                      <Input
                        className="select-input-box form-control input-sm required"
                        name="FirstName"
                        type="text"
                        max={35}
                        disabled={throughMobileData}
                        onKeyDown={(e) => checkSpecialCharAndNumber(e)}
                        value={state?.FirstName}
                        onChange={handleMainChange}
                        onBlur={handleBlur}
                      />

                      {errors?.FirstName && touched?.FirstName && (
                        <div className="golbal-Error">{errors?.FirstName}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Middle Name")}:
                </label>
                <div className="col-sm-2">
                  <Input
                    className="select-input-box form-control input-sm"
                    id="MidName"
                    name="MiddleName"
                    type="text"
                    value={state?.MiddleName}
                    disabled={throughMobileData}
                    onKeyDown={(e) => checkSpecialCharAndNumber(e)}
                    max={35}
                    onChange={handleMainChange}
                  />
                </div>
                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Last Name")}:
                </label>
                <div className="col-sm-2">
                  <Input
                    className="select-input-box form-control input-sm"
                    id="LastName"
                    max={50}
                    name="LastName"
                    type="text"
                    value={state?.LastName}
                    onKeyDown={(e) => checkSpecialCharAndNumber(e)}
                    disabled={throughMobileData}
                    onChange={handleMainChange}
                  />
                </div>

                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Gender")}:
                </label>

                <div className="col-sm-2">
                  <SelectBox
                    options={Gender}
                    className="required"
                    isDisabled={state?.Title ? true : false}
                    name="Gender"
                    selectedValue={state?.Gender}
                    onChange={handleSelectChange}
                  />
                </div>

                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Date Of Birth")}:
                  {/* <input
                  type="radio"
                  name="AgeWise"
                  value={"DOB"}
                  onChange={(e) => {
                    setRadioDefaultSelect(e.target.value);
                  }}
                  checked={RadioDefaultSelect === "DOB" ? true : false}
                /> */}
                </label>

                <div className="col-sm-2">
                  <div>
                    <DatePicker
                      name="DOB"
                      date={state?.DOB}
                      className="select-input-box form-control input-sm required"
                      onBlur={handleBlur}
                      onChange={dateSelect}
                      maxDate={new Date()}
                    />
                    {errors?.DOB && touched?.DOB && (
                      <div className="golbal-Error">{errors?.DOB}</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row">
                

                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Age")}:
                </label>
                <div className="col-sm-2">
                  <div className="input-group-append d-flex">
                    <Input
                      className="form-control input-sm"
                      id="AgeY"
                      name="Age"
                      type="text"
                      value={state?.AgeYear}
                      disabled={true}
                      onChange={handleMainChange}
                    />
                    <span className="input-group-text select-input-box form-control input-sm justify-content-center">
                      {t("Y")}
                    </span>
                    <Input
                      className="form-control input-sm input-select-box"
                      id="AgeM"
                      name="AgeMonth"
                      type="text"
                      disabled={true}
                      value={state?.AgeMonth}
                      onChange={handleMainChange}
                    />
                    <span className="input-group-text form-control pull-right reprint-date input-sm justify-content-center">
                      {t("M")}
                    </span>

                    <Input
                      className="form-control input-sm"
                      id="AgeD"
                      name="AgeDays"
                      type="text"
                      value={state?.AgeDays}
                      disabled={true}
                      onChange={handleMainChange}
                    />
                    <span className="input-group-text form-control pull-right reprint-date input-sm justify-content-center">
                      {t("D")}
                    </span>
                  </div>
                </div>

                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Email")}:
                </label>
                <div className="col-sm-2  ">
                  <Input
                    className="form-control input-sm"
                    id="Email"
                    name="Email"
                    type="email"
                    required
                    value={state?.Email}
                    onChange={handleMainChange}
                  />

                  {errors?.Email && touched?.Email && (
                    <div className="golbal-Error">{errors?.Email}</div>
                  )}
                </div>

                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("UHID")}:
                </label>
                <div className="col-sm-2  ">
                  <Input
                    className="form-control input-sm"
                    id="UHID"
                    max={15}
                    disabled
                    value={state?.PatientCode}
                    name="UHID"
                    type="text"
                  />
                </div>

                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Address")}:
                </label>

                <div className="col-sm-2">
                  <Input
                    className="form-control input-sm"
                    id="Address"
                    max="30"
                    name="HouseNo"
                    type="text"
                    onInput={(e) => hanlderSpecialCharacter(e)}
                    value={state?.HouseNo}
                    onChange={handleMainChange}
                  />
                </div>
              </div>
              <div className="row">
               
              

                

                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("PinCode")}:
                </label>
                <div className="col-sm-2">
                  <Input
                    className="form-control input-sm"
                    name="PinCode"
                    onInput={(e) => number(e, 6)}
                    type="number"
                    value={state?.PinCode}
                    onChange={handleMainChange}
                  />
                </div>

                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("City")}:
                </label>
                <div className="col-sm-2">
                  <Input
                    className="form-control input-sm"
                    id="City"
                    name="City"
                    type="text"
                    value={state?.City}
                    onChange={handleMainChange}
                  />
                </div>

                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("State")}:
                </label>
                <div className="col-sm-2">
                  <Input
                    className="form-control input-sm"
                    id="State"
                    name="State"
                    type="text"
                    value={state?.State}
                    onChange={handleMainChange}
                  />
                </div>
                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Nationality")}:
                </label>
                <div className="col-sm-2">
                  <Input
                    className="form-control input-sm select-input-box"
                    name="Country"
                    value={state?.Country}
                    type="text"
                    onChange={handleMainChange}
                  />
                </div>
              </div>
              
                
                {/* <div className="col-sm-3  ">
                <label className="control-label" htmlFor="Identity_Type">
                  Identity Type
                </label>
                /
                <label className="control-label" htmlFor="Identity_Type_No">
                  Identity No
                </label>
                <div className="d-flex">
                  <div style={{ width: "50%" }}>
                    <SelectBox
                      options={Identity}
                      selectedValue={selectedValueCheck(
                        Identity,
                        state?.PatientIDProof
                      )}
                      name="PatientIDProof"
                      onChange={handleSelectChange}
                    />
                  </div>
                  <div style={{ width: "50%" }}>
                    <Input
                      className="form-control pull-right reprint-date set-height"
                      max={20}
                      name="PatientIDProofNo"
                      value={state?.PatientIDProofNo}
                      type="text"
                      onChange={handleLTData}
                    />
                  </div>
                </div>
              </div> */}
                .
                {/* <div
                className="col-sm-3"
                id="OpdNo"
                ismandatory="true"
                style={{ display: "block" }}
              >
                <label className="control-label" htmlFor="Remarks">
                  Billing Remarks
                </label>
                :
                <Input
                  className="form-control pull-right reprint-date"
                  id="Remarks"
                  max={100}
                  name="Remarks"
                  type="text"
                  value={state?.Remarks}
                  onChange={handleMainChange}
                />
              </div> */}
                {/* {visibleFields?.map(
                (data, index) =>
                  data?.IsVisible === 1 && (
                    <div className="col-sm-2  " id="OpdNo" key={index}>
                      <label className="control-label" htmlFor="OpdIpd_No">
                        {data?.FieldType}
                      </label>
                      :
                      {["PatientSource", "PatientType"].includes(
                        data?.FieldType
                      ) ? (
                        <SelectBox
                          className={`${data?.IsMandatory === 1 && "required"}`}
                          options={
                            data?.FieldType === "PatientSource"
                              ? [
                                  { label: "Select", value: "" },
                                  ...PatientSource,
                                ]
                              : data?.FieldType === "PatientType"
                              ? PatientType
                              : []
                          }
                          selectedValue={selectedValueCheck(
                            data?.FieldType === "PatientSource"
                              ? PatientSource
                              : data?.FieldType === "PatientType"
                              ? [{ label: "Select", value: "" }, ...PatientType]
                              : [],
                            state[data?.FieldType]
                          )}
                          name={data?.FieldType}
                          onChange={handleSelectNew}
                        />
                      ) : (
                        <Input
                          className={`form-control pull-right reprint-date ${
                            data?.IsMandatory === 1 && "required"
                          }`}
                          id="OpdIpd_No"
                          maxLength={30}
                          name={data?.FieldType}
                          value={state[data?.FieldType]}
                          onChange={handleLTData}
                          type="text"
                        />
                      )}
                      {data?.isError && (
                        <div className="golbal-Error">{data?.message}</div>
                      )}
                    </div>
                  )
              )} */}
                {/* <div className="col-sm-2  ">
                <label className="control-label" htmlFor="CollectionBoyId">
                  Collection Boy
                </label>
                :
                <SelectBox
                  options={CollectionBoy}
                  selectedValue={selectedValueCheck(
                    CollectionBoy,
                    LTData?.CollectionBoyId
                  )}
                  name="CollectionBoyId"
                  onChange={handleSelectChange}
                />
                <div
                  className="chosen-container chosen-container-single"
                  title=""
                  id="CollectionBoyId_chosen"
                  style={{ width: "147px" }}
                >
                  <div className="chosen-drop">
                    <div className="chosen-search"></div>
                  </div>
                </div>
              </div> */}
                {/* <div className="col-sm-2  ">
                <label
                  className="control-label"
                  htmlFor="ReportDeliveryMethodId"
                >
                  Report Delivery Method.
                </label>
                :
                <SelectBox
                  options={BindReportDeliveryMethod}
                  selectedValue={selectedValueCheck(
                    BindReportDeliveryMethod,
                    state?.ReportDeliveryMethodId
                  )}
                  name="ReportDeliveryMethodId"
                  onChange={handleSelectChange}
                />
              </div> */}
                {/* <div className="col-sm-3  ">
                <label
                  className="control-label"
                  htmlFor="ReportDeliveryMethodDetail"
                >
                  Report Delivery Method Detail
                </label>
                :
                <Input
                  className="form-control pull-right reprint-date"
                  id="ReportDeliveryMethodDetail"
                  max={200}
                  value={state?.ReportDeliveryMethodDetail}
                  name="ReportDeliveryMethodDetail"
                  onChange={handleLTData}
                  type="text"
                />
              </div> */}
                {/* <div className="col-sm-3   margin-top py-3 mt-4">           
                <SimpleCheckbox
                  type="checkbox"
                  name="isVIP"
                  onChange={handleMainChange}
                  checked={state?.isVIP === 1 ? true : false}
                />
                <label className="labels">IsVip</label>
                {state?.isVIP === 1 && (
                  <>
                    <SimpleCheckbox
                      type="checkbox"
                      name="IsMask"
                      onChange={handleMainChange}
                      checked={state?.IsMask === 1 ? true : false}
                    />
                    <label className="labels">IsMask</label>
                  </>
                )}
              </div> */}
              
            </div>

            <div className="col-sm-1">
              <button
                type="submit"
                id="btnSave"
                className="btn btn-success btn-sm btn-block"
                onClick={handleSubmit}
              >
                {t("Update")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPatientInfo;
