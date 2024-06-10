import React from "react";
import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.css";
// import "../src/components/css/globalStyle.css";
import "../src/Styles/globalStyles.css";
import "react-phone-input-2/lib/style.css";
import App from "./App";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
// import Modal from "react-modal";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import "../src/Styles/nice-select.css";
import "../src/Styles/font.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
// import '../src/i18n/i18n'

// Modal.setAppElement("#root");
ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider
    clientId={
      "1044253076537-9eo62hjcfhosb639ng9054tkg7vh9sid.apps.googleusercontent.com"
    }
  >
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </GoogleOAuthProvider>
);
