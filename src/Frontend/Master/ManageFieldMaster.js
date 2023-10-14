import React, { useEffect, useState } from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { getVisitType } from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";
import Input from "../../ChildComponents/Input";
import axios from "axios";
import { toast } from "react-toastify";

import { useTranslation } from "react-i18next";

const Field = [
  { FieldType: "OPD/IPD", IsVisible: 0, IsMandatory: 0 },
  { FieldType: "BedNo", IsVisible: 0, IsMandatory: 0 },
  { FieldType: "Source", IsVisible: 0, IsMandatory: 0 },
  // { FieldType: "Patient Type", IsVisible: 0, IsMandatory: 0 },
  { FieldType: "Vip&Masking", IsVisible: 0, IsMandatory: 0 },
];

const ManageFieldMaster = () => {
  const [VisitType, setVisitType] = useState([]);
  const [load, setLoad] = useState(true);
  const [disable, setDisable] = useState({
    update: true,
    loading: false,
  });
  const [tableData, setTableData] = useState([]);
  const [payload, setPayload] = useState({
    visitId: "",
    VisitType: "",
  });
      const { t } = useTranslation();

  const fetch = (payloads) => {
    setLoad(true);
    axios
      .post("/api/v1/ManageFieldMaster/getAllManageFieldMasterData", {
        VisitTypeID: payloads,
      })
      .then((res) => {
        setDisable({
          ...disable,
          update: res?.data?.message.length > 0 ? true : false,
        });
        const data = res.data?.message.length > 0 ? res.data?.message : Field;
        let val = data.map((ele) => {
          return {
            FieldType: ele?.FieldType,
            IsVisible: ele?.IsVisible,
            IsMandatory: ele?.IsMandatory,
            VisitType: payload?.VisitType,
            VisitTypeID: payload?.visitId,
          };
        });
        setTableData(val);
        setLoad(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoad(false);
      });
  };

  const handleChange = (e, index) => {
    const { name, checked } = e.target;
    const data = [...tableData];
    data[index][name] = checked ? 1 : 0;
    if (!checked) {
      data[index]["IsMandatory"] = 0;
    }
    setTableData(data);
  };

  const handleSelect = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    setPayload({ ...payload, [name]: value, VisitType: label });
  };

  console.log(tableData);

  const handleSubmit = (url) => {
    setDisable({ ...disable, loading: true });
    axios
      .post(url, tableData)
      .then((res) => {
        toast.success(res?.data?.message);
        fetch(payload?.visitId);
        setDisable({ ...disable, loading: false });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setDisable({ ...disable, loading: false });
      });
  };

  useEffect(() => {
    if (VisitType.length > 0) {
      setPayload({
        ...payload,
        visitId: VisitType[0].value,
        VisitType: VisitType[0].label,
      });
    }
  }, [VisitType]);

  useEffect(() => {
    if (payload?.visitId !== "") {
      fetch(payload?.visitId);
    }
  }, [payload?.visitId]);

  useEffect(() => {
    getVisitType(setVisitType);
  }, []);
  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h1 className="box-title">{t("Mange Field Master")}</h1>
          <div className="row ManageFieldVisit">
            <label className="col-sm-1">{t("Visit Type")}:</label>
            <div className="col-sm-5">
              <SelectBox
                options={VisitType}
                selectedValue={payload?.visitId}
                name="visitId"
                onChange={handleSelect}
              />
            </div>
          </div>
        </div>
        <div className="box-body divResult boottable" id="no-more-tables">
          <div className="row">
            <div className="col-sm-12">
              <table
                className="table table-bordered table-hover table-striped tbRecord"
                cellPadding="{0}"
                cellSpacing="{0}"
              >
                <thead className="cf">
                  <tr>
                    <th>{t("Field Type")}</th>
                    <th>{t("IsVisible")}</th>
                    <th>{t("IsMandatory")}</th>
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((data, index) => (
                    <tr key={index}>
                      <td>{data?.FieldType}</td>
                      <td>
                        <Input
                          type="checkbox"
                          checked={data?.IsVisible === 1 ? true : false}
                          name="IsVisible"
                          onChange={(e) => handleChange(e, index)}
                        />
                      </td>
                      <td>
                        <Input
                          type="checkbox"
                          checked={data?.IsMandatory}
                          disabled={data?.IsVisible === 1 ? false : true}
                          name="IsMandatory"
                          onChange={(e) => handleChange(e, index)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {disable?.loading ? (
          <Loading />
        ) : (
          <>
            <div className="box-footer">
              <div className="row">
                <div className="col-sm-1">
                  <button
                    type="button"
                    className="btn btn-block btn-success btn-sm"
                    id="btnSave"
                    onClick={() =>
                      handleSubmit(
                        "/api/v1/ManageFieldMaster/SaveManageFieldMasterData"
                      )
                    }
                    disabled={disable?.update ? true : false}
                  >
                    {t("Save")}
                  </button>
                </div>
                <div className="col-sm-1">
                  <button
                    type="button"
                    className="btn btn-block btn-success btn-sm"
                    id="btnSave"
                    onClick={() =>
                      handleSubmit(
                        "/api/v1/ManageFieldMaster/UpdateManageFieldMasterData"
                      )
                    }
                    disabled={disable?.update ? false : true}
                  >
                   {t("Update")} 
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ManageFieldMaster;
