import {Routes, Route, Navigate} from "react-router-dom"
// import './App.css'
import { useAuth } from './hooks/UseAuth'
import Login from './pages/Login'
import Home from './pages/Home'
import Layout from './components/layout/Layout'
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UploadPages from "./pages/UploadPages"
import Analysis from "./pages/Analysis";


function App() {
  const {isAuthenticated}= useAuth()

  return (
    <>
    <Routes>
      {/* this is public route */}
      <Route
       path="/login"
       element={
        isAuthenticated ? <Navigate to="/" />: <Login/>
       }
      ></Route>
      {/* now protected route */}
      <Route 
        path="/"
        element={
          isAuthenticated ? <Layout/>: <Navigate to="/login" />
        }
      >
        <Route index element={<Home />} />
        <Route path="upload" element={<UploadPages/>}/>
        <Route
          path="analysis/:uploadId"
          element={<Analysis />}
        />
      </Route>
    </Routes>
    <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
