import React, { useEffect } from "react";
import { useState } from "react";
import { Modal, Table } from "react-bootstrap";
import Input from "../../ChildComponents/Input";
import axios from "axios";
import { toast } from "react-toastify";

import Loading from "./Loading";
import { isCheckedNew } from "./Commonservices";
import { useTranslation } from "react-i18next";

function DesignationModal({ show, onHandleClose }) {
  const [HeaderData, setHeaderData] = useState([]);
  const [TableData, setTableData] = useState([]);
  const [filterAllData,setFilterAllData] = useState([]);
  const [load, setLoad] = useState(false);

  const { t } = useTranslation();
  const fetchPageAccessRightsData = (id) => {
    axios
      .post("/api/v1/Menu/PageAccessRightsData", { DesignationID: id })
      .then((res) => {
        const data = res?.data?.message;
        setFilterAllData(data)
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

  const handleSearch = (e, data) => {
    const { value } = e?.target;
    let val = [...filterAllData];

    let filterDataNew = val.filter((ele) => {
      if (ele.MenuID === data?.MenuID) {
        if (ele?.PageName?.toLowerCase().includes(value.toLowerCase())) {
          return ele;
        }
      } else {
        return ele;
      }
    });

    setTableData(value ? filterDataNew : val);
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
        <Modal.Title className="modal-title">{t("Page Rights")}:</Modal.Title>
        <button type="button" className="close" onClick={onHandleClose}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div
          className="box-body divResult boottable table-responsive"
          id="no-more-tables"
        >
          {HeaderData?.map((ele, index) => (
            <table
              className="table table-bordered table-hover table-striped tbRecord"
              cellPadding="{0}"
              cellSpacing="{0}"
            >
              <thead key={index} className="cf">
                <tr>
                  <th className="w-100">{ele?.MenuName}</th>
                  <th style={{ color: "black" }}>
                    <Input onChange={(e) => handleSearch(e, ele)} />
                  </th>
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
                        <td data-title={t("PageName")} colSpan={2}>
                          {data?.PageName} &nbsp;
                        </td>
                        <td data-title={t("Allow")}>
                          <Input
                            type="checkbox"
                            checked={data?.Allow}
                            name="Allow"
                            onChange={(e) => handleChange(e, ind)}
                          />
                          &nbsp;
                        </td>
                      </tr>
                    )
                )}
              </tbody>
            </table>
          ))}
        </div>
        <div className="box-footer">
          <div className="row">
            <div className="col-sm-2">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={handleSubmit}
                >
                  {t("Save")}
                </button>
              )}
            </div>
            <div className="col-sm-2">
              <button
                className="btn btn-block btn-danger btn-sm"
                onClick={onHandleClose}
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

export default DesignationModal;
