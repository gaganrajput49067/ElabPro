import React, { useState } from "react";
import { Table } from "react-bootstrap";

function SuggestionBox() {
  const [show, setShow] = useState(false);
  return (
    <div className="suggestion-Fixed-Box">
      {show && (
        <div className="inner-Box">
          <Table>
            <thead style={{ backgroundColor: "#7eb6ee", color: "white" }}>
              <tr>
                <th>Sr.no</th>
                <th>Date</th>
                <th>Test Name</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody style={{ backgroundColor: "rgb(255 192 203)" }}>
              <tr>
                <td>1</td>
                <td>10/12/2020</td>
                <td>CbC Test</td>
                <td>High</td>
              </tr>
              <tr>
                <td>1</td>
                <td>10/12/2020</td>
                <td>CbC Test</td>
                <td>High</td>
              </tr>
              <tr>
                <td>1</td>
                <td>10/12/2020</td>
                <td>CbC Test</td>
                <td>High</td>
              </tr>
              <tr>
                <td>1</td>
                <td>10/12/2020</td>
                <td>CbC Test</td>
                <td>High</td>
              </tr>
              <tr>
                <td>1</td>
                <td>10/12/2020</td>
                <td>CbC Test</td>
                <td>High</td>
              </tr>
              <tr>
                <td>1</td>
                <td>10/12/2020</td>
                <td>CbC Test</td>
                <td>High</td>
              </tr>
              <tr>
                <td>1</td>
                <td>10/12/2020</td>
                <td>CbC Test</td>
                <td>High</td>
              </tr>
              <tr>
                <td>1</td>
                <td>10/12/2020</td>
                <td>CbC Test</td>
                <td>High</td>
              </tr>
              <tr>
                <td>1</td>
                <td>10/12/2020</td>
                <td>CbC Test</td>
                <td>High</td>
              </tr>
            </tbody>
          </Table>
        </div>
      )}
      <div className="box" onClick={() => setShow(!show)}>
        SuggestionBox
      </div>
    </div>
  );
}

export default SuggestionBox;
