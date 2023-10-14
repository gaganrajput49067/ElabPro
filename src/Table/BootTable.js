import React, { useState } from "react";
import { Link } from "react-router-dom";
import CustomModal from "../Frontend/util/CustomModal";
import { dateConfig } from "../Frontend/util/DateConfig";
import { IndexHandle } from "../Frontend/util/Commonservices/number";
import urgentGIF from "./../images/urgent1.gif";
import VIP from "./../images/vip.gif";
import axios from "axios";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Loading from "../Frontend/util/Loading";

function BootTable({ receiptData, show, currentPage, pageSize }) {
  const { t } = useTranslation();
  const [modal, setModal] = useState(false);
  const [visitID, setVisitID] = useState();
  const [printLoading, setPrintLoading] = useState({
    loading: false,
    index: -1,
  });

  const getReceipt = (id, index) => {
    setPrintLoading({
      loading: true,
      index: index,
    });
    axios
      .post("/reports/v1/getReceipt", {
        LedgerTransactionIDHash: id,
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
          err?.data?.response?.message
            ? err?.data?.response?.message
            : t("Error Occured")
        );
        setPrintLoading({
          loading: false,
          index: -1,
        });
      });
  };

  console.log(currentPage, pageSize);
  return (
    <div
      className=" box-body divResult boottable table-responsive"
      id="no-more-tables"
    >
      {receiptData.length > 0 ? (
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
              <th>{t("Patient Name")}</th>
              <th>{t("Age/Gender")}</th>
              <th>{t("Mobile No")}</th>
              <th>{t("Gross Amt")}</th>
              <th>{t("Dis Amt")}</th>
              <th>{t("Net Amt")}</th>
              <th>{t("Paid Amt")}</th>
              <th>{t("Centre")}</th>
              <th>{t("Doctor")}</th>
              <th>{t("User")}</th>
              <th>{t("Edit Info")}</th>
              <th>{t("Rec Edit")}</th>
              {/* <th>{t("Settlement")}</th> */}
              {receiptData.some((data) => data.canSettlement === 1) && (
                <th>{t("Settlement")}</th>
              )}
              {receiptData.some((data) => data.canDiscountAfterBill === 1) && (
                <th>{t("Discount")}</th>
              )}{" "}
              {receiptData.some((data) => data.canRefund === 1) && (
                <th>{t("Refund")}</th>
              )}
              {/* <th>{t("Discount")}</th> */}
              {/* <th>{t("Refund")}</th> */}
              <th>{t("Cash Receipt")}</th>
              {/* <th>{t("Trf Receipt")}</th> */}
              <th>{t("Concent form")}</th>
              <th>{t("View Details")}</th>
              <th>{t("Send Email")}</th>
              <th>{t("M.H")}</th>
            </tr>
          </thead>
          <tbody>
            {receiptData.map((data, index) => (
              <tr key={index}>
                <td data-title={t("S.No")}>
                  {index + 1 + IndexHandle(currentPage, pageSize)}

                  {data?.isUrgent === 1 && <img src={urgentGIF}></img>}
                  {data?.VIP === 1 && <img src={VIP}></img>}
                </td>
                <td data-title={t("Reg Date")}>
                  <div>{dateConfig(data.Date)}</div>
                </td>

                <td data-title={t("Visit No")}>{data?.LedgerTransactionNo}</td>
                <td data-title={t("Patient Name")}>
                  {data?.FirstName +
                    " " +
                    data?.MiddleName +
                    " " +
                    data?.LastName}
                </td>
                <td data-title={t("Age/Gender")}>
                  <div>
                    {data?.Age} / {data?.Gender}
                  </div>
                </td>

                <td data-title={t("Mobile No")}>{data?.Mobile}</td>

                <td data-title={t("Gross Amt")}>{data?.GrossAmount}</td>
                <td data-title={t("Dis Amt")}>{data?.DiscountOnTotal}</td>

                <td data-title={t("Net Amt")}>{data?.NetAmount}</td>
                <td data-title={t("Paid Amt")}>{data?.Adjustment}</td>

                <td data-title={t("Centre")}>{data?.Centre}</td>
                <td data-title={t("Doctor")}>{data?.DoctorName}</td>
                <td data-title={t("User")}>{data?.CreatedByName}</td>
                <td data-title={t("Edit Info")}>
                  <Link
                    to={`/EditPatientDetails`}
                    state={{ data: data?.LedgerTransactionNo }}
                  >
                    {t("Edit")}
                  </Link>
                </td>
                <td data-title="Rec Edit">
                  <Link
                    to={`/EditPatientInfo`}
                    state={{ data: data?.LedgerTransactionNo }}
                  >
                    {t("Edit Info")}
                  </Link>
                </td>
                {data.canSettlement === 1 && (
                  <td data-title="Settlement">
                    <Link
                      to={`/Settlement/${data?.LedgertransactionIDHash}`}
                      target="__blank"
                    >
                      {t("Settlement")}
                    </Link>
                  </td>
                )}

                {data.canDiscountAfterBill === 1 && (
                  <td data-title="Discount">
                    <Link
                      to={`/discountafterbill/${data?.LedgertransactionIDHash}`}
                      target="__blank"
                    >
                      {t("DiscountAfterBill")}
                    </Link>
                  </td>
                )}
                {data.canRefund === 1 && (
                  <td data-title={t("Refund")}>
                    <Link
                      to={`/RefundAfterBill/${data?.LedgertransactionIDHash}`}
                      target="__blank"
                    >
                      {t("Refund")}
                    </Link>
                  </td>
                )}
                <td data-title={t("Cash Receipt")}>
                  {printLoading.loading && printLoading.index === index ? (
                    <Loading />
                  ) : (
                    <i
                      className="fa fa-money text-info"
                      style={{ cursor: "pointer" }}
                      onClick={() =>
                        getReceipt(data?.LedgertransactionIDHash, index)
                      }
                    />
                  )}
                </td>

                <td data-title={t("Concent form")}>-</td>
                <td
                  data-title={t("View Details")}
                  onClick={() => {
                    setModal(true);
                    setVisitID(data?.LedgerTransactionNo);
                  }}
                >
                  <i className="fa fa-search" />
                </td>
                <td data-title={t("Send Email")}>
                  <i className="fa fa-envelope-o" />
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
        t("No Data Found")
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

export default BootTable;
