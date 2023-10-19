import moment from "moment";

export const fieldValidations = (text, type) => {
  switch (type) {
    case "email":
      let regEmail =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (text.value === "") {
        return "Email is required";
      } else if (!regEmail.test(text)) {
        return "invalid Email";
      }
  }
};

export const LocationUpdateSchema = (obj) => {
  let err = "";
  if (obj?.BusinessZoneID.trim() === "") {
    err = { ...err, BusinessZoneID: "This Field is Required" };
  }
  if (obj?.StateID.trim() === "") {
    err = { ...err, StateID: "This Field is Required" };
  }
  if (obj?.CityID.trim() === "") {
    err = { ...err, CityID: "This Field is Required" };
  }
  if (obj?.Locality.trim() === "") {
    err = { ...err, Locality: "This Field is Required" };
  }
  if (obj?.Pincode == "") {
    err = { ...err, Pincode: "This Field is Required" };
  }
  if (obj?.Pincode != "") {
    if (obj?.Pincode.trim().length != 6) {
      err = { ...err, PincodeLength: "Invalid Pincode" };
    }
  }
  return err;
};

export const PhelbotomistValidationSchema = (formData) => {
  let err = "";
  if (formData?.Name.trim() === "") {
    err = { ...err, Name: "This Field is Required" };
  }
  if (moment(formData?.Age).format("DD-MMM-YYYY") === "") {
    err = { ...err, Age: "This Field is Required" };
  }
  if (formData?.Mobile === "") {
    err = { ...err, Mobileempty: "This Field is Required" };
  }
  if (formData?.Mobile.length !== 10) {
    err = { ...err, Mobileinvalid: "Please enter valid number" };
  }
  if (formData?.Qualification.trim() === "") {
    err = { ...err, Qualification: "This Field is Required" };
  }
  // if (formData?.DeviceID.trim() === "") {
  //   err = { ...err, DeviceID: "This Field is Required" };
  // }
  if (formData?.Email.trim() === "") {
    err = { ...err, Emailempty: "This Field is Required" };
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData?.Email)) {
    err = { ...err, Emailvalid: "Enter a valid email address" };
  }

  if (formData?.Gender.trim() === "") {
    err = { ...err, Gender: "Select Gender" };
  }

  if (formData?.DocumentType.trim() === "") {
    err = { ...err, DocumentType: "Select Document Type" };
  }
  if (formData?.DocumentNo === "") {
    err = { ...err, DocumentNo: "This Field is Required" };
  }
  if (formData?.DocumentNo.length < 6) {
    err = { ...err, DocumentNolength: "Document No. too short" };
  }

  if (formData?.UserName.trim() === "") {
    err = { ...err, UserName: "This Field is Required" };
  }
  if (formData?.Password.trim() === "") {
    err = { ...err, Password: "This Field is Required" };
  }
  if (formData?.Password.trim().length <= 3) {
    err = { ...err, Passwordl: "Password length too short" };
  }
  if (formData?.PhelboSource.trim() === "") {
    err = { ...err, PhelboSource: "This Field is Required" };
  }

  if (formData?.StateId.length == 0) {
    err = { ...err, State: "Select atleast one State" };
  }
  if (formData?.CityId.length == 0) {
    err = { ...err, City: "Select atleast one City" };
  }
  if (formData?.LoginTime == "") {
    err = { ...err, LoginTime: "This Field is Required" };
  }
  if (formData?.LogoutTime == "") {
    err = { ...err, LogoutTime: "This Field is Required" };
  }
  if (formData?.P_Pincode != "") {
     
    if (formData?.P_Pincode?.length != 6) {
      err = { ...err, PincodeLength: "Invalid Pincode" };
    } 
  }
  if (formData?.PanNo != "") {
    if (formData?.PanNo?.length != 10) {
      err = { ...err, PanLength: "Invalid Pan No." };
    }
  }
  if (formData?.Other_Contact != "") {
    if (formData?.Other_Contact?.length != 10) {
      err = { ...err, OtherContact: "Invalid Phone no. " };
    }
  }
  return err;
};

