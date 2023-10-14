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
    let val = "";
    for (let i = 0; i < select.length; i++) {
      val = val === "" ? `${select[i].value}` : `${val},${select[i].value}`;
    }
    setPayload({ ...payload, [name]: val });
  };

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setPayload({ ...payload, [name]: event.value });
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
    <Modal show={show} onHide={onHandleShow}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">Transfer RateType</Modal.Title>
        <button type="button" className="close" onClick={onHandleShow}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                Search Criteria
              </h6>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-12 col-md-6 form-group">
                <div className="w-100">
                  <label className="control-label " htmlFor="DataType">
                    Centres:
                  </label>
                  <div>
                    <SelectBox
                      options={Centres}
                      name="CentreID"
                      onChange={handleSelectChange}
                      selectedValue={selectedValueCheck(
                        Centres,
                        payload?.CentreID
                      )}
                    />
                    {error?.CentreID && (
                      <span className="golbal-Error">{error?.CentreID}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="control-label " htmlFor="DataType">
                    Departments:
                  </label>
                  <div>
                    <SelectBoxWithCheckbox
                      name="DepartmentID"
                      options={Department}
                      value={payload?.DepartmentID}
                      onChange={handleChanges}
                    />
                    {error?.DepartmentID && (
                      <span className="golbal-Error">
                        {error?.DepartmentID}
                      </span>
                    )}
                  </div>
                </div>
                <div className="row mt-4">
                  <div className="col-md-6 col-sm-6">
                    <div>
                      <label className="control-label " htmlFor="DataType">
                        ChangeRateDDL:
                      </label>
                      <div>
                        <SelectBox
                          options={ChangeRateDDL}
                          name="ChangeRateDDL"
                          onChange={handleSelectChange}
                          selectedValue={selectedValueCheck(
                            ChangeRateDDL,
                            payload?.ChangeRateDDL
                          )}
                        />
                        {error?.ChangeRateDDL && (
                          <span className="golbal-Error">
                            {error?.ChangeRateDDL}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-6">
                    <div>
                      <label className="control-label " htmlFor="DataType">
                        ChangeRateTxt:
                      </label>
                      <div>
                        <Input
                          className="form-control pull-right reprint-date"
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
                          <span className="golbal-Error">
                            {error?.ChangeRateTxt}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="control-label " htmlFor="DataType">
                    All/Zero Rate:
                  </label>
                  <SelectBox
                    options={All_Zero}
                    onChange={handleSelectChange}
                    // selectedValue={selectedValueCheck(
                    //   All_Zero,
                    //   payload?.ChangeRateDDL
                    // )}
                  />
                </div>

                <div className="mt-3">
                  <button className="btn btn-success" onClick={handleSubmit}>
                    Transfer Rate
                  </button>
                </div>
              </div>

              <div className="col-sm-12 col-md-6 form-group">
                <div className="w-100">
                  <label className="control-label " htmlFor="DataType">
                    Centres:
                  </label>
                  <div>
                    <SelectBox
                      options={Centres}
                      name="TransferCentreID"
                      onChange={handleSelectChange}
                      selectedValue={selectedValueCheck(
                        Centres,
                        payload?.TransferCentreID
                      )}
                    />
                    {error?.TransferCentreID && (
                      <span className="golbal-Error">
                        {error?.TransferCentreID}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
          <button className="btn btn-danger" onClick={onHandleShow}>Close</button>
      </Modal.Footer>
    </Modal>
  );
}

export default TransferRateType;
