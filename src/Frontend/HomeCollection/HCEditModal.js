import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import axios from "axios";
import moment from "moment";
import { toast } from "react-toastify";
import DOSModal from "./DOSModal.js";
import { useEffect } from "react";
import { HCPaymentMode } from "../../ChildComponents/Constants";
import { autocompleteOnBlur } from "../util/Commonservices";
import { number } from "../util/Commonservices/number";
import { HandleHCEditBooking } from "../../ChildComponents/validations";
const HCEditModal = ({ showEdit, handleCloseEdit, details, testDetails, PatientDetails, Discamount,changeFlow }) => {
 const [errors,setError]=useState({})
  const [showDOS, setShowDOS] = useState(false);
  const [bindSourceCall, setBindSourceCall] = useState([]);
  const [discountApproval, setDiscountApproval] = useState([]);
  const handleCloseDOS = () => setShowDOS(false);
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
  const [discount, setDiscount] = useState(0); //total amount after discount

  const [discountamount, setDiscountAmount] = useState();
  //discounted amount

  const [tableData, setTableData] = useState([]);

  const [appointData, setAppointData] = useState({
    AppDateTime: details?.AppDate,
    Address: details?.House_No,

    updatepatient: "1",
    HardCopyRequired: details?.HardCopyRequired === 0 ? false : true,
    PheleboNumber: details?.PMobile,
    PhlebotomistID: details?.PhlebotomistId,
    atitude: "",
    Longitude: "",
    ispermanetaddress: 1,
    ReceiptRequired: 1,
    AlternateMobileNo: details?.AlternateMobileNo,
    Client: "",
    PaymentMode: testDetails[0]?.PaymentMode,
    SourceofCollection: Number(details?.SourceofCollection),
    Phelebotomistname: details?.PhleboName,
    emailidpcc: "",
    centrename: details?.Centre,
    RouteName: details?.RouteName,
    RouteID: "",
    deliverych: "",
    endtime: "",
    oldprebookingid: "",
    hcrequestid: "",
    VIP: details?.Vip === 0 ? false : true,
    followupcallid: "",
    PreBookingId: details?.PreBookingId
    // phelboshare: pheleboCharge?.value,
  });
  console.log(appointData)

  const [testData, setTestData] = useState({
    Title: PatientDetails[0]?.Title,
    Patient_ID: details?.Patient_ID,
    PName: PatientDetails[0]?.FirstName,
    Mobile: PatientDetails[0]?.Mobile,
    Email: PatientDetails[0]?.Email,
    DOB: PatientDetails[0]?.Dob,
    Age: PatientDetails[0]?.Age,
    AgeYear: PatientDetails[0]?.AgeYear,
    AgeMonth: PatientDetails[0]?.AgeMonth,
    AgeDays: PatientDetails[0]?.AgeDays,
    TotalAgeInDays: PatientDetails[0]?.TotalAgeInDays,
    Gender: PatientDetails[0]?.Gender,
    House_No: PatientDetails[0]?.HouseNo,
    LocalityID: PatientDetails[0]?.LocalityId,
    Locality: PatientDetails[0]?.Locality,
    CityID: PatientDetails[0]?.CityId,
    City: PatientDetails[0]?.City,
    StateID: PatientDetails[0]?.StateId,
    State: PatientDetails[0]?.State,
    Pincode: PatientDetails[0]?.PinCode,
    Landmark: "",
    PreBookingCentreID: details?.PreBookingCentreID,
    Panel_ID: "",
    GrossAmt: "",
    // DiscAmt: 0,
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
    Remarks: details?.Remarks,
    isUrgent: false,
    isPediatric: "",
  });


  const [suggestedTestShow, setSuggestedTestShow] = useState(false);
  const [suggestedTest, setSuggestedTest] = useState([]);

  console.log(details);
  console.log(testDetails);
  console.log(PatientDetails)
  const { t } = useTranslation();

  function onValueChange(event) {
    setTestSearchType(event.target.value);
  }
  useEffect(() => {
    setNet(
      tableData.reduce(
        (accumulator, currentValue) => accumulator + currentValue.Rate,
        0
      )
    );

    const total = tableData.reduce(
      (accumulator, currentValue) => accumulator + currentValue.Rate,
      0
    )
    console.log(discountamount, total)
    console.log(tableData)

    const datas = tableData.map((ele) => {
      const DiscountPercentage = (Number(discountamount) / Number(total)) * 100;
      const NetAmount = (
        ele?.Rate -
        (DiscountPercentage / 100) * ele?.Rate
      ).toFixed(2);

      return {
        ...ele,
        DiscountPercentage: DiscountPercentage,
        GrossAmt: ele?.Rate,
        DiscAmt:
          tableData?.length > 1
            ? (ele?.Rate - NetAmount).toFixed(2)
            : ele?.DiscAmt,
        NetAmt:NetAmount,

      };


    });
    setTableData(datas)
     console.log(datas);
    if (tableData.length === 0) {
      setNet(0)
      setDiscountAmount(0)
    }

    
    
  }, [tableData.length]);
  

  useEffect(() => {
    setNet(
      testDetails.reduce(
        (accumulator, currentValue) => accumulator + currentValue.Rate,
        0
      )
    );

    // // setDiscountPercentage("");
    // setdisAmt("");
    // setDiscount(0);
    // // setDiscountAmount(0);
  }, []);

  useEffect(() => {
    setDiscount(Number(net) - Number(disAmt))
    setDiscountAmount(disAmt);

  }, [disAmt]);

  useEffect(() => {
    if (!isNaN(net) && !isNaN(discountPercentage)) {
      const discountAmount = (discountPercentage / 100) * net;
      setDiscountAmount(discountAmount);
      setDiscount(Number(net) - Number(discountAmount));
    }
  }, [discountPercentage]);



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
  const getDiscountApproval = () => {
    axios
      .post("/api/v1/CustomerCare/getDiscountApproval", {
        CentreId: details?.PreBookingCentreID,
      })
      .then((res) => {
        const data = res?.data?.message;
        const discount = data?.map((ele) => {
          return {
            value: handleSplit(ele?.VALUE, "#")[0],
            label: ele?.label,
          };
        });
        console.log(discount);
        setDiscountApproval(discount);
      })
      .catch((err) =>
        toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong")
      );
  };
  const handleSplit = (id, symbol) => {
    
    const data = id?.split(symbol);
    return data;
  };

  const handleBooking = () => {
    if (tableData.length === 0) {
      toast.error("Please Select Any Test");
    }
    else if(appointData?.SourceofCollection=="")
    {
      toast.error("Select Source of Collection");
    } else {
      if (appointData?.PaymentMode) {
        if (disAmt || discountPercentage) {
          if (testData?.DoctorID && testData?.DisReason) {
            handleUpdate();
          } else {
            toast.error("Please Choose Discount Approval And Discount Reason");
          }
        } else {
          handleUpdate();
        }
      } else {
        toast.error("Please Select Payment Mode");
      }
    }
  };


  const handleUpdate = () => {

    console.log(appointData);
    console.log(tableData);

    const datas = tableData.map((ele) => {
      const DiscountPercentage = (Number(discountamount) / Number(net)) * 100;
      const NetAmount = (
        ele?.Rate -
        (DiscountPercentage / 100) * ele?.Rate
      ).toFixed(2);
     
      return {
        ...ele,
        DiscountPercentage: DiscountPercentage,
        GrossAmt: ele?.Rate,
        DiscAmt:
          tableData?.length > 1
            ? (ele?.Rate - NetAmount).toFixed(2)
            : discountamount,
        NetAmt: tableData?.length > 1 ? NetAmount : discount,
        isUrgent: ele?.isUrgent ? 1 : 0,
        Remarks:testData?.Remarks,
        isPediatric: ele?.isPediatric ? 1 : 0,
      };
    });

    console.log(datas);
    const generatedError = HandleHCEditBooking(appointData);
    if(generatedError==="")
    {
      axios
      .post("/api/v1/HomeCollectionSearch/UpdateHomeCollection", {
        datatosave: datas,
        ...appointData,
        HardCopyRequired: appointData.HardCopyRequired ? 1 : 0,
        VIP:appointData.VIP?1:0
      })
      .then((res) => {
        console.log(res?.data?.message);
        toast.success("Update Successfully");
        // handleAppointment();
        // callhandleOnRouteValue(routeValueData);
        handleCloseEdit();
        changeFlow(appointData);


      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
    }
    else {
      setError(generatedError);
    }
    


  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData({ ...bookingData, [name]: value });

    console.log(bookingData);
  };

  const handleAppointChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAppointData({ ...appointData, [name]: type === 'checkbox' ? checked : value });

    console.log(bookingData);
  };





  const SearchTest = (e) => {
    const val = e.target.value;
    axios
      .post("/api/v1/CustomerCare/BindBillingTestDataHomeCollection", {
        CentreID: details?.PreBookingCentreID,
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
  // const calculateAmt = (rate) => {

  //   const TotalRate = rate + tableData.reduce((current, item) =>
  //     current + item.Rate, 0);

  //   console.log(TotalRate, discountamount);
  //   const percentage = (discountamount / TotalRate) * 100;
  //   console.log(percentage.toFixed(2));

  //   const deductedAmount = rate * (percentage / 100);

  //   return deductedAmount.toFixed(2);
  // }
  // const calculateNet = (rate) => {
  //   const TotalRate = rate + tableData.reduce((current, item) =>
  //     current + item.Rate, 0);

  //   console.log(TotalRate, discountamount);
  //   const percentage = (discountamount / TotalRate) * 100;
  //   console.log(percentage.toFixed(2));

  //   const deductedAmount = rate * (percentage / 100);

  //   return Number(rate - deductedAmount.toFixed(2));


  // }
  const getTableData = (data) => {

    const ItemIndex = tableData.findIndex((e) => e.InvestigationID === data.InvestigationID)

    if (ItemIndex === -1) {
      axios
        .post("/api/v1/CustomerCare/BindSingleTestDataHomeCollection", {
          InvestigationID: data.InvestigationID,
          CentreID: data.CentreID,
        })
        .then((res) => {
          const newData = res?.data?.message;
          console.log(newData);
          const appendedData = [
            ...tableData,
            ...newData.map((ele) => {
              return {
                ...testData,
                DataType: ele?.DataType,
                DepartmentID: ele?.DepartmentID,
                FromAge: ele?.FromAge,
                Gender: ele?.Gender,
                InvestigationID: ele?.InvestigationID,
                IsSampleRequired: ele?.IsSampleRequired,
                Rate: ele?.Rate,
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
                DiscAmt:0


              };
            }),
          ];
          console.log(appendedData);
          setDiscountAmount('');
          setDiscountPercentage('');
          setTableData(appendedData);
        })
        .catch((err) => console.log(err));
    }

    else {
      toast.error("Duplicate Test Found")
    }

  };

  const handleFilter = (data) => {
    const value = tableData.filter(
      (ele) => ele.InvestigationID !== data.InvestigationID
    );
    console.log(value);
     setDiscountAmount('');
     setDiscountPercentage('');
     const value2=value.map((item)=>{
      return {...item,DiscAmt:0}
     })
    setTableData(value2);
    toast.success("Successfully Removed");
  };




  const fillTableData = () => {
    console.log(testData)
    console.log(testDetails);
    const testdetails2 = testDetails.map(({ Discamt, ...rest }) => {
      return { ...rest, DiscAmt: Discamt
      };
    });
    const testDetails3 = testdetails2.map((item) => {
      return { ...item, InvestigationID: item?.ItemId }
    })
    const tableData = testDetails3.map((item) => {
      return { ...testData, ...item }
    })
    console.log(tableData)
    setTableData(tableData)
    
  };
  console.log(tableData);

  const handleTestChange = (e) => {
    const { name, value, type, checked } = e.target;
    console.log(testData?.Remarks);
    setTestData({
      ...testData,
      [name]: type === "checkbox" ? checked : value,
    });
  };


  const handleCheckBox = (index, e) => {
    const { name, checked } = e.target;

    const newData = [...tableData];

    newData[index] = {
      ...newData[index],
      [name]: checked,
    };

    setTableData(newData);
  };
  useEffect(() => {
    getBindSourceCall();
    fillTableData();
    getDiscountApproval();
    setDiscountAmount(Discamount.toFixed(2))
  }, []);



  console.log(tableData);

  return (
    <>
      {showDOS && (
        <DOSModal showDOS={showDOS} handleCloseDOS={handleCloseDOS} />
      )}
      <Modal
        show={showEdit}
        size="lg"
        style={{ backgroundColor: "black" }}
        id="HomeCollectionDetailModal"
      >
        <Modal.Header className="modal-header">
          <Modal.Title className="modal-title">{t("Book Slot")}</Modal.Title>
          <button type="button" className="close" onClick={handleCloseEdit}>
            ×
          </button>
        </Modal.Header>
        <div className="box ">
          <div className="box-body">
            <div className="row">
              <label className="col-sm-12  col-md-3" htmlFor="PhelboName">
                {t("Phelebotmist Name")}:
              </label>
              <div className="col-sm-12 col-md-3">
                <span
                  style={{ fontWeight: "bold" }}
                >{`${details?.PhleboName}(${details?.PMobile})`}</span>
              </div>

              <label
                className="col-sm-12  col-md-3"
                htmlFor="Appointment Date and Time"
              >
                {t("Appointment Date and Time")}:
              </label>
              <div className="col-sm-12 col-md-3">
                <span style={{ fontWeight: "bold" }}>{details?.AppDate}</span>
              </div>
            </div>
            <div className="row">
              <label className="col-sm-12  col-md-3" htmlFor="ReferDoctor">
                {t("Referred Doctor")}:
              </label>
              <div className="col-sm-12 col-md-3">
                <Input
                  className="select-input-box form-control input-sm"
                  value={testData?.RefDoctor}
                  type="text"
                  onChange={handleTestChange}
                  name="RefDoctor"
                />
              </div>

              <label className="col-sm-12  col-md-3" htmlFor="AltMobile">
                {t("Alternate Mobile No.")} :
              </label>
              <div className="col-sm-12 col-md-3">
                <Input
                  className="select-input-box form-control input-sm"
                  type="number"
                  autoComplete="off"
                  max={10}
                  onChange={handleAppointChange}
                  onInput={(e) => number(e, 10)}
                  value={appointData?.AlternateMobileNo}
                  name="AlternateMobileNo"
                />
                 {appointData?.AlternateMobileNo === "" && (
                      <span className="golbal-Error">
                        {errors?.Alternatemobilenos}
                      </span>
                    )}
                {appointData?.AlternateMobileNo.length > 0 &&
                      appointData?.AlternateMobileNo.length !== 10 && (
                        <span className="golbal-Error">
                          {errors?.Alternatemobilenum}
                        </span>
                      )}
              </div>
            </div>

            <div className="row">
              <label className="col-sm-12  col-md-3" htmlFor="srcCollection">
                {t("Source of Collection")} :
              </label>
              <div className="col-sm-12 col-md-3">
                <SelectBox
                  name="SourceofCollection"
                  className="input-sm"
                  selectedValue={appointData?.SourceofCollection}
                  options={[
                    { label: "Select Source Of Collection", value: "" },
                    ...bindSourceCall,
                  ]}
                  onChange={handleAppointChange}
                />
              </div>
              <label className="col-sm-12  col-md-3" htmlFor="Remarks">
                {t("Remarks")} :
              </label>
              <div className="col-sm-12 col-md-3">
                <Input
                  className="select-input-box form-control input-sm"
                  type="text"
                  name="Remarks"
                  onChange={handleTestChange}
                  value={testData?.Remarks}
                />
              </div>
            </div>
            <div className="row">
              <label className="col-sm-12  col-md-3" htmlFor="paymentmode">
                {t("Payment Mode")} :
              </label>
              <div className="col-sm-12 col-md-3">
                <SelectBox
                  name="PaymentMode"
                  selectedValue={appointData?.PaymentMode}
                  className="input-sm"
                  options={[
                    { label: "Select Payment Mode", value: "" },
                    ...HCPaymentMode,
                  ]}
                  isDisabled={tableData.length === 0}
                  onChange={handleAppointChange}
                />
              </div>
              <label className="col-sm-12  col-md-3" htmlFor="Address">
                {t("Address")} :
              </label>
              <div className="col-sm-12 col-md-3">
                <Input
                  className="select-input-box form-control input-sm"
                  type="text"
                  name="Address"
                  value={appointData?.Address}
                  onChange={handleAppointChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-sm-1">
                <Input
                  type="checkbox"
                  name="VIP"
                  onChange={handleAppointChange}
                  checked={appointData?.VIP}
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
              </div>

              <div className="col-sm-3">
                <Input
                  type="checkbox"
                  name="HardCopyRequired"
                  onChange={handleAppointChange}
                  checked={appointData?.HardCopyRequired}
                />
                <label className="control-label">
                  {t("Hard copy of report required")}
                </label>
              </div>
              <label
                className="col-sm-3 control-label"
                style={{ textAlign: "end" }}
              >
                {t("Total Amount to Pay")} :
              </label>

              <div className="col-sm-1">
                <Input
                  name="totalAmount"
                  className="select-input-box form-control input-sm"
                  value={net - discountamount}
                />
              </div>
            </div>
          </div>
          <hr></hr>
          <div className="box-body">
            <div className="row">
              <div className="col-sm-8">
                <div
                  className="row"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <label className="col-sm-2">
                    <input
                      type="radio"
                      name="testsearchtype"
                      value="By Test Name"
                      checked={testSearchType === "By Test Name"}
                      onChange={onValueChange}
                    ></input>
                    ByTestName
                  </label>

                  <label className="col-sm-2">
                    <input
                      type="radio"
                      name="testsearchtype"
                      value="By Test Code"
                      checked={testSearchType === "By Test Code"}
                      onChange={onValueChange}
                    ></input>
                    ByTestCode
                  </label>

                  <label className="col-sm-2">
                    <input
                      type="radio"
                      name="testsearchtype"
                      value="InBetween"
                      checked={testSearchType === "InBetween"}
                      onChange={onValueChange}
                    ></input>
                    InBetween
                  </label>

                  <button
                    type="button"
                    className="col-sm-1 btn  btn-primary btn-sm"
                  >
                    Count : {tableData.length}
                  </button>

                </div>
                <div
                  className="row"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <div className="col-sm-6">
                    <Input
                      autoComplete="off"
                      name="TestName"
                      onInput={SearchTest}
                      className="select-input-box form-control input-sm"
                      type="text"
                      onChange={handleChange}
                      value={bookingData.TestName}
                      onKeyDown={handleIndex}
                      onBlur={() => {
                        autocompleteOnBlur(setSuggestion);
                        setTimeout(() => {
                          setBookingData({ ...bookingData, TestName: "" });
                        }, 500);
                      }}
                    />
                    {suggestion.length > 0 && (
                      <ul className="suggestion-data">
                        {suggestion.map((data, index) => (
                          <li
                            onClick={() => handleListSearch(data)}
                            key={index}
                            className={`${index === indexMatch && "matchIndex"
                              }`}
                          >
                            {data.TestCode}~{data.TestName}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="col-sm-8">
                    <span style={{ fontWeight: 'bold' }}>
                      Total Amount :&nbsp;
                      {net}
                    </span>
                    &nbsp;&nbsp;
                    <span style={{ fontWeight: 'bold' }}>
                      Disc Amount :&nbsp;
                      {Number(discountamount).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div
                  className="row"
                  style={{ display: "flex", alignItems: "center" }}
                >
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
                          
                          {tableData.length > 0 && (
                            <tbody>
                              
                              {tableData.map((ele, index) => (
                                <>
                                  <tr key={index}>
                                    <td data-title="S.No">
                                      {index + 1}
                                      <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => {
                                          handleFilter(ele);
                                        }}
                                      >
                                        X
                                      </button>
                                    </td>

                                    <td data-title={t("SampleCode")}>
                                      {ele.TestCode
                                        ? ele.TestCode
                                        : ele?.ItemId}
                                    </td>
                                    <td data-title={t("SampleName")}>
                                      {ele.TestName
                                        ? ele.TestName
                                        : ele?.ItemName}
                                    </td>
                                    <td data-title={t("View")}>{ele?.View}</td>
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
                                        style={{ width: "50px" }}
                                        type="number"
                                        className="select-input-box form-control input-sm"
                                        name="discountamt"
                                        value={ele?.DiscAmt}
                                        disabled
                                        min={0}
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
                                      <th className="text-center">
                                        {t("S.no")}
                                      </th>
                                      <th className="text-center">
                                        {t("DATE")}
                                      </th>
                                      <th className="text-center">
                                        {t("TestName")}
                                      </th>
                                      <th className="text-center">
                                        {t("STATUS")}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {suggestedTest.map((ele, index) => (
                                      <>
                                        <tr key={ele.index}>
                                          <td
                                            data-title="S.no"
                                            className="text-center"
                                          >
                                            {index + 1}
                                          </td>
                                          <td
                                            data-title="DATE"
                                            className="text-center"
                                          >
                                            {ele.DATE}
                                          </td>
                                          <td
                                            data-title="TestName"
                                            className="text-center"
                                          >
                                            {ele.TestName}
                                          </td>
                                          <td
                                            data-title="STATUS"
                                            className="text-center"
                                          >
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-4">
                <div className="row">
                  <label className="col-sm-4">Discount Amt :</label>
                  <div className="col-sm-6">

                    <Input
                      name="DiscAmt"
                      value={discountamount !== 0 ? discountamount : ''}
                      type="number"
                      className="select-input-box form-control input-sm"
                      onInput={(e) => number(e, 20)}
                      placeholder="Disc Amt"
                      onChange={(e) => {
                        console.log(tableData)
                       
                     
                        if (
                          tableData?.reduce(
                            (acc, init) =>  Number(acc) + Number(init.DiscAmt),
                            0
                          ) != 0
                        ) {
                          toast.error("Discount already given");
                          return;
                        } else if (discountPercentage === "") {
                          if (net === 0 || net < Number(e.target.value)) {
                            toast.error("Please Enter Valid Discount");
                          } else {
                            setdisAmt(e.target.value);
                          }
                        } else {
                          toast.error("Discount Already Given");
                        }
                      }}
                      
                    />
                  </div>
                </div>


                <div className="row">
                  <label className="col-sm-4">Discount in % :</label>
                  <div className="col-sm-6">
                    <Input
                      name="discountPercentage"
                      type="number"

                      onInput={(e) => number(e, 3)}
                      value={discountPercentage}
                      placeholder="Disc Perc"
                      className="select-input-box form-control input-sm"
                      onChange={(e) => {
                       console.log(tableData);
                        if (
                          tableData?.reduce(
                            (acc, init) => Number(acc) + Number(init.DiscAmt),
                            0
                          ) != 0
                        ) {
                          toast.error("Discount already given");
                          return;
                        } else if (disAmt === "") {
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
                    />
                  </div>
                </div>
                <div className="row">
                  <label className="col-sm-4">Discount By :</label>
                  <div className="col-sm-6">
                    <SelectBox
                      name="DoctorID"
                      // value={testData?.DoctorID}
                      // onChange={handleTestChange}
                      options={[
                        { label: "Select Discount By", value: "" },
                        ...discountApproval,
                      ]}
                      isDisabled={discountamount==''}
                      className="select-input-box form-control input-sm"
                      onChange={handleTestChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <label className="col-sm-4">Discount Reason:</label>
                  <div className="col-sm-6">
                    <Input
                      name="DisReason"
                      disabled={discountamount==''}
                      className="select-input-box form-control input-sm"
                      value={testData?.DisReason}
                      onChange={handleTestChange}
                      
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

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
                  Update Appointment
                </button>
              </div>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HCEditModal;
