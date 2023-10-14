import React from "react";
import { Table } from "react-bootstrap";

const DownloadConcentForm = () => {
  return (
    <>
      <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
        <div className="container-fluid">
          <div className="card shadow mb-4 mt-4">
            <div className="card-header py-3">
              <div className="clearfix">
                <h6 className="m-0 font-weight-bold text-primary float-left">
                 Download Concent Form
                </h6>
              </div>
            </div>
            <div className="card-body boottable">
                <div className="px-2">
                    <Table responsive bordered hover>
                        <thead>
                            <tr>
                                <th>S.No</th>
                                <th>Investigations</th>
                                <th>Concent Form</th>
                                <th>Download</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                            <tr>
                                <td>{}</td>
                                <td>{}</td>
                                <td>{}</td>
                                <td>{}</td>
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

export default DownloadConcentForm;
