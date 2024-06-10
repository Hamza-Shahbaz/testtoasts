import { put, takeEvery, call, select } from "redux-saga/effects";
import {
  FORGOT_PASSWORD,
  GET_ADDRESS_DATA,
  GET_DASHBOARD_DATA,
  GET_FAVORITES,
  GET_SITESETTINGS,
  GET_WORKQUEUE,
  GUEST_LOGIN_REQUESTING,
  LOGIN_REQUESTING,
  REGISTER_USER,
  REMOVE_ADDRESS_DATA,
  RESET_PASSWORD,
  SET_ADDRESS_DATA,
  SET_DASHBOARD_DATA,
  SET_FORGOT_PASSWORD,
  SET_REGISTER_USER,
  SET_RESET_PASSWORD,
  SET_SITESETTINGS,
  SET_UPDATE_INFO,
  SUBSCRIBE_TO_NEWSLETTER,
  UPDATE_INFO,
  UPDATING_CART,
} from "../constant/constants";
import { BaseUrl, EndPoints } from "../../utils/Api";
import axios from "axios";
import {
  CartUpdatingSuccess,
  guestLoginFailure,
  guestLoginSuccess,
  handleGetAddressData,
  handleGetWorkQueue,
  handlelocallyRemoveAddressId,
  loginSuccess,
  logoutHandlerAction,
} from "../actions/AuthAction";
// import Swal from "sweetalert2";
import {
  clearOrderDataHandler,
  fetchOrderDataRequest,
} from "../actions/OrderAction";
import { MyToast, toast } from "../../components/Toast/MyToast";

//////////////// API Function For Register //////////////////

