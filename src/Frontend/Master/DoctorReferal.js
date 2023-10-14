import React, { useEffect, useMemo, useState } from "react";
import Input from "../../ChildComponents/Input";
import Loading from "../../Frontend/util/Loading";
import { Link } from "react-router-dom";
import {
  ActiveDoctor,
  CreateSpecialization,
} from "../../ChildComponents/Constants";
import {
  autocompleteOnBlur,
  getDoctorSuggestion,
  selectedValueCheck,
} from "../../Frontend/util/Commonservices";
import { number } from "../../Frontend/util/Commonservices/number";
import { SelectBox } from "../../ChildComponents/SelectBox";
import axios from "axios";
import { toast } from "react-toastify";
import { IndexHandle } from "../../Frontend/util/Commonservices/number";
import Pagination from "../../Frontend/util/Commonservices/Pagination";

import { useTranslation } from "react-i18next";
let PageSize = 10;

const DoctorReferal = () => {
  const [indexMatch, setIndexMatch] = useState(0);
  const [doctorSuggestion, setDoctorSuggestion] = useState([]);
  const [dropFalse, setDropFalse] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  // const [load, setLoad] = useState(false);
  const [toggleTable, setToggleTable] = useState(true);

  const [payload, setPayload] = useState({
    DoctorName: "",
    Mobile: "",
    Specialization: "All",
    isActive: ActiveDoctor[0]?.value,
  });
const { t } = useTranslation();

  const handleListSearch = (data, name) => {
    switch (name) {
      case "DoctorName":
        setPayload({ ...payload, [name]: data.Name });
        setIndexMatch(0);
        setDoctorSuggestion([]);
        setDropFalse(false);
        break;
      default:
        break;
    }
  };

  const handleIndex = (e) => {
    const { name } = e.target;
    switch (name) {
      case "DoctorName":
        switch (e.which) {
          case 38:
            if (indexMatch !== 0) {
              setIndexMatch(indexMatch - 1);
            } else {
              setIndexMatch(doctorSuggestion.length - 1);
            }
            break;
          case 40:
            if (doctorSuggestion.length - 1 === indexMatch) {
              setIndexMatch(0);
            } else {
              setIndexMatch(indexMatch + 1);
            }
            break;
          case 13:
            handleListSearch(doctorSuggestion[indexMatch], name);
            setIndexMatch(0);
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  };



  const handleSelectChange = (e) => {
    const { value,name } = e.target;
    setPayload({...payload , [name]:value});
  };


  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return tableData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, tableData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayload({ ...payload, [name]: value });
  };

  useEffect(() => {
    getDoctorSuggestion(payload, setDoctorSuggestion, setPayload);
  }, [payload?.DoctorName]);

  const fetch = () => {
    setLoading(true);
    axios
      .post("/api/v1/DoctorReferal/SearchDoctorData", {
        ...payload,
        Name: payload?.DoctorName,
      })
      .then((res) => {
        setTableData(res?.data?.message);
        // setLoad(true);
        setCurrentPage(1);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Error Occured"
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    fetch();
  }, []);

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h3 className="box-title">{t("Doctor Master")}</h3>
          <Link to="/CreateDoctorReferal" style={{ float: "right" }}>
            {t("Create New")}
          </Link>
        </div>
        <div className="box-body">
          <div className="row">
            <label className="col-sm-1">{t("Doctor Name")}:</label>
            <div className="col-sm-2 ">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                placeholder={t("Doctor Name")}
                name="DoctorName"
                value={payload?.DoctorName}
                type="text"
                autoComplete={"off"}
                onChange={(e) => {
                  handleChange(e);
                  setDropFalse(true);
                }}
                onBlur={(e) => {
                  autocompleteOnBlur(setDoctorSuggestion);
                  setTimeout(() => {
                    const data = doctorSuggestion.filter(
                      (ele) => ele?.Name === e.target.value
                    );
                    if (data.length === 0) {
                      setPayload({ ...payload, DoctorName: "" });
                    }
                  }, 500);
                }}
                onKeyDown={handleIndex}
              />
              {dropFalse && doctorSuggestion.length > 0 && (
                <ul
                  className="suggestion-data"
                  style={{ top: "26px", right: "1px" }}
                >
                  {doctorSuggestion.map((data, index) => (
                    <li
                      onClick={() => handleListSearch(data, "DoctorName")}
                      className={`${index === indexMatch && "matchIndex"}`}
                      key={index}
                    >
                      {data?.Name}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <label className="col-sm-1">{t("Mobile")}:</label>
            <div className="col-sm-2">
              <Input
                className="form-control ui-autocomplete-input input-sm"
                placeholder={t("Mobile")}
                type="number"
                name="Mobile"
                onInput={(e) => number(e, 10)}
                value={tableData.Mobile}
                onChange={handleChange}
                required
              />
            </div>

            <label className="col-sm-1">{t("Specialization")}:</label>
            <div className="col-sm-2">
              <SelectBox
                options={CreateSpecialization}
                value={payload?.Specialization}
                name="Specialization"
                onChange={handleSelectChange}
                id="CreateSpecialization"
              />
            </div>

            <label className="col-sm-1">{t("Status")}:</label>
            <div className="col-sm-2">
              <SelectBox
                options={ActiveDoctor}
                value={payload?.isActive}
                name="isActive"
                onChange={handleSelectChange}
              />
            </div>
          </div>
          <div className="row">
            {loading ? (
              <Loading />
            ) : (
              <div className="col-sm-1">
                <button
                  type="button"
                  className="btn btn-block btn-success btn-sm"
                  onClick={fetch}
                >
                  {t("Search")}
                </button>
              </div>
            )}
            {/* </div> */}
          </div>
        </div>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          {currentTableData.length > 0 && (
            <div
              className="box-body divResult table-responsive boottable"
              id="no-more-tables"
            >
              <table
                className="table table-bordered table-hover table-striped tbRecord"
                cellPadding="{0}"
                cellSpacing="{0}"
              >
                <thead className="cf">
                  <tr>
                    <th>{t("S.No")}</th>
                    <th>{t("Name")}</th>
                    <th>{t("Phone")}</th>
                    <th>{t("Specialization")}</th>
                    <th>{t("Email")}</th>
                    <th>{t("ClinicName")}</th>
                    <th>{t("Degree")}</th>
                    <th>{t("Address")}</th>
                    <th>{t("Mobile")}</th>
                    <th>{t("Active")}</th>
                    <th>{t("Action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTableData?.map((data, index) => (
                    <tr key={index}>
                      <td data-title={t("S.No")}>
                        {index + 1 + IndexHandle(currentPage, PageSize)}&nbsp;
                      </td>
                      <td data-title={t("Name")}>{data?.Name}&nbsp;</td>
                      <td data-title={t("Phone")}>
                        {data?.Phone ? data?.Phone : "-"}&nbsp;
                      </td>
                      <td data-title={t("Specialization")}>
                        {data?.Specialization ? data?.Specialization : "-"}
                        &nbsp;
                      </td>
                      <td data-title={t("Email")}>
                        {data?.Email ? data?.Email : "-"}&nbsp;
                      </td>
                      <td data-title={t("ClinicName")}>
                        {data?.ClinicName ? data?.ClinicName : "-"}&nbsp;
                      </td>
                      <td data-title={t("Degree")}>
                        {data?.Degree ? data?.Degree : "-"}&nbsp;
                      </td>
                      <td data-title={t("Address")}>
                        {data?.Address ? data?.Address : "-"}&nbsp;
                      </td>
                      <td data-title={t("Mobile")}>
                        {data?.Mobile ? data?.Mobile : "-"}&nbsp;
                      </td>
                      <td data-title={t("Active")}>
                        {data?.isActive === 1 ? t("Active") : t("De-Active")}&nbsp;
                      </td>
                      <td data-title={t("Action")} className="text-primary">
                        <Link
                          to="/CreateDoctorReferal"
                          state={{
                            url: "/api/v1/DoctorReferal/GetSingleDoctorData",
                            url1: "/api/v1/DoctorReferal/UpdateDoctorReferal",
                            id: data?.DoctorReferalID,
                          }}
                          className="float-right"
                        >
                          {t("Edit")}
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={tableData?.length}
                pageSize={PageSize}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          )}
        </>
      )}
    </>
  );
};

export default DoctorReferal;
