import React, { useEffect } from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";
import Input from "../../ChildComponents/Input";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../../Frontend/util/Loading";
import { number } from "../../Frontend/util/Commonservices/number";
import { MicroBioMaster } from "../../ChildComponents/Constants";
import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";
const MicroBiologyMaster = () => {
  const [TableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    Name: "",
    TypeID: "",
    TypeName: "",
    Code: "",
    IsActive: "0",
  });
  const { t } = useTranslation();

  console.log("payload", payload);
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const handleTestSearch = (id) => {
    setLoading(true);
    axios
      .post("/api/v1/MicroMaster/getmasterdata", {
        TypeID: id,
      })
      .then((res) => {
        setTableData(res?.data?.message);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong."
        );
        setLoading(false);
      });
  };

  const handleSelect = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    setPayload({ ...payload, [name]: value, TypeName: label });
    handleTestSearch(value);
  };

  const handleEdit = (data) => {
    setPayload({
      Name: data?.Name,
      TypeID: data?.typeid,
      TypeName: data?.typename,
      Code: data?.Code,
      IsActive: data?.isactive,
      ID: data?.id,
    });
    window.scrollTo(0, 0);
  };

  const handleSave = (url) => {
    setLoading(true);
    axios
      .post(url, payload)
      .then((res) => {
        toast.success(res?.data?.message);
        setLoading(false);
        setPayload({
          Name: "",
          TypeID: "",
          IsActive: "0",
          TypeName: "",
          Code: "",
        });
        setTableData([]);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoading(false);
      });
  };

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Master Entry")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
          <label className="col-sm-1">{t("Organism")}:</label>
            <div className="col-sm-2">
              <SelectBox
                options={MicroBioMaster}
                name="TypeID"
                onChange={handleSelect}
                selectedValue={
                  payload?.TypeID
                }
              />
            </div>
            <label className="col-sm-1">{t("Name")}:</label>
            <div className="col-sm-2">
              <Input
                className="select-input-box form-control input-sm"
                type="text"
                placeholder={t("Name")}
                name="Name"
                value={payload?.Name}
                onChange={handleChange}
              />
            </div>

            {/* <div className="col-sm-2">
                <label className="control-label" htmlFor="Gender">
                  Machine Parameter Code
                </label>
                :
                <Input
                  className="form-control"
                  type="number"
                  onInput={(e) => number(e, 10)}
                  name="MachineParameterCode"
                  value={payload?.MachineParameterCode}
                  onChange={handleChange}
                />
              </div> */}
              <label className="col-sm-1">{t("Code")}:</label>
            <div className="col-sm-2">
              {/* <label className="control-label" htmlFor="Gender">
                  Code
                </label> */}

              <Input
                className="select-input-box form-control input-sm"
                type="text"
                placeholder={t("Code")}
                onInput={(e) => number(e, 10)}
                name="Code"
                value={payload?.Code}
                onChange={handleChange}
              />
            </div>

            <div className="col-sm-1">
              <Input
                type="checkbox"
                name="IsActive"
                checked={payload?.IsActive == "1" ? true : false}
                onChange={(e) => handleChange(e)}
              />
              <label className="control-label">{t("Active")}</label>
            </div>

            <div className="col-sm-1">
              {loading ? (
                <Loading />
              ) : payload?.ID ? (
                <div
                  className="btn btn-success btn-sm btn-block"
                  onClick={() =>
                    handleSave("/api/v1/MicroMaster/updatemasterdata", "Update")
                  }
                >
                  {t("Update")}
                </div>
              ) : (
                <div
                  className="btn btn-success btn-sm btn-block"
                  onClick={() =>
                    handleSave("/api/v1/MicroMaster/savemasterdata", "Save")
                  }
                >
                  {t("Save")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {TableData?.length > 0 && (
        <div className="box">
          <div className="box-body">
            <div className="box-header with-border">
              <h3 className="box-title">{t("Master Detail")}</h3>
            </div>
            <div className="box-body divResult table-responsive boottable" id="no-more-tables">
              <table
                className="table table-bordered table-hover table-striped tbRecord"
                cellPadding="{0}"
                cellSpacing="{0}"
              >
                <thead className="cf">
                  <tr>
                    {[
                      t("S.No"),
                      t("Code"),
                      t("Name"),
                      t("Machine Param Code"),
                      t("Method"),
                      t("Type"),
                      t("Status"),
                      t("InsertBy"),
                      t("InsertDate"),
                      t("LastUpdateBy"),
                      t("LastUpdateDate"),
                      t("Edit"),
                      t("Tag"),
                    ].map((ele, index) => (
                      <th key={index}>{ele}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TableData.map((item, index) => (
                    <tr key={index}>
                      <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                      <td data-title={t("Code")}>{item?.Code}&nbsp;</td>
                      <td data-title={t("Name")}>{item?.Name}&nbsp;</td>
                      <td data-title={t("Machine Param Code")}>{item?.Code}&nbsp;</td>
                      <td data-title={t("Method")}>
                        {item?.isactive === 1 ? "Active" : "InActive"}&nbsp;
                      </td>
                      <td data-title={t("Type")}>{item?.typename}&nbsp;</td>
                      <td data-title={t("Status")}>{item?.STATUS}&nbsp;</td>
                      <td data-title={t("InsertBy")}>{item?.CreatedByName}&nbsp;</td>
                      <td data-title={t("InsertDate")}>{item?.entrydate}&nbsp;</td>
                      <td data-title={t("LastUpdateBy")}>{item?.UpdatedByname}&nbsp;</td>
                      <td data-title={t("LastUpdateDate")}>{item?.updatedate}&nbsp;</td>
                      <td data-title={t("Edit")}>
                        <div
                          className="text-primary"
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          onClick={() => handleEdit(item)}
                        >
                          {t("Edit")}
                        </div>
                      </td>
                      <td data-title={t("Tag")}>
                        <Link
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                          to={`/MicroBiologyMasterMapping`}
                          state={{
                            id: item?.id,
                            Code: item?.Code,
                            Name: item?.Name,
                            typeid: item?.typeid,
                          }}
                        >
                          {t("Tag")}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MicroBiologyMaster;
