import moment from "moment";
import React from "react";
import { Modal, Table } from "react-bootstrap";
import { dateConfig } from "./DateConfig";
import { useTranslation } from "react-i18next";

function MobileDataModal({ show, mobleData, handleClose4, handleSelctData }) {
  // i18n start by rahul
  
  const { t } = useTranslation();
 
  // i18n by rahul end
  return (
    <div>
      <Modal show={show} size="lg" centered>
        <Modal.Header className="modal-header">
          <Modal.Title className="modal-title">{t("Old Patient")}</Modal.Title>
          <button type="button" className="close" onClick={handleClose4}>
            ×
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="box-body divResult table-responsive boottable"
            id="no-more-tables">
            <div className="row">
                <table
                  className="table table-bordered table-hover table-responsive table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf">
                    <tr>
                      <th>{t("Select")}</th>
                      <th>{t("UHID")}</th>
                      <th>{t("Patient Name")}</th>
                      <th>{t("Age")}</th>
                      <th>{t("DOB")}</th>
                      <th>{t("Gender")}</th>
                      <th>{t("Mobile")}</th>
                      <th>{t("City")}</th>
                      <th>{t("State")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mobleData.map((data, index) => (
                      <tr key={index}>
                        <td data-title={t("Select")}>
                          <button
                            className="btn  btn-info w-50 btn-sm"
                            onClick={() => {
                              handleSelctData(data);
                            }}
                          >
                           {t("Select")}&nbsp;
                          </button>
                        </td>
                        <td data-title={t("UHID")}>{data?.PatientCode}&nbsp;</td>
                        <td data-title={t("Patient Name")}>
                          {data?.Title +
                            " " +
                            data?.FirstName +
                            " " +
                            data?.MiddleName +
                            " " +
                            data?.LastName}&nbsp;
                        </td>
                        <td data-title={t("Age")}>{data?.Age}&nbsp;</td>
                        <td data-title={t("DOB")}>{dateConfig(data?.DOB)}&nbsp;</td>
                        <td data-title={t("Gender")}>{data?.Gender}&nbsp;</td>
                        <td data-title={t("Mobile")}>{data?.Mobile}&nbsp;</td>
                        <td data-title={t("City")}>{data?.City}&nbsp;</td>
                        <td data-title={t("State")}>{data?.State}&nbsp;</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default MobileDataModal;
