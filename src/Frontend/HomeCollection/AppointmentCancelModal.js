import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Input from "../../ChildComponents/Input";

const AppointmentCancelModal = ({
  showCancel,
  handleCloseCancel,
  handleAppointment,
}) => {
  const { t } = useTranslation();
  return (
    <>
      <Modal show={showCancel} id="AppCancel">
        <div
         
          style={{ marginTop: "200px", backgroundColor: "transparent" }}
        >
          <Modal.Header className="modal-header">
            <Modal.Title className="modal-title">
              {t("Cancel Appointment")}
            </Modal.Title>
            <button type="button" className="close" onClick={handleCloseCancel}>
              ×
            </button>
          </Modal.Header>
          <Modal.Body>
            <div className="box-body">
              <div className="row">
                <label className="col-sm-12  col-md-3" htmlFor="PreBooking ID">
                  {t("PreBooking ID")} &nbsp;&nbsp;&nbsp;:
                </label>
                <div className="col-sm-12 col-md-2">fjbckbbwfibiw</div>
                <label
                  className="col-sm-12  col-md-5"
                  htmlFor="Appointment Date and Time"
                  style={{ textAlign: "end" }}
                >
                  {t("Appointment Date and Time")} :
                </label>
                <div className="col-sm-12 col-md-2">fjbckbbwfibiw</div>
              </div>
              <div className="row">
                <label className="col-sm-12  col-md-3" htmlFor="Cancel Reason">
                  {t("Cancel Reason")} &nbsp;&nbsp;&nbsp;&nbsp;:
                </label>

                <div className="col-sm-12 col-md-9">
                  <Input
                    className="select-input-box form-control input-sm"
                    type="text"
                    name="Cancel Reason"
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
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-block btn-sm"
                    onClick={() => {
                      handleAppointment();
                      handleCloseCancel();
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

export default AppointmentCancelModal;
