import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import TextEditor from "../../Master/Report/TextEditor";

function TemplateMasterModal({ show, handleClose, handleSave }) {
  const [payload, setPayload] = useState(show?.data);
  const [Editor, setEditor] = useState("");
  const [TemplateDropdown, setTemplateDropDown] = useState([]);
  const [EditTable, setEditTable] = useState(false);

  useEffect(() => {
    setPayload({ ...payload, COMMENT: Editor });
  }, [Editor]);

  console.log(payload);

  const fetch = () => {
    axios
      .post("api/v1/RE/BindReportTemplate", {
        InvestigationID: payload?.InvestigationID,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            value: ele?.TemplateID,
            label: ele?.Template,
          };
        });
        setTemplateDropDown(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const FetchTemplateID = (id) => {
    setEditTable(true);
    axios
      .post("api/v1/RE/BindReportTemplateByID", {
        ReportTypeID: id,
        InvestigationID: payload?.InvestigationID,
      })
      .then((res) => {
        setPayload({
          ...payload,
          COMMENT: res?.data?.message[0]?.TemplateText,
        });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const handleChange = (e) => {
    const { value } = e.target;
    console.log(value);
    FetchTemplateID(value);
  };

  useEffect(() => {
    fetch();
  }, []);
  return (
    <Modal show={show?.modal} size="lg">
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title" />

        <button type="button" className="close" onClick={handleClose}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3 w-25">
          <select className="form-control" onChange={handleChange}>
            <option hidden>Select Template</option>
            {TemplateDropdown?.map((data, index) => (
              <option value={data?.value} key={index}>
                {data?.label}
              </option>
            ))}
          </select>
        </div>
        <TextEditor
          value={payload?.COMMENT}
          setValue={setEditor}
          EditTable={EditTable}
          setEditTable={setEditTable}
        />
      </Modal.Body>
      <Modal.Footer>
        <button
          type="button"
          className="btn btn-success mx-2"
          onClick={() => {
            handleSave(payload, "TemplateMaster");
          }}
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

export default TemplateMasterModal;
