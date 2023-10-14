import React from "react";
import { Modal } from "react-bootstrap";
import Input from "../../ChildComponents/Input";

function BarcodeLogicModal({
  show,
  handleClose,
  value,
  Id,
  onChange,
  FindBarcode,
  Edit,
}) {
  return (
    <Modal show={show}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">
          Set Your BarCode Here:
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-body" id="DocModalData">
          <div className="row">
            <div className="col-sm-6 col-12">
              <Input
                type="text"
                value={value}
                onChange={(e) => {
                  onChange(e, Id);
                }}
                max={15}
                min={3}
                disabled={Edit && FindBarcode(Id)}
                className="form-control"
              />
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary" onClick={() => handleClose(value)}>
          Set & Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default BarcodeLogicModal;
