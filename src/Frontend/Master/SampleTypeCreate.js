import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { validationForSampleType } from "../../ChildComponents/validations";
import {
  getTrimmedData,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";
import { useTranslation } from "react-i18next";

const SampleTypeCreate = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { state } = location;
    const [Color, setColor] = useState([]);
    const [load, setLoad] = useState(false);
    const [err, setErr] = useState({});
    const [formData, setFormData] = useState({
      SampleName: state?.data?.SampleName ? state?.data?.SampleName : "",
      Container: state?.data?.Container ? state?.data?.Container : "",
      ColorName: state?.data?.ColorName ? state?.data?.ColorName : "red",
      isActive: state?.data?.isActive ? state?.data?.isActive : "",
      id: state?.data?.id ? state?.data?.id : "",
    });
    const { t } = useTranslation();
  
    const getDropDownData = (name) => {
      axios
        .post("/api/v1/Global/getGlobalData", { Type: name })
        .then((res) => {
          let data = res.data.message;
          let value = data.map((ele) => {
            return {
              value: ele.FieldDisplay,
              label: ele.FieldDisplay,
            };
          });
  
          switch (name) {
            case "Color":
              setColor(value);
              break;
          }
        })
        .catch((err) => console.log(err));
    };
  
    console.log(formData);
  
    const postData = () => {
      let generatedError = validationForSampleType(formData);
      if (generatedError === "") {
        setLoad(true);
        axios
          .post(state?.url, getTrimmedData(formData))
          .then((res) => {
            if (res.data.message) {
              setLoad(false);
              navigate("/SampleType");
              toast.success(res.data.message);
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
        setErr(generatedError);
      }
    };
  
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      console.log(type);
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
      });
    };
  
    const handleSelectChange = (event) => {
      const { name,value } = event.target;
      setFormData({ ...formData, [name]: value });
    };
  
    useEffect(() => {
      getDropDownData("Color");
    }, []);
  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <div className="clearfix">
            <h3 className="box-title">{t("SampleTypeCreate")}</h3>
          </div>
        </div>
        <div className="box-body">
          <div className="row">
          <label className="col-sm-1">{t("SampleName")}:</label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                name="SampleName"
                placeholder={"SampleName"}
                type="text"
                max={50}
                onChange={handleChange}
                value={formData?.SampleName}
              />
              <div className="golbal-Error">
                {err?.SampleName}
              </div>
            </div>
            <label className="col-sm-1">{t("Container")}:</label>
            <div className="col-sm-2">
            <Input
                  className="form-control ui-autocomplete-input input-sm"
                  name="Container"
                  placeholder={"Container"}
                  max={15}
                  onChange={handleChange}
                  value={formData?.Container}
                />
                <div className="golbal-Error">
                  {err?.Container}
                </div>
            </div>
            <label className="col-sm-1">{t("ColorName")}:</label>
            <div className="col-sm-2">
            <SelectBox
                  options={Color}
                  name="ColorName"
                  selectedValue={formData?.ColorName}
                  onChange={handleSelectChange}
                />
            </div>
            <div className="col-sm-1">
                <Input
                  className="control-label"
                  name="isActive"
                  type="checkbox"
                  checked={formData?.isActive}
                  onChange={handleChange}
                />
                    <label className="control-label" htmlFor="isActive">
                 {t("Active")} 
                </label>
            </div>
            <div className="col-sm-1">
            {load ? (
                  <Loading />
                ) : (
                  <button
                    type="submit"
                    className="btn btn-block btn-success btn-sm"
                    title="Create"
                    onClick={postData}
                  >
                    {state?.other?.button ? state?.other?.button :t("Save") }
                  </button>
                )}
            </div>
            <div className="col-sm-1">
            <Link to="/SampleType" >
               {t("Back to List")}  
                </Link>
            </div>

          </div>
          {/* row end */}
        </div>
        {/* box body end */}
      </div>
    </>
  );
};
export default SampleTypeCreate;
