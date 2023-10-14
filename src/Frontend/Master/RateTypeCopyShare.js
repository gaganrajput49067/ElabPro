import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../Frontend/util/Loading";
import axios from "axios";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { selectedValueCheck } from "../../Frontend/util/Commonservices";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const RateTypeCopyShare = () => {
  const navigate = useNavigate();
  const [RateTypeData, setRateTypeData] = useState([]);
  const [load, setLoad] = useState(false);
  const [payload, setPayload] = useState({
    FromRateTypeID: "2",
    ToRateTypeID: "3",
  });
    const { t } = useTranslation();

  const handleSelect = (event) => {
    const { name,value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  const getRateList = () => {
    axios
      .get("/api/v1/Centre/getRateList")
      .then((res) => {
        let data = res.data.message;
        let RateType = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        setRateTypeData(RateType);
      })
      .catch((err) => console.log(err));
  };

  const Save = () => {
    if (payload?.FromRateTypeID === payload?.ToRateTypeID) {
      toast.error("From-doctor And To-doctor Cant Be The Same.");
    } else {
      setLoad(true);
      axios
        .post("/api/v1/RateTypeShare/SaveRateTypeCopy", payload)
        .then((res) => {
          if (res.data.message) {
            toast.success(res.data.message);
            setLoad(false);
          } else {
            toast.error("Something went wrong");
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setLoad(false);
        });
    }
  };

  useEffect(() => {
    getRateList();
  }, []);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h6 className="box-title">{t("Rate Type Copy Share")}</h6>
        </div>

        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("From RateType")}</label>
            <div className="col-sm-2">
              <SelectBox
                onChange={handleSelect}
                options={[
                  { label: "From RateType", value: "" },
                  ...RateTypeData,
                ]}
                name="FromRateTypeID"
                value={payload?.FromRateTypeID}
              />
            </div>
            <label className="col-sm-1">{t("To RateType")}</label>
            <div className="col-sm-2">
              <SelectBox
                onChange={handleSelect}
                options={[{label:"To RateType",value:""},...RateTypeData]}
                name="ToRateTypeID"
                value={payload?.ToRateTypeID}
              />
            </div>

            {load ? (
              <Loading />
            ) : (
              <div className="col-sm-1">
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={Save}
                >
                 {t("Save")} 
                </button>
              </div>
            )}
            <div className="col-sm-1">
              <button
                className="btn btn-block btn-primary btn-sm"
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

export default RateTypeCopyShare;
