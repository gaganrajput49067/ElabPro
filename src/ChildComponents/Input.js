import React from "react";

function Input({
  placeholder,
  type,
  name,
  id,
  value,
  onChange,
  defaultValue,
  className,
  disabled,
  checked,
  step,
  autoComplete,
  onKeyDown,
  onInput,
  onBlur,
  max,
  min,
  readOnly,
  required,
}) {
  return (
    <input
      name={name}
      type={type}
      value={value}
      placeholder={placeholder}
      className={className}
      onChange={onChange}
      disabled={disabled}
      defaultValue={defaultValue}
      step={step}
      checked={checked}
      autoComplete={autoComplete}
      onKeyDown={onKeyDown}
      onInput={onInput}
      id={id}
      maxLength={max}
      max={max}
      readOnly={readOnly}
      onWheel={(e) => type === "number" && e.target.blur()}
      onBlur={onBlur}
      minLength={min}
      min={0}
      required={required}
    />
  );
}

export default Input;
