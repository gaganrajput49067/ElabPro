import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";

const DOSModal = ({ showDOS, handleCloseDOS }) => {
  const { t } = useTranslation();

  const data = [
    {
      SNo: 1,
      LocationName: "HCG KR",
      TestCode: "S12714",
      DepartmentName: "Serology",
      InvestigationName: "Anti Cardiolipin Antibodies IgM",
      MachineName: "",
      Method: "",
      InOutHouse: "InHouse",
      DeliveryDate: "20-Sep-2023 06:30 PM",
      ProcessLab: "HCG KR",
      DayType: "",
      TechnicianProcessing: "",
      Delivery: "01:00 pm",
      BookingCutoff: "01:30 pm",
      SRACutoff: "06:30 pm",
      ReportingCutoff: "06:30 pm",
    },
  ];
  return (
    <>
      <Modal show={showDOS} id="DOSmodal">
        <div
          className="box-success"
          style={{
            marginTop: "200px",

            backgroundColor: "transparent",
          }}
        >
          <Modal.Header className="modal-header">
            <Modal.Title className="modal-title">{t("DOS")}</Modal.Title>
            <button type="button" className="close" onClick={handleCloseDOS}>
              ×
            </button>
          </Modal.Header>
          <Modal.Body>
            <div className="box-body">
              <div
                className="box-body divResult table-responsive boottable"
                id="no-more-tables"
              >
                <div className="row">
                  <table
                    className="table table-bordered table-hover table-striped table-responsive tbRecord"
                    cellPadding="{0}"
                    cellSpacing="{0}"
                  >
                    <thead className="cf text-center" style={{ zIndex: 99 }}>
                      <tr>
                        <th className="text-center">{t("SNo")}</th>
                        <th className="text-center">{t("LocationName")}</th>
                        <th className="text-center">{t("TestCode")}</th>
                        <th className="text-center">{t("DepartmentName	")}</th>
                        <th className="text-center">
                          {t("InvestigationName")}
                        </th>
                        <th className="text-center">{t("MachineName")}</th>
                        <th className="text-center">{t("Method")}</th>
                        <th className="text-center">{t("InOutHouse")}</th>
                        <th className="text-center">{t("DeliveryDate")}</th>
                        <th className="text-center">{t("ProcessLab")}</th>
                        <th className="text-center">{t("DayType")}</th>
                        <th className="text-center">
                          {t("TechnicianProcessing")}
                        </th>
                        <th className="text-center">{t("Delivery")}</th>
                        <th className="text-center">{t("BookingCutoff")}</th>
                        <th className="text-center">{t("SRACutoff")}</th>
                        <th className="text-center">{t("ReportingCutoff")}</th>
                      </tr>
                    </thead>

                    <tbody>
                      {data.map((ele, index) => (
                        <tr key={index} style={{ color: "black" }}>
                          <td data-title="SNo" className="text-center">
                            {ele.SNo}&nbsp;
                          </td>
                          <td data-title="LocationName" className="text-center">
                            {ele.LocationName}&nbsp;
                          </td>
                          <td data-title="TestCode" className="text-center">
                            {ele.TestCode}&nbsp;
                          </td>
                          <td
                            data-title="DepartmentName"
                            className="text-center"
                          >
                            {ele.DepartmentName}&nbsp;
                          </td>
                          <td
                            data-title="InvestigationName"
                            className="text-center"
                          >
                            {ele.InvestigationName}&nbsp;
                          </td>
                          <td data-title="MachineName" className="text-center">
                            {ele.MachineName}&nbsp;
                          </td>
                          <td data-title="Method" className="text-center">
                            {ele.Method}&nbsp;
                          </td>
                          <td data-title="InOutHouse" className="text-center">
                            {ele.InOutHouse}&nbsp;
                          </td>
                          <td data-title="DeliveryDate" className="text-center">
                            {ele.DeliveryDate}&nbsp;
                          </td>
                          <td data-title="ProcessLab" className="text-center">
                            {ele.ProcessLab}&nbsp;
                          </td>
                          <td data-title="DayType" className="text-center">
                            {ele.DayType}&nbsp;
                          </td>
                          <td
                            data-title="TechnicianProcessing"
                            className="text-center"
                          >
                            {ele.TechnicianProcessing}&nbsp;
                          </td>
                          <td data-title="Delivery" className="text-center">
                            {ele.Delivery}&nbsp;
                          </td>
                          <td
                            data-title="BookingCutoff"
                            className="text-center"
                          >
                            {ele.BookingCutoff}&nbsp;
                          </td>
                          <td data-title="SRACutoff" className="text-center">
                            {ele.SRACutoff}&nbsp;
                          </td>
                          <td
                            data-title="ReportingCutoff"
                            className="text-center"
                          >
                            {ele.ReportingCutoff}&nbsp;
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Modal.Body>
        </div>
      </Modal>
    </>
  );
};

export default DOSModal;
