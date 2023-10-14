import React, { useEffect, useState } from "react";
import Input from "../../ChildComponents/Input";
import {
  SelectBoxWithCheckbox,
} from "../../ChildComponents/SelectBox";
import axios from "axios";
import Loading from "../util/Loading";
import { getAccessRateType } from "../util/Commonservices";
import DatePicker from "../Components/DatePicker";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
const ChangePanel = () => {
  const [errors, setErrors] = useState({});
  // const location = useLocation();
  // const { state } = location;
  const [visitNo, setVisitNo] = useState([]);
  const [currentPanel, setCurrentPanel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payload, setPayload] = useState({
    PanelID: "",
    Age: "",
  });
  const { t } = useTranslation();
  const handleChange = (name, value) => {
    setPayload({ ...payload, [name]: value });
  };
  const handleSelectChanges = (select, name) => {
    let val = select.map((ele) => ele?.value);
    setPayload({ ...payload, [name]: val });
  };

  const dateSelect = (date, name) => {
    setPayload({
      ...payload,
      [name]: date,
    });
  };

  const fetch = () => {
    setLoading(true);
    axios
      .post("")
      .then((res) => {
        setPayload(res.data.message);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Wents Wrong"
        );
        setPayload(false);
      });
  };

  // update Api
  const handleSubmit = () => {
    setLoading(true);
    axios
      .post("")
      .then((res) => {
        toast.success(res?.data?.message);
        fetch();
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
    setLoading(false);
  };
  // end

  useEffect(() => {
    getAccessRateType(setCurrentPanel);
    // fetch();
  }, []);

  return (
    <>
      <div className="box box-success">
        <div className="box-header with-border">
          <h3 className="box-title">{t("ChangePanel")}</h3>
        </div>

        <div className="box-body">
          <form action="" handleSubmit={fetch}>
            <div className="row">
              <label className="col-sm-1">
                <small>{t("Visit No.")}:</small>
              </label>
              <div className="col-sm-2">
                <Input
                  className="form-control ui-autocomplete-input input-sm"
                  placeholder={t("Visit No.")}
                  type="text"
                  value={visitNo}
                  onChange={(e) => setVisitNo(e.target.value)}
                  required
                />
              </div>
              <div className="col-sm-1">
                <button
                  // onClick={() => handleChange("ToggleData", "hiddenObject")}
                  // className={`btn btn-block btn-info btn-sm ${
                  //   data?.ToggleData === "hiddenObject" && "is-Active-btn"
                  // }`}
                  className="btn btn-block btn-info btn-sm"
                  disabled={visitNo.length > 3 ? false : true}
                  onClick={fetch}
                >
                  {t("Search")}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* <div className="box box-success">
        <div className="box-header with-border">
          <h3 className="box-title">Change Option</h3>
        </div> */}

      {loading ? (
        <Loading />
      ) : (
        <>
          {/* {data?.ToggleData === "hiddenObject" && ( */}
          <div className="box">
            <div className="box-header with-border">
              <h3 className="box-title">{t("Change Option")}</h3>
            </div>

            <div className="box-body">
              <div className="row">
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("Visit No.")}:</small>
                  </label>
                  <Input
                    className="form-control ui-autocomplete-input input-sm"
                    // placeholder={"Visit No."}
                    type="text"
                    name=""
                    required
                  />
                </div>
                <div className="col-sm-2 ">
                  <label className="control-label">
                    <small>{t("Patient Name")}:</small>
                  </label>
                  <Input
                    className="form-control ui-autocomplete-input input-sm"
                    // placeholder={"Patient Name:"}
                    type="text"
                    name=""
                    required
                  />
                </div>
                <div className="col-sm-2 ">
                  <label className="control-label">
                    <small>{t("UHID")}:</small>
                  </label>
                  <Input
                    className="form-control ui-autocomplete-input input-sm"
                    // placeholder={"UHID:"}
                    type="text"
                    name=""
                    required
                  />
                </div>
                <div className="col-sm-2 ">
                  <label className="control-label">
                    <small>{t("Age")}:</small>
                  </label>

                  {/* <DatePicker
                      type="date"
                      name="Age"
                      date={formData?.FromDate}
                      onChange={dateSelect}
                      // onChangeTime={handleTime}
                      // secondName="FromTime"
                      maxDate={new Date()}
                    /> */}
                  <DatePicker
                    name="DOB"
                    type="date"
                    date={payload?.DOB}
                    className="select-input-box form-control input-sm required"
                    onChange={dateSelect}
                    maxDate={new Date()}
                    minDate={new Date(1900, 0, 1)}
                  />
                  {errors?.DOB && (
                    <span className="golbal-Error">{errors?.DOB}</span>
                  )}
                </div>
                <div className="col-sm-2 ">
                  <label>
                    <small>{t("Reg. Date & Time")}</small>
                  </label>
                  <DatePicker
                    name="RegDate"
                    type="date"
                    date={payload?.RegDate}
                    className="select-input-box form-control input-sm required"
                    onChange={dateSelect}
                    maxDate={new Date()}
                    minDate={new Date(1900, 0, 1)}
                  />
                  {errors?.RegDate && (
                    <span className="golbal-Error">{errors?.RegDate}</span>
                  )}
                </div>
                <div className="col-sm-2 ">
                  <label className="control-label">
                    <small>{t("Gender")}:</small>
                  </label>
                  <Input
                    className="form-control ui-autocomplete-input input-sm"
                    // placeholder={"Gender"}
                    type="text"
                    // onChange={handleChange}
                    name=""
                    required
                  />
                </div>
              </div>
              <div className="row my-4">
                <div className="col-sm-6 ">
                  <div
                    className=" box-body divResult table-responsive mt-4"
                    id="no-more-tables"
                  >
                    <table
                      className="table table-bordered table-hover table-striped tbRecord"
                      cellPadding="{0}"
                      cellSpacing="{0}"
                    >
                      <thead className="cf">
                        <th>{t("Test Name")}</th>
                        <th>{t("Rate")}</th>
                        <th>{t("Status")}</th>
                      </thead>
                      <tbody>
                        <tr>
                          <td data-title={t("Test Name")}>SERUM LIPASE &nbsp;</td>
                          <td data-title={t("Rate")}>600 &nbsp;</td>
                          <td data-title={t("Status")}>Active &nbsp;</td>
                        </tr>
                        <tr>
                          <td data-title={t("Test Name")}>LIPID PROFILE &nbsp;</td>
                          <td data-title={t("Rate")}>601 &nbsp;</td>
                          <td data-title={t("Status")}>Active &nbsp;</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="col-sm-2 ">
                  <label className="control-label">
                    <small>{t("Current Panel")}:</small>
                  </label>
                  <Input
                    className="form-control ui-autocomplete-input input-sm"
                    // placeholder={"Current Panel"}
                    type="text"
                    name=""
                    required
                  />
                </div>
                <div className="col-sm-2 form-group">
                  <label className="control-label">
                    <small>{t("Change Panel")}:</small>
                  </label>
                  <div>
                    <SelectBoxWithCheckbox
                      options={currentPanel}
                      value={payload.PanelID}
                      name="PanelID"
                      onChange={handleSelectChanges}
                    />
                  </div>
                </div>
                <div className="col-sm-2 ">
                  <label className="control-label">
                    <small>{t("Current Payment Type")}:</small>
                  </label>
                  <Input
                    className="form-control ui-autocomplete-input input-sm"
                    // placeholder={"Current Payment Type"}
                    type="text"
                    name=""
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-sm-1" style={{ alignSelf: "flex-end" }}>
                  <button className="btn btn-block btn-success btn-sm">
                    {t("Update")}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* )} */}
        </>
      )}
    </>
  );
};
export default ChangePanel;
