import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { SelectBox } from "../../ChildComponents/SelectBox";
import DatePicker from "../Components/DatePicker";
import Input from "../../ChildComponents/Input";
// import Loading from "../util/Loading";
import Loading from "../../util/Loading";
import { SimpleCheckbox } from "../../ChildComponents/CheckBox";
import { toast } from "react-toastify";
import axios from "axios";
const AuthorityType = [
  {
    label: "Coupon",
    value: "Coupon",
  },
];
const CouponManageApproval = () => {
  const [formData, setFromData] = useState({
    EmployeeName: "",
    AuthorityType: "Coupon",
    Maker: 0,
    Checker: 0,
    Approval: 0,
    Reject: 0,
    StatusChange: 0,
    Edit: 0,
    NotApproval: 0,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFromData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleSave = () => {
    if (!formData?.EmployeeName) {
      toast.error("Please Select Any Employee");
    } else if (
      formData.Maker === 0 &&
      formData.Checker === 0 &&
      formData.Approval === 0 &&
      formData.Reject === 0 &&
      formData.StatusChange === 0 &&
      formData.Edit === 0 &&
      formData.NotApproval === 0
    ) {
      toast.error("Please Select Atleast One Approval Type");
    } else {
      console.log(formData);
      axios
        .post("", formData)
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
        });
    }
    // setFromData({
    //   ...formData,
    //   Maker: formData?.Maker ? 1 : 0,
    //   Checker: formData?.Checker ? 1 : 0,
    //   Approval: formData?.Approval ? 1 : 0,
    //   Reject: formData?.Reject ? 1 : 0,
    //   StatusChange: formData?.StatusChange ? 1 : 0,
    //   Edit: formData?.Edit ? 1 : 0,
    //   NotApproval: formData?.NotApproval ? 1 : 0,
    // });
  };

  const handleRemove = () => {
    toast.success("Removed");
  };
  const handleSearch = () => {
    axios
      .post("")
      .then((res) => {
        console.log(res)
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };
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
                value={formData?.EmployeeName}
                onChange={handleChange}
              />
            </div>

            <label className="col-sm-2" style={{ textAlign: "end" }}>
              {t("Authority Type")} :
            </label>
            <div className="col-sm-2">
              <SelectBox
                name="AuthorityType"
                className="form-control input-sm"
                onChange={handleChange}
                selectedValue={formData?.AuthorityType}
                options={AuthorityType}
              />
            </div>
          </div>

          <div className="row">
            <label className="col-sm-2" style={{ textAlign: "end" }}>
              {t("For Approval")} :
            </label>
            <div className="col-sm-1">
              <SimpleCheckbox
                name="Maker"
                type="checkbox"
                onChange={handleChange}
                checked={formData?.Maker}
              />
              &nbsp;{t("Maker")}
            </div>
            <div className="col-sm-1">
              <SimpleCheckbox
                name="Checker"
                type="checkbox"
                onChange={handleChange}
                checked={formData?.Checker}
              />
              &nbsp;{t("Checker")}
            </div>
            <div className="col-sm-1">
              <SimpleCheckbox
                name="Approval"
                type="checkbox"
                onChange={handleChange}
                checked={formData?.Approval}
              />
              &nbsp; {t("Approval")}
            </div>
            <div className="col-sm-1">
              <SimpleCheckbox
                name="Reject"
                type="checkbox"
                onChange={handleChange}
                checked={formData?.Reject}
              />
              &nbsp;{t("Reject")}
            </div>
            <div className="col-sm-2">
              <SimpleCheckbox
                name="StatusChange"
                type="checkbox"
                onChange={handleChange}
                checked={formData?.StatusChange}
              />
              &nbsp;{t("StatusChange")}
            </div>
            <div className="col-sm-1">
              <SimpleCheckbox
                name="Edit"
                type="checkbox"
                onChange={handleChange}
                checked={formData?.Edit}
              />
              &nbsp;{t("Edit")}
            </div>
            <div className="col-sm-2">
              <SimpleCheckbox
                name="NotApproval"
                type="checkbox"
                onChange={handleChange}
                checked={formData?.NotApproval}
              />
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
                onClick={handleSave}
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
          <a
            style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={handleSearch}
          >
            {t("Search All")}
          </a>
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

              <tbody>
                <td data-title="Employee Name" className="text-center">
                  &nbsp;NaN
                </td>
                <td data-title="Authority Type" className="text-center">
                  &nbsp;NaN
                </td>
                <td data-title="Approval" className="text-center">
                  &nbsp;NaN
                </td>
                <td data-title="Created By" className="text-center">
                  &nbsp;NaN
                </td>
                <td data-title="Created Date" className="text-center">
                  &nbsp;NaN
                </td>
                <td data-title="Remove" className="text-center">
                  &nbsp;
                  <span
                    style={{
                      fontSize: "13px",
                      color: "#8B0000",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                    onClick={handleRemove}
                  >
                    X
                  </span>
                </td>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default CouponManageApproval;
