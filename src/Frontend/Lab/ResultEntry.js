import React, { useEffect, useRef, useState } from "react";
import { DatePickers } from "../../ChildComponents/DatePicker";
import { SelectBox } from "../../ChildComponents/SelectBox";
import moment from "moment";
import { DateTypeSearch, SearchBy } from "../../ChildComponents/Constants";
import axios from "axios";
import Input from "../../ChildComponents/Input";
import BootTable from "../../Table/RETable";
import Loading from "../util/Loading";
import { Table } from "react-bootstrap";
import {
  DepartmentWiseItemList,
  DyanmicStatusResponse,
  PreventSpecialCharacter,
  autocompleteOnBlur,
  getAccessDataRate,
  getDoctorSuggestion,
  getPaymentModes,
  getTrimmedData,
  isChecked,
} from "../util/Commonservices";
import { toast } from "react-toastify";
import ResultEntryEditModal from "../util/ResultEntryEditModal";
import ResultEditAddModal from "../util/ResultEditAddModal";
import { dateConfig } from "../util/DateConfig";
import TemplateMasterModal from "../util/TemplateMasterModal";
import { useNavigate } from "react-router-dom";
import MedicialModal from "../util/MedicialModal";
import AutoComplete from "../../ChildComponents/AutoComplete";
import CustomDate from "../../ChildComponents/CustomDate";
import UploadModal from "../util/UploadModal";
import DatePicker from "../Components/DatePicker";
import { SampleStatus } from "./../../ChildComponents/Constants";
import { useTranslation } from "react-i18next";
import { number } from "../util/Commonservices/number";

