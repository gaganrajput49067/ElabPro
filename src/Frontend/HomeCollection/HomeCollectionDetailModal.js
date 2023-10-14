import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Modal, Table } from "react-bootstrap";
import { toast } from "react-toastify";
import { dateConfig } from "../../util/DateConfig";
import Input from "../../ChildComponents/Input";
import { useTranslation } from "react-i18next";
import { SelectBox } from "../../ChildComponents/SelectBox";

import DatePicker from "../Components/DatePicker";
import ViewLogModal from "./ViewLogModal";
import HCHistoryCancelModal from "./HCHistoryCancelModal";
import HCHistoryRescheduleModal from "./HCHistoryRescheduleModal";
import HCEditModal from "./HCEditModal";

function HomeCollectionDetailModal({
    show,
    handleClose,
    ele,
    statusDetails

}) {

    const [testlist, setTestList] = useState([{}])
    const [showViewLog, setShowViewLog] = useState(false)
    const [showCancel, setShowcancel] = useState(false)
    const [showEdit, setShowEdit] = useState(false)
    const [formData, setFormData] = useState({})
    const [LogData, setLogData] = useState([])
    const [showReschedule, setShowReschedule] = useState(false)
    const [happyCode, setHappyCode] = useState('5')
    const [showHappyCode, setShowHappyCode] = useState(false);
    const [testDetails, setTestDetails] = useState([]);
    const [bindSourceCall, setBindSourceCall] = useState([]);
    const [PatientDetails, setPatientDetails] = useState({});

    console.log(ele)

    const { t } = useTranslation();
    const handleCloseReschedule = () => {
        setShowReschedule(false)
    }
    const handleCloseViewLog = () => {
        setShowViewLog(false)
    }
    const handleCloseCancel = () => {
        setShowcancel(false)
    }
    const handleCloseEdit = () => {
        setShowEdit(false)
    }
    const fillFormdata = () => {
        setFormData(ele)
    }
    const getHappCode = (id) => {

        axios.post('api/v1/HomeCollectionSearch/ShowHappyCode', { PreBookingId: 5 }).then((res) => {
            console.log(res.data.message);
            setShowHappyCode(true);
        }).catch((err) => {
            toast.error('Happy code not found')
        })
    }
    const bindTest = () => {
        axios.post('api/v1/HomeCollectionSearch/BindItemDetail', {
            PreBookingId: ele?.PreBookingId
        }).then((res) => {
            setTestDetails(res.data.message)
        })
            .catch((err) => {
                toast.error(err?.response?.data?.message ? err?.response?.data?.message : 'No Test Found')
            })
    }
    const getTotalAmount = () => {

        return testDetails.reduce((total, item) => total + item.NetAmt, 0)
    }


    const getLogData = () => {
        axios.post('api/v1/HomeCollectionSearch/ViewLog ', {
            PreBookingId: ele?.PreBookingId
        }).then((res) => {

            setLogData(res.data.message)

        }).catch((err) => {
            toast.error(err?.data?.message ? err?.data?.message : 'Could not find log')
        })
    }

    const getPatientDetails = () => {
        axios
          .post("api/v1//HomeCollectionSearch/EditAppointment", {
            PatientId: ele?.Patient_ID,
          })
          .then((res) => {
            const details = res?.data?.message;
            setPatientDetails(details);
        })
     .catch((err) => {
            toast.error(err?.response?.data?.message);
          });
      };


 const getBindSourceCall = () => {
        axios
          .get("/api/v1/CustomerCare/bindcollsource")
          .then((res) => {
            const data = res?.data?.message;
            const SourceCall = data?.map((ele) => {
              return {
                value: ele?.ID,
                label: ele?.Source,
              };
            });
            setBindSourceCall(SourceCall);
          })
          .catch((err) =>
            toast.error(err?.res?.data ? err?.res?.data : "Something Went Wrong")
          );
      };
    useEffect(() => {
        fillFormdata()
        bindTest()
        getLogData()
        getBindSourceCall();
        getPatientDetails();
    }, []);

    const getCollection=()=>{
      for(let i of bindSourceCall)
      {
        if(i.value==formData?.SourceofCollection
            )
        {
            return i.label
        }
      }
   return;
}
     
    console.log(bindSourceCall);

    return (
        <>
            {showViewLog && (
                <ViewLogModal
                    data={ele}
                    viewLog={LogData}
                    showViewLog={showViewLog}
                    handleCloseViewLog={handleCloseViewLog}

                />
            )}
            {showCancel && (
                <HCHistoryCancelModal
                    showCancel={showCancel}
                    handleCloseCancel={handleCloseCancel}
                    details={ele}
                />
            )}
            {showReschedule && (
                <HCHistoryRescheduleModal
                    showReschedule={showReschedule}
                    handleCloseReschedule={handleCloseReschedule}
                    details={ele}
                />
            )}
            {showEdit && (
                <HCEditModal
                    showEdit={showEdit}
                    handleCloseEdit={handleCloseEdit}
                    details={ele}
                    testDetails={testDetails}
                    PatientDetails={PatientDetails}
                />
            )}

            <Modal show={show}  id="HomeCollectionDetailModal">
                <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                    <Modal.Header className="modal-header" style={{ position: 'sticky', zIndex: 1055, top: 0 }}
                    >
                        <Modal.Title className="modal-title">{t("Home Collection Detail")}</Modal.Title>
                        <button type="button" className="close" onClick={handleClose}>
                            ×
                        </button>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="box-body">
                            <div className="row" >


                                <label
                                    className="col-sm-2"
                                    htmlFor="CurrentStatus"
                                    style={{ textAlign: "start" }}
                                >
                                    {t("Current Status")} :
                                </label>
                                <div className="col-sm-2">
                                    <span>{formData?.CStatus}</span>
                                </div>

                                <label
                                    className="col-sm-2"
                                    htmlFor="lastupdatedat"
                                    style={{ textAlign: "start" }}
                                >
                                    {t("Last Update at")} :
                                </label>
                                <div className="col-sm-2">
                                    <span>{formData?.CurrentStatusDate}</span>
                                </div>

                                <label
                                    className="col-sm-2"
                                    htmlFor="Mobile No."
                                    style={{ textAlign: "start" }}
                                >
                                    PreBooking Id:
                                </label>
                                <div className="col-sm-2" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span>{formData?.PreBookingId}</span>
                                    <button type="button" className="btn btn-primary btn-sm" onClick={() => {
                                        setShowViewLog(true)
                                    }}>View Log</button>
                                </div>


                            </div>
                            <div className="row">


                                <label
                                    className="col-sm-2"
                                    htmlFor="From"
                                    style={{ textAlign: "start" }}
                                >
                                    {t("Patient Name")} :
                                </label>
                                <div className="col-sm-2">

                                    <span>{formData?.PatientName
                                    }</span>
                                </div>

                                <label
                                    className="col-sm-2"
                                    htmlFor="Mobile"
                                    style={{ textAlign: "start" }}
                                >
                                    Mobile :
                                </label>
                                <div className="col-sm-2">
                                    <span>{formData?.Mobile
                                    }</span>
                                </div>

                                <label
                                    className="col-sm-2"
                                    htmlFor="State"
                                    style={{ textAlign: "start" }}
                                >
                                    {t("State")} :
                                </label>
                                <div className="col-sm-2">
                                    <span>{formData?.State}</span>
                                </div>


                            </div>
                            <div className="row">


                                <label
                                    className="col-sm-2"
                                    htmlFor="From"
                                    style={{ textAlign: "start" }}
                                >
                                    {t("City")} :
                                </label>
                                <div className="col-sm-2">

                                    <span>{formData?.City}</span>
                                </div>

                                <label
                                    className="col-sm-2"
                                    htmlFor="Mobile No."
                                    style={{ textAlign: "start" }}
                                >
                                    {t("Area")} :
                                </label>
                                <div className="col-sm-2">
                                    <span>{formData?.Locality}</span>
                                </div>

                                <label
                                    className="col-sm-2"
                                    htmlFor="From"
                                    style={{ textAlign: "start" }}
                                >
                                    {t("Pincode")} :
                                </label>
                                <div className="col-sm-2">
                                    <span>{formData?.PinCode}</span>
                                </div>
                            </div>
                            <div className="row">



                                <label
                                    className="col-sm-2"
                                    htmlFor="Landmark"
                                    style={{ textAlign: "start" }}
                                >
                                    {t("Landmark")} :
                                </label>
                                <div className="col-sm-2">
                                    <span>{formData?.Landmark}</span>
                                </div>

                                <label
                                    className="col-sm-2"
                                    htmlFor="Route"
                                    style={{ textAlign: "start" }}
                                >
                                    {t("Route")} :
                                </label>
                                <div className="col-sm-2">
                                    <span>{formData?.RouteName}</span>
                                </div>
                            </div>
                            <div className="row">
                                <label
                                    className="col-sm-2"
                                    htmlFor="Address"
                                    style={{ textAlign: "start" }}
                                >
                                    {t("Address")} :
                                </label>
                                <div className="col-sm-2">
                                    <span>{formData?.House_No
                                    }</span>
                                </div>
                                <label
                                    className="col-sm-2"
                                    htmlFor="Remarks"
                                    style={{ textAlign: "start" }}
                                >
                                    {t("Remarks")} :
                                </label>
                                <div className="col-sm-2">
                                    <span>{formData?.Remarks
                                    }</span>
                                </div>
                                <label
                                    className="col-sm-2"
                                    htmlFor="From"
                                    style={{ textAlign: "start" }}
                                >
                                    Happy Code:
                                </label>
                                <div className="col-sm-2">
                                    {!showHappyCode && <span style={{ backgroundColor: 'blue', color: 'white', cursor: 'pointer' }} onClick={() => {
                                        getHappCode(ele.PreBookingId)
                                    }}>Show Happy Code</span>}
                                    {showHappyCode && <span style={{ cursor: 'pointer' }} onClick={() => {
                                        setShowHappyCode(false)
                                    }} >{formData?.VerificationCode}</span>}
                                </div>
                            </div>

                           
                            <div className="row" >
                                <table
                                    className="table table-bordered table-hover table-striped tbRecord"
                                    cellPadding="{0}"
                                    cellSpacing="{0}"
                                >
                                    <thead className="cf text-center" style={{ zIndex: 99 }}>
                                        <tr>
                                            <th className="text-center">{t("Entry Date")}</th>
                                            <th className="text-center">{t("Entry By")}</th>
                                            <th className="text-center">{t("Appointment Date")}</th>
                                            <th className="text-center">{t("UHID")}</th>
                                            <th className="text-center">{t("Age/Gender")}</th>
                                            <th className="text-center">{t("Alternate Mobile")}</th>
                                            <th className="text-center">{t("Refer Doctor")}</th>
                                         
                                            <th className="text-center">{t("SourceofCollection")}</th>
                                            <th className="text-center">{t("VIP")}</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td data-title="Entry Date" className="text-center">
                                                {formData?.EntryDateTime} &nbsp;
                                            </td>
                                            <td data-title="Entry By" className="text-center">
                                                {formData?.EntryByName}&nbsp;
                                            </td>
                                            <td data-title="Appointment Date" className="text-center">
                                                {formData?.AppDate}&nbsp;
                                            </td>
                                            <td data-title="UHID" className="text-center">
                                                {formData?.Patient_ID}&nbsp;
                                            </td>
                                            <td data-title="Age/Gender" className="text-center">
                                                {formData?.Age}/{formData?.Gender}&nbsp;
                                            </td>
                                            <td data-title="Alternate Mobile" className="text-center">
                                                {formData?.AlternateMobileNo}&nbsp;
                                            </td>
                                            <td data-title="Refer Doctor" className="text-center">
                                                {formData?.Doctor}&nbsp;
                                            </td>
                                            
                                            <td data-title="SourceofCollection" className="text-center">
                                                {getCollection()}&nbsp;
                                            </td>
                                            <td data-title="VIP" className="text-center">
                                                {formData?.Vip==0?"No":"Yes"}&nbsp;
                                            </td>

                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="row">
                                <table
                                    className="table table-bordered table-hover table-striped tbRecord"
                                    cellPadding="{0}"
                                    cellSpacing="{0}"
                                >
                                    <thead className="cf text-center" style={{ zIndex: 99 }}>
                                        <tr>
                                            <th className="text-center">{t("Phelbotomist")}</th>
                                            <th className="text-center">{t("PhelboMobile")}</th>
                                            <th className="text-center">{t("Centre")}</th>
                                            <th className="text-center">{t("CheckInDate")}</th>
                                            <th className="text-center">{t("CompletedDate")}</th>
                                            <th className="text-center">{t("BookingDate")}</th>
                                            <th className="text-center">{t("VisitID")}</th>
                                            <th className="text-center">{t("Hard Copy")}</th>
                                            <th className="text-center">{t("PhelboRating")}</th>
                                            <th className="text-center">{t("PatientRating")}</th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td data-title="Phelbotomist" className="text-center">
                                                {formData?.PhleboName}&nbsp;
                                            </td>
                                            <td data-title="PhelboMobile" className="text-center">
                                                {formData?.PMobile}&nbsp;
                                            </td>
                                            <td data-title="center" className="text-center">
                                                {formData?.Centre}&nbsp;
                                            </td>
                                            <td data-title="CheckInDate" className="text-center">
                                                {formData?.CheckInDateTime}&nbsp;
                                            </td>
                                            <td data-title="CompletedDate" className="text-center">
                                                {formData?.FinalDoneDate} &nbsp;

                                            </td>
                                            <td data-title="BookingDate" className="text-center">
                                                {formData?.EntryDateTime} &nbsp;
                                            </td>
                                            <td data-title="VisitID" className="text-center">
                                                {formData?.VisitId} &nbsp;
                                            </td>
                                            <td data-title="Hard Copy" className="text-center">
                                                {formData?.HardCopyRequired===1?'Yes':'No'}&nbsp;
                                            </td>
                                            <td data-title="PhelboRating" className="text-center">
                                                {formData?.phelborating}&nbsp;
                                            </td>
                                            <td data-title="PatientRating" className="text-center">
                                                {formData?.PatientRating}&nbsp;
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="row divResult  table-responsive  boottable"
                                id="no-more-tables">
                                <table
                                    className="table table-bordered table-hover table-striped tbRecord "
                                    cellPadding="{0}"
                                    cellSpacing="{0}"
                                >
                                    <thead className="cf text-center" style={{ zIndex: 99 }}>
                                        <tr>
                                            <th className="text-center">{t("Phelbo Feedback")}</th>
                                            <th className="text-center">{t("Patient Feedback")}</th>
                                            <th className="text-center">{t("Images")}</th>

                                        </tr>
                                    </thead>

                                    <tbody>
                                        <tr>
                                            <td data-title="Phelbo Feedback" className="text-center">
                                                {formData?.phelbofeedback} &nbsp;
                                            </td>
                                            <td data-title="Phelbo Feedback" className="text-center">
                                                {formData?.PatientFeedback} &nbsp;
                                            </td>

                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        
                        


                            <Modal.Header className="modal-header " style={{ display: 'flex', alignItems: 'center',  maxHeight: '30px' }}>
                                <Modal.Title className="modal-title">{t("Test Detail")}</Modal.Title>
                                <Modal.Title className="modal-title">{t("Payment Mode")}:{testDetails[0]?.PaymentMode}&nbsp;&nbsp;&nbsp;{t("Total Amount")}:{getTotalAmount()}</Modal.Title>
                            </Modal.Header>

                            <div >
                                <table
                                    className="table table-bordered table-hover table-striped tbRecord"
                                    cellPadding="{0}"
                                    cellSpacing="{0}"
                                >
                                    <thead className="cf text-center" style={{ zIndex: 99 }}>
                                        <tr>
                                            <th className="text-center">{t("#")}</th>
                                            <th className="text-center">{t("ItemID")}</th>
                                            <th className="text-center">{t("Item Name")}</th>
                                            <th className="text-center">{t("Item Type")}</th>
                                            <th className="text-center">{t("Rate")}</th>
                                            <th className="text-center">{t("Disc Amt")}</th>
                                            <th className="text-center">{t("Net Amt")}</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {testDetails.map((ele, index) => (
                                            <>
                                                <tr key={index}>
                                                    <td data-title="#" className="text-center">
                                                        {index + 1}
                                                    </td>
                                                    <td data-title="ItemID" className="text-center">{ele?.ItemId} &nbsp;</td>
                                                    <td data-title="Item Name" className="text-center">{ele?.ItemName} &nbsp; </td>
                                                    <td data-title="Item Type" className="text-center">{ele?.ItemType} &nbsp; </td>
                                                    <td data-title="Rate" className="text-center">{ele?.Rate} &nbsp;</td>
                                                    <td data-title="Disc Amt" className="text-center">{ele?.Discamt} &nbsp;</td>
                                                    <td data-title="Net Amt" className="text-center">{ele?.NetAmt} &nbsp;</td>

                                                </tr>

                                            </>
                                        ))}

                                    </tbody>
                                </table>

                                <div className="row m-2" style={{ display: 'flex', justifyContent: 'center' }}>
                                    {statusDetails.cancel && <button type="button" className="col-sm-1 btn btn-primary btn-sm mx-2 " onClick={() => {
                                        setShowcancel(true)
                                    }
                                    }>Cancel </button>}
                                    {statusDetails.edit && <button type="button" className=" col-sm-1 btn btn-primary btn-sm mx-2 "
                                        onClick={() => {
                                            setShowEdit(true)
                                        }}>Edit</button>}
                                    {statusDetails.reschedule &&
                                        <button type="button" className=" col-sm-1 btn btn-primary btn-sm mx-2 "
                                            onClick={() => {
                                                setShowReschedule(true)
                                            }}>Reschedule</button>
                                    }
                                </div>


                            </div>
                        </div>



                    </Modal.Body>
                </div>
                <Modal.Footer><div className="box"></div></Modal.Footer>
            </Modal>

        </>
    );
}

export default HomeCollectionDetailModal;
