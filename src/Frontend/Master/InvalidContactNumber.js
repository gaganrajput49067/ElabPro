import React, { useEffect, useState } from "react";
import Input from "../../ChildComponents/Input";
import axios from "axios";
import { toast } from "react-toastify";
import { number } from "yup";
import Loading from "../../Frontend/util/Loading";
import { useTranslation } from "react-i18next";

const InvalidContactNumber = () => {
  const [update, setUpdate] = useState(false);
  const [load, setLoad] = useState(false);
  const [formData, setFormData] = useState([]);
  const [input, setInput] = useState({
    MobileNo: "",
    IsActive: "",
    Id: "",
  });
      const { t } = useTranslation();

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setInput({
      ...input,
      [name]: type === "checkbox" ? (checked ? "1" : "0") : value,
    });
  };

  const validation = () => {
    let error = "";
    if (input?.MobileNo?.length !== 10) {
      error = "Invalid Mobile Number";
    }
    return error;
  };

  const getfetch = () => {
    axios
      .get("/api/v1/CommonController/GetInvalidMobileNo")
      .then((res) => {
        setFormData(res?.data?.message);
      })
      .catch((err) => console.log(err));
  };

  //   console.log("dtaaaaa", formData);

  const handleSave = (url, btnName) => {
    const generatedError = validation();
    if (generatedError === "") {
      setLoad(true);
      axios
        .post(url, input)
        .then((res) => {
          toast.success(res?.data?.message);
          setLoad(false);
          getfetch();
          setInput({
            // url: "",
            MobileNo: "",
            IsActive: "",
          });
          btnName === "Update" && setUpdate(false);
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Error Occured"
          );
          setLoad(false);
        });
    } else {
      toast.error(generatedError);
    }
  };

  const handleEdit = (data) => {
    setInput({ ...data, Id: data?.id });
    setUpdate(true);
  };

  useEffect(() => {
    getfetch();
  }, []);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h1 className="box-title">{t("Invalid Contact Number")}</h1>
        </div>
        <div className="box-body">
          <div className="row">
            <label  className="col-sm-2">{t("Invalid Contact Number")}:</label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                placeholder={t("Invalid Contact Number")}
                type="number"
                name="MobileNo"
                onInput={(e) => number(e, 10)}
                value={input?.MobileNo}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-2" style={{alignSelf:"flex-end"}}>
              <Input
                type="checkbox"
                name="IsActive"
                checked={input?.IsActive == "1" ? true : false}
                onChange={(e) => handleChange(e)}
              />
              <label className="control-label">{t("IsActive")}</label>
            </div>
            {/* <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-block btn-warning btn-sm"
                    id="btnSearch"
                    title="Search"
                    onClick={() => {
                      getOutSourceTagging();
                      showButton(true);
                    }}
                  >
                    Search
                  </button>
                </>
              )}
            </div> */}
            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : update ? (
                <button
                  type="button"
                  className="btn btn-block btn-success btn-sm"
                  id="btnSave"
                  title="Save"
                  onClick={() =>
                    handleSave(
                      "/api/v1/CommonController/UpdateInvalidMobileNo",
                      "Update"
                    )
                  }
                >
                {t("Update") } 
                </button>
              ) : (
                <button
                  type="button"
                  className="btn btn-block btn-success btn-sm"
                  id="btnUpdate"
                  title="Update"
                  onClick={() =>
                    handleSave(
                      "/api/v1/CommonController/InsertInvalidMobileNo",
                      "Save"
                    )
                  }
                >
                 {t("Save")} 
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {load ? (
        <Loading />
      ) : (
        <>
          {formData.length > 0 && (
            <div className="box">
              <div
                className="box-body  divResult table-responsive boottable"
                id="no-more-tables"
              >
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead className="cf">
                    <tr>
                      <th>{t("S.No")}</th>
                      <th>{t("Mobile No")}.</th>
                      <th>{t("Status")}</th>
                      <th>{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData?.map((ele, index) => (
                      <tr key={index}>
                        <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                        <td data-title={t("Mobile No")}>{ele?.MobileNo}&nbsp;</td>
                        <td data-title={t("Status")}>
                          {ele?.IsActive === 1 ? t("Active") : t("InActive")}&nbsp;
                        </td>
                        <td data-title={t("Action")}>
                          {
                            <div
                              className="text-primary"
                              style={{
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                              onClick={() => handleEdit(ele)}
                            >
                             {t("Edit")} 
                            </div>
                          }
                          &nbsp;
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default InvalidContactNumber;
