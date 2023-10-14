import React, { useEffect } from "react";
import { useState } from "react";
import { Modal, Table } from "react-bootstrap";
import Input from "../../ChildComponents/Input";
import axios from "axios";
import { toast } from "react-toastify";

import Loading from "./Loading";
import { isCheckedNew } from "./Commonservices";

function DesignationModal({ show, onHandleClose }) {
  const [HeaderData, setHeaderData] = useState([]);
  const [TableData, setTableData] = useState([]);
  const [load, setLoad] = useState(false);

  const fetchPageAccessRightsData = (id) => {
    axios
      .post("/api/v1/Menu/PageAccessRightsData", { DesignationID: id })
      .then((res) => {
        const data = res?.data?.message;

        setTableData(data);

        let id = "";
        let headerData = data.filter((ele) => {
          if (ele.MenuName !== id) {
            id = ele?.MenuName;
            return ele;
          } else {
            id = ele?.MenuName;
          }
        });
        setHeaderData(headerData);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  const handleChange = (e, index, find) => {
    const { name, checked } = e.target;

    if (index >= 0) {
      const data = [...TableData];
      data[index][name] = checked === true ? 1 : 0;
      setTableData(data);
    } else {
      const data = TableData.map((ele) => {
        if (ele?.MenuName === find) {
          return {
            ...ele,
            [name]: checked === true ? 1 : 0,
          };
        } else {
          return ele;
        }
      });
      setTableData(data);
    }
  };

  const handleSubmit = () => {
    const data = TableData.filter((ele) => ele?.Allow === 1);
    if (data.length > 0) {
      setLoad(true);
      const val = data.map((ele) => {
        return {
          ...ele,
          DesignationID: show?.id,
        };
      });
      axios
        .post("/api/v1/Menu/AddPageRightsData", val)
        .then((res) => {
          toast.success(res?.data?.message);
          setLoad(false);
          onHandleClose();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          );
          setLoad(false);
        });
    } else {
      toast.error("Please Select Atleast One");
    }
  };

  useEffect(() => {
    fetchPageAccessRightsData(show?.id);
  }, []);
  return (
    <Modal show={show?.modal}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">Page Rights : Man</Modal.Title>
        <button type="button" className="close" onClick={onHandleClose}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="p-2" style={{ height: "350px", overflowY: "scroll" }}>
          {HeaderData?.map((ele, index) => (
            <Table responsive hover bordered>
              <thead key={index} style={{ backgroundColor: "#8ac2ed" }}>
                <tr>
                  <th className="w-100">{ele?.MenuName}</th>
                  <th>
                    <Input
                      type="checkbox"
                      name="Allow"
                      onChange={(e) => handleChange(e, -1, ele?.MenuName)}
                      checked={
                        TableData?.length > 0
                          ? isCheckedNew(
                              "Allow",
                              TableData,
                              1,
                              ele?.MenuName,
                              "MenuName"
                            ).includes(false)
                            ? false
                            : true
                          : false
                      }
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {TableData?.map(
                  (data, ind) =>
                    data?.MenuName === ele?.MenuName && (
                      <tr key={ind}>
                        <td>{data?.PageName}</td>
                        <td>
                          <Input
                            type="checkbox"
                            checked={data?.Allow}
                            name="Allow"
                            onChange={(e) => handleChange(e, ind)}
                          />
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </Table>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {load ? (
          <Loading />
        ) : (
          <button
            className="btn btn-success"
            style={{ display: "flex", justifyItems: "flex-start" }}
            onClick={handleSubmit}
          >
            Save
          </button>
        )}
          <button
            className="btn btn-danger"
            style={{ display: "flex", justifyItems: "flex-end" }}
            onClick={onHandleClose}
          >
            Close
          </button>
      
      </Modal.Footer>
    </Modal>
  );
}

export default DesignationModal;
