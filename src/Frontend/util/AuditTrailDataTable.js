import React from "react";
import Loading from "./Loading";
import { dateConfig } from "./DateConfig";

import { useTranslation } from "react-i18next";
function AuditTrailDataTable({ tableData }) {
   // i18n start
  const { t } = useTranslation();

  // i18n end

  return (
    <>
      {tableData.length > 0 ? (
        <div
          className="box-body divResult table-responsive"
          id="no-more-tables"
        >
          <div className="row">
            <div className="col-12">
              <table
                className="table table-bordered table-hover table-striped tbRecord"
                cellPadding="{0}"
                cellSpacing="{0}"
              >
                <thead className="cf">
                  <tr>
                    <th>{t("S.No")}</th>
                    <th>{t("Date")}</th>
                    <th>{t("Entry By")}</th>
                    <th>{t("Status")}</th>
                    <th>{t("Center")}</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((data, index) => (
                    <tr key={index}>
                      <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                      <td data-title={t("Date")}>{dateConfig(data.dtEntry)}&nbsp;</td>
                      <td data-title={t("Entry By")}>{data?.CreatedByName}&nbsp;</td>
                      <td data-title={t("Status")}
                        className={`${
                          data?.ColorStatus === 1
                            ? "color-Status-1"
                            : data?.ColorStatus === 2
                            ? "color-Status-2"
                            : data?.ColorStatus === 3
                            ? "color-Status-3"
                            : data?.ColorStatus === 4
                            ? "color-Status-4"
                            : data?.ColorStatus === 5
                            ? "color-Status-5"
                            : data?.ColorStatus === 10
                            ? "color-Status-10"
                            : ""
                        }`}
                      >
                        {data?.ItemName}&nbsp;
                      </td>
                      <td data-title={t("Center")}>{data?.Centre}&nbsp;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default AuditTrailDataTable;
