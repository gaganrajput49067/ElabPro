import React, { useEffect, useState } from "react";
import CustomDate from "../../ChildComponents/CustomDate";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import axios from "axios";
import { toast } from "react-toastify";
import {
  isChecked,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import moment from "moment";
import { Table } from "react-bootstrap";
import { dateConfig } from "../../Frontend/util/DateConfig";
import Loading from "../../Frontend/util/Loading";

const DiscountApproval = () => {
  const [payload, setPayload] = useState({
    PatientName: "",
    LedgertransactionNo: "",
    FromDate: new Date(),
    FromTime: "00:00",
    ToDate: new Date(),
    ToTime: "23:59",
    CentreID: "",
    DiscountApprovedByID: "",
  });
  const [Center, setCenter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [DiscApprove, setDiscApprove] = useState([]);
  const [tableData, setTableData] = useState([]);

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

        setCenter(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };

  const getDiscountApproval = () => {
    axios
      .get("/api/v1/DiscountApprovalByEmployee/BindDiscApprovedBy")
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => {
          return {
            label: ele?.EmployeeName,
            value: ele?.EmployeeID,
          };
        });
        setDiscApprove(val);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
      });
  };

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setPayload({ ...payload, [name]: event.value });
  };

  useEffect(() => {
    getAccessCentres();
    getDiscountApproval();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const getTableData = () => {
    axios
      .post("/api/v1/DiscountApprovalByEmployee/getDiscountApprovalData", {
        ...payload,
        FromDate: moment(payload?.FromDate).format("DD-MMM-YYYY"),
        ToDate: moment(payload?.ToDate).format("DD-MMM-YYYY"),
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            ...ele,
            isChecked: false,
          };
        });
        setTableData(val);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
      });
  };

  const handleChangeNew = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const data = [...tableData];
      data[index][name] = checked;
      setTableData(data);
    } else {
      const data = tableData.map((ele) => {
        return {
          ...ele,
          isChecked: checked,
        };
      });
      setTableData(data);
    }
  };

  const postApi = () => {
    setLoading(true);
    const data = tableData.filter((ele) => ele?.isChecked);
    if (data.length > 0) {
      axios
        .post("/api/v1/DiscountApprovalByEmployee/UpdateDiscApprovedBy", data)
        .then((res) => {
          toast.success(res?.data?.message);
          getTableData();
          setLoading(false);
        })
        .catch((err) => {
          toast.error(
            err?.data?.message ? err?.data?.message : "Something Went Wrong"
          );
          setLoading(false);
        });
    } else {
      toast.error("please Choose One Test");
    }
  };

  const dateSelect = (date, name) => {
    setPayload({
      ...payload,
      [name]: date,
    });
  };
  return (
    <>
      <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
        <div className="container-fluid">
          <div className="card shadow mb-4 mt-4">
            <div className="card-header py-3">
              <div className="clearfix">
                <h6 className="m-0 font-weight-bold text-primary float-left">
                  Discount Approval
                </h6>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
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
                  <label className="control-label">To Date:</label>
                  <div>
                    <CustomDate
                      name="ToDate"
                      value={payload?.ToDate}
                      className="form-control pull-right reprint-date"
                      onChange={dateSelect}
                      maxDate={new Date()}
                      minDate={new Date(payload?.ToDate)}
                    />
                  </div>
                </div>

                <div className="col-sm-2 form-group">
                  <label className="control-label">Visit Number:</label>

                  <Input
                    className="form-control pull-right reprint-date "
                    type="text"
                    name="LedgertransactionNo"
                    value={payload.LedgertransactionNo}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-sm-2 form-group">
                  <label className="control-label">Patient Name:</label>

                  <Input
                    className="form-control pull-right reprint-date "
                    type="text"
                    name="PatientName"
                    value={payload.PatientName}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-sm-2 form-group">
                  <label className="control-label">Booking Centre:</label>

                  <SelectBox
                    options={Center}
                    name="CentreID"
                    selectedValue={selectedValueCheck(
                      Center,
                      payload?.CentreID
                    )}
                    onChange={handleSelectChange}
                  />
                </div>

                <div className="col-sm-2 form-group">
                  <label className="control-label">
                    Discount Approved By :
                  </label>

                  <SelectBox
                    options={DiscApprove}
                    name={"DiscountApprovedByID"}
                    selectedValue={selectedValueCheck(
                      DiscApprove,
                      payload?.DiscountApprovedByID
                    )}
                    onChange={handleSelectChange}
                  />
                </div>
              </div>

              <div className="mt-2">
                <button className="btn btn-success" onClick={getTableData}>
                  Search
                </button>
              </div>
            </div>
          </div>
          {tableData?.length > 0 && (
            <div className="card shadow mb-4 mt-4">
              <div className="card-body">
                <div className="row">
                  <div className={`col-12`}>
                    <div className={`${tableData?.length >= 8 && "boottable"}`}>
                      <Table responsive hover striped>
                        <thead>
                          <tr>
                            {[
                              "S.No",
                              "Booking Centre",
                              "Visitno",
                              "Barcodeno",
                              "Date",
                              "Patient Name",
                              "Gender",
                              "Gross Amt.",
                              "Discount Amt.",
                              "Net Amt.",
                              "Dis Reason",
                              "Remarks",
                              "CreatedBy",
                              <Input
                                type="checkbox"
                                checked={
                                  tableData.length > 0
                                    ? isChecked(
                                        "isChecked",
                                        tableData,
                                        true
                                      ).includes(false)
                                      ? false
                                      : true
                                    : false
                                }
                                onChange={handleChangeNew}
                              />,
                            ].map((ele, index) => (
                              <th key={index}>{ele}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData?.map((ele, index) => (
                            <tr key={index}>
                              {[
                                index + 1,
                                ele?.Centre,
                                ele?.LedgerTransactionNo,
                                "-",
                                dateConfig(ele?.BillingDATE),
                                ele?.PatientName,
                                ele?.Gender,
                                ele?.GrossAmount,
                                ele?.DiscountOnTotal,
                                ele?.NetAmount,
                                "-",
                                "-",
                                "-",
                                <Input
                                  type="checkbox"
                                  checked={ele?.isChecked}
                                  name="isChecked"
                                  onChange={(e) => handleChangeNew(e, index)}
                                />,
                              ].map((item, i) => (
                                <td key={i}>{item}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>

                {loading ? (
                  <Loading />
                ) : (
                  <div className="mt-2">
                    <button className="btn btn-success" onClick={postApi}>
                      Update
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default DiscountApproval;
