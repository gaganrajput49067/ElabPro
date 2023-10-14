import React, { useState, useEffect } from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";
import moment from "moment";
import axios from "axios";
import Loading from "../../Frontend/util/Loading";
import { number } from "../../Frontend/util/Commonservices/number";
import { validationForIDMAster } from "../../ChildComponents/validations";
import { toast } from "react-toastify";
import {
  getTrimmedData,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import Input from "../../ChildComponents/Input";
// import DatePicker from "../../Frontend/Components/DatePicker";

import { useTranslation } from "react-i18next";
const IDMaster = () => {
  const { t } = useTranslation();
  const [update, setUpdate] = useState(false);
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState({});
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [TypeName, setTypeName] = useState([]);
  const [Separator, setSeparator] = useState([]);
  const [LengthList, setLengthList] = useState([]);
  const [formData, setFormData] = useState({
    TypeID: "",
    TypeName: "",
    InitialChar: "",
    Separator1: "",
    FinancialYearStart: moment().format("YYYY-MM-DD"),
    Separator2: "",
    TypeLength: "",
    Separator3: "",
    FormatPreview: "",
    chkCentre: false,
    chkFinancialYear: false,
    isActive: false,
  });

  // console.log(TypeName);

  const DateSelect = (name, date) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const getDropDownData = (name) => {
    axios
      .post("/api/v1/Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            label: ele.FieldDisplay,
            value: ele.FieldDisplay,
          };
        });

        switch (name) {
          case "IDMaster":
            value.unshift({ label: "Type Name", value: "" });
            setTypeName(value);
            break;
          case "Separator":
            value.unshift({ label: "Separator", value: "" });
            setSeparator(value);
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  const getIdMasterDropDown = () => {
    axios
      .get("/api/v1/IDMaster/gettypelengthMaster")
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            value: ele?.TypeLengthId,
            label: ele?.NAME,
          };
        });
        // val.unshift({ label: "Length", value: "" });
        setLengthList(val);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const getIDMaster = () => {
    axios
      .get("/api/v1/IDMaster/getIDMasterData", formData)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  useEffect(() => {
    let data = moment(formData?.FinancialYearStart).format("YY");
    let val = Number(data) + 1;

    setFormData({
      ...formData,
      FormatPreview: `${formData?.InitialChar}${formData?.Separator1}${
        formData?.chkFinancialYear ? data + val : ""
      }${formData?.Separator2}${formData?.chkCentre ? "CC" : ""}${
        formData?.Separator3
      }${selectedValueCheck(LengthList, formData?.TypeLength).label}`,
    });
  }, [
    formData?.InitialChar,
    formData?.Separator1,
    formData?.FinancialYearStart,
    formData?.chkFinancialYear,
    formData?.Separator2,
    formData?.chkCentre,
    formData?.Separator3,
    formData?.TypeLength,
  ]);

  const editIDMaster = (id) => {
    axios
      .post("/api/v1/IDMaster/getIDMasterDataByID", {
        TypeID: id,
      })
      .then((res) => {
        const data = res.data.message[0];
        setFormData(data);
      })
      .catch((err) => console.log(err));
    getDropDownData("IDMaster");
  };

  const postData = () => {
    const generatedError = validationForIDMAster(formData);
    if (generatedError == "") {
      setLoad(true);
      if (update === true) {
        axios
          .post(
            "/api/v1/IDMaster/UpdateIDMasterData",
            getTrimmedData({
              ...formData,
              // chkCentre: formData?.c ? "1" : "0",
              // chkFinancialYear: formData?.chkFinancialYear ? "1" : "0",
              // isActive: "0",
            })
          )
          .then((res) => {
            if (res.data.message) {
              setLoad(false);
              toast.success(res.data.message);
              getIDMaster();
              setFormData({
                TypeID: "",
                TypeName: "",
                InitialChar: "",
                Separator1: "",
                FinancialYearStart: moment().format("YYYY-MM-DD"),
                Separator2: "",
                TypeLength: "",
                Separator3: "",
                FormatPreview: "",
                chkCentre: false,
                chkFinancialYear: false,
                isActive: false,
              });
              setUpdate(false);
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
        setLoad(true);

        axios
          .post(
            "/api/v1/IDMaster/InsertIDMasterDatas",
            getTrimmedData({
              ...formData,
              chkCentre: formData?.chkCentre ? "1" : "0",
              chkFinancialYear: formData?.chkFinancialYear ? "1" : "0",
              isActive: "0",
            })
          )
          .then((res) => {
            if (res.data.message) {
              setLoad(false);
              toast.success(res.data.message);
              setFormData({
                TypeID: "",
                TypeName: "",
                InitialChar: "",
                Separator1: "",
                FinancialYearStart: moment().format("YYYY-MM-DD"),
                Separator2: "",
                TypeLength: "",
                Separator3: "",
                FormatPreview: "",
                chkCentre: false,
                chkFinancialYear: false,
                isActive: false,
              });
              getIDMaster();
            } else {
              toast.error("Something went wrong");
            }
          })
          .catch((err) => {
            toast.error(err.response.data.message);
            setLoad(false);
          });
      }
    } else {
      setErr(generatedError);
    }
  };

  useEffect(() => {
    getDropDownData("IDMaster");
    getDropDownData("Separator");
    getIdMasterDropDown();
    getIDMaster();
  }, []);

  return (
    <div className="box box-success form-horizontal">
      <div className="box-header with-border">
        <h3 className="box-title">{t("ID Master")}</h3>
      </div>
      <div className="box-body">
        <div className="row">
          <label className="col-sm-1" htmlFor="inputEmail3">
           {t("Type")}:
          </label>
          <div className="col-sm-2">
            <div>
              <SelectBox
                name="TypeName"
                options={TypeName}
                onChange={handleSelectChange}
                selectedValue={formData?.TypeName}
              />
            </div>

            {formData?.TypeName === "" && (
              <div className="golbal-Error">{err?.TypeName}</div>
            )}
          </div>
          <label className="col-sm-1" htmlFor="inputEmail3">
            {t("Initial Char")}:
          </label>
          <div className="col-sm-2">
            <Input
              className="select-input-box form-control input-sm"
              onInput={(e) => number(e, 8)}
              name="InitialChar"
              type="text"
              placeholder={t("Initial Char")}
              value={formData?.InitialChar}
              onChange={handleChange}
            />
            {formData?.InitialChar === "" && (
              <div className="golbal-Error">{err?.InitialChar}</div>
            )}
          </div>
          <label className="col-sm-1" htmlFor="inputEmail3">
          {t("Separator")}:
          </label>
          <div className="col-sm-2">
            <SelectBox
              name="Separator1"
              options={Separator}
              onChange={handleSelectChange}
              selectedValue={formData?.Separator1}
            />
          </div>
          <label className="col-sm-1" htmlFor="inputEmail3">
           {t("Financial Year")}:
          </label>
          <div className="col-sm-2">
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <Input
                className="select-input-box"
                name="chkFinancialYear"
                type="checkbox"
                style={{ width: "17px", height: "17px" }}
                checked={formData?.chkFinancialYear}
                onChange={handleChange}
                value={formData?.chkFinancialYear}
              />

              <Input
                className="select-input-box form-control input-sm mx-4"
                type="Date"
                placeholder={"Financial Year"}
                max={moment().format("YYYY-MM-DD")}
                value={moment(formData?.FinancialYearStart).format(
                  "YYYY-MM-DD"
                )}
                onChange={handleChange}

                // id="txtFromDate"
              />
              <div className="field-validation-valid text-danger">
                {err?.FinancialYearStart}
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <label className="col-sm-1" htmlFor="inputEmail3">
           {t("Separator")} :
          </label>
          <div className="col-sm-2">
            <SelectBox
              name="Separator2"
              options={Separator}
              onChange={handleSelectChange}
              selectedValue={formData?.Separator2}
            />
          </div>
          <label className="col-sm-1" htmlFor="inputEmail3">
           {t("Center")}:
          </label>
          <div className="col-sm-2">
            <Input
              name="chkCentre"
              placeholder={"Centre"}
              style={{ width: "28px", height: "20px" }}
              type="checkbox"
              onChange={handleChange}
              checked={formData?.chkCentre}
            />
          </div>
          <label className="col-sm-1" htmlFor="inputEmail3">
           {t("Separator")}:
          </label>
          <div className="col-sm-2">
            <SelectBox
              name="Separator3"
              options={Separator}
              onChange={handleSelectChange}
              selectedValue={formData?.Separator3}
            />
          </div>
          <label className="col-sm-1" htmlFor="inputEmail3">
           {t("Length")}:
          </label>
          <div className="col-sm-2">
            {/* <label
              className="control-label"
              htmlFor="TypeLength"
              style={{ fontWeight: "bold" }}
            >
              Length
            </label> */}

            <SelectBox
              name="TypeLength"
              options={[{label:"Length",value:""},...LengthList]}
              onChange={handleSelectChange}
              selectedValue={formData?.TypeLength}
            />
          </div>

          {/* <div className="col-sm-2">
            <label
              className="control-label"
              htmlFor="FormatPreview"
              style={{ fontWeight: "bold" }}
            >
              Preview
            </label>
          </div> */}
        </div>
        <div className="row">
          <label className="col-sm-1" htmlFor="inputEmail3">
           {t("Preview")}:
          </label>
          <div className="col-sm-2">
            <Input
              className="select-input-box form-control input-sm"
              name="FormatPreview"
              type="text"
              disabled
              placeholder={t("Preview")}
              onChange={handleChange}
              value={formData?.FormatPreview}
            />
            {err?.FormatPreview}
          </div>
          <div className="col-sm-1">
            {load ? (
              <Loading />
            ) : (
              <button
                type="submit"
                id="btnSave"
                className="btn btn-success btn-sm btn-block"
                onClick={postData}
              >
                {update ? t("Update") : t("Save")}
              </button>
            )}
          </div>
        </div>
        {/* </div> */}
        {/* <br /> */}

        <br />
        {loading ? (
          <Loading />
        ) : (
          <div
            className=" box-body divResult table-responsive boottable"
            id="no-more-tables"
          >
            <div className="row">
              {data.length > 0 ? (
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead class="cf">
                    <tr>
                      <th>{t("S.No")}</th>
                      <th>{t("Type Name")}</th>
                      <th>{t("Initial Character")}</th>
                      <th>{t("Separator")}</th>
                      <th>{t("Financial Year")}</th>
                      <th>{t("Separator")}</th>
                      <th>{t("Type Length")}</th>
                      <th>{t("Separator")}</th>
                      <th>{t("Format Preview")}</th>
                      <th>{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((data, i) => (
                      <tr key={i}>
                        <td data-title={t("S.No")}>{i + 1}&nbsp;</td>
                        <td data-title={t("Type Name")}>{data?.TypeName}&nbsp;</td>
                        <td data-title={t("Initial Character")}>
                          {data?.InitialChar}&nbsp;
                        </td>
                        <td data-title={t("Separator")}>{data?.Separator1}&nbsp;</td>
                        <td data-title={t("Financial Year")}>
                          {data?.FinancialYearStart !== "0000-00-00 00:00:00"
                            ? moment(data?.FinancialYearStart).format(
                                "DD MMM YYYY"
                              )
                            : "-"}
                          &nbsp;
                        </td>
                        <td data-title={t("Separator")}>{data?.Separator2}&nbsp;</td>
                        <td data-title={t("Type Length")}>
                          {data?.TypeLength}&nbsp;
                        </td>
                        <td data-title={t("Separator")}>{data?.Separator3}&nbsp;</td>
                        <td data-title={t("Format Preview")}>
                          {data?.FormatPreview}&nbsp;
                        </td>
                        <td data-title={t("Action")}>
                          <div
                            className="text-primary"
                            style={{
                              cursor: "pointer",
                              textDecoration: "underline",
                            }}
                            onClick={() => {
                              window.scroll(0, 0);
                              editIDMaster(data?.TypeID);
                              setUpdate(true);
                            }}
                          >
                           {t("Edit")} 
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                " No Data Found"
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IDMaster;
