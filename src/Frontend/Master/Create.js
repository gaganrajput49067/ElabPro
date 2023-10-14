import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { validation } from "../../ValidationSchema";
import { getTrimmedData } from "../util/Commonservices";
import Input from "../../ChildComponents/Input";
import Loading from "../util/Loading";
import { useTranslation } from "react-i18next";

const Create = () => {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState({});
  const [formData, setFormData] = useState({
    Department: "",
    DepartmentCode: "",
    isActive: true,
    DepartmentID: 0,
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const { t } = useTranslation();
  const postData = () => {
    let generatedError = validation(formData);
    if (generatedError === "") {
        setLoading(true);
      axios
        .post(
          "/api/v1/Department/InsertDepartmentData",
          getTrimmedData(formData)
        )
        .then((res) => {
          if (res.data.message) {
            setLoading(false);
            navigate("/Departments");
            toast.success(res.data.message);
          } else {
            toast.error("Something went wrong");
            setLoading(false);
          }
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
            setLoading(false);
        });
    } else {
      setErr(generatedError);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h1 className="box-title">{t("Create New Department")}</h1>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("Department Code")}:</label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                placeholder="Department Code"
                maxLength={30}
                name={"DepartmentCode"}
                style={{ borderBottom: "1px solid #d62020" }}
                type="text"
                onChange={handleChange}
                value={formData.DepartmentCode}
              />
              <div
                className="field-validation-valid text-danger"
                data-valmsg-for="DepartmentCode"
                data-valmsg-replace="true"
              >
                {err?.DepartmentCode}
              </div>
            </div>
            <label className="col-sm-1">{t("Department Name")}:</label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                placeholder={t("Department Name")}
                maxLength={30}
                name="Department"
                style={{ borderBottom: "1px solid #d62020" }}
                type="text"
                onChange={handleChange}
                value={formData.Department}
              />
              <div
                className="field-validation-valid text-danger"
                data-valmsg-for="Department"
                data-valmsg-replace="true"
              >
                {err.Department}
              </div>
            </div>
            <div className="col-sm-1 d-flex">
              <Input
                name="isActive"
                type="checkbox"
                checked={formData?.isActive}
                onChange={handleChange}
              />
              <label className="control-label">{t("Active")}</label>
            </div>
            <div className="col-sm-1">
              {loading ? (
                <Loading />
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-block btn-info btn-sm"
                    id="btnSave"
                    title="Create"
                    onClick={postData}
                  >
                    {t("Create")}
                  </button>
                </>
              )}
            </div>
            <div className="col-sm-2">
              <Link to="/Departments" style={{ fontSize: "13px" }}>
                {t("Back to List")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
