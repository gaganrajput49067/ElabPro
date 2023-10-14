import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, Table } from "react-bootstrap";
import { number } from "../../Frontend/util/Commonservices/number";
import Input from "../../ChildComponents/Input";
import { isChecked } from "./Commonservices";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const RateTypeDefaultShareModal = ({ show, handleClose, RateTypeID }) => {
  const [Department, setDepartment] = useState([]);
  const [RateTypeData, setRateTypeData] = useState([]);
  const { t } = useTranslation();

  const ID = {
    RateTypeID: RateTypeID ? RateTypeID : "",
  };

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
          };
        });
        setDepartment(Department);
      })
      .catch((err) => console.log(err));
  };

  const RemoveDefaultShare = () => {
    let data = RateTypeData.filter((ele) => ele?.isChecked === true);
    data.map((ele) => {
      return {
        DepartmentID: ele?.DepartmentID,
      };
    });
    if (data.length > 0) {
      axios
        .post("/api/v1/RateTypeShare/RemoveDefaultShare", data)
        .then((res) => {
          toast.success(res?.data?.message);
          getRateTypeData();
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

  const getRateTypeData = () => {
    axios
      .post("/api/v1/RateTypeShare/getDefaultRateTypeShareData", {
        RateTypeID: ID.RateTypeID,
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
        .post("/api/v1/RateTypeShare/DefaultRateTypeShareCreate", {
          RateTypeID: ID.RateTypeID,
          Data: data,
        })
        .then((res) => {
          if (res.data.message) {
            toast.success(res.data.message);
            getRateTypeData();
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
    getRateTypeData();
  }, []);

  return (
    <Modal show={show} size="lg">
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">{t("Global Share")}</Modal.Title>
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
        <div className="box_Container">
          <div className="box-body">
            <div className="row">
              <div className="col-12">
                {Department.length > 0 && (
                  <div
                    className="divResult boottable table-responsive"
                    id="no-more-tables"
                  >
                    <table
                      className="table table-bordered table-hover table-responsive table-striped tbRecord"
                      cellPadding="{0}"
                    >
                      <thead className="cf">
                        <tr>
                          <th>{t("S .No")}</th>
                          <th>{t("Department Name")}</th>
                          <th>
                            <Input
                              type="number"
                              className="select-input-box form-control input-sm"
                              placeholder={t("Share %")}
                              name="SharePer"
                              onChange={handleChange}
                              onInput={(e) => number(e, 3)}
                              id="SharePer"
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
                            {t("All")}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Department?.map((ele, index) => (
                          <tr key={index}>
                            <td data-title={t("S .No")}>{index + 1}</td>
                            <td data-title={t("Department Name")}>
                              {ele?.Department}
                            </td>
                            <td data-title={t("SharePer")}>
                              <Input
                                className="select-input-box form-control input-sm"
                                disabled={ele?.isChecked ? false : true}
                                type="number"
                                name="SharePer"
                                id="SharePer"
                                value={ele?.SharePer}
                                onChange={(e) => handleChange(e, index)}
                                onInput={(e) => number(e, 3)}
                              />
                            </td>
                            <td data-title={"#"}>
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
                    </table>
                  </div>
                )}
                <div className="row">
                <div className="col-sm-1">
                  <button
                    type="button"
                    className="btn btn-block btn-success btn-sm"
                    id="btnSave"
                    onClick={Save}
                  >
                   {t("Save")}
                  </button>
                </div>
                <div className="col-sm-1">
            <button
              type="button"
              className="btn btn-block btn-danger btn-sm"
              id="btnSave"
              onClick={handleClose}
            >
            {t("Close")}  
            </button>
          </div>
          </div>
              </div>
              {RateTypeData.length > 0 && (
                <div className="col-12 mt-5">
                  <div
                    className={`px-2 ${
                      RateTypeData.length > 8 ? "boottable" : ""
                    }`}
                  >
                    <table
                      className="table table-bordered table-hover table-responsive table-striped tbRecord"
                      cellPadding="{0}"
                      cellSpacing="{0}"
                    >
                      <thead className="cf">
                        <tr>
                          <th>{t("S.No.")}</th>
                          <th>{t("Department Name")}</th>
                          <th>{t("Share %")}</th>
                          <th>{t("Delete")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {RateTypeData?.map((ele, index) => (
                          <tr key={index}>
                            <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                            <td data-title={t("Department Name")}>{ele?.Department}&nbsp;</td>
                            <td data-title={t("Share %")}>{ele?.SharePer}&nbsp;</td>
                            <td data-title={t("Delete")}>
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
                    </table>
                  </div>
                  <div className="col-sm-1">
                    <button
                      type="button"
                      className="btn btn-block btn-danger btn-sm"
                      id="btnSave"
                      onClick={RemoveDefaultShare}
                    >
                    {t("Delete")}  
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <br />
      </Modal.Body>
      {/* <Modal.Footer>
        <div className="row">
        
        </div>
      </Modal.Footer> */}
    </Modal>
  );
};

export default RateTypeDefaultShareModal;
