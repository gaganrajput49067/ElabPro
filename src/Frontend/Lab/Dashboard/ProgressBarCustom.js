import React from "react";
import { ProgressBar } from "react-bootstrap";

function ProgressBarCustom({ value, total, text, variant }) {
  const findPercentage = () => {
    let val = 0;
    val = value === 0 ? value : (value / total) * 100;
    return val.toFixed();
  };
  return (
    <div>
      <div className="d-flex justify-content-between">
        <h5>{text}</h5>
        <h5 className="text-primary">({value})</h5>
      </div>
      <ProgressBar
        label={findPercentage() + "%"}
        now={findPercentage()}
        variant={variant}
      />
    </div>
  );
}

export default ProgressBarCustom;
