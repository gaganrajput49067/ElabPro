import React, { forwardRef, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment/moment";

function CustomDate({
  className,
  name,
  value,
  onChange,
  onBlur,
  disabled,
  index,
  maxDate,
  minDate,
  placeholder,
}) {
  const getYear = () => {
    let year = [];
    for (let i = new Date().getFullYear(); i >= 1950; i--) {
      year.push(i);
    }
    return year;
  };

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <input
      className={className}
      onClick={onClick}
      ref={ref}
      disabled={disabled}
      placeholder={placeholder}
      defaultValue={value ? moment(value).format("DD-MMM-YYYY") : ""}
      onBlur={onBlur}
    ></input>
  ));
  return (
    <ReactDatePicker
      selected={value}
      name="hello"
      onChange={(date) => {
        onChange(date, name,index);
      }}
      minDate={minDate}
      customInput={<ExampleCustomInput />}
      maxDate={maxDate}
      renderCustomHeader={({
        date,
        changeYear,
        changeMonth,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
      }) => (
        <div
          style={{
            margin: 10,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <button
            onClick={decreaseMonth}
            className="btn btn-primary"
            disabled={prevMonthButtonDisabled}
          >
            {"<"}
          </button>
          <select
            value={moment(date).format("YYYY")}
            className="form-control mx-1"
            onChange={({ target: { value } }) => {
              changeYear(value);
            }}
          >
            {getYear()?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <select
            onChange={({ target: { value } }) =>
              changeMonth(months.indexOf(value))
            }
            className="form-control mx-1"
            value={months[moment(date).format("M") - 1]}
          >
            {months.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <button
            onClick={increaseMonth}
            className="btn btn-primary"
            disabled={nextMonthButtonDisabled}
          >
            {">"}
          </button>
        </div>
      )}
    />
  );
}

export default CustomDate;
