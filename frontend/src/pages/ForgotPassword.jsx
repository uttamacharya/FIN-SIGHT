import React from 'react'
import { requestOtp } from '../api/auth.api';
// import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false)
    // const [submitted, setSubmitted] = useState(false)
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email) {
            toast.error("Email is required")
            return
        }
        setLoading(true)
        try {
            await requestOtp({ email })
            // setSubmitted(true)
            toast.success("If the account exists, a reset link has been sent")
            navigate("/otp-reset", { state: { email } })
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to send OTP"
            toast.error(msg);
        }
        finally {
            setLoading(false)
        }
    }
    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="card w-full max-w-sm bg-white shadow-lg rounded-xl">
                    <div className="card-body">
                        <h2 className="text-2xl font-bold text-center mb-4">
                            Forgot Password
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="input input-bordered w-full"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />

                            <button className="btn btn-primary w-full" disabled={loading}>
                                {loading ? "Sending OTP..." : "Send OTP"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword