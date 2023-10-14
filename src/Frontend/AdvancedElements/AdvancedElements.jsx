import React, { useState } from "react";
import "../../Global.css";
import { SelectBox } from "../../ChildComponents/SelectBox";
import InputMasks from "../../ChildComponents/InputMasks";
import {
  DatePickers,
  DatePickerTwo,
  DateRangerNew,
} from "../../ChildComponents/DatePicker";
import moment from "moment";
import {
  CustomCheckBox,
  CustomRadioBox,
  SimpleCheckbox,
} from "../../ChildComponents/CheckBox";

const AdvancedElements = () => {
  const [select, setSelect] = useState(false);
  const [select1, setSelect1] = useState(false);
  const [date, setDate] = useState(false);
  const [select2, setSelect2] = useState(null);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  ]);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: null,
    key: "selection",
  });

  const handleSelect = (ranges) => {
    setSelectionRange({
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
      key: "selection",
    });
    setSelect(false);
  };
  const handleChange = (data) => {
   
    setState(data);
    setSelect1(false);
  };

  const dateSelect = (date) => {
    setSelect2(date);
  };
  return (
    <div>
      <div
        className="content-wrapper"
        style={{ minHeight: "955.604px" }}
        data-select2-id="18"
      >
        <section className="content-header">
          <h1>
            Advanced Form Elements
            <small>Preview</small>
          </h1>
          <ol className="breadcrumb">
            <li>
              <a href="#">
                <i className="fa fa-dashboard"></i> Home
              </a>
            </li>
            <li>
              <a href="#">Forms</a>
            </li>
            <li className="active">Advanced Elements</li>
          </ol>
        </section>

        <section className="content" data-select2-id="17">
          <div className="box box-default" data-select2-id="16">
            <div className="box-header with-border">
              <h3 className="box-title">Select2</h3>
              <div className="box-tools pull-right">
                <button
                  type="button"
                  className="btn btn-box-tool"
                  data-widget="collapse"
                >
                  <i className="fa fa-minus"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-box-tool"
                  data-widget="remove"
                >
                  <i className="fa fa-remove"></i>
                </button>
              </div>
            </div>

            <div className="box-body" data-select2-id="15">
              <div className="row">
                <div className="col-md-6" data-select2-id="14">
                  <div className="form-group" data-select2-id="13">
                    <label>Minimal</label>
                    <SelectBox />
                  </div>

                  <div className="form-group">
                    <label>Disabled</label>
                    <SelectBox isDisabled={true} />
                  </div>
                </div>

                <div className="col-md-6" data-select2-id="30">
                  <div className="form-group" data-select2-id="29">
                    <label>Multiple</label>
                    <SelectBox isMulti={true} />
                  </div>

                  <div className="form-group" data-select2-id="39">
                    <label>Disabled Result</label>
                    <SelectBox />
                  </div>
                </div>
              </div>
            </div>

            <div className="box-footer">
              Visit
              <a href="https://select2.github.io/">Select2 documentation</a>
              for more examples and information about the plugin.
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <div className="box box-danger">
                <div className="box-header">
                  <h3 className="box-title">Input masks</h3>
                </div>
                <div className="box-body">
                  <div className="form-group">
                    <label>Date masks:</label>
                    <div className="input-group">
                      <div className="input-group-addon">
                        <i className="fa fa-calendar"></i>
                      </div>
                      <InputMasks
                        marks={"99/99/9999"}
                        placeholder={"dd/mm/yyyy"}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <div className="input-group">
                      <div className="input-group-addon">
                        <i className="fa fa-calendar"></i>
                      </div>
                      <InputMasks
                        marks={"99/99/9999"}
                        placeholder={"dd/mm/yyyy"}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>US phone mask:</label>
                    <div className="input-group">
                      <div className="input-group-addon">
                        <i className="fa fa-phone"></i>
                      </div>
                      <InputMasks
                        marks={"(999) 999-9999"}
                        placeholder={"(___) ___-____"}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Intl US phone mask:</label>
                    <div className="input-group">
                      <div className="input-group-addon">
                        <i className="fa fa-phone"></i>
                      </div>
                      <InputMasks
                        marks={"999-999-9999 x99999"}
                        placeholder={"___-___-____ x_____"}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>IP mask:</label>
                    <div className="input-group">
                      <div className="input-group-addon">
                        <i className="fa fa-laptop"></i>
                      </div>
                      <InputMasks
                        marks={"999.999.999.999"}
                        placeholder={"___.___.___.___"}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="box box-info">
                <div className="box-header">
                  <h3 className="box-title">Color &amp; Time Picker</h3>
                </div>
                <div className="box-body">
                  <div className="form-group">
                    <label>Color picker:</label>
                    <input
                      type="text"
                      className="form-control my-colorpicker1 colorpicker-element"
                    />
                  </div>

                  <div className="form-group">
                    <label>Color picker with addon:</label>
                    <div className="input-group my-colorpicker2 colorpicker-element">
                      <input type="text" className="form-control" />
                      <div className="input-group-addon">
                        <i></i>
                      </div>
                    </div>
                  </div>

                  <div className="bootstrap-timepicker">
                    <div className="form-group">
                      <label>Time picker:</label>
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control timepicker"
                        />
                        <div className="input-group-addon">
                          <i className="fa fa-clock-o"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="box box-primary">
                <div className="box-header">
                  <h3 className="box-title">Date picker</h3>
                </div>
                <div className="box-body">
                  <div className="form-group">
                    <label>Date:</label>
                    <div className="input-group date">
                      <div className="input-group-addon">
                        <i className="fa fa-calendar"></i>
                      </div>
                      <span
                        type="text"
                        className="form-control pull-right"
                        id="reservation"
                        onClick={() => {
                          setDate(!date);
                        }}
                      >
                        {select2 && moment(select2).format("MM/DD/YYYY")}
                      </span>
                    </div>
                    <div className="calendra-new">
                      {date && (
                        <DatePickers
                          dateSelect={dateSelect}
                          select2={select2}
                        />
                      )}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Date range:</label>
                    <div className="input-group">
                      <div className="input-group-addon">
                        <i className="fa fa-calendar"></i>
                      </div>
                      <span
                        type="text"
                        className="form-control pull-right"
                        id="reservation"
                        onClick={() => {
                          setSelect1(!select1);
                        }}
                      >
                        {state[0].endDate &&
                          moment(state[0].startDate).format("MM/DD/YYYY") +
                            " - " +
                            moment(state[0].endDate).format("MM/DD/YYYY")}
                      </span>
                    </div>
                    {select1 && (
                      <div className="dateRanger">
                        <DateRangerNew
                          handleChange={handleChange}
                          state={state}
                        />
                      </div>
                    )}
                  </div>

                  <div className="form-group">
                    <label>Date and time range:</label>
                    <div className="input-group">
                      <div className="input-group-addon">
                        <i className="fa fa-clock-o"></i>
                      </div>
                      <input
                        type="text"
                        className="form-control pull-right"
                        id="reservationtime"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Date range button:</label>
                    <div className="input-group">
                      <button
                        type="button"
                        className="btn btn-default pull-right"
                        id="daterange-btn"
                        onClick={() => {
                          setSelect(!select);
                        }}
                      >
                        <span>
                          <i className="fa fa-calendar"></i>
                          {selectionRange.endDate
                            ? moment(selectionRange.startDate).format(
                                "MM/DD/YYYY"
                              ) +
                              " - " +
                              moment(selectionRange.endDate).format(
                                "MM/DD/YYYY"
                              )
                            : " Date range picker"}
                        </span>
                        <i className="fa fa-caret-down"></i>
                      </button>
                    </div>
                    {select && (
                      <DatePickerTwo
                        handleSelect={handleSelect}
                        selectionRange={selectionRange}
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="box box-success">
                <div className="box-header">
                  <h3 className="box-title">
                    iCheck - Checkbox &amp; Radio Inputs
                  </h3>
                </div>
                <div className="box-body">
                  <div className="form-group">
                    <SimpleCheckbox type={"checkbox"} />
                    <SimpleCheckbox type={"checkbox"} />
                    <SimpleCheckbox type={"checkbox"} disabled={true} />
                    <label className="labels"> Minimal skin checkbox</label>
                  </div>

                  <div className="form-group">
                    <SimpleCheckbox type={"radio"} name="radio" />
                    <SimpleCheckbox type={"radio"} name="radio" />
                    <SimpleCheckbox
                      type={"radio"}
                      disabled={true}
                      name="radio"
                    />
                    <label className="labels"> Minimal skin checkbox</label>
                  </div>

                  <div className="form-group">
                    <CustomCheckBox type={"checkbox"} />
                    <CustomCheckBox type={"checkbox"} />
                    <CustomCheckBox type={"checkbox"} disabled={true} />
                    <label className="labels">
                      Minimal green skin checkbox
                    </label>
                  </div>

                  <div className="form-group">
                    <CustomRadioBox type={"radio"} name="radio" />
                    <CustomRadioBox type={"radio"} name="radio" />
                    <CustomRadioBox
                      type={"radio"}
                      disabled={true}
                      name="radio"
                    />
                    <label className="labels">
                      Minimal green skin checkbox
                    </label>
                  </div>
                </div>

                <div className="box-footer">
                  Many more skins available.
                  <a href="http://fronteed.com/iCheck/">Documentation</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdvancedElements;
