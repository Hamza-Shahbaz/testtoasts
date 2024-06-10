import React, { useEffect, useState } from "react";
// import OrderHistoryItem from "./OrderHistoryItem";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { amoutRateConversion } from "../../../utils/Helper";
import { BaseUrl, EndPoints } from "../../../utils/Api";
import { MyToast } from "../../../components/Toast/MyToast";
import loader from "../../../assets/images/loader.gif";

const tabs = [
  { name: "Available Voucher", id: "availableVoucher" },
  { name: "Used Voucher", id: "useVoucher" },
];

const tableHeads = [
  { name: "Voucher Title", className: "orderid" },
  { name: "Code", className: "status" },
  { name: "Minimum Amount", className: "date" },
  { name: "Maximum Amount", className: "date" },
  { name: "Discount", className: "date" },
];

function Coupons() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("Available Voucher");

  // const iconID = useSelector((state) => state.tabsId?.id);

  const [loading, setLoading] = useState(false);
  const [currentItems, setCurrentItems] = useState([]);

  const loginData = useSelector((state) => state.AuthReducerData?.loginUser);

  // const itemsPerPage = 15;

  // const maxPagesToShow = 3;
  // const orderStatusDataLength = currentItems?.length || 0;

  // const [currentPage, setCurrentPage] = useState(1);

  // const totalPages = Math.ceil(orderStatusDataLength / itemsPerPage);

  // const [startPage, setStartPage] = useState(1);
  // const [endPage, setEndPage] = useState(maxPagesToShow);
  // const [endPage, setEndPage] = useState(Math.ceil(maxPagesToShow, totalPages));

  const onTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };

  // const handlePageClick = (pageNumber) => {
  //   onTop();
  //   setCurrentPage(pageNumber);
  // };

  useEffect(() => {
    setCurrentItems([]);
    async function getCoupons() {
      try {
        setLoading(true);
        const response = await fetch(`${BaseUrl}${EndPoints.get_all_coupons}`, {
          headers: { Authentication: loginData?.token },
        });
        const couponsData = await response.json();
        if (couponsData.status) {
          onTop();
          setCurrentItems(couponsData.data.get_coupon);
        }
      } catch (e) {
        MyToast(e.message, "error");
      } finally {
        setLoading(false);
      }
    }
    getCoupons();
  }, []);

  console.log(currentItems)

  // const goToPreviousPage = () => {
  //   if (startPage > 1) {
  //     setStartPage(startPage - 1);
  //     setEndPage(endPage - 1);
  //   }
  // };

  // const goToNextPage = () => {
  //   if (endPage < totalPages) {
  //     setStartPage(startPage + 1);
  //     setEndPage(endPage + 1);
  //   }
  // };

  // const renderPageNumbers = () => {
  //   const pageNumbers = [];
  //   for (let i = startPage; i <= endPage; i++) {
  //     pageNumbers.push(
  //       <Link
  //         key={i}
  //         className={i === currentPage ? "active" : ""}
  //         onClick={() => handlePageClick(i)}
  //       >
  //         {String(i).padStart(2, "0")}
  //       </Link>
  //     );
  //   }
  //   return pageNumbers;
  // };

  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const endIndex = startIndex + itemsPerPage;

  //   const currentItems = orderStatusData
  //     ? Object.values(orderStatusData).slice(startIndex, endIndex)
  //     : [];

  // const currentItemsSort = currentItems.sort((a, b) => {
  //   return new Date(b.created_at) - new Date(a.created_at);
  // });


  return !loading ? (
    <div className="order-history voucher-details">
      <div className="row">
        <div className="col-xl-12 col-lg-12 col-md-12">
          <div className="recent-order">
            <div className="top-heading">
              <span>COUPON DETAILS</span>
            </div>
            <div className="voucher-tabs">
              <ul className="nav nav-tabs">
                {tabs.map((item) => (
                  <li
                    className="nav-item"
                    onClick={(e) => setActiveTab(item.name)}
                  >
                    <button
                      className={`nav-link tabTextStyle ${
                        activeTab === item.name ? "active" : ""
                      }`}
                      data-bs-target={`#${item.id}`}
                      aria-controls={`${item.id}`}
                    >
                      {item.name}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="tab-content">
                {activeTab == "Available Voucher" ? (
                  <div
                    className="tab-pane fade active show"
                    aria-labelledby="availableVoucher-tab"
                  >
                    <div className="order-titles d-lg-flex d-none">
                      {tableHeads.map((item) => (
                        <div
                          className={`d-flex justify-content-center ${item.className}`}
                        >
                          <span className="text-capitalize">{item.name}</span>
                        </div>
                      ))}
                    </div>

                    {currentItems?.length > 0 ? (
                      currentItems
                        ?.filter((item) => !item.used_coupon_id)
                        .map((item) => <CouponItem item={item} />)
                    ) : (
                      <div className="container justify-content-center mt-4">
                        <div className="d-flex justify-content-center my-4 mb-2">
                          <p className="reviewTextStyle">
                            No available Coupons yet!
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="tab-pane fade active show"
                    aria-labelledby="availableVoucher-tab"
                  >
                    <div className="order-titles d-lg-flex d-none">
                      {tableHeads.map((item) => (
                        <div className={`d-flex justify-content-center ${item.className}`}>
                          <span className="text-capitalize">{item.name}</span>
                        </div>
                      ))}
                    </div>
                    
                         {currentItems?.length ? (
                          currentItems
                            ?.filter((item) => item.used_coupon_id)
                            .map((item) => <CouponItem item={item} />)
                        ) : (
                          <div className="container justify-content-center mt-4">
                            <div className="d-flex justify-content-center my-4 mb-2">
                              <p className="reviewTextStyle">
                                No used Coupons yet!
                              </p>
                            </div>
                          </div>
                        )}
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* <div className="order-pagination justify-content-center mt-5">
            <div className="page-number">
              {totalPages > maxPagesToShow && (
                <Link
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.preventDefault();
                    goToPreviousPage();
                  }}
                >
                  <i className="fa fa-angle-left" />
                </Link>
              )}

              {renderPageNumbers()}

              {totalPages > maxPagesToShow && (
                <Link
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    e.preventDefault();
                    goToNextPage();
                  }}
                >
                  <i className="fa fa-angle-right" />
                </Link>
              )}
            </div>
          </div>
          {orderStatusDataLength > itemsPerPage && (
            <div className="order-pagination justify-content-center mt-5">
              <div className="page-number">
                {totalPages > maxPagesToShow && (
                  <Link
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.preventDefault();
                      goToPreviousPage();
                    }}
                  >
                    <i className="fa fa-angle-left" />
                  </Link>
                )}

                {renderPageNumbers()}

                {totalPages > maxPagesToShow && (
                  <Link
                    style={{ cursor: "pointer" }}
                    onClick={(e) => {
                      e.preventDefault();
                      goToNextPage();
                    }}
                  >
                    <i className="fa fa-angle-right" />
                  </Link>
                )}
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  ) : ( 
  <div className="container mt-3">
  <div className="row">
    <div className="col-xl-12 col-lg-12 col-md-12 d-flex justify-content-center">
      <img
        src={loader}
        alt="Loading Related Products"
        style={{ width: "100px" }}
      />
    </div>
  </div>
</div>)
}

export default Coupons;

function CouponItem({ item }) {
  const currencyRate =
    useSelector(
      (state) => state.siteSettingReducerData?.currentCurrency?.conversion_rate
    ) || 1;

  const currencyCode =
    useSelector(
      (state) =>
        state.siteSettingReducerData?.currentCurrency?.currency_iso_code
    ) || "USD";
  return (
    <div className="order-info">
      <div className="orderid">
        <span className="d-lg-none">Voucher Title: </span>
        <span className="d-flex justify-content-center">{item.coupon_title}</span>
      </div>
      <div className="status">
        <span className="d-lg-none">Code: </span>
        <span  className="d-flex justify-content-center">
          {item.code_number || ""}
        </span>
      </div>
      <div className="date">
        <span className="d-lg-none">Minumum Amount: </span>
        <span className="d-flex justify-content-center">
          {amoutRateConversion(item.min_value || 0, currencyRate, currencyCode)}
        </span>
      </div>
      <div className="date">
        <span className="d-lg-none">Maximum Amount: </span>
        <span className="d-flex justify-content-center">
          {amoutRateConversion(item.max_value || 0, currencyRate, currencyCode)}
        </span>
      </div>
      <div className="date">
        <span className="d-lg-none">Discount: </span>
        <span className="d-flex justify-content-center">{item.discount || 0}</span>
      </div>
    </div>
  );
}
