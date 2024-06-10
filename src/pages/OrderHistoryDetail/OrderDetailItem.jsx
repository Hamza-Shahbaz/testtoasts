import React from "react";
import dummmyImage from "../../assets/images/no-image1.png";

function OrderDetailItem({
  productImage,
  productName,
  productPrice,
  productQuantity,
  totalProduct,
  productDiscount,
}) {
  const handleImageError = (e) => {
    e.target.onerror = null; // prevent infinite loop
    e.target.src = dummmyImage;
  };
  return (
    <div className="cart-info">
      <div className="product-info">
        <img
          src={productImage ? productImage : dummmyImage}
          onError={handleImageError}
        />
        {productName && <p>{productName}</p>}
      </div>
      <div className="price-info">
        <span className="d-lg-none">Price: </span>
        <span>
          {productPrice === productDiscount ? (
            <span>{productPrice || "0"}</span>
          ) : (
            <>
              <del>{productPrice}</del> {productDiscount || "0"}
            </>
          )}
        </span>
      </div>
      <div className="p-quantity">
        <span className="d-lg-none">Quantity: </span>
        <span>{productQuantity}</span>
      </div>
      <div className="product-sub-total">
        <span className="d-lg-none">Total: </span>
        <span>{totalProduct || null}</span>
      </div>
    </div>
  );
}

export default OrderDetailItem;
