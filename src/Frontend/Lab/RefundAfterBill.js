import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import Loading from "../util/Loading";
import { useTranslation } from "react-i18next";



const RefundAfterBill = () => {
  const { id } = useParams();
  const [tableData, setTableData] = useState([]);
  const [BindRefundReason, setBindRefundReason] = useState([]);
  const [dropdownData, setDropDownData] = useState({
    RefundReason: "",
  });

  const [load, setLoad] = useState({
    saveLoad: false,
  });

  console.log(tableData);

  const fetch = () => {
    axios
      .post("/api/v1/RefundAfterBill/GetItemsToRefund", {
        LedgerTransactionIDHash: id,
      })
      .then((res) => {
        setTableData(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong."
        );
      });
  };

  const getDropDownData = (name) => {
    axios.post("/api/v1/Global/getGlobalData", { Type: name }).then((res) => {
      let data = res.data.message;
      console.log(data);
      let value = data.map((ele) => {
        return {
          value: ele.FieldDisplay,
          label: ele.FieldDisplay,
        };
      });
      setDropDownData({ RefundReason: value[0]?.value });
      setBindRefundReason(value);
    });
  };

  const handleCheckbox = (e, index) => {
    const { name, checked } = e.target;
    const data = [...tableData];
    data[index][name] = checked === true ? 1 : 0;
    setTableData(data);
  };

  const handleSelectChange = (event) => {
    const { name,value } = event.target;
    setDropDownData({ ...dropdownData, [name]:value });
  };

  const handleSave = () => {
    setLoad({ ...load, saveLoad: true });
    const data = tableData.filter((ele) => ele?.IsRefund === 1);

    const val = data?.map((ele) => {
      return {
        LedgerTransactionID: ele?.LedgerTransactionID,
        ItemId: ele?.ItemId,
        BillNo: ele?.BillNo,
        DiscountAmt: ele?.DiscountAmt,
        Amount: ele?.Amount,
        RefundReason: dropdownData?.RefundReason,
      };
    });
    axios
      .post("/api/v1/RefundAfterBill/SaveRefundAfterBill", {
        PLO: val,
      })
      .then((res) => {
        console.log(res);
        toast.success(res?.data?.message);
        setLoad({ ...load, saveLoad: false });
        fetch();
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something went wrong."
        );
        setLoad({ ...load, saveLoad: false });
      });
  };

  useEffect(() => {
    fetch();
    getDropDownData("RefundReason");
  }, []);

  const handleShowSubmit = () => {
    let show = false;
    for (let i = 0; i < tableData.length; i++) {
      if (tableData[i]["IsRefund"] === 1) {
        show = true;
        break;
      }
    }
    return show;
  };

  const { t } = useTranslation();


  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h6 className="box-title">{t("Refund After Bill")}</h6>
        </div>

        <div className="box box-body">
          <div
            className=" box-body divResult table-responsive boottable"
            id="no-more-tables"
          >
            <table
              id="tblData"
              className="table table-bordered table-hover table-striped tbRecord"
              cellPadding="{0}"
              cellSpacing="{0}"
            >
              <thead>
                <tr>
                  {[
                    t("S.No."),
                    t("Lab No"),
                    t("Patient Code"),
                    t("Test Name"),
                    t("Quantity"),
                    t("Rate"),
                    t("Amount"),
                    t("Select"),
                  ].map((ele, index) => (
                    <th key={index}>{ele}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((data, index) => (
                  <tr key={index}>
                    <td data-title={t("S.No.")}>{index + 1}&nbsp;</td>
                    <td data-title={t("Lab No")}>
                      {data?.LedgerTransactionNo}&nbsp;
                    </td>
                    <td data-title={t("Patient Code")}>
                      {data?.PatientCode}&nbsp;
                    </td>
                    <td data-title={t("Test Name")}>{data?.ItemName}&nbsp;</td>
                    <td data-title={t("Quantity")}>{data?.Quantity}&nbsp;</td>
                    <td data-title={t("Rate")}>{data?.Rate}&nbsp;</td>
                    <td data-title={t("Amount")}>{data?.Amount}&nbsp;</td>
                    <td data-title={t("Select")}>
                      {data?.Rate != 0 && (
                        <Input
                          type="checkbox"
                          checked={data?.IsRefund}
                          name="IsRefund"
                          onChange={(e) => handleCheckbox(e, index)}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {handleShowSubmit() && (
            <div>
              <div className="col-sm-2">
                <SelectBox
                  name="RefundReason"
                  options={BindRefundReason} //BindRefundReason
                  onChange={handleSelectChange}
                  selectedValue={dropdownData?.RefundReason}
                  
                />
              </div>
              <div className="col-sm-1">
                {load?.saveLoad ? (
                  <Loading />
                ) : (
                  <button
                    className="btn btn-block btn-success btn-sm"
                    onClick={handleSave}
                  >
                    {t("Save")}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RefundAfterBill;
