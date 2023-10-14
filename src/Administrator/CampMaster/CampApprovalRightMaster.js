import React from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { Table } from "react-bootstrap";

const CampApprovalRightMaster = () => {
  return (
    <>
      <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
        <div className="container-fluid">
          <div className="card shadow mb-4 mt-4">
            <div className="card-header py-3">
              <div className="clearfix">
                <h6 className="m-0 font-weight-bold text-primary float-left">
                  Camp Approval Right Master
                </h6>
              </div>
            </div>
            <div className="card-body">
              <div className="col-sm-2 form-group">
                <label className="control-label">Verification Type:</label>
                <SelectBox 
                
                />
              </div>
              <div className="col-sm-2 form-group">
                <label className="control-label">Employe:</label>
                <SelectBox />
              </div>

              <div className="col-sm-2 form-group mt-2">
                <button className="btn btn-success mt-4">Save</button>
              </div>
            </div>
          </div>
          <div className="card shadow">
            <div className="card-body boottable">
              <div className="row px-2">
                <Table responsive bordered hover>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Employe Name</th>
                      <th>Verification</th>
                      <th>Status</th>
                      <th>Created By</th>
                      <th>Created Date</th>
                      <th>Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CampApprovalRightMaster;
