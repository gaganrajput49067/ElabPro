import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  getAccessCentres,
  getDepartment,
  isChecked,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";
import { number } from "../../Frontend/util/Commonservices/number";

//i18n import start
import { useTranslation } from "react-i18next";
import { CONSTANTTIME } from "../../ChildComponents/Constants";
const LANG_LOCAL_STORAGE_KEY = "selectedLanguage";
//i18n import end

function ManageDeliveryDays() {
  const [CentreID, setCentreID] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [load, setLoad] = useState({
    searchLoad: false,
    saveLoad: false,
  });
  const [TimeZone, setTimeZone] = useState([]);
  const [ProcessingType, setProcessingType] = useState([]);
  const [TATType, setTATType] = useState([]);
  const [tableData, setTableData] = useState([]);

  const [state, setState] = useState({
    searchText: "",
    centreId: "",
    departmentId: "",
  });

  // i18n start
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem(LANG_LOCAL_STORAGE_KEY) || "en"
  );
  const { t, i18n } = useTranslation();
  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
  }, [selectedLanguage, i18n]);
  // i18n end

  const getAccessCentres = () => {
    axios
      .get("/api/v1/Centre/getAccessCentres")
      .then((res) => {
        let data = res.data.message;
        console.log(data);
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        CentreDataValue.unshift({ label: "Centre", value: "" });
        setCentreID(CentreDataValue);
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.sessionStorage.clear();
          window.location.href = "/login";
        }
      });
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleChangeMain = (e, index, names) => {
    debugger;
    const { value, name, checked, type } = e.target;
    if (index >= 0) {
      const data = [...tableData];

      if (names) {
        data[index][names] = value;
      } else {
        data[index][name] = type === "checkbox" ? checked : value;
      }

      setTableData(data);
    } else {
      const data = tableData.map((ele) => {
        debugger;
        return {
          ...ele,
          [name]: type === "checkbox" ? checked : value,
        };
      });

      setTableData(data);
    }
  };

  const handleWeekDays = (name, value, index) => {
    const data = [...tableData];
    data[index][name] = value === "0" ? "1" : "0";
    setTableData(data);
  };

  const fetch = () => {
    setLoad({ ...load, searchLoad: true });
    axios
      // rahul
      .post("/api/v1/ManageDeliveryDays/getDeliveryDays", {
        ...state,
        searchText: state?.searchText.trim(),
      })
      .then((res) => {
        setLoad({ ...load, searchLoad: false });
        const data = res.data.message;
        const val = data.map((ele) => {
          if (ele.TATType === "") {
            return {
              ...ele,
              TATType: "Hours",
              isChecked: false,
              centreId: "",
              allCentres: "",
              //remove

            };
          } else {
            return {
              ...ele,
              isChecked: false,
              centreId: "",
              allCentres: "",

            };
          }
        });
        setTableData(val);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setLoad({ ...load, searchLoad: false });
      });
  };

  // const validations = (data) => {
  //   console.log(data);
  //   let err = "";
  //   for (var i = 0; i < data.length; i++) {
  //     if (data[i].TATType === "Hours") {
  //       if (data[i].MorningHours === "") {
  //         err = "Please Enter Morning Hours !";
  //         break;
  //       }
  //     }
  //   }

  //   for (var i = 0; i < data.length; i++) {
  //     if (data[i].TATType === "Hours") {
  //       if (data[i].EveningHours === "") {
  //         err = "Please Enter EveningHours !";
  //       }
  //       break;
  //     }
  //   }

  //   for (var i = 0; i < data.length; i++) {
  //     if (data[i].TATType === "DAYS") {
  //       if (data[i].processDays === "") {
  //         err = "Please Enter processDays !";
  //         break;
  //       }
  //     }
  //   }
  //   return err;
  // };

  const handleSubmit = () => {
    const find = tableData.filter((ele) => ele?.isChecked === true);
    const data = find.map((ele) => {
      if (!ele?.allCentres) {
        return { ...ele, centreId: state?.centreId };
      } else {
        return {
          ...ele,
          centreId: "0",
          allCentres: "1",
        };
      }
    });

    if (data?.length > 0) {
      setLoad({ ...load, saveLoad: true });
      axios
        .post("/api/v1/ManageDeliveryDays/SaveManageDeliveryDays", {
          deliveryCollectionList: data,
        })
        .then((res) => {
          toast.success(res.data.message);
          setLoad({ ...load, saveLoad: false });
          setTableData([]);
          setState({
            searchText: "",
            centreId: "",
            departmentId: "",
          });
        })
        .catch((err) => {
          setLoad({ ...load, saveLoad: false });
          console.log(err);
        });
    } else {
      toast.error("Please Select One Value");
    }
  };

  useEffect(() => {
    if (state?.searchText !== "") {
      fetch();
    }
  }, [state?.searchText]);

  useEffect(() => {
    getAccessCentres();
    getDepartment(setDepartment);
    getTimeDropdown("TimeZone", setTimeZone);
    getTimeDropdown("ProcessingType", setProcessingType);
    getTimeDropdown("TATType", setTATType);
  }, []);

  const getTimeDropdown = (type, state) => {
    axios
      .post("/api/v1/Global/GetGlobalData", {
        Type: type,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            label: ele?.FieldDisplay,
            value: ele?.FieldDisplay,
          };
        });
        state(val);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <div className="clearfix">
            <h3 className="box-title">{t("Manage Delivery Days")}</h3>
          </div>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("Search Criteria Centre")}:</label>
            <div className="col-sm-2 ">
              <SelectBox
                options={CentreID}
                name="centreId"
                selectedValue={state?.centreId}
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-1">{t("DepartmentList")}:</label>
            <div className="col-sm-2 ">
              <SelectBox
                options={[
                  { label: "Select Department", value: "" },
                  ...Department,
                ]}
                name="departmentId"
                onChange={handleSelectChange}
                selectedValue={state?.departmentId}
              />
            </div>
            <label className="col-sm-1">{t("TestName or TestCode")}:</label>
            <div className="col-sm-2 ">
              <Input
                type="text"
                className="form-control ui-autocomplete-input input-sm"
                placeholder={"SearchText"}
                name="searchText"
                value={state?.searchText}
                onChange={handleChange}
              />
            </div>

            {/* <div className="row"> */}
            <div className="col-sm-1">
              {load.searchLoad ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-block btn-info btn-sm"
                  onClick={fetch}
                >
                  {t("Search")}
                </button>
              )}
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>
      <div className="box mb-4">
        <div
        // className={`card-body ${
        //   tableData.length > 8 ? "boottable" : ""
        // } table-responsive`}
        >
          <div
            className=" box-body divResult table-responsive mt-4"
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
                  <th>
                    {t("Lab Start Time")}
                    <br></br>
                    <SelectBox
                      options={TimeZone}
                      name="startTime"
                      onChange={(e) => handleChangeMain(e)}
                    />
                  </th>
                  <th>
                    {t("Lab End Time")}
                    <br></br>
                    <SelectBox
                      options={TimeZone}
                      name="endTime"
                      onChange={(e) => handleChangeMain(e)}
                    />
                  </th>
                  <th>{t("Test Name")}</th>
                  <th>{t("Process Type")}</th>
                  <th>{t("TATType")}</th>
                  <th>{t("Working Hours")}</th>
                  <th>{t("Non Working Hours")}</th>
                  <th>
                    {t("Days")}
                    <Input name="Days" onChange={(e) => handleChangeMain(e)} />
                  </th>
                  <th style={{ width: "25%" }}>
                    {t("Weekdays")}
                    <br></br>
                    {t("S M T W T F S")}
                  </th>
                  <th>
                    {t("CutoffTime")}
                    <SelectBox
                      options={TimeZone}
                      name="CutOffTime"
                      onChange={(e) => handleChangeMain(e)}
                    />
                  </th>
                  <th>
                    {t("Same Day delivery Time")}
                    <SelectBox
                      options={TimeZone}
                      name="samedaydeliverytime"
                      onChange={(e) => handleChangeMain(e)}
                    />
                  </th>

                  <th style={{ width: "10%" }}>
                    {t("Next Day delivery Time")}

                    <SelectBox
                      options={TimeZone}
                      name="nextdaydeliverytime"
                      onChange={(e) => handleChangeMain(e)}
                    />
                  </th>

                  <th>Approval To Dispatch</th>
                  <th>
                    {t("Action")}
                    <br></br>
                    <Input
                      type="checkbox"
                      checked={
                        tableData?.length > 0
                          ? isChecked("isChecked", tableData, true).includes(
                            false
                          )
                            ? false
                            : true
                          : false
                      }
                      name="isChecked"
                      onChange={(e) => handleChangeMain(e)}
                    />
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((data, index) => (
                  <tr key={index}>
                    <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                    <td>
                      <SelectBox
                        options={TimeZone}
                        selectedValue={data?.startTime}
                        name="startTime"
                        onChange={(e) => handleChangeMain(e, index)}
                      />
                    </td>
                    <td>
                      <SelectBox
                        options={TimeZone}
                        selectedValue={data?.endTime}
                        name="endTime"
                        onChange={(e) => handleChangeMain(e, index)}
                      />
                    </td>

                    <td data-title={t("Item Name")}>{data?.itemName}&nbsp;</td>
                    <td>
                      <SelectBox
                        options={ProcessingType}
                        name="ProcessingType"
                        selectedValue={data?.ProcessingType}
                        isDisabled={true}
                        onChange={(e) => handleChangeMain(e, index)}
                      />
                    </td>
                    <td>
                      <SelectBox
                        options={TATType}
                        name="TATType"
                        selectedValue={data?.TATType}
                        onChange={(e) => handleChangeMain(e, index)}
                      />
                    </td>
                    <td>
                      <Input
                        type="number"
                        disabled={data?.TATType === "Hours" ? false : true}
                        name="woringhours"
                        value={data?.woringhours}
                      
                        MaxNumber={"24"}
                        min={"0"}
                        onChange={(e) => handleChangeMain(e, index)}
                      />
                    </td>
                    <td>
                      <Input
                       type="number"
                        disabled={data?.TATType === "Hours" ? false : true}
                        name="nonworinghours"
                        value={data?.nonworinghours}
                        MaxNumber={"24"}
                        min={"0"}
                        onChange={(e) => handleChangeMain(e, index)}
                      />
                    </td>
                    <td>
                      <Input
                        disabled={data?.TATType === "Hours" ? true : false}
                        name="Days"
                        value={data?.Days}
                        onChange={(e) => handleChangeMain(e, index)}
                      />
                    </td>

                    <td data-title={t("Week Days")}>
                      {
                        data?.TATType === "Days" &&

                        <div className="weekDays-selector" data-title="Week Days">
                          <Input
                            type="checkbox"
                            name="Mon"
                            className="weekday weekday-mon weekdayLabel"
                          />
                          <label
                            className={data?.Mon === "1" && "checkedWeekday"}
                            onClick={() =>
                              handleWeekDays("Mon", data?.Mon, index)
                            }
                          >
                            {t("Mon")}
                          </label>
                          <Input
                            type="checkbox"
                            className="weekday weekday-tue weekdayLabel"
                          />
                          <label
                            className={data?.Tue === "1" && "checkedWeekday"}
                            onClick={() =>
                              handleWeekDays("Tue", data?.Tue, index)
                            }
                          >
                            {t("Tue")}
                          </label>
                          <Input
                            type="checkbox"
                            className="weekday weekday-wed weekdayLabel"
                          />
                          <label
                            className={data?.Wed === "1" && "checkedWeekday"}
                            onClick={() =>
                              handleWeekDays("Wed", data?.Wed, index)
                            }
                          >
                            {t("Wed")}
                          </label>
                          <Input
                            type="checkbox"
                            className="weekday weekday-thu weekdayLabel"
                          />
                          <label
                            className={data?.Thu === "1" && "checkedWeekday"}
                            onClick={() =>
                              handleWeekDays("Thu", data?.Thu, index)
                            }
                          >
                            {t("Thu")}
                          </label>
                          <Input
                            type="checkbox"
                            className="weekday weekday-fri weekdayLabel"
                          />
                          <label
                            className={data?.Fri === "1" && "checkedWeekday"}
                            onClick={() =>
                              handleWeekDays("Fri", data?.Fri, index)
                            }
                          >
                            {t("Fri")}
                          </label>
                          <Input
                            type="checkbox"
                            className="weekday weekday-sat weekdayLabel"
                          />
                          <label
                            className={data?.Sat === "1" && "checkedWeekday"}
                            onClick={() =>
                              handleWeekDays("Sat", data?.Sat, index)
                            }
                          >
                            {t("Sat")}
                          </label>
                          <Input
                            type="checkbox"
                            id="weekday-sun"
                            checked="checked"
                            className="weekday weekday-sun weekdayLabel"
                          />
                          <label
                            className={data?.Sun === "1" && "checkedWeekday"}
                            onClick={() =>
                              handleWeekDays("Sun", data?.Sun, index)
                            }
                          >
                            {t("Sun")}
                          </label>
                        </div>
                      }
                    </td>
                    <td data-title={t("CutOffTime")}>
                      <SelectBox
                        options={TimeZone}
                        selectedValue={data?.CutOffTime}
                        name="CutOffTime"
                        onChange={(e) => handleChangeMain(e, index)}
                      />
                    </td>
                    <td data-title={t("samedaydeliverytime")}>
                      <SelectBox
                        options={TimeZone}
                        selectedValue={data?.samedaydeliverytime}
                        name="samedaydeliverytime"
                        onChange={(e) => handleChangeMain(e, index)}
                      />
                    </td>

                    <td data-title={t("nextdaydeliverytime")}>
                      <SelectBox
                        options={TimeZone}
                        selectedValue={data?.nextdaydeliverytime}
                        name="nextdaydeliverytime"
                        onChange={(e) => handleChangeMain(e, index)}
                      />
                    </td>
                    <td>
                      <Input
                        disabled={data?.TATType === "Hours" ? false : true}
                        value={data?.Approval_To_Dispatch}
                        name={"Approval_To_Dispatch"}
                        onChange={(e) => handleChangeMain(e, index)}
                      />
                    </td>
                    <td data-title={t("isChecked")}>
                      <Input
                        type="checkbox"
                        checked={data?.isChecked}
                        name="isChecked"
                        onChange={(e) => handleChangeMain(e, index)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row">
            <div className="col-sm-1">
              {load?.saveLoad ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={handleSubmit}
                >
                  {t("Save")}
                </button>
              )}
            </div>
            <div className="col-sm-2">
              <Input
                type="checkbox"
                name="allCentres"
                checked={
                  tableData?.length > 0
                    ? isChecked("allCentres", tableData, true).includes(false)
                      ? false
                      : true
                    : false
                }
              />
              <label>{t("Save for all centre")} </label>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default ManageDeliveryDays;
