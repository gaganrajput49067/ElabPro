import React, { useEffect } from "react";
import ProgressBarCustom from "./Dashboard/ProgressBarCustom";
import Chat2 from "./Dashboard/Chat2";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import moment from "moment";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { getAccessCentres } from "../util/Commonservices";
import DatePicker from "../Components/DatePicker";
import Loading from "../util/Loading";
import { useTranslation } from "react-i18next";

function LandingPage() {
  const { t } = useTranslation();
  const [state, setState] = useState({});
  const [loading, setLoading] = useState(true);
  const [CentreData, setCentreData] = useState([]);
  const [payload, setPayload] = useState({
    CentreID: "",
    FromDate: new Date(),
    FromTime: "00:00:00",
    ToDate: new Date(),
    ToTime: "23:59:59",
  });

  const fetch = () => {
    axios
      .post("api/v1/CommonController/GetDashBoardData", {
        ...payload,
        FromDate: moment(payload?.FromDate).format("YYYY-MM-DD"),
        ToDate: moment(payload?.ToDate).format("YYYY-MM-DD"),
      })
      .then((res) => {
        setState(res?.data?.message);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
        setLoading(false);
      });
  };

  console.log(state);

  const dateSelect = (date, name) => {
    setPayload({
      ...payload,
      [name]: date,
    });
  };

  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;
    setPayload({ ...payload, [secondName]: TimeStamp });
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  useEffect(() => {
    fetch();
  }, [payload]);

  useEffect(() => {
    getAccessCentres(setCentreData);
  }, []);

  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <div className="row dashboardmargin">
            <div className="col-sm-4">
              <h1 className="box-title" style={{ fontSize: "30px" }}>
                {t("Dashboard")}
              </h1>
            </div>
            <div className="col-sm-8">
              {loading ? (
                <Loading />
              ) : (
                <div className="row">
                  <div className="col-sm-4">
                    <div>
                      <SelectBox
                        options={CentreData}
                        name="CentreID"
                        selectedValue={payload?.CentreID}
                        onChange={handleSelectChange}
                      />
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div>
                      <DatePicker
                        name="FromDate"
                        date={payload?.FromDate}
                        onChange={dateSelect}
                        onChangeTime={handleTime}
                        secondName="FromTime"
                        maxDate={new Date()}
                      />
                    </div>
                  </div>
                  <div className="col-sm-4">
                    <div>
                      <DatePicker
                        name="ToDate"
                        date={payload?.ToDate}
                        onChange={dateSelect}
                        onChangeTime={handleTime}
                        secondName="ToTime"
                        maxDate={new Date()}
                        minDate={new Date(payload.FromDate)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="box-body">
          <div className="row">
            <div className="col-sm-3">
              <div
                className="info-box"
                style={{ boxShadow: "1px 1px 2px #aaaaaa" }}
              >
                <span class="info-box-icon bg-info">
                  <i class="fa fa-registered" aria-hidden="true"></i>
                </span>
                <div class="info-box-content">
                  <span class="info-box-text">{t("TOTAL REGISTRATION")}</span>
                  <span class="info-box-number">
                    {state?.RegistrationCount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div
                className="info-box"
                style={{ boxShadow: "1px 1px 2px #aaaaaa" }}
              >
                <span class="info-box-icon bg-danger">
                  <i class="fa fa-money" aria-hidden="true"></i>
                </span>
                <div class="info-box-content">
                  <span class="info-box-text">{t("EARNINGS (MONTHLY)")}</span>
                  <span class="info-box-number">
                    {state?.TotalEarning?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div
                className="info-box"
                style={{ boxShadow: "1px 1px 2px #aaaaaa" }}
              >
                <span class="info-box-icon bg-success">%</span>
                <div class="info-box-content">
                  <span class="info-box-text">{t("TOTAL DISCOUNT")}</span>
                  <span class="info-box-number">
                    {state?.TotalDiscount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            <div className="col-sm-3">
              <div
                className="info-box"
                style={{ boxShadow: "1px 1px 2px #aaaaaa" }}
              >
                <span class="info-box-icon bg-warning">
                  <i class="fa fa-pencil" aria-hidden="true"></i>
                </span>
                <div class="info-box-content">
                  <span class="info-box-text">{t("APPROVAL PENDING")}</span>
                  <span class="info-box-number">
                    {state?.SamplePendingCount?.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-7 col-12">
          <div className="box box-success shadow">
            <div className="box-title">
              {t("Goal Completion")} ({state?.TotalCount})
            </div>
            <div className="box-body">
              <ProgressBarCustom
                text={t("Sample Collected")}
                value={state?.SampleCollectionCount}
                total={state?.TotalCount}
                variant={"primary"}
              />
              <ProgressBarCustom
                text={t("Sample Not Collected")}
                value={state?.NotCollectedCount}
                total={state?.TotalCount}
                variant={"secondary"}
              />
              <ProgressBarCustom
                text={t("Sample Received")}
                value={state?.DepartmentReceiveCount}
                total={state?.TotalCount}
                variant={"success"}
              />
              <ProgressBarCustom
                text={t("Sample Rejected")}
                value={state?.RejectedCount}
                total={state?.TotalCount}
                variant={"danger"}
              />
              <ProgressBarCustom
                text={t("Sample Approved")}
                value={state?.ApprovedCount}
                total={state?.TotalCount}
                variant={"warning"}
              />
            </div>
          </div>
        </div>

        <div className="col-md-5 col-12">
          <div className="box box-success shadow">
            <h3 className="text-center">{t("Revenue Sources")}</h3>
            <Chat2 state={state} />
          </div>
        </div>
      </div>
    </>
  );
}

export default LandingPage;
