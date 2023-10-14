import axios from "axios";
import React, { useEffect, useState } from "react";
import { RouteMasterValidationSchema } from "../../ChildComponents/validations";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { useTranslation } from "react-i18next";
import Loading from "../util/Loading";
import { SimpleCheckbox } from "../../ChildComponents/CheckBox";
import { NoofRecord } from "../../ChildComponents/Constants";
import ExportFile from "../Master/ExportFile";
import { getTrimmedData } from "../util/Commonservices";

const RouteMaster = () => {
  const [errors, setErros] = useState({}); //check
  const [load, setLoad] = useState(false); //check
  const [searchLoad, setSearchLoad] = useState(false); //check
  const [businessZones, setBusinessZones] = useState([]); // dropdown
  const [states, setStates] = useState([]); // dropdown
  const [city, setCity] = useState([]); //dropdown
  const [statesSearch, setStatesSearch] = useState([]);
  const [citySearch, setCitySearch] = useState([]);
  const [routeTable, setRouteTable] = useState([]);
  const [searchData, setSearchData] = useState({
    StateId: "",
    CityId: "",
    Route: "",
    NoofRecord: "10",
  });

  const [formData, setFormData] = useState({
    BusinessZoneId: "",
    StateId: "",
    CityId: "",
    Route: "",
    IsActive: "",
  });

  const { t } = useTranslation();

  // check
  const getStates = (value) => {
    if (value === "") {
      setStates([]);
    } else {
      axios
        .post("/api/v1/CommonHC/GetStateData", {
          BusinessZoneID: value,
        })
        .then((res) => {
          const data = res?.data?.message;
          const States = data?.map((ele) => {
            return {
              value: ele?.ID,
              label: ele?.State,
            };
          });
          // States?.unshift({ label: t("Select State"), value: "" });
          setStates(States);
        })
        .catch((err) => {
          toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong");
        });
    }
  };

  // check

  const getCity = (value) => {
    axios
      .post("/api/v1/CommonHC/GetCityData", {
        StateId: value,
      })
      .then((res) => {
        const data = res?.data?.message;
        const cities = data?.map((ele) => {
          return {
            value: handleSplitData(ele?.ID),
            label: ele?.City,
          };
        });
        // cities?.unshift({ label: t("Select City"), value: "" });
        setCity(cities);
      })
      .catch((err) => {
        toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong");
      });
  };

  const handleSplitData = (id) => {
    const data = id?.split("#")[0];
    return data;
  };

  // check
  const getSearchCity = (value) => {
    axios
      .post("/api/v1/CommonHC/GetCityData", {
        StateId: value,
      })
      .then((res) => {
        const data = res?.data?.message;
        const cities = data?.map((ele) => {
          return {
            value: handleSplitData(ele?.ID),
            label: ele?.City,
          };
        });

        setCitySearch(cities);
      })
      .catch((err) => {
        toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong");
      });
  };

  // check

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "BusinessZoneId") {
      getStates(value);
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
        CityId: "",
        StateId: "",
      });
      setStates([]);
      setCity([]);
    }

    if (name === "StateId") {
      getCity(value);
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
        CityId: "",
      });
      setCity([]);
    }

    if (name === "CityId") {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
    if (name === "Route") {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }

    // setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  // check

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchData({ ...searchData, [name]: value });

    if (name === "StateId") {
      getSearchCity(value);
    }

    if (name === "NoofRecord") {
      handleSearch(value);
    }
  };

  const handleUpdate = () => {
    axios
      .post(
        "/api/v1/RouteMaster/UpdateRouteData",
        getTrimmedData({
          ...formData,
          IsActive: formData?.IsActive ? 1 : 0,
        })
      )
      .then((res) => {
        toast.success(res?.data?.message);
        handleCancel();
        handleSearch(searchData?.NoofRecord);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const editRouteMaster = (ele) => {
    getStates(ele?.BusinessZoneID);
    getCity(ele?.StateId);
    setFormData({
      BusinessZoneId: ele?.BusinessZoneID,
      Route: ele?.Route,
      StateId: ele?.StateId,
      CityId: ele?.CityId,
      RouteId: ele?.RouteId,
      IsActive: ele?.IsActive === 0 ? false : true,
    });
  };

  const handleSearch = (NoofRecord) => {
    handleCancel();
    setSearchLoad(true);
    axios
      .post("/api/v1/RouteMaster/GetRouteData", {
        ...searchData,
        NoofRecord: NoofRecord,
      })
      .then((res) => {
        setRouteTable(res?.data?.message);
        setSearchLoad(false);
      })
      .catch((err) => {
        toast.error("Data Not Found");
        setRouteTable([]);
        setSearchLoad(false);
      });
  };

  const handleCancel = () => {
    setFormData({
      BusinessZoneId: "",
      StateId: "",
      CityId: "",
      Route: "",
      IsActive: false,
    });
    setStates([]);
    setCity([]);
    setErros({});
  };

  const handleSubmit = () => {
    const generatedError = RouteMasterValidationSchema(formData);
    if (generatedError === "") {
      setLoad(true);
      axios
        .post(
          "/api/v1/RouteMaster/SaveRouteData",
          getTrimmedData({
            ...formData,

            IsActive: formData?.IsActive ? 1 : 0,
          })
        )
        .then((res) => {
          if (res?.data?.message) {
            setLoad(false);
            handleCancel();
            toast.success("Saved Successfully");
            handleSearch(searchData?.NoofRecord);
          }
        })
        .catch((err) => {
          setLoad(false);
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
        });
    } else {
      setErros(generatedError);
      setLoad(false);
    }
  };

  // check
  const getBusinessZones = () => {
    axios
      .get("/api/v1/CommonHC/GetZoneData")
      .then((res) => {
        let data = res?.data?.message;
        let BusinessZones = data?.map((ele) => {
          return {
            value: ele?.BusinessZoneID,
            label: ele?.BusinessZoneName,
          };
        });
        // BusinessZones.unshift({ label: t("Select Business Zone"), value: "" });
        setBusinessZones(BusinessZones);
      })
      .catch((err) =>
        toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong")
      );
  };

  const getSearchState = () => {
    axios
      .post("/api/v1/CommonHC/GetStateData", {
        BusinessZoneID: 0,
      })
      .then((res) => {
        const data = res?.data?.message;
        const States = data?.map((ele) => {
          return {
            value: ele?.ID,

            label: ele?.State,
          };
        });
        States.unshift({ label: t("Select State"), value: "" });
        setStatesSearch(States);
      })
      .catch((err) => {
        toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong");
      });
  };
  useEffect(() => {
    getBusinessZones();
    getSearchState();
    handleSearch(searchData?.NoofRecord);
  }, []);

  return (
    <>
      <div className="box with-border">
        <div className="box box-header with-border box-success">
          <h3 className="box-title text-center">{t("Route Master")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label
              className="col-sm-12  col-md-2"
              htmlFor="BusinessZone"
              style={{ textAlign: "end" }}
            >
              {t("Business Zone")} :
            </label>
            <div className="col-sm-12 col-md-3">
              <SelectBox
                options={[
                  { label: "Select BusinessZone", value: "" },
                  ...businessZones,
                ]}
                // options={businessZones}
                name="BusinessZoneId"
                className="input-sm"
                selectedValue={formData?.BusinessZoneId}
                onChange={handleChange}
              />

              {formData?.BusinessZoneId === "" && (
                <span className="golbal-Error">{errors?.BusinessZoneId}</span>
              )}
            </div>
            <label
              className="col-sm-12  col-md-2"
              htmlFor="State"
              style={{ textAlign: "end" }}
            >
              {t("State")} :
            </label>
            <div className="col-sm-12 col-md-3">
              <SelectBox
                options={[{ label: "Select State", value: "" }, ...states]}
                name="StateId"
                className="input-sm"
                selectedValue={formData?.StateId}
                onChange={handleChange}
              />
              {formData?.StateId === "" && (
                <span className="golbal-Error">{errors?.StateId}</span>
              )}
            </div>
          </div>

          <div className="row">
            <label
              className="col-sm-12  col-md-2"
              htmlFor="City"
              style={{ textAlign: "end" }}
            >
              {t("City")} :
            </label>
            <div className="col-sm-12 col-md-3">
              <SelectBox
                options={[{ label: "Select City", value: "" }, ...city]}
                name="CityId"
                className="input-sm"
                selectedValue={formData.CityId}
                onChange={handleChange}
              />
              {formData?.CityId === "" && (
                <span className="golbal-Error">{errors?.CityId}</span>
              )}
            </div>
            <label
              className="col-sm-12 col-md-2"
              htmlFor="Route"
              style={{ textAlign: "end" }}
            >
              {t("Route")} :
            </label>
            <div className="col-sm-12 col-md-2">
              <Input
                className="select-input-box form-control input-sm"
                type="text"
                placeholder="Route"
                name="Route"
                value={formData?.Route}
                onChange={handleChange}
              />
              {formData?.Route === "" && (
                <span className="golbal-Error">{errors?.Route}</span>
              )}
            </div>

            <div className="col-md-2">
              <SimpleCheckbox
                name="IsActive"
                type="checkbox"
                onChange={handleChange}
                checked={formData?.IsActive}
              />
              <label htmlFor="IsActive" className="control-label">
                {t("IsActive")}
              </label>
            </div>
          </div>

          <div
            className="row"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <div className="col-md-1 col-sm-6 col-xs-12">
              {load ? (
                <Loading />
              ) : (
                <button
                  type="button"
                  className={`btn btn-block ${
                    formData?.RouteId ? "btn-warning" : "btn-success"
                  } btn-sm`}
                  onClick={formData?.RouteId ? handleUpdate : handleSubmit}
                >
                  {formData?.RouteId ? t("Update") : t("Save")}
                </button>
              )}
            </div>
            <div className="col-md-1 col-sm-6 col-xs-12">
              <button
                type="button"
                className="btn btn-block btn-danger btn-sm"
                onClick={handleCancel}
              >
                {t("Cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="box">
        <div className="box-body">
          <div className="row">
            <label className="col-sm-12  col-md-1" htmlFor="No Of Records">
              {t("NoOf Records")}:
            </label>
            <div className="col-sm-12 col-md-2">
              <SelectBox
                options={NoofRecord}
                name="NoofRecord"
                selectedValue={searchData?.NoofRecord}
                onChange={handleSearchChange}
              />
            </div>

            <div className="col-sm-12 col-md-2">
              <SelectBox
                options={statesSearch}
                name="StateId"
                className="input-sm"
                selectedValue={searchData?.StateId}
                onChange={handleSearchChange}
              />
            </div>

            <div className="col-sm-12 col-md-2">
              <SelectBox
                options={[{ label: "Select City", value: "" }, ...citySearch]}
                name="CityId"
                className="input-sm"
                selectedValue={searchData?.CityId}
                onChange={handleSearchChange}
              />
            </div>

            <div className="col-sm-12 col-md-2">
              <Input
                className="select-input-box form-control input-sm"
                type="text"
                name="Route"
                value={searchData?.Route}
                placeholder="Route"
                onChange={handleSearchChange}
              />
            </div>
            <div className="col-md-1">
              {searchLoad ? (
                <Loading />
              ) : (
                <button
                  type="Search"
                  className="btn btn-block btn-info btn-sm"
                  onClick={() => handleSearch(searchData?.NoofRecord)}
                >
                  {t("Search")}
                </button>
              )}
            </div>
            <div className="col-md-1">
              <ExportFile dataExcel={routeTable} />
            </div>
          </div>
        </div>

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
                  <th className="text-center">{t("Select")}</th>
                  <th className="text-center">{t("Route Name")}</th>
                  <th className="text-center">{t("Business Zone")}</th>
                  <th className="text-center">{t("State")}</th>
                  <th className="text-center">{t("City")}</th>
                  <th className="text-center">{t("Status")}</th>
                </tr>
              </thead>
              {routeTable?.length > 0 && (
                <tbody>
                  {routeTable.map((ele, index) => (
                    <>
                      <tr key={ele?.RouteId}>
                        <td data-title="#" className="text-center">
                          {index + 1}
                        </td>
                        <td data-title="Select" className="text-center">
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              window.scroll(0, 0);
                              editRouteMaster(ele);
                            }}
                          >
                            Select
                          </button>
                        </td>
                        <td data-title="Route Name" className="text-center">
                          {ele?.Route}
                        </td>
                        <td data-title="Business Zone" className="text-center">
                          {ele?.BusinessZoneName}
                        </td>
                        <td data-title="State" className="text-center">
                          {ele?.State}
                        </td>
                        <td data-title="City" className="text-center">
                          {ele?.City}
                        </td>
                        <td data-title="Status" className="text-center">
                          {ele?.IsActive === 1 ? "Active" : "Inactive"}
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default RouteMaster;
