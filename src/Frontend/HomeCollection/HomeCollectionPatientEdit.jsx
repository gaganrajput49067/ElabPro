import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import { UpdatePatientValidation } from "../../ChildComponents/validations";
import DatePicker from "../Components/DatePicker";
import Input from "../../ChildComponents/Input";
import { number } from "../util/Commonservices/number";
import { SelectBox } from "../../ChildComponents/SelectBox";
import Loading from "../util/Loading";
import { PreventNumber, PreventSpecialCharacter } from "../util/Commonservices";

const HomeCollectionPatientEdit = () => {
  const [loading, setLoading] = useState(false); // for loading screen
  const [errors, setErros] = useState({}); // for setting errors
  const [RadioDefaultSelect, setRadioDefaultSelect] = useState("Age"); // toggling between age and dob
  const [states, setStates] = useState([]); // storing states
  const [cities, setCities] = useState([]); // storing cities
  const [Locality, setLocality] = useState(null); // storing locality
  const [mobile, setMobile] = useState(""); // storing monile number to search details
  const [Gender, setGender] = useState([]); // storing genders
  const [Title, setTitle] = useState([]); // storing titles
  const [detailPage, setDetailpage] = useState(true); // used for toggling between main page and update page
  const [patientDetails, setpatientDetails] = useState(null); // used for storing all patient details
  const [phleboTable, setPhleboTable] = useState(null); // used for storing list of phelbo data fetched from api
  const [DateData, setDateData] = useState({
    AgeYear: "",
    AgeMonth: "",
    AgeDays: "",
  }); //this state is used for mapping date and for better convirsion with in dob and number of years,months and days

  //used for translation
  const { t } = useTranslation();

  //fetching State
  const fetchStates = () => {
    axios
      .post("api/v1/CommonHC/GetStateData", {
        BusinessZoneID: 0,
      })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ele.ID,
            label: ele.State,
            id: ele.ID,
          };
        });
        setStates(value);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  // fetching states
  const fetchCities = (id) => {
    const postdata = {
      StateId: id,
    };
    axios
      .post("api/v1/CommonHC/GetCityData", postdata)
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: handleSplitData(ele.ID),
            label: ele.City,
          };
        });
        setCities(value);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //fetching locality
  const fetchLocality = (id) => {
    const postdata = {
      cityid: id,
    };
    axios
      .post("api/v1/CustomerCare/BindLocality", postdata)
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ele.id,
            label: ele.NAME,
          };
        });
        setLocality(value);
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //used for spliting cityid because cityid comes in diffrent formate
  const handleSplitData = (id) => {
    const data = id.split("#")[0];
    return data;
  };

  // used for fetching state , gender and title
  useEffect(() => {
    fetchStates();
    getDropDownData("Gender");
    getDropDownData("Title");
  }, []);

  //fetching options for gender and title
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

  // finding gender according to title
  const findGender = () => {
    const male = ["Mr.", "Baba", "Dr.(Mrs)", "Dr."];
    const female = ["Miss.", "Mrs.", "Baby", "Dr.(Miss)"];

    if (male.includes(patientDetails?.title)) {
      setpatientDetails({ ...patientDetails, Gender: "Male" });
    }
    if (female.includes(patientDetails?.title)) {
      setpatientDetails({ ...patientDetails, Gender: "Female" });
    }
  };

  // if title chnages sets gender accordingly
  useEffect(() => {
    findGender();
  }, [patientDetails?.title]);

  // searching patient details with mobile no
  const handleSearch = async () => {
    setLoading(true);
    setPhleboTable(null);
    if (mobile.length === 10) {
      await axios
        .post("api/v1/updatehc/BindOldPatientHC", {
          mobile: mobile,
        })
        .then((res) => {
          if (Object.keys(res.data.message).length === 0) {
            toast.success("No Details Found ");
          } else {
            setLoading(false);
            const data = res.data.message;
            toast.success("Found Details");
            setDetailpage(true);
            const modifiedPatients = data.map((patient) => ({
              ...patient,
              //DOB: calculateDate(patient.AgeYear, patient.AgeMonth, patient.AgeDays),
            }));
            setPhleboTable(modifiedPatients);
            console.log(modifiedPatients);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          toast.error(
            err?.res?.data ? err?.res?.data : "No Patient registerd "
          );
        });
      setLoading(false);
    } else {
      toast.error("Enter Correct mobile no ");
    }
    setLoading(false);
  };
  // search by pressing enter
  const handleSearchbyenter = (e) => {
    if (e.which === 13) {
      handleSearch();
      setpatientDetails(null);
    }
  };

  // setting names of state/city/locality accoeding to their id in patient details
  const getName = (name, id) => {
    if (name == "StateId") {
      for (let i of states) {
        if (i.value == id) {
          return i.label;
        }
      }
    }
    if (name == "CityId") {
      for (let i of cities) {
        if (i.value == id) {
          return i.label;
        }
      }
    }
    if (name == "LocalityId") {
      for (let i of Locality) {
        if (i.value == id) {
          return i.label;
        }
      }
    }
  };

  //dynamic option selection
  const handleSelectChange = async (event) => {
    const { name, value, checked, type } = event?.target;
    if (name === "StateId" || name === "CityId" || name === "LocalityId") {
      if (name === "StateId") {
        fetchCities(value);
        setpatientDetails({
          ...patientDetails,
          [name]: value,
          CityId: "",
          LocalityId: "",
        });
      }
      if (name === "CityId") {
        setpatientDetails({ ...patientDetails, [name]: value, LocalityId: "" });
      }
      if (name === "LocalityId") {
        setpatientDetails({ ...patientDetails, [name]: value });
      }
    } else {
      setpatientDetails({
        ...patientDetails,
        [name]: type === "checkbox" ? checked : value,
      });
    }
    if (name === "Name") {
      setpatientDetails({ ...patientDetails, [name]: value });
    }
  };

  // handling cancel button on page
  const handleCancel = () => {
    if (!detailPage) {
      setDetailpage(true);
      setpatientDetails(null);
    } else {
      setMobile("");
      setPhleboTable(null);
    }
  };

  //filtering patient for updation from phelbo table
  const selectPatient = (id) => {
    const filtered = phleboTable.filter((item) => item.Patientid === id);
    const details = filtered[0];
    setpatientDetails((prevState) => ({
      ...prevState,
      Age: details.Age || "",
      Gender: details.Gender || "",
      Patientid: details.Patientid || "",
      houseno: details.houseno || "",
      Locality: details.Locality || "",
      City: details.City || "",
      Pincode: details.Pincode || "",
      State: details.State || "",
      Mobile: details.Mobile || "",
      Email: details.Email || "",
      title: details.title || "",
      FirstName: details.FirstName || "",
      NAME: details.Name || "",
      DOB: details.DOB || "",
      AgeYear: details.AgeYear || "",
      AgeMonth: details.AgeMonth || "",
      AgeDays: details.AgeDays || "",
      StreetName: details.StreetName || "",
      visitdate: details.visitdate || "",
      TotalAgeInDays: details.TotalAgeInDays || "",
      StateId: details.StateID || "",
      CityId: details.CityID || "",
      LocalityId: details.LocalityID || "",
      CompanyId: details.CompanyId || "",
      StreetName: details.Age || "",
      iseditd: details.iseditd || "",
      isreg: details.isreg || "",
      lasthcstatus: details.lasthcstatus || "",
      visitdate: details.visitdate || "",
      LandMark: details.LandMark || "",
    }));
    setDetailpage(false);
    const updateDate = {
      AgeYear: details.AgeYear,
      AgeDays: details.AgeDays,
      AgeMonth: details.AgeMonth,
    };
    setDateData(updateDate);

    const data = new Date(details?.DOB);
    dateSelect(data, "DOB");

    console.log("patientDetails", patientDetails);
    // fetchCities(patientDetails?.StateId)
    // fetchLocality(patientDetails?.CityId)
  };

  // setting years/months/days according to dob
  function formatDate(inputDate) {
    const dateObject = new Date(inputDate);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = dateObject.getDate();
    const month = monthNames[dateObject.getMonth()];
    const year = dateObject.getFullYear();
    // Format the date string
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  }

  const ageCount = (y = "0", m = "0", d = "0") => {
    if (y == 0 && m == 0 && d == 0) {
      return 1;
    } else {
      return d;
    }
  };

  // update patient details
  const updateDetails = () => {
    const generatedError = UpdatePatientValidation(patientDetails);
    const Age = `${patientDetails.AgeYear} Y ${patientDetails.AgeMonth} M ${patientDetails.AgeDays} D`;
    const DOB = formatDate(patientDetails?.DOB);
    const state = getName("StateId", patientDetails.StateId);
    const city = getName("CityId", patientDetails.CityId);
    const locality = getName("LocalityId", patientDetails.LocalityId);
    console.log(DOB);
    if (generatedError === "") {
      setLoading(true);
      axios
        .post("api/v1/updatehc/UpdateHCData", {
          Age: `${patientDetails.AgeYear} Y ${
            patientDetails.AgeMonth
          } M ${ageCount(
            patientDetails.AgeYear,
            patientDetails.AgeMonth,
            patientDetails.AgeDays
          )} D `,
          Gender: patientDetails.Gender,
          Patientid: patientDetails.Patientid, //not updating
          houseno: patientDetails.houseno.trim(),
          Locality: locality,
          City: city,
          Pincode: patientDetails.Pincode,
          State: state,
          Mobile: patientDetails.Mobile,
          Email: patientDetails.Email.trim(),
          title: patientDetails.title,
          FirstName: patientDetails.FirstName.trim(),
          DOB: DOB,
          AgeYear: Number(patientDetails.AgeYear),
          AgeMonth: patientDetails.AgeMonth,
          AgeDays: ageCount(
            patientDetails.AgeYear,
            patientDetails.AgeMonth,
            patientDetails.AgeDays
          ),
          StreetName: patientDetails.StreetName.trim(),
          visitdate: patientDetails.visitdate,
          TotalAgeInDays: patientDetails.TotalAgeInDays,
          StateID: Number(patientDetails.StateId),
          CityID: Number(patientDetails.CityId),
          LocalityID: Number(patientDetails.LocalityId),
          LandMark: patientDetails.LandMark,
        })
        .then((res) => {
          if (res.data.message) {
            setLoading(false);
            toast.success("Saved successfully");
            setDetailpage(true);
            handleSearch();
            setpatientDetails(null);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          toast.error(err?.res?.data ? err?.res?.data : "Something Went wrong");
        });

      setLoading(false);
    }
    setLoading(false);
    setErros(generatedError);
  };

  // // setting dob according to years/months/days
  // const calculateDate = (x, y, z) => {
  //     const currentDate = new Date();

  //     const monthNames = [
  //         'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  //         'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  //     ];
  //     const currentYear = currentDate.getFullYear();

  //     const backDate = new Date(
  //         currentDate.getFullYear() - x,
  //         currentDate.getMonth() - y,
  //         currentDate.getDate() - z + 1,
  //     );

  //     //console.log(moment(backDate).format("DD-MMM-YYYY"))

  //     const dob = moment(backDate).format("DD-MMM-YYYY")
  //     return dob;
  // };

  // calculating dob to days/month/year and vice-versa dynamicaly
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

  const handleDOBCalculation = (e) => {
    const { name, value } = e.target;
    let diff = {};
    let subtractType =
      name === "AgeYear" ? "years" : name === "AgeMonth" ? "months" : "days";

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

    const y = `${duration?._data?.years}`;
    const m = `${duration._data?.months}`;
    const d = `${duration?._data?.days}`;
    const days = ageCount(y, m, d);
    setpatientDetails({
      ...patientDetails,
      [name]: value,
      DOB: diff?._d,
      TotalAgeInDays: moment(moment().format("YYYY-MM-DD")).diff(
        diff?._d,
        "days"
      ),
      Age: `${duration?._data?.years} Y ${duration._data?.months} M ${days} D`,
    });
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
    setpatientDetails((prevState) => ({
      ...prevState,
      [name]: value,
      AgeYear: years,
      AgeMonth: months,
      AgeDays: days,
      TotalAgeInDays: calculateTotalNumberOfDays(value),
      Age: `${years} Y ${months} M ${days} D`,
    }));
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

  // dynamicaly updating input state
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    const sanitizedValue = value.replace(/[^A-Za-z]/g, "").trim();
    if (name === "FirstName") {
      setpatientDetails((prevDetails) => ({
        ...prevDetails,
        [name]: sanitizedValue,
      }));
    }

    setpatientDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  // on patient age year change update month also for rendering
  useEffect(() => {
    const e = {
      target: {
        name: "AgeMonth",
        value: patientDetails?.AgeMonth,
      },
    };
    handleDOBCalculation(e);
  }, [patientDetails?.AgeYear]);

  // on selecting patient for update fetch city and locality accordig to state
  useEffect(() => {
    fetchCities(patientDetails?.StateId);
    fetchLocality(patientDetails?.CityId);
  }, [patientDetails?.StateId, patientDetails?.CityId]);

  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h3 className="box-title">Home Collection Patient Edit </h3>
        </div>
        <div className="box-body">
          <div className="row ">
            <div className="col-sm-3 d-flex">
              <label
                className="col-sm-1"
                htmlFor="inputEmail3"
                style={{ width: "50%" }}
              >
                {t("Mobile No")}:
              </label>
              <div className="" style={{ width: "90%" }}>
                <input
                  type="number"
                  name="phoneno"
                  value={mobile}
                  onInput={(e) => number(e, 10)}
                  className="select-input-box form-control input-sm"
                  onChange={(e) => setMobile(e.target.value)}
                  onKeyDown={handleSearchbyenter}
                />
              </div>
            </div>
            &nbsp;
            <div className="col-sm-2 ">
              <div className="d-flex">
                <button
                  type="button"
                  className="btn  btn-info w-100 btn-sm mx-2"
                  onClick={handleSearch}
                >
                  {t("Search")}
                </button>
                <button
                  type="button"
                  className="btn  btn-danger w-100 btn-sm mx-2"
                  onClick={handleCancel}
                >
                  {t("Cancel")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {detailPage ? (
        <>
          {loading && !phleboTable && <Loading />}
          {phleboTable && (
            <div className="box ">
              <div className="box-body">
                <div className="row" style={{ backgroundColor: "skyblue" }}>
                  <label
                    className="col-sm-4 col-md-4 text-center" // Add text-center class for centering text
                    htmlFor="Pending"
                    style={{ margin: "6px auto" }}
                  >
                    &nbsp; Patient List
                  </label>
                  <label
                    className="col-sm-4 col-md-4 text-center" // Add text-center class for centering text
                    htmlFor="Not Registered"
                    style={{ margin: "6px auto" }}
                  >
                    <span
                      style={{
                        backgroundColor: "papayawhip",
                        border: "1px solid",
                      }}
                    >
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                    &nbsp; Not Registered
                  </label>
                  <label
                    className="col-sm-4 col-md-4 text-center" // Add text-center class for centering text
                    htmlFor="Registered"
                    style={{ margin: "6px auto" }}
                  >
                    <span
                      style={{
                        backgroundColor: "lightgreen",
                        border: "1px solid",
                      }}
                    >
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                    &nbsp; Registered
                  </label>
                </div>

                <div
                  className="row box-body divResult boottable table-responsive"
                  id="no-more-tables"
                >
                  {loading ? (
                    <Loading />
                  ) : (
                    <div className="row">
                      {phleboTable && (
                        <table
                          className="table table-bordered table-hover table-striped tbRecord"
                          cellPadding="{0}"
                          cellSpacing="{0}"
                        >
                          <thead
                            className="cf text-center"
                            style={{ zIndex: 99 }}
                          >
                            <tr>
                              <th className="text-center">{t("Log")}</th>
                              <th className="text-center">{t("#")}</th>
                              <th className="text-center">{t("UHID")}</th>
                              <th className="text-center">
                                {t("Patient Name")}
                              </th>
                              <th className="text-center">{t("Age")}</th>
                              <th className="text-center">{t("Gender")}</th>
                              <th className="text-center">{t("Mobile No")}</th>
                              <th className="text-center">{t("Locality")}</th>
                              <th className="text-center">{t("City")}</th>
                              <th className="text-center">{t("State")}</th>
                              <th className="text-center">{t("Pincode")}</th>
                              <th className="text-center">{t("Reg Date")}</th>
                              <th className="text-center">
                                {t("Last HC Status")}
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {phleboTable &&
                              phleboTable.map((ele, index) => (
                                <>
                                  <tr
                                    key={index}
                                    style={{
                                      backgroundColor: ele.isreg
                                        ? "papayawhip"
                                        : "lightgreen",
                                    }}
                                  >
                                    <td data-title="#" className="text-center">
                                      {index + 1} &nbsp;
                                    </td>
                                    <td
                                      data-title="Select"
                                      className="text-center"
                                    >
                                      <button
                                        className="btn  btn-info btn-sm"
                                        onClick={() =>
                                          selectPatient(ele.Patientid)
                                        }
                                      >
                                        Select
                                      </button>
                                    </td>
                                    <td
                                      data-title="Patientid"
                                      className="text-center"
                                    >
                                      {ele.Patientid}&nbsp;
                                    </td>
                                    <td
                                      data-title="Name"
                                      className="text-center"
                                    >
                                      {ele.title}&nbsp;{ele.FirstName}&nbsp;
                                    </td>
                                    <td
                                      data-title="dob"
                                      className="text-center"
                                    >
                                      {ele.DOB}&nbsp;
                                    </td>
                                    <td
                                      data-title="gender"
                                      className="text-center"
                                    >
                                      {ele.Gender}&nbsp;
                                    </td>
                                    <td
                                      data-title="mobile"
                                      className="text-center"
                                    >
                                      {ele.Mobile}&nbsp;
                                    </td>
                                    <td
                                      data-title="Locality"
                                      className="text-center"
                                    >
                                      {ele.Locality}&nbsp;
                                    </td>
                                    <td
                                      data-title="city"
                                      className="text-center"
                                    >
                                      {ele.City}&nbsp;
                                    </td>
                                    <td
                                      data-title="state"
                                      className="text-center"
                                    >
                                      {ele.State}&nbsp;
                                    </td>
                                    <td
                                      data-title="pincode"
                                      className="text-center"
                                    >
                                      {ele.Pincode}&nbsp;
                                    </td>
                                    <td
                                      data-title="status"
                                      className="text-center"
                                    >
                                      {ele.visitdate}&nbsp;
                                    </td>
                                    <td
                                      data-title="Cancel"
                                      className="text-center"
                                    >
                                      {ele.lasthcstatus}&nbsp;
                                    </td>
                                  </tr>
                                </>
                              ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="box ">
            <div className="box-body">
              <div className="box-header with-border">
                <h3 className="box-title">Update Patient Details </h3>
              </div>
              <div className="box-body">
                <div className="row">
                  <label className="col-sm-1" htmlFor="inputEmail3">
                    {t("Mobile No")}:
                  </label>
                  <div className="col-sm-2">
                    <Input
                      type="number"
                      name="mobileno"
                      disabled={true}
                      placeholder="Mobile No"
                      value={patientDetails?.Mobile}
                      className="select-input-box form-control input-sm"
                      onChange={handleSelectChange}
                    />
                  </div>
                  <label className="col-sm-1" htmlFor="inputEmail3">
                    {t("UHID")}:
                  </label>
                  <div className="col-sm-2">
                    <Input
                      type="text"
                      name="FirstName"
                      disabled={true}
                      placeholder="UHID"
                      value={patientDetails?.Patientid}
                      className="select-input-box form-control input-sm"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <label className="col-sm-1" htmlFor="inputEmail3">
                    {t("Patient Name")}
                  </label>

                  <div className="col-sm-2">
                    <div className="d-flex">
                      <div
                        className="col-sm-2"
                        style={{ width: "40%", margin: "0", padding: "0" }}
                      >
                        <SelectBox
                          options={Title}
                          name="title"
                          selectedValue={patientDetails?.title}
                          onChange={handleSelectChange}
                        />
                        {patientDetails?.Title === "" && (
                          <span className="golbal-Error">{errors?.Title}</span>
                        )}
                      </div>
                      <div style={{ width: "70%" }}>
                        <input
                          className="select-input-box form-control input-sm required"
                          name="FirstName"
                          type="text"
                          max={35}
                          required
                          defaultValue={patientDetails?.FirstName}
                          onChange={handleChange}
                        />
                        {patientDetails?.FirstName === "" ||
                          (patientDetails?.FirstName.length <= 4 && (
                            <>
                              <span className="golbal-Error">
                                {errors?.FirstNameLength}
                              </span>
                              <br />
                            </>
                          ))}
                        {/[^A-Za-z\s]/g.test(patientDetails?.FirstName) && (
                          <span className="golbal-Error">
                            {errors?.FirstNameNumber}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <label htmlFor="inputEmail3" className="col-sm-1">
                    {t("Age")} :
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
                  <div className="col-sm-2">
                    <div className="input-group-append d-flex">
                      <Input
                        className="select-input-box form-control input-sm"
                        style={{ width: "10%" }}
                        id="AgeY"
                        name="AgeYear"
                        type="number"
                        onInput={(e) => number(e, 3, 120)}
                        value={patientDetails?.AgeYear ?? 0}
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
                        className="select-input-box form-control input-sm"
                        id="AgeM"
                        name="AgeMonth"
                        type="number"
                        onInput={(e) => number(e, 2, 12)}
                        disabled={
                          RadioDefaultSelect === "DOB"
                            ? true
                            : patientDetails?.AgeYear
                            ? false
                            : true
                        }
                        value={patientDetails?.AgeMonth}
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
                        id="AgeD"
                        name="AgeDays"
                        type="number"
                        onInput={(e) => number(e, 2, 31)}
                        value={patientDetails?.AgeDays}
                        disabled={
                          RadioDefaultSelect === "DOB"
                            ? true
                            : patientDetails?.AgeMonth
                            ? false
                            : true
                        }
                        onChange={handleDOBCalculation}
                      />
                      <span
                        className="input-group-text form-control pull-right reprint-date input-sm justify-content-center"
                        style={{ width: "20px" }}
                      >
                        {t("D")}
                      </span>
                    </div>

                    {patientDetails?.AgeYear === "" && (
                      <span className="golbal-Error">{errors?.AgeYear}</span>
                    )}
                  </div>
                  <label htmlFor="inputEmail3" className="col-sm-1">
                    {t("D.O.B.")}
                    <input
                      type="radio"
                      name="AgeWise"
                      value={"DOB"}
                      onChange={(e) => {
                        setRadioDefaultSelect(e.target.value);
                      }}
                      checked={RadioDefaultSelect === "DOB" ? true : false}
                    />
                  </label>
                  <div className="col-sm-2">
                    <DatePicker
                      name="DOB"
                      date={
                        patientDetails?.DOB
                          ? new Date(patientDetails?.DOB)
                          : new Date()
                      }
                      disabled={RadioDefaultSelect === "Age" ? true : false}
                      className="select-input-box form-control input-sm required"
                      onChange={dateSelect}
                      maxDate={new Date()}
                    />
                    {patientDetails?.DOB === "" && (
                      <span className="golbal-Error">{errors?.DOB}</span>
                    )}
                  </div>
                  <label htmlFor="inputEmail3" className="col-sm-1">
                    {t("Gender")} :
                  </label>
                  <div className="col-sm-2">
                    <SelectBox
                      options={Gender}
                      className="required"
                      selectedValue={patientDetails?.Gender}
                      isDisabled={patientDetails?.title ? true : false}
                      name="Gender"
                      onChange={handleSelectChange}
                    />
                    {patientDetails?.Gender === "" && (
                      <span className="golbal-Error">{errors?.Gender}</span>
                    )}
                  </div>
                </div>
                <div className="row">
                  <label className="col-sm-1" htmlFor="inputEmail3">
                    {t("House No")}:
                  </label>
                  <div className="col-sm-2">
                    <Input
                      type="text"
                      name="houseno"
                      value={patientDetails?.houseno}
                      className="select-input-box form-control input-sm"
                      onChange={handleChange}
                    />
                  </div>
                  <label className="col-sm-1" htmlFor="inputEmail3">
                    {t("State")}:
                  </label>
                  <div className="col-sm-2">
                    <SelectBox
                      className="form-control input-sm"
                      name="StateId"
                      onChange={handleSelectChange}
                      selectedValue={patientDetails.StateId}
                      options={[
                        { label: "Select State", value: "" },
                        ...states,
                      ]}
                    />
                    {patientDetails?.StateId === "" && (
                      <span className="golbal-Error">{errors?.StateId}</span>
                    )}
                  </div>
                  <label className="col-sm-1" htmlFor="inputEmail3">
                    {t("City")}:
                  </label>
                  <div className="col-sm-2">
                    <SelectBox
                      name="CityId"
                      className="select-input-box form-control input-sm"
                      onChange={handleSelectChange}
                      selectedValue={patientDetails.CityId}
                      options={[{ label: "Select City", value: "" }, ...cities]}
                    />
                    {patientDetails?.CityId === "" && (
                      <span className="golbal-Error">{errors?.CityId}</span>
                    )}
                  </div>
                  <label className="col-sm-1" htmlFor="inputEmail3">
                    {t("Locality")}:
                  </label>
                  <div className="col-sm-2">
                    <SelectBox
                      name="LocalityId"
                      className="select-input-box form-control input-sm"
                      onChange={handleSelectChange}
                      selectedValue={patientDetails?.LocalityId}
                      options={[
                        { label: "Select Locality", value: "" },
                        ...Locality,
                      ]}
                    />
                    {patientDetails?.LocalityId === "" && (
                      <span className="golbal-Error">{errors?.LocalityId}</span>
                    )}
                  </div>
                </div>
                <div className="row">
                  <label className="col-sm-1" htmlFor="inputEmail3">
                    {t("Pin Code")}:
                  </label>
                  <div className="col-sm-2">
                    <Input
                      type="number"
                      name="Pincode"
                      onInput={(e) => number(e, 6)}
                      defaultValue={patientDetails?.Pincode}
                      className="select-input-box form-control input-sm"
                      onChange={handleChange}
                    />
                    {patientDetails?.Pincode === "" && (
                      <span className="golbal-Error">{errors?.Pincode}</span>
                    )}
                    {patientDetails?.Pincode !== "" &&
                      patientDetails?.Pincode.length != 6 && (
                        <span className="golbal-Error">
                          {errors?.Pincodelength}
                        </span>
                      )}
                  </div>
                  <label className="col-sm-1" htmlFor="inputEmail3">
                    {t("Email ID")}:
                  </label>
                  <div className="col-sm-2">
                    <input
                      type="email"
                      name="Email"
                      defaultValue={patientDetails?.Email}
                      className="select-input-box form-control input-sm"
                      onChange={handleChange}
                    />
                    {patientDetails?.Email && (
                      <span className="golbal-Error">{errors?.Email}</span>
                    )}
                  </div>
                  <label className="col-sm-1" htmlFor="inputEmail3">
                    {t("Landmark")}:
                  </label>
                  <div className="col-sm-2">
                    <Input
                      type="text"
                      name="LandMark"
                      value={patientDetails?.LandMark}
                      className="select-input-box form-control input-sm"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-sm-5 col-xs-12 d-flex justify-content-center text-center">
                    &nbsp;
                  </div>
                  <div className="col-sm-2 col-xs-12 d-flex justify-content-center text-center">
                    <button
                      type="button"
                      className="btn btn-block btn-info btn-sm text-center"
                      onClick={updateDetails}
                    >
                      {t("Update Details")}
                    </button>
                  </div>
                  <div className="col-sm-5 col-xs-12 d-flex justify-content-center text-center">
                    &nbsp;
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
        </>
      )}
    </>
  );
};

export default HomeCollectionPatientEdit;
