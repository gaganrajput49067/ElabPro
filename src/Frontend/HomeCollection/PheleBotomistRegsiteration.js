import React, { useCallback, useEffect } from "react";
import Input from "../../ChildComponents/Input";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Loading from "../../util/Loading";
import axios from "axios";
import { toast } from "react-toastify"
import PhelboImage from '../../images/PhelboImage.jpg'
import Reload from '../../images/Reload.jpg'
import { Image } from "react-bootstrap";
import DatePicker from "../Components/DatePicker";
import { SelectBox } from "../../ChildComponents/SelectBox";

import moment from "moment";
import { SelectBoxWithCheckbox } from "../../ChildComponents/SelectBox";
import { number } from "../util/Commonservices/number";

import { PhelbotomistValidationSchema } from "../../ChildComponents/validations";

import {
    PhelboSearchTypes, Phelboweekoff, Phelborecordoptions, PhelboSources,
    PhelbosearchDefault
} from "../../ChildComponents/Constants";

import { PreventSpecialCharacterandNumber, PreventSpecialCharacter, PreventNumber, PreventCharacter } from "../util/Commonservices";
import { Link } from 'react-router-dom';
import { SimpleCheckbox } from "../../ChildComponents/CheckBox";


const PheleBotomistRegisteration = () => {
    const [errors, setErros] = useState({})

    const { t } = useTranslation();

    const [formData, setFormData] = useState({
        Name: '',
        IsActive: false,
        Age: new Date(),
        Gender: '',
        Mobile: '',
        Other_Contact: '',
        Email: '',
        FatherName: '',
        MotherName: '',
        P_Address: '',
        BloodGroup: '',
        Qualification: '',
        Vehicle_Num: '',
        DrivingLicence: '',
        PanNo: '',
        DocumentType: '',
        DocumentNo: '',
        JoiningDate: new Date(),
        DeviceID: '',
        UserName: '',
        Password: '',
        PhelboSource: '',
        WeakOff: '',
        LoginTime: '08:00',
        LogoutTime: '18:00',
        StateId: '',
        CityId: '',
        P_Pincode: '',
        P_City: ''
    })
    const [PhelboCharges, setPhelboCHarges] = useState([])
    const [DocumentType, setDocumentType] = useState([])
    const [searchData, setSearchData] = useState(PhelbosearchDefault)
    const [states, setStates] = useState([])
    const [cities, setCities] = useState([])
    const [loading, setLoading] = useState(false);
    const [gender, setGender] = useState([]);
    const [BloodType, setBloodType] = useState([]);
    const [phlebochargedata, setphlebochargedata] = useState([])
    const [selectCharge, setSelectcharge] = useState({
        ChargeName: '',
        ChargeId: '',
        ChargeAmount: '',
        Fromdate: new Date(),
        Todate: new Date(new Date().getTime() + 86400000)
    })
    const [PhleboTable, setPhleboTable] = useState([])

    // const DocumentTypes=[{
    //     label:'Pan Card',value:'Pan Card'
    //     },{label:'Aadhaar Card',value:'Aadhaar Card'},{label:'Voter Id',value:'Voter Id'}]

    console.log(DocumentType);

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
        if (name === 'Fromdate' || name === 'Todate') {

            if (name === "Fromdate") {
                setSelectcharge({ ...selectCharge, [name]: date, Todate: new Date(date.getTime() + 86400000) })
            }
            else {
                setSelectcharge({ ...selectCharge, [name]: date })
            }
        }
        else {
            setFormData({
                ...formData,
                [name]: date,
            });
        }

    };
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
        else if (name === 'PanNo' || name === 'DocumentNo') {
            setFormData({
                ...formData,
                [name]: PreventSpecialCharacter(value) ? value : formData[name]
            });
        }
        else if (name === 'LogoutTime') {
            if (value > formData?.LoginTime) {
                setFormData({ ...formData, [name]: value })
            }
        }
        else if (name === 'LoginTime') {
            if (value < formData?.LogoutTime) {
                setFormData({ ...formData, [name]: value })
            }
        }
        else if (name === 'Vehicle_Num') {
            setFormData({
                ...formData,
                [name]: PreventSpecialCharacter(value) ? value : formData[name]
            });

        }
        else if (name === 'DocumentType') {
            if (value != "") {
                setFormData({
                    ...formData,
                    [name]: value
                });
            }
            else {

                setFormData({
                    ...formData, [name]: value, DocumentNo: ''
                })

            }
        }
        else {
            setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        }





    };



    const handleSearchChange = (event) => {
        const { name, value, checked, type } = event?.target;
        if (name === 'SearchState') {
            fetchCities(value)
            setSearchData({ ...searchData, [name]: value, SearchCity: '' })
        }
        else  {
            console.log(value);
            if (name === 'NoOfRecord') {
                setSearchData({ ...searchData, [name]: Number(value) })
            }
            else if(name==='SearchValue')
            {
               if(searchData?.SearchType=='Mobile')
               { 
                if(value.length<=10)
                {
                 setSearchData({...searchData,[name]:PreventCharacter(value)?value:searchData[name]})
                }
                
               }
               else if(searchData?.SearchType=='Name')
               {
                setSearchData({...searchData,[name]:PreventSpecialCharacterandNumber(value)?value:searchData[name]})
               }
               else if(searchData?.SearchType=='PanNo.')
               {
                if(value.length<=10)
                {
                 setSearchData({...searchData,[name]:PreventSpecialCharacter(value)?value:searchData[name]})
                }
               }
               else
               {
                setSearchData({ ...searchData, [name]: value })
               }
            }
            else if(name==='SearchType')
            {
              setSearchData({...searchData,[name]:value,SearchValue:''})  
              setPhleboTable([]) 
            }
           else {
                setSearchData({ ...searchData, [name]: value })
            }

        }

    }
   
    


    const formdataSaveHandler = () => {

        const generatedError = PhelbotomistValidationSchema(formData);
        console.log(generatedError)
        if (generatedError === "") {
            setLoading(true);

            const updatedFormData = {
                ...formData,
                IsActive: formData?.IsActive ? 1 : 0,
                JoiningDate: moment(formData?.JoiningDate).format("DD-MMM-YYYY"),
                Age: moment(formData?.Age).format("DD-MMM-YYYY"),
                NAME: formData?.Name.trim(),
                P_Address: formData?.P_Address ? formData?.P_Address.trim() : '',
                P_City: formData?.P_City ? formData?.P_City.trim() : '',
                Email: formData?.Email.trim(),
                FatherName: formData?.FatherName ? formData?.FatherName.trim() : '',
                MotherName: formData?.MotherName ? formData?.MotherName.trim() : '',
                Qualification: formData?.Qualification.trim(),
                Vehicle_Num: formData?.Vehicle_Num ? formData?.Vehicle_Num.trim() : '',
                DrivingLicence: formData?.DrivingLicence.trim(),
                PanNo: formData?.PanNo ? formData?.PanNo.trim() : '',
                DucumentNo: formData?.DocumentNo ? formData?.DocumentNo.trim() : '',
                DucumentType: formData?.DocumentType ? formData?.DocumentType : '',
                UserName: formData?.UserName.trim(),
                Password: formData?.Password.trim(),
            };
            delete updatedFormData['DocumentNo'];
            delete updatedFormData['DocumentType'];

            // phlebochargedata.forEach(object => {
            //     delete object['ChargeName'];
            // })


            const fullData = {
                obj: updatedFormData,
                phlebochargedata: []
            }


            axios.post("/api/v1/PhelebotomistMaster/SavePhelebotomist", fullData
            )
                .then((res) => {
                    if (res.data.message) {
                        setLoading(false);

                        setFormData({
                            Name: '',
                            IsActive: false,
                            Age: new Date(),
                            Gender: '',
                            Mobile: '',
                            Other_Contact: '',
                            Email: '',
                            FatherName: '',
                            MotherName: '',
                            P_Address: '',
                            BloodGroup: '',
                            Qualification: '',
                            Vehicle_Num: '',
                            DrivingLicence: '',
                            PanNo: '',
                            DocumentType: '',
                            DocumentNo: '',
                            JoiningDate: '',
                            DeviceID: '',
                            UserName: '',
                            Password: '',
                            PhelboSource: '',
                            WeakOff: '',
                            LoginTime: '',
                            LogoutTime: '',
                            StateId: '',
                            CityId: '',
                            P_City: '',
                            P_Pincode: ''
                        })
                        setphlebochargedata([])
                        setPhleboTable([])
                        toast.success('Saved successfully');
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    toast.error(err?.response?.data.message ? err?.response?.data.message : 'Something Went wrong')
                });

            setLoading(false);
        };
        setLoading(false);
        setErros(generatedError);


    }
    const searchDataHandler = () => {
        if (searchData?.SearchType && searchData?.SearchValue) {
             axios.post('api/v1/PhelebotomistMaster/SearchPhlebotomist',
                    searchData).then((res) => {
                        if (res.data.message.length>0) {

                            setPhleboTable(res.data.message)

                        }
                        else {
                            setPhleboTable([])
                            toast.error('No record found')}
                    })
                    .catch((err) => {
                        toast.error(err?.data?.message ? err?.data?.message : 'Something Went wrong')
                    })

            }
         else if(searchData?.SearchType!=""&&searchData?.SearchValue=="")
         {
            toast.error('Enter Search Value');
         }
         else if(searchData?.SearchValue!=""&&searchData?.SearchType=="")
         {
            toast.error('Select Search Type');
         }
         else {
            axios.post('api/v1/PhelebotomistMaster/SearchPhlebotomist',
            searchData).then((res) => {
                if (res.data.message.length>0) {

                    setPhleboTable(res.data.message)

                }
                else {toast.error('No record found')
                setPhleboTable([])}
            })
            .catch((err) => {
                toast.error(err?.data?.message ? err?.data?.message : 'Something Went wrong')
                setPhleboTable([])
            })
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
                    value.unshift({ label: 'Select', value: "" });

                  value.pop();  
                setGender(value);

            })
            .catch((err) => {
                toast.error(err?.res?.data ? err?.res?.data : 'Something Went wrong')
            });
    };

    const getRequiredAttachment = () => {
        axios
            .post("/api/v1/Global/GetGlobalData", {
                Type: "RequiredAttachment",
            })
            .then((res) => {
                let data = res.data.message;

                let RequiredAttachment = data.map((ele) => {
                    return {
                        value: ele.FieldID,
                        label: ele.FieldDisplay,
                    };
                });
                setDocumentType(RequiredAttachment)
            })
            .catch((err) => console.log(err));
    };
    const getBloodType = () => {
        axios.get('api/v1/CommonHC/GetBloodGroupData').then((res) => {
            let data = res.data.message;

            let value = data.map((ele) => {
                return {
                    value: ele.BloodGroupName,
                    label: ele.BloodGroupName,
                };
            });

            setBloodType(value)
        })
    }
    const getAmount = (str) => {
        const newStr = str.replaceAll(' ', '')
        let parts = newStr.split('@');
        return parts[1];
    }
    const getPhleboChargeData = () => {
        axios.get('/api/v1/PhelebotomistMaster/GetChargeData').then((res) => {
            let data = res.data.message;


            let value = data.map((ele) => {
                return {
                    value: ele.ID,
                    label: ele.Charge,
                    amount: getAmount(ele.Charge),
                }
            });
            setPhelboCHarges(value);

        })
            .catch((err) => {
                toast.error('Something went wrong')
            })

    }
    // const chargeChangeHandler = (event) => {

    //     const { name, value } = event?.target

    //     if (name === 'ChargeName') {
    //         if (value) {

    //             const { Name, Amount } = getNameAmountofCharge(value);
    //             setSelectcharge({
    //                 ...selectCharge,
    //                 ChargeId: `${value}`,
    //                 ChargeName: Name,
    //                 ChargeAmount: Amount
    //             })
    //         }

    //     }
    // }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const getNameAmountofCharge = (id) => {
        if (id) {

            const ele = PhelboCharges.filter((item) => {
                return item.value == id
            })


            let parts = ele[0].label.split('@');

            return { Name: parts[0], Amount: ele[0].amount }
        }

    }
    const handleSelectMultiChange = (select, name) => {
        if (name === 'StateId') {

            console.log(formData?.CityId);
            const val = select.map((ele) => { return ele?.value });
            console.log(val)
            setFormData({ ...formData, [name]: val, CityId: '' })
            if (val.length > 0) {
                fetchCities(val)
            }
            else {
                setFormData({ ...formData, StateId: '', CityId: '' })
                setCities([])
            }

        }
        else {
            const val = select?.map((ele) => ele?.value)
            setFormData({ ...formData, [name]: val })
        }
    };
    const addPhelboChargeHandler = () => {
        if (selectCharge?.ChargeId && selectCharge?.ChargeAmount && selectCharge?.ChargeName && selectCharge?.Fromdate && selectCharge?.Todate) {

            const chargeData = { ChargeID: `${selectCharge?.ChargeId.toString()}`, ChargeAmount: selectCharge?.ChargeAmount, ChargeName: selectCharge?.ChargeName, FromDate: selectCharge?.Fromdate ? moment(selectCharge?.Fromdate).format("DD-MMM-YYYY") : new Date(), ToDate: selectCharge?.Todate ? moment(selectCharge?.Todate).format("DD-MMM-YYYY") : new Date() }
            const id = chargeData?.ChargeID
            if (phlebochargedata.length > 0) {
                let isobjectExist = phlebochargedata.some(obj => {

                    if (obj?.ChargeID == id) {
                        return true;
                    }
                    return false;
                });
                if (isobjectExist) {
                    toast.warn('Charge Already Added')
                }
                else {

                    setphlebochargedata([...phlebochargedata, chargeData]);

                }
            }
            else {

                setphlebochargedata([...phlebochargedata, chargeData]);
            }
            setSelectcharge(
                {
                    ChargeName: '',
                    ChargeId: '',
                    ChargeAmount: '',
                    Fromdate: new Date(),
                    Todate: new Date(new Date().getTime() + 86400000),
                }
            )
        }


    }
    const removeCharge = (id) => {

        const updateList = phlebochargedata.filter((item) => {
            return item.ChargeID !== id
        })

        setphlebochargedata(updateList)


    }

    const getStatecity = (name, details) => {

        if (name == 'state') {
            let states = []
            for (let i of details) {
                if (!states.includes(i.StateId)) {
                    states.push(`${i.StateId}`)
                }
            }
            return states;
        }
        else {
            let cities = []
            for (let i of details) {
                if (!cities.includes(i.CityId)) {
                    cities.push(i.CityId)
                }
            }
            return cities;
        }
    }


    const editDetailsHandler = (id) => {

        axios.post('/api/v1/PhelebotomistMaster/EditPhlebotomist', {
            Phlebotomist: id
        }).then((res) => {
            const details = res?.data?.message;
            console.log(details)
            const details2 = {
                PhelebotomistId: details[0]?.PhlebotomistID || '',
                Name: details[0]?.NAME || '',
                IsActive: details[0]?.IsActive === 1 ? true : false,
                Age: details[0]?.Age ? new Date(details[0]?.Age) : new Date(),

                Gender: details[0]?.Gender || '',
                Mobile: details[0]?.Mobile || '',

                Other_Contact: details[0]?.Other_Contact || '',
                Email: details[0]?.Email || '',
                FatherName: details[0]?.FatherName || '',
                MotherName: details[0]?.MotherName || '',
                P_Pincode: details[0]?.P_Pincode ? details[0]?.P_Pincode : '',
                P_City: details[0]?.P_City ? details[0]?.P_City : '',
                P_Address: details[0]?.P_Address || '',
                BloodGroup: details[0]?.BloodGroup || '',
                Qualification: details[0]?.Qualification || '',
                Vehicle_Num: details[0]?.Vehicle_Num || '',
                DrivingLicence: details[0]?.DrivingLicence || '',
                PanNo: details[0]?.PanNo || '',
                DocumentType: details[0]?.DocumentType || '',
                DocumentNo: details[0]?.DocumentNo || '',
                JoiningDate: details[0]?.JoiningDate ? new Date(details[0]?.JoiningDate) : new Date(),

                DeviceID: details[0].DeviceID || '',
                UserName: details[0].UserName || '',
                Password: details[0].PASSWORD || '',
                PhelboSource: details[0]?.PhelboSource || '',
                WeakOff: details[0]?.WeakOff || '',
                LoginTime: details[0]?.LoginTime,
                LogoutTime: details[0]?.LogoutTime,
                StateId: getStatecity('state', details),
                CityId: getStatecity('city', details)
            }
            setFormData(details2)
            fetchCities(details2?.StateId)



        })
            .catch((err) => {

                toast.error(err?.res?.data ? err?.res?.data : 'Something Went wrong')
            })
        axios.post('api/v1/PhelebotomistMaster/BindChData', { PhlebotomistID: id }).then((res) => {
            const details = res.data.message

            const PhleboChargedetails = details.map((ele) => {
                return ({
                    ChargeName: ele.ChargeName,
                    ChargeID: ele.ChargeID.toString(),
                    ChargeAmount: ele.ChargeAmount,
                    FromDate: ele.fromdate,
                    ToDate: ele.todate
                })
            })

            setphlebochargedata(PhleboChargedetails)


        }).catch((err) => {
            toast.error(err?.res?.data ? err?.res?.data : 'Something Went wrong')
        })

        window.scroll(0, 0)
    }

    const formdataUpdateHandler = () => {

        const generatedError = PhelbotomistValidationSchema(formData);

        if (generatedError === "") {
            setLoading(true);

            const updatedFormData = {
                ...formData,
                IsActive: formData?.IsActive ? 1 : 0,
                JoiningDate: moment(formData?.JoiningDate).format("DD-MMM-YYYY"),
                Age: moment(formData?.Age).format("DD-MMM-YYYY"),
                NAME: formData?.Name.trim(),
                DucumentType: formData?.DocumentType,
                DucumentNo: formData?.DocumentNo ? formData?.DocumentNo : '',
                P_Address: formData?.P_Address ? formData?.P_Address.trim() : '',
                P_City: formData?.P_City ? formData?.P_City.trim() : '',
                Email: formData?.Email.trim(),
                FatherName: formData?.FatherName ? formData?.FatherName.trim() : '',
                MotherName: formData?.MotherName ? formData?.MotherName.trim() : '',
                Qualification: formData?.Qualification.trim(),
                Vehicle_Num: formData?.Vehicle_Num ? formData?.Vehicle_Num.trim() : '',
                DrivingLicence: formData?.DrivingLicence.trim(),
                PanNo: formData?.PanNo ? formData?.PanNo.trim() : '',
                UserName: formData?.UserName.trim(),
                Password: formData?.Password.trim(),
            };
            delete updatedFormData['DocumentNo'];
            delete updatedFormData['DocumentType'];
            const fullData = {
                obj: updatedFormData,
                phlebochargedata: []
            }

            axios.post("/api/v1/PhelebotomistMaster/UpdatePhlebotomist", fullData
            )
                .then((res) => {
                    if (res.data.message) {
                        setLoading(false);
                        setFormData({
                            Name: '',
                            IsActive: false,
                            Age: new Date(),
                            Gender: '',
                            Mobile: '',
                            Other_Contact: '',
                            Email: '',
                            FatherName: '',
                            MotherName: '',
                            P_Address: '',
                            BloodGroup: '',
                            Qualification: '',
                            Vehicle_Num: '',
                            DrivingLicence: '',
                            PanNo: '',
                            DocumentType: '',
                            DocumentNo: '',
                            JoiningDate: '',
                            DeviceID: '',
                            UserName: '',
                            Password: '',
                            PhelboSource: '',
                            WeakOff: '',
                            LoginTime: '',
                            LogoutTime: '',
                            StateId: '',
                            CityId: '',
                            P_Pincode: '',
                            P_City: ''
                        })
                        setphlebochargedata([])
                        setPhleboTable([])
                        toast.success('Updated successfully');
                    }
                })
                .catch((err) => {
                    setLoading(false);
                    toast.error(err?.res?.data ? err?.res?.data : 'Something Went wrong')
                });
        }

        setLoading(false);
        setErros(generatedError);

    }



    useEffect(() => {
        getDropDownData('Gender')
        getRequiredAttachment();
        getBloodType();
        fetchStates();
        getPhleboChargeData();

    }, [])

   

    const navigateHandler = () => {


    }
    function validate(input) {
        if (/^\s/.test(input.value))
            input.value = '';
    }



    return (
        <>

            <div className="box box-success form-horizontal">
                <div className="box-header with-border">
                    <h3 className="box-title">Phelebotomist Registeration</h3>
                    <Link className="box-title right-underline " to="/TemporaryPhelebotomist">Add New Temporary Phelebotomist</Link>
                </div>
                <div
                    className="box-body"
                >
                    <div className="row">
                        <div className="col-sm-10" >
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
                                            max={30}
                                        />
                                        {formData?.Name.trim() === "" && (
                                            <span className="golbal-Error">{errors?.Name}</span>
                                        )}
                                        {formData?.Name.trim().length!="" && formData?.Name?.length<3 && (
                                            <span className="golbal-Error">{errors?.NameLength}</span>
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
                                    <div className="col-sm-1" >

                                        <SelectBox
                                            name="Gender"
                                            className=" input-sm"
                                            options={gender}
                                            onChange={handleSelectChange}
                                            selectedValue={formData?.Gender}
                                        />
                                        {formData?.Gender === "" && (
                                            <span className="golbal-Error">{errors?.Gender}</span>
                                        )}
                                    </div>
                                    <div className="col-sm-1"
                                    >
                                        <SimpleCheckbox

                                            type="checkbox"
                                            name="IsActive"
                                            checked={formData.IsActive}
                                            onChange={handleSelectChange}
                                        />
                                        <label className="control-label">IsActive</label>
                                    </div>


                                    <label className="col-sm-1" htmlFor="inputEmail3" >
                                        Address:
                                    </label>
                                    <div className="col-sm-2">
                                        <Input
                                            className="form-control input-sm"
                                            name='P_Address'
                                            onChange={handleSelectChange}
                                            value={formData?.P_Address}
                                            max={30}
                                        />
                                       {formData?.P_Address!= "" && formData?.P_Address?.length < 3 && (
                                        <span className="golbal-Error">{errors?.P_Addresslength}</span>
                                    )}
                                    </div>

                                </div>
                            </div>
                            <div className="row">

                                <label className="col-sm-1" htmlFor="inputEmail3" >
                                    City:
                                </label>
                                <div className="col-sm-2">
                                    <Input
                                        className="form-control input-sm"
                                        name='P_City'
                                        onChange={handleSelectChange}
                                        value={formData?.P_City}
                                        max={15}
                                    />
                                 {formData?.P_City!= "" && formData?.P_City?.length < 3 && (
                                        <span className="golbal-Error">{errors?.P_Citylength}</span>
                                    )}
                                </div>
                                <label className="col-sm-1" htmlFor="inputEmail3 " >
                                    Pincode:
                                </label>
                                <div className="col-sm-2">
                                    <Input
                                        type='number'
                                        name="P_Pincode"
                                        onInput={(e)=>number(e,6)}
                                        className="select-input-box form-control input-sm"
                                        onChange={handleSelectChange}
                                        value={formData?.P_Pincode}
                                    />
                                    {formData?.P_Pincode != "" && formData?.P_Pincode?.length != 6 && (
                                        <span className="golbal-Error">{errors?.PincodeLength}</span>
                                    )}

                                </div>
                                <label className="col-sm-1" htmlFor="inputEmail3" >
                                    Mobile:
                                </label>
                                <div className="col-sm-2">
                                    <Input
                                        className="form-control input-sm"
                                        name='Mobile'
                                        type="number"
                                        onInput={(e) => number(e, 10)}
                                        onChange={handleSelectChange}
                                        value={formData?.Mobile}
                                    />
                                    {formData?.Mobile === "" && (
                                        <span className="golbal-Error">{errors?.Mobileempty}</span>
                                    )}
                                    {formData?.Mobile.length > 0 && formData?.Mobile.length !== 10 && (
                                        <span className="golbal-Error">{errors?.Mobileinvalid}</span>
                                    )}



                                </div>
                                <label className="col-sm-1" htmlFor="inputEmail3" >
                                    Phone No.:
                                </label>
                                <div className="col-sm-2">
                                    <Input
                                        className="form-control input-sm"
                                        name='Other_Contact'
                                        type="number"
                                        onInput={(e) => number(e, 10)}
                                        onChange={handleSelectChange}
                                        value={formData?.Other_Contact}
                                    />
                                    {formData?.Other_Contact.length > 0 && formData?.Other_Contact.length !== 10 && (
                                        <span className="golbal-Error">{errors?.OtherContact}</span>
                                    )}
                                </div>

                            </div>
                            <div className="row">

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
                                    {formData?.Email.trim() === "" && (
                                        <span className="golbal-Error">{errors?.Emailempty}</span>
                                    )}
                                    {
                                        !emailRegex.test(formData?.Email) && formData?.Email.length > 0 && (
                                            <span className="golbal-Error">{errors?.Emailvalid}</span>
                                        )
                                    }

                                </div>
                                <label className="col-sm-1" htmlFor="inputEmail3" >
                                    Blood Group :
                                </label>
                                <div className="col-sm-2">
                                    <SelectBox
                                        name="BloodGroup"
                                        className="select-input-box form-control input-sm"
                                        onChange={handleSelectChange}
                                        selectedValue={formData?.BloodGroup}
                                        options={[
                                            { label: "Choose Blood Group", value: "" },
                                            ...BloodType,
                                        ]}
                                    />
                                </div>
                                <label className="col-sm-1" htmlFor="inputEmail3" >
                                    Father Name :
                                </label>
                                <div className="col-sm-2">
                                    <Input
                                        className="form-control input-sm"
                                        name='FatherName'
                                        onChange={handleSelectChange}
                                        value={formData?.FatherName}
                                    />
                                      {formData?.FatherName!= "" && formData?.FatherName?.length < 3 && (
                                        <span className="golbal-Error">{errors?.FatherNameLength}</span>
                                    )}
                                </div>
                                <label className="col-sm-1" htmlFor="inputEmail3" >
                                    Mother Name:
                                </label>
                                <div className="col-sm-2">
                                    <Input
                                        name="MotherName"
                                        className="select-input-box form-control input-sm"
                                        onChange={handleSelectChange}
                                        value={formData?.MotherName}
                                    />
                                    {formData?.MotherName!= "" && formData?.MotherName?.length < 3 && (
                                        <span className="golbal-Error">{errors?.MotherNameLength}</span>
                                    )}

                                </div>

                            </div>
                            <div className="row">


                            </div>
                        </div>
                        <div className="col-sm-2" style={{ textAlign: "center" }}>
                            <Image src={PhelboImage} style={{ width: '120px', height: '120px' }} />
                        </div>
                    </div>

                </div>

                <div className="box  form-horizontal">
                    <div className="box-header with-border">
                        <h3 className="box-title">Personal Details</h3>
                    </div>
                    <div
                        className="box-body"

                    >
                        <div className="row">
                            <label className="col-sm-1" htmlFor="inputEmail3">
                                Qualification:
                            </label>
                            <div className="col-sm-2">
                                <Input
                                    className="form-control input-sm"
                                    name='Qualification'
                                    onChange={handleSelectChange}
                                    value={formData?.Qualification}
                                    type="text"
                                    max={10}
                                />
                                {formData?.Qualification.trim() === "" && (
                                    <span className="golbal-Error">{errors?.Qualification}</span>
                                )}
                                {
                                    formData?.Qualification.trim().length>0 && formData?.Qualification?.length < 2
                                    && <span className="golbal-Error">{errors?.QualificationLength}</span>
                                }

                            </div>
                            <label className="col-sm-1" htmlFor="inputEmail3">
                                Vehicle No. :
                            </label>
                            <div className="col-sm-2">
                                <Input
                                    className="form-control input-sm"
                                    name='Vehicle_Num'
                                    onChange={handleSelectChange}
                                    value={formData?.Vehicle_Num}
                                    type="text"
                                    max={12}
                                />
                                 {
                                    formData?.Vehicle_Num.trim().length>0 &&
                                    formData?.Vehicle_Num.trim().length<5
                                    && <span className="golbal-Error">{errors?.Vehicle_NumLength}</span>
                                }
                            </div>
                            <label className="col-sm-1" htmlFor="inputEmail3">
                                Driving License:
                            </label>
                            <div className="col-sm-2">
                                <Input
                                    name="DrivingLicence"
                                    className="select-input-box form-control input-sm"
                                    onChange={handleSelectChange}
                                    value={formData?.DrivingLicence}
                                    type="text"
                                    max={16}
                                />
                                {
                                    formData?.DrivingLicence.trim().length>0 &&
                                    formData?.DrivingLicence.trim().length<11
                                    && <span className="golbal-Error">{errors?.Vehicle_NumLength}</span>
                                }
                            </div>
                            <label className="col-sm-1" htmlFor="inputEmail3">
                                Pan No:
                            </label>
                            <div className="col-sm-2">
                                <Input
                                    className="form-control input-sm"
                                    name='PanNo'
                                    onChange={handleSelectChange}
                                    value={formData?.PanNo}
                                    max={10}
                                />
                                {formData?.PanNo != "" && formData?.PanNo?.length!=10 && (
                                    <span className="golbal-Error">{errors?.PanLength}</span>
                                )}
                            </div>
                        </div>
                        <div className="row">

                            <label className="col-sm-1" htmlFor="inputEmail3">
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
                                    <span className="golbal-Error">{errors?.DocumentType}</span>
                                )}
                            </div>
                            <label className="col-sm-1" htmlFor="inputEmail3">
                                Document No.:
                            </label>
                            <div className="col-sm-2">
                                <Input
                                    type="text"
                                    name="DocumentNo"
                                    className="select-input-box form-control input-sm"
                                    onChange={handleSelectChange}
                                    value={formData?.DocumentNo}
                                    max={20}
                                />
                                {formData?.DocumentNo === "" && (
                                    <span className="golbal-Error">{errors?.DocumentNo}</span>
                                )}
                                {formData?.DocumentNo != "" && formData?.DocumentNo.length <= 6 && (
                                    <span className="golbal-Error">{errors?.DocumentNolength}</span>
                                )}
                            </div>

                        </div>


                    </div>
                </div>

                <div className="box  form-horizontal">
                    <div className="box-header with-border">
                        <h3 className="box-title">Work Area Details</h3>
                    </div>
                    <div
                        className="box-body"

                    >
                        <div className="row">
                            <label className="col-sm-1" htmlFor="inputEmail3">
                                Joining Date:
                            </label>
                            <div className="col-sm-2">
                                <DatePicker
                                    className="form-control input-sm"
                                    name="JoiningDate"
                                    date={formData?.JoiningDate}
                                    onChange={dateSelect}

                                />

                            </div>
                            <label className="col-sm-1" htmlFor="inputEmail3">
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
                            <label className="col-sm-1" htmlFor="inputEmail3">
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
                            <label className="col-sm-1" htmlFor="inputEmail3">
                                Device Id:
                            </label>
                            <div className="col-sm-1">
                                <Input
                                    className="form-control input-sm"
                                    name='DeviceID'
                                    onChange={handleSelectChange}
                                    value={formData?.DeviceID}
                                    disabled={true}
                                />

                            </div>
                            <div className="col-sm-1">
                                <Image src={Reload} />
                            </div>
                        </div>
                        <div className="row">

                            <label className="col-sm-1" htmlFor="inputEmail3">
                                Username:
                            </label>
                            <div className="col-sm-2">
                                <Input
                                    className="form-control input-sm"
                                    name='UserName'
                                    onChange={handleSelectChange}
                                    value={formData?.UserName}

                                />
                                {formData?.UserName.trim() === "" && (
                                    <span className="golbal-Error">{errors?.UserName}</span>
                                )}
                                {
                                    formData?.UserName.length > 0 && formData?.UserName.length <= 3 && (
                                        <span className="golbal-Error">{errors?.UserNameL}</span>
                                    )
                                }

                            </div>
                            <label className="col-sm-1" htmlFor="inputEmail3">
                                Password:
                            </label>
                            <div className="col-sm-2">
                                <Input
                                    type='password'
                                    name="Password"
                                    max={20}
                                    onChange={handleSelectChange}
                                    value={formData?.Password}
                                    className="select-input-box form-control input-sm"

                                />
                                {formData?.Password === "" && (
                                    <span className="golbal-Error">{errors?.Password}</span>
                                )}
                                {
                                    formData?.Password.length > 0 && formData?.Password.length <= 3 && (
                                        <span className="golbal-Error">{errors?.Passwordl}</span>
                                    )
                                }

                            </div>
                            <label className="col-sm-1" htmlFor="inputEmail3">
                                Phelbo Source :
                            </label>
                            <div className="col-sm-2">
                                <SelectBox
                                    className="form-control input-sm"
                                    name='PhelboSource'
                                    onChange={handleSelectChange}
                                    options={[{ label: 'Select Phelbo', value: '' }, ...PhelboSources]}
                                    selectedValue={formData?.PhelboSource}
                                />
                                {formData?.PhelboSource === "" && (
                                    <span className="golbal-Error">{errors?.PhelboSource}</span>
                                )}
                            </div>
                            <label className="col-sm-1" htmlFor="inputEmail3">
                                Week off :
                            </label>
                            <div className="col-sm-2">
                                <SelectBox
                                    className="form-control input-sm"
                                    options={[{ label: 'Select Week off', value: '' },

                                    ...Phelboweekoff
                                    ]}
                                    selectedValue={formData?.WeakOff}
                                    name='WeakOff'
                                    onChange={handleSelectChange}

                                />

                            </div>

                        </div>
                        <div className="row">

                            <label className="col-sm-1" htmlFor="inputEmail3">
                                Login Time :
                            </label>
                            <div className="col-sm-2">
                                <Input
                                    type='time'
                                    name="LoginTime"
                                    className="select-input-box form-control input-sm"
                                    onChange={handleSelectChange}
                                    value={formData?.LoginTime}
                                />
                                {formData?.LoginTime === "" && (
                                    <span className="golbal-Error">{errors?.LoginTime}</span>
                                )}
                            </div>
                            <label className="col-sm-1" htmlFor="inputEmail3">
                                Logout Time :
                            </label>
                            <div className="col-sm-2">
                                <Input
                                    type='time'
                                    name="LogoutTime"
                                    className="select-input-box form-control input-sm"
                                    onChange={handleSelectChange}
                                    value={formData?.LogoutTime}
                                    min="08:00"
                                />
                                {formData?.LogoutTime === "" && (
                                    <span className="golbal-Error">{errors?.LogoutTime}</span>
                                )}

                            </div>

                        </div>



                    </div>
                </div>
                {/* <div className="box  form-horizontal">
                    <div className="box-header with-border">
                        <h3 className="box-title">Phelo Charge Details</h3>
                    </div>
                    <div
                        className="box-body"

                    >
                        <div className="row">
                            <label className="col-sm-1" htmlFor="inputEmail3">
                                Select Charge:
                            </label>
                            <div className="col-sm-2">
                                <SelectBox
                                    className="form-control input-sm"
                                    name="ChargeName"
                                    options={[{ label: "Select Charge", value: "" }, ...PhelboCharges]}
                                    selectedValue={selectCharge?.ChargeId}
                                    onChange={chargeChangeHandler}
                                />

                            </div>
                            <label className="col-sm-1" htmlFor="inputEmail3">
                                From Date:
                            </label>
                            <div className="col-sm-2">
                                <DatePicker
                                    className="form-control input-sm"
                                    name="Fromdate"
                                    date={selectCharge?.Fromdate}
                                    onChange={dateSelect}
                                    
                                   minDate={formData?.JoiningDate}
                                />

                            </div>
                            <label className="col-sm-1" htmlFor="inputEmail3">
                                To Date:
                            </label>
                            <div className="col-sm-2">
                                <DatePicker
                                    className="form-control input-sm"
                                    name="Todate"
                                    date={selectCharge?.Todate}
                                    minDate={selectCharge?.Fromdate}
                                    onChange={dateSelect}
                                />

                            </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;
                            <div className="col-sm-1 col-xs-12">
                                <button
                                    type="button"
                                    className="btn btn-block btn-info btn-sm"
                                    onClick={addPhelboChargeHandler}
                                >
                                    {t("Add")}
                                </button>
                            </div>
                        </div>

                        {phlebochargedata.length > 0 && <>
                            <div className="row d-flex">
                                <table
                                    className="table table-bordered table-hover table-striped tbRecord"
                                    cellPadding="{0}"
                                    cellSpacing="{0}"
                                >
                                    <thead className="cf text-center" style={{ zIndex: 99 }}>
                                        <tr>
                                            <th className="text-center">{t("S.No.")}</th>
                                            <th className="text-center">{t("Charge Name")}</th>
                                            <th className="text-center">{t("Charge Amount")}</th>
                                            <th className="text-center">{t("From Date")}</th>
                                            <th className="text-center">{t("To Date")}</th>
                                            <th className="text-center">{t("Remove")}</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {phlebochargedata.map((ele, index) => (

                                            <>

                                                <tr key={index}>
                                                    <td data-title="S.No." className="text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td data-title="Charge Name" className="text-center">
                                                        {ele?.ChargeName}
                                                    </td>
                                                    <td data-title="Charge Amount" className="text-center">
                                                        {ele?.ChargeAmount}
                                                    </td>
                                                    <td data-title="From Date" className="text-center">
                                                        {ele?.Fromdate || ele.FromDate}
                                                    </td>
                                                    <td data-title="To Date" className="text-center">
                                                        {ele?.Todate || ele?.ToDate}
                                                    </td>
                                                    <td data-title="Remove" className="text-center">
                                                        <button onClick={removeCharge.bind(null, ele.ChargeID)}>X</button>
                                                    </td>
                                                </tr>
                                            </>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </>}
                        <div
                            className="row"

                        >
                            {loading ? (
                                <div className="col-sm-1">
                                    <Loading />
                                </div>

                            ) : (
                                <div className="col-sm-1 col-xs-12">

                                    {
                                        formData?.PhelebotomistId ? <button
                                            type="button"
                                            className="btn btn-block btn-warning btn-sm"
                                            onClick={formdataUpdateHandler}
                                        >
                                            {t("Update")}
                                        </button> : <button
                                            type="button"
                                            className="btn btn-block btn-success btn-sm"
                                            onClick={formdataSaveHandler}
                                        >
                                            {t("Save")}
                                        </button>
                                    }

                                </div>
                            )}


                        </div>




                    </div>




                </div> */}
                <div
                    className="row"

                >
                    {loading ? (
                        <div className="col-sm-1">
                            <Loading />
                        </div>

                    ) : (
                        <div className="col-sm-1 col-xs-12">

                            {
                                formData?.PhelebotomistId ? <button
                                    type="button"
                                    className="btn btn-block btn-warning btn-sm"
                                    onClick={formdataUpdateHandler}
                                >
                                    {t("Update")}
                                </button> : <button
                                    type="button"
                                    className="btn btn-block btn-success btn-sm"
                                    onClick={formdataSaveHandler}
                                >
                                    {t("Save")}
                                </button>
                            }

                        </div>
                    )}


                </div>
            </div>


            <div className="box form-horizontal">


                <div className="box-body form-horizontal">
                    <div className="row ">
                        <label
                            className="col-sm-1"
                            htmlFor="No Of Records"
                            style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', height: '28px' }}
                        >
                            {t("No Of Records")}:
                        </label>
                        <div className="col-sm-1">
                            <SelectBox
                                options={Phelborecordoptions}
                                name="NoOfRecord"
                                selectedValue={searchData?.NoOfRecord}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="col-sm-1 ">
                            <SelectBox

                                className="form-control input-sm"
                                name="SearchState"
                                value={searchData?.SearchState}
                                onChange={handleSearchChange}
                                options={[{ label: 'State', value: '' }, ...states]}
                            />
                        </div>

                        <div className="col-sm-1 ">
                            <SelectBox

                                className="form-control input-sm"
                                name="SearchCity"
                                selectedValue={searchData?.SearchCity}
                                options={[{ label: 'City', value: '' }, ...cities]}
                                onChange={handleSearchChange}
                            />

                        </div>




                        <div className="col-sm-1">
                            <SelectBox
                                // options={}
                                name="SearchGender"
                                selectedValue={searchData?.SearchGender}
                                onChange={handleSearchChange}
                                options={[...gender]}
                            />
                        </div>
                        <div className="col-sm-1">
                            <SelectBox

                                name="SearchType"
                                onChange={handleSearchChange}
                                options={[{ label: "Select type", value: '' }, ...PhelboSearchTypes]}
                                selectedValue={searchData?.SearchType}
                            />
                        </div>
                        <div className="col-sm-2">
                            <Input
                                // options={}
                                name="SearchValue"
                                className="form-control input-sm"
                                onChange={handleSearchChange}
                                value={searchData.SearchValue}
                            />
                        </div>
                        <div className="col-sm-1">
                            <button
                                type="Search"
                                className="btn btn-block btn-info btn-sm"
                                onClick={() => {
                                    searchDataHandler(searchData?.NoOfRecord)
                                }}
                            >
                                {t("Search")}
                            </button>
                        </div>

                        <div className="col-sm-1">
                            <button
                                type="button"
                                className="btn btn-block btn-info btn-sm"

                            >
                                {t("Excel")}
                            </button>
                        </div>
                        <div className="col-sm-2">
                            <button
                                type="button"
                                className="btn btn-block btn-info btn-sm"

                            >
                                {t("Pending Profile Pic")}
                            </button>
                        </div>
                    </div>


                </div>



                <div
                    className="box-body divResult boottable table-responsive"
                    id="no-more-tables"
                >
                    {PhleboTable.length > 0 && <div className="row">
                        <table
                            className="table table-bordered table-hover table-striped tbRecord"
                            cellPadding="{0}"
                            cellSpacing="{0}"
                        >
                            <thead className="cf text-center" style={{ zIndex: 99 }}>
                                <tr>
                                    <th className="text-center">{t("#")}</th>
                                    <th className="text-center">{t("Select")}</th>
                                    <th className="text-center">{t("Phelebo Code")}</th>
                                    <th className="text-center">{t("Phelebo Name")}</th>
                                    <th className="text-center">{t("Username")}</th>
                                    <th className="text-center">{t("DOB")}</th>
                                    <th className="text-center">{t("Gender")}</th>
                                    <th className="text-center">{t("Mobile")}</th>
                                    <th className="text-center">{t("Email")}</th>
                                    <th className="text-center">{t("Qualification")}</th>
                                    <th className="text-center">{t("Device Id")}</th>
                                    <th className="text-center">{t("Phelebo Source")}</th>
                                    <th className="text-center">{t("Active")}</th>
                                </tr>
                            </thead>

                            <tbody>
                                {PhleboTable.map((ele, index) => (
                                    <>
                                        <tr key={index}>
                                            <td data-title="#" className="text-center">
                                                {index + 1} &nbsp;
                                            </td>
                                            <td data-title="Select" className="text-center">
                                                <button className="bg-primary" onClick={async () => {

                                                    editDetailsHandler(ele.PhlebotomistID)
                                                }}>Select</button>&nbsp;
                                            </td>
                                            <td data-title="Phlebo Code" className="text-center">
                                                {ele.PhlebotomistID} &nbsp;
                                            </td>
                                            <td data-title="Phelebo Name" className="text-center">
                                                {ele.NAME} &nbsp;
                                            </td>
                                            <td data-title="Username" className="text-center">
                                                {ele.UserName} &nbsp;
                                            </td>
                                            <td data-title="DOB" className="text-center">
                                                {ele.Age}  &nbsp;
                                            </td>
                                            <td data-title="Gender" className="text-center">
                                                {ele.Gender}&nbsp;
                                            </td>
                                            <td data-title="Mobile" className="text-center">
                                                {ele.Mobile}&nbsp;
                                            </td>
                                            <td data-title="Email" className="text-center">
                                                {ele.Email}&nbsp;
                                            </td>
                                            <td data-title="Qualification" className="text-center">
                                                {ele.Qualification}&nbsp;
                                            </td>
                                            <td data-title="Device Id" className="text-center">
                                                {ele.DeviceID}&nbsp;
                                            </td>
                                            <td data-title="Phelbo Source" className="text-center">
                                                {ele.PhelboSource}&nbsp;
                                            </td>
                                            <td data-title="Active" className="text-center">
                                                {ele.IsActive}&nbsp;
                                            </td>
                                        </tr>
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>}
                </div>
            </div>


        </>

    )


}

export default PheleBotomistRegisteration;
