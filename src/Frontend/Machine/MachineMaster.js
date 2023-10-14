import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { validationForMachineMaster } from "../../ChildComponents/validations";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import Loading from "../util/Loading";

import { useTranslation } from "react-i18next";
const MachineMaster = () => {
  const [centreId, setCentreId] = useState([]);
  const [GlobalMachineID, setGlobalMachineID] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [err, setErr] = useState({});
  const [payload, setPayload] = useState({
    MachineID: "",
    MachineName: "",
    CentreID: "",
    GlobalMachineID: "",
    BatchRequest: "",
  });
  const { t, i18n } = useTranslation();

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value, ItemValue: "" });
    setErr({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const getGlobalMachineGroup = () => {
    axios
      .get("/api/v1/MachineGroup/macGroup")
      .then((res) => {
        let data = res.data.message;
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.GlobalMachineID,
            label: ele.GlobalMachineName,
          };
        });
        CentreDataValue.unshift({ label: "Global MachineID", value: "" });
        setGlobalMachineID(CentreDataValue);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  const getAccessCentres = (state, centre, setCentre) => {
    axios
      .get("/api/v1/Centre/getAccessCentres")
      .then((res) => {
        let data = res.data.message;
        console.log(data);
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        CentreDataValue.unshift({ label: "All Centre", value: "" });
        state(CentreDataValue);
        if (centre) {
          setCentre({ ...centre, CentreID: CentreDataValue[0]?.value });
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.sessionStorage.clear();
          window.location.href = "/login";
        }
      });
  };

  const handleSave = (url) => {
    let generatedError = validationForMachineMaster(payload);
    if (generatedError === "") {
      setLoading(true);
      axios
        .post(url, payload)
        .then((res) => {
          toast.success(res?.data?.message);
          setPayload({
            MachineID: "",
            MachineName: "",
            CentreID: "",
            GlobalMachineID: "",
            BatchRequest: "",
          });
          setLoading(false);
          fetch();
          setIsUpdate(false);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          );
          setLoading(false);
        });
    } else {
      setErr(generatedError);
    }
  };

  const fetch = () => {
    setLoading(true);
    axios
      .get("/api/v1/MachineGroup/LoadMachineMasterData")
      .then((res) => {
        setTableData(res?.data?.message);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
        setLoading(false);
      });
  };

  const BindData = (data) => {
    setIsUpdate(true);
    setPayload({
      MachineID: data?.MachineID,
      MachineName: data?.MachineName,
      CentreID: data?.CentreID,
      GlobalMachineID: data?.GlobalMachineID,
      BatchRequest: data?.BatchRequest,
    });
  };

  useEffect(() => {
    getAccessCentres(setCentreId);
    getGlobalMachineGroup(setGlobalMachineID);
    fetch();
  }, []);
  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h1 className="box-title">{t("Save Machine Master")}</h1>
          {/* <Link className="list_item" to="/CreateFieldBoyMaster">
            Back To List
          </Link> */}
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("MachineID")}:</label>
            <div className="col-sm-2 col-md-2 form-group mt-4">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                placeholder={t("MachineID")}
                name="MachineID"
                value={payload?.MachineID}
                onChange={handleChange}
                max={10}
                required
              />
              {<div className="golbal-Error">{err?.MachineID}</div>}
            </div>
            <label className="col-sm-1">{t("Machine Name")}:</label>
            <div className="col-sm-2 col-md-2 form-group mt-4">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                placeholder={t("Machine Name")}
                type="text"
                name="MachineName"
                value={payload?.MachineName}
                onChange={handleChange}
                max={35}
                required
              />
              {<div className="golbal-Error">{err?.MachineName}</div>}
            </div>
            <label className="col-sm-1">{t("CentreID")}:</label>
            <div className="col-sm-2 col-md-2 form-group mt-4">
              <SelectBox
                name="CentreID"
                options={centreId}
                selectedValue={payload?.CentreID}
                onChange={handleSelectChange}
              />
              {payload.CentreID === "" && (
                <div className="golbal-Error">{err?.CentreID}</div>
              )}
            </div>
            <label className="col-sm-1">{t("GlobalMachineID")}:</label>
            <div className="col-sm-2 col-md-2 form-group mt-4">
              <SelectBox
                name="GlobalMachineID"
                options={GlobalMachineID}
                selectedValue={payload?.GlobalMachineID}
                onChange={handleSelectChange}
              />
              {payload.GlobalMachineID === "" && (
                <div className="golbal-Error">{err?.GlobalMachineID}</div>
              )}
            </div>
            </div>
            <div className="row">
            <div className="col-sm-1 d-flex">
              <Input
                type="checkbox"
                name="BatchRequest"
                checked={payload?.BatchRequest == "1" ? true : false}
                onChange={handleChange}
              />
              <label className="labels">{t("Batch Request")}</label>
            </div>
            <div className="col-sm-1">
              {loading ? (
                <Loading />
              ) : (
                <>
                  {isUpdate ? (
                    <button
                      type="button"
                      className="btn btn-block btn-success btn-sm"
                      id="btnSave"
                      onClick={() =>
                        handleSave("/api/v1/MachineGroup/UpdateMachineData")
                      }
                    >
                      {t("Update")}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-block btn-success btn-sm"
                      id="btnSave"
                      onClick={() =>
                        handleSave("/api/v1/MachineGroup/InsertMachineData")
                      }
                    >
                      {t("Save")}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <>
          {tableData.length > 0 && (
            <div className="box">
              <div
                className="box-body  divResult boottable"
                id="no-more-tables"
              >
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf">
                    <tr>
                      <th>{t("S.No")}</th>
                      <th>{t("MachineID")}</th>
                      <th>{t("Machine Name")}</th>
                      <th>{t("CentreID")}</th>
                      <th>{t("Batch Request")}</th>
                      <th>{t("GlobalMachineID")}</th>
                      <th>{t("Select")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((ele, index) => (
                      <tr key={index}>
                        <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                        <td data-title={t("MachineID")}>{ele?.MachineID}&nbsp;</td>
                        <td data-title={t("Machine Name")}>{ele?.MachineName}&nbsp;</td>
                        <td data-title={t("CentreID")}>{ele?.Centre}&nbsp;</td>
                        <td data-title={t("Batch Request")}>
                          {ele?.BatchRequest === 1 ? t("Yes") : t("No")}&nbsp;
                        </td>
                        <td data-title={t("GlobalMachineID")}>
                          {ele?.GlobalMachineName}&nbsp;
                        </td>
                        <td
                          data-title={t("Action")}
                          className="text-info"
                          style={{
                            textDecoration: "underline",
                            cursor: "pointer",
                          }}
                          onClick={() => BindData(ele)}
                        >
                          {t("Select")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default MachineMaster;
