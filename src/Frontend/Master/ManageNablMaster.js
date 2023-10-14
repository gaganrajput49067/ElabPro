import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { SelectAccredition } from "../../ChildComponents/Constants";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  getAccessCentres,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";
import { useTranslation } from "react-i18next";

const ManageNablMaster = () => {
    const { t } = useTranslation();
  const [CentreData, setCentreData] = useState([]);
  const [load, setLoad] = useState({
    saveLoad: false,
    searchLoad: false,
  });
  const [DepartmentData, setDepartmentData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [payload, setPayload] = useState({
    CentreID: "1",
    DepartmentID: "1",
  });

  const handleChangeDropDown = (e, index) => {
    const { name, value } = e.target;
    const data = [...tableData];
    const dropLabel = SelectAccredition.find((ele) => ele?.value === value);
    if (index >= 0) {
      data[index][name] = value;
      data[index]["AccreditionName"] = dropLabel?.label;
      setTableData(data);
    } else {
      const val = data.map((ele) => {
        return {
          ...ele,
          [name]: value,
          AccreditionName: dropLabel?.label,
        };
      });
      setTableData(val);
    }
  };

  console.log(tableData);
  const getDepartment = () => {
    axios
      .get("/api/v1/Department/getDepartmentData")
      .then((res) => {
        let data = res.data.message;
        let DeptDataValue = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        setDepartmentData(DeptDataValue);
        DeptDataValue.unshift({ label: "DepartmentID", value: "" });
      })
      .catch((err) => console.log(err));
  };

  const handleSelect = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  const bindDropDown = () => {
    setLoad({ ...load, searchLoad: true });
    axios
      .post("/api/v1/ManageIsNablController/BindManageIsNablData", payload)
      .then((res) => {
        setTableData(res?.data?.message);
        setLoad({ ...load, searchLoad: false });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "error occured"
        );
        setLoad({ ...load, searchLoad: false });
      });
  };

  const handleSave = () => {
    setLoad({ ...load, saveLoad: true });
    axios
      .post("/api/v1/ManageIsNablController/SaveManageIsNabl", tableData)
      .then((res) => {
        toast.success(res?.data?.message);
        setLoad({ ...load, saveLoad: false });
        bindDropDown();
      })
      .catch((err) => {
        console.log(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoad({ ...load, saveLoad: false });
      });
  };

  useEffect(() => {
    bindDropDown();
  }, []);

  useEffect(() => {
    getDepartment();
    getAccessCentres(setCentreData);
  }, []);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h6 className="box-title">{t("Manage Nabl")}</h6>
        </div>

        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("CentreID")}:</label>
            <div className="col-sm-2">
              <SelectBox
                name="CentreID"
                options={CentreData}
                value={payload?.CentreID}
                onChange={handleSelect}
              />
            </div>
            <label className="col-sm-1">{t("DepartmentID")}:</label>
            <div className="col-sm-2">
              <SelectBox
                name="DepartmentID"
                options={DepartmentData}
                value={payload?.DepartmentID}
                onChange={handleSelect}
              />
            </div>

            <div className="col-sm-1">
              <button
                type="submit"
                className="btn btn-block btn-info btn-sm"
                onClick={bindDropDown}
              >
               {t("Search")} 
              </button>
            </div>
          </div>
        </div>

        <div className="box-body">
          {!load?.searchLoad ? (
            <>
              <div
                className={`box-body divResult table-responsive boottable ${
                  SelectAccredition.length > 8 ? "boottable" : ""
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
                      <th>{t("S No.")}</th>
                      <th>{t("Department")}</th>
                      <th>{t("Investigation")}</th>
                      <th>{t("Rate")}</th>
                      <th>
                        <select
                          className="form-control ui-autocomplete-input input-sm"
                          onChange={handleChangeDropDown}
                          name="AccreditionId"
                        >
                          {SelectAccredition.map((data, index) => (
                            <option value={data?.value} key={index}>
                              {data?.label}
                            </option>
                          ))}
                        </select>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((data, index) => (
                      <tr key={index}>
                        <td data-title={t("S No.")}>{index + 1}&nbsp;</td>
                        <td data-title={t("Department")}>
                          {data?.Department}&nbsp;
                        </td>
                        <td data-title={t("Investigation")}>
                          {data?.TestName}&nbsp;
                        </td>
                        <td data-title={t("Rate")}>{data?.Rate}&nbsp;</td>
                        <td data-title={t("AccreditionId")}>
                          <select
                            className="form-control ui-autocomplete-input input-sm"
                            value={data?.AccreditionId}
                            name="AccreditionId"
                            onChange={(e) => handleChangeDropDown(e, index)}
                          >
                            {SelectAccredition.map((data, index) => (
                              <option value={data?.value} key={index}>
                                {data?.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="box-footer">
                <div className="row">
                  {load?.saveLoad ? (
                    <Loading />
                  ) : (
                    <div className="col-sm-1">
                      <button
                        type="button"
                        className="btn btn-success btn-block btn-sm"
                        onClick={handleSave}
                      >
                        {t("Save")}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <Loading />
          )}
        </div>
      </div>
    </>
  );
};

export default ManageNablMaster;
