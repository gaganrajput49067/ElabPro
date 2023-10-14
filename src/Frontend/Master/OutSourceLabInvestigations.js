import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  getAccessCentres,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";
import { toast } from "react-toastify";

import { useTranslation } from "react-i18next";
const OutSourceLabInvestigations = () => {
  const [data, setData] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payLoad, setPayload] = useState({
    CentreID: "",
    DepartmentID: "",
  });
  const { t} = useTranslation();

  const getDepartment = () => {
    axios
      .get("/api/v1/Department/getDepartment")
      .then((res) => {
        let data = res.data.message;
        let Department = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        setDepartment(Department);
      })
      .catch((err) => console.log(err));
  };

  const searchOutSourceLabInvestigations = () => {
    setLoading(true);
    axios
      .post("/api/v1/OutSourceLabMaster/searchalloutsourcedata", payLoad)
      .then((res) => {
        setData(res?.data?.message);
        if (res?.data?.message?.length === 0) {
          toast.error("No Data Found");
        }
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );

        setLoading(false);
      });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    // setFormData({ ...formData, [name]: value, ItemValue: "" });
    setPayload({ ...payLoad, [name]: value });
    // setErrors({});
  };

  useEffect(() => {
    getDepartment();
    getAccessCentres(setCentreData);
  }, []);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("OutSource Lab Investigations")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("Centre")}:</label>
            <div className="col-sm-2">
              <SelectBox
                name="CentreID"
                options={CentreData}
                selectedValue={payLoad?.CentreID}
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-1">{t("DepartmentList")}:</label>
            <div className="col-sm-2">
              <SelectBox
                name="DepartmentID"
                options={Department}
                selectedValue={payLoad?.DepartmentID}
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-sm-1">
              <button
                type="submit"
                className="btn btn-block btn-success btn-sm"
                onClick={searchOutSourceLabInvestigations}
              >
                {t("Search")}
              </button>
            </div>
          </div>
          {/* Row end */}
        </div>
        {/* box-body-end */}
        <div className="box-body">
          {loading ? (
            <Loading />
          ) : (
            <div
              className="box-body divResult table-responsive mt-4"
              id="no-more-tables"
            >
              {data.length > 0 && (
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf">
                    <tr>
                      <th>{t("S.No")}</th>
                      <th>{t("Department")}</th>
                      <th>{t("Investigation")}</th>
                      <th>{t("Default Outsource Lab")}</th>
                      <th>{t("Outsource Lab")}</th>
                      <th>{t("OutSource Rate")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((data, i) => (
                      <tr key={i}>
                        <td data-title={t("S.No")}>{i + 1} &nbsp;</td>
                        <td data-title={t("Department")}>
                          {data?.Department} &nbsp;
                        </td>
                        <td data-title={t("Investigation")}>{data?.InvestigationName} &nbsp;</td>
                        <td data-title={t("Default Outsource Lab")}>
                          <select className="form-control ui-autocomplete-input input-sm"></select>
                        </td>
                        <td data-title={t("Outsource Lab")}>
                          <select className="form-control ui-autocomplete-input input-sm">
                            {}
                          </select>
                        </td>
                        <td data-title={t("Outsource Rate")}>
                          <Input
                            type="text"
                            className="form-control ui-autocomplete-input input-sm"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {/* <div className="col-sm-12 text-center">
                    <button className="btn btn-info w-100">Save</button>
                  </div> */}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default OutSourceLabInvestigations;
