import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import DatePicker from "../Components/DatePicker";

import Loading from "../../util/Loading";
import { Image } from "react-bootstrap";
import transfericon from "../../images/TRY6_27.gif";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PhlebotomistCallTransfer = () => {
  const { t } = useTranslation();
  const [states, setStates] = useState([]);
  const [cities,setCity]=useState([])
  const [formData, setFormData] = useState({
    State: "",
    City: "",
    LocalityId:"",
    date:new Date(),
    PhelboId:''
    });
    const [localities,setLocalities]=useState([]);
    const [phelbos,setPhelbos]=useState([]);

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
          };
        });
        console.log(value);
        setStates(value);
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  };

  const handleSplitData = (id) => {
    const data = id.split("#")[0];
    return data;
  };

  const getCity = (value) => {
    axios
      .post("/api/v1/CommonHC/GetCityData", {
        StateId: value,
      })
      .then((res) => {
        const data = res.data.message;
        const cities = data.map((ele) => {
          return {
            value: handleSplitData(ele.ID),
            label: ele.City,
          };
        });
        setCity(cities);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getLocality = (value) => {
    axios
      .post("/api/v1/CustomerCare/BindLocality", {
       "cityid":value
      })
      .then((res) => {
        const data = res.data.message;
        const localities = data.map((ele) => {
          return {
            value: ele.id,
            label: ele.NAME,
          };
        });
        setLocalities(localities);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getPhelbo=(value)=>{
    axios
    .post("/api/v1/PhelebotomistMapping/BindPhelbo", {
      CityId:value
    })
    .then((res) => {
      const data = res.data.message;
      const phelbos = data.map((ele) => {
        return {
          value: ele.PheleboId,
          label: ele.Name,
        };
      });
      setPhelbos(phelbos);
    })
    .catch((err) => {
      console.log(err);
    });
  }
  const handleChange=(e)=>{
  const { name, value, type, checked } = e.target;
   if(name=="State")
   {
    getCity(value)
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value, City: '' });
    setCity([])
   }
   else if(name=="City")
   {
    getLocality(value);
    getPhelbo(value)
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value, LocalityId: '',PhelboId:'' });
   }
    
  }
  const dateSelect = (date, name, value) => {
    
     setFormData({
            ...formData,
            [name]: date,
        });
    }


  useEffect(() => {
    fetchStates();
  }, []);

  return (
    <div>
      <div className="box with-border">
        <div className="box box-header with-border box-success">
          <h3 className="box-title text-center">
            {t("Phlebotomist Call Transfer")}
          </h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-2" htmlFor="State">
              {t("State")}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;:
            </label>
            <div className="col-sm-2">
              <SelectBox
                name="State"
                className="form-control input-sm"
                options={[{ label: "Select State", value: "" }, ...states]}
                onChange={handleChange}
                selectedValue={formData?.State}
              />
            </div>
            <div className="col-sm-4"></div>

            <label className="col-sm-2" htmlFor="City">
              {t("City")}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </label>
            <div className="col-sm-2">
              <SelectBox name="City" className="form-control input-sm" 
               options={[{label:'Select City',value:''},...cities]}
               onChange={handleChange}
               selectedValue={formData?.City}/>
            </div>
          </div>
          <div className="row">
          <label className="col-sm-2">{t("Area")}:</label>
            <div className="col-sm-2"><SelectBox options={[{label:'Select Area',value:''},...localities]} /></div>
            <div className="col-sm-4"></div>
            <label className="col-sm-2" htmlFor="Phlebotomist">
              {t("Phlebotomist")}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </label>
            <div className="col-sm-2">
              <SelectBox
                name="Phlebotomist"
                className="form-control input-sm"
                options={[{label:'Select Phelbo',value:''},...phelbos]}
              />
            </div>
            <div className="col-sm-3"></div>
               </div>
          <div className="row">
          <label className="col-sm-2" htmlFor="Date">
              {t("Date")}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </label>
            <div className="col-sm-2">
              <DatePicker
                name="date"
                date={formData?.date}
                className="form-control input-sm"
                onChange={dateSelect}
              />
            </div>
          </div>
          <div
            className="row"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Image src={transfericon} style={{ height: "40px" }} />
          </div>
          <div className="row">
            <label className="col-sm-2" htmlFor="State">
              {t("State")}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;:
            </label>
            <div className="col-sm-2">
              <SelectBox
                name="State"
                className="form-control input-sm"
                options={[{ label: "Select State", value: "" }, ...states]}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-4"></div>

            <label className="col-sm-2" htmlFor="City">
              {t("City")}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </label>
            <div className="col-sm-2">
              <SelectBox name="City" className="form-control input-sm" 
               options={[{label:'Select City',value:''},...cities]}/>
            </div>
          </div>
          <div className="row">
          <label className="col-sm-2">{t("Area")}:</label>
            <div className="col-sm-2"><SelectBox  /></div>
            <div className="col-sm-4"></div>
            <label className="col-sm-2" htmlFor="Phlebotomist">
              {t("Phlebotomist")}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </label>
            <div className="col-sm-2">
              <SelectBox
                name="Phlebotomist"
                className="form-control input-sm"
              />
            </div>
            <div className="col-sm-3"></div>
               </div>
          <div className="row">
          <label className="col-sm-2" htmlFor="Date">
              {t("Date")}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </label>
            <div className="col-sm-2">
              <DatePicker
                name="date"
                date={new Date()}
                className="form-control input-sm"
              />
            </div>
          </div>
          <div
            className="row"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <button type="button" className="btn  btn-primary btn-sm">
              {t("Transfer Calls")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhlebotomistCallTransfer;
