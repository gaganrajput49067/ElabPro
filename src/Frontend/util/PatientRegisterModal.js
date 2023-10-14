import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { DoctorSchema } from "../../ValidationSchema";
import { number } from "./Commonservices/number";
import Input from "../../ChildComponents/Input";
import { useTranslation } from "react-i18next";

const initialValues = {
  Name: "",
  Mobile: "",
  DoctorCode: "",
};

const PatientRegisterModal = ({ show, handleClose }) => {
  const { values, errors, handleChange, touched, handleSubmit } = useFormik({
    initialValues: initialValues,
    validationSchema: DoctorSchema,
    onSubmit: (values,{resetForm}) => {
      axios
        .post("/api/v1/DoctorReferal/InsertDoctorReferal", values)
        .then((res) => {
          toast.success(res?.data?.message);
          handleClose();
          resetForm({values:""})
        })
        .catch((err) => console.log(err));
    },
  });
  const { t } = useTranslation();

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header className="modal-header">
          <Modal.Title className="modal-title">{t("Refer Doctor")}</Modal.Title>
          <button type="button" className="close" onClick={handleClose}>
            ×
          </button>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="box-body">
              <div className="row">
                <div className="col-sm-12">
                  <Input
                    className="select-input-box form-control input-sm"
                    placeholder={t("Doctor Code")}
                    type="number"
                    name="DoctorCode"
                    value={values.DoctorCode}
                    onChange={handleChange}
                  />
                  {errors?.DoctorCode && touched?.DoctorCode && (
                    <span className="golbal-Error">{errors?.DoctorCode}</span>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <Input
                    className="select-input-box form-control input-sm"
                    placeholder={t("Doctor Name")}
                    type="text"
                    name="Name"
                    value={values.Name}
                    onChange={handleChange}
                  />
                  {errors?.Name && touched?.Name && (
                    <span className="golbal-Error">{errors?.Name}</span>
                  )}
                </div>
              </div>
              <div className="row">
                <div className="col-sm-12">
                  <Input
                    className="select-input-box form-control input-sm"
                    placeholder={t("Mobile No")}
                    type="number"
                    name="Mobile"
                    onInput={(e) => number(e, 10)}
                    value={values.Mobile}
                    onChange={handleChange}
                    required
                  />
                  {errors?.Mobile && touched?.Mobile && (
                    <span className="golbal-Error">{errors?.Mobile}</span>
                  )}
                </div>
              </div>
              
            </div>
          </form>
          <div className="box-footer">
            <div className="row">
              <div className="col-sm-2">
                <button
                  className="btn btn-success btn-block btn-sm"
                  onClick={handleSubmit}
                >
                 {t("Save")} 
                </button>
              </div>
              <div className="col-sm-2">
                <button
                  className="btn btn-danger btn-block btn-sm"
                  onClick={handleClose}
                >
                 {t("Close")} 
                </button>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PatientRegisterModal;
