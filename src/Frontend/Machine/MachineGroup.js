import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import Loading from "../util/Loading";

import { useTranslation } from "react-i18next";
const MachineGroup = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    MachineName: "",
  });

  const { t, i18n } = useTranslation();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const fetch = () => {
    setLoading(true);
    axios
      .get("/api/v1/MachineGroup/BindMachineGroup")
      .then((res) => {
        setTableData(res?.data?.message);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went Wrong"
        );
        setLoading(false);
      });
  };

  const BindData = (data) => {
    setState({
      ID: data?.ID,
      MachineName: data?.Name,
    });
  };

  const handleSave = (url) => {
    axios
      .post(url, state)
      .then((res) => {
        toast.success(res?.data?.message);
        setState({
          MachineName: "",
        });
        fetch();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went Wrong"
        );
      });
  };

  useEffect(() => {
    fetch();
  }, []);
  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h6 className="box-title">{t("Machine Group")}</h6>
        </div>

        <div className="box-body">
          <div className="row">
            <div className="col-sm-2">
              <Input
                placeholder={t("Machine Name")}
                className="select-input-box form-control input-sm"
                type="text"
                max={25}
                name="MachineName"
                value={state?.MachineName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-sm-1" style={{ alignSelf: "flex-end" }}>
              {loading ? (
                <Loading />
              ) : state?.ID ? (
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={() =>
                    handleSave("/api/v1/MachineGroup/UpdateMachineGroup")
                  }
                  disabled={state?.MachineName?.length > 3 ? false : true}
                >
                  {t("Update")}
                </button>
              ) : (
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={() =>
                    handleSave("/api/v1/MachineGroup/InsertMachineGroup")
                  }
                  disabled={state?.MachineName?.length > 3 ? false : true}
                >
                  {t("Save")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="box form-horizontal">
          <div className="box-header with-border">
            <h6 className="box-title">{t("Machine Group")}</h6>
          </div>

          <div
            className=" box-body divResult table-responsive boottable"
            id="no-more-tables"
          >
            <table
              className="table table-bordered table-hover table-striped tbRecord"
              cellPadding="{0}"
              cellSpacing="{0}"
            >
              <thead className="cf">
                <tr>
                  {[t("S.No"), t("Name"), t("Action")].map((ele, index) => (
                    <th key={index}>{ele}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData?.map((ele, index) => (
                  <tr key={index}>
                    <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                    <td data-title={t("Name")}>{ele?.Name}&nbsp;</td>
                    <td
                      data-title={t("Action")}
                      className="text-info"
                      style={{
                        textDecoration: "underline",
                        cursor: "pointer",
                      }}
                      onClick={() => BindData(ele)}
                    >
                      {t("Select")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default MachineGroup;
