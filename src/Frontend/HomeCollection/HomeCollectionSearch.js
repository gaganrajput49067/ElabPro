import React, { useEffect } from "react";
import { SimpleCheckbox } from "../../ChildComponents/CheckBox";

import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import Loading from "../util/Loading";
import axios from "axios";
import { toast } from "react-toastify"
import DatePicker from "../Components/DatePicker";
import moment from "moment";
import { Link } from "react-router-dom";
import HomeCollectionDetailModal from './HomeCollectionDetailModal'
import { changeLanguage } from "i18next";
import { PreventSpecialCharacterandNumber, PreventSpecialCharacter } from "../util/Commonservices";
import { number } from "yup";


const HomeCollectionSearch = () => {
    const { t } = useTranslation();
    const [states, setStates] = useState([]);
    const [cities, setCities] = useState([]);
    const [load, setLoad] = useState(false);
    const [index, setIndex] = useState()
    const [formData, setFormdata] = useState({
        DateOption: "hc.AppID",
        FromDate: new Date(),
        ToDate: new Date(new Date().getTime() + 86400000),
        FromTime: "00:00:00",
        ToTime: "23:59:59",
        StateId: "",
        CityId: "",
        AreaId: "",
        PinCode: "",
        CentreId: "",
        PhelboId: "",
        RouteId: "",
        PName: "",
        Mobile: "",
        PreBookingId: "",
        Status: ""
    })
    const [collectionList, setCollectionList] = useState([])
    const [show, setShow] = useState(false)
    const [areas, setAreas] = useState([])
    const [Phelbos, setPhelbos] = useState([])
    const [dropLocations, setDroplocations] = useState([])
    const [routes, setroutes] = useState([])
    const [statusDetails, setStatusDetails] = useState()
    const DateType = [{ label: 'Entry Date', value: 'hc.EntryDateTime' }, {
        label: 'App Date', value: 'hc.AppDateTime'
    }, {
        label: 'Last Status', value: 'hc.CurrentStatusDate'
    }, { label: 'App ID', value: "hc.AppID" }]
    const [suggestion, setSuggestion] = useState([]);
    const [tableData, setTableData] = useState([]);

    const getStates = () => {
        axios
            .post("/api/v1/CommonHC/GetStateData", {
                BusinessZoneID: 0
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
                setStates(States);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleSplitData = (id) => {
        const data = id?.split("#")[0];
        return data;
    };

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
    const getPinCode = (value) => {

        axios
            .post("/api/v1/CustomerCare/BindPinCode", {
                LocalityID: value,
            })
            .then((res) => {
                const data = res?.data?.message;

                setFormdata({
                    ...formData,
                    PinCode: data[0].pincode,
                    AreaId: value
                });

            })
            .catch((err) => {
                toast.error(err?.response?.data ? err?.response?.data?.message : "Something Went Wrong");
            });
    };
    const getLocalityDropDown = (value) => {

        axios
            .post("/api/v1/CustomerCare/BindLocality", {
                cityid: value,
            })
            .then((res) => {
                const data = res?.data?.message;
                const localities = data?.map((ele) => {
                    return {
                        ID: ele?.id,
                        value: ele?.id,
                        label: ele?.NAME,
                    };
                });

                setAreas(localities);
            })
            .catch((err) => {
                toast.error(err?.res?.data ? err?.response?.data?.message : "Something Went Wrong");
            });
    };

    const formChangeHandler = (event) => {

        const { name, value } = event?.target;

        if (name === "StateId") {
            fetchCities(value);
            setFormdata({
                ...formData, [name]: value, CityId: '', AreaId: '', PinCode: '', CentreId: "",
            });
            setAreas([]);
            setDroplocations([])
        }

        else if (name === "CityId") {
            getLocalityDropDown(value);
            setFormdata({ ...formData, [name]: value, AreaId: '', CentreId: " ", PinCode: '' });
            setAreas([]);
            setDroplocations([])
        }

        else if (name === "AreaId") {

            getPinCode(value);
            getDropLocation(value);
            setFormdata({
                ...formData, [name]: value, PinCode: '', CentreId: "",
            });
        }
        else if (name == "PinCode") {
            return;
        }
        else if (name === "PName") {
            setFormdata({
                ...formData,
                [name]: PreventSpecialCharacterandNumber(value) ? value : formData[name]
            });
        }
        else if (name === "Mobile") {
            if (value.length <= 10) {
                setFormdata({ ...formData, [name]: value });
            }
        }
        else {
            setFormdata({ ...formData, [name]: value });
        }

    }

    console.log(formData);
    const getDropLocation = (id) => {

        axios
            .post("/api/v1/HomeCollectionSearch/BindDropLocation", {
                AreaId: id,
            })
            .then((res) => {
                const data = res?.data?.message;

                const droplocations = data?.map((ele) => {
                    return {
                        value: ele?.DropLocationId,
                        label: ele?.Centre
                    };
                });
                console.log(dropLocations)

                setDroplocations(droplocations);
            })
            .catch((err) => {

                toast.error('No DropLocation Found');
            });

    }

    const searchCollectionHandler = () => {
        setLoad(true)
        console.log(formData)

        const updatedFormData = {
            ...formData,
            FromDate: moment(formData?.FromDate).format("DD/MMM/YYYY"),
            ToDate: moment(formData?.ToDate).format("DD/MMM/YYYY"),
        };
        console.log(updatedFormData)

        axios.post('api/v1/HomeCollectionSearch/GetData', updatedFormData)
            .then((res) => {
                console.log(res.data.message)
                setCollectionList(res.data.message);
                setLoad(false)
            }).catch((err) => {
                setLoad(false)
                setCollectionList([])
                toast.error(err?.response?.data?.message ? err?.response?.data?.message : 'Something Went wrong')
            })

    }
    const handleClose = () => {
        setShow(false)
    }

    const bindPhelbo = () => {
        axios
            .get("/api/v1/HomeCollectionSearch/BindPhelebo")
            .then((res) => {
                const data = res.data.message;
                console.log(data)
                const Phelbos = data.map((ele) => {
                    return {
                        name: ele.name,
                        value: ele.PhlebotomistID,
                        label: ele.name
                    }
                })

                setPhelbos(Phelbos)
            })
            .catch((err) => {
                toast.error('Something Went wrong')
            });

    }

    const bindRoute = () => {
        axios
            .get("api/v1/HomeCollectionSearch/BindRoute")
            .then((res) => {
                const data = res.data.message;
                console.log(data)
                const routes = data.map((ele) => {
                    return {

                        value: ele.RouteID,
                        label: ele.Route
                    }
                })

                setroutes(routes)
            })
            .catch((err) => {
                toast.error('Something Went wrong')
            });
    }
    const dateSelect = (date, name, value) => {


        setFormdata({ ...formData, [name]: date })

    };
    const handleStatusButton = (status) => {
        const updatedFormData = {
            ...formData,
            FromDate: moment(formData?.FromDate).format("DD/MMM/YYYY"),
            ToDate: moment(formData?.ToDate).format("DD/MMM/YYYY"),
            Status: status
        };

        console.log(updatedFormData);

        axios.post('api/v1/HomeCollectionSearch/GetData', updatedFormData)
            .then((res) => {
                console.log(res.data.message)
                setCollectionList(res.data.message);
            }).catch((err) => {
                setCollectionList([])
                toast.error(err?.response?.data?.message ? err?.response?.data.message : 'Something Went wrong')
            })

    }
    const getColor = (status) => {
        if (status) {

            switch (status) {
                case 'Rescheduled':
                    return '#ADD8E6'
                case 'Pending':
                    return 'white'
                case 'DoorLock':
                    return "#4acfee"
                case 'RescheduleRequest':
                    return '#9370DB'
                case 'CancelRequest':
                    return "#FFC0CB"
                case 'CheckIn':
                    return '#FFFF00'
                case 'Completed':
                    return '#90EE90'
                case 'BookingCompleted':
                    return '#00FFFF'
                case 'Canceled':
                    return '#E75480'
            }
        }


    }
    const statusChecker = (status) => {
        console.log(status)
        switch (status) {
            case 'BoookingCompleted':
                setStatusDetails({
                    edit: false,
                    cancel: false,
                    reschedule: false
                })
                break;
            case 'Canceled':
                setStatusDetails({
                    edit: false,
                    cancel: false,
                    reschedule: false
                })
                break;
            case 'Pending':
                setStatusDetails({
                    edit: true,
                    cancel: true,
                    reschedule: true
                })
                break;
            case 'RescheduleRequest':
                setStatusDetails({
                    edit: true,
                    cancel: true,
                    reschedule: true
                })
                break;
            case 'Rescheduled':
                setStatusDetails({
                    edit: true,
                    cancel: true,
                    reschedule: true
                })
                break;
            case 'CheckIn':
                setStatusDetails({
                    edit: false,
                    cancel: false,
                    reschedule: false
                })
                break;
            case 'Completed':
                setStatusDetails({
                    edit: false,
                    cancel: false,
                    reschedule: false
                })
                break;

        }
    }


    useEffect(() => {
        getStates()
        bindPhelbo()
        bindRoute();

    }, [])




    return (
        <><div className="box with-border">
            {show && (
                <HomeCollectionDetailModal
                    show={show}
                    handleClose={handleClose}
                    ele={collectionList[index]}
                    statusDetails={statusDetails}
                />
            )}
            <div className="box box-header with-border box-success">
                <h3 className="box-title text-center">{t("Home Collection Search")}</h3>
            </div>
            <div className="box-body">
                <div className="row">

                    <div className="col-sm-1">
                        <SelectBox
                            name="DateOption"
                            className="input-sm"
                            onChange={formChangeHandler}
                            options={DateType}
                            selectedValue={formData?.DateOption}
                        />
                    </div>
                    <label
                        className="col-sm-1"
                        htmlFor="From"
                        style={{ textAlign: "end" }}
                    >
                        {t("From Date")} :
                    </label>
                    <div className="col-sm-1">
                        <DatePicker
                            name="FromDate"
                            date={formData?.FromDate}
                            onChange={dateSelect}
                            maxDate={formData?.ToDate}
                        />
                    </div>
                    <div className="col-sm-1">
                        <Input type="text"
                            name="FromTime"

                            className="form-control input-sm"

                            value={formData?.FromTime} />
                    </div>
                    <label
                        className="col-sm-1"
                        htmlFor="From"
                        
                    >
                        {t("To Date")} :
                    </label>
                    <div className="col-sm-1">
                        <DatePicker
                            name="ToDate"

                            date={formData?.ToDate}
                            onChange={dateSelect}
                            minDate={formData?.FromDate} />

                    </div>
                    <div className="col-sm-1">
                        <Input type="text"
                            name="ToTime"
                            className="form-control input-sm"

                            value={formData?.ToTime} />
                    </div>
                    <label
                        className="col-sm-1"
                        htmlFor="Mobile No."
                        // style={{ textAlign: "end" }}
                    >
                        Mobile No:
                    </label>
                    <div className="col-sm-1">
                        <Input className="form-control input-sm"
                            type="number"
                            max={10}
                            name="Mobile"
                            onChange={formChangeHandler}
                            value={formData?.Mobile}
                            placeholder={'Mobile No.'}
                        />
                    </div>
                    <label
                        className="col-sm-1"
                        htmlFor="Prebooking No."
                        

                    >
                        PrebookingNo:
                    </label>
                    <div className="col-sm-2">
                        <Input className="form-control input-sm"
                            name="PreBookingId"
                            onChange={formChangeHandler}
                            value={formData?.PreBookingId}
                            placeholder={'Prebooking Id'} />
                    </div>


                </div>
                <div className="row">

                    <label
                        className="col-sm-2 "
                        htmlFor="State"
                     
                    >
                        {t("State")} :
                    </label>

                    <div className="col-sm-2">
                        <SelectBox
                            name="StateId"
                            className="form-control input-sm"
                            options={states}
                            onChange={formChangeHandler}
                            selectedValue={formData?.StateId}

                        />
                    </div>
                    <label
                        className="col-sm-1 "
                        htmlFor="State"
                        // style={{ textAlign: "end" }}
                    >
                        {t("City")}   :
                    </label>
                    <div className="col-sm-2">
                        <SelectBox
                            name="CityId"
                            className=" form-control-input-sm"
                            options={[{ label: 'Select City', value: '' }, ...cities]}
                            selectedValue={formData?.CityId}
                            onChange={formChangeHandler}
                        />
                    </div>
                    <label
                        className="col-sm-1 "
                        htmlFor="Area"
                        // style={{ textAlign: "end" }}
                    >
                        {t("Area")} :
                    </label>
                    <div className="col-sm-1">
                        <SelectBox
                            name="AreaId"
                            className="form-control input-sm"
                            options={[{ label: 'Select Area', value: '' }, ...areas]}
                            selectedValue={formData?.AreaId}
                            onChange={formChangeHandler}
                        />
                    </div>
                    <label
                        className="col-sm-1 "
                        htmlFor="PinCode"
                        
                    >
                        {t("Pincode")} :
                    </label>
                    <div className="col-sm-2">
                        <Input
                            name="PinCode"
                            className="form-control input-sm"
                            value={formData?.PinCode}
                            placeholder={'Pincode'}
                            onChange={formChangeHandler}
                        />
                    </div>


                </div>
                <div className="row">
                    <label
                        className="col-sm-2 "
                        htmlFor="Drop Location"

                    >
                        {t("Drop Location")} :
                    </label>
                    <div className="col-sm-2">
                        <SelectBox
                            name="CentreId"
                            className="form-control input-sm"
                            selectedValue={formData?.DropLocationId}
                            options={[{ label: 'Select Drop Location', value: '' }, ...dropLocations]}
                            onChange={formChangeHandler}

                        />
                    </div>
                    <label
                        className="col-sm-1 "
                        htmlFor="PatientName"
                        // style={{ textAlign: "end" }}
                    >
                        {t("PatientName")}:
                    </label>
                    <div className="col-sm-2">
                        <Input
                            name="PName"
                            className="form-control input-sm"
                            onChange={formChangeHandler}
                            value={formData?.PName}
                            placeholder={'Patient Name'}
                        />
                    </div>

                    <label
                        className="col-sm-1 "
                        htmlFor="Phelbo"
                        // style={{ textAlign: "end" }}
                    >
                        {t("Phelbo")} :
                    </label>
                    <div className="col-sm-1">
                        <SelectBox
                            name="PhelboId"
                            className="form-control input-sm"
                            selectedValue={formData?.PhelboId}
                            options={[{ label: 'Select Phelbo', value: '' }, ...Phelbos]}
                            onChange={formChangeHandler}
                        />
                    </div>
                    <label
                        className="col-sm-1 "
                        htmlFor="Route"
                        
                    >
                       {t("Route")} :

                    </label>
                    <div className="col-sm-2">
                        <SelectBox
                            name="RouteId"
                            className="form-control input-sm"
                            options={[{ label: 'Select Route', value: '' }, ...routes]}
                            selectedValue={formData?.RouteId}
                            onChange={formChangeHandler}
                        />
                    </div>


                </div>
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
                                className="btn btn-block btn-success btn-sm"
                                onClick={searchCollectionHandler}
                            >
                                {t("Search")}
                            </button>
                        )}
                    </div>
                    <div className="col-md-1 col-sm-6 col-xs-12">
                        <button
                            type="Excel"
                            className="btn btn-block btn-warning btn-sm"

                        >
                            {t("Export to Excel")}
                        </button>
                    </div>
                </div>

            </div>


            <div className="row hcStatus" style={{ display: 'flex', justifyContent:  'space-between', flexWrap: 'wrap' }}>
    <div className="status-item">
        <button style={{ height: '16px', width: '16px', backgroundColor: 'white', marginRight: '3px' }} onClick={() => { handleStatusButton('Pending') }}></button>
        <label htmlFor="Pending" className="control-label">{t("Pending")}</label>
    </div>
    <div className="status-item">
        <button style={{ height: '16px', width: '16px', backgroundColor: "#FFC0CB", marginRight: '3px' }} onClick={() => { handleStatusButton('CancelRequest') }}></button>
        <label htmlFor="CancelRequest" className="control-label">{t("Cancel Request")}</label>
    </div>
    <div className="status-item">
        <button style={{ height: '16px', width: '16px', backgroundColor: '#ADD8E6', marginRight: '3px' }} onClick={() => { handleStatusButton('Rescheduled') }}></button>
        <label htmlFor="Rescheduled" className="control-label">{t("Rescheduled")}</label>
    </div>
    <div className="status-item">
        <button style={{ height: '16px', width: '16px', backgroundColor: '#FFFF00', marginRight: '3px' }} onClick={() => { handleStatusButton('CheckIn') }}></button>
        <label htmlFor="CheckIn" className="control-label">{t("CheckIn")}</label>
    </div>
    <div className="status-item">
        <button style={{ height: '16px', width: '16px', backgroundColor: '#90EE90', marginRight: '3px' }} onClick={() => { handleStatusButton('Completed') }}></button>
        <label htmlFor="Completed" className="control-label">{t("Completed")}</label>
    </div>
    <div className="status-item">
        <button style={{ height: '16px', width: '16px', backgroundColor: '#00FFFF', marginRight: '3px' }} onClick={() => { handleStatusButton('BookingCompleted') }}></button>
        <label htmlFor="BookingCompleted" className="control-label">{t("Booking Completed")}</label>
    </div>
    <div className="status-item">
        <button style={{ height: '16px', width: '16px', backgroundColor: '#E75480', marginRight: '3px' }} onClick={() => { handleStatusButton('Canceled') }}></button>
        <label htmlFor="Canceled" className="control-label">{t("Canceled")}</label>
    </div>
</div>

            {collectionList.length > 0 &&
                <div className=" box-body boottable table-responsive">
                    <div className="row divResult table-responsive" id="no-more-tables">
                        <table
                            className="table table-bordered tbRecord  table-striped table-hover"
                            cellPadding="{0}"
                            cellSpacing="{0}"
                        >
                            <thead className="cf" style={{ zIndex: 99 }}>
                                <tr>
                                    <th >{t("#")}</th>
                                    <th >{t("CreateDate")}</th>
                                    <th >{t("CreateBy")}</th>
                                    <th >{t("AppDate")}</th>
                                    <th >{t("PrebookingID")}</th>
                                    <th >{t("MobileNo")}</th>
                                    <th >{t("PatientName")}</th>
                                    <th >{t("City")}</th>
                                    <th >{t("Area")}</th>
                                    <th >{t("Pincode")}</th>
                                    <th >{t("Route")}</th>
                                    <th >{t("Phelebo")}</th>
                                    <th >{t("Phelbo Mo.")}</th>
                                    <th >{t("Phelebo Source")}</th>
                                    <th >{t("Drop Location")}</th>
                                    <th >{t("Status")}</th>
                                    <th >{t("Visit Id")}</th>
                                    <th >{t("Phelbo Type")}</th>
                                </tr>
                            </thead>

                            <tbody>

                                {collectionList.map((ele, index) => (
                                    <>
                                        <tr key={index} style={{ backgroundColor: getColor(ele.CStatus) }}>
                                            <td data-title="#" >
                                                <div style={{cursor:'pointer'}} onClick={() => {
                                                            statusChecker(ele.CStatus)
                                                            setIndex(index)
                                                            setShow(true)

                                                        }}>
                                                    <span style={{ display: 'flex', justifyContent: 'space-between' }}>{index + 1}<button><i 
                                                    className="fa fa-plus" style={{marginTop:'3px'}}
                                                        
                                                        ></i></button></span>
                                                </div>
                                            </td>
                                            <td data-title="CreateDate" >
                                                {ele.EntryDateTime} &nbsp;
                                            </td>
                                            <td data-title="CreateBy" >
                                                {ele.EntryByName}&nbsp;
                                            </td>
                                            <td data-title="AppDate" >
                                                {ele.AppDate}&nbsp;
                                            </td>
                                            <td data-title="PrebookingID" className="text-center" >
                                                {ele.PreBookingId}&nbsp;
                                            </td>
                                            <td data-title="MobileNo" >
                                                {ele.Mobile}&nbsp;
                                            </td>
                                            <td data-title="CreateBy" className="text-center" >
                                                {ele.PatientName}&nbsp;
                                            </td>
                                            <td data-title="AppDate" >
                                                {ele.City}&nbsp;
                                            </td>
                                            <td data-title="Locality" >
                                                {ele.Locality} &nbsp;
                                            </td>
                                            <td data-title="Pincode" >
                                                {ele.PinCode}&nbsp;
                                            </td>
                                            <td data-title="Route" className="text-center" >
                                                {ele.RouteName}&nbsp;
                                            </td>
                                            <td data-title="Phelebo"  className="text-center" >
                                                {ele.PhleboName}&nbsp;
                                            </td>
                                            <td data-title="Phelebo No." >
                                                {ele.PMobile} &nbsp;</td>
                                            <td data-title="Phelebo Source" className="text-center">
                                                {ele.PhelboSource} &nbsp;</td>
                                            <td data-title="Drop Location" >
                                                {ele.Centre} &nbsp;</td>
                                            <td data-title="Status" >
                                                {ele.CStatus} &nbsp;</td>
                                            <td data-title="Visit Id" >
                                                {ele.VisitId}&nbsp;</td>
                                            <td data-title="Phelebo Type" >
                                                {ele.PhelboType}&nbsp;</td>
                                        </tr>
                                    </>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>}
        </div ></>)
}

export default HomeCollectionSearch
