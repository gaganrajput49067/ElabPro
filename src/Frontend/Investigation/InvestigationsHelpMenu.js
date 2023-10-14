import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { SelectBox } from "../../ChildComponents/SelectBox";
import HelpMenuModal from "../../Frontend/util/HelpMenuModal";
import { useTranslation } from "react-i18next";
const InvestigationsHelpMenu = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [Edit, setEdit] = useState(false);
  const [Value, setValue] = useState("");
  const [HelpMenu, setHelpMenu] = useState([]);
  const [formData, setFormData] = useState({
    HelpMenuId: "",
    InvestigationId: state?.data?.InvestigationID
      ? state?.data?.InvestigationID
      : "",
    IsActive: "1",
    MenuId: "",
    MenuName: "",
  });


    const { t } = useTranslation();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const getHelpMenu = () => {
    axios
      .get("/api/v1/Investigations/GetHelpMenu")
      .then((res) => {
        let data = res.data.message;
        let helpMenu = data.map((ele) => {
          return {
            value: ele.MenuId,
            label: ele.MenuName,
          };
        });

        setHelpMenu(helpMenu);
      })
      .catch((err) => console.log(err));
  };

  const MapHelpMenu = () => {
    if(formData?.HelpMenuId){
    axios
      .post("/api/v1/Investigations/MapHelpMenu", {
        HelpMenuId: formData?.HelpMenuId,
        InvestigationId: formData?.InvestigationId,
        IsActive: formData?.IsActive,
      })
      .then((res) => {
        if (res.data.message) {
          toast.success("Mapped successfully");
          handleShowMapMenu();
        } else {
          toast.error("Something went wrong");
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
    }else{
      toast.error("please Choose Help menu")
    }
  };

  console.log(HelpMenu);

  const handleSelectChange = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    setFormData({ ...formData, [name]: value, MenuName: label });
  };

  const handleShowMapMenu = () => {
    axios
      .post("/api/v1/Investigations/ShowMapMenu", {
        InvestigationID: formData?.InvestigationId,
      })
      .then((res) => {
        setValue(res?.data?.message[0]?.HelpMenu);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  // console.log(Value)

  useEffect(() => {
    getHelpMenu();
    handleShowMapMenu();
  }, []);

  return (
    <div className="box box-success form-horizontal">
      <div className="box-header with-header">
        <h3 className="box-title text-primary">{t("Help Menu")}</h3>
      </div>
      {show && (
        <HelpMenuModal
          show={show}
          handleClose={handleClose}
          Edit={Edit}
          getHelpMenu={getHelpMenu}
          state={formData}
        />
      )}
      <div className="box">
        <div className="box-header with-header">
          {/* <h3 className="box-title">Test Name</h3> */}
        </div>

        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("Test Name")}:</label>
            <div className="col-sm-3">
              <Input
                type="text"
                placeholder="Test Name"
                className="select-input-box form-control input-sm"
                disabled
                value={state?.data?.TestName}
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1">{t("Help Menu")}:</label>
            <div className="col-sm-4">
              <SelectBox
                options={[
                  { label: "select Help Menu", value: "" },
                  ...HelpMenu,
                ]}
                name="HelpMenuId"
                onChange={handleSelectChange}
                selectedValue={formData?.HelpMenuId}
              />
            </div>
            <div
              className="col-sm-7 offset-sm-8 border border-dark"
              style={{ display: "flex", justifyContent: "center" }}
            >
              <div
                className="text-center"
                style={{
                  border: "1px solid black",
                  padding: "20px",
                  width: "500px",
                }}
              >
                <h5>{t("Details")} :</h5>
                <span className="text-center">{Value}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="box-body">
          <div className="row">
            <div className="col-sm-1">
              <button
                className="margin btn btn-success btn-block btn-sm"
                onClick={MapHelpMenu}
              >
                {t("Map")}
              </button>
            </div>
            <div className="col-sm-2">
              <button
                className="margin btn btn-info btn-block btn-sm"
                onClick={() => {
                  handleShow();
                  setEdit(false);
                }}
              >
                {t("Add New Help")}
              </button>
            </div>
            <div className="col-sm-2">
              <button
                className="margin btn btn-warning btn-block btn-sm"
                onClick={() => {
                  handleShow();
                  setEdit(true);
                }}
              >
                {t("Edit Help")}
              </button>
            </div>
            <div className="col-sm-1">
              <button
                className="margin btn btn-primary btn-block btn-sm"
                onClick={() => navigate(-1)}
              >
                {t("Back")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestigationsHelpMenu;
