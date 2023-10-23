
import React, { useCallback, useEffect } from "react";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Loading from "../util/Loading";
import axios from "axios";
import { toast } from "react-toastify"
import PhelboImage from '../../images/PhelboImage.jpg'
import { Image } from "react-bootstrap";
import Timer from "../util/Commonservices/Timer";
import DatePicker from "../Components/DatePicker";
import moment from "moment";
import { SelectBoxWithCheckbox } from "../../ChildComponents/SelectBox";
import { number } from "../../util/Commonservices/number";
import { Link } from 'react-router-dom';

import { PhelboAuthenticationSchema, Otpschema } from "../../ChildComponents/validations";

import {
    PhelboSearchTypes, Phelboweekoff, Phelborecordoptions, PhelboSources,
    PhelbosearchDefault
} from "../../ChildComponents/Constants";

import { PreventSpecialCharacterandNumber, PreventSpecialCharacter } from "../util/Commonservices";



const TemporaryPhelebotomist = () => {
    const [errors, setErros] = useState({})
    const [formData, setFormData] = useState({
        Name: '',
        Age: new Date(),
        Gender: '',
        mobile: '',
        Email: '',
        P_Address: '',
        P_Pincode:'',
        P_City:'',
        otp:'',
        Vehicle_Num: '',
        DrivingLicence: '',
        DocumentType: '',
        DocumentNo: '',
        Data:[
        {

        
        }
      ],
      StateId:'',
      CityId:''
    })
    const handleSelectChange = (event) => {
        const { name, value, checked, type } = event?.target;
  if (name === 'Name' || name === 'FatherName' || name === 'MotherName' || name === 'P_City') {
            setFormData({
                ...formData,
                [name]: PreventSpecialCharacterandNumber(value) ? value : formData[name]
            });
        }
        else if (name == 'Mobile' || name == 'Other_Contact') {

            setFormData({ ...formData, [name]: `${value}` })
        }
        else if (name == 'P_Pincode') {
            if (value.length <= 6) {
                setFormData({ ...formData, [name]: `${value}` })
            }
        }
        else if (name === 'PanNo') {
            setFormData({
                ...formData,
                [name]: PreventSpecialCharacter(value) ? value : formData[name]
            });
        }
        else {
            setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        }





    };
    
    const [loading, setLoading] = useState(false);
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [gender, setGender] = useState([]);
    const [showTimer, setShowTimer] = useState(false);
    const DocumentType = ([{label:'Pan Card',value:'Pan Card'},{label:'Aaadhar Card',value:'Aadhar Card'},{label:'Vehicle',value:'Vehicle'},{label:'Driving License',value:'Driving License'},{label:'Passport',value:'Passport'}]);

    const { t } = useTranslation();

    const fetchCities = (id) => {
        const postdata = {
            StateId: id
        }

        axios.post('api/v1/CommonHC/GetCityData', postdata).then((res) => {
            let data = res.data.message;
             
            let value = data.map((ele) => {
                return {
                    value: ele.ID,
                    label: ele.City,
                };
            });
    
             console.log(value);

            setCities(value)



        }).catch((err) => {
            toast.error("Something Went wrong")
        })
    }
    const fetchStates = () => {

        axios.post('api/v1/CommonHC/GetStateData', {
            BusinessZoneID: 0
        }).then((res) => {
            let data = res.data.message;


            let value = data.map((ele) => {
                return {
                    value: ele.ID,
                    label: ele.State,

                }
            });
            setStates(value)

        })
            .catch((err) => {

                toast.error('Something went wrong')
            })
    }
    const dateSelect = (date, name, value) => {
        setFormData({
            ...formData,
            [name]: date,
        });
    }
    const handleSelectMultiChange = (select, name) => {
        if (name === 'StateId') {
            const val = select.map((ele) => { return ele?.value });
    
       setFormData({ ...formData, [name]: val,CityId:''})
            if (val.length > 0) {
               
                fetchCities(val)
            }
        }
        else {
            const val = select?.map((ele) => ele?.value)
            setFormData({ ...formData, [name]: val })
        }
    };
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const formdataSaveHandler = () => {
     
         console.log(formData?.CityId);

        const generatedError = PhelboAuthenticationSchema(formData);

        console.log(generatedError)
        if (generatedError === "") {
            setLoading(true);
              console.log(formData?.StateId,formData?.CityId)

              const data = formData?.CityId.map(item => {
                
                return { item };
              });

              const updatedFormData = {
                ...formData,
                Age: moment(formData?.Age).format("DD/MMM/YYYY"),
                Name: formData?.Name.trim(),
                P_Address: formData?.P_Address ? formData?.P_Address.trim() : '',
                P_City: formData?.P_City ? formData?.P_City.trim() : '',
                Email: formData?.Email.trim(),
                DrivingLicence: formData?.DrivingLicence.trim(),
                DocumentNo: formData?.DocumentNo ? formData?.DocumentNo.trim() : '',
                Vehicle_Num:formData?.Vehicle_Num.trim(),
                Data:formData?.CityId
            };  
              delete updatedFormData.StateId
              delete updatedFormData.CityId

              console.log(updatedFormData);

            axios.post("api/v1/TemporaryPhelebotomist/SavePhelebotomist", updatedFormData
            )
                .then((res) => {
                    if (res.data.message) {
                        setLoading(false);
                     toast.success(res?.data?.message? res?.data?.message:'Saved Successfully');
                     setShowTimer(false)
                     setFormData({})
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    toast.error(err?.response?.data.message ? err?.response?.data.message : 'Something Went wrong')
                });

            setLoading(false);
        }
        else
        {
         setErros(generatedError);
         setLoading(false);
        }
    }

    const getDropDownData = (name) => {

        axios
            .post("/api/v1/Global/getGlobalData", { Type: name })
            .then((res) => {
                let data = res.data.message;
                let value = data.map((ele) => {
                    return {
                        value: ele.FieldName,
                        label: ele.FieldDisplay,
                    };
                });
                name !== "Title" &&
                    value.unshift({ label: `Select ${name} `, value: "" });


                setGender(value);

            })
            .catch((err) => {
                toast.error(err?.res?.data ? err?.res?.data : 'Something Went wrong')
            });
    }; 


    

    useEffect(() => {
        getDropDownData('Gender')
        fetchStates();

    }, [])

    const OtpGenerateHandle = () => {
        console.log(formData);
        const err = Otpschema(formData);
        if (err == '') {
            
    axios.post('/api/v1/TemporaryPhelebotomist/GenerateOTP',
                {
                  MobileNo:formData?.mobile
                }
            )
            .then((res)=>{
                toast.success(res?.data?.message)
            })
            .catch((err)=>{
                toast.error(err?.response?.data?.message)
            })


            setShowTimer(true)
        }
        setErros(err);

    }
    
    const onTimerFinish = () => {
        
        setShowTimer(false); 
      };
      

    return (
        <div className="box box-success form-horizontal">
            <div className="box-header with-border">
                <h3 className="box-title">Temporary Phelebotomist Authentication</h3>

            </div>
            <div
                className="box-body"
            >

                <div className="row">

                    <div className="row">


                        <label className="col-sm-1" htmlFor="inputEmail3" >
                            Name:
                        </label>
                        <div className="col-sm-2">
                            <Input
                                className="form-control input-sm"
                                name='Name'
                                onChange={handleSelectChange}
                                value={formData?.Name}
                            />
                            {formData?.Name === "" && (
                                <span className="golbal-Error">{errors?.Name}</span>
                            )}

                        </div>
                        <label className="col-sm-1" htmlFor="inputEmail3" >
                            DOB:
                        </label>
                        <div className="col-sm-2">
                            <DatePicker
                                className="form-control input-sm"
                                name='Age'
                                onChange={dateSelect}
                                date={formData?.Age}
                                maxDate={new Date()}
                            />
                            {formData?.Age === "" && (
                                <span className="golbal-Error">{errors?.Age}</span>
                            )}
                        </div>
                        <label className="col-sm-1" htmlFor="inputEmail3" >
                            Gender:
                        </label>
                        <div className="col-sm-2">
                            <SelectBox
                                name="Gender"
                                className="select-input-box form-control input-sm"
                                options={gender}
                                onChange={handleSelectChange}
                                selectedValue={formData?.Gender}
                            />
                            {formData?.Gender === "" && (
                                <span className="golbal-Error">{errors?.Gender}</span>
                            )}
                        </div>
                        <label className="col-sm-1" htmlFor="inputEmail3" >
                            City:
                        </label>
                        <div className="col-sm-2">
                            <Input
                                className="form-control input-sm"
                                name='P_City'
                                onChange={handleSelectChange}
                                value={formData?.P_City}
                            />

                        </div>


                    </div>
                </div>
                <div className="row">
                    <label className="col-sm-1" htmlFor="inputEmail3" >
                        Address:
                    </label>
                    <div className="col-sm-2">
                        <Input
                            className="form-control input-sm"
                            name='P_Address'
                            onChange={handleSelectChange}
                            value={formData?.P_Address}
                        />
                        {formData?.P_Address === "" && (
                            <span className="golbal-Error">{errors?.P_Address}</span>
                        )}

                    </div>

                    <label className="col-sm-1" htmlFor="inputEmail3 " >
                        Pincode:
                    </label>
                    <div className="col-sm-2">
                        <Input
                            type='number'
                            name="P_Pincode"
                            className="select-input-box form-control input-sm"
                            onChange={handleSelectChange}
                            value={formData?.P_Pincode}
                        /> 
                          {formData?.P_Pincode==="" && (
                            <span className="golbal-Error">{errors?.Pincode}</span>
                          )}
                          {formData?.P_Pincode != "" && formData?.P_Pincode.length!=6 && (
                            <span className="golbal-Error">{errors?.PincodeInvalid}</span>
                        )}
                    </div>
                    <label className="col-sm-1" htmlFor="inputEmail3" >
                        Mobile:
                    </label>
                    <div className="col-sm-2">
                        <Input
                            className="form-control input-sm"
                            name='mobile'
                            type="number"
                            onInput={(e) => number(e, 10)}
                            onChange={handleSelectChange}
                            value={formData?.mobile}
                        />
                        {formData?.mobile === "" && (
                            <span className="golbal-Error">{errors?.Mobileempty}</span>
                        )}
                        {formData?.mobile.length > 0 && formData?.mobile.length !== 10 && (
                            <span className="golbal-Error">{errors?.Mobileinvalid}</span>
                        )}



                    </div>
                    <label className="col-sm-1" htmlFor="inputEmail3" >
                        Email:
                    </label>
                    <div className="col-sm-2">
                        <Input
                            name="Email"
                            type="email"
                            className="select-input-box form-control input-sm"
                            onChange={handleSelectChange}
                            value={formData?.Email}
                        />
                        {formData?.Email === "" && (
                            <span className="golbal-Error">{errors?.Emailempty}</span>
                        )}
                        {
                            !emailRegex.test(formData?.Email) && formData?.Email.length > 0 && (
                                <span className="golbal-Error">{errors?.Emailvalid}</span>
                            )
                        }

                    </div>
                </div>
                <div className="row">

                    <label className="col-sm-1" htmlFor="inputEmail3" >
                        Document Type:
                    </label>
                    <div className="col-sm-2">
                        <SelectBox
                            className="form-control input-sm"
                            name='DocumentType'
                            onChange={handleSelectChange}
                            options={[
                                { label: "Choose ID", value: "" },
                                ...DocumentType,
                            ]}
                            selectedValue={formData?.DocumentType}
                        />
                        {formData?.DocumentType === "" && (
                            <span className="golbal-Error">{errors?.P_Address}</span>
                        )}

                    </div>
                    <label className="col-sm-1" htmlFor="inputEmail3" >
                        Document No.:
                    </label>
                    <div className="col-sm-2">
                        <Input

                            name="DocumentNo"
                            className="select-input-box form-control input-sm"
                            onChange={handleSelectChange}
                            value={formData?.DocumentNo}
                            max={14}
                        />
                        {formData?.DocumentNo === "" && (
                            <span className="golbal-Error">{errors?.P_Address}</span>
                        )}

                    </div>
                    <label className="col-sm-1" htmlFor="inputEmail3" >
                        State:
                    </label>
                    <div className="col-sm-2">
                        <SelectBoxWithCheckbox

                            name='StateId'
                            onChange={handleSelectMultiChange}

                            options={states}
                            value={formData?.StateId}

                        />
                        {formData?.StateId === "" && (
                            <span className="golbal-Error">{errors?.State}</span>
                        )}

                    </div>
                    <label className="col-sm-1" htmlFor="inputEmail3" >
                        City:
                    </label>
                    <div className="col-sm-2">
                        <SelectBoxWithCheckbox
                            name="CityId"
                            onChange={handleSelectMultiChange}
                            value={formData?.CityId}
                            options={cities}
                        />
                        {formData?.CityId === "" && (
                            <span className="golbal-Error">{errors?.City}</span>
                        )}

                    </div>

                </div>
                <div className="row">
                    <label className="col-sm-1" htmlFor="inputEmail3" >
                        Vehicle No. :
                    </label>
                    <div className="col-sm-2">
                        <Input
                            className="form-control input-sm"
                            name='Vehicle_Num'
                            onChange={handleSelectChange}
                            value={formData?.Vehicle_Num}
                        />

                    </div>
                    <label className="col-sm-1" htmlFor="inputEmail3" >
                        Driving License:
                    </label>
                    <div className="col-sm-2">
                        <Input
                            name="DrivingLicence"
                            className="select-input-box form-control input-sm"
                            onChange={handleSelectChange}
                            value={formData?.DrivingLicence}
                        />

                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-1 col-xs-12">
                        <button
                            type="button"
                            className="btn btn-block btn-warning btn-sm"
                            onClick={OtpGenerateHandle}
                        >
                            {t("Generate OTP")}
                        </button>
                    </div>
                    <div className="col-sm-1 ">
                        <Input name="otp"
                            className="form-control input-sm"
                            type="text"
                            max={6}
                            onChange={handleSelectChange}
                            value={formData?.otp} />
                            {formData?.otp=== "" && (
                            <span className="golbal-Error">{errors?.otp}</span>
                        )}
                    </div>

                    {showTimer &&
                        <div className="col-sm-2" style={{ display: "flex"}}>
                            <span style={{marginRight:"10px"}}>Otp Expires in</span>
                            <span><Timer onTimerFinish={onTimerFinish} /></span>
                        </div>

                    }
                    <div className="col-sm-1 col-xs-12">
                        <button
                            type="button"
                            className="btn btn-block btn-success btn-sm"
                            onClick={formdataSaveHandler}
                        >
                            {t("Save")}
                        </button>
                    </div>

                    <div className="col-sm-1 col-xs-12" style={{width:'15px'}}>
                    <Link  className="box-title center" to="/PhelebotomistRegisteration">Back</Link>
                    </div>

                </div></div>
        </div>)
}

export default TemporaryPhelebotomist
