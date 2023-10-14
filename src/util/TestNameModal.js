import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Modal, Table } from "react-bootstrap";
import Loading from "./Loading";

function TestNameModal({ show, onHandleShow, id }) {
  const [tableData, setTableData] = useState([]);
  const fetch = () => {
    axios
      .post("/api/v1/PatientRegistration/GetTestInfo", {
        InvestigationId: id,
      })
      .then((res) => {
        setTableData(res?.data?.message);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetch();
  }, [id]);

  return (
    <Modal show={show} onHide={onHandleShow}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">
          Investigation Information
        </Modal.Title>
        <button type="button" className="close" onClick={onHandleShow}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        {tableData?.length > 0 ? (
          <Table responsive bordered hover striped>
            <thead>
              <tr>
                <th>Investigation Name</th>
                <th>Test Name</th>
                <th>Test/Profile</th>
                <th>Department</th>
              </tr>
            </thead>
            <tbody>
              {tableData?.map((data, index) => (
                <tr key={index}>
                  <td>{data?.TestName}</td>
                  <td>{data?.TestName}</td>
                  <td>{data?.DataType}</td>
                  <td>{data?.Department}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <Loading />
        )}
      </Modal.Body>
      <Modal.Footer>
        <button type="button" className="close" onClick={onHandleShow}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default TestNameModal;
