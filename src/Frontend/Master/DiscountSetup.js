import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  getAccessCentres,
  isChecked,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";
import { number } from "../../Frontend/util/Commonservices/number";
import Input from "../../ChildComponents/Input";
import { useTranslation } from "react-i18next";
const DiscountSetup = () => {
  const [DiscountSetupTypeData, setDiscountSetupTypeData] = useState([]);
  const [doctorlist, setDoctorList] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [load, setLoad] = useState(false);
  const [payload, setPayload] = useState({
    DocID: "",
    CentreID: "1",
    DiscountSetupTypeID: 1,
    DepartmentID: "1",
  });
  const [TableData, setTableData] = useState([]);

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    if (name === "DocID") {
      setPayload({ ...payload, [name]: Number(value), CentreID: -1 });
    } else if (name === "CentreID") {
      setPayload({ ...payload, [name]: Number(value), DocID: -1 });
    } else {
      setPayload({ ...payload, [name]: Number(value) });
    }
  };

  const { t } = useTranslation();

  const DiscountSetupTypeList = () => {
    axios
      .get("/api/v1/DiscountSetup/DiscountSetupTypeList")
      .then((res) => {
        let data = res.data.message;
        let DiscountSetupTypeList = data.map((ele) => {
          return {
            value: ele.DiscountSetupTypeId,
            label: ele.DiscountSetupType,
          };
        });
        DiscountSetupTypeList.unshift({
          label: "DiscountSetupTypeID",
          value: "",
        });
        setDiscountSetupTypeData(DiscountSetupTypeList);
      })
      .catch((err) => console.log(err));
  };

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
        Department.unshift({ label: "All Department", value: "" });
        setDepartmentData(Department);
      })
      .catch((err) => console.log(err));
  };

  const validationFileds = () => {
    let errors = "";
    if (!payload?.DiscountSetupTypeID) {
      errors = "Please Select DiscountSetupTypeID.";
    }
    return errors;
  };

  const GetDiscountSetupData = () => {
    const generatedError = validationFileds();
    if (generatedError === "") {
      setLoad(true);
      axios
        .post("/api/v1/DiscountSetup/GetDiscountSetupData", payload)
        .then((res) => {
          if (res.status === 200) {
            const data = res.data.message;
            const val = data.map((ele) => {
              return {
                ...ele,
                isChecked: false,
              };
            });
            setTableData(val);
            setLoad(false);
          }
        })
        .catch((err) => {
          setLoad(false);
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
        });
    } else {
      toast.error(generatedError);
    }
  };

  const DiscountDoctorList = () => {
    axios
      .get("/api/v1//DiscountSetup/DoctorList")
      .then((res) => {
        console.log(res);
        const data = res?.data?.message;
        const doctorlist = data.map((ele) => {
          return {
            label: ele?.NAME,
            value: ele?.DoctorReferalID,
          };
        });
        doctorlist.unshift({ label: "Doctor", value: "" });
        setDoctorList(doctorlist);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong."
        );
      });
  };

  const handleChange = (e, index) => {
    const { name, value, type, checked } = e.target;

    if (index >= 0) {
      const data = [...TableData];
      if (name === "DiscountAmnt") {
        data[index]["DiscountPer"] = "";
      }
      if (name === "DiscountPer") {
        data[index]["DiscountAmnt"] = "";
      }
      data[index][name] =
        type === "checkbox"
          ? checked
          : name === "DiscountPer"
          ? parseInt(value) > 100
            ? ""
            : value
          : value;
      setTableData(data);
    } else {
      if (type === "checkbox") {
        if (checked) {
          const data = TableData.map((ele) => {
            return {
              ...ele,
              [name]: checked,
            };
          });
          setTableData(data);
        } else {
          const data = TableData.map((ele) => {
            return {
              ...ele,
              DiscountAmnt: name === "DiscountPer" ? "" : value,
              DiscountPer: name === "DiscountAmnt" ? "" : value,
              DiscountPer: name === "DiscountPer" ? "" : value,
              [name]: checked,
            };
          });
          setTableData(data);
          document.getElementById("DiscountAmnt").value = "";
          document.getElementById("DiscountPer").value = "";
        }
      } else {
        const data = TableData.map((ele) => {
          return {
            ...ele,
            DiscountAmnt: name === "DiscountPer" ? "" : value,
            DiscountPer:
              name === "DiscountAmnt" ? "" : parseInt(value) > 100 ? "" : value,
          };
        });
        setTableData(data);
        if (name === "DiscountPer") {
          document.getElementById("DiscountAmnt").value = "";
          let data = document.getElementById("DiscountPer").value;
          if (parseInt(data) > 100) {
            document.getElementById("DiscountPer").value = "";
          }
        }
        if (name === "DiscountAmnt") {
          document.getElementById("DiscountPer").value = "";
        }
      }
    }
  };

  const handleSave = () => {
    const data = TableData.filter((ele) => ele.isChecked === true);
    const val = data.map((ele) => {
      return {
        DocID: payload?.DocID,
        InvestigationID: ele?.InvestigationID,
        DiscountAmount: ele?.DiscountAmount,
        DiscountPer: ele?.DiscountPer,
        DepartmentID: payload?.DepartmentID,
        CentreID: payload?.CentreID,
        DiscountSetupTypeID: payload?.DiscountSetupTypeID,
      };
    });

    setLoad(true);
    axios
      .post("/api/v1/DiscountSetup/DiscountSetupCreate", {
        SaveDiscountSetup: val,
      })
      .then((res) => {
        toast.success(res.data?.message);
        setLoad(false);
        GetDiscountSetupData();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoad(false);
      });
  };

  useEffect(() => {
    getDepartment();
    getAccessCentres(setCentreData);
    DiscountSetupTypeList();
    DiscountDoctorList();
  }, []);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">Discount Setup</div>
        <div className="box-body">
          <div className="row">
            <div className="col-sm-2">
              <label>DiscountSetupTypeID:</label>
              <SelectBox
                options={DiscountSetupTypeData}
                selectedValue={payload?.DiscountSetupTypeID}
                onChange={handleSelectChange}
                name="DiscountSetupTypeID"
              />
            </div>
            <div className="col-sm-2">
              <label>
                {payload?.DiscountSetupTypeID === 1 ? "CentreID" : "Doctor"} :
              </label>

              {payload?.DiscountSetupTypeID === 1 ? (
                <SelectBox
                  options={CentreData}
                  selectedValue={payload?.CentreID}
                  onChange={handleSelectChange}
                  name="CentreID"
                />
              ) : (
                <SelectBox
                  options={doctorlist}
                  selectedValue={payload?.DocID}
                  onChange={handleSelectChange}
                  name="DocID"
                />
              )}
            </div>
            <div className="col-sm-2">
              <label>DepartmentID:</label>
              <SelectBox
                options={DepartmentData}
                selectedValue={payload?.DepartmentID}
                onChange={handleSelectChange}
                name="DepartmentID"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-1">
              <button
                className="btn btn-info btn-sm btn-block"
                onClick={GetDiscountSetupData}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="box mb-4"> */}
      {load ? (
        <Loading />
      ) : (
        <div>
          {TableData.length > 0 && (
            <div
              className="box-body divResult table-responsive boottable"
              id="no-more-tables"
            >
              <>
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf">
                    <tr>
                      <th>S.No</th>
                      <th>Investigation</th>
                      <th>Rate</th>
                      <th>
                        <Input
                          type="text"
                          className="select-input-box form-control input-sm"
                          placeholder="Discount Amount"
                          name="DiscountAmnt"
                          onChange={handleChange}
                          onInput={(e) => number(e, 4)}
                          id="DiscountAmnt"
                          disabled={
                            TableData?.length > 0
                              ? isChecked(
                                  "isChecked",
                                  TableData,
                                  true
                                ).includes(false)
                                ? true
                                : false
                              : false
                          }
                        />
                      </th>
                      <th>
                        <Input
                          type="text"
                          placeholder="Discount %"
                          name="DiscountPer"
                          onChange={handleChange}
                          onInput={(e) => number(e, 4)}
                          className="select-input-box form-control input-sm"
                          id="DiscountPer"
                          disabled={
                            TableData?.length > 0
                              ? isChecked(
                                  "isChecked",
                                  TableData,
                                  true
                                ).includes(false)
                                ? true
                                : false
                              : false
                          }
                        />
                      </th>
                      <th>
                        <Input
                          type="checkbox"
                          name="isChecked"
                          onChange={handleChange}
                          checked={
                            TableData?.length > 0
                              ? isChecked(
                                  "isChecked",
                                  TableData,
                                  true
                                ).includes(false)
                                ? false
                                : true
                              : false
                          }
                        />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {TableData.map((data, i) => (
                      <tr key={i}>
                        <td data-title="S.No">{i + 1}&nbsp;</td>
                        <td data-title="Investigation">
                          {data?.TestName}&nbsp;
                        </td>
                        <td data-title="Rate">{data?.Rate}&nbsp;</td>
                        <td data-title="DiscountAmnt">
                          <Input
                            value={data?.DiscountAmnt}
                            type="text"
                            onChange={(e) => handleChange(e, i)}
                            onInput={(e) => number(e, 4)}
                            name="DiscountAmnt"
                            className={`select-input-box form-control input-sm  ${
                              data?.DiscountAmnt > data?.Rate
                                ? "error-occured-input"
                                : ""
                            }`}
                            disabled={data?.isChecked ? false : true}
                          />
                        </td>
                        <td data-title="DiscountPer">
                          <Input
                            value={data?.DiscountPer}
                            type="text"
                            onChange={(e) => handleChange(e, i)}
                            onInput={(e) => number(e, 4)}
                            name="DiscountPer"
                            className="select-input-box form-control input-sm"
                            disabled={data?.isChecked ? false : true}
                          />
                        </td>
                        <td data-title="Status">
                          <Input
                            type="checkbox"
                            name="isChecked"
                            checked={data?.isChecked}
                            onChange={(e) => handleChange(e, i)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="box-footer">
                  <div className="col-sm-1">
                    <button
                      className="btn btn-success btn-sm btn-block"
                      onClick={() => handleSave()}
                    >
                      Save
                    </button>
                  </div>
                </div>
              </>
            </div>
          )}
        </div>
      )}
      {/* </div> */}
    </>
  );
};

export default DiscountSetup;
