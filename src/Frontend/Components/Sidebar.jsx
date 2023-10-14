import axios from "axios";
import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const Sidebar = () => {
  const username = window.sessionStorage.getItem("Username");
  const location = useLocation();
  const [SidebarData, setSidebarData] = useState({});
  const [FilterData, setFilterData] = useState({});
  const [activeIndex, setActiveIndex] = useState(-1);

  const FetchData = () => {
    axios
      .get("/api/v1/Menu/MainMenuPageData")
      .then((res) => {
        setSidebarData(res?.data?.message);
        setFilterData(res?.data?.message);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
      });
  };

  const filterMenuData = (filter) => {
    let data = [];
    for (let i = 0; i < filter.length; i++) {
      data.push(filter[i]?.MenuID);
    }

    return data;
  };

  const handleFilter = (value) => {
    const val = SidebarData?.pageData.filter((ele) => {
      if (ele?.PageName.toLowerCase().includes(value.toLowerCase().trim())) {
        return ele;
      }
    });

    const menuData = SidebarData?.MenuData?.filter((ele) => {
      if (filterMenuData(val).includes(ele?.MenuID)) {
        return ele;
      }
    });
    if (value !== "") {
      return setFilterData({
        ...FilterData,
        pageData: val,
        MenuData: menuData,
      });
    } else {
      return setFilterData({
        ...FilterData,
        pageData: SidebarData?.pageData,
        MenuData: SidebarData?.MenuData,
      });
    }
  };

  useEffect(() => {
    if (SidebarData?.pageData && SidebarData?.MenuData) {
      document.getElementById("searchBox").value = "";
      handleFilter("");
    }
  }, [location?.pathname]);

  const handleChange = (e) => {
    const { value } = e.target;
    handleFilter(value);
  };

  useEffect(() => {
    FetchData();
  }, []);
  return (
    <div>
      <aside className="main-sidebar">
        <section className="sidebar" style={{ height: "auto" }}>
          <div className="user-panel">
            <div className="pull-left image">
              <img
                src="/img/user.png"
                className="img-circle"
                alt="User Image"
              />
            </div>
            <div className="pull-left info">
              <p>{username}</p>
              <a href="javascript:void(0);">
                <i className="fa fa-circle text-success"></i> Online
              </a>
            </div>
          </div>

          <form action="#" method="get" className="sidebar-form">
            <div className="input-group">
              <input
                type="text"
                id="searchBox"
                className="form-control"
                placeholder="Search..."
                onChange={handleChange}
              />
              <span className="input-group-btn">
                <button
                  type="submit"
                  name="search"
                  id="search-btn"
                  className="btn btn-flat"
                >
                  <i className="fa fa-search"></i>
                </button>
              </span>
            </div>
          </form>

          <ul className="sidebar-menu tree" data-widget="tree">
            <li className="header">MAIN NAVIGATION</li>
            {FilterData?.MenuData?.map((data, index) => (
              <li
                className={`treeview  ${
                  (document.getElementById("searchBox").value ||
                    activeIndex === index) &&
                  "menu-open"
                }`}
                key={index}
              >
                <a
                  href="javascript:void(0);"
                  onClick={() =>
                    setActiveIndex(activeIndex === index ? -1 : index)
                  }
                >
                  <i className="fa fa-dashboard"></i>
                  <span>{data?.MenuName}</span>
                  <span className="pull-right-container">
                    <i className="fa fa-angle-left pull-right"></i>
                  </span>
                </a>
                <ul
                  className="treeview-menu"
                  style={{
                    display:
                      (document.getElementById("searchBox").value ||
                        activeIndex === index) &&
                      "block",
                  }}
                >
                  {FilterData?.pageData?.map(
                    (ele, ind) =>
                      ele?.MenuID === data?.MenuID && (
                        <li key={ind}>
                          <NavLink
                            to={`${ele?.PageUrl}`}
                            state={
                              ele?.PageName === "EstimateSearch" && {
                                data: "EstimateSearch",
                              }
                            }
                          >
                            <i className="fa fa-circle-o"></i> {ele?.PageName}
                          </NavLink>
                        </li>
                      )
                  )}
                </ul>
              </li>
            ))}
            {/* <li className="treeview">
              <a href="#">
                <i className="fa fa-dashboard"></i> <span>Laboratory</span>
                <span className="pull-right-container">
                  <i className="fa fa-angle-left pull-right"></i>
                </span>
              </a>
              <ul className="treeview-menu">
                <li>
                  <a href="#">
                    <i className="fa fa-circle-o"></i> Dashboard v1
                  </a>
                </li>
                <li>
                  <Link to="/advancedelements">
                    <i className="fa fa-circle-o"></i> Add Elements
                  </Link>
                </li>

                <li>
                  <Link to="/patientregister">
                    <i className="fa fa-circle-o"></i> Patient Register
                  </Link>
                </li>

                <li>
                  <Link to="/SampleCollection">
                    <i className="fa fa-circle-o"></i> SampleCollection
                  </Link>
                </li>
                <li>
                  <Link to="/DepartmentReceive">
                    <i className="fa fa-circle-o"></i>Sample Receive
                  </Link>
                </li>

                <li>
                  <Link to="/receiptreprint">
                    <i className="fa fa-circle-o"></i> Reprint
                  </Link>
                </li>

                <li>
                  <Link to="/dispatchreport">
                    <i className="fa fa-circle-o"></i> Dispatch Report
                  </Link>
                </li>

                <li>
                  <Link to="/ResultEntry">
                    <i className="fa fa-circle-o"></i> Result Entry
                  </Link>
                </li>
              </ul>
            </li> */}

            {/* <li className="treeview">
              <a href="#">
                <i className="fa fa-dashboard"></i> <span>Master</span>
                <span className="pull-right-container">
                  <i className="fa fa-angle-left pull-right"></i>
                </span>
              </a>
              <ul className="treeview-menu">
                <li>
                  <Link to="/Departments">
                    <i className="fa fa-circle-o"></i> Departments
                  </Link>
                </li>
                <li>
                  <Link to="/AgeWiseDiscount">
                    <i className="fa fa-circle-o"></i> Age Wise Discount
                  </Link>
                </li>
                <li>
                  <Link to="/IDMaster">
                    <i className="fa fa-circle-o"></i>ID Master
                  </Link>
                </li>

                <li>
                  <Link to="/CentreMaster/center">
                    <i className="fa fa-circle-o"></i>Centre Master
                  </Link>
                </li>
                <li>
                  <Link to="/CentrePanel">
                    <i className="fa fa-circle-o"></i>Centre Panel
                  </Link>
                </li>
                <li>
                  <Link to="/CentreMaster/Rate">
                    <i className="fa fa-circle-o"></i>Rate Type Master
                  </Link>
                </li>

                <li>
                  <Link to="/Investigations">
                    <i className="fa fa-circle-o"></i>Investigations
                  </Link>
                </li>
                <li>
                  <Link to="/Designations">
                    <i className="fa fa-circle-o"></i> Designations
                  </Link>
                </li>
                <li>
                  <Link to="/ConcentForm">
                    <i className="fa fa-circle-o"></i> Concent Form
                  </Link>
                </li>
                <li>
                  <Link to="/ReportBill">
                    <i className="fa fa-circle-o"></i>Bill/Report Master
                  </Link>
                </li>

                <li>
                  <Link to="/ManageNabl">
                    <i className="fa fa-circle-o"></i>Mananage NABL
                  </Link>
                </li>
                <li>
                  <Link to="/OutSourceLabMaster">
                    <i className="fa fa-circle-o"></i>Out Source Lab Master
                  </Link>
                </li>
                <li>
                  <Link to="/OutSourceTagging">
                    <i className="fa fa-circle-o"></i>Out Source Tagging
                  </Link>
                </li>
                <li>
                  <Link to="/OutSourceLabInvestigations">
                    <i className="fa fa-circle-o"></i>Out Source Lab
                    Investigations
                  </Link>
                </li>
                <li>
                  <Link to="/DiscountSetup">
                    <i className="fa fa-circle-o"></i>DiscountSetup
                  </Link>
                </li>
                <li>
                  <Link to="/InvestigationCommentMaster">
                    <i className="fa fa-circle-o"></i>Investigation Comment
                    Master
                  </Link>
                </li>
                <li>
                  <Link to="/RateTypeShareMaster">
                    <i className="fa fa-circle-o"></i>Rate Type Share Master
                  </Link>
                </li>
                <li>
                  <Link to="/EmployeeMaster">
                    <i className="fa fa-circle-o"></i>Employee Master
                  </Link>
                </li>
                <li>
                  <Link to="/ManageDeliveryDays">
                    <i className="fa fa-circle-o"></i>Manage Delivery Days
                  </Link>
                </li>
                <li>
                  <Link to="/DoctorReferal">
                    <i className="fa fa-circle-o"></i>Doctor Referal
                  </Link>
                </li>

                <li>
                  <Link to="/SampleType">
                    <i className="fa fa-circle-o"></i> Sample Type
                  </Link>
                </li>

                <li>
                  <Link to="/GlobalTypeMaster">
                    <i className="fa fa-circle-o"></i>Global Type Master
                  </Link>
                </li>
                <li>
                  <Link to="/ManageFieldMAster">
                    <i className="fa fa-circle-o"></i>Manage Field Master
                  </Link>
                </li>
                <li>
                  <Link to="/InvestigationRequiredMaster">
                    <i className="fa fa-circle-o"></i>Investigation Required
                    Master
                  </Link>
                </li>

                <li>
                  <Link to="/TestMappingCenter">
                    <i className="fa fa-circle-o"></i>Test Mapping Center
                  </Link>
                </li>

                <li>
                  <Link to="/RateList">
                    <i className="fa fa-circle-o"></i>Rate List
                  </Link>
                </li>

                <li>
                  <Link to="/SendSample">
                    <i className="fa fa-circle-o"></i>Send Sample To Lab
                  </Link>
                </li>
                <li>
                  <Link to="/ChangePassword">
                    <i className="fa fa-circle-o"></i>Change Password
                  </Link>
                </li>
                <li>
                  <Link to="/ImportExportExcel">
                    <i className="fa fa-circle-o"></i>Import Export Excel
                  </Link>
                </li>

                <li>
                  <Link to="/SmsMaster">
                    <i className="fa fa-circle-o"></i>Sms Master
                  </Link>
                </li>

                <li>
                  <Link to="/FormulaMaster">
                    <i className="fa fa-circle-o"></i>Formula Master
                  </Link>
                </li>

                <li>
                  <Link to="/MenuMaster">
                    <i className="fa fa-circle-o"></i>Menu Master
                  </Link>
                </li>
                <li>
                  <Link to="/PageMaster">
                    <i className="fa fa-circle-o"></i>Page Master
                  </Link>
                </li>
              </ul>
            </li> */}
            {/* <li className="treeview">
              <a href="#">
                <i className="fa fa-files-o"></i>
                <span>Layout Options</span>
                <span className="pull-right-container">
                  <span className="label label-primary pull-right">4</span>
                </span>
              </a>
              <ul className="treeview-menu">
                <li>
                  <a href="../layout/top-nav.html">
                    <i className="fa fa-circle-o"></i> Top Navigation
                  </a>
                </li>
                <li>
                  <a href="../layout/boxed.html">
                    <i className="fa fa-circle-o"></i> Boxed
                  </a>
                </li>
                <li>
                  <a href="../layout/fixed.html">
                    <i className="fa fa-circle-o"></i> Fixed
                  </a>
                </li>
                <li>
                  <a href="../layout/collapsed-sidebar.html">
                    <i className="fa fa-circle-o"></i> Collapsed Sidebar
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a href="../widgets.html">
                <i className="fa fa-th"></i> <span>Widgets</span>
                <span className="pull-right-container">
                  <small className="label pull-right bg-green">new</small>
                </span>
              </a>
            </li>
            <li className="treeview">
              <a href="#">
                <i className="fa fa-pie-chart"></i>
                <span>Charts</span>
                <span className="pull-right-container">
                  <i className="fa fa-angle-left pull-right"></i>
                </span>
              </a>
              <ul className="treeview-menu">
                <li>
                  <a href="../charts/chartjs.html">
                    <i className="fa fa-circle-o"></i> ChartJS
                  </a>
                </li>
                <li>
                  <a href="../charts/morris.html">
                    <i className="fa fa-circle-o"></i> Morris
                  </a>
                </li>
                <li>
                  <a href="../charts/flot.html">
                    <i className="fa fa-circle-o"></i> Flot
                  </a>
                </li>
                <li>
                  <a href="../charts/inline.html">
                    <i className="fa fa-circle-o"></i> Inline charts
                  </a>
                </li>
              </ul>
            </li>
            <li className="treeview">
              <a href="#">
                <i className="fa fa-laptop"></i>
                <span>UI Elements</span>
                <span className="pull-right-container">
                  <i className="fa fa-angle-left pull-right"></i>
                </span>
              </a>
              <ul className="treeview-menu">
                <li>
                  <a href="../UI/general.html">
                    <i className="fa fa-circle-o"></i> General
                  </a>
                </li>
                <li>
                  <a href="../UI/icons.html">
                    <i className="fa fa-circle-o"></i> Icons
                  </a>
                </li>
                <li>
                  <a href="../UI/buttons.html">
                    <i className="fa fa-circle-o"></i> Buttons
                  </a>
                </li>
                <li>
                  <a href="../UI/sliders.html">
                    <i className="fa fa-circle-o"></i> Sliders
                  </a>
                </li>
                <li>
                  <a href="../UI/timeline.html">
                    <i className="fa fa-circle-o"></i> Timeline
                  </a>
                </li>
                <li>
                  <a href="../UI/modals.html">
                    <i className="fa fa-circle-o"></i> Modals
                  </a>
                </li>
              </ul>
            </li>
            <li className="treeview active menu-open">
              <a href="#">
                <i className="fa fa-edit"></i> <span>Forms</span>
                <span className="pull-right-container">
                  <i className="fa fa-angle-left pull-right"></i>
                </span>
              </a>
              <ul className="treeview-menu">
                <li>
                  <a href="general.html">
                    <i className="fa fa-circle-o"></i> General Elements
                  </a>
                </li>
                <li className="active">
                  <Link to="/advancedelements">
                    <i className="fa fa-circle-o"></i> Advanced Elements
                  </Link>
                </li>
                <li>
                  <a href="editors.html">
                    <i className="fa fa-circle-o"></i> Editors
                  </a>
                </li>
              </ul>
            </li>
            <li className="treeview">
              <a href="#">
                <i className="fa fa-table"></i> <span>Tables</span>
                <span className="pull-right-container">
                  <i className="fa fa-angle-left pull-right"></i>
                </span>
              </a>
              <ul className="treeview-menu">
                <li>
                  <a href="../tables/simple.html">
                    <i className="fa fa-circle-o"></i> Simple tables
                  </a>
                </li>
                <li>
                  <a href="../tables/data.html">
                    <i className="fa fa-circle-o"></i> Data tables
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a href="../calendar.html">
                <i className="fa fa-calendar"></i> <span>Calendar</span>
                <span className="pull-right-container">
                  <small className="label pull-right bg-red">3</small>
                  <small className="label pull-right bg-blue">17</small>
                </span>
              </a>
            </li>
            <li>
              <a href="../mailbox/mailbox.html">
                <i className="fa fa-envelope"></i> <span>Mailbox</span>
                <span className="pull-right-container">
                  <small className="label pull-right bg-yellow">12</small>
                  <small className="label pull-right bg-green">16</small>
                  <small className="label pull-right bg-red">5</small>
                </span>
              </a>
            </li>
            <li className="treeview">
              <a href="#">
                <i className="fa fa-folder"></i> <span>Examples</span>
                <span className="pull-right-container">
                  <i className="fa fa-angle-left pull-right"></i>
                </span>
              </a>
              <ul className="treeview-menu">
                <li>
                  <a href="../examples/invoice.html">
                    <i className="fa fa-circle-o"></i> Invoice
                  </a>
                </li>
                <li>
                  <a href="../examples/profile.html">
                    <i className="fa fa-circle-o"></i> Profile
                  </a>
                </li>
                <li>
                  <Link to="/login">
                    <i className="fa fa-circle-o"></i> Login
                  </Link>
                </li>
                <li>
                  <a href="../examples/register.html">
                    <i className="fa fa-circle-o"></i> Register
                  </a>
                </li>
                <li>
                  <a href="../examples/lockscreen.html">
                    <i className="fa fa-circle-o"></i> Lockscreen
                  </a>
                </li>
                <li>
                  <a href="../examples/404.html">
                    <i className="fa fa-circle-o"></i> 404 Error
                  </a>
                </li>
                <li>
                  <a href="../examples/500.html">
                    <i className="fa fa-circle-o"></i> 500 Error
                  </a>
                </li>
                <li>
                  <Link to="/blankpage">
                    <i className="fa fa-circle-o"></i> Blank Page
                  </Link>
                </li>
                <li>
                  <a href="../examples/pace.html">
                    <i className="fa fa-circle-o"></i> Pace Page
                  </a>
                </li>
              </ul>
            </li>
            <li className="treeview">
              <a href="#">
                <i className="fa fa-share"></i> <span>Multilevel</span>
                <span className="pull-right-container">
                  <i className="fa fa-angle-left pull-right"></i>
                </span>
              </a>
              <ul className="treeview-menu">
                <li>
                  <a href="#">
                    <i className="fa fa-circle-o"></i> Level One
                  </a>
                </li>
                <li className="treeview">
                  <a href="#">
                    <i className="fa fa-circle-o"></i> Level One
                    <span className="pull-right-container">
                      <i className="fa fa-angle-left pull-right"></i>
                    </span>
                  </a>
                  <ul className="treeview-menu">
                    <li>
                      <a href="#">
                        <i className="fa fa-circle-o"></i> Level Two
                      </a>
                    </li>
                    <li className="treeview">
                      <a href="#">
                        <i className="fa fa-circle-o"></i> Level Two
                        <span className="pull-right-container">
                          <i className="fa fa-angle-left pull-right"></i>
                        </span>
                      </a>
                      <ul className="treeview-menu">
                        <li>
                          <a href="#">
                            <i className="fa fa-circle-o"></i> Level Three
                          </a>
                        </li>
                        <li>
                          <a href="#">
                            <i className="fa fa-circle-o"></i> Level Three
                          </a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">
                    <i className="fa fa-circle-o"></i> Level One
                  </a>
                </li>
              </ul>
            </li>
            <li>
              <a href="https://adminlte.io/docs">
                <i className="fa fa-book"></i> <span>Documentation</span>
              </a>
            </li>
            <li className="header">LABELS</li>
            <li>
              <a href="#">
                <i className="fa fa-circle-o text-red"></i>{" "}
                <span>Important</span>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa fa-circle-o text-yellow"></i>
                <span>Warning</span>
              </a>
            </li>
            <li>
              <a href="#">
                <i className="fa fa-circle-o text-aqua"></i>
                <span>Information</span>
              </a>
            </li> */}
          </ul>
        </section>
      </aside>
    </div>
  );
};

export default Sidebar;
