import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { selectedValueCheck } from "./Commonservices";
import axios from "axios";
import { toast } from "react-toastify";

function DoctorShareTransferModal({ show, handleClose }) {
  const [DoctorData, setDoctorData] = useState([]);

  const [state, setState] = useState({
    FromDoctorID: "",
    ToDoctorID: "",
  });
  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setState({
      ...state,
      [name]: String(event.value),
    });
  };

  const postApi = () => {
    if (state?.FromDoctorID && state?.ToDoctorID) {
      axios.post("/api/v1/DocShareMaster/transferDocShare", {
        FromDoctorID: state?.FromDoctorID,
        ToDoctorID: state?.ToDoctorID
      }).then((res) => {
        toast.success(res?.data?.message)
        setState({
          FromDoctorID: "",
          ToDoctorID: "",
        })
      }).catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "SomeThing Went Wrong"
        );
      })
    } else {
      toast.error("please Choose FromDoctorID and ToDoctorID")
    }
  }

  const BindDoctorData = () => {
    axios
      .post("/api/v1/DoctorReferal/getDoctorDataBind")
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            label: ele?.DoctorName,
            value: ele?.DoctorID,
          };
        });
        setDoctorData(val);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "SomeThing Went Wrong"
        );
      });
  };

  useEffect(() => {
    BindDoctorData();
  }, []);
  return (
    <Modal show={show}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">Doctor Share Transfer</Modal.Title>
        <button type="button" className="close" onClick={handleClose}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="row">
          <div className="col-sm-6">
            <label>From Doctor</label>
            <SelectBox
              options={DoctorData}
              onChange={handleSelectChange}
              name={"FromDoctorID"}
              selectedValue={selectedValueCheck(
                DoctorData,
                state?.FromDoctorID
              )}
              className="required"
            />
          </div>
          <div className="col-sm-6">
            <label>To Doctor</label>
            <SelectBox
              options={state?.FromDoctorID ? DoctorData.filter((ele) => ele.value != state?.FromDoctorID) : DoctorData}
              onChange={handleSelectChange}
              name={"ToDoctorID"}
              selectedValue={selectedValueCheck(
                DoctorData,
                state?.ToDoctorID
              )}
              className="required"
            />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-success" onClick={postApi}>Save</button>
        <button className="btn btn-danger" onClick={handleClose}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default DoctorShareTransferModal;
