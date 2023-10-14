import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import DatePicker from "../Components/DatePicker";

import Loading from "../../util/Loading";
import { Image } from "react-bootstrap";
import transfericon from "../../images/TRY6_27.gif";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PhlebotomistCallTransfer = () => {
  const { t } = useTranslation();
  const [states, setStates] = useState([]);

  const fetchStates = () => {
    axios
      .post("api/v1/CommonHC/GetStateData", {
        BusinessZoneID: 0,
      })
      .then((res) => {
        let data = res.data.message;

        let value = data.map((ele) => {
          return {
            value: ele.ID,
            label: ele.State,
          };
        });
        console.log(value);
        setStates(value);
      })
      .catch((err) => {
        toast.error("Something went wrong");
      });
  };

  useEffect(() => {
    fetchStates();
  }, []);

  return (
    <div>
      <div className="box with-border">
        <div className="box box-header with-border box-success">
          <h3 className="box-title text-center">
            {t("Phlebotomist Call Transfer")}
          </h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-2" htmlFor="State">
              {t("State")}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;:
            </label>
            <div className="col-sm-2">
              <SelectBox
                name="State"
                className="form-control input-sm"
                options={[{ label: "Select", value: "" }, ...states]}
              />
            </div>
            <div className="col-sm-3"></div>

            <label className="col-sm-2" htmlFor="City">
              {t("City")}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </label>
            <div className="col-sm-2">
              <SelectBox name="City" className="form-control input-sm" />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-2" htmlFor="Phlebotomist">
              {t("Phlebotomist")}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </label>
            <div className="col-sm-2">
              <SelectBox
                name="Phlebotomist"
                className="form-control input-sm"
              />
            </div>
            <div className="col-sm-3"></div>

            <label className="col-sm-2" htmlFor="Date">
              {t("Date")}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </label>
            <div className="col-sm-2">
              <DatePicker
                name="date"
                date={new Date()}
                className="form-control input-sm"
              />
            </div>
          </div>
          <div
            className="row"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <Image src={transfericon} style={{ height: "40px" }} />
          </div>
          <div className="row">
            <label className="col-sm-2" htmlFor="State">
              {t("State")}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;:
            </label>
            <div className="col-sm-2">
              <SelectBox name="city" className="form-control input-sm" />
            </div>
            <div className="col-sm-3"></div>

            <label className="col-sm-2" htmlFor="State">
              {t("City")}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </label>
            <div className="col-sm-2">
              <SelectBox name="state" className="form-control input-sm" />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-2" htmlFor="Phlebotomist">
              {t("Phlebotomist")}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;:
            </label>
            <div className="col-sm-2">
              <SelectBox
                name="Phlebotomist"
                className="form-control input-sm"
              />
            </div>
            <div className="col-sm-3"></div>
          </div>
          <div
            className="row"
            style={{ display: "flex", justifyContent: "center" }}
          >
            <button type="button" className="btn  btn-primary btn-sm">
              {t("Transfer Calls")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhlebotomistCallTransfer;
