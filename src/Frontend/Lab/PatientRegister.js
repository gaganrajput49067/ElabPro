import React, { useEffect, useRef, useState } from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";
import moment from "moment";
import Input from "../../ChildComponents/Input";
import axios from "axios";
import { toast } from "react-toastify";
import PatientRegisterModal from "../util/PatientRegisterModal";
import {
  PreventNumber,
  autocompleteOnBlur,
  checkDuplicateBarcode,
  getAccessCentres,
  getAccessDataRate,
  getBindDiscApproval,
  getBindDiscReason,
  getBindReportDeliveryMethod,
  getCollectionBoy,
  getDoctorSuggestion,
  getPaymentModes,
  getTrimmedData,
  getVisitType,
  isChecked,
} from "../util/Commonservices";
import RegsiterTable from "./RegsiterTable";
import { number } from "../util/Commonservices/number";
import Loading from "../util/Loading";
import UploadModal from "../util/UploadModal";
import MedicialModal from "../util/MedicialModal";
import MobileDataModal from "../util/MobileDataModal";
import { stateIniti, LTDataIniti } from "../../ChildComponents/Constants";
import { useLocation } from "react-router-dom";
import {
  PatientRegisterSchema,
  checkEmploypeeWiseDiscount,
} from "../../ValidationSchema";
import { useFormik } from "formik";
import RequiredModal from "../util/RequiredModal";
import DatePicker from "../Components/DatePicker";
import BarcodeLogicModal from "../util/BarcodeLogicModal";
import { useMemo } from "react";
import { hanlderSpecialCharacter } from "../util/Commonservices/Pattern";
import { useTranslation } from "react-i18next";

