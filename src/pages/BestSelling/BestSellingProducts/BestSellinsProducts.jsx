import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductsGridView from "../../Categories/CategoriesProducts/ProductsGridView/ProductsGridView";
import CategoriesSort from "../../Categories/CategoriesProducts/CategoriesSort/CategoriesSort";
import loader from "../../../assets/images/loader.gif";


const BestSellinsProducts = ({ filters, setFilters }) => {
  const dispatch = useDispatch();
  const currencyRate =
    useSelector(
      (state) => state.siteSettingReducerData?.currentCurrency?.conversion_rate
    ) || 1;
  const currencyCode =
    useSelector(
      (state) =>
        state.siteSettingReducerData?.currentCurrency?.currency_iso_code
    ) || "USD";

  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("Sort By");


  const subProductData = useSelector(
    (state) =>
      state.SliderReducerData.sliders.BEST_SELLING_PRODUCTS.sliderData.data
  );

  const currentlyAppliedFilters = getAllAppliedFilters(
    filters.price,
    filters.brand,
    filters.discount
  );

  const dataTransformationFunction = (data) => {
    let tempData = data?.products_data || {};
    tempData = Object.values(tempData);
    if (sortBy === "Low To High") {
      tempData = tempData.sort((a, b) => a.price - b.price);
    }
    if (sortBy === "High To Low") {
      tempData = tempData.sort((a, b) => b.price - a.price);
    }
    if (sortBy === "Newest") {
      tempData = tempData.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
    }
    if(filters.price.length > 0) {
      let min = Math.min(...filters.price.map((item) => parseFloat(item.substring(1))))
      let max = Math.max(...filters.price.map((item) => parseFloat(item.split("-")[1])))
      tempData = tempData.filter((item) => item.sale_price >=min && item.sale_price<=max)
    }
    if(filters.brand.length > 0) {
      tempData = tempData.filter((item) => filters.brand.includes(item.brand_name))
    }
    if(filters.discount.length > 0) {
      let min = Math.min(...filters.discount.map((item) => parseFloat(item)))
      let max = Math.max(...filters.discount.map((item) => parseFloat(item.split("-")[1].substring(1))))
      tempData = tempData.filter((item) => parseFloat(item.discount) >=min && parseFloat(item.discount)<=max)
    }
    return tempData;
  };

  const handleRemoveFilter = (action) => {
    setFilters({ ...action });
  };

  const transformedData = dataTransformationFunction(subProductData);

  return (
    <div className="col-xl-9 col-lg-9 col-md-8">
      <div className="right">
        <div className="search-filter justify-content-end mx-3">
          <CategoriesSort sortBy={sortBy} setSortBy={setSortBy} />
        </div>
        <div className="active-filter">
          <div className="d-xl-flex d-none align-items-center gap-2">
            <span>Active Filter : </span>
            <div className="remove-filter">
              {currentlyAppliedFilters.length > 0 &&
                currentlyAppliedFilters.map((filter, index) => {
                  return (
                    <Link
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveFilter(filter);
                      }}
                    >
                      {filter.value}
                      <i className="fa fa-close" />
                    </Link>
                  );
                })}
            </div>
          </div>
        </div>
        {!isLoading ? (
          <ProductsGridView products={transformedData} />
        ) : (
          <div className="container mt-3">
            <div className="row">
              <div className="col-xl-12 col-lg-12 col-md-12 d-flex justify-content-center ">
                <img
                  src={loader}
                  alt="Loading Related Products"
                  style={{ maxWidth: "100px" }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BestSellinsProducts;

//  Helper functions
const getAllAppliedFilters = (
  priceFilter = [],
  brandFilter = [],
  discountFilter = []
) => {
  let tempAppliedFilters = [];
  for (let i = 0; i < priceFilter.length; i++) {
    tempAppliedFilters.push({
      type: "price",
      value: priceFilter[i],
      payload: priceFilter[i],
    });
  }
  for (let i = 0; i < discountFilter.length; i++) {
    tempAppliedFilters.push({
      type: "discount",
      value: discountFilter[i],
      payload: discountFilter[i],
    });
  }
  for (let i = 0; i < brandFilter.length; i++) {
    tempAppliedFilters.push({
      type: "brand",
      value: brandFilter[i],
      payload: brandFilter[i],
    });
  }
  return tempAppliedFilters;
};
