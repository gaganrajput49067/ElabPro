import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
const RegisteredPatientDetailModal = ({
  setShow,
  mobileData,
  detailShow,
  handleCloseDetailShow,
  handleSelectData,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Modal show={detailShow} centered id="ModalSizeHC">
        <Modal.Header className="modal-header" style={{ position: "sticky" ,zIndex: 1055,top:0}}>
          <Modal.Title className="modal-title">{t("Old Patient")}</Modal.Title>
          <button
            type="button"
            className="close"
            onClick={handleCloseDetailShow}
          >
            ×
          </button>
        </Modal.Header>
        <Modal.Body>
          {/* <div className="box"> */}
            <div
              className="box-body"
            >
              <div
                className="row divResult table-responsive boottable"
                id="no-more-tables"
              >
                <table
                  className="table table-bordered table-hover table-striped table-responsive tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf text-center">
                    <tr>
                      <th className="text-center">{t("Select")}</th>
                      <th className="text-center">{t("UHID")}</th>
                      <th className="text-center">{t("Patient Name")}</th>
                      <th className="text-center">{t("DOB")}</th>
                      <th className="text-center">{t("Age")}</th>
                      <th className="text-center">{t("Gender")}</th>
                      <th className="text-center">{t("Mobile")}</th>
                      <th className="text-center">{t("Area")}</th>
                      <th className="text-center">{t("City")}</th>
                      <th className="text-center">{t("State")}</th>
                      <th className="text-center">{t("Pincode")}</th>
                      <th className="text-center">{t("Reg. Date")}</th>
                      <th className="text-center">{t("Last HC")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mobileData.map((ele, index) => (
                      <>
                        <tr key={index}>
                          <td data-title="Select" className="text-center">
                            <button
                              type="button"
                              className="btn btn-info btn-sm"
                              onClick={() => {
                                handleSelectData(ele);
                              }}
                            >
                               {t("Select")}
                            </button>
                          </td>
                          <td data-title="UHID" className="text-center">
                            {ele.Patientid}&nbsp;
                          </td>
                          <td data-title="Patient Name" className="text-center">
                            {ele.NAME}&nbsp;
                          </td>
                          <td data-title="DOB" className="text-center">
                            {moment(ele.DOB).format("DD-MMM-YYYY")}&nbsp;
                          </td>
                          <td data-title="Age" className="text-center">
                            {ele.Age}&nbsp;
                          </td>
                          <td data-title="Gender" className="text-center">
                            {ele.Gender}&nbsp;
                          </td>
                          <td data-title="Mobile" className="text-center">
                            {ele.Mobile}&nbsp;
                          </td>

                          <td data-title="Area" className="text-center">
                            {ele.LocalityName}&nbsp;
                          </td>
                          <td data-title="City" className="text-center">
                            {ele.City}&nbsp;
                          </td>
                          <td data-title="State" className="text-center">
                            {ele.StateName}&nbsp;
                          </td>
                          <td data-title="PinCode" className="text-center">
                            {ele.Pincode}&nbsp;
                          </td>
                          <td data-title="Reg. Code" className="text-center">
                            {ele.visitdate}&nbsp;
                          </td>
                          <td data-title="Last HC" className="text-center">
                            {ele.lasthcstatus}&nbsp;
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
              <div
                className="row"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div className="col-md-4">
                  <button
                    type="button"
                    className="btn btn-primary btn-block btn-sm"
                    onClick={() => {
                      setShow(true);
                      handleCloseDetailShow();
                    }}
                  >
                     {t("Register New Patient With Same Mobile")}
                  </button>
                </div>
                <div className="col-md-1">
                  <button
                    type="button"
                    className="btn btn-primary btn-block btn-sm"
                    onClick={() => {
                      handleCloseDetailShow();
                    }}
                  >
                     {t("Close")}
                  </button>
                </div>
              </div>
            </div>
          {/* </div> */}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RegisteredPatientDetailModal;
