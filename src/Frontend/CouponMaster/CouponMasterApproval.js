import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SelectBox } from "../../ChildComponents/SelectBox";
import DatePicker from "../Components/DatePicker";
import Input from "../../ChildComponents/Input";
// import Loading from "../util/Loading";
import Loading from "../../util/Loading";
import CouponMasterReject from "./CouponMasterReject";
import ViewCentre from "./ViewCentre";
import ViewCoupon from "./ViewCoupon";
import ViewTest from "./ViewTest";
const CouponMasterApproval = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    Status: "",
    CouponType: "",
    CouponName: "",
  });

  const [show, setShow] = useState({
    rejectShow: false,
    ViewCentre: false,
    ViewTest: false,
    ViewCoupon: false,
  });

  const dateSelect = (date, name) => {
    setFormData({ ...formData, [name]: date });
  };
  const formChangeHandler = (e) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSearch = () => {
    console.log(formData);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };
  return (
    <>
      <CouponMasterReject show={show} setShow={setShow} />
      <ViewCentre show={show} setShow={setShow} />
      <ViewCoupon show={show} setShow={setShow} />
      <ViewTest show={show} setShow={setShow} />
      <div className="box with-border">
        <div className="box box-header with-border box-success">
          <h3 className="box-title text-center">
            {t("Coupon Master Approval")}
          </h3>
        </div>

        <div className="box-body">
          <div className="row">
            <label className="col-sm-2" style={{ textAlign: "end" }}>
              {t("From Date")} :
            </label>
            <div className="col-sm-2">
              <DatePicker
                name="FromDate"
                className="form-control input-sm"
                date={formData?.FromDate}
                onChange={dateSelect}
                maxDate={formData?.ToDate}
              />
            </div>

            <label className="col-sm-2" style={{ textAlign: "end" }}>
              {t("To Date")} :
            </label>
            <div className="col-sm-2">
              <DatePicker
                name="ToDate"
                className="form-control input-sm"
                date={formData?.ToDate}
                onChange={dateSelect}
                minDate={formData?.FromDate}
              />
            </div>
            <label className="col-sm-2" style={{ textAlign: "end" }}>
              {t("Status")} :
            </label>
            <div className="col-sm-2">
              <SelectBox
                name="Status"
                className="form-control input-sm"
                // options={DateType}
                onChange={formChangeHandler}
                selectedValue={formData?.Status}
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-2" style={{ textAlign: "end" }}>
              {t("Coupon Type")} :
            </label>
            <div className="col-sm-2">
              <SelectBox
                name="CouponType"
                className="form-control input-sm"
                // options={DateType}
                onChange={formChangeHandler}
                selectedValue={formData?.CouponType}
              />
            </div>
            <label className="col-sm-2" style={{ textAlign: "end" }}>
              {t("Coupon Name")} :
            </label>

            <div className="col-sm-2">
              <Input
                className="select-input-box form-control input-sm"
                type="text"
                autoComplete="off"
                placeholder="Coupon Name"
                name="CouponName"
                value={formData?.CouponName}
                onChange={formChangeHandler}
              />
            </div>
          </div>
          <br></br>
          <div
            className="row"
            style={{ display: "flex", justifyContent: "space-around" }}
          >
            <div className="col-sm-2" style={{ textAlign: "end" }}>
              {loading ? (
                <Loading />
              ) : (
                <button
                  type="button"
                  className="btn btn-block btn-success btn-sm"
                  onClick={handleSearch}
                >
                  {t("Search")}
                </button>
              )}
            </div>

            <div
              className="col-sm-4"
              style={{
                display: "flex",
                justifyContent: "space-between",
                flexWrap: "wrap",
              }}
            >
              <div>
                <button
                  style={{
                    marginTop: "2px",
                    height: "14px",
                    border: "1px solid",
                    backgroundColor: "bisque",
                  }}
                ></button>
                &nbsp;&nbsp;
                <label className="control-label">
                  {t("Made")}&nbsp;&nbsp;&nbsp;
                </label>
              </div>
              <div>
                <button
                  style={{
                    marginTop: "2px",
                    height: "14px",
                    border: "1px solid",
                    backgroundColor: "Pink",
                  }}
                ></button>
                &nbsp;&nbsp;
                <label className="control-label">{t("Checked")}</label>
              </div>
              <div>
                <button
                  style={{
                    marginTop: "2px",
                    height: "14px",
                    border: "1px solid",
                    backgroundColor: "#90EE90",
                  }}
                ></button>
                &nbsp;&nbsp;
                <label className="control-label">{t("Approved")}</label>
              </div>
              <div>
                <button
                  style={{
                    marginTop: "2px",
                    height: "14px",
                    border: "1px solid",
                    backgroundColor: "#FF5722",
                  }}
                ></button>
                &nbsp;&nbsp;
                <label className="control-label">{t("Rejected")}</label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="box">
        <div className="box-header">
          <h3 className="box-title text-center">{t("Coupon Detail")}</h3>
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
                  <th className="text-center">{t("S.No")}</th>
                  <th className="text-center">{t("Coupon Name")}</th>
                  <th className="text-center">{t("Coupon Type")}</th>
                  <th className="text-center">{t("Discount Share Type")}</th>
                  <th className="text-center">{t("Valid From")}</th>
                  <th className="text-center">{t("Valid To")}</th>
                  <th className="text-center">{t("Min. Billing Amount")}</th>
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

      <button
        onClick={() => {
          setShow({ ...show, rejectShow: true });
        }}
      >
        Check
      </button>
      <button
        onClick={() => {
          setShow({ ...show, ViewCentre: true });
        }}
      >
        Check1
      </button>
      <button
        onClick={() => {
          setShow({ ...show, ViewCoupon: true });
        }}
      >
        Check2
      </button>
      <button
        onClick={() => {
          setShow({ ...show, ViewTest: true });
        }}
      >
        Check3
      </button>
    </>
  );
};

export default CouponMasterApproval;
