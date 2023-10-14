import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import {
  Active,
  ActiveTemplateID,
  DDLData,
  Dynamic,
  DynamicReportType,
  FontFamily,
  LableID,
  PageOrientation,
  PageSize,
  ReportType,
  TemplateName,
  TypePlaceHolder,
} from "../../ChildComponents/Constants";
import Input from "../../ChildComponents/Input";
import { number } from "../../Frontend/util/Commonservices/number";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { getBase64, isChecked } from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";
import SeeImage from "../../Frontend/util/SeeImage";
import SeeText from "../../Frontend/util/SeeText";
// import TextEditor from "./TextEditor";

import UploadModal from "../../Frontend/util/UploadModal";
import TextEditor from "./Report/TextEditor";
import { useTranslation } from "react-i18next";
function ReportBill() {
  const [headerSetupData, setHeaderSetupData] = useState(LableID);
  const [Editor, setEditor] = useState("");
  const [Editable, setEditable] = useState(false);
  const [index, setIndex] = useState("");
  const [load, setLoad] = useState(false);
  const [ModalValue, SetModalValue] = useState({
    text: "",
    image: "",
  });
  const [DynamicField, setDynamicField] = useState(Dynamic);
  const [DynamicReport, setDynamicReport] = useState([]);
  const [show, setShow] = useState(false);
  const [documentId, setDocumentID] = useState("");
  const [showImage, setShowImage] = useState(false);
  const [id, setId] = useState("");
  const [PageSetup, setPageSetup] = useState({
    ActiveTemplateID: "",
    FooterHeight: "",
    HeaderHeight: "",
    MarginBottom: "",
    MarginLeft: "",
    MarginRight: "",
    MarginTop: "",
    PageOrientation: "",
    PageSize: "",
    ReportName: ReportType[1]?.value,
    ReportType: ReportType[1]?.value,
    ReportTypeId: "",
    TemplateID: TemplateName[0]?.value,
    TemplateName: TemplateName[0]?.label,
  });

  const handleShow = () => {
    setShow(false);
  };

  // const handleCharacterCount = (headerSetupData) => {
  //   let count = 0;
  //   for (let i = 0; headerSetupData.length > i; i++) {
  //     if (
  //       headerSetupData[i]["LabelDetail"].length > count &&
  //       headerSetupData[i]["Print"] == 1
  //     ) {
  //       count = headerSetupData[i]["LabelDetail"].length;
  //     }
  //   }
  //   return count;
  // };

  // const countCharacter = (length, count) => {
  //   return count - length;
  // };

  // const handleSpaceCount = (headerSetupData) => {
  //   const val = [...headerSetupData];
  //   for (let i = 0; headerSetupData.length > i; i++) {
  //     if (headerSetupData[i]["Print"] == 1) {
  //       const spaceLength = countCharacter(
  //         headerSetupData[i]["LabelDetail"].length,
  //         handleCharacterCount(headerSetupData)
  //       );
  //       let data = headerSetupData[i]["LabelDetail"];
  //       for (let i = 0; spaceLength > i; i++) {
  //         data = data + " ";
  //       }
  //       val[i]["LabelDetail"] = data;
  //     }
  //   }

  //   return val
  // };

  const handleShowImage = () => {
    setShowImage(false);
  };
  const { t } = useTranslation();

  const handleSelectChange = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    switch (name) {
      case "ReportType":
        setPageSetup({
          ...PageSetup,
          [name]: label,
          ReportName: label,
        });
        break;
      case "TemplateName":
        setPageSetup({
          ...PageSetup,
          [name]: label,
          TemplateID: value,
        });
        break;
      default:
        setPageSetup({ ...PageSetup, [name]: value });
        break;
    }
  };

  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };

  const guidNumber = () => {
    const guidNumber =
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4();

    setDocumentID(guidNumber);
  };

  useEffect(() => {
    if (PageSetup?.ReportType === "Lab Report") {
      setPageSetup({ ...PageSetup, ReportTypeId: "2" });
    } else if (PageSetup?.ReportType === "Bill") {
      setPageSetup({ ...PageSetup, ReportTypeId: "1" });
    } else if (PageSetup?.ReportType === "TRF") {
      setPageSetup({ ...PageSetup, ReportTypeId: "3" });
    }
  }, [PageSetup?.ReportType]);

  const handleSelectDynamic = (event) => {
    const { name, value } = event.target;
    setDynamicField({
      ...DynamicField,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    setLoad(true);
    axios
      .post("/api/v1/ReportMaster/UpdateReportSetting", {
        id: id,
        PageSetup: PageSetup,
        headerSetup: headerSetupData,
        DynamicReportData: DynamicReport,
      })
      .then((res) => {
        setLoad(false);
        toast.success(res.data.message);
      })
      .catch((err) => {
        setLoad(false);
        console.log(err);
        toast.error(err.response.data.message);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPageSetup({ ...PageSetup, [name]: value });
  };

  const handleHeader = (e, index) => {
    const { name, value, checked } = e.target;
    if (index >= 0) {
      const data = [...headerSetupData];
      data[index][name] = value ? value : checked ? 1 : 0;
      setHeaderSetupData(data);
    } else {
      const val = headerSetupData.map((ele) => {
        return {
          ...ele,
          [name]: value ? value : checked ? 1 : 0,
        };
      });
      setHeaderSetupData(val);
    }
  };

  const handleChangeDynamic = (e) => {
    const { name, value } = e.target;
    setDynamicField({ ...DynamicField, [name]: value });
  };

  useEffect(() => {
    setDynamicField({ ...DynamicField, Text: Editor });
  }, [Editor]);

  const validationData = (fields) => {
    let valid = true;
    for (let i = 0; i < fields.length; i++) {
      if (["ImageData", "Text"].includes(fields[i])) {
      } else if (DynamicField[fields[i]] === "") {
        console.log(DynamicField[fields[i]]);
        valid = false;
        break;
      }
    }
    return valid;
  };

  const handleAdd = (index) => {
    const data = Object.keys(DynamicField);
    const valid = validationData(data);
    if (valid) {
      if (index < 0 || index === "") {
        setDynamicReport([...DynamicReport, DynamicField]);
        setDynamicField(Dynamic);
        setEditable(true);
        setEditor("");
      } else {
        const data = [...DynamicReport];
        data[index] = DynamicField;
        setDynamicReport(data);
        setEditable(true);
        setDynamicField(Dynamic);
        setEditor("");
        setIndex("");
      }
    } else {
      toast.error("Please All Required Fields");
    }
  };

  const handleEdit = (data, index) => {
    setDynamicField({ ...data, IsActive: "1" });
    setIndex(index);
    window.scrollTo(0, 0);
  };

  const handleDelete = (index) => {
    const data = DynamicReport.filter((ele, ind) => ind !== index);
    setDynamicReport(data);
    toast.success("Successfully Deleted");
  };

  const fetch = () => {
    axios
      .post("/api/v1/ReportMaster/GetReportSettingData", {
        ReportTypeId: PageSetup?.ReportTypeId,
        TemplateID: PageSetup?.TemplateID,
      })
      .then((res) => {
        const data = JSON.parse(res.data.message[0].ReportConfiguration);
        console.log(res.data.message[0].ReportConfiguration);
        setDynamicReport(data?.DynamicReportData);
        setHeaderSetupData(data?.headerSetup);
        setPageSetup({
          ...data?.PageSetup,
          ReportType: data?.PageSetup?.ReportName,
        });
       // setId(data?.id);
       setId(res.data.message[0]?.id);
      })
      .catch((err) => console.log("hello", err));
  };

  const handleText = (data) => {
    setShow(true);
    SetModalValue({ ...ModalValue, text: data });
  };

  const handleUploadImage = (e) => {
    const { files, name } = e.target;
    getBase64(files[0])
      .then((res) => {
        setDynamicField({ ...DynamicField, [name]: res.trim() });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleImage = (data) => {
    setShowImage(true);
    SetModalValue({ ...ModalValue, image: data });
  };

  const handlePreviewURL = (id) => {
    return id == 1
      ? "/reports/v1/getReceiptDemo"
      : "/reports/v1/commonReports/GetLabReportDemo";
  };

  const handlePreview = () => {
    console.log(handlePreviewURL(PageSetup?.ReportTypeId));
    axios
      .post(handlePreviewURL(PageSetup?.ReportTypeId), {
        ReportTypeId: PageSetup?.ReportTypeId,
        TemplateID: PageSetup?.TemplateID,
      })

      .then((res) => {
        window.open(res?.data?.Url, "_blank");
      })

      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetch();
  }, [PageSetup?.ReportTypeId, PageSetup?.TemplateID]);

  useEffect(() => {
    guidNumber();
  }, []);
  return (
    <>
      {ModalValue?.text && show && (
        <SeeText show={show} handleShow={handleShow} data={ModalValue?.text} />
      )}
      {ModalValue?.image && showImage && (
        <SeeImage
          show={showImage}
          handleShow={handleShowImage}
          data={ModalValue?.image}
        />
      )}
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Report Type Template Master")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("ReportType")}:
            </label>
            <div className="col-sm-2 ">
              <SelectBox
                options={ReportType}
                name="ReportType"
                onChange={handleSelectChange}
                selectedValue={PageSetup?.ReportType}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Template")}:
            </label>
            <div className="col-sm-2">
              <SelectBox
                name="TemplateName"
                options={TemplateName}
                onChange={handleSelectChange}
                selectedValue={PageSetup?.TemplateID}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("ActiveTemplateID")}:
            </label>
            <div className="col-sm-2">
              <SelectBox
                options={ActiveTemplateID}
                name="ActiveTemplateID"
                selectedValue={PageSetup?.ActiveTemplateID}
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Report Name")}:
            </label>
            <div className="col-sm-2">
              <Input
                name="TypeName"
                className="select-input-box form-control input-sm"
                value={PageSetup?.ReportName}
                readOnly
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("PageSize")}:
            </label>
            <div className="col-sm-2">
              <SelectBox
                name="PageSize"
                options={PageSize}
                selectedValue={PageSetup?.PageSize}
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("PageOrientation")}:
            </label>
            <div className="col-sm-2">
              <SelectBox
                name="PageOrientation"
                options={PageOrientation}
                selectedValue={PageSetup?.PageOrientation}
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("MarginLeft")}:
            </label>
            <div className="col-sm-2">
              <Input
                name="MarginLeft"
                className="select-input-box form-control input-sm"
                value={PageSetup?.MarginLeft}
                onChange={handleChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("MarginRight")}:
            </label>
            <div className="col-sm-2">
              <Input
                name="MarginRight"
                className="select-input-box form-control input-sm"
                value={PageSetup?.MarginRight}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("MarginTop")}:
            </label>
            <div className="col-sm-2">
              <Input
                name="MarginTop"
                className="select-input-box form-control input-sm"
                value={PageSetup?.MarginTop}
                onChange={handleChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("MarginBottom")}:
            </label>
            <div className="col-sm-2">
              <Input
                name="MarginBottom"
                className="select-input-box form-control input-sm"
                value={PageSetup?.MarginBottom}
                onChange={handleChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("HeaderHeight")}:
            </label>
            <div className="col-sm-2">
              <Input
                name="HeaderHeight"
                className="select-input-box form-control input-sm"
                value={PageSetup?.HeaderHeight}
                onChange={handleChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("FooterHeight")}:
            </label>
            <div className="col-sm-2">
              <Input
                name="FooterHeight"
                className="select-input-box form-control input-sm"
                value={PageSetup?.FooterHeight}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div
          className={`box-body table-responsive ${
            headerSetupData.length > 8 ? "boottable" : ""
          }`}
        >
          <table
            className="table table-bordered table-hover table-striped tbRecord"
            cellPadding="{0}"
            cellSpacing="{0}"
          >
            <thead className="cf">
              <tr>
                <th>{t("LabelID")}</th>
                <th>{t("LabelDetail")}</th>
                <th>{t("DetailXPosition")}</th>
                <th>{t("Top")}</th>
                <th>{t("Left")}</th>
                <th>
                  <Input
                    className="select-input-box form-control input-sm"
                    type="number"
                    name="FontSize"
                    onInput={(e) => number(e, 10)}
                    onChange={handleHeader}
                  />
                </th>
                <th>
                  <select
                    className="select-input-box form-control input-sm"
                    name="FontFamily"
                    onChange={handleHeader}
                  >
                    {FontFamily.map((item, ind) => (
                      <option value={item.value} key={ind}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                </th>
                <th>
                  <label>{t("Bold")}</label>
                  <Input
                    type="checkbox"
                    name="Bold"
                    checked={
                      isChecked("Bold", headerSetupData, 1).includes(false)
                        ? false
                        : true
                    }
                    onChange={handleHeader}
                  />
                </th>
                <th>
                  <label>{t("Italic")}</label>
                  <Input
                    type="checkbox"
                    name="Italic"
                    checked={
                      isChecked("Italic", headerSetupData, 1).includes(false)
                        ? false
                        : true
                    }
                    onChange={handleHeader}
                  />
                </th>
                <th>
                  <label>{t("UnderLine")}</label>
                  <Input
                    type="checkbox"
                    name="Underline"
                    checked={
                      isChecked("Underline", headerSetupData, 1).includes(false)
                        ? false
                        : true
                    }
                    onChange={handleHeader}
                  />
                </th>
                <th>
                  <label>{t("Print")}</label>
                  <Input
                    type="checkbox"
                    name="Print"
                    checked={
                      isChecked("Print", headerSetupData, 1).includes(false)
                        ? false
                        : true
                    }
                    onChange={handleHeader}
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              {headerSetupData.map((data, index) => (
                <tr key={index}>
                  <td data-title={t("LabelID")}>{data?.LabelID}</td>
                  <td data-title={t("LabelDetail")}>
                    <Input
                      value={data?.LabelDetail}
                      className="select-input-box form-control input-sm"
                      type="text"
                      name="LabelDetail"
                      onChange={(e) => handleHeader(e, index)}
                    />
                  </td>
                  <td data-title={t("DetailXPosition")}>
                    <Input
                      value={data?.DetailXPosition}
                      className="select-input-box form-control input-sm"
                      name="DetailXPosition"
                      text="number"
                      onChange={(e) => handleHeader(e, index)}
                    />
                  </td>
                  <td data-title={t("Top")}>
                    <Input
                      value={data?.Top}
                      name="Top"
                      type="number"
                      onChange={(e) => handleHeader(e, index)}
                      className="select-input-box form-control input-sm"
                    />
                  </td>
                  <td data-title={t("Number")}>
                    <Input
                      value={data?.Left}
                      name="Left"
                      type="number"
                      onChange={(e) => handleHeader(e, index)}
                      className="select-input-box form-control input-sm"
                    />
                  </td>
                  <td data-title={t("FontSize")}>
                    <Input
                      value={data?.FontSize}
                      name="FontSize"
                      type="number"
                      onChange={(e) => handleHeader(e, index)}
                      className="select-input-box form-control input-sm"
                    />
                  </td>
                  <td data-title={t("FontFamily")}>
                    <select
                      className="select-input-box form-control input-sm"
                      name="FontFamily"
                      onChange={(e) => handleHeader(e, index)}
                      value={data?.FontFamily}
                    >
                      {FontFamily.map((item, ind) => (
                        <option value={item.value} key={ind}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td data-title={t("Bold")}>
                    <Input
                      type="checkbox"
                      checked={data?.Bold === 1 ? true : false}
                      name="Bold"
                      onChange={(e) => handleHeader(e, index)}
                    />
                  </td>
                  <td data-title={t("Italic")}>
                    <Input
                      type="checkbox"
                      checked={data?.Italic === 1 ? true : false}
                      name="Italic"
                      onChange={(e) => handleHeader(e, index)}
                    />
                  </td>
                  <td data-title={t("Underline")}>
                    <Input
                      type="checkbox"
                      checked={data?.Underline === 1 ? true : false}
                      name="Underline"
                      onChange={(e) => handleHeader(e, index)}
                    />
                  </td>
                  <td data-title={t("Print")}>
                    <Input
                      type="checkbox"
                      checked={data?.Print === 1 ? true : false}
                      name="Print"
                      onChange={(e) => handleHeader(e, index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Dynamic Field")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("DynamicReportType")}:</label>
            <div className="col-sm-2">
              <SelectBox
                name="DynamicReportType"
                className="required"
                options={DynamicReportType}
                onChange={handleSelectDynamic}
                selectedValue={DynamicField?.DynamicReportType}
              />
            </div>

            <label className="col-sm-1">{t("TypePlaceHolder")}:</label>
            <div className="col-sm-2">
              <SelectBox
                name="TypePlaceHolder"
                options={TypePlaceHolder}
                className="required"
                onChange={handleSelectDynamic}
                selectedValue={DynamicField?.TypePlaceHolder}
              />
            </div>
            <label className="col-sm-1">{t("Data")}:</label>
            <div className="col-sm-2">
              <SelectBox
                name="Data"
                options={DDLData}
                className="required"
                onChange={handleSelectDynamic}
                selectedValue={DynamicField?.Data}
              />
            </div>
            <label className="col-sm-1">{t("PositionLeft")}:</label>
            <div className="col-sm-2">
              <Input
                name="PositionLeft"
                placeholder={t("PositionLeft")}
                className="select-input-box form-control input-sm"
                value={DynamicField?.PositionLeft}
                type="number"
                onChange={handleChangeDynamic}
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1">{t("PositionTop")}:</label>
            <div className="col-sm-2">
              <Input
                name="PositionTop"
                placeholder={t("PositionTop")}
                className="select-input-box form-control input-sm"
                value={DynamicField?.PositionTop}
                type="number"
                onChange={handleChangeDynamic}
              />
            </div>
            <label className="col-sm-1">{t("Width")}:</label>
            <div className="col-sm-2">
              <Input
                name="Width"
                placeholder={t("Width")}
                className="select-input-box form-control input-sm"
                value={DynamicField?.Width}
                type="number"
                onChange={handleChangeDynamic}
              />
            </div>
            <label className="col-sm-1">{t("Height")}:</label>
            <div className="col-sm-2">
              <Input
                name="Height"
                placeholder={t("Height")}
                className="select-input-box form-control input-sm"
                value={DynamicField?.Height}
                type="number"
                onChange={handleChangeDynamic}
              />
            </div>
            <label className="col-sm-1">{t("IsActive")}:</label>
            <div className="col-sm-2">
              <SelectBox
                name="IsActive"
                options={Active}
                onChange={handleSelectDynamic}
                selectedValue={DynamicField?.IsActive}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2">
              <Input
                type="file"
                name="ImageData"
                onChange={handleUploadImage}
              />
            </div>

            <div className="col-sm-2">
              <button
                className="btn btn-block btn-success btn-sm"
                type="button"
                onClick={() => handleImage(DynamicField?.ImageData)}
                disabled={
                  DynamicField?.ImageData.trim() !== "undefined" ? false : true
                }
              >
                {t("View Image")}
              </button>
            </div>

            <div className="col-sm-1">
              <button
                className="btn btn-block btn-warning btn-sm"
                onClick={() => {
                  handleAdd(index);
                }}
              >
                {index === "" || DynamicReport.length === 0
                  ? t("Add Fields")
                  : t("Update")}
              </button>
            </div>
          </div>
          <div className="row mar">
            <div className="col-sm-12">
              <TextEditor
                value={DynamicField?.Text}
                setValue={setEditor}
                EditTable={Editable}
                setEditTable={setEditable}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="box box-success">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Dynamic Field List")}</h3>
        </div>

        <div
          className={`box-body ${DynamicReport.length > 8 ? "boottable" : ""}`}
        >
          {DynamicReport.length > 0 && (
            <div className=" box-body divResult boottable" id="no-more-tables">
              <table
                className="table table-bordered table-hover table-striped tbRecord"
                cellPadding="{0}"
                cellSpacing="{0}"
              >
                <thead className="cf">
                  <tr>
                    <th>{t("Edit")}</th>
                    <th>{t("Remove")}</th>
                    <th>{t("DynamicReportType")}</th>
                    <th>{t("TypePlaceHolder")}</th>
                    <th>{t("Data")}</th>
                    <th>{t("PositionLeft")}</th>
                    <th>{t("PositionTop")}</th>
                    <th>{t("Width")}</th>
                    <th>{t("Height")}</th>
                    <th>{t("Action")}</th>
                    <th>{t("Text")}</th>
                    <th>{t("Image")}</th>
                  </tr>
                </thead>
                <tbody>
                  {DynamicReport.map((ele, index) => (
                    <tr key={index}>
                      <td data-title={t("Edit")}>
                        <button
                          className="btn btn-block btn-success btn-sm"
                          onClick={() => {
                            handleEdit(ele, index);
                            setEditable(true);
                          }}
                        >
                          {t("Edit")}
                        </button>
                      </td>
                      <td data-title={t("Remove")}>
                        <button
                          className="btn btn-block btn-danger btn-sm"
                          onClick={() => {
                            handleDelete(index);
                          }}
                        >
                          {t("Remove")}
                        </button>
                      </td>
                      <td data-title={t("DynamicReportType")}>
                        {ele?.DynamicReportType}&nbsp;
                      </td>
                      <td data-title={t("TypePlaceHolder")}>
                        {ele?.TypePlaceHolder}&nbsp;
                      </td>
                      <td data-title={t("Data")}>{ele?.Data}&nbsp;</td>
                      <td data-title={t("PositionLeft")}>
                        {ele?.PositionLeft}&nbsp;
                      </td>
                      <td data-title={t("PositionTop")}>
                        {ele?.PositionTop}&nbsp;
                      </td>
                      <td data-title={t("Width")}>{ele?.Width}&nbsp;</td>
                      <td data-title={t("Height")}>{ele?.Height}&nbsp;</td>
                      <td data-title={t("IsActive")}>{ele?.IsActive}&nbsp;</td>
                      <td data-title={t("See Text")}>
                        <button
                          className="btn btn-block btn-info btn-sm"
                          onClick={() => handleText(ele?.Text)}
                          disabled={ele?.Text ? false : true}
                        >
                          {t("See Text")}
                        </button>
                      </td>
                      <td data-title={t("See Image")}>
                        <button
                          className="btn btn-block btn-info btn-sm"
                          onClick={() => handleImage(ele?.ImageData)}
                          disabled={
                            ele?.ImageData.trim() !== "undefined" ? false : true
                          }
                        >
                          {t("See Image")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="box-footer">
          <div className="row">
            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={handleSubmit}
                >
                  {t("Update")}
                </button>
              )}
            </div>
            <div className="col-sm-2">
              <button
                className="btn btn-block btn-warning btn-sm"
                onClick={handlePreview}
              >
                {t("Lab Report Preview")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ReportBill;
