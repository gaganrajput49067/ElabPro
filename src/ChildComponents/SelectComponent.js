import React, { useEffect, useState } from "react";
import withClickOutside from "./withClickOutside";

const SelectComponent = React.forwardRef(
  ({ options, placeholder, onChange, selectedKey }, ref) => {
    const [inputValue, setInputValue] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
      if (selectedKey) {
        setInputValue(options.find((o) => o.label === selectedKey));
      }
    }, [selectedKey, options]);

    useEffect(() => {
      // if (!open && options.findIndex((o) => o.value === inputValue) === -1) {
      //   if (!inputValue) {
      //     onChange("");
      //   } else {
      //     if (selectedKey) {
      //       setInputValue(options.find((o) => o.label === selectedKey));
      //     } else {
      //       setInputValue("");
      //     }
      //   }
      // }
    }, [open, options, selectedKey, inputValue, onChange]);

    const onInputChange = (e) => {
      const searchValue = e.target.value.toLowerCase();
      setInputValue(e.target.value);
      setOpen(true); // Open the dropdown when searching
      if (searchValue) {
        const filteredOptions = options.filter((option) =>
          option.label.toLowerCase().startsWith(searchValue)
        );
        setFilteredOptions(filteredOptions);
      } else {
        setFilteredOptions(options);
      }
    };

    const onInputClick = () => {
      setOpen((prevValue) => !prevValue);
      if (open) {
        setFilteredOptions(options); // Show all options when the dropdown is clicked
      }
    };

    const onOptionSelected = (option) => {
      onChange !== undefined && onChange(option.label);
      onChange !== undefined && setInputValue(option.label);
      setOpen(false);
    };

    const clearDropdown = () => {
      setInputValue("");
      onChange("");
    };

    const [filteredOptions, setFilteredOptions] = useState(options);

    return (
      <div className="dropdown-container" ref={ref}>
        <div className="input-container" onClick={onInputClick}>
          <input
            type="text"
            value={inputValue}
            placeholder={placeholder}
            onChange={onInputChange}
            className="select-input-box form-control input-sm"
          />
          <div className="input-arrow-container">
            <i className="input-arrow" />
          </div>

          {selectedKey || inputValue ? (
            <div className="input-clean-container" onClick={clearDropdown}>
              x
            </div>
          ) : null}
        </div>
        <div className={`dropdown1 ${open ? "visible" : ""}`}>
          {filteredOptions.map((opt, index) => (
            <div
              key={index}
              onClick={() => onOptionSelected(opt)}
              className="option"
              value={opt.value}
            >
              {opt.label}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default withClickOutside(SelectComponent);
