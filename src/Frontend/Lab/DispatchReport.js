import React, { useEffect, useState } from "react";
import { DatePickers } from "../../ChildComponents/DatePicker";
import { SelectBox } from "../../ChildComponents/SelectBox";
import moment from "moment";
import {
  DateTypeSearch,
  SampleStatus,
  SearchBy,
} from "../../ChildComponents/Constants";
import axios from "axios";
import Input from "../../ChildComponents/Input";
import BootTable from "../../Table/DispatchTable";
import Loading from "../util/Loading";
import {
  DepartmentWiseItemList,
  autocompleteOnBlur,
  getAccessDataRate,
  getDoctorSuggestion,
  getPaymentModes,
  getTrimmedData,
  selectedValueCheck,
} from "../util/Commonservices";
import AutoComplete from "../../ChildComponents/AutoComplete";
import CustomDate from "../../ChildComponents/CustomDate";
import MedicialModal from "../util/MedicialModal";
import UploadModal from "../util/UploadModal";
import DatePicker from "./../Components/DatePicker";
import { dateConfig } from "./../util/DateConfig";

import { useTranslation } from "react-i18next";
import { number } from "../util/Commonservices/number";

const DispatchReport = () => {
  const [CentreData, setCentreData] = useState([]);
  const [RateData, setRateData] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [toggleDate, setToggleDate] = useState({
    FromDate: false,
    ToDate: false,
  });
  const [TestSuggestion, setTestSuggestion] = useState([]);
  const [dispatchData, setDispatchData] = useState([]);
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [indexMatch, setIndexMatch] = useState(0);
  const [dropFalse, setDropFalse] = useState(true);
  const [show, setShow] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  const [Identity, setIdentity] = useState([]);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
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
    DateTypeSearch: "Date",
  });


    const { t } = useTranslation();
   
  const handleIndex = (e, name) => {
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
            handleListSearch(doctorSuggestion[indexMatch], name);
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
            handleListSearch(TestSuggestion[indexMatch], name);
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

  const [show4, setShow4] = useState({
    modal: false,
    data: "",
    index: -1,
  });

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

  const handleUploadCount = (name, value, secondName) => {
    let data = [...dispatchData];
    if (name === "UploadDocumentCount") {
      data[show?.index][name] = value;
      data[show?.index][secondName] = value === 0 ? 0 : 1;
      setDispatchData(data);
    } else {
      data[show4?.index][name] = value;
      data[show4?.index][secondName] = value === 0 ? 0 : 1;
      setDispatchData(data);
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
      error = { ...error, ItemValue: "Please Choose Value" };
    }
    if (formData.SelectTypes === "Mobile") {
      if (formData?.SelectTypes !== "" && formData?.ItemValue === "") {
        error = { ...error, ItemValue: t("This Field is Required") };
      } else if (formData.ItemValue.length !== 10) {
        error = { ...error, ItemValue: t("Invalid Mobile Number") };
      }
    }

    // if (moment(formData.FromDate).isAfter(moment(new Date()))) {
    //   error = { ...error, FromDate: "Date is Invalid" };
    // }

    // if (moment(formData.ToDate).isAfter(moment(new Date()))) {
    //   error = { ...error, ToDate: "Date is Invalid" };
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
        error = { ...error, ToTime: "Time Must be Less than From Time" };
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
    const { name, value } = event.target;
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
          "/api/v1/Dispatch/PatientLabSearch",
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
          setDispatchData(res?.data?.message);
          setLoad(true);
          setLoading(false);
        })
        .catch((err) => setLoading(false));
      setErrors(generatedError);
    } else {
      setErrors(generatedError);
    }
  };
  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;
  
    setFormData({ ...formData, [secondName]: TimeStamp });
  };
  useEffect(() => {
    getAccessCentres();
    getDepartment();
    getPaymentModes("Identity", setIdentity);
  }, []);

  const handleSelectChange1 = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    TableData(value);
  };
  useEffect(() => {
    getAccessDataRate(setRateData, formData?.CentreID).then((res) => {
      setFormData({ ...formData, RateID: res[0]?.value });
    });
  }, [formData?.CentreID]);

  useEffect(() => {
    if (formData?.TestName.length > 2) {
      DepartmentWiseItemList(
        formData.DepartmentID,
        formData?.TestName,
        setTestSuggestion
      );
    }
  }, [formData?.TestName]);

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
          <h3 className="box-title">{t("DispatchReport")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-sm-2">
              <div className="d-flex" style={{ display: "flex" }}>
                <div style={{ width: "40%" }}>
                  <SelectBox
                    options={SearchBy}
                    formdata={formData.SelectTypes}
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
                        on
                      />
                      {errors?.ItemValue && (
                        <div className="golbal-Error">{errors?.ItemValue}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-sm-2  ">
              <SelectBox
                options={CentreData}
                formdata={formData.CentreID}
                name="CentreID"
                selectedValue={formData?.CentreID}
                onChange={handleSelectChange}
              />
              <span
                className="text-danger field-validation-valid"
                data-valmsg-for="CentreID"
                data-valmsg-replace="true"
              ></span>
            </div>
            <div className="col-sm-2 ">
              <SelectBox
                options={RateData}
                formdata={formData.RateID}
                selectedValue={formData?.RateID}
                name="RateID"
                onChange={handleSelectChange}
              />
            </div>

              <div className="col-sm-2  ">
             
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
                  className="form-control select-input-box ui-autocomplete-input input-sm"
                  type="text"
                  name="DoctorName"
                  value={formData.DoctorName}
                  onChange={handleChange}
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
                    style={{ top: "47px", right: "20px" }}
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
         
            <div className="col-sm-2  ">
                <Input
                  className="form-control ui-autocomplete-input input-sm"
                  type="text"
                  name="TestName"
                  value={formData.TestName}
                  placeholder={t("Search by test name")}
                  onChange={handleChange}
                  onKeyDown={(e) => handleIndex(e, "TestName")}
                />
                {TestSuggestion.length > 0 && (
                  <AutoComplete
                    test={TestSuggestion}
                    handleListSearch={handleListSearch}
                    indexMatch={indexMatch}
                  />
                )}
              </div>
            </div>
          <div className="row">
            <div className="col-sm-2  ">
              <SelectBox
                options={[
                  { label: "DateTypeSearch", value: "" },
                  ...DateTypeSearch,
                ]}
                formdata={formData?.DateTypeSearch}
                name="DateTypeSearch"
                onChange={handleSelectChange}
              />
              <span
                className="text-danger field-validation-valid"
                data-valmsg-for="CentreID"
                data-valmsg-replace="true"
              ></span>
            </div>
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
            
              <div className="col-sm-2">
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
                options={[{label:"Search By",value:""},...SampleStatus]}
                onChange={handleSelectChange1}
                name="SampleStatus"
                selectedValue={formData.SampleStatus}
              />
            </div>

            <div className="col-sm-1">
              <button
                className="btn btn-info btn-block btn-sm"
                onClick={() => TableData("")}
              >
                {t("Search")}
              </button>
            </div>
          </div>

          {/* <div className="row">
            <div className="col-sm-1">
              <a
                href="javascript:void(0);"
                onClick={() => TableData("")}
                className="foreColor"
              >
                <div className=" Status-0 btn btn-info w-100 input-sm center round">
                  Search
                </div>
              </a>
            </div>
            <div className="col-sm-1   ">
              <a
                href="javascript:void(0);"
                onClick={() => TableData(1)}
                className="foreColor"
              >
                <div className=" Status-1 btn btn-danger w-100 input-sm center round">
                  Not Collected
                </div>
              </a>
            </div>
            <div className="col-sm-1  ">
              <a
                href="javascript:void(0);"
                onClick={() => TableData(2)}
                className="foreColor"
              >
                <div className=" Status-2 btn btn-warning w-100 input-sm center round">
                  Collected
                </div>
              </a>
            </div>
            <div className="col-sm-1   ">
              <a
                href="javascript:void(0);"
                onClick={() => TableData(3)}
                className="foreColor"
              >
                <div className=" Status-3 btn btn-success w-100 input-sm center round">
                  Receive
                </div>
              </a>
            </div>

              <div className="col-sm-1  ">
                <a
                  href="javascript:void(0);"
                  onClick={() => TableData(4)}
                  className="foreColor"
                >
                  <div className=" Status-4 btn btn-danger w-100 input-sm center round">
                    Rejected
                  </div>
                </a>
              </div>
              <div className="col-sm-1  ">
                <a
                  href="javascript:void(0);"
                  onClick={() => TableData(10)}
                  className="foreColor"
                >
                  <div className=" Status-10 btn btn-success w-100 input-sm center round">
                    Result Done
                  </div>
                </a>
              </div>
              <div className="col-sm-1   ">
                <a
                  href="javascript:void(0);"
                  onClick={() => TableData(5)}
                  className="foreColor"
                >
                  <div className=" Status-5 btn btn-success w-100 input-sm center round">
                    Approved
                  </div>
                </a>
              </div>
              <div className="col-sm-1 ">
                <a
                  href="javascript:void(0);"
                  onClick={() => TableData(11)}
                  className="foreColor"
                >
                  <div className=" Status-11 btn btn-info w-100 input-sm center round">Hold</div>
                </a>
              </div>
              <div className="col-sm-1  ">
                <a
                   href="javascript:void(0);"
                  onClick={() => TableData(14)}
                  className="foreColor"
                >
                  <div className=" Status-14 btn btn-primary w-100 input-sm center round">
                    Re-Run
                  </div>
                </a>
              </div>
              <div className="col-sm-1  ">
                <a
                  href="javascript:void(0);"
                  onClick={() => TableData(13)}
                  className="foreColor"
                >
                  <div className=" Status-13 btn btn-info w-100 input-sm center round">
                    Mac Data
                  </div>
                </a>
              </div>
              <div className="col-sm-1">
                <a
                   href="javascript:void(0);"
                  onClick={() => TableData(15)}
                  className="foreColor"
                >
                  <div className=" Status-15 btn btn-warning w-100 input-sm center round">
                    Dispatched
                  </div>
                </a>
              </div>

            <div className="col-sm-1 ">
              <a
                href="javascript:void(0);"
                onClick={() => TableData("")}
                className="foreColor "
              >
                <div className=" Status-all btn btn-success w-100 input-sm center round ">
                  All
                </div>
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
                dispatchData={dispatchData}
                show={setShow4}
                show2={setShow}
              />
            </div>
          </div>
        )
      )}
    </>
  );
};

export default DispatchReport;
