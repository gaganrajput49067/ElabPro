import React from "react";
import { Table } from "react-bootstrap";
import { useState } from "react";
import axios from "axios";
import Loading from "../../Frontend/util/Loading";
import { Link } from "react-router-dom";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { DataType } from "../../ChildComponents/Constants";
import Input from "../../ChildComponents/Input";
import { toast } from "react-toastify";
// import { selectedValueCheck } from "../../Frontend/util/Commonservices";

const InvestigationsList = () => {
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    DataType: "",
    TestName: "",
    TestCode: "",
  });
  const [data, setData] = useState([]);

  const handleSelect = (e) => {
    const { name } = e.target;
    setPayload({ ...payload, [name]: e.value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleActiveSingle = (e, i, arr) => {
    checkboxEdit(arr?.InvestigationID, arr.isActive === 1 ? 0 : 1);
  };

  const getInvestigationsList = () => {
    setLoading(true);
    axios
      .post("/api/v1/Investigations/GetInvestigations", payload)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };
  // console.log(payload?.DataType);

  const checkboxEdit = (InvestigationId, isActive) => {
    axios
      .post("/api/v1/Investigations/UpdateActiveInActive", {
        InvestigationId: InvestigationId,
        isActive: isActive,
      })
      .then((res) => {
        if (res.data.message) {
          toast.success("Updated Successfully");
          getInvestigationsList();
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        getInvestigationsList();
      });
  };
  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h3 className="box-title">InvestigationsList</h3>
          <Link
            className="list_item"
            to="/Investigations"
            state={{
              url: "/api/v1/Investigations/CreateInvestigation",
            }}
          >
            Create New
          </Link>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-sm-2">
              <SelectBox
                name="DataType"
                options={DataType}
                selectedValue={payload?.DataType}
                onChange={handleSelect}
              />
            </div>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                name="TestName"
                placeholder={"TestName"}
                type="text"
                value={payload?.TestName}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                name="TestCode"
                type="text"
                value={payload?.TestCode}
                onChange={handleChange}
                placeholder={"TestCode"}
              />
            </div>
            <div className="col-sm-1">
              <button
                type="submit"
                className="btn btn-block btn-warning btn-sm"
                onClick={getInvestigationsList}
              >
                Search
              </button>
            </div>
          </div>         
        </div>
        {/*box-body end */}
        <div className="box-body">
        {loading ? (
                <Loading />
              ) : (
                <div className="box-body divResult table-responsive mt-4"  id="no-more-tables">
                  {data.length > 0 && (
                    <table  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}">
                      <thead  className="cf">
                        <tr>
                          <th>S.No</th>
                          <th>Data Type</th>
                          <th>Test Name</th>
                          <th>Test Code</th>
                          <th>Active / InActive</th>
                          <th>Edit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((data, i) => (
                          <tr key={i}>
                            <td data-title={"S.No"}>{i + 1}</td>
                            <td data-title={"Data Type"}>{data?.DataType}</td>
                            <td data-title={"Test Name"}>{data?.TestName}</td>
                            <td data-title={"Test Code"}>{data?.TestCode}</td>
                            <td data-title={"Active / InActive"}>
                              <Input
                                type="checkbox"
                                name="isActive"
                                checked={data?.isActive}
                                onChange={(e) => handleActiveSingle(e, i, data)}
                              />
                            </td>
                            <td data-title={"S.No"}>
                              <Link
                                to="/Investigations"
                                state={{
                                  other: {
                                    button: "Update",
                                    pageName: "Edit",
                                    showButton: true,
                                  },
                                  url1: `/api/v1/Investigations/EditInvestigation?id=${data?.InvestigationID}&DataType=${data?.DataType}`,
                                  url: "/api/v1/Investigations/UpdateInvestigation",
                                }}
                              >
                                Edit
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
        </div>

      </div>
    </>
  );
};
export default InvestigationsList;
