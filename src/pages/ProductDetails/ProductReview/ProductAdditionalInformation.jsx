import React from "react";

const additionalInfo = [
  {
    head: "Size",
    body: "EU 41 (US 8), EU 42 (US 9), EU 43 (US 10), EU 45 (US 12)",
  },
  { head: "Color", body: "S , M , L , XS" },
  { head: "Fabric", body: "Cotton (100%)" },
];

const ProductAdditionalInformation = ({productInfo}) => {

  const attributes = Object.values(productInfo?.attribute_payload || {})
  if(attributes.length < 1) {
    return <></>
  }

  return (
    <div className="tab-pane fade active show">
      <div className="row mt-3">
        <div className="col-xl-12 col-lg-12 col-md-12">
          <table className="table table-striped">
            <tbody>
              {attributes.map((entry) => {
                return (<tr>
                  <th>{entry.attribute_title}</th>
                  <td>{entry.value}</td>
                </tr>)
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductAdditionalInformation;
