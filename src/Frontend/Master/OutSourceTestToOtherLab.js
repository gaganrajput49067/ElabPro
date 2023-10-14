import React, { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { SelectBox } from "../../ChildComponents/SelectBox";
import Input from "../../ChildComponents/Input";
import { toast } from "react-toastify";
import moment from "moment";
import DatePicker from "../../Frontend/Components/DatePicker";
import { useTranslation } from "react-i18next";
import Loading from "../util/Loading";
import { isChecked, selectedValueCheck } from "../util/Commonservices";

const OutSourceTestToOtherLab = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [CentreData, setCentreData] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [OutSourceLabData, setOutSourceLabData] = useState([]);
  const [RejectLoading, setRejectLoading] = useState(-1);
  const [tableData, setTableData] = useState([]);
  const [payload, setPayload] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    FromTime: "00:00:00",
    ToTime: "23:59:59",
    DepartmentID: "",
    CentreID: "",
    OutSourceLabID: "",
    BarcodeNo: "",
    status: "",
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

  const handleSelectChange = (event) => {
    const { name, value, selectedIndex } = event?.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handlechangeOutsource = (e, index) => {
    const { value, selectedIndex } = e?.target;
    const label = e?.target?.children[selectedIndex].text;
    const data = [...tableData];
    data[index]["OutSourceLabID"] = value;
    data[index]["OutSourceLabName"] = label;
    setTableData(data);
  };
  console.log(tableData);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const getOutSourceLabData = () => {
    axios
      .get("/api/v1//OutSourceLabMaster/getOutSourceLabData")
      .then((res) => {
        let data = res.data.message;
        let OutSourceLabData = data.map((ele) => {
          return {
            value: ele.OutSourceLabID,
            label: ele.LabName,
          };
        });
        OutSourceLabData.unshift({ label: "Select", value: "" });
        setOutSourceLabData(OutSourceLabData);
      })
      .catch((err) => console.log(err));
  };

  const getDepartment = () => {
    axios
      .get("/api/v1/Department/getDepartment")
      .then((res) => {
        let data = res.data.message;
        let Department = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        Department.unshift({ label: "Select", value: "" });
        setDepartment(Department);
      })
      .catch((err) => console.log(err));
  };

  const handleCheckbox = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const val = [...tableData];
      val[index][name] = checked ? "1" : "0";
      setTableData(val);
    } else {
      const data = tableData.map((ele) => {
        return {
          ...ele,
          [name]: checked ? "1" : "0",
        };
      });
      setTableData(data);
    }
  };

  const handleDropdown = (outSourceName) => {
    const data = outSourceName.split("#");
    const val = data.map((ele) => {
      const newVal = ele.split("|");
      return {
        label: newVal[0],
        value: newVal[1],
      };
    });
    return val;
  };

  const handleSearch = () => {
    setLoading(true);
    axios
      .post("/api/v1/OutSourceTestToOtherLab/binddata", {
        ...payload,
        FromDate: moment(payload?.FromDate).format("DD/MMM/YYYY"),
        ToDate: moment(payload?.ToDate).format("DD/MMM/YYYY"),
      })
      .then((res) => {
        let data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            ...ele,
            OutSourceLabID: handleDropdown(ele?.OutsourceName)[0]?.value,
            OutSourceLabName: handleDropdown(ele?.OutsourceName)[0]?.label,
          };
        });
        setTableData(val);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
        setTableData([]);
        setLoading(false);
      });
  };

  const handleSave = () => {
    setLoading(true);
    const data = tableData.filter((ele) => ele?.isChecked === "1");
    const newPayload = data.map((ele) => {
      return {
        ...ele,
        OutSourceLabRate: ele?.LabOutSrcRate,
      };
    });
    axios
      .post("/api/v1/OutSourceTestToOtherLab/savedata", {
        OutSourceData: newPayload,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
        setLoading(false);
      });
  };

  const rejectData = (data,index) => {
    setRejectLoading(index)
    axios
      .post("api/v1/OutSourceTestToOtherLab/Rejectdata", {
        OutSourceData: [data],
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setRejectLoading(-1)
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something went Wrong"
        );
        setRejectLoading(-1)
      });
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
        CentreDataValue.unshift({ label: "Select", value: "" });
        setCentreData(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };

  const showBtn = () => {
    const val = tableData.filter((ele) => ele?.isChecked == "1");
    return val.length > 0 ? true : false;
  };

  useEffect(() => {
    getAccessCentres();
    getDepartment();
    getOutSourceLabData();
  }, []);
  return (
    <>
      <div className="box box-success ">
        <div className="box-header with-border">
          <h3 className="box-title">{t("OutSource Test To Other Lab")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
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

                {errors?.FromDate && (
                  <span className="golbal-Error">{errors?.FromDate}</span>
                )}
              </div>
            </div>
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

                {errors?.ToDate && (
                  <span className="golbal-Error">{errors?.ToDate}</span>
                )}
              </div>
            </div>
            <label className="col-sm-1">{t("Centre")}</label>
            <div className="col-sm-2">
              <SelectBox
                options={CentreData}
                name="CentreID"
                selectedValue={payload?.CentreID}
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-1">{t("Department")}:</label>
            <div className="col-sm-2">
              <SelectBox
                name="DepartmentID"
                options={Department}
                selectedValue={payload?.DepartmentID}
                onChange={handleSelectChange}
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1">{t("OutSourceLabID")}:</label>
            <div className="col-sm-2">
              <SelectBox
                name="OutSourceLabID"
                options={OutSourceLabData}
                selectedValue={payload?.OutSourceLabID}
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-1">{t("BarcodeNo")}:</label>
            <div className="col-sm-2">
              <Input
                className="select-input-box form-control input-sm"
                name="BarcodeNo"
                placeholder={t("BarcodeNo")}
                type="text"
                max={15}
                value={payload?.BarcodeNo}
                onChange={handleChange}
              />
            </div>

            <label className="col-sm-1">Status:</label>
            <div className="col-sm-2">
              <SelectBox
                name="status"
                options={[
                  {
                    label: "All",
                    value: "",
                  },
                  {
                    label: "Pending",
                    value: "0",
                  },
                  {
                    label: "Outsource",
                    value: "1",
                  },
                ]}
                selectedValue={payload?.status}
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-sm-1">
              <button
                className="btn btn-block btn-info btn-sm"
                onClick={handleSearch}
              >
                {t("Search")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {tableData?.length > 0 && (
        <div className="box form-horizontal">
          <div className="box-header with-header">
            <h6 className="box-title">
              {t("OutSource Test List")}
              <span style={{ color: "red", marginLeft: "15px" }}>
                {t("Total Test")} : {tableData?.length}
              </span>
            </h6>
          </div>
          <div
            className="box-body divResult boottable table-responsive"
            id="no-more-tables"
          >
            <table
              className="table table-bordered table-hover table-striped tbRecord"
              cellPadding="{0}"
              cellSpacing="{0}"
            >
              <thead className="cf">
                <tr>
                  {[
                    t("S.No"),

                    t("From Centre"),
                    t("Visit No."),
                    t("Sin No."),
                    t("Patient Name"),
                    t("Department"),
                    t("Test Name"),
                    t("OutSource Lab"),
                    t("TAT"),
                    t("File Required"),
                    t("Status"),
                    t("Add Report"),
                    t("Select"),
                  ].map((ele, index) => (
                    <th key={index}>{ele}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData?.map((ele, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor:
                        ele?.STATUS === "OutSourced" && "#9795c6",
                    }}
                  >
                    <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                    {/* <td data-title="RegDate">{ele?.FromDate}&nbsp;</td> */}
                    <td data-title={t("From Centre")}>{ele?.centre}&nbsp;</td>
                    <td data-title={t("Visit No.")}>
                      {ele?.LedgerTransactionNo}&nbsp;
                    </td>
                    <td data-title={t("Sin No.")}>{ele?.BarcodeNo}&nbsp;</td>
                    <td data-title={t("Patient Name")}>
                      {ele?.PName}
                      &nbsp;
                    </td>
                    <td data-title={t("Department")}>
                      {ele?.DepartmentName}&nbsp;
                    </td>
                    <td data-title={t("Test Name")}>{ele?.itemname}&nbsp;</td>
                    <td data-title={t("OutSource Lab")}>
                      {/* {ele?.OutsourceName}&nbsp; */}
                      <div>
                        <SelectBox
                          name="OutSourceLabID"
                          options={handleDropdown(ele?.OutsourceName)}
                          selectedValue={ele?.OutSourceLabID}
                          onChange={(e) => handlechangeOutsource(e, index)}
                        />
                      </div>
                    </td>
                    <td data-title={t("TAT")}>{ele?.TAT}</td>
                    <td data-title={t("File Required")}>
                      {ele?.IsFileRequired}&nbsp;
                    </td>
                    <td data-title={t("Status")}>{ele?.STATUS}&nbsp;</td>
                    <td data-title={t("Add Report")}>{}&nbsp;</td>
                    <td data-title={t("Select")}>
                      {ele?.STATUS !== "OutSourced" ? (
                        <input
                          type="checkbox"
                          name="isChecked"
                          checked={ele?.isChecked === "1" ? true : false}
                          onChange={(e) => handleCheckbox(e, index)}
                        ></input>
                      ) : RejectLoading === index ? (
                        <Loading />
                      ) : (
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={(e) => rejectData(ele,index)}
                        >
                          Reject
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {loading ? (
            <Loading />
          ) : (
            showBtn() && (
              <>
                <div className="box-footer">
                  <div className="row">
                    <div className="col-sm-1">
                      <button
                        className="btn btn-block btn-success btn-sm"
                        // style={{marginLeft:"10px"}}
                        onClick={handleSave}
                      >
                        {t("Save")}
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )
          )}
        </div>
      )}
    </>
  );
};

export default OutSourceTestToOtherLab;
