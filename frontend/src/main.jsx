import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from "./routes/router.jsx";
import {Provider} from "react-redux";
import store from "./redux/store.js";
import {Toaster} from "react-hot-toast";
import AppWrapper from "./utils/AppWrapper.jsx";
import {GoogleOAuthProvider} from "@react-oauth/google";
import FabIconUpdator from "./utils/FabIconUpdator.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Provider store={store}>
          <FabIconUpdator/>
          <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <AppWrapper router={router}/>
          </GoogleOAuthProvider>
          <Toaster position="top-center" reverseOrder={false} autoHideDuration={2000}/>
      </Provider>
  </StrictMode>,
)
