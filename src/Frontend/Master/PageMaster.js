import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import { SelectBox } from "../../ChildComponents/SelectBox";
import Input from "../../ChildComponents/Input";
import Loading from "../util/Loading";
import { useTranslation } from "react-i18next";
import { PageMasterValidation } from "../../ValidationSchema";

const PageMaster = () => {
  const [menudata, setMenuData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [load, setLoad] = useState(false);
  const [savedata, setSaveData] = useState([]);
  const [errors, setErrors] = useState({});
  const [payload, setPayload] = useState({
    PageName: "",
    Url: "",
    Priority: "",
    isActive: 1,
    MenuID: "",
  });
    const { t, i18n } = useTranslation();

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value, ItemValue: "" });
    setErrors({});
  };

  //   const handleSelectChange = (event, rest) => {
  //     const { name } = rest;
  //     setPayload({ ...payload, [name]: event.value ,ItemValue: ""});
  //   };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const fetchMenuApi = () => {
    axios
      .get("/api/v1/Menu/SelectAllMenu")
      .then((res) => {
        console.log(res);
        const data = res?.data?.message;
        const menuapi = data.map((ele) => {
          return {
            label: ele?.MenuName,
            value: ele?.ID,
          };
        });
        menuapi.unshift({ label: "Select", value: "" });
        setMenuData(menuapi);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong."
        );
      });
  };

  const fetchPageMaster = () => {
    axios
      .get("/api/v1/Menu/SelectAllPage")
      .then((res) => {
        console.log(res);
        const data = res?.data?.message;
        setSaveData(data);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const editIDMaster = (id) => {
    setUpdate(true);
    axios
      .post("/api/v1/Menu/SelectAllPageByPageID", {
        PageID: id,
      })
      .then((res) => {
        console.log(res);
        const data = res.data.message[0];
        setPayload(data);
      })
      .catch((err) => console.log(err));
  };

  const handleSave = (url, btnName) => {
    let generatedError = PageMasterValidation(payload);
    if (generatedError === "") {
      setLoad(true);
      axios
        .post(url, payload)
        .then((res) => {
          toast.success(res.data?.message);
          setLoad(false);
          fetchPageMaster();
          if (btnName === "Update") {
            setUpdate(false);
          }
          setPayload({
            PageName: "",
            Url: "",
            Priority: "",
            isActive: 1,
            MenuID: "",
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
      setErrors(generatedError);
      setLoad(false);
    }
  };

  useEffect(() => {
    fetchPageMaster();
    fetchMenuApi();
  }, []);
  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h1 className="box-title">{t("Page Master")}</h1>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("Menu")}</label>
            <div className="col-sm-2">
              <SelectBox
                className="input-sm"
                name="MenuID"
                onChange={handleSelectChange}
                options={menudata}
                selectedValue={payload?.MenuID}
              />
              <div className="golbal-Error">{errors?.MenuID}</div>
            </div>
            <label className="col-sm-1">{t("Page Name")}:</label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                style={{ borderBottom: "1px solid #d62020" }}
                placeholder={t("Page Name")}
                type="text"
                name="PageName"
                max={50}
                value={payload?.PageName}
                onChange={handleChange}
              />
              <div className="golbal-Error">{errors?.PageName}</div>
            </div>
            <label className="col-sm-1">{t("URL")}:</label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                style={{ borderBottom: "1px solid #d62020" }}
                placeholder={t("URL")}
                type="text"
                name="Url"
                value={payload?.Url}
                onChange={handleChange}
              />
              <div className="golbal-Error">{errors?.Url}</div>
            </div>
            <label className="col-sm-1">{t("Priority")}:</label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                style={{ borderBottom: "1px solid #d62020" }}
                placeholder={t("Priority")}
                type="text"
                name="Priority"
                max={50}
                value={payload?.Priority}
                onChange={handleChange}
              />
               <div className="golbal-Error">{errors?.Priority}</div>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-1">
              <Input
                name="isActive"
                type="checkbox"
                checked={payload?.isActive}
                onChange={handleChange}
              />
              <label className="control-label">{t("Active")}</label>
            </div>
            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : update ? (
                <button
                  type="button"
                  className="btn btn-block btn-warning btn-sm"
                  id="btnSave"
                  title="Update"
                  onClick={() =>
                    handleSave("/api/v1/Menu/UpdatePageMaster", "Update")
                  }
                >
                  {t("Update")}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-block btn-success btn-sm"
                  id="btnSave"
                  title="Update"
                  onClick={() =>
                    handleSave("/api/v1/Menu/SavePageMaster", "Save")
                  }
                >
                  {t("Save")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {load ? (
        <Loading />
      ) : (
        <div className="box mb-4">
          <div className="box-body  divResult boottable" id="no-more-tables">
            <table
              className="table table-bordered table-hover table-striped tbRecord"
              cellPadding="{0}"
              cellSpacing="{0}"
            >
              <thead className="cf">
                <tr>
                  <th>{t("S.No")}</th>
                  <th>{t("Menu Name")}</th>
                  <th>{t("Page Name")}</th>
                  <th>{t("URL")}</th>
                  <th>{t("Priority")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {savedata.map((ele, index) => (
                  <tr key={index}>
                    <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                    <td data-title={t("Code")}>{ele?.MenuName}&nbsp;</td>
                    <td data-title={t("Department")}>{ele?.PageName}&nbsp;</td>
                    <td data-title={t("Active")}>{ele?.Url}&nbsp;</td>
                    <td data-title={t("Entry Date")}>{ele?.Priority}&nbsp;</td>
                    <td>
                      <Link
                        className="text-primary"
                        style={{
                          cursor: "pointer",
                          textDecoration: "underline",
                        }}
                        onClick={() => {
                          editIDMaster(ele?.PageID);
                        }}
                      >
                       {t("Edit")} 
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default PageMaster;
