import React, { useEffect, useState } from "react";
import {
  SelectBox,
  SelectBoxWithCheckbox,
} from "../../ChildComponents/SelectBox";
import { toast } from "react-toastify";
import axios from "axios";
import DatePicker from "../Components/DatePicker";
import { useLocation, useParams } from "react-router-dom";
import moment from "moment";
import Loading from "../util/Loading";
import { DateTypeSearch } from "../../ChildComponents/Constants";
import { getAccessDataRate } from "../util/Commonservices";

import {
  BindApprovalDoctorReports,
  BindEmployeeReports,
  getAccessCentresReports,
  getDepartmentReports,
} from "./ReportsApi";
import { useTranslation } from "react-i18next";

const DocumentType = [
  {
    label: "Select Document Type",
    value: "",
  },
  {
    label: "PDF",
    value: 2,
  },
  {
    label: "Excel",
    value: 1,
  },
];

function GetReport() {
  const { t } = useTranslation();
  const location = useLocation();
  const { id } = useParams();
  const [load, setLoad] = useState(true);
  const [CentreData, setCentreData] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [DoctorName, setDoctorAdmin] = useState([]);
  const [EmployeeName, setEmployeeName] = useState([]);
  const [rateType, setRateType] = useState([]);
  const [FieldShow, setFieldShow] = useState({});
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [formData, setFormData] = useState({
    Centre: "",
    FromDate: new Date(),
    FromTime: "00:00:00",
    ToDate: new Date(),
    ToTime: "",
    DocumentType: 2,
    // new
    User: "",
    RateType: "",
    Department: "",
    ReportType: "",
    Test: "",
    PatientType: "",
    Doctor: "",
    DateType: "",
    Urgent: "",
    Status: "",
  });

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const dateSelect = (date, name) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;

    setFormData({ ...formData, [secondName]: TimeStamp });
  };

  const getDepartmentReports = (state) => {
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
        state(DeptDataValue);
      })
      .catch((err) => console.log(err));
  };

  const bindApiResponseAccording = (data) => {
    const {
      Centre,
      User,
      RateType,
      Department,
      ReportType,
      Test,
      PatientType,
      Doctor,
      DateType,
      Urgent,
      Status,
      MultipleCentre,
      MultipleRateType,
      MultipleDepartment,
      MultipleUser,
      MultipleReportType,
      MultipleDoctor,
      MultipleStatus,
      MultiplePatientType,
      MultipleDateType,
      MultipleTest,
    } = data;
    if (Centre || MultipleCentre) {
      getAccessCentresReports(setCentreData);
    }
    if (Department || MultipleDepartment) {
      getDepartmentReports(setDepartment);
    }
    if (User || MultipleUser) {
      BindEmployeeReports(setEmployeeName);
    }

    if (Doctor || MultipleDoctor) {
      BindApprovalDoctorReports(setDoctorAdmin);
    }
    if (RateType || MultipleRateType) {
      getAccessDataRate(setRateType, formData?.Centre).then((res) => {
        console.log(res);
      });
    }
  };

  const getPatientInfoReport = () => {
    setLoadingSearch(true);
    axios
      .post(
        `/reports/v1/commonReports/${id}`,
        {
          ...formData,
          ToDate: moment(formData?.ToDate).format("DD-MMM-YYYY"),
          FromDate: moment(formData?.FromDate).format("DD-MMM-YYYY"),
          DocumentType: Number(formData?.DocumentType),
        },
        formData?.DocumentType == 1 && { method: "GET", responseType: "blob" }
      )
      .then((res) => {
        setLoadingSearch(false);

        if (formData?.DocumentType == 1) {
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", `${id}.xlsx`);
          document.body.appendChild(link);
          link.click();
        }
        if (formData?.DocumentType == 2) {
          window.open(res?.data?.Url, "_blank");
        }
      })
      .catch((err) => {
        setLoadingSearch(false);
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
      });
  };

  const getPatientInfoField = (id) => {
    setLoad(true);
    axios
      .get(`/reports/v1/commonReports/getFields/${id}`)
      .then((res) => {
        setLoad(false);
        bindApiResponseAccording(res?.data?.message);
        setFieldShow(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const handleSelectMultiChange = (select, name) => {
    const val = select?.map((ele) => ele?.value);
    setFormData({ ...formData, [name]: val });
  };

  //console.log(formData);

  useEffect(() => {
    setFormData({
      Centre: "",
      FromDate: new Date(),
      FromTime: "00:00:00",
      ToDate: new Date(),
      ToTime: "",
      DocumentType: 2,

      User: "",
      RateType: "",
      Department: "",
      ReportType: "",
      Test: "",
      PatientType: "",
      Doctor: "",
      DateType: "",
      Urgent: "",
      Status: "",
    });
    getPatientInfoField(id);
  }, [location?.pathname]);

  return (
    <>
      {load ? (
        <Loading />
      ) : (
        <div className="box box-success">
          <div className="box-header with-border">
            <h3 className="box-title">{t("Get Reports")}</h3>
          </div>
          <div className="box-body">
            <div className="row">
              {FieldShow?.Centre && (
                <div className="col-sm-2">
                  <label>
                    <small>{t("Select Centre")}</small>
                  </label>
                  <SelectBox
                    options={[
                      { label: "Select Center", value: "" },
                      ...CentreData,
                    ]}
                    selectedValue={formData?.Centre}
                    name="Centre"
                    onChange={handleSelectChange}
                  />
                </div>
              )}

              {FieldShow?.MultipleCentre && (
                <div className="col-sm-2">
                  <label>
                    <small>{t("Select Centre")}</small>
                  </label>
                  <SelectBoxWithCheckbox
                    options={CentreData}
                    value={formData?.Centre}
                    name="Centre"
                    onChange={handleSelectMultiChange}
                  />
                </div>
              )}

              {FieldShow?.RateType && (
                <div className="col-sm-2">
                  <label>
                    <small>{t("Select Rate")}</small>
                  </label>
                  <SelectBox
                    options={[
                      { label: "Select Rate Type", value: "" },
                      ...rateType,
                    ]}
                    selectedValue={formData?.RateType}
                    name="RateType"
                    onChange={handleSelectChange}
                  />
                </div>
              )}

              {FieldShow?.MultipleRateType && (
                <div className="col-sm-2">
                  <label>
                    <small>{t("Select Rate")}</small>
                  </label>
                  <SelectBoxWithCheckbox
                    options={rateType}
                    value={formData?.RateType}
                    name="RateType"
                    onChange={handleSelectMultiChange}
                  />
                </div>
              )}

              {FieldShow?.Department && (
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("Select Department")}</small>
                  </label>
                  <SelectBox
                    options={[
                      { label: "Select Department", value: "" },
                      ...Department,
                    ]}
                    selectedValue={formData.Department}
                    name="Department"
                    onChange={handleSelectChange}
                  />
                </div>
              )}

              {FieldShow?.MultipleDepartment && (
                <div className="col-sm-2">
                  <label>
                    <small>{t("Select Department")}</small>
                  </label>
                  <SelectBoxWithCheckbox
                    options={Department}
                    value={formData?.Department}
                    name="Department"
                    onChange={handleSelectMultiChange}
                  />
                </div>
              )}

              {FieldShow?.FromDate && (
                <div className="col-sm-2">
                  <label>
                    <small>{t("FromDate")}:</small>
                  </label>
                  <DatePicker
                    name="FromDate"
                    date={formData?.FromDate}
                    onChange={dateSelect}
                    onChangeTime={handleTime}
                    secondName={FieldShow?.FromTime && "FromTime"}
                    maxDate={new Date()}
                  />
                </div>
              )}

              {FieldShow?.ToDate && (
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("ToDate")}:</small>
                  </label>
                  <DatePicker
                    name="ToDate"
                    date={formData?.ToDate}
                    onChange={dateSelect}
                    onChangeTime={handleTime}
                    secondName={FieldShow?.ToTime && "ToTime"}
                    maxDate={new Date()}
                    minDate={new Date(formData.FromDate)}
                  />
                </div>
              )}

              {FieldShow?.DataType && (
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("select DateType")}</small>
                  </label>
                  <SelectBox
                    options={[
                      { label: "DateType", value: "" },
                      ...DateTypeSearch,
                    ]}
                    formdata={formData?.DateType}
                    name="DateType"
                    onChange={handleSelectChange}
                  />
                </div>
              )}

              {FieldShow?.User && (
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("Select Employee")}</small>
                  </label>
                  <SelectBox
                    options={[
                      { label: "Select Employee", value: "" },
                      ...EmployeeName,
                    ]}
                    formdata={formData?.User}
                    name="User"
                    onChange={handleSelectChange}
                  />
                </div>
              )}

              {FieldShow?.MultipleUser && (
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("Select Employee")}</small>
                  </label>
                  <SelectBoxWithCheckbox
                    options={EmployeeName}
                    value={formData?.User}
                    name="User"
                    onChange={handleSelectMultiChange}
                  />
                </div>
              )}

              {FieldShow?.Doctor && (
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("Select Doctor")}</small>
                  </label>
                  <SelectBox
                    options={[
                      { label: "Select Doctor", value: "" },
                      ...DoctorName,
                    ]}
                    formdata={formData?.Doctor}
                    name="Doctor"
                    onChange={handleSelectChange}
                  />
                </div>
              )}

              {FieldShow?.MultipleDoctor && (
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("Select Doctor")}</small>
                  </label>
                  <SelectBoxWithCheckbox
                    options={DoctorName}
                    value={formData?.Doctor}
                    name="Doctor"
                    onChange={handleSelectMultiChange}
                  />
                </div>
              )}

              
              <div className="col-sm-2 ">
                <label>
                  <small>{t("Select DocumentType")}</small>
                </label>
                <SelectBox
                  options={DocumentType}
                  selectedValue={formData.DocumentType}
                  name="DocumentType"
                  onChange={handleSelectChange}
                />
              </div>

              <div className="col-sm-2">
                <label></label>
                {loadingSearch ? (
                  <Loading />
                ) : (
                  <button
                    className="btn-block btn btn-success btn-sm "
                    onClick={getPatientInfoReport}
                  >
                    {t("Get Report")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GetReport;
