import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Input from "../../ChildComponents/Input";
import Loading from "../util/Loading";
import { useTranslation } from "react-i18next";
const InvestigationsRequiredField = () => {
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [load, setLoad] = useState(false);
  
    const ID = {
      InvestigationID: state?.data ? state?.data : "",
    };
    // i18n start 
    
    const { t } = useTranslation();
 
    const getInvestigationsList = () => {
      axios
        .post("/api/v1/Investigations/RequiredFields", {
          InvestigationID: ID.InvestigationID,
        })
        .then((res) => {
          if (res.status === 200) {
            setLoad(false);
            setData(res.data.message);
          }
        })
        .catch((err) => console.log(err));
    };
  
    const post = () => {
      setLoad(true);
  
      axios
        .post("/api/v1/Investigations/SaveInvestigationRequired", {
          InvestigationRequiredData: data,
        })
        .then((res) => {
          if (res.data.message) {
            setLoad(false);
            toast.success(res.data.message);
            navigate(-1);
          } else {
            toast.error("Something went wrong");
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setLoad(false);
        });
    };
  
    const handleChangeMain = (e, i, names) => {
      const { value, name, checked, type } = e.target;
      const datas = [...data];
      if (names) {
        datas[i][names] = value;
        setData(datas);
      } else {
        datas[i][name] = type === "checkbox" ? (checked ? 1 : 0) : value;
        setData(datas);
      }
    };
  
    useEffect(() => {
      getInvestigationsList();
    }, []);
    
  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Search Criteria")}</h3>
        </div>
            <div
              className="box-body divResult table-responsive mt-4"
              id="no-more-tables"
            >
              <table
                className="table table-bordered table-hover table-striped tbRecord"
                cellPadding="{0}"
                cellSpacing="{0}"
              >
                <thead className="cf">
                  <tr>
                    <th>{t("S.No")}</th>
                    <th>{t("Investigation ID")}</th>
                    <th>{t("Field ID")}</th>
                    <th>{t("Field Name")}</th>
                    <th>{t("Show On Booking")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((data, i) => (
                    <tr key={i}>
                      <td data-title={t("S.No")}>{i + 1}&nbsp;</td>
                      <td data-title={t("Investigation ID")}>
                        {data?.InvestigationID}&nbsp;
                      </td>
                      <td data-title={t("Field ID")}>{data?.FieldID}&nbsp;</td>
                      <td data-title={t("Field Name")}>{data?.FieldName}&nbsp;</td>
                      <td data-title={t("Show On Booking")}>
                        <Input
                          type="checkbox"
                          name="showonbooking"
                          checked={data?.showonbooking}
                          onChange={(e) => handleChangeMain(e, i)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="box-footer">
            <div className="row">
              <div className="col-sm-1">
                {load ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-block btn-success btn-sm"
                    onClick={post}
                  >
                    {t("Save")}
                  </button>
                )}                
              </div>
              <div className="col-sm-1">
              <button
                  className="btn btn-block btn-info btn-sm"
                  onClick={() => navigate(-1)}
                >
                  {t("Back")}
                </button>
              </div>
            </div>
            </div>
          </div>
    </>
  );
};
export default InvestigationsRequiredField;
