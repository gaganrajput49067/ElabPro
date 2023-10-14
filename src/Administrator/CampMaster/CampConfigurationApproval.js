import React from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";

const CampConfigurationApproval = () => {
  return (
    <>
      <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
        <div className="container-fluid">
          <div className="card shadow mb-4 mt-4">
            <div className="card-header py-3">
              <div className="clearfix">
                <h6 className="m-0 font-weight-bold text-primary float-left">
                  Camp Configuration Count Approval
                </h6>
              </div>
            </div>
            <div className="card-body">
              <div className="col-sm-2 form-group">
                <label className="control-label">Business Zone:</label>
                <SelectBox />
              </div>

              <div className="col-sm-2 form-group">
                <label className="control-label">State:</label>
                <SelectBox />
              </div>

              <div className="col-sm-2 form-group">
                <label className="control-label">Financial Year:</label>
                <SelectBox />
              </div>

              <div className="col-sm-2 form-group">
                <label className="control-label">Client Type:</label>
                <SelectBox />
              </div>

              <div className="col-sm-2 form-group">
                <label className="control-label">Tag Business Lab:</label>
                <SelectBox />
              </div>

              <div className="col-sm-2 form-group">
                <label className="control-label">Client Name:</label>
                <SelectBox />
              </div>

              <div className="col-sm-6 form-group mt-3 m-0 p-0">
                <label className="control-label mx-4 ">Status:</label>

                <input type="radio" className="mx-2"></input>
                <label className="control-label">Pending</label>
                <input type="radio" className="mx-2"></input>
                <label className="control-label">Approved</label>
                <input type="radio" className="mx-2"></input>
                <label className="control-label">All</label>
              </div>
            </div>
          </div>

          <div className="card shadow">
            <div className="card-body">
              <div className="row">
                <div className="col-sm-2 form-group">
                  <input type="checkbox"></input>
                  <label className="control-label">Pending</label>
                </div>

                <div className="col-sm-2 form-group">
                  <input type="checkbox"></input>
                  <label className="control-label">Approved</label>
                </div>

                <div className="col-sm-2 form-group">
                  <button className="btn btn-success">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CampConfigurationApproval;
