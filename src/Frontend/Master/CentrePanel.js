import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  getAccessCentres,
  isChecked,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";

import { useTranslation } from "react-i18next";
const CentrePanel = () => {
       const { t } = useTranslation();    
  const [CentreData, setCentreData] = useState([]);
  const [ReferenceRate, setReferenceRate] = useState([]);
  const [Disable, setDisable] = useState(true);
  const [load, setLoad] = useState({
    ReferenceRateLoading: false,
    SaveLoad: false,
  });

  const [payload, setPayload] = useState({
    CentreID: "",
    CentreName: "",
    Data: [],
  });

  const handleChange = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const data = [...ReferenceRate];
      data[index][name] = checked;
      setReferenceRate(data);
    } else {
      const data = ReferenceRate.map((ele) => {
        return {
          ...ele,
          [name]: checked,
        };
      });
      setReferenceRate(data);
    }
  };

  useEffect(() => {
    if (CentreData.length > 0) {
      const name = CentreData.find((ele) => ele.value === payload?.CentreID);
      setPayload({ ...payload, CentreName: name?.label });
    }
  }, [payload?.CentreID, CentreData]);

  const saveData = () => {
    setLoad({ ...load, SaveLoad: true });
    const data = ReferenceRate.filter((ele) => ele.isChecked === true);
    const val = data.map((ele) => {
      return { RateTypeID: ele?.value, RateTypeName: ele?.label };
    });
    setPayload({ ...payload, Data: val });

    axios
      .post("/api/v1/CentreAccess/InsertCentreAccessData", {
        ...payload,
        Data: val,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setLoad({ ...load, SaveLoad: false });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoad({ ...load, SaveLoad: false });
      });
  };
  const getReferenceRate = (id) => {
    axios
      .get("/api/v1/CentreAccess/CentreAllRateTypeList")
      .then((res) => {
        let data = res.data.message;
        let CentreReferRate = data.map((ele) => {
          return {
            value: ele.RateTypeID,
            label: ele.RateTypeName,
            isChecked: false,
          };
        });
        setReferenceRate(CentreReferRate);
        fetch(CentreReferRate, id);
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
    fetch(ReferenceRate, value);
  };

  const disable = () => {
    let disable = true;
    for (var i = 0; i < ReferenceRate.length; i++) {
      if (ReferenceRate[i].isChecked === true) {
        disable = false;
        break;
      }
    }
    setDisable(disable);
  };

  useEffect(() => {
    disable();
  }, [ReferenceRate]);

  const fetch = (mapdata, id) => {
    setLoad({ ...load, ReferenceRateLoading: true });
    axios
      .post("/api/v1/CentreAccess/GetCentreAccessData", {
        CentreID: id,
      })
      .then((res) => {
        const data = res?.data?.message;

        const val = [...mapdata];

        const haveIds = new Set(data.map(({ RateTypeId }) => RateTypeId));

        const result = val.map((ele) => {
          return {
            ...ele,
            isChecked: haveIds.has(ele?.value),
          };
        });
        setReferenceRate(result);
        setLoad({ ...load, ReferenceRate: false });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoad({ ...load, ReferenceRate: false });
      });
  };

  useEffect(() => {
    if (CentreData.length > 0) {
      getReferenceRate(CentreData[0]?.value);
    }
  }, [CentreData]);

  useEffect(() => {
    getAccessCentres(setCentreData, payload, setPayload);
  }, []);

  return (
    <>
      <div className="box box-success  form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Centre Panel")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
          <label className="col-sm-1">{t("Centre")}:</label>
            <div className="col-sm-2">
              <SelectBox
                options={CentreData}
                name="CentreID"
                selectedValue={payload?.CentreID}
                onChange={handleSelectChange}
              />
            </div>

            <div
              className="col-sm-2 d-flex justify-content-center"
              style={{ marginLeft: "10px" }}
            >
              <Input
                type="checkbox"
                name="isChecked"
                checked={
                  ReferenceRate?.length > 0
                    ? isChecked("isChecked", ReferenceRate, true).includes(
                        false
                      )
                      ? false
                      : true
                    : false
                }
                onChange={(e) => handleChange(e)}
              />
              <label style={{ marginLeft: "5px", marginTop: "5px" }}>
                {t("Select all")}
              </label>
            </div>
          </div>

          {/* <div className="box"> */}
            <div className="box-header with-border">
              <h3 className="box-title">{t("Rate Type")}</h3>
            </div>
            <div className="col-sm-12">
              {load?.ReferenceRateLoading ? (
                <div className="d-flex align-items-center justify-content-center">
                  <Loading />
                </div>
              ) : (
                <div className="row">
                  {ReferenceRate.map((ele, index) => (
                    <div key={index} className="col-sm-3">
                      <Input
                        type="checkbox"
                        checked={ele?.isChecked}
                        name="isChecked"
                        onChange={(e) => handleChange(e, index)}
                      />

                      <span>{ele.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        {/* </div> */}
        <div className="box-footer">
          <div className="col-sm-1">
            {load?.SaveLoad ? (
              <Loading />
            ) : (
              <button
                type="submit"
                className="btn btn-success btn-sm btn-block mb-4"
                onClick={saveData}
                disabled={Disable}
              >
               {t("Save")} 
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CentrePanel;
