import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { SimpleCheckbox } from "../../ChildComponents/CheckBox";
import DatePicker from "../Components/DatePicker";
import Modal from "react-bootstrap/Modal";

const CouponMasterEdit = ({ show, setShow }) => {
  const { t } = useTranslation();
  const [selectedOption, setSelectedOption] = useState(null);

  const [billingType, setBillingType] = useState("Total Bill");
  const handleRadioChange = (event) => {
    setBillingType(event.target.value);
  };
  const handleRadioChange2=(event)=>{
    setSelectedOption(event.target.value)
  }
  
  return (
    <Modal show={show?.Edit} id="HomeCollectionDetailModal">
      <div
        className="box-success"
        style={{
        //   marginTop: "200px",

          backgroundColor: "transparent",
        }}
      >
        <Modal.Header className="modal-header">
          <Modal.Title className="modal-title">
            {t("Coupon Master Edit")}
          </Modal.Title>
          <button
            type="button"
            className="close"
            onClick={() => {
              setShow({ ...show, Edit: false });
            }}
          >
            ×
          </button>
        </Modal.Header>
        <Modal.Body>
          <div className="box form-horizontal">
            <div className=" box-header with-border">
              <h3 className="box-title text-center">
                {t("Centre/PUP Search")}
              </h3>
            </div>
            <div className="box-body">
              <div className="row">
                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Business Type")}:
                </label>
                <div className="col-sm-2" style={{ display: "flex" }}>
                  <label className="col-sm-4">
                    <Input
                      type="radio"
                      name="testsearchtype"
                      value="InBetween"
                    />
                    All
                  </label>
                  <label className="col-sm-4">
                    <Input
                      type="radio"
                      name="testsearchtype"
                      value="InBetween"
                    />
                    COCO
                  </label>
                  <label className="col-sm-4">
                    <Input
                      type="radio"
                      name="testsearchtype"
                      value="InBetween"
                    />
                    FOFO
                  </label>
                </div>

                <label className="col-sm-1">{t("Business Zone")}:</label>
                <div className="col-sm-2">
                  <SelectBox className="input-sm" />
                </div>
                <label className="col-sm-1">{t("State")}:</label>
                <div className="col-sm-2">
                  <SelectBox className="input-sm" />
                </div>
                <label className="col-sm-1">{t("City")}:</label>
                <div className="col-sm-2">
                  <SelectBox className="input-sm" />
                </div>
              </div>
              <div className="row">
                <label className="col-sm-1">{t("Type")}:</label>
                <div className="col-sm-2">
                  <SelectBox className="input-sm" />
                </div>
                <label className="col-sm-1">{t("Centre")}:</label>
                <div className="col-sm-2">
                  <SelectBox className="input-sm" />
                </div>
                <div className="col-sm-1">
                  <button
                    type="button"
                    className="btn btn-block btn-primary btn-sm"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="box">
            <div className=" box-header with-border">
              <h3 className="box-title text-center">{t("Coupon Detail")}</h3>
            </div>

            <div
              className="box-body divResult boottable table-responsive"
              id="no-more-tables"
            >
              <div className="row">
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf text-center" style={{ zIndex: 99 }}>
                    <tr>
                      <th className="text-center">{t("S.No")}</th>
                      <th className="text-center">
                        {t("Coupon Applocable Centre/PUP")}
                      </th>
                      <th className="text-center">{t("Remove")}</th>
                    </tr>
                  </thead>

                  <tbody></tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="box form-horizontal">
            <div className=" box-header with-border">
              <h3 className="box-title text-center">{t("Coupon Entry")}</h3>
            </div>
            <div className="box-body">
              <div className="row">
                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Coupon Name")}:
                </label>
                <div className="col-sm-2" style={{ display: "flex" }}>
                  <Input className="form-control input-sm" />
                </div>
                <label className="col-sm-1">{t("Coupon Type")}:</label>
                <div className="col-sm-2">
                  <SelectBox className="input-sm" />
                </div>
                <label className="col-sm-1">{t("From Date")}:</label>
                <div className="col-sm-2">
                  <DatePicker className="input-sm" />
                </div>
                <label className="col-sm-1">{t("To Date")}:</label>
                <div className="col-sm-2">
                  <DatePicker className="input-sm" />
                </div>
              </div>
              <div className="row">
                <div
                  className="col-sm-3"
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                <div>
        <label htmlFor="MultiplePatient" className="control-label">
          {t("For Multiple Patient")}&nbsp;
        </label>
        <input 
          type="radio" 
          id="MultiplePatient" 
          name="patientType" 
          value="multiple" 
          checked={selectedOption === 'multiple'} 
          onChange={handleRadioChange2} 
        />
      </div>

      <div>
        <label htmlFor="OneTimePatient" className="control-label">
          {t("For One Time Patient")}&nbsp;
        </label>
        <input 
          type="radio" 
          id="OneTimePatient" 
          name="patientType" 
          value="oneTime" 
          checked={selectedOption === 'oneTime'} 
          onChange={handleRadioChange2} 
        />
      </div>
    </div>

                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Coupon Count")}:
                </label>
                <div className="col-sm-2" style={{ display: "flex" }}>
                  <Input className="form-control input-sm" />
                </div>
              </div>
              <div className="row">
                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Min Billing Amt")}:
                </label>
                <div className="col-sm-2" style={{ display: "flex" }}>
                  <Input className="form-control input-sm" />
                </div>
                <label className="col-sm-1">
                  <input
                    type="radio"
                    name="billingType"
                    value="Total Bill"
                    checked={billingType === "Total Bill"}
                    onChange={handleRadioChange}
                  />
                  Total Bill
                </label>
                <label className="col-sm-2">
                  <input
                    type="radio"
                    name="billingType"
                    value="TestWise Bill"
                    checked={billingType === "TestWise Bill"}
                    onChange={handleRadioChange}
                  />
                  TestWise Bill
                </label>
                <label className="col-sm-1" htmlFor="inputEmail3">
                  {t("Disc Share Type")}:
                </label>
                <div className="col-sm-2" style={{ display: "flex" }}>
                  <SelectBox className="form-control input-sm" />
                </div>
              </div>
              {billingType === "TestWise Bill" && (
                <>
                  <div className="row">
                    <label className="col-sm-1">{t("Department")}:</label>
                    <div className="col-sm-2">
                      <SelectBox className="input-sm" />
                    </div>
                    <label className="col-sm-1">{t("Test")}:</label>
                    <div className="col-sm-3">
                      <SelectBox className="input-sm" />
                    </div>
                    <div className="col-sm-1">
                      <button
                        type="button"
                        className="btn btn-block btn-primary btn-sm"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <div className="box">
                    <div className="row">
                      <div className="col-sm-2">
                        <span>Add Test</span>
                      </div>
                    </div>
                    <div className="row">
                      <table
                        className="table table-bordered table-hover table-striped tbRecord"
                        cellPadding="{0}"
                        cellSpacing="{0}"
                      >
                        <thead
                          className="cf text-center"
                          style={{ zIndex: 99 }}
                        >
                          <tr>
                            <th className="text-center">{t("Test Code")}</th>
                            <th className="text-center">{t("Test Name")}</th>
                            <th className="text-center">{t("Department")}</th>
                            <th className="text-center">{t("Disc% All")}</th>
                            <th className="text-center">{t("Disc Amt all")}</th>
                            <th className="text-center">{t("Action")}</th>
                          </tr>
                        </thead>
                      </table>
                    </div>
                  </div>
                </>
              )}

              {billingType === "Total Bill" && (
                <div className="row">
                  <label className="col-sm-1">{t("Discount Amount")}:</label>
                  <div className="col-sm-2" style={{ display: "flex" }}>
                    <Input className="form-control input-sm" />
                  </div>
                  <label className="col-sm-1">{t("Discount")}%:</label>
                  <div className="col-sm-2" style={{ display: "flex" }}>
                    <Input className="form-control input-sm" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="box form-horizontal">
            <div className="box-body">
              <div className="row">
                <div className="col-sm-1">
                  <button
                    type="button"
                    className="btn btn-block btn-warning btn-sm"
                  >
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default CouponMasterEdit;
