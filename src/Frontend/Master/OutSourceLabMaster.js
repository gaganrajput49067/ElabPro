import axios from "axios";
import { useFormik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { getTrimmedData } from "../../Frontend/util/Commonservices";
import { number } from "../../Frontend/util/Commonservices/number";
import Loading from "../../Frontend/util/Loading";
import { OutSourceLabMasterValidationSchema } from "../../ValidationSchema";

import { useTranslation } from "react-i18next";
const OutSourceLabMaster = () => {
  const [update, setUpdate] = useState(false);
  const [load, setLoad] = useState(false);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    OutSourceLabID: "",
    LabName: "",
    Address: "",
    ContactPersonName: "",
    PhoneNo: "",
    MobileNo: "",
    EmailID: "",
    isActive: "1",
  });
  const { t } = useTranslation();

  const getOutSourceLabData = () => {
    axios
      .get("/api/v1/OutSourceLabMaster/getAllOutSourceLabData", formData)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const editOutSourceLabMaster = (id) => {
    axios
      .post("/api/v1/OutSourceLabMaster/getAllOutSourceLabDataById", {
        OutSourceLabID: id,
      })
      .then((res) => {
        const data = res.data.message[0];
        setFormData(data);
      })
      .catch((err) => console.log(err));
  };

  const { errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: formData,
    enableReinitialize: true,
    validationSchema: OutSourceLabMasterValidationSchema,
    onSubmit: (values) => {
      setLoad(true);
      if (update === true) {
        axios
          .post(
            "/api/v1/OutSourceLabMaster/UpdateOutSourceLabData",
            getTrimmedData({
              ...values,
            })
          )
          .then((res) => {
            if (res.data.message) {
              setUpdate(false);
              setLoad(false);
              toast.success(res.data.message);
              setFormData({
                OutSourceLabID: "",
                LabName: "",
                Address: "",
                ContactPersonName: "",
                PhoneNo: "",
                MobileNo: "",
                EmailID: "",
                isActive: "1",
              });
              getOutSourceLabData();
            } else {
              toast.error("Something went wrong");
              setLoad(false);
            }
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
        setLoad(true);
        axios
          .post(
            "/api/v1/OutSourceLabMaster/InsertOutSourceLabData",
            getTrimmedData({
              ...values,
            })
          )
          .then((res) => {
            if (res.data.message) {
              setLoad(false);
              toast.success(res.data.message);
              setFormData({
                OutSourceLabID: "",
                LabName: "",
                Address: "",
                ContactPersonName: "",
                PhoneNo: "",
                MobileNo: "",
                EmailID: "",
                isActive: "1",
              });
              getOutSourceLabData();
            } else {
              toast.error("Something went wrong");
            }
          })
          .catch((err) => {
            toast.error(err.response.data.message);
            setLoad(false);
          });
      }
    },
  });

  console.log(errors);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  useEffect(() => {
    getOutSourceLabData();
  }, []);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h6 className="box-title">{t("OutSource Lab Master")}</h6>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("Lab Name")}:</label>
            <div className="col-sm-2">
              <Input
                placeholder={t("Lab Name")}
                className="form-control ui-autocomplete-input input-sm"
                type="text"
                name="LabName"
                onChange={handleChange}
                onBlur={handleBlur}
                value={formData?.LabName}
              />
              {errors?.LabName && touched?.LabName && (
                <div className="golbal-Error">{errors?.LabName}</div>
              )}
            </div>
            <label className="col-sm-1">{t("Contact Person Name")}:</label>
            <div className="col-sm-2">
              <Input
                placeholder={t("Contact Person Name")}
                className="form-control ui-autocomplete-input input-sm"
                type="text"
                name="ContactPersonName"
                onChange={handleChange}
                value={formData?.ContactPersonName}
              />
              {errors?.ContactPersonName && touched?.ContactPersonName && (
                <div className="golbal-Error">{errors?.ContactPersonName}</div>
              )}
            </div>
            <label className="col-sm-1">{t("Address")}:</label>
            <div className="col-sm-2">
              <Input
                placeholder={t("Address")}
                className="form-control ui-autocomplete-input input-sm"
                name="Address"
                onChange={handleChange}
                type="text"
                value={formData?.Address}
              />
            </div>
            <label className="col-sm-1">{t("Phone No")}:</label>
            <div className="col-sm-2">
              <Input
                placeholder={t("Phone No")}
                className="form-control ui-autocomplete-input input-sm"
                name="PhoneNo"
                onChange={handleChange}
                type="number"
                value={formData?.PhoneNo}
                onInput={(e) => number(e, 15)}
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1">{t("Mobile No")}:</label>
            <div className="col-sm-2">
              <Input
                placeholder={t("Mobile No")}
                className="form-control ui-autocomplete-input input-sm"
                name="MobileNo"
                onChange={handleChange}
                value={formData?.MobileNo}
                type="number"
                onBlur={handleBlur}
                onInput={(e) => number(e, 10)}
              />
              {errors?.MobileNo && touched?.MobileNo && (
                <div className="golbal-Error">{errors?.MobileNo}</div>
              )}
            </div>
            <label className="col-sm-1">{t("Email ID")}:</label>
            <div className="col-sm-2">
              <Input
                placeholder={t("Email ID")}
                className="form-control ui-autocomplete-input input-sm"
                name="EmailID"
                onChange={handleChange}
                value={formData?.EmailID}
                type="email"
                required
              />
            </div>

            <div className="col-sm-1">
              <Input
                name="isActive"
                type="checkbox"
                checked={formData?.isActive}
                onChange={handleChange}
              />
              <label className="control-label" htmlFor="isActive">
                {t("Active")}
              </label>
            </div>
            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button
                  type="submit"
                  className="btn btn-block btn-success btn-sm"
                  onClick={handleSubmit}
                >
                  {update ? t("Update") : t("Create")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div
          className=" box-body divResult table-responsive boottable"
          id="no-more-tables"
        >
          {data.length > 0 ? (
            <table
              className="table table-bordered table-hover table-striped tbRecord"
              cellPadding="{0}"
              cellSpacing="{0}"
            >
              <thead className="cf">
                <tr>
                  <th>{t("S.No")}</th>
                  <th>{t("Lab Name")}</th>
                  <th>{t("Address")}</th>
                  <th>{t("Phone No")}</th>
                  <th>{t("Mobile No")}</th>
                  <th>{t("Contact Person Name")}</th>
                  <th>{t("Active")}</th>
                  <th>{t("Created By")}</th>
                  <th>{t("Created On")}</th>
                  <th>{t("Action")}</th>
                </tr>
              </thead>
              <tbody>
                {data.map((data, i) => (
                  <tr key={i}>
                    <td data-title={t("S.No")}>{i + 1}&nbsp;</td>
                    <td data-title={t("Lab Name")}>{data?.LabName}&nbsp;</td>
                    <td data-title={t("Address")}>{data?.Address}&nbsp;</td>
                    <td data-title={t("Phone No")}>{data?.PhoneNo}&nbsp;</td>
                    <td data-title={t("Mobile No")}>{data?.MobileNo}&nbsp;</td>
                    <td data-title={t("Contact Person Name")}>
                      {data?.ContactPersonName}&nbsp;
                    </td>
                    <td data-title={t("Active")}>
                      {data?.isActiveStatus}&nbsp;
                    </td>
                    <td data-title={t("Created By")}>
                      {data?.CreatedByName}&nbsp;
                    </td>
                    <td data-title={t("Created On")}>
                      {data?.dtEntry !== "0000-00-00 00:00:00"
                        ? moment(data?.FinancialYearStart).format("DD MMM YYYY")
                        : "-"}
                      &nbsp;
                    </td>

                    <td data-title={t("Edit")}>
                      <button
                        onClick={() => {
                          editOutSourceLabMaster(data?.OutSourceLabID);
                          setUpdate(true);
                        }}
                      >
                        {t("Edit")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            " No Data Found"
          )}
        </div>
      )}
    </>
  );
};

export default OutSourceLabMaster;
