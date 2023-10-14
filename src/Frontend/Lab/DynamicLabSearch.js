import React, { useEffect, useState } from "react";
import axios from "axios";
import Input from "../../ChildComponents/Input";
import BootTable1 from "../../Table/DispatchLabTable";
import Loading from "../util/Loading";
import { getTrimmedData } from "../util/Commonservices";
import MedicialModal from "../util/MedicialModal";
import UploadModal from "../util/UploadModal";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const DynamicLabSearch = () => {
  const [dispatchData, setDispatchData] = useState([]);
  const location = useLocation();
  // console.log(location);
  const [show, setShow] = useState({
    modal: false,
    data: "",
    index: -1,
  });

  const [Identity, setIdentity] = useState([]);
  const [load, setLoad] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    LabNo: "",
  });

  useEffect(() => {
    setFormData({ ...formData, LabNo: location?.state?.data });
    if (location?.state?.data) {
      TableData("", location?.state?.data);
    }
  }, [location?.state?.data]);

  const { t } = useTranslation();

  const [show4, setShow4] = useState({
    modal: false,
    data: "",
    index: -1,
  });

  const handleUploadCount = (name, value, secondName) => {
    let data = [...dispatchData];
    if (name === "UploadDocumentCount") {
      data[show?.index][name] = value;
      data[show?.index][secondName] = value === 0 ? 0 : 1;
      setDispatchData(data);
    } else {
      data[show4?.index][name] = value;
      data[show4?.index][secondName] = value === 0 ? 0 : 1;
      setDispatchData(data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const TableData = (status, labno) => {
    setLoading(true);
    axios
      .post(
        "/api/v1/Dispatch/DynamicLabSearch",
        getTrimmedData({
          LabNo: labno ? labno : formData?.LabNo.trim(),
        })
      )
      .then((res) => {
        if (res?.data?.message.length > 0) {
          setDispatchData(res?.data?.message);
          setLoad(true);
        } else {
          toast.error(res?.data?.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : err?.data?.message
        );
        setLoading(false);
        setDispatchData("");
      });
  };

  return (
    <>
      <div className="box box-success">
        {show4?.modal && (
          <MedicialModal
            show={show4.modal}
            handleClose={() => {
              setShow4({
                modal: false,
                data: "",
                index: -1,
              });
            }}
            MedicalId={show4?.data}
            handleUploadCount={handleUploadCount}
          />
        )}

        {show?.modal && (
          <UploadModal
            show={show?.modal}
            handleClose={() => {
              setShow({ modal: false, data: "", index: -1 });
            }}
            options={Identity}
            documentId={show?.data}
            pageName="Patient Registration"
            handleUploadCount={handleUploadCount}
          />
        )}

        <div className="box-header with-border">
          <h3 className="box-title">{t("Dynamic Lab Search")}</h3>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-2">{t("Visit No./BarCodeNo")}:</label>
            <div className="col-sm-2">
              <Input
                className="form-control input-sm"
                type="text"
                value={formData?.LabNo}
                name={"LabNo"}
                onChange={handleChange}
              />
            </div>
            <div className="col-sm-1">
              <button
                className="btn btn-info btn-block btn-sm"
                onClick={() => TableData("")}
              >
                {t("Search")}
              </button>
            </div>
          </div>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        load && (
          <div className="box mb-4">
            <div
              className="box-body divResult boottable table-responsive"
              id="no-more-tables"
            >
              <BootTable1
                dispatchData={dispatchData}
                show={setShow4}
                show2={setShow}
              />
            </div>
          </div>
        )
      )}
    </>
  );
};

export default DynamicLabSearch;
