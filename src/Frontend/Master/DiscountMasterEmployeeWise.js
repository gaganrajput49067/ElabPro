import React from "react";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import {
  SelectBox,
  SelectBoxWithCheckbox,
} from "../../ChildComponents/SelectBox";
import Input from "../../ChildComponents/Input";
import { getAccessCentres } from "../util/Commonservices";
import Loading from "../util/Loading";
import { number } from "../util/Commonservices/number";

import { useTranslation } from "react-i18next";
const Data = [
  {
    label: "Share Type",
    value: 0,
  },
  {
    label: "Client Share",
    value: 2,
  },
  {
    label: "Lab share",
    value: 3,
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

  const { t } = useTranslation();
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
          data.unshift({ label: "All Designation", value: "" });
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
        console.log("val")
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

  const handleSelectChange = (event) => {
    const { name,value } = event.target;
    setPayload({ ...payload, [name]: value });
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
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h1 className="box-title">{t("Discount Approval Employee Wise")}</h1>
        </div>
        <div className="box-body">
          <div className="row">
          <label className="col-sm-1" htmlFor="center">
                {t("Designation")}:
              </label>
            <div className="col-sm-2">
              <SelectBox
                options={DepartmentOptions}
                name="DesignationID"
                selectedValue={payload?.DesignationID}
                className={"required"}
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="center">
                {t("Employee")}:
              </label>
            <div className="col-sm-2">
              <SelectBox
                options={[{ label: "Select...", value: "" }, ...Employee]}
                name="EmployeeID"
                selectedValue={payload?.EmployeeID}
                className={"required"}
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="center">
                {t("MaxDis/Month(inRs)")}:
              </label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                placeholder={t("Max Discount Per Month(in Rs.)")}
                type="number"
                onInput={(e) => number(e, 6)}
                name="DiscountMonth"
                onChange={(e) => {
                  setPayload({ ...payload, [e.target.name]: e.target.value });
                }}
                value={payload?.DiscountMonth}
              />
            </div>
            <label className="col-sm-1" htmlFor="center">
                {t("Share Type")}:
              </label>
            <div className="col-sm-2">
              <SelectBox
                options={Data}
                name="sharetype"
                selectedValue={payload?.sharetype}
                onChange={handleSelectChange}
                className="required"
              />
            </div>
            </div>
            <div className="row">
            <label className="col-sm-1" htmlFor="center">
                {t("Centre")}:
              </label>
            <div className="col-sm-2">
              <SelectBoxWithCheckbox
                name="ItemData"
                // className="required"
                options={Centre}
                value={payload?.ItemData}
                onChange={handleChanges}
              />
            </div>
            <label className="col-sm-1" htmlFor="center">
                {t("Disc.Bill(in%)")}:
              </label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                name="DiscountBill"
                placeholder={t("Disc.Bill(in%)")}
                onInput={(e) => number(e, 2)}
                type="number"
                value={payload?.DiscountBill}
                onChange={(e) => {
                  setPayload({ ...payload, [e.target.name]: e.target.value });
                }}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-1">
              {Load ? (
                <Loading />
              ) : (
                <button
                  type="button"
                  className="btn btn-block btn-success btn-sm"
                  id="btnSave"
                  disabled={disable}
                  onClick={PostApi}
                >
                  {t("Save")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {tableData.length > 0 && (
        <div className="box box-success">
          <div className="box-header with-border">
            <h1 className="box-title">{t("Search Result")}</h1>
          </div>
          <div className="box-body">
            <div className="row">
              <div className="col-sm-12">
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf">
                    <tr>
                      {[
                        t("S.No"),
                        t("Centre Code"),
                        t("Centre Name"),
                        t("Discounted RateType"),
                        t("Employee Name"),
                        t("Max Disc.(Amt.)"),
                        t("Max Disc.(%)"),
                        t("Remove"),
                      ].map((ele, index) => (
                        <th key={index}>{ele}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.map((ele, index) => (
                      <tr key={index}>
                        <td data-title={t("S.No")}>{index + 1}</td>
                        <td data-title={t("Centre Code")}>{ele?.CentreCode}</td>
                        <td data-title={t("Centre Name")}>{ele?.Centre}</td>
                        <td data-title={t("Discounted RateType")}>-</td>
                        <td data-title={t("Employee Name")}>{ele?.EmpName}</td>
                        <td data-title={t("Max Disc.(Amt.)")}>{ele?.DiscountPerMonth}</td>
                        <td data-title={t("Max Disc.(%)")}>{ele?.DiscountPerBill_per}</td>
                        <td data-title={t("Remove")}>
                          {DeleteLoad?.load && DeleteLoad?.index === index ? (
                            <Loading />
                          ) : (
                            <button
                              className="btn btn-danger"
                              onClick={() => HandleDelete(ele?.DisAppID, index)}
                            >
                              {t("Remove")}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default DiscountMasterEmployeeWise;
