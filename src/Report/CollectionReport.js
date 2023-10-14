import React from "react";

function CollectionReport() {
  return (
    <div
      className="content-wrapper"
      style={{ minHeight: "955.604px" }}
      data-select2-id="18"
    >
      <div className="container-fluid" style={{ padding: "10px" }}>
        <div className="card shadow mb-4">
          <div className="card-header py-3" style={{ display: "block" }}>
            <span className="m-0 font-weight-bold text-primary">
              Patient Registration
            </span>
          </div>
          <div
            className="card-body"
            style={{ paddingTop: "3px", paddingBottom: "3px" }}
          >
            <div className="row">
              <div className="col-sm-2">
                <label className="control-label" htmlFor="MobileNo">
                  Mobile No
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CollectionReport;
