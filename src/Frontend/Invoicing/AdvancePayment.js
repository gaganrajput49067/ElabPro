import React, { useEffect, useState } from "react";
import Input from "../../ChildComponents/Input";
import axios from "axios";
import { getPaymentModes } from "../../Frontend/util/Commonservices";
import { number } from "../../Frontend/util/Commonservices/number";
import { toast } from "react-toastify";
import moment from "moment";
import Loading from "../../Frontend/util/Loading";
import { SelectBox } from "../../ChildComponents/SelectBox";
import DatePicker from "../Components/DatePicker";
import { dateConfig } from "../util/DateConfig";
import { useTranslation } from "react-i18next";
import { RADIOADVANCEINPUT } from "../../ChildComponents/Constants";

function AdvancePayment() {
  const [errors, setErrors] = useState({});
  const [CentreData, setCentreData] = useState([]);
  const [PaymentMode, setPaymentMode] = useState([]);
  const [loadingSecond, setLoadingSecond] = useState(false);
  const [BankName, setBankName] = useState([]);
  const [AdvancePaymentDetail, setAdvancePaymentDetail] = useState([]);

  const [formData, setFormData] = useState({
    paymentModeID: "",
    TransactionId: "",
    InvoiceNo: "",
    InvoiceAmount: "",
    ReceivedAmt: "",
    PaymentMode: "",
    BankName: "",
    CreditCardNo: "",
    DraftNo: "",
    ChequeNo: "",
    ChequeDate: new Date(),
    ReceiveDate: new Date(),
    RateTypeID: "",
    AdvanceAmtDate: new Date(),
    CreditNote: "1",
    Remarks: "",
  });

  // const handleSelectChange = (event, rest) => {
  //   const { name } = rest;
  //   if (name === "paymentModeID") {
  //     setFormData({
  //       ...formData,
  //       [name]: event.value,
  //       PaymentMode: event.label,
  //     });
  //   } else {
  //     setFormData({ ...formData, [name]: event.value });
  //   }
  // };

  const { t } = useTranslation();

  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;

    setFormData({ ...formData, [secondName]: TimeStamp });
  };
  const handleSelectChange = (event) => {
    const { name, value, selectedIndex } = event.target;
    const label = event.target.children[selectedIndex].text;

    if (name === "paymentModeID") {
      setFormData({
        ...formData,
        [name]: value,
        PaymentMode: label, // event.label,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRadioSelect = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // console.log(formData);

  const validate = (condition1, condition, InvoiceAmt) => {
    let disable = false;
    let message = "";
    if (condition === "") {
      disable = true;
      message = "Please Choose Payment Mode";
    } else if (["Paytm", "Online Payment"].includes(condition)) {
    } else if (["Debit Card", "Credit Card"].includes(condition)) {
      if (formData["BankName"] === "") {
        disable = true;
        message = "Please Choose BankName";
      } else if (formData["CreditCardNo"].length < 15) {
        disable = true;
        message = `Please Enter Valid ${condition} Number`;
      }
    } else if (["Cheque"].includes(condition)) {
      if (formData["BankName"] === "") {
        disable = true;
        message = "Please Choose BankName";
      } else if (formData["ChequeNo"].length < 15) {
        disable = true;
        message = `Please Enter Valid ${condition} Number`;
      }
    }

    if (condition) {
      if (InvoiceAmt === "" || InvoiceAmt == 0) {
        disable = true;
        message = "Please Enter InvoiceAmt";
      }
      if (condition1 === "") {
        disable = true;
        message = "Please Enter Remarks";
      }
      if (condition != "Cash") {
        if (formData["TransactionId"].length < 10) {
          disable = true;
          message = "Please Fill Correct Transaction Number";
        }
      }
    }
    return {
      disable: disable,
      message: message,
    };
  };

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

        setCentreData(CentreDataValue);
        setFormData({
          ...formData,
          RateTypeID: CentreDataValue[0]?.value,
        });
      })
      .catch((err) => console.log(err));
  };

  const AdvancePaymentDetail1 = () => {
    axios
      .post("/api/v1/Accounts/AdvancePaymentDetail", {
        ClientID: formData?.RateTypeID,
        CreditNote: formData?.CreditNote,
      })
      .then((res) => {
        setAdvancePaymentDetail(res?.data?.data);
      })
      .catch();
    // setErrors(generatedError);
  };

  const dateSelect = (date, name) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const handleSave = () => {
    const { disable, message } = validate(
      formData["Remarks"],
      formData["PaymentMode"],
      formData.InvoiceAmount
      // formData["TransactionId"]
    );

    if (!disable) {
      setLoadingSecond(true);
      axios
        .post("/api/v1/Accounts/InsertAdvancePayment", {
          ...formData,
          ReceiveDate: moment(formData?.ReceiveDate).format("DD-MMM-YYYY"),
          ChequeDate: moment(formData?.ChequeDate).format("DD-MMM-YYYY"),
          AdvanceAmtDate: moment(formData?.AdvanceAmtDate).format(
            "DD-MMM-YYYY"
          ),
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setLoadingSecond(false);
          setFormData({
            paymentModeID: "",
            TransactionId: "",
            InvoiceNo: "",
            InvoiceAmount: "",
            ReceivedAmt: "",
            PaymentMode: "",
            BankName: "",
            CreditCardNo: "",
            DraftNo: "",
            ChequeNo: "",
            ChequeDate: new Date(),
            ReceiveDate: new Date(),
            RateTypeID: formData?.RateTypeID,
            AdvanceAmtDate: new Date(),
            CreditNote: "1",
            Remarks: "",
          });

          AdvancePaymentDetail1();
        })
        .catch((err) => {
          toast.error(
            err?.data?.message ? err?.data?.message : "Something Went Wrong"
          );
          setLoadingSecond(false);
        });
    } else {
      toast.error(message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    getAccessCentres();
    getPaymentModes("PaymentMode", setPaymentMode);
    getPaymentModes("BankName", setBankName);
  }, []);

  useEffect(() => {
    if (formData?.RateTypeID) {
      AdvancePaymentDetail1();
    }
  }, [formData?.RateTypeID, formData?.CreditNote]);

  console.log(formData);

  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Advance Payment")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-sm-2 col-xs-6 col-md-2  mt-4">
              <label>
                <small>{t("Centre")}:</small>{" "}
              </label>
              <SelectBox
                options={CentreData}
                name="RateTypeID"
                selectedValue={formData?.RateTypeID}
                onChange={handleSelectChange}
                className={"input-sm"}
              />
            </div>
            <div className="col-sm-2 col-xs-6 col-md-2 mt-4">
              <label>
                <small>{t("ReceivedDate")}:</small>{" "}
              </label>
              <div id="ReceivedDate">
                <DatePicker
                  name="AdvanceAmtDate"
                  date={formData?.AdvanceAmtDate}
                  onChange={dateSelect}
                  onChangeTime={handleTime}
                  // secondName="AdvanceAmtDate"
                  maxDate={new Date()}
                />

                {errors?.FromDate && (
                  <span className="golbal-Error">{errors?.FromDate}</span>
                )}
              </div>
            </div>
            <div className="col-sm-2 col-xs-6 col-md-2  mt-4">
              <label>
                <small>{t("Advance Amount")}:</small>{" "}
              </label>
              <Input
                placeholder={t("Advance Amount")}
                className="form-control ui-autocomplete-input input-sm"
                disabled={true}
              />
            </div>

            <div className="col-sm-2 col-xs-6 col-md-6  mt-4">
              {RADIOADVANCEINPUT.map((ele, index) => (
                <span key={index}>
                  <Input
                    type="radio"
                    name="CreditNote"
                    value={ele?.value}
                    checked={formData?.CreditNote === ele?.value && true}
                    onChange={handleRadioSelect}
                  />
                  <label className="mx-2">
                    <small>{ele?.label}</small>
                  </label>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="box box-success">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Payment Detail")}</h3>
        </div>

        <div className="box-body">
          <div className="row">
            <div className="col-sm-2">
              <label htmlFor="inputEmail3">
                <small> {t("DataType")}:</small>
              </label>
              <SelectBox
                options={[{ label: "Select Payment Mode" }, ...PaymentMode]}
                onChange={handleSelectChange}
                name="paymentModeID"
                className={"input-sm"}
                selectedValue={(PaymentMode, formData?.paymentModeID)}
              />
            </div>

            <div className="col-sm-2">
              <label htmlFor="inputEmail3">
                <small> {t("CUR.Round")}:</small>
              </label>
              <Input
                defaultValue="0"
                className="form-control ui-autocomplete-input input-sm"
                disabled={true}
              />
            </div>
            <div className="col-sm-2">
              <label htmlFor="inputEmail3">
                <small>{t("TransactionID")}:</small>
              </label>
              <Input
                name="TransactionId"
                placeholder={t("TransactionID")}
                className="form-control ui-autocomplete-input input-sm"
                type="number"
                onInput={(e) => number(e, 12)}
                value={formData?.TransactionId}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-2">
              <label htmlFor="inputEmail3">
                <small>{t("Remarks")}:</small>
              </label>
              <Input
                type="text"
                placeholder={t("Remarks")}
                className="form-control ui-autocomplete-input input-sm"
                name="Remarks"
                value={formData?.Remarks}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="row">
            <div className=" box-body divResult boottable" id="no-more-tables">
              <table
                className="table table-bordered table-hover table-striped tbRecord"
                cellPadding="{0}"
                cellSpacing="{0}"
              >
                <thead class="cf">
                  <tr>
                    {[
                      "Payment Mode",
                      "Paid Amt.",
                      "Currency",
                      "Base",
                      ["Cheque", "Credit Card", "Debit Card"].includes(
                        formData?.PaymentMode
                      )
                        ? t("Cheque/Card No.")
                        : "",
                      ["Cheque", "Credit Card", "Debit Card"].includes(
                        formData?.PaymentMode
                      )
                        ? "Cheque/Card Date"
                        : "",
                      ["Cheque", "Credit Card", "Debit Card"].includes(
                        formData?.PaymentMode
                      )
                        ? t("Bank Name")
                        : "",
                    ].map(
                      (ele, index) => ele !== "" && <th key={index}>{ele}</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-title={t("PaymentMode")}>
                      {formData?.PaymentMode}&nbsp;
                    </td>
                    <td data-title={t("Paid Amt.")}>
                      <Input
                        className="required w-100"
                        type="number"
                        name="InvoiceAmount"
                        onInput={(e) => number(e, 7)}
                        value={formData?.InvoiceAmount}
                        onChange={handleChange}
                      />
                    </td>
                    <td data-title={t("Currency")}>INR</td>
                    <td data-title={t("Base")}>0</td>
                    {["Cheque"].includes(formData?.PaymentMode) && (
                      <td data-title={t("Cheque No")}>
                        <Input
                          className="required"
                          type="number"
                          onInput={(e) => number(e, 16)}
                          name="ChequeNo"
                          value={formData?.ChequeNo}
                          onChange={handleChange}
                        />
                      </td>
                    )}

                    {["Credit Card", "Debit Card"].includes(
                      formData?.PaymentMode
                    ) && (
                      <td data-title={t("PaymentMode")}>
                        <Input
                          className=" required"
                          type="number"
                          onInput={(e) => number(e, 16)}
                          name="CreditCardNo"
                          value={formData?.CreditCardNo}
                          onChange={handleChange}
                        />
                      </td>
                    )}
                    {["Cheque", "Credit Card", "Debit Card"].includes(
                      formData?.PaymentMode
                    ) && (
                      <td data-title={t("PaymentMode")}>
                        {/* <CustomDate
                          // className=" required"
                        className="ui-autocomplete-input input-sm"   

                          name="ChequeDate"
                          value={formData?.ChequeDate}
                          onChange={dateSelect}
                          maxDate={new Date()}
                        /> */}

                        <div id="PaymentMode">
                          <DatePicker
                            name="ChequeDate"
                            date={formData?.ChequeDate}
                            onChange={dateSelect}
                            // onChangeTime={handleTime}
                            // secondName="AdvanceAmtDate"
                            maxDate={new Date()}
                          />

                          {errors?.FromDate && (
                            <span className="golbal-Error">
                              {errors?.FromDate}
                            </span>
                          )}
                        </div>
                      </td>
                    )}
                    {["Cheque", "Credit Card", "Debit Card"].includes(
                      formData?.PaymentMode
                    ) && (
                      <td data-title={t("BankName")}>
                        <select
                          // className=" required"
                          className="ui-autocomplete-input input-sm required"
                          name="BankName"
                          value={formData?.BankName}
                          onChange={handleChange}
                        >
                          <option hidden>Bank Name</option>
                          {BankName.map((ele, index) => (
                            <option value={ele.value} key={index}>
                              {ele.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    )}
                  </tr>
                </tbody>
              </table>
            </div>

            <div>
              {loadingSecond ? (
                <Loading />
              ) : (
                <>
                  <div className="row">
                    <div className="col-sm-1">
                      <button
                        className="btn btn-block btn-success btn-sm"
                        onClick={handleSave}
                      >
                        {t("Save")}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="box box-success">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Previous Advance Amount")}</h3>
        </div>
        <div className="box-body">
          <div
            className={`box-body divResult table-responsive ${
              AdvancePaymentDetail.length > 8 && "boottable"
            }`}
            id="no-more-tables"
          >
            {AdvancePaymentDetail.length > 0 ? (
              <table
                className="table table-bordered table-hover table-striped tbRecord"
                cellPadding="{0}"
                cellSpacing="{0}"
              >
                <thead class="cf">
                  <tr>
                    <th>{t("S.No")}</th>
                    <th>{t("ReceiptNo")}</th>
                    <th>{t("ClientCode")}</th>
                    <th>{t("ClientName")}</th>
                    <th>{t("ReceivedAmt")}</th>
                    <th>{t("PaymentMode")}</th>
                    <th>{t("AdvanceAmtDate")}</th>
                  </tr>
                </thead>
                <tbody>
                  {AdvancePaymentDetail?.map((data, index) => (
                    <tr key={index}>
                      <td data-title={t("S.No")}>
                        <div>{index + 1}</div>
                      </td>

                      <td data-title={t("ReceiptNo")}>
                        {data?.ReceiptNo}&nbsp;
                      </td>
                      <td data-title={t("ClientCode")}>
                        {data?.ClientCode}&nbsp;
                      </td>
                      <td data-title={t("ClientName")}>
                        {data?.ClientName}&nbsp;
                      </td>
                      <td data-title={t("ReceivedAmt")}>
                        {data?.ReceivedAmt}&nbsp;
                      </td>
                      <td data-title={t("PaymentMode")}>
                        {data?.PaymentMode}&nbsp;
                      </td>
                      <td data-title={t("AdvanceAmtDate")}>
                        {dateConfig(data.AdvanceAmtDate, 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdvancePayment;
