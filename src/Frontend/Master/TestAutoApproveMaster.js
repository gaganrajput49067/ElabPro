import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SelectBox } from "../../ChildComponents/SelectBox";
import Loading from "../util/Loading";
import { autocompleteOnBlur, isChecked } from "../util/Commonservices";
import Input from "../../ChildComponents/Input";

import { useTranslation } from "react-i18next";
const TestAutoApproveMaster = () => {
  const [show, setShow] = useState(false);
  const [FetchDepartment, setFetchDepartment] = useState([]);
  const [FetchCentre, setFetchCentre] = useState([]);
  const [searchLoad, setsearchLoad] = useState(false);
  const [searchLoad1, setsearchLoad1] = useState(false);
  const [saveLoad, setSaveLoad] = useState(false);
  const [DoctorData, setDoctorData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableDataMaster, setTableDataMaster] = useState([]);
  const [dropFalse, setDropFalse] = useState(true);
  const [indexMatch, setIndexMatch] = useState(0);
  const [payload, setPayload] = useState({
    BookingCentreId: "",
    DepartmentId: "",
    TestName: "",
    DocID: "",
    DoctorName: "",
  });

  const { t } = useTranslation();
  const handleChange = (e, state) => {
    state(true);
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
    // setDropFalse(true);
  };

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

  const handleListSearch = (data, name) => {
    switch (name) {
      case "DoctorName":
        setPayload({
          ...payload,
          [name]: data.DoctorName,
          DocID: data.DoctorName ? data.EmployeeID : "",
        });
        setIndexMatch(0);
        setDoctorData([]);
        setDropFalse(false);
        break;

      default:
        break;
    }
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  const fetchDepartment = () => {
    axios
      .get("/api/v1/TestCentreMappingController/BindDepartment")
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            label: ele?.department,
            value: ele?.departmentid,
          };
        });
        val.unshift({ label: "Department Name", value: "" });
        setFetchDepartment(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  const getDoctorSuggestion = (name) => {
    axios
      .post("/api/v1/AutoApproval/getBindDoctor", {
        DoctorName: name,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            DoctorName: ele?.DoctorName,
            EmployeeID: ele?.EmployeeID,
          };
        });
        setDoctorData(val);
      })
      .catch((err) => console.log(err));
  };

  const fetchCenter = () => {
    axios
      .get("/api/v1/TestCentreMappingController/BindBookingCentre")
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => {
          return {
            label: ele?.Centre,
            value: ele?.centreId,
          };
        });
        val.unshift({ label: "Centre Name", value: "" });
        setFetchCentre(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  const handleSelect = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleOnChangeSelect = (event) => {
    const { value } = event?.target;
    setPayload({ ...payload, DoctorName: value });
  };

  const handleSubmit = () => {
    setsearchLoad(true);
    axios
      .post("/api/v1/AutoApproval/SaveAutoAupprovalMasterSig", {
        departmentid: payload?.DepartmentId,
        CentreId: payload?.BookingCentreId,
        DoctorId: payload?.DocID,
      })
      .then((res) => {
        toast.success(res?.data?.message?.message);
        setsearchLoad(false);
        getApprovalMasterSig();
        setPayload({
          BookingCentreId: "",
          DepartmentId: "",
          TestName: "",
          DocID: "",
          DoctorName: "",
        });
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
        setsearchLoad(false);
      });
  };

  const getApprovalMasterSig = () => {
    setsearchLoad1(true);
    axios
      .post("/api/v1/AutoApproval/getAutoApprovalMasterSig")
      .then((res) => {
        setTableDataMaster(res?.data?.message);
        setsearchLoad1(false);
      })
      .catch((err) => {
        toast.error(err?.data?.message ? err?.data?.message : "Error Occured");
        setsearchLoad1(false);
      });
  };

  const handleSearch = () => {
    setsearchLoad(true);
    axios
      .post("/api/v1/AutoApproval/getAutoApprovalCentreInv", {
        departmentID: payload?.DepartmentId,
        centreId: payload?.BookingCentreId,
      })
      .then((res) => {
        let val = res?.data?.message?.map((ele) => {
          return {
            ...ele,
          };
        });
        setTableData(val);
        setsearchLoad(false);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
        setsearchLoad(false);
      });
  };

  const handleCheckbox = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const data = [...tableData];
      data[index][name] = checked ? 1 : 0;
      setTableData(data);
    } else {
      const val = tableData.map((ele) => {
        return {
          ...ele,
          [name]: checked ? 1 : 0,
        };
      });

      setTableData(val);
    }
  };

  const handleCentreInvSubmit = () => {
    setSaveLoad(true);
    const data = tableData.filter((ele) => ele?.isChecked === 1);
    const val = data.map((ele) => {
      return {
        departmentid: ele?.DepartmentID,
        CentreId: ele?.CentreId,
        Investigation: ele?.InvestigationID,
      };
    });
    axios
      .post("/api/v1/AutoApproval/SaveAutoApprovalCentreInv", {
        data: val,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setSaveLoad(false);
        // handleSearch();
        setTableData([])
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
        setSaveLoad(false);
      });
  };

  const DeleteAutoAupprovalMasterSig = (id) => {
    axios
      .post("/api/v1/AutoApproval/DeleteAutoAupprovalMasterSig", {
        Id: id,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        getApprovalMasterSig();
      })
      .catch((err) => {
        toast.error(err?.data?.message ? err?.data?.message : "Error Occured");
      });
  };

  const disableButton = () => {
    let disable = false;
    if (show) {
      if (payload?.DepartmentId === "" && payload?.BookingCentreId === "") {
        disable = true;
      }
    } else {
      if (
        payload?.DepartmentId === "" &&
        payload?.BookingCentreId === "" &&
        payload?.DocID === ""
      ) {
        disable = true;
      }
    }

    return disable;
  };

  useEffect(() => {
    fetchCenter();
    fetchDepartment();
  }, []);

  useEffect(() => {
    if (!show) {
      getApprovalMasterSig();
    }
  }, [show]);

  useEffect(() => {
    if (payload?.DoctorName.length > 1) {
      getDoctorSuggestion(payload?.DoctorName);
    }
     else {
      setDoctorData([]);
    }
  }, [payload?.DoctorName]);

  return (
    <div className="box box-success">
      <div className="box-header with-border">
        <h3 className="box-title">
          {!show
            ? t("Test Auto Approve Master")
            : t("Auto Approve Centre Investigation")}
        </h3>
      </div>
      <div className="box-body">
        <div className="row">
          {!show ? (
            <>
              <label className="col-sm-1">{t("Test Centre")}:</label>
              <div className="col-sm-2">
                <SelectBox
                  name="BookingCentreId"
                  className="required"
                  options={FetchCentre}
                  onChange={handleSelectChange}
                  selectedValue={payload?.BookingCentreId}
                />
              </div>
              <label className="col-sm-1">{t("Doctor Name")}:</label>
              <div className="col-sm-2 ">
                <Input
                  className="form-control ui-autocomplete-input input-sm"
                  type="text"
                  name="DoctorName"
                  value={payload?.DoctorName}
                  onChange={(e) => handleChange(e, setDropFalse)}
                  onKeyDown={(e) => handleIndex(e, DoctorData, "DoctorName")}
                placeholder={t("Doctor Name")}
                  onBlur={(e) => {
                    autocompleteOnBlur(setDoctorData);
                    setTimeout(() => {
                      const data = DoctorData.filter(
                        (ele) => ele?.DoctorName === e.target.value
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
                    style={{ top: "27px", width: "97%", right: "4px" }}
                  >
                    {DoctorData.map((data, index) => (
                      <li
                        onClick={() =>
                          handleListSearch(data, "DoctorName")
                        }
                        className={`${index === indexMatch && "matchIndex"}`}
                        key={index}
                      >
                        {data?.DoctorName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <label className="col-sm-1">{t("Department Name")}:</label>
              <div className="col-sm-2">
                <SelectBox
                  className="required"
                  onChange={handleSelectChange}
                  name="DepartmentId"
                  options={FetchDepartment}
                  selectedValue={payload?.DepartmentId}
                />
              </div>
              <div
                className="text-primary col-sm-2 "
                style={{
                  alignSelf: "flex-end",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setShow(true);
                  setPayload({
                    BookingCentreId: "",
                    DepartmentId: "",
                    TestName: "",
                    DocID: "",
                    DoctorName: "",
                  });
                  setTableData([]);
                }}
              >
                {t("Set Test For AutoApproved")}
              </div>
            </>
          ) : (
            <>
              <label className="col-sm-1">{t("Booking Centre")}:</label>
              <div className="col-sm-2">
                <SelectBox
                  name="BookingCentreId"
                  className="required"
                  options={FetchCentre}
                  onChange={handleSelectChange}
                  selectedValue={payload?.BookingCentreId}
                />
              </div>
              <label className="col-sm-1">{t("Department")}:</label>
              <div className="col-sm-2 ">
                <SelectBox
                  className="required"
                  onChange={handleSelectChange}
                  name="DepartmentId"
                  options={FetchDepartment}
                  selectedValue={payload?.DepartmentId}
                />
              </div>
              <div
                className="text-success col-sm-3"
                style={{
                  alignSelf: "flex-end",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setShow(false);
                  setPayload({
                    BookingCentreId: "",
                    DepartmentId: "",
                    TestName: "",
                    DocID: "",
                    DoctorName: "",
                  });
                  setTableData([]);
                }}
              >
                {t("Set Signature For AutoApproved")}
              </div>
            </>
          )}
        </div>
        <div className="row">
          <div className="col-sm-1 col-md-1">
            {searchLoad ? (
              <Loading />
            ) : show ? (
              <button
                className="btn btn-warning mx-2 btn-block btn-sm"
                onClick={handleSearch}
                disabled={disableButton()}
              >
                {t("Search")}
              </button>
            ) : (
              <button
                className="btn btn-success mx-2 btn-block btn-sm"
                onClick={handleSubmit}
                disabled={disableButton()}
              >
                {t("Save")}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="box">
        {show ? (
          tableData?.length > 0 && (
            <div
              className="box-body table-responsive divResult boottable"
              id="no-more-tables"
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
                      <th>{t("Test")}</th>
                      <th>
                        {t("Auto Approve")}
                        <div>
                          <input
                            type="checkbox"
                            name="isChecked"
                            checked={
                              tableData.length > 0
                                ? isChecked("isChecked", tableData, 1).includes(
                                    false
                                  )
                                  ? false
                                  : true
                                : false
                            }
                            onChange={(e) => handleCheckbox(e)}
                          />
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.map((ele, index) => (
                      <tr key={index}>
                        <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                        <td data-title={t("Test")}>{ele?.TestName}&nbsp;</td>
                        <td data-title={t("Auto Approve")}>
                          <input
                            type="checkbox"
                            name="isChecked"
                            checked={ele?.isChecked === 1 ? true : false}
                            onChange={(e) => handleCheckbox(e, index)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {saveLoad ? (
                <Loading />
              ) : (
                <div className="box-footer">
                  <div className="col-sm-1">
                    <button
                      className="btn btn-block btn-success btn-sm "
                      onClick={handleCentreInvSubmit}
                      disabled={
                        isChecked("isChecked", tableData, 1).includes(true)
                          ? false
                          : true
                      }
                    >
                      {t("Submit")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        ) : searchLoad1 ? (
          <Loading />
        ) : (
          tableDataMaster?.length > 0 && (
            <div
              className=" box-body divResult table-responsive boottable"
              id="no-more-tables"
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
                      <th>{t("Centre")}</th>
                      <th>{t("Department")}</th>
                      <th>{t("Doctor")}</th>
                      <th>{t("Status")}</th>
                      <th>{t("View Sign")}</th>
                      <th>{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableDataMaster?.map((ele, index) => (
                      <tr key={index}>
                        <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                        <td data-title={t("Centre")}>{ele?.centre}&nbsp;</td>
                        <td data-title={t("Department")}>{ele?.Department}&nbsp;</td>
                        <td data-title={t("Doctor")}>{ele?.ApproveByName}&nbsp;</td>
                        <td data-title={t("Status")}>
                          {ele?.IsActive === 1 ? "Active" : "De-Active"}&nbsp;
                        </td>
                        <td data-title={t("View Sign")}>view</td>
                        <td data-title={t("Action")}>
                          {ele?.IsActive === 1 && (
                            <button
                              className="btn btn-block btn-danger btn-sm"
                              onClick={() =>
                                DeleteAutoAupprovalMasterSig(ele?.id)
                              }
                            >
                              {t("Delete")}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default TestAutoApproveMaster;
