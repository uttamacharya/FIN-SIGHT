import React from 'react'
import { forgetPassword } from '../api/auth.api'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useState } from 'react';
function ForgotPassword() {
    const[email, setEmail]= useState('');
    const [loading, setLoading]=useState(false)
    const [submitted, setSubmitted]=useState(false)

    const handleSubmit= async (e)=>{
        e.preventDefault()
        if(!email){
            toast.error("Email is required")
            return
        }
        setLoading(true)
        try {
            await forgetPassword({email})
            setSubmitted(true)
            toast.success("If the account exists, a reset link has been sent")
        } catch (error) {
            const msg=error.response?.data?.message || "Something went wrong"
            toast.error(msg);
        }
        finally{
            setLoading(false)
        }
    }
  return (
    <>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="card w-full max-w-sm bg-white shadow-lg rounded-xl">
            <div className="card-body">
                <h2 className="text-2xl font-bold text-gray-900  text-center mb-4">Reset Password</h2>
                {!submitted ? (
                    <form
                     onSubmit={handleSubmit}                  className='space-y-4'>
                        <input
                         type="email"
                         placeholder='Enter Your Email'
                         value={email}
                         onChange={(e)=>setEmail(e.target.value)}
                         required
                         className="input input-bordered w-full" />

                         <button
                          className='btn btn-primary w-full'
                          type='submit'
                          disabled={loading}
                          >
                            {loading ? "Sending...": "Send reset link"}
                          </button>
                    </form>
                ) : (
                    <div className='text-center space-y-4'>
                        <p className='text-gray-700'>Please Check Your Email for the password reset link </p>
                        <p className='text-sm'>
                            Didn't receive the email
                            <Link to="/otp-reset"
                              className='text-blue-500 ml-1 hover:underline'>
                                Try OTP instead
                              </Link>
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>
    </>
  )
}

export default ForgotPassword