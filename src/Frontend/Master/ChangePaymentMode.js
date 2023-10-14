import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getPaymentModes } from "../util/Commonservices";
import Input from "../../ChildComponents/Input";
import { number } from "../util/Commonservices/number";
import moment from "moment";
import Loading from "../util/Loading";
import DatePicker from "../Components/DatePicker";

import { useTranslation } from "react-i18next";
const ChangePaymentMode = () => {
  const [mainReceipt, setMainReceipt] = useState("2");
  const [paymentMode, setPaymentMode] = useState([]);
  const [load, setLoad] = useState(false);
  const [BankName, setBankName] = useState([]);
  const [loadingSecond, setLoadingSecond] = useState(false);
  const [tableData, setTableData] = useState({});
  const [payload, setPayload] = useState({
    LabNo: "",
  });

const { t } = useTranslation();
  const fetch = () => {
    setLoad(true);
    axios
      .post("/api/v1/ChangePaymentMode/GetPaymentModeData", payload)
      .then((res) => {
        const { GetData, GetReceiptData } = res.data.message;
        const data = GetReceiptData?.map((ele) => {
          return {
            ...ele,
            PatientID: GetData[0]?.PatientId,
            CentreID: GetData[0]?.CentreID,
            LedgerTransactionID: GetData[0]?.LedgerTransactionId,
            VisitNo: GetData[0]?.LedgerTransactionNo,
            NewPaymentMode: "",
            NewPaymentModeID: "",
            Bank: "",
            CardNo: "",
            CardDate: "",
            TypeToPerform: "",
            Naration: "",
            isChecked: false,
          };
        });

        setTableData({
          patientData: GetData[0],
          tableData: data,
        });
        setLoad(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const dateSelect = (date, name) => {
    setTableData({
      ...tableData,
      [name]: date,
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleChangeMap = (e, i) => {
    const data = [...tableData?.tableData];
    const { name, value } = e.target;
    console.log(e.target);

    if (name === "NewAmount") {
      if (value > data[i]["DueAmount"]) {
        toast.error("please Enter Value Amount");
      } else {
        data[i][name] = value;
        setTableData({ ...tableData, tableData: data });
      }
    } else {
      if (name === "NewPaymentModeID") {
        const findOne = paymentMode.find((ele) => ele.value == value);
        data[i]["NewPaymentMode"] = findOne?.label;
        data[i]["BankName"] = "";
        data[i]["CardNo"] = "";
        data[i]["Naration"] = "";
        data[i]["TransactionNo"] = "";
        data[i]["CardDate"] = "";
      }

      data[i][name] = value;
      setTableData({ ...tableData, tableData: data });
    }
  };

  const handleChangeIndex = (e, index) => {
    const { name, value, type, checked } = e.target;
    const data = [...tableData?.tableData];
    if (mainReceipt === "2") {
      if (type === "checkbox") {
        if (checked) {
          const { disable, message } = validate(
            data[index]["Naration"],
            data[index]["NewPaymentMode"],
            index
          );
          if (!disable) {
            data[index][name] = checked;
          } else {
            toast.error(message);
          }
        } else {
          data[index][name] = checked;
        }
      } else {
        data[index][name] = value;
      }
      setTableData({ ...tableData, tableData: data });
    }

    if (mainReceipt === "1") {
      if (type === "checkbox") {
        if (checked) {
          if (data[index]["Naration"] !== "") {
            data[index][name] = checked;
          } else {
            toast.error("Please Enter Naration");
          }
        } else {
          data[index][name] = checked;
        }
      } else {
        data[index][name] = value;
      }
      setTableData({ ...tableData, tableData: data });
    }
  };

  const validate = (condition1, condition, index) => {
    let disable = false;
    let message = "";

    if (condition === "") {
      disable = true;
      message = "Please Choose Payment Mode";
    } else if (["Paytm", "Online Payment"].includes(condition)) {
      if (tableData?.tableData[index]["TransactionNo"].length < 10) {
        disable = true;
        message = "Please Fill Correct Transaction Number";
      }
    } else if (["Debit Card", "Credit Card", "Cheque"].includes(condition)) {
      if (tableData?.tableData[index]["BankName"] === "") {
        disable = true;
        message = "Please Choose BankName";
      } else if (tableData?.tableData[index]["CardNo"].length < 15) {
        disable = true;
        message = `Please Enter Valid ${condition} Number`;
      }
    }
    if (condition1 === "") {
      disable = true;
      message = "Please Enter Naration";
    }

    return {
      disable: disable,
      message: message,
    };
  };

  const submit = () => {
    setLoadingSecond(true);
    const data = tableData?.tableData.filter((ele) => ele?.isChecked === true);
    const val = data?.map((ele) => {
      return {
        ...ele,
        TypeToPerform: mainReceipt,
        CardDate: moment(ele?.CardDate).format("DD-MMM-YYYY"),
      };
    });
    axios
      .post("/api/v1/ChangePaymentMode/SavePaymentModeData", {
        SavePaymentModeData: val,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        fetch();
        setLoadingSecond(false);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
        setLoadingSecond(false);
      });
  };

  const HideSave = () => {
    let show = false;
    for (let i = 0; i < tableData?.tableData?.length; i++) {
      if (tableData?.tableData[i]["isChecked"] === true) {
        show = true;
        break;
      }
    }
    return show;
  };

  useEffect(() => {
    getPaymentModes("PaymentMode", setPaymentMode);
    getPaymentModes("BankName", setBankName);
  }, []);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Change Payment Mode")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-sm-4">
              <div className="box">
                <div className="box-header">
                  <h3 className="box-title">{t("Search Details")}</h3>
                </div>
                <div className="box-body">
                  <div className="row">
                    <label htmlFor="inputEmail3" className="col-sm-3">
                      {t("Visit No")}:
                    </label>
                    <div className="col-sm-5">
                      {/* <label htmlFor="inputEmail3" className="col-sm-1">
                      Visit No.
                    </label> */}
                      <Input
                        name="LabNo"
                        className="select-input-box form-control input-sm"
                        value={payload?.LabNo}
                        onChange={handleChange}
                        type="text"
                      />
                    </div>
                    <div
                      className="col-sm-2 mt-2"
                      style={{ alignItems: "flex-end" }}
                    >
                      {load ? (
                        <Loading />
                      ) : (
                        <button
                          className="btn btn-block btn-info btn-sm"
                          onClick={fetch}
                        >
                          {t("Search")}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div
                  className="row"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <div className="col-sm-4" style={{ marginBottom: "40px" }}>
                    <input
                      type="radio"
                      name="mainReceipt"
                      //   className="select-input-box form-control input-sm mt-4"
                      checked={mainReceipt == 1}
                      onChange={(e) => {
                        setMainReceipt("1");
                        fetch();
                      }}
                      disabled
                    ></input>
                    <label className="control-label" htmlFor="center">
                      {t("Main Booking")}
                    </label>
                  </div>

                  <div className="col-sm-4">
                    <input
                      type="radio"
                      name="mainReceipt"
                      //   className="select-input-box form-control input-sm mt-4"
                      checked={mainReceipt == 2}
                      onChange={(e) => {
                        setMainReceipt("2");
                        fetch();
                      }}
                    ></input>
                    <label className="control-label" htmlFor="center">
                     {t("Receipt")}
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}

            <div className="col-sm-8">
              <div className="box">
                <div className="box-header with-border py-3">
                  <h3 className="box-title">{t("Patient Details")}</h3>
                </div>
                <div className="box-body mb-4 mt-2">
                  <div className="row">
                    <div className="col-sm-4">
                      <label className="control-label" htmlFor="center">
                        {t("Patient ID")} :
                        <span
                          style={{ fontWeight: "600", marginLeft: "15px" }}
                          className="mx-3"
                        >
                          {tableData?.patientData?.PatientId}
                        </span>
                      </label>
                    </div>

                    <div className="col-sm-4">
                      <label className="control-label" htmlFor="center">
                        {t("Patient Name")}:
                        <span
                          style={{ fontWeight: "600", marginLeft: "15px" }}
                          className="mx-3"
                        >
                          {tableData?.patientData?.PName}
                        </span>
                      </label>
                    </div>

                    <div className="col-sm-4">
                      <label className="control-label" htmlFor="center">
                        {t("Age/Gender")}:
                        <span
                          id="lbl"
                          style={{ fontWeight: "600",marginLeft:"15px" }}
                          className="mx-3"
                        >
                          {tableData?.patientData?.Age}
                          {tableData?.patientData?.Gender ? " / " : ""}
                          {tableData?.patientData?.Gender}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-4">
                      <label className="control-label" htmlFor="center">
                        {t("Amount Paid")}:
                      </label>
                      <span
                        style={{ fontWeight: "600", marginLeft: "15px" }}
                        className="mx-3"
                      >
                        {tableData?.patientData?.Adjustment}
                      </span>
                    </div>

                    <div className="col-sm-4">
                      <label className="control-label" htmlFor="center">
                        {t("Doctor")}:
                        <span
                          style={{ fontWeight: "600", marginLeft: "15px" }}
                          className="mx-3"
                        >
                          {tableData?.patientData?.DoctorName}
                        </span>
                      </label>
                    </div>

                    <div className="col-sm-4">
                      <label className="control-label" htmlFor="center">
                        {t("Net Amount")}:
                        <span
                          style={{ fontWeight: "600", marginLeft: "15px" }}
                          className="mx-3"
                        >
                          {tableData?.patientData?.NetAmount}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-sm-4">
                      <label className="control-label" htmlFor="center">
                        {t("Visit No")}:
                        <span
                          style={{ fontWeight: "600", marginLeft: "15px" }}
                          className="mx-3"
                        >
                          {tableData?.patientData?.LedgerTransactionNo}
                        </span>
                      </label>
                    </div>
                    <div className="col-sm-4">
                      <label className="control-label" htmlFor="center">
                        {t("Due Amount")}:
                        <span
                          style={{ fontWeight: "600", marginLeft: "15px" }}
                          className="mx-3"
                        >
                          {tableData?.patientData?.DueAmount}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}
          </div>
          {tableData?.tableData?.length > 0 && (
            <div className="box box-info">
              <div className="box-header with-border">
                <h3 className="box-title">{t("Search Results")}</h3>
              </div>

              <div className="box-body divResult" id="no-more-tables">
                <div className="row">
                  <table
                    className="table table-bordered table-hover table-striped tbRecord"
                    cellPadding="{0}"
                    cellSpacing="{0}"
                  >
                    <thead className="cf">
                      <tr>
                        {[
                          t("S.No"),
                          t("Receipt No."),
                          t("Amount"),
                          t("Payment Mode"),
                          t("Select"),
                        ].map((ele, index) => (
                          <th key={index}>{ele}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData?.tableData?.map((ele, index) => (
                        <>
                          <tr key={index}>
                            <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                            <td data-title={t("Receipt No.")}>
                              {ele?.ReceiptNo}&nbsp;
                            </td>
                            <td data-title={t("Amount")}>
                              {ele?.Amount}&nbsp;
                            </td>
                            <td data-title={t("Payment Mode")}>
                              {ele?.PaymentMode}&nbsp;
                            </td>
                            <td data-title={t("Select")}>
                              <input
                                type="checkbox"
                                name="isChecked"
                                checked={ele?.isChecked}
                                onChange={(e) => handleChangeIndex(e, index)}
                              ></input>
                            </td>
                          </tr>
                          {mainReceipt === "2" ? (
                            <tr>
                              <td colSpan={12} data-title="NewPaymentModeID">
                                <div className="row">
                                  <div className="col-sm-2">
                                    <div>
                                      <select
                                        className="form-control input-sm required"
                                        name="NewPaymentModeID"
                                        value={ele?.NewPaymentModeID}
                                        disabled={ele?.isChecked}
                                        onChange={(e) => {
                                          handleChangeMap(e, index);
                                        }}
                                      >
                                        <option hidden>PaymentMode</option>
                                        {paymentMode.map((ele, index) => (
                                          <option
                                            key={index}
                                            value={ele?.value}
                                            aria-label={ele?.label}
                                          >
                                            {ele?.label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>

                                  {[
                                    "Cheque",
                                    "Credit Card",
                                    "Debit Card",
                                  ].includes(ele?.NewPaymentMode) && (
                                    <div className="col-sm-2">
                                      <div>
                                        <select
                                          className="form-control input-sm"
                                          name="BankName"
                                          value={ele?.BankName}
                                          placeholder={t("BankName")}
                                          disabled={ele?.isChecked}
                                          onChange={(e) => {
                                            handleChangeMap(e, index);
                                          }}
                                        >
                                          <option value="" disabled>
                                            Bank Name
                                          </option>
                                          {BankName.map((ele, index) => (
                                            <option
                                              value={ele.value}
                                              key={index}
                                            >
                                              {ele.label}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>
                                  )}

                                  {["Cheque"].includes(ele?.NewPaymentMode) && (
                                    <div className="col-sm-2">
                                      <div>
                                        <Input
                                          className="select-input-box form-control input-sm"
                                          name="CardNo"
                                          type="text"
                                          disabled={ele?.isChecked}
                                          placeholder={t("Cheque No")}
                                          value={ele?.CardNo}
                                          onChange={(e) => {
                                            handleChangeMap(e, index);
                                          }}
                                          max={16}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {["Credit Card", "Debit Card"].includes(
                                    ele?.NewPaymentMode
                                  ) && (
                                    <div className="col-sm-2">
                                      <div>
                                        <Input
                                          className="select-input-box form-control input-sm"
                                          name="CardNo"
                                          disabled={ele?.isChecked}
                                          placeholder={t("Card No")}
                                          type="number"
                                          value={ele?.CardNo}
                                          onInput={(e) => number(e, 16)}
                                          onChange={(e) => {
                                            handleChangeMap(e, index);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {["Online Payment", "Paytm"].includes(
                                    ele?.NewPaymentMode
                                  ) && (
                                    <div className="col-sm-2">
                                      <div>
                                        <Input
                                          className="select-input-box form-control input-sm"
                                          name="TransactionNo"
                                          disabled={ele?.isChecked}
                                          type="text"
                                          placeholder={t("Transaction No")}
                                          value={ele?.TransactionNo}
                                          onChange={(e) => {
                                            handleChangeMap(e, index);
                                          }}
                                          max={16}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {[
                                    "Credit Card",
                                    "Debit Card",
                                    "Cheque",
                                  ].includes(ele?.NewPaymentMode) && (
                                    <div className="col-sm-2">
                                      <div>
                                        <DatePicker
                                          name="DATE"
                                          type="date"
                                          date={tableData?.DATE}
                                          onChange={dateSelect}
                                          maxDate={new Date()}
                                        />
                                      </div>
                                    </div>
                                  )}

                                  <div className="col-sm-2">
                                    <div>
                                      <Input
                                        className="select-input-box form-control input-sm"
                                        name="Naration"
                                        placeholder={t("Naration")}
                                        disabled={ele?.isChecked}
                                        type="text"
                                        value={ele?.Naration}
                                        onChange={(e) => {
                                          handleChangeMap(e, index);
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          ) : (
                            <tr>
                              <td colSpan={12} data-title={t("Mode")}>
                                <div className="mt-3">
                                  <div className="col-sm-2">
                                    <label>{t("Mode")}: </label>
                                    <p>
                                      <span className="text-danger font-weight-bold">
                                        {ele?.PaymentMode.toLowerCase() ===
                                        "cash"
                                          ? "Cash To Credit"
                                          : "Credit To Cash"}
                                      </span>
                                    </p>
                                  </div>

                                  <div className="col-sm-2">
                                    <label>{t("Naration")}:</label>
                                    <Input
                                      className="select-input-box form-control input-sm"
                                      name="Naration"
                                      placeholder={t("Naration")}
                                      disabled={ele?.isChecked}
                                      type="text"
                                      value={ele?.Naration}
                                      onChange={(e) => {
                                        handleChangeMap(e, index);
                                      }}
                                    />
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {HideSave() &&
                (loadingSecond ? (
                  <Loading />
                ) : (
                  <div className="box-footer">
                    <div className="col-sm-1">
                      <button
                        className="btn btn-block btn-success btn-sm"
                        onClick={submit}
                      >
                        {t("Save")}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChangePaymentMode;
