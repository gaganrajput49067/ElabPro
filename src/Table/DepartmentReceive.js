import moment from "moment";
import React, { useState, useEffect } from "react";
import { Table } from "react-bootstrap";
import CustomModal from "../Frontend/util/CustomModal";
import parse from "html-react-parser";
import Input from "../ChildComponents/Input";
import RejectModal from "../Frontend/util/RejectModal";
import { dateConfig } from "./../Frontend/util/DateConfig";
import urgentGIF from "./../images/urgent1.gif";
import VIP from "./../images/vip.gif";

import { useTranslation } from "react-i18next";

function DepartmentReceiveTable({
  drdata,
  setSaveTestId,
  saveTestId,
  show,
  show2,
  TableData,
}) {
  const [modal, setModal] = useState(false);
  const [visitID, setVisitID] = useState();
  const [show1, setShow1] = useState({
    modal: false,
    data: {},
  });

  // i18n start

  const { t } = useTranslation();
  // i18n end

  const handleShow = (data) => {
    setShow1({
      modal: !show1?.modal,
      data: data,
    });
  };

  const handleTestID = (e, data) => {
    const { checked } = e.target;
    if (checked) {
      setSaveTestId([...saveTestId, data]);
    } else {
      const filterdata = saveTestId.filter(
        (ele) => ele?.TestID !== data?.TestID
      );
      setSaveTestId(filterdata);
    }
  };

  return (
    <div className="">
      {show1 && (
        <RejectModal
          show={show1?.modal}
          handleShow={handleShow}
          data={show1?.data}
          TableData={TableData}
        />
      )}
      {drdata.length > 0 ? (
        <table
          className="table table-bordered table-hover table-striped tbRecord"
          cellPadding="{0}"
          cellSpacing="{0}"
        >
          <thead>
            <tr>
              <th>{t("S.No")}</th>
              <th>{t("Sin No")}</th>
              <th>{t("Reg Date")}</th>
              <th>{t("Visit No")}</th>
              <th>{t("UHID")}</th>
              <th>{t("Name")} </th>
              <th>{t("Age")}</th>
              <th>{t("SampleType")}</th>
              <th>{t("Department")}</th>
              <th>{t("Test")}</th>
              <th>{t("Reject")}</th>
              <th>{t("Document")}</th>
              <th>{t("M.H")}</th>
              <th>
                <div>{t("Action")}</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {drdata.map((data, index) => (
              <tr key={index}>
                <td
                  data-title="SNo"
                  className={`color-Status-${data.Status}`}
                  onClick={() => {
                    setModal(true);
                    setVisitID(data?.VisitNo);
                  }}
                >
                  <div>
                    {index + 1}

                    {data?.isUrgent === 1 && <img src={urgentGIF}></img>}
                    {data?.VIP === 1 && <img src={VIP}></img>}
                    <i className="fa fa-search" />
                  </div>
                </td>

                <td data-title={t("SinNo")}>{data?.SinNo}</td>
                <td data-title={t("Date")}>
                  <div>{dateConfig(data.Date)}</div>
                </td>
                <td data-title={t("VisitNo")}>{data?.VisitNo}</td>
                <td data-title={t("PatientCode")}>{data?.PatientCode}</td>
                <td data-title={t("PName")}>{data?.PName}</td>
                <td data-title={t("Gender")}>
                  <div>
                    {data?.Age}/{data?.Gender}
                  </div>
                </td>
                <td data-title={t("SampleName")}>{data?.SampleName}</td>
                <td data-title={t("Department")}>{parse(data?.Department)}</td>

                <td data-title={t("ItemName")}>{parse(data?.ItemName)}</td>
                {(data?.Status === 4 || data?.Status === 5) ? (
                  <td></td>
                ) : (
                  <td data-title={t("Reject")}>
                    <button
                      className="btn btn-danger btn-xs"
                      onClick={() => handleShow(data)}
                    >
                     {t("Reject")}
                    </button>
                  </td>
                )}
                <td data-title={t("File Count")}>
                  <div
                    className="text-info"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      show2({
                        modal: true,
                        data: data?.LedgertransactionIDHash,
                        index: index,
                      });
                    }}
                  >
                    <i className="fa fa-cloud-upload">
                      ({data?.UploadDocumentCount})
                    </i>
                  </div>
                </td>

                <td data-title={t("Medical History")}>
                  <div
                    className="text-info"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      show({
                        modal: true,
                        data: data?.LedgertransactionIDHash,
                        index: index,
                      });
                    }}
                  >
                    <i className="fa fa-history">
                      ({data?.MedicalHistoryCount})
                    </i>
                  </div>
                </td>
                <td data-title={t("Select")}>
                  {data.Status === 2 && (
                    <Input
                      type="checkbox"
                      onChange={(e) => handleTestID(e, data)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        (t("No Data Found"))
      )}

      {modal && (
        <CustomModal
          show={modal}
          visitID={visitID}
          onHide={() => setModal(false)}
        />
      )}
    </div>
  );
}

export default DepartmentReceiveTable;
