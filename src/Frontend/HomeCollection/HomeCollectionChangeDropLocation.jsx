import React, { useEffect } from 'react'
import { useTranslation } from "react-i18next";
import { useState } from 'react';
import axios from "axios";
import { toast } from "react-toastify"
import moment from "moment";
import DatePicker from '../Components/DatePicker';
import Input from '../../ChildComponents/Input';
import { number } from '../util/Commonservices/number';
import { SelectBox } from '../../ChildComponents/SelectBox';
import Loading from '../util/Loading';

const HomeCollectionChangeDropLocation = () => {
    const [location, setLocation] = useState([])// this state is used for setting 
    const [loading, setLoading] = useState(false);// This state is used for setting loading screen
    const [errors, setErros] = useState({}); // This state is used for setting errors
    const [searchData, setSearchData] = useState({
        FromDate: new Date(),
        ToDate: new Date()
    }) // this state is used for handling search data
    const [phleboTable, setPhleboTable] = useState(null)// This state is used for setting phelbos after fetching api
    const [newlist, setNewlist] = useState([])// payload for updating phelbo details

    // for trnslation
    const { t } = useTranslation();

    //for fetching buisness zones
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
            setLocation({ ...location, BuisnessZone: value })
        }).catch((err) => {
            console.log(err)
            toast.error('Something went wrong')
        })
    }

    // fetching state based on zone
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
            setLocation({ ...location, States: value })
        }).catch((err) => {
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
            setLocation({ ...location, City: value })
        }).catch((err) => {
            console.log(err)
        })
    }
    // fetching phelbo based on city
    const fetchphelbo = (value) => {
        axios.post('api/v1/PhelebotomistMaster/BindPhelebo', {
            CityId: value
        }).then((res) => {
            let data = res.data.message;
            let value = data.map((ele) => {
                return {
                    value: ele.PhlebotomistId,
                    label: ele.NAME,
                };
            });
            setLocation({ ...location, phelbo: value })
        }).catch((err) => {
            console.log(err)
        })
    }

    //used for spliting cityid because cityid comes in diffrent formate    
    const handleSplitData = (id) => {
        const data = id.split("#")[0];
        return data;
    };

    // fething buisnesszone on first render
    useEffect(() => {
        fetchBuisnessZone();
    }, [])

    // dynamically managing selected option in state
    const handleSelectChange = async (event) => {
        const { name, value, checked, type } = event?.target;
        if (name === 'StateId' || name === 'CityId' || name === "BuisnessZoneId" || name === "Phlebotomist") {
            if (name === 'BuisnessZoneId') {
                if (value.trim() == '') {
                    setLocation({ ...location, States: [], City: [], phelbo: [] })
                    setSearchData({ ...searchData, [name]: value, StateId: "", CityId: "", Phlebotomist: "" });
                } else {
                    setSearchData({ ...searchData, [name]: value, StateId: "", CityId: "", Phlebotomist: "" });
                    fetchStates(value);
                }
            }
            if (name === 'StateId') {
                if (value.trim() == '') {
                    setLocation({ ...location, City: [], phelbo: [] })
                    setSearchData({ ...searchData, [name]: value, CityId: "", Phlebotomist: "" });
                } else {
                    setSearchData({ ...searchData, [name]: value, CityId: "", Phlebotomist: "" });
                    fetchCities(value);
                }
            }
            if (name === 'CityId') {
                if (value.trim() == '') {
                    setLocation({ ...location, phelbo: [] })
                    setSearchData({ ...searchData, [name]: value, Phlebotomist: "" });
                } else {
                    setSearchData({ ...searchData, [name]: value, Phlebotomist: "" });
                    fetchphelbo(value);
                }
            }
            if (name === 'Phlebotomist') {
                setSearchData({ ...searchData, [name]: value, });

            }
        }
    };

    //fetch droplocation
    const fetchDroplocation = async (id) => {
        try {
            const response = await axios.post("api/v1/HCLocation/GetDropLocationList", {
                "RouteId": id
            });

            if (response.data.message) {
                const updatedArray = response.data.message.map((item) => ({
                    value: item.CentreId,
                    label: item.Centre
                }));

                return updatedArray;
            } else {
                return []; // Return an empty array or handle the absence of data.
            }
        } catch (error) {
            console.error('Error in fetchDroplocation:', error);
            return []; // Handle errors gracefully by returning an empty array.
        }
    };


    const updatedDropLocation = async (id, value) => {
        const newDropArray = await fetchDroplocation(value);
        const updatedArray = phleboTable.map((item) => {
            if (item.PreBookingId == id) {
                return { ...item, dropArray: newDropArray, RouteId: value };
            }
            return item; // Return the unchanged item for other elements
        });
        setPhleboTable(updatedArray)
    };




    // handling drop selection in table for route and drop location 
    const handleDropChange = (event, id) => {
        const { name, value, checked, type, label } = event?.target;

        if (name === "route") {
            const find = phleboTable.find(item => item.PreBookingId === id)
            const filtered = find?.routeArray.filter(x => x.value == value);
            const newData = newlist.map((item) => {

                if (item.PreBookingId === id) {
                    return { ...item, RouteId: value, RouteName: filtered[0]?.label };
                }
                return item;
            });
            setNewlist(newData);
            updatedDropLocation(id, value)
        }
        if (name === "dropLocation") {
            const updatedData = phleboTable.map((item) => {
                if (item.PreBookingId === id) {
                    return { ...item, CentreId: value, DropLocation: value };
                }
                return item;
            });
            setPhleboTable(updatedData);

            const newData = newlist.map((item) => {

                if (item.PreBookingId === id) {
                    return {
                        ...item, CentreId: value
                    };
                }
                return item;
            });
            setNewlist(newData);

        }
    }

    // dynamically setting data value in state
    const dateSelect = (date, name, value) => {
        if (name === 'FromDate') {
            setSearchData({ ...searchData, [name]: date, ToDate: date })
        }
        else {
            setSearchData({ ...searchData, [name]: date })
        }
    };
    // dynamically setting search data
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchData((prevDetails) => ({
            ...prevDetails,
            [name]: value,
        }));
    };



    // handling checkboxes in phelbo table to show routes and phelbo
    const handleCheckboxChange = (id, DropLocation, RouteName, RouteId) => {
        const updatedData = [...phleboTable];
        const index = updatedData.findIndex((item) => item.PreBookingId === id);
        if (index !== -1) {
            updatedData[index].checked = !updatedData[index].checked;
            setPhleboTable(updatedData);

            // Add or remove the item from the selectedItems state based on checkbox status 
            if (updatedData[index].checked) {
                setNewlist((prevSelectedItems) => [
                    ...prevSelectedItems, {
                        CentreId: DropLocation,
                        RouteName: RouteName,
                        RouteId: RouteId,
                        PreBookingId: id
                    },
                ]);
            } else {
                setNewlist((prevSelectedItems) =>
                    prevSelectedItems.filter((item) => item.PreBookingId !== id)
                );
            }
        }
    };


    const handleSave = () => {
        const UpdateDropLocation = newlist
        if (Object.keys(UpdateDropLocation).length === 0) {
            toast.warn('Select a row to update')
        } else {
            axios.post('api/v1/HCLocation/UpdateDropLocation', { UpdateDropLocation })
                .then((res) => {
                    setPhleboTable(null)
                    handleSearch()
                    toast.success('Saved Successfully');
                }).catch((err) => {
                    toast.error(err?.res?.data ? err?.res?.data : 'Something went wrong')
                    console.log(err)
                })
        }

        setNewlist([])
    }

    const handleSearch = async () => {
        setLoading(true);
        await axios.post("api/v1/HCLocation/GetHCChangeDropLocation", {
            FromDate: moment(searchData.FromDate).format("DD/MMM/YYYY"),
            ToDate: moment(searchData.ToDate).format("DD/MMM/YYYY"),
            CityId: searchData.CityId || "",
            StateId: searchData.StateId || "",
            MobileNo: searchData.mobile || "",
            PreBookingId: searchData.PrebookingID || "",
            PhlebotomistId: searchData.Phlebotomist || "",
            RouteId: ""
        }).then(async (res) => {
            if (res.data.message) {
                setLoading(false);
                const updatedArray = await Promise.all(
                    res?.data?.message.map(async (item) => ({
                        ...item,
                        checked: false,
                        routeArray: handleSplitDataRoute(item.RouteList),
                        dropArray: await fetchDroplocation(item.RouteId),
                        DropLocationNew: handleSplitData(item.DropLocation)
                    }))
                );
                setPhleboTable(updatedArray);
                //toast.success('Found Details');
            }
        }).catch((err) => {
            setLoading(false);
            console.log(err);
            setPhleboTable(null)
            toast.error(err?.res?.data ? err?.res?.data : 'No record found')
        });
        setLoading(false);
        setLoading(false);
    }

    //splitting data for route 
    const handleSplitDataRoute = (data) => {
        if (data === null) {
            const formattedDataArray = []
            return formattedDataArray
        } else {
            const splitData = data.split(',');
            const formattedDataArray = splitData.map(item => {
                const [value, label] = item.split('#');
                return { value: parseInt(value), label };
            });
            return formattedDataArray
        }
    }


    // const handleClear = () => {
    //     setPhleboTable(null)
    //     setSearchData({
    //         FromDate: new Date(),
    //         ToDate: new Date(),
    //         mobile: "",
    //         PrebookingID: "",
    //         BuisnessZoneId: "0",
    //         StateId: "",
    //         CityId: "",
    //         Phlebotomist: "",
    //     })
    //     setNewlist([])
    // }


    return (
        <>
            <div className="box box-success form-horizontal">
                <div className="box-header with-border">
                    <h3 className="box-title">Home Collection Change Drop Location</h3>
                </div>
                <div className="box-body" >
                    <div className="row ">
                        <label className="col-sm-1" htmlFor="inputEmail3">
                            {t("From Date")}:
                        </label>
                        <div className="col-sm-2">
                            <DatePicker
                                className="form-control input-sm"
                                //maxDate={new Date()}
                                name="FromDate"
                                date={searchData?.FromDate ? new Date(searchData?.FromDate) : new Date()}
                                onChange={dateSelect}
                            />
                            {searchData?.FromDate === "" && (
                                <span className="golbal-Error">{errors?.FromDate}</span>
                            )}
                        </div>
                        <label className="col-sm-1" htmlFor="inputEmail3">
                            {t("To Date")}:
                        </label>
                        <div className="col-sm-2">
                            <DatePicker
                                className="form-control input-sm"
                                name="ToDate"
                                date={searchData?.ToDate ? new Date(searchData?.ToDate) : new Date()}
                                minDate={searchData?.FromDate}
                                onChange={dateSelect}
                            />
                            {searchData?.ToDate === "" && (
                                <span className="golbal-Error">{errors?.ToDate}</span>
                            )}
                        </div>
                        <label className="col-sm-1" htmlFor="inputEmail3">
                            {t("Mobile No.")}:
                        </label>
                        <div className="col-sm-2">
                            <Input
                                type='number'
                                name="mobile"
                                onInput={(e) => number(e, 10)}
                                value={searchData?.mobile}
                                className="select-input-box form-control input-sm"
                                onChange={handleChange}
                            />
                        </div>
                        <label className="col-sm-1" htmlFor="inputEmail3" style={{ textAlign: "right" }}>
                            {t("Prebooking ID")}:
                        </label>
                        <div className="col-sm-2">
                            <Input
                                type='number'
                                name="PrebookingID"
                                onInput={(e) => number(e, 20)}
                                value={searchData?.PrebookingID}
                                className="select-input-box form-control input-sm"
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <label className="col-sm-1" htmlFor="inputEmail3">
                            {t("Zone")}:
                        </label>
                        <div className="col-sm-2">
                            <SelectBox
                                className="form-control input-sm"
                                name='BuisnessZoneId'
                                onChange={handleSelectChange}
                                selectedValue={searchData?.BusinessZoneId}
                                options={[{ label: 'Select Zone', value: '' }, ...location?.BuisnessZone ?? []]}
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
                                options={[{ label: 'Select State', value: '' }, ...location?.States ?? []]}
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
                                options={[{ label: 'Select City', value: '' }, ...location?.City ?? []]}
                            />
                            {searchData?.CityId === "" && (
                                <span className="golbal-Error">{errors?.CityId}</span>
                            )}
                        </div>
                        <label className="col-sm-1" htmlFor="inputEmail3">
                            {t("Phlebotomist")}:
                        </label>
                        <div className="col-sm-2">
                            <SelectBox
                                className="form-control input-sm"
                                name="Phlebotomist"
                                onChange={handleSelectChange}
                                selectedValue={searchData?.Phlebotomist}
                                options={[{ label: 'Select ', value: '' }, ...location?.phelbo ?? []]}
                            />
                            {searchData?.Phlebotomist === "" && (
                                <span className="golbal-Error">{errors?.Phlebotomist}</span>
                            )}
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-5 col-xs-12"></div>
                        <div className="col-sm-2 col-xs-12">
                            <button
                                type="button"
                                className="btn btn-block btn-info btn-sm"
                                onClick={handleSearch}
                            >
                                {t("Search")}
                            </button>
                        </div>
                        <div className="col-sm-5 col-xs-12"></div>
                    </div>
                </div>
            </div>
            {loading && !phleboTable && (<Loading />)}
            {phleboTable && <div className="box" >
                <div className="box-body" >
                    <div
                        className="row box-body divResult boottable table-responsive"
                        id="no-more-tables"
                    >{loading ? (
                        <Loading />
                    ) : (
                        <div className="row">
                            <table
                                className="table table-bordered table-hover table-striped tbRecord"
                                cellPadding="{0}"
                                cellSpacing="{0}"
                            >
                                <thead className="cf text-center" style={{ zIndex: 99 }}>
                                    <tr>
                                        <th className="text-center">{t("#")}</th>
                                        <th className="text-center">{t("Pelbo")}</th>
                                        <th className="text-center">{t("App Data")}</th>
                                        <th className="text-center">{t("Status")}</th>
                                        <th className="text-center">{t("PreBooking ID")}</th>
                                        <th className="text-center">{t("Mobile No")}</th>
                                        <th className="text-center">{t("Patient Name")}</th>
                                        <th className="text-center">{t("City")}</th>
                                        <th className="text-center">{t("Locality")}</th>
                                        <th className="text-center">{t("Pincode")}</th>
                                        <th className="text-center">{t("Route")}</th>
                                        <th className="text-center">{t("Drop Location")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {phleboTable && phleboTable.map((ele, index) => (
                                        <>
                                            <tr key={ele.PreBookingId}
                                            >
                                                <td data-title="#" className="text-center">
                                                    {index + 1} &nbsp; <input type="checkbox" onClick={
                                                        () => handleCheckboxChange(ele.PreBookingId,
                                                            ele.DropLocation, ele.RouteName, ele.RouteId, ele.RouteName,
                                                            ele?.RouteID, ele.Phleboname, ele.PhlebotomistID)} />
                                                </td>
                                                <td data-title="Phelbo" className="text-center">
                                                    {ele.PhleboName}&nbsp;
                                                </td>
                                                <td data-title="App Date" className="text-center">
                                                    {ele.AppDate}&nbsp;
                                                </td>
                                                <td data-title="Status" className="text-center">
                                                    {ele.CurrentStatus}&nbsp;
                                                </td>
                                                <td data-title="PreBookingId" className="text-center">
                                                    {ele.PreBookingId}&nbsp;
                                                </td>
                                                <td data-title="mobile no" className="text-center">
                                                    {ele.MobileNo}&nbsp;
                                                </td>
                                                <td data-title="PatientName" className="text-center">
                                                    {ele.PatientName}&nbsp;
                                                </td>
                                                <td data-title="city" className="text-center">
                                                    {ele.City}&nbsp;
                                                </td>
                                                <td data-title="Area" className="text-center">
                                                    {ele.Locality}&nbsp;
                                                </td>
                                                <td data-title="pincode" className="text-center">
                                                    {ele.PinCode}&nbsp;
                                                </td>
                                                <td data-title="route" className="text-center">
                                                    <SelectBox
                                                        className="form-control input-sm"
                                                        name='route'
                                                        onChange={(e) => handleDropChange(e, ele.PreBookingId)}
                                                        isDisabled={!ele.checked}
                                                        selectedValue={ele.RouteId}
                                                        options={[{ label: 'Select Route', value: '' }, ...ele?.routeArray]}
                                                    />
                                                </td>
                                                <td data-title="dropLocation" className="text-center">
                                                    <SelectBox
                                                        className="form-control input-sm"
                                                        name='dropLocation'
                                                        onChange={(e) => handleDropChange(e, ele.PreBookingId)}
                                                        isDisabled={!ele.checked}
                                                        selectedValue={ele.DropLocation}
                                                        options={[{ label: 'Select DropLocation', value: '' }, ...ele?.dropArray]}
                                                    />
                                                </td>
                                            </tr>
                                        </>
                                    ))}
                                </tbody>
                            </table>
                        </div>)}
                    </div>
                    <div className="row">
                        <div className="col-sm-5 col-xs-12"></div>
                        <div className="col-sm-2 col-xs-12">
                            <button
                                type="button"
                                className="btn btn-block btn-info btn-sm"
                                onClick={handleSave}
                            >
                                {t("Update")}
                            </button>
                        </div>
                        {/* <div className="col-sm-1 col-xs-12">
                            <button
                                type="button"
                                className="btn btn-block btn-danger btn-sm"
                                onClick={handleClear}
                            >
                                {t("Clear")}
                            </button>
                        </div> */}
                        <div className="col-sm-5 col-xs-12"></div>
                    </div>
                </div>

                <div></div>
            </div>
            }
        </>
    )
}

export default HomeCollectionChangeDropLocation

