import axios from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import AuditTrailDataTable from "../../Table/AuditTrailDataTable";

function CustomModal({ visitID, show, onHide}) {
  const [optionData, setOptionData] = useState([]);

  const [auditValue, setAuditValue] = useState({
    VisitNo: visitID,
    ItemId: "",
  });

  const [tableData, setTableData] = useState([]);

  const handleChange = (e) => {
    setAuditValue({
      ...auditValue,
      ItemId: e.target.value,
    });
  };

  const selectOption = () => {
    axios
      .post("/api/v1/TestData/BindTest", { VisitNo: visitID })
      .then((res) => {
        setOptionData(res?.data?.message);
      })
      .catch((err) => console.log(err));
  };

  const auditApiData = () => {
    axios
      .post("/api/v1/TestData/GetAuditTrailData", auditValue)
      .then((res) => {
        setTableData(res?.data?.message);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    selectOption();
  }, [visitID]);

  useEffect(() => {
    auditApiData();
  }, [auditValue.ItemId]);
  return (
    <Modal {...{ show, onHide }} size="lg" centered>
      <Modal.Header>
        <div className="modal-custom-css">
          {tableData[0]?.pname}
          <i className="fa fa-times" aria-hidden="true" onClick={onHide}></i>
        </div>
      </Modal.Header>
      <Modal.Body>
        <select className="form-control" onChange={handleChange}>
          <option value="">All</option>
          {optionData.map((data, index) => (
            <option value={data.ItemId} key={index}>
              {data.ItemName}
            </option>
          ))}
        </select>

        <AuditTrailDataTable tableData={tableData} />
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-danger" onClick={onHide}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default CustomModal;
