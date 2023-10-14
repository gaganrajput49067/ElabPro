import React, { useEffect,useState} from "react";
import { useTranslation } from "react-i18next";
import Modal from "react-bootstrap/Modal";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import axios from "axios";
import { toast } from "react-toastify"
import DatePicker from "../Components/DatePicker";
import moment from "moment";
const HCHistoryRescheduleModal = ({
  showReschedule,
  handleCloseReschedule,
  details
}) => {
  const { t } = useTranslation();
  console.log(details);
  const [Phelbos, setPhelbos] = useState([])
  
  const [newData,setnewData]=useState({
    AppDate:new Date(details?.AppDate),
    AppTime: "",
    PhlebotomistId: details?.PhlebotomistId
})
const [TimeSlots,setTimeSlots]=useState([])
  const bindPhelbo = () => {
    axios
        .get("/api/v1/HomeCollectionSearch/BindPhelebo")
        .then((res) => {
            const data = res.data.message;
            console.log(data)
            const Phelbos = data.map((ele) => {
                return {
                    
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
const bindTimeSlots = (value,type) => {
  if(type==='phelboId')
  {
    axios
    .post("api/v1/HomeCollectionSearch/BindSlot",{
      PreBookingId:details?.PreBookingId,
       AppDate: moment(newData?.FromDate).format("DD/MMM/YYYY"),
       PhlebotomistId:value
    })
    .then((res) => {
        const data = res.data.message;
        console.log(data)
        const TimeSlots = data.map((ele) => {
            return {
                
                value: ele,
                label: ele
            }
        })

        setTimeSlots(TimeSlots)
        
    })
    .catch((err) => {
        toast.error(err?.response?.data?.message)
    });
  }
  else if (type==='date')
  {
    axios
    .post("api/v1/HomeCollectionSearch/BindSlot",{
      PreBookingId:details?.PreBookingId,
       AppDate: moment(value).format("DD/MMM/YYYY"),
       PhlebotomistId:newData?.PhlebotomistId
    })
    .then((res) => {
        const data = res.data.message;
        console.log(data)
        const TimeSlots = data.map((ele) => {
            return {
                
                value: ele,
                label: ele
            }
        })

        setTimeSlots(TimeSlots)
        
    })
    .catch((err) => {
        toast.error(err?.response?.data?.message)
    });   

  }
  else if(type==='initial')
  {
    axios
    .post("api/v1/HomeCollectionSearch/BindSlot",{
      PreBookingId:details?.PreBookingId,
       AppDate: moment(details?.AppDate).format("DD/MMM/YYYY"),
       PhlebotomistId:details?.PhlebotomistId
    })
    .then((res) => {
        const data = res.data.message;
        console.log(data)
        const TimeSlots = data.map((ele) => {
            return {
                
                value: ele,
                label: ele
            }
        })

        setTimeSlots(TimeSlots)
        
    })
    .catch((err) => {
        toast.error(err?.response?.data?.message)
    });  
  }
  

}
const handleReschedule=()=>{
  if(newData?.AppTime !="")
  {
    const payload={
      PreBookingId: details?.PreBookingId,
      AppDate: moment(newData?.AppDate).format("DD/MMM/YYYY"),
      AppTime: newData?.AppTime,
      PhelbotomistId: newData?.PhlebotomistId
    } 
  
     axios.post('api/v1/HomeCollectionSearch/RescheduleNow',payload).then((res)=>{
         toast.success(res.data.message)
         handleCloseReschedule()
  
     }).catch((err)=>{
      console.log(err);
      toast.error(err?.response?.data?.message)
     })
  }
  else {
    toast.error('Select Appointment Time')
  }
  
}
const dateSelect = (date, name, value) => {
       console.log(name,date);

       bindTimeSlots(date,'date') 

      setnewData({
          ...newData,
          [name]: date,
  })
};
const handleChange=(e)=>{
   const {name,value}=e?.target;
   if(name==='PhlebotomistId'&&newData?.AppDate)
   {  
      bindTimeSlots(value,'phelboId')   
   }
   setnewData({...newData,[name]:value})
  }
console.log(newData)
useEffect(()=>{
  bindPhelbo();
},[])
useEffect(()=>{
  bindTimeSlots(null,'initial')
},[details])
  return (
    <>
      <Modal show={showReschedule} style={{backgroundColor:'black'}} id="RescheduleModal">
        <div
          className="box-success"
          style={{ marginTop: "100px", backgroundColor: "transparent" }}
        >
          <Modal.Header className="modal-header">
            <Modal.Title className="modal-title">
              {t("Reschedule Appointment")}
            </Modal.Title>
            <button
              type="button"
              className="close"
              onClick={handleCloseReschedule}
            >
              ×
            </button>
          </Modal.Header>
          <Modal.Body>
            <div className="box-body">
              <div className="row">
                <label className="col-sm-12  col-md-5" htmlFor="PreBooking ID" style={{textAlign:'end'}}>
                  {t("PreBooking ID")}:
                </label>
                
                <div className="col-sm-12 col-md-4">
                <span>{details.PreBookingId}</span>
                </div>
                </div>
                <div className="row">
                <label
                  className="col-sm-12  col-md-5"
                  htmlFor="Appointment Date and Time"
                  style={{textAlign:'end'}}
                >
                  {t("Appointment Date and Time")} :
                </label>
                <div className="col-sm-12 col-md-4">
                <span>{details.AppDate}</span>
                </div>
                
              </div>
              <div className="row">
                <label
                  className="col-sm-12  col-md-5"
                  htmlFor="Requested Date"
                  style={{textAlign:'end'}}
                >
                  {t("Requested Date")} :
                </label>
                <div className="col-sm-12 col-md-4">
                <span>{details.RequestDate}</span>
                </div>
                
              </div>
              <div className="row">
                <label
                  className="col-sm-12  col-md-5"
                  htmlFor="Remarks"
                  style={{textAlign:'end'}}
                 
                >
                  {t("Remarks")} :
                </label>
                <div className="col-sm-12 col-md-4">
                <span>{details.Remarks}</span>
                </div>
              </div>
               
              <div className="row">
                <label className="col-sm-12  col-md-5" htmlFor="Route"
                style={{textAlign:'end'}}>
                  {t("Route")} &nbsp;&nbsp;&nbsp;:
                </label>
                <div className="col-sm-12 col-md-4">
                <span>{details.RouteName}</span>
                </div>
                </div>
                <div className="row">
                <label
                  className="col-sm-12  col-md-5"
                  htmlFor="DropLocation"
                  style={{textAlign:'end'}}
                  
                >
                  {t("DropLocation")} :
                </label>
                <div className="col-sm-12 col-md-4">
                <span>{details.Centre}</span>
                </div>
              </div>

              <div className="row">
                <label
                  className="col-sm-12  col-md-5"
                  htmlFor="Phlebotomist Name"
                  style={{textAlign:'end'}}
                >
                  {t("Phlebotomist Name")}:
                </label>

                <div className="col-sm-12 col-md-4">
                  <SelectBox name="PhlebotomistId" className="input-sm" options={Phelbos} 
                  selectedValue={newData?.PhlebotomistId}
                  onChange={handleChange}/>
                </div>
              </div>

              <div className="row">
                <label
                  className="col-sm-12  col-md-5"
                  htmlFor="New Appointment Date"
                  style={{textAlign:'end'}}
                >
                  {t("New Appointment Date")}:
                </label>
                <div className="col-sm-12 col-md-4">
                  <DatePicker
                    name="AppDate"
                    className="select-input-box form-control input-sm required"
                    
                    onChange={dateSelect}
                    date={newData?.AppDate}
                    maxDate={
                      new Date(new Date().getTime() + 7* 24 * 60 * 60 * 1000)
                    }
                    minDate={new Date(new Date().getTime()+1* 24 * 60 * 60 * 1000)}
                  ></DatePicker>
                </div>

                
              </div>
              <div className="row">
              <label className="col-sm-12  col-md-5" htmlFor="Time" style={{textAlign:'end'}}>
                  {t("Time")}:
                </label>
                <div className="col-sm-12 col-md-3">
                  <SelectBox  className="input-sm"
                     name="AppTime"
                     options={[{label:'Select Slot',value:''},...TimeSlots]}
                     selectedValue={newData?.AppTime}
                     onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <div className="box-body">
              <div
                className="row"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-primary btn-block btn-sm"
                    onClick={handleReschedule}
                  >
                    Reschedule
                  </button>
                </div>
              </div>
            </div>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default HCHistoryRescheduleModal;