import React from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import Loading from "../../Frontend/util/Loading";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const SampleType = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
    const { t } = useTranslation();

  const getSampleType = () => {
    axios
      .get("/api/v1/SampleType/getSampleType")
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  // console.log(data);
  useEffect(() => {
    getSampleType();
  }, []);
  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h3 className="box-title">{t("SampleType")}</h3>
          <Link
            className="list_item"
            to="/SampleTypeCreate"
            state={{
              url: "/api/v1/SampleType/SaveSampleType",
            }}
          >
           {t("Create New")} 
          </Link>
        </div>
        <div className="box-body">
        {loading ? (
              <Loading />
            ) : (
              <div className="box-body divResult table-responsive mt-4 boottable"  id="no-more-tables">
                {data.length > 0 ? (
                  <table className="table table-bordered table-hover table-striped tbRecord "
                  cellPadding="{0}"
                  cellSpacing="{0}">
                    <thead className="cf">
                      <tr>
                        <th>{t("S.No")}</th>
                        <th>{t("SampleName")}</th>
                        <th>{t("Container")}</th>
                        <th>{t("ColorName")}</th>
                        <th>{t("Active")}</th>
                        <th>{t("Action")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((data, i) => (
                        <tr key={i}>
                          <td data-title={t("S.No")}>{i + 1}&nbsp;</td>
                          <td data-title={t("SampleName")}>{data?.SampleName}&nbsp;</td>
                          <td data-title={t("Container")}>{data?.Container}&nbsp;</td>
                          <td data-title={t("ColorName")}>{data?.ColorName}&nbsp;</td>
                          <td data-title={t("Active")}>{data?.isActive === 1 ? t("Active") :t("De-Active") }&nbsp;</td>
                          <td data-title={t("Action")}>
                            <Link
                              state={{
                                data: data,
                                other: { button:t("Update")},
                                url: "/api/v1/SampleType/UpdateSampleType",
                              }}
                              to="/SampleTypeCreate"
                            >
                             {t("Edit")} 
                            </Link>
                          </td>
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
        {/* box body end  */}
      </div>
    </>
  );
};
export default SampleType;
