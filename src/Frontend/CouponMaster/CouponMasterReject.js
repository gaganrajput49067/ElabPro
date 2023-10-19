import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Input from "../../ChildComponents/Input";
import { toast } from "react-toastify";
import axios from "axios";
const CouponMasterReject = ({ show, setShow }) => {
  const [reason, setReason] = useState("");
  const handleChange = (e) => {
    setReason(e.target.value);
  };

  const { t } = useTranslation();
  return (
    <>
      <Modal show={show?.rejectShow} size="sm">
        <div
          className="box-success"
          style={{ marginTop: "200px", backgroundColor: "transparent" }}
        >
          <Modal.Body>
            <div className="box-body">
              <div className="row">
                <label className="col-md-3" htmlFor="Remarks">
                  {t("Remark")} :
                </label>

                <div className="col-md-9">
                  <Input
                    className="select-input-box form-control input-sm"
                    type="text"
                    name="Reason"
                    value={reason}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <div className="box-body">
              <div
                className="row"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div className="col-md-6">
                  <button
                    type="button"
                    className="btn btn-primary btn-block btn-sm"
                  >
                    Save
                  </button>
                </div>
                <div className="col-md-6">
                  <button
                    type="button"
                    className="btn btn-danger btn-block btn-sm"
                    onClick={() => {
                      setShow({ ...show, rejectShow: false });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default CouponMasterReject;
