export const hanlderSpecialCharacter = (e) => {
  
  var format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
  console.log(format.test(e.target.value));
  if (format.test(e.target.value[e.target.value.length - 1])) {
    return (e.target.value = e.target.value.slice(
      0,
      e.target.value.length - 1
    ));
  } else {
    return e.target.value;
  }
};


export const checkSpecialCharAndNumber =(e)=>{
  if(!/[0-9 a-zA-Z]/.test(e.key)){
   e.preventDefault();
  }
  if(/[0-9]/.test(e.key)){
    e.preventDefault();
  }
 };