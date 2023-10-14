import React, { useEffect, useState } from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";

import CustomDate from "../../ChildComponents/CustomDate";
import Input from "../../ChildComponents/Input";
import {
  getAccessDataRate,
  getTrimmedData,
  isChecked,
} from "../util/Commonservices";
import axios from "axios";
import { toast } from "react-toastify";
import moment from "moment";
import Loading from "../util/Loading";
import DatePicker from "../Components/DatePicker";
import { useTranslation } from "react-i18next";


const SingleBulkPanelChange = () => {
  const { t, i18n } = useTranslation();
  const [err, setErr] = useState({});
  const [CentreData, setCentreData] = useState([]);
  const [RateData, setRateData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    labNo: "",
    panelID: "",
    fromDate: new Date(),
    toDate: new Date(),
    oldPanelID: "",
    NewPanel: "",
  });

  const handleChangeNew = (e, index) => {
    const { name, checked } = e.target;
    if (index >= 0) {
      const data = [...tableData];
      data[index][name] = checked;
      setTableData(data);
    } else {
      const data = tableData.map((ele) => {
        return {
          ...ele,
          isChecked: checked,
        };
      });
      setTableData(data);
    }
  };

 

  const handelSave = () => {
    const data = tableData.filter((ele) => ele?.isChecked);
    if (data.length > 0 ) {
      
      const val = data?.map((ele) => {
        return {
          LabNo: ele?.LedgerTransactionNo,
          OldPanelID: formData?.oldPanelID,
          NewPanelID: formData?.panelID,
        };
      });
      if(formData?.oldPanelID != formData?.panelID){
        setLoading(true);
        axios
          .post("/api/v1/ChangePanel/SaveNewPanelRatesBulk", {
            getData: val,
          })
          .then((res) => {
            toast.success(res?.data?.message);
            setLoading(false);
            handelSearch();
          })
          .catch((err) => {
            toast.error(
            err?.data?.message ? err?.data?.message :t("Something Went Wrong") 
            );
            setLoading(false);
          });
      }else{
        toast.error("OldPanelID and NewPanelID Can't be same")
      }
    } else {
      toast.error(t("please Choose One Test"));
    }
  };

  const validation = () => {
    let error = "";
    if (!formData?.CentreID ) {
      error = t("please Select Search Centre");
    }else if(!formData?.oldPanelID){
      error = t("please Select Search old Client");

    }

    return error;
  };

  const handelSearch = () => {
    const generatedError = validation();

    if (generatedError === "") {
      setLoading(true);
      axios
        .post("/api/v1/ChangePanel/SearchPanel", {
          searchdata: getTrimmedData({
            ...formData,
            fromDate: moment(formData?.fromDate).format("DD-MMM-YYYY"),
            toDate: moment(formData?.toDate).format("DD-MMM-YYYY"),
            labNo: formData?.labNo,
            NewPanelID: formData?.panelID,
            oldPanelID: formData?.oldPanelID,
          }),
        })
        .then((res) => {
          const data = res?.data?.message;
          const val = data?.map((ele) => {
            return {
              ...ele,
              isChecked: false,
            };
          });
          setTableData(val);
          setLoading(false);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something Wents Wrong"
          );
          setLoading(false);
        });
    } else {
      toast.error(generatedError);
    }
  };
  console.log(tableData, "neeraj");

  const dateSelect = (date, name) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const getAccessCentres = () => {
    axios
      .get("/api/v1/Centre/getAccessCentres")
      .then((res) => {
        let data = res.data.message;
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });

        setCentreData(CentreDataValue);
      })
      .catch((err) => console.log(err));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTime = (time, secondName) => {
    let TimeStamp = "";
    TimeStamp = time?.Hour + ":" + time?.Minute + ":" + time?.second;

    setFormData({ ...formData, [secondName]: TimeStamp });
  };

  useEffect(() => {
    getAccessCentres();
  }, []);

  useEffect(() => {
    getAccessDataRate(setRateData, formData?.CentreID).then((res) => {
      setFormData({ ...formData, oldPanelID: res[0]?.value,  panelID: res[0]?.value });
    });
  }, [formData?.CentreID]);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h6 className="m-0 font-weight-bold text-primary float-left">
          {t("Single/Bulk Panel Change")} 
          </h6>
        </div>

        <div className="box-body">
          <div className="row">
            <label className="col-sm-1" htmlFor="inputemail3">{t("Visit No")}:</label>
            <div className="col-sm-2 ">
              <Input
                placeholder={t("VisitNo")}
                className="select-box-input form-control input-sm"
                type="text"
                name="labNo"
                value={formData?.labNo}
                onChange={handleChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputemail3">{t("From Date")}:</label>
            <div className="col-sm-2">
              <DatePicker
                name="fromDate"
                date={formData?.fromDate}
                onChange={dateSelect}
                maxDate={new Date()}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputemail3">{t("To Date")}:</label>
            <div className="col-sm-2">
              <DatePicker
                name="toDate"
                date={formData?.toDate}
                onChange={dateSelect}
                maxDate={new Date()}
                minDate={new Date(formData.fromDate)}
              />
            </div>
        
            <label className="col-sm-1" htmlFor="inputemail3">{t("Search Centre")}:</label>
            <div className="col-sm-2">
              <SelectBox
                options={[{ label: "Select", value: "" }, ...CentreData]}
                formdata={formData.CentreID}
                name="CentreID"
                value={formData.CentreID}
                onChange={handleSelectChange}
              />
            </div>
            </div>
            <div className="row">
            <label className="col-sm-1" htmlFor="inputemail3">{t("Old Client")}:</label>
            <div className="col-sm-2">
              <SelectBox
                options={RateData}
                formdata={formData.oldPanelID}
                value={formData?.oldPanelID}
                name="oldPanelID"
                onChange={handleSelectChange}
              />
              {
                <div className="field-validation-valid text-danger">
                  {err?.oldPanelID}
                </div>
              }
            </div>
            <label className="col-sm-1" htmlFor="inputemail3">{t("New Client")}: </label>
            <div className="col-sm-2">
              <SelectBox
                options={RateData}
                // options={[{ label: "Select NewPanel", value: "" }, ...RateData]}
                formdata={formData.panelID}
                name="panelID"
                value={formData?.panelID}
                onChange={handleSelectChange}
              />
            </div>

            <div className="col-sm-1">
              <button
                className="btn btn-block btn-info btn-sm"
                onClick={handelSearch}
              >
               {t("Search")} 
              </button>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <>
          {tableData?.length > 0 && (
            <div className="box">
              <div className="box-header with-border">
                <h6 className="box-title">{t("Search Result")}</h6>
              </div>

              <div
                className={`box-body divResult table-responsive ${
                  tableData.length > 8 && "boottable"
                }`}
                id="no-more-tables"
              >
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf">
                    <tr>
                      {[
                       t( "S.No."),
                       t("Visit No"),
                       t("PatientName") ,
                       t("Age") ,
                       t("Gender") ,
                       t("Investigation") ,
                       t("Old Panel") ,
                       t("New Panel"),
                       t("Old Amount"),
                       t("New Amount"),
                       t("Disc"),
                        <Input
                          type="checkbox"
                          checked={
                            tableData.length > 0
                              ? isChecked(
                                  "isChecked",
                                  tableData,
                                  true
                                ).includes(false)
                                ? false
                                : true
                              : false
                          }
                          onChange={handleChangeNew}
                        />,
                      ].map((ele, index) => (
                        <th key={index}>{ele}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((ele, index) => (
                      <tr key={index}>
                        <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                        <td data-title={t("Visit No")}>{ele?.LedgerTransactionNo}&nbsp;</td>
                        <td data-title={t("PatientName")}>{ele?.PName}&nbsp;</td>
                        <td data-title={t("Age")}>{ele?.Age}&nbsp;</td>
                        <td data-title={t("Gender")}>{ele?.Gender}&nbsp;</td>
                        <td data-title={t("Investigation")}>{ele?.ItemName}&nbsp;</td>
                        <td data-title={t("Old Panel")}>{ele?.OldPanel}&nbsp;</td>
                        <td data-title={t("New Panel")}>{ele?.NewPanel}&nbsp;</td>
                        <td data-title={t("Old Amount")}>{ele?.Rate}&nbsp;</td>
                        <td data-title={t("New Amount")}>{ele?.NewRate}&nbsp;</td>
                        <td data-title={t("Disc")}>{ele?.DiscountAmt}&nbsp;</td>
                        <td data-title="#">
                          <Input
                            type="checkbox"
                            checked={ele?.isChecked}
                            name="isChecked"
                            onChange={(e) => handleChangeNew(e, index)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {loading ? (
                <Loading />
              ) : (
                <div className="box-footer">
                  <div className="col-sm-1">
                  <button
                    className="btn btn-block btn-success btn-sm"
                    onClick={handelSave}
                  >
                  {t("Save")}  
                  </button>
                </div>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </>
  );
};

export default SingleBulkPanelChange;
