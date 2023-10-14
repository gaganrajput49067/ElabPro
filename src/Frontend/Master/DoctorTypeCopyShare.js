import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { SelectBox } from "../../ChildComponents/SelectBox";
import Loading from "../util/Loading";
import { autocompleteOnBlur } from "../util/Commonservices";
import Input from "../../ChildComponents/Input";

import { useTranslation } from "react-i18next";
const DoctorTypeCopyShare = () => {
  const navigate = useNavigate();
  const [DoctorDataOne, setDoctorDataOne] = useState([]);
  const [DoctorDataSecond, setDoctorDataSecond] = useState([]);
  const [dropFalse, setDropFalse] = useState(true);
  const [dropFalse1, setDropFalse1] = useState(true);
  const [load, setLoad] = useState(false);
  const [payload, setPayload] = useState({
    FromDoctorId: "",
    ToDoctorId: "",
    DoctorDataOne: "",
    DoctorDataSecond: "",
  });
  const [indexMatch, setIndexMatch] = useState(0);
  const { t } = useTranslation();

  const handleChange = (e,state) => {
    state(true);
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleIndex = (e, state, name) => {
    switch (e.which) {
      case 38:
        if (indexMatch !== 0) {
          setIndexMatch(indexMatch - 1);
        } else {
          setIndexMatch(state?.length - 1);
        }
        break;
      case 40:
        if (state?.length - 1 === indexMatch) {
          setIndexMatch(0);
        } else {
          setIndexMatch(indexMatch + 1);
        }
        break;
      case 13:
        handleListSearch(state[indexMatch], name);
        setIndexMatch(0);
        break;
      default:
        break;
    }
  };

  const handleListSearch = (data, name) => {
    switch (name) {
      case "DoctorDataOne":
        setPayload({
          ...payload,
          [name]: data.Name,
          FromDoctorId: data.Name ? data.DoctorReferalID : "",
        });
        setIndexMatch(0);
        setDoctorDataOne([]);
        setDropFalse(false);
        break;
      case "DoctorDataSecond":
        setPayload({
          ...payload,
          [name]: data.Name,
          ToDoctorId: data.Name ? data.DoctorReferalID : "",
        });
        setIndexMatch(0);
        setDoctorDataSecond([]);
        setDropFalse1(false);
        break;
      default:
        break;
    }
  };

  const Save = () => {
    if (payload?.FromDoctorId === payload?.ToDoctorId) {
      toast.error("From-doctor And To-doctor Cant Be The Same.");
    } else {
      setLoad(true);
      axios
        .post("/api/v1/DoctorShare/SaveDocCopy", {
          FromDoctorId: payload?.FromDoctorId,
          ToDoctorId: payload?.ToDoctorId,
        })
        .then((res) => {
          if (res.data.message) {
            toast.success(res.data.message);
            setLoad(false);
            setPayload({
              FromDoctorId: "",
              ToDoctorId: "",
              DoctorDataOne: "",
              DoctorDataSecond: "",
            });
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

  const getDoctorSuggestion = (name, state) => {
    axios
      .post("/api/v1/DoctorReferal/getDoctorData", {
        DoctorName: name,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            Name: ele?.Name,
            DoctorReferalID: ele?.DoctorReferalID,
          };
        });
        state(val);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (payload?.DoctorDataSecond.length > 1) {
      getDoctorSuggestion(payload?.DoctorDataSecond, setDoctorDataSecond);
    }
  }, [payload?.DoctorDataSecond]);

  useEffect(() => {
    if (payload?.DoctorDataOne?.length > 1) {
      getDoctorSuggestion(payload?.DoctorDataOne, setDoctorDataOne);
    }
  }, [payload?.DoctorDataOne]);
  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h1 className="box-title">{t("Doctor Type Copy Share")}</h1>
        </div>
        <div className="box-body">
          <div className="row">
          <label className="col-sm-1">{t("From Doctor")}:</label>
            <div className="col-sm-2 ">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                type="text"
                name="DoctorDataOne"
                value={payload.DoctorDataOne}
                onChange={(e)=>handleChange(e,setDropFalse)}
                onKeyDown={(e) =>
                  handleIndex(e, DoctorDataOne, "DoctorDataOne")
                }
                placeholder={t("Refer Doctor")}
                onBlur={(e) => {
                  autocompleteOnBlur(setDoctorDataOne);
                  setTimeout(() => {
                    const data = DoctorDataOne.filter(
                      (ele) => ele?.Name === e.target.value
                    );
                    if (data?.length === 0) {
                      setPayload({ ...payload, DoctorDataOne: "" });
                    }
                  }, 500);
                }}
                autoComplete="off"
              />
              {dropFalse && DoctorDataOne?.length > 0 && (
                <ul
                  className="suggestion-data"
                  style={{ top: "27px", width: "100%" }}
                >
                  {DoctorDataOne.map((data, index) => (
                    <li
                      onClick={() => handleListSearch(data, "DoctorDataOne")}
                      className={`${index === indexMatch && "matchIndex"}`}
                      key={index}
                    >
                      {data?.Name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

          <label className="col-sm-1">{t("To Doctor")}:</label>
            <div className="col-sm-2 ">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                type="text"
                name="DoctorDataSecond"
                value={payload.DoctorDataSecond}
                onChange={(e)=>handleChange(e,setDropFalse1)}
                onKeyDown={(e) =>
                  handleIndex(e, DoctorDataSecond, "DoctorDataSecond")
                }
                placeholder={t("Refer Doctor")}
                onBlur={(e) => {
                  autocompleteOnBlur(setDoctorDataSecond);
                  setTimeout(() => {
                    const data = DoctorDataSecond.filter(
                      (ele) => ele?.Name === e.target.value
                    );
                    if (data?.length === 0) {
                      setPayload({ ...payload, DoctorDataOne: "" });
                    }
                  }, 500);
                }}
                autoComplete="off"
              />
              {dropFalse1 && DoctorDataSecond?.length > 0 && (
                <ul
                  className="suggestion-data"
                  style={{ top: "27px", width: "100%" }}
                >
                  {DoctorDataSecond.map((data, index) => (
                    <li
                      onClick={() => handleListSearch(data, "DoctorDataSecond")}
                      className={`${index === indexMatch && "matchIndex"}`}
                      key={index}
                    >
                      {data?.Name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={Save}
                >
                  {t("Save")}
                </button>
              )}
            </div>
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

export default DoctorTypeCopyShare;
