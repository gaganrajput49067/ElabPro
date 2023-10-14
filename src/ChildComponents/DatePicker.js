// import { Calendar, DateRange, DateRangePicker } from "react-date-range";
// import "react-date-range/dist/styles.css"; // main style file
// import "react-date-range/dist/theme/default.css"; // theme css file
// import React from "react";
// import "react-datepicker/dist/react-datepicker.css";
// import Input from "./Input";

// export const DatePickerTwo = ({ handleSelect, selectionRange }) => {
//   return (
//     <DateRangePicker
//       ranges={[selectionRange]}
//       onChange={(range) => handleSelect(range)}
//     />
//   );
// };

// export const DatePickers = ({ dateSelect, select2, name, minDate }) => {

//   return (
//     <Calendar
//       date={select2}
//       onChange={(date) => {
//         dateSelect(date, name);
//       }}
//       isClearable={true}
//       shouldCloseOnSelect={true}
//       maxDate={new Date()}
//       minDate={minDate && new Date(minDate)}
//     />
//   );
// };

// export const DateRangerNew = ({ handleChange, state }) => {
//   return (
//     <DateRange
//       editableDateInputs={true}
//       onChange={(item) => {
//         handleChange([item.selection]);
//       }}
//       moveRangeOnFirstSelection={false}
//       ranges={state}
      
//     />
//   );
// };
