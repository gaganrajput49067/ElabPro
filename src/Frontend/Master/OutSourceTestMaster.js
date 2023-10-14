import React, { useEffect, useMemo } from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { useState } from "react";
import axios from "axios";
import Input from "../../ChildComponents/Input";
import { toast } from "react-toastify";
import Loading from "../util/Loading";
import { useTranslation } from "react-i18next";

const OutSourceTestMaster = () => {
  const [load, setLoad] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [TestSuggestion, setTestSuggestion] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [OutSourceLabData, setOutSourceLabData] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [payload, setPayload] = useState({
    OutSourceLabID: "",
    OutSourceLabName: "",
    BookingCentreID: "",
    BookingCentreName: "",
    DepartmentID: "",
    InvestigationID: "0",
    // Type: "Remove",
    // isDefault: "",
    // OutsourceRate: "",
    // TATType: "",
    // TAT: "",
    // IsFileRequired: "",
  });
  
  const { t, i18n } = useTranslation();

  const validationFields = () => {
    let error = "";
    if (!payload?.BookingCentreID) {
      error = "Please Select From Centre  ";
    } else if (!payload?.DepartmentID) {
      error = "Please Select Department ";
    }
    return error;
  };

  const handleSelectChange = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    if (name === "OutSourceLabID") {
      setPayload({
        ...payload,
        [name]: value,
        OutSourceLabName: label,
      });
    } else if (name === "BookingCentreID") {
      setPayload({
        ...payload,
        [name]: value,
        BookingCentreName: label,
      });
    } else {
      setPayload({
        ...payload,
        [name]: value,
        OutSourceLabName: label,
      });
    }
  };

  // console.log(payload);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
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
        Department.unshift({ label: "Select", value: "0" });
        setDepartment(Department);
      })
      .catch((err) => console.log(err));
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

  const handleSearch = () => {
    const generatedError = validationFields();
    if (generatedError === "") {
      setLoad(true);
      axios
        .post("/api/v1/OutSourceLabRateListMaster/BindItemRateListTable", {
          ...payload,
        })
        .then((res) => {
          const data = res?.data?.message;
          const val = data?.map((ele) => {
            return {
              ...ele,
              OutSourceRate: 0,
            };
          });
          setTableData(val);
          setLoad(false);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoad(false);
        });
    } else {
      toast.error(generatedError);
    }
  };

  const handleSave = () => {
    setLoad(true);
    const data = tableData.filter((ele) => ele?.isDefault == "1");
    const newPayload = data.map((ele) => {
      return {
        ...ele,
        OutSourceLabID: payload?.OutSourceLabID,
        BookingCentreID: payload?.BookingCentreID,
        // OutSourceRate:ele?.OutSourceRate
      };
    });
    if (data?.length > 0) {
      axios
        .post("/api/v1/OutSourceLabRateListMaster/SaveRateList", {
          OutSourceData: newPayload,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setLoad(false);
          setPayload({
            OutSourceLabID: "",
            OutSourceLabName: "",
            BookingCentreID: "",
            BookingCentreName: "",
            DepartmentID: "",
            InvestigationID: "0",
          });
          setTableData("");
        })
        .catch((err) => {
          toast.error(
            err?.data?.message ? err?.data?.message : "Something Went Wrong"
          );
          setLoad(false);
        });
    } else {
      toast.error("please choose one test");
    }
  };

  const handleRemove = () => {
    setLoad(true);
    const data = tableData.filter((ele) => ele?.isDefault == "1");
    const newPayload = data.map((ele) => {
      return {
        ...ele,
        OutSourceLabID: payload?.OutSourceLabID,
        BookingCentreID: ele?.CentreID,
        // OutSourceRate:ele?.OutSourceRate
      };
    });
    axios
      .post("/api/v1/OutSourceLabRateListMaster/UpdateRateList", {
        OutSourceData: newPayload,
        // Type: payload?.Type,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setLoad(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
        setLoad(false);
      });
  };

  const BindTestData = () => {
    axios
      .post("/api/v1/OutSourceTestToOtherLab/GetInvestigationsWithDepartment", {
        DepartmentID: payload?.DepartmentID,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => {
          return {
            label: ele?.TestName,
            value: ele?.InvestigationID,
          };
        });
        val.unshift({ label: "Investigation", value: "0" });
        setTestSuggestion(val);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleChangeNew = (e, index) => {
    const { name, value, type, checked } = e.target;
    if (index >= 0) {
      let data = [...tableData];
      data[index][name] = type === "checkbox" ? (checked ? "1" : "0") : value;
      setTableData(data);
    } else {
      let data = tableData.map((ele) => {
        return {
          ...ele,
          [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
        };
      });
      setTableData(data);
    }
  };

  useEffect(() => {
    BindTestData();
  }, [payload?.DepartmentID]);

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

  const ShowBtn = () => {
    const val = tableData.filter((ele) => ele?.isDefault == "1");
    return val.length > 0 ? true : false;
  };

  useEffect(() => {
    getAccessCentres();
    getDepartment();
    getOutSourceLabData();
  }, []);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("OutSource Test Master")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("From Centre")}:</label>
            <div className="col-sm-2">
              <SelectBox
                options={CentreData}
                name="BookingCentreID"
                selectedValue={payload?.BookingCentreID}
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-1">{t("To OutSource Lab")}:</label>
            <div className="col-sm-2">
              <SelectBox
                name="OutSourceLabID"
                options={OutSourceLabData}
                selectedValue={payload?.OutSourceLabID}
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
            <label className="col-sm-1">{t("Investigation")}:</label>
            <div className="col-sm-2">
              <SelectBox
                name="InvestigationID"
                options={TestSuggestion}
                selectedValue={payload?.InvestigationID}
                onChange={handleSelectChange}
              />
            </div>
          </div>
          <div className="row">
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
        <div className="box">
          <div
            className="box-body divResult table-responsive boottable"
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
                   t("Centre") ,
                   t("Lab Name") ,
                   t("Investigation") ,
                   t("Rate") ,
                   t("TAT Type"),
                   t("TAT"),
                   t("Attachement Required") ,
                   t("Other Test") ,
                   t("Select") ,
                  ].map((ele, index) => (
                    <th key={index}>{ele}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index}>
                    <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                    <td data-title={t("Centre")}>{item?.CentreName}&nbsp;</td>
                    <td data-title={t("Lab Name")}>{item?.LabName}&nbsp;</td>
                    <td data-title={t("Investigation")}>
                      {item?.Investigation}&nbsp;
                    </td>
                    <td data-title={t("Rate")}>{item?.OutSourceRate}&nbsp;</td>
                    <td data-title={t("TAT Type")}>{item?.TATType}&nbsp;</td>
                    <td data-title={t("TAT")}>{item?.TAT}&nbsp;</td>
                    <td data-title={t("Attachement Required")}>
                      {
                        <Input
                          type="checkbox"
                          name="IsFileRequired"
                          checked={item?.IsFileRequired == "1" ? true : false}
                          onChange={(e) => handleChangeNew(e, index)}
                        />
                      }
                    </td>
                    <td data-title={t("Other Test")}>{item?.othercount}&nbsp;</td>
                    <td data-title={t("Select")}>
                      {
                        <div>
                          <Input
                            type="checkbox"
                            name="isDefault"
                            checked={item?.isDefault == "1" ? true : false}
                            onChange={(e) => handleChangeNew(e, index)}
                          />
                        </div>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {load ? (
            <Loading />
          ) : (
            ShowBtn() && (
              <>
                <div className="box-footer">
                  <div className="row">
                    <div className="col-sm-1">
                      <button
                        className="btn btn-block btn-success btn-sm"
                        onClick={handleSave}
                      >
                {t("Save")}  
                      </button>
                    </div>

                    <div className="col-sm-1">
                      <button
                        className="btn btn-block btn-danger btn-sm"
                        onClick={(id) => handleRemove(id)}
                      >
                {t("Remove")}  
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

export default OutSourceTestMaster;
