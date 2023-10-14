import React from "react";
import { Modal } from "react-bootstrap";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { toast } from "react-toastify";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { selectedValueCheck } from "./Commonservices";

function RejectModal({ show, handleShow, data ,TableData}) {
  const [dropDown, setDropDown] = useState([]);

  const [payload, setPayload] = useState({
    Reason: "",
    CustomReason: "",
  });

  const getDropDown = () => {
    axios
      .get("api/v1/PatientRegistration/RejectionSampleList")
      .then((res) => {
        let data = res.data.message;

        let selectdata = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        selectdata.unshift({ label: "other", value: "other" });
        setDropDown(selectdata);
      
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const handleSelect = (event, rest) => {
    const { name } = rest;
    if (event.value !== "other") {
      setPayload({ ...payload, [name]: event.value, CustomReason: "" });
    } else {
      setPayload({ ...payload, [name]: event.value });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPayload({ ...payload, [name]: value });
  };

  const handleSubmit = () => {
    console.log({
      ...data,
      payload,
    });
    axios
      .post("api/v1/SC/SampleRejection", {data:[{
        ...data,
        Reason: payload?.Reason,
        CustomReason: payload?.CustomReason,
      }]
      })
      .then((res) => {
        handleShow();
        toast.success(res.data?.message);
        TableData("")
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  useEffect(() => {
    getDropDown();
  }, []);
  return (
    <Modal show={show}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title"  />
       <b>Select Reason to Reject Sample</b> 
        <button type="button" className="close" onClick={handleShow}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <SelectBox
          options={dropDown}
          name="Reason"
          selectedValue={selectedValueCheck(dropDown, payload?.Reason)}
          onChange={handleSelect}
        />
        {payload?.Reason === "other" && (
          <div className="mt-3">
            <textarea
              rows={3}
              className="form-control"
              name="CustomReason"
              onChange={handleChange}
              value={payload?.CustomReason}
            ></textarea>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-danger mx-2"
          onClick={handleSubmit}
        >
          Reject
        </button>
        <button type="button" className="close" onClick={handleShow}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default RejectModal;