function* handleRegister({
  data,
  setLoading,
  setActiveTab,
  phoneNumber,
  dispatch,
}) {
  setLoading(true);
  try {
    const registerResponse = yield call(
      fetch,
      `${BaseUrl}${EndPoints.registerUser}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          first_name: data?.firstname,
          last_name: data?.lastname,
          email: data?.email,
          phone_number: phoneNumber,
          password: data?.password,
          confirm_password: data?.confirmpassword,
        }),
      }
    );
    const response = yield registerResponse.json();

    if (response?.status) {
      yield put({ type: SET_REGISTER_USER, payload: response });
      setLoading(false);
      dispatch(handleGetWorkQueue());
      setActiveTab("signin");
    } else {
      setLoading(false);
      MyToast(response?.message, "error");
      toast.clearWaitingQueue();
    }
  } catch (err) {
    setLoading(false);
    MyToast(response?.message, "error");
    toast.clearWaitingQueue();
  }
}

//////////////// API Function For Login //////////////////

function* handleLogin({ payload, meta }) {
  const { setLoading, navigate } = meta;
  const { data, path, isGoogle, bearerToken } = payload;

  setLoading(true);

  try {
    const postData = {
      email: data?.email,
      password: data?.password,
    };

    const formData = new FormData()
    if(isGoogle) {
      formData.append("bearer-token", bearerToken)
    }

    const response = isGoogle ? yield call(fetch, `${BaseUrl}${EndPoints.google_login}`, {
      method: "POST",
      body: formData,
    }) : yield call(fetch, `${BaseUrl}${EndPoints.login}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    const resData = yield response.json();

    if (resData?.status) {
      yield put(loginSuccess(resData?.data));
      setLoading(false);
      localStorage.setItem("username", resData?.data?.first_name);
      localStorage.setItem("isLogin", resData?.data?.token);
      yield put({ type: GET_FAVORITES });
      if (path && !path.endsWith("signup") && !path.endsWith("signin")) {
        navigate(`${path}`);
      } else {
        navigate("/my-account");
      }
    } else {
      setLoading(false);
      MyToast(resData?.message, "error");
      toast.clearWaitingQueue();
    }
  } catch (err) {
    setLoading(false);
    MyToast(err?.message, "error");
    toast.clearWaitingQueue();
  }
}

function* fetchAllCoupons({ setIsLoading }) {
  const token = yield select((state) => state.AuthReducerData.loginUser?.token);
  // setIsLoading(true)
  try {
    const response = yield call(
      fetch,
      `${BaseUrl}${EndPoints.get_all_coupons}`,
      {
        method: "GET",
        headers: { Authentication: token },
      }
    );

    const couponsData = yield response.json();
    if (couponsData.state) {
    }
  } catch (e) {
    MyToast(e.message, "error");
  } finally {
    // setIsLoading(false)
  }
}

//////////////// API Function For Forgot Password //////////////////

function* handleForgotPass({ data, setLoading, navigate, dispatch }) {
  setLoading(true);
  try {
    const forgotPassResponse = yield call(
      fetch,
      `${BaseUrl}${EndPoints.forgotPassword}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data?.email,
        }),
      }
    );
    const response = yield forgotPassResponse.json();
    if (response?.status) {
      yield put({ type: SET_FORGOT_PASSWORD, payload: response });
      MyToast(response?.message, "success");
      toast.clearWaitingQueue();
      dispatch(handleGetWorkQueue());
      setLoading(false);
      navigate("/login");
    } else {
      setLoading(false);
      MyToast(response?.message, "error");
      toast.clearWaitingQueue();
    }
  } catch (err) {
    setLoading(false);
    MyToast(err, "error");
    toast.clearWaitingQueue();
  }
}

//////////////// API Function For UPDATE PROFILE //////////////////

function* handleUpdate({
  data,
  setLoading,
  token,
  navigate,
  setValue,
  phoneNumber,
}) {
  setLoading(true);
  try {
    const formData = new FormData();
    formData.append("first_name", data.firstname);
    formData.append("last_name", data.lastname);
    formData.append("street_address", data.address);
    formData.append("country", data.country);
    formData.append("state", data.state);
    formData.append("city", data.city);
    formData.append("phone", phoneNumber);
    formData.append("zipcode", data.zipcode);
    formData.append("existing_password", data.curentpassword);
    formData.append("new_password", data.newpassword);
    formData.append("confirm_password", data.confirmpassword);
    formData.append("password_is_changed", data.curentpassword ? 1 : 0);

    const updateResponse = yield call(
      fetch,
      `${BaseUrl}${EndPoints.updateProfile}`,
      {
        method: "POST",
        body: formData,
        headers: {
          Authentication: token,
        },
      }
    );
    const response = yield updateResponse.json();

    if (response?.status) {
      yield put({ type: SET_UPDATE_INFO, payload: response });
      yield put(loginSuccess(response?.data));
      setLoading(false);
      setValue("curentpassword", "");
      setValue("newpassword", "");
      setValue("confirmpassword", "");
      MyToast(response?.message, "success");
      toast.clearWaitingQueue();
      // setresetAllFields(true);
    } else if (
      response?.status == "401" ||
      response?.status == "403" ||
      response?.message === "Unauthorized"
    ) {
      navigate("/");
      dispatch(logoutHandlerAction());
      dispatch(clearOrderDataHandler());
    } else {
      setLoading(false);
      MyToast(response?.message, "error");
      toast.clearWaitingQueue();
    }
  } catch (err) {
    setLoading(false);
    MyToast(response?.message, "error");
    toast.clearWaitingQueue();
  }
}

/////API function for fetch Dashboard Data/////////////
function* handleDashboard_Data({ token, navigate, dispatch, setDataLoading }) {
  try {
    setDataLoading(true);
    const response = yield call(
      fetch,
      `${BaseUrl}${EndPoints.dashboard_data}`,
      {
        method: "GET",
        headers: { Authentication: token },
      }
    );

    const dashboardData = yield response.json();

    if (dashboardData?.status) {
      setDataLoading(false);
      yield put({ type: SET_DASHBOARD_DATA, payload: dashboardData?.data });
    } else if (
      response?.status == "401" ||
      response?.status == "403" ||
      response?.message === "Unauthorized"
    ) {
      setDataLoading(false);
      navigate("/");
      dispatch(logoutHandlerAction());
      dispatch(clearOrderDataHandler());
    } else {
      setDataLoading(false);
    }
  } catch (error) {
    setDataLoading(false);

    console.error("Frontend Error: handleDashboard_Data Function ", error);
  }
}

/////API function for fetch Address Data/////////////
function* handleFetchAddressData({ token, setLoading, dispatch, navigate }) {
  try {
    setLoading(true);
    const response = yield call(
      fetch,
      `${BaseUrl}${EndPoints.get_all_addresses}`,
      {
        method: "GET",
        headers: { Authentication: token },
      }
    );

    const addressData = yield response.json();

    if (addressData?.status) {
      setLoading(false);
      yield put({ type: SET_ADDRESS_DATA, payload: addressData?.data });
    } else if (
      response?.status == "401" ||
      response?.status == "403" ||
      response?.message === "Unauthorized"
    ) {
      setLoading(false);
      navigate("/");
      dispatch(logoutHandlerAction());
      dispatch(clearOrderDataHandler());
    } else {
      setLoading(false);
    }
  } catch (error) {
    setLoading(false);
    console.error("Frontend Error: handleFetchAddressData Function ", error);
  }
}

//////////////// API Function For Reset Password //////////////////

function* handleRemoveAddressData({ payload, meta }) {
  const { token, id } = payload;
  const { setremoveDataloading, dispatch, navigate , setLoading } = meta;

  setremoveDataloading(true);

  try {
    const resetPassResponse = yield call(
      fetch,
      `${BaseUrl}${EndPoints.remove__address}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authentication: token,
        },
        body: JSON.stringify({
          address_id: id,
        }),
      }
    );
    const response = yield resetPassResponse.json();

    if (response?.status) {
      setremoveDataloading(false);
      // dispatch(handlelocallyRemoveAddressId(id));
      dispatch(handleGetAddressData(token, setLoading, dispatch, navigate));
      MyToast(response?.message, "success");
      toast.clearWaitingQueue();
    } else if (
      response?.status == "401" ||
      response?.status == "403" ||
      response?.message === "Unauthorized"
    ) {
      setLoading(false);
      navigate("/");
      dispatch(logoutHandlerAction());
      dispatch(clearOrderDataHandler());
    }else {
      setremoveDataloading(false);
      MyToast(response?.message, "error");
      toast.clearWaitingQueue();
    }
  } catch (err) {
    setremoveDataloading(false);
    console.log("catch err", err);
  }
}

