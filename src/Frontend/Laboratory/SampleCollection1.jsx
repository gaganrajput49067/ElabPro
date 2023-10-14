import React from "react";
import DatePicker from "../Components/DatePicker";
function SampleCollection1() {
  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h3 className="box-title">Sample Collection</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-sm-2">
              <select id="ddlSearchType" className="form-control input-sm">
                <option value="BarcodeNo" selected="selected">
                  SIN No.
                </option>
                <option value="LedgertransactionNo">Visit No.</option>
                <option value="patient_id">UHID</option>
                <option value="PName">Patient Name</option>
                <option value="HLMOPDIPDNo">OPD IPD No</option>
                <option value="WorkorderID">CRM Barcode</option>
              </select>
            </div>
            <div className="col-sm-2">
              <input type="text" className="form-control input-sm" />
            </div>
            <div className="col-sm-2">
              <div className="input-group input-group-sm">
                <span className="input-group-addon">
                  <input type="checkbox" />
                </span>

                <select className="form-control input-sm" disabled>
                  <option>All Centre</option>
                  <option>Lab No.</option>
                  <option>Barcode No.</option>
                  <option>Patient ID</option>
                </select>
              </div>
            </div>
            <div className="col-sm-2">
              <div className="input-group input-group-sm">
                <span className="input-group-addon">
                  <input type="checkbox" />
                </span>

                <select className="form-control input-sm" disabled>
                  <option>All Rate Types</option>
                  <option>Lab No.</option>
                  <option>Barcode No.</option>
                  <option>Patient ID</option>
                </select>
              </div>
            </div>

            <div className="col-sm-2">
              <select className="form-control input-sm ">
                <option>All Department</option>
                <option>Lab No.</option>
                <option>Barcode No.</option>
                <option>Patient ID</option>
              </select>
            </div>

            <div className="col-sm-2">
              <input
                type="text"
                className="form-control input-sm"
                placeholder="Refer Doctor"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-2">
              <DatePicker id="txtFromDate" />
            </div>

            <div className="col-sm-2">
              <DatePicker id="txtToDate" />
            </div>

            <div className="col-sm-1">
              <button
                type="button"
                className="btn btn-block btn-warning btn-sm"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="box-body divResult">
        <table
          cellPadding="{0}"
          cellSpacing="{0}"
          className="table table-bordered table-hover table-striped tbRecord"
        >
          <thead>
            <tr>
              <th>S.No</th>
              <th>Sin No</th>
              <th>Reg Date</th>
              <th>Visit No</th>
              <th>UHID</th>
              <th>Name </th>
              <th>Age</th>
              <th>SampleType</th>
              <th>Department</th>
              <th>Document</th>
              <th>See Medicial History</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="color-Status-1">
                <div>1</div>
                <i className="fa fa-search" />
              </td>
              <td />
              <td>
                <div>18/Jun/2023</div>
                <div>12:10:53 am</div>
              </td>
              <td>LAB/1/00717</td>
              <td>PAT/1/00459</td>
              <td>Mr. BRIJESH CHAUHAN</td>
              <td>
                <div>27 Y 4 M 7 D</div>
                <div>Male</div>
              </td>
              <td>Ascitic Fluid</td>
              <td>PACKEGES</td>
              <td>
                <div className="text-info" style={{ cursor: "pointer" }}>
                  Total File Count (1)
                </div>
              </td>
              <td>
                <div className="text-info" style={{ cursor: "pointer" }}>
                  See Medicial History(0)
                </div>
              </td>
            </tr>
            <tr>
              <td className="color-Status-1">
                <div>2</div>
                <i className="fa fa-search" />
              </td>
              <td />
              <td>
                <div>17/Jun/2023</div>
                <div>10:57:54 pm</div>
              </td>
              <td>LAB/1/00713</td>
              <td>PAT/1/00459</td>
              <td>Mr. BRIJESH CHAUHAN</td>
              <td>
                <div>27 Y 4 M 7 D</div>
                <div>Male</div>
              </td>
              <td>Ascitic Fluid</td>
              <td>PACKEGES</td>
              <td>
                <div className="text-info" style={{ cursor: "pointer" }}>
                  Total File Count (1)
                </div>
              </td>
              <td>
                <div className="text-info" style={{ cursor: "pointer" }}>
                  See Medicial History(0)
                </div>
              </td>
            </tr>
            <tr>
              <td className="color-Status-1">
                <div>3</div>
                <i className="fa fa-search" />
              </td>
              <td />
              <td>
                <div>17/Jun/2023</div>
                <div>10:53:52 pm</div>
              </td>
              <td>LAB/1/00712</td>
              <td>PAT/1/00459</td>
              <td>Mr. BRIJESH CHAUHAN</td>
              <td>
                <div>27 Y 4 M 7 D</div>
                <div>Male</div>
              </td>
              <td>Ascitic Fluid</td>
              <td>PACKEGES</td>
              <td>
                <div className="text-info" style={{ cursor: "pointer" }}>
                  Total File Count (1)
                </div>
              </td>
              <td>
                <div className="text-info" style={{ cursor: "pointer" }}>
                  See Medicial History(0)
                </div>
              </td>
            </tr>
            <tr>
              <td className="color-Status-1">
                <div>4</div>
                <i className="fa fa-search" />
              </td>
              <td />
              <td>
                <div>17/Jun/2023</div>
                <div>06:59:30 pm</div>
              </td>
              <td>LAB/1/00728</td>
              <td>PAT/1/0035</td>
              <td>Mr. ABHAY AWASTHI</td>
              <td>
                <div>20 Y 8 M 23 D</div>
                <div>Male</div>
              </td>
              <td>EDTA Blood</td>
              <td>HAEMATOLOGY</td>
              <td>
                <div className="text-info" style={{ cursor: "pointer" }}>
                  Total File Count (0)
                </div>
              </td>
              <td>
                <div className="text-info" style={{ cursor: "pointer" }}>
                  See Medicial History(0)
                </div>
              </td>
            </tr>
            <tr>
              <td className="color-Status-1">
                <div>5</div>
                <i className="fa fa-search" />
              </td>
              <td />
              <td>
                <div>17/Jun/2023</div>
                <div>05:42:49 pm</div>
              </td>
              <td>LAB/1/00715</td>
              <td>PAT/1/00459</td>
              <td>Mr. BRIJESH CHAUHAN</td>
              <td>
                <div>27 Y 4 M 7 D</div>
                <div>Male</div>
              </td>
              <td>Ascitic Fluid</td>
              <td>PACKEGES</td>
              <td>
                <div className="text-info" style={{ cursor: "pointer" }}>
                  Total File Count (1)
                </div>
              </td>
              <td>
                <div className="text-info" style={{ cursor: "pointer" }}>
                  See Medicial History(0)
                </div>
              </td>
            </tr>
            <tr>
              <td className="color-Status-1">
                <div>6</div>
                <i className="fa fa-search" />
              </td>
              <td />
              <td>
                <div>17/Jun/2023</div>
                <div>05:35:15 pm</div>
              </td>
              <td>LAB/1/00714</td>
              <td>PAT/1/00499</td>
              <td>Mr. TESTING NEW</td>
              <td>
                <div>0 Y 0 M 20 D</div>
                <div>Male</div>
              </td>
              <td>Ascitic Fluid</td>
              <td>PACKEGES</td>
              <td>
                <div className="text-info" style={{ cursor: "pointer" }}>
                  Total File Count (1)
                </div>
              </td>
              <td>
                <div className="text-info" style={{ cursor: "pointer" }}>
                  See Medicial History(0)
                </div>
              </td>
            </tr>
            <tr>
              <td className="color-Status-1">
                <div>7</div>
                <i className="fa fa-search" />
              </td>
              <td />
              <td>
                <div>17/Jun/2023</div>
                <div>05:16:44 pm</div>
              </td>
              <td>LAB/1/00711</td>
              <td>PAT/1/00459</td>
              <td>Mr. BRIJESH CHAUHAN</td>
              <td>
                <div>27 Y 4 M 7 D</div>
                <div>Male</div>
              </td>
              <td>Ascitic Fluid</td>
              <td>PACKEGES</td>
              <td>
                <div className="text-info" style={{ cursor: "pointer" }}>
                  Total File Count (1)
                </div>
              </td>
              <td>
                <div className="text-info" style={{ cursor: "pointer" }}>
                  See Medicial History(0)
                </div>
              </td>
            </tr>
            <tr>
              <td className="color-Status-1">
                <div>8</div>
                <i className="fa fa-search" />
              </td>
              <td>Nazir123</td>
              <td>
                <div>17/Jun/2023</div>
                <div>04:59:54 pm</div>
              </td>
              <td>LAB/1/00709</td>
              <td>PAT/1/00497</td>
              <td>Mr. ANSH</td>
              <td>
                <div>0 Y 0 M 19 D</div>
                <div>Male</div>
              </td>
              <td>EDTA Blood</td>
              <td>HAEMATOLOGY</td>
              <td>
                <div className="text-info" style={{ cursor: "pointer" }}>
                  Total File Count (1)
                </div>
              </td>
              <td>
                <div className="text-info" style={{ cursor: "pointer" }}>
                  See Medicial History(0)
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default SampleCollection1;
