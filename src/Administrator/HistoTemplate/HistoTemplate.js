import React, { useState } from "react";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { SimpleCheckbox } from "../../ChildComponents/CheckBox";
import TextEditor from "../../Master/Report/TextEditor";
import Loading from "../../Frontend/util/Loading";
import { useLocation } from "react-router-dom";
import { Table } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import { Temptype } from "../../ChildComponents/Constants";
import { selectedValueCheck } from "../../Frontend/util/Commonservices";
import { useEffect } from "react";

const HistoTemplate = () => {
  const location = useLocation();
  const { state } = location;
  const [Editor, setEditor] = useState("");
  const [Editable, setEditable] = useState(false);
  const [load, setLoad] = useState(false);
  const [tableLoad, setTableLoad] = useState(false);
  const [deleteLoad, setDeleteLoad] = useState(-1);

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

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setPayload({ ...payload, [name]: event.value });
  };

  useEffect(() => {
    setPayload({ ...payload, HeaderText: Editor });
  }, [Editor]);

  const postData = () => {
    setLoad(true);
    axios
      .post("/api/v1/Histo/SaveHistoTemplate", payload)
      .then((res) => {
        setEditable(true);
        toast.success(res?.data?.message);
        setPayload({
          HeaderText: "",
          Template_Name: "",
          TempType: "",
          isActive: 1,
        });

        setLoad(false);
      })
      .catch((err) => {
        toast.error(err?.data?.message ? err?.data?.message : "Error Occured");
        setLoad(false);
      });
  };

  const EditGetData = (id) => {
    axios
      .post("/api/v1/Histo/GetHistoTemplateSelect", { TemplateID: id })
      .then((res) => {
        const data = res?.data?.message[0];
        setPayload({
          Template_ID: data?.Template_ID,
          Template_Name: data?.Template_Name,
          IsActive: data?.IsActive,
          Gross: null,
          MicroScopic: null,
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
      <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
        <div className="container-fluid">
          <div className="card shadow mb-4 mt-4">
            <div className="card-header py-3">
              <div className="clearfix">
                <h6 className="m-0 font-weight-bold text-primary float-left">
                  Template Master
                </h6>
              </div>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-sm-2 form-group">
                  <label className="label-control" htmlFor="center">
                    Template Name:
                  </label>
                  <Input
                    type="text"
                    className="form-control"
                    name="Template_Name"
                    value={payload?.Template_Name}
                    max={50}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-sm-2 form-group">
                  <label className="label-control" htmlFor="center">
                    Template Type:
                  </label>
                  <SelectBox
                    options={Temptype}
                    onChange={handleSelectChange}
                    name="TempType"
                    selectedValue={selectedValueCheck(
                      Temptype,
                      payload?.TempType
                    )}
                  />
                </div>

                <div className="col-sm-2 form-group">
                  <Input
                    type="checkbox"
                    checked={payload?.isActive === 1 ? true : false}
                    onChange={handleChange}
                  />
                  <label className="labels mt-5">Active</label>
                </div>
              </div>
            </div>

            <div className="form-group mt-2">
              <label className="control-label col-md-12">Template Text</label>
              <div className="col-md-12 mb-2">
                <TextEditor
                  value={payload?.HeaderText}
                  setValue={setEditor}
                  EditTable={Editable}
                  setEditTable={setEditable}
                />
              </div>
            </div>
            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button className="margin btn btn-success" onClick={postData}>
                  {state?.other?.button ? state?.other?.button : "Save"}
                </button>
              )}
            </div>
          </div>

          <div className="card shadow mt-4">
            <div className="card-header py-3">
              <div className="clearfix">
                <h6 className="m-0 font-weight-bold text-primary float-left">
                  Template List
                </h6>
              </div>
            </div>
            <div className="card shadow">
              <div className="card-body">
                <div className="col-sm-2 form-group">
                  <label className="label-control">Search:</label>
                  <Input
                    value={payload?.TemplateName}
                    className={"form-control"}
                    onChange={handleChange}
                    type="text"
                    name={"TemplateName"}
                  />
                </div>
                <div className="col-sm-2 form-group mt-1">
                  {tableLoad ? (
                    <Loading />
                  ) : (
                    <button
                      className="btn btn-info mt-4"
                      onClick={getTableData}
                    >
                      Search
                    </button>
                  )}
                </div>
              </div>

              {tableData?.length > 0 && (
                <div className={`card-body`}>
                  <div className="row">
                    <div
                      className={`col-12 ${
                        tableData?.length > 8 && "boottable"
                      }`}
                    >
                      <Table responsive hover bordered>
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Template Name</th>
                            <th>Active</th>
                            <th>Edit</th>
                            <th>Delete</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableData?.map((ele, index) => (
                            <tr>
                              <td>{index + 1}</td>
                              <td>{ele?.Template_Name}</td>
                              <td>
                                {ele?.IsActive === 1 ? "active" : "de-active"}
                              </td>
                              <td>
                                <div
                                  className="text-primary"
                                  style={{
                                    cursor: "pointer",
                                    textDecoration: "underline",
                                  }}
                                  onClick={() => EditGetData(ele?.Template_ID)}
                                >
                                  Edit
                                </div>
                              </td>
                              <td>
                                {deleteLoad === ele?.Template_ID ? (
                                  <Loading />
                                ) : (
                                  <button
                                    className="btn btn-danger"
                                    onClick={() =>
                                      DeleteGetData(ele?.Template_ID)
                                    }
                                  >
                                    Delete
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HistoTemplate;
