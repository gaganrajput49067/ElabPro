import React from "react";
import { Table } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../Frontend/util/Loading";
import { Link } from "react-router-dom";
import AgeWiseModal from "../../Frontend/util/AgeWiseModal";
import { toast } from "react-toastify";
import { dateConfig } from "../../Frontend/util/DateConfig";
import { useTranslation } from "react-i18next";

const AgeWiseDiscountList = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [DiscountId, setDiscountId] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAgeWiseDiscountList = () => {
    axios
      .get("/api/v1/AgeWiseDiscount/AllAgeWiseDiscountData")
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAgeWiseDiscountList();
  }, []);

  const disableData = (Id) => {
    if (window.confirm("Are You Sure?")) {
      axios
        .post("/api/v1/AgeWiseDiscount/DeActiveAgeWiseDiscountData", {
          ID: Id,
        })
        .then((res) => {
          if (res?.data?.message === "This record De-Activate Successfully") {
            toast.success(res?.data?.message);
            getAgeWiseDiscountList();
          }
          // if(res.data?.message==="")
          // getAgeWiseDiscountList();
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <>
      <div className="box box-success">
        {DiscountId && show && (
          <AgeWiseModal
            show={show}
            handleClose={handleClose}
            DiscountData={DiscountId}
          />
        )}
        <div className="box-header with-border">
          <h3 className="box-title">{t("AgeWiseDiscountList")}</h3>
          <Link
          style={{ float: "right" }}
            className="list_one"
            to="/AgeWiseDiscount"
            state={{
              url: "/api/v1/AgeWiseDiscount/InsertAgeWiseDiscountData",
            }}
          >
          {t("Create New")}            
          </Link>
        </div>
        {loading ? (
          <Loading />
        ) : (
            <div
              className=" box-body divResult table-responsive mt-4"
              id="no-more-tables"
            >
              {data.length > 0 ? (
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf">
                    <tr>
                      <th>{t("S.No")}</th>
                      <th>{t("Discount Type")}</th>
                      <th>{t("Created By")} </th>
                      <th>{t("Created On")}</th>
                      <th>{t("Discount %")}</th>
                      <th>{t("Valid From")}</th>
                      <th>{t("Valid To")}</th>
                      <th>{t("From Age")}</th>
                      <th>{t("To Age")}</th>
                      <th>{t("Gender")}</th>
                      <th>{t("Discount Share Type")} </th>
                      <th>{t("Applicable For All")} </th>
                      <th>{t("Coupon Required")}</th>
                      <th>{t("Status")}</th>
                      <th>{t("Action")}</th>
                      <th>{t("View")}</th>
                      <th onClick={handleShow}>{t("Add")}</th>
                      <th>{t("De-Active")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((data, i) => (
                      <tr key={i}>
                        <td data-title={t("S.No")}>{i + 1} &nbsp;</td>
                        <td data-title={t("Discount Type")}>
                          {data?.DiscountType}&nbsp;
                        </td>
                        <td data-title={t("Created By")}>{data?.CreatedByName} &nbsp;</td>
                        <td data-title={t("Created On")}>
                          {dateConfig(data?.CreatedOn)}&nbsp;
                        </td>
                        <td data-title={t("Discount %")}>{data?.DiscountPer} &nbsp;</td>
                        <td data-title={t("Valid From")}>
                          {dateConfig(data?.FromValidityDate)}
                        </td>
                        <td data-title={t("Valid To")}>
                          {dateConfig(data?.ToValidityDate)} &nbsp;
                        </td>
                        <td data-title={t("From Age")}>{data?.FromAge}&nbsp;</td>
                        <td data-title={t("To Age")}>{data?.ToAge}&nbsp;</td>
                        <td data-title={t("Gender")}>{data?.Gender}&nbsp;</td>
                        <td data-title={t("Discount Share Type")}>
                          {data?.DiscountShareType}&nbsp;
                        </td>
                        <td data-title={t("Applicable For All")}>
                          {data?.ApplicableForAll}
                        </td>
                        <td data-title={t("Coupon Required")}>
                          {data?.IsCouponRequired}&nbsp;
                        </td>
                        <td data-title={t("Status")}>{data?.isActiveStatus}&nbsp;</td>
                        <td data-title={t("Action")}>
                          <Link
                            to="/AgeWiseDiscount"
                            state={{
                              data: data,
                              other: { button: "Update", pageName: "Edit" },
                              url: "/api/v1/AgeWiseDiscount/UpdateAgeWiseDiscountData",
                            }}
                          >
                            {t("Edit")}
                          </Link>
                        </td>
                        <td data-title={t("View")}>
                          <span
                            title="View Data"
                            className="fa fa-search coloricon"
                          ></span>
                         &nbsp;</td>
                        <td data-title={t("Add")}>
                          <Link
                            id="AddInvestigation"
                            className="form-control btn btn-primary"
                            style={{
                              borderRadius: "20px",
                              color: "white",
                              width: "30px",
                            }}
                            onClick={() => {
                              handleShow();
                              setDiscountId(data);
                            }}
                          >
                            +
                          </Link>
                          &nbsp; </td>
                        <td data-title={t("Remove")}>
                          <a
                            id="AddInvestigation"
                            className="form-control btn btn-primary"
                            style={{
                              borderRadius: "20px",
                              color: "white",
                              width: "28px",
                            }}
                            onClick={() => disableData(data.Id)}
                          >
                            X
                          </a>
                          &nbsp; </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                " No Data Found"
              )}
            </div>
        )}
      </div>
    </>
  );
};
export default AgeWiseDiscountList;
