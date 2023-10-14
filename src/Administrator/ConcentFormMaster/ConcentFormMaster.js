import React from "react";
import Input from "../../ChildComponents/Input";
import { useState } from "react";
import UploadModal from "../../Frontend/util/UploadModal";
import { useEffect } from "react";
import { Table } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { SimpleCheckbox } from "../../ChildComponents/CheckBox";
import { useLocation } from "react-router-dom";

const ConcentFormMaster = () => {
  const [tableData, setTableData] = useState([]);
  const [tableData1, setTableData1] = useState([]);
  const [show, setShow] = useState(false);
  const [documentId, setDocumentID] = useState("");
  const [concentFormName, setConcentFormName] = useState([]);
  const [concentFileName, setConcentFileName] = useState([]);

  const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };

  const location = useLocation();
  const { state } = location;

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

  const getBindConcentForm = () => {
    axios
      .get("/api/v1/ConcentFormMaster/BindConcentForm")
      .then((res) => {
        setTableData1(res?.data?.message);
      })
      .catch((err) => console.log(err));
  };

  const GetConcentFormData = () => {
    axios
      .get("/api/v1/ConcentFormMaster/GetConcentFormData")
      .then((res) => {
        setTableData(res?.data?.message);
      })
      .catch((err) => console.log(err));
  };

  const handleUpdate = () => {
    axios
      .post("/api/v1/ConcentFormMaster/UpdateConcentForm")
      .then((res) => {
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.data?.response?.message
            ? err?.data?.response?.message
            : err?.data?.message
        );
      });
  };

  useEffect(() => {
    guidNumber();
    getBindConcentForm();
    GetConcentFormData();
  }, []);
  return (
    <>
      <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
        <div className="container-fluid">
          {show && (
            <UploadModal
              show={show}
              documentId={documentId}
              handleClose={() => setShow(false)}
              pageName="ConcentFormMaster"
            />
          )}
          <div className="card shadow mb-4 mt-4">
            <div className="card-header py-3">
              <div className="clearfix">
                <h6 className="m-0 font-weight-bold text-primary float-left">
                  Concent Form Master
                </h6>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-2 form-group">
                  <label className="control-label" htmlFor="center">
                    Concent Form Name:
                  </label>
                  <Input className="form-control" />
                </div>

                <div className="col-sm-2 form-group">
                  <label className="control-label" htmlFor="center">
                    Attach Files:
                  </label>
                  <div>
                    <button
                      className="btn btn-info"
                      type="button"
                      id="btnUplaod"
                      onClick={() => {
                        setShow(true);
                      }}
                    >
                      Upload File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-4 col-md-4">
              <div className="card shadow">
                <div
                  className="card-header py-3"
                  style={{ backgroundColor: "#3399ff" }}
                >
                  <div className="clearfix">
                    <h6 className="m-0 font-weight-bold text-white float-left">
                      Show Fields
                    </h6>
                  </div>
                </div>
                <div className="card-body boottable">
                  <div className="row">
                    <div className="col-12">
                      <Table
                        bordered
                        responsive
                        hover
                        style={{ borderColor: "#330099" }}
                      >
                        <thead
                          style={{ backgroundColor: "#006699", color: "white" }}
                        >
                          <tr>
                            <th>Fields</th>
                            <th>Left</th>
                            <th>Top</th>
                            <th>Font</th>
                            <th>Size</th>
                            <th>Bold</th>
                            <th>Print</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableData1?.map((ele, index) => (
                            <tr key={index}>
                              <td
                                className="font-weight-bold"
                                style={{ color: "#000066" }}
                              >
                                {ele?.Fieldsname}
                              </td>
                              <td>
                                {
                                  <input
                                    type="text"
                                    className="form-control"
                                    style={{
                                      width: "30px",
                                      borderRadius: "4px",
                                    }}
                                  ></input>
                                }
                              </td>
                              <td>
                                {
                                  <input
                                    type="text"
                                    className="form-control"
                                    style={{
                                      width: "30px",
                                      borderRadius: "4px",
                                    }}
                                  ></input>
                                }
                              </td>
                              <td>
                                {
                                  <select>
                                    <option value="Aharoni">Aharoni</option>
                                    <option value="Arial">Arial</option>
                                    <option value="fantasy">Fantasy</option>
                                    <option value="cursive">cursive</option>
                                    <option value="calibri">calibri</option>
                                    <option value="cambria">cambria</option>
                                  </select>
                                }
                              </td>

                              <td>
                                {
                                  <select>
                                    <option value="8">8</option>
                                    <option value="9">9</option>
                                    <option value="10">10</option>
                                    <option value="10">11</option>
                                    <option value="10">12</option>
                                    <option value="10">13</option>
                                    <option value="10">14</option>
                                  </select>
                                }
                              </td>
                              <td>{<SimpleCheckbox type="checkbox" />}</td>
                              <td>{<SimpleCheckbox type="checkbox" />}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-4 col-md-4">
              <div className="card shadow">
                <div
                  className="card-header py-3"
                  style={{ backgroundColor: "#3399ff" }}
                >
                  <div className="clearfix">
                    <h6 className="m-0 font-weight-bold text-white float-left">
                      Preview
                    </h6>
                  </div>
                </div>
                <div className="card-body boottable">
                  <div className="row">
                    <div className="col">
                      <img
                        src="https://media.licdn.com/dms/image/C4D0BAQF1MtmFhF4hGw/company-logo_200_200/0/1601399988984?e=2147483647&v=beta&t=6h-nmQi7REGuxl5VR6_xyGw1VW5E_AHGmOWLAlVWhao"
                        style={{
                          width: "100%",
                          height: "400px",
                          border: "1px",
                        }}
                      ></img>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-sm-4 col-md-4">
              <div className="card shadow">
                <div
                  className="card-header py-3"
                  style={{ backgroundColor: "#3399ff" }}
                >
                  <div className="clearfix">
                    <h6 className="m-0 font-weight-bold text-white float-left">
                      Saved Data
                    </h6>
                  </div>
                </div>
                <div className="card-body boottable">
                  <div className="row">
                    <div className="col">
                      <Table responsive hover bordered>
                        <thead
                          style={{
                            backgroundColor: "#990000",
                            color: "#FFFFCC",
                          }}
                        >
                          <tr>
                            <th>S.No</th>
                            <th>FormName</th>
                            <th>FileName</th>
                            <th>EntryDate</th>
                            <th>Edit</th>
                          </tr>
                        </thead>
                        <tbody style={{ color: "#330099" }}>
                          {tableData?.map((ele, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{ele?.concentformname}</td>
                              <td>{ele?.Filename}</td>
                              <td>{ele?.endate}</td>
                              <td>
                                {
                                  <div
                                    className="text-primary"
                                    style={{
                                      cursor: "pointer",
                                      textDecoration: "underline",
                                    }}
                                    // onClick={() => {
                                    //   editIDMaster(ele?.PageID);
                                    // }}
                                  >
                                    Select
                                  </div>
                                }
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card-footer py-5">
            <div className="col-sm-2 form-group mb-2">
              <button
                className="btn btn-success"
                style={{ marginTop: "-10px" }}
                onClick={handleUpdate}
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConcentFormMaster;
