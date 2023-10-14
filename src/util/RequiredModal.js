import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Modal, Table } from "react-bootstrap";
import Input from "../../ChildComponents/Input";

function RequiredModal({ RequiredShow, handleClose }) {
  const [tableData, setTableData] = useState([]);
  const handleGet = () => {
    axios
      .post("/api/v1/TestData/checkMandatoryFields", {
        invIds: RequiredShow?.FieldIDs,
        isEditPage: false,
        LedgerTransactionID: "",
      })
      .then((res) => {
        setTableData(res?.data?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleGet();
  }, []);
  return (
    <Modal show={RequiredShow?.show}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title" />
        Mandatory Required Fields
        <button type="button" className="close" onClick={handleClose}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <Table responsive hover striped>
          <thead>
            <tr>
              <th>Attributes</th>
              <th>Required Parameters</th>
              <th>Test Name</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.map((ele, index) => (
              <tr key={index}>
                <td>{ele?.FieldName}</td>
                <td>
                  <div className="row">
                    <div className="col-xs-6">
                      <Input className="form-control" />
                    </div>
                    <div className="col-xs-6">
                      <select className="form-control">
                        <option>1</option>
                      </select>
                    </div>
                  </div>
                </td>
                <td>Package</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
}

export default RequiredModal;
