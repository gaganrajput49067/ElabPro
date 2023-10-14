import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { number } from "../../Frontend/util/Commonservices/number";
import Input from "../../ChildComponents/Input";
import { isChecked } from "./Commonservices";
import { toast } from "react-toastify";

const DoctorTypeDefaultShareModal = ({ show, handleClose, DocID }) => {
  const [Department, setDepartment] = useState([]);
  const [RateTypeData, setRateTypeData] = useState([]);

  const getDepartment = () => {
    axios
      .get("/api/v1/Department/getDepartment")
      .then((res) => {
        let data = res.data.message;
        let Department = data.map((ele) => {
          return {
            DepartmentID: ele.DepartmentID,
            Department: ele.Department,
            isChecked: false,
            SharePer: "",
            DocID: DocID,
          };
        });
        setDepartment(Department);
      })
      .catch((err) => console.log(err));
  };

  const RemoveDefaultShare = () => {
    let data = RateTypeData.filter((ele) => ele?.isChecked === true);
    if (data.length > 0) {
      axios
        .post("/api/v1/DoctorShare/RemoveDoctorDefaultShare", data)
        .then((res) => {
          toast.success(res?.data?.message);
          getDoctorData();
          getDepartment();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          );
        });
    } else {
      toast.error("Please Select one row");
    }
  };

  const getDoctorData = () => {
    axios
      .post("/api/v1/DoctorShare/getDefaultShareData", {
        DocID: DocID,
      })
      .then((res) => {
        if (res.status === 200) {
          const data = res.data.message;
          const val = data.map((ele) => {
            return {
              ...ele,
              isChecked: false,
            };
          });
          setRateTypeData(val);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    if (index >= 0) {
      const data = [...Department];
      data[index][name] =
        type === "checkbox"
          ? checked
          : name === "SharePer"
          ? parseInt(value) > 100
            ? ""
            : value
          : value;
      setDepartment(data);
    } else {
      if (type === "checkbox") {
        if (checked) {
          const data = Department.map((ele) => {
            return {
              ...ele,
              [name]: checked,
            };
          });
          setDepartment(data);
        } else {
          const data = Department.map((ele) => {
            return {
              ...ele,
              SharePer: name === "SharePer" ? "" : value,
              [name]: checked,
            };
          });
          setDepartment(data);
          document.getElementById("SharePer").value = "";
        }
      } else {
        const data = Department.map((ele) => {
          return {
            ...ele,
            SharePer:
              name === "SharePer" ? (parseInt(value) > 100 ? "" : value) : "",
          };
        });
        setDepartment(data);
        if (name === "SharePer") {
          let data = document.getElementById("SharePer").value;
          if (parseInt(data) > 100) {
            document.getElementById("SharePer").value = "";
          }
        }
      }
    }
  };

  const Save = () => {
    const data = Department?.filter((ele) => ele.isChecked === true);
    if (data.length > 0) {
      axios
        .post("/api/v1/DoctorShare/DefaultDoctorShareCreate", {
          SaveDoctorShare: data,
        })
        .then((res) => {
          if (res.data.message) {
            toast.success(res.data.message);
            getDoctorData();
            getDepartment();
          } else {
            toast.error("Something went wrong");
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    } else {
      toast.error("Please Select one Row");
    }
  };

  useEffect(() => {
    getDepartment();
    getDoctorData();
  }, []);

  return (
    <Modal show={show} size="lg">
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">Global Share</Modal.Title>
        <button
          type="button"
          className="close"
          onClick={() => {
            handleClose();
          }}
        >
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-body">
          <div className="row">
            <div className="col-12">
              {Department.length > 0 && (
                <div className="px-2 boottable">
                  <Table responsive hover bordered>
                    <thead>
                      <tr>
                        <th>S.no</th>
                        <th>Department Name</th>
                        <th>
                          <Input
                            type="number"
                            placeholder="Share %"
                            name="SharePer"
                            onChange={handleChange}
                            onInput={(e) => number(e, 3)}
                            id="SharePer"
                            className="form-control"
                            disabled={
                              Department?.length > 0
                                ? isChecked(
                                    "isChecked",
                                    Department,
                                    true
                                  ).includes(false)
                                  ? true
                                  : false
                                : false
                            }
                          />
                        </th>
                        <th>
                          <Input
                            type="checkbox"
                            name="isChecked"
                            onChange={handleChange}
                            checked={
                              Department?.length > 0
                                ? isChecked(
                                    "isChecked",
                                    Department,
                                    true
                                  ).includes(false)
                                  ? false
                                  : true
                                : false
                            }
                          />
                          All
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {Department?.map((ele, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{ele?.Department}</td>
                          <td>
                            <Input
                              className="form-control"
                              disabled={ele?.isChecked ? false : true}
                              type="number"
                              name="SharePer"
                              id="SharePer"
                              value={ele?.SharePer}
                              onChange={(e) => handleChange(e, index)}
                              onInput={(e) => number(e, 3)}
                            />
                          </td>
                          <td>
                            <Input
                              type="checkbox"
                              name="isChecked"
                              onChange={(e) => handleChange(e, index)}
                              checked={ele?.isChecked}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
              <div className="col-sm-1">
                <button className="btn btn-success" onClick={Save}>
                  Save
                </button>
              </div>
            </div>
            {RateTypeData.length > 0 && (
              <div className="col-12 mt-5">
                <div
                  className={`px-2 ${
                    RateTypeData.length > 8 ? "boottable" : ""
                  }`}
                >
                  <Table responsive hover bordered>
                    <thead>
                      <tr>
                        <th>S.no</th>
                        <th>Department Name</th>
                        <th>Share %</th>
                        <th>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {RateTypeData?.map((ele, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{ele?.Department}</td>
                          <td>{ele?.SharePer}</td>
                          <td>
                            <Input
                              type="checkbox"
                              checked={ele?.isChecked}
                              name="isChecked"
                              onChange={(e) => {
                                const { name, checked } = e.target;
                                const data = [...RateTypeData];
                                data[index][name] = checked;
                                setRateTypeData(data);
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
                <div className="col-sm-1">
                  <button
                    className="btn btn-success"
                    onClick={RemoveDefaultShare}
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <br />
      </Modal.Body>
      <Modal.Footer>
        <button type="submit" className="btn btn-danger" onClick={handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default DoctorTypeDefaultShareModal;
