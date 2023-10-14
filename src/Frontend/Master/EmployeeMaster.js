import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { getDesignationData } from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";

import { useTranslation } from "react-i18next";
function EmployeeMaster() {
  const [Designation, setDesigation] = useState([]);
  const [load, setLoad] = useState(false);
  const [payload, setPayload] = useState({
    DesignationID: "",
    Name: "",
  });
  const [tableData, setTableData] = useState([]);

  const handleSelectChange = (e) => {
    const { value, name } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const { t } = useTranslation();
  const handleSearch = () => {
    setLoad(true);
    axios
      .post("/api/v1/Employee/getEmployeeDetails", payload)
      .then((res) => {
        setTableData(res.data?.message);
        setLoad(false);
        if (res.data.message.length === 0) {
          toast.success("No Data Found");
        }
      })
      .catch((err) => {
        console.log(err);
        setLoad(false);
      });
  };

  useEffect(() => {
    getDesignationData(setDesigation);
  }, []);

  useEffect(() => {
    setPayload({
      ...payload,
      DesignationID: Designation[0]?.value,
    });
  }, [Designation]);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h6 className="box-title">{t("Employee Master")}</h6>

          <Link to="/CreateEmployeeMaster" style={{ float: "right" }}>
            {t("Create New")}
          </Link>
        </div>

        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("Designation")}:</label>
            <div className="col-sm-2">
              <SelectBox
                name="DesignationID"
                options={Designation}
                value={payload?.DesignationID}
                onChange={handleSelectChange}
                id="Designation"
              />
            </div>

            <label className="col-sm-1">{t("Name")}:</label>
            <div className="col-sm-2">
              <Input
                name="Name"
                placeholder={t("Name")}
                value={payload?.Name}
                className="form-control ui-autocomplete-input input-sm"
                type="text"
                max={50}
                onChange={(e) => {
                  setPayload({ ...payload, Name: e.target.value });
                }}
              />
            </div>

            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-block btn-info btn-sm"
                  onClick={handleSearch}
                >
                  {t("Search")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {tableData.length > 0 && (
        <div className="box">
          <div
            className="box-body divResult boottable table-responsive"
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
                  <th>{t("Name")}</th>
                  <th>{t("HouseNo")}</th>
                  <th>{t("StreetName")}</th>
                  <th>{t("Locality")}</th>
                  <th>{t("City")}</th>
                  <th>{t("Pincode")}</th>
                  <th>{t("PHouseNo")}</th>
                  <th>{t("PStreetName")}</th>
                  <th>{t("PLocality")}</th>
                  <th>{t("PCity")}</th>
                  <th>{t("PPincode")}</th>
                  <th>{t("Mobile")}</th>
                  <th>{t("Email")}</th>
                  <th>{t("Active")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {tableData?.map((data, index) => (
                  <tr key={index}>
                    <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                    <td data-title={t("Name")}>{data?.Name}&nbsp;</td>
                    <td data-title={t("HouseNo")}>{data?.HouseNo}&nbsp;</td>
                    <td data-title={t("StreetName")}>{data?.StreetName}&nbsp;</td>
                    <td data-title={t("Locality")}>{data?.Locality}&nbsp;</td>
                    <td data-title={t("City")}>{data?.City}&nbsp;</td>
                    <td data-title={t("Pincode")}>{data?.Pincode}&nbsp;</td>
                    <td data-title={t("PHouseNo")}>{data?.PHouseNo}&nbsp;</td>
                    <td data-title={t("PStreetName")}>
                      {data?.PStreetName}&nbsp;
                    </td>
                    <td data-title={t("PLocality")}>{data?.PLocality}&nbsp;</td>
                    <td data-title={t("PCity")}>{data?.PCity}&nbsp;</td>
                    <td data-title={t("PPincode")}>{data?.PPincode}&nbsp;</td>
                    <td data-title={t("Mobile")}>{data?.Mobile}&nbsp;</td>
                    <td data-title={t("Email")}>{data?.Email}&nbsp;</td>
                    <td data-title={t("Active")}>
                      {data?.isActive === 1 ? "Active" : "DeActive"}&nbsp;
                    </td>
                    <td data-title={t("Action")}>
                      <Link
                        to="/CreateEmployeeMaster"
                        state={{
                          button: "Update",
                          url1: "/api/v1/Employee/getEmployeeDetailsByID",
                          url2: "/api/v1/Employee/UpdateEmployee",
                          id: data?.EmployeeID,
                        }}
                      >
                        {t("Edit")}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}

export default EmployeeMaster;
