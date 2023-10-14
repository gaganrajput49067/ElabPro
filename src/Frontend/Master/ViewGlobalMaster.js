import axios from "axios";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { SelectBoxWithCheckbox } from "../../ChildComponents/SelectBox";
import { BindFieldType } from "../../Frontend/util/Commonservices";
import { dateConfig } from "../../Frontend/util/DateConfig";
import Loading from "../../Frontend/util/Loading";
//i18n import start
import { useTranslation } from "react-i18next";
const LANG_LOCAL_STORAGE_KEY = "selectedLanguage";
//i18n import end
function ViewGlobalMaster() {
  const [FieldType, setFieldType] = useState([]);
  const [type, setType] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [load, setLoad] = useState(false);

  const handleChanges = (select) => {
    const data = select.map((ele) => {
      return {
        Type: ele?.value,
      };
    });
    setType(data);
  };
  // i18n start
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem(LANG_LOCAL_STORAGE_KEY) || "en"
  );
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);
  // i18n end
  const handleSearch = () => {
    setLoad(true);
    if (type.length > 0) {
      axios
        .post("/api/v1/Global/getGlobalDataByFieldType", type)
        .then((res) => {
          setTableData(res?.data?.message);
          setLoad(false);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoad(false);
        });
    } else {
      handleEffect();
    }
  };

  const handleEffect = () => {
    setLoad(true);
    axios
      .post("/api/v1/Global/getGlobalDataAll")
      .then((res) => {
        setTableData(res?.data?.message);
        setLoad(false);
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
    BindFieldType(setFieldType);
    handleEffect();
  }, []);
  return (
    <>
      <div className="box box-success">
        <div className="box-body">
          <div className="box-header with-border">
            <div className="clearfix">
              <h3 className="box-title">{t("Global Type Master List")}</h3>
              <Link to="/GlobalTypeMaster" className="float-right">
                {t("Create New")}
              </Link>
            </div>
          </div>
          </div>
          <div className="box-body">
            <div className="row">
              <label className="col-sm-1" htmlFor="DataType">
                {t("FieldType")}
              </label>
              <div className="col-sm-2 col-md-2">
                <SelectBoxWithCheckbox
                  options={FieldType}
                  onChange={handleChanges}
                />
              </div>

              <div className="col-sm-1">
                {load ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-success btn-sm btn-block"
                    onClick={handleSearch}
                  >
                    {t("Search")}
                  </button>
                )}
              </div>
            </div>
            <div
              className=" box-body table-responsive divResult boottable"
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
                    <th>{t("FieldType")}</th>
                    <th>{t("FieldDisplay")}</th>
                    <th>{t("Entry Date")}</th>
                    <th>{t("Action")}</th>
                    <th>{t("Edit")}</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((data, index) => (
                    <tr key={index}>
                      <td data-title={t("S.No")}>{index + 1}</td>
                      <td data-title={t("FieldType")}>{data?.FieldType}</td>
                      <td data-title={t("FieldDisplay")}>
                        {data?.FieldDisplay}
                      </td>
                      <td data-title={t("Entry Date")}>
                        {dateConfig(data?.EntryDate)}
                      </td>
                      <td data-title={t("Action")}>
                        {data?.IsActive === 1 ? "Active" : "Expired"}
                      </td>
                      <td>
                      {data.CompanyId === 0 ? (
                        <p
                          style={{ color: "red" }}
                          Tooltip="System Generated it can't be changed"
                        >
                          System Generated it can't be changed
                        </p>
                      ) : (
                        <Link
                          to="/GlobalTypeMaster"
                          state={{
                            data: data,
                            url: "/api/v1/Global/UpdateGlobalData",
                          }}
                        >
                          {t("Edit")}
                        </Link>
                      )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
    </>
  );
}

export default ViewGlobalMaster;
