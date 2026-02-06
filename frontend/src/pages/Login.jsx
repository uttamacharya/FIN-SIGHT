import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { useAuth } from "../hooks/UseAuth";
import { loginApi } from "../api/auth.api";
import { toast } from "react-toastify";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFieldErrors([]);

    try {
      const res = await loginApi({ email, password });

      login({
        user: res.data.user,
        accessToken: res.data.accessToken,
      });

      toast.success("Login successful 🎉");
      navigate("/");
    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

      toast.error(backendMessage);
      setFieldErrors(err.response?.data?.errors || []);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 to-indigo-100">
      <div className="card w-full max-w-sm shadow-lg bg-white rounded-2xl">
        <div className="card-body">
          <h2 className="text-3xl font-bold mb-4 text-gray-600 flex justify-center items-center gap-2">
            <LogIn /> Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL */}
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered w-full pl-10"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input input-bordered w-full pl-10"
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full flex items-center gap-2"
              disabled={loading}
            >
              <LogIn size={18} />
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {fieldErrors.length > 0 && (
            <ul className="mt-4 space-y-2">
              {fieldErrors.map((e, i) => (
                <li key={i} className="alert alert-error">
                  {e.field} : {e.message}
                </li>
              ))}
            </ul>
          )}

          <p className="text-center mt-4 text-sm">
            Don’t have an account?
            <Link to="/signup" className="text-blue-600 ml-1 hover:underline">
              Signup
            </Link>
          </p>
          <p className="text-center mt-4 text-sm">
            forgot Password
            <Link to="/forgot-password" className="text-blue-600 ml-1 hover:underline">
              Forgot Password
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
