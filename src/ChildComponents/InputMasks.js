import React, { useState } from "react";
import InputMask from "react-input-mask";

function InputMasks({ marks, placeholder }) {
  const [state, setState] = useState("");

  const handleChange = (event) => {
    const { value } = event.target;
    setState(value);
  };

  return (
    <>
      <InputMask
        mask={marks}
        placeholder={placeholder}
        className="form-control"
        value={state}
        onChange={handleChange}
      ></InputMask>
    </>
  );
}

export default InputMasks;
