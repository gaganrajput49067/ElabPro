import React from 'react'
import { useTranslation } from "react-i18next";
import { SelectBox,SelectBoxWithCheckbox } from '../../ChildComponents/SelectBox';
import { useState } from 'react';
import axios from "axios";
import { toast } from "react-toastify"
import { useEffect } from 'react';
//import Loading from "./util/Loading";
import Loading from '../util/Loading';


const CenterAccess = () => {
    const [loading, setLoading] = useState(false);// This state is used for setting loading screen
    const [center, setCenter] = useState([]) // This state is used for setting states
    const [allCenter, setAllCenter] = useState([]) // This state is used for setting cities
    const [selectedCenter, setSelectedCenter] = useState({
        Data: [],
        CentreID: ""
    })
    const [centerTable, setCenterTable] = useState([]) // setting phelbo table after search

    const { t } = useTranslation();


    // fetching center
    const fetchCenter = () => {
        axios.get('/api/v1/Centre/getGlobalCentres').then((res) => {
            let data = res.data.message;
            let value = data.map((ele) => {
                return {
                    value: ele.CentreID,
                    label: ele.Centre,
                    DefaultCentreId: ele.DefaultCentreId,
                }
            });
            console.log(data)
            setCenter(value)
        })
            .catch((err) => {
                console.log(err)
                toast.error('Something went wrong')
            })
    }


    const fetchAllCenter = () => {
        axios
            .get("/api/v1/Employee/GetAllCentres")
            .then((res) => {
                const data = res?.data?.message;
                const val = data.map((ele) => {
                    return {
                        value: ele?.CentreID,
                        label: ele?.Centre,
                    };
                });
                setAllCenter(val)
            })
            .catch((err) => {
                console.log(err);
            });
    }

    useEffect(() => {
        fetchCenter(center)
        fetchAllCenter()
    }, [])

    const handleChanges = (select, name) => {
        let val = "";
        for (let i = 0; i < select.length; i++) {
            val = val === "" ? `${select[i].value}` : `${val},${select[i].value}`;
        }
        const splitData = val.split(",")
        const mappedData = splitData.map((ele) => {
            return {
                dataCentreAccess: ele,
                isActive: "1"
            };
        });
        setSelectedCenter({ ...selectedCenter, [name]: mappedData });
    };



    const handleSave = () => {
        if (selectedCenter?.CentreID === "" && selectedCenter?.Data.length === 0) {
            toast.error('All feilds are required to save')
        } else if (selectedCenter?.CentreID === "") {
            toast.error('Please select a center')
        } else if (selectedCenter?.Data.length === 0) {
            toast.error('Please select an access center')
        } else {
            axios.post('/api/v1/CentreAccess/saveCentreAccess', selectedCenter).then((res) => {
                window.location.reload();
                toast.success('Saved Successfully')
            }).catch((err) => {
                console.log(err)
                toast.error('Something went wrong')
            })
        }



    }

    console.log(selectedCenter)

    const handleRemove = (id) => {
        const payLoad = {
            CentreID: selectedCenter.CentreID,
            Data: [
                {
                    dataCentreAccess: id,
                    isActive: "0"
                }
            ]
        }
        axios.post('/api/v1/CentreAccess/DeleteCentreAccess', payLoad).then((res) => {
            window.location.reload();
            toast.success('Deleted successfully')
        })
            .catch((err) => {
                console.log(err)
                toast.error('Something went wrong')
            })
    }

    const handleRemoveAll = () => {
        const mappedData = centerTable.map((ele) => {
            return {
                dataCentreAccess: ele.dataCentreAccess,
                isActive: "0"
            };
        });
        const payLoad = {
            CentreID: selectedCenter.CentreID,
            Data: mappedData
        }
        console.log(payLoad)
        axios.post('/api/v1/CentreAccess/DeleteCentreAccess', payLoad).then((res) => {
            window.location.reload();
            toast.success('All Center Deleted successfully')
        })
            .catch((err) => {
                console.log(err)
                toast.error('Something went wrong')
            })
    }

    const getData = (id) => {

        axios.post('/api/v1/CentreAccess/GetAccessData', {
            CentreID: id
        }).then((res) => {
            let data = res.data.message;
            console.log(data)
            setCenterTable(data)
        })
            .catch((err) => {
                console.log(err)
                toast.error('Something went wrong')
            })
    }
    const handleSelectChange = (event) => {
        const { name, value, checked, type } = event?.target;
        setSelectedCenter({ ...selectedCenter, [name]: value });
        getData(value)
    };



    return (
        <div className="box box-success">
            <div className="box-header with-border">
                <h3 className="box-title">Center Access Detail</h3>
            </div>
            <div className="box-body form-horizontal" >
                <div className="row">
                    <label className="col-sm-1" htmlFor="inputEmail3">
                        {t("Center")}:
                    </label>
                    <div className="col-sm-2">
                        <SelectBox
                            className="form-control input-sm"
                            name='CentreID'
                            onChange={handleSelectChange}
                            selectedValue={selectedCenter?.CenterID}
                            options={[{ label: 'Select Center', value: '' }, ...center]}
                        />

                    </div>
                    <label className="col-sm-1" htmlFor="inputEmail3">
                        {t("Center Access")}:
                    </label>
                    <div className="col-sm-2">
                        <SelectBoxWithCheckbox
                            name="Data"
                            options={allCenter}
                            onChange={handleChanges}
                        />

                    </div>
                    <div className="col-sm-1 col-xs-12">
                        <button
                            type="button"
                            className="btn btn-block btn-info btn-sm"
                            onClick={handleSave}>
                            {t("Save")}
                        </button>
                    </div>
                </div>
                <div
                    className="box-body divResult boottable table-responsive"
                    id="no-more-tables"
                >
                    <div className="row">
                        <table
                            className="table table-bordered table-hover table-striped tbRecord"
                            cellPadding="{0}"
                            cellSpacing="{0}"
                        >
                            <thead className="cf text-center" style={{ zIndex: 99 }}>
                                <tr>
                                    <th className="text-center">{t("S. No.")}</th>
                                    <th className="text-center">{t("Center")}</th>
                                    <th className="text-center">{t("Access Center")}</th>
                                    <th className="text-center"><button className="btn  btn-info btn-sm" onClick={handleRemoveAll}>{t("Remove")}</button> </th>
                                </tr>
                            </thead>
                            {loading ? (
                                <td colSpan={6}>{<Loading />}</td>
                            ) : (
                                <tbody>
                                    {centerTable && centerTable.map((ele, index) => (
                                        <>
                                            <tr key={index}>
                                                <td data-title="S.No." className="text-center">
                                                    {index + 1}
                                                </td>
                                                <td data-title="Center" className="text-center">
                                                    {ele.Centre}&nbsp;
                                                </td>
                                                <td data-title="Access Center" className="text-center">
                                                    {ele.dataCentreAccessName}&nbsp;
                                                </td>
                                                <td data-title="Remove" className="text-center">
                                                    <button className="btn  btn-info btn-sm"
                                                        onClick={() => handleRemove(ele?.dataCentreAccess)}>Cancel</button>

                                                </td>
                                            </tr>
                                        </>
                                    ))}
                                </tbody>)
                            }
                        </table>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default CenterAccess
