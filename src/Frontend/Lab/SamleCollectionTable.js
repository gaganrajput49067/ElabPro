import React, { useState, useEffect } from "react";
import { SampleSource } from "../../ChildComponents/Constants";
import { getSampleType } from "../util/Commonservices";
import moment from "moment";
import Input from "./../../ChildComponents/Input";
import RejectModal from "../util/RejectModal";
import { toast } from "react-toastify";
import { dateConfig } from "../util/DateConfig";
import { useTranslation } from "react-i18next";

function SamleCollectionTable({
  data,
  index,
  payload,
  setPayload,
  setSearchInvdata,
  searchInvdata,
  TableData,
  handleBarcode,
  handleCloseBarcodeModal,
}) {
  const [sampleTypeDropdown, setSampleTypeDropdown] = useState([]);
  const [show, setShow] = useState(false);

  // i18n start

  const { t } = useTranslation();
  
  // i18n end

  const handleShow = () => {
    setShow(!show);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const data = [...searchInvdata];
    if (name === "SampleTypeID") {
      const selctedvalue = sampleTypeDropdown.find((ele) => ele.value == value);
      data[index][name] = selctedvalue?.value;
      data[index]["SampleType"] = selctedvalue?.label;
      setSearchInvdata(data);
    } else {
      data[index][name] = value;
      setSearchInvdata(data);
    }
  };

  const handlePayload = (e, index, data) => {
    const { checked } = e.target;
    if (checked) {
      if (data?.SINNo?.length >= 3) {
        const val = [...searchInvdata];
        val[index]["isSelected"] = checked;
        setSearchInvdata(val);
        setPayload([...payload, data]);
      } else {
        toast.error(
          t("Barcode is Required Field and Should Contain atleast 3 character")
        );
      }
    } else {
      const val = [...searchInvdata];
      val[index]["isSelected"] = checked;
      setSearchInvdata(val);
      const filterdata = payload.filter((ele) => ele?.TestID !== data?.TestID);
      setPayload(filterdata);
    }
  };

  useEffect(() => {
    getSampleType(setSampleTypeDropdown, data?.InvestigationID);
  }, []);

  console.log(data?.isSelected);

  return (
    <>
      {show && (
        <RejectModal
          show={show}
          handleShow={handleShow}
          data={data}
          TableData={TableData}
        />
      )}
      <td className={`color-Status-${data.Status}`} data-title={t("S.No")}>
        <div>{index + 1}</div>&nbsp;
      </td>

      <td data-title={t("Date")}>{dateConfig(data?.Date)}&nbsp;</td>
      <td data-title={t("VisitNo")}>{data?.VisitNo}&nbsp;</td>
      <td data-title={t("PName")}>{data?.PName}&nbsp;</td>

      <td data-title={t("Test")}>{data?.Test}&nbsp;</td>
      <td data-title={t("Sin No")}>
        <Input
          value={data?.SINNo}
          name="SINNo"
          className="form-control input-sm"
          max={15}
          disabled={
            [1, 2].includes(data?.BarcodeLogic)
              ? true
              : data?.isSelected === true
              ? true
              : false
          }
          onChange={(e) =>
            handleBarcode(e, data?.BarcodeLogic, data?.SampleTypeID)
          }
          onBlur={(e) => {
            handleCloseBarcodeModal(
              e.target.value,
              data?.LedgerTransactionID,
              data?.BarcodeLogic,
              data?.SampleTypeID
            );
          }}
        />
        &nbsp;
      </td>
      <td data-title={t("Source")}>
        <select
          className="form-control input-sm"
          onChange={(e) => handleChange(e, index)}
          name="Source"
          value={data?.Source}
        >
          {SampleSource.map((select, index) => (
            <option value={select?.label} key={index}>
              {select?.label}
            </option>
          ))}
        </select>
        &nbsp;
      </td>
      <td data-title={t("SampleQty")}>{data?.SampleQty}&nbsp;</td>
      <td data-title={t("SampleTypeID")}>
        <select
          className="form-control input-sm"
          name="SampleTypeID"
          onChange={(e) => handleChange(e, index)}
          value={data?.SampleTypeID}
        >
          {sampleTypeDropdown.map((select, ind) => (
            <option value={select?.value} key={ind}>
              {select?.label}
            </option>
          ))}
        </select>
        &nbsp;
      </td>
      <td data-title={t("Reject")}>
        {data.Approved === 0 && data.Status != 4 && (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => {
              handleShow();
            }}
          >
            {t("Reject")}
          </button>
        )}
        &nbsp;
      </td>
      <td data-title={t("Select")}>
        {(data.Status === 1 || data.Status === 4) && (
          <Input
            disabled={data.Status == 1 || data.Status == 4 ? false : true}
            checked={data?.isSelected}
            type="checkbox"
            onChange={(e) => {
              setTimeout(handlePayload(e, index, data), 3000);
            }}
          />
        )}
        &nbsp;
      </td>
    </>
  );
}

export default SamleCollectionTable;
