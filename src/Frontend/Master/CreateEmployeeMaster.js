import axios from "axios";
import { useFormik } from "formik";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../../ChildComponents/Input";
import { number } from "../../Frontend/util/Commonservices/number";
import {
  SelectBox,
  SelectBoxWithCheckbox,
} from "../../ChildComponents/SelectBox";
import {
  getAccessCentres,
  GetAccessRightApproval,
  GetAccessRightMaster,
  getDepartment,
  getDesignationData,
  getEmployeeCenter,
  getTrimmedData,
  guidNumber,
} from "../../Frontend/util/Commonservices";
import Loading from "../../Frontend/util/Loading";
import {
  EmployeeMasterSchema,
  PasswordValidation,
} from "../../ValidationSchema";
import UploadModal from "../../Frontend/util/UploadModal";
import { useTranslation } from "react-i18next";

function CreateEmployeeMaster() {
  const location = useLocation();
  const { state } = location;
  const navigation = useNavigate();
  const [Title, setTitle] = useState([]);
  const [show, setShow] = useState(false);
  const [centreId, setCentreId] = useState([]);
  const [supportCentreId, setSupportCentreId] = useState([]);
  const [EmployeeCenter, setEmployeeCenter] = useState([]);
  const [Department, setDepartment] = useState([]);
  const [Designation, setDesigation] = useState([]);
  const [AccessRight, setAccessRight] = useState([]);
  const [ApprovalRight, setApprovalRight] = useState([]);
  const [EditData, setEditData] = useState(false);
  const [userData, setUserData] = useState({});

  const [load, setLoad] = useState(false);
  const [EmployeeMaster, setEmployeeMaster] = useState({
    AccessRight: "",
    ApprovalRight: "",
    ApprovalRightID: "",
    Centre: "",
    CentreID: "",
    City: "",
    Department: "",
    Designation: "",
    DesignationID: "",
    Email: "",
    HouseNo: "",
    Locality: "",
    Mobile: "",
    Name: "",
    PCity: "",
    PHouseNo: "",
    PLocality: "",
    PPincode: "",
    PStreetName: "",
    Pincode: "",
    StreetName: "",
    Title: "",
    isActive: 1,
    isLoginApprovel: 0,
    isPasswordChanged: 0,
    DefaultCentre: "",
    EmployeeIDHash: guidNumber(),
    canRefund: 0,
    canSettlement: 0,
    canDiscountAfterBill: 0,
    HideRate: 0,
    DesignationId: "",
    FirstName: "",
    Password: "",
    Username: "",
    isPassword:true,
  });

  const { t } = useTranslation();

  

  const { values, handleChange, errors, handleBlur, touched, handleSubmit } =
    useFormik({
      initialValues: EmployeeMaster,
      enableReinitialize: true,
      validationSchema: EmployeeMasterSchema,
      onSubmit: (values) => {
        DuplicateUsername().then((res) => {
          if (res) {
          } else {
            setLoad(true);
            axios
              .post(
                state?.url2 ? state?.url2 : "/api/v1/Employee/SaveNewEmployee",
                {
                  EmployeeMaster: [
                    getTrimmedData({
                      EmployeeID: state?.id,
                      AccessRight: EmployeeMaster?.AccessRight,
                      ApprovalRight: EmployeeMaster?.ApprovalRight,
                      Centre: EmployeeMaster?.Centre,
                      CentreID: EmployeeMaster?.CentreID,
                      City: values?.City,
                      Department: EmployeeMaster?.Department,
                      Designation: EmployeeMaster?.Designation,
                      DesignationID: EmployeeMaster?.DesignationID,
                      Email: values?.Email,
                      HouseNo: values?.HouseNo,
                      Locality: values?.Locality,
                      Mobile: values?.Mobile,
                      Name: values?.Name,
                      PCity: values?.PCity,
                      PHouseNo: values?.PHouseNo,
                      PLocality: values?.PLocality,
                      PPincode: values?.PPincode,
                      PStreetName: values?.PStreetName,
                      Pincode: values?.Pincode,
                      StreetName: values?.StreetName,
                      Title: EmployeeMaster?.Title,
                      isActive: EmployeeMaster?.isActive,
                      isLoginApprovel: EmployeeMaster?.isLoginApprovel,
                      isPasswordChanged: EmployeeMaster?.isPasswordChanged,
                      EmployeeIDHash: EmployeeMaster?.EmployeeIDHash,
                      DefaultCentre: EmployeeMaster?.DefaultCentre,
                      canRefund: EmployeeMaster?.canRefund,
                      canSettlement: EmployeeMaster?.canSettlement,
                      canDiscountAfterBill:
                        EmployeeMaster?.canDiscountAfterBill,
                      HideRate: EmployeeMaster?.HideRate,
                    }),
                  ],
                  userData: [
                    getTrimmedData({
                      DesignationId: EmployeeMaster?.DesignationID,
                      FirstName: values?.Name,
                      Password: values.Password,
                      Username: values.Username,
                    }),
                  ],
                }
              )
              .then((res) => {
                toast.success(res?.data?.message);
                setLoad(false);
                navigation("/EmployeeMaster");
              })
              .catch((err) => {
                toast.error(
                  err.response?.data?.message
                    ? err.response?.data?.message
                    : err.response?.data
                );
                setLoad(false);
              });
          }
        });
      },
    });

  const handleChanges = (select, name) => {
    let val = "";
    for (let i = 0; i < select.length; i++) {
      val = val === "" ? `${select[i].value}` : `${val},${select[i].value}`;
    }
    setEmployeeMaster({ ...values, [name]: val });
  };

  const handleMultiSelect = (select, name) => {
    setCentreId(select);
    let val = "";
    for (let i = 0; i < select.length; i++) {
      val = val === "" ? `${select[i].value}` : `${val},${select[i].value}`;
    }
    setEmployeeMaster({
      ...values,
      [name]: val,
      centreId: select[0]?.value,
    });
  };

  const handleSelectChange = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    if (name === "Designation") {
      setEmployeeMaster({
        ...values,
        [name]: label,
        DesignationID: value,
        // centreId:value
      });
    } else {
      setEmployeeMaster({ ...values, [name]: value });
    }
  };

  const getGenderDropdown = (name) => {
    axios.post("/api/v1/Global/getGlobalData", { Type: name }).then((res) => {
      let data = res.data.message;
      let value = data.map((ele) => {
        return {
          value: ele.FieldDisplay,
          label: ele.FieldDisplay,
        };
      });
      setTitle(value);
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEmployeeMaster({
      ...values,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  // useEffect(() => {
  //   setUserData({
  //     ...userData,
  //     DesignationId: EmployeeMaster?.DesignationID,
  //   });
  // }, [EmployeeMaster?.DesignationID]);

  // const handleUserChange = (e) => {
  //   const { name, value } = e.target;
  //   setUserData({ ...userData, [name]: value });
  // };

  // const FormatData = (data) => {
  //   return data?.map((ele) => {
  //     return parseInt(ele);
  //   });
  // };

  const getEditDefaultDropDown = (data) => {
    const val = data.split(",");
    const newData = EmployeeCenter.map((ele) => {
      return val.includes(String(ele?.value)) && ele;
    });
    return newData;
  };

  //Edit Logic

  const fetch = () => {
    setEditData(true);
    axios
      .post(state?.url1, {
        EmployeeID: state?.id,
      })
      .then((res) => {
        const responseData = res.data.message[0];
        const Username = responseData?.Username.split("-")[1];
        const data = {
          ...responseData,
          DesignationId: responseData?.DesignationID,
          Username: Username,
          isPassword:false
        };

        setEmployeeMaster({ ...EmployeeMaster, data });
        // setUserData({
        //   ...userData,
        //   DesignationId: data?.DesignationID,
        //   FirstName: data?.FirstName,
        //   Username: Username,
        //   Password: data?.Password,
        // });
        fetchDepartments(data);
        const dropdown = getEditDefaultDropDown(data?.CentreList);
        setCentreId(dropdown);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const fetchDepartments = (data) => {
    axios
      .post("/api/v1/Employee/getAccessDepartment", {
        EmployeeID: state?.id,
      })
      .then((res) => {
        let val = "";
        for (let i = 0; i < res.data.message.length; i++) {
          val =
            val === ""
              ? `${res.data.message[i].DepartmentID}`
              : `${val},${res.data.message[i].DepartmentID}`;
        }
        const data1 = { ...data, Department: val };
        setEmployeeMaster(data1);
        fetchAccessCenter(data1);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const fetchAccessCenter = (data) => {
    axios
      .post("/api/v1/Employee/SearchAccessCentre", {
        EmployeeID: state?.id,
      })
      .then((res) => {
        let val = "";
        for (let i = 0; i < res.data.message.length; i++) {
          val =
            val === ""
              ? `${res.data.message[i].CentreID}`
              : `${val},${res.data.message[i].CentreID}`;
        }
        const data1 = { ...data, Centre: val };
        setEmployeeMaster(data1);
        fetchAccessRight(data1);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const fetchAccessRight = (data) => {
    axios
      .post("/api/v1/Employee/SearchAccessRight", {
        EmployeeID: state?.id,
      })
      .then((res) => {
        let val = "";
        for (let i = 0; i < res.data.message.length; i++) {
          val =
            val === ""
              ? `${res.data.message[i].AccessRightID}`
              : `${val},${res.data.message[i].AccessRightID}`;
        }
        const data1 = { ...data, AccessRight: val };
        setEmployeeMaster(data1);
        fetchAccessApproval(data1);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  const fetchAccessApproval = (data) => {
    axios
      .post("/api/v1/Employee/SearchApprovalRight", {
        EmployeeID: state?.id,
      })
      .then((res) => {
        console.log(res);
        let val = "";
        for (let i = 0; i < res.data.message.length; i++) {
          val =
            val === ""
              ? `${res.data.message[i].ApprovalRightID}`
              : `${val},${res.data.message[i].ApprovalRightID}`;
        }

        setEmployeeMaster({ ...data, ApprovalRight: val });
        setEditData(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
      });
  };

  useEffect(() => {
    getGenderDropdown("Title");
    getDepartment(setDepartment, "getDepartmentEmployeeMaster");
    getDesignationData(setDesigation, true);
    GetAccessRightMaster(setAccessRight);
    GetAccessRightApproval(setApprovalRight);
  }, []);

  useEffect(() => {
    if (!state) {
      setEmployeeMaster({
        ...EmployeeMaster,
        Title: EmployeeMaster?.Title ? EmployeeMaster?.Title : Title[0]?.value,
        Designation: EmployeeMaster?.Designation
          ? EmployeeMaster?.Designation
          : Designation[0]?.label,
        DesignationID: EmployeeMaster?.DesignationID
          ? EmployeeMaster?.DesignationID
          : Designation[0]?.value,
      });
    }
  }, [Title, Designation]);

  useEffect(() => {
    if (state) {
      fetch();
    }
  }, []);

  const DuplicateUsername = (url) => {
    return new Promise((resolve, reject) => {
      axios
        .post(
          url,
          state
            ? {
                UserName: values?.Username,
                EmployeeID: state?.id,
              }
            : {
                UserName: values?.Username,
                EmployeeID: "",
              }
        )
        .then((res) => console.log(res))
        .catch((err) => {
          resolve(err?.response?.data?.message);
          toast.error(err?.response?.data?.message);
          setEmployeeMaster({
            ...EmployeeCenter,
            Username: "",
          });
        });
    });
  };

  useEffect(() => {
    if (!state) {
      setEmployeeMaster({ ...EmployeeMaster, CentreID: centreId[0]?.value });
    }
  }, [centreId]);

  useEffect(() => {
    getEmployeeCenter(setEmployeeCenter);
    guidNumber();
  }, []);


  console.log(errors,EmployeeMaster.isPassword)

  return (
    <>
      {EditData ? (
        <div className="loading-center">
          <Loading />
        </div>
      ) : (
        <>
          {show && (
            <UploadModal
              show={show}
              handleClose={() => setShow(false)}
              documentId={EmployeeMaster?.EmployeeIDHash}
              pageName="EmployeMaster"
            />
          )}
        </>
      )}
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Employee Details")}</h3>
        </div>

        <div className="box-body">
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Title")}:
            </label>
            <div className="col-sm-2">
              <SelectBox
                options={Title}
                selectedValue={EmployeeMaster?.Title}
                onChange={(e) => handleSelectChange(e, values)}
                name="Title"
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Name")}:
            </label>
            <div className="col-sm-2">
              <Input
                placeholder={t("Name")}
                className="form-control ui-autocomplete-input input-sm"
                name="Name"
                type="text"
                max={50}
                value={values?.Name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors?.Name && touched?.Name && (
                <span className="golbal-Error">{errors?.Name}</span>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("House No")}:
            </label>
            <div className="col-sm-2">
              <div>
                <Input
                  className="form-control ui-autocomplete-input input-sm"
                  placeholder={t("House No")}
                  name="HouseNo"
                  type="text"
                  max={50}
                  value={values?.HouseNo}
                  onBlur={handleBlur}
                  onChange={handleChange}
                />
                {errors?.HouseNo && touched?.HouseNo && (
                  <span className="golbal-Error">{errors?.HouseNo}</span>
                )}
              </div>
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Street Name")}:
            </label>
            <div className="col-sm-2">
              <Input
                placeholder={t("StreetName")}
                className="form-control ui-autocomplete-input input-sm"
                name="StreetName"
                max={50}
                type="text"
                value={values?.StreetName}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Locality")}:
            </label>
            <div className="col-sm-2">
              <Input
                placeholder={t("Locality")}
                name="Locality"
                type="text"
                max={50}
                value={values?.Locality}
                onChange={handleChange}
                className="form-control ui-autocomplete-input input-sm"
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("PinCode")}:
            </label>
            <div className="col-sm-2">
              <Input
                placeholder={t("PinCode")}
                name="Pincode"
                type="number"
                value={values?.Pincode}
                onChange={handleChange}
                onBlur={handleBlur}
                onInput={(e) => number(e, 6)}
                className="form-control ui-autocomplete-input input-sm"
              />
              {errors?.Pincode && touched?.Pincode && (
                <span className="golbal-Error">{errors?.Pincode}</span>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("City")}:
            </label>
            <div className="col-sm-2">
              <Input
                placeholder={t("City")}
                name="City"
                type="text"
                max={50}
                value={values?.City}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-control ui-autocomplete-input input-sm"
              />
              {errors?.City && touched?.City && (
                <span className="golbal-Error">{errors?.City}</span>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Mobile")}:
            </label>
            <div className="col-sm-2 ">
              <Input
                placeholder={t("Mobile")}
                name="Mobile"
                type="number"
                onInput={(e) => number(e, 10)}
                value={values?.Mobile}
                onChange={handleChange}
                onBlur={handleBlur}
                className="form-control ui-autocomplete-input input-sm"
              />

              {errors?.Mobile && touched?.Mobile && (
                <span className="golbal-Error">{errors?.Mobile}</span>
              )}
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Email")}:
            </label>
            <div className="col-sm-2">
              <Input
                placeholder={t("Email")}
                name="Email"
                value={values?.Email}
                onChange={handleChange}
                onBlur={handleBlur}
                max={50}
                className="form-control ui-autocomplete-input input-sm"
                type="email"
              />
              {errors?.Email && touched?.Email && (
                <span className="golbal-Error">{errors?.Email}</span>
              )}
            </div>

            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Company Code")}:
            </label>
            <div className="col-sm-2">
              <Input
                value={window.sessionStorage.getItem("CompanyCode") + "-"}
                readOnly={true}
                className="form-control ui-autocomplete-input input-sm"
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("User Name")}:
            </label>
            <div className="col-sm-2" style={{ display: "flex" }}>
              <Input
                placeholder={t("Username")}
                name="Username"
                value={values?.Username}
                onChange={handleChange}
                max={50}
                onBlur={(e) => {
                  DuplicateUsername("/api/v1/Employee/checkDublicateUserName");
                  handleBlur(e);
                }}
                type="text"
                autoComplete={"off"}
                className="form-control ui-autocomplete-input input-sm"
              />
              {errors?.Username && touched?.Username && (
                <span className="golbal-Error">{errors?.Username}</span>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Password")}:
            </label>
            {!state?.id && (
              <div className="col-sm-2">
                <Input
                  placeholder={t("Password")}
                  name="Password"
                  type="password"
                  onBlur={handleBlur}
                  max={50}
                  value={values?.Password}
                  onChange={handleChange}
                  className="form-control ui-autocomplete-input input-sm"
                />
                {errors?.Password && touched?.Password && (
                  <span className="golbal-Error">{errors?.Password}</span>
                )}
              </div>
            )}
          </div>
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("isLoginApproval")}:
            </label>
            <div className="col-sm-1">
              <Input
                name="isLoginApprovel"
                type="checkbox"
                checked={EmployeeMaster?.isLoginApprovel}
                onChange={handleInputChange}
              />
              {/* <label htmlFor="IsLogin">IsLogin</label> */}
            </div>

            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("CanChangePassword")}:
            </label>
            <div className="col-sm-1">
              <Input
                name="isPasswordChanged"
                type="checkbox"
                checked={EmployeeMaster?.isPasswordChanged}
                onChange={handleInputChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("CanRefund")}:
            </label>
            <div className="col-sm-1">
              <Input
                name="canRefund"
                type="checkbox"
                checked={EmployeeMaster?.canRefund}
                onChange={handleInputChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("CanDiscountAfterBill")}:
            </label>
            <div className="col-sm-1">
              <Input
                name="canDiscountAfterBill"
                type="checkbox"
                checked={EmployeeMaster?.canDiscountAfterBill}
                onChange={handleInputChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("CanSettlement")}:
            </label>
            <div className="col-sm-1">
              <Input
                name="canSettlement"
                type="checkbox"
                checked={EmployeeMaster?.canSettlement}
                onChange={handleInputChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("HideRate")}:
            </label>
            <div className="col-sm-1">
              <Input
                name="HideRate"
                type="checkbox"
                checked={EmployeeMaster?.HideRate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="box form-horizontal">
        <div className="box-header with-border">
          <span className="box-title">{t("Professional Details")}</span>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Centre")}:
            </label>
            <div className="col-sm-2">
              <SelectBox
                name="CentreID"
                options={centreId}
                selectedValue={EmployeeMaster?.CentreID}
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Designation")}:
            </label>
            <div className="col-sm-2">
              <SelectBox
                name="Designation"
                className="required"
                options={Designation}
                selectedValue={EmployeeMaster?.DesignationID}
                onChange={handleSelectChange}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="box form-horizontal">
        <div className="box-header with-border">
          <span className="box-title">{t("Access Details")}</span>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Department")}:
            </label>
            <div className="col-sm-2">
              <SelectBoxWithCheckbox
                name="Department"
                options={Department}
                value={EmployeeMaster?.Department}
                onChange={handleChanges}
              />
              {errors?.Department && touched?.Department && (
                <span className="golbal-Error">{errors?.Department}</span>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Centre")}:
            </label>
            <div className="col-sm-2">
              <SelectBoxWithCheckbox
                name="Centre"
                options={EmployeeCenter}
                value={EmployeeMaster?.Centre}
                onChange={handleMultiSelect}
                depends={setCentreId}
              />
              {errors?.Centre && touched?.Centre && (
                <span className="golbal-Error">{errors?.Centre}</span>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Access Right")}:
            </label>
            <div className="col-sm-2">
              <SelectBoxWithCheckbox
                name="AccessRight"
                options={AccessRight}
                value={EmployeeMaster?.AccessRight}
                onChange={handleChanges}
              />
              {errors?.AccessRight && touched?.AccessRight && (
                <span className="golbal-Error">{errors?.AccessRight}</span>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Approval Right")}:
            </label>
            <div className="col-sm-2">
              <SelectBoxWithCheckbox
                name="ApprovalRight"
                options={ApprovalRight}
                value={EmployeeMaster?.ApprovalRight}
                onChange={handleChanges}
              />
              {errors?.ApprovalRight && touched?.ApprovalRight && (
                <span className="golbal-Error">{errors?.ApprovalRight}</span>
              )}
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("Upload")}:
            </label>
            <div className="col-sm-2">
              <button
                className="btn btn-block btn-info btn-sm"
                type="button"
                id="btnUpload"
                onClick={() => {
                  setShow(true);
                }}
              >
                {t("Attach Signature")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="box form-horizontal">
        <div className="box-header with-border">
          <span className="box-title">{t("Permanent Details")}</span>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("P.HouseNo")}:
            </label>
            <div className="col-sm-2">
              <div>
                <Input
                  placeholder={t("Permanent HouseNo")}
                  name="PHouseNo"
                  type="text"
                  max={50}
                  className="form-control ui-autocomplete-input input-sm"
                  value={values?.PHouseNo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors?.PHouseNo && touched?.PHouseNo && (
                  <span className="golbal-Error">{errors?.PHouseNo}</span>
                )}
              </div>
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("P.StreetName")}:
            </label>
            <div className="col-sm-2">
              <Input
                placeholder={t("Permanent StreetName")}
                name="PStreetName"
                value={values?.PStreetName}
                type="text"
                max={50}
                className="form-control ui-autocomplete-input input-sm"
                onChange={handleChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("P.Locality")}:
            </label>
            <div className="col-sm-2">
              <Input
                placeholder={t("Permanent Locality")}
                name="PLocality"
                value={values?.PLocality}
                type="text"
                max={50}
                className="form-control ui-autocomplete-input input-sm"
                onChange={handleChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("P.Pincode")}:
            </label>
            <div className="col-sm-2">
              <div>
                <Input
                  placeholder={t("Permanent PinCode")}
                  name="PPincode"
                  value={values?.PPincode}
                  type="number"
                  className="form-control ui-autocomplete-input input-sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onInput={(e) => number(e, 6)}
                />
                {errors?.PPincode && touched?.PPincode && (
                  <span className="golbal-Error">{errors?.PPincode}</span>
                )}
              </div>
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              {t("P.City")}:
            </label>
            <div className="col-sm-2">
              <div>
                <Input
                  placeholder={t("Permanent City")}
                  name="PCity"
                  value={values?.PCity}
                  type="text"
                  max={50}
                  className="form-control ui-autocomplete-input input-sm"
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {errors?.PCity && touched?.PCity && (
                  <span className="golbal-Error">{errors?.PCity}</span>
                )}
              </div>
            </div>

            <div className="col-sm-1">
              <Input
                name="isActive"
                type="checkbox"
                checked={EmployeeMaster?.isActive}
                onChange={handleInputChange}
              />
              <label className="control-label" htmlFor="IsLogin">
                {t("Active")}
              </label>
            </div>

            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-block btn-success btn-sm"
                  onClick={handleSubmit}
                  type="submit"
                >
                  {state?.button ? state?.button : t("Submit")}
                </button>
              )}
            </div>

            <div className="col-sm-2">
              <Link to="/EmployeeMaster">{t("Back to List")}</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CreateEmployeeMaster;
