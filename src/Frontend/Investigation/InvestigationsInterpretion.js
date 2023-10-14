import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SelectBox } from "../../ChildComponents/SelectBox";
import Input from "../../ChildComponents/Input";

import Loading from "../util/Loading";
import TextEditor from "../Master/Report/TextEditor";
import { useTranslation } from "react-i18next";
const InvestigationsInterpretion = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [CentreData, setCentreData] = useState([]);
  const [load, setLoad] = useState(false);
  const [Machine, setMachine] = useState([]);
  const [Editable, setEditable] = useState(false);
  const [Editor, setEditor] = useState("");
  const [payload, setPayload] = useState({
    CentreID: "",
    MacID: "",
    Interpretation: "",
    InvestigationID: state?.InvestigationID ? state?.InvestigationID : "",
    PrintInterPackage: "",
  });

   
   
    const { t } = useTranslation();
    
  

  const fetch = () => {
    axios
      .post(state?.url, {
        CentreID: payload?.CentreID,
        InvestigationID: payload?.InvestigationID,
        MacID: payload?.MacID,
      })
      .then((res) => {
        if (res?.data?.message.length === 0) {
          toast.success("No Data Found");
          setPayload({
            ...payload,
            Interpretation: "",
          });
        } else {
          const data = res?.data?.message[0];
          setPayload({
            ...payload,
            CentreID: data?.CentreID,
            MacID: data?.MacID,
            Interpretation: data?.Interpretation,
            InvestigationID: data?.InvestigationID,
            PrintInterPackage: "",
          });
          setEditor(data?.Interpretation);
          setEditable(true);
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  console.log(payload);

  const SaveInterpretion = () => {
    setLoad(true);
    axios
      .post("/api/v1/Investigations/SaveInterpretation", payload)
      .then((res) => {
        if (res.data.message) {
          setLoad(false);
          toast.success(res.data.message);
          navigate(-1);
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setLoad(false);
        if (err?.response?.status === 504) {
          toast.error("Something went wrong");
        }
      });
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
        setCentreData(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };
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
        setMachine(Machine);
      })
      .catch((err) => console.log(err));
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setPayload({
      ...payload,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  useEffect(() => {
    if (
      payload?.CentreID !== "" &&
      payload?.MacID !== "" &&
      payload?.InvestigationID !== ""
    ) {
      fetch();
    }
  }, [payload?.CentreID, payload?.MacID, payload?.InvestigationID]);

  useEffect(() => {
    setPayload({ ...payload, Interpretation: Editor });
  }, [Editor]);

  useEffect(() => {
    getAccessCentres();
    getMachine();
    fetch();
  }, []);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          {/* {state?.other?.pageName ? state?.other?.pageName : "Create"} */}
          <h6 className="box-title">{t("Create")}</h6>
        </div>
        <div className="box-body">
          <div className="row">
          <label className="col-sm-1" htmlFor="inputEmail3">{t("Investigation")}:</label>
            <div className="col-sm-2">
              {/* <label className="control-label">Investigation</label> */}
              <Input
                className="form-control ui-autocomplete-input input-sm"
                disabled={true}
                value={state?.data}
                name="TestName"
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">{t("Centre Name")}:</label>
            <div className="col-sm-2">
              {/* <label className="control-label">Centre Name</label> */}
              <SelectBox
                options={CentreData} //CentreData
                onChange={handleSelectChange}
                name="CentreID"
                selectedValue={payload?.CentreID}
              />
            </div>
            <label className="col-sm-1">{t("Machine")}:</label>
            <div className="col-sm-2">
              {/* <label className="control-label">Machine</label> */}
              <SelectBox
                options={Machine} //Machine
                onChange={handleSelectChange}
                name="MacID"
                selectedValue={payload?.MacID}
              />
            </div>

            <div className="col-sm-2">
              <Input
                name="PrintInterPackage"
                type="checkbox"
                checked={payload?.PrintInterPackage}
                onChange={handleChange}
              />
              <label className="control-label">{t("For All Centre")}</label>
            </div>
          </div>
          <div className="row">
            <label className="box-title">{t("Interpretation")}</label>
            <div className="col-sm-12">
              <TextEditor
                value={payload?.Interpretation}
                setValue={setEditor}
                EditTable={Editable}
                setEditTable={setEditable}
              />
            </div>
          </div>
          <div className="col-sm-1">
            {load ? (
              <Loading />
            ) : (
              <button
                className="btn btn-block btn-success btn-sm "
                onClick={SaveInterpretion}
              >
                {t("Save")}
              </button>
            )}
          </div>
          <div className="col-sm-1">
            <button
              className="btn btn-block btn-primary btn-sm"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvestigationsInterpretion;
