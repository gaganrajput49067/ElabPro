import React, { useEffect, useState } from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";
import moment from "moment";
import Input from "../../ChildComponents/Input";
import { Table } from "react-bootstrap";
import axios from "axios";
import { SimpleCheckbox } from "../../ChildComponents/CheckBox";
import { toast } from "react-toastify";
import PatientRegisterModal from "../util/PatientRegisterModal";
import {
  autocompleteOnBlur,
  checkDuplicateBarcode,
  getAccessCentres,
  getAccessDataRate,
  getBindDiscApproval,
  getBindDiscReason,
  getBindReportDeliveryMethod,
  getCollectionBoy,
  getPaymentModes,
  getTrimmedData,
  getVisitType,
  isChecked,
  selectedValueCheck,
} from "../util/Commonservices";
import RegsiterTable from "./RegsiterTable";
import { number } from "../util/Commonservices/number";
import Loading from "../util/Loading";
import UploadModal from "../util/UploadModal";
import MedicialModal from "../util/MedicialModal";
import MobileDataModal from "../util/MobileDataModal";
import { stateIniti, LTDataIniti } from "../../ChildComponents/Constants";
import { PatientRegisterSchema } from "../../ValidationSchema";
import { useFormik } from "formik";
import RequiredModal from "../util/RequiredModal";
import CustomDate from "../../ChildComponents/CustomDate";
import { useLocation, useNavigate } from "react-router-dom";
import BarcodeLogicModal from "../util/BarcodeLogicModal";
import { useTranslation } from "react-i18next";


const EditPatientDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [Gender, setGender] = useState([]);
  const [Title, setTitle] = useState([]);
  const [Identity, setIdentity] = useState([]);
  const [PaymentMode, setPaymentMode] = useState([]);
  const [BankName, setBankName] = useState([]);
  const [CollectionBoy, setCollectionBoy] = useState([]);
  const [visibleFields, setVisibleFields] = useState([]);
  const [RateType, setRateType] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [PatientSource, setPatientSource] = useState([]);
  const [PatientType, setPatientType] = useState([]);
  const [suggestion, setSuggestion] = useState([]);
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [VisitType, setVisitType] = useState([]);
  const [throughMobileData, setThroughMobileData] = useState(false);
  const [paid, setPaid] = useState(0);
  const [BindDiscApproval, setBindDiscApproval] = useState([]);
  const [BindDiscReason, setBindDiscReason] = useState([]);
  const [BindReportDeliveryMethod, setBindReportDeliveryMethod] = useState([]);
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [disAmt, setdisAmt] = useState("");
  const [documentId, setDocumentID] = useState("");
  const [BarcodeLogic, setBarcodeLogic] = useState(0);
  const [show5, setShow5] = useState({
    modal: false,
    index: -1,
  });

  const { t } = useTranslation();
 

  const [mobleData, setMobileData] = useState([]);
  const [isSubmit, setIsSubmit] = useState(false);
  //search state
  const [searchForm, setSearchForm] = useState({
    TestName: "",
    CentreID: "",
    InvestigationID: "",
  });
  const [UploadDoumentType, setUploadDoumentType] = useState([""]);
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
      CentreID: state?.CentreID,
    },
  ]);

  // const PaymentData = () => {
  //   let match = false;
  //   const data = ["Cash", "Online Payment", "Paytm"];
  //   for (let i = 0; i < RcData.length; i++) {
  //     if (!data.includes(RcData[i].PaymentMode)) {
  //       if (
  //         RcData[i].CardDate === "" ||
  //         RcData[i]?.CardNo === "" ||
  //         RcData[i]?.BankName === ""
  //       ) {
  //         match = true;
  //       }
  //     }
  //   }
  //   return match;
  // };

  useEffect(() => {
    if (RcData.length === 1) {
      let data = RcData.map((ele) => {
        return { ...ele, Amount: LTData?.NetAmount ? LTData?.NetAmount : "" };
      });
      setRcData(data);
    }
  }, [LTData?.NetAmount]);

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
      return { ...ele, CentreID: state?.CentreID, RateTypeId: state?.RateID };
    });
    setRcData(data);
  }, [state]);

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

  useEffect(() => {
    if (state?.isVIP === 0) {
      setState({ ...state, IsMask: 0 });
    }
  }, [state?.isVIP]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSearchForm({ ...searchForm, [name]: value });
  };

  const handleSelectChange = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    if (name === "CentreID") {
      setSearchForm({ ...searchForm, [name]: value });
      setLTData({ ...LTData, [name]: event.value, CentreName: label });
    }

    if (name === "PatientIDProof") {
      setLTData({ ...LTData, [name]: value });
    }

    if (name === "VisitType") {
      setLTData({ ...LTData, [name]: value });
      fetchFields(event.value);
    }

    if (name === "ReportDeliveryMethodId") {
      setLTData({ ...LTData, [name]: value });
    }

    if (name === "DiscountApprovedBy") {
      setLTData({ ...LTData, [name]: value });
    }

    if (name === "DiscountReason") {
      setLTData({ ...LTData, [name]: value });
    }

    if (name === "CollectionBoyId") {
      setLTData({ ...LTData, [name]: value });
    } else {
      setState({
        ...state,
        [name]: value,
      });
    }
  };

  useEffect(() => {
    fetchFields(LTData?.VisitType);
  }, []);

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

  const dateSelect = (value, name) => {
    var diff = moment(moment(), "milliseconds").diff(
      moment(value).format("YYYY-MM-DD")
    );
    var duration = moment.duration(diff);
    setState({
      ...state,
      [name]: value,
      AgeYear: duration?._data?.years,
      AgeMonth: duration._data?.months,
      AgeDays: duration?._data?.days,
      TotalAgeInDays: moment(moment().format("YYYY-MM-DD")).diff(value, "days"),
      Age: `${duration?._data?.years} Y ${duration._data?.months} M ${duration?._data?.days} D`,
    });

    setTableData([]);
    setRcData([
      {
        PayBy: "Patient",
        ReceiptNo: "",
        ledgerNoCr: "",
        RateTypeId: state?.RateID,
        PaymentMode: "Cash",
        PaymentModeID: 134,
        CardDate: "",
        CardNo: "",
        BankName: "",
        Amount: "",
        CentreID: state?.CentreID,
      },
    ]);
  };

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

  const EditPatientDetail = (editID) => {
    axios
      .post("/api/v1/PatientRegistration/getDataEditByLabNo", {
        LabNo: editID,
      })
      .then((res) => {
        setState({
          ...res?.data?.message?.patientDetail[0],
          DOB: new Date(res?.data?.message?.patientDetail[0]?.DOB),
        });
        setLTData({
          ...res?.data?.message?.LTData[0],
          LedgertransactionID:
            res?.data?.message?.LTData[0]?.LedgerTransactionID,
        });
        let data = res?.data?.message?.PLO;
        data = data.map((ele) => {
          return { ...ele, isDisable: true };
        });
        const val = data.map((ele) => {
          return {
            IsSampleCollected: ele?.IsSampleCollected,
            IsSampleRequired:ele?.IsSampleRequired,
            Status: ele?.Status,
            IsUrgent: ele?.IsUrgent,
            sampleTypeID: ele?.SampleTypeID,
            SampleTypeName: ele?.SampleTypeName,
            ItemId: ele?.InvestigationID,
            ItemName: ele?.TestName,
            InvestigationID: ele?.InvestigationID,
            InvestigationName: ele?.TestName,
            ReportType: ele?.ReportType,
            IsPackage: ele?.IsPackage,
            Rate: ele?.Rate,
            Amount: ele?.NetAmount,
            Quantity: 1,
            PCCDiscAmt: 0,
            PCCDiscPer: 0,
            RateTypeId: ele?.RateTypeId,
            DiscountAmt: ele?.Discount,
            DiscountApprovedBy: ele?.DiscountApprovedBy,
            DiscountReason: ele?.DiscountReason,
            IsReporting: "1",
            ageInDays: ele?.ageInDays,
            Gender: ele?.Gender,
            CentreID: ele?.CentreID,
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
            TestIdHash: ele?.TestIdHash,
          };
        });
        setPLO(val);

        setTableData(data);
        setRcData(res?.data?.message?.RcData);
        setFormData({
          ...formData,
          DoctorName: res?.data?.message?.LTData[0]?.DoctorName,
        });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    EditPatientDetail(location?.state?.data);
  }, []);

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

  const handleLTData = (e) => {
    const { name, value } = e.target;
    setLTData({
      ...LTData,
      [name]: value,
    });
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

  const FindBarcode = (id) => {
    let disable = false;
    for (let i = 0; i < tableData?.length; i++) {
      if (tableData[i]["Status"] === 3 && tableData[i]["SampleTypeID"] === id) {
        disable = true;
      }
    }

    return disable;
  };

  useEffect(() => {
    if (state.RateID !== "" && RateType.length > 0) {
      const data = RateType?.find((ele) => ele.value == state?.RateID);
      console.log(RateType);
      setBarcodeLogic(Number(data?.BarcodeLogic));
    }
  }, [state?.RateID, RateType]);

  // useEffect(() => {
  //   getDoctorSuggestion(formData, setDoctorSuggestion, setFormData);
  // }, [formData?.DoctorName]);

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

  const handlePLOChange = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const data = [...tableData];
      if (name === "Status") {
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

  const handleUrgent = (value, index) => {
    const data = [...tableData];
    data[index]["UrgentDateTime"] = value;
    setTableData(data);
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
    let total = tableData.reduce((acc, item) => acc + Number(item.Rate), 0);
    let NetTotal = tableData.reduce(
      (acc, item) => acc + Number(item.NetAmount) || acc + Number(item.Rate),
      0
    );

    setLTData({
      ...LTData,
      GrossAmount: total,
      NetAmount: NetTotal,
      DiscountOnTotal: total > 0 && NetTotal > 0 ? total - NetTotal : "",
    });
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

  const handleFilter = (data) => {
    // InvestigationID
    if (data?.Status !== 3) {
      const value = tableData.filter(
        (ele) => ele.InvestigationID !== data.InvestigationID
      );
      setTableData(value);
      toast.success("successfully Removed");
    } else {
      toast.error("Already Received");
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
        SampleTypeName: ele?.SampleName || ele?.SampleTypeName,
        ItemId: ele?.InvestigationID,
        ItemName: ele?.TestName,
        InvestigationID: ele?.InvestigationID,
        InvestigationName: ele?.TestName,
        ReportType: ele?.ReportType,
        IsPackage: ele?.DataType === "Package" ? 1 : 0,
        Rate: ele?.Rate,
        Amount: ele?.NetAmount,
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
        CentreID: state?.CentreID,
        SampleBySelf: "1",
        sampleCollectionBy: 0,
        DeliveryDate: "",
        BarcodeNo: getBarcode(ele?.SampleTypeID),
        UrgentDateTime: ele?.UrgentDateTime,
        DepartmentID: ele?.DepartmentID,
        isHistoryReq: 0,
        PackageCode: "",
        PackageName: "",
        TestCode: ele?.TestCode,
        TestIdHash: ele?.TestIdHash,
      };
    });
    setPLO(data);
  }, [tableData]);

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

  useEffect(() => {
    getAccessCentres(setCentreData);
    getCollectionBoy(setCollectionBoy);
    getDropDownData("Gender");
    getDropDownData("Title");
    getDropDownData("PaymentMode");
    getDropDownData("BankName");
    getVisitType(setVisitType);
    getBindDiscApproval(setBindDiscApproval);
    getBindDiscReason(setBindDiscReason);
    getBindReportDeliveryMethod(setBindReportDeliveryMethod);
    getPaymentModes("Source", setPatientSource);
    getPaymentModes("PatientType", setPatientType);
    getRequiredAttachment();
  }, []);

  useEffect(() => {
    if (!isSubmit) {
      getAccessDataRate(setRateType, LTData?.CentreID);
    }
  }, [LTData?.CentreID, isSubmit]);

  const handleSelectNew = (event) => {
    const { name, value } = event.target;
    setLTData({ ...LTData, [name]: value });
  };

  useEffect(() => {
    let totaldiscount = (LTData.GrossAmount * discountPercentage) / 100;
    let disamount = LTData.GrossAmount - totaldiscount;
    let DiscountAmt = totaldiscount / tableData.length;

    setLTData({
      ...LTData,
      NetAmount: disamount,
      DiscountOnTotal: totaldiscount,
    });
    const data = PLO.map((ele) => {
      return {
        ...ele,
        Amount: ele.Rate - DiscountAmt,
        DiscountAmt: DiscountAmt,
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
    let match = false;
    for (var i = 0; i < RcData.length; i++) {
      if (RcData[i].PaymentMode === event.label) {
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
          PaymentMode: event.label,
          PaymentModeID: event.value,
          CardNo: "",
          CardDate: "",
          BankName: "",
          Amount: "",
          CentreID: state?.CentreID,
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
    setPaid(sum);
    return sum;
  };

  useEffect(() => {
    if (RcData.length >= 1) {
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

  const getDataByMobileNo = () => {
    if (state?.Mobile.length === 10) {
      axios
        .post("/api/v1/Booking/getDataByMobileNo", {
          Mobile: state?.Mobile,
        })
        .then((res) => {
          setMobileData(res.data.message);
          setShow4(true);
        })
        .catch((err) => console.log(err));
    }
  };

  const handlePatientData = (e) => {
    const keypress = [9, 13];
    if (keypress.includes(e.which)) {
      e.preventDefault();
      getDataByMobileNo();
    }
  };

  const handleClose4 = () => {
    setShow4(false);
  };

  const getRequiredAttachment = () => {
    axios
    .post("/api/v1/Global/GetGlobalData",{
      Type:"RequiredAttachment"
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

  const handleSelctData = (data) => {
    const centreName = CentreData?.find((ele) => ele.value === data.CentreID);
    setState({
      ...state,
      Title: data.Title,
      FirstName: data.FirstName,
      LastName: data?.LastName,
      MiddleName: data?.MiddleName,
      CentreID: data?.CentreID,
      RateID: data?.RateTypeId,
      Gender: data?.Gender,
      DOB: new Date(data?.DOB),
      Age: data?.Age,
      PatientCode: data?.PatientCode,
      Email: data?.Email,
      PinCode: data?.Pincode,
      AgeDays: data?.AgeDays,
      AgeMonth: data?.AgeMonth,
      AgeYear: data?.AgeYear,
      HouseNo: data?.HouseNo,
      City: data?.City,
      State: data?.State,
      Country: data?.Country,
      StreetName: data?.StreetName,
      IsMask: data?.IsMask,
      isVIP: data?.IsVIP,
      Locality: data?.Locality,
    });

    setLTData({
      ...LTData,
      CentreName: centreName.label,
      CentreID: centreName.value,
    });
    handleClose4();
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

  const valiateProofID = () => {
    let validate = true;
    if (LTData?.PatientIDProof && LTData?.PatientIDProofNo.length < 5) {
      validate = false;
    }
    return validate;
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
      // const paymentCheck = PaymentData();
      const { DocumentFlag, message } = handleFileValidationUpload();
      if (flag.length === 0) {
        if (PLO.length > 0) {
          if (valiateProofID()) {
            // if (!paymentCheck) {
              if (disAmt || discountPercentage || match) {
                if (DocumentFlag) {
                  setIsSubmit(true);
                  axios
                    .post("/api/v1/PatientRegistration/RegistrationEditData", {
                      PatientData: getTrimmedData(state),
                      LTData: getTrimmedData(LTData),
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
                          CentreID: state?.CentreID,
                        },
                      ]);
                      setFormData({
                        DoctorName: "",
                      });
                      setTableData([]);
                      setIsSubmit(false);
                      getReceipt(res?.data?.ledgertransactionID);
                    })
                    .catch((err) => {
                      toast.error("Something Went Wrong");
                      setIsSubmit(false);
                    });
                } else {
                  toast.error(`${message} is Required Document`);
                }
              } else {
                if (DocumentFlag) {
                  setIsSubmit(true);
                  axios
                    .post("/api/v1/PatientRegistration/RegistrationEditData", {
                      PatientData: getTrimmedData(state),
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
                          CentreID: state?.CentreID,
                        },
                      ]);
                      setTableData([]);
                      setIsSubmit(false);
                      setFormData({
                        DoctorName: "",
                      });
                      getReceipt(res?.data?.ledgertransactionID);
                    })
                    .catch((err) => {
                      toast.error("Something Went Wrong");
                      setIsSubmit(false);
                    });
                } else {
                  toast.error(`${message} is Required Document`);
                }
              }
            // } else {
            //   toast.error("Please Fill All The Required Fields");
            // }
          } else {
            toast.error("Please Enter Identity No");
          }
        } else {
          toast.error("Please Select Test");
        }
      }
    },
  });

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

  const handleCloseBarcodeModal = (value) => {
    if (value.length >= 3) {
      checkDuplicateBarcode(value, LTData?.LedgerTransactionID).then((res) => {
        console.log(res);
        if (res === " " || res === "") {
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

  // useEffect(() => {
  //   setTableData([]);
  //   setRcData([
  //     {
  //       PayBy: "Patient",
  //       ReceiptNo: "",
  //       ledgerNoCr: "",
  //       RateTypeId: state?.RateID,
  //       PaymentMode: "Cash",
  //       PaymentModeID: 134,
  //       BankName: "",
  //       CardNo: "",
  //       CardDate: "",
  //       Amount: "",
  //       CentreID: state?.CentreID,
  //     },
  //   ]);
  // }, [state?.CentreID, state?.RateID]);

  const getDocumentType = (data) => {
    setUploadDoumentType(data);
  };

  useEffect(() => {
    setThroughMobileData(true);
  }, []);

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

  return (
    <>
      <div className="box box-success form-horizontal">
        {show && <PatientRegisterModal show={show} handleClose={handleClose} />}
        {show2 && (
          <UploadModal
            options={Identity}
            show={show2}
            handleClose={handleClose2}
            documentId={LTData?.LedgerTransactionIDHash}
            pageName="Patient Registration"
            handleUploadCount={handleUploadCount}
            getDocumentType={getDocumentType}
          />
        )}
        {show3 && (
          <MedicialModal
            show={show3}
            handleClose={handleClose3}
            MedicalId={LTData?.LedgerTransactionIDHash}
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

        <div className="box-header with-border">{t("Edit Patient")}</div>
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
                isDisabled={throughMobileData}
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Rate Type")}:
            </label>
            <div className="col-sm-2">
              <SelectBox
                options={RateType}
                formdata={state.RateID}
                selectedValue={state?.RateID}
                name="RateID"
                isDisabled={throughMobileData}
                onChange={handleSelectChange}
              />
            </div>

            <label className="col-sm-1" htmlFor="inputEmail3">
             {t("Visit Type")}:
            </label>
            <div className="col-sm-2">
              <SelectBox
                className="required"
                options={VisitType}
                selectedValue={selectedValueCheck(VisitType, LTData?.VisitType)}
                name="VisitType"
                onChange={handleSelectChange}
              />
            </div>

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
                {t("upload document")} 
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
          </div>
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
             {t("Mobile No")} :
            </label>
            <div className="col-sm-2">
              <Input
                className="select-input-box form-control input-sm required"
                name="Mobile"
                type="number"
                required
                onInput={(e) => number(e, 10)}
                onKeyDown={handlePatientData}
                value={state.Mobile}
                disabled={throughMobileData}
                onBlur={handleBlur}
                onChange={handleMainChange}
              />
              {errors?.Mobile && touched?.Mobile && (
                <div className="golbal-Error">{errors?.Mobile}</div>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
             {t("UHID")} :
            </label>
            <div className="col-sm-2">
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
             {t("PreBooking No")}:
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
            <label className="col-sm-1" htmlFor="inputEmail3">
             {t("Referred Doc")} 
            </label>
            <div className="col-sm-2">
              <div className="d-flex">
                <Input
                  autoComplete="off"
                  className="select-input-box form-control input-sm ui-autoComplete-input"
                  name="DoctorName"
                  disabled={throughMobileData}
                  type="text"
                  value={formData?.DoctorName}
                />
                {dropFalse && doctorSuggestion.length > 0 && (
                  <ul
                    className="suggestion-data"
                    style={{ top: "47px", right: "14px" }}
                  >
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
                    disabled={throughMobileData}
                    type="button"
                    onClick={handleShow}
                  >
                    <i className="fa fa-plus-circle fa-sm"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
             {t("First Name")}:
            </label>

            <div className="col-sm-2">
              <div className="d-flex">
                <div style={{ width: "50%" }}>
                  <SelectBox
                    options={Title}
                    formdata={state.Title}
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
             {t("Middle Name")}:
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
           {t("Gender")}:
            </label>
            <div className="col-sm-2  ">
              <SelectBox
                options={Gender}
                className="required"
                formdata={state?.Gender}
                isDisabled={state?.Title ? true : false}
                name="Gender"
                selectedValue={state?.Gender}
                onChange={handleSelectChange}
              />
            </div>
            {/* <div className="col-sm-2  ">
              <label className="control-label" htmlFor="Gender">
                Gender
              </label>
              :
              <SelectBox
                options={Gender}
                className="required"
                formdata={state?.Gender}
                isDisabled={state?.Title ? true : false}
                name="Gender"
                selectedValue={selectedValueCheck(Gender, state?.Gender)}
                onChange={handleSelectChange}
              />
            </div> */}
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
                  disabled={throughMobileData}
                  onChange={handleMainChange}
                />

                <span className="input-group-text select-input-box form-control input-sm justify-content-center">
                  {t("Y")}
                </span>
                <Input
                  className="select-input-box form-control input-sm"
                  id="AgeM"
                  name="AgeMonth"
                  type="text"
                  disabled={throughMobileData}
                  value={state?.AgeMonth}
                  onChange={handleMainChange}
                />
                <span className="input-group-text form-control pull-right reprint-date input-sm justify-content-center">
                  {t("M")}
                </span>

                <Input
                  className="select-input-box form-control input-sm"
                  id="AgeD"
                  name="AgeDays"
                  type="text"
                  value={state?.AgeDays}
                  disabled={throughMobileData}
                  onChange={handleMainChange}
                />
                <span className="input-group-text form-control pull-right reprint-date input-sm justify-content-center">
                 {t("D")} 
                </span>
              </div>
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
            {t("Date Of Birth")}  
            </label>
            <div className="col-sm-2">
              <div>
                <CustomDate
                  name="DOB"
                  value={state?.DOB}
                  disabled={throughMobileData}
                  className="form-control pull-right reprint-date required input-sm"
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
             {t("Referred Lab")}:
            </label>
            <div className="col-sm-2">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Input
                  autoComplete="off"
                  className="form-control input-sm ui-autoComplete-input"
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
            </div> */}
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
                className="form-control input-sm"
                name="Country"
                value={state?.Country}
                type="text"
                onChange={handleMainChange}
              />
            </div>
          </div>
          <div className="row">
            

            <label className="col-sm-1" htmlFor="inputEmail3">
             {t("Identity Type")}:
            </label>
            <div className="col-sm-2">
              <div className="d-flex">
                <div style={{ width: "50%" }}>
                  <SelectBox
                    options={[{ label: "Choose ID", value: "" }, ...Identity]}
                    selectedValue={LTData?.PatientIDProof}
                    name="PatientIDProof"
                    onChange={handleSelectChange}
                  />
                </div>
                <div style={{ width: "50%" }}>
                  <Input
                    className="form-control input-sm set-height"
                    max={20}
                    name="PatientIDProofNo"
                    value={LTData?.PatientIDProofNo}
                    type="text"
                    onChange={handleLTData}
                  />
                </div>
              </div>
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
             {t("Billing Remarks")}:
            </label>
            <div
              className="col-sm-2"
              id="OpdNo"
              ismandatory="true"
              style={{ display: "block" }}
            >
              <Input
                className="form-control input-sm select-input-box"
                id="Remarks"
                max={100}
                name="Remarks"
                type="text"
              />
            </div>

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
                            ? [{ label: "Select", value: "" }, ...PatientSource]
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
                          LTData[data?.FieldType]
                        )}
                        name={data?.FieldType}
                        onChange={handleSelectNew}
                      />
                    ) : (
                      <Input
                        className={`form-control input-sm ${
                          data?.IsMandatory === 1 && "required"
                        }`}
                        id="OpdIpd_No"
                        maxLength={30}
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
                )
            )} */}

            <label className="col-sm-1" htmlFor="inputEmail3">
             {t("R_D_M")}:
            </label>

            <div className="col-sm-2">
              <SelectBox
                options={BindReportDeliveryMethod}
                selectedValue={LTData?.ReportDeliveryMethodId}
                name="ReportDeliveryMethodId"
                onChange={handleSelectChange}
              />
            </div>

            <label className="col-sm-1" htmlFor="inputEmail3">
            {t("Collection Boy")}:
            </label>
            <div className="col-sm-2">
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
            </div>
          </div>
          <div className="row">
            

            <label className="col-sm-1" htmlFor="inputEmail3">
             {t("Report Delivery Method Detail")}:
            </label>
            <div className="col-sm-2">
              <Input
                className="form-control input-sm"
                id="ReportDeliveryMethodDetail"
                max={200}
                value={LTData?.ReportDeliveryMethodDetail}
                name="ReportDeliveryMethodDetail"
                onChange={handleLTData}
                type="text"
              />
            </div>
            {visibleFields?.map(
              (data, index) =>
                data?.IsVisible === 1 && (
                  <>
                    <label className="col-sm-1" htmlFor="inputEmail3">
                      {data?.FieldType}
                    </label>
                    <div className="col-sm-2" id="OpdNo" key={index}>
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
                              ? [{ label: "Select", value: "" }, ...PatientType]
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

            {/* <div className="col-sm-3   margin-top py-3">
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
                    <label htmlFor="inputEmail3">{t("IsVip")}</label>
                    <Input
                      type="checkbox"
                      name="isVIP"
                      onChange={handleMainChange}
                      value={state?.isVIP === 1 ? true : false}
                    />

                    {/* {state?.isVIP === 1 && (
                      <>
                        <label htmlFor="inputEmail3">{t("IsMask")}</label>
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
              className="box-body divResult table-responsive boottable"
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
                      <th>{t("Disc")}.</th>
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
                                FindBarcode={FindBarcode}
                                onChange={handleChangePloBarCode}
                                Edit={true}
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
                              Edit={true}
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
        <div className="col-sm-6">
          <div className="box box-success">
            {/* <div className="row">
                <div className="col-md-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text font-weight-bold text-info">
                      Total Amount
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
                      Paid Amount
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
                      Discount Amount
                    </span>
                  </div>
                  <Input
                    className="select-input-box form-control input-sm currency"
                    data-val="false"
                    id="DiscountAmt"
                    disabled={tableData?.length > 0 ? false : true}
                    value={disAmt}
                    placeholder={"Dis Amt"}
                    name="disAmt"
                    type="number"
                    onChange={(e) => {
                      let match = Match();
                      if (discountPercentage === "" && !match) {
                        if (LTData?.GrossAmount < Number(e.target.value)) {
                          toast.error("please Enter Valid Discount");
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
                        toast.error("Discount already Given");
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
                      Discount Percentage
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
                        ? LTData?.DiscountApprovedBy
                          ? true
                          : false
                        : true
                    }
                    placeholder={"Dis Per"}
                    type="number"
                    onChange={(e) => {
                      let match = Match();
                      if (disAmt === "" && !match) {
                        setDiscountPercentage(e.target.value);
                      } else {
                        toast.error("Discount Already Given");
                      }
                    }}
                  />
                </div>
              </div> */}

            <div
              className="card-body"
              style={{ paddingTop: "3px", paddingBottom: "3px" }}
            >
              {/* <div className="row p-2">
                  <div className="col-sm-3">
                    <SelectBox
                      options={PaymentMode}
                      onChange={handlePaymentChange}
                      isDisabled={tableData?.length > 0 ? false : true}
                    />
                  </div>

                  <div className="col-sm-3">
                    <SelectBox
                      options={BindDiscApproval}
                      name="DiscountApprovedBy"
                      selectedValue={LTData?.DiscountApprovedBy}
                      onChange={handleSelectChange}
                      isDisabled={
                        LTData?.DiscountOnTotal === "" ||
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
                        LTData?.DiscountOnTotal === "" ||
                        LTData?.DiscountOnTotal == 0
                          ? true
                          : false
                      }
                    />
                  </div>
                  <div className="col-sm-3 py-4">
                    Due Amount : {LTData?.NetAmount - paid}
                  </div>
                </div> */}
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

              {/* <div
                  className=" box-body divResult table-responsive"
                  id="no-more-tables"
                >
                  <table
                    className="table table-bordered table-hover table-striped tbRecord"
                    cellPadding="{0}"
                    cellSpacing="{0}"
                  >
                    <thead>
                      <tr>
                        <th>Action</th>
                        <th>Mode</th>
                        <th>Paid Amount</th>
                        <th>Currency</th>
                        <th>Base</th>
                        <th>Bank Name</th>
                        <th>Cheque/Card No.</th>
                        <th>Cheque Date/Trans No</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RcData?.map((data, index) => (
                        <tr key={index}>
                          <td data-title="Action">
                            <button
                              id="btndeleterow"
                              className="form-control input-sm btn-danger"
                              onClick={() => handleFilterPayment(index)}
                            >
                              X
                            </button>
                          </td>
                          <td data-title="Mode">
                            <span id="SpanPaymentMode">
                              {data?.PaymentMode} &nbsp;
                            </span>
                          </td>
                          <td data-title="Paid Amount">
                            <Input
                              className="select-input-box form-control input-sm currency"
                              name="Amount"
                              value={Number(data?.Amount)?.toFixed(2)}
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
                          </td>
                          <td data-title="Currency">
                            <span id="SpanCurrency">INR</span>
                          </td>
                          <td data-title="Base">
                            <span id="spnbaseAmount">
                              {data?.Amount} &nbsp;
                            </span>
                          </td>
                          <td data-title="Bank Name">
                            {["Cash", "Online Payment", "Paytm"].includes(
                              data?.PaymentMode
                            ) ? (
                              ""
                            ) : (
                              <select
                                className="required"
                                name="BankName"
                                value={data?.BankName}
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
                          <td data-title="Cheque/Card No.">
                            <Input
                              disabled={
                                ["Cash", "Online Payment", "Paytm"].includes(
                                  data?.PaymentMode
                                )
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
                          <td data-title="Cheque Date/Trans No">
                            <Input
                              disabled={
                                data?.PaymentMode !== "Cash" ? false : true
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
                </div> */}
              <div className="col-12">
                <div className="row">
                  <div className="col-sm-2 col-4 mb-2 ">
                    {isSubmit ? (
                      <Loading />
                    ) : (
                      <button
                        type="submit"
                        id="btnSave"
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <SuggestionBox /> */}
    </>
  );
};

export default EditPatientDetails;
