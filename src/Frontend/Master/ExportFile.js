import React from "react";

import { useTranslation } from "react-i18next";
import { ExportToExcel } from "./../util/Commonservices/index";
function ExportFile({ dataExcel }) {
  const { t } = useTranslation();
  return (
    <>
      {/* <div className="col-sm-2"> */}
      <button
        className="btn btn-block btn-success btn-sm"
        onClick={() => ExportToExcel(dataExcel)}
        disabled={dataExcel.length == 0}
      >
        {t("Download")}
      </button>
      {/* </div> */}
    </>
  );
}

export default ExportFile;
