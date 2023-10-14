import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Input from "../../ChildComponents/Input";
import { toast } from "react-toastify";
import {
  DepartmentWiseItemList,
  autocompleteOnBlur,
  getTrimmedData,
  isChecked,
} from "../util/Commonservices";
import moment from "moment";
import DatePicker from "../Components/DatePicker";
import { SearchBy } from "../../ChildComponents/Constants";
import Loading from "../util/Loading";
import { SelectBox } from "../../ChildComponents/SelectBox";
import AutoComplete from "../../ChildComponents/AutoComplete";
import { useTranslation } from "react-i18next";


const ApproveDispatch = () => {
  const [errors, setErrors] = useState({});
  const [dropFalse, setDropFalse] = useState(true);
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [TestSuggestion, setTestSuggestion] = useState([]);
  const [indexMatch, setIndexMatch] = useState(0);
  const [DoctorData, setDoctorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tabledata, setTableData] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [payload, setPayload] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    FromTime: "00:00:00",
    ToTime: "23:59:59",
    DepartmentID: "0",
    ItemID: "",
    SearchType: "",
    SearchValue: "",
    DoctorID: "",
    TestName: "",
    ApporvedByName: "",
    isChecked: "",
    SearchValue: "",
  });


  const { t } = useTranslation();

  const dateSelect = (date, name) => {
    setPayload({
      ...payload,
      [name]: date,
    });
  };



  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;

    setPayload({ ...payload, [secondName]: TimeStamp });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleSelectChange = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    setPayload({
      ...payload,
      [name]: value,
      ApporvedByName: label,
    });
    setErrors({});
  };

  const getDepartment = () => {
    axios
      .get("/api/v1/Department/getDepartmentData")
      .then((res) => {
        let data = res.data.message;
        let DeptDataValue = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        DeptDataValue.unshift({ label: "All", value: "0" });
        setDepartmentData(DeptDataValue);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (payload?.TestName.length > 2) {
      DepartmentWiseItemList(
        payload.DepartmentID == 0 ? "" : payload.DepartmentID,
        payload?.TestName,
        setTestSuggestion
      );
    }
  }, [payload?.TestName]);


  const handleListSearchNew = (data, name) => {
    switch (name) {
      case "DoctorName":
        setPayload({
          ...payload,
          [name]: data.Name,
          DoctorReferal: data.Name ? data.DoctorReferalID : "",
        });
        setIndexMatch(0);
        setDoctorSuggestion([]);
        setDropFalse(false);
        break;

      case "TestName":
        setPayload({
          ...payload,
          [name]: data.TestName,
        });
        setIndexMatch(0);
        setTestSuggestion([]);
        break;
      default:
        break;
    }
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
        setDoctorData(doctorData);
      })
      .catch((err) => console.log(err));
  };


  
  // const getDoctorSuggestion = () => {
  //   axios
  //     .post("/api/v1/DoctorReferal/getDoctorDataBind")
  //     .then((res) => {
  //       const data = res?.data?.message;
  //       const val = data?.map((ele) => {
  //         return {
  //           label: ele?.DoctorName,
  //           value: ele?.DoctorID,
  //         };
  //       });
  //       setDoctorData(val);
  //     })
  //     .catch((err) => console.log(err));
  // };

  const getDropDownData = () => {
    axios
      .post("/api/v1/Global/getGlobalData")
      .then((res) => {
        let data = res.data.message;
        console.log(data);
        let value = data.map((ele) => {
          return {
            value: ele.FieldID,
            label: ele.FieldDisplay,
          };
        });
      })
      .catch((err) => console.log(err));
  };



  const handleSearch = (name) => {
    const generatedError = validation();
    if (generatedError === "") {
      setTableData([]);
      setLoading(true);
      axios
        .post(
          "/api/v1/ApproveDispatch/PatientSearch",
          getTrimmedData({
            ...payload,
            Flag: name,
            FromDate: moment(payload?.FromDate).format("DD-MMM-YYYY"),
            ToDate: moment(payload?.ToDate).format("DD-MMM-YYYY"),
          })
        )
        .then((res) => {
          setTableData(res?.data?.message);
          setLoading(false);
        })
        .catch(() => {
          toast.error("No Data Found");
          setLoading(false);
        });
    } else {
      setErrors(generatedError);
    }
  };

  const handleSave = () => {
    const val = tabledata.filter((ele) => ele?.isSelect === true);
    if (payload?.DoctorID && val?.length > 0) {
      setLoading(true);
      const playdata = val.map((ele) => {
        return {
          ApporvedByID: payload?.DoctorID,
          ApporvedByName: payload?.ApporvedByName,
          TestID: ele?.testid,
        };
      });
      axios
        .post("/api/v1/ApproveDispatch/SaveLabObservationOpdData", {
          TestIDDetail: playdata,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setLoading(false);
          // handleSearch();
          setTableData([]);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something went wrong."
          );
          setLoading(false);
        });
    } else {
      if (val.length === 0) {
        toast.error("Please Choose atleast One test");
        return;
      }
      toast.error("Please Choose Doctor");
    }
  };

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

  const handleChangeNew = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const updateData = [...tabledata];
      tabledata[index][name] = checked;
      setTableData(updateData);
    } else {
      const updateData = tabledata.map((item) => {
        return {
          ...item,
          isSelect: checked,
        };
      });
      setTableData(updateData);
    }
  };

  // useEffect(() => {
  //   getDoctorSuggestion(payload, setDoctorSuggestion, setPayload);
  //   if (payload?.DoctorName === "") {
  //     setDropFalse(true);
  //   }
  // }, [payload?.DoctorName]);

  const validation = () => {
    let error = "";
    if (payload?.SearchType !== "" && payload?.SearchValue === "") {
      error = { ...error, SearchValue: t("Please Choose Value") };
    }
    if (payload.SearchType === "Mobile") {
      if (payload.SearchValue.length !== 10) {
        error = { ...error, SearchValue: t("Invalid Mobile Number") };
      }
    }

    if (moment(payload.FromDate).isAfter(moment(new Date()))) {
      error = { ...error, FromDate: t("Date is Invalid") };
    }

    if (moment(payload.ToDate).isAfter(moment(new Date()))) {
      error = { ...error, ToDate: t("Date is Invalid") };
    } else if (moment(payload.FromDate).isAfter(moment(payload.ToDate))) {
      error = {
        ...error,
        ToDate: t("Date Must be Greater Then Or Equal to From Date"),
      };
    }
    if (payload.FromDate === moment(new Date()).format("DD/MMM/YYYY")) {
      if (payload.FromTime > moment(new Date()).format("hh:mm:ss ")) {
        error = { ...error, FromTime: t("Time is Invalid") };
      }
    }

    if (payload.ToDate === moment(new Date()).format("DD/MMM/YYYY")) {
      if (payload.ToTime < payload.FromTime) {
        error = { ...error, ToTime: t("Time Must be Less than From Time") };
      }
    }
    return error;
  };

  useEffect(() => {
    getDepartment();
    BindApprovalDoctor();
    getDropDownData();
  }, []);

  return (
    <div className="box box-success">
      <div className="box-header with-border">
        <h1 className="box-title">{t("Approve Dispatch")}</h1>
      </div>
      <div className="box-body">
        <div className="row">
          <div className="col-sm-2">
            <label className="control-label">{t("Search By")}:</label>
            <div className="d-flex">
              <div style={{ width: "100%" }}>
                <SelectBox
                  options={SearchBy}
                  payload={payload?.SearchType}
                  name="SearchType"
                  onChange={handleSelectChange}
                />
              </div>
              <div style={{ width: "100%" }}>
                <Input
                  className="select-input-box form-control input-sm ui-autoComplete-input"
                  type="text"
                  name="SearchValue"
                  value={payload?.SearchValue}
                  onChange={handleChange}
                  autoComplete="off"
                />
                {errors?.SearchValue && (
                  <div className="golbal-Error">{errors?.SearchValue}</div>
                )}
              </div>
            </div>
          </div>

          <div className="col-sm-2 ">
            <label className="control-label">{t("Department")}:</label>
            <SelectBox
              options={DepartmentData}
              payload={payload.DepartmentID}
              selectedValue={payload.DepartmentID}
              name="DepartmentID"
              onChange={handleSelectChange}
            />
          </div>

          <div className="col-sm-2 ">
            <label className="control-label">{t("TestName")}:</label>
            <Input
              className="form-control ui-autocomplete-input input-sm"
              type="text"
              name="TestName"
              placeholder={t("Test")}
              value={payload.TestName}
              autoComplete={"off"}
              onChange={handleChange}
              onKeyDown={(e) => handleIndexNew(e, "TestName")}
              onBlur={(e) => {
                autocompleteOnBlur(setTestSuggestion);
              }}
            />
            {TestSuggestion.length > 0 && (
              <AutoComplete
                test={TestSuggestion}
                handleListSearch={handleListSearchNew}
                indexMatch={indexMatch}
              />
            )}
          </div>
          {payload?.SearchType !== "" && (
            <>
              <div className="col-sm-2">
                <label className="control-label">{t("From Date")}:</label>
                <div>
                  <DatePicker
                    name="FromDate"
                    date={payload?.FromDate}
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
                <label className="control-label">{t("To Date")}:</label>
                <div>
                  <DatePicker
                    name="ToDate"
                    date={payload?.ToDate}
                    onChange={dateSelect}
                    onChangeTime={handleTime}
                    secondName="ToTime"
                    maxDate={new Date()}
                    minDate={new Date(payload.FromDate)}
                  />

                  {errors?.ToDate && (
                    <span className="golbal-Error">{errors?.ToDate}</span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="row">
          {payload?.SearchType !== "" ? (
            <>
              <div className="col-sm-1">
                <div className="ApproveBarcodeChild">
                  <button
                    type="button"
                    className="btn btn-block criticalHigh btn-sm"
                    id="btnSearch"
                    title="Search"
                    onClick={() => handleSearch("CH")}
                  >
                    {t("Critical High")}
                  </button>
                </div>
              </div>

              <div className="col-sm-1">
                <div className="ApproveBarcodeChild">
                  <button
                    type="button"
                    className="btn btn-block criticalLow btn-sm"
                    id="btnSearch"
                    title="Search"
                    onClick={() => handleSearch("CL")}
                  >
                    {t("Critical Low")}
                  </button>
                </div>
              </div>
              <div className="col-sm-1">
                <div className="ApproveBarcodeChild">
                  <button
                    type="button"
                    className="btn btn-block btn-danger btn-sm"
                    id="btnSearch"
                    title="Search"
                    onClick={() => handleSearch("H")}
                  >
                    {t("High")}
                  </button>
                </div>
              </div>
              <div className="col-sm-1">
                <div className="ApproveBarcodeChild">
                  <button
                    type="button"
                    className="btn btn-block low btn-sm"
                    id="btnSearch"
                    title="Search"
                    onClick={() => handleSearch("L")}
                  >
                    {t("Low")}
                  </button>
                </div>
              </div>
              <div className="col-sm-1">
                <div className="ApproveBarcodeChild">
                  <button
                    type="button"
                    className="btn btn-block normalBtn btn-sm"
                    id="btnSearch"
                    title="Search"
                    onClick={() => handleSearch("N")}
                  >
                    {t("Normal")}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="col-sm-1">
                <div className="ApproveBarcodeChild">
                  <button
                    type="button"
                    className="btn btn-block criticalHigh btn-sm"
                    id="btnSearch"
                    title="Search"
                    onClick={() => handleSearch("CH")}
                  >
                    {t("Critical High")}
                  </button>
                </div>
              </div>

              <div className="col-sm-1">
                <div className="ApproveBarcodeChild">
                  <button
                    type="button"
                    className="btn btn-block criticalLow btn-sm"
                    id="btnSearch"
                    title="Search"
                    onClick={() => handleSearch("CL")}
                  >
                    {t("Critical Low")}
                  </button>
                </div>
              </div>
              <div className="col-sm-1">
                <div className="ApproveBarcodeChild">
                  <button
                    type="button"
                    className="btn btn-block btn-danger btn-sm"
                    id="btnSearch"
                    title="Search"
                    onClick={() => handleSearch("H")}
                  >
                    {t("High")}
                  </button>
                </div>
              </div>
              <div className="col-sm-1">
                <div className="ApproveBarcodeChild">
                  <button
                    type="button"
                    className="btn btn-block low btn-sm"
                    id="btnSearch"
                    title="Search"
                    onClick={() => handleSearch("L")}
                  >
                    {t("Low")}
                  </button>
                </div>
              </div>
              <div className="col-sm-1">
                <div className="ApproveBarcodeChild">
                  <button
                    type="button"
                    className="btn btn-block normalBtn btn-sm"
                    id="btnSearch"
                    title="Search"
                    onClick={() => handleSearch("N")}
                  >
                    {t("Normal")}
                  </button>
                </div>
              </div>
            </>
          )}

          <div className="row">
            <div className="col-sm-1">
              <div className="ApproveBarcodeChild">
                <button
                  className="btn btn-info btn-sm btn-block"
                  onClick={() => handleSearch("A")}
                >
                  {t("Search")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <>
          {tabledata.length > 0 && (
            <div className="box">
              <div
                className={`box-body divResult table-responsive ${
                  tabledata.length > 8 && "boottable"
                }`}
                id="no-more-tables"
              >
                <div className="row">
                  <table
                    className="table table-bordered table-hover table-striped tbRecord"
                    cellPadding="{0}"
                    cellSpacing="{0}"
                  >
                    <thead>
                      <tr>
                        <th>{t("S.No")}</th>
                        <th>
                          <div>
                            <Input
                              type="checkbox"
                              checked={
                                tabledata.length > 0
                                  ? isChecked(
                                      "isSelect",
                                      tabledata,
                                      true
                                    ).includes(false)
                                    ? false
                                    : true
                                  : false
                              }
                              onChange={handleChangeNew}
                            />
                          </div>
                        </th>
                        <th>{t("Patient Info")}.</th>
                        <th>{t("Lab No")}.</th>
                        <th>{t("Barcode No")}.</th>
                        <th>{t("Test Name")}</th>
                        <th>{t("Lab Observation")}</th>
                        <th>{t("Value")}</th>
                        <th>{t("MinValue")}</th>
                        <th>{t("MaxValue")}</th>
                        <th>{t("Unit")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tabledata.map((item, index) => (
                        <tr key={index}>
                          <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                          <td data-title={t("Status")}>
                            {
                              <Input
                                type="checkbox"
                                checked={item?.isSelect}
                                name="isSelect"
                                value={payload?.isChecked ? 1 : 0}
                                onChange={(e) => handleChangeNew(e, index)}
                                disabled={item?.IsDispatch === 1 ? true : false}
                              />
                            }
                          </td>
                          <td data-title={t("Patient Info")}>
                            {item?.PName}&nbsp;
                          </td>
                          <td data-title={t("Lab No.")}>
                            {item?.LedgerTransactionNo}&nbsp;
                          </td>
                          <td data-title={t("Barcode No.")}>
                            {item?.BarcodeNo}&nbsp;
                          </td>
                          <td data-title={t("Test Name")}>
                            {item?.InvestigationName}&nbsp;
                          </td>
                          <td data-title={t("Lab Observation")}>
                            {item?.LabObservationName}&nbsp;
                          </td>
                          <td data-title={t("Value")}>{item?.Value}&nbsp;</td>
                          <td data-title={t("MinValue")}>
                            {item?.MinValue}&nbsp;
                          </td>
                          <td data-title={t("MaxValue")}>
                            {item?.MaxValue}&nbsp;
                          </td>
                          <td data-title={t("Unit")}>
                            {item?.readingFormat}&nbsp;{" "}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="row">
                  {/* <label className="col-sm-1">Doctor:</label> */}
                  <div className="col-sm-2">
                    <div style={{ width: "100%" }}>
                      <SelectBox
                        onChange={handleSelectChange}
                        name="DoctorID"
                        value={payload?.DoctorID}
                        options={[
                          { label: "Select Doctor", value: "" },
                          ...DoctorData,
                        ]}
                      />
                    </div>
                  </div>
                  <div className="col-sm-2">
                    <button
                      className="btn btn-success btn-sm btn-block"
                      onClick={handleSave}
                    >
                      {t("Approve & Dispatch")}
                    </button>
                  </div>
                  <div className="col-sm-3">
                    <Link
                      to={`/ResultEntry`}
                      style={{
                        fontSize: "13px",
                        textDecoration: "underline",
                        marginTop: "19px",
                      }}
                    >
                      {t("Result Entry")}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ApproveDispatch;