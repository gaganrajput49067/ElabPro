import React, { useState } from "react";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { SimpleCheckbox } from "../../ChildComponents/CheckBox";
// import TextEditor from "../../Master/Report/TextEditor";
import TextEditor from "../Master/Report/TextEditor";
import { useTranslation } from "react-i18next";



import Loading from "../../Frontend/util/Loading";
import { useLocation } from "react-router-dom";
import { Table } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { Temptype } from "../../ChildComponents/Constants";
import { selectedValueCheck } from "../../Frontend/util/Commonservices";
import { useEffect } from "react";
import { HistoValidation } from "../../ValidationSchema";

const HistoTemplate = () => {
  const location = useLocation();
  const { state } = location;
  const [Editor, setEditor] = useState("");
  const [Editable, setEditable] = useState(false);
  const [load, setLoad] = useState(false);
  const [tableLoad, setTableLoad] = useState(false);
  const [deleteLoad, setDeleteLoad] = useState(-1);
  const [err,setErr]=useState({})
  
    const { t } = useTranslation();
 
  const [payload, setPayload] = useState({
    HeaderText: "",
    Template_Name: "",
    TempType: "",
    TemplateName: "",
    isActive: 1,
  });
  const [tableData, setTableData] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value, ItemValue: "" });
  };

  useEffect(() => {
    setPayload({ ...payload, HeaderText: Editor });
  }, [Editor]);

  const postData = (url) => {
    let generatedError = HistoValidation(payload);
    if (generatedError === "") {
    setLoad(true);
    axios
      .post(url, payload)
      .then((res) => {
        setEditable(true);
        toast.success(res?.data?.message);
        setPayload({
          HeaderText: "",
          Template_Name: "",
          TempType: "",
          TemplateName: "",
          isActive: 1,
        });
        getTableData();
        setLoad(false);
      })
      .catch((err) => {
        toast.error( err?.response?.data?.message
          ? err?.response?.data?.message : "Error Occured.");
        setLoad(false);
      });
    } else {
      setErr(generatedError);
      setLoad(false);
    }
  };

  const EditGetData = (id) => {
    axios
      .post("/api/v1/Histo/GetHistoTemplateSelect", { TemplateID: id })
      .then((res) => {
        const data = res?.data?.message[0];
        setPayload({
          TemplateId: data?.Template_ID,
          Template_Name: data?.Template_Name,
          isActive: data?.IsActive,
          TempType: data?.fieldtype,
          TemplateName: payload?.TemplateName,
          HeaderText: data?.Impression,
        });
        window.scrollTo(0, 0);

        setEditable(true);
      })
      .catch((err) => {
        toast.error(err?.data?.message ? err?.data?.message : "Error Occured");
      });
  };

  const DeleteGetData = (id) => {
    setDeleteLoad(id);
    axios
      .post("/api/v1/Histo/HistoTemplateActiveDeactive", {
        Active: 0,
        TemplateID: id,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        getTableData();
        setDeleteLoad(-1);
      })
      .catch((err) => {
        toast.error(err?.data?.message ? err?.data?.message : "Error Occured");
        setDeleteLoad(-1);
      });
  };

  const getTableData = () => {
    setTableLoad(true);
    axios
      .post("/api/v1/Histo/GetHistoTemplate", {
        TemplateName: payload?.TemplateName,
      })
      .then((res) => {
        setTableData(res?.data?.message);
        setTableLoad(false);
      })
      .catch((err) => {
        toast.error(err?.data?.message ? err?.data?.message : "Error Occured");
        setTableLoad(false);
      });
  };

  useEffect(() => {
    getTableData();
  }, []);
  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h3 className="box-title">{t("HistoTemplate")}</h3>
        </div>

        <div className="box-body">
          <div className="row">
            <label className="col-sm-2">
              <small>Template Name:</small>
            </label>
            <div className="col-sm-2">
              <Input
                type="text"
                placeholder={t("Template_Name")}
                className="form-control ui-autocomplete-input input-sm"
                name="Template_Name"
                value={payload?.Template_Name}
                max={50}
                onChange={handleChange}
              />
               <div
                className="field-validation-valid text-danger"
                data-valmsg-for="Template_Name"
                data-valmsg-replace="true"
              >
                {err?.Template_Name}
              </div>
            </div>
            <label className="col-sm-2">
              <small>Template Type:</small>
            </label>
            <div className="col-sm-2">
              <SelectBox
                options={Temptype}
                onChange={handleSelectChange}
                name="TempType"
                selectedValue={payload?.TempType}
              />
            </div>

            <div className="col-sm-1">
              <Input
                type="checkbox"
                name="isActive"
                checked={payload?.isActive === 1 ? true : false}
                onChange={handleChange}
              />
              <label className="labels mt-5">{t("Active")}</label>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12">
              <TextEditor
                value={payload?.HeaderText}
                setValue={setEditor}
                EditTable={Editable}
                setEditTable={setEditable}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : payload?.TemplateId ? (
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={() => postData("/api/v1/Histo/UpdateHistoTemplate")}
                >
                 {t("Update")} 
                </button>
              ) : (
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={() => postData("/api/v1/Histo/SaveHistoTemplate")}
                >
                  {t("save")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="box box-success">
        <div className="box-header with-border">
        <h3 className="box-title">{t("Template_List")}</h3>
        </div>

        <div className="box-body">
          <div className="row">
          <label className="col-sm-1"><small>Search:</small></label>
            <div className="col-sm-2">
              <Input
                value={payload?.TemplateName}
                placeholder={t("TemplateName")}
                className={"form-control ui-autocomplete-input input-sm"}
                onChange={handleChange}
                type="text"
                name={"TemplateName"}
              />
            </div>
            <div className="col-sm-1">
              {tableLoad ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-block btn-info btn-sm"
                  onClick={getTableData}
                >
                 {t("Search")}
                </button>
              )}
            </div>
          </div>

          <div
            className=" box-body divResult table-responsive mt-4"
            id="no-more-tables"
          >
            {tableData?.length > 0 && (
              <div className={`box-body`}>
                <div className="row">
                  <div
                    className={`col-12 ${tableData?.length > 8 && "boottable"}`}
                  >
                    <table
                      className="table table-bordered table-hover table-striped tbRecord"
                      cellPadding="{0}"
                      cellSpacing="{0}"
                    >
                      <thead>
                        <tr>
                          <th>{t("ID")}</th>
                          <th>{t("Template Name")}</th>
                          <th>{t("Active")}</th>
                          <th>{t("Edit")}</th>
                          <th>{t("Delete")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData?.map((ele, index) => (
                          <tr key={index}>
                            <td data-title={"ID"}>{index + 1}</td>
                            <td data-title={t("Template Name")}>
                              {ele?.Template_Name}
                            </td>
                            <td data-title={"Active"}>
                              {ele?.IsActive === 1 ? t("active") : t("De-active")}
                            </td>
                            <td data-title={"Edit"}>
                              <div
                                className="text-primary"
                                style={{
                                  cursor: "pointer",
                                  textDecoration: "underline",
                                }}
                                onClick={() => EditGetData(ele?.Template_ID)}
                              >
                               {t("Edit")} 
                              </div>
                            </td>
                            <td data-title={"Delete"}>
                              {deleteLoad === ele?.Template_ID ? (
                                <Loading />
                              ) : (
                                <button
                                  // className="btn btn-danger"
                                  className="btn btn-block btn-danger btn-sm"
                                  onClick={() =>
                                    DeleteGetData(ele?.Template_ID)
                                  }
                                >
                                 {t("Delete")}
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
            )}
          </div>
        </div>
      </div>
    </>
  );
};
export default HistoTemplate;
