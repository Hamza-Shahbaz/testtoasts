import React from "react";
import { Link } from "react-router-dom";

function OrderHistoryItem({
  orderId,
  orderStatus,
  orderDate,
  orderTotal,
  onOrderDetailClick,
  color
}) {
  return (
    <div
      className="order-info"
      onClick={onOrderDetailClick}
      style={{ cursor: "pointer" }}
    >
      <div className="orderid" onClick={(e) => {e.preventDefault(); e.stopPropagation()}}>
        <span className="d-lg-none">Order ID: </span>
        <span>{orderId}</span>
      </div>
      <div className="status">
        <span className="d-lg-none">Status:</span>
        <span style={{color : color}}>{orderStatus}</span>
      </div>
      <div className="date">
        <span className="d-lg-none">Date:</span>
        <span>{orderDate}</span>
      </div>
      <div className="total">
        <span className="d-lg-none">Total:</span>
        <span>{orderTotal}</span>
      </div>
      <div className="action">
        <span className="d-lg-none">Action:</span>
        <span>
          <Link to="/order-history-detail">
            View Details <i className="fa fa-angle-right ms-2" />
          </Link>
        </span>
      </div>
    </div>
  );
}

export default OrderHistoryItem;
