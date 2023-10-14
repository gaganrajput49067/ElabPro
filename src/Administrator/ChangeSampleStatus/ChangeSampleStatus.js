import React, { useState } from "react";
import Input from "../../ChildComponents/Input";
import { Modal, Table } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../Frontend/util/Loading";
import CustomModal from "../../Frontend/util/CustomModal";

const ChangeSampleStatus = () => {
  const [modal, setModal] = useState(false);
  const [visitID, setVisitID] = useState();
  const [show, setShow] = useState({
    modal: false,
    data: "",
  });
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    LabNo: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput({ ...input, [name]: value });
  };

  const fetch = () => {
    axios
      .post("/api/v1/ChangeSampleStatusData/GetChangeSampleStatusData", {
        LabNo: input?.LabNo,
      })
      .then((res) => {
        const data = res?.data?.message;
        if (data.length > 0) {
          const val = data.map((ele) => {
            return {
              ...ele,
              ResultRemove: "0",
              SampleRemove: "0",
            };
          });
          setData(val);
        } else {
          toast.error("No Data Found");
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
      });
  };

  const validate = () => {
    let match = false;
    for (let i = 0; i < data.length; i++) {
      if (data[i]["ResultRemove"] === "1" || data[i]["SampleRemove"] === "1") {
        match = true;
        break;
      }
    }
    return match;
  };

  const Submit = () => {
    setLoading(true);
    const match = validate();
    if (match) {
      const val = data.filter(
        (ele) => ele?.ResultRemove === "1" || ele?.SampleRemove === "1"
      );
      const playdata = val.map((ele) => {
        return {
          LabNo: ele?.LedgerTransactionNo,
          ResultRemove: ele?.ResultRemove,
          TestId: ele?.TestID,
          SampleRemove: ele?.SampleRemove,
        };
      });
      axios
        .post(
          "/api/v1/ChangeSampleStatusData/UpdateChangeSampleStatusData",
          playdata
        )
        .then((res) => {
          toast.success(res?.data?.message);
          setLoading(false);
          fetch();
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : err?.data?.message
          );
          setLoading(false);
        });
    } else {
      toast.error("Please Choose AtLeast One Test");
      setLoading(false);
    }
  };

  const ShowBtn = () => {
    const val = data.filter(
      (ele) => ele?.ResultRemove === "1" || ele?.SampleRemove === "1"
    );
    return val.length > 0 ? true : false;
  };

  const handleCheckbox = (e, index) => {
    const { name, checked } = e.target;
    const val = [...data];
    val[index][name] = checked ? "1" : "0";
    setData(val);
  };

  const handleCancel = () => {
    setData([]);
    setInput({ LabNo: "" });
  };

  return (
    <>
      <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
        {modal && (
          <CustomModal
            show={modal}
            visitID={visitID}
            onHide={() => setModal(false)}
          />
        )}
        <div className="container-fluid pt-3">
          <div className="card shadow mb-4">
            <div className="card-header py-3">
              <div className="clearfix">
                <h6 className="m-0 font-weight-bold text-primary float-left">
                  Change Sample Status
                </h6>
              </div>
              <div className="card-copy">
                <div className="row">
                  <div className="col-sm-2 col-md-2 form-group mt-4">
                    <label className="control-label">Lab No.</label>
                    <Input
                      className="form-control pull-right reprint-date required"
                      type="text"
                      name="LabNo"
                      value={input.LabNo}
                      onChange={handleChange}
                    />
                  </div>
                  <div
                    className="col-sm-2 col-md-2 form-group mt-4"
                    style={{ alignSelf: "flex-end" }}
                  >
                    <button
                      className="btn btn-info"
                      onClick={fetch}
                      disabled={input?.LabNo.length > 3 ? false : true}
                    >
                      Search
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {data.length > 0 && (
            <div className="card shadow mb-4">
              <div className="card-header py-3">
                <div className="clearfix">
                  <h6 className="m-0 font-weight-bold text-primary float-left">
                    Search Result
                  </h6>
                </div>
              </div>
              <div className="card-body bootable">
                <div className="px-2">
                  <Table bordered responsive hover>
                    <thead>
                      <tr>
                        <th>S.No</th>
                          <th>View</th>
                        <th>Lab No.</th>
                        <th>PName</th>
                        <th>Age/Sex</th>
                        <th>Investigation</th>
                        <th>BarCode</th>
                        <th>Result Remove</th>
                        <th>Sample Status Remove</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td>{index + 1}</td>
                              <td
                                onClick={() => {
                                  setModal(true);
                                  setVisitID(item.LedgerTransactionNo);
                                }}
                              >
                                <i className="fa fa-search" />
                              </td>
                            <td>{item.LedgerTransactionNo}</td>
                            <td>{item.PName}</td>
                            <td>{item.AgeGender}</td>
                            <td>{item.Investigation}</td>
                            <td>{item.BarcodeNo}</td>

                              <td>
                                <Input
                                  type="checkbox"
                                  name="ResultRemove"
                                  checked={
                                    item?.ResultRemove === "1" ? true : false
                                  }
                                  disabled={item?.status !== 10 && true}
                                  onChange={(e) => {
                                    handleCheckbox(e, index);
                                  }}
                                />
                              </td>
                              <td>
                                <Input
                                  type="checkbox"
                                  name="SampleRemove"
                                  checked={
                                    item?.SampleRemove === "1" ? true : false
                                  }
                                  disabled={item?.status === 1 && true}
                                  onChange={(e) => {
                                    handleCheckbox(e, index);
                                  }}
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                    {loading ? (
                      <Loading />
                    ) : (
                      ShowBtn() && (
                        <div
                      className="col-sm-2 col-md-2 form-group mt-3 d-flex"
                      style={{
                        alignSelf: "flex-end",
                        justifyContent: "space-around",
                      }}
                    >
                      <button className="btn btn-success mx-3" onClick={Submit}>
                        Update
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ChangeSampleStatus;
