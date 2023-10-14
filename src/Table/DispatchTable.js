import React, { useState } from "react";
import { Link } from "react-router-dom";
import CustomModal from "../Frontend/util/CustomModal";
import parse from "html-react-parser";
import { dateConfig } from "./../Frontend/util/DateConfig";
// import urgentGIF from "./../images/urgent1.gif";
import VIP from "./../images/vip.gif";
import { toast } from "react-toastify";
import axios from "axios";

import { useTranslation } from "react-i18next";
import Loading from "../Frontend/util/Loading";
function DispatchTable({ dispatchData, show, show2 }) {
  const [modal, setModal] = useState(false);
  const [visitID, setVisitID] = useState();
  const [printLoading, setPrintLoading] = useState({
    loading: false,
    index: -1,
  });

  const handleReport = (data,index) => {
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
  return (
    <div className=" box-body divResult boottable" id="no-more-tables">
      {dispatchData.length > 0 ? (
        <table
          className="table table-bordered table-hover table-striped tbRecord"
          cellPadding="{0}"
          cellSpacing="{0}"
        >
          <thead class="cf">
            <tr>
              <th>{t("S.No")}</th>
              <th>{t("Reg Date")}</th>
              <th>{t("Visit No")}</th>
              <th>{t("SIN NO")}</th>
              <th>{t("UHID")}</th>
              <th>{t("Name")}</th>
              <th>{t("Age/Gender")}</th>
              <th>{t("Test")}</th>
              <th>{t("Print")}</th>
              <th>{t("Doctor")}</th>
              <th>{t("Centre")}</th>
              {/* <th>Email</th> */}
              <th>{t("Document")}</th>
              <th>{t("M.H")}</th>
            </tr>
          </thead>
          <tbody>
            {dispatchData.map((data, index) => (
              <tr key={index}>
                <td
                  data-title={t("S.No")}
                  onClick={() => {
                    setModal(true);
                    setVisitID(data?.VisitNo);
                  }}
                >
                  <div>
                    {index + 1}&nbsp;
                    {/* {data?.isUrgent === 1 && <img src={urgentGIF}></img>} */}
                    {data?.VIP === 1 && <img src={VIP}></img>}
                    <i className="fa fa-search"/>
                  </div>
                </td>
                <td data-title={t("Reg Date")}>
                  <div>{dateConfig(data.Date)}</div>
                </td>

                <td data-title={t("Visit No")}>{data?.VisitNo}&nbsp;</td>
                <td data-title={t("SIN NO")}>{data?.SinNo}&nbsp;</td>
                <td data-title={t("UHID")}>{data?.PatientCode}&nbsp;</td>
                <td data-title={t("Name")}>{data?.PatientName}&nbsp;</td>
                <td data-title={t("Age/Gender")}>
                  <div>
                    {data?.Age}/{data?.Gender}&nbsp;
                  </div>
                </td>

                <td className="w-100" data-title={t("Test")}>
                  {parse(data?.Test)}&nbsp;
                </td>

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

                <td data-title={t("Doctor")}>{data?.DoctorName}&nbsp;</td>
                <td data-title={t("Centre")}>{data?.Centre}&nbsp;</td>

                {/* <td data-title="Email">
                  <Link to="">Send Email</Link>
                </td> */}

                <td data-title={t("Upload")}>
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

export default DispatchTable;
