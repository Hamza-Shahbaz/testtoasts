import React from "react";
import { useSelector } from "react-redux";
import TextShortener from "../../../../components/DynamicText/TextShortner";

function TrackOrderBottom() {
  const loginData = useSelector((state) => state.AuthReducerData.loginUser);

  const trackOrderdata = useSelector(
    (state) => state.OrderReducerData.trackOrderData
  );

  const orderBillingData = trackOrderdata?.order_head_data?.addresses?.billing;

  const orderShippingData =
    trackOrderdata?.order_head_data?.addresses?.shipping;

  return (
    <>
      <div className="info-inner">
        <span className="heading">Billing Address</span>
        <span className="mb-2 d-block">
          {(trackOrderdata &&
            loginData &&
            loginData?.first_name + " " + (loginData?.last_name || "")) ||
            ""}
        </span>
        <TextShortener
          text={
            (trackOrderdata && orderBillingData?.street_address) ||
            "No Address Found"
          }
          textLimit={70}
          component={"p"}
          className={"mb-2"}
          tooltipStyle={{
            color: "white",
            fontSize: "14px",
            fontWeight: 400,
          }}
        />
        <div className="d-flex align-items-center mt-3">
          <span>Email:</span>
          <p className="ms-2">
            <TextShortener
              text={
                (trackOrderdata &&
                  orderBillingData &&
                  orderBillingData?.email) ||
                loginData?.email ||
                null
              }
              textLimit={55}
              component={"p"}
              className={"ms-2"}
              tooltipStyle={{
                color: "white",
                fontSize: "14px",
                fontWeight: 400,
              }}
            />
          </p>
        </div>
        <div className="d-flex align-items-center mt-3">
          <span>Phone:</span>
          <p className="ms-2">
            {(trackOrderdata && orderBillingData?.phone_number) || null}
          </p>
        </div>
      </div>
      <div className="info-inner styleFooter">
        <span className="heading">Shipping Address</span>
        <span className="mb-2 d-block">
          {(trackOrderdata &&
            loginData &&
            loginData?.first_name + " " + (loginData?.last_name || "")) ||
            ""}
        </span>
        <TextShortener
          text={
            (trackOrderdata && orderShippingData?.street_address) ||
            "No Address Found"
          }
          textLimit={70}
          component={"p"}
          className={"mb-2"}
          tooltipStyle={{
            color: "white",
            fontSize: "14px",
            fontWeight: 400,
          }}
        />
        <div className="d-flex align-items-center mt-3">
          <span>Email:</span>
          <p className="ms-2">
            <TextShortener
              text={
                (trackOrderdata &&
                  orderShippingData &&
                  orderShippingData?.email) ||
                loginData?.email ||
                null
              }
              textLimit={55}
              component={"p"}
              className={"ms-2"}
              tooltipStyle={{
                color: "white",
                fontSize: "14px",
                fontWeight: 400,
              }}
            />
          </p>
        </div>
        <div className="d-flex align-items-center mt-3">
          <span>Phone:</span>
          <p className="ms-2">
            {(trackOrderdata && orderShippingData?.phone_number) || null}
          </p>
        </div>
      </div>
    </>
  );
}

export default TrackOrderBottom;
