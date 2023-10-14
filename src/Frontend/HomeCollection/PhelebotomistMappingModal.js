import React, { useCallback } from "react";
import Modal from "react-bootstrap/Modal";
import { useTranslation } from "react-i18next";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";
const PhelebotomistMappingModal = ({
  show,
  handleClose,
  name,
  dataObj,
  routes,
  phelebo,
  dropLocation,
  Innerdata,
}) => {
  const { t } = useTranslation();
  const handleValue = (name) => {
    return name === "Route"
      ? Innerdata?.RouteId
      : name === "Phelebo"
      ? Innerdata?.PhelboIdNew[0]
      : name === "DropLocation"
      ? Innerdata?.DropLocationIdNew[0]
      : "";
  };
  const [areaBind, setAreaBind] = useState([]);
  const [value, setValue] = useState(handleValue(name));

  const getAreas = (api, payload) => {
    axios
      .post(api, payload)
      .then((res) => {
        const data = res.data.message;
        handleCheckThroughApi(data, handleKeyName(name), value);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const handleCheckThroughApi = (areabind, key, id) => {
    const data = areabind?.map((ele) => {
      if (ele[key] == id) {
        return {
          ...ele,
          ChkArea: 1,
        };
      } else {
        return {
          ...ele,
          ChkArea: 0,
        };
      }
    });
    setAreaBind(data);
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setValue(value);
  };

  const handleDropDown = (name) => {
    switch (name) {
      case "Route":
        return (
          <SelectBox
            options={routes}
            name="Route"
            selectedValue={value}
            className="input-sm"
            onChange={(e) => handleChange(e)}
          />
        );
        break;
      case "Phelebo":
        return (
          <SelectBox
            options={phelebo}
            name="Phelebo"
            selectedValue={value}
            className="input-sm"
            onChange={(e) => handleChange(e)}
          />
        );
        break;
      case "DropLocation":
        return (
          <SelectBox
            options={dropLocation}
            name="DropLocation"
            selectedValue={value}
            className="input-sm"
            onChange={(e) => handleChange(e)}
          />
        );
        break;
      default:
        break;
    }
  };

  const handlePayload = (name, data) => {
    switch (name) {
      case "Route":
        return {
          API: "/api/v1/PhelebotomistMapping/SaveRoute",
          payload: {
            LocalityId: data?.Id,
            RouteId: value,
            ChkArea: data?.ChkArea,
          },
        };
        break;
      case "Phelebo":
        return {
          API: "/api/v1/PhelebotomistMapping/SavePhelebo",
          payload: {
            LocalityId: data?.Id,
            PheleboId: value,
            ChkArea: data?.ChkArea,
          },
        };
        break;
      case "DropLocation":
        return {
          API: "/api/v1/PhelebotomistMapping/SaveDropLocation",
          payload: {
            CentreId: value,
            DropLocationId: value,
            LocalityId: data?.Id,
            ChkArea: data?.ChkArea,
          },
        };
        break;
      default:
        break;
    }
  };

  const handleAPI = (name, data) => {
    const { API, payload } = handlePayload(name, data);
    axios
      .post(API, payload)
      .then((res) => {
        toast.success(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };
  //names -> Route,Phelebo.......
  const handleCheck = (e, ele, names, index) => {
    // console.log(value);
    if (value && value != 0) {
      const { name, checked } = e.target;
      const data = { ...ele, [name]: checked ? "1" : "0" };
      const val = [...areaBind];
      val[index][name] = checked ? "1" : "0";
      setAreaBind(val);
      handleAPI(names, data);
    } else toast.error("Please select any " + names);
  };

  const handleKeyName = (name) => {
    switch (name) {
      case "Route":
        return "RouteId";
        break;
      case "Phelebo":
        return "PheleboId";
        break;
      case "DropLocation":
        return "droplocationID";
        break;
      default:
        break;
    }
  };

  const handleBindCheckPayload = (data, name, value) => {
    switch (name) {
      case "Route":
        return data;
        break;
      case "Phelebo":
        return { ...data, PheleboId: value };
        break;
      case "DropLocation":
        return { ...data, DropLocationId: value };
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getAreas(
      dataObj?.apiUrl,
      handleBindCheckPayload(dataObj?.payload, name, value)
    );
  }, [value]);

  return (
    <Modal show={show} onHide={handleClose} id="PheleboMap">
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title">
          {t("Map")} : {name}
        </Modal.Title>
        <button type="button" className="close" onClick={handleClose}>
          ×
        </button>
      </Modal.Header>
      <Modal.Body>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-12  col-md-2">{name} :</label>
            <div className="col-sm-12 col-md-4">{handleDropDown(name)}</div>
          </div>

          <div className="row">
            <label className="col-sm-12  col-md-2">Area :</label>

            {areaBind?.map((ele, index) => (
              <div key={index} className="col-sm-2 col-md-3">
                <Input
                  type="checkbox"
                  name="ChkArea"
                  checked={ele?.ChkArea == 0 ? false : true}
                  onChange={(e) => handleCheck(e, ele, name, index)}
                />
                <span className="PheloMapArea">
                  {ele?.NAME} Pincode {ele?.PinCode || ele?.Pincode}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default PhelebotomistMappingModal;
