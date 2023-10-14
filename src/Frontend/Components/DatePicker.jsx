import React, { useEffect, useState } from "react";
import Datepicker from "react-datepicker";

const DatePicker = ({
  date,
  onChange,
  name,
  maxDate,
  minDate,
  onChangeTime,
  onBlur,
  secondName,
  disabled,
}) => {
  const [Time, setTime] = useState({
    Hour: secondName === "FromTime" ? "00" : "23",
    Minute: secondName === "FromTime" ? "00" : "59",
    second: secondName === "FromTime" ? "00" : "59",
  });

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Validate the time format
    if (name === "Hour") {
      const hour = value.replace(/\D/g, ""); // Remove non-numeric characters
      if (hour.length > 2) return; // Restrict to 2 digits
      if (Number(hour) > 23) return; // Restrict to 0-23 range
      setTime({ ...Time, [name]: hour });
    } else if (name === "Minute") {
      const minute = value.replace(/\D/g, "");
      if (minute.length > 2) return;
      if (Number(minute) > 59) return; // Restrict to 0-59 range
      setTime({ ...Time, [name]: minute });
    }
    setTime({ ...Time, [name]: value });
  };

  useEffect(() => {
    if (secondName) {
      onChangeTime(Time, secondName);
    }
  }, [Time]);

  return (
    <table cellPadding={0} cellSpacing={0} style={{ width: "100%" }}>
      <tr>
        <td>
          <Datepicker
            showMonthDropdown
            selected={date}
            onChange={(e) => onChange(e, name)}
            name={name}
            disabled={disabled}
            autoComplete="off"
            onBlur={onBlur}
            showYearDropdown
            className={`form-control input-sm`}
            dateFormat="dd-MMM-yyyy"
            maxDate={maxDate}
            minDate={minDate ? minDate : new Date("01-01-1900")}
            placeholder="Select Date"
          />
        </td>
        {secondName && (
          <td>
            <input
              type="text"
              className="form-control input-sm"
              style={{ width: "40px" }}
              value={Time?.Hour}
              name="Hour"
              onChange={handleChange}
            />
          </td>
        )}
        {secondName && (
          <td>
            <input
              type="text"
              className="form-control input-sm"
              style={{ width: "40px" }}
              value={Time?.Minute}
              name="Minute"
              onChange={handleChange}
            />
          </td>
        )}
      </tr>
    </table>
  );
};

export default DatePicker;
