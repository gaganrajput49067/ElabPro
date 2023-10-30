import React from "react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import ExportFile from "../Master/ExportFile";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { searchTempPhelboValidationSchema } from "../../ChildComponents/validations";

import { SelectBox } from "../../ChildComponents/SelectBox";
import TempPhelboApprovalDetailModal from "./tempphelboApprovalDetailModal";
import TempPhelboApprovalEditModal from "./tempPhelboApprovalEditModal";
import Input from "../../ChildComponents/Input";

const TemporaryPhelboAproval = () => {
  const [loading, setLoading] = useState(false); // This state is used for setting loading screen
  const [errors, setErros] = useState({}); // This state is used for setting errors
  const [location, setLocation] = useState({
    state: [],
    city: [],
  });
  const [phleboTable, setPhleboTable] = useState(null); // This state is used for setting phelbos table after fetching api

  const [searchData, setSearchData] = useState({
    NoofRecord: 50,
    SearchState: "",
    SearchCity: "",
    searchvalue: "",
    Status: "",
  });
  const [phelboApprovalDetailModal, setPhelboApprovalDetailModal] = useState({
    show: false,
    data: "",
    fullData: null,
  });
  const [tempPhelboApprovalEditModal, settempPhelboApprovalEditModal] =
    useState({
      show: false,
      data: "",
      fullData: null,
    });

  // for trnslation
  const { t } = useTranslation();

  // fetching state based on zone wher default zone id is 0
  const fetchStates = () => {
    axios
      .post("api/v1/CommonHC/GetStateData", {
        BusinessZoneID: 0,
      })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ele.ID,
            label: ele.State,
            id: ele.ID,
          };
        });
        setLocation({ ...location, state: value });
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  // fetching cities based on state
  const fetchCities = (id) => {
    const postdata = {
      StateId: id,
    };
    axios
      .post("api/v1/CommonHC/GetCityData", postdata)
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: handleSplitData(ele.ID),
            label: ele.City,
          };
        });
        setLocation({ ...location, city: value });
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //used for spliting cityid because cityid comes in diffrent formate
  const handleSplitData = (id) => {
    const data = id.split("#")[0];
    return data;
  };

  // fething buisnesszone on first render
  useEffect(() => {
    fetchStates();
  }, []);

  // Options used for fetching no of records in phelbo table
  const recordoptions = [
    { label: "50", value: 50 },
    { label: "100", value: 100 },
    { label: "200", value: 200 },
    { label: "500", value: 500 },
    { label: "1000", value: 1000 },
    { label: "2000", value: 2000 },
  ];

  // dynamically managing selected option in state and getting data
  const handleSelectChange = async (event) => {
    const { name, value, checked, type } = event?.target;

    if (name === "SearchState" || name === "SearchCity") {
      if (name === "SearchState") {
        if (value.trim() == "") {
          setLocation({ ...location, city: [], phelbo: [] });
          setSearchData({ ...searchData, [name]: value, city: null });
        } else {
          setSearchData({ ...searchData, [name]: value, city: null });
          fetchCities(value);
        }
      }
      if (name === "SearchCity") {
        setSearchData({ ...searchData, [name]: value, Phlebotomist: "" });
      }
    } else {
      setSearchData({
        ...searchData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
    if (name === "NoofRecord") {
      setSearchData({
        ...searchData,
        NoofRecord: Number(value),
      });
    }
    if (name === "searchvalue") {
      setSearchData({
        ...searchData,
        searchvalue: value,
      });
    }
  };

  // This function is used for serching phelbo for approval using search data
  const searchTempPhelbo = (status) => {
    const i = status.toString();
    const generatedError = searchTempPhelboValidationSchema(searchData);
    if (generatedError === "") {
      setLoading(true);
      axios
        .post("api/v1/TemporaryPheleboApproval/GetData1", {
          SearchState: searchData.SearchState,
          SearchCity: searchData.SearchCity,
          searchvalue: searchData.searchvalue,
          NoofRecord: searchData.NoofRecord,
          Status: i.toString(),
        })
        .then((res) => {
          if (typeof res.data.message === "object") {
            setLoading(false);
            toast.success("Found Details");
            setPhleboTable(res.data.message);
          } else {
            setPhleboTable(null);
            toast.success("No Details Found");
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          toast.error(err?.res?.data ? err?.res?.data : "No Details Found");
        });
      setLoading(false);
    }
    setLoading(false);
    setErros(generatedError);
  };

  // this function is used for setting table strips with diffrent colors based on status
  const getstatus = (status) => {
    let colour = "";
    if (status == "1") {
      colour = "lightgreen";
    } else if (status == "2") {
      colour = "papayawhip";
    } else if (status == "0") {
      colour = "lightblue";
    }
    return colour;
  };

  const hancleReject = (id) => {
    if (window.confirm("Are you sure you want to Reject?")) {
      axios
        .post("api/v1/TemporaryPheleboApproval/RejectPhelebotomist", {
          Temp_PhlebotomistID: id.toString(),
        })
        .then((res) => {
          if (res.data.message) {
            console.log("object");
            setLoading(false);
            searchTempPhelbo();
            toast.success("Rejected Successfully");
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          toast.error(err?.res?.data ? err?.res?.data : "Something went wrong");
        });
    }
  };

  //console.log(phleboTable)
  return (
    <>
      {phelboApprovalDetailModal.show && (
        <TempPhelboApprovalDetailModal
          show={phelboApprovalDetailModal.show}
          id={phelboApprovalDetailModal.data}
          datas={phelboApprovalDetailModal.fullData}
          handleClose={() => {
            setPhelboApprovalDetailModal({
              ...phelboApprovalDetailModal,
              show: false,
            });
          }}
        />
      )}
      {tempPhelboApprovalEditModal.show && (
        <TempPhelboApprovalEditModal
          show={tempPhelboApprovalEditModal.show}
          id={tempPhelboApprovalEditModal.data}
          datas={tempPhelboApprovalEditModal.fullData}
          handleClose={() => {
            settempPhelboApprovalEditModal({
              ...tempPhelboApprovalEditModal,
              show: false,
            });
          }}
        />
      )}
      <div className="box box-success ">
        <div className="box-header with-border">
          <h3 className="box-title">Temporary Phelebo Approval </h3>
        </div>
        <div className="box-body form-horizontal">
          <div className="row">
            <div
              className="col-sm-2 "
              style={{ display: "flex", padding: "0" }}
            >
              <label
                className="col-sm-1"
                style={{ width: "60%" }}
                htmlFor="No Of Records"
              >
                {t("No Of Records")}:
              </label>
              <div style={{ width: "40%" }}>
                <SelectBox
                  options={recordoptions}
                  name="NoofRecord"
                  selectedValue={searchData?.NoofRecord}
                  onChange={handleSelectChange}
                />
              </div>
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("State")}:
            </label>
            <div className="col-sm-2">
              <SelectBox
                className="form-control input-sm"
                name="SearchState"
                onChange={handleSelectChange}
                selectedValue={searchData?.SearchState}
                options={[
                  { label: "Select State", value: "" },
                  ...location.state,
                ]}
              />
              {searchData?.SearchState === "" && (
                <span className="golbal-Error">{errors?.SearchState}</span>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("City")}:
            </label>
            <div className="col-sm-2">
              <SelectBox
                name="SearchCity"
                className="select-input-box form-control input-sm"
                onChange={handleSelectChange}
                selectedValue={searchData?.SearchCity}
                options={[
                  { label: "Select City", value: "" },
                  ...location.city,
                ]}
              />
              {searchData?.SearchCity === "" && (
                <span className="golbal-Error">{errors?.SearchCity}</span>
              )}
            </div>
            <div className="col-sm-2">
              <Input
                type="text"
                name="searchvalue"
                value={searchData.searchvalue}
                placeholder="Search by Name"
                className="select-input-box form-control input-sm"
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-sm-1">
              <button
                type="button"
                className="btn btn-block btn-info btn-sm"
                onClick={() => searchTempPhelbo("")}
              >
                {t("Search")}
              </button>
            </div>
            <div className="col-sm-1">
              {phleboTable ? (
                <ExportFile dataExcel={phleboTable} />
              ) : (
                <button className="btn btn-block btn-sm">Download</button>
              )}
            </div>
          </div>
        </div>
        {phleboTable && (
          <>
            <div className="box-body ">
              <div
                className="d-flex justify-content-center "
                style={{ backgroundColor: "skyblue", fontSize: "1.1rem" }}
              >
                <label
                  className="col-sm-4 col-md-4 text-center" // Add text-center class for centering text
                  htmlFor="Pending"
                  style={{ margin: "6px auto" }}
                  onClick={() => searchTempPhelbo("0")}
                >
                  <span
                    className="form-horizontal"
                    style={{
                      backgroundColor: "skyblue",
                      border: "1px solid",
                      cursor: "pointer",
                    }}
                  >
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  &nbsp; Pending
                </label>

                <label
                  className="col-sm-4 col-md-4 text-center" // Add text-center class for centering text
                  htmlFor="Rejected"
                  style={{ margin: "6px auto" }}
                  onClick={() => searchTempPhelbo("2")}
                >
                  <span
                    style={{
                      backgroundColor: "papayawhip",
                      border: "1px solid",
                      cursor: "pointer",
                    }}
                  >
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  &nbsp; Rejected
                </label>
                <label
                  className="col-sm-4 col-md-4 text-center" // Add text-center class for centering text
                  htmlFor="Approved"
                  style={{ margin: "6px auto" }}
                  onClick={() => searchTempPhelbo("1")}
                >
                  <span
                    style={{
                      backgroundColor: "lightgreen",
                      border: "1px solid",
                      cursor: "pointer",
                    }}
                  >
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </span>
                  &nbsp; Approved
                </label>
              </div>
            </div>
            <div className="box-body">
              <div
                className="box-body divResult boottable table-responsive"
                id="no-more-tables"
              >
                <div className="row">
                  <table
                    className="table table-bordered table-hover table-striped tbRecord"
                    cellPadding="{0}"
                    cellSpacing="{0}"
                  >
                    <thead className="cf text-center" style={{ zIndex: 99 }}>
                      <tr>
                        <th className="text-center">{t("#")}</th>
                        <th className="text-center">{t("Edit")}</th>
                        <th className="text-center">{t("Approve")}</th>
                        <th className="text-center">{t("Reject")}</th>
                        <th className="text-center">{t("Name")}</th>
                        <th className="text-center">{t("DOB")}</th>
                        <th className="text-center">{t("Gender")}</th>
                        <th className="text-center">{t("Mobile")}</th>
                        <th className="text-center">{t("Email")}</th>
                        <th className="text-center">{t("Date")}</th>
                        <th className="text-center">{t("Address")}</th>
                        <th className="text-center">{t("City")}</th>
                        <th className="text-center">{t("Pincode")}</th>
                        <th className="text-center">{t("Document")}</th>
                        <th className="text-center">{t("Work Location")}</th>
                        <th className="text-center">{t("Join From Date")}</th>
                        <th className="text-center">{t("Join To Date")}</th>
                      </tr>
                    </thead>

                    <tbody>
                      {phleboTable &&
                        phleboTable.map((ele, index) => (
                          <tr
                            key={ele?.Temp_PhlebotomistID}
                            style={{ backgroundColor: getstatus(ele.IsVerify) }}
                          >
                            <td data-title="#" className="text-center">
                              {index + 1}
                            </td>
                            <td data-title="FromDate" className="text-center">
                              {ele.IsVerify == 0 ? (
                                <button
                                  className="btn btn-block btn-info btn-sm"
                                  onClick={() =>
                                    setPhelboApprovalDetailModal({
                                      ...phelboApprovalDetailModal,
                                      show: true,
                                      data: ele?.Temp_PhlebotomistID,
                                      fullData: ele,
                                    })
                                  }
                                >
                                  Edit
                                </button>
                              ) : ele.IsVerify == 1 ? (
                                <button
                                  className="btn btn-block btn-info btn-sm"
                                  onClick={() =>
                                    setPhelboApprovalDetailModal({
                                      ...phelboApprovalDetailModal,
                                      show: true,
                                      data: ele?.Temp_PhlebotomistID,
                                      fullData: ele,
                                    })
                                  }
                                >
                                  Edit
                                </button>
                              ) : (
                                ""
                              )}
                            </td>
                            <td data-title="ToDate" className="text-center">
                              {ele.IsVerify == 1 ? (
                                <i
                                  class="fa fa-check"
                                  style={{ color: "green" }}
                                  aria-hidden="true"
                                ></i>
                              ) : ele.IsVerify == 0 ? (
                                <button
                                  className="btn btn-block btn-success btn-sm"
                                  onClick={() => {
                                    settempPhelboApprovalEditModal({
                                      ...tempPhelboApprovalEditModal,
                                      show: true,
                                      data: ele?.Temp_PhlebotomistID,
                                      fullData: ele,
                                    });
                                  }}
                                >
                                  Approve
                                </button>
                              ) : (
                                ""
                              )}
                            </td>
                            <td data-title="status" className="text-center">
                              {ele.IsVerify == 0 ? (
                                <button
                                  className="btn btn-block btn-danger btn-sm"
                                  onClick={() =>
                                    hancleReject(ele.Temp_PhlebotomistID)
                                  }
                                >
                                  Reject
                                </button>
                              ) : ele.IsVerify == 2 ? (
                                <i
                                  class="fa fa-ban"
                                  style={{ color: "red" }}
                                  aria-hidden="true"
                                ></i>
                              ) : (
                                ""
                              )}
                            </td>
                            <td data-title="Name" className="text-center">
                              {ele.NAME}
                            </td>
                            <td
                              data-title="Date of Birth"
                              className="text-center"
                            >
                              {ele.Age}
                            </td>
                            <td data-title="Gender" className="text-center">
                              {ele.Gender}
                            </td>
                            <td data-title="Mobile No." className="text-center">
                              {ele.Mobile}
                            </td>
                            <td data-title="Email Id" className="text-center">
                              {ele.Email}
                            </td>
                            <td data-title="Date" className="text-center">
                              {ele.dtentry
                                ? ele.dtentry.split(" ").map((ele) => (
                                    <>
                                      <span>{ele}</span>
                                      <br />
                                    </>
                                  ))
                                : " "}
                            </td>
                            <td data-title="Address" className="text-center">
                              {ele.P_Address}
                            </td>
                            <td data-title="City" className="text-center">
                              {ele.P_City}
                            </td>
                            <td data-title="Pincode" className="text-center">
                              {ele.P_Pincode}
                            </td>
                            <td data-title="Document" className="text-center">
                              {ele.DucumentNo
                                ? ele.DucumentNo.split("-").map((ele) => (
                                    <>
                                      <span>{ele}</span>
                                      <br />
                                    </>
                                  ))
                                : " "}
                            </td>
                            <td
                              data-title="Work Location"
                              className="text-center"
                            >
                              {ele.WorkLocation
                                ? ele.WorkLocation.split(",").map((ele) => (
                                    <>
                                      <span>{ele}</span>
                                      <br />
                                    </>
                                  ))
                                : " "}
                            </td>
                            <td
                              data-title="Join From Date"
                              className="text-center"
                            >
                              {ele.JoinFromDate}
                            </td>
                            <td
                              data-title="Join To Date"
                              className="text-center"
                            >
                              {ele.JoinToDate}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>{" "}
          </>
        )}
      </div>
    </>
  );
};

export default TemporaryPhelboAproval;
