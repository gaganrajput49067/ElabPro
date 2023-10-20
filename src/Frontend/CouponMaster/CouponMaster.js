import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { SimpleCheckbox } from "../../ChildComponents/CheckBox";
import DatePicker from "../Components/DatePicker";
const CouponMaster = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({});
  const [errors, setErros] = useState();
  const [billingType, setBillingType] = useState("Total Bill");

  const handleSelectChange = () => {};
  const handleRadioChange = (event) => {
    setBillingType(event.target.value);
  };
  return (
    <>
      <div className="box form-horizontal">
        <div className="box box-header with-border box-success">
          <h3 className="box-title text-center">{t("Coupon Master")}</h3>
        </div>
      </div>
      <div className="box form-horizontal">
        <div className=" box-header with-border">
          <h3 className="box-title text-center">{t("Centre/PUP Search")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Business Type")}:
            </label>
            <div className="col-sm-2" style={{ display: "flex" }}>
              <label className="col-sm-4">
                <Input type="radio" name="testsearchtype" value="InBetween" />
                All
              </label>
              <label className="col-sm-4">
                <Input type="radio" name="testsearchtype" value="InBetween" />
                COCO
              </label>
              <label className="col-sm-4">
                <Input type="radio" name="testsearchtype" value="InBetween" />
                FOFO
              </label>
            </div>

            <label className="col-sm-1">{t("Business Zone")}:</label>
            <div className="col-sm-2">
              <SelectBox className="input-sm" />
            </div>
            <label className="col-sm-1">{t("State")}:</label>
            <div className="col-sm-2">
              <SelectBox className="input-sm" />
            </div>
            <label className="col-sm-1">{t("City")}:</label>
            <div className="col-sm-2">
              <SelectBox className="input-sm" />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1">{t("Type")}:</label>
            <div className="col-sm-2">
              <SelectBox className="input-sm" />
            </div>
            <label className="col-sm-1">{t("Centre")}:</label>
            <div className="col-sm-2">
              <SelectBox className="input-sm" />
            </div>
          </div>
        </div>
      </div>
      <div className="box form-horizontal">
        <div className=" box-header with-border">
          <h3 className="box-title text-center">{t("Coupon Entry")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Coupon Name")}:
            </label>
            <div className="col-sm-2" style={{ display: "flex" }}>
              <Input className="form-control input-sm" />
            </div>
            <label className="col-sm-1">{t("Coupon Type")}:</label>
            <div className="col-sm-2">
              <SelectBox className="input-sm" />
            </div>
            <label className="col-sm-1">{t("From Date")}:</label>
            <div className="col-sm-2">
              <DatePicker className="input-sm" />
            </div>
            <label className="col-sm-1">{t("To Date")}:</label>
            <div className="col-sm-2">
              <DatePicker className="input-sm" />
            </div>
          </div>
          <div className="row">
            <div
              className="col-sm-3"
              style={{ display: "flex", justifyContent: "space-between" }}
            >
              <div>
                <label htmlFor="IsActive" className="control-label">
                  {t("For Multiple Patient")}&nbsp;
                </label>
                <SimpleCheckbox name="IsActive" type="checkbox" />
              </div>

              <div>
                <label htmlFor="IsActive" className="control-label">
                  {t("For One Time Patient")}&nbsp;
                </label>
                <SimpleCheckbox name="IsActive" type="checkbox" />
              </div>
            </div>

            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Coupon Count")}:
            </label>
            <div className="col-sm-2" style={{ display: "flex" }}>
              <Input className="form-control input-sm" />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Min Billing Amt")}:
            </label>
            <div className="col-sm-2" style={{ display: "flex" }}>
              <Input className="form-control input-sm" />
            </div>
            <label className="col-sm-1">
              <input
                type="radio"
                name="billingType"
                value="Total Bill"
                checked={billingType === "Total Bill"}
                onChange={handleRadioChange}
              />
              Total Bill
            </label>
            <label className="col-sm-2">
              <input
                type="radio"
                name="billingType"
                value="TestWise Bill"
                checked={billingType === "TestWise Bill"}
                onChange={handleRadioChange}
              />
              TestWise Bill
            </label>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Disc Share Type")}:
            </label>
            <div className="col-sm-2" style={{ display: "flex" }}>
              <SelectBox className="form-control input-sm" />
            </div>
          </div>
          {billingType === "TestWise Bill" && (
            <>
              <div className="row">
                <label className="col-sm-1">{t("Department")}:</label>
                <div className="col-sm-2">
                  <SelectBox className="input-sm" />
                </div>
                <label className="col-sm-1">{t("Test")}:</label>
                <div className="col-sm-3">
                  <SelectBox className="input-sm" />
                </div>
                <div className="col-sm-1">
                  <button
                    type="button"
                    className="btn btn-block btn-primary btn-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="box">
                <div className="row">
                  <div className="col-sm-2">
                    <span>Add Test</span>
                  </div>
                </div>
                <div className="row">
                  <table
                    className="table table-bordered table-hover table-striped tbRecord"
                    cellPadding="{0}"
                    cellSpacing="{0}"
                  >
                    <thead className="cf text-center" style={{ zIndex: 99 }}>
                      <tr>
                        <th className="text-center">{t("Test Code")}</th>
                        <th className="text-center">{t("Test Name")}</th>
                        <th className="text-center">{t("Department")}</th>
                        <th className="text-center">{t("Disc% All")}</th>
                        <th className="text-center">{t("Disc Amt all")}</th>
                        <th className="text-center">{t("Action")}</th>
                      </tr>
                    </thead>
                  </table>
                </div>
              </div>
            </>
          )}

          {billingType === "Total Bill" && (
            <div className="row">
              <label className="col-sm-1">{t("Discount Amount")}:</label>
              <div className="col-sm-2" style={{ display: "flex" }}>
                <Input className="form-control input-sm" />
              </div>
              <label className="col-sm-1">{t("Discount")}%:</label>
              <div className="col-sm-2" style={{ display: "flex" }}>
                <Input className="form-control input-sm" />
              </div>
            </div>
          )}
          <div className="box form-horizontal">
            <div className=" box-header with-border">
              <h3 className="box-title text-center">{t("Add Coupon Code")}:</h3>
            </div>
            <div className="box-body">
              <div className="row">
                <div className="col-sm-3">
                  <Input className="form-control input-sm" />
                </div>
                <div className="col-sm-6">
                  <a style={{ color: "red" }}>
                    * Enter Coupon Code Seprated by Comma(,) Or Download Excel
                    and Fill It and Press Upload Button
                  </a>
                </div>
                <div className="col-sm-1">
                  <button
                    type="button"
                    className=" btn btn-block btn-primary btn-sm "
                  >
                    Download
                  </button>
                </div>
                <div className="col-sm-1">
                  <button
                    type="button"
                    className=" btn btn-block btn-primary btn-sm "
                  >
                    Upload
                  </button>
                </div>
              </div>
              <div
                className="row"
                style={{ display: "flex", alignContent: "center" }}
              >
                <div className="col-md-1 col-sm-6 col-xs-12">
                  <button
                    type="button"
                    className="btn btn-block btn-success btn-sm"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="box">
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
                      <th className="text-center">{t("S.No")}</th>
                      <th className="text-center">{t("Coupon Name")}</th>
                      <th className="text-center">{t("Coupon Type")}</th>
                      <th className="text-center">
                        {t("Discount Share Type")}
                      </th>
                      <th className="text-center">{t("Valid From")}</th>
                      <th className="text-center">{t("Valid To")}</th>
                      <th className="text-center">
                        {t("Min. Billing Amount")}
                      </th>
                      <th className="text-center">{t("Issue For")}</th>
                      <th className="text-center">{t("Applicable")}</th>
                      <th className="text-center">{t("Discount Amt.")}</th>
                      <th className="text-center">{t("Discount(%)")}</th>
                      <th className="text-center">{t("Multiple Coupon")}</th>
                      <th className="text-center">{t("TotalCoupon")}</th>
                      <th className="text-center">{t("UsedCoupon")}</th>
                      <th className="text-center">{t("Rem.Coupon")}</th>
                      <th className="text-center">{t("View Center/PUP")}</th>
                      <th className="text-center">{t("View Test")}</th>
                      <th className="text-center">{t("View Coupon")}</th>
                      <th className="text-center">{t("#")}</th>
                      <th className="text-center">{t("Reject")}</th>
                      <th className="text-center">{t("Edit")}</th>
                    </tr>
                  </thead>

                  <tbody></tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CouponMaster;
