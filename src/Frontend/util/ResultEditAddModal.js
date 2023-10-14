import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import TextEditor from "../Master/Report/TextEditor";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function ResultEditAddModal({ show, handleClose, handleSave }) {
  const [EditTable, setEditTable] = useState(false);
  const [EditData, setEditData] = useState(show?.data);
  const [SelectedBox, setSelectedBox] = useState([]);
  console.log(show?.data);
  // i18n start

  const { t } = useTranslation();

  // i18n end
  const getInvestigationsListData = () => {
    axios
      .post("/api/v1/InvestigationCommentMaster/getInvestigationCommentData", {
        InvestigationID: show?.data?.labObservationID,
        Template: "",
        TemplateText: "",
      })
      .then((res) => {
        if (res.status === 200) {
          setSelectedBox(res.data.message);
        }
        if (res?.data?.message.length === 0) {
          toast.success(t("No Data Found"));
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDropdown = (e) => {
    const { value } = e.target;
    setEditData({ ...EditData, COMMENT: value });
  };

  useEffect(() => {
    getInvestigationsListData();
  }, []);

  const handleChange = (data) => {
    setEditData({ ...EditData, COMMENT: data });
  };

  return (
    <Modal show={show?.moadal} onHide={handleClose}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title" />
        <button type="button" className="close" onClick={handleClose}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="box-body">
          <div className="row">
            <div className="col-12">
              <div className="mb-3">
                <label>{t("Select Comment")}:</label>
                <select
                  className="select-input-box form-control input-sm"
                  onChange={handleDropdown}
                >
                  <option>{t("Select")}</option>
                  {SelectedBox?.map((ele) => (
                    <option value={ele?.TemplateText}>{ele?.Template}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="col-12">
              <TextEditor
                value={EditData?.COMMENT}
                EditTable={EditTable}
                setEditTable={setEditTable}
                setValue={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-sm-2">
              <button
                type="button"
                className="btn btn-block btn-success btn-sm"
                onClick={() => handleSave(EditData, "AddComment")}
              >
                {t("Save")}
              </button>
            </div>
            <div className="col-sm-2">
              <button
                type="button"
                className="btn btn-block btn-danger btn-sm"
                onClick={handleClose}
              >
                {t("Close")}
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ResultEditAddModal;
