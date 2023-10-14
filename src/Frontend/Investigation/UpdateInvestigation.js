import React from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";
import Input from "../../ChildComponents/Input";
import { useState } from "react";
import ExportFile from "../Master/ExportFile";
import XLSX from "sheetjs-style";
import axios from "axios";
import { useEffect } from "react";
import Loading from "../util/Loading";
import { toast } from "react-toastify";

const constantDropDownData = [
  {
    label: "select Type",
    value: "",
  },
  {
    label: "Investgation",
    value: "/api/v1/Investigations/GetInvestigation_Test-Investgation",
  },
  {
    label: "Centre",
    value: "/api/v1/Centre/GetAllCentreData-Centre",
  },
];

function UpdateInvestigation() {
  const [ExportExcel, setExportExcel] = useState([]);
  const [load, setLoad] = useState(false);
  const [show, setShow] = useState(false);
  const [ExcelPreview, setExcelPreview] = useState({
    header: [],
    body: [],
    exportJSON: [],
  });

  const handleSpilt = (url) => {
    const data = url.split("-");
    return data;
  };

  const handleSaveToDataDaseURL = (url) => {
    switch (url) {
      case "Investgation":
        return "/api/v1/Investigations/BulkUpdateInvestigations";
        break;
      case "Centre":
        return "/api/v1/Centre/BulkUpdateCentre";
        break;
      default:
        break;
    }
  };

  const handleSaveToDatabase = () => {
    const urlType = document.getElementById("documenyType")?.value;
    const pageType = handleSpilt(urlType);
    const SaveURL = handleSaveToDataDaseURL(pageType[1]);
    setLoad(true);
    axios
      .post(SaveURL, ExcelPreview?.exportJSON)
      .then((res) => {
        toast.success(res?.data?.message);
        document.getElementById("file").value = "";
        setExportExcel([]);
        setExcelPreview({ header: [], body: [], exportJSON: [] });
        setLoad(false);
        setShow(false);
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

  const fetchInvestigationJSON = (url) => {
    axios
      .get(url)
      .then((res) => {
        setExportExcel(res?.data?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const uploadFile = (event) => {
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
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const spiltData = handleSpilt(value);
    document.getElementById("file").value = "";
    setExportExcel([]);
    setExcelPreview({ header: [], body: [], exportJSON: [] });
    if (value) {
      fetchInvestigationJSON(spiltData[0]);
    }
  };

  return (
    <div className="box box-success form-horizontal">
      <div className="box-header with-border">
        <h3 className="box-title">Investigations</h3>
      </div>
      <div className="box-body">
        <div className="row">
          <label className="col-sm-1" htmlFor="inputEmail3">
            Export Data:
          </label>
          <div className="col-sm-2">
            <SelectBox
              options={constantDropDownData}
              id="documenyType"
              onChange={handleChange}
            />
          </div>

          <div className="col-sm-3">
            <Input
              type="file"
              className="form-control-file"
              onChange={uploadFile}
              disabled={
                [undefined, ""].includes(
                  document.getElementById("documenyType")?.value
                )
                  ? true
                  : false
              }
              id="file"
            />
          </div>
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
                [undefined, ""].includes(document.getElementById("file")?.value)
                  ? true
                  : false
              }
            >
              Upload
            </button>
          </div>
          <div className="col-sm-2">
            {load ? (
              <Loading />
            ) : (
              <button
                className="btn btn-block btn-success btn-sm"
                onClick={handleSaveToDatabase}
                disabled={ExcelPreview?.exportJSON?.length === 0 ? true : false}
              >
                Save To Database
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
  );
}

export default UpdateInvestigation;
