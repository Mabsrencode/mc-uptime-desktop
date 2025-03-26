import React from "react";
interface SEOResultsDataI {
  data: SEOResponseI;
}
const SEOResults: React.FC<SEOResultsDataI> = ({ data }) => {
  return <div>{JSON.stringify(data)}</div>;
};

export default SEOResults;
