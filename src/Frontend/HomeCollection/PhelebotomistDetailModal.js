import React from "react";
import { Image } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Images from "./Image.jpeg";
const PhelebotomistDetailModal = ({
  phelebotomistData,
  pheleboProfile,
  handlePheleboDetailClose,
}) => {
  console.log(phelebotomistData);
  const { t } = useTranslation();
  return (
    <>
      <Modal show={pheleboProfile} style={{ backgroundColor: "black" }} id="PheleboProfile">
        <div
          className="box-success"
          style={{ marginTop: "100px", backgroundColor: "transparent" }}
        >
          <Modal.Header className="modal-header">
            <Modal.Title className="modal-title">
              {t("Phelebotomist Profile")}
            </Modal.Title>
            <button
              type="button"
              className="close"
              onClick={handlePheleboDetailClose}
            >
              ×
            </button>
          </Modal.Header>
          <Modal.Body>
            {phelebotomistData?.map((ele, index) => (
              <>
                <div className="box-body" key={index}>
                  <div className="row">
                    <Image
                      src={ele?.ProfilePics}
                      style={{ width: "150px", height: "150px" }}
                    />
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>{t("Name : ")}&nbsp;</label>
                      {ele?.NAME}
                    </div>

                    <div className="col-md-6">
                      <label>{t("Joining Date :")}&nbsp;</label>
                      {ele?.joiningdate}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <label>{t("Gender : ")}&nbsp;</label>
                      {ele?.gender}
                    </div>

                    <div className="col-md-6">
                      <label>{t("DOB :")}&nbsp;</label>
                      {ele?.dob}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <label>{t("Mobile : ")}&nbsp;</label>
                      {ele?.mobile}
                    </div>

                    <div className="col-md-6">
                      <label>{t("Email :")}&nbsp;</label>
                      {ele?.email}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <label>{t("Address : ")}&nbsp;</label>
                      {ele?.address}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>{t("Blood Group : ")}&nbsp;</label>
                      {ele?.bloodgroup}
                    </div>

                    <div className="col-md-6">
                      <label>{t("Qualification :")}&nbsp;</label>
                      {ele?.Qualification}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6">
                      <label>{t("Vehicle Number : ")}&nbsp;</label>
                      {ele?.Vehicle_num}
                    </div>

                    <div className="col-md-6">
                      <label>{t("Driving Licence :")}&nbsp;</label>
                      {ele?.DrivingLicence}
                    </div>
                  </div>
                </div>
              </>
            ))}
          </Modal.Body>

          <Modal.Footer></Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default PhelebotomistDetailModal;
