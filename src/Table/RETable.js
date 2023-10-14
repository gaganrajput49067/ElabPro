import React, { useState } from "react";
import CustomModal from "../Frontend/util/CustomModal";
import parse from "html-react-parser";
import Loading from "../Frontend/util/Loading";
import { dateConfig } from "./../Frontend/util/DateConfig";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

function RETable({ redata, GetResultEntry, show, show2 }) {
  const [modal, setModal] = useState(false);
  const [visitID, setVisitID] = useState();
  const [loading, setLoading] = useState(false);
  const [Index, setIndex] = useState(-1);
  const [printLoading, setPrintLoading] = useState({
    loading: false,
    index: -1,
  });

  const { t } = useTranslation();

  const handleCheck = (data) => {
    let check = true;
    const datas = parse(data?.Test);

    if (datas.length > 0) {
      const val = datas?.map((ele) => {
        return ele?.props?.className;
      });
      return (check = val.includes("round Status-5"));
    } else {
      return (check = datas?.props?.className.includes("round Status-5"));
    }
  };

  const handleReport = (data, index) => {
    let TestIDHash = [];
    let documentlength = document.getElementsByClassName(
      data?.LedgerTransactionID
    );
    let isChecked = false;

    for (let i = 0; documentlength.length > i; i++) {
      if (
        documentlength[i].checked &&
        documentlength[i].id == data?.LedgerTransactionID
      ) {
        TestIDHash.push(
          document.getElementsByClassName(data?.LedgerTransactionID)[i].value
        );
      }
    }
    if (TestIDHash.length > 0) {
      setPrintLoading({
        loading: true,
        index: index,
      });
      axios
        .post(`/reports/v1/commonReports/GetLabReport`, {
          TestIDHash: TestIDHash,
        })
        .then((res) => {
          window.open(res?.data?.Url, "_blank");
          setPrintLoading({
            loading: false,
            index: -1,
          });
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : err?.data?.message
          );
          setPrintLoading({
            loading: false,
            index: -1,
          });
        });
    } else {
      toast.error("Please Select Test");
    }
  };

  const handleClickResultEntry = (data, index) => {
    setIndex(index);
    // if (data?.ReportType == 3) {
    //   toast.error(data?.Department);
    // } else {
    GetResultEntry(data?.TestID, setLoading);
    // }
  };

  return (
    <>
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
              <th>{t("Sin No")}</th>
              <th>{t("UHID")}</th>
              <th>{t("Name")} </th>
              <th>{t("Age")}</th>
              <th>{t("Test")}</th>
              <th>{t("Print")}</th>
              <th>{t("Doctor")}</th>
              <th>{t("Centre")}</th>
              <th>{t("Document")}</th>
              <th>{t("M.H")}</th>
            </tr>
          </thead>
          <tbody>
            {redata.map((data, index) => (
              <tr key={index}>
                <td
                  onClick={() => {
                    setModal(true);
                    setVisitID(data?.VisitNo);
                  }}
                  data-title={t("S.No")}
                >
                  <div>{index + 1}</div>
                  <i className="fa fa-search" />
                  &nbsp;
                </td>
                <td data-title={t("Reg Date")}>
                  {dateConfig(data?.Date)}&nbsp;
                </td>
                <td
                  onClick={() => {
                    handleClickResultEntry(data, index);
                  }}
                  data-title={t("Visit No")}
                  style={{ cursor: "pointer" }}
                >
                  <div className="text-primary">
                    {loading && index === Index ? <Loading /> : data?.VisitNo}
                  </div>
                  &nbsp;
                </td>
                <td data-title={t("Sin No")}>{data?.SinNo}&nbsp;</td>
                <td data-title={t("UHID")}>{data?.PatientCode}&nbsp;</td>
                <td data-title={t("Name")}>{data?.PatientName}&nbsp;</td>
                <td data-title={t("Age/Gender")}>
                  <div>
                    {data?.Age}/{data?.Gender}
                  </div>
                  &nbsp;
                </td>

                <td data-title={t("Test")}>{parse(data?.Test)}&nbsp;</td>

                <td data-title={t("Print")}>
                  {handleCheck(data) &&
                    (printLoading.loading && printLoading.index === index ? (
                      <Loading />
                    ) : (
                      <i
                        className="fa fa-print"
                        onClick={() => handleReport(data, index)}
                      ></i>
                    ))}
                  &nbsp;
                </td>

                <td data-title={t("Doctor")}>{data?.DoctorName} &nbsp;</td>
                <td data-title={t("Centre")}>{data?.Centre} &nbsp;</td>

                <td data-title={t("UploadDocumentCount")}>
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
                  &nbsp;
                </td>

                <td data-title={t("MedicalHistoryCount")}>
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
                  &nbsp;
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        t("No Data Found")
      )}
      {modal && (
        <CustomModal
          show={modal}
          visitID={visitID}
          onHide={() => setModal(false)}
        />
      )}
    </>
  );
}

export default RETable;
