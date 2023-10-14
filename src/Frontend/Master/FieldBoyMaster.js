import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Loading from "../../Frontend/util/Loading";
import { toast } from "react-toastify";
import axios from "axios";

import { useTranslation } from "react-i18next";
const FieldBoyMaster = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  const getFieldBoyMasterData = () => {
    axios
      .get("/api/v1/FieldBoyMaster/getFieldBoy")
      .then((res) => {
        setData(res?.data?.message);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(console.log(err));
      });
  };

  useEffect(() => {
    getFieldBoyMasterData();
  }, []);
  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Field Boy Master")}</h3>
          <Link style={{ float: "right" }} to="/CreateFieldBoyMaster">
            {t("Create New")}
          </Link>
        </div>
      </div>
      <div className="box-body divResult table-responsive boottable" id="no-more-tables">
        {loading ? (
          <Loading />
        ) : (
          <div className="row">
            {data.length > 0 ? (
              <table
                className="table table-bordered table-hover table-striped tbRecord"
                cellPadding="{0}"
                cellSpacing="{0}"
              >
                <thead className="cf">
                  <tr>
                    <th>{t("S.No")}</th>
                    <th>{t("Name")}</th>
                    <th>{t("Age")}</th>
                    <th>{t("Contact No")}</th>
                    <th>{t("Home Coll")}</th>
                    <th>{t("Action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((ele, index) => (
                    <tr>
                      <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                      <td data-title={t("Name")}>{ele?.NAME}&nbsp;</td>
                      <td data-title={t("Age")}>{ele?.Age}&nbsp;</td>
                      <td data-title={t("Contact No")}>{ele?.Mobile}&nbsp;</td>
                      <td data-title={t("Home Coll")}>
                        {ele?.HomeCollection ? t("Yes") : t("No")}&nbsp;
                      </td>
                      <td data-title={t("Action")}>
                        <Link
                          state={{
                            data: ele?.FieldBoyID,
                            other: { button: "Update" },
                            url: "/api/v1/FieldBoyMaster/EditFieldBoy",
                          }}
                          to="/CreateFieldBoyMaster"
                        >
                          {t("Edit")}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              "No Data Found"
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default FieldBoyMaster;
