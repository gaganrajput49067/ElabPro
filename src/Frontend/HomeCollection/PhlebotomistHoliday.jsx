import React from "react";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import ExportFile from "../Master/ExportFile";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import moment from "moment";
import { PhelboSaveHolidayValidationSchema } from "../../ChildComponents/validations";
import { PhelboSearchHolidayValidationSchema } from "../../ChildComponents/validations";
import { SelectBox } from "../../ChildComponents/SelectBox";
import Loading from "../util/Loading";
import DatePicker from "../Components/DatePicker";

const PhlebotomistHoliday = () => {
  const [loading, setLoading] = useState(false); // This state is used for setting loading screen
  const [errors, setErros] = useState({}); // This state is used for setting errors
  const [states, setStates] = useState([]); // This state is used for setting states
  const [cities, setCities] = useState([]); // This state is used for setting cities
  const [list, setlist] = useState([]); // setting phelbo based on cities
  const [phleboTable, setPhleboTable] = useState(null); // setting phelbo table after search
  const initialState = {
    StateId: "",
    CityId: "",
    Phlebotomist: "",
    FromDate: new Date(),
    ToDate: new Date(),
    status: "Active",
  }; // for phelbo holiday setting initial state not a state
  const [phleboHoliday, setphleboHoliday] = useState(initialState); // for phelbo holiday details
  const [searchData, setSearchData] = useState({
    NoOfRecord: 50,
    fromDate: new Date(),
    toDate: new Date(),
  }); // for handling search

  // for trnslation
  const { t } = useTranslation();

  // fetching state
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
        console.log(data);
        setStates(value);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  // fetching cities based on state
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

  // fetching phelbo based on city
  const fetchphelbo = (value) => {
    axios
      .post("api/v1/PhelebotomistMaster/BindPhelebo", {
        CityId: value,
      })
      .then((res) => {
        let data = res.data.message;
        let value = data.map((ele) => {
          return {
            value: ele.PhlebotomistId,
            label: ele.NAME,
          };
        });
        setlist(value);
      })
      .catch((err) => {
        console.log(err);
        setlist([]);
      });
  };

  //used for spliting cityid because cityid comes in diffrent formate
  const handleSplitData = (id) => {
    const data = id.split("#")[0];
    return data;
  };

  // fething states on first render
  useEffect(() => {
    fetchStates();
  }, []);

  // options for no of records to search
  const recordoptions = [
    { label: "50", value: "50" },
    { label: "100", value: "100" },
    { label: "200", value: "200" },
    { label: "500", value: "500" },
    { label: "1000", value: "1000" },
    { label: "2000", value: "2000" },
  ];

  // dynamically setting data value in state
  const dateSelect = (date, name, value) => {
    if (name === "FromDate") {
      const updateDate =
        new Date(phleboHoliday?.ToDate) - date < 0
          ? date
          : phleboHoliday.ToDate;
      setphleboHoliday({ ...phleboHoliday, [name]: date, ToDate: updateDate });
    } else if (name === "ToDate") {
      setphleboHoliday({ ...phleboHoliday, [name]: date });
    } else {
      setphleboHoliday({
        ...phleboHoliday,
        [name]: date,
      });
    }
  };

  // changing formate of date and setting it in state
  const handleSearchChange = (date, name, event) => {
    if (name === "fromDate") {
      const updateDate =
        new Date(phleboHoliday?.ToDate) - date < 0
          ? date
          : phleboHoliday.ToDate;
      const newDate = moment(updateDate).format("DD-MMM-YYYY");
      setSearchData({ ...searchData, [name]: date, toDate: newDate });
    } else if (name === "toDate") {
      setSearchData({ ...searchData, [name]: date });
    } else {
      setSearchData({
        ...searchData,
        [name]: date,
      });
    }
  };

  // dynamically managing selected option in state
  const handleSelectChange = async (event) => {
    const { name, value, checked, type } = event?.target;

    if (name === "StateId" || name === "CityId" || name === "Phlebotomist") {
      if (name === "StateId") {
        fetchCities(value);
        console.log(value);
        setphleboHoliday({
          ...searchData,
          [name]: value,
          CityId: "",
          Phlebotomist: "",
        });
      }
      if (name === "CityId") {
        setphleboHoliday({ ...searchData, [name]: value, Phlebotomist: "" });
        fetchphelbo(value);
      }
      if (name === "Phlebotomist") {
        setphleboHoliday({ ...searchData, [name]: value });
      }
    } else {
      // setphleboHoliday({ ...phleboHoliday, [name]: type === 'checkbox' ? checked : value });
    }
    if (name === "NoOfRecord") {
      setSearchData({
        ...searchData,
        NoOfRecord: value,
      });
    }
  };

  // calling api for canceling phelbo holiday with phelbo id
  const deleteHoliday = (value) => {
    setLoading(true);
    axios
      .post("api/v1/PhelebotomistMaster/CancelPhelboHoliday", {
        HoliDayId: value.toString(),
      })
      .then((res) => {
        if (res.data.message) {
          setLoading(false);
          toast.success("Cancelled successfully");
        }
      })
      .catch((err) => {
        setLoading(false);
        console.log(err);
        toast.error(err?.res?.data ? err?.res?.data : "Something Went wrong");
      });
    setLoading(false);
    searchHoliday();
  };

  // searching all phelbo having holiday within date
  const searchHoliday = async () => {
    const generatedError = PhelboSearchHolidayValidationSchema(searchData);
    setLoading(true);
    if (generatedError === "") {
      await axios
        .post("api/v1/PhelebotomistMaster/GetHolidayData", {
          FromDate: moment(searchData.fromDate).format("DD/MMM/YYYY"),
          ToDate: moment(searchData.toDate).format("DD/MMM/YYYY"),
          NoOfRecord: searchData.NoOfRecord,
        })
        .then((res) => {
          if (res.data.message) {
            setLoading(false);
            setPhleboTable(res.data.message);
            toast.success("Found Details");
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log(err);
          setPhleboTable([]);
          toast.error(err?.res?.data ? err?.res?.data : "No record found");
        });

      setLoading(false);
    }
    setLoading(false);
    setErros(generatedError);
  };

  // saving holiday for phelbo
  const saveHoliday = () => {
    const generatedError = PhelboSaveHolidayValidationSchema(phleboHoliday);
    setLoading(true);
    if (generatedError === "") {
      axios
        .post("api/v1/PhelebotomistMaster/SaveHoliDay", {
          FromDate: moment(phleboHoliday.FromDate).format("DD/MMM/YYYY"),
          ToDate: moment(phleboHoliday.ToDate).format("DD/MMM/YYYY"),
          PhlebotomistId: phleboHoliday.Phlebotomist,
        })
        .then((res) => {
          if (res.data.message) {
            setLoading(false);
            toast.success("Saved successfully");
            //window.location.reload(true);
            setphleboHoliday(initialState);
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

  const handleClear = () => {
    setPhleboTable(null);
  };

  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h3 className="box-title">Phelebotomist Holiday</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("State")}:
            </label>
            <div className="col-sm-2">
              <SelectBox
                className="form-control input-sm"
                name="StateId"
                onChange={handleSelectChange}
                selectedValue={phleboHoliday?.StateId}
                options={[{ label: "Select State", value: "" }, ...states]}
              />
              {phleboHoliday?.StateId === "" && (
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
                selectedValue={phleboHoliday?.CityId}
                options={[{ label: "Select City", value: "" }, ...cities]}
              />
              {phleboHoliday?.CityId === "" && (
                <span className="golbal-Error">{errors?.CityId}</span>
              )}
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Phlebotomist")}:
            </label>
            <div className="col-sm-2">
              <SelectBox
                className="form-control input-sm"
                name="Phlebotomist"
                onChange={handleSelectChange}
                selectedValue={phleboHoliday?.Phlebotomist}
                options={[{ label: "Select ", value: "" }, ...list]}
              />
              {phleboHoliday?.Phlebotomist === "" && (
                <span className="golbal-Error">{errors?.Phlebotomist}</span>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("From Date")}:
            </label>
            <div className="col-sm-2">
              <DatePicker
                className="form-control input-sm"
                name="FromDate"
                date={
                  phleboHoliday?.FromDate
                    ? new Date(phleboHoliday?.FromDate)
                    : new Date()
                }
                onChange={dateSelect}
                minDate={new Date()}
              />
              {phleboHoliday?.FromDate === "" && (
                <span className="golbal-Error">{errors?.FromDate}</span>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("To Date")}:
            </label>
            <div className="col-sm-2">
              <DatePicker
                className="form-control input-sm"
                name="ToDate"
                date={
                  phleboHoliday?.ToDate
                    ? new Date(phleboHoliday?.ToDate)
                    : new Date()
                }
                minDate={phleboHoliday?.FromDate}
                onChange={dateSelect}
              />
              {phleboHoliday?.ToDate === "" && (
                <span className="golbal-Error">{errors?.ToDate}</span>
              )}
            </div>
            <div className="col-sm-1 col-xs-12">
              <button
                type="button"
                className="btn btn-block btn-info btn-sm"
                onClick={saveHoliday}
              >
                {t("Save")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="box form-horizontal">
        <div className="box-body form-horizontal">
          <div className="row ">
            <label
              className="col-sm-1"
              htmlFor="No Of Records"
              style={{
                display: "flex",
                justifyContent: "end",
                alignItems: "center",
                height: "28px",
              }}
            >
              {t("No Of Records")}:
            </label>
            <div className="col-sm-2">
              <SelectBox
                options={recordoptions}
                name="NoOfRecord"
                selectedValue={searchData?.NoOfRecord}
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("From Date")}:
            </label>
            <div className="col-sm-2">
              <DatePicker
                className="form-control input-sm"
                name="fromDate"
                date={
                  searchData?.fromDate
                    ? new Date(searchData?.fromDate)
                    : new Date()
                }
                onChange={handleSearchChange}
                //maxDate={searchData?.toDate}
              />
              {searchData?.fromDate === "" && (
                <span className="golbal-Error">{errors?.fromDate}</span>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("To Date")}:
            </label>
            <div className="col-sm-2">
              <DatePicker
                className="form-control input-sm"
                name="toDate"
                date={
                  searchData?.toDate ? new Date(searchData?.toDate) : new Date()
                }
                minDate={searchData?.fromDate}
                onChange={handleSearchChange}
              />
              {searchData?.toDate === "" && (
                <span className="golbal-Error">{errors?.toDate}</span>
              )}
            </div>
            <div className="col-sm-1">
              <button
                type="Search"
                className="btn btn-block btn-info btn-sm"
                onClick={searchHoliday}
              >
                {t("Search")}
              </button>
            </div>
            <div className="col-sm-1">
              {phleboTable ? (
                <ExportFile dataExcel={phleboTable} />
              ) : (
                <button className="btn btn-block btn-sm">Download</button>
              )}
            </div>
          </div>

          {phleboTable && (
            <div
              className="box-body divResult boottable table-responsive"
              id="no-more-tables"
            >
              <div className="row">
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf text-center" style={{ zIndex: 99 }}>
                    <tr>
                      <th className="text-center">{t("#")}</th>
                      <th className="text-center">{t("Cancel")}</th>
                      <th className="text-center">{t("Phlebotomist")}</th>
                      <th className="text-center">{t("From Date")}</th>
                      <th className="text-center">{t("To Date")}</th>
                      <th className="text-center">{t("Status")}</th>
                    </tr>
                  </thead>
                  {loading ? (
                    <td colSpan={6}>{<Loading />}</td>
                  ) : (
                    <tbody>
                      {phleboTable &&
                        phleboTable.map((ele, index) => (
                          <>
                            <tr key={index}>
                              <td data-title="#" className="text-center">
                                {index + 1}
                              </td>
                              <td data-title="Cancel" className="text-center">
                                <button
                                  className="btn  btn-info btn-sm"
                                  onClick={() => deleteHoliday(ele.id)}
                                >
                                  Cancel
                                </button>
                              </td>
                              <td
                                data-title="Phlebotomist"
                                className="text-center"
                              >
                                {ele.Name}&nbsp;
                              </td>
                              <td data-title="FromDate" className="text-center">
                                {ele.FromDate}&nbsp;
                              </td>
                              <td data-title="ToDate" className="text-center">
                                {ele.ToDate}&nbsp;
                              </td>
                              <td data-title="status" className="text-center">
                                {ele.STATUS}&nbsp;
                              </td>
                            </tr>
                          </>
                        ))}
                    </tbody>
                  )}
                </table>
              </div>
              <div
                className="row"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div className="col-sm-1">
                  <button
                    type="Search"
                    className="btn btn-block btn-danger btn-sm"
                    onClick={handleClear}
                  >
                    {t("Clear")}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PhlebotomistHoliday;
