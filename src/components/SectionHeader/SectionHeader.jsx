import React from "react";
import { Link } from "react-router-dom";
import TextShortener from "../DynamicText/TextShortner";

const SectionHeader = ({ title, navigationLink, viewall = null }) => {
  return (
    <>
      <div className="col-xl-6 col-lg-6 col-md-6 col-8">
        <div className="left">
          <TextShortener text={title} textLimit={40} component={"h2"} tooltipColor={"#77878f"} className={""}/>
        </div>
      </div>
      <div className="col-xl-6 col-lg-6 col-md-6 col-4">
        <div className="right">
          <Link to={navigationLink}>
          {viewall === null ? (
            <span>
              View All
              <i className="fa fa-angle-right ms-2" />
            </span>
          ) : (
            ''
          )}
            {/* View All  */}
          </Link>
        </div>
      </div>
      <div className="col-xl-12 col-lg-12 col-md-12">
        <hr className="hr-new" />
      </div>
    </>
  );
};

export default SectionHeader;
