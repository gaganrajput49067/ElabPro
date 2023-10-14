import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { number } from "yup";
import { SelectBox } from "../../ChildComponents/SelectBox";
import Loading from "../util/Loading";
import Input from "../../ChildComponents/Input";
import { autocompleteOnBlur, isChecked } from "../util/Commonservices";
import DoctorTypeDefaultShareModal from "../util/Commonservices/DoctorTypeDefaultShareModal";

import { useTranslation } from "react-i18next";
const DoctorShareMaster = () => {
  const [Disable, setDisable] = useState(true);
  const handleClose = () => setShow(false);
  const [DoctorData, setDoctorData] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [errors, setErrors] = useState({});
  const [dropFalse, setDropFalse] = useState(true);
  const [show, setShow] = useState(false);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState({});
  const [indexMatch, setIndexMatch] = useState(0);
  const [TableData, setTableData] = useState([]);
  const [payload, setPayload] = useState({
    DocID: "",
    DepartmentID: "",
    DoctorName: "",
  });
  const { t } = useTranslation();

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value, ItemValue: "" });
    // setErrors({});
  };

  const handleListSearch = (data, name) => {
    switch (name) {
      case "DoctorName":
        setPayload({
          ...payload,
          [name]: data.Name,
          DocID: data.Name ? data.DoctorReferalID : "",
        });
        setIndexMatch(0);
        setDoctorData([]);
        setDropFalse(false);
        break;

      default:
        break;
    }
  };

  const handleChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    if (index >= 0) {
      const data = [...TableData];
      if (name === "ShareAmount") {
        data[index]["SharePer"] = "";
      }
      if (name === "SharePer") {
        data[index]["ShareAmount"] = "";
      }
      data[index][name] =
        type === "checkbox"
          ? checked
          : name === "SharePer"
          ? parseInt(value) > 100
            ? ""
            : value
          : value;
      setTableData(data);
    } else {
      if (type === "checkbox") {
        if (checked) {
          const data = TableData.map((ele) => {
            return {
              ...ele,
              [name]: checked,
            };
          });
          setTableData(data);
        } else {
          const data = TableData.map((ele) => {
            return {
              ...ele,
              [name]: checked,
            };
          });
          setTableData(data);
          document.getElementById("ShareAmount").value = "";
          document.getElementById("SharePer").value = "";
        }
      } else {
        const data = TableData.map((ele) => {
          return {
            ...ele,
            ShareAmount: name === "SharePer" ? "" : value,
            SharePer:
              name === "ShareAmount" ? "" : parseInt(value) > 100 ? "" : value,
          };
        });
        setTableData(data);
        if (name === "SharePer") {
          document.getElementById("ShareAmount").value = "";
          let data = document.getElementById("SharePer").value;
          if (parseInt(data) > 100) {
            document.getElementById("SharePer").value = "";
          }
        }

        if (name === "ShareAmount") {
          document.getElementById("SharePer").value = "";
        }
      }
    }
  };

  const handleChanges = (e, state) => {
    state(true);
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleOnChangeSelect = (event) => {
    const { value } = event?.target;
    setPayload({ ...payload, DoctorName: "" });
  };

  console.log(payload);

  const handleShow = () => setShow(true);
  // const handleClose = () => setShow(false);
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
        Department.unshift({ label: "All Department", value: "" });
        setPayload({
          ...payload,
          DepartmentID: Department[0]?.value,
        });
        setDepartment(Department);
      })
      .catch((err) => console.log(err));
  };

  const getDoctorTypeShare = () => {
    setLoading(true);
    axios
      .post("/api/v1/DoctorShare/GetDoctorShare", {
        DocID: payload?.DocID,
        DepartmentID: payload?.DepartmentID,
      })
      .then((res) => {
        if (res.status === 200) {
          const data = res.data.message;
          const val = data.map((ele) => {
            return {
              ...ele,
              ShareAmount: Number(ele?.ShareAmount).toFixed(2),
              SharePer: Number(ele?.SharePer).toFixed(2),
              isChecked: false,
              DocID: payload?.DocID,
              DepartmentID: payload?.DepartmentID,
            };
          });
          setTableData(val);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const DeleteData = () => {
    const data = TableData?.filter((ele) => ele.isChecked === true);
    axios
      .post("/api/v1/DoctorShare/DoctorShareDelete", {
        RemoveData: data,
      })
      .then((res) => {
        if (res.data.message) {
          toast.success(res.data.message);
          getDoctorTypeShare();
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const post = () => {
    const data = TableData?.filter((ele) => ele.isChecked === true);
    const valid = Match(data);
    if (valid) {
      toast.error("Share Amount Cannot be Greater then Rate");
    } else {
      setLoad(true);
      axios
        .post("/api/v1/DoctorShare/DoctorShareCreate", {
          SaveDoctorShare: data,
        })
        .then((res) => {
          if (res.data.message) {
            setLoad(false);
            toast.success(res.data.message);
            getDoctorTypeShare();
          } else {
            toast.error("Something went wrong");
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setLoad(false);
        });
    }
  };

  const getDoctorSuggestion = (name) => {
    axios
      .post("/api/v1/DoctorReferal/getDoctorData", {
        DoctorName: name,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            Name: ele?.Name,
            DoctorReferalID: ele?.DoctorReferalID,
          };
        });
        setDoctorData(val);
      })
      .catch((err) => console.log(err));
  };

  const Match = (TableData) => {
    debugger;
    let match = false;
    let FieldError = {
      index: "",
      minValue: "",
    };
    for (var i = 0; i < TableData.length; i++) {
      if (
        parseFloat(TableData[i].ShareAmount) > parseFloat(TableData[i].Rate) ||
        (TableData[i].ShareAmount === "" && TableData[i].SharePer === "")
      ) {
        match = true;
        FieldError = { index: i, minValue: "ShareAmount", maxValue: "" };
        break;
      }
      if (
        parseFloat(TableData[i].SharePer) > parseFloat(TableData[i].Rate) ||
        (TableData[i].ShareAmount === "" && TableData[i].SharePer === "")
      ) {
        match = true;
        FieldError = { index: i, minValue: "ShareAmount", maxValue: "" };
        break;
      }
    }
    setValid(FieldError);
    return match;
  };

  useEffect(() => {
    if (TableData.length > 0) {
      let flag = true;
      for (var i = 0; i < TableData.length; i++) {
        if (TableData[i].isChecked === true) {
          flag = false;
          break;
        }
      }
      setDisable(flag);
    }
  }, [TableData]);

  const handleIndex = (e, state, name) => {
    switch (e.which) {
      case 38:
        if (indexMatch !== 0) {
          setIndexMatch(indexMatch - 1);
        } else {
          setIndexMatch(state?.length - 1);
        }
        break;
      case 40:
        if (state?.length - 1 === indexMatch) {
          setIndexMatch(0);
        } else {
          setIndexMatch(indexMatch + 1);
        }
        break;
      case 13:
        handleListSearch(state[indexMatch], name);
        setIndexMatch(0);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getDepartment();
  }, []);

  useEffect(() => {
    if (payload?.DoctorName.length > 1) {
      getDoctorSuggestion(payload?.DoctorName);
    }
  }, [payload?.DoctorName]);

  useEffect(() => {
    getDepartment("setDoctorData");
    getDepartment();
  }, []);
  return (
    <>
      {show && (
        <DoctorTypeDefaultShareModal
          show={show}
          handleClose={handleClose}
          DocID={payload?.DocID}
        />
      )}
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h1 className="box-title">{t("Doctor Share Master")}</h1>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("Doctor ID")}:</label>
            <div className="col-sm-2 ">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                type="text"
                name="DoctorName"
                value={payload?.DoctorName}
                onChange={(e) => handleChanges(e, setDropFalse)}
                onKeyDown={(e) => handleIndex(e, DoctorData, "DoctorName")}
                placeholder={t("Doctor ID")}
                onBlur={(e) => {
                  autocompleteOnBlur(setDoctorData);
                  setTimeout(() => {
                    const data = DoctorData.filter(
                      (ele) => ele?.Name === e.target.value
                    );
                    if (data?.length === 0) {
                      setPayload({ ...payload, DoctorName: "" });
                    }
                  }, 500);
                }}
                autoComplete="off"
              />
              {dropFalse && DoctorData?.length > 0 && (
                <ul
                  className="suggestion-data"
                  style={{ top: "27px", width: "100%" }}
                >
                  {DoctorData.map((data, index) => (
                    <li
                      onClick={() => handleListSearch(data, "DoctorDataSecond")}
                      className={`${index === indexMatch && "matchIndex"}`}
                      key={index}
                    >
                      {data?.Name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <label className="col-sm-1">{t("Department")}:</label>
            <div className="col-sm-2">
              <SelectBox
                className="input-sm"
                onChange={handleSelectChange}
                name="DepartmentID"
                options={Department}
                selectedValue={payload?.DepartmentID}
              />
            </div>
            <div className="col-sm-1">
              {loading ? (
                <Loading />
              ) : (
                <>
                  <button
                    type="submit"
                    className="btn btn-block btn-warning btn-sm"
                    onClick={getDoctorTypeShare}
                    disabled={
                      payload?.DocID && payload?.DepartmentID ? false : true
                    }
                  >
                    {t("Search")}
                  </button>
                </>
              )}
            </div>
            <div className="col-sm-1">
              <button
                type="submit"
                className="btn btn-block btn-danger btn-sm"
                onClick={handleShow}
              >
                {t("Default Share")}
              </button>
            </div>
            <div className="col-sm-3">
              <button
                type="submit"
                className="btn btn-block btn-success btn-sm"
                // onClick={handleShow}
              >
                <Link to="/DoctorTypeCopyShare" style={{ color: "white" }}>
                  {t("Copy Share from one Doctor Rate to Other")}
                </Link>
              </button>
            </div>
          </div>
        </div>
        <div
          className={`box-body divResult table-responsive ${
            TableData.length > 8 && "boottable"
          }`}
          id="no-more-tables"
        >
          {loading ? (
            <Loading />
          ) : (
            <>
              {TableData.length > 0 && (
                <table
                  className="table table-bordered table-hover boottable table-responsive table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf">
                    <tr>
                      <th>S.No</th>
                      <th>Investigation</th>
                      <th>Rate</th>
                      <th>
                        <Input
                          type="number"
                          placeholder="Share Amount"
                          name="ShareAmount"
                          onChange={handleChange}
                          onInput={(e) => number(e, 4)}
                          id="ShareAmount"
                          className="form-control ui-autocomplete-input input-sm"
                          disabled={
                            TableData?.length > 0
                              ? isChecked(
                                  "isChecked",
                                  TableData,
                                  true
                                ).includes(false)
                                ? true
                                : false
                              : false
                          }
                        />
                      </th>
                      <th>
                        <Input
                          type="number"
                          placeholder="Share Percentage"
                          name="SharePer"
                          onChange={handleChange}
                          onInput={(e) => number(e, 3)}
                          id="SharePer"
                          className="form-control ui-autocomplete-input input-sm"
                          disabled={
                            TableData?.length > 0
                              ? isChecked(
                                  "isChecked",
                                  TableData,
                                  true
                                ).includes(false)
                                ? true
                                : false
                              : false
                          }
                        />
                      </th>
                      <th>
                        <Input
                          type="checkbox"
                          name="isChecked"
                          onChange={handleChange}
                          checked={
                            TableData?.length > 0
                              ? isChecked(
                                  "isChecked",
                                  TableData,
                                  true
                                ).includes(false)
                                ? false
                                : true
                              : false
                          }
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {TableData.map((data, i) => (
                      <tr key={i}>
                        <td data-title={"S.No"}>{i + 1}</td>
                        <td data-title={"Investigation"}>{data?.TestName}</td>
                        <td data-title={"Rate"}>{data?.Rate}</td>
                        <td data-title={"ShareAmount"}>
                          <Input
                            value={data?.ShareAmount}
                            type="number"
                            onChange={(e) => handleChange(e, i)}
                            onInput={(e) => number(e, 4)}
                            name="ShareAmount"
                            className={`form-control ui-autocomplete-input input-sm  ${
                              data?.ShareAmount > data?.Rate
                                ? "error-occured-input"
                                : ""
                            }`}
                            disabled={data?.isChecked ? false : true}
                          />
                        </td>
                        <td data-title={"SharePer"}>
                          <Input
                            value={data?.SharePer}
                            onChange={(e) => handleChange(e, i)}
                            onInput={(e) => number(e, 3)}
                            name="SharePer"
                            type="number"
                            className="form-control ui-autocomplete-input input-sm"
                            disabled={data?.isChecked ? false : true}
                          />
                        </td>
                        <td data-title={"#"}>
                          <Input
                            type="checkbox"
                            name="isChecked"
                            checked={data?.isChecked}
                            onChange={(e) => handleChange(e, i)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </div>
        {TableData.length > 0 && (
          <div className="box-footer">
            <>
              <div className="col-sm-1">
                {load ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-block btn-warning btn-sm"
                    type="button"
                    onClick={post}
                    disabled={Disable}
                  >
                    Save
                  </button>
                )}
              </div>
              <div className="col-sm-1">
                <button
                  className="btn btn-block btn-warning btn-sm"
                  type="button"
                  onClick={DeleteData}
                  disabled={Disable}
                >
                  Delete
                </button>
              </div>
            </>
          </div>
        )}
      </div>
    </>
  );
};

export default DoctorShareMaster;
