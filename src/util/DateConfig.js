import moment from "moment";

export const dateConfig = (date) => {
  return moment(date && date).format("DD/MMM/YYYY hh:mm a") === "Invalid date"
    ? "-"
    : moment(date && date).format("DD/MMM/YYYY hh:mm a");
};
