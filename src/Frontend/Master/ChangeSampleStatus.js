import React, { useState } from "react";
import Input from "../../ChildComponents/Input";
import { Modal } from "react-bootstrap";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../Frontend/util/Loading";
import CustomModal from "../util/CustomModal";
import { useTranslation } from "react-i18next";
// import CustomModal from "../../Frontend/util/CustomModal";

const ChangeSampleStatus = () => {
  const { t } = useTranslation();
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

  const fetch = (e) => {
    e.preventDefault();
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
      <div className="box box-success">
        {modal && (
          <CustomModal
            show={modal}
            visitID={visitID}
            onHide={() => setModal(false)}
          />
        )}

        <div className="box-header box-border">
          <h6 className="box-title">{t("Change Sample Status")}</h6>
        </div>
        <form  onSubmit={fetch}>
        <div className="box-body">
          <div className="row">
            <div className="col-sm-2">
              <Input
                placeholder={t("Lab No.")}
                className="form-control ui-autocomplete-input input-sm"
                type="text"
                name="LabNo"
                value={input.LabNo}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-1">
              <button
                  className="btn btn-block btn-info btn-sm"
                // onClick={fetch}
                disabled={input?.LabNo.length > 3 ? false : true}
              >
               {t("Search")} 
              </button>
            </div>
          </div>
        </div>
        </form>
      </div>
      {data.length > 0 && (
        <div className="box">
          <div className="box-header with-border">
              <h6 className="box-title">
               {t("Search Result")} 
              </h6>
        
          </div>
          <div className=" box-body divResult table-responsive boottable" id="no-more-tables">
            
              <table  className="table table-bordered table-hover table-striped tbRecord"
              cellPadding="{0}"
              cellSpacing="{0}">
                <thead className="cf">
                  <tr>
                    <th>{t("S.No")}</th>
                    <th>{t("View")}</th>
                    <th>{t("Lab No.")}</th>
                    <th>{t("PName")}</th>
                    <th>{t("Age/Sex")}</th>
                    <th>{t("Investigation")}</th>
                    <th>{t("BarCode")}</th>
                    <th>{t("Result Remove")}</th>
                    <th>{t("Sample Status Remove")}</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td data-title={t("S.No")}>{index + 1}&nbsp;</td>
                        <td data-title={t("View")}
                          onClick={() => {
                            setModal(true);
                            setVisitID(item.LedgerTransactionNo);
                          }}
                        >
                          <i className="fa fa-search" />
                        </td>
                        <td data-title={t("Lab No.")}>{item.LedgerTransactionNo}&nbsp;</td>
                        <td data-title={t("PName")}>{item.PName}&nbsp;</td>
                        <td data-title={t("Age/Sex")}>{item.AgeGender}&nbsp;</td>
                        <td data-title={t("Investigation")}>{item.Investigation}&nbsp;</td>
                        <td data-title={t("BarcodeNo")}>{item.BarcodeNo}&nbsp;</td>

                        <td data-title={t("Result Remove")}>
                         
                          <Input
                            type="checkbox"
                            name="ResultRemove"
                            checked={item?.ResultRemove === "1" ? true : false}
                            disabled={item?.status !== 10 && true}
                            onChange={(e) => {
                              handleCheckbox(e, index);
                            }}
                          />
                        
                        </td>
                        <td data-title={t("Sample Status Remove")}>
                          <Input
                            type="checkbox"
                            name="SampleRemove"
                            checked={item?.SampleRemove === "1" ? true : false}
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
              </table>
          
            {loading ? (
              <Loading />
            ) : (
              ShowBtn() && (
              
               <>
            <div className="box-footer">
            <div className="row">
              <div className="col-sm-1">
                  <button className="btn btn-block btn-success btn-sm" onClick={Submit}>
                  {t("Update")}  
                  </button>
                  </div>
                  <div className="col-sm-1">
                  <button className="btn btn-block btn-danger btn-sm" onClick={handleCancel}>
                   {t("Cancel")} 
                  </button>
                  </div>
              </div>
            </div>
               </>
             
            
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChangeSampleStatus;
