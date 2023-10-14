import Loading from "./../util/Loading";
import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import Input from "../ChildComponents/Input";
import  axios  from 'axios';
import { toast } from 'react-toastify';


const EditDeptPage = () => {
  const location = useLocation();
  const [err,setErr]=useState({})
  const { state } = location;
const navigate=useNavigate();
  const [Loading, setLoading] = useState(false);
  const [formdata, setFormData] = useState({
    Department: state?.data?.Department ? state?.data?.Department : "",
    DepartmentCode: state?.data?.DepartmentCode
      ? state?.data?.DepartmentCode
      : "",
    isActive: state?.data?.status == "De-Active" ? false : true,
    DepartmentID: state?.data?.DepartmentID,
  });


  const handleChange=(e)=>{
    
    const {name,value,type,checked}=e.target;
    setFormData({
        ...formdata,[name]:type=="checkbox"?checked:value,
    })


  }
  const updateDate=()=>{
    setLoading(true);
    axios.post
    ("/api/v1/Department/UpdateDepartmentData", formdata)
    .then((res)=>{
if(res.status===200)
{
    toast.success("Record Updated Successfully");
    navigate("/Dept")
    setLoading(false);
}
    }).catch((err)=>{
       toast.error(err?.response?.data?.message)
    })

  }

  return (
    <>
      <div className="box box-success form-horizontal">
        <div className="box-header with-border">
          <h1 className="box-title">Update Department</h1>
        </div>

        <div className="box-body">
          <div className="row">
            <label>Department Code</label>
            <div className="col-sm-2">
              <Input
                type="text"
                name="DepartmentCode"
                className="form-control"
                onChange={handleChange}
                value={formdata.DepartmentCode}
              ></Input>
               <div
                className="field-validation-valid text-danger"
                data-valmsg-for="Department"
                data-valmsg-replace="true"
              >
                {err?.DepartmentCode}
              </div>
            </div>
            <label className="col-sm-1">Department</label>
            <div className="col-sm-2">
            <Input
            type="text"
            name="Department"
            className="form-control"
            onChange={handleChange}
            value={formdata.Department}
            >
            </Input>
            </div>
            <div className="col-sm-2 d-flex">
<Input
name="isActive"
type="checkbox"
checked={formdata.isActive}
onChange={handleChange}
>
</Input>
<label className="control-label">IsActive</label>
            </div>
            <div className="row">
                <button
                className="btn-success"
                    onClick={updateDate}
              >Update  </button>

            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default EditDeptPage;
