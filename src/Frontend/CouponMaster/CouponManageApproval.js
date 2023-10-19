import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SelectBox } from "../../ChildComponents/SelectBox";
import DatePicker from "../Components/DatePicker";
import Input from "../../ChildComponents/Input";
// import Loading from "../util/Loading";
import Loading from "../../util/Loading";
import { SimpleCheckbox } from "../../ChildComponents/CheckBox";
import { Link } from "react-router-dom";
const CouponManageApproval = () => {
  const { t } = useTranslation();
  return (
    <>
      <div className="box with-border">
        <div className="box box-header with-border box-success">
          <h3 className="box-title text-center">
            {t("Coupon Manage Approval")}
          </h3>
        </div>
      </div>

      <div className="box">
        <div className="box-header with-border">
          <h3 className="box-title text-center">{t("Select Approval")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-2" style={{ textAlign: "end" }}>
              {t("Employee Name")} :
            </label>

            <div className="col-sm-2">
              <Input
                className="select-input-box form-control input-sm"
                type="text"
                autoComplete="off"
                placeholder="Employee Name"
                name="EmployeeName"
              />
            </div>

            <label className="col-sm-2" style={{ textAlign: "end" }}>
              {t("Authority Type")} :
            </label>
            <div className="col-sm-2">
              <SelectBox
                name="AuthorityType"
                className="form-control input-sm"
              />
            </div>
          </div>

          <div
            className="row"
            // style={{ display: "flex", justifyContent: "space-around" }}
          >
            <label className="col-sm-2" style={{ textAlign: "end" }}>
              {t("For Approval")} :
            </label>
            <div className="col-sm-1">
              <SimpleCheckbox name="Maker" type="checkbox" />
              &nbsp;{t("Maker")}
            </div>
            <div className="col-sm-1">
              <SimpleCheckbox name="Checker" type="checkbox" />
              &nbsp;{t("Checker")}
            </div>
            <div className="col-sm-1">
              <SimpleCheckbox name="Approval" type="checkbox" />
              &nbsp; {t("Approval")}
            </div>
            <div className="col-sm-1">
              <SimpleCheckbox name="Reject" type="checkbox" />
              &nbsp;{t("Reject")}
            </div>
            <div className="col-sm-2">
              <SimpleCheckbox name="StatusChange" type="checkbox" />
              &nbsp;{t("StatusChange")}
            </div>
            <div className="col-sm-1">
              <SimpleCheckbox name="Edit" type="checkbox" />
              &nbsp;{t("Edit")}
            </div>
            <div className="col-sm-2">
              <SimpleCheckbox name="NotApproval" type="checkbox" />
              &nbsp;{t("NotApproval")}
            </div>
          </div>

          <div
            className="row"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div className="col-md-1 col-sm-6 col-xs-12">
              <button
                type="button"
                className="btn btn-block btn-success btn-sm"
              >
                {t("Add")}
              </button>
            </div>
            <div className="col-md-1 col-sm-6 col-xs-12">
              <button
                type="button"
                className="btn btn-block btn-primary btn-sm"
              >
                {t("Report")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="box">
        <div className="box-header with-border">
          <h3 className="box-title text-center">
            {t("All Selected Approval")}
          </h3>
          &nbsp;&nbsp;
          <a style={{ cursor: "pointer" }}>{t("Search All")}</a>
        </div>
        <div
          className="box-body divResult boottable table-responsive"
          id="no-more-tables"
        >
          <div className="row">
            <table
              className="table table-bordered table-hover table-striped tbRecord"
              cellPadding="{0}"
              cellSpacing="{0}"
            >
              <thead className="cf text-center" style={{ zIndex: 99 }}>
                <tr>
                  <th className="text-center">{t("Employee Name")}</th>
                  <th className="text-center">{t("Authority Type")}</th>
                  <th className="text-center">{t("Approval")}</th>
                  <th className="text-center">{t("Created By")}</th>
                  <th className="text-center">{t("Created Date")}</th>
                  <th className="text-center">{t("Remove")}</th>
                </tr>
              </thead>

              <tbody></tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default CouponManageApproval;
