import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Modal, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { dateConfig } from "./DateConfig";
import { GetMedicalHistoryData } from "./Commonservices";

function MedicialModal({
  show,
  handleClose,
  MedicalId,
  ID,
  handleUploadCount,
}) {
  const [data, setData] = useState({
    PatientGuid: "",
    LedgerTransactionID: ID ? ID : 0,
    patientmedicalhistoryiesVM: [
      {
        MedicalHistory: "",
        LedgerTransactionID: ID ? ID : 0,
        PatientMedicalHistoryIDs: "",
        date: new Date(),
      },
    ],
  });

  useEffect(() => {
    setData({ ...data, PatientGuid: MedicalId });
  }, [MedicalId]);

  console.log(data);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const val = [...data?.patientmedicalhistoryiesVM];
    val[index][name] = value;
    setData({ ...data, patientmedicalhistoryiesVM: val });
  };

  const handleDelete = (index) => {
    const val = data?.patientmedicalhistoryiesVM.filter(
      (ele, idx) => idx !== index
    );
    setData({ ...data, patientmedicalhistoryiesVM: val });
    toast.success("successfully Deleted");
  };

  useEffect(() => {
    GetMedicalHistoryData(MedicalId, setData, data, ID,handleUploadCount);
  }, []);

  const handleUpload = () => {
    let match = true;
    for (let i = 0; i < data?.patientmedicalhistoryiesVM.length; i++) {
      if (data?.patientmedicalhistoryiesVM[i].MedicalHistory === "") {
        match = false;
        break;
      }
    }
    if (match) {
      axios
        .post("api/v1/PatientRegistration/UploadMedicalHistory", data)
        .then((res) => {
          toast.success(res?.data?.message);
          GetMedicalHistoryData(MedicalId, setData, data, ID ? ID : 1,handleUploadCount);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
        });
    } else {
      toast.error("Please Enter value");
    }
  };
  const handleAdd = (dataValue) => {
    if (dataValue !== "") {
      setData({
        ...data,
        patientmedicalhistoryiesVM: [
          ...data?.patientmedicalhistoryiesVM,
          {
            MedicalHistory: "",
            LedgerTransactionID: 0,
            PatientMedicalHistoryIDs: "",
            date: new Date(),
          },
        ],
      });
    } else {
      toast.error("Please Enter Value");
    }
  };

  console.log(data);

  return (
    <Modal show={show}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">Medical History</Modal.Title>
        <button type="button" className="close" onClick={handleClose}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-body" id="DocModalData">
          <Table responsive bordered hover>
            <thead>
              <tr>
                {/* <th>Date</th> */}
                {/* <th>Entry By</th> */}
                <th>MedicialHistory</th>
                <th>Action</th>
                <th>inActive</th>
              </tr>
            </thead>
            <tbody>
              {data.patientmedicalhistoryiesVM.map((ele, index) => (
                <tr key={index}>
                  {/* <td>{dateConfig(ele?.date)}</td> */}
                  {/* <td></td> */}
                  <td>
                    {index + 1 === data?.patientmedicalhistoryiesVM.length ? (
                      <input
                        className="form-control"
                        value={ele?.MedicalHistory}
                        name="MedicalHistory"
                        type="text"
                        onChange={(e) => {
                          handleChange(e, index);
                        }}
                      />
                    ) : (
                      ele?.MedicalHistory
                    )}
                  </td>
                  <td>
                    {data?.patientmedicalhistoryiesVM.length === index + 1 && (
                      <button
                        className="btn-link"
                        onClick={() => handleAdd(ele?.MedicalHistory)}
                      >
                        Add Row
                      </button>
                    )}
                  </td>
                  <td>
                    {data?.patientmedicalhistoryiesVM?.length > 1 && (
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDelete(index)}
                      >
                        X
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div>
          <button className="btn btn-success" onClick={() => handleUpload()}>
            Save
          </button>
          <button className="btn btn-danger" onClick={handleClose}>
            Close
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

export default MedicialModal;
