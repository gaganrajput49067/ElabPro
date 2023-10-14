import React, { useEffect, useState } from "react";
import { DatePickers } from "../../ChildComponents/DatePicker";
import { SelectBox } from "../../ChildComponents/SelectBox";
import moment from "moment";
import { SearchBy } from "../../ChildComponents/Constants";
import axios from "axios";
import Input from "../../ChildComponents/Input";
import BootTable from "../../Table/DepartmentReceive";
import Loading from "../util/Loading";
import { toast } from "react-toastify";
import { stateIniti } from "../../ChildComponents/Constants";
import DatePicker from "./../Components/DatePicker";
import {
  autocompleteOnBlur,
  getAccessDataRate,
  getDoctorSuggestion,
  getPaymentModes,
  getTrimmedData,
  selectedValueCheck,
} from "../util/Commonservices";
import MedicialModal from "../util/MedicialModal";
import UploadModal from "../util/UploadModal";

import { useTranslation } from "react-i18next";
import { number } from "../util/Commonservices/number";

const DepartmentReceive = () => {
  const [CentreData, setCentreData] = useState([]);
  const [RateData, setRateData] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [toggleDate, setToggleDate] = useState({
    FromDate: false,
    ToDate: false,
  });
  const [Identity, setIdentity] = useState([]);
  const [drdata, setDrData] = useState([]);
  const [searchstatus, setSearchStatus] = useState([]);
  const [saveTestId, setSaveTestId] = useState([]);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState(stateIniti);
  const [collecteddataexist, SetCollectedDataExist] = useState([]);
  const [show4, setShow4] = useState({
    modal: false,
    data: "",
    index: -1,
  });

  const [show, setShow] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [indexMatch, setIndexMatch] = useState(0);
  const [dropFalse, setDropFalse] = useState(true);

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
  });

  // i18n start
 
  const { t } = useTranslation();
  // i18n end

  const handleIndex = (e) => {
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
        handleListSearch(doctorSuggestion[indexMatch], "DoctorName");
        setIndexMatch(0);
        break;
      default:
        break;
    }
  };

  const handleListSearch = (data, name) => {
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
      default:
        break;
    }
  };

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
    // else if (formData.SelectTypes !== "") {
    //   error = { ...error, ItemValue: "This Field is Required" };
    // }

    // if (formData.FromDate > moment(new Date()).format("DD/MMM/YYYY")) {
    //   error = { ...error, FromDate: t("Date is Invalid") };
    // }

    // if (formData.ToDate > moment(new Date()).format("DD/MMM/YYYY")) {
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
        error = { ...error, FromTime: "Time is Invalid" };
      }
    }

    if (formData.ToDate === moment(new Date()).format("DD/MMM/YYYY")) {
      if (formData.ToTime < formData.FromTime) {
        error = { ...error, ToTime: t("Time Must be Less than From Time") };
      }
    }

    return error;
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
    const { name,value } = event?.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBarcodeReceive = (e) => {
    const keypress = [9, 13];
    if (keypress.includes(e.which)) {
      DirectReceivedByBarcode();
    }
  };

  const handleBarcodeNo = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };
  const DirectReceivedByBarcode = () => {
    if (state.BarcodeNo.length > 0) {
      axios
        .post("api/v1//DepartmentReceive/SampleReceiveBarcode", {
          BarcodeNo: state.BarcodeNo,
        })
        .then((res) => {
          toast.success("Barcode Received Successfully");
          setState({ ...state, BarcodeNo: "" });
          TableData("2");
        })
        .catch((err) => console.log(err));
    }
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
  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;

    setFormData({ ...formData, [secondName]: TimeStamp });
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
        DeptDataValue.unshift({ label: t("All"), value: "" });
        setDepartmentData(DeptDataValue);
      })
      .catch((err) => console.log(err));
  };

  const SaveSampleReceiveDepartment = (TestID) => {
    const data = saveTestId.map((ele) => {
      return {
        ...ele,
        CentreID: formData?.CentreID,
      };
    });
    if (TestID.length > 0) {
      axios
        .post("/api/v1/DepartmentReceive/SampleReceiveDepartment", {
          data: data,
        })
        .then((res) => {
          toast.success(res.data.message);
          TableData("2");
          setSaveTestId([]);
        })
        .catch((err) => {
          if (err.response.status === 504) {
            toast.error(t("Something Went Wrong"));
          }
          if (err.response.status === 401) {
            toast.error(err.response.data.message);
          }
        });
    } else {
      toast.error("Please select atlease one item to continue");
    }
  };

  useEffect(() => {
    getDoctorSuggestion(formData, setDoctorSuggestion, setFormData);
    if (formData?.DoctorName === "") {
      setDropFalse(true);
    }
  }, [formData?.DoctorName]);

  const TableData = (status) => {
    setSaveTestId([]);
    setSearchStatus(status);
    const generatedError = validation();
    if (generatedError === "") {
      setLoading(true);
      axios
        .post(
          "/api/v1/DepartmentReceive/DepartmentReceive",
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
          })
        )
        .then((res) => {
          setDrData(res?.data?.message);
          SetCollectedDataExist(res?.data?.message.some((v) => v.Status === 2));
          setLoad(true);
          setLoading(false);
        })
        .catch((err) => setLoading(false));
      setErrors(generatedError);
    } else {
      setErrors(generatedError);
    }
  };

  const handleUploadCount = (name, value, secondName) => {
    let data = [...drdata];
    if (name === "UploadDocumentCount") {
      data[show?.index][name] = value;
      data[show?.index][secondName] = value === 0 ? 0 : 1;
      setDrData(data);
    } else {
      data[show4?.index][name] = value;
      data[show4?.index][secondName] = value === 0 ? 0 : 1;
      setDrData(data);
    }
  };

  useEffect(() => {
    getAccessCentres();
    getDepartment();
    getPaymentModes("Identity", setIdentity);
  }, []);

  useEffect(() => {
    getAccessDataRate(setRateData, formData?.CentreID).then((res) => {
      setFormData({ ...formData, RateID: res[0]?.value });
    });
  }, [formData?.CentreID]);

  return (
    <>
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

        {show?.modal && (
          <UploadModal
            show={show?.modal}
            handleClose={() => {
              setShow({ modal: false, data: "", index: -1 });
            }}
            options={Identity}
            documentId={show?.data}
            pageName="Patient Registration"
            handleUploadCount={handleUploadCount}
          />
        )}

        <div className="box-header with-border">
          <h3 className="box-title">{t("Department Receive")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-sm-2 ">
              <div className="d-flex" style={{ display: "flex" }}>
                <div style={{ width: "40%" }}>
                  <SelectBox
                    options={SearchBy}
                    className="input-sm"
                    selectedValue={formData.SelectTypes}
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
                        <div className="golbal-Error">{errors?.ItemValue}</div>
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
                      />
                      {errors?.ItemValue && (
                        <div className="golbal-Error">{errors?.ItemValue}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-sm-2 ">
              <SelectBox
                options={CentreData}
                formdata={formData.CentreID}
                selectedValue={formData?.CentreID}
                name="CentreID"
                onChange={handleSelectChange}
              />
              <span
                className="text-danger field-validation-valid"
                data-valmsg-for="CentreID"
                data-valmsg-replace="true"
              ></span>
            </div>
            <div className="col-sm-2">
              <SelectBox
                options={RateData}
                formdata={formData.RateID}
                name="RateID"
                onChange={handleSelectChange}
                selectedValue={ formData?.RateID}
              />
            </div>

            <div className="col-sm-2 ">
              <SelectBox
                options={DepartmentData}
                formdata={formData.DepartmentID}
                name="DepartmentID"
                onChange={handleSelectChange}
              />
              <span
                className="text-danger field-validation-valid"
                data-valmsg-for="CentreID"
                data-valmsg-replace="true"
              ></span>
            </div>

            <div className="col-sm-2  ">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                type="text"
                name="DoctorName"
                value={formData.DoctorName}
                onChange={handleChange}
                onKeyDown={handleIndex}
                placeholder={t("Refer Doctor")}
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
              />
              {dropFalse && doctorSuggestion.length > 0 && (
                <ul
                  className="suggestion-data"
                  style={{ top: "26px", right: "0px" }}
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
            </div>
            <div className="col-sm-2">
              <Input
                className="form-control  input-sm"
                name="BarcodeNo"
                placeholder={t("Type barcode and enter to receive")}
                onKeyDown={handleBarcodeReceive}
                value={state.BarcodeNo}
                onChange={handleBarcodeNo}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-2">
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
            <div className="col-sm-2 ">
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
            <div className="col-sm-1">
              <button
                type="button"
                className="btn btn-block btn-info btn-sm"
                onClick={() => TableData(2)}
              >
                {t("Search")}
              </button>
            </div>
            <div className="col-sm-1">
              <button
                type="button"
                className="btn btn-block btn-success btn-sm"
                onClick={() => TableData(3)}
              >
                {t("Received")}
              </button>
            </div>
            <div className="col-sm-1">
              <button
                type="button"
                className="btn btn-block btn-danger btn-sm"
                onClick={() => TableData(4)}
              >
                {t("Rejected")}
              </button>
            </div>
          </div>
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
              <div className={`${drdata.length > 6 && "boottable"}`}>
                <BootTable
                  drdata={drdata}
                  setSaveTestId={setSaveTestId}
                  saveTestId={saveTestId}
                  show={setShow4}
                  show2={setShow}
                  TableData={TableData}
                />
              </div>
              <div className="row" style={{ float: "right" }}>
                {drdata.length > 0 &&
                  (searchstatus == "2" || collecteddataexist) && (
                    <div className="sm-3">
                      <button
                        className="btn btn-info btn-sm mx-2"
                        onClick={() => SaveSampleReceiveDepartment(saveTestId)}
                      >
                        {t("Receive")}
                      </button>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default DepartmentReceive;
