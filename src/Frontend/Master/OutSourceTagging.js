import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  getAccessCentres,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";
import { useTranslation } from "react-i18next";

const OutSourceTagging = () => {
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState({});
  const [OutSourcedata, setOutSourcedata] = useState([]);
  const [centreId, setCentreData] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [button, showButton] = useState(false);
  const [payload, setPayload] = useState({
    CentreID: "1",
    DepartmentID: "1",
  });
  const { t } = useTranslation();

  const getDepartment = () => {
    axios
      .get("/api/v1/Department/getDepartment")
      .then((res) => {
        let data = res.data.message;
        let Department = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        setDepartment(Department);
      })
      .catch((err) => console.log(err));
  };

  const getOutSourceTagging = () => {
    setLoad(true);
    axios
      .post("/api/v1/OutSourceLabMaster/getAllOutSourceTaggingData", payload)
      .then((res) => {
        if (res.status === 200) {
          setOutSourcedata(res.data.message);
          setLoad(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const post = () => {
    setLoad(true);
    axios
      .post("/api/v1/OutSourceLabMaster/InsertOutSourceTaggingData", {
        CentreID: payload?.CentreID,
        DepartmentID: payload?.DepartmentID,
        isActive: "1",
        Data: OutSourcedata,
      })
      .then((res) => {
        if (res.data.message) {
          setLoad(false);
          toast.success(res.data.message);
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setLoad(false);
      });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value, ItemValue: "" });
    setErr({});
  };

  console.log(OutSourcedata);

  const handleCheckbox = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const data = [...OutSourcedata];
      data[index][name] = checked ? 1 : 0;
      return setOutSourcedata(data);
    } else {
      const val = OutSourcedata.map((ele) => {
        return {
          ...ele,
          IsOutsource: checked ? 1 : 0,
        };
      });
      return setOutSourcedata(val);
    }
  };

  // const handleChangeMain = (e, i, names) => {
  //   const { value, name, checked, type } = e.target;
  //   const datas = [...data];
  //   if (names) {
  //     datas[i][names] = value;
  //     setData(datas);
  //   } else {
  //     datas[i][name] = type === "checkbox" ? (checked ? 1 : 0) : value;
  //     setData(datas);
  //   }
  // };
  const getAccessCentres = (state) => {
    axios
      .get("/api/v1/Centre/getAccessCentres")
      .then((res) => {
        let data = res.data.message;
        console.log(data);
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        // CentreDataValue.unshift({ label: "All Centre", value: "" });
        state(CentreDataValue);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.sessionStorage.clear();
          window.location.href = "/login";
        }
      });
  };

  useEffect(() => {
    getDepartment();
    getAccessCentres(setCentreData);
  }, []);

  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h1 className="box-title">{t("OutSource Tagging")}</h1>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-sm-2 col-md-2 form-group mt-4">
              <SelectBox
                name="CentreID"
                options={centreId}
                value={payload?.CentreID}
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-sm-2 col-md-2 form-group mt-4">
              <SelectBox
                name="DepartmentID"
                options={Department}
                selectedValue={payload?.DepartmentID}
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-block btn-warning btn-sm"
                    id="btnSearch"
                    title="Search"
                    onClick={() => {
                      getOutSourceTagging();
                      showButton(true);
                    }}
                  >
                 {t("Search")}   
                  </button>
                </>
              )}
            </div>
          </div>
          {load ? (
            <Loading />
          ) : (
            <>
              {OutSourcedata.length > 0 && (
                <div className="box">
                  <div
                    className="box-body  divResult boottable"
                    id="no-more-tables"
                  >
                    <table
                      className="table table-bordered table-hover table-striped tbRecord"
                      cellPadding="{0}"
                      cellSpacing="{0}"
                    >
                      <thead className="cf">
                        <tr>
                          <th>{t("S.No")}</th>
                          <th>{t("Test Name")}</th>
                          <th>
                            <Input type="checkbox" onChange={handleCheckbox} />
                            {t("Out Source")} 
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {OutSourcedata.map((ele, index) => (
                          <tr key={index}>
                            <td data-title={t("S.No")}>{index + 1}</td>
                            <td data-title={t("Test Name")}>{ele?.TestName}</td>
                            <td data-title={t("Out Source")}>
                              <Input
                                type="checkbox"
                                name="IsOutsource"
                                checked={ele?.IsOutsource}
                                onChange={(e) => handleCheckbox(e, index, ele)}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="box-footer">
                    {button && OutSourcedata ? (
                      <div className="col-sm-1 mt-4">
                        <button
                          type="button"
                          className="btn btn-block btn-warning btn-sm"
                          id="btnSearch"
                          title="Search"
                          onClick={post}
                        >
                         {t("Save")} 
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OutSourceTagging;
