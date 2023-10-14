import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getAccessCentres, getCollectionBoy } from "../util/Commonservices";
import DatePicker from "../Components/DatePicker";
import Loading from "../util/Loading";
import moment from "moment";
import { Status } from "../../ChildComponents/Constants";
import Input from "../../ChildComponents/Input";
import { dateConfig } from "../util/DateConfig";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { SimpleCheckbox } from "../../ChildComponents/CheckBox";
import { useTranslation } from "react-i18next";
function SendSampleToLab() {
  const [Center, setCenter] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [ToCenter, setToCenter] = useState([]);
  const [CollectionBoy, setCollectionBoy] = useState([]);
  const [load, setLoad] = useState({
    searchLoad: false,
    saveLoad: false,
  });
  const [errors, setErrors] = useState({});

const { t, i18n } = useTranslation();
  const [payload, setPayload] = useState({
    FromCentre: "",
    DATE: new Date(),
    ToDate: new Date(),
    ToTime: "23:59:59",
    FromTime: "00:00:00",
    Status: "1",
    ToCentre: "",
    EqualCentre: 0,
    FieldBoyID: "",
    FieldBoyName: "",
    ChkForce: 0,
    TestName: "",
  });


  const handleSelection = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    if (name === "FieldBoyID") {
      setPayload({
        ...payload,
        [name]: value,
        FieldBoyName: label,
      });
    } else {
      setPayload({ ...payload, [name]: value });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPayload({
      // rahul
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const validationFields = () => {
    let errors = "";
    if (payload?.ToCentre === "") {
      errors = { ...errors, ToCenter: "Please Select Centre" };
    }

    if (payload?.FieldBoyID === "") {
      errors = {
        ...errors,
        FieldBoyID: "Please Select Collection Boy",
      };
    }

    return errors;
  };
  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;

    setPayload({ ...payload, [secondName]: TimeStamp });
  };

  const handleSave = () => {
    const generatedError = validationFields();
    if (generatedError === "") {
      setErrors({});
      let data = tableData?.filter((ele) => ele?.isSelected === true);
      if (data.length > 0) {
        setLoad({ ...load, saveLoad: true });

        const newdata = data.map((ele) => {
          return {
            ...ele,
            TestID: ele?.TestID,
            BarcodeNo: ele?.BarcodeNo,
            // rahu
            VisitID: ele?.LedgerTransactionNo,
            PatientCode: ele?.PatientCode,
            ItemName: ele?.TestName,
            FromCentre: payload?.FromCentre,
            ToCentre: payload?.ToCentre,
            FieldBoyID: payload?.FieldBoyID,
            FieldBoyName: payload?.FieldBoyName,
          };
        });
        axios
          .post("/api/v1/SendSampleToLab/SendSampleToLab", newdata)
          .then((res) => {
            toast.success(res?.data?.message);
            setTableData([]);
            // setPayload({
            //   FromCentre: "1",
            //   // DATE: moment(new Date()).format("YYYY-MM-DD"),
            //   // ToDate: moment(new Date()).format("YYYY-MM-DD"),
            //   ToTime: "23:59:59",
            //   FromTime: "00:00:00",
            //   Status: "1",
            //   ToCentre: "Select",
            //   FieldBoyID: "",
            //   FieldBoyName: "",
            // });
            setLoad({ ...load, saveLoad: false });
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Error Occured"
            );
            setLoad({ ...load, saveLoad: false });
          });
      } else {
        toast.error("Please Choose One Value");
      }
    } else {
      setErrors(generatedError);
    }
  };

  const handleSelectValue = () => {
    let match = false;
    for (let i = 0; i < tableData.length; i++) {
      if (tableData[i]["isSelected"]) {
        match = true;
        break;
      }
    }
    return match;
  };

  const dateSelect = (date, name) => {
    setPayload({
      ...payload,
      [name]: date,
    });
  };

  const getToAccessCenter = () => {
    axios
      .post("/api/v1/SendSampleToLab/TransferCentreList", {
        BookingCentreID: payload?.FromCentre,
      })
      .then((res) => {
        let data = res?.data?.message;
        data = data.filter((ele) => ele?.CentreID != payload?.FromCentre);
        const val = data.map((ele) => {
          return {
            value: ele?.CentreID,
            label: ele?.Centre,
          };
        });
        setToCenter(val);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getToAccessCenter();
  }, [payload?.FromCentre]);

  const handleSearch = () => {
    const generatedError = validation();
    if (generatedError === "") {
      setLoad({ ...load, searchLoad: true });
      axios
        .post("/api/v1/SendSampleToLab/SearchDataToSendSample", {
          ...payload,
          DATE: moment(payload?.DATE).format("YYYY-MM-DD"),
          ToDate: moment(payload?.ToDate).format("YYYY-MM-DD"),
          TestCentre: payload?.ToCentre,
        })
        .then((res) => {
          const data = res.data.message;
          if (data.length > 0) {
            const val = data.map((ele) => {
              return {
                ...ele,
                isSelected: false,
              };
            });
            setTableData(val);
          } else {
            toast.error("No Data Found");
          }
          setLoad({ ...load, searchLoad: false });
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoad({ ...load, searchLoad: false });
        });
    } else {
      toast.error(generatedError);
    }
  };

  const validation = () => {
    let error = "";
    if (!payload?.FromCentre) {
      error = "Please Select FromCentre.";
    } else if (!payload?.ToCentre) {
      error = "Please Select ToCentre.";
    }
    return error;
  };

  const handleSelected = (e, index) => {
    const { name, checked } = e.target;
    const data = [...tableData];
    data[index][name] = checked;
    setTableData(data);
  };

  // console.log(tableData);

  useEffect(() => {
    getAccessCentres(setCenter);
    getCollectionBoy(setCollectionBoy);
    getToAccessCenter();
  }, []);
  return (
    <div className="box box-success">
      <div className="box-header with-border">
        <span className="box-title">{t("Send Sample To Lab")}</span>
      </div>
      <div className="box-body">
        <div className="row">
          <label className="col-sm-1" htmlFor="inputEmail3">
            {t("FromCentre")}:
          </label>
          <div className="col-sm-2">
            <SelectBox
              options={[{ label: "Select", value: "" }, ...Center]}
              name="FromCentre"
              selectedValue={payload?.FromCentre}
              onChange={handleSelection}
            />
          </div>
          <label className="col-sm-1" htmlFor="inputEmail3">
            {t("FromTime")}:
          </label>
          <div className="col-sm-2 ">
            <div>
              <DatePicker
                name="DATE"
                date={payload?.DATE}
                onChange={dateSelect}
                onChangeTime={handleTime}
                secondName="FromTime"
                maxDate={new Date()}
              />

              {errors?.FromDate && (
                <span className="golbal-Error">{errors?.FromDate}</span>
              )}
            </div>
          </div>
          <label className="col-sm-1" htmlFor="inputEmail3">
            {t("ToTime")}:
          </label>
          <div className="col-sm-2 ">
            <div>
              <DatePicker
                name="ToDate"
                date={payload?.ToDate}
                onChange={dateSelect}
                onChangeTime={handleTime}
                secondName="ToTime"
                maxDate={new Date()}
                minDate={new Date(payload.FromDate)}
              />

              {errors?.ToDate && (
                <span className="golbal-Error">{errors?.ToDate}</span>
              )}
            </div>
          </div>

          <label className="col-sm-1" htmlFor="inputEmail3">
            {t("Status")}:
          </label>
          <div className="col-sm-2">
            <SelectBox
              options={Status}
              name="Status"
              onChange={handleSelection}
              selectedValue={payload?.Status}
            />
          </div>
        </div>
        <div className="row">
          <label className="col-sm-1" htmlFor="inputEmail3">
            {t("ToCentre")}:
          </label>
          <div className="col-sm-2">
            <SelectBox
              options={[{ label: "Select", value: "" }, ...ToCenter]}
              name="ToCentre"
              selectedValue={payload?.ToCentre}
              onChange={handleSelection}
            />
            {errors?.ToCenter && (
              <span className="golbal-Error">{errors?.ToCenter}</span>
            )}
          </div>

          <div className="col-sm-2">
            <SimpleCheckbox
              name="ChkForce"
              type="checkbox"
              checked={payload?.ChkForce}
              onChange={handleChange}
            />
            <label className="control-label" htmlFor="ApplicableForAll">
              {t("Show All Sample")}
            </label>
          </div>

          {/* rahulj */}

          <div className="col-sm-1" style={{ alignSelf: "flex-end" }}>
            {load?.searchLoad ? (
              <Loading />
            ) : (
              <button
                className="btn btn-info btn-sm btn-block"
                onClick={handleSearch}
              >
                {t("Search")}
              </button>
            )}
          </div>
        </div>
      </div>

      {tableData.length > 0 && (
        <div className="box">
          <div
            className="box-body divResult table-responsive"
            id="no-more-tables"
          >
            <table
              cellPadding="{0}"
              cellSpacing="{0}"
              className="table table-bordered table-hover table-striped tbRecord"
            >
              <thead className="cf">
                <tr>
                  <th>{t("S.No")}</th>
                  <th>{t("Select")}</th>
                  <th>{t("DispatchCode")}</th>
                  <th>{t("SIN No.")}</th>
                  <th>{t("VisitNo")}</th>
                  <th>{t("PatientCode")}</th>
                  <th>{t("Name")}</th>
                  <th>{t("Age")}</th>
                  <th>{t("Test")}</th>
                  {/* <th>{t("Reg Date")}</th> */}
                </tr>
              </thead>
              <tbody>
                {tableData?.map((data, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor: data?.dispatchcode !== "" && "#9795c6",
                    }}
                  >
                    <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                    <td data-title={t("Select")}>
                      {data?.issend === 1 && data?.dispatchcode === "" && (
                        <Input
                          type="checkbox"
                          checked={data?.isSelected}
                          name="isSelected"
                          onChange={(e) => handleSelected(e, index)}
                        />
                      )}
                      &nbsp;
                    </td>
                    <td data-title={t("DispatchCode")}>
                      {data?.DispatchCode ? data?.DispatchCode : "-"}&nbsp;
                    </td>
                    <td data-title={t("SIN No.")}>{data?.BarcodeNo}&nbsp;</td>
                    <td data-title={t("VisitNo")}>
                      {data?.LedgerTransactionNo}&nbsp;
                    </td>
                    <td data-title={t("PatientCode")}>
                      {data?.PatientCode}&nbsp;
                    </td>
                    <td data-title={t("Name")}>{data?.PName}&nbsp;</td>
                    <td data-title={t("Age")}>
                      {data?.Pinfo ? data?.Pinfo : "-"}&nbsp;
                    </td>
                    <td data-title={t("Test")}>{data?.TestName}&nbsp;</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {payload?.Status == 1 && handleSelectValue() && (
            <div className="box-footer">
              <div className="d-flex align-items-center justify-content-end">
                <label className="col-sm-1" htmlFor="Title">
                   {t("Collection Boy")}:
                </label>

                <div className="col-sm-2">
                  <SelectBox
                    options={[{ label: "Select", value: "" }, ...CollectionBoy]}
                    name="FieldBoyID"
                    selectedValue={payload?.FieldBoyID}
                    onChange={handleSelection}
                  />
                  {errors?.FieldBoyID && (
                    <span className="golbal-Error">{errors?.FieldBoyID}</span>
                  )}
                </div>

                <div className="col-sm-1" style={{ alignSelf: "flex-end" }}>
                  {load?.saveLoad ? (
                    <Loading />
                  ) : (
                    <button
                      className="btn btn-success btn-sm btn-block"
                      onClick={handleSave}
                    >
                      {t("Save")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SendSampleToLab;
