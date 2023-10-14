import React from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { useTranslation } from "react-i18next";

const CampConfigurationApproval = () => {
  const { t, i18n } = useTranslation();
  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h6 className="box-title">{t("Camp Configuration Count Approval")}</h6>
        </div>

        <div className="box-body">
          <div className="row">
            <div className="col-sm-2">
              <label className="control-label">{t("Business Zone")}:</label>
              <SelectBox />
            </div>

            <div className="col-sm-2">
              <label className="control-label">{t("State")}:</label>
              <SelectBox />
            </div>

            <div className="col-sm-2">
              <label className="control-label">{t("Financial Year")}:</label>
              <SelectBox />
            </div>

            <div className="col-sm-2">
              <label className="control-label">{t("Client Type")}:</label>
              <SelectBox />
            </div>

            <div className="col-sm-2">
              <label className="control-label">{t("Tag Business Lab")}:</label>
              <SelectBox />
            </div>

            <div className="col-sm-2">
              <label className="control-label">{t("Client Name")}:</label>
              <SelectBox />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-1">
              <label className="control-label">{t("Status")}:</label>
            </div>
            <input type="radio"  ></input>
            <label className="control-label" style={{marginLeft:"10px"}}>{t("Pending")}</label>
            <input type="radio" style={{marginLeft:"10px"}}></input>
            <label className="control-label" style={{marginLeft:"10px"}} >{t("Approved")}</label>
            <input type="radio" style={{marginLeft:"10px"}}></input>
            <label className="control-label" style={{marginLeft:"10px"}}>{t("All")}</label>
          </div>
        </div>
      </div>

      <div className="box form-horizontal">
        <div className="box-header with-border">
          <div className="col-sm-2">
            <input type="checkbox"></input>
            <label className="control-label">{t("Pending")}</label>
          </div>

          <div className="col-sm-2">
            <input type="checkbox"></input>
            <label className="control-label">{t("Approved")}</label>
          </div>

          <div className="col-sm-1">
            <button className="btn btn-block btn-danger btn-sm">{t("Cancel")}</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CampConfigurationApproval;
