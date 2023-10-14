import React, { useEffect, useState } from "react";
import Input from "../../ChildComponents/Input";
import { toast } from "react-toastify";
import axios from "axios";
import Loading from "../util/Loading";
import moment from "moment";
import DatePicker from "../Components/DatePicker";

import { useTranslation } from "react-i18next";

const ChangeDeliveryStatus = () => {
  const [LabNo, setLabNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [formTable, setFormTable] = useState([]);

  const handleChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    const data = [...formTable];
    data[index][name] = type === "checkbox" ? checked : value;
    setFormTable(data);
  };

 
  const { t, i18n } = useTranslation();


  const dateSelect = (date, name, index) => {
    const data = [...formTable];
    data[index][name] = date;
    setFormTable(data);
  };

  const handleTime = (time, secondName, index) => {
    const updatedData = [...formTable];
    const timeStamp = `${time?.Hour}:${time?.Minute}:${time?.second}`;
    updatedData[index][secondName] = timeStamp;
    setFormTable(updatedData);
  };

  const SearchApi = (event) => {
    console.log(event, "callint the e in search api");
    event.preventDefault();
    setLoading(true);
    axios
      .post("api/v1/changeDeliveryStatus/GetChangeDeliveryStatusData", {
        LabNo: LabNo,
      })
      .then((res) => {
        const data = res?.data?.message;
        const val = data?.map((ele) => {
          return {
            ...ele,
            isChecked: false,
            SampleDate:
              ele?.SampleDate.trim() === "0000-00-00"
                ? ""
                : new Date(ele?.SampleDate),
            ApprovedDate:
              ele?.ApprovedDate.trim() === "0000-00-00"
                ? ""
                : new Date(ele?.ApprovedDate),
          };
        });
        setFormTable(val);
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

  // update Api
  const handleSubmit = () => {
    const data = formTable?.filter((ele) => ele?.isChecked === true);
    if (data.length > 0) {
      const val = data?.map((ele) => {
        return {
          SampleDate:
            ele?.SampleDate === ""
              ? ele?.SampleDate
              : moment(ele?.SampleDate).format("DD-MMM-YYYY"),
          ApprovedDate:
            ele?.ApprovedDate === ""
              ? ""
              : moment(ele?.ApprovedDate).format("DD-MMM-YYYY"),
          LabNo: ele?.LedgerTransactionNo,
          TestId: ele?.TestID,
          SampleTime: ele?.SampleTime,
          ApproveTime: ele?.ApprovedDate === "" ? "" : ele?.ApprovedTime,
        };
      });
      setLoading(true);
      axios
        .post("api/v1/changeDeliveryStatus/UpdateDeliveryStatusData", val)
        .then((res) => {
          toast.success(res?.data?.message);
          SearchApi();
          setLoading(false);
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
      toast.error("please choose one test");
    }
    setLoading(false);
  };

  const hideButton = () => {
    const val = formTable?.filter((ele) => ele?.isChecked === true);
    return val.length > 0 ? true : false;
  };

 
  // end

  const handleClose = () => {
    setFormTable("");
    setLabNo("");
  };
  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h1 className="box-title">{t("Change Delivery Status")}</h1>
        </div>
        <form action="" onSubmit={SearchApi}>
          <div className="box-body">
            <div className="row">
              <div className="col-sm-2">
                <Input
                  className="form-control ui-autocomplete-input input-sm"
                  placeholder={t("Lab No.")}
                  type="text"
                  value={LabNo}
                  onChange={(e) => setLabNo(e.target.value)}
                  required
                />
              </div>
              <div className="col-sm-1">
                <button
                  type="button"
                  className="btn btn-block btn-info btn-sm"
                  id="btnSave"
                  disabled={LabNo.length > 3 ? false : true}
                  onClick={SearchApi}
                >
                  {t("Search")}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <>
          {formTable.length > 0 && (
            <div className="box box-success">
              <div className="box-header with-border">
                <h1 className="box-title">{t("Change Delivery Status")}</h1>
              </div>
              <div
                className={`box-body divResult table-responsive ${
                  formTable.length > 8 && "boottable"
                }`}
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
                          <th>{t("Lab No")}</th>
                          <th>{t("Patient")}</th>
                          <th>{t("Investigation")}</th>
                          <th>{t("Sample Collection Date")}</th>
                          {/* <th>Time</th> */}
                          <th>{t("Approved Date")}</th>
                          {/* <th>Time</th> */}
                          <th>{t("#")}</th>
                        </tr>
                      </thead>
                      {formTable.map((ele, index) => (
                        <tbody>
                          <tr key={index}>
                            <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                            <td data-title={t("Lab No")}>
                              {ele?.LedgerTransactionNo}&nbsp;
                            </td>
                            <td data-title={t("Patient")}>{ele?.PName}&nbsp;</td>
                            <td data-title={t("Investigation")}>
                              {ele?.Investigation}&nbsp;
                            </td>
                            <td data-title={t("Sample Collection Date")}>
                              <DatePicker
                                name="SampleDate"
                                date={ele?.SampleDate}
                                onChange={(date) =>
                                  dateSelect(date, "SampleDate", index)
                                }
                                onChangeTime={(time) =>
                                  handleTime(time, "SampleTime", index)
                                }
                                secondName="SampleTime"
                                maxDate={new Date()}
                                disabled={ele?.isChecked ? false : true}
                              />
                            </td>
                            <td data-title={t("Approved Date")}>
                               <DatePicker
                                name="ApprovedDate"
                                date={ele?.ApprovedDate}
                                onChange={(date) =>
                                  dateSelect(date, "ApprovedDate", index)
                                }
                                onChangeTime={(time) =>
                                  handleTime(time, "ApprovedTime", index)
                                }
                                secondName="ApprovedTime"
                                maxDate={new Date()}
                                minDate={new Date(ele?.SampleDate)}
                                disabled={ele?.isChecked ? false : true}
                              />
                            </td>
                            <td data-title={t("#")}>
                              <Input
                                type="checkbox"
                                checked={ele?.isChecked}
                                name="isChecked"
                                onChange={(e) => handleChange(e, index)}
                              />
                            </td>
                          </tr>
                        </tbody>
                      ))}
                    </table>
                  </div>
                </div>
                {loading ? (
                  <Loading />
                ) : (
                  <>
                    {hideButton() && (
                      <div className="row">
                        <div className="col-sm-1">
                          <button
                            type="button"
                            className="btn btn-block btn-success btn-sm"
                            id="btnUpdate"
                            onClick={handleSubmit}
                          >
                            {t("Update")}
                          </button>
                        </div>
                        <div className="col-sm-1">
                          <button
                            type="button"
                            className="btn btn-block btn-danger btn-sm"
                            id="btnCancle"
                            onClick={handleClose}
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

export default ChangeDeliveryStatus;
