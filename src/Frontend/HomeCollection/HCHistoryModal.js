import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import { useState } from "react";
import HCHistoryCancelModal from "./HCHistoryCancelModal";
import ViewLogModal from "./ViewLogModal";
import axios from "axios";
import { toast } from "react-toastify";
import HCHistoryRescheduleModal from "./HCHistoryRescheduleModal";
import Loading from "../util/Loading";
const HCHistoryModal = ({
  showPatientData,
  hcHistoryShow,
  handleClosehcHistory,
}) => {
  const { t } = useTranslation();

  const [showCancel, setShowCancel] = useState(false);
  const [showViewLog, setShowViewLog] = useState(false);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showHappyCode, setShowHappyCode] = useState([]);
  const [hcHistory, setHcHistory] = useState([]);
  const [data, setData] = useState([]);
  const [viewLog, setViewLog] = useState([]);
  const handleCloseCancel = () => setShowCancel(false);
  const handleCloseReschedule = () => setShowReschedule(false);
  const handleCloseViewLog = () => setShowViewLog(false);
  // const handleOpenViewLog = () => setShowViewLog(true);
  const statusClasses = {
    Pending: "status-pending",
    DoorLock: "status-doorlock",
    // "Reschedule Request": "status-reschedule",
    // "Cancel Request": "status-cancel",
    Rescheduled: "status-rescheduled",
    CheckIn: "status-checkin",
    Completed: "status-completed",
    "Booking Completed": "status-booking-completed",
    Canceled: "status-canceled",
  };

  // console.log(showPatientData);

  const getViewLog = (ele) => {
    console.log(ele);
    axios
      .post("/api/v1/HomeCollectionSearch/ViewLog", {
        PreBookingId: ele?.prebookingid,
        // PreBookingId: 12,
      })
      .then((res) => {
        const data = res?.data?.message;
        setViewLog(data);
        setData(ele);
        setShowViewLog(true);
      })
      .catch((err) =>
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        )
      );
  };
  console.log(showHappyCode)
  const showHcHistoryData = () => {
    axios
      .post("/api/v1/CustomerCare/getHChistory", {
        Patientid: showPatientData.Patientid,
      })
      .then((res) => {
        const data = res?.data?.message;
        const happyCode = data.map(() => {
          return false;
        });

        setShowHappyCode(happyCode);
        setHcHistory(data);
      })
      .catch((err) => console.log(err));
  };
  const handleClose = (index) => {
    const arr = [...showHappyCode];
    arr[index] = false;
    setShowHappyCode(arr);
  };
  const getHappyCode = (ele, index) => {
    axios
      .post("/api/v1/HomeCollectionSearch/ShowHappyCode", {
        PreBookingId: ele?.prebookingid,
      })
      .then((res) => {
        const arr = [...showHappyCode];
        arr[index] = true;
        setShowHappyCode(arr);
        // toast.success(res?.data?.message);
      })
      .catch((err) => {
        toast.error("Happy Code Not Found");
      });
  };

  useEffect(() => {
    showHcHistoryData();
  }, []);
  return (
    <>
      {showCancel && (
        <HCHistoryCancelModal
          showCancel={showCancel}
          handleCloseCancel={handleCloseCancel}
        />
      )}

      {showViewLog && (
        <ViewLogModal
          data={data}
          viewLog={viewLog}
          showViewLog={showViewLog}
          handleCloseViewLog={handleCloseViewLog}
        />
      )}

      {showReschedule && (
        <HCHistoryRescheduleModal
          showReschedule={showReschedule}
          handleCloseReschedule={handleCloseReschedule}
        />
      )}

      <Modal show={hcHistoryShow} size="lg" id="ModalSizeHC">
        <div style={{ maxHeight: "500px", overflowY: "auto" }}>
          <Modal.Header
            className="modal-header"
            style={{ position: "sticky", zIndex: 1055, top: 0 }}
          >
            <Modal.Title className="modal-title">
              {t("Home Collection History")}
            </Modal.Title>
            <button
              type="button"
              className="close"
              onClick={handleClosehcHistory}
            >
              ×
            </button>
          </Modal.Header>
          <Modal.Body>
            <div className="box">
              <div className="box-body">
                <label className="col-sm-12  col-md-12" htmlFor="UHID">
                  {t("Home Collection History of ")} :&nbsp;
                  {showPatientData?.NAME}({showPatientData?.Mobile})
                </label>
              </div>
              <div className="box">
                <div className="box-body  hcStatus">
                  <div
                    className=""
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                    }}
                  >
                    <div>
                      <button
                        style={{
                          marginTop: "2px",
                          height: "14px",
                          border: "1px solid",
                          backgroundColor: "white",
                        }}
                      ></button>
                      &nbsp;&nbsp;
                      <label className="control-label">
                        {t("Pending")}&nbsp;&nbsp;&nbsp;
                      </label>
                    </div>
                    <div>
                      <button
                        style={{
                          marginTop: "2px",
                          height: "14px",
                          border: "1px solid",
                          backgroundColor: "#4acfee",
                        }}
                      ></button>
                      &nbsp;&nbsp;
                      <label className="control-label">{t("DoorLock")}</label>
                    </div>
                    <div>
                      <button
                        style={{
                          marginTop: "2px",
                          height: "14px",
                          border: "1px solid",
                          backgroundColor: "#989898",
                        }}
                      ></button>
                      &nbsp;&nbsp;
                      <label className="control-label">
                        {t("Rescheduled")}
                      </label>
                    </div>
                    <div>
                      <button
                        style={{
                          marginTop: "2px",
                          height: "14px",
                          border: "1px solid",
                          backgroundColor: "#FFFF00",
                        }}
                      ></button>
                      &nbsp;&nbsp;
                      <label className="control-label">{t("Check In")}</label>
                    </div>
                    <div>
                      <button
                        style={{
                          marginTop: "2px",
                          height: "14px",
                          border: "1px solid",
                          backgroundColor: "#9ACD32",
                        }}
                      ></button>
                      &nbsp;&nbsp;
                      <label className="control-label">{t("Completed")}</label>
                    </div>
                    <div>
                      <button
                        style={{
                          marginTop: "2px",
                          height: "14px",
                          border: "1px solid",
                          backgroundColor: "#00FFFF",
                        }}
                      ></button>
                      &nbsp;&nbsp;
                      <label className="control-label">
                        {t("Booking Completed")}
                      </label>
                    </div>
                    <div>
                      <button
                        style={{
                          marginTop: "2px",
                          height: "14px",
                          border: "1px solid",
                          backgroundColor: "#E75480",
                        }}
                      ></button>
                      &nbsp;&nbsp;
                      <label className="control-label">{t("Canceled")}</label>
                    </div>
                  </div>
                </div>
              </div>
              {/* <div className="col-md-3">
                      <button
                        style={{
                          marginTop: "2px",
                          height: "14px",
                          border: "1px solid",
                          backgroundColor: "#800080",
                        }}
                      ></button>
                      &nbsp;&nbsp;
                      <label className="control-label">
                        {t("Reschedule Request")}
                      </label>
                    </div>
                    <div className="col-md-2">
                      <button
                        style={{
                          marginTop: "2px",
                          height: "14px",
                          border: "1px solid",
                          backgroundColor: "#EE82EE",
                        }}
                      ></button>
                      &nbsp;&nbsp;
                      <label className="control-label">
                        {t("Cancel Request")}
                      </label>
                    </div> */}
              <div className="box-body">
                {/* <hr></hr> */}
                {/* <div
                className="row"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowCancel(true)}
                  >
                    Cancel
                  </button>
                </div>
                &nbsp;&nbsp;&nbsp;
                <div className="col-sm-2">
                  <button type="button" className="btn btn-primary btn-sm">
                    Edit
                  </button>
                </div>
                <div className="col-sm-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowReschedule(true)}
                  >
                    Reschedule
                  </button>
                </div>
              </div> */}
                {/* <br></br> */}

                {/* {console.log(hcHistory.length)} */}
                {hcHistory.length > 0 ? (
                  hcHistory.map((ele, index) => (
                    <>
                      <div
                        className={`box ${statusClasses[ele.cstatus]} `}
                        style={{ border: "1px solid grey" }}
                        key={index}
                      >
                        <div className="box-body">
                          <div className="row">
                            <div className="col-md-3">
                              <label>{t("Create Date ")}</label>&nbsp;:&nbsp;
                              {ele?.EntryDateTime}
                            </div>
                            <div className="col-md-3">
                              <label>{t("Create By ")}</label>&nbsp;:&nbsp;
                              {ele?.EntryByName}
                            </div>
                            <div className="col-md-3">
                              <label>{t("App Date ")}</label>&nbsp;:&nbsp;
                              {ele?.appdate}
                            </div>
                            <div className="col-md-3">
                              <label>{t("Prebooking ID")}&nbsp;:&nbsp;</label>
                              {ele?.prebookingid}
                              &nbsp;&nbsp;
                              {!showHappyCode[index] && (
                                <span
                                  style={{
                                    // backgroundColor: "#605ca8",
                                    backgroundColor: "blue",
                                    color: "white",
                                    padding: "2px",
                                    borderRadius: "2px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => getHappyCode(ele, index)}
                                >
                                  Show Happy Code
                                </span>
                              )}
                              {showHappyCode[index] && (
                                <span
                                  style={{
                                    backgroundColor: "black",
                                    color: "white",
                                    padding: "2px",
                                    borderRadius: "2px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => handleClose(index)}
                                >
                                  {ele?.VerificationCode}
                                </span>
                              )}
                              &nbsp;
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-3">
                              <label>{t("UHID ")}</label>&nbsp;:&nbsp;
                              {ele?.Patient_ID}
                            </div>
                            <div className="col-md-3">
                              <label>{t("Phelbo ")}</label>&nbsp;:&nbsp;
                              {ele?.phleboname}
                            </div>
                            <div className="col-md-3">
                              <label>{t("Phlebo Mobile ")}</label>&nbsp;:&nbsp;
                              {ele?.PMobile}
                            </div>
                            <div className="col-md-3">
                              <label>{t("Centre ")}</label>&nbsp;:&nbsp;
                              {ele?.centre}
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-3">
                              <label>{t("Status ")}</label>&nbsp;:&nbsp;
                              {ele?.cstatus}
                            </div>
                            <div className="col-md-3">
                              <label>{t("Visit ID ")}</label>&nbsp;:&nbsp;
                              {ele?.visitid}
                            </div>
                            <div className="col-md-3">
                              <label>{t("Patient Rating ")}</label>&nbsp;:&nbsp;
                              {ele?.patientrating}
                            </div>
                            <div className="col-md-3">
                              <label>{t("Phelbo Rating ")}</label>&nbsp;:&nbsp;
                              {ele?.phelborating}
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <label>{t("Patient Feedback ")}</label>
                              &nbsp;:&nbsp;
                              {ele?.PatientFeedback}
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-6">
                              <label>{t("Phelbo Feedback ")}</label>
                              &nbsp;:&nbsp;
                              {ele?.phelbofeedback}
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-12">
                              <label>{t("Test ")}</label>&nbsp;:&nbsp;
                              {ele?.testname}
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-3">
                              <label>{t("Gross Amount ")}</label>&nbsp;:&nbsp;
                              {ele?.Rate}
                            </div>
                            <div className="col-md-3">
                              <label>{t("Discount Amount ")}</label>
                              &nbsp;:&nbsp;
                              {ele?.discamt}
                            </div>
                            <div className="col-md-3">
                              <label>{t("Net Amount ")}</label>&nbsp;:&nbsp;
                              {ele?.netamt}
                            </div>
                            <div className="col-md-3">
                              <label>{t("Payment Mode ")}</label>&nbsp;:&nbsp;
                              {ele?.PaymentMode}
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-md-3">
                              <label>{t("CheckIn Date ")}</label>&nbsp;:&nbsp;
                              {ele?.checkindatetime}
                            </div>
                            <div className="col-md-3">
                              <label>{t("Comp. Date ")}</label>&nbsp;:&nbsp;
                              {ele?.compdate}
                            </div>

                            <div className="col-md-3">
                              <label>{t("Booking Date ")}</label>&nbsp;:&nbsp;
                              {ele?.currentstatusdate}
                            </div>
                            <div className="col-md-3">
                              <label>{t("Images ")}</label>&nbsp;:&nbsp;
                              <button
                                name="View log"
                                className="btn btn-primary btn-sm "
                                onClick={() => getViewLog(ele)}
                              >
                                View Log
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  ))
                ) : (
                  <Loading />
                )}

                <hr></hr>
              </div>
            </div>
          </Modal.Body>
        </div>
        <Modal.Footer>
          <div className="box"></div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HCHistoryModal;
