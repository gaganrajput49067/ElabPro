import React from "react";
import { Link } from "react-router-dom";
import Loading from "../../Frontend/util/Loading";
import { useState, useEffect } from "react";
import axios from "axios";
import { dateConfig } from "../../Frontend/util/DateConfig";
import DesignationModal from "../../Frontend/util/DesignationModal";
import { useTranslation } from "react-i18next";

const Designations = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [show, setShow] = useState({
    modal: false,
    id: "",
  });
    const { t } = useTranslation();
  const getDesignationData = () => {
    axios
      .get("/api/v1/Designation/getDesignationData")
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getDesignationData();
  }, []);

  return (
    <>
      {show?.modal && (
        <DesignationModal
          show={show}
          onHandleClose={() => {
            setShow({
              modal: false,
              id: "",
            });
          }}
        />
      )}
      <div className="box box-success">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Designations")}</h3>
          <Link
            className="list_item"
            to="/DesignationsCreate"
            state={{
              url: "/api/v1/Designation/InsertDesignationData",
            }}
          >
            {t("Create New")}
          </Link>
        </div>
        <div className="box-body">
          {loading ? (
            <Loading />
          ) : (
            <div
              className="box-body divResult table-responsive mt-4"
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
                      <th>{t("Designation Name")}</th>
                      <th>{t("View Rights")}</th>
                      <th>{t("Sequence No")}</th>
                      <th>{t("Date Of Creation")}</th>
                      <th>{t("Date Of Updation")}</th>
                      <th>{t("New Test Approve")}</th>
                      <th>{t("ShowSpecialRate")}</th>
                      <th>{t("Active Status")}</th>
                      <th>{t("Direct Approve")}</th>
                      <th>{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((data, i) => (
                      <tr key={i}> 
                        <td data-title={t("S.No")}>{i + 1}</td>
                        <td data-title={t("Designation Name")}>
                          {data?.DesignationName}
                        </td>
                        <td data-title={t("View Rights")}>
                          <a
                            title="Page Rights"
                            className="fa fa-search coloricon"
                            onClick={() => {
                              setShow({
                                modal: true,
                                id: data?.DesignationID,
                              });
                            }}
                          ></a>
                        </td>

                        <td data-title={t("Sequence No")}>{data?.SequenceNo}</td>
                        <td data-title={t("Date Of Creation")}>
                          {dateConfig(data?.dtEntry)}
                        </td>
                        <td data-title={t("Date Of Updation")}>
                          {data?.dtUpdate !== "0000-00-00 00:00:00"
                            ? dateConfig(data?.dtUpdate)
                            : "-"}
                        </td>
                        <td data-title={t("New Test Approve")}>
                          {data?.NewTestApproves}
                        </td>
                        <td data-title={t("ShowSpecialRate")}>{data?.ShowSpecialRate}</td>
                        <td data-title={t("Active Status")}>
                          {data?.ActiveStatus}
                        </td>
                        <td data-title={t("Direct Approve")}>
                          {data?.DirectApprove}
                        </td>
                        <td data-title={t("Action")}>
                          <Link
                            state={{
                              data: data,
                              other: { button: "Update" },
                              url: "/api/v1/Designation/UpdateDesignationData",
                            }}
                            to="/DesignationsCreate"
                          >
                            {t("Edit")}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                "No Data Found"
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default Designations;
