import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { getAccessCentres } from "../../Frontend/util/Commonservices";
import XLSX from "sheetjs-style";
import ExportFile from "./ExportFile";
import { toast } from "react-toastify";
import axios from "axios";
import Input from "../../ChildComponents/Input";
import Loading from "../../Frontend/util/Loading";
import { useTranslation } from "react-i18next";
function ImportExportExcel() {
  const [CentreId, setCentreId] = useState([]);
  const [ExportExcel, setExportExcel] = useState([]);
  const [show, setShow] = useState(false);
  const [ExcelPreview, setExcelPreview] = useState({
    header: [],
    body: [],
    exportJSON: [],
  });
  const [load, setLoad] = useState(false);

  const [payload, setPayload] = useState({
    CentreId: "",
    ImportExportData: "",
  });
  const { t } = useTranslation();

  const uploadFile = (event) => {
    if (payload?.CentreId && payload?.ImportExportData) {
      let fileObj = event.target.files[0];

      var reader = new FileReader();

      reader.readAsArrayBuffer(fileObj);

      reader.onload = () => {
        // Make a fileInfo Object
        var data = new Uint8Array(reader.result);
        var work_book = XLSX.read(data, { type: "array" });
        var sheet_name = work_book.SheetNames;
        var exportJSON = XLSX.utils.sheet_to_json(
          work_book.Sheets[sheet_name[0]]
        );
        var sheet_data = XLSX.utils.sheet_to_json(
          work_book.Sheets[sheet_name[0]],
          {
            header: 1,
          }
        );
        setExcelPreview({
          ...ExcelPreview,
          header: sheet_data[0],
          body: sheet_data.slice(1, sheet_data.length),
          exportJSON: exportJSON,
        });
      };
    } else {
      toast.error("Please Select Center And Import Method");
      document.getElementById("file").value = "";
    }
  };

  const handleSaveToDatabase = (url) => {
    setLoad(true);
    axios
      .post(url, ExcelPreview?.exportJSON)
      .then((res) => {
        toast.success(res?.data?.message);
        setPayload({
          CentreId: "",
          ImportExportData: "",
        });
        document.getElementById("file").value = "";
        setExportExcel([]);
        setExcelPreview({ header: [], body: [], exportJSON: [] });
        setLoad(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Found"
        );
        setLoad(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value, ItemValue: "" });
    document.getElementById("file").value = "";
  };

  // Comment That not working see this see future for work

  useEffect(() => {
    if (payload?.CentreId && payload?.ImportExportData) fetch();
  }, [payload]);

  const fetch = () => {
    axios
      .post("api/v1/CommonController/DownloadRateList", payload)
      .then((res) => {
        setExportExcel(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  const APiURL = (type) => {
    console.log(type);
    switch (type) {
      case "RateList":
        return "/api/v1/CommonController/SaveReferalListExcelToDataBase";
        break;
      case "DoctorReferal":
        return "/api/v1/CommonController/SaveDoctorReferalExcelToDataBase";
        break;
      case "Ratetypeshare":
        return "/api/v1/CommonController/SaveRateTypeShare";
        break;
      default:
        break;
    }
  };

  console.log(ExcelPreview?.exportJSON?.length);

  useEffect(() => {
    getAccessCentres(setCentreId);
  }, []);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("ImportExportExcel")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("ImportExportData")}:
            </label>
            <div className="col-sm-2">
              <select
                className="select-input-box form-control input-sm"
                name="ImportExportData"
                value={payload?.ImportExportData}
                onChange={handleChange}
              >
                <option hidden>Select</option>
                {["RateList", "DoctorReferal", "Ratetypeshare"].map(
                  (ele, index) => (
                    <option key={index} value={ele}>
                      {ele}
                    </option>
                  )
                )}
              </select>
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("CentreID")}:
            </label>
            <div className="col-sm-2">
              <select
                className="select-input-box form-control input-sm"
                name="CentreId"
                value={payload?.CentreId}
                onChange={handleChange}
              >
                <option hidden>Select CentreID</option>
                {CentreId.map((ele) => (
                  <option value={ele?.value}>{ele?.label}</option>
                ))}
              </select>
            </div>

            {/* Please uncomment this after create 2nd file */}
            <div className="col-sm-3">
              <Input
                type="file"
                className="form-control-file"
                onChange={uploadFile}
                id="file"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2">
              <ExportFile dataExcel={ExportExcel} />
            </div>
            <div className="col-sm-2">
              <button
                className="btn btn-block btn-success btn-sm"
                onClick={() => {
                  setShow(true);
                }}
                disabled={
                  document.getElementById("file")?.value === "" ? true : false
                }
              >
                {t("Upload")}
              </button>
            </div>
            <div className="col-sm-2">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={() =>
                    handleSaveToDatabase(APiURL(payload?.ImportExportData))
                  }
                  disabled={
                    ExcelPreview?.exportJSON?.length === 0 ? true : false
                  }
                >
                  {t("Save To Database")}
                </button>
              )}
            </div>
          </div>

          {show && (
            <div
              className=" box-body divResult table-responsive mt-4"
              id="no-more-tables"
            >
              <table
                className="table table-bordered table-hover table-striped tbRecord"
                cellPadding="{0}"
                cellSpacing="{0}"
              >
                <thead>
                  <tr>
                    {ExcelPreview?.header?.map((ele, index) => (
                      <th key={index}>{ele}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ExcelPreview?.body?.map((ele, index) => (
                    <tr key={index}>
                      {ele?.map((data, ind) => (
                        <td data-title={ele} key={ind}>
                          {data} &nbsp;
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* <OutTable
                    data={ExcelPreview?.rows}
                    columns={ExcelPreview?.cols}
                    tableClassName="excel-table "
                  /> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default ImportExportExcel;
