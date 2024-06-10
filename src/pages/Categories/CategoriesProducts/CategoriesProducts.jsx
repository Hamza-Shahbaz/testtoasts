import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  handleFilteredProducts,
  resetSubProductData,
} from "../../../redux/actions/CategoryActions";
import { useDispatch, useSelector } from "react-redux";
import ProductsGridView from "./ProductsGridView/ProductsGridView";
import CategoriesSort from "./CategoriesSort/CategoriesSort";
import { categoryBreadcrumbHandler } from "../../../redux/actions/BreadcrumbActions";
import { CATEGORY_BREADCRUMB } from "../../../redux/constant/constants";
import { reconvertAmount } from "../../../utils/Helper";
import loader from "../../../assets/images/loader.gif";
import SearchInput from "../../../components/Header/CenterHeader/SearchInput/SearchInput";

const pageSizeOptions = [10, 20, 30, 40, 50];

const CategoriesProducts = ({ filters, setFilters, sidebarRef }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const tagsFromLocation = location?.state?.tag;
  const params = useParams();
  const productId = params?.id;
  const categoriesFromState = useSelector(
    (state) => state?.categoryReducerData.categories
  );
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
  const [currentPage, setCurrentPage] = useState(1);
  const [showPages, setShowPages] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [openSortingOptions, setOpenSortingOptions] = useState(false);
  const selectRef = useRef(null);

  //Hide filters for mobile
  const menuToggleRef = useRef(null);

  useEffect(() => {
    const handleToggleChange = () => {
      if (!sidebarRef) {
        return;
      }
      if (menuToggleRef.current.checked) {
        sidebarRef.current.style.left = "0";
      } else {
        sidebarRef.current.style.left = "-290px";
      }
    };

    const menuToggle = menuToggleRef.current;
    menuToggle.addEventListener("change", handleToggleChange);

    // Cleanup the event listener on component unmount
    return () => {
      menuToggle?.removeEventListener("change", handleToggleChange);
    };
  }, []);

  const subProductData = useSelector(
    (state) => state?.productReducerData?.product
  );

  const breadcrumbsFromState = useSelector(
    (state) => state.BreadcrumbReducerData.breadcrumbs || []
  );

  const lastCrumbPath = breadcrumbsFromState?.pop()?.path;

  let prices = filters.price.map((item) =>
    transformPriceForApi(item, currencyRate, currencyCode)
  );
  let brand_names = filters.brand;
  let variant_ids = Object.keys(filters.filterBy.variants).map((item) =>
    parseInt(item)
  );
  let sub_attribute_ids = Object.keys(filters.filterBy.attributes).map((item) =>
    parseInt(item)
  );
  let tag_ids = filters.tag.map((item) => item.tag_id);

  let discounts = filters.discount.map(
    (item) => `${parseInt(item)}-${parseInt(item.split("-")[1])}`
  );

  let call = true;

  const filterData = {
    prices,
    brand_names,
    discounts,
    variant_ids,
    sub_attribute_ids,
    tag_ids,
    page: currentPage,
    limit: pageSize,
  };

  useEffect(() => {
    if (!productId) {
      return;
    }
    call = false;
    dispatch(resetSubProductData());
  }, [productId]);

  useEffect(() => {
    if (!productId) {
      return;
    }
    filterData.page = 1;
    filterData.limit = 30;
    if ((productId, call)) {
      if (sidebarRef && sidebarRef.current) {
        menuToggleRef.current.checked = false;
        sidebarRef.current.style.left = "-290px";
      }
      dispatch(handleFilteredProducts(productId, setIsLoading, filterData));
    } else if (
      checkIfFiltersAreEmpty(
        prices,
        brand_names,
        tag_ids,
        tagsFromLocation,
        variant_ids,
        sub_attribute_ids
      )
    ) {
      //Either all filters are empty or tag isn't empty but there is a tag from useLocation state passed
      if (
        filters?.tag?.[0]?.tag_id == tagsFromLocation?.tag_id ||
        (filters?.tag?.length === 1 && tagsFromLocation?.tag_id)
      ) {
        /**
         * Below code runs in 2 cases
         * 1) Either there is one tag in the filters state and that tag is the same as tag passed from Location state
         * 2) There aren't any tags in the state or in the Location
         */
        filterData.tag_ids = tagsFromLocation?.tag_id
          ? [tagsFromLocation?.tag_id]
          : [];
        if (sidebarRef && sidebarRef.current) {
          menuToggleRef.current.checked = false;
          sidebarRef.current.style.left = "-290px";
        }
        dispatch(handleFilteredProducts(productId, setIsLoading, filterData));
      }
    }
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
    if (pageSize !== 30) {
      setPageSize(30);
    }
    if (showPages !== 1) {
      setShowPages(1);
    }
  }, [
    prices.length,
    brand_names.length,
    variant_ids.length,
    sub_attribute_ids.length,
    tag_ids.length,
    discounts.length,
    productId,
  ]);

  let breadcrumbs = categoryBreadcrumbHandler(categoriesFromState, params?.id);

  useEffect(() => {
    if (params?.id) {
      dispatch({ type: CATEGORY_BREADCRUMB, payload: breadcrumbs });
    }
  }, [params.id, categoriesFromState, lastCrumbPath]);

  const dataTransformationFunction = (data) => {
    let tempData = data?.data?.products_data || {};
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
    return tempData;
  };

  const handleRemoveFilter = (action) => {
    setFilters({ ...action });
  };

  const currentlyAppliedFilters = getAllAppliedFilters(
    filters.price,
    filters.tag,
    filters.brand,
    filters.filterBy.variants,
    filters.filterBy.attributes,
    filters.discount
  );

  const transformedData = dataTransformationFunction(subProductData);
  const maxPages = Math.ceil(subProductData.total / pageSize);

  const arrayOfShowPages = [];
  for (let i = showPages; i <= Math.min(maxPages, showPages + 4); i++) {
    arrayOfShowPages.push(i);
  }

  const handlePageLess = () => {
    if (showPages > 1 && maxPages > 5) {
      setShowPages((showPages) => showPages - 1);
    }
  };

  const handleCurrentPageChange = (page) => {
    if (page === currentPage) {
      return;
    }
    filterData.page = page;
    dispatch(handleFilteredProducts(productId, setIsLoading, filterData));
    setCurrentPage(page);
    setShowPages(Math.max(Math.min(page - 2, maxPages - 4), 1));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setOpenSortingOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handlePageSizeChange = (option) => {
    if (option === pageSize) {
      return;
    }

    if (subProductData.total / option - 4 < showPages) {
      setShowPages(Math.max(Math.ceil(subProductData.total / option) - 5, 1));
    }
    setPageSize(option);
    filterData.limit = option;
    if (currentPage > subProductData.total / option) {
      setCurrentPage(Math.ceil(subProductData.total / option));
      filterData.page = Math.ceil(subProductData.total / option);
    }
    dispatch(handleFilteredProducts(productId, setIsLoading, filterData));
  };

  const handlePageIncrease = () => {
    if (showPages < maxPages - 4) {
      setShowPages((showPages) => showPages + 1);
    }
  };

  console.log(transformedData);

  return (
    <div className="col-xl-9 col-lg-9 col-md-8">
      <div className="right" style={{display : (!isLoading && transformedData && transformedData.length === 0) ? "none" : ""}}>
        <div className="search-filter">
          <SearchInput key={params?.id} category={params?.id} />
          <div className="mobile-input">
            <input type="checkbox" id="menu-toggle" ref={menuToggleRef} />
            <label htmlFor="menu-toggle">☰ Filter Search</label>
          </div>
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
          <span className="results">
            {subProductData?.total || " "}
            <small> Products found</small>
          </span>
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
        <div className="pagination">
          <form>
            <select style={{ display: "none" }}>
              {pageSizeOptions.map((option, index) => (
                <option key={index}>Show {option}</option>
              ))}
            </select>
            <div
              className={`nice-select ${openSortingOptions ? "open" : ""}`}
              ref={selectRef}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                setOpenSortingOptions(!openSortingOptions);
              }}
            >
              <span className="current">{pageSize}</span>
              <ul className="list">
                {pageSizeOptions.length > 0 &&
                  pageSizeOptions.map((option) => {
                    return (
                      <li
                        key={option}
                        className={
                          option === pageSize
                            ? "option selected focus"
                            : "option"
                        }
                        onClick={(e) => handlePageSizeChange(option)}
                      >
                        {option}
                      </li>
                    );
                  })}
              </ul>
            </div>
          </form>
          <div className="page-number">
            <Link
              onClick={(e) => {
                e.preventDefault();
                handlePageLess();
              }}
              style={{ cursor: "pointer" }}
            >
              <i className="fa fa-angle-left" />
            </Link>
            {arrayOfShowPages.map((item) => (
              <Link
                key={item}
                style={{ cursor: "pointer" }}
                className={item === currentPage ? "active" : ""}
                onClick={(e) => {
                  e.preventDefault();
                  handleCurrentPageChange(item);
                }}
              >
                {item}
              </Link>
            ))}
            <Link
              onClick={(e) => {
                e.preventDefault();
                handlePageIncrease();
              }}
              style={{ cursor: "pointer" }}
            >
              <i className="fa fa-angle-right" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesProducts;

//  Helper functions
const getAllAppliedFilters = (
  priceFilter = [],
  tagFilter = [],
  brandFilter = [],
  variationFilter = [],
  attributeFilter = [],
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
  for (let i = 0; i < tagFilter.length; i++) {
    tempAppliedFilters.push({
      type: "tag",
      value: tagFilter[i].tag_title,
      payload: tagFilter[i],
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
  let variantKeys = Object.keys(variationFilter || {});
  for (let i = 0; i < variantKeys.length; i++) {
    tempAppliedFilters.push({
      type: "variant",
      value: variationFilter[variantKeys[i]],
      payload: {
        title: variationFilter[variantKeys[i]],
        variant_id: variantKeys[i],
      },
      selected: "true",
    });
  }
  let attributeKeys = Object.keys(attributeFilter || {});
  for (let i = 0; i < attributeKeys.length; i++) {
    tempAppliedFilters.push({
      type: "attribute",
      value: attributeFilter[attributeKeys[i]],
      payload: {
        title: attributeFilter[attributeKeys[i]],
        sub_attribute_id: attributeKeys[i],
      },
      selected: "true",
    });
  }
  return tempAppliedFilters;
};

function transformPriceForApi(string, currencyRate, currencyCode) {
  let newStr = string.split("-");
  let st1 = newStr[0];
  let st2 = newStr[1];
  let amount1 = st1.replace(/[^0-9.]/g, "");
  return `${reconvertAmount(amount1, currencyRate)}-${reconvertAmount(
    parseFloat(st2),
    currencyRate
  )}`;
}

function checkIfFiltersAreEmpty(
  prices,
  brand_names,
  tag_ids,
  tagsFromLocation,
  variant_ids,
  sub_attribute_ids
) {
  if (prices.length !== 0) {
    return false;
  }
  if (brand_names.length !== 0) {
    return false;
  }
  if (variant_ids.length !== 0) {
    return false;
  }
  if (sub_attribute_ids.length !== 0) {
    return false;
  }
  if (tag_ids.length !== 0 && !tagsFromLocation?.tag_id) {
    return false;
  }
  return true;
}
