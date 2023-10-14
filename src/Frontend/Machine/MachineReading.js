import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { SelectBox } from "../../ChildComponents/SelectBox";
import Input from "../../ChildComponents/Input";
import Pagination from "../util/Commonservices/Pagination";
import Loading from "../util/Loading";
import DatePicker from "../Components/DatePicker";
import moment from "moment";
import { IndexHandle } from "../util/Commonservices/number";
import { PageSize, Showonly } from "../../ChildComponents/Constants";

import { useTranslation } from "react-i18next";
function MachineReading() {
  const [machineId, setMachineId] = useState([]);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  //State For Components Start
  const [state, setState] = useState({
    FromDate: new Date(),
    FromTime: "00:00:00",
    ToDate: new Date(),
    ToTime: "23:59:59",
    RegistredPatients: "",
    Type: "",
    MachineID: "",
    SampleID: "",
    PageSize: "PageSize",
  });
  //State For Components end

  //onChange Start
  const dateSelect = (date, name) => {
    setState({
      ...state,
      [name]: date,
    });
  };
  //onChange End

  //For Checkbox Start For Future

  const handleSelectChange = (event) => {
    const { name,value } = event.target;
    setState({ ...state, [name]: value });
  };
  const { t, i18n } = useTranslation();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setState({
      ...state,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const BindMachineName = () => {
    axios
      .get("/api/v1/MachineGroup/BindMachineName")
      .then((res) => {
        let data = res?.data?.message;
        console.log(data);
        let val = data?.map((ele) => {
          return {
            value: ele?.MachineId,
            label: ele?.MachineName,
          };
        });

        val.unshift({ label: "Machine Id", value: "" });
        setMachineId(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occur"
        );
      });
  };
  useEffect(() => {
    BindMachineName();
  }, []);

  const currentTableData = useMemo(() => {
    if (typeof state?.PageSize === "number") {
      const firstPageIndex = (currentPage - 1) * state?.PageSize;
      const lastPageIndex = firstPageIndex + state?.PageSize;
      return tableData.slice(firstPageIndex, lastPageIndex);
    } else {
      return tableData;
    }
  }, [currentPage, tableData]);

  //For Checkbox For Future end

  function handleTableButton() {
    setLoading(true);
    axios
      .post("/api/v1/MachineGroup/getMachineReading", {
        ...state,
        FromDate: moment(state?.FromDate).format("YYYY-MM-DD"),
        ToDate: moment(state?.ToDate).format("YYYY-MM-DD"),
      })
      .then((res) => {
        setTableData(res?.data?.message);
        setCurrentPage(1);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }

  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;

    setState({ ...state, [secondName]: TimeStamp });
  };

  useEffect(() => {
    handleTableButton();
  }, [state?.PageSize]);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Machine Reading")}</h3>
        </div>

        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("From Date")}:</label>
            <div className="col-sm-2 ">
              <div>
                <DatePicker
                  name="FromDate"
                  date={state?.FromDate}
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
                  date={state?.ToDate}
                  onChange={dateSelect}
                  onChangeTime={handleTime}
                  secondName="ToTime"
                  maxDate={new Date()}
                  minDate={new Date(state.FromDate)}
                />

                {errors?.ToDate && (
                  <span className="golbal-Error">{errors?.ToDate}</span>
                )}
              </div>
            </div>
         <label className="col-sm-1">{t("MachineID")}:</label>
            <div className="col-sm-2">
              <SelectBox
                options={machineId}
                onChange={handleSelectChange}
                name="MachineID"
                selectedValue={state.MachineID}
              />
            </div>
            <label className="col-sm-1">{t("SampleID")}:</label>
            <div className="col-sm-2">
              <Input
                type="text"
                placeholder={t("Sample Id")}
                className="form-control input-sm"
                name="SampleID"
                value={state?.SampleID}
                max={50}
                onChange={handleChange}
              />
            </div>
            </div>
            <div className="row">
              <label className="col-sm-1" htmlFor="center">
                {t("ShowOnly")}:
              </label>
            <div className="col-sm-2">
              {/* <label className="label-control" htmlFor="center">
                Show only:
              </label> */}
              <SelectBox
                options={Showonly}
                onChange={handleSelectChange}
                name="Type"
                selectedValue={state?.Type}
              />
            </div>
               <label className="col-sm-1" htmlFor="center">
                {t("Page Size")}:
              </label> 
            <div className="col-sm-2">
              {/* <label className="label-control" htmlFor="center">
                Page Size:
              </label> */}
              <SelectBox
                options={PageSize}
                onChange={handleSelectChange}
                name="PageSize"
                selectedValue={state?.PageSize}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-2" style={{ alignSelf: "flex-end" }}>
              <Input
                name="RegistredPatients"
                type="checkbox"
                checked={state?.RegistredPatients == 1 ? true : false}
                onChange={handleChange}
              />
              <label htmlFor="NotRegistred">{t("Not Registred Patients Only")}</label>
            </div>

            <div className="col-sm-1">
                <button
                  className="btn btn-block btn-info btn-sm"
                  onClick={handleTableButton}
                >
                  {t("Search")}
                </button>
                </div>
                <div className="col-sm-1">
                <button
                  className="btn btn-block btn-warning btn-sm"
                  //   onClick={}
                >
                  {t("Report")}
                </button>
              </div>
            </div>
          </div>
        </div>
       

      {loading ? (
        <Loading />
      ) : (
        tableData.length > 0 && (
          <div className="box form-horizontal">
            <div className="box-header with-border">
              <h3 className="box-title">{t("Search Result")}</h3>
            </div>
            <div
              className="box-body table-responsive divResult boottable"
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
                    <th>{t("Lab No")}</th>
                    <th>{t("MACHINE_ID")}</th>
                    <th>{t("Machine_ParamID")}</th>
                    <th>{t("Reading")}</th>
                    <th>{t("DtEntry")}</th>
                    <th>{t("isSync")}</th>
                    <th>{t("Machine_Param")}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTableData?.map((data, index) => (
                    <tr key={index}>
                      <td data-title={t("S.No")}>
                        {index + 1 + IndexHandle(currentPage, state?.PageSize)}&nbsp;
                      </td>
                      <td data-title={t("LabNo")}>{data?.LabNo}&nbsp;</td>
                      <td data-title={t("MACHINE_ID")}>{data?.Reading}&nbsp;</td>
                      <td data-title={t("Machine_ParamID")}>{data?.MACHINE_ID}&nbsp;</td>
                      <td data-title={t("Reading")}>{data?.Machine_ParamID}&nbsp;</td>
                      <td data-title={t("DtEntry")}>{data?.dtEntry}&nbsp;</td>
                      <td data-title={t("isSync")}>{data?.isSync}&nbsp;</td>
                      <td data-title={t("Machine_Param")}>
                        {data?.machine_param ? data?.machine_param : "-"}&nbsp;
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {typeof state?.PageSize === "number" && (
                <Pagination
                  className="pagination-bar"
                  currentPage={currentPage}
                  totalCount={tableData.length}
                  pageSize={state?.PageSize}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )}
            </div>
          </div>
        )
      )}
       
    </>
  );
}
export default MachineReading;
