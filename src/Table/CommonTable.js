import React from "react";
import { Table } from "react-bootstrap";

function CommonTable({ TableHeads, DummbyTableBody, className, symbol }) {
  return (
    <div className={className}>
      <Table responsive hover bordered striped>
        <thead>
          <tr>
            {TableHeads.map((data, index) => (
              <th key={index}>{data}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DummbyTableBody.map((data, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{data?.Department}</td>
              <td>
                {data?.percentage} {symbol && symbol}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default CommonTable;
