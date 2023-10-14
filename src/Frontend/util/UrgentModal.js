import moment from "moment";
import React from "react";
import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";

function UrgentModal({ show, handleUrgent, index, handleClose }) {
  const [state, setState] = useState({
    date: moment().format("YYYY-MM-DD"),
    time: moment().format("HH:mm:ss"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleSubmit = () => {

    if (state?.date <= moment().format("YYYY-MM-DD")) {
      if (state?.time <= moment().format("HH:mm:ss")) {
        toast.error("Time can not be less than current time.");
      } else {
        handleUrgent(state?.date + state?.time, index);
        handleClose();
        setState({
          date: moment().format("YYYY-MM-DD"),
          time: moment().format("HH:mm:ss"),
        });
      }
    } else {
      handleUrgent(`${state?.date}  ${state?.time}`, index);
      handleClose();
      setState({
        date: moment().format("YYYY-MM-DD"),
        time: moment().format("HH:mm:ss"),
      });
    }
  };

  return (
    <Modal show={show}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">
          Select Urgent Date and Time
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="box-body">
          <div className="row">
            <div className="col-sm-6">
              <input
                className="form-control"
                type="date"
                min={moment().format("YYYY-MM-DD")}
                value={state?.date}
                name="date"
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-6">
              <input
                className="form-control"
                type="time"
                value={state?.time}
                step={3}
                name="time"
                onChange={handleChange}
              />
            </div>
          </div>
        </div>
        <div className="box-footer">
          <div className="row">
            <div className="col-sm-2">
              <button  className="btn btn-success btn-block btn-sm" onClick={handleSubmit}>
                Set & Close
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default UrgentModal;
