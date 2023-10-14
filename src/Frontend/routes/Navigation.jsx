import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { ProtectedRoute, HomeRouter } from "../util/ProtectedRoute";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BlankPage from "../Components/BlankPage";
import SampleCollection1 from "../Laboratory/SampleCollection1";
import SampleCollection from "../Lab/SampleCollection";
import LabPrescription from "../Laboratory/LabPrescription";
import LoginAdminLte from "../Login/LoginAdminLte";
import ForgetPassword from "../Login/ForgetPassword";
import CentrePanel from "../Master/CentrePanel";
import DiscountSetup from "../Master/DiscountSetup";
import CentreMaster from "../Master/CentreMaster";
import CentreMasterList from "../Master/CentreMasterList";
import IDMaster from "../Master/IDMaster";
import MicroBiologyMaster from "../Master/MicroBiologyMaster";
import MicroBiologyMasterMapping from "../Master/MicroBiologyMasterMapping";
import RateList from "../Master/RateList";
import BreakpointPage from "../Master/BreakpointPage";
import TestCentreMapping from "../Master/TestCentreMapping";
import OutSourceTestToOtherLab from "../Master/OutSourceTestToOtherLab";
import OutSourceTestMaster from "../Master/OutSourceTestMaster";
// import FieldBoyMaster from "../Master/FieldBoyMaster"
// import CreateFieldBoyMaster from "../Master/CreateFieldBoyMaster"
import PatientRegister from "../Lab/PatientRegister";
import BulkSettlement from "../Lab/BulkSettlement";
import ChangePaymentMode from "../Master/ChangePaymentMode";
import TransferMachineRanges from "../Master/TransferMachineRanges";
import TestAutoApproveMaster from "../Master/TestAutoApproveMaster";
import DiscountApproval from "../Master/DiscountApproval";
import RevertDiscountApprovalStatus from "../Master/RevertDiscountApprovalStatus";

import AgeWiseDiscount from "../../Frontend/Master/AgeWiseDiscount";
import AgeWiseDiscountList from "../../Frontend/Master/AgeWiseDiscountList";
import Designations from "../../Frontend/Master/Designations";
import DesignationsCreate from "../../Frontend/Master/DesignationsCreate";
import DoctorReferal from "../../Frontend/Master/DoctorReferal";
import ImportExportExcel from "../../Frontend/Master/ImportExportExcel";
import ExportFile from "../../Frontend/Master/ExportFile";
import DoctorReferalCreate from "../../Frontend/Master/DoctorReferalCreate";
// import OutSourceLabInvestigation from "../../Master/OutSourceLabInvestigation/OutSourceLabInvestigations";
import OutSourceLabInvestigations from "../../Frontend/Master/OutSourceLabInvestigations";
import SampleType from "../../Frontend/Master/SampleType";
import SampleTypeCreate from "../../Frontend/Master/SampleTypeCreate";
import ManageDeliveryDays from "../../Frontend/Master/ManageDeliveryDays";
import FormulaMaster from "../../Frontend/Master/FormulaMaster";
import LoadData from "../../Frontend/Master/LoadData";
import ReportBill from "../../Frontend/Master/ReportBill";
import TextEditor from "../Master/Report/TextEditor";
import ReprintPDF from "../Master/Report/ReprintPDF";
import HistoTemplate from "../Lab/HistoTemplate";
import ChangePanel from "../Lab/ChangePanel";
import ConcentFormMaster from "../Lab/ConcentFormMaster";
import CampMaster from "../Master/CampMaster";
import CampApprovalRightMaster from "../Master/CampApprovalRightMaster";
// import CentreMaster from "../../Frontend/Master/CentreMaster";
// import CentreMasterList from "../../Frontend/Master/CentreMasterList";
import ManageFieldMaster from "../../Frontend/Master/ManageFieldMaster";
import SetDoctorShare from "../Master/SetDoctorShare";
import DiscountMasterEmployeeWise from "../Master/DiscountMasterEmployeeWise";
import ChangeBarCode from "../Master/ChangeBarCode";
import ChangeDeliveryStatus from "../Lab/ChangeDeliveryStatus";
import DoctorMisReportPage from "../DoctorAccounting/DoctorMisReportPage";

