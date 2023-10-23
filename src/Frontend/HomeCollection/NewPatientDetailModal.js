import React from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { toast } from "react-toastify";
import axios from "axios";
import { useState, useEffect } from "react";
import { number } from "../util/Commonservices/number";
import moment from "moment";
import DatePicker from "../Components/DatePicker";
import { HCNewPatientForm } from "../../ChildComponents/Constants";
import {
  NewPatientModalValidationSchema,
  PreventSpecialCharacterandNumber,
} from "../../ChildComponents/validations";
import { getTrimmedData } from "../util/Commonservices";
import Input from "../../ChildComponents/Input";
import { useRef } from "react";

const NewPatientDetailModal = ({ show, handleClose, mobile }) => {
  const [RadioDefaultSelect, setRadioDefaultSelect] = useState("Age");
  const [formData, setFormData] = useState(HCNewPatientForm);
  const [DateData, setDateData] = useState({
    AgeYear: "",
    AgeMonth: "",
    AgeMonth: "",
  });

  const [errors, setErros] = useState({});
  const [gender, setGender] = useState([]);
  const [title, setTitle] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCity] = useState([]);
  const [locality, setLocality] = useState([]);
  const [country, setCountry] = useState([]);
  const { t } = useTranslation();
  const initialRender = useRef(true);

  console.log(formData);
  const handleSave = () => {
    const generatedError = NewPatientModalValidationSchema(formData);
    console.log(formData);
    const updatedFormData = {
      ...formData,
      AgeDays: ageCount(formData.AgeYear, formData.AgeMonth, formData.AgeDays),
      Age: `${formData.AgeYear == "" ? 0 : formData.AgeYear} Y ${
        formData.AgeMonth == "" ? 0 : formData.AgeMonth
      } M ${ageCount(
        formData.AgeYear,
        formData.AgeMonth,
        formData.AgeDays
      )} D `,

      AgeMonth: formData.AgeMonth == "" ? 0 : formData.AgeMonth,
      AgeYear: formData.AgeYear == "" ? 0 : formData.AgeYear,
    };
    console.log(generatedError);
    if (generatedError === "") {
      axios
        .post(
          "/api/v1/CustomerCare/SaveNewPatient",
          getTrimmedData({
            NewPatientData: updatedFormData,
          })
        )
        .then((res) => {
          console.log(formData);
          toast.success(res?.data?.message);
          setFormData(HCNewPatientForm);
          setCity([]);
          setLocality([]);
          setErros({});
          handleClose();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          handleClose();
        });
    } else {
      setErros(generatedError);
    }
  };
  const ageCount = (y, m, d) => {
    if (y == 0 && m == 0 && d == 0) {
      return 1;
    } else {
      return d;
    }
  };
  // console.log(formData);

  // const getId = (names, value) => {
  //   const data = names.find((ele) => value === ele?.value);
  //   return data.ID;
  // };

  const handleSelectChange = (event) => {
    const { name, value } = event?.target;

    if (name === "StateID") {
      getCityDropDown(value);
      setFormData({
        ...formData,
        [name]: value,
        CityID: "",
        LocalityID: "",
        Pincode: "",
      });
    }

    if (name === "CityID") {
      getLocalityDropDown(value);
      setFormData({ ...formData, [name]: value, LocalityID: "", Pincode: "" });
    }

    if (name === "LocalityID") {
      getPinCode(value, name);
      setFormData({ ...formData, [name]: value, Pincode: "" });
    }

    if (name === "Pincode") {
      return;
    }

    if (
      name === "Mobile" ||
      name === "Title" ||
      name === "AgeWise" ||
      name === "HouseNo" ||
      name === "Gender" ||
      name === "CountryID" ||
      name === "Pincode" ||
      name === "Email" ||
      name === "Landmark"
    )
      setFormData({ ...formData, [name]: value });

    // if (name === "AgeYear" || name === "AgeMonth" || name === "AgeDays") {
    //   if (value) handleDOBCalculation(name, value);
    //   else {
    //     setFormData({
    //       ...formData,
    //       DOB: "",
    //     });
    //   }
    // }

    if (name === "PName") {
      setFormData({
        ...formData,
        [name]: PreventSpecialCharacterandNumber(value)
          ? value
          : formData[name],
      });
    }
  };

  const getSubtractType = (name) => {
    return name === "AgeYear"
      ? "years"
      : name === "AgeMonth"
      ? "months"
      : "days";
  };
  // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    if (!initialRender.current) {
      if (
        formData?.AgeDays == "" &&
        formData?.AgeMonth == "" &&
        formData?.AgeYear == ""
      )
        setFormData({
          ...formData,
          DOB: "",
        });
    } else {
      initialRender.current = false;
    }
  }, [formData?.AgeMonth, formData?.AgeDays, formData?.AgeYear]);

  const handleDOBCalculation = (e) => {
    const { name, value } = e.target;

    let diff = {};
    let subtractType = getSubtractType(name);

    if (name === "AgeYear") {
      diff = moment().subtract(value, subtractType);
      setDateData({
        ...DateData,
        AgeYear: diff?._d,
      });
    }

    if (name === "AgeMonth") {
      diff = moment(DateData?.AgeYear || new Date().now).subtract(
        value,
        subtractType
      );
      setDateData({
        ...DateData,
        AgeMonth: diff?._d,
      });
    }

    if (name === "AgeDays") {
      diff = moment(DateData?.AgeMonth || new Date().now).subtract(
        value,
        subtractType
      );
      setDateData({
        ...DateData,
        AgeDays: diff?._d,
      });
    }

    var Newdiff = moment(moment(), "milliseconds").diff(
      moment(diff?._d).format("YYYY-MM-DD")
    );

    var duration = moment.duration(Newdiff);

    setFormData({
      ...formData,
      [name]: value,
      DOB: diff?._d,
      TotalAgeInDays: moment(moment().format("YYYY-MM-DD")).diff(
        diff?._d,
        "days"
      ),
      Age: `${duration?._data?.years} Y ${duration._data?.months} M ${duration?._data?.days} D`,
    });
  };
  const handleDateFunction = (value) => {
    const { year, month, days } = value;
    const yearDiff = moment().subtract(year, "years")?._d;
    const monthDiff = moment(yearDiff).subtract(month, "months")?._d;
    const daysDiff = moment(monthDiff).subtract(days, days)?._d;

    return {
      AgeYear: yearDiff,
      AgeMonth: monthDiff,
      AgeDays: daysDiff,
    };
  };
  const calculateDOB = (value) => {
    var TodayDate = moment(new Date().now).format("YYYY,MM,DD");
    var DOBDate = moment(value).format("YYYY,MM,DD");
    var a = moment(TodayDate);
    var b = moment(DOBDate);
    var years = a.diff(b, "year");
    b.add(years, "years");
    var months = a.diff(b, "months");
    b.add(months, "months");
    var days = a.diff(b, "days");
    return { years, months, days };
  };

  const calculateTotalNumberOfDays = (value) => {
    return moment(moment().format("YYYY-MM-DD")).diff(value, "days");
  };

  const dateSelect = (value, name) => {
    const { years, months, days } = calculateDOB(value);
    setFormData({
      ...formData,
      [name]: value,
      AgeYear: years,
      AgeMonth: months,
      AgeDays: days,
      TotalAgeInDays: calculateTotalNumberOfDays(value),
      Age: `${years} Y ${months} M ${days} D`,
    });
    const dateForFields = handleDateFunction({
      year: years,
      month: months,
      days: days,
    });
    setDateData({
      AgeYear: dateForFields?.AgeYear,
      AgeMonth: dateForFields?.AgeMonth,
      AgeDays: dateForFields?.AgeDays,
    });
  };
  const findGender = () => {
    const male = ["Mr.", "Baba", "Dr.(Mrs)"];
    const female = ["Miss.", "Mrs.", "Baby", "Dr.(Miss)"];

    if (male.includes(formData?.Title)) {
      setFormData({ ...formData, Gender: "Male" });
    }

    if (female.includes(formData?.Title)) {
      setFormData({ ...formData, Gender: "Female" });
    }
  };

  const handleSplitData = (id) => {
    const data = id?.split("#")[0];
    return data;
  };

  const getPinCode = (value, name) => {
    axios
      .post("/api/v1/CustomerCare/BindPinCode", {
        LocalityID: value,
      })
      .then((res) => {
        const data = res?.data?.message;
        setFormData({
          ...formData,
          Pincode: data[0].pincode,
          [name]: value,
        });
      })
      .catch((err) => {
        toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong");
      });
  };

  const getLocalityDropDown = (value) => {
    axios
      .post("/api/v1/CustomerCare/BindLocality", {
        cityid: value,
      })
      .then((res) => {
        const data = res?.data?.message;
        const localities = data?.map((ele) => {
          return {
            // ID: ele?.id,
            value: ele?.id,
            label: ele?.NAME,
          };
        });

        setLocality(localities);
      })
      .catch((err) => {
        toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong");
      });
  };

  const getCityDropDown = (value) => {
    axios
      .post("/api/v1/CommonHC/GetCityData", {
        StateId: value,
      })
      .then((res) => {
        const data = res?.data?.message;
        const cities = data?.map((ele) => {
          return {
            // ID: handleSplitData(ele?.ID),

            value: handleSplitData(ele?.ID),
            label: ele?.City,
          };
        });

        setCity(cities);
      })
      .catch((err) => {
        toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong");
      });
  };

  const getStateDropDown = () => {
    axios
      .post("/api/v1/CommonHC/GetStateData", {
        BusinessZoneID: 0,
      })
      .then((res) => {
        const data = res?.data?.message;
        const States = data?.map((ele) => {
          return {
            // ID: ele?.ID,
            value: ele?.ID,
            label: ele?.State,
          };
        });
        States?.unshift({ label: t("Select State"), value: "" });
        setStates(States);
      })
      .catch((err) => {
        toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong");
      });
  };

  useEffect(() => {
    findGender();
  }, [formData?.Title]);

  const setMobile = () => {
    setFormData({ ...formData, Mobile: mobile });
  };

  const getCountryDropDown = () => {
    axios
      .get("/api/v1/CommonHC/GetCountryData")
      .then((res) => {
        const data = res?.data?.message;
        const Country = data.map((ele) => {
          return {
            value: ele?.CountryID,
            IsBaseCurrency: ele?.IsBaseCurrency,
            label: ele?.CountryName,
          };
        });
        // Country?.unshift({ label: t("India"), value: 1 });
        setCountry(Country);
      })
      .catch((err) => {
        toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong");
      });
  };
  useEffect(() => {
    setMobile();
    getCountryDropDown();
    getStateDropDown();
    getDropDownData("Gender");
    getDropDownData("Title");
  }, []);

  const getDropDownData = (name) => {
    const match = ["Title", "Gender"];
    axios
      .post("/api/v1/Global/getGlobalData", { Type: name })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: match.includes(name) ? ele.FieldDisplay : ele.FieldID,
            label: ele.FieldDisplay,
          };
        });
        !["Title"].includes(name) &&
          value.unshift({ label: `Select ${name} `, value: "" });

        switch (name) {
          case "Gender":
            setGender(value);
            break;
          case "Title":
            setTitle(value);
            break;

          default:
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <Modal
        show={show}
        size="lg"
        centered
        className="form-horizontal"
        id="ModalSizeHC"
      >
        <Modal.Header
          className="modal-header"
          style={{ position: "sticky", zIndex: 1055, top: 0 }}
        >
          <Modal.Title className="modal-title">
            {t("New Patient Details")}
          </Modal.Title>
          <button type="button" className="close" onClick={handleClose}>
            ×
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="box">
            <div className="box-body">
              <div className="row">
                <label className="col-sm-1" htmlFor="Mobile No">
                  {t("MobileNo")}:
                </label>
                <div className="col-sm-2">
                  <Input
                    className="select-input-box form-control input-sm "
                    type="text"
                    disabled={true}
                    name="Mobile"
                    value={mobile}
                  />
                </div>

                <label className="  col-sm-2" htmlFor="Patient Id">
                  {t("Patient Id")} :
                </label>
              </div>
              <div className="row">
                <label className="  col-sm-1" htmlFor="Patient Name">
                  {t("Name")} :
                </label>
                <div className="col-sm-2 ">
                  <div className="d-flex">
                    <div style={{ width: "50%", height: "10px" }}>
                      <SelectBox
                        name="Title"
                        options={title}
                        selectedValue={formData?.Title}
                        onChange={handleSelectChange}
                      />
                    </div>

                    <div style={{ width: "50%" }}>
                      <Input
                        className="select-input-box form-control input-sm "
                        name="PName"
                        type="text"
                        max={30}
                        value={formData.PName}
                        autoComplete="off"
                        onChange={handleSelectChange}
                      />
                      {formData?.PName.trim() === "" && (
                        <span className="golbal-Error">{errors?.PName}</span>
                      )}
                      {formData?.PName.trim().length > 0 &&
                        formData?.PName.trim().length < 3 && (
                          <span className="golbal-Error">{errors?.PNames}</span>
                        )}
                    </div>
                  </div>
                </div>
                <label className="col-sm-1">
                  Age : &nbsp;
                  <input
                    type="radio"
                    name="AgeWise"
                    value={"Age"}
                    checked={RadioDefaultSelect === "Age" ? true : false}
                    onChange={(e) => {
                      setRadioDefaultSelect(e.target.value);
                    }}
                  />
                </label>
                <div className=" col-sm-2">
                  <div className="input-group-append d-flex">
                    <Input
                      className="select-input-box form-control input-sm "
                      name="AgeYear"
                      type="number"
                      style={{ width: "10%" }}
                      value={formData?.AgeYear}
                      onInput={(e) => number(e, 3, 120)}
                      disabled={RadioDefaultSelect === "DOB" ? true : false}
                      onChange={handleDOBCalculation}
                    />
                    <span
                      className="input-group-text select-input-box form-control input-sm justify-content-center"
                      style={{ width: "20px" }}
                    >
                      {t("Y")}
                    </span>
                    <Input
                      className="select-input-box form-control input-sm "
                      name="AgeMonth"
                      type="number"
                      // placeholder="M"
                      onInput={(e) => number(e, 2, 12)}
                      disabled={
                        RadioDefaultSelect === "DOB"
                          ? true
                          : formData?.AgeYear
                          ? false
                          : true
                      }
                      value={formData?.AgeMonth}
                      onChange={handleDOBCalculation}
                    />
                    <span
                      className="input-group-text form-control pull-right reprint-date input-sm justify-content-center"
                      style={{ width: "20px" }}
                    >
                      {t("M")}
                    </span>
                    <Input
                      className="select-input-box form-control input-sm"
                      name="AgeDays"
                      type="number"
                      // placeholder="D"
                      onInput={(e) => number(e, 2, 31)}
                      disabled={
                        RadioDefaultSelect === "DOB"
                          ? true
                          : formData?.AgeMonth
                          ? false
                          : true
                      }
                      value={formData.AgeDays}
                      onChange={handleDOBCalculation}
                    />
                    <span
                      className="input-group-text form-control pull-right reprint-date input-sm justify-content-center"
                      style={{ width: "20px" }}
                    >
                      {t("D")}
                    </span>
                  </div>
                </div>
                <label className="col-sm-1 ">
                  D.O.B :
                  <input
                    type="radio"
                    value={"DOB"}
                    onChange={(e) => {
                      setRadioDefaultSelect(e.target.value);
                    }}
                    name="AgeWise"
                    checked={RadioDefaultSelect === "DOB" ? true : false}
                  />
                </label>
                <div className="col-sm-2 ">
                  <DatePicker
                    name="DOB"
                    date={formData?.DOB}
                    className="select-input-box form-control input-sm "
                    onChange={dateSelect}
                    maxDate={new Date()}
                    disabled={RadioDefaultSelect === "Age" ? true : false}
                  ></DatePicker>

                  {formData?.DOB === "" && (
                    <span className="golbal-Error">{errors?.DOB}</span>
                  )}
                </div>
                <label className="col-sm-1">Gender:</label>
                <div className="col-sm-2 ">
                  <SelectBox
                    name="Gender"
                    options={gender}
                    selectedValue={formData?.Gender}
                    isDisabled={formData?.Title ? true : false}
                    onChange={handleSelectChange}
                  />
                </div>
              </div>
              <div className="row">
                <label className="  col-sm-1" htmlFor="Country">
                  {t("Country")} :
                </label>
                <div className="col-sm-2 ">
                  <SelectBox
                    name="CountryID"
                    options={country}
                    selectedValue={formData.CountryID}
                    onChange={handleSelectChange}
                  />
                </div>
                <label className="  col-sm-1" htmlFor="House No.">
                  {t("H No.")} :
                </label>
                <div className="col-sm-2 ">
                  <Input
                    className="select-input-box form-control input-sm"
                    name="HouseNo"
                    type="text"
                    max={20}
                    autoComplete="off"
                    placeholder="House No."
                    value={formData.HouseNo}
                    onChange={handleSelectChange}
                  />
                  {formData?.HouseNo.trim().length > 0 &&
                    formData?.HouseNo.trim().length < 3 && (
                      <span className="golbal-Error">{errors?.HouseNo}</span>
                    )}
                </div>
                <label className="  col-sm-1" htmlFor="State">
                  {t("State")} :
                </label>
                <div className="col-sm-2 ">
                  <SelectBox
                    options={states}
                    name="StateID"
                    selectedValue={formData.StateID}
                    onChange={handleSelectChange}
                  />
                  {formData?.StateID === "" && (
                    <span className="golbal-Error">{errors?.StateID}</span>
                  )}
                </div>
                <label className="  col-sm-1" htmlFor="City">
                  {t("City")} :
                </label>
                <div className="col-sm-2 ">
                  <SelectBox
                    options={[{ label: "Select City", value: "" }, ...cities]}
                    name="CityID"
                    selectedValue={formData?.CityID}
                    onChange={handleSelectChange}
                  />
                  {formData?.CityID === "" && (
                    <span className="golbal-Error">{errors?.CityID}</span>
                  )}
                </div>
              </div>
              <div className="row">
                <label className="  col-sm-1" htmlFor="City">
                  {t("Area")} :
                </label>
                <div className="col-sm-2 ">
                  <SelectBox
                    name="LocalityID"
                    options={[{ label: "Select Area", value: "" }, ...locality]}
                    selectedValue={formData?.LocalityID}
                    onChange={handleSelectChange}
                  />
                  {formData?.LocalityID === "" && (
                    <span className="golbal-Error">{errors?.LocalityID}</span>
                  )}
                </div>

                <label className="  col-sm-1" htmlFor="Pin Code">
                  {t("Pincode")} :
                </label>
                <div className="col-sm-2 ">
                  <Input
                    className="select-input-box form-control input-sm"
                    name="Pincode"
                    value={formData.Pincode}
                    max={6}
                    autoComplete="off"
                    type="text"
                    placeholder="Pin Code"
                    onChange={handleSelectChange}
                  />
                </div>
                <label className="  col-sm-1" htmlFor="Email Id">
                  {t("Email Id")} :
                </label>
                <div className="col-sm-2 ">
                  <Input
                    className="select-input-box form-control input-sm"
                    name="Email"
                    max={30}
                    value={formData.Email}
                    type="text"
                    autoComplete="off"
                    placeholder="Email Id"
                    onChange={handleSelectChange}
                  />

                  {formData?.Email.trim().length > 0 &&
                    !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData?.Email) && (
                      <span className="golbal-Error">{errors?.Emailvalid}</span>
                    )}
                </div>
                <label className="  col-sm-1" htmlFor="Landmark">
                  {t("Landmark")}:
                </label>
                <div className="col-sm-2 ">
                  <Input
                    className="select-input-box form-control input-sm"
                    name="Landmark"
                    type="text"
                    max={30}
                    autoComplete="off"
                    value={formData?.Landmark}
                    placeholder="Landmark"
                    onChange={handleSelectChange}
                  />

                  {formData?.Landmark.trim().length > 0 &&
                    formData?.Landmark.trim().length < 3 && (
                      <span className="golbal-Error">{errors?.Landmark}</span>
                    )}
                </div>
              </div>
            </div>
            <div className="box-footer">
              <div
                className="row"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div className="col-sm-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-block btn-sm"
                    onClick={handleSave}
                  >
                    Register New Patient
                  </button>
                </div>
                <div className="col-sm-1">
                  <button
                    type="button"
                    className="btn btn-primary btn-block btn-sm"
                    onClick={() => {
                      handleClose();
                      setFormData([]);
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default NewPatientDetailModal;