const ResultEntry = () => {
  const navigate = useNavigate();
  const [TestSuggestion, setTestSuggestion] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [doctorAdmin, setDoctorAdmin] = useState([]);
  const [RateData, setRateData] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [ResultTestData, setResultTestData] = useState([]);
  const [ResultData, setResultData] = useState([]);
  const [HiddenDropDownHelpMenu, setHiddenDropDownHelpMenu] = useState(false);
  const [indexMatch, setIndexMatch] = useState(0);
  const [buttonsData, setButtonsData] = useState([]);
  const [helpmenu, setHelpMenu] = useState([]);
  const [DlcCheckChecked, setDlcCheckChecked] = useState(false);
  const [dropFalse, setDropFalse] = useState(true);
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [statusValue, setStatusValue] = useState("");
  const [show, setShow] = useState({
    moadal: false,
    data: {},
  });
  const [PreviousTestResult, setPreviousTestResult] = useState([]);
  const [show2, setShow2] = useState({
    moadal: false,
    data: {},
  });
  const [PrintReportLoading, setPrintReportLoading] = useState(false);

  const [show3, setShow3] = useState({
    modal: false,
    data: {},
  });

  const [show4, setShow4] = useState({
    modal: false,
    data: "",
    index: -1,
  });

  const [show5, setShow5] = useState({
    modal: false,
    data: "",
  });

  const [mouseHover, setMouseHover] = useState({
    index: -1,
    data: [],
  });

  const [toggleDate, setToggleDate] = useState({
    FromDate: false,
    ToDate: false,
  });
  const [redata, SetReData] = useState([]);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [Identity, setIdentity] = useState([]);
  const [show6, setShow6] = useState({
    modal: false,
    data: "",
    index: -1,
  });

  const [formData, setFormData] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    CentreID: "",
    ItemValue: "",
    RateID: "",
    SelectTypes: "",
    RefundFilter: null,
    FromTime: "00:00:00",
    ToTime: "23:59:59",
    DoctorReferal: "",
    DepartmentID: "",
    DoctorName: "",
    TestName: "",
    SampleStatus: "3",
    DateTypeSearch: "",
  });
  // i18n start

  const { t } = useTranslation();

  // i18n end
  const handleIndexNew = (e, name) => {
    switch (name) {
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
            handleListSearchNew(doctorSuggestion[indexMatch], name);
            setIndexMatch(0);
            break;
          default:
            break;
        }
        break;
      case "TestName":
        switch (e.which) {
          case 38:
            if (indexMatch !== 0) {
              setIndexMatch(indexMatch - 1);
            } else {
              setIndexMatch(TestSuggestion.length - 1);
            }
            break;
          case 40:
            if (TestSuggestion.length - 1 === indexMatch) {
              setIndexMatch(0);
            } else {
              setIndexMatch(indexMatch + 1);
            }
            break;
          case 13:
            handleListSearchNew(TestSuggestion[indexMatch], name);
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
    if (formData?.TestName.length > 2) {
      DepartmentWiseItemList(
        formData.DepartmentID,
        formData?.TestName,
        setTestSuggestion
      );
    }
  }, [formData?.TestName]);

  const handleListSearchNew = (data, name) => {
    switch (name) {
      case "DoctorName":
        setFormData({
          ...formData,
          [name]: data.Name,
          DoctorReferal: data.Name ? data.DoctorReferalID : "",
        });
        setIndexMatch(0);
        setDoctorSuggestion([]);
        setDropFalse(false);
        break;

      case "TestName":
        setFormData({
          ...formData,
          [name]: data.TestName,
        });
        setIndexMatch(0);
        setTestSuggestion([]);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getDoctorSuggestion(formData, setDoctorSuggestion, setFormData);
    if (formData?.DoctorName === "") {
      setDropFalse(true);
    }
  }, [formData?.DoctorName]);

  const validation = () => {
    let error = "";
    if (formData?.SelectTypes !== "" && formData?.ItemValue === "") {
      error = { ...error, ItemValue: t("Please Choose Value") };
    }
    if (formData.SelectTypes === "Mobile") {
      if (formData?.SelectTypes !== "" && formData?.ItemValue === "") {
        error = { ...error, ItemValue: t("This Field is Required") };
      } else if (formData.ItemValue.length !== 10) {
        error = { ...error, ItemValue: t("Invalid Mobile Number") };
      }
    }

    // if (moment(formData.FromDate).isAfter(moment(new Date()))) {
    //   error = { ...error, FromDate: t("Date is Invalid") };
    // }

    // if (moment(formData.ToDate).isAfter(moment(new Date()))) {
    //   error = { ...error, ToDate: t("Date is Invalid") };
    // } else if (
    //   moment(formData.ToDate).format("DD/MMM/YYYY") <
    //   moment(formData.FromDate).format("DD/MMM/YYYY")
    // ) {
      
    //   error = {
    //     ...error,
    //     ToDate: t("Date Must be Greater Then Or Equal to From Date"),
    //   };
    // }
    if (formData.FromDate === moment(new Date()).format("DD/MMM/YYYY")) {
      if (formData.FromTime > moment(new Date()).format("hh:mm:ss ")) {
        error = { ...error, FromTime: t("Time is Invalid") };
      }
    }    if (formData.ToDate === moment(new Date()).format("DD/MMM/YYYY")) {
      if (formData.ToTime < formData.FromTime) {
        error = { ...error, ToTime: t("Time Must be Less than From Time") };
      }
    }

    return error;
  }

  const myRefs = useRef([]);

  const handleKeyUp = (e, targetElem) => {
    if (e.key === "Enter" && targetElem) {
      targetElem.focus();
    }
  };

  const handleToggle = (name) => {
    setToggleDate({ ...toggleDate, [name]: !toggleDate[name] });
  };

  const dateSelect = (date, name) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const handleSelectChange = (event) => {
    const { name, value } = event?.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const getAccessCentres = () => {
    axios
      .get("/api/v1/Centre/getAccessCentres")
      .then((res) => {
        let data = res.data.message;
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        CentreDataValue.unshift({ label: t("All Centre"), value: "" });
        setCentreData(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };

  // const getAccessRateType = () => {
  //   axios
  //     .get("/api/v1/RateType/getAccessRateType")
  //     .then((res) => {
  //       let data = res.data.message;
  //       let CentreDataValue = data.map((ele) => {
  //         return {
  //           value: ele.RateTypeID,
  //           label: ele.Rate,
  //         };
  //       });
  //       setRateData(CentreDataValue);
  //     })
  //     .catch((err) => console.log(err));
  // };

  const handleSave = (data, modal) => {
    if (modal === "Edit") {
      if (Number(data?.MinValue) >= Number(data?.MaxValue)) {
        toast.error(t("Please Enter Correct Min and Max Value"));
      } else {
        let val = ResultData.map((ele) => {
          if (ele.labObservationID == data?.labObservationID) {
            return {
              ...ele,
              DisplayReading: data?.DisplayReading,
              MinValue: data?.MinValue,
              MaxValue: data?.MaxValue,
              ReadingFormat: data?.ReadingFormat,
              SaveRangeStatus: 1,
            };
          } else {
            return ele;
          }
        });
        setResultData(val);
        setShow({ moadal: false, data: {} });
      }
    }

    if (modal === "AddComment") {
      if (data?.pageName === "Single") {
        let val = ResultData.map((ele) => {
          if (ele.labObservationID == data?.labObservationID) {
            return {
              ...ele,
              COMMENT: data?.COMMENT,
              SaveRangeStatus: 1,
            };
          } else {
            return ele;
          }
        });
        setResultData(val);
        setShow2({ moadal: false, data: {} });
      } else {
        let val = ResultData.map((ele) => {
          if (ele.TestID == data?.TestID) {
            return {
              ...ele,
              COMMENT: data?.COMMENT,
              SaveRangeStatus: 1,
            };
          } else {
            return ele;
          }
        });
        setResultData(val);
        setShow2({ moadal: false, data: {} });
      }
    }

    if (modal === "TemplateMaster") {
      let val = ResultData.map((ele) => {
        if (ele.InvestigationID == data?.InvestigationID) {
          return {
            ...ele,
            COMMENT: data?.COMMENT,
            CommentID: data?.CommentID,
          };
        } else {
          return ele;
        }
      });
      setResultData(val);
      setShow3({ moadal: false, data: {} });
    }
  };

  console.log(ResultData);

  const getDepartment = () => {
    axios
      .get("/api/v1/Department/getDepartment")
      .then((res) => {
        let data = res.data.message;
        let DeptDataValue = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        DeptDataValue.unshift({ label: t("All Department"), value: "" });
        setDepartmentData(DeptDataValue);
      })
      .catch((err) => console.log(err));
  };

  const TableData = (status) => {
    const generatedError = validation();
    if (generatedError === "") {
      setLoading(true);
      axios
        .post(
          "/api/v1/RE/GetResultEntry",
          getTrimmedData({
            CentreID: formData.CentreID,
            SelectTypes: formData.SelectTypes,
            ItemValue: formData.ItemValue,
            RateTypeID: formData.RateID,
            DoctorReferal: formData.DoctorReferal,
            FromDate: moment(formData.FromDate).format("DD/MMM/YYYY"),
            ToDate: moment(formData.ToDate).format("DD/MMM/YYYY"),
            FromTime: formData.FromTime,
            ToTime: formData.ToTime,
            DepartmentID: formData.DepartmentID,
            SampleStatus: status,
            TestName: formData?.TestName,
            DateTypeSearch: formData?.DateTypeSearch,
          })
        )
        .then((res) => {
          SetReData(res?.data?.message);
          setStatusValue(status === "" ? status : parseInt(status));
          setLoad(true);
          setLoading(false);
        })
        .catch((err) => setLoading(false));
      setErrors(generatedError);
    } else {
      setErrors(generatedError);
    }
  };

  const getIsDocumentUpload = (documentId, pageName) => {
    return   axios
      .post("/api/v1/CommonController/GetDocument", {
        Page: pageName,
        Guid: documentId,
      })
      .then((res) => {
        return res?.data?.message.length > 0 ? true : false;
      })
      .catch((err) => {
        console.log(err?.data?.message);
      });
  };

  console.log(ResultTestData);

  const GetResultEntry = (TestID, loading) => {
    loading(true);
    axios
      .post("/api/v1/RE/GetResultEntryData", {
        TestID: TestID,
      })
      .then((res) => {
        const data = res?.data?.message;
        if (data.length > 0) {
          const val = data.map((ele) => {
            return {
              ...ele,
              isChecked: true,
              RerunIscheck: false,
              SaveRangeStatus: 0,
            };
          });
          setResultData(val);
          const dataTestHeader = res?.data?.TestHeader;
          const valTestHeader = dataTestHeader?.map((ele) => {
            return {
              ...ele,
              isChecked: true,
              outSource: 1,
              isDocumentUpload: 0,
              // ApprovedBy:""
            };
          });
          setResultTestData(valTestHeader);
          loading(false);
        } else {
          toast.error(t("No Data Found"));
          loading(false);
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : t("Error Occured")
        );
        loading(false);
      });
  };

  const handleDoctorName = (e) => {
    const { name, value } = e.target;
    const data = ResultTestData?.map((ele) => {
      return {
        ...ele,
        [name]: value,
      };
    });

    setResultTestData(data);
  };

  const ApplyFormula = (testid) => {
    if (ResultData.length) {
      for (let i = 0; i < ResultData.length; i++) {
        var Formula = "";
        Formula = ResultData[i].Formula;
        if (Formula != "" && ResultData[i].TestID === testid) {
          for (var j = 0; j < ResultData.length; j++) {
            try {
              var aa = ResultData[j].Value;
              if (aa == "") {
                aa = "0";
              }
              if (ResultData[i].ReportType == "1") {
                console.log(ResultData[j].labObservationID + "&");
                Formula = Formula.replace(
                  ResultData[j].labObservationID + "&",
                  aa
                );
              }
            } catch (e) {}
          }

          try {
            var vv = Math.round(eval(Formula) * 100) / 100;
            if (vv == "0") {
              ResultData[i].Value = "";
            } else {
              ResultData[i].Value = vv;
            }
          } catch (e) {
            ResultData[i].Value = "";
          }
          var ans = ResultData[i].Value;
          if (
            parseFloat(ResultData[i].Value) >
            parseFloat(ResultData[i]["MaxValue"])
          ) {
            ResultData[i]["Flag"] = "High";
          }
          if (
            parseFloat(ResultData[i].Value) <
            parseFloat(ResultData[i]["MinValue"])
          ) {
            ResultData[i]["Flag"] = "Low";
          }

          if (
            parseFloat(ResultData[i].Value) >=
              parseFloat(ResultData[i]["MinValue"]) &&
            parseFloat(ResultData[i].Value) <=
              parseFloat(ResultData[i]["MaxValue"])
          ) {
            ResultData[i]["Flag"] = "Normal";
          }

          if (ResultData[i].Value === "") {
            ResultData[i]["Flag"] = "";
          }

          if (isNaN(ans) || ans == "Infinity") {
            ResultData[i].Value = "";
          }
        }
      }
    }
  };

  const handleCheckbox = (e, index, testid) => {
    const data = [...ResultData];
    const dataTestHeader = [...ResultTestData];
    const { value, checked, type, name } = e.target;
    if (index >= 0) {
      if (
        name === "Value" &&
        /[~`!@#$%_\^&*()+\-\[\]\\';,/{}|\\":\?]/g.test(value)
      ) {
        return;
      }
      data[index][name] = type === "checkbox" ? checked : value;
      if (name === "Value" && type === "text") {
        if (parseFloat(value) > parseFloat(data[index]["MaxValue"])) {
          data[index]["Flag"] = "High";
        }
        if (parseFloat(value) < parseFloat(data[index]["MinValue"])) {
          data[index]["Flag"] = "Low";
        }

        if (
          parseFloat(value) >= parseFloat(data[index]["MinValue"]) &&
          parseFloat(value) <= parseFloat(data[index]["MaxValue"])
        ) {
          data[index]["Flag"] = "Normal";
        }

        if (value === "") {
          data[index]["Flag"] = "";
        }
      }
      setResultData(data);
    } else {
      const val = data.map((ele) => {
        if (testid === ele?.TestID) {
          return {
            ...ele,
            [name]: checked,
          };
        } else {
          return ele;
        }
      });

      const valTestHeader = dataTestHeader?.map((ele) => {
        if (testid === ele?.TestID) {
          return {
            ...ele,
            isChecked: checked,
          };
        } else {
          return ele;
        }
      });
      setResultTestData(valTestHeader);
      setResultData(val);
    }
    ApplyFormula(testid);
  };

  const getHelpMenuData = (e, labObservationId) => {
    setHiddenDropDownHelpMenu(true);
    axios
      .post("/api/v1/RE/getHelpMenuInvestigationWise", {
        InvestigationID: labObservationId,
      })
      .then((res) => {
        setHelpMenu(res.data?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleIndex = (e, index) => {
    const { name } = e.target;
    switch (name) {
      case "Value":
        switch (e.which) {
          case 38:
            if (indexMatch !== 0) {
              setIndexMatch(indexMatch - 1);
            } else {
              setIndexMatch(helpmenu.length - 1);
            }
            break;
          case 40:
            if (helpmenu.length - 1 === indexMatch) {
              setIndexMatch(0);
            } else {
              setIndexMatch(indexMatch + 1);
            }
            break;
          case 13:
            handleListSearch(helpmenu[indexMatch], name, index);
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

  const handleListSearch = (data, name, index) => {
    const val = [...ResultData];
    val[index][name] = data.label;
    setResultData(val);
    setHelpMenu([]);
    setHiddenDropDownHelpMenu(false);
  };

  const fetchApi = (field, payload, headerData) => {
    setLoading(true);
    axios
      .post("/api/v1/RE/SaveResultEntry", {
        data: payload,
        ResultStatus: field,
        HeaderInfo: headerData,
      })
      .then((res) => {
        setLoading(false);
        toast.success(res.data.message);
        setResultData([]);
        setDlcCheckChecked(false);
      })
      .catch((err) => {
        if (err.response.status === 504) {
          toast.error(t("Something Went Wrong"));
        }
        if (err.response.status === 401) {
          toast.error(err.response.data.message);
        }
        setLoading(false);
        setResultData([]);
      });
  };

  // const handleStatusFilter = (status) => {
  //   const data = ResultTestData.filter(
  //     (ele) => ele?.Status === status && ele?.isChecked === true
  //   );
  //   return data;
  // };

  const validateData = (field, payload, message, headerData) => {
    if (payload?.length > 0) {
      if (["Save", "Hold", "Unhold", "Not Approved"].includes(field)) {
        fetchApi(field, payload, headerData);
      } else {
        let showMessage = t("All Required fields are mandatory");
        let flag = 1;
        let DlcSum = 0;
        for (var i = 0; i < payload.length > 0; i++) {
          if (
            payload[i].dlcCheck == "1" &&
            DlcCheckChecked &&
            payload[i].InvestigationID === 370
          ) {
            DlcSum =
              parseFloat(DlcSum) +
              parseFloat(payload[i].Value === "" ? 0 : payload[i].Value);
          }
          if (payload[i].ReportType === "1") {
            if (payload[i].isMandatory === 1 && payload[i].Value == "") {
              flag = 0;
            }
          }
          if (["2", "3"].includes(payload[i].ReportType)) {
            if (
              (payload[i].isMandatory === 1 && payload[i].COMMENT == "") ||
              payload[i].COMMENT == null
            ) {
              flag = 0;
            }
          }
        }

        for (let i = 0; i < headerData.length; i++) {
          if (headerData[i]["ApprovedBy"] == "0") {
            flag = 0;
            showMessage = t("Kindly Select Doctor");
            break;
          }
        }

        if (flag == 1) {
          if (DlcCheckChecked) {
            if (DlcSum !== 100) {
              toast.error(t("Dlc Count Should be equal to 100"));
            } else {
              fetchApi(field, payload, headerData);
            }
          } else {
            fetchApi(field, payload, headerData);
          }
        } else {
          toast.error(showMessage);
        }
      }
    } else {
      toast.error(message);
    }
  };

  const handleResultSubmit = (field, headData) => {
    const errorToast = `This Test is ${DyanmicStatusResponse(ResultTestData)}`;
    if (field === "Approved") {
      const data = ResultData.filter(
        (ele) =>
          (ele?.Status === 3 || ele?.Status === 10) && ele?.isChecked === true
      );
      const val = ResultTestData.filter(
        (ele) =>
          (ele?.Status === 3 || ele?.Status === 10) && ele?.isChecked === true
      );
      validateData(field, data, errorToast, val);
    } else if (field === "Save") {
      const data = ResultData.filter(
        (ele) =>
          (ele?.Status === 3 || ele?.Status === 10) && ele?.isChecked === true
      );
      const val = ResultTestData.filter(
        (ele) =>
          (ele?.Status === 3 || ele?.Status === 10) && ele?.isChecked === true
      );
      validateData(field, data, errorToast, val);
    } else if (field === "Not Approved") {
      const data = ResultData.filter((ele) => ele.TestID === headData.TestID);
      const val = ResultTestData.filter(
        (ele) => ele?.TestID === headData.TestID
      );
      validateData(field, data, "This test is Not Approved", val);
    } else if (field === "Hold") {
      const payload = ResultData.filter(
        (ele) => ele.Status !== 5 && ele.isChecked === true
      );
      const val = ResultTestData.filter(
        (ele) => ele.Status !== 5 && ele.isChecked === true
      );
      validateData(field, payload, errorToast, val);
    } else if (field === "Unhold") {
      const data = ResultData.filter((ele) => ele.TestID === headData.TestID);
      const val = ResultTestData.filter(
        (ele) => ele?.TestID === headData.TestID
      );
      validateData(field, data, t("This Test is not Hold"), val);
    } else {
      const payload = ResultData.filter((ele) => ele.isChecked === true);
      validateData(field, payload);
      // } else {
      //   if (field === "Not Approved") {
      //     const payload = ResultData.filter((ele) => ele.isChecked === true);
      //     fetchApi(field, payload);
      //   } else {
      //     toast.error(
      //       `This already approved ${ResultTestData[statusMatchIndex]["PackageName"]}, Please Uncheck to continue or unhold to continue`
      //     );
      //   }
      // }
    }
  };

  const DeltaResponse = (data) => {
    axios
      .post("/api/v1/RE/DeltaCheck", {
        TestID: data?.TestID,
        LabObservation_ID: data?.labObservationID,
      })
      .then((res) => {
        const data = res.data.message;
        if (data.length > 0) {
          setPreviousTestResult(data);
        } else {
          setPreviousTestResult([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const handleReport = () => {
  //   let test_id = "";
  //   for (let i = 0; i < ResultTestData.length; i++) {
  //     test_id =
  //       test_id === ""
  //         ? `${ResultTestData[i].TestID}`
  //         : `${test_id},${ResultTestData[i].TestID}`;
  //   }

  //   console.log(ResultTestData);
  //   axios
  //     .post("/api/v1/LabReport/getlabreport", {
  //       test_id: test_id,
  //       ledgerTransactionID: ResultTestData[0]?.LedgerTransactionID,
  //     })
  //     .then((res) => {
  //       let response = res?.data?.message;
  //       const data = JSON.parse(
  //         response?.ReportSetting[0]?.ReportConfiguration
  //       );

  //       const val = [...response?.ReportSetting];
  //       val[0]["ReportConfiguration"] = data;
  //       response = { ...response, ReportSetting: val };
  //       navigate("/getLabReport", {
  //         state: {
  //           data: response,
  //         },
  //       });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const handleReport = () => {
    const data = ResultTestData.filter((ele) => ele?.isChecked === true);
    let TestIDHash = data.map((ele) => {
      return ele?.TestIDHash;
    });

    setPrintReportLoading(true);
    axios
      .post(`/reports/v1/commonReports/GetLabReport`, {
        TestIDHash: TestIDHash,
      })
      .then((res) => {
        window.open(res?.data?.Url, "_blank");
        setPrintReportLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
        setPrintReportLoading(false);
      });
  };

  const getButtondata = () => {
    axios
      .get("api/v1/RE/EmployeeAccessDetails")
      .then((res) => {
        setButtonsData(res.data.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : t("Something Went Wrong")
        );
      });
  };

  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;

    setFormData({ ...formData, [secondName]: TimeStamp });
  };

  const BindApprovalDoctor = () => {
    axios
      .get("/api/v1/CommonController/BindApprovalDoctor")
      .then((res) => {
        // console.log(res)
        let data = res.data.message;
        let doctorData = data.map((ele) => {
          return {
            value: ele?.employeeid,
            label: ele?.name,
          };
        });
        setDoctorAdmin(doctorData);
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange1 = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    value != -1 && TableData(value);
  };

  useEffect(() => {
    getAccessCentres();
    getDepartment();
    BindApprovalDoctor();
    getPaymentModes("Identity", setIdentity);
    getButtondata();
  }, []);

  useEffect(() => {
    getAccessDataRate(setRateData, formData?.CentreID).then((res) => {
      setFormData({ ...formData, RateID: res[0]?.value });
    });
  }, [formData?.CentreID]);

  const handleUploadCount = (name, value, secondName) => {
    let data = [...redata];
    if (name === "UploadDocumentCount") {
      data[show6?.index][name] = value;
      data[show6?.index][secondName] = value === 0 ? 0 : 1;
      SetReData(data);
    } else {
      data[show4?.index][name] = value;
      data[show4?.index][secondName] = value === 0 ? 0 : 1;
      SetReData(data);
    }
  };

  return (
    <>
      {ResultData.length === 0 ? (
        <div className="box box-success">
          {show4?.modal && (
            <MedicialModal
              show={show4.modal}
              handleClose={() => {
                setShow4({
                  modal: false,
                  data: "",
                  index: -1,
                });
              }}
              MedicalId={show4?.data}
              handleUploadCount={handleUploadCount}
            />
          )}

          {show6?.modal && (
            <UploadModal
              show={show6?.modal}
              handleClose={() => {
                setShow6({ modal: false, data: "", index: -1 });
              }}
              options={Identity}
              documentId={show6?.data}
              pageName="Patient Registration"
              handleUploadCount={handleUploadCount}
            />
          )}
          <div>
            <div className="box-header with-border">
              <h3 className="box-title">{t("Result Entry")}</h3>
            </div>
            <div className="box-body">
              <div className="row">
                <div className="col-sm-2 ">
                  <div className="d-flex" style={{ display: "flex" }}>
                    <div style={{ width: "40%" }}>
                      <SelectBox
                        options={SearchBy}
                        selectedValue={formData.SelectTypes}
                        className="input-sm"
                        name="SelectTypes"
                        onChange={handleSelectChange}
                      />
                    </div>
                    <div style={{ width: "60%" }}>
                      {formData?.SelectTypes === "Mobile" ? (
                        <div style={{ width: "100%" }}>
                          <Input
                            className="select-input-box form-control input-sm"
                            type="number"
                            name="ItemValue"
                            max={10}
                            value={formData.ItemValue}
                            onChange={handleChange}
                            onInput={(e) => number(e, 10)}
                          />
                          {errors?.ItemValue && (
                            <div className="golbal-Error">
                              {errors?.ItemValue}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div style={{ width: "100%" }}>
                          <Input
                            className="select-input-box form-control input-sm"
                            type="text"
                            name="ItemValue"
                            max={20}
                            value={formData.ItemValue}
                            onChange={handleChange}
                            on
                          />
                          {errors?.ItemValue && (
                            <div className="golbal-Error">
                              {errors?.ItemValue}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-sm-2   ">
                  <SelectBox
                    options={CentreData}
                    selectedValue={formData?.CentreID}
                    className="input-sm"
                    name="CentreID"
                    onChange={handleSelectChange}
                  />
                  <span
                    className="text-danger field-validation-valid"
                    data-valmsg-for="CentreID"
                    data-valmsg-replace="true"
                  ></span>
                </div>
                <div className="col-sm-2  ">
                  <SelectBox
                    options={RateData}
                    className="input-sm"
                    name="RateID"
                    selectedValue={formData?.RateID}
                    onChange={handleSelectChange}
                  />
                </div>

                <div className="col-sm-2   ">
                  <SelectBox
                    options={DepartmentData}
                    selectedValue={formData.DepartmentID}
                    className="input-sm"
                    name="DepartmentID"
                    onChange={handleSelectChange}
                  />
                  <span
                    className="text-danger field-validation-valid"
                    data-valmsg-for="CentreID"
                    data-valmsg-replace="true"
                  ></span>
                </div>

                <div className="col-sm-2">
                  <input
                    className="form-control ui-autocomplete-input input-sm"
                    type="text"
                    placeholder={t("Refer Doctor")}
                    name="DoctorName"
                    value={formData.DoctorName}
                    onKeyDown={(e) => handleIndexNew(e, "DoctorName")}
                    onBlur={(e) => {
                      autocompleteOnBlur(setDoctorSuggestion);
                      setTimeout(() => {
                        const data = doctorSuggestion.filter(
                          (ele) => ele?.Name === e.target.value
                        );
                        if (data.length === 0) {
                          setFormData({ ...formData, DoctorName: "" });
                        }
                      }, 500);
                    }}
                    autoComplete="off"
                    onChange={handleChange}
                  />
                  {dropFalse && doctorSuggestion.length > 0 && (
                    <ul
                      className="suggestion-data"
                      style={{ top: "26px", right: "0px" }}
                    >
                      {doctorSuggestion.map((data, index) => (
                        <li
                          onClick={() =>
                            handleListSearchNew(data, "DoctorName")
                          }
                          className={`${index === indexMatch && "matchIndex"}`}
                          key={index}
                        >
                          {data?.Name}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="col-sm-2  ">
                  <Input
                    className="form-control ui-autocomplete-input input-sm"
                    type="text"
                    name="TestName"
                    placeholder={t("Search Test")}
                    value={formData.TestName}
                    autoComplete={"off"}
                    onChange={handleChange}
                    onKeyDown={(e) => handleIndexNew(e, "TestName")}
                  />
                  {TestSuggestion.length > 0 && (
                    <AutoComplete
                      test={TestSuggestion}
                      handleListSearch={handleListSearchNew}
                      indexMatch={indexMatch}
                    />
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-2   ">
                  <SelectBox
                    options={[
                      { label: "DateTypeSearch", value: "" },
                      ...DateTypeSearch,
                    ]}
                    selectedValue={formData?.DateTypeSearch}
                    name="DateTypeSearch"
                    onChange={handleSelectChange}
                  />
                  <span
                    className="text-danger field-validation-valid"
                    data-valmsg-for="CentreID"
                    data-valmsg-replace="true"
                  ></span>
                </div>
                <div className="col-sm-2  ">
                  <div>
                    <DatePicker
                      name="FromDate"
                      date={formData?.FromDate}
                      onChange={dateSelect}
                      onChangeTime={handleTime}
                      secondName="FromTime"
                      maxDate={new Date()}
                    />

                    {errors?.FromDate && (
                      <span className="golbal-Error">{errors?.FromDate}</span>
                    )}
                  </div>
                </div>

                <div className="col-sm-2  ">
                  <div>
                    <DatePicker
                      name="ToDate"
                      date={formData?.ToDate}
                      onChange={dateSelect}
                      onChangeTime={handleTime}
                      secondName="ToTime"
                      maxDate={new Date()}
                      minDate={new Date(formData.FromDate)}
                    />

                    {errors?.ToDate && (
                      <span className="golbal-Error">{errors?.ToDate}</span>
                    )}
                  </div>
                </div>
                <div className="col-sm-2">
                  <SelectBox
                    options={[
                      { label: "Search By", value: "" },
                      ...SampleStatus,
                    ]}
                    onChange={handleSelectChange1}
                    id="SampleStatus"
                    name="SampleStatus"
                    selectedValue={formData?.SampleStatus}
                  />
                </div>
                <div className="col-sm-1">
                  <a
                    href="javascript:void(0)"
                    onClick={() =>
                      TableData(document.getElementById("SampleStatus").value)
                    }
                    className="btn btn-primary btn-sm w-100"
                  >
                    <div className="">{t("Search")}</div>
                  </a>
                </div>
              </div>

              {/* <div className="row" style={{ marginTop: "5px" }}>
                
                <div className="col-sm-1   col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void(0) "
                    onClick={() => TableData(1)}
                    className="btn btn-primary btn-sm w-100"
                  >
                    <div className="  Status-1 center round">Not Collected</div>
                  </a>
                </div>
                <div className="col-sm-1   col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void(0)"
                    onClick={() => TableData(2)}
                    className="btn btn-primary btn-sm w-100"
                  >
                    <div className="  Status-2 center round">Collected</div>
                  </a>
                </div>
                <div className="col-sm-1   col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void(0)"
                    onClick={() => TableData(3)}
                    className="btn btn-primary btn-sm w-100"
                  >
                    <div className="  Status-3 center round">Receive</div>
                  </a>
                </div>

                <div className="col-sm-1   col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void(0)"
                    onClick={() => TableData(4)}
                    className="btn btn-primary btn-sm w-100"
                  >
                    <div className="  Status-4 center round">Rejected</div>
                  </a>
                </div>
                <div className="col-sm-1   col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void(0)"
                    onClick={() => TableData(10)}
                    className="btn btn-primary btn-sm w-100"
                  >
                    <div className="  Status-10 center round">Result Done</div>
                  </a>
                </div>
                <div className="col-sm-1   col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void(0);"
                    onClick={() => TableData(5)}
                    className="btn btn-primary btn-sm w-100"
                  >
                    <div className="  Status-5 center round">Approved</div>
                  </a>
                </div>
                <div className="col-sm-1   col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void(0);"
                    onClick={() => TableData(11)}
                    className="btn btn-primary btn-sm w-100"
                  >
                    <div className="  Status-11 center round">Hold</div>
                  </a>
                </div>
                <div className="col-sm-1   col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void(0);"
                    onClick={() => TableData(14)}
                    className="btn btn-primary btn-sm w-100"
                  >
                    <div className="  Status-14 center round">Re-Run</div>
                  </a>
                </div>
                <div className="col-sm-1   col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void(0);"
                    onClick={() => TableData(13)}
                    className="btn btn-primary btn-sm w-100"
                  >
                    <div className="  Status-13 center round">Mac Data</div>
                  </a>
                </div>
                <div className="col-sm-1   col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void(0)"
                    onClick={() => TableData(15)}
                    className="btn btn-primary btn-sm w-100"
                  >
                    <div className="  Status-15 center round">Dispatched</div>
                  </a>
                </div>

                <div className="col-sm-1   col-xs-3 searchboxFontSize">
                  <a
                    href="javascript:void(0)"
                    onClick={() => TableData("")}
                    className="btn btn-primary btn-sm w-100 "
                  >
                    <div className="  Status-all center round ">All</div>
                  </a>
                </div>
              </div> */}
            </div>
          </div>
          {loading ? (
            <Loading />
          ) : (
            load && (
              <div className="box mb-4">
                <div
                  className=" box-body divResult boottable table-responsive"
                  id="no-more-tables"
                >
                  <BootTable
                    redata={redata}
                    GetResultEntry={GetResultEntry}
                    show={setShow4}
                    show2={setShow6}
                  />
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        //  result
        <div className="container-fluid" style={{ padding: "10px" }}>
          {show.moadal && (
            <ResultEntryEditModal
              show={show}
              handleClose={() => {
                setShow({ moadal: false, data: {} });
              }}
              handleSave={handleSave}
            />
          )}

          {show2.moadal && (
            <ResultEditAddModal
              show={show2}
              handleClose={() => {
                setShow2({ moadal: false, data: {} });
              }}
              handleSave={handleSave}
            />
          )}

          {show3?.modal && (
            <TemplateMasterModal
              show={show3}
              handleClose={() => {
                setShow3({ modal: false, data: {} });
              }}
              handleSave={handleSave}
            />
          )}

          {show5?.modal && (
            <UploadModal
              show={show5?.modal}
              handleClose={() =>
                setShow5({ modal: false, data: "", pageName: "" })
              }
              documentId={show5.data}
              pageName={show5?.pageName}
            />
          )}

          {/* <div className="card shadow mb-4"> */}
          {/* <div className="card-header py-3 mb-4">
              <span className="m-0 font-weight-bold text-primary">
                Result Entry
              </span>
            </div> */}

          <div className="box py-3 mx-3">
            <span className="m-0 font-weight-bold ">
              <div className="row">
                <div className="col-sm-2">
                  <span className="fa fa-folder"> &nbsp;</span>
                  <span className="mx-2" style={{ color: "#9a9797 " }}>
                    {ResultData[0]?.LedgerTransactionNo}
                  </span>
                </div>

                <div className="col-sm-2">
                  <span className="fa fa-user-md">&nbsp;</span>
                  <span className="mx-2" style={{ color: "#9a9797 " }}>
                    {ResultData[0]?.PName}
                  </span>
                </div>

                <div className="col-sm-2">
                  <span className="fa fa-book">&nbsp; </span>
                  <span className="mx-2" style={{ color: "#9a9797 " }}>
                    {ResultData[0]?.PatientCode}
                  </span>
                </div>

                <div className="col-sm-2">
                  <span className="fa fa-calendar-check-o "> &nbsp; </span>
                  <span style={{ color: "#9a9797 " }}>
                    {ResultData[0]?.Age}
                  </span>{" "}
                  <span className="fa fa-street-view"> &nbsp; </span>
                  <span style={{ color: "#9a9797 " }}>
                    {ResultData[0]?.Gender}
                  </span>
                </div>
                <div className="col-sm-4">
                  <span className="fa fa-h-square">&nbsp; </span>
                  <span className="mx-2" style={{ color: "#9a9797 " }}>
                    {ResultData[0]?.Centre}
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="col-sm-2">
                  <span className="fa fa-user-md">&nbsp; </span>
                  <span className="mx-2" style={{ color: "#9a9797 " }}>
                    {ResultData[0]?.ReferDoctor}
                  </span>
                </div>
                <div className="col-sm-2">
                  <span className="fa fa-calendar-check-o">&nbsp; </span>
                  <span className="mx-2" style={{ color: "#9a9797 " }}>
                    {dateConfig(ResultData[0]?.RegDate)}
                  </span>
                </div>
                <div className="col-sm-4">
                  <span className="fa fa-plus-square">&nbsp; </span>
                  <span className="mx-2" style={{ color: "#9a9797 " }}>
                    {ResultData[0]?.RateType}
                  </span>
                </div>
              </div>
              <div className="row">
                <div className="d-flex my">
                  {ResultTestData?.map((data, index) => (
                    <div
                      key={index}
                      className={` round font-weight-bold mx-2  px-3 py-2  Status-${data.Status}`}
                    >
                      {data?.PackageName}
                    </div>
                  ))}
                </div>
              </div>
            </span>
          </div>

          <div className="box mb-4">
            <div
              className=" box-body divResult boottable table-responsive"
              id="no-more-tables"
            >
              <table
                className="table table-bordered table-hover table-striped tbRecord"
                cellPadding="{0}"
                cellSpacing="{0}"
              >
                <thead class="cf">
                  <tr>
                    <th>{t("#")}</th>
                    <th>{t("TestName")}</th>
                    <th>{t("Value")}</th>
                    <th>{t("Comment")}</th>
                    <th>{t("Flag")}</th>
                    <th>{t("Mac Reading")}</th>
                    <th>{t("MachineName")}</th>
                    <th>{t("Method Name")}</th>
                    <th>{t("Ref Range")}</th>
                    <th>{t("Unit")}</th>
                    <th>{t("Action")}</th>
                    <th>{t("Rerun")}</th>
                  </tr>
                </thead>
                <tbody>
                  {ResultTestData?.map((Hdata, Hindex) => (
                    <>
                      <tr key={Hindex} style={{ backgroundColor: "lightgrey" }}>
                        <td data-title={t("#")}>
                          <Input
                            type="checkbox"
                            onChange={(e) =>
                              handleCheckbox(e, -1, Hdata.TestID)
                            }
                            checked={
                              ResultData?.length > 0
                                ? isChecked(
                                    "isChecked",
                                    ResultData,
                                    true,
                                    Hdata.TestID
                                  ).includes(false)
                                  ? false
                                  : true
                                : false
                            }
                            disabled={Hdata?.Status === 5 ? true : false}
                            // disabled={Hdata?.Status === 5 && true}
                            name="isChecked"
                          />
                        </td>
                        <td colSpan={4} data-title={t("TestName")}>
                          <span className="invName">{Hdata?.PackageName}</span>
                        </td>
                        <td data-title={t("Value")}>
                          <span className="fa fa-barcode">&nbsp;</span>
                          <b>{Hdata?.SINNO}</b>
                        </td>
                        <td colSpan="5" data-title={t("Comment")}>
                          {(Hdata?.Status === 3 ||
                            Hdata.Status === 10 ||
                            Hdata?.Status === 14) && (
                            <>
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                  setShow5({
                                    modal: true,
                                    data: Hdata?.TestIDHash,
                                    pageName: "Add Report",
                                  });
                                }}
                              >
                                {t("Add Report")}
                              </button>
                              &nbsp;
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() => {
                                  setShow5({
                                    modal: true,
                                    data: Hdata?.TestIDHash,
                                    pageName: "Add Attachment",
                                  });
                                }}
                              >
                                {t("Add Attachment")}
                              </button>
                              &nbsp;
                              <button
                                className="btn btn-primary btn-sm"
                                onClick={() =>
                                  setShow2({
                                    moadal: true,
                                    data: { ...Hdata, pageName: "All" },
                                  })
                                }
                              >
                                {t("Add Comment")}
                              </button>
                              &nbsp;
                            </>
                          )}
                          {Hdata?.Status === 5 &&
                            buttonsData?.map(
                              (ele, index) =>
                                ele?.AccessBy === "Not Approved" && (
                                  <button
                                    className="btn btn-success btn-sm"
                                    type="button"
                                    id="btnMainList"
                                    key={index}
                                    onClick={() =>
                                      handleResultSubmit(ele?.AccessBy, Hdata)
                                    }
                                  >
                                    {ele?.AccessBy}
                                  </button>
                                )
                            )}
                          &nbsp;
                          {Hdata?.Status === 11 &&
                            buttonsData?.map(
                              (ele, index) =>
                                ele?.AccessBy === "Unhold" && (
                                  <button
                                    className="btn btn-success"
                                    type="button"
                                    id="btnMainList"
                                    key={index}
                                    onClick={() =>
                                      handleResultSubmit(ele?.AccessBy, Hdata)
                                    }
                                  >
                                    {ele?.AccessBy}
                                  </button>
                                )
                            )}
                          {Hdata?.InvestigationID == 370 && (
                            <>
                              <Input
                                type="checkbox"
                                checked={DlcCheckChecked}
                                onChange={(e) => {
                                  setDlcCheckChecked(e?.target?.checked);
                                }}
                              />
                              <label style={{ alignSelf: "flex-end" }}>
                                {t("DLC Check")}
                              </label>
                            </>
                          )}
                        </td>
                        <td data-title={t("Flag")}>
                          <Input
                            type="checkbox"
                            onChange={(e) =>
                              handleCheckbox(e, -1, Hdata.TestID)
                            }
                            checked={
                              ResultData?.length > 0
                                ? isChecked(
                                    "RerunIscheck",
                                    ResultData,
                                    true,
                                    Hdata.TestID
                                  ).includes(false)
                                  ? false
                                  : true
                                : false
                            }
                            name="RerunIscheck"
                          />
                        </td>
                      </tr>
                      {ResultData?.map((datanew, index) => (
                        <>
                          {Hdata.TestID === datanew.TestID && (
                            <tr key={index}>
                              <td data-title={t("#")}>
                                <Input
                                  type="checkbox"
                                  checked={datanew?.isChecked}
                                  onChange={(e) => handleCheckbox(e, index)}
                                  name="isChecked"
                                  disabled={true}
                                />
                              </td>
                              <td data-title={t("TestName")}>
                                <span
                                  style={{ cursor: "pointer" }}
                                  data-toggle="tooltip"
                                  data-placement="top"
                                  title={
                                    datanew?.isMandatory === 1
                                      ? "Required Field"
                                      : datanew?.dlcCheck === 1
                                      ? "DLC Parameter"
                                      : datanew?.Formula != ""
                                      ? "Calculated Field"
                                      : ""
                                  }
                                  className={`${
                                    datanew?.isMandatory === 1
                                      ? "required my"
                                      : "my"
                                  } ${
                                    datanew?.dlcCheck === 1
                                      ? "bg-yellow-new my"
                                      : "my"
                                  }`}
                                >
                                  <span
                                    className={`${
                                      datanew?.Formula != ""
                                        ? "Formula my"
                                        : "my"
                                    } `}
                                  >
                                    {datanew?.TestName}
                                  </span>
                                </span>
                              </td>

                              {datanew?.Header === 0 ? (
                                <>
                                  {["2", "3"].includes(datanew?.ReportType) ? (
                                    <td
                                      style={{
                                        fontSize: "15px",
                                        cursor: "pointer",
                                      }}
                                      onClick={() =>
                                        setShow3({
                                          modal: true,
                                          data: datanew,
                                        })
                                      }
                                      data-title={t("Action")}
                                    >
                                      +
                                    </td>
                                  ) : datanew?.dlcCheck === 1 ? (
                                    datanew?.IsHelpMenu === 0 ? (
                                      <td data-title={t("Value")}>
                                        <input
                                          type="text"
                                          className={`form-control input-sm ${
                                            parseFloat(datanew?.Value) >
                                            parseFloat(datanew?.MaxValue)
                                              ? "high"
                                              : parseFloat(datanew?.Value) <
                                                parseFloat(datanew?.MinValue)
                                              ? "low"
                                              : ""
                                          } `}
                                          name="Value"
                                          value={datanew?.Value}
                                          onChange={(e) =>
                                            handleCheckbox(
                                              e,
                                              index,
                                              datanew?.TestID,
                                              datanew?.MinValue,
                                              datanew?.MaxValue
                                            )
                                          }
                                          onKeyUp={(e) =>
                                            handleKeyUp(
                                              e,
                                              myRefs.current[
                                                index === ResultData.length - 1
                                                  ? 0
                                                  : index + 1
                                              ]
                                            )
                                          }
                                          ref={(el) =>
                                            (myRefs.current[index] = el)
                                          }
                                        />
                                      </td>
                                    ) : (
                                      <td data-title={t("Value")}>
                                        <Input
                                          type="text"
                                          className={`form-control input-sm ${
                                            parseFloat(datanew?.Value) >
                                            parseFloat(datanew?.MaxValue)
                                              ? "high"
                                              : parseFloat(datanew?.Value) <
                                                parseFloat(datanew?.MinValue)
                                              ? "low"
                                              : ""
                                          }`}
                                          name="Value"
                                          value={datanew?.Value}
                                          onChange={(e) =>
                                            handleCheckbox(
                                              e,
                                              index,
                                              datanew?.TestID,
                                              datanew?.MinValue,
                                              datanew?.MaxValue
                                            )
                                          }
                                          onKeyUp={(e) =>
                                            handleKeyUp(
                                              e,
                                              myRefs.current[
                                                index === ResultData.length - 1
                                                  ? 0
                                                  : index + 1
                                              ]
                                            )
                                          }
                                          ref={(el) =>
                                            (myRefs.current[index] = el)
                                          }
                                        />
                                      </td>
                                    )
                                  ) : datanew?.IsHelpMenu === 0 ? (
                                    <td data-title={t("Value")}>
                                      <Input
                                        type="text"
                                        className={`form-control input-sm ${
                                          parseFloat(datanew?.Value) >
                                          parseFloat(datanew?.MaxValue)
                                            ? "high"
                                            : parseFloat(datanew?.Value) <
                                              parseFloat(datanew?.MinValue)
                                            ? "low"
                                            : ""
                                        }`}
                                        name="Value"
                                        value={datanew?.Value}
                                        onChange={(e) =>
                                          handleCheckbox(
                                            e,
                                            index,
                                            datanew?.TestID,
                                            datanew?.MinValue,
                                            datanew?.MaxValue
                                          )
                                        }
                                        onKeyUp={(e) =>
                                          handleKeyUp(
                                            e,
                                            myRefs.current[
                                              index === ResultData.length - 1
                                                ? 0
                                                : index + 1
                                            ]
                                          )
                                        }
                                        ref={(el) =>
                                          (myRefs.current[index] = el)
                                        }
                                      />
                                    </td>
                                  ) : (
                                    <td data-title={t("Value")}>
                                      <div style={{ position: "relative" }}>
                                        <input
                                          type="text"
                                          className={`form-control input-sm ${
                                            parseFloat(datanew?.Value) >
                                            parseFloat(datanew?.MaxValue)
                                              ? "high"
                                              : parseFloat(datanew?.Value) <
                                                parseFloat(datanew?.MinValue)
                                              ? "low"
                                              : ""
                                          }`}
                                          name="Value"
                                          value={datanew?.Value}
                                          onChange={(e) =>
                                            handleCheckbox(
                                              e,
                                              index,
                                              datanew?.TestID,
                                              datanew?.MinValue,
                                              datanew?.MaxValue
                                            )
                                          }
                                          onKeyDown={(e) => {
                                            getHelpMenuData(
                                              e,
                                              datanew?.labObservationID
                                            );
                                            handleIndex(e, index);
                                          }}
                                          onKeyUp={(e) =>
                                            handleKeyUp(
                                              e,
                                              myRefs.current[
                                                index === ResultData.length - 1
                                                  ? 0
                                                  : index + 1
                                              ]
                                            )
                                          }
                                          ref={(el) =>
                                            (myRefs.current[index] = el)
                                          }
                                        />

                                        {helpmenu.length > 0 &&
                                          helpmenu[0]?.Value ==
                                            datanew?.labObservationID &&
                                          HiddenDropDownHelpMenu && (
                                            <ul
                                              className="suggestion-data"
                                              style={{
                                                width: "100%",
                                                right: "0px",
                                                border: "1px solid #dddfeb",
                                              }}
                                            >
                                              {helpmenu.map(
                                                (data, helpmenuindex) => (
                                                  <li
                                                    onClick={() =>
                                                      handleListSearch(
                                                        data,
                                                        "Value",
                                                        index
                                                      )
                                                    }
                                                    key={helpmenuindex}
                                                    className={`${
                                                      helpmenuindex ===
                                                        indexMatch &&
                                                      "matchIndex"
                                                    }`}
                                                  >
                                                    {data?.label}
                                                  </li>
                                                )
                                              )}
                                            </ul>
                                          )}
                                      </div>
                                    </td>
                                  )}
                                  {["2", "3"].includes(datanew?.ReportType) ? (
                                    <td></td>
                                  ) : (
                                    <td
                                      style={{ position: "relative" }}
                                      data-title={t("Action")}
                                    >
                                      <div className="d-flex align-items-center">
                                        <div
                                          className="mx-2"
                                          style={{
                                            cursor: "pointer",
                                            fontSize: "15px",
                                          }}
                                          onClick={() =>
                                            setShow2({
                                              moadal: true,
                                              data: {
                                                ...datanew,
                                                pageName: "Single",
                                              },
                                            })
                                          }
                                        >
                                          +
                                        </div>
                                        <span
                                          className="fa fa-exclamation-triangle mx-2"
                                          aria-hidden="true"
                                          style={{
                                            cursor: "pointer",
                                            fontSize: "15px",
                                            width: "35px",
                                            padding: "5px 10px",
                                          }}
                                          onMouseEnter={() => {
                                            setMouseHover({
                                              index: index,
                                              data: [],
                                            });
                                            DeltaResponse(datanew);
                                          }}
                                          onMouseLeave={() => {
                                            setMouseHover({
                                              index: -1,
                                              data: [],
                                            });
                                          }}
                                        >
                                          {mouseHover?.index === index &&
                                            PreviousTestResult.length > 0 && (
                                              <div
                                                style={{
                                                  position: "absolute",
                                                  width: "650px",
                                                  left: "60px",
                                                }}
                                                className="resultEntryCssTable"
                                              >
                                                <table
                                                  className="table table-bordered table-hover table-striped tbRecord"
                                                  cellPadding="{0}"
                                                  cellSpacing="{0}"
                                                >
                                                  <thead className="cf">
                                                    <tr>
                                                      <th>Booking Date</th>
                                                      <th>Test</th>
                                                      <th>Value</th>
                                                      <th>Unit</th>
                                                      <th>Min</th>
                                                      <th>Max</th>
                                                    </tr>
                                                  </thead>
                                                  <tbody>
                                                    {PreviousTestResult.map(
                                                      (ele, index) => (
                                                        <tr key={index}>
                                                          <td data-title="BookingDate">
                                                            {dateConfig(
                                                              ele?.BookingDate
                                                            )}
                                                          </td>
                                                          <td data-title="LabObservationName">
                                                            {ele?.LabObservationName
                                                              ? ele?.LabObservationName
                                                              : "-"}
                                                          </td>
                                                          <td data-title="Value">
                                                            {ele?.Value
                                                              ? ele?.Value
                                                              : "-"}
                                                          </td>
                                                          <td data-title="ReadingFormat">
                                                            {ele?.ReadingFormat
                                                              ? ele?.ReadingFormat
                                                              : "-"}
                                                          </td>
                                                          <td data-title="MinValue">
                                                            {ele?.MinValue
                                                              ? ele?.MinValue
                                                              : "-"}
                                                          </td>
                                                          <td data-title="MaxValue">
                                                            {ele?.MaxValue
                                                              ? ele?.MaxValue
                                                              : "-"}
                                                          </td>
                                                        </tr>
                                                      )
                                                    )}
                                                  </tbody>
                                                </table>
                                              </div>
                                            )}
                                        </span>
                                      </div>
                                    </td>
                                  )}
                                  {["2", "3"].includes(datanew?.ReportType) ? (
                                    <td> &nbsp;</td>
                                  ) : (
                                    <td
                                      className="w-50p"
                                      data-title={t("Flag")}
                                    >
                                      <select value={datanew?.Flag} disabled>
                                        <option hidden></option>
                                        <option value="Normal">Normal</option>
                                        <option value="High">High</option>
                                        <option value="Low">Low</option>
                                      </select>
                                    </td>
                                  )}
                                  <td data-title={t("Mac Reading")}> &nbsp;</td>
                                  <td data-title={t("MachineName")}> &nbsp;</td>
                                  {["2", "3"].includes(datanew?.ReportType) ? (
                                    <td data-title=""> &nbsp;</td>
                                  ) : (
                                    <td data-title={t("Method Name")}>
                                      {datanew?.MethodName} &nbsp;
                                    </td>
                                  )}
                                  {["2", "3"].includes(datanew?.ReportType) ? (
                                    <td data-title=""> &nbsp;</td>
                                  ) : (
                                    <td data-title="DisplayReading">
                                      {datanew?.DisplayReading} &nbsp;
                                    </td>
                                  )}
                                  {["2", "3"].includes(datanew?.ReportType) ? (
                                    <td data-title=""> &nbsp;</td>
                                  ) : (
                                    <td data-title={t("ReadingFormat")}>
                                      {datanew?.ReadingFormat} &nbsp;
                                    </td>
                                  )}
                                  {["2", "3"].includes(datanew?.ReportType) ? (
                                    <td data-title=""> &nbsp;</td>
                                  ) : (
                                    <td data-title={t("Edit")}>
                                      <div
                                        className="text-primary"
                                        style={{
                                          cursor: "pointer",
                                          textDecoration: "underline",
                                        }}
                                        onClick={() =>
                                          setShow({
                                            moadal: true,
                                            data: datanew,
                                          })
                                        }
                                      >
                                        {t("Edit")}
                                      </div>
                                    </td>
                                  )}
                                  <td data-title={t("RerunIscheck")}>
                                    <Input
                                      type="checkbox"
                                      checked={datanew?.RerunIscheck}
                                      onChange={(e) => handleCheckbox(e, index)}
                                      name="RerunIscheck"
                                    />
                                  </td>
                                </>
                              ) : (
                                <td colSpan="10" data-title="">
                                  {" "}
                                  &nbsp;
                                </td>
                              )}
                            </tr>
                          )}
                        </>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>

              <div className="row mt-3" style={{ textWrap: "avoid" }}>
                {loading ? (
                  <div className="mx-3">
                    <Loading />
                  </div>
                ) : (
                  <div className="col-sm-12 col-xs-12">
                    <button
                      className="previous roundarrow btn-success mx-2"
                      onClick={() => {
                        ResultData.length > 0 &&
                          GetResultEntry(
                            ResultData[0]?.LedgerTransactionID - 1
                          );
                      }}
                    >
                      ‹
                    </button>
                    <button
                      className="next roundarrow btn-success mx-2"
                      onClick={() => {
                        ResultData.length > 0 &&
                          GetResultEntry(
                            ResultData[0]?.LedgerTransactionID + 1
                          );
                      }}
                    >
                      ›
                    </button>
                    {["", 3, 10, 11, 13, 14, 15].includes(statusValue) && (
                      <button
                        className="btn btn-primary mx-2 my-1 my btn-sm"
                        onClick={() => handleResultSubmit("Save")}
                      >
                        {/* {t("Save")} */}
                        save
                      </button>
                    )}

                    <button
                      className="btn btn-primary mx-2 my-1 my btn-sm"
                      type="button"
                      id="btnMainList"
                      onClick={() => {
                        setResultData([]);
                      }}
                    >
                      {t("Main List")}
                    </button>
                    <select
                      className="my-1 mx-2 p-1 my input-sm"
                      id="ApprovedBy"
                      name="ApprovedBy"
                      onChange={handleDoctorName}
                    >
                      <option hidden>--{t("Select")}--</option>
                      {doctorAdmin.map((ele, index) => (
                        <option key={index} value={ele?.value}>
                          {ele?.label}
                        </option>
                      ))}
                    </select>
                    {PrintReportLoading ? (
                      <Loading />
                    ) : (
                      <button
                        className="btn btn-success btn-sm mx-2 my-1 my"
                        type="button"
                        id="btnMainList"
                        onClick={handleReport}
                      >
                        {t("Print Report")}
                      </button>
                    )}

                    {buttonsData?.map(
                      (ele, index) =>
                        ele?.AccessBy !== "Not Approved" &&
                        ele?.AccessBy !== "Unhold" && (
                          <button
                            className="btn btn-success btn-sm mx-2 my-1 my"
                            type="button"
                            id="btnMainList"
                            key={index}
                            onClick={() => handleResultSubmit(ele?.AccessBy)}
                          >
                            {ele?.AccessBy === "Approved"
                              ? t("Approve")
                              : ele?.AccessBy}
                          </button>
                        )
                    )}
                    {/* 
                    <button
                      className="btn btn-success mx-2 my-1"
                      type="button"
                      id="btnMainList"
                      onClick={() => handleResultSubmit("Approved")}
                    >
                      Approved
                    </button>

                    <button
                      className="btn btn-success mx-2 my-1"
                      type="button"
                      id="btnMainList"
                      onClick={() => handleResultSubmit("Hold")}
                    >
                      Hold
                    </button>

                    <button
                      className="btn btn-success mx-2 my-1 "
                      type="button"
                      id="btnMainList"
                      onClick={() => handleResultSubmit("UnHold")}
                    >
                      Unhold
                    </button> */}

                    {/* <button
                      className="btn btn-success mx-2 my-1"
                      type="button"
                      id="btnMainList"
                      onClick={() => handleResultSubmit("Forward")}
                    >
                      Forward
                    </button>

                    <button
                      className="btn btn-success mx-2 my-1"
                      type="button"
                      id="btnMainList"
                    >
                      Preview
                    </button>
                    <button
                      className="btn btn-success mx-2 my-1"
                      type="button"
                      id="btnMainList"
                    >
                      Deltacheck
                    </button> */}
                    {/* <a className="btn btn-sm w-100 btn-outline-info" id="btnInnerUpload">
                  <span
                    title="Click Here To Upload the Document."
                    className="fas fa-paperclip"
                  >
                    (0)
                  </span>
                </a>
                <a
                  className="btn btn-sm w-100 btn-outline-info"
                  id="btnInnerHistory"
                />
                <a href="javacsript:void">See Medical History</a>
                (0)
                <a
                  className="btn btn-sm w-100 btn-outline-info btnControl"
                  id="btnRerun"
                  href="javascript:void(0)(0);"
                  style={{ display: "none" }}
                >
                  Rerun Test
                </a> */}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* </div> */}
        </div>
      )}
    </>
  );
};

export default ResultEntry;
