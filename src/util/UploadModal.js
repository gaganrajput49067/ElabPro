import React, { useEffect } from "react";
import { useState } from "react";
import { Modal, Table } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { dateConfig } from "./DateConfig";
import Loading from "./Loading";

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
          getDocumentFiletype(res?.data?.message);
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
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
            : "Something Went Wrong"
        );
      });
  };

  const handleUpload = async (e) => {
    const names = ["EmployeMaster", "CentreMaster", "RateTypeMaster"];
    if (names.includes(pageName) && tableData.length > 0) {
      toast.error("Please Remove Image to Upload New Image");
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
              : "Something Went Wrong"
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
        console.log(res);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went Wrong"
        );
      });
  };

  useEffect(() => {
    Fetch();
  }, []);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">Upload Image</Modal.Title>
        <button type="button" className="close" onClick={handleClose}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-body" id="DocModalData">
          {options && (
            <div>
              <label>Document Type</label>
              <select
                className="form-control"
                name="DocumentID"
                onChange={handleChange}
                value={state?.DocumentID}
              >
                <option hidden>select</option>
                {options.map((ele, index) => (
                  <option value={ele.value} id={ele?.label} key={index}>
                    {ele?.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="mt-4">
            <label>
              Select File...
              <span className="text-warning">
                (jpg,jpeg,png and gif are allowed)
              </span>
            </label>
            <input type="file" id="file" />
          </div>

          <div className="mt-4">
            {tableData.length > 0 && (
              <div className="p-2 bg-light">
                <Table responsive hover bordered>
                  <thead>
                    <tr>
                      <th></th>
                      <th>S.no</th>
                      <th>Type</th>
                      <th>DocType</th>
                      <th>Uploaded By</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.map((ele, index) => (
                      <tr key={index}>
                        <td>
                          <button
                            onClick={() => DeleteImage(ele?.ID_Hash)}
                            className="btn btn-danger"
                          >
                            X
                          </button>
                        </td>
                        <td>{index + 1}</td>
                        <td>{ele?.DocumentName}</td>
                        <td onClick={() => getS3url(ele?.awsKey)}>
                          <p
                            style={{
                              color: "blue",
                              textDecoration: "underline",
                              cursor: "pointer",
                            }}
                          >
                            {ele?.FileName}
                          </p>
                        </td>
                        <td>{ele?.CreatedByName}</td>
                        <td>{dateConfig(ele?.dtEntry)}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        {load ? (
          <Loading />
        ) : (
          <button className="btn btn-success" onClick={handleUpload}>
            Upload
          </button>
        )}
        <button className="btn btn-danger" onClick={handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default UploadModal;
