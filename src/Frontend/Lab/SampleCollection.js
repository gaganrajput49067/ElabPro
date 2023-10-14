import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { DatePickers } from "../../ChildComponents/DatePicker";
import { SelectBox } from "../../ChildComponents/SelectBox";
import moment from "moment";
import urgentGIF from "./../../images/urgent1.gif";
import VIP from "./../../images/vip.gif";
import {
  SampleSource,
  SampleStatusSearch,
  SearchBy,
} from "../../ChildComponents/Constants";
import axios from "axios";
import Input from "../../ChildComponents/Input";
// import BootTable from "../../Table/DepartmentReceive";
import Loading from "../util/Loading";
import { toast } from "react-toastify";
import SamleCollectionTable from "./SamleCollectionTable";
import {
  autocompleteOnBlur,
  checkDuplicateBarcode,
  getAccessDataRate,
  getDoctorSuggestion,
  getPaymentModes,
  getTrimmedData,
  isChecked,
} from "../util/Commonservices";
import MedicialModal from "../util/MedicialModal";
import UploadModal from "../util/UploadModal";
import DatePicker from "./../Components/DatePicker";
import { dateConfig } from "./../util/DateConfig";
import { useTranslation } from "react-i18next";
import { number } from "../util/Commonservices/number";

const SampleCollection = () => {
  const [CentreData, setCentreData] = useState([]);
  const [toggleTable, setToggleTable] = useState(true);
  const [RateData, setRateData] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [payload, setPayload] = useState([]);
  const [Identity, setIdentity] = useState([]);

  const [scdata, setScData] = useState([]);
  const [searchInvdata, setSearchInvdata] = useState([]);
  const [newdata, setNewData] = useState([]);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [indexMatch, setIndexMatch] = useState(0);
  const [dropFalse, setDropFalse] = useState(true);
  const [show4, setShow4] = useState({
    modal: false,
    data: "",
    index: -1,
  });
  const [show, setShow] = useState({
    modal: false,
    data: "",
    index: -1,
  });

  const [formData, setFormData] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    CentreID: "",
    ItemValue: "",
    RateID: "",
    SelectTypes: "",
    RefundFilter: null,
    FromTime: "00:00:00",
    ToTime: "23:59:59",
    DoctorReferal: "",
    DepartmentID: "",
    DoctorName: "",
  });

  // language change

  // i18n start

  const { t } = useTranslation();

  // i18n end

  // end

  const handleIndex = (e) => {
    switch (e.which) {
      case 38:
        if (indexMatch !== 0) {
          setIndexMatch(indexMatch - 1);
        } else {
          setIndexMatch(doctorSuggestion.length - 1);
        }
        break;
      case 40:
        if (doctorSuggestion.length - 1 === indexMatch) {
          setIndexMatch(0);
        } else {
          setIndexMatch(indexMatch + 1);
        }
        break;
      case 13:
        handleListSearch(doctorSuggestion[indexMatch], "DoctorName");
        setIndexMatch(0);
        break;
      default:
        break;
    }
  };

  const handleListSearch = (data, name) => {
    switch (name) {
      case "DoctorName":
        setFormData({
          ...formData,
          [name]: data.Name,
          DoctorReferal: data.Name ? data.DoctorReferalID : "",
        });
        setIndexMatch(0);
        setDoctorSuggestion([]);
        setDropFalse(false);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getDoctorSuggestion(formData, setDoctorSuggestion, setFormData);
    if (formData?.DoctorName === "") {
      setDropFalse(true);
    }
  }, [formData?.DoctorName]);

  const validation = () => {
    let error = "";
    if (formData?.SelectTypes !== "" && formData?.ItemValue === "") {
      error = { ...error, ItemValue: t("Please Choose Value") };
    }

    if (formData.SelectTypes === "Mobile") {
      if (formData?.SelectTypes !== "" && formData?.ItemValue === "") {
        error = { ...error, ItemValue: t("This Field is Required") };
      } else if (formData.ItemValue.length !== 10) {
        error = { ...error, ItemValue: t("Invalid Mobile Number") };
      }
    }

    // if (formData.FromDate > moment(new Date()).format("DD/MMM/YYYY")) {
    //   error = { ...error, FromDate: t("Date is Invalid") };
    // }

    // if (formData.ToDate > moment(new Date()).format("DD/MMM/YYYY")) {
    //   error = { ...error, ToDate: t("Date is Invalid") };
    // } else if (
    //   moment(formData.ToDate).format("DD/MMM/YYYY") <
    //   moment(formData.FromDate).format("DD/MMM/YYYY")
    // ) {

    //   error = {
    //     ...error,
    //     ToDate: t("Date Must be Greater Then Or Equal to From Date"),
    //   };
    // }
    // if (formData.FromDate === moment(new Date()).format("DD/MMM/YYYY")) {
    //   if (formData.FromTime > moment(new Date()).format("hh:mm:ss ")) {
    //     error = { ...error, FromTime: t("Time is Invalid") };
    //   }
    // }

    // if (formData.ToDate === moment(new Date()).format("DD/MMM/YYYY")) {
    //   if (formData.ToTime < formData.FromTime) {
    //     error = { ...error, ToTime: t("Time Must be Less than From Time") };
    //   }
    // }
    return error;
  };

  // const handleToggle = (name) => {
  //   setToggleDate({ ...toggleDate, [name]: !toggleDate[name] });
  // };

  const dateSelect = (date, name) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    console.log(value);
    setFormData({ ...formData, [name]: value });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const getAccessCentres = () => {
    axios
      .get("/api/v1/Centre/getAccessCentres")
      .then((res) => {
        let data = res.data.message;
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        CentreDataValue.unshift({ label: t("All Centre"), value: "" });
        setCentreData(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };

  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;

    setFormData({ ...formData, [secondName]: TimeStamp });
  };

  // const getAccessRateType = () => {
  //   axios
  //     .get("/api/v1/RateType/getAccessRateType")
  //     .then((res) => {
  //       let data = res.data.message;
  //       let CentreDataValue = data.map((ele) => {
  //         return {
  //           value: ele.RateTypeID,
  //           label: ele.Rate,
  //         };
  //       });
  //       CentreDataValue.unshift({ label: "All", value: "" });
  //       setRateData(CentreDataValue);
  //     })
  //     .catch((err) => console.log(err));
  // };

  const getDepartment = () => {
    axios
      .get("/api/v1/Department/getDepartment")
      .then((res) => {
        let data = res.data.message;
        let DeptDataValue = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });

        // DeptDataValue.unshift({ label: t("All Department"), value: "" });
        setDepartmentData(DeptDataValue);
      })
      .catch((err) => console.log(err));
  };

  const filterPayload = (filterData) => {
    const data = filterData.filter(
      (ele) => ele.Status === 1 || ele.Status === 4
    );
    return data;
  };

  const handleCheckboxCondition = useCallback(
    (data) => {
      console.log("hello sahil");
      let status = false;
      for (let i = 0; i < data?.length; i++) {
        if ([1, 4].includes(data[i]["Status"])) {
          status = true;
          break;
        }
      }
      return status;
    },
    [searchInvdata]
  );

  const SaveSampleCollection = () => {
    if (payload?.length > 0) {
      axios
        .post("/api/v1/SC/SampleCollection", {
          data: getTrimmedData(filterPayload(payload)),
        })
        .then((res) => {
          toast.success(res.data.message);
          setPayload([]);
          if (payload.length === searchInvdata.length) {
            TableData("");
          } else {
            // SearchInvestigationData(payload[0]?.LedgerTransactionID);
            TableData(document.getElementById("SampleStatusSearch").value);
          }
        })
        .catch((err) => {
          if (err.response.status === 504) {
            toast.error(t("Something Went Wrong"));
          }
          if (err.response.status === 401) {
            toast.error(err.response.data.message);
          }
        });
    } else {
      toast.error(t("Please Select atlease One Test to Continue"));
    }
  };

  const handleDepartment = (Id) => {
    const Allvalue = Id
      ? [parseInt(Id)]
      : DepartmentData.map((ele) => ele?.value);
    return Allvalue;
  };

  const TableData = (status) => {
    const generatedError = validation();
    if (generatedError === "") {
      setLoading(true);
      axios
        .post(
          "/api/v1/SC/GetSampleCollection",
          getTrimmedData({
            CentreID: formData.CentreID,
            SelectTypes: formData.SelectTypes,
            ItemValue: formData.ItemValue,
            RateTypeID: formData.RateID,
            DoctorReferal: formData.DoctorReferal,
            FromDate: moment(formData.FromDate).format("DD/MMM/YYYY"),
            ToDate: moment(formData.ToDate).format("DD/MMM/YYYY"),
            FromTime: formData.FromTime,
            ToTime: formData.ToTime,
            DepartmentID: handleDepartment(formData.DepartmentID),
            SampleStatus: status,
          })
        )
        .then((res) => {
          setScData(res?.data?.message);
          setLoad(true);
          setLoading(false);
          setToggleTable(true);
        })
        .catch((err) => setLoading(false));
      setErrors(generatedError);
    } else {
      setErrors(generatedError);
    }
  };

  const SearchInvestigationData = (LedgerTransactionID) => {
    const generatedError = validation();
    axios
      .post("/api/v1/SC/SearchInvestigation", {
        LedgerTransactionID: LedgerTransactionID,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data.map((ele) => {
          return {
            ...ele,
            isSelected: false,
          };
        });
        setSearchInvdata(val);
        setNewData(
          res?.data?.message.some((x) => x.Status == "1" || x.Status == "4")
        );
        setToggleTable(false);
        setLoad(true);
        setLoading(false);
      })
      .catch((err) => setLoading(false));
    setErrors(generatedError);
  };

  const handlePayload = (e) => {
    const { checked } = e.target;
    let flag = 1;
    for (let i = 0; i < searchInvdata.length; i++) {
      if (
        ["", null].includes(searchInvdata[i].SINNo) ||
        searchInvdata[i]?.SINNo?.length < 3
      ) {
        flag = 0;
      }
      break;
    }
    if (checked) {
      if (flag) {
        const data = searchInvdata.map((ele) => {
          return {
            ...ele,
            isSelected: true,
          };
        });
        setSearchInvdata(data);
        setPayload(data);
      } else {
        toast.error(
          t("Barcode is Required Field and Should Contain atleast 3 character")
        );
      }
    } else {
      const data = searchInvdata.map((ele) => {
        return {
          ...ele,
          isSelected: false,
        };
      });
      setSearchInvdata(data);
      setPayload([]);
    }
  };

  const handleCloseBarcodeModal = (
    value,
    LedgerTransactionID,
    barcodeLogic,
    sampletypeId
  ) => {
    checkDuplicateBarcode(value, LedgerTransactionID).then((res) => {
      console.log(res);
      if (res === " " || res === "") {
      } else {
        if (barcodeLogic === 3) {
          const data = searchInvdata.map((ele) => {
            return {
              ...ele,
              SINNo: "",
            };
          });
          setSearchInvdata(data);
          toast.error(res);
        }

        if (barcodeLogic === 4) {
          const data = searchInvdata.map((ele) => {
            if (ele?.SampleTypeID === sampletypeId) {
              return {
                ...ele,
                SINNo: "",
              };
            } else {
              return ele;
            }
          });
          setSearchInvdata(data);
          toast.error(res);
        }
      }
    });
  };

  const handleBarcode = (e, barcodeLogic, sampletypeId) => {
    const { value } = e.target;
    if (barcodeLogic === 3) {
      const data = searchInvdata.map((ele) => {
        return {
          ...ele,
          SINNo: value,
        };
      });
      setSearchInvdata(data);
    }
    if (barcodeLogic === 4) {
      let flag = true;
      for (let i = 0; i < searchInvdata.length; i++) {
        if (
          searchInvdata[i]?.SampleTypeID !== sampletypeId &&
          value !== "" &&
          value === searchInvdata[i]?.SINNo
        ) {
          flag = false;
          break;
        }
      }
      if (flag) {
        const data = searchInvdata.map((ele) => {
          if (ele?.SampleTypeID === sampletypeId) {
            return {
              ...ele,
              SINNo: value,
            };
          } else {
            return ele;
          }
        });
        setSearchInvdata(data);
      } else {
        toast.error(t("This BarCode is Already Given"));
      }
    }
  };

  const handleUploadCount = (name, value, secondName) => {
    let data = [...scdata];
    if (name === "UploadDocumentCount") {
      data[show?.index][name] = value;
      data[show?.index][secondName] = value === 0 ? 0 : 1;
      setScData(data);
    } else {
      data[show4?.index][name] = value;
      data[show4?.index][secondName] = value === 0 ? 0 : 1;
      setScData(data);
    }
  };

  const handleSearchByDropDown = (e) => {
    const { value } = e.target;
    TableData(value);
  };

  useEffect(() => {
    getAccessDataRate(setRateData, formData?.CentreID).then((res) => {
      setFormData({ ...formData, RateID: res[0]?.value });
    });
  }, [formData?.CentreID]);

  useEffect(() => {
    getAccessCentres();
    getDepartment();
    getPaymentModes("Identity", setIdentity);
  }, []);

  return (
    <>
      <div className="box box-success">
        {show4?.modal && (
          <MedicialModal
            show={show4.modal}
            handleClose={() => {
              setShow4({
                modal: false,
                data: "",
                index: -1,
              });
            }}
            MedicalId={show4?.data}
            handleUploadCount={handleUploadCount}
          />
        )}

        {show?.modal && (
          <UploadModal
            show={show?.modal}
            handleClose={() => {
              setShow({ modal: false, data: "", index: -1 });
            }}
            options={Identity}
            documentId={show?.data}
            pageName="Patient Registration"
            handleUploadCount={handleUploadCount}
          />
        )}
        <div className="box-header with-border">
          <h3 className="box-title">{t("Sample Collection")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-sm-2 ">
              <div className="d-flex" style={{ display: "flex" }}>
                <div style={{ width: "40%" }}>
                  <SelectBox
                    options={SearchBy}
                    className="input-sm"
                    formdata={formData.SelectTypes}
                    name="SelectTypes"
                    onChange={handleSelectChange}
                  />
                </div>
                <div style={{ width: "60%" }}>
                  {formData?.SelectTypes === "Mobile" ? (
                    <div style={{ width: "100%" }}>
                      <Input
                        className="select-input-box form-control input-sm"
                        type="number"
                        name="ItemValue"
                        max={10}
                        value={formData.ItemValue}
                        onChange={handleChange}
                        onInput={(e) => number(e, 10)}
                      />
                      {errors?.ItemValue && (
                        <div className="golbal-Error">{errors?.ItemValue}</div>
                      )}
                    </div>
                  ) : (
                    <div style={{ width: "100%" }}>
                      <Input
                        className="select-input-box form-control input-sm"
                        type="text"
                        name="ItemValue"
                        max={20}
                        value={formData.ItemValue}
                        onChange={handleChange}
                      />
                      {errors?.ItemValue && (
                        <div className="golbal-Error">{errors?.ItemValue}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-sm-2">
              <SelectBox
                options={CentreData}
                selectedValue={formData?.CentreID}
                name="CentreID"
                onChange={handleSelectChange}
              />
              <span
                className="text-danger field-validation-valid"
                data-valmsg-for="CentreID"
                data-valmsg-replace="true"
              ></span>
            </div>
            <div className="col-sm-2 ">
              <SelectBox
                options={RateData}
                formdata={formData.RateID}
                name="RateID"
                selectedValue={formData?.RateID}
                onChange={handleSelectChange}
              />
            </div>

            <div className="col-sm-2  ">
              <SelectBox
                options={[
                  { label: "All Department", value: "" },
                  ...DepartmentData,
                ]}
                selectedValue={formData.DepartmentID}
                name="DepartmentID"
                onChange={handleSelectChange}
              />
              <span
                className="text-danger field-validation-valid"
                data-valmsg-for="CentreID"
                data-valmsg-replace="true"
              ></span>
            </div>

            <div className="col-sm-2 ">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                type="text"
                name="DoctorName"
                value={formData.DoctorName}
                onChange={handleChange}
                onKeyDown={handleIndex}
                placeholder={t("Refer Doctor")}
                onBlur={(e) => {
                  autocompleteOnBlur(setDoctorSuggestion);
                  setTimeout(() => {
                    const data = doctorSuggestion.filter(
                      (ele) => ele?.Name === e.target.value
                    );
                    if (data.length === 0) {
                      setFormData({ ...formData, DoctorName: "" });
                    }
                  }, 500);
                }}
                autoComplete="off"
              />
              {dropFalse && doctorSuggestion.length > 0 && (
                <ul
                  className="suggestion-data"
                  style={{ top: "27px", width: "100%" }}
                >
                  {doctorSuggestion.map((data, index) => (
                    <li
                      onClick={() => handleListSearch(data, "DoctorName")}
                      className={`${index === indexMatch && "matchIndex"}`}
                      key={index}
                    >
                      {data?.Name}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="col-sm-2">
              <SelectBox
                options={SampleStatusSearch}
                className="input-sm"
                // value={formData.SelectTypes}
                name="SelectTypes"
                id="SampleStatusSearch"
                onChange={handleSearchByDropDown}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-sm-2 ">
              <div>
                <DatePicker
                  name="FromDate"
                  date={formData?.FromDate}
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
            <div className="col-sm-2 ">
              <div>
                <DatePicker
                  name="ToDate"
                  date={formData?.ToDate}
                  onChange={dateSelect}
                  onChangeTime={handleTime}
                  secondName="ToTime"
                  maxDate={new Date()}
                  minDate={new Date(formData.FromDate)}
                />

                {errors?.ToDate && (
                  <span className="golbal-Error">{errors?.ToDate}</span>
                )}
              </div>
            </div>
            <div className="col-sm-1">
              {loading ? (
                <Loading />
              ) : (
                <button
                  type="button"
                  className="btn btn-block btn-info btn-sm"
                  onClick={() =>
                    TableData(
                      document.getElementById("SampleStatusSearch").value
                    )
                  }
                >
                  {t("Search")}
                </button>
              )}
            </div>
          </div>

          <div className="row" style={{ display: "none" }}>
            <div className="col-sm-2">
              <a
                href="javascript:void(0)"
                onClick={() => TableData(1)}
                className="foreColor"
              >
                <div className="form-group Status-0 center round">
                  {" "}
                  {t("Search")}
                </div>
              </a>
            </div>
            <div className="col-sm-2 form-group col-xs-3 ">
              <a
                href="javascript:void(0)"
                onClick={() => TableData(1)}
                className="foreColor"
              >
                <div className="form-group Status-1 center round">
                  {t(" Not Collected")}
                </div>
              </a>
            </div>
            <div className="col-sm-2 form-group col-xs-3 ">
              <a
                href="javascript:void(0)"
                onClick={() => TableData(2)}
                className="foreColor"
              >
                <div className="form-group Status-2 center round">
                  {t("Collected")}
                </div>
              </a>
            </div>

            <div className="col-sm-2 form-group col-xs-3 ">
              <a
                href="javascript:void(0)"
                onClick={() => TableData(4)}
                className="foreColor"
              >
                <div className="form-group Status-4 center round">
                  {t("Rejected")}
                </div>
              </a>
            </div>

            <div className="col-sm-2 form-group col-xs-3">
              <a
                href="javascript:void(0)"
                onClick={() => TableData("")}
                className="foreColor"
              >
                <div className="form-group Status-all center round">
                  {t("All")}
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        load && (
          <div className="box mb-4">
            {/* <div className="card-header py-3">
              <span className="m-0 font-weight-bold text-primary">
                Search Results
              </span>
            </div> */}
            {toggleTable ? (
              <div
                className="box-body divResult boottable table-responsive"
                id="no-more-tables"
              >
                {scdata.length > 0 ? (
                  <table
                    className="table table-bordered table-hover table-striped tbRecord"
                    cellPadding="{0}"
                    cellSpacing="{0}"
                  >
                    <thead className="cf">
                      <tr>
                        <th>{t("S.No")}</th>
                        <th>{t("Sin No")}</th>
                        <th>{t("RegDate")}</th>
                        <th>{t("VisitNo")}</th>
                        <th>{t("UHID")}</th>
                        <th>{t("Name")} </th>
                        <th>{t("Age")}</th>
                        <th>{t("Document")}</th>
                        <th>{t("M.H")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {scdata?.map((data, index) => (
                        <tr key={index}>
                          <td data-title={t("S.No")}>
                            <div>
                              {index + 1}
                              {data?.isUrgent === 1 && (
                                <img src={urgentGIF}></img>
                              )}
                              {data?.VIP === 1 && <img src={VIP}></img>}
                            </div>
                            &nbsp;
                          </td>

                          <td data-title={t("Sin No")}>{data?.SinNo}&nbsp;</td>
                          <td data-title={t("Date")}>
                            {dateConfig(data.Date)}&nbsp;
                          </td>
                          <td
                            className={`color-Status-${data.Status} text-info`}
                            onClick={() =>
                              SearchInvestigationData(data.LedgerTransactionID)
                            }
                            data-title={t("Status")}
                            style={{ cursor: "pointer" }}
                          >
                            {data?.VisitNo}&nbsp;
                          </td>
                          <td data-title={t("PatientCode")}>
                            {data?.PatientCode}&nbsp;
                          </td>
                          <td data-title={t("PName")}>{data?.PName}&nbsp;</td>
                          <td data-title={t("Gender")}>
                            {data?.Age}/{data?.Gender}&nbsp;
                          </td>

                          <td data-title={t("UploadDocumentCount")}>
                            <div
                              className="text-info"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setShow({
                                  modal: true,
                                  data: data?.LedgertransactionIDHash,
                                  index: index,
                                });
                              }}
                            >
                              <i className="fa fa-cloud-upload">
                                ({data?.UploadDocumentCount})
                              </i>
                            </div>
                            &nbsp;
                          </td>
                          <td data-title={t("MedicalHistoryCount")}>
                            <div
                              className="text-info"
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setShow4({
                                  modal: true,
                                  data: data?.LedgertransactionIDHash,
                                  index: index,
                                });
                              }}
                            >
                              <i className="fa fa-history">
                                ({data?.MedicalHistoryCount})
                              </i>
                            </div>
                            &nbsp;
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <>{t("No Data Found")}</>
                )}
              </div>
            ) : (
              <div className="box mb-4">
                {searchInvdata.length > 0 ? (
                  <div
                    className="box-body divResult boottable table-responsive"
                    id="no-more-tables"
                  >
                    <table
                      className="table table-bordered table-hover table-striped tbRecord"
                      cellPadding="{0}"
                      cellSpacing="{0}"
                    >
                      <thead>
                        <tr>
                          <th>{t("S.No")}</th>
                          <th>{t("RegDate")}</th>
                          <th>{t("VisitNo")}</th>
                          <th>{t("PName")}</th>
                          <th>{t("Test")}</th>
                          <th>{t("Sin No")}</th>
                          <th>{t("Source")}</th>
                          <th>{t("SampleQty")}</th>
                          <th>{t("SampleTypeName")}</th>
                          <th>{t("Reject")}</th>
                          <th>
                            {handleCheckboxCondition(searchInvdata) && (
                              <Input
                                type="checkbox"
                                onChange={(e) => {
                                  setTimeout(handlePayload(e), 500);
                                }}
                                className="input-sm"
                                checked={
                                  searchInvdata.length > 0
                                    ? isChecked(
                                        "isSelected",
                                        searchInvdata,
                                        true
                                      ).includes(false)
                                      ? false
                                      : true
                                    : false
                                }
                              />
                            )}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {searchInvdata.map((data, index) => (
                          <tr key={index}>
                            <SamleCollectionTable
                              data={data}
                              index={index}
                              payload={payload}
                              setPayload={setPayload}
                              setSearchInvdata={setSearchInvdata}
                              searchInvdata={searchInvdata}
                              TableData={TableData}
                              handleBarcode={handleBarcode}
                              handleCloseBarcodeModal={handleCloseBarcodeModal}
                            />
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  t("No Data Found")
                )}
                <div className="box-footer">
                  <div
                    className="d-flex align-items-center justify-content-end float-right"
                    style={{ float: "right" }}
                  >
                    <button
                      className="btn btn-info btn-sm mx-2"
                      onClick={() => {
                        setToggleTable(true);
                      }}
                    >
                      {t("Main List")}
                    </button>
                    &nbsp;
                    {newdata && (
                      <button
                        className="btn btn-info btn-sm mx-2"
                        onClick={() => {
                          SaveSampleCollection();
                        }}
                      >
                        {t("Collect")}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      )}
    </>
  );
};

export default SampleCollection;
