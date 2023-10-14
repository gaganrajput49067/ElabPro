import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../Frontend/util/Loading";
import parse from "html-react-parser";
import {
  SelectBox,
  SelectBoxWithCheckbox,
} from "../../ChildComponents/SelectBox";
import Input from "../../ChildComponents/Input";
import { useTranslation } from "react-i18next";
const InvestigationCommentMasterList = () => {
  const [Investigation, setInvestigation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(false);
  const [TemplateData, setTemplateData] = useState([]);
  const [InvestigationCommentMasterData, setInvestigationCommentMasterData] =
    useState([]);
  const [payload, setPayload] = useState({
    InvestigationID: "1",
    Template: "",
    TemplateText: "",
  });
  const { t } = useTranslation();

  const getInvestigationsListData = () => {
    setLoading(true);
    axios
      .post(
        "/api/v1/InvestigationCommentMaster/getInvestigationCommentData",
        payload
      )
      .then((res) => {
        if (res.status === 200) {
          setInvestigationCommentMasterData(res?.data?.message);
          setLoading(false);
        }
        if (res?.data?.message.length === 0) {
          toast.success("No Data Found");
          setLoading(false);
        }
        // setLoading(false);
        // setInvestigationCommentMasterData(res?.data?.message);
      })
      .catch((err) =>
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Somthing Wents Wrong"
        )
      );
  };

  console.log("priyam", InvestigationCommentMasterData);

  const handleMultiSelect = (select, name) => {
    let val = "";
    for (let i = 0; i < select.length; i++) {
      val = val === "" ? `${select[i].value}` : `${val},${select[i].value}`;
    }
    setPayload({ ...payload, [name]: val, SampleTypeID: select[0]?.value });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
    // setErr({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const getInvestigationList = () => {
    axios
      .get("/api/v1/Investigations/BindInvestigationList")
      .then((res) => {
        let data = res?.data?.message;
        let InvestigationData = data?.map((ele) => {
          return {
            value: ele.InvestigationID,
            label: ele.TestName,
          };
        });
        setInvestigation(InvestigationData);
      })
      .catch((err) => console.log(err));
  };

  const getTemplate = () => {
    axios
      .get("/api/v1/InvestigationCommentMaster/getInvestigationTemplate")
      .then((res) => {
        let data = res.data.message;
        let Template = data.map((ele) => {
          return {
            value: ele.CommentID,
            label: ele.Template,
          };
        });

        Template.unshift({ label: "All Template", value: "" });
        setTemplateData(Template);
      });
  };

  useEffect(() => {
    getTemplate();
    getInvestigationList(setInvestigationCommentMasterData);
  }, []);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h6 className="box-title">{t("Investigation Comment Master List")}</h6>

          <Link
            className="list_item"
            to="/InvestigationCommentMaster"
            state={{
              url: "/api/v1/InvestigationCommentMaster/InsertInvestigationComment",
            }}
          >
            {t("Create New")}
          </Link>
        </div>
        <div className="box-body">
          <form action="" onSubmit={getInvestigationsListData}>
            <div className="row">
            <label className="col-sm-1">{t("InvestigationID")}:</label>
              <div className="col-sm-2">
                <SelectBoxWithCheckbox
                  name="InvestigationID"
                  options={Investigation}
                  // value={payload?.InvestigationID}
                  onChange={handleMultiSelect}
                  selectedValue={payload?.InvestigationID}
                />
              </div>
              <label className="col-sm-1">{t("Template")}:</label>
              <div className="col-sm-2 ">
                <SelectBox
                  options={TemplateData}
                  onChange={handleSelectChange}
                  name="Template"
                  selectedValue={payload?.Template}
                />
              </div>
              <label className="col-sm-1">{t("Template Text")}:</label>
              <div className="col-sm-2 ">
                <Input
                  name="TemplateText"
                  className="form-control ui-autocomplete-input input-sm"
                  placeholder={t("Template Text")}
                  onChange={handleChange}
                  value={payload?.TemplateText}
                />
              </div>
              <div className="col-sm-1">
                <button
                  type="button"
                  className="btn btn-block btn-info btn-sm"
                  id="btnSearch"
                  title="Search"
                  onClick={getInvestigationsListData}
                >
                  {t("Search")}
                </button>
              </div>
            </div>
          </form>
          <div>
            {loading ? (
              <Loading />
            ) : (
              <>
                {InvestigationCommentMasterData.length > 0 && (
                  <div
                    className="box-body  divResult table-responsive  boottable"
                    id="no-more-tables"
                  >
                    <div className="row">
                      <div className="col-sm-12">
                        <table
                          className="table table-bordered table-hover table-striped tbRecord"
                          cellPadding="{0}"
                          cellSpacing="{0}"
                        >
                          <thead className="cf">
                            <tr>
                              <th>{t("S.No")}</th>
                              <th>{t("Investigation")}</th>
                              <th>{t("Template")}</th>
                              <th>{t("Template Text")}</th>
                              <th>{t("Edit")}</th>
                            </tr>
                          </thead>
                          <tbody className="cf">
                            {InvestigationCommentMasterData.map((data, i) => (
                              <tr key={i}>
                                <td data-title={t("S.No")}>{i + 1}&nbsp;</td>
                                <td data-title={t("Investigation")}>
                                  {data?.TestName}&nbsp;
                                </td>
                                <td data-title={t("Template")}>
                                  {data?.Template}&nbsp;
                                </td>
                                <td data-title={t("Template Text")}>
                                  {parse(data?.TemplateText)}&nbsp;
                                </td>
                                <td data-title={t("Action")}>
                                  <Link
                                    to="/InvestigationCommentMaster"
                                    state={{
                                      other: {
                                        button: "Update",
                                        CommentID: data?.CommentID,
                                      },
                                      url1: `/api/v1/InvestigationCommentMaster/getInvestigationCommentDataByID`,
                                      url: "/api/v1/InvestigationCommentMaster/UpdateInvestigationComment",
                                    }}
                                  >
                                    {t("Edit")}
                                  </Link>
                                  &nbsp;
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestigationCommentMasterList;
