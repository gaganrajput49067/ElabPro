import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  BindFieldType,
  getTrimmedData,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";
//i18n import start
import { useTranslation } from "react-i18next";
const LANG_LOCAL_STORAGE_KEY = "selectedLanguage";
//i18n import end
function GlobalTypeMaster() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  console.log(state);
  const [FieldType, setFieldType] = useState([]);
  const [load, setLoad] = useState(false);
  const [payload, setPayload] = useState({
    FieldType: "",
    FieldDisplay: "",
    IsActive: "1",
  });
  // i18n start
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem(LANG_LOCAL_STORAGE_KEY) || "en"
  );
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);
  // i18n end
  const handleSelectChange = (event) => {
    const { name,value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleChange = (e) => {
    const { checked } = e.target;
    setPayload({ ...payload, IsActive: checked ? "1" : "0" });
  };

  const validations = (payload) => {
    let err = "";
    if (payload?.FieldType === "") {
      err = "please Choose Field Type";
    } else if (payload?.FieldDisplay === "") {
      err = "please Enter Field Display";
    }

    return err;
  };

  const handleSubmit = () => {
    const generated = validations(getTrimmedData(payload));
    if (generated === "") {
      setLoad(true);
      axios
        .post(
          state?.url ? state?.url : "/api/v1/Global/InsertGlobalData",
          getTrimmedData(payload)
        )
        .then((res) => {
          toast.success(res.data?.message);
          setLoad(false);
          if (payload?.FieldType === "SelectType") {
            setPayload({
              FieldType: "",
              FieldDisplay: "",
              IsActive: "1",
            });
            BindFieldType(setFieldType);
          } else {
            navigate("/ViewGlobalMaster");
          }
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoad(false);
        });
    } else {
      toast.error(generated);
    }
  };

  useEffect(() => {
    if (state?.data) {
      setPayload({
        FieldId: state?.data?.FieldId,
        FieldType: state?.data?.FieldType,
        FieldDisplay: state?.data?.FieldDisplay,
        IsActive: state?.data?.IsActive === 1 ? "1" : "0",
      });
    }
  }, []);

  useEffect(() => {
    BindFieldType(setFieldType);
  }, []);
  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Global Type Master")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1" htmlFor="DataType">
              {t("FieldType")}:
            </label>
            <div className="col-sm-2 col-md-2">
              <SelectBox
                options={FieldType}
                name="FieldType"
                selectedValue={payload?.FieldType}
                onChange={handleSelectChange}
              />
            </div>

            <label className="col-sm-1" htmlFor="DataType">
              {t("FieldDisplay")}:
            </label>
            <div className="col-sm-2 col-md-2">
              <Input
                className="form-control input-sm"
                value={payload?.FieldDisplay}
                onChange={(e) => {
                  setPayload({ ...payload, FieldDisplay: e.target.value });
                }}
              />
            </div>

            {/* <div className="d-flex align-items-center justify-content-start"> */}
            <div className="col-sm-1">
              <Input
                type="checkbox"
                checked={payload?.IsActive === "1" ? true : false}
                onChange={handleChange}
              />
              <label>{t("Active")}</label>
            </div>

            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-success btn-sm btn-block"
                  onClick={handleSubmit}
                >
                  {state?.url ? t("Update") : t("Create")}
                </button>
              )}
            </div>

            <div className="col-sm-1">
              <Link to="/ViewGlobalMaster">{t("Back to List")}</Link>
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default GlobalTypeMaster;
