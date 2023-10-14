import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { getTrimmedData } from "../../Frontend/util/Commonservices";
import Input from "../../ChildComponents/Input";
import TextEditor from "../Master/Report/TextEditor";
import Loading from "../../Frontend/util/Loading";

import { useTranslation } from "react-i18next";
import { InvestigationCommentMasterValidation } from "../../ValidationSchema";
const InvestigationCommentMaster = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [Investigation, setInvestigation] = useState([]);
  const [Editor, setEditor] = useState("");
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState({});
  const [Editable, setEditable] = useState(false);
  const [payload, setPayload] = useState({
    InvestigationID: "2",
    Template: "",
    TemplateText: "",
  });

  const ID = {
    CommentID: state?.other?.CommentID ? state?.other?.CommentID : "",
  };
  const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleSelectChange = (event) => {
    const { name,value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  const Fetch = () => {
    axios
      .post(state?.url1, {
        CommentID: ID.CommentID,
      })
      .then((res) => {
        const data = res.data.message;
        setPayload(...data);
      })
      .catch((err) => console.log(err));
  };

  const getInvestigationList = () => {
    axios
      .get("/api/v1/Investigations/BindInvestigationList")
      .then((res) => {
        let data = res.data.message;
        let InvestigationData = data.map((ele) => {
          return {
            value: ele.InvestigationID,
            label: ele.TestName,
          };
        });
        InvestigationData.unshift({ label: "All Investigations", value: "" });
        setInvestigation(InvestigationData);
      })
      .catch((err) => console.log(err));
  };

  const postData = () => {
    let generatedError = InvestigationCommentMasterValidation(payload);
    if (generatedError === "") {
      setLoad(true);
      axios
        .post(
          state?.url
            ? state?.url
            : "/api/v1/InvestigationCommentMaster/InsertInvestigationComment",
          getTrimmedData({
            ...payload,
          })
        )
        .then((res) => {
          if (res.data.message) {
            setLoad(false);
            navigate("/InvestigationCommentMasterList");
            toast.success(res.data.message);
          } else {
            toast.error("Something went wrong");
            setLoad(false);
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
      setErr(generatedError);
      setLoad(false);
    }
  };

  useEffect(() => {
    setPayload({ ...payload, TemplateText: Editor });
  }, [Editor]);

  useEffect(() => {
    Fetch();
    getInvestigationList();
  }, []);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h1 className="box-title">{t("Investigation Comment Master")}</h1>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("InvestigationID")}:</label>
            <div className="col-sm-2">
              <SelectBox
                options={Investigation}
                onChange={handleSelectChange}
                name="InvestigationID"
                selectedValue={payload?.InvestigationID}
              />
               <div className="golbal-Error">{err?.InvestigationID}</div>
            </div>
            <label className="col-sm-1">{t("Template")}:</label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                placeholder={t("Template")}
                onChange={handleChange}
                name="Template"
                max={50}
                value={payload?.Template}
              />
            </div>
          </div>
          <div className="row mt-4">
            <div className="col-sm-12">
              <label className="labels">{t("Template Text")}</label>
              <TextEditor
                value={payload?.TemplateText}
                setValue={setEditor}
                editable={Editable}
                setEditTable={setEditable}
              />
            </div>
          </div>
          <div className="row mt-4">
            <div className="box-footer">
              <div className="col-sm-1 mt-4">
                {load ? (
                  <Loading />
                ) : (
                  <button
                    type="button"
                    className="btn btn-block btn-success btn-sm"
                    id="btnSearch"
                    title="Search"
                    onClick={postData}
                    disabled={payload?.Template.length > 0 ? false : true}
                  >
                    {state?.other?.button ? state?.other?.button : t("Save")}
                  </button>
                )}
              </div>
              <div className="col-sm-2">
                <Link to="/InvestigationCommentMasterList">
                  {t("Back to List")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestigationCommentMaster;
