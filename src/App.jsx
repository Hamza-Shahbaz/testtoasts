import { useCallback, useEffect, useState, lazy, Suspense } from "react";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "../src/Styles/responsive.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { handleGetSiteSettings } from "./redux/actions/AuthAction";
import NoInternet from "./components/Toast/NoInternet";
import { GET_FAVORITES } from "./redux/constant/constants";
import loader from "./assets/images/loader.gif";
import AppRoutes from "./Routes";

// const AppRoutes = lazy(() => import("./Routes"));

function App() {
  const dispatch = useDispatch();
  const [status, setStatus] = useState(true);

  useEffect(() => {
    dispatch(handleGetSiteSettings());
    dispatch({ type: GET_FAVORITES });
  }, [dispatch]);

  const listeners = useCallback(() => {
    window.addEventListener("online", () => setStatus(true));
    window.addEventListener("offline", () => setStatus(false));
    return () => {
      window.removeEventListener("online", () => setStatus(true));
      window.removeEventListener("offline", () => setStatus(false));
    };
  }, []);

  useEffect(() => {
    listeners();
  }, [listeners]);

  const Loader = () => (
    <div style={loaderStyle}>
      <img src={loader} alt="Loading..." style={{ width: "100px" }} />
    </div>
  );

  const loaderStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  };

  return (
    <>
      <Header />
        {status ? <AppRoutes /> : <NoInternet />}
      <Footer />
      <ToastContainer limit={1} />
    </>
  );
}

export default App;
