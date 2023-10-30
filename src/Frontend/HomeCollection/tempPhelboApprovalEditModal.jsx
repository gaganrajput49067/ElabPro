import React from "react";
import { useEffect } from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import DatePicker from "../Components/DatePicker";
import Input from "../../ChildComponents/Input";

// used in temprory phelbo approval
const TempPhelboApprovalEditModal = ({ show, handleClose, datas, id }) => {
  const [loading, setLoading] = useState(false); // This state is used for setting loading screen
  const [errors, setErros] = useState({}); // This state is used for setting errors
  const [data, setData] = useState({
    tempphelboid: id,
    JoinFromDate: datas?.JoinFromDate ?? new Date(),
    JoinToDate: datas?.JoinToDate ?? new Date(),
    User_Name: "",
    Password: "",
  });
  ////

  // for translation
  const { t } = useTranslation();

  const dateSelect = (date, name, value) => {
    const dates = moment(date).format("DD/MMM/YYYY");

    if (name === "JoinFromDate" || name === "JoinToDate") {
      setData({ ...data, [name]: dates });
    }
  };

  console.log(data);
  const handleSelectChange = async (event) => {
    const { name, value, checked, type } = event?.target;
    setData({ ...data, [name]: value });
  };

  const handleSave = (id) => {
    const generatedError = ValidationSchema(data);
    setLoading(true);

    if (generatedError === "") {
      axios
        .post("api/v1/TemporaryPheleboApproval/Approval", data)
        .then((res) => {
          let data = res.data.message;
          toast.success("Data saved Successfully");
          handleClose();
        })
        .catch((err) => {
          console.log(err);
        });
    }

    setErros(generatedError);
  };

  return (
    <Modal show={show} size="md">
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">
          Edit Temporary Phelbo Information
        </Modal.Title>
        <button type="button" className="close" onClick={handleClose}>
          x
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="box-body ">
          <div className="row">
            <label className="col-sm-3" htmlFor="Joining From Date">
              {t("Joining From Date")}:
            </label>
            <div className="col-sm-3">
              <DatePicker
                className="form-control input-sm"
                name="JoinFromDate"
                date={
                  data?.JoinFromDate ? new Date(data?.JoinFromDate) : new Date()
                }
                onChange={dateSelect}
                minDate={new Date()}
              />
            </div>
            <label className="col-sm-3" htmlFor="Joining To Date">
              {t("Joining To Date")}:
            </label>
            <div className="col-sm-3">
              <DatePicker
                className="form-control input-sm"
                name="JoinToDate"
                date={
                  data?.JoinToDate ? new Date(data?.JoinToDate) : new Date()
                }
                onChange={dateSelect}
                minDate={data?.JoinFromDate}
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-3" htmlFor="User Name">
              {t("User Name")}:
            </label>
            <div className="col-sm-3">
              <Input
                type="text"
                name="User_Name"
                className="select-input-box form-control input-sm"
                onChange={handleSelectChange}
                value={data.User_Name}
              />
              {data?.User_Name === "" && (
                <span className="golbal-Error">{errors?.User_Name}</span>
              )}
            </div>
            <label className="col-sm-3" htmlFor="Password">
              {t("Password")}:
            </label>
            <div className="col-sm-3">
              <Input
                type="password"
                name="Password"
                className="select-input-box form-control input-sm"
                onChange={handleSelectChange}
                value={data.Password}
              />
              {data?.Password === "" && (
                <span className="golbal-Error">{errors?.Password}</span>
              )}
            </div>
          </div>
          <div
            className="row"
            style={{ display: "flex", justifyContent: "Center" }}
          >
            <div className="col-sm-2 col-xs-12">
              <button
                type="button"
                className="btn btn-block btn-info btn-sm"
                onClick={handleSave}
              >
                {t("Save")}
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default TempPhelboApprovalEditModal;

const ValidationSchema = (formData) => {
  let err = "";
  if (formData?.User_Name.trim() === "") {
    err = { ...err, User_Name: "This Field is Required" };
  }

  if (formData?.Password.trim() === "") {
    err = { ...err, Password: "This Field is Required" };
  }

  return err;
};
