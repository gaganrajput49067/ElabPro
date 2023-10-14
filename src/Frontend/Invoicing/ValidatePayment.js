import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { getPaymentModes } from "../util/Commonservices";
import DatePicker from "../Components/DatePicker";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { DateTypeSearch, Status } from "../../ChildComponents/Constants";

import { useTranslation } from "react-i18next";
import Loading from "../util/Loading";
const ValidatePayment = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [CentreData, setCentreData] = useState([]);
  const [PaymentMode, setPaymentMode] = useState([]);
  const [payload, setPayload] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    DepartmentID: "",
    CentreID: "",
    DateTypeSearch: "1",
  });
 
  const { t } = useTranslation();
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
        CentreDataValue.unshift({ label: "All", value: "" });
        setCentreData(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setPayload({ ...payload, [name]: event.value });
  };

  const dateSelect = (date, name) => {
    setPayload({
      ...payload,
      [name]: date,
    });
  };

  const handleSearch = () => {
    axios
      .post("")
      .then((res) => {
        setTableData(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong"
        );
      });
  };

  useEffect(() => {
    getPaymentModes("PaymentMode", setPaymentMode);
    getAccessCentres();
  }, []);

  return (
    <>
      <div className="box box-success">
        <div className="box-header">
          <h3 className="box-title">{t("Pending Amount Validation")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-sm-1">
              <label className="control-label">{t("From Date")}:</label>
            </div>
            <div className="col-sm-2">
              <DatePicker
                type="date"
                name="FromDate"
                date={payload?.FromDate}
                onChange={dateSelect}
                maxDate={new Date()}
              />
            </div>
            <div className="col-sm-1">
              <label className="control-label">{t("To Date")}:</label>
            </div>
            <div className="col-sm-2">
              <DatePicker
                name="ToDate"
                date={payload?.ToDate}
                onChange={dateSelect}
                minDate={new Date(payload.FromDate)}
              />
            </div>
            <div className="col-sm-1">
              <label className="control-label">{t("Centre")}:</label>
            </div>
            <div className="col-sm-2">
              <SelectBox
                options={CentreData}
                selectedValue={payload?.CentreID}
                name="CentreID"
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-sm-1">
              <label className="control-label">{t("Status")}:</label>
            </div>
            <div className="col-sm-2">
              <SelectBox
                options={Status}
                name="Status"
                payload={payload?.Status}
                onChange={handleSelectChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-1">
              <label className="control-label">{t("Payment Mode")}:</label>
            </div>
            <div className="col-sm-2">
              <SelectBox
                options={PaymentMode}
                name="PaymentMode"
                payload={payload?.PaymentMode}
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-sm-1">
              <label className="control-label">{t("Date Type")}:</label>
            </div>
            <div className="col-sm-2">
              <SelectBox
                options={DateTypeSearch}
                payload={payload?.DateTypeSearch}
                name="DateTypeSearch"
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-sm-1">
              <button
                className="btn btn-block btn-info btn-sm"
                type="button"
                onClick={handleSearch}
              >
                {t("Search")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* {loading ? (
  <Loading />
):( */}
      {/* <> */}
      <div className=" box-body divResult table-responsive" id="no-more-tables">
        <div className="row">
          <div className="col-12">
            <table
              className="table table-bordered table-hover table-striped tbRecord"
              cellPadding="{0}"
              cellSpacing="{0}"
            >
              <thead className=" cf">
                <tr>
                  <th>{t("S.No")}</th>
                  <th>{t("Type")}</th>
                  <th>{t("Paid By")}</th>
                  <th>{t("Paid Date")}</th>
                  <th>{t("Client Name")}</th>
                  <th>{t("Transaction ID")}</th>
                  <th>{t("Payment Mode")}</th>
                  <th>{t("Pay Currency")}</th>
                  <th>{t("Paid Amount")}</th>
                  <th>{t("Conversion")}</th>
                  <th>{t("Base Amount(INR)")}</th>
                  <th>{t("Bank Name")}</th>
                  <th>{t("Cheque No")}</th>
                  <th>{t("Cheque Date")}</th>
                  <th>{t("Remarks")}</th>
                  <th>{t("Edit")}</th>
                  <th>{t("Accept")}</th>
                  <th>{t("Cancel")}</th>
                </tr>
              </thead>
              <tbody>
                {tableData?.map((ele, index) => (
                  <tr key={index}>
                    <td data-title={t("S.No")}>{index + 1} &nbsp;</td>
                    <td data-title={t("Type")}>{} &nbsp;</td>
                    <td data-title={t("Paid By")}>{} &nbsp;</td>
                    <td data-title={t("Paid Date")}>{} &nbsp;</td>
                    <td data-title={t("Client Name")}>{} &nbsp;</td>
                    <td data-title={t("Transaction ID")}>{} &nbsp;</td>
                    <td data-title={t("Payment Mode")}>{} &nbsp;</td>
                    <td data-title={t("Pay Currency")}>{} &nbsp;</td>
                    <td data-title={t("Paid Amount")}>{} &nbsp;</td>
                    <td data-title={t("Conversion")}>{} &nbsp;</td>
                    <td data-title={t("Base Amount(INR)")}>{} &nbsp;</td>
                    <td data-title={t("Bank Name")}>{} &nbsp;</td>
                    <td data-title={t("Cheque No.")}>{} &nbsp;</td>
                    <td data-title={t("Cheque Date")}>{} &nbsp;</td>
                    <td data-title={t("Remarks")}>{} &nbsp;</td>
                    <td data-title={t("Edit")}>{} &nbsp;</td>
                    <td data-title={t("Accept")}>{} &nbsp;</td>
                    <td data-title={t("Cancel")}>{} &nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* </> */}
      {/* )} */}
    </>
  );
};

export default ValidatePayment;
