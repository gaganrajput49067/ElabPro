import React, { useEffect } from "react";
import axios from "axios";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { SimpleCheckbox } from "../../ChildComponents/CheckBox";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import moment from "moment";
import DatePicker from "../Components/DatePicker";
import { useState } from "react";
import AppointmentNotBookedModal from "./AppointmentNotBookedModal";
import { AppointmentModalValidationSchema } from "../../ChildComponents/validations";
import DoAppointmentModal from "./DoAppointmentModal";
import PhelebotomistDetailModal from "./PhelebotomistDetailModal";
import { AppointmentModalValidationSchema2 } from "../../ChildComponents/validations";
import Loading from "../util/Loading";
const AppointmentModal = ({
  showPatientData,
  appointShow,
  handleCloseAppoint,
}) => {
  const [errors, setError] = useState({});
  const [mouseHover, setMouseHover] = useState({
    index: -1,
    data: [],
  });
  var count = 0;
  const [notBookedShow, setNotBookedShow] = useState(false);
  const [appointment, setAppointment] = useState(false);
  const [updateAddressDisable, setUpdateAddressDisable] = useState(false);
  const [phelebotomistData, setPhelebotomistData] = useState([]);
  const [load, setLoad] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [dropLocation, setDropLocation] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [showPhelebo, setShowPhelebo] = useState([]);
  const [pheleboProfile, setPheleboProfile] = useState(false);
  const [selectedPhelebo, setSelectedPhelebo] = useState([]);
  const [getPatientDetailOnSlot, setGetPatientDetailOnSlot] = useState([]);
  const [routeValueData, setRouteValueData] = useState([]);
  const { t } = useTranslation();
  console.log(showPatientData);
  const [searchData, setSearchData] = useState({
    Address: showPatientData?.HouseNo ? showPatientData?.HouseNo : "",
    StateID: showPatientData?.StateID ? showPatientData?.StateID : "",
    CityID: showPatientData?.CityID ? showPatientData?.CityID : "",
    LocalityID: showPatientData?.LocalityID ? showPatientData?.LocalityID : "",
    Pincode: showPatientData?.Pincode ? showPatientData?.Pincode : "",
    SelectedBindRoute: "",
    Landmark: showPatientData?.Landmark ? showPatientData?.Landmark : "",
    Email: showPatientData?.Email ? showPatientData?.Email : "",
    AppointmentDate: new Date(new Date().getTime() + 86400000),

    DropLocationId: "",
    RouteId: "",
    // CentreID: "",
  });
  console.log(searchData);
  const handleNotBookedClose = () => {
    setNotBookedShow(false);
  };

  const handlePheleboDetailClose = () => {
    setPheleboProfile(false);
  };
  const handleAppointment = () => {
    setAppointment(false);
    // handleSearch(true);
  };

  // const handleSuggestedClose = () => {
  //   setSuggestedTestShow(false);
  // };
  const dateSelect = (date, name) => {
    setSearchData({
      ...searchData,
      [name]: date,
    });
  };

  // useEffect(() => {
  //   const generatedError = AppointmentModalValidationSchema(searchData);
  //   setError({
  //     ...errors,
  //     Emailvalid: generatedError.Emailvalid,
  //   });
  // }, [searchData?.Email]);

  // useEffect(() => {
  //   console.log(searchData?.LocalityID);
  //   console.log(searchData);
  // }, [searchData?.LocalityID]);
  console.log(states, cities, localities);
  const GetPatientDetailonSlot = (SetPhelebo) => {
    const phleboIds = SetPhelebo.map((phelebo) => phelebo.SelectedPheleboId);

    axios
      .post("/api/v1/CustomerCare/GetPatientDetailonSlot", {
        PhlebotomistID: phleboIds,
        AppDateTime: moment(searchData.AppointmentDate).format("YYYY-MM-DD"),
      })
      .then((res) => {
        const data = res?.data?.message;
        console.log(data);
        const PatientSlot = data?.map((ele) => {
          const apptimeTime = moment(ele?.apptime, "HH:mm:ss");
          return {
            pname: ele?.patientname,
            City: ele?.locality,
            PreBookingID: ele?.PreBookingID,
            Address: ele?.Address,
            Mobile: ele?.Mobileno,
            isVip: ele?.VIP,
            HardCopyRequired: ele?.HardCopyRequired,
            netAmount: ele?.NetAmt,
            apptime: apptimeTime.format("HH:mm"),
            phlebotomistid: ele?.phlebotomistid,
          };
        });
        console.log(PatientSlot);
        setGetPatientDetailOnSlot(PatientSlot);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };
  console.log(searchData);
  const handleSearch = (payload) => {
    console.log(payload);
    console.log(searchData);

    const generatedError = AppointmentModalValidationSchema(searchData);
    console.log(searchData);
    console.log(generatedError);
    let obj = {
      areaid: "",
      pincode: "",
      fromdate: "",
      freeslot: "",
      phelboid: "",
    };

    // if (Today == 0) {
    //   setShowPhelebo([]);
    //   toast.error("You Cannot Book appointment on Sunday");
    // } else {
    if (payload) {
      obj = {
        areaid: payload.areaid,
        pincode: payload.pincode,

        fromdate: moment(searchData.AppointmentDate).format("DD-MMM-YYYY"),
        freeslot: searchData?.freeslot,
        phelboid: searchData?.phelboid,
      };
      setLoad(true);
      axios
        .post("/api/v1/CustomerCare/BindSlot", obj)
        .then((res) => {
          setLoad(false);
          const data = res.data.Data;
          const slot = res?.data?.Slot;
          const TimeslotData = res?.data?.TimeslotData;

          const slotTime = TimeslotData.map((e) => {
            return {
              NoofSlotForApp: e.NoofSlotForApp,
            };
          });

          const SlotArray = [];
          for (
            let i = 0;
            i < slot.length;
            i += parseInt(slotTime[0].NoofSlotForApp, 10)
          ) {
            SlotArray.push(
              slot.slice(i, i + parseInt(slotTime[0].NoofSlotForApp, 10))
            );
          }

          const SetPhelebo = data?.map((ele) => {
            return {
              SelectedPheleboId: ele?.ID,
              // value: handleSplit(handleSplit(ele?.centreid, "^")[0], "#")[1],
              // label: handleSplit(ele?.centreid, "^")[1],
              // centreid: handleSplit(handleSplit(ele?.centreid, "^")[0], "#")[0],
              SelectedRouteName: handleSplit(ele?.route, "@")[0],
              LoginTime: ele?.LoginTime,
              LogoutTime: ele?.LogoutTime,
              SelectedRouteId: handleSplit(ele?.route, "@")[1],
              PheleboNumber: handleSplit(ele?.NAME, " ")[1],
              PheleboName: handleSplit(ele?.NAME, " ")[0],
              istemp: ele?.istemp,
              Slotdata: slot,
              WeakOff: ele?.WeakOff,
              SlotArray: SlotArray,
              TimeslotData: slotTime[0].NoofSlotForApp,
            };
          });
          console.log(SetPhelebo);
          setShowPhelebo(SetPhelebo);
          GetPatientDetailonSlot(SetPhelebo);
        })
        .catch((err) => {
          setLoad(false);
          setShowPhelebo([]);
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
        });
    } else {
      const generatedError = AppointmentModalValidationSchema(searchData);
      if (generatedError == "") {
        setSearchData({
          ...searchData,
          RouteId: "",
          SelectedBindRoute: searchData.onLoadRoute,
        });
        obj = {
          areaid: searchData?.LocalityID,
          pincode: searchData?.Pincode,
          fromdate: moment(searchData.AppointmentDate).format("DD-MMM-YYYY"),
          freeslot: searchData?.freeslot,
          phelboid: searchData?.phelboid,
        };
        setLoad(true);
        axios
          .post("/api/v1/CustomerCare/BindSlot", obj)
          .then((res) => {
            setLoad(false);
            const data = res.data.Data;
            const slot = res?.data?.Slot;
            const TimeslotData = res?.data?.TimeslotData;

            const slotTime = TimeslotData.map((e) => {
              return {
                NoofSlotForApp: e.NoofSlotForApp,
              };
            });

            const SlotArray = [];
            for (
              let i = 0;
              i < slot.length;
              i += parseInt(slotTime[0].NoofSlotForApp, 10)
            ) {
              SlotArray.push(
                slot.slice(i, i + parseInt(slotTime[0].NoofSlotForApp, 10))
              );
            }

            const SetPhelebo = data?.map((ele) => {
              return {
                SelectedPheleboId: ele?.ID,
                // value: handleSplit(handleSplit(ele?.centreid, "^")[0], "#")[1],
                // label: handleSplit(ele?.centreid, "^")[1],
                // centreid: handleSplit(handleSplit(ele?.centreid, "^")[0], "#")[0],
                SelectedRouteName: handleSplit(ele?.route, "@")[0],
                LoginTime: ele?.LoginTime,
                LogoutTime: ele?.LogoutTime,
                SelectedRouteId: handleSplit(ele?.route, "@")[1],
                WeakOff: ele?.WeakOff,
                PheleboNumber: handleSplit(ele?.NAME, " ")[1],
                PheleboName: handleSplit(ele?.NAME, " ")[0],
                istemp: ele?.istemp,
                Slotdata: slot,
                SlotArray: SlotArray,
                TimeslotData: slotTime[0].NoofSlotForApp,
              };
            });
            console.log(SetPhelebo);
            setShowPhelebo(SetPhelebo);
            GetPatientDetailonSlot(SetPhelebo);
          })
          .catch((err) => {
            setLoad(false);
            setShowPhelebo([]);
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Error Occured"
            );
          });
      } else {
        setError(generatedError);
        setShowPhelebo([]);
      }
    }
    // }
  };
  function getDayCode(dayName) {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayCode = daysOfWeek.indexOf(dayName);

    return dayCode;
  }
  console.log(searchData);
  const DoAppointment = (match, data, selectedPhelebo) => {
    const generatedError = AppointmentModalValidationSchema2(searchData);
    if (generatedError == "") {
      console.log(match, data, selectedPhelebo);
      const currentTime = new Date();
      const currentHours = currentTime.getHours();
      const currentMinutes = currentTime.getMinutes();
      const [dataHours, dataMinutes] = data.split(":").map(Number);
      const [loginHour, loginMinute] =
        selectedPhelebo?.LoginTime?.split(":").map(Number);
      const [logoutHour, logoutMinute] =
        selectedPhelebo?.LogoutTime?.split(":").map(Number);
      const appointmentDate = new Date(searchData.AppointmentDate);
      const AppointmentWeekDay = appointmentDate.getDay();
      const SelectedPheleboWeekOff = getDayCode(selectedPhelebo?.WeakOff);
      const currentDate = new Date();

      const appointmentDay = appointmentDate.getDate();
      const appointmentMonth = appointmentDate.getMonth();
      const currentDay = currentDate.getDate();
      const currentMonth = currentDate.getMonth();
      console.log(
        appointmentDay,
        currentDay,
        AppointmentWeekDay,
        SelectedPheleboWeekOff
      );

      if (appointmentDay == currentDay && appointmentMonth == currentMonth) {
        if (
          dataHours < currentHours ||
          (dataHours === currentHours && dataMinutes < currentMinutes)
        ) {
          toast.error("You can't book an appointment for this time");
        } else if (AppointmentWeekDay == SelectedPheleboWeekOff) {
          toast.error("Phelebo on a off on this day");
        } else if (
          !(
            (dataHours > loginHour ||
              (dataHours === loginHour && dataMinutes >= loginMinute)) &&
            (dataHours < logoutHour ||
              (dataHours === logoutHour && dataMinutes <= logoutMinute))
          )
        ) {
          toast.error("Phelebo Not Available for this time");
        } else if (match >= selectedPhelebo?.TimeslotData) {
          toast.error("Booking is Filled for given Slot");
        } else {
          setSelectedPhelebo({
            ...selectedPhelebo,
            centreid: searchData.DropLocationId,
            SelectedTime: data,
            Address: searchData.Address,
            AppointmentDate: searchData.AppointmentDate,
            CityID: searchData.CityID,
            DropLocationId: searchData.DropLocationId,
            // DropLocationLabel: searchData?.DropLocationLabel,
            Email: searchData.Email,
            Landmark: searchData.Landmark,
            LocalityID: searchData.LocalityID,
            Pincode: searchData.Pincode,
            RouteId: searchData.RouteId
              ? searchData?.RouteId
              : dropLocation[0]?.SelectedRouteId,
            SelectedBindRoute: searchData.SelectedBindRoute,
            StateID: searchData.StateID,
            uhid: showPatientData.Patientid,
            Title: showPatientData.title,
            Patient_ID: showPatientData.Patientid,
            Mobile: showPatientData.Mobile,
            DOB: moment(showPatientData.DOB).format("YYYY-MMM-DD"),
            Age: showPatientData.Age,
            NAME: showPatientData?.FirstName,
            Gender: showPatientData.Gender,
            House_No: searchData.Address,
            Locality: FindLabel(localities, searchData?.LocalityID),
            State: FindLabel(states, searchData?.StateID),
            City: FindLabel(cities, searchData?.CityID),
            AgeYear: showPatientData?.AgeYear,
            AgeMonth: showPatientData?.AgeMonth,
            AgeDays: showPatientData?.AgeDays,
            TotalAgeInDays: showPatientData?.TotalAgeInDays,
          });
          if (searchData.Address === "") {
            toast.error("Please Enter Proper Address");
          } else if (searchData?.DropLocationId === "") {
            toast.error("Please Pick Any DropLocation");
          } else {
            setAppointment(true);
          }
        }
      } else {
        if (
          !(
            (dataHours > loginHour ||
              (dataHours === loginHour && dataMinutes >= loginMinute)) &&
            (dataHours < logoutHour ||
              (dataHours === logoutHour && dataMinutes <= logoutMinute))
          )
        ) {
          toast.error("Phelebo Not Available for this time");
        } else if (AppointmentWeekDay == SelectedPheleboWeekOff) {
          toast.error("Phelebo on a off on this day");
        } else if (match >= selectedPhelebo?.TimeslotData) {
          toast.error("Booking is Filled for given Slot");
        } else {
          setSelectedPhelebo({
            ...selectedPhelebo,
            centreid: searchData.DropLocationId,
            SelectedTime: data,
            Address: searchData.Address,
            AppointmentDate: searchData.AppointmentDate,
            CityID: searchData.CityID,
            DropLocationId: searchData.DropLocationId,
            // DropLocationLabel: searchData?.DropLocationLabel,
            Email: searchData.Email,
            Landmark: searchData.Landmark,
            LocalityID: searchData.LocalityID,
            Pincode: searchData.Pincode,
            RouteId: searchData.RouteId
              ? searchData?.RouteId
              : dropLocation[0]?.SelectedRouteId,
            SelectedBindRoute: searchData.SelectedBindRoute,
            StateID: searchData.StateID,
            uhid: showPatientData.Patientid,
            Title: showPatientData.title,
            Patient_ID: showPatientData.Patientid,
            Mobile: showPatientData.Mobile,
            DOB: moment(showPatientData.DOB).format("YYYY-MMM-DD"),
            Age: showPatientData.Age,
            NAME: showPatientData?.FirstName,
            Gender: showPatientData.Gender,
            House_No: searchData.Address,
            Locality: FindLabel(localities, searchData?.LocalityID),
            State: FindLabel(states, searchData?.StateID),
            City: FindLabel(cities, searchData?.CityID),
            AgeYear: showPatientData?.AgeYear,
            AgeMonth: showPatientData?.AgeMonth,
            AgeDays: showPatientData?.AgeDays,
            TotalAgeInDays: showPatientData?.TotalAgeInDays,
          });
          if (searchData.Address === "") {
            toast.error("Please Enter Proper Address");
          } else if (searchData?.DropLocationId === "") {
            toast.error("Please Pick Any DropLocation");
          } else {
            setAppointment(true);
          }
        }
      }
    } else {
      setError(generatedError);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event?.target;

    if (name === "StateID") {
      getCityDropDown(value);
      setSearchData({
        ...searchData,
        [name]: value,
        CityID: "",
        LocalityID: "",
        Pincode: "",
        DropLocationId: "",
        SelectedBindRoute: "",
        RouteId: "",
      });
      setShowPhelebo([]);
      setCities([]);
      setLocalities([]);
      setDropLocation([]);
    }
    if (name === "CityID") {
      getLocalityDropDown(value);
      getBindRoute(value);
      setSearchData({
        ...searchData,
        [name]: value,
        LocalityID: "",
        Pincode: "",
        DropLocationId: "",
        SelectedBindRoute: "",
        RouteId: "",
      });
      setShowPhelebo([]);
      setLocalities([]);
      setDropLocation([]);
    }

    if (name === "LocalityID") {
      if (value) {
        getPincode(value, name);
        setSearchData({
          ...searchData,
          [name]: value,
          // Pincode: "",
          // DropLocationId: "",
          // SelectedBindRoute: "",
          RouteId: "",
        });
      } else {
        setSearchData({
          ...searchData,
          LocalityID: "",
          Pincode: "",
          DropLocationId: "",
          SelectedBindRoute: "",
          RouteId: "",
        });
        setShowPhelebo([]);
        setDropLocation([]);
      }

      // setShowPhelebo([]);
      //
    }

    if (name === "RouteId") {
      console.log(value);
      if (value !== "") {
        const data = routes.find((ele) => value == ele?.value);
        searchData.RouteId = data?.value;
        searchData.SelectedBindRoute = data?.label;
        const val = routes.filter((ele) => {
          return ele?.value == value;
        });

        const datas = val.map((ele) => {
          return {
            areaid: ele?.localityid,
            pincode: ele?.pincode,
          };
        });
        // console.log();
        handleSearch(datas[0]);
        setRouteValueData(datas[0]);
        // callhandleOnRouteValue(datas[0])
      } else {
        setSearchData({
          ...searchData,
          [name]: value,
          RouteId: "",
          SelectedBindRoute: searchData.onLoadRoute,
        });
        setRouteValueData({});
        handleSearch(false);
      }
    }

    if (name === "Pincode") {
      return;
    }

    if (name === "Landmark" || name === "Email" || name === "Address") {
      setSearchData({
        ...searchData,
        [name]: value,
      });
    }

    if (name === "DropLocationId") {
      setSearchData({
        ...searchData,
        [name]: value,
      });
    }
  };

  // useEffect(() => {
  //   if (!searchData?.DropLocationId || searchData?.DropLocationId=="") {
  //     dropLocation?.unshift({ label: "Select Drop location", value: "" });
  //   }
  // }, [searchData?.DropLocationId]);

  const callhandleOnRouteValue = (data) => {
    console.log(data);

    if (Object.keys(data).length > 0 && searchData?.RouteId) handleSearch(data);
    else handleSearch(false);
  };

  const FindLabel = (state, id) => {
    const labels = state.filter((ele, _) => {
      return ele.value == id;
    });
    return labels[0].label;
  };
  const getBindRoute = (value) => {
    axios
      .post("/api/v1/CustomerCare/BindRoute", {
        cityid: value,
      })
      .then((res) => {
        const data = res?.data?.message;
        const Routes = data?.map((ele) => {
          return {
            value: ele?.routeid,
            label: ele?.Route,
            localityid: ele?.localityid,
            pincode: ele?.pincode,
          };
        });
        console.log(Routes);
        setRoutes(Routes);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const handleSplit = (id, symbol) => {
    const data = id?.split(symbol);
    return data;
  };

  const getDropLocationDropDown = (name, value, pincode) => {
    axios
      .post("/api/v1/CustomerCare/BindDropLocationOnPageLoad", {
        localityid: value,
      })
      .then((res) => {
        const data = res?.data?.message;
        const DropLocation = data?.map((ele) => {
          return {
            // SelectedPheleboId: ele?.ID,
            value: ele?.centreid,
            label: ele?.centre,
            // Phelebo: ele?.NAME,
            SelectedRouteName: handleSplit(ele?.route, "@")[0],
            SelectedRouteId: handleSplit(ele?.route, "@")[1],
            // SelectedPheleboName: handleSplit(ele?.NAME, " ")[0],
            // SelectedPheleboNumber: handleSplit(ele?.NAME, " ")[1],
            // HolidayDate: ele?.HolidayDate,
            // istemp: ele?.istemp,
            // CentreID: handleSplit(handleSplit(ele?.centreid, "^")[0], "#")[0],
          };
        });
        console.log(name, value);
        console.log(DropLocation);
        setSearchData((searchData) => ({
          ...searchData,
          Pincode: pincode,
          [name]: value,
          DropLocationId: DropLocation[0].value,
          // DropLocationLabel: DropLocation[0].label,
          RouteId: "",
          onLoadRouteId: DropLocation[0].SelectedRouteId,
          onLoadRoute: DropLocation[0].SelectedRouteName,
          SelectedBindRoute: DropLocation[0].SelectedRouteName,
        }));
        setDropLocation(DropLocation);
      })
      .catch((err) => {
        setDropLocation([]);
        setSearchData({
          ...searchData,
          Pincode: pincode,
          [name]: value,
          DropLocationId: "",
          RouteId: "",
          SelectedBindRoute: "",
        });

        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const getPincode = (value, name) => {
    axios
      .post("/api/v1/CustomerCare/BindPinCode", {
        LocalityID: value,
      })
      .then((res) => {
        const data = res?.data?.message;
        const obj = {
          areaid: value,
          pincode: data[0].pincode,
        };

        getDropLocationDropDown(name, value, data[0].pincode);
        handleSearch(obj);
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
        const Localities = data?.map((ele) => {
          return {
            value: ele?.id,
            label: ele?.NAME,
          };
        });

        setLocalities(Localities);
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

            value: handleSplit(ele?.ID, "#")[0],
            label: ele?.City,
          };
        });
        console.log(cities);
        setCities(cities);
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

        setStates(States);
      })
      .catch((err) => {
        toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong");
      });
  };
  const pheleboData = (ele) => {
    console.log(ele);
    axios
      .post("/api/v1/CustomerCare/GetPheleboDetail", {
        PhlebotomistID: ele?.SelectedPheleboId,
      })
      .then((res) => {
        const data = res?.data?.message;

        setPhelebotomistData(data);
        setPheleboProfile(true);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };
  console.log(showPatientData);
  useEffect(() => {
    getStateDropDown();
    getCityDropDown(showPatientData?.StateID);
    getLocalityDropDown(showPatientData?.CityID);
    getDropLocationDropDown(
      "LocalityID",
      showPatientData?.LocalityID,
      showPatientData?.Pincode
    );
    getBindRoute(showPatientData?.CityID);
  }, []);

  return (
    <>
      {notBookedShow && (
        <AppointmentNotBookedModal
          showPatientData={showPatientData}
          notBookedShow={notBookedShow}
          handleNotBookedClose={handleNotBookedClose}
          handleCloseAppoint={handleCloseAppoint}
        />
      )}
      {appointment && (
        <DoAppointmentModal
          selectedPhelebo={selectedPhelebo}
          routeValueData={routeValueData}
          callhandleOnRouteValue={callhandleOnRouteValue}
          appointment={appointment}
          handleAppointment={handleAppointment}
        />
      )}
      {pheleboProfile && (
        <PhelebotomistDetailModal
          phelebotomistData={phelebotomistData}
          pheleboProfile={pheleboProfile}
          handlePheleboDetailClose={handlePheleboDetailClose}
        />
      )}

      <Modal show={appointShow} id="ModalSizeHC">
        <div
          style={{
            maxHeight: "550px",
            overflowY: "auto",
            backgroundColor: "white",
          }}
        >
          <Modal.Header
            className="modal-header"
            style={{ position: "sticky", zIndex: 1055, top: 0 }}
          >
            <Modal.Title className="modal-title">
              {t("Appointment")}
            </Modal.Title>

            <button
              type="button"
              className="close"
              onClick={handleCloseAppoint}
            >
              ×
            </button>
          </Modal.Header>
          <Modal.Body>
            <div className="box">
              <div className="box-body">
                <div className="row">
                  <div className="col-sm-12 col-md-4">
                    <label htmlFor="UHID">{t("UHID")} : &nbsp;</label>
                    {showPatientData.Patientid}
                  </div>

                  <div className="col-sm-12 col-md-5">
                    <label htmlFor="Patient Name" style={{ textAlign: "end" }}>
                      {t("Patient Name")} : &nbsp;
                    </label>
                    {showPatientData.NAME}
                  </div>

                  <div className="col-sm-12 col-md-3">
                    <label htmlFor="Age" style={{ textAlign: "end" }}>
                      {t("Age")} : &nbsp;
                    </label>
                    {showPatientData.Age}
                  </div>
                </div>

                <div className="row">
                  <div className="col-sm-12 col-md-4">
                    <label htmlFor="DOB">{t("DOB")} &nbsp;:&nbsp;</label>
                    {moment(showPatientData.DOB).format("DD-MMM-YYYY")}
                  </div>

                  <div className="col-sm-12 col-md-5">
                    <label htmlFor="Gender">{t("Gender")} : &nbsp;</label>
                    {showPatientData.Gender}
                  </div>

                  <div className="col-sm-12 col-md-3">
                    <label htmlFor="Mobile" style={{ textAlign: "end" }}>
                      {t("Mobile")} : &nbsp;
                    </label>
                    {showPatientData.Mobile}
                  </div>
                </div>
                {/* </div> */}

                {/* <div className="box-body"> */}
                <div className="row" style={{ backgroundColor: "skyblue" }}>
                  <label className="col-sm-12  col-md-2" htmlFor="Address">
                    {t("Address ")} :-
                  </label>

                  <div className="col-md-3">
                    <SimpleCheckbox
                      name="Update Address"
                      type="checkbox"
                      checked={updateAddressDisable}
                      onChange={() => {
                        setUpdateAddressDisable((prev) => !prev);
                      }}
                    />
                    &nbsp;
                    <label htmlFor="Update Address" className="control-label">
                      {t("Update Address")}
                    </label>
                  </div>
                  <div className="col-md-7">
                    <SimpleCheckbox
                      name="Home Collection Address Same As Permanent Address"
                      type="checkbox"
                      checked={true}
                      disabled={true}
                    />
                    &nbsp;
                    <label
                      htmlFor="Home Collection Address Same As Permanent Address"
                      className="control-label"
                    >
                      {t("Home Collection Address Same As Permanent Address")}
                    </label>
                  </div>
                </div>
                {/* </div>

              <div className="box-body"> */}
                <div className="row">
                  <label className="col-sm-12 col-md-1" htmlFor="Address">
                    {t("Address ")} :
                  </label>

                  <div className="col-sm-12 col-md-2">
                    <Input
                      className="select-input-box form-control input-sm"
                      autoComplete="off"
                      type="text"
                      name="Address"
                      max={30}
                      value={searchData.Address}
                      onChange={handleChange}
                      disabled={updateAddressDisable ? false : true}
                    />
                    {searchData?.Address.trim().length > 0 &&
                      searchData?.Address.trim().length < 3 && (
                        <span className="golbal-Error">{errors?.Address}</span>
                      )}
                  </div>

                  <label
                    className="col-sm-12  col-md-1"
                    htmlFor="State"
                    // style={{ textAlign: "end" }}
                  >
                    {t("State")}&nbsp;&nbsp; :&nbsp;
                  </label>
                  <div className="col-sm-12 col-md-2">
                    <SelectBox
                      name="StateID"
                      className="input-sm"
                      options={[
                        { label: "Select State", value: "" },
                        ...states,
                      ]}
                      onChange={handleChange}
                      selectedValue={searchData.StateID}
                      isDisabled={updateAddressDisable ? false : true}
                    />

                    {searchData.StateID === "" && (
                      <span className="golbal-Error">{errors?.StateID}</span>
                    )}
                  </div>

                  <label
                    className="col-sm-12  col-md-1"
                    htmlFor="City"
                    // style={{ textAlign: "end" }}
                  >
                    {t("City")} &nbsp;&nbsp;: &nbsp;
                  </label>

                  <div className="col-sm-12 col-md-2">
                    <SelectBox
                      name="CityID"
                      className="input-sm"
                      options={[{ label: "Select City", value: "" }, ...cities]}
                      onChange={handleChange}
                      selectedValue={searchData.CityID}
                      isDisabled={updateAddressDisable ? false : true}
                    />

                    {searchData.CityID === "" && (
                      <span className="golbal-Error">{errors?.CityID}</span>
                    )}
                  </div>

                  <label className="col-sm-12  col-md-1" htmlFor="Area">
                    {t("Area")}&nbsp; :&nbsp;
                  </label>
                  <div className="col-sm-12 col-md-2">
                    <SelectBox
                      name="LocalityID"
                      options={[
                        { label: "Select Locality", value: "" },
                        ...localities,
                      ]}
                      selectedValue={searchData.LocalityID}
                      onChange={handleChange}
                      className="input-sm"
                      isDisabled={updateAddressDisable ? false : true}
                    />
                    {searchData.LocalityID === "" && (
                      <span className="golbal-Error">{errors?.LocalityID}</span>
                    )}
                  </div>
                </div>

                <div className="row">
                  <label
                    className="col-sm-12 col-md-1"
                    htmlFor="Pincode"
                    // style={{ textAlign: "end" }}
                  >
                    {t("Pincode ")} :
                  </label>

                  <div className="col-sm-12 col-md-2">
                    <Input
                      className="select-input-box form-control input-sm"
                      type="text"
                      name="Pincode"
                      value={searchData.Pincode}
                      onChange={handleChange}
                      disabled={updateAddressDisable ? false : true}
                    />
                  </div>
                  <label className="col-sm-12 col-md-1" htmlFor="Landmark">
                    {t("Landmark")} :
                  </label>
                  <div className="col-sm-12 col-md-2">
                    <Input
                      className="select-input-box form-control input-sm"
                      type="text"
                      name="Landmark"
                      max={30}
                      onChange={handleChange}
                      value={searchData.Landmark}
                      disabled={updateAddressDisable ? false : true}
                    />
                    {searchData?.Landmark.trim().length > 0 &&
                      searchData?.Landmark.trim().length < 3 && (
                        <span className="golbal-Error">{errors?.Landmark}</span>
                      )}
                  </div>

                  <label
                    className="col-sm-12 col-md-1"
                    htmlFor="Email"
                    // style={{ textAlign: "end" }}
                  >
                    {t("Email ")} &nbsp;:
                  </label>
                  <div className="col-sm-12 col-md-2">
                    <Input
                      className="select-input-box form-control input-sm"
                      type="email"
                      name="Email"
                      max={30}
                      onChange={handleChange}
                      value={searchData.Email}
                      disabled={updateAddressDisable ? false : true}
                    />

                    {searchData?.Email.trim().length > 0 &&
                      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
                        searchData?.Email
                      ) && (
                        <span className="golbal-Error">
                          {errors?.Emailvalid}
                        </span>
                      )}
                  </div>

                  <div
                    className="col-md-3 col-sm-6 col-xs-12"
                    style={{ textAlign: "end" }}
                  >
                    <button
                      type="button"
                      className="btn btn-warning btn-sm"
                      onClick={() => setNotBookedShow(true)}
                    >
                      {t("Appointment Not Booked")}
                    </button>
                  </div>
                </div>

                {/* </div> */}
                {/* <hr></hr> */}

                {/* <div className="box-body"> */}
                <div className="row">
                  <label
                    className="col-sm-12 col-md-1"
                    htmlFor="Appointment Date"
                  >
                    {t("App. Date")} &nbsp;:
                  </label>

                  <div className="col-sm-12 col-md-2">
                    <DatePicker
                      name="AppointmentDate"
                      className="select-input-box form-control input-sm required"
                      date={searchData.AppointmentDate}
                      minDate={new Date()}
                      maxDate={
                        new Date(new Date().getTime() + 6 * 24 * 60 * 60 * 1000)
                      }
                      onChange={dateSelect}
                    ></DatePicker>
                  </div>

                  <label
                    className="col-sm-12 col-md-1"
                    htmlFor="Drop Location (Centre)"
                  >
                    {t("Droplocation")}:
                  </label>
                  <div className="col-sm-12 col-md-2">
                    <SelectBox
                      name="DropLocationId"
                      // options={[
                      //   { label: "Pick DropLocation", value: "" },
                      //   ...dropLocation,
                      // ]}

                      options={dropLocation}
                      onChange={handleChange}
                      className="input-sm"
                      selectedValue={searchData.DropLocationId}
                    />

                    {/* {searchData.DropLocationId === "" && (
                    <span className="golbal-Error">
                      {errors?.DropLocationId}
                    </span>
                  )} */}
                  </div>

                  <label htmlFor="Route" className="col-md-1">
                    {t("Route")} : &nbsp;
                  </label>
                  <div className="col-md-2">
                    {console.log(searchData?.SelectedBindRoute)}
                    {searchData?.SelectedBindRoute}
                  </div>
                  <div className="col-md-1"></div>
                  <div className="col-sm-12 col-md-2">
                    <SelectBox
                      name="RouteId"
                      options={[
                        { label: "Change Route", value: "" },
                        ...routes,
                      ]}
                      onChange={handleChange}
                      className="input-sm"
                      selectedValue={searchData.RouteId}
                    />
                  </div>
                </div>
              </div>
              <div className="box-body">
                <div className="row">
                  <div
                    className="col-md-12 col-sm-12"
                    style={{ display: "flex", justifyContent: "center" }}
                  >
                    <button
                      type="button"
                      className="btn  btn-success btn-sm"
                      onClick={() => {
                        handleSearch(false);
                      }}
                    >
                      &nbsp;{t("Search Slot")}
                    </button>
                  </div>
                </div>
              </div>
              {/* <hr></hr> */}
              {/* <div className="box-body">
                <div className="row" style={{ backgroundColor: "skyblue" }}>
                  <label
                    className="col-sm-12 col-md-5"
                    htmlFor="Selected Patient Pending"
                    style={{ marginTop: "6px" }}
                  >
                    <span
                      style={{
                        backgroundColor: "#5694dc",
                        marginTop: "2px",
                        height: "12px",
                        border: "1px solid",
                      }}
                    >
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                    &nbsp;
                    {t("Selected Patient Pending")}
                  </label>

                  <label
                    className="col-sm-12 col-md-4"
                    htmlFor="Other Patient Pending"
                    style={{ marginTop: "6px" }}
                  >
                    <span
                      style={{
                        backgroundColor: "darkgray",
                        border: "1px solid",
                        marginTop: "2px",
                        height: "12px",
                      }}
                    >
                    
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                    &nbsp;
                    {t("Other Patient Pending")}
                  </label>
                  <label
                    className="col-sm-12 col-md-3"
                    htmlFor="Completed"
                    style={{ marginTop: "6px" }}
                  >
                    <span
                      style={{
                        backgroundColor: "lightgreen",
                        border: "1px solid",
                        marginTop: "2px",
                        height: "12px",
                      }}
                    >
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </span>
                    &nbsp;
                    {t("Completed")}
                  </label>
                </div>
              </div> */}
              {load ? (
                <Loading />
              ) : showPhelebo.length > 0 ? (
                <div className="box-body">
                  <div className="row" style={{ overflowX: "auto" }}>
                    <table
                      className="table table-bordered table-hover table-striped table-responsive tbRecord"
                      cellPadding="{0}"
                      cellSpacing="{0}"
                    >
                      <thead
                        className="cf text-center"
                        style={{ height: "25px", fontSize: "12px" }}
                      >
                        <tr>
                          <th className="text-center">
                            {t("Phelebotomist Name")}
                          </th>

                          {showPhelebo[0]?.SlotArray?.map((ele, index) => (
                            <th key={index}>
                              <div
                                style={{
                                  display: "flex",
                                  justifyContent: "space-around",
                                }}
                              >
                                {ele.map((time) => (
                                  <>
                                    <th
                                      className="text-center"
                                      style={{
                                        textAlign: "center",
                                      }}
                                    >
                                      {time}
                                    </th>
                                  </>
                                ))}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody style={{ height: "25px", fontSize: "13px" }}>
                        {showPhelebo.map((ele, index) => (
                          <tr key={index}>
                            <td
                              onClick={() => pheleboData(ele)}
                              style={{ cursor: "pointer" }}
                              className="text-center hcStatus"
                            >
                              <label style={{ cursor: "pointer" }}>
                                {ele.PheleboName}
                              </label>
                              <br />
                              <label style={{ cursor: "pointer" }}>
                                {ele.PheleboNumber}
                              </label>
                            </td>
                            {ele?.SlotArray?.map((slotArray, slotIndex) => (
                              <td
                                className="PheloMapTable text-center "
                                key={slotIndex}
                                onClick={() => {
                                  const matches = getPatientDetailOnSlot.filter(
                                    (patient) =>
                                      patient.phlebotomistid ===
                                        ele.SelectedPheleboId &&
                                      slotArray.includes(patient.apptime)
                                  );

                                  DoAppointment(
                                    matches.length,
                                    slotArray[0],
                                    ele
                                  );
                                }}
                              >
                                <div className="phelebo_Drop">
                                  {getPatientDetailOnSlot.map(
                                    (patient, patientIndex) => (
                                      <>
                                        {patient.phlebotomistid ===
                                          ele.SelectedPheleboId &&
                                        slotArray.includes(patient.apptime) ? (
                                          <>
                                            <div key={patientIndex}>
                                              <div
                                                style={{
                                                  backgroundColor: "white",
                                                  fontWeight: "bold",
                                                  padding: "2px",
                                                  border: "1px solid grey",
                                                  margin: "2px",
                                                  borderRadius: "10px",
                                                  fontSize: "12px",
                                                }}
                                                onMouseEnter={() => {
                                                  setMouseHover({
                                                    index: patientIndex,
                                                    data: [],
                                                  });
                                                }}
                                                onMouseLeave={() => {
                                                  setMouseHover({
                                                    index: -1,
                                                    data: [],
                                                  });
                                                }}
                                              >
                                                <p>{patient.pname}</p>

                                                <p>{patient.City}</p>

                                                <p>Rs. {patient.netAmount}</p>
                                              </div>
                                              {mouseHover?.index ===
                                                patientIndex &&
                                                getPatientDetailOnSlot.length >
                                                  0 && (
                                                  <span
                                                    style={{
                                                      position: "absolute",
                                                      width: "120px",
                                                      // fontWeight: "bold",
                                                      left: "500px",
                                                      // right:"350px",
                                                      fontFamily: "arial",
                                                      height: "auto",
                                                      fontSize: "10px",
                                                      padding: "4px",
                                                      border: "1px solid",
                                                      backgroundColor: "white",
                                                    }}
                                                  >
                                                    <span>
                                                      Prebooking Id:
                                                      {patient?.PreBookingID}
                                                    </span>
                                                    <br></br>
                                                    <span>
                                                      Address:
                                                      {patient?.Address}
                                                    </span>
                                                    <br></br>
                                                    <span>
                                                      Mobile: {patient?.Mobile}
                                                    </span>
                                                    <br></br>
                                                    <span>
                                                      IsVIP: {patient?.isVip}
                                                    </span>
                                                    <br></br>
                                                    <span>
                                                      HardCopyRequired:
                                                      {
                                                        patient?.HardCopyRequired
                                                      }
                                                    </span>
                                                    <br></br>
                                                    <span>
                                                      NetAmount:
                                                      {patient?.netAmount}
                                                    </span>
                                                  </span>
                                                )}
                                            </div>
                                          </>
                                        ) : (
                                          <></>
                                        )}
                                      </>
                                    )
                                  )}
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="boxbody">
                  <div style={{ height: "150px" }}></div>
                </div>
              )}
            </div>
          </Modal.Body>
        </div>
        <Modal.Footer>
          <div className="box"></div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AppointmentModal;