//////////////// API Function For Reset Password //////////////////

function* handleResetPass({ data, setLoading, navigate, passwordToken }) {
  setLoading(true);
  try {
    const resetPassResponse = yield call(
      fetch,
      `${BaseUrl}${EndPoints.resetPassword}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: passwordToken,
        },
        body: JSON.stringify({
          password: data?.password,
          password_confirmation: data?.confirmpassword,
          token: passwordToken,
        }),
      }
    );
    const response = yield resetPassResponse.json();

    if (response?.status) {
      setLoading(false);
      yield put({ type: SET_RESET_PASSWORD, payload: response });
      MyToast(response?.message, "success");
      toast.clearWaitingQueue();
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } else {
      setLoading(false);
      MyToast(response?.message, "error");
      toast.clearWaitingQueue();
    }
  } catch (err) {
    setLoading(false);
    MyToast(err, "error");
    toast.clearWaitingQueue();
  }
}

function* handleCartUpdate({ payload, meta }) {
  const { cartItems } = payload;
  const { setIsLoading, dispatch, navigate } = meta;

  const token = yield select((state) => state.AuthReducerData.loginUser?.token);
  if (!token) {
    navigate("/login");
    return;
  }

  const myHeaders = {
    "Content-Type": "application/json",
    Authentication: token,
  };

  const formattedCart = {
    cart: cartItems,
  };

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(formattedCart),
  };

  try {
    const response = yield fetch(`${BaseUrl}${EndPoints.cart}`, requestOptions);
    const responseData = yield response.json();

    if (responseData?.status) {
      yield put(fetchOrderDataRequest(token));
      yield put(CartUpdatingSuccess(responseData.data.cart));
      setIsLoading(false);
    } else if (response?.status == "401" || response?.status == "403") {
      navigate("/");
      dispatch(logoutHandlerAction());
      dispatch(clearOrderDataHandler());
    } else {
      MyToast(responseData?.message || "Please update cart", "error");
      navigate("/");
    }
  } catch (error) {
    MyToast(
      error?.message || "please login again and add products in cart",
      "error"
    );
    navigate("/");
  }
}

function* subscribeToNewsletterSaga(action) {
  const email = action.payload;
  const dispatch = action.payload;
  const setError = action.setError;
  const setSuccess = action.setSuccess;
  const formData = new FormData();
  formData.append("email", email);

  try {
    const updateResponse = yield call(
      fetch,
      `${BaseUrl}${EndPoints.subscribeToNewsletterApiEndpoint}`,
      {
        method: "POST",
        body: formData,
      }
    );

    const response = yield updateResponse.json();

    if (response?.status) {
      setSuccess("You are subscribed successfully");
      dispatch(handleGetWorkQueue());
      setError("");
    } else {
      setError(response.message);
      setSuccess("");
    }
  } catch (error) {
    setError(error.message);
  }
}

function* handleGuestLogin(action) {
  const { guestEmail, guestCart } = action.payload;

  const postData = {
    email: guestEmail,
    cart: guestCart,
    is_guest: "GUEST",
  };

  try {
    const resetPassResponse = yield call(
      fetch,
      `${BaseUrl}${EndPoints.guest_login}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      }
    );
    const response = yield resetPassResponse.json();
    if (response?.status) {
      yield put(guestLoginSuccess(response?.data));
    } else {
      yield put(guestLoginFailure(response?.message));
    }
  } catch (err) {}
}

