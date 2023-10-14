import React from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
const ViewLogModal = ({ data, viewLog, showViewLog, handleCloseViewLog }) => {
  const { t } = useTranslation();
  console.log(data, viewLog);
  return (
    <>
      {viewLog.length > 0 && (
        <Modal show={showViewLog} style={{ backgroundColor: "black" }} id="ViewLog">
          <div
            className="box-success"
            style={{
              marginTop: "200px",
              backgroundColor: "transparent",
              maxHeight: "150px",
              overflowY: "auto",
            }}
          >
            <Modal.Header
              className="modal-header"
              style={{ position: "sticky", zIndex: 1055, top: 0 }}
            >
              <Modal.Title className="modal-title">
                {t("Log of PrebookingID  : ")} {data?.prebookingid}
              </Modal.Title>
              <button
                type="button"
                className="close"
                onClick={handleCloseViewLog}
              >
                ×
              </button>
            </Modal.Header>
            <Modal.Body>
              <table
                className="table table-bordered table-hover table-striped tbRecord"
                cellPadding="{0}"
                cellSpacing="{0}"
              >
                <thead className="cf text-center" style={{ zIndex: 99 }}>
                  <tr>
                    <th className="text-center">{t("Status")}</th>
                    <th className="text-center">{t("StatusDate")}</th>
                    <th className="text-center">{t("DoneBy")}</th>
                  </tr>
                </thead>
                <tbody>
                  {viewLog.map((ele, index) => (
                    <>
                      <tr key={index}>
                        <td data-title="Status" className="text-center">
                          {ele.Status}
                        </td>
                        <td data-title="StatusDate" className="text-center">
                          {ele.StatusDate}
                        </td>
                        <td data-title="DoneBy" className="text-center">
                          {ele.DoneBy}
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </Modal.Body>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ViewLogModal;
