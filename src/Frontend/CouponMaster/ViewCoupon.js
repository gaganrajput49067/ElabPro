import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Input from "../../ChildComponents/Input";
import { toast } from "react-toastify";
import axios from "axios";
const ViewCoupon = ({ show, setShow }) => {
  const { t } = useTranslation();
  return (
    <>
      <Modal show={show?.ViewCoupon} size="md">
        <div
          className="box-success"
          style={{ marginTop: "200px", backgroundColor: "transparent" }}
        >
          <Modal.Body>
            <div className="box-body">
              <div className="row">
                <label className="col-sm-4">Search Coupon Code : </label>
                <Input
                  className="col-sm-8"
                  placeholder="Enter Coupon Code"
                ></Input>
              </div>

              <div
                className="box-body divResult boottable table-responsive "
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
                        <th>
                          <div className="col-sm-6">Coupon Code</div>
                          <div className="col-sm-6">Total Coupon : 0</div>
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      <>
                        <tr>
                          <td data-title="Coupon Code">CouponList</td>
                        </tr>
                      </>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Modal.Body>

          <Modal.Footer>
            <div className="box-body">
              <div className="row" style={{ textAlign: "center" }}>
                <div className="col-md-12">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setShow({ ...show, ViewCoupon: false });
                    }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </Modal.Footer>
        </div>
      </Modal>
    </>
  );
};

export default ViewCoupon;
