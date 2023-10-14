import React from "react";
import { useState } from "react";
import axios from "axios";
import Loading from "../../Frontend/util/Loading";
import { Link } from "react-router-dom";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { DataType } from "../../ChildComponents/Constants";
import Input from "../../ChildComponents/Input";
import { toast } from "react-toastify";

import { useTranslation } from "react-i18next";

const InvestigationsList = () => {
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    DataType: "",
    TestName: "",
    ShortName: "",
    TestCode: "",
  });

   
    const { t } = useTranslation();
    


  const [data, setData] = useState([]);

  const handleSelect = (e) => {
    const { name,value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleActiveSingle = (e, i, arr) => {
    checkboxEdit(arr?.InvestigationID, arr.isActive === 1 ? 0 : 1);
  };

  const getInvestigationsList = (e) => {
    setLoading(true);
    axios
      .post("/api/v1/Investigations/GetInvestigations", payload)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };
  // console.log(payload?.DataType);

  const checkboxEdit = (InvestigationId, isActive) => {
    axios
      .post("/api/v1/Investigations/UpdateActiveInActive", {
        InvestigationId: InvestigationId,
        isActive: isActive,
      })
      .then((res) => {
        if (res.data.message) {
          toast.success("Updated Successfully");
          getInvestigationsList();
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        getInvestigationsList();
      });
  };
  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Investigations List")}</h3>
          <Link
            className="list_item"
            to="/Investigations"
            state={{
              url: "/api/v1/Investigations/CreateInvestigation",
            }}
          >
            {t("Create New")}
          </Link>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("DataType")}:
            </label>
            <div className="col-sm-2">
              <SelectBox
                name="DataType"
                options={DataType}
                selectedValue={payload?.DataType}
                onChange={handleSelect}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              ShortName:
            </label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                value={payload?.ShortName}
                placeholder={"ShortName"}
                onChange={handleChange}
                name="ShortName"
                type="text"
                max={100}
                // onBlur={handleBlur}
                required
              />
            </div>
            <label className="col-sm-1">{t("TestName")}:</label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                name="TestName"
                placeholder={t("TestName")}
                type="text"
                value={payload?.TestName}
                onChange={handleChange}
              />
            </div>
            <label className="col-sm-1">{t("TestCode")}:</label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                name="TestCode"
                type="text"
                value={payload?.TestCode}
                onChange={handleChange}
                placeholder={t("TestCode")}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-1">
              <button
                type="submit"
                className="btn btn-block btn-info btn-sm"
                onClick={getInvestigationsList}
              >
                {t("Search")}
              </button>
            </div>
          </div>
        </div>
        {/*box-body end */}
        <div className="box-body">
          {loading ? (
            <Loading />
          ) : (
            <div
              className="box-body divResult table-responsive"
              id="no-more-tables"
            >
              {data.length > 0 && (
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf">
                    <tr>
                      <th>{t("S.No")}</th>
                      <th>{t("Data Type")}</th>
                      <th>{t("Test Name")}</th>
                      <th>{t("Test Code")}</th>
                      <th>{t("Active / InActive")}</th>
                      <th>{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((data, i) => (
                      <tr key={i}>
                        <td data-title={t("S.No")}>{i + 1}&nbsp;</td>
                        <td data-title={t("Data Type")}>
                          {data?.DataType}&nbsp;
                        </td>
                        <td data-title={t("Test Name")}>
                          {data?.TestName}&nbsp;
                        </td>
                        <td data-title={t("Test Code")}>
                          {data?.TestCode}&nbsp;
                        </td>
                        <td data-title={t("Active / InActive")}>
                          <Input
                            type="checkbox"
                            name="isActive"
                            checked={data?.isActive}
                            onChange={(e) => handleActiveSingle(e, i, data)}
                          />
                        </td>
                        <td data-title={t("Action")}>
                          <Link
                            to="/Investigations"
                            state={{
                              other: {
                                button: "Update",
                                pageName: "Edit",
                                showButton: true,
                              },
                              url1: `/api/v1/Investigations/EditInvestigation?id=${data?.InvestigationID}&DataType=${data?.DataType}`,
                              url: "/api/v1/Investigations/UpdateInvestigation",
                            }}
                          >
                            {t("Edit")}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default InvestigationsList;
