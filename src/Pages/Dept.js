import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
import Loading from "../Frontend/util/Loading";
import axios from "axios";
import { dateConfig } from "../Frontend/util/DateConfig";

const Dept = () => {
  const [loading, setLoading] = useState(true);
  const [tabledata, setTableData] = useState([]);

  const getDeptData = () => {
    axios
      .get("/api/v1/Department/getDepartmentData")
      .then((res) => {
        if (res.status == "200") {
          setTableData(res?.data?.message);
          setLoading(false);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(()=>{
    getDeptData();
  },[]);

  return (
    <>
      <div className="box box-success">
        <div className="box-border with-border">
          <h1 className="box-title">Dept</h1>
          <Link style={{ float: "right" }} to="/CreateDept">
            Create New
          </Link>

          {loading ? (
            <Loading />
          ) : (
            <div
              className="box-body divResult table-responsive boottable"
              id="no-more-table"
            >
              <table
                className="table table-bordered table-hover table-stripped"
                cellPadding={"0"}
                cellSpacing={"0"}
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
                  <th></th>
                </thead>
                <tbody>
                  {tabledata.map((data,index)=>(
                  <tr key={index}>
                    <td data-title={"S.No"}>{index + 1}&nbsp;</td>
                    <td data-title={"Code"}>{data?.DepartmentCode}&nbsp;</td>
                    <td data-title={"Department"}>{data?.Department}&nbsp;</td>

                    <td data-title={"Active"}>{data?.Status}&nbsp;</td>
                    <td data-title={"Entry Date"}>
                      {dateConfig(data?.dtEntry)}
                    </td>
                    <td data-title="Update Date">
{data?.dtUpdate!="0000:00:00 00:00:00"?dateConfig(data?.dtUpdate):"-"}&nbsp;

                    </td>
<td data-title="Action">
    <Link to="/EditDeptPage" state={{data:data}} >
        Edit
    </Link>

</td>
                  </tr>
                  ))}

                    </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Dept;
