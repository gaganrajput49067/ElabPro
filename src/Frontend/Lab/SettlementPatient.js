import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getPaymentModes } from "../util/Commonservices";
import { dateConfig } from "../util/DateConfig";
import { SelectBox } from "../../ChildComponents/SelectBox";
// import { getPaymentModes, selectedValueCheck } from "../../util/Commonservices";
import { PayBy } from "../../ChildComponents/Constants";
import Input from "../../ChildComponents/Input";
import { number } from "../util/Commonservices/number";
import DatePicker from "../Components/DatePicker";
import Loading from "../util/Loading";
import { useTranslation } from "react-i18next";

function SettlementPatient() {
  const [errors, setErrors] = useState({});
  const { id } = useParams();
  console.log(id);
  const [paymentMode, setPaymentMode] = useState([]);
  const [BankName, setBankName] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [Load, setLoad] = useState(false);

  const [payload, setPayload] = useState({
    PayBy: "0",
    PaymentMode: "Paytm",
    Amount: "",
    DueAmount: "",
    S_Currency: "INR",
    S_Notation: "INR",
    C_Factor: 1,
    PaymentModeID: "123",
    S_CountryID: 1,
    S_Amount: "10",
    LedgerTransactionID: "",
    UpdateRemarks: "",
    BankName: "BankName",
    NewAmount: "",
    CardNo: "",
    CardDate: "",
    TransactionNo: "",
    FromDate:new Date()
  });

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    if (name === "PaymentModeID") {
      const data = paymentMode?.find((ele) => ele?.value == value);
      setPayload({
        ...payload,
        [name]: data?.value,
        PaymentMode: data?.label,
        CardNo: "",
      });
    } else {
      setPayload({ ...payload, [name]: value });
    }
  };

  console.log(payload);

  const fetch = () => {
    axios
      .post("/api/v1/Settlement/GetDataToSettlement", {
        LedgerTransactionID: id,
      })
      .then((res) => {
        setTableData(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  useEffect(() => {
    fetch();
  }, []);

  useEffect(() => {
    setPayload({
      ...payload,
      LedgerTransactionIDHash: id,
      LedgerTransactionID: tableData[0]?.LedgerTransactionID,

      Amount: tableData[0]?.DueAmount,
    });
  }, [tableData]);

  const validate = (condition) => {
    let disable = false;
    let message = "";
    if (condition === "") {
      disable = true;
      message = "Please Choose Payment Mode";
    } else if (["Paytm", "Online Payment"].includes(condition)) {
      if (payload["TransactionNo"].length < 10) {
        disable = true;
        message = "Please Fill Correct Transaction Number";
      }
    } else if (["Debit Card", "Credit Card", "Cheque"].includes(condition)) {
      if (payload["BankName"] === "") {
        disable = true;
        message = "Please Choose BankName";
      } else if (payload["CardNo"].length < 16) {
        disable = true;
        message = `Please Enter Valid ${condition} Number`;
      }
    }

    return {
      disable: disable,
      message: message,
    };
  };

  const getReceipt = (id) => {
    axios
      .post("/reports/v1/getReceipt", {
        LedgerTransactionIDHash: id,
      })
      .then((res) => {
        window.open(res?.data?.Url, "_blank");
      })
      .catch((err) => {
        toast.error(
          err?.data?.response?.message
            ? err?.data?.response?.message
            : "Error Occured"
        );
      });
  };

  const handleSubmit = () => {
    const { disable, message } = validate(payload?.PaymentMode);
    if (disable) {
      toast.error(message);
    } else {
      setLoad(true);
      axios
        .post("/api/v1/Settlement/SettlementData", {
          ...payload,
          DebitTransactionNo: payload?.TransactionNo,
          PaytmTransactionNo: payload?.TransactionNo,
          CreditTransactionNo: payload?.TransactionNo,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setPayload({
            PayBy: "0",
            PaymentMode: "Paytm",
            Amount: "",
            DueAmount: "",
            S_Currency: "INR",
            S_Notation: "INR",
            C_Factor: 1,
            PaymentModeID: "123",
            S_CountryID: 1,
            S_Amount: "10",
            LedgerTransactionID: "",
            UpdateRemarks: "",
            BankName: "",
            NewAmount: "",
            CardNo: "",
            CardDate: "",
            TransactionNo: "",
          });
          setLoad(false);
          getReceipt(tableData[0]?.LedgertransactionIDHash);
          // window.open(
          //   `/GetLabReportPreview/${tableData[0]?.LedgertransactionIDHash}`,
          //   "_blank"
          // );
          fetch();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          );
          setLoad(false);
        });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: name === "Amount" ? (checkDueAmount(value) ? value : "") : value,
    });

    if (name === "Amount" && !checkDueAmount(value)) {
      toast.error("Please Enter Correct Amount");
    }
  };

  const checkDueAmount = (value) => {
    let check = true;
    return (check = value > tableData[0]?.DueAmount ? false : true);
  };

  const ComaSeparter = () => {
    let val = "";
    for (let i = 0; i < tableData.length; i++) {
      val =
        val === ""
          ? tableData[i].ItemName
          : `${val + " , " + tableData[i].ItemName}`;
    }
    return val;
  };

  const dateSelect = (value, name) => {
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  useEffect(() => {
    getPaymentModes("PaymentMode", setPaymentMode);
    getPaymentModes("BankName", setBankName);
  }, []);

  const [formData, setFormData] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    CentreID: "",
    ItemValue: "",
    RateID: "",
    SelectTypes: "",
    RefundFilter: null,
    FromTime: "00:00:00",
    ToTime: "23:59:59",
    DoctorReferal: "",
    DepartmentID: "",
    DoctorName: "",
  });
  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;

    setFormData({ ...formData, [secondName]: TimeStamp });
  };
    const { t, i18n } = useTranslation();

  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Settlement Details")}</h3>
        </div>

        <div className="box-body">
          <div className="box-body divResult boottable" id="no-more-tables">
            <table
              className="table table-bordered table-hover table-striped tbRecord"
              cellPadding="{0}"
              cellSpacing="{0}"
            >
              <thead>
                <tr>
                  {[
                   t("S.no"),
                   t("Reg Date"),
                   t("Lab No"),
                   t("Patient Name"),
                   t("Centre"),
                   t("Rate Type"),
                   t("Gross Amount"),
                   t("Discount Amount"),
                   t("Net Amount"),
                   t("Paid Amount"),
                   t("Due Amount"),
                  ].map((ele, index) => (
                    <th key={index}>{ele}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData?.map((ele, index) => (
                  <tr key={index}>
                    <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                    <td data-title={t("RegDate")}>
                      {dateConfig(ele?.RegDate)}&nbsp;
                    </td>
                    <td data-title={t("LedgerTransactionNo")}>
                      {ele?.LedgerTransactionNo}&nbsp;
                    </td>
                    <td data-title={t("PName")}>{ele?.PName}&nbsp;</td>
                    <td data-title={t("Centre")}>{ele?.Centre}&nbsp;</td>
                    <td data-title={t("RateType")}>{ele?.RateType}&nbsp;</td>
                    <td data-title={t("Rate")}>{ele?.Rate}&nbsp;</td>
                    <td data-title={t("DiscAmt")}>{ele?.DiscAmt}&nbsp;</td>
                    <td data-title={t("Amount")}>{ele?.Amount}&nbsp;</td>
                    <td data-title={t("PaidAmount")}>{ele?.PaidAmount}&nbsp;</td>
                    <td data-title={t("DueAmount")}>{ele?.DueAmount}&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="box box-success">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Settlement Details")}</h3>
        </div>
        <div className="box-body">
          <div>
            <p>
              <strong>{t("Test Name")}</strong>:
              <span style={{ fontSize: "14px", color: "grey" }}>
                {ComaSeparter()}
              </span>
            </p>
          </div>
          <div className="row">
            <div className="col-sm-1">
              <div>
                <SelectBox
                  className="required"
                  name="PayBy"
                  options={PayBy}
                  selectedValue={payload?.PayBy}
                  onChange={handleSelectChange}
                />
              </div>
            </div>
            <div className="col-sm-1">
              <div>
                <Input
                  // className="form-control pull-right reprint-date required"
                  className="select-input-box form-control input-sm"
                  placeholder={"Amount"}
                  name="Amount"
                  type="number"
                  onInput={(e) => number(e, 10)}
                  value={payload?.Amount}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-sm-1">
              <div>
                <SelectBox
                  className="required form-control"
                  options={paymentMode.filter((ele) => ele.label !== "Credit")}
                  name="PaymentModeID"
                  selectedValue={payload?.PaymentModeID}
                  onChange={handleSelectChange}
                />
              </div>
            </div>
            {["Cheque", "Credit Card", "Debit Card"].includes(
              payload?.PaymentMode
            ) && (
              <div className="col-sm-2">
                <div>
                  <select  
                    // className="required"
                    className="form-control input-sm"
                    name="BankName"
                    value={payload?.BankName}
                    onChange={handleChange} 
                               
                  >
                    <option >{t("Select Bank")}</option>
                    {BankName.map((ele, index) => (           

                      <option value={ele.value} key={index}>
                        {ele.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
            {["Cheque"].includes(payload?.PaymentMode) && (
              <div className="col-sm-2">
                <div>
                  <Input
                    className="select-input-box form-control input-sm"
                    placeholder={t("CardNo")}
                    name="CardNo"
                    type="text"
                    value={payload?.CardNo}
                    onChange={handleChange}
                    max={16}
                  />
                </div>
              </div>
            )}

            {["Cheque"].includes(payload?.PaymentMode) && (
              <div className="col-sm-1">
                <div>
                  <DatePicker
                    name="FromDate"
                    date={payload?.FromDate}
                    onChange={dateSelect}
                    // onChangeTime={handleTime}
                    // secondName="FromTime"
                    maxDate={new Date()}
                  />

                  {errors?.FromDate && (
                    <span className="golbal-Error">{errors?.FromDate}</span>
                  )}
                </div>
              </div>
            )}

            {["Credit Card", "Debit Card"].includes(payload?.PaymentMode) && (
              <div className="col-sm-2">
                <div>
                  <Input
                    // className="form-control  pull-right reprint-date required"

                    name="CardNo"
                    placeholder={t("CardNo")}
                    className="select-input-box form-control input-sm"
                    type="text"
                    value={payload?.CardNo}
                    max={16}
                    onChange={handleChange}
                  />
                </div>
              </div>
            )}

            {["Online Payment", "Paytm"].includes(payload?.PaymentMode) && (
              <div className="col-sm-2">
                <div>
                  <Input
                    // className="form-control  pull-right reprint-date required"
                    className="select-input-box form-control input-sm required"
                    name="TransactionNo"
                    placeholder={t("TransactionNo")}
                    type="text"
                    value={payload?.TransactionNo}
                    onChange={handleChange}
                    max={16}
                  />
                </div>
              </div>
            )}
            <div className="col-sm-1">
              <div>
                <Input
                  // className="form-control  pull-right reprint-date "
                  placeholder={t("UpdateRemark")}
                  className="select-input-box form-control input-sm"
                  name="UpdateRemarks"
                  type="text"
                  value={payload?.UpdateRemarks}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-sm-1">
              {Load ? (
                <Loading />
              ) : (
                <button
                  // className="btn btn-success"
                  className="btn btn-block btn-success btn-sm"
                  onClick={handleSubmit}
                  disabled={payload?.Amount == 0 ? true : false}
                >
                 {t("Save")} 
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default SettlementPatient;