import Departments from "../../Frontend/Master/Departments";
import Create from "../../Frontend/Master/Create";
import EditPage from "../../Frontend/Master/EditPage";
import PageMaster from "../../Frontend/Master/PageMaster";
import DoctorShareMaster from "../../Frontend/Master/DoctorShareMaster";
import DoctorTypeCopyShare from "../../Frontend/Master/DoctorTypeCopyShare";
import FieldBoyMaster from "../../Frontend/Master/FieldBoyMaster";
import CreateFieldBoyMaster from "../../Frontend/Master/CreateFieldBoyMaster";
import MachineMaster from "../../Frontend/Machine/MachineMaster";
import OutSourceTagging from "../../Frontend/Master/OutSourceTagging";
import InvalidContactNumber from "../../Frontend/Master/InvalidContactNumber";
import InvestigationCommentMaster from "../../Frontend/Master/InvestigationCommentMaster";
import InvestigationCommentMasterList from "../../Frontend/Master/InvestigationCommentMasterList";
import ApproveDispatch from "../../Frontend/Master/ApproveDispatch";
import CampConfigurationApproval from "../Master/CampConfigurationApproval";
import CampConfigurationMaster from "../Master/CampConfigurationMaster";
import ChangeSampleStatus from "../Master/ChangeSampleStatus";
import SingleBulkPanelChange from "../Lab/SingleBulkPanelChange";
import RateTypeCopyShare from "../Master/RateTypeCopyShare";
import CreateEmployeeMaster from "../Master/CreateEmployeeMaster";
import InvestigationRequiredMaster from "../Master/InvestigationRequiredMaster";
import RateTypeWiseItemLockMaster from "../Master/RateTypeWiseItemLockMaster";
import CallCenterRemark from "../Master/CallCenterRemark";
import ManageOrdering from "../Master/ManageOrdering";
import OutSourceLabMaster from "../Master/OutSourceLabMaster";
import ConcentForm from "../Master/ConcentForm";
import ChangePassword from "../Master/ChangePassword";
// import DoctorReferal from "../Master/DoctorReferal";
import ManageNablMaster from "../Master/ManageNablMaster";
import RateTypeShareMaster from "../Master/RateTypeShareMaster";
// import DoctorReferalCreate from "../Master/DoctorReferalCreate";
import EmployeeMaster from "../Master/EmployeeMaster";
import Machineparam from "../Machine/Machineparam";
import MachineReading from "../Machine/MachineReading";
import MachineGroup from "../Machine/MachineGroup";
import DepartmentReceive from "./../Lab/DepartmentReceive";
import ReceiptReprint from "./../Lab/ReceiptReprint";
import DispatchReport from "./../Lab/DispatchReport";
import ResultEntry from "./../Lab/ResultEntry";
import AdvancePayment from "./../Invoicing/AdvancePayment";
import InvoiceCreation from "./../Invoicing/InvoiceCreation";
import GetReport from "../Report/GetReport";
import InvestigationRange from "../Investigation/InvestigationRange";
import Investigations from "../Investigation/Investigations";
import InvestigationsList from "../Investigation/InvestigationsList";
import InvestigationsHelpMenu from "../Investigation/InvestigationsHelpMenu";
import InvestigationsInterpretion from "../Investigation/InvestigationsInterpretion";
import InvestigationsRequiredField from "../Investigation/InvestigationsRequiredField";
import RefundAfterBill from "../Lab/RefundAfterBill";
import DiscountAfterBill from "../Lab/DiscountAfterBill ";
import SendSampleToLab from "../Lab/SendSampleToLab";
import SettlementPatient from "../Lab/SettlementPatient";
import EditPatientDetails from "../Lab/EditPatientDetails";
import EditPatientInfo from "../Lab/EditPatientInfo";
import LandingPage from "../Lab/LandingPage";
import ValidatePayment from "../Invoicing/ValidatePayment";
import InvoiceReprint from "../Invoicing/InvoiceReprint";
import SpiltJSONDifference from "../Investigation/SpiltJSONDifference";
import ComingSoon from "../Components/ComingSoon";
import Dept from "./../../Pages/Dept";
import CreateDept from "./../../Pages/CreateDept";
import EditDeptPage from "./../../Pages/EditDeptPage";
import UpdateInvestigation from "../Investigation/UpdateInvestigation";
import GlobalTypeMaster from "../Master/GlobalTypeMaster";
import ViewGlobalMaster from "../Master/ViewGlobalMaster";
import CompanyMaster from "../../CompanyMaster/CompanyMaster";
import CompanyMasterList from "../../CompanyMaster/CompanyMasterList";
import DynamicLabSearch from "../Lab/DynamicLabSearch";
import ResultEntryCulture from "../Lab/ResultEntryCulture";
import SmsMaster from "../Master/SmsMaster";
import RouteMaster from "../../Frontend/HomeCollection/RouteMaster";
import PhelebotomistMapping from "../../Frontend/HomeCollection/PhelebotomistMapping";
import HomeCollectionSearch from "../HomeCollection/HomeCollectionSearch";
import CentreAppointmentSearch from "../HomeCollection/CentreAppointmentSearch";
import BillingCategoryMaster from "../Master/BillingCategoryMaster";
import CenterAccess from "../Master/CenterAccess";
import MergeDoctor from "../Master/MergeDoctor";
import CallCentre from "../HomeCollection/CallCentre";
import PheleBotomistRegisteration from "../HomeCollection/PheleBotomistRegsiteration";
import HomeCollectionLocationMaster from "../HomeCollection/HomeCollectionLocationMaster";
import PhlebotomistCallTransfer from "../HomeCollection/PhlebotomistCallTransfer";
import TemporaryPhelebotomist from "../HomeCollection/TemporaryPhelebotomist";
import ImportHomeCollectionMapping from "../HomeCollection/ImportHomeCollectionMapping";

