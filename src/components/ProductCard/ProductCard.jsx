import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import StarRating from "../StarRating/StarRating";
import cartImage from "../../assets/images/cart.png";
import heartImage from "../../assets/images/heart-icon.png";
import stackImage from "../../assets/images/lucide.png";
import { useDispatch, useSelector } from "react-redux";
import { amoutRateConversion } from "../../utils/Helper";
import TextShortener from "../DynamicText/TextShortner";
import {
  ADD_TO_CART,
  DELETE_FAVORITE_PRODUCT,
  POST_FAVORITE_PRODUCT,
} from "../../redux/constant/constants";
import { removeFromCart } from "../../redux/actions/CategoryActions";
import { MyToast, toast } from "../Toast/MyToast";
import dummmyImage from "../../assets/images/no-image1.png";

const ProductCard = ({ productInfo }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isFavoriteProcessing, setIsFavoriteProcessing] = useState(false);

  const currencyRate =
    useSelector(
      (state) => state.siteSettingReducerData?.currentCurrency?.conversion_rate
    ) || 1;
  const currencyCode =
    useSelector(
      (state) =>
        state.siteSettingReducerData?.currentCurrency?.currency_iso_code
    ) || "USD";
  const newOriginalPrice = amoutRateConversion(
    productInfo?.price,
    currencyRate,
    currencyCode
  );

  const favourites = useSelector((state) => state?.handleCartItem?.favorites);
  const cartData = useSelector((state) => state?.handleCartItem?.addToCart);

  const isCarted = cartData.some(
    (item) => item.product_id === productInfo.product_id
  );
  const isFavorite = favourites.some(
    (item) => item.product_id === productInfo.product_id
  );

  const handleTitleClick = () => {
    navigate(`/product/${productInfo?.product_slug}`);
  };

  const newSalePrice = amoutRateConversion(
    productInfo?.sale_price,
    currencyRate,
    currencyCode
  );
  const handleCart = () => {
    if (isCarted) {
      dispatch(removeFromCart(productInfo.product_id));
    } else {
      if (productInfo.product_quantity < 1) {
        MyToast(`Product is out of stock`, "error");
        toast.clearWaitingQueue();
        return;
      }
      dispatch({
        type: ADD_TO_CART,
        payload: productInfo,
        stock: productInfo.product_quantity,
        quantity: 1,
      });
    }
  };

  const handleFavorite = () => {
    if (isFavoriteProcessing) {
      return;
    }
    if (isFavorite) {
      dispatch({
        type: DELETE_FAVORITE_PRODUCT,
        payload: productInfo,
        setIsLoading: setIsFavoriteProcessing,
      });
    } else {
      dispatch({
        type: POST_FAVORITE_PRODUCT,
        payload: productInfo,
        setIsLoading: setIsFavoriteProcessing,
      });
    }
  };

  const handleImageError = (e) => {
    e.target.onerror = null; // prevent infinite loop
    e.target.src = dummmyImage;
  };

  return (
    <div className="product-card " style={{ minHeight: "410px" }}>
      <div className="product-img">
        <Link to={`/product/${productInfo?.product_slug}`}>
          <img
            src={productInfo?.image_path || dummmyImage}
            onError={handleImageError}
          />
        </Link>
      </div>
      <div className="desc bg-white">
        <div className="d-flex justify-content-between align-items-center">
          <div className="mb-0">
            <StarRating rating={productInfo.product_rating} />
            <span>{productInfo?.product_rating.toFixed(1)}</span>
          </div>
          <div className="d-flex align-items-center gap-2">
            {productInfo.variant_combo_id === 0 ? (
              <>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  {isCarted ? (
                    <i
                      className={"fa-solid fa-cart-shopping"}
                      onClick={handleCart}
                    />
                  ) : (
                    <img src={cartImage} onClick={handleCart} />
                  )}
                </Link>
                <Link
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  {isFavorite ? (
                    <i
                      className={`fa-solid fa-heart `}
                      onClick={handleFavorite}
                    />
                  ) : (
                    <img src={heartImage} alt="" onClick={handleFavorite} />
                  )}
                </Link>
              </>
            ) : (
              <Link to={`/product/${productInfo?.product_slug}`}>
                <img src={stackImage} alt="" />
              </Link>
            )}
          </div>
        </div>
        <span className="price">
          {newSalePrice + " "}
          {productInfo?.price &&
            productInfo?.sale_price &&
            productInfo?.price !== productInfo?.sale_price && (
              <del>{newOriginalPrice}</del>
            )}
        </span>
        <div onClick={handleTitleClick} style={{ cursor: "pointer" }}>
          <TextShortener
            text={productInfo?.product_name}
            textLimit={50}
            component={"p"}
            className={""}
            tooltipStyle={{ color: "white", fontSize: "14px", fontWeight: 400 }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
