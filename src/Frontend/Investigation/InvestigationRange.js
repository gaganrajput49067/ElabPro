import React from "react";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import axios from "axios";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Table } from "react-bootstrap";
import { InestigationRange, RoundOff } from "../../ChildComponents/Constants";
import { selectedValueCheck } from "../../Frontend/util/Commonservices";
import { toast } from "react-toastify";
import Loading from "../../Frontend/util/Loading";
import { number } from "../../Frontend/util/Commonservices/number";
import { useTranslation } from "react-i18next";
const InvestigationRange = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [CentreData, setCentreData] = useState([]);
  const [Machine, setMachine] = useState([]);
  const [Gender, setGender] = useState([]);
  const [RangeType, setRangeType] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [load, setLoad] = useState(false);
  const [valid, setValid] = useState({});

  const [payload, setPayload] = useState({
    CentreID: "",
    Gender: "Male",
    MacID: "",
    RangeType: "",
    InvestigationID: state?.InvestigationID,
    MethodName: "",
    LabObservationID: state?.InvestigationID,
    SaveToBothGender: 0,
    RoundOff: "",
    AbNormal: 0,
    ForAllCentre: 0,
  });
  // i18n start 
  const { t } = useTranslation();
  useEffect(() => {
    if (CentreData.length > 0) {
      setPayload({
        ...payload,
        CentreID: CentreData[0]?.value ? CentreData[0]?.value : "",
        // Gender: Gender[0]?.value ? Gender[0]?.value : "",
        MacID: Machine[0]?.value ? Machine[0]?.value : "",
        RangeType: RangeType[0]?.value ? RangeType[0]?.value : "",
      });
    }
  }, [CentreData, Gender, Machine, RangeType]);

  const handleDelete = (ind) => {
    const data = tableData?.filter((ele, index) => index !== ind);
    setTableData(data);
    toast.success("Removed Successfully");
  };

  const fetch = () => {
    axios
      .post("/api/v1/Investigations/GetRangeData", {
        ...payload,
        Gender: payload?.Gender === "TransGender" ? "Male" : payload?.Gender,
      })
      .then((res) => {
        if (res?.data?.message.length === 0) {
          toast.success("No Data Found");
        } else {
          setPayload({
            ...payload,
            LabObservationID: res?.data?.message[0]?.LabObservationID,
          });
        }

        const data = res?.data?.message;
        let val = data.map((ele) => {
          return {
            ...ele,
            ReflexMin: ele?.reflexmin,
            ReflexMax: ele?.reflexmax,
          };
        });

        setTableData(
          res?.data?.message.length > 0
            ? val
            : [
                {
                  ...InestigationRange,
                  InvestigationID: payload?.InvestigationID,
                  LabObservationID: payload?.InvestigationID,
                  Gender: payload?.Gender,
                  MacID: payload?.MacID,
                  RangeType: payload?.RangeType,
                  CentreID: payload?.CentreID,
                  FromAge: "0",
                },
              ]
        );
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  console.log(payload);

  useEffect(() => {
    if (
      payload?.CentreID !== "" &&
      payload?.Gender !== "" &&
      payload?.MacID !== "" &&
      payload?.RangeType !== ""
    ) {
      fetch();
    }
  }, [payload?.CentreID, payload?.Gender, payload?.MacID, payload?.RangeType]);

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
        setCentreData(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };
  const getMachine = () => {
    axios
      .get("/api/v1/Investigations/BindMachineList")
      .then((res) => {
        let data = res.data.message;
        let Machine = data.map((ele) => {
          return {
            value: ele.MachineId,
            label: ele.MachineName,
          };
        });
        setMachine(Machine);
      })
      .catch((err) => console.log(err));
  };
  const getRangeType = () => {
    axios
      .post("/api/v1/Global/getGlobalData",{
        Type:"RangeType"
      })
      .then((res) => {
        let data = res.data.message;
        let RangeType = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        setRangeType(RangeType);
      })
      .catch((err) => console.log(err));
  };
  const getDropDownData = (name) => {
    axios
      .post("/api/v1/Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        switch (name) {
          case "Gender":
            setGender(value);
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const Match = () => {
    let match = false;
    let FieldError = {
      index: "",
      minValue: "",
      maxValue: "",
    };

    for (var i = 0; i < tableData.length; i++) {
      if (
        parseFloat(tableData[i].ToAge) <= parseFloat(tableData[i].FromAge) ||
        tableData[i].ToAge === ""
      ) {
        match = true;
        FieldError = { index: i, minValue: "ToAge", maxValue: "" };
        break;
      } else if (
        parseFloat(
          tableData[i].MaxReading === "" ? 0 : tableData[i].MaxReading
        ) <=
          parseFloat(
            tableData[i].MinReading === "" ? 0 : tableData[i].MinReading
          ) ||
        tableData[i].MaxReading === tableData[i].MinReading
      ) {
        match = true;
        FieldError = {
          index: i,
          minValue: "MinReading",
          maxValue: "MaxReading",
        };
        break;
      } else if (
        parseFloat(
          ["", 0].includes(tableData[i].MaxCritical)
            ? 1
            : tableData[i].MaxCritical
        ) <=
        parseFloat(
          ["", 0].includes(tableData[i].MinCritical)
            ? 0
            : tableData[i].MinCritical
        )
      ) {
        match = true;
        FieldError = {
          index: i,
          minValue: "MinCritical",
          maxValue: "MaxCritical",
        };
        break;
      } else if (
        parseFloat(
          ["", 0].includes(tableData[i].AutoApprovedMax)
            ? 1
            : tableData[i].AutoApprovedMax
        ) <=
        parseFloat(
          ["", 0].includes(tableData[i].AutoApprovedMin)
            ? 0
            : tableData[i].AutoApprovedMin
        )
      ) {
        match = true;
        FieldError = {
          index: i,
          minValue: "AutoApprovedMin",
          maxValue: "AutoApprovedMax",
        };
        break;
      }
    }
    setValid(FieldError);
    return match;
  };

  const handleAddRow = (data) => {
    const match = Match();
    if (!match) {
      setTableData([
        ...tableData,
        {
          ...InestigationRange,
          InvestigationID: payload?.InvestigationID,
          LabObservationID: payload?.InvestigationID,
          Gender: payload?.Gender,
          MacID: payload?.MacID,
          RangeType: payload?.RangeType,
          CentreID: payload?.CentreID,
          FromAge: Number(data?.ToAge) + 1,
        },
      ]);
    } else {
      toast.error("please Enter Valid Values");
    }
  };

  const handleChangeTableData = (e, index) => {
    const { name, value } = e.target;
    const data = [...tableData];
    data[index][name] = value;
    setTableData(data);
  };

  const handleSubmit = () => {
    const valid = Match();
    if (valid) {
      toast.error("please Enter Valid Values");
    } else {
      setLoad(true);
      axios
        .post("/api/v1/Investigations/SaveRanges", {
          CentreID: payload?.CentreID,
          Gender: payload?.Gender === "TransGender" ? "Male" : payload.Gender,
          AbNormal: payload?.AbNormal,
          ForAllCentre: payload?.ForAllCentre,
          InvestigationID: payload?.InvestigationID,
          MacID: payload?.MacID,
          MethodName: payload?.MethodName,
          SaveToBothGender: payload?.SaveToBothGender,
          labobservation_rangeVM: tableData,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setLoad(false);
          fetch();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoad(false);
        });
    }
  };

  useEffect(() => {
    getAccessCentres();
    getMachine();
    getRangeType();
    getDropDownData("Gender");
  }, []);

  return (
    <div className="box box-success">
      <div className="box-header with-border">
        {/* {state?.other?.pageName ? state?.other?.pageName : "Create"} */}
        <h1 className="box-title">{t("Create")}</h1>
        {/* <span className="m-0 font-weight-bold text-primary"> Create</span> */}
      </div>
      <div className="box-body">
        <div className="row">
          <label className="col-sm-1" htmlFor="inputEmail3">
            {t("Centre Name")}:
          </label>
          <div className="col-sm-2">
            <SelectBox
              options={CentreData}
              onChange={handleSelectChange}
              name="CentreID"
              selectedValue={payload?.CentreID}
            />
          </div>
          <label className="col-sm-1" htmlFor="inputEmail3">
            {t("Machine")}:
          </label>

          <div className="col-sm-2 form-group">
            <SelectBox
              options={Machine}
              onChange={handleSelectChange}
              name="MacID"
              selectedValue={payload?.MacID}
            />
          </div>
          <label className="col-sm-1" htmlFor="inputEmail3">
            {t("Gender")}:
          </label>

          <div className="col-sm-2 form-group">
            <SelectBox
              options={Gender.filter((ele) => ele.value !== "Both")}
              onChange={handleSelectChange}
              name="Gender"
              selectedValue={payload?.Gender}
            />
          </div>
          <label className="col-sm-1" htmlFor="inputEmail3">
            {t("RangeType")}:
          </label>

          <div className="col-sm-2 form-group">
            <SelectBox
              options={RangeType}
              onChange={handleSelectChange}
              name="RangeType"
              selectedValue={payload?.RangeType}
            />
          </div>
        </div>
        <div className="row">
          <label className="col-sm-1" htmlFor="inputEmail3">
            {t("MethodName")}:
          </label>

          <div className="col-sm-2 form-group">
            <Input
              className="form-control ui-autocomplete-input input-sm"
              placeholder={t("Method Name")}
              name="MethodName"
              value={payload?.MethodName}
              type="text"
              onChange={handleChange}
            />
          </div>
          <label className="col-sm-1" htmlFor="inputEmail3">
            {t("RoundOff")}:
          </label>

          <div className="col-sm-2">
            <SelectBox
              options={RoundOff}
              name="RoundOff"
              onChange={handleSelectChange}
              selectedValue={payload?.RoundOff}
            />
          </div>

          <div className="col-sm-2">
            <Input
              name="SaveToBothGender"
              type="checkbox"
              checked={payload?.SaveToBothGender ? 1 : 0}
              onChange={handleChange}
            />
            <label>{t("SaveToBothGender")}</label>
          </div>

          <div className="col-sm-2">
            <Input
              name="AbNormal"
              type="checkbox"
              checked={payload?.AbNormal ? 1 : 0}
              onChange={handleChange}
            />
            <label>AbNormal</label>
          </div>

          <div className="col-sm-2">
            <Input
              name="ForAllCentre"
              type="checkbox"
              checked={payload?.ForAllCentre ? 1 : 0}
              onChange={handleChange}
            />
            <label>For All Centre</label>
          </div>
        </div>
        <div className="box-body divResult boottable" id="no-more-tables">
          <div className="px-2">
            <table
              className="table table-bordered table-hover table-responsive table-striped tbRecord"
              cellPadding="{0}"
              cellSpacing="{0}"
            >
              <thead className="cf">
                <tr>
                  <th>{t("S.No")}</th>
                  <th>{t("Delete")}</th>
                  <th>{t("FromAge(days)")}</th>
                  <th>{t("ToAge(days)")}</th>
                  <th>{t("MinReading")}</th>
                  <th>{t("MaxReading")}</th>
                  <th>{t("MinCritical")}</th>
                  <th>{t("Maxcritical")}</th>
                  <th>{t("AutoAppMin")}</th>
                  <th>{t("AutoAppMax")}</th>
                  <th>{t("Unit")}</th>
                  <th>{t("DisplayReading")}</th>
                  <th>{t("DefaultReading")}</th>
                  <th>{t("AbnormalReading")}</th>
                  <th>{t("AddRow")}</th>
                </tr>
              </thead>
              <tbody>
                {tableData?.map((data, index) => (
                  <tr key={index}>
                    <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                    <td data-title={t("Delete")}>
                      {index + 1 === tableData?.length && index !== 0 && (
                        <button
                          className="form-control Input-sm btn-danger"
                          name="disableData"
                          onClick={() => handleDelete(index)}
                        >
                          X
                        </button>
                      )}
                      &nbsp;
                    </td>
                    <td data-title={t("FromAge(days)")}>
                      <Input
                        type="number"
                        className="form-control ui-autocomplete-input input-sm"
                        value={data?.FromAge}
                        readOnly
                        name="FromAge"
                        onInput={(e) => number(e, 5)}
                        onChange={(e) => handleChangeTableData(e, index)}
                      />
                    </td>
                    <td data-title={t("ToAge(days)")}>
                      <Input
                        type="number"
                        className={`form-control ui-autocomplete-input input-sm  ${
                          valid?.index === index && valid?.minValue === "ToAge"
                            ? "error-occured-input"
                            : ""
                        }`}
                        readOnly={
                          index + 1 === tableData?.length ? false : true
                        }
                        value={data?.ToAge}
                        onInput={(e) => number(e, 5)}
                        name="ToAge"
                        onChange={(e) => handleChangeTableData(e, index)}
                      />
                    </td>
                    <td data-title={t("MinReading")}>
                      <Input
                        type="number"
                        className={`form-control ui-autocomplete-input input-sm  ${
                          valid?.index === index &&
                          valid?.minValue === "MinReading"
                            ? "error-occured-input"
                            : ""
                        }`}
                        value={data?.MinReading}
                        onInput={(e) => number(e, 4)}
                        name="MinReading"
                        onChange={(e) => handleChangeTableData(e, index)}
                      />
                    </td>
                    <td data-title={t("MaxReading")}>
                      <Input
                        type="number"
                        className={`form-control ui-autocomplete-input input-sm  ${
                          valid?.index === index &&
                          valid?.maxValue === "MaxReading"
                            ? "error-occured-input"
                            : ""
                        }`}
                        value={data?.MaxReading}
                        onInput={(e) => number(e, 4)}
                        name="MaxReading"
                        onChange={(e) => handleChangeTableData(e, index)}
                      />
                    </td>
                    <td data-title={t("MinCritical")}>
                      <Input
                        type="number"
                        className={`form-control ui-autocomplete-input input-sm  ${
                          valid?.index === index &&
                          valid?.minValue === "MinCritical"
                            ? "error-occured-input"
                            : ""
                        }`}
                        value={data?.MinCritical}
                        onInput={(e) => number(e, 4)}
                        name="MinCritical"
                        onChange={(e) => handleChangeTableData(e, index)}
                      />
                    </td>
                    <td data-title={t("MaxCritical")}>
                      <Input
                        type="number"
                        className={`form-control ui-autocomplete-input input-sm  ${
                          valid?.index === index &&
                          valid?.maxValue === "MaxCritical"
                            ? "error-occured-input"
                            : ""
                        }`}
                        value={data?.MaxCritical}
                        onInput={(e) => number(e, 4)}
                        name="MaxCritical"
                        onChange={(e) => handleChangeTableData(e, index)}
                      />
                    </td>
                    <td data-title={t("AutoAppMin")}>
                      <Input
                        type="number"
                        className={`form-control ui-autocomplete-input input-sm  ${
                          valid?.index === index &&
                          valid?.minValue === "AutoApprovedMin"
                            ? "error-occured-input"
                            : ""
                        }`}
                        value={data?.AutoApprovedMin}
                        onInput={(e) => number(e, 4)}
                        name="AutoApprovedMin"
                        onChange={(e) => handleChangeTableData(e, index)}
                      />
                    </td>
                    <td data-title={t("AutoAppMax")}>
                      <Input
                        type="number"
                        className={`form-control ui-autocomplete-input input-sm  ${
                          valid?.index === index &&
                          valid?.maxValue === "AutoApprovedMax"
                            ? "error-occured-input"
                            : ""
                        }`}
                        value={data?.AutoApprovedMax}
                        onInput={(e) => number(e, 4)}
                        name="AutoApprovedMax"
                        onChange={(e) => handleChangeTableData(e, index)}
                      />
                    </td>
                    <td data-title={t("Unit")}>
                      <Input
                        type="text"
                        className="form-control ui-autocomplete-input input-sm"
                        value={data?.ReadingFormat}
                        name="ReadingFormat"
                        onChange={(e) => handleChangeTableData(e, index)}
                      />
                    </td>
                    <td data-title={t("DisplayReading")}>
                      <textarea
                        type="text"
                        className="form-control ui-autocomplete-input input-sm"
                        value={data?.DisplayReading}
                        name="DisplayReading"
                        onChange={(e) => handleChangeTableData(e, index)}
                      />
                    </td>
                    <td data-title={t("DefaultReading")}>
                      <Input
                        type="number"
                        className="form-control ui-autocomplete-input input-sm "
                        value={data?.DefaultReading}
                        name="DefaultReading"
                        onChange={(e) => handleChangeTableData(e, index)}
                      />
                    </td>
                    <td data-title={t("AbnormalReading")}>
                      <Input
                        type="number"
                        className="form-control ui-autocomplete-input input-sm"
                        value={data?.AbnormalValue}
                        name="AbnormalValue"
                        onChange={(e) => handleChangeTableData(e, index)}
                      />
                    </td>
                    <td data-title={t("AddRow")}>
                      {index + 1 === tableData?.length && (
                        <button
                          className="btn btn-info btn-block btn-sm"
                          onClick={() => handleAddRow(data)}
                        >
                          AddRow
                        </button>
                      )}
                      &nbsp;
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row">
            {load ? (
              <Loading />
            ) : (
              <div className="col-sm-1">
                <button
                  type="submit"
                  className="btn btn-block btn-success btn-sm"
                  onClick={handleSubmit}
                >
                  {t("Save")}
                </button>
              </div>
            )}
            <div className="col-sm-1">
              <button
                type="submit"
                className="btn btn-block btn-primary btn-sm"
                onClick={() => navigate(-1)}
              >
                {t("Back")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationRange;
