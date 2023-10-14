import React, { useEffect } from "react";
import { useState } from "react";
import { Modal, Table } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { dateConfig } from "./DateConfig";
import Loading from "./Loading";
import { useTranslation } from "react-i18next";

function UploadModal({
  options,
  show,
  handleClose,
  documentId,
  pageName,
  handleUploadCount,
  getDocumentType,
}) {
  const [state, setState] = useState({
    DocumentName: "",
    DocumentID: "",
  });
  const [load, setLoad] = useState(false);
  const [tableData, setTableData] = useState([]);

  // language change
  // i18n start
 
  const { t } = useTranslation();

  // i18n end
  //end

  const handleChange = (e) => {
    const { name, value } = e.target;
    const data = options.find((ele) => ele.value == value);
    setState({
      ...state,
      [name]: data?.value,
      DocumentName: data?.label,
    });
  };

  const getDocumentFiletype = (data) => {
    let TypeDocument = [];
    data.map((ele) => {
      return TypeDocument.push(ele?.DocumentName);
    });
    getDocumentType(TypeDocument);
  };

  const Fetch = () => {
    axios
      .post("/api/v1/CommonController/GetDocument", {
        Page: pageName,
        Guid: documentId,
      })
      .then((res) => {
        setTableData(res?.data?.message);
        if (["Patient Registration"].includes(pageName)) {
          handleUploadCount(
            "UploadDocumentCount",
            res?.data?.message?.length,
            "IsDocumentUploaded"
          );
          if (
            ["/EditPatientDetails", "/patientregister"].includes(
              window.location.pathname
            )
          ) {
            getDocumentFiletype(res?.data?.message);
          }
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : t("Something Went Wrong")
        );
      });
  };

  const DeleteImage = (id) => {
    axios
      .post("/api/v1/CommonController/InActiveDocument", {
        Hash_Id: id,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        Fetch();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : t("Something Went Wrong")
        );
      });
  };

  const handleUpload = async (e) => {
    const names = ["EmployeMaster", "CentreMaster", "RateTypeMaster"];
    if (names.includes(pageName) && tableData.length > 0) {
      toast.error(t("Please Remove Image to Upload New Image"));
    } else {
      setLoad(true);
      e.preventDefault();
      let formData = new FormData();
      formData.append("file", document.getElementById("file").files[0]);
      formData.append("DocumentID", state?.DocumentID);
      formData.append("Page", pageName);
      formData.append("DocumentName", state?.DocumentName);
      formData.append("Guid", documentId);
      formData.append("FileName", "");

      await axios
        .post("/api/v1/CommonController/UploadDocument", formData)
        .then((res) => {
          toast.success(res?.data?.message);
          Fetch();
          setLoad(false);
        })
        .catch((err) => {
          setLoad(false);
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : t("Something Went Wrong")
          );
        });
    }
    document.getElementById("file").value = "";
  };

  const getS3url = (id) => {
    axios
      .post("/api/v1/CommonController/GetFileUrl", {
        Key: id,
      })
      .then((res) => {
        const url = res?.data?.message;
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "image.png"); //or any other extension
        document.body.appendChild(link);
        link.click();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : t("Something went Wrong")
        );
      });
  };

  useEffect(() => {
    Fetch();
  }, []);

  return (
    <Modal show={show} onHide={handleClose} size="md">
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">{t("Upload Image")}</Modal.Title>
        <button type="button" className="close" onClick={handleClose}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="box_Container" id="DocModalData">
          <div className="box-header with-border box_header">
            {["Patient Registration"].includes(pageName) && (
              <h1 className="box-title">{t("Document Type")}</h1>
            )}
          </div>

          <div className="box-body">
            <div className="row">
              <div className="col-sm-12">
                {options && (
                  <div>
                   
                    <select
                      className="select-input-box form-control input-sm"
                      name="DocumentID"
                      onChange={handleChange}
                      value={state?.DocumentID}
                    >
                      <option hidden>{t("Select")}</option>
                      {options.map((ele, index) => (
                        <option value={ele.value} id={ele?.label} key={index}>
                          {ele?.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <label>
                  {t("Select File")}...
                  <span className="text-warning">
                    ( {t("jpg,jpeg,png and gif are allowed")})
                  </span>
                </label>
                <input
                  type="file"
                  id="file"
                  accept={
                    pageName === "CompanyMaster"
                      ? "image/png; image/jpeg"
                      : "image/*"
                  }
                />
              </div>
            </div>
            <div
              className={`box-body divResult table-responsive  ${
                tableData.length > 8 ? "boottable" : ""
              }`}
            >
              {tableData.length > 0 && (
                <table
                  className="table table-bordered table-hover table-responsive table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf">
                    <tr>
                      <th></th>
                      <th>{t("S.No")}</th>
                      <th>{t("Type")}</th>
                      <th>{t("DocType")}</th>
                      <th>{t("Uploaded By")}</th>
                      <th>{t("Date")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.map((ele, index) => (
                      <tr key={index}>
                        <td>
                          <button
                            onClick={() => DeleteImage(ele?.ID_Hash)}
                            className="btn btn-danger btn-xs"
                          >
                            X
                          </button>
                        </td>
                        <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                        <td data-title={t("Type")}>
                          {ele?.DocumentName}&nbsp;
                        </td>
                        <td
                          data-title={t("DocType")}
                          onClick={() => getS3url(ele?.awsKey)}
                        >
                          <p
                            style={{
                              color: "blue",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            {ele?.FileName}
                          </p>
                          &nbsp;
                        </td>
                        <td data-title={t("Uploaded By")}>
                          {ele?.CreatedByName}&nbsp;
                        </td>
                        <td data-title={t("Date")}>
                          {dateConfig(ele?.dtEntry)}&nbsp;
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
        <div className="box-footer">
          <div className="row">
            <div className="col-sm-2">
              {load ? (
                <Loading />
              ) : (
                <button
                  type="button"
                  className="btn btn-block btn-success btn-sm"
                  id="btnSave"
                  onClick={handleUpload}
                >
                  {t("Upload")}
                </button>
              )}
            </div>
            <div className="col-sm-2">
              <button
                type="button"
                className="btn btn-block btn-danger btn-sm"
                id="btnSave"
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
}

export default UploadModal;
