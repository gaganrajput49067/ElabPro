import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { getPaymentModes, selectedValueCheck } from "../../util/Commonservices";
import { toast } from "react-toastify";
import { Spinner, Table } from "react-bootstrap";
import { SelectBox } from "../../../ChildComponents/SelectBox";
import Input from "../../../ChildComponents/Input";
import CustomDate from "../../../ChildComponents/CustomDate";
import Loading from "../../util/Loading";
import { PayBy } from "../../../ChildComponents/Constants";
import moment from "moment";
import { dateConfig } from "../../util/DateConfig";
import { number } from "../../util/Commonservices/number";

const BulkSettlement = () => {
  const [paymentMode, setPaymentMode] = useState([]);
  const [BankName, setBankName] = useState([]);
  const [load, setLoad] = useState(false);
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

  useEffect(() => {
    getAccessCentres();
  }, []);

  const dateSelect = (date, name) => {
    setPayload({
      ...payload,
      [name]: date,
    });
  };

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
        data[i]["BankName"] = "";
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
      <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
        <div className="container-fluid">
          <div className="card shadow mb-4 mt-4">
            <div className="card-header py-3">
              <div className="clearfix">
                <h6 className="m-0 font-weight-bold text-primary float-left">
                  Settlements
                </h6>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-2 form-group">
                  <label className="control-label" htmlFor="center">
                    Center
                  </label>
                  <SelectBox
                    options={CentreData}
                    formdata={payload.CentreID}
                    selectedValue={selectedValueCheck(
                      CentreData,
                      payload?.CentreID
                    )}
                    name="CentreID"
                    onChange={handleSelectChange}
                  />
                </div>
                <div className="col-sm-2 form-group">
                  <label className="control-label">From Date:</label>
                  <div>
                    <CustomDate
                      name="FromDate"
                      value={payload?.FromDate}
                      className="form-control pull-right reprint-date"
                      onChange={dateSelect}
                      maxDate={new Date()}
                    />
                  </div>
                </div>
                <div className="col-sm-2 form-group">
                  <label className="control-label">From Time:</label>
                  <div>
                    <Input
                      className="form-control pull-right  reprint-date"
                      type="time"
                      name="FromTime"
                      value={payload.FromTime}
                      onChange={handleChanges}
                      step="2"
                    />
                  </div>
                </div>

                <div className="col-sm-2 form-group">
                  <label className="control-label">To Date:</label>
                  <div>
                    <CustomDate
                      name="ToDate"
                      value={payload?.ToDate}
                      className="form-control pull-right reprint-date"
                      onChange={dateSelect}
                      maxDate={new Date()}
                      minDate={new Date(payload.FromTime)}
                    />
                  </div>
                </div>
                <div className="col-sm-2 form-group">
                  <label className="control-label">To Time:</label>
                  <div>
                    <Input
                      className="form-control pull-right reprint-date"
                      type="time"
                      name="ToTime"
                      value={payload.ToTime}
                      onChange={handleChanges}
                      step="2"
                    />
                  </div>
                </div>

                <div
                  className="col-sm-1 ml-4"
                  style={{ alignSelf: "flex-end" }}
                >
                  <Input
                    name="DueAmount"
                    type="checkbox"
                    checked={payload?.DueAmount == "1" ? true : false}
                    onChange={handleChanges}
                  />
                  <label htmlFor="isActive">Due Patient</label>
                </div>
                <div
                  className="col-sm-2 form-group"
                  style={{ alignSelf: "flex-end" }}
                >
                  <div>
                    <button className="btn btn-info" onClick={fetch}>
                      Search
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
                <div className="card shadow mb-4 mt-4">
                <div
                  className={`card-body ${
                    formTable.length > 8 ? "boottable" : ""
                  }`}
                >
                  <div className="px-2">
                    <Table bordered responsive hover>
                      <thead className="text-center" style={{ zIndex: 99 }}>
                        <tr>
                          <th>S.No</th>
                          <th>Reg Date</th>
                          <th>Lab No</th>
                          <th>Patient Name</th>
                          <th>Centre</th>
                          <th>Rate Type</th>
                          <th>Gross Amount</th>
                          <th>Discount Amount</th>
                          <th>Net Amount</th>
                          <th>Paid Amount</th>
                          <th>Due Amount</th>
                          <th>#</th>
                        </tr>
                      </thead>
                      {formTable.length > 0 && (
                        <tbody>
                          {formTable.map((ele, index) => (
                            <>
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{dateConfig(ele?.RegDate)}</td>
                                <td>{ele.LedgerTransactionNo}</td>
                                <td>{ele.PName}</td>
                                <td>{ele.Centre}</td>
                                <td>{ele.RateType}</td>
                                <td>{ele.Rate}</td>
                                <td>{ele.DiscAmt}</td>
                                <td>{ele.Amount}</td>
                                <td>{ele.PaidAmount}</td>
                                <td>{ele.DueAmount}</td>
                                <td>
                                  <input
                                    type="checkbox"
                                    name="isChecked"
                                    checked={ele?.isChecked}
                                    onChange={(e) =>
                                      handleChangeIndex(e, index)
                                    }
                                  ></input>
                                </td>
                              </tr>
                              <tr>
                                <td colSpan={12}>
                                  <div className="px-2">
                                    <div className="col-sm-2 form group">
                                      <div>
                                        <select
                                          className="form-control required"
                                          name="PayBy"
                                          value={ele?.PayBy}
                                          onChange={(e) => {
                                            handleChangeMap(e, index);
                                          }}
                                        >
                                          <option hidden>Pay By</option>
                                          {PayBy.map((ele, index) => (
                                            <option
                                              key={index}
                                              value={ele?.value}
                                            >
                                              {ele?.label}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>

                                    <div className="col-sm-2 form group">
                                      <div>
                                        <Input
                                          className="form-control pull-right reprint-date required"
                                          name="NewAmount"
                                          type="number"
                                          placeholder="DueAmount"
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

                                    <div className="col-sm-2 form group">
                                      <div>
                                        <select
                                          className="form-control required"
                                          name="PaymentModeID"
                                          value={ele?.PaymentModeID}
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
                                    ].includes(ele?.PaymentMode) && (
                                      <div className="col-sm-2 form group">
                                        <div>
                                          <select
                                            className="required form-control pull-right reprint-date"
                                            name="BankName"
                                            value={ele?.BankName}
                                            onChange={(e) => {
                                              handleChangeMap(e, index);
                                            }}
                                          >
                                            <option hidden>Bank Name</option>
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

                                    {["Cheque"].includes(ele?.PaymentMode) && (
                                      <div className="col-sm-2 form group">
                                        <div>
                                          <Input
                                            className="form-control  pull-right reprint-date required"
                                            name="CardNo"
                                            type="text"
                                            placeholder={" Cheque No"}
                                            value={ele?.CardNo}
                                            onChange={(e) => {
                                              handleChangeMap(e, index);
                                            }}
                                            max={15}
                                          />
                                        </div>
                                      </div>
                                    )}
                                    {/* {["Cheque"].includes(ele?.PaymentMode) && (
                                      <div className="col-sm-2 form group">
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
                                      <div className="col-sm-2 form group">
                                        <div>
                                          <Input
                                            className="form-control  pull-right reprint-date required"
                                            name="CardNo"
                                            placeholder={" Card No"}
                                            type="text"
                                            value={ele?.CardNo}
                                            max={20}
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
                                      <div className="col-sm-2 form group">
                                        <div>
                                          <Input
                                            className="form-control  pull-right reprint-date required"
                                            name="TransactionNo"
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

                                    <div className="col-sm-2 form group">
                                      <div>
                                        <Input
                                          className="form-control pull-right reprint-date "
                                          name="UpdateRemarks"
                                          placeholder={"Remarks"}
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
                    </Table>
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
              )
            )}
          </div>
      </div>
    </>
  );
};

export default BulkSettlement;
