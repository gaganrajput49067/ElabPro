import moment from "moment";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import CustomModal from "../Frontend/util/CustomModal";
import parse from "html-react-parser";
import Loading from "../Frontend/util/Loading";
import { useTranslation } from "react-i18next";
function RECultureTable({ redata, GetResultEntryCulture, show }) {
  const [modal, setModal] = useState(false);
  const [visitID, setVisitID] = useState();
  const [loading, setLoading] = useState(false);
  const [Index, setIndex] = useState(-1);
  const { t } = useTranslation();
  return (
    <div className="box-body divResult table-responsive boottable" id="no-more-tables">
      {redata.length > 0 ? (
        <table 
        className="table table-bordered table-hover table-striped tbRecord"
        cellPadding="{0}"
        cellSpacing="{0}"
        >
          <thead className="cf">
            <tr>
              <th>{t("S.No")}</th>
              <th>{t("Reg Date")}</th>
              <th>{t("Visit No")}</th>
              <th>{t("SIN NO")}</th>
              <th>{t("UHID")}</th>
              <th>{t("Name")}</th>
              <th>{t("Age")}</th>
              <th>{t("Test")}</th>
              <th>{t("Print")}</th>
              <th>{t("Doctor")}</th>
              <th>{t("Centre")}</th>
              <th>{t("Upload")}</th>
              <th>{t("Medical History")}</th>
            </tr>
          </thead>
          <tbody>
            {redata.map((data, index) => (
              <tr key={index}>
                <td data-title={t("S.No")}
                  onClick={() => {
                    setModal(true);
                    setVisitID(data?.VisitNo);
                  }}
                >
                  <div>{index + 1}&nbsp;</div>
                  <i className="fa fa-search" />
                </td>
                <td data-title={t("Reg Date")}>
                  <div>{moment(data.Date).format("DD/MMM/YYYY")}&nbsp;</div>
                  <div>{moment(data?.Date).format("hh:mm:ss a")}&nbsp;</div>
                </td>
                <td data-title={t("Visit No")}
                  onClick={() => {
                    GetResultEntryCulture(data?.LedgerTransactionID, setLoading);
                    setIndex(index);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <div className="text-primary">
                    {loading && index === Index ? <Loading /> : data?.VisitNo}&nbsp;
                  </div>
                </td>
                <td data-title={t("SIN NO")}>{data?.SinNo}&nbsp;</td>
                <td data-title={t("UHID")}>{data?.PatientCode}&nbsp;</td>
                <td data-title={t("Name")}>{data?.PatientName}&nbsp;</td>
                <td data-title={t("Age")}>
                  <div>{data?.Age}&nbsp;</div>
                  <div>{data?.Gender}&nbsp;</div>
                </td>

                <td data-title={t("Test")}>{parse(data?.Test)}&nbsp;</td>

                <td data-title={t("Print")}>{}&nbsp;</td>

                <td data-title={t("Doctor")}>{data?.DoctorName}&nbsp;</td>
                <td data-title={t("Centre")}>{data?.Centre}&nbsp;</td>

                <td data-title={t("Upload")}>{}&nbsp;</td>

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
                    See Medicial History({data?.MedicalHistoryCount})&nbsp;
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        "No Data Found"
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

export default RECultureTable;
