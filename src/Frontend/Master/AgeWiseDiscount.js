import React, { useState, useEffect } from "react";
import { SimpleCheckbox } from "../../ChildComponents/CheckBox";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { validationForAgeWise } from "../../ChildComponents/validations";
import { number } from "../../Frontend/util/Commonservices/number";
import {
  getTrimmedData,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import Input from "../../ChildComponents/Input";
import loading from "../../Frontend/util/Loading";
import CustomDate from "../../ChildComponents/CustomDate";
import DatePicker from "../../Frontend/Components/DatePicker";
import Loading from "../../Frontend/util/Loading";
import { useTranslation } from "react-i18next";

const AgeWiseDiscount = () => {
  const [errors, setErrors] = useState({});
  const [Gender, setGender] = useState([]);
  const [load, setLoad] = useState(false);
  const [err, setErr] = useState({});
  const [DiscountShareType, setDiscountShareType] = useState([]);

  const location = useLocation();
  const { state } = location;
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    DiscountType: state?.data?.DiscountType ? state?.data?.DiscountType : "",
    DiscountPer: state?.data?.DiscountPer ? state?.data?.DiscountPer : "",
    FromValidityDate: state?.data?.FromValidityDate
      ? new Date(state?.data?.FromValidityDate)
      : new Date(),
    ToValidityDate: state?.data?.ToValidityDate
      ? new Date(state?.data?.ToValidityDate)
      : new Date(),
    Gender: state?.data?.Gender ? state?.data?.Gender : "Both",
    DiscountShareType: state?.data?.DiscountShareType
      ? state?.data?.DiscountShareType
      : "Client Share",
    ApplicableForAll: state?.data?.ApplicableForAll
      ? state?.data?.ApplicableForAll
      : "1",
    IsCouponRequired: state?.data?.IsCouponRequired
      ? state?.data?.IsCouponRequired
      : "",
    RateTypeId: "0",
    DiscountId: state?.data?.DiscountId ? state?.data?.DiscountId : "",
    ID: state?.data?.Id ? state?.data?.Id : "",
    isActive: state?.data?.isActiveStatus ? state?.data?.isActive : 1,
    FromAge: state?.data?.FromAge ? state?.data?.FromAge : "",
    ToAge: state?.data?.ToAge ? state?.data?.ToAge : "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value, ItemValue: "" });
    // setErrors({});
  };

  const navigate = useNavigate();

  const getDropDownData = (name) => {
    axios
      .post("/api/v1/Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });

        switch (name) {
          case "Gender":
            setGender(value);
            break;
          case "DiscountShareType":
            setDiscountShareType(value);
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  const Api = () => {
    let generatedError = validationForAgeWise(formData);

    if (generatedError === "") {
      setLoad(true);
      axios
        .post(
          state?.url
            ? state?.url
            : "/api/v1/AgeWiseDiscount/InsertAgeWiseDiscountData",
          getTrimmedData({
            ...formData,
            IsCouponRequired: formData?.IsCouponRequired ? 1 : 0,
            isActive: formData?.isActive ? 1 : 0,
            ApplicableForAll: formData?.ApplicableForAll ? 1 : 0,
          })
        )
        .then((res) => {
          if (res.data.message) {
            setLoad(false);
            navigate("/AgeWiseDiscountList");
            toast.success(res.data.message);
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
      setErr(generatedError);
    }
  };

  const dateSelect = (date, name) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  useEffect(() => {
    getDropDownData("Gender");
    getDropDownData("DiscountShareType");
  }, []);

  // const handleTime = (time, secondName) => {
  //   let TimeStamp = "";
  //   TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;

  //   setFormData({ ...formData, [secondName]: TimeStamp });
  // };

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("AgeWiseDiscount")}</h3>
        </div>

        <div className="box-body">
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
            {t("Discount Type:")}
              
            </label>
            <div className="col-sm-2 ">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                max={20}
                name="DiscountType"
                type="text"
                id="DiscountType"
                value={formData.DiscountType}
                onChange={handleChange}
                placeholder={t("Discount Type:")}
              />
              {
                <div className="field-validation-valid text-danger">
                  {err?.DiscountType}
                </div>
              }
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
            {t("Discount Per.(%)")}
              
            </label>
            <div className="col-sm-2 ">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                name="DiscountPer"
                type="number"
                value={formData.DiscountPer}
                onChange={handleChange}
                onInput={(e) => number(e, 3, 100)}
                placeholder={t("Discount Per.(%)")}
              />
              {
                <div className="field-validation-valid text-danger">
                  {err?.DiscountPer}
                </div>
              }
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
            {t("From Validity Date")}
              
            </label>
            <div className="col-sm-2 ">
              <div>
                <DatePicker
                  type="date"
                  name="FromDate"
                  date={formData?.FromDate}
                  onChange={dateSelect}
                  // onChangeTime={handleTime}
                  // secondName="FromTime"
                  maxDate={new Date()}
                />
                {errors?.FromDate && (
                  <span className="golbal-Error">{errors?.FromDate}</span>
                )}
              </div>
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
            {t("To Validity Date:")}
              
            </label>
            <div className="col-sm-2 ">
              <div>
                <DatePicker
                  name="ToDate"
                  date={formData?.ToDate}
                  onChange={dateSelect}
                  // onChangeTime={handleTime}
                  // secondName="ToTime"

                  minDate={new Date(formData.FromDate)}
                />

                {errors?.ToDate && (
                  <span className="golbal-Error">{errors?.ToDate}</span>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
            {t("From Age (In Years):")}
             
            </label>
            <div className="col-sm-2 ">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                id="FromAge"
                onInput={(e) => number(e, 3)}
                name="FromAge"
                value={formData?.FromAge}
                type="number"
                onChange={handleChange}
                placeholder={t("From Age (In Years):")}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
            {t("To Age (In Years):")}             
            </label>
            <div className="col-sm-2 ">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                onInput={(e) => number(e, 3)}
                name="ToAge"
                value={formData?.ToAge}
                type="number"
                onChange={handleChange}
                placeholder={t("To Age (In Years):")}
              />
              {
                <div className="field-validation-valid text-danger">
                  {err?.ToAge}
                </div>
              }
            </div>

            <div className="row">
              <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Gender")}
               
              </label>
              <div className="col-sm-2">
                <SelectBox
                  options={Gender}
                  selectedValue={formData?.Gender}
                  onChange={handleSelectChange}
                  name="Gender"
                />
                {formData.Gender === "" && (
                  <div className="field-validation-valid text-danger">
                    {err?.Gender}
                  </div>
                )}
              </div>
              <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Dis.Share Type")}
                
              </label>
              <div className="col-sm-2">
                <SelectBox
                  options={DiscountShareType}
                  // selectedValue={selectedValueCheck(
                  //   DiscountShareType,
                  //   formData?.DiscountShareType
                  // )}
                  selectedValue={formData?.DiscountShareType}
                  onChange={handleSelectChange}
                  name="DiscountShareType"
                />
                {formData.DiscountShareType === "" && (
                  <div className="field-validation-valid text-danger">
                    {err?.DiscountShareType}
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-sm-2">
                <SimpleCheckbox
                  type="checkbox"
                  name="ApplicableForAll"
                  checked={formData?.ApplicableForAll}
                  onChange={handleChange}
                />
                <label className="control-label" htmlFor="ApplicableForAll">
                {t("Applicable For All")}
                  
                </label>
              </div>
              <div className="col-sm-2">
                <SimpleCheckbox
                  type="checkbox"
                  name="IsCouponRequired"
                  checked={formData?.IsCouponRequired}
                  onChange={handleChange}
                />
                <label className="control-label" htmlFor="IsCouponRequired">
                {t("Is Coupon Required")}                  
                </label>
              </div>
              <div className="col-sm-1">
                <SimpleCheckbox
                  name="isActive"
                  type="checkbox"
                  checked={formData?.isActive}
                  onChange={handleChange}
                />
                <label className="control-label" htmlFor="ApplicableForAll">
                  {t("Active")}
                </label>
              </div>
              <div className="col-sm-1">
                {load ? (
                  <Loading />
                ) : (
                  <button
                    type="submit"
                    id="btnSave"
                    className="btn btn-block btn-success btn-sm "
                    title="Create"
                    onClick={Api}
                  >
                    {state?.other?.button ? state?.other?.button : t("Save")}
                  </button>
                )}
              </div>

              <div className="col-sm-2 pl-15">
                <Link to="/AgeWiseDiscountList" style={{ fontSize: "13px" }}>
                {t("Back to List")}
                  
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AgeWiseDiscount;