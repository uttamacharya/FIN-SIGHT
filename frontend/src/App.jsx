import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/UseAuth";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Layout from "./components/layout/Layout";
import ThemePage from "./pages/ThemePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Analysis from "./pages/Analysis";
import { useThemeStore } from "./utils/ThemeSelector/UseThemeStore";
import ForgotPassword from "./pages/ForgotPassword";
import OtpReset from "./pages/OtpReset";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const { isAuthenticated } = useAuth();
  const { theme } = useThemeStore();

  return (
    <>
      <div
        className="min-h-screen bg-base-200 transition-colors duration-300"
        data-theme={theme}
      >
        <Routes>
          <Route path="/theme" element={<ThemePage />} />
          <Route
            path="/signup"
            element={
              isAuthenticated ? <Navigate to="/" /> : <Signup/>
            }
            />
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/" /> : <Login />
            }
          />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              isAuthenticated ? <Layout /> : <Navigate to="/login" />
            }
          >
            <Route index element={<Home />} />
            <Route
              path="analysis/:uploadId"
              element={<Analysis />}
            />
          </Route>
          <Route
            path="/forgot-password"
            element={<ForgotPassword/>}
            ></Route>
          <Route
            path="/otp-reset"
            element={<OtpReset/>}
            ></Route>
          <Route
            path="/reset-password"
            element={<ResetPassword/>}
            ></Route>
        </Routes>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
