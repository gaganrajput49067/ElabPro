import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Input from "../../ChildComponents/Input";
import { toast } from "react-toastify";
import axios from "axios";
import { getTrimmedData } from "../util/Commonservices";
const AppointmentNotBookedModal = ({
  showPatientData,
  notBookedShow,
  handleNotBookedClose,
  handleCloseAppoint,
}) => {
  const [reason, setReason] = useState("");
  const handleChange = (e) => {
    setReason(e.target.value);
  };

  const handleReason = () => {
    if (reason.trim().length < 3) {
      toast.error("Remarks length must be 3");
    } else {
      axios
        .post("/api/v1/CustomerCare/savenotbookedreason", {
          savenotbookedreasonData: {
            uhid: showPatientData?.Patientid,
            Mobile: showPatientData?.Mobile,
            HouseNo: showPatientData?.HouseNo,
            LocalityID: showPatientData?.LocalityID,
            CityID: showPatientData?.CityID,
            StateID: showPatientData?.StateID,
            Pincode: showPatientData?.Pincode,
            Reason: reason.trim(),
          },
        })
        .then((res) => {
          toast.success(res?.data?.message);
          handleNotBookedClose();
          handleCloseAppoint();
        })
        .catch((err) => {
          toast.error(err);
        });
    }
  };
  const { t } = useTranslation();
  return (
    <>
      <Modal
        show={notBookedShow}
        style={{ backgroundColor: "black" }}
        id="AppNotBooked"
      >
        <div
          className="box-success"
          style={{ marginTop: "200px", backgroundColor: "transparent" }}
        >
          <Modal.Header
            className="modal-header"
            style={{ position: "sticky", zIndex: 1055, top: 0 }}
          >
            <Modal.Title className="modal-title">
              {t("Home Collection Not Booked Reason")}
            </Modal.Title>
            <button
              type="button"
              className="close"
              onClick={handleNotBookedClose}
            >
              ×
            </button>
          </Modal.Header>
          <Modal.Body>
            <div className="box-body">
              <div className="row">
                <label className="col-sm-12  col-md-2" htmlFor="Remarks">
                  {t("Remarks")} &nbsp;&nbsp;:
                </label>

                <div className="col-sm-12 col-md-10">
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
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-block btn-sm"
                    onClick={() => {
                      handleReason();
                    }}
                  >
                   {t("Save Reason")}
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

export default AppointmentNotBookedModal;
