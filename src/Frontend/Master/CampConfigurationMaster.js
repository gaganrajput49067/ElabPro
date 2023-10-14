import React from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";

import { useTranslation } from "react-i18next";
const CampConfigurationMaster = () => {
  const { t} = useTranslation();
  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h6 className="box-title">{t("Camp Configuration Count Master")}</h6>
        </div>

        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("Business Zone")}:</label>
            <div className="col-sm-2">
              <SelectBox />
            </div>

            <label className="col-sm-1">{t("State")}:</label>
            <div className="col-sm-2">
              <SelectBox />
            </div>

            <label className="col-sm-1">{t("Financial Year")}:</label>
            <div className="col-sm-2">
              <SelectBox />
            </div>

            <label className="col-sm-1">{t("Client Type")}:</label>
            <div className="col-sm-2">
              <SelectBox />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1">{t("Tag Business Lab")}:</label>
            <div className="col-sm-2">
              <SelectBox />
            </div>

            <label className="col-sm-1">{t("Client Name")}:</label>
            <div className="col-sm-2">
              <SelectBox />
            </div>
          </div>
        </div>
      </div>

      <div className="box form-horizontal">
        <div className="box-header with-border">
          <div className="col-sm-1">
            <input type="checkbox"></input>
            <label>{t("Pending")}</label>
          </div>

          <div className="col-sm-1">
            <input type="checkbox"></input>
            <label>{t("Approved")}</label>
          </div>

          <div className="col-sm-1">
            <button className="btn btn-block btn-danger btn-sm">
              {t("Cancel")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CampConfigurationMaster;
