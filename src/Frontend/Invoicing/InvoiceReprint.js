import React, { useEffect, useState } from "react";
import { getAccessCentres } from "../util/Commonservices";
import DatePicker from "../Components/DatePicker";
import axios from "axios";
import Loading from "../util/Loading";
import { toast } from "react-toastify";
import {
  SelectBox,
  SelectBoxWithCheckbox,
} from "../../ChildComponents/SelectBox";
import { DateTypeSearch } from "../../ChildComponents/Constants";
import Input from "../../ChildComponents/Input";

import { useTranslation } from "react-i18next";
import moment from "moment";
import ExportFile from "./../Master/ExportFile";
import { ExportToExcel } from "./../util/Commonservices/index";

const InvoiceReprint = () => {
  const [center, setCentre] = useState([]);
  const [load, setLoad] = useState(false);
  const [ExportExcel, setExportExcel] = useState([]);
  const [invoiceReprintData, setinvoiceReprintData] = useState([]);
  const [payload, setPayload] = useState({
    InvoiceNo: "",
    DateTypeSearch: "1",
    InvoiceFromDate: new Date(),
    InvoiceFromTime: "00:00",
    InvoiceToDate: new Date(),
    InvoiceToTime: "23:59",
    centreID: "",
  });

  // i18n start

  const { t } = useTranslation();
  // i18n end
  const handleSelectchange = (select, name) => {
    const data = select.map((ele) => ele.value);
    setPayload({ ...payload, [name]: data });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const dateSelect = (date, name) => {
    setPayload({
      ...payload,
      [name]: date,
    });
  };

  useEffect(() => {
    getAccessCentres(setCentre);
  }, []);

  const handleSearch = () => {
    setLoad(true);
    axios
      .post("/api/v1/Accounts/InvoiceReprint1", {
        ...payload,
        InvoiceFromDate: moment(payload?.InvoiceFromDate).format("DD-MMM-YYYY"),
        InvoiceToDate: moment(payload?.InvoiceToDate).format("DD-MMM-YYYY"),
      })
      .then((res) => {
        setLoad(false);
        setinvoiceReprintData(res?.data?.message);
        setExportExcel(res?.data?.message);
      })
      .catch((err) => {
        setLoad(false);
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
      });
  };

  const exportExcelDataApi = (id) => {
    axios
      .post("/api/v1/Accounts/ExportInvoiceReprintData", {
        InvoiceNo: id,
      })
      .then((res) => {
        ExportToExcel(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
      });
  };

  const handleGetReport = (id) => {
    axios
      .post("/reports/v1/commonReports/InvoiceReceiptData", {
        DocumentType: "2",
        InvoiceNo: id,
      })
      .then((res) => {
        window.open(res?.data?.Url, "_blank");
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
      });
  };

  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <span className="box-title">{t("Invoice Reprint")}</span>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("From Date")}:
            </label>
            <div className="col-sm-2 ">
              <DatePicker
                name="InvoiceFromDate"
                date={payload?.InvoiceFromDate}
                className="form-control pull-right reprint-date"
                onChange={dateSelect}
                maxDate={new Date()}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("To Date")}:
            </label>
            <div className="col-sm-2 ">
              <DatePicker
                name="InvoiceToDate"
                date={payload?.InvoiceToDate}
                className="form-control pull-right reprint-date"
                onChange={dateSelect}
                maxDate={new Date()}
                minDate={new Date(payload?.InvoiceFromDate)}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Date Type")}:
            </label>
            <div className="col-sm-2 ">
              <SelectBox
                options={DateTypeSearch}
                payload={payload?.DateTypeSearch}
                name="DateTypeSearch"
                onChange={handleChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Invoice No")}:
            </label>

            <div className="col-sm-2 ">
              <Input
                name="InvoiceNo"
                type="number"
                value={payload?.InvoiceNo}
                onChange={handleChange}
                className="select-input-box form-control input-sm required"
                required
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Center")}:
            </label>
            <div className="col-sm-2 ">
              <SelectBoxWithCheckbox
                options={center}
                name="centreID"
                value={payload?.centreID}
                onChange={handleSelectchange}
              />
            </div>
            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-block btn-sm btn-info"
                  onClick={handleSearch}
                >
                  {t("Search")}
                </button>
              )}
            </div>
            <div className="col-sm-1">
              <button className="btn btn-block btn-sm btn-primary">
                {t("Cancel")}
              </button>
            </div>
            <div className="col-sm-2">
              <button className="btn btn-block btn-sm btn-primary">
                {t("Cancel Report")}
              </button>
            </div>
            <div className="col-sm-2">
              <button className="btn btn-block btn-sm btn-success">
                {t("Summary Report")}
              </button>
            </div>
          </div>
        </div>

        <div className="box">
          {invoiceReprintData?.length > 0 && (
            <div
              className=" box-body divResult table-responsive"
              id="no-more-tables"
            >
              <table
                className="table table-bordered table-hover table-striped tbRecord"
                cellPadding="{0}"
                cellSpacing="{0}"
              >
                <thead className="text-center cf" style={{ zIndex: 99 }}>
                  <tr>
                    <th>S.No</th>
                    <th>Code</th>
                    <th>Client Name</th>
                    <th>Share Amt.</th>
                    <th>Export Excel</th>
                    <th>PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceReprintData?.map((ele, index) => (
                    <tr key={index}>
                      <td data-title="S.No">{index + 1}&nbsp;</td>
                      <td data-title="ClientCode">{ele.CentreCode}&nbsp;</td>
                      <td data-title="Client Name">{ele.PanelName}&nbsp;</td>
                      <td data-title="InvoiceAmt">{ele.ShareAmt}&nbsp;</td>
                      <td data-title="InvoiceAmt">
                        <i
                          class="fa fa-file-excel-o"
                          onClick={() => exportExcelDataApi(ele?.InvoiceNo)}
                        ></i>
                      </td>
                      <td data-title="InvoiceAmt">
                        <i
                          class="fa fa-print"
                          onClick={() => handleGetReport(ele?.InvoiceNo)}
                        ></i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default InvoiceReprint;
