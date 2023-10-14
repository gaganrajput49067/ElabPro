import React from 'react'

import { useTranslation } from "react-i18next";
import { useState } from 'react';
// import ExportFile from './Master/ExportFile';
import Loading from "../../util/Loading";
import axios from "axios";
import { toast } from "react-toastify"
import { useEffect } from 'react';
import moment from "moment";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";



const ImportHomeCollectionMapping = () => {
    const [loading, setLoading] = useState(false);// This state is used for setting loading screen
    const [errors, setErros] = useState({}); // This state is used for setting errors
    const [buisnessZone, setBuisnessZone] = useState([]) // This state is used for setting buisness zone
    const [states, setStates] = useState([]) // This state is used for setting states
    const [cities, setCities] = useState([]) // This state is used for setting cities
    const [list, setlist] = useState([{
        Zone: "",
        State: "",
        City: "",
        LocalityID: "",
        LocalityName: "",
        PinCode: "",
        DropLocationName: "",
        DropLocationCode: "",
        Route: "",
        PhelebotomistName: "",
        PhelebotomistUserName: "",
    }]) // setting 
    const [file, setFile] = useState(null) // handling uplaod files
    const [searchData, setSearchData] = useState({}) // for handling search data

    // for translation
    const { t } = useTranslation();


    // fetch buisness zone
    const fetchBuisnessZone = () => {
        axios.get('api/v1/CommonHC/GetZoneData',).then((res) => {
            let data = res.data.message;
            let value = data.map((ele) => {
                return {
                    value: ele.BusinessZoneID,
                    label: ele.BusinessZoneName,
                    id: ele.BusinessZoneID,
                }
            });
            console.log(data)
            setBuisnessZone(value)
        })
            .catch((err) => {
                console.log(err)
                toast.error('Something went wrong')
            })
    }

    // fetching state
    const fetchStates = (value) => {
        axios.post('api/v1/CommonHC/GetStateData', {
            BusinessZoneID: value
        }).then((res) => {
            let data = res.data.message;
            let value = data.map((ele) => {
                return {
                    value: ele.ID,
                    label: ele.State,
                    id: ele.ID,
                }
            });
            setStates(value)
        })
            .catch((err) => {
                console.log(err)
                toast.error('Something went wrong')
            })
    }

    // fetching cities based on state
    const fetchCities = (id) => {
        const postdata = {
            StateId: id
        }
        axios.post('api/v1/CommonHC/GetCityData', postdata).then((res) => {
            let data = res.data.message;
            let value = data.map((ele) => {
                return {
                    value: handleSplitData(ele.ID),
                    label: ele.City,
                };
            });
            setCities(value)
        }).catch((err) => {
            console.log(err)
        })
    }

    //used for spliting cityid because cityid comes in diffrent formate    
    const handleSplitData = (id) => {
        const data = id.split("#")[0];
        return data;
    };

    // saving holiday for phelbo
    const fetchMappingDetails = () => {
        setLoading(true);
        axios.post("", {
            FromDate: moment(searchData.FromDate).format("DD/MMM/YYYY"),
            ToDate: moment(searchData.ToDate).format("DD/MMM/YYYY"),
            StateId: searchData.StateId,
            CityId: searchData.CityId
        }).then((res) => {
            if (res.data.message) {
                setLoading(false);
                toast.success('Details Found');
                setlist(res.data.message)
            }
        })
            .catch((err) => {
                setLoading(false);
                console.log(err);
                toast.error(err?.res?.data ? err?.res?.data : 'No DEatails Found')
            });
        setLoading(false);
    }

    // fething states on first render
    useEffect(() => {
        fetchBuisnessZone();
    }, [])

    const handleUpload = () => {
        // const generatedError = fileUpload(file);
        // setLoading(true);
        // if (generatedError === "") {
        //     axios.post("", {
        //         file
        //     })
        //         .then((res) => {
        //             if (res.data.message) {
        //                 setLoading(false);
        //                 toast.success('Saved successfully');
        //             }
        //         })
        //         .catch((err) => {
        //             setLoading(false);
        //             console.log(err);
        //             toast.error(err?.res?.data ? err?.res?.data : 'Something Went wrong')
        //         });
        //     setLoading(false);
        // };
        // setLoading(false);
        // setErros(generatedError);
    }

    //handle File Change
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setFile(file);
    };


    // dynamically managing selected option in state
    const handleSelectChange = (event) => {
        const { name, value, checked, type } = event?.target;

        if (name === 'StateId' || name === 'CityId' || name === "BuisnessZoneId") {

            if (name === 'BuisnessZoneId') {
                setSearchData({ ...searchData, [name]: value, StateId: "", CityId: "" });
                fetchStates(value);
            }
            if (name === 'StateId') {
                setSearchData({ ...searchData, [name]: value, CityId: "" });
                fetchCities(value);
            }
            if (name === 'CityId') {
                setSearchData({ ...searchData, [name]: value });
                fetchMappingDetails()
            }
        }
    };


    return (
        <div className="box box-success">
            <div className="box-header with-border">
                <h3 className="box-title">Import Home Collection Mapping</h3>
            </div>
            <div className="box-body" >
                <div className="row">
                    <label className="col-sm-1" htmlFor="inputEmail3">
                        {t("Busness Zone")}:
                    </label>
                    <div className="col-sm-2">
                        <SelectBox
                            className="form-control input-sm"
                            name='BuisnessZoneId'
                            onChange={handleSelectChange}
                            selectedValue={searchData?.BusinessZoneId}
                            options={[{ label: 'Select Zone', value: '' }, ...buisnessZone]}
                        />
                        {searchData?.StateId === "" && (
                            <span className="golbal-Error">{errors?.StateId}</span>
                        )}
                    </div>
                    <label className="col-sm-1" htmlFor="inputEmail3">
                        {t("State")}:
                    </label>
                    <div className="col-sm-2">
                        <SelectBox
                            className="form-control input-sm"
                            name='StateId'
                            onChange={handleSelectChange}
                            selectedValue={searchData?.StateId}
                            options={[{ label: 'Select State', value: '' }, ...states]}
                        />
                        {searchData?.StateId === "" && (
                            <span className="golbal-Error">{errors?.StateId}</span>
                        )}
                    </div>
                    <label className="col-sm-1" htmlFor="inputEmail3">
                        {t("City")}:
                    </label>
                    <div className="col-sm-2">
                        <SelectBox
                            name="CityId"
                            className="select-input-box form-control input-sm"
                            onChange={handleSelectChange}
                            selectedValue={searchData?.CityId}
                            options={[{ label: 'Select City', value: '' }, ...cities]}
                        />
                        {searchData?.CityId === "" && (
                            <span className="golbal-Error">{errors?.CityId}</span>
                        )}
                    </div>
                    {/* <div className="col-sm-2 col-xs-12">
                        {list.length > 0
                            ? <ExportFile dataExcel={list} name={"Download Excel"} />
                            : <button className='btn btn-block btn-sm' >Download </button>}

                    </div> */}
                    </div>
                <div className="row mt-1">&nbsp;</div>
                <div className="row mt-1" style={{ marginTop: "5px" }}>
                    <label className="col-sm-1" htmlFor="inputEmail3">
                        {t("Upload Excel")}:
                    </label>
                    <div className="col-sm-2">
                        <Input
                            type='file'
                            placeholder='Select File'
                            className="select-input-box form-control input-sm"
                            onChange={handleFileChange}
                        />
                        {!file && (
                            <span className="golbal-Error">{errors?.name}</span>
                        )}
                    </div>
                    <div className="col-sm-2 my-2">
                        <div className="d-flex">
                            <button
                                type="button"
                                className="btn  btn-info w-100 btn-sm mx-2"
                                onClick={handleUpload}
                            >
                                {t("Upload")}
                            </button>
                            <button
                                type="button"
                                className="btn  btn-info w-100 btn-sm mx-2"
                            //onClick={handleCancel}
                            >
                                {t("Save Mapping")}
                            </button>
                        </div>
                    </div>

                </div>
            </div >
        </div >
    )
}

export default ImportHomeCollectionMapping
