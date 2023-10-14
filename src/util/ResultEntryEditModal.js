import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Modal, Table } from "react-bootstrap";
import Input from "../../ChildComponents/Input";

function ResultEntryEditModal({ show, handleClose, handleSave }) {
  const [EditData, setEditData] = useState(show?.data);
  const handleChange = (e) => {
    const { name, value } = e.target;
    let data = EditData?.DisplayReading.split("-");

    if (name === "MinValue") {
      data[0] = value;
      const val = `${data[0]}-${data[1]}`;
      setEditData({ ...EditData, [name]: value, DisplayReading: val });
    }
    if (name === "MaxValue") {
        data[1] = value;
        const val = `${data[0]}-${data[1]}`;
        setEditData({ ...EditData, [name]: value, DisplayReading: val });
      }
if (name === "ReadingFormat") {
      setEditData({ ...EditData, [name]: value});
    }
  };
  
  return (
    <Modal show={show?.moadal} onHide={handleClose}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title" />
        <button type="button" className="close" onClick={handleClose}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <Table responsive>
          <thead>
            <tr>
              <th>Min Value</th>
              <th>Max Value</th>
              <th>Unit Type</th>
              <th>Display Reading</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <Input
                  type="text"
                  className="form-control"
                  name="MinValue"
                  value={EditData?.MinValue}
                  onChange={handleChange}
                />
              </td>
              <td>
                <Input
                  type="text"
                  className="form-control"
                  name="MaxValue"
                  value={EditData?.MaxValue}
                  onChange={handleChange}
                />
              </td>
              <td>
                <Input
                  type="text"
                  className="form-control"
                  name="ReadingFormat"
                  value={EditData?.ReadingFormat}
                  onChange={handleChange}
                />
              </td>
              <td>
                <Input
                  type="text"
                  className="form-control"
                  name="DisplayReading"
                  value={EditData?.DisplayReading}
                  onChange={handleChange}
                  readOnly
                />
              </td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-success mx-2"
          onClick={() => handleSave(EditData,"Edit")}
        >
          Save
        </button>
        <button type="button" className="close" onClick={handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ResultEntryEditModal;
