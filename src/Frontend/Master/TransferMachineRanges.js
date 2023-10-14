import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { useTranslation } from "react-i18next";

const TransferMachineRanges = () => {
  const [Machine, setMachine] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [state, setState] = useState({
    FromCentre: "",
    ToCentre: "",
    FromMachine: "",
    ToMachine: "",
  });

  const { t } = useTranslation();
  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setState({ ...state, [name]: value });
  };

  console.log(state);

  const getMachine = () => {
    axios
      .get("/api/v1/Investigations/BindMachineList")
      .then((res) => {
        let data = res.data.message;
        let Machine = data.map((ele) => {
          return {
            value: ele.MachineId,
            label: ele.MachineName,
          };
        });
        Machine.unshift({ label: "All", value: "" });
        setMachine(Machine);
      })
      .catch((err) => console.log(err));
  };

  const postApi = () => {
    if (
      state?.FromCentre &&
      state?.ToCentre &&
      state?.FromMachine &&
      state?.ToMachine
    ) {
      axios
        .post("/api/v1/machineReferencesRanges/TransferMachineRefRangesData", {
          FromCentre: state?.FromCentre,
          FromMachine: state?.FromMachine,
          ToCentre: state?.ToCentre,
          ToMachine: state?.ToMachine,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setState({
            FromCentre: "",
            ToCentre: "",
            FromMachine: "",
            ToMachine: "",
          });
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something went wrong"
          );
        });
    } else {
      toast.error("All fields are Required.");
    }
  };

  const getAccessCentres = () => {
    axios
      .get("/api/v1/Centre/getAccessCentres")
      .then((res) => {
        let data = res.data.message;
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        CentreDataValue.unshift({ label: "All", value: "" });
        setCentreData(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getAccessCentres();
    getMachine();
  }, []);
  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Machine Reference Ranges Transfer")}</h3>
        </div>
        <div className="box-body boottable">
          <div className="row">
            <div className="col-sm-5">
              <label className="col-sm-2" htmlFor="inputEmail3">
                {t("From Centre")}:
              </label>
              <div className="col-sm-3">
                <SelectBox
                  options={CentreData}
                  name="FromCentre"
                  selectedValue={state?.FromCentre}
                  onChange={handleSelectChange}
                />
              </div>
              <label className="col-sm-3" htmlFor="inputEmail3" style={{marginLeft:"20px"}}>
                {t("From Machine")}:
              </label>
              <div className="col-sm-3">
                <SelectBox
                  options={Machine}
                  onChange={handleSelectChange}
                  name="FromMachine"
                  selectedValue={state?.FromMachine}
                />
              </div>
            </div>

            <div className="col-sm-2">
              <button
                className="btn btn-block btn-primary btn-sm mt-5 mx-5"
                style={{ width: "50px" ,marginLeft:"50px"}}
                // style={{display:"flex",justifyContent:"center",width:"50px"}}
                onClick={postApi}
              >
                {">>"}
              </button>
            </div>

            <div className="col-sm-5">
              <label className="col-sm-2" htmlFor="inputEmail3">
                {t("To Centre")}:
              </label>
              <div className="col-sm-3">
                <SelectBox
                  options={
                    state?.FromCentre
                      ? CentreData.filter(
                          (ele) => ele.value != state?.FromCentre
                        )
                      : CentreData
                  }
                  name="ToCentre"
                  selectedValue={state?.ToCentre}
                  onChange={handleSelectChange}
                />
              </div>
              <label className="col-sm-2" htmlFor="inputEmail3" style={{marginLeft:"20px"}}>
                {t("To Machine")}:
              </label>
              <div className="col-sm-3">
                <SelectBox
                  options={
                    state?.FromMachine
                      ? Machine.filter(
                          (ele) => ele.value != state?.FromMachine
                        )
                      : Machine
                  }
                  onChange={handleSelectChange}
                  name="ToMachine"
                  selectedValue={state?.ToMachine}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransferMachineRanges;
