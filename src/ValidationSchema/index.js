import axios from "axios";
import * as Yup from "yup";

export const LoginSchema = Yup.object({
  username: Yup.string().min(3).max(25).required("Please Enter Your Username"),
  password: Yup.string().min(6).required("Please Enter Your Password"),
});

export const DoctorSchema = Yup.object({
  Name: Yup.string().min(3).max(25).required("Please Enter Your Name"),
  Mobile: Yup.string()
    .typeError("That doesn't look like a phone number")
    .required("Phone number is required!")
    .min(10)
    .max(10),
  DoctorCode: Yup.string().min(3).required("Please Enter Your DoctorCode"),
});

export const ChangePasswordSchema = Yup.object({
  OldPassword: Yup.string()
    .required("Please Enter your old Password")
    .min(6)
    .trim("The contact name cannot include leading and trailing spaces"),
  NewPassword: Yup.string()
    .trim("The contact name cannot include leading and trailing spaces")
    .required("Please Enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
  ConfirmPassword: Yup.string()
    .trim("The contact name cannot include leading and trailing spaces")
    .required()
    .oneOf([Yup.ref("NewPassword"), null], "Passwords must match"),
});

export const DocotorReferal = Yup.object({
  DoctorCode: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Title: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Name: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Locality: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Zone: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Degree: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Specialization: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  ClinicName: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Email: Yup.string()
    .email()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Mobile: Yup.string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Phone number is not valid"
    )
    .required("This Field is Required"),
});

export const EmployeeMasterSchema = Yup.object({
  Title: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Name: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  HouseNo: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Pincode: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  City: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Mobile: Yup.string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Phone number is not valid"
    )
    .required("This Field is Required"),
  Email: Yup.string()
    .email()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  PCity: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  PPincode: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  PHouseNo: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  // Password: Yup.string().min(6).required("This Field is Required"),
  Department: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Centre: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  AccessRight: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  ApprovalRight: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  CentreID: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  DesignationID: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Username: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  isPassword: Yup.boolean(),
  Password: Yup.string().when("isPassword", (isPassword, schema) => {
    debugger;
    if (isPassword[0]) {
      return schema
        .required("Please Enter your password")
        .matches(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
          "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
        );
    }
    return schema;
  }),
});

export const InvestigationsMasterSchema = Yup.object().shape({
  TestCode: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  TestName: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  PrintName: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  SampleContainer: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  FromAge: Yup.number().required("This Field is Required"),
  ToAge: Yup.number()
    .required("This Field is Required")
    .test(
      "from-to-age",
      "To age must be greater than or equal to FromAge",
      function (value) {
        const { FromAge } = this.parent;
        return value >= FromAge;
      }
    ),
  ReportType: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Gender: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),

  DepartmentID: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),

  SampleQty: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  SampleRemarks: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  SampleType: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  BaseRate: Yup.number().required("This Field is Required"),
  MaxRate: Yup.number()
    .required("This Field is Required")
    .test(
      "MaxRate",
      "MaxRate must be greater than or equal to BaseRate",
      function (value) {
        const { BaseRate } = this.parent;
        return value >= BaseRate;
      }
    ),

  MethodName: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
});

export const ProfileInvestigationsMasterSchema = Yup.object().shape({
  TestCode: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  TestName: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  PrintName: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  SampleContainer: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  FromAge: Yup.number().required("This Field is Required"),
  ToAge: Yup.number()
    .required("This Field is Required")
    .test(
      "from-to-age",
      "To age must be greater than or equal to FromAge",
      function (value) {
        const { FromAge } = this.parent;
        return value >= FromAge;
      }
    ),
  ReportType: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Gender: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),

  DepartmentID: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),

  SampleQty: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  SampleRemarks: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  SampleType: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),

  BaseRate: Yup.number().required("BaseRate is required"),
  MaxRate: Yup.number()
    .required("This Field is Required")
    .test(
      "MaxRate",
      "MaxRate must be greater than or equal to BaseRate",
      function (value) {
        const { BaseRate } = this.parent;
        return value >= BaseRate;
      }
    ),
});

export const CenterMasterValidationSchema = Yup.object({
  CentreCode: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  Centre: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
});

export const RateMasterValidationSchema = Yup.object({
  CentreCode: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),

  Centre: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
});

export const OutSourceLabMasterValidationSchema = Yup.object({
  LabName: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  ContactPersonName: Yup.string()
    .required("This Field is Required")
    .trim("The contact name cannot include leading and trailing spaces"),
  MobileNo: Yup.string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Phone number is not valid"
    )
    .required("This Field is Required"),
});

export const PatientRegisterSchema = Yup.object({
  Mobile: Yup.string().min(10).required("This Field is Required"),
  FirstName: Yup.string()
    .required("This Field is Required")
    .min(3)
    .max(25)
    .trim(),
  DOB: Yup.date()
    .required("This Field is Required")
    .max(new Date(), "inValid Date"),
  DoctorID: Yup.string().required("This Field is Required"),
  DoctorName: Yup.string().required("This Field is Required"),
  Email: Yup.string().email(),
  // DiscountApprovedBy:Yup.string().when()
});

export const ForgetPasswordSchema = Yup.object({
  UserName: Yup.string()
    .required("This Field is Required")
    .min(3)
    .max(20)
    .trim(),
  Mobile: Yup.string()
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      "Phone number is not valid"
    )
    .required("This Field is Required"),
});

export const EnterOTP = Yup.object({
  OTP: Yup.string()
    .required("Please Enter Your OTP")
    .min(3)
    .max(20)
    .trim("The contact name cannot include leading and trailing spaces"),
  Password: Yup.string()
    .trim("The contact name cannot include leading and trailing spaces")
    .required("Please Enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
    ),
});

