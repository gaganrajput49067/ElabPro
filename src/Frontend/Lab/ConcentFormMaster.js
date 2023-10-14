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
      <div className="box box-success">
        {show && (
          <UploadModal
            show={show}
            documentId={documentId}
            handleClose={() => setShow(false)}
            pageName="ConcentFormMaster"
          />
        )}

        <div className="box-header with-border">
          <h3 className="box-title">ConcentFormMaster</h3>
        </div>

        <div className="box-body">
          <div className="row">
            <div className="col-sm-2">
              {/* <label className="control-label" htmlFor="center">
                    Concent Form Name:
                  </label> */}
              <Input
                className="form-control ui-autocomplete-input input-sm"
                placeholder={"Concent Form Name"}
              />
            </div>
            <div className="col-sm-1">
              <button
                className="btn btn-block btn-info btn-sm"
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


        <div className="row">
            <div className="col-sm-4 col-md-4">
              <div className="card shadow">
                <div
                  className="box-header with-border"
                  style={{ backgroundColor: "#3399ff" }}
                >
                  <div className="box-header with-border">
                    <h6 className="box-title">
                      Show Fields
                    </h6>
                  </div>
                </div>
                <div className="box-body boottable">
                  <div className="row">
                    <div  className=" box-body divResult table-responsive mt-4"
              id="no-more-tables">
                      <table
                        className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                      >
                        <thead
                         className="cf"
                        >
                          <tr>
                            {["Fields","Left","Top","Font","Size","Bold","Print"].map((ele,index)=>(
                              <th key={index}>{ele}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {tableData1?.map((ele, index) => (
                            <tr key={index}>
                              <td data-title={"Fields"}
                                className="font-weight-bold"
                                style={{ color: "#000066" }}
                              >
                                {ele?.Fieldsname}
                              </td>
                              <td  data-title={"Left"}>
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
                              <td  data-title={"Top"}>
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
                              <td  data-title={"Font"}>
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

                              <td  data-title={"Size"}>
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
                              <td  data-title={"Bold"}>{<SimpleCheckbox type="checkbox" />}&nbsp;</td>
                              <td  data-title={"Print"}>{<SimpleCheckbox type="checkbox" />}&nbsp;</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-sm-4 col-md-4">
              <div className="card shadow">
                <div
                  className="box-header with-border"
                  style={{ backgroundColor: "#3399ff" }}
                >
                  <div className="box-header with-border">
                    <h6 className="box-title">
                      Preview
                    </h6>
                  </div>
                </div>
                <div className="box-body">
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
                  className="box-header with-border"
                  style={{ backgroundColor: "#3399ff" }}
                >
                  <div className="box-header with-border">
                    <h6 className="box-title">
                      Saved Data
                    </h6>
                  </div>
                </div>
                <div className="box-body">
                  <div className="row">
                    <div className=" box-body divResult table-responsive mt-4"
              id="no-more-tables">
                      <table   className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}">
                        <thead
                         className="cf"
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
                              <td data-title={"S.No"}>{index + 1}&nbsp;</td>
                              <td data-title={"FormName"}>{ele?.concentformname}&nbsp;</td>
                              <td data-title={"FileName"}>{ele?.Filename}&nbsp;</td>
                              <td data-title={"EntryDate"}>{ele?.endate}&nbsp;</td>
                              <td data-title={"Edit"}>
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
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>            
          </div>
          <div className="row">
            <div className="box-footer">
            <div className="col-sm-1">
            <button
                className="btn btn-block btn-success btn-sm"
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
