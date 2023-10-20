import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SelectBox } from "../../ChildComponents/SelectBox";
import DatePicker from "../Components/DatePicker";
import Input from "../../ChildComponents/Input";
import Loading from "../util/Loading";
import CouponMasterReject from "./CouponMasterReject";
import ViewCentre from "./ViewCentre";
import ViewCoupon from "./ViewCoupon";
import ViewTest from "./ViewTest";
import CouponMasterEdit from "./CouponMasterEdit";
import { toast } from "react-toastify";
const CouponMasterApproval = () => {
  const { t } = useTranslation();

  const StatusType = [
    {
      label: "Made",
      value: "Made",
    },
    {
      label: "Checked",
      value: "Checked",
    },
    {
      label: "Approved",
      value: "Approved",
    },
    {
      label: "Rejected",
      value: "Rejected",
    },
  ];
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    Status: "Made",
    CouponType: "",
    CouponName: "",
  });

  const [show, setShow] = useState({
    rejectShow: false,
    ViewCentre: false,
    ViewTest: false,
    ViewCoupon: false,
    Edit: false,
  });

  const dateSelect = (date, name) => {
    setFormData({ ...formData, [name]: date });
  };
  const formChangeHandler = (e) => {
    const { name, value } = e?.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleStatus = () => {
    toast.success("Done");
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
      <CouponMasterEdit show={show} setShow={setShow} />

      
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
                onChange={formChangeHandler}
                options={StatusType}
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
                  <th className="text-center">
                    <div>{t("Coupon")}</div>
                    <div>{t("Name")}</div>
                  </th>
                  <th className="text-center">
                    <div>{t("Coupon")}</div>
                    <div>{t("Type")}</div>
                  </th>
                  <th className="text-center">
                    <div>{t("Discount")}</div>
                    <div>{t("ShareType")}</div>
                  </th>
                  <th className="text-center">
                    <div>{t("Valid")}</div>
                    <div>{t("From")}</div>
                  </th>
                  <th className="text-center">
                    <div>{t("Valid")}</div>
                    <div>{t("To")}</div>
                  </th>
                  <th className="text-center">
                    <div>{t("Minimum")}</div>
                    <div>{t("BillingAmount")}</div>
                  </th>
                  <th className="text-center">
                    <div>{t("Issue")}</div>
                    <div>{t("For")}</div>
                  </th>
                  <th className="text-center">{t("Applicable")}</th>
                  <th className="text-center">
                    <div>{t("Discount")}</div>
                    <div>{t("Amount")}</div>
                  </th>
                  <th className="text-center">
                    <div>{t("Discount")}</div>
                    <div>{t("Percentage")}</div>
                  </th>
                  <th className="text-center">
                    <div>{t("Multiple")}</div>
                    <div>{t("Coupon")}</div>
                  </th>
                  <th className="text-center">
                    <div>{t("Total")}</div>
                    <div>{t("Coupon")}</div>
                  </th>
                  <th className="text-center">
                    <div>{t("Used")}</div>
                    <div>{t("Coupon")}</div>
                  </th>
                  <th className="text-center">
                    <div>{t("Remaining")}</div>
                    <div>{t("Coupon")}</div>
                  </th>
                  <th className="text-center">
                    <div>{t("ViewCentre/")}</div>
                    <div>{t("PUP")}</div>
                  </th>
                  <th className="text-center">
                    <div>{t("View")}</div>
                    <div>{t("Test")}</div>
                  </th>
                  <th className="text-center">
                    <div>{t("View")}</div>
                    <div>{t("Coupon")}</div>
                  </th>
                  <th className="text-center">{t("#")}</th>
                  <th className="text-center">{t("Reject")}</th>
                  <th className="text-center">{t("Edit")}</th>
                </tr>
              </thead>

              <tbody>
                <>
                  <td data-title="S.No" className="text-center">
                    &nbsp;NaN
                  </td>
                  <td data-title="Coupon Name" className="text-center">
                    &nbsp;NaN
                  </td>
                  <td data-title="Coupon Type" className="text-center">
                    &nbsp;NaN
                  </td>
                  <td data-title="Discount ShareType" className="text-center">
                    &nbsp;NaN
                  </td>
                  <td data-title="Valid From" className="text-center">
                    &nbsp;NaN
                  </td>
                  <td data-title="Valid To" className="text-center">
                    &nbsp;NaN
                  </td>
                  <td
                    data-title="Minimum BillingAmount"
                    className="text-center"
                  >
                    &nbsp;NaN
                  </td>
                  <td data-title="Issue For" className="text-center">
                    &nbsp;NaN
                  </td>
                  <td data-title="Applicable" className="text-center">
                    &nbsp;NaN
                  </td>
                  <td data-title="Discount Amount" className="text-center">
                    &nbsp;NaN
                  </td>
                  <td data-title="Discount(%)" className="text-center">
                    &nbsp;NaN
                  </td>
                  <td data-title="Multiple Coupon" className="text-center">
                    &nbsp;NaN
                  </td>
                  <td data-title="Total Coupon" className="text-center">
                    &nbsp;NaN
                  </td>
                  <td data-title="Used Coupon" className="text-center">
                    &nbsp;NaN
                  </td>
                  <td data-title="Remaining Coupon" className="text-center">
                    &nbsp;NaN
                  </td>
                  <td data-title="View Center/PUP" className="text-center ">
                    <div
                      className="fa fa-search"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setShow({ ...show, ViewCentre: true });
                      }}
                    ></div>
                  </td>
                  <td data-title="View Test" className="text-center">
                    <div
                      className="fa fa-search"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setShow({ ...show, ViewTest: true });
                      }}
                    ></div>
                  </td>
                  <td data-title="View Coupon" className="text-center">
                    <div
                      className="fa fa-search"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setShow({ ...show, ViewCoupon: true });
                      }}
                    ></div>
                  </td>
                  <td data-title="#" className="text-center">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={handleStatus}
                    >
                      Status
                    </button>
                  </td>
                  <td data-title="Reject" className="text-center">
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        setShow({ ...show, rejectShow: true });
                      }}
                    >
                      Reject
                    </button>
                  </td>
                  <td data-title="Edit" className="text-center">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => {
                        setShow({ ...show, Edit: true });
                      }}
                    >
                      Edit
                    </button>
                  </td>
                </>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default CouponMasterApproval;
