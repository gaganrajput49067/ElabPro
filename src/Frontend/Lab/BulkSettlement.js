import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getPaymentModes } from "../util/Commonservices";
import axios from "axios";
import { SelectBox } from "../../ChildComponents/SelectBox";
import Input from "../../ChildComponents/Input";
import Loading from "../util/Loading";
import { PayBy } from "../../ChildComponents/Constants";
import { toast } from "react-toastify";
import moment from "moment";
import { dateConfig } from "../util/DateConfig";
import { number } from "../util/Commonservices/number";
import DatePicker from "../Components/DatePicker";

import { useTranslation } from "react-i18next";


const BulkSettlement = () => {
  const [paymentMode, setPaymentMode] = useState([]);
  const [BankName, setBankName] = useState([]);
  const [load, setLoad] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingSecond, setLoadingSecond] = useState(false);
  const [CentreData, setCentreData] = useState([]);
  const [formTable, setFormTable] = useState([]);
  const [payload, setPayload] = useState({
    FromDate: new Date(),
    FromTime: "00:00:00",
    ToDate: new Date(),
    ToTime: "23:59:59",
    DueAmount: "0",
    CentreID: "",
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
        CentreDataValue.unshift({ label: "All Centre", value: "" });
        setCentreData(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAccessCentres();
  }, []);

  const dateSelect = (date, name) => {
    setPayload({
      ...payload,
      [name]: date,
    });
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    if (name === "PaymentModeID") {
      const data = paymentMode?.find((ele) => value === value);
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

  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;

    setPayload({ ...payload, [secondName]: TimeStamp });
  };

  const handleChanges = (e) => {
    const { name, value, checked, type } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const handleChangeIndex = (e, index) => {
    const { name, value, type, checked } = e.target;
    const data = [...formTable];
    if (type === "checkbox") {
      if (checked) {
        const { disable, message } = validate(
          data[index]["PaymentMode"],
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
    setFormTable(data);
  };

  const submit = () => {
    setLoadingSecond(true);
    const data = formTable.filter((ele) => ele?.isChecked === true);
    axios
      .post("/api/v1/Settlement/SaveBulkSettlementData", {
        SettlementData: data,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        fetch();
        setLoadingSecond(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );

        setLoadingSecond(false);
      });
  };

  const fetch = () => {
    setLoading(true);
    axios
      .post("/api/v1/Settlement/GetBulkDataToSettlement", {
        ...payload,
        FromDate: moment(payload?.FromDate).format("DD/MMM/YYYY"),
        ToDate: moment(payload?.ToDate).format("DD/MMM/YYYY"),
      })
      .then((res) => {
        let data = res?.data?.message;
        let val = data.map((ele) => {
          return {
            ...ele,
            isChecked: false,
            PayBy: "0",
            PaymentMode: "",
            TransactionNo: "",
            BankName: "",
            CardNo: "",
            UpdateRemarks: "",
            NewAmount: ele?.DueAmount,
            S_Currency: "1",
            S_Notation: "INR",
            C_Factor: "",
            S_CountryID: "",
            S_Amount: "",
          };
        });
        setFormTable(val);
        setLoading(false);
        setLoad(true);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
        setLoading(false);
      });
  };

  const handleChangeMap = (e, i) => {
    const data = [...formTable];
    const { name, value } = e.target;
    console.log(e.target);

    if (name === "NewAmount") {
      if (value > data[i]["DueAmount"]) {
        toast.error("please Enter Value Amount");
      } else {
        data[i][name] = value;
        setFormTable(data);
      }
    } else {
      if (name === "PaymentModeID") {
        const findOne = paymentMode.find((ele) => ele.value == value);
        data[i]["PaymentMode"] = findOne?.label;
        data[i]["BankName"] = findOne?.label;
        data[i]["CardNo"] = "";
        data[i]["UpdateRemarks"] = "";
        data[i]["TransactionNo"] = "";
      }

      data[i][name] = value;
      setFormTable(data);
    }
  };

  const HideSave = () => {
    let show = false;
    for (let i = 0; i < formTable.length; i++) {
      if (formTable[i]["isChecked"] === true) {
        show = true;
        break;
      }
    }
    return show;
  };

  const validate = (condition, index) => {
    let disable = false;
    let message = "";
    if (condition === "") {
      disable = true;
      message = "Please Choose Payment Mode";
    } else if (["Paytm", "Online Payment"].includes(condition)) {
      if (formTable[index]["TransactionNo"].length < 10) {
        disable = true;
        message = "Please Fill Correct Transaction Number";
      }
    } else if (["Debit Card", "Credit Card", "Cheque"].includes(condition)) {
      if (formTable[index]["BankName"] === "") {
        disable = true;
        message = "Please Choose BankName";
      } else if (formTable[index]["CardNo"].length < 16) {
        disable = true;
        message = `Please Enter Valid ${condition} Number`;
      }
    }

    return {
      disable: disable,
      message: message,
    };
  };

  useEffect(() => {
    getPaymentModes("PaymentMode", setPaymentMode);
    getPaymentModes("BankName", setBankName);
  }, []);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Bulk Settlement")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1" htmlFor="center">
              {t("Center Name")}:
            </label>
            <div className="col-sm-2">
              <SelectBox
                options={CentreData}
                formdata={payload.CentreID}
                selectedValue={payload?.CentreID}
                name="CentreID"
                onChange={handleSelectChange}
              />
            </div>

            <label className="col-sm-1" htmlFor="center">
              {t("From Date")}:
            </label>
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
            
            <label className="col-sm-1" htmlFor="center">
              {t("To Date")}:
            </label>
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

            <div className="col-sm-1" style={{ alignSelf: "flex-end" }}>
              <Input
                name="DueAmount"
                type="checkbox"
                checked={payload?.DueAmount == "1" ? true : false}
                onChange={handleChanges}
              />
              <label className="control-label" htmlFor="isActive">
                {t("Due Patient")}
              </label>
            </div>

            <div
              className="col-sm-1"
              style={{ alignSelf: "flex-end" }}
            >
              <div>
                <button
                  className="btn btn-block btn-info btn-sm"
                  onClick={fetch}
                >
                  {t("Search")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        load && (
          <div className="box">
            <div
              className={`box-body divResult table-responsive ${
                formTable.length > 8 && "boottable"
              }`}
              id="no-more-tables"
            >
              <div className="row">
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf text-center" style={{ zIndex: 99 }}>
                    <tr>
                      <th>{t("S.No")}</th>
                      <th>{t("RegDate")}</th>
                      <th>{t("Lab No")}</th>
                      <th>{t("Patient Name")}</th>
                      <th>{t("Centre")}</th>
                      <th>{t("Rate Type")}</th>
                      <th>{t("Gross Amount")}</th>
                      <th>{t("Discount Amount")}</th>
                      <th>{t("Net Amount")}</th>
                      <th>{t("Paid Amount")}</th>
                      <th>{t("Due Amount")}</th>
                      <th>{t("#")}</th>
                    </tr>
                  </thead>
                  {formTable.length > 0 && (
                    <tbody>
                      {formTable.map((ele, index) => (
                        <>
                          <tr key={index}>
                            <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                            <td data-title={t("RegDate")}>
                              {dateConfig(ele?.RegDate)}&nbsp;
                            </td>
                            <td data-title={t("Lab No")}>
                              {ele.LedgerTransactionNo}&nbsp;
                            </td>
                            <td data-title={t("Patient Name")}>{ele.PName}&nbsp;</td>
                            <td data-title={t("Centre")}>{ele.Centre}&nbsp;</td>
                            <td data-title={t("Rate Type")}>{ele.RateType}&nbsp;</td>
                            <td data-title={t("Gross Amount")}>{ele.Rate}&nbsp;</td>
                            <td data-title={t("Discount Amount")}>
                              {ele.DiscAmt}&nbsp;
                            </td>
                            <td data-title={t("Net Amount")}>{ele.Amount}&nbsp;</td>
                            <td data-title={t("Paid Amount")}>
                              {ele.PaidAmount}&nbsp;
                            </td>
                            <td data-title={t("Due Amount")}>
                              {ele.DueAmount}&nbsp;
                            </td>
                            <td data-title={t("#")}>
                              <input
                                type="checkbox"
                                name="isChecked"
                                checked={ele?.isChecked}
                                onChange={(e) => handleChangeIndex(e, index)}
                              ></input>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={12}>
                              <div className="px-2">
                                <div className="col-sm-2">
                                  <div>
                                    <select
                                      className="form-control input-sm required"
                                      name="PayBy"
                                      value={ele?.PayBy}
                                      onChange={(e) => {
                                        handleChangeMap(e, index);
                                      }}
                                    >
                                      <option hidden>{t("Pay By")}</option>
                                      {PayBy.map((ele, index) => (
                                        <option key={index} value={ele?.value}>
                                          {ele?.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="col-sm-2">
                                  <div>
                                    <Input
                                      className="select-input-box form-control input-sm"
                                      name="NewAmount"
                                      type="number"
                                      placeholder={t("DueAmount")}
                                      onInput={(e) => {
                                        number(
                                          e,
                                          String(ele?.DueAmount).length
                                        );
                                      }}
                                      value={ele?.NewAmount}
                                      onChange={(e) => {
                                        handleChangeMap(e, index);
                                      }}
                                    />
                                  </div>
                                </div>

                                <div className="col-sm-2">
                                  <div>
                                    <select
                                      className="form-control input-sm required"
                                      name="PaymentModeID"
                                      value={ele?.PaymentModeID}
                                      onChange={(e) => {
                                        handleChangeMap(e, index);
                                      }}
                                    >
                                      <option hidden>{t("PaymentMode")}</option>
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
                                ].includes(ele?.PaymentMode) && (
                                  <div className="col-sm-2">
                                    <div>
                                      <select
                                        className="form-control input-sm"
                                        name="BankName"
                                        value={ele?.BankName}
                                        onChange={(e) => {
                                          handleChangeMap(e, index);
                                        }}
                                      >
                                        <option hidden>{t("Bank Name")}</option>
                                        {BankName.map((ele, index) => (
                                          <option value={ele.value} key={index}>
                                            {ele.label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                )}

                                {["Cheque"].includes(ele?.PaymentMode) && (
                                  <div className="col-sm-2">
                                    <div>
                                      <Input
                                        className="select-input-box form-control input-sm"
                                        name="CardNo"
                                        type="text"
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
                                {/* {["Cheque"].includes(ele?.PaymentMode) && (
                                      <div className="col-sm-2">
                                        <div>
                                          <CustomDate
                                            name="CardDate"
                                            placeholder="Cheque Date"
                                            value={payload?.CardDate}
                                            className="form-control pull-right reprint-date required"
                                            onChange={dateSelect}
                                            maxDate={new Date()}
                                          />
                                        </div>
                                      </div>
                                    )} */}

                                {["Credit Card", "Debit Card"].includes(
                                  ele?.PaymentMode
                                ) && (
                                  <div className="col-sm-2">
                                    <div>
                                      <Input
                                        className="select-input-box form-control input-sm"
                                        name="CardNo"
                                        placeholder={t("Card No")}
                                        type="text"
                                        value={ele?.CardNo}
                                        max={16}
                                        onChange={(e) => {
                                          handleChangeMap(e, index);
                                        }}
                                      />
                                    </div>
                                  </div>
                                )}

                                {["Online Payment", "Paytm"].includes(
                                  ele?.PaymentMode
                                ) && (
                                  <div className="col-sm-2">
                                    <div>
                                      <Input
                                        className="select-input-box form-control input-sm"
                                        name="TransactionNo"
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

                                <div className="col-sm-2">
                                  <div>
                                    <Input
                                      className="select-input-box form-control input-sm"
                                      name="UpdateRemarks"
                                      placeholder={t("Remark")}
                                      type="text"
                                      value={ele?.UpdateRemarks}
                                      onChange={(e) => {
                                        handleChangeMap(e, index);
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </>
                      ))}
                    </tbody>
                  )}
                </table>
                {HideSave() &&
                  (loadingSecond ? (
                    <Loading />
                  ) : (
                    <div className="col-sm-1 form-group mt-3">
                      <button
                        className="btn btn-block btn-success btn-sm"
                        onClick={submit}
                      >
                        {t("Save")}
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )
      )}
    </>
  );
};

export default BulkSettlement;
