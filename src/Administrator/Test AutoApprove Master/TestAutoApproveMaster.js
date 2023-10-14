import React from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { useState } from "react";
import { Table } from "react-bootstrap";
import {
  isChecked,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import Loading from "../../Frontend/util/Loading";

const TestAutoApproveMaster = () => {
  const [show, setShow] = useState(false);
  const [FetchDepartment, setFetchDepartment] = useState([]);
  const [FetchCentre, setFetchCentre] = useState([]);
  const [searchLoad, setsearchLoad] = useState(false);
  const [searchLoad1, setsearchLoad1] = useState(false);
  const [saveLoad, setSaveLoad] = useState(false);
  const [DoctorData, setDoctorData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableDataMaster, setTableDataMaster] = useState([]);
  const [payload, setPayload] = useState({
    BookingCentreId: "",
    DepartmentId: "",
    TestName: "",
    DocID: "",
    DoctorName: "",
  });

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setPayload({ ...payload, [name]: event.value });
  };

  const fetchDepartment = () => {
    axios
      .get("/api/v1/TestCentreMappingController/BindDepartment")
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            label: ele?.department,
            value: ele?.departmentid,
          };
        });
        setFetchDepartment(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  const getDoctorSuggestion = (name) => {
    axios
      .post("/api/v1/AutoApproval/getBindDoctor", {
        DoctorName: name,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            label: ele?.DoctorName,
            value: ele?.EmployeeID,
          };
        });
        setDoctorData(val);
      })
      .catch((err) => console.log(err));
  };

  const fetchCenter = () => {
    axios
      .get("/api/v1/TestCentreMappingController/BindBookingCentre")
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => {
          return {
            label: ele?.Centre,
            value: ele?.centreId,
          };
        });
        setFetchCentre(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  const handleSelect = (event, rest) => {
    const { name } = rest;
    setPayload({ ...payload, [name]: event.value });
  };

  const handleOnChangeSelect = (event) => {
    const { value } = event?.target;
    setPayload({ ...payload, DoctorName: value });
  };

  const handleSubmit = () => {
    setsearchLoad(true);
    axios
      .post("/api/v1/AutoApproval/SaveAutoAupprovalMasterSig", {
        departmentid: payload?.DepartmentId,
        CentreId: payload?.BookingCentreId,
        DoctorId: payload?.DocID,
      })
      .then((res) => {
        toast.success(res?.data?.message?.message);
        setsearchLoad(false);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
        setsearchLoad(false);
      });
  };

  const getApprovalMasterSig = () => {
    setsearchLoad1(true);
    axios
      .post("/api/v1/AutoApproval/getAutoApprovalMasterSig")
      .then((res) => {
        setTableDataMaster(res?.data?.message);
        setsearchLoad1(false);
      })
      .catch((err) => {
        toast.error(err?.data?.message ? err?.data?.message : "Error Occured");
        setsearchLoad1(false);
      });
  };

  const handleSearch = () => {
    setsearchLoad(true);
    axios
      .post("/api/v1/AutoApproval/getAutoApprovalCentreInv", {
        departmentID: payload?.DepartmentId,
        centreId: payload?.BookingCentreId,
      })
      .then((res) => {
        let val = res?.data?.message?.map((ele) => {
          return {
            ...ele,
            isChecked: false,
          };
        });
        setTableData(val);
        setsearchLoad(false);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
        setsearchLoad(false);
      });
  };

  const handleCheckbox = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const data = [...tableData];
      data[index][name] = checked;
      setTableData(data);
    } else {
      const val = tableData.map((ele) => {
        return {
          ...ele,
          [name]: checked,
        };
      });

      setTableData(val);
    }
  };

  const handleCentreInvSubmit = () => {
    setSaveLoad(true);
    const data = tableData.filter((ele) => ele?.isChecked === true);
    const val = data.map((ele) => {
      return {
        departmentid: ele?.DepartmentID,
        CentreId: ele?.CentreId,
        Investigation: ele?.InvestigationID,
      };
    });
    axios
      .post("/api/v1/AutoApproval/SaveAutoApprovalCentreInv", {
        data: val,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setSaveLoad(false);
        handleSearch();
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
        setSaveLoad(false);
      });
  };

  const DeleteAutoAupprovalMasterSig = (id) => {
    axios
      .post("/api/v1/AutoApproval/DeleteAutoAupprovalMasterSig", {
        Id: id,
      })
      .then((res) => {
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        toast.error(err?.data?.message ? err?.data?.message : "Error Occured");
      });
  };

  const disableButton = () => {
    let disable = false;
    if (show) {
      if (payload?.DepartmentId === "" && payload?.BookingCentreId === "") {
        disable = true;
      }
    } else {
      if (
        payload?.DepartmentId === "" &&
        payload?.BookingCentreId === "" &&
        payload?.DocID === ""
      ) {
        disable = true;
      }
    }

    return disable;
  };

  useEffect(() => {
    fetchCenter();
    fetchDepartment();
  }, []);

  useEffect(() => {
    if (!show) {
      getApprovalMasterSig();
    }
  }, [show]);

  useEffect(() => {
    if (payload?.DoctorName.length > 1) {
      getDoctorSuggestion(payload?.DoctorName);
    } else {
      setDoctorData([]);
    }
  }, [payload?.DoctorName]);

  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid pt-3">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                {!show
                  ? "Test Auto Approve Master"
                  : "Auto Approve Centre Investigation"}
              </h6>
            </div>
          </div>
          {!show ? (
            <div className="card-body">
              <div className="row">
                <div className="col-sm-2 form-group">
                  <label className="control-label" htmlFor="CentreID">
                    Test Centre
                  </label>
                  :
                  <SelectBox
                    name="BookingCentreId"
                    className="required"
                    options={FetchCentre}
                    onChange={handleSelectChange}
                    selectedValue={selectedValueCheck(
                      FetchCentre,
                      payload?.BookingCentreId
                    )}
                  />
                </div>
                <div className="col-sm-2  form-group">
                  <label className="control-label" htmlFor="CentreID">
                    Doctor Name
                  </label>
                  :
                  <SelectBox
                    className="required"
                    name="DocID"
                    options={DoctorData}
                    onChange={handleSelect}
                    selectedValue={selectedValueCheck(
                      DoctorData,
                      payload?.DocID
                    )}
                    noOptionsMessage={() => null}
                    keyEvent={true}
                    onKeyPress={handleOnChangeSelect}
                  />
                </div>
                <div className="col-sm-2  form-group">
                  <label className="control-label" htmlFor="CentreID">
                    Department Name
                  </label>
                  :
                  <SelectBox
                    className="required"
                    onChange={handleSelectChange}
                    name="DepartmentId"
                    options={FetchDepartment}
                    selectedValue={selectedValueCheck(
                      FetchDepartment,
                      payload?.DepartmentId
                    )}
                  />
                </div>
                <div
                  className="text-primary"
                  style={{
                    alignSelf: "flex-end",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setShow(true);
                    setPayload({
                      BookingCentreId: "",
                      DepartmentId: "",
                      TestName: "",
                      DocID: "",
                      DoctorName: "",
                    });
                    setTableData([]);
                  }}
                >
                  Set Test For AutoApproved
                </div>
              </div>
            </div>
          ) : (
            <div className="card-body">
              <div className="row px-2">
                <div className="col-sm-2 form-group">
                  <label className="control-label" htmlFor="CentreID">
                    Test Centre
                  </label>
                  :
                  <SelectBox
                    name="BookingCentreId"
                    className="required"
                    options={FetchCentre}
                    onChange={handleSelectChange}
                    selectedValue={selectedValueCheck(
                      FetchCentre,
                      payload?.BookingCentreId
                    )}
                  />
                </div>
                <div className="col-sm-2  form-group">
                  <label className="control-label" htmlFor="CentreID">
                    Department Name
                  </label>
                  :
                  <SelectBox
                    className="required"
                    onChange={handleSelectChange}
                    name="DepartmentId"
                    options={FetchDepartment}
                    selectedValue={selectedValueCheck(
                      FetchDepartment,
                      payload?.DepartmentId
                    )}
                  />
                </div>
                <div
                  className="text-primary"
                  style={{
                    alignSelf: "flex-end",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setShow(false);
                    setPayload({
                      BookingCentreId: "",
                      DepartmentId: "",
                      TestName: "",
                      DocID: "",
                      DoctorName: "",
                    });
                    setTableData([]);
                  }}
                >
                  Set Signature For AutoApproved
                </div>
              </div>
            </div>
          )}

          <div className="col-sm-1 col-md-1 pull-right reprint-date mt-2">
            {searchLoad ? (
              <Loading />
            ) : show ? (
              <button
                className="btn btn-primary mx-2"
                onClick={handleSearch}
                disabled={disableButton()}
              >
                Search
              </button>
            ) : (
              <button
                className="btn btn-primary mx-2"
                onClick={handleSubmit}
                disabled={disableButton()}
              >
                Save
              </button>
            )}
          </div>
        </div>

        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                Search Result
              </h6>
            </div>
          </div>
          {show ? (
            tableData?.length > 0 && (
              <div className="card-body ">
                <div className={` ${tableData.length > 8 && "boottable"}`}>
                  <Table bordered responsive hover>
                    <thead>
                      <tr>
                        <th>S.no</th>
                        <th>Test</th>
                        <th>
                          Auto Approve
                          <div>
                            <input
                              type="checkbox"
                              name="isChecked"
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
                              onChange={(e) => handleCheckbox(e)}
                            />
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData?.map((ele, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{ele?.TestName}</td>
                          <td>
                            <input
                              type="checkbox"
                              name="isChecked"
                              checked={ele?.isChecked}
                              onChange={(e) => handleCheckbox(e, index)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {saveLoad ? (
                  <Loading />
                ) : (
                  <div>
                    <button
                      className="btn btn-primary"
                      onClick={handleCentreInvSubmit}
                      disabled={
                        isChecked("isChecked", tableData, true).includes(true)
                          ? false
                          : true
                      }
                    >
                      Submit
                    </button>
                  </div>
                )}
              </div>
            )
          ) : searchLoad1 ? (
            <Loading />
          ) : (
            tableDataMaster?.length > 0 && (
              <div className="card-body bootable">
                <div className="mx-2">
                  <Table bordered responsive hover>
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Centre</th>
                        <th>Department</th>
                        <th>Doctor</th>
                        <th>View Sign</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableDataMaster?.map((ele, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{ele?.centre}</td>
                          <td>{ele?.Department}</td>
                          <td>-</td>
                          <td>view</td>
                          <td>
                            <button
                              className="btn btn-danger"
                              onClick={() =>
                                DeleteAutoAupprovalMasterSig(ele?.id)
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default TestAutoApproveMaster;
