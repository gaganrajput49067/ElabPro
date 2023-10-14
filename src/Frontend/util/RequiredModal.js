import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Modal, Table } from "react-bootstrap";
import Input from "../../ChildComponents/Input";
import { useTranslation } from "react-i18next";

function RequiredModal({ RequiredShow, handleClose }) {
  const [tableData, setTableData] = useState([]);
  const handleGet = () => {
    axios
      .post("/api/v1/TestData/checkMandatoryFields", {
        invIds: RequiredShow?.FieldIDs,
        isEditPage: false,
        LedgerTransactionID: "",
      })
      .then((res) => {
        setTableData(res?.data?.message);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    handleGet();
  }, []);
  const { t } = useTranslation();
  return (
    <Modal show={RequiredShow?.show}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title" />
      {t("Mandatory Required Fields")} 
        <button type="button" className="close" onClick={handleClose}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="box-body">
          <div className="row">
            <div className="col-12">
              <table
                className="table table-bordered table-hover table-responsive table-striped tbRecord"
                cellPadding="{0}"
                cellSpacing="{0}"
              >
                <thead className="cf">
                  <tr>
                    <th>{t("Attributes")}</th>
                    <th>{t("Required Parameters")}</th>
                    <th>{t("Test Name")}</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((ele, index) => (
                    <tr key={index}>
                      <td>{ele?.FieldName}</td>
                      <td>
                        <div className="row">
                          <div className="col-xs-6">
                            <Input className="select-input-box form-control input-sm" />
                          </div>
                          <div className="col-xs-6">
                            <select className="select-input-box form-control input-sm">
                              <option>1</option>
                            </select>
                          </div>
                        </div>
                      </td>
                    <td>{t("Package")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default RequiredModal;
