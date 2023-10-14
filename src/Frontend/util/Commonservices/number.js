export const number = (e, sliceValue, valueGreater) => {
  if (handleCheckDot(e)) {
    return (e.target.value = e.target.value.replace(".",""));
  } else {
    if (valueGreater) {
      return e.target.value > valueGreater
        ? (e.target.value = e.target.value.slice(0, e.target.value.length - 1))
        : (e.target.value = e.target.value.slice(0, sliceValue));
    } else {
      return (e.target.value = e.target.value.slice(0, sliceValue));
    }
  }
};

export const Range = (start, end) => {
  var ans = [];
  for (let i = start; i <= end; i++) {
    ans.push(i);
  }
  return ans;
};

export const IndexHandle = (currentPage, pageSize) => {
  return (currentPage - 1) * pageSize;
};

const handleCheckDot = (e) => {
  const data = [...e.target.value];
  return data.includes(".");
};
