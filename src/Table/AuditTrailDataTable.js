import moment from "moment";
import React from "react";
import { Table } from "react-bootstrap";
import { dateConfig } from "../Frontend/util/DateConfig";
import Loading from "../Frontend/util/Loading";

function AuditTrailDataTable({ tableData }) {
  return (
    <>
      {tableData.length > 0 ? (
        <div style={{ marginTop: "23px" }} className="boottable">
          <Table responsive bordered hover>
            <thead>
              <tr>
                <th>S.no</th>
                <th>Date</th>
                <th>Entry By</th>
                <th>Status</th>
                <th>Center</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((data, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{dateConfig(data.dtEntry)}</td>
                  <td>{data?.CreatedByName}</td>
                  <td
                    className={`${
                      data?.ColorStatus === 1
                        ? "color-Status-1"
                        : data?.ColorStatus === 2
                        ? "color-Status-2"
                        : data?.ColorStatus === 3
                        ? "color-Status-3"
                        : data?.ColorStatus === 4
                        ? "color-Status-4"
                        : data?.ColorStatus === 5
                        ? "color-Status-5"
                        : data?.ColorStatus === 10
                        ? "color-Status-10"
                        : ""
                        
                    }`}
                  >
                    {data?.ItemName}
                  </td>
                  <td>{data?.Centre}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
}

export default AuditTrailDataTable;
