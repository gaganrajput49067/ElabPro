import axios from "axios";
import React, { useEffect, useState } from "react";
import { PhelebotomistMappingValdationSchema } from "../../ChildComponents/validations";
import { toast } from "react-toastify";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { useTranslation } from "react-i18next";
import Loading from "../util/Loading";
import PhelebotomistMappingModal from "./PhelebotomistMappingModal";
import ExportFile from "../Master/ExportFile";

const PhelebotomistMapping = () => {
  const [errors, setErros] = useState({});
  const [load, setLoad] = useState(false);
  const [businessZones, setBusinessZones] = useState([]);
  const [states, setStates] = useState([]);
  const [city, setCity] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [phelebo, setPhelebo] = useState([]);
  const [dropLocation, setDropLocation] = useState([]);
  const [formData, setFormData] = useState({
    BusinessZoneId: "",
    StateId: "",
    CityId: "",
  });
  const [searchdata, setSearchData] = useState([]);
  const [show, setShow] = useState({
    modal: false,
    index: -1,
    name: "",
  });

  const { t } = useTranslation();

  const handleSplitData = (id, symbol) => {
    const data = id?.split(symbol);
    return data;
  };

  const handleShow = (name, data, index) => {
    const { CityId, Pincode } = data;
    var dataObj = {};
    switch (name) {
      case "Route":
        getRoutes(CityId);
        dataObj = {
          apiUrl: "/api/v1/PhelebotomistMapping/BindAreaMultiple",
          payload: {
            CityId: CityId,
            PinCode: Pincode,
          },
        };
        break;
      case "Phelebo":
        getPhelebo(CityId, Pincode);
        dataObj = {
          apiUrl: "/api/v1/PhelebotomistMapping/BindAreaMultiplePhelbo",
          payload: {
            CityId: CityId,
            PinCode: Pincode,
          },
        };
        break;
      case "DropLocation":
        getDropLocation(CityId, Pincode);
        dataObj = {
          apiUrl: "/api/v1/PhelebotomistMapping/BindAreaMultipleDropLocation",
          payload: {
            CityId: CityId,
            PinCode: Pincode,
          },
        };
        break;
      default:
        break;
    }

    setShow({ index: index, modal: true, name: name, dataObj: dataObj });
  };

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

  const getCity = (value) => {
    axios
      .post("/api/v1/CommonHC/GetCityData", {
        StateId: value,
      })
      .then((res) => {
        const data = res?.data?.message;
        const cities = data?.map((ele) => {
          return {
            value: handleSplitData(ele?.ID, "#")[0],
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
  };

  const handleSearch = () => {
    setLoad(true);

    const generatedError = PhelebotomistMappingValdationSchema(formData);

    if (generatedError === "") {
      axios
        .post("/api/v1/PhelebotomistMapping/GetPhelebotomistData", {
          CityId: formData?.CityId,
        })
        .then((res) => {
          const data = res?.data?.message;
          const finalData = data?.map((ele) => {
            return {
              ...ele,
              Phelbo: ele?.Phelbo ? handleSplitData(ele?.Phelbo, "^") : "",
              PhelboIdNew: !["", "0"].includes(ele?.PhelboId)
                ? handleSplitData(ele?.PhelboId, "^")
                : "",
              DropLocation: !["", "0"].includes(ele?.DropLocation)
                ? handleSplitData(ele?.DropLocation, "^")
                : "",
              DropLocationIdNew: !["", "0"].includes(ele?.DropLocationId)
                ? handleSplitData(
                    handleSplitData(ele?.DropLocationId, "^")[0],
                    "#"
                  )
                : "",
            };
          });
          console.log(finalData);
          setSearchData(finalData);
          setLoad(false);
        })
        .catch((err) => {
          setLoad(false);
          setSearchData([]);
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

  const getRoutes = (value) => {
    axios
      .post("/api/v1/PhelebotomistMapping/BindRoute", {
        CityId: value,
      })
      .then((res) => {
        const data = res?.data?.message;
        const routes = data?.map((ele) => {
          return {
            value: ele?.RouteId,
            label: ele?.Route,
          };
        });
        routes?.unshift({ label: t("Select Routes"), value: "" });
        setRoutes(routes);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const getPhelebo = (value) => {
    axios
      .post("/api/v1/PhelebotomistMapping/BindPhelbo", {
        CityId: value,
      })
      .then((res) => {
        const data = res?.data?.message;
        const phelebo = data?.map((ele) => {
          return {
            value: ele?.PheleboId,
            label: ele?.Name,
          };
        });
        phelebo?.unshift({ label: t("Select Phelebo"), value: "" });
        setPhelebo(phelebo);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

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

  const handleClose = () => {
    setShow({ index: -1, modal: false, name: "" });
    handleSearch();
  };

  const getDropLocation = () => {
    axios
      .post("/api/v1/PhelebotomistMapping/BindDropLocation", {})
      .then((res) => {
        const data = res?.data?.message;
        const dropLocation = data.map((ele) => {
          return {
            value: ele?.CentreId,
            label: ele?.Centre,
          };
        });
        dropLocation.unshift({ label: t("Select Drop Location"), value: "" });

        setDropLocation(dropLocation);
      })
      .catch((err) => {
        toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong");
      });
  };

  useEffect(() => {
    getBusinessZones();
    getDropLocation();
  }, []);

  return (
    <>
      <div className="box box-success">
        <div className=" box-header with-border">
          <h3 className="box-title text-center">
            {t("Phelebotomist Mapping")}
          </h3>
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
            <div className="col-sm-12 col-md-2">
              <SelectBox
                options={[
                  { label: "Select Business Zone", value: "" },
                  ...businessZones,
                ]}
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
              //   htmlFor="State"
              style={{ textAlign: "end" }}
            >
              {t("State")} :
            </label>
            <div className="col-sm-12 col-md-2">
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
            <label
              className="col-sm-12  col-md-2"
              //   htmlFor="City"
              style={{ textAlign: "end" }}
            >
              {t("City")} :
            </label>
            <div className="col-sm-12 col-md-2">
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
                  type="Search"
                  className="btn btn-block btn-info btn-sm"
                  onClick={handleSearch}
                >
                  {t("Search")}
                </button>
              )}
            </div>
            <div className="col-md-1 col-sm-6 col-xs-12">
              <ExportFile dataExcel={searchdata} />
            </div>
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
            <thead
              className="cf text-center "
              style={{ zIndex: 99, maxWidth: "100%", maxHeight: "100%" }}
            >
              <tr>
                <th className="text-center">{t("S.No")}</th>
                <th className="text-center">{t("City")}</th>
                <th className="text-center">{t("Area")}</th>
                <th className="text-center">{t("PinCode")}</th>
                <th className="text-center">{t("Route")}</th>
                <th className="text-center">{t("Phelebo")}</th>
                <th className="text-center">{t("Drop Location")}</th>
              </tr>
            </thead>

            {searchdata?.length > 0 && (
              <tbody style={{ position: "relative" }}>
                {searchdata?.map((ele, index) => (
                  <>
                    {show?.modal && index === show?.index && (
                      <PhelebotomistMappingModal
                        show={show?.modal}
                        handleClose={handleClose}
                        name={show?.name}
                        dataObj={show?.dataObj}
                        Innerdata={ele}
                        routes={routes}
                        phelebo={phelebo}
                        dropLocation={dropLocation}
                      />
                    )}
                    <tr key={index}>
                      <td data-title="S.no" className="text-center">
                        {index + 1}&nbsp;
                      </td>

                      <td data-title="City" className="text-center">
                        {ele?.City}&nbsp;
                      </td>
                      <td data-title="Area" className="text-center">
                        {ele?.location}&nbsp;
                      </td>
                      <td data-title="PinCode" className="text-center">
                        {ele?.Pincode}&nbsp;
                      </td>
                      <td
                        data-title="Route"
                        className="text-center PheloMapTable"
                        onClick={() => handleShow("Route", ele, index)}
                      >
                        <div name="Route" className="routes ">
                          {ele?.Route?.length > 0 && (
                            <div className="routesChild" key={index}>
                              {ele?.Route}&nbsp;
                            </div>
                          )}
                        </div>
                      </td>
                      <td
                        data-title="Phelebo"
                        className="text-center PheloMapTable"
                        onClick={() => handleShow("Phelebo", ele, index)}
                      >
                        <div name="Phelebo" className="phelebo_Drop">
                          &nbsp;
                          {ele?.Phelbo?.length > 0 &&
                            ele?.Phelbo?.map(
                              (ele, index) =>
                                [0, 1, 2].includes(index) && (
                                  <div
                                    className="phelebo_Drop_Child"
                                    key={index}
                                  >
                                    {[0, 1].includes(index) ? ele : "More..."}
                                  </div>
                                )
                            )}
                        </div>
                      </td>
                      <td
                        data-title="DropLocation"
                        className="text-center PheloMapTable"
                        onClick={() => handleShow("DropLocation", ele, index)}
                      >
                        <div name="Phelebo" className="phelebo_Drop">
                          &nbsp;
                          {ele?.DropLocation?.length > 0 &&
                            ele?.DropLocation?.map(
                              (ele, index) =>
                                [0, 1, 2].includes(index) && (
                                  <div
                                    className="phelebo_Drop_Child"
                                    key={index}
                                  >
                                    &nbsp;
                                    {[0, 1].includes(index) ? ele : "More..."}
                                  </div>
                                )
                            )}
                        </div>
                      </td>
                    </tr>
                  </>
                ))}
              </tbody>
            )}
          </table>
        </div>
      </div>
    </>
  );
};

export default PhelebotomistMapping;
