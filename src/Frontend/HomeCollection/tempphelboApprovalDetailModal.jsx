import React from "react";
import { useEffect } from "react";
import { Modal } from "react-bootstrap";
import moment from "moment";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { number } from "../../util/Commonservices/number";
import Input from "../../ChildComponents/Input";
import DatePicker from "../Components/DatePicker";
import {
  SelectBox,
  SelectBoxWithCheckbox,
} from "../../ChildComponents/SelectBox";
// used in temprory phelbo approval
const TempPhelboApprovalDetailModal = ({ show, handleClose, id, datas }) => {
  const [errors, setErros] = useState({}); // This state is used for setting errors
  const [data, setData] = useState(null);
  const [location, setLocation] = useState({
    state: [],
    city: [],
    Gender: [],
    DucumentType: [],
  });

  // for translation
  const { t } = useTranslation();

  const getTemp = () => {
    axios
      .post("api/v1/TemporaryPheleboApproval/BindSavePhelebotomist", {
        Temp_PhlebotomistID: id,
      })
      .then((res) => {
        let data = res.data.message;
        const updateData = data.map((ele) => ({
          ...ele,
          StateId:
            typeof ele.StateId === "string" ? ele.StateId.split(",") : [],
          CityId: typeof ele.CityId === "string" ? ele.CityId.split(",") : [],
        }));
        setData(updateData[0]);
        if (updateData[0]?.StateId.length > 0) {
          fetchCities(updateData[0]?.StateId);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Something went wrong");
      });
  };

  // fetching state based on zone wher default zone id is 0
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
        setLocation((location) => ({ ...location, state: value }));
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
            value: ele.ID,
            label: ele.City,
          };
        });
        setLocation((location) => ({ ...location, city: value }));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //fetching document required
  const getRequiredAttachment = () => {
    axios
      .post("/api/v1/Global/GetGlobalData", {
        Type: "RequiredAttachment",
      })
      .then((res) => {
        let data = res.data.message;
        datas = data.shift();
        let RequiredAttachment = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        return setLocation((location) => ({
          ...location,
          Identity: RequiredAttachment,
        }));
      })
      .catch((err) => console.log(err));
  };
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
            setLocation((location) => ({ ...location, Gender: value }));
            break;
          default:
            break;
        }
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getTemp();
    getDropDownData("Gender");
    getRequiredAttachment();
    fetchStates();
  }, []);

  const dateSelect = (date, name, value) => {
    const dates = moment(date).format("DD/MMM/YYYY");
    if (name === "Age") {
      setData({ ...data, [name]: dates });
    } else {
      setData({
        ...data,
        [name]: date,
      });
    }
  };

  const handleSelectChange = async (event) => {
    const { name, value, checked, type } = event?.target;
    setData({ ...data, [name]: value });
  };

  const handleSave = () => {
    const generatedError = ValidationSchema(data);

    if (generatedError === "") {
      axios
        .post("api/v1/TemporaryPheleboApproval/UpdateTempPhelebotomist", data)
        .then((res) => {
          toast.success("Data saved Successfully");
          handleClose();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setErros(generatedError);
  };

  const handleChanges = (select, name) => {
    let val = "";
    for (let i = 0; i < select.length; i++) {
      val = val === "" ? `${select[i].value}` : `${val},${select[i].value}`;
    }
    const splitData = val.split(",");
    if (name === "state") {
      const results = data?.CityId.filter((item) => {
        const parts = item.split("#");
        return splitData.includes(parts[1]);
      });
      fetchCities(splitData);
      setData((data) => ({
        ...data,
        StateId: splitData,
        CityId: results,
      }));
    }

    if (name === "city") {
      setData((data) => ({
        ...data,
        CityId: splitData,
      }));
    }
  };

  return (
    <Modal show={show} size="lg" className="form-horizontal">
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">
          Edit Temporary Phelbo Information
        </Modal.Title>
        <button type="button" className="close" onClick={handleClose}>
          x
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="box-body ">
          <div className="row">
            <label className="col-sm-2" htmlFor="Joining From Date">
              {t("Name")}:
            </label>
            <div className="col-sm-4">
              <Input
                type="text"
                name="NAME"
                disabled="true"
                className="select-input-box form-control input-sm"
                onChange={handleSelectChange}
                value={data?.NAME}
              />
            </div>
            <label className="col-sm-2" htmlFor="Age">
              {t("Age")}:
            </label>
            <div className="col-sm-4">
              <DatePicker
                className="form-control input-sm"
                name="Age"
                date={data?.Age ? new Date(data?.Age) : new Date()}
                onChange={dateSelect}
                maxDate={new Date()}
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-2" htmlFor="Gender">
              {t("Gender")}:
            </label>
            <div className="col-sm-4">
              <SelectBox
                options={location?.Gender}
                name="Gender"
                selectedValue={data?.Gender}
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-2" htmlFor="City">
              {t("City")}:
            </label>
            <div className="col-sm-4">
              <Input
                type="text"
                name="P_City"
                max={20}
                className="select-input-box form-control input-sm"
                onChange={handleSelectChange}
                value={data?.P_City}
              />
              {data?.P_City === "" && (
                <span className="golbal-Error">{errors?.P_City}</span>
              )}
            </div>
          </div>
          <div className="row">
            <label className="col-sm-2" htmlFor="Address">
              {t("Address")}:
            </label>
            <div className="col-sm-4">
              <Input
                type="text"
                name="P_Address"
                max={40}
                className="select-input-box form-control input-sm"
                onChange={handleSelectChange}
                value={data?.P_Address}
              />
              {data?.P_Address === "" && (
                <span className="golbal-Error">{errors?.P_Address}</span>
              )}
            </div>
            <label className="col-sm-2" htmlFor="Pincode">
              {t("Pincode")}:
            </label>
            <div className="col-sm-4">
              <Input
                type="number"
                onInput={(e) => number(e, 6)}
                name="P_Pincode"
                className="select-input-box form-control input-sm"
                onChange={handleSelectChange}
                value={data?.P_Pincode}
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-2" htmlFor="Mobile No.">
              {t("Mobile No.")}:
            </label>
            <div className="col-sm-4">
              <Input
                type="number"
                onInput={(e) => number(e, 10)}
                disabled="true"
                name="Mobile"
                className="select-input-box form-control input-sm"
                onChange={handleSelectChange}
                value={data?.Mobile}
              />
            </div>
            <label className="col-sm-2" htmlFor="Email">
              {t("Email")}:
            </label>
            <div className="col-sm-4">
              <Input
                type="text"
                name="Email"
                className="select-input-box form-control input-sm"
                onChange={handleSelectChange}
                value={data?.Email}
              />
              {data?.Email !== "" && (
                <span className="golbal-Error">{errors?.Email}</span>
              )}
            </div>
          </div>
          <div className="row">
            <label className="col-sm-2" htmlFor="Document type">
              {t("Document type")}:
            </label>
            <div className="col-sm-4">
              <SelectBox
                options={location?.Identity}
                name="DucumentType"
                max={25}
                selectedValue={data?.DucumentType}
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-2" htmlFor="Document No.">
              {t("Document No.")}:
            </label>
            <div className="col-sm-4">
              <Input
                type="text"
                name="DucumentNo"
                max={20}
                className="select-input-box form-control input-sm"
                onChange={handleSelectChange}
                value={data?.DucumentNo}
              />
              {data?.User_Name === "" && (
                <span className="golbal-Error">{errors?.User_Name}</span>
              )}
            </div>
          </div>
          <div className="row">
            <label className="col-sm-2" htmlFor="Work-Area State">
              {t("Work-Area State ")}:
            </label>
            <div className="col-sm-4">
              <SelectBoxWithCheckbox
                value={data?.StateId}
                name="state"
                options={location.state}
                onChange={handleChanges}
              />
              {data?.StateId[0] === "" && (
                <span className="golbal-Error">{errors?.StateId}</span>
              )}
            </div>
            <label className="col-sm-2" htmlFor="Work-Area City">
              {t("Work-Area City")}:
            </label>
            <div className="col-sm-4">
              <SelectBoxWithCheckbox
                value={data?.CityId}
                name="city"
                options={location?.city}
                onChange={handleChanges}
              />
              {data?.CityId.length < 1 && (
                <span className="golbal-Error">{errors?.CityId}</span>
              )}
            </div>
          </div>
          <div className="row">
            <label className="col-sm-2" htmlFor="Vehicle">
              {t("Vehicle ")}:
            </label>
            <div className="col-sm-4">
              <Input
                name="Vehicle_Num"
                max={20}
                className="select-input-box form-control input-sm"
                onChange={handleSelectChange}
                value={data?.Vehicle_Num}
              />
              {data?.Vehicle_Num === "" && (
                <span className="golbal-Error">{errors?.Vehicle_Num}</span>
              )}
            </div>
            <label className="col-sm-2" htmlFor="Driving License No.">
              {t("Driving License No.")}:
            </label>
            <div className="col-sm-4">
              <Input
                type="email"
                name="DrivingLicence"
                max={20}
                className="select-input-box form-control input-sm"
                onChange={handleSelectChange}
                value={data?.DrivingLicence}
              />
              {data?.DrivingLicence === "" && (
                <span className="golbal-Error">{errors?.DrivingLicence}</span>
              )}
            </div>
          </div>
          <div
            className="row"
            style={{ display: "flex", justifyContent: "Center" }}
          >
            <div className="col-sm-2 col-xs-12">
              <button
                type="button"
                className="btn btn-block btn-info btn-sm"
                onClick={handleSave}
              >
                {t("Save")}
              </button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default TempPhelboApprovalDetailModal;

const ValidationSchema = (formData) => {
  let err = "";
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (formData?.StateId[0] === "") {
    err = { ...err, StateId: "Atleast One State is Required" };
  }

  if (formData?.CityId.length < 1) {
    err = { ...err, CityId: "Atleast One City is Required" };
  }

  if (formData?.Email) {
    if (!emailPattern.test(formData?.Email)) {
      err = { ...err, Email: "Should be a valid email" };
    }
  }

  return err;
};
