import React, { useState } from "react";
import Select from "react-select";
import { MultiSelect } from "react-multi-select-component";
import ReactSelect, { components } from "react-select";
import { useEffect } from "react";

const Option = (props) => {
  return (
    <div>
      <components.Option {...props}>
        <input
          type="checkbox"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label>{props.label}</label>
      </components.Option>
    </div>
  );
};

export const SelectBox = ({
  isDisabled,
  options,
  id,
  name,
  onChange,
  className,
  selectedValue,
  keyEvent,
  onKeyPress,
}) => {
  const customStyles = {
    control: (base) => ({
      ...base,
      height: 28,
      minHeight: 28,
    }),
    dropdownIndicator: (base) => ({
      ...base,
      paddingTop: 0,
      paddingBottom: 0,
    }),
    clearIndicator: (base) => ({
      ...base,
      paddingTop: 0,
      paddingBottom: 0,
    }),
  };

  // useEffect(() => {
  //   const data = option.unshift({ label: "Select", value: "" });
  //   setOption(data);
  // }, []);
  return (
    <>
      <select
        className={`form-control input-sm ${className}`}
        value={selectedValue?.label !== "" && selectedValue}
        disabled={isDisabled}
        name={name}
        id={id}
        defaultValue={selectedValue}
        onChange={onChange}
        onKeyDown={(e) => keyEvent && onKeyPress(e, name)}
      >
        {options?.map((ele, index) => (
          <option
            key={index}
            value={ele?.value}
            className={`Status-${ele?.status && ele?.value}`}
          >
            {ele?.label}
          </option>
        ))}
      </select>
    </>
  );
};

export const SelectBoxWithCheckbox = ({
  name,
  options,
  value,
  onChange,
  className,
  depends,
}) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (value !== "" || value.length > 0) {
      let array1 = [];
      if (typeof value === "string") {
        array1 = value?.split(",");
      } else {
        array1 = value;
      }

      var result = options.filter(function (o1) {
        return array1?.some(function (o2) {
          return o1.value == o2;
        });
      });
      setData(result);
      if (depends) {
        depends(result);
      }
    } else {
      setData([]);
    }
  }, [options, value]);

  return (
    <MultiSelect
      options={options}
      onChange={(e) => {
        onChange(e, name);
        setData(e);
      }}
      labelledBy="Select"
      value={data}
      className={className}
    />
  );
};
