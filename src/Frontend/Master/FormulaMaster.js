import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import Loading from "../../Frontend/util/Loading";
import { useTranslation } from "react-i18next";

function FormulaMaster() {
  const [Investigation, setInvestigation] = useState([]);
  const [observationData, setObservationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t } = useTranslation();
  const [load, setLoad] = useState({
    deleteLoad: false,
    saveLoad: false,
  });
  const [splitData, setSplitData] = useState({
    value: "",
    TestID: "",
  });
  const [splitLeft, setSplitLeft] = useState({
    Left: [],
    Right: "",
  });

  const getInvestigationList = () => {
    axios
      .get("/api/v1/Investigations/BindInvestigationList")
      .then((res) => {
        let data = res.data.message;

        let MapTest = data.map((ele) => {
          return {
            value: ele.InvestigationID,
            label: ele.TestName,
          };
        });
        MapTest.unshift({ label: "Select Test", value: "" });
        setInvestigation(MapTest);
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange = (event) => {
    getObservationData(event?.target?.value);
    setSplitData({
      value: "",
      TestID: "",
    });
    setSplitLeft({
      Left: [],
      Right: "",
    });
  };

  const handleChange = (e) => {
    const { value } = e.target;
    const findvalue = observationData.find((ele) => ele.TestID == value);
    setSplitData({
      ...splitData,
      value: findvalue?.TestName,
      TestID: findvalue?.TestID,
    });
  };

  const handleChangeRight = (e) => {
    const { name, value } = e.target;
    setSplitLeft({
      ...splitLeft,
      [name]: value,
    });
  };

  console.log(splitLeft);

  const handleEvent = (name) => {
    if (splitData.TestID !== "") {
      const data = splitData.value.split("#");
      if (name === "Left") {
        handleDuplicate().then((res) => {
          if (res.length > 0) {
            setSplitLeft({
              ...splitLeft,
              [name]: data,
              Right: res?.[0]?.formula,
            });
          } else {
            setSplitLeft({
              ...splitLeft,
              [name]: data,
            });
          }
        });
      }
      if (name === "Right" && splitLeft?.Left[1] !== data[1]) {
        setSplitLeft({
          ...splitLeft,
          [name]:
            splitLeft?.Right !== ""
              ? `${splitLeft?.Right}${data[1]}&`
              : `${data[1]}&`,
        });
      } else if (name === "Right" && splitLeft?.Left[1] === data[1]) {
        toast.error("Please Choose different Value");
      }
    }
  };

  const handleDuplicate = () => {
    return new Promise((resolve, reject) => {
      axios
        .post("/api/v1/FormulaMaster/getFormulaData", {
          TestID: splitData?.TestID,
        })
        .then((res) => {
          resolve(res?.data?.message);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          reject(err);
        });
    });
  };

  const handleDelete = () => {
    if (splitLeft?.Right !== "" && splitData?.TestID !== "") {
      setLoad({ ...load, deleteLoad: true });
      axios
        .post("/api/v1/FormulaMaster/DeleteFormulaMasterRecord", {
          Formula: splitLeft?.Right,
          TestID: splitLeft?.Left[1],
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setLoad({ ...load, deleteLoad: false });
          setSplitData({
            value: "",
            TestID: "",
          });
          setSplitLeft({
            ...splitLeft,
            Right: "",
          });
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoad({ ...load, deleteLoad: false });
        });
    } else {
      toast.error("please Select one Value");
    }
  };

  const getObservationData = (id) => {
    setLoading(true);
    axios
      .post("/api/v1/FormulaMaster/getObservationData", {
        InvestigationID: id,
      })
      .then((res) => {
        setObservationData(res?.data?.message);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoading(false);
      });
  };

  const handleSubmit = () => {
    if (splitLeft?.Right !== "" && splitData?.TestID !== "") {
      setLoad({ ...load, saveLoad: true });
      axios
        .post("/api/v1/FormulaMaster/saveFormulaMaster", {
          Formula: splitLeft?.Right,
          TestID: splitLeft?.Left[1],
        })
        .then((res) => {
          toast.success(res.data?.message);
          setLoad({ ...load, saveLoad: false });
          setSplitData({
            value: "",
            TestID: "",
          });
          setSplitLeft({
            ...splitLeft,
            Right: "",
          });
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoad({ ...load, saveLoad: false });
        });
    } else {
      toast.error("please Enter Formula or Choose TestID");
    }
  };

  useEffect(() => {
    getInvestigationList();
  }, []);
  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Formula Master")}</h3>
        </div>

        <div className="box-body">
          <div className="row">
            <div className="col-sm-3">
              <label>{t("Investigation")}:</label>
              <SelectBox
                options={Investigation}
                onChange={handleSelectChange}
              />
              {loading ? (
                <div className="mt-3">
                  <Loading />
                </div>
              ) : (
                <select
                  multiple
                  className="form-control"
                  onChange={handleChange}
                >
                  {observationData.map((ele, index) => (
                    <option key={index} value={ele?.TestID} className="p-2">
                      {ele?.TestName}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="col-sm-1 center">
              <button
                className="btn btn-block btn-info btn-sm"
                onClick={() => handleEvent("Left")}
              >
                {t("Left")}
              </button>
            </div>
            <div className="col-sm-1 center">
              <button
                className="btn btn-block btn-info btn-sm"
                onClick={() => handleEvent("Right")}
              >
               {t("Right")} 
              </button>
            </div>

            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                value={splitLeft?.Left[0]}
                readOnly
              />
              <Input
                className="form-control ui-autocomplete-input input-sm"
                value={splitLeft?.Left[1]}
                readOnly
              />
            </div>
            <div className="col-sm-1 ">
              <div> = </div>
            </div>
            <div className="col-sm-3">
              <input
                className="form-control ui-autocomplete-input input-sm"
                style={{ height: "100px" }}
                value={splitLeft?.Right}
                name="Right"
                type="text"
                onChange={handleChangeRight}
              />
            </div>
          </div>
        </div>
        <div className="box-footer">
          <div className="row">
            {load?.saveLoad ? (
              <Loading />
            ) : (
              <div className="col-sm-1 ">
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={handleSubmit}
                >
                 {t("Save")} 
                </button>
              </div>
            )}

            {load?.deleteLoad ? (
              <Loading />
            ) : (
              <div className="col-sm-1">
                <button
                  className="btn btn-block btn-danger btn-sm"
                  onClick={handleDelete}
                >
                 {t("Delete")} 
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default FormulaMaster;