export const FieldMasterValidation = Yup.object({
  Name: Yup.string()
    .required("Please Enter Your Name")
    .min(3)
    .max(20)
    .trim("The contact name cannot include leading and trailing spaces"),
  Age: Yup.string()
    .required("Please Enter Your Name")
    .min(1)
    .max(3)
    .trim("The contact name cannot include leading and trailing spaces"),
  Mobile: Yup.string()
    .typeError("That doesn't look like a phone number")
    .required("Phone number is required!")
    .min(10)
    .max(10)
    .trim("The contact name cannot include leading and trailing spaces"),
});

// department(Create) page validation
export const validation = (formData) => {
  let err = "";
  if (formData?.Department.trim() === "") {
    err = { ...err, Department: "This Field is Required" };
  } else if (formData?.Department.length < 2) {
    err = { ...err, Department: "Must be 2 Character long" };
  }

  if (formData?.DepartmentCode.trim() === "") {
    err = { ...err, DepartmentCode: "This Field is Required" };
  } else if (formData?.DepartmentCode.length < 2) {
    err = { ...err, DepartmentCode: "Must be 2 Character long" };
  }

  return err;
};

export const HistoValidation = (payload) => {
  let err = "";
  if (payload?.Template_Name.trim() === "") {
    err = { ...err, Template_Name: "This Field is Required" };
  } else if (payload?.Template_Name.length < 2) {
    err = { ...err, Template_Name: "Must be 2 Character long" };
  }

  return err;
};

// end

export const checkEmploypeeWiseDiscount = (data, id) => {
  return new Promise((resolve, reject) => {
    axios
      .post("/api/v1//PatientRegistration/IsValidDiscountAmount", {
        TotalAmount: data?.GrossAmount,
        EmployeeID: id,
        CentreId: data?.CentreID,
        DiscountAmount: data?.DiscountOnTotal,
      })
      .then((res) => {
        resolve(false);
      })
      .catch((err) => {
        reject(err?.response?.data?.message);
      });
  });
};

// export const CompanyMasterValidation = (payload) => {
//   let err = "";
//   let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");
//   if (payload?.CompanyCode === "") {
//     err = { ...err, CompanyCode: "This Field is Required" };
//   } else if (payload?.CompanyCode.length < 2) {
//     err = { ...err, CompanyCode: "Must be 2 Character long" };
//   }

//   if (payload?.CompanyName === "") {
//     err = { ...err, CompanyName: "This Field is Required" };
//   } else if (payload?.CompanyName.length < 2) {
//     err = { ...err, CompanyName: "Must be 2 Character long" };
//   }

//   if (payload?.Email === "") {
//     err = { ...err, Email: "This Field is Required" };
//   } else if (!regex.test(payload?.Email)) {
//     err = { ...err, Email: "Please Enter Valid Email" };
//   }

//   const data = CompanyMasterMobile(payload?.Mobile);

//   if (data) {
//     err = { ...err, Mobile1: data };
//   }

//   return err;
// };

const CompanyMasterMobile = (mobile) => {
  debugger;
  let Mobile = [];
  for (let i = 0; i < mobile.length; i++) {
    if (mobile[i] === "") {
      Mobile[i] = "please Enter Mobile Number";
    } else if (mobile[i].length < 10) {
      Mobile[i] = "please Enter Valid Mobile Number";
    }
  }

  return Mobile.length > 0 && Mobile;
};

export const CompanyMasterValidation = Yup.object({
  CompanyCode: Yup.string()
    .required("Please Enter Company Code")
    .min(3)
    .trim("The contact name cannot include leading and trailing spaces"),
  CompanyName: Yup.string()
    .trim("The contact name cannot include leading and trailing spaces")
    .required("Please Enter Company Name"),
  Email: Yup.string()
    .trim("The contact name cannot include leading and trailing spaces")
    .required("Please Enter Email"),
  Mobile1: Yup.string()
    .min(10)
    .trim("The contact name cannot include leading and trailing spaces")
    .required("Please Enter Mobile1"),
  Mobile2: Yup.string()
    .min(10)
    .trim("The contact name cannot include leading and trailing spaces")
});

export const InvestigationRequiredMasterValidationF = Yup.object({
  FieldName: Yup.string()
    .required("Please Enter Company Code")
    .trim("The contact name cannot include leading and trailing spaces"),
  InputType: Yup.string()
    .required("Please Enter Company Code")
    .trim("The contact name cannot include leading and trailing spaces"),
});

export const PageMasterValidation = (payload) => {
  let errors = "";
  if (payload?.MenuID === "") {
    errors = { ...errors, MenuID: "This Field is Required" };
  }
  if (payload?.PageName.trim() === "") {
    errors = { ...errors, PageName: "This Field is Required" };
  } else if (payload?.PageName.length < 2) {
    errors = { ...errors, PageName: "Must be 2 Character long" };
  }
  if (payload?.Url.trim() === "") {
    errors = { ...errors, Url: "This Field is Required" };
  } else if (payload?.Url.length < 2) {
    errors = { ...errors, Url: "Must be 2 Character long" };
  }
  if (payload?.Priority.trim() === "") {
    errors = { ...errors, Priority: "This Field is Required" };
  }

  return errors;
};

export const InvestigationRequiredMastervalidation = (payload) => {
  let errors = "";
  if (payload?.InputType === "") {
    errors = { ...errors, InputType: "This Field is Required" };
  }
  return errors;
};
export const InvestigationCommentMasterValidation = (payload) => {
  let errors = "";
  if (payload?.InvestigationID === "") {
    errors = { ...errors, InvestigationID: "This Field is Required" };
  }
  return errors;
};
