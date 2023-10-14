import React, { useEffect, useMemo, useState } from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";
import moment from "moment";
import { RefundFilter, SearchBy } from "../../ChildComponents/Constants";
import axios from "axios";
import Input from "../../ChildComponents/Input";
import BootTable from "../../Table/BootTable";
import Loading from "../util/Loading";
import {
  autocompleteOnBlur,
  getAccessCentres,
  getAccessRateType,
  getDoctorSuggestion,
} from "../util/Commonservices";
import MedicialModal from "../util/MedicialModal";
import Pagination from "../util/Commonservices/Pagination";
import DatePicker from "./../Components/DatePicker";
import { dateConfig } from "./../util/DateConfig";
import { useTranslation } from "react-i18next";
import { number } from "../util/Commonservices/number";

let PageSize = 15;

const ReceiptReprint = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [CentreData, setCentreData] = useState([]);
  const [RateData, setRateData] = useState([]);
  const [receiptData, setReceiptData] = useState([]);
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

  const { t } = useTranslation();
  

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
    DoctorName: "",
  });

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return receiptData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, receiptData]);

  const validation = () => {
    let error = "";
    if (formData?.SelectTypes !== "" && formData?.ItemValue === "") {
      error = { ...error, ItemValue: "Please Choose Value" };
    }
    if (formData.SelectTypes === "Mobile") {
      if (formData?.SelectTypes !== "" && formData?.ItemValue === "") {
        error = { ...error, ItemValue: t("This Field is Required") };
      } else if (formData.ItemValue.length !== 10) {
        error = { ...error, ItemValue: t("Invalid Mobile Number") };
      }
    }
    // } else if (formData.SelectTypes !== "") {
    //   error = { ...error, ItemValue: "This Field is Required" };
    // }

    // if (formData.FromDate > moment(new Date()).format("YYYY-MM-DD")) {
    //   error = { ...error, FromDate: "Date is Invalid" };
    // }

    // if (formData.ToDate > moment(new Date()).format("YYYY-MM-DD")) {
    //   error = { ...error, ToDate: "Date is Invalid" };
    // }else if (
    //   moment(formData.ToDate).format("DD/MMM/YYYY") <
    //   moment(formData.FromDate).format("DD/MMM/YYYY")
    // ) {
      
    //   error = {
    //     ...error,
    //     ToDate: t("Date Must be Greater Then Or Equal to From Date"),
    //   };
    // }
    if (formData.FromDate === moment(new Date()).format("YYYY-MM-DD")) {
      if (formData.FromTime > moment(new Date()).format("HH:MM:SS")) {
        error = { ...error, FromTime: "Time is Invalid" };
      }
    }

    if (formData.ToDate === moment(new Date()).format("YYYY-MM-DD")) {
      if (formData.ToTime < formData.FromTime) {
        error = { ...error, ToTime: "Time Must be Less than From Time" };
      }
    }

    return error;
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

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "DoctorName") {
      setDropFalse(true);
    }
  };

  const dateSelect = (date, name) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const TableData = () => {
    const generatedError = validation();
    if (generatedError === "") {
      setLoading(true);
      axios
        .post("/api/v1/Lab/getReceiptReprint", {
          CentreID: formData.CentreID,
          SelectTypes: formData.SelectTypes,
          ItemValue: formData.ItemValue,
          RateTypeID: formData.RateID,
          DoctorReferal: formData.DoctorReferal,
          FromDate: moment(formData.FromDate).format("DD/MMM/YYYY"),
          ToDate: moment(formData.ToDate).format("DD/MMM/YYYY"),
          FromTime: formData.FromTime,
          ToTime: formData.ToTime,
        })
        .then((res) => {
          setReceiptData(res?.data?.message);
          setLoad(true);
          setLoading(false);
          setCurrentPage(1);
        })
        .catch((err) => setLoading(false));
      setErrors(generatedError);
    } else {
      setErrors(generatedError);
    }
  };

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

  const handleUploadCount = (name, value, secondName) => {
    let data = [...receiptData];
    data[show4?.index][name] = value;
    data[show4?.index][secondName] = value === 0 ? 0 : 1;
    setReceiptData(data);
  };
  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;

    setFormData({ ...formData, [secondName]: TimeStamp });
  };

  useEffect(() => {
    getAccessCentres(setCentreData);
    getAccessRateType(setRateData);
  }, []);

  useEffect(() => {
    getDoctorSuggestion(formData, setDoctorSuggestion, setFormData);
  }, [formData?.DoctorName]);

  useEffect(() => {}, [formData?.DoctorReferal]);

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
            // show={show4.modal}
            // handleClose={() => {
            //   setShow4({
            //     modal: false,
            //     data: "",
            //   });
            // }}
            // MedicalId={-1}
            // ID={show4?.data}
          />
        )}

        <div className="box-header with-border">
          <h3 className="box-title">{t("Receipt Reprint")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-sm-2">
              <div className="d-flex" style={{ display: "flex" }}>
                <div style={{ width: "40%" }}>
                  <SelectBox
                    options={SearchBy}
                    className="input-sm"
                    selectedValue={formData.SelectTypes}
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
                        on
                      />
                      {errors?.ItemValue && (
                        <div className="golbal-Error">{errors?.ItemValue}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="col-sm-3">
              <SelectBox
                options={[{ label: "All Centre", value: "" }, ...CentreData]}
                selectedValue={formData.CentreID}
                name="CentreID"
                onChange={handleSelectChange}
              />
              <span
                className="text-danger field-validation-valid"
                data-valmsg-for="CentreID"
                data-valmsg-replace="true"
              ></span>
            </div>
            <div className="col-sm-3">
              <SelectBox
                options={[{ label: "All Rate Type", value: "" }, ...RateData]}
                selectedValue={formData.RateID}
                name="RateID"
                onChange={handleSelectChange}
              />
            </div>

            <div className="col-sm-3">
              <input
                className="form-control select-input-box ui-autocomplete-input input-sm"
                type="text"
                name="DoctorName"
                value={formData.DoctorName}
                onChange={handleChange}
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
                onKeyDown={handleIndex}
                autoComplete="off"
              />
              {dropFalse && doctorSuggestion.length > 0 && (
                <ul className="suggestion-data">
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
          </div>
          <div className="row">
            <div className="col-sm-2">
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

            <div className="col-sm-2">
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

            <div className="col-sm-2">
              <SelectBox
                options={RefundFilter}
                formdata={formData.RefundFilter}
                name="RefundFilter"
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-sm-1">
              <input
                type="button"
                value={t("Search")}
                id="btnSearch"
                className="btn btn-block btn-info btn-sm input-sm"
                onClick={TableData}
              />
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        load && (
          <div className="box mb-4">
            <div
              className=" box-body divResult boottable table-responsive"
              id="no-more-tables"
            >
              <BootTable
                show={setShow4}
                receiptData={currentTableData}
                currentPage={currentPage}
                pageSize={PageSize}
              />
              <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={receiptData.length}
                pageSize={PageSize}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        )
      )}
    </>
  );
};

export default ReceiptReprint;
