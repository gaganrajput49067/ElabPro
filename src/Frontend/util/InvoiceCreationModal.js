import React, { useMemo, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import Loading from "./Loading";

function InvoiceCreationModal({ show, data, onClose }) {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const fetch = () => {
    setLoading(true);
    axios
      .post("api/v1/Accounts/InvoiceDetails", data)
      .then((res) => {
        setTableData(res?.data?.message);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.data?.message ? err?.data?.message : "Something Went Wrong"
        );
        setLoading(false);
      });
  };

  //   const FetchData = useMemo(() => {
  //     fetch();
  //   }, [data]);

  useEffect(() => {
    fetch();
  }, []);

  return (
    <Modal show={show} size="lg">
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title"></Modal.Title>
        <button type="button" className="close" onClick={onClose}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="box-body">
          {loading ? (
            <Loading />
          ) : tableData?.length > 0 ? (
            <div
              className={`box-body divResult table-responsive`}
              id="no-more-tables"
            >
              <table
                className="table table-bordered table-hover table-striped tbRecord"
                cellPadding="{0}"
                cellSpacing="{0}"
              >
                <thead className="cf">
                  <tr>
                    <th>S.no</th>
                    {tableData.length > 0 &&
                      Object?.keys(tableData[0]).map((ele, index) => (
                        <th key={index}>{ele}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((ele, index) => (
                    <tr key={index}>
                      <td data-title={"S.No"}>{index + 1} &nbsp;</td>
                      {tableData.length > 0 &&
                        Object?.keys(ele).map((innerData, indexNew) => (
                          <td data-title={innerData} key={indexNew}>
                            {ele[innerData]} &nbsp;
                          </td>
                        ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            "No Data Found"
          )}
        </div>

        <div className="box-footer">
          <div className="row">
            <div className="col-sm-2">
              <button
                className="btn btn-block btn-danger btn-sm "
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default InvoiceCreationModal;
