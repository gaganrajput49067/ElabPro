import React from "react";
import Input from "../ChildComponents/Input";
import { useState } from "react";
import axios from "axios";
import Loading from "../Frontend/util/Loading";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { CompanyMasterValidation } from "../ValidationSchema";
import { getTrimmedData } from "../Frontend/util/Commonservices";

const CompanyMasterList = () => {
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    CompanyId: "",
    CompanyCode: "",
    CompanyName: "",
    Country: "",
    State: "",
    City: "",
    Email: "",
    Phone: "",
    Address1: "",
    Address2: "",
    Address3: "",
    isPrefixRequired: 0,
    // IsPrefixInvestigation: false,
    SelectType: "",
    GraceDays: 0,
    Mobile1: "",
    Mobile2: "",
    BillingType: "",
  
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };
  const handleSearch = () => {
    setLoading(true);
    axios
      .post("/api/v1/CompanyMaster/GetCompanyMaster",  getTrimmedData({
        ...payload,
        BillingType: payload?.BillingType,
        Mobile1: payload?.Mobile1,
        Mobile2: payload?.Mobile2,
        SelectType: payload?.SelectType,
        CompanyId:payload?.CompanyId,
      }))
      .then((res) => {
        if (res.status === 200) {
          setFormData(res.data.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
        setLoading(false);
      });
    // } else {
    //   setErr(generatedError);
    //   setLoading(false);
    // }
  };
  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">Company Master</h3>
          <Link
            style={{ float: "right" }}
            to={"/CompanyMaster"}
            state={{
              url: "",
            }}
          >
            Create New
          </Link>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">Company Code:</label>
            <div className="col-sm-2 col-md-2">
              <Input
                className="select-input-box form-control input-sm"
                type="text"
                name="CompanyCode"
                value={payload?.CompanyCode}
                onChange={handleChange}
              />
            </div>
            <label className="col-sm-1">Company Name:</label>
            <div className="col-sm-2 col-md-2">
              <Input
                className="select-input-box form-control input-sm"
                type="text"
                name="CompanyName"
                value={payload?.CompanyName}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-2 col-md-1">
              <button
                type="submit"
                className="btn btn-block btn-info btn-sm"
                id="btnSearch"
                title="Search"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>

        <div
          className=" box-body divResult table-responsive"
          id="no-more-tables"
        >
          {loading ? (
            <Loading />
          ) : (
            <div className="row">
              <div className="col-sm-12">
                {formData.length > 0 && (
                  <table
                    className="table table-bordered table-hover table-striped tbRecord"
                    cellPadding="{0}"
                    cellSpacing="{0}"
                  >
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>CompanyCode</th>
                        <th>CompanyName</th>
                        <th>Email</th>
                        <th>State</th>
                        <th>City</th>
                        <th>Mobile1.</th>
                        <th>Type</th>
                        <th>BillingCategory</th>
                        <th>Efit</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.map((ele, index) => (
                        <tr key={index}>
                          <td data-title={"S.No"}>{index + 1}&nbsp;</td>
                          <td data-title={"CompanyCode"}>
                            {ele?.CompanyCode} &nbsp;
                          </td>
                          <td data-title={"CompanyName"}>
                            {ele?.CompanyName} &nbsp;
                          </td>
                          <td data-title={"Email"}>{ele?.Email} &nbsp;</td>
                          <td data-title={"State"}>{ele?.State} &nbsp;</td>
                          <td data-title={"City"}>{ele?.City} &nbsp;</td>
                          <td data-title={"Mobile1"}>{ele?.Mobile1} &nbsp;</td>
                          <td data-title={"BillingType"}>
                            {ele?.BillingType} &nbsp;
                          </td>
                          <td data-title={"FaxNo"}>{ele?.FaxNo} &nbsp;</td>
                          <td data-title={"Edit"}>
                            {/* <Link to="/CompanyMaster">Edit</Link> &nbsp; */}
                            <Link
                              state={{
                                data: ele?.CompanyID,
                                other: { button: "Update", pageName: "Edit" },
                                url: "/api/v1/CompanyMaster/EditCompanyMaster",
                              }}
                              to="/CompanyMaster"
                            >
                              Edit
                            </Link>
                            &nbsp;
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyMasterList;
