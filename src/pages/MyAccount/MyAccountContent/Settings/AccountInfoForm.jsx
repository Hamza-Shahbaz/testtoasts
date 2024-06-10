import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaUserCircle } from "react-icons/fa";
import PhoneInput from "react-phone-input-2";
import { handleInfoUpdate } from "../../../../redux/actions/AuthAction";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomLoader from "../../../../components/Toast/CustomLoader";

function AccountInfoForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const loginData = useSelector((state) => state.AuthReducerData.loginUser);

  const [phoneError, setPhoneError] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(
    loginData?.phone || loginData?.phone_number || ""
  );

  const initialValue = {
    firstname: loginData?.first_name || "",
    lastname: loginData?.last_name || "",
    address: loginData?.street_address || "",
    country: loginData?.country || "",
    state: loginData?.state || "",
    city: loginData?.city || "",
    zipcode: loginData?.zipcode || "",
  };

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({ defaultValues: initialValue });

  const zipcode = watch("zipcode");

  const onSubmit = (data) => {
    if (!phoneNumber) {
      setPhoneError(true);
      return;
    }

    dispatch(
      handleInfoUpdate(
        data,
        setLoading,
        loginData?.token,
        navigate,
        setValue,
        phoneNumber
      )
    );
  };

  return (
    <div className="settings-inner">
      <div className="top-heading">
        <span>ACCOUNT SETTING</span>
      </div>
      <div className="info-inner">
        <div className="row justify-content-center">
          <div className="col-xl-3 col-lg-3 col-md-3 col-6">
            <div className="profile-img">
              {/* <img src="../assets/images/profile-img.png" alt="" /> */}
              <div className="d-flex justify-content-center ">
                <FaUserCircle
                  style={{
                    width: "170px",
                    height: "170px",
                  }}
                />
              </div>
            </div>
          </div>
          <div className="col-xl-9 col-lg-9 col-md-9">
            <div className="profile-form">
              <form
                action="submit"
                className="needs-validation"
                noValidate=""
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="row">
                  <div className="col-xl-6 col-md-12">
                    <div className="mb-4">
                      <label>
                        First Name: <span className="passtextColor">*</span>
                      </label>
                      <input
                        placeholder="Enter First Name"
                        {...register("firstname", {
                          required: "First Name is required",
                          pattern: {
                            value: /^[a-zA-Z]*$/,
                            message:
                              "First Name must consist of only Alphabets",
                          },
                          maxLength: {
                            value: 50,
                            message: "First Name Must be upto 50 characters",
                          },
                        })}
                        className="form-control"
                        maxLength={51}
                      />
                      {errors?.firstname && (
                        <p
                          className="mt-1 mx-1"
                          style={{ color: "red", fontWeight: "400" }}
                        >
                          {errors?.firstname?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-xl-6 col-md-12">
                    <div className="mb-4">
                      <label>Last Name:</label>
                      <input
                        placeholder="Enter Last Name"
                        {...register("lastname", {
                          pattern: {
                            value: /^[a-zA-Z]*$/,
                            message: "Last Name must consist of only Alphabets",
                          },
                          maxLength: {
                            value: 50,
                            message: "Last Name Must be upto 50 characters",
                          },
                        })}
                        className="form-control"
                        maxLength={51}
                      />
                      {errors?.lastname && (
                        <p
                          className="mt-1 mx-1"
                          style={{ color: "red", fontWeight: "400" }}
                        >
                          {errors?.lastname?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* <div className="col-xl-6 col-md-12">
                          <div className="mb-4">
                            <label>Email</label>
                            <input
                              type="email"
                              className="form-control"
                              name="email"
                              pattern="[^\s@]+@[a-zA-Z]+[^0-9@]+\.[cC][oO][mM]$"
                              placeholder="Enter Email*"
                              required=""
                            />
                          </div>
                        </div> */}
                  {/* <div className="col-xl-6 col-md-12">
                          <div className="mb-4">
                            <label>Secondary Email</label>
                            <input
                              type="text"
                              className="form-control"
                              name="name"
                              pattern="[^\s@]+@[a-zA-Z]+[^0-9@]+\.[cC][oO][mM]$"
                              placeholder="Enter Secondary Email"
                              required=""
                            />
                          </div>
                        </div> */}

                  {/* <div className="col-xl-12 col-md-12">
                    <div className="mb-4 d-flex flex-column">
                      <label>
                        Country: <span className="passtextColor">*</span>
                      </label>
                      <select style={{ display: "none" }}>
                              <option data-display="Select Country/Region">
                                Select Country/Region
                              </option>
                              <option>Pakistan</option>
                              <option>Canada</option>
                              <option>Germany</option>
                              <option>France</option>
                            </select>
                            <div className="nice-select" tabIndex={0}>
                              <span className="current">
                                Select Country/Region
                              </span>
                              <ul className="list">
                                <li
                                  data-value="Select Country/Region"
                                  data-display="Select Country/Region"
                                  className="option selected"
                                >
                                  Select Country/Region
                                </li>
                                <li data-value="Pakistan" className="option">
                                  Pakistan
                                </li>
                                <li data-value="Canada" className="option">
                                  Canada
                                </li>
                                <li data-value="Germany" className="option">
                                  Germany
                                </li>
                                <li data-value="France" className="option">
                                  France
                                </li>
                              </ul>
                            </div> 
                      <input
                        placeholder="Enter Country"
                        {...register("country", {
                          required: "Country is required",
                          pattern: {
                            value: /^[a-zA-Z]*$/,
                            message: "Country must consist of only Alphabets",
                          },
                        })}
                        className="form-control"
                      />
                      {errors?.country && (
                        <p
                          className="mt-1 mx-1"
                          style={{ color: "red", fontWeight: "400" }}
                        >
                          {errors?.country?.message}
                        </p>
                      )}
                    </div>
                  </div> */}

                  {/* <div className="col-xl-6 col-md-12">
                    <div className="mb-4 d-flex flex-column">
                      <label>
                        State: <span className="passtextColor">*</span>
                      </label>
                      <input
                        placeholder="Enter State"
                        {...register("state", {
                          required: "State is required",
                          pattern: {
                            value: /^[a-zA-Z]*$/,
                            message: "State must consist of only Alphabets",
                          },
                        })}
                        className="form-control"
                      />
                      {errors?.state && (
                        <p
                          className="mt-1 mx-1"
                          style={{ color: "red", fontWeight: "400" }}
                        >
                          {errors?.state?.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="col-xl-6 col-md-12">
                    <div className="mb-4 d-flex flex-column">
                      <label>
                        City: <span className="passtextColor">*</span>
                      </label>
                      <input
                        placeholder="Enter City"
                        {...register("city", {
                          required: "City is required",
                          pattern: {
                            value: /^[a-zA-Z]*$/,
                            message: "City must consist of only Alphabets",
                          },
                        })}
                        className="form-control"
                      />
                      {errors?.city && (
                        <p
                          className="mt-1 mx-1"
                          style={{ color: "red", fontWeight: "400" }}
                        >
                          {errors?.city?.message}
                        </p>
                      )}
                    </div>
                  </div> */}

                  <div className="col-xl-6 col-md-12">
                    <div className="mb-4">
                      <label>
                        Phone Number: <span className="passtextColor">*</span>
                      </label>
                      <PhoneInput
                        placeholder={"Enter Phone Number"}
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e);
                          if (phoneError) {
                            setPhoneError(false);
                          }
                        }}
                        countryCodeEditable={true}
                        searchStyle={{ width: "88%" }}
                        // className={"form-control"}
                        enableSearch={true}
                        // buttonStyle={{
                        //   top: "12px",
                        //   height: "35px",
                        //   padding: "0px",
                        // }}
                        // country={"us"}
                        inputStyle={{
                          // padding: "22px",
                          height: "50px",
                          // paddingTop: "23px",
                          // paddingBottom: "23px",
                          borderRadius: "0px",
                          width: "100%",
                          // paddingLeft: "48px",
                          fontSize: "1rem",
                          fontWeight: 500,
                          // fontFamily: "Poppins-Medium",
                          border: "1px solid #e4e7e9",
                          color: "#e4e7e9",
                        }}
                        buttonStyle={{ padding: "2px" }}
                        dropdownStyle={{ width: "333px" }}
                        dropdownClass="loginn"
                      />
                      {phoneError && (
                        <p role="alert" style={{ color: "red" }}>
                          Phone number is required
                        </p>
                      )}
                    </div>
                  </div>
                  {/* <div className="col-xl-6 col-md-12">
                    <div className="mb-4">
                      <label>
                        Zip Code: <span className="passtextColor">*</span>
                      </label>
                      <input
                        placeholder="Enter Zip Code"
                        {...register("zipcode", {
                          required: "Zip Code is required",
                          maxLength: {
                            value: 5,
                            message: "Zip code must be max 5 digits",
                          },
                        })}
                        className="form-control"
                      />
                      {errors?.zipcode && (
                        <p
                          className="mt-1 mx-1"
                          style={{ color: "red", fontWeight: "400" }}
                        >
                          {errors?.zipcode?.message}
                        </p>
                      )}
                    </div>
                  </div> */}

                  <div className="col-md-12">
                    <div className="mb-0">
                      <button type="submit" className="btn btn-theme-yellow">
                        {loading ? (
                          <CustomLoader
                            size={10}
                            color={"#219ebc"}
                            style={{ padding: "10px 38px" }}
                          />
                        ) : (
                          <>SAVE CHANGES</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountInfoForm;
