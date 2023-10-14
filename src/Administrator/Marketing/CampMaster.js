import React, { useEffect, useState } from "react";
import Input from "../../ChildComponents/Input";
import CustomDate from "../../ChildComponents/CustomDate";
import { SelectBox } from "../../ChildComponents/SelectBox";
import { getAccessCentres, selectedValueCheck } from "../../Frontend/util/Commonservices";

const CampMaster = () => {
    const [CentreData, setCentreData] = useState([]);
    const[payload,setPayload]=useState({
        CentreID:""
    })

    const handleSelectChange = (event, rest) => {
        const { name } = rest;
        setPayload({ ...payload, [name]: event?.value });
      };

    useEffect(() => {
        getAccessCentres(setCentreData);
      }, []);
  return (
    <>
      <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
        <div className="container-fluid">
          <div className="card shadow mb-4 mt-4">
            <div className="card-header py-3">
              <div className="clearfix">
                <h6 className="m-0 font-weight-bold text-primary float-left">
                  Camp Master
                </h6>
              </div>
            </div>
          </div>

          <div className="card shadow mb-4 mt-4">
              <div className="card-header py-3">
                <div className="clearfix">
                  <h6 className="m-0 font-weight-bold text-primary float-left">
                    Manage Camp
                  </h6>
                </div>
              </div>
              <div className="card-body">
              <div className="col-sm-2 form-group">
                <label className="control-label">Camp Name:</label>
                <Input className="form-control" />
              </div>

              <div className="col-sm-2 form-group">
                <label className="control-label">Camp Date:</label>
                <CustomDate 
                className="form-control"
                
                />
              </div>

              <div className="col-sm-2 form-group">
                <label className="control-label">Business Zone:</label>
                <SelectBox />
              </div>

              <div className="col-sm-2 form-group">
                <label className="control-label">Centre:</label>
                <SelectBox 
                 options={CentreData}
                 name="FromCentre"
                 selectedValue={selectedValueCheck(
                   CentreData,
                   payload?.CentreID
                 )}
                 onChange={handleSelectChange}
                />
              </div>

              <div className="col-sm-2 form-group">
                <label className="control-label">Tag Business Lab:</label>
                <SelectBox />
              </div>
            </div>
            <div className="card-footer m-0 p-0">
              <div className="col-sm-2 form-group mt-3">
                <button className="btn btn-success">Add</button>
              </div>
            </div>
          </div>
          {/* </div> */}
          <div className="card shadow mb-4 mt-4">
            <div className="card-header py-3">
              <div className="clearfix">
                <h6 className="m-0 font-weight-bold text-primary float-left">
                  Manage Item
                </h6>
              </div>
            </div>
            <div className="card-body">
              <div className="col-sm-2 form-group">
                <input type="radio"></input>
                <label className="control-label">By Test Name</label>
              </div>

              <div className="col-sm-2 form-group">
                <input type="radio"></input>
                <label className="control-label">By Test Code</label>
              </div>

              <div className="col-sm-2 form-group">
                <input type="radio"></input>
                <label className="control-label">InBetween</label>
              </div>

              <div className="col-sm-3 form-group">
                <label className="control-label">Total Test:</label>
                {}
              </div>

              <div className="col-sm-3 form-group">
                <label className="control-label">Total Amt.:</label>
                {}
              </div>
            </div>
            <div className="card-footer m-0 p-0">
              <div className="col-sm-2 form-group mt-3">
                <button className="btn btn-success">Save</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CampMaster;
