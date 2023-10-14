import React, { useEffect } from "react";
import { Table } from "react-bootstrap";
import { useState } from "react";
import { getDepartment } from "../../Frontend/util/Commonservices";
import { useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../Frontend/util/Loading";
import { useTranslation } from "react-i18next";

function ManageOrdering() {
  const { t } = useTranslation();
  const [Department, setDepartment] = useState([]);
  const [loading, setLoading] = useState(false);
  const dragItem = useRef();

  const dragStart = (e, position) => {
    dragItem.current = position;
  };
  const dragOverItem = useRef();
  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const drop = (e) => {
    const copyListItems = [...Department];
    const dragItemContent = copyListItems[dragItem.current];
    copyListItems.splice(dragItem.current, 1);
    copyListItems.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    setDepartment(copyListItems);
  };

  const updateHandler = () => {
    const data = Department.map((ele, index) => {
      return {
        PrintOrder: index + 1,
        DepartmentID: ele?.value,
      };
    });

    setLoading(true);
    axios
      .post("/api/v1/Department/UpdateDepartmentDataWithOrdering", {
        Data: data,
      })
      .then((res) => {
        toast.success(res?.data?.message);
        getDepartment(setDepartment, "getDepartmentEmployeeMaster", true);
        setLoading(false);
      })
      .catch((err) => {
        toast.error(
          err?.response?.data?.message
            ? err?.response?.data?.message
            : "Something Went Wrong"
        );
        setLoading(false);
      });
  };

  useEffect(() => {
    getDepartment(setDepartment, "getDepartmentEmployeeMaster", true);
  }, []);

  return (
    <>
      <div className="box box-success">
        {loading ? (
          <Loading />
        ) : (
          <div className="box-header with-border">
            <h6 className="box-title">{t("Manage Ordering")}</h6>
          </div>
        )}
      </div>

      <div className=" box-body divResult table-responsive boottable" id="no-more-tables">
        <div className="row">
        <table
          className="table table-bordered table-hover table-striped tbRecord"
          cellPadding="{0}"
          cellSpacing="{0}"
        >
          <thead className="cf">
            <tr>
              {[t("S. No."), t("Dept_ID"), t("Name")].map((ele, index) => {
                return <th key={index}>{ele}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {Department?.map((ele, index) => (
              <tr
                key={index}
                onDragStart={(e) => dragStart(e, index)}
                draggable
                onDragEnter={(e) => dragEnter(e, index)}
                onDragEnd={drop}
                style={{ cursor: "move" }}
              >  
                <td data-title={t("S. No")}>{ele?.printOrder}&nbsp;</td>
                <td data-title={t("Dept_ID")}>{ele?.value}&nbsp;</td>
                <td data-title={t("Name")}>{ele?.label}&nbsp;</td>                
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      <div className="row">
      <div className="box-footer">
      <div className="col-sm-2">
        <button className="btn btn-block btn-success btn-sm" style={{marginTop:"10px"}} onClick={updateHandler}>
         {t("Save Ordering")} 
        </button>
      </div>
      </div>
      </div>
    </>
  );
}

export default ManageOrdering;
