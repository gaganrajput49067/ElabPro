import React from "react";
import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { useTranslation } from "react-i18next";
import NewPatientDetailModal from "./NewPatientDetailModal";
import RegisteredPatientDetailModal from "./RegisteredPatientDetailModal";
import moment from "moment";
import { number } from "../util/Commonservices/number";
import AppointmentModal from "./AppointmentModal";
import HCHistoryModal from "./HCHistoryModal";

const CallCentre = () => {
  const { t } = useTranslation();
  const [mobile, setMobile] = useState("");
  const [mobileData, setMobileData] = useState([]);
  const [show, setShow] = useState(false);
  const [detailShow, setDetailShow] = useState(false);
  const [appointShow, setAppointShow] = useState(false);
  const [hcHistoryShow, sethcHistoryShow] = useState(false);
  const [showPatientData, setShowPatientData] = useState({});
  const [hcStatusShow, setHcStatusShow] = useState([]);

  const handleClose = () => {
    setShow(false);
    setShowPatientData({});
  };

  const handleCloseDetailShow = () => {
    setDetailShow(false);
  };

  const handleCloseAppoint = () => setAppointShow(false);
  const handleClosehcHistory = () => sethcHistoryShow(false);
  const handleOpenhcHistory = () => sethcHistoryShow(true);

  const handleClear = () => {
    setMobile("");
    setShowPatientData({});
  };

  const handleMobile = (e) => {
    setMobile(e.target.value);
  };

  const handlePatientData = (e) => {
    const keypress = [13];
    if (keypress.includes(e.which)) {
      e.preventDefault();
      getDataByMobileNo();
    }
  };

  const getDataByMobileNo = () => {
    if (mobile.length === 10) {
      axios
        .post("/api/v1/CustomerCare/BindOldPatient", {
          mobile: mobile,
        })
        .then((res) => {
          if (res?.data?.message?.length == 0) {
            setShowPatientData({});
            toast.error("No Patient Found");
            setShow(true);
          } else {
            setMobileData(res?.data?.message);
            setDetailShow(true);
          }
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
        });
    } else {
      toast.error("Mobile length must be equal to 10");
    }
  };

  const handleSelectData = (ele) => {
    setMobileData([]);
    handleCloseDetailShow();
    setShowPatientData(ele);
    getHcHistory(ele);
  };

  const getHcHistory = (ele) => {
    axios
      .post("/api/v1/CustomerCare/BindOldPatientHomeCollectionData", {
        patient_id: ele?.Patientid,
        // patient_id: "AKKR.0000131251",
      })
      .then((res) => {
        console.log(res?.data?.message);
        setHcStatusShow(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };
  return (
    <>
      {show && (
        <NewPatientDetailModal
          show={show}
          handleClose={handleClose}
          mobile={mobile}
        />
      )}

      {detailShow && (
        <RegisteredPatientDetailModal
          setShow={setShow}
          mobileData={mobileData}
          detailShow={detailShow}
          handleCloseDetailShow={handleCloseDetailShow}
          handleSelectData={handleSelectData}
        />
      )}
      
      {appointShow && (
        <AppointmentModal
          showPatientData={showPatientData}
          appointShow={appointShow}
          handleCloseAppoint={handleCloseAppoint}
        />
      )}

      {hcHistoryShow && (
        <HCHistoryModal
          showPatientData={showPatientData}
          hcHistoryShow={hcHistoryShow}
          handleClosehcHistory={handleClosehcHistory}
        />
      )}
      <div className="box with-border">
        <div className="box box-header with-border box-success">
          <h3 className="box-title text-center">
            {t("Customer Care Management")}
          </h3>
        </div>

        <div className="box-body">
          <div className="row">
            <div className="col-md-2">
              <input type="radio" checked={true} name="Patient"></input>
              &nbsp;
              <label htmlFor="Patient" className="control-label">
                {t("Patient")}
              </label>
            </div>
            <label className=" col-md-1" htmlFor="Mobile">
              {t("Mobile No.")}  :
            </label>
            <div className=" col-md-2">
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Input
                  className="select-input-box form-control input-sm"
                  type="number"
                  placeholder="Enter a Mobile Number"
                  name="Mobile"
                  value={mobile}
                  max={10}
                  onInput={(e) => number(e, 10)}
                  
                  onKeyDown={handlePatientData}
                  onChange={handleMobile}
                  autoComplete="off"
                />
                &nbsp;
                <div className="input-group-append">
                  <button
                    className=" btn-primary btn-sm"
                    type="button"
                    onClick={getDataByMobileNo}
                  >
                    <i className="fa fa-plus-circle fa-sm"></i>
                  </button>
                </div>
              </div>
            </div>
            &nbsp;
            <div className="col-md-1" style={{ textAlign: "center" }}>
              <button
                className=" btn btn-danger btn-block btn-sm"
                onClick={() => {
                  handleClear();
                }}
              >
                {t("Clear")}
              </button>
            </div>
          </div>
        </div>
      </div>

      {Object.keys(showPatientData).length > 0 && (
        <>
          <div className="box">
            <div className="box-body">
              <div className="row">
                <div className="col-md-2">
                  <label>{t("UHID")} : &nbsp;</label>
                  {showPatientData?.Patientid}
                </div>
                <div className="col-md-3">
                  <label>{t("Patient Name")} : &nbsp;</label>
                  {showPatientData?.NAME}
                </div>

                <div className="col-md-2">
                  <label>{t("Age")} : &nbsp;</label>
                  {showPatientData?.Age}
                </div>
                <div className="col-md-2">
                  <label>{t("Gender")} : &nbsp;</label>
                  {showPatientData?.Gender}
                </div>
                <div className="col-md-2">
                  <label>{t("Mobile")} : &nbsp;</label>
                  {showPatientData?.Mobile}
                </div>
              </div>

              <div className="row">
                <div className="col-md-5">
                  <label>{t("Email")} : &nbsp;</label>
                  {showPatientData?.Email}
                </div>

                <div className="col-md-2">
                  <label>{t("DOB")} : &nbsp;</label>
                  {moment(showPatientData.DOB).format("DD-MMM-YYYY")}
                </div>

                <div className="col-md-2">
                  <label>{t("Area")} : &nbsp;</label>
                  {showPatientData?.LocalityName}
                </div>
                <div className="col-md-2">
                  <label>{t("City")} : &nbsp;</label>
                  {showPatientData?.City}
                </div>
              </div>

              <div className="row">
                <div className="col-md-2">
                  <label>{t("State")} : &nbsp;</label>
                  {showPatientData?.StateName}
                </div>
                <div className="col-md-3">
                  <label>{t("Pincode")} : &nbsp;</label>
                  {showPatientData?.Pincode}
                </div>

                <div className="col-md-2">
                  <label>{t("Last Call")} : &nbsp;</label>
                  {showPatientData?.LastCall}
                </div>

                <div className="col-md-2">
                  <label>{t("Reason of Call")} : &nbsp;</label>
                  {showPatientData?.ReasonofCall}
                </div>
              </div>
            </div>
          </div>
          {hcStatusShow?.length > 0 &&
            hcStatusShow?.map((ele, index) => (
              <div className="box" key={index}>
                <div className="box-body ">
                  <div className="row">
                    <label
                      className="col-sm-12  col-md-2"
                      htmlFor="Last HC Status"
                    >
                      {t("Last Home Collection Status")}
                    </label>

                    <div className="col-md-1 col-sm-12">
                      <button
                        type="button"
                        name="HC History"
                        className="btn btn-success btn-sm "
                        onClick={handleOpenhcHistory}
                      > {t("HC History")}
                    
                      </button>
                    </div>

                    <div className="col-md-2 col-sm-12">
                      <label htmlFor="PrebookingID">
                        {t("PrebookingID")} : &nbsp;
                      </label>
                      {ele?.prebookingid}
                    </div>

                    <div className="col-sm-12 col-md-4">
                      <label htmlFor="AppointmentDate">
                        {t("Appointment Date")} : &nbsp;
                      </label>

                      {ele?.appdate}
                    </div>

                    <div className="col-md-2 col-sm-12">
                      <label htmlFor="Status">{t("Status")} : &nbsp;</label>
                      {ele?.currentstatus}
                    </div>
                  </div>
                </div>
              </div>
            ))}

          <div className="box HCollection">
            <div className="box-body">
              <div>
                <button
                  className="btn btn-primary btn-sm"
                  style={{ height: "30px", fontSize: "15px" }}
                  onClick={() => setAppointShow(true)}
                >
                   {t("Home Collection")}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CallCentre;
