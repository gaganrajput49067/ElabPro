import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";

import { SelectBox } from "../../ChildComponents/SelectBox";

import DatePicker from "../Components/DatePicker";
const AppointmentRescheduleModal = ({
  showReschedule,
  handleCloseReschedule,
  handleAppointment,
  //   details
}) => {
  const { t } = useTranslation();
  //   console.log(details);
  //   const [Phelbos, setPhelbos] = useState([])
  //   const [payload,setPayload]=useState({
  //     AppDate: "",
  //     AppTime: "",
  //     PhelbotomistId:'',
  //   })
  //   const bindPhelbo = () => {
  //     axios
  //         .get("/api/v1/HomeCollectionSearch/BindPhelebo")
  //         .then((res) => {
  //             const data = res.data.message;
  //             console.log(data)
  //             const Phelbos = data.map((ele) => {
  //                 return {

  //                     value: ele.PhlebotomistID,
  //                     label: ele.name
  //                 }
  //             })

  //             setPhelbos(Phelbos)

  //             setPayload({...payload,PhelbotomistId:details?.PhlebotomistId})
  //         })
  //         .catch((err) => {
  //             toast.error('Something Went wrong')
  //         });

  // }

  // useEffect(()=>{
  //   bindPhelbo();

  // },[])
  return (
    <>
      <Modal show={showReschedule}  id="Reschedule" style={{ backgroundColor: "black" }}>
        <div
         
          style={{ marginTop: "100px", backgroundColor: "transparent" }}
        >
          <Modal.Header className="modal-header">
            <Modal.Title className="modal-title">
              {t("Reschedule Appointment")}
            </Modal.Title>
            <button
              type="button"
              className="close"
              onClick={handleCloseReschedule}
            >
              ×
            </button>
          </Modal.Header>
          <Modal.Body>
            <div className="box-body">
              <div className="row">
                <label className="col-md-5" htmlFor="PreBooking ID">
                  {t("PreBooking ID : ")}&nbsp;
                </label>
                {/* <span>{details.PreBookingId}</span> */}
              </div>
              <div className="row">
                <label className="col-md-5" htmlFor="Appointment Date and Time">
                  {t("Appointment Date and Time")} :
                </label>
                {/* <span>{details.AppDate}</span> */}
              </div>

              <div className="row">
                <label className="col-md-5" htmlFor="Phlebotomist Name">
                  {t("Phlebotomist Name")} : &nbsp;
                </label>

                <div className="col-sm-12 col-md-3">
                  <SelectBox
                    name="PPhelbotomistId"
                    className="input-sm"
                    // options={Phelbos}
                    // selectedValue={payload?.PhelbotomistId}
                  />
                </div>
              </div>

              <div className="row">
                <label className="col-md-5" htmlFor="New Appointment Date">
                  {t("New Appointment Date")} : &nbsp;
                </label>
                <div className="col-sm-12 col-md-3">
                  <DatePicker
                    name="NewDate"
                    className="select-input-box form-control input-sm required"
                  ></DatePicker>
                </div>

                <div className="col-sm-12 col-md-3">
                  <SelectBox name="Slot" className="input-sm" />
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
                    handleCloseReschedule();
                    }}
                  >
                    Reschedule
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

export default AppointmentRescheduleModal;
