import React from "react";
import { useTranslation } from "react-i18next";
import DatePicker from "../Components/DatePicker";
import { useState } from "react";
import moment from "moment";
import axios from "axios";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { toast } from "react-toastify";
import { isChecked } from "../util/Commonservices";
import Loading from "../util/Loading";

function MergeDoctor() {
  const { t } = useTranslation();
  const [load, setLoad] = useState(false);

  const [payload, setPayload] = useState({
    formDate: new Date(),
    ToDate: new Date(),
    Status: "0",
  });

  const [tableData, setTableData] = useState([]);

  const handleDate = (value, name) => {
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleSelect = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
    handleSearch(value);
  };

  const handleSave = (url) => {
    const data = tableData.filter((ele) => ele?.isChecked === "1");
    if (data.length > 0) {
      axios
        .post(`api/v1/DoctorReferal/${url}`, data)
        .then((res) => {
          toast.success(res?.data?.message);
          setTableData([]);
          handleSearch();
        })
        .catch((err) => {
          toast.error(err?.response?.data?.message);
        });
    } else {
      toast.error("Select One Data");
    }
  };

  const handleCheck = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const data = [...tableData];
      data[index][name] = checked ? "1" : "0";
      setTableData(data);
    } else {
      const data = tableData.map((ele) => {
        return {
          ...ele,
          [name]: checked ? "1" : "0",
        };
      });
      setTableData(data);
    }
  };

  const handleSearch = (Status) => {
    setLoad(true);
    axios
      .post("api/v1/DoctorReferal/getTempDoctorData", {
        FromDate: moment(payload?.formDate).format("DD/MMM/YYYY"),
        ToDate: moment(payload?.ToDate).format("DD/MMM/YYYY"),
        Status: Status,
      })
      .then((res) => {
        const data = res?.data?.message;
        setLoad(false);
        if (data?.length === 0) {
          toast.error("No data Found");
          setTableData([]);
          return;
        }
        const val = data.map((ele) => {
          return {
            ...ele,
            isChecked: "0",
          };
        });
        setTableData(val);
      })
      .catch((err) => {
        setLoad(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occur"
        );
      });
  };

  return (
    <div className="box box-success form-horizontal">
      <div className="box-header with-border">
        <h1 className="box-title">{t("Merge Doctor")}</h1>
      </div>
      <div className="box-body">
        <div className="row">
          <div className="col-sm-1">
            <label className="control-label " htmlFor="searchType">
              {t("Form Date")} :
            </label>
          </div>
          <div className="col-sm-2">
            <DatePicker
              maxDate={new Date()}
              date={payload?.formDate}
              name={"formDate"}
              className="select-input-box form-control input-sm required"
              onChange={handleDate}
            />
          </div>
          <div className="col-sm-1">
            <label className="control-label " htmlFor="searchType">
              {t("To Date")} :
            </label>
          </div>
          <div className="col-sm-2">
            <DatePicker
              maxDate={new Date()}
              date={payload?.ToDate}
              className="select-input-box form-control input-sm required"
              minDate={payload?.formDate}
              name={"ToDate"}
              onChange={handleDate}
            />
          </div>

          <div className="col-sm-1">
            <label className="control-label " htmlFor="searchType">
              {t("Status")} :
            </label>
          </div>
          <div className="col-sm-2">
            <SelectBox
              options={[
                {
                  label: "Non Merge",
                  value: "0",
                },
                {
                  label: "Merge",
                  value: "1",
                },
              ]}
              selectedValue={payload?.Status}
              name="Status"
              onChange={handleSelect}
            />
          </div>

          <div className="col-sm-2">
            {load ? (
              <Loading />
            ) : (
              <button
                className="btn btn-sm btn-success"
                onClick={() => handleSearch(payload?.Status)}
              >
                search
              </button>
            )}
          </div>
        </div>
      </div>
      {tableData?.length > 0 && (
        <div
          className=" box-body divResult table-responsive mt-4"
          id="no-more-tables"
        >
          <table
            className="table table-bordered table-hover table-striped tbRecord"
            cellPadding="{0}"
            cellSpacing="{0}"
          >
            <thead>
              <tr>
                {[
                  "S.no",
                  "Doctor Name",
                  "Contact No.",
                  "Email",
                  <Input
                    type="checkbox"
                    name={"isChecked"}
                    onChange={handleCheck}
                    checked={
                      tableData.length > 0
                        ? isChecked("isChecked", tableData, "1").includes(false)
                          ? false
                          : true
                        : false
                    }
                  />,
                ].map((ele, index) => (
                  <th key={index}>{ele}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData?.map((ele, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{ele?.DoctorName}</td>
                  <td>{ele?.ContactNo}</td>
                  <td>{ele?.Email}</td>
                  <td>
                    <Input
                      type="checkbox"
                      name={"isChecked"}
                      checked={ele?.isChecked === "1" ? true : false}
                      onChange={(e) => handleCheck(e, index)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              marginTop: "5px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {payload?.Status == 0 ? (
              <button
                className="btn btn-sm btn-success mx-2"
                onClick={() => handleSave("InsertTempDoctor")}
              >
                Save
              </button>
            ) : (
              <button
                className="btn btn-sm btn-danger mx-2"
                onClick={() => handleSave("RemoveTempDoctor")}
              >
                Remove
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MergeDoctor;
