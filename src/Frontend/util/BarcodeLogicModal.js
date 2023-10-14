import React from "react";
import { Modal } from "react-bootstrap";
import Input from "../../ChildComponents/Input";

import { useTranslation } from "react-i18next";
function BarcodeLogicModal({
  show,
  handleClose,
  value,
  Id,
  onChange,
  FindBarcode,
  Edit,
}) {
    const { t } = useTranslation();
  return (
    <Modal show={show}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">
          {t("Set Your BarCode Here")}:
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="box-body" id="DocModalData">
          <div className="row">
            <div className="col-sm-12 col-12">
              <Input
                type="text"
                value={value}
                onChange={(e) => {
                  onChange(e, Id);
                }}
                max={15}
                min={3}
                disabled={Edit && FindBarcode(Id)}
                className="select-input-box form-control input-sm"
              />
            </div>
          </div>
        </div>
        <div className="box-footer">
          <div className="row">
            <div className="col-sm-2">
              <button
                className="btn btn-block btn-success btn-sm"
                onClick={() => handleClose(value)}
              >
                {t("Set & Close")}
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default BarcodeLogicModal;
