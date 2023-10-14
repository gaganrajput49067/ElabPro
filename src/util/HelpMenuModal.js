import axios from "axios";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

const HelpMenuModal = ({
  show,
  handleClose,
  Edit,
  Value,
  getHelpMenu,
  state,
}) => {
  const [formData, setFormData] = useState(
    Edit
      ? {
          MenuName: state?.MenuName,
          IsActive: "1",
          MenuId: state?.HelpMenuId,
        }
      : {
          MenuName: "",
          IsActive: "1",
        }
  );

  console.log(Edit);
  const AddHelp = () => {
    axios
      .post(
        Edit
          ? "/api/v1/Investigations/UpdateHelpMenu"
          : "/api/v1/Investigations/InsertHelpMenu",
        formData
      )
      .then((res) => {
        if (res.data.message) {
          toast.success(res.data.message);
          handleClose();
          getHelpMenu();
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <Modal show={show}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">
          {Edit ? "Update Help Menu" : "Add New Help Menu"}
        </Modal.Title>
        <button
          type="button"
          className="close"
          onClick={() => {
            handleClose();
          }}
        >
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <textarea
          className="width100p form-control"
          style={{ height: "100px" }}
          maxLength={200}
          type="text"
          placeholder={"Please Enter Help Menu"}
          onChange={handleChange}
          name="MenuName"
          value={formData?.MenuName}
        ></textarea>
      </Modal.Body>
      <Modal.Footer>
        {Edit ? (
          <button
            type="button"
            className="margin btn btn-success float-left"
            onClick={AddHelp}
          >
            Update
          </button>
        ) : (
          <button
            type="button"
            className="margin btn btn-success float-left"
            onClick={AddHelp}
          >
            Save
          </button>
        )}

        <button
          type="button"
          className="margin btn btn-danger float-left"
          onClick={() => handleClose()}
        >
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default HelpMenuModal;
