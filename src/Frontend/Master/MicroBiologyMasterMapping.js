import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { useLocation } from "react-router-dom";

import { useTranslation } from "react-i18next";
const MicroBiologyMasterMapping = () => {
  const location = useLocation();
  const [getMapItem, setGetMapItem] = useState([]);
  const [payloadUnMappedItem, setPayloadUnMappedItem] = useState([]);
  const [payloadMappedItem, setPayloadMappedItem] = useState([]);
  const [getUnMapItem, setGetUnMapItem] = useState([]);
const { t } = useTranslation();

  const handleChange = (e, state) => {
    var options = e.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(Number(options[i].value));
      }
    }

    let data = state.filter((ele) => {
      if (value.includes(ele?.MapMasterID)) {
        return {
          TypeID: ele?.TypeID,
          MasterID: ele?.MasterID,
          MapTypeID: ele?.MapTypeID,
          MapMasterID: ele?.MapMasterID,
          BreakPoint: ele?.Name,
        };
      }
    });

    setPayloadUnMappedItem(data);
  };

  const handleChangeGetMapData = (e, state) => {
    var options = e.target.options;
    var value = [];
    for (var i = 0, l = options.length; i < l; i++) {
      if (options[i].selected) {
        value.push(Number(options[i].value));
      }
    }

    let data = state.filter((ele) => {
      if (value.includes(ele?.MapID)) {
        return {
          TypeID: ele?.TypeID,
          MasterID: ele?.MasterID,
          MapTypeID: ele?.MapTypeID,
          MapMasterID: ele?.MapMasterID,
          BreakPoint: ele?.Name,
        };
      }
    });
    setPayloadMappedItem(data);
  };

  const fetchMap = () => {
    axios
      .post("/api/v1/MapMicroMaster/getsaveddata", {
        SearchType: "4",
        MasterID: location?.state?.id,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => {
          return {
            ...ele,
            MapTypeID: "4",
          };
        });
        setGetMapItem(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };
  const fetchUnMap = () => {
    axios
      .post("/api/v1/MapMicroMaster/getunmappeddata", {
        SearchType: "4",
        MasterID: location?.state?.id,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => {
          return {
            ...ele,
            MasterID: location?.state?.id,
          };
        });
        setGetUnMapItem(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Wents Wrong"
        );
      });
  };

  const handleMapSave = () => {
    axios
      .post("/api/v1/MapMicroMaster/savemapping", {
        MappingData: payloadUnMappedItem,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setPayloadUnMappedItem([]);
        fetchMap();
        fetchUnMap();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  const handleMapDelete = () => {
    axios
      .post("/api/v1/MapMicroMaster/deletemapping", {
        MappingData: payloadMappedItem,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setPayloadMappedItem([]);
        fetchMap();
        fetchUnMap();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  useEffect(() => {
    fetchMap();
    fetchUnMap();
  }, []);
  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title text-primary">{t("Micro Biology Master Mapping")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-sm-3 col-md-3 mt-4">
              <div>
                <span className="control-label">{t("Organism Master")}: </span>
               <span>{location?.state?.Name}</span> 
              </div>
            </div>
            <div className="col-sm-3 col-md-3 mt-4">
              <div>
                <span className="control-label">{t("Code")}: </span>
                <span> {location?.state?.Code}</span> 
               
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-3">
        <div className="row">
          <div className="col-md-5">
            <div className="box mb-4">
            <div className="box-header with-border">
                <h3 className="box-title text-primary">{t("Mapped Item")}</h3>
              </div>
              <div className="box-body">
                  <div
                    className={`col-12 ${getMapItem.length > 8 && "boottable"}`}
                  >
                    <select
                      multiple
                      className="form-control input-sm"
                      onChange={(e) => handleChangeGetMapData(e, getMapItem)}
                      style={{ border: "none", height: "300px" }}
                    >
                      {getMapItem.map((ele, index) => (
                        <option key={index} value={ele?.MapID} className="p-2">
                          {ele?.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
        
          <div
            className="col-sm-2 col-md-2"
            style={{
              display: "flex",
              textAlign: "center",
              alignItems: "center",
              justifyContent: "center",
              marginTop: "180px",
              // margin:"auto"
            }}
          >
            <div>
              <button
                className="btn btn-info btn-sm btn-block"
                style={{ width: "50px" }}
                // onClick={handleMapSave}
                onClick={() => handleMapSave("Left")}
                disabled={payloadUnMappedItem?.length > 0 ? false : true}
              >
                {t("Left")}
              </button>
            </div>
            <div>
              <button
                className="btn btn-info btn-sm btn-block"
                style={{ width: "50px",marginLeft:"5px" }}
                // onClick={handleMapDelete}
                onClick={() => handleMapDelete("Right")}
                disabled={payloadMappedItem?.length > 0 ? false : true}
              >
                {t("Right")}
              </button>
            </div>
          </div>
          <div className="col-md-5">
            <div className="box">
              <div className="box-header with-border">
                <h3 className="box-title text-primary">{t("UnMapped Item")}</h3>
              </div>
              <div className="box-body">
                  <div
                    className={`col-12 ${
                      getUnMapItem.length > 8 && "boottable"
                    }`}
                  >
                    <select
                      multiple
                      className="form-control input-sm"
                      onChange={(e) => handleChange(e, getUnMapItem)}
                      style={{ border: "none", height: "300px" }}
                    >
                      {getUnMapItem.map((ele, index) => (
                        <option
                          key={index}
                          value={ele?.MapMasterID}
                          className="p-2"
                        >
                          {ele?.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default MicroBiologyMasterMapping;
