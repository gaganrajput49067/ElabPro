import React from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const CampApprovalRightMaster = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h3 className="box-title">{t("CampApprovalRightMaster")}</h3>
        </div>

        <div className="box-body">
          <div className="row">
            <div className="col-sm-2 ">
            <SelectBox/>
            </div>
            <div className="col-sm-2 ">
            <SelectBox/>
            </div>
            <div className="col-sm-1">
              <button className="btn btn-block btn-success btn-sm">
                {t("Save")}
              </button>
            </div>

          </div>          
        </div>

        <div className="card shadow">
          <div className="box-body boottable">
            <div
              className=" box-body divResult table-responsive mt-4"
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
                    <th>{t("Employe Name")}</th>
                    <th>{t("Verification")}</th>
                    <th>{t("Status")}</th>
                    <th>{t("Created By")}</th>
                    <th>{t("Created Date")}</th>
                    <th>{t("Remove")}</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td data-title={t("S.No")}></td>
                    <td data-title={t("Employe Name")}></td>
                    <td data-title={t("Verification")}></td>
                    <td data-title={t("Created By")}></td>
                    <td data-title={t("Created Date")}></td>
                    <td data-title={t("Created Date")}></td>
                    <td data-title={t("Remove")}></td>
                  </tr>\
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default CampApprovalRightMaster;
