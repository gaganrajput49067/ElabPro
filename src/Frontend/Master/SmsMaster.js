import React from "react";
import { Table } from "react-bootstrap";
import Input from "../../ChildComponents/Input";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useState } from "react";
import Loading from "../../Frontend/util/Loading";
import { useTranslation } from "react-i18next";
function SmsMaster() {
  const { t } = useTranslation();
  const [SmsData, setSmsData] = useState([]);
  const [load, setLoad] = useState({ RenderData: false, SaveData: false });
  const fetch = () => {
    setLoad({ ...load, RenderData: true });
    axios
      .post("/api/v1/Global/smstempletemaster")
      .then((res) => {
        let data = res?.data?.message;
        data.map((ele) => {
          return {
            ...ele,
            isChecked: false,
          };
        });
        setSmsData(data);
        setLoad({ ...load, RenderData: false });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
        setLoad({ ...load, RenderData: false });
      });
  };

  const handleUpdate = () => {
    const data = SmsData.filter((ele) => ele?.isChecked === true);
    if (data.length > 0) {
      setLoad({ ...load, SaveData: true });
      axios
        .post("/api/v1/Global/updatesmstempletemaster", {
          sms_template: data,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setLoad({ ...load, SaveData: false });
          fetch();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Went Wrong"
          );
          setLoad({ ...load, SaveData: false });
        });
    } else {
      toast.error("Please Select One Sms");
    }
  };

  const handleChecked = (e, index) => {
    const { name, checked, type, value } = e.target;
    const data = [...SmsData];
    data[index][name] = type === "checkbox" ? checked : value;
    setSmsData(data);
  };

  useEffect(() => {
    fetch();
  }, []);
  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h6 className="box-title">{t("Sms Master")}</h6>
        </div>

        <div className="box">
          <div className="row">
            <div className="box-body divResult boottable" id="no-more-tables">
              {load?.RenderData ? (
                <Loading />
              ) : (
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf">
                    <tr>
                      <th>{t("S.No")}</th>
                      <th>{t("Template")}</th>
                      <th>{t("Description")}</th>
                      <th>{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SmsData?.map((ele, index) => (
                      <tr key={index}>
                        <td data-title={t("S.No")}>{index + 1}</td>
                        <td data-title={t("Template")}>{ele?.TemplateFor}</td>
                        <td data-title={t("Description")}>
                          {ele?.isChecked ? (
                            <textarea
                              className="w-100"
                              value={ele?.SMSTemplate}
                              name="SMSTemplate"
                              onChange={(e) => handleChecked(e, index)}
                            ></textarea>
                          ) : (
                            ele?.SMSTemplate
                          )}
                        </td>
                        <td data-title={t("Action")}>
                          <Input
                            type="checkbox"
                            checked={ele?.isChecked}
                            name="isChecked"
                            onChange={(e) => handleChecked(e, index)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
           
            <div className="col-sm-1" sttyle={{marginTop:"5px"}}>
              <button
                className="btn btn-success btn-block btn-sm"
                onClick={handleUpdate}
              >
                {t("Update")}
              </button>
            </div>
          </div>
        </div>
        </div>
    </>
  );
}

export default SmsMaster;
