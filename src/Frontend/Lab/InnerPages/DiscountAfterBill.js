import React from "react";
import { Table } from "react-bootstrap";
import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../../util/Loading";
import { SelectBox } from "../../../ChildComponents/SelectBox";
import {
  getBindDiscApproval,
  getBindDiscReason,
  selectedValueCheck,
} from "../../util/Commonservices";
import { number } from "../../util/Commonservices/number";
import Input from "../../../ChildComponents/Input";

const DiscountAfterBill = () => {
  const { id } = useParams();
  const [load, setLoad] = useState({
    saveLoad: false,
    searchLoad: false,
  });
  const [BindDiscApproval, setBindDiscApproval] = useState([]);
  const [BindDiscReason, setBindDiscReason] = useState([]);
  const [dropdownData, setDropDownData] = useState({
    DiscountApprovedBy: "",
    DiscountReason: "",
  });
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    getBindDiscApproval(setBindDiscApproval);
    getBindDiscReason(setBindDiscReason);
    fetch();
  }, []);

  const fetch = () => {
    axios
      .post("/api/v1/DiscountAfterBill/GetItemsToGetDiscount", {
        LedgerTransactionIDHash: id,
      })
      .then((res) => {
        let data = res?.data?.message;
        let val = data.map((ele) => {
          return {
            ...ele,
            DiscountAmt: 0,
          };
        });
        setTableData(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setDropDownData({ ...dropdownData, [name]: event.value });
  };

  const handleChange = (e, index, Amount) => {
    const data = [...tableData];
    const { name, value, id } = e.target;
    data[index][name] = value > Amount ? "" : value;
    setTableData(data);
    if (value > Amount) {
      document.getElementById([id]).value = "";
    }
  };

  // console.log(data);

  const handleSave = () => {
    if (dropdownData?.DiscountApprovedBy && dropdownData?.DiscountReason) {
      setLoad({ ...load, saveLoad: true });
      const data = tableData.map((ele) => {
        return {
          ItemId: ele?.ItemId,
          LedgerTransactionID: ele?.LedgerTransactionID,
          DiscountAmt: ele?.DiscountAmt,
          DiscountApprovedBy: dropdownData?.DiscountApprovedBy,
          DiscountReason: dropdownData?.DiscountReason,
        };
      });
      axios
        .post("/api/v1/DiscountAfterBill/SaveDiscountAfterBill", {
          PLO: data,
        })
        .then((res) => {
          for (let i = 0; i < tableData?.length; i++) {
            document.getElementById(`DiscountAmt-${i}`).value = "";
          }
          document.getElementById([id]).value = "";
          toast.success(res?.data?.message);
          setLoad({ ...load, saveLoad: false });
          setDropDownData({
            DiscountApprovedBy: "",
            DiscountReason: "",
          });
          fetch();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something went wrong"
          );
          setLoad({ ...load, saveLoad: false });
        });
    } else {
      toast.error("Please Choose Discount Approval and Reason");
    }
  };

  useEffect(() => {
    getBindDiscApproval(setBindDiscApproval);
    getBindDiscReason(setBindDiscReason);
    fetch();
  }, []);

  return (
    <>
      <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
        <div className="container-fluid pt-3">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <div className="clearfix">
                <h6 className="m-0 font-weight-bold text-primary float-left">
                  Discount After Bill
                </h6>
              </div>
            </div>

            {!load?.searchLoad ? (
              tableData.length > 0 && (
                <div
                  className={`card-body  ${
                    tableData.length > 8 ? "boottable" : ""
                  }`}
                >
                  <div className="px-2">
                    <Table bordered responsive hover>
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Lab No</th>
                          <th>Test Name</th>
                          <th>Quantity</th>
                          <th>Rate</th>
                          <th>Discount</th>
                          <th>Amount</th>
                          <th>DisAmount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData.map((data, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{data?.LedgerTransactionNo}</td>
                            <td>{data?.ItemName}</td>
                            <td>{data?.Quantity}</td>
                            <td>{data?.Rate}</td>
                            <td>
                              <input
                                type="number"
                                name="DiscountAmt"
                                id={`DiscountAmt-${index}`}
                                onInput={(e) => {
                                  number(e, data?.Rate.toString().length);
                                }}
                                // value={data?.DiscAmt === 0 ? "" : data?.DiscAmt}
                                onChange={(e) =>
                                  handleChange(e, index, data?.Amount)
                                }
                              ></input>
                            </td>
                            <td>{data?.Amount}</td>
                            <td>{data?.DiscAmt}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  <div>
                    <div className="col-sm-2 col-md-2 pb-3">
                      <label className="control-label" htmlFor="allowLogin">
                        Discount Approved By
                      </label>
                      <SelectBox
                        options={BindDiscApproval}
                        onChange={handleSelectChange}
                        className={"required"}
                        selectedValue={selectedValueCheck(
                          BindDiscApproval,
                          dropdownData?.DiscountApprovedBy
                        )}
                        name="DiscountApprovedBy"
                      />
                    </div>
                    <div className="col-sm-2 col-md-2 pb-3">
                      <label className="control-label" htmlFor="allowLogin">
                        Discount Reason
                      </label>
                      <SelectBox
                        options={BindDiscReason}
                        className={"required"}
                        onChange={handleSelectChange}
                        selectedValue={selectedValueCheck(
                          BindDiscReason,
                          dropdownData?.DiscountReason
                        )}
                        name="DiscountReason"
                      />
                    </div>
                    <div className="col-sm-2 col-md-2 pb-3 pt-4">
                      {load?.saveLoad ? (
                        <Loading />
                      ) : (
                        <button
                          className="btn btn-success mt-3"
                          onClick={handleSave}
                        >
                          Save
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
            ) : (
              <Loading />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DiscountAfterBill;
