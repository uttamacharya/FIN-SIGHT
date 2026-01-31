import React from 'react'
import { useState } from 'react'
import { useAuth } from "../hooks/UseAuth"
import { loginApi } from "../api/auth.api"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState([])
  const navigate= useNavigate();
  const handleSubmit = async (e) => {
    console.log("submit clicked")
    e.preventDefault()
    setLoading(true)
    // setEmail(null)
    try {
      const res = await loginApi({ email, password });
      login({
        user: res.data.user,
        accessToken: res.data.accessToken
      })
      toast.success("Login successfull")
      setTimeout(()=>{
         console.log("NAVIGATING TO HOME");
        navigate("/")
      },2000)
    } catch (err) {
      const backendMessage =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";
      toast.error(backendMessage)
      const backendErrors = err.response?.data?.errors || []

      setError(backendMessage);
      if (backendErrors.length > 0) {
        setFieldErrors(backendErrors);

        setTimeout(() => {
          setFieldErrors([]);
        }, 3000);
      }

    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-300 to-indigo-100">
        <div className="card w-full max-w-sm shadow-black shadow-lg bg-gradient-to-tr backdrop-blur-2xl  rounded-2xl">
          <div className="card-body">
            <h2 className='text-3xl  font-bold mb-3 text-gray-500 justify-center
                 card-title'>Login</h2>
            <form onSubmit={handleSubmit} >
              <div>
                <label htmlFor='email' className='block  mb-2 pb-1 font-medium text-xl text-gray-800 '>Enter your Email...</label>
                <input
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-base-300 focus:border-base-300 outline-none transition-all focus:bg-white duration-400 placeholder-gray-400 text-gray-900'
                  type='email'
                  placeholder='exemple@gmail.com'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor='password' className='block text-xl mb-b font-medium text-gray-800 mt-4 mb-2 '>Password</label>
                <input
                  className='w-full px-4 py-3 border border-gray-300
                   focus:bg-white rounded-lg placeholder-gray-400 text-gray-900'
                  type='password'
                  placeholder='Enter your password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type='submit'
                className='btn block mt-6 w-full'
                disabled={loading}> {loading ? "Logging in..." : "Login"}</button>

            </form>
            {fieldErrors.length > 0 && (
              <ul >
                {
                  fieldErrors.map((e, i) => (
                    <li key={i} className='alert alert-error mt-4'>
                      {e.field} : {e.message}

                    </li>
                  ))
                }
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Login