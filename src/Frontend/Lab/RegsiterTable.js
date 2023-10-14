import moment from "moment";
import React from "react";
import { useState } from "react";
import TestNameModal from "../util/TestNameModal";
import UrgentModal from "../util/UrgentModal";
import { toast } from "react-toastify";
import { dateConfig } from "../util/DateConfig";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { number } from "yup";


function RegsiterTable({
  data,
  handleFilter,
  index,
  handleDiscount,
  handlePLOChange,
  handleUrgent,
  handleRateTypePaymode,
  Edit,
  tableData,
  LTData,
}) {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);

  const handleClose = () => {
    setShow(false);
  };

  const handleClose2 = () => {
    setShow2(false);
  };

  const handleMainClose = () => {};

  const { t } = useTranslation();
 

  return (
    <>
      {show && (
        <UrgentModal
          show={show}
          handleClose={handleClose}
          handleMainClose={handleMainClose}
          handleUrgent={handleUrgent}
          handlePLOChange={handlePLOChange}
          index={index}
        />
      )}
      {show2 && (
        <TestNameModal
          show={show2}
          onHandleShow={handleClose2}
          id={data?.InvestigationID}
        />
      )}
      <td data-title="S.No">
        {index + 1}
        <button
          className="btn btn-danger btn-sm"
          onClick={() => {
            handleFilter(data);
          }}
        >
          X
        </button>
      </td>

      <td data-title={t("TestCode")}>{data.TestCode}</td>
      <td data-title={t("RequiredAttachment")}>
        <div>{data.TestName}</div>
        <small className="text-danger">
          {data?.RequiredAttachment !== "" &&
            data?.RequiredAttachment + " Req."}
        </small>
      </td>
      <td data-title={t("View")} onClick={() => setShow2(true)}>
        <i className="fa fa-search" />
      </td>
      <td data-title={t("Rate")}>{data?.Rate}</td>
      <td data-title={t("Disc.")}>
        <input
          style={{ width: "50px" }}
          type="number"
          onInput={(e)=>number(e,20)}
          min={0}
          value={data?.Discount}
          onChange={(e) => {
            if (Number(data?.Rate) < Number(e.target.value)) {
              toast.error(t("Please Give Valid Discount"));
            } else {
              handleDiscount(e.target.value, index);
            }
          }}
          disabled={
            handleRateTypePaymode === "Credit"
              ? true
              : LTData?.DiscountApprovedBy
              ? true
              : false
          }
        />
      </td>
      <td data-title={t("NetAmount")}>
        <input
          className="currency"
          value={Number(data?.NetAmount).toFixed(2)}
          disabled
          style={{ width: "50px" }}
        />
      </td>
      <td data-title={t("deleiveryDate")}>{dateConfig(data.deleiveryDate)}</td>
      <td data-title={t("SC")}>
        <input
          type="checkbox"
          name="Status"
          value={data?.Status}
          disabled={data?.isDisable}
          checked={data?.Status === 2 ? true : false}
          onChange={(e) => handlePLOChange(e, index)}
        />
      </td>
      <td data-title={t("IsUrgent")}>
        <input
          type="checkbox"
          name={"IsUrgent"}
          checked={data?.IsUrgent}
          disabled={data?.isDisable}
          onChange={(e) => {
            handlePLOChange(e, index);
            if (e.target.checked === true) {
              setShow(true);
            } else {
              setShow(false);
            }
          }}
        />
      </td>
    </>
  );
}

export default RegsiterTable;