import PhlebotomistHoliday from "../HomeCollection/PhlebotomistHoliday";
import HomeCollectionPatientEdit from "../HomeCollection/HomeCollectionPatientEdit";
import PhelboLoginDetails from "../HomeCollection/PhelboLoginDetails";
import HomeCollectionChangePhlebotomist from "../HomeCollection/HomeCollectionChangePhlebotomist";
import HomeCollectionChangeDropLocation from "../HomeCollection/HomeCollectionChangeDropLocation";
const Navigation = () => {
  return (
    <div>
      <BrowserRouter>
        <ToastContainer autoClose={1000} pauseOnFocusLoss={false} />
        <Routes>
          {/* before login routes */}
          <Route path="/" element={<HomeRouter />}>
            <Route path="/Login" element={<LoginAdminLte />} />
            <Route path="/forgotPassword" element={<ForgetPassword />} />
          </Route>

          {/* after login routes */}
          <Route path="/" element={<ProtectedRoute />}>
          <Route path="/HomeCollectionMapping" element={<ImportHomeCollectionMapping/>}/>
          <Route path="/PhelebotomistCallTransfer" element={<PhlebotomistCallTransfer/>}/>
           <Route path="/TemporaryPhelebotomist" element={<TemporaryPhelebotomist/>}/>
            <Route path="/CentreAppointmentSearch" element={<CentreAppointmentSearch/>}/>
            <Route path="/HomeCollectionLocationMaster" element={<HomeCollectionLocationMaster/>}/>
            <Route path="/HomeCollectionSearcH" element={<HomeCollectionSearch/>}/>
            <Route path='/PhelebotomistRegisteration' element={<PheleBotomistRegisteration/>}/>
            <Route path="/SampleCollection1" element={<SampleCollection1 />} />
            <Route path="/SampleCollection" element={<SampleCollection />} />
            <Route path="/DepartmentReceive" element={<DepartmentReceive />} />
            <Route path="/ReceiptReprint" element={<ReceiptReprint />} />
            <Route path="/DispatchReport" element={<DispatchReport />} />
            <Route path="/ResultEntry" element={<ResultEntry />} />
            <Route path="/AdvancePayment" element={<AdvancePayment />} />
            <Route path="/InvoiceCreation" element={<InvoiceCreation />} />
            <Route path="/Home" element={<LandingPage />} />
            <Route path="/LabPrescription" element={<LabPrescription />} />

            <Route path="/CentrePanel" element={<CentrePanel />} />
            <Route path="/DiscountSetup" element={<DiscountSetup />} />
            <Route path="/CentreMaster/:name" element={<CentreMaster />} />
            <Route
              path="/CentreMasterList/:name"
              element={<CentreMasterList />}
            />
            <Route path="/IDMaster" element={<IDMaster />} />
            <Route
              path="/MicroBiologyMaster"
              element={<MicroBiologyMaster />}
            />
            <Route
              path="/MicroBiologyMasterMapping"
              element={<MicroBiologyMasterMapping />}
            />
            <Route path="/RateList" element={<RateList />} />
            <Route path="/DynamicLabSearch" element={<DynamicLabSearch />} />
            <Route
              path="/ResultEntryCulture"
              element={<ResultEntryCulture />}
            />
            <Route path="/InvoiceReprint" element={<InvoiceReprint />} />
            <Route path="/ValidatePayment" element={<ValidatePayment />} />
            <Route path="/BreakpointPage" element={<BreakpointPage />} />
            <Route path="/TestMappingCenter" element={<TestCentreMapping />} />
            <Route
              path="/OutSourceTestToOtherLab"
              element={<OutSourceTestToOtherLab />}
            />
            <Route
              path="/OutSourceTestMaster"
              element={<OutSourceTestMaster />}
            />
            <Route path="/FieldBoyMaster" element={<FieldBoyMaster />} />
            <Route path="/EditPatientInfo" element={<EditPatientInfo />} />
            <Route
              path="/CreateFieldBoyMaster"
              element={<CreateFieldBoyMaster />}
            />
            <Route path="/patientregister" element={<PatientRegister />} />
            <Route path="/BulkSettlement" element={<BulkSettlement />} />
            <Route path="/Settlement/:id" element={<SettlementPatient />} />
            <Route path="/ChangePaymentMode" element={<ChangePaymentMode />} />
            <Route path="/SmsMaster" element={<SmsMaster />} />
            <Route
              path="/TransferMachineRanges"
              element={<TransferMachineRanges />}
            />
            <Route
              path="/TestAutoApproveMaster"
              element={<TestAutoApproveMaster />}
            />
            <Route path="/DiscountApproval" element={<DiscountApproval />} />
            <Route
              path="/RevertDiscountApprovalStatus"
              element={<RevertDiscountApprovalStatus />}
            />
            <Route path="/AgeWiseDiscount" element={<AgeWiseDiscount />} />
            <Route
              path="/AgeWiseDiscountList"
              element={<AgeWiseDiscountList />}
            />

            <Route path="/Designations" element={<Designations />} />
            <Route
              path="/DesignationsCreate"
              element={<DesignationsCreate />}
            />
            <Route path="/DoctorReferal" element={<DoctorReferal />} />
            <Route path="/ImportExportExcel" element={<ImportExportExcel />} />
            <Route path="/ExportFile" element={<ExportFile />} />
            <Route
              path="/DoctorReferalCreate"
              element={<DoctorReferalCreate />}
            />
            <Route
              path="/OutSourceLabInvestigations"
              element={<OutSourceLabInvestigations />}
            />
            <Route path="/ChangePassword" element={<ChangePassword />} />
            <Route path="/SampleType" element={<SampleType />} />
            <Route path="/SampleTypeCreate" element={<SampleTypeCreate />} />
            <Route
              path="/ManageDeliveryDays"
              element={<ManageDeliveryDays />}
            />
            <Route path="/GlobalTypeMaster" element={<GlobalTypeMaster />}/>
            <Route path="/ViewGlobalMaster" element={<ViewGlobalMaster />}/>
            <Route path="/FormulaMaster" element={<FormulaMaster />} />
            <Route path="/LoadData" element={<LoadData />} />
            <Route path="/ReportBill" element={<ReportBill />} />
            <Route path="/TextEditor" element={<TextEditor />} />
            <Route path="/HistoTemplate" element={<HistoTemplate />} />
            <Route path="/ChangePanel" element={<ChangePanel />} />
            <Route path="/ConcentFormMaster" element={<ConcentFormMaster />} />
            <Route path="/CampMaster" element={<CampMaster />} />
            <Route
              path="/CampApprovalRightMaster"
              element={<CampApprovalRightMaster />}
            />

            <Route path="/ManageFieldMaster" element={<ManageFieldMaster />} />
            {/* <Route path="/CentreMaster/center" element={<CentreMaster />} /> */}
            {/* <Route path="/CentreMasterList" element={<CentreMasterList />} /> */}
            <Route path="/setDoctor" element={<SetDoctorShare />} />
            <Route
              path="/DiscountMasterEmployeeWise"
              element={<DiscountMasterEmployeeWise />}
            />
            <Route path="/ChangeBarCode" element={<ChangeBarCode />} />
            <Route
              path="/ChangeDeliveryStatus"
              element={<ChangeDeliveryStatus />}
            />
            <Route
              path="/DoctorMisReportPage"
              element={<DoctorMisReportPage />}
            />
            <Route path="/MachineMaster" element={<MachineMaster />} />
            <Route path="/OutSourceTagging" element={<OutSourceTagging />} />
            <Route
              path="/InvalidContactNumber"
              element={<InvalidContactNumber />}
            />
            <Route
              path="/InvestigationCommentMaster"
              element={<InvestigationCommentMaster />}
            />
            <Route
              path="/InvestigationCommentMasterList"
              element={<InvestigationCommentMasterList />}
            />
            <Route path="/ApproveDispatch" element={<ApproveDispatch />} />
            <Route path="/Departments" element={<Departments />} />
            <Route path="/Create" element={<Create />} />
            <Route path="/EditPage" element={<EditPage />} />
            <Route path="/PageMaster" element={<PageMaster />} />
            <Route path="/DoctorShareMaster" element={<DoctorShareMaster />} />
            <Route
              path="/DoctorTypeCopyShare"
              element={<DoctorTypeCopyShare />}
            />
            <Route
              path="/ChangeSampleStatus"
              element={<ChangeSampleStatus />}
            />
            <Route
              path="/SingleBulkPanelChange"
              element={<SingleBulkPanelChange />}
            />
            <Route
              path="/CampConfigurationApproval"
              element={<CampConfigurationApproval />}
            />
            <Route
              path="/CampConfigurationMaster"
              element={<CampConfigurationMaster />}
            />
            <Route path="/ManageNabl" element={<ManageNablMaster />} />
            <Route path="/CallCenterRemark" element={<CallCenterRemark />} />
            <Route path="/ManageOrdering" element={<ManageOrdering />} />
            <Route path="Machineparams" element={<Machineparam />} />
            <Route path="MachineReading" element={<MachineReading />} />
            <Route path="/MachineGroup" element={<MachineGroup />} />
            <Route path="/SendSampleToLab" element={<SendSampleToLab />} />
            <Route
              path="/RateTypeWiseItemLockMaster"
              element={<RateTypeWiseItemLockMaster />}
            />

            <Route
              path="/RateTypeShareMaster"
              element={<RateTypeShareMaster />}
            />
            <Route path="Rate/:id" element={<RateTypeCopyShare />} />
            <Route
              path="/CreateDoctorReferal"
              element={<DoctorReferalCreate />}
            />

            <Route path="/EmployeeMaster" element={<EmployeeMaster />} />
            <Route
              path="/OutSourceLabMaster"
              element={<OutSourceLabMaster />}
            />
            <Route
              path="/CreateEmployeeMaster"
              element={<CreateEmployeeMaster />}
            />
            <Route path="/RouteMaster" element={<RouteMaster />} />

            <Route
              path="/PhelebotomistMapping"
              element={<PhelebotomistMapping />}
            />
	      <Route path="/CallCentre" element={<CallCentre />} />
            <Route
              path="/InvestigationRequiredMaster"
              element={<InvestigationRequiredMaster />}
            />
            <Route path="/ConcentForm" element={<ConcentForm />} />
            <Route path="/getReport/:id" element={<GetReport />} />
            <Route path="/HelpMenu" element={<InvestigationsHelpMenu />} />
            <Route
              path="/RequiredFields"
              element={<InvestigationsRequiredField />}
            />
            <Route
              path="/InvestigationsInterpretion"
              element={<InvestigationsInterpretion />}
            />
            <Route path="/Investigations" element={<Investigations />} />
            <Route
              path="/InvestigationRange"
              element={<InvestigationRange />}
            />
            
            <Route
              path="/InvestigationsList"
              element={<InvestigationsList />}
            />
            <Route path="/RefundAfterBill/:id" element={<RefundAfterBill />} />
            <Route
              path="/DiscountAfterBill/:id"
              element={<DiscountAfterBill />}
            />
            <Route
              path="/EditPatientDetails"
              element={<EditPatientDetails />}
            />
            <Route path="/JsonDifference" element={<SpiltJSONDifference />} />
            <Route
              path="/updateInvestigation"
              element={<UpdateInvestigation />}
            />
            <Route path="/Dept" element={<Dept />} />
            <Route path="/EditDeptPage" element={<EditDeptPage/>} />
            <Route path="/CreateDept" element={<CreateDept />} />
            <Route path="/CompanyMaster" element={<CompanyMaster />} />
            <Route path="/CompanyMasterList" element={<CompanyMasterList />} />
            <Route path="/BillingCategoryMaster" element={<BillingCategoryMaster />} />
            <Route path="/centerAccess" element={<CenterAccess />} />
            <Route path="/mergeDoctor" element={<MergeDoctor />} />
 <Route path="/HCPatientEdit" element={<HomeCollectionPatientEdit />} />
            <Route path="/HCPhlebotomistHoliday" element={<PhlebotomistHoliday />} />
            <Route path="/HCPhelboLoginDetails" element={<PhelboLoginDetails />} />
            <Route path="/HCImportHomeCollectionMapping" element={<ImportHomeCollectionMapping />} />
            <Route path="/HCChangePhlebotomist" element={<HomeCollectionChangePhlebotomist />} />
            <Route path="/HCChangeDropLocation" element={<HomeCollectionChangeDropLocation />} />
            <Route path="/centerAccess" element={<CenterAccess />} />
          </Route>
          <Route path="/*" element={<BlankPage />} />
          <Route path="/CommingSoon" element={<ComingSoon />} />
          <Route path="/ReprintPDF" element={<ReprintPDF />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Navigation;