const PatientRegister = () => {
  const { t } = useTranslation();
  const [RadioDefaultSelect, setRadioDefaultSelect] = useState("Age");
  const [AgeWiseDiscountDropdown, setAgeWiseDiscountDropdown] = useState([]);
  const [Gender, setGender] = useState([]);
  const [Title, setTitle] = useState([]);
  const [Identity, setIdentity] = useState([]);
  const [PaymentMode, setPaymentMode] = useState([]);
  const [BankName, setBankName] = useState([]);
  const [CollectionBoy, setCollectionBoy] = useState([]);
  const [visibleFields, setVisibleFields] = useState([]);
  const [RateType, setRateType] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [VisitType, setVisitType] = useState([]);
  const [throughMobileData, setThroughMobileData] = useState(false);
  const [DateData, setDateData] = useState({
    AgeYear: "",
    AgeMonth: "",
    AgeMonth: "",
  });
  const [paid, setPaid] = useState(0);
  const [BindDiscApproval, setBindDiscApproval] = useState([]);
  const [BindDiscReason, setBindDiscReason] = useState([]);
  const [BindReportDeliveryMethod, setBindReportDeliveryMethod] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [disAmt, setdisAmt] = useState("");
  const [documentId, setDocumentID] = useState("");
  const [PatientSource, setPatientSource] = useState([]);
  const [PatientType, setPatientType] = useState([]);
  const [mobleData, setMobileData] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  const [BarcodeLogic, setBarcodeLogic] = useState(0);
  const [UploadDoumentType, setUploadDoumentType] = useState([""]);
  //search state
  const [searchForm, setSearchForm] = useState({
    TestName: "",
    CentreID: "",
    InvestigationID: "",
  });
  // const [doctorSearch, setDoctorSearch] = useState("");
  const [dropFalse, setDropFalse] = useState(true);
  //modal state
  const [show, setShow] = useState(false);
  //table state
  const [tableData, setTableData] = useState([]);
  const [indexMatch, setIndexMatch] = useState(0);
  const [show2, setShow2] = useState(false);
  const [show3, setShow3] = useState(false);
  const [show4, setShow4] = useState(false);
  const [show5, setShow5] = useState({
    modal: false,
    index: -1,
  });
  const [RequiredShow, setRequiredShow] = useState({
    show: false,
    FieldIDs: "",
  });
  const [formData, setFormData] = useState({
    DoctorName: "",
  });
  const [state, setState] = useState(stateIniti);
  const [LTData, setLTData] = useState(LTDataIniti);

  useEffect(() => {
    setLTData({ ...LTData, Adjustment: paid });
  }, [paid]);

  const [PLO, setPLO] = useState([]);
  const location = useLocation();

  const [RcData, setRcData] = useState([
    {
      PayBy: "Patient",
      ReceiptNo: "",
      ledgerNoCr: "",
      RateTypeId: state?.RateID,
      PaymentMode: "Cash",
      PaymentModeID: 134,
      Amount: "",
      BankName: "",
      CardDate: "",
      CardNo: "",
      CentreID: LTData?.CentreID,
    },
  ]);

  const handleCityState = (id, name) => {
    axios
      .post("/api/v1/Centre/getRateTypeDetailWithCentre", {
        CentreID: id,
      })
      .then((res) => {
        setState({
          ...state,
          [name]: id,
          PinCode: res?.data?.message[0]?.Pincode,
          City: res?.data?.message[0]?.City,
          State: res?.data?.message[0]?.State,
          Country: res?.data?.message[0]?.Country,
        });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong."
        );
      });
  };

  const PaymentData = () => {
    //sahil
    let match = false;
    if (handleRateTypePaymode !== "Credit") {
      const data = ["Cash", "Online Payment", "Paytm"];
      for (let i = 0; i < RcData.length; i++) {
        if (!data.includes(RcData[i].PaymentMode)) {
          if (
            RcData[i].CardDate === "" ||
            RcData[i]?.CardNo === "" ||
            RcData[i]?.BankName === ""
          ) {
            match = true;
          }
        }
      }
    }
    return match;
  };

  useEffect(() => {
    if (handleRateTypePaymode === "Cash") {
      if (RcData.length === 1) {
        let data = RcData.map((ele) => {
          return {
            ...ele,
            Amount: LTData?.NetAmount
              ? parseFloat(LTData?.NetAmount).toFixed(2)
              : "",
          };
        });
        setRcData(data);
      }
    }
  }, [LTData?.NetAmount]);

  useEffect(() => {
    if (handleRateTypePaymode === "Cash") {
      setRcData([
        {
          PayBy: "Patient",
          ReceiptNo: "",
          ledgerNoCr: "",
          RateTypeId: state?.RateID,
          PaymentMode: "Cash",
          PaymentModeID: 134,
          Amount: LTData?.NetAmount
            ? Number(LTData?.NetAmount).toFixed(2)
            : "0.00",
          BankName: "",
          CardDate: "",
          CardNo: "",
          CentreID: LTData?.CentreID,
        },
      ]);
    }
  }, [LTData?.DiscountOnTotal]);

  useEffect(() => {
    setLTData({
      ...LTData,
      PName:
        state?.Title +
        " " +
        state?.FirstName +
        " " +
        state?.MiddleName +
        " " +
        state?.LastName,
      Age: state?.Age,
      Gender: state?.Gender,
      RateTypeId: state?.RateID,
      VIP: state?.isVIP,
    });

    const data = RcData.map((ele) => {
      return {
        ...ele,
        CentreID: LTData?.CentreID,
        RateTypeId: state?.RateID,
        PaymentMode: handleRateTypePaymode === "Credit" ? "Credit" : "Cash",
        PaymentModeID: handleRateTypePaymode === "Credit" ? 215 : 134,
      };
    });
    setRcData(data);
  }, [state]);

  const handleMainChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "Mobile" && value.length === 10) {
      axios
        .post("/api/v1/CommonController/CheckInvalidMobileNo", {
          MobileNo: value,
        })
        .then((res) => {})

        .catch((err) => {
          console.log(err);
          if (err?.response?.data?.message >= 1) {
            toast.error("Invalid number");
            setState({ ...state, [name]: "" });
          } else {
            setState({ ...state, [name]: value });
          }
        });
      return;
    }

    setState({
      ...state,
      [name]:
        type === "checkbox"
          ? checked
            ? 1
            : 0
          : ["FirstName", "MiddleName", "LastName"].includes(name)
          ? PreventNumber(value.toUpperCase())
            ? value.toUpperCase()
            : state[name]
          : value,
    });
  };

  const getSubtractType = (name) => {
    return name === "AgeYear"
      ? "years"
      : name === "AgeMonth"
      ? "months"
      : "days";
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

    setLTData({
      ...LTData,
      Age: `${duration?._data?.years} Y ${duration._data?.months} M ${duration?._data?.days} D`,
    });

    setTableData([]);
    setRcData([
      {
        PayBy: "Patient",
        ReceiptNo: "",
        ledgerNoCr: "",
        RateTypeId: state?.RateID,
        PaymentMode: handleRateTypePaymode === "Credit" ? "Credit" : "Cash",
        PaymentModeID: handleRateTypePaymode === "Credit" ? 215 : 134,
        CardDate: "",
        CardNo: "",
        BankName: "",
        Amount: "",
        CentreID: LTData?.CentreID,
      },
    ]);
  };

  useEffect(() => {
    if (state?.isVIP === 0) {
      setState({ ...state, IsMask: 0 });
    }
  }, [state?.isVIP]);

  const handleChange = (event) => {
    if (disAmt || discountPercentage) {
      toast.error("remove Disamt or Discount Percentage to Add");
      return;
    }
    if (!state?.Age) {
      toast.error("Please choose DOB || Age");
    } else {
      const { name, value } = event.target;
      setSearchForm({ ...searchForm, [name]: value });
    }
  };

  const handleSelectChange = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    if (name === "CentreID") {
      setSearchForm({ ...searchForm, [name]: value });
      setLTData({ ...LTData, [name]: value, CentreName: label });
    }

    if (name === "PatientIDProof") {
      setLTData({ ...LTData, [name]: value });
    }

    if (name === "VisitType") {
      setLTData({ ...LTData, [name]: value });
      fetchFields(value);
    }

    if (name === "ReportDeliveryMethodId") {
      setLTData({ ...LTData, [name]: value });
    }

    if (name === "DiscountApprovedBy") {
      if (value) {
        checkEmploypeeWiseDiscount(LTData, value)
          .then((res) => {
            setLTData({ ...LTData, [name]: value });
          })
          .catch((err) => {
            toast.error(err);
            setLTData({ ...LTData, [name]: "" });
          });
      } else {
        setLTData({ ...LTData, [name]: "" });
      }
    }

    if (name === "DiscountReason") {
      setLTData({ ...LTData, [name]: value });
    }

    if (name === "CollectionBoyId") {
      setLTData({ ...LTData, [name]: value });
    } else {
      if (name === "RateID") {
        const data = RateType.find((ele) => ele?.value == value);
        setBarcodeLogic(Number(data?.BarcodeLogic));
        handleCityState(value, name);
      }
      setState({
        ...state,
        [name]: value,
      });
    }
  };

  const handleSelectNew = (event) => {
    const { name, value } = event?.target;
    setLTData({ ...LTData, [name]: value });
  };

  useEffect(() => {
    fetchFields(LTData?.VisitType);
  }, []);

  const findGender = () => {
    const male = ["Mr.", "Baba","Dr.(Mr)","Master" ];
    const female = ["Miss.", "Mrs.", "Baby", "Dr.(Miss)","Dr.(Mrs)"];

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
    setLTData({
      ...LTData,
      Age: `${years} Y ${months} M ${days} D`,
    });
    setTableData([]);
    setRcData([
      {
        PayBy: "Patient",
        ReceiptNo: "",
        ledgerNoCr: "",
        RateTypeId: state?.RateID,
        PaymentMode: handleRateTypePaymode === "Credit" ? "Credit" : "Cash",
        PaymentModeID: handleRateTypePaymode === "Credit" ? 215 : 134,
        CardDate: "",
        CardNo: "",
        BankName: "",
        Amount: "",
        CentreID: LTData?.CentreID,
      },
    ]);
  };

  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };

  const guidNumber = () => {
    const guidNumber =
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4();
    setDocumentID(guidNumber);
  };

  useEffect(() => {
    guidNumber();
  }, []);

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
            if (suggestion.length > 0) {
              handleListSearch(suggestion[indexMatch], name);
            }
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

  // scroll view

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
        getTableData(data);
        break;
      case "DoctorName":
        setFormData({ ...formData, [name]: data.Name });
        setLTData({
          ...LTData,
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

  const handleLTData = (e) => {
    const { name, value } = e.target;
    setLTData({
      ...LTData,
      [name]: value,
    });
  };

  useEffect(() => {
    getDoctorSuggestion(formData, setDoctorSuggestion, setFormData);
  }, [formData?.DoctorName]);

  const getSuggestion = () => {
    if (searchForm.CentreID || LTData?.CentreID) {
      if (searchForm.TestName.length >= 3) {
        axios
          .post("/api/v1/TestData/BindBillingTestData", {
            TestName: searchForm.TestName,
            CentreID: LTData?.RateTypeId,
          })
          .then((res) => {
            setSuggestion(res?.data?.message);
          })
          .catch((err) => {
            toast.error(err?.response?.data?.message);
            setSearchForm({ ...searchForm, TestName: "" });
          });
      } else {
        setSuggestion([]);
      }
    } else {
      if (searchForm.TestName !== "") {
        toast.error("please Select center");
        setSearchForm({ ...searchForm, TestName: "" });
      }
    }
  };

  const getBarcode = (id) => {
    let barcode = "";
    if (BarcodeLogic === 3) {
      barcode = tableData[0]?.BarcodeNo;
    } else if (BarcodeLogic === 4) {
      tableData?.map((ele) => {
        if (ele?.SampleTypeID === id) {
          barcode = ele?.BarcodeNo;
        }
      });
    }
    return barcode;
  };

  const getTableData = (data) => {
    const ItemIndex = tableData.findIndex(
      (e) => e.InvestigationID === data.InvestigationID
    );
    if (ItemIndex === -1) {
      axios
        .post("/api/v1/TestData/BindSingleTestData", {
          InvestigationID: data.InvestigationID,
          CentreID: data?.CentreID,
        })
        .then((res) => {
          const { genderCheck, ageCheck, message } = CheckageTest(
            res?.data?.message[0]?.Gender,
            res?.data?.message[0]?.ToAge,
            res?.data?.message[0]?.FromAge
          );

          if (genderCheck && ageCheck) {
            setTableData([
              ...tableData,
              {
                ...res?.data?.message[0],
                Discount: "",
                Rate: Number(res?.data?.message[0].Rate).toFixed(2),
                NetAmount: Number(res?.data?.message[0].Rate).toFixed(2),
                IsSampleCollected: "N",
                Status: 1,
                IsUrgent: 0,
                UrgentDateTime: "",
                BarcodeNo: getBarcode(res?.data?.message[0]?.SampleTypeID),
              },
            ]);
          } else {
            !genderCheck &&
              toast.error("This Test is Not for " + state?.Gender);
            !ageCheck && toast.error(message);
          }
        })
        .catch((err) => console.log(err));
    } else {
      toast.error("Duplicate Text Found");
    }
  };

  const handlePLOChange = (e, index, main) => {
    const { name, checked } = !main && e.target;
    if (index >= 0) {
      const data = [...tableData];
      if (main) {
        data[index]["IsUrgent"] = 0;
        data[index]["UrgentDateTime"] = "";
      } else if (name === "Status") {
        data[index][name] = checked ? 2 : 1;
        data[index]["IsSampleCollected"] = checked ? "S" : "N";
        if ([3, 4].includes(BarcodeLogic)) {
          if (checked) {
            setShow5({ modal: true, index: index });
          } else {
            setShow5({ modal: false, index: index });
          }
        }
      } else {
        data[index][name] = checked ? 1 : 0;
        if (!checked) {
          data[index]["UrgentDateTime"] = "";
        }
      }
      setTableData(data);
    } else {
      const val = tableData.map((ele) => {
        return {
          ...ele,
          Status: checked ? 2 : 1,
          IsSampleCollected: checked ? "S" : "N",
        };
      });
      setTableData(val);
    }
  };

  const handleCloseBarcodeModal = (value) => {
    if (value?.length >= 3) {
      checkDuplicateBarcode(value, "").then((res) => {
        console.log(res);
        if (res === "") {
          setShow5({ modal: false, index: -1 });
        } else {
          toast.error(res);
        }
      });
    } else if (value === "") {
      toast.error("This Field Required");
    } else {
      toast.error("Minimum 3 Char is Required");
    }
  };

  const handleDiscountAgeWiseItem = () => {
    axios
      .post("/api/v1/PatientRegistration/DiscountTypeByAge", {
        Age: state?.AgeYear,
        Gender: state?.Gender,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            label: ele?.DiscountType,
            value: ele?.DiscountId,
            perCentage: ele?.DiscountPer,
          };
        });

        val?.unshift({
          label: "Select Discount",
          value: "",
          perCentage: "",
        });

        console.log(val);
        setAgeWiseDiscountDropdown(val);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleUrgent = (value, index, mainClose) => {
    const data = [...tableData];
    if (mainClose) {
      data[index]["UrgentDateTime"] = "";
      setTableData(data);
    } else {
      data[index]["UrgentDateTime"] = value;
      setTableData(data);
    }
  };

  const handleDiscount = (value, index) => {
    if (disAmt === "" && discountPercentage === "") {
      const data = [...tableData];
      data[index]["Discount"] = value;
      data[index]["NetAmount"] = data[index]["Rate"] - value;
      setTableData(data);
    } else {
      toast.error("Discount already given");
    }
  };

  useEffect(() => {
    if (
      (disAmt == 0 || disAmt === "") &&
      (discountPercentage == 0 || discountPercentage === "")
    ) {
      let total = tableData.reduce((acc, item) => acc + Number(item.Rate), 0);
      let NetTotal = tableData.reduce(
        (acc, item) => acc + Number(item.NetAmount),
        0
      );

      setLTData({
        ...LTData,
        GrossAmount: total,
        NetAmount: NetTotal,
        DiscountOnTotal: total > 0 && NetTotal > 0 ? total - NetTotal : "",
      });
    }
  }, [tableData]);

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

  useEffect(() => {
    getSuggestion();
  }, [searchForm.TestName]);

  const getRequiredAttachment = () => {
    axios
      .post("/api/v1/Global/GetGlobalData", {
        Type: "RequiredAttachment",
      })
      .then((res) => {
        let data = res.data.message;
        let RequiredAttachment = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        return setIdentity(RequiredAttachment);
      })
      .catch((err) => console.log(err));
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
        !["Title", "PaymentMode"].includes(name) &&
          value.unshift({ label: `Select ${name} `, value: "" });

        switch (name) {
          case "Gender":
            setGender(value);
            break;
          case "Title":
            setTitle(value);

            break;
          case "PaymentMode":
            setPaymentMode(value);
            break;
          case "BankName":
            setBankName(value);
            break;
          default:
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  //Modal show

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleShowMobile = () => {
    if (state?.Mobile?.length === 10) {
      getDataByMobileNo("Mobile");
    }
    // setShow4(true)
  };

  const handleFilter = (data) => {
    // InvestigationID
    if (disAmt || discountPercentage) {
      toast.error("First Remove Disc per Or Discount Percentage");
    } else {
      const value = tableData.filter(
        (ele) => ele.InvestigationID !== data.InvestigationID
      );
      setTableData(value);
      toast.success("successfully Removed");
      setRcData([
        {
          PayBy: "Patient",
          ReceiptNo: "",
          ledgerNoCr: "",
          RateTypeId: state?.RateID,
          PaymentMode: handleRateTypePaymode === "Credit" ? "Credit" : "Cash",
          PaymentModeID: handleRateTypePaymode === "Credit" ? 215 : 134,
          Amount: "",
          BankName: "",
          CardDate: "",
          CardNo: "",
          CentreID: LTData?.CentreID,
        },
      ]);
    }
  };

  useEffect(() => {
    let data = tableData.map((ele) => {
      return {
        IsSampleCollected: ele?.IsSampleCollected,
        IsSampleRequired:ele?.IsSampleRequired,
        Status: ele?.Status,
        IsUrgent: ele?.IsUrgent,
        sampleTypeID: ele?.SampleTypeID,
        SampleTypeName: ele?.SampleName,
        ItemId: ele?.InvestigationID,
        ItemName: ele?.TestName,
        InvestigationID: ele?.InvestigationID,
        InvestigationName: ele?.TestName,
        ReportType: ele?.ReportType,
        IsPackage: ele?.DataType === "Package" ? 1 : 0,
        Rate: Number(ele?.Rate).toFixed(2),
        Amount: Number(ele?.NetAmount).toFixed(2),
        Quantity: 1,
        PCCDiscAmt: 0,
        PCCDiscPer: 0,
        RateTypeId: state?.RateID,
        DiscountAmt: ele?.Discount,
        DiscountApprovedBy: LTData?.DiscountApprovedBy,
        DiscountReason: LTData?.DiscountReason,
        IsReporting: "1",
        ageInDays: state?.TotalAgeInDays,
        Gender: state?.Gender,
        CentreID: LTData?.CentreID,
        SessionCentreID: window.sessionStorage.getItem("DefaultCentre"),
        TestCentreID: 0,
        SampleBySelf: "1",
        sampleCollectionBy: 0,
        DeliveryDate: "",
        BarcodeNo: ele?.BarcodeNo,
        UrgentDateTime: ele?.UrgentDateTime,
        DepartmentID: ele?.DepartmentID,
        isHistoryReq: 0,
        PackageCode: "",
        PackageName: "",
        TestCode: ele?.TestCode,
      };
    });
    setPLO(data);
  }, [tableData]);

  const handleChangePloBarCode = (e, sampletypeId) => {
    const { value } = e.target;
    if (BarcodeLogic === 3) {
      const data = tableData.map((ele) => {
        return {
          ...ele,
          BarcodeNo: value,
        };
      });
      setTableData(data);
    }
    if (BarcodeLogic === 4) {
      let flag = true;
      for (let i = 0; i < tableData.length; i++) {
        if (
          tableData[i]?.SampleTypeID !== sampletypeId &&
          value !== "" &&
          value === tableData[i]?.BarcodeNo
        ) {
          flag = false;
          break;
        }
      }
      if (flag) {
        const data = tableData.map((ele) => {
          if (ele?.SampleTypeID === sampletypeId) {
            return {
              ...ele,
              BarcodeNo: value,
            };
          } else {
            return ele;
          }
        });
        setTableData(data);
      } else {
        toast.error("This BarCode is Already Given");
      }
    }
  };

  useEffect(() => {
    if (state?.AgeYear !== "") {
      handleDiscountAgeWiseItem();
    }
  }, [state?.AgeYear, state?.Gender]);

  useEffect(() => {
    getAccessCentres(setCentreData, LTData, setLTData);
    getCollectionBoy(setCollectionBoy, true);
    getDropDownData("Gender");
    getDropDownData("Title");
    getDropDownData("Identity");
    getDropDownData("PaymentMode");
    getDropDownData("BankName");
    getVisitType(setVisitType);
    getBindDiscApproval(setBindDiscApproval);
    getBindDiscReason(setBindDiscReason);
    getBindReportDeliveryMethod(setBindReportDeliveryMethod, true);
    getPaymentModes("Source", setPatientSource);
    getPaymentModes("PatientType", setPatientType);
    getRequiredAttachment();
  }, []);

  useEffect(() => {
    if (!isSubmit) {
      if (LTData?.CentreID) {
        getAccessDataRate(setRateType, LTData?.CentreID).then((res) => {
          setState({ ...state, RateID: res[0]?.value });
          handleCityState(res[0]?.value, "RateID");
          setBarcodeLogic(Number(res[0]?.BarcodeLogic));
        });
      }
    }
  }, [LTData?.CentreID, isSubmit]);

  useEffect(() => {
    let totaldiscount = (LTData.GrossAmount * discountPercentage) / 100;
    let disamount = LTData.GrossAmount - totaldiscount;

    setLTData({
      ...LTData,
      NetAmount: disamount,
      DiscountOnTotal: totaldiscount,
    });
    const data = PLO.map((ele) => {
      return {
        ...ele,
        Amount: Number(
          ele.Rate - (ele.Rate * discountPercentage) / 100
        ).toFixed(2),
        DiscountAmt: ((ele.Rate * discountPercentage) / 100).toFixed(2),
      };
    });
    setPLO(data);
  }, [discountPercentage]);

  useEffect(() => {
    setLTData({ ...LTData, NetAmount: LTData.GrossAmount - disAmt });
  }, [disAmt]);

  const Match = () => {
    let match = false;
    for (var i = 0; i < tableData.length; i++) {
      if (tableData[i].Discount !== "") {
        match = true;
        break;
      }
    }
    return match;
  };

  const handlePaymentChange = (event) => {
    const { value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    let match = false;
    for (var i = 0; i < RcData.length; i++) {
      if (RcData[i].PaymentMode === label) {
        match = true;
        break;
      }
    }
    if (!match) {
      setRcData([
        ...RcData,
        {
          PayBy: "Patient",
          ReceiptNo: "",
          ledgerNoCr: "",
          RateTypeId: state?.RateID,
          PaymentMode: label,
          PaymentModeID: value,
          CardNo: "",
          CardDate: "",
          BankName: "",
          Amount: "",
          CentreID: LTData?.CentreID,
        },
      ]);
    } else {
      toast.error("Payment Mode is Already Added");
    }
  };

  const handleFilterPayment = (index) => {
    if (RcData.length > 1) {
      const data = RcData.filter((ele, i) => index !== i);
      setRcData(data);
      toast?.success("Removed Successfully");
    }
  };
  const calculate = (value, index) => {
    let data = [...RcData];
    data[index]["Amount"] = value;
    const sum = data.reduce((a, item) => Number(item.Amount) + a, 0);
    setPaid(Number(sum).toFixed(2));
    return sum;
  };

  useEffect(() => {
    if (RcData.length === 1) {
      const sum = RcData.reduce((a, item) => Number(item.Amount) + a, 0);
      setPaid(sum);
    }
  }, [RcData]);

  const handleClose2 = () => {
    setShow2(false);
  };

  const handleClose3 = () => {
    setShow3(!show3);
  };

  const getDataByMobileNo = (type) => {
    if (type === "Mobile") {
      if (state?.Mobile.length === 10) {
        axios
          .post("/api/v1/Booking/getDataByMobileNo", {
            Mobile: state?.Mobile,
            PatientCode: "",
          })
          .then((res) => {
            setMobileData(res.data.message);
            setShow4(true);
          })
          .catch((err) => console.log(err));
      }
    } else {
      axios
        .post("/api/v1/Booking/getDataByMobileNo", {
          Mobile: "",
          PatientCode: state?.PatientCode,
        })
        .then((res) => {
          setMobileData(res.data.message);
          setShow4(true);
        })
        .catch((err) => console.log(err));
    }
  };

  const handlePatientData = (e, type) => {
    const keypress = [9, 13];
    if (keypress.includes(e.which)) {
      e.preventDefault();
      getDataByMobileNo(type);
    }
  };

  const handleClose4 = () => {
    setShow4(false);
  };

  const handleSelctData = (data) => {
    const centreName = CentreData?.find((ele) => ele.value === data.CentreID);
    const { years, months, days } = calculateDOB(new Date(data?.DOB));
    setState({
      ...state,
      Title: data.Title,
      FirstName: data.FirstName,
      LastName: data?.LastName,
      MiddleName: data?.MiddleName,
    //  CentreID: data?.CentreID,
   //   RateID: data?.RateTypeId,
      Gender: data?.Gender,
      DOB: new Date(data?.DOB),
      Age: data?.Age,
      PatientCode: data?.PatientCode,
      Email: data?.Email,
      PinCode: data?.Pincode,
      AgeDays: days,
      AgeMonth: months,
      AgeYear: years,
      HouseNo: data?.HouseNo,
      City: data?.City,
      State: data?.State,
      Country: data?.Country,
      StreetName: data?.StreetName,
      IsMask: data?.IsMask,
      isVIP: data?.IsVIP,
      Locality: data?.Locality,
      TotalAgeInDays: calculateTotalNumberOfDays(new Date(data?.DOB)),
    });

    // setLTData({
    //   ...LTData,
    // //  CentreName: centreName.label,
    //   CentreID: centreName.value,
    // });
    handleClose4();
    setThroughMobileData(true);
    setMobileData([]);
  };

  const DynamicFieldValidations = () => {
    const data = visibleFields.map((ele) => {
      if (
        ele["IsMandatory"] == 1 &&
        ele["IsVisible"] == 1 &&
        LTData[ele["FieldType"]] === ""
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

  const getReceipt = (id) => {
    axios
      .post("/reports/v1/getReceipt", {
        LedgerTransactionIDHash: id,
      })
      .then((res) => {
        window.open(res?.data?.Url, "_blank");
      })
      .catch((err) => {
        toast.error(
          err?.data?.response?.message
            ? err?.data?.response?.message
            : "Error Occured"
        );
      });
  };
console.log(state)
  const handleSubmitApi = () => {
    const { DocumentFlag, message } = handleFileValidationUpload();
    if (!filterUnPaidRcData()) {
      if (DocumentFlag) {
        setIsSubmit(true);
        axios
          .post("/api/v1/PatientRegistration/SaveData", {
            PatientData: getTrimmedData({
              ...state,
              CentreID: LTData?.CentreID,
            }),
            LTData: getTrimmedData({
              ...LTData,
              LedgerTransactionIDHash: documentId,
            }),
            PLO: getTrimmedData(PLO),
            DocumentDetail: {
              DocumentID: "",
            },
            patientMedical: {
              PatientGuid: "",
            },
            RcData: RcData,
            FieldIds: "",
            mandatoryFields: [],
          })
          .then((res) => {
            toast.success(res.data.message);
            setState(stateIniti);
            setLTData(LTDataIniti);
            setPLO([]);
            setRcData([
              {
                PayBy: "Patient",
                ReceiptNo: "",
                ledgerNoCr: "",
                RateTypeId: state?.RateID,
                PaymentMode: "Cash",
                PaymentModeID: 134,
                BankName: "",
                CardDate: "",
                CardNo: "",
                Amount: "",
                CentreID: LTData?.CentreID,
              },
            ]);
            setFormData({
              DoctorName: "",
            });
            setTableData([]);
            setIsSubmit(false);
            setThroughMobileData(false);
            getAccessCentres(setCentreData, LTData, setLTData);
            getReceipt(res?.data?.ledgertransactionID);
            guidNumber();
          })
          .catch((err) => {
            toast.error("Something Went Wrong");
           // setIsSubmit(false);
          });
      } else {
        toast.error(`${message} is Required Document`);
      }
    } else {
      toast.error("please Enter Amount to continue");
    }
  };

  const { errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: { ...state, ...LTData, ...formData },
    enableReinitialize: true,
    validationSchema: PatientRegisterSchema,
    onSubmit: (values) => {
      const data = DynamicFieldValidations();
      setVisibleFields(data);
      const flag = data.filter((ele) => ele?.isError === true);
      const match = Match();
      const paymentCheck = PaymentData();
      if (flag.length === 0) {
        if (PLO.length > 0) {
          if (valiateProofID()) {
            if (!paymentCheck) {
              if (disAmt || discountPercentage || match) {
                if (
                  LTData?.DiscountId ||
                  (LTData?.DiscountApprovedBy && LTData?.DiscountReason)
                ) {
                  handleSubmitApi();
                } else {
                  toast.error(
                    "Please Choose Dicount Approval And Discount Reason"
                  );
                }
              } else {
                handleSubmitApi();
              }
            } else {
              toast.error("Please Fill All The Required Fields");
            }
          } else {
            toast.error("Please Enter Identity No");
          }
        } else {
          toast.error("Please Select Test");
        }
      }
    },
  });

  console.log(errors);

  useEffect(() => {
    if (tableData.length === 0) {
      setPaid(0);
    }
  }, [tableData]);

  useEffect(() => {
    const data = PLO.map((ele) => {
      return {
        ...ele,
        DiscountReason: LTData?.DiscountReason,
        DiscountApprovedBy: LTData?.DiscountApprovedBy,
      };
    });
    setPLO(data);
  }, [LTData?.DiscountReason, LTData?.DiscountApprovedBy]);

  const handleRequiredModal = () => {
    if (tableData.length > 0) {
      let val = "";
      for (let i = 0; i < tableData.length; i++) {
        val =
          val === ""
            ? `${tableData[i].InvestigationID}`
            : `${val},${tableData[i].InvestigationID}`;
      }

      return new Promise((resolve, reject) => {
        axios
          .post("/api/v1/TestData/GetFieldIds", {
            invIds: "3306,2",
            isEditPage: false,
          })
          .then((res) => {
            resolve(res?.data?.message[0]);
          })
          .catch((err) => {
            reject(err);
          });
      });
    } else {
      toast.error("please Select one Test");
    }
  };

  useEffect(() => {
    if (tableData?.length === 0) {
      setdisAmt("");
      setDiscountPercentage("");
    }
  }, [tableData]);

  useEffect(() => {
    setTableData([]);
    setRcData([
      {
        PayBy: "Patient",
        ReceiptNo: "",
        ledgerNoCr: "",
        RateTypeId: state?.RateID,
        PaymentMode: handleRateTypePaymode === "Credit" ? "Credit" : "Cash",
        PaymentModeID: handleRateTypePaymode === "Credit" ? 215 : 134,
        BankName: "",
        CardNo: "",
        CardDate: "",
        Amount: "",
        CentreID: LTData?.CentreID,
      },
    ]);
  }, [LTData?.CentreID, state?.RateID, state?.Gender]);

  const handleChangeRTCData = (e, index) => {
    const { name, value } = e.target;
    const data = [...RcData];
    data[index][name] = value;
    setRcData(data);
  };

  const handleUploadCount = (name, value, secondName) => {
    setLTData({
      ...LTData,
      [name]: value,
      [secondName]: value === 0 ? 0 : 1,
    });
  };

  const getDocumentType = (data) => {
    setUploadDoumentType(data);
  };

  const handleBarcodeUpperClose = (index, sampletypeId) => {
    if (BarcodeLogic === 3) {
      const data = tableData.map((ele) => {
        return {
          ...ele,
          BarcodeNo: "",
          Status: 1,
          IsSampleCollected: "N",
        };
      });
      setTableData(data);
      setShow5({ modal: false, index: index });
    }
    if (BarcodeLogic === 4) {
      const data = tableData.map((ele) => {
        if (ele?.SampleTypeID === sampletypeId) {
          return {
            ...ele,
            BarcodeNo: "",
            Status: 1,
            IsSampleCollected: "N",
          };
        } else {
          return ele;
        }
      });
      setShow5({ modal: false, index: index });
      setTableData(data);
    }
  };

  const handleFileValidationUpload = () => {
    let requiredDocument = [];
    let DocumentFlag = true;
    let message = "";
    tableData.map((ele) => {
      if (ele.RequiredAttachment !== "") {
        requiredDocument.push(ele.RequiredAttachment);
      }
    });

    for (let i = 0; i < requiredDocument.length; i++) {
      if (!UploadDoumentType.includes(requiredDocument[i])) {
        DocumentFlag = false;
        message = requiredDocument[i];
        break;
      }
    }

    return {
      DocumentFlag,
      message,
    };
  };

  const valiateProofID = () => {
    let validate = true;
    if (LTData?.PatientIDProof && LTData?.PatientIDProofNo.length < 5) {
      validate = false;
    }
    return validate;
  };

  const findMRPAndRateEstimate = () => {
    let MRP = 0;
    let Rate = 0;
    for (let i = 0; i < tableData?.length; i++) {
      MRP = MRP + Number(tableData[i]["Rate"]);
      Rate = Rate + Number(tableData[i]["NetAmount"]);
    }
    return { MRP, Rate };
  };

  const filterUnPaidRcData = () => {
    let paymentFlag = false;
    if (handleRateTypePaymode !== "Credit") {
      for (let i = 0; i < RcData.length; i++) {
        if (RcData[i]["Amount"] === "") {
          paymentFlag = true;
          break;
        }
      }
    }
    return paymentFlag;
  };

  const CheckageTest = (gender, ToAge, FromAge) => {
    let genderCheck = false;
    let ageCheck = true;
    let message = "";
    genderCheck = [state?.Gender, "Both"].includes(gender) ? true : false;

    if (state?.TotalAgeInDays > ToAge) {
      ageCheck = false;
      message = "Your age is greater than this test maximum age";
    }

    if (state?.TotalAgeInDays < FromAge) {
      ageCheck = false;
      message = "Your age is Less than this test Minimum age";
    }

    return {
      genderCheck: genderCheck,
      ageCheck: ageCheck,
      message: message,
    };
  };

  const handleLockRegistation = useMemo(() => {
    const data = RateType.find((ele) => ele?.value == state?.RateID);
    return [0, null].includes(data?.LockRegistration) ? false : true;
  }, [state?.RateID, RateType]);

  const handleRateTypePaymode = useMemo(() => {
    const data = RateType.find((ele) => ele?.value == state?.RateID);
    return data?.PayMode;
  }, [state?.RateID, RateType]);

  console.log(state?.AgeMonth);

  return (
    <>
      <div className="box box-success form-horizontal" data-select2-id="18">
        {show && <PatientRegisterModal show={show} handleClose={handleClose} />}
        {show2 && (
          <UploadModal
            options={Identity}
            show={show2}
            handleClose={handleClose2}
            documentId={documentId}
            pageName="Patient Registration"
            handleUploadCount={handleUploadCount}
            getDocumentType={getDocumentType}
          />
        )}
        {show3 && (
          <MedicialModal
            show={show3}
            handleClose={handleClose3}
            MedicalId={documentId}
            handleUploadCount={handleUploadCount}
          />
        )}
        {RequiredShow.show && (
          <RequiredModal
            RequiredShow={RequiredShow}
            handleClose={() => {
              setRequiredShow({
                show: false,
                FieldIDs: "",
              });
            }}
          />
        )}
        {mobleData.length > 0 && show4 && (
          <MobileDataModal
            show={show4}
            mobleData={mobleData}
            handleClose4={handleClose4}
            handleSelctData={handleSelctData}
          />
        )}

        <div className="box-header with-border">
          {location?.state?.data ? (
            <h3 className="box-title">{t("Estimate")}</h3>
          ) : (
            <h3 className="box-title">
              {t("Patient Registration")}
              {handleLockRegistation && (
                <strong className="blink" style={{ marginLeft: "10px" }}>
                  {t("Registration is Locked")}
                </strong>
              )}
            </h3>
          )}
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
                selectedValue={LTData?.CentreID}
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Rate Type")} :
            </label>
            <div className="col-sm-2">
              <SelectBox
                options={RateType}
                formdata={state.RateID}
                selectedValue={state?.RateID}
                name="RateID"
                onChange={handleSelectChange}
              />
            </div>

            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Visit Type")} :
            </label>
            {/* {location?.state?.data !== "EstimateSearch" && ( */}
            <div className="col-sm-2">
              <SelectBox
                className="required"
                options={VisitType}
                selectedValue={LTData?.VisitType}
                name="VisitType"
                onChange={handleSelectChange}
              />
            </div>
            {/* )} */}
            <div className="col-sm-3 ">
              <div className="d-flex">
                <button
                  className="btn  btn-info w-100 btn-sm mx-2"
                  id="btnUpload"
                  type="button"
                  onClick={() => {
                    setShow2(true);
                  }}
                >
                  {t("Upload Document")}
                  <i className="fa fa-paperclip fa-sm"></i>
                  <span id="spnCount"> ({LTData?.UploadDocumentCount})</span>
                </button>

                <button
                  className="btn  btn-info w-100 btn-sm mx-2"
                  id="btnUpload"
                  type="submit"
                  onClick={() => {
                    handleClose3();
                  }}
                >
                  {t("See Medical History")}
                  <span id="spnMedicalCount">
                    ({LTData?.MedicalHistoryCount})
                  </span>
                </button>
              </div>
            </div>
            {/* button */}
          </div>

          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Mobile No")}:
            </label>

            <div className="col-sm-2">
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Input
                  className="select-input-box form-control input-sm required"
                  name="Mobile"
                  type="number"
                  required
                  onInput={(e) => number(e, 10)}
                  onKeyDown={(e) => handlePatientData(e, "Mobile")}
                  id="Mobile"
                  value={state.Mobile}
                  disabled={throughMobileData}
                  onBlur={handleBlur}
                  onChange={handleMainChange}
                />

                <div className="input-group-append MobileView">
                  <button
                    className=" btn-primary btn-sm"
                    id="mobiledatamodal"
                    type="button"
                    onClick={handleShowMobile}
                  >
                    <i className="fa fa-plus-circle fa-sm"></i>
                  </button>
                </div>
                {errors?.Mobile && touched?.Mobile && (
                  <div className="golbal-Error">{errors?.Mobile}</div>
                )}
              </div>
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("UHID")} :
            </label>
            {/* {location?.state?.data !== "EstimateSearch" && ( */}
            <div className="col-sm-2  ">
              <Input
                className="select-input-box form-control input-sm"
                id="UHID"
                max={15}
                disabled={state?.Mobile}
                value={state?.PatientCode}
                name="PatientCode"
                type="text"
                onInput={(e) => number(e, 10)}
                onKeyDown={(e) => handlePatientData(e, "PatientCode")}
                onChange={handleMainChange}
              />
            </div>
            {/* )} */}

            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("PreBooking No")} :
            </label>
            {/* {location?.state?.data !== "EstimateSearch" && ( */}
            <div className="col-sm-2  ">
              <Input
                className="select-input-box form-control input-sm"
                // id="UHID"
                max={15}
                disabled
                // value={state?.PatientCode}
                // name="UHID"
                type="text"
              />
            </div>
            {/* )} */}

            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Referred Doc")} :
            </label>
            {/* {location?.state?.data !== "EstimateSearch" && ( */}
            <div className="col-sm-2">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Input
                  autoComplete="off"
                  className="select-input-box form-control input-sm"
                  name="DoctorName"
                  type="text"
                  value={formData?.DoctorName}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      DoctorName: e.target.value,
                    });
                    setDropFalse(true);
                  }}
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
                  onKeyDown={handleIndex}
                  // onBlur={() => {
                  //   setDoctorSuggestion([]);
                  // }}
                />
                {dropFalse && doctorSuggestion.length > 0 && (
                  <ul className="suggestion-data">
                    {doctorSuggestion.map((data, index) => (
                      <li
                        onClick={() => handleListSearch(data, "DoctorName")}
                        className={`${index === indexMatch && "matchIndex"}`}
                        key={index}
                      >
                        {data?.Name}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="input-group-append">
                  <button
                    className=" btn-primary btn-sm"
                    id="NewReferDoc"
                    type="button"
                    onClick={handleShow}
                  >
                    <i className="fa fa-plus-circle fa-sm"></i>
                  </button>
                </div>
              </div>
              <div>
                {(errors?.DoctorID || errors?.DoctorName) &&
                  (touched?.DoctorID || touched?.DoctorName) && (
                    <div className="golbal-Error">
                      {errors?.DoctorID || errors?.DoctorName}
                    </div>
                  )}
              </div>
            </div>
            {/* )} */}
          </div>

          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("First Name")} :
            </label>

            <div className="col-sm-2">
              <div className="d-flex">
                <div style={{ width: "50%" }}>
                  <SelectBox
                    options={Title}
                    name="Title"
                    isDisabled={throughMobileData}
                    selectedValue={state?.Title}
                    onChange={handleSelectChange}
                  />
                </div>
                <div style={{ width: "50%" }}>
                  <Input
                    className="select-input-box form-control input-sm required"
                    name="FirstName"
                    type="text"
                    max={35}
                    disabled={throughMobileData}
                    required
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
                max={35}
                onChange={handleMainChange}
              />
            </div>

            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Last Name")} :
            </label>
            <div className="col-sm-2">
              <Input
                className="select-input-box form-control input-sm"
                id="LastName"
                max={50}
                name="LastName"
                type="text"
                value={state?.LastName}
                disabled={throughMobileData}
                onChange={handleMainChange}
              />
            </div>

            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Gender")} :
            </label>
            <div className="col-sm-2  ">
              <SelectBox
                options={Gender}
                className="required"
                isDisabled={
                  ["Baby"].includes(state?.Title)
                    ? false
                    : state?.Title
                    ? true
                    : false
                }
                name="Gender"
                selectedValue={state?.Gender}
                onChange={handleSelectChange}
              />
            </div>
          </div>

          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Age")} :
              <input
                type="radio"
                name="AgeWise"
                value={"Age"}
                checked={RadioDefaultSelect === "Age" ? true : false}
                onChange={(e) => {
                  setRadioDefaultSelect(e.target.value);
                }}
              />
            </label>
            <div className="col-sm-2">
              <div className="input-group-append d-flex">
                <Input
                  className="select-input-box form-control input-sm"
                  style={{ width: "10px" }}
                  id="AgeY"
                  name="AgeYear"
                  type="number"
                  onInput={(e) => number(e, 3, 120)}
                  value={state?.AgeYear}
                  disabled={
                    RadioDefaultSelect === "DOB"
                      ? true
                      : throughMobileData
                      ? true
                      : state?.AgeMonth
                      ? true
                      : state?.AgeDays
                      ? true
                      : false
                  }
                  onChange={handleDOBCalculation}
                />
                <span className="input-group-text select-input-box form-control input-sm justify-content-center">
                  {t("Y")}
                </span>
                <Input
                  className="select-input-box form-control input-sm"
                  id="AgeM"
                  name="AgeMonth"
                  type="number"
                  onInput={(e) => number(e, 2, 12)}
                  disabled={
                    RadioDefaultSelect === "DOB"
                      ? true
                      : throughMobileData
                      ? true
                      : state?.AgeDays
                      ? true
                      : state?.AgeYear
                      ? false
                      : true
                  }
                  value={state?.AgeMonth}
                  onChange={handleDOBCalculation}
                />
                <span className="input-group-text form-control pull-right reprint-date input-sm justify-content-center">
                  {t("M")}
                </span>

                <Input
                  className="select-input-box form-control input-sm"
                  id="AgeD"
                  name="AgeDays"
                  type="number"
                  onInput={(e) => number(e, 2, 31)}
                  value={state?.AgeDays}
                  disabled={
                    RadioDefaultSelect === "DOB"
                      ? true
                      : throughMobileData
                      ? true
                      : state?.AgeMonth
                      ? false
                      : true
                  }
                  onChange={handleDOBCalculation}
                />
                <span className="input-group-text form-control pull-right reprint-date input-sm justify-content-center">
                  {t("D")}
                </span>
              </div>
            </div>

            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Date Of Birth")} :
              <input
                type="radio"
                name="AgeWise"
                value={"DOB"}
                onChange={(e) => {
                  setRadioDefaultSelect(e.target.value);
                }}
                checked={RadioDefaultSelect === "DOB" ? true : false}
              />
            </label>
            <div className="col-sm-2">
              <div>
                <DatePicker
                  name="DOB"
                  date={state?.DOB}
                  disabled={
                    RadioDefaultSelect === "Age" ? true : throughMobileData
                  }
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

            {/* <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Referred Lab")} :
            </label>
           
            <div className="col-sm-2">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                
                <Input
                  autoComplete="off"
                  className="select-input-box form-control input-sm"
                  id="automplete-3"
                  name="ReferLabName"
                  type="text"
                />
                <div className="input-group-append">
                  <button
                    className=" btn-primary btn-sm"
                    id="NewReferDoc"
                    type="button"
                    onClick={handleShow}
                  >
                    <i className="fa fa-plus-circle fa-sm"></i>
                  </button>
                </div>
              </div> 
            </div>*/}

            {/* )} */}
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Email")} :
            </label>
            <div className="col-sm-2">
              <Input
                className="select-input-box form-control input-sm"
                id="Email"
                name="Email"
                type="email"
                required
                value={state?.Email}
                onBlur={handleBlur}
                onChange={handleMainChange}
              />
              {errors?.Email && touched?.Email && (
                <div className="golbal-Error">{errors?.Email}</div>
              )}
            </div>

            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Address")} :
            </label>
            <div className="col-sm-2  ">
              <Input
                className="select-input-box form-control input-sm"
                id="Address"
                max={100}
                name="HouseNo"
                onInput={(e) => hanlderSpecialCharacter(e)}
                type="text"
                value={state?.HouseNo}
                onChange={handleMainChange}
              />
            </div>
          </div>

          <div className="row">
            
            {location?.state?.data !== "EstimateSearch" && (
              <>
                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("PinCode")}:
                </label>

                <div className="col-sm-2  ">
                  <Input
                    className="select-input-box form-control input-sm"
                    name="PinCode"
                    onInput={(e) => number(e, 6)}
                    type="number"
                    value={state?.PinCode}
                    onChange={handleMainChange}
                  />
                </div>
              </>
            )}
            {location?.state?.data !== "EstimateSearch" && (
              <>
                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("City")} :
                </label>

                <div className="col-sm-2  ">
                  {/* <label className="col-sm-1" htmlFor="inputEmail3">
                  City:
                </label> */}

                  <Input
                    className="select-input-box form-control input-sm"
                    id="City"
                    name="City"
                    max={30}
                    type="text"
                    value={state?.City}
                    onChange={handleMainChange}
                  />
                </div>
              </>
            )}
            {location?.state?.data !== "EstimateSearch" && (
              <>
                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("State")} :
                </label>

                <div className="col-sm-2  ">
                  {/* <label className="col-sm-1" htmlFor="inputEmail3">
                  State:
                </label> */}

                  <Input
                    className="select-input-box form-control input-sm"
                    id="State"
                    name="State"
                    type="text"
                    max={30}
                    value={state?.State}
                    onChange={handleMainChange}
                  />
                </div>
              </>
            )}

{location?.state?.data !== "EstimateSearch" && (
              <>
                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Nationality")} :
                </label>

                <div className="col-sm-2  ">
                  {/* <label className="col-sm-1" htmlFor="inputEmail3">
                  Nationality:
                </label> */}

                  <Input
                    className="select-input-box form-control input-sm"
                    name="Country"
                    max={30}
                    value={state?.Country}
                    type="text"
                    onChange={handleMainChange}
                  />
                </div>
              </>
            )}
          </div>

          <div className="row">
            
            {location?.state?.data !== "EstimateSearch" && (
              <>
                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Id Type/ Id No")}.
                </label>

                <div className="col-sm-2">
                  <div className="d-flex">
                    <div style={{ width: "50%" }}>
                      <SelectBox
                        options={[
                          { label: "Choose ID", value: "" },
                          ...Identity,
                        ]}
                        selectedValue={LTData?.PatientIDProof}
                        name="PatientIDProof"
                        onChange={handleSelectChange}
                      />
                    </div>
                    <div style={{ width: "50%" }}>
                      <Input
                        className={`select-input-box form-control input-sm ${
                          LTData?.PatientIDProof && "required"
                        }`}
                        max={20}
                        name="PatientIDProofNo"
                        value={LTData?.PatientIDProofNo}
                        type="text"
                        disabled={LTData?.PatientIDProof === "" ? true : false}
                        onChange={handleLTData}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {location?.state?.data !== "EstimateSearch" && (
              <>
                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Billing Remarks")} :
                </label>

                <div
                  className="col-sm-2"
                  id="OpdNo"
                  ismandatory="true"
                  style={{ display: "block" }}
                >
                  {/* <label className="col-sm-1" htmlFor="inputEmail3">
                  Billing Remarks:
                </label> */}

                  <Input
                    className="select-input-box form-control input-sm"
                    id="Remarks"
                    max={100}
                    name="Remarks"
                    type="text"
                  />
                </div>
              </>
            )}
            {location?.state?.data !== "EstimateSearch" && (
              <>
                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Report Del.Mtd")} :
                </label>

                <div className="col-sm-2">
                  <SelectBox
                    options={[
                      { label: t("Select Report DeliveryMethod"), value: "" },
                      ...BindReportDeliveryMethod,
                    ]}
                    selectedValue={LTData?.ReportDeliveryMethodId}
                    name="ReportDeliveryMethodId"
                    onChange={handleSelectChange}
                  />
                </div>
              </>
            )}

{location?.state?.data !== "EstimateSearch" && (
              <>
                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Collection Boy")} :
                </label>

                <div className="col-sm-2">
                  <SelectBox
                    options={[
                      { label: t("Select CollectionBoy"), value: "" },
                      ...CollectionBoy,
                    ]}
                    selectedValue={LTData?.CollectionBoyId}
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
                </div>
              </>
            )}
          </div>
          <div className="row">
           
            {location?.state?.data !== "EstimateSearch" && (
              <>
                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("RDMD")}:
                </label>

                <div className="col-sm-2  ">
                  {/* <label className="col-sm-1" htmlFor="inputEmail3">
                  Report Delivery Method Detail:
                </label> */}

                  <Input
                    className="select-input-box form-control input-sm"
                    id="ReportDeliveryMethodDetail"
                    max={200}
                    name="ReportDeliveryMethodDetail"
                    value={LTData?.ReportDeliveryMethodDetail}
                    onChange={handleLTData}
                    type="text"
                  />
                </div>
              </>
            )}
            {location?.state?.data !== "EstimateSearch" &&
              visibleFields?.map(
                (data, index) =>
                  data?.IsVisible === 1 && (
                    <>
                      <label className="col-sm-1 " htmlFor="inputEmail3">
                        {data?.FieldType}
                      </label>
                      <div
                        className="col-sm-2"
                        style={{ marginBottom: "5px" }}
                        id="OpdNo"
                        key={index}
                      >
                        {["PatientSource", "PatientType"].includes(
                          data?.FieldType
                        ) ? (
                          <SelectBox
                            className={`${
                              data?.IsMandatory === 1 && "required"
                            }`}
                            options={
                              data?.FieldType === "PatientSource"
                                ? [
                                    { label: "Select", value: "" },
                                    ...PatientSource,
                                  ]
                                : data?.FieldType === "PatientType"
                                ? [
                                    { label: "Select", value: "" },
                                    ...PatientType,
                                  ]
                                : []
                            }
                            selectedValue={LTData[data?.FieldType]}
                            name={data?.FieldType}
                            onChange={handleSelectNew}
                          />
                        ) : (
                          <Input
                            className={`select-input-box form-control input-sm ${
                              data?.IsMandatory === 1 && "required"
                            }`}
                            id="OpdIpd_No"
                            max={30}
                            name={data?.FieldType}
                            value={LTData[data?.FieldType]}
                            onChange={handleLTData}
                            type="text"
                          />
                        )}
                        {data?.isError && (
                          <div className="golbal-Error">{data?.message}</div>
                        )}
                      </div>
                    </>
                  )
              )}
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-sm-6">
          <div className="box box-success">
            <div className=" row box-header with-border">
              <div className="col-sm-8">
                <Input
                  autoComplete="off"
                  className="select-input-box form-control input-sm"
                  name="TestName"
                  placeholder={t("Type Test Name or Test Code")}
                  type="text"
                  value={searchForm?.TestName}
                  onChange={handleChange}
                  onBlur={() => {
                    autocompleteOnBlur(setSuggestion);
                    setTimeout(() => {
                      setSearchForm({ ...searchForm, TestName: "" });
                    }, 500);
                  }}
                  onKeyDown={handleIndex}
                />
                {suggestion.length > 0 && (
                  <ul className="suggestion-data">
                    {suggestion.map((data, index) => (
                      <li
                        onClick={() => handleListSearch(data, "TestName")}
                        key={index}
                        className={`${index === indexMatch && "matchIndex"}`}
                      >
                        {data.TestName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="col-sm-4">
                {location?.state?.data !== "EstimateSearch" && (
                  <div>
                    <label htmlFor="inputEmail3">{t("VIP")}</label>
                    <Input
                      type="checkbox"
                      name="isVIP"
                      onChange={handleMainChange}
                      value={state?.isVIP === 1 ? true : false}
                    />

                    {/* {state?.isVIP === 1 && (
                      <>
                        <label htmlFor="inputEmail3">{t("MASK")}</label>
                        <Input
                          type="checkbox"
                          name="IsMask"
                          onChange={handleMainChange}
                          value={state?.IsMask === 1 ? true : false}
                        />
                      </>
                    )} */}
                  </div>
                )}
              </div>
            </div>
            <div
              className=" box-body divResult table-responsive"
              id="no-more-tables"
              style={{ paddingTop: "3px", paddingBottom: "3px" }}
            >
              <div className="row">
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf">
                    <tr>
                      <th>{t("S.No")}</th>
                      <th>{t("Code")}</th>
                      <th>{t("Item")}</th>
                      <th>{t("View")}</th>
                      <th>{t("Rate")}</th>
                      <th>{t("Disc.")}</th>
                      <th>{t("Amt")}</th>
                      <th>{t("D.Date")}</th>
                      <th>
                        <label>{t("SC")}</label>
                       
                      </th>
                      <th>{t("Urgent")}</th>
                    </tr>
                  </thead>
                  {tableData.length > 0 && (
                    <tbody>
                      {tableData.map((data, index) => (
                        <>
                          {show5?.modal &&
                            index === show5?.index &&
                            [3, 4].includes(BarcodeLogic) && (
                              <BarcodeLogicModal
                                show={show5?.modal}
                                handleClose={handleCloseBarcodeModal}
                                value={data?.BarcodeNo}
                                Id={data?.SampleTypeID}
                                onChange={handleChangePloBarCode}
                                Edit={false}
                                handleMainClose={() =>
                                  handleBarcodeUpperClose(index, data?.Status)
                                }
                              />
                            )}

                          <tr key={index}>
                            <RegsiterTable
                              data={data}
                              index={index}
                              handleFilter={handleFilter}
                              handleDiscount={handleDiscount}
                              handlePLOChange={handlePLOChange}
                              handleUrgent={handleUrgent}
                              handleRateTypePaymode={handleRateTypePaymode}
                            />
                          </tr>
                        </>
                      ))}
                    </tbody>
                  )}
                </table>
              </div>
            </div>
          </div>
        </div>
        {location?.state?.data !== "EstimateSearch" ? (
          <div className="col-sm-6">
            <div className="box box-success">
              <div className="row">
                <div className="col-md-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text font-weight-bold text-info">
                      {t("Total Amount")}
                    </span>
                  </div>
                  <Input
                    className="select-input-box form-control input-sm currency"
                    data-val="false"
                    placeholder={"Total_Amount"}
                    id="Total_Amount"
                    name="Total_Amount"
                    disabled={true}
                    value={Number(LTData?.NetAmount).toFixed(2)}
                    type="text"
                    readOnly="readonly"
                  />
                </div>
                <div className="col-md-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text font-weight-bold text-success">
                      {t("Paid Amount")}
                    </span>
                  </div>
                  <Input
                    className="select-input-box form-control input-sm currency"
                    id="Paid_Amount"
                    name="Paid_Amount"
                    type="number"
                    value={Number(paid).toFixed(2)}
                    readOnly="readonly"
                  />
                </div>

                <div
                  className="col-md-3"
                  style={{ display: "block" }}
                  id="dis_amt"
                >
                  <div className="input-group-prepend">
                    <span className="input-group-text font-weight-bold text-success">
                      {t("Discount Amount")}
                    </span>
                  </div>
                  <Input
                    className="select-input-box form-control input-sm currency"
                    data-val="false"
                    id="DiscountAmt"
                    disabled={
                      tableData?.length > 0
                        ? LTData?.DiscountId
                          ? true
                          : handleRateTypePaymode === "Credit"
                          ? true
                          : LTData?.DiscountApprovedBy
                          ? true
                          : false
                        : true
                    }
                    onInput={(e) => number(e, 20)}
                    value={disAmt}
                    placeholder={t("Dis Amt")}
                    name="disAmt"
                    type="number"
                    onChange={(e) => {
                      let match = Match();
                      if (discountPercentage === "" && !match) {
                        if (LTData?.GrossAmount < Number(e.target.value)) {
                          toast.error(t("please Enter Valid Discount"));
                        } else {
                          setdisAmt(e.target.value);
                          setLTData({
                            ...LTData,
                            DiscountOnTotal: e.target.value,
                          });

                          const findPercentageDiscount = (
                            (e.target.value / LTData?.GrossAmount) *
                            100
                          ).toFixed(2);

                          const data = PLO.map((ele) => {
                            return {
                              ...ele,
                              Amount:
                                ele.Rate -
                                (
                                  (ele.Rate * findPercentageDiscount) /
                                  100
                                ).toFixed(2),
                              DiscountAmt: (
                                (ele.Rate * findPercentageDiscount) /
                                100
                              ).toFixed(2),
                            };
                          });
                          setPLO(data);
                        }
                      } else {
                        toast.error(t("Discount already Given"));
                      }
                    }}
                  />
                </div>
                <div
                  className="col-md-3"
                  style={{ display: "block" }}
                  id="dis_per"
                >
                  <div className="input-group-prepend">
                    <span className="input-group-text font-weight-bold text-success">
                      {t("Discount Percentage")}
                    </span>
                  </div>
                  <Input
                    className="select-input-box form-control input-sm currency"
                    id="DiscountPer"
                    value={discountPercentage}
                    name="DiscountPer"
                    onInput={(e) => number(e, 2)}
                    disabled={
                      tableData?.length > 0
                        ? LTData?.DiscountId
                          ? true
                          : LTData?.DiscountApprovedBy || LTData?.DiscountReason
                          ? handleRateTypePaymode === "Credit"
                            ? true
                            : LTData?.DiscountApprovedBy
                            ? true
                            : false
                          : false
                        : true
                    }
                    placeholder={t("Dis Per")}
                    type="number"
                    onChange={(e) => {
                      let match = Match();
                      if (disAmt === "" && !match) {
                        setDiscountPercentage(e.target.value);
                      } else {
                        toast.error(t("Discount Already Given"));
                      }
                    }}
                  />
                </div>
              </div>

              <div
                className="card-body"
                style={{ paddingTop: "3px", paddingBottom: "3px" }}
              >
                <div className="row p-2">
                  <div className="col-sm-3">
                    <SelectBox
                      options={PaymentMode}
                      selectedValue={RcData[RcData.length - 1].PaymentModeID}
                      onChange={handlePaymentChange}
                      isDisabled={
                        tableData?.length > 0
                          ? handleRateTypePaymode === "Credit"
                            ? true
                            : false
                          : true
                      }
                    />
                  </div>

                  <div className="col-sm-3">
                    <SelectBox
                      options={BindDiscApproval}
                      name="DiscountApprovedBy"
                      selectedValue={LTData?.DiscountApprovedBy}
                      onChange={handleSelectChange}
                      isDisabled={
                        LTData?.DiscountId
                          ? true
                          : LTData?.DiscountOnTotal === "" ||
                            LTData?.DiscountOnTotal == 0
                          ? true
                          : false
                      }
                      // onChange={handlePaymentChange}
                    />
                  </div>
                  <div className="col-sm-3">
                    <SelectBox
                      options={BindDiscReason}
                      name="DiscountReason"
                      selectedValue={LTData?.DiscountReason}
                      onChange={handleSelectChange}
                      isDisabled={
                        LTData?.DiscountId
                          ? true
                          : LTData?.DiscountOnTotal === "" ||
                            LTData?.DiscountOnTotal == 0
                          ? true
                          : false
                      }
                    />
                  </div>
                  {AgeWiseDiscountDropdown.length > 0 && (
                    <div className="col-sm-3 py-4">
                      <SelectBox
                        options={AgeWiseDiscountDropdown}
                        isDisabled={tableData?.length > 0 ? false : true}
                        name="DiscountReason"
                        onChange={(e) => {
                          let match = Match();
                          if (disAmt === "" && !match) {
                            const data = AgeWiseDiscountDropdown.find(
                              (ele) => ele?.value == e.target.value
                            );
                            console.log(data);
                            setDiscountPercentage(data?.perCentage);
                            setLTData({
                              ...LTData,
                              DiscountId: e.target.value,
                              DiscountApprovedBy: "",
                              DiscountReason: "",
                            });
                          } else {
                            toast.error(t("Discount Already Given"));
                          }
                        }}
                        // handleSelectChange}
                        // isDisabled={
                        //   LTData?.DiscountOnTotal === "" ||
                        //   LTData?.DiscountOnTotal == 0
                        //     ? true
                        //     : false
                        // }
                      />
                    </div>
                  )}
                </div>
                {/* <div className="row">
                  <div className="col-sm-3 py-4">
                    <div
                      id="spnFactorConversion"
                      style={{ fontSize: "9px", fontWeight: "500" }}
                    >
                      {LTData?.NetAmount} INR
                    </div>
                    <span
                      id="spnFactorConversion"
                      style={{ fontSize: "9px", fontWeight: "500" }}
                    >
                      1 INR=1.000000 INR
                    </span>
                  </div>

                  
                </div> */}

                <div
                  className=" box-body divResult table-responsive"
                  id="no-more-tables"
                >
                  <table
                    className="table table-bordered table-hover table-striped tbRecord"
                    cellPadding="{0}"
                    cellSpacing="{0}"
                  >
                    <thead className="cf">
                      <tr>
                        <th>{t("Action")}</th>
                        <th>{t("Mode")}</th>
                        <th>{t("Paid Amount")}</th>
                        <th>{t("Currency")}</th>
                        <th>{t("Base")}</th>
                        <th>{t("Bank Name")}</th>
                        <th>{t("Cheque/Card No.")}</th>
                        <th>{t("Cheque Date/Trans No")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RcData?.map((data, index) => (
                        <tr key={index}>
                          <td data-title={t("Action")}>
                            <button
                              id="btndeleterow"
                              className="form-control input-sm btn-danger"
                              onClick={() => handleFilterPayment(index)}
                            >
                              X
                            </button>
                          </td>
                          <td data-title={t("Mode")}>
                            <span id="SpanPaymentMode">
                              {data?.PaymentMode} &nbsp;
                            </span>
                          </td>
                          <td data-title={t("Paid Amount")}>
                            {handleRateTypePaymode === "Credit" ? (
                              ""
                            ) : (
                              <Input
                                className="select-input-box form-control input-sm currency"
                                name="Amount"
                                value={data?.Amount}
                                placeholder={"0.00"}
                                type="number"
                                onChange={(e) => {
                                  let sum = calculate(e.target.value, index);
                                  if (
                                    sum > LTData?.NetAmount ||
                                    e.target.value > LTData?.NetAmount
                                  ) {
                                    toast.error("please enter Collect Amount");
                                    const data = [...RcData];
                                    data[index]["Amount"] = "";
                                    calculate("", index);
                                    setRcData(data);
                                  } else {
                                    const data = [...RcData];
                                    data[index]["Amount"] = e.target.value;
                                    setRcData(data);
                                  }
                                }}
                              />
                            )}
                          </td>
                          <td data-title={t("Currency")}>
                            <span id="SpanCurrency">{t("INR")}</span>
                          </td>
                          <td data-title={t("Base")}>
                            <span id="spnbaseAmount">
                              {data?.Amount} &nbsp;
                            </span>
                          </td>
                          <td data-title={t("Bank Name")}>
                            {["Cash", "Online Payment", "Paytm"].includes(
                              data?.PaymentMode
                            ) ? (
                              ""
                            ) : (
                              <select
                                className="required"
                                name="BankName"
                                value={data?.BankName}
                                disabled={
                                  handleRateTypePaymode === "Credit"
                                    ? true
                                    : false
                                }
                                onChange={(e) => handleChangeRTCData(e, index)}
                              >
                                <option hidden>--Select Bank --</option>
                                {BankName.map((ele, index) => (
                                  <option value={ele.value} key={index}>
                                    {ele.label}
                                  </option>
                                ))}
                              </select>
                            )}
                            &nbsp;
                          </td>
                          <td data-title={t("Cheque/Card No.")}>
                            <Input
                              disabled={
                                ["Cash", "Online Payment", "Paytm"].includes(
                                  data?.PaymentMode
                                )
                                  ? true
                                  : handleRateTypePaymode === "Credit"
                                  ? true
                                  : false
                              }
                              type="text"
                              name="CardNo"
                              value={data?.CardNo}
                              onChange={(e) => handleChangeRTCData(e, index)}
                              className={`select-input-box form-control input-sm ${
                                ["Cash", "Online Payment", "Paytm"].includes(
                                  data?.PaymentMode
                                )
                                  ? ""
                                  : "required"
                              }`}
                            />
                          </td>
                          <td data-title={t("Cheque Date/Trans No")}>
                            <Input
                              disabled={
                                data?.PaymentMode !== "Cash"
                                  ? handleRateTypePaymode === "Credit"
                                    ? true
                                    : false
                                  : true
                              }
                              type={
                                ["Cash", "Online Payment", "Paytm"].includes(
                                  data?.PaymentMode
                                )
                                  ? "text"
                                  : "date"
                              }
                              className={`select-input-box form-control input-sm ${
                                ["Cash", "Online Payment", "Paytm"].includes(
                                  data?.PaymentMode
                                )
                                  ? ""
                                  : "required"
                              }`}
                              name="CardDate"
                              value={data?.CardDate}
                              onChange={(e) => handleChangeRTCData(e, index)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="col-12">
                  <div className="row">
                    <div className="col-sm-2 col-4 mb-2 ">
                      {isSubmit ? (
                        <Loading />
                      ) : (
                        <button
                          type="submit"
                          id="btnSave"
                          disabled={handleLockRegistation}
                          className="btn btn-success w-100 btn-sm"
                          onClick={() => {
                            handleSubmit();
                            window.scrollTo(0, 0);
                          }}
                        >
                          {t("Submit")}
                        </button>
                      )}
                    </div>
                    <div className="col-sm-2 col-4 mb-2 ">
                      <small>
                        {t("Due Amount")} :{" "}
                        {Number(LTData?.NetAmount - paid).toFixed(2)}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="col-sm-6">
            <div className="box box-success shadow">
              <div className="box-header with-border">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="text-primary">
                    {t("Total MRP")} : {findMRPAndRateEstimate().MRP}
                  </div>
                  <div className="text-primary">
                    {t("Total Rate")}: {findMRPAndRateEstimate().Rate}
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    id="btnSave"
                    disabled={handleLockRegistation}
                    className="btn btn-success btn-sm"
                    onClick={() => {
                      handleSubmit();
                      window.scrollTo(0, 0);
                    }}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
    // {/* <SuggestionBox /> */}
  );
};

export default PatientRegister;
