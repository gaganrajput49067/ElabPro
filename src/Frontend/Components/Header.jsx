import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { getAccessCentres } from "../util/Commonservices";
import axios from "axios";
import i18n from "i18next";
import Input from "../../ChildComponents/Input";

const Header = () => {
  const [centreData, setCentreData] = useState([]);
  const [selectData, setSelectData] = useState(-1);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    axios
      .get("/api/v1/Users/logout")
      .then((res) => {
        window.sessionStorage.clear();
        navigate("/login");
        toast.success("Logout Successfully");
      })
      .catch((err) => {
        toast.error(err?.data?.message ? err?.data?.message : "Error Occured");
      });
  };
  const username = window.sessionStorage.getItem("Username");
  useEffect(() => {
    getGlobalCentres(setCentreData);
  }, []);

  const getGlobalCentres = (state, centreState, setCentreState) => {
    axios
      .get("/api/v1/Centre/getGlobalCentres")
      .then((res) => {
        let data = res.data.message;
        let CentreDataValue = data.map((ele) => {
          return {
            value: ele.CentreID,
            label: ele.Centre,
          };
        });
        state(CentreDataValue);
        if (centreState) {
          setCentreState({ ...centreState, CentreID: CentreDataValue[0]?.value });
        }
      })
      .catch((err) => {
        if (err.response.status === 401) {
          window.sessionStorage.clear();
          window.location.href = "/login";
        }
      });
  };

  const handleSelectChange = (e) => {
    const { value } = e.target;
    axios
      .post("/api/v1/Users/ChangeCentre", {
        CentreID: value,
      })
      .then((res) => {
        window.sessionStorage.setItem("DefaultCentre", value);
        window.location.reload();
      })
      .catch((err) =>
        toast.error(
          err?.data?.response?.message
            ? err?.data?.response?.message
            : "Error Occur"
        )
      );
  };

  const handlePatientLabSearch = (e) => {
    const { value } = e.target;
    const keypress = [9, 13];
    if (keypress.includes(e.which)) {
      if (value.trim() === "") {
        toast.error("Please enter Value");
        return;
      }
      e.preventDefault();
      navigate("/DynamicLabSearch", { state: { data: value.trim() } });
    }
  };

  useEffect(() => {
    i18n.changeLanguage(window?.localStorage?.getItem("language"));
  }, []);

  return (
    <div>
      <header className="main-header">
        <a href="#" className="logo">
          <span className="logo-mini">{process.env.REACT_APP_shortName}</span>

          <span className="logo-lg">
            <b>{process.env.REACT_APP_firstName}</b>
            {process.env.REACT_APP_lastName}
          </span>
        </a>

        <nav className="navbar navbar-static-top">
          <div className="row spaceBottom">
            <div className="col-xs-2 col-md-2 dddpp">
              <a
                href="#"
                className="sidebar-toggle"
                data-toggle="push-menu"
                role="button"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </a>
            </div>

            <div className="col-md-10 col-xs-10">
              <div className="navbar-custom-menu" style={{}}>
                <ul
                  className="nav navbar-nav"
                  style={{ display: "flex", paddingTop: "12px" }}
                >
                  <li
                    className="dropdown messages-menu"
                    style={{ display: "flex" }}
                  >
                    <SelectBox
                      options={centreData}
                      selectedValue={window.sessionStorage.getItem(
                        "DefaultCentre"
                      )}
                      onChange={handleSelectChange}
                      className="header-selectBox"
                      style={{ width: "100%" }}
                    />
                  </li>
                  <li style={{ marginLeft: "4px" }}>
                    <Input
                      className="header-selectBox"
                      name="LabNo"
                      type="text"
                      placeholder={"Visit No./BarCodeNo"}
                      style={{ width: "100%" }}
                      onKeyDown={(e) => handlePatientLabSearch(e, "LabNo")}
                    />
                  </li>
                  <li className="dropdown messages-menu">
                    <a
                      href="#"
                      className="dropdown-toggle"
                      data-toggle="dropdown"
                    >
                      <i className="fa fa-envelope-o"></i>
                      <span className="label label-success">4</span>
                    </a>
                    <ul className="dropdown-menu">
                      <li className="header">You have 4 messages</li>
                      <li>
                        <ul className="menu">
                          <li>
                            <a href="#">
                              <div className="pull-left">
                                <img
                                  src="/img/user.png"
                                  className="img-circle"
                                  alt="User Image"
                                />
                              </div>
                              <h4>
                                Support Team
                                <small>
                                  <i className="fa fa-clock-o"></i> 5 mins
                                </small>
                              </h4>
                              <p>Why not buy a new awesome theme?</p>
                            </a>
                          </li>

                      <li>
                        <a href="#">
                          <div className="pull-left">
                            <img
                              src="	https://adminlte.io/themes/AdminLTE/dist/img/user3-128x128.jpg"
                              className="img-circle"
                              alt="User Image"
                            />
                          </div>
                          <h4>
                            AdminLTE Design Team
                            <small>
                              <i className="fa fa-clock-o"></i> 2 hours
                            </small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div className="pull-left">
                            <img
                              src="https://adminlte.io/themes/AdminLTE/dist/img/user4-128x128.jpg"
                              className="img-circle"
                              alt="User Image"
                            />
                          </div>
                          <h4>
                            Developers
                            <small>
                              <i className="fa fa-clock-o"></i> Today
                            </small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div className="pull-left">
                            <img
                              src="https://adminlte.io/themes/AdminLTE/dist/img/user3-128x128.jpg"
                              className="img-circle"
                              alt="User Image"
                            />
                          </div>
                          <h4>
                            Sales Department
                            <small>
                              <i className="fa fa-clock-o"></i> Yesterday
                            </small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div className="pull-left">
                            <img
                              src="https://adminlte.io/themes/AdminLTE/dist/img/user4-128x128.jpg"
                              className="img-circle"
                              alt="User Image"
                            />
                          </div>
                          <h4>
                            Reviewers
                            <small>
                              <i className="fa fa-clock-o"></i> 2 days
                            </small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="footer">
                    <a href="#">See All Messages</a>
                  </li>
                </ul>
              </li>

                  <li className="dropdown notifications-menu">
                    <a
                      href="#"
                      className="dropdown-toggle"
                      data-toggle="dropdown"
                    >
                      <i className="fa fa-bell-o"></i>
                      <span className="label label-warning">10</span>
                    </a>
                    <ul className="dropdown-menu">
                      <li className="header">You have 10 notifications</li>
                      <li>
                        <ul className="menu">
                          <li>
                            <a href="#">
                              <i className="fa fa-users text-aqua"></i> 5 new
                              members joined today
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa fa-warning text-yellow"></i> Very
                              long description here that may not fit into the
                              page and may cause design problems
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa fa-users text-red"></i> 5 new
                              members joined
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa fa-shopping-cart text-green"></i>{" "}
                              25 sales made
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa fa-user text-red"></i> You
                              changed your username
                            </a>
                          </li>
                        </ul>
                      </li>
                      <li className="footer">
                        <a href="#">View all</a>
                      </li>
                    </ul>
                  </li>

                  <li className="dropdown tasks-menu dipApp">
                    <a
                      href="#"
                      className="dropdown-toggle"
                      data-toggle="dropdown"
                    >
                      <i className="fa fa-flag-o"></i>
                      <span className="label label-danger">9</span>
                    </a>
                    <ul className="dropdown-menu">
                      <li className="header">You have 9 tasks</li>
                      <li>
                        <ul className="menu">
                          <li>
                            <a href="#">
                              <h3>
                                Design some buttons
                                <small className="pull-right">20%</small>
                              </h3>
                              <div className="progress xs">
                                <div
                                  className="progress-bar progress-bar-aqua"
                                  style={{ width: "20%" }}
                                  role="progressbar"
                                  aria-valuenow="20"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                >
                                  <span className="sr-only">20% Complete</span>
                                </div>
                              </div>
                            </a>
                          </li>

                          <li>
                            <a href="#">
                              <h3>
                                Create a nice theme
                                <small className="pull-right">40%</small>
                              </h3>
                              <div className="progress xs">
                                <div
                                  className="progress-bar progress-bar-green"
                                  style={{ width: "40%" }}
                                  role="progressbar"
                                  aria-valuenow="20"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                >
                                  <span className="sr-only">40% Complete</span>
                                </div>
                              </div>
                            </a>
                          </li>

                          <li>
                            <a href="#">
                              <h3>
                                Some task I need to do
                                <small className="pull-right">60%</small>
                              </h3>
                              <div className="progress xs">
                                <div
                                  className="progress-bar progress-bar-red"
                                  style={{ width: "60%" }}
                                  role="progressbar"
                                  aria-valuenow="20"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                >
                                  <span className="sr-only">60% Complete</span>
                                </div>
                              </div>
                            </a>
                          </li>

                          <li>
                            <a href="#">
                              <h3>
                                Make beautiful transitions
                                <small className="pull-right">80%</small>
                              </h3>
                              <div className="progress xs">
                                <div
                                  className="progress-bar progress-bar-yellow"
                                  style={{ width: "80%" }}
                                  role="progressbar"
                                  aria-valuenow="20"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                >
                                  <span className="sr-only">80% Complete</span>
                                </div>
                              </div>
                            </a>
                          </li>
                        </ul>
                      </li>
                      <li className="footer">
                        <a href="#">View all tasks</a>
                      </li>
                    </ul>
                  </li>

                  <li className="dropdown user user-menu">
                    <a
                      href="#"
                      className="dropdown-toggle"
                      data-toggle="dropdown"
                    >
                      <img
                        src="/img/user.png"
                        className="user-image"
                        alt="User Image"
                      />
                      <span className="hidden-xs">{username}</span>
                    </a>
                    <ul className="dropdown-menu">
                      <li className="user-header">
                        <img
                          src="/img/user.png"
                          className="img-circle"
                          alt="User Image"
                        />
                        <p>{username}</p>
                      </li>

                      <li className="user-body">
                        <div className="row">
                          <div className="col-xs-4 text-center">
                            <a href="#">Followers</a>
                          </div>
                          <div className="col-xs-4 text-center">
                            <a href="#">Sales</a>
                          </div>
                          <div className="col-xs-4 text-center">
                            <a href="#">Friends</a>
                          </div>
                        </div>
                      </li>

                      <li className="user-footer">
                        <div className="pull-left">
                          <a href="#" className="btn btn-default btn-flat">
                            Profile
                          </a>
                        </div>
                        <div className="pull-right">
                          <div
                            className="btn btn-default btn-flat"
                            onClick={handleLogout}
                          >
                            Sign out
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <span href="#" onClick={handleLogout}>
                      <i
                        className="fa fa-sign-out"
                        style={{ color: "white" }}
                      ></i>
                    </span>
                  </li>
                </ul>
                {/* <ul className="nav navbar-nav">
                  <li className="dropdown messages-menu">
                    <a
                      href="#"
                      className="dropdown-toggle"
                      data-toggle="dropdown"
                    >
                      <i className="fa fa-envelope-o"></i>
                      <span className="label label-success">4</span>
                    </a>
                    <ul className="dropdown-menu">
                      <li className="header">You have 4 messages</li>
                      <li>
                        <ul className="menu">
                          <li>
                            <a href="#">
                              <div className="pull-left">
                                <img
                                  src="/img/user.png"
                                  className="img-circle"
                                  alt="User Image"
                                />
                              </div>
                              <h4>
                                Support Team
                                <small>
                                  <i className="fa fa-clock-o"></i> 5 mins
                                </small>
                              </h4>
                              <p>Why not buy a new awesome theme?</p>
                            </a>
                          </li>

                      <li>
                        <a href="#">
                          <div className="pull-left">
                            <img
                              src="	https://adminlte.io/themes/AdminLTE/dist/img/user3-128x128.jpg"
                              className="img-circle"
                              alt="User Image"
                            />
                          </div>
                          <h4>
                            AdminLTE Design Team
                            <small>
                              <i className="fa fa-clock-o"></i> 2 hours
                            </small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div className="pull-left">
                            <img
                              src="https://adminlte.io/themes/AdminLTE/dist/img/user4-128x128.jpg"
                              className="img-circle"
                              alt="User Image"
                            />
                          </div>
                          <h4>
                            Developers
                            <small>
                              <i className="fa fa-clock-o"></i> Today
                            </small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div className="pull-left">
                            <img
                              src="https://adminlte.io/themes/AdminLTE/dist/img/user3-128x128.jpg"
                              className="img-circle"
                              alt="User Image"
                            />
                          </div>
                          <h4>
                            Sales Department
                            <small>
                              <i className="fa fa-clock-o"></i> Yesterday
                            </small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div className="pull-left">
                            <img
                              src="https://adminlte.io/themes/AdminLTE/dist/img/user4-128x128.jpg"
                              className="img-circle"
                              alt="User Image"
                            />
                          </div>
                          <h4>
                            Reviewers
                            <small>
                              <i className="fa fa-clock-o"></i> 2 days
                            </small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="footer">
                    <a href="#">See All Messages</a>
                  </li>
                </ul>
              </li>

                  <li className="dropdown notifications-menu">
                    <a
                      href="#"
                      className="dropdown-toggle"
                      data-toggle="dropdown"
                    >
                      <i className="fa fa-bell-o"></i>
                      <span className="label label-warning">10</span>
                    </a>
                    <ul className="dropdown-menu">
                      <li className="header">You have 10 notifications</li>
                      <li>
                        <ul className="menu">
                          <li>
                            <a href="#">
                              <i className="fa fa-users text-aqua"></i> 5 new
                              members joined today
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa fa-warning text-yellow"></i> Very
                              long description here that may not fit into the
                              page and may cause design problems
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa fa-users text-red"></i> 5 new
                              members joined
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa fa-shopping-cart text-green"></i>{" "}
                              25 sales made
                            </a>
                          </li>
                          <li>
                            <a href="#">
                              <i className="fa fa-user text-red"></i> You
                              changed your username
                            </a>
                          </li>
                        </ul>
                      </li>
                      <li className="footer">
                        <a href="#">View all</a>
                      </li>
                    </ul>
                  </li>

                  <li className="dropdown tasks-menu">
                    <a
                      href="#"
                      className="dropdown-toggle"
                      data-toggle="dropdown"
                    >
                      <i className="fa fa-flag-o"></i>
                      <span className="label label-danger">9</span>
                    </a>
                    <ul className="dropdown-menu">
                      <li className="header">You have 9 tasks</li>
                      <li>
                        <ul className="menu">
                          <li>
                            <a href="#">
                              <h3>
                                Design some buttons
                                <small className="pull-right">20%</small>
                              </h3>
                              <div className="progress xs">
                                <div
                                  className="progress-bar progress-bar-aqua"
                                  style={{ width: "20%" }}
                                  role="progressbar"
                                  aria-valuenow="20"
                                  aria-valuemin="0"
                                  aria-valuemax="100"
                                >
                                  <span className="sr-only">20% Complete</span>
                                </div>
                              </div>
                            </a>
                          </li>

                      <li>
                        <a href="#">
                          <h3>
                            Create a nice theme
                            <small className="pull-right">40%</small>
                          </h3>
                          <div className="progress xs">
                            <div
                              className="progress-bar progress-bar-green"
                              style={{ width: "40%" }}
                              role="progressbar"
                              aria-valuenow="20"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              <span className="sr-only">40% Complete</span>
                            </div>
                          </div>
                        </a>
                      </li>

                      <li>
                        <a href="#">
                          <h3>
                            Some task I need to do
                            <small className="pull-right">60%</small>
                          </h3>
                          <div className="progress xs">
                            <div
                              className="progress-bar progress-bar-red"
                              style={{ width: "60%" }}
                              role="progressbar"
                              aria-valuenow="20"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              <span className="sr-only">60% Complete</span>
                            </div>
                          </div>
                        </a>
                      </li>

                      <li>
                        <a href="#">
                          <h3>
                            Make beautiful transitions
                            <small className="pull-right">80%</small>
                          </h3>
                          <div className="progress xs">
                            <div
                              className="progress-bar progress-bar-yellow"
                              style={{ width: "80%" }}
                              role="progressbar"
                              aria-valuenow="20"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              <span className="sr-only">80% Complete</span>
                            </div>
                          </div>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="footer">
                    <a href="#">View all tasks</a>
                  </li>
                </ul>
              </li>

                  <li className="dropdown user user-menu">
                    <a
                      href="#"
                      className="dropdown-toggle"
                      data-toggle="dropdown"
                    >
                      <img
                        src="/img/user.png"
                        className="user-image"
                        alt="User Image"
                      />
                      <span className="hidden-xs">{username}</span>
                    </a>
                    <ul className="dropdown-menu">
                      <li className="user-header">
                        <img
                          src="/img/user.png"
                          className="img-circle"
                          alt="User Image"
                        />
                        <p>{username}</p>
                      </li>

                      <li className="user-body">
                        <div className="row">
                          <div className="col-xs-4 text-center">
                            <a href="#">Followers</a>
                          </div>
                          <div className="col-xs-4 text-center">
                            <a href="#">Sales</a>
                          </div>
                          <div className="col-xs-4 text-center">
                            <a href="#">Friends</a>
                          </div>
                        </div>
                      </li>

                      <li className="user-footer">
                        <div className="pull-left">
                          <a href="#" className="btn btn-default btn-flat">
                            Profile
                          </a>
                        </div>
                        <div className="pull-right">
                          <div
                            className="btn btn-default btn-flat"
                            onClick={handleLogout}
                          >
                            Sign out
                          </div>
                        </div>
                      </li>
                    </ul>
                  </li>

                  <li>
                    <a href="#" onClick={handleLogout}>
                      <i className="fa fa-sign-out"></i>
                    </a>
                  </li>
                </ul> */}
              </div>
            </div>
          </div>
          {/* <a
            href="#"
            className="sidebar-toggle"
            data-toggle="push-menu"
            role="button"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </a> */}
          {/* <div className="navbar-custom-menu">
            <ul className="nav navbar-nav">
              <li className="dropdown messages-menu">
                <SelectBox
                  options={centreData}
                  value={data?.centreData}
                  onChange={handleSelectChange}
                  className="form-control"
                  style={{ width: "100%" }}
                />
              </li>
              <li className="dropdown messages-menu">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                  <i className="fa fa-envelope-o"></i>
                  <span className="label label-success">4</span>
                </a>
                <ul className="dropdown-menu">
                  <li className="header">You have 4 messages</li>
                  <li>
                    <ul className="menu">
                      <li>
                        <a href="#">
                          <div className="pull-left">
                            <img
                              src="/img/user.png"
                              className="img-circle"
                              alt="User Image"
                            />
                          </div>
                          <h4>
                            Support Team
                            <small>
                              <i className="fa fa-clock-o"></i> 5 mins
                            </small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>

                      <li>
                        <a href="#">
                          <div className="pull-left">
                            <img
                              src="	https://adminlte.io/themes/AdminLTE/dist/img/user3-128x128.jpg"
                              className="img-circle"
                              alt="User Image"
                            />
                          </div>
                          <h4>
                            AdminLTE Design Team
                            <small>
                              <i className="fa fa-clock-o"></i> 2 hours
                            </small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div className="pull-left">
                            <img
                              src="https://adminlte.io/themes/AdminLTE/dist/img/user4-128x128.jpg"
                              className="img-circle"
                              alt="User Image"
                            />
                          </div>
                          <h4>
                            Developers
                            <small>
                              <i className="fa fa-clock-o"></i> Today
                            </small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div className="pull-left">
                            <img
                              src="https://adminlte.io/themes/AdminLTE/dist/img/user3-128x128.jpg"
                              className="img-circle"
                              alt="User Image"
                            />
                          </div>
                          <h4>
                            Sales Department
                            <small>
                              <i className="fa fa-clock-o"></i> Yesterday
                            </small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <div className="pull-left">
                            <img
                              src="https://adminlte.io/themes/AdminLTE/dist/img/user4-128x128.jpg"
                              className="img-circle"
                              alt="User Image"
                            />
                          </div>
                          <h4>
                            Reviewers
                            <small>
                              <i className="fa fa-clock-o"></i> 2 days
                            </small>
                          </h4>
                          <p>Why not buy a new awesome theme?</p>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="footer">
                    <a href="#">See All Messages</a>
                  </li>
                </ul>
              </li>

              <li className="dropdown notifications-menu">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                  <i className="fa fa-bell-o"></i>
                  <span className="label label-warning">10</span>
                </a>
                <ul className="dropdown-menu">
                  <li className="header">You have 10 notifications</li>
                  <li>
                    <ul className="menu">
                      <li>
                        <a href="#">
                          <i className="fa fa-users text-aqua"></i> 5 new
                          members joined today
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-warning text-yellow"></i> Very
                          long description here that may not fit into the page
                          and may cause design problems
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-users text-red"></i> 5 new members
                          joined
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-shopping-cart text-green"></i> 25
                          sales made
                        </a>
                      </li>
                      <li>
                        <a href="#">
                          <i className="fa fa-user text-red"></i> You changed
                          your username
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="footer">
                    <a href="#">View all</a>
                  </li>
                </ul>
              </li>

              <li className="dropdown tasks-menu">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                  <i className="fa fa-flag-o"></i>
                  <span className="label label-danger">9</span>
                </a>
                <ul className="dropdown-menu">
                  <li className="header">You have 9 tasks</li>
                  <li>
                    <ul className="menu">
                      <li>
                        <a href="#">
                          <h3>
                            Design some buttons
                            <small className="pull-right">20%</small>
                          </h3>
                          <div className="progress xs">
                            <div
                              className="progress-bar progress-bar-aqua"
                              style={{ width: "20%" }}
                              role="progressbar"
                              aria-valuenow="20"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              <span className="sr-only">20% Complete</span>
                            </div>
                          </div>
                        </a>
                      </li>

                      <li>
                        <a href="#">
                          <h3>
                            Create a nice theme
                            <small className="pull-right">40%</small>
                          </h3>
                          <div className="progress xs">
                            <div
                              className="progress-bar progress-bar-green"
                              style={{ width: "40%" }}
                              role="progressbar"
                              aria-valuenow="20"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              <span className="sr-only">40% Complete</span>
                            </div>
                          </div>
                        </a>
                      </li>

                      <li>
                        <a href="#">
                          <h3>
                            Some task I need to do
                            <small className="pull-right">60%</small>
                          </h3>
                          <div className="progress xs">
                            <div
                              className="progress-bar progress-bar-red"
                              style={{ width: "60%" }}
                              role="progressbar"
                              aria-valuenow="20"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              <span className="sr-only">60% Complete</span>
                            </div>
                          </div>
                        </a>
                      </li>

                      <li>
                        <a href="#">
                          <h3>
                            Make beautiful transitions
                            <small className="pull-right">80%</small>
                          </h3>
                          <div className="progress xs">
                            <div
                              className="progress-bar progress-bar-yellow"
                              style={{ width: "80%" }}
                              role="progressbar"
                              aria-valuenow="20"
                              aria-valuemin="0"
                              aria-valuemax="100"
                            >
                              <span className="sr-only">80% Complete</span>
                            </div>
                          </div>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li className="footer">
                    <a href="#">View all tasks</a>
                  </li>
                </ul>
              </li>

              <li className="dropdown user user-menu">
                <a href="#" className="dropdown-toggle" data-toggle="dropdown">
                  <img
                    src="/img/user.png"
                    className="user-image"
                    alt="User Image"
                  />
                  <span className="hidden-xs">{username}</span>
                </a>
                <ul className="dropdown-menu">
                  <li className="user-header">
                    <img
                      src="/img/user.png"
                      className="img-circle"
                      alt="User Image"
                    />
                    <p>
                      {username}
                    </p>
                  </li>

                  <li className="user-body">
                    <div className="row">
                      <div className="col-xs-4 text-center">
                        <a href="#">Followers</a>
                      </div>
                      <div className="col-xs-4 text-center">
                        <a href="#">Sales</a>
                      </div>
                      <div className="col-xs-4 text-center">
                        <a href="#">Friends</a>
                      </div>
                    </div>
                  </li>

                  <li className="user-footer">
                    <div className="pull-left">
                      <a href="#" className="btn btn-default btn-flat">
                        Profile
                      </a>
                    </div>
                    <div className="pull-right">
                      <div
                        className="btn btn-default btn-flat"
                        onClick={handleLogout}
                      >
                        Sign out
                      </div>
                    </div>
                  </li>
                </ul>
              </li>

              <li>
                <a href="#" onClick={handleLogout}>
                  <i className="fa fa-sign-out"></i>
                </a>
              </li>
            </ul>
          </div> */}
        </nav>
      </header>
    </div>
  );
};

export default Header;