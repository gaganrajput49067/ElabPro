import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import AppointmentRescheduleModal from "./AppointmentRescheduleModal";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import DOSModal from "./DOSModal";
import { number } from "../util/Commonservices/number";
import { useEffect } from "react";
import AppointmentCancelModal from "./AppointmentCancelModal";
import { HCPaymentMode } from "../../ChildComponents/Constants";
import { autocompleteOnBlur } from "../util/Commonservices";
import { HandleHCBooking } from "../../ChildComponents/validations";
const DoAppointmentModal = ({
  selectedPhelebo,
  routeValueData,
  callhandleOnRouteValue,
  appointment,
  handleAppointment,
}) => {
  console.log(selectedPhelebo);
  const [showCancel, setShowCancel] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showDOS, setShowDOS] = useState(false);
  const [bindSourceCall, setBindSourceCall] = useState([]);
  const [discountApproval, setDiscountApproval] = useState([]);

  const [testSearchType, setTestSearchType] = useState("By Test Name");
  const [indexMatch, setIndexMatch] = useState(0);
  const [suggestion, setSuggestion] = useState([]);
  const [bookingData, setBookingData] = useState({
    TestName: "",
    CentreID: "",
    InvestigationID: "",
  });
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [disAmt, setdisAmt] = useState("");
  const [net, setNet] = useState(0);

  const [discountamount, setDiscountAmount] = useState(0); //discounted amount
  const [tableData, setTableData] = useState([]);
  // const [pheleboCharge, setPheleboCharge] = useState([]);
  const [record, setRecord] = useState([]);
  const [lastThreeVisitShow, setLastThreeVisitShow] = useState(false);
  const [lastThreeVisit, setLastThreeVisit] = useState(false);
  const [suggestedTestShow, setSuggestedTestShow] = useState(false);
  const [suggestedTest, setSuggestedTest] = useState([]);
  const [discount, setDiscount] = useState(0); //total amount after discount
  const [appointData, setAppointData] = useState({
    AppDateTime: `${moment(selectedPhelebo.AppointmentDate).format(
      "DD-MMM-YYYY"
    )} ${selectedPhelebo.SelectedTime}`,
    Address: selectedPhelebo?.Address ? selectedPhelebo?.Address : "",
    SelectedTime: selectedPhelebo.SelectedTime,
    updatepatient: "",
    HardCopyRequired: "",
    PheleboNumber: selectedPhelebo.PheleboNumber,
    PhlebotomistID: selectedPhelebo.SelectedPheleboId,
    atitude: "",
    Longitude: "",
    ispermanetaddress: 1,
    ReceiptRequired: 1,
    Alternatemobileno: "",
    Client: "",
    Paymentmode: "",
    SourceofCollection: "",
    Phelebotomistname: selectedPhelebo.PheleboName,
    emailidpcc: selectedPhelebo?.Email,
    centrename: selectedPhelebo?.DropLocationLabel,
    RouteName: selectedPhelebo?.SelectedBindRoute,
    RouteID: selectedPhelebo?.RouteId,
    deliverych: "",
    endtime: "",
    oldprebookingid: "",
    hcrequestid: "",
    followupcallid: "",
    // phelboshare: pheleboCharge?.value,
  });

  const [testData, setTestData] = useState({
    Title: selectedPhelebo?.Title,
    Patient_ID: selectedPhelebo?.Patient_ID,
    PName: selectedPhelebo?.NAME,
    Mobile: selectedPhelebo?.Mobile,
    Email: selectedPhelebo?.Email,
    DOB: selectedPhelebo?.DOB,
    Age: selectedPhelebo?.Age,
    AgeYear: selectedPhelebo?.AgeYear,
    AgeMonth: selectedPhelebo?.AgeMonth,
    AgeDays: selectedPhelebo?.AgeDays,
    TotalAgeInDays: selectedPhelebo?.TotalAgeInDays,
    Gender: selectedPhelebo?.Gender,
    VIP: "",
    House_No: selectedPhelebo?.House_No,
    LocalityID: selectedPhelebo?.LocalityID,
    Locality: selectedPhelebo?.Locality,
    CityID: selectedPhelebo?.CityID,
    City: selectedPhelebo?.City,
    StateID: selectedPhelebo?.StateID,
    State: selectedPhelebo?.State,
    Pincode: selectedPhelebo?.Pincode,
    Landmark: selectedPhelebo?.Landmark,
    PreBookingCentreID: selectedPhelebo?.centreid,
    Panel_ID: selectedPhelebo?.centreid,
    GrossAmt: "",
    DiscAmt: "",
    DisReason: "",
    NetAmt: "",
    DiscountTypeID: "",
    AdrenalinEmpID: 0,
    MRP: 0,
    TestCode: "",
    SubCategoryID: "",
    DoctorID: "",
    RefDoctor: "SELF",
    OtherDoctor: "",
    Remarks: "",
    isUrgent: false,
    isPediatric: "",
  });

  const [showLog, setShowLog] = useState({ status: false, data: "" });
  const [errors, setError] = useState([]);

  const handleCloseDOS = () => setShowDOS(false);
  const handleCloseCancel = () => setShowCancel(false);
  const handleCloseReschedule = () => setShowReschedule(false);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAppointData({
      ...appointData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleTestChange = (e) => {
    const { name, value, type, checked } = e.target;
    // console.log(checked);
    setTestData({
      ...testData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  useEffect(() => {
    setNet(
      tableData.reduce(
        (accumulator, currentValue) => accumulator + currentValue.Rate,
        0
      )
    );

    setDiscountPercentage("");
    setdisAmt("");
    setDiscount(0);
    setDiscountAmount(0);
  }, [tableData.length]);

  useEffect(() => {
    setDiscount(Number(net) - Number(disAmt));
    setDiscountAmount(disAmt);
  }, [disAmt, net]);

  useEffect(() => {
    if (!isNaN(net) && !isNaN(discountPercentage)) {
      const discountAmount = (discountPercentage / 100) * net;
      setDiscountAmount(discountAmount);
      setDiscount(Number(net) - Number(discountAmount));
    }
  }, [discountPercentage, net]);

  useEffect(() => {
    // console.log(discountamount);

    if (discountamount == "" || discountamount == 0) {
      setTestData({
        ...testData,
        DoctorID: "",
        DisReason: "",
      });
      setDiscountApproval([]);
      getDiscountApproval();
      //
    }
  }, [discountamount]);

  // console.log(testData?.DoctorID);
  const handleCheckBox = (index, e) => {
    const { name, checked } = e.target;

    const newData = [...tableData];

    newData[index] = {
      ...newData[index],
      [name]: checked,
    };

    setTableData(newData);
  };

  const handleSubmit = () => {
    const datas = tableData.map((ele) => {
      const DiscountPercentage = (Number(discountamount) / Number(net)) * 100;
      const NetAmount = (
        ele?.Rate -
        (DiscountPercentage / 100) * ele?.Rate
      ).toFixed(2);

      return {
        ...ele,
        DisReason: testData?.DisReason,
        DoctorID: testData?.DoctorID,
        DiscountPercentage: DiscountPercentage,
        GrossAmt: ele?.Rate,
        Remarks: testData?.Remarks,
        RefDoctor: testData?.RefDoctor,
        DiscAmt:
          tableData?.length > 1
            ? (ele?.Rate - NetAmount).toFixed(2)
            : discountamount,
        NetAmt: tableData?.length > 1 ? NetAmount : discount,
        isUrgent: ele?.isUrgent ? 1 : 0,
        VIP: testData?.VIP ? 1 : 0,
        isPediatric: testData?.isPediatric ? 1 : 0,
      };
    });

    const generatedError = HandleHCBooking(appointData);
    console.log(generatedError);
    if (generatedError === "") {
      axios
        .post("/api/v1/CustomerCare/SaveHomeCollection", {
          datatosave: datas,
          ...appointData,
          HardCopyRequired: appointData.HardCopyRequired ? 1 : 0,
        })
        .then((res) => {
          console.log(res?.data?.message);
          toast.success("Booking Successfully");
          handleAppointment();
          callhandleOnRouteValue(routeValueData);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          );
        });
    } else {
      setError(generatedError);
    }
  };

  const handleBooking = () => {
    if (tableData.length === 0) {
      toast.error("Please Select Any Test");
    } else if (!appointData?.SourceofCollection) {
      toast.error("Please Select any Source of Collection");
    } else {
      if (appointData?.Paymentmode) {
        if (disAmt || discountPercentage) {
          if (testData?.DoctorID && testData?.DisReason) {
            handleSubmit();
          } else {
            toast.error("Please Choose Discount Approval And Discount Reason");
          }
        } else {
          handleSubmit();
        }
      } else {
        toast.error("Please Select Payment Mode");
      }
    }
  };

  const getSuggested = () => {
    axios
      .post("/api/v1/CustomerCare/showOldTest", {
        uhid: selectedPhelebo.Patient_ID,
        // uhid: 1516,
      })
      .then((res) => {
        const data = res?.data?.message;
        setSuggestedTest(data);
        setSuggestedTestShow(true);
      })
      .catch((err) => console.log(err));
  };

  const getLastThreeVisit = () => {
    axios
      .post("/api/v1/CustomerCare/GetLastThreeVisit", {
        uhid: selectedPhelebo.Patient_ID,
        // uhid: 1516,
      })
      .then((res) => {
        const data = res?.data?.message;
        setLastThreeVisit(data);
        setLastThreeVisitShow(true);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getSuggested();
    getLastThreeVisit();
  }, []);

  const { t } = useTranslation();
  // console.log(selectedPhelebo);
  function onValueChange(event) {
    setTestSearchType(event.target.value);
  }

  const getBindSourceCall = () => {
    axios
      .get("/api/v1/CustomerCare/bindcollsource")
      .then((res) => {
        const data = res?.data?.message;
        const SourceCall = data?.map((ele) => {
          return {
            value: ele?.ID,
            label: ele?.Source,
          };
        });
        console.log(SourceCall);
        setBindSourceCall(SourceCall);
      })
      .catch((err) =>
        toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong")
      );
  };

  const handleSplit = (id, symbol) => {
    const data = id?.split(symbol);
    return data;
  };
  const getDiscountApproval = () => {
    axios
      .post("/api/v1/CustomerCare/getDiscountApproval", {
        CentreId: selectedPhelebo.centreid,
      })
      .then((res) => {
        const data = res?.data?.message;
        const discount = data?.map((ele) => {
          return {
            value: handleSplit(ele?.VALUE, "#")[0],
            label: ele?.label,
          };
        });
        setDiscountApproval(discount);
      })
      .catch((err) =>
        toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong")
      );
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });

    // console.log(bookingData);
  };
  const SearchTest = (e) => {
    const val = e.target.value;
    // console.log(val.length);

    if (val.length >= 3) {
      axios
        .post("/api/v1/CustomerCare/BindBillingTestDataHomeCollection", {
          CentreID: selectedPhelebo.centreid,
          TestName: val,
        })
        .then((res) => {
          const data = res?.data?.message;
          const suggestions = data.map((ele) => {
            return {
              TestName: handleSplit(ele.TestName, "~")[1],
              TestCode: ele?.TestCode,
              InvestigationID: ele?.InvestigationID,
              CentreID: ele?.CentreID,
            };
          });
          console.log(suggestions);
          setSuggestion(suggestions);
          console.log(data);
        })
        .catch((err) =>
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          )
        );
    }
  };

  const handleIndex = (e) => {
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
          handleListSearch(suggestion[indexMatch]);
        }
        setIndexMatch(0);
        break;
      default:
        break;
    }
  };

  const handleListSearch = (data) => {
    setBookingData({
      ...bookingData,
      TestName: "",
      InvestigationID: data.InvestigationID,
    });
    setIndexMatch(0);
    setSuggestion([]);
    console.log(data);
    getTableData(data);
  };
  // console.log(testData?.Gender)
  const CheckageTest = (gender, ToAge, FromAge) => {
    let genderCheck = false;
    let ageCheck = true;
    let message = "";
    genderCheck = [testData?.Gender, "Both"].includes(gender) ? true : false;

    if (testData?.TotalAgeInDays > ToAge) {
      ageCheck = false;
      message = "Your Age is Greater than this test Maximum Age";
    }

    if (testData?.TotalAgeInDays < FromAge) {
      ageCheck = false;
      message = "Your Age is Less than this test Minimum Age";
    }

    return {
      genderCheck: genderCheck,
      ageCheck: ageCheck,
      message: message,
    };
  };

  const getTableData = (data) => {
    const ItemIndex = tableData.findIndex(
      (e) => e.InvestigationID === data.InvestigationID
    );
    if (ItemIndex === -1) {
      axios
        .post("/api/v1/CustomerCare/BindSingleTestDataHomeCollection", {
          InvestigationID: data.InvestigationID,
          CentreID: data.CentreID,
        })
        .then((res) => {
          const newData = res?.data?.message;

          const { genderCheck, ageCheck, message } = CheckageTest(
            res?.data?.message[0]?.Gender,
            res?.data?.message[0]?.ToAge,
            res?.data?.message[0]?.FromAge
          );

          if (genderCheck && ageCheck) {
            const appendedData = [
              ...tableData,
              ...newData.map((ele) => {
                return {
                  ...testData,
                  TestGender: ele?.Gender,

                  DataType: ele?.DataType,
                  SubCategoryID: ele?.DepartmentID,
                  FromAge: ele?.FromAge,
                  InvestigationID: ele?.InvestigationID,
                  IsSampleRequired: ele?.IsSampleRequired,
                  Rate: ele?.Rate,
                  SampleRemarks: ele?.SampleRemarks,
                  ReportType: ele?.ReportType,
                  RequiredAttachment: ele?.RequiredAttachment,
                  SampleCode: ele?.SampleCode,
                  SampleName: ele?.SampleName,
                  SampleTypeID: ele?.SampleTypeID,
                  ItemId: ele?.TestCode,
                  ItemName: ele?.TestName,
                  ToAge: ele?.ToAge,
                  deleiveryDate: ele?.deleiveryDate,
                  refRateValue: ele?.refRateValue,
                };
              }),
            ];
            setTableData(appendedData);
          } else {
            !genderCheck &&
              toast.error("This Test is Not for " + testData?.Gender);
            !ageCheck && toast.error(message);
          }
        })
        .catch((err) => console.log(err));
    } else {
      toast.error("Duplicate Test Found");
    }
  };
  // const getPheleboCharge = () => {
  //   axios
  //     .post("/api/v1/CustomerCare/getphelbotomistcharge", {
  //       PhlebotomistID: selectedPhelebo?.SelectedPheleboId,
  //       appdate: moment(selectedPhelebo.AppointmentDate).format("DD-MMM-YYYY"),
  //     })
  //     .then((res) => {
  //       const data = res?.data?.message;
  //       const Charge = data.map((ele) => {
  //         return {
  //           label: ele.chargename,
  //           value: ele.chargeamount,
  //         };
  //       });
  //       setPheleboCharge(Charge);
  //     })
  //     .catch((err) => console.log(err));
  // };

  const handleFilter = (data) => {
    console.log(tableData);
    const value = tableData.filter(
      (ele) => ele.InvestigationID !== data.InvestigationID
    );
    setTableData(value);
    console.log(value);
    toast.success("Successfully Removed");
  };

  const getSearchRecords = () => {
    const AppDateTime = moment(selectedPhelebo.AppointmentDate).format(
      "YYYY-MM-DD"
    );
    axios
      .post("/api/v1/CustomerCare/SearchRecords", {
        PhlebotomistID: selectedPhelebo.SelectedPheleboId,
        // AppDateTime: "2023-09-20 18:28:17",
        AppDateTime: `${AppDateTime} ${selectedPhelebo.SelectedTime}:00`,
      })
      .then((res) => {
        const data = res?.data?.message;
        // console.log(data);
        setRecord(data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    // setShowDOS(true);
    getBindSourceCall();
    getDiscountApproval();
    // getPheleboCharge();
    getSearchRecords();
  }, []);

  return (
    <>
      {showCancel && (
        <AppointmentCancelModal
          showCancel={showCancel}
          handleCloseCancel={handleCloseCancel}
          handleAppointment={handleAppointment}
        />
      )}

      {showReschedule && (
        <AppointmentRescheduleModal
          showReschedule={showReschedule}
          handleCloseReschedule={handleCloseReschedule}
          handleAppointment={handleAppointment}
        />
      )}

      {showDOS && (
        <DOSModal showDOS={showDOS} handleCloseDOS={handleCloseDOS} />
      )}
      <Modal
        show={appointment}
        size="lg"
        style={{ backgroundColor: "black" }}
        id="ModalSizeHC"
      >
        <div
          style={{
            // marginTop: "60px",

            backgroundColor: "transparent",
            maxHeight: "550px",
            overflowY: "auto",
          }}
        >
          <Modal.Header
            className="modal-header"
            style={{ position: "sticky", zIndex: 1055, top: 0 }}
          >
            <Modal.Title className="modal-title">{t("Book Slot")}</Modal.Title>
            <button
              type="button"
              className="close"
              onClick={() => {
                callhandleOnRouteValue(routeValueData);
                handleAppointment();
              }}
            >
              ×
            </button>
          </Modal.Header>
          <Modal.Body>
            <div className="box">
              <div className="box-body">
                <div className="row">
                  <label className="col-sm-12  col-md-2" htmlFor="PhelboName">
                    {t("Phelebotmist Name")} :
                  </label>
                  <div className="col-md-2">
                    {appointData?.Phelebotomistname}
                    &nbsp;
                    {appointData?.PheleboNumber}
                  </div>
                  <div className="col-md-4"></div>
                  <label
                    className="col-sm-12  col-md-2"
                    htmlFor="Appointment Date & Time"
                    style={{ textAlign: "end" }}
                  >
                    {t("Appointment Date & Time")} :
                  </label>
                  <div className="col-sm-2">{appointData.AppDateTime}</div>
                </div>
                <div className="row">
                  <label className="col-sm-12  col-md-2" htmlFor="ReferDoctor">
                    {t("Referred Doctor")} :
                  </label>
                  <div className="col-sm-12 col-md-2">
                    <Input
                      className="select-input-box form-control input-sm"
                      value={testData?.RefDoctor}
                      type="text"
                      onChange={handleTestChange}
                      name="RefDoctor"
                    />
                  </div>

                  <label className="col-sm-12  col-md-2" htmlFor="AltMobile">
                    {t("Alternate Mobile No.")} :
                  </label>
                  <div className="col-sm-12 col-md-2">
                    <Input
                      className="select-input-box form-control input-sm"
                      type="number"
                      autoComplete="off"
                      max={10}
                      onChange={handleChange}
                      onInput={(e) => number(e, 10)}
                      value={appointData?.Alternatemobileno}
                      name="Alternatemobileno"
                    />
                    {appointData?.Alternatemobileno === "" && (
                      <span className="golbal-Error">
                        {errors?.Alternatemobilenos}
                      </span>
                    )}
                    {appointData?.Alternatemobileno.length > 0 &&
                      appointData?.Alternatemobileno.length !== 10 && (
                        <span className="golbal-Error">
                          {errors?.Alternatemobilenum}
                        </span>
                      )}
                  </div>
                  <label
                    className="col-sm-12  col-md-2"
                    htmlFor="srcCollection"
                  >
                    {t("Source of Collection")} :
                  </label>
                  <div className="col-sm-12 col-md-2">
                    <SelectBox
                      name="SourceofCollection"
                      className="input-sm"
                      value={appointData?.SourceofCollection}
                      options={[
                        { label: "Select Source Of Collection", value: "" },
                        ...bindSourceCall,
                      ]}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <label className="col-sm-12  col-md-2" htmlFor="Remarks">
                    {t("Remarks")} :
                  </label>
                  <div className="col-sm-12 col-md-2">
                    <Input
                      className="select-input-box form-control input-sm"
                      type="text"
                      name="Remarks"
                      max={30}
                      onChange={handleTestChange}
                      value={testData?.Remarks}
                    />
                  </div>

                  <label className="col-sm-12  col-md-2" htmlFor="paymentmode">
                    {t("Payment Mode")} :
                  </label>
                  <div className="col-sm-12 col-md-2">
                    <SelectBox
                      name="Paymentmode"
                      value={appointData?.Paymentmode}
                      className="input-sm"
                      options={[
                        { label: "Select Payment Mode", value: "" },
                        ...HCPaymentMode,
                      ]}
                      // isDisabled={tableData.length === 0}
                      onChange={handleChange}
                    />
                  </div>
                  <label className="col-sm-12  col-md-2" htmlFor="Address">
                    {t("Address")} :
                  </label>
                  <div className="col-sm-12 col-md-2">
                    <Input
                      className="select-input-box form-control input-sm"
                      type="Address"
                      max={30}
                      name="Address"
                      onChange={handleChange}
                      value={appointData?.Address}
                    />

                    {appointData?.Address.trim().length > 0 && (
                      <span className="golbal-Error">{errors?.Address}</span>
                    )}
                  </div>
                </div>

                <div className="row">
                  {/* <div className="col-sm-1">
                  <Input
                    type="checkbox"
                    name="VIP"
                    onChange={handleTestChange}
                    checked={testData?.VIP}
                  />
                  <label className="control-label">VIP</label>
                </div>

                <div className="col-sm-2">
                  <Input
                    type="checkbox"
                    name="isPediatric"
                    onChange={handleTestChange}
                    checked={testData?.isPediatric}
                  />
                  <label className="control-label">
                    {t("Pedriatic Patient")}
                  </label>
                </div> */}
                  {/* 
                  <label className="col-sm-12  col-md-2" htmlFor="paymentmode">
                    {t("Choose Phelboshare")} :
                  </label>
                  <div className="col-sm-2">
                    <SelectBox
                      name="phelboshare"
                      options={[
                        { label: "Choose phelboshare", value: "" },
                        ...pheleboCharge,
                      ]}
                      className="select-input-box form-control input-sm"
                      value={appointData?.phelboshare}
                      onChange={handleChange}
                    />
                  </div> */}
                  <div className="col-sm-3">
                    <Input
                      type="checkbox"
                      name="HardCopyRequired"
                      onChange={handleChange}
                      checked={appointData?.HardCopyRequired}
                    />
                    &nbsp;&nbsp;
                    <label className="control-label">
                      {t("Hard copy of report required")}
                    </label>
                  </div>
                </div>
              </div>

              <div className="box-body">
                <div className="row">
                  <label className="col-md-2">
                    <input
                      type="radio"
                      name="testsearchtype"
                      value="By Test Name"
                      checked={testSearchType === "By Test Name"}
                      onChange={onValueChange}
                    ></input>
                    &nbsp; By TestName
                  </label>

                  <label className="col-md-2">
                    <input
                      type="radio"
                      name="testsearchtype"
                      value="By Test Code"
                      checked={testSearchType === "By Test Code"}
                      onChange={onValueChange}
                    ></input>
                    &nbsp;By TestCode
                  </label>

                  <label className="col-md-3">
                    <input
                      type="radio"
                      name="testsearchtype"
                      value="InBetween"
                      checked={testSearchType === "InBetween"}
                      onChange={onValueChange}
                    ></input>
                    &nbsp;In Between
                  </label>

                  <div className="col-sm-2">
                    <Input
                      type="checkbox"
                      name="VIP"
                      onChange={handleTestChange}
                      checked={testData?.VIP}
                    />
                    <label className="control-label">&nbsp;VIP</label>
                  </div>

                  <div className="col-sm-3">
                    <Input
                      type="checkbox"
                      name="isPediatric"
                      onChange={handleTestChange}
                      checked={testData?.isPediatric}
                    />
                    <label className="control-label">
                      &nbsp;{t("Pedriatic Patient")}
                    </label>
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-8">
                    <Input
                      autoComplete="off"
                      name="TestName"
                      onInput={SearchTest}
                      className="select-input-box form-control input-sm"
                      type="text"
                      onChange={handleBookingChange}
                      value={bookingData.TestName}
                      onKeyDown={handleIndex}
                      onBlur={() => {
                        autocompleteOnBlur(setSuggestion);
                        setTimeout(() => {
                          setBookingData({
                            ...bookingData,
                            TestName: "",
                          });
                        }, 500);
                      }}
                    />
                    {suggestion.length > 0 && (
                      <ul className="suggestion-data">
                        {suggestion.map((data, index) => (
                          <li
                            onClick={() => handleListSearch(data)}
                            key={index}
                            className={`${
                              index === indexMatch && "matchIndex"
                            }`}
                          >
                            {data.TestCode}~{data.TestName}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="col-sm-2" style={{ textAlign: "center" }}>
                    <button type="button" className=" btn  btn-primary btn-sm">
                      Count : {tableData.length}
                    </button>
                  </div>

                  {/* <div
                    className="col-md-2"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <label style={{ color: "red" }}>
                      HC Charge :
                      {appointData?.phelboshare ? appointData?.phelboshare : 0}
                    </label>
                  </div> */}
                </div>

                <div className="row">
                  <div className="col-sm-12">
                    <div
                      className=" box-body divResult table-responsive"
                      id="no-more-tables"
                      // style={{ paddingTop: "3px", paddingBottom: "3px" }}
                    >
                      <div className="row">
                        <table
                          className="table table-bordered table-hover table-striped tbRecord"
                          cellPadding="{0}"
                          cellSpacing="{0}"
                        >
                          <thead className="cf text-center">
                            <tr>
                              <th>#</th>
                              <th>Code</th>
                              <th>Item</th>
                              <th>View</th>
                              <th>DOS</th>
                              <th>MRP</th>
                              <th>Rate</th>
                              <th>Disc.</th>
                              <th>Amt.</th>
                              <th>IsUrgent</th>
                            </tr>
                          </thead>

                          {console.log(tableData)}
                          {tableData.length > 0 && (
                            <tbody>
                              {tableData.map((ele, index) => (
                                <>
                                  <tr key={index}>
                                    <td data-title="S.No">
                                      {index + 1}&nbsp;
                                      <button
                                        className="btn btn-danger  btn-sm"
                                        onClick={() => {
                                          handleFilter(ele);
                                        }}
                                      >
                                        X
                                      </button>
                                    </td>

                                    <td data-title={t("SampleCode")}>
                                      {ele.ItemId}
                                    </td>
                                    <td data-title={t("SampleName")}>
                                      {ele.ItemName}
                                    </td>
                                    <td data-title={t("View")}>
                                      {ele?.DataType === "Test" && (
                                        <i
                                          className="fa fa-search"
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            setShowLog({
                                              status: true,
                                              data: ele?.SampleRemarks,
                                            })
                                          }
                                        />
                                      )}
                                    </td>
                                    <td
                                      data-title={t("DOS")}
                                      style={{ cursor: "pointer" }}
                                      onClick={() => setShowDOS(true)}
                                    >
                                      <i className="fa fa-search" />
                                    </td>
                                    <td data-title={t("MRP")}>{0}</td>

                                    <td data-title={t("Rate")}>{ele.Rate}</td>

                                    <td data-title={t("Disc.")}>
                                      <input
                                        style={{
                                          width: "50px",
                                          textAlign: "end",
                                        }}
                                        type="number"
                                        // name="discountamt"
                                        // value={disAmt}
                                        min={0}
                                        value={0}
                                      />
                                    </td>
                                    <td data-title={t("Amt.")}>
                                      <input
                                        className="currency"
                                        value={Number(ele?.Rate).toFixed(2)}
                                        disabled
                                        style={{ width: "50px" }}
                                      />
                                    </td>
                                    <td data-title={t("IsUrgent")}>
                                      <Input
                                        type="checkbox"
                                        name="isUrgent"
                                        onChange={(e) =>
                                          handleCheckBox(index, e)
                                        }
                                        checked={tableData[index]?.isUrgent}
                                      />
                                    </td>
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
              </div>

              <div className="box-body">
                <div className="row">
                  <div className="col-md-2">
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
                      value={net}
                      type="text"
                      readOnly="readonly"
                    />
                  </div>
                  <div className="col-md-2">
                    <div className="input-group-prepend">
                      <span className="input-group-text font-weight-bold text-info">
                        Total Amount to Pay
                      </span>
                    </div>

                    <Input
                      className="select-input-box form-control input-sm currency"
                      data-val="false"
                      placeholder={"Total_Amount"}
                      id="Total_Amount"
                      name="Total_Amount"
                      disabled={true}
                      value={Number(discount).toFixed(2)}
                      type="text"
                      readOnly="readonly"
                    />
                  </div>
                  <div className="col-md-2">
                    <div className="input-group-prepend">
                      <span className="input-group-text font-weight-bold text-info">
                        Discount Amount
                      </span>
                    </div>
                    <Input
                      name="disAmt"
                      type="number"
                      value={disAmt}
                      onInput={(e) => number(e, 20)}
                      className="select-input-box form-control input-sm currency"
                      onChange={(e) => {
                        if (discountPercentage === "") {
                          if (net === 0 || net < Number(e.target.value)) {
                            toast.error("Please Enter Valid Discount");
                          } else {
                            setdisAmt(e.target.value);
                          }
                        } else {
                          toast.error("Discount Already Given");
                        }
                      }}
                      disabled={tableData.length === 0}
                    />
                  </div>
                  <div className="col-md-2">
                    <div className="input-group-prepend">
                      <span className="input-group-text font-weight-bold text-info">
                        Discount in %
                      </span>
                    </div>
                    <Input
                      name="discountPercentage"
                      type="number"
                      onInput={(e) => number(e, 3)}
                      value={discountPercentage}
                      className="select-input-box form-control input-sm currency"
                      onChange={(e) => {
                        if (disAmt === "") {
                          // console.log(Number(e.target.value));
                          if (net === 0 || Number(e.target.value) > 100) {
                            toast.error("Please Enter Valid Discount");
                          } else {
                            setDiscountPercentage(e.target.value);
                          }
                        } else {
                          toast.error("Discount Already Given");
                        }
                      }}
                      disabled={tableData.length === 0}
                    />
                  </div>
                  {/* </div>

                <div className="row p-2"> */}
                  <div className="col-md-2">
                    <div className="input-group-prepend">
                      <span className="input-group-text font-weight-bold text-info">
                        Discount Given By
                      </span>
                    </div>
                    <SelectBox
                      name="DoctorID"
                      value={testData?.DoctorID}
                      onChange={handleTestChange}
                      options={[
                        { label: "Select Discount By", value: "" },
                        ...discountApproval,
                      ]}
                      isDisabled={tableData.length === 0 || discountamount == 0}
                      className="select-input-box form-control input-sm"
                    />
                  </div>
                  <div className="col-md-2">
                    <div className="input-group-prepend">
                      <span className="input-group-text font-weight-bold text-info">
                        Discount Reason
                      </span>
                    </div>
                    <Input
                      name="DisReason"
                      max={30}
                      disabled={tableData.length === 0 || discountamount == 0}
                      className="select-input-box form-control input-sm"
                      value={testData?.DisReason}
                      onChange={handleTestChange}
                    />
                  </div>
                </div>
              </div>

              {suggestedTest.length > 0 && (
                <Modal show={suggestedTestShow} size="lg">
                  <div
                    className="box-success"
                    style={{
                      marginTop: "200px",
                      backgroundColor: "transparent",
                      maxHeight: "150px",
                      overflowY: "auto",
                    }}
                  >
                    <Modal.Header className="modal-header">
                      <Modal.Title className="modal-title">
                        {t("Suggested  Test")}
                      </Modal.Title>
                      <button
                        type="button"
                        className="close"
                        onClick={() => setSuggestedTestShow(false)}
                      >
                        ×
                      </button>
                    </Modal.Header>
                    <Modal.Body>
                      <table
                        className="table table-bordered table-hover table-striped tbRecord"
                        cellPadding="{0}"
                        cellSpacing="{0}"
                      >
                        <thead
                          className="cf text-center"
                          style={{ zIndex: 99 }}
                        >
                          <tr>
                            <th className="text-center">{t("S.no")}</th>
                            <th className="text-center">{t("DATE")}</th>
                            <th className="text-center">{t("TestName")}</th>
                            <th className="text-center">{t("STATUS")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {suggestedTest.map((ele, index) => (
                            <>
                              <tr key={ele.index}>
                                <td data-title="S.no" className="text-center">
                                  {index + 1}
                                </td>
                                <td data-title="DATE" className="text-center">
                                  {ele.DATE}
                                </td>
                                <td
                                  data-title="TestName"
                                  className="text-center"
                                >
                                  {ele.TestName}
                                </td>
                                <td data-title="STATUS" className="text-center">
                                  {ele.STATUS}
                                </td>
                              </tr>
                            </>
                          ))}
                        </tbody>
                      </table>
                    </Modal.Body>
                  </div>
                </Modal>
              )}
              {lastThreeVisit.length > 0 && (
                <Modal show={lastThreeVisitShow} size="lg">
                  <div
                    className="box"
                    style={{
                      marginTop: "200px",
                      backgroundColor: "transparent",
                      maxHeight: "300px",
                      overflowY: "auto",
                    }}
                  >
                    <Modal.Header className="modal-header">
                      <Modal.Title className="modal-title">
                        {t("Last Test Case")}
                      </Modal.Title>
                      <button
                        type="button"
                        className="close"
                        onClick={() => setLastThreeVisitShow(false)}
                      >
                        ×
                      </button>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="box-body">
                        <div className="row">
                          {lastThreeVisit.slice(0, 3).map((ele, index) => (
                            <>
                              <div className="col-md-4">
                                <table
                                  className="table table-bordered table-hover table-striped table-responsive tbRecord"
                                  cellPadding="{0}"
                                  cellSpacing="{0}"
                                >
                                  <thead className="cf text-center">
                                    <tr>
                                      <th>
                                        {index + 1}) App Date {ele?.appdate}
                                        &nbsp;&nbsp; PreBooking ID :{" "}
                                        {ele?.prebookingid}
                                      </th>
                                    </tr>
                                  </thead>
                                </table>

                                <table
                                  className="table table-bordered table-hover table-striped table-responsive tbRecord"
                                  cellPadding="{0}"
                                  cellSpacing="{0}"
                                >
                                  <thead className="cf text-center">
                                    <tr>
                                      <th className="text-center">Test Name</th>
                                      <th className="text-center">Rate</th>
                                      <th className="text-center">
                                        Disc. Amt.
                                      </th>
                                      <th className="text-center">Amt.</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    <>
                                      <tr key={index}>
                                        <td
                                          data-title="Test Name"
                                          className="text-center"
                                        >
                                          {ele?.ItemName}
                                        </td>
                                        <td
                                          data-title="Rate"
                                          className="text-center"
                                        >
                                          {ele.Rate}
                                        </td>
                                        <td
                                          data-title="Disc. Amt."
                                          className="text-center"
                                        >
                                          {ele.DiscAmt}
                                        </td>
                                        <td
                                          data-title="Amt."
                                          className="text-center"
                                        >
                                          {ele.NetAmt}
                                        </td>
                                      </tr>

                                      <tr
                                        className="cf text-center"
                                        style={{
                                          backgroundColor: "#605ca8",
                                          color: "white",
                                        }}
                                      >
                                        <td data-title="Total">Total</td>
                                        <td>{ele.Rate}</td>
                                        <td>{ele.DiscAmt}</td>
                                        <td>{ele.NetAmt}</td>
                                      </tr>
                                    </>
                                  </tbody>
                                </table>

                                <div
                                  className="row"
                                  style={{
                                    backgroundColor: "#605ca8",
                                    color: "white",
                                  }}
                                >
                                  <label className="col-md-6">
                                    PatientRating : {ele?.PatientRating}&nbsp;☆
                                  </label>

                                  <label className="col-md-6">
                                    PhelboRating : {ele?.PhelboRating}&nbsp;☆
                                  </label>
                                </div>

                                <div
                                  className="row"
                                  style={{
                                    backgroundColor: "#605ca8",
                                    color: "white",
                                  }}
                                >
                                  <label className="col-md-12">
                                    PhelboFeedback : {ele?.PhelboFeedback}
                                  </label>
                                </div>

                                <div
                                  className="row"
                                  style={{
                                    backgroundColor: "#605ca8",
                                    color: "white",
                                  }}
                                >
                                  <label className="col-md-12">
                                    PatientFeedback : {ele?.PatientFeedback}
                                  </label>
                                </div>
                              </div>
                            </>
                          ))}
                        </div>
                      </div>
                    </Modal.Body>
                  </div>
                </Modal>
              )}

              {showLog && (
                <Modal show={showLog.status} size="lg" id="ShowLog">
                  <div
                    style={{
                      marginTop: "250px",
                      backgroundColor: "transparent",
                      height: "200px",
                    }}
                  >
                    <Modal.Header className="modal-header">
                      <Modal.Title className="modal-title">
                        {t("Test Details")}
                      </Modal.Title>
                      <button
                        type="button"
                        className="close"
                        onClick={() =>
                          setShowLog({ status: false, data: showLog.data })
                        }
                      >
                        ×
                      </button>
                    </Modal.Header>
                    <Modal.Body>
                      <div className="box-body">
                        <div className="row">
                          <label>{showLog.data}</label>
                        </div>
                      </div>
                    </Modal.Body>
                  </div>
                </Modal>
              )}
            </div>
          </Modal.Body>

          <Modal.Footer>
            <div className="box-body">
              <div
                className="row"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-block btn-sm"
                    onClick={handleBooking}
                  >
                    Book Slot
                  </button>
                </div>
              </div>
            </div>
          </Modal.Footer>
          <Modal.Body>
            {record.length > 0 && (
              <div className="box hcStatus">
                <div className="box-body">
                  <div className="row">
                    <label className="col-md-2">Appointment List</label>
                    <div className="col-md-3">
                      <button
                        style={{
                          marginTop: "2px",
                          height: "16px",
                          backgroundColor: "#5694dc",
                        }}
                      ></button>
                      <label className="control-label">
                        &nbsp;{t("Selected Patient Pending")}
                      </label>
                    </div>
                    <div className="col-md-3 ">
                      <button
                        style={{
                          marginTop: "2px",
                          height: "16px",
                          backgroundColor: "darkgray",
                        }}
                      ></button>
                      <label className="control-label">
                        &nbsp;{t("Other Patient Pending")}
                      </label>
                    </div>
                    <div className="col-md-2">
                      <button
                        style={{
                          marginTop: "2px",
                          height: "16px",
                          backgroundColor: "lightgreen",
                        }}
                      ></button>
                      <label className="control-label">
                        &nbsp;{t("Completed")}
                      </label>
                    </div>
                    <div className="col-md-2">
                      <button
                        style={{
                          marginTop: "2px",
                          height: "16px",
                          backgroundColor: "pink",
                        }}
                      ></button>
                      <label className="control-label">
                        &nbsp;{t("Cancel")}
                      </label>
                    </div>
                  </div>
                </div>
                <div
                  className="box-body divResult table-responsive boottable"
                  id="no-more-tables"
                >
                  <div className="row">
                    <table
                      className="table table-bordered table-hover table-striped table-responsive tbRecord"
                      cellPadding="{0}"
                      cellSpacing="{0}"
                    >
                      <thead className="cf text-center" style={{ zIndex: 99 }}>
                        <tr>
                          <th className="text-center">{t("PrebookingID")}</th>
                          <th className="text-center">{t("App DateTime")}</th>
                          <th className="text-center">{t("Patient Name")}</th>
                          <th className="text-center">{t("Age/Gender	")}</th>

                          <th className="text-center">{t("Mobile")}</th>
                          <th className="text-center">{t("Address")}</th>
                          <th className="text-center">{t("Area")}</th>
                          <th className="text-center">{t("Pincode")}</th>
                          <th className="text-center">{t("Test")}</th>
                          <th className="text-center">{t("GrossAmt")}</th>
                          <th className="text-center">{t("DiscAmt")}</th>
                          <th className="text-center">{t("NetAmt")}</th>
                          {/* <th className="text-center">{t("Edit")}</th>
                          <th className="text-center">{t("RS")}</th>
                          <th className="text-center">{t("Cancel")}</th> */}
                        </tr>
                      </thead>

                      <tbody>
                        {record.map((ele, index) => (
                          <tr
                            key={index}
                            style={{
                              backgroundColor: ele?.rowcolor,
                              color: "black",
                            }}
                          >
                            <td
                              data-title="PrebookingID"
                              className="text-center"
                            >
                              {ele.prebookingid}&nbsp;
                            </td>
                            <td
                              data-title="AppDateTime"
                              className="text-center"
                            >
                              {ele.appdatetime}&nbsp;
                            </td>
                            <td
                              data-title="PatientName"
                              className="text-center"
                            >
                              {ele.pname}&nbsp;
                            </td>
                            <td data-title="AgeGender" className="text-center">
                              {ele.pinfo}&nbsp;
                            </td>
                            <td data-title="Mobile" className="text-center">
                              {ele.mobile}&nbsp;
                            </td>
                            <td data-title="Address" className="text-center">
                              {ele.house_no}&nbsp;
                            </td>
                            <td data-title="Area" className="text-center">
                              {ele.locality}&nbsp;
                            </td>
                            <td data-title="Pincode" className="text-center">
                              {ele.pincode}&nbsp;
                            </td>
                            <td data-title="Test" className="text-center">
                              {ele.testname}&nbsp;
                            </td>
                            <td data-title="GrossAmt" className="text-center">
                              {ele.rate}&nbsp;
                            </td>

                            <td data-title="DiscAmt" className="text-center">
                              {ele.discamt}&nbsp;
                            </td>
                            <td data-title="NetAmt" className="text-center">
                              {ele.netamt}&nbsp;
                            </td>
                            {/* <td
                              data-title="Edit"
                              className="text-center"
                              style={{ cursor: "pointer" }}
                            >
                              ✎&nbsp;
                            </td>
                            <td
                              data-title="RS"
                              className="text-center"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setShowReschedule(true);
                              }}
                            >
                              ↺&nbsp;
                            </td>
                            <td
                              data-title="Cancel"
                              className="text-center"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setShowCancel(true);
                              }}
                            >
                              X&nbsp;
                            </td> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </Modal.Body>

          <Modal.Footer>
            <div className="box-body">
              <div
                className="row"
                style={{ display: "flex", justifyContent: "space-around" }}
              >
                {lastThreeVisit.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setLastThreeVisitShow((prev) => !prev);
                    }}
                  >
                    Last Three Apointment of {selectedPhelebo?.Phelebo} test
                    case
                  </button>
                )}
                {suggestedTest.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setSuggestedTestShow((prev) => !prev);
                    }}
                  >
                    SuggestedTest
                  </button>
                )}
              </div>
            </div>
          </Modal.Footer>
        </div>

        <Modal.Footer>
          <div className="box"></div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DoAppointmentModal;
