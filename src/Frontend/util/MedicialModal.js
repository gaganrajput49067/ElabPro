import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Modal, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { dateConfig } from "./DateConfig";
import { GetMedicalHistoryData } from "./Commonservices";
import Input from "../../ChildComponents/Input";
import { useTranslation } from "react-i18next";

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
  // language change
  // i18n start

  const { t } = useTranslation();

  // i18n end
  //end
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
    toast.success(t("Successfully Deleted"));
  };

  useEffect(() => {
    GetMedicalHistoryData(MedicalId, setData, data, ID, handleUploadCount);
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
          GetMedicalHistoryData(
            MedicalId,
            setData,
            data,
            ID ? ID : 1,
            handleUploadCount
          );
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : (t("Error Occured"))
          );
        });
    } else {
      toast.error (t("Please Enter Value"));
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
      toast.error (t("Please Enter Value"));
    }
  };

  console.log(data);

  return (
    <Modal show={show}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">{t("Medical History")}</Modal.Title>
        <button type="button" className="close" onClick={handleClose}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="modal-body">
          <table
            className="table table-bordered table-hover table-responsive table-striped tbRecord"
            cellPadding="{0}"
            cellSpacing="{0}"
          >
            <thead className="cf">
              <tr>
                {/* <th>Date</th> */}
                {/* <th>Entry By</th> */}
                <th>{t("MedicialHistory")}</th>
                <th>{t("Action")}</th>
                <th>{t("InActive")}</th>
              </tr>
            </thead>
            <tbody>
              {data.patientmedicalhistoryiesVM.map((ele, index) => (
                <tr key={index}>
                  {/* <td>{dateConfig(ele?.date)}</td> */}
                  {/* <td></td> */}
                  <td data-title={t("MedicialHistory")}>
                    {index + 1 === data?.patientmedicalhistoryiesVM.length ? (
                      <Input
                        className="select-input-box form-control input-sm"
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
                  <td data-title={t("Action")}>
                    {data?.patientmedicalhistoryiesVM.length === index + 1 && (
                      <button
                         className="btn  btn-success w-50 btn-sm mx-2"
                        onClick={() => handleAdd(ele?.MedicalHistory)}
                      >
                        {t("Add Row")}
                      </button>
                    )}
                  </td>
                  <td data-title={t("InActive")}>
                    {data?.patientmedicalhistoryiesVM?.length > 1 && (
                      <button
                         className="btn  btn-danger w-50 btn-sm mx-2"
                        onClick={() => handleDelete(index)}
                      >
                        X
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="box-footer">
          <div className="row">
            <div className="col-sm-2">
              <button
                className="btn  btn-success w-100 btn-sm mx-2"
                onClick={() => handleUpload()}
              >
                {t("Save")}
              </button>
            </div>
            <div className="col-sm-2">
              <button
                className="btn  btn-danger w-100 btn-sm mx-2"
                onClick={handleClose}
              >
                {t("Close")}
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default MedicialModal;
