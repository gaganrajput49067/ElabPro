import React, { useEffect, useState } from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";
// import "bootstrap/dist/css/bootstrap.min.css";
import { Table } from "react-bootstrap";
import Input from "../../ChildComponents/Input";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../Frontend/util/Loading";
import { selectedValueCheck } from "../../Frontend/util/Commonservices";

import { useTranslation } from "react-i18next";
const TestCentreMapping = () => {
  const [loading, setLoading] = useState(false);
  const [FetchDepartment, setFetchDepartment] = useState([]);
  const [FetchCentre, setFetchCentre] = useState([]);
  const [payload, setPayload] = useState({
    BookingCentreId: "",
    DepartmentId: "",
    TestName: "",
  });
  const { t } = useTranslation();
  const [load, setLoad] = useState(false);
  const [tableData, setTableData] = useState([]);

  const handleChangeSelect = (e, index) => {
    const { name, value } = e.target;
    if (index >= 0) {
      const data = [...tableData];
      data[index][name] = value;
      setTableData(data);
    } else {
      const val = tableData?.map((ele) => {
        return {
          ...ele,
          [name]: value,
        };
      });
      setTableData(val);
    }
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  const fetchCenter = () => {
    axios
      .get("/api/v1/Centre/getAccessCentres")
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => {
          return {
            label: ele?.Centre,
            value: ele?.CentreID,
          };
        });
        val.unshift({ label: "Booking Centre", value: "0" });
        setFetchCentre(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  const fetchDepartment = () => {
    axios
      .get("/api/v1/TestCentreMappingController/BindDepartment")
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            label: ele?.department,
            value: ele?.departmentid,
          };
        });
        val.unshift({ label: "Department", value: "0" });
        setFetchDepartment(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  // const fetchBindTestCentre1 = () => {
  //   axios
  //     .get("api/v1/TestCentreMappingController/BindTestCentre2")
  //     .then((res) => {
  //       const data = res?.data?.message;
  //       const val = data?.map((ele) => {
  //         return {
  //           label: ele?.Centre,
  //           value: ele?.centreId,
  //         };
  //       });
  //       setfetchBindTestCentre(val);
  //     })
  //     .catch((err) => {
  //       toast.error(
  //         err?.response?.data?.message
  //           ? err.response?.data?.message
  //           : "Something Went Wrong"
  //       );
  //     });
  // };

  // const fetchBindTestCentre2 = () => {
  //   axios
  //     .get("/api/v1/TestCentreMappingController/BindTestCentre1")
  //     .then((res) => {
  //       const data = res?.data?.message;
  //       const val = data?.map((ele) => {
  //         return {
  //           label: ele?.Centre,
  //           value: ele?.centreId,
  //         };
  //       });
  //       setfetchTestCentre2(val);
  //     })
  //     .catch((err) => {
  //       toast.error(
  //         err?.response?.data?.message
  //           ? err.response?.data?.message
  //           : "Something Went Wrong"
  //       );
  //     });
  // };

  // const fetchBindTestCentre3 = () => {
  //   axios
  //     .get("/api/v1/TestCentreMappingController/BindTestCentre3")
  //     .then((res) => {
  //       const data = res?.data?.message;
  //       const val = data?.map((ele) => {
  //         return {
  //           label: ele?.Centre,
  //           value: ele?.centreId,
  //         };
  //       });
  //       setfetchTestCentre3(val);
  //     })
  //     .catch((err) => {
  //       toast.error(
  //         err?.response?.data?.message
  //           ? err.response?.data?.message
  //           : "Something Went Wrong"
  //       );
  //     });
  // };
  const SearchApi = () => {
    setLoad(true);
    setTableData([]);
    axios
      .post("/api/v1/TestCentreMappingController/getTestCentre", payload)
      .then((res) => {
        setTableData(res?.data?.message);
        setLoad(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
        setLoad(false);
      });
  };

  const handleSave = () => {
    setLoading(true);
    const data = tableData.map((ele) => {
      return {
        BookingCentreId: payload?.BookingCentreId,
        InvestigationId: ele?.InvestigationID,
        DepartmentId: payload?.DepartmentId,
        TestCentreId1: ele?.Test_Centre,
        TestCentreId2: ele?.Test_Centre2,
        TestCentreId3: ele?.Test_Centre3,
      };
    });
    axios
      .post("/api/v1/TestCentreMappingController/SaveTestCentreMapping", data)
      .then((res) => {
        toast.success(res?.data?.message);
        setLoading(false);
        SearchApi();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCenter();
    fetchDepartment();
  }, []);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Test Mapping")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("Booking Centre")}:</label>
            <div className="col-sm-2 col-md-2">
              <SelectBox
                name="BookingCentreId"
                options={FetchCentre}
                onChange={handleSelectChange}
                selectedValue={payload?.BookingCentreId}
              />
            </div>
            <label className="col-sm-1">{t("Department")}:</label>
            <div className="col-sm-2 col-md-2">
              <SelectBox
                onChange={handleSelectChange}
                name="DepartmentId"
                options={FetchDepartment}
                selectedValue={payload?.DepartmentId}
              />
            </div>
            <label className="col-sm-1">{t("Test Name")}:</label>
            <div className="col-sm-2 col-md-2">
              <Input
                className="select-input-box form-control input-sm"
                type="text"
                placeholder={t("Test Name")}
                value={payload?.TestName}
                name="TestName"
                onChange={(e) => {
                  setPayload({ ...payload, TestName: e.target.value });
                }}
              />
            </div>

            <div className="col-sm-1" style={{ alignSelf: "flex-end" }}>
              {load ? (
                <Loading />
              ) : (
                payload?.BookingCentreId &&
                payload?.DepartmentId && (
                  <button
                    type="search"
                    className="btn btn-info btn-sm btn-block"
                    onClick={SearchApi}
                  >
                    {t("Search")}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>
      {tableData.length > 0 && (
        <>
          <div
            className=" box-body divResult table-responsive boottable"
            id="no-more-tables"
          >
            <div className="row">
              <table
                className="table table-bordered table-hover table-striped tbRecord"
                cellPadding="{0}"
                cellSpacing="{0}"
              >
                <thead className="cf">
                  <tr>
                    <th>{t("S.No")}</th>
                    <th>{t("Investigation")}</th>
                    <th>
                      <select
                        className="form-control input-sm"
                        onChange={(e) => {
                          handleChangeSelect(e);
                        }}
                        name="Test_Centre"
                      >
                        <option hidden>--Select--</option>
                        {FetchCentre.map((ele, index) => (
                          <option key={index} value={ele?.value}>
                            {ele?.label}
                          </option>
                        ))}
                      </select>
                    </th>
                    <th>
                      <select
                        className="form-control input-sm"
                        onChange={(e) => {
                          handleChangeSelect(e);
                        }}
                        name="Test_Centre2"
                      >
                        <option hidden>--Select--</option>
                        {FetchCentre.map((ele, index) => (
                          <option key={index} value={ele?.value}>
                            {ele?.label}
                          </option>
                        ))}
                      </select>
                    </th>
                    <th>
                      <select
                        className="form-control input-sm"
                        onChange={(e) => {
                          handleChangeSelect(e);
                        }}
                        name="Test_Centre3"
                      >
                        <option hidden>--Select--</option>
                        {FetchCentre.map((ele, index) => (
                          <option key={index} value={ele?.value}>
                            {ele?.label}
                          </option>
                        ))}
                      </select>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((data, i) => (
                    <tr key={i}>
                      <td data-title={t("S.No")}>{i + 1}&nbsp;</td>
                      <td data-title={t("Investigation")}>
                        {data?.TestName}&nbsp;
                      </td>
                      <td data-title={t("Test_Centre")}>
                        <select
                          className="form-control input-sm"
                          value={data?.Test_Centre}
                          name="Test_Centre"
                          onChange={(e) => handleChangeSelect(e, i)}
                        >
                          <option hidden>{t("--Select--")}</option>
                          {FetchCentre.map((ele, index) => (
                            <option value={ele?.value} key={index}>
                              {ele.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td data-title={t("Test_Centre2")}>
                        <select
                          className="form-control input-sm"
                          value={data?.Test_Centre2}
                          name="Test_Centre2"
                          onChange={(e) => handleChangeSelect(e, i)}
                        >
                          <option hidden>{t("--Select--")}</option>
                          {FetchCentre.map((ele, index) => (
                            <option key={index} value={ele?.value}>
                              {ele?.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td data-title={t("Test_Centre3")}>
                        <select
                          className="form-control input-sm"
                          value={data?.Test_Centre3}
                          name="Test_Centre3"
                          onChange={(e) => handleChangeSelect(e, i)}
                        >
                          <option hidden>{t("--Select--")}</option>
                          {FetchCentre.map((ele, index) => (
                            <option key={index} value={ele?.value}>
                              {ele?.label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="box-footer">
            <div className="col-sm-1">
              {loading ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-success btn-sm btn-block"
                  onClick={handleSave}
                >
                  {t("Save")}
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default TestCentreMapping;
