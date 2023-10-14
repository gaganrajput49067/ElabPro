import React, { useEffect, useState } from "react";
import CustomDate from "../../ChildComponents/CustomDate";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { Table } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
import moment from "moment";
import {
  getAccessCentres,
  selectedValueCheck,
  isChecked,
} from "../../Frontend/util/Commonservices";
import DatePicker from "../Components/DatePicker";
import Input from "../../ChildComponents/Input";
import Loading from "../util/Loading";
import InvoiceCreationModal from "../util/InvoiceCreationModal";

const InvoiceCreation = () => {
  const [tableData, setTableData] = useState([]);
  const [errors, setErrors] = useState({});
  const [show, setShow] = useState({
    modal: false,
    id: "",
  });
  const [load, setLoad] = useState(false);
  const [CentreData, setCentreData] = useState([]);
  const [payload, setPayload] = useState({
    FromDate: new Date(),
    ToDate: new Date(),
    CentreID: "0",
    InvoiceDate: new Date(),

    // CentreName: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({
      ...payload,
      [name]: value,
    });
  };

  const handleCheck = (e, index) => {
    const { checked, name } = e.target;
    if (index >= 0) {
      const data = [...tableData];
      data[index][name] = checked;
      setTableData(data);
    } else {
      const data = tableData.map((ele) => {
        return {
          ...ele,
          [name]: checked,
        };
      });
      setTableData(data);
    }
  };

  const saveInvoice = () => {
    const filteredData = tableData.filter((ele) => ele.IsChecked === true);

    if (filteredData.length > 0) {
      const val = filteredData.map((ele) => {
        return ele.ClientID;
      });

      // return {
      //   //    ...ele,
      //       FromDate: moment(payload?.FromDate).format("YYYY-MM-DD"),
      //       ToDate: moment(payload?.ToDate).format("YYYY-MM-DD"),
      //       InvoiceDate: moment(payload?.InvoiceDate).format("YYYY-MM-DD"),
      //       InvoiceTo:ele.ClientID
      //     };
      //  setTableData(val);

      axios
        .post("api/v1/Accounts/InvoiceCreation", {
          FromDate: moment(payload?.FromDate).format("YYYY-MM-DD"),
          ToDate: moment(payload?.ToDate).format("YYYY-MM-DD"),
          InvoiceDate: moment(payload?.InvoiceDate).format("YYYY-MM-DD"),
          InvoiceTo: val,
        })
        .then((res) => {
          toast.success(res?.data?.message);
        })
        .catch(() => {});
    } else {
      toast.error("Please select atleast one.");
    }
  };

  const handleSelectChange = (event) => {
    const { name, value } = event.target;
    setPayload({ ...payload, [name]: value });
  };

  const dateSelect = (date, name) => {
    setPayload({
      ...payload,
      [name]: date,
    });
  };
  const InvoiceCreationSearch = () => {
    setLoad(true);

    axios
      .post("/api/v1/Accounts/InvoiceCreationSearch", {
        ...payload,
        InvoiceTo: payload?.CentreID,
        FromDate: moment(payload?.FromDate).format("DD-MMM-YYYY"),
        ToDate: moment(payload?.ToDate).format("DD-MMM-YYYY"),
      })
      .then((res) => {
        // console.log(res.data,"Calling the res");
        setLoad(false);
        if (res?.data.status)
          if (res?.data?.message.length > 0) {
            setTableData(res?.data?.message);
          } else {
            toast.error("No Record Found");
          }
        else
          toast.error(
            res?.data?.message ? res?.data?.message : "No Record Found"
          );
      })
      .catch((err) => {
        setLoad(false);
        toast.error("Something went wrong");
      });
  };

  const handleModalState = (data) => {
    setShow({
      modal: true,
      id: {
        FromDate: moment(payload?.FromDate).format("DD-MMM-YYYY"),
        ToDate: moment(payload?.ToDate).format("DD-MMM-YYYY"),
        InvoiceDate: moment(payload?.InvoiceDate).format("DD-MMM-YYYY"),
        ClientID: data?.ClientID,
      },
    });
  };

  const handleModalClose = () => {
    setShow({
      modal: false,
      id: "",
    });
  };

  useEffect(() => {
    getAccessCentres(setCentreData);
  }, []);
  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">InvoiceCreation</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <div className="col-sm-2">
              <div>
                <DatePicker
                  type="date"
                  name="FromDate"
                  date={payload?.FromDate}
                  onChange={dateSelect}
                  // onChangeTime={handleTime}
                  // secondName="FromTime"
                  maxDate={new Date()}
                />
                {errors?.FromDate && (
                  <span className="golbal-Error">{errors?.FromDate}</span>
                )}
              </div>
            </div>
            <div className="col-sm-2">
              <div>
                <DatePicker
                  name="ToDate"
                  date={payload?.ToDate}
                  onChange={dateSelect}
                  // onChangeTime={handleTime}
                  // secondName="ToTime"
                  minDate={new Date(payload.FromDate)}
                />
                {errors?.ToDate && (
                  <span className="golbal-Error">{errors?.ToDate}</span>
                )}
              </div>
            </div>
            <div className="col-sm-2">
              <SelectBox
                options={[{ label: "All Centre", value: 0 }, ...CentreData]}
                name="CentreID"
                selectedValue={payload?.CentreID}
                onChange={handleSelectChange}
              />
            </div>
            <div className="col-sm-2">
              <div>
                <DatePicker
                  type="date"
                  name="InvoiceDate"
                  date={payload?.InvoiceDate}
                  onChange={dateSelect}
                  // onChangeTime={handleTime}
                  // secondName="FromTime"
                  maxDate={new Date()}
                />
                {errors?.FromDate && (
                  <span className="golbal-Error">{errors?.FromDate}</span>
                )}
              </div>
            </div>
            <div className="col-sm-1">
              <button
                // className="btn btn-success"
                className="btn btn-block btn-success btn-sm"
                onClick={InvoiceCreationSearch}
              >
                Search
              </button>
            </div>
            {/* <div className="col-sm-1">
              <button className="btn btn-block btn-danger btn-sm">
                Cancel
              </button>
            </div> */}
          </div>
        </div>
        <div></div>
      </div>
      <div className="box">
        {load ? (
          <Loading />
        ) : (
          tableData?.length > 0 && (
            <div
              className=" box-body divResult table-responsive"
              id="no-more-tables"
            >
              <table
                className="table table-bordered table-hover table-striped tbRecord"
                cellPadding="{0}"
                cellSpacing="{0}"
              >
                <thead className="text-center cf" style={{ zIndex: 99 }}>
                  <tr>
                    <th>View</th>
                    <th>S.No</th>
                    <th>Code</th>
                    <th>Client Name</th>
                    <th>Share Amt.</th>
                    <th>
                      <input
                        type="checkbox"
                        name="IsChecked"
                        onChange={(e) => {
                          handleCheck(e);
                        }}
                        checked={
                          tableData.length > 0
                            ? isChecked("IsChecked", tableData, true).includes(
                                false
                              )
                              ? false
                              : true
                            : false
                        }
                      />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {tableData?.map((ele, index) => (
                    <tr key={index}>
                      <td data-title="View">
                        <i
                          className="fa fa-search"
                          onClick={() => handleModalState(ele)}
                        />
                        &nbsp;
                      </td>
                      <td data-title="S.No">{index + 1}&nbsp;</td>
                      <td data-title="Code">{ele.ClientCode}&nbsp;</td>
                      <td data-title="Client Name">{ele.ClientName}&nbsp;</td>
                      <td data-title="Share Amt.">{ele.ShareAmt}&nbsp;</td>
                      <td data-title="Action">
                        <Input
                          type="checkbox"
                          name="IsChecked"
                          onChange={(e) => {
                            handleCheck(e, index);
                          }}
                          checked={ele?.IsChecked}
                        ></Input>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="row" style={{ float: "right" }}>
                <button
                  type="button"
                  // name="buttonsave"
                  className="btn btn-sm btn-success"
                  onClick={saveInvoice}
                >
                  Save
                </button>
              </div>
            </div>
          )
        )}
      </div>
      {show?.modal && (
        <div>
          <InvoiceCreationModal
            show={show?.modal}
            data={show?.id}
            onClose={handleModalClose}
          />
        </div>
      )}
    </>
  );
};

export default InvoiceCreation;
