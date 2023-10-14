import React, { useState } from "react";
import Input from "../../ChildComponents/Input";
import { checkDuplicateBarcode, isChecked } from "../util/Commonservices";
import Loading from "../util/Loading";
import { toast } from "react-toastify";
import axios from "axios";
import CustomModal from "../util/CustomModal";
import { useTranslation } from "react-i18next";

const ChangeBarCode = () => {
  const { t } = useTranslation();
  const [LabNo, setLabNo] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [visitID, setVisitID] = useState();

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

  const fetch = (e) => {
    e.preventDefault();
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
        }
        setLoading(false);
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
    <>
     {modal && (
        <CustomModal
          show={modal}
          visitID={visitID}
          onHide={() => setModal(false)}
        />
      )}
      <div className="box box-success">
        <div className="box-header with-border">
          <h1 className="box-title">{t("Change BarCode")}</h1>
        </div>
        <form action="" onSubmit={fetch}>
          <div className="box-body">
            <div className="row">
              <div className="col-sm-2">
                <div className="ApproveBarcodeChild">
                  <Input
                    className="form-control ui-autocomplete-input input-sm"
                    placeholder={t("Lab No.")}
                    type="text"
                    value={LabNo}
                    onChange={(e) => setLabNo(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="col-sm-1">
                {loading ? (
                  <Loading />
                ) : (
                  <div className="ApproveBarcodeChild">
                    <button
                      type="button"
                      className="btn btn-block btn-info btn-sm"
                      id="btnSave"
                      onClick={fetch}
                      disabled={LabNo.length > 3 ? false : true}
                    >
                     {t("Search")} 
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <>
          {data.length > 0 && (
            <div className="box">
              <div className="box-header with-border">
                <h1 className="box-title">{t("Search Result")} </h1>
              </div>
              <div
                className="box-body divResult table-responsive mt-4"
                id="no-more-tables"
              >
                <div className="row">
                  <div className="col-12">
                    <table
                      className="table table-bordered table-hover table-striped tbRecord"
                      cellPadding="{0}"
                      cellSpacing="{0}"
                    >
                      <thead className="cf">
                        <tr>
                          <th>{t("S.No")}</th>
                          <th>{t("View")}</th>
                          <th>{t("Lab No.")}</th>
                          <th>{t("PName")}</th>
                          <th>{t("Age/Sex")}</th>
                          <th>{t("Investigation")}</th>
                          <th>{t("BarCode")}</th>
                          <th>
                            <div>{t("Test")}</div>
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
                        {data?.map((item, index) => (
                          <tr key={index}>
                            <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                            <td
                              data-title={t("View")}
                              onClick={() => {
                                setModal(true);
                                setVisitID(item?.LedgerTransactionNo);
                              }}
                            >
                              <i className="fa fa-search" />
                            </td>
                            <td data-title={t("Lab No.")}>
                              {item.LedgerTransactionNo}&nbsp;
                            </td>
                            <td data-title={t("PName")}>{item.PName}&nbsp;</td>
                            <td data-title={t("Age/Sex")}>{item.AgeGender}&nbsp;</td>
                            <td data-title={t("Investigation")}>
                              {item.Investigation}&nbsp;
                            </td>
                            <td data-title={t("BarCode")}>
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
                              )}&nbsp;
                            </td>
                            <td data-title={t("Test")}>
                              <Input
                                type="checkbox"
                                name="isSelect"
                                onChange={(e) =>
                                  handleChangeNew(e, index, item?.SampleTypeID)
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
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {loading ? (
                  <Loading />
                ) : (
                  <>
                    {hiddenButtons() && (
                      <div className="row">
                        <div className="col-sm-1">
                          <button
                            type="button"
                            className="btn btn-block btn-success btn-sm"
                            id="btnUpdate"
                            onClick={Submit}
                          >
                         {t("Update")}   
                          </button>
                        </div>
                        <div className="col-sm-1">
                          <button
                            type="button"
                            className="btn btn-block btn-danger btn-sm"
                            id="btnCancle"
                            onClick={handleCancle}
                          >
                           {t("Cancel")} 
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ChangeBarCode;