export const Otpschema = (formData) => {
  let err = "";

  if (formData?.mobile === "") {
    err = { ...err, Mobileempty: "This Field is Required" };
  }
  if (formData?.mobile.length !== 10) {
    err = { ...err, Mobileinvalid: "Please enter valid number" };
  }
  return err;
};

export const PhelboAuthenticationSchema = (formData) => {
  let err = "";
  if (formData?.Name.trim() === "") {
    err = { ...err, Name: "This Field is Required" };
  }
  if (formData?.Gender.trim() === "") {
    err = { ...err, Gender: "Select Gender" };
  }

  if (formData?.P_Address.trim() === "") {
    err = { ...err, P_Address: "This Field is Required" };
  }

  if (formData?.DocumentNo.trim() === "") {
    err = { ...err, DocumentNo: "This Field is Required" };
  }
  if (formData?.StateId?.length == 0) {
    err = { ...err, State: "Select atleast one State" };
  }
  if (formData?.CityId?.length == 0) {
    err = { ...err, City: "Select atleast one City" };
  }
  {
    if (formData?.otp.length == 0) {
      err = { ...err, otp: "Enter Otp" };
    }
  }
  if (formData?.mobile === "") {
    err = { ...err, Mobileempty: "This Field is Required" };
  }
  if (formData?.mobile?.length !== 10) {
    err = { ...err, Mobileinvalid: "Please enter valid number" };
  }
  if (formData?.P_Pincode == "") {
    err = { ...err, Pincode: "This FIeld is Required" };
  }
  if (formData?.P_Pincode?.length != 6) {
    err = { ...err, PincodeInvalid: "Please enter valid pincode" };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(formData?.Email)) {
    err = { ...err, Emailvalid: "Enter a valid email address" };
  }
  return err;
};

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
export const validationForAgeWise = (formData) => {
  let err = "";
  if (formData?.DiscountType.trim() === "") {
    err = { ...err, DiscountType: "This Field is Required" };
  }
  if (["", "0"].includes(formData?.DiscountPer)) {
    err = { ...err, DiscountPer: "This Field is Required" };
  } else if (formData?.DiscountPer > 100) {
    err = { ...err, DiscountPer: "Enter Valid Discount" };
  }

  if (formData?.FromAge === "") {
    err = { ...err, FromAge: "This Field is Required" };
  } else if (formData?.FromAge > 110) {
    err = { ...err, FromAge: "Enter Valid Age" };
  }

  if (
    moment(formData?.FromValidityDate).format("DD-MM-YYYY") >
    moment(formData?.ToValidityDate).format("DD-MM-YYYY")
  ) {
    err = { ...err, ToValidityDate: "Invalid Date" };
  }

  if (formData?.ToAge === "") {
    err = { ...err, ToAge: "This Field is Required" };
  } else if (formData?.ToAge > 110) {
    err = { ...err, ToAge: "Enter Valid Age" };
  } else if (formData?.ToAge < formData?.FromAge) {
    err = { ...err, ToAge: " Must be equal or greater than FromAge" };
  }

  if (formData?.Gender === "") {
    err = { ...err, Gender: "Gender is Required" };
  }

  if (formData?.DiscountShareType === "") {
    err = { ...err, DiscountShareType: "DiscountShareType is Required" };
  }

  return err;
};

export const validationForIDMAster = (formData) => {
  let err = "";
  if (formData?.TypeName.trim() === "") {
    err = { ...err, TypeName: "This Field is Required" };
  }
  if (formData?.InitialChar.trim() === "") {
    err = { ...err, InitialChar: "This Field is Required" };
  }
  if (formData?.FinancialYearStart.trim() === "") {
    err = { ...err, FinancialYearStart: "This Field is Required" };
  }
  return err;
};

