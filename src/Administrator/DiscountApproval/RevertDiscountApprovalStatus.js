import React from "react";
import Input from "../../ChildComponents/Input";
import { useState } from "react";
import Loading from "../../Frontend/util/Loading";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";

const RevertDiscountApprovalStatus = () => {
  const [input, setInput] = useState({
    labNo: "",
  });
  const [data, setData] = useState([]);
  //   const [chkBtnShow, setChkBtnShow] = useState(false);

  const [searchLoading, setSearchLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const fetch = () => {
    setSearchLoading(true);
    axios
      .post("/api/v1/RevertDiscountApprovalStatus/SearchRevertData", {
        labNo: input?.labNo,
      })
      .then((res) => {
        const data = res?.data?.message;
        if (data.length > 0) {
          setData(data);
        } else {
          toast.error("No Data Found");
        }
        setSearchLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
        setSearchLoading(false);
      });
  };

  const handleReset = (id) => {
    axios
      .post("/api/v1/RevertDiscountApprovalStatus/UpdateRevertStatus", {
        labId: id,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        setData([]);
        setInput({ labNo: "" });
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
      });
  };

  //   const handleCheckbox = (e, index) => {
  //     const { name, checked } = e.target;
  //     const val = [...data];
  //     val[index][name] = checked ? "1" : "0";
  //     setData(val);
  //     setChkBtnShow(checked);
  //     checked = { chkBtnShow };
  //   };
  return (
    <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
      <div className="container-fluid pt-3">
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <div className="clearfix">
              <h6 className="m-0 font-weight-bold text-primary float-left">
                Revert Discount Approval Status
              </h6>
            </div>
          </div>
          <div className="card-copy px-3">
            <div className="row">
              <div className="col-sm-2 col-md-2 form-group mt-4">
                <label className="control-label">Lab No.</label>
                <Input
                  className="form-control pull-right reprint-date required"
                  type="text"
                  name="labNo"
                  value={input.labNo}
                  onChange={handleChange}
                />
              </div>

              <div
                className="col-sm-2 col-md-2 form-group mt-4"
                style={{ alignSelf: "flex-end" }}
              >
                <button
                  className="btn btn-success"
                  onClick={fetch}
                  disabled={input?.labNo.length > 3 ? false : true}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
        {searchLoading ? (
          <Loading />
        ) : (
          data.length > 0 && (
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <div className="clearfix">
                  <h6 className="m-0 font-weight-bold text-primary float-left">
                    Search Result
                  </h6>
                </div>
                <div className="card-body bootable">
                  <div className="mx-2">
                    <Table bordered responsive hover>
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>Lab No.</th>
                          {/* <th>Lab ID.</th> */}
                          <th>PName</th>
                          <th>Date</th>
                          <th>DiscountApprovedByName</th>
                          <th>NetAmount</th>
                          <th>DiscountOnTotal</th>
                          <th>STATUS</th>
                          <th>IsDiscountApproved</th>
                          <th>DiscountStatus</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.LedgertransactionNo}</td>
                              {/* <td>{item.LedgertransactionId}</td> */}
                              <td>{item.PName}</td>
                              <td>{item.DATE}</td>
                              <td>{item.DiscountApprovedByName}</td>
                              <td>{item.NetAmount}</td>
                              <td>{item.DiscountOnTotal}</td>
                              <td>{item.STATUS}</td>
                              <td>{item.IsDiscountApproved}</td>
                              <td>{item.DiscountStatus}</td>
                              <td>
                                <button
                                  className="btn btn-danger"
                                  onClick={() =>
                                    handleReset(item.LedgertransactionId)
                                  }
                                >
                                  Reset Status
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default RevertDiscountApprovalStatus;
