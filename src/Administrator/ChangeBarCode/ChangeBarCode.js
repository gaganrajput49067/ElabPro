import React, { useState } from "react";
import axios from "axios";
import Input from "../../ChildComponents/Input";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import Loading from "../../Frontend/util/Loading";
import CustomModal from "../../Frontend/util/CustomModal";
import {
  checkDuplicateBarcode,
  isChecked,
} from "../../Frontend/util/Commonservices";

const ChangeBarCode = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const [LabNo, setLabNo] = useState("");
  // const [input, setInput] = useState({
  //   labNo: "",
  // });

  const [modal, setModal] = useState(false);
  const [visitID, setVisitID] = useState();

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setInput({ ...input, [name]: value });
  // };

  const fetch = () => {
    setLoading(true);
    axios
      .post("/api/v1/ChangeBarcode/GetData", {
        labNo: LabNo,
      })
      .then((res) => {
        const data = res?.data?.message;
        if (data.length > 0) {
          const val = data.map((ele) => {
            return {
              ...ele,
              labNo: ele?.LedgerTransactionNo,
              isSelect: false,
              oldBarcodeNo: ele?.BarcodeNo,
            };
          });
          setLoading(false);
          setData(val);
        } else {
          toast.error("No Data Found");
          setData([]);
          setLoading(false);
        }
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
        setLoading(false);
      });
  };

  const Submit = () => {
    const val = data.filter((ele) => ele?.isSelect === true);
    if (val.length > 0) {
      setLoading(true);
      axios
        .post("/api/v1/ChangeBarcode/UpdateBarcode", {
          savedata: val,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setLoading(false);
          fetch();
          // setLabNo("");
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : err?.data?.message
          );
          setLoading(false);
          // setLabNo("");
        });
    } else {
      toast.error("Please Choose One Test");
    }
  };

  // const handleChangeNew = (e, index) => {
  //   const { name, checked } = e.target;
  //   const val = [...data];
  //   val[index][name] = checked;
  //   setData(val);
  // };

  //system barcode Logic

  // const handleChangeNew = (e, index) => {
  //   const { name, checked } = e.target;
  //   if (index >= 0) {
  //     const updateData = [...data];
  //     updateData[index][name] = checked;
  //     setData(updateData);
  //   } else {
  //     const updateData = data.map((item) => {
  //       return {
  //         ...item,
  //         isSelect: checked,
  //       };
  //     });
  //     setData(updateData);
  //   }
  // };

  const handleChangeNew = (e, index, sampletypeId) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const updateData = data.map((ele) => {
        if (ele?.SampleTypeID === sampletypeId) {
          return {
            ...ele,
            isSelect: checked,
          };
        } else {
          return ele;
        }
      });

      setData(updateData);
    } else {
      const updateData = data.map((ele) => {
        return {
          ...ele,
          isSelect: checked,
        };
      });
      setData(updateData);
    }
  };

  const handleBarcode = (e, i, barcodeLogic, sampletypeId) => {
    const { value } = e.target;
    if (barcodeLogic === 1 || barcodeLogic === 2) {
      const updateData = data.map((ele, index) => {
        if (index === i) {
          return {
            ...ele,
            isSelect: false,
            BarcodeNo: value,
          };
        } else {
          return ele;
        }
      });
      setData(updateData);
    } else if (barcodeLogic === 3) {
      const updateData = data.map((ele) => {
        return {
          ...ele,
          BarcodeNo: value,
        };
      });
      setData(updateData);
    }

    if (barcodeLogic === 4) {
      let flag = true;
      for (let i = 0; i < data.length; i++) {
        if (
          data[i]?.SampleTypeID !== sampletypeId &&
          value !== "" &&
          value === data[i]?.BarcodeNo
        ) {
          flag = false;
          break;
        }
      }
      if (flag) {
        const updateData = data.map((ele) => {
          if (ele?.SampleTypeID === sampletypeId) {
            return {
              ...ele,
              BarcodeNo: value,
            };
          } else {
            return ele;
          }
        });
        setData(updateData);
      } else {
        toast.error("This BarCode is Already Given");
      }
    }
  };

  // validation
  const handleCloseBarcodeModal = (
    value,
    LedgerTransactionID,
    barcodeLogic,
    sampletypeId
  ) => {
    if (value !== "") {
      checkDuplicateBarcode(value, LedgerTransactionID).then((res) => {
        if (res === " " || res === "") {
        } else {
          if (barcodeLogic === 3) {
            const updatedData = data.map((ele) => {
              return {
                ...ele,
                BarcodeNo: value,
                LedgerTransactionID: LedgerTransactionID,
              };
            });
            setData(updatedData);
            toast.error(res);
          }

          if (barcodeLogic === 4) {
            const updatedData = data.map((ele) => {
              if (ele?.SampleTypeID === sampletypeId) {
                return {
                  ...ele,
                  BarcodeNo: "",
                  isChecked: "true",
                };
              } else {
                return ele;
              }
            });
            setData(updatedData);
            toast.error(res);
          }
        }
      });
    }
  };

  // end

  const handleCancle = () => {
    setData("");
    setLabNo("");
  };

  const hiddenButtons = () => {
    const val = data?.filter((item) => item?.isSelect === true);
    return val.length > 0 ? true : false;
  };

  return (
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
                Change BarCode
              </h6>
            </div>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-sm-2 col-md-2 form-group mt-4">
                <label className="control-label">Lab No.</label>
                <Input
                  className="form-control pull-right reprint-date required"
                  type="text"
                  value={LabNo}
                  onChange={(e) => setLabNo(e.target.value)}
                  required
                />
              </div>
              <div
                className="col-sm-2 col-md-2 form-group mt-4"
                style={{ alignSelf: "flex-end" }}
              >
                <button
                  className="btn btn-success"
                  onClick={fetch}
                  disabled={LabNo.length > 3 ? false : true}
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <Loading />
        ) : (
          <>
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
                  {/* <BootTable
                  drdata={drdata}
                  setSaveTestId={setSaveTestId}
                  saveTestId={saveTestId}
                  show={setShow}
                  TableData={TableData}
                /> */}
                  <div className="mx-2">
                    <Table bordered responsive hover striped>
                      <thead>
                        <tr>
                          <th>S.No</th>
                          <th>View</th>
                          <th>Lab No.</th>
                          <th>PName</th>
                          <th>Age/Sex</th>
                          <th>Investigation</th>
                          <th>BarCode</th>
                          <th>
                            <div>Test</div>
                            <div>
                              <Input
                                type="checkbox"
                                name="isSelect"
                                checked={
                                  data.length > 0
                                    ? isChecked(
                                        "isSelect",
                                        data,
                                        true
                                      ).includes(false)
                                      ? false
                                      : true
                                    : false
                                }
                                onChange={(e) => {
                                  handleChangeNew(e);
                                }}
                                disabled={
                                  // data[0]?.BarcodeLogic === 1 ||
                                  // data[0]?.BarcodeLogic === 2 ||
                                  data[0]?.BarcodeLogic === 4 ||
                                  data[0]?.BarcodeLogic === 2
                                    ? true
                                    : false
                                }
                              />
                            </div>
                          </th>
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
                                  setVisitID(item?.LedgerTransactionNo);
                                }}
                              >
                                <i className="fa fa-search" />
                              </td>
                              <td>{item.LedgerTransactionNo}</td>
                              <td>{item.PName}</td>
                              <td>{item.AgeGender}</td>
                              <td>{item.Investigation}</td>
                              <td>
                                {item.BarcodeLogic === 3 ||
                                item.BarcodeLogic === 4 ? (
                                  <Input
                                    type="text"
                                    value={item.BarcodeNo}
                                    name="BarcodeNo"
                                    onChange={(e) => {
                                      handleBarcode(
                                        e,
                                        index,
                                        item?.BarcodeLogic,
                                        item?.SampleTypeID
                                      );
                                    }}
                                    onBlur={(e) => {
                                      handleCloseBarcodeModal(
                                        e.target.value,
                                        item?.LedgerTransactionID,
                                        item?.BarcodeLogic,
                                        item?.SampleTypeID
                                      );
                                    }}
                                  />
                                ) : (
                                  item.BarcodeNo
                                )}
                              </td>
                              <td>
                                <Input
                                  type="checkbox"
                                  name="isSelect"
                                  onChange={(e) =>
                                    handleChangeNew(
                                      e,
                                      index,
                                      item?.SampleTypeID
                                    )
                                  }
                                  checked={item?.isSelect}
                                  disabled={
                                    item?.BarcodeLogic === 1 ||
                                    item?.BarcodeLogic === 3
                                      ? true
                                      : item?.BarcodeNo
                                      ? false
                                      : true
                                  }
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
                    <>
                      {hiddenButtons() && (
                        <div className="col-sm-2 col-md-2 form-group mt-4">
                          <button className="btn btn-primary" onClick={Submit}>
                            Update
                          </button>
                          <button
                            className="btn btn-primary mx-3"
                            onClick={handleCancle}
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ChangeBarCode;
