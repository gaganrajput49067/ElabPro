import React from "react";
import ReactJsonViewCompare from "react-json-view-compare";
import { NewJSON, OldJson } from "../../ChildComponents/Constants";
function SpiltJSONDifference() {
    
  return <ReactJsonViewCompare oldData={OldJson} newData={NewJSON} />;
}

export default SpiltJSONDifference;