/////////////////// Function For GET SITE SETTINGS API ////////////////
function* fetchSiteSettings() {
  try {
    const response = yield call(
      axios.get,
      `${BaseUrl}${EndPoints.siteSettings}`
    );
    const settingsResponse = response?.data?.data;
    if (response?.status) {
      yield put({ type: SET_SITESETTINGS, payload: settingsResponse });
    } else {
    }
  } catch (error) {
    console.error("Frontend Error: fetchSiteSettings Function", error);
  }
}

/////////////////// Function For WORK QUEUE API ////////////////
function* fetchWorkQueue() {
  try {
    const response = yield call(axios.get, `${BaseUrl}${EndPoints.work_queue}`);
  } catch (error) {
    console.error("Frontend Error: fetchWorkQueue Function", error);
  }
}

function* AuthSaga() {
  yield takeEvery(REGISTER_USER, handleRegister);
  yield takeEvery(LOGIN_REQUESTING, handleLogin);
  yield takeEvery(FORGOT_PASSWORD, handleForgotPass);
  // yield takeEvery(GUEST_LOGIN_REQUESTING, handleGuestLogin);
  yield takeEvery(SUBSCRIBE_TO_NEWSLETTER, subscribeToNewsletterSaga);
  yield takeEvery(RESET_PASSWORD, handleResetPass);
  yield takeEvery(UPDATING_CART, handleCartUpdate);
  yield takeEvery(GET_SITESETTINGS, fetchSiteSettings);
  yield takeEvery(GET_WORKQUEUE, fetchWorkQueue);
  yield takeEvery(UPDATE_INFO, handleUpdate);
  yield takeEvery(GET_DASHBOARD_DATA, handleDashboard_Data);
  yield takeEvery(GET_ADDRESS_DATA, handleFetchAddressData);
  yield takeEvery(REMOVE_ADDRESS_DATA, handleRemoveAddressData);
}

export default AuthSaga;
