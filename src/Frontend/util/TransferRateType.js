import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { All_Zero, ChangeRateDDL } from "../../ChildComponents/Constants";
import Input from "../../ChildComponents/Input";
import {
  SelectBox,
  SelectBoxWithCheckbox,
} from "../../ChildComponents/SelectBox";
import { selectedValueCheck } from "./Commonservices";

function TransferRateType({ show, onHandleShow, Centres, Department }) {
  const [payload, setPayload] = useState({
    CentreID: "",
    DepartmentID: "",
    ChangeRateDDL: "",
    ChangeRateTxt: "",
    TransferCentreID: "",
  });

  const [error, setError] = useState({});

  const handleChanges = (select, name) => {
    const val = select.map((ele) => {
      return ele?.value;
    });
    console.log(val);
    setPayload({ ...payload, [name]: val });
  };

  const handleSelectChange = (event) => {
    const { name, value } = event?.target;
    setPayload({ ...payload, [name]: value });
  };

  console.log(payload);

  const validations = () => {
    let err = "";
    if (payload?.CentreID === "") {
      err = { ...err, CentreID: "This Field is Required" };
    }
    if (payload?.DepartmentID === "") {
      err = { ...err, DepartmentID: "This Field is Required" };
    }
    if (payload?.ChangeRateDDL === "") {
      err = { ...err, ChangeRateDDL: "This Field is Required" };
    }
    if (payload?.ChangeRateTxt === "") {
      err = { ...err, ChangeRateTxt: "This Field is Required" };
    }
    if (payload?.TransferCentreID === "") {
      err = { ...err, TransferCentreID: "This Field is Required" };
    }
    return err;
  };

  const handleSubmit = () => {
    const generatedError = validations();
    if (generatedError === "") {
      axios
        .post("/api/v1/RateList/SaveTransferRateType", payload)
        .then((res) => {
          console.log(res);
          toast.success(res?.data?.message);
          onHandleShow();
          setError({});
          setPayload({
            CentreID: "",
            DepartmentID: "",
            ChangeRateDDL: "",
            ChangeRateTxt: "",
            TransferCentreID: "",
          });
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
        });
    } else {
      setError(generatedError);
    }
  };

  useEffect(() => {
    if (payload?.CentreID !== "" && payload?.TransferCentreID !== "") {
      if (payload?.CentreID === payload?.TransferCentreID) {
        setPayload({ ...payload, TransferCentreID: "" });
        toast.error("Source And Destination Centre Cant Be Same.");
      }
    }
  }, [payload?.CentreID, payload?.TransferCentreID]);

  console.log(payload);
  return (
    <Modal show={show} onHide={onHandleShow} size="md">
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">Transfer RateType</Modal.Title>
        <button type="button" className="close" onClick={onHandleShow}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="box_Container form-horizontal">
          <div className="box-header with-border box_header">
            <h6 className="m-0 font-weight-bold text-primary float-left">
              Search Criteria
            </h6>
          </div>
          <div className="box-body">
            <div className="row bootRow">
              <div className="col-sm-12 col-md-6">
                <label>From RateType:</label>
                <SelectBox
                  options={Centres}
                  name="CentreID"
                  onChange={handleSelectChange}
                  selectedValue={payload?.CentreID}
                />
                {error?.CentreID && (
                  <span className="golbal-Error">{error?.CentreID}</span>
                )}
              </div>
              <div className="col-sm-12 col-md-6">
                <label>To RateType:</label>
                <SelectBox
                  options={Centres}
                  name="TransferCentreID"
                  onChange={handleSelectChange}
                  selectedValue={payload?.TransferCentreID}
                />
                {error?.TransferCentreID && (
                  <span className="golbal-Error">
                    {error?.TransferCentreID}
                  </span>
                )}
              </div>
            </div>
            <div className="row bootRow">
              <div className="col-sm-12 col-md-6">
                <label>Department:</label>
                <SelectBoxWithCheckbox
                  name="DepartmentID"
                  options={Department}
                  value={payload?.DepartmentID}
                  onChange={handleChanges}
                />
                {error?.DepartmentID && (
                  <span className="golbal-Error">{error?.DepartmentID}</span>
                )}
              </div>
            </div>
            <div className="row bootRow">
              <div className="col-md-3 col-sm-12">
                <label>ChangeRateDDL:</label>
                <SelectBox
                  options={ChangeRateDDL}
                  name="ChangeRateDDL"
                  onChange={handleSelectChange}
                  selectedValue={payload?.ChangeRateDDL}
                />
                {error?.ChangeRateDDL && (
                  <span className="golbal-Error">{error?.ChangeRateDDL}</span>
                )}
              </div>

              <div className="col-md-3 col-sm-12">
                <label>ChangeRateTxt:</label>
                <Input
                  className="select-input-box form-control input-sm"
                  placeholder="ChangeRateTxt"
                  type="number"
                  name="ChangeRateTxt"
                  value={payload?.ChangeRateTxt}
                  onChange={(e) => {
                    setPayload({
                      ...payload,
                      ChangeRateTxt: e.target.value,
                    });
                  }}
                />
                {error?.ChangeRateTxt && (
                  <span className="golbal-Error">{error?.ChangeRateTxt}</span>
                )}
              </div>
            </div>
            <div className="row bootRow">
              <div className="col-md-6 col-sm-12">
                <label>All/Zero Rate:</label>
                <SelectBox
                  options={All_Zero}
                  onChange={handleSelectChange}
                  // selectedValue={selectedValueCheck(
                  //   All_Zero,
                  //   payload?.ChangeRateDDL
                  // )}
                />
              </div>
            </div>
            <div className="box-footer">
              <div className="row">
                <div className="col-md-3 col-sm-3">
                  <button
                    type="button"
                    className="btn btn-block btn-success btn-sm"
                    id="btnSave"
                    onClick={handleSubmit}
                  >
                    Transfer Rate
                  </button>
                </div>
                <div className="co-sm-1 col-md-1">
                  <button
                    type="button"
                    className="btn  btn-danger btn-sm"
                    id="btnClose"
                    onClick={onHandleShow}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default TransferRateType;
