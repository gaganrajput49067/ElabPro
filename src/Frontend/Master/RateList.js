import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";
import Input from "../../ChildComponents/Input";
import { isChecked } from "../../Frontend/util/Commonservices";
import TransferRateType from "../../Frontend/util/TransferRateType";
import axios from "axios";
import Loading from "../../Frontend/util/Loading";
import { toast } from "react-toastify";
import { dateConfig } from "../../Frontend/util/DateConfig";
import { useTranslation } from "react-i18next";

function RateList() {
  const [Department, setDepartment] = useState([]);
  const [RateCentres, setRateCentres] = useState([]);
  const [Billing, setBilling] = useState([]);
  const [load, setLoad] = useState(false);
  const [payload, setPayload] = useState({
    BillingCategory: "",
    CentreID: "",
    DepartmentID: "",
    TestID: "",
  });
  const [tabledata, setTabledata] = useState([]);
  const [ItemList, setItemList] = useState([]);
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

  const onHandleShow = () => {
    setShow(!show);
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  const handleAlert = (payload) => {
    var alert = false;
    if (payload?.DepartmentID === "") {
      alert = true;
      toast.error("please Select Department");
    } else if (payload?.BillingCategory === "") {
      alert = true;
      toast.error("Pleae Select BillingCategory");
    }else if(payload?.CentreID === "")
    {
      alert = true;
      toast.error("Please Select Centre");
    }

    

    return alert;
  };

  const handleSubmit = () => {
    setLoad(true);
    const alert = handleAlert(payload);
    if (!alert) {
      axios
        .post("/api/v1/RateList/RateListGet", payload)
        .then((res) => {
          const data = res?.data?.message;
          if (data?.length === 0) {
            toast.error("No data Found");
            setTabledata([]);
            return;
          }
          let val = data.map((ele) => {
            return {
              ...ele,
              isActive: "0",
            };
          });
          setTabledata(val);
          setLoad(false);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoad(false);
        });
    }
  };

  const handleCollection = (e, index, data) => {
    const { name, checked } = e.target;
    const datas = [...tabledata];
    datas[index][name] = checked ? "1" : "0";
    setTabledata(datas);
  };

  const handleCheckbox = (e) => {
    const { checked } = e.target;
    const data = tabledata?.map((ele) => {
      return {
        ...ele,
        isActive: checked ? "1" : "0",
      };
    });

    setTabledata(data);
  };

  const handleValue = (e, index) => {
    const { name, value } = e.target;
    const datas = [...tabledata];
    datas[index][name] = value;
    setTabledata(datas);
  };

  const handleBaseRateAndMaxRate = (data) => {
    let match = true;
    for (let i = 0; i < data.length; i++) {
      if (
        data[i].MaxRate < data[i]["Rate"] ||
        data[i].BaseRate > data[i]["Rate"]
      ) {
        match = false;
        break;
      }
    }

    return match;
  };

  const handleSave = () => {
    const data = tabledata.filter((ele) => ele.isActive === "1");
    if (data?.length > 0) {
      if (handleBaseRateAndMaxRate(data)) {
        axios
          .post("/api/v1/RateList/RateListCreate", data)
          .then((res) => {
            toast.success(res.data?.message);
            handleSubmit();
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Error Occured"
            );
          });
      } else {
        toast.error("Rate Must be Valid According to Base Rate And Max Rate");
      }
    } else {
      toast.error("please Choose One Value");
    }
  };

  const getRateCenters = (state) => {
    axios
      .get("/api/v1/centre/getRateList")
      .then((res) => {
        let data = res.data.message;

        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        CentreDataValue.unshift({ label: "Rate Type", value: "" });
        setRateCentres(CentreDataValue);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getBillingCategory = (state) => {
    axios
    .get("/api/v1/Investigations/BindBillingCategory")
      .then((res) => {
        let data = res.data.message;
        let val = data.map((ele) => {
          return {
            value: ele?.BillingCategoryId,
            label: ele?.BillingCategoryName,
          };
        });
        val.unshift({ label: "Billing Category", value: "" });
        setBilling(val);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getDepartment = () => {
    axios
      .get(`/api/v1/Department/getDepartment`)
      .then((res) => {
        let data = res.data.message;
        let Department = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        Department.unshift({ label: "Department", value: "" });
        setDepartment(Department);
      })
      .catch((err) => console.log(err));
  };

  const getRateItemList = () => {
    axios
      .post("/api/v1/RateList/getItemList", {
        DepartmentID: payload?.DepartmentID,
        BillingCategory: payload?.BillingCategory,
      })
      .then((res) => {
        let data = res.data.message;
        let val = data.map((ele) => {
          return {
            value: ele?.InvestigationID,
            label: ele?.TestName,
          };
        });
        val.unshift({ label: "Item Name", value: "" });
        setItemList(val);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getDepartment();
    getRateItemList();
    getBillingCategory();
    getRateCenters();
  }, []);

  useEffect(() => {
    if (payload?.BillingCategory !== "" && payload?.DepartmentID !== "") {
      getRateItemList(setItemList, payload);
    }
  }, [payload?.BillingCategory, payload?.DepartmentID]);

  return (
    <>
      <div className="box box-success form-horizontal">
        {show && (
          <TransferRateType
            show={show}
            onHandleShow={onHandleShow}
            Centres={RateCentres}
            Department={Department}
          />
        )}

        <div className="box-header with-border">
          <h3 className="box-title">{t("Rate List")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("Department List")}:</label>
            <div className="col-sm-2 col-md-2">
              <SelectBox
                options={Department}
                name="DepartmentID"
                label="Department"
                selectedValue={payload?.DepartmentID}
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-1">{t("Billing Category")}:</label>
            <div className="col-sm-2 col-md-2">
              <SelectBox
                options={Billing}
                name="BillingCategory"
                selectedValue={payload?.BillingCategory}
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-1">{t("Centres")}:</label>
            <div className="col-sm-2 col-md-2">
              <SelectBox
                options={RateCentres}
                name="CentreID"
                selectedValue={payload?.CentreID}
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-1">{t("Item Name")}:</label>
            <div className="col-sm-2 col-md-2">
              <SelectBox
                options={ItemList}
                name="TestID"
                selectedValue={payload?.TestID}
                onChange={handleSelectChange}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-sm-1">
              <button
                className="btn btn-info btn-sm btn-block"
                onClick={handleSubmit}
              >
                {t("Search")}
              </button>
            </div>
            <div className="col-sm-2">
              <button
                className="btn btn-primary btn-sm btn-block"
                onClick={onHandleShow}
              >
                {t("TranferRate Type")}
              </button>
            </div>
          </div>
          {tabledata.length > 0 && (
            <>
              <div
                className="box-body divResult table-responsive boottable"
                id="no-more-tables"
              >
                <div className="row">
                  <table
                    className="table table-bordered table-hover table-striped tbRecord"
                    cellPadding="{0}"
                    cellSpacing="{0}"
                  >
                    <thead className="cf">
                      <tr>
                        <th>{t("S.No")}</th>
                        <th>{t("Centre Name")}</th>
                        <th>{t("Test Name")}</th>
                        <th>{t("BaseRate")}</th>
                        <th>{t("MaxRate")}</th>
                        <th className="">
                          <div>{t("Rate")}</div>
                        </th>
                        {/* <th>Centre Display Name</th> */}
                        <th>{t("Item Code")}</th>
                        <th> {t("Create On")}</th>
                        <th>{t("Created By")}</th>
                        <th>
                          <Input
                            type="checkbox"
                            checked={
                              tabledata.length > 0
                                ? isChecked(
                                    "isActive",
                                    tabledata,
                                    "1"
                                  ).includes(false)
                                  ? false
                                  : true
                                : false
                            }
                            onChange={handleCheckbox}
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tabledata?.map((data, index) => (
                        <tr key={index}>
                          <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                          <td data-title={t("Centre Name")}>
                            {data?.Centre}&nbsp;
                          </td>
                          <td data-title={t("Test Name")}>
                            {data?.TestName}&nbsp;
                          </td>
                          <td data-title={t("Base Rate")}>
                            {data?.BaseRate}&nbsp;
                          </td>
                          <td data-title={t("Max Rate")}>
                            {data?.MaxRate}&nbsp;
                          </td>
                          <td data-title={t("Rate")}>
                            {data?.isActive === "1" ? (
                              <Input
                                className="select-input-box form-control input-sm"
                                value={Number(data?.Rate)}
                                type="number"
                                name="Rate"
                                onChange={(e) => handleValue(e, index)}
                                max={10}
                              />
                            ) : (
                              Number(data?.Rate).toFixed(2)
                            )}
                          </td>
                          {/* <td></td> */}
                          <td data-title={t("Item Code")}>
                            {data?.TestCode}&nbsp;
                          </td>
                          <td data-title={t("Create On")}>
                            {dateConfig(data?.dtEntry)}&nbsp;
                          </td>
                          <td data-title={t("Created By")}>
                            {data?.CreatedByName ? data?.CreatedByName : "-"}
                            &nbsp;
                          </td>
                          <td data-title={t("Status")}>
                            <Input
                              type="checkbox"
                              name="isActive"
                              checked={data?.isActive === "1" ? true : false}
                              onChange={(e) => handleCollection(e, index, data)}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="col-sm-1" style={{ marginTop: "9px" }}>
                <button
                  className="btn btn-success btn-sm btn-block"
                  onClick={handleSave}
                >
                  {t("Save")}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default RateList;
