import moment from "moment";

export const dateConfig = (date,withTime) => {
  if(withTime===0)
  {
    return moment(date && date).format("DD/MMM/YYYY") === "Invalid date"
    ? "-"
    : moment(date && date).format("DD/MMM/YYYY");
 
  }
  else
  {
    return moment(date && date).format("DD/MMM/YYYY hh:mm a") === "Invalid date"
    ? "-"
    : moment(date && date).format("DD/MMM/YYYY hh:mm a");
  }
};

