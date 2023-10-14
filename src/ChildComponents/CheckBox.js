import React from "react";

export function SimpleCheckbox({
  type,
  disabled,
  value,
  checked,
  name,
  onChange,
}) {
  return (
    <input
      className="minimal"
      type={type}
      disabled={disabled}
      name={name}
      value={value}
      checked={checked}
      onChange={onChange}
    ></input>
  );
}

export function CustomCheckBox({ type, disabled, name }) {
  return (
    <label className="main">
      <input type={type} disabled={disabled} name={name} />
      <span className="w3docs"></span>
    </label>
  );
}

export function CustomRadioBox({ type, disabled, name }) {
  return (
    <label className="containers">
      <input type={type} disabled={disabled} name={name} />
      <span className="checkmark"></span>
    </label>
  );
}
