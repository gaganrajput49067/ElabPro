import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Input from "../../ChildComponents/Input";
import axios from "axios";
import { toast } from "react-toastify"
const HCHistoryCancelModal = ({ showCancel, handleCloseCancel, details }) => {
  const { t } = useTranslation();

  const [cancelreason, setReason] = useState('')
  const handleCancel = () => {
    console.log(cancelreason)
     if(cancelreason!="")
     {
      const payload = {
        PreBookingId: details.PreBookingId,
        CancelReason:cancelreason
      }
      console.log(payload)
      axios.post('api/v1/HomeCollectionSearch/CancelAppointment',payload).then((res)=>{
         if(res.data)
         {
          toast.success(res?.data?.message)
           handleCloseCancel()
         }   
        
  
      }).catch((err)=>{
        toast.error('Could not Cancel')
      })
    }
  else
     {
          toast.error('Enter Cancel Reason')
     }
    }
  return (
    <>
      <Modal
        show={showCancel}
        style={{backgroundColor:'black'}}
        id="CancelModal"
      >
        <div className="box-success" style={{ marginTop: "200px", backgroundColor: "transparent" }}>
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
                  {t("PreBooking ID")}  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                </label>
                <div className="col-sm-12 col-md-9"> <span>{details.PreBookingId}</span></div>
              </div>
              <div className="row">
                <label className="col-sm-12  col-md-3" htmlFor="AppointmentDate">
                  {t("Appointment Date")}&nbsp;&nbsp;:
                </label>
                <div className="col-sm-12 col-md-9"><span>{details.AppDate}</span></div>
              </div>

              <div className="row">
                <label className="col-sm-12  col-md-3" htmlFor="Cancel Reason">
                  {t("Cancel Reason")} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
                </label>

                <div className="col-sm-12 col-md-9">
                  <Input
                    className="select-input-box form-control input-sm"
                    type="text"
                    name="Cancel Reason"
                    value={cancelreason}
                    onChange={(e) => {
                      setReason(e.target.value)
                    }}
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
                      handleCancel()
                     }

                    }
                  >
                    {t("Cancel")}
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

export default HCHistoryCancelModal;
