import axios from "axios";
import { toast } from "react-toastify";

export const getAccessCentresReports = (state) => {
  axios
    .get("/api/v1/Centre/getAccessCentres")
    .then((res) => {
      let data = res.data.message;
      console.log(data);
      let CentreDataValue = data.map((ele) => {
        return {
          value: ele.CentreID,
          label: ele.Centre,
        };
      });
      state(CentreDataValue);
    })
    .catch((err) => {
      toast.error(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : "Error Occured"
      );
    });
};

export const getDepartmentReports = (state) => {
  axios
    .get("/api/v1/Department/getDepartmentData")
    .then((res) => {
      let data = res.data.message;
      let DeptDataValue = data.map((ele) => {
        return {
          value: ele.DepartmentID,
          label: ele.Department,
        };
      });
      state(DeptDataValue);
    })
    .catch((err) => console.log(err));
};

export const BindApprovalDoctorReports = (state) => {
  axios
    .get("/api/v1/CommonController/GetReferalDoctorData")
    .then((res) => {
      let data = res.data.message;
      let doctorData = data.map((ele) => {
        return {
          value: ele?.DoctorReferalId,
          label: ele?.Name,
        };
      });
      state(doctorData);
    })
    .catch((err) => console.log(err));
};
export const BindEmployeeReports = (state) => {
  axios
    .post("/api/v1/Employee/getEmployeeDetails", {
      DesignationID: "",
      Name: "",
    })
    .then((res) => {
      let data = res.data.message;
      let EmployeeData = data.map((ele) => {
        return {
          value: ele?.EmployeeID,
          label: ele?.Name,
        };
      });
      state(EmployeeData);
    })
    .catch((err) => console.log(err));
};
