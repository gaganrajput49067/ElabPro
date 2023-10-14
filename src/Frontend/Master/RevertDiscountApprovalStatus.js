import React from "react";
import Input from "../../ChildComponents/Input";
import { useState } from "react";
import Loading from "../../Frontend/util/Loading";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

import { useTranslation } from "react-i18next";
const RevertDiscountApprovalStatus = () => {
  const [input, setInput] = useState({
    labNo: "",
  });
  const [data, setData] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const { t} = useTranslation();
  const fetch = () => {
    setSearchLoading(true);
    axios
      .post("/api/v1/RevertDiscountApprovalStatus/SearchRevertData", {
        labNo: input?.labNo,
      })
      .then((res) => {
        const data = res?.data?.message;
        if (data.length > 0) {
          setData(data);
        } else {
          toast.error("No Data Found");
        }
        setSearchLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
        setSearchLoading(false);
      });
  };

  const handleReset = (id) => {
    axios
      .post("/api/v1/RevertDiscountApprovalStatus/UpdateRevertStatus", {
        labId: id,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setData([]);
        setInput({ labNo: "" });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
      });
  };

 
  return (
    <div className="box box-success form-horizontal">
    <div className="box-header with-border">
              <h3 className="box-title">
                {t("Revert Discount Approval Status")}
              </h3>
            </div>
          <div className="box-body px-3">
            <div className="row">
              <div className="col-sm-2 col-md-2 mt-4">
                {/* <label className="control-label">Lab No.</label> */}
                <Input
                  className="select-input-box form-control input-sm"
                  type="text"
                  placeholder={t("Lab No")}
                  name="labNo"
                  value={input.labNo}
                  onChange={handleChange}
                />
              </div>

          <div
            className="col-sm-1 col-md-1 mt-4"
            style={{ alignSelf: "flex-end" }}
          >
            <button
              className="btn btn-block btn-info btn-sm"
              onClick={fetch}
              disabled={input?.labNo.length > 3 ? false : true}
            >
              {t("Search")}
            </button>
          </div>
        </div>
      </div>

      {searchLoading ? (
        <Loading />
      ) : (
        data.length > 0 && (
          <div className="box form-horizontal">
            <div className="box-header with-border">
              <h3 className="box-title">{t("Search Result")}</h3>
            </div>
            <div
              className="box-body table-responsive divResult boottable"
              id="no-more-tables"
            >
              <div className="row">
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf">
                    <tr>
                      <th>{t("S.No")}</th>
                      <th>{t("Lab No")}</th>
                      {/* <th>Lab ID.</th> */}
                      <th>{t("PName")}</th>
                      <th>{t("Date")}</th>
                      <th>{t("DiscountApprovedByName")}</th>
                      <th>{t("NetAmount")}</th>
                      <th>{t("DiscountOnTotal")}</th>
                      <th>{t("STATUS")}</th>
                      <th>{t("IsDiscountApproved")}</th>
                      <th>{t("DiscountStatus")}</th>
                      <th>{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                          <td data-title={t("Lab No")}>
                            {item.LedgertransactionNo}&nbsp;
                          </td>
                          {/* <td>{item.LedgertransactionId}</td> */}
                          <td data-title={t("PName")}>{item.PName}&nbsp;</td>
                          <td data-title={t("Date")}>{item.DATE}&nbsp;</td>
                          <td data-title={t("DiscountApprovedByName")}>
                            {item.DiscountApprovedByName}&nbsp;
                          </td>
                          <td data-title={t("NetAmount")}>{item.NetAmount}&nbsp;</td>
                          <td data-title={t("DiscountOnTotal")}>
                            {item.DiscountOnTotal}&nbsp;
                          </td>
                          <td data-title={t("STATUS")}>{item.STATUS}&nbsp;</td>
                          <td data-title={t("IsDiscountApproved")}>
                            {item.IsDiscountApproved}&nbsp;
                          </td>
                          <td data-title={t("DiscountStatus")}>
                            {item.DiscountStatus}&nbsp;
                          </td>
                          <td data-title={t("Action")}>
                            <button
                              className="btn btn-block btn-danger btn-sm"
                              onClick={() =>
                                handleReset(item.LedgertransactionId)
                              }
                            >
                              {t("Reset Status")}&nbsp;
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default RevertDiscountApprovalStatus;
