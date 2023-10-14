import React from 'react'
import { useTranslation } from "react-i18next";
import { useState } from 'react';
import axios from "axios";
import { toast } from "react-toastify"
import { useEffect } from 'react';
import moment from "moment";
import ImageModal from './imageModal';
import LoginDetailTableModal from './loginDetailTableModal';
import { SelectBox } from '../../ChildComponents/SelectBox';
import Loading from '../util/Loading';
import DatePicker from '../Components/DatePicker';

const PhelboLoginDetails = () => {
    const [loading, setLoading] = useState(false);// This state is used for setting loading screen
    const [errors, setErros] = useState({}); // This state is used for setting errors
    const [states, setStates] = useState([]) // This state is used for setting states
    const [cities, setCities] = useState([]) // This state is used for setting cities 
    const [sDetailsModal, setSDetailsModal] = useState({
        moadal: false,
        data: ""
    })//This state is used for showing secondry table which is generated within phelbo table
    const [imageModal, setImageModal] = useState({
        moadal: false,
        data: ""
    });// this state is used for storing data and showing modal if required
    const [searchData, setSearchData] = useState({
        StateId: "",
        CityId: "",
        FromDate: new Date(),
        ToDate: new Date(),
    });// this state is used for storing search data
    const [phleboTable, setPhleboTable] = useState(null)// this state is used for storing all details for phelbo mapping into table

    // for translation
    const { t } = useTranslation();

    // fetching state based on zone
    const fetchStates = () => {
        axios.post('api/v1/CommonHC/GetStateData', {
            BusinessZoneID: 0
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

    // fetching phelbo based on city
    const handleSplitData = (id) => {
        const data = id.split("#")[0];
        return data;
    };

    //used for spliting cityid because cityid comes in diffrent formate 
    useEffect(() => {
        fetchStates();
    }, [])

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
    const handleSelectChange = async (event) => {
        const { name, value, checked, type } = event?.target;
        if (name === 'StateId' || name === 'CityId' || name === "Phlebotomist") {
            if (name === 'StateId') {
                fetchCities(value);
                setSearchData({ ...searchData, [name]: value, CityId: "", Phlebotomist: "" });
            }
            if (name === 'CityId') {
                setSearchData({ ...searchData, [name]: value, Phlebotomist: "" });
            }
            if (name === 'Phlebotomist') {
                setSearchData({ ...searchData, [name]: value });
            }
        } else {
            setSearchData({ ...searchData, [name]: type === 'checkbox' ? checked : value });
        }

    };

    // handle modal data to sn
    function handleModalData(name, type, img, x) {
        switch (name) {
            case "selfiImage":
                setImageModal({
                    ...imageModal,
                    moadal: true,
                    data: {
                        name: x,
                        type: type,
                        image: img
                    }
                });
                break;
            case "bikeImage":
                setImageModal({
                    ...imageModal,
                    moadal: true,
                    data: {
                        name: x,
                        type: type,
                        image: img
                    }
                });
                break;
            case "bagImage":
                setImageModal({
                    ...imageModal,
                    moadal: true,
                    data: {
                        name: x,
                        type: type,
                        image: img
                    }
                });
                break;
            case "tempImage":
                setImageModal({
                    ...imageModal,
                    moadal: true,
                    data: {
                        name: x,
                        type: type,
                        image: img
                    }
                });
                break;
        }
    }

    //fetc phelbo Login details with
    const searchLoginDetails = async () => {
        setLoading(true);

        await axios.post("api/v1/HomeCollectionLoginDetail/GetData", {
            FromDate: moment(searchData.FromDate).format("DD/MMM/YYYY"),
            ToDate: moment(searchData.ToDate).format("DD/MMM/YYYY"),
            CityId: searchData.CityId,
            StateId: searchData.StateId
        })
            .then((res) => {
                if (res.data.message) {
                    setLoading(false);
                    setPhleboTable(res.data.message)
                    toast.success('Found Details');

                }
            })
            .catch((err) => {
                setLoading(false);
                console.log(err);
                setPhleboTable(null)
                toast.error(err?.res?.data ? err?.res?.data : 'No record found')
            });

        setLoading(false);
        //};
        setLoading(false);
        // setErros(generatedError);
    }

    // On Clicking Plus icon within the table new table will be showed with extra details which is being fetched from server
    const handleShowSecondTable = async (id) => {
        await axios.post("api/v1/HomeCollectionLoginDetail/GetDetail", {
            FromDate: moment(searchData.FromDate).format("DD/MMM/YYYY"),
            ToDate: moment(searchData.ToDate).format("DD/MMM/YYYY"),
            PhlebotomistId: id
        }).then((res) => {
            if (res.data.message) {
                setLoading(false);
                setSDetailsModal({
                    ...sDetailsModal,
                    moadal: true,
                    data: res.data.message,
                })
                toast.success('Found Details');
            }
        }).catch((err) => {
            setLoading(false);
            console.log(err);
            toast.error(err?.res?.data ? err?.res?.data : 'No record found')
        });

    }

    // onClick clear phelbo table and searchdata
    const handleClear = () => {
        setPhleboTable(null)
        setSearchData({
            StateId: "",
            CityId: "",
            FromDate: new Date(),
            ToDate: new Date(),
        })
    }

    return (
        <>
            <div className="box box-success">
                {imageModal?.moadal && (
                    <ImageModal
                        show={imageModal.moadal}
                        data={imageModal.data}
                        handleClose={() => {
                            setImageModal({
                                modal: false,
                                data: "",
                            });
                        }}

                    />
                )}
                {sDetailsModal?.moadal && (
                    <LoginDetailTableModal
                        show={sDetailsModal.moadal}
                        data={sDetailsModal?.data}
                        handleClose={() => {
                            setSDetailsModal({
                                modal: false,
                                data: "",
                            });
                        }}

                    />
                )}
                <div className="box-header with-border">
                    <h3 className="box-title">Home Collection Phelbotomist Login Detail</h3>
                </div>
                <div className="box-body" >
                    <div className="row">
                        <label className="col-sm-1" htmlFor="inputEmail3">
                            {t("From Date")}:
                        </label>
                        <div className="col-sm-2">
                            <DatePicker
                                className="form-control input-sm"
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
                    </div>
                    <div className="row" style={{ display: "flex", justifyContent: "center" }}>
                        <div className="col-sm-1"  >
                            <button
                                type="Search"
                                className="btn btn-block btn-info btn-sm"
                                onClick={searchLoginDetails}
                            >
                                {t("Search")}
                            </button>
                        </div>
                    </div>
                </div>
            </div >
            {phleboTable &&
                <div className='box'>
                    <div className='box-body'>
                        <div
                            className="box-body divResult boottable table-responsive"
                            id="no-more-tables" >
                            <div className="row">
                                <table
                                    className="table table-bordered table-hover table-striped tbRecord "
                                    cellPadding="{0}"
                                    cellSpacing="{0}"
                                >
                                    <thead className="cf text-center" style={{ zIndex: 99 }}>
                                        <tr>
                                            <th className="text-center">{t("#")}</th>
                                            <th className="text-center">{t("Details")}</th>
                                            <th className="text-center">{t("State")}</th>
                                            <th className="text-center">{t("City")}</th>
                                            <th className="text-center">{t("Phelbotomist")}</th>
                                            <th className="text-center">{t("Mobile")}</th>
                                            <th className="text-center">{t("Login Date and Time")}</th>
                                            <th className="text-center">{t("Body Tempreture")}</th>
                                            <th className="text-center">{t("Selfi Image")}</th>
                                            <th className="text-center">{t("Bike Image")}</th>
                                            <th className="text-center">{t("Bag Image")}</th>
                                            <th className="text-center">{t("Temp Image")}</th>
                                        </tr>
                                    </thead>


                                    {phleboTable && phleboTable.map((ele, index) => (
                                        <tbody>
                                            {loading ? (
                                                <td colSpan={12}>{<Loading />}</td>
                                            ) : (
                                                <tr key={index}>
                                                    <td data-title="#" className="text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td data-title="Cancel" className="text-center">
                                                        <span onClick={() => handleShowSecondTable(ele.PhlebotomistId
                                                        )} ><i className="fa fa-eye" /></span>
                                                    </td>
                                                    <td data-title="State" className="text-center">
                                                        {ele.State}&nbsp;
                                                    </td>
                                                    <td data-title="City" className="text-center">
                                                        {ele.City}&nbsp;
                                                    </td>
                                                    <td data-title="Name" className="text-center">
                                                        {ele.Name}&nbsp;
                                                    </td>
                                                    <td data-title="Mobile" className="text-center">
                                                        {ele.Mobile}&nbsp;
                                                    </td>
                                                    <td data-title="LoginDate" className="text-center">
                                                        {ele.LoginDate}&nbsp;
                                                    </td>
                                                    <td data-title="TempValue" className="text-center">
                                                        {ele.TempValue ?? "Not Recorded"}&nbsp;
                                                    </td>
                                                    <td data-title="Selfi Image" className="text-center">
                                                        <span onClick={() => handleModalData("selfiImage", "Selfi Image", ele.SelfieImage, ele.Name)}><i className="fa fa-search" /></span>
                                                    </td>
                                                    <td data-title="Bike Image" className="text-center">
                                                        <span onClick={() => handleModalData("bikeImage", "Bike Image", ele.BikeImage, ele.Name)}><i className="fa fa-search" /></span>
                                                    </td>
                                                    <td data-title="Bag Image" className="text-center">
                                                        <span onClick={() => handleModalData("bagImage", " Bag Image", ele.BagImage, ele.Name)}><i className="fa fa-search" /></span>
                                                    </td>
                                                    <td data-title="Temp Image" className="text-center">
                                                        <span onClick={() => handleModalData("tempImage", "Tempreture Image", ele.TempImage, ele.Name)}><i className="fa fa-search" /></span>
                                                    </td>
                                                </tr >
                                            )}
                                        </tbody>
                                    ))}
                                </table>
                            </div>
                        </div>
                        <div className="row" style={{ display: "flex", justifyContent: "center" }}>
                            <div className="col-sm-1"  >
                                <button
                                    type="Search"
                                    className="btn btn-block btn-danger btn-sm"
                                    onClick={handleClear}
                                >
                                    {t("Clear")}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>}
        </>)
}

export default PhelboLoginDetails
