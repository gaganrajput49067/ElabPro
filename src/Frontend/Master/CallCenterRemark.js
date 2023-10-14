import React, { useEffect, useState } from "react";
import Input from "../../ChildComponents/Input";
import axios from "axios";
import { toast } from "react-toastify";
import { Table } from "react-bootstrap";
import Loading from "../../Frontend/util/Loading";

import { useTranslation } from "react-i18next";
const CallCenterRemark = () => {
  const [Load, setLoad] = useState(true);
  const [Load1, setLoad1] = useState(false);
  const [callRemarkTableBind, setCallRemarkTableBind] = useState([]);
  const [payload, setPayload] = useState({
    Remark: "",
    isActive: "0",
  });
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const fetchTableData = () => {
    setLoad(true);
    axios
      .get("/api/v1/CallCenterRemark/GetRemarkData")
      .then((res) => {
        const data = res?.data?.message;
        if (data.length > 0) {
          setCallRemarkTableBind(data);
        } else {
          toast.error("No Data found");
        }
        setLoad(false);
      })
      .catch((err) => {
        toast.error(err?.data?.message ? err?.data?.message : "Error Occured");
        setLoad(false);
      });
  };

  const handleSubmit = (url) => {
    if (payload?.Remark.length > 3) {
      setLoad1(true);
      axios
        .post(url, payload)
        .then((res) => {
          toast.success(res?.data?.message);
          setLoad1(false);
          fetchTableData();
          setPayload({
            Remark: "",
            isActive: "0",
          });
        })
        .catch((err) => {
          toast.error(
            err?.data?.message ? err?.data?.message : "Error Occured"
          );
          setLoad1(false);
        });
    } else {
      toast.error("Please Enter Remark");
    }
  };

  const handleUpdateData = (id) => {
    axios
      .post("/api/v1/CallCenterRemark/GetSingleRemark", {
        ID: id,
      })
      .then((res) => {
        const data = res?.data?.message[0];
        setPayload({
          ID: data?.ID,
          isActive: data?.Active === "Yes" ? "1" : "0",
          Remark: data?.Remarks,
        });
      })
      .catch((err) => {
        toast.error(err?.data?.message ? err?.data?.message : "Error Occured");
      });
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h6 className="box-title">{t("Call Center Remark")}</h6>
        </div>

        <div className="box-body">
          <div className="row">
          <label className="col-sm-1">{t("Remark")}:</label>
            <div className="col-sm-2">
              <Input
                placeholder={t("Remark")}
                className="form-control ui-autocomplete-input input-sm"
                type="text"
                name="Remark"
                onChange={handleChange}
                value={payload?.Remark}
              />
            </div>
            <div className="col-sm-2">
              <Input
                type="checkbox"
                name="isActive"
                onChange={handleChange}
                checked={payload?.isActive === "1" ? true : false}
              />
              <label className="control-label">{t("Is Active")}</label>
            </div>
            <div className="col-sm-1">
              {Load1 ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={() =>
                    handleSubmit(
                      payload?.ID
                        ? "/api/v1/CallCenterRemark/UpdateRemark"
                        : "/api/v1/CallCenterRemark/InsertRemark"
                    )
                  }
                >
                  {payload?.ID ? t("Update") : t("Save")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {Load ? (
        <Loading />
      ) : (
        <div className="box-body divResult table-responsive boottable" id="no-more-tables">
          <table
            className="table table-bordered table-hover table-striped tbRecord"
            cellPadding="{0}"
            cellSpacing="{0}"
          >
            <thead className="cf">
              <tr>
                <th>{t("S.No")}</th>
                <th>{t("Remark")}</th>
                <th>{t("Active")}</th>
                <th>{t("ID")}</th>
              </tr>
            </thead>
            <tbody>
              {callRemarkTableBind?.map((ele, index) => (
                <tr>
                  <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                  <td data-title={t("Remark")}>{ele?.Remarks}&nbsp;</td>
                  <td data-title={t("Active")}>{ele?.Active}&nbsp;</td>
                  <td data-title={t("ID")}>
                    <div className="col-sm-3">
                      <button
                        className="btn btn-block btn-info btn-sm"
                        onClick={() => handleUpdateData(ele?.ID)}
                      >
                        {t("Edit")}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default CallCenterRemark;
