import React, { useEffect, useState } from "react";
import Input from "../../ChildComponents/Input";
import CustomDate from "../../ChildComponents/CustomDate";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  getAccessCentres,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import DatePicker from "../Components/DatePicker";


import { useTranslation } from "react-i18next";


const CampMaster = () => {
    const [CentreData, setCentreData] = useState([]);
    const[payload,setPayload]=useState({
        CentreID:""
    })

  const { t } = useTranslation();
    // const handleSelectChange = (event) => {
    //     const { name,value } = event.target;
    //     setPayload({ ...payload, [name]:value, ItemValue: ""  });
    //   };
      const handleSelectChange = (event) => {
        const { name, value } = event.target;
        setPayload({ ...payload, [name]: value, ItemValue: "" });
        // setErrors({});
      };

    useEffect(() => {
        getAccessCentres(setCentreData);
      }, []);

  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Camp Master")}</h3>
        </div>
      </div>

      <div className="box box-success">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Manage Camp")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("Camp Name")}:</label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                placeholder={t("Camp Name")}
              />
            </div>
            <label className="col-sm-1">{t("Camp Date")}:</label>
            <div className="col-sm-2">
              <DatePicker
                type="date"
                name="FromDate"
                date={payload?.FromDate}
                
                // onChangeTime={handleTime}
                // secondName="FromTime"
                maxDate={new Date()}
              />
            </div>
            <label className="col-sm-1">{t("Business Zone")}:</label>
            <div className="col-sm-2">
            <SelectBox />
            </div>
            <label className="col-sm-1">{t("Centre")}:</label>
            <div className="col-sm-2">
            <SelectBox 
                 options={CentreData}
                 name="CentreID"
                 value={ payload?.CentreID}
                 onChange={handleSelectChange}
                />
            </div>
            </div>
            <div className="row">
               <label className="col-sm-1">{t("Tag Business Lab")}:</label>
            <div className="col-sm-2">
              <SelectBox />
            </div>
            <div className="col-sm-1">
              <button className="btn btn-block btn-primary btn-sm">
                {t("Add")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Manage Item")}</h3>
        </div>

        <div className="row">
            <div className="col-sm-2">
            <input type="radio"></input>
            <label className="control-label">{t("By Test Name")}</label>
          </div>

            <div className="col-sm-2">
            <input type="radio"></input>
            <label className="control-label">{t("By Test Code")}</label>
          </div>

          <div className="col-sm-2">
            <input type="radio"></input>
            <label className="control-label">{t("InBetween")}</label>
          </div>

          <div className="col-sm-2">
            <label className="control-label">{t("Total Test")}</label>
            {}
          </div>

          <div className="col-sm-2">
            <label className="input ">{t("Total Amt.")}</label>
            {}
          </div>

          <div className="col-sm-1">
            <button className="btn btn-block btn-success btn-sm">
              {t("Save")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
export default CampMaster;
