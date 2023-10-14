import React, { useEffect, useState } from "react";
import { SelectBox } from "../../ChildComponents/SelectBox";
import {
  selectedValueCheck,
  getAccessCentres,
} from "../../Frontend/util/Commonservices";
import axios from "axios";
import { toast } from "react-toastify";

const TransferMachineRanges = () => {
  const [Machine, setMachine] = useState([]);
  const [CentreData, setCentreData] = useState([]);
  const [state, setState] = useState({
    FromCentre: "",
    ToCentre: "",
    FromMachine: "",
    ToMachine: "",
  });

  const handleSelectChange = (event, rest) => {
    const { name } = rest;
    setState({ ...state, [name]: event?.value });
  };

  const getMachine = () => {
    axios
      .get("/api/v1/Investigations/BindMachineList")
      .then((res) => {
        let data = res.data.message;
        let Machine = data.map((ele) => {
          return {
            value: ele.MachineId,
            label: ele.MachineName,
          };
        });
        setMachine(Machine);
      })
      .catch((err) => console.log(err));
  };

  const postApi = () => {
    if (
      state?.FromCentre &&
      state?.ToCentre &&
      state?.FromMachine &&
      state?.ToMachine
    ) {
      axios
        .post("/api/v1/machineReferencesRanges/TransferMachineRefRangesData", {
          FromCentre: state?.FromCentre,
          FromMachine: state?.FromMachine,
          ToCentre: state?.ToCentre,
          ToMachine: state?.ToMachine,
        })
        .then((res) => {
          toast.success(res?.data?.message);
          setState({
            FromCentre: "",
            ToCentre: "",
            FromMachine: "",
            ToMachine: "",
          });
        })
        .catch((err) => {
          toast.error(
            err?.response?.data?.message
              ? err?.response?.data?.message
              : "Something went wrong"
          );
        });
    } else {
      toast.error("All fields are Required.");
    }
  };

  useEffect(() => {
    getAccessCentres(setCentreData);
    getMachine();
  }, []);
  return (
    <>
      <div className="content-wrapper" style={{ minHeight: "955.604px" }}>
        <div className="container-fluid">
          <div className="card shadow mb-4 mt-4">
            <div className="card-header py-3">
              <div className="clearfix">
                <h6 className="m-0 font-weight-bold text-primary float-left">
                  Machine Reference Ranges Transfer
                </h6>
              </div>
            </div>
            <div className="card-body boottable">
              <div className="row">
                <div className="col-sm-5 form-group">
                  <div className="col-sm-6 form-group">
                    <label className="control-label">From Centre:</label>
                    <SelectBox
                      options={CentreData}
                      name="FromCentre"
                      selectedValue={selectedValueCheck(
                        CentreData,
                        state?.FromCentre
                      )}
                      onChange={handleSelectChange}
                    />
                  </div>

                  <div className="col-sm-6 form-group">
                    <label className="control-label">From Machine Name:</label>
                    <SelectBox
                      options={Machine}
                      onChange={handleSelectChange}
                      name="FromMachine"
                      selectedValue={selectedValueCheck(
                        Machine,
                        state?.FromMachine
                      )}
                    />
                  </div>
                </div>

                <div className="col-sm-2 form-group">
                  <button
                    className="btn btn-primary mt-5 mx-5"
                    style={{ width: "50px" }}
                    onClick={postApi}
                  >
                    {">>"}
                  </button>
                </div>

                <div className="col-sm-5 form-group">
                  <div className="col-sm-6 form-group">
                    <label className="control-label"> To Centre:</label>
                    <SelectBox
                      // options={
                      //   state?.FromCentre
                      //     ? CentreData.filter(
                      //         (ele) => ele.value != state?.FromCentre
                      //       )
                      //     : CentreData
                      // }
                      options={CentreData}
                      name="ToCentre"
                      selectedValue={selectedValueCheck(
                        CentreData,
                        state?.ToCentre
                      )}
                      onChange={handleSelectChange}
                    />
                  </div>

                  <div className="col-sm-6 form-group">
                    <label className="control-label"> To Machine Name:</label>
                    <SelectBox
                      // options={
                      //   state?.FromMachine
                      //     ? Machine.filter(
                      //         (ele) => ele.value != state?.FromMachine
                      //       )
                      //     : Machine
                      // }
                      options={Machine}
                      onChange={handleSelectChange}
                      name="ToMachine"
                      selectedValue={selectedValueCheck(
                        Machine,
                        state?.ToMachine
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TransferMachineRanges;
