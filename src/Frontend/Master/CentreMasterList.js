import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import Loading from "../../Frontend/util/Loading";

import { useTranslation } from "react-i18next";
const CentreMasterList = () => {
  const { t } = useTranslation();
  const { name } = useParams();
  const [loading, setLoading] = useState(false);
  const [CentreType, setCentreType] = useState([]);
  const [payload, setPayload] = useState({
    CentreType: "",
    CentreName: "",
    CentreCode: "",
    DataType: name === "Rate" ? "RateType" : "Centre",
  });
  const [data, setData] = useState([]);

  const handleSelect = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  const getCentreData = () => {
    setLoading(true);
    axios
      .post("/api/v1/Centre/getCentreData", payload)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const getDropDownData = (name) => {
    axios
      .post("/api/v1/Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        value.unshift({ label: "All", value: "" });
        switch (name) {
          case "CentreType":
            setCentreType(value);
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  console.log(CentreType[0]?.value);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  useEffect(() => {
    getDropDownData("CentreType");
  }, []);

  return (
    <div className="box box-success form-horizontal">
      <div className="box-header with-border">
        <h3 className="box-title">
          {/* Search Criteria */}
          {`${name} ${t("Type List")}`}
        </h3>

        <Link
          // className="d-flex justify-content-end float-right"
          style={{ float: "right" }}
          to={name === "center" ? "/CentreMaster/center" : "/CentreMaster/Rate"}
          state={{
            url: "/api/v1/Centre/InsertCentre",
          }}
        >
          {t("Create New")}
        </Link>
      </div>
      <div className="box-body">
        <div className="row">
          {name === "center" && (
            <>
              <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Type")}:
              </label>
              <div className="col-sm-2 col-md-2">
                <SelectBox
                  onChange={handleSelect}
                  options={CentreType}
                  name="CentreType"
                  selectedValue={payload?.CentreType}
                />
              </div>
            </>
          )}

          <label className="col-sm-1" htmlFor="inputEmail3">
         {t("Centre Name")}:
          </label>
          <div className="col-sm-2 col-md-2">
            <Input
              className="select-input-box form-control input-sm"
              placeholder={t("Centre Name")}
              name="CentreName"
              type="text"
              value={payload?.CentreName}
              onChange={handleChange}
            />
          </div>

          <label className="col-sm-1" htmlFor="inputEmail3">
         {t("Centre Code")}:
          </label>
          <div className="col-sm-2 col-md-2">
            <Input
              className="select-input-box form-control input-sm"
              placeholder={t("Centre Code")}
              name="CentreCode"
              type="text"
              value={payload?.CentreCode}
              onChange={handleChange}
            />
          </div>

          <div className="col-sm-1">
            <button
              type="submit"
              className="btn btn-block btn-info btn-sm"
              onClick={getCentreData}
            >
             {t("Search")} 
            </button>
          </div>
        </div>
        <div
          className=" box-body table-responsive divResult boottable"
          id="no-more-tables"
        >
          {loading ? (
            <Loading />
          ) : (
            <div className="row">
              {data.length > 0 && (
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf">
                    <tr>
                      <th>{t("S.No")}</th>
                      {name === "Rate" ? null : <th>Centre Type</th>}
                      <th>{t("Name")}</th>
                      <th>{t("Code")}</th>
                      <th>{t("Invoice To")}</th>
                      <th>{t("Business Unit")}</th>
                      <th>{t("Processing Lab")}</th>
                      <th>{t("Reference Rate")}</th>
                      <th>{t("Barcode Logic")}</th>
                      <th>{t("Invoicing")}</th>
                      <th>{t("Status")}</th>
                      <th>{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((data, i) => (
                      <tr key={i}>
                        <td data-title={t("S.No")}>{i + 1}&nbsp;</td>
                        {name === "Rate" ? null : (
                          <td data-title="Centre Type">
                            {data?.CentreType}&nbsp;
                          </td>
                        )}
                        <td data-title={t("Name")}>{data?.Centre}&nbsp;</td>
                        <td data-title={t("Code")}>{data?.CentreCode}&nbsp;</td>
                        <td data-title={t("Invoice To")}>
                          {data?.InvoiceToStatus}&nbsp;
                        </td>
                        <td data-title={t("Business Unit")}>
                          {data?.BusinessUnitStatus}&nbsp;
                        </td>
                        <td data-title={t("Processing Lab")}>
                          {data?.ProcessingLabStatus}&nbsp;
                        </td>
                        <td data-title={t("Reference Rate")}>
                          {data?.ReferenceRateStatus}&nbsp;
                        </td>
                        <td data-title={t("Barcode Logic")}>
                          {data?.BarcodeDisplay}&nbsp;
                        </td>
                        <td data-title={t("Invoicing")}>
                          {data?.InvoiceToStatus}&nbsp;
                        </td>
                        <td data-title={t("Status")}>
                          {data?.isActive === 1 ? t("Active") : t("Expired")}&nbsp;
                        </td>
                        <td data-title={t("Action")}>
                          <Link
                            state={{
                              data: data,
                              other: { button: "Update", pageName: "Edit" },
                              url: "/api/v1/Centre/UpdateCentre",
                            }}
                            to={
                              name === "center"
                                ? "/CentreMaster/center"
                                : "/CentreMaster/Rate"
                            }
                          >
                            {t("Edit")}
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
    </div>
  );
};

export default CentreMasterList;
