import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Input from "../../ChildComponents/Input";
import { toast } from "react-toastify";
import axios from "axios";
const ViewTest = ({ show, setShow }) => {
  const { t } = useTranslation();
  return (
    <>
      <Modal show={show?.ViewTest} size="md">
        <div
          className="box-success"
          style={{ marginTop: "200px", backgroundColor: "transparent" }}
        >
          <Modal.Body>
            <div className="box-body">
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
                      <th>Test</th>
                      <th>Discount(%)</th>
                      <th>Discount Amount</th>
                    </tr>
                  </thead>

                  <tbody>
                    <>
                      <tr>
                        <td data-title="Test">TestName</td>
                        <td data-title="Discount(%)">100%</td>
                        <td data-title="Discount Amount">100</td>
                      </tr>
                    </>

                  </tbody>
                 
                </table>
                <div className="row">
                    <div className="text-center">Total Amount : 100</div>
                   
                  </div>
              </div>
            </div></div>
          </Modal.Body>

          <Modal.Footer>
            <div className="box-body">
              <div className="row" style={{ textAlign: "center" }}>
                <div className="col-md-12">
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => {
                      setShow({ ...show, ViewTest: false });
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

export default ViewTest;
