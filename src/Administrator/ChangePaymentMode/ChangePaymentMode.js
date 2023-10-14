import React, { useEffect, useState } from "react";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../../Frontend/util/Loading";
import { getPaymentModes } from "../../Frontend/util/Commonservices";
import { number } from "../../Frontend/util/Commonservices/number";
import CustomDate from "../../ChildComponents/CustomDate";
import moment from "moment";

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

  const dateSelect = (date, name, index) => {
    const data = [...tableData?.tableData];
    data[index][name] = date;
    setTableData({ ...tableData, tableData: data });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleChangeMap = (e, i) => {
    const data = [...tableData?.tableData];
    const { name, value } = e.target;

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
      <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
        <div className="container-fluid">
          {/* <div className="card shadow mb-4 mt-4"> */}
          <div className="card-header py-3 mt-4">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                Change Payment Mode
              </h6>
            </div>
          </div>
          <div className="row mt-2">
            <div className="col-sm-4">
              <div className="card shadow">
                <div className="card-header py-3">
                  <div className="clearfix">
                    <h6 className="m-0 font-weight-bold text-primary float-left">
                      Search Details
                    </h6>
                  </div>
                </div>
                <div className="card-body">
                  <div className="col-sm-8 form-group">
                    <label className="control-label" htmlFor="center">
                      Visit No.
                    </label>
                    <Input
                      name="LabNo"
                      className="form-control pull-right  reprint-date"
                      value={payload?.LabNo}
                      onChange={handleChange}
                      type="text"
                    />
                  </div>
                  <div
                    className="col-sm-2 form-group mt-2"
                    style={{ alignItems: "flex-end" }}
                  >
                    <button className="btn btn-info mt-4" onClick={fetch}>
                      Search
                    </button>
                  </div>
                </div>
                <div
                  className="row"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <div className="col-sm-4 form-group">
                    <input
                      type="radio"
                      name="mainReceipt"
                      className="mt-4"
                      checked={mainReceipt == 1}
                      onChange={(e) => {
                        setMainReceipt("1");
                        fetch();
                      }}
                    ></input>
                    <label className="control-label" htmlFor="center">
                      Main Booking
                    </label>
                  </div>

                  <div className="col-sm-4 form-group">
                    <input
                      type="radio"
                      name="mainReceipt"
                      className="mt-4"
                      checked={mainReceipt == 2}
                      onChange={(e) => {
                        setMainReceipt("2");
                        fetch();
                      }}
                    ></input>
                    <label className="control-label" htmlFor="center">
                      Receipt
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}

            <div className="col-sm-8">
              <div className="card shadow">
                <div className="card-header py-3">
                  <div className="clearfix">
                    <h6 className="m-0 font-weight-bold text-primary float-left">
                      Patient Details
                    </h6>
                  </div>
                </div>
                <div className="card-body mb-4 mt-2">
                  <div className="col-sm-4 form-group">
                    <label className="control-label" htmlFor="center">
                      Patient ID :
                      <span style={{ fontWeight: "600" }} className="mx-3">
                        {tableData?.patientData?.PatientId}
                      </span>
                    </label>
                  </div>

                  <div className="col-sm-4 form-group">
                    <label className="control-label" htmlFor="center">
                      Patient Name:
                      <span style={{ fontWeight: "600" }} className="mx-3">
                        {tableData?.patientData?.PName}
                      </span>
                    </label>
                  </div>
                  
                  <div className="col-sm-4 form-group">
                    <label className="control-label" htmlFor="center">
                      Age/Gender:
                      <span
                        id="lbl"
                        style={{ fontWeight: "600" }}
                        className="mx-3"
                      >
                        {tableData?.patientData?.Age}
                        {tableData?.patientData?.Gender ? " / " : ""}
                        {tableData?.patientData?.Gender}
                      </span>
                    </label>
                  </div>

                  <div className="col-sm-4 form-group">
                    <label className="control-label" htmlFor="center">
                      Amount Paid:
                    </label>
                    <span style={{ fontWeight: "600" }} className="mx-3">
                      {tableData?.patientData?.Adjustment}
                    </span>
                  </div>
                      
                  <div className="col-sm-4 form-group">
                    <label className="control-label" htmlFor="center">
                      Doctor:
                      <span style={{ fontWeight: "600" }} className="mx-3">
                        {tableData?.patientData?.DoctorName}
                      </span>
                    </label>
                  </div>

                  <div className="col-sm-4 form-group">
                    <label className="control-label" htmlFor="center">
                      Net Amount:
                      <span style={{ fontWeight: "600" }} className="mx-3">
                        {tableData?.patientData?.NetAmount}
                      </span>
                    </label>
                  </div>

                  <div className="col-sm-4 form-group">
                    <label className="control-label" htmlFor="center">
                      Visit No:
                      <span style={{ fontWeight: "600" }} className="mx-3">
                        {tableData?.patientData?.LedgerTransactionNo}
                      </span>
                    </label>
                  </div>
                  <div className="col-sm-4 form-group">
                    <label className="control-label" htmlFor="center">
                      Due Amount:
                      <span style={{ fontWeight: "600" }} className="mx-3">
                        {tableData?.patientData?.DueAmount}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card shadow mt-2">
            <div className="card-header py-3">
              <div className="clearfix">
                <h6 className="m-0 font-weight-bold text-primary float-left">
                  Search Results
                </h6>
              </div>
            </div>
            <div
              className={`card-body  boottable
              `}
            >
              <div className="px-2">
                <Table responsive bordered hover>
                  <thead style={{ zIndex: "99" }}>
                    <tr>
                      <th>S.No</th>
                      <th>Receipt No.</th>
                      <th>Amount</th>
                      <th>Payment Mode</th>
                      <th>Select</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.tableData?.map((ele, index) => (
                      <>
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{ele?.ReceiptNo}</td>
                          <td>{ele?.Amount}</td>
                          <td>{ele?.PaymentMode}</td>
                          <td>
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
                            <td colSpan={12}>
                              <div className="mt-3">
                                <div className="col-sm-2 form-group">
                                  <div>
                                    <select
                                      className="form-control required"
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
                                  <div className="col-sm-2 form-group">
                                    <div>
                                      <select
                                        className="required form-control pull-right reprint-date"
                                        name="BankName"
                                        value={ele?.BankName}
                                        disabled={ele?.isChecked}
                                        onChange={(e) => {
                                          handleChangeMap(e, index);
                                        }}
                                      >
                                        <option hidden>Bank Name</option>
                                        {BankName.map((ele, index) => (
                                          <option value={ele.value} key={index}>
                                            {ele.label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                )}

                                {["Cheque"].includes(ele?.NewPaymentMode) && (
                                  <div className="col-sm-2 form-group">
                                    <div>
                                      <Input
                                        className="form-control pull-right reprint-date required"
                                        name="CardNo"
                                        type="text"
                                        disabled={ele?.isChecked}
                                        placeholder={"Cheque No"}
                                        value={ele?.CardNo}
                                        onChange={(e) => {
                                          handleChangeMap(e, index);
                                        }}
                                        max={15}
                                      />
                                    </div>
                                  </div>
                                )}

                                {["Credit Card", "Debit Card"].includes(
                                  ele?.NewPaymentMode
                                ) && (
                                  <div className="col-sm-2 form-group">
                                    <div>
                                      <Input
                                        className="form-control pull-right reprint-date required"
                                        name="CardNo"
                                        disabled={ele?.isChecked}
                                        placeholder={"Card No"}
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
                                  <div className="col-sm-2 form-group">
                                    <div>
                                      <Input
                                        className="form-control pull-right reprint-date required"
                                        name="TransactionNo"
                                        disabled={ele?.isChecked}
                                        type="text"
                                        placeholder={"Transaction No"}
                                        value={ele?.TransactionNo}
                                        onChange={(e) => {
                                          handleChangeMap(e, index);
                                        }}
                                        max={15}
                                      />
                                    </div>
                                  </div>
                                )}

                                {[
                                  "Credit Card",
                                  "Debit Card",
                                  "Cheque",
                                ].includes(ele?.NewPaymentMode) && (
                                  <div className="col-sm-2 form-group">
                                    <CustomDate
                                      className="form-control pull-right reprint-date required"
                                      name="CardDate"
                                      placeholder="Card/Cheque Date"
                                      maxDate={new Date()}
                                      disabled={ele?.isChecked}
                                      value={ele?.CardDate}
                                      index={index}
                                      // onChange={(e) => {
                                      //   handleChangeMap(e, index);
                                      // }}
                                      onChange={dateSelect}
                                    />
                                  </div>
                                )}

                                <div className="col-sm-2 form-group">
                                  <div>
                                    <Input
                                      className="form-control pull-right reprint-date required"
                                      name="Naration"
                                      placeholder={"Naration"}
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
                            <td colSpan={12}>
                              <div className="mt-3">
                                <div className="col-sm-2 form-group">
                                  <label>Mode : </label>
                                  <p>
                                    <span className="text-danger font-weight-bold">
                                      {ele?.PaymentMode.toLowerCase() === "cash"
                                        ? "Cash To Credit"
                                        : "Credit To Cash"}
                                    </span>
                                  </p>
                                </div>

                                <div className="col-sm-2 form-group">
                                  <label>Naration :</label>
                                  <Input
                                    className="form-control pull-right reprint-date required"
                                    name="Naration"
                                    placeholder={"Naration"}
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
                </Table>
              </div>
            </div>
            <div className="card-footer">
              {HideSave() &&
                (loadingSecond ? (
                  <Loading />
                ) : (
                  <div className="col-sm-2 form-group mt-3">
                    <button className="btn btn-success" onClick={submit}>
                      Save
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChangePaymentMode;
