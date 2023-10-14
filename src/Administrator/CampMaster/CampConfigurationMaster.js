import React from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";

const CampConfigurationMaster = () => {
  return (
    <>
      <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
        <div className="container-fluid">
          <div className="card shadow mb-4 mt-4">
            <div className="card-header py-3">
              <div className="clearfix">
                <h6 className="m-0 font-weight-bold text-primary float-left">
                  Camp Configuration Count Master
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
            </div>
            <div className="card-footer">
              <div className="col-sm-2 form-group">
                <input type="checkbox"></input>
                <label className="control-label mx-2">Approved</label>
              </div>
              <button className="btn btn-success mx-4 mt-2">Search</button>
              <button className="btn btn-success mt-2">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CampConfigurationMaster;
