import React, { useEffect, useState } from "react";
import { getBindDiscApproval, getBindDiscReason } from "../util/Commonservices";
import axios from "axios";

import { toast } from "react-toastify";
import { SelectBox } from "../../ChildComponents/SelectBox";
import Loading from "../util/Loading";
import { number } from "../util/Commonservices/number";
import { useParams } from "react-router-dom";
import { checkEmploypeeWiseDiscount } from "../../ValidationSchema";
import Input from "../../ChildComponents/Input";
import { useTranslation } from "react-i18next";

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

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    if (name === "DiscountApprovedBy") {
      if (value) {
        const { GrossAmount, DiscAmt } = DiscountValidation();
        checkEmploypeeWiseDiscount(
          {
            GrossAmount: GrossAmount,
            CentreID: 1,
            DiscountOnTotal: DiscAmt,
          },
          value
        )
          .then((res) => {
            setDropDownData({ ...dropdownData, [name]: value });
          })
          .catch((err) => {
            toast.error(err);
            setDropDownData({ ...dropdownData, [name]: "" });
          });
      } else {
        setDropDownData({ ...dropdownData, [name]: "" });
      }
    }
    setDropDownData({ ...dropdownData, [name]: value });
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

  const handleSaveShowButton = () => {
    let show = false;
    for (let i = 0; tableData?.length > i; i++) {
      if (
        document?.getElementById(`DiscountAmt-${i}`)?.value !== "" &&
        document?.getElementById(`DiscountAmt-${i}`)?.value != 0
      ) {
        show = true;
        break;
      }
    }
    return show;
  };

  // console.log(data);

  const handleSave = () => {
    if (dropdownData?.DiscountApprovedBy && dropdownData?.DiscountReason) {
      setLoad({ ...load, saveLoad: true });
      const data = tableData
        .filter((ele) => ele?.Approved === 0)
        .map((ele) => {
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
          // document?.getElementById("DiscountByPercentage")?.value="";
          // document?.getElementById("DiscountByRS")?.value="";
          // document.getElementById([id]).value = "";
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

  const DiscountValidation = (id) => {
    let GrossAmount = 0;
    let DiscAmt = 0;
    for (let i = 0; tableData.length > i; i++) {
      GrossAmount = GrossAmount + Number(tableData[i]?.Rate);
      DiscAmt =
        DiscAmt + Number(document.getElementById(`DiscountAmt-${i}`).value);
    }
    return {
      GrossAmount,
      DiscAmt,
    };
  };

  const total = () => {
    const totalvalue = tableData.filter((ele) => ele?.Approved === 0).reduce(
      (prev, current, index) => prev + current.Amount,
      0
    );
    return totalvalue;
  };

  const handleSumOfTest = (id, value) => {
    if (id === "DiscountByRS") {
      const totalvalue = total();
      document.getElementById("DiscountByPercentage").value = "";
      return {
        totalvalue: totalvalue >= value ? true : false,
        message: "Your value is Greater then total value",
      };
    } else {
      document.getElementById("DiscountByRS").value = "";
      return {
        totalvalue: value <= 100 ? true : false,
        message: "Discount Percentage is greater than 100%",
      };
    }
  };

  const findPercentageAmount = (value) => {
    const findPercentageDiscount = ((value / total()) * 100).toFixed(2);
    return findPercentageDiscount;
  };

  const separateAmountByDiscount = (value, percentage) => {
    const data = (value * percentage) / 100;
    return data.toFixed(2);
  };

  const handleChangeMain = (e) => {
    const { name, value, id } = e.target;
    if (id !== "DiscountByRS" && value.length > 3) {
      e.preventDefault();
      return;
    }
    const { totalvalue, message } = handleSumOfTest(id, value);
    debugger;
    if (totalvalue) {
      const data = tableData.map((ele, index) => {
        if (ele?.Approved === 0) {
          document.getElementById(`DiscountAmt-${index}`).value =
            separateAmountByDiscount(
              ele?.Amount,
              id === "DiscountByRS" ? findPercentageAmount(value) : value
            );
          return {
            ...ele,
            [name]: separateAmountByDiscount(
              ele?.Amount,
              id === "DiscountByRS" ? findPercentageAmount(value) : value
            ),
          };
        } else {
          return ele;
        }
      });
      setTableData(data);
    } else {
      toast.error(message);
    }
  };

  useEffect(() => {
    getBindDiscApproval(setBindDiscApproval);
    getBindDiscReason(setBindDiscReason);
    fetch();
  }, []);

  const { t } = useTranslation();

  return (
    <>
      <div className="box box-success ">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Discount After Bill")}</h3>
        </div>
        <div className="box-body">
          {!load?.searchLoad ? (
            tableData.length > 0 && (
              <div
                className={`box-body divResult table-responsive  ${
                  tableData.length > 8 ? "boottable" : ""
                }`}
              >
                <div className="row">
                  <table
                    id="tblData"
                    className="table table-bordered table-hover table-striped tbRecord"
                    cellPadding="{0}"
                    cellSpacing="{0}"
                  >
                    <thead className="cf">
                      <tr>
                        <th>{t("S.No")}</th>
                        <th>{t("Lab No")}</th>
                        <th>{t("Test Name")}</th>
                        <th>{t("Quantity")}</th>
                        <th>{t("Rate")}</th>
                        <th>
                          {t("Discount")}:
                          <Input
                            placeholder={"Discount in (RS)"}
                            name="DiscountAmt"
                            id="DiscountByRS"
                            value={
                              document.getElementById("DiscountByRS")?.value
                            }
                            disabled={
                              dropdownData?.DiscountApprovedBy ? true : false
                            }
                            onChange={handleChangeMain}
                            type="number"
                          />
                          <Input
                            placeholder={"Discount in (%)"}
                            type="number"
                            name="DiscountAmt"
                            id="DiscountByPercentage"
                            disabled={
                              dropdownData?.DiscountApprovedBy ? true : false
                            }
                            value={
                              document.getElementById("DiscountByPercentage")
                                ?.value
                            }
                            onChange={handleChangeMain}
                          />
                        </th>
                        <th>{t("Amount")}</th>
                        <th>{t("DisAmount")}</th>
                        {/* <th>{t("Reject")}</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((data, index) => (
                        <tr key={index}>
                          <td data-title={t("S.No")}>{index + 1}</td>
                          <td data-title={t("Lab No")}>
                            {data?.LedgerTransactionNo}
                          </td>
                          <td data-title={t("Test Name")}>{data?.ItemName}</td>
                          <td data-title={t("Quantity")}>{data?.Quantity}</td>
                          <td data-title={t("Rate")}>{data?.Rate}</td>
                          <td data-title={t("Discount")}>
                            <input
                              type="number"
                              name="DiscountAmt"
                              disabled={
                                data?.Approved === 1
                                  ? true
                                  : (document.getElementById("DiscountByRS")
                                      ?.value !== "" ||
                                      document.getElementById(
                                        "DiscountByPercentage"
                                      )?.value !== "" ||
                                      dropdownData?.DiscountApprovedBy) &&
                                    true
                              }
                              className="select-input-box form-control input-sm"
                              id={`DiscountAmt-${index}`}
                              value={
                                document.getElementById(`DiscountAmt-${index}`)
                                  ?.value
                              }
                              min={0}
                              onWheel={(e) => e.target.blur()}
                              onInput={(e) => {
                                number(e, data?.Rate.toString().length);
                              }}
                              // value={data?.DiscAmt === 0 ? "" : data?.DiscAmt}
                              onChange={(e) =>
                                handleChange(e, index, data?.Amount)
                              }
                            ></input>
                          </td>
                          <td data-title={t("Amount")}>{data?.Amount}</td>
                          <td data-title={t("DisAmount")}>{data?.DiscAmt}</td>
                          {/* <td>
                            <button className="btn-sm btn-danger">
                              Reject
                            </button>
                          </td> */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {handleSaveShowButton() && (
                  <div>
                    <div className="col-sm-2 col-md-2">
                      <SelectBox
                        options={BindDiscApproval}
                        onChange={handleSelectChange}
                        className={"required"}
                        selectedValue={dropdownData?.DiscountApprovedBy}
                        name="DiscountApprovedBy"
                      />
                    </div>
                    <div className="col-sm-2">
                      <SelectBox
                        options={BindDiscReason}
                        className={"required"}
                        onChange={handleSelectChange}
                        selectedValue={dropdownData?.DiscountReason}
                        name="DiscountReason"
                      />
                    </div>
                    <div className="col-sm-1">
                      {/* <div className="ApproveBarcodeChild"> */}
                      {load?.saveLoad ? (
                        <Loading />
                      ) : (
                        <button
                          className="btn btn-success btn-block btn-sm"
                          onClick={handleSave}
                          disabled={
                            dropdownData?.DiscountReason <= 0 ? true : false
                          }
                        >
                          {t("Save")}
                        </button>
                      )}
                    </div>
                    {/* </div> */}
                  </div>
                )}
              </div>
            )
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </>
  );
};

export default DiscountAfterBill;
