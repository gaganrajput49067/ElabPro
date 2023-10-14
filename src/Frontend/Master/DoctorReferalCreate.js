import axios from "axios";
import { useFormik } from "formik";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CreateSpecialization,
  Degree,
  Locality,
  Zone,
} from "../../ChildComponents/Constants";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  getPaymentModes,
  getTrimmedData,
} from "../../Frontend/util/Commonservices";
import { number } from "../../Frontend/util/Commonservices/number";
import Loading from "../../Frontend/util/Loading";
import { DocotorReferal } from "../../ValidationSchema";

import { useTranslation } from "react-i18next";
function DoctorReferalCreate() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = location;
  const [Title, setTitle] = useState([]);
  const [Specialization, setSpecialization] = useState([]);
  const [load, setLoad] = useState(false);
  const [payload, setPayload] = useState({
    DoctorCode: "",
    Title: "",
    Name: "",
    ClinicName: "",
    Email: "",
    Address: "",
    Phone: "",
    Mobile: "",
    Specialization: CreateSpecialization[0]?.value,
    Degree: Degree[0]?.value,
    Zone: Zone[0]?.value,
    Locality: Locality[0]?.value,
    isActive: 1,
  });

  const { t } = useTranslation();
  
  const { values, errors, handleChange, handleBlur, touched, handleSubmit } =
    useFormik({
      initialValues: payload,
      // enableReinitialize: state?.url ? true : false,
      enableReinitialize: true,
      validationSchema: DocotorReferal,
      onSubmit: (values) => {
        setLoad(true);
        axios
          .post(
            state?.url1
              ? state?.url1
              : "/api/v1/DoctorReferal/SaveDoctorReferal",
            getTrimmedData(values)
          )
          .then((res) => {
            setLoad(false);
            toast.success(res?.data?.message);
            navigate("/DoctorReferal");
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "error occured"
            );
            setLoad(false);
          });
      },
    });
  const getDropDownData = (name) => {
    axios
      .post("/api/v1/Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        // value.unshift({ label: "Title", value: "" });
        setTitle(value);
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange = (e) => {
    const { value, name } = e.target;
    setPayload({ ...values, [name]: value });
  };

  useEffect(() => {
    getDropDownData("Title");
  }, []);

  const handleChanges = (e) => {
    const { name, value, checked, type } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const fetch = () => {
    axios
      .post(state?.url, {
        DoctorReferalID: state?.id,
      })
      .then((res) => {
        setPayload(res?.data?.message[0]);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "error occured"
        );
      });
  };

  useEffect(() => {
    getPaymentModes("specialization", setSpecialization);
  }, []);

  console.log(Specialization);

  useEffect(() => {
    if (state) {
      fetch();
    }
  }, []);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("DoctorReferal Detail")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("DoctorCode")}:</label>
            <div className="col-sm-2 ">
              <Input
                placeholder={t("DoctorCode")}
                type="text"
                className="form-control ui-autocomplete-input input-sm"
                value={values?.DoctorCode}
                name="DoctorCode"
                max={50}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors?.DoctorCode && touched?.DoctorCode && (
                <span className="golbal-Error">{errors?.DoctorCode}</span>
              )}
            </div>

            <label className="col-sm-1">{t("Title")}:</label>
            <div className="col-sm-2">
              <SelectBox
                options={[{ label: "Select title", value: "" }, ...Title]}
                name="Title"
                selectedValue={payload?.Title}
                onChange={(e)=>handleSelectChange(e,values)}
                id="Title"
              />
              {errors?.Title && touched?.Title && (
                <span className="golbal-Error">{errors?.Title}</span>
              )}
            </div>

            <label className="col-sm-1">{t("Name")}:</label>
            <div className="col-sm-2">
              <div>
                <Input
                  type="text"
                  placeholder={t("Name")}
                  className="form-control ui-autocomplete-input input-sm"
                  name="Name"
                  max={75}
                  value={values?.Name}
                  onChange={handleChange}
                />
                {errors?.Name && touched?.Name && (
                  <span className="golbal-Error">{errors?.Name}</span>
                )}
              </div>
            </div>

            <label className="col-sm-1">{t("ClinicName")}:</label>
            <div className="col-sm-2">
              <div>
                <Input
                  placeholder={t("ClinicName")}
                  type="text"
                  className="form-control ui-autocomplete-input input-sm"
                  name="ClinicName"
                  max={75}
                  value={values?.ClinicName}
                  onChange={handleChange}
                />
                {errors?.ClinicName && touched?.ClinicName && (
                  <span className="golbal-Error">{errors?.ClinicName}</span>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1">{t("Email")}:</label>
            <div className="col-sm-2">
              <div>
                <Input
                  placeholder={t("Email")}
                  type="email"
                  className="form-control ui-autocomplete-input input-sm"
                  name="Email"
                  max={50}
                  value={values?.Email}
                  onChange={handleChange}
                />
                {errors?.Email && touched?.Email && (
                  <span className="golbal-Error">{errors?.Email}</span>
                )}
              </div>
            </div>
            <label className="col-sm-1">{t("Address")}:</label>
            <div className="col-sm-2">
              <Input
                placeholder={t("Address")}
                type="text"
                max={200}
                className="form-control ui-autocomplete-input input-sm"
                name="Address"
                value={values?.Address}
                onChange={handleChange}
              />
            </div>
            <label className="col-sm-1">{t("Phone")}:</label>
            <div className="col-sm-2">
              <Input
                placeholder={t("Phone")}
                type="number"
                className="form-control ui-autocomplete-input input-sm"
                name="Phone"
                onInput={(e) => number(e, 10)}
                value={payload?.Phone}
                onChange={handleChanges}
              />
            </div>

            <label className="col-sm-1">{t("Mobile")}:</label>
            <div className="col-sm-2">
              <div>
                <Input
                  placeholder={t("Mobile")}
                  type="number"
                  className="form-control ui-autocomplete-input input-sm"
                  name="Mobile"
                  onInput={(e) => number(e, 10)}
                  value={values?.Mobile}
                  onChange={handleChange}
                />
                {errors?.Mobile && touched?.Mobile && (
                  <span className="golbal-Error">{errors?.Mobile}</span>
                )}
              </div>
            </div>
          </div>

          <div className="row">
            <label className="col-sm-1">{t("Specialization")}:</label>
            <div className="col-sm-2">
              <SelectBox
                className="required"
                name="Specialization"
                options={CreateSpecialization}
                selectedValue={payload?.Specialization}
                id="Specialization"
                onChange={handleSelectChange}
              />
              {errors?.Specialization && touched?.Specialization && (
                <span className="golbal-Error">{errors?.Specialization}</span>
              )}
            </div>

            <label className="col-sm-1">{t("Degree")}:</label>
            <div className="col-sm-2">
              <SelectBox
                options={Degree}
                name="Degree"
                selectedValue={payload?.Degree}
                id="Degree"
                onChange={handleSelectChange}
              />
              {errors?.Degree && touched?.Degree && (
                <span className="golbal-Error">{errors?.Degree}</span>
              )}
            </div>
            <label className="col-sm-1">{t("Zone")}:</label>
            <div className="col-sm-2">
              <SelectBox
                options={[{ label: "Select Zone", value: "" }, ...Zone]}
                name="Zone"
                selectedValue={payload?.Zone}
                onChange={handleSelectChange}
              />
              {errors?.Zone && touched?.Zone && (
                <span className="golbal-Error">{errors?.Zone}</span>
              )}
            </div>
            <label className="col-sm-1">{t("Locality")}:</label>
            <div className="col-sm-2">
              
              <SelectBox
                options={Locality}
                name="Locality"
                selectedValue={payload?.Locality}
                onChange={handleSelectChange}
              />
              {errors?.Locality && touched?.Locality && (
                <span className="golbal-Error">{errors?.Locality}</span>
              )}
            </div>
          </div>

          <div className="box-footer">
            <div className="row">
              <div className="col-sm-1">
                <Input
                  type="checkbox"
                  checked={payload?.isActive}
                  onChange={handleChanges}
                  name="isActive"
                />
                <label>{t("Active")}</label>
              </div>
              <div className="col-sm-1">
                {load ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-block btn-success btn-sm"
                    onClick={handleSubmit}
                  >
                    {state?.url1 ? t("Update") : t("Save")}
                  </button>
                )}
              </div>
              <div className="col-sm-2">
                <Link to="/DoctorReferal">{t("Back to List")}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DoctorReferalCreate;
