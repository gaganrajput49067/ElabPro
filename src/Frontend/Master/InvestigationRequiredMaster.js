import React, { useEffect } from "react";
import { useState } from "react";
import { InputFields } from "../../ChildComponents/Constants";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { selectedValueCheck } from "../../Frontend/util/Commonservices";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../Frontend/util/Loading";
import { useTranslation } from "react-i18next";
import { InvestigationRequiredMastervalidation } from "../../ValidationSchema";
function InvestigationRequiredMaster() {
  const [TableData, setTableData] = useState([]);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(true);
  const [update, setUpdate] = useState(false);
  const [err, setErr] = useState({});
  const [payload, setPayload] = useState({
    FieldName: "",
    InputType: "",
    IsRequired: 0,
    IsUnit: 0,
    Unit: "",
    isActive: 0,
    DropDownOption: "",
    initialChar: "",
  });
  const { t } = useTranslation();

  const fetchRequiredField = () => {
    axios
      .get("/api/v1/InvestigationRequiredMaster/getRequiredMaster")
      .then((res) => {
        const data = res?.data?.message;
        setTableData(data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.reponse?.data?.message
            ? err?.reponse?.data?.message
            : "Error Occured"
        );
      });
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  const editIDMaster = (id) => {
    setUpdate(true);
    axios
      .post("/api/v1/InvestigationRequiredMaster/getRequiredMasterByID", {
        ID: id,
      })
      .then((res) => {
        const data = res.data.message[0];
        setPayload(data);
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleSave = (url, btnName) => {
    let generatedError = InvestigationRequiredMastervalidation(payload);
    if (generatedError === "") {
      if (payload.FieldName !== "") {
        setLoad(true);
        axios
          .post(url, payload)
          .then((res) => {
            toast.success(res.data?.message);
            setLoad(false);
            fetchRequiredField();
            if (btnName === "Update") {
              setUpdate(false);
            }
            setPayload({
              FieldName: "",
              InputType: "",
              IsRequired: 0,
              IsUnit: 0,
              Unit: "",
              isActive: 0,
              DropDownOption: "",
            });
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Error Occured"
            );
            setLoad(false);
          });
      } else {
        toast.error("Please enter value");
      }
    } else {
      setErr(generatedError);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequiredField();
  }, []);
  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h6 className="box-title">{t("Investigation Required Master")}</h6>
        </div>

        <div className="box-body">
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Required Field")}:
            </label>
            <div className="col-sm-2">
              <Input
                placeholder={t("Required Field")}
                type="text"
                className="form-control ui-autocomplete-input input-sm"
                name="FieldName"
                max={50}
                value={payload?.FieldName}
                onChange={handleChange}
              />
            </div>

            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Input Type")}:
            </label>
            <div className="col-sm-2">
              <SelectBox
                options={InputFields}
                selectedValue={payload?.InputType}
                name="InputType"
                onChange={handleSelectChange}
              />
              <div className="golbal-Error">{err?.InputType}</div>
            </div>

            <div className="col-sm-1">
              <Input
                type="checkbox"
                checked={payload?.IsRequired}
                name="IsRequired"
                onChange={handleChange}
              />
              <label htmlFor="IsRequired" className="control-label">
                {t("Required")}
              </label>
            </div>

            <div className="col-sm-1 ">
              <Input
                type="checkbox"
                checked={payload?.IsUnit}
                name="IsUnit"
                onChange={handleChange}
              />
              <label htmlFor="IsUnit" className="control-label">
                {t("IsUnit")}
              </label>
            </div>
            {payload?.IsUnit === 1 && (
              <div className="col-sm-1 ">
                <Input
                  placeholder={t("Unit")}
                  type="text"
                  className="form-control ui-autocomplete-input input-sm"
                  max={10}
                  value={payload?.Unit}
                  name="Unit"
                  onChange={handleChange}
                />
              </div>
            )}
            <div className="col-sm-1 ">
              <Input
                type="checkbox"
                checked={payload?.isActive}
                name="isActive"
                onChange={handleChange}
              />
              <label className="control-label">{t("isActive")}</label>
            </div>

            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : update ? (
                <div
                  className="btn btn-block btn-success btn-sm"
                  onClick={() =>
                    handleSave(
                      "/api/v1/InvestigationRequiredMaster/UpdateInvestigationRequiredMaster",
                      "Update"
                    )
                  }
                >
                  {t("Update")}
                </div>
              ) : (
                <div
                  className="btn btn-block btn-success btn-sm"
                  onClick={() =>
                    handleSave(
                      "/api/v1/InvestigationRequiredMaster/SaveInvestigationRequiredMaster",
                      "Save"
                    )
                  }
                >
                  {t("Save")}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="box">
        <div className={`card-body ${TableData.length > 8 ? "boottable" : ""}`}>
          {loading ? (
            <Loading />
          ) : (
            <div
              className=" box-body divResult table-responsive boottable"
              id="no-more-tables"
            >
              {TableData.length > 0 ? (
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf">
                    <tr>
                      <th>{t("S.No")}</th>
                      <th>{t("Required Field")}</th>
                      <th>{t("IsRequired")}</th>
                      <th>{t("IsUnit")}</th>
                      <th>{t("Unit")}</th>
                      <th>{t("DropDown Option")}</th>
                      <th>{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TableData?.map((ele, index) => (
                      <tr key={index}>
                        <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                        <td data-title={t("Required Field")}>
                          {ele?.FieldName}&nbsp;
                        </td>
                        <td data-title={t("IsRequired")}>
                          <input type="checkbox" checked={ele?.IsRequired} />
                        </td>
                        <td data-title={t("IsUnit")}>
                          <input type="checkbox" checked={ele?.IsUnit} />
                        </td>
                        <td data-title={t("Unit")}>{ele?.Unit}&nbsp;</td>
                        <td data-title={t("DropDown Option")}>
                          {ele?.DropDownOption}&nbsp;
                        </td>
                        <td data-title={t("Action")}>
                          <div
                            className="text-primary"
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                            onClick={() => {
                              window.scroll(0, 0);
                              editIDMaster(ele?.ID);
                            }}
                          >
                            {t("Edit")}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                "No Data Found"
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default InvestigationRequiredMaster;
