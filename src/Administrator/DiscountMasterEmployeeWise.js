import React from "react";
import Input from "../ChildComponents/Input";
import { SelectBox, SelectBoxWithCheckbox } from "../ChildComponents/SelectBox";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import {
  getAccessCentres,
  selectedValueCheck,
} from "../Frontend/util/Commonservices";
import { toast } from "react-toastify";
import { Table } from "react-bootstrap";
import Loading from "../Frontend/util/Loading";

const Data = [
  {
    label: "Client Share",
    value: 0,
  },
  {
    label: "Lab share",
    value: 1,
  },
];

function DiscountMasterEmployeeWise() {
  const [DepartmentOptions, setDepartmentOptions] = useState([]);
  const [Employee, setEmployee] = useState([]);
  const [Centre, setCentre] = useState([]);
  const [disable, setDisable] = useState(false);
  const [Load, setLoad] = useState(false);
  const [DeleteLoad, setDeleteLoad] = useState({
    load: false,
    index: -1,
  });
  const [payload, setPayload] = useState({
    DesignationID: "",
    EmployeeID: "",
    sharetype: "0",
    ItemData: "",
    DiscountMonth: 0,
    DiscountBill: 0,
    DiscountOnPackage: 0,
    AppBelowBaseRate: 0,
  });

  const [tableData, setTableData] = useState([]);

  const getDesignationData = () => {
    axios
      .get("/api/v1/Designation/getDesignationData")
      .then((res) => {
        if (res.status === 200) {
          const data = res?.data?.message.map((ele) => {
            return {
              label: ele?.DesignationName,
              value: ele?.DesignationID,
            };
          });

          setDepartmentOptions(data);
        }
      })
      .catch((err) => console.log(err));
  };

  const getEmployee = () => {
    axios
      .post("/api/v1/DiscountMaster/bindEmployee", {
        DesignationID: payload?.DesignationID,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            label: ele?.NAME,
            value: ele?.EmployeeID,
          };
        });
        setEmployee(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
      });
  };

  const getSearchData = () => {
    axios
      .post("/api/v1/DiscountMaster/Search", {
        EmployeeID: payload?.EmployeeID,
      })
      .then((res) => {
        if (res?.data?.message.length > 0) {
          setPayload({
            ...payload,
            DiscountMonth: res?.data?.message[0]?.DiscountPerMonth,
            DiscountBill: res?.data?.message[0]?.DiscountPerBill_per,
          });
        } else {
          setPayload({
            ...payload,
            DiscountMonth: 0,
          });
        }
        setTableData(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
      });
  };

  const handleChanges = (select, name) => {
    let val = "";
    for (let i = 0; i < select.length; i++) {
      val = val === "" ? `${select[i].value}` : `${val},${select[i].value}`;
    }
    setPayload({ ...payload, [name]: val });
  };

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setPayload({ ...payload, [name]: event.value });
  };

  useEffect(() => {
    if (payload?.DesignationID !== "") {
      getEmployee();
    }
  }, [payload?.DesignationID]);

  useEffect(() => {
    if (payload?.EmployeeID) {
      getSearchData();
    }
  }, [payload?.EmployeeID]);

  const PostApi = () => {
    setLoad(true);
    axios
      .post("/api/v1/DiscountMaster/SaveDiscount", payload)
      .then((res) => {
        toast.success(res?.data?.message);
        setLoad(false);
        setPayload({
          DesignationID: "",
          EmployeeID: "",
          sharetype: "0",
          ItemData: "",
          DiscountMonth: 0,
          DiscountBill: 0,
          DiscountOnPackage: 0,
          AppBelowBaseRate: 0,
        });
        setTableData([]);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
        setLoad(false);
      });
  };

  const Validation = () => {
    let Disable = false;
    if (
      payload?.DesignationID === "" ||
      payload?.EmployeeID === "" ||
      payload?.DiscountMonth <= 0 ||
      payload?.DiscountBill <= 0 ||
      payload?.ItemData === ""
    ) {
      Disable = true;
    }
    setDisable(Disable);
  };

  const HandleDelete = (id, i) => {
    setDeleteLoad({
      load: true,
      index: i,
    });
    axios
      .post("/api/v1/DiscountMaster/Remove", {
        DisAppID: id,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        getSearchData();
        setDeleteLoad({
          load: false,
          index: -1,
        });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
        setDeleteLoad({
          load: false,
          index: -1,
        });
      });
  };

  useEffect(() => {
    Validation();
  }, [payload]);

  useEffect(() => {
    getDesignationData();
    getAccessCentres(setCentre);
  }, []);
  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid">
        <div className="card shadow mb-4 mt-4">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                Discount Approval Employee Wise
              </h6>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="center">
                  Designation :
                </label>
                <SelectBox
                  options={DepartmentOptions}
                  name="DesignationID"
                  selectedValue={selectedValueCheck(
                    DepartmentOptions,
                    payload?.DesignationID
                  )}
                  className={"required"}
                  onChange={handleSelectChange}
                />
              </div>

              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="center">
                  Employee :
                </label>
                <SelectBox
                  options={Employee}
                  name="EmployeeID"
                  selectedValue={selectedValueCheck(
                    Employee,
                    payload?.EmployeeID
                  )}
                  className={"required"}
                  onChange={handleSelectChange}
                />
              </div>

              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="center">
                  Max Discount Per Month(in Rs.) :
                </label>
                <Input
                  type="number"
                  name="DiscountMonth"
                  onChange={(e) => {
                    setPayload({ ...payload, [e.target.name]: e.target.value });
                  }}
                  value={payload?.DiscountMonth}
                  className="form-control pull-right reprint-date required"
                />
              </div>

              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="center">
                  Share Type :
                </label>
                <SelectBox
                  options={Data}
                  name="sharetype"
                  selectedValue={selectedValueCheck(Data, payload?.sharetype)}
                  onChange={handleSelectChange}
                  className="required"
                />
              </div>

              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="center">
                  Centre :
                </label>
                <SelectBoxWithCheckbox
                  name="ItemData"
                  className="required"
                  options={Centre}
                  value={payload?.ItemData}
                  onChange={handleChanges}
                />
              </div>

              <div className="col-sm-2 form-group">
                <label className="control-label" htmlFor="center">
                  Discount Bill:
                </label>
                <Input
                  name="DiscountBill"
                  type="number"
                  value={payload?.DiscountBill}
                  className="form-control pull-right reprint-date required"
                  onChange={(e) => {
                    setPayload({ ...payload, [e.target.name]: e.target.value });
                  }}
                />
              </div>

              <div
                className="col-sm-2 form-group"
                style={{ alignSelf: "flex-end" }}
              >
                {Load ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-success"
                    disabled={disable}
                    onClick={PostApi}
                  >
                    Save
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {tableData.length > 0 && (
          <div className="card shadow mb-4 mt-4">
            <div className="card-header py-3">
              <div className="clearfix">
                <h6 className="m-0 font-weight-bold text-primary float-left">
                  Search Result
                </h6>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-12">
                  <div className={`${tableData.length > 8 && "boottable"}`}>
                    <Table responsive bordered>
                      <thead>
                        <tr>
                          {[
                            "S.No.",
                            "Centre Code",
                            "Centre Name",
                            "Discounted RateType",
                            "Employee Name",
                            "Max Disc.(Amt.)",
                            "Max Disc.(%)",
                            "Remove",
                          ].map((ele, index) => (
                            <th key={index}>{ele}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {tableData?.map((ele, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{ele?.CentreCode}</td>
                            <td>{ele?.Centre}</td>
                            <td>-</td>
                            <td>{ele?.EmpName}</td>
                            <td>{ele?.DiscountPerMonth}</td>
                            <td>{ele?.DiscountPerBill_per}</td>
                            <td>
                              {DeleteLoad?.load &&
                              DeleteLoad?.index === index ? (
                                <Loading />
                              ) : (
                                <button
                                  className="btn btn-danger"
                                  onClick={() =>
                                    HandleDelete(ele?.DisAppID, index)
                                  }
                                >
                                  Remove
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DiscountMasterEmployeeWise;
