import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { dateConfig } from "../util/DateConfig";
import Loading from "../util/Loading";

const Departments = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getTableData = () => {
    axios
      .get("/api/v1/Department/getDepartmentData")
      .then((res) => {
        if (res.status === 200) {
          setTableData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    getTableData();
  }, []);
  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h1 className="box-title">Department</h1>
          <Link style={{ float: "right" }} to="/Create">
            Create New
          </Link>
        </div>
     
      {loading ? (
        <Loading />
      ) : (
          <div className="box-body  divResult  table-responsive  boottable" id="no-more-tables">
            <table
              className="table table-bordered table-hover table-striped tbRecord"
              cellPadding="{0}"
              cellSpacing="{0}"
            >
              <thead className="cf">
                <tr>
                  <th>S.No</th>
                  <th>Code</th>
                  <th>Department</th>
                  <th>Active</th>
                  <th>Entry Date</th>
                  <th>Update Date </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((data, index) => (
                  <tr key={index}>
                    <td data-title={"S.No"}>{index + 1}&nbsp;</td>
                    <td data-title={"Code"}>{data?.DepartmentCode}&nbsp;</td>
                    <td data-title={"Department"}>{data?.Department}&nbsp;</td>

                    <td data-title={"Active"}>{data?.Status}&nbsp;</td>
                    <td data-title={"Entry Date"}>
                      {dateConfig(data?.dtEntry)}
                    </td>
                    <td data-title={"Update Date"}>
                      {data?.dtUpdate !== "0000-00-00 00:00:00"
                        ? dateConfig(data?.dtUpdate)
                        : "-"}
                      &nbsp;
                    </td>
                    {/* <td>{data?.PrintOrder}</td> */}

                    <td data-title={"Action"}>
                      {data.companyId === 0 ? (
                        <p style={{color:"red"}} Tooltip="System Generated it can't be changed">
                         System Generated it can't be changed
                        </p>
                      ) : (
                        <Link to="/EditPage" state={{ data: data }}>
                          Edit &nbsp;
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Departments;
