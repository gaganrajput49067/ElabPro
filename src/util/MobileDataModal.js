import moment from "moment";
import React from "react";
import { Modal, Table } from "react-bootstrap";
import { dateConfig } from "./DateConfig";

function MobileDataModal({ show, mobleData, handleClose4, handleSelctData }) {
  return (
    <div>
      <Modal show={show} size="lg" centered>
        <Modal.Header className="modal-header">
          <Modal.Title className="modal-title">Old Patient</Modal.Title>
          <button type="button" className="close" onClick={handleClose4}>
            ×
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-body" id="DocModalData">
            <div className="boottable">
              <Table responsive hover bordered>
                <thead>
                  <tr>
                    <th>Select</th>
                    <th>UHID</th>
                    <th>Patient Name</th>
                    <th>Age</th>
                    <th>DOB</th>
                    <th>Gender</th>
                    <th>Mobile</th>
                    <th>City</th>
                    <th>State</th>
                  </tr>
                </thead>
                <tbody>
                  {mobleData.map((data, index) => (
                    <tr key={index}>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => {
                            handleSelctData(data);
                          }}
                        >
                          Select
                        </button>
                      </td>
                      <td>{data?.PatientCode}</td>
                      <td>
                        {data?.Title +
                          " " +
                          data?.FirstName +
                          " " +
                          data?.MiddleName +
                          " " +
                          data?.LastName}
                      </td>
                      <td>{data?.Age}</td>
                      <td>{dateConfig(data?.DOB)}</td>
                      <td>{data?.Gender}</td>
                      <td>{data?.Mobile}</td>
                      <td>{data?.City}</td>
                      <td>{data?.State}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default MobileDataModal;