export const RouteMasterValidationSchema = (formData) => {
  let err = "";
  if (formData?.BusinessZoneId.trim() === "") {
    err = { ...err, BusinessZoneId: "This Field is Required" };
  }
  if (formData?.StateId.trim() === "") {
    err = { ...err, StateId: "This Field is Required" };
  }
  if (formData?.CityId.trim() === "") {
    err = { ...err, CityId: "This Field is Required" };
  }
  if (!formData?.Route || formData?.Route.trim() === "") {
    err = { ...err, Route: "This Field is Required" };
  }
  return err;
};
export const LocationMasterValidationSchema = (formData) => {
  let err = "";
  if (formData?.BusinessZoneID.trim() === "") {
    err = { ...err, BusinessZoneID: "This Field is Required" };
  }
  if (formData?.StateID.trim() === "") {
    err = { ...err, StateID: "This Field is Required" };
  }
  if (formData?.CityID.trim() === "") {
    err = { ...err, CityID: "This Field is Required" };
  }

  return err;
};
export const PhelebotomistMappingValdationSchema = (formData) => {
  let err = "";
  if (formData?.BusinessZoneId.trim() === "") {
    err = { ...err, BusinessZoneId: "This Field is Required" };
  }
  if (formData?.StateId.trim() === "") {
    err = { ...err, StateId: "This Field is Required" };
  }
  if (formData?.CityId.trim() === "") {
    err = { ...err, CityId: "This Field is Required" };
  }
  return err;
};
export const PhlebotomistMappingValdationSchema = (formData) => {
  const errors = {};

  if (!formData.BusinessZoneId || formData.BusinessZoneId.trim() === "") {
    errors.BusinessZoneId = "This Field is Required";
  }
  if (!formData.StateId || formData.StateId.trim() === "") {
    errors.StateId = "This Field is Required";
  }
  if (!formData.CityId || formData.CityId.trim() === "") {
    errors.CityId = "This Field is Required";
  }

  return errors;
};

