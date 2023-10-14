import React, { useEffect, useState } from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";
import Input from "../../ChildComponents/Input";
import { SampleStatus, SearchBy } from "../../ChildComponents/Constants";
import BootTable from "../../Table/RECultureTable";
import { DepartmentWiseItemList, getDepartment } from "../util/Commonservices";
import DatePicker from "./../Components/DatePicker";
import { toast } from "react-toastify";
import axios from "axios";
import moment from "moment";
import Loading from "../util/Loading";
import { useTranslation } from "react-i18next";
import TemplateMasterModal from "../util/TemplateMasterModal";

function ResultEntryCulture() {
  const [department, setDepartment] = useState([]);
  const [TestSuggestion, setTestSuggestion] = useState([]);
  const [doctorAdmin, setDoctorAdmin] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [reData, SetReData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [ResultTestData, setResultTestData] = useState([]);
  const [ResultData, setResultData] = useState([]);
  const [BindData, setBindData] = useState([]);
  const [BindSouce, setBindSouce] = useState(false);
  const [buttonsData, setButtonsData] = useState([]);
  const [show, setShow] = useState({
    modal: false,
    data: {},
  });

  const [payload, setPayload] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    ItemValue: "",
    SelectTypes: "",
    DepartmentID: "",
    TestName: "",
    CentreID: "",
    SampleStatus: "",
  });
  const { t } = useTranslation();

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
        CentreDataValue.unshift({ label: "All", value: "" });
        setCentreData(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };

  const getBindData = (innerData) => {
    axios
      .get("/api/v1/RECulture/BindSource")
      .then((res) => {
        let data = res.data.message;
        let CentreDataValue = data.map((ele) => {
          return {
            value: `${ele.TYPE}#${ele.Source}#${innerData?.TestID}#${innerData?.SINNo}`,
            label: ele.Source,
          };
        });
        CentreDataValue.unshift({ label: "Select", value: "" });
        setBindSouce(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange1 = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
    value != -1 && TableData(value);
  };

  // const handleOnChangeSelect = (event) => {
  //   const { value } = event?.target;
  //   if (payload?.DepartmentID === "") {
  //     toast.error("Please Choose Department To Search Test");
  //   } else {
  //     setPayload({ ...payload, TestName: value });
  //   }
  // };

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
            : "Something Went Wrong"
        );
      });
  };

  useEffect(() => {
    console.log(payload.DepartmentID);
    DepartmentWiseItemList(
      payload.DepartmentID === ""
        ? department[0]?.value
        : payload?.DepartmentID,
      "",
      setTestSuggestion,
      true
    );
  }, [department, payload?.DepartmentID]);

  const dateSelect = (date, name) => {
    setPayload({
      ...payload,
      [name]: date,
    });
  };

  console.log(payload);

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

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  const GetResultEntryCulture = (LedgerTransactionID, loading) => {
    if (loading) {
      loading(true);
    }
    axios
      .post("/api/v1/RECulture/GetResultEntryDataCulture", {
        LedgerTransactionID: LedgerTransactionID,
      })
      .then((res) => {
        const data = res?.data?.message;
        const dataTestHeader = res?.data?.TestHeader;
        setResultData(data);
        setResultTestData(dataTestHeader);
        if (loading) {
          loading(false);
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        if (loading) {
          loading(false);
        }
      });
  };

  const TableData = () => {
    setLoading(true);
    axios
      .post("/api/v1/RECulture/GetResultEntryCulture", {
        SelectTypes: payload.SelectTypes,
        ItemValue: payload.ItemValue,
        FromDate: moment(payload.FromDate).format("DD/MMM/YYYY"),
        ToDate: moment(payload.ToDate).format("DD/MMM/YYYY"),
        DepartmentID:
          payload?.DepartmentID === ""
            ? department[0]?.value
            : payload.DepartmentID,
        SampleStatus: payload?.SampleStatus,
        testName: payload?.TestName,
        CentreID: payload?.CentreID,
        FromTime: "00:00:00",
        ToTime: "23:59:59",
      })
      .then((res) => {
        SetReData(res?.data?.message);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const findDuplicateData = (id) => {
    const val = BindData.find((ele) => ele?.TableHeader === id);
    return val === undefined ? true : false;
  };

  const handleDataSplit = (data, splitValue) => {
    return data.split(splitValue)
  }

  const handleOrganism = (e) => {
    const { value } = e.target;
    const values = handleDataSplit(value, "#")
    axios
      .post("/api/v1/RECulture/BindObsAntibioticData", {
        TestId: values[2],
        OrganismId: values[0],
        OrganismName: values[1],
        BarcodeNo: values[3],
        ReportNumber: ""
      })
      .then((res) => {
        const data = res?.data?.message;
        console.log(data)
        // const findData = CentreData.find((ele) => ele.value == value);
        // if (data.length > 0) {
        //   if (findDuplicateData(findData?.label)) {
        //     setBindData([
        //       ...BindData,
        //       {
        //         TableHeader: findData?.label,
        //         Data: data,
        //       },
        //     ]);
        //   } else {
        //     toast.error("Duplicate Test");
        //   }
        // } else {
        //   toast.error("No Data Found");
        // }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
      });
  };
  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;
    setPayload({ ...payload, [secondName]: TimeStamp });
  };
  const handleRemove = (i) => {
    const data = BindData?.filter((ele, index) => index !== i);
    setBindData(data);
  };

  useEffect(() => {
    getDepartment(setDepartment);
    getAccessCentres();
    getButtondata();
    BindApprovalDoctor();
  }, []);
  return (
    <div className="box box-success">
      {ResultData.length === 0 ? (
        <div className="row">
          <div className="box-header with-border">
            <span className="box-title">{t("Result Entry Culture")}</span>
          </div>

          <div className="box-body">
            <div className="row">
              <label className="col-sm-1" htmlFor="Title">
                {t("Search By")}:
              </label>
              <div className="col-sm-2">
                <div className="d-flex">
                  <div style={{ width: "60%" }}>
                    <SelectBox
                      options={SearchBy}
                      name="SelectTypes"
                      selectedValue={payload?.SelectTypes}
                      onChange={handleSelectChange}
                    />
                  </div>
                  <div>
                    <div style={{ width: "100%" }}>
                      <Input
                        className="form-control input-sm"
                        type="text"
                        name="ItemValue"
                        value={payload?.ItemValue}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <label className="col-sm-1">{t("Center")}:</label>
              <div className="col-sm-2 ">
                <div>
                  <SelectBox
                    options={CentreData}
                    selectedValue={payload?.CentreID}
                    name="CentreID"
                    onChange={handleSelectChange}
                  />
                </div>
              </div>
              <label className="col-sm-1">{t("Department")}:</label>
              <div className="col-sm-2 ">
                <div>
                  <SelectBox
                    options={department}
                    selectedValue={payload?.DepartmentID}
                    name="DepartmentID"
                    onChange={handleSelectChange}
                  />
                </div>
              </div>

              <label className="col-sm-1">{t("From Date")}:</label>
              <div className="col-sm-2 ">
                <div>
                  <DatePicker
                    name="FromDate"
                    date={payload?.FromDate}
                    onChange={dateSelect}
                    onChangeTime={handleTime}
                    secondName="FromTime"
                    maxDate={new Date()}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <label className="col-sm-1">{t("To Date")}:</label>
              <div className="col-sm-2 ">
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
                </div>
              </div>

              <label className="col-sm-1">{t("Test")}:</label>
              <div className="col-sm-2">
                <div>
                  <SelectBox
                    options={[
                      { label: "select Test", value: "" },
                      ...TestSuggestion,
                    ]}
                    selectedValue={payload?.TestName}
                    name="TestName"
                    onChange={handleSelectChange}
                  />
                </div>
              </div>

              <div className="col-sm-2">
                <SelectBox
                  options={[{ label: "Search By", value: "" }, ...SampleStatus]}
                  onChange={handleSelectChange1}
                  id="SampleStatus"
                  name="SampleStatus"
                  selectedValue={payload?.SampleStatus}
                />
              </div>
              <div className="col-sm-1">
                <a
                  href="javascript:void(0)"
                  onClick={() => TableData()}
                  className="btn btn-primary btn-sm w-100"
                >
                  <div className="">{t("Search")}</div>
                </a>
              </div>
            </div>

          
          </div>

          <div className="box">
            <div className={`box-body `}>
              {loading ? (
                <Loading />
              ) : (
                <BootTable
                  redata={reData}
                  GetResultEntryCulture={GetResultEntryCulture}
                />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="box-body">
          {show?.modal && (
            <TemplateMasterModal
              show={show}
              handleClose={() => {
                setShow({ modal: false, data: {} });
              }}
            // handleSave={handleSave}
            />
          )}
          <div className="row">
            <div className="col-md-6 col-12">
              <div className="box-body">
                <div className="box-header with-border">
                  <h6 className="box-title">
                    {t("Search Results")}
                    <span
                      className={`font-weight-bold mx-2  px-3 py-2  Status-${ResultTestData[0]?.Status}`}
                      style={{
                        borderRadius: "10px",
                      }}
                    >
                      {ResultTestData[0].PackageName}
                    </span>
                  </h6>
                </div>

                {/* <div className="d-flex mx-4 my-2">
                  {ResultTestData?.map((data, index) => (
                    <div
                      key={index}
                      className={`font-weight-bold mx-2  px-3 py-2  Status-${data.Status}`}
                      style={{
                        borderRadius: "10px",
                      }}
                    >
                      {data?.PackageName}
                    </div>
                  ))}
                </div> */}

                <div
                  className={`box-body ${reData.length > 8 ? "boottable" : ""}`}
                >
                  <table
                    className="table table-bordered table-hover table-striped tbRecord"
                    cellPadding="{0}"
                    cellSpacing="{0}"
                  // className="ResultReculture"
                  >
                    <thead className="cf">
                      <tr>
                        {[
                          "Test",
                          "Value",
                          "Unit",
                          "Comment",
                          "Display Reading",
                        ].map((ele, index) => (
                          <th key={index}>{ele}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td
                          colSpan={5}
                          className="text-danger font-weight-bold"
                        >
                          {ResultData[0]?.Department}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={5} className="text-primary">
                          {ResultData[0]?.PackageName}
                        </td>
                      </tr>
                      {ResultData.map((ele, index) => (
                        <tr key={index}>
                          <td>{ele?.TestName}</td>
                          <td>
                            {["Organisms"].includes(ele?.TestName) ? (
                              <img
                                src={
                                  "https://lims.maxlab.co.in/MaxLab/App_Images/edit.png"
                                }
                                className="img-fluid"
                                onClick={() => getBindData(ele)}
                              />
                            ) : (
                              ele?.Value
                            )}
                          </td>
                          <td>{ele?.ReadingFormat}</td>
                          <td>
                            {ele?.IsComment == 1 ? (
                              <span
                                style={{
                                  fontSize: "15px",
                                  cursor: "pointer",
                                }}
                                onClick={() =>
                                  setShow({
                                    modal: true,
                                    data: ele,
                                  })
                                }
                              >
                                +
                              </span>
                            ) : (
                              ""
                            )}
                          </td>
                          <td>{ele?.DisplayReading}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className="col-md-6 col-12">
              {BindSouce?.length > 0 && (
                <div className="box-body">
                  <div className="box-header with-border">
                    <h6 className="box-title">{t("Antibiotic Entry")}</h6>
                  </div>

                  <div
                    className={`box-body ${BindData?.length > 0 ? "boottable" : ""
                      }`}
                  >
                    <table
                      className="table table-bordered table-hover table-striped tbRecord"
                      cellPadding="{0}"
                      cellSpacing="{0}"
                    >
                      <thead className="cf">
                        <tr>
                          {["#", "Antibiotic", "Interpretation", "MIC"].map(
                            (ele, index) => (
                              <th key={index}>{ele}</th>
                            )
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {BindData?.map((ele, index) => (
                          <>
                            <tr key={index}>
                              <td colSpan={4}>
                                <div className="d-flex align-items-center">
                                  <h5>{ele?.TableHeader}</h5>
                                  <button
                                    className="mx-2 btn btn-danger btn-sm"
                                    onClick={() => handleRemove(index)}
                                  >
                                    {t("Remove")}
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {ele?.Data?.map((item, newindex) => (
                              <tr key={newindex}>
                                <td>{newindex + 1}</td>
                                <td>{item?.RateTypeName}</td>
                                <td>
                                  <Input />
                                  {/* <img src={HelpIcon} className="img-fluid mx-2" /> */}
                                </td>
                                <td>
                                  <Input />
                                </td>
                              </tr>
                            ))}
                          </>
                        ))}
                        <tr>
                          <td colSpan={4}>
                            <div className="d-flex">
                              <h5>{t("Select Organism")}: </h5>
                              <select
                                className="form-control input-sm mx-2"
                                onChange={handleOrganism}
                              >
                                {BindSouce.map((ele, index) => (
                                  <option key={index} value={ele?.value}>
                                    {ele?.label}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="box-body">
            <div className="box-header with-border">
              <span className="m-0 font-weight-bold ">
                <div className="d-flex mb-2">
                  <div className="mx-2">
                    <span className="text-black">{t("SIN NO")}:</span>
                    <span className="mx-2" style={{ color: "#9a9797 " }}>
                      {ResultData[0]?.SINNo}
                    </span>
                  </div>

                  <div className="mx-2">
                    <span className="text-black">{t("Patient Name")}:</span>
                    <span className="mx-2" style={{ color: "#9a9797 " }}>
                      {ResultData[0]?.PName}
                    </span>
                  </div>

                  <div className="mx-2">
                    <span className="text-black">{t("Patient Code")}: </span>
                    <span className="mx-2" style={{ color: "#9a9797 " }}>
                      {ResultData[0]?.PatientCode}
                    </span>
                  </div>

                  <div className="mx-2">
                    <span className="text-black">{t("Age/Gender")}: </span>
                    <span className="mx-2" style={{ color: "#9a9797 " }}>
                      {ResultData[0]?.Age}
                    </span>
                  </div>
                </div>
              </span>
            </div>

            <div className="box-body">
              <label className="col-sm-1">{t("Doctor")}:</label>
              <div className="col-sm-2">

                <select
                  className="form-control input-sm"
                  id="ApprovalDoctor"
                  name="ApprovalDoctor"
                >
                  <option hidden>--Select--</option>
                  {doctorAdmin.map((ele, index) => (
                    <option key={index} value={ele?.value}>
                      {ele?.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-sm-2" style={{ display: "flex" }}>
                <button
                  className="btn btn-success  btn-sm"
                  style={{ marginLeft: "5px" }}
                  type="button"
                  id="btnMainList"
                  onClick={() => {
                    setResultData([]);
                    setBindSouce([]);
                  }}
                >
                  {t("Main List")}
                </button>
                {/* <div className="col-sm-1"> */}
                {buttonsData?.map(
                  (ele, index) =>
                    ele?.AccessBy !== "Not Approved" &&
                    ele?.AccessBy !== "Unhold" && (
                      <button
                        className="btn btn-success  btn-sm"
                        style={{ marginLeft: "5px" }}
                        type="button"
                        id="btnMainList"
                        key={index}
                      // onClick={() => handleResultSubmit(ele?.AccessBy)}
                      >
                        {ele?.AccessBy === "Approved"
                          ? "Approve"
                          : ele?.AccessBy}
                      </button>
                    )
                )}
                {/* </div> */}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ResultEntryCulture;
