import React, { useEffect, useState } from "react";
import Input from "../../ChildComponents/Input";
import { Link } from "react-router-dom";
import axios from "axios";
import Loading from "../util/Loading";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { getTrimmedData } from "../util/Commonservices";

const BillingCategoryMaster = () => {
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [update, setUpdate] = useState(false);
  const [formData, setFormData] = useState({
    BillingCategoryId: "",
    BillingCategoryName: "",
    isActive: false,
  });
  const { t } = useTranslation();
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const getBillingCategoryMaster = () => {
    axios
      .get("/api/v1/Investigations/BindBillingCategory", formData)
      .then((res) => {
        if (res.status === 200) {
          setData(res.data.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const editBillingCategoryMaster = (id) => {
    axios
      .post("/api/v1/Investigations/EditBillCategory", {
        BillingCategoryId: id,
      })
      .then((res) => {
        const data = res.data.message[0];
        setFormData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const postData = () => {
    setLoad(true);
    if (update === true) {
      axios
        .post("/api/v1/Investigations/UpdateBillCategory", {
          BillingCategoryId: formData.BillingCategoryId,
          BillingCategoryName: formData.BillingCategoryName,
          isActive: formData.isActive ? 1 : 0,
        })
        .then((res) => {
          if (res.data.message) {
            setLoad(false);
            toast.success(res.data.message);
            getBillingCategoryMaster();
            setFormData({
              BillingCategoryName: "",
              isActive: false,
            });
            setUpdate(false);
          } else {
            toast.error("Something went wrong");
            setLoad(false);
          }
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
      setLoad(true);

      axios
        .post("/api/v1/Investigations/SaveBillCategory", {
          BillingCategoryName: formData.BillingCategoryName,
          isActive: formData.isActive ? 1 : 0,
        })
        .then((res) => {
          if (res.data.message) {
            setLoad(false);
            toast.success(res.data.message);
            setFormData({
              BillingCategoryName: "",
              isActive: false,
            });
            getBillingCategoryMaster();
          } else {
            toast.error("Something went wrong");
          }
        })
        .catch((err) => {
          toast.error(err.response.data.message);
          setLoad(false);
        });
    }
  };

  useEffect(() => {
    getBillingCategoryMaster();
  }, []);
  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Billing Category Master")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-2">{t("Billing Category")}:</label>
            <div className="col-sm-2">
              <Input
                type="text"
                className="form-control input-sm"
                name="BillingCategoryName"
                value={formData?.BillingCategoryName}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-1">
              <Input
                type="checkbox"
                name="isActive"
                checked={formData.isActive ? 1 : 0}
                onChange={handleChange}
              />
              <label>Active</label>
            </div>
            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button
                  type="submit"
                  id="btnSave"
                  className="btn btn-success btn-sm btn-block"
                  onClick={postData}
                >
                  {update ? t("Update") : t("Save")}
                </button>
              )}
            </div>

            {/* <div className="col-sm-2">
              <Link>Back to List</Link>
            </div> */}
          </div>
        </div>
      </div>

      <div className="box box-success">
        <div className="box-header with-border">
          <div
            className="box-body divResult table-responsive boottable"
            id="no-more-tables"
          >
            <div className="row">
              {data.length > 0 ? (
                <table
                  className="table table-bordered table-hover table-striped tbRecord"
                  cellPadding="{0}"
                  cellSpacing="{0}"
                >
                  <thead class="cf">
                    <tr>
                      <th>{t("S.No")}</th>
                      <th>{t("BillingCategoryName")}</th>
                      <th>{t("Status")}</th>
                      <th>{t("Action")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((data, i) => (
                      <tr key={i}>
                        <td data-title={t("S.No")}>{i + 1}&nbsp;</td>
                        <td data-title={t("BillingCategoryName")}>
                          {data?.BillingCategoryName}&nbsp;
                        </td>
                        <td data-title={t("Status")}>
                          {data?.isActive ? "Active" : "InActive"}&nbsp;
                        </td>

                        <td data-title={t("Action")}>
                          {data.CompanyId != 0 ? (
                            <div
                              className="text-primary"
                              style={{
                                cursor: "pointer",
                                textDecoration: "underline",
                              }}
                              onClick={() => {
                                window.scroll(0, 0);
                                editBillingCategoryMaster(
                                  data?.BillingCategoryId
                                );
                                setUpdate(true);
                              }}
                            >
                              {t("Edit")}
                            </div>
                          ) : (
                            <span style={{ color: "red" }}>
                              This is System Generated Can't be Changed.
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                " No Data Found"
              )}
            </div>
          </div>
        </div>


        
      </div>
    </>
  );
};

export default BillingCategoryMaster;

