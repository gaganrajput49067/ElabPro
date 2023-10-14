
import { useEffect } from 'react';
import { useState } from 'react';
import Loading from '../Frontend/util/Loading';
import Input from './../ChildComponents/Input';
import  axios  from 'axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';



const CreateDept=()=>{

    const[formdata,SetFormData]=useState({
        Department:"",
        DepartmentCode:"",
        isActive:true,
    })
    const[loading,setLoading]=useState(false);

const handleChange=(e)=>{
   
    const {name,value,type,checked}=e.target;
    console.log(name," ",value," ",type," ",checked)
    SetFormData({...formdata,[name]:type==="checkbox"?checked:value})
}

const postData=()=>{
    debugger
axios.post("api/v1/Department/InsertDepartmentData",formdata)
.then((res)=>{
    if(res.data.message)
    {
        setLoading(false);
        toast.success(res?.data?.message);
    }
    else
    {}
}).catch((err)=>{
toast.error(
    err?.response?.data?.message ?
    err?.response?.data?.message :"Error Occurred"

);
setLoading(false);
})


}

return(
    <>
<div className="box box-success">
<div className='box-header with-border'>
<h1 className='box-title'>
Create New Department
</h1>
</div>
<div className='box-body'>
<div className='row'>
    <label className='col-sm-1'>Department Code</label>
    <div className='col-sm-2'>
<Input
className="form-control ui-autocomplete-input input-sm"
placeholder="department code"
maxLength={30}
name="DepartmentCode"
type="text"
onChange={handleChange}
value={formdata.DepartmentCode}
>
</Input>
    </div>
    <label className='col-sm-1'>Department: </label>
    <div className='col-sm-2'>
    <Input
className="form-control ui-autocomplete-input input-sm"
placeholder="department"
maxLength={30}
name="Department"
type="text"
onChange={handleChange}
value={formdata.Department}
>
</Input>

    </div>
    <div className='row col-sm-1 '>
<Input

name="isActive"
type="checkbox"
checked={formdata.isActive}
onChange={handleChange}
>
</Input>
{loading?
(<Loading/>):
(
    <>
    <button
    type='button'
    id='btnSave'
    title='Save'
    onClick={postData}
    >
Create
    </button>
    </>
)
}
    </div>
    <div className='col-sm-2'>
        <Link 
        to="/Dept"
        >Back To List</Link>

    </div>

</div>
</div>
</div>
    </>
)
}

export default CreateDept