import React, { useState } from "react";
import CustomDate from "../../ChildComponents/CustomDate";
import Input from "../../ChildComponents/Input";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import DatePicker from "../../Frontend/Components/DatePicker";

import { useTranslation } from "react-i18next";
function LoadData() {
  const [state, setState] = useState({
    FromDate: new Date(),
    FromTime: "00:00:00",
    ToDate: new Date(),
    ToTime: "23:59:59",
  });
  const [errors, setErrors] = useState({});

  const { t } = useTranslation();

  const dateSelect = (date, name) => {
    setState({
      ...state,
      [name]: date,
    });
  };
  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;

    setState({ ...state, [secondName]: TimeStamp });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
  };

  const fetchData = () => {
    axios
      .post("/api/v1/DocShareMaster/utilityAccountShareData", {
        ...state,
        FromDate: moment(state?.FromDate).format("DD-MMM-YYYY"),
        ToDate: moment(state?.ToDate).format("DD-MMM-YYYY"),
      }) // Pass 'val' instead of 'state'
      .then((res) => {
        toast.success(res?.data?.message);
        setState({
          FromDate: new Date(),
          FromTime: "00:00:00",
          ToDate: new Date(),
          ToTime: "23:59:59",
        });
      })
      .catch((err) => {
        toast.error(err?.response?.data?.message || err?.data?.message);
      });
  };

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Load Data")}</h3>
        </div>

        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("From Date")}:</label>
            <div className="col-sm-2">
              <div>
                <DatePicker
                  name="FromDate"
                  date={state?.FromDate}
                  onChange={dateSelect}
                  onChangeTime={handleTime}
                  secondName="FromTime"
                  maxDate={new Date()}
                />

                {errors?.FromDate && (
                  <span className="golbal-Error">{errors?.FromDate}</span>
                )}
              </div>
            </div>
            <label className="col-sm-1">{t("To Date")}:</label>
            <div className="col-sm-2">
              <div>
                <DatePicker
                  name="ToDate"
                  date={state?.ToDate}
                  onChange={dateSelect}
                  onChangeTime={handleTime}
                  secondName="ToTime"
                  maxDate={new Date()}
                  minDate={new Date(state.FromDate)}
                />

                {errors?.ToDate && (
                  <span className="golbal-Error">{errors?.ToDate}</span>
                )}
              </div>
            </div>
            <div className="col-sm-1">
              <button
                className="btn btn-block btn-success btn-sm"
                onClick={fetchData}
              >
                {t("Save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default LoadData;
