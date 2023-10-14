import React, { useEffect, useState } from "react";
import DatePicker from "../Components/DatePicker";
import { SelectBoxWithCheckbox } from "../../ChildComponents/SelectBox";
import {
  getAccessCentres,
  getAccessRateType,
  getBillingCategory,
  getDepartment,
  isChecked,
} from "../util/Commonservices";
import axios from "axios";
import Input from "../../ChildComponents/Input";
import { number } from "../util/Commonservices/number";
import Loading from "../util/Loading";
import { toast } from "react-toastify";
import moment from "moment";

const DoctorMisReportPage = () => {
  const [tabledata, setTableData] = useState([]);
  const [tabledata1, setTableData1] = useState([]);
  const [tabledata2, setTableData2] = useState([]);
  const [Category, setCategory] = useState([]);
  const [DoctorData, setDoctorData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(-1);
  const [loading2, setLoading2] = useState(-1);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [RateType, setRateType] = useState([]);
  const [Speclization, setSpeclization] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [payload, setPayload] = useState({
    CentreID: "",
    PanelID: "",
    DtFrom: new Date(),
    DtTo: new Date(),
    ProID: "",
    DoctorID: "",
    CategoryID: "",
    HeadDepartmentID: "",
    DepartmentID: "",
    Parm1: "",
    Val1: "",
    Parm2: "",
    Val2: "",
    ShareAmount1: "",
    ShareAmount2: "",
    Speclization: "",
    IsReff: "BOTH",
    DoctorMobile: "",
    LabNo: "",
  });

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

  const handleChanges = (select, name) => {
    let val = select.map((ele) => ele?.value);

    console.log(val);
    setPayload({ ...payload, [name]: val });
  };

  // const handleSelectChange = (e) => {
  //   const { name, value } = e.target;
  //   setPayload({ ...payload, [name]: value });
  // };

  const handleSelectChange = (select, name) => {
    let val = "";
    for (let i = 0; i < select.length; i++) {
      val = val === "" ? `${select[i].value}` : `${val},${select[i].value}`;
    }
    setPayload({ ...payload, [name]: val });
  };

  const handleShow = (e) => {
    const { name, checked } = e.target;
    setPayload({ ...payload, [name]: checked });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const hideSelectBox = () => {
    const val = tabledata?.filter((item) => item?.isSelect === true);
    return val.length === tabledata.length ? false : true;
  };

  const handlePatientCount = () => {
    let count = 0;
    for (let i = 0; i < tabledata?.length; i++) {
      count = count + tabledata[i]["Total"];
    }

    return count;
  };

  const handlePatientShareAmount = () => {
    let count = 0;
    for (let i = 0; i < tabledata?.length; i++) {
      count = count + tabledata[i]["SharedAmount"];
    }

    return count.toFixed(2);
  };

  const handleChangeNew = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const updateData = [...tabledata];
      updateData[index][name] = checked;
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

  const handleRef = (e, id, name) => {
    const { checked } = e.target;
    setLoading(true);
    axios
      .post(`/api/v1//DoctorMis/${name}`, {
        IsCheck: checked ? "1" : "0",
        DoctorID: id,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        handleSave();
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        toast.error(err?.data?.message ? err?.data?.message : "Error Occured");
      });
  };

  const DoctorSelectedHandle = (e, index) => {
    const { name, checked } = e.target;
    const data = [...tabledata];
    data[index][name] = checked;
    setTableData(data);
  };

  const table1data = (index) => {
    setLoading1(index);
    axios
      .post("/api/v1/DoctorMis/showPatientData", payload)
      .then((res) => {
        if (res?.data?.message.length > 0) {
          setTableData1(res?.data?.message);
        } else {
          toast.error("No Data Found");
          setTableData1([]);
        }

        setLoading1(-1);
      })
      .catch(() => {
        toast.error("error occured");
        setLoading1(-1);
      });
  };

  const handleSearchTest = (e, data) => {
    const { checked } = e.target;

    axios
      .post("/api/v1//DoctorMis/updateDocshare", {
        IsCheck: checked ? "1" : "0",
        LedgerTransactionNo: data?.LedgerTransactionNo,
        ItemId: data?.ItemId,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        table2data(data?.LedgerTransactionNo);
      })
      .catch((err) => {
        toast.error(err?.data?.message ? err?.data?.message : "Error occured");
      });
  };

  const getDropDownData = (name) => {
    axios
      .post("/api/v1/Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        console.log(data);
        let value = data.map((ele) => {
          return {
            value: ele.FieldID,
            label: ele.FieldDisplay,
          };
        });

        switch (name) {
          case "Specialization":
            setSpeclization(value);
            break;
          case "IsReff":
            // setIsRef(value);
            break;
          default:
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSave = () => {
    setLoading(true);
    axios
      .post("/api/v1/DoctorMis/SearchDoctorSummary", {
        ...payload,
        DtFrom: moment(payload?.DtFrom).format("DD-MMM-YYYY"),
        DtTo: moment(payload?.DtTo).format("DD-MMM-YYYY"),
      })
      .then((res) => {
        const data = res?.data?.message;
        if (data.length > 0) {
          const val = data.map((ele) => {
            return {
              ...ele,
              isSelect: false,
            };
          });
          setTableData(val);
        } else {
          toast.error("No Data Found");
          setTableData([]);
        }
        setTableData1([]);
        setTableData2([]);

        setLoading(false);
      })
      .catch(() => {
        toast.error("error occured");
        setLoading(false);
      });
  };

  const table2data = (id) => {
    setLoading2(id);
    axios
      .post("/api/v1/DoctorMis/showTestData", {
        LabNo: id,
      })
      .then((res) => {
        const data = res?.data?.message?.map((ele) => {
          return {
            ...ele,
          };
        });
        setTableData2(data);
        setLoading2(-1);
      })
      .catch(() => {
        toast.error("Error Occured");
        setLoading2(-1);
      });
  };

  const getDoctorSuggestion = () => {
    axios
      .post("/api/v1/DoctorReferal/getDoctorDataBind")
      .then((res) => {
        const data = res?.data?.message;

        const val = data?.map((ele) => {
          return {
            label: ele?.DoctorName,
            value: ele?.DoctorID,
          };
        });
        setDoctorData(val);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAccessCentres(setCentreData);
    getBillingCategory(setCategory);
    getDepartment(setDepartmentData);
    getAccessRateType(setRateType);
    getDoctorSuggestion();
    getDropDownData("Specialization");
    getDropDownData("Doctor");
    getDropDownData("IsRef");
  }, []);
  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h1 className="box-title">Doctor MIS Report</h1>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-sm-3">
              <div className="row">
                <div className="col-sm-4">
                  <label>
                    <small>From Date:</small>
                  </label>
                </div>
                <div className="col-sm-8">
                  <DatePicker
                    name="DtFrom"
                    date={payload?.DtFrom}
                    className="select-input-box form-control input-sm required"
                    onChange={dateSelect}
                    maxDate={new Date()}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="row">
                <div className="col-sm-4">
                  <label>
                    <small>To Date:</small>
                  </label>
                </div>
                <div className="col-sm-8">
                  <DatePicker
                    name="DtTo"
                    date={payload?.DtTo}
                    className="select-input-box form-control input-sm required"
                    onChange={dateSelect}
                    maxDate={new Date()}
                    minDate={new Date(payload.DtFrom)}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="row">
                <div className="col-sm-4">
                  <label>
                    <small>Centre:</small>
                  </label>
                </div>
                <div className="col-sm-8">
                  <SelectBoxWithCheckbox
                    options={CentreData}
                    value={payload?.CentreID}
                    name="CentreID"
                    onChange={handleSelectChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="row">
                <div className="col-sm-4">
                  <label>
                    <small>RateType:</small>
                  </label>
                </div>
                <div className="col-sm-8">
                  <SelectBoxWithCheckbox
                    options={RateType}
                    value={payload.PanelID}
                    name="PanelID"
                    onChange={handleSelectChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-3">
              <div className="row">
                <div className="col-sm-4">
                  <label><small>Category:</small></label>
                </div>
                <div className="col-sm-8">
                  <SelectBoxWithCheckbox
                    options={Category}
                    name={"CategoryID"}
                    value={payload?.CategoryID}
                    onChange={handleSelectChange}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="row">
                <div className="col-sm-4">
                  <label><small>Department:</small></label>
                </div>
                <div className="col-sm-8">
                  <SelectBoxWithCheckbox
                    onChange={handleSelectChange}
                    name={"DepartmentID"}
                    value={payload?.DepartmentID}
                    options={DepartmentData}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div className="row">
                <div className="col-sm-4">
                  <label><small>Doctor:</small></label>
                </div>
                <div className="col-sm-8">
                  <SelectBoxWithCheckbox
                    onChange={handleSelectChange}
                    name={"DoctorID"}
                    value={payload?.DoctorID}
                    options={DoctorData}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-1">
              <Input
                type="checkbox"
                name="isChecked"
                checked={payload?.isChecked}
                onChange={handleShow}
              />
              <label className="control_label" htmlFor="">
                Show More
              </label>
            </div>
            <div className="col-sm-2">
              <Input type="checkbox" className="control-label" />
              <label className="control_label" htmlFor="">
                Print Separate
              </label>
            </div>
          </div>
          {payload.isChecked ? (
            <div className="row">
              <div className="col-sm-3">
                <div className="row">
                  <div className="col-sm-4">
                    <label>PatientCount:</label>
                  </div>
                  <div className="col-sm-8">
                    <div className="flex_item">
                      <select
                        className="select_control"
                        name="Parm1"
                        value={payload?.Parm1}
                        onChange={handleChange}
                      >
                        <option selected value="Select">
                          {"Select"}
                        </option>
                        <option>{"="}</option>
                        <option>{">="}</option>
                        <option>{"<="}</option>
                        <option>{">"}</option>
                        <option>{"<"}</option>
                        <option>between</option>
                      </select>
                      <Input
                        className="select-input-box form-control input-sm"
                        style={{ width: "10px" }}
                        type="number"
                        name="Val1"
                        value={payload?.Val1}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="row">
                  <div className="col-sm-4">
                    <label>Ref Amount:</label>
                  </div>
                  <div className="col-sm-8">
                    <div className="flex_item">
                      <select
                        className="select_control"
                        name="ShareAmount1"
                        value={payload?.ShareAmount1}
                        onChange={handleChange}
                      >
                        <option selected value="Select">
                          {"Select"}
                        </option>
                        <option> {"="}</option>
                        <option>{">="}</option>
                        <option>{"<="}</option>
                        <option>{">"}</option>
                        <option>{"<"}</option>
                        <option>between</option>
                      </select>
                      <Input
                        className="select-input-box form-control input-sm"
                        type="number"
                        name="ShareAmount2"
                        value={payload?.ShareAmount2}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="row">
                  <div className="col-sm-4">
                    <label>Mobile No:</label>
                  </div>
                  <div className="col-sm-8">
                    <Input
                      className="select-input-box form-control input-sm"
                      type="number"
                      name="DoctorMobile"
                      onInput={(e) => number(e, 10)}
                      value={payload?.DoctorMobile}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="row">
                  <div className="col-sm-4">
                    <label>Doctor Spl:</label>
                  </div>
                  <div className="col-sm-8">
                    <SelectBoxWithCheckbox
                      onChange={handleSelectChange}
                      options={Speclization}
                      name="Speclization"
                      value={payload?.Speclization}
                    />
                  </div>
                </div>
              </div>
              <div className="col-sm-3">
                <div className="row">
                  <div className="col-sm-4">
                    <label>IsReff:</label>
                  </div>
                  <div className="col-sm-8">
                    <select
                      className="select_control"
                      name="IsReff"
                      value={payload?.IsReff}
                      onChange={handleChange}
                    >
                      <option selected value="IsRef">
                        IsRef
                      </option>
                      <option value="both">BOTH</option>
                      <option value="Y">Y</option>
                      <option value="N">N</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="row">
            {loading ? (
              <Loading />
            ) : (
              <div className="col-sm-1">
                <button
                  type="button"
                  className="btn btn-block btn-info btn-sm"
                  onClick={handleSave}
                >
                  Search
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* new */}
      <div className="box">
        <div className="box-body">
          <div className="row">
            <div className="col-sm-2">
              <Input type="radio" className="control-label" />
              <label>Patient Wise</label>
            </div>
            <div className="col-sm-2">
              <Input type="radio" className="control-label" />
              <label>PDF</label>
            </div>
            <div className="col-sm-2">
              <Input type="radio" className="control-label" />
              <label>EXCEL</label>
            </div>
            <div className="col-sm-2">
              <button
                className="btn btn-block btn-success btn-sm"
                type="submit"
              >
                Show_Report
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* end */}
      {tabledata.length > 0 && (
        <div className="box">
          <div className="box-header with-border">
            {hideSelectBox() && (
              <div className="col-md-2">
                <select className="select_control" name="">
                  <option hidden> Select </option>
                  {tabledata?.map(
                    (ele, index) =>
                      ele?.isSelect && (
                        <option key={index} value={ele?.Doctor}>
                          {ele?.Doctor}
                        </option>
                      )
                  )}
                </select>
              </div>
            )}
            <div className={hideSelectBox() ? "col-md-10" : "col-md-12"}>
              <h6 style={{ textAlign: "end" }} className="text-primary">
                Total Doctor Count : {tabledata?.length} , Toatl Patient Count :{" "}
                {handlePatientCount()} , Total Shared Amount :{" "}
                {handlePatientShareAmount()}
              </h6>
            </div>
          </div>
          <div
            className={`box-body divResult table-responsive ${
              tabledata.length > 8 && "boottable"
            }`}
            id="no-more-tables"
          >
            <div className="row">
              <div className="col-12">
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf">
                    <tr>
                      <th>S.No</th>
                      <th>Ref</th>
                      <th>Count</th>

                      <th>
                        {/* Select */}
                        <div>
                          <Input
                            type="checkbox"
                            name="isSelect"
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
                            onChange={(e, index) => {
                              handleChangeNew(e, index);
                            }}
                          />
                        </div>
                      </th>

                      <th>Doc Name</th>
                      <th>Master Share</th>
                      <th>Phone</th>
                      <th>Mobile</th>
                      <th>Share Amount</th>
                      <th>Added On</th>
                      <th>Show</th>
                    </tr>
                  </thead>
                  {tabledata?.map((item, index) => (
                    <tbody>
                      <tr key={index}>
                        <td data-title={"S.No"}>{index + 1}</td>
                        <td data-title={"Ref"}>
                          <Input
                            type="checkbox"
                            checked={
                              item?.Referal.toLowerCase() === "y" ? true : false
                            }
                            onChange={(e) =>
                              handleRef(e, item?.DoctorID, "DoctorRefferal")
                            }
                          />
                        </td>
                        <td data-title={"Count"}>{item.Total}</td>
                        <td data-title={"#"}>
                          <Input
                            type="checkbox"
                            checked={item?.isSelect}
                            name="isSelect"
                            onChange={(e) => DoctorSelectedHandle(e, index)}
                            disabled={item?.isChecked ? true : false}
                          />
                        </td>
                        <td data-title={"Count"}>{item?.Doctor}</td>
                        <td data-title={"Master Share"}>
                          <Input
                            type="checkbox"
                            checked={
                              item?.MasterShare.toLowerCase() === "y"
                                ? true
                                : false
                            }
                            onChange={(e) =>
                              handleRef(e, item?.DoctorID, "ShareMasterUpdate")
                            }
                          />
                        </td>
                        <td data-title={"Phone"}>{item?.Phone}</td>
                        <td data-title={"Mobile"}>{item?.Mobile}</td>
                        <td data-title={"Share Amount"}>
                          {item?.SharedAmount}
                        </td>
                        <td data-title={"Added On"}>{item.AddedDate}</td>
                        <td
                          data-title={"Show"}
                          onClick={() => table1data(index)}
                        >
                          {loading1 === index ? (
                            <Loading />
                          ) : (
                            <i className="fa fa-search" />
                          )}
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="row">
        <div className="col-sm-8">
          {tabledata1.length > 0 && (
            <div className="box">
              <div className="box-header with-border">
                <h1 className="box-title"> Patient Detail</h1>
              </div>
              <div
                className={`box-body divResult table-responsive ${
                  tabledata.length > 8 && "boottable"
                }`}
                id="no-more-tables"
              >
                <div className="row">
                  <div className="col-12">
                    <table
                      className="table table-bordered table-hover table-striped tbRecord"
                      cellPadding="{0}"
                      cellSpacing="{0}"
                    >
                      <thead className="cf">
                        <tr>
                          <th>S.No</th>
                          <th>LabNo.</th>
                          <th>VisitDate</th>
                          <th>Patient</th>
                          <th>GrossAmount</th>
                          <th>Discount</th>
                          <th>NetAmount</th>
                          <th>PaidAmount</th>
                          <th>Balance</th>
                          <th>Show</th>
                        </tr>
                      </thead>
                      {tabledata1?.map((item, index) => (
                        <tbody>
                          <tr key={index}>
                            <td data-title={"S.No"}>{index + 1}</td>
                            <td data-title={"LabNo."}>
                              {item?.LedgerTransactionNo}
                            </td>
                            <td data-title={"VisitDate"}>{item?.dtEntry}</td>
                            <td data-title={"Patient"}>{item?.Patient}</td>
                            <td data-title={"GrossAmount"}>
                              {item?.GrossAmount}
                            </td>
                            <td data-title={"Discount"}>
                              {item?.DiscountOnTotal}
                            </td>
                            <td data-title={"NetAmount"}>{item?.NetAmount}</td>
                            <td data-title={"PaidAmount"}>
                              {item?.PaidAmount}
                            </td>
                            <td data-title={"Balance"}>{item?.Balance}</td>
                            <td
                              data-title={"Show"}
                              onClick={() => {
                                table2data(item?.LedgerTransactionNo);
                              }}
                            >
                              {loading2 === item?.LedgerTransactionNo ? (
                                <Loading />
                              ) : (
                                <i className="fa fa-search" />
                              )}
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-sm-4">
          {tabledata2.length > 0 && (
            <div className="box">
              <div className="box-header with-border">
                <h1 className="box-title">Test Detail</h1>
              </div>
              <div
                className={`box-body divResult table-responsive ${
                  tabledata.length > 8 && "boottable"
                }`}
                id="no-more-tables"
              >
                <div className="row">
                  <div className="col-12">
                    <table
                      className="table table-bordered table-hover table-striped tbRecord"
                      cellPadding="{0}"
                      cellSpacing="{0}"
                    >
                      <thead className="cf">
                        <tr>
                          <th>S.No</th>
                          <th>Test Name.</th>
                          <th>ShareAmt</th>
                          <th>Amount</th>
                          <th>#</th>
                        </tr>
                      </thead>
                      {tabledata2?.map((item, index) => (
                        <tbody>
                          <tr key={index}>
                            <td data-title={"S.No"}>{index + 1}</td>
                            <td data-title={"Test Name."}>{item?.Item}</td>
                            <td data-title={"ShareAmt"}>{item?.GrossAmount}</td>
                            <td data-title={"Amount"}>{item?.NetAmount}</td>
                            <td data-title={"#"}>
                              <Input
                                type="checkbox"
                                onChange={(e) => handleSearchTest(e, item)}
                              />
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DoctorMisReportPage;
