import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import TextEditor from "../../Master/Report/TextEditor";
import axios from "axios";
import { toast } from "react-toastify";

function ResultEditAddModal({ show, handleClose, handleSave }) {
  const [EditTable, setEditTable] = useState(false);
  const [EditData, setEditData] = useState(show?.data);
  const [SelectedBox, setSelectedBox] = useState([]);

  const getInvestigationsListData = () => {
    axios
      .post("/api/v1/InvestigationCommentMaster/getInvestigationCommentData", {
        InvestigationID: show?.data?.labObservationID,
        Template: "",
        TemplateText: "",
      })
      .then((res) => {
        if (res.status === 200) {
          setSelectedBox(res.data.message);
        }
        if (res?.data?.message.length === 0) {
          // toast.success("No Data Found");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDropdown = (e) => {
    const { value } = e.target;
    setEditData({ ...EditData, COMMENT: value });
  };

  useEffect(() => {
    getInvestigationsListData();
  }, []);

  const handleChange = (data) => {
    setEditData({ ...EditData, COMMENT: data });
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
        <div className="row">
          <div className="col-12">
            <div className="mb-3">
              <label>Select Comment:</label>
              <select className="form-control" onChange={handleDropdown}>
                <option >Select</option>
                {SelectedBox?.map((ele) => (
                  <option value={ele?.TemplateText}>{ele?.Template}</option>
                ))}
              </select>
            </div>
            <TextEditor
              value={EditData?.COMMENT}
              EditTable={EditTable}
              setEditTable={setEditTable}
              setValue={handleChange}
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-success mx-2"
          onClick={() => handleSave(EditData, "AddComment")}
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

export default ResultEditAddModal;
