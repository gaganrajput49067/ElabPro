import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Input from "../../../ChildComponents/Input";
import { selectedValueCheck } from "../../util/Commonservices";
import { SelectBox } from "../../../ChildComponents/SelectBox";
import Loading from "../../util/Loading";

const RefundAfterBill = () => {
  const { id } = useParams();
  const [tableData, setTableData] = useState([]);
  const [BindRefundReason, setBindRefundReason] = useState([]);
  const [dropdownData, setDropDownData] = useState({
    RefundReason: "",
  });

  const [load, setLoad] = useState({
    saveLoad: false,
  });

  console.log(tableData);

  const fetch = () => {
    axios
      .post("/api/v1/RefundAfterBill/GetItemsToRefund", {
        LedgerTransactionIDHash: id,
      })
      .then((res) => {
        setTableData(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong."
        );
      });
  };

  const getDropDownData = (name) => {
    axios.post("/api/v1/Global/getGlobalData", { Type: name }).then((res) => {
      let data = res.data.message;
      console.log(data);
      let value = data.map((ele) => {
        return {
          value: ele.FieldDisplay,
          label: ele.FieldDisplay,
        };
      });
      setBindRefundReason(value);
    });
  };

  const handleCheckbox = (e, index) => {
    const { name, checked } = e.target;
    const data = [...tableData];
    data[index][name] = checked === true ? 1 : 0;
    setTableData(data);
  };

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setDropDownData({ ...dropdownData, [name]: event.value });
  };

  const handleSave = () => {
    setLoad({ ...load, saveLoad: true });
    const data = tableData.filter((ele) => ele?.IsRefund === 1);

    const val = data?.map((ele) => {
      return {
        LedgerTransactionID: ele?.LedgerTransactionID,
        ItemId: ele?.ItemId,
        BillNo: ele?.BillNo,
        DiscountAmt: ele?.DiscountAmt,
        Amount: ele?.Amount,
        RefundReason: dropdownData?.RefundReason,
      };
    });
    axios
      .post("/api/v1/RefundAfterBill/SaveRefundAfterBill", {
        PLO: val,
      })
      .then((res) => {
        console.log(res);
        toast.success(res?.data?.message);
        setLoad({ ...load, saveLoad: false });
        fetch();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong."
        );
        setLoad({ ...load, saveLoad: false });
      });
  };

  useEffect(() => {
    fetch();
    getDropDownData("RefundReason");
  }, []);

  return (
    <>
      <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
        <div className="container-fluid pt-3">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <div className="clearfix">
                <h6 className="m-0 font-weight-bold text-primary float-left">
                  Refund After Bill
                </h6>
              </div>
            </div>

            <div className="card-body boottable hover stripped">
              <div className="px-2">
                <Table>
                  <thead>
                    <tr>
                      {[
                        "S.No.",
                        "Lab No",
                        "Test Name",
                        "Quantity",
                        "Rate",
                        "Amount",
                        "Select",
                      ].map((ele, index) => (
                        <th key={index}>{ele}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((data, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{data?.LedgerTransactionNo}</td>
                        <td>{data?.PatientCode}</td>
                        <td>{data?.Quantity}</td>
                        <td>{data?.Rate}</td>
                        <td>{data?.Amount}</td>
                        <td>
                          <Input
                            type="checkbox"
                            checked={data?.IsRefund}
                            name="IsRefund"
                            onChange={(e) => handleCheckbox(e, index)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </div>
            <div>
              <div className="col-sm-2 col-md-2 pb-3">
                <label className="control-label" htmlFor="allowLogin">
                  Refund Reason
                </label>
                <SelectBox
                  name="RefundReason"
                  options={BindRefundReason}
                  onChange={handleSelectChange}
                  selectedValue={selectedValueCheck(
                    BindRefundReason,
                    dropdownData?.RefundReason
                  )}
                />
              </div>
              <div className="col-sm-2 col-md-2 pb-3 pt-4">
                {load?.saveLoad ? (
                  <Loading />
                ) : (
                  <button className="btn btn-success mt-3" onClick={handleSave}>
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RefundAfterBill;
