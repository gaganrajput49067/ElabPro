export const number = (e, sliceValue, valueGreater) => {
  if (valueGreater) {
    return e.target.value > valueGreater
      ? (e.target.value = e.target.value.slice(0, e.target.value.length - 1))
      : (e.target.value = e.target.value.slice(0, sliceValue));
  } else {
    return (e.target.value = e.target.value.slice(0, sliceValue));
  }
};

export const Range = (start, end) => {
  var ans = [];
  for (let i = start; i <= end; i++) {
    ans.push(i);
  }
  return ans;
};

export const IndexHandle = (currentPage) => {
  return currentPage !== 1 && 10 * (currentPage - 1);
};
