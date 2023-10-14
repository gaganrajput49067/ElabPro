import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  getAccessCentres,
  isChecked,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";
import Input from "../../ChildComponents/Input";
import { useTranslation } from "react-i18next";

const RateTypeWiseItemLockMaster = () => {
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

  // const [disable, setDisable] = useState(true);
  // const Disable = () => {
  //   let Disable = true;
  //   for (let i = 0; i < tableData?.length; i++) {
  //     if (tableData[i].isLock === 1) {
  //       Disable = false;
  //       break;
  //     }
  //   }
  //   setDisable(Disable);
  // };

  // useEffect(() => {
  //   Disable();
  // }, [tableData]);

  //Department list Api
    const { t } = useTranslation();

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
        DeptDataValue.unshift({label:"DepartmentID",value:""})
      })
      .catch((err) => console.log(err));
  };

  const handleSelect = (event) => {
    const { name,value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  //Search data Api

  const bindDropDown = () => {
    setLoad({ ...load, searchLoad: true });
    axios
      .post("/api/v1/RateTypeWiseItemLock/getRateTypeLockData", payload)
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

  const saveData = () => {
    setLoad({ ...load, SaveLoad: true });
    axios
      .post("/api/v1/RateTypeWiseItemLock/RateTypeLockDataCreate", tableData)
      .then((res) => {
        toast.success(res?.data?.message);
        setLoad({ ...load, SaveLoad: false });
        bindDropDown();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went wrong"
        );
        setLoad({ ...load, SaveLoad: false });
      });
  };

  const handleCheckbox = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const data = [...tableData];
      data[index][name] = checked === true ? 1 : 0;
      setTableData(data);
    } else {
      const data = tableData?.map((ele) => {
        return {
          ...ele,
          [name]: checked === true ? 1 : 0,
        };
      });
      setTableData(data);
    }
  };

  useEffect(() => {
    getDepartment();
    getAccessCentres(setCentreData);
  }, []);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h6 className="box-title">{t("Rate Type Wise Item Lock Master")}</h6>
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
          {!load?.searchLoad ? (
            tableData.length > 0 && (
            
             <div
                className="box box-body divResult table-responsive boottable"
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
                      <th>{t("Investigation")}</th>
                      <th>{t("Rate")}</th>
                      <th>
                        <input
                          type="checkbox"
                          name="isLock"
                          onChange={(e) => handleCheckbox(e)}
                          checked={
                            tableData?.length > 0
                              ? isChecked("isLock", tableData, 1).includes(
                                  false
                                )
                                ? false
                                : true
                              : false
                          }
                        ></input>
                        <label>{t("All Lock")}</label>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((data, index) => (
                      <tr key={index}>
                        <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                        <td data-title={t("Investigation")}>{data?.TestName}&nbsp;</td>
                        <td data-title={t("Rate")}>{data?.Rate}&nbsp;</td>
                        <td data-title={t("isLock")}>
                          <Input
                            type="checkbox"
                            checked={data?.isLock}
                            name="isLock"
                            onChange={(e) => handleCheckbox(e, index)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

               
                 <div className="box-footer">
                  <div className="row">
                  <div className="col-sm-1">
                    {load?.saveLoad ? (
                      <Loading />
                    ) : (
                      <button
                        type="submit"
                        className="btn btn-block btn-success btn-sm"
                        onClick={saveData}
                        // disabled={disable}
                      >
                        {t("Save")}
                      </button>
                    )}
                  </div>
                  </div>
                 </div>
               
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

export default RateTypeWiseItemLockMaster;
