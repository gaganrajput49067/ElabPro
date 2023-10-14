import React, { useEffect, useState } from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";
import axios from "axios";
import { toast } from "react-toastify";
import {
  isChecked,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";
import Input from "../../ChildComponents/Input";
import { useTranslation } from "react-i18next";


const BreakpointPage = () => {
  const [options, setOptions] = useState([]);
  const [tabledata, setTableData] = useState([]);
  const [payload, setPayload] = useState({
    GroupID: "2",
  });
  const [load, setLoad] = useState(false);
  const [load2, setLoad2] = useState(false);
  const { t } = useTranslation();

  //State for input type text

  // API DROPDOWN BINDING START
  const BindCentre = () => {
    axios
      .post("/api/v1/CommonController/BindOrganism", {
        TypeID: 2,
      })
      .then((res) => {
        let data = res?.data?.message;
        let Organisum = data.map((ele) => {
          return {
            value: ele.organismid,
            label: ele.organismname,
          };
        });
        Organisum.unshift({ label: "Organism", value: "0" });
        setOptions(Organisum);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  // API DROPDOWN BINDING END

  const handleCheckbox = (e) => {
    const { checked } = e.target;
    const data = tabledata?.map((ele) => {
      return {
        ...ele,
        isActive: checked ? "1" : "0",
      };
    });
    setTableData(data);
  };

  const handleCollection = (e, index) => {
    const { name, checked, type, value } = e.target;
    const datas = [...tabledata];
    datas[index][name] = type === "checkbox" ? (checked ? "1" : "0") : value;
    setTableData(datas);

    //  if the "breakpoint" input field is empty
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  useEffect(() => {
    BindCentre();
  }, []);

  // TABLE API BINDING START

  const handleSearch = () => {
    setLoad(true);
    axios
      .post("/api/v1/BreakPoint/GetAntibioticList", payload)
      .then((res) => {
        let tablemap = res?.data?.message;
        let data = tablemap?.map((ele) => {
          return {
            ...ele,
            isActive: "0",
          };
        });
        setTableData(data);
        setLoad(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Data Can not found"
        );
        setLoad(false);
      });
  };

  // TABLE API BINDING END

  // Save Button API Start

  const handleSave = () => {
    const data = tabledata.filter((ele) => ele.isActive === "1");
    if (data?.length > 0) {
      setLoad2(true);
      // Check if the "breakpoint" input field is empty
      const isInputEmpty = data.some((item) => item.breakpoint.trim() === "");
      if (isInputEmpty) {
        toast.error("Please enter value in the Breakpoint field");
        setLoad2(false);
        return;
      }

      axios
        .post("/api/v1/BreakPoint/SaveBreakPoint", {
          BreakPointData: data,
        })
        .then((res) => {
          toast.success(res.data?.message);
          setLoad2(false);
          handleSearch();
        })
        .catch((err) => {
          toast.error(
            err?.data?.message ? err?.data?.message : "Error Occured"
          );
          setLoad2(false);
        });
    } else {
      toast.error("please Choose One Value");
    }
  };

  // Save Button API End

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Break Point Page")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
          <label className="col-sm-1">{t("Organism")}:</label>
            <div className="col-sm-2 col-md-2">
              <SelectBox
                name={"GroupID"}
                options={options}
                selectedValue={payload?.GroupID}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-2">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-info btn-sm btn-block"
                  onClick={handleSearch}
                >
                 {t("Search BreakPoint")} 
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {tabledata.length > 0 && (
        <div className="box form-horizontal">
          <div className="box-header with-border">
            <h3 className="box-title"> {t("Antibiotic Details")}</h3>
          </div>
          <div className="box-body divResult table-responsive boottable" id="no-more-tables">
            <div className="row">
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf">
                    <tr>
                      <th>{t("Sr.No")}</th>
                      <th>{t("Antibiotic Name")}</th>
                      <th>{t("BreakPoint")} </th>
                      <th>
                        <Input
                          type="checkbox"
                          checked={
                            tabledata.length > 0
                              ? isChecked("isActive", tabledata, "1").includes(
                                  false
                                )
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
                    {tabledata?.map((item, index) => (
                      <>
                        <tr key={index}>
                          <td data-title={t("Sr.No")}>{index + 1}&nbsp;</td>
                          <td data-title={t("Aniboitic Name")}>{item?.name}&nbsp;</td>
                          <td data-title={t("BreakPoint")}>
                            {/* user can enter value in input */}
                            <Input
                              className="select-input-box form-control input-sm"
                              // className={` form-control input-sm ${isInputEmpty ? 'is-invalid' : ''}`}
                              value={item?.breakpoint}
                              type="text"
                              name="breakpoint"
                              onChange={(e) => handleCollection(e, index)}
                            />
                          </td>
                          <td data-title="Status">
                            <Input
                              type="checkbox"
                              name="isActive"
                              checked={item?.isActive === "1" ? true : false}
                              onChange={(e) => handleCollection(e, index)}
                            />
                          </td>
                        </tr>
                        {/* Save button start */}

                     
                        {isChecked("isActive", tabledata, "1").includes(
                          true
                        ) && (
                          <>
                            {/* Loading Start */}

                            {load2 ? (
                              <Loading />
                            ) : (
                                <div className="row">
                              <div className="col-sm-6" style={{marginTop:"5px"}}>
                                <button
                                  className="btn btn-success btn-sm btn-block ml-5"
                                  onClick={handleSave}
                                >
                                 {t("Save")} 
                                </button>
                              </div>
                            </div>
                            )}
                            
                            {/* Loading End */}
                          </>
                        )}
                       
                      </>
                    ))}
                    {/* Save button End */}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
      )}
    </>
  );
};

export default BreakpointPage;
