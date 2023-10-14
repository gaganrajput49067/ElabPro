import axios from "axios";
import React, { useEffect, useState } from "react";
import Loading from "../util/Loading";
import Input from "../../ChildComponents/Input";
import { dateConfig } from "../util/DateConfig";
import { toast } from "react-toastify";
import moment from "moment";
import DatePicker from "../Components/DatePicker";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { isChecked } from "../util/Commonservices";
import { useTranslation } from "react-i18next";

const DiscountApproval = () => {
  const [payload, setPayload] = useState({
    PatientName: "",
    LedgertransactionNo: "",
    FromDate: new Date(),
    FromTime: "00:00",
    ToDate: new Date(),
    ToTime: "23:59",
    CentreID: "",
    DiscountApprovedByID: "",
  });
  const [Center, setCenter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [DiscApprove, setDiscApprove] = useState([]);
  const [tableData, setTableData] = useState([]);

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
        CentreDataValue.unshift({ label: "Booking Centre", value: "" });
        setCenter(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };

  const getDiscountApproval = () => {
    axios
      .get("/api/v1/DiscountApprovalByEmployee/BindDiscApprovedBy")
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => {
          return {
            label: ele?.EmployeeName,
            value: ele?.EmployeeID,
          };
        });
        val.unshift({ label: "Discount Approved By", value: "" });
        setDiscApprove(val);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
      });
  };

  const handleSelectChange = (event) => {
    const { name,value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  useEffect(() => {
    getAccessCentres();
    getDiscountApproval();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const getTableData = () => {
    axios
      .post("/api/v1/DiscountApprovalByEmployee/getDiscountApprovalData", {
        ...payload,
        FromDate: moment(payload?.FromDate).format("DD-MMM-YYYY"),
        ToDate: moment(payload?.ToDate).format("DD-MMM-YYYY"),
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            ...ele,
            isChecked: false,
          };
        });
        setTableData(val);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
      });
  };

  const handleChangeNew = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const data = [...tableData];
      data[index][name] = checked;
      setTableData(data);
    } else {
      const data = tableData.map((ele) => {
        return {
          ...ele,
          isChecked: checked,
        };
      });
      setTableData(data);
    }
  };
  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;

    setPayload({ ...payload, [secondName]: TimeStamp });
  };
  const postApi = () => {
    setLoading(true);
    const data = tableData.filter((ele) => ele?.isChecked);
    if (data.length > 0) {
      axios
        .post("/api/v1/DiscountApprovalByEmployee/UpdateDiscApprovedBy", data)
        .then((res) => {
          toast.success(res?.data?.message);
          // getTableData();
          setPayload({
            PatientName: "",
            LedgertransactionNo: "",
            FromDate: new Date(),
            FromTime: "00:00",
            ToDate: new Date(),
            ToTime: "23:59",
            CentreID: "",
            DiscountApprovedByID: "",
          });
          setLoading(false);
          setTableData([]);
        })
        .catch((err) => {
          toast.error(
            err?.data?.message ? err?.data?.message : "Something Went Wrong"
          );
          setLoading(false);
        });
    } else {
      toast.error("please Choose One Test");
    }
  };

  const dateSelect = (date, name) => {
    setPayload({
      ...payload,
      [name]: date,
    });
  };
  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Discount Approval")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("From Date")}:</label>
            <div className="col-sm-2">
              <div>
                <DatePicker
                  name="FromDate"
                  date={payload?.FromDate}
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
            <div className="col-sm-2">
              <div>
                <DatePicker
                  name="ToDate"
                  date={payload?.ToDate}
                  onChange={dateSelect}
                  onChangeTime={handleTime}
                  secondName="ToTime"
                  maxDate={new Date()}
                  minDate={new Date(payload.FromDate)}
                />

                {errors?.ToDate && (
                  <span className="golbal-Error">{errors?.ToDate}</span>
                )}
              </div>
            </div>
            <label className="col-sm-1">{t("Visit Number")}:</label>
            <div className="col-sm-2">
              <Input
                className="select-input-box form-control input-sm"
                type="text"
                placeholder={t("Visit Number")}
                name="LedgertransactionNo"
                value={payload.LedgertransactionNo}
                onChange={handleChange}
              />
            </div>
            <label className="col-sm-1">{t("Patient Name")}:</label>
            <div className="col-sm-2">
              <Input
                className="select-input-box form-control input-sm"
                type="text"
                placeholder={t("Patient Name")}
                name="PatientName"
                value={payload.PatientName}
                onChange={handleChange}
              />
            </div>
            </div>
            <div className="row">
            <label className="col-sm-1">{t("Centre")}:</label>
            <div className="col-sm-2">
              <SelectBox
                options={Center}
                name="CentreID"
                selectedValue={payload?.CentreID}
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-1">{t("DiscountApprovedByID")}:</label>
            <div className="col-sm-2">
              <SelectBox
                options={DiscApprove}
                name={"DiscountApprovedByID"}
                selectedValue={payload?.DiscountApprovedByID}
                onChange={handleSelectChange}
              />
            </div>
        
          <div className="col-sm-1">
            <button
              className="btn btn-block btn-info btn-sm"
              onClick={getTableData}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </div>
      </div>
        {tableData?.length > 0 && (
          <div className="box">
            <div className="box-body">
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
                      t("Booking Centre"),
                      t("Visit No"),
                      t("BarcodeNo"),
                      t("Date"),
                      t("Patient Name"),
                      t("Gender"),
                      t("Gross Amt."),
                      t("Discount Amt."),
                      t("Net Amt."),
                      t("Dis Reason"),
                      t("Remarks"),
                      t("CreatedBy"),
                      <Input
                        type="checkbox"
                        checked={
                          tableData.length > 0
                            ? isChecked("isChecked", tableData, true).includes(
                                false
                              )
                              ? false
                              : true
                            : false
                        }
                        onChange={handleChangeNew}
                      />,
                    ].map((ele, index) => (
                      <th key={index}>{ele}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((ele, index) => (
                    <tr key={index}>
                      {[
                        index + 1,
                        ele?.Centre,
                        ele?.LedgerTransactionNo,
                        "-",
                        dateConfig(ele?.BillingDATE),
                        ele?.PatientName,
                        ele?.Gender,
                        ele?.GrossAmount,
                        ele?.DiscountOnTotal,
                        ele?.NetAmount,
                        "-",
                        "-",
                        ele?.DiscountApprovedByName,
                        <Input
                          type="checkbox"
                          checked={ele?.isChecked}
                          name="isChecked"
                          onChange={(e) => handleChangeNew(e, index)}
                        />,
                      ].map((item, i) => (
                        <td key={i} data-title={t("Item")}>
                          {item}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {loading ? (
              <Loading />
            ) : (
              <div className="col-sm-1">
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={postApi}
                >
                  {t("Update")}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default DiscountApproval;
