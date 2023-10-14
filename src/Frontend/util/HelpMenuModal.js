import axios from "axios";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { getTrimmedData } from "./Commonservices";
import Input from "../../ChildComponents/Input";
import { useTranslation } from "react-i18next";
const HelpMenuModal = ({
  show,
  handleClose,
  Edit,
  Value,
  getHelpMenu,
  state,
}) => {
  const [formData, setFormData] = useState(
    Edit
      ? {
          MenuName: state?.MenuName,
          IsActive: "1",
          MenuId: state?.HelpMenuId,
          isBold: "0",
        }
      : {
          MenuName: "",
          IsActive: "1",
          isBold: "0",
        }
  );

  const { t } = useTranslation();
  const AddHelp = () => {
    axios
      .post(
        Edit
          ? "/api/v1/Investigations/UpdateHelpMenu"
          : "/api/v1/Investigations/InsertHelpMenu",
        getTrimmedData(formData)
      )
      .then((res) => {
        if (res.data.message) {
          toast.success(res.data.message);
          handleClose();
          getHelpMenu();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  return (
    <Modal show={show}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">
          {Edit ? t("Update Help Menu") : t("Add New Help Menu")}
        </Modal.Title>
        <button
          type="button"
          className="close"
          onClick={() => {
            handleClose();
          }}
        >
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="box-body">
          <div className="row">
            <div className="co-12">
              <textarea
                className="width100p form-control"
                style={{ height: "100px" }}
                maxLength={200}
                type="text"
                placeholder={t("Please Enter Help Menu")}
                onChange={handleChange}
                name="MenuName"
                value={formData?.MenuName}
              ></textarea>
            </div>
          </div>
          <div>
            <Input
              type="checkbox"
              name="isBold"
              onChange={handleChange}
              checked={formData?.isBold === "1" ? true : false}
            />
            <label>IsBold</label>
          </div>
        </div>
        <div className="box-footer">
          <div className="row">
            <div className="col-sm-2">
              {Edit ? (
                <button
                  type="button"
                  className="btn btn-block btn-success btn-sm"
                  id="btnSave"
                  onClick={AddHelp}
                >
                  {t("Update")}
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-block btn-success btn-sm"
                  id="btnSave"
                  onClick={AddHelp}
                >
                  {t("Save")}
                </button>
              )}
            </div>
            <div className="col-sm-2">
              <button
                type="button"
                className="btn btn-block btn-danger btn-sm"
                id="btnSave"
                onClick={() => handleClose()}
              >
                {t("Close")}
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default HelpMenuModal;
