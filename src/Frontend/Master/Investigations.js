import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DataType,
  ReportTypeNew,
  SampleOption,
} from "../../ChildComponents/Constants";
import {
  SelectBox,
  SelectBoxWithCheckbox,
} from "../../ChildComponents/SelectBox";
import { toast } from "react-toastify";
import { Table } from "react-bootstrap";
import Input from "../../ChildComponents/Input";
import { number } from "../../Frontend/util/Commonservices/number";
import Loading from "../../Frontend/util/Loading";
import {
  PreventSpecialCharacter,
  getTrimmedData,
  // selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import {
  InvestigationsMasterSchema,
  ProfileInvestigationsMasterSchema,
} from "../../ValidationSchema";
import { useFormik } from "formik";

const Investigations = () => {
  const location = useLocation();
  const { state } = location;
  const navigate = useNavigate();
  const [MapTest, setMapTest] = useState([]);
  const [DepartmentData, setDepartmentData] = useState([]);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(true);
  const [SampleType, setSampleType] = useState([]);
  const [LogisticTemp, setLogisticTemp] = useState([]);
  const [SampleTypeID, setSampleTypeID] = useState([]);
  const [RequiredAttachment, setRequiredAttachment] = useState([]);
  const [ConcentForm, setConcentForm] = useState([]);
  const [SampleContainer, setSampleContainer] = useState([]);
  const [BillingCategory, setBillingCategory] = useState([]);
  const [MapTestTableData, setMapTestTableData] = useState([]);
  const [Gender, setGender] = useState([]);
  const [formData, setFormData] = useState({
    InvestigationID: "",
    ConcentForm: "",
    PrintName: "",
    DataType: "Test",
    TestName: "",
    DepartmentID: "1",
    TestCode: "",
    ReportType: "",
    isActive: "1",
    FromAge: "",
    ToAge: "",
    MethodName: "",
    SampleType: "",
    SampleOption: "Sample Not Required",
    SampleQty: "",
    SampleRemarks: "",
    BaseRate: "",
    MaxRate: "",
    MicroReportType: "",
    Gender: "",
    BillingCategory: "1",
    AutoConsume: "",
    SampleContainer: "",
    LogisticTemp: "",
    IsMultipleDoctor: "",
    PrintCumulative: "",
    Reporting: "",
    PrintSampleName: "",
    Booking: "",
    showPatientReport: "",
    ShowAnalysisReport: "",
    OnlineReport: "",
    AutoSave: "",
    PrintSeparate: "",
    Urgent: "",
    IsOrganism: "",
    IsCultureReport: "",
    IsMic: "",
    IsOutSource: "",
    SampleDefined: "",
    SampleTypeID: "",
    RequiredAttachment: "",
    isMandatory: "",
    MethodName: "",
  });

  const { errors, handleBlur, touched, handleSubmit } = useFormik({
    initialValues: formData,
    enableReinitialize: state?.url ? true : true,
    validationSchema:
      formData?.DataType === "Profile"
        ? ProfileInvestigationsMasterSchema
        : InvestigationsMasterSchema,
    onSubmit: (values) => {
      setLoad(true);
      handleCheckDuplicate().then((res) => {
        if (res === "TestCode Already Exist..") {
        } else {
          axios
            .post(
              state?.url
                ? state?.url
                : "/api/v1/Investigations/CreateInvestigation",
              getTrimmedData({
                Observation: MapTestTableData,
                Investigation: [values],
              })
            )
            .then((res) => {
              if (res.data.message) {
                setLoad(false);
                navigate("/InvestigationsList");
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
        }
      });
    },
  });

  const Fetch = () => {
    if (state?.url1) {
      axios
        .get(state?.url1)
        .then((res) => {
          const data = res.data;
          setFormData(data?.InvDetails);
          setMapTestTableData(data?.ObservationData);
        })
        .catch((err) => console.log(err));
    }
  };

  const handleMultiSelect = (select, name) => {
    setSampleTypeID(select);
    let val = "";
    for (let i = 0; i < select.length; i++) {
      val = val === "" ? `${select[i].value}` : `${val},${select[i].value}`;
    }
    setFormData({ ...formData, [name]: val, SampleTypeID: select[0]?.value });
  };
  const handleSelectChange = (event) => {
    const { name, value, selectedIndex } = event?.target;
    const label = event?.target?.children[selectedIndex].text;
    if (name === "TestId") {
      const ItemIndex = MapTestTableData?.findIndex((e) => e.TestId === value);
      if (ItemIndex === -1) {
        setMapTestTableData([
          ...MapTestTableData,
          {
            TestId: value,
            TestName: label,
            TestPrefix: "",
            Header: 0,
            Critical: 0,
            AMR: "",
            Reflex: "",
            Comment: 0,
            Bold: 0,
            Underline: 0,
            PrintSeprate: 0,
            HelpValue: 0,
            dlcCheck: 0,
          },
        ]);
      } else {
        toast.error("Duplicate Test Found");
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleChanges = (e) => {
    const { name, value, checked, type } = e.target;
    if (name === "TestCode") {
      setFormData({
        ...formData,
        [name]: ["TestCode"].includes(name)
          ? PreventSpecialCharacter(value)
            ? value.trim().toUpperCase()
            : formData[name]
          : value.trim().toUpperCase(),
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
      });
    }
  };

  const getInvestigationList = () => {
    axios
      .get("/api/v1/Investigations/BindInvestigationList")
      .then((res) => {
        let data = res.data.message;
        setLoading(false);

        let MapTest = data.map((ele) => {
          return {
            value: ele.InvestigationID,
            label: ele.TestName,
          };
        });
        setMapTest(MapTest);
      })
      .catch((err) => console.log(err));
  };

  const getDepartment = () => {
    axios
      .get("/api/v1/Department/getDepartment")
      .then((res) => {
        let data = res.data.message;
        let DeptDataValue = data.map((ele) => {
          return {
            value: ele.DepartmentID,
            label: ele.Department,
          };
        });
        setDepartmentData(DeptDataValue);
      })
      .catch((err) => console.log(err));
  };
  const getLogisticTemp = () => {
    axios
      .get("/api/v1/Investigations/BindLogisticTemp")
      .then((res) => {
        let data = res.data.message;
        let LogisticTemp = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        return setLogisticTemp(LogisticTemp);
      })
      .catch((err) => console.log(err));
  };
  const getRequiredAttachment = () => {
    axios
      .post("/api/v1/Global/GetGlobalData", {
        Type: "RequiredAttachment",
      })
      .then((res) => {
        let data = res.data.message;
        let RequiredAttachment = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        return setRequiredAttachment(RequiredAttachment);
      })
      .catch((err) => console.log(err));
  };
  const getConcentForm = () => {
    axios
      .get("/api/v1/Investigations/BindConcentForm")
      .then((res) => {
        let data = res.data.message;
        let ConcentForm = data.map((ele) => {
          return {
            value: ele.ID,
            label: ele.ConcentFormName,
          };
        });
        return setConcentForm(ConcentForm);
      })
      .catch((err) => console.log(err));
  };
  const getSampleContainer = () => {
    axios
      .get("/api/v1/Global/BindSampleContainer")
      .then((res) => {
        let data = res.data.message;
        let SampleContainer = data.map((ele) => {
          return {
            value: ele.FieldDisplay,
            label: ele.FieldDisplay,
          };
        });
        return setSampleContainer(SampleContainer);
      })
      .catch((err) => console.log(err));
  };
  const getSampleType = () => {
    axios
      .get("/api/v1/SampleType/getSampleType")
      .then((res) => {
        let data = res.data.message;

        let SampleType = data.map((ele) => {
          return {
            value: ele.id,
            label: ele.SampleName,
          };
        });
        return setSampleType(SampleType);
      })
      .catch((err) => console.log(err));
  };
  const getBillingCategory = () => {
    axios
      .get("/api/v1/Investigations/BindBillingCategory")
      .then((res) => {
        let data = res.data.message;
        let BillingCategory = data.map((ele) => {
          return {
            value: ele.BillingCategoryId,
            label: ele.BillingCategoryName,
          };
        });
        return setBillingCategory(BillingCategory);
      })
      .catch((err) => console.log(err));
  };

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
          case "Gender":
            setGender(value);
            break;
        }
      })
      .catch((err) => console.log(err));
  };

  const handleCheckDuplicate = () => {
    if (formData?.TestCode.length > 0) {
      return new Promise((resolve, reject) => {
        axios
          .post("/api/v1/Investigations/checkDuplicateTestCode", {
            TestCode: formData?.TestCode,
            InvestigationID: formData?.InvestigationID
              ? formData?.InvestigationID
              : "",
          })
          .then((res) => {
            if (res?.data?.message === "TestCode Already Exist..") {
              toast.error(res?.data?.message);
              setFormData({ ...formData, TestCode: "" });
            }
            resolve(res?.data?.message);
          })
          .catch((err) => {
            toast.error(
              err?.response?.data?.message
                ? err?.response?.data?.message
                : "Error Occured"
            );
            setFormData({ ...formData, TestCode: "" });
            resolve(err?.response?.data?.message);
          });
      });
    }
  };

  const handleMapTestChange = (e, index) => {
    const { name, value, checked, type } = e.target;
    const data = [...MapTestTableData];
    data[index][name] = type === "checkbox" ? (checked ? 1 : 0) : value;
    setMapTestTableData(data);
  };

  const handleFilter = (index) => {
    const data = MapTestTableData.filter((ele, i) => index !== i);
    setMapTestTableData(data);
    toast?.success("Removed Successfully");
  };
  const dragItem = useRef();

  const dragStart = (e, position) => {
    dragItem.current = position;
  };
  const dragOverItem = useRef();
  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const drop = (e) => {
    const copyListItems = [...MapTestTableData];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setMapTestTableData(copyListItems);
  };

  useEffect(() => {
    if (formData?.DataType === "Package") {
      setFormData({ ...formData, DepartmentID: 36 });
    }
  }, [formData?.DataType]);

  useEffect(() => {
    getDropDownData("Gender");
    getDepartment();
    getSampleType();
    getLogisticTemp();
    getRequiredAttachment();
    getConcentForm();
    getSampleContainer();
    getBillingCategory();
    getInvestigationList();
    Fetch();
  }, []);
  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">Investigations</h3>
        </div>

        <div className="box-body">
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              DataType:
            </label>
            <div className="col-sm-2 ">
              <SelectBox
                onChange={handleSelectChange}
                selectedValue={formData?.DataType}
                options={DataType.filter((ele) => ele.value !== "")}
                name="DataType"
                isDisabled={state?.url1 ? true : false}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              TestCode:
            </label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                value={formData?.TestCode}
                type="text"
                placeholder={"TestCode"}
                onChange={handleChanges}
                name="TestCode"
                onBlur={handleCheckDuplicate}
                max={10}
              />
              {errors?.TestCode && touched?.TestCode && (
                <span className="field-validation-valid text-danger">
                  {errors?.TestCode}
                </span>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              TestName:
            </label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                value={formData?.TestName}
                placeholder={"TestName"}
                onChange={handleChanges}
                name="TestName"
                type="text"
                max={100}
                onBlur={handleBlur}
              />
              {errors?.TestName && touched?.TestName && (
                <span className="field-validation-valid text-danger">
                  {errors?.TestName}
                </span>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              Lab Report:
            </label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                value={formData?.PrintName}
                onChange={handleChanges}
                name="PrintName"
                type="text"
                max={100}
                onBlur={handleBlur}
                placeholder={"Lab Report(Test Name)"}
              />
              {errors?.PrintName && touched?.PrintName && (
                <span className="field-validation-valid text-danger">
                  {errors?.PrintName}
                </span>
              )}
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              Department
            </label>
            <div className="col-sm-2">
              <SelectBox
                options={DepartmentData}
                sele
                selectedValue={formData?.DepartmentID}
                onChange={handleSelectChange}
                isDisabled={formData?.DataType === "Package" ? true : false}
                name="DepartmentID"
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              ReportType
            </label>
            <div className="col-sm-2">
              <SelectBox
                options={ReportTypeNew}
                selectedValue={formData?.ReportType}
                name="ReportType"
                onChange={handleSelectChange}
              />
              {errors?.ReportType && touched?.ReportType && (
                <span className="field-validation-valid text-danger">
                  {errors?.ReportType}
                </span>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              Sam. Container
            </label>
            <div className="col-sm-2">
              <SelectBox
                options={SampleContainer}
                selectedValue={formData?.SampleContainer}
                name="SampleContainer"
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              Gender
            </label>
            <div className="col-sm-2">
              <SelectBox
                options={Gender}
                selectedValue={formData?.Gender}
                onChange={handleSelectChange}
                name="Gender"
              />
              {errors?.Gender && touched?.Gender && (
                <span className="field-validation-valid text-danger">
                  {errors?.Gender}
                </span>
              )}
            </div>
          </div>
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              Fr.Age(Days)
            </label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                onChange={handleChanges}
                placeholder={"FromAge(Days)"}
                value={formData?.FromAge}
                name="FromAge"
                onInput={(e) => number(e, 5)}
                type="number"
                onBlur={handleBlur}
              />
              {errors?.FromAge && touched?.FromAge && (
                <span className="field-validation-valid text-danger">
                  {errors?.FromAge}
                </span>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              ToAge(Days)
            </label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                onChange={handleChanges}
                placeholder={"ToAge(Days)"}
                value={formData?.ToAge}
                name="ToAge"
                onInput={(e) => number(e, 5)}
                type="number"
                onBlur={handleBlur}
              />
              {errors?.ToAge && touched?.ToAge && (
                <span className="field-validation-valid text-danger">
                  {errors?.ToAge}
                </span>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              Bill.Category
            </label>
            <div className="col-sm-2">
              <SelectBox
                options={BillingCategory}
                name="BillingCategory"
                selectedValue={formData?.BillingCategory}
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              Sam.Option
            </label>
            <div className="col-sm-2">
              <SelectBox
                selectedValue={formData?.SampleOption}
                options={SampleOption}
                name="SampleOption"
                onChange={handleSelectChange}
              />
            </div>
          </div>

          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              SampleQty
            </label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                onChange={handleChanges}
                value={formData?.SampleQty}
                placeholder={"SampleQty"}
                name="SampleQty"
                onBlur={handleBlur}
                type="number"
                onInput={(e) => number(e, 10)}
              />
              {errors?.SampleQty && touched?.SampleQty && (
                <span className="field-validation-valid text-danger">
                  {errors?.SampleQty}
                </span>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              Sam.Remarks
            </label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                onChange={handleChanges}
                placeholder={"SampleRemarks"}
                value={formData?.SampleRemarks}
                name="SampleRemarks"
                onBlur={handleBlur}
                type="text"
                max={50}
              />
              {errors?.SampleRemarks && touched?.SampleRemarks && (
                <span className="field-validation-valid text-danger">
                  {errors?.SampleRemarks}
                </span>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              LogisticTemp
            </label>
            <div className="col-sm-2">
              <SelectBox
                options={LogisticTemp}
                selectedValue={formData?.LogisticTemp}
                onChange={handleSelectChange}
                name="LogisticTemp"
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              SampleType
            </label>
            {/* Need Guildness this is SelectBoxWithCheckbox plz see in old code, class not working*/}
            <div className="col-sm-2  anotherClass">
              {/* <SelectBox
                options={SampleType}
                name="SampleType"
                // value={formData?.SampleType}
                selectedValue={formData?.SampleType}
                onChange={handleMultiSelect}
                depends={setSampleTypeID}
              />
              {errors?.SampleType && touched?.SampleType && (
                <span className="field-validation-valid text-danger">
                  {errors?.SampleType}
                </span>
              )} */}

              <SelectBoxWithCheckbox
                // className={"form-control input-sm"}
                options={SampleType}
                name="SampleType"
                selectedValue={formData?.SampleType}
                value={formData?.SampleType}
                onChange={handleMultiSelect}
                depends={setSampleTypeID}
              />
              {errors?.SampleType && touched?.SampleType && (
                <span className="field-validation-valid text-danger">
                  {errors?.SampleType}
                </span>
              )}

              {/* Need Guildness this is SelectBoxWithCheckbox plz see in old code, class not working*/}
            </div>
          </div>

          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              Sam.TypeID
            </label>
            <div className="col-sm-2">
              <SelectBox
                selectedValue={formData?.SampleTypeID}
                options={SampleTypeID}
                onChange={handleSelectChange}
                name="SampleTypeID"
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              ConcentForm
            </label>
            <div className="col-sm-2">
              <SelectBox
                options={ConcentForm}
                selectedValue={formData?.ConcentForm}
                onChange={handleSelectChange}
                name="ConcentForm"
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              BaseRate
            </label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                onChange={handleChanges}
                value={formData?.BaseRate}
                name="BaseRate"
                type="number"
                onBlur={handleBlur}
                onInput={(e) => number(e, 10)}
                placeholder={"BaseRate"}
              />
              {errors?.BaseRate && touched?.BaseRate && (
                <span className="field-validation-valid text-danger">
                  {errors?.BaseRate}
                </span>
              )}
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              MaxRate
            </label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                onChange={handleChanges}
                placeholder={"MaxRate"}
                value={formData?.MaxRate}
                name="MaxRate"
                type="number"
                onBlur={handleBlur}
                onInput={(e) => number(e, 10)}
              />
              {errors?.MaxRate && touched?.MaxRate && (
                <span className="field-validation-valid text-danger">
                  {errors?.MaxRate}
                </span>
              )}
            </div>
          </div>
          {/* Row End */}
          <div className="row">
            <label className="col-sm-1" htmlFor="inputEmail3">
              RQD Att.
            </label>
            <div className="col-sm-2">
              <SelectBox
                options={RequiredAttachment}
                selectedValue={formData?.RequiredAttachment}
                name="RequiredAttachment"
                onChange={handleSelectChange}
              />
            </div>
            <label className="col-sm-1" htmlFor="inputEmail3">
              MethodName
            </label>
            {formData?.DataType !== "Profile" && (
              <div className="col-sm-2">
                <Input
                  className="form-control ui-autocomplete-input input-sm"
                  placeholder={"MethodName"}
                  onChange={handleChanges}
                  max={15}
                  value={formData?.MethodName}
                  name="MethodName"
                  onBlur={handleBlur}
                />
                {errors?.MethodName && touched?.MethodName && (
                  <span className="field-validation-valid text-danger">
                    {errors?.MethodName}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className="row">
            <div className="col-sm-1 checkBox">
              <Input
                name="Reporting"
                className="control-label mr-4"
                type="checkbox"
                checked={formData?.Reporting}
                onChange={(e) => handleChanges(e)}
              />
              <label className="control-label" htmlFor="Reporting">
                Reporting
              </label>
            </div>
            <div className="col-sm-1 checkBox">
              <Input
                name="Booking"
                type="checkbox"
                checked={formData?.Booking}
                onChange={(e) => handleChanges(e)}
              />
              <label className="control-label" htmlFor="Booking">
                {" "}
                Booking
              </label>
            </div>
            <div className="col-sm-2 checkBox">
              <Input
                name="showPatientReport"
                type="checkbox"
                checked={formData?.showPatientReport}
                onChange={(e) => handleChanges(e)}
              />
              <label className="control-label" htmlFor="showPatientReport">
                ShowPatientReport
              </label>
            </div>
            <div className="col-sm-2 checkBox">
              <Input
                name="OnlineReport"
                type="checkbox"
                checked={formData?.OnlineReport}
                onChange={(e) => handleChanges(e)}
              />
              <label className="control-label" htmlFor="OnlineReport">
                OnlineReport
              </label>
            </div>
            <div className="col-sm-1 checkBox">
              <Input
                name="AutoSave"
                type="checkbox"
                checked={formData?.AutoSave}
                onChange={(e) => handleChanges(e)}
              />
              <label className="control-label" htmlFor="AutoSave">
                AutoSave
              </label>
            </div>
            <div className="col-sm-2 checkBox">
              <Input
                name="PrintSeparate"
                type="checkbox"
                checked={formData?.PrintSeparate}
                onChange={(e) => handleChanges(e)}
              />
              <label className="control-label" htmlFor="PrintSeparate">
                PrintSeparate
              </label>
            </div>
            <div className="col-sm-2 checkBox">
              <Input
                name="isMandatory"
                type="checkbox"
                checked={formData?.isMandatory}
                onChange={(e) => handleChanges(e)}
              />
              <label className="control-label" htmlFor="isMandatory">
                IsMandatory
              </label>
            </div>

            {state?.other?.showButton &&
              (formData?.DataType === "Profile" ||
                formData?.DataType === "Test") && (
                <div className="col-sm-2">
                  <Link
                    to="/InvestigationsInterpretion"
                    className="btn btn-success "
                    state={{
                      InvestigationID: formData?.InvestigationID,
                      url: "/api/v1/Investigations/SearchRangeInterpreation",
                      data: formData?.TestName,
                    }}
                  >
                    Test Interpretation
                  </Link>
                </div>
              )}

            {state?.other?.showButton && formData?.DataType === "Test" && (
              <>
                <div className="col-sm-2 col-md-2  mt-4">
                  <Link
                    to="/InvestigationsRange"
                    className="btn btn-success "
                    state={{
                      InvestigationID: formData?.InvestigationID,
                    }}
                  >
                    Reference Range
                  </Link>
                </div>

                <div className="col-sm-2 col-md-2 mt-4">
                  <Link
                    to="/RequiredFields"
                    className="btn btn-success "
                    state={{
                      url: "/api/v1/Investigations/RequiredFields",
                      data: formData?.InvestigationID,
                      TestName: formData?.TestName,
                    }}
                  >
                    Required Field
                  </Link>
                </div>

                <div className="col-sm-2 col-md-2 mt-4">
                  <Link
                    to="/HelpMenu"
                    className="btn btn-success "
                    state={{
                      data: formData,
                    }}
                  >
                    Help Menu
                  </Link>
                </div>
              </>
            )}

            <div className="col-sm-1 checkBox">
              <Input
                name="isActive"
                type="checkbox"
                checked={formData?.isActive}
                onChange={handleChanges}
              />
              <label className="control-label" htmlFor="isActive">
                Active
              </label>
            </div>
          </div>

          <div className="row">
            <div className="col-sm-1">
              {load ? (
                <Loading />
              ) : (
                <button
                  className="btn btn-block btn-success btn-sm"
                  type="button"
                  onClick={handleSubmit}
                >
                  {state?.other?.button ? state?.other?.button : "Save"}
                </button>
              )}
            </div>
            <div className="col-sm-1">
              <Link to="/InvestigationsList" style={{ fontSize: "13px" }}>
                Back to List
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Investigations;
