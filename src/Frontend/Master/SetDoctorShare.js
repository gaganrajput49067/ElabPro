import React, { useEffect, useState } from "react";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  getAccessRateTypeNew,
  getBillingCategory,
  getDepartment,
} from "../util/Commonservices";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../util/Loading";
import { number } from "../util/Commonservices/number";
import DoctorShareTransferModal from "../util/DoctorShareTransferModal";

import { useTranslation } from "react-i18next";
const SetDoctorShare = () => {
  const [loading, setLoading] = useState(false);
  const [secondLoading, setSecondLoading] = useState(false);
  const [formTable, setFormTable] = useState([]);
  const [formTableNew, setFormTableNew] = useState([]);
  const [saveItem, setSaveItem] = useState([]);
  const [RateData, setRateData] = useState([]);
  const [DoctorData, setDoctorData] = useState([]);
  const [Category, setCategory] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);

  const [state, setState] = useState({
    ToggleData: "Department",
    searchType: "1",
    RateTypeID: "",
    DoctorID: "",
  });

  const { t } = useTranslation();
  const [payload, setPayload] = useState({
    DoctorID: "0",
    RateTypeID: "",
    DepartmentID: "",
    BillingCategoryID: "",
  });

  const [show, setShow] = useState(false);

  const handleChange = (name, value) => {
    if (name === "ToggleData") {
      if (value === "Department") {
        setFormTableNew([]);
        setPayload({
          DoctorID: "0",
          RateTypeID: "",
          DepartmentID: "",
          BillingCategoryID: "",
        });
        setState({ ...state, [name]: value });
      }

      if (value === "Item") {
        setState({
          ...state,
          [name]: value,
          RateTypeID: "",
          DoctorID: "",
        });

        setFormTable([]);
      }
    } else {
      setState({ ...state, [name]: value });
    }
  };

  const handleSelectChange = (e) => {
    const { name,value } = e.target;
    setState({ ...state, [name]: value });
    if (["DoctorID", "RateTypeID"].includes(name) && value === "") {
      setFormTable([]);
    }
  };

  const handleArrayChange = (e, index) => {
    const { name, value } = e.target;
    const data = [...formTable];
    data[index][name] = value > 100 ? "" : value;
    setFormTable(data);
  };

  const handleSelectChangeDoctor = (event) => {
    const { name, value } = event.target;
    setPayload({
      ...payload,
      [name]: value,
    });

    if (name === "DoctorID" && value === "") {
      setFormTableNew([]);
    }
  };

  const validation = () => {
    const data = formTableNew.filter(
      (ele) =>
        ["", 0].includes(ele?.DocShareAmt) && ["", 0].includes(ele?.DocSharePer)
    );
    return data.length > 0 ? true : false;
  };

  const isChecked = (name, state, value, id) => {
    if (id) {
      const data = state?.map((ele) => {
        if (ele?.TestID === id) {
          return ele[name] === value ? true : false;
        } else {
          return ele;
        }
      });
      return data;
    } else {
      const data = state?.map((ele) => {
        return ele[name] === value ? true : false;
      });
      return data;
    }
  };

  const handleChangeNew = (e) => {
    const { name, value, checked, type } = e.target;
    if (type === "checkbox") {
      const data = formTableNew.map((ele) => {
        return {
          ...ele,
          [name]: checked,
        };
      });
      setFormTableNew(data);
    } else {
      if (name === "DocSharePer") {
        const datas = formTableNew.map((ele) => {
          return {
            ...ele,
            [name]: value > 100 ? "" : value,
            DocShareAmt: "",
            isChecked: ["", 0].includes(value) && false,
          };
        });
        setFormTableNew(datas);
        let data = parseInt(document.getElementById("DocSharePer").value);
        document.getElementById("DocShareAmt").value = "";
        if (data > 100) {
          document.getElementById("DocSharePer").value = "";
        }
      } else if (name === "DocShareAmt") {
        const datas = formTableNew.map((ele) => {
          return {
            ...ele,
            [name]: value,
            DocSharePer: "",
            isChecked: ["", 0].includes(value) && false,
          };
        });
        setFormTableNew(datas);
        document.getElementById("DocSharePer").value = "";
      }
    }
  };

  const handleChangeNewOne = (e, index) => {
    const { name, value, checked, type } = e.target;
    const val = [...formTableNew];
    if (type === "checkbox") {
      val[index][name] = checked;
      setFormTableNew(val);
    } else {
      val[index][name] = value;
      if (name === "DocShareAmt") {
        val[index].DocSharePer = "";
        val[index][name] = value;
        val[index]["isChecked"] = ["", 0].includes(value) && false;
      } else if (name === "DocSharePer") {
        val[index].DocShareAmt = "";
        val[index][name] = value > 100 ? "" : value;
        val[index]["isChecked"] = ["", 0].includes(value) && false;
      }

      setFormTableNew(val);
    }
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
        // DeptDataValue.unshift({ label: "Select", value: "" });
        setDepartmentData(DeptDataValue);
      })
      .catch((err) => console.log(err));
  };

  const getTableData = (data) => {
    setLoading(true);
    axios
      .post("/api/v1/DocShareMaster/getDepartmentDocData", data)
      .then((res) => {
        if (res?.data?.message?.length > 0) {
          setFormTable(res?.data?.message);
        } else {
          setFormTable([]);
        }
        setLoading(false);
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

  const getDepartmentDocData = () => {
    setSecondLoading(true);
    axios
      .post("/api/v1/DocShareMaster/getDepartmentDocDataByItem", {
        ...payload,
        searchType: state?.searchType,
      })
      .then((res) => {
        const data = res?.data?.message;
        if (data.length > 0) {
          const val = data.map((ele) => {
            return {
              ...ele,
              isChecked: false,
            };
          });

          setFormTableNew(val);
        } else {
          toast.error("no data found");
          setFormTableNew([]);
        }
        setSecondLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "SomeThing Went Wrong"
        );
        setSecondLoading(false);
      });
  };

  const BindDoctorData = () => {
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
        val.unshift({ label: "Select Doctor", value: "" });
        setDoctorData(val);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "SomeThing Went Wrong"
        );
      });
  };

  useEffect(() => {
    if (
      state?.searchType === "1" &&
      state?.ToggleData === "Department" &&
      state?.RateTypeID
    ) {
      getTableData({
        searchType: state?.searchType,
        DoctorID: state?.DoctorID,
        RateTypeID: state?.RateTypeID,
      });
    }
  }, [state?.RateTypeID]);

  useEffect(() => {
    if (state?.searchType === "2" && state?.ToggleData === "Department") {
      if (state?.DoctorID) {
        getTableData({
          searchType: state?.searchType,
          DoctorID: state?.DoctorID,
          RateTypeID: state?.RateTypeID,
        });
      }
    }
  }, [state?.DoctorID, state?.RateTypeID]);

  const submit = () => {
    setLoading(true);
    axios
      .post("/api/v1/DocShareMaster/DefaulDepartmentShareCreate", {
        RateTypeID: state?.RateTypeID,
        DoctorID: state?.DoctorID,
        Data: formTable,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        getTableData({
          searchType: state?.searchType,
          DoctorID: state?.DoctorID,
          RateTypeID: state?.RateTypeID,
        });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong"
        );
        setLoading(false);
      });
  };

  const handleSubmit = () => {
    setSecondLoading(true);
    axios
      .post("/api/v1/DocShareMaster/SaveDocItemShare", {
        RateTypeID: payload?.RateTypeID,
        DoctorID: payload?.DoctorID,
        DepartmentID: payload?.DepartmentID,
        Data: formTableNew,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        getDepartmentDocData();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong"
        );
        setSecondLoading(false);
      });
  };

  useEffect(() => {
    if (
      payload.BillingCategoryID &&
      payload?.DepartmentID &&
      payload?.RateTypeID &&
      (payload?.DoctorID !== "" || payload?.DoctorID === "0")
    )
      getDepartmentDocData();
  }, [payload]);

  

  useEffect(() => {
    getAccessRateTypeNew(setRateData);
    getDepartment();
    BindDoctorData();
    getBillingCategory(setCategory);
  }, []);
  return (
    <>
      {show && (
        <DoctorShareTransferModal
          show={show}
          handleClose={() => setShow(false)}
        />
      )}
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h1 className="box-title">{t("Set Doctor Share")}</h1>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-sm-1">
              <Input
                type="radio"
                name="searchType"
                value="1"
                checked={state?.searchType == "1" ? true : false}
                onChange={(e) => {
                  handleChange(e.target.name, e.target.value);
                  setPayload({ ...payload, DoctorID: "0" });
                }}
              />
              <label className="control-label " htmlFor="searchType">
                {t("Master")}
              </label>
            </div>
            <div className="col-sm-1">
              <Input
                type="radio"
                name="searchType"
                value="2"
                checked={state?.searchType == "2" ? true : false}
                onChange={(e) => handleChange(e.target.name, e.target.value)}
              />
              <label className="control-label " htmlFor="searchType">
                {t("Doctor")}
              </label>
            </div>
            <div className="col-sm-2">
              <button
                type="submit"
                className="btn btn-block btn-info btn-sm"
                onClick={() => setShow(true)}
              >
                {t("Transfer Doctor Share")}
              </button>
            </div>
          </div>
        </div>
        <div className="row px-4">
          <div className="col-sm-2 departmentItem">
            <div
              onClick={() => handleChange("ToggleData", "Department")}
              className={`mx-2 px-3 py-2 custom-button ${
                state?.ToggleData === "Department" && "is-Active-btn"
              }`}
            >
              <div>{t("Department")}</div>
            </div>
            <div
              onClick={() => handleChange("ToggleData", "Item")}
              className={`mx-2 px-3 py-2 custom-button ${
                state?.ToggleData === "Item" && "is-Active-btn"
              }`}
            >
              <div>{t("Item")}</div>
            </div>
          </div>
        </div>
      </div>
      {state?.ToggleData === "Department" && (
        <div className="box form-horizontal">
          <div className="box-header">
            <div className="row">
              <label className="col-sm-1">{t("Rate Type")}:</label>
              <div className="col-sm-2">
                <SelectBox
                  options={[
                    { label: "SelectRateType", value: "" },
                    ...RateData,
                  ]}
                  onChange={handleSelectChange}
                  name={"RateTypeID"}
                  selectedValue={state?.RateTypeID}
                />
              </div>
              {state?.searchType == "2" && (
                <>
                  <label className="col-sm-1 " htmlFor="searchType">
                    {t("Doctor")}
                  </label>
                  <div className="col-sm-2">
                    <SelectBox
                      options={DoctorData}
                      onChange={handleSelectChange}
                      name={"DoctorID"}
                      isDisabled={state?.RateTypeID ? false : true}
                      selectedValue={state?.DoctorID}
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
      {loading ? (
        <Loading />
      ) : (
        <>
          {formTable.length > 0 && (
            <div
              className="box-body divResult table-responsive boottable"
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
                      <th>{t("Department")}</th>
                      <th>{t("Percentage %")}</th>
                    </tr>
                  </thead>
                  {formTable.map((ele, index) => (
                    <tbody>
                      <tr key={index}>
                        <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                        <td data-title={t("Department")}>
                          {ele?.Department}&nbsp;
                        </td>
                        <td data-title={t("Percentage %")}>
                          <Input
                            className="form-control ui-autocomplete-input input-sm"
                            type="number"
                            name="DocSharePer"
                            value={ele?.DocSharePer}
                            onInput={(e) => number(e, 3)}
                            onChange={(e) => handleArrayChange(e, index)}
                          />
                        </td>
                      </tr>
                    </tbody>
                  ))}
                </table>
              </div>
              <div className="row">
                <div className="col-sm-1">
                  <button
                    type="button"
                    className="btn btn-block btn-success btn-sm"
                    id="btnSave"
                    title="Save"
                    options={saveItem}
                    onClick={submit}
                  >
                    {t("Save")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      {state?.ToggleData === "Item" && (
        <>
          <div className="box form-horizontal">
            <div className="box-body">
              <div className="row">
                <label className="col-sm-1">{t("Rate Type")}:</label>
                <div className="col-sm-2">
                  <SelectBox
                    options={[
                      { label: "Select RateType", value: "" },
                      ...RateData,
                    ]}
                    onChange={handleSelectChangeDoctor}
                    name={"RateTypeID"}
                    selectedValue={payload?.RateTypeID}
                  />
                </div>
                <label className="col-sm-1">{t("Department")}:</label>
                <div className="col-sm-2">
                  <SelectBox
                    onChange={handleSelectChangeDoctor}
                    name={"DepartmentID"}
                    selectedValue={payload?.DepartmentID}
                    options={[
                      { label: "Select Department", value: "" },
                      ...DepartmentData,
                    ]}
                  />
                </div>
                <label className="col-sm-1">{t("Category")}:</label>
                <div className="col-sm-2">
                  <SelectBox
                    options={[
                      { label: "Select Category", value: "" },
                      ...Category,
                    ]}
                    name={"BillingCategoryID"}
                    selectedValue={payload?.BillingCategoryID}
                    onChange={handleSelectChangeDoctor}
                  />
                </div>
                {state?.searchType == "2" && (
                  <>
                    <label className="col-sm-1">{t("Doctor")}:</label>
                    <div className="col-sm-2">
                      <SelectBox
                        options={DoctorData}
                        onChange={handleSelectChangeDoctor}
                        name={"DoctorID"}
                        selectedValue={payload?.DoctorID}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {secondLoading ? (
            <Loading />
          ) : (
            <>
              {formTableNew.length > 0 && (
                <div className="box">
                  <div className="box-body">
                    <div className="row">
                      <div
                        className={`col-12 ${
                          formTableNew.length > 8 && "boottable"
                        }`}
                      >
                        <table
                          className="table table-bordered table-hover table-striped tbRecord"
                          cellPadding="{0}"
                          cellSpacing="{0}"
                        >
                          <thead className="cf">
                            <tr>
                              <th>{t("S.No")}</th>
                              <th>{t("Test Code")}</th>
                              <th>{t("Investigation Name")}</th>
                              <th>
                                {t("DocShare Amt")}
                                <Input
                                  className="form-control ui-autocomplete-input input-sm"
                                  type="number"
                                  name="DocShareAmt"
                                  id="DocShareAmt"
                                  placeholder={t("Enter Amount")}
                                  onInput={(e) => number(e, 4)}
                                  onChange={handleChangeNew}
                                />
                              </th>
                              <th>
                                {t("DocShare Per (%)")}
                                <Input
                                  className="form-control ui-autocomplete-input input-sm"
                                  type="number"
                                  name="DocSharePer"
                                  id="DocSharePer"
                                  placeholder={t("Enter Percent(%)")}
                                  onInput={(e) => number(e, 3)}
                                  onChange={handleChangeNew}
                                />
                              </th>
                              <th>
                                <Input
                                  type="checkbox"
                                  name="isChecked"
                                  onChange={handleChangeNew}
                                  disabled={validation()}
                                  checked={
                                    formTableNew?.length > 0
                                      ? isChecked(
                                          "isChecked",
                                          formTableNew,
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
                          {formTableNew.map((ele, index) => (
                            <tbody>
                              <tr key={index}>
                                <td data-title={t("S.No")}>
                                  {index + 1}&nbsp;
                                </td>
                                <td data-title={t("Test Code")}>
                                  {ele?.TestCode}&nbsp;
                                </td>
                                <td data-title={t("Investigation Name")}>
                                  {ele?.InvestigationName}&nbsp;
                                </td>
                                <td data-title={t("DocShare Amt")}>
                                  <Input
                                    className="form-control ui-autocomplete-input input-sm"
                                    type="number"
                                    name="DocShareAmt"
                                    id="DocShareAmt"
                                    onInput={(e) => number(e, 6)}
                                    value={ele?.DocShareAmt}
                                    onChange={(e) =>
                                      handleChangeNewOne(e, index)
                                    }
                                  />
                                </td>
                                <td data-title={t("DocSharePer")}>
                                  <Input
                                    className="form-control ui-autocomplete-input input-sm"
                                    type="number"
                                    name="DocSharePer"
                                    id="DocSharePer"
                                    onInput={(e) => number(e, 3)}
                                    value={ele?.DocSharePer}
                                    onChange={(e) =>
                                      handleChangeNewOne(e, index)
                                    }
                                  />
                                </td>
                                <td data-title={t("Status")}>
                                  <Input
                                    type="checkbox"
                                    name="isChecked"
                                    checked={ele?.isChecked}
                                    disabled={
                                      ele?.DocSharePer || ele?.DocShareAmt
                                        ? false
                                        : true
                                    }
                                    onChange={(e) =>
                                      handleChangeNewOne(e, index)
                                    }
                                  />
                                </td>
                              </tr>
                            </tbody>
                          ))}
                        </table>
                        {formTableNew?.length > 0 &&
                          isChecked("isChecked", formTableNew, true).includes(
                            true
                          ) && (
                            <div className="box-footer">
                              <div className="col-sm-1">
                                <button
                                  type="button"
                                  className="btn btn-block btn-success btn-sm"
                                  id="btnSave"
                                  title="Save"
                                  onClick={handleSubmit}
                                >
                                  {t("Save")}
                                </button>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};

export default SetDoctorShare;
