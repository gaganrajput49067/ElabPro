import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Table } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { toast } from "react-toastify";
import { isChecked } from "./Commonservices";

import { useTranslation } from "react-i18next";
const AgeWiseModal = ({ show, handleClose, DiscountData }) => {
  const [Dropdown, setDropdown] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [InvestigationData, setInvestigationData] = useState([]);

const { t } = useTranslation();
  const getDepartment = () => {
    axios
      .get("/api/v1/Department/getDepartmentData")
      .then((res) => {
        let data = res.data.message;
        let Department = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        Department.unshift({ label: "All", value: "" });
        setDropdown(Department);
      })
      .catch((err) => console.log(err));
  };

  const filterData = () => {
    let data = [];
    for (let i = 0; i < tableData?.length; i++) {
      data.push(tableData[i]["InvestigationId"]);
    }

    return data;
  };

  const getDiscountMasterItemData = () => {
    axios
      .post("/api/v1/AgeWiseDiscount/getDiscountMasterItemData", {
        DiscountId: DiscountData?.DiscountId,
      })
      .then((res) => {
        setTableData(res.data.message);
      })
      .catch((err) => console.log(err));
  };

  const Fetch = (id) => {
    axios
      .post("/api/v1/AgeWiseDiscount/AgeWiseDiscountGetInvestigationData", {
        DepartmentID: id,
      })
      .then((res) => {
        let data = res.data.message;
        const val = data.filter((ele) => {
          if (!filterData().includes(ele?.InvestigationID)) {
            return {
              ele,
            };
          }
        });

        const newVal = val.map((ele) => {
          return {
            ...ele,
            DiscountId: DiscountData?.DiscountId,
            DiscountPer: DiscountData?.DiscountPer,
            isActive: "0",
          };
        });
        setInvestigationData(newVal);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        console.log(err);
      });
  };

  console.log(InvestigationData);

  const handleSelectChange = (event) => {
    Fetch(event.target.value);
  };

  const handleCheckbox = (e, index, data) => {
    const { name, checked } = e.target;
    checkDuplicate(data?.InvestigationID, data?.DiscountId)
      .then((res) => {
        if (res === "Duplicate Investigation") {
          toast.error(res);
        } else {
          if (index >= 0) {
            const data = [...InvestigationData];
            data[index][name] = checked ? "1" : "0";
            return setInvestigationData(data);
          } else {
            const val = InvestigationData.map((ele) => {
              return {
                ...ele,
                [name]: checked ? "1" : "0",
              };
            });
            return setInvestigationData(val);
          }
        }
      })
      .catch((err) => console.log(err));
  };

  const disableData = (DiscountID, InvestigationId) => {
    if (window.confirm("Are You Sure?")) {
      axios
        .post("/api/v1/AgeWiseDiscount/RemoveInvestigationDiscountMaster", {
          DiscountID,
          InvestigationId,
        })
        .then((res) => {
          if (res?.data?.message === "Remove successfully") {
            toast.success(res?.data?.message);
            getDiscountMasterItemData();
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          console.log(err);
        });
    }
  };

  const checkDuplicate = (InvestigationId, DiscountId) => {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/v1/AgeWiseDiscount/DuplicateInvestigationDiscountMaster", {
          InvestigationID: InvestigationId,
          DiscountId: DiscountId,
        })
        .then((res) => {
          if (res.data.message) {
            resolve(res.data.message);
          }
        })
        .catch((err) => {
          console.log(err);
          reject(err);
        });
    });
  };

  useEffect(() => {
    getDepartment();
  }, []);

  const Api = () => {
    const data = InvestigationData.filter((ele) => ele?.isActive === "1");
    if (data.length > 0) {
      const payload = data.map((ele) => {
        return {
          DiscountID: ele.DiscountId,
          InvestigationId: ele.InvestigationID,
          DiscountPer: ele.DiscountPer,
          isActive: ele.isActive,
        };
      });
      axios
        .post("/api/v1/AgeWiseDiscount/AddDiscountMasterItem", payload)
        .then((res) => {
          if (res.data.message) {
            toast.success(res.data.message);
            const val = InvestigationData.map((ele) => {
              return {
                ...ele,
                isActive: 0,
              };
            });
            Fetch();
            setInvestigationData(val);
            getDiscountMasterItemData();
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);

          if (err?.response?.status === 504) {
            toast.error("Something went wrong");
          }
        });
    } else {
      toast.error("Please Select One Test");
    }
  };

  useEffect(() => {
    getDiscountMasterItemData();
  }, [DiscountData?.DiscountID]);

  console.log(InvestigationData);

  return (
    <Modal show={show} size="md">
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">{t("Global Share")}</Modal.Title>
        <button
          type="button"
          className="close"
          onClick={() => {
            handleClose();
            setInvestigationData([]);
          }}
        >
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="box-body">
          <div className="row">
            <div className="col-sm-12">
              <SelectBox
                options={[
                  { label: "Select Department", value: "0" },
                  ...Dropdown,
                ]}
                name="DepartmentID"
                onChange={handleSelectChange}
              />
            </div>
          </div>
          {InvestigationData.length > 0 && (
            <div
              className={`box-body divResult table-responsive ${
                InvestigationData.length > 8 && "boottable"
              }`}
              id="no-more-tables"
            >
              <table
                className="table table-bordered table-hover table-striped tbRecord"
                cellPadding="{0}"
                cellSpacing="{0}"
              >
                <thead className="cf">
                  <tr>
                    <th>{t("S.No")}</th>
                    <th>{t("Investigation Code")}</th>
                    <th>{t("Investigation Name")}</th>
                    <th>
                      <Input
                        type="checkbox"
                        onChange={handleCheckbox}
                        checked={
                          InvestigationData?.length > 0
                            ? isChecked(
                                "isActive",
                                InvestigationData,
                                "1"
                              ).includes(false)
                              ? false
                              : true
                            : false
                        }
                        name="isActive"
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {InvestigationData?.map((ele, index) => (
                    <tr key={index}>
                      <td data-title={t("S.No")}>{index + 1} &nbsp;</td>
                      <td data-title={t("Investigation Code")}>{ele?.TestCode} &nbsp;</td>
                      <td data-title={t("Investigation Name")}>{ele?.TestName} &nbsp;</td>
                      <td>
                        <Input
                          type="checkbox"
                          name="isActive"
                          checked={ele?.isActive === "1" ? true : false}
                          onChange={(e) => handleCheckbox(e, index, ele)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        <div className="row">
          <div className="col-sm-1">
            {InvestigationData.length > 0 && (
              <button
                type="button"
                className="btn btn-block  btn-warning btn-sm"
                onClick={Api}
              >
                {t("Add")}
              </button>
            )}
          </div>
        </div>

        {tableData.length > 0 && (
          <div className="box">
            <div
              className={`box-body divResult table-responsive ${
                tableData.length > 8 && "boottable"
              }`}
              id="no-more-tables"
            >
              <table
                className="table table-bordered table-hover table-responsive table-striped tbRecord"
                cellPadding="{0}"
                cellSpacing="{0}"
              >
                <thead className="cf">
                  <tr>
                    <th>{t("S.No")}</th>
                    <th>{t("Department Name")}</th>
                    <th>{t("Investigation Code")}</th>
                    <th>{t("Investigation Name")}</th>
                    <th>{t("Action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((ele, index) => (
                    <tr key={index}>
                      <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                      <td data-title={t("Department Name")}>{ele?.Department}&nbsp;</td>
                      <td data-title={t("Investigation Code")}>{ele?.TestCode}&nbsp;</td>
                      <td data-title={t("Investigation Name")}>{ele?.TestName}&nbsp;</td>
                      <td data-title={t("Action")}>
                        <button
                          className="btn btn-danger btn-sm"
                          name="disableData"
                          onClick={() =>
                            disableData(ele?.DiscountID, ele?.InvestigationId)
                          }
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <div className="box-footer">
          <div className="row">
            <div className="col-sm-2">
              <button
                className="btn btn-block btn-danger btn-sm"
                onClick={handleClose}
              >
                {t("Close")}
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AgeWiseModal;
