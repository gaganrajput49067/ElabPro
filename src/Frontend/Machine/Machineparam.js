import React, { useEffect, useState } from "react";
import Loading from "../util/Loading";
import Input from "../../ChildComponents/Input";
import axios from "axios";
// import MahineparamModal from "../Frontend/util/MahineparamModal";
import { toast } from "react-toastify";
import MahineparamModal from "../util/MahineparamModal";

import { useTranslation } from "react-i18next";
function Machineparam() {
  const [Machine, setMachine] = useState([]);
  const [machineIdLoad, setmachineIdLoad] = useState(false);
  const [loadTableData, setLoadTableData] = useState(-1);
  const [loadFieldValue, setLoadFieldValue] = useState(-1);
  const [loadDelete, setLoadDelete] = useState(-1);
  const [show, setShow] = useState({
    modal: false,
    type: "Add",
  });
  const [FieldValue, setFieldValue] = useState({
    Machine_ParamID: "",
    LabObservation_ID: "",
  });
  const [active, setActive] = useState({});
  const [getTestBind, setGetTestBind] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [LabTableData, setLabTableData] = useState([]);
  const { t, i18n } = useTranslation();
  const getMachine = () => {
    setmachineIdLoad(true);
    axios
      .get("/api/v1/MachineGroup/getMachineName")
      .then((res) => {
        let data = res.data.message;
        let Machine = data.map((ele) => {
          return {
            value: ele.MachineID,
            label: ele.Machinename,
          };
        });
        setmachineIdLoad(false);
        setMachine(Machine);
      })
      .catch((err) => {
        setmachineIdLoad(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const getTestData = () => {
    axios
      .get("/api/v1/MachineGroup/getMachineinfo")
      .then((res) => {
        setGetTestBind(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const handleClick = (e) => {
    const { value } = e.target;
    setFieldValue({ ...FieldValue, LabObservation_ID: value });
  };

  const onclickmachinedata = (id, setBlank) => {
    setActive(id);
    setLoadTableData(id?.value);
    axios
      .post("/api/v1/MachineGroup/onclickmachinedata", {
        MachineId: id?.value,
      })
      .then((res) => {
        setTableData(res?.data?.message);
        if (!setBlank) {
          setFieldValue({
            Machine_ParamID: "",
            LabObservation_ID: "",
          });
        }
        setLoadTableData(-1);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoadTableData(-1);
      });
  };

  const bindlabobservationdata = (id) => {
    setFieldValue({ ...FieldValue, Machine_ParamID: id });
    setLoadFieldValue(id);
    axios
      .post("/api/v1/MachineGroup/bindlabobservationdata", {
        Machine_ParamID: id,
      })
      .then((res) => {
        setLabTableData(res?.data?.message);
        setLoadFieldValue(-1);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const SaveObservationData = () => {
    axios
      .post("/api/v1/MachineGroup/SaveObservationData", FieldValue)
      .then((res) => {
        toast.success(res?.data?.message);
        bindlabobservationdata(FieldValue?.Machine_ParamID);
        setFieldValue({ ...FieldValue, LabObservation_ID: "" });
        onclickmachinedata(active, true);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const DeleteLabobservationData = (id) => {
    setLoadDelete(id?.LabObservation_ID);
    axios
      .post("/api/v1/MachineGroup/DeleteLabobservationData", {
        LabObservation_ID: id?.LabObservation_ID,
        Machine_ParamID: FieldValue?.Machine_ParamID,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setLoadDelete(-1);
        bindlabobservationdata(FieldValue?.Machine_ParamID);
        onclickmachinedata(active, true);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoadDelete(-1);
      });
  };

  useEffect(() => {
    getMachine();
    getTestData();
  }, []);
  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Machine Param")}</h3>
        </div>
      </div>
      {show?.modal && (
        <MahineparamModal
          show={show?.modal}
          data={{
            Machineparam: active?.label,
            Machine_ParamID:
              show?.type === "Add" ? "" : FieldValue?.Machine_ParamID,
            ID: active?.value,
          }}
          handleClose={() =>
            setShow({
              modal: false,
              type: "",
            })
          }
        />
      )}
      <div className="row">
        <div className="col-sm-3">
          <div className="box">
            <div
              className="box-body table-responsive divResult boottable"
              id="no-more-tables"
            >
              <div className="row">
                {machineIdLoad ? (
                  <Loading />
                ) : (
                  <table
                    className="table table-bordered table-hover table-striped tbRecord"
                    cellPadding="{0}"
                    cellSpacing="{0}"
                  >
                    <thead className="cf">
                      <tr className="bg-primary">
                        <th>{t("Machine ID")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Machine.map((ele, index) => (
                        <tr
                          key={index}
                          className={`${
                            active?.value === ele?.value && "bg-primary"
                          }`}
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            onclickmachinedata(ele);
                          }}
                        >
                          <td data-title={t("Machine ID")}>
                            {loadTableData === ele?.value ? (
                              <Loading />
                            ) : (
                              ele?.label
                            )}
                          </td>
                        </tr>
                      ))}
                      <tr></tr>
                    </tbody>
                  </table>
                )}
                <div></div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-sm-9">
          {tableData?.length > 0 && (
            <div className="box">
              <div
                className="box-body table-responsive divResult boottable"
                id="no-more-tables"
              >
                <div className="row">
                  <table
                    className="table table-bordered  table-hover table-striped tbRecord"
                    cellPadding="{0}"
                    cellSpacing="{0}"
                  >
                    <thead className="cf">
                      <tr>
                        {[
                          t("Machine_ParamID"),
                          t("MACHINEID"),
                          t("Machine_Param"),
                          t("AssayNo"),
                          t("RoundUpTo"),
                          t("IsOrderable"),
                          t("Decimalcalc"),
                          t("Test"),
                        ].map((ele, index) => (
                          <th key={index}>{ele}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData?.map((ele, index) => (
                        <tr key={index}>
                          <td
                            data-title={t("Machine_ParamID")}
                            className="text-info"
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                            onClick={() => {
                              bindlabobservationdata(ele?.Machine_ParamID);
                            }}
                          >
                            {loadFieldValue === ele?.Machine_ParamID ? (
                              <Loading />
                            ) : (
                              ele?.Machine_ParamID
                            )}
                          </td>
                          <td data-title={t("MACHINEID")}>{ele?.MACHINEID}&nbsp;</td>
                          <td data-title={t("Machine_Param")}>
                            {ele?.MachineParam}&nbsp;
                          </td>
                          <td data-title={ t("AssayNo")}>{ele?.AssayNo}&nbsp;</td>
                          <td data-title={t("RoundUpTo")}>{ele?.RoundUpTo}&nbsp;</td>
                          <td data-title={t("IsOrderable")}>
                            {ele?.IsOrderable}&nbsp;
                          </td>
                          <td data-title={t("Decimalcalc")}>
                            {ele?.Decimalcalc}&nbsp;
                          </td>
                          <td data-title={t("Test")}>
                          {ele?.Test ? ele?.Test : "-"}&nbsp;
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="col-sm-1">
                    <button
                      className="btn btn-block btn-success btn-sm"
                      onClick={() => {
                        setShow({
                          modal: true,
                          type: "Add",
                        });
                      }}
                    >
                      {t("Add Param")}
                    </button>
                  </div>

                  <div className="col-sm-2">
                    {FieldValue?.Machine_ParamID && (
                      <button
                        className="btn btn-block btn-success btn-sm"
                        onClick={() => {
                          setShow({
                            modal: true,
                            type: "Modify",
                          });
                        }}
                      >
                        {t("Modify Param")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          {FieldValue?.Machine_ParamID && (
            <div className="box form-horizontal">
              <div className="box-header with-border">
                <h3 className="box-title">{t("Param Mapping")}</h3>
              </div>

              <div className="box-body">
                <div className="row">
                  <div className="col-sm-2 col-md-2">
                    <Input
                      type="text"
                      className="form-control input-sm"
                      value={FieldValue?.Machine_ParamID}
                    />
                  </div>

                  <div className="col-sm-2 col-md-2">
                    <select
                      className="form-control input-sm"
                      value={FieldValue?.LabObservation_ID}
                      onChange={handleClick}
                    >
                      <option hidden>--select--</option>
                      {getTestBind?.map((ele, index) => (
                        <option value={ele?.LabObservation_ID} key={index}>
                          {ele?.Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div
                    className="box-body table-responsive divResult boottable"
                    id="no-more-tables"
                  >
                    <div className="row">
                      <div className="col-sm-8">
                        <table
                          className="table table-bordered table-hover table-striped tbRecord"
                          cellPadding="{0}"
                          cellSpacing="{0}"
                        >
                          <thead className="cf">
                            <tr>
                              {[t("LabObservation_ID"), t("Test Name")].map(
                                (ele, index) => (
                                  <th key={index}>{ele}</th>
                                )
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {LabTableData?.map((ele, index) => (
                              <tr key={index}>
                                <td
                                  data-title={t("LabObservation_ID")}
                                  className="text-info"
                                  style={{
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                  }}
                                  onClick={() => {
                                    DeleteLabobservationData(ele);
                                  }}
                                >
                                  {loadDelete === ele?.LabObservation_ID ? (
                                    <Loading />
                                  ) : (
                                    ele?.LabObservation_ID
                                  )}
                                </td>
                                <td data-title={t("Test Name")}>{ele?.Name}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="col-sm-1">
                      <button
                        className="btn btn-block btn-success btn-sm"
                        onClick={SaveObservationData}
                      >
                        {t("Add")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Machineparam;