export const NewPatientModalValidationSchema = (formData) => {
  let err = "";

  if (!formData.PName || formData.PName.trim() === "") {
    err = { ...err, PName: "This Field is Required" };
  }

  if (!formData.DOB || formData.DOB === "") {
    err = { ...err, DOB: "This Field is Required" };
  }

  if (!formData.StateID || formData.StateID.trim() === "") {
    err = { ...err, StateID: "This Field is Required" };
  }

  if (!formData.CityID || formData.CityID.trim() === "") {
    err = { ...err, CityID: "This Field is Required" };
  }

  if (!formData.LocalityID || formData.LocalityID.trim() === "") {
    err = { ...err, LocalityID: "This Field is Required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (formData?.Email.trim().length > 0 && !emailRegex.test(formData?.Email)) {
    err = { ...err, Emailvalid: "Please enter a valid email address" };
  }
 
  return err;
};
export const HandleHCBooking = (appointData) => {
  let err = "";
  if (!appointData.Alternatemobileno) {
    err = { ...err, Alternatemobilenos: "This Field is Required" };
  }
  if (appointData?.Alternatemobileno.length !== 10) {
    err = { ...err, Alternatemobilenum: "Please enter valid number" };
  }

  return err;
};
export const HandleHCEditBooking = (appointData) => {
  let err = "";
  if (!appointData.AlternateMobileNo) {
    err = { ...err, Alternatemobilenos: "This Field is Required" };
  }
  if (appointData?.AlternateMobileNo.length !== 10) {
    err = { ...err, Alternatemobilenum: "Please enter valid number" };
  }

  return err;
};
export const PreventSpecialCharacterandNumber = (value) => {
  const reg = /[^a-zA-Z ]/g;
  if (!reg.test(value)) {
    return true;
  } else {
    return false;
  }
};
export const AppointmentModalValidationSchema = (searchData) => {
  let err = "";
  if (!searchData.StateID) {
    err = { ...err, StateID: "This Field is Required" };
  }
  if (!searchData.CityID) {
    err = { ...err, CityID: "This Field is Required" };
  }

  if (!searchData.LocalityID) {
    err = { ...err, LocalityID: "This Field is Required" };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (searchData?.Email.trim().length > 0 && !emailRegex.test(searchData?.Email)) {
    err = { ...err, Emailvalid: "Please enter a valid email address" };
  }
  // if (!searchData.DropLocationId) {
  //   err = { ...err, DropLocationId: "Pick any DropLocation" };
  // }

  return err;
};
// export const PatientRegisterSchema = (formdata) => {
//   let err = {};
//   if (formdata?.Mobile === "") {
//     err = { ...err, Mobile: "This Field Required" };
//   }

//   return err;
// };

export const validationForDesignations = (formData) => {
  let err = "";
  if (formData?.Name.trim() === "") {
    err = { ...err, Name: "This Field is Required" };
  }
  if (formData?.SequenceNo === "") {
    err = { ...err, SequenceNo: "This Field is Required" };
  }
  return err;
};

export const validationForSampleType = (formData) => {
  let err = "";
  if (formData?.SampleName.trim() === "") {
    err = { ...err, SampleName: "This Field is Required" };
  }
  if (formData?.Container === "") {
    err = { ...err, Container: "This Field is Required" };
  }
  return err;
};

export const validationForMachineMaster = (payload) => {
  let err = "";
  if (payload?.MachineID.trim() === "") {
    err = { ...err, MachineID: "This Field is Required" };
  }
  if (payload?.MachineName === "") {
    err = { ...err, MachineName: "This Field is Required" };
  } else if (payload?.MachineName > 100) {
    err = { ...err, MachineName: "Enter Valid Machine Name" };
  }
  if (payload?.CentreID === "") {
    err = { ...err, CentreID: "Centre ID is Required" };
  }

  if (payload?.GlobalMachineID === "") {
    err = { ...err, GlobalMachineID: "Global Machine ID is Required" };
  }

  return err;
};

export const UpdatePatientValidation = (formData) => {
  let err = "";
  if (formData?.StateId === "") {
    err = { ...err, StateId: "This Field is Required" };
  }
  if (formData?.CityId === "") {
    err = { ...err, CityId: "This Field is Required" };
  }
  // if (formData?.LocalityId.trim() === "") {
  //   err = { ...err, LocalityId: "This Field is Required" };
  // }
  if (formData?.Pincode.trim() === "") {
    err = { ...err, Pincode: "This Field is Required" };
  }
  if (formData?.AgeYear === "") {
    err = { ...err, AgeYear: "This Field is Required" };
  }
  if (formData?.FirstName.trim() === "" || formData?.FirstName.length <= 4) {
    err = { ...err, FirstNameLength: "This Field is Required (min 3 letters)" };
  }
  if (!/^\D*$/.test(formData?.FirstName)) {
    err = { ...err, FirstNameNumber: "Should not contains number" };
  }
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (formData?.Email) {
    if (!emailPattern.test(formData?.Email)) {
      err = { ...err, Email: "Should be a valid email" };
    }
  }
  return err;
};

export const fileUpload = (formData) => {
  let err = "";
  if (!formData) {
    err = { ...err, name: "This Field is Required" };
    console.log(err);
  }
  return err;
};

export const loginDetailSearchValidation = (formData) => {
  let err = "";
  if (formData?.StateId.trim() === "") {
    err = { ...err, StateId: "This Field is Required" };
  }
  if (formData?.CityId === "") {
    err = { ...err, CityId: "This Field is Required" };
  }
  return err;
};

export const PhelboSaveHolidayValidationSchema = (formData) => {
  let err = "";
  if (formData?.StateId === "") {
    err = { ...err, StateId: "This Field is Required" };
  }
  if (formData?.CityId === "") {
    err = { ...err, CityId: "This Field is Required" };
  }
  if (formData?.Phlebotomist.trim() === "") {
    err = { ...err, Phlebotomist: "This Field is Required" };
  }
  if (formData?.FromDate === "") {
    err = { ...err, FromDate: "This Field is Required" };
  }
  if (formData?.ToDate === "") {
    err = { ...err, ToDate: "This Field is Required" };
  }
  return err;
};

export const PhelboSearchHolidayValidationSchema = (formData) => {
  let err = "";

  if (formData?.fromDate === "") {
    err = { ...err, fromDate: "This Field is Required" };
  }
  if (formData?.toDate === "") {
    err = { ...err, toDate: "This Field is Required" };
  }
  return err;
};

export const searchTempPhelboValidationSchema = (formData) => {
  let err = "";
  // if (formData?.StateId === "") {
  //   err = { ...err, StateId: "This Field is Required" };
  // }
  // if (formData?.CityId === "") {
  //   err = { ...err, CityId: "This Field is Required" };
  // }
  return err;
};

export const SupplierValidation = (formData) => {
  let err = "";
  const websiteRegex =
    /^(https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/i;
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (formData?.SupplierName.trim() === "") {
    err = { ...err, SupplierName: "This Field is Required" };
  } else if (formData?.SupplierName.length <= 4) {
    err = { ...err, SupplierName: "Min 4 Characters Required" };
  } else if (!/^\D*$/.test(formData?.SupplierName)) {
    err = { ...err, SupplierName: "Should not contains number" };
  }
  if (formData?.SupplierType === "") {
    err = { ...err, SupplierType: "This Field is Required" };
  }
  if (formData?.SupplierCategory.trim() === "") {
    err = { ...err, SupplierCategory: "This Field is Required" };
  }
  if (formData?.OrganizationType.trim() === "") {
    err = { ...err, OrganizationType: "This Field is Required" };
  }
  if (formData?.PinCode) {
    if (formData?.PinCode.length != 6) {
      err = { ...err, PinCode: "This Field is Required (6 Digits)" };
    }
  }
  if (formData?.EmailId) {
    if (!emailPattern.test(formData?.EmailId)) {
      err = { ...err, EmailId: "Should be a valid email" };
    }
  }
  if (formData?.Website) {
    if (!websiteRegex.test(formData?.Website)) {
      err = { ...err, Website: "Should be a valid website" };
    }
  }
  if (formData?.PrimaryContactPerson.length <= 4) {
    err = { ...err, PrimaryContactPerson: "Min 4 Characters Required" };
  } else if (!/^\D*$/.test(formData?.PrimaryContactPerson)) {
    err = { ...err, PrimaryContactPerson: "Should not contains number" };
  }
  if (formData?.PrimaryContactPersonMobileNo) {
    if (formData?.PrimaryContactPersonMobileNo.length != 10) {
      err = {
        ...err,
        PrimaryContactPersonMobileNo: "Should be a valid Number",
      };
    }
  }
  if (formData?.PrimaryContactPersonEmailId) {
    if (!emailPattern.test(formData?.PrimaryContactPersonEmailId)) {
      err = { ...err, PrimaryContactPersonEmailId: "Should be a valid email" };
    }
  }
  if (formData?.SecondaryContactPerson.length <= 4) {
    err = { ...err, SecondaryContactPerson: "Min 4 Characters Required" };
  } else if (!/^\D*$/.test(formData?.SecondaryContactPerson)) {
    err = { ...err, SecondaryContactPerson: "Should not contains number" };
  }
  if (formData?.SecondaryContactPersonMobileNo) {
    if (formData?.SecondaryContactPersonMobileNo.length != 10) {
      err = {
        ...err,
        SecondaryContactPersonMobileNo: "Should be a valid Number",
      };
    }
  }
  if (formData?.SecondaryContactPersonEmailId) {
    if (!emailPattern.test(formData?.SecondaryContactPersonEmailId)) {
      err = {
        ...err,
        SecondaryContactPersonEmailId: "Should be a valid email",
      };
    }
  }

  return err;
};
