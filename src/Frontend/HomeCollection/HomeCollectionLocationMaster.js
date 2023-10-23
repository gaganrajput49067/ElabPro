import axios from "axios";
import React, { useEffect, useState } from "react";
import { LocationMasterValidationSchema, LocationUpdateSchema } from "../../ChildComponents/validations";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";

import { SelectBox } from "../../ChildComponents/SelectBox";
import { useTranslation } from "react-i18next";
import Loading from "../util/Loading";
import { SimpleCheckbox } from "../../ChildComponents/CheckBox";
import { Locality, NoofRecord,TimeSlots, AvgTimes } from "../../ChildComponents/Constants"


import { changeLanguage } from "i18next";
import { number } from "../util/Commonservices/number";
import { PreventSpecialCharacter } from "../util/Commonservices";

const HomeCollectionLocationMaster = () => {
  const [errors, setErros] = useState({});
  const [load, setLoad] = useState(false);
  const [searchLoad, setSearchLoad] = useState(false);
  const [businessZones, setBusinessZones] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCity] = useState([]);
  const [searchStates, setSearchStates] = useState([]);
  const [searchCities, setSearchCities] = useState([]);

  const [locationTable, setLocationTable] = useState([]);
  const [searchData, setSearchData] = useState({
    StateId: "",
    CityId: "",
    NoofRecord: "40",
    searchvalue: ''
  });
  const [formData, setFormData] = useState({
    BusinessZoneID: "",
    StateID: "",
    CityID: "",
    IsActive: true,
    edit: false
  });
  const [localities, setLocalities] = useState([{
    IsHomeColection: "1",
    HeadquarterID: "",
    CityZoneId: "",
    NoofSlotForApp: "1",
    OpenTime: "00:00",
    CloseTime: "23:30",
    AvgTime: "15",
    AreaName: "",
    Pincode: ""
  }]);
  const [currentLocality, setCurrentLocality] = useState({
    isHomeCollection: "1",
    HeadquarterID: "",
    CityZoneId: "",

  })

  const TimeSlot = [
    { label: '00:00', value: '00:00' },
    { label: '00:30', value: '00:30' },
    { label: '01:00', value: '01:00' },
    { label: '01:30', value: '01:30' },
    { label: '02:00', value: '02:00' },
    { label: '02:30', value: '02:30' },
    { label: '03:00', value: '03:00' },
    { label: '03:30', value: '03:30' },
    { label: '04:00', value: '04:00' },
    { label: '04:30', value: '04:30' },
    { label: '05:00', value: '05:00' },
    { label: '05:30', value: '05:30' },
    { label: '06:00', value: '06:00' },
    { label: '06:30', value: '06:30' },
    { label: '07:00', value: '07:00' },
    { label: '07:30', value: '07:30' },
    { label: '08:00', value: '08:00' },
    { label: '08:30', value: '08:30' },
    { label: '09:00', value: '09:00' },
    { label: '09:30', value: '09:30' },
    { label: '10:00', value: '10:00' },
    { label: '10:30', value: '10:30' },
    { label: '11:00', value: '11:00' },
    { label: '11:30', value: '11:30' },
    { label: '12:00', value: '12:00' },
    { label: '12:30', value: '12:30' },
    { label: '13:00', value: '13:00' },
    { label: '13:30', value: '13:30' },
    { label: '14:00', value: '14:00' },
    { label: '14:30', value: '14:30' },
    { label: '15:00', value: '15:00' },
    { label: '15:30', value: '15:30' },
    { label: '16:00', value: '16:00' },
    { label: '16:30', value: '16:30' },
    { label: '17:00', value: '17:00' },
    { label: '17:30', value: '17:30' },
    { label: '18:00', value: '18:00' },
    { label: '18:30', value: '18:30' },
    { label: '19:00', value: '19:00' },
    { label: '19:30', value: '19:30' },
    { label: '20:00', value: '20:00' },
    { label: '20:30', value: '20:30' },
    { label: '21:00', value: '21:00' },
    { label: '21:30', value: '21:30' },
    { label: '22:00', value: '22:00' },
    { label: '22:30', value: '22:30' },
    { label: '23:00', value: '23:00' },
    { label: '23:30', value: '23:30' }
  ];






  const { t } = useTranslation();


  const getStates = (value) => {
    if (value === "") {
      return
    }

    else {
      axios
        .post("/api/v1/CommonHC/GetStateData", {
          BusinessZoneID: value,
        })
        .then((res) => {
          const data = res.data.message;
          const States = data.map((ele) => {
            return {
              value: ele.ID,
              label: ele.State,
            };
          });
          setStates(States);
        })
        .catch((err) => {
          console.log(err);
        });
    }

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

  const handleSplitData = (id) => {
    const data = id.split("#")[0];
    return data;
  };



  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "BusinessZoneID") {
      getStates(value)
      setFormData({ ...formData, [name]: type === "checkbox" ? checked : value, StateID: '', CityID: '' });
      setStates([])
      setCity([])

    }

    if (name === "StateID") {
      getCity(value)
      setFormData({ ...formData, [name]: type === "checkbox" ? checked : value, CityID: '' });
      setCity([])

    }

    if (name === "CityID") {
      setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    }
    if(type==="checkbox")
    {
      setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    }

  };

  

  const getSearchCities = (id) => {

    axios
      .post("/api/v1/CommonHC/GetCityData", {
        StateId: id,
      })
      .then((res) => {
        const data = res.data.message;
        const cities = data.map((ele) => {
          return {
            value: handleSplitData(ele.ID),
            label: ele.City,
          };
        });

        setSearchCities(cities)
      })
      .catch((err) => {
        console.log(err);
      });

  }

  const handleSearchChange = (e) => {
    const { name, value } = e.target;


    if (name === "StateId") {
      console.log(value)
      getSearchCities(value);
      console.log(searchData)
      setSearchData({
        ...searchData, StateId: value, CityId: '', searchvalue: ''
      })
    }
    else if (name === 'searchvalue') {
      if (PreventSpecialCharacter(value)) { setSearchData({ ...searchData, [name]: value }) }
    }
    else {
      setSearchData({ ...searchData, [name]: value });
    }
  };

  const handleUpdate = () => {


    let obj = { ...formData, ...currentLocality }
    const generatedError = LocationUpdateSchema(obj)
    console.log(generatedError);
    if (generatedError == "") {
      setLoad(true);
      axios
        .post("/api/v1/HCLocation/UpdateLocality", { ...obj, isHomeCollection: currentLocality.isHomeCollection === true ? "1" : "0", IsActive: formData.IsActive === true ? "1" : "0" })
        .then((res) => {
          delete formData.edit
          toast.success("Updated Successfully");
          handleCancel();
          handleSearch();
          setLoad(false);
        })
        .catch((err) => {
          console.log(err);
          setLoad(false);
          toast.error("Error Occurred");
        });

    }
    else {
      console.log(generatedError)
      setErros(generatedError)
      setLoad(false);
    }

  };

  const editLocation = (ele) => {

    getStates(ele?.BusinessZoneID);
    getCity(ele?.StateID)


    setFormData({
      BusinessZoneID: `${ele?.BusinessZoneID}`,
      StateID: `${ele?.StateID}`,
      CityID: `${ele?.CityID}`,
      IsActive: ele?.active === 0 ? false : true,
      edit: true

    });

    setCurrentLocality({
      ...currentLocality,
      Locality: ele?.NAME,
      Pincode: ele?.PinCode,
      startTime: ele?.StartTime || '00:00',
      endTime: ele?.EndTime || '23:59',
      AvgTime: ele?.AvgTime || '15',
      TimeSlot: ele?.NoofSlotForApp,
      isHomeCollection: ele?.isHomeCollection === '1' ? true : false,
      TimeSlot: ele?.NoofSlotForApp || '1',
      HeadquarterID: ele?.HeadquarterID,
      LocalityId: `${ele?.ID}`
    })
    window.scroll(0, 0)
  };

  const handleSearch = () => {
    setSearchLoad(true);
    console.log(searchData);
    axios
      .post("api/v1/HCLocation/GetData", {
        ...searchData,
        NoofRecord: searchData?.NoofRecord,
      })
      .then((res) => {
        if (res?.data?.message.length > 0) {
          setLocationTable(res?.data?.message);
          setSearchLoad(false);
        }
        else {
          setLocationTable([])
          toast.error('No Record Found...')
          setSearchLoad(false);
        }

      })
      .catch((err) => {
        console.log(err);
        toast.error("Data Not Found");
        setSearchLoad(false);
      });
  };


  const formatTimeTo24Hour = (time12Hour) => {
    const [time, period] = time12Hour.split(" ");
    let [hours, minutes] = time.split(":");

    if (period === "PM") {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours.toString().padStart(2, "0")}:${minutes}`;
  };

  const handleCancel = () => {

    setFormData({
      BusinessZoneID: "",
      StateID: "",
      CityID: "",

    });
    setCurrentLocality({
      IsActive: false,
      Locality: '',
      Pincode: '',
      endTime: '',
      startTime: '',
      AvgTime: '',
      IsHomeCollection: '',
      TimeSlot: '',
      HeadquarterID: '',
      LocalityId: '',
      CityZoneId: ''
    })
    setStates([]);
    setCity([]);
    setErros({});
  };

  const checkLocalitydata = () => {
    const msg = ""
  // let i=0;
    // let flag=true;
    // console.log(localities)
    // while(i<localities.length)
    // {
    //  if(localities[i].AreaName=="" || localities[i].Pincode==""||localities[i].OpenTime==""||
    //  localities[i].CloseTime==""||localities[i].AvgTime=="" || localities[i].NoofSlotForApp=="") 
    //  {
    //   flag=false;
    //   return flag;
    //  }
    //  i++
    // }
    // return flag;
  }
  function checkAreaname(data){
    for (let i = 0; i < data.length; i++) {
      if (data[i].AreaName.trim() =='') {
          return false
      }
      
  }
  return true;
  }

  const handleSubmit = () => {
    const generatedError = LocationMasterValidationSchema(formData);

    const checkLocalities = localities;
console.log(checkLocalities);
    checkLocalities.forEach(object => {
      delete object['HeadquarterID'];
      delete object['CityZoneId'];
    }); 
    console.log(checkLocalities);
         console.log(checkAreaname(checkLocalities))
    if(checkAreaname(checkLocalities))
    {
      const emptyKeys = checkLocalities.flatMap(obj =>
        Object.keys(obj).filter(key => !obj[key])
      );
  
      const Pincodelist = checkLocalities.filter(item => {
        return item.Pincode.length != 6
      })
     
  
      const wrongPincodes = Pincodelist.flatMap((item) => {
        if (item.Pincode.length != 6) {
          return item.AreaName;
        }
      })
  
      const DuplicateLocality = checkDuplicateLocality();
  
      const concatenatedAreaName = wrongPincodes.join(',');
      const concatenatedKeys = emptyKeys.join(',');
      let DuplicateLocalityError;
      if (typeof (DuplicateLocality) == 'object') {
        DuplicateLocalityError = DuplicateLocality.join(',')
      }
  
      if (concatenatedKeys === "" && concatenatedAreaName === "" && DuplicateLocality === "") {
        if (generatedError === "") {
          setLoad(true);
          delete formData.edit;
  
          const AriaDetailsData = localities.map((item) => {
            return { ...item, ...formData }
          })
          axios.post("/api/v1/HCLocation/SaveLocality", {
            AriaDetailsData
          })
            .then((res) => {
              if (res.data.message) {
                console.log(res.data.message)
                setLoad(false);
                handleCancel();
                setLocalities([{
                  isHomeColection: "1",
                  HeadquarterID: "",
                  CityZoneId: "",
                  NoofSlotForApp: "",
                  OpenTime: "00:00",
                  CloseTime: "23:30",
                  AvgTime: "",
                  AreaName: "",
                  Pincode: ""
                }])
                toast.success(res.data.message ? res.data.message : "Saved Successfully");
              }
            })
            .catch((err) => {
              console.log(err);
              setLoad(false);
              toast.error(err?.response?.data?.message);
            });
        } else {
          setErros(generatedError);
          setLoad(false);
        }
  
      }
      else {
  
        if (concatenatedKeys.length > 0) {
          toast.error(`${concatenatedKeys} not filled`)
        }
        else if (concatenatedAreaName.length > 0) {
  
          toast.error(`Wrong Pincode at ${concatenatedAreaName}`)
        }
        else if (DuplicateLocality.length > 0) {
          toast.error(DuplicateLocalityError);
        }
      }
    }
    else{
      toast.error("Enter Area Name")
    }
    
  };


  const getBusinessZones = () => {
    axios
      .get("/api/v1/CommonHC/GetZoneData")
      .then((res) => {
        let data = res.data.message;
        let BusinessZones = data.map((ele) => {
          return {
            value: ele.BusinessZoneID,
            label: ele.BusinessZoneName,
          };
        });
        BusinessZones.unshift({ label: t("Select Business Zone"), value: "" });
        setBusinessZones(BusinessZones);
      })
      .catch((err) =>
        toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong")
      );
  };
  const checkDuplicateLocality = () => {

    const seenCombinations = {};
    const duplicateEntries = [];

    for (let item of localities) {
      const areaName = item['AreaName'].trim().toLowerCase();
      const pincode = item['Pincode'];
      const combination = `${areaName}-${pincode}`;

      if (seenCombinations[combination]) {
        duplicateEntries.push(`Duplicate Entry of ${areaName}`);
      } else {
        seenCombinations[combination] = true;
      }
    }
    if (duplicateEntries.length > 0) {
      return duplicateEntries;
    }
    else {
      return '';
    }

  }



  const getSearchStates = () => {
    axios
      .post("/api/v1/CommonHC/GetStateData", {
        BusinessZoneID: 0,
      })
      .then((res) => {
        const data = res.data.message;
        const States = data.map((ele) => {
          return {
            value: ele.ID,
            label: ele.State,
          };
        });
        States.unshift({ label: t("Select State"), value: "" });
        setSearchStates(States);
      })
      .catch((err) => {
        console.log(err);
      });

  }
   

  console.log(formData);

  const localityChangeHander = (index, e) => {
    const { name, value, type, checked } = e?.target;
    const newData = [...localities]
    if (formData?.edit) {
      if (name === 'Pincode') {
        if (value.length <= 6) {
          setCurrentLocality({ ...currentLocality, [name]: value })
        }

      }
      else if(name==='startTime')
      {
        if (value < currentLocality?.endTime) {
            
          setCurrentLocality({
            ...currentLocality, [name]: value
          })
        }
      }
      else if(name==='endTime')
      {
        if(value>currentLocality?.startTime)
        {
          setCurrentLocality({
            ...currentLocality,[name]:value
          })
        }
      }
      else {
        setCurrentLocality({
          ...currentLocality, [name]: type === "checkbox" ?
            checked : value
        })
      }

    }

    else {
      if (name == 'Pincode') {

        if (value.length <= 6) {
          newData[index] = {
            ...newData[index],
            [name]: `${value}`
          }
        }


      }
      else if (name === 'AreaName') {
        if (PreventSpecialCharacter(value)) {
          newData[index] = {
            ...newData[index],
            [name]: value
          }
        }
      }
      else if (name === 'OpenTime') {
        console.log(value, localities[index]['CloseTime'])
        if (value < localities[index]['CloseTime']) {
          newData[index] = {
            ...newData[index],
            [name]: value
          }
        };

      }
      else if (name === 'CloseTime') {
        if (value > localities[index]['OpenTime']) {
          newData[index] = {
            ...newData[index],
            [name]: value
          }
        };
      }
      else {


        newData[index] = {
          ...newData[index],
          [name]: value
        }

      };

      setLocalities(newData)
    }


  }





  const addLocalityHandler = (index) => {


    const checkLocalities = localities;

    checkLocalities.forEach(object => {
      delete object['HeadquarterID'];
      delete object['CityZoneId'];
    });

    const emptyKeys = checkLocalities.flatMap(obj =>
      Object.keys(obj).filter(key => !obj[key].trim())
    );

    const concatenatedKeys = emptyKeys.join(',');
    console.log(concatenatedKeys);
    if (concatenatedKeys == "" || containsOnlyOneCharacter(concatenatedKeys)) {
      const nextLocality =
      {
        IsHomeColection: "1",
        HeadquarterID: "",
        CityZoneId: "",
        NoofSlotForApp: "1",
        OpenTime: "00:00",
        CloseTime: "23:30",
        AvgTime: "15",
        AreaName: "",
        Pincode: ""
      }
      setLocalities([...localities, nextLocality])


    }
    else {
      toast.error(`${concatenatedKeys} not filled`)
    }
  }



  const removeLocality = (i) => {

    if (localities.length > 1) {
      const newLocalities = localities.filter((ele, index) => {
        return index !== i
      })
      console.log(newLocalities)
      setLocalities(newLocalities)
    }
    else if (localities.length == 1) {
      setLocalities([{
        IsHomeColection: "1",
        HeadquarterID: "",
        CityZoneId: "",
        NoofSlotForApp: "1",
        OpenTime: "00:00",
        CloseTime: "23:30",
        AvgTime: "15",
        AreaName: "",
        Pincode: ""
      }])
    }
  }


  function containsOnlyOneCharacter(str) {
    for (let i = 1; i < str.length; i++) {
      if (str[i] !== str[0]) {
        return false;
      }
    }
    return true;
  }

  useEffect(() => {
    getBusinessZones();
    getSearchStates();
  }, []);


  return (
    <>
      <div className="box with-border">
        <div className="box box-header with-border box-success">
          <h3 className="box-title text-center">{t("Home Collection Location Master")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label
              className="col-sm-2 "
              htmlFor="BusinessZone"
              style={{ textAlign: "end" }}
            >
              {t("Business Zone")}:
            </label>
            <div className="col-sm-2">
              <SelectBox
                options={businessZones}
                name="BusinessZoneID"
                className="input-sm"
                selectedValue={formData?.BusinessZoneID}
                onChange={handleChange}
              />

              {formData?.BusinessZoneID === "" && (
                <span className="golbal-Error">{errors?.BusinessZoneID}</span>
              )}
            </div>
            <label
              className="col-sm-1"
              htmlFor="State"
              style={{ textAlign: "end" }}
            >
              {t("State")} :
            </label>
            <div className="col-sm-2">
              <SelectBox
                options={[{ label: 'Select State', value: '' }, ...states]}
                name="StateID"
                className="input-sm"
                selectedValue={formData?.StateID}
                onChange={handleChange}
              />
              {formData?.StateID === "" && (
                <span className="golbal-Error">{errors?.StateID}</span>
              )}
            </div>
            <label
              className="col-sm-1"
              htmlFor="City"
              style={{ textAlign: "end" }}
            >
              {t("City")} :
            </label>
            <div className="col-sm-2 ">
              <SelectBox
                options={[{ label: 'Select City', value: '' }, ...cities]}
                name="CityID"
                className="input-sm"
                selectedValue={formData.CityID}
                onChange={handleChange}
              />
              {formData?.CityID === "" && (
                <span className="golbal-Error">{errors?.CityID}</span>
              )}
            </div>
            <div className="col-md-2">
              <SimpleCheckbox
                name="IsActive"
                type="checkbox"
                onChange={handleChange}
                checked={formData.IsActive}
              />
              <label htmlFor="IsActive" className="control-label">
                {t("IsActive")}
              </label>
            </div>
          </div>
          {formData.edit &&
            <div className="row">

              <label
                className="col-sm-2"
                htmlFor="State"
                style={{ textAlign: "end" }}
              >
                {t("Location")} :
              </label>
              <div className="col-sm-2">
                <Input
                  name="Locality"
                  className="form-control input-sm"
                  value={currentLocality?.Locality}

                  onChange={(e) => {
                    localityChangeHander(0, e)
                  }}
                />
                  {currentLocality?.Locality =="" && (
                <span className="golbal-Error">{errors?.Locality}</span>
              )}
              </div>
              <label
                className="col-sm-1"
                htmlFor="City"
                style={{ textAlign: "end" }}
              >
                {t('Pincode')} :
              </label>
              <div className="col-sm-2 ">
                <Input

                  name="Pincode"
                  className="form-control input-sm"
                  value={currentLocality?.Pincode}
                  onInput={(e) => number(e, 6)}
                  onChange={(e) => {
                    localityChangeHander(0, e)
                  }}

                
                />
                
                {currentLocality?.Pincode =="" && (
                <span className="golbal-Error">{errors?.Pincode}</span>
              )}
              
              {currentLocality?.Pincode != "" && currentLocality?.Pincode.trim().length!=6 && (
                <span className="golbal-Error">{errors?.PincodeLength}</span>
              )}

              </div>

              <div className="col-md-2">
                <SimpleCheckbox
                  name="isHomeCollection"
                  type="checkbox"
                  checked={currentLocality.isHomeCollection}
                  onChange={(e) => {
                    localityChangeHander(0, e)
                  }}

                />
                <label htmlFor="IsHomeCollection" className="control-label">
                  {t("IsHomeCollection")}
                </label>
              </div>
            </div>}
          {
            formData.edit && currentLocality.isHomeCollection == '1' &&
            <div className="row">

              <label
                className="col-sm-2"
                htmlFor="OpeningTime"
                style={{ textAlign: "end" }}
              >
                {t("Opening Time")} :
              </label>
              <div className="col-sm-2">
                <SelectBox

                  name="startTime"
                  className="form-control input-sm"
                  selectedValue={currentLocality?.startTime}
                  onChange={(e) => {
                    localityChangeHander(0, e)
                  }}
                  options={TimeSlot}
                />

              </div>
              <label
                className="col-sm-1"
                htmlFor="OpeningTime"
                style={{ textAlign: "end" }}
              >
                {t("Closing Time")} :
              </label>
              <div className="col-sm-2">
                <SelectBox

                  name="endTime"
                  className="form-control input-sm"
                  selectedValue={currentLocality?.endTime}
                  onChange={(e) => {
                    localityChangeHander(0, e)
                  }}
                  options={TimeSlot}
                />

              </div>
              <label
                className="col-sm-1"
                htmlFor="Avg Time"
                style={{ textAlign: "end" }}
              >
                {t("Avg Time")} :
              </label>
              <div className="col-sm-1">
                <SelectBox

                  name="AvgTime"
                  className="form-control input-sm"
                  selectedValue={currentLocality?.AvgTime}
                  options={AvgTimes}
                  onChange={(e) => {
                    localityChangeHander(0, e)
                  }}
                />

              </div>
              <label
                className="col-sm-1"
                htmlFor="Time Slot"
                style={{ textAlign: "end" }}
              >
                {t("Time Slot")} :
              </label>
              <div className="col-sm-1">
                <SelectBox

                  name="TimeSlot"
                  className="form-control input-sm"
                  selectedValue={currentLocality?.TimeSlot}
                  options={TimeSlots}
                  onChange={(e) => {
                    localityChangeHander(0, e)
                  }}
                />

              </div>



            </div>
          }

          {!formData.edit && <div className="box  form-horizontal">
            <div className="box-header with-border">
              <h3 className="box-title">Area Details</h3>
            </div>
            <div
              className="box-body"

            >


              <div className="row d-flex">
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf text-center" style={{ zIndex: 99 }}>
                    <tr>
                      <th className="text-center">{t("Add")}</th>
                      <th className="text-center">{t("Location")}</th>
                      <th className="text-center">{t("Pincode")}</th>
                      <th className="text-center">&nbsp;&nbsp;{t("Start Time")}&nbsp;</th>
                      <th className="text-center">{t("Closing Time")}</th>
                      <th className="text-center">{t("Avg Time")}</th>
                      <th className="text-center">{t("Time Slot")}</th>
                      <th className="text-center">{t("Remove")}</th>
                    </tr>
                    <>
                      {localities.map((locality, index) => (
                        <tr key={index}>
                          <td data-title="Add">
                            <button disabled={localities.length !== index + 1} style={{ fontSize: '15px' }} onClick={() => {
                              addLocalityHandler(index)
                            }}>+</button>
                          </td>
                          <td>
                            <Input
                              className="form-control input-sm"
                              name="AreaName"
                              value={localities[index]?.AreaName}
                              onChange={(e) =>
                                localityChangeHander(index, e)
                              }
                            />
                          </td>
                          <td>
                            <Input
                              className="form-control input-sm"
                              name="Pincode"
                              type="number"
                              value={locality?.Pincode}
                              onInput={(e) => number(e, 6)}


                              onChange={(e) =>
                                localityChangeHander(index, e)
                              }
                            />
                          </td>
                          <td >
                            <SelectBox
                              className="form-control input-sm"
                              name="OpenTime"
                              options={[...TimeSlot]}
                              onChange={(e) =>
                                localityChangeHander(index, e)
                              }
                              selectedValue={locality?.OpenTime} />
                          </td>
                          <td>
                            <SelectBox
                              className="form-control input-sm"
                              name="CloseTime"
                              options={[...TimeSlot]}
                              onChange={(e) =>
                                localityChangeHander(index, e)
                              }
                              selectedValue={locality?.CloseTime} />
                          </td>
                          <td>
                            <SelectBox
                              className="form-control input-sm"
                              name="AvgTime"
                              value={locality.AvgTime}
                              onChange={(e) =>
                                localityChangeHander(index, e)
                              }
                              options={[...AvgTimes]}
                            />

                          </td>
                          <td>
                            <SelectBox
                              className="form-control input-sm"
                              name="NoofSlotForApp"
                              value={locality.NoofSlotForApp}
                              onChange={(e) =>
                                localityChangeHander(index, e)
                              }
                              options={[...TimeSlots]}
                            />


                          </td>
                          <td>
                            <button onClick={() => removeLocality(index)}>X</button>
                          </td>
                        </tr>
                      ))}

                    </>
                  </thead>

                </table>
              </div>
            </div>
          </div>}
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
                  className={`btn btn-block ${formData?.edit ? "btn-warning" : "btn-success"
                    } btn-sm`}
                  onClick={formData?.edit ? handleUpdate : handleSubmit}
                >
                  {formData?.edit ? t("Update") : t("Save")}
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
                  options={searchStates}
                  name="StateId"
                  className="input-sm"
                  selectedValue={searchData?.StateId}
                  onChange={handleSearchChange}
                />
              </div>

              <div className="col-sm-12 col-md-2">
                <SelectBox
                  options={[
                    { label: "Select City", value: "" },
                    ...searchCities,
                  ]}
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
                  name="searchvalue"
                  value={searchData.searchvalue}
                  placeholder="Location"
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
                    onClick={handleSearch}
                  >
                    {t("Search")}
                  </button>
                )}
              </div>
              <div className="col-md-1">
              </div>
            </div>
          </div>
          <div className="box">
            <div
              className="box-body divResult boottable table-responsive"
              id="no-more-tables"
            >
              {locationTable?.length > 0 && <div className="row">
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf text-center" style={{ zIndex: 99 }}>
                    <tr>
                      <th className="text-center">{t("#")}</th>
                      <th className="text-center">{t("Select")}</th>
                      <th className="text-center">{t("Location Name")}</th>
                      <th className="text-center">{t("Business Zone")}</th>
                      <th className="text-center">{t("State")}</th>
                      <th className="text-center">{t("City")}</th>
                      <th className="text-center">{t("Pincode")}</th>
                      <th className="text-center">{t("Status")}</th>
                      <th className="text-center">{t("IsHomecollection")}</th>
                      <th className="text-center">{t("Opening Time")}</th>
                      <th className="text-center">{t("Closing Time")}</th>
                      <th className="text-center">{t("Avg Time")}</th>
                      <th className="text-center">{t("Time Slot")}</th>
                    </tr>
                  </thead>

                  <tbody>
                    {locationTable.map((ele, index) => (
                      <>
                        <tr key={ele.ID}>
                          <td data-title="#" className="text-center">
                            {index + 1}
                          </td>
                          <td data-title="Select" className="text-center">
                            <button
                              type="button"
                              className="btn btn-primary btn-sm"
                              onClick={() => editLocation(ele)}
                            >
                              Select
                            </button>
                          </td>
                          <td data-title="Location Name" className="text-center">
                            {ele.NAME}
                          </td>
                          <td data-title="Business Zone" className="text-center">
                            {ele.BusinessZoneName}
                          </td>
                          <td data-title="State" className="text-center">
                            {ele.state}
                          </td>
                          <td data-title="City" className="text-center">
                            {ele.City}
                          </td>
                          <td data-title="Pincode" className="text-center">
                            {ele.PinCode}
                          </td>
                          <td data-title="Status" className="text-center">
                            {ele.active === 1 ? "Active" : "Inactive"}
                          </td>
                          <td data-title="IsHomecollection" className="text-center">
                            {ele.isHomeCollection}
                          </td>
                          <td data-title="Opening Time" className="text-center">
                            {ele.StartTime}
                          </td>
                          <td data-title="Closing Time" className="text-center">
                            {ele.EndTime}
                          </td>
                          <td data-title="Avg Time" className="text-center">
                            {ele.AvgTime}
                          </td>
                          <td data-title="Time Slot" className="text-center">
                            {ele.NoofSlotForApp}
                          </td>
                        </tr>
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
              }
            </div>
          </div>
        </div>
      </div>


    </>
  );
};

export default HomeCollectionLocationMaster;
