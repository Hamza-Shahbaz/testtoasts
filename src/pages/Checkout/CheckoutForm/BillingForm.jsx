import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ADD_ADDRESS_SUCCESS } from "../../../redux/constant/constants";
import { MyToast, toast } from "../../../components/Toast/MyToast";
import {
  handleGetAddressData,
  handleGlobalId,
  handleIconId,
  handlePath,
  handleSelectedAddressId,
  handleSetAddAddress,
} from "../../../redux/actions/AuthAction";
import { AiOutlinePlusCircle } from "react-icons/ai";
import loader from "../../../assets/images/loader.gif";
import { saveAddress } from "../../../redux/actions/OrderAction";

const BillingForm = ({ setActiveSection, setAllowNavigation, location }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginData = useSelector((state) => state.AuthReducerData?.loginUser);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  const addressesData = useSelector(
    (state) => state.addressesReducerData?.addressesData
  );

  const allAddresses = addressesData?.addresses || {};

  useEffect(() => {
    if (loginData?.token && Object.keys(allAddresses)?.length === 0) {
      dispatch(
        handleGetAddressData(loginData?.token, setLoading, dispatch, navigate)
      );
    }
  }, [loginData?.token]);

  useEffect(() => {
    if (!loginData?.token) {
      navigate("/login");
    }
  }, [loginData?.token]);

  // useEffect(() => {
  //   if (loginData?.token) {
  //     dispatch(
  //       handleGetAddressData(loginData?.token, setLoading, dispatch, navigate)
  //     );
  //   }
  // }, [loginData?.token]);

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [selectedBillingAddress, setSelectedBillingAddress] = useState("");

  const [showBillingAdrress, setShowBillingAddress] = useState(false);

  useEffect(() => {
    if (allAddresses) {
      setSelectedAddressId(allAddresses?.[0]?.address_id);
    }
  }, [addressesData]);

  const handleSubmit = () => {
    if (allAddresses?.length < 1) {
      MyToast("Please add address in account settings");
      toast.clearWaitingQueue();
      return;
    }
    const address = {
      shipping_address_id: selectedAddressId,
      billing_address_id: selectedBillingAddress || selectedAddressId,
    };
    
    dispatch(saveAddress(allAddresses.filter((item) => item.address_id === selectedAddressId)[0]))
    setIsLoading(true);
    dispatch({ type: ADD_ADDRESS_SUCCESS, payload: address });
    setIsLoading(false);
    setActiveSection("Payment");
  };

  // useEffect(() => {
  //   async function getalladdrss() {
  //     // setIsLoading(true)
  //     try {
  //       const response = await fetch(BaseUrl + EndPoints.get_all_addresses, {
  //         headers: { Authentication: loginData?.token },
  //       });
  //       const decoded = await response.json();
  //       if (decoded.status) {
  //         setAllAddresses(decoded.data.addresses);
  //         setSelectedAddressId(decoded.data.addresses?.[0].address_id);
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     } finally {
  //       // setIsLoading(true)
  //     }
  //   }

  //   getalladdrss();
  // }, []);

  return (
    <>
      <div className="accordion" id="accordionExample">
        <div className="row justify-content-center">
          <div className="col-xl-12 col-lg-12 col-md-12">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="true"
                  aria-controls="collapseOne"
                >
                  Choose your address
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <div className="radio-btn">
                    {!loading && addressesData ? (
                      allAddresses?.length ? (
                        allAddresses.map((item) => {
                          return (
                            <div
                              className="mb-4 w-100"
                              key={`${item.address_id}_shippingAddress`}
                            >
                              <div className="card">
                                <div className="card-body">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="shippingAddress"
                                      checked={
                                        item.address_id === selectedAddressId
                                      }
                                      onChange={() => {
                                        setSelectedAddressId(item.address_id);
                                      }}
                                    />
                                    <label
                                      className="form-check-label"
                                      style={{ wordBreak: "break-word" }}
                                    >
                                      <strong>{item?.name || ""}</strong>
                                      <br />
                                      {`${item.street_address}, ${item.city}, ${item.state}, ${item.country}`}
                                      <br />
                                    </label>

                                    <div
                                      style={{
                                        cursor: "pointer",
                                        textDecoration: "none",
                                        fontSize: "15px",
                                        fontWeight: "600",
                                        color: "#219ebc",
                                        width: "100px",
                                      }}
                                      id="edit-address-id"
                                      className="pt-1"
                                      onClick={(event) => {
                                        const addressId =
                                          event.currentTarget.id;
                                        if (loginData?.token) {
                                          navigate("/my-account");
                                          dispatch(handleGlobalId(addressId));
                                          dispatch(
                                            handleIconId("v-pills-address")
                                          );
                                          dispatch(handleSetAddAddress(true));
                                          dispatch(
                                            handlePath(location || "/checkout")
                                          );

                                          dispatch(
                                            handleSelectedAddressId(
                                              item?.address_id
                                            )
                                          );
                                        } else {
                                          navigate("/login");
                                        }
                                      }}
                                    >
                                      Edit Address
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
                          <p className="reviewTextStyle">
                            No Addresses found yet!
                          </p>
                        </div>
                      )
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
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      cursor: "pointer",
                      color: "#219ebc",
                      maxWidth: "32%",
                    }}
                    id="edit-address-id"
                    className="new-address d-flex align-items-center"
                    onClick={(event) => {
                      const addressId = event.currentTarget.id;
                      if (loginData?.token) {
                        navigate("/my-account");
                        dispatch(handleGlobalId(addressId));
                        dispatch(handleIconId("v-pills-address"));
                        dispatch(handleSetAddAddress(true));
                        dispatch(handleSelectedAddressId(null));
                        dispatch(handlePath(location || "/my-account"));
                      } else {
                        navigate("/login");
                      }
                    }}
                  >
                    <AiOutlinePlusCircle
                      size={25}
                      style={{ marginRight: "5px" }}
                    />
                    Add a new address
                  </div>
                  <hr style={{ color: "#e4e7e9" }} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-12 col-lg-12 col-md-12">
            <div className="form-check mb-3">
              <input
                className="form-check-input"
                type="checkbox"
                checked={!showBillingAdrress}
                onChange={(e) => setShowBillingAddress(!showBillingAdrress)}
              />
              <label className="form-check-label">
                Use Same Address for Billing
              </label>
            </div>
          </div>
          {showBillingAdrress && (
            <div className="col-xl-12 col-lg-12 col-md-12">
              <div className="accordion-item">
                <h2 className="accordion-header" id="headingTwo">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    Choose a billing address
                  </button>
                </h2>
                <div
                  id="collapseTwo"
                  className="accordion-collapse collapse"
                  aria-labelledby="headingTwo"
                  data-bs-parent="#accordionExample"
                >
                  <div className="accordion-body">
                    <h2>Your Address</h2>
                    <div className="radio-btn">
                      {allAddresses?.length ? (
                        allAddresses.map((item) => {
                          return (
                            <div
                              className="mb-4 w-100"
                              key={`${item.address_id}_shippingAddress`}
                            >
                              <div className="card">
                                <div className="card-body">
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="radio"
                                      name="billingAddress"
                                      checked={
                                        item.address_id ===
                                        selectedBillingAddress
                                      }
                                      onChange={() => {
                                        setSelectedBillingAddress(
                                          item.address_id
                                        );
                                      }}
                                    />
                                    <label
                                      className="form-check-label"
                                      style={{ wordBreak: "break-word" }}
                                    >
                                      <strong>{item?.name || ""}</strong>
                                      <br />
                                      {`${item.street_address}, ${item.city}, ${item.state}, ${item.country}`}
                                      <br />
                                    </label>

                                    <div
                                      style={{
                                        cursor: "pointer",
                                        textDecoration: "none",
                                        fontSize: "15px",
                                        fontWeight: "600",
                                        color: "#219ebc",
                                        width: "100px",
                                      }}
                                      id="edit-address-id"
                                      className="pt-1"
                                      onClick={(event) => {
                                        const addressId =
                                          event.currentTarget.id;
                                        if (loginData?.token) {
                                          navigate("/my-account");
                                          dispatch(handleGlobalId(addressId));
                                          dispatch(
                                            handleIconId("v-pills-address")
                                          );
                                          dispatch(handleSetAddAddress(true));
                                          dispatch(
                                            handlePath(location || "/checkout")
                                          );

                                          dispatch(
                                            handleSelectedAddressId(
                                              item?.address_id
                                            )
                                          );
                                        } else {
                                          navigate("/login");
                                        }
                                      }}
                                    >
                                      Edit Address
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            marginTop: "10px",
                          }}
                        >
                          <p className="reviewTextStyle">
                            No Addresses found yet!
                          </p>
                        </div>
                      )}
                    </div>
                    <div
                      style={{
                        cursor: "pointer",
                        color: "#219ebc",
                        maxWidth: "32%",
                      }}
                      id="edit-address-id"
                      className="new-address d-flex align-items-center"
                      onClick={(event) => {
                        const addressId = event.currentTarget.id;
                        if (loginData?.token) {
                          navigate("/my-account");
                          dispatch(handleGlobalId(addressId));
                          dispatch(handleIconId("v-pills-address"));
                          dispatch(handleSetAddAddress(true));
                          dispatch(handleSelectedAddressId(null));
                          dispatch(handlePath(location || "/my-account"));
                        } else {
                          navigate("/login");
                        }
                      }}
                    >
                      <AiOutlinePlusCircle
                        size={25}
                        style={{ marginRight: "5px" }}
                      />
                      Add a new Billing address
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="col-md-12">
          <div className="mb-3">
            <button
              className="btn btn-theme w-100"
              disabled={isLoading}
              onClick={handleSubmit}
            >
              {isLoading ? (
                <CustomLoader size={10} color={"#ffb703"} />
              ) : (
                <>Confirm address selections</>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default BillingForm;
