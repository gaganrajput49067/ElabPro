import { useTranslation } from "react-i18next";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";

import DatePicker from "../Components/DatePicker";
import { useState } from "react";
import Loading from "../util/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import { number } from "../util/Commonservices/number";
import moment from "moment";
const CentreAppointmentSearch = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const DateType = [
    {
      label: "App Date",
      value: "hc.AppDate",
    },
    { label: "Entry Date", value: "hc.EntryDateTime" },
  ];

  const [formData, setFormData] = useState({
    DateOption: "hc.AppDate",
    FromDate: new Date(),
    ToDate: new Date(),
    Mobile: "",
    PreBookingId: "",
  });

  const dummyData = [
    {
      ID: 1,
      CreateDate: "2023-10-13",
      CreateBy: "gagandotexe",
      AppDate: "2023-10-15",
      PrebookingID: "717114",
      MobileNo: "9540374619",
      PatientName: "Gagan",
      State: "UttarPradesh",
      City: "Dadri",
      Area: "DRC",
      Centre: "MAX",
      Status: "Confirmed",
    },
    // Add more dummy data objects here
  ];
  const searchHandler = () => {
    console.log(formData);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  const dateSelect = (date, name) => {
    setFormData({ ...formData, [name]: date });
  };
  const formChangeHandler = (e) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleStatusButton = (status) => {
    const updatedFormData = {
      ...formData,
      FromDate: moment(formData?.FromDate).format("DD/MMM/YYYY"),
      ToDate: moment(formData?.ToDate).format("DD/MMM/YYYY"),
      Status: status,
    };

    console.log(updatedFormData);
  };
  return (
    <>
      <div className="box with-border">
        <div className="box box-header with-border box-success">
          <h3 className="box-title text-center">{t("Centre Visit Search")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-sm-1">
              <SelectBox
                name="DateOption"
                className="form-control input-sm"
                options={DateType}
                onChange={formChangeHandler}
                selectedValue={formData?.DateOption}
              />
            </div>
            <label
              className="col-sm-1"
              htmlFor="From"
              style={{ textAlign: "end" }}
            >
              {t("From")} :
            </label>
            <div className="col-sm-1">
              <DatePicker
                name="FromDate"
                className="form-control input-sm"
                date={formData?.FromDate}
                onChange={dateSelect}
                maxDate={formData?.ToDate}
              />
            </div>

            <label
              className="col-sm-1"
              htmlFor="To"
              style={{ textAlign: "end" }}
            >
              {t("To")} :
            </label>
            <div className="col-sm-1">
              <DatePicker
                name="ToDate"
                className="form-control input-sm"
                date={formData?.ToDate}
                onChange={dateSelect}
                minDate={formData?.FromDate}
              />
            </div>
            <label
              className="col-sm-1"
              htmlFor="Mobile No."
              // style={{ textAlign: "end" }}
            >
              Mobile No :
            </label>
            <div className="col-sm-2">
              <Input
                className="form-control input-sm"
                max={10}
                type="number"
                autoComplete="off"
                name="Mobile"
                onInput={(e) => number(e, 10)}
                onChange={formChangeHandler}
                placeholder="Enter a Mobile Number"
              />
            </div>
            <label
              className="col-sm-2"
              htmlFor="Prebooking No."

              // style={{ textAlign: "center" }}
            >
              Prebooking No. :
            </label>
            <div className="col-sm-2">
              <Input
                autoComplete="off"
                name="PreBookingId"
                onChange={formChangeHandler}
                onInput={(e) => number(e, 10)}
                className="form-control input-sm"
                placeholder="Enter a Prebooking Id"
              />
            </div>
          </div>
          <div className="row"></div>
          <div
            className="row"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div className="col-md-1 col-sm-6 col-xs-12">
              {loading ? (
                <Loading />
              ) : (
                <button
                  type="button"
                  className="btn btn-block btn-success btn-sm"
                  onClick={searchHandler}
                >
                  {t("Search")}
                </button>
              )}
            </div>
            <div className="col-md-1 col-sm-6 col-xs-12">
              <button type="Excel" className="btn btn-block btn-warning btn-sm">
                {t("Export to Excel")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="box">
        <div className="box-body hcStatus">
          <div className=" row">
            <div className="col-sm-2 ">
              <button
                style={{
                  height: "16px",
                  width: "16px",
                  backgroundColor: "white",
                  marginRight: "3px",
                }}
                onClick={() => {
                  handleStatusButton("Pending");
                }}
              ></button>
              <label htmlFor="Pending" className="control-label">
                {t("Pending")}
              </label>
            </div>
            <div className="col-sm-3 ">
              <button
                style={{
                  height: "16px",
                  width: "16px",
                  backgroundColor: "#4acfee",
                  marginRight: "3px",
                }}
                onClick={() => {
                  handleStatusButton("BookingCompleted");
                }}
              ></button>
              <label htmlFor="Booking Completed" className="control-label">
                {t("Booking Completed")}
              </label>
            </div>
            <div className="col-sm-2 ">
              <button
                style={{
                  height: "16px",
                  width: "16px",
                  backgroundColor: "#E75480",
                  marginRight: "3px",
                }}
                onClick={() => {
                  handleStatusButton("Canceled");
                }}
              ></button>
              <label htmlFor="Canceled" className="control-label">
                {t("Canceled")}
              </label>
            </div>
          </div>
        </div>
      </div>
      <div className="box">
        <div className="box-body divResult boottable table-responsive " id="no-more-tables">
          <div className="row">
            <table
              className="table table-bordered table-hover table-striped tbRecord"
              cellPadding="{0}"
              cellSpacing="{0}"
            >
              <thead className="cf text-center" style={{ zIndex: 99 }}>
                <tr>
                  <th className="text-center">{t("#")}</th>
                  <th className="text-center">{t("Create Date")}</th>
                  <th className="text-center">{t("Create By")}</th>
                  <th className="text-center">{t("App. Date")}</th>
                  <th className="text-center">{t("Prebooking ID")}</th>
                  <th className="text-center">{t("MobileNo")}</th>
                  <th className="text-center">{t("Patient Name")}</th>
                  <th className="text-center">{t("State")}</th>
                  <th className="text-center">{t("City")}</th>
                  <th className="text-center">{t("Area")}</th>
                  <th className="text-center">{t("Centre")}</th>
                  <th className="text-center">{t("Status")}</th>
                </tr>
              </thead>

              <tbody>
                {dummyData.map((ele, index) => (
                  <>
                    <tr key={index}>
                      <td data-title="#" className="text-center">
                        {index + 1}
                      </td>

                      <td data-title="Create Date" className="text-center">
                        {ele?.CreateDate}
                      </td>

                      <td data-title="Create By" className="text-center">
                        {ele?.CreateBy}
                      </td>
                      <td data-title="App. Date" className="text-center">
                        {ele?.AppDate}
                      </td>
                      <td data-title="Prebooking ID" className="text-center">
                        {ele?.PrebookingID}
                      </td>
                      <td data-title="MobileNo" className="text-center">
                        {ele?.MobileNo}
                      </td>
                      <td data-title="Patient Name" className="text-center">
                        {ele?.PatientName}
                      </td>
                      <td data-title="State" className="text-center">
                        {ele?.State}
                      </td>
                      <td data-title="City" className="text-center">
                        {ele?.City}
                      </td>
                      <td data-title="Area" className="text-center">
                        {ele?.Area}
                      </td>
                      <td data-title="Centre" className="text-center">
                        {ele?.Centre}
                      </td>
                      <td data-title="Status" className="text-center">
                        {ele?.Status}
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default CentreAppointmentSearch;
