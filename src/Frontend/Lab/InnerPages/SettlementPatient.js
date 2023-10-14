import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import Input from "../../../ChildComponents/Input";
import { SelectBox } from "../../../ChildComponents/SelectBox";
import { getPaymentModes, selectedValueCheck } from "../../util/Commonservices";
import axios from "axios";
import { toast } from "react-toastify";
import { dateConfig } from "../../util/DateConfig";
import { PayBy } from "../../../ChildComponents/Constants";
import { useParams } from "react-router-dom";
import Loading from "../../util/Loading";
import CustomDate from "../../../ChildComponents/CustomDate";
import { number } from "../../util/Commonservices/number";

function SettlementPatient() {
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
    BankName: "",
    NewAmount:"",
    CardNo: "",
    CardDate: "",
    TransactionNo: "",
  });

  const ValidationField = () =>{
    
  }

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    if (name === "PaymentModeID") {
      const data = paymentMode?.find((ele) => ele?.value === event.value);
      setPayload({
        ...payload,
        [name]: data?.value,
        PaymentMode: data?.label,
        CardNo: "",
      });
    } else {
      setPayload({ ...payload, [name]: event.value });
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

  const handleSubmit = () => {
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
        setLoad(false);
        window.open(
          `/GetLabReportPreview/${tableData[0]?.LedgertransactionIDHash}`,
          "_blank"
        );
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
  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <div className="card shadow mb-4 mt-4">
          <div className="card-header py-3">
            <span className="m-0 font-weight-bold text-primary">
              Settlement Details
            </span>
          </div>
          <div className="card-body">
            <div className="row p-2">
              <Table responsive bordered striped hover>
                <thead>
                  <tr>
                    {[
                      "S.no",
                      "Reg Date",
                      "Lab No",
                      "Patient Name",
                      "Centre",
                      "Rate Type",
                      "Gross Amount",
                      "Discount Amount",
                      "Net Amount",
                      "Paid Amount",
                      "Due Amount",
                    ].map((ele, index) => (
                      <th key={index}>{ele}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((ele, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{dateConfig(ele?.RegDate)}</td>
                      <td>{ele?.LedgerTransactionNo}</td>
                      <td>{ele?.PName}</td>
                      <td>{ele?.Centre}</td>
                      <td>{ele?.RateType}</td>
                      <td>{ele?.Rate}</td>
                      <td>{ele?.DiscAmt}</td>
                      <td>{ele?.Amount}</td>
                      <td>{ele?.PaidAmount}</td>
                      <td>{ele?.DueAmount}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>

        <div className="card shadow mb-4 mt-4">
          <div className="card-header py-3">
            <span className="m-0 font-weight-bold text-primary">
            Settlement Details
            </span>
          </div>
          <div className="card-body px-4">
            <div>
              <p>
                <strong>Test Name</strong>:
                <span style={{ fontSize: "14px", color: "grey" }}>
                  {ComaSeparter()}
                </span>
              </p>
            </div>
            <div className="row ">
              <div className="col-sm-2 form group">
                <label className="control-label" htmlFor="Name">
                  Pay By
                </label>
                :
                <div>
                  <SelectBox
                    className="required"
                    name="PayBy"
                    options={PayBy}
                    selectedValue={selectedValueCheck(PayBy, payload?.PayBy)}
                    onChange={handleSelectChange}
                  />
                </div>
              </div>

              <div className="col-sm-2 form group">
                <label className="control-label" htmlFor="Name">
                  Amount
                </label>
                :
                <div>
                  <Input
                    className="form-control pull-right reprint-date required"
                    name="Amount"
                    type="number"
                    onInput={(e) => number(e, 10)}
                    value={payload?.Amount}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="col-sm-2 form group">
                <label className="control-label" htmlFor="Name">
                  PaymentMode
                </label>
                :
                <div>
                  <SelectBox
                    className="required"
                    options={paymentMode.filter(
                      (ele) => ele.label !== "Credit"
                    )}
                    name="PaymentModeID"
                    selectedValue={selectedValueCheck(
                      paymentMode,
                      payload?.PaymentModeID
                    )}
                    onChange={handleSelectChange}
                  />
                </div>
              </div>

              {["Cheque", "Credit Card", "Debit Card"].includes(
                payload?.PaymentMode
              ) && (
                <div className="col-sm-2 form group">
                  <label className="control-label" htmlFor="Name">
                    Bank Name
                  </label>
                  :
                  <div>
                    <select
                      className="required form-control pull-right reprint-date"
                      name="BankName"
                      value={payload?.BankName}
                      onChange={handleChange}
                    >
                      <option hidden>--Select Bank --</option>
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
                <div className="col-sm-2 form group">
                  <label className="control-label" htmlFor="Name">
                    Cheque No
                  </label>
                  :
                  <div>
                    <Input
                      className="form-control  pull-right reprint-date required"
                      name="CardNo"
                      type="text"
                      value={payload?.CardNo}
                      onChange={handleChange}
                      max={15}
                    />
                  </div>
                </div>
              )}
              {["Cheque"].includes(payload?.PaymentMode) && (
                <div className="col-sm-2 form group">
                  <label className="control-label" htmlFor="Name">
                    Cheque Date
                  </label>
                  :
                  <div>
                    <CustomDate
                      name="CardDate"
                      value={payload?.CardDate}
                      className="form-control pull-right reprint-date required"
                      onChange={dateSelect}
                      maxDate={new Date()}
                    />
                  </div>
                </div>
              )}

              {["Credit Card", "Debit Card"].includes(payload?.PaymentMode) && (
                <div className="col-sm-2 form group">
                  <label className="control-label" htmlFor="Name">
                    Card No
                  </label>
                  :
                  <div>
                    <Input
                      className="form-control  pull-right reprint-date required"
                      name="CardNo"
                      type="text"
                      value={payload?.CardNo}
                      max={20}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}

              {["Online Payment", "Paytm"].includes(payload?.PaymentMode) && (
                <div className="col-sm-2 form group">
                  <label className="control-label" htmlFor="Name">
                    Transaction No
                  </label>
                  :
                  <div>
                    <Input
                      className="form-control  pull-right reprint-date required"
                      name="TransactionNo"
                      type="text"
                      value={payload?.TransactionNo}
                      onChange={handleChange}
                      max={15}
                    />
                  </div>
                </div>
              )}

              <div className="col-sm-2 form group">
                <label className="control-label" htmlFor="Name">
                  Remarks
                </label>
                :
                <div>
                  <Input
                    className="form-control  pull-right reprint-date "
                    name="UpdateRemarks"
                    type="text"
                    value={payload?.UpdateRemarks}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
            <div className="mt-3">
              {Load ? (
                <Loading />
              ) : (
                <button className="btn btn-success" onClick={handleSubmit}>
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettlementPatient;
